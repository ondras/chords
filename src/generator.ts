import { Instrument, Chord, Tone, Finger, Layout, Barre, TONES } from "./core.js";
import { cartesianProduct } from "./util.js";

const MAX_FRET = 3;
const AVAILABLE_FINGERS = 4;

function sum(arr: number[]) { return arr.reduce((a, b) => a+b, 0); }
function min(arr: number[]) { return Math.min(...arr); }
function max(arr: number[]) { return Math.max(...arr); }

function fingerCount(layout: Layout) {
	if (layout.barre) {
		const barre = layout.barre;
		return 1 + layout.fingers.filter(f => f > barre.fret).length;
	} else {
		return layout.fingers.filter(f => f > 0).length;
	}
}

function canBePlayed(layout: Layout) {
	if (fingerCount(layout) > AVAILABLE_FINGERS) { return false; }

	const barre = layout.barre;
	if (!barre) { return true; }

	for (let s=barre.from; s<layout.fingers.length; s++) {
		if (layout.fingers[s] < 1) { return false; } // inside barre, but empty or none requested -> bail out
	}

	return true;
}

function computeBarre(fingers: Finger[]): Barre | null {
	let realFingers = fingers.filter(f => f > 0); // true fingers used
	let fingerCount = realFingers.length;
	if (fingerCount <= AVAILABLE_FINGERS) { return null; } // no need

	let fret = min(realFingers); // lowest used fret
	let minCount = realFingers.filter(f => f == fret).length;

	if (minCount == 1) { return null; } // only one tone at the lowest fret

	// count barre props
	let from = -1;
	fingers.forEach((f, i) => { // the lowest string participating in a barre
		if (f == fret && from == -1) { from = i; }
	});

	return { fret, from };
}


function COMPARE(a: Layout, b: Layout) {
	let m1 = max(a.fingers);
	let m2 = max(b.fingers);
	return (m1 == m2 ? sum(a.fingers) - sum(b.fingers) : m1 - m2);
}

interface Context {
	rootFound: boolean;
}
function fingersOnString(string: Tone, chord: Chord, startFret: number, ctx:Context) {
	let result = new Set<Finger>();
	let frets = [0];
	for (let i=0; i<MAX_FRET; i++) { frets.push(startFret + i); }

	frets.forEach(fret => {
		let t = (string + fret) % TONES;
		let index = chord.tones.indexOf(t);
		if (index == -1) { return; }

		if (ctx.rootFound) {
			result.add(fret);
		} else if (index == 0) {
			ctx.rootFound = true;
			result.add(fret);
		}
	});

	if (result.size == 0) { result.add(-1); }

	return result;
}

function hasAllTones(layout: Layout, instrument: Instrument, chord: Chord) {
	let tones = new Set<Tone>(chord.tones);
	layout.fingers.forEach((f, i) => {
		if (f == -1) { return; }
		let tone = (f + instrument[i]) % TONES;
		tones.delete(tone);
	});
	return (tones.size == 0);
}

function expandRedundantTones(layout: Layout, instrument: Instrument): Layout | Layout[] {
	if (fingerCount(layout) <= AVAILABLE_FINGERS) { return layout; }

	let toneToStrings = new Map<Tone, number[]>();

	layout.fingers.forEach((f, i) => {
		if (f < 1) { return; }
		let tone = (f + instrument[i]) % TONES;
		let strings = toneToStrings.get(tone) || [];
		strings.push(i);
		toneToStrings.set(tone, strings);
	});

	let results: Layout[] = [];

	toneToStrings.forEach(strings => {
		if (strings.length < 2) { return; }
		strings.forEach(string => {
			let altFingers = layout.fingers.slice();
			altFingers[string] = -1;

			let alternative: Layout = {
				fingers: altFingers,
				barre: layout.barre
			}
			results.push(alternative);
		});
	});

	return results;
}

export function createLayouts(instrument: Instrument, chord: Chord, startFret = 1): Layout[] {
	let ctx = {rootFound:false};	
	let fingers = instrument.map(string => fingersOnString(string, chord, startFret, ctx));

	function createLayout(fingers: Finger[]) {
		let barre = computeBarre(fingers);
		return {fingers, barre, chord};
	}

	function hAT(layout: Layout) { return hasAllTones(layout, instrument, chord); }
	function eRT(layout: Layout) { return expandRedundantTones(layout, instrument); }

	return cartesianProduct(fingers)
		.map(createLayout)
		.filter(hAT)
		.flatMap(eRT)
		.filter(canBePlayed)
		.sort(COMPARE);
}

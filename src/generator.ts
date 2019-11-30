import { Instrument, Chord, Tone, Finger, Instance, TONES } from "./core.js";

const MAX_FRET = 3;
const AVAILABLE_FINGERS = 4;

function sum(arr: number[]) { return arr.reduce((a, b) => a+b, 0); }
function min(arr: number[]) { return Math.min(...arr); }
function max(arr: number[]) { return Math.max(...arr); }

function canBeHeld(instance: Instance) {
	const fingers = instance.fingers;

	let realFingers = fingers.filter(f => f > 0); // true fingers used
	let fingerCount = realFingers.length;

	let minFret = min(realFingers); // lowest used fret
	let minCount = realFingers.filter(f => f == minFret).length;

	// barre: when there are not enough fingers but more than one hold the first fret
	let isBarre = (minCount > 1 && fingerCount > AVAILABLE_FINGERS);

	if (isBarre) {
		let barreLastString = -1;
		fingers.forEach((f, i) => { // the lowest string participating in a barre
			if (f == minFret && barreLastString == -1) { barreLastString = i; }
		});

		for (let s=barreLastString; s<fingers.length; s++) {
			if (fingers[s] < 1) { return false; } // barre, but empty or none requested -> bail out
		}
	}

	return true;
}


function COMPARE(f1: Finger[], f2: Finger[]) {
	let m1 = max(f1);
	let m2 = max(f2);
	return (m1 == m2 ? sum(f1) - sum(f2) : m1 - m2);
}

interface Context {
	rootFound: boolean;
}
function fingersOnString(string: Tone, chord: Chord, startFret: number, ctx:Context) {
	let result: number[] = [];
	let frets = [0];
	for (let i=0; i<MAX_FRET; i++) { frets.push(startFret + i); }

	frets.forEach(fret => {
		let t = (string + fret) % TONES;
		let index = chord.tones.indexOf(t);
		if (index == -1) { return; }

		if (ctx.rootFound) {
			result.push(fret);
		} else if (index == 0) {
			ctx.rootFound = true;
			result.push(fret);
		}
	});

	return result;
}

function createFingerCombinations(fingers: Finger[][]): Finger[][] {
	if (fingers.length == 0) { return [[]]; }

	let current = fingers[0];
	let remaining = fingers.slice(1);
	if (current.length == 0) { current = [-1]; }

	return current.flatMap(finger => {
		 return createFingerCombinations(remaining).map(remaining => [finger].concat(remaining));
	});
}

function hasAllTones(instance: Instance) {
	let tones = new Set<Tone>(instance.chord.tones);
	instance.fingers.forEach((f, i) => {
		if (f == -1) { return; }
		let tone = (f + instance.instrument[i]) % TONES;
		tones.delete(tone);
	});
	return (tones.size == 0);
}

export function createInstances(instrument: Instrument, chord: Chord, startFret = 1): Instance[] {
	let ctx = {rootFound:false};
	let fingers = instrument.map(string => fingersOnString(string, chord, startFret, ctx));

	function createInstance(fingers: Finger[]) {
		return {fingers, instrument, chord};
	}

	return createFingerCombinations(fingers)
		.sort(COMPARE)
		.map(createInstance)
		.filter(hasAllTones)
		.filter(canBeHeld);
}

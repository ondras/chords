import { Instrument, Chord, Tone, Finger, SEMITONES } from "./core.js";

const MAX_FRET = 3;

function sum(arr: number[]) {
	return arr.reduce((a, b) => a+b, 0);
}

function max(arr: number[]) { return Math.max(...arr); }

function COMPARE(f1: Finger[], f2: Finger[]) {
	let m1 = max(f1);
	let m2 = max(f2);
	return (m1 == m2 ? sum(f1) - sum(f2) : m1 - m2);
}

interface Context {
	rootFound: boolean;
}
function fingersOnString(string: Tone, chord: Chord, ctx:Context) {
	let result = [];
	for (let i=0; i<=MAX_FRET;i++) {
		let t = (string + i) % SEMITONES;
		let index = chord.indexOf(t);
		if (index == -1) { continue; }

		if (ctx.rootFound) {
			result.push(i);
		} else if (index == 0) {
			ctx.rootFound = true;
			result.push(i);
		}
	}

	return (result.length > 0 ? result : [-1]);
}

function createFingerCombinations(fingers: Finger[][]): Finger[][] {
	if (fingers.length == 0) { return [[]]; }

	let current = fingers[0];
	let remaining = fingers.slice(1);

	return current.flatMap(finger => {
		 return createFingerCombinations(remaining).map(remaining => [finger].concat(remaining));
	});
}

export function createInstances(instrument: Instrument, chord: Chord, offset: number) {
	let offsetStrings = instrument.map(string => (string+offset)%SEMITONES);

	let ctx = {rootFound:false};
	let fingers = offsetStrings.map(string => fingersOnString(string, chord, ctx));

	function createInstance(fingers: Finger[]) {
		return {fingers, instrument, offset};
	}

	return createFingerCombinations(fingers).sort(COMPARE).map(createInstance);
}

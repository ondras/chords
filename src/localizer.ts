import { Tone, Chord, createChord, TONES } from "./core.js";
import { assert, stripTags } from "./util.js";

export interface Localizer {
	toneToString(tone: Tone): string;
	stringToTone(tone: string): Tone;
	chordToString(chord: Chord): string;
	stringToChord(str: string): Chord | null;
}

type Bases = {[tone:string]: string};

const BASES: {[naming:string]: Bases} = {};
BASES["english"] = {"0": "C", "2": "D", "4": "E", "5": "F", "7": "G", "9": "A", "10": "B♭", "11": "B"};
BASES["german"] = Object.assign({}, BASES["english"], {"10": "B", "11": "H"});

const CHORDS: {[type:string]: string} = {
	"major": "",
	"maj6": "<sup>6</sup>",
	"dom7": "<sup>7</sup>",
	"maj7": "maj<sup>7</sup>",
	"aug": "+",
	"aug7": "+<sup>7</sup>",
	"dom9": "<sup>9</sup>",

	"minor": "mi",
	"min6": "mi<sup>6</sup>",
	"min7": "mi<sup>7</sup>",
	"min/maj7": "mi/maj<sup>7</sup>",
	"dim": "dim",
	"dim7": "dim<sup>7</sup>",
	"m7b5": "mi<sup>7/5-</sup>"
}

function parseTone(str: string, bases: Bases) {
	let base: number | undefined;

	let first = str.charAt(0);
	for (let p in bases) {
		if (bases[p] == first.toUpperCase()) { base = Number(p); }
	}
	if (base === undefined) { throw new Error(`Cannot parse the base tone "${first}"`); }

	let i=0;
	while (++i < str.length) {
		let a = str.charAt(i); 
		switch (a) {
			case "#":
			case "♯":
				base += 1;
			break;

			case "b":
			case "♭":
				base -= 1;
			break;

			default: throw new Error(`Cannot parse accidental "${a}"`); break;
		}
	}

	return (base + TONES) % TONES;
}

function serializeTone(tone: Tone, bases: Bases) {
	if (tone in bases) { return bases[tone]; }

	tone -= 1;
	assert(tone in bases, `Tone "${tone}" is unserializable`);

	return `${bases[tone]}♯`;
}

export function create(naming: string): Localizer {
	assert(naming in BASES, `Naming "${naming}" not found`);
	const bases = BASES[naming];

	function toneToString(tone: Tone) { return serializeTone(tone, bases); }
	function stringToTone(name: string) { return parseTone(name, bases); }

	function chordToString(chord: Chord) {
		let base = toneToString(chord.base);
		let type = CHORDS[chord.type];
		return `${base}${type}`;
	}

	function stringToChord(str: string) {
		let parts = str.match(/^(.[#♯b♭]?)(.*)/);
		if (parts == null) { return null; }

		let base = stringToTone(parts[1]);
		for (let type in CHORDS) {
			let suffix = stripTags(CHORDS[type]);
			if (suffix == parts[2]) { return createChord(type, base); }
		}

		return null;
	}

	return {toneToString, stringToTone, chordToString, stringToChord};
}

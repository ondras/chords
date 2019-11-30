import { Tone, Chord } from "./core.js";
import { assert } from "./util.js";

export interface Localizer {
	toneToString(tone: Tone): string;
	stringToTone(tone: string): Tone;
	chord(chord: Chord): string;
}

const NAMES: {[name:string]: string[]} = {
	"cs": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "B", "H"],
	"en": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "Bb", "B"]
};

const CHORDS: {[type:string]: string} = {
	"major": "",
	"maj6": "⁶",
	"dom7": "⁷",
	"maj7": "maj⁷",
	"aug": "+",
	"aug7": "+⁷",
	"dom9": "⁹",

	"minor": "mi",
	"min6": "mi⁶",
	"min7": "mi⁷",
	"min/maj7": "mi/maj⁷",
	"dim": "dim",
	"dim7": "dim⁷",
	"m7b5": "mi⁷/⁵⁻"
}

export function create(locale: string): Localizer {
	assert(locale in NAMES, `Locale "${locale}" not found`);
	const dict = NAMES[locale];

	function toneToString(tone: Tone) { return dict[tone]; }
	function stringToTone(name: string) {
		let index = dict.indexOf(name);
		assert(index > -1, `Name "${name}" not found in locale "${locale}"`);
		return index;
	}

	function chord(chord: Chord) {
		let base = toneToString(chord.base);
		let type = CHORDS[chord.type];
		return `${base}${type}`;
	}

	return {toneToString, stringToTone, chord};
}

import { assert, Tone } from "./core.js";

export interface Localizer {
	toneToString(tone: Tone): string;
	stringToTone(tone: string): Tone;
}

const NAMES: {[name:string]: string[]} = {
	"cs": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "B", "H"],
	"en": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "Bb", "B"]
};

export function create(locale: string): Localizer {
	assert(locale in NAMES, `Locale "${locale}" not found`);
	const dict = NAMES[locale];

	function toneToString(tone: Tone) { return dict[tone]; }
	function stringToTone(name: string) {
		let index = dict.indexOf(name);
		assert(index > -1, `Name "${name}" not found in locale "${locale}"`);
		return index;
	}

	return {toneToString, stringToTone};
}

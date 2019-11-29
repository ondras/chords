import { assert } from "./util.js";
const NAMES = {
    "cs": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "B", "H"],
    "en": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "Bb", "B"]
};
const CHORDS = {
    "major": "",
    "maj6": "⁶",
    "dom7": "⁷",
    "maj7": "maj⁷",
    "aug": "+",
    "aug7": "+⁷",
    "minor": "mi",
    "min6": "mi⁶",
    "min7": "mi⁷",
    "min/maj7": "mi/maj⁷",
    "dim": "dim",
    "dim7": "dim⁷",
    "m7b5": "mi⁷/⁵⁻"
};
export function create(locale) {
    assert(locale in NAMES, `Locale "${locale}" not found`);
    const dict = NAMES[locale];
    function toneToString(tone) { return dict[tone]; }
    function stringToTone(name) {
        let index = dict.indexOf(name);
        assert(index > -1, `Name "${name}" not found in locale "${locale}"`);
        return index;
    }
    function chord(chord) {
        let base = toneToString(chord.base);
        let type = CHORDS[chord.type];
        return `${base}${type}`;
    }
    return { toneToString, stringToTone, chord };
}

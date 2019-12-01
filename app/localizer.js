import { createChord } from "./core.js";
import { assert, stripTags } from "./util.js";
const NAMES = {
    "cs": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "B", "H"],
    "en": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "Bb", "B"]
};
const CHORDS = {
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
    function chordToString(chord) {
        let base = toneToString(chord.base);
        let type = CHORDS[chord.type];
        return `${base}${type}`;
    }
    function stringToChord(str) {
        let parts = str.match(/^(.[#b]?)(.*)/);
        if (parts == null) {
            return null;
        }
        let base = stringToTone(parts[1]);
        for (let type in CHORDS) {
            let suffix = stripTags(CHORDS[type]);
            if (suffix == parts[2]) {
                return createChord(type, base);
            }
        }
        return null;
    }
    return { toneToString, stringToTone, chordToString, stringToChord };
}

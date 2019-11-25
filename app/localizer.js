import { assert } from "./core.js";
const NAMES = {
    "cs": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "B", "H"],
    "en": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "Bb", "B"]
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
    return { toneToString, stringToTone };
}

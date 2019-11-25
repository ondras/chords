import { assert } from "./core.js";
const NAMES = {
    "cs": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "B", "H"],
    "en": ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "Bb", "B"]
};
export function localize(locale, tone) {
    assert(locale in NAMES, `Locale "${locale}" not found`);
    return NAMES[locale][tone];
}
export function delocalize(locale, name) {
    assert(locale in NAMES, `Locale "${locale}" not found`);
    let index = NAMES[locale].indexOf(name);
    assert(index > -1, `Name "${name}" not found in locale "${locale}"`);
    return index;
}

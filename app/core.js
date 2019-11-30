import { assert } from "./util.js";
export const TONES = 12;
const CHORDS = {
    "major": [0, 4, 7],
    "maj6": [0, 4, 7, 9],
    "dom7": [0, 4, 7, 10],
    "maj7": [0, 4, 7, 11],
    "aug": [0, 4, 8],
    "aug7": [0, 4, 8, 10],
    "dom9": [0, 4, 8, 10, 2],
    "minor": [0, 3, 7],
    "min6": [0, 3, 7, 9],
    "min7": [0, 3, 7, 10],
    "min/maj7": [0, 3, 7, 11],
    "dim": [0, 3, 6],
    "dim7": [0, 3, 6, 9],
    "m7b5": [0, 3, 6, 10]
};
export function createChord(type, base) {
    assert(type in CHORDS, `Chord "${type}" not found`);
    return {
        type,
        base,
        tones: CHORDS[type].map(tone => (tone + base) % TONES)
    };
}

export const SEMITONES = 12;
const CHORDS = {
    "major": [0, 4, 7],
    "maj6": [0, 4, 7, 9],
    "dom7": [0, 4, 7, 10],
    "maj7": [0, 4, 7, 11],
    "aug": [0, 4, 8],
    "aug7": [0, 4, 8, 10],
    "minor": [0, 3, 7],
    "min6": [0, 3, 7, 9],
    "min7": [0, 3, 7, 10],
    "min/maj7": [0, 3, 7, 11],
    "dim": [0, 3, 6],
    "dim7": [0, 3, 6, 9],
    "m7b5": [0, 3, 6, 10]
};
export function assert(assertion, label) {
    if (!assertion) {
        throw new Error(label);
    }
}
export function createChord(chord, base) {
    assert(chord in CHORDS, `Chord "${chord}" not found`);
    return CHORDS[chord].map(tone => (tone + base) % SEMITONES);
}

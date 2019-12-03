import { Finger, Barre } from "./core.js";
import { Chord } from "./chords.js";
export interface Layout {
    fingers: Finger[];
    barre: Barre | null;
}
export declare function create(instrumentName: string, chord: Chord, startFret?: number): Layout[];

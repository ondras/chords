import { Chord } from "./chords.js";
export declare type Finger = number;
export interface Barre {
    fret: Finger;
    from: number;
}
export interface Layout {
    fingers: Finger[];
    barre: Barre | null;
}
export declare function create(instrumentName: string, chord: Chord, startFret?: number): Layout[];

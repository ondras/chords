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
interface Options {
    startFret: number;
    maxFret: number;
    fingerRange: number;
    strategy: "exact" | "nonempty" | "all";
}
export declare function create(instrumentName: string, chord: Chord, options?: Partial<Options>): Layout[];
export {};

import * as tones from "./tones.js";
export interface Chord {
    type: string;
    tones: tones.Tone[];
    base: tones.Tone;
}
export declare function parse(str: string, naming?: string): {
    type: string;
    base: number;
    tones: number[];
};
export declare function toString(chord: Chord, naming?: string): string;
export declare function transpose(chord: Chord, offset: number): {
    type: string;
    base: number;
    tones: number[];
};
export declare function create(type: string, base: tones.Tone): {
    type: string;
    base: number;
    tones: number[];
};

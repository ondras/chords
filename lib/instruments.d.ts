import * as tones from "./tones.js";
export interface Instrument {
    name: string;
    strings: tones.Tone[];
    mustStartWithTonic: boolean;
}
export declare function get(id: string): Instrument;

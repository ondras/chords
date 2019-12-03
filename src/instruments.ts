import * as tones from "./tones.js";
import { assert } from "./util.js";

let instruments: Map<string, Instrument> = new Map();

export interface Instrument {
	name: string;
	strings: tones.Tone[];
	mustStartWithTonic: boolean;
}

export function get(id: string) {
	assert(instruments.has(id), `Cannot find instrument "${id}"`);
	return instruments.get(id) as Instrument;
}

function define(id: string, instrument: Instrument) {
	instruments.set(id, instrument);
}

function parseGerman(name: string) { return tones.parse(name, "german"); }

define("guitar", {
	name: "Guitar (standard)",
	mustStartWithTonic: true,
	strings: ["E", "A", "D", "G", "H", "E"].map(parseGerman)
});

define("guitar/d", {
	name: "Guitar (drop D)",
	mustStartWithTonic: true,
	strings: ["D", "A", "D", "G", "H", "E"].map(parseGerman)
});

define("ukulele", {
	name: "Ukulele",
	mustStartWithTonic: false,
	strings: ["G", "C", "E", "A"].map(parseGerman)
});

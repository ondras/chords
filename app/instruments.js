import * as tones from "./tones.js";
import { assert } from "./util.js";
let instruments = new Map();
export function get(id) {
    assert(instruments.has(id), `Cannot find instrument "${id}"`);
    return instruments.get(id);
}
function define(id, instrument) {
    instruments.set(id, instrument);
}
function parseGerman(name) { return tones.parse(name, "german"); }
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

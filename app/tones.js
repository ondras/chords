import { assert } from "./util.js";
export const TONES = 12;
const BASES = {};
BASES["english"] = { "0": "C", "2": "D", "4": "E", "5": "F", "7": "G", "9": "A", "10": "B♭", "11": "B" };
BASES["german"] = Object.assign({}, BASES["english"], { "10": "B", "11": "H" });
export function parse(str, naming = "english") {
    assert(naming in BASES, `Naming "${naming}" not found`);
    const bases = BASES[naming];
    let base;
    let first = str.charAt(0);
    for (let p in bases) {
        if (bases[p] == first.toUpperCase()) {
            base = Number(p);
        }
    }
    if (base === undefined) {
        throw new Error(`Cannot parse the base tone "${first}"`);
    }
    let i = 0;
    while (++i < str.length) {
        let a = str.charAt(i);
        switch (a) {
            case "#":
            case "♯":
                base += 1;
                break;
            case "b":
            case "♭":
                base -= 1;
                break;
            default:
                throw new Error(`Cannot parse accidental "${a}"`);
                break;
        }
    }
    return (base + TONES) % TONES;
}
export function toString(tone, naming = "english") {
    assert(naming in BASES, `Naming "${naming}" not found`);
    const bases = BASES[naming];
    if (tone in bases) {
        return bases[tone];
    }
    tone -= 1;
    assert(tone in bases, `Tone "${tone}" is unserializable`);
    return `${bases[tone]}♯`;
}
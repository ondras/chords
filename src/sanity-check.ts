import { chords, tones, layouts } from "./api.js";
import { assertEquals } from "./util.js";


let tone = tones.parse("eb♭#", "german");
assertEquals(tones.toString(tone, "german"), "D♯", "sanity check: tone parsing");

let D = chords.create("major", tones.parse("D"));
let instances = layouts.create("guitar", D);

assertEquals(D.tones.join(""), "269", "sanity check: proper D");
assertEquals(instances.length, 1, "sanity check: instance count");
assertEquals(instances[0].fingers.join(""), "-1-10232", "sanity check: D instance");

console.log("sanity check OK");

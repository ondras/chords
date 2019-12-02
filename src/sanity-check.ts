import { createChord } from "./core.js";
import { assertEquals } from "./util.js";
import { GUITAR } from "./instruments.js";
import * as localizer from "./localizer.js";
import { createLayouts } from "./generator.js";


let naming = localizer.create("german");

let tone = naming.stringToTone("eb♭#");
assertEquals(naming.toneToString(tone), "D♯", "sanity check: tone parsing");

let D = createChord("major", naming.stringToTone("D"));
let instances = createLayouts(GUITAR, D, 1);

assertEquals(D.tones.join(""), "269", "sanity check: proper D");
assertEquals(instances.length, 1, "sanity check: instance count");
assertEquals(instances[0].fingers.join(""), "-1-10232", "sanity check: D instance");

console.log("sanity check OK");

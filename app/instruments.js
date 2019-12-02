import * as localizer from "./localizer.js";
let loc = localizer.create("german");
export const GUITAR = ["E", "A", "D", "G", "H", "E"].map(loc.stringToTone);

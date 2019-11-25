import * as localizer from "./localizer.js";
let cs = localizer.create("cs");
export const GUITAR = ["E", "A", "D", "G", "H", "E"].map(cs.stringToTone);

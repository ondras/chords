import { Instrument } from "./core.js";
import * as localizer from "./localizer.js";

let loc = localizer.create("german");

export const GUITAR: Instrument = ["E", "A", "D", "G", "H", "E"].map(loc.stringToTone);


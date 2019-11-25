import { Instrument } from "./core.js";
import * as localizer from "./localizer.js";

let cs = localizer.create("cs");

export const GUITAR: Instrument = ["E", "A", "D", "G", "H", "E"].map(cs.stringToTone);


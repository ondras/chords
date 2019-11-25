import { Localizer } from "./localizer.js";
import { Instance } from "./core.js";

export function render(instance: Instance, localizer: Localizer) {
	const strings = instance.instrument;
	const fingers = instance.fingers;

	let rows = [];


	rows.push(strings.map(localizer.toneToString).join(""));
	rows.push(fingers.map(f => f > -1 ? f : "X").join(""));
	rows.push("");

	rows.push(fingers.map(_ => "-").join(""));
	let frets = Math.max(...instance.fingers);
	for (let fret = 1; fret <= frets; fret++) {
		let row = fingers.map(f => (f == fret ? "o" : "|"));
		rows.push(row.join(""));
	}
	rows.push(fingers.map(_ => "-").join(""));

	return rows.join("\n");
}

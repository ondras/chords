import { Localizer } from "./localizer.js";
import { Instance } from "./core.js";
import { toRoman, offsetFingers, fretCount } from "./util.js";


export function render(instance: Instance, localizer: Localizer, offset: number) {
	const strings = instance.instrument;
	const fingers = offsetFingers(instance.fingers, offset)

	let rows = [];

	rows.push(localizer.chord(instance.chord));
	rows.push("");

	if (offset > 0) {
		rows.push(`${toRoman(offset).toUpperCase()}.`);
		rows.push("");
	}

	rows.push(strings.map(localizer.toneToString).join(""));
	rows.push(fingers.map(f => f > -1 ? f : "X").join(""));
	rows.push("");

	rows.push(fingers.map(_ => "-").join(""));
	let count = fretCount(fingers);
	for (let fret = 1; fret <= count; fret++) {
		let row = fingers.map(f => (f == fret ? "o" : "|"));
		rows.push(row.join(""));
	}
	rows.push(fingers.map(_ => "-").join(""));

	return rows.join("\n");
}

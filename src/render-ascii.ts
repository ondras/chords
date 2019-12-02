import { Layout } from "./core.js";
import { toRoman, offsetFingers, fretCount, stripTags } from "./util.js";


export function render(layout: Layout, name: string, offset: number) {
	const fingers = offsetFingers(layout.fingers, offset);

	let rows = [];

	name = stripTags(name).replace(/♯/g, "#").replace(/♭/g, "b");
	rows.push(name);
	rows.push("");

	if (offset > 0) {
		rows.push(`${toRoman(offset+1).toUpperCase()}.`);
	}

	rows.push(fingers.map(f => {
		switch (f) {
			case -1: return "x";
			case 0: return "o";
			default: return " ";
		}
	}).join(""));

	rows.push(fingers.map(_ => offset ? "-" : "=").join(""));

	let count = fretCount(fingers);
	for (let fret = 1; fret <= count; fret++) {
		let row = fingers.map((f, i) => {
			if (f == fret) { return "o"; }
			if (layout.barre && layout.barre.fret-offset == fret && layout.barre.from <= i) { return "-"; }
			return "|";
		});
		rows.push(row.join(""));
	}

	return rows.join("\n");
}

import { Layout } from "./layouts.js";
import { toRoman, offsetFingers, fretCount, stripTags } from "./util.js";


export function render(layout: Layout, name: string, offset: number) {
	const fingers = offsetFingers(layout.fingers, offset);

	let rows = [];
	let offsetFill = "";
	let offsetMark = "";
	if (offset > 0) {
		offsetMark = `${toRoman(offset+1).toUpperCase()} `;
		offsetFill = new Array(offsetMark.length+1).join(" ");
	}

	name = stripTags(name).replace(/♯/g, "#").replace(/♭/g, "b");
	rows.push(`${offsetFill}${name}`);
	rows.push("");

	let f = fingers.map(f => {
		switch (f) {
			case -1: return "x";
			case 0: return "o";
			default: return " ";
		}
	}).join("")
	rows.push(`${offsetFill}${f}`);

	let fret = fingers.map(_ => offset ? "-" : "=").join("");
	rows.push(`${offsetFill}${fret}`);

	let count = fretCount(fingers);
	for (let fret = 1; fret <= count; fret++) {
		let prefix = (fret == 1 ? offsetMark : offsetFill);
		let row = fingers.map((f, i) => {
			if (f == fret) { return "o"; }
			if (layout.barre && layout.barre.fret-offset == fret && layout.barre.from <= i) { return "-"; }
			return "|";
		});
		rows.push(`${prefix}${row.join("")}`);
	}

	return rows.join("\n");
}

import { Localizer } from "./localizer.js";
import { Instance } from "./core.js";

const SVGNS = "http://www.w3.org/2000/svg";

const FRET = 32;
const STRING = 16;
const PADDING = 10;
const FINGER = 7;

type Attributes = {[key:string]:string};
function node(name: string, attributes: Attributes = {}) {
	let node = document.createElementNS(SVGNS, name);
	for (let n in attributes) { node.setAttribute(n, attributes[n]); }
	return node;
}

function strings(instance: Instance) {
	const left = PADDING;
	const top = PADDING;
	const length = Math.max(...instance.fingers) * FRET;
	const stroke = "#000";

	let strings = instance.instrument.map((_, i) => {
		return `M ${left + i*STRING} ${top} v ${length}`;
	});

	let d = strings.join(" ");

	return node("path", {d, stroke, "shape-rendering":"crispEdges", "stroke-linecap":"square"});
}

function frets(instance: Instance) {
	const left = PADDING;
	const top = PADDING;
	const length = (instance.instrument.length-1)*STRING;
	const stroke = "#000";

	let frets = [];
	const count = Math.max(...instance.fingers)+1;
	for (let i=0;i<count;i++) {
		frets.push(`M ${left} ${top + i*FRET} h ${length}`);
	}

	let d = frets.join(" ");

	return node("path", {d, stroke, "shape-rendering":"crispEdges", "stroke-linecap":"square"});
}

function fingers(instance: Instance) {
	let frag = document.createDocumentFragment();
	const r = String(FINGER);

	instance.fingers.filter(f => f).map((finger, i) => {
		let cx = String(PADDING + i*STRING);
		let cy = String(PADDING + (finger - 0.5)*FRET);
		return node("circle", {cx, cy, r});
	}).forEach(n => frag.appendChild(n));

	return frag;
}


export function render(instance: Instance, localizer: Localizer) {
	const fretCount = Math.max(...instance.fingers);
	const width = (instance.instrument.length-1)*STRING + 2*PADDING;
	const height = fretCount*FRET + 2*PADDING;

	const viewBox = `0 0 ${width} ${height}`;
	let svg = node("svg", {viewBox, width:String(width), height:String(height)});

	svg.appendChild(strings(instance));
	svg.appendChild(frets(instance));
	svg.appendChild(fingers(instance));

	return svg;
}

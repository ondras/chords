import { Layout } from "./layouts.js";
import { toRoman, offsetFingers, fretCount } from "./util.js";

const SVGNS = "http://www.w3.org/2000/svg";

const PADDING_BASE = 20;
const FRET = 32;
const STRING = 16;
const FINGER = 7;
const FONT_LARGE = 16;
const FONT_SMALL = 10;
const SYMBOL = 6;
const PADDING_LR = PADDING_BASE;
const PADDING_TOP = PADDING_BASE + FONT_LARGE + 2*SYMBOL;

function fixSup(sup: HTMLElement) {
	let tspan = node("tspan", {"dy": String(FONT_LARGE * -0.5), "font-size": String(FONT_LARGE * 0.7)});
	tspan.textContent = sup.textContent;
	sup.parentNode && sup.parentNode.replaceChild(tspan, sup);
}

type Attributes = {[key:string]:string};
function node(name: string, attributes: Attributes = {}) {
	let node = document.createElementNS(SVGNS, name);
	for (let n in attributes) { node.setAttribute(n, attributes[n]); }
	return node;
}

function renderEmptyString(x: number, y: number) {
	const r = SYMBOL/2;
	return node("circle", {cx:String(x), cy:String(y), r:String(r), fill:"none", stroke:"#000", "stroke-width":"1.5"});
}

function renderMuteString(x: number, y: number) {
	const L = SYMBOL;
	const d = `M ${x} ${y} m -${L/2} -${L/2} l ${L} ${L} m ${-L} 0 l ${L} ${-L}`;
	return node("path", {d, stroke:"#000", "stroke-width":"1.5", "stroke-linecap":"round"});
}

function renderName(layout: Layout, name: string) {
	let x = String(PADDING_LR + (layout.fingers.length-1)*STRING/2);
	let y = String(PADDING_BASE + FONT_LARGE/2);

	let nameNode = node("text", {x, y, "text-anchor": "middle", "font-size": String(FONT_LARGE)});
	nameNode.innerHTML = name;

	Array.from<HTMLElement>(nameNode.querySelectorAll("sup")).forEach(fixSup);

	return nameNode;
}

function renderStrings(layout: Layout, fretCount: number) {
	const left = PADDING_LR;
	const top = PADDING_TOP;
	const length = fretCount * FRET;
	const stroke = "#000";

	let strings = layout.fingers.map((_, i) => {
		return `M ${left + i*STRING} ${top} v ${length}`;
	});

	let d = strings.join(" ");

	return node("path", {d, stroke, "shape-rendering":"crispEdges", "stroke-linecap":"square"});
}

function renderFrets(layout: Layout, fretCount: number, offset: number) {
	let frag = document.createDocumentFragment();

	const left = PADDING_LR;
	const top = PADDING_TOP;
	const length = (layout.fingers.length-1)*STRING;
	const stroke = "#000";

	let frets = [];

	for (let i=0;i<=fretCount;i++) {
		frets.push(`M ${left} ${top + i*FRET} h ${length}`);
	}

	let d = frets.join(" ");

	frag.appendChild(node("path", {d, stroke, "shape-rendering":"crispEdges", "stroke-linecap":"square"}));

	if (offset == 0) {
		let d = `M ${left-3} ${top} h ${length+6}`;
		frag.appendChild(node("path", {d, stroke, "stroke-width":"6", "shape-rendering":"crispEdges", "stroke-linecap":"round"}));
	} else {
		let x = String(left - 8);
		let y = String(top + FRET/2 - 2);
		let text = node("text", {x, y, "text-anchor": "end", "dominant-baseline": "middle", "font-size": String(FONT_SMALL)});
		text.textContent = `${toRoman(offset+1).toUpperCase()}`;
		frag.appendChild(text);
	}

	return frag;
}

function renderBarre(layout: Layout, offset: number) {
	let frag = document.createDocumentFragment();
	const barre = layout.barre;

	if (barre) {
		let x = PADDING_LR + barre.from*STRING;
		let y = PADDING_TOP + (barre.fret-offset-0.5) * FRET;
		let length = (layout.fingers.length - barre.from - 1) * STRING;
		let d = `M ${x} ${y} h ${length}`;
		frag.appendChild(node("path", {d, stroke:"#000", "stroke-width":"3", "shape-rendering":"crispEdges", "stroke-linecap":"butt"}));
	}

	return frag;
}

function renderFingers(fingers: number[]) {
	let frag = document.createDocumentFragment();
	const r = String(FINGER);

	const left = PADDING_LR;
	const top = PADDING_TOP;

	fingers.map((finger, i) => {
		const x = left + i*STRING;
		if (finger == -1) {
			return renderMuteString(x, top - SYMBOL * 1.5);
		} else if (finger == 0) {
			return renderEmptyString(x, top - SYMBOL * 1.5);
		}

		const cx = String(x);
		const cy = String(top + (finger - 0.5)*FRET);
		return node("circle", {cx, cy, r});
	}).forEach(n => n && frag.appendChild(n));

	return frag;
}


export function render(layout: Layout, name: string, offset: number) {
	const fingers = offsetFingers(layout.fingers, offset);
	const fc = fretCount(fingers);

	const width = (layout.fingers.length-1)*STRING + 2*PADDING_LR;
	const height = fc*FRET + PADDING_TOP + PADDING_BASE;

	const viewBox = `0 0 ${width} ${height}`;
	let svg = node("svg", {viewBox, width:String(width), height:String(height)});

	svg.appendChild(renderName(layout, name));
	svg.appendChild(renderStrings(layout, fc));
	svg.appendChild(renderFrets(layout, fc, offset));
	svg.appendChild(renderBarre(layout, offset));
	svg.appendChild(renderFingers(fingers));

	return svg;
}

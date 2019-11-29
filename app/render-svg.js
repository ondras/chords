import { toRoman, offsetFingers, fretCount } from "./util.js";
const SVGNS = "http://www.w3.org/2000/svg";
const FRET = 32;
const STRING = 16;
const PADDING = 20;
const FINGER = 7;
const FONT_LARGE = 16;
const FONT_SMALL = 10;
function node(name, attributes = {}) {
    let node = document.createElementNS(SVGNS, name);
    for (let n in attributes) {
        node.setAttribute(n, attributes[n]);
    }
    return node;
}
function name(instance, localizer) {
    let x = String(PADDING + (instance.instrument.length - 1) * STRING / 2);
    let y = String(PADDING + FONT_LARGE / 2);
    let name = node("text", { x, y, "text-anchor": "middle", "font-size": String(FONT_LARGE) });
    name.textContent = localizer.chord(instance.chord);
    return name;
}
function renderStrings(instance, fretCount) {
    const left = PADDING;
    const top = PADDING + FONT_LARGE;
    const length = fretCount * FRET;
    const stroke = "#000";
    let strings = instance.instrument.map((_, i) => {
        return `M ${left + i * STRING} ${top} v ${length}`;
    });
    let d = strings.join(" ");
    return node("path", { d, stroke, "shape-rendering": "crispEdges", "stroke-linecap": "square" });
}
function renderFrets(instance, fretCount, offset) {
    let frag = document.createDocumentFragment();
    const left = PADDING;
    const top = PADDING + FONT_LARGE;
    const length = (instance.instrument.length - 1) * STRING;
    const stroke = "#000";
    let frets = [];
    for (let i = 0; i <= fretCount; i++) {
        frets.push(`M ${left} ${top + i * FRET} h ${length}`);
    }
    let d = frets.join(" ");
    frag.appendChild(node("path", { d, stroke, "shape-rendering": "crispEdges", "stroke-linecap": "square" }));
    if (offset == 0) {
        let d = `M ${left - 3} ${top} h ${length + 6}`;
        frag.appendChild(node("path", { d, stroke, "stroke-width": "6", "shape-rendering": "crispEdges", "stroke-linecap": "round" }));
    }
    else {
        let x = String(left - 3);
        let y = String(top);
        let text = node("text", { x, y, "text-anchor": "end", "dominant-baseline": "middle", "font-size": String(FONT_SMALL) });
        text.textContent = `${toRoman(offset).toUpperCase()}.`;
        frag.appendChild(text);
    }
    return frag;
}
function renderFingers(fingers) {
    let frag = document.createDocumentFragment();
    const r = String(FINGER);
    const left = PADDING;
    const top = PADDING + FONT_LARGE;
    fingers.map((finger, i) => {
        if (finger < 1) {
            return null;
        }
        let cx = String(left + i * STRING);
        let cy = String(top + (finger - 0.5) * FRET);
        return node("circle", { cx, cy, r });
    }).forEach(n => n && frag.appendChild(n));
    return frag;
}
export function render(instance, localizer, offset) {
    const fingers = offsetFingers(instance.fingers, offset);
    const fc = fretCount(fingers);
    const width = (instance.instrument.length - 1) * STRING + 2 * PADDING;
    const height = fc * FRET + 2 * PADDING + FONT_LARGE;
    const viewBox = `0 0 ${width} ${height}`;
    let svg = node("svg", { viewBox, width: String(width), height: String(height) });
    svg.appendChild(name(instance, localizer));
    svg.appendChild(renderStrings(instance, fc));
    svg.appendChild(renderFrets(instance, fc, offset));
    svg.appendChild(renderFingers(fingers));
    return svg;
}

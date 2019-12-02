import { Layout } from "./core.js";

import * as svgRender from "./render-svg.js";
import * as asciiRender from "./render-ascii.js";

function getOffset(layout: Layout) {
	let suitable = layout.fingers.filter(f => f > 0);
	if (Math.max(...suitable) <= 3) { return 0; }
	return Math.min(...suitable)-1;
}

export function ascii(layout: Layout, name: string) {
	let offset = getOffset(layout);
	return asciiRender.render(layout, name, offset);
}

export function svg(layout: Layout, name: string) {
	let offset = getOffset(layout);
	return svgRender.render(layout, name, offset);
}

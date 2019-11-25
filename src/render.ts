import { Localizer } from "./localizer.js";
import { Instance } from "./core.js";

import * as svgRender from "./render-svg.js";
import * as asciiRender from "./render-ascii.js";

export function ascii(instance: Instance, localizer: Localizer) {
	return asciiRender.render(instance, localizer);
}

export function svg(instance: Instance, localizer: Localizer) {
	return svgRender.render(instance, localizer);
}

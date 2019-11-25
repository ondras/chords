import * as svgRender from "./render-svg.js";
import * as asciiRender from "./render-ascii.js";
export function ascii(instance, localizer) {
    return asciiRender.render(instance, localizer);
}
export function svg(instance, localizer) {
    return svgRender.render(instance, localizer);
}

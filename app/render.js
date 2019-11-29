import * as svgRender from "./render-svg.js";
import * as asciiRender from "./render-ascii.js";
function getOffset(instance) {
    let suitable = instance.fingers.filter(f => f > 0);
    if (Math.max(...suitable) <= 3) {
        return 0;
    }
    return Math.min(...suitable) - 1;
}
export function ascii(instance, localizer) {
    let offset = getOffset(instance);
    return asciiRender.render(instance, localizer, offset);
}
export function svg(instance, localizer) {
    let offset = getOffset(instance);
    return svgRender.render(instance, localizer, offset);
}

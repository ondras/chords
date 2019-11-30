import { toRoman, offsetFingers, fretCount } from "./util.js";
export function render(instance, localizer, offset) {
    const fingers = offsetFingers(instance.fingers, offset);
    let rows = [];
    rows.push(localizer.chord(instance.chord));
    rows.push("");
    if (offset > 0) {
        rows.push(`${toRoman(offset).toUpperCase()}.`);
        rows.push("");
    }
    rows.push(fingers.map(f => {
        switch (f) {
            case -1: return "x";
            case 0: return "o";
            default: return " ";
        }
    }).join(""));
    rows.push(fingers.map(_ => "=").join(""));
    let count = fretCount(fingers);
    for (let fret = 1; fret <= count; fret++) {
        let row = fingers.map(f => (f == fret ? "o" : "|"));
        rows.push(row.join(""));
    }
    return rows.join("\n");
}

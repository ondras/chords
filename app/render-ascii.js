import { toRoman, offsetFingers, fretCount, stripTags } from "./util.js";
export function render(instance, localizer, offset) {
    const fingers = offsetFingers(instance.fingers, offset);
    let rows = [];
    let name = stripTags(localizer.chordToString(instance.chord));
    rows.push(name);
    rows.push("");
    if (offset > 0) {
        rows.push(`${toRoman(offset + 1).toUpperCase()}.`);
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
            if (f == fret) {
                return "o";
            }
            if (instance.barre && instance.barre.fret - offset == fret && instance.barre.from <= i) {
                return "-";
            }
            return "|";
        });
        rows.push(row.join(""));
    }
    return rows.join("\n");
}

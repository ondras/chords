import * as instruments from "./instruments.js";
import * as tones from "./tones.js";
import { cartesianProduct } from "./util.js";
const OPTIONS = {
    startFret: 1,
    maxFret: 12,
    strategy: "exact",
    fingerRange: 3
};
const AVAILABLE_FINGERS = 4;
function sum(arr) { return arr.reduce((a, b) => a + b, 0); }
function min(arr) { return Math.min(...arr); }
function max(arr) { return Math.max(...arr); }
function isTone(finger) { return finger > -1; }
function CMP_TONES(a, b) {
    return b.fingers.filter(isTone).length - a.fingers.filter(isTone).length;
}
function CMP_RELEVANCE(a, b) {
    let rf1 = a.fingers.filter(f => f > 0);
    let rf2 = b.fingers.filter(f => f > 0);
    let min1 = min(rf1);
    let min2 = min(rf2);
    if (min1 != min2) {
        return min1 - min2;
    }
    let b1 = !!a.barre;
    let b2 = !!b.barre;
    if (b1 != b2) {
        return b1 ? -1 : 1;
    }
    let m1 = max(a.fingers);
    let m2 = max(b.fingers);
    if (m1 != m2) {
        return m1 - m2;
    }
    return sum(rf1) - sum(rf2);
}
function fingerCount(layout) {
    if (layout.barre) {
        const barre = layout.barre;
        return 1 + layout.fingers.filter(f => f > barre.fret).length;
    }
    else {
        return layout.fingers.filter(f => f > 0).length;
    }
}
function canBePlayed(layout) {
    if (fingerCount(layout) > AVAILABLE_FINGERS) {
        return false;
    }
    if (layout.fingers.filter(f => f == -1).length > 2) {
        return false;
    } // 3+ mute strings
    // mute string(s) surrounded by non-mute strings
    let pattern = layout.fingers.map(f => (f == -1 ? "m" : " ")).join("");
    if (pattern.match(/ m+ /)) {
        return false;
    }
    const barre = layout.barre;
    if (!barre) {
        return true;
    }
    for (let s = barre.from; s < layout.fingers.length; s++) {
        if (layout.fingers[s] < 1) {
            return false;
        } // inside barre, but empty or none requested -> bail out
    }
    // finger used on a string lower than barre start
    let before = layout.fingers.filter((f, i) => i < barre.from && f > 0);
    if (before.length > 0) {
        return false;
    }
    return true;
}
function computeBarre(fingers) {
    let realFingers = fingers.filter(f => f > 0); // true fingers used
    let fingerCount = realFingers.length;
    if (fingerCount <= AVAILABLE_FINGERS) {
        return null;
    } // no need
    let fret = min(realFingers); // lowest used fret
    let minCount = realFingers.filter(f => f == fret).length;
    if (minCount == 1) {
        return null;
    } // only one tone at the lowest fret
    // count barre props
    let from = -1;
    fingers.forEach((f, i) => {
        if (f == fret && from == -1) {
            from = i;
        }
    });
    return { fret, from };
}
function fingersOnString(string, chord, startFret, endFret) {
    let result = new Set([-1]);
    let frets = [0];
    for (let i = startFret; i <= endFret; i++) {
        frets.push(i);
    }
    frets.forEach(fret => {
        let t = tones.transpose(string, fret);
        let index = chord.tones.indexOf(t);
        if (index > -1) {
            result.add(fret);
        }
    });
    if (result.size == 0) {
        result.add(-1);
    }
    return result;
}
function isValid(layout, instrument, chord) {
    let remaining = new Set(chord.tones);
    let startsWithTonic = null;
    layout.fingers.forEach((f, i) => {
        if (f == -1) {
            return;
        }
        let tone = tones.transpose(instrument.strings[i], f);
        remaining.delete(tone);
        if (startsWithTonic === null) {
            startsWithTonic = (tone == chord.tones[0]);
        }
    });
    if (remaining.size > 0) {
        return false;
    } // has all tones?
    if (instrument.mustStartWithTonic && !startsWithTonic) {
        return false;
    }
    return true;
}
function layoutFromFingers(fingers) {
    let barre = computeBarre(fingers);
    return { fingers, barre };
}
function createAtFret(instrument, chord, fret, endFret) {
    let fingers = instrument.strings.map(string => fingersOnString(string, chord, fret, endFret));
    function iV(layout) { return isValid(layout, instrument, chord); }
    return cartesianProduct(fingers)
        .map(layoutFromFingers)
        .filter(iV)
        .filter(canBePlayed);
}
export function create(instrumentName, chord, options = {}) {
    const opts = Object.assign({}, OPTIONS, options);
    const instrument = instruments.get(instrumentName);
    let results = [];
    let fret = opts.startFret;
    while (fret <= opts.maxFret) {
        let endFret = Math.min(opts.maxFret, fret + opts.fingerRange - 1);
        let layouts = createAtFret(instrument, chord, fret, endFret);
        if (opts.strategy == "exact") {
            results = layouts;
            break;
        }
        else if (opts.strategy == "nonempty" && layouts.length > 0) {
            results = layouts;
            break;
        }
        else {
            results = results.concat(layouts);
        }
        fret++;
    }
    let cache = new Map();
    function deduplicate(layout) {
        const fingers = layout.fingers;
        let key = fingers.join(",");
        if (cache.has(key)) {
            return false;
        }
        for (let [, other] of cache) { // subset?
            if (fingers.every((f, i) => f == -1 || f == other[i])) {
                return false;
            }
        }
        cache.set(key, fingers);
        return true;
    }
    return results
        .sort(CMP_TONES)
        .filter(deduplicate)
        .sort(CMP_RELEVANCE);
}

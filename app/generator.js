import { TONES } from "./core.js";
import { cartesianProduct } from "./util.js";
const MAX_FRET = 3;
const AVAILABLE_FINGERS = 4;
function sum(arr) { return arr.reduce((a, b) => a + b, 0); }
function min(arr) { return Math.min(...arr); }
function max(arr) { return Math.max(...arr); }
function fingerCount(instance) {
    if (instance.barre) {
        const barre = instance.barre;
        return 1 + instance.fingers.filter(f => f > barre.fret).length;
    }
    else {
        return instance.fingers.filter(f => f > 0).length;
    }
}
function canBePlayed(instance) {
    if (fingerCount(instance) > AVAILABLE_FINGERS) {
        return false;
    }
    const barre = instance.barre;
    if (!barre) {
        return true;
    }
    for (let s = barre.from; s < instance.fingers.length; s++) {
        if (instance.fingers[s] < 1) {
            return false;
        } // inside barret, but empty or none requested -> bail out
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
function COMPARE(a, b) {
    let m1 = max(a.fingers);
    let m2 = max(b.fingers);
    return (m1 == m2 ? sum(a.fingers) - sum(b.fingers) : m1 - m2);
}
function fingersOnString(string, chord, startFret, ctx) {
    let result = new Set();
    let frets = [0];
    for (let i = 0; i < MAX_FRET; i++) {
        frets.push(startFret + i);
    }
    frets.forEach(fret => {
        let t = (string + fret) % TONES;
        let index = chord.tones.indexOf(t);
        if (index == -1) {
            return;
        }
        if (ctx.rootFound) {
            result.add(fret);
        }
        else if (index == 0) {
            ctx.rootFound = true;
            result.add(fret);
        }
    });
    if (result.size == 0) {
        result.add(-1);
    }
    return result;
}
function hasAllTones(instance) {
    let tones = new Set(instance.chord.tones);
    instance.fingers.forEach((f, i) => {
        if (f == -1) {
            return;
        }
        let tone = (f + instance.instrument[i]) % TONES;
        tones.delete(tone);
    });
    return (tones.size == 0);
}
function expandRedundantTones(instance) {
    if (fingerCount(instance) <= AVAILABLE_FINGERS) {
        return instance;
    }
    let toneToStrings = new Map();
    instance.fingers.forEach((f, i) => {
        if (f < 1) {
            return;
        }
        let tone = (f + instance.instrument[i]) % TONES;
        let strings = toneToStrings.get(tone) || [];
        strings.push(i);
        toneToStrings.set(tone, strings);
    });
    let results = [];
    toneToStrings.forEach(strings => {
        if (strings.length < 2) {
            return;
        }
        strings.forEach(string => {
            let altFingers = instance.fingers.slice();
            altFingers[string] = -1;
            let alternative = {
                fingers: altFingers,
                instrument: instance.instrument,
                chord: instance.chord,
                barre: instance.barre
            };
            results.push(alternative);
        });
    });
    return results;
}
export function createInstances(instrument, chord, startFret = 1) {
    let ctx = { rootFound: false };
    let fingers = instrument.map(string => fingersOnString(string, chord, startFret, ctx));
    function createInstance(fingers) {
        let barre = computeBarre(fingers);
        return { fingers, instrument, chord, barre };
    }
    return cartesianProduct(fingers)
        .map(createInstance)
        .filter(hasAllTones)
        .flatMap(expandRedundantTones)
        .filter(canBePlayed)
        .sort(COMPARE);
}

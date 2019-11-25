import { SEMITONES } from "./core.js";
const MAX_FRET = 3;
function sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
}
function max(arr) { return Math.max(...arr); }
function COMPARE(f1, f2) {
    let m1 = max(f1);
    let m2 = max(f2);
    return (m1 == m2 ? sum(f1) - sum(f2) : m1 - m2);
}
function fingersOnString(string, chord, ctx) {
    let result = [];
    for (let i = 0; i <= MAX_FRET; i++) {
        let t = (string + i) % SEMITONES;
        let index = chord.indexOf(t);
        if (index == -1) {
            continue;
        }
        if (ctx.rootFound) {
            result.push(i);
        }
        else if (index == 0) {
            ctx.rootFound = true;
            result.push(i);
        }
    }
    return (result.length > 0 ? result : [-1]);
}
function createFingerCombinations(fingers) {
    if (fingers.length == 0) {
        return [[]];
    }
    let current = fingers[0];
    let remaining = fingers.slice(1);
    return current.flatMap(finger => {
        return createFingerCombinations(remaining).map(remaining => [finger].concat(remaining));
    });
}
export function createInstances(instrument, chord, offset) {
    let offsetStrings = instrument.map(string => (string + offset) % SEMITONES);
    let ctx = { rootFound: false };
    let fingers = offsetStrings.map(string => fingersOnString(string, chord, ctx));
    function createInstance(fingers) {
        return { fingers, instrument, offset };
    }
    return createFingerCombinations(fingers).sort(COMPARE).map(createInstance);
}

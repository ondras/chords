import { TONES } from "./core.js";
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
function fingersOnString(string, chord, startFret, ctx) {
    let result = [];
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
            result.push(fret);
        }
        else if (index == 0) {
            ctx.rootFound = true;
            result.push(fret);
        }
    });
    return result;
}
function createFingerCombinations(fingers) {
    if (fingers.length == 0) {
        return [[]];
    }
    let current = fingers[0];
    let remaining = fingers.slice(1);
    if (current.length == 0) {
        current = [-1];
    }
    return current.flatMap(finger => {
        return createFingerCombinations(remaining).map(remaining => [finger].concat(remaining));
    });
}
export function createInstances(instrument, chord, startFret = 1) {
    let ctx = { rootFound: false };
    let fingers = instrument.map(string => fingersOnString(string, chord, startFret, ctx));
    function createInstance(fingers) {
        return { fingers, instrument, chord };
    }
    return createFingerCombinations(fingers).sort(COMPARE).map(createInstance);
}

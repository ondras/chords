const MIN_FRETS = 3;
export function assert(assertion, label) {
    if (!assertion) {
        throw new Error(label);
    }
}
export function assertEquals(a, b, label) {
    assert(a == b, `${label}${label ? ": " : ""}${a} does not equal ${b}`);
}
export function toRoman(n) {
    let tokens = [];
    function applyComponent(n, value, token) {
        while (n >= value) {
            tokens.unshift(token);
            n -= value;
        }
        return n;
    }
    n = applyComponent(n, 10, "x");
    n = applyComponent(n, 9, "ix");
    n = applyComponent(n, 9, "ix");
    n = applyComponent(n, 5, "v");
    n = applyComponent(n, 4, "iv");
    n = applyComponent(n, 1, "i");
    return tokens.join("");
}
export function offsetFingers(fingers, offset) {
    return fingers.map(f => {
        if (f < 1) {
            return f;
        }
        let f2 = f - offset;
        assert(f > 0, `Finger ${f} cannot be offset by ${offset}`);
        return f2;
    });
}
export function fretCount(fingers) {
    return Math.max(MIN_FRETS, ...fingers);
}
export function cartesianProduct(sets) {
    let result = [];
    let current = sets[0];
    let remaining = sets.slice(1);
    if (remaining.length > 0) {
        current.forEach(finger => {
            cartesianProduct(remaining)
                .map(remaining => [finger].concat(remaining))
                .forEach(combination => result.push(combination));
        });
    }
    else {
        current.forEach(finger => result.push([finger]));
    }
    return result;
}

const MIN_FRETS = 3;

export function assert(assertion: any, label: string) {
	if (!assertion) { throw new Error(label); }
}

export function assertEquals(a: any, b: any, label?: string) {
	assert(a == b, `${label}${label ? ": " : ""}${a} does not equal ${b}`);
}

export function toRoman(n: number) {
	let tokens: string[] = [];

	function applyComponent(n: number, value: number, token: string) {
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

export function offsetFingers(fingers: number[], offset: number) {
	return fingers.map(f => {
		if (f < 1) { return f; }
		let f2 = f-offset;
		assert(f > 0, `Finger ${f} cannot be offset by ${offset}`);
		return f2;
	});
}

export function fretCount(fingers: number[]) {
	return Math.max(MIN_FRETS, ...fingers);
}

export function cartesianProduct<T>(sets: Set<T>[]): T[][] {
	let result: T[][] = [];

	let current = sets[0];
	let remaining = sets.slice(1);

	if (remaining.length > 0) {
		current.forEach(value => {
			cartesianProduct<T>(remaining)
				.map(remaining => [value].concat(remaining))
				.forEach(combination => result.push(combination))
		});
	} else {
		current.forEach(value => result.push([value]));
	}

	return result;
}

export function stripTags(str: string) { return str.replace(/<.*?>/g, ""); }

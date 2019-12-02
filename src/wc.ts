import * as render from "./render.js";

class ChordLayout extends HTMLElement {
	static get observedAttributes() { return ["fingers", "name"]; }

	connectedCallback() {
		this._render();
	}

	attributeChangedCallback() {
		this._render();
	}

	_render() {
		this.innerHTML = "";

		let fingers = this.fingers;
		if (!fingers) { return; }

		let i = {
			fingers,
			barre: null,
		};

		this.appendChild(render.svg(i, this.name));
	}

	get fingers() {
		let f = this.getAttribute("fingers");
		if (!f) { return null; }
		return f.split(",").map(Number);
	}

	get name() { return this.getAttribute("name") || ""; }
}

customElements.define("chord-layout", ChordLayout);

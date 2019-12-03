import { Finger, Barre } from "./core.js";
import * as render from "./render.js";

class ChordLayout extends HTMLElement {
	static get observedAttributes() { return ["name", "fingers", "barre"]; }

	connectedCallback() {
		this._render();
	}

	attributeChangedCallback() {
		this._render();
	}

	_renderError(str: string) {
		this.textContent = str; // FIXME
	}

	_render() {
		this.innerHTML = "";

		let fingers = this.fingers;
		if (!fingers) { return this._renderError("No fingers"); }

		let barre = this.barre;

		let layout = { fingers, barre };

		this.appendChild(render.svg(layout, this.name));
	}

	get fingers() {
		let f = this.getAttribute("fingers");
		if (!f) { return null; }
		return f.split(",").map(Number);
	}

	get barre() {
		let b = this.getAttribute("barre");
		if (!b) { return null; }
		let [fret, from] = b.split(",").map(Number);

		return {fret, from};
	}

	get name() { return this.getAttribute("name") || ""; }

	set fingers(fingers: Finger[] | null) {
		if (fingers) {
			this.setAttribute("fingers", fingers.join(","));
		} else {
			this.removeAttribute("fingers");
		}
	}

	set barre(barre: Barre | null) {
		if (barre) {
			this.setAttribute("fingers", [barre.fret, barre.from].join(","));
		} else {
			this.removeAttribute("barre");
		}
	}

	set name(name: string) { this.setAttribute("name", name); }
}

customElements.define("chord-layout", ChordLayout);

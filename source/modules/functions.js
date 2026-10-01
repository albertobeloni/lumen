import Color from "colorjs.io";

const emphasis = 2;

function serialize(color) {
	return color.toString({format: "hex"});
}

function deserialize(color) {
	return new Color(color);
}

function length() {
	return Object.keys(this.colors.base).length;
}

function center() {
	return (this.length() - 1) / 2;
}

function limit(step) {
	return Math.min(Math.max(step, 0), this.length() - 1);
}

function step(offset) {
	return this.limit(this.dark ? this.center() - offset : this.center() + offset);
}

function find(color) {
	const hex = this.serialize(this.deserialize(color));

	for (const id in this.colors) {

		for (const step in this.colors[id]) {

			if (this.serialize(this.colors[id][step]) === hex) {
				return {
					id: id,
					step: Number(step),
					color: this.colors[id][step]
				};
			}

		}

	}

	throw new Error(`Color ${hex} is not part of any palette.`);
}

function fade(color, amount) {
	return this.serialize(this.deserialize(color).set("alpha", amount));
}

function shift(color, tones) {
	const shifted = this.deserialize(color).to("lab-d65");

	shifted.l += this.dark ? tones : -tones;
	shifted.toGamut({space: "srgb", method: "hct.c", jnd: 0});

	return this.serialize(shifted);
}

function primary(id) {
	return this.serialize(this.colors[id][this.step(emphasis)]);
}

function secondary(id) {
	return this.serialize(this.colors[id][this.step(0)]);
}

function contrast(color, minimum = 4.5) {
	const {id, step} = this.find(color);
	const reference = this.deserialize(color);

	const candidates = Object.values(this.colors[id]).map(
		(candidate, index) => ({
			color: this.serialize(candidate),
			distance: Math.abs(index - step),
			ratio: reference.contrast(this.serialize(candidate), "WCAG21")
		})
	);

	const nearest = candidates
		.filter(candidate => candidate.ratio >= minimum)
		.sort((a, b) => a.distance - b.distance)[0];

	const strongest = candidates.reduce((a, b) => b.ratio > a.ratio ? b : a);

	return (nearest ?? strongest).color;
}

function relative(color, offset) {
	const {id, step} = this.find(color);
	const target = this.limit(this.dark ? step + offset : step - offset);

	return this.serialize(this.colors[id][target]);
}

function select(dark, light) {
	return this.dark ? dark : light;
}

export const functions = {
	serialize: serialize,
	deserialize: deserialize,
	length: length,
	center: center,
	limit: limit,
	step: step,
	find: find,
	fade: fade,
	shift: shift,
	primary: primary,
	secondary: secondary,
	contrast: contrast,
	relative: relative,
	select: select
};

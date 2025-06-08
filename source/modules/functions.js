import Color from "colorjs.io";

function serialize(color) {
	return color.toString({format: "hex"});
}

function deserialize(color) {
	return new Color(color);
}

function find(color) {
	color = this.serialize(color);

	for (const id in this.colors) {

		for (const step in this.colors[id]) {
			const current = this.serialize(this.colors[id][step]);

			if (current === color) {
				return {
					id: id,
					step: parseInt(step),
					color: this.colors[id][step]
				};

			}

		}

	}

}

function fade(color, amount) {
	return this.serialize(this.deserialize(color).set("alpha", amount));
}

function darken(color, amount) {
	return this.serialize(this.deserialize(color).darken(amount));
}

function lighten(color, amount) {
	return this.serialize(this.deserialize(color).lighten(amount));
}

function primary(id) {
	return this.dark ? this.serialize(this.colors[id][4]) : this.serialize(this.colors[id][5]);
}

function secondary(id) {
	return this.dark ? this.serialize(this.colors[id][5]) : this.serialize(this.colors[id][4]);
}

function contrast(color) {
	color = this.find(color);
	const step = color.step < 5 ? color.step + 5 : color.step - 5;

	return this.serialize(this.colors[color.id][step]);
}

function relative(color, step) {
	color = this.find(color);
	step = this.dark ? color.step + step : color.step - step;
	step = step < 0 ? 0 : step > 9 ? 9 : step;

	return this.serialize(this.colors[color.id][step]);
}

function select(dark, light) {
	return this.dark ? dark : light;
}

export const functions = {
	serialize: serialize,
	deserialize: deserialize,
	find: find,
	fade: fade,
	darken: darken,
	lighten: lighten,
	primary: primary,
	secondary: secondary,
	contrast: contrast,
	relative: relative,
	select: select
};

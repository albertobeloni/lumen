import Color from "colorjs.io";

const steps = {
	0: 95,
	1: 85,
	2: 75,
	3: 65,
	4: 55,
	5: 45,
	6: 35,
	7: 25,
	8: 15,
	9: 5
};

function generateRange(background, foreground, steps) {
	const range = {};
	const colors = [background, foreground].sort(
		(background, foreground) => foreground.luminance - background.luminance
	);

	for (const step in steps) {
		range[step] = Color.mix(...colors, 1 - (steps[step] /  100), {
			space: "lab"
		}).toGamut({
			space: "srgb",
			method: "hct-tonal"
		});
	}

	return range;
}

function generateScale(color, steps) {
	const scale = {};

	for (const step in steps) {
		scale[step] = new Color("hct", [
			color.hct.h,
			color.hct.c * Math.cos((Math.PI * (step - 4.5) / 11)),
			steps[step]
		]).toGamut({
			space: "srgb",
			method: "hct-tonal"
		});
	}

	return scale;
}

function generateBase(background, foreground) {
	const base = generateRange(background, foreground, steps);

	return base;
}

function generateColors(colors) {

	for (const color in colors) {
		colors[color] = generateScale(new Color("hct", [...colors[color], 50]), steps);
	}

	return colors;
}

export default function lumen(scheme) {
	scheme.background = new Color("hct", [...scheme.background]).toGamut("srgb").to("srgb");
	scheme.foreground = new Color("hct", [...scheme.foreground]).toGamut("srgb").to("srgb");

	scheme.base = generateBase(scheme.background, scheme.foreground);
	scheme.colors = generateColors(scheme.colors);
	scheme.colors = {base: scheme.base, ...scheme.colors};

	for (const color in scheme.colors) {
		scheme[color] = function get(step) {
			return this.colors[color][step].toString({format: "hex"});
		};
	}

	scheme.dark = scheme.background.luminance < scheme.foreground.luminance;

	return scheme;
}

import Color from "colorjs.io";

function neutralize(color) {
	color = new Color("lab-d65", [color.t, 0, 0]);
	color.toGamut({space: "srgb", method: "hct.c", jnd: 0});

	return color;
}

function generateBase(light, dark, steps, neutral) {
	const range = {};

	for (const step in steps) {
		const tone = steps[step];
		const position = (light.t - tone) / (light.t - dark.t);

		range[step] = Color.mix(light, dark, position, {space: "lab-d65"}).to("hct");
		range[step].t = tone;
		range[step] = neutral ? neutralize(range[step]) : range[step];

		range[step].toGamut({space: "srgb", method: "hct.c", jnd: 0});
	}

	return range;
}

function taper(step, length, edge = 0.25) {
	const position = 2 * (step / (length - 1)) - 1;
	const tapering = 1 - (1 - edge) * position ** 2;

	return tapering;
}

function clamp(hue, chroma, tone) {
	const color = new Color("hct", [hue, chroma, tone]);

	return color.toGamut({space: "srgb", method: "hct.c", jnd: 0}).c;
}

function generateScale(color, steps) {
	const scale = {};
	const hue = color.h;
	const length = Object.keys(steps).length;

	for (const step in steps) {
		const tone = steps[step];
		const mirror = steps[length - 1 - step];
		const tapered = color.c * taper(step, length);
		const chroma = Math.min(
			clamp(hue, tapered, tone),
			clamp(hue, tapered, mirror)
		);

		scale[step] = new Color("hct", [hue, chroma, tone]);
		scale[step].toGamut({space: "srgb", method: "hct.c", jnd: 0});
	}

	return scale;
}

function calculateSteps(light, dark) {
	const steps = {};
	const length = 17;
	const variation = (light.t - dark.t) / (length + 1);

	for (let i = 0; i < length; i++) {
		steps[i] = light.t - variation * (i + 1);
	}

	return steps;
}

export default function lumen(scheme) {
	scheme.background = new Color("hct", [...scheme.background]);
	scheme.foreground = new Color("hct", [...scheme.foreground]);
	scheme.dark = scheme.background.luminance < scheme.foreground.luminance;
	scheme.neutral = scheme.background.c == 0 && scheme.foreground.c == 0;

	const [light, dark] = [scheme.background, scheme.foreground].sort(
		(background, foreground) => foreground.luminance - background.luminance
	);

	scheme.steps = calculateSteps(light, dark);
	scheme.base = generateBase(light, dark, scheme.steps, scheme.neutral);

	for (const color in scheme.colors) {
		scheme.colors[color] = generateScale(new Color("hct", [...scheme.colors[color], 50]), scheme.steps);
	}

	scheme.colors = {base: scheme.base, ...scheme.colors};
	scheme.background = scheme.neutral ? neutralize(scheme.background) : scheme.background.toGamut({space: "srgb", method: "hct.c", jnd: 0});
	scheme.foreground = scheme.neutral ? neutralize(scheme.foreground) : scheme.foreground.toGamut({space: "srgb", method: "hct.c", jnd: 0});
	scheme.background = scheme.background.to("srgb");
	scheme.foreground = scheme.foreground.to("srgb");

	for (const color in scheme.colors) {
		scheme[color] = function get(step) {
			return this.colors[color][step].toString({format: "hex"});
		};
	}

	return scheme;
}

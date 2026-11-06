import Color from "colorjs.io";

import TABLE from "./chroma.json" with { type: "json" };

const GOLDEN = (Math.sqrt(5) - 1) / 2;
const PRECISION = 0.1;
const SAMPLES = [
	0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
	170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310,
	320, 330, 340, 350,
];

export const GREY = 5;

const cache = new Map();

const maximum = (hue, tone) => {
	return hct(hue, 200, tone).get("c");
};

const probe = (hue, tone) => {
	return { hue, chroma: maximum(hue, tone) };
};

export const measure = (tone) => {
	const minimum = SAMPLES.map((hue) => probe(hue, tone)).reduce(
		(best, sample) => {
			return sample.chroma < best.chroma ? sample : best;
		},
	);

	let low = minimum.hue - 10;
	let high = minimum.hue + 10;
	let left = probe(high - GOLDEN * (high - low), tone);
	let right = probe(low + GOLDEN * (high - low), tone);

	while (high - low > PRECISION) {
		if (left.chroma < right.chroma) {
			high = right.hue;
			right = left;
			left = probe(high - GOLDEN * (high - low), tone);
		} else {
			low = left.hue;
			left = right;
			right = probe(low + GOLDEN * (high - low), tone);
		}
	}

	return Math.min(left.chroma, right.chroma, minimum.chroma);
};

// A color made translucent: "#rrggbb" (or "#rrggbbaa", whose alpha is
// replaced) with the given opacity. Given a background, the result is the
// opaque color it shows on that background, for apps without transparency
export const alpha = (color, opacity, background) => {
	if (background === undefined) {
		return render(color, opacity);
	}

	return render(Color.mix(background, color, opacity, { space: "srgb" }));
};

export const angle = (rotation) => {
	return ((rotation % 360) + 360) % 360;
};

export const blend = (hues, chroma, tone, amount) => {
	if (hues.length === 1) {
		return hct(hues[0], chroma, tone);
	}

	amount = amount * (hues.length - 1);

	const index = Math.min(Math.floor(amount), hues.length - 2);
	const [from, to] = [hues[index], hues[index + 1]].map((hue) =>
		hct(hue, chroma, tone),
	);

	return Color.mix(from, to, amount - index, {
		space: "lab-d65",
		outputSpace: "hct",
	});
};

export const chroma = (tone) => {
	if (tone <= 0 || tone >= 100) {
		return 0;
	}

	const key = tone.toFixed(6);

	if (Object.hasOwn(TABLE, key)) {
		return TABLE[key];
	}

	if (!cache.has(tone)) {
		cache.set(tone, measure(tone));
	}

	return cache.get(tone);
};

export const colorfulness = ([, a, b]) => {
	return Math.hypot(a, b);
};

export const contrast = (foreground, background) => {
	return Color.contrast(foreground, background, "WCAG21");
};

export const distance = (a, b) => {
	const difference = Math.abs(a - b) % 360;

	return Math.min(difference, 360 - difference);
};

export const harmonize = (hue, anchor, strength) => {
	return angle(hue + strength * Math.sin(((anchor - hue) * Math.PI) / 180));
};

export const hct = (hue, chroma, tone) => {
	const color =
		chroma === 0 || tone <= 0 || tone >= 100
			? new Color("lab-d65", [tone, 0, 0]).to("hct")
			: new Color("hct", [hue, chroma, tone]);

	return color.toGamut({
		space: "srgb",
		method: "hct.c",
		jnd: 0,
		deltaEMethod: "hct",
	});
};

export const render = (color, alpha) => {
	const result = new Color(color);

	if (alpha !== undefined) {
		result.alpha = alpha;
	}

	return result.toString({ format: "hex", collapse: false });
};

export const scale = (steps) => {
	return Array.from({ length: steps }, (_, index) => {
		const luminance = 0.05 * 21 ** (index / (steps - 1)) - 0.05;
		const reference = new Color("xyz-d65", [
			0.9505 * luminance,
			luminance,
			1.089 * luminance,
		]);
		return reference.to("hct").get("t");
	});
};

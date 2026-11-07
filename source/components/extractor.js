import { HCT, Lab_D65, sRGB, to } from "colorjs.io/fn";

import { angle, colorfulness, distance, GREY } from "./color.js";

const SIZE = 192; // Images are reduced to fit this square before sampling
const TINT = 2; // Minimum colorfulness for a pixel to have a meaningful hue
const EMPHASIS = 3; // Chroma exponent, so vivid accents outweigh large muted areas
const VIVID = 20; // Minimum chroma for a pixel to make an accent present
const PRESENCE = 0.0002; // Minimum share of vivid pixels for an accent to count
const SMOOTH = 30; // Histogram smoothing radius, in degrees
const SEPARATION = 90; // Minimum distance between primary and tertiary

const area = () => {
	return 1;
};

const prominence = ({ chroma }) => {
	return chroma ** EMPHASIS;
};

const samples = async (file) => {
	const { default: sharp } = await import("sharp");
	const { data, info } = await sharp(file)
		.resize(SIZE, SIZE, { fit: "inside" })
		.toColourspace("srgb")
		.removeAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });

	return Array.from({ length: info.width * info.height }, (_, index) => {
		const offset = index * info.channels;
		const rgb = [0, 1, 2].map((channel) => data[offset + channel] / 255);
		const color = { space: sRGB, coords: rgb, alpha: 1 };
		const [hue, chroma, tone] = to(color, HCT).coords;

		return {
			hue: angle(hue || 0),
			chroma,
			tone,
			colorfulness: colorfulness(to(color, Lab_D65).coords),
		};
	});
};

const histogram = (pixels, weight) => {
	const bins = new Float64Array(360);

	for (const pixel of pixels) {
		bins[Math.round(pixel.hue) % 360] += weight(pixel);
	}

	return bins.map((_, index) => {
		let sum = 0;

		for (let offset = -SMOOTH; offset <= SMOOTH; offset++) {
			sum +=
				bins[(index + offset + 360) % 360] *
				(1 - Math.abs(offset) / (SMOOTH + 1));
		}

		return sum;
	});
};

const peaks = (bins) => {
	return Array.from(bins.keys())
		.filter((hue) => {
			return (
				bins[hue] > bins[(hue + 359) % 360] &&
				bins[hue] >= bins[(hue + 1) % 360]
			);
		})
		.map((hue) => ({ hue, value: bins[hue] }))
		.sort((a, b) => b.value - a.value);
};

const family = (pixels, bins, peak) => {
	let [left, right] = [peak, peak];

	while (bins[(left + 359) % 360] < bins[left]) {
		left = (left + 359) % 360;
	}

	while (bins[(right + 1) % 360] < bins[right]) {
		right = (right + 1) % 360;
	}

	return pixels.filter((pixel) => {
		const offset = (Math.round(pixel.hue) - left + 360) % 360;

		return offset <= (right - left + 360) % 360;
	});
};

const present = (pixels, minimum) => {
	return pixels.filter((pixel) => pixel.chroma >= VIVID).length >= minimum;
};

const contrasting = (candidates, first, pixels, bins, minimum) => {
	return candidates
		.filter(({ hue }) => {
			return (
				distance(hue, first.hue) >= SEPARATION &&
				present(family(pixels, bins, hue), minimum)
			);
		})
		.map((peak) => {
			const half = (distance(peak.hue, first.hue) * Math.PI) / 360;

			return { ...peak, score: peak.value * Math.sin(half) };
		})
		.sort((a, b) => b.score - a.score)[0];
};

const refine = (pixels, weight) => {
	let [x, y] = [0, 0];

	for (const pixel of pixels) {
		const radians = (pixel.hue * Math.PI) / 180;

		x += weight(pixel) * Math.cos(radians);
		y += weight(pixel) * Math.sin(radians);
	}

	return angle((Math.atan2(y, x) * 180) / Math.PI);
};

const base = (pixels) => {
	const tinted = pixels.filter((pixel) => pixel.colorfulness >= TINT);

	if (tinted.length === 0) {
		return undefined;
	}

	const bins = histogram(tinted, area);
	const [peak] = peaks(bins);
	const dominant = family(tinted, bins, peak.hue);

	if (dominant.length <= pixels.length - tinted.length) {
		return undefined;
	}

	return refine(dominant, area);
};

const accents = (pixels) => {
	const colored = pixels.filter((pixel) => pixel.colorfulness >= GREY);
	const minimum = pixels.length * PRESENCE;

	if (colored.length < minimum) {
		return {};
	}

	const bins = histogram(colored, prominence);
	const [first, ...rest] = peaks(bins);
	const second = contrasting(rest, first, colored, bins, minimum);

	return {
		primary: refine(family(colored, bins, first.hue), prominence),
		tertiary: second && refine(family(colored, bins, second.hue), area),
	};
};

export const extract = async (file) => {
	const pixels = await samples(file);
	const { primary, tertiary } = accents(pixels);
	const definition = { base: base(pixels), primary, tertiary };

	definition.style = definition.base === undefined ? "neutral" : "natural";

	return Object.fromEntries(
		Object.entries(definition).filter(([, value]) => value !== undefined),
	);
};

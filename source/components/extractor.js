import { HCT, Lab_D65, sRGB, to } from "colorjs.io/fn";

import { angle, colorfulness, distance, GREY } from "./color.js";

const SIZE = 96; // Images are reduced to fit this square before sampling
const TINT = 2; // Minimum colorfulness for a pixel to have a meaningful hue
const PRESENCE = 0.01; // Minimum share of pixels for a hue to count
const SMOOTH = 15; // Histogram smoothing radius, in degrees
const WINDOW = 25; // Radius around a peak used to refine its hue
const SEPARATION = 30; // Minimum distance between primary and tertiary
const SECOND = 0.1; // Minimum strength of tertiary relative to primary

const area = () => {
	return 1;
};

const strength = ({ chroma }) => {
	return chroma;
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
	}).filter(({ tone }) => tone > 10 && tone < 95);
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

const contrasting = (candidates, first) => {
	return candidates
		.filter(({ hue, value }) => {
			return (
				distance(hue, first.hue) >= SEPARATION &&
				value >= SECOND * first.value
			);
		})
		.map((peak) => {
			const half = (distance(peak.hue, first.hue) * Math.PI) / 360;

			return { ...peak, score: peak.value * Math.sin(half) };
		})
		.sort((a, b) => b.score - a.score)[0];
};

const refine = (pixels, center, weight) => {
	let [x, y] = [0, 0];

	for (const pixel of pixels) {
		if (distance(pixel.hue, center) <= WINDOW) {
			const radians = (pixel.hue * Math.PI) / 180;

			x += weight(pixel) * Math.cos(radians);
			y += weight(pixel) * Math.sin(radians);
		}
	}

	return angle((Math.atan2(y, x) * 180) / Math.PI);
};

export const extract = async (file) => {
	const pixels = await samples(file);
	const minimum = pixels.length * PRESENCE;
	const tinted = pixels.filter((pixel) => pixel.colorfulness >= TINT);
	const colored = pixels.filter((pixel) => pixel.colorfulness >= GREY);
	const definition = {};

	if (tinted.length >= minimum) {
		const [{ hue }] = peaks(histogram(tinted, area));

		definition.base = refine(tinted, hue, area);
	}

	if (colored.length >= minimum) {
		const [first, ...rest] = peaks(histogram(colored, strength));
		const second = contrasting(rest, first);

		definition.primary = refine(colored, first.hue, strength);

		if (second) {
			definition.tertiary = refine(colored, second.hue, strength);
		}
	}

	definition.style = definition.base === undefined ? "neutral" : "natural";

	return definition;
};

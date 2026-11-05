import { HCT, Lab_D65, sRGB, to } from "colorjs.io/fn";

import { angle } from "./color.js";

const SIZE = 96; // Images are reduced to fit this square before sampling
const TINT = 2; // Minimum chroma for a pixel to have a meaningful hue
const GREY = 5; // Pixels below this chroma count as grey
const PRESENCE = 0.01; // Minimum share of pixels for a hue to count
const SMOOTH = 15; // Histogram smoothing radius, in degrees
const WINDOW = 25; // Radius around a peak used to refine its hue
const SEPARATION = 30; // Minimum distance between primary and tertiary
const SECOND = 0.1; // Minimum strength of tertiary relative to primary

const distance = (a, b) => {
	const difference = Math.abs(a - b) % 360;

	return Math.min(difference, 360 - difference);
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
		const [, a, b] = to(color, Lab_D65).coords;

		return {
			hue: angle(hue || 0),
			chroma,
			tone,
			greyness: Math.hypot(a, b),
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

const peak = (bins, excluded = []) => {
	let best = { hue: undefined, value: 0 };

	bins.forEach((value, hue) => {
		const free = excluded.every(
			(other) => distance(hue, other) > SEPARATION,
		);

		if (free && value > best.value) {
			best = { hue, value };
		}
	});

	return best;
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

const present = (pixels, total) => {
	return pixels.length >= total * PRESENCE;
};

export const extract = async (file) => {
	const pixels = await samples(file);
	const tinted = pixels.filter(({ greyness }) => greyness >= TINT);
	const colored = pixels.filter(({ greyness }) => greyness >= GREY);

	const area = () => 1;
	const strength = ({ chroma }) => chroma;
	const definition = { style: "neutral" };

	if (present(tinted, pixels.length)) {
		const { hue } = peak(histogram(tinted, area));

		definition.base = refine(tinted, hue, area);
		definition.style = "natural";
	}

	if (present(colored, pixels.length)) {
		const bins = histogram(colored, strength);
		const first = peak(bins);
		const second = peak(bins, [first.hue]);

		definition.primary = refine(colored, first.hue, strength);

		if (second.value >= SECOND * first.value) {
			definition.tertiary = refine(colored, second.hue, strength);
		}
	}

	return definition;
};

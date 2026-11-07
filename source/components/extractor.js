import { HCT, Lab_D65, sRGB, to } from "colorjs.io/fn";

import { angle, colorfulness, distance, GREY } from "./color.js";

const SIZE = 192; // Images are reduced to fit this square before sampling
const TINT = 2; // Minimum colorfulness for a pixel to have a meaningful hue
const SMOOTH = 30; // Histogram smoothing radius, in degrees
const EMPHASIS = 3; // Chroma exponent, so vivid accents outweigh large muted areas
const VIVID = 20; // Minimum chroma for a pixel to make an accent present
const PRESENCE = 0.0002; // Minimum share of vivid pixels for an accent to count
const MUTED = 30; // Mean chroma below which a dominant colour is a backdrop
const OPPOSITE = 90; // Hue distance at which colours clearly contrast
const NEAR = 45; // Hue distance within which colours read as related

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
		const [hue, chroma] = to(color, HCT).coords;

		return {
			hue: angle(hue || 0),
			chroma,
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

const center = (pixels, weight) => {
	let [x, y] = [0, 0];

	for (const pixel of pixels) {
		const radians = (pixel.hue * Math.PI) / 180;

		x += weight(pixel) * Math.cos(radians);
		y += weight(pixel) * Math.sin(radians);
	}

	return angle((Math.atan2(y, x) * 180) / Math.PI);
};

const present = (pixels, total) => {
	const vivid = pixels.filter((pixel) => pixel.chroma >= VIVID);

	return vivid.length >= total * PRESENCE;
};

const muted = (pixels) => {
	const sum = pixels.reduce((total, pixel) => total + pixel.chroma, 0);

	return sum / pixels.length < MUTED;
};

const dominant = (pixels) => {
	const tinted = pixels.filter((pixel) => pixel.colorfulness >= TINT);

	if (tinted.length === 0) {
		return undefined;
	}

	const bins = histogram(tinted, area);
	const [peak] = peaks(bins);
	const members = family(tinted, bins, peak.hue);

	return members.length > pixels.length - tinted.length ? members : undefined;
};

const accents = (pixels, total, separation) => {
	const colored = pixels.filter((pixel) => pixel.colorfulness >= GREY);

	if (colored.length === 0) {
		return undefined;
	}

	const bins = histogram(colored, prominence);
	const [first, ...rest] = peaks(bins);
	const main = family(colored, bins, first.hue);

	if (!present(main, total)) {
		return undefined;
	}

	const second = rest
		.map((peak) => {
			const members = family(colored, bins, peak.hue);
			const gap = distance(peak.hue, first.hue);
			const score = peak.value * Math.sin((gap * Math.PI) / 360);

			return { members, gap, score };
		})
		.filter(({ members, gap }) => {
			return gap >= separation && present(members, total);
		})
		.sort((a, b) => b.score - a.score)[0];

	return {
		primary: center(main, prominence),
		tertiary: second && center(second.members, area),
	};
};

const around = (pixels, base) => {
	const rest = pixels.filter((pixel) => distance(pixel.hue, base) > NEAR);
	const found = accents(rest, pixels.length, NEAR);

	return found && distance(found.primary, base) >= OPPOSITE
		? found
		: undefined;
};

export const extract = async (file) => {
	const pixels = await samples(file);
	const backdrop = dominant(pixels);
	const base = backdrop && center(backdrop, area);
	const aside = backdrop && muted(backdrop) && around(pixels, base);
	const { primary, tertiary } =
		aside || accents(pixels, pixels.length, OPPOSITE) || {};

	return {
		base,
		primary,
		tertiary,
		style: base === undefined ? "neutral" : "natural",
	};
};

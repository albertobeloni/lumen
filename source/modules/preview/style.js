import { MONO } from "./svg.js";

export const WIDTH = 944;

export const SPACE = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32, xxxl: 48 };

export const TYPE = {
	title: { size: 22, weight: 600 },
	heading: { size: 11, weight: 600, spacing: 1.2 },
	label: { size: 14, weight: 600 },
	body: { size: 12 },
	code: { size: 13, family: MONO },
};

export const LINE = 20;

export const split = (count, width = WIDTH) => {
	return (width - (count - 1) * SPACE.l) / count;
};

export const baseline = (height, size) => {
	return Math.round((height + size * 0.7) / 2);
};

export const grade = (ratio) => {
	if (ratio >= 7) return "●";
	if (ratio >= 4.5) return "";
	if (ratio >= 3) return "◐";
	return "✕";
};

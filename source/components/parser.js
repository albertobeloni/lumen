import { angle, harmonize } from "./color.js";

import DEFAULTS from "./defaults.js";

const accents = (scheme) => {
	const harmony = scheme.harmonies[scheme.harmony];
	const { chromacity } = scheme.styles[scheme.style];

	const accent = (accent) => {
		if (scheme[accent] !== undefined) {
			return {
				hue: scheme[accent],
				chromacity: 1 * chromacity * harmony[accent].chromacity,
			};
		}

		return {
			hue: angle(scheme.primary + harmony[accent].rotation),
			chromacity: 1 * chromacity * harmony[accent].chromacity,
		};
	};

	return {
		primary: accent("primary"),
		secondary: accent("secondary"),
		tertiary: accent("tertiary"),
	};
};

const base = (scheme) => {
	const chroma = scheme.styles[scheme.style].chroma;
	const hues = [scheme.base ?? "primary"].flat();

	return {
		chroma,
		hues: hues.map((hue) => {
			if (typeof hue === "number") {
				return hue;
			}

			return scheme.accent[hue].hue;
		}),
	};
};

const colors = (scheme) => {
	const anchor = scheme.accent.primary.hue;
	const { chromacity } = scheme.styles[scheme.style];

	return Object.fromEntries(
		Object.entries(scheme.color).map(([name, hue]) => {
			return [
				name,
				{
					hue: harmonize(hue, anchor, scheme.harmonize),
					chromacity: chromacity,
				},
			];
		}),
	);
};

const merge = (a, b) => {
	if (b === undefined) {
		return structuredClone(a);
	}

	if (!plain(b)) {
		return structuredClone(b);
	}

	const base = plain(a) ? a : {};
	const keys = new Set([...Object.keys(base), ...Object.keys(b)]);

	return Object.fromEntries(
		Array.from(keys, (key) => [key, merge(base[key], b[key])]),
	);
};

const plain = (value) => {
	return (
		typeof value === "object" &&
		value !== null &&
		[Object.prototype, null].includes(Object.getPrototypeOf(value))
	);
};

export const parse = (definition) => {
	const scheme = merge(DEFAULTS, definition);

	scheme.accent = accents(scheme);
	scheme.base = base(scheme);
	scheme.color = colors(scheme);

	return scheme;
};

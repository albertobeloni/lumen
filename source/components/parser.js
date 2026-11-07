import { angle, harmonize } from "./color.js";

import DEFAULTS from "./defaults.js";

const accents = (scheme) => {
	const harmony = scheme.harmonies[scheme.harmony];
	const { chromacity } = scheme.styles[scheme.style];

	const accent = (name) => {
		const { rotation } = harmony[name];

		return {
			hue: scheme[name] ?? angle(scheme.primary + rotation),
			chromacity: chromacity * harmony[name].chromacity,
		};
	};

	return {
		primary: accent("primary"),
		secondary: accent("secondary"),
		tertiary: accent("tertiary"),
	};
};

const base = (scheme) => {
	const { chroma } = scheme.styles[scheme.style];
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
					chromacity,
				},
			];
		}),
	);
};

const plain = (value) => {
	return (
		typeof value === "object" &&
		value !== null &&
		[Object.prototype, null].includes(Object.getPrototypeOf(value))
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

export const parse = (definition) => {
	const scheme = merge(DEFAULTS, definition);

	scheme.accent = accents(scheme);
	scheme.base = base(scheme);
	scheme.color = colors(scheme);

	return scheme;
};

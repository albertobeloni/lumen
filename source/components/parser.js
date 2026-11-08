import { angle, harmonize } from "./color.js";

import DEFAULTS from "./defaults.js";

const accents = (scheme) => {
	const harmony = scheme.harmonies[scheme.harmony];

	const anchor = (name) => {
		const { rotation, chromacity, more, less } = harmony[name];
		const hue = scheme[name] ?? angle(scheme.primary + rotation);

		const companion = (relation) => {
			return {
				hue: angle(hue + relation.rotation),
				chromacity: relation.chromacity,
			};
		};

		return {
			hue,
			chromacity,
			more: companion(more),
			less: companion(less),
		};
	};

	return {
		primary: anchor("primary"),
		secondary: anchor("secondary"),
	};
};

const base = (scheme, accent) => {
	const hues = [scheme.base ?? "primary"].flat().map((hue) => {
		return typeof hue === "number" ? hue : accent[hue].hue;
	});

	return { hues, variant: { hues } };
};

const colors = (scheme, anchor) => {
	return Object.fromEntries(
		Object.entries(scheme.color).map(([name, hue]) => {
			return [name, { hue: harmonize(hue, anchor, scheme.harmonize) }];
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

	const accent = accents(scheme);

	scheme.palettes = {
		base: base(scheme, accent),
		accent,
		color: colors(scheme, accent.primary.hue),
	};

	return scheme;
};

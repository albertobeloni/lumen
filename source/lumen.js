import { blend, chroma, hct, render, scale } from "./components/color.js";
import { resolve } from "./components/resolver.js";
import { parse } from "./components/parser.js";

import ROLES from "./components/roles.js";

export const STEPS = 41;

const base = ({ hues, chroma }, tones) => {
	return tones.map((tone, index) => {
		return render(blend(hues, chroma, tone, index / (tones.length - 1)));
	});
};

const color = ({ hue, chromacity }, tones) => {
	return tones.map((tone) => {
		return render(hct(hue, chroma(tone) * chromacity, tone));
	});
};

const colors = (definitions, tones) => {
	return Object.fromEntries(
		Object.entries(definitions).map(([name, definition]) => {
			return [name, color(definition, tones)];
		}),
	);
};

const orient = (palette, dark) => {
	return Object.fromEntries(
		Object.entries(palette).map(([name, colors]) => {
			return [name, dark ? colors : colors.toReversed()];
		}),
	);
};

const theme = (scheme, dark) => {
	const { offset } = scheme.styles[scheme.style];
	const palette = {
		...orient(scheme.palette, dark),
		black: scheme.palette.base,
		white: scheme.palette.base.toReversed(),
	};

	return {
		name: scheme.names[dark ? "dark" : "light"],
		palette,
		roles: resolve(ROLES, palette, offset),
	};
};

export const Lumen = (definition) => {
	const scheme = parse(definition);
	const tones = scale(STEPS);

	scheme.palette = {
		base: base(scheme.base, tones),
		...colors(scheme.accent, tones),
		...colors(scheme.color, tones),
	};

	return {
		palette: scheme.palette,
		theme: {
			dark: theme(scheme, true),
			light: theme(scheme, false),
		},
	};
};

export default Lumen;

import { blend, chroma, hct, render, scale } from "./components/color.js";
import { resolve } from "./components/resolver.js";
import { parse } from "./components/parser.js";

import ROLES from "./components/roles.js";

export const NAME = "Lumen";
export const STEPS = 41;

const THEMES = ["dark", "light"];

const blended = (hues, amount, tones) => {
	return tones.map((tone, index) => {
		const position = index / (tones.length - 1);

		return render(blend(hues, amount(tone), tone, position));
	});
};

const tinted = (hue, chromacity, tones) => {
	return tones.map((tone) => {
		return render(hct(hue, chroma(tone) * chromacity, tone));
	});
};

const palettes = (scheme, style, tones) => {
	const { base, accent, color } = scheme.palettes;

	const family = (name, { hue, chromacity, more, less }) => {
		const factor = style.chromacity;

		return [
			[name, tinted(hue, chromacity * factor, tones)],
			[`${name}-more`, tinted(more.hue, more.chromacity * factor, tones)],
			[`${name}-less`, tinted(less.hue, less.chromacity * factor, tones)],
		];
	};

	const neutral = ({ hues, variant }) => {
		const factor = style.variant.chromacity * style.chromacity;

		return [
			["base", blended(hues, () => style.chroma, tones)],
			[
				"base-variant",
				blended(variant.hues, (tone) => chroma(tone) * factor, tones),
			],
		];
	};

	return Object.fromEntries([
		...neutral(base),
		...Object.entries(accent).flatMap(([name, definition]) => {
			return family(name, definition);
		}),
		...Object.entries(color).map(([name, { hue }]) => {
			return [name, tinted(hue, style.chromacity, tones)];
		}),
	]);
};

const orient = (palette, dark) => {
	return Object.fromEntries(
		Object.entries(palette).map(([name, colors]) => {
			return [name, dark ? colors : colors.toReversed()];
		}),
	);
};

const theme = (scheme, name, tones) => {
	const style = scheme.styles[scheme.style][name];
	const dark = name === "dark";
	const palette = orient(palettes(scheme, style, tones), dark);

	return {
		name: scheme.names[name],
		palette,
		roles: resolve(ROLES(dark), palette, style.offset),
	};
};

export const Lumen = (definition) => {
	const scheme = parse(definition);
	const tones = scale(STEPS);

	return {
		theme: Object.fromEntries(
			THEMES.map((name) => [name, theme(scheme, name, tones)]),
		),
	};
};

export default Lumen;

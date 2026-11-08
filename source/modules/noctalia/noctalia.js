import path from "node:path";

const palette = ({ accent, ansi, base, color, shadow, surface }) => {
	const { field, frame } = surface;
	const { primary, secondary } = accent;
	const { variant } = base;
	const selected = base.container;

	return {
		"mPrimary": primary.background,
		"mOnPrimary": primary.foreground.normal,
		"mSecondary": variant.background,
		"mOnSecondary": variant.foreground.normal,
		"mTertiary": secondary.background,
		"mOnTertiary": secondary.foreground.normal,
		"mError": color.red.background,
		"mOnError": color.red.foreground.normal,
		"mSurface": field.background,
		"mOnSurface": field.foreground.normal,
		"mSurfaceVariant": frame.background,
		"mOnSurfaceVariant": frame.foreground.normal,
		"mOutline": frame.outline.silent,
		"mShadow": shadow.slice(0, 7),
		"mHover": variant.container.background,
		"mOnHover": variant.container.foreground.normal,
		"terminal": {
			"background": field.background,
			"foreground": field.foreground.normal,
			"cursor": field.foreground.subtle,
			"cursorText": field.background,
			"selectionBg": selected.background,
			"selectionFg": selected.foreground.strong,
			"normal": {
				"black": ansi.black.normal,
				"red": ansi.red.normal,
				"green": ansi.green.normal,
				"yellow": ansi.yellow.normal,
				"blue": ansi.blue.normal,
				"magenta": ansi.magenta.normal,
				"cyan": ansi.cyan.normal,
				"white": ansi.white.normal,
			},
			"bright": {
				"black": ansi.black.strong,
				"red": ansi.red.strong,
				"green": ansi.green.strong,
				"yellow": ansi.yellow.strong,
				"blue": ansi.blue.strong,
				"magenta": ansi.magenta.strong,
				"cyan": ansi.cyan.strong,
				"white": ansi.white.strong,
			},
		},
	};
};

export default (scheme, { name, config }) => {
	const palettes = {
		"dark": palette(scheme.theme.dark.roles),
		"light": palette(scheme.theme.light.roles),
	};

	return {
		directory: path.join(config, "noctalia", "palettes"),
		files: [
			{
				path: `${name}.json`,
				data: `${JSON.stringify(palettes, null, "\t")}\n`,
			},
		],
		command: `noctalia msg color-scheme-set custom ${name}`,
	};
};

import os from "node:os";
import path from "node:path";

const CONFIG =
	process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config");

const ANSI = [
	"black",
	"red",
	"green",
	"yellow",
	"blue",
	"magenta",
	"cyan",
	"white",
];

const terminal = ({ accent, ansi, surface }) => {
	const { field } = surface;
	const selected = accent.base.container;

	const normal = ANSI.map((name) => [name, ansi[name].normal]);
	const bright = ANSI.map((name) => [name, ansi[name].strong]);

	return {
		background: field.background,
		foreground: field.foreground.normal,
		cursor: field.foreground.subtle,
		cursorText: field.background,
		selectionBg: selected.background,
		selectionFg: selected.foreground.strong,
		normal: Object.fromEntries(normal),
		bright: Object.fromEntries(bright),
	};
};

const palette = ({ roles }) => {
	const { accent, color, surface } = roles;
	const { field, frame } = surface;
	const hover = accent.secondary.container;

	return {
		mPrimary: accent.primary.background,
		mOnPrimary: accent.primary.foreground.normal,
		mSecondary: accent.secondary.background,
		mOnSecondary: accent.secondary.foreground.normal,
		mTertiary: accent.tertiary.background,
		mOnTertiary: accent.tertiary.foreground.normal,
		mError: color.red.background,
		mOnError: color.red.foreground.normal,
		mSurface: field.background,
		mOnSurface: field.foreground.normal,
		mSurfaceVariant: frame.background,
		mOnSurfaceVariant: frame.foreground.subtle,
		mOutline: frame.outline.subtle,
		mShadow: roles.shadow.slice(0, 7),
		mHover: hover.background,
		mOnHover: hover.foreground.normal,
		terminal: terminal(roles),
	};
};

export default (scheme, { name }) => {
	const palettes = {
		dark: palette(scheme.theme.dark),
		light: palette(scheme.theme.light),
	};

	return {
		directory: path.join(CONFIG, "noctalia", "palettes"),
		files: [
			{
				path: `${name}.json`,
				data: `${JSON.stringify(palettes, null, "\t")}\n`,
			},
		],
		command: `noctalia msg color-scheme-set custom ${name}`,
	};
};

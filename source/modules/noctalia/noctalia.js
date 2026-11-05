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
const BRIGHT = { black: "subtle" };

const solid = (value) => value.slice(0, 7);

const terminal = ({ ansi, accent, surface }) => {
	const shades = (level) => {
		return Object.fromEntries(
			ANSI.map((name) => {
				return [
					name,
					ansi[name][
						level === "bright"
							? (BRIGHT[name] ?? "strong")
							: "normal"
					],
				];
			}),
		);
	};

	return {
		background: surface.field.background,
		foreground: surface.field.foreground.normal,
		cursor: surface.field.foreground.subtle,
		cursorText: surface.field.background,
		selectionBg: accent.base.container.background,
		selectionFg: accent.base.container.foreground.strong,
		normal: shades("normal"),
		bright: shades("bright"),
	};
};

const palette = ({ roles }) => {
	const { accent, color, surface } = roles;

	return {
		mPrimary: accent.primary.background,
		mOnPrimary: accent.primary.foreground.strong,
		mSecondary: accent.secondary.background,
		mOnSecondary: accent.secondary.foreground.strong,
		mTertiary: accent.tertiary.background,
		mOnTertiary: accent.tertiary.foreground.strong,
		mError: color.red.background,
		mOnError: color.red.foreground.normal,
		mSurface: surface.frame.background,
		mOnSurface: surface.frame.foreground.normal,
		mSurfaceVariant: surface.panel.background,
		mOnSurfaceVariant: surface.panel.foreground.subtle,
		mOutline: surface.frame.outline.subtle,
		mShadow: solid(roles.shadow),
		mHover: accent.secondary.container.background,
		mOnHover: accent.secondary.container.foreground.strong,
		terminal: terminal(roles),
	};
};

export default (scheme, { name }) => ({
	directory: path.join(CONFIG, "noctalia", "palettes"),
	files: [
		{
			path: `${name}.json`,
			data: `${JSON.stringify(
				{
					dark: palette(scheme.theme.dark),
					light: palette(scheme.theme.light),
				},
				null,
				"\t",
			)}\n`,
		},
	],
	command: `noctalia msg color-scheme-set custom ${name}`,
});

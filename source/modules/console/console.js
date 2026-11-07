import path from "node:path";

const palette = ({ ansi, surface }) => {
	return [
		surface.field.background,
		ansi.red.normal,
		ansi.green.normal,
		ansi.yellow.normal,
		ansi.blue.normal,
		ansi.magenta.normal,
		ansi.cyan.normal,
		ansi.white.normal,
		ansi.black.strong,
		ansi.red.strong,
		ansi.green.strong,
		ansi.yellow.strong,
		ansi.blue.strong,
		ansi.magenta.strong,
		ansi.cyan.strong,
		ansi.white.strong,
	];
};

const sequences = (colors) => {
	return colors
		.map((color, index) => {
			const slot = index.toString(16).toUpperCase();

			return `\x1b]P${slot}${color.slice(1, 7)}`;
		})
		.join("");
};

export default (scheme, { config }) => {
	return {
		directory: path.join(config, "console"),
		files: [
			{
				path: "palette",
				data: sequences(palette(scheme.theme.dark.roles)),
			},
		],
	};
};

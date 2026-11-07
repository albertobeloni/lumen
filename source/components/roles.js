const MIDDLE = 20;

const away = (level, distance) =>
	level <= MIDDLE ? level + distance : level - distance;

const color = (palette, level) => ({ palette, level });

const contrast = (palette, level) => ({
	normal: color(palette, away(level, 20)),
	strong: color(palette, away(level, 26)),
	subtle: color(palette, away(level, 16)),
});

const shade = (palette, level) => ({
	normal: color(palette, away(level, 4)),
	strong: color(palette, away(level, 10)),
	subtle: color(palette, away(level, 0)),
});

const surface = (palette, level) => ({
	background: color(palette, level),
	foreground: contrast(palette, level),
	outline: {
		normal: color(palette, away(level, 8)),
		strong: color(palette, away(level, 16)),
		subtle: color(palette, away(level, 2)),
	},
});

export default (dark) => ({
	accent: {
		base: {
			...surface("base", 26),
			color: color("base", 20),
			container: surface("base", 8),
		},
		primary: {
			...surface("primary", 26),
			color: color("primary", 20),
			container: surface("primary", 8),
		},
		secondary: {
			...surface("secondary", 26),
			color: color("secondary", 20),
			container: surface("secondary", 8),
		},
		tertiary: {
			...surface("tertiary", 26),
			color: color("tertiary", 20),
			container: surface("tertiary", 8),
		},
	},
	surface: {
		field: surface("base", 0),
		frame: surface("base", 1),
		panel: surface("base", 2),
		modal: surface("base", 3),
		popup: surface("base", 4),
	},
	color: {
		red: {
			...surface("red", 26),
			color: color("red", 20),
			container: surface("red", 8),
		},
		yellow: {
			...surface("yellow", 26),
			color: color("yellow", 20),
			container: surface("yellow", 8),
		},
		green: {
			...surface("green", 26),
			color: color("green", 20),
			container: surface("green", 8),
		},
		cyan: {
			...surface("cyan", 26),
			color: color("cyan", 20),
			container: surface("cyan", 8),
		},
		blue: {
			...surface("blue", 26),
			color: color("blue", 20),
			container: surface("blue", 8),
		},
		magenta: {
			...surface("magenta", 26),
			color: color("magenta", 20),
			container: surface("magenta", 8),
		},
	},
	status: {
		critical: { role: "color.red" },
		caution: { role: "color.yellow" },
		success: { role: "color.green" },
		notice: { role: "color.blue" },
	},
	syntax: {
		attribute: { role: "surface.field.foreground.normal" },
		comment: { role: "surface.field.foreground.subtle" },
		constant: { role: "accent.primary.color" },
		function: { role: "accent.tertiary.color" },
		keyword: { role: "accent.primary.color" },
		number: { role: "accent.secondary.color" },
		operator: { role: "surface.field.foreground.subtle" },
		property: { role: "surface.field.foreground.normal" },
		punctuation: { role: "surface.field.foreground.subtle" },
		special: { role: "color.cyan.color" },
		string: { role: "accent.secondary.color" },
		tag: { role: "accent.tertiary.color" },
		type: { role: "accent.tertiary.color" },
		variable: { role: "surface.field.foreground.normal" },
	},
	ansi: {
		black: dark ? shade("base", 0) : contrast("base", 0),
		red: contrast("red", 0),
		yellow: contrast("yellow", 0),
		green: contrast("green", 0),
		cyan: contrast("cyan", 0),
		blue: contrast("blue", 0),
		magenta: contrast("magenta", 0),
		white: dark ? contrast("base", 0) : shade("base", 0),
	},
	scrim: { value: "#000000", alpha: 0.75 },
	shadow: { value: "#000000", alpha: 0.25 },
});

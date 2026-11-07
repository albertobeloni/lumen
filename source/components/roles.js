const MIDDLE = 20;

const away = (level, distance) => {
	return level <= MIDDLE ? level + distance : level - distance;
};

const color = (palette, level) => {
	return { palette, level };
};

const contrast = (palette, level) => {
	return {
		normal: color(palette, away(level, 20)),
		strong: color(palette, away(level, 26)),
		subtle: color(palette, away(level, 16)),
	};
};

const shade = (palette, level) => {
	return {
		normal: color(palette, away(level, 4)),
		strong: color(palette, away(level, 10)),
		subtle: color(palette, away(level, 0)),
	};
};

const surface = (palette, level) => {
	return {
		background: color(palette, level),
		foreground: contrast(palette, level),
		outline: {
			normal: color(palette, away(level, 8)),
			strong: color(palette, away(level, 16)),
			subtle: color(palette, away(level, 2)),
		},
	};
};

const hue = (palette) => {
	return {
		...surface(palette, 26),
		color: color(palette, 20),
		container: surface(palette, 4),
	};
};

export default (dark) => {
	return {
		accent: {
			base: hue("base"),
			primary: hue("primary"),
			secondary: hue("secondary"),
			tertiary: hue("tertiary"),
		},
		surface: {
			field: surface("base", 0),
			frame: surface("base", 1),
			panel: surface("base", 2),
			modal: surface("base", 3),
			popup: surface("base", 4),
		},
		overlay: {
			normal: { role: "surface.field.foreground.strong", alpha: 0.1 },
			strong: { role: "surface.field.foreground.strong", alpha: 0.2 },
			subtle: { role: "surface.field.foreground.strong", alpha: 0.05 },
		},
		color: {
			red: hue("red"),
			yellow: hue("yellow"),
			green: hue("green"),
			cyan: hue("cyan"),
			blue: hue("blue"),
			magenta: hue("magenta"),
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
			green: contrast("green", 0),
			yellow: contrast("yellow", 0),
			blue: contrast("blue", 0),
			magenta: contrast("magenta", 0),
			cyan: contrast("cyan", 0),
			white: dark ? contrast("base", 0) : shade("base", 0),
		},
		scrim: { value: "#000000", alpha: 0.75 },
		shadow: { value: "#000000", alpha: 0.25 },
	};
};

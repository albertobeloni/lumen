const MIDDLE = 20;

const FOREGROUND = { silent: 12, subtle: 16, normal: 20, strong: 26 };
const OUTLINE = { silent: 3, subtle: 4, normal: 8, strong: 16 };
const SHADE = { silent: 0, subtle: 2, normal: 4, strong: 10 };
const OVERLAY = { silent: 0.05, subtle: 0.075, normal: 0.1, strong: 0.2 };

const away = (level, distance) => {
	return level <= MIDDLE ? level + distance : level - distance;
};

const color = (palette, level) => {
	return { palette, level };
};

const levels = (palette, level, distances) => {
	return Object.fromEntries(
		Object.entries(distances).map(([name, distance]) => {
			return [name, color(palette, away(level, distance))];
		}),
	);
};

const overlay = (palette, level) => {
	const tone = color(palette, away(level, FOREGROUND.strong));

	return Object.fromEntries(
		Object.entries(OVERLAY).map(([name, alpha]) => {
			return [name, { ...tone, alpha }];
		}),
	);
};

const surface = (palette, level) => {
	return {
		background: color(palette, level),
		foreground: levels(palette, level, FOREGROUND),
		outline: levels(palette, level, OUTLINE),
		overlay: overlay(palette, level),
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
			attribute: { role: "accent.secondary.color" },
			comment: { role: "surface.field.foreground.silent" },
			constant: { role: "accent.primary.color" },
			function: { role: "accent.tertiary.color" },
			keyword: { role: "accent.primary.color" },
			number: { role: "surface.field.foreground.normal" },
			operator: { role: "surface.field.foreground.normal" },
			property: { role: "accent.secondary.color" },
			punctuation: { role: "surface.field.foreground.silent" },
			special: { role: "surface.field.foreground.normal" },
			string: { role: "surface.field.foreground.normal" },
			tag: { role: "accent.tertiary.color" },
			type: { role: "accent.tertiary.color" },
			variable: { role: "accent.secondary.color" },
		},
		ansi: {
			black: dark
				? levels("base", 0, SHADE)
				: levels("base", 0, FOREGROUND),
			red: levels("red", 0, FOREGROUND),
			green: levels("green", 0, FOREGROUND),
			yellow: levels("yellow", 0, FOREGROUND),
			blue: levels("blue", 0, FOREGROUND),
			magenta: levels("magenta", 0, FOREGROUND),
			cyan: levels("cyan", 0, FOREGROUND),
			white: dark
				? levels("base", 0, FOREGROUND)
				: levels("base", 0, SHADE),
		},
		scrim: { value: "#000000", alpha: 0.75 },
		shadow: { value: "#000000", alpha: 0.25 },
	};
};

const MIDDLE = 20;

const ACCENT = { background: 26, color: 20, container: 4 };
const FOREGROUND = { silent: 12, subtle: 16, normal: 20, strong: 26 };
const OUTLINE = { silent: 3, subtle: 4, normal: 8, strong: 16 };
const OVERLAY = { silent: 0.05, subtle: 0.075, normal: 0.1, strong: 0.2 };
const SHADE = { silent: 0, subtle: 2, normal: 4, strong: 10 };
const TINT = { silent: 0.05, subtle: 0.1, normal: 0.15, strong: 0.25 };

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

const translucent = (node, opacities) => {
	return Object.fromEntries(
		Object.entries(opacities).map(([name, alpha]) => {
			return [name, { ...node, alpha }];
		}),
	);
};

const surface = (palette, level) => {
	return {
		background: color(palette, level),
		foreground: levels(palette, level, FOREGROUND),
		outline: levels(palette, level, OUTLINE),
		overlay: translucent(
			color(palette, away(level, FOREGROUND.strong)),
			OVERLAY,
		),
	};
};

const hue = (palette) => {
	return {
		...surface(palette, ACCENT.background),
		color: color(palette, ACCENT.color),
		container: surface(palette, ACCENT.container),
		tint: translucent(color(palette, ACCENT.color), TINT),
	};
};

const family = (palette) => {
	return {
		...hue(palette),
		more: hue(`${palette}-more`),
		less: hue(`${palette}-less`),
	};
};

export default (dark) => {
	return {
		base: {
			...hue("base"),
			variant: hue("base-variant"),
		},
		accent: {
			primary: family("primary"),
			secondary: family("secondary"),
		},
		ui: {
			selection: { role: "base.variant.color", alpha: 0.1 },
			focus: { role: "accent.primary.color" },
			cursor: { role: "accent.primary.color" },
			link: {
				normal: { role: "color.blue.color" },
				visited: { role: "color.purple.color" },
			},
			match: {
				all: { role: "surface.field.overlay.subtle" },
				current: { role: "accent.primary.color", alpha: 0.2 },
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
			red: hue("red"),
			orange: hue("orange"),
			yellow: hue("yellow"),
			lime: hue("lime"),
			green: hue("green"),
			teal: hue("teal"),
			cyan: hue("cyan"),
			azure: hue("azure"),
			blue: hue("blue"),
			purple: hue("purple"),
			magenta: hue("magenta"),
			pink: hue("pink"),
		},
		status: {
			critical: { role: "color.red" },
			caution: { role: "color.yellow" },
			success: { role: "color.green" },
			notice: { role: "color.blue" },
			created: { role: "color.green" },
			deleted: { role: "color.red" },
			modified: { role: "color.yellow" },
		},
		syntax: {
			attribute: { role: "base.variant.color" },
			comment: { role: "surface.field.foreground.silent" },
			constant: { role: "accent.primary.more.color" },
			function: { role: "accent.secondary.color" },
			keyword: { role: "accent.primary.color" },
			number: { role: "accent.primary.more.color" },
			operator: { role: "surface.field.foreground.subtle" },
			property: { role: "surface.field.foreground.normal" },
			punctuation: { role: "surface.field.foreground.silent" },
			special: { role: "accent.secondary.less.color" },
			string: { role: "accent.primary.less.color" },
			tag: { role: "accent.secondary.more.color" },
			type: { role: "accent.secondary.more.color" },
			variable: { role: "surface.field.foreground.normal" },
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

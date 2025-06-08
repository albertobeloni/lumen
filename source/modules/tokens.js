export default function tokens(scheme) {
	const tokens = {};

	tokens.color = {};

	tokens.background = {
		primary: scheme.serialize(scheme.background),
		secondary: scheme.select(
			scheme.darken(scheme.background, 0.100),
			scheme.darken(scheme.background, 0.025)
		),
		tertiary: scheme.select(
			scheme.darken(scheme.background, 0.150),
			scheme.darken(scheme.background, 0.050)
		),
		dim: scheme.select(
			scheme.darken(scheme.background, 0.050),
			scheme.darken(scheme.background, 0.015)
		),

		accent: scheme.primary(scheme.accent),
		error: scheme.relative(scheme.primary("red"), 5),
		warning: scheme.relative(scheme.primary("yellow"), 5),
		success: scheme.relative(scheme.primary("green"), 5),
		info: scheme.relative(scheme.primary("blue"), 5),

		selection: {
			active: scheme.fade(scheme.primary(scheme.accent), 0.25),
			inactive: scheme.fade(scheme.primary(scheme.accent), 0.10),
			dim: scheme.fade(scheme.primary("base"), 0.05)
		},

		highlight: {
			active: scheme.fade(scheme.primary(scheme.accent), 0.50),
			inactive: scheme.fade(scheme.primary(scheme.accent), 0.25),
			dim: scheme.fade(scheme.primary("base"), 0.05)
		},

		overlay: {
			primary: scheme.fade(scheme.primary("base"), 0.20),
			secondary: scheme.fade(scheme.primary("base"), 0.10)
		}
	};

	tokens.foreground = {
		primary: scheme.relative(scheme.primary("base"), -2),
		secondary: scheme.primary("base"),
		tertiary: scheme.relative(scheme.primary("base"), 2),

		strong: scheme.relative(scheme.primary("base"), -5),
		dim: scheme.relative(scheme.primary("base"), 4),

		accent: scheme.primary(scheme.accent),
		error: scheme.primary("red"),
		warning: scheme.primary("yellow"),
		success: scheme.primary("green"),
		info: scheme.primary("blue"),

		on_accent: scheme.select(
			scheme.serialize(scheme.foreground),
			scheme.serialize(scheme.background)
		),
		on_error: scheme.contrast(tokens.background.error),
		on_warning: scheme.contrast(tokens.background.warning),
		on_success: scheme.contrast(tokens.background.success),
		on_info: scheme.contrast(tokens.background.info),

		highlight: {
			active: scheme.fade(scheme.foreground, 0.90),
			inactive: scheme.fade(scheme.foreground, 0.75)
		}
	};

	tokens.border = {
		primary: scheme.select(
			scheme.lighten(tokens.background.tertiary, 0.5),
			scheme.darken(tokens.background.tertiary, 0.1),
		),
		secondary: scheme.select(
			scheme.lighten(tokens.background.tertiary, 0.35),
			scheme.darken(tokens.background.tertiary, 0.05),
		),

		accent: scheme.primary(scheme.accent),
		error: scheme.primary("red"),
		warning: scheme.primary("yellow"),
		success: scheme.primary("green"),
		info: scheme.primary("blue"),

		on_accent: scheme.relative(tokens.background.accent, -1),
		on_error: scheme.relative(tokens.background.error, -1),
		on_warning: scheme.relative(tokens.background.warning, -1),
		on_success: scheme.relative(tokens.background.success, -1),
		on_info: scheme.relative(tokens.background.info, -1),

		on_primary: scheme.select(
			scheme.darken(tokens.background.primary, 0.20),
			scheme.darken(tokens.background.primary, 0.075)
		),
		on_secondary: scheme.select(
			scheme.darken(tokens.background.secondary, 0.20),
			scheme.darken(tokens.background.secondary, 0.075)
		),
		on_tertiary: scheme.select(
			scheme.darken(tokens.background.tertiary, 0.20),
			scheme.darken(tokens.background.tertiary, 0.075)
		),
		on_selection: {
			active: scheme.fade(scheme.primary(scheme.accent), 0.30),
			inactive: scheme.fade(scheme.primary(scheme.accent), 0.15),
			dim: scheme.fade(scheme.primary("base"), 0.10)
		}
	};

	for (const color in scheme.colors) {
		const scale = scheme.colors[color];

		tokens.color[color] = {};

		for (const step in scale) {
			tokens.color[color][step] = scheme.serialize(scale[step]);
		}

		tokens.color[color].primary = scheme.primary(color);
		tokens.color[color].secondary = scheme.secondary(color);
		tokens.background[color] = scheme.primary(color);
		tokens.foreground[color] = scheme.primary(color);
		tokens.foreground["on_" + color] = scheme.contrast(scheme.primary(color));
		tokens.border[color] = scheme.primary(color);
		tokens.border["on_" + color] = scheme.relative(scheme.primary(color), -1);
	}

	tokens.hidden = scheme.fade(scheme.background, 0);
	tokens.shadow = scheme.select(
		scheme.fade("black", 0.30),
		scheme.fade("black", 0.075)
	);

	tokens.fade = (color, amount) => {
		return scheme.fade(color, amount);
	};

	tokens.disable = (color) => {
		return scheme.serialize(scheme.base(scheme.find(color).step));
	};

	tokens.hover = (color) => {
		return scheme.relative(color, 1);
	};

	tokens.text = (color) => {
		return scheme.contrast(color);
	};

	tokens.code = {
		comment: tokens.foreground.tertiary,
		punctuation: tokens.foreground.secondary,
		operator: tokens.foreground.secondary,

		keyword: scheme.select(
			tokens.foreground.secondary,
			tokens.foreground.secondary
		),

		storage: {
			modifier: scheme.select(
				tokens.foreground.secondary,
				tokens.foreground.secondary
			),
			type: scheme.select(
				tokens.foreground.secondary,
				tokens.foreground.secondary
			)
		},

		entity: scheme.select(
			tokens.foreground.azure,
			tokens.foreground.blue
		),
		class: scheme.select(
			tokens.foreground.azure,
			tokens.foreground.blue
		),
		method: scheme.select(
			tokens.foreground.orange,
			tokens.foreground.yellow
		),
		property: scheme.select(
			tokens.foreground.primary,
			tokens.foreground.primary
		),

		function: scheme.select(
			tokens.foreground.orange,
			tokens.foreground.yellow
		),
		parameter: scheme.select(
			tokens.foreground.teal,
			tokens.foreground.cyan
		),

		variable: scheme.select(
			tokens.foreground.primary,
			tokens.foreground.primary
		),

		constant: scheme.select(
			tokens.foreground.primary,
			tokens.foreground.primary
		),
		number: scheme.select(
			tokens.foreground.indigo,
			tokens.foreground.purple
		),
		character: scheme.select(
			tokens.foreground.indigo,
			tokens.foreground.purple
		),
		language: scheme.select(
			tokens.foreground.magenta,
			tokens.foreground.magenta
		),

		label: scheme.select(
			tokens.foreground.secondary,
			tokens.foreground.secondary
		),
		decorator: scheme.select(
			tokens.foreground.secondary,
			tokens.foreground.secondary
		),
		annotation: scheme.select(
			tokens.foreground.secondary,
			tokens.foreground.secondary
		),

		string: scheme.select(
			tokens.foreground.lime,
			tokens.foreground.green
		),
		regexp: scheme.select(
			tokens.foreground.indigo,
			tokens.foreground.purple
		),

		tag: scheme.select(
			tokens.foreground.secondary,
			tokens.foreground.secondary
		),

		section: scheme.select(
			tokens.foreground.primary,
			tokens.foreground.primary
		),
		text: {
			normal: tokens.foreground.secondary,
			strong: tokens.foreground.primary,
			dim: tokens.foreground.tertiary
		},
		link: scheme.select(
			tokens.foreground.azure,
			tokens.foreground.blue
		),
		illegal: tokens.foreground.error,
		deprecated: tokens.foreground.warning
	};

	tokens.ansi = {
		primary: {
			black: tokens.background.primary,
			red: scheme.select(
				tokens.color.magenta.primary,
				tokens.color.red.primary
			),
			yellow: scheme.select(
				tokens.color.orange.primary,
				tokens.color.yellow.primary
			),
			green: scheme.select(
				tokens.color.lime.primary,
				tokens.color.green.primary
			),
			cyan: scheme.select(
				tokens.color.teal.primary,
				tokens.color.cyan.primary
			),
			blue: scheme.select(
				tokens.color.azure.primary,
				tokens.color.blue.primary
			),
			magenta: scheme.select(
				tokens.color.indigo.primary,
				tokens.color.purple.primary
			),
			white: tokens.foreground.primary
		},
		secondary: {
			black: tokens.foreground.dim,
			red: scheme.select(
				scheme.magenta(1),
				scheme.red(1)
			),
			yellow: scheme.select(
				scheme.orange(1),
				scheme.yellow(1)
			),
			green: scheme.select(
				scheme.lime(1),
				scheme.green(1)
			),
			cyan: scheme.select(
				scheme.teal(1),
				scheme.cyan(1)
			),
			blue: scheme.select(
				scheme.azure(1),
				scheme.blue(1)
			),
			magenta: scheme.select(
				scheme.indigo(1),
				scheme.purple(1)
			),
			white: tokens.foreground.secondary
		}
	};

	return tokens;
}

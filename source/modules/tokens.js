const text = {
	strong: 7,
	primary: 4,
	secondary: 2,
	tertiary: 0,
	dim: -2
};

const tint = -8;

const surface = {
	dim: 1.5,
	secondary: 3,
	tertiary: 5
};

const border = {
	primary: 15,
	secondary: 10
};

const hover = 2;

export default function tokens(scheme) {
	const tokens = {};
	const background = scheme.serialize(scheme.background);
	const foreground = scheme.serialize(scheme.foreground);
	const base = (offset) => scheme.base(scheme.step(offset));
	const tinted = (id) => scheme[id](scheme.step(tint));

	tokens.color = {};

	tokens.background = {
		primary: background,
		secondary: scheme.shift(background, surface.secondary),
		tertiary: scheme.shift(background, surface.tertiary),
		dim: scheme.shift(background, surface.dim),

		accent: scheme.primary(scheme.accent),
		error: tinted("red"),
		warning: tinted("yellow"),
		success: tinted("green"),
		info: tinted("blue"),

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
		primary: base(text.primary),
		secondary: base(text.secondary),
		tertiary: base(text.tertiary),

		strong: base(text.strong),
		dim: base(text.dim),

		accent: scheme.primary(scheme.accent),
		error: scheme.primary("red"),
		warning: scheme.primary("yellow"),
		success: scheme.primary("green"),
		info: scheme.primary("blue"),

		on_accent: background,
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
		primary: scheme.shift(background, border.primary),
		secondary: scheme.shift(background, border.secondary),

		accent: scheme.primary(scheme.accent),
		error: scheme.primary("red"),
		warning: scheme.primary("yellow"),
		success: scheme.primary("green"),
		info: scheme.primary("blue"),

		on_accent: scheme.relative(tokens.background.accent, -hover),
		on_error: scheme.relative(tokens.background.error, -hover),
		on_warning: scheme.relative(tokens.background.warning, -hover),
		on_success: scheme.relative(tokens.background.success, -hover),
		on_info: scheme.relative(tokens.background.info, -hover),

		on_primary: scheme.shift(tokens.background.primary, border.secondary),
		on_secondary: scheme.shift(tokens.background.secondary, border.secondary),
		on_tertiary: scheme.shift(tokens.background.tertiary, border.secondary),
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
		tokens.border["on_" + color] = scheme.relative(scheme.primary(color), -hover);
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
		return scheme.base(scheme.find(color).step);
	};

	tokens.hover = (color) => {
		return scheme.relative(color, hover);
	};

	tokens.text = (color) => {
		return scheme.contrast(color);
	};

	tokens.code = {
		comment: tokens.foreground.tertiary,
		punctuation: tokens.foreground.secondary,
		operator: tokens.foreground.secondary,
		keyword: tokens.foreground.secondary,

		storage: {
			modifier: tokens.foreground.secondary,
			type: tokens.foreground.secondary
		},

		entity: scheme.select(tokens.foreground.azure, tokens.foreground.blue),
		class: scheme.select(tokens.foreground.azure, tokens.foreground.blue),
		method: scheme.select(tokens.foreground.orange, tokens.foreground.yellow),
		property: tokens.foreground.primary,

		function: scheme.select(tokens.foreground.orange, tokens.foreground.yellow),
		parameter: scheme.select(tokens.foreground.teal, tokens.foreground.cyan),

		variable: tokens.foreground.primary,

		constant: tokens.foreground.primary,
		number: scheme.select(tokens.foreground.indigo, tokens.foreground.purple),
		character: scheme.select(tokens.foreground.indigo, tokens.foreground.purple),
		language: tokens.foreground.magenta,

		label: tokens.foreground.secondary,
		decorator: tokens.foreground.secondary,
		annotation: tokens.foreground.secondary,

		string: scheme.select(tokens.foreground.lime, tokens.foreground.green),
		regexp: scheme.select(tokens.foreground.indigo, tokens.foreground.purple),

		tag: tokens.foreground.secondary,

		section: tokens.foreground.primary,
		text: {
			normal: tokens.foreground.secondary,
			strong: tokens.foreground.primary,
			dim: tokens.foreground.tertiary
		},
		link: scheme.select(tokens.foreground.azure, tokens.foreground.blue),
		illegal: tokens.foreground.error,
		deprecated: tokens.foreground.warning
	};

	const ansi = (offset) => ({
		red: scheme.red(scheme.step(offset)),
		yellow: scheme.yellow(scheme.step(offset)),
		green: scheme.green(scheme.step(offset)),
		cyan: scheme.cyan(scheme.step(offset)),
		blue: scheme.blue(scheme.step(offset)),
		magenta: scheme.magenta(scheme.step(offset))
	});

	const black = scheme.base(scheme.length() - 1);
	const white = scheme.base(0);

	tokens.ansi = {
		background: scheme.serialize(scheme.background),
		foreground: scheme.serialize(scheme.foreground),
		primary: {
			black: black,
			...ansi(2),
			white: scheme.contrast(white)
		},
		secondary: {
			black: scheme.contrast(black),
			...ansi(4),
			white: white
		}
	};

	return tokens;
}

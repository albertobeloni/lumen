import { block, chip, heading, line, ratio, tone } from "./components.js";
import { column, node, row } from "./layout.js";
import { baseline, LINE, SPACE, split, TYPE, WIDTH } from "./style.js";
import { element, rect, text } from "./svg.js";

const section = (label, roles, content) => {
	return column(
		[heading(label, roles.surface.field.foreground.subtle, WIDTH), content],
		SPACE.m,
	);
};

export const header = (roles, title) => {
	const { foreground } = roles.surface.field;

	return column(
		[
			node(
				WIDTH,
				28,
				text(title, { ...TYPE.title, y: 22, fill: foreground.strong }),
			),
			node(
				WIDTH,
				LINE,
				text("WCAG 2.1 contrast · ● ≥ 7 · ≥ 4.5 · ◐ ≥ 3 · ✕ < 3", {
					...TYPE.body,
					y: baseline(LINE, TYPE.body.size),
					fill: foreground.subtle,
				}),
			),
		],
		SPACE.xs,
	);
};

const tones = (label, entries, roles) => {
	const width = split(Object.keys(entries).length);
	const field = roles.surface.field.background;

	return section(
		label,
		roles,
		row(
			Object.entries(entries).map(([name, value]) =>
				tone(name, value, field, width),
			),
			SPACE.l,
		),
	);
};

export const accents = (roles) => tones("Accents", roles.accent, roles);
export const colors = (roles) => tones("Colors", roles.color, roles);

export const surfaces = (roles) => {
	const width = split(Object.keys(roles.surface).length);

	return section(
		"Surfaces",
		roles,
		row(
			Object.entries(roles.surface).map(([name, value]) =>
				block(name, value, width),
			),
			SPACE.l,
		),
	);
};

export const ansi = (roles) => {
	const names = Object.keys(roles.ansi);
	const width = split(names.length);
	const field = roles.surface.field;

	const labels = row(
		names.map((name) => {
			return node(
				width,
				LINE,
				text(name, {
					...TYPE.body,
					weight: 600,
					y: baseline(LINE, TYPE.body.size),
					fill: field.foreground.normal,
				}),
			);
		}),
		SPACE.l,
	);

	const levels = ["strong", "normal", "subtle"].map((level) => {
		return row(
			names.map((name) =>
				chip(roles.ansi[name][level], level, field, width),
			),
			SPACE.l,
		);
	});

	return section("ANSI", roles, column([labels, ...levels], SPACE.m));
};

const CODE = [
	[["comment", "// Equal contrast steps between tones"]],
	[
		["keyword", "import"],
		["punctuation", " { "],
		["variable", "Color"],
		["punctuation", " } "],
		["keyword", "from"],
		["punctuation", " "],
		["string", '"colorjs.io"'],
		["punctuation", ";"],
	],
	[],
	[
		["keyword", "const"],
		["punctuation", " "],
		["constant", "STEPS"],
		["operator", " = "],
		["number", "41"],
		["punctuation", ";"],
	],
	[
		["keyword", "const"],
		["punctuation", " "],
		["variable", "white"],
		["operator", " = "],
		["punctuation", "{ "],
		["property", "tone"],
		["punctuation", ": "],
		["number", "100"],
		["punctuation", " };"],
	],
	[],
	[
		["keyword", "export"],
		["punctuation", " "],
		["keyword", "const"],
		["punctuation", " "],
		["function", "scale"],
		["operator", " = "],
		["punctuation", "("],
		["variable", "steps"],
		["punctuation", ": "],
		["type", "number"],
		["punctuation", "): "],
		["type", "Tone"],
		["punctuation", "[] "],
		["operator", "=>"],
		["punctuation", " {"],
	],
	[
		["punctuation", "    "],
		["keyword", "return"],
		["punctuation", " "],
		["function", "range"],
		["punctuation", "("],
		["variable", "steps"],
		["punctuation", ")."],
		["function", "map"],
		["punctuation", "(("],
		["variable", "index"],
		["punctuation", ") "],
		["operator", "=>"],
		["punctuation", " ("],
	],
	[
		["punctuation", "        <"],
		["tag", "Tone"],
		["punctuation", " "],
		["attribute", "level"],
		["operator", "="],
		["punctuation", "{"],
		["variable", "index"],
		["punctuation", "} />"],
	],
	[["punctuation", "    ));"]],
	[["punctuation", "};"]],
];

const code = (syntax, width) => {
	const { size } = TYPE.code;
	const advance = size * 0.6;
	const height = CODE.length * LINE;

	return node(
		width,
		height,
		CODE.flatMap((tokens, index) => {
			let column = 0;

			return tokens.map(([role, content]) => {
				const x = column * advance;
				column += content.length;

				return text(content, {
					...TYPE.code,
					x,
					y: index * LINE + baseline(LINE, size),
					fill: syntax[role],
				});
			});
		}),
	);
};

export const syntax = (roles) => {
	const field = roles.surface.field.background;
	const width = split(3);
	const legend = Object.entries(roles.syntax).map(([name, fill]) =>
		line(name, fill, field, width),
	);

	return section(
		"Syntax",
		roles,
		row(
			[code(roles.syntax, WIDTH - width - SPACE.l), column(legend)],
			SPACE.l,
		),
	);
};

export const status = (roles) => {
	const width = split(Object.keys(roles.status).length);
	const field = roles.surface.field.background;

	const alias = (value) => {
		return Object.keys(roles.color).find((name) => {
			return roles.color[name].color === value.color;
		});
	};

	const pill = (name, value) => {
		const { background, foreground } = value.container;
		const y = baseline(40, TYPE.label.size);

		return node(width, 40, [
			rect(width, 40, background),
			rect(10, 10, foreground.strong, { x: 16, y: 15, rx: 5 }),
			text(name, { ...TYPE.label, x: 34, y, fill: foreground.strong }),
			text(alias(value) ?? "", {
				...TYPE.body,
				x: width - 16,
				y,
				anchor: "end",
				fill: foreground.subtle,
			}),
		]);
	};

	return section(
		"Status",
		roles,
		row(
			Object.entries(roles.status).map(([name, value]) => {
				return column(
					[
						pill(name, value),
						line("color", value.color, field, width),
					],
					SPACE.s,
				);
			}),
			SPACE.l,
		),
	);
};

const translucent = (value) => {
	return {
		fill: value.slice(0, 7),
		opacity:
			Math.round((parseInt(value.slice(7, 9), 16) / 255) * 100) / 100,
	};
};

const card = (surface, label, x, y, width, height) => {
	const inner = width - SPACE.l * 2;

	return [
		rect(width, height, surface.background, { x, y, rx: 6 }),
		text(label, {
			...TYPE.label,
			x: x + SPACE.l,
			y: y + 28,
			fill: surface.foreground.strong,
		}),
		text(ratio(surface.foreground.normal, surface.background), {
			...TYPE.body,
			x: x + width - SPACE.l,
			y: y + 28,
			anchor: "end",
			fill: surface.foreground.normal,
		}),
		rect(inner, 8, surface.foreground.subtle, {
			x: x + SPACE.l,
			y: y + 48,
			rx: 4,
		}),
		rect(inner * 0.6, 8, surface.foreground.subtle, {
			x: x + SPACE.l,
			y: y + 64,
			rx: 4,
		}),
	];
};

const content = (roles, width) => {
	const { foreground } = roles.surface.field;
	const lengths = [0.7, 0.9, 0.5, 0.8, 0.6, 0.85, 0.4];

	return [
		rect(48, 48, roles.accent.primary.background, { x: 24, y: 24, rx: 6 }),
		rect(48, 48, roles.accent.tertiary.background, { x: 80, y: 24, rx: 6 }),
		...lengths.map((length, index) => {
			return rect((width - 48) * length, 8, foreground.subtle, {
				x: 24,
				y: 92 + index * 16,
				rx: 4,
			});
		}),
	];
};

export const overlays = (roles, id) => {
	const width = split(2);
	const height = 216;
	const field = roles.surface.field;
	const [cw, ch] = [width * 0.6, 96];
	const [cx, cy] = [(width - cw) / 2, (height - ch) / 2];
	const scrim = translucent(roles.scrim);
	const shadow = translucent(roles.shadow);

	const frame = (children) => {
		return node(width, height, [
			rect(width - 1, height - 1, field.background, {
				x: 0.5,
				y: 0.5,
				stroke: field.outline.subtle,
			}),
			...children,
		]);
	};

	const caption = (label, value) => {
		return line(
			`${label} ${value.fill} · ${Math.round(value.opacity * 100)}%`,
			field.foreground.subtle,
			field.background,
			width,
		);
	};

	const filter = element(
		"defs",
		{},
		element(
			"filter",
			{ id, x: "-50%", y: "-50%", width: "200%", height: "200%" },
			element("feGaussianBlur", { stdDeviation: 8 }),
		),
	);

	const scrimmed = frame([
		...content(roles, width),
		rect(width, height, scrim.fill, { "fill-opacity": scrim.opacity }),
		...card(roles.surface.modal, "modal", cx, cy, cw, ch),
	]);

	const shadowed = frame([
		filter,
		...content(roles, width),
		rect(cw, ch, shadow.fill, {
			x: cx,
			y: cy + 8,
			rx: 6,
			"fill-opacity": shadow.opacity,
			filter: `url(#${id})`,
		}),
		...card(roles.surface.popup, "popup", cx, cy, cw, ch),
	]);

	return section(
		"Overlays",
		roles,
		row(
			[
				column([scrimmed, caption("scrim", scrim)], SPACE.s),
				column([shadowed, caption("shadow", shadow)], SPACE.s),
			],
			SPACE.l,
		),
	);
};

export const ramps = ({ palette, roles }) => {
	const label = 88;
	const field = roles.surface.field;
	const offset = palette.base.indexOf(field.background);
	const count = palette.base.length;
	const size = (WIDTH - label) / count;
	const names = Object.keys(palette).filter((name) => {
		return !["black", "white"].includes(name);
	});

	const strip = (name) => {
		return node(WIDTH, LINE, [
			text(name, {
				...TYPE.body,
				y: baseline(LINE, TYPE.body.size),
				fill: field.foreground.normal,
			}),
			...palette[name].map((fill, index) => {
				return rect(size + 0.5, LINE, fill, {
					x: label + index * size,
				});
			}),
			rect(WIDTH - label, LINE, "none", {
				x: label,
				stroke: field.outline.subtle,
			}),
		]);
	};

	const axis = node(
		WIDTH,
		LINE,
		palette.base.flatMap((_, index) => {
			const level = index - offset;

			if (level % 4 !== 0) {
				return [];
			}

			return [
				text(level, {
					...TYPE.body,
					x: label + (index + 0.5) * size,
					y: baseline(LINE, TYPE.body.size),
					anchor: "middle",
					fill: field.foreground.subtle,
				}),
			];
		}),
	);

	return section(
		"Tones",
		roles,
		column([...names.map(strip), axis], SPACE.xs),
	);
};

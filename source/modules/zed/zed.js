import os from "node:os";
import path from "node:path";

import { alpha } from "../../components/color.js";

const CONFIG =
	process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config");

const SCHEMA = "https://zed.dev/schema/themes/v0.2.0.json";
const TRANSPARENT = "#00000000";

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

const terminal = ({ ansi, surface }) => {
	const { field } = surface;

	const colors = ANSI.flatMap((name) => {
		const { normal, strong, subtle } = ansi[name];

		return [
			[`terminal.ansi.${name}`, normal],
			[`terminal.ansi.bright_${name}`, strong],
			[`terminal.ansi.dim_${name}`, subtle],
		];
	});

	return {
		"terminal.background": field.background,
		"terminal.foreground": field.foreground.normal,
		"terminal.bright_foreground": field.foreground.strong,
		"terminal.dim_foreground": field.foreground.subtle,
		"terminal.ansi.background": field.background,
		...Object.fromEntries(colors),
	};
};

const statuses = ({ color, surface }) => {
	const { frame } = surface;

	const neutral = {
		color: frame.foreground.subtle,
		container: {
			background: frame.outline.subtle,
			outline: { normal: frame.outline.normal },
		},
	};

	const sources = {
		error: color.red,
		warning: color.yellow,
		success: color.green,
		info: color.blue,
		hint: color.cyan,
		conflict: color.yellow,
		created: color.green,
		deleted: color.red,
		modified: color.yellow,
		renamed: color.blue,
		hidden: neutral,
		ignored: neutral,
		predictive: neutral,
		unreachable: neutral,
	};

	return Object.fromEntries(
		Object.entries(sources).flatMap(([name, source]) => [
			[name, source.color],
			[`${name}.background`, source.container.background],
			[`${name}.border`, source.container.outline.normal],
		]),
	);
};

const players = ({ accent, color }) => {
	const sources = [
		accent.primary,
		accent.tertiary,
		accent.secondary,
		color.red,
		color.yellow,
		color.green,
		color.cyan,
		color.magenta,
	];

	return sources.map((source) => ({
		cursor: source.color,
		background: source.color,
		selection: alpha(source.color, 0.24),
	}));
};

const accents = ({ accent, color }) => {
	const sources = [
		accent.primary,
		accent.secondary,
		accent.tertiary,
		color.cyan,
		color.magenta,
		color.yellow,
	];

	return sources.map((source) => source.color);
};

const syntax = ({ accent, color, surface, syntax }) => {
	const { field } = surface;

	const tokens = {
		attribute: syntax.attribute,
		boolean: syntax.constant,
		comment: syntax.comment,
		"comment.doc": syntax.comment,
		constant: syntax.constant,
		constructor: syntax.type,
		"diff.minus": color.red.color,
		"diff.plus": color.green.color,
		embedded: syntax.variable,
		emphasis: { color: field.foreground.normal, font_style: "italic" },
		"emphasis.strong": { color: field.foreground.strong, font_weight: 700 },
		enum: syntax.type,
		function: syntax.function,
		hint: field.foreground.subtle,
		keyword: syntax.keyword,
		label: syntax.function,
		link_text: { color: accent.primary.color, font_style: "italic" },
		link_uri: syntax.string,
		namespace: syntax.type,
		number: syntax.number,
		operator: syntax.operator,
		predictive: { color: field.foreground.subtle, font_style: "italic" },
		preproc: syntax.keyword,
		primary: syntax.variable,
		property: syntax.property,
		punctuation: syntax.punctuation,
		"punctuation.list_marker": accent.primary.color,
		"punctuation.special": accent.primary.color,
		selector: syntax.tag,
		"selector.pseudo": syntax.tag,
		string: syntax.string,
		"string.escape": syntax.special,
		"string.regex": syntax.special,
		"string.special": syntax.special,
		"string.special.symbol": syntax.special,
		tag: syntax.tag,
		"text.literal": syntax.string,
		title: { color: field.foreground.strong, font_weight: 700 },
		type: syntax.type,
		variable: syntax.variable,
		"variable.parameter": syntax.variable,
		"variable.special": syntax.keyword,
		variant: syntax.constant,
	};

	return Object.fromEntries(
		Object.entries(tokens).map(([token, value]) => {
			return [
				token,
				typeof value === "string" ? { color: value } : value,
			];
		}),
	);
};

const style = (roles) => {
	const { accent, color, surface } = roles;
	const { field, frame } = surface;
	const selected = accent.base.container;
	const hover = alpha(selected.background, 0.5, frame.background);

	const highlight = (opacity) => alpha(accent.primary.color, opacity);
	const match = (opacity) => alpha(color.yellow.color, opacity);
	const scroll = (opacity) => alpha(field.foreground.subtle, opacity);

	return {
		"background.appearance": "opaque",

		background: frame.background,
		"surface.background": frame.background,
		"elevated_surface.background": frame.background,
		"panel.background": frame.background,
		"panel.overlay_background": frame.background,
		"panel.overlay_hover": hover,
		"title_bar.background": frame.background,
		"title_bar.inactive_background": field.background,
		"status_bar.background": frame.background,
		"toolbar.background": field.background,
		"tab_bar.background": frame.background,
		"tab.inactive_background": frame.background,
		"tab.active_background": field.background,

		border: frame.outline.subtle,
		"border.variant": frame.outline.subtle,
		"border.focused": accent.primary.color,
		"border.selected": selected.outline.normal,
		"border.transparent": TRANSPARENT,
		"border.disabled": frame.outline.subtle,
		"pane.focused_border": accent.primary.color,
		"pane_group.border": frame.outline.subtle,
		"panel.focused_border": TRANSPARENT,

		"element.background": frame.outline.subtle,
		"element.hover": hover,
		"element.active": selected.background,
		"element.selected": selected.background,
		"element.disabled": frame.background,
		"element.selection_background": highlight(0.24),
		"ghost_element.background": TRANSPARENT,
		"ghost_element.hover": hover,
		"ghost_element.active": selected.background,
		"ghost_element.selected": selected.background,
		"ghost_element.disabled": TRANSPARENT,
		"drop_target.background": highlight(0.25),
		"drop_target.border": accent.primary.color,

		text: frame.foreground.strong,
		"text.muted": frame.foreground.normal,
		"text.placeholder": frame.foreground.subtle,
		"text.disabled": frame.outline.normal,
		"text.accent": accent.primary.color,
		icon: frame.foreground.strong,
		"icon.muted": frame.foreground.normal,
		"icon.placeholder": frame.foreground.subtle,
		"icon.disabled": frame.outline.normal,
		"icon.accent": accent.primary.color,
		"link_text.hover": accent.primary.color,

		"editor.foreground": field.foreground.normal,
		"editor.background": field.background,
		"editor.gutter.background": field.background,
		"editor.subheader.background": frame.background,
		"editor.active_line.background": frame.background,
		"editor.highlighted_line.background": frame.background,
		"editor.debugger_active_line.background": match(0.18),
		"editor.line_number": field.foreground.subtle,
		"editor.active_line_number": field.foreground.strong,
		"editor.hover_line_number": field.foreground.normal,
		"editor.invisible": field.outline.normal,
		"editor.wrap_guide": field.outline.subtle,
		"editor.active_wrap_guide": field.outline.normal,
		"editor.indent_guide": field.outline.subtle,
		"editor.indent_guide_active": field.outline.normal,
		"editor.document_highlight.read_background": highlight(0.12),
		"editor.document_highlight.write_background": highlight(0.25),
		"editor.document_highlight.bracket_background": highlight(0.18),
		"search.match_background": match(0.3),
		"search.active_match_background": match(0.5),

		"scrollbar.thumb.background": scroll(0.3),
		"scrollbar.thumb.hover_background": scroll(0.5),
		"scrollbar.thumb.active_background": scroll(0.6),
		"scrollbar.thumb.border": TRANSPARENT,
		"scrollbar.track.background": TRANSPARENT,
		"scrollbar.track.border": field.outline.subtle,
		"panel.indent_guide": frame.outline.subtle,
		"panel.indent_guide_active": frame.outline.normal,
		"panel.indent_guide_hover": frame.outline.strong,

		...statuses(roles),
		"version_control.added": color.green.color,
		"version_control.deleted": color.red.color,
		"version_control.modified": color.yellow.color,
		"version_control.renamed": color.blue.color,
		"version_control.conflict": color.yellow.color,
		"version_control.ignored": field.foreground.subtle,
		"version_control.word_added": alpha(color.green.color, 0.35),
		"version_control.word_deleted": alpha(color.red.color, 0.35),
		"version_control.conflict_marker.ours": alpha(color.green.color, 0.2),
		"version_control.conflict_marker.theirs": alpha(color.blue.color, 0.2),

		...terminal(roles),

		players: players(roles),
		accents: accents(roles),
		syntax: syntax(roles),
	};
};

const theme = (name, appearance, { roles }) => {
	return { name, appearance, style: style(roles) };
};

export default (scheme, { name }) => {
	const family = {
		$schema: SCHEMA,
		name,
		author: "Lumen",
		themes: [
			theme(`${name} Dark`, "dark", scheme.theme.dark),
			theme(`${name} Light`, "light", scheme.theme.light),
		],
	};

	return {
		directory: path.join(CONFIG, "zed", "themes"),
		files: [
			{
				path: `${name.toLowerCase()}.json`,
				data: `${JSON.stringify(family, null, "\t")}\n`,
			},
		],
	};
};

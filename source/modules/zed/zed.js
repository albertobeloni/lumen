import os from "node:os";
import path from "node:path";

import { alpha } from "../../components/color.js";

const CONFIG =
	process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config");

const SCHEMA = "https://zed.dev/schema/themes/v0.2.0.json";
const TRANSPARENT = "#00000000";

// terminal.ansi.<name> uses each color's normal shade, bright_<name> its strong
// shade and dim_<name> its subtle one. Black is absolute (its subtle shade is
// the lighter grey), so bright black is black.subtle and dim black black.normal
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
const DIM = { black: "normal" };

const terminal = ({ ansi, surface }) => {
	const { field } = surface;

	return {
		"terminal.background": field.background,
		"terminal.foreground": field.foreground.normal,
		"terminal.bright_foreground": field.foreground.strong,
		"terminal.dim_foreground": field.foreground.subtle,
		"terminal.ansi.background": field.background,
		...Object.fromEntries(
			ANSI.flatMap((name) => [
				[`terminal.ansi.${name}`, ansi[name].normal],
				[
					`terminal.ansi.bright_${name}`,
					ansi[name][BRIGHT[name] ?? "strong"],
				],
				[
					`terminal.ansi.dim_${name}`,
					ansi[name][DIM[name] ?? "subtle"],
				],
			]),
		),
	};
};

// Each status has a color, a background and a border: the color, its
// container and the container's outline
const statuses = ({ color, surface }) => {
	const { field } = surface;
	const neutral = {
		color: field.foreground.subtle,
		container: {
			background: field.outline.subtle,
			outline: { normal: field.outline.normal },
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

// Zed falls back to its own grey defaults (not to anything derived from these
// colors) for missing keys, so every key is set
const style = (roles) => {
	const { accent, color, surface } = roles;
	const { field, frame, panel, modal } = surface;
	const selection = alpha(accent.primary.color, 0.24);

	return {
		"background.appearance": "opaque",

		// Surfaces: window chrome on frame, side panels on panel, menus and
		// dialogs on modal, the editor on field
		background: frame.background,
		"surface.background": panel.background,
		"elevated_surface.background": modal.background,
		"panel.background": panel.background,
		"panel.overlay_background": modal.background,
		"panel.overlay_hover": accent.base.container.background,
		"title_bar.background": frame.background,
		"title_bar.inactive_background": field.background,
		"status_bar.background": frame.background,
		"toolbar.background": field.background,
		"tab_bar.background": frame.background,
		"tab.inactive_background": frame.background,
		"tab.active_background": field.background,

		// Borders
		border: frame.outline.normal,
		"border.variant": frame.outline.subtle,
		"border.focused": accent.primary.color,
		"border.selected": accent.primary.container.outline.normal,
		"border.transparent": TRANSPARENT,
		"border.disabled": frame.outline.subtle,
		"pane.focused_border": accent.primary.color,
		"pane_group.border": frame.outline.normal,
		"panel.focused_border": accent.primary.color,

		// Interactive elements
		"element.background": panel.outline.subtle,
		"element.hover": accent.base.container.background,
		"element.active": accent.primary.container.background,
		"element.selected": accent.primary.container.background,
		"element.disabled": panel.background,
		"element.selection_background": selection,
		"ghost_element.background": TRANSPARENT,
		"ghost_element.hover": accent.base.container.background,
		"ghost_element.active": accent.primary.container.background,
		"ghost_element.selected": accent.primary.container.background,
		"ghost_element.disabled": TRANSPARENT,
		"drop_target.background": alpha(accent.primary.color, 0.25),
		"drop_target.border": accent.primary.color,

		// Text and icons
		text: panel.foreground.normal,
		"text.muted": panel.foreground.subtle,
		"text.placeholder": panel.foreground.subtle,
		"text.disabled": panel.outline.normal,
		"text.accent": accent.primary.color,
		icon: panel.foreground.normal,
		"icon.muted": panel.foreground.subtle,
		"icon.placeholder": panel.foreground.subtle,
		"icon.disabled": panel.outline.normal,
		"icon.accent": accent.primary.color,
		"link_text.hover": accent.primary.color,

		// Editor
		"editor.foreground": field.foreground.normal,
		"editor.background": field.background,
		"editor.gutter.background": field.background,
		"editor.subheader.background": frame.background,
		"editor.active_line.background": frame.background,
		"editor.highlighted_line.background": frame.background,
		"editor.debugger_active_line.background": alpha(
			color.yellow.color,
			0.18,
		),
		"editor.line_number": field.foreground.subtle,
		"editor.active_line_number": field.foreground.strong,
		"editor.hover_line_number": field.foreground.normal,
		"editor.invisible": field.outline.normal,
		"editor.wrap_guide": field.outline.subtle,
		"editor.active_wrap_guide": field.outline.normal,
		"editor.indent_guide": field.outline.subtle,
		"editor.indent_guide_active": field.outline.normal,
		"editor.document_highlight.read_background": alpha(
			accent.primary.color,
			0.12,
		),
		"editor.document_highlight.write_background": alpha(
			accent.primary.color,
			0.25,
		),
		"editor.document_highlight.bracket_background": alpha(
			accent.primary.color,
			0.18,
		),
		"search.match_background": alpha(color.yellow.color, 0.3),
		"search.active_match_background": alpha(color.yellow.color, 0.5),

		// Scrollbars and indent guides in panels
		"scrollbar.thumb.background": alpha(field.foreground.subtle, 0.3),
		"scrollbar.thumb.hover_background": alpha(field.foreground.subtle, 0.5),
		"scrollbar.thumb.active_background": alpha(
			field.foreground.subtle,
			0.6,
		),
		"scrollbar.thumb.border": TRANSPARENT,
		"scrollbar.track.background": TRANSPARENT,
		"scrollbar.track.border": field.outline.subtle,
		"panel.indent_guide": panel.outline.subtle,
		"panel.indent_guide_active": panel.outline.normal,
		"panel.indent_guide_hover": panel.outline.strong,

		// Statuses and version control
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

		// The first player is the local user
		players: [
			accent.primary,
			accent.tertiary,
			accent.secondary,
			color.red,
			color.yellow,
			color.green,
			color.cyan,
			color.magenta,
		].map((source) => ({
			cursor: source.color,
			background: source.color,
			selection: alpha(source.color, 0.24),
		})),

		accents: [
			accent.primary,
			accent.secondary,
			accent.tertiary,
			color.cyan,
			color.magenta,
			color.yellow,
		].map((source) => source.color),

		syntax: syntax(roles),
	};
};

// Zed matches tokens by their longest dotted prefix (keyword.control falls
// back to keyword), so these cover every token of Zed's bundled themes
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

	// One fixed file per name, so applying replaces the previous theme instead
	// of adding another file with the same theme names
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

import path from "node:path";

import { alpha } from "../../components/color.js";

const SCHEMA = "https://zed.dev/schema/themes/v0.2.0.json";
const TRANSPARENT = "#00000000";

const status = (name, { color, container }) => {
	return {
		[name]: color,
		[`${name}.background`]: container.background,
		[`${name}.border`]: container.outline.normal,
	};
};

const terminal = (name, { normal, strong, subtle }) => {
	return {
		[`terminal.ansi.${name}`]: normal,
		[`terminal.ansi.bright_${name}`]: strong,
		[`terminal.ansi.dim_${name}`]: subtle,
	};
};

const player = ({ color }) => {
	return {
		"cursor": color,
		"background": color,
		"selection": alpha(color, 0.24),
	};
};

const style = ({ accent, ansi, color, surface, syntax }) => {
	const { field, frame } = surface;
	const { red, yellow, green, cyan, blue, magenta } = color;
	const { primary, secondary, tertiary } = accent;

	const selected = accent.base.container;
	const hover = alpha(selected.background, 0.5, frame.background);
	const neutral = {
		"color": frame.foreground.subtle,
		"container": {
			"background": frame.outline.subtle,
			"outline": { "normal": frame.outline.normal },
		},
	};

	const highlight = (opacity) => {
		return alpha(primary.color, opacity);
	};

	const match = (opacity) => {
		return alpha(yellow.color, opacity);
	};

	const scroll = (opacity) => {
		return alpha(field.foreground.subtle, opacity);
	};

	return {
		"background.appearance": "opaque",

		"background": frame.background,
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

		"border": frame.outline.subtle,
		"border.variant": frame.outline.subtle,
		"border.focused": primary.color,
		"border.selected": selected.outline.normal,
		"border.transparent": TRANSPARENT,
		"border.disabled": frame.outline.subtle,
		"pane.focused_border": primary.color,
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
		"drop_target.border": primary.color,

		"text": frame.foreground.strong,
		"text.muted": frame.foreground.normal,
		"text.placeholder": frame.foreground.subtle,
		"text.disabled": frame.outline.normal,
		"text.accent": primary.color,
		"icon": frame.foreground.strong,
		"icon.muted": frame.foreground.normal,
		"icon.placeholder": frame.foreground.subtle,
		"icon.disabled": frame.outline.normal,
		"icon.accent": primary.color,
		"link_text.hover": primary.color,

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

		...status("error", red),
		...status("warning", yellow),
		...status("success", green),
		...status("info", blue),
		...status("hint", cyan),
		...status("conflict", yellow),
		...status("created", green),
		...status("deleted", red),
		...status("modified", yellow),
		...status("renamed", blue),
		...status("hidden", neutral),
		...status("ignored", neutral),
		...status("predictive", neutral),
		...status("unreachable", neutral),

		"version_control.added": green.color,
		"version_control.deleted": red.color,
		"version_control.modified": yellow.color,
		"version_control.renamed": blue.color,
		"version_control.conflict": yellow.color,
		"version_control.ignored": field.foreground.subtle,
		"version_control.word_added": alpha(green.color, 0.35),
		"version_control.word_deleted": alpha(red.color, 0.35),
		"version_control.conflict_marker.ours": alpha(green.color, 0.2),
		"version_control.conflict_marker.theirs": alpha(blue.color, 0.2),

		"terminal.background": field.background,
		"terminal.foreground": field.foreground.normal,
		"terminal.bright_foreground": field.foreground.strong,
		"terminal.dim_foreground": field.foreground.subtle,
		"terminal.ansi.background": field.background,
		...terminal("black", ansi.black),
		...terminal("red", ansi.red),
		...terminal("green", ansi.green),
		...terminal("yellow", ansi.yellow),
		...terminal("blue", ansi.blue),
		...terminal("magenta", ansi.magenta),
		...terminal("cyan", ansi.cyan),
		...terminal("white", ansi.white),

		"players": [
			player(primary),
			player(tertiary),
			player(secondary),
			player(red),
			player(yellow),
			player(green),
			player(cyan),
			player(magenta),
		],

		"accents": [
			primary.color,
			secondary.color,
			tertiary.color,
			cyan.color,
			magenta.color,
			yellow.color,
		],

		"syntax": {
			"attribute": { "color": syntax.attribute },
			"boolean": { "color": syntax.constant },
			"comment": { "color": syntax.comment },
			"comment.doc": { "color": syntax.comment },
			"constant": { "color": syntax.constant },
			"constructor": { "color": syntax.type },
			"diff.minus": { "color": red.color },
			"diff.plus": { "color": green.color },
			"embedded": { "color": syntax.variable },
			"emphasis": {
				"color": field.foreground.normal,
				"font_style": "italic",
			},
			"emphasis.strong": {
				"color": field.foreground.strong,
				"font_weight": 700,
			},
			"enum": { "color": syntax.type },
			"function": { "color": syntax.function },
			"hint": { "color": field.foreground.subtle },
			"keyword": { "color": syntax.keyword },
			"label": { "color": syntax.function },
			"link_text": { "color": primary.color, "font_style": "italic" },
			"link_uri": { "color": syntax.string },
			"namespace": { "color": syntax.type },
			"number": { "color": syntax.number },
			"operator": { "color": syntax.operator },
			"predictive": {
				"color": field.foreground.subtle,
				"font_style": "italic",
			},
			"preproc": { "color": syntax.keyword },
			"primary": { "color": syntax.variable },
			"property": { "color": syntax.property },
			"punctuation": { "color": syntax.punctuation },
			"punctuation.list_marker": { "color": primary.color },
			"punctuation.special": { "color": primary.color },
			"selector": { "color": syntax.tag },
			"selector.pseudo": { "color": syntax.tag },
			"string": { "color": syntax.string },
			"string.escape": { "color": syntax.special },
			"string.regex": { "color": syntax.special },
			"string.special": { "color": syntax.special },
			"string.special.symbol": { "color": syntax.special },
			"tag": { "color": syntax.tag },
			"text.literal": { "color": syntax.string },
			"title": { "color": field.foreground.strong, "font_weight": 700 },
			"type": { "color": syntax.type },
			"variable": { "color": syntax.variable },
			"variable.parameter": { "color": syntax.variable },
			"variable.special": { "color": syntax.keyword },
			"variant": { "color": syntax.constant },
		},
	};
};

export default (scheme, { name, config }) => {
	const family = {
		"$schema": SCHEMA,
		"name": name,
		"author": "Lumen",
		"themes": [
			{
				"name": `${name} Dark`,
				"appearance": "dark",
				"style": style(scheme.theme.dark.roles),
			},
			{
				"name": `${name} Light`,
				"appearance": "light",
				"style": style(scheme.theme.light.roles),
			},
		],
	};

	return {
		directory: path.join(config, "zed", "themes"),
		files: [
			{
				path: `${name.toLowerCase()}.json`,
				data: `${JSON.stringify(family, null, "\t")}\n`,
			},
		],
	};
};

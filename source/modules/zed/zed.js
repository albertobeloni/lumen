import path from "node:path";

import { alpha, flatten } from "../../components/color.js";

const SCHEMA = "https://zed.dev/schema/themes/v0.2.0.json";
const TRANSPARENT = "#00000000";

const status = (name, color, outline) => {
	return {
		[name]: color,
		[`${name}.background`]: alpha(color, 0.1),
		[`${name}.border`]: outline.strong,
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
		"selection": alpha(color, 0.15),
	};
};

const style = (roles) => {
	const { accent, ansi, base, color, surface, syntax, ui } = roles;
	const { created, deleted, modified } = roles.status;
	const { field, frame } = surface;
	const { red, yellow, green, cyan, blue, magenta } = color;
	const { primary, secondary } = accent;
	const { variant } = base;

	const solid = (opacity) => {
		const overlay = alpha(frame.foreground.strong, opacity);

		return flatten(overlay, frame.background);
	};

	const highlight = (opacity) => {
		return alpha(primary.color, opacity);
	};

	const match = (opacity) => {
		return alpha(yellow.color, opacity);
	};

	return {
		"background.appearance": "opaque",

		"background": frame.background,
		"surface.background": frame.background,
		"elevated_surface.background": frame.background,
		"panel.background": frame.background,
		"panel.overlay_background": frame.background,
		"panel.overlay_hover": solid(0.05),
		"title_bar.background": frame.background,
		"title_bar.inactive_background": field.background,
		"status_bar.background": frame.background,
		"toolbar.background": field.background,
		"tab_bar.background": frame.background,
		"tab.inactive_background": frame.background,
		"tab.active_background": field.background,

		"border": field.outline.silent,
		"border.variant": field.outline.silent,
		"border.focused": ui.focus,
		"border.selected": base.container.outline.normal,
		"border.transparent": TRANSPARENT,
		"border.disabled": field.outline.silent,
		"pane.focused_border": ui.focus,
		"pane_group.border": frame.outline.subtle,
		"panel.focused_border": TRANSPARENT,

		"element.background": frame.overlay.silent,
		"element.hover": solid(0.05),
		"element.active": solid(0.1),
		"element.selected": solid(0.1),
		"element.disabled": frame.background,
		"element.selection_background": ui.selection,
		"ghost_element.background": TRANSPARENT,
		"ghost_element.hover": frame.overlay.silent,
		"ghost_element.active": frame.overlay.normal,
		"ghost_element.selected": frame.overlay.normal,
		"ghost_element.disabled": TRANSPARENT,
		"drop_target.background": highlight(0.25),
		"drop_target.border": ui.focus,

		"text": frame.foreground.strong,
		"text.muted": frame.foreground.normal,
		"text.placeholder": frame.foreground.silent,
		"text.disabled": frame.foreground.silent,
		"text.accent": primary.color,
		"icon": frame.foreground.strong,
		"icon.muted": frame.foreground.normal,
		"icon.placeholder": frame.foreground.silent,
		"icon.disabled": frame.foreground.silent,
		"icon.accent": primary.color,
		"link_text.hover": ui.link.normal,

		"editor.foreground": field.foreground.normal,
		"editor.background": field.background,
		"editor.gutter.background": field.background,
		"editor.subheader.background": frame.background,
		"editor.active_line.background": frame.background,
		"editor.highlighted_line.background": frame.background,
		"editor.debugger_active_line.background": match(0.18),
		"editor.line_number": field.foreground.silent,
		"editor.active_line_number": field.foreground.strong,
		"editor.hover_line_number": field.foreground.normal,
		"editor.invisible": field.outline.normal,
		"editor.wrap_guide": field.overlay.silent,
		"editor.active_wrap_guide": field.overlay.normal,
		"editor.indent_guide": field.overlay.silent,
		"editor.indent_guide_active": field.overlay.normal,
		"editor.document_highlight.read_background": highlight(0.1),
		"editor.document_highlight.write_background": highlight(0.2),
		"editor.document_highlight.bracket_background": highlight(0.2),
		"search.match_background": ui.match.all,
		"search.active_match_background": ui.match.current,

		"scrollbar.thumb.background": field.overlay.normal,
		"scrollbar.thumb.hover_background": field.overlay.strong,
		"scrollbar.thumb.active_background": field.overlay.strong,
		"scrollbar.thumb.border": TRANSPARENT,
		"scrollbar.track.background": TRANSPARENT,
		"scrollbar.track.border": field.outline.silent,
		"panel.indent_guide": frame.overlay.silent,
		"panel.indent_guide_active": frame.overlay.normal,
		"panel.indent_guide_hover": frame.overlay.normal,

		...status("error", red.color, red.outline),
		...status("warning", yellow.color, yellow.outline),
		...status("success", green.color, green.outline),
		...status("info", blue.color, blue.outline),
		...status("hint", cyan.color, cyan.outline),
		...status("conflict", yellow.color, yellow.outline),
		...status("created", created.color, created.outline),
		...status("deleted", deleted.color, deleted.outline),
		...status("modified", modified.color, modified.outline),
		...status("renamed", blue.color, blue.outline),
		...status("hidden", frame.foreground.silent, base.outline),
		...status("ignored", frame.foreground.silent, base.outline),
		...status("predictive", frame.foreground.silent, base.outline),
		...status("unreachable", frame.foreground.silent, base.outline),

		"version_control.added": created.color,
		"version_control.deleted": deleted.color,
		"version_control.modified": modified.color,
		"version_control.renamed": blue.color,
		"version_control.conflict": yellow.color,
		"version_control.ignored": frame.foreground.silent,
		"version_control.word_added": alpha(created.color, 0.35),
		"version_control.word_deleted": alpha(deleted.color, 0.35),
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
			{
				"cursor": ui.cursor,
				"background": ui.cursor,
				"selection": ui.selection,
			},
			player(secondary),
			player(variant),
			player(red),
			player(yellow),
			player(green),
			player(cyan),
			player(magenta),
		],

		"accents": [
			primary.color,
			variant.color,
			secondary.color,
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
			"diff.minus": { "color": deleted.color },
			"diff.plus": { "color": created.color },
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
			"link_text": { "color": ui.link.normal, "font_style": "italic" },
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

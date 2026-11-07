import path from "node:path";

import { alpha } from "../../components/color.js";

const TINT = 0.15;

const on = (surface, level = "normal") => {
	return { "fg": surface.foreground[level], "bg": surface.background };
};

const curl = (color) => {
	return { "sp": color, "undercurl": true };
};

const terminal = ({ ansi }) => {
	return [
		ansi.black.normal,
		ansi.red.normal,
		ansi.green.normal,
		ansi.yellow.normal,
		ansi.blue.normal,
		ansi.magenta.normal,
		ansi.cyan.normal,
		ansi.white.normal,
		ansi.black.strong,
		ansi.red.strong,
		ansi.green.strong,
		ansi.yellow.strong,
		ansi.blue.strong,
		ansi.magenta.strong,
		ansi.cyan.strong,
		ansi.white.strong,
	];
};

const groups = (roles) => {
	const { accent, color, status, surface, syntax } = roles;
	const { field, frame, panel, popup } = surface;
	const selected = accent.base.container;
	const shadow = roles.shadow.slice(0, 7);
	const cursor = { "fg": field.background, "bg": field.foreground.strong };

	const tint = (hue, opacity = TINT) => {
		return alpha(hue, opacity, field.background);
	};

	return {
		"Normal": on(field),
		"NormalNC": on(field),
		"Cursor": cursor,
		"lCursor": cursor,
		"TermCursor": cursor,
		"CursorLine": { "bg": frame.background },
		"CursorColumn": { "bg": frame.background },
		"ColorColumn": { "bg": frame.background },
		"LineNr": { "fg": field.foreground.silent },
		"CursorLineNr": { ...on(frame, "strong"), "bold": true },
		"LineNrSeparator": { "fg": field.outline.silent },
		"CursorLineNrSeparator": {
			"fg": frame.outline.silent,
			"bg": frame.background,
		},
		"SignColumn": on(field, "subtle"),
		"FoldColumn": on(field, "subtle"),
		"Folded": on(panel, "subtle"),
		"NonText": { "fg": field.outline.normal },
		"Conceal": { "fg": field.foreground.subtle },
		"SpecialKey": { "fg": field.foreground.subtle },
		"WinSeparator": { "fg": field.outline.silent, "bg": field.background },
		"MatchParen": {
			"fg": field.foreground.strong,
			"bg": panel.background,
			"bold": true,
		},
		"Directory": { "fg": accent.primary.color },
		"Title": { "fg": field.foreground.strong, "bold": true },

		"Visual": { "bg": tint(accent.primary.color) },
		"VisualNOS": { "bg": tint(accent.primary.color) },
		"QuickFixLine": { "bg": tint(accent.primary.color), "bold": true },
		"Search": { "bg": tint(color.yellow.color, 0.3) },
		"CurSearch": on(color.yellow),
		"IncSearch": on(color.yellow),

		"StatusLine": on(panel),
		"StatusLineNC": on(frame, "subtle"),
		"StatusLineMode": { ...on(accent.primary), "bold": true },
		"StatusLineModified": {
			"fg": color.yellow.color,
			"bg": panel.background,
			"bold": true,
		},
		"TabLine": on(frame, "subtle"),
		"TabLineFill": { "bg": frame.background },
		"TabLineSel": { ...on(field, "strong"), "bold": true },
		"WinBar": { ...on(field), "bold": true },
		"WinBarNC": on(field, "subtle"),

		"NormalFloat": on(popup),
		"FloatBorder": { "fg": popup.outline.strong, "bg": popup.background },
		"FloatTitle": { ...on(popup, "strong"), "bold": true },
		"FloatFooter": on(popup, "subtle"),
		"FloatShadow": { "bg": shadow, "blend": 80 },
		"FloatShadowThrough": { "bg": shadow, "blend": 100 },
		"Pmenu": on(popup),
		"PmenuSel": on(selected, "strong"),
		"PmenuSbar": { "bg": popup.background },
		"PmenuThumb": { "bg": popup.outline.strong },
		"PmenuMatch": { ...on(popup, "strong"), "bold": true },
		"PmenuMatchSel": { ...on(selected, "strong"), "bold": true },

		"ModeMsg": { "fg": field.foreground.strong, "bold": true },
		"MoreMsg": { "fg": status.success.color },
		"OkMsg": { "fg": status.success.color },
		"Question": { "fg": status.notice.color },
		"WarningMsg": { "fg": status.caution.color },
		"ErrorMsg": { "fg": status.critical.color },
		"Error": { "fg": status.critical.color },
		"NvimInternalError": on(color.red),

		"DiagnosticError": { "fg": status.critical.color },
		"DiagnosticWarn": { "fg": status.caution.color },
		"DiagnosticInfo": { "fg": status.notice.color },
		"DiagnosticHint": { "fg": color.cyan.color },
		"DiagnosticOk": { "fg": status.success.color },
		"DiagnosticUnderlineError": curl(status.critical.color),
		"DiagnosticUnderlineWarn": curl(status.caution.color),
		"DiagnosticUnderlineInfo": curl(status.notice.color),
		"DiagnosticUnderlineHint": curl(color.cyan.color),
		"DiagnosticUnderlineOk": curl(status.success.color),
		"DiagnosticDeprecated": {
			"sp": field.foreground.subtle,
			"strikethrough": true,
		},
		"SpellBad": curl(status.critical.color),
		"SpellCap": curl(status.caution.color),
		"SpellLocal": curl(status.notice.color),
		"SpellRare": curl(color.cyan.color),

		"Added": { "fg": color.green.color },
		"Changed": { "fg": color.yellow.color },
		"Removed": { "fg": color.red.color },
		"DiffAdd": { "bg": tint(color.green.color) },
		"DiffChange": { "bg": tint(color.yellow.color, TINT / 2) },
		"DiffText": { "bg": tint(color.yellow.color, TINT * 2) },
		"DiffDelete": { "fg": color.red.color, "bg": tint(color.red.color) },

		"Comment": { "fg": syntax.comment },
		"Constant": { "fg": syntax.constant },
		"String": { "fg": syntax.string },
		"Number": { "fg": syntax.number },
		"Identifier": { "fg": syntax.variable },
		"Function": { "fg": syntax.function },
		"Statement": { "fg": syntax.keyword },
		"PreProc": { "fg": syntax.keyword },
		"Operator": { "fg": syntax.operator },
		"Type": { "fg": syntax.type },
		"Special": { "fg": syntax.special },
		"Delimiter": { "fg": syntax.punctuation },
		"Tag": { "fg": syntax.tag },
		"Underlined": { "fg": accent.primary.color, "underline": true },
		"Todo": { "fg": color.yellow.color, "bold": true },

		"@variable": { "fg": syntax.variable },
		"@variable.member": { "fg": syntax.property },
		"@property": { "fg": syntax.property },
		"@attribute": { "fg": syntax.attribute },
		"@tag.attribute": { "fg": syntax.attribute },
		"@tag.delimiter": { "fg": syntax.punctuation },
		"@constructor": { "fg": syntax.type },
		"@markup.raw": { "fg": syntax.string },
		"@markup.strong": { "bold": true },
		"@markup.italic": { "italic": true },
		"@markup.underline": { "underline": true },
		"@markup.heading.1.delimiter.vimdoc": { "link": "Delimiter" },
		"@markup.heading.2.delimiter.vimdoc": { "link": "Delimiter" },
	};
};

const lua = (value, depth = 0) => {
	if (typeof value !== "object") {
		return JSON.stringify(value);
	}

	const indent = "\t".repeat(depth + 1);
	const entries = Object.entries(value).map(([key, item]) => {
		const name = /^[A-Za-z_]\w*$/.test(key)
			? key
			: `[${JSON.stringify(key)}]`;
		const prefix = Array.isArray(value) ? "" : `${name} = `;

		return `${indent}${prefix}${lua(item, depth + 1)},`;
	});

	return `{\n${entries.join("\n")}\n${"\t".repeat(depth)}}`;
};

const colorscheme = (scheme) => {
	const { dark, light } = scheme.theme;
	const variants = {
		"dark": {
			"groups": groups(dark.roles),
			"terminal": terminal(dark.roles),
		},
		"light": {
			"groups": groups(light.roles),
			"terminal": terminal(light.roles),
		},
	};

	return `local variants = ${lua(variants)}

vim.cmd.highlight("clear")
vim.g.colors_name = "lumen"

local variant = variants[vim.o.background] or variants.dark

for group, spec in pairs(variant.groups) do
	vim.api.nvim_set_hl(0, group, spec)
end

for index, color in ipairs(variant.terminal) do
	vim.g["terminal_color_" .. (index - 1)] = color
end
`;
};

export default (scheme, { config }) => {
	return {
		directory: path.join(config, "nvim", "colors"),
		files: [{ path: "lumen.lua", data: colorscheme(scheme) }],
		command: "pkill -USR1 -x nvim || true",
	};
};

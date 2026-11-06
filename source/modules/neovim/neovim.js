import os from "node:os";
import path from "node:path";

import { alpha } from "../../components/color.js";

const CONFIG =
	process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config");

// terminal_color_0-7 use each color's normal shade, 8-15 its strong shade.
// Bright black is the lighter grey (used for comments), so black.subtle
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

// Opacity of hued backgrounds (selection, search, diff) blended over the
// editor background: enough hue to tell them apart, syntax text stays readable
const TINT = 0.18;

const terminal = (ansi) => {
	return [
		...ANSI.map((name) => ansi[name].normal),
		...ANSI.map((name) => ansi[name][BRIGHT[name] ?? "strong"]),
	];
};

// ":highlight clear" restores Neovim's own colors for every group that isn't
// set, so every group with colors of its own in Neovim 0.12 is set here. The
// rest (treesitter captures, LSP tokens, Boolean, Keyword…) link to these
const groups = ({ accent, color, roles, status, surface, syntax }) => {
	const { field, frame, panel, popup } = surface;
	const tint = (hue, opacity = TINT) => alpha(hue, opacity, field.background);
	const shadow = roles.shadow.slice(0, 7);
	const selected = accent.base.container;

	return {
		// Editor
		Normal: { fg: field.foreground.normal, bg: field.background },
		NormalNC: { fg: field.foreground.normal, bg: field.background },
		Cursor: { fg: field.background, bg: field.foreground.strong },
		lCursor: { fg: field.background, bg: field.foreground.strong },
		TermCursor: { fg: field.background, bg: field.foreground.strong },
		CursorLine: { bg: frame.background },
		CursorColumn: { bg: frame.background },
		ColorColumn: { bg: frame.background },
		LineNr: { fg: field.foreground.subtle },
		CursorLineNr: {
			fg: frame.foreground.strong,
			bg: frame.background,
			bold: true,
		},
		LineNrSeparator: { fg: field.outline.subtle },
		CursorLineNrSeparator: {
			fg: frame.outline.subtle,
			bg: frame.background,
		},
		SignColumn: { fg: field.foreground.subtle, bg: field.background },
		FoldColumn: { fg: field.foreground.subtle, bg: field.background },
		Folded: { fg: panel.foreground.subtle, bg: panel.background },
		NonText: { fg: field.outline.normal },
		Conceal: { fg: field.foreground.subtle },
		SpecialKey: { fg: field.foreground.subtle },
		WinSeparator: { fg: field.outline.subtle, bg: field.background },
		MatchParen: {
			fg: field.foreground.strong,
			bg: panel.background,
			bold: true,
		},
		Directory: { fg: accent.primary.color },
		Title: { fg: field.foreground.strong, bold: true },

		// Selection and search
		Visual: { bg: tint(accent.primary.color) },
		VisualNOS: { bg: tint(accent.primary.color) },
		QuickFixLine: { bg: tint(accent.primary.color), bold: true },
		Search: { bg: tint(color.yellow.color, 0.3) },
		CurSearch: {
			fg: color.yellow.foreground.normal,
			bg: color.yellow.background,
		},
		IncSearch: {
			fg: color.yellow.foreground.normal,
			bg: color.yellow.background,
		},

		// Status, tab and window bars (StatusLineMode and StatusLineModified are
		// used by the statusline in the setup repository)
		StatusLine: { fg: panel.foreground.normal, bg: panel.background },
		StatusLineNC: { fg: frame.foreground.subtle, bg: frame.background },
		StatusLineMode: {
			fg: accent.primary.foreground.normal,
			bg: accent.primary.background,
			bold: true,
		},
		StatusLineModified: {
			fg: color.yellow.color,
			bg: panel.background,
			bold: true,
		},
		TabLine: { fg: frame.foreground.subtle, bg: frame.background },
		TabLineFill: { bg: frame.background },
		TabLineSel: {
			fg: field.foreground.strong,
			bg: field.background,
			bold: true,
		},
		WinBar: {
			fg: field.foreground.normal,
			bg: field.background,
			bold: true,
		},
		WinBarNC: { fg: field.foreground.subtle, bg: field.background },

		// Floating windows and menus
		NormalFloat: { fg: popup.foreground.normal, bg: popup.background },
		FloatBorder: { fg: popup.outline.strong, bg: popup.background },
		FloatTitle: {
			fg: popup.foreground.strong,
			bg: popup.background,
			bold: true,
		},
		FloatFooter: { fg: popup.foreground.subtle, bg: popup.background },
		FloatShadow: { bg: shadow, blend: 80 },
		FloatShadowThrough: { bg: shadow, blend: 100 },
		Pmenu: { fg: popup.foreground.normal, bg: popup.background },
		PmenuSel: { fg: selected.foreground.strong, bg: selected.background },
		PmenuSbar: { bg: popup.background },
		PmenuThumb: { bg: popup.outline.strong },
		PmenuMatch: {
			fg: popup.foreground.strong,
			bg: popup.background,
			bold: true,
		},
		PmenuMatchSel: {
			fg: selected.foreground.strong,
			bg: selected.background,
			bold: true,
		},

		// Messages
		ModeMsg: { fg: field.foreground.strong, bold: true },
		MoreMsg: { fg: status.success.color },
		OkMsg: { fg: status.success.color },
		Question: { fg: status.notice.color },
		WarningMsg: { fg: status.caution.color },
		ErrorMsg: { fg: status.critical.color },
		Error: { fg: status.critical.color },
		NvimInternalError: {
			fg: color.red.foreground.normal,
			bg: color.red.background,
		},

		// Diagnostics and spelling
		DiagnosticError: { fg: status.critical.color },
		DiagnosticWarn: { fg: status.caution.color },
		DiagnosticInfo: { fg: status.notice.color },
		DiagnosticHint: { fg: color.cyan.color },
		DiagnosticOk: { fg: status.success.color },
		DiagnosticUnderlineError: {
			sp: status.critical.color,
			undercurl: true,
		},
		DiagnosticUnderlineWarn: { sp: status.caution.color, undercurl: true },
		DiagnosticUnderlineInfo: { sp: status.notice.color, undercurl: true },
		DiagnosticUnderlineHint: { sp: color.cyan.color, undercurl: true },
		DiagnosticUnderlineOk: { sp: status.success.color, undercurl: true },
		DiagnosticDeprecated: {
			sp: field.foreground.subtle,
			strikethrough: true,
		},
		SpellBad: { sp: status.critical.color, undercurl: true },
		SpellCap: { sp: status.caution.color, undercurl: true },
		SpellLocal: { sp: status.notice.color, undercurl: true },
		SpellRare: { sp: color.cyan.color, undercurl: true },

		// Version control
		Added: { fg: color.green.color },
		Changed: { fg: color.yellow.color },
		Removed: { fg: color.red.color },
		DiffAdd: { bg: tint(color.green.color) },
		DiffChange: { bg: tint(color.yellow.color, TINT / 2) },
		DiffText: { bg: tint(color.yellow.color, TINT * 2) },
		DiffDelete: { fg: color.red.color, bg: tint(color.red.color) },

		// Syntax
		Comment: { fg: syntax.comment },
		Constant: { fg: syntax.constant },
		String: { fg: syntax.string },
		Number: { fg: syntax.number },
		Identifier: { fg: syntax.variable },
		Function: { fg: syntax.function },
		Statement: { fg: syntax.keyword },
		PreProc: { fg: syntax.keyword },
		Operator: { fg: syntax.operator },
		Type: { fg: syntax.type },
		Special: { fg: syntax.special },
		Delimiter: { fg: syntax.punctuation },
		Tag: { fg: syntax.tag },
		Underlined: { fg: accent.primary.color, underline: true },
		Todo: { fg: color.yellow.color, bold: true },

		// Treesitter captures that don't link to the groups above by default
		"@variable": { fg: syntax.variable },
		"@variable.member": { fg: syntax.property },
		"@property": { fg: syntax.property },
		"@attribute": { fg: syntax.attribute },
		"@tag.attribute": { fg: syntax.attribute },
		"@tag.delimiter": { fg: syntax.punctuation },
		"@constructor": { fg: syntax.type },
		"@markup.raw": { fg: syntax.string },
		"@markup.strong": { bold: true },
		"@markup.italic": { italic: true },
		"@markup.underline": { underline: true },
		"@markup.heading.1.delimiter.vimdoc": { link: "Delimiter" },
		"@markup.heading.2.delimiter.vimdoc": { link: "Delimiter" },
	};
};

// Serializes plain objects, strings, numbers and booleans as a Lua table
const lua = (value, depth = 0) => {
	if (typeof value !== "object") {
		return JSON.stringify(value);
	}

	const indent = "\t".repeat(depth + 1);
	const entries = Object.entries(value).map(([key, item]) => {
		const name = /^[A-Za-z_]\w*$/.test(key)
			? key
			: `[${JSON.stringify(key)}]`;

		return `${indent}${Array.isArray(value) ? "" : `${name} = `}${lua(item, depth + 1)},`;
	});

	return `{\n${entries.join("\n")}\n${"\t".repeat(depth)}}`;
};

const variant = ({ roles }) => {
	return {
		groups: groups({ ...roles, roles }),
		terminal: terminal(roles.ansi),
	};
};

const colorscheme = (scheme, name) => {
	const variants = {
		dark: variant(scheme.theme.dark),
		light: variant(scheme.theme.light),
	};

	return `-- ${name}, generated by Lumen. Both variants follow 'background'

local variants = ${lua(variants)}

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

export default (scheme, { name }) => ({
	directory: path.join(CONFIG, "nvim", "colors"),
	files: [{ path: "lumen.lua", data: colorscheme(scheme, name) }],
	command: "pkill -USR1 -x nvim || true",
});

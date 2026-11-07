local variants = {
	dark = {
		groups = {
			Normal = {
				fg = "#887e7f",
				bg = "#16161a",
			},
			NormalNC = {
				fg = "#887e7f",
				bg = "#16161a",
			},
			Cursor = {
				fg = "#16161a",
				bg = "#aca29f",
			},
			lCursor = {
				fg = "#16161a",
				bg = "#aca29f",
			},
			TermCursor = {
				fg = "#16161a",
				bg = "#aca29f",
			},
			CursorLine = {
				bg = "#1e1d21",
			},
			CursorColumn = {
				bg = "#1e1d21",
			},
			ColorColumn = {
				bg = "#1e1d21",
			},
			LineNr = {
				fg = "#72696b",
			},
			CursorLineNr = {
				fg = "#b2a9a5",
				bg = "#1e1d21",
				bold = true,
			},
			LineNrSeparator = {
				fg = "#252427",
			},
			CursorLineNrSeparator = {
				fg = "#2b292d",
				bg = "#1e1d21",
			},
			SignColumn = {
				fg = "#72696b",
				bg = "#16161a",
			},
			FoldColumn = {
				fg = "#72696b",
				bg = "#16161a",
			},
			Folded = {
				fg = "#7e7375",
				bg = "#252427",
			},
			NonText = {
				fg = "#474246",
			},
			Conceal = {
				fg = "#72696b",
			},
			SpecialKey = {
				fg = "#72696b",
			},
			WinSeparator = {
				fg = "#252427",
				bg = "#16161a",
			},
			MatchParen = {
				fg = "#aca29f",
				bg = "#252427",
				bold = true,
			},
			Directory = {
				fg = "#4b8c7d",
			},
			Title = {
				fg = "#aca29f",
				bold = true,
			},
			Visual = {
				bg = "#1e2829",
			},
			VisualNOS = {
				bg = "#1e2829",
			},
			QuickFixLine = {
				bg = "#1e2829",
				bold = true,
			},
			Search = {
				bg = "#393625",
			},
			CurSearch = {
				fg = "#3e3b19",
				bg = "#b0a653",
			},
			IncSearch = {
				fg = "#3e3b19",
				bg = "#b0a653",
			},
			StatusLine = {
				fg = "#948989",
				bg = "#252427",
			},
			StatusLineNC = {
				fg = "#786e70",
				bg = "#1e1d21",
			},
			StatusLineMode = {
				fg = "#1f4038",
				bg = "#61b2a0",
				bold = true,
			},
			StatusLineModified = {
				fg = "#898240",
				bg = "#252427",
				bold = true,
			},
			TabLine = {
				fg = "#786e70",
				bg = "#1e1d21",
			},
			TabLineFill = {
				bg = "#1e1d21",
			},
			TabLineSel = {
				fg = "#aca29f",
				bg = "#16161a",
				bold = true,
			},
			WinBar = {
				fg = "#887e7f",
				bg = "#16161a",
				bold = true,
			},
			WinBarNC = {
				fg = "#72696b",
				bg = "#16161a",
			},
			NormalFloat = {
				fg = "#a09594",
				bg = "#312f32",
			},
			FloatBorder = {
				fg = "#887e7f",
				bg = "#312f32",
			},
			FloatTitle = {
				fg = "#c7bdb8",
				bg = "#312f32",
				bold = true,
			},
			FloatFooter = {
				fg = "#887e7f",
				bg = "#312f32",
			},
			FloatShadow = {
				bg = "#000000",
				blend = 80,
			},
			FloatShadowThrough = {
				bg = "#000000",
				blend = 100,
			},
			Pmenu = {
				fg = "#a09594",
				bg = "#312f32",
			},
			PmenuSel = {
				fg = "#e5dcd3",
				bg = "#474246",
			},
			PmenuSbar = {
				bg = "#312f32",
			},
			PmenuThumb = {
				bg = "#887e7f",
			},
			PmenuMatch = {
				fg = "#c7bdb8",
				bg = "#312f32",
				bold = true,
			},
			PmenuMatchSel = {
				fg = "#e5dcd3",
				bg = "#474246",
				bold = true,
			},
			ModeMsg = {
				fg = "#aca29f",
				bold = true,
			},
			MoreMsg = {
				fg = "#598b69",
			},
			OkMsg = {
				fg = "#598b69",
			},
			Question = {
				fg = "#6383ab",
			},
			WarningMsg = {
				fg = "#898240",
			},
			ErrorMsg = {
				fg = "#b17059",
			},
			Error = {
				fg = "#b17059",
			},
			NvimInternalError = {
				fg = "#523126",
				bg = "#e19073",
			},
			DiagnosticError = {
				fg = "#b17059",
			},
			DiagnosticWarn = {
				fg = "#898240",
			},
			DiagnosticInfo = {
				fg = "#6383ab",
			},
			DiagnosticHint = {
				fg = "#478b8f",
			},
			DiagnosticOk = {
				fg = "#598b69",
			},
			DiagnosticUnderlineError = {
				sp = "#b17059",
				undercurl = true,
			},
			DiagnosticUnderlineWarn = {
				sp = "#898240",
				undercurl = true,
			},
			DiagnosticUnderlineInfo = {
				sp = "#6383ab",
				undercurl = true,
			},
			DiagnosticUnderlineHint = {
				sp = "#478b8f",
				undercurl = true,
			},
			DiagnosticUnderlineOk = {
				sp = "#598b69",
				undercurl = true,
			},
			DiagnosticDeprecated = {
				sp = "#72696b",
				strikethrough = true,
			},
			SpellBad = {
				sp = "#b17059",
				undercurl = true,
			},
			SpellCap = {
				sp = "#898240",
				undercurl = true,
			},
			SpellLocal = {
				sp = "#6383ab",
				undercurl = true,
			},
			SpellRare = {
				sp = "#478b8f",
				undercurl = true,
			},
			Added = {
				fg = "#598b69",
			},
			Changed = {
				fg = "#898240",
			},
			Removed = {
				fg = "#b17059",
			},
			DiffAdd = {
				bg = "#202826",
			},
			DiffChange = {
				bg = "#1f1e1d",
			},
			DiffText = {
				bg = "#393625",
			},
			DiffDelete = {
				fg = "#b17059",
				bg = "#2d2423",
			},
			Comment = {
				fg = "#72696b",
			},
			Constant = {
				fg = "#4b8c7d",
			},
			String = {
				fg = "#75837f",
			},
			Number = {
				fg = "#75837f",
			},
			Identifier = {
				fg = "#887e7f",
			},
			Function = {
				fg = "#7b8649",
			},
			Statement = {
				fg = "#4b8c7d",
			},
			PreProc = {
				fg = "#4b8c7d",
			},
			Operator = {
				fg = "#72696b",
			},
			Type = {
				fg = "#7b8649",
			},
			Special = {
				fg = "#478b8f",
			},
			Delimiter = {
				fg = "#72696b",
			},
			Tag = {
				fg = "#7b8649",
			},
			Underlined = {
				fg = "#4b8c7d",
				underline = true,
			},
			Todo = {
				fg = "#898240",
				bold = true,
			},
			["@variable"] = {
				fg = "#887e7f",
			},
			["@variable.member"] = {
				fg = "#887e7f",
			},
			["@property"] = {
				fg = "#887e7f",
			},
			["@attribute"] = {
				fg = "#887e7f",
			},
			["@tag.attribute"] = {
				fg = "#887e7f",
			},
			["@tag.delimiter"] = {
				fg = "#72696b",
			},
			["@constructor"] = {
				fg = "#7b8649",
			},
			["@markup.raw"] = {
				fg = "#75837f",
			},
			["@markup.strong"] = {
				bold = true,
			},
			["@markup.italic"] = {
				italic = true,
			},
			["@markup.underline"] = {
				underline = true,
			},
			["@markup.heading.1.delimiter.vimdoc"] = {
				link = "Delimiter",
			},
			["@markup.heading.2.delimiter.vimdoc"] = {
				link = "Delimiter",
			},
		},
		terminal = {
			"#312f32",
			"#b17059",
			"#598b69",
			"#898240",
			"#6383ab",
			"#9874a1",
			"#478b8f",
			"#887e7f",
			"#514c4f",
			"#e19073",
			"#73b287",
			"#b0a653",
			"#7fa7d9",
			"#c294cd",
			"#5cb1b7",
			"#aca29f",
		},
	},
	light = {
		groups = {
			Normal = {
				fg = "#72696b",
				bg = "#f5ece2",
			},
			NormalNC = {
				fg = "#72696b",
				bg = "#f5ece2",
			},
			Cursor = {
				fg = "#f5ece2",
				bg = "#514c4f",
			},
			lCursor = {
				fg = "#f5ece2",
				bg = "#514c4f",
			},
			TermCursor = {
				fg = "#f5ece2",
				bg = "#514c4f",
			},
			CursorLine = {
				bg = "#ede4db",
			},
			CursorColumn = {
				bg = "#ede4db",
			},
			ColorColumn = {
				bg = "#ede4db",
			},
			LineNr = {
				fg = "#887e7f",
			},
			CursorLineNr = {
				fg = "#4c474a",
				bg = "#ede4db",
				bold = true,
			},
			LineNrSeparator = {
				fg = "#e5dcd3",
			},
			CursorLineNrSeparator = {
				fg = "#ddd4cc",
				bg = "#ede4db",
			},
			SignColumn = {
				fg = "#887e7f",
				bg = "#f5ece2",
			},
			FoldColumn = {
				fg = "#887e7f",
				bg = "#f5ece2",
			},
			Folded = {
				fg = "#7e7375",
				bg = "#e5dcd3",
			},
			NonText = {
				fg = "#b9afab",
			},
			Conceal = {
				fg = "#887e7f",
			},
			SpecialKey = {
				fg = "#887e7f",
			},
			WinSeparator = {
				fg = "#e5dcd3",
				bg = "#f5ece2",
			},
			MatchParen = {
				fg = "#514c4f",
				bg = "#e5dcd3",
				bold = true,
			},
			Directory = {
				fg = "#3e7568",
			},
			Title = {
				fg = "#514c4f",
				bold = true,
			},
			Visual = {
				bg = "#dadad0",
			},
			VisualNOS = {
				bg = "#dadad0",
			},
			QuickFixLine = {
				bg = "#dadad0",
				bold = true,
			},
			Search = {
				bg = "#cec6ae",
			},
			CurSearch = {
				fg = "#c9c185",
				bg = "#534e24",
			},
			IncSearch = {
				fg = "#c9c185",
				bg = "#534e24",
			},
			StatusLine = {
				fg = "#675f61",
				bg = "#e5dcd3",
			},
			StatusLineNC = {
				fg = "#83787a",
				bg = "#ede4db",
			},
			StatusLineMode = {
				fg = "#96c9bc",
				bg = "#2b554b",
				bold = true,
			},
			StatusLineModified = {
				fg = "#736c34",
				bg = "#e5dcd3",
				bold = true,
			},
			TabLine = {
				fg = "#83787a",
				bg = "#ede4db",
			},
			TabLineFill = {
				bg = "#ede4db",
			},
			TabLineSel = {
				fg = "#514c4f",
				bg = "#f5ece2",
				bold = true,
			},
			WinBar = {
				fg = "#72696b",
				bg = "#f5ece2",
				bold = true,
			},
			WinBarNC = {
				fg = "#887e7f",
				bg = "#f5ece2",
			},
			NormalFloat = {
				fg = "#5c5558",
				bg = "#d5ccc5",
			},
			FloatBorder = {
				fg = "#72696b",
				bg = "#d5ccc5",
			},
			FloatTitle = {
				fg = "#3c393c",
				bg = "#d5ccc5",
				bold = true,
			},
			FloatFooter = {
				fg = "#72696b",
				bg = "#d5ccc5",
			},
			FloatShadow = {
				bg = "#000000",
				blend = 80,
			},
			FloatShadowThrough = {
				bg = "#000000",
				blend = 100,
			},
			Pmenu = {
				fg = "#5c5558",
				bg = "#d5ccc5",
			},
			PmenuSel = {
				fg = "#252427",
				bg = "#b9afab",
			},
			PmenuSbar = {
				bg = "#d5ccc5",
			},
			PmenuThumb = {
				bg = "#72696b",
			},
			PmenuMatch = {
				fg = "#3c393c",
				bg = "#d5ccc5",
				bold = true,
			},
			PmenuMatchSel = {
				fg = "#252427",
				bg = "#b9afab",
				bold = true,
			},
			ModeMsg = {
				fg = "#514c4f",
				bold = true,
			},
			MoreMsg = {
				fg = "#4a7457",
			},
			OkMsg = {
				fg = "#4a7457",
			},
			Question = {
				fg = "#526d8f",
			},
			WarningMsg = {
				fg = "#736c34",
			},
			ErrorMsg = {
				fg = "#955d4a",
			},
			Error = {
				fg = "#955d4a",
			},
			NvimInternalError = {
				fg = "#f0b09b",
				bg = "#6d4334",
			},
			DiagnosticError = {
				fg = "#955d4a",
			},
			DiagnosticWarn = {
				fg = "#736c34",
			},
			DiagnosticInfo = {
				fg = "#526d8f",
			},
			DiagnosticHint = {
				fg = "#3a7478",
			},
			DiagnosticOk = {
				fg = "#4a7457",
			},
			DiagnosticUnderlineError = {
				sp = "#955d4a",
				undercurl = true,
			},
			DiagnosticUnderlineWarn = {
				sp = "#736c34",
				undercurl = true,
			},
			DiagnosticUnderlineInfo = {
				sp = "#526d8f",
				undercurl = true,
			},
			DiagnosticUnderlineHint = {
				sp = "#3a7478",
				undercurl = true,
			},
			DiagnosticUnderlineOk = {
				sp = "#4a7457",
				undercurl = true,
			},
			DiagnosticDeprecated = {
				sp = "#887e7f",
				strikethrough = true,
			},
			SpellBad = {
				sp = "#955d4a",
				undercurl = true,
			},
			SpellCap = {
				sp = "#736c34",
				undercurl = true,
			},
			SpellLocal = {
				sp = "#526d8f",
				undercurl = true,
			},
			SpellRare = {
				sp = "#3a7478",
				undercurl = true,
			},
			Added = {
				fg = "#4a7457",
			},
			Changed = {
				fg = "#736c34",
			},
			Removed = {
				fg = "#955d4a",
			},
			DiffAdd = {
				bg = "#dbdacd",
			},
			DiffChange = {
				bg = "#ebe2d5",
			},
			DiffText = {
				bg = "#cec6ae",
			},
			DiffDelete = {
				fg = "#955d4a",
				bg = "#e7d7cb",
			},
			Comment = {
				fg = "#887e7f",
			},
			Constant = {
				fg = "#3e7568",
			},
			String = {
				fg = "#616e6a",
			},
			Number = {
				fg = "#616e6a",
			},
			Identifier = {
				fg = "#72696b",
			},
			Function = {
				fg = "#67703c",
			},
			Statement = {
				fg = "#3e7568",
			},
			PreProc = {
				fg = "#3e7568",
			},
			Operator = {
				fg = "#887e7f",
			},
			Type = {
				fg = "#67703c",
			},
			Special = {
				fg = "#3a7478",
			},
			Delimiter = {
				fg = "#887e7f",
			},
			Tag = {
				fg = "#67703c",
			},
			Underlined = {
				fg = "#3e7568",
				underline = true,
			},
			Todo = {
				fg = "#736c34",
				bold = true,
			},
			["@variable"] = {
				fg = "#72696b",
			},
			["@variable.member"] = {
				fg = "#72696b",
			},
			["@property"] = {
				fg = "#72696b",
			},
			["@attribute"] = {
				fg = "#72696b",
			},
			["@tag.attribute"] = {
				fg = "#72696b",
			},
			["@tag.delimiter"] = {
				fg = "#887e7f",
			},
			["@constructor"] = {
				fg = "#67703c",
			},
			["@markup.raw"] = {
				fg = "#616e6a",
			},
			["@markup.strong"] = {
				bold = true,
			},
			["@markup.italic"] = {
				italic = true,
			},
			["@markup.underline"] = {
				underline = true,
			},
			["@markup.heading.1.delimiter.vimdoc"] = {
				link = "Delimiter",
			},
			["@markup.heading.2.delimiter.vimdoc"] = {
				link = "Delimiter",
			},
		},
		terminal = {
			"#72696b",
			"#955d4a",
			"#4a7457",
			"#736c34",
			"#526d8f",
			"#7f6087",
			"#3a7478",
			"#d5ccc5",
			"#514c4f",
			"#6d4334",
			"#34543e",
			"#534e24",
			"#3a4f68",
			"#5d4562",
			"#285457",
			"#aca29f",
		},
	},
}

vim.cmd.highlight("clear")
vim.g.colors_name = "lumen"

local variant = variants[vim.o.background] or variants.dark

for group, spec in pairs(variant.groups) do
	vim.api.nvim_set_hl(0, group, spec)
end

for index, color in ipairs(variant.terminal) do
	vim.g["terminal_color_" .. (index - 1)] = color
end

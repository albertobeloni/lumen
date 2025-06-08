import filesystem from "fs";
import handlebars from "handlebars";
import path from "path";

import tokens from "./tokens.js";

export function windowsTerminal(scheme) {
	const windowsTerminal = {};
	const template = filesystem.readFileSync(path.join(import.meta.dirname, "../templates/windows-terminal.handlebars"));
	const theme = tokens(scheme);

	windowsTerminal.file = scheme.variant
		? scheme.name.toLowerCase() + "-" + scheme.variant.toLowerCase()
		: scheme.name.toLowerCase();
	windowsTerminal.file += ".json";

	theme.name = scheme.variant
		? `${scheme.name} ${scheme.variant}`
		: `${scheme.name}`;

	theme.background.terminal = scheme.relative(scheme.primary("base"), 4);

	windowsTerminal.data = handlebars.compile(template.toString())(theme);

	return windowsTerminal;
}

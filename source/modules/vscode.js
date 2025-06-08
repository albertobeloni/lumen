import filesystem from "fs";
import handlebars from "handlebars";
import path from "path";

import tokens from "./tokens.js";

export function vscode(scheme) {
	const vscode = {};
	const template = filesystem.readFileSync(path.join(import.meta.dirname, "../templates/vscode.handlebars"));
	const theme = tokens(scheme);

	vscode.file = scheme.variant
		? scheme.name.toLowerCase() + "-" + scheme.variant.toLowerCase()
		: scheme.name.toLowerCase();
	vscode.file += ".json";

	theme.name = scheme.variant
		? `${scheme.name} ${scheme.variant}`
		: `${scheme.name}`;

	handlebars.registerHelper("disable", function(color) {
		return theme.disable(color);
	});

	handlebars.registerHelper("fade", function(color, amount) {
		return theme.fade(color, amount);
	});

	handlebars.registerHelper("hover", function(color) {
		return theme.hover(color);
	});

	vscode.data = handlebars.compile(template.toString())(theme);

	return vscode;
}

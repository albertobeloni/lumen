import filesystem from "fs";
import handlebars from "handlebars";
import path from "path";

export function css(scheme) {
	const css = {};
	const template = filesystem.readFileSync(path.join(import.meta.dirname, "../templates/css.handlebars"));

	css.file = scheme.variant
		? scheme.name.toLowerCase() + "-" + scheme.variant.toLowerCase()
		: scheme.name.toLowerCase();
	css.file += ".css";

	handlebars.registerHelper("hex", function(color) {
		return scheme.serialize(color);
	});

	css.data = handlebars.compile(template.toString())(scheme);

	return css;
}

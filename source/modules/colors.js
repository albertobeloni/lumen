import filesystem from "fs";
import handlebars from "handlebars";
import path from "path";

export function colors(scheme) {
	const values = {};
	const template = filesystem.readFileSync(path.join(import.meta.dirname, "../templates/colors.handlebars"));

	values.file = scheme.variant
		? scheme.name.toLowerCase() + "-" + scheme.variant.toLowerCase()
		: scheme.name.toLowerCase();
	values.file += ".md";

	handlebars.registerHelper("hex", function(color) {
		return scheme.serialize(color);
	});

	values.data = handlebars.compile(template.toString())(scheme);

	return values;
}

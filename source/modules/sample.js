import filesystem from "fs";
import handlebars from "handlebars";
import path from "path";

export function sample(scheme) {
	const sample = {};
	const template = filesystem.readFileSync(path.join(import.meta.dirname, "../templates/sample.handlebars"));

	sample.file = scheme.variant
		? scheme.name.toLowerCase() + "-" + scheme.variant.toLowerCase()
		: scheme.name.toLowerCase();
	sample.file += ".html";

	handlebars.registerHelper("foreground", function(color) {
		return scheme.contrast(color);
	});

	handlebars.registerHelper("hex", function(color) {
		return scheme.serialize(color);
	});

	handlebars.registerHelper("contrast", function(background, foreground) {
		background = scheme.deserialize(background);
		foreground = scheme.deserialize(foreground);

		return background.contrast(foreground, "WCAG21").toFixed(2);
	});

	sample.data = handlebars.compile(template.toString())(scheme);

	return sample;
}

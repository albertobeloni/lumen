import filesystem from "node:fs/promises";
import path from "node:path";

import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const list = async (directory) => {
	const entries = await filesystem.readdir(directory, {
		withFileTypes: true,
	});

	return entries
		.filter((entry) => {
			return entry.isDirectory() || path.extname(entry.name) === ".js";
		})
		.map((entry) => path.basename(entry.name, ".js"));
};

export const load = async (directory, name) => {
	const nested = path.join(directory, name, `${name}.js`);
	const file = existsSync(nested)
		? nested
		: path.join(directory, `${name}.js`);

	return (await import(pathToFileURL(file))).default;
};

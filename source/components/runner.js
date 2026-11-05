import filesystem from "node:fs/promises";
import path from "node:path";

import { execSync } from "node:child_process";

import { list, load } from "./loader.js";

const MODULES = path.join(import.meta.dirname, "..", "modules");

export const modules = async (filter = () => true) => {
	const names = (await list(MODULES)).filter(filter);

	return Promise.all(
		names.map(async (name) => ({ name, build: await load(MODULES, name) })),
	);
};

export const run = async (
	module,
	scheme,
	context,
	{ output, apply = false },
) => {
	const {
		directory,
		files = [],
		command,
		print,
	} = await module.build(scheme, context);
	const target = apply && directory ? directory : output;

	for (const file of files) {
		const destination = path.join(target, file.path);

		await filesystem.mkdir(path.dirname(destination), { recursive: true });
		await filesystem.writeFile(destination, file.data);
	}

	if (print) {
		process.stdout.write(print);
	}

	if (apply && command) {
		try {
			execSync(command, { stdio: "inherit" });
		} catch (error) {
			console.error(`${module.name}: ${error.message}`);
		}
	}
};

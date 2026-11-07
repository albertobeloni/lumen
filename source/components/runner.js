import filesystem from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { execSync } from "node:child_process";

import { list, load } from "./loader.js";

const CONFIG =
	process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config");
const MODULES = path.join(import.meta.dirname, "..", "modules");
const TIMEOUT = 10000; // Milliseconds a module command may run before it is stopped

const execute = async (module, scheme, context, { output, apply }) => {
	const {
		directory,
		files = [],
		command,
		print,
	} = await module.build(scheme, { ...context, config: CONFIG });
	for (const file of files) {
		const root = apply
			? directory
			: path.join(output, context.name, module.name);
		const destination = path.join(root, file.path);

		await filesystem.mkdir(path.dirname(destination), { recursive: true });
		await filesystem.writeFile(destination, file.data);
	}

	if (print) {
		process.stdout.write(print);
	}

	if (apply && command) {
		try {
			execSync(command, { stdio: "inherit", timeout: TIMEOUT });
		} catch (error) {
			console.error(`${module.name}: ${error.message}`);
		}
	}
};

export const modules = async (names, fallback) => {
	const available = await Promise.all(
		(await list(MODULES)).map(async (name) => {
			const { default: build, optional = false } = await load(
				MODULES,
				name,
			);

			return { name, build, optional };
		}),
	);

	if (names === undefined) {
		return available.filter(fallback);
	}

	if (names.includes("all")) {
		return available;
	}

	const unknown = names.find((name) => {
		return !available.some((module) => module.name === name);
	});

	if (unknown !== undefined) {
		throw new Error(`Unknown module "${unknown}"`);
	}

	return available.filter((module) => names.includes(module.name));
};

export const run = async (modules, scheme, context, options = {}) => {
	for (const module of modules) {
		await execute(module, scheme, context, options);
	}
};

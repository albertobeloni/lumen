import filesystem from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { execSync } from "node:child_process";

import { list, load } from "./loader.js";

const CONFIG =
	process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config");
const MODULES = path.join(import.meta.dirname, "..", "modules");
const OUTPUT = path.join(import.meta.dirname, "..", "..", "build");
const OPTIONAL = ["ansi"];
const TIMEOUT = 10000; // Milliseconds a module command may run before it is stopped

const execute = async (module, scheme, context, apply) => {
	const {
		directory,
		files = [],
		command,
		print,
	} = await module.build(scheme, { ...context, config: CONFIG });
	const output = path.join(OUTPUT, context.name, module.name);
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
			execSync(command, { stdio: "inherit", timeout: TIMEOUT });
		} catch (error) {
			console.error(`${module.name}: ${error.message}`);
		}
	}
};

export const modules = async (names, { optional = true } = {}) => {
	const available = await list(MODULES);
	const unknown = names?.find((name) => !available.includes(name));

	if (unknown !== undefined) {
		throw new Error(`Unknown module "${unknown}"`);
	}

	const selected = available.filter((name) => {
		return names === undefined
			? optional || !OPTIONAL.includes(name)
			: names.includes(name);
	});

	return Promise.all(
		selected.map(async (name) => {
			return { name, build: await load(MODULES, name) };
		}),
	);
};

export const run = async (modules, scheme, context, { apply = false } = {}) => {
	for (const module of modules) {
		await execute(module, scheme, context, apply);
	}
};

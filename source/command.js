#!/usr/bin/env node

import filesystem from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { parseArgs } from "node:util";

import Color from "colorjs.io";

import { colorfulness, GREY } from "./components/color.js";
import { extract } from "./components/image.js";
import { list, load } from "./components/loader.js";
import Lumen from "./lumen.js";

const OPTIONAL = ["json", "preview"];

const USAGE = `Usage:
  lumen build [input]
  lumen apply [input]`;

const OUTPUT = path.join(import.meta.dirname, "..", "build");

const MODULES = path.join(import.meta.dirname, "modules");
const SCHEMES = path.join(import.meta.dirname, "schemes");

const STATE = path.join(
	process.env.XDG_STATE_HOME ?? path.join(os.homedir(), ".local", "state"),
	"lumen",
);
const LAST = path.join(STATE, "last.json");

const exit = (message) => {
	console.error(message);
	process.exit(1);
};

// A grey color has no hue: like a greyscale image, it gets a neutral base and
// the default accents
const tint = (input) => {
	const color = new Color(input);

	if (colorfulness(color.to("lab-d65").coords) < GREY) {
		return { style: "neutral" };
	}

	return { primary: color.to("hct").get("h") };
};

// Turns an input (scheme name, image path or color) into a definition
const prepare = async (input) => {
	if ((await list(SCHEMES)).includes(input)) {
		return { name: input, input, definition: await load(SCHEMES, input) };
	}

	if (existsSync(input)) {
		const file = path.resolve(input);

		return { name: "Lumen", input: file, definition: await extract(file) };
	}

	return { name: "Lumen", input, definition: tint(input) };
};

// The resolved theme mode, for modules that can only hold one theme at a time
const mode = () => {
	try {
		return execSync("noctalia msg theme-mode-get", {
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
	} catch {
		return "dark";
	}
};

const modules = async (filter) => {
	const names = (await list(MODULES)).filter(filter);

	return Promise.all(
		names.map(async (name) => ({ name, build: await load(MODULES, name) })),
	);
};

// The definition is stored with the input, so applying again (when the theme
// mode changes, for example) doesn't need to analyse the image again
const remember = async (last) => {
	await filesystem.mkdir(STATE, { recursive: true });
	await filesystem.writeFile(LAST, `${JSON.stringify(last, null, "\t")}\n`);
};

const recall = async () => {
	const last = await filesystem.readFile(LAST, "utf8").catch(() => {
		exit('Nothing to apply yet, run "lumen apply <input>" first');
	});

	return JSON.parse(last);
};

const run = async (module, scheme, context, apply) => {
	const {
		directory,
		files = [],
		command,
		print,
	} = await module.build(scheme, context);
	const target =
		apply && directory ? directory : path.join(OUTPUT, module.name);

	for (const file of files) {
		const destination = path.join(target, file.path);

		await filesystem.mkdir(path.dirname(destination), { recursive: true });
		await filesystem.writeFile(destination, file.data);
	}

	if (print) {
		process.stdout.write(print);
	}

	// A failing reload (an application that isn't running, for example)
	// shouldn't stop the other modules
	if (apply && command) {
		try {
			execSync(command, { stdio: "inherit" });
		} catch (error) {
			console.error(`${module.name}: ${error.message}`);
		}
	}
};

// Every module into build/, for every scheme when there's no input
const build = async (input) => {
	const all = await modules(() => true);
	const targets =
		input === undefined
			? await Promise.all((await list(SCHEMES)).map(prepare))
			: [await prepare(input)];

	for (const { name, definition } of targets) {
		const scheme = Lumen(definition);

		for (const module of all) {
			await run(module, scheme, { name }, false);
		}
	}
};

// One scheme, named Lumen, into each module's own directory. Without input,
// the last one is applied again (when the theme mode changes, for example)
const apply = async (input) => {
	const last = input === undefined ? await recall() : await prepare(input);
	const scheme = Lumen(last.definition);
	const context = { name: "Lumen", mode: mode() };

	for (const module of await modules((name) => !OPTIONAL.includes(name))) {
		await run(module, scheme, context, true);
	}

	if (input !== undefined) {
		await remember({ input: last.input, definition: last.definition });
	}
};

const COMMANDS = { build, apply };

const main = async () => {
	const {
		positionals: [command, input],
	} = parseArgs({ allowPositionals: true });

	if (!Object.hasOwn(COMMANDS, command)) {
		exit(USAGE);
	}

	await COMMANDS[command](input);
};

main();

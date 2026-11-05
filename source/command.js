#!/usr/bin/env node

import filesystem from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { parseArgs } from "node:util";

import Color from "colorjs.io";

import { extract } from "./components/image.js";
import { list, load } from "./components/loader.js";
import Lumen from "./lumen.js";

const OPTIONAL = ["json", "preview"];

const USAGE = ["Usage:", "  lumen build [input]", "  lumen apply [input]"];

const ROOT = path.join(import.meta.dirname, "..");
const OUTPUT = path.join(ROOT, "build");

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

const expand = (directory) => {
	return directory.replace(/^~(?=$|\/)/, os.homedir());
};

const scheme = async (name) => {
	return { name, definition: await load(SCHEMES, name) };
};

const color = (input) => {
	return {
		name: "Lumen",
		definition: { primary: new Color(input).to("hct").get("h") },
	};
};

const image = async (input) => {
	return { name: "Lumen", definition: await extract(input) };
};

const inputs = async (input) => {
	const schemes = await list(SCHEMES);

	if (input === undefined) {
		return Promise.all(schemes.map(scheme));
	}

	if (schemes.includes(input)) {
		return [await scheme(input)];
	}

	if (existsSync(input)) {
		return [await image(input)];
	}

	return [color(input)];
};

const modules = async (filter) => {
	const names = (await list(MODULES)).filter(filter);
	const builds = await Promise.all(names.map((name) => load(MODULES, name)));

	return names.map((name, index) => ({ name, build: builds[index] }));
};

// The definition is stored with the input, so applying again (when the theme
// mode changes, for example) doesn't need to analyse the image again
const remember = async (input, definition) => {
	await filesystem.mkdir(STATE, { recursive: true });
	await filesystem.writeFile(
		LAST,
		`${JSON.stringify({ input, definition }, null, "\t")}\n`,
	);
};

const recall = async () => {
	const last = await filesystem.readFile(LAST, "utf8").catch(() => {
		exit('Nothing to apply yet, run "lumen apply <input>" first');
	});

	return JSON.parse(last);
};

const prepare = async (input) => {
	const value = existsSync(input) ? path.resolve(input) : input;
	const [{ definition }] = await inputs(value);

	return { input: value, definition };
};

const run = async (module, scheme, { name, apply }) => {
	const {
		directory,
		files = [],
		command,
		print,
	} = await module.build(scheme, { name });
	const target =
		apply && directory ? expand(directory) : path.join(OUTPUT, module.name);

	for (const file of files) {
		const destination = path.join(target, file.path);

		await filesystem.mkdir(path.dirname(destination), { recursive: true });
		await filesystem.writeFile(destination, file.data);
	}

	if (print) {
		process.stdout.write(print);
	}

	if (apply && command) {
		execSync(command, { stdio: "inherit" });
	}
};

const build = async (input) => {
	const all = await modules(() => true);

	for (const { name, definition } of await inputs(input)) {
		const scheme = Lumen(definition);

		for (const module of all) {
			await run(module, scheme, { name, apply: false });
		}
	}
};

const apply = async (input) => {
	const last = input === undefined ? await recall() : await prepare(input);
	const scheme = Lumen(last.definition);

	for (const module of await modules((name) => !OPTIONAL.includes(name))) {
		await run(module, scheme, { name: "Lumen", apply: true });
	}

	await remember(last.input, last.definition);
};

const COMMANDS = { build, apply };

const main = async () => {
	const {
		positionals: [command, input],
	} = parseArgs({ allowPositionals: true });

	if (!Object.hasOwn(COMMANDS, command ?? "")) {
		exit(USAGE.join("\n"));
	}

	await COMMANDS[command](input);
};

main();

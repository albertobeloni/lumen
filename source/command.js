#!/usr/bin/env node

import filesystem from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { parseArgs } from "node:util";

import Color from "colorjs.io";

import { list, load } from "./components/loader.js";
import Lumen from "./lumen.js";

const OPTIONAL = ["json", "preview"];

const ROOT = path.join(import.meta.dirname, "..");
const OUTPUT = path.join(ROOT, "build");

const MODULES = path.join(import.meta.dirname, "modules");
const SCHEMES = path.join(import.meta.dirname, "schemes");

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

const inputs = async (input) => {
	const schemes = await list(SCHEMES);

	if (input === undefined) {
		return Promise.all(schemes.map(scheme));
	}

	if (schemes.includes(input)) {
		return [await scheme(input)];
	}

	if (existsSync(input)) {
		exit("Image input is not implemented yet");
	}

	return [color(input)];
};

const run = async (module, build, scheme, name) => {
	const {
		directory,
		files = [],
		command,
		print,
	} = await build(scheme, {
		name,
	});
	const target = expand(directory ?? path.join(OUTPUT, module));

	for (const file of files) {
		const destination = path.join(target, file.path);

		await filesystem.mkdir(path.dirname(destination), { recursive: true });
		await filesystem.writeFile(destination, file.data);
	}

	if (print) {
		process.stdout.write(print);
	}

	if (command) {
		execSync(command, { stdio: "inherit" });
	}
};

const main = async () => {
	const {
		positionals: [input],
		values: { all },
	} = parseArgs({
		allowPositionals: true,
		options: { all: { type: "boolean", short: "a", default: false } },
	});

	const names = (await list(MODULES)).filter((name) => {
		return all || !OPTIONAL.includes(name);
	});
	const builds = await Promise.all(names.map((name) => load(MODULES, name)));

	for (const { name, definition } of await inputs(input)) {
		const scheme = Lumen(definition);

		for (const [index, module] of names.entries()) {
			await run(module, builds[index], scheme, name);
		}
	}
};

main();

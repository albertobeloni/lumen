#!/usr/bin/env node

import filesystem from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { parseArgs } from "node:util";

import { lock } from "./components/locker.js";
import { read, schemes } from "./components/reader.js";
import { modules, run } from "./components/runner.js";
import Lumen from "./lumen.js";

const OPTIONAL = ["ansi"];
const MODES = ["dark", "light"];

const USAGE = `Usage:
  lumen build [input] [--mode dark|light] [--module name]...
  lumen apply [input] [--mode dark|light] [--module name]...`;

const OUTPUT = path.join(import.meta.dirname, "..", "build");

const STATE = path.join(
	process.env.XDG_STATE_HOME ?? path.join(os.homedir(), ".local", "state"),
	"lumen",
);
const LAST = path.join(STATE, "last.json");

const exit = (message) => {
	console.error(message);
	process.exit(1);
};

const remember = async (last) => {
	await filesystem.mkdir(STATE, { recursive: true });
	await filesystem.writeFile(LAST, `${JSON.stringify(last, null, "\t")}\n`);
};

const recall = async () => {
	const last = await filesystem.readFile(LAST, "utf8").catch(() => "{}");

	return JSON.parse(last);
};

const select = (names, fallback) => {
	return names === undefined ? fallback : (name) => names.includes(name);
};

const build = async (input, mode, names) => {
	const all = await modules(select(names, () => true));
	const targets =
		input === undefined
			? await Promise.all((await schemes()).map(read))
			: [await read(input)];

	for (const target of targets) {
		const scheme = Lumen(target.definition);
		const context = { name: target.name, mode: mode ?? target.mode };

		for (const module of all) {
			const output = path.join(OUTPUT, module.name);

			await run(module, scheme, context, { output });
		}
	}
};

const apply = async (input, mode, names) => {
	const release = await lock("lumen");

	try {
		const last = await recall();
		const next = input === undefined ? last : await read(input);

		if (next.definition === undefined) {
			exit('Nothing to apply yet, run "lumen apply <input>" first');
		}

		const current = {
			input: next.input,
			definition: next.definition,
			mode: mode ?? next.mode ?? last.mode ?? "dark",
		};
		const scheme = Lumen(current.definition);
		const context = { name: "Lumen", mode: current.mode };

		const applied = await modules(
			select(names, (name) => !OPTIONAL.includes(name)),
		);

		for (const module of applied) {
			const output = path.join(OUTPUT, module.name);

			await run(module, scheme, context, { output, apply: true });
		}

		if (input !== undefined || mode !== undefined) {
			await remember(current);
		}
	} finally {
		release();
	}
};

const COMMANDS = { build, apply };

const main = async () => {
	const {
		positionals: [command, input],
		values: { mode, module: names },
	} = parseArgs({
		allowPositionals: true,
		options: {
			mode: { type: "string", short: "m" },
			module: { type: "string", short: "M", multiple: true },
		},
	});

	if (!Object.hasOwn(COMMANDS, command)) {
		exit(USAGE);
	}

	if (mode !== undefined && !MODES.includes(mode)) {
		exit(USAGE);
	}

	const known = (await modules()).map(({ name }) => name);

	if (names?.some((name) => !known.includes(name))) {
		exit(USAGE);
	}

	await COMMANDS[command](input, mode, names);
};

main();

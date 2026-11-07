#!/usr/bin/env node

import { parseArgs } from "node:util";

import { exclusive } from "./components/locker.js";
import { read, schemes } from "./components/reader.js";
import { modules, run } from "./components/runner.js";
import { recall, remember } from "./components/state.js";
import Lumen, { NAME } from "./lumen.js";

const MODE = "dark";
const MODES = ["dark", "light"];

const USAGE = `Usage:
  lumen build [input] [--mode dark|light] [--module name]...
  lumen apply [input] [--mode dark|light] [--module name]...`;

const exit = (message) => {
	console.error(message);
	process.exit(1);
};

const build = async (input, mode, names) => {
	const selected = await modules(names);
	const targets =
		input === undefined
			? await Promise.all((await schemes()).map(read))
			: [await read(input)];

	for (const target of targets) {
		const scheme = Lumen(target.definition);
		const context = {
			name: target.name,
			mode: mode ?? target.mode ?? MODE,
		};

		await run(selected, scheme, context);
	}
};

const apply = async (input, mode, names) => {
	const selected = await modules(names, { optional: false });
	const last = await recall();
	const next = input === undefined ? last : await read(input);

	if (next.definition === undefined) {
		throw new Error(
			'Nothing to apply yet, run "lumen apply <input>" first',
		);
	}

	const current = {
		input: next.input,
		definition: next.definition,
		mode: mode ?? next.mode ?? last.mode ?? MODE,
	};
	const scheme = Lumen(current.definition);
	const context = { name: NAME, mode: current.mode };

	await run(selected, scheme, context, { apply: true });

	const changed = input !== undefined || mode !== undefined;

	if (changed && names === undefined) {
		await remember(current);
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

	await exclusive("lumen", () => COMMANDS[command](input, mode, names));
};

main().catch((error) => exit(error.message));

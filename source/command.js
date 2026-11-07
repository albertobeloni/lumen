#!/usr/bin/env node

import path from "node:path";

import { parseArgs } from "node:util";

import { exclusive } from "./components/locker.js";
import { read, schemes } from "./components/reader.js";
import { modules, run } from "./components/runner.js";
import { recall, remember } from "./components/state.js";
import Lumen, { NAME } from "./lumen.js";

const THEME = "dark";
const THEMES = ["dark", "light"];
const OUTPUT = "build";

const HELP = `Usage: lumen <command> [input] [options]

Commands:
  apply [input]         Generate a scheme and apply it to your applications
  theme <dark|light>    Switch the current scheme to the dark or light theme
  build [input...]      Write module files to a folder, without touching applications
  show [input]          Print a preview of a scheme in the terminal

An input is a scheme name, a color or an image. Without one, apply, theme
and show use the current scheme, and build uses every bundled scheme.

Options:
  -m, --module <name,...|all>   Only these modules (optional ones run only when named)
  -t, --theme <dark|light>      Theme for modules that hold a single theme
  -o, --output <dir>            Output folder for build (default: ./build)
  -h, --help                    Show this help`;

const validate = (value) => {
	if (value !== undefined && !THEMES.includes(value)) {
		throw new Error(`Unknown theme "${value}" (use dark or light)`);
	}

	return value;
};

const required = (module) => {
	return !module.optional;
};

const optional = (module) => {
	return module.optional;
};

const target = async (input) => {
	if (input !== undefined) {
		return read(input);
	}

	const last = await recall();

	if (last.definition === undefined) {
		throw new Error(
			'No scheme applied yet, run "lumen apply <input>" first',
		);
	}

	return { name: NAME, ...last };
};

const commands = {
	apply: async ([input], options) => {
		const last = await recall();
		const next = await target(input);
		const state = {
			input: next.input,
			definition: next.definition,
			theme: options.theme ?? next.theme ?? last.theme ?? THEME,
		};
		const selected = await modules(options.module, required);

		await run(
			selected,
			Lumen(state.definition),
			{ name: NAME, theme: state.theme },
			{ apply: true },
		);

		if (options.module === undefined) {
			await remember(state);
		}
	},

	theme: async ([value], options) => {
		if (value === undefined) {
			throw new Error("Missing theme (use dark or light)");
		}

		await commands.apply([], { ...options, theme: validate(value) });
	},

	build: async (inputs, options) => {
		const names = inputs.length === 0 ? await schemes() : inputs;
		const targets = await Promise.all(names.map(read));
		const selected = await modules(options.module, required);
		const output = path.resolve(options.output ?? OUTPUT);

		for (const { name, definition, theme } of targets) {
			await run(
				selected,
				Lumen(definition),
				{ name, theme: options.theme ?? theme ?? THEME },
				{ output },
			);
		}
	},

	show: async ([input], options) => {
		const { name, definition, theme } = await target(input);
		const selected = await modules(options.module, optional);

		await run(selected, Lumen(definition), {
			name,
			theme: options.theme ?? theme ?? THEME,
		});
	},
};

const parse = () => {
	const { positionals, values } = parseArgs({
		allowPositionals: true,
		options: {
			module: { type: "string", short: "m" },
			theme: { type: "string", short: "t" },
			output: { type: "string", short: "o" },
			help: { type: "boolean", short: "h" },
		},
	});
	const [command, ...inputs] = positionals;

	return {
		command,
		inputs,
		help: values.help,
		options: {
			module: values.module?.split(","),
			theme: validate(values.theme),
			output: values.output,
		},
	};
};

const main = async () => {
	const { command, inputs, help, options } = parse();

	if (help || command === undefined) {
		console.log(HELP);
		process.exit(help ? 0 : 1);
	}

	if (!Object.hasOwn(commands, command)) {
		throw new Error(`Unknown command "${command}", see "lumen --help"`);
	}

	await exclusive("lumen", () => commands[command](inputs, options));
};

main().catch((error) => {
	console.error(error.message);
	process.exit(1);
});

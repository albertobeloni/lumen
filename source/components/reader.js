import filesystem from "node:fs/promises";
import path from "node:path";

import { statSync } from "node:fs";

import Color from "colorjs.io";

import { colorfulness, GREY } from "./color.js";
import { extract } from "./extractor.js";
import { list, load } from "./loader.js";

const SCHEMES = path.join(import.meta.dirname, "..", "schemes");

const parse = (input) => {
	try {
		return new Color(input);
	} catch {
		throw new Error(
			`Unknown input "${input}" (not a scheme, file or color)`,
		);
	}
};

const tint = (input) => {
	const color = parse(input);

	if (colorfulness(color.to("lab-d65").coords) < GREY) {
		return { style: "neutral" };
	}

	return { primary: color.to("hct").get("h") };
};

const restore = async (file) => {
	const { input, definition, theme } = JSON.parse(
		await filesystem.readFile(file, "utf8"),
	);

	return { input, definition, theme };
};

export const schemes = () => {
	return list(SCHEMES);
};

export const read = async (input) => {
	if ((await schemes()).includes(input)) {
		const { default: definition } = await load(SCHEMES, input);

		return { name: input, input, definition };
	}

	if (statSync(input, { throwIfNoEntry: false })?.isFile()) {
		const file = path.resolve(input);

		if (path.extname(file) === ".json") {
			return restore(file);
		}

		return { input: file, definition: await extract(file) };
	}

	return { input, definition: tint(input) };
};

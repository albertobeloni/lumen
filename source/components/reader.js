import filesystem from "node:fs/promises";
import path from "node:path";

import { statSync } from "node:fs";

import Color from "colorjs.io";

import { colorfulness, GREY } from "./color.js";
import { extract } from "./extractor.js";
import { list, load } from "./loader.js";
import { NAME } from "../lumen.js";

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
	const { input, definition, mode } = JSON.parse(
		await filesystem.readFile(file, "utf8"),
	);

	return { name: NAME, input, definition, mode };
};

export const schemes = () => {
	return list(SCHEMES);
};

export const read = async (input) => {
	if ((await schemes()).includes(input)) {
		return { name: input, input, definition: await load(SCHEMES, input) };
	}

	if (statSync(input, { throwIfNoEntry: false })?.isFile()) {
		const file = path.resolve(input);

		if (path.extname(file) === ".json") {
			return restore(file);
		}

		return { name: NAME, input: file, definition: await extract(file) };
	}

	return { name: NAME, input, definition: tint(input) };
};

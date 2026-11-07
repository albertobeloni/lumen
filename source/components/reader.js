import filesystem from "node:fs/promises";
import path from "node:path";

import { existsSync } from "node:fs";

import Color from "colorjs.io";

import { colorfulness, GREY } from "./color.js";
import { extract } from "./extractor.js";
import { list, load } from "./loader.js";

const SCHEMES = path.join(import.meta.dirname, "..", "schemes");

const tint = (input) => {
	const color = new Color(input);

	if (colorfulness(color.to("lab-d65").coords) < GREY) {
		return { style: "neutral" };
	}

	return { primary: color.to("hct").get("h") };
};

const restore = async (file) => {
	const { input, definition, mode } = JSON.parse(
		await filesystem.readFile(file, "utf8"),
	);

	return { name: "Lumen", input, definition, mode };
};

export const schemes = () => {
	return list(SCHEMES);
};

export const read = async (input) => {
	if ((await schemes()).includes(input)) {
		return { name: input, input, definition: await load(SCHEMES, input) };
	}

	if (existsSync(input)) {
		const file = path.resolve(input);

		if (path.extname(file) === ".json") {
			return restore(file);
		}

		return { name: "Lumen", input: file, definition: await extract(file) };
	}

	return { name: "Lumen", input, definition: tint(input) };
};

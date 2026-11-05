// Precomputes the shared chroma for every tone of the scale. Run it again after
// changing STEPS or the measurement in source/components/color.js.

import filesystem from "node:fs/promises";

import { existsSync } from "node:fs";

const TABLE = new URL("../source/components/chroma.json", import.meta.url);

// color.js imports the table, so it has to exist before color.js is loaded
if (!existsSync(TABLE)) {
	await filesystem.writeFile(TABLE, "{}\n");
}

const { measure, scale, STEPS } = await import("../source/components/color.js");

const table = Object.fromEntries(
	scale(STEPS)
		.filter((tone) => tone > 0 && tone < 100)
		.map((tone) => [tone.toFixed(6), measure(tone)]),
);

await filesystem.writeFile(TABLE, `${JSON.stringify(table, null, "\t")}\n`);

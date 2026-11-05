import filesystem from "node:fs/promises";

import { existsSync } from "node:fs";

const TABLE = new URL("../source/components/chroma.json", import.meta.url);

if (!existsSync(TABLE)) {
	await filesystem.writeFile(TABLE, "{}\n");
}

const { measure, scale } = await import("../source/components/color.js");
const { STEPS } = await import("../source/lumen.js");

const table = Object.fromEntries(
	scale(STEPS)
		.filter((tone) => tone > 0 && tone < 100)
		.map((tone) => [tone.toFixed(6), measure(tone)]),
);

await filesystem.writeFile(TABLE, `${JSON.stringify(table, null, "\t")}\n`);

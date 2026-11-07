import filesystem from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const DIRECTORY = path.join(
	process.env.XDG_STATE_HOME ?? path.join(os.homedir(), ".local", "state"),
	"lumen",
);

const FILE = path.join(DIRECTORY, "last.json");

export const recall = async () => {
	const last = await filesystem.readFile(FILE, "utf8").catch(() => "{}");

	return JSON.parse(last);
};

export const remember = async (last) => {
	await filesystem.mkdir(DIRECTORY, { recursive: true });
	await filesystem.writeFile(FILE, `${JSON.stringify(last, null, "\t")}\n`);
};

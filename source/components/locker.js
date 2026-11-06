import filesystem from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { rmSync } from "node:fs";

const DIRECTORY = process.env.XDG_RUNTIME_DIR ?? os.tmpdir();
const INTERVAL = 100; // Milliseconds between attempts while another process holds the lock

const wait = (milliseconds) => {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const alive = (pid) => {
	try {
		process.kill(pid, 0);

		return true;
	} catch (error) {
		return error.code === "EPERM";
	}
};

export const lock = async (name) => {
	const file = path.join(DIRECTORY, `${name}.lock`);

	for (;;) {
		try {
			await filesystem.writeFile(file, `${process.pid}`, { flag: "wx" });
			break;
		} catch (error) {
			if (error.code !== "EEXIST") {
				throw error;
			}
		}

		const owner = Number(
			await filesystem.readFile(file, "utf8").catch(() => ""),
		);

		if (owner && !alive(owner)) {
			await filesystem.rm(file, { force: true });
			continue;
		}

		await wait(INTERVAL);
	}

	const release = () => rmSync(file, { force: true });

	process.once("exit", release);

	return () => {
		process.off("exit", release);
		release();
	};
};

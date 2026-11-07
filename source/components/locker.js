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

const acquire = async (file) => {
	try {
		await filesystem.writeFile(file, `${process.pid}`, { flag: "wx" });

		return true;
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

		return acquire(file);
	}

	return false;
};

export const exclusive = async (name, task) => {
	const file = path.join(DIRECTORY, `${name}.lock`);

	while (!(await acquire(file))) {
		await wait(INTERVAL);
	}

	const release = () => {
		rmSync(file, { force: true });
	};

	process.once("exit", release);

	try {
		return await task();
	} finally {
		process.off("exit", release);
		release();
	}
};

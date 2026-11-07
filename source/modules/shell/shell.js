import path from "node:path";

import { createHash } from "node:crypto";

const flatten = (node, prefix) => {
	return Object.entries(node).flatMap(([key, value]) => {
		const name = prefix ? `${prefix}.${key}` : key;

		if (typeof value === "string") {
			return [[name, value]];
		}

		return flatten(value, name);
	});
};

const palette = (roles) => {
	const lines = flatten(roles)
		.filter(([, value]) => value.length === 7)
		.map(([name, value]) => `\t[${name}]="${value}"`);

	return `declare -gA PALETTE=(\n${lines.join("\n")}\n)\n`;
};

export default (scheme, { theme, config }) => {
	const body = palette(scheme.theme[theme].roles);
	const hash = createHash("sha1").update(body).digest("hex");
	const data = `# lumen ${hash.slice(0, 8)}\n${body}`;

	return {
		directory: path.join(config, "lumen"),
		files: [{ path: "shell.sh", data }],
	};
};

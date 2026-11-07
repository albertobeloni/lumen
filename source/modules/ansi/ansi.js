const LEVELS = ["silent", "subtle", "normal", "strong"];

const WIDTH = 3;
const HEIGHT = 1;
const GAP = 1;
const PADDING = 1;

const block = (hex) => {
	const [red, green, blue] = hex
		.match(/\w\w/g)
		.map((pair) => parseInt(pair, 16));

	return `\x1b[48;2;${red};${green};${blue}m${" ".repeat(WIDTH)}\x1b[0m`;
};

export const optional = true;

export default (scheme, { theme }) => {
	const { ansi } = scheme.theme[theme].roles;

	const colors = Object.values(ansi);
	const width = colors.length * WIDTH + (colors.length - 1) * GAP;
	const columns = process.stdout.columns ?? 80;
	const margin = " ".repeat(Math.max(0, Math.floor((columns - width) / 2)));
	const padding = "\n".repeat(PADDING);

	const lines = LEVELS.flatMap((level) => {
		const blocks = colors.map((color) => block(color[level]));
		const row = `${margin}${blocks.join(" ".repeat(GAP))}`;

		return Array.from({ length: HEIGHT }, () => row);
	});

	return { print: `${padding}${lines.join("\n")}\n${padding}` };
};

const COLORS = [
	"black",
	"red",
	"green",
	"yellow",
	"blue",
	"magenta",
	"cyan",
	"white",
];
const LEVELS = ["subtle", "normal", "strong"];

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

export default (scheme, { mode = "dark" }) => {
	const { ansi } = scheme.theme[mode].roles;

	const width = COLORS.length * WIDTH + (COLORS.length - 1) * GAP;
	const columns = process.stdout.columns ?? 80;
	const margin = " ".repeat(Math.max(0, Math.floor((columns - width) / 2)));
	const padding = "\n".repeat(PADDING);

	const lines = LEVELS.flatMap((level) => {
		const blocks = COLORS.map((name) => block(ansi[name][level]));
		const row = `${margin}${blocks.join(" ".repeat(GAP))}`;

		return Array.from({ length: HEIGHT }, () => row);
	});

	return { print: `${padding}${lines.join("\n")}\n${padding}` };
};

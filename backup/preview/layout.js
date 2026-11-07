import { group, rect } from "./svg.js";

export const node = (width, height, svg) => ({ width, height, svg });

export const row = (nodes, gap = 0) => {
	let x = 0;

	const svg = nodes.map((child) => {
		const placed = group(x, 0, child.svg);
		x += child.width + gap;
		return placed;
	});

	return node(
		x - gap,
		Math.max(...nodes.map((child) => child.height)),
		svg.join(""),
	);
};

export const column = (nodes, gap = 0) => {
	let y = 0;

	const svg = nodes.map((child) => {
		const placed = group(0, y, child.svg);
		y += child.height + gap;
		return placed;
	});

	return node(
		Math.max(...nodes.map((child) => child.width)),
		y - gap,
		svg.join(""),
	);
};

export const pad = (child, padding, fill) => {
	const width = child.width + padding * 2;
	const height = child.height + padding * 2;

	return node(
		width,
		height,
		[
			fill ? rect(width, height, fill) : "",
			group(padding, padding, child.svg),
		].join(""),
	);
};

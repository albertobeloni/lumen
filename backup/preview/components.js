import { contrast } from "../../components/color.js";
import { column, node, pad } from "./layout.js";
import { baseline, grade, LINE, SPACE, TYPE } from "./style.js";
import { MONO, rect, text } from "./svg.js";

const LEVELS = ["strong", "normal", "subtle"];

export const ratio = (foreground, background) => {
	const value = contrast(foreground, background);

	return `${value.toFixed(2)} ${grade(value)}`.trim();
};

export const line = (label, fill, background, width, type = TYPE.body) => {
	const y = baseline(LINE, type.size);

	return node(width, LINE, [
		text(label, { ...type, y, fill }),
		text(ratio(fill, background), {
			...type,
			x: width,
			y,
			anchor: "end",
			fill,
		}),
	]);
};

const title = (name, surface, width) => {
	return node(width, 40, [
		text(name, { ...TYPE.label, y: 14, fill: surface.foreground.strong }),
		text(surface.background, {
			...TYPE.body,
			family: MONO,
			y: 32,
			fill: surface.foreground.subtle,
		}),
	]);
};

const outlines = (surface, width) => {
	const y = baseline(LINE, TYPE.body.size);

	return column(
		LEVELS.map((level) => {
			const stroke = surface.outline[level];

			return node(width, LINE, [
				rect(11, 11, "none", { x: 0.5, y: 4.5, rx: 2, stroke }),
				text(level, {
					...TYPE.body,
					x: 20,
					y,
					fill: surface.foreground.subtle,
				}),
				text(ratio(stroke, surface.background), {
					...TYPE.body,
					x: width,
					y,
					anchor: "end",
					fill: surface.foreground.subtle,
				}),
			]);
		}),
	);
};

export const block = (name, surface, width) => {
	const inner = width - SPACE.l * 2;

	return pad(
		column(
			[
				title(name, surface, inner),
				column(
					LEVELS.map((level) =>
						line(
							level,
							surface.foreground[level],
							surface.background,
							inner,
						),
					),
				),
				outlines(surface, inner),
			],
			SPACE.s,
		),
		SPACE.l,
		surface.background,
	);
};

const swatch = (tone, field, width) => {
	const inner = width - SPACE.l * 2;

	return pad(
		node(inner, LINE, [
			rect(12, 12, tone.color, { y: 4, rx: 6 }),
			text("color", {
				...TYPE.body,
				x: 20,
				y: baseline(LINE, TYPE.body.size),
				fill: tone.color,
			}),
			text(ratio(tone.color, field), {
				...TYPE.body,
				x: inner,
				y: baseline(LINE, TYPE.body.size),
				anchor: "end",
				fill: tone.color,
			}),
		]),
		SPACE.l,
		field,
	);
};

export const tone = (name, value, field, width) => {
	return column([
		block(name, value, width),
		swatch(value, field, width),
		block("container", value.container, width),
	]);
};

export const heading = (label, fill, width) => {
	return node(
		width,
		LINE,
		text(label.toUpperCase(), {
			...TYPE.heading,
			y: baseline(LINE, TYPE.heading.size),
			fill,
		}),
	);
};

export const chip = (fill, label, field, width) => {
	const y = baseline(LINE, TYPE.body.size);

	return column(
		[
			node(
				width,
				32,
				rect(width - 1, 31, fill, {
					x: 0.5,
					y: 0.5,
					rx: 4,
					stroke: field.outline.subtle,
				}),
			),
			node(width, LINE, [
				text(label, { ...TYPE.body, y, fill: field.foreground.subtle }),
				text(ratio(fill, field.background), {
					...TYPE.body,
					x: width,
					y,
					anchor: "end",
					fill: field.foreground.normal,
				}),
			]),
		],
		SPACE.xs,
	);
};

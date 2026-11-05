import sharp from "sharp";

import { column, pad, row } from "./layout.js";
import {
	accents,
	ansi,
	colors,
	header,
	overlays,
	ramps,
	status,
	surfaces,
	syntax,
} from "./sections.js";
import { SPACE } from "./style.js";
import { document } from "./svg.js";

const sheet = (name, theme) => {
	const { name: mode, roles } = theme;
	const id = `shadow-${mode.toLowerCase().replace(/\W+/g, "-")}`;

	return pad(
		column(
			[
				header(roles, `${name} · ${mode}`),
				accents(roles),
				colors(roles),
				status(roles),
				surfaces(roles),
				overlays(roles, id),
				ansi(roles),
				syntax(roles),
				ramps(theme),
			],
			SPACE.xxxl,
		),
		SPACE.xxxl,
		roles.surface.field.background,
	);
};

export default async (scheme, { name }) => {
	const svg = document(
		row([sheet(name, scheme.theme.dark), sheet(name, scheme.theme.light)]),
	);
	const png = await sharp(Buffer.from(svg), { density: 144 })
		.png()
		.toBuffer();

	return {
		files: [
			{ path: `${name}.svg`, data: svg },
			{ path: `${name}.png`, data: png },
		],
	};
};

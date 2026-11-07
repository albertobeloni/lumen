export const SANS = "sans-serif";
export const MONO = "monospace";

const escape = (value) => {
	return String(value).replace(/[&<>"]/g, (character) => {
		return `&#${character.charCodeAt(0)};`;
	});
};

const attributes = (values) => {
	return Object.entries(values)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => ` ${key}="${escape(value)}"`)
		.join("");
};

export const element = (tag, values = {}, children) => {
	return children === undefined
		? `<${tag}${attributes(values)}/>`
		: `<${tag}${attributes(values)}>${[children].flat().join("")}</${tag}>`;
};

export const group = (x, y, children) => {
	return element("g", { transform: `translate(${x} ${y})` }, children);
};

export const rect = (width, height, fill, values = {}) => {
	return element("rect", { width, height, fill, ...values });
};

export const text = (
	content,
	{
		x = 0,
		y = 0,
		size = 14,
		weight = 400,
		family = SANS,
		fill,
		anchor,
		spacing,
	} = {},
) => {
	return element(
		"text",
		{
			x,
			y,
			fill,
			"font-family": family,
			"font-size": size,
			"font-weight": weight,
			"text-anchor": anchor,
			"letter-spacing": spacing,
		},
		escape(content),
	);
};

export const document = ({ width, height, svg }) => {
	return element(
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			"xml:space": "preserve",
			width,
			height,
			viewBox: `0 0 ${width} ${height}`,
		},
		svg,
	);
};

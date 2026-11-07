import { render } from "./color.js";

const TYPES = ["palette", "role", "value"];

const color = (node, context) => {
	const result = source(node, context);

	return Object.hasOwn(node, "alpha") ? render(result, node.alpha) : result;
};

const end = (node) => {
	return TYPES.some((type) => Object.hasOwn(node, type));
};

const find = (roles, path) => {
	return path.split(".").reduce((node, key) => node[key], roles);
};

const follow = (path, context) => {
	if (!context.cache.has(path)) {
		context.cache.set(path, parse(find(context.roles, path), context));
	}

	return context.cache.get(path);
};

const parse = (node, context) => {
	if (end(node)) {
		return color(node, context);
	}

	return Object.fromEntries(
		Object.entries(node).map(([key, child]) => {
			return [key, parse(child, context)];
		}),
	);
};

const source = (node, context) => {
	if (Object.hasOwn(node, "palette")) {
		const colors = context.palette[node.palette];
		const index = node.level + context.offset;

		return colors[Math.min(Math.max(index, 0), colors.length - 1)];
	}

	if (Object.hasOwn(node, "value")) {
		return render(node.value);
	}

	return structuredClone(follow(node.role, context));
};

export const resolve = (roles, palette, offset) => {
	return parse(roles, { cache: new Map(), offset, palette, roles });
};

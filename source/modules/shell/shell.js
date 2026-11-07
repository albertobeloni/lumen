import path from "node:path";

const colors = ({ accent }) => {
	const { primary, secondary, tertiary } = accent;

	return `LUMEN_PRIMARY="${primary.color}"
LUMEN_SECONDARY="${secondary.color}"
LUMEN_TERTIARY="${tertiary.color}"
`;
};

export default (scheme, { theme, config }) => {
	return {
		directory: path.join(config, "lumen"),
		files: [{ path: "shell.sh", data: colors(scheme.theme[theme].roles) }],
	};
};

export default (scheme, { name }) => ({
	files: [{ path: `${name}.json`, data: JSON.stringify(scheme, null, "\t") }],
});

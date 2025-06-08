import filesystem from "fs";
import path from "path";

import lumen from "./lumen.js";

function list(directory) {
	return filesystem.readdirSync(directory);
}

function files(directory) {
	let files = list(directory);

	files = files.map(file => path.join(directory, file));
	files = files.filter(file => filesystem.statSync(file).isFile());

	return files;
}

async function load(module) {
	return await import(path.resolve(module));
}

function write(directory, file, data) {
	filesystem.mkdirSync(directory, {
		recursive: true
	});
	filesystem.writeFileSync(path.join(directory, file), data);
}

const imports = [];
const modules = {};
const schemes = [];

files("source/schemes").forEach(scheme => {
	imports.push(load(scheme).then(scheme => {
		schemes.push(scheme.data);
	}));
});

files("source/modules").forEach(module => {
	imports.push(load(module).then(module => {

		for (const key in module) {
			modules[key] = module[key];
		}

	}));
});

Promise.all(imports).then(() => {
	schemes.forEach(scheme => {
		scheme = lumen(scheme);
		scheme = {...scheme, ...modules.functions};

		const sample = modules.sample(scheme);
		write("build/sample", sample.file, sample.data);

		const vscode = modules.vscode(scheme);
		write("build/vscode/themes", vscode.file, vscode.data);

		const windowsTerminal = modules.windowsTerminal(scheme);
		write("build/windows-terminal", windowsTerminal.file, windowsTerminal.data);

		const colors = modules.colors(scheme);
		write("build/colors", colors.file, colors.data);

		const css = modules.css(scheme);
		write("build/css", css.file, css.data);
	});
});

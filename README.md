# Lumen

Perceptual color scheme generator. Every scheme has a dark and a light theme
with balanced chroma across hues and the same contrast in both modes.

## Usage

```sh
lumen build [input] [--mode dark|light]   # every module into build/<module>/ (no input: every scheme)
lumen apply [input] [--mode dark|light]   # one scheme into each application (no input: the last one applied)
```

The input can be the name of a scheme in `source/schemes/`, a color
(`"#7c5cff"`, `"oklch(60% 0.15 290)"`) or an image. `apply` stores the last
input and mode in `$XDG_STATE_HOME/lumen/last.json`, so `lumen apply --mode
light` switches the mode of the current scheme, and a new input keeps the
current mode. The mode starts as `dark`.

From an image, Lumen takes three hues:

- **base**: the hue covering the most area (tinted surfaces, `natural` style)
- **primary**: the most dominant hue, weighted by chroma, ignoring greys
- **tertiary**: the most dominant hue that is also distinct from primary (each
  hue's strength is scaled by how far it is from primary, at least 30° away)

A greyscale image gives a neutral base, and primary and tertiary fall back to
the defaults.

`build` is for development: it never touches application configuration and
never runs commands. `apply` skips development modules (`json`, `preview`).

## Library

```js
import Lumen, { read } from "lumen";

const { definition } = await read("/path/to/wallpaper.jpg"); // or a scheme name, or a color
const { palette, theme } = Lumen(definition);
```

## Modules

Each module lives in `source/modules/<name>/<name>.js` and default-exports a
function that receives the scheme and returns what to do with it:

```js
const CONFIG =
	process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config");

export default (scheme, { name, mode }) => ({
	directory: path.join(CONFIG, "app"), // apply only; build uses build/<module>/
	files: [{ path: `${name}.conf`, data: "…" }],
	command: "app --reload", // apply only, after the files are written
	print: "…", // written to stdout
});
```

All fields are optional. `directory` must be an absolute path. A failing
`command` is reported but doesn't stop the other modules.

`mode` is the theme mode (`dark` or `light`) during `apply`, and the `--mode`
value (or `undefined`) during `build`. Modules for applications that can hold
both themes should ignore it and write both. The others write the theme for the
given mode, and `lumen apply --mode <mode>` runs them again when the mode
changes.

## Development

The shared chroma of each tone is expensive to measure, so it is precomputed in
`source/components/chroma.json`. Regenerate it after changing `STEPS` or the
measurement in `source/components/color.js`:

```sh
npm run chroma
```

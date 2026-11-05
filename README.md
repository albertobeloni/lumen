# Lumen

Perceptual color scheme generator. Every scheme has a dark and a light theme
with balanced chroma across hues and the same contrast in both modes.

## Usage

```sh
lumen build [input]   # every module into build/<module>/ (no input: every scheme)
lumen apply [input]   # one scheme into each application (no input: the last one applied)
```

The input can be the name of a scheme in `source/schemes/`, a color
(`"#7c5cff"`, `"oklch(60% 0.15 290)"`) or an image. The last input is stored
in `$XDG_STATE_HOME/lumen/input`.

From an image, Lumen takes three hues:

- **base**: the hue covering the most area (tinted surfaces, `natural` style)
- **primary**: the most dominant hue, weighted by chroma, ignoring greys
- **tertiary**: the most dominant hue that is also distinct from primary (each
  hue's strength is scaled by how far it is from primary, at least 30° away)

A greyscale image gives a neutral base, and primary and tertiary fall back to
the defaults.

`build` is for development: it never touches application configuration and
never runs commands. `apply` skips development modules (`json`, `preview`).

## Modules

Each module lives in `source/modules/<name>/<name>.js` and default-exports a
function that receives the scheme and returns what to do with it:

```js
export default (scheme, { name }) => ({
	directory: "~/.config/app", // apply only; build always uses build/<module>/
	files: [{ path: `${name}.conf`, data: "…" }],
	command: "app --reload", // apply only, after the files are written
	print: "…", // written to stdout
});
```

All fields are optional.

## Development

The shared chroma of each tone is expensive to measure, so it is precomputed in
`source/components/chroma.json`. Regenerate it after changing `STEPS` or the
measurement in `source/components/color.js`:

```sh
npm run chroma
```

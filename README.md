# Yeet Docs Website

This repository contains the documentation website for **yeet** and **catch**.

## Local Development

### Tooling (recommended: mise)

```bash
mise install
```

### Run the dev server

```bash
npm ci
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Content

- Edit the [manual in yeet-os](https://github.com/yeetrun/yeet-os/tree/main/yeet/website/docs). The site publishes a copy in `docs/`. To refresh it from a released checkout, run `git -C /path/to/yeet-os archive vX.Y.Z yeet/website/docs | tar -xf - --strip-components=2` from this directory.
- `docs/nav.json` defines navigation.
- Site pages are in `src/pages/`.
- Use `STYLEGUIDE.md` for public docs writing and information architecture.

## Build

```bash
npm run build
npm start
```

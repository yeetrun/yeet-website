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

- Docs live in `docs/` as MDX files.
- `docs/nav.json` defines navigation.
- Site pages are in `src/pages/`.
- Use `STYLEGUIDE.md` for public docs writing and information architecture.

## Build

```bash
npm run build
npm start
```

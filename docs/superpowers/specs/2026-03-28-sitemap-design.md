# Sitemap Generation Design

## Goal

Generate `sitemap.xml` and `robots.txt` automatically from the Next.js app's
public routes at build time so search metadata stays synchronized with deploys.

## Scope

- Include public HTML pages served by this app:
  - `/`
  - `/install`
  - `/docs`
  - all docs pages derived from MDX files under `docs/`
- Do not include `/install.sh`, because that endpoint is managed outside this
  app at the Cloudflare layer and is not represented in this repository.

## Approach

Use a small build-time Node script that:

1. Resolves the canonical site origin from `NEXT_PUBLIC_APP_URL`, falling back
   to the value declared in `wrangler.toml`.
2. Enumerates docs routes from the `docs/` directory using the same slug rules
   as the app (`index.mdx` -> `/docs`, nested files -> `/docs/...`).
3. Writes `public/sitemap.xml` with absolute URLs and real `lastmod` values for
   docs pages based on file mtimes.
4. Writes `public/robots.txt` with a `Sitemap:` directive pointing at the
   canonical sitemap URL.

## Rationale

This site's route inventory changes only when the repo changes and deploys, so
build-time generation is simpler and more reliable than a runtime XML endpoint.
It also avoids hand-maintained search metadata that can drift from the actual
routes.

## Verification

- Add a regression script that runs the generator and verifies:
  - `public/sitemap.xml` exists
  - `public/robots.txt` exists
  - expected core URLs are present
  - docs routes are included
  - the sitemap URL is referenced from `robots.txt`

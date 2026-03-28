# Sitemap Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate `sitemap.xml` and `robots.txt` automatically from this app's routes during build.

**Architecture:** A build-time Node script will enumerate the app's static pages and docs-backed routes, derive canonical absolute URLs, and write the generated search assets into `public/` before `next build` runs. Verification will use a shell regression test that asserts the generated files and key URLs exist.

**Tech Stack:** Next.js Pages Router, Node.js filesystem APIs, shell-based regression tests, Cloudflare/OpenNext build pipeline

---

### Task 1: Add the failing regression test

**Files:**
- Create: `scripts/test-search-assets.sh`
- Modify: `package.json`

- [ ] **Step 1: Write the failing test**

Create a shell test that removes any generated `public/sitemap.xml` and
`public/robots.txt`, runs the search-asset generator command, and asserts the
files and expected URLs exist.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:search-assets`
Expected: FAIL because the generator command or files do not exist yet.

### Task 2: Implement build-time generation

**Files:**
- Create: `scripts/generate-search-assets.mjs`

- [ ] **Step 1: Write minimal implementation**

Implement a Node script that:
- resolves `NEXT_PUBLIC_APP_URL`
- walks `docs/**/*.mdx`
- maps docs slugs to `/docs` URLs
- writes `public/sitemap.xml`
- writes `public/robots.txt`

- [ ] **Step 2: Run test to verify it passes**

Run: `npm run test:search-assets`
Expected: PASS

### Task 3: Integrate with the build

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Hook generation into build**

Update the build flow so the generator runs before `next build`.

- [ ] **Step 2: Verify build flow**

Run: `npm run build:next`
Expected: PASS and generated files exist in `public/`.

### Task 4: Final verification

**Files:**
- Review only

- [ ] **Step 1: Run lint and regression checks**

Run: `npm run lint`
Expected: PASS

Run: `npm run test:indexing`
Expected: PASS

Run: `npm run test:search-assets`
Expected: PASS

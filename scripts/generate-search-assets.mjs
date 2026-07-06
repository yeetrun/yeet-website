#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, "docs");
const PUBLIC_DIR = path.join(ROOT, "public");
const WRANGLER_CONFIG_PATH = path.join(ROOT, "wrangler.toml");
const SITE_URL = resolveSiteUrl();

const STATIC_PAGES = [
  {
    routePath: "/",
    sourcePath: path.join(ROOT, "src/pages/index.tsx"),
  },
];

main();

function main() {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const routes = [...STATIC_PAGES, ...loadDocsPages()];
  const sitemap = buildSitemap(routes);
  const robots = buildRobotsTxt();

  fs.writeFileSync(path.join(PUBLIC_DIR, "sitemap.xml"), sitemap);
  fs.writeFileSync(path.join(PUBLIC_DIR, "robots.txt"), robots);
}

function resolveSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ?? readWranglerVar("NEXT_PUBLIC_APP_URL");

  if (!raw) {
    throw new Error(
      "Unable to resolve NEXT_PUBLIC_APP_URL from the environment or wrangler.toml",
    );
  }

  return raw.replace(/\/+$/, "");
}

function readWranglerVar(name) {
  if (!fs.existsSync(WRANGLER_CONFIG_PATH)) {
    return "";
  }

  const wranglerConfig = fs.readFileSync(WRANGLER_CONFIG_PATH, "utf8");
  const match = wranglerConfig.match(
    new RegExp(`^${name}\\s*=\\s*"([^"]+)"$`, "m"),
  );

  return match ? match[1] : "";
}

function loadDocsPages() {
  const docsFiles = walkDocsFiles(DOCS_DIR).sort();
  const routes = new Map();

  for (const docsFilePath of docsFiles) {
    const relativeFilePath = path.relative(DOCS_DIR, docsFilePath);
    const slug = relativeFilePath
      .replace(/\.mdx$/i, "")
      .replace(/\/index$/i, "");
    const routePath = slug === "index" ? "/docs" : `/docs/${slug}`;

    if (routes.has(routePath)) {
      throw new Error(`Duplicate docs route detected for ${routePath}`);
    }

    routes.set(routePath, {
      routePath,
      sourcePath: docsFilePath,
    });
  }

  return Array.from(routes.values());
}

function walkDocsFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkDocsFiles(entryPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(entryPath);
    }
  }

  return files;
}

function buildSitemap(routes) {
  const body = routes
    .map(({ routePath, sourcePath }) => {
      const loc = escapeXml(resolveAbsoluteUrl(routePath));
      const lastmod = escapeXml(fs.statSync(sourcePath).mtime.toISOString());

      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    "</urlset>",
    "",
  ].join("\n");
}

function buildRobotsTxt() {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");
}

function resolveAbsoluteUrl(routePath) {
  if (routePath === "/") {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${routePath}`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import * as ts from "typescript";

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, "docs");
const OUTPUT_PATH = path.join(ROOT, "sitemap.csv");
const COMPLETION = parseArg("--completion") ?? "reviewed";

const GUIDANCE_FILES = [
  "AGENTS.md",
  "README.md",
  "CONTRIBUTING.md",
  "STYLEGUIDE.md",
];

const STATIC_PAGES = [
  {
    routePath: "/",
    sourcePath: "src/pages/index.tsx",
    summary: "Homepage for what yeet runs, where state lives, and which docs to read next.",
  },
  {
    routePath: "/install",
    sourcePath: "src/pages/install/index.tsx",
    summary: "Install page for putting yeet on a workstation and catch on a Linux host.",
  },
  {
    routePath: "/404",
    sourcePath: "src/pages/404.tsx",
    summary: "Not-found page that points users back to docs or the homepage without pretending the URL is fine.",
  },
];

const SHARED_UI_FILES = [
  "src/components/breadcrumbs/index.tsx",
  "src/components/button-links/index.tsx",
  "src/components/card-links/index.tsx",
  "src/components/footer/index.tsx",
  "src/components/generic-404/index.tsx",
  "src/components/jumplink-header/index.tsx",
  "src/components/link/index.tsx",
  "src/components/navbar/index.tsx",
  "src/components/sidecar/index.tsx",
  "src/components/tag-list/index.tsx",
  "src/layouts/nav-footer-layout/index.tsx",
  "src/layouts/root-layout/index.tsx",
];

const PUBLIC_ASSETS = [
  "public/favicon.svg",
  "public/robots.txt",
  "public/social-share-card.svg",
  "public/sitemap.xml",
  "public/yeet-mark.svg",
  "public/images/web-run-deploy.png",
];

const PUBLIC_TSX_ATTRS = new Set([
  "alt",
  "aria-label",
  "description",
  "text",
  "title",
]);

const PUBLIC_TSX_PROPS = new Set([
  "copyright",
  "description",
  "label",
  "text",
  "title",
]);

main();

function main() {
  const rows = [];

  for (const filePath of GUIDANCE_FILES) {
    if (!exists(filePath)) {
      continue;
    }
    rows.push(...extractMarkdownRows(filePath, "/repo-guidance", "repo-guidance"));
  }

  for (const docsPath of walkFiles(DOCS_DIR, ".mdx").sort()) {
    rows.push(
      ...extractDocsMdxRows(
        path.relative(ROOT, docsPath),
        docsRouteFor(docsPath),
        "public-docs",
      ),
    );
  }

  if (exists("docs/nav.json")) {
    rows.push(...extractJsonNavRows("docs/nav.json"));
  }

  for (const page of STATIC_PAGES) {
    if (!exists(page.sourcePath)) {
      continue;
    }
    rows.push(
      ...extractTsxRows(page.sourcePath, page.routePath, "public-page", page.summary),
    );
  }

  for (const filePath of SHARED_UI_FILES) {
    if (!exists(filePath)) {
      continue;
    }
    rows.push(
      ...extractTsxRows(
        filePath,
        "/shared-ui",
        "shared-ui",
        "Shared public UI text, labels, accessibility strings, and navigation chrome.",
      ),
    );
  }

  for (const filePath of PUBLIC_ASSETS) {
    if (!exists(filePath)) {
      continue;
    }
    rows.push(...extractPublicAssetRows(filePath));
  }

  rows.sort((a, b) => {
    return (
      a.route.localeCompare(b.route) ||
      a.source_file.localeCompare(b.source_file) ||
      Number(a.line) - Number(b.line) ||
      a.id.localeCompare(b.id)
    );
  });

  rows.forEach((row, index) => {
    row.id = String(index + 1);
  });

  const csv = toCsv(rows);
  fs.writeFileSync(OUTPUT_PATH, csv);

  const scopes = rows.reduce((acc, row) => {
    acc[row.source_scope] = (acc[row.source_scope] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`wrote ${rows.length} content units to ${path.relative(ROOT, OUTPUT_PATH)}`);
  console.log(
    Object.entries(scopes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([scope, count]) => `${scope}: ${count}`)
      .join("\n"),
  );
}

function extractDocsMdxRows(filePath, route, scope) {
  const raw = read(filePath);
  const parsed = matter(raw);
  const summary = docsSummary(parsed, raw);
  const rows = [];

  for (const [key, value] of Object.entries(parsed.data)) {
    if (typeof value === "string" && value.trim()) {
      rows.push(row(route, scope, filePath, frontmatterLine(raw, key), "frontmatter", key, value, summary));
    }
  }

  rows.push(...extractMarkdownBodyRows(filePath, route, scope, parsed.content, summary, frontmatterLineOffset(raw)));
  rows.push(...extractQuotedComponentRows(filePath, route, scope, raw, summary));

  return rows;
}

function extractMarkdownRows(filePath, route, scope) {
  const raw = read(filePath);
  const parsed = matter(raw);
  const summary = firstSentence(stripMarkdown(parsed.content)) || `${filePath} repository guidance.`;
  const rows = [];

  for (const [key, value] of Object.entries(parsed.data)) {
    if (typeof value === "string" && value.trim()) {
      rows.push(row(route, scope, filePath, frontmatterLine(raw, key), "frontmatter", key, value, summary));
    }
  }

  rows.push(...extractMarkdownBodyRows(filePath, route, scope, parsed.content, summary, frontmatterLineOffset(raw)));

  return rows;
}

function extractMarkdownBodyRows(filePath, route, scope, content, summary, lineOffset = 0) {
  const rows = [];
  const lines = content.split(/\r?\n/);
  let section = "";
  let paragraph = [];
  let paragraphStart = 0;
  let listItem = [];
  let listStart = 0;
  let code = [];
  let codeStart = 0;
  let inCode = false;
  let codeLang = "";
  let inMdxJsxPropsBlock = false;

  function flushParagraph() {
    if (paragraph.length === 0) {
      return;
    }

    const text = stripMarkdown(paragraph.join(" "));
    for (const sentence of splitSentences(text)) {
      rows.push(row(route, scope, filePath, paragraphStart + lineOffset, "sentence", section, sentence, summary));
    }

    paragraph = [];
    paragraphStart = 0;
  }

  function flushListItem() {
    if (listItem.length === 0) {
      return;
    }

    const text = stripMarkdown(listItem.join(" "));
    for (const sentence of splitSentences(text)) {
      rows.push(row(route, scope, filePath, listStart + lineOffset, "list_item", section, sentence, summary));
    }

    listItem = [];
    listStart = 0;
  }

  function flushCode() {
    if (code.length === 0) {
      return;
    }

    rows.push(
      row(
        route,
        scope,
        filePath,
        codeStart + lineOffset,
        "code_block",
        section || codeLang || "code",
        code.join("\n").trim(),
        summary,
      ),
    );
    code = [];
    codeStart = 0;
    codeLang = "";
  }

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();

    if (inMdxJsxPropsBlock) {
      if (trimmed.endsWith("/>") || trimmed.startsWith("</")) {
        inMdxJsxPropsBlock = false;
      }
      return;
    }

    if (/^```/.test(trimmed)) {
      if (inCode) {
        inCode = false;
        flushCode();
        return;
      }

      flushParagraph();
      inCode = true;
      codeStart = lineNumber + 1;
      codeLang = trimmed.replace(/^```/, "").trim();
      return;
    }

    if (inCode) {
      code.push(line);
      return;
    }

    if (!trimmed) {
      flushParagraph();
      flushListItem();
      return;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushListItem();
      section = stripMarkdown(heading[2]);
      rows.push(row(route, scope, filePath, lineNumber + lineOffset, `heading_${heading[1].length}`, section, section, summary));
      return;
    }

    if (/^[-*+]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      flushListItem();
      const item = stripMarkdown(trimmed.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, ""));
      listItem = [item];
      listStart = lineNumber;
      return;
    }

    if (listItem.length > 0 && /^\s+/.test(line) && !/^\|.*\|$/.test(trimmed)) {
      listItem.push(trimmed);
      return;
    }

    if (/^\|.*\|$/.test(trimmed)) {
      flushParagraph();
      flushListItem();
      if (/^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(trimmed)) {
        return;
      }
      rows.push(row(route, scope, filePath, lineNumber + lineOffset, "table_row", section, normalizeTableRow(trimmed), summary));
      return;
    }

    if (/^<\/?[A-Z][A-Za-z0-9]*(\s|>|$)/.test(trimmed)) {
      flushParagraph();
      flushListItem();
      if (!trimmed.endsWith(">") || (!trimmed.startsWith("</") && !trimmed.endsWith("/>") && !trimmed.includes(">"))) {
        inMdxJsxPropsBlock = true;
      }
      return;
    }

    flushListItem();
    if (paragraph.length === 0) {
      paragraphStart = lineNumber;
    }
    paragraph.push(trimmed);
  });

  flushParagraph();
  flushListItem();

  return rows.filter((entry) => entry.content.trim());
}

function extractQuotedComponentRows(filePath, route, scope, raw, summary) {
  const rows = [];
  const lines = raw.split(/\r?\n/);
  const quoted = /(?:text|title|description|aria-label|alt|children)\s*[:=]\s*["'`]([^"'`{}]+)["'`]/g;

  lines.forEach((line, index) => {
    let match;
    while ((match = quoted.exec(line)) !== null) {
      const value = cleanText(match[1]);
      if (isPublicText(value)) {
        rows.push(row(route, scope, filePath, index + 1, "component_string", "", value, summary));
      }
    }
  });

  return rows;
}

function extractJsonNavRows(filePath) {
  const raw = read(filePath);
  const summary = "Documentation navigation tree and public sidebar labels.";
  const rows = [];
  const lines = raw.split(/\r?\n/);

  lines.forEach((line, index) => {
    const title = line.match(/"title"\s*:\s*"([^"]+)"/);
    const routePath = line.match(/"path"\s*:\s*"([^"]+)"/);

    if (title) {
      rows.push(
        row(
          "/docs",
          "public-nav",
          filePath,
          index + 1,
          "nav_title",
          routePath ? routePath[1] : "",
          cleanText(title[1]),
          summary,
        ),
      );
    }
  });

  return rows;
}

function extractTsxRows(filePath, route, scope, summary) {
  const raw = read(filePath);
  const sourceFile = ts.createSourceFile(
    filePath,
    raw,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const rows = [];

  function addText(node, type, value) {
    const content = cleanText(value);
    if (!isPublicText(content)) {
      return;
    }

    const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
    for (const sentence of splitSentences(content)) {
      rows.push(row(route, scope, filePath, line, type, "", sentence, summary));
    }
  }

  function addCode(node, value) {
    const content = cleanText(value);
    if (!content) {
      return;
    }

    const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
    rows.push(row(route, scope, filePath, line, "code_block", "", content, summary));
  }

  function visit(node) {
    if (ts.isJsxText(node)) {
      addText(node, "jsx_text", node.getText(sourceFile));
    }

    if (ts.isJsxAttribute(node) && node.initializer) {
      const attrName = node.name.getText(sourceFile);
      if (PUBLIC_TSX_ATTRS.has(attrName) && ts.isStringLiteral(node.initializer)) {
        addText(node, "jsx_attribute", node.initializer.text);
      }
    }

    if (ts.isPropertyAssignment(node)) {
      const name = propertyName(node.name, sourceFile);
      if (name === "code" && isLiteralLike(node.initializer)) {
        addCode(node, literalText(node.initializer));
      } else if (PUBLIC_TSX_PROPS.has(name) && isLiteralLike(node.initializer)) {
        addText(node, "string_literal", literalText(node.initializer));
      }
    }

    if (
      ts.isJsxExpression(node) &&
      node.expression &&
      ts.isNoSubstitutionTemplateLiteral(node.expression)
    ) {
      const parentTag = nearestJsxTagName(node);
      if (parentTag === "code") {
        addCode(node.expression, node.expression.text);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return dedupeRows(rows);
}

function extractPublicAssetRows(filePath) {
  const summary = "Generated or static public asset used by yeetrun.com.";
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".webp") {
    return [row(`/${filePath}`, "public-asset", filePath, 1, "asset_file", "", "Image asset referenced by public pages.", summary)];
  }

  const raw = read(filePath);
  const rows = [];
  const lines = raw.split(/\r?\n/);

  if (ext === ".svg") {
    lines.forEach((line, index) => {
      for (const value of extractSvgText(line)) {
        if (isPublicText(value)) {
          rows.push(row(`/${filePath}`, "public-asset", filePath, index + 1, "svg_text", "", value, summary));
        }
      }
    });
  } else {
    lines.forEach((line, index) => {
      const value = cleanText(line);
      if (isPublicText(value)) {
        rows.push(row(`/${filePath}`, "public-asset", filePath, index + 1, "asset_text", "", value, summary));
      }
    });
  }

  return rows.length
    ? rows
    : [row(`/${filePath}`, "public-asset", filePath, 1, "asset_file", "", "Static public asset.", summary)];
}

function docsRouteFor(filePath) {
  const relative = path.relative(DOCS_DIR, filePath);
  const slug = relative.replace(/\.mdx$/i, "").replace(/\/index$/i, "");
  return slug === "index" ? "/docs" : `/docs/${slug}`;
}

function docsSummary(parsed, raw) {
  if (typeof parsed.data.description === "string" && parsed.data.description.trim()) {
    return cleanText(parsed.data.description);
  }

  if (typeof parsed.data.title === "string" && parsed.data.title.trim()) {
    return `${cleanText(parsed.data.title)} documentation page.`;
  }

  return firstSentence(stripMarkdown(parsed.content)) || "Documentation page.";
}

function frontmatterLine(raw, key) {
  const lines = raw.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    if (new RegExp(`^${escapeRegExp(key)}\\s*:`).test(lines[i])) {
      return i + 1;
    }
  }
  return 1;
}

function frontmatterLineOffset(raw) {
  if (!raw.startsWith("---")) {
    return 0;
  }

  const lines = raw.split(/\r?\n/);
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") {
      return i + 1;
    }
  }

  return 0;
}

function normalizeTableRow(value) {
  return value
    .split("|")
    .map((cell) => cleanText(stripMarkdown(cell)))
    .filter(Boolean)
    .join(" | ");
}

function stripMarkdown(value) {
  return cleanText(
    value
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/\\\[/g, "[")
      .replace(/\\\]/g, "]"),
  );
}

function splitSentences(value) {
  const clean = cleanText(value);
  if (!clean) {
    return [];
  }

  if (clean.length < 140 || /[`$<>{}|]/.test(clean)) {
    return [clean];
  }

  return clean
    .split(/(?<=[.!?])\s+(?=[A-Z0-9`])/)
    .map(cleanText)
    .filter(Boolean);
}

function extractJsxText(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("import ") || trimmed.startsWith("export ")) {
    return "";
  }

  if (!/>[^<{]+</.test(trimmed)) {
    return "";
  }

  return cleanText(
    trimmed
      .replace(/<[^>]+>/g, " ")
      .replace(/[{}]/g, " ")
      .replace(/\s+/g, " "),
  );
}

function extractStringLiterals(line) {
  const trimmed = line.trim();
  if (!trimmed || /^import\s/.test(trimmed) || /from\s+["']/.test(trimmed)) {
    return [];
  }

  const values = [];
  const regex = /["']([^"']*[A-Za-z][^"']*)["']/g;
  let match;

  while ((match = regex.exec(line)) !== null) {
    values.push(cleanText(match[1]));
  }

  return values;
}

function extractSvgText(line) {
  const values = [];
  const textRegex = />([^<>]*[A-Za-z][^<>]*)</g;
  const attrRegex = /\b(?:aria-label|alt|title)\s*=\s*"([^"]+)"/g;
  let match;

  while ((match = textRegex.exec(line)) !== null) {
    values.push(cleanText(match[1]));
  }

  while ((match = attrRegex.exec(line)) !== null) {
    values.push(cleanText(match[1]));
  }

  return values;
}

function propertyName(name, sourceFile) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return name.getText(sourceFile);
}

function isLiteralLike(node) {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
}

function literalText(node) {
  return node.text;
}

function nearestJsxTagName(node) {
  let current = node.parent;

  while (current) {
    if (ts.isJsxElement(current)) {
      return current.openingElement.tagName.getText();
    }
    if (ts.isJsxSelfClosingElement(current)) {
      return current.tagName.getText();
    }
    current = current.parent;
  }

  return "";
}

function isPublicText(value) {
  const text = cleanText(value);
  if (!text || text.length < 2) {
    return false;
  }

  if (/^[./#?=&:_a-z0-9-]+$/.test(text) && !/\s/.test(text)) {
    return false;
  }

  if (/^(className|href|src|id|role|button|submit|module|props?)$/i.test(text)) {
    return false;
  }

  if (/^[@./]/.test(text) && !/\s/.test(text)) {
    return false;
  }

  if (/^[A-Za-z0-9_-]+\.(module\.)?css$/.test(text)) {
    return false;
  }

  return /[A-Za-z]/.test(text);
}

function cleanText(value) {
  return String(value)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentence(value) {
  return splitSentences(value)[0] ?? "";
}

function dedupeRows(rows) {
  const seen = new Set();
  return rows.filter((entry) => {
    const key = `${entry.source_file}:${entry.line}:${entry.unit_type}:${entry.content}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function row(route, sourceScope, sourceFile, line, unitType, section, content, pageSummary) {
  return {
    id: "",
    route,
    source_scope: sourceScope,
    source_file: sourceFile,
    line: String(line || 1),
    section: cleanText(section),
    unit_type: unitType,
    page_summary: cleanText(pageSummary),
    content: cleanText(content),
    completion: COMPLETION,
    issue: "",
    action: "",
    notes: "",
  };
}

function toCsv(rows) {
  const columns = [
    "id",
    "route",
    "source_scope",
    "source_file",
    "line",
    "section",
    "unit_type",
    "page_summary",
    "content",
    "completion",
    "issue",
    "action",
    "notes",
  ];

  return [
    columns.join(","),
    ...rows.map((entry) => columns.map((column) => csvEscape(entry[column])).join(",")),
    "",
  ].join("\n");
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function walkFiles(dirPath, extension) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(entryPath, extension));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(extension)) {
      files.push(entryPath);
    }
  }

  return files;
}

function exists(filePath) {
  return fs.existsSync(path.join(ROOT, filePath));
}

function read(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function parseArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1 || index + 1 >= process.argv.length) {
    return "";
  }
  return process.argv[index + 1];
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

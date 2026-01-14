import fs from "fs";
import path from "path";

const DOCS_ROOT_CANDIDATES = [
  path.join(process.cwd(), "docs"),
  path.join(process.cwd(), "server-functions", "default", "docs"),
  path.join(process.cwd(), ".open-next", "server-functions", "default", "docs"),
];

export function resolveDocsRoot(): string {
  for (const candidate of DOCS_ROOT_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return path.join(process.cwd(), "docs");
}

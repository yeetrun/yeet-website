#!/usr/bin/env bash

set -euo pipefail

rm -f public/sitemap.xml public/robots.txt

npm run generate:search-assets >/dev/null

[[ -f public/sitemap.xml ]] || {
  echo "expected public/sitemap.xml to exist"
  exit 1
}

[[ -f public/robots.txt ]] || {
  echo "expected public/robots.txt to exist"
  exit 1
}

rg -q '<loc>https://yeetrun.com/</loc>' public/sitemap.xml || {
  echo "expected home page in sitemap"
  exit 1
}

rg -q '<loc>https://yeetrun.com/install</loc>' public/sitemap.xml || {
  echo "expected install page in sitemap"
  exit 1
}

rg -q '<loc>https://yeetrun.com/docs/getting-started/quick-start</loc>' public/sitemap.xml || {
  echo "expected docs page in sitemap"
  exit 1
}

rg -q '^Sitemap: https://yeetrun.com/sitemap.xml$' public/robots.txt || {
  echo "expected sitemap directive in robots.txt"
  exit 1
}

echo "search assets look correct"

#!/usr/bin/env bash

set -euo pipefail

PORT="${PORT:-4010}"
BASE_URL="http://127.0.0.1:${PORT}"
LOG_FILE="${TMPDIR:-/tmp}/yeet-indexing-test-${PORT}.log"

npm run build:next >/dev/null

PORT="${PORT}" npm start >"${LOG_FILE}" 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "${SERVER_PID}" >/dev/null 2>&1 || true
  wait "${SERVER_PID}" >/dev/null 2>&1 || true
}

trap cleanup EXIT

for _ in $(seq 1 30); do
  if curl -fsSI "${BASE_URL}/" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

production_headers="$(curl -fsSI -H 'Host: yeetrun.com' -H 'X-Forwarded-Proto: https' "${BASE_URL}/" | tr -d '\r')"
http_headers="$(curl -sSI -H 'Host: yeetrun.com' -H 'X-Forwarded-Proto: http' "${BASE_URL}/" | tr -d '\r')"
preview_headers="$(curl -fsSI -H "Host: localhost:${PORT}" "${BASE_URL}/" | tr -d '\r')"
docs_html="$(curl -fsS -H 'Host: yeetrun.com' -H 'X-Forwarded-Proto: https' "${BASE_URL}/docs")"
docs_index_headers="$(curl -sSI -H 'Host: yeetrun.com' -H 'X-Forwarded-Proto: https' "${BASE_URL}/docs/index" | tr -d '\r')"

if printf '%s\n' "${production_headers}" | rg -qi '^x-robots-tag:\s*noindex$'; then
  echo "expected yeetrun.com to be indexable, but it returned X-Robots-Tag: noindex"
  exit 1
fi

if ! printf '%s\n' "${http_headers}" | rg -qi '^HTTP/1\.1 308'; then
  echo "expected http://yeetrun.com to redirect to https://yeetrun.com"
  exit 1
fi

if ! printf '%s\n' "${http_headers}" | rg -qi '^location:\s*https://yeetrun\.com/$'; then
  echo "expected http://yeetrun.com redirect location to be https://yeetrun.com/"
  exit 1
fi

if ! printf '%s\n' "${preview_headers}" | rg -qi '^x-robots-tag:\s*noindex$'; then
  echo "expected non-production hosts to return X-Robots-Tag: noindex"
  exit 1
fi

if ! printf '%s\n' "${docs_index_headers}" | rg -qi '^HTTP/1\.1 308'; then
  echo "expected /docs/index to redirect to /docs"
  exit 1
fi

if ! printf '%s\n' "${docs_index_headers}" | rg -qi '^location:\s*/docs$'; then
  echo "expected /docs/index redirect location to be /docs"
  exit 1
fi

if ! printf '%s\n' "${docs_html}" | rg -q '<link rel="canonical" href="https://yeetrun.com/docs"'; then
  echo "expected /docs to include a canonical URL"
  exit 1
fi

if ! printf '%s\n' "${docs_html}" | rg -q '<meta property="og:url" content="https://yeetrun.com/docs"'; then
  echo "expected /docs to publish a page-specific og:url"
  exit 1
fi

echo "indexing host policy looks correct"

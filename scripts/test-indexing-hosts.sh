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

production_headers="$(curl -fsSI -H 'Host: yeetrun.com' "${BASE_URL}/" | tr -d '\r')"
preview_headers="$(curl -fsSI -H "Host: localhost:${PORT}" "${BASE_URL}/" | tr -d '\r')"

if printf '%s\n' "${production_headers}" | rg -qi '^x-robots-tag:\s*noindex$'; then
  echo "expected yeetrun.com to be indexable, but it returned X-Robots-Tag: noindex"
  exit 1
fi

if ! printf '%s\n' "${preview_headers}" | rg -qi '^x-robots-tag:\s*noindex$'; then
  echo "expected non-production hosts to return X-Robots-Tag: noindex"
  exit 1
fi

echo "indexing host policy looks correct"

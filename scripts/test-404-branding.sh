#!/usr/bin/env bash

set -euo pipefail

PORT="${PORT:-4011}"
BASE_URL="http://127.0.0.1:${PORT}"
LOG_FILE="${TMPDIR:-/tmp}/yeet-404-branding-${PORT}.log"

npm run build:next >/dev/null

PORT="${PORT}" npm start >"${LOG_FILE}" 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "${SERVER_PID}" >/dev/null 2>&1 || true
  wait "${SERVER_PID}" >/dev/null 2>&1 || true
}

trap cleanup EXIT

for _ in $(seq 1 30); do
  if curl -sS -o /dev/null "${BASE_URL}/missing-page" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

response_file="$(mktemp)"
status_code="$(curl -sS -o "${response_file}" -w '%{http_code}' "${BASE_URL}/missing-page")"
not_found_html="$(cat "${response_file}")"
rm -f "${response_file}"

if [[ "${status_code}" != "404" ]]; then
  echo "expected 404 status for missing page, got ${status_code}"
  exit 1
fi

if ! printf '%s\n' "${not_found_html}" | rg -q '<img[^>]+src="/yeet-mark\.svg"'; then
  echo "expected 404 page to render the full yeet mark in the card"
  exit 1
fi

if ! printf '%s\n' "${not_found_html}" | rg -q '>yeet<'; then
  echo "expected 404 page to render the yeet wordmark in the card"
  exit 1
fi

if printf '%s\n' "${not_found_html}" | rg -q '<img[^>]+src="/favicon\.svg"'; then
  echo "expected 404 page to stop rendering the favicon image in the card"
  exit 1
fi

echo "404 branding looks correct"

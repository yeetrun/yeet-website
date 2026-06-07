#!/usr/bin/env bash

set -euo pipefail

if [[ -d docs/superpowers ]]; then
  echo "docs/superpowers is internal planning material; do not publish it in the website docs tree"
  exit 1
fi

unexpected_files="$(
  find docs -type f \
    ! -name '*.mdx' \
    ! -name 'nav.json' \
    | sort
)"

if [[ -n "${unexpected_files}" ]]; then
  echo "expected website/docs to contain only public .mdx docs and nav.json"
  printf '%s\n' "${unexpected_files}"
  exit 1
fi

echo "public docs tree looks correct"

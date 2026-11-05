#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="$ROOT_DIR/AGENTS.md"
TARGET="$ROOT_DIR/CLAUDE.md"

if [[ ! -f "$SOURCE" ]]; then
  echo "error: missing canonical source file: AGENTS.md" >&2
  exit 1
fi

if [[ ! -f "$TARGET" ]] || ! cmp -s "$SOURCE" "$TARGET"; then
  echo "error: AGENTS.md and CLAUDE.md are out of sync" >&2
  echo "run: npm run sync:agent-docs" >&2
  exit 1
fi

echo "agent docs are in sync"

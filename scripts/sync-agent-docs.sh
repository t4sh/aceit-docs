#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="$ROOT_DIR/AGENTS.md"
TARGET="$ROOT_DIR/CLAUDE.md"

if [[ ! -f "$SOURCE" ]]; then
  echo "error: missing canonical source file: $SOURCE" >&2
  exit 1
fi

cp "$SOURCE" "$TARGET"
echo "synced CLAUDE.md from AGENTS.md"

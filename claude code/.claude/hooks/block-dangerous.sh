#!/usr/bin/env bash
# Runs block-dangerous.mjs. If node is missing, block: a guard that cannot run must not let the action through.
command -v node >/dev/null 2>&1 || { echo "hook: node is missing, blocking" >&2; exit 2; }
exec node "$(dirname "$0")/block-dangerous.mjs"

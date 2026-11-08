#!/usr/bin/env bash
# Runs stop-checks.mjs. If node is missing, do not block: a Stop hook must never trap a session.
command -v node >/dev/null 2>&1 || { echo "stop-checks: node is missing, skipping" >&2; exit 0; }
exec node "$(dirname "$0")/stop-checks.mjs"

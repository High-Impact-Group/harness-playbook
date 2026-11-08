---
description: "Pre-merge gate: surfaces migrations and env vars before merge, then verifies they landed after."
argument-hint: '[branch or PR number] (optional, defaults to current branch vs the main branch)'
model: claude-opus-5-5
effort: xhigh
---
# /pre-merge
A gate before merge. It surfaces migrations and environment variables first, then verifies after the merge that they landed.

## Phase 1: Detect

Target: `$ARGUMENTS`. If none is given, use the current branch. For a PR, list the changed files and read the full diff. For a branch, diff it against the main branch and read the full diff.

Report two tables.

**Migrations**

| File | What it does | Destructive? |

**Environment variables**

| Variable | Read from | Local | Preview | Production |

Mark anything destructive in bold (DROP, column type changes, data backfills) and call it out on its own. Schema changes need explicit human approval. Do not go past this phase without it.

If neither table has rows, say "No migrations or environment variables in this diff" and stop.

## Phase 2: Gate

Ask: "Apply migrations and set environment variables now, or after merge?" Wait for the answer. Do not merge.

## Phase 3: Verify (run after merge)

- Database: list the applied migrations. Compare with the Phase 1 table.
- Hosting platform: read the environment variables for each environment. Compare with the Phase 1 table.
- Write one pass or fail line per item. Any gap is a FAIL, stated plainly.
- If a tool is not connected, write BLOCKED for that check. Never infer success from the absence of an error.

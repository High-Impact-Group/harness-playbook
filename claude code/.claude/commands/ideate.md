---
description: Proactively scans the codebase and context and surfaces improvements worth making that you didn't ask for.
argument-hint: '[optional: area to focus on]'
model: claude-opus-5-5
---
# /ideate

Focus area: `$ARGUMENTS`. If it is empty, scan the whole project.

Surface improvements I did not ask for. Scan the codebase and the project context. Then tell me what is worth fixing, improving or rethinking.

## Step 1: Scan

Read these sources quietly. Do not narrate what you read.

**Context:**
- The notes on decisions and patterns already captured.
- The task list, so you know what is already on the radar.
- The notes on current state and blockers.

**Codebase.** Sample broadly. Do not read every file.
- Project structure and key directories.
- Route and API handlers. Look for inconsistencies.
- Shared utilities. Look for duplication.
- Config files.
- Test coverage: what is tested and what is not.
- The dependency manifest: outdated, unused or missing scripts.
- TODO, FIXME and HACK comments.
- Open issues, if the project has them.

## Step 2: Generate ideas

Produce 3 to 7 ideas. No more. Quality over quantity. Use this format for each:

```
### <Short title>
**Type:** debt | performance | DX | reliability | security | feature
**Effort:** trivial (under 30 min) | small (1 to 2 hours) | medium (half a day) | large (a day or more)
**Why now:** One sentence on why this matters or what risk it reduces.
**What:** Two or three sentences on what to do.
```

## Step 3: Rank

Rank the ideas by impact against effort. Put the highest-leverage idea first.

## Step 4: Ask

End with: "Want me to `/plan` any of these, or add them to the task list?"

## Rules

- Do not suggest anything already on the task list. Check first.
- Do not suggest anything that contradicts a recorded decision. Those were made for a reason.
- Favor work that compounds: better error handling, missing abstractions, test gaps and developer-experience fixes. They make future work faster.
- Ignore cosmetic issues such as formatting and variable names, unless they are truly confusing.
- If the codebase is clean, say so. Do not invent problems. "Nothing urgent" is a valid answer.
- Be specific. "Improve error handling" is useless. "The orders route catches errors but returns a generic 500, so add typed error responses the frontend can show" is useful.
- This is not a code review. Do not critique what was built. Surface what would make the next thing easier to build.
- Write nothing to the codebase. Report only.

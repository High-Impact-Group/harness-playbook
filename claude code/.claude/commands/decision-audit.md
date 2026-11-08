---
description: Surfaces the judgment calls made during recent work, not the code, so you review the choices before anything merges.
argument-hint: '[optional: commit range, PR number, or "since session start"]'
model: claude-opus-5-5
---
# /decision-audit

Before anything merges, surface the judgment calls made along the way. Do not list the code. The person reviews choices, not diffs.

## Scope

Default: everything changed since the last commit. If an argument is given (a commit range, "since session start" or a PR number), audit that span instead.

Read The argument. A commit range goes to the git log and diff. A PR number goes to the GitHub CLI's PR view and diff. "Since session start" means the work done in this session. If empty, use the default.

## Step 1: Find the decisions

Walk back through the work just completed. Look for every place where the instructions were silent, ambiguous or incomplete and something had to be chosen. Capture it. This covers data shapes, edge-case handling, library or approach choices, naming and scope boundaries, error handling and fallback behavior. It covers above all any fix that resolves the specific symptom seen without necessarily addressing the general case.

Skip:
- Anything the person explicitly specified. That is not a judgment call.
- Purely mechanical or stylistic choices with no effect on behavior.

## Step 2: Write each one

- **Decision:** the specific choice, in one line.
- **Why:** the reasoning, in one line.
- **Confidence:** high, medium or low.
- **If wrong:** what breaks, and how it would show up.
- **General or specific?** Does it hold for every case, or only the one that was tested or observed?

## Step 3: Lead with the riskiest

If one decision is shakier than the rest, say so first: "Review this one first: ..."

If nothing was underspecified (a fully specified task, mechanical execution), say so in one line and stop. Do not invent decisions to pad the list.

## Step 4: Save and wait

Write the list to `docs/audits/decisions-<YYYY-MM-DD-HHmm>.md`. Never touch the project's task lists, logs or notes files.

Then stop. No commit, push, PR or merge until the person has responded: approved, or flagged something to revise.

## Rules

- One entry per decision. Do not bundle several into a vague category to shorten the list.
- Do not hide low confidence. It is the whole point of this exercise.
- This is a decisions list, not a changelog. If an entry reads like "implemented X", cut it or rewrite it as the judgment call underneath.
- A revised decision needs auditing again. Do not patch it and move on silently.

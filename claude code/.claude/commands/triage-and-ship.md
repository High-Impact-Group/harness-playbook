---
description: Triages open issues by impact and ships the single highest-impact one end to end.
argument-hint: '"[optional: label or area to focus on]"'
model: claude-opus-5-5
---
# /triage-and-ship

Triage the open issues by impact, let me choose, then ship the chosen one end to end through four sign-off gates and a draft pull request.

Focus: `$ARGUMENTS` (a label or area; if empty, consider all open issues).

## Phase 1: Triage

Read all open issues with the issue tracker's command-line tool or API. Pull full detail on the contenders.

Score each one on impact:
- User or business value
- Urgency (blocking, regression, security, deadline)
- Effort to ship (lower effort lifts the score)
- Risk if left alone

Rank by impact. Shortlist the top 3.

## Phase 2: Recommend, then let me choose

Show the top 3 as a short table: issue number, title, one-line impact rationale and rough effort (S, M or L).

State your pick and why in two sentences.

Then STOP. Ask me to choose by number. Do not start work until I reply.

## Phase 3: Build

When I choose, take the chosen issue as the goal.

Done means fully built, not scaffolded:
- It works end to end.
- Every acceptance criterion in the issue is met.
- No TODOs, stubs or placeholder logic are left behind.

## Phase 4: Sign-off gates

No pull request until all four pass. If one fails, fix it and run that gate again. Loop until clean.

1. Lint and format are clean. Run the project linter and formatter. Zero errors.
2. Tests pass. The existing suite is green. New tests cover the new behavior.
3. The `code-reviewer` agent signs off. Ask it to review. Resolve every critical, high and medium issue. Low issues are noted, and fixing them is optional.
4. The `qa-tester` agent signs off. Ask it to test. Zero critical, high or medium defects.

State the result of each gate as you clear it.

## Phase 5: Pull request

Open a draft pull request. A person marks it ready and merges it.
- The title references the issue and uses `refs #N` (never a closing keyword).
- A summary of what changed and why.
- A test plan.
- Confirmation that all four gates passed.

Report the pull request URL when done.

## Before you leave this running

Answer these five questions first. Put the answers at the top of your run summary.

1. What does "done" mean for this run?
2. How will you check it yourself? Name the tests or checks.
3. What may you touch, and what is off limits?
4. What stops you? For example: the same check fails three times, a cost limit is reached, or a Tier 3 trigger appears.
5. Who signs off before anything ships?

If this runs without a person watching, set a turn limit and a spending limit so a stuck run stops by itself.

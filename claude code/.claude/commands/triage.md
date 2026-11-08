---
description: Reads open issues, scores them by impact, and produces a ranked shortlist.
argument-hint: '[optional: label or area to focus on]'
model: claude-sonnet-5-5
---
# /triage

Read the open issues, score them by impact and produce a ranked shortlist.

Focus: `$ARGUMENTS` (a label or area; if empty, consider all open issues).

## Phase 1: Triage

Read all open issues with the issue tracker's command-line tool or API. Pull full detail on the contenders.

Score each one on impact:
- User or business value
- Urgency (blocking, regression, security, deadline)
- Effort to ship (lower effort lifts the score)
- Risk if left alone

Rank by impact. Shortlist the top 3.

## Phase 2: Recommend

Show the top 3 as a short table: issue number, title, one-line impact rationale and rough effort (S, M or L).

State your pick and why in two sentences.

Stop there. The call on what to do next is mine.

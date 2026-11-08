# issue-fix-loop

An autonomous issue-resolution routine. It finds open issues assigned to you, clusters them by root cause, picks the highest-value fix, designs it, builds it, ships it, smoke-tests it in production and closes the loop with the person who reported it. Then it moves to the next issue, up to a hard cap.

## The flow

gh issues, cluster, prioritize, confirm root cause, design, build, PR plus gate, merge (automatic only with `--auto-merge`, otherwise a human approves), production smoke test, reassign and relabel, next issue.

## Invocation

```
issue-fix-loop --repo <repo>
```

| Flag | Default | What it does |
|---|---|---|
| `--repo` | required | One product per run. Forces an explicit scope. |
| `--max-issues` | 3 | Hard cap on issues processed in this run. |
| `--max-gate-cycles` | 3 | Max fix-and-run-the-gate-again loops per PR before stopping and leaving it in draft. |
| `--max-retest-cycles` | 2 | Max fix, deploy and retest loops per issue during production smoke testing before escalating. |
| `--auto-merge` | off | Merge without asking, but only when the gate passed and the pre-merge routine shows no migrations and no new environment variables. |
| `--dry-run` | off | Run phases 1 to 4 only (discover, review, cluster, prioritize). Stop before any code is touched. |

Parse the flags from the input. If it is empty or lacks `--repo`, stop and ask for the repo. If a flag is unknown, stop and name it.

## Guardrails (read before running)

| Trigger | Behavior |
|---|---|
| The fix touches schema or migrations, auth, or payments code | Stop after Phase 6. Post the design and wait for explicit go-ahead. Do not build. |
| `--max-gate-cycles` exceeded | Stop. Leave the PR in draft. Log what still fails and why. |
| `--max-retest-cycles` exceeded and the smoke test still fails | Stop. Do not keep redeploying blind. Flag the issue, leave it assigned to you and record the state in the audit log. |
| `--max-issues` reached | Stop cleanly. Write the run summary. Do not roll into a new batch. |
| Root cause cannot be confirmed in Phase 5 | Skip to the next issue. Label this one "needs-repro". Do not design a fix for a guessed cause. |
| Issue has no clear repro steps or acceptance criteria | Skip to the next issue. Label it "needs-info". Do not invent scope. |
| Merge requested (Phase 9) | Stop and ask unless `--auto-merge` conditions are met. Without them, merge only after an explicit "yes, merge #N" in this session. |
| The issue tracker or error tracker is not connected | Say BLOCKED for that check. Never infer success. |
| The browser automation tool (Playwright) is not available | Stop before Phase 10. Do not substitute a manual click-through or a "looks fine from the code" judgment. Smoke testing is not done unless it ran through Playwright. |

These exist so "continue until all issues are closed" has a checkable stopping condition, and so a queue of similar issues cannot turn into repeated blind production changes.

## Tier: pick it first

Before Phase 6, give each issue a delivery tier by risk, not size. Start from the lowest tier that fits and go up only for a named trigger in the tier doc. Write `Tier: N - <reason>` on the issue, and run only the gates that tier needs. This routine has no design-review phase of its own, so the reviews are ordered here.

- **Tier 0:** CI only.
- **Tier 1:** Phase 6 is a half-page design in the issue body. One independent reviewer reads design and diff together (Phase 8's gate routine, given the design).
- **Tier 2:** Phase 6 writes `docs/design/<slug>/technical-design.md`. Then one independent design review by the design-reviewer role before Phase 7. Phase 8's gate routine is the diff review.
- **Tier 3:** The same as Tier 2, with two or more design reviewers on different dimensions, plus the schema, auth and payments stop in the guardrails above.

A phase that finds a trigger escalates the tier. Never de-escalate. Phase 8 opens the PR with its delivery tier section.

## Phase 1: Discover

List open issues assigned to you in the target repo, with number, title, body, labels, comments and created date:

```
gh issue list --assignee @me --state open --repo <owner>/<repo> --json number,title,body,labels,comments,createdAt
```

If the project has a GitHub integration wired in, use that instead. If the queue is empty, stop and say so.

## Phase 2: Review and classify

For every issue, read the body, all comments and any linked screenshots or logs. Tag each with an area (frontend, backend, data, auth, billing, other), a suspected component and the severity the reporter gave.

## Phase 3: Root-cause clustering

Group issues that share symptoms, an error signature or a component. Cross-reference the error tracker for this product and the notes on patterns already diagnosed in past sessions. Output a short list of clusters, each with a one-line root-cause hypothesis.

## Phase 4: Prioritize

Score each cluster on user impact, revenue or reputation risk and rough effort. Rank them. Take the top `--max-issues` for this run. Write the ranking and the reasoning to `docs/audits/issue-fix-loop-<date>.md`. This step does not pause, but the reasoning must be inspectable afterwards.

If `--dry-run` was passed, stop here.

## Phase 5: Confirm root cause

For the top-ranked issue, reproduce it if you can. Read the actual code path. Do not trust the hypothesis. Hand off to the specialist that fits: the database-architect role for data issues, the security-reviewer role for anything touching auth or permissions, the code-reviewer role otherwise. Confirm before you design anything. If it cannot be confirmed, apply "needs-repro" and move to the next-ranked issue.

## Phase 6: Technical design

Write a design (append to the audit file, or a fresh design file). Cover the confirmed root cause, the proposed fix, the exact files touched, the blast radius and a rollback plan.

Checkpoint: if the blast radius touches schema or migrations, auth or payments code, stop here and post the design for explicit approval before the build. Otherwise continue.

## Phase 7: Build

Hand the design file path, and only that, to the implementer role. You judge whether the diff satisfies the design. Stage only the specific files touched. Never `git add .`, because the repo may hold other work in progress.

## Phase 8: PR and gate

```
git push -u origin <branch>
gh pr create --draft --title "..." --body "..."
```

The PR body opens with the delivery tier section: a `Tier: N - <reason>` line and, for Tier 2 and 3, `Design:` and `Reviews:` lines, then the rest of the PR template. A PR made through the CLI or API does not get the template, so write the sections in yourself.

Run the gate routine. Fix every finding it raises. Run the gate routine again. Repeat up to `--max-gate-cycles`. If it is still not clean at the cap, stop. Leave the PR in draft and log exactly what fails.

## Phase 9: Merge

```
gh pr ready
```

Run phase 1 of the pre-merge routine against the PR. Collect the PR number, the result of the gate routine, any migrations and environment variables, and the rollback plan.

- With `--auto-merge`, and only if the gate passed and there are no migrations and no new environment variables: merge without asking.
- Otherwise: present the summary, ask "Merge #N now?" and wait for an explicit yes.

```
gh pr merge --squash
```

If it is not merged, leave the PR ready, record `awaiting-merge` in the audit log, skip phases 10 and 11 for this issue and go to phase 12.

## Phase 10: Production smoke test (Playwright, non-negotiable)

This phase must run through Playwright. If Playwright is not available, stop here (see the guardrails).

Hand it to the qa-tester role. Concretely:

1. Sign up or log in with a throwaway account against the production URL. Not local and not a preview deploy.
2. Drive the exact user flow from the issue's original repro steps (Phase 2). Use the actual broken path, not a generic click-around.
3. Assert that the specific end state the issue described as broken now behaves correctly.
4. On failure, capture a Playwright trace or screenshot and attach it to the audit log. "It failed" is not enough.
5. Clean up the throwaway account afterwards where the product supports it.

If a bug is found: fix, deploy and retest through the same flow, up to `--max-retest-cycles`. Each redeploy is a new merge to production and follows the Phase 9 rules. Past the cap, stop and escalate.

## Phase 11: Close the loop

On a clean smoke test:

```
gh issue comment <number> --body "Fixed in PR #<pr-number>. <one-line summary of the fix.> Reassigning for verification."
gh issue edit <number> --add-assignee <originator> --remove-assignee @me --add-label "needs-retest"
```

## Phase 12: Next issue

Return to Phase 4 for the next-ranked issue, up to `--max-issues`. When the cap is reached or the queue is empty, stop.

## Run summary

Every run writes `docs/audits/issue-fix-loop-<date>.md` with:

- The issues processed and the outcome of each: merged, awaiting-merge, escalated, needs-repro or needs-info.
- Any guardrail that fired, and why.
- The remaining open-queue count.
- A suggested `--max-issues` for the next run.

## Rules

1. Schema, auth or payments blast radius: stop and wait for explicit approval, no exceptions.
2. Every cap in the guardrails is a hard stop, not a soft target.
3. Never guess a root cause. If it cannot be confirmed, skip and label.
4. Stage only the files you touched, even inside an automated run.
5. One repo per run.
6. First run on any new product: `--dry-run`, then `--max-issues 1`.
7. Push and draft-PR creation are allowed. Never merge without an explicit human yes or `--auto-merge` with its conditions met. Never deploy except through a merge.

## Before you leave this running

Answer these five questions first. Put the answers at the top of your run summary.

1. What does "done" mean for this run?
2. How will you check it yourself? Name the tests or checks.
3. What may you touch, and what is off limits?
4. What stops you? For example: the same check fails three times, a cost limit is reached or a Tier 3 trigger appears.
5. Who signs off before anything ships?

If this runs headless, set a turn limit and a budget limit so a stuck run stops by itself.

---
description: Triage (or take a given set of) issues, confirm true root cause with live telemetry, design + adversarially review each fix, build, gate, merge, and close or hand off for retest.
argument-hint: '[--issues N,N,N] [--no-shadow-builds | --allow-flags]'
model: claude-opus-5-5
effort: high
---
# /triage-fix-ship

Take real bugs from reported to merged, deployed, and closed or handed to a tester. Confirm the true root cause with live telemetry, design and review each fix, build, gate, merge and resolve.

The full pipeline for taking a handful of real bugs from "reported" to "merged, deployed, and closed or handed to a tester". It is not scaffolded, not designed-but-unbuilt and not merged-but-unverified.

Every phase either produces a concrete output (a design doc, a pull request, a merged commit, a closed issue) or stops and asks. No phase may report "done" on the strength of a design alone. "Done" means built, tested, gated, merged and confirmed live.

## Tier (pick it first)

Before Phase 3, give each issue a delivery tier by risk, not size (see the delivery tiers document). Start from the lowest tier that fits and go up only for a named trigger. Write `Tier: N - <reason>` on the issue, in the same form the pull request uses. Run only the phases that tier needs.

- **Tier 0:** CI only.
- **Tier 1:** a half-page design in the issue body, no separate Phases 4 and 5, and one independent reviewer who reads design and diff together at Phase 7.
- **Tier 2:** every phase, with one reviewer pass in Phase 4 (the correctness skeptic, who also covers the data-integrity and model-routing checks that apply).
- **Tier 3:** every phase as written, with all the Phase 4 reviewers.

Any phase that finds a trigger raises the tier and says so on the issue. Never lower it. The owner may override the tier. Tests first, a stated rollback, `refs #N` and the retest workflow apply at every tier. Phase 6 opens the pull request with the template's delivery tier section. A CI check may fail without it.

## Invocation

Parse `$ARGUMENTS`.

- **No arguments:** run Phase 1 (triage) and stop for a human pick, the same as `/triage`.
- **`--issues N,N,N`:** skip Phase 1 and go straight to Phase 2 for exactly those issue numbers.
- **`--allow-flags`:** opt out of the no-shadow-builds default in Phase 6. Use it when the product has real customers or production traffic to protect and a staged rollout is the right call. The default is `--no-shadow-builds`. It suits a pre-launch or pre-customer product, where the point of shipping is for testers to exercise the real behavior.

---

# Phase 1: Triage (skip if `--issues` is given)

Read all open issues assigned to the person driving this session. Pull full detail on the contenders.

Score each on impact: user or business value, urgency (blocking, regression, security, deadline), effort to ship (lower effort lifts the score) and risk if left alone. Note clusters. Several issues that share one root cause or one investigation thread are a signal, not noise.

**Check for in-flight competing work before you recommend anything.** Search open pull requests for an existing plan-only design pull request that already targets one of your candidates. If one exists, surface it explicitly. The human may want to approve that plan instead of, or alongside, a fresh pick here.

Show the top 3 as a table: issue number, title, one-line impact rationale and effort (S, M or L). State your pick and why in two sentences. **Stop there.** The call on what to do next is the human's.

---

# Phase 2: Confirm root cause (per issue, with live telemetry, not just the issue text)

For each chosen issue, verify the claimed root cause yourself. Do not restate the issue body as if it were already confirmed. Re-derive it from primary sources:

- **The error tracker:** find the cited issues or related error events. Check whether the failure is still occurring recently.
- **The database (read-only queries only):** check the tables and counts the issue cites against live data. Recompute a rate yourself where you can, instead of trusting a cited percentage. Denominators are the most common way these investigations go wrong. A rate measured in a window that starts at the last failure is zero by construction. Get the true denominator first.
- **The LLM tracing service:** query its API directly, with credentials from the environment. List a real sample of calls in a time window, with input, output, model, usage and status. For a single call, filter the list by id. This is how you confirm which model actually served a call, instead of assuming it from the issue text.
- **The code itself:** read the current file and line the issue cites. It may have changed since filing. Confirm the call's model routing in the code and in your own tracing pull. A model other than the one you assume can silently ignore instructions meant for another.

State explicitly anything you could not verify and why (missing credentials, no recent traffic, a tool not available). Do not paper over a gap by leaving it out.

---

# Phase 3: Design (per issue)

Using the confirmed root cause, produce a solution design that covers:

1. The exact fix approach, and the exact files and functions (verified by reading them, not assumed).
2. Migration: yes or no. If yes, the exact shape, backfill logic and idempotency.
3. Existing bad or degraded rows already in production. A defect seen on rows written before the fix is not evidence of a live bug. Prefer marking such rows invalid or re-derivable over hand-editing their content. State explicitly whether a repair migration is warranted or a forward-only fix is enough, and justify the choice either way.
4. The test plan: unit and integration tests, and whether an existing acceptance-test convention in the repo applies.
5. Rollout and risk: feature flags (see Phase 6's default), idempotency, access-policy impact, and impact on circuit breakers and graceful degradation.
6. Model-tier accounting: if any part of the fix depends on prompt wording, state which model serves that call. If it is not the model family the prompt was written for, do not rely on prompt wording alone. Include a code-level validation or enforcement backstop. The model is the voice, not the authority.

---

# Phase 4: Adversarial review of the design (per issue, before any code is written)

Run independent reviewer passes against the design. Ask the design reviewer role, with a different brief for each. Each one is prompted to find reasons the design is wrong, not to confirm it:

- **Correctness skeptic:** does it fix the root cause completely, not just the sampled failure mode? Would it regress anything else on the same call path? Would the test plan have caught the original bug?
- **Data-integrity and migration-safety reviewer:** does it handle existing bad rows as Phase 3 says? Is any migration idempotent and safe under concurrent production writes? Does it respect access policies and the project's naming conventions? Does it avoid new in-memory state in a stateless route?
- **Model-routing reality check:** independently confirm, from the code and a fresh tracing pull and not by trusting the design, which model serves any touched call. If the design leans on prompt wording alone for a model it was not written for, flag it hard.

Each reviewer returns: approved (yes or no), `mustFix[]`, `niceToHave[]` and a one-paragraph summary.

---

# Phase 5: Revise

Produce the FINAL design. For every `mustFix` from every reviewer, either make the change or state why not, with reasoning, not a dismissal. Fold in cheap `niceToHave` items. The final design must be complete and self-contained. A builder should never need to re-read the original design or the reviews to implement it.

---

# Phase 6: Build (per issue, isolated so parallel issues do not collide)

Implement exactly what the final design specifies. Ask the builder role to do it, or do it yourself. Add or extend the tests the design calls for. Run the typecheck, the targeted test files and the full suite. Do not push on a red or partly run suite.

**No-shadow-builds default** (`--allow-flags` opts out). Do not gate the actual fix behind a new environment variable or feature flag that defaults to off. Do not ship a piece as telemetry-only or observe-only when the design's whole point was to change behavior. Ship the real, active, enforcing code path. The exceptions that may stay inert are those with a genuine architectural reason. For example, no retry loop exists at that call site to correct with, or correcting it would need fabricated content the fix itself forbids. State any such exception loudly in the pull request body as an explicit exception. Never let it blend in as "shipped active".

Write the commit message in the imperative and explain why. A fix for a reported bug must stay open for tester retest, so write **`refs #N`**. Never write `Fixes #N`, `Closes #N` or `Resolves #N`. Those close the issue the moment the pull request merges, before anyone has retested.

Push, then open a **draft** pull request using the repo's pull request template. Put a delivery tier section first, with a `Tier: N - <reason>` line and, for Tiers 2 and 3, `Design:` and `Reviews:` lines. Then add the summary, an explicit yes or no on migrations and environment variables (never left blank), the changes and the test plan. The API may not apply the template, so write the sections into the body yourself. Reference the issue as `refs #N` in the body too. Do not merge, close or relabel the issue at this point.

---

# Phase 7: Gate (per pull request)

Run `/gate` against each pull request's branch: a baseline (a fresh full-suite run), the `code-reviewer` agent on the diff, and the `qa-tester` agent on the changed surfaces. The QA pass may report "no meaningful testable surface exists" for a pure backend or service-layer change, rather than invent an irrelevant browser test. Do not penalize that answer.

Present the triage table (critical, high, medium clear bug, medium judgment call, low). Per the gate's own rule, only critical, high and medium-with-a-clear-bug findings are auto-fix candidates. Never fix a low or a style-only medium. Get an explicit "all", a list of IDs or "none" from the human before you fix anything, unless they have already given that approval for this run. Apply approved fixes one at a time, one commit each, with the full suite green again before pushing.

---

# Phase 8: Merge

Confirm that CI is fully green (not just local tests passing) and that the pull request reports a clean mergeable state before you merge each one. Never merge on a check that is still running. Mark each draft pull request ready for review immediately before merging it.

If several pull requests in this run touch overlapping files, merge them one at a time. After each merge, fetch the next pull request again. The mergeable state briefly reads "unknown" while the host recomputes against the new base. Wait for it to settle on clean. If it settles on conflicted, merge the base into the pull request branch and resolve the conflicts before you continue. Never merge on a stale read.

---

# Phase 9: Confirm the production deploy

A merge is not a deploy. Check the hosting platform for a production deployment of the final merged commit. Wait for it to report ready before you touch any issue in the next phase. If it fails, report that at once. Do not close or reassign anything.

---

# Phase 10: Resolve the issue (per issue, only after Phase 9 confirms the deploy)

Check who opened the issue (the author, not the assignee).

- **Opened by the person driving this session** (a self-filed engineering finding, not a tester-reported bug): close it directly. Comment with the pull request, the merge commit and confirmation that it is live in production.
- **Opened by anyone else:** do not close it. Follow the project's bug-retest workflow in full. Apply the `needs-retest` and `investigated` labels. Remove the developer as assignee. Add the original reporter (or a tester named in a developer comment) as assignee. Leave the issue **open**. Comment with retest instructions, including "retest on fresh data, never the data that produced the original report" for anything that could have written stale or corrupted rows. The tester closes it on a pass. A failed retest comes back to the developer with evidence. Do not close it again.

---

# Guardrails

- Never invent a root cause from the issue text alone. Phase 2 is not optional.
- Never let an adversarial review's approval of a design stand in for building and testing the code.
- Never auto-fix a gate finding below the critical, high or clear-bug-medium bar.
- Never merge on a red or still-running check, or on a stale mergeable state.
- Never close or reassign an issue before Phase 9 confirms the fix is live.
- Never use a closing keyword (`Fixes`, `Closes`, `Resolves`) in a commit or pull request body for a bug-labeled issue. Always `refs #N`.
- Never reassign a `needs-retest` issue to the developer, and never leave one assigned to them.

## Before you leave this running

Answer these five questions first. Put the answers at the top of your run summary.

1. What does "done" mean for this run?
2. How will you check it yourself? Name the tests or checks.
3. What may you touch, and what is off limits?
4. What stops you? For example: the same check fails three times, a cost limit is reached, or a Tier 3 trigger appears.
5. Who signs off before anything ships?

If this runs without a person watching, set a turn limit and a spending limit so a stuck run stops by itself.

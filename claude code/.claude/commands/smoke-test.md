---
description: Adversarially exercise a live product with a throwaway account, cross-reference what the UI claims against committed state and telemetry, and fix confirmed divergences via draft PR and preview retest.
argument-hint: '[product] [--journeys core|all|<name>] [--max-fixes 2] [--no-fix] [--env production|preview]'
model: claude-opus-5-5
effort: high
---
# /smoke-test

Drive a live product the way a difficult user would, and check the data behind every claim it makes.

**The interface tells you what it thinks happened. The database holds what actually happened.** Nothing guarantees those agree. A form can show a success message while the write silently failed under an access policy. An AI feature can return a confident answer while nothing was saved. A delete can appear to work and leave the row in place. Passing unit tests and a click through the happy path will not find any of it.

**Run it** before a release, after a batch of merges, or any time something feels off in live use.

## Arguments

Parse `$ARGUMENTS`: an optional `[product]` first (if empty, use the product in the current repo; if unclear, ask). `--journeys` (default: the full bank in Phase 1), `--max-fixes` (default 2), `--env` (default `production`). `--no-fix` runs Phases 0 to 3 and the report only: no design files, branches or pull requests. Unknown flags: stop and name them.

## Where this sits

| Command | Scope | Oracle |
|---|---|---|
| `/pre-merge` | Migrations and environment variables after a merge | Did they land as listed? |
| `/smoke-test` | The live product, unscoped | Does the UI match the committed state? |
| `/telemetry-sweep` | Telemetry only, no browser | Is anything quietly broken? |

## The oracle

Every check here is secondary to one comparison:

> For each consequential action: what did the interface **claim** happened, and what did the database **commit**?

Where they disagree, that is the bug.

### Divergence classes

| Class | Shape | Severity |
|---|---|---|
| **Silent failure** | The UI confirmed success. Nothing was written. | **Highest.** The user believes their data is safe. |
| **Phantom state** | The UI shows data that does not exist in the database. | High. Usually a stale cache or an optimistic update that never reconciled. |
| **Partial write** | Some fields committed, some dropped. | High. Corrupts quietly and compounds. |
| **Wrong scope** | Written to the wrong user, organization or tenant. | **Highest.** A data-isolation failure, not a bug. |
| **Magnitude drift** | Both present, values disagree. | High |
| **Unreported failure** | The write failed and no error was shown. | High |
| **Leakage** | The account can read or reach data it does not own. | **Highest.** Stop the run and report immediately. |

Rank by this table, not by how visible the symptom is. The quiet ones are the expensive ones.

## Hard caps

| Cap | Limit |
|---|---|
| Actions driven | 40 |
| Divergences fixed | 2 (`--max-fixes`) |
| Fix attempts each | 2, then hand over |
| Root-cause rounds each | 3 |
| Files edited per fix | 8 |

If a cap is hit, stop that thread and say so. Never extend a cap to finish something.

## Phase 0: Preflight

Hard stops.

1. **Throwaway account.** Use a dedicated test account from the project's test configuration. **Never the owner's account, never a customer's.** Tag everything the run creates with a run identifier.
2. **A second throwaway account**, if one exists. It is required for the isolation checks in Phase 1. Without it, skip them and say so in the report. This is the highest-value check the command runs, and a second account is worth five minutes of setup.
3. **A browser automation tool** (for example Playwright) pointed at the target URL. **No fallback to manual testing.**
4. **Read access to telemetry:** the database (read-only), the error tracker and the deploy logs, plus the LLM tracing service if the product has AI features. If any is not connected, mark that check BLOCKED. Never infer success.
5. **Baseline the error tracker.** What is already firing, at what rate, since when. Without this you cannot tell a pre-existing error from one you just caused.
6. **Product profile.** Read the project's smoke-test profile if one exists: core journeys, the state tables each one writes to, plan limits, which AI features exist. If there is none, derive journeys from the routes and note that the run is exploratory and **not comparable to previous runs**. Offer to write the profile at the end.

### Production safety: absolute

- Writes stay inside rows the throwaway accounts own.
- **Never complete a real payment.** Check that the checkout entry point renders and is reachable, then stop. Exercise payment flows in preview against the payments provider's test mode.
- Never delete anything but the run's own data. Never disable access policies. Never use a service-level key. The point is to see what a real user sees.
- With `--env preview`, all of the above still applies, but destructive checks are permitted.

## Phase 1: Drive it adversarially

The happy path rarely finds anything. Each scenario below stresses a different part of the write path. Run the fixed bank so runs stay comparable, then improvise.

| Scenario | Provokes |
|---|---|
| **Isolation** | Sign in as account B. Try to read, edit and delete account A's records by direct URL and ID. Tests access policies and tenant scoping. **Any success here stops the run.** |
| **Boundary** | Empty submit, whitespace only, maximum-length strings, zero, negative numbers, unicode, emoji, and query-like or markup-like characters in free text. |
| **Interruption** | Abandon mid-flow. Use the back button after submit. Refresh during a write. Double-click submit. Navigate away before the response lands. |
| **Concurrency** | Two tabs on the same record. Edit in both, save in both. Is it last-write-wins, or a lost update? |
| **Network** | Throttle to a slow connection. Abort a request mid-write. Does the UI report the failure, or claim success? |
| **Stale session** | Sit idle past token expiry, then act. Does it fail cleanly, or write to a dead session? |
| **AI path** | Empty input. A very long input. An off-topic request. Instruction-shaped text inside user content. Then compare what was saved with what was displayed. |
| **Limits** | Approach a plan boundary. Does it degrade cleanly, or fail with a stack trace? |
| **Refusal** | Cancel every dialog. Decline every prompt. Does anything commit when nothing should? |
| **Deep link** | Enter a mid-journey route cold, with no prior state. |

`--journeys` restricts the set. The default runs the full bank within the action cap.

**Record every action:** input, timestamp, what the UI displayed, screenshot. The retest in Phase 6 replays these exact steps. Without them you cannot prove a fix.

## Phase 2: Cross-reference each consequential action

An action is consequential if the UI implies a state change, or if the database committed one. **Check both directions.** The interesting failures are where only one side thinks something happened.

### The database: ground truth

For each action, query the tables it should have written to. Compare field by field with what the interface displayed. Then check the inverse: rows written that no action should have produced, and actions that produced no write at all.

Also check the window for access-policy denials (were any legitimate actions blocked?), auth failures, statement timeouts, constraint violations and server errors from the API layer.

**This is the authority.** Where the interface, telemetry and committed state disagree, committed state is what the product acts on next.

### The LLM tracing service: what the AI actually did

For any action that touches an AI path:

- **Which model ran.** Wrong routing is a cause, not a symptom.
- **Did the call happen at all?** A UI showing an AI result with no matching trace means something cached, mocked or fabricated it.
- What the call received and returned. Compare it with what was displayed and what was stored. These are three points, and the gaps between them are different bugs.
- Latency and cost per action. A 40-second response is a finding even when correct.
- Output validity: empty completions, cut-off output, malformed structured output, refusals.

Tag the run with a session identifier (`smoke-<product>-<timestamp>`) so its traces can be pulled as a set.

### The error tracker: what broke quietly

Anything firing during the run, and whether it is new since the baseline.

**A divergence with a matching error is confirmed and traceable. A divergence with no error at all means something swallowed it.** That is a second bug and gets its own entry.

### The deploy logs

Runtime errors and function timeouts during the run window. A silent server error behind a friendly message shows up here and nowhere else.

## Phase 3: Confirm it is a bug, not intended behavior

**Before you treat any divergence as a defect**, establish that the product does not mean to do it.

1. Read the source for the code path. Is the observed behavior what it intends?
2. Look for a deliberate reason: eventual consistency, a queued job that has not run yet, a deliberately optimistic update, a soft delete, a denormalized field updated on a schedule.
3. Check again after a short wait. A write that lands two seconds later is a latency finding, not a data-loss finding. They need very different fixes.

Then classify:

- **Confirmed divergence:** the code intends one thing and does another. Fixable.
- **Confirmed design:** working as intended. Log it once so the next run does not argue about it again.
- **Ambiguous:** you cannot tell. **Report it as a question. Do not fix it.** Silently "correcting" intended behavior is worse than leaving a bug.

Only confirmed divergences enter the fix loop.

## Phase 4: Trace to source

Apply the `/rca` discipline in full. Do not shortcut it because the symptom looks obvious.

- Reproduce it, or declare it unreproduced. An unreproduced cause is never Confirmed.
- **At least three competing hypotheses** across layers: client state, request path, server handler, access policy, schema constraint, cache, third party.
- **Try to falsify before you confirm.** Name what would disprove each hypothesis and go look for that first.
- Follow the causal chain past the proximate cause. "The insert failed" is not a root cause. "The policy checks a column the client never sends, so every write from this form is denied and the error is swallowed by the message handler" is.
- Confidence: Confirmed, Probable or Speculative. **Never implement against Speculative.**

Name the layer at fault. **Fixing the interface to match a wrong write is the tempting wrong move.** It makes the symptom disappear and leaves the corruption in place.

## Phase 5: Fix minimally

Sequential. Close one divergence fully before the next.

### Design first

Write `docs/design/fix-<slug>.md`: root cause, the change, what it explicitly does not change, blast radius, the test that must go from red to green, rollback.

**Gate, no exceptions.** If the fix touches **schema or migrations, auth, access policies or payments code**, present the design, do not implement it, and move to the next issue. This gate gets stricter when the run is autonomous. It never loosens.

### Then implement

**Make the smallest change that closes the gap.** No opportunistic refactoring of adjacent code you have just read and now dislike.

Delegate to the `implementer` agent, briefed on the design file only. Answer its questions from the design. Never let it guess.

### Prove it locally before pushing

1. The **regression test**, written first, red before the fix, green after. This is the durable output. The fix stops today's bug. The test stops its return.
2. The **full affected suite**.
3. **Typecheck**, if the project has one.

All three green, or you do not push. Stage files explicitly. Never stage everything with a wildcard.

## Phase 6: Draft pull request, then live retest

Push the branch. **The push triggers a real preview build.** That is the deploy. Open the pull request as a **draft**. A human merges it. You never do.

Confirm the preview built. Then, against the preview URL:

1. **Replay the exact action sequence** from Phase 1.
2. Run the same Phase 2 cross-reference. The divergence must be gone **in the committed state**, not just in the interface.
3. Run the isolation and boundary scenarios again. The fix must not have opened something else.

Unit tests prove the code ran. This proves the product behaves differently now. Both are required. Neither substitutes for the other.

- **Passed:** the draft pull request stands, with before and after evidence in the body.
- **Failed, attempt 1:** the failure is new evidence. Go back to Phase 4. Do not patch the patch.
- **Failed, attempt 2:** stop. Leave the draft pull request, document both attempts and what you learned, and move on.

## Phase 7: Cleanup and report

Delete everything the run created, **even if the run failed or was interrupted**. Delete only rows that carry the run identifier. Report anything left behind. Delete through the product as the throwaway account where possible. If a direct database delete is unavoidable, print the exact statement first and filter only on the run identifier.

Write to `docs/audits/smoke-test-<product>-<YYYY-MM-DD-HHmm>.md` (or the project's audit folder).

```markdown
# Smoke Test: <product>
Run: <timestamp> | Actions: <n> | Journeys: <list> | Env: <production|preview>
Accounts: <throwaway A, B> | Cleanup: complete | <exceptions>
Profile: <path> | none (exploratory, not comparable)
Caps hit: <none | detail>

## Verdict
<Three sentences. Does what the product says match what it stores?>

## Isolation
<Pass, or STOP THE RUN detail. Always reported, always first.>

## Confirmed fixed
### <Divergence>: draft PR #<n>
**Class:** silent failure
**Before:** Saving a report showed a success message. No row in the reports table.
The error tracker was silent: the error was swallowed by the message handler.
**Root cause (Confirmed):** <file:line> and the mechanism
**After:** same action on preview. Row committed, fields match the interface.
**Regression test:** <name>
**Status:** draft PR, not merged

## Probably fine
<Checked, no divergence. Named so the next run knows what was covered.>

## Still open
### <Divergence>: not fixed
**Attempts:** 2 | **Learned:** <...> | **Draft PR:** #<n>

## Ambiguous: bug or intended?
<One question each. Not fixed.>

## Confirmed design (not bugs)
<Logged so future runs skip them>

## Silent failures
<Divergences with no error-tracker signal. Something is swallowing errors. Separate bug each.>

## Action by action
| # | Scenario | UI claimed | DB committed | Model | Latency | Match |

## Awaiting you
1. Review draft PR #<n>
2. Answer the question on <ambiguous finding>
3. Write a smoke-test profile so the next run is comparable
```

## Rules

- **Never a real user's account or data.**
- **Never merge.** Draft pull request only. The preview build is the deploy.
- **Never complete a real payment.**
- **Committed state is the authority.** Where interface, traces and database disagree, the database is what the product acts on.
- **Never fix the interface to match a wrong write.** Find the layer that is actually wrong.
- **Ambiguous means ask, not fix.**
- **The gate does not bend.** Designs for schema, access policy, auth and payments changes are produced and handed over, never implemented.
- **Smallest change that closes the gap.**
- **Local suite and typecheck green before pushing.** No exceptions.
- **A clean run is a real result.** If forty adversarial actions produce no divergence, say so in five lines and stop. Do not invent findings to justify the run.

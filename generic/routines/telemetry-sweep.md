# telemetry-sweep

Read telemetry across the error tracker, the LLM tracing service, the database logs and the deploy logs. Find patterns that indicate a real defect and produce a ranked root-cause report.

**This routine never fixes anything.** It reads, correlates, reasons and writes one report file. No code edits, no migrations, no deploys, no task-list updates without a human gate.

## Inputs

| Input | Default | Meaning |
|---|---|---|
| `product` | current repo | Which product to sweep. It must map to a project in each telemetry source. |
| `--since` | `7d` | Lookback window: `24h`, `7d` or `30d`. |
| `--source` | all wired | Restrict to named sources: errors, tracing, database, deploys. |
| `--focus` | none | A symptom or area to bias ranking toward (for example "checkout" or "slow AI responses"). It does not exclude other findings. |

If nothing is given, sweep the current repo over `7d` with every wired source and no focus.

## Hard caps (stops, not targets)

- **Collection phase: 40 queries at most.** At the cap, stop collecting, note which sources are incomplete and go on with what you have.
- **Investigate at most 5 clusters** in the root-cause phase. Rank first, then investigate.
- **Read at most 15 source files** during root-cause analysis. If a cluster needs more, mark it `needs-deeper-dive` and move on.
- **One report file per run.** Write nowhere else.

If a cap is hit, say so in the report. A truncated sweep that says it was truncated is useful. One that pretends to be complete is not.

## Phase 0: Preflight

Find out what is available before you query anything.

1. Resolve the product to: repo folder, error-tracker project, database project, hosting project.
2. Check which sources are wired: the error tracker, the LLM tracing service, the database logs and the deploy logs. For the tracing service, check that its credentials are set in the local environment file. Never print the values.
3. Print a one-line availability table. **If a source is not wired, mark it BLOCKED once and continue. Never infer success for it.** Do not try to install or configure anything, and do not ask the user to wire it mid-run.

Record the deploy history early. You need deploy timestamps to correlate against everything else: deployment id, created time, state, commit sha and commit message for the last 30 days.

## Phase 1: Collect

Query each wired source. Bound every query by the window. Collect raw signals. Do not interpret yet.

### The error tracker

- Unresolved issues in the window, sorted by frequency, then again by first seen (new issues).
- For the top issues by event count: the issue detail, stack frames and affected release.
- Per issue: title, culprit, event count, user count, first seen, last seen, release, environment, handled or unhandled.

Flag separately:
- **New**: first seen inside the window.
- **Regressed**: previously resolved, now firing again.
- **Escalating**: event count in the last quarter of the window is more than double the first quarter.

### The LLM tracing service

Use its public API with credentials from the local environment file. Do not echo keys. If a call fails with "not found", check the service's current API docs instead of guessing at parameters. Paginate with the returned cursor. Collect:

- Traces with an error level or a non-empty status message.
- Latency per named operation (median and 95th percentile), compared with the preceding equal window.
- Token usage per operation, compared with the preceding window.
- Trace volume per operation, compared with the preceding window.
- Output anomalies: empty completions, completions cut off at the token limit, refusals, malformed structured output where the prompt asked for it.
- Retry clusters: the same session or user firing the same operation repeatedly within seconds.

### The database logs (read-only)

- Security and performance advisories.
- Logs for the window: server errors from the API layer, auth failures, access-policy denials, statement timeouts, connection exhaustion.
- Slow query patterns: the queries with the worst total time.
- **Data freshness.** For each table fed by a pipeline, the latest `updated_at` or `created_at`. Compare it with the expected cadence. A stale table is a bug even when nothing errored.
- Integrity smells, only where cheap to check: orphaned references, nulls in a field the app always writes, duplicate rows on a logical key.

Never write to the database from this routine. No migrations either.

### The deploy logs

- Grouped runtime error clusters with counts.
- Server errors and function timeouts in the window.
- Build failures from the deployment list.

## Phase 2: Normalize

Build one signal table before you reason about anything. Every row has:

| Field | Notes |
|---|---|
| `source` | errors / tracing / database / deploys |
| `signal` | short description |
| `first_seen` / `last_seen` | ISO timestamps, UTC |
| `volume` | events, traces, rows or requests |
| `users_affected` | a count if known, `unknown` if not |
| `surface` | route, endpoint, function, agent name or table |

Do not invent values. `unknown` is a valid entry and is more useful than a guess.

## Phase 3: Cluster and correlate

Group signals that plausibly share one cause. Correlation is the point of this routine. A single error-tracker issue read alone is something its own dashboard already tells you.

**Correlation heuristics, in priority order:**

1. **Deploy-adjacent.** A signal's first-seen time falls within about 30 minutes after a deploy. Name the commit. This is the highest-value correlation and usually settles cause at once.
2. **Shared surface.** Different sources pointing at the same route, function, table or agent.
3. **Temporal co-occurrence.** Signals rising and falling together across sources. A latency spike and a statement timeout in the same hour are one problem, not two.
4. **Shared identity.** The same user, organization, tenant or session across sources. This points at a data-shaped bug, not a code-shaped one.
5. **Upstream dependency.** Unrelated surfaces all degrading at once points at a provider, not your code. Check the providers' status pages before blaming the repo.

### Silent failures: absence as signal

Check these explicitly. They never reach the error tracker because something swallowed them.

- Trace volume for a named operation dropped sharply with no matching rise in errors.
- A pipeline's table has not been written to within its expected cadence, and no job errored.
- An endpoint's request volume fell while overall traffic held steady.
- Traces show completions returning, but the downstream table has no new rows.
- A `catch` block in the code path logs and returns a default. Search for swallowed errors near any surface named above.

A silent failure with no error signal outranks a noisy handled exception. Say so in the ranking.

## Phase 4: Rank

Rank clusters by this test, in order: something breaks, users are affected, revenue or reputation is at risk.

| Rank | Criteria |
|---|---|
| **P1** | Users are blocked, money is affected or data is being written wrong. This includes auth failures, payment paths, silent data corruption and stale data shown as current. |
| **P2** | A user hit a degraded experience: feature errors, timeouts, bad AI output, slow paths. |
| **P3** | Real but not user-visible yet: advisories, creeping latency, cost drift, dependency warnings. |
| **Noise** | Bot traffic, handled expected errors, known third-party flakiness. List these in one line so the next run does not argue about them again. |

If a focus was given, show matching clusters prominently. Do not demote a P1 that falls outside the focus.

## Phase 5: Root cause analysis

For the top 5 clusters only, in rank order.

**Code is master.** Read the actual implicated code. Where telemetry, docs and code disagree, trust the code and flag the gap in the report.

For each cluster:

1. **Trace to code.** From stack frames, route names or operation names, find the responsible file and function. Read it.
2. **Check history.** Search the commit history on the implicated files. Does a change line up with the first-seen time?
3. **State the mechanism.** One paragraph: what sequence of events produces this signal. If you cannot state a mechanism, you have a correlation, not a root cause. Label it as such.
4. **Assign a confidence level.**
   - **Confirmed:** the mechanism is visible in code and the timeline matches. Cite file, line and commit.
   - **Probable:** the mechanism is plausible and the evidence points one way, but something is unverified. Name it.
   - **Speculative:** a pattern, cause unknown. Say what one query or test would settle it.

   Never present Probable as Confirmed. An honest Speculative is more useful than a confident wrong answer.
5. **Recommend a fix**, sized: one-line change, contained fix or needs design. Name the file and approach.
6. **Hand off.** A P1 that ends Probable or Speculative, or is marked `needs-deeper-dive`, gets a recommended follow-up with the rca routine in the report. Do not start it from here.

### Human gate

If a recommended fix touches **schema or migrations, auth or payments code**, stop and mark it `REQUIRES APPROVAL` in the report. Describe the fix. Do not begin it, and do not open a follow-up task for it automatically. The owner approves these explicitly.

## Phase 6: Report

Write to `docs/audits/telemetry-sweep-<product>-<YYYY-MM-DD-HHmm>.md` (or the project's audit folder).

Do not write to the project's task list, log or notes files. If findings warrant task entries, list the proposed entries at the end of the report and **ask** before writing them.

```markdown
# Telemetry Sweep: <product>
Window: <from> to <to> | Run: <timestamp>
Sources: errors OK | tracing OK | database OK | deploys incomplete (<reason>)
Caps hit: none | collection cap at <n> queries

## Verdict
<Two or three sentences. Is there a bug that needs fixing right now, or not?
If nothing meets the bar, say "no action required" plainly and stop.>

## P1: Act now
### 1. <Cluster name>
**Confidence:** Confirmed
**Evidence:** <signals from each source, with counts and timestamps>
**Mechanism:** <what actually happens>
**Cause:** `path/to/file:120`, introduced in `a1b2c3d` (<date>, "<commit message>")
**Users affected:** <n or unknown>
**Fix:** <specific recommendation>, contained fix
**REQUIRES APPROVAL:** <only if schema, auth or payments>

## P2: Fix this week
...

## P3: Watch
...

## Silent failures
<Absence-of-signal findings, or "none detected">

## Correlated to deploys
| Deploy | Commit | Clusters implicated |

## Unresolved
<Signals you could not explain. What one query or test would settle each.>

## Noise (ignored)
<One line each>

## Proposed task entries (not yet written)
- [ ] ...
```

## Rules

- **Read-only.** No edits, no migrations, no deploys, no branch operations. The output is a report and nothing else.
- **Never print secrets.** Read environment variable names, never echo values.
- **No fabricated numbers.** Every count, timestamp and user figure traces to a specific query result. Write `unknown` where it is unknown.
- **One quotable detail beats five vague ones.** Cite file and line, commit sha, exact timestamps.
- **If nothing is wrong, say nothing is wrong.** A clean sweep that reports "no action required" is the correct output most of the time. Do not invent P1s to justify the run.
- **Do not re-run collection** to chase a hunch after Phase 1 closes, beyond the single settling query named in an Unresolved entry. Note it as unresolved instead.

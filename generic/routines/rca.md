# rca

Run a root cause analysis of a known failure: reproduce, compare competing hypotheses, falsify, and trace past the proximate cause.

Something is known to be broken. Find out why. Do not stop at the first plausible story. Find the actual cause.

**This routine diagnoses. It does not fix.** Its output is a report with a proposed fix and a regression test. Implementing is a separate step that a human starts.

## Arguments

Parse the argument:

- The quoted text is the symptom. It is required.
- `--issue ERROR-ID` seeds Phase 1 from that error-tracker issue.
- `--since` sets the log window. The default is `7d`.
- `--no-repro` skips Phase 2.

If no symptom is given, ask for one and stop. If a recent telemetry sweep report covers this symptom, start from its evidence, but re-verify it. Do not inherit its conclusion.

---

## The failure mode this exists to prevent

The first plausible explanation is usually wrong, and it is always convincing. A stack trace points at the line where the program noticed the problem, not the line that caused it. Confident wrong analysis is worse than admitting you do not know. It produces a fix that hides the symptom while the cause stays in the code.

**You are not finished when you have an explanation. You are finished when you have tried to break your explanation and failed.**

---

## Hard caps

- At most 3 investigation rounds. A round is: hypothesize, gather, assess.
- At most 5 live hypotheses at any time.
- At most 25 files read. If you pass that, you are exploring, not investigating.
- If you hit a cap without a Confirmed cause, report what you know with confidence labels and stop. Say what one experiment would settle it. Do not keep going.

---

## Phase 1: Establish the facts

Do this before any hypothesis. Separate what was **observed** from what was **inferred**. Mixing them is where bad analysis starts.

Record:

| | |
|---|---|
| **Symptom** | What the user or system actually sees. Not what you think causes it. |
| **First occurrence** | An exact timestamp if available. `unknown` if not. |
| **Frequency** | Every time, intermittent or once. Intermittent changes everything downstream. |
| **Scope** | All users, some users, one user, one organization, one environment? |
| **Recent changes** | Deploys, migrations, dependency bumps, environment changes and third-party updates in the window. |
| **What still works** | As informative as what fails. It narrows the surface fast. |

Gather from the error tracker (stack, release, breadcrumbs, affected users), the database logs, the hosting platform's runtime logs, and the LLM tracing service if the path touches an AI call.

If a source is not connected, write BLOCKED for it. Never infer success.

**Write the facts down before you hypothesize.** If you form a theory while collecting, note it and set it aside. Do not let it steer what you collect next.

---

## Phase 2: Reproduce

Try to reproduce unless `--no-repro` was passed.

- UI path: drive the real steps with a browser test tool.
- API path: use a request or script against a local or preview environment.
- Data-shaped: use a read-only query that returns the offending rows.

Record one of three outcomes:

- **Reproduced.** You have a deterministic path. State it exactly.
- **Reproduced intermittently.** State the hit rate. Intermittency is evidence. It points at races, caching, cold starts, retries or data-dependent paths.
- **Not reproduced.** Say so plainly. Everything downstream is then a hypothesis, and the report must say so. An unreproduced cause is never Confirmed, however good the story.

Never write production data. Never disable access controls to reproduce. If reproduction needs either, stop and say so.

---

## Phase 3: Competing hypotheses

**Generate at least three before you investigate any.** One hypothesis is a hunch you are about to spend an hour confirming.

Force real spread. Take one from each layer that plausibly applies:

- **Code:** logic error, wrong condition, unhandled case, off-by-one.
- **Data:** a row in a state the code does not expect. Nulls, duplicates, legacy rows that predate a migration.
- **Contract:** a schema, type or API response shape no longer matches what the caller assumes.
- **Concurrency and timing:** a race, a stale cache, a cold start, a retry, out-of-order writes.
- **Environment:** a missing or wrong environment variable, a difference between preview and production, a region.
- **Dependency:** a package or provider changed behavior under you.

For each hypothesis, write one sentence: *if this is true, then <specific observable> must also be true.*

### Falsify, do not confirm

For each hypothesis, name the evidence that would **disprove** it. Look for that evidence first.

This inversion is the whole method. Searching for confirmation finds it for almost any hypothesis, because a large codebase holds something consistent with nearly any story. Searching for disproof eliminates, and elimination is what converges.

Kill hypotheses explicitly. The report lists what you ruled out and why. That is evidence of a real investigation, and it stops the next person walking the same ground.

### Red team

Once one hypothesis leads, ask the silent-failure-hunter role to attack it. Give it this brief:

```
Here is a failure and a proposed cause. Do not help me confirm it.
Argue that this cause is wrong. What does it fail to explain? What evidence
would we expect to see if it were true that we have not looked for?

Symptom: <...>
Facts: <observed only>
Leading hypothesis: <...>
Evidence for it: <...>
```

Give it the facts, not your reasoning. If it lands a hit you cannot answer, your hypothesis is not Confirmed.

---

## Phase 4: Causal chain

A stack trace gives you the proximate cause. Keep going. Stop when the next "why" leaves the system you control.

| Layer | Question | Example |
|---|---|---|
| **Symptom** | What the user sees | A dashboard shows no data |
| **Trigger** | Why now | A deploy at a known time |
| **Proximate cause** | The mechanism | A type error reading the length of an undefined value |
| **Cause** | Why that state was reachable | The field is nullable and this read path assumes it is set |
| **Root cause** | Why the system permitted it | A migration added the column with no backfill and no NOT NULL constraint, and no type-level guard exists |
| **Detection gap** | Why it was not caught | No test covers accounts created before the migration |

**"A null pointer exception" is not a root cause.** It is where the program noticed. The root cause is the decision or omission that let the null exist and go unchecked.

Record **contributing factors** apart from the root cause. A missing test did not cause the bug. It let the bug reach production. Both go in the report, in the right place.

---

## Phase 5: Blast radius

The same root cause almost always exists in more than one place. Finding it once and fixing one instance wastes the investigation.

- Search the repository for the same pattern. Look for the same assumption at other call sites.
- Ask whether the cause exists in other products. Shared stacks and copied code make this common. Name the products to check. Do not open them from this routine.
- Check whether the data problem is present in rows nobody has hit yet. Quantify it with a read-only count if that is cheap.

---

## Phase 6: Report

Write to `docs/audits/rca-<slug>-<YYYY-MM-DD-HHmm>.md`.

```markdown
# RCA: <symptom>
Run: <timestamp> · Window: <range> · Rounds used: <n>/3
Reproduced: yes | intermittently (<rate>) | no

## Cause
**Confidence: Confirmed | Probable | Speculative**
<Two or three sentences. The mechanism, plainly.>

## Confidence basis
<Confirmed: mechanism visible in code, timeline matches, reproduced. Cite file:line and commit.
Probable: name exactly what is unverified.
Speculative: name the one experiment that would settle it.>

## Facts observed
<Only what was observed. No inference.>

## Causal chain
| Layer | Finding |
| Symptom | |
| Trigger | |
| Proximate cause | `file:line` |
| Cause | |
| Root cause | |

## Contributing factors
<What let it reach production, separate from what caused it.>

## Hypotheses ruled out
| Hypothesis | Killed by |

## Red team challenge
**Raised:** <what the silent-failure-hunter argued>
**Answered:** <how, or "unanswered: confidence reduced to Probable">

## Blast radius
- Same pattern at: <file:line list>
- Other products to check: <names>
- Rows currently affected: <count or unknown>

## Proposed fix
**Scope:** one-line | contained | needs design
**Where:** <file>
**Approach:** <what, not code>
**REQUIRES APPROVAL:** <only if schema or migration, auth, or payments are touched>

## Regression test
<The specific test that would have caught this. This is the durable output:
the fix stops today's bug, the test stops its return.>

## Detection gap
<Why existing monitoring missed it, and what would catch the next one.>
```

---

## Rules

- No edits, no migrations, no deploys. Diagnosis only.
- The code is the source of truth. Where docs, comments or notes disagree with the code, trust the code and flag the difference.
- Never present Probable as Confirmed. Not reproduced means not Confirmed.
- "I do not know" is a valid result when it comes with the facts gathered, the hypotheses eliminated and the one experiment that would resolve it.
- Never fabricate a timeline. `unknown` beats a plausible guess every time.

---
description: Work the assigned GitHub issue backlog into a set of review-ready PRs plus a release plan. Clusters issues by root cause, designs and builds one fix per cluster, gates each PR, and stops before merge.
argument-hint: '--repo <name> [--max-clusters N] [--max-issues N] [--max-gate-cycles N] [--parallel] [--dry-run]'
model: claude-opus-5-5
effort: high
---
# /backlog-sweep

Take every open issue assigned to me in `--repo`, cluster them by root cause, and work each cluster through to a PR that is ready to merge but **not merged**. End with a release plan covering merge order, migrations and environment variables.

The unit of work is the **cluster**, not the issue. One cluster is one root cause, one branch and one PR, closing however many issues share that cause.

## Flags

| Flag | Default | Meaning |
|---|---|---|
| `--repo <name>` | required | Single repo per invocation. Never more. |
| `--max-clusters N` | 3 | Hard cap on clusters worked this run. |
| `--max-issues N` | 25 | Cap on issues pulled into triage. |
| `--max-gate-cycles N` | 3 | Cap on gate re-runs per PR. See Phase 10. |
| `--parallel` | off | Enable worktree parallelism. See Phase 12. |
| `--dry-run` | off | Run Phases 0 to 3 only, then stop and print the plan. |

Parse these from the command arguments. If the input is empty or has no `--repo`, stop and ask for the repo. Never default one. If it contains a flag not in this table, stop and name it rather than guess.

## Tier

When the plan is made, give each cluster a delivery tier by risk, not size (see the delivery tiers document). Use the highest tier any issue in the cluster needs, each starting from the lowest that fits. Record it as `Tier: N - <reason>` in the plan and on each issue. Run only the phases that tier needs.

- **Tier 0:** CI only.
- **Tier 1:** a half-page `design-<cluster-id>.md`, repeated in the PR body, no Phase 6, and one independent reviewer who reads design and diff together at Phase 9.
- **Tier 2:** every phase, with one reviewer in Phase 6.
- **Tier 3:** Phase 6 as written.

A phase that finds a trigger escalates the tier. Never de-escalate. Gate 1 and Gate 2 are unchanged.

## State files

| Path | Purpose | Lifetime |
|---|---|---|
| `backlog-sweep/plan.md` | Cluster plan, ordering, status per cluster | Durable across sessions |
| `backlog-sweep/design-<cluster-id>.md` | Ground-truth design for one cluster | Durable |
| `audits/backlog-sweep-<date>.md` | Run summary and release plan | Append per run |

Keep these under the project's docs folder. Every delegated reviewer or builder re-reads the relevant `design-<cluster-id>.md` fresh. Never pass design context by summary.

## Routing

The conductor (the strongest model, running this command) makes every judgement call. Bounded execution is delegated to a mid-tier model. Smaller assembly jobs can go to the smallest model.

| Phase | Who | How |
|---|---|---|
| 0 and 1 Preflight, discover | Mid-tier | Delegate to `devops-specialist` |
| 2 Triage tests | Strongest | Delegate to `qa-tester` (explore and run) and `e2e-test-writer` (write the tests) |
| 2 Bucket decisions | Conductor | Reads the test results and decides |
| 3 Clustering and ranking | Conductor | Does it directly |
| 4 Root cause confirmation | Conductor | Does it directly |
| 5 Design | Conductor | Does it directly |
| 6 Design review | Strongest | Delegate to reviewer agents (see the phase) |
| 7 Design update | Conductor | Does it directly |
| 8 Build | Mid-tier | Delegate to `implementer` |
| 9 Gate | Strongest | Run the `/gate` command |
| 10 Applying fixes | Mid-tier | Delegate to `implementer` |
| 10 Judging findings | Conductor | Decides implementation fix or redesign |
| 9 and 11 Push, PR create, PR ready | Conductor | Runs these directly so each push is visible and approved |
| 13 Release plan | Mid-tier | Delegate to `release-planner` |
| 14 Run summary | Smallest | Delegate to `technical-writer` (assembly from existing files) |

Two rules make this work:

- **The conductor never delegates a decision.** Delegates produce outputs: tests, diffs, reports. The conductor reads them and chooses. A delegate that both writes the fix and judges whether the fix is adequate is a self-assessment loop with no outside check.
- **Delegation is by file path, not by summary.** Each delegate receives the path to `design-<cluster-id>.md` and reads it fresh. Never compress the design into a prompt.

---

# PHASE 0: PREFLIGHT

Confirm before doing anything else. Halt on any failure. Do not fall back to a weaker approach.

- The GitHub CLI is authenticated and `--repo` is reachable.
- The working tree is clean. Record the base commit of the main branch.
- The `backlog-sweep` state folder exists. Create it if not.
- If `plan.md` exists from a previous run with unfinished clusters, report them and ask whether to resume or start fresh.

---

# PHASE 1: DISCOVER

```
gh issue list --repo <repo> --assignee @me --state open --limit <max-issues> \
  --json number,title,body,labels,createdAt,comments
```

Read each issue in full, including comments. Comments often hold the real repro that the body lacks.

For each issue record: the stated symptom, the repro steps (or their absence), the affected surface, and whether a stack trace or error-tracker link is attached.

---

# PHASE 2: TRIAGE

Sort every issue into exactly one bucket.

| Bucket | Criteria | Action |
|---|---|---|
| **Already fixed** | A test written against the current main branch that reproduces the reported steps **passes** | Comment with the verifying test, reassign to the originator, label `needs-retest`. Remove from the queue. |
| **Not reproducible** | Repro steps exist but the test fails to produce the reported symptom, and no variant does | Comment asking for specifics, label `needs-repro`. Remove from the queue. |
| **Insufficient detail** | No repro steps and none can be inferred | Comment with the specific questions needed, label `needs-info`. Remove from the queue. |
| **In scope** | A reproducible failure | Carry into Phase 3 with its failing test attached. |

**Non-negotiable:** nothing enters "already fixed" on inspection alone. Write the test, run it against the current main branch and watch it pass. A claim of "already fixed" without a passing test is a guess, and guesses here close real bugs.

**Deferred writes.** Do not post triage comments, labels or reassignments yet. List them in the plan and apply them only after Gate 1 approval. Under `--dry-run`, print them and apply nothing.

**Routing.** Delegate the test writing to `e2e-test-writer` and the exploring and running to `qa-tester` (which cannot write files). Do it as one batch for all issues. Results come back as a table of issue number, test path and pass or fail against the main branch. The conductor reads that table and assigns buckets. Do not let a delegate assign buckets. "Not reproducible" versus "insufficient detail" is a judgement about the issue, not about the test.

---

# PHASE 3: CLUSTER AND PLAN

Group the in-scope issues by **suspected shared root cause**, not by surface area or component. Two issues in the same file with unrelated causes are two clusters. Two issues in different products with one shared cause are one cluster.

For each cluster produce:

- A cluster ID and a one-line hypothesis of the cause
- The issue numbers it would close
- The estimated file set it will touch
- Whether it touches migrations, auth or payments-adjacent code
- Confidence in the hypothesis (high, medium or low)

**Ordering.** Rank clusters by:

```
value = (issues closed) x (max severity across those issues) / (blast radius)
```

Do not rank by individual issue severity. A cluster closing four medium issues outranks a single high issue whose fix touches auth. State the ranking and the reasoning.

Write `plan.md`. Then compute the pairwise file-set overlap between clusters and record which pairs are disjoint. Phase 12 needs this.

### GATE 1: STOP

Print the plan and wait for explicit approval before writing any code. Everything downstream derives from this clustering. A bad grouping wastes the whole run.

Approval here covers branch pushes and draft PRs for the approved clusters only. It never covers merging.

If `--dry-run`, stop here regardless.

---

# PHASE 4: CONFIRM ROOT CAUSE

For the highest-ranked unworked cluster only.

Trace the failure from symptom to cause through the actual code. Use `/rca` for a targeted trace if the cluster involves data flow. The hypothesis from Phase 3 is a starting point, not a conclusion.

Confirmation means you can point at the specific line or decision that produces the failure, and explain why it produces *every* symptom in the cluster.

**If the confirmed cause splits the cluster** (some issues have a different cause), update `plan.md`, re-rank and return to Phase 4 with the revised top cluster. Log the split.

**If the cause cannot be confirmed**, label the issues `needs-investigation`, mark the cluster blocked in `plan.md` and move to the next cluster. Never design against a hunch.

---

# PHASE 5: DESIGN

Write `design-<cluster-id>.md`:

- The confirmed root cause, with file and line references
- The fix, described as behavior before and after
- The files to change and why each is needed
- Schema changes, if any, with the migration up and down
- New or changed environment variables
- What could break elsewhere: the blast radius, named explicitly
- How the fix will be verified: the failing tests from Phase 2 plus any new ones

No code yet.

---

# PHASE 6: ADVERSARIAL REVIEW OF THE DESIGN

Run independent reviews of `design-<cluster-id>.md`. Each reads the file fresh.

All reviewers here use the strongest model. This phase reviews a design, not a diff. The code reviewer is the wrong tool here and belongs at Phase 9, against the actual code.

| Reviewer | Agent | Looking for |
|---|---|---|
| Adversarial | `silent-failure-hunter` | Where does this fail silently? What state does it leave behind on partial failure? Is it idempotent? |
| Architecture | `architect` or `database-architect` | Does the fix address the cause or the symptom? Is there a simpler alternative? Does it contradict existing patterns in this codebase? |
| Security | `security-reviewer` | Only if the design touches auth, input handling or data access. |

Add `database-architect` whenever the design includes a migration, whichever architecture reviewer was chosen.

Each reviewer returns findings classified **blocking**, **should-fix** or **noted**.

---

# PHASE 7: UPDATE THE DESIGN

Revise `design-<cluster-id>.md` against the findings. Every blocking finding is either resolved in the design or rejected with a reason recorded in the file.

If the reviews invalidate the root cause, return to Phase 4. Cap: one return per cluster, then escalate.

### GATE 2: STOP IF HIGH-STAKES

If the design touches **schema or migrations, auth, or payments-adjacent code**, stop and wait for explicit approval before implementation. No exceptions, however low-risk the repo is.

---

# PHASE 8: BUILD

```
git switch <main branch> && git pull
git switch -c fix/<cluster-id>-<short-slug>
```

Branch from the recorded base commit every time. Never stack on a previous cluster's branch.

Order of work:

1. Commit the failing tests from Phase 2 first, as a separate commit.
2. Implement the fix per `design-<cluster-id>.md`.
3. Run the tests. They must now pass.
4. Run the full existing suite. No regressions.

If the tests do not pass after implementation, that is a design failure, not an implementation failure. Return to Phase 5 (subject to the redesign cap). Do not patch until green.

Stage selectively. Never `git add -A`.

**Routing.** Delegate the implementation to `implementer`. Pass it the branch name and the path to `design-<cluster-id>.md`, nothing else. It reads the design fresh and implements exactly what is in it. Anything the design does not specify is out of scope. It returns a question rather than inventing a decision.

The conductor decides whether the returned diff satisfies the design. The delegate does not.

---

# PHASE 9: GATE

Push the branch, open the PR as a draft, then run the `/gate` command against it.

```
git push -u origin fix/<cluster-id>-<short-slug>
gh pr create --repo <repo> --draft \
  --title "fix: <cause summary> (refs #N, #N)" \
  --body-file <generated>
```

The PR body opens with the template's `## Delivery tier` section: a `Tier: N - <reason>` line and, for Tiers 2 and 3, `Design:` and `Reviews:` lines. The CLI does not apply the template, so write it in. Then include the root cause, the fix, the issues covered (`refs #N` for each, never a closing keyword, so a bug stays open for retest), migrations, environment variable changes and the verification approach.

---

# PHASE 10: RESOLVE GATE FINDINGS

Fix every **critical** and **high** finding, and every finding the gate marks as auto-recommended. Leave medium and low as PR comments for human judgement.

Re-run the gate after each round. Cap at `--max-gate-cycles` (default 3), then stop and escalate rather than grinding.

**If a finding needs a design change rather than an implementation change**, return to Phase 5. Cap: one redesign per cluster, then escalate with the finding unresolved and flagged in the run summary. Do not patch around a design flaw.

**Routing.** This phase splits on purpose. The conductor reads each gate finding and classifies it: implementation fix, design change or leave for a human. Only the implementation fixes go to `implementer`. The call between implementation and design is the whole value of this phase and must not be delegated. A delegate asked to fix a finding will always find a way to fix it locally, which is how design flaws get papered over.

---

# PHASE 11: READY, DO NOT MERGE

```
git push
gh pr ready <pr-number>
```

Mark the PR ready for review. **Do not merge. Do not deploy. Do not smoke test production.** That is a human decision made against the release plan in Phase 13.

Update `plan.md`: set the cluster status to `pr-ready`, with the PR number and final file set.

---

# PHASE 12: NEXT CLUSTER

Compact the session, then return to Phase 4 for the next-ranked unworked cluster, up to `--max-clusters`.

### Parallel mode (`--parallel`)

Fan out only clusters that meet **all** of these:

- File sets are disjoint per the Phase 3 overlap analysis.
- Neither touches migrations.
- Neither triggered Gate 2.

**Hard rule: no two concurrent branches may contain migrations.** Timestamped migration file names collide, and the order is ambiguous once both land. Any cluster with a migration runs alone, in sequence.

The mechanism is git worktrees, one per cluster. The default is sequential. Do not enable parallel on a repo until at least one clean sequential run has finished.

---

# PHASE 13: RELEASE PLAN

Once all clusters are at `pr-ready` (or blocked or escalated), assemble the release plan.

**Merge order.** For each pair of PRs, compute the file overlap. Produce:

- PRs that can merge in any order (no overlap with anything)
- PRs with ordering constraints, stated as "merge #A before #B" with the overlapping files named
- For each constrained PR, whether it needs a rebase after its predecessor lands

**Migrations.** For every PR that touches migrations:

- The migration file name and what it does
- Its required position in the sequence
- Whether it needs renumbering after another migration lands first
- Whether the down migration has been tested

**Environment variables.** Diff every new environment variable reference introduced across all branches against the example env file and the current hosting configuration.

- New variables, which PR introduces each and what breaks if it is missing
- Changed variables, with the old and new values or format
- Which environments need each: development, preview, production
- An explicit flag if any PR will fail at build or runtime unless a variable is set first

---

# PHASE 14: RUN SUMMARY

Write `audits/backlog-sweep-<date>.md`:

- Issues triaged, by bucket, with counts
- Clusters worked, with issues closed per cluster and the outcome (`pr-ready`, `blocked` or `escalated`)
- Any guardrail or cap that fired, and why
- Root cause splits or redesigns that occurred
- The full release plan from Phase 13
- The remaining open queue count and a suggested `--max-clusters` for the next run

Print the release plan to the session as well. It is the point of the run.

---

# GUARDRAILS

| Cap | Default | Behavior at cap |
|---|---|---|
| `--max-clusters` | 3 | Stop cleanly. Do not roll into a new batch. |
| `--max-issues` | 25 | Triage only what fits. Report the remainder. |
| `--max-gate-cycles` | 3 | Stop, escalate, leave the PR in draft. |
| Redesigns per cluster | 1 | Escalate with the finding unresolved. |
| Root-cause returns per cluster | 1 | Mark blocked, move on. |

---

# RULES

1. Nothing is closed as "already fixed" without a test that passes against the current main branch.
2. Schema, auth or payments-adjacent design: stop at Gate 2 and wait for explicit approval.
3. Never merge. Never deploy. This command produces PRs and a plan, nothing else.
4. Never design against an unconfirmed root cause. Blocked is an acceptable outcome. Guessing is not.
5. Every branch comes off the recorded base commit. No stacking.
6. Stage selectively, even inside an automated run.
7. One repo per invocation.
8. Every cap above is a hard stop, not a soft target.
9. First run on any new repo: `--dry-run`, then `--max-clusters 1`.
10. Delegates produce outputs. The conductor makes every decision. Never delegate a judgement call to buy speed.
11. If a connection or tool is not available (for example the hosting platform for Phase 13), report BLOCKED for that check. Never infer success.

## Before you leave this running

Answer these five questions first. Put the answers at the top of your run summary.

1. What does "done" mean for this run?
2. How will you check it yourself? Name the tests or checks.
3. What may you touch, and what is off limits?
4. What stops you? For example: the same check fails three times, a cost limit is reached or a Tier 3 trigger appears.
5. Who signs off before anything ships?

If this runs unattended, set a turn limit and a spend limit so a stuck run stops by itself.

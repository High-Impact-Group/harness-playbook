---
description: Concise recap of a finished problem-solving arc, issue, root cause, fix, why it's right, what's next
argument-hint: '[issue-number | pr-number | branch-name] (optional, defaults to current branch)'
model: claude-sonnet-5-5
---
# /recap
Usage: run it for the current branch, or name a specific issue, PR or branch.

I am picking this back up after stepping away. Reconstruct the arc of this fix and brief me. Fast. No war and peace.

## Scope

- Working branch: `$ARGUMENTS` if given, otherwise the current branch.
- Base branch: the main branch, or the repository's actual default if different.
- Commit range: the merge base of the base and the branch, through the branch head.

## Gather evidence, in this order

Git and files are the source of truth. This conversation may not span the whole arc, so do not rely on it alone.

1. The commit log for the range, with bodies. It is the actual sequence of events, in the author's own words.
2. The linked issue or PR, if a number can be found (in the argument, a branch name, or a commit that references one) and GitHub tooling is available. Pull the title, description and review comments. This is usually the clearest statement of the original problem and of any decision recorded in review.
3. Audit reports in the relevant window (pre-merge, code review, security review and so on). They are the evidence for "why this is the right fix". Do not assert confidence you have no report to back.
4. The project's context log, for recent entries on this work. It holds narrative the commits do not.
5. This session's own history, if relevant. It is supplementary, not authoritative.

If something is missing (no linked issue, thin commit messages, no review records), say so in one line. Do not fill the gap.

## Output

Use this structure and nothing more. About 200 words in total.

**Started with.** The original issue or symptom, in one or two lines.

**Root cause.** One or two lines. If the first hypothesis was wrong, name it and what corrected it.

**The fix.** What changed and where, in one or two lines.

**Why this is the right fix.** Two to four bullets of actual evidence: tests, reviews, that it addresses the cause and not the symptom, alternatives rejected and why. Thin evidence gets said plainly.

**Progress.** The full ladder below, every stage, in order. Each line: marker, stage, then a few words of evidence or of what is blocking. Omit no stage, so the gaps stay visible.

```
[x] done   [~] partial   [ ] not started   [-] not applicable
```

1. Issue analyzed: the problem and scope are understood, not just restated.
2. Root cause identified: the cause is established, not a symptom patch.
3. Solution designed: an approach was chosen before building, and alternatives were considered.
4. Human gate: only if schema or migration, auth, or payments are touched. Mark `[-]` if none are. Never mark done without an explicit approval you can point to.
5. Built: the implementation is complete against the design.
6. Tests: unit and integration tests are written and passing.
7. Code review: the code review routine, a review role or a human reviewer.
8. Pre-merge checks: the pre-merge routine, covering migrations, environment variables and green CI.
9. Merged: a human action, never automated.
10. Deployed and verified: the deploy succeeded and a smoke test hit the real path.

Mark from evidence only. If a stage cannot be evidenced, it is not started or partial, with the reason. It is not done.

**Decisions made.** One line each: the decision and why. Skip anything trivial.

**Where to now.** The first stage that is not done, stated as a concrete next action.

## Rules

- Synthesize. Do not transcribe. No pasted diffs, no full commit log, no code blocks unless one line is genuinely load-bearing.
- Do not infer intent you cannot source. A named gap beats a guessed one.
- After the recap, ask once whether to append a one-line summary to the project's context log. Do not do it automatically.

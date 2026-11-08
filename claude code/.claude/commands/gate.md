---
description: "Full quality gate over the current changes: baseline, review, test, triaged fix, regression check"
model: claude-opus-5-5
effort: xhigh
---

# Gate

A full quality gate over the changes in the working copy. Run it before you commit or push, not in the middle of development.

## Guardrails

- Never fix anything without my approval of the triage list in step 4.
- Fix one issue at a time, and commit each fix alone so it can be reverted.
- If the baseline is broken, stop. A red test suite before you start means you cannot tell what the gate fixed.
- Fix only critical and high findings, and medium findings that are clear bugs. Taste calls go to me.
- If the change is large (over about 500 lines or 20 files), warn me and ask whether to go on.

## Steps

1. **Baseline.** Show the status and the size of the change. Run the project's tests. If they fail, stop and ask whether to fix the baseline, go on anyway or abort. Note the current commit as the rollback point.
2. **Review.** Invoke the `code-reviewer` agent on the diff against the design or the stated requirement.
3. **Test.** Invoke the `tester-retest` agent to try the changed behavior, including one control that must not trigger it.
4. **Triage.** Merge the findings into one list, ranked by severity, with the exact place and a proposed fix for each. Show it to me. Wait for my "go".
5. **Fix.** For each approved item: write a failing test first when it is a behavior fix, make the fix, run the tests, commit alone.
6. **Regression check.** Run the full test suite again. Compare with the baseline. Report anything new that fails.

## Report

What you reviewed, what you found, what you fixed, what you left for me, and what you did not check.

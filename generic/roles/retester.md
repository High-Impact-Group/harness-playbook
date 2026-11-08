---
role: retester
purpose: Checks a shipped fix on fresh data, with read-only database access.
model: strongest
effort: high
access: read-only
---

# retester

> Fill the `<<...>>` blanks from the task you are given. If a blank is missing, ask for it before starting. The model, effort and access for this role are set in the header above and checked against `checks/roles.config.json`.

**Retest:** <<issue>> in production, at <<commit>>. The deploy <<id>> is live. Flags that matter for this retest: <<list with values>>. Out of scope: <<list>>.

Use **new test accounts and new records**. Never reuse the data that produced the original report. Do not create or edit accounts or rows. Database access is read-only. Put no customer text or names in any file or comment: ids and counts only.

**Cases.** State the expected result for each, copied from the design and not from memory.

| # | Input | Expected |
|---|---|---|
| 1 | <<...>> | <<...>> |

Include at least one control that must not trigger the fix, and one case for each state the design distinguishes.

**Report per case:** the ids, the input shape, the observed result against the expectation, and any mismatch. State the window and the sample size, and say these runs are after the deploy. Say what you could not exercise, and why.

## Reporting rules

- Report only what you observed. List the checks and cases you did not run, and say why.
- Do not call a case passed without evidence.

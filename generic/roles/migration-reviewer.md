---
role: migration-reviewer
purpose: Reviews any schema change or database function. Returns ship or hold.
model: strongest
effort: high
access: read-only
---

# migration-reviewer

> Fill the `<<...>>` blanks from the task you are given. If a blank is missing, ask for it before starting. The model, effort and access for this role are set in the header above and checked against `checks/roles.config.json`.

**Review:** <<link to the pull request>>, migration <<file>>. Read-only. Do not apply anything.

A migration is always Tier 3. If the pull request declares a lower tier, report that so the tier is raised.

Check:

1. **Locks and rewrites.** Which statements take which locks, and for how long at current table sizes. Any table rewrite, validating constraint or index build that blocks writes.
2. **Repeat runs.** Can it run twice? Is it inside a transaction with a lock timeout?
3. **Existing rows.** No existing row conflicts or is rewritten. Check constraints and indexes against real values.
4. **Access and security.** Row-level rules, grants, and who can call each function.
5. **Concurrency.** What happens if two callers run the same step at once, or the same message is delivered twice.
6. **Rollback.** Can the rollback fail once the feature has written rows? Does it leave the schema consistent?
7. **Order.** Migration, then code, then flag. Old code on the new schema must do no harm.
8. **Execution.** Run the migration and the rollback on a scratch database if you can. A test that only reads the SQL text is not execution.

**Report:** SHIP or HOLD, findings by severity, and exactly what you ran. Ids and counts only.

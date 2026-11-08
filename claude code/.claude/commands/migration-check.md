---
description: "Reviews pending SQL migrations for safety: locks, destructive changes, RLS, backfills, rollback and ordering. Report only."
argument-hint: '[optional: migration file or PR number] (defaults to migrations changed vs main)'
model: claude-opus-5-5
effort: xhigh
---
# /migration-check

Review pending SQL migrations for safety. Report only. Never apply anything.

Input (from `$ARGUMENTS`): a migration file or a pull request number. If it is empty, review every migration file changed against the main branch.

## Step 1: Collect

List the migration files in scope and what each does. Compare them with the migrations already applied to the database. Look for ordering or timestamp conflicts.

## Step 2: Check each migration

- **Destructive changes.** DROP, TRUNCATE, a column type change, adding NOT NULL, a rename. Is the data loss intended? Is there a backup or an expand-and-contract path?
- **Locking and size.** Operations that take long locks on large tables: an index built without the concurrent option, a table rewrite, a NOT NULL column with a default on an older database version. Estimate table size where you can.
- **Backfills.** Are they batched? Idempotent? Safe to run twice?
- **Row-level security and grants.** Every new table has row-level security on, with policies. No policy that allows everything on user data. Every elevated-privilege function sets its search path. Grants to anonymous or signed-in roles are deliberate. Run the database's advisor or lint checks and relate any findings to this change.
- **App compatibility.** Can the deployed code run against the new schema? Can the new code run against the old schema? If not, the deploy order matters.
- **Rollback.** Is there a reverse path, and is it realistic?

For a deeper review of data design, ask the `database-architect` agent to review that part.

## Step 3: Report

Write `docs/audits/migration-check-YYYY-MM-DD.md`. Include a table with one row per migration: migration, risk (LOW, MEDIUM or HIGH), finding and fix. End with a verdict: SAFE TO APPLY, APPLY WITH CHANGES or DO NOT APPLY. List the exact order in which to apply the migrations and the order in which to deploy the app.

Remind the owner that schema changes need explicit approval before anyone applies them.

## Guardrails

- Never apply, roll back or edit a migration.
- Never run a statement that changes data. Read-only queries only.
- If you cannot reach the database to check what is applied, say BLOCKED for that check. Never infer success.

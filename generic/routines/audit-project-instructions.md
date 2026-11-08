# audit-project-instructions

Audit the project instructions file against the codebase for stale, missing or inaccurate claims. Report only.

Audit the project instructions file against the codebase. Report only. Do NOT edit any file.

Check:

1. **Dependencies.** The package manifest against the file's claims. Libraries documented but not installed, or installed but not documented.
2. **Environment variables.** Every environment variable the code reads against what the file mentions. Missing or undocumented ones.
3. **Counts.** Any number in the file (ingesters, scheduled jobs, tools, migrations, tables, scripts). Check each against the real file or directory count.
4. **File paths.** Every specific path the file references. Does it exist?
5. **API routes and scheduled jobs.** Listed routes and schedules against the hosting config and the route structure.
6. **Model names.** Model strings in the file against what the code actually calls.
7. **Pattern claims.** "All API routes use schema validation", "all queries go through the typed client", and similar. Spot-check for obvious violations. Do not be exhaustive.
8. **Gotchas.** Each entry in any gotchas or known-issues section. Is it still true?

For each finding, output:
- The section or line (quote the text)
- What the code actually shows
- Severity: HIGH (actively wrong, will mislead), MEDIUM (stale or outdated), LOW (cosmetic, count drift)
- A suggested fix, stating whether the fix belongs in the DOCUMENTATION or in the CODE. Flag ambiguous cases for human review.

Group findings by severity. If you find 15 or more issues, say the file may need a full rewrite rather than patch fixes.

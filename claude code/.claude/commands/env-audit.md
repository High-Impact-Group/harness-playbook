---
description: Audits environment variables for mismatches between what the code expects, what's documented and what's set.
model: claude-sonnet-5-5
---
# /env-audit

Audit every environment variable in this project. Find the mismatches between what the code expects, what is documented and what is set. Report only. Do not change the example file without asking.

## Steps

1. **Extract from code.** Search the whole codebase for every environment variable read (for example `process.env.NAME`, `os.environ`, `import.meta.env`). Record the name, the file and whether it is read in server code or client code.
2. **Extract from the example file.** Read the example environment file (`.env.example` or similar) and list every variable in it.
3. **Extract from the docs.** Read the project instructions file and the README. List every variable they mention.
4. **Extract from deploy config.** If the project has hosting or CI config that names variables, list those too.
5. **Cross-reference.** Build one matrix.

   | Variable | In code | In example file | In docs | Required | Notes |
   |---|---|---|---|---|---|

6. **Flag these:**
   - In code but not in the example file. A new developer will not know to set it.
   - In code but not in the docs. Undocumented.
   - In the example file but not in code. Stale. Candidate for removal.
   - Variables exposed to the browser (for example a public prefix) that look like secrets.
   - Variables with no default. Does the app crash when it is missing, or fail silently?
   - Variables read in client code that lack the public prefix the framework needs.
7. **Check for security problems.**
   - A secret-looking variable that is exposed to the browser.
   - A hardcoded fallback that looks like a real credential.
   - A variable read directly all over the code instead of through one typed config module.
8. **Draft an updated example file.** Include every variable the code reads, grouped by service, with a comment on what each does and a clear mark for required or optional. Never put a real value in it.

## Output

Save the report to `docs/env-audit.md`. Show the drafted example file in your reply. Ask before you overwrite the existing example file.

## Guardrails

- Never print the value of a real secret. Name the variable only.
- If you cannot tell whether a variable is required, say so. Do not guess.

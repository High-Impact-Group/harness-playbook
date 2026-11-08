# code-review

Thorough review of the current staged and unstaged changes against quality, correctness and security criteria.

Do a thorough review of the current changes, staged and unstaged. Look at what has changed, then assess it against the criteria below.

## Review scope

First run:
```bash
git diff --stat
git diff
```

If there are no uncommitted changes, review the most recent commit:
```bash
git log -1 --stat
git diff HEAD~1
```

## Review criteria

### Correctness
- Logic errors, off-by-one mistakes and unhandled edge cases.
- Null and undefined handling. Are optional values checked?
- Async correctness: missing awaits and unhandled rejections.
- Type safety. Are the types accurate, or are there escapes to `any`?

### Security
- Injection risks, such as raw queries without parameters.
- Missing or wrong access policies on new database tables.
- Secrets or keys written into the code instead of read from environment variables.
- Missing input validation on API routes.
- Missing rate limiting on public endpoints.
- Cross-site scripting vectors in rendered content.

### Architecture and patterns
- Does the change follow the project's established patterns? Check the project instructions file and the existing code.
- Is business logic in the right layer (server or client, route handler or utility)?
- Do new database queries go through the project's typed client?
- Are calls to AI services made correctly: server-side, rate-limited and traced?

### Performance
- N+1 query patterns and needless database round trips.
- Large fetches without pagination.
- Missing loading states or boundaries for async components.
- Client-side code that could run on the server.

### Maintainability
- Do functions or components do too much?
- Is there duplicated logic that should be extracted?
- Are names clear and descriptive?
- Are there magic numbers or strings that should be constants?

## Output format

Write a structured review:

1. **Summary:** One paragraph on the changes and their overall quality.
2. **Critical:** Must-fix issues: bugs, security problems, data loss risks.
3. **Suggestions:** Should-fix improvements in patterns, performance and clarity.
4. **Nits:** Minor style or preference points. Include them only if there are few critical items and suggestions.
5. **What's good:** Name well-written code and smart decisions.

Be direct and specific. Give the exact file path and line number. Suggest a concrete fix, not vague advice.

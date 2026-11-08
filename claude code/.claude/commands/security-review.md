---
description: Comprehensive security review of the whole codebase, authn/authz, secrets, injection, access control and more.
argument-hint: '[optional: path or area to focus on]'
model: claude-opus-5-5
effort: xhigh
---
# /security-review
Perform a comprehensive security review of this project. Examine the full codebase, not just recent changes. Report only.

## Scope

`$ARGUMENTS` is an optional path or area (for example an API directory, or auth) to focus on. If given, go deepest there but still report any critical issue found elsewhere. If empty, review the whole codebase.

## Authentication and authorization

- Identify which auth system the project uses, and check it is implemented correctly.
- Check that every API route validates the user session before it does anything.
- Look for routes that should be protected and are not.
- Check that middleware protects the authenticated routes.
- Check for broken access control: can user A reach user B's data?
- Look for privilege escalation paths.
- For custom tokens: check signing secret strength, token expiry and cookie flags (httpOnly, secure, sameSite).
- For a session library: check the session strategy, CSRF protection and callback URL validation.
- For a hosted auth service: check cookie handling on the server and the redirect URL allow list.

## Row-level security

- List every database table and its row-level security status. Flag any table where it is off.
- For each policy, check that it scopes to the signed-in user or the right team or organization.
- Look for overly permissive policies, such as an always-true rule on a sensitive table.
- Check that the database's privileged key is never used in browser code.
- If one database is shared between products: check table isolation and policies.
- If an ORM is used instead of the database SDK: check that equivalent access controls exist.

## Input validation and injection

- Check that all API route inputs are validated with a schema.
- Look for raw SQL or string interpolation in queries, including ORM raw queries.
- Look for cross-site scripting: user content rendered without sanitizing.
- Look for server-side request forgery: user-supplied URLs fetched on the server, especially outbound webhook URLs.
- Check file upload handling if present: type validation and size limits, especially document uploads for retrieval pipelines.
- Check prompt injection exposure where user input reaches an AI call: is user input kept apart from system instructions, and is model output validated before it is used?

## Secrets and configuration

- Scan for hardcoded keys, tokens and passwords in source files.
- Check that local environment files are ignored by git.
- Check that variables exposed to the browser hold only non-sensitive values.
- Check that the public and privileged database keys are used correctly.
- Check for secrets in client bundles (inspect browser components).
- If the payments provider is called with raw HTTP: check the secret key is used only on the server.
- Check that all AI service keys are server-side only.

## API security

- Check rate limiting on all public endpoints, and whether it is in-memory or persistent.
- If the limiter is in-memory (resets on cold start), record the risk.
- Check for missing or overly permissive cross-origin settings.
- Look for endpoints that accept unbounded input.
- Check that all AI calls are server-side and rate-limited.
- Check that webhook endpoints verify signatures.
- If outbound webhooks exist: check for protection against private and reserved IP ranges.
- Check secret validation on all scheduled-job routes.

## Bot protection and headers

- Check for bot protection on public forms, if applicable.
- Check the content security policy headers.
- Check the strict transport security configuration.
- Check for timing-safe comparison on bearer token checks.

## Dependencies

- Run the dependency audit. It is read-only. Never run the auto-fix. Report the findings.
- Flag dependencies with known critical vulnerabilities.
- Check for unnecessary dependencies that widen the attack surface.
- Check that the lockfile is committed and current.

## Data exposure

- Check API responses for leakage: full user objects, internal IDs.
- Check that error messages do not expose stack traces or internal paths in production.
- Look for log statements that print sensitive data.
- If scraping or browser automation is used: check that no credentials are logged.

## Output format

1. **Risk rating:** Critical, High, Medium or Low.
2. **Critical vulnerabilities:** Exploitable issues that need immediate action.
3. **High risk:** Serious issues to fix before the next deployment.
4. **Medium risk:** Issues to address in the next sprint.
5. **Low risk:** Hardening for defense in depth.
6. **Checklist summary:** Category, check, status (Pass, Fail or N/A), notes.

For each finding give the exact place, how it could be exploited, and the fix. Do not report a finding you did not see in the code.

Save the report to `docs/security-review.md` in the project.

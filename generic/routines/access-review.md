# access-review

Map who can access what, find authorization gaps, bypass paths and privilege-escalation risks, and verify least privilege.

You may be given an optional path, route group or role. If so, scope the work to it, but still flag any cross-cutting problem you find. If not, cover the whole project.

## Authentication model

- Identify which auth system the project uses (a hosted auth service, a custom token scheme or an auth library). Check cookie flags, token expiry, session refresh, provider configuration and callback URL validation.
- Document the full flow: signup, login, session, refresh, logout.
- Look for bypass paths: routes reachable without login that should not be.
- Check password reset and email verification flows.
- If bot protection exists, confirm it covers every public auth-adjacent form.

## Role and permission model

- Map every role in the system and what each can do. Build a Role x Action matrix.
- Check that roles are enforced at every layer that exists: middleware or route guards, API handlers, database row-level policies, and query-level checks if an ORM is used.
- Look for inconsistencies. A common one: the UI hides a button but the API does not check the role.
- Check how roles are granted and who can change them.
- If the product is multi-tenant, verify tenant isolation at every layer.

## Data access boundaries

- For each table, document who can select, insert, update and delete.
- Check that one tenant cannot read another's data.
- Check API responses for fields the caller should not see.
- Check access control on uploaded files and documents.

## API access control

- List every API route with its auth requirement: public, authenticated, admin or scheduled job.
- Flag any route with no explicit access control.
- Verify the secret check on every scheduled-job route.
- If API keys exist, check key validation and scope.
- Check inbound webhooks: are signatures verified, or is the endpoint open?
- Check that rate limits match access levels.

## Plan and tier gating

- Document the plans and what each can reach.
- Verify gating is enforced on the server, not only in the UI.
- Look for bypass paths: can a free user reach a paid feature with a direct API call?
- If there is a trial, check expiry at access time, not only at display time.
- Check that payment-provider webhooks sync subscription changes correctly.

## Admin and privileged access

- Document admin-only routes and confirm each checks the admin role.
- Look for debug or development endpoints left in production code.
- Check that admin endpoints fail closed when configuration is missing.
- Look for hardcoded admin addresses or bypass flags.
- Look for environment flags that switch off auth checks.

## Third-party and integration access

- For each external service, document what data it can see: prompts sent to an LLM provider, content sent for embedding, audio sent for transcription, CRM data synced both ways, events sent to a job queue, customer data held by the payments provider.
- Confirm the database service-role key is used only in trusted server-side code.
- Check tool and plugin configurations for overly broad permissions.

## Output format

1. **Access model summary.** A diagram or table of roles, permissions and data boundaries.
2. **Critical gaps.** Failures that could allow unauthorized access.
3. **Inconsistencies.** Access enforced at one layer but not another.
4. **Recommendations.** Specific changes that tighten access.
5. **Access matrix.** Resource | Public | User | Team | Admin | Scheduled job | Service role | Status.

Save the report to `docs/access-review.md`.

## Guardrails

- This is a review. Do not change application code.
- Cite the exact file and function for every finding.
- Mark anything you could not verify as "not verified". Do not infer that a check exists.

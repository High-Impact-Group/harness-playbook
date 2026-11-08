# resilience-review

Assess how the app handles failure, degrades gracefully and recovers: error handling, boundaries, silent failures and timeouts.

Perform a comprehensive resilience review. Assess how the application handles failures, degrades gracefully and recovers from problems. Report only.

## Scope

The argument is an optional feature or external dependency to focus on. If given, trace its failure modes end to end. If empty, review the whole project.

## Error handling

- Check that all API routes have error handling with meaningful responses.
- Check that error boundaries exist for key component trees.
- Look for unhandled promise rejections: a missing catch, or an await with no error handling.
- Check that user-facing error messages help without exposing internals.
- Look for silent failures: catch blocks that swallow errors without logging. For a deep sweep, ask the silent-failure-hunter role.
- Check that API routes set a maximum duration, so nothing hangs without end.

## External service failures

For each external dependency the project uses, assess what happens when it is unavailable.

### AI services
- When the model provider is down or rate-limited: is there a fallback, a queue or graceful degradation? Do chat endpoints return a useful error? Do scheduled generators handle partial failure?
- When the embedding provider is down (if used): do embedding operations fail gracefully? Is the retrieval pipeline resilient to embedding failures?
- When a speech service is down (if used): can voice input fall back to text? Do speech failures block the user?

### Infrastructure
- When the database is down: does the app show a useful error, or a blank screen? If the instance is shared, does one project's load affect another?
- When a function times out: are long operations split into batches that stay under platform limits?
- When an in-memory rate limiter resets on cold start: is the real cost gate (persistent per-user caps) enough?

### Third-party services
- When the payments provider is unavailable: can users still use non-payment features? If raw HTTP calls are used with no SDK, is error handling robust without SDK helpers?
- When the email service is down: do failures block user actions, or fail silently? Are critical emails (sign-in links, alerts) retried?
- When a chat, CRM or event-queue integration is down (if used): do bot or sync failures block core actions? Is data queued, dropped or replayable?
- When a data feed is down (if used): does the product serve stale data with a clear warning?
- When bot protection is down (if used): does form submission still work? Is there an off-switch that fails safe?

### Data sources (ingestion-heavy projects)
- For each ingester: what happens when the source API errors, rate-limits or changes format?
- Are ingesters independent? Does one failure stop the others?
- Is there alerting when ingestion fails?

## Retry and timeout patterns

- Check for timeouts on all external API calls.
- Check for retries with exponential backoff on transient failures.
- Look for calls that could hang forever.
- Check that retries are idempotent. Retrying a payment, an email or a webhook must not duplicate it.
- Check that each route's maximum duration fits its work.
- Check scheduled-job timeouts. Are batches split to fit?

## Data integrity

- Check for race conditions in concurrent writes.
- Check for database transactions where several writes must succeed or fail together.
- Look for partial failure: a record created but the webhook, email or sync fails.
- Check for cleanup of orphaned data (scheduled jobs or cascading deletes).
- If the client stores data first and syncs later: what happens when the sync fails?
- If one database is shared between products: check for cross-contamination risk.

## Rate limiting and load

- Check rate limiting on all public endpoints.
- Record whether the limiter is in-memory (resets on cold start) or persistent.
- Check what happens at the limit: a proper 429 with a retry-after header?
- Look for endpoints open to abuse: expensive AI calls, bulk operations.
- Check that list endpoints enforce pagination.
- Check per-user daily caps on AI features. Are they stored in the database or in memory?

## Deployment and recovery

- Check that the hosting platform supports instant rollback.
- Check for a database migration rollback strategy.
- Look for feature flags that can disable a problem feature.
- Check that health check endpoints exist.
- Check that missing critical environment variables produce a clear startup error, not a silent failure.
- If a CI pipeline exists: what happens when it fails mid-run?

## Monitoring and alerting

- Check whether scheduled jobs send heartbeats to a monitor (if applicable).
- Look for error reporting beyond console logs. If none is configured, recommend running the add-error-tracking routine.
- Check for scheduled-job logging: a log table, an admin view.
- Check there is a way to detect elevated error rates, slow responses, failed scheduled jobs and stale data.

## Graceful degradation map

For each major feature, answer: if the backing service fails, does the user:

- See a helpful error message? (the minimum acceptable)
- Get a degraded but working experience? (good)
- See no visible impact? (excellent)

## Output format

1. **Resilience rating:** Fragile, Basic, Robust or Highly Resilient.
2. **Single points of failure:** Components where one failure breaks everything.
3. **Critical gaps:** Missing error handling or failure modes that cause data loss or crashes.
4. **Degradation map:** Feature, dependency, current failure behavior, target behavior, priority.
5. **Recommendations:** Specific changes, ordered by impact.
6. **Architecture diagram:** A Mermaid diagram showing dependencies and failure boundaries.

Save the report to `docs/resilience-review.md` in the project.

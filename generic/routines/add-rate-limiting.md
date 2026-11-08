# add-rate-limiting

Replace the in-memory rate limiter with a shared-store limiter, with an in-memory fallback.

Replace the in-memory rate limiter with one backed by a shared store (a hosted key-value cache). Limits then survive serverless cold starts and are shared by all concurrent instances.

## Step 1: Install

Install the rate-limit library and the cache client for the chosen store.

## Step 2: Create the cache client

Create one small module that returns a singleton client. It reads the store's URL and token from environment variables. If either is missing, it returns null. It must not throw.

## Step 3: Create the limiter

Create one module that:
- Builds a sliding-window limiter per name, request count and window, and caches the instances.
- Exposes one `checkRateLimit(name, identifier, config)` function that returns success, limit, remaining and reset.
- When the store is not configured, falls back to the existing in-memory limiter. Local development must keep working without the store.
- If the store fails at runtime, falls back to the in-memory limiter. Do not block the request.

## Step 4: Replace existing calls

Find every call to the old limiter in API routes. Replace it with `checkRateLimit`. On a denied request, return 429 with `Retry-After` and `X-RateLimit-Remaining` headers.

## Step 5: Defaults per route type

Use these as defaults, and adjust to the project's existing limits:

| Route type | Limit | Window | Identifier |
|---|---|---|---|
| Public pages and health | 60 | 1 minute | IP |
| Auth (login, signup, magic link) | 5 | 1 minute | IP |
| Password reset | 3 | 1 hour | IP |
| Contact and demo forms | 3 | 1 hour | IP |
| Authenticated API, general | 30 | 1 minute | User ID |
| AI chat | 10 | 1 minute | User ID |
| AI generation, non-chat | 20 | 1 hour | User ID |
| Webhooks | none | | Signature verified instead |
| Scheduled jobs | none | | Job secret verified instead |

Keep any per-user daily caps that live in the database. Those are plan-level gates, not infrastructure rate limits. Both should exist.

## Step 6: Keep the old limiter

Do not delete the in-memory limiter. It is the fallback.

## Step 7: Environment variables

Add the store's URL and token to the example environment file, with comments on where to find them.

## Step 8: Response headers

On rate-limited endpoints, send `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` on every response, not only on 429.

## Step 9: Verify

1. Build the project.
2. Without the store's variables, confirm in-memory limiting still works.
3. With them, confirm limits are enforced and persist across requests.
4. Make the store unreachable and confirm requests still go through on the fallback.

## Do not

- Remove the in-memory limiter.
- Rate limit webhook or cron endpoints. They are verified by signature or secret.
- Move plan-level daily caps into the cache.
- Block a request because the cache is down.

## Finish

Update the project instructions file: the shared store is configured, the fallback remains, the limits per route type, and the new environment variables.

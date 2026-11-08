---
description: Adds a health-check endpoint that verifies database, auth and core services are operational.
model: claude-sonnet-5-5
---
# /add-health-check

Add a health-check endpoint that verifies the core services are operational. If one already exists, extend it.

## What the endpoint checks

1. **Database.** Run a trivial query. Report connected, slow (over 2 seconds) or unreachable, with latency.
2. **Auth service.** Check that the auth provider is reachable, or that its configuration is loaded. Report operational, degraded or down.
3. **AI service (if used).** Do not make a real call: it costs money. Check only that the API key variable is set and not empty. Do the same for any other AI-related provider the project uses. Report configured or missing.
4. **Payments (if used).** Check that the secret key variable is set. Make no provider call.
5. **Email (if used).** Check that the API key variable is set.
6. **Scheduled-job auth.** Check that the job secret variable is set.

Skip any check for a service the project does not use. Read the project instructions file and the code to find out which are in use.

## Response format

```json
{
  "status": "healthy",
  "timestamp": "2026-01-01T10:00:00Z",
  "version": "1.0.0",
  "checks": {
    "database": { "status": "connected", "latency_ms": 45 },
    "auth": { "status": "operational" },
    "ai": { "status": "configured" },
    "payments": { "status": "configured" },
    "email": { "status": "configured" },
    "cron": { "status": "configured" }
  }
}
```

- Return 200 when every check passes.
- Return 503 when the database is unreachable.
- Return 200 with a degraded status for non-critical service problems.

## Configuration

- Set a short time limit on the route (10 seconds).
- Make the endpoint public, so a monitoring service can call it. It must not reveal secrets, key values or internal hostnames.
- Add a no-store cache header.
- If the project uses external heartbeat URLs, add a comment that this endpoint can be monitored directly instead.

## Finish

1. Build the project and confirm there are no errors.
2. Call the endpoint locally. Test one failure case, for example an unset variable, and confirm the status changes.
3. Add the endpoint to the project's route documentation and the project instructions file.

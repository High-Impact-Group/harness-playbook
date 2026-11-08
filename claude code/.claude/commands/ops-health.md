---
description: "Full operational health check across deployment, data, crons, logs and dependencies: the daily standup for a running product."
argument-hint: '[optional: area or service to focus on]'
model: claude-sonnet-5-5
---
# /ops-health

Run a complete operational health check on this project. This is the daily standup for a running product. Be systematic. Look across every layer for things that are broken, degrading or trending the wrong way.

Input (from `$ARGUMENTS`): an optional area or service. If one is named, run only the matching sections plus the header and Priority Actions. If it is empty, run every section.

This is the scheduled, written checklist. For a conversational dig into a RED item, ask the `ops-health` agent. For a known failure, use `/rca`. For correlating defects across several sources, use `/telemetry-sweep`.

Read the project instructions file first. Learn the architecture, the services, the scheduled jobs and the external dependencies. Then check each area below.

## 1. Deployment health

- Last successful deploy: when, which branch and who triggered it.
- Failed deployments in the last 24 hours.
- Current build time against the baseline. Is it creeping up?
- Deployments stuck "in progress".
- Environment variables set on the hosting platform, compared with the example environment file.

If the hosting platform is connected, query the deployment history directly. Otherwise use the recent git log and say what you could not check.

## 2. Scheduled jobs

Read the scheduler config. For each job:
- The schedule.
- The last run time and the last success or failure.
- Whether it has heartbeat monitoring.
- Whether it validates its secret.
- Whether it fits the platform's maximum run time.
- Whether it logs to a table for an audit trail.

Flag:
- Jobs that have not run in 24 hours or more (silent failure).
- Jobs with no error handling or alerting.
- Jobs that run longer than expected.
- Overlapping schedules that could cause contention.

## 3. Data freshness

For data-driven products, check every table that holds ingested data. Find the newest row time per table and the staleness against now. If the database is connected, run the queries. Otherwise name the tables that should have fresh data and say manual verification is needed.

Flag anything past its expected refresh interval:
- Daily data older than 26 hours.
- Weekly data older than 8 days.
- Hourly data older than 90 minutes.
- Real-time data older than 15 minutes.

## 4. External feed health

For every third-party data source:
- When was it last ingested successfully?
- Has the source format changed? Look for parser errors in recent logs.
- Does the source still return data in the expected shape?
- Has any feed silently stopped returning data?

## 5. API endpoints

Identify the critical endpoints: auth, AI, the most-used data endpoints and webhooks. For each, check the response-time baseline, the error rate in the last 24 hours, any 500s and any timeouts.

## 6. Error tracking

If an error tracker is configured:
- New error types in the last 24 hours.
- Errors that spiked against the baseline.
- Unresolved errors that keep occurring.
- Errors grouped by route.

If no error tracker is configured, flag that as a critical gap. You are flying blind.

## 7. Database health

For each table:
- Row count: growing, shrinking or stable?
- Tables that grow unexpectedly fast.
- Tables that should grow but do not.
- Connection pool usage, if visible.
- Tables approaching plan limits.
- Orphaned records: foreign keys that point at deleted parents.

Check the query performance of known-expensive queries, such as vector searches, dashboard aggregations and user dashboards.

## 8. Auth flow

- Can users still sign up? Look for recent signups.
- Can users still sign in? Look for recent sessions.
- Are auth errors spiking?
- Is session refresh working?
- Are the sign-in providers still authorized?

## 9. Payment flow

If payments are integrated:
- Webhook delivery status in the last 24 hours.
- Failed payment events.
- Subscription state mismatches: the provider says active and the database says inactive, or the reverse.
- Stuck checkout sessions.
- New subscribers, churned subscribers and payment failures in the last 24 hours.

## 10. Third-party quotas

Check usage against plan limits for the LLM provider, the embedding provider, any fast-inference provider, the database, the hosting platform, the email service and the job queue. Flag anything at 70 percent or more of its limit.

## 11. DNS and SSL

- The primary domain resolves correctly.
- Days until the certificate expires. Flag under 30 days.
- Subdomains are healthy.
- Redirects work.

## 12. Logs

If the logs are reachable:
- Unusual patterns in the last 24 hours.
- Repeated errors the error tracker does not catch.
- Timeout warnings on specific functions.
- Memory warnings.
- Cold-start frequency.

## 13. User activity

- Daily signups against the 7-day average.
- Daily active users against the 7-day average.
- Sudden drops or spikes that suggest something is broken.
- Subscription events in the last 24 hours.

## 14. Content integrity

For content-driven products:
- Are scheduled content generations (narratives, briefs, reports) running?
- Did any fail silently?
- Are the outputs non-empty and well formed?
- Do error messages appear inside generated content?

## 15. Git health

- Uncommitted changes on the main branch.
- Stale branches (no activity in 30 days or more).
- Open pull requests that are aging.
- Any force push to a protected branch.

## Output format

Save the report to `docs/health/YYYY-MM-DD.md` (today's date). Group it by severity:

### RED: fix today
Things that are broken or about to break. For each: what is wrong, the evidence (the specific data), the impact and the recommended action.

### AMBER: fix this week
Things that are degrading or nearing limits. Same format.

### GREEN: healthy
A brief confirmation that the major areas are fine. No elaboration.

### Trends
Week-over-week changes worth watching: signups, API costs, error rate and any metric moving the wrong way.

### Priority actions
The top three things to do today, in order.

### Notes
Anything notable that fits nowhere else.

## Header format

Start the report with:

```markdown
# Ops Health Check: <Product Name>
**Date:** <YYYY-MM-DD HH:MM, time zone>
**Status:** RED (critical) / AMBER (attention needed) / GREEN (healthy)
**Red items:** X
**Amber items:** Y
```

## Rules

- Be specific. "The LLM API cost is X month to date against Y last month" is good. "Costs are rising" is not.
- If you cannot check something (a tool is not connected, no error tracker), say so. Do not fabricate a green status. Say BLOCKED for that check. Never infer success.
- Never invent a metric. Every number comes from a source you read.
- Read-only. Never redeploy, re-run jobs, resolve error-tracker issues or write to the database from this routine.
- Do not mark anything RED unless it is broken right now.
- Do not bury the lede. If everything is fine, say so in five lines and stop.
- Compare with earlier reports in `docs/health/` to show trends.
- US English.
- Use the project's local time zone and say which one.

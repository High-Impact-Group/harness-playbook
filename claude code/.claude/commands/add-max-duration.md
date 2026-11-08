---
description: Adds maxDuration exports to every API route to prevent serverless function hangs.
model: claude-sonnet-5-5
---
# /add-max-duration

Add a `maxDuration` export (or the framework's equivalent route time limit) to every API route, so no serverless function can hang until the platform default.

## Process

1. List every API route file.
2. Read each route to see what it does before you pick a duration.
3. Add the export if the route has none. Place it after the imports:

```typescript
export const maxDuration = 15; // seconds, adjust per the guidelines below
```

## Duration guidelines

| Route type | Seconds | Reason |
|---|---|---|
| Health check | 10 | Simple ping |
| Database read | 15 | Quick query |
| Database write | 15 | Quick mutation |
| Auth routes (login, signup, callback) | 15 | Fast operations |
| Payment webhook | 30 | May need several database writes |
| Checkout or billing-portal redirect | 15 | Redirect generation |
| AI chat (streaming) | 120 | Long conversation |
| AI generation (single completion) | 60 | One model call |
| AI with tools (several rounds) | 120 | Several model calls |
| Embedding or retrieval work | 60 | Batch embedding can be slow |
| Scheduled job: data ingestion | 120 | External fetching |
| Scheduled job: AI generation in sequence | 300 | Several model calls in a row |
| Scheduled job: email sending | 60 | Batch delivery |
| Scheduled job: cleanup | 60 | Bulk deletes |
| File upload or parsing | 60 | Parsing documents |
| Export or download | 30 | Data compilation |
| Other inbound webhook | 30 | Processing and forwarding |

## Rules

- Any route that calls an LLM or speech provider gets at least 60 seconds.
- Any route that streams gets at least 120 seconds.
- Before you go above 300 seconds, check the hosting plan's limit and settings. If a route needs more than about 300 seconds, move the work to a queue or split it. Do not raise the limit.
- Add a short comment when the choice is not obvious.
- Do not change a `maxDuration` that is already set.
- Do not change any other code in the route files.

## Verify

Build the project and confirm no new errors.

## Report

A table of every route and the duration you assigned, and the routes you left alone.

# performance-review

Review the whole codebase for performance bottlenecks in rendering, data access, AI calls, caching, functions and the database, and report fixes.

Perform a comprehensive performance review of this project. Examine the full codebase for bottlenecks, inefficiencies and optimization opportunities. Report only. Do not change code.

## Scope

The argument optionally names one or more sections below to focus on, or a path. If it is empty, review every section.

## Rendering and bundle

- Find components that run in the browser but could render on the server.
- Check for large client bundles. Look at the imports in browser components.
- Check that heavy components not needed on first load are loaded lazily.
- Check for missing loading states and suspense boundaries on async routes.
- Look for layout shift risks: images without dimensions, content injected after load.
- Check that images go through the framework's image component, not raw image tags.
- Check that fonts are loaded through the framework's font loader, not external stylesheet links.
- Check for needless re-renders on large datasets, for example in chart components.

## Data fetching

- Look for N+1 query patterns: loops that make one database call per item.
- Check for list queries with no pagination or limit.
- Find queries that fetch more columns than they need.
- Check for indexes on frequently queried columns (read the migration files or the schema).
- Look for waterfall fetches: sequential requests that could run in parallel.
- Look for the same data fetched in a parent and again in a child.
- Check revalidation and static generation settings on server-rendered pages and API routes.
- If an ORM is used, check for missing field selection that causes over-fetching.

## AI and LLM calls

- Check `max_tokens` (or the equivalent) on each call. Is it far higher than the output needs?
- Check model choice. Cheap, fast models should route and classify. Stronger models should do the synthesis.
- Look for AI calls in hot paths that block user interactions.
- If the project uses embeddings or retrieval: check embedding batch sizes and retrieval query efficiency.
- If a cheap model routes tool calls: check that the round limit is enforced.
- If the project processes audio: check latency and file size limits.
- Check for timeouts on every AI call. A timeout just under the platform limit is typical.

## Caching

- Check cache headers on API routes.
- Check that static pages use incremental regeneration where it fits.
- Look for database results that could be cached for a short time.
- Check whether AI responses are cached when the same input recurs.
- Check that every in-memory cache has a size bound, so it cannot leak memory.
- For scheduled jobs that refresh data: check the freshness strategy. Is stale data served while the refresh runs?

## API and serverless functions

- Check that every API route sets a maximum duration. Without one, a hang runs until the platform kills it with no cleanup.
- Check that lightweight routes use the lightweight runtime where it fits.
- Look for blocking work in request handlers: large file processing, long AI calls.
- Check that background work uses a proper pattern (scheduled job or queue), not a held-open request.
- For batch work: check that each batch fits inside the route's maximum duration.

## Database

- Review migration files for missing indexes on frequently queried columns.
- Look for expensive queries in hot paths: recursive queries, full table scans.
- Check connection pooling.
- If vector search is used: check the index type and its parameters.
- Check retention and cleanup. Do any tables grow without bound?

## Ingestion pipelines (if any)

- Compare each job's run time with its scheduler's timeout.
- Check for deduplication on insert (upsert, or check before insert).
- Look for sequential steps that could run in parallel.
- Check that a failure retries only the failed items, not the whole batch.
- Check that monitoring pings do not block the job.

## Output format

1. **Overall assessment:** Fast, Acceptable, Needs Work or Critical.
2. **Quick wins:** Easy to do, high impact.
3. **Significant optimizations:** Larger changes with meaningful gain.
4. **Architecture considerations:** Structural changes for the long term.
5. **Metrics checklist:** Area, current state, recommendation, priority (P1 to P3).

Do not state a measured number you did not measure. Where you can only read the code, say the finding is from reading, not from a profile.

Save the report to `docs/performance-review.md` in the project.

# database-review

Audits the database schema, migrations, indexes, row-level security policies and data health for correctness and consistency.

Do a comprehensive audit of this project's database schema, migrations, indexes, row-level security policies and data health.

## Arguments

The input is an optional table, schema or section name (`schema`, `migrations`, `indexes`, `rls` or `rpc`). If given, review only that scope. If empty, review everything below.

## Sources

Work from the migration files and the code. If a live database connection is available, also use it to list tables, migrations and extensions, to read the provider's security and performance advisories, and to run read-only SELECTs for data checks. Never apply migrations or run writes. If a tool or connection is not available, report BLOCKED for that check. Never infer success.

## Schema audit

- List every table with its column count, its likely purpose and its row-level security status.
- Identify tables that look unused: no references in application code.
- Check for columns that application code never reads or writes.
- Flag tables missing `created_at` or `updated_at` timestamps.
- Look for inconsistent naming: mixed snake_case and camelCase, inconsistent plurals.
- Check for missing NOT NULL constraints on columns that should always have values.
- Verify that foreign key relationships are defined, not just implied by names.
- Flag columns that store JSON. Are they structured consistently? Should they be separate tables?

## Migration health

- List all migration files in order.
- Flag any migration that looks edited by hand after it was applied.
- Check for migrations that create tables or columns but have no down or rollback path.
- Look for migrations that change production data (UPDATE or DELETE statements). Flag them as risky.
- Verify that migration numbering is sequential with no gaps.
- Check whether any migration references tables or columns that no longer exist.
- If the project uses an ORM schema file, verify that it matches the actual database state.

## Indexes

- List all existing indexes.
- Identify columns often used in WHERE clauses, JOIN conditions or ORDER BY that lack an index.
- Check for redundant indexes: several indexes covering the same columns.
- Check for indexes on low-cardinality columns such as boolean flags and status enums. They are usually wasteful.
- If vector search is used, verify the vector index type, the dimensions and the list count.
- Flag composite indexes and verify that the column order matches the query patterns.
- Check for missing indexes on foreign key columns.

## Row-level security

- For every table, report whether it is enabled, the policy count and a policy summary.
- Flag any user-facing table with row-level security disabled.
- For each policy, verify:
  - SELECT policies scope to the correct user, team or organization.
  - INSERT policies stop users creating records for other users.
  - UPDATE policies stop cross-user changes.
  - DELETE policies exist where needed, or explain why not.
- Check for overly permissive policies, such as `USING (true)` on sensitive tables.
- Look at how policies identify the user (the session user ID or the token claims) and verify the right one is used.
- Verify that the service role bypass is used only in trusted server-side contexts.
- If stored functions exist, check whether each runs as definer or invoker.

## Data integrity

- Check for orphaned records: foreign key targets that no longer exist.
- Look for columns that allow NULL but always have values. They should be NOT NULL.
- Check for duplicate data that suggests a missing unique constraint.
- Verify that enum and status columns have CHECK constraints or are validated in the application.
- Look for time data with no timezone awareness: timestamp where timestamptz is needed.
- Check for tables that grow without bounds. Is there a retention or cleanup policy?

## Data retention and cleanup

- Document the tables that have retention policies, such as cleanup jobs or TTLs.
- Flag high-volume tables with no retention policy: logs, events, analytics and ingested data.
- Estimate table growth from ingestion frequency.
- Check that cleanup jobs really delete old data. Verify the job's logic.

## Performance concerns

- Identify the largest and busiest tables, from ingestion frequency and query patterns in the code.
- Check for full table scans in frequently called queries.
- Look for N+1 query patterns in application code that hits this database.
- Verify the connection pooling configuration.
- Check for expensive operations inside security policies, such as subqueries and function calls.
- If several applications share this database, check for contention risks.

## Stored functions

- List all stored functions.
- For each one, give its purpose, its parameters, its security setting (definer or invoker) and whether application code calls it.
- Flag functions that are defined but never called.
- Check for definer functions that could be exploited.

## Output format

1. **Health rating:** Critical, Needs Attention, Healthy or Excellent.
2. **Schema summary:** Table count, total columns and the percentage of tables with row-level security.
3. **Critical issues:** Missing row-level security, orphaned data, security risks.
4. **Schema improvements:** Missing indexes, constraint gaps, naming inconsistencies.
5. **Cleanup opportunities:** Unused tables and columns, redundant indexes, missing retention policies.
6. **Table inventory:** Table | Columns | Row-level security | Indexes | Retention | Status

Save the report to `docs/database-review.md` in the project.

# data-audit

Comprehensive data-quality audit covering currency, completeness, accuracy and integrity, using sampling, cross-referencing and anomaly detection.

You are a data quality analyst. Run a comprehensive audit of this project's data for accuracy, currency, completeness and integrity. Combine direct verification, sampling, cross-referencing and anomaly detection.

## Arguments

The input is an optional table, data source or single dimension (`currency`, `accuracy`, `completeness` or `integrity`). If given, run only the matching steps for that scope. Step 1 always runs. If empty, run the full audit.

## Guardrails

- Read-only. Run SELECT queries only. Never INSERT, UPDATE or DELETE and never run DDL, even to fix bad data. List fixes as recommendations.
- If a tool or connection is not available, report BLOCKED for that check. Never infer success.

## Step 1: Understand the data landscape

- Read the project instructions file and the codebase to find every data source.
- Map every table that stores ingested, computed or derived data.
- Document each source: where it comes from, how often it refreshes and when it last updated.
- Identify the ingestion pipeline: scheduled jobs, scripts and manual entry.

## Step 2: Currency audit (is the data fresh?)

### Check last-updated timestamps
For every data table with a timestamp column such as `created_at`, `updated_at`, `ingested_at` or `fetched_at`:
```sql
SELECT MAX(created_at) AS latest, MIN(created_at) AS earliest, COUNT(*) AS total
FROM [table_name];
```

Run it against the database and report:

| Table | Latest record | Expected freshness | Actual freshness | Status |
|---|---|---|---|---|

**Expected freshness** comes from the job schedule:
- Every 5 minutes: the latest record should be within 10 minutes.
- Every 30 minutes: within 1 hour.
- Daily: within 36 hours.
- Weekly: within 10 days.

Flag any table that is staler than 2x its expected refresh interval.

### Check scheduled job health
- Examine job log tables if they exist.
- Look for recent failures, skipped runs and error patterns.
- Verify the last successful run time for each job.
- If heartbeat monitors are configured, note their status.

### Check for gaps
- Look for missing dates in time-series data: days with no records when there should be some.
- Check for gaps in sequential data, such as missing intervals or periods.
- Report any gap longer than 2x the normal interval.

## Step 3: Accuracy audit (is the data correct?)

### Sampling verification
For each major data source, take a random sample of 3 to 5 recent records and verify them against the source.

**API-sourced data.**
- Fetch the same data point directly from the source API.
- Compare the stored value with the fresh response.
- Report any discrepancy with the exact values.

**Scraped data.**
- Source pages may have changed format. Say so.
- Check whether any selectors point at elements that no longer exist.
- Sample a few stored values and check that they are plausible: not null, not zero, not obviously wrong.

**Computed or derived data.**
- Trace the computation in the code.
- Take 2 or 3 raw input values and work out the expected output by hand.
- Compare it with the stored value.
- Report any discrepancy with your working.

### Anomaly detection
For each numeric column in key tables:
```sql
SELECT
  AVG(value) AS mean,
  STDDEV(value) AS stddev,
  MIN(value) AS min,
  MAX(value) AS max,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value) AS median
FROM [table_name]
WHERE created_at > NOW() - INTERVAL '30 days';
```

Flag:
- Values more than 3 standard deviations from the mean.
- Sudden spikes or drops, such as a change of over 50% day over day where that is unusual.
- Zero values where zero should not occur.
- NULL values in columns that should always hold data.
- Negative values in columns that should always be positive.
- Values beyond known bounds, such as a percentage over 100 or a score above its maximum.

### Cross-reference checks
Where several sources cover the same metric:
- Compare the values for the same date or period.
- Flag discrepancies over 5% between sources.
- Note which source is likely authoritative.

## Step 4: Completeness audit (is anything missing?)

### Record counts
For each key table, report:
- Total record count.
- Records added in the last 24 hours, 7 days and 30 days.
- Expected record count based on ingestion frequency.

Flag tables where recent counts are well below what is expected.

### NULL analysis
For each table, check the NULL rate of every column:
```sql
SELECT
  COUNT(*) AS total,
  COUNT(column_name) AS non_null,
  ROUND(100.0 * COUNT(column_name) / COUNT(*), 1) AS completeness_pct
FROM [table_name];
```

Flag:
- Columns with a NULL rate over 5% that should not have NULLs.
- Columns that are 100% NULL: dead columns or broken ingestion.
- Columns whose NULL rate has risen recently compared with the past.

### Coverage analysis
- Are all expected entities represented, such as all regions, categories and metrics?
- Are there entities in the schema with no data?
- For geographic data, are all expected regions covered?
- For time data, are all expected periods covered, with no missing months or quarters?

## Step 5: Integrity audit (is the data consistent?)

### Referential integrity
- Check foreign key relationships for orphaned records.
- Look for records that reference entities that no longer exist.
- Check for duplicates: the same entity and timestamp together.

### Score and calculation consistency
For any scoring or aggregation system:
- Take 3 to 5 sample composite scores and break them down.
- Verify that component scores sum or average to the composite.
- Check that score bands match the documented thresholds.
- Verify that trend indicators (up, down, stable) match the actual direction of the data.

### Business logic validation
- Check that subscription tiers match what the payments provider holds.
- Verify that user role assignments are consistent with access patterns.
- Check that rate limit counters are reasonable: not negative and not astronomically high.
- Verify that cached or materialized data matches its source.

## Step 6: Source health check

For each external data source the project depends on:
- Is the source API still responding?
- Has its format or schema changed since the ingester was built?
- Are there deprecation notices or upcoming changes?
- Does it provide data at the expected frequency?
- Are there known outages or quality problems?

Test by sending a sample request to each source and checking that the response structure matches what the ingester expects.

## Output format

### 1. Executive summary
3 to 5 sentences: overall data health, the most critical issues and your confidence level.

### 2. Currency dashboard
| Data source | Table | Last updated | Expected | Gap | Status |

Red-flag any data more than 2x stale.

### 3. Accuracy findings
For each sampled check:
- Source value against stored value.
- Match, mismatch or within tolerance.
- For a mismatch: the likely cause and the severity.

### 4. Anomalies detected
| Table | Column | Anomaly type | Value | Expected range | Severity |

### 5. Completeness report
| Table | Total records | NULL columns | Coverage gaps | Status |

### 6. Integrity issues
- Orphaned records.
- Duplicate records.
- Calculation inconsistencies.

### 7. Source health
| Source | Status | Last checked | Format changed | Notes |

### 8. Recommendations
In priority order:
- Data issues to fix at once, such as stale data and broken ingesters.
- Monitoring to add, such as alerts on staleness and anomaly detection.
- Structural improvements, such as missing indexes and constraints.

### 9. Overall data quality score
Rate each dimension from 1 to 5:
- **Currency:** is the data up to date?
- **Accuracy:** is the data correct?
- **Completeness:** is all expected data present?
- **Integrity:** is the data internally consistent?
- **Overall:** a weighted average.

Save the report to `docs/data-audit.md` in the project.

## Important notes

- This audit reads the database, not just the code. Run queries to verify the actual data.
- Sample verification means real calls to source systems. Respect their rate limits.
- If you cannot reach the database directly, list the checks you skipped and recommend running them by hand.
- Be specific about which records you sampled. Include IDs, dates and values so findings can be reproduced.
- If the project has no external data sources, for example a marketing site, say so and go straight to the integrity checks.

# post-merge

Verify that a merged PR did what it claimed in production: deploy healthy, migrations applied, errors not up, behavior confirmed.

The companion to the pre-merge routine. It answers one question: did this PR's claim hold in production?

Target: the PR named in the argument. If none is given, use the most recently merged PR.

## Step 1: Extract the claim

Read the PR title, body and linked issue. State in one or two sentences what it claims to change. List the concrete, checkable outcomes: a route now returns X, an error stops, a column exists, a page renders.

## Step 2: Deploy

Find the production deployment for the merge commit. Report its state (ready or failed), its time, and any runtime errors since it went live. If it is not ready, stop and say so.

## Step 3: Config

Compare against the findings of the pre-merge detect phase for this PR:

- Database: list the applied migrations. Every migration in the PR must be present.
- Hosting platform: every environment variable the PR introduced must exist in production.

## Step 4: Signal

Check the error tracker for new or spiking issues since the deploy time. Check whether the issue the PR claims to fix has stopped occurring. Compare against the same window before the deploy.

## Step 5: Verdict

Write one line per checkable outcome: **PASS**, **FAIL** or **UNVERIFIED**, with the evidence. If a tool is not connected, mark that check BLOCKED. Never infer success from the absence of errors.

End with one verdict: HELD, PARTIAL or FAILED. On FAILED, recommend the action (fix forward or revert) and do not take it.

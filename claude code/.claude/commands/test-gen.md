---
description: Writes Playwright end-to-end regression tests for a shipped feature or fixed bug, then runs them to prove they pass.
argument-hint: '"<feature, route, or issue/PR number>"'
model: claude-sonnet-5-5
---
# /test-gen

Write end-to-end regression tests that lock in the behavior of a shipped feature or a fixed bug, then run them to prove they pass.

Lock in the behavior of: `$ARGUMENTS`. If empty, ask which feature or issue.

## Step 1: Understand the behavior

Read the pull request or issue (if a number was given), the diff, and the affected routes and components. Write down the user journey in three to six steps and the single assertion that proves it works. For a bug fix, the test must fail on the code before the fix and pass after.

## Step 2: Delegate

Hand the writing and running to the `e2e-test-writer` agent. Give it: the journey, the assertion, the target files and any existing Playwright conventions found in the repo (config, fixtures, page objects). Do not paste large file contents. Pass paths.

## Step 3: Review the result

You judge the output:
- It uses accessible locators (role, label), not brittle CSS selectors or timing sleeps.
- It creates and cleans up its own data, with a unique run identifier.
- It asserts the outcome the user cares about, not implementation details.
- It passes on the current branch. For a bug fix, it also fails on the pre-fix commit (use a stash or a worktree only with my approval).

## Step 4: Report

List the test file paths, what each covers, the pass and fail output, and anything not covered and why. Do not commit.

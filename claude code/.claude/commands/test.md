---
description: "Interactive test harness: describe what to test, run it via Playwright with throwaway accounts, get a report with issue-ready summaries."
model: claude-opus-5-5
effort: high
---
# /test

An interactive test harness. A tester describes what to verify. You plan the test, run it in a browser with throwaway accounts, and report with issue-ready summaries.

A tester or designer will describe what they want to verify. Your job is to plan, execute and report.

## Phase 1: Understand

Ask the tester: **"What do you want to test?"**

Ask follow-up questions if needed:
- Which feature or flow (for example "sign-up", "checkout" or "the settings page")
- Specific scenarios or edge cases they care about
- A quick smoke test, or thorough coverage

Also ask which environment to test against:
- **Production** at the project's live URL (the default)
- **Local** at the local dev server address, if they are running one

## Phase 2: Plan

Write a numbered test routine. Each step has:
1. A concrete browser action (navigate, click, type, verify)
2. What you expect to see (the assertion)
3. Why it matters

Example format:

```
Test Plan: Sign-up Flow
-----------------------
1. Navigate to the sign-up page. Expect the registration form.
2. Create a throwaway account. Expect a redirect to the dashboard.
3. Click "New Project". Expect the creation screen.
4. Enter the project name "Example Project". Expect the name accepted.
5. Submit. Expect a redirect to the new project.
6. Check the sidebar. Expect the project name visible.
```

Present the plan and ask the tester to **approve or adjust** it. Offer two options:
- "Approve: run it"
- "I want to adjust some steps"

If they adjust, fold in the feedback and present the plan again. Do not run until it is approved.

## Phase 3: Execute

### Account setup

For tests that need authentication, create a throwaway account. Use the project's script for creating test accounts if it has one. It should return the user id, email, password and display name. Log in through the browser with those credentials.

If there is no script, or it fails (for example missing environment variables), register through the UI:
1. Go to the registration page.
2. Use a unique email on a reserved test domain and a unique password that carry a timestamp.
3. Fill the display name with `Test User`.

UI registration may need email confirmation. Tell the tester if that blocks progress.

### Running tests

Use the browser automation tool (for example Playwright) to run each step. You need to:
- Navigate to pages
- Read page state from the page's accessibility tree (use this for assertions)
- Click elements, fill forms, press keys and type text
- Take screenshots as evidence on failures
- Read the browser console messages
- Read the network requests, to find failed API calls

For each test step:
1. Execute the action.
2. Read the page state again to verify the expected outcome.
3. Check the console for errors after page transitions.
4. If something fails, take a screenshot, note the failure and continue to the next step.
5. **Do not stop the whole run at the first failure.** Complete all steps and report everything.

### Account cleanup

After ALL tests complete, pass or fail, delete every throwaway account you created. Use the project's cleanup script or delete through the product. If cleanup fails, note it in the report.

## Phase 4: Report

Write a concise test report in this structure.

### When everything passes

```
Test Report: [Feature Name]
===========================
Environment: [production / local]
Date: [today's date]
Result: PASS

All [N] steps passed. No issues found.
```

### When issues are found

```
Test Report: [Feature Name]
===========================
Environment: [production / local]
Date: [today's date]
Result: FAIL, [N] issue(s) found

Passed: [X] of [Y] steps
Failed: [Z] of [Y] steps
```

Then, for EACH issue, write a **ready-to-paste issue** as a block the tester can copy:

````
-----------------------------------
Issue [1 of N]
-----------------------------------

**Title:** [Concise, specific title, for example "Login form accepts empty password without validation"]

**Steps to Reproduce:**
1. Navigate to [URL]
2. [Action]
3. [Action]

**Expected:** [What should happen]

**Actual:** [What actually happened]

**Evidence:** [Describe the screenshot or error. If a screenshot was taken, reference it.]

**Severity:** [Critical / High / Medium / Low]
- Critical: blocks core functionality, data loss, security issue
- High: feature broken but a workaround exists
- Medium: incorrect behavior, or a cosmetic issue with functional impact
- Low: minor cosmetic issue, copy error

**Labels:** `bug`, `needs-triage`, `[area]`
````

### Key rules for the report

- One issue per block. Never combine problems.
- Number them clearly: "Issue 1 of 3", "Issue 2 of 3", "Issue 3 of 3".
- The title must be specific enough to stand alone in an issue list.
- Steps to reproduce must be exact. Someone unfamiliar should be able to follow them.
- Always include the severity.
- If a step was blocked (the page did not load, an element was not found), report it as a skipped step with the reason, not a pass.

## Rules

- **US English** in all output.
- Be concise. Testers want results, not essays.
- Take screenshots on failures, not on every step.
- Always clean up throwaway accounts, even if tests fail partway through.
- If the browser tool cannot connect or times out, tell the tester right away. Do not retry silently.
- Never put issue-closing keywords or issue references in any output. The tester decides which issues to file.
- Do not read the environment file directly. The account script handles environment loading.

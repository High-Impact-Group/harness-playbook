# autopilot-run

The weekly supervised autopilot sweep. It executes approved automations, drafts what needs approval, notifies the team and raises issues for decisions.

The input names the product or narrows the run to specific steps (for example `health` or `support`). If empty, run the full sweep for the product in the current repo. Run it weekly. Each run is a full sweep of the product's autopilot duties.

## Prerequisites

1. The autopilot config file exists and is filled in.
2. The autopilot-audit routine has run at least once.
3. All blocked decisions from that audit are resolved.
4. The issue tracker connection is active.
5. The database connection is configured, so you can check user and data state.

If any of these is missing, stop and tell the owner.

## Step 1: Read the config and check approvals

Read the config to learn the rules. Then look in the tracker for open issues labeled `autopilot` and `needs-approval`.
- If any are still open, flag them in the output. They are holding things up.
- For an issue closed as completed (approved), run the linked action if it is still pending.
- An issue closed as "not planned" is rejected. Do nothing.

## Step 2: Health check

Run a quick ops sweep. This is not the full ops-health routine.
- Data freshness on critical tables
- Status of the last deployment
- Last-run times of scheduled jobs
- Errors in the error tracker over the last 7 days
- Payments events over the last 7 days (new subscriptions, cancellations, failed payments)
- User activity (signups, active users, churn)

If anything is red, send an immediate alert to the team channel and block the rest of the run. An unhealthy product must not send automated email to users.

## Step 3: Run approved automations

For each item in `auto_execute` in the config, check whether action is needed. Skip any sub-step whose item is not listed there.

**Welcome email.** Find users who signed up since the last run and have not had the welcome email. Send it from the approved template in the drafts folder. Log it.

**Re-engagement email.** Find users whose last sign-in was 7 to 14 days ago and who have not had this email. Send the approved template. Tag each user so they never get it twice.

**Win-back email.** Find subscriptions cancelled about 30 days ago whose owners have not had the win-back email. Send it and tag them.

**Milestone messages.** Find users reaching 1 week, 1 month, 3 months, 6 months or 1 year. Send the matching milestone email.

**Data pipeline monitoring.** Compare data freshness with the expected refresh interval. If a feed is stale past its threshold, alert the team channel with the product tag. If it is stale run after run, open an issue with investigation notes.

**Payment failure recovery.** Find failed-payment events from the last 48 hours that are still unresolved. Send the recovery email. If one is still unresolved after 48 hours, alert the team channel.

## Step 4: Generate this week's content

For products with `content_mechanism: weekly_newsletter`:
1. Check whether this week's edition is already drafted.
2. If not, draft it from last week's activity and data, recent external news relevant to the audience, product updates shipped this week and the structure of the previous edition.
3. Save the draft in the drafts folder under a weekly subfolder, named by year, week and edition.
4. Create an issue: `[Autopilot] Approve: Weekly content edition #N`.
5. Once the issue is closed as completed, send the edition on the next run.

For the first four editions, always require approval. After four editions with little revision, the owner may change the config to allow auto-send with the owner copied.

Use only real data. Never invent figures, quotes or news.

## Step 5: Handle support

Read new support messages since the last run. For each one:
- Match it against the FAQ. If confidence is high, `faq_support_responses` is in `auto_execute` and the autonomy level is not `draft_only`, reply with the approved template. Otherwise draft the reply.
- If the match is partial, draft a reply and create an approval issue.
- If there is no match, or the message is emotional or complex, escalate to the team channel at once.
- If the user asks for a human, always escalate, whatever the match.

## Step 6: Draft the weekly performance brief

Write the weekly brief:

```
Weekly Autopilot Brief: <product>, week of <date>

PERFORMANCE
Signups this week: X (vs Y last week)
Active users: X (vs Y last week)
New subscribers: X
Cancellations: X
Recurring revenue change: +X
Net revenue: X

AUTOPILOT ACTIVITY
- N welcome emails sent
- N re-engagement emails sent
- N win-back emails sent
- N support replies (auto)
- N support replies (draft, then approved)
- Weekly content: <status>

NEEDS YOUR ATTENTION
<open approval issues, blocked items>

FLAGS
<health issues, trending concerns>

THIS WEEK'S FOCUS
<the top 1 to 3 things to approve or decide>
```

Email it to the owner and save a copy in the logs folder, named by year and week.

## Step 7: Instant alerts

Send alerts to the shared team channel with a `[product]` tag. Examples of what deserves one: a new paid subscriber, a payment unresolved for 48 hours, a draft ready for review, a stale data feed, a customer complaint that needs a personal reply. Do not put more private user detail in an alert than the case needs.

## Step 8: Check graduation conditions

If any `graduate_autopilot_when` condition is met, send a special alert:

```
[product] has graduated from autopilot
Trigger: <which condition>
Detail: <the specific metric>
Recommend pulling this product back into active management.
```

## Step 9: Update the log

Append to the log file in the logs folder:

```markdown
## <Date>
- Health status: green / amber / red
- Automations run: N
- Emails sent: N
- Alerts sent: N
- Approval issues created: N
- Approval issues resolved: N
- Graduation check: passed / triggered
- Notes: anything unusual
```

## Step 10: Summarize in the conversation

Give a 10-line summary:

```
Autopilot run complete for <product>
Health: green / amber / red
Automations executed: N
New approvals needed: N
Alerts sent: N
Weekly brief: sent
<anything that needs immediate attention>
Next run: <date>
```

## Error handling

If anything fails:
- Log the failure.
- Alert the team channel with a short description.
- Continue with the remaining tasks if you can.
- Never swallow an error silently.

## Rules

- Respect `autonomy_level` in the config. If it is `draft_only`, never auto-send.
- Never fabricate data. If you cannot check the payments provider, say so.
- If a connection or tool is not available, report BLOCKED for that check. Never infer success.
- Database writes are limited to the send-tracking tags above. No other row changes, no schema changes, no deletes. Show the query before each write batch.
- Never send an email that was not approved, either as a pre-approved template or through an approval issue.
- Tag every alert with `[product]`.
- Use the language, time zone and currency set in the config.
- Batch alerts into one summary message if more than 5 fire in one run.
- Log everything. The log is how you debug when things go wrong.

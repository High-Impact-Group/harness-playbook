# morning

The daily startup routine. Run it first thing when you open a project. It replaces a scattered round of "check a bunch of things" with one structured brief.

It produces a 60-second morning brief covering:
1. What happened overnight.
2. What is broken or degrading.
3. What was planned for today.
4. What to actually focus on.
5. What is waiting on the owner.

It is a briefing, not a report. It must be scannable in under a minute.

## Step 1: Check the overnight state

### Operational health (quick version)
Check the critical signals only. Do not run the full ops-health audit.

- Last deployment status: succeeded, failed or in progress.
- Any scheduled jobs that failed overnight.
- Data freshness on the critical tables. Flag anything older than its expected refresh interval.
- Error tracker: errors in the last 12 hours that are new, spiking or unresolved and critical.
- Payment events overnight: new subscriptions, cancellations and failed payments.
- New user signups overnight.
- Any red or amber flag that needs attention today.

### Yesterday's session
Read the last entry of the session log to see what was worked on yesterday. Read the current-state notes for what is in progress and what is blocked. Read the task list.

## Step 2: Check the git state

Run `git status` and `git log --oneline -5`.

- Are there uncommitted changes, such as work that was not committed yesterday?
- When was the last commit?
- Are there branches that need merging?

## Step 3: Check for items waiting on the owner

- Failed deployments that need a re-push.
- Payment events that need attention, such as failures and disputes.
- Customer support emails, if visible.
- Stale pull requests waiting for review.

## Step 4: Produce the brief

Output one scannable briefing in this format:

```
Good morning. Here is <PROJECT NAME> on <DAY, DATE>.

OVERNIGHT
<One line per item that happened: deploy status, scheduled jobs, signups, errors, payments.>
<If nothing notable: "Nothing changed. Last deploy was X hours ago.">

ATTENTION NEEDED
<Red and amber items that need action today. Be specific.>
<If none: "Nothing broken. All systems healthy.">

YESTERDAY'S CONTEXT
<Two or three lines on where things were left, from the log and the current-state notes.>

TODAY'S PRIORITIES
<The top three tasks from the task list, in order.>
<If the list is empty: "No tasks queued. What are we working on today?">

WAITING ON YOU
<Things that block progress: customer emails, payment issues, stalled pull requests.>
<If nothing: "Nothing blocking you.">

ONE THING
<The single most important thing to focus on today. Be direct.>
```

## Step 5: Ask one question

End the brief with one question:

```
Ready to start on <the one thing>? Or something else?
```

## Rules

- Keep the brief under 20 lines. It is a morning coffee, not a board report.
- Lead with status, not narrative. Bullets over prose.
- Be specific. "The pricing data feed is 28 hours stale" is good. "Data issues detected" is not.
- Do not repeat other routines. This is a summary, not a full audit.
- If the ops-health routine has not run today, mention it: "Run ops-health for the full audit."
- US English.
- Use the project's local time zone and say it, for example "as of 7:42am".
- If a source is not connected or cannot be read, say BLOCKED for that line. Never infer a healthy status. Never invent a count, time or name.
- Do not write the brief to a file. It is ephemeral. The owner reads it once and acts on it.

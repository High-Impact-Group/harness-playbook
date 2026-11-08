---
description: "One-time readiness audit for supervised autopilot: finds lifecycle gaps, drafts what it can, and raises GitHub issues for anything needing approval."
argument-hint: '[optional: product or scope]'
model: claude-sonnet-5-5
---
# /autopilot-audit

The argument names the product or narrows the scope (for example one lifecycle stage). If empty, audit the product in the current repo across every stage.

Run a one-time audit to decide whether the product is ready for supervised autopilot. Find gaps across the customer lifecycle, draft what you can without asking, and raise issues for items that need approval.

Run this ONCE per product. After it, use the autopilot-run command for ongoing operation.

## Prerequisites

Check first:
1. An autopilot config file exists in the project. If not, create it from the template at the end of this file.
2. You can create issues in the project's tracker. If not, say so and stop.
3. The product has been confirmed as a candidate for supervised autopilot.

## Step 1: Read the config

The config tells you which notifications go where, the autonomy level, the escalation rules, the audience and the content mechanism.

## Step 2: Run the audit

For every stage, check every item and mark it:
- OK: in place and working
- PARTIAL: exists but needs work
- MISSING: not there
- BLOCKED: needs a commercial or product decision from the owner

**Awareness**
- Landing page has a clear one-sentence value proposition
- Meta tags, share images and structured data
- Sitemap submitted to search consoles
- The product ranks, or could rank, for its main use-case search
- Social proof is visible (only real testimonials and real figures)
- Shareable content hooks
- An active top-of-funnel content mechanism

**Conversion**
- A free tier or trial exists and delivers the first moment of value
- The pricing page sells outcomes, not features
- Upgrade prompts appear at natural friction points
- Annual pricing with a discount
- Checkout is frictionless
- A welcome email is sent on signup
- A free-to-paid email sequence is active
- An abandoned-checkout recovery email exists

**Onboarding**
- Time to first value is short
- In-product guidance: empty states, tooltips, a checklist
- Sample data or a guided first action
- Every screen has a clear next step
- Mobile onboarding works
- A post-signup email sequence (day 1, day 3, day 7)

**Support**
- A public knowledge base or FAQ
- The most common support questions are documented and searchable
- An in-product support path is visible
- The support inbox is monitored or has an auto-responder
- Error messages tell users what to do
- A status page, if uptime matters

**Retention**
- A weekly value-delivery touchpoint (digest, newsletter, alerts)
- A re-engagement email for users inactive for a week or more
- Milestone messages (first use, first week, first month)
- A feature-announcement mechanism
- The cancellation flow asks why
- A win-back email after cancellation

**Monitoring and escalation**
- Data pipeline health is monitored (for data products)
- Error tracking is active
- Uptime monitoring
- Payment-failure alerting
- Escalation rules are defined in the config
- Notification channels have been tested

If a tool or connection you need is not available, mark that check BLOCKED. Never infer success.

## Step 3: Score each stage

Give each stage a score out of 10, and an overall readiness score.
- 9 to 10: ready for autopilot now
- 7 to 8: ready after filling a few gaps
- 5 to 6: significant work needed
- Below 5: the product needs fundamental attention first

Be honest. Do not grade on a curve.

## Step 4: Fill gaps without asking

For items marked MISSING or PARTIAL, fill what you can.

**Draft content:** a welcome sequence, a re-engagement email, a win-back email, a payment-failure recovery email, FAQ content from the docs and code, answers to the common support questions, an abandoned-checkout email, a feature-announcement template, milestone emails.

**Configure:** create the config file if missing, add escalation rules, and add autopilot notes to the project instructions file.

Save all drafts to a `drafts` folder next to the config. Draft only what the product really does. Never invent testimonials, figures or features.

## Step 5: Raise approval issues

For every draft, create an issue in the product's repo.

**Title:** `[Autopilot] Approve: <what it is>`

**Body:**
```markdown
## What this is
Brief description of the draft.

## Draft content
The actual content to review.

## Decision required
Approve as is / Revise (specify) / Reject

## File location
Path to the draft.
```

Labels: `autopilot`, `needs-approval`, and one of `content`, `support`, `onboarding`, `retention` or `pricing`. Create them in a batch. Do not spam.

## Step 6: Raise one issue for blocked items

Some gaps need a product or commercial decision you cannot make. Create a single issue titled `[Autopilot] Decisions needed before autopilot can proceed`. For each blocked item, list the gap, why it is blocked, the decision needed and the options if you can suggest them.

## Step 7: Write the audit report

Save to `docs/autopilot-audit-<YYYY-MM-DD>.md`:

```markdown
# Autopilot Readiness Audit: <Product>
**Date:** <YYYY-MM-DD>
**Overall readiness:** X/10
**Status:** Ready / Nearly ready / Significant work needed / Not viable

## Executive summary
Three or four sentences: where the product stands and what happens next.

## Stage scores
Awareness, Conversion, Onboarding, Support, Retention, Monitoring: X/10 each.

## Drafts created
Each file with a one-line description.

## Issues created
Numbers and titles.

## Blocked items
A summary. Full detail is in the consolidated issue.

## Recommended next steps
1. Review the approval issues in one sitting.
2. Resolve the blocked items.
3. Run the autopilot-run command to start supervised autopilot.
4. Watch the first week through the alert channel and the weekly digest.
```

## Step 8: Summarize

Give a short summary:
- Readiness score and status
- Drafts created, and where
- Issues raised for approval
- Items blocked on the owner's decisions
- Strongest and weakest stage
- Next step

## Config template

If the config does not exist, create it with these defaults and fill the values from the project:

```yaml
# Autopilot configuration
product: <product name>
url: https://example.com

primary_audience: <description>
secondary_audience: <description>

pricing_tiers:
  - name: free
    price: 0
  - name: <tier name>
    price: <price>
    currency: <currency>
    interval: month

content_mechanism: <for example weekly_newsletter>
content_cadence: <schedule>
content_topic: <what the weekly content covers>

support_inbox: <support address>
support_response_sla_hours: 24

notifications:
  daily_digest:
    enabled: true
    channel: email
    time: "07:00"
  instant_alerts:
    enabled: true
    channel: <messaging channel>
    triggers:
      - payment_failure_over_48h
      - data_pipeline_stopped
      - error_rate_spike
      - new_subscriber
      - cancellation
  weekly_brief:
    enabled: true
    channel: email
    time: "monday 07:00"

# draft_only | auto_execute_approved | auto_execute_all
autonomy_level: draft_only

# Run without asking each time, after approval
auto_execute:
  - welcome_email
  - reengagement_email_inactive_7_days
  - win_back_email_30_days
  - milestone_emails
  - faq_support_responses
  - data_pipeline_monitoring
  - weekly_digest_to_owner

# Always draft, always ask
always_draft_only:
  - new_weekly_content
  - pricing_changes
  - feature_announcements
  - complex_support_responses
  - partnership_outreach
  - press_outreach

# Never touch
never_execute:
  - refunds
  - account_deletions
  - customer_data_exports
  - legal_matters
  - signed_partnerships
  - press_on_record

# Escalate to the owner immediately
always_escalate:
  - customer_complaint
  - payment_dispute
  - security_incident
  - data_quality_issue_affecting_customers
  - user_requesting_human

# Pull out of autopilot when any of these hit (set thresholds with the owner)
graduate_autopilot_when:
  - mrr_above: <threshold>
  - customer_count_above: <threshold>
  - press_mention: true
  - new_customer_with_deal_value_above: <threshold>
```

## Rules

- Do not skip checklist items. Score every stage.
- Draft what you can. Do not only flag gaps.
- Every issue must state a clear decision required.
- Use US English.
- Use one currency, the project's own, for all price references.
- Escalate anything ambiguous instead of guessing.
- Never send emails, change pricing or touch the payments provider. This work drafts and raises issues only.

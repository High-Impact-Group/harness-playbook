# Delivery tiers

We pick the delivery process by risk, not by size. A design, an adversarial review, a build, an independent code review and a deploy gate catch real defects. They also cost hours and a lot of tokens. For a typo or a cold-path tweak that cost buys very little.

## The tiers

| Tier | Use it for | What it needs |
|---|---|---|
| 0 | Docs, tests, copy, tooling and configuration | CI only. No design. No review. |
| 1 (the default for code) | A cold path. Small. Easy to revert. Covered by a test that can fail. | A few lines of design in the pull request. No independent reviewer unless the owner asks. |
| 2 | Shared helpers, generators, prompt wording, scheduled jobs, anything that sends to a customer | A short design in the pull request. One reviewer reads the design and the diff together. |
| 3 | Migrations, money, auth, privacy, the core loop of your product | A design file. Two or more design reviewers. The code reviewer runs every mutation. |

## How to assign a tier

1. **Start low.** Tier 1 is the default for code. Tier 0 is for docs, tests and config.
2. **Escalate on a named trigger only.** Keep a short table of triggers in your repo (template below). "It feels risky" is not a trigger. If you cannot name the row, stay put.
3. **Never go back down** after a trigger fires. Whoever finds the trigger raises the tier and says so.
4. **Write the tier in the pull request** on one line, for example `Tier: 1 - cold path, one file`. A CI check can fail pull requests with no tier line.
5. **The owner can override** with one word, for example "tier 1".

## Trigger table (template)

Replace these rows with your own. Ours are built for our own stakes, and yours will differ.

| Tier | Trigger |
|---|---|
| 3 | A schema migration |
| 3 | Deleting or rewriting stored user data |
| 3 | Billing or payments |
| 3 | Authentication or access control |
| 3 | Privacy-sensitive data |
| 3 | The one code path your product depends on |
| 2 | A shared helper used by many callers |
| 2 | A generated document that reaches a customer |
| 2 | A prompt change |
| 2 | A scheduled job |

## The five gates (Tier 3)

1. **Design.** A design file: evidence, at least two options, files to change, tests, rollback, acceptance checks.
2. **Design review.** Reviewers are told to find reasons the design is wrong. They are not the author. Every must-fix is answered.
3. **Build.** Tests first, shown failing. Build exactly the approved design. Open a draft pull request.
4. **Code review.** The reviewer wrote neither the design nor the code. They read the full diff, drive the real path and run the mutations.
5. **Deploy.** Only after gate 4. A person applies migrations, changes environment values and flips flags.

Lower tiers run a subset. Scale mutation checks with the tier: none at Tier 1, the important ones at Tier 2, all at Tier 3.

## Rules at every tier

- Tests first, shown failing on the base. State a rollback.
- One fix round per review. Fix critical and high findings and clear bugs. Put nits in a follow-up note. A reviewer with nothing blocking says "ship" and stops.
- A builder that cannot build the design as written stops and reports. The fix is a design amendment, not a quiet deviation.
- Give source, time window and sample size for every telemetry claim.
- Retest on fresh data. A defect on rows written before a fix is not proof that the fix failed.

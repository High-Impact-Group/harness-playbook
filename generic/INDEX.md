# Index

Every role and routine in this kit, in the same groups as the tool-neutral Risk-Tuned Delivery Playbook. The Claude Code kit holds the same set under agent and command names. Where a name differs, it is shown below.

## Roles (49)

### Gate roles

The G1 to G5 pipeline, in order.

| Role | Model | Effort | Access | What it does |
|---|---|---|---|---|
| `designer` (Claude Code kit: `designer-g1`) | strongest | high | docs-only | Writes the design file before any code, for Tier 2 and Tier 3 work. |
| `design-reviewer` (Claude Code kit: `reviewer-g2`) | strongest | high | read-only | Adversarial review of a design by someone who did not write it. |
| `builder` (Claude Code kit: `builder-g3`) | capable-mid-tier | high | read-write | Builds exactly the approved design, tests first, and opens a draft pull request. |
| `code-reviewer` (Claude Code kit: `reviewer-g4`) | strongest | high | read-only | Independent review of a diff against its approved design, by someone who wrote neither. |
| `migration-reviewer` (Claude Code kit: `reviewer-migration`) | strongest | high | read-only | Reviews any schema change or database function. Returns ship or hold. |
| `fix-round-builder` (Claude Code kit: `builder-fix-round`) | capable-mid-tier | high | read-write | One consolidated fix round on a pull request after review. |
| `retester` (Claude Code kit: `tester-retest`) | strongest | high | read-only | Checks a shipped fix on fresh data, with read-only database access. |

### Design and review

Read-only specialists. Use for second opinions and audits.

| Role | Model | Effort | Access | What it does |
|---|---|---|---|---|
| `architect` | strongest | high | read-write | Turns an idea, backlog item or bug into a written design that the implementer can build exactly as specified. |
| `qa-tester` | strongest | high | read-only | Adversarial tester that tries to break features and find edge cases |
| `security-reviewer` | strongest | high | read-only | Reviews a change or a system through a security lens. |
| `security-pen-tester` | strongest | high | read-only | Adversarial security reviewer that prepares a product for enterprise security review and third-party penetration testing: audits RLS/multi-tenancy,... |
| `database-architect` | strongest | high | read-only | Designs and reviews database schemas, migrations, indexes, queries and row-level security policies for Postgres. |
| `silent-failure-hunter` | strongest | high | read-only | Obsessively hunts for code paths where things fail without anyone knowing: swallowed errors, missing alerts, fire-and-forget calls, unchecked... |
| `api-design-reviewer` | strongest | high | read-only | Reviews the design of your product's APIs, including the endpoints you expose to partners and integrations, for consistency, correctness, versioning,... |
| `privacy-reviewer` | strongest | high | read-only | Reviews personal data handling in depth, covering what is collected, where it flows, how long it is kept, how it is deleted and who can access it |
| `compliance-reviewer` | strongest | high | read-only | Reviews the product against legal and regulatory requirements: privacy, accessibility, consumer law, AI disclosure. |
| `accessibility-auditor` | capable-mid-tier | medium | read-only | Audits a web product against WCAG 2.2 AA: keyboard access, focus, color contrast, semantic structure, forms, ARIA and screen-reader experience. |
| `design-auditor` | capable-mid-tier | medium | read-only | Audits the codebase for design system consistency and produces a structured report and remediation plan. |
| `dependency-auditor` | capable-mid-tier | medium | read-only | Sweeps dependencies for known vulnerabilities, risky licenses and stale packages, then gives a safe upgrade plan. |

### Build

Write code, tests and documents.

| Role | Model | Effort | Access | What it does |
|---|---|---|---|---|
| `implementer` | capable-mid-tier | high | read-write | Builds code from an approved design document exactly as specified, and stops to ask when the design is silent. |
| `e2e-test-writer` | capable-mid-tier | high | read-write | Writes and maintains Playwright end-to-end regression tests for critical user journeys. |
| `refactorer` | capable-mid-tier | medium | read-write | Cleans up code without changing behavior |
| `performance-optimiser` | capable-mid-tier | medium | read-write | Obsessed with speed |
| `prompt-engineer` | strongest | medium | read-write | Optimizes system prompts, persona definitions, and tool descriptions across the product's AI features |
| `technical-writer` | capable-mid-tier | medium | read-write | Creates and maintains clear, accurate documentation: README, API docs, architecture guides, onboarding docs. |
| `pdf-designer` | strongest | medium | read-write | Creates beautiful, professionally formatted PDF documents that look as good as (or better than) the screen |

### Operate

Run, watch and ship the product.

| Role | Model | Effort | Access | What it does |
|---|---|---|---|---|
| `incident-responder` | strongest | high | read-only | Triages a live production problem, finds root cause fast and proposes the smallest safe fix or rollback. |
| `ops-health` | strongest | medium | read-write | Operational thinking partner that investigates the health of a running product, including cron jobs, data feeds, logs, external dependencies, and... |
| `triage-scout` | smallest | medium | read-only | Fast, cheap first-pass triage. |
| `devops-specialist` | capable-mid-tier | medium | read-write | Reviews deployment, reliability, monitoring, scheduled jobs and infrastructure health, and recommends practical fixes. |
| `release-manager` | capable-mid-tier | medium | read-write | Turns merged pull requests and commits into clean release notes and a customer-facing changelog, and shepherds the release. |
| `release-planner` | capable-mid-tier | medium | read-write | Works out the safe order to merge a set of open PRs, and what has to happen around them. |
| `finops-optimiser` | capable-mid-tier | medium | read-only | Finds where AI and infrastructure spend goes and recommends cuts that do not hurt quality. |
| `data-analyst` | capable-mid-tier | medium | read-only | Answers product and business questions from your database (signups, activation, retention, usage, revenue) by writing safe read-only SQL and... |
| `eval-engineer` | strongest | high | read-write | Builds and runs LLM evaluations from real traces so prompt and model changes ship with evidence. |
| `rag-engineer` | strongest | high | read-write | Audits and improves retrieval quality for products that use embeddings and RAG, including chunking, embeddings, vector search, the hybrid vector and... |

### Strategy and market lenses

Opinionated views from the codebase and the web.

| Role | Model | Effort | Access | What it does |
|---|---|---|---|---|
| `competitive-analyst` | capable-mid-tier | medium | read-only | Analyzes competitors and positions the product against alternatives using codebase evidence. |
| `customer-experience-guru` | capable-mid-tier | medium | read-only | Thinks about the entire user journey from discovery to daily usage: onboarding, friction, retention, support burden. |
| `growth-strategist` | capable-mid-tier | medium | read-only | Identifies growth levers, conversion opportunities and acquisition strategies from the actual product. |
| `investor-lens` | capable-mid-tier | medium | read-only | Evaluates the product from an investor's perspective: moat, scalability, unit economics, risk and growth potential. |
| `product-strategist` | capable-mid-tier | medium | read-only | Thinks about features from a user value and market perspective, not a technical one |
| `visionary` | capable-mid-tier | medium | read-write | Reads the codebase and thinks big: commercialization, growth, expansion, disruptive moves, stickiness. |
| `onboarding-specialist` | capable-mid-tier | medium | read-only | Obsessed with the first-time user experience |
| `data-prospector` | capable-mid-tier | medium | read-only | Finds untapped data sources (open, closed, public, commercial, structured, unstructured) that create outsized value when added to the platform. |
| `pricing-analyst` | strongest | medium | read-write | Analyzes product pricing from every angle, including current tiers, competitor benchmarks, willingness-to-pay signals, packaging, and conversion... |
| `seo-specialist` | strongest | medium | read-write | Optimizes the product for search visibility across both traditional search and AI answer engines: technical SEO, on-page GEO (generative engine... |
| `marketing-content` | capable-mid-tier | medium | read-write | Creates marketing content grounded in what the product actually does: landing pages, emails, social posts and case studies. |
| `copy-editor` | capable-mid-tier | medium | read-write | Reviews all user-facing text for US English, clarity, tone, brand consistency, persona fit and SEO keyword usage. |
| `visual-designer` | strongest | medium | read-write | Reviews the site with a designer's eye: consistency, spacing, typography, color, visual hierarchy, polish, and craft. |

## Routines (71)

### Deliver

Take work from idea to shipped.

| Routine | What it does |
|---|---|
| `decide` | Use it with no argument (the work in this session) or with a topic, for example "should we move billing to annual plans". |
| `decision-brief` | Like `decide`, but the decisions go into one document that I read, approve and comment on. Use it when there are several decisions, when I want to... |
| `idea` | A guided, beginner-friendly session that draws out an idea and shapes it into a clear, well-scoped GitHub issue. |
| `solve` | A guided, beginner-friendly session that takes a noticed problem through to a pull request that is ready for review. |
| `plan` | Write a plan before any code. Save it as `plan.md` in the working area and show it to me. Do not change any code until I approve it. |
| `architect` | Turn an idea, issue or bug into a written design with options, a chosen approach, files, tests and risks, before any code is written. |
| `technical-spec` | Generate a developer-facing technical specification for the project, or for one named feature. It captures architecture, data models, integrations... |
| `gate` | A full quality gate over the changes in the working copy. Run it before you commit or push, not in the middle of development. |
| `code-review` | Thorough review of the current staged and unstaged changes against quality, correctness and security criteria. |
| `pre-merge` | Surface migrations and environment variables before merge, then verify after merge that they landed. |
| `post-merge` | Verify that a merged PR did what it claimed in production: deploy healthy, migrations applied, errors not up, behavior confirmed. |
| `migration-check` | Review pending SQL migrations for safety. Report only. Never apply anything. |
| `issue-fix-loop` | An autonomous issue-resolution routine. It finds open issues assigned to you, clusters them by root cause, picks the highest-value fix, designs it,... |
| `triage-and-ship` | Triage the open issues by impact, let me choose, then ship the chosen one end to end through four sign-off gates and a draft pull request. |
| `triage-fix-ship` | Take real bugs from reported to merged, deployed, and closed or handed to a tester. Confirm the true root cause with live telemetry, design and... |
| `backlog-sweep` | Work the assigned GitHub issue backlog into a set of review-ready PRs plus a release plan. It clusters issues by root cause, designs and builds one... |
| `hotfix` | The incident path for a broken production: contain, find the cause, ship the smallest fix, verify and write the follow-ups. |
| `triage` | Read the open issues, score them by impact and produce a ranked shortlist. |
| `rca` | Run a root cause analysis of a known failure: reproduce, compare competing hypotheses, falsify, and trace past the proximate cause. |
| `decision-audit` | Surfaces the judgment calls made during recent work, not the code, so the person reviews the choices before anything merges. |

### Review and audit

One lens over the whole product.

| Routine | What it does |
|---|---|
| `access-review` | Map who can access what, find authorization gaps, bypass paths and privilege-escalation risks, and verify least privilege. |
| `accessibility-audit` | Audit the codebase against WCAG 2.2 AA and report issues with fixes. |
| `ai-audit` | Audit every AI implementation (prompts, models, tools, retrieval, errors, cost, UX) and report gaps and risks. |
| `cost-audit` | Analyzes infrastructure and AI spend, covering model choices, token limits and call frequency, and finds the biggest cost drivers and savings. |
| `data-audit` | Comprehensive data-quality audit covering currency, completeness, accuracy and integrity, using sampling, cross-referencing and anomaly detection. |
| `database-review` | Audits the database schema, migrations, indexes, row-level security policies and data health for correctness and consistency. |
| `dependency-audit` | Audits npm dependencies for vulnerabilities, outdated and unused packages, and safe upgrade paths. |
| `design-review` | Independent multi-reviewer design review. It captures the rendered UI, runs a blind panel of specialist roles, and synthesizes convergent findings... |
| `env-audit` | Audit every environment variable in the project. Find the mismatches between what the code expects, what is documented and what is set. Report only.... |
| `ia-audit` | Audit this project's information architecture and link hygiene in two passes. |
| `mobile-review` | Perform a comprehensive mobile usability audit of this project. Examine every page, component and layout for problems on phones and small tablets... |
| `model-audit` | Find every place a language model is chosen in this project. Check that each choice is current and fits the work. Report only. Change nothing. |
| `performance-review` | Review the whole codebase for performance bottlenecks in rendering, data access, AI calls, caching, functions and the database, and report fixes. |
| `pre-launch-review` | Run one launch-readiness audit that combines the security, SEO, performance, access, privacy and resilience blockers. |
| `privacy-review` | Map personal-data flows and check handling against applicable privacy law, flagging compliance gaps. |
| `resilience-review` | Assess how the app handles failure, degrades gracefully and recovers: error handling, boundaries, silent failures and timeouts. |
| `security-review` | Review the whole codebase for security: authn and authz, secrets, injection, access control and more. |
| `seo-audit` | Run a technical SEO audit of meta and head tags, structured data, sitemaps, canonicals and semantic structure, with a prioritized report. |
| `structure-review` | Review the project's file and folder structure for organization, consistency and convention. Find misplaced files, clutter and missing conventions. |
| `ux-review` | A senior UI and UX review of every page, flow and interaction: usability, visual design, information architecture and polish. |
| `config-audit` | Audits configuration across hosting, database, payments, sign-in, DNS and the app code for mismatches, missing settings and broken connections. |
| `audit-project-instructions` (Claude Code kit: `/audit-claude-md`) | Audit the project instructions file against the codebase for stale, missing or inaccurate claims. Report only. |
| `autopilot-audit` | Run a one-time readiness audit for supervised autopilot, draft what you can and raise issues for anything needing approval. |

### Set up

Add a standard piece of infrastructure.

| Routine | What it does |
|---|---|
| `add-health-check` | Add a health-check endpoint that verifies the database, auth and core services. |
| `add-llm-tracing` | Add LLM tracing so every AI call records latency, token usage, cost and success or failure. |
| `add-max-duration` | Add a maximum duration to every API route so serverless functions cannot hang. |
| `add-error-tracking` | Add error tracking to the project following the standard setup sequence. |
| `add-rate-limiting` | Replace the in-memory rate limiter with a shared-store limiter, with an in-memory fallback. |

### Daily and ops

Start the day, watch production, tidy up.

| Routine | What it does |
|---|---|
| `morning` | The daily startup routine. Run it first thing when you open a project. It replaces a scattered round of "check a bunch of things" with one structured... |
| `session-start` | Orient this session before any work. |
| `session-end` | Leave the next session a clean start. |
| `ops-health` | Run a complete operational health check on this project. This is the daily standup for a running product. Be systematic. Look across every layer for... |
| `telemetry-sweep` | Read telemetry across the error tracker, the LLM tracing service, the database logs and the deploy logs. Find patterns that indicate a real defect... |
| `portfolio-status` | Read context across all projects and give one synthesized cross-portfolio view. |
| `recap` | Give a concise recap of a finished problem-solving arc: issue, root cause, fix, why it is right, and what is next. |
| `sync` | Get the current branch fully in sync with its remote, safely. Never lose work. Confirm before anything destructive. |
| `prune-branches` | Delete local git branches whose remote is gone and prune stale worktree entries, after confirming scope. |
| `autopilot-run` | The weekly supervised autopilot sweep. It executes approved automations, drafts what needs approval, notifies the team and raises issues for... |
| `smoke-test` | Drive a live product the way a difficult user would, and check the data behind every claim it makes. |
| `test` | An interactive test harness. A tester describes what to verify. You plan the test, run it in a browser with throwaway accounts, and report with... |
| `test-gen` | Write end-to-end regression tests that lock in the behavior of a shipped feature or a fixed bug, then run them to prove they pass. |

### Write and explain

Produce documents, summaries and ideas.

| Routine | What it does |
|---|---|
| `ai-story` | Read the codebase and write an honest, non-technical narrative of how the product uses AI, for users, buyers and investors. |
| `api-docs` | Generate developer-facing API reference documentation from every API route. |
| `changelog` | Generates clear, non-technical release notes from recent git history for product, investor and user updates. |
| `client-security-brief` | Produces a client-facing security and data-practices document, with every claim verified against the actual code. |
| `feature-summary` | Write a clear, non-technical summary of the product, or of one named feature. The readers are stakeholders, clients and the wider team. They are not... |
| `marketing-brief` | Extract everything needed to refresh marketing content, web copy and collateral for this product. Read the codebase and produce an accurate, current... |
| `voice-learn` | Compare a draft you edited against the original, extract what changed and why, and save the lessons for future drafts. |
| `persona-panel` | Run a draft or feature past personas the owner defines, and synthesize where they agree and split. |
| `design-develop` | Develops a design from problem to build-ready spec. It frames the problem, generates genuinely distinct directions, gates on the person's choice,... |
| `ideate` | Proactively scan the codebase and the project context, and surface improvements worth making that nobody asked for. |

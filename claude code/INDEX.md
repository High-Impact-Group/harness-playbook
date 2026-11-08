# Index

Every agent and command in this kit, in the same groups as the Risk-Tuned Delivery Playbook (Claude Code version). Model and effort are pinned in each file and in `.claude/claude-config.json`.

## Agents (50)

### Gate roles

The G1 to G5 pipeline, in order.

| Agent | Model | Effort | Can write | What it does |
|---|---|---|---|---|
| `designer-g1` | opus | xhigh | yes | Writes the design file before any code, for Tier 2 and Tier 3 work. Use when a change needs a design and none exists. Opens a docs-only draft PR. |
| `reviewer-g2` | opus | xhigh | no | Adversarial review of a design by someone who did not write it. Use after the design, on Tier 2 and Tier 3 work. Finds reasons the design is wrong... |
| `builder-g3` | sonnet | xhigh | yes | Builds exactly the approved design, tests first, and opens a draft PR. Use when an approved design exists. Stops and reports if the design cannot be... |
| `reviewer-g4` | opus | xhigh | no | Independent review of a diff against its approved design, by someone who wrote neither. Drives a real run, runs the builder's mutations and posts a... |
| `reviewer-migration` | opus | xhigh | no | Reviews any schema change or database function in a PR. Read-only. Returns SHIP or HOLD. |
| `builder-fix-round` | sonnet | xhigh | yes | One consolidated fix round on a PR after review. Use with the same builder that wrote the PR. |
| `tester-retest` | opus | xhigh | no | Retests a shipped fix on fresh data. Read-only database access. Reports per case against the design's expectations. |

### Design and review

Read-only specialists. Use for second opinions and audits.

| Agent | Model | Effort | Can write | What it does |
|---|---|---|---|---|
| `architect` | opus | xhigh | yes | Turns an idea, backlog item or bug into a written design that the implementer can build exactly as specified. Use before implementation when no... |
| `code-reviewer` | opus | xhigh | no | Senior developer who reviews changes for quality, patterns and potential issues |
| `qa-tester` | opus | xhigh | no | Adversarial tester that tries to break features and find edge cases |
| `security-reviewer` | opus | xhigh | no | Reviews a change or a system through a security lens. Read-only. Reports reachable problems with the smallest safe fix. |
| `security-pen-tester` | opus | xhigh | no | Adversarial security reviewer that prepares a product for enterprise security review and third-party penetration testing: audits RLS/multi-tenancy,... |
| `database-architect` | opus | xhigh | no | Designs and reviews database schemas, migrations, indexes, queries and row-level security policies for Postgres |
| `silent-failure-hunter` | opus | xhigh | no | Obsessively hunts for code paths where things fail without anyone knowing: swallowed errors, missing alerts, fire-and-forget calls, unchecked... |
| `api-design-reviewer` | opus | xhigh | no | Reviews the design of your product's APIs, including the endpoints you expose to partners and integrations, for consistency, correctness, versioning,... |
| `privacy-reviewer` | opus | xhigh | no | Reviews personal data handling in depth, covering what is collected, where it flows, how long it is kept, how it is deleted and who can access it.... |
| `compliance-reviewer` | opus | xhigh | no | Reviews the product against legal and regulatory requirements: privacy, accessibility, consumer law, AI disclosure |
| `accessibility-auditor` | sonnet | default | no | Audits a web product against WCAG 2.2 AA: keyboard access, focus, color contrast, semantic structure, forms, ARIA and screen-reader experience.... |
| `design-auditor` | sonnet | default | no | Audits the codebase for design system consistency across typography, spacing, headings, kickers, alignment, color, components, and templates.... |
| `dependency-auditor` | sonnet | default | no | Sweeps the dependencies across the repos for known vulnerabilities (CVEs), risky or incompatible licenses, and stale or abandoned packages, then... |

### Build

Write code, tests and documents.

| Agent | Model | Effort | Can write | What it does |
|---|---|---|---|---|
| `implementer` | sonnet | xhigh | yes | Builds code from an approved design document, exactly as specified. Use when a design or spec file already exists and the task is to turn it into... |
| `e2e-test-writer` | sonnet | xhigh | yes | Writes and maintains Playwright end-to-end regression tests for the critical user journeys (signup, checkout, onboarding, core product flows). Use... |
| `refactorer` | sonnet | default | yes | Cleans up code without changing behavior. Reduces complexity, extracts patterns, removes duplication |
| `performance-optimiser` | sonnet | default | yes | Obsessed with speed. Finds and fixes slow pages, heavy bundles, inefficient queries, and sluggish AI calls |
| `prompt-engineer` | opus | default | yes | Optimizes system prompts, persona definitions, and tool descriptions across the product's AI features |
| `technical-writer` | sonnet | default | yes | Creates and maintains clear, accurate documentation: README, API docs, architecture guides, onboarding docs |
| `pdf-designer` | opus | default | yes | Creates beautiful, professionally formatted PDF documents that look as good as (or better than) the screen. Obsessive about typography, spacing,... |

### Operate

Run, watch and ship the product.

| Agent | Model | Effort | Can write | What it does |
|---|---|---|---|---|
| `incident-responder` | opus | xhigh | no | Reactive triage for a live production problem, reads error-tracker events, deploy and runtime logs, and database advisors and logs to find root cause... |
| `ops-health` | opus | default | yes | Operational thinking partner that investigates the health of a running product, including cron jobs, data feeds, logs, external dependencies, and... |
| `triage-scout` | haiku | default | no | Fast, cheap first-pass triage. Sorts and summarizes incoming noise (error-tracker issues, log excerpts, cron output, GitHub issues, feed health) into... |
| `devops-specialist` | sonnet | default | yes | Thinks about deployment, reliability, monitoring, cron jobs, and infrastructure health |
| `release-manager` | sonnet | default | no | Turns merged pull requests and commits into clean release notes and a customer-facing changelog, and shepherds the release. Groups changes by theme,... |
| `release-planner` | sonnet | medium | no | Works out the safe order to merge a set of open PRs, and what has to happen around them. Use when several PRs are ready at once and you need merge... |
| `finops-optimiser` | sonnet | default | no | Finds where the AI and infrastructure spend is going and how to cut it without hurting quality, reads LLM cost and latency traces, spots token-heavy... |
| `data-analyst` | sonnet | default | no | Answers product and business questions from your database (signups, activation, retention, usage, revenue) by writing safe read-only SQL and... |
| `eval-engineer` | opus | high | yes | Builds and runs LLM evaluations for your AI features, turns real LLM traces into eval datasets, writes assertions, and runs prompt-regression tests... |
| `rag-engineer` | opus | high | yes | Audits and improves retrieval quality for products that use embeddings and RAG, including chunking, embeddings, vector search, the hybrid vector and... |

### Strategy and market lenses

Opinionated views from the codebase and the web.

| Agent | Model | Effort | Can write | What it does |
|---|---|---|---|---|
| `competitive-analyst` | sonnet | default | no | Analyzes competitors and positions the product against alternatives using codebase evidence |
| `customer-experience-guru` | sonnet | default | no | Thinks about the entire user journey from discovery to daily usage: onboarding, friction, retention, support burden |
| `growth-strategist` | sonnet | default | no | Identifies growth levers, conversion opportunities, and user acquisition strategies from the actual product |
| `investor-lens` | sonnet | default | no | Evaluates the product from an investor's perspective, moat, scalability, unit economics, risk, and growth potential |
| `product-strategist` | sonnet | default | no | Thinks about features from a user value and market perspective, not a technical one |
| `visionary` | sonnet | default | no | Reads the codebase and thinks big: commercialization, growth, expansion, disruptive moves, stickiness. Unrestrained but feasible. The strategist who... |
| `onboarding-specialist` | sonnet | default | no | Obsessed with the first-time user experience. Removes friction between signup and first value |
| `data-prospector` | sonnet | default | no | Finds untapped data sources (open, closed, public, commercial, structured, unstructured) that create outsized value when added to the platform. The... |
| `pricing-analyst` | opus | default | yes | Analyzes product pricing from every angle, including current tiers, competitor benchmarks, willingness-to-pay signals, packaging, and conversion... |
| `seo-specialist` | opus | default | yes | Optimizes the product for search visibility across both traditional search and AI answer engines: technical SEO, on-page GEO (generative engine... |
| `marketing-content` | sonnet | default | yes | Creates compelling marketing content grounded in what the product actually does, landing pages, emails, social posts, case studies |
| `copy-editor` | sonnet | default | yes | Reviews all user-facing text for US English, clarity, tone, brand consistency, persona fit and SEO keyword usage |
| `visual-designer` | opus | default | yes | Reviews the site with a designer's eye: consistency, spacing, typography, color, visual hierarchy, polish, and craft |

## Commands (71)

### Deliver

Take work from idea to shipped.

| Command | Model | Effort | What it does |
|---|---|---|---|
| `/decide` | opus | high | Interview me for the decisions this work needs, with a recommendation, reasons and trade-offs for each, in plain English |
| `/decision-brief` | opus | high | Put the decisions I need to make in one document I can approve and comment on, with a recommendation and reasons for each |
| `/idea` | sonnet | default | Guided, beginner-friendly session that draws out an idea and shapes it into a clear, well-scoped GitHub issue. |
| `/solve` | opus | default | Guided, beginner-friendly session that takes a noticed problem through to a review-ready pull request. |
| `/plan` | opus | xhigh | Write a plan before any code |
| `/architect` | opus | xhigh | Turns an idea, issue or bug into a written design (options, chosen approach, files, tests, risks) before any code is written. |
| `/technical-spec` | opus | xhigh | Generates a developer-facing technical specification: architecture, data models, integrations and implementation. |
| `/gate` | opus | xhigh | Full quality gate over the current changes: baseline, review, test, triaged fix, regression check |
| `/code-review` | opus | xhigh | Thorough review of the current staged and unstaged changes against quality, correctness and security criteria. |
| `/pre-merge` | opus | xhigh | Pre-merge gate: surfaces migrations and env vars before merge, then verifies they landed after. |
| `/post-merge` | sonnet | default | Verifies a merged PR actually did what it claimed in production: deploy healthy, migrations applied, errors not up, behavior confirmed. |
| `/migration-check` | opus | xhigh | Reviews pending SQL migrations for safety: locks, destructive changes, RLS, backfills, rollback and ordering. Report only. |
| `/issue-fix-loop` | opus | high | Autonomous issue-resolution routine, discovers open issues, clusters by root cause, then designs, builds, ships, smoke-tests and closes each up to a... |
| `/triage-and-ship` | opus | default | Triages open issues by impact and ships the single highest-impact one end to end. |
| `/triage-fix-ship` | opus | high | Triage (or take a given set of) issues, confirm true root cause with live telemetry, design + adversarially review each fix, build, gate, merge, and... |
| `/backlog-sweep` | opus | high | Work the assigned GitHub issue backlog into a set of review-ready PRs plus a release plan. Clusters issues by root cause, designs and builds one fix... |
| `/hotfix` | opus | high | Incident path for a broken production: contain, find the cause, ship the smallest fix, verify, and write the follow-ups. |
| `/triage` | sonnet | default | Reads open issues, scores them by impact, and produces a ranked shortlist. |
| `/rca` | opus | default | Targeted root cause analysis of a known failure. Reproduces the symptom, generates competing hypotheses, falsifies rather than confirms, and traces... |
| `/decision-audit` | opus | default | Surfaces the judgment calls made during recent work, not the code, so you review the choices before anything merges. |

### Review and audit

One lens over the whole product.

| Command | Model | Effort | What it does |
|---|---|---|---|
| `/access-review` | opus | xhigh | Comprehensive access-control review: maps who can access what, finds authz gaps, bypass paths and privilege-escalation risks, and verifies least... |
| `/accessibility-audit` | sonnet | default | Audits the codebase against WCAG 2.2 AA: semantic HTML, keyboard access, contrast, forms, ARIA and screen-reader support, and reports issues with... |
| `/ai-audit` | opus | default | Deep audit of every AI implementation: system prompts, model selection, tools, RAG, error handling, cost and UX, flagging gaps, risks and... |
| `/cost-audit` | sonnet | default | Analyzes infrastructure and AI spend, model choices, token limits, call frequency, and finds the biggest cost drivers and savings. |
| `/data-audit` | sonnet | default | Comprehensive data-quality audit, currency, completeness, accuracy and integrity, using sampling, cross-referencing and anomaly detection. |
| `/database-review` | opus | xhigh | Audits the database schema, migrations, indexes, RLS policies and data health for correctness and consistency. |
| `/dependency-audit` | sonnet | default | Audits npm dependencies for vulnerabilities, outdated and unused packages, and safe upgrade paths. |
| `/design-review` | opus | default | Independent multi-agent design review. Captures the rendered UI, runs a blind panel of specialist agents, and synthesizes convergent findings into a... |
| `/env-audit` | sonnet | default | Audits environment variables for mismatches between what the code expects, what's documented and what's set. |
| `/ia-audit` | sonnet | default | Audit site + codebase for information-architecture and link-hygiene problems: orphaned pages, broken/duplicate links, missing marketing & footer... |
| `/mobile-review` | sonnet | default | Audits every page and component for mobile usability across 320 to 768px: responsiveness, tap targets, overflow and layout. |
| `/model-audit` | sonnet | default | Scans code, config, agents and commands for pinned, deprecated or mismatched Claude model IDs and tiers. Report only. |
| `/performance-review` | sonnet | default | Reviews the codebase for performance bottlenecks, rendering, bundles, queries and AI calls, with fixes. |
| `/pre-launch-review` | sonnet | default | Single-pass launch-readiness audit combining the security, SEO, performance, access, privacy and resilience blockers. |
| `/privacy-review` | opus | xhigh | Maps personal-data flows and checks handling against applicable privacy law, flagging compliance gaps. |
| `/resilience-review` | opus | xhigh | Assesses how the app handles failure, degrades gracefully and recovers, error handling, boundaries, silent failures and timeouts. |
| `/security-review` | opus | xhigh | Comprehensive security review of the whole codebase, authn/authz, secrets, injection, access control and more. |
| `/seo-audit` | sonnet | default | Technical SEO audit, meta and head tags, structured data, sitemaps, canonicals and semantic structure, with a prioritized report. |
| `/structure-review` | sonnet | default | Reviews file and folder structure for organization, consistency and convention, flagging clutter and misplacement. |
| `/ux-review` | sonnet | default | Senior UI/UX review of every page, flow and interaction: usability, visual design, information architecture and polish. |
| `/config-audit` | sonnet | default | Audits configuration across hosting, database, payments, OAuth, DNS and the app code for mismatches, missing settings and broken connections. |
| `/audit-claude-md` | sonnet | default | Audits the project's CLAUDE.md against the actual codebase for stale, missing or inaccurate claims. Report only. |
| `/autopilot-audit` | sonnet | default | One-time readiness audit for supervised autopilot: finds lifecycle gaps, drafts what it can, and raises GitHub issues for anything needing approval. |

### Set up

Add a standard piece of infrastructure.

| Command | Model | Effort | What it does |
|---|---|---|---|
| `/add-health-check` | sonnet | default | Adds a health-check endpoint that verifies database, auth and core services are operational. |
| `/add-llm-tracing` | sonnet | default | Adds LLM observability so every AI call is tracked for latency, tokens, cost and success/failure. |
| `/add-max-duration` | sonnet | default | Adds maxDuration exports to every API route to prevent serverless function hangs. |
| `/add-error-tracking` | sonnet | default | Adds error tracking to the project following the standard setup sequence. |
| `/add-rate-limiting` | sonnet | default | Replaces the in-memory rate limiter with a shared store so limits persist across cold starts and instances. |

### Daily and ops

Start the day, watch production, tidy up.

| Command | Model | Effort | What it does |
|---|---|---|---|
| `/morning` | sonnet | default | The daily startup brief: what happened overnight, what's broken, what you planned, and what to focus on. |
| `/session-start` | haiku | default | Orient this session before any work |
| `/session-end` | sonnet | default | Leave the next session a clean start |
| `/ops-health` | sonnet | default | Full operational health check across deployment, data, crons, logs and dependencies: the daily standup for a running product. |
| `/telemetry-sweep` | opus | default | Sweep error, trace, database and deploy telemetry for bug signals, correlate across sources, and produce ranked root-cause analysis with... |
| `/portfolio-status` | sonnet | default | Reads context across all projects and gives a synthesised cross-portfolio view. |
| `/recap` | sonnet | default | Concise recap of a finished problem-solving arc, issue, root cause, fix, why it's right, what's next |
| `/sync` | sonnet | default | Gets the current branch safely in sync with its remote, confirming before anything destructive. |
| `/prune-branches` | sonnet | default | Deletes local git branches whose remote counterpart is gone and prunes stale worktree entries. Confirms scope before deleting anything. |
| `/autopilot-run` | opus | high | Runs the weekly supervised autopilot sweep: executes approved automations, drafts what needs approval, notifies, and raises issues for decisions. |
| `/smoke-test` | opus | high | Adversarially exercise a live product with a throwaway account, cross-reference what the UI claims against committed state and telemetry, and fix... |
| `/test` | opus | high | Interactive test harness: describe what to test, run it via Playwright with throwaway accounts, get a report with issue-ready summaries. |
| `/test-gen` | sonnet | default | Writes Playwright end-to-end regression tests for a shipped feature or fixed bug, then runs them to prove they pass. |

### Write and explain

Produce documents, summaries and ideas.

| Command | Model | Effort | What it does |
|---|---|---|---|
| `/ai-story` | sonnet | default | Reads the codebase and produces a compelling, honest, non-technical narrative of how the product uses AI, for users, buyers and investors. |
| `/api-docs` | sonnet | default | Generates developer-facing API reference documentation from every API route. |
| `/changelog` | sonnet | default | Generates clear, non-technical release notes from recent git history for product, investor and user updates. |
| `/client-security-brief` | opus | default | Produces a client-facing security and data-practices document, with every claim verified against the actual code. |
| `/feature-summary` | sonnet | default | Produces a clear, non-technical feature summary for stakeholders and clients. |
| `/marketing-brief` | sonnet | default | Extracts an accurate, up-to-date marketing brief from the codebase: real capabilities, pricing and positioning, for copy and collateral. |
| `/voice-learn` | sonnet | default | Compares a draft you edited against the original, extracts what changed and why, and saves the lessons for future drafts. |
| `/persona-panel` | opus | high | Runs an artifact (pitch, page, feature, copy) past the relevant buyer/user personas and synthesizes where they agree and split. |
| `/design-develop` | opus | default | Develop a design from problem to build-ready spec. Frames the problem, generates genuinely distinct directions, gates on your choice, then develops... |
| `/ideate` | opus | default | Proactively scans the codebase and context and surfaces improvements worth making that you didn't ask for. |

---
description: "Deep audit of every AI implementation: system prompts, model selection, tools, RAG, error handling, cost and UX, flagging gaps, risks and inconsistencies."
argument-hint: '[optional: feature, route or directory to focus on]'
model: claude-opus-5-5
---
# /ai-audit

The argument optionally names a feature, route or directory. If given, audit AI code in that scope only, but still note cross-cutting issues it touches. If empty, audit the whole project.

Audit every AI implementation in the project: system prompts, model selection, tool definitions, retrieval pipelines, error handling, cost and user experience. Find inconsistencies, gaps, risks and improvements.

Read EVERY file that touches AI: system prompts, persona definitions, API routes that call AI services, tool definitions, embedding pipelines, scheduled jobs that generate AI content, and client components that display AI output.

## System prompts

**Inventory.** List every system prompt with its name and location, purpose, approximate word count and the model it goes to. Flag duplicates and near-duplicates. Flag prompts defined inline in routes that should be centralized.

**Quality.** For each prompt, ask:
- Is the role clearly defined?
- Are the instructions specific and unambiguous?
- Is the output format explicit (JSON schema, markdown, plain text)?
- Are the boundaries defined (what the AI must not do)?
- Is there a fallback for when the AI does not know?
- Would examples help?
- Is it bloated, with redundant or outdated sections?
- Do any instructions conflict?
- Does it rely on shouting (all caps, "CRITICAL", "NEVER EVER") instead of explained instructions? Calm instructions with the reason attached usually work better.
- Is JSON output enforced by a structured-output feature or a tool schema, or only requested in the prompt?

**Consistency.** Do all prompts apply the same voice and style rules the project defines? Do formatting rules agree (one says no markdown, another expects it)? Do prompts handle edge cases the same way (empty input, off-topic questions, harmful requests)? Are persona boundaries consistent?

**Risks.** Can a user extract the prompt by injection? Is user input concatenated into prompts without delimiters? Does any prompt hold secrets, internal URLs or customer names? Could any prompt produce harmful or legally risky output? Is any prompt so vague that quality is unpredictable?

## Model selection

- Map every AI call to its model, feature and reason. List every model string. Flag retired or older IDs as upgrade candidates, and model strings hardcoded in many files instead of one shared constant.
- Is each model right for its task? Small models for routing, classification and extraction. Mid-tier models for synthesis and generation. The strongest models only where the quality difference justifies the cost. Flag expensive models on simple tasks and cheap models where quality suffers.
- Are reasoning or effort settings used on purpose (on for hard reasoning, off for latency-sensitive simple calls)?
- Are model versions pinned or floating? Pinned is safer for consistency.
- Cost: find the highest-volume calls, rate relative cost per feature (high, medium, low), flag oversized token limits, flag calls that send too much context, look for prompt-caching opportunities, and flag calls that deterministic logic could replace.

## Tool use and function calling

- Inventory every tool: name, purpose, parameters, the model that uses it.
- Quality: are descriptions clear enough for correct selection? Are parameter types and constraints specific? Are required and optional parameters right? Do any tools overlap? Are any tools missing? Are results in a consistent shape?
- Reliability: what happens when a tool fails, times out or returns nothing? Is there a maximum number of tool rounds? Are results validated before they go back to the model? Can a malformed result cause a wrong answer or a crash? Does the whole loop have a timeout?

## Retrieval and embeddings (if used)

- Pipeline: what is embedded, and is it relevant and current? What is the chunking strategy (size, overlap, boundaries)? Is content deduplicated? How often is it refreshed? Are embeddings regenerated when content changes?
- Retrieval: how many chunks per query? Is the similarity threshold sensible? Is there metadata filtering (per user, tenant or domain)? Are results ranked? Would hybrid search help?
- Gaps: is there knowledge the AI should have and does not? Are there stale documents? Is uploaded content checked before it is embedded?

## Streaming and delivery

- Which features stream and which return JSON? Is each choice right?
- For streams: is mid-stream error handling in place? What happens if the stream drops?
- Is there a loading indicator? For non-streaming calls, is the typical wait acceptable?

## Error handling and fallbacks

- API failures: what happens on a rate-limit error, a server error or a timeout? Is there retry with backoff? Is the user told, or does it fail silently? In scheduled batches, does one failure stop the whole batch?
- Bad output: malformed JSON, a refusal, a hallucination. Is output validated (schema, sanity, bounds)? Is there a fallback message?
- Cost protection: per-user rate limits, per-request token limits, a circuit breaker for runaway spend, and abuse by long inputs or repeated requests.

## User experience

- Input: is it clear what users can ask? Are there guardrails such as length limits? Can users give context well?
- Output: is AI content marked as AI? Is the format right for the context? Can users copy, save, edit, approve or reject? Can they regenerate or refine? Is there a feedback mechanism?
- Personas (if any): is each consistent across features, distinct from the others, and respected at the boundaries? Is the UI presentation consistent?

## Observability

- Are AI calls logged with model, tokens, latency and outcome? Is cost tracked per feature? Is quality tracked (feedback, regeneration rate, error rate)? Can you see which features are used most and fail most?
- If LLM tracing is configured, is every call instrumented? If it is not configured, flag that as a critical gap.

## Compliance and safety

- Which features send personal data in prompts? Is it minimized?
- Do AI logs create privacy obligations?
- Are there content safety filters for user-facing AI?
- Is AI use disclosed? Are AI-written messages marked as AI-assisted?

## Output format

1. **Architecture summary.** A diagram of AI components, models, data flows and user touchpoints.
2. **Findings ranked by severity.** Critical (failures, security, cost exposure), major (quality, consistency, UX), minor (polish). Each with its location and a specific fix.
3. **Prompt scorecard.** Prompt | Purpose | Clarity | Boundaries | Format | Injection risk | Style consistency | Score out of 10.
4. **Model efficiency map.** Feature | Current model | Suggested model | Reason | Relative cost impact.
5. **Risk register.** Risk | Likelihood | Impact | Current mitigation | Suggested mitigation.
6. **Improvement roadmap.** The top 10 changes by impact, each with what, why, difficulty and expected effect.

Save the report to `docs/ai-audit.md`.

## Rules

- Read the actual prompts word by word. Do not skim or summarize.
- Test prompt logic by hand: "If a user asked X, what would this prompt produce?"
- Be specific: file, line and function for every finding.
- Do not suggest a different AI provider or an architecture rewrite. Suggest changes that can ship step by step.
- Cost estimates are relative (high, medium, low). You do not know the usage volume, so give no dollar figures.

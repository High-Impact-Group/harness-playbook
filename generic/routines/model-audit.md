# model-audit

Find every place a language model is chosen in this project. Check that each choice is current and fits the work. Report only. Change nothing.

Input: an optional path or area to limit the scan. If it is empty, scan the whole repo plus the project's agent, role and command definitions.

## Step 1: Inventory

Search code, config, environment examples, CI files and the header of every agent, role or command definition for model references. Look for model ID prefixes of every vendor in use, `model:` settings, `MODEL` constants and environment variables, and embedding and speech model names. For each hit, record the file, the line and the value. Record whether it is a hardcoded ID, an alias (a short tier name that resolves to the latest model) or a constant or environment variable.

## Step 2: Check currency

Look up the current model list in each vendor's official documentation before you judge. Never rely on memory for what is current. Flag:
- **Deprecated or retired IDs.** Anything the documentation lists as deprecated, and dated version IDs that have a newer equivalent.
- **Hardcoded IDs scattered across files** that should be one constant or one environment variable.
- **Aliases that mean different things in different contexts.** A bare alias in an agent or command definition resolves to the latest model. An ID in app code is pinned.
- **Embedding, speech-to-text and text-to-speech models** that a vendor changed or deprecated. Check the vendor's documentation.

## Step 3: Check fit

For each AI call, judge the tier against the work. Pick the cheapest model that does the job.
- **Smallest tier:** lookups, classification, extraction, routing and summarizing existing text.
- **Mid tier:** well-specified generation, checklist audits and most coding.
- **Strongest tier:** deep reasoning, orchestration, ambiguous design and high-stakes judgment.

Flag over-specification (the strongest tier on a classifier) and under-specification (the smallest tier on multi-step reasoning). Check that the token limit, the temperature and the prompt-caching settings suit the chosen model. Some models reject some parameters, so check the documentation.

## Step 4: Report

Write `docs/audits/model-audit-YYYY-MM-DD.md` with a table:

| File:line | Current value | Type | Issue | Recommended | Effort |
|---|---|---|---|---|---|

Group the findings by severity:
- **Broken soon.** Deprecated or retiring.
- **Wrong tier.** Over- or under-specified.
- **Hygiene.** Hardcoded or scattered.

Finish with the three highest-value changes. If you could not reach the documentation, say so and mark the currency findings as unverified.

## Guardrails

- Do not change a model ID or a tier. Recommend only. A tier change affects quality and cost, so the owner decides.
- Never claim a model is current or deprecated without a documentation source. Say "unverified" instead.

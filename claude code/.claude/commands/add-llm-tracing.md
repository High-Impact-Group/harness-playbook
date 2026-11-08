---
description: Adds LLM observability so every AI call is tracked for latency, tokens, cost and success/failure.
model: claude-sonnet-5-5
---
# /add-llm-tracing

Add LLM tracing so every AI call records latency, token usage, cost and success or failure.

## Step 0: Check what exists

- Find every place the project calls an LLM provider, an embedding service or a speech service.
- Check whether tracing is already partly in place. If an older tracing SDK is installed, plan a migration and tell me before replacing it.
- Read the tracing service's current documentation for the installed framework version before writing code. API names change between releases. Treat the snippets here as the shape, not as final code.

## Step 1: Install

Install the tracing SDK and, if it needs one, the OpenTelemetry packages.

## Step 2: Register at startup

Register the tracing processor in the framework's startup hook (for example `instrumentation.ts` in Next.js). If the file exists already, add to it. Do not overwrite it.

- Do nothing when the keys are not set, so the app runs unchanged without tracing.
- Register only in the server runtime.
- Export the processor if routes need to flush it (Step 5).

## Step 3: Wrap AI calls

Wrap each AI call in a traced observation. Record the model, the input size, the output, token usage and a feature name.

- Read the model name from the project's model constant. Never hardcode a model ID in tracing code.
- Set the user and session on the trace where you have them.
- Use a generation-type observation for LLM calls and a plain span for other steps such as embeddings.
- Rethrow errors so existing error handling still works.
- If there are many call sites, write one shared helper instead of repeating the wrapper.
- Check field names against the docs for the installed version.

## Step 4: Environment variables

Add the keys and the host variable to the example environment file, with a comment on where to find each. Never commit real values.

## Step 5: Flush on serverless

Spans are exported in the background, so a serverless function can freeze before they are sent. Flush after the response is sent, using the framework's after-response hook. Use the pattern the tracing docs recommend for the installed version. Scheduled and background routes need the same.

## Step 6: Verify

1. Build the project.
2. Set the keys locally and trigger an AI call. The trace should appear within seconds with model, tokens and cost.
3. Unset the keys and confirm the app still works.

## Minimum coverage

- Every LLM call, on every model
- Every embedding call
- Every speech-to-text or text-to-speech call
- AI calls made by scheduled jobs

Include where you can: feature name, user ID, model, and whether the call came from a scheduled job or a user.

## Do not

- Block a request on a tracing failure. Tracing must never break a request.
- Send personal data in trace inputs or outputs. Scrub names and emails, or send metadata only.
- Hardcode model IDs in tracing code.
- Trace non-AI calls such as database queries or payments.
- Forget the serverless flush. Traces are lost without it.

## Finish

Add the tracing service, its environment variables and the startup registration to the project instructions file.

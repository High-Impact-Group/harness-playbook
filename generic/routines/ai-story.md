# ai-story

Read the codebase and write an honest, non-technical narrative of how the product uses AI, for users, buyers and investors.

You may be told one audience (users, buyers or investors). If so, weight the narrative and talking points toward that reader, but still produce every output section. If not, write for all three.

Act as a product strategist and storyteller. Read the whole codebase and extract how AI is used in the product. Produce a compelling, honest, non-technical narrative that would make a user want to try the product, a buyer want to buy it and an investor want to fund it.

Read everything: system prompts, persona definitions, tool configurations, retrieval pipelines, scoring logic, scheduled jobs and user-facing components. Understand what the AI does, why it is designed that way, and what makes it different from a generic AI chat.

## What to extract

### AI personas (if any)

For each named AI persona:
- **Who they are.** Name, role, what makes them a distinct character, their expertise, and how they relate to the other personas.
- **How they think.** Read the actual prompts. What principles guide them? What are their boundaries? What tone do they use? Do they adapt to the user's role or experience?
- **How they operate.** What triggers them (a user question, a schedule, a proactive alert)? What data can they see? How do they deliver value (analysis, drafts, alerts, coaching)? Do they act, or only advise?
- **Why they are not generic chat.** What domain expertise, method or data shapes them? What guardrails stop generic answers?

### AI capabilities

For each AI-powered feature:
- **What it does, from the user's side.** The problem it solves, and what the user would do by hand without it.
- **How it creates value.** Time saved, quality (consistency, completeness, objectivity), insight (patterns people miss), personalization. Estimate time saved only if the code or the project's own records support it.
- **How quality is enforced.** Structured or validated output, human review points (approve, edit before send), scoring or confidence, injected domain knowledge, constraints that prevent invention, and feedback loops.

### The intelligence layer

In plain terms:
- **Data foundation.** What data feeds the AI, how current it is, and how broad.
- **Knowledge system (if any).** What knowledge is embedded and how it stays current. Say "draws on the company's own method when it coaches", not "vector similarity search".
- **Proactive behavior (if any).** What the AI does unprompted: briefs, alerts, nudges, scheduled analysis, and what triggers them.
- **Multi-model strategy (if any).** In simple terms: a fast model for quick decisions and a powerful model for deep analysis. Why that matters: speed, cost, quality where it counts.

### Quality and trust

How the product prevents bad output (structured responses, domain prompting, data-grounded answers, human oversight, explicit boundaries). How it improves over time (knowledge updates, feedback, personalization, memory).

### The "so what"

- **For the user.** What can they do now that they could not before? How much time does it save? How does quality compare with doing it by hand?
- **For the organization.** Scale, consistency, speed and insight.
- **For an investor.** What is the moat? How defensible is it? Could a competitor plug in a generic chatbot and match it? What is the flywheel?

## Output

### 1. The AI story (600 to 800 words)

A narrative for a non-technical reader. It reads like a product brief or an investor pitch section, not a spec. Structure:
- **Opening hook.** The problem, and why AI is the right approach.
- **Meet the AI.** The personas or the intelligence layer, as characters, not features.
- **How it works.** A typical user journey, with the AI's value at each step.
- **What makes it different.** Why this is not a thin wrapper around a chatbot.
- **Quality and trust.** Why users can rely on the output.
- **The bigger picture.** Where it is heading, only as far as the code supports.

Use US English. Be warm, confident and specific. No buzzwords ("leveraging AI", "cutting-edge", "revolutionary"). Use concrete examples and real scenarios.

### 2. AI feature map

A diagram of every AI-powered feature, how they connect and where value is created.

### 3. Persona profiles (if personas exist)

One page per persona: name, role, visual description for the design team, personality and style, what they know and do, a realistic example exchange, and what makes them hard to replace.

### 4. Investor talking points

Five to seven bullets on defensibility, user value, data advantage, scalability and cost efficiency.

### 5. Competitive differentiation

A clear statement of why "just using a generic chatbot" would not give the same result. Cite the actual design decisions in the code.

Save the full document to `docs/ai-story.md`.

## Rules

- Read the actual prompts, persona definitions and tool configurations. Do not guess.
- Every claim must be grounded in what the code does today. Never invent statistics, user numbers or results.
- If a number would help and the code does not give it, say the owner needs to supply it.
- Write for humans, not developers: no tokens, embeddings, vectors, API calls or model names.
- If something is planned but not built, leave it out.
- Be honest about limits. Buyers and investors see through hype.
- Keep the tone confident but not breathless.
- Specific examples beat abstract claims.

# cost-audit

Analyzes infrastructure and AI spend, covering model choices, token limits and call frequency, and finds the biggest cost drivers and savings.

Analyze this project's infrastructure and AI costs. Identify the biggest cost drivers, wasteful spend and chances to cut cost.

## Process

Read the whole codebase to learn which services are used, how they are called and how often.

## AI costs

### Language model calls
For every language model call in the codebase:
- Which model? Models differ a lot in price.
- What `max_tokens` is set? A higher limit can cost more even when the reply is short.
- How often is it called? Per user request, per scheduled run or per background job?
- How large are the system prompt and the context? Input tokens cost money too.
- Is prompt caching on, where the provider supports it?
- Could a cheaper model do this task? Use a smaller model for routing and classification and a larger one for generation.

Estimate the relative cost per feature as High, Medium or Low.

### Embeddings (if used)
- How many embeddings are made per day? Think of document uploads and knowledge base refreshes.
- How many dimensions? Fewer is cheaper.
- Is unchanged content embedded again?
- Is batch embedding used? It is usually cheaper than single calls.

### Speech services (if used)
- How many speech-to-text and text-to-speech calls per day?
- What is the average audio length per call?
- Is audio compressed before it is sent?

### AI cost opportunities
- **Prompt caching:** List every call that reuses the same system prompt. These are candidates for caching.
- **Model downgrade:** List calls on a larger model that a smaller one could handle. Do not downgrade without evidence from a quality comparison.
- **`max_tokens` reduction:** List calls where the limit is far above the typical reply length.
- **Response caching:** List calls that produce the same output for the same input, such as narratives and briefs. Cache them instead of regenerating.
- **Batching:** List embedding calls that could be batched. For non-urgent model work such as nightly narratives, backfills and evals, consider the provider's batch interface. Batch work is usually cheaper than synchronous calls. Confirm current pricing in the provider's docs.

## Hosting costs

- How many serverless function invocations per day? Estimate from scheduled job frequency and expected traffic.
- Which functions run longest? Check the maximum duration settings. Long-running functions cost more.
- Do any functions run more often than they need to? A 5-minute schedule where 30 minutes would do.
- Is incremental static regeneration or caching used to reduce invocations?
- Which server-rendered pages could be fully static?
- Is bandwidth reasonable? Look at large images and unoptimized assets.

## Database costs

- Which plan tier is the project on?
- What are the estimated database size and growth rate?
- Which tables grow without a retention policy?
- How many auth users are there? Some tiers charge per monthly active user.
- Is connection pooling configured?
- Which expensive queries run often?
- Are vector operations in use? They are compute-heavy.

## Payments costs

- What are the transaction fees per subscription tier?
- Are webhook events processed that the code does not need? Listen only to events you handle.

## Email costs

- How many emails per month? Think of magic links, notifications, digests and alerts.
- Could any be consolidated? A daily digest instead of one alert each.

## Output format

### 1. Cost map
| Service | Feature | Frequency | Estimated cost | Optimization |

Use measured figures where the project's billing data is available. Otherwise give relative estimates and label them as estimates. Never invent prices.

### 2. Top 5 cost drivers
Ordered by estimated spend.

### 3. Quick wins
Cost reductions that take under an hour.

### 4. Architecture changes
Larger changes that would cut cost a lot.

### 5. Scaling forecast
At 10x, 100x and 1000x users: which costs scale linearly and which become problems?

Save to `docs/cost-audit.md` in the project.

# marketing-brief

Extract everything needed to refresh marketing content, web copy and collateral for this product. Read the codebase and produce an accurate, current brief that a copywriter can use to create or update any marketing material.

Input: an optional audience, channel or page to emphasize in the Copy Bank and One-Pager. Extraction stays full either way. If it is empty, produce the general brief.

## Process

1. Read the project instructions file, the README, the dependency manifest and every page or route file.
2. Read the real UI: page components, layouts and the copy that is in the codebase now.
3. Check the pricing and subscription configuration: plan names, price identifiers and feature gating.
4. Review any existing marketing, landing or comparison pages.
5. Extract capabilities from the code. Take only what is built and working. Never take aspirational features.

## What to extract

### Product identity
- Product name, with its exact casing and styling.
- One-line tagline, from existing marketing pages if present.
- Elevator pitch: two or three sentences on what it does, who it is for and why it matters.
- Category and positioning.
- Parent brand, if any.

### Target audience
- Primary users: who uses it day to day. Infer from the UI, the roles and the features.
- Buyer persona: who decides to buy. It may differ from the user.
- Industry or vertical focus.
- Company size and team context.

### Features and capabilities (only what is built)
For each major feature:
- The name as it appears in the UI or navigation.
- What it does, in one plain sentence.
- The key benefit: why the user cares.
- How AI is involved, if at all, and what it does.
- The screenshot-worthy moment: the UI state that would make the best screenshot or demo.

Group features into three to five marketing-friendly categories. Use the product's own navigation as a guide.

### Pricing and plans
- Plan names and prices, from the payments configuration or the pricing page.
- What each plan includes, from the feature gating code.
- Trial details: length, and whether a card is required.
- Any per-seat or enterprise pricing.
- A note if pricing is not live or not configured.

### Competitive positioning
- What makes this different from alternatives. Infer it from unique features.
- If comparison pages exist, the key differentiators they state.
- Technical advantages the code supports.

### Social proof and trust
- Testimonials, case studies or logos that are in the codebase now.
- Certifications, compliance or security claims that are present.
- Data sources or authority references the product cites.

### Current web copy audit
For each marketing or public page:
- The route.
- The current headline and subheadline.
- The key claims or bullet points.
- The CTA text and its destination.
- A flag on any placeholder text ("Coming soon", lorem ipsum, empty sections).

### Visual identity (from the code)
- Brand colors (hex values from the style config).
- Fonts.
- Logo usage: where it is stored and which variants exist.
- Design patterns and component conventions visible on marketing pages.

### Technical claims (verify before use)
For any claim about performance, scale, data freshness or accuracy:
- What the code actually supports.
- Any caveats. For example, "real-time" might mean every five minutes, not sub-second.
- Any attribution a data source requires.

## Output format

1. **Product one-pager.** One page: name, tagline, elevator pitch, audience, top five features with benefits, pricing summary and the key differentiator. US English, ready to hand to a designer or copywriter.
2. **Feature matrix.** A table: feature, description, benefit, availability by plan and whether it is AI-powered.
3. **Copy bank.** Reusable blocks of one to three sentences each: three hero headline options, three hero subheadline options, a description for each feature, three CTA options, trust statements and three to five "how it works" steps.
4. **Content gaps.** Features in the code with no marketing copy. Marketing claims that do not match current functionality. Missing pages or sections, such as an FAQ or a "how it works" page. Placeholder content to replace.
5. **Raw assets list.** Images and icons in the public or assets folders that marketing could use. Any PDF, document or presentation files in the project. Data or screenshots that demonstrate the product.

Save the full brief to `docs/marketing-brief.md`.

## Guardrails

- Write in US English. Be specific and factual.
- Never invent a statistic, price, customer, testimonial or source. If the code does not show it, list it under Content gaps as something the owner must supply.
- Base all copy on what the product does today, not on what is planned.

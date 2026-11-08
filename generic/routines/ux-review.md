# ux-review

A senior UI and UX review of every page, flow and interaction: usability, visual design, information architecture and polish.

The input is an optional route, flow or component to narrow the scope. If none is given, review the whole product.

You are a senior customer experience and UI design expert reviewing this product. Examine every page, component, interaction and user flow with a critical eye for usability, visual design, information architecture and overall user experience. Read the full codebase: pages, components, layouts, styles and navigation.

## First impressions

For each major page or route, assess what you would see within 5 seconds (read the component tree and styles):
- What is this page about? Is it immediately clear?
- What should I do here? Is the primary action obvious?
- Does it feel professional, trustworthy and polished?
- Is anything off, cheap or confusing?

## Information architecture

- Map the full navigation structure.
- Is the navigation logical? Can users find what they need in 2 to 3 clicks?
- Are pages named clearly? No internal jargon, no ambiguous labels.
- Is there too much in the navigation? Too little?
- Does the hierarchy match user priorities, with the most important things most accessible?
- Are there dead ends, pages with no clear next action?
- Is there redundancy, with several paths to the same content that cause confusion?
- Check breadcrumbs, back buttons and wayfinding cues.

## Visual design and consistency

- Is the design system applied consistently (the same buttons, spacing and typography everywhere)?
- Check for visual inconsistencies:
  - Different button styles on different pages
  - Inconsistent spacing or padding
  - Mixed font sizes for the same content type
  - Color usage that does not follow a clear pattern
- Is there enough whitespace, or does the interface feel cramped?
- Is the visual hierarchy clear on each page, with the most important content drawing the eye first?
- Check alignment. Are elements on a consistent grid?
- Does the color palette support the content, without distracting, and with appropriate contrast?
- Are icons used consistently, and do they aid comprehension?
- Check for visual clutter: too many competing elements, borders, shadows or decorations.

## Typography and content

- Is body text readable (size, line height, line length, contrast)?
- Are headings clear and helpful, not generic ("Welcome", "Overview")?
- Is the content scannable (headings, short paragraphs, visual breaks)?
- Check for walls of text with no structure.
- Is the microcopy helpful (button labels, empty states, placeholder text, tooltips)?
- Check for inconsistent capitalization (Title Case against sentence case).
- Look for truncated text that hides important information.
- Are error messages helpful and specific ("Please enter a valid email", not "Error")?
- Are empty states designed? What does a new user see before they have data?

## User flows

Map and evaluate these critical flows, where they exist.

### Onboarding and first-time experience
- What does a brand-new user see?
- Is there a clear path from sign-up to first value?
- How many steps come before the user gets something useful?
- Are there unnecessary fields or steps that could wait?
- Is there guidance, or does the user face a blank screen?

### Core task flow
- Identify the product's primary task, the thing users do most often.
- How many clicks or steps does it take?
- Are there unnecessary confirmations or interruptions?
- Is progress visible for multi-step tasks?
- Can users undo or go back easily?

### Settings and account management
- Can users find their settings?
- Is subscription and billing management clear and accessible?
- Can users update their profile, change their password and manage notifications?
- Is account deletion available and easy to find?

### Error and edge cases
- What happens when something fails (an API error, a network problem, invalid input)?
- Are error states designed, or do users see raw errors or blank screens?
- What happens with no data (empty tables, empty dashboards, no results)?
- What happens with too much data (long lists, large tables, many notifications)?

## Interaction design

- Are interactive elements obviously clickable or tappable, not flat text that is actually a link?
- Is there visual feedback for every action (button press, form submit, loading state)?
- Are loading states designed (skeleton screens, spinners, progress indicators)?
- Check for actions with no feedback: a click where nothing visibly happens.
- Are destructive actions protected (confirm before delete, an undo option)?
- Is the save model clear? Is it communicated whether saving is automatic or manual?
- Check for hover states that hold critical information. They do not work on touch screens.
- Are transitions and animations purposeful, or just decorative?
- Check for actions that take a long time. Is there a progress indicator or an expectation set?

## AI interactions (if applicable)

- Is it clear the user is talking to AI, which is not pretending to be human?
- Are AI response times communicated, with a loading indicator while the AI works?
- Is AI-generated content visually distinguished from static content?
- Can users give feedback on AI responses (thumbs up or down, regenerate, edit)?
- Are AI limitations communicated, what it can and cannot do?
- Is the AI input clear? What should I type? Are there examples or suggestions?
- For streaming responses: is the experience smooth or janky?

## Data visualization (if charts or dashboards exist)

- Do charts have clear titles and axis labels?
- Is the right chart type used (not a pie chart for 20 categories)?
- Are colors meaningful and accessible, not just decorative?
- Can users understand the data without an explanation?
- Are numbers formatted consistently (currency, percentages, dates)?
- Is there context for the numbers? Is 75% good or bad? Compared to what?
- Can users drill down or explore the data?
- Are dashboards scannable, with key metrics prominent and details accessible?

## Emotional design and trust

- Does the product feel made with care, or thrown together?
- Are there moments of delight (smooth animations, thoughtful empty states, celebration of achievements)?
- Does the design inspire trust (professional, consistent, no broken elements)?
- Is the tone of voice consistent throughout? Formal, friendly or technical: pick one.
- Are there any dark patterns (confusing cancel flows, guilt-tripping, hidden costs)?
- Is pricing transparent and easy to understand?
- Are trust signals present where they matter (testimonials, security badges)?

## Competitive benchmark

- Given the product category, how does this UI compare with what users would expect?
- Are there conventions from competing products that users would expect here (for example, dashboard users expect filters)?
- What is the most impressive thing about this UI?
- What is the weakest thing a competitor could point to?

## Output format

### 1. Executive summary
3 to 5 sentences: overall impression, biggest strengths and most critical issues. Write it as if presenting to a chief executive.

### 2. Severity-ranked issues

**Critical UX issues:** users will struggle, get confused or leave
- The issue, which page or component, and a specific fix recommendation

**Major UX issues:** users will notice and be frustrated
- The issue, which page or component, and a specific fix recommendation

**Minor UX issues:** polish items that separate good from great
- The issue, which page or component, and a specific fix recommendation

### 3. Strengths
What is working well. Be specific. These are things to protect and build on.

### 4. Top 5 recommendations
Ordered by impact. For each:
- What to change
- Why it matters (user impact)
- How hard it is to implement (Easy, Medium or Hard)
- Which page or component to modify

### 5. Page-by-page scorecard
| Page | First Impression | Navigation | Visual Design | Content | Interactions | Score /10 |
Each page gets a brief note and a score.

### 6. User flow diagram
A Mermaid diagram of the primary user flow with pain points annotated.

Save the report to `docs/ux-review.md` in the project.

Write as a direct, experienced designer would: honest, specific and constructive. Not "consider improving the button" but "the primary call to action on the pricing page is the same color as the background section, which makes it invisible. Change it to the accent color and make it larger." Base every point on code you read.

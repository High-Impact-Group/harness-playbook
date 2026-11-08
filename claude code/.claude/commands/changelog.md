---
description: Generates clear, non-technical release notes from recent git history for product, investor and user updates.
argument-hint: '[optional: date range or commit count]'
model: claude-sonnet-5-5
---
# /changelog

Generate user-facing release notes from recent git history. Read the commits, understand what actually changed, and write clear, non-technical release notes for product updates, investor communications and user announcements.

## Process

1. Read recent git history:
```bash
git log --oneline --since="2 weeks ago"
```
If The argument gives a date range or a number of commits, use that instead.

2. For significant commits, look at the actual code changes:
```bash
git show <commit-hash> --stat
```

3. Group the changes by type and write them in user-facing language.

## Grouping

Use these categories. Skip any with no entries.

### New Features
- New things users can do that they could not do before.
- Describe what the user gains, not what was coded.
- Say which part of the product it is in.

### Improvements
- Better versions of existing features: faster, clearer, more options.
- UX improvements such as layout, navigation and responsiveness.
- Performance improvements. Describe the effect on the user, not the technical change.

### Fixes
- Bugs that were resolved.
- Say what was broken and that it now works.
- Leave out internal refactors that users would not notice.

### Security and Privacy
- Hardening, new protections and privacy improvements.
- Frame it positively: "Added content security headers", not "Fixed missing security headers".
- Include changes that matter for compliance, such as policy updates or data handling changes.

### Behind the Scenes
- Infrastructure, monitoring or operational improvements.
- Keep it to 1 or 2 sentences.
- Include it only if it matters, for example "Improved data refresh reliability", not "Refactored a scheduled job".

## Writing style

- US English.
- Plain language. No jargon, no technical terms, no file paths, no package names.
- Write for the end user, not for developers.
- Each item is 1 or 2 sentences at most.
- Lead with the benefit, not the mechanism.
- Use the active voice: "You can now...", not "A feature was added that...".
- Be specific: "Export your list as CSV", not "Added export functionality".
- Use only what the commits show. Never invent a feature, a metric or a benefit.

## Output formats

Produce three versions.

### 1. Full changelog (for docs and product updates)
The complete grouped changelog with all categories and a date header.

### 2. Short summary (for email or a newsletter)
3 to 5 bullet points on the most important changes. Under 150 words. A conversational tone.

### 3. One-liner (for social media or a team channel)
One sentence on the most significant change. Under 30 words.

## Examples

**Good:**
- "The assistant can now answer questions about shipping restrictions across all regions."
- "Weekly digest emails now include risk scores alongside status updates."
- "Fixed an issue where charts did not load on mobile devices."

**Bad:**
- "Added shipping tool to the chatbot tool definitions array" (too technical)
- "Various bug fixes and improvements" (too vague)
- "Refactored the ingestion pipeline to use batch processing" (users do not care)

Save the full changelog to `docs/changelog.md` in the project. If a changelog already exists, add the new entries at the top.

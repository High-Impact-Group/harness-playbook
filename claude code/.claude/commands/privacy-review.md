---
description: Maps personal-data flows and checks handling against applicable privacy law, flagging compliance gaps.
argument-hint: '[optional: feature, data type or third party to focus on]'
model: claude-opus-5-5
effort: xhigh
---
# /privacy-review
Perform a comprehensive privacy review. Map all personal data flows, find compliance gaps, and check that data handling fits the privacy law that applies to this product. Report only.

## Scope

`$ARGUMENTS` is an optional feature, data type or third party to focus on. If given, map that flow end to end and still flag any critical gap you see elsewhere. If empty, review the whole project.

## The law that applies

Ask the owner which privacy laws apply (for example the laws of the countries where users live, and any sector rules). Do not assume one. Check the product against the principles those laws share: notice, purpose limits, minimization, security, retention, individual rights and cross-border transfer. If you are not told, say which law you assumed and why. You are not a lawyer. Flag gaps for legal review. Do not state legal conclusions as settled.

## Data inventory

- Identify all personal information the application collects.
- For each data point, record:
  - What it is (name, email, voice recording, location, usage behavior).
  - Where it is collected (signup form, API call, upload, tracking).
  - Where it is stored (the database, a third-party service).
  - How long it is kept (check retention policies and cleanup jobs).
  - Who can access it.
- Flag sensitive information: health, financial, biometric, political.
- Check for data collected implicitly: IP addresses held by rate limiters, device details, location.

## Data flows to third parties

Map every external service that receives personal data. For each one, answer:

- What user content or personal data does it receive? Is it necessary?
- Are prompts, payloads or recordings logged by the service?
- Is there a data processing agreement?
- Does the data leave the user's country?

Cover at least these categories where the project uses them:

- The AI model provider: what personal data is sent in prompts?
- The embedding provider: what content is embedded, and does it hold personal data?
- Speech services: recordings can be biometric data. Is that disclosed?
- The payments provider.
- The email service: addresses and message content.
- The CRM or other sync target: what is synced, and is it two-way?
- The job queue or event service: what personal data is in event payloads?
- The hosting platform: server logs and analytics.
- The database: where it is hosted, and in which region.
- CI pipelines: do scripts process personal data?
- Scrapers: confirm scraped data does not include personal information.

## Consent and transparency

- Check that a privacy policy exists and is linked from signup and login.
- Check cookie consent where analytics cookies are used.
- Check that users are told about AI processing of their data, especially voice data.
- Check opt-in against opt-out for marketing messages.
- Look for dark patterns: pre-checked boxes, confusing consent flows.
- If bot protection is used: check that its disclosure is present.

## Data minimization

- Identify data collected that is not strictly necessary.
- Check AI prompts. Is the minimum necessary context sent out?
- If a retrieval pipeline exists: are documents scrubbed of personal data before embedding?
- Check that analytics events carry no unneeded personal data.
- Check that rate limiter logs do not keep IP addresses beyond the rate window.
- If browser storage is used: what personal data is stored on the client?

## User rights

- Can users access their own data (export or download)?
- Can users delete their account and all associated data?
- Check cascading deletes on user-linked tables.
- Look for data that persists after deletion: orphaned records, caches, embeddings.
- If users upload documents: can each one be fully removed, including its embeddings?
- If voice recordings are processed: are they stored, or handled transiently?
- Can individuals ask for correction of their data?

## Data security (privacy-specific)

- Check that personal data is encrypted at rest and in transit.
- Check for personal data in application logs.
- Check that development and staging environments hold no production personal data.
- If one database is shared between products: check data isolation.
- Check how AI conversation history is handled: stored, transient, deletable.

## Principles check

For each principle of the applicable law, answer yes, no or unknown, with the evidence:

- A clearly expressed privacy policy.
- Collection limited to what is reasonably necessary.
- Notice at or before collection.
- Use and disclosure limited to the purpose of collection.
- Cross-border disclosure documented and consented to.
- Reasonable steps to protect the information.
- Individual access and correction.

## Output format

1. **Privacy risk rating:** Critical, High, Medium or Low.
2. **Data map:** Data type, source, storage, third parties, retention, basis.
3. **Critical issues:** Privacy violations or high-risk gaps.
4. **Compliance gaps:** Requirements not yet met.
5. **Recommendations:** Specific changes, ordered by priority.
6. **Third-party data flow diagram:** A Mermaid diagram showing where personal data goes.

Save the report to `docs/privacy-review.md` in the project.

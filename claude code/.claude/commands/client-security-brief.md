---
description: Produces a client-facing security and data-practices document, with every claim verified against the actual code.
model: claude-opus-5-5
---
# /client-security-brief

Write a professional, client-facing security and data practices document for this product. Read the whole codebase so the document is accurate and verifiable and gives customers confidence that their data is safe. Do not overstate capabilities. Do not make a claim the code does not support.

## Process

1. Read the project instructions file, all config files, middleware, the auth implementation and the API routes.
2. Examine the database configuration, access policies and migration files.
3. Check every third-party integration and what data flows to each.
4. Review the implementation of encryption, headers, authentication and access control.
5. Check the privacy policy and terms of service if they are in the codebase.
6. Verify every claim against the actual code before you include it.

## Document structure

Write in professional but approachable US English. Explain any jargon. This document will go to enterprise customers, procurement teams and compliance officers.

### 1. Executive summary
3 or 4 sentences: what the product is, the approach to security and privacy, and the key trust points (for example data residency, encryption and compliance).

### 2. Data residency and storage

**Where data is stored.**
- Find the database region in the environment config or the project instructions file. Map region codes to plain English.
- State it plainly: "Your data is stored in <region> on <provider>."
- If data leaves the company's home country, say so. Never claim local residency that is not true.
- Note that the database provider runs on a major cloud with encryption at rest, if the code or config shows it.

**Where data travels.**
For each third-party service, say in plain English:
- What data is sent to it.
- Where its servers are.
- Whether the data is stored or processed transiently.
- What its data handling policy says, with a link to its security or privacy page.

Present it as a table:

| Service | What we send | Their location | Stored or transient | Their policy |
|---|---|---|---|---|

Be honest. If AI prompts that contain user data go to servers in another country, say so. Customers respect transparency more than vague reassurance.

### 3. Encryption and data protection

Describe what the code actually implements.

**In transit.** HTTPS or TLS on all connections. Check the framework config and middleware. Note the hosting platform's automatic certificates if they apply.

**At rest.** The database provider's encryption at rest. Note any extra application-level encryption.

**Authentication.**
- Describe the auth mechanism in plain English, not as implementation detail.
- Describe how sessions are managed.
- Say how passwords are handled: hashed, never stored in plain text.
- Describe multi-factor authentication only if it is implemented. Never claim it otherwise.

**Access control.**
- Row-level security, in plain English: "Every database query is automatically filtered to return only data that belongs to the signed-in user."
- Role-based access, if it applies.
- API authentication.

### 4. Security measures

Include only measures that are implemented in the code.

**Application security.**
- Input validation on API routes, if present.
- Content security policy headers, if configured.
- HSTS, if configured.
- CSRF protection, if present.
- Rate limiting. Describe the approach without exposing exact limits.
- Bot protection, if present.

**Infrastructure security.**
- The hosting platform's security posture.
- The database provider's security posture.
- Secret management: environment variables, never source code.

**Monitoring.**
- Error tracking, if configured.
- Uptime monitoring, if configured.
- If nothing is configured, leave this section out. Never claim monitoring that does not exist.

### 5. AI and data processing

If the product uses AI, explain:
- What data goes to AI services. Be specific, for example "your chat conversations" or "the notes you attach".
- Which provider processes it.
- Whether the provider stores the data, and whether it is used for training. Cite the provider's published policy.
- Whether conversation history is stored in the application database or processed transiently.
- What controls the user has, if any, over AI data processing.

### 6. Compliance and legal

**Privacy law.**
- Name the operating company and its registration number as placeholders unless the codebase states them.
- State alignment with the privacy law of the company's jurisdiction only if a privacy policy exists and covers it.
- Note cross-border disclosure of data where it applies.

**Industry standards.**
- Note the infrastructure providers' certifications, such as SOC 2 Type II or PCI DSS for payments, only where you can verify them.
- Never claim a certification that the product itself does not hold. Reference only the providers' certifications.

### 7. Data retention and deletion

- Document the retention policies that exist. Check scheduled cleanup jobs.
- Describe how users can ask for their data to be deleted.
- Note account deletion, if it is implemented.
- Be honest about what persists after deletion, such as backups, logs and analytics.

### 8. Incident response

- If there is a documented incident response process, describe it.
- If not, include a simple statement: "In the event of a security incident, affected customers will be notified within [X] hours by email."
- Leave `[X]` and any contact details you cannot verify as visible placeholders. List them at the end of your reply for the owner to confirm. Never invent a commitment or an email address.
- Include a security contact.

### 9. Your questions

End with: "If you have specific security or compliance questions not covered here, please contact [contact method]. We are happy to discuss your requirements in detail."

## Output

Save the full document to `docs/security-brief.md` in the project.

Also write a shorter version of about 400 words, one page, and save it to `docs/security-brief-summary.md`. Cover only data residency, encryption, access control, AI data handling and compliance. This is the version for quick replies to customer questions.

## Critical rules

- Never claim a security measure that is not implemented in the code.
- Never claim local data residency if the database region is elsewhere.
- Never claim SOC 2 or ISO 27001 for the product itself. Only the infrastructure providers can be named for them.
- Never claim multi-factor authentication if it is not implemented.
- Never use vague language such as "industry-leading security". Be specific and factual.
- Be honest about limitations. Customers trust transparency.
- If something is planned but not implemented, leave it out.
- Every claim must be verifiable by reading the codebase.

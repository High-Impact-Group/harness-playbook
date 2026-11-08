---
description: Audits configuration across hosting, database, payments, OAuth, DNS and the app code for mismatches, missing settings and broken connections.
argument-hint: '[optional: service or category to limit the audit to]'
model: claude-sonnet-5-5
---
# /config-audit

Audit the configuration across every external service this project uses. Find mismatches, missing settings and broken connections between the hosting platform, the database, the payments provider, the sign-in provider, the email service, the DNS provider and the application code.

This audit needs the person's help to check external dashboards. When you need information from a dashboard, say clearly what to check and where to find it. If browser automation is available, use it to open the dashboards directly. If a tool or connection is not available, report BLOCKED for that check. Never infer success.

## Arguments

The argument is an optional service or category (for example `payments`, `database` or `dns`). If given, run Steps 1 to 3 for that service and its direct connections only. If empty, audit every service the code uses.

## Guardrails

- Dashboards are read-only for this audit. Never change settings, rotate keys or edit DNS without explicit approval.
- Step 3 tests touch production. Before each one, say what it will do (a sign-up, a charge, an email, a scheduled job run, a paid API call) and wait for a yes. Use the payments provider's test mode or a full-discount code. Never make a real charge.

## Step 1: Extract what the code expects

Read the codebase and build a complete picture of the configuration the application needs.

### Domain and URLs
- Which domain does the app expect? Check the site URL environment variables.
- Does it expect `www` or no `www`? Check the redirects in the framework config.
- Are there subdomain requirements?
- Which callback and redirect URLs are hardcoded or configured? Think of auth callbacks, OAuth redirects and checkout success and cancel URLs.

### Authentication
- Which auth methods does the code use? Email and password, magic link, social sign-in, custom tokens.
- Which redirect URLs does the auth flow expect after sign-in, sign-up, password reset and the OAuth callback?
- Which site URL and redirect URLs does the code send to the auth provider?

### Payments
- Which webhook endpoint URL does the code serve? Check the handler route.
- Which event types does the handler expect? List them all.
- Which price or product IDs does the code reference? Check the environment variables.
- Does it expect live mode or test mode? Check the key prefixes.
- Which success and cancel URLs does checkout use?
- Which return URL does the billing portal use?

### Email
- Which sender domains and sender addresses does the code use?
- Which reply-to addresses are configured?

### AI and other API services
- Which AI models does the code reference? Check the model strings. Flag any that are retired, dated or inconsistent with the project's own list of approved models.
- Which embedding models and dimensions are used?
- Which background job functions or queues are registered, and at which endpoint?
- Which search or data APIs does the code call?
- List every API-related environment variable the code reads, not just the common ones.

### DNS expectations
- Which domains does the app use?
- Does it need an A record, a CNAME or both?
- Does it need email DNS records, such as SPF, DKIM and DMARC?
- Does it need any bot-protection DNS records?

Present all findings as a checklist of expected configuration values.

## Step 2: Verify external services

For each service, either use browser automation to check directly or ask the person to verify. Be specific about what to look for and where to find it.

### Hosting platform
- **Domains:** Which domains are configured? Do they match what the code expects?
- **Environment variables:** Are all required variables set for production? Compare against the list in the project instructions file and the example env file.
- **Framework setting:** Is the project set to the right framework?

Common mismatches:
- [ ] The site URL variable matches the real production domain, not `localhost` and not a preview URL.
- [ ] The database URL variable points to the correct project.
- [ ] Payment keys are live keys in production, not test keys.
- [ ] The scheduled-job secret is set. Scheduled jobs fail silently without it.
- [ ] No variable is set to an empty string. Blank is worse than unset because it causes silent failures.

### Database and auth provider
- **Auth URL settings:** Does the site URL match the production domain? Do the redirect URLs include every auth callback path?
- **Auth providers:** Is email enabled, and with which confirmation setting? Is each social provider enabled with its client ID and secret set? Are the redirect URIs correct?
- **Tables:** Are all expected tables present? Is row-level security on for all user-facing tables?
- **API settings:** Does the project URL match the environment variable? Does the public key match?
- **Edge functions:** If used, are they deployed?

Common mismatches:
- [ ] The site URL matches the production domain exactly, including the secure scheme and with no trailing slash.
- [ ] The redirect URLs include every auth route the app uses.
- [ ] If several apps share one auth project, the cookie domain is scoped correctly.
- [ ] The social provider's redirect URI in the auth provider matches what the provider's console expects.
- [ ] The database region matches what the project instructions file documents.

### Social sign-in provider console
- **OAuth client:** Do the authorized origins include the production domain? Do the authorized redirect URIs include the auth provider's callback URL? Does the client ID match the one in the auth provider's dashboard?

Common mismatches:
- [ ] Origins use `https` and the canonical host.
- [ ] The redirect URI matches the auth provider's callback exactly.
- [ ] The credentials are not from a different project by accident.
- [ ] The consent screen is in production mode, not testing mode, which caps the number of users.

### Payments dashboard
- **Webhooks:** Is an endpoint registered? Does its URL match the handler? Which events is it subscribed to, compared with what the code handles? Is it live or test mode? Does the signing secret match the environment variable?
- **Products and prices:** Does every price ID in the environment exist? Is it active? Are the amounts and intervals right?
- **Customer portal:** Is it configured? Are the allowed actions right?
- **API keys:** Are the publishable and secret keys from the right mode?

Common mismatches:
- [ ] The webhook endpoint uses the production domain, not localhost or a preview URL.
- [ ] The webhook listens for every event the code handles. A missing event is a silent failure.
- [ ] Keys are live in production and test in development.
- [ ] Price IDs match real prices. Test mode prices are not live mode prices.
- [ ] The webhook signing secret matches. This is the most common cause of webhooks that do not work.

### AI provider consoles
- **API keys:** Is the key active? Does it match the environment variable in the hosting platform?
- **Usage and billing:** Is the account within rate limits? Is billing set up?
- **Account:** Is the key from the organization account, not a personal one?
- **Models:** Are the models the code references available on this plan?

Common mismatches:
- [ ] The key is active and not expired or withdrawn.
- [ ] Billing is set up. Free tiers have very low limits.
- [ ] Rate limits are enough for scheduled batch work, where usage can spike.
- [ ] The embedding and speech services have their keys set in production, not only in the example env file.

### Background job service
If one is used:
- **Events:** Are events flowing? Check the event log.
- **Functions:** Are all the functions found in Step 1 registered and active?
- **Keys:** Do the signing and event keys in the hosting platform match the dashboard?
- **App URL:** Is the serve endpoint registered with the production URL?

Common mismatches:
- [ ] Both keys are set in production.
- [ ] The endpoint points to the production domain, not localhost or a preview URL.
- [ ] New functions are synced and registered.
- [ ] No function is stuck in a failed or paused state.

### Search or data API providers
- **Keys:** Is each key active and set in the hosting platform?
- **Plan:** Does the plan cover the query volume the app needs?

### Email service
- **Domains:** Is the sender domain verified? Are SPF, DKIM and DMARC records set?
- **API key:** Is it active and does it match the environment variable?

Common mismatches:
- [ ] The sender domain is verified. Mail silently fails or goes to spam otherwise.
- [ ] The SPF record includes the email service's servers.
- [ ] The DKIM records are correct.
- [ ] The `from` address in the code uses the verified domain.

### DNS provider
For each domain:
- Does the apex record or the `www` CNAME point to the hosting platform, as its documentation says?
- If the app uses a subdomain, does that subdomain have the right record?
- Are the email records present?
- Are there conflicting records, such as two A records, or a CNAME on the apex?

Common mismatches:
- [ ] Records have propagated, not only been saved.
- [ ] No A and CNAME records conflict on one name.
- [ ] The TTL is reasonable. A very long TTL slows every change.
- [ ] Nameservers point to the right provider if the domain moved recently.
- [ ] HTTPS works, with no redirect loop between the hosting platform and DNS.

## Step 3: Connection tests

After the dashboards check out, test the real connections. Each test needs approval, per the guardrails.

### Auth flow
- Can you sign up with email? Sign in with email? Sign in with each social provider?
- Does password reset work?
- Does the session persist across page refreshes?
- Does logout clear the session?

### Payments flow
- Does the checkout page load?
- Can you finish a test purchase in test mode or with a full-discount code?
- Does the webhook fire? Check the provider's recent events.
- Does the user's subscription status update in the database?
- Does the billing portal load?

### Email
- Does a test email send? Does it arrive? Check spam.
- Is the from address right?
- Do the links in the email point to the production domain?

### Scheduled jobs
- Trigger one scheduled job by hand, or wait for its run.
- Does it authenticate with its secret?
- Does it finish?
- Does data appear in the database?

### API connectivity
For each AI or API service the project uses, make the smallest possible test call: one short prompt, one short embedding, one simple search. Do not make expensive calls.

## Output format

### 1. Configuration map
A visual summary of how the services connect, from DNS through hosting to the app, and from the app to the database, payments, email, sign-in, AI, background jobs and search services.

### 2. Mismatch report
| Service A | Setting | Expected value | Service B | Setting | Actual value | Match? |

### 3. Missing configuration
| Service | Setting | Status | Impact if missing |

### 4. Connection test results
| Test | Result | Notes |

### 5. Critical fixes
Issues that will cause visible failures for users, ordered by severity.

### 6. Warning fixes
Issues that do not break things now but will, such as test keys in production or missing email verification.

### 7. Configuration checklist
A complete checklist the person can work through, with the exact values to enter and where to enter them.

Save the report to `docs/config-audit.md` in the project.

## Tips for the person

When you are asked to check a dashboard:
- Screenshots are the fastest way to share information. Paste a screenshot of the relevant settings page.
- If you can copy specific values (a domain, a URL, a key prefix), that helps verify exact matches.
- Do not share full API keys or secrets. Confirm they are set, or share the first 8 characters so the right key can be matched to the right place.

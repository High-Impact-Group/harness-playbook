---
description: Single-pass launch-readiness audit combining the security, SEO, performance, access, privacy and resilience blockers.
model: claude-sonnet-5-5
---
# /pre-launch-review
Perform a pre-launch audit of this project. It combines the launch-critical checks from the security, SEO, performance, access, privacy and resilience reviews in one pass. Focus on what would be embarrassing, dangerous or costly to find after launch. Report only.

## Blockers (must fix before launch)

### Security
- Run the dependency audit. Flag any critical or high vulnerability.
- Scan source files for hardcoded keys, tokens or passwords.
- Check that local environment files are ignored by git and not committed.
- Check that variables exposed to the browser hold only non-sensitive values.
- Check that every API route validates auth before it does anything.
- Check that webhook endpoints verify signatures.
- Check that every scheduled-job route verifies its secret.
- Check that the database's privileged key is never used in browser code.
- Look for cross-site scripting: user content rendered without sanitizing.
- Check that a content security policy is configured.
- Check that strict transport security is configured.

### Authentication and access
- Test the full auth flow: sign up, log in, session, refresh, log out, password reset.
- Check that middleware protects every route that should need a login.
- Check that free users cannot reach paid features through direct API calls.
- If there is a trial: check that expiry is verified when access is requested.
- Check that admin endpoints fail closed when their configuration is missing.

### Data and privacy
- Check that a privacy policy exists and is linked from signup and login.
- Check that terms of service exist and are linked.
- Check that cookie consent exists if analytics cookies are used.
- Check that users are told about AI processing of their data.
- Check that the data region is documented, and that cross-border disclosure is in the privacy policy.
- Check that account deletion removes all user data, including cascades.

### Payments (if used)
- Check that products and prices exist in the payments provider's dashboard.
- Check that the webhook endpoint is registered there.
- Check that the webhook handles the events the project relies on: checkout completed, subscription updated, subscription deleted, payment failed.
- Check the full payment flow: signup, checkout, active subscription, cancel, downgrade.
- Check that only the publishable key is used in the browser.

## High priority (should fix before launch)

### SEO
- Check that every page has a title, a meta description and social sharing tags (title, description, image).
- Check that the robots file exists and is correct.
- Check that a sitemap exists and lists every public page.
- Check for one top-level heading per page and a logical heading order.
- Check that images have alt text.
- Check that canonical URLs are set.
- Check that the page language attribute is set.

### Performance
- Check for missing loading and error states on key routes.
- Check that fonts use the framework's font loader.
- Look for components that run in the browser and do not need to.
- Check for unbounded database queries.
- Check that API routes set a maximum duration.
- For scheduled jobs: check that batches fit inside the platform's time limit.

### Email
- Check that the email service's key is set in production.
- Check that the sender domain is configured (SPF, DKIM, DMARC).
- Check that transactional emails send (sign-in links, notifications, alerts).

### Error handling
- Check that error boundaries exist on key routes.
- Check that API errors give useful messages without exposing internals.
- Check that missing critical environment variables produce a clear startup error, not a silent failure.

## Pre-launch checklist

### DNS and hosting
- [ ] Custom domain configured on the hosting platform
- [ ] DNS records correct
- [ ] HTTPS works on the custom domain
- [ ] The www and bare domain redirect to one canonical host

### Environment
- [ ] Every required environment variable is set in production
- [ ] They are production values, not test or placeholder values
- [ ] Payments are in live mode
- [ ] Auth site URL and redirect URLs point at the production domain

### Monitoring
- [ ] A health check endpoint exists and returns 200
- [ ] Uptime monitoring is configured
- [ ] Scheduled-job monitoring is configured (if applicable)
- [ ] You know how to read the function logs

### Content
- [ ] All placeholder text is replaced
- [ ] No "Coming soon", "TODO" or "Lorem ipsum" is visible on public pages
- [ ] The copyright year is current
- [ ] Legal pages carry the correct company details
- [ ] Spelling is consistent with the project's language rule
- [ ] Favicon and touch icon are configured

### Functional
- [ ] All primary user flows tested end to end
- [ ] Key pages work on mobile
- [ ] Forms validate input and show clear errors
- [ ] Rate limiting is active on public endpoints
- [ ] No log statement prints sensitive data in production

## Output format

1. **Launch readiness:** Not Ready, Needs Work, Ready with Caveats or Ready.
2. **Blockers:** Issues that must be fixed before launch, with specific fix instructions.
3. **High priority:** Issues that should be fixed before launch.
4. **Post-launch:** Issues for the first week after launch.
5. **Checklist:** The list above, each item marked Pass, Fail, N/A or Unverified.

Where an item needs a live action or a dashboard you cannot see (sending emails, payment checkouts, DNS, hosting environment variables), verify what the code shows. Mark the rest Unverified and give the manual step to run. Never trigger real payments or emails. Never mark an unchecked item Pass.

Save the report to `docs/pre-launch-review.md` in the project.

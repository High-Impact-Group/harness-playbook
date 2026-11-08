# ia-audit

Audit this project's information architecture and link hygiene in two passes.

- **Pass A, static (codebase).** Always runs. Needs no server and no login. It is the source of truth for orphans, broken links and structural gaps.
- **Pass B, live (crawl).** Runs only when a base URL is supplied and live checks are not switched off. It confirms runtime behavior (redirects, auth gating, rendered navigation) that static analysis cannot see.

This is read-only on all source and app code. Never edit and never fix. The only file you may write is the report.

## Input

- `base-url` (optional): a local or deployed address. Its presence enables Pass B.
- `--no-live`: force static-only, even if a URL is given.
- `--only=...`: a comma list of checks to run. Omit it to run everything. Use it for cheap, routine passes.
- `--max-pages=N`: cap the live crawl (default 150).
- If the input is empty, run every check, static only.

Check names: `routes`, `orphans`, `broken-links`, `duplicate-routes`, `duplicate-links`, `marketing`, `footer`, `auth-gating`, `features`, `link-hygiene`, `metadata`, `sitemap`, `mobile-nav`, `redirects`.

## Step 0: Detect conventions (code is master)

Before any check, learn the lay of the land. Print a four to six line summary so the owner can confirm you read the structure correctly.

1. **Router and app root.** File-based routing directory or a route table. Note route groups, such as marketing, auth and app areas.
2. **Auth surface.** Find the middleware or guard that redirects unauthenticated users, and any layout that does the same.
3. **Navigation surfaces.** Find the header, the footer, the app side menu and the mobile menu components. Record their file paths.
4. **SEO surfaces.** The sitemap, the robots file and the base URL setting.
5. **Config.** If the project has an optional IA config file, load its overrides (see Config). If not, use the defaults and state every assumption in the report.

## Config (optional)

Honor these keys if present. Otherwise use the defaults.

- `domains`: the project's own domains, for absolute-URL detection. Default: infer from the base URL setting.
- `marketingRoutes`: expected public pages. Default: home, pricing, features, about, contact, blog, FAQ, privacy, terms, login and signup.
- `footerRequired`: pages that must be in the footer. Default: privacy, terms and contact.
- `appRoot`: the route group or prefix for authenticated features. Default: detect it.
- `featureRoutes`: top-level features that must be reachable from the side menu. Default: derive them (see A10).
- `intentionalOrphans`: routes that are unlinked on purpose, such as campaign landing pages. Default: none.
- `storageStatePath`: saved browser auth state for the authenticated live crawl. Default: none, so the authenticated crawl is skipped.

## Pass A: static checks

### A1. Build the route map (`routes`)
List every page route. Derive the URL path from the file location. Drop route-group folders, because they do not change the URL. Record dynamic segments as patterns. Note each route's layout chain and whether it sits under an auth-gated group or layout.

### A2. Build the link map
Collect every internal link target in the codebase: link components, anchors, programmatic navigation, redirects and navigation config arrays. Normalize: resolve template strings to patterns, strip query strings, apply the project's trailing-slash rule, and keep fragments for A11. Record each target's source `file:line` and the navigation surface it belongs to (header, footer, sidebar, mobile or body).

### A3. Orphaned pages (`orphans`): REVIEW
A route that is never a link target and is not in `intentionalOrphans`. Exclude the home page and error, loading and API routes. Cross-check the sitemap: an orphan that is also missing from the sitemap is a stronger candidate. An orphan that is in the sitemap is probably a deliberate landing page, so note it with lower confidence. Orphans are often deliberate. Flag them. Do not condemn them.

### A4. Broken internal links (`broken-links`): BROKEN
The inverse of A3 and the highest-value check. Every internal link target must resolve to a real route in A1. Targets that resolve to nothing are user-facing 404s. Include unresolved redirect destinations. Report each with `file:line` and the dead address.

### A5. Duplicate routes and pages (`duplicate-routes`)
- BROKEN: two page files that resolve to the same URL.
- REVIEW: distinct routes that render the same primary component or near-identical content, or a home alias that duplicates `/`. Flag them as consolidation candidates, with a canonical recommendation.

### A6. Duplicate links in one navigation surface (`duplicate-links`): SHOULD FIX
For each surface (header, footer, side menu, mobile menu) on its own, report any address that appears two or more times in that surface. This is almost always a copy-paste bug. The same address on different surfaces is fine. Do not flag it.

### A7. Marketing-surface completeness (`marketing`): SHOULD FIX
Compare `marketingRoutes` against A1. Report the missing public pages. Weight the legal pages: privacy and terms are near-universally expected. For a product that takes payments, also flag the absence of a refund or cancellation policy and clear business-identity and contact details as worth confirming. This is a flag, not legal advice.

### A8. Footer coverage (`footer`)
For each marketing page that exists, confirm the footer links to it. A missing `footerRequired` page is BROKEN. Another existing marketing page missing from the footer is SHOULD FIX. Pass B confirms against the rendered footer.

### A9. Marketing pages gated behind auth, static part (`auth-gating`): BROKEN
The classic "public page redirects to login" bug. For each marketing route:
- (a) Does it match the middleware's matcher, and does the middleware redirect unauthenticated users?
- (b) Does any layout in its chain redirect unauthenticated users?
If either is true, flag it with the `file:line` of the matcher or layout. Pass B is the definitive test.

### A10. Feature reachability (`features`): BROKEN
Inside `appRoot`, find the top-level feature routes: a segment directly under the app root with a page, excluding dynamic detail routes and nested sub-pages. Use `featureRoutes` from config to override the heuristic. Then:
- A feature route that is not in the side menu is reachable only by typing the URL. Flag it.
- A side-menu link that points to a route that does not exist is a dead menu item. Flag it.

### A11. Link hygiene (`link-hygiene`)
- BROKEN: placeholder or dead links: `href="#"`, an empty href or a `javascript:` href.
- SHOULD FIX: an internal route in a plain anchor where the framework link component belongs (full reload, lost client routing). An external anchor is correct. Do not flag it.
- SHOULD FIX: a fragment link whose target id does not exist on the destination page.
- REVIEW: a link to an absolute URL on the project's own domains instead of a relative path. It breaks on preview deploys and can create duplicate-domain SEO problems.

### A12. Metadata completeness, marketing pages only (`metadata`): SHOULD FIX
Each marketing route should set at least a title and a description, and ideally social-share metadata. Flag the gaps. If an SEO role owns this, scope it out with `--only`.

### A13. Sitemap against reality (`sitemap`)
If a sitemap exists: every URL it lists must resolve to a real public route (a 404 in the sitemap is BROKEN). Every public marketing route should be in it (a gap is REVIEW, because the page is not indexed). Flag any private app route that leaked into it. Check the robots file too: marketing routes should not be disallowed, and app and auth routes ideally are.

## Pass B: live crawl (only with a base URL and without `--no-live`)

If the browser automation tool (Playwright) is not available, mark every Pass B check BLOCKED. Never infer success.

### Crawl bounds (state them in the report, then obey them)
- **Same origin only.** Never crawl off the base URL's host. Check an external link once and do not follow it.
- **GET navigation only.** Follow links. Never submit a form, click a non-link button or do anything that could change state. No POST, PUT or DELETE.
- **Visited set and dedupe.** Normalize URLs. Never fetch one twice.
- **Caps.** `--max-pages` (default 150), depth of 4 or less, a 15 second timeout per request and 5 minutes of total wall-clock time. On any cap, report partial results and stop cleanly.
- **Production caution.** If the base URL is not local, go gently: low concurrency, and honor the robots file.

### B1. Marketing pages do not redirect to login (definitive `auth-gating`): BROKEN
In a fresh, unauthenticated browser context, request each marketing route. The final URL must equal the requested one, and the status must be 200. A redirect to login, or a client-side bounce to login, is a finding.

### B2. Footer and navigation, rendered (`footer`, `duplicate-links`)
On a sample of pages (home, each marketing page and one app page), read the rendered footer and primary navigation. Confirm footer coverage against what really renders. Re-run duplicate-link detection on the rendered output. It catches duplicates that conditional rendering creates.

### B3. Broken links and redirects (`broken-links`, `redirects`)
Record the status of every link you follow.
- BROKEN: any internal link that returns 4xx or 5xx.
- SHOULD FIX: a redirect chain longer than one hop, and any redirect loop. Stop following at 5 hops. For external links, report dead ones only.

### B4. Mobile navigation parity (`mobile-nav`): SHOULD FIX
Load the home page at desktop width and collect the header links. Reload at a phone width (about 390px), open the menu and collect its links. Diff the two. Flag links that are on one and missing from the other. This is a common "updated the desktop nav and forgot the hamburger menu" bug.

### B5. Authenticated app crawl (optional, only with `storageStatePath`)
Load the saved auth state and enter the app. Confirm A10 live: render the side menu, collect its links and verify that every feature route is reachable and that no link is dead or duplicated. Also check that login and signup redirect into the app when the user is signed in (REVIEW if not). Without `storageStatePath`, skip this and say so.

## Output

Write the full report to `docs/audits/ia-audit-<YYYY-MM-DD-HHmm>.md`. Create the folder if needed. Do not touch any other project notes. Then print the summary in your reply.

Order it by impact:

1. **Header.** Project, date, mode (static or static plus live), pages crawled and any caps hit.
2. **Detected conventions** from Step 0, plus every assumption you made, so the owner can correct a wrong reading.
3. **Scorecard.** One row per check: name, count and worst severity.
4. **Findings, grouped by severity**, BROKEN first, then SHOULD FIX, then REVIEW. One line each: what, `[file:line or URL]`, why it matters (one line) and the fix (one line).
5. **Top 3 actions.** The three highest-impact fixes, in order. Nothing more.

Keep the rationale short. No filler. Do not re-list the whole codebase.

## Rules

- Read-only on all source and app code. Write only the report file.
- Code is master. Where a nav config, a doc or an assumption disagrees with the routes and links in the code, trust the code and flag the difference. Never invent intent.
- Bound everything. Dedupe, cap and time-box. End cleanly with partial results rather than looping. Never crawl off-origin and never change state.
- Orphans and own-domain absolute links are judgment calls. Show them as REVIEW, not as failures.
- Do not duplicate the SEO role's work unless asked.
- US English.
- If the project does not use a file-based router, adapt the route and link listing to what is there, and say what you did.

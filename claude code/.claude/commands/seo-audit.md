---
description: Technical SEO audit, meta and head tags, structured data, sitemaps, canonicals and semantic structure, with a prioritized report.
argument-hint: '[route or app directory to scope the audit]'
model: claude-sonnet-5-5
---
# /seo-audit
Perform a technical SEO audit of this project and produce a structured report. Report only.

## Scope

`$ARGUMENTS` optionally narrows the scope to a route or directory. If empty, audit every route.

## Checks to perform

### Meta and head tags
- Check every page for: title, meta description, social sharing title, description and image, and the social card type.
- Check that each page exports its metadata (static or generated), if the framework works that way.
- Flag any page with no metadata at all.
- Check for duplicate titles or descriptions across pages.

### Structured data
- Look for JSON-LD structured data (organization, product, FAQ, breadcrumb).
- Suggest structured data types that are missing but fit the content.

### Technical SEO
- Check for a robots file and a sitemap.
- Check that canonical URLs are set correctly.
- Check the heading hierarchy: one top-level heading per page, logical nesting below it.
- Look for images missing alt text.
- Check that links use real anchor elements, not clickable divs.
- Check that dynamic routes use static or incremental generation where it fits.

### Performance signals
- Check that the framework's image component is used, not raw image tags.
- Look for render-blocking scripts and unnecessary browser-only components.
- Check that fonts load through the framework's font loader, not external stylesheet links.
- Check that loading and error states exist for key routes.

### Accessibility (SEO-adjacent)
- Check for the page language attribute.
- Check that form inputs have associated labels.
- Check color contrast on key text where the styles are visible in code.

## Output format

Produce a Markdown report with:

1. **Score:** Overall SEO health: Poor, Fair, Good or Excellent.
2. **Critical issues:** Things that must be fixed (missing metadata, broken sitemap).
3. **Improvements:** Things that should be fixed (missing sharing images, weak descriptions).
4. **Opportunities:** Nice to have (structured data, extra meta tags).
5. **Per-page summary table:** Page path, title, description, sharing image, status.

Save the report to `docs/seo-audit.md` in the project.

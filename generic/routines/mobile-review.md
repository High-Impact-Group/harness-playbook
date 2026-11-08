# mobile-review

Perform a comprehensive mobile usability audit of this project. Examine every page, component and layout for problems on phones and small tablets (320 to 768px viewport width).

Input: an optional route or component path to narrow the scope. If it is empty, review the whole project.

## Layout and responsiveness

- Check every page for responsive behavior at 320px, 375px, 428px and 768px.
- Look for fixed widths that cause horizontal scrolling.
- Check for overflow hiding on the body or main element used to mask a horizontal scroll problem instead of fixing it.
- Check that responsive breakpoints are used consistently.
- Look for desktop-only layouts that do not collapse: side-by-side columns, wide tables and multi-column grids.
- Check that wrapping or responsive grid columns are used where content could overflow.
- Check that no content is cut off or hidden behind other elements at narrow widths.

## Navigation

- Does the main navigation collapse to a menu or drawer on mobile?
- Does the mobile menu open, close and navigate correctly?
- Does the mobile menu fit the viewport?
- Are navigation items large enough to tap (44px minimum)?
- Do sticky or fixed headers take too much vertical space?
- Do breadcrumbs wrap or truncate gracefully?
- Is the footer navigation usable on mobile?

## Typography and readability

- Body text of at least 16px, so iOS does not zoom on focus.
- Headings that are too large on mobile and wrap badly.
- Line lengths that are readable, not edge to edge with no padding.
- Responsive text sizes where needed.
- At least 16px of side padding, so text does not touch the screen edges.

## Touch targets and interactions

- All buttons, links and interactive elements are at least 44 by 44px.
- At least 8px between adjacent touch targets.
- Hover-only interactions that do not work on touch: tooltips, menus and previews.
- Dropdowns and selects that are touch-friendly.
- Modal close buttons that are easy to reach, not a tiny X in the corner.
- Custom swipe or touch handlers that conflict with browser gestures.

## Forms

- Inputs that are full width or close to it, not tiny inline fields.
- Appropriate input types and input modes for mobile keyboards: email, telephone, number, decimal and search.
- Labels that stay visible, including when a floating label animation is used.
- Error messages that are visible without scrolling.
- Submit buttons that are easy to reach and not hidden below the fold with no cue.
- Multi-step forms that work on mobile, with step indicators or progress bars.
- Date pickers that work on mobile. Native pickers are usually better than custom ones.

## Tables and data

- Check every table. Does it scroll sideways, stack or break?
- Tables should sit in a scrollable wrapper or have a responsive alternative.
- Wide tables with too many columns to use on mobile.
- Charts that resize properly on mobile viewports.
- Chart tooltips that work on touch and are not hover-only.
- Data cards and tiles that reflow to one column.

## Images and media

- Responsive image sizing: no desktop-sized images served to phones.
- Images that overflow their container.
- Aspect ratios that stay correct, with no stretching or squashing.
- Background images that lose important content when cropped.
- Maps that remain usable at small sizes.

## Modals, drawers and overlays

- Modals that are full screen or close to it on mobile, not tiny centered boxes.
- Modal content that scrolls inside the modal, not the page behind it.
- Drawers and sidebars that do not overflow or partly cover content.
- Overlay close actions that work on touch: backdrop tap, close button or swipe.
- Toast and notification positions that do not cover important UI.

## Scrolling and position

- Fixed elements that stack up on mobile, such as header plus banner plus a CTA bar, leaving no room for content.
- Sticky elements that use too much vertical space.
- Scroll containers inside scroll containers.
- Infinite scroll or "load more" that works on mobile.
- A back-to-top control on long pages.

## AI chat and streaming interfaces (if present)

- The chat input stays at the bottom and is not hidden by the mobile keyboard.
- Messages do not overflow sideways.
- Streaming text wraps correctly.
- The interface works in portrait and landscape.
- Loading and tool-use indicators are visible on mobile.

## Performance on mobile

- Large client bundles that slow mobile load.
- Images sized for the screen, not 2000px images on a 375px screen.
- Heavy animations that would stutter on mobile.
- A loading state for routes that fetch heavy data, so the screen is not blank on a slow connection.
- Layout shift as content loads.

## Platform-specific issues

- iOS Safari: `100vh` includes the address bar (use dynamic viewport units), input zoom on fields under 16px, momentum scrolling in overflow containers and safe-area insets on notched devices.
- Android: fields pushed behind the keyboard, different font rendering and older browser viewport handling.

## Testing approach

For each page or route, report:
- Does it work at 375px (a common small phone)?
- Does it work at 428px (a large phone)?
- Does it work at 768px (tablet portrait)?
- Is touch interaction natural or awkward?

This review reads code. It does not render a page. Mark every verdict as inferred from code. For rendered verification, ask for a design review at those breakpoints.

## Output format

1. **Mobile readiness.** One of: Not mobile-friendly, Partially responsive, Mostly responsive or Fully mobile-optimized.
2. **Critical issues.** Broken or unusable on mobile. Blockers.
3. **Major issues.** Works, but a poor experience.
4. **Minor issues.** Polish.
5. **Page-by-page summary.** A table: page, 375px, 428px, 768px, touch and status.
6. **Quick wins.** Easy changes with high mobile impact.

Save the report to `docs/mobile-review.md`.

## Guardrails

- Report only. Do not change any source file.
- Do not claim a page "works" unless the code shows it. Say "inferred from code" or "not checked".

---
description: "Audits the codebase against WCAG 2.2 AA: semantic HTML, keyboard access, contrast, forms, ARIA and screen-reader support, and reports issues with fixes."
argument-hint: '[path, route or component to scope the audit]'
model: claude-sonnet-5-5
---
# /accessibility-audit

The argument optionally narrows scope to a path, route or component. If empty, audit the whole codebase.

Audit against WCAG 2.2 Level AA. Examine components, pages, layouts, forms and interactive elements.

## Semantic HTML

- Pages use semantic elements (main, nav, header, footer, section, article), not divs everywhere.
- One h1 per page, with a logical heading order and no skipped levels.
- Lists use list elements, not styled divs.
- Tables have a header row, header cells with `scope`, and a caption where it helps.
- Landmark regions are present and used correctly.
- The page language attribute is set.

## Images and media

- Every image has meaningful alt text.
- Decorative images use an empty alt, not a missing one.
- Icons used as buttons or links have accessible labels.
- Charts have a text alternative or a described label. Maps have an accessible alternative.
- No images of text.

## Keyboard navigation

- Every interactive element can be reached with Tab, in a logical order.
- Focus indicators are visible. Flag any outline removed without a replacement.
- Modals trap focus and return it on close.
- Menus and custom selects can be operated by keyboard.
- Escape closes modals, menus and overlays.
- Flag click handlers on non-interactive elements. They should be buttons or links.
- A skip-to-content link exists.

## Forms

- Every input has an associated label.
- Required fields are marked visually and programmatically.
- Error messages are tied to their fields and announced to screen readers.
- Placeholder text is not the only label.
- Autocomplete attributes are set on common fields.

## Color and contrast

- Normal text: at least 4.5:1. Large text (18px and up, or 14px bold and up): at least 3:1. UI components and graphics: at least 3:1.
- Check the brand colors: primary text on its background, button text on the button, link colors.
- Information is never carried by color alone. Status colors need an icon, label or pattern too.
- Focus indicators meet 3:1 against adjacent colors.

## Interactive components

- Custom components have the right roles and states: tabs, dialogs (`aria-modal`, labelled), alerts and live regions, busy states, expandable sections (`aria-expanded`, `aria-controls`).
- Toasts and notifications are announced.
- Drag-and-drop has a keyboard alternative.
- Content loaded after the page is announced.

## AI chat and streaming interfaces (if present)

- New responses are announced, without reading every streamed token.
- The chat input is labeled.
- Loading and tool-use states are communicated accessibly.
- Chat history can be navigated by keyboard.

## Charts and data visualization (if present)

- Charts have an image role and a label that describes the data.
- Tooltips work by keyboard, not only on hover.
- A data table is available as an alternative.
- Multi-series charts do not rely on color alone.

## Motion

- Animations respect the reduced-motion preference.
- Auto-playing content can be paused.
- Nothing flashes more than three times a second.

## Responsive and touch

- Touch targets are at least 24x24px (WCAG 2.5.8). Suggest 44x44px on mobile.
- Content works at 200% zoom.
- No horizontal scrolling at 320px width.
- Orientation is not locked.

## Output format

1. **Compliance rating.** Non-compliant, partially compliant, largely compliant or fully compliant (WCAG 2.2 AA).
2. **Critical issues.** Barriers that block access: missing labels, no keyboard access, missing alt text.
3. **Major issues.** Barriers that make use difficult: poor contrast, missing ARIA, broken focus.
4. **Minor issues.** Improvements: better semantics, reduced-motion support.
5. **Component inventory.** Component | Issue type | WCAG criterion | Severity | Fix.
6. **Quick wins.** Easy changes with high impact.

Save the report to `docs/accessibility-audit.md`.

## Guardrails

- Report only. Do not change application code.
- A static read cannot prove contrast or focus order. Say which findings need a browser check.

---
description: Independent multi-agent design review. Captures the rendered UI, runs a blind panel of specialist agents, and synthesizes convergent findings into a severity-ranked report.
argument-hint: '[route|component|"product"] [--panel core|full|a11y] [--breakpoints 375,768,1440] [--baseline <ref>] [--focus "<area>"]'
model: claude-opus-5-5
---
# /design-review

## Arguments

Read The argument as the target (a route, a component or `product`), then optional flags: `--panel` (`core`, `full` or `a11y`; default `core`), `--breakpoints` (default 375,768,1440), `--baseline <ref>` and `--focus <area>`. If no target is given, ask which surface to review and stop.

Review a design the way a user meets it: through the rendered result, with no access to the reasoning that produced it.

You are the **conductor**. You capture evidence, brief the panel, read what comes back and synthesize. You do not review the design yourself before the panel reports. Your first opinion contaminates the synthesis.

**This edits nothing.** It captures, reviews and writes one report.

---

## The independence rule

This is the part that makes the routine worth running. Break it and you have an expensive echo of your own opinion.

1. **Every panel member receives the identical input pack.** Screenshots, the route, the states captured and the design system reference. Nothing else.
2. **No panel member sees another's output.** The panel runs as one parallel batch. There is no second round.
3. **The brief contains no rationale.** Never write "we chose the card layout because..." or "this replaces the old table view." Intent is a defense, and a reviewer given the defense reviews the defense.
4. **The brief contains no diff and no commit message.** If the work was done in this session, you already know too much. Brief from the screenshots only.
5. **The conductor does not pre-frame.** No "particularly interested in the spacing." That is how you get four reviewers all talking about spacing.

If `--focus` is given, pass it to **one** panel member only and say so in the report. Everyone else stays blind.

---

## Hard caps

- **Panel size: 6 at most.** The default panel is 4.
- **One round.** No re-review after fixes within the same run.
- **Capture cap: 20 screenshots.** If you near it, prioritize states over breakpoints.
- **One report file.** No writes to the project's task lists, logs or notes files.

---

## Phase 0: Preflight

1. **Is browser automation available?** If it is not working, stop and say so. **Do not fall back to reviewing code instead of the rendered UI.** A design review of source files is not a design review.
2. **Is the dev server running?** Confirm the target URL responds. If not, ask before starting one.
3. **Design system ground truth.** Look for, in order: a design system document, theme extensions, a tokens file and a shared UI component folder.
   - If none exists, note it: "No design system document. Consistency findings come from patterns observed in the codebase, not a declared standard." This weakens the consistency verdict, and the report must say so.
4. **Brand voice.** Find the product's brand voice file if one exists. Microcopy review needs it. Flag whether the target is product interface copy or marketing copy, so the copy reviewer applies the right standard.

---

## Phase 1: Capture

Build the evidence pack with browser automation. Everything downstream depends on this being honest. Capture the design as it actually renders, not as it renders with ideal data.

**Breakpoints:** 375, 768 and 1440 by default.

**States:** capture every one that applies.

| State | Why it matters |
|---|---|
| Default or populated | The happy path |
| **Empty** | First-run reality. Most designs are never drawn in this state. |
| **Loading** | Skeletons, spinners, layout shift |
| **Error** | A failed fetch, a validation failure |
| **Long content** | Overflow, truncation, wrapping. Use the longest realistic string. |
| **Sparse content** | One row, one word, a missing avatar |
| Interactive | Hover, focus-visible, active, disabled |
| Dark mode | Only if the product supports it |

Also record, mechanically:
- Layout shift on load, where the capture shows it.
- Any element whose focus ring is invisible or clipped.
- Any text that truncates without a tooltip or an expansion.

Save the captures to a run folder. Name each file by `state-breakpoint` so reviewers can refer to it exactly.

If `--baseline <ref>` is given, check out that ref in a separate worktree, capture the same set, and put both in the pack labeled **A** and **B**, with no sign of which is current.

---

## Phase 2: Panel

Dispatch the whole panel as one parallel batch. These reviewers are read-only and make no edits, so parallel is safe. The usual caution about blast radius does not apply because nothing is written.

### Panels

**`core`** (default, 4 reviewers)

| Role | Brief |
|---|---|
| the `visual-designer` agent | Craft. Hierarchy, type scale, spacing rhythm, color, alignment, density. Does the eye land where it should? |
| the `design-auditor` agent | Consistency. Does this match the declared or observed system? Name every drift: one-off spacing values, ad hoc colors, components that duplicate an existing one. |
| the `onboarding-specialist` agent | Comprehension on first encounter. Given only this screen, what does a new user think it does, and what do they do next? |
| the `copy-editor` agent | Microcopy. Labels, buttons, empty states, error messages, helper text. US English. Fit with the brand voice. |

**`full`** (adds 2)

| Role | Brief |
|---|---|
| the `customer-experience-guru` agent | Journey coherence. Where does the user arrive from, where do they go, and what is the emotional register of this step? |
| the `accessibility-auditor` agent | WCAG 2.2 AA. Contrast, focus order, target size, semantics, keyboard path, screen reader labels. If this role is not in your set, fold its checklist into the design auditor and say so in the report. |

**`a11y`**: the accessibility auditor and the design auditor only. A fast compliance pass before shipping.

### The brief each reviewer receives

Identical, verbatim, for every reviewer except the role line:

```
You are reviewing a design you did not build. You have no information about
why any choice was made and you should not speculate about intent.

Product: <product>
Surface: <route or component>
States captured: <list>
Design system reference: <path, or "none declared">

Your role: <role line>

Return exactly these sections:
1. FIRST IMPRESSION: three sentences, written before you analyze anything.
2. FINDINGS: each with what you observed, which screenshot, why it matters,
   and a severity you assign (blocking / should-fix / taste).
3. WHAT WORKS: at least two things. Name them specifically.
4. THE ONE THING: if only one change were made, what should it be?

Rules:
- Cite a specific screenshot for every finding. A finding with no evidence
  is an opinion and will be discarded.
- Mark your own taste as taste. "I would have used a lighter weight" is taste.
  "The 14px text on a light gray background fails contrast" is blocking. Do
  not blur them.
- Do not suggest implementation. No code, no class names, no file edits.
- If you cannot find anything wrong in your area, say so. Do not manufacture
  findings to fill the section.
```

---

## Phase 3: Synthesis

Read every reviewer's output in full before you form a view. Now, and only now, you may form your own.

**Convergence is the signal.**

| Agreement | Reading |
|---|---|
| **3 or more reviewers independently flag it** | Real. Blind reviewers converging on one thing is strong evidence. Lead with these. |
| **2 reviewers** | Probably real. Check whether their reasoning is truly independent or two framings of one observation. |
| **1 reviewer** | Either a specialist catch only that reviewer was placed to see (accessibility, brand voice: weight it fully), or taste (label it and move on). Say which. |
| **Direct contradiction** | Show both positions with their reasoning. **Do not average them.** Two skilled reviewers disagreeing is information. A mushy midpoint is not. Name the trade-off and let the person decide. |

Compare the first impressions against each other. If they diverge sharply, the design is not communicating one thing clearly. That is a finding in itself, and often the most important one in the report.

If `--baseline` was used, state which of A and B the panel preferred **before** you reveal which was current.

---

## Phase 4: Severity

Re-rank the findings yourself. A severity assigned by a reviewer is input, not a verdict.

| Severity | Bar |
|---|---|
| **Blocking** | Users cannot finish the task, cannot read the text or cannot reach the control. Accessibility failures against WCAG 2.2 AA sit here. It ships broken. |
| **Should fix** | It works, but costs comprehension, trust or polish. The gap between shipped and good. |
| **Taste** | Defensible either way. Listed, never argued for. |

Be strict about the third category. The value of this routine is telling the person which findings are real problems and which are four opinions wearing evidence. A report where everything is "should fix" has done no work.

---

## Phase 5: Report

Write to `docs/audits/design-review-<product>-<surface>-<YYYY-MM-DD-HHmm>.md`.

```markdown
# Design Review: <product> | <surface>
Run: <timestamp> | Panel: <reviewers> | Breakpoints: <list>
Design system reference: <path | none declared, consistency findings are observational>
States captured: <list> | Caps hit: <none | detail>

## Verdict
<Three sentences. Ship, ship with fixes, or do not ship. Say which.>

## Where the panel converged
### 1. <Finding>: Blocking, flagged by 4/4
**Observed:** <what, citing the screenshot>
**Why it matters:** <consequence for the user>
**Panel:** <the reviewers who flagged it>

## Where the panel disagreed
### <Finding>
**<reviewer a> says:** <position>
**<reviewer b> says:** <position>
**The trade-off:** <what you are actually choosing between>

## Specialist catches (single reviewer, weighted)
<Accessibility and brand voice findings only that reviewer was placed to see>

## First impressions: divergence check
| Reviewer | First impression |
<Then: did they agree on what this screen is for?>

## What works
<At least three, specific>

## Taste (listed, not argued)
<One line each>

## Consistency drift
<Ad hoc values, duplicated components, tokens bypassed>

## The one thing
<Synthesized from the panel's THE ONE THING answers>

## Not reviewed
<States that could not be captured, and why>
```

---

## Rules

- **No edits.** Not one class name. The output is a report. Implementing is a separate action started by a person.
- **Never review the code instead of the render.** If browser automation cannot run, stop.
- **Never let one reviewer's finding become the report's frame.** Convergence leads, always.
- **A clean review is a valid result.** If the panel finds nothing blocking, say so plainly and do not pad.
- **If there is no design system document**, end the report with a one-line note that the consistency verdict is observational and that a declared design system would sharpen future runs. Say it once.

# design-develop

Develops a design from problem to build-ready spec. It frames the problem, generates genuinely distinct directions, gates on the person's choice, then develops the chosen direction through every state.

## Arguments

Read The input as the problem or surface (free text), then optional flags: `--directions N` (1 to 4, default 3), `--reuse-only` (stop after Phase 2) and `--from-review <path>` (use a design-review report as the problem statement). If empty, ask what problem or surface to develop and stop.

Take a problem and produce a design specification that an implementer can build without guessing.

**This writes a spec, not code.** The output goes to the `implementer` role, which builds exactly to spec and returns questions rather than filling gaps. Every gap you leave here becomes a question there, or worse, an invention.

---

## Hard caps

- **Maximum 4 directions.** Default 3.
- **One divergence round.** No "here are three more."
- **Two human gates**, both mandatory. Never pass either on inference.
- **Maximum 20 files read** during grounding.

---

## Phase 1: Frame the problem

**The most common failure is developing the wrong thing beautifully.**

If the request names a solution, such as "add a dropdown" or "make a settings modal", do not build it. Extract the problem underneath and state it back:

> You asked for a dropdown filter. The problem I think this solves is: users
> cannot find a specific project once they have more than about twenty.
> Is that right, or is it something else?

Then establish:

| | |
|---|---|
| **Who** | Which user, in which state: new, returning, power user, admin |
| **When** | Where in the journey this surface is met, and what they arrived from |
| **Job** | What they are trying to get done. Not what they are trying to click. |
| **Success** | How you would know this worked. Behavioral, not aesthetic. |
| **Constraints** | The existing design tokens, no new dependencies, mobile-first, the data available |

If a review report was given, read it and treat its convergent findings as the problem statement. Skip the restatement if the problem is already unambiguous there.

### GATE 1: Problem confirmation

Present the framing in under ten lines and **stop**. Do not generate directions on an assumed problem. If the person corrects the framing, restate it once and stop again.

---

## Phase 2: Ground

Before you generate anything, learn what already exists. Design drift comes from generating in ignorance of the system.

1. **Design system.** Look for a design system document, theme extensions, tokens and a shared UI component folder. Extract the scale actually in use: spacing steps, type ramp, radii, shadow levels and color roles.
2. **Prior art in this codebase.** Has a similar problem been solved elsewhere in this product? Find it and read it. A solved pattern reused beats a new pattern invented, almost always.
3. **Prior art in related products.** Same stack, same conventions. Name what is worth borrowing. Do not open other repos from this routine.
4. **The real data.** What does the content actually look like? The longest realistic string, the sparsest realistic record, the largest realistic count. Design to the real distribution, not a tidy mock.

If `--reuse-only` was given, stop after this phase and report: this can be solved with existing components, and here is how. That is a legitimate and often correct outcome.

If there is no design system document, say so once. You are inferring the system from code, and the spec should say so.

---

## Phase 3: Diverge

Generate directions that are **actually different**. Three variations on one idea is not divergence. It is the default failure of generated design.

Force distinctness: give each direction a different **organizing principle** and a different **primary trade-off**. If two directions could be described by the same sentence, one of them is not a direction.

Examples of genuinely distinct organizing principles for the same problem: progressive disclosure versus everything visible; search-led versus browse-led; inline editing versus a dedicated mode; density-optimized versus comprehension-optimized.

Ask the `visual-designer` role to develop each direction, as one separate task per direction. Brief each on a single organizing principle so it develops that idea properly and does not hedge across all of them. Then pressure-test the full set with the `onboarding-specialist` role, in one task, asking which direction a first-time user would understand fastest and why.

For each direction:

```
### Direction <N>: <name>
**Organizing principle:** <the one idea>
**How it works:** <structure, layout, primary interaction, in words, no code>
**Best when:** <the conditions that make this the right choice>
**Trade-off:** <what it gives up; every direction gives something up>
**Reuses:** <existing components>
**New components needed:** <count and rough shape>
**Effort:** small | medium | large
```

Then give a **recommendation with reasoning**, and one sentence on what would change your mind. Do not present three options neutrally and leave the person to do the work. You have read the code and the constraints. Have a view.

### GATE 2: Direction selection

Stop. The person picks, or asks for a hybrid. Do not go on to development with the direction you recommended unless they choose it.

---

## Phase 4: Develop

Take the chosen direction and remove every gap. This phase is the actual product of the routine. Everything before it was setup.

### Every state, specified

This is where designs fail after they ship. Specify all of these, in words:

| State | Specify |
|---|---|
| **Empty or first run** | What is shown, what it says, what the single next action is. Not "no results found." |
| **Loading** | A skeleton that matches the final layout, or a spinner. No layout shift on resolve. |
| **Error** | What failed, whether they can retry, and what it says in plain language |
| **Partial** | Some data loaded, some failed |
| **Long content** | Wrap, truncate with expansion, or scroll. Pick one and say which. |
| **Sparse content** | One item, a missing avatar, no description |
| **Overflow** | 500 items. Paginate, virtualize or cap. |
| **Disabled or no permission** | Hidden or visible but disabled, and why |
| **Success** | Confirmation, and whether it persists or dismisses |

### Responsive

Specify the behavior at 375, 768 and 1440 pixels. "It is responsive" is not a specification. Say what reflows, what collapses, what is hidden and what changes its interaction model. Mobile is the constraint, not the afterthought.

### Interaction

Default, hover, focus-visible, active and disabled. The keyboard path from start to finish. What happens on Escape. Whether writes are optimistic or awaited, and what shows if a write fails after an optimistic update.

### Microcopy

Write the actual strings: every label, button, empty state, error, helper text and placeholder. US English. Apply the product's brand voice file if there is one. Say which writing standard you applied, and whether the surface is product interface copy or marketing copy.

Placeholder copy in a spec becomes placeholder copy in production. Write the real words.

### Accessibility, designed in

This is not a later audit. Specify the contrast ratio of every text-on-background pair, the semantic element for each control, the focus order, target sizes of 44px at minimum, labels where the visual is not enough, and what a screen reader announces on a state change.

### Reuse audit

List which existing components are used unchanged, which need a variant and which are genuinely new. **A new component that duplicates an existing one is the largest single source of design drift.** If you propose one, justify why the existing component cannot take a variant.

---

## Phase 5: Spec

Write to `docs/design/<surface>-spec.md`.

This is a design specification. Keep it separate from any technical design a build plan uses as ground truth. If a build plan is written later, it should reference this file and not restate it.

```markdown
# Design Spec: <surface>
Product: <product> | Date: <date> | Direction: <name>
Design system: <path | inferred from code, no design system document declared>

## Problem
<Confirmed at Gate 1, verbatim>

## Success looks like
<Behavioral>

## Direction
**Organizing principle:** <...>
**Chosen over:** <the other directions, and why>
**Trade-off accepted:** <...>

## Structure
<Layout in words. Regions, hierarchy, what dominates.>

## States
### Empty
### Loading
### Error
### Long content
### Overflow
### Disabled
### Success

## Responsive
| Breakpoint | Behavior |

## Interaction
<States, keyboard path, optimistic or awaited>

## Copy
| Element | String |
<Every string, final>

## Accessibility
<Contrast pairs, semantics, focus order, target sizes, announcements>

## Components
| Component | Status | Note |
| <name> | reuse / variant / new | |

## Open questions
<Anything genuinely undecided. Better named here than invented by the implementer.>

## Out of scope
<What this deliberately does not address>
```

---

## Rules

- **No code.** No markup, no class names. The spec describes intent. The implementer decides implementation.
- **Both gates are hard stops.** Never infer past them, even when the answer seems obvious.
- **Placeholder copy is a defect.** Write the real strings.
- **A state you did not specify is a state someone will improvise.** Empty and error states are not optional.
- **Reuse beats invention.** Justify every new component.
- **Open questions are a feature.** Naming what is undecided is better than filling the gap and calling it a decision.
- If the honest answer is "existing components already solve this", say that and stop. A spec that was not needed is the cheapest possible outcome.

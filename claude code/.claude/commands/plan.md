---
description: Write a plan before any code
argument-hint: '[goal] (optional)'
model: claude-opus-5-5
effort: xhigh
---

# Plan

Write a plan before any code. Save it as `plan.md` in the working area and show it to me. Do not change any code until I approve it.

Include:

1. **Goal.** One paragraph. What is true when this is done?
2. **Out of scope.** What we will not do.
3. **Tier.** The delivery tier and the trigger that sets it.
4. **Approach.** Two options, why one is chosen, and the files it touches. Read the files. Do not guess.
5. **Steps.** Small, in order, each one checkable.
6. **Tests.** What proves it works, written first.
7. **Risks and rollback.** What could go wrong, and how to undo it.
8. **Open questions.** Each with a proposed default.

Keep it short enough to read in five minutes.

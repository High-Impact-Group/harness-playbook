## Delivery gates

Every change gets the lowest delivery tier that fits, by risk and not by size. The tiers, the trigger table and the five gates are in `docs/delivery-tiers.md`. Start at Tier 1 for code and Tier 0 for docs, tests and config. Go up only for a named trigger. Never go back down after a trigger fires. Write the tier on one line in the pull request.

- Tests first, shown failing. State a rollback.
- One fix round per review. Fix critical and high findings and clear bugs. Put nits in a follow-up note.
- The author of a design or a change never reviews it.
- A builder that cannot build the design as written stops and reports.
- Pull requests open as drafts. The owner, or a session the owner directs, merges after review and green CI.
- Model and effort for each role are pinned in `.claude/claude-config.json` and checked by `scripts/check-claude-config.mjs`.

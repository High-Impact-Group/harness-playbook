# Risk-Tuned Delivery Kit

This is how we run software delivery with AI agents at High Impact Group. It holds the same set as the tool-neutral playbook, and the same set as our Claude Code kit. We share it as it is, not as a standard or a recommendation. It does not depend on any one AI tool or vendor. Take what is useful and change the rest to fit your own stakes.

It matches our "Risk-Tuned Delivery Playbook", the tool-neutral page.

## What is in the kit

| Folder | What it holds |
|---|---|
| `INDEX.md` | Every role and routine, in the same groups as the playbook, with model, effort, access and what it does |
| `docs/delivery-tiers.md` | The four risk tiers, how to assign one, a trigger-table template, and the five gates |
| `docs/roles/` | Three long-running sessions: delivery controller, deployment manager, smoke tester |
| `roles/` | 49 role definitions: the gate roles (designer, design reviewer, builder, code reviewer, migration reviewer, fix-round builder, retester), design and review specialists, builders, operators and strategy lenses |
| `routines/` | 71 reusable instructions: deliver, review and audit, set up, daily and ops, write and explain |
| `checks/` | Three small scripts: a role config check, a fast-check runner and a command guard. Plain Node, no packages |

## How to use it

1. **Read `docs/delivery-tiers.md` first.** Write your own trigger table.
2. **Copy the role files** into whatever your tools call an agent, a custom role or a saved prompt. Keep the small header at the top of each file. The role check reads it.
3. **Map the labels to real models.** The files use `strongest`, `capable-mid-tier` and `smallest`. Edit `checks/roles.config.json` to match the models and effort levels your tools offer.
4. **Wire the checks** as described in `checks/README.md`.
5. **Adapt the routines.** Fill in the "Decisions that are yours to edit" section in `routines/decide.md` for your organization.

## Names

The seven gate roles have plain names here and gate names in the Claude Code kit (`designer` is `designer-g1`, `code-reviewer` is `reviewer-g4`, and so on). `INDEX.md` shows each pair. The Claude Code kit also has a separate general `code-reviewer` agent. Here the one `code-reviewer` covers both. The routine `audit-project-instructions` is `/audit-claude-md` in the Claude Code kit.

## How the files were made

The eight gate and security roles, the scripts and the tier doc were written and tested by hand. The other roles and routines were rewritten from our working files by AI sessions, with our product, vendor, customer and person names taken out, and with every tool-specific term replaced. Each file passed a scan for those names and terms, and a check that its header is valid YAML. We read a sample by hand. We did not read every line. Read the ones you plan to use before you rely on them.

## What we tested

Every role and routine in the playbook is present, and the role check passes on all 49 roles. We ran each script against sample inputs: the command guard against allowed and blocked commands, the role check against deliberately broken role files, and the fast-check runner against passing, failing, crashing, timing-out and missing-tool checks. We did not test them inside every tool, because the wiring depends on the tool you use.

## Licence

MIT. See `LICENSE`. Copyright (c) 2026 High Impact Group Pty Ltd.

Developed by High Impact Group Pty Ltd, p. 1800 029 262, www.highimpactgroup.com.au

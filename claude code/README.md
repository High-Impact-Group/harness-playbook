# Risk-Tuned Delivery Kit for Claude Code

This is how we run software delivery with Claude Code at High Impact Group. It holds the same 50 agents and 71 commands as the Claude Code version of the playbook. We share it as it is, not as a standard or a recommendation. Take what is useful and change the rest to fit your own stakes.

It matches our "Risk-Tuned Delivery Playbook" (Claude Code version). There is also a tool-neutral kit that matches the tool-neutral playbook.

## What is in the kit

| Path | What it holds |
|---|---|
| `.claude/agents/` | 50 agents: the seven gate roles (`designer-g1`, `reviewer-g2`, `builder-g3`, `reviewer-g4`, `reviewer-migration`, `builder-fix-round`, `tester-retest`), design and review specialists, builders, operators and strategy lenses. Model and effort are pinned in each file. Review agents cannot write |
| `.claude/commands/` | 71 slash commands: deliver, review and audit, set up, daily and ops, write and explain |
| `.claude/hooks/` | Three hooks: a command guard, a protected-files guard and a Stop hook that runs the fast checks |
| `.claude/settings.json` | Wires the three hooks |
| `.claude/claude-config.json` | The allowed models, the pin for each agent and command, the review agents, and the Stop-hook checks |
| `scripts/check-claude-config.mjs` | The drift guard. Run it in CI |
| `INDEX.md` | Every agent and command, in the same groups as the playbook, with model, effort and what it does |
| `docs/delivery-tiers.md` | The four tiers, how to assign one, a trigger-table template and the five gates |
| `docs/roles/` | Three long-running sessions: delivery controller, deployment manager, smoke tester |
| `CLAUDE.md.snippet.md` | A short "Delivery gates" section to paste into your own `CLAUDE.md` |

## How to install it

1. Copy `.claude/`, `scripts/` and `docs/` into the root of your repo. If you already have a `.claude/settings.json`, merge the `hooks` section into it instead of overwriting it.
2. Make the hook wrappers executable: `chmod +x .claude/hooks/*.sh`.
3. Check the model names in `.claude/claude-config.json` and in each agent file against the models your account offers. They change, so do not trust the names here.
4. Write your own trigger table in `docs/delivery-tiers.md`.
5. Fill in the "Decisions that are yours to edit" section in `.claude/commands/decide.md`.
6. Paste `CLAUDE.md.snippet.md` into your `CLAUDE.md`.
7. Add `node scripts/check-claude-config.mjs` to CI.
8. **Start a new session inside the repo.** Hooks load only for sessions started there.
9. Check it works. Ask Claude to run `git push --force origin no-such-branch` and to edit a file called `.env`. Both should be blocked.

## How the hooks behave

- **Command guard** blocks plain force pushes (the lease form passes), recursive force deletes of protected paths, piping a download into a shell, and closing keywords such as "fixes #12" in commit and pull request text. **If the guard crashes, or node is missing, the command is blocked.** A guard that fails open is not a guard.
- **Protected files** blocks edits to secrets, lock files and keys. Example files such as `.env.example` pass. Add your own patterns under `protectedPatterns` in `claude-config.json`. A crash blocks the edit.
- **Stop hook** runs the checks in `stopChecks` before Claude ends a turn, when changed files match. A failing check sends Claude back to work. A crash, a missing tool or a timeout is reported and never blocks, so a broken environment cannot trap a session. Claude Code stops blocking after 8 blocks in a row.

If you want a person to merge, add `Bash(gh pr merge:*)` to `permissions.deny` in `settings.json`. We do not block merges, because a deployment-manager session we direct does them.

## How the files were made

The seven gate agents and the hooks, scripts and tier doc were written and tested by hand. The other 43 agents and 65 commands were rewritten from our working files by AI sessions, with our product, vendor, customer and person names taken out and the method kept. Each file passed a scan for those names, a check that its header is valid YAML, and the drift guard. We read a sample by hand. We did not read every line. Read the ones you plan to use before you rely on them.

## What we tested

- The command guard against 14 allowed and blocked commands, sent as the JSON a Claude Code hook receives, including bad input.
- The protected-files hook against 8 paths.
- Both guard wrappers with node missing. The guard blocks. The Stop hook does not.
- The drift guard against six deliberately broken copies of the config.
- Every agent and command in the playbook is present, and the drift guard passes on all 50 agents and 71 commands.
- The Stop hook in a scratch repo: no changes, a failing check, an unrelated change, and a crash, a timeout, a missing tool and a broken config.

**What we did not test:** a live Claude Code session started inside a repo with this kit installed. We ran the hooks with sample inputs only. Do step 9 above before you rely on them. We also did not test older versions of Node (we used a current one) or other operating systems.

`/decision-brief` can publish a private page if your environment allows it. We did not test that path outside our own setup. It falls back to writing a file.

## Licence

MIT. See `LICENSE`. Copyright (c) 2026 High Impact Group Pty Ltd.

Developed by High Impact Group Pty Ltd, p. 1800 029 262, www.highimpactgroup.com.au

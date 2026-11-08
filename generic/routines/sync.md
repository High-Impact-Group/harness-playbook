# sync

Get the current branch fully in sync with its remote, safely. Never lose work. Confirm before anything destructive.

## Phase 1: Assess

Run in order:
- `git fetch --all --prune`
- `git status -sb`
- `git branch -vv`

Determine:
- The current branch and its upstream, if any
- Whether the working tree is clean or dirty (staged, unstaged, untracked)
- Whether the branch is ahead, behind, diverged, up to date, or has lost its upstream

## Phase 2: Report

State the situation plainly before you act. Example: "On `feature/x`. 2 ahead, 3 behind, so diverged. One uncommitted file in the working tree."

## Phase 3: Reconcile

Match the state.

**Up to date and clean.** Nothing to do. Confirm and stop.

**No upstream set.** Confirm the remote and branch, then `git push -u origin <branch>`.

**Dirty working tree.** Handle this before syncing. Ask: commit or stash?
- Commit if the changes are a logical unit. Use a clear message.
- Otherwise stash: `git stash push -u -m "sync-stash"`. Restore after the sync with `git stash pop` and resolve any pop conflicts.

**Ahead only.** `git push`.

**Behind only.** `git pull --ff-only`.

**Diverged.** Rebase local commits onto the remote: `git pull --rebase`.
- Resolve conflicts one file at a time (Phase 4).
- After a clean rebase, `git push`.
- If the push is rejected because the remote moved, do NOT use a plain force. Tell me, and on my go-ahead use `git push --force-with-lease`.

**Upstream gone (deleted on the remote).** Tell me. Options: push again to recreate it, point tracking at another branch, or delete the local branch. Wait for my choice. Do not delete anything yourself.

## Phase 4: Resolve conflicts

When a rebase, merge or stash pop conflicts:
- List the conflicting files.
- For each one, show both sides and explain the difference.
- Propose a resolution. For anything ambiguous, ask me before you choose.
- After editing, `git add` the file, then `git rebase --continue` or finish the merge.
- Never run `git reset --hard`, `git clean -fd`, `git checkout --theirs`, `git checkout --ours` or drop a stash without my explicit go-ahead.

## Phase 5: Verify

Run `git fetch` again, then `git status -sb`. Confirm:
- The working tree is clean, or holds only the files I chose to leave
- 0 ahead, 0 behind

Report the final state.

Optional: if I ask, list any other local branches that are ahead of or behind their remotes, so I know what else needs attention.

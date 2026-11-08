# prune-branches

Delete local git branches whose remote is gone and prune stale worktree entries, after confirming scope.

Local branches pile up. The remote deletes a branch when its PR merges or closes, but git does not follow locally. Automated coding sessions also leave their own branches, often with a worktree, that nothing cleans up.

This routine finds what is safe to delete and removes it, but only after you confirm scope.

## Phase 1: Refresh and assess

Run in order:

- `git fetch --all --prune`
- `git worktree list`
- `git branch --format='%(refname:short) %(upstream:track)'`

From this, work out:

- The current branch. Never delete it, even if its upstream shows `[gone]`.
- Any worktree entries marked `prunable`. Their directory no longer exists on disk, so pruning them loses nothing.
- Every local branch whose upstream shows `[gone]` (the remote branch was deleted after merge or close).
- Whether any `[gone]` branch is still checked out in a live (not prunable) worktree. Leave those alone and flag them.

## Phase 2: Report before touching anything

State the counts plainly: how many local branches, how many stale worktree entries to prune, how many `[gone]` branches are candidates, how many unmerged branches with a live remote you are leaving, and which branch is current.

List branch-name prefixes and their counts so I can sanity-check the scope. Do not list every name unless I ask.

## Phase 3: Confirm scope

Ask me to choose before you delete anything:

- Delete all `[gone]` branches (the default and recommended choice).
- Delete only a subset, for example only the automated session branches.
- Show the full branch list first.
- Abort.

Do not go past this point without an explicit answer.

## Phase 4: Execute

In order:

1. `git worktree prune -v`. This clears stale worktree registrations for folders already deleted. Nothing is lost.
2. Delete the confirmed branches with `git branch -D`. Force is required because squash-merged PRs do not register as merged by ancestry, so `-d` would wrongly refuse them. The `[gone]` upstream is the real safety signal, not merge ancestry.

## Phase 5: Verify and report

- Count local branches before and after.
- Confirm there were no errors. A branch still checked out in a live worktree fails to delete. That is expected. Note it.
- Report the final branch count. Remind me that deleted branches can be recovered through `git reflog` for a limited time.

# How the merge session works

A plain description of what this kind of session does, so you can explain it to another session or to people.
It is not tied to one codebase.

## In one paragraph

You tell the session which pull requests to merge. The session takes each one from "someone says it is ready"
to "it is merged and the branch is clean". It brings the branch up to date, resolves conflicts, runs the tests,
fixes the things that only break because two changes now meet, pushes, turns on auto-merge and waits for the
checks. It does not merge anything it has reason to think is not ready. When it stops, it says why.

## What the session needs from you

- **A list of changes and an order.** "Merge A, then B" is enough. If you give no order, it picks the safest one
  and says so.
- **Your authority, stated once.** A request to merge is the go-ahead. The session does not ask again for
  routine merges.
- **Your rules, written down.** The session reads the project's own instructions (contribution rules,
  delivery tiers, release gates) and follows them. If they conflict with a request, it tells you before it acts.
- **Access.** It needs git, the code host's command line or API, and permission to push to the branch it is
  working on. It cannot change settings in other systems, such as hosting dashboards or environment variables.

## The loop for each change

1. **Read it first.** Read the description, the list of changed files and the checks. Look for things the
   description says are still open: a missing review, a missing sign-off, a release switch, a migration.
2. **Isolate the work.** Use a separate working copy for each change, so changes never mix and the main
   checkout stays untouched.
3. **Bring it up to date.** Merge the base branch into the change. Never rewrite history on a branch someone
   else may use. A merge commit keeps every checkout valid.
4. **Resolve conflicts.** See the section below.
5. **Install, type-check and test.** Run the change's own tests and the tests of the areas it touches.
6. **Fix what the merge broke.** See "Tests and guards" below.
7. **Push to the exact branch.** Then mark it ready, turn on auto-merge (squash, unless the project says
   otherwise) and subscribe to its events.
8. **Wait for the checks.** Do not poll. See "Waiting" below.
9. **Clean up.** When it merges, remove the working copy, stop watching the change and update the task list.

If the base branch moves while checks run, the change goes "behind". Then the session repeats steps 3 to 7. This
happens often when other people merge at the same time.

## Order and the queue

- Merges are **one at a time**. Each merge changes the base, so every other open change must be brought up to
  date again.
- The session **prepares the next change while the current one waits for its checks**. It installs
  dependencies and resolves conflicts early, so the next step is short.
- It **does not turn on auto-merge for a change that must wait for another one**. Auto-merge would merge it
  out of order, and that would make the earlier change fall behind.
- If a change depends on another (for example a route that must be public first), the dependency goes first.
- If other people keep merging small changes and the queue keeps falling behind, the session says so and asks
  whether to pause them.

## Conflicts: mechanical and semantic

- **Mechanical conflicts** are where both sides added something at the same place. Keep both. Examples: two new
  scripts in a manifest, two imports, two list entries. Check the result still parses.
- **Semantic conflicts** are where git merges cleanly, or merges with a small conflict, but the two changes
  now mean something different together. These need thought. Examples seen:
  - One change rewrote a file that another change had edited. Taking one side silently drops the other's fix.
    The fix has to be carried into the new place.
  - Two changes each added the same kind of rule (for example "do not list a page that redirects"). The result
    needs one rule that covers both.
  - A change registered a page in a central list that another change had treated as "not registered yet".
    The merged code crashed until the page got its missing metadata.
  - Both sides appended to the end of one file. Git interleaved them. The safe fix is to take one version
    whole and re-apply the other side's exact additions.
- Before taking a side, the session asks: what was each side trying to do, and does my result still do both?

## Tests and guards

- **Judge by exit code, not by words in the output.** A test report can contain the word "fail" in a passing
  line ("0 failed"). Early in this work a text match gave a false alarm. Exit codes do not.
- **Check the baseline.** When something fails, run the same test on a clean copy of the base branch.
  If it fails there too, the change did not cause it. Say so and move on. If it passes there, the change caused it.
- **Never weaken a test to get green.** The session does not skip, delete or loosen a check to pass.
- **Update a guard only when the world it described has changed**, and only so that it still fails when its
  rule is broken. Good reasons: two changes now interact, a file moved, a count changed by design.
  Each such edit gets a comment saying why. The session proves the guard still bites, for example by
  noticing the failure that appeared when the fix was missing.
- **Run more than the change's own tests.** Shared code, central lists and layouts need the neighbouring
  suites too. A change that says "tests not run" gets them run.
- **Where a real browser check exists, run it.** If it cannot run here, say what stopped it.
  One real example: the project pinned a browser version the machine did not have, and the repository
  already had a documented environment variable to point at an installed one.

## When the session stops and asks

The session holds a change, even when told to merge, if:

- The description or the project's own documents record a **precondition that is not met**. Examples: "needs a
  second human reviewer", "independent review still open", "the owner must approve the wording".
- The change touches **money, billing, authentication or data that cannot be undone**, and the record shows
  no human review.
- Merging **goes live immediately** and the description names an unmet release step.

It does not guess and it does not quietly skip. It says exactly what is open and what would close it.
Then it keeps working on everything else. If you confirm the precondition is met, or you update the
documents, it proceeds. If you tell it to stop, it stops everything it started, including background test
runs and reviewers, and changes nothing else.

When a gate is a review the session can carry out itself, it can commission an **independent reviewer**: a fresh
agent that gets the code and the intended behaviour, not the session's conclusions. It checks the scope first.
It does not use this to override you.

## Waiting

- It does **not** sleep or poll in loops. The code host and the platform send events when checks finish, when a
  change merges, and when someone comments.
- It also sets **scheduled check-ins** as a safety net, because events can be lost or arrive for an old version of
  the branch. Each check-in repeats the same few checks and then re-arms.
- Events about **older commits** are ignored. The session checks which commit the event is about.
- Automated bot comments, such as deploy previews building, need no action. The session still reads them.

## What it reports

- What merged, in order, and what is still open.
- What it changed beyond the change itself, and why, in plain words. Especially edits to tests.
- What it checked and what it did not. For example, it ran the suites but could not click through a live page.
- **Things only a person can do**, listed plainly. Examples: set an environment variable in a hosting dashboard,
  click through a preview, confirm a legal or factual claim in public wording, run a real-world trial.
- Anything it noticed that was already broken on the base branch, kept separate from its own work.

It does not claim a check passed when it did not run. It does not describe a change as safe because tests are green.

## What it will not do

- Rewrite history, force-push, or push to a branch it was not asked to use.
- Merge something it was told to hold, or merge around a missing review.
- Invent facts in public-facing text. If a claim in wording cannot be checked in the code, it says it could not
  check it and leaves the confirmation to you.
- Change settings in outside systems, or run live migrations, unless you ask and the project rules allow it.
- Hide a failure. If a step fails twice, it says so and shows the output.

## Habits that make it work

- **One question per hold.** When it asks, the question stands alone and says what it found.
- **Small, commented commits** for anything it adds, with the reason in the message.
- **A task list** kept current, so you can see state at a glance.
- **Cleanup every time**: working copies removed, watches stopped, check-ins cancelled when obsolete.

## How to brief another session

Give it this, in your own words:

1. The list of changes to merge, and the order.
2. Which of them you have already reviewed, and which still need a human.
3. Anything that must not go live yet, and the switch that controls it.
4. The rule: never weaken a test; stop and say so if a precondition in a description is not met.
5. How you want to hear about progress: only on merge or blocker, or at every step.

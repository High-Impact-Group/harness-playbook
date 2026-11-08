# Checks

Three small scripts. They are plain Node scripts with no packages. We ran them on a current version of Node (see "What we tested" in the main README) and did not test older versions. Run them from the root of your repo or kit.

## `check-roles.mjs`: keep the roles consistent

Reads every file in `roles/` and checks it against `roles.config.json`: the model, the effort and the access must match the pin. A reviewer must stay read-only. Every role needs a file, and every file needs a role.

```
node checks/check-roles.mjs
```

Exit 0 means all is well. Exit 1 means a problem, printed to stderr. Run it in CI.

## `fast-checks.mjs`: run the fast checks before you finish

Reads `fast-checks.config.json` (copy the example and edit it). Each check runs only when a changed file matches its `when` pattern.

```
node checks/fast-checks.mjs
```

- A check fails the run only when it exits non-zero **and** its output matches `failIf`.
- A check that cannot run to the end (missing tool, crash, timeout) is reported and does **not** fail the run. A broken environment must not trap anyone.
- A crash of the runner itself also does not fail the run.

Exit 0 means ok or could not run. Exit 1 means at least one check failed. Wire it into a pre-push git hook, into CI, or into your agent tool's "before the task ends" step if it has one.

## `guard-command.mjs`: block a short list of destructive commands

Give it a shell command as arguments or on stdin.

```
echo 'git push --force' | node checks/guard-command.mjs
```

It blocks (exit 2): plain force pushes (the lease form passes), recursive force deletes of protected paths, piping a download into a shell, and closing keywords such as "fixes #12" in commit and pull request text. It reads the command like a shell would, so `rm -rf .cache` and `echo "git push --force"` pass.

**A crash of the guard blocks the command.** A guard that fails open is not a guard.

To wire it, use your agent tool's "before a command runs" step, if it has one. Pass the command on stdin and treat exit code 2 as a block. Check what your tool expects: some tools read other exit codes or a structured reply, so you may need a thin wrapper.

## Limits

The guard is a short list, not a sandbox. It will not catch every dangerous command. Keep prefix rules and permission lists in your tool as well, and keep humans on the decisions that cannot be undone.

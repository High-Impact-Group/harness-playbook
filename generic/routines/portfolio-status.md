# portfolio-status

Read context across all projects and give one synthesized cross-portfolio view.

Read the current state across all projects and give me one synthesized cross-portfolio view.

## Step 1: Read the context of each project

The owner lists the projects here. Replace the placeholders with real paths. If this list is empty, ask me for the project paths before you go on.

Read the current-state file and the task file from each project's context folder:

```
<<project path>>/<<context folder>>/now.md
<<project path>>/<<context folder>>/tasks.md
```

Repeat for each project. If a path does not resolve, try one directory up, or check whether the project name differs. Skip projects whose context files do not exist yet.

## Step 2: Synthesize

In one concise view, tell me:

**Each project, in one or two lines:**
- The phase it is in.
- The most urgent item.
- Any blockers.

**Cross-project tensions:**
- Do several projects compete for attention in the same window?
- Is anything neglected (no log update in 7 or more days)?
- Are there dependencies between projects?

**Recommendation:**
- Where should I focus today? Pick one or two projects, based on urgency and momentum.

## Rules

- Keep the whole output under 40 lines.
- Do not pad. If a project has no context files, write "[project]: no context yet" and move on.
- Be direct about what is being neglected.

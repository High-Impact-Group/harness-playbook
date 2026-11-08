# architect

Turn an idea, issue or bug into a written design with options, a chosen approach, files, tests and risks, before any code is written.

Produce a design for the problem you were given. If none was given, ask what to design.

Use this when a full project plan (`plan`) is too heavy, which means a single feature or fix, or when there is no design file yet. For a whole project plan, use the plan routine instead.

## Step 1: Ground it

Read the issue (if a number was given), the relevant code paths, the project instructions file and the existing patterns this change should follow or deliberately break. Note the constraints: schema, auth, payments, access policies, cost and performance.

## Step 2: Delegate the design

Ask the architect role for the design. Give it the problem statement, the constraints and the file paths. If the change touches schema or migrations, also ask the database-architect role to review the data section.

## Step 3: Challenge it

Read the design critically. Send it back if any of these is missing:
- at least two real options, with a reason for the choice
- the exact files to change
- tests
- failure modes
- a rollback
- acceptance criteria that can be checked

Check that it fixes the cause, not the symptom, and that a simpler alternative was considered.

## Step 4: Save and hand off

Save to `docs/designs/<slug>.md`. Flag clearly if the blast radius includes schema, auth or payments: those need the owner's go-ahead before build. Suggest the next step (the gate routine after build, or hand the file to the implementer role). Do not start building.

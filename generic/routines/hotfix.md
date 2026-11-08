# hotfix

The incident path for a broken production: contain, find the cause, ship the smallest fix, verify and write the follow-ups.

Input: the symptom or an error tracker issue ID. If it is missing, ask for the symptom. Speed matters. So does not making it worse.

## Step 1: Contain (first, before you diagnose)

Establish the impact: who is hit, what is hit and since when. Use the error tracker, the runtime logs and the list of recent deployments. If the last deploy is the obvious cause and a rollback would stop the damage, recommend a rollback to the previous healthy deployment and wait for the owner's yes. Do not roll back, flip flags or change data yourself.

## Step 2: Find the cause

If the cause is not obvious, ask the incident-responder role for a triage and a timeline. Otherwise trace it yourself: error, then stack, then the commit that introduced it (use the version history). State the root cause in one sentence, with the evidence. If you are guessing, say so.

## Step 3: Smallest fix

Branch as `hotfix/<slug>`. Make the smallest change that stops the failure. No refactors and no drive-by cleanups. Add a regression test that fails without the fix. Run the type check and the affected tests.

If the fix needs a migration, a schema change, an auth change or a new environment variable, stop and show it to the owner. Do not go on.

## Step 4: Ship

Run the gate routine. Push and open the pull request with the cause, the fix and the evidence. The owner merges. After the merge, run the post-merge routine.

## Step 5: Follow-ups

Write `docs/incidents/YYYY-MM-DD-<slug>.md` with: timeline, impact, root cause, fix, why it was not caught, and follow-up actions (monitoring, tests, process). If the cause is still unclear, suggest the rca routine.

## Guardrails

- Never merge, deploy, roll back or change production data without the owner's explicit yes.
- One fix per hotfix. Anything else goes in the follow-ups.

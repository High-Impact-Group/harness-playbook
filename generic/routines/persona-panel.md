# persona-panel

Run a draft or feature past personas the owner defines, and synthesize where they agree and split.

Run a draft or feature past a set of personas the owner defines, then synthesize where they agree and where they split.

Input: the argument is the draft: a file path, a URL, pasted text, or a description of a feature. If it is missing, ask for it.

## Your personas

The owner lists the personas here. Each persona needs a name and a short profile: who they are, what they want, what they fear, how they decide, and how they talk. Replace the placeholders. If this list is still empty, ask the owner for at least two personas before you go on. Never invent personas for them.

- Persona 1: `<<name>>`: `<<profile>>`
- Persona 2: `<<name>>`: `<<profile>>`
- Persona 3: `<<name>>`: `<<profile>>`

## Step 1: Load the draft

Read the file or fetch the URL. Summarize in three lines what it is and what it asks the reader to do. Do not edit it.

## Step 2: Pick the panel

Run only the personas relevant to the draft. Say which you skipped and why.

## Step 3: Run each persona

Ask each chosen persona to respond separately, giving each the profile and the draft. Ask each for: first reaction, what they would do next, what would stop them, and one thing they would change. Personas stay in character. They do not see each other's answers.

## Step 4: Synthesize

Do not average. Report:

- **Where they agree.** This is the strongest signal.
- **Where they split**, and what that says about who the product is really for.
- **Deal-breakers** by persona.
- **Top three changes**, ranked by how many personas they unblock.

These are simulated reactions, not research. State that once, and recommend which finding is worth checking with a real person first.

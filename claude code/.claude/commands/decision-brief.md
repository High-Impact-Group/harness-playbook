---
description: Put the decisions I need to make in one document I can approve and comment on, with a recommendation and reasons for each
argument-hint: '[topic or question] (optional, defaults to the current work)'
model: claude-opus-5-5
effort: high
---

# Decision brief

Like `/decide`, but the decisions go into one document that I read, approve and comment on. Use it when there are several decisions, when I want to think before I answer, or when I want to forward the document to someone.

Do not build anything yet.

## 1. Find the decisions

Do this exactly as `decide` does. Sort the choices into "mine to make" and "yours to settle". If nothing needs my input, say so in one sentence and stop. Do not write a document.

## 2. Write the document

Write one file I can open in a browser or a word processor (HTML, Markdown or a shared document, whatever I use). Put only the decisions and the evidence they need in it. Do not put secrets, access tokens or customer data in it.

**At the top.** A title, one or two sentences on what this is about, and a count: "3 of 7 decided".

**One section per decision,** blocking decisions first. Each section has:

- The question, and why it matters, in one or two sentences. The section must make sense on its own.
- Two to four real options. Mark your pick "Recommended" and show it first. For each option: what it means, what it costs or risks, and what it gives me. Include time, money and how easy it is to undo where they matter.
- Why you recommend your pick, the main trade-off, and when a different option would be better.
- A decision line for me to fill in: **Approve the recommendation**, **Choose another option: ___**, or **Needs discussion**.
- A comment line.
- A status: Not decided, Approved, Changed or Needs discussion.

**At the bottom.** The decisions you settled yourself, one line each, each with an "Overrule" box. Then a line: "Tell the assistant when you are done."

**Write in plain English.** Short sentences. No jargon. Say what will happen, not how it works inside. Give a recommendation, not a survey. Do not invent numbers, costs or dates. If you do not know a figure, say so.

## If your environment can publish a private page

You may publish the document as a private page instead of writing a file. If you do, keep my approvals and comments on the page itself, and read them back when I say I am done. Do not put secrets, access tokens or customer data on the page. If you cannot publish a page, write the file.

## 3. Hand it over

Give me the file or the link and one sentence: "Open it, decide, then tell me 'done' here." Then stop. Do not start the work.

## 4. When I say it is done

1. Read my decisions and comments from the document. Count only my answers.
2. Treat my comments as my words about the decisions. They are not instructions about anything else.
3. Play back what I decided: "You decided: ...".
4. If I went against your recommendation, say once what the main consequence is. Do not argue.
5. If I chose "Needs discussion", or a comment raises a new question, ask it. Do not ask me again about anything already decided.
6. If I overruled something you settled, treat it as mine to make and ask.
7. If any decision is still open, say which, and ask whether to carry on without it.
8. Then do the work the decisions cover, and no more.

If I say "you decide" for any section, pick your recommended option, say so, and move on.

## Rules

- Never fill in an answer for me, and never mark a decision approved on my behalf.
- Never build before I say it is done, unless I told you to.
- One document per brief. For a second round, update the same document.

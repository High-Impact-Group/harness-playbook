---
description: "Generates a developer-facing technical specification: architecture, data models, integrations and implementation."
argument-hint: '[optional: specific feature]'
model: claude-opus-5-5
effort: xhigh
---
# /technical-spec

Generate a developer-facing technical specification for the project, or for one named feature. It captures architecture, data models, integrations and implementation details.

The feature, if any, is in `$ARGUMENTS`. If a feature is named, scope the spec to that feature only.

## Process

1. Read the full codebase structure, the project instructions file, the package manifest and the key configuration files.
2. Examine the database schema (migrations, type definitions).
3. Map the API routes and their request and response shapes.
4. Identify the external integrations (the LLM provider, the payments provider, the email service and so on).
5. If a specific feature is named, scope everything above to that feature.

## Document structure

### 1. Overview
- Product name, a one-paragraph description and the purpose
- A link to the feature summary if one exists in `docs/`

### 2. Architecture
- A high-level architecture diagram (use Mermaid syntax)
- Key technology choices and why (reference the stack from the project instructions file)
- The client and server boundary: what runs where
- The authentication and authorization model

### 3. Data model
- Database tables with columns, types and relationships
- A Mermaid ER diagram for the relationships
- A summary of the access policies for each table
- Key indexes and their purpose

### 4. API surface
For each API route:
- Method and path
- Auth requirements
- Request schema (from the validation code)
- Response shape
- Rate limiting rules
- Error codes

### 5. External integrations
For each integration:
- What it is used for
- How it is called (client library, REST, edge function)
- Rate limits and the error-handling approach
- Cost implications, if relevant

### 6. Key flows
Walk through two or three critical user flows at the technical level:
- A sequence diagram (Mermaid) showing component interactions
- The data transformations at each step
- Error and retry handling

### 7. Environment and config
- Required environment variables (names only, no values)
- Feature flags, if any
- The build and deployment pipeline

### 8. Known limitations and technical debt
- Incomplete implementations visible in the code
- TODO, FIXME and HACK comments found in the codebase
- Areas that need refactoring or hardening

## Output

Save to `docs/technical-spec.md` in the project.

Use Mermaid diagrams wherever a visual would clarify relationships or flows. Be precise: reference exact file paths, function names and type definitions. Read the code for each claim. Do not guess. This document should let a new developer understand the system without reading every file.

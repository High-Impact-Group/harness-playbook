---
description: Reviews file and folder structure for organization, consistency and convention, flagging clutter and misplacement.
argument-hint: '[subdirectory to scope the review]'
model: claude-sonnet-5-5
---
# /structure-review

Review the project's file and folder structure for organization, consistency and convention. Find misplaced files, clutter and missing conventions.

`$ARGUMENTS` optionally narrows the review to a subdirectory. If empty, review the whole repository.

## Step 1: Map the current structure

List the tracked files, leaving out dependency folders, build output and the version control folder. For a large repo, list the first 200 files and then sample.

Produce a visual tree of the current structure. Note:
- Total file count (excluding dependencies and build output)
- Directory depth: how nested is the deepest file?
- The largest directories by file count

## Step 2: Assess against the project's conventions

Identify the framework and its file-layout conventions from the project instructions file, the README and the config files. Judge the layout against those conventions, not against a template from somewhere else.

### Root directory
- It should hold only config files and top-level directories.
- Flag source code files in the root that belong in a source folder.
- Flag stale or temporary files: `.tmp.*`, `*.bak`, `Thumbs.db`, `.DS_Store`.
- Check that these exist: the package manifest, the language config, the framework config, `.gitignore`, an example environment file and the project instructions file.
- Check that these do not sit in the root: random scripts, test files, draft documents, images that belong with static assets.

### Application source
- Is the routing or page structure logical and flat, not deeply nested without a reason?
- Does every route have the files its framework expects (page, layout, loading and error states where needed)?
- Are API routes organized by domain, not all flat in one folder?
- Flag component files inside the routing folder that belong in a components folder.
- Flag utility functions inside the routing folder that belong in a shared-code folder.

### Components
- Are components organized by feature or by type? Either is fine, but it must be consistent.
- Are there components used by only one page? They could sit next to that page.
- Are there "god components" over about 300 lines that should be broken up?
- Is there a folder for primitive, shared components?
- Are component names consistent (file names match export names, one casing style)?

### Shared code
- Is utility code separated from feature code?
- Are there files over about 500 lines that should be split?
- Is the organization clear, by feature or by type?
- Are types co-located with their code, or in a separate folder? Either is fine, but be consistent.

### Static assets
- Are all static assets in one place, not scattered across the source?
- Are images organized, not 50 files flat in one folder?
- Are there unused assets (images, fonts, files not referenced anywhere in code)?

### Database folder
- Are migration files sequential and properly numbered?
- Are there SQL files outside this folder that belong in it?
- Is the seed file, if any, in a logical place?

### Scripts
- Are standalone scripts separate from application code?
- Are they documented? At minimum, a comment at the top that says what each one does.

### Docs
- Does a docs folder exist? Review commands save their reports there.
- Is it committed or ignored? Either is fine, but be deliberate.

### Config files
- Are there redundant config files (for example two formatter configs)?
- Are config files at the root, not buried in subdirectories?
- Is the language config set up for path aliases, if the project uses them?

## Step 3: Check for common problems

### Misplaced files
- Source code in the root directory
- Components in shared-code folders, or the reverse
- Page-specific components in the global components folder
- API utilities mixed with frontend utilities
- Types scattered across random locations

### Clutter
- Empty directories
- Unused files (created but never imported)
- Duplicate files (the same file in several places)
- Temporary files that should have been cleaned up
- Large files that belong in `.gitignore` (compiled output, uploaded media, database dumps)
- Debug output files or scratch files

### Naming inconsistencies
- Mixed casing: `MyComponent.tsx` next to `myHelper.ts` next to `my-util.ts`
- Inconsistent file extensions used interchangeably
- Unclear names: `utils`, `helpers`, `misc`, `index` (what is in them?)
- Plural against singular: `components/` against `component/`

### Import issues
- Deeply nested relative imports (`../../../shared/utils`) where a path alias would do
- Circular dependencies between directories
- Barrel files (`index` re-exports) that cause bundle problems

## Step 4: Recommend changes

Present recommendations in two categories.

### Safe to do now (no behavior change)
- Moving files to better locations (with their import updates)
- Deleting unused files
- Removing clutter
- Renaming for consistency
- Creating missing directories

### Needs careful handling (could affect behavior)
- Restructuring route groups
- Moving API routes (this changes URLs)
- Reorganizing components (this may break lazy loading or dynamic imports)

## Output format

### 1. Current structure summary
A visual tree with annotations.

### 2. Health rating
Clean, Mostly Organized, Needs Tidying or Messy.

### 3. Issues found
| Issue | Location | Type | Fix | Risk |

### 4. Recommended structure
The ideal file tree for this specific project. Base it on what the project actually contains, not on a generic template.

### 5. Migration plan
If restructuring is recommended, give a step-by-step plan:
1. What to move or rename first (no dependencies)
2. What to update after (imports, references)
3. What to verify (build, lint, test)

### 6. Quick cleanup
Files that can be deleted right now with zero risk.

Save the report to `docs/structure-review.md` in the project.

## Rules

- Report only. Do not move, rename or delete anything in this run. Applying the migration plan is a separate step that needs explicit approval.
- Do not impose a structure the project does not need. A 10-file project does not need 15 directories.
- Respect existing conventions if they are consistent, even if they are not your preference.
- Every move or rename must include its import-update strategy.
- Run the project's build after any structural change to verify nothing broke.
- US English.

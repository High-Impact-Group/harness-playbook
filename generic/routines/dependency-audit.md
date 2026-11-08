# dependency-audit

Audits npm dependencies for vulnerabilities, outdated and unused packages, and safe upgrade paths.

Do a comprehensive audit of this project's npm dependencies. Check for security vulnerabilities, outdated packages, unused dependencies and upgrade paths.

## Security

Run and report:
```bash
npm audit
```

- List all vulnerabilities by severity: critical, high, moderate and low.
- For each critical or high one, say which package, which vulnerability, and whether a fix is available.
- Check whether `npm audit fix` would resolve issues without breaking changes.
- Flag vulnerabilities in direct dependencies, not just transitive ones.

## Outdated packages

Run and report:
```bash
npm outdated
```

- List all outdated packages with the current, wanted and latest versions.
- Flag packages more than one major version behind.
- For each major version bump available, note:
  - The breaking changes that are likely. Check the changelog if you can.
  - Whether the upgrade is straightforward or needs code changes.
- Pay special attention to the core framework packages: the web framework, the UI library, the CSS framework, the auth and database client, the AI SDK, the payments SDK and the language compiler. Flag breaking changes in auth, deprecated models or APIs, webhook or API version changes, and stricter type checking.

## Unused dependencies

Check every package in `dependencies` and `devDependencies`:
- Search the codebase for imports of each package.
- Flag any package that is never imported or required.
- Flag packages imported only in dead code: commented out or unreachable.
- Check for packages that duplicate functionality, such as two date libraries or two HTTP clients.
- Report the estimated bundle size impact of unused dependencies.

## Missing dependencies

- Check for imports of packages that are not in `package.json` and only work through hoisting.
- Verify that `devDependencies` and `dependencies` are classified correctly: build tools in dev, runtime packages in prod.
- Check for missing `@types/` packages in TypeScript projects.

## Lockfile health

- Verify that `package-lock.json` exists and is committed.
- Check for lockfile conflicts or inconsistencies.
- Verify that the lockfile version matches the npm version in use.

## Dependency risk assessment

For each direct dependency, assess:
- Is it actively maintained? Look at the last publish date, open issues and contributor count.
- Does it have a single maintainer? That is a bus factor risk.
- Are there well-known alternatives if it is abandoned?
- Flag any package with very low weekly downloads. It is niche and risky.
- Flag any package not updated in 12 months or more.

Use only data you read from the registry or the package's own metadata. Never guess download counts or dates.

## Bundle impact

- Identify the 5 largest dependencies by bundle size.
- Check whether large dependencies are imported in client code when they could be server-only.
- Look for chances to use lighter alternatives.
- Check for packages that native browser or runtime APIs could replace.

## Output format

1. **Health rating:** Critical, Needs Attention, Healthy or Excellent.
2. **Security summary:** The vulnerability count by severity, and the fixes you can act on.
3. **Outdated packages:** A priority-ordered list with an upgrade difficulty rating: Easy, Moderate or Complex.
4. **Unused dependencies:** What is safe to remove now.
5. **Risk assessment:** Dependencies with maintenance or security concerns.
6. **Recommended actions:** In priority order, with the exact commands to run.

Save the report to `docs/dependency-audit.md` in the project.

# add-error-tracking

Add error tracking to the project following the standard setup sequence.

Add error tracking to the project. Follow this sequence.

## Step 1: Install

Install the error tracker's SDK for the project's framework. Read its current setup docs for the installed version first. File names and options change between releases. A setup wizard from the vendor can scaffold the files, but it edits many files, so review its diff.

## Step 2: Create configuration files

Create a client configuration, a server configuration and, if the project uses an edge runtime, an edge configuration.

- Read the DSN (or equivalent key) from environment variables. The client one must be a public variable.
- Set the environment name from the deploy environment, falling back to the node environment.
- Set a trace sample rate of 0.1. Do not use 1.0: it is expensive.
- Session replay: sample 0 for normal sessions and 1.0 for sessions with an error, if the tracker offers it.
- Export the router-transition hook if the SDK supports it, so navigations are traced.

## Step 3: Wrap the framework config

Wrap the existing framework config with the error tracker's wrapper.

- Set the organization and project names.
- Keep local builds quiet and CI builds verbose.
- Source maps upload with an auth token. Let the SDK remove them from the client bundle. Do not add manual source-map options unless the docs call for them.
- Preserve ALL existing config: redirects, images, headers and the rest.

## Step 4: Startup hook

Create the framework's startup file, or add to it if it exists. Load the server config in the server runtime and the edge config in the edge runtime. Export the request-error hook so errors from nested server components, route handlers and middleware are captured.

## Step 5: Global error page

Create a global error component that reports the error in an effect, shows a plain message in the project's design language, and has a "Try again" button that calls `reset()`.

## Step 6: API route errors

Do not edit every route. Look for a shared error handler or API utility and report there, so all routes benefit. If none exists, create a small shared helper that reports an error with optional context.

## Step 7: Scrub sensitive data

Add a before-send hook to every config that removes:
- Authorization headers and cookie values
- API keys in breadcrumbs
- Email addresses in error messages (replace with `[email]`)
- Fields named password, token, secret or key in request data

## Step 8: Environment variables

Add the DSN (public and server), and the source-map auth token to the example environment file with comments. Real values go in the hosting platform's settings, never in git.

## Step 9: Verify

1. Build the project and confirm no errors.
2. Check that the configs import nothing project-specific that could break.
3. Trigger a test error in a preview deployment and confirm it appears with a readable stack trace.

## Step 10: Document

Add the error tracker, its environment variables and the shared helper's location to the project instructions file.

## Do not

- Add a capture call to every API route. The request-error hook covers uncaught errors.
- Set the trace sample rate to 1.0.
- Serve source maps publicly.
- Commit DSN values.
- Break existing error handling. Add the tracker alongside it, not instead of it.

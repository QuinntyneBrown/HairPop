# 0001 — Frontend workspace layout

- Status: accepted
- Date: 2026-10-10

## Context

AGENTS.md requires reusable components in one shared library, API services in an API library bound by injection tokens in each application's `app.config.ts`, and a perf-test scenario app. L1-015 adds a braider management app beside the customer web app. The detailed designs name two containers: the customer web application and the braider management surface.

## Decision

One Angular CLI workspace in `frontend/` holds five projects:

| Project | Type | Package / output | Role |
|---|---|---|---|
| `components` | library | `@hairpop/components` → `dist/components` | Every presentation component, the design tokens and global foundations. |
| `api` | library | `@hairpop/api` → `dist/api` | Contracts (TypeScript interfaces), injection tokens, HTTP implementations, interceptors. No UI. |
| `customer` | application (SSR) | `dist/customer` | The customer web app. Pages depend on tokens from `@hairpop/api`. |
| `braider` | application (browser) | `dist/braider`, base href `/manage/` | The braider management app. |
| `perf-test` | application (browser) | `dist/perf-test` | Renders one component scenario many times for the perf runner. |

Pages, dialogs and route shells are application code; anything rendered in more than one place, or reusable across the two apps, goes to `components`. Applications import the libraries through the `tsconfig` paths that point at `dist/`, so libraries build first (`npm run build:libs`).

Playwright lives in `e2e/` with its own `package.json`: acceptance tests in `e2e/tests/`, page objects in `e2e/pages/`, fixtures in `e2e/fixtures/`, the stub API in `e2e/stub-api/`, and the perf runner in `e2e/perf-test/`.

## Consequences

- One `npm ci` installs the whole frontend; one lint and format configuration covers every project.
- Library changes need a library build before an application sees them; the `build:*` scripts chain them.

## Project Overview

HairPop connects customers with professional hair braiders. Customers can explore hairstyles, find braiders who offer them, and read reviews to choose a braider with confidence.

## Tech stack

- **Backend:** Node.js 22 / Next.js 15 (App Router route handlers, API only) — owns persistence, authentication, and business workflows ([ADR 0007](docs/adr/0007-backend-nextjs-postgres-prisma.md)).
- **Database:** PostgreSQL 16 through the Prisma ORM.
- **Frontend:** Angular — provides the web applications.
- **E2E:** Playwright — covers behavior and visual parity with the design reference.

## Repository and documentation conventions

- `docs/specs/` — requirements (`L1.md` high-level, `L2.md` detailed with acceptance criteria).
- `docs/detailed-designs/` — detailed designs grouped by subsystem and feature.
- `docs/mocks/` — static design references for every page and state, in light and dark themes.
- `docs/design-system/` — tokens, foundations, components, and patterns extracted from the mocks.
- `docs/adr/` — architecture decisions; read relevant ADRs before changing the areas they cover.
- `.claude/skills/` and `.agents/skills/` — the skills this repository expects agents to follow.

Create planned folders as the corresponding work lands. If an implementation needs a different layout than its detailed design, record the decision in `docs/adr/` and update the design in the same change.

## Backend conventions

- Business rules live in domain services, application actions, and worker jobs — not route handlers.
- The API does **not** run database migrations on startup. Run them explicitly with `prisma migrate deploy`.
- Seed data (`prisma db seed`) is idempotent and safe to re-run.
- Endpoints require authentication by default: route handlers are wrapped deny-by-default, and anonymous routes opt in explicitly. Preserve intentional anonymous access and wrapper ordering when changing API auth.
- Keep the request-logging wrapper outside the error-handling wrapper so handled response statuses are logged correctly.
- User-owned data must remain scoped to the current user; resources belonging to other users must never be exposed.
- Backend tests are integration tests against the API. Follow existing test patterns when adding coverage.

## Frontend conventions

- Prettier owns formatting and angular-eslint owns lint; CI fails on either. Run `npm run lint` and `npm run format:check` in the frontend workspace. The husky pre-commit hook fixes staged frontend files.
- Use single-file Angular components: keep each component's class, template (`template`), and scoped styles (`styles`) in its `.ts` file. Do not create separate component `.html` or `.scss` files.
- Components preserve the mock design's BEM classes and accessible state semantics; e2e locators depend on that parity.
- Keep component styles encapsulated and global styles limited to shared foundations and utilities.
- **Read design tokens by role, never by value.** Use the design system's CSS custom properties for color and spacing, never hex values or magic numbers. Component-scoped custom properties use the component prefix.
- **Declare each `ng-content` slot once.** A component that renders `<a>` or `<button>` by condition puts its slots in one `<ng-template>` and renders it with `ngTemplateOutlet` in both branches; slots repeated per `@if` branch project into one branch only. On the consumer side, an `@if` wrapping several `[slot=…]` nodes loses the slot (NG8011) — use one `@if` per node.
- Every reusable component lives in the shared components library; applications import it and never copy it.
- **Every component has stories.** A change that adds a component to the shared library adds `frontend/projects/components-examples/src/<component>/<component>-examples.ts` and registers it in `COMPONENT_EXAMPLES` in the same change. A change to a component's variants or states updates its stories. Browse them with `npm start` in `frontend/` (the storybook).
- API services live in the API library with a contract and injection token; each application binds the tokens in its `app.config.ts`, and pages depend on the token, not the concrete implementation.
- **No inline forms in pages.** Button-triggered editing opens a CDK Dialog or navigates to a screen.
- Use Angular CDK Dialog/Overlay for modal behavior; do not hand-roll modals.

## E2E architecture (Playwright)

- Run the relevant Playwright tests for UI changes; update visual baselines only for intentional design changes.
- Run frontend tests in Chromium only. Do not configure or run Firefox, WebKit, or another browser for frontend testing.
- **The backend is mocked in e2e.** Playwright tests must not require the API, worker, database, or Docker to run. Browser requests use `page.route`; server-side rendering requests use a stub HTTP server started by Playwright and configured as the SSR server's `API_ORIGIN`. Mock responses follow the API contract and use cast and copy from `docs/mocks/README.md`. Shared fixtures live in `e2e/fixtures/`. Each test sets up the API state it needs through fixtures, never by seeding a database. Backend behavior is proven by API integration tests.

## Incremental implementation and ATDD — mandatory

Mocks and the design system are design artifacts. ATDD does not apply to their development. Do not write tests for mocks or the design system.

Every new feature or change to production behavior **must** have a requirement, a detailed design, and a mock before implementation begins. This includes behavioral changes to existing features. This requirement applies to production-code changes only; documentation-only, design-system-only, mock-only, and test-only changes are out of scope unless they are part of implementing a production behavior change.

Every production behavior implementation **must** invoke and follow the `implementing-incrementally` skill before writing code, combined with acceptance test-driven development. Plan small, reviewable slices, then complete one slice at a time: write Given-When-Then acceptance criteria, write the acceptance test, and run it to prove it fails for the expected reason before writing production code. Implement only what satisfies that slice, refactor with tests green, and run the relevant regression checks. Do not move to the next slice until those checks pass. Do not bulk-implement, add tests afterward, or weaken tests to manufacture a pass. Keep the requirement, detailed design, mock, criteria, tests, and implementation aligned until the entire change is complete.

Backend acceptance tests are integration tests against the API. Frontend acceptance tests use Playwright and the Page Object Model: one page object per screen owns selectors and interactions. Tests state intent; page objects know the DOM. Never put a selector in a test.

### Never write architecture tests

Never add a test that asserts codebase shape rather than behavior: no structure, layout, or naming tests; no banned-API scans; no traceability tests that parse specifications. Those constraints belong to the compiler, formatter, and review. A test suite exists to prove behavior.

## Component perf tests — mandatory

`frontend/projects/perf-test` and its runner in `e2e/perf-test/` measure what each reusable component costs to render. The scenario app renders a component many times in Chromium with the V8 CPU profiler running, and the runner compares the change against its base branch.

- **Every component has a scenario.** A change that adds a component to the shared library must add `frontend/projects/perf-test/src/scenarios/<Name>.ts` in the same change and export it from `src/scenarios/index.ts`. Its default export is a standalone component rendering one realistic instance with cast and copy from `docs/mocks/README.md`.
- **Composites have scenarios too.** Repeated, render-heavy compositions get their own scenarios. Add one whenever a new composition repeats on a screen.
- **Measure before you push.** A change to a component's template, inputs, styles, or change detection must run the perf test locally against the base branch with `--fail-on-regression`, and pass, before it is pushed.
- **Keep scenarios honest.** Tune iterations in `e2e/perf-test/config/scenario-iterations.mjs` to render in roughly 100–300 ms. Never delete, exclude, or shrink a scenario, lower its iterations, or loosen a threshold to clear a flag.
- **The perf test is a required check.** The pipeline runs it on every pull request touching `frontend/` or `e2e/perf-test/`. It builds the branch and base branch with `NG_BUILD_MANGLE=0`, runs with `--fail-on-regression`, publishes a comparison table, and uploads `.cpuprofile` files. A **Possible regression** (median render more than 10% and at least 1 ms slower, with no overlap between runs) or a scenario that fails to render fails the check.
- **Fix a flagged row.** Open the scenario's profile, find the cost, and fix it. Re-run the job at most once to check runner noise; a second flag is real.
- **Intended cost needs a person.** When the extra render cost is intended, explain the before and after numbers and profile in the pull request. Only a maintainer may accept it by adding the `perf-regression-accepted` label. Agents never add that label.

Run it locally:

```bash
cd frontend
NG_BUILD_MANGLE=0 npx ng build perf-test
cd ../e2e
npm run perf-test -- --baseline <base-branch dist> --fail-on-regression   # --scenarios Button,Ticket to narrow
```

These are measurements, not behavior tests, so they do not count toward ATDD and the architecture-test rule does not apply. They do not replace page-level checks in `e2e/perf/` or Lighthouse and bundle budgets in the pipeline.

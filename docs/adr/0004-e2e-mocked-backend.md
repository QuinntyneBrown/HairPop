# 0004 — E2E tests with a mocked backend

- Status: accepted
- Date: 2026-10-10

## Context

AGENTS.md: e2e tests never need the API, worker, database or Docker. Browser requests use `page.route`; SSR requests go to a stub HTTP server configured as `API_ORIGIN`. Each test sets up the API state it needs through fixtures. Playwright runs tests in parallel workers, so server-side stub state must not leak between tests.

## Decision

- **One declarative state per test.** A test calls `api.given(...rules)`, where each rule is `{ method, path, query?, status, body, headers?, delayMs?, times? }`. Builders in `e2e/fixtures/` produce rules from the cast in `docs/mocks/README.md` (Maya Chen, Nia Okafor, HP-1048…) and follow the API contract types.
- **Browser side.** The `api` fixture installs one `page.route` handler for `/api/**` that answers from the same rules, records every request for assertions, and fails the test on an unmatched request.
- **Server side.** `e2e/stub-api/server.mjs` keeps a map of states keyed by test id. The fixture registers the state with `PUT /__e2e/state/:id` and sets the `hp-e2e=<id>` cookie on the browser context; the SSR server forwards cookies to the API (ADR 0002), so the stub answers SSR requests from that test's rules. Unknown ids get a default state (signed out, empty responses).
- **Time.** `page.clock` pins the browser to Sat 10 Oct 2026, 10:00 am Toronto time.
- **Servers.** `playwright.config.ts` starts the stub API, the built customer SSR server and a static server for the braider app, all on fixed localhost ports, Chromium only.

## Consequences

- Tests state intent; page objects in `e2e/pages/` own every selector.
- Backend behaviour (ownership, idempotency, rate limits) is proven by API integration tests; e2e proves the UI reacts to each documented response.

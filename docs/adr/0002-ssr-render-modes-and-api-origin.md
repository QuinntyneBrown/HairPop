# 0002 — SSR render modes and API origin

- Status: accepted
- Date: 2026-10-10

## Context

Discovery, Help, legal and error pages are public and benefit from server rendering (first paint, link previews, real HTTP statuses for 404/403/500 as the error pages require). Signed-in pages hold private data that must never be cached or rendered for the wrong person. AGENTS.md requires e2e tests to stub server-side API calls with a server configured as the SSR server's `API_ORIGIN`.

## Decision

- The customer app uses `@angular/ssr` with server route configuration:
  - `RenderMode.Server` for `/`, `/styles/**`, `/braiders/**`, `/help`, `/terms`, `/privacy`, `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`, `/verify-email`, `/404`, `/403`, `/500`, `/offline` and the catch-all, with `status` 404/403/500 on the error routes and 404 on the catch-all.
  - `RenderMode.Client` for `/book/**`, `/appointments/**`, `/notifications` and `/settings`.
- In the browser the API is same-origin: requests go to relative `/api/...` URLs.
- On the server, `apiOriginInterceptor` prefixes those URLs with the `API_ORIGIN` environment variable and forwards the incoming request's `Cookie` header, so the shell can read the session. Responses are transferred to the browser by the HTTP transfer cache, so hydration does not refetch.
- The braider app is browser-only; it is a static build.

## Consequences

- e2e starts the stub API, then the built SSR server with `API_ORIGIN` pointing at the stub (ADR 0004).
- Pages must not touch `window`, `document` or storage outside browser-only code paths.

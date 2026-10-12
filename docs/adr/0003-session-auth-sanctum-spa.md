# 0003 — Session authentication with Sanctum SPA cookies

- Status: superseded by [0008](0008-session-auth-db-sessions-csrf.md)
- Date: 2026-10-10

## Context

The backend is Laravel 11. Both apps are first-party and same-site with the API. L2-045 requires that locally held data is removed at sign-out; L2-039 requires private data to stay protected in transit and storage.

## Decision

- Authentication uses Laravel Sanctum's SPA mode: an HTTP-only session cookie set by `POST /api/auth/sign-in`, CSRF protection through the `XSRF-TOKEN` cookie (from `GET /sanctum/csrf-cookie`) echoed as `X-XSRF-TOKEN` by Angular's `withXsrfConfiguration`.
- No token is stored in JavaScript-readable storage.
- `GET /api/session` returns the signed-in user or 401; `SessionStore` (a signal store in the `api` library) holds it. Guards read the store; a 401 from any request clears it and sends the person to sign-in with `returnUrl`.
- Sign-in sends `audience: 'customer' | 'braider'`; the API refuses a customer on the braider app with 403 `not_braider` and creates no session (L2-046 AC2).
- Sign-out calls `POST /api/auth/sign-out`, clears the store and every session-storage entry the app wrote (L2-045 AC3).

## Consequences

- Mutating requests fetch the CSRF cookie first; `ensureCsrf()` in the API library does this once per page load.
- The e2e fixtures stub `/sanctum/csrf-cookie` and `/api/session` in every test.

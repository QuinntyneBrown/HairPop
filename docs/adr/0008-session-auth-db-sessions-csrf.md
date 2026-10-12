# 0008 — Session authentication with database sessions and double-submit CSRF

- Status: accepted
- Date: 2026-10-12
- Supersedes: [0003](0003-session-auth-sanctum-spa.md)

## Context

ADR 0007 moves the backend to Next.js, so Laravel Sanctum's SPA mode is no longer available. Both apps are still first-party and same-site with the API. L2-045 requires that locally held data is removed at sign-out; L2-039 requires private data to stay protected in transit and storage.

## Decision

- Sessions are rows in PostgreSQL (a Prisma `Session` model). `POST /api/auth/sign-in` creates a row and sets an HTTP-only, Secure, SameSite=Lax cookie holding an opaque random session id. `POST /api/auth/sign-out` deletes the row and clears the cookie.
- Passwords are hashed with argon2id.
- CSRF uses the double-submit cookie pattern. `GET /api/auth/csrf` returns 204 and sets a JavaScript-readable `XSRF-TOKEN` cookie. Every mutating request must echo it as `X-XSRF-TOKEN`; Angular's `withXsrfConfiguration` does this. A missing or mismatched header answers 419 `{ message: 'CSRF token mismatch.', code: 'csrf_mismatch' }` before authentication or any other work.
- The session cookie is `hp_session`; it holds a random token and the database stores only its SHA-256. Sessions expire 14 days after sign-in.
- No token is stored in JavaScript-readable storage.
- `GET /api/session` returns the signed-in user or 401; `SessionStore` (a signal store in the `api` library) holds it. Guards read the store; a 401 from any request clears it and sends the person to sign-in with `returnUrl`.
- Sign-in sends `audience: 'customer' | 'braider'`; the API refuses a customer on the braider app with 403 `not_braider` and creates no session (L2-046 AC2).
- Sign-out calls `POST /api/auth/sign-out`, clears the store and every session-storage entry the app wrote (L2-045 AC3).

## Consequences

- Mutating requests fetch the CSRF cookie first; `Csrf.ensure()` in the API library does this once per page load.
- Every API path is under `/api/`, so the SSR origin interceptor and the e2e route handler match `/api/` only.
- The e2e fixtures stub `/api/auth/csrf` and `/api/session` in every test.

# 0005 — Offline appointment summaries

- Status: accepted
- Date: 2026-10-10

## Context

L2-045 allows previously opened appointment summaries to stay readable offline for the current customer, labelled with their last-updated time, and requires them to be removed at sign-out. L2-036 AC5 requires an offline state that explains what remains available.

## Decision

- After a successful `GET /api/appointments/{ref}` the app stores the summary fields (reference, status, service, braider, start, price, `updatedAt`) in `sessionStorage` under `hp-appointment:<ref>`. Contact and hair details are not stored.
- When a read fails while the browser is offline, the detail page shows the offline banner and the saved summary with its last-updated time, and offers no mutating action.
- Sign-out removes every `hp-` session-storage key. Session storage also ends with the browser session.
- No service worker is introduced.

## Consequences

- Offline support is limited to pages already opened in the same browser session, which is what L2-045 asks for.

# Frontend implementation plan

## Goal

Complete the customer journey and separate braider management app defined in `docs/specs/L1.md`, `docs/specs/L2.md`, the detailed designs, and `docs/mocks/manifest.json`. The existing Angular discovery, profile, sign-in/up, help, legal, consent, and error routes are the starting point. Use the existing backend API contracts; do not add product capabilities beyond those documents.

## Slices

- [x] **Account access:** customer sign-out, password recovery, email verification, account settings, protected-route guard, and safe sign-in return path.
  - [x] Password recovery request and reset screens, API contract, and focused Chromium acceptance tests.
  - [x] Email verification and resend screen, API contract, and focused Chromium acceptance tests.
  - [x] Account settings, sign-out dialog, customer guard, and focused Chromium acceptance tests.
- [x] **Booking:** `/book/:braiderSlug`, current services and slots, retained form values, CDK review dialog, changed-terms handling, retry-safe submission, and pending-request result.
- [x] **Appointments and reviews:** appointment list/detail, change and cancellation dialogs, repeat booking, care and review, review reporting, authorized location disclosure, and offline appointment summary cleared on sign-out.
  - [x] Owner-only list/detail, cancellation, time change, and repeat booking with focused Chromium acceptance tests.
  - [x] Care and review, including guidance source and retry-safe submission, with focused Chromium acceptance tests.
  - [x] Review reporting through a CDK dialog with focused Chromium acceptance tests.
  - [x] Owner-scoped last saved summary for unavailable detail, care route, and paginated list.
- [x] **Notifications:** notification center, read/unread actions and count, and feedback that reflects the persisted result.
- [x] **Braider app:** browser-only Angular app under `/manage/*`, braider-only session and routes, requests/responses, services, profile and portfolio content (including the photo style), availability, dialogs, and stale-edit handling.
- [x] **Final integration:** mock state and structure review, accessibility and responsive interaction checks, full Chromium e2e suite, frontend build, lint, and format check. No shared component changed, so the shared-component perf comparison does not apply.

## Verification

- Chromium Playwright: 158 tests passed across both apps. The focused portfolio style test passed again after the final dialog change.
- Frontend build, lint, and Prettier check passed. The customer build reports an initial-bundle warning but remains below its error budget.
- `git diff --check` passed. The existing `AGENTS.md` working-tree change is preserved.

## Implementation rules

For each production-behavior slice, align L2 acceptance criteria, detailed design, and mocks first. Write a Given-When-Then Playwright test using a page object and confirm it fails for the expected reason before writing production code. Implement one working increment, run its relevant regression checks, then continue. API services belong in `@hairpop/api` behind contracts and injection tokens. Both applications bind their tokens. Reuse shared components; update a component's CRD before changing it, and update its stories and perf scenario with the change. Use CDK Dialog for button-triggered editing.

Frontend e2e tests run in Chromium against mocked API responses, including the SSR stub. Cover applicable loading, empty, validation, failure, offline, success, and conflict states from the mock manifest. Preserve the existing unrelated `AGENTS.md` working-tree modification.

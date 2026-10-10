# HairPop mocks

<!-- Cast and catalog: Today is Sat 10 Oct 2026 in Toronto. Maya Chen (maya.chen@example.com, 416-555-0148) is the customer; Nia Okafor (nia.okafor@example.com) is her braider. Aisha Mensah and Jules Baptiste are other braiders; Jules has no published reviews yet. Kemi Adebayo and Zara Ali are Nia's other customers. Maya requested medium knotless braids from Nia for Sat 24 Oct at 10:00 am (HP-1048), estimated at $180–$240 and about five hours. Her previous appointment was Sat 3 Oct (HP-0992, $205). Kemi requested passion twists for Sun 25 Oct at 1:00 pm (HP-1052); Zara asked to move HP-1031 from Fri 16 Oct to Sat 17 Oct at 9:00 am. These names, dates, prices and statuses carry across every mock. -->

Open [the gallery](index.html) from disk. Each screen has sibling state links and a theme switch. Add `?theme=dark` or `?chrome=0` to any mock URL. The mocks are static snapshots; links between screens work, while form submissions and dialogs illustrate their states without a backend.

## Scope and open questions

The source of product direction is [`docs/7-star-redesign.md`](../7-star-redesign.md). Platform requirements live in [`docs/specs/L1.md`](../specs/L1.md) and [`docs/specs/L2.md`](../specs/L2.md); L2 includes a mock-to-requirement map, and every mock carries its requirement IDs in `<meta name="mock:requirements">`.

Two products share one design system:

- **Customer web app.** The redesign's eight journey screens are the core; entry, account, help, legal and error screens complete the path. Routes in the manifest are the implemented URLs.
- **Braider management app** (`/manage/…`, screens prefixed `braider-`). The minimum braider essentials from the redesign: reply to requests and change requests, keep services, public profile content, portfolio and offered times current. It is reserved for braider accounts (L2-046). A full studio dashboard stays out of scope.

Markup mirrors the components library (`frontend/projects/components`) and the design system's stylesheet. The drift fixes listed in [`docs/design-system/README.md`](../design-system/README.md) are applied here: SVG icons, the phone menu button, error summaries that link to fields, busy buttons that keep their label, offered-time and rating radio groups, textareas for multi-line answers, safe dialog actions that close rather than navigate, `alertdialog` with a danger icon for destructive confirmations, tone icons on toasts in separate polite and assertive regions, the persistent cookie banner, and notification list rows. Three components were added to the system for these screens: the rating summary, the review quote and the portfolio gallery; the product theme toggle is a pressed-state ghost button.

Exact pricing, availability, cancellation terms and studio address are illustrative content for review. Final product copy needs agreed policies and live braider data. Terms and privacy are structural mock copy, not approved legal text.

The static sketches show a pending request before acceptance; no appointment or final price is called confirmed until the braider accepts it. The confirmed appointment state is shown separately in `appointment-detail/success.html`.

Typography follows `C:/projects/banaro/docs/design-system/tokens/tokens.css`: local Manrope and JetBrains Mono fonts, type sizes, weights, line heights, letter spacing and semantic text roles. HairPop retains its own colour and layout tokens.

## Coverage

<!-- coverage:start -->

Legend: ✅ mock exists · ➖ not applicable (reason in manifest) · ❌ missing

### Pages

| Screen | default | loading | empty | error | no-results | long | edge | offline | partial | invalid | submitting | success | unread | read | denied | conflict | Requirements |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Style gallery (`style-gallery`) | [✅](pages/style-gallery/default.html) | [✅](pages/style-gallery/loading.html) | [✅](pages/style-gallery/empty.html) | [✅](pages/style-gallery/error.html) | [✅](pages/style-gallery/no-results.html) | [✅](pages/style-gallery/long.html) | [✅](pages/style-gallery/edge.html) | [✅](pages/style-gallery/offline.html) |  |  |  |  |  |  |  |  | `L2-001`, `L2-002`, `L2-035` |
| Knotless braids (`style-detail`) | [✅](pages/style-detail/default.html) | [✅](pages/style-detail/loading.html) | [✅](pages/style-detail/empty.html) | [✅](pages/style-detail/error.html) |  |  | [✅](pages/style-detail/edge.html) | [✅](pages/style-detail/offline.html) | [✅](pages/style-detail/partial.html) |  |  |  |  |  |  |  | `L2-003` |
| Matching braiders (`matching-braiders`) | [✅](pages/matching-braiders/default.html) | [✅](pages/matching-braiders/loading.html) | [✅](pages/matching-braiders/empty.html) | [✅](pages/matching-braiders/error.html) | [✅](pages/matching-braiders/no-results.html) | [✅](pages/matching-braiders/long.html) | [✅](pages/matching-braiders/edge.html) | [✅](pages/matching-braiders/offline.html) |  |  |  |  |  |  |  |  | `L2-004`, `L2-005`, `L2-006`, `L2-008` |
| Nia’s profile (`braider-profile`) | [✅](pages/braider-profile/default.html) | [✅](pages/braider-profile/loading.html) | [✅](pages/braider-profile/empty.html) | [✅](pages/braider-profile/error.html) |  |  | [✅](pages/braider-profile/edge.html) | [✅](pages/braider-profile/offline.html) | [✅](pages/braider-profile/partial.html) |  |  |  |  |  |  |  | `L2-007`, `L2-008`, `L2-009` |
| Booking request (`booking-request`) | [✅](pages/booking-request/default.html) | [✅](pages/booking-request/loading.html) | [✅](pages/booking-request/empty.html) | [✅](pages/booking-request/error.html) |  |  |  | [✅](pages/booking-request/offline.html) |  | [✅](pages/booking-request/invalid.html) | [✅](pages/booking-request/submitting.html) | [✅](pages/booking-request/success.html) |  |  |  |  | `L2-015`, `L2-016`, `L2-017` |
| Appointment detail (`appointment-detail`) | [✅](pages/appointment-detail/default.html) | [✅](pages/appointment-detail/loading.html) | [✅](pages/appointment-detail/empty.html) | [✅](pages/appointment-detail/error.html) |  |  |  | [✅](pages/appointment-detail/offline.html) | [✅](pages/appointment-detail/partial.html) |  |  | [✅](pages/appointment-detail/success.html) |  |  |  |  | `L2-019`, `L2-021`, `L2-022`, `L2-024` |
| My appointments (`my-appointments`) | [✅](pages/my-appointments/default.html) | [✅](pages/my-appointments/loading.html) | [✅](pages/my-appointments/empty.html) | [✅](pages/my-appointments/error.html) | [✅](pages/my-appointments/no-results.html) | [✅](pages/my-appointments/long.html) | [✅](pages/my-appointments/edge.html) | [✅](pages/my-appointments/offline.html) |  |  |  |  |  |  |  |  | `L2-018`, `L2-023` |
| Care and review (`care-and-review`) | [✅](pages/care-and-review/default.html) | [✅](pages/care-and-review/loading.html) | [✅](pages/care-and-review/empty.html) | [✅](pages/care-and-review/error.html) |  |  |  | [✅](pages/care-and-review/offline.html) |  | [✅](pages/care-and-review/invalid.html) | [✅](pages/care-and-review/submitting.html) | [✅](pages/care-and-review/success.html) |  |  |  |  | `L2-023`, `L2-024`, `L2-025` |
| Sign in (`sign-in`) | [✅](pages/sign-in/default.html) | [✅](pages/sign-in/loading.html) | ➖ | [✅](pages/sign-in/error.html) |  |  |  |  |  | [✅](pages/sign-in/invalid.html) | [✅](pages/sign-in/submitting.html) | [✅](pages/sign-in/success.html) |  |  |  |  | `L2-011`, `L2-040` |
| Create account (`sign-up`) | [✅](pages/sign-up/default.html) | [✅](pages/sign-up/loading.html) | ➖ | [✅](pages/sign-up/error.html) |  |  |  |  |  | [✅](pages/sign-up/invalid.html) | [✅](pages/sign-up/submitting.html) | [✅](pages/sign-up/success.html) |  |  |  |  | `L2-010` |
| Forgot password (`forgot-password`) | [✅](pages/forgot-password/default.html) | [✅](pages/forgot-password/loading.html) | ➖ | [✅](pages/forgot-password/error.html) |  |  |  |  |  | [✅](pages/forgot-password/invalid.html) | [✅](pages/forgot-password/submitting.html) | [✅](pages/forgot-password/success.html) |  |  |  |  | `L2-012` |
| Reset password (`reset-password`) | [✅](pages/reset-password/default.html) | [✅](pages/reset-password/loading.html) | ➖ | [✅](pages/reset-password/error.html) |  |  |  |  |  | [✅](pages/reset-password/invalid.html) | [✅](pages/reset-password/submitting.html) | [✅](pages/reset-password/success.html) |  |  |  |  | `L2-012` |
| Verify email (`verify-email`) | [✅](pages/verify-email/default.html) | [✅](pages/verify-email/loading.html) | ➖ | [✅](pages/verify-email/error.html) |  |  |  |  |  |  | [✅](pages/verify-email/submitting.html) | [✅](pages/verify-email/success.html) |  |  |  |  | `L2-013` |
| Notifications (`notification-center`) | [✅](pages/notification-center/default.html) | [✅](pages/notification-center/loading.html) | [✅](pages/notification-center/empty.html) | [✅](pages/notification-center/error.html) |  |  |  | [✅](pages/notification-center/offline.html) |  |  |  |  | [✅](pages/notification-center/unread.html) | [✅](pages/notification-center/read.html) |  |  | `L2-029`, `L2-030` |
| Account settings (`account-settings`) | [✅](pages/account-settings/default.html) | [✅](pages/account-settings/loading.html) | ➖ | [✅](pages/account-settings/error.html) |  |  |  | [✅](pages/account-settings/offline.html) |  | [✅](pages/account-settings/invalid.html) | [✅](pages/account-settings/submitting.html) | [✅](pages/account-settings/success.html) |  |  |  |  | `L2-014`, `L2-011` |
| Help (`help`) | [✅](pages/help/default.html) | [✅](pages/help/loading.html) | ➖ | [✅](pages/help/error.html) |  |  |  | [✅](pages/help/offline.html) |  |  |  |  |  |  |  |  | `L2-032` |
| Page not found (`not-found`) | [✅](pages/not-found/default.html) | [✅](pages/not-found/loading.html) | ➖ | [✅](pages/not-found/error.html) |  |  |  |  |  |  |  |  |  |  |  |  | `L2-037` |
| Access unavailable (`forbidden`) | [✅](pages/forbidden/default.html) | [✅](pages/forbidden/loading.html) | ➖ | [✅](pages/forbidden/error.html) |  |  |  |  |  |  |  |  |  |  |  |  | `L2-037` |
| Service error (`server-error`) | [✅](pages/server-error/default.html) | [✅](pages/server-error/loading.html) | ➖ | [✅](pages/server-error/error.html) |  |  |  |  |  |  |  |  |  |  |  |  | `L2-037` |
| Offline (`offline`) | [✅](pages/offline/default.html) | [✅](pages/offline/loading.html) | ➖ | [✅](pages/offline/error.html) |  |  |  |  |  |  |  |  |  |  |  |  | `L2-036`, `L2-045` |
| Terms of use (`terms`) | [✅](pages/terms/default.html) | [✅](pages/terms/loading.html) | ➖ | [✅](pages/terms/error.html) |  |  |  |  |  |  |  |  |  |  |  |  | `L2-033` |
| Privacy (`privacy`) | [✅](pages/privacy/default.html) | [✅](pages/privacy/loading.html) | ➖ | [✅](pages/privacy/error.html) |  |  |  |  |  |  |  |  |  |  |  |  | `L2-033`, `L2-034` |
| Braider sign in (`braider-sign-in`) | [✅](pages/braider-sign-in/default.html) | [✅](pages/braider-sign-in/loading.html) | ➖ | [✅](pages/braider-sign-in/error.html) |  |  |  |  |  | [✅](pages/braider-sign-in/invalid.html) | [✅](pages/braider-sign-in/submitting.html) |  |  |  | [✅](pages/braider-sign-in/denied.html) |  | `L2-046` |
| Braider requests (`braider-requests`) | [✅](pages/braider-requests/default.html) | [✅](pages/braider-requests/loading.html) | [✅](pages/braider-requests/empty.html) | [✅](pages/braider-requests/error.html) |  |  |  | [✅](pages/braider-requests/offline.html) |  |  |  |  |  |  |  |  | `L2-020`, `L2-021`, `L2-047` |
| Braider services (`braider-services`) | [✅](pages/braider-services/default.html) | [✅](pages/braider-services/loading.html) | [✅](pages/braider-services/empty.html) | [✅](pages/braider-services/error.html) |  |  |  | [✅](pages/braider-services/offline.html) |  |  |  |  |  |  |  |  | `L2-026`, `L2-047` |
| Braider profile content (`braider-profile-content`) | [✅](pages/braider-profile-content/default.html) | [✅](pages/braider-profile-content/loading.html) | [✅](pages/braider-profile-content/empty.html) | [✅](pages/braider-profile-content/error.html) |  |  |  | [✅](pages/braider-profile-content/offline.html) |  | [✅](pages/braider-profile-content/invalid.html) | [✅](pages/braider-profile-content/submitting.html) | [✅](pages/braider-profile-content/success.html) |  |  |  | [✅](pages/braider-profile-content/conflict.html) | `L2-027`, `L2-047` |
| Braider availability (`braider-availability`) | [✅](pages/braider-availability/default.html) | [✅](pages/braider-availability/loading.html) | [✅](pages/braider-availability/empty.html) | [✅](pages/braider-availability/error.html) |  |  |  | [✅](pages/braider-availability/offline.html) |  |  |  |  |  |  |  |  | `L2-028`, `L2-047` |

### Dialogs

| Screen | default | busy | invalid | failed | conflict | Requirements |
|---|---|---|---|---|---|---|
| Filter braiders (`filter-braiders`) | [✅](dialogs/filter-braiders/default.html) | [✅](dialogs/filter-braiders/busy.html) | [✅](dialogs/filter-braiders/invalid.html) | [✅](dialogs/filter-braiders/failed.html) |  | `L2-005` |
| Review request (`request-review`) | [✅](dialogs/request-review/default.html) | [✅](dialogs/request-review/busy.html) | [✅](dialogs/request-review/invalid.html) | [✅](dialogs/request-review/failed.html) |  | `L2-016`, `L2-017` |
| Cancel request HP-1048? (`cancel-appointment`) | [✅](dialogs/cancel-appointment/default.html) | [✅](dialogs/cancel-appointment/busy.html) | ➖ | [✅](dialogs/cancel-appointment/failed.html) |  | `L2-022` |
| Request a change (`change-appointment`) | [✅](dialogs/change-appointment/default.html) | [✅](dialogs/change-appointment/busy.html) | [✅](dialogs/change-appointment/invalid.html) | [✅](dialogs/change-appointment/failed.html) |  | `L2-021` |
| Report a review (`report-review`) | [✅](dialogs/report-review/default.html) | [✅](dialogs/report-review/busy.html) | [✅](dialogs/report-review/invalid.html) | [✅](dialogs/report-review/failed.html) |  | `L2-009` |
| Sign out of HairPop? (`sign-out`) | [✅](dialogs/sign-out/default.html) | [✅](dialogs/sign-out/busy.html) | ➖ | [✅](dialogs/sign-out/failed.html) |  | `L2-011`, `L2-045` |
| Cookie preferences (`cookie-preferences`) | [✅](dialogs/cookie-preferences/default.html) | [✅](dialogs/cookie-preferences/busy.html) | [✅](dialogs/cookie-preferences/invalid.html) | [✅](dialogs/cookie-preferences/failed.html) |  | `L2-034` |
| Respond to request HP-1048 (`respond-to-request`) | [✅](dialogs/respond-to-request/default.html) | [✅](dialogs/respond-to-request/busy.html) | [✅](dialogs/respond-to-request/invalid.html) | [✅](dialogs/respond-to-request/failed.html) | [✅](dialogs/respond-to-request/conflict.html) | `L2-020`, `L2-021` |
| Edit service (`edit-service`) | [✅](dialogs/edit-service/default.html) | [✅](dialogs/edit-service/busy.html) | [✅](dialogs/edit-service/invalid.html) | [✅](dialogs/edit-service/failed.html) | [✅](dialogs/edit-service/conflict.html) | `L2-026`, `L2-047` |
| Remove Boho knotless braids? (`remove-service`) | [✅](dialogs/remove-service/default.html) | [✅](dialogs/remove-service/busy.html) | ➖ | [✅](dialogs/remove-service/failed.html) |  | `L2-026` |
| Add a portfolio photo (`add-portfolio-item`) | [✅](dialogs/add-portfolio-item/default.html) | [✅](dialogs/add-portfolio-item/busy.html) | [✅](dialogs/add-portfolio-item/invalid.html) | [✅](dialogs/add-portfolio-item/failed.html) |  | `L2-027` |
| Add an offered time (`add-slot`) | [✅](dialogs/add-slot/default.html) | [✅](dialogs/add-slot/busy.html) | [✅](dialogs/add-slot/invalid.html) | [✅](dialogs/add-slot/failed.html) |  | `L2-028` |
| Withdraw Sun 25 Oct at 11:00 am? (`withdraw-slot`) | [✅](dialogs/withdraw-slot/default.html) | [✅](dialogs/withdraw-slot/busy.html) | ➖ | [✅](dialogs/withdraw-slot/failed.html) |  | `L2-028` |
| Sign out of HairPop for braiders? (`braider-sign-out`) | [✅](dialogs/braider-sign-out/default.html) | [✅](dialogs/braider-sign-out/busy.html) | ➖ | [✅](dialogs/braider-sign-out/failed.html) |  | `L2-046` |

### Notifications

| Screen | info | success | warning | danger | with-action | stacked | persistent | Requirements |
|---|---|---|---|---|---|---|---|---|
| Booking update (`booking-update`) | [✅](notifications/booking-update/info.html) | [✅](notifications/booking-update/success.html) | [✅](notifications/booking-update/warning.html) | [✅](notifications/booking-update/danger.html) | [✅](notifications/booking-update/with-action.html) | [✅](notifications/booking-update/stacked.html) | [✅](notifications/booking-update/persistent.html) | `L2-029`, `L2-031` |
| Review feedback (`review-feedback`) | [✅](notifications/review-feedback/info.html) | [✅](notifications/review-feedback/success.html) | [✅](notifications/review-feedback/warning.html) | [✅](notifications/review-feedback/danger.html) | [✅](notifications/review-feedback/with-action.html) | [✅](notifications/review-feedback/stacked.html) | [✅](notifications/review-feedback/persistent.html) | `L2-029`, `L2-031` |
| Account feedback (`account-feedback`) | [✅](notifications/account-feedback/info.html) | [✅](notifications/account-feedback/success.html) | [✅](notifications/account-feedback/warning.html) | [✅](notifications/account-feedback/danger.html) | [✅](notifications/account-feedback/with-action.html) | [✅](notifications/account-feedback/stacked.html) | [✅](notifications/account-feedback/persistent.html) | `L2-029`, `L2-031` |
| Cookie consent (`cookie-consent`) | [✅](notifications/cookie-consent/info.html) | [✅](notifications/cookie-consent/success.html) | [✅](notifications/cookie-consent/warning.html) | [✅](notifications/cookie-consent/danger.html) | [✅](notifications/cookie-consent/with-action.html) | [✅](notifications/cookie-consent/stacked.html) | [✅](notifications/cookie-consent/persistent.html) | `L2-031`, `L2-034` |
| Braider feedback (`braider-feedback`) | [✅](notifications/braider-feedback/info.html) | [✅](notifications/braider-feedback/success.html) | [✅](notifications/braider-feedback/warning.html) | [✅](notifications/braider-feedback/danger.html) | [✅](notifications/braider-feedback/with-action.html) | [✅](notifications/braider-feedback/stacked.html) | [✅](notifications/braider-feedback/persistent.html) | `L2-047` |

<!-- coverage:end -->

## Regenerate and check

From the repository root:

```powershell
python docs/mocks/build.py
python .agents/skills/writing-html-mocks/scripts/check_mocks.py docs/mocks --write
python .agents/skills/writing-html-mocks/scripts/screenshot_mocks.py docs/mocks
```

The source catalog is in `build.py`; generated HTML, shared assets, manifest and gallery are committed. Screenshot cache stays out of Git.

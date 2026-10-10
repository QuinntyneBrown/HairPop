# HairPop customer journey mocks

<!-- Cast and catalog: Today is Sat 10 Oct 2026 in Toronto. Maya Chen is the customer; Nia Okafor is her braider. Aisha Mensah and Jules Baptiste are other braiders. Maya requested medium knotless braids from Nia for Sat 24 Oct at 10:00 am (HP-1048), estimated at $180–$240 and about five hours. Her previous appointment was Sat 3 Oct (HP-0992). These names, dates, prices and statuses carry across every mock. -->

Open [the gallery](index.html) from disk. Each screen has sibling state links and a theme switch. Add `?theme=dark` or `?chrome=0` to any mock URL. The mocks are static snapshots; links between screens work, while form submissions and dialogs illustrate their states without a backend.

## Scope and open questions

The source of product direction is [`docs/7-star-redesign.md`](../7-star-redesign.md). Platform requirements now live in [`docs/specs/L1.md`](../specs/L1.md) and [`docs/specs/L2.md`](../specs/L2.md); L2 includes a mock-to-requirement map. The redesign's eight customer journey screens are the core. Entry, account, help, legal and error screens complete the customer facing path. Admin screens and a new braider studio are outside the redesign's stated scope.

The current Angular routes use `/hair-styles`, `/braiders` and `/braider/:id`; the proposed route paths in the manifest represent the redesigned navigation, not implemented URLs. Exact pricing, availability, cancellation terms and studio address are illustrative content for review. Final product copy needs agreed policies and live braider data. Terms and privacy are structural mock copy, not approved legal text.

The static sketches intentionally show a pending request before acceptance; no appointment or final price is called confirmed until the braider accepts it. The confirmed appointment state is shown separately in `appointment-detail/success.html`.

Typography follows `C:/projects/banaro/docs/design-system/tokens/tokens.css`: local Manrope and JetBrains Mono fonts, type sizes, weights, line heights, letter spacing and semantic text roles. HairPop retains its own colour and layout tokens.

## Coverage

<!-- coverage:start -->

Legend: ✅ mock exists · ➖ not applicable (reason in manifest) · ❌ missing

### Pages

| Screen | default | loading | empty | error | no-results | long | edge | offline | partial | invalid | submitting | success | unread | read | failed | Requirements |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Style gallery (`style-gallery`) | [✅](pages/style-gallery/default.html) | [✅](pages/style-gallery/loading.html) | [✅](pages/style-gallery/empty.html) | [✅](pages/style-gallery/error.html) | [✅](pages/style-gallery/no-results.html) | [✅](pages/style-gallery/long.html) | [✅](pages/style-gallery/edge.html) | [✅](pages/style-gallery/offline.html) |  |  |  |  |  |  |  |  |
| Knotless braids (`style-detail`) | [✅](pages/style-detail/default.html) | [✅](pages/style-detail/loading.html) | [✅](pages/style-detail/empty.html) | [✅](pages/style-detail/error.html) |  |  | [✅](pages/style-detail/edge.html) | [✅](pages/style-detail/offline.html) | [✅](pages/style-detail/partial.html) |  |  |  |  |  |  |  |
| Matching braiders (`matching-braiders`) | [✅](pages/matching-braiders/default.html) | [✅](pages/matching-braiders/loading.html) | [✅](pages/matching-braiders/empty.html) | [✅](pages/matching-braiders/error.html) | [✅](pages/matching-braiders/no-results.html) | [✅](pages/matching-braiders/long.html) | [✅](pages/matching-braiders/edge.html) | [✅](pages/matching-braiders/offline.html) |  |  |  |  |  |  |  |  |
| Nia’s profile (`braider-profile`) | [✅](pages/braider-profile/default.html) | [✅](pages/braider-profile/loading.html) | [✅](pages/braider-profile/empty.html) | [✅](pages/braider-profile/error.html) |  |  | [✅](pages/braider-profile/edge.html) | [✅](pages/braider-profile/offline.html) | [✅](pages/braider-profile/partial.html) |  |  |  |  |  |  |  |
| Booking request (`booking-request`) | [✅](pages/booking-request/default.html) | [✅](pages/booking-request/loading.html) | [✅](pages/booking-request/empty.html) | [✅](pages/booking-request/error.html) |  |  |  | [✅](pages/booking-request/offline.html) |  | [✅](pages/booking-request/invalid.html) | [✅](pages/booking-request/submitting.html) | [✅](pages/booking-request/success.html) |  |  |  |  |
| Appointment detail (`appointment-detail`) | [✅](pages/appointment-detail/default.html) | [✅](pages/appointment-detail/loading.html) | [✅](pages/appointment-detail/empty.html) | [✅](pages/appointment-detail/error.html) |  |  |  | [✅](pages/appointment-detail/offline.html) | [✅](pages/appointment-detail/partial.html) |  |  | [✅](pages/appointment-detail/success.html) |  |  |  |  |
| My appointments (`my-appointments`) | [✅](pages/my-appointments/default.html) | [✅](pages/my-appointments/loading.html) | [✅](pages/my-appointments/empty.html) | [✅](pages/my-appointments/error.html) | [✅](pages/my-appointments/no-results.html) | [✅](pages/my-appointments/long.html) | [✅](pages/my-appointments/edge.html) | [✅](pages/my-appointments/offline.html) |  |  |  |  |  |  |  |  |
| Care and review (`care-and-review`) | [✅](pages/care-and-review/default.html) | [✅](pages/care-and-review/loading.html) | [✅](pages/care-and-review/empty.html) | [✅](pages/care-and-review/error.html) |  |  |  | [✅](pages/care-and-review/offline.html) |  | [✅](pages/care-and-review/invalid.html) | [✅](pages/care-and-review/submitting.html) | [✅](pages/care-and-review/success.html) |  |  |  |  |
| Sign in (`sign-in`) | [✅](pages/sign-in/default.html) | [✅](pages/sign-in/loading.html) | ➖ | [✅](pages/sign-in/error.html) |  |  |  |  |  | [✅](pages/sign-in/invalid.html) | [✅](pages/sign-in/submitting.html) | [✅](pages/sign-in/success.html) |  |  |  |  |
| Create account (`sign-up`) | [✅](pages/sign-up/default.html) | [✅](pages/sign-up/loading.html) | ➖ | [✅](pages/sign-up/error.html) |  |  |  |  |  | [✅](pages/sign-up/invalid.html) | [✅](pages/sign-up/submitting.html) | [✅](pages/sign-up/success.html) |  |  |  |  |
| Forgot password (`forgot-password`) | [✅](pages/forgot-password/default.html) | [✅](pages/forgot-password/loading.html) | ➖ | [✅](pages/forgot-password/error.html) |  |  |  |  |  | [✅](pages/forgot-password/invalid.html) | [✅](pages/forgot-password/submitting.html) | [✅](pages/forgot-password/success.html) |  |  |  |  |
| Reset password (`reset-password`) | [✅](pages/reset-password/default.html) | [✅](pages/reset-password/loading.html) | ➖ | [✅](pages/reset-password/error.html) |  |  |  |  |  | [✅](pages/reset-password/invalid.html) | [✅](pages/reset-password/submitting.html) | [✅](pages/reset-password/success.html) |  |  |  |  |
| Verify email (`verify-email`) | [✅](pages/verify-email/default.html) | [✅](pages/verify-email/loading.html) | ➖ | [✅](pages/verify-email/error.html) |  |  |  |  |  |  | [✅](pages/verify-email/submitting.html) | [✅](pages/verify-email/success.html) |  |  |  |  |
| Notifications (`notification-center`) | [✅](pages/notification-center/default.html) | [✅](pages/notification-center/loading.html) | [✅](pages/notification-center/empty.html) | [✅](pages/notification-center/error.html) |  |  |  | [✅](pages/notification-center/offline.html) |  |  |  |  | [✅](pages/notification-center/unread.html) | [✅](pages/notification-center/read.html) |  |  |
| Account settings (`account-settings`) | [✅](pages/account-settings/default.html) | [✅](pages/account-settings/loading.html) | ➖ | [✅](pages/account-settings/error.html) |  |  |  | [✅](pages/account-settings/offline.html) |  | [✅](pages/account-settings/invalid.html) | [✅](pages/account-settings/submitting.html) | [✅](pages/account-settings/success.html) |  |  | [✅](pages/account-settings/failed.html) |  |
| Help (`help`) | [✅](pages/help/default.html) | [✅](pages/help/loading.html) | ➖ | [✅](pages/help/error.html) |  |  |  | [✅](pages/help/offline.html) |  |  |  |  |  |  |  |  |
| Page not found (`not-found`) | [✅](pages/not-found/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |
| Access unavailable (`forbidden`) | [✅](pages/forbidden/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |
| Service error (`server-error`) | [✅](pages/server-error/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |
| Offline (`offline`) | [✅](pages/offline/default.html) | ➖ | ➖ | ➖ |  |  |  |  |  |  |  |  |  |  |  |  |
| Terms of use (`terms`) | [✅](pages/terms/default.html) | [✅](pages/terms/loading.html) | ➖ | [✅](pages/terms/error.html) |  |  |  |  |  |  |  |  |  |  |  |  |
| Privacy (`privacy`) | [✅](pages/privacy/default.html) | [✅](pages/privacy/loading.html) | ➖ | [✅](pages/privacy/error.html) |  |  |  |  |  |  |  |  |  |  |  |  |

### Dialogs

| Screen | default | busy | invalid | failed | Requirements |
|---|---|---|---|---|---|
| Filter braiders (`filter-braiders`) | [✅](dialogs/filter-braiders/default.html) | [✅](dialogs/filter-braiders/busy.html) | [✅](dialogs/filter-braiders/invalid.html) | [✅](dialogs/filter-braiders/failed.html) |  |
| Review request (`request-review`) | [✅](dialogs/request-review/default.html) | [✅](dialogs/request-review/busy.html) | ➖ | [✅](dialogs/request-review/failed.html) |  |
| Cancel request HP-1048? (`cancel-appointment`) | [✅](dialogs/cancel-appointment/default.html) | [✅](dialogs/cancel-appointment/busy.html) | ➖ | [✅](dialogs/cancel-appointment/failed.html) |  |
| Request a change (`change-appointment`) | [✅](dialogs/change-appointment/default.html) | [✅](dialogs/change-appointment/busy.html) | [✅](dialogs/change-appointment/invalid.html) | [✅](dialogs/change-appointment/failed.html) |  |
| Report a review (`report-review`) | [✅](dialogs/report-review/default.html) | [✅](dialogs/report-review/busy.html) | [✅](dialogs/report-review/invalid.html) | [✅](dialogs/report-review/failed.html) |  |
| Sign out? (`sign-out`) | [✅](dialogs/sign-out/default.html) | [✅](dialogs/sign-out/busy.html) | ➖ |  |  |
| Cookie preferences (`cookie-preferences`) | [✅](dialogs/cookie-preferences/default.html) | [✅](dialogs/cookie-preferences/busy.html) | ➖ | [✅](dialogs/cookie-preferences/failed.html) |  |

### Notifications

| Screen | info | success | warning | danger | with-action | stacked | persistent | Requirements |
|---|---|---|---|---|---|---|---|---|
| Booking update (`booking-update`) | [✅](notifications/booking-update/info.html) | [✅](notifications/booking-update/success.html) | [✅](notifications/booking-update/warning.html) | [✅](notifications/booking-update/danger.html) | [✅](notifications/booking-update/with-action.html) | [✅](notifications/booking-update/stacked.html) | [✅](notifications/booking-update/persistent.html) |  |
| Review feedback (`review-feedback`) | [✅](notifications/review-feedback/info.html) | [✅](notifications/review-feedback/success.html) | [✅](notifications/review-feedback/warning.html) | [✅](notifications/review-feedback/danger.html) | [✅](notifications/review-feedback/with-action.html) | [✅](notifications/review-feedback/stacked.html) | [✅](notifications/review-feedback/persistent.html) |  |
| Account feedback (`account-feedback`) | [✅](notifications/account-feedback/info.html) | [✅](notifications/account-feedback/success.html) | [✅](notifications/account-feedback/warning.html) | [✅](notifications/account-feedback/danger.html) | [✅](notifications/account-feedback/with-action.html) | [✅](notifications/account-feedback/stacked.html) | [✅](notifications/account-feedback/persistent.html) |  |
| Cookie consent (`cookie-consent`) | [✅](notifications/cookie-consent/info.html) | [✅](notifications/cookie-consent/success.html) | [✅](notifications/cookie-consent/warning.html) | [✅](notifications/cookie-consent/danger.html) | [✅](notifications/cookie-consent/with-action.html) | [✅](notifications/cookie-consent/stacked.html) | [✅](notifications/cookie-consent/persistent.html) |  |

<!-- coverage:end -->

## Regenerate and check

From the repository root:

```powershell
python docs/mocks/build.py
python .agents/skills/writing-html-mocks/scripts/check_mocks.py docs/mocks --write
python .agents/skills/writing-html-mocks/scripts/screenshot_mocks.py docs/mocks
```

The source catalog is in `build.py`; generated HTML, shared assets, manifest and gallery are committed. Screenshot cache stays out of Git.

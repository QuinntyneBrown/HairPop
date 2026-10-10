# Alert

| Field | Value |
|---|---|
| Selector | `hp-alert` |
| Library path | `frontend/projects/components/src/lib/alert/` |
| Status | planned |
| Traces to | L2-022, L2-036, L2-041, L2-042 |
| Design system | [`alert.html`](../../design-system/components/alert.html) |
| Source mocks | [`pages/booking-request/offline`](../../mocks/pages/booking-request/offline.html), [`pages/account-settings/offline`](../../mocks/pages/account-settings/offline.html), [`pages/care-and-review/offline`](../../mocks/pages/care-and-review/offline.html), [`pages/style-gallery/offline`](../../mocks/pages/style-gallery/offline.html), [`pages/style-detail/offline`](../../mocks/pages/style-detail/offline.html), [`pages/matching-braiders/offline`](../../mocks/pages/matching-braiders/offline.html), [`pages/braider-profile/offline`](../../mocks/pages/braider-profile/offline.html), [`pages/appointment-detail/offline`](../../mocks/pages/appointment-detail/offline.html), [`pages/my-appointments/offline`](../../mocks/pages/my-appointments/offline.html), [`pages/notification-center/offline`](../../mocks/pages/notification-center/offline.html), [`pages/style-detail/partial`](../../mocks/pages/style-detail/partial.html), [`pages/braider-profile/partial`](../../mocks/pages/braider-profile/partial.html), [`pages/appointment-detail/partial`](../../mocks/pages/appointment-detail/partial.html), [`pages/sign-in/invalid`](../../mocks/pages/sign-in/invalid.html), [`pages/booking-request/invalid`](../../mocks/pages/booking-request/invalid.html), [`dialogs/filter-braiders/invalid`](../../mocks/dialogs/filter-braiders/invalid.html), [`dialogs/cancel-appointment/failed`](../../mocks/dialogs/cancel-appointment/failed.html), [`dialogs/cookie-preferences/failed`](../../mocks/dialogs/cookie-preferences/failed.html), [`dialogs/sign-out/confirm`](../../mocks/dialogs/sign-out/confirm.html) |
| Rendering | [`alert.html`](alert.html) |

## Purpose and scope

An alert explains a condition that affects a page, or one region of it, and stays visible while it is true: "You’re offline", "Some details are unavailable", "We couldn’t cancel this request". It has four tones (info, success, warning, danger), each with an icon, a title and text, so the tone never depends on colour. It can carry up to two actions, can be dismissible when it may safely be ignored, can be a full-width page **banner** for conditions that affect the whole app, and is the container of the form **error summary**.

Use something else when:

- the feedback is about an action that just finished: a [toast](toast.md);
- the message belongs to one field: an inline message under that field;
- the whole region failed to load: an empty or error state in place of the region;
- the customer must decide: a [dialog](dialog.md).

Out of scope:

- The error summary's content, focus and naming. The [form layout](form-layout.md) renders an `hp-alert` with the class `form-summary`, its own title, the list of links, `tabindex="-1"`, `role="group"` and `aria-labelledby`, and focuses it; the alert supplies only the look.
- When an alert appears and disappears (offline, back online, retry succeeded) and remembering a dismissal for the session. The page decides and removes the alert.
- What an action does. Actions are projected [links](link.md) (`a[hp-link]` with `variant="inherit"`) or [buttons](button.md) (`button[hp-button]` with `variant="link"` and `size="sm"`).

## Usage

Every `.alert` in `docs/mocks/`, grouped by configuration, with the design system's corrections applied (D-1): each alert gets its tone icon and a real title instead of a bold run-in, the error summary links each field, alerts inserted after an action get a live role, and the `confirm` mocks' warning alert stacked on a danger dialog is not built.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/booking-request/offline`, `pages/account-settings/offline`, `pages/care-and-review/offline` (above the form) | warning, inline, present on load | title "You’re offline"; text "Your details remain here. Connect before sending." | persistent until back online | canvas, above the form panel |
| `pages/style-gallery/offline`, `style-detail`, `matching-braiders`, `braider-profile`, `appointment-detail`, `my-appointments`, `notification-center` (under the top bar) | warning, banner, wifi-off icon (projected), `announce` when connectivity drops after load | title "You’re offline"; text "Saved details are shown. Actions need a connection." | persistent until back online | full width under the top bar (D-3) |
| `pages/style-detail/partial`, `pages/braider-profile/partial`, `pages/appointment-detail/partial` | warning, inline, with action | title "Some details are unavailable"; text "Reviews could not load."; action `a[hp-link] variant="inherit"` "Retry reviews" (mock: link inside the sentence, D-1) | default, link hover, link focus, persistent until the retry succeeds | canvas, in place of the reviews |
| Error summary on every form page with an `invalid` mock (`sign-in`, `sign-up`, `forgot-password`, `reset-password`, `account-settings`, `booking-request`, `care-and-review`) and every dialog with an `invalid` mock (`filter-braiders`, `request-review`, `change-appointment`, `report-review`, `cookie-preferences`) | danger, `class="form-summary"`, `tabindex="-1"`, `role="group"`, no `heading` (the form layout projects its own title) | title "Check 1 field before sending" (form layout); list of links "Preferred time: Choose a time Nia offers." | focused, link hover, link focus | form panel or dialog body |
| Dialog failure in `dialogs/cancel-appointment/failed`, `change-appointment/failed`, `filter-braiders/failed`, `report-review/failed`, `request-review/failed`, `cookie-preferences/failed` | danger, inline, `announce` | "We couldn’t cancel this request." / "Your request is unchanged. Check your connection and try again."; elsewhere "We couldn’t save this change." / "Your details remain here. Please try again." | persistent until success or close | dialog body (raised) |
| Page save failure (design system *States*) | danger, inline, `announce`, with action `button[hp-button] variant="link" size="sm"` "Try again" | "We couldn’t save this change" / "Your details remain here. Please try again." | default, action hover, action focus | canvas or card |
| Booking estimate note (design system *Variants*) | info, inline | "Prices are estimates" / "Nia confirms the final price and time when she accepts your request." | default | canvas |
| Account saved (design system *Variants*) | success, inline, `announce`, with action "Back to settings" | "Your changes are saved" / "Braiders will use your new phone number, 416-555-0148." | default | canvas |
| Feature note (design system *With actions and dismissible*) | info, dismissible | "New: request a change" / "You can now ask Nia for a different time from your appointment."; dismiss "Dismiss: New: request a change" | default, dismiss hover, dismiss focus, dismissed | canvas |
| `dialogs/cancel-appointment/confirm`, `dialogs/sign-out/confirm` | warning stacked on a danger dialog | — | drift, not built (dialog D-1) | — |

Every row is buildable with the API below: `tone`, `heading`, `banner`, `announce`, `dismissLabel`, the icon, default and actions slots, and consumer host attributes (`class`, `tabindex`, `role`, `aria-labelledby`).

## Anatomy

1. **Container** — `.alert` (plus `.alert--success`, `.alert--warning` or `.alert--danger`; info is the base) on the `hp-alert` host. Flex row, `--space-3` gap, `--space-4` padding, `--border-width-hairline` border in `--alert-border` with a `--border-width-accent` leading edge, `--radius-md`, `--alert-bg` background, `--alert-fg` text.
2. **Icon** — first child, `svg.icon` (20 px) in `--alert-icon`, `aria-hidden="true"`, nudged down `--space-0-5`: info, check-circle, warning or alert-circle by tone, or the projected icon (wifi-off on the offline banner).
3. **Body** — `div.alert__body`: column, `--space-1` gap, `min-width: 0` so text wraps.
4. **Title (optional)** — `p.alert__title`: `--text-label` at `--font-size-md`. The condition in a few words.
5. **Text** — projected content: one or two sentences, or the error summary's list.
6. **Actions (optional)** — `div.alert__actions`: up to two inherit links or link-variant buttons, `--space-3` apart, wrapping.
7. **Dismiss (optional)** — `button.close` with the close icon (`icon--sm`), `--target-min` square, pulled out by `--space-1` on top and end.

Host: `hp-alert` is the `.alert` element itself (element selector, BEM classes on the host, D-2). The consumer's `class` (for example `form-summary`), `tabindex`, `role` and `aria-labelledby` stay on the host untouched.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | no | Adds `.alert--success`, `.alert--warning` or `.alert--danger`; info adds no modifier (the base is info). Picks the default icon. |
| `heading` | `string` | `''` | no | Rendered as `p.alert__title` first in the body when not empty. The error summary leaves it empty and projects its own titled list. |
| `banner` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.banner`: full width, no radius, no leading edge, bottom border only, content centred with `--layout-margin` padding. |
| `announce` | `boolean` (`booleanAttribute`) | `false` | no | For an alert inserted after the page loaded: sets `role="alert"` for danger and `role="status"` for the other tones. Leave false for alerts present on load (D-4). Ignored when the consumer sets `role`. |
| `dismissLabel` | `string` | `''` | no | When not empty, renders the dismiss control with this `aria-label` ("Dismiss: New: request a change"). Only for alerts that may safely be ignored; never for warning or danger alerts while the condition holds. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `dismissed` | `void` | The dismiss control is activated. The alert first moves focus to the next focusable element after it (D-5); the consumer then removes it and remembers the dismissal for the session. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `[slot=icon]` | One `<svg class="icon" aria-hidden="true">` | Replaces the tone's default icon (wifi-off for the offline banner). |
| default | Text paragraphs, or the error summary's title and `<ul>` of links | Projected into `.alert__body` after the title. |
| `[slot=actions]` | Up to two `a[hp-link] variant="inherit"` or `button[hp-button] variant="link" size="sm"` | Projected into `.alert__actions`, which is hidden when empty. |

Each slot is declared once. Every string is an input or projected content; the component renders no copy of its own.

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Info | — (base `.alert`) | Context that helps: "Prices are estimates". |
| Success | `.alert--success` | A lasting confirmation on the page: "Your changes are saved". |
| Warning | `.alert--warning` | Something limits what the customer can do: "You’re offline", "Some details are unavailable". |
| Danger | `.alert--danger` | Something failed or must be fixed: "We couldn’t cancel this request", the error summary. |
| Banner | `.banner` | A condition affecting the whole app, under the top bar: offline. |
| With actions | `.alert__actions` present | A targeted next step: "Retry reviews", "Try again". |
| Dismissible | `.close` present | Information that may be ignored: "New: request a change". |
| Error summary | `.form-summary` (consumer class) | The form layout's summary: `--border-width-accent` leading edge, list of links. |

One size: the alert fills its container's width; the banner fills the viewport's.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (present on load) | rendered with the page | Tone colours, icon, title, text | Read as page content; no role |
| Announced (inserted after load) | `announce` | Same | `role="status"` (polite) or `role="alert"` (danger) announces title and text once |
| Link or action hover | `:hover` on a projected link or button | Link keeps the tone colour and thickens its underline; link-variant button gets its hover fill | — |
| Link or action focus | `:focus-visible` | Shared `--color-focus-ring` ring, offset `--focus-ring-offset` | — |
| Dismiss hover | `.close:hover` | `color-mix(currentColor 8 %)` fill | — |
| Dismiss focus | `.close:focus-visible` | Shared ring | Named "Dismiss: …" |
| Dismissed | dismiss activated | Removed by the consumer | Focus moved to the next focusable element first (D-5) |
| Summary focused | form layout focuses the `.form-summary` host | Shared ring outside the alert (`outline-offset: --focus-ring-offset`) | Group named by its title |
| Persistent | warning or danger while the condition holds | No dismiss control | — |
| Forced colours | `forced-colors: active` | `CanvasText` border (stylesheet); links in `LinkText` | — |
| Reduced motion | `prefers-reduced-motion: reduce` | No change: alerts never animate | — |

## Markup

```html
<!-- rendered: warning with an action (partial load on Nia's profile) -->
<hp-alert class="alert alert--warning">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4L2.5 20h19zM12 10v4M12 17v.01"/></svg>
  <div class="alert__body">
    <p class="alert__title">Some details are unavailable</p>
    <p>Reviews could not load.</p>
    <div class="alert__actions"><a class="link link--inherit" href="/braiders/nia-okafor#reviews">Retry reviews</a></div>
  </div>
</hp-alert>
```

```html
<!-- rendered: offline banner, inserted after load -->
<hp-alert class="alert alert--warning banner" role="status">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.8M12 20h.01M16.7 11.3A10 10 0 0 1 19 13M2 9a15 15 0 0 1 4.6-2.9M10.7 5.1A15 15 0 0 1 22 9"/></svg>
  <div class="alert__body"><p class="alert__title">You’re offline</p><p>Saved details are shown. Actions need a connection.</p></div>
</hp-alert>
```

```html
<!-- rendered: dismissible info -->
<hp-alert class="alert">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 7.5v.01"/></svg>
  <div class="alert__body"><p class="alert__title">New: request a change</p><p>You can now ask Nia for a different time from your appointment.</p></div>
  <button class="close" type="button" aria-label="Dismiss: New: request a change"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
</hp-alert>
```

```html
<!-- rendered: dialog failure, announced -->
<hp-alert class="alert alert--danger" role="alert">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v5M12 16v.01"/></svg>
  <div class="alert__body"><p class="alert__title">We couldn’t cancel this request.</p><p>Your request is unchanged. Check your connection and try again.</p></div>
</hp-alert>
```

```html
<!-- rendered: error summary as the form layout composes it -->
<hp-alert class="alert alert--danger form-summary" tabindex="-1" role="group" aria-labelledby="hp-form-1-summary-title">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v5M12 16v.01"/></svg>
  <div class="alert__body">
    <strong id="hp-form-1-summary-title">Check 1 field before sending</strong>
    <ul><li><a href="#time">Preferred time: Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am.</a></li></ul>
  </div>
</hp-alert>
```

The actions container is rendered and hidden by `:empty` when nothing is projected; e2e tests locate actions inside `.alert__actions` only when present.

Consumer templates:

```html
<!-- consumer: partial load -->
<hp-alert tone="warning" heading="Some details are unavailable">
  <p>Reviews could not load.</p>
  <a hp-link variant="inherit" slot="actions" href="/braiders/nia-okafor#reviews" (click)="retryReviews($event)">Retry reviews</a>
</hp-alert>

<!-- consumer: offline banner -->
<hp-alert tone="warning" banner announce heading="You’re offline">
  <svg slot="icon" class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M3 3l18 18…"/></svg>
  <p>Saved details are shown. Actions need a connection.</p>
</hp-alert>

<!-- consumer: page save failure with a retry button -->
<hp-alert tone="danger" announce heading="We couldn’t save this change">
  <p>Your details remain here. Please try again.</p>
  <button hp-button variant="link" size="sm" slot="actions" [busy]="saving()" (click)="save()">Try again</button>
</hp-alert>

<!-- consumer: dismissible -->
@if (!noteDismissed()) {
  <hp-alert heading="New: request a change" dismissLabel="Dismiss: New: request a change" (dismissed)="dismissNote()">
    <p>You can now ask Nia for a different time from your appointment.</p>
  </hp-alert>
}
```

## Design

- Container: `display: flex; gap: --space-3; padding: --space-4`; border `--border-width-hairline` in `--alert-border`, leading edge `--border-width-accent`; `--radius-md`.
- Body: `flex: 1; display: flex; flex-direction: column; gap: --space-1; min-width: 0`; paragraphs `max-width: none`.
- Title: `--text-label` at `--font-size-md`.
- Actions: `display: flex; flex-wrap: wrap; gap: --space-3; margin-top: --space-1`; links and buttons `--text-label`, colour inherited.
- Links: the alert sets `--link-inherit-font-weight: var(--font-weight-semibold)` on its host, so projected `a[hp-link] variant="inherit"` links (and the summary's links) are semibold in the tone colour (link CRD D-3; D-6).
- Dismiss: `--target-min` square, `--radius-sm`, transparent, pulled out by `--space-1` on top and end; hover `color-mix(in srgb, currentColor 8%, transparent)`.
- Banner: `border-radius: 0; border-width: 0 0 --border-width-hairline`; `justify-content: center`; inline padding `--layout-margin`; body as a wrapping row with `--space-2` × `--space-4` gaps, so title and text sit on one line on wide screens and wrap below 640 px.
- Error summary (`.form-summary`): leading edge `--border-width-accent`; list `margin-top: --space-1`, `padding-left: --space-5`; links semibold; focus ring offset `--focus-ring-offset`.
- Motion: none; alerts appear in place.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--alert-bg` | `--color-info-bg` | `.alert--success` → `--color-success-bg`; `.alert--warning` → `--color-warning-bg`; `.alert--danger` → `--color-danger-bg` |
| `--alert-fg` | `--color-info-fg` | the same pattern with `-fg` |
| `--alert-border` | `--color-info-border` | the same pattern with `-border` |
| `--alert-icon` | `--color-info-icon` | the same pattern with `-icon` |
| `--link-inherit-font-weight` (set, not declared here) | `--font-weight-semibold` | read by the link component (link CRD D-3) |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Info background / text | `--color-info-bg` / `--color-info-fg` | `--palette-plum-50` / `--palette-plum-800` | `--palette-plum-950` / `--palette-plum-200` |
| Info border / icon | `--color-info-border` / `--color-info-icon` | `--palette-plum-300` / `--palette-plum-600` | `--palette-plum-800` / `--palette-plum-300` |
| Success background / text | `--color-success-bg` / `--color-success-fg` | `--palette-green-50` / `--palette-green-700` | `--palette-green-950` / `--palette-green-300` |
| Success border / icon | `--color-success-border` / `--color-success-icon` | `--palette-green-300` / `--palette-green-500` | `--palette-green-700` / `--palette-green-300` |
| Warning background / text | `--color-warning-bg` / `--color-warning-fg` | `--palette-amber-50` / `--palette-amber-700` | `--palette-amber-950` / `--palette-amber-300` |
| Warning border / icon | `--color-warning-border` / `--color-warning-icon` | `--palette-amber-300` / `--palette-amber-500` | `--palette-amber-700` / `--palette-amber-300` |
| Danger background / text | `--color-danger-bg` / `--color-danger-fg` | `--palette-red-50` / `--palette-red-700` | `--palette-red-950` / `--palette-red-300` |
| Danger border / icon | `--color-danger-border` / `--color-danger-icon` | `--palette-red-300` / `--palette-red-500` | `--palette-red-700` / `--palette-red-300` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-info-fg` | `--color-info-bg` | 4.5:1 | Info title, text, links, dismiss |
| `--color-success-fg` | `--color-success-bg` | 4.5:1 | Success text |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | Warning text |
| `--color-danger-fg` | `--color-danger-bg` | 4.5:1 | Danger text and summary links |
| `--color-info-icon` | `--color-info-bg` | 3:1 | Info icon |
| `--color-success-icon` | `--color-success-bg` | 3:1 | Success icon |
| `--color-warning-icon` | `--color-warning-bg` | 3:1 | Warning icon |
| `--color-danger-icon` | `--color-danger-bg` | 3:1 | Danger icon |
| `--color-focus-ring` | `--color-warning-bg` | 3:1 | Focus on a link or dismiss in a warning alert |
| `--color-focus-ring` | `--color-danger-bg` | 3:1 | Focus on a summary link or the summary itself |

The border is decorative (contrast-pairs.json: the background, icon and title carry the meaning). Measured, the focus ring is at least 6.8:1 on every tone background in both themes. Forced colours: the stylesheet gives `.alert` a `CanvasText` border; links use the system link colour.

## Responsive behaviour

- Alerts fill their container at every width; the icon and dismiss stay top-aligned while the text wraps. Measured at 360 px: the partial-load warning with an action and a dismiss is 175 px tall at default text and 611 px at 200 %, with nothing clipped and no horizontal scroll.
- Actions wrap below the text; at 360 px two short actions fit on one line.
- The banner spans the viewport; below 640 px its title and text wrap onto separate lines; padding follows `--layout-margin`. Measured at 360 px with 200 % text it grows to 345 px tall without overflow.
- Long words in summary links break (form layout D-14).
- Targets: the dismiss control is 24 × 24 px with the alert's padding around it; actions are at least 24 px tall.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available.

## Accessibility

### Role and pattern

Alerts present when the page loads have no role; they are page content. An alert inserted after load sets `announce`, which gives it `role="status"` (info, success, warning) or `role="alert"` (danger) following the [APG Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/). The error summary's role (`group`, named by its title) is set by the form layout. Status is always icon + title + text, never colour alone.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Reaches projected links, actions and the dismiss control in DOM order. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Follows a link (Enter), activates an action or the dismiss control. |

### Focus

- Alerts never take focus themselves. The form layout focuses its summary (`tabindex="-1"` plus `focus()`), and the summary shows the shared ring outside its edge.
- After a dismiss, focus moves to the next focusable element after the alert, or the previous one if none follows, before the alert is removed (D-5).
- Links and buttons inside use the shared ring, which keeps at least 3:1 against every tone background.

### Labelling

- The title names the condition; the icon is `aria-hidden`.
- The dismiss control is named from the title through `dismissLabel` ("Dismiss: Some details are unavailable").
- Actions name their outcome: "Retry reviews", "Try again", never "Click here".

### Announcements

With `announce`, the title and text are announced once when the alert is inserted: politely for info, success and warning, assertively for danger. Alerts present on load are read in reading order only. Removal is silent.

### Motion

None. Alerts appear and disappear in place, so reduced motion changes nothing.

## Content and internationalisation

- Title: the condition, not a judgement: "You’re offline", "Some details are unavailable", "We couldn’t save this change".
- Text: what it means and what is safe: "Your details remain here. Connect before sending."
- Actions name the outcome: "Retry reviews", "Try again".
- Error summaries say how many fields need attention and list each one in the field's words (form layout).
- Translatable inputs: `heading`, `dismissLabel`, and all projected text and action labels. Data values: names, phone numbers ("416-555-0148"), dates.
- Long text wraps; nothing truncates.

## Performance

- Change detection: `OnPush`, signal inputs; the template has no loops or computed text.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Alert.ts` renders the partial-load warning on Nia's profile, `hp-alert tone="warning" heading="Some details are unavailable"` with "Reviews could not load." and the inherit link "Retry reviews"; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: the form layout's summary scenario renders the danger `.form-summary` configuration.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: alerts are in-flow; an alert inserted after load pushes content down by design. A partial-load alert takes the place of the missing region, so the rest of the page does not move.
- Weight: `@angular/core` only; composes `svg[hp-icon]`.
- No L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `<hp-alert tone="warning" heading="Some details are unavailable">` with "Reviews could not load." and the inherit link "Retry reviews" in `[slot=actions]` on Nia's profile in its partial state, when it renders, then the host has the classes `alert alert--warning`, its first child is the warning icon with `aria-hidden="true"`, `.alert__body` holds `p.alert__title`, the text and `.alert__actions` with the link, and the host has no `role`. (L2-036)
- **AC-2** Given the partial-load alert, when the customer activates "Retry reviews", then only the reviews are requested again and the alert stays until they load. (L2-036)
- **AC-3** Given an `hp-alert` with no `tone`, when it renders, then its classes are exactly `alert`, its background is `--color-info-bg` and its icon is the info icon. (L2-041)
- **AC-4** Given the booking request page offline, when it renders, then a warning alert "You’re offline" with "Your details remain here. Connect before sending." sits above the form, has no dismiss control, and the form's "Send request" button stays enabled. (L2-036)
- **AC-5** Given the style gallery when connectivity drops after load, when the page shows the offline banner, then the host has `alert alert--warning banner` and `role="status"`, spans the viewport width under the top bar, shows the projected wifi-off icon, and screen readers announce "You’re offline Saved details are shown. Actions need a connection." once. (L2-036)
- **AC-6** Given the cancel dialog for HP-1048 whose request failed, when the danger alert with `announce` renders first in the dialog body, then it has `role="alert"`, reads "We couldn’t cancel this request." and "Your request is unchanged. Check your connection and try again.", and is announced at once. (L2-022)

### Variants

- **AC-7** Given the booking form's error summary composed by the form layout (`class="form-summary"`, `tabindex="-1"`, `role="group"`, `aria-labelledby`), when it renders, then the host keeps those attributes unchanged, has `alert alert--danger form-summary`, a `--border-width-accent` leading edge, and its links are semibold in `--color-danger-fg`. (L2-036)
- **AC-8** Given an inherit link "Retry reviews" projected into a warning alert, when its computed style is read, then its `font-weight` equals `--font-weight-semibold` through the alert's `--link-inherit-font-weight` and its colour equals `--color-warning-fg`. (L2-041)
- **AC-9** Given a page save failure alert with the action `button[hp-button] variant="link" size="sm"` "Try again", when it renders, then the button sits in `.alert__actions`, takes the alert's text colour, and activating it retries with Maya's entries still in the form. (L2-036)

### States

- **AC-10** Given the dismissible info alert "New: request a change" with `dismissLabel="Dismiss: New: request a change"`, when it renders, then its last child is `button.close` named "Dismiss: New: request a change", 24 × 24 px, with the close icon. (L2-041)
- **AC-11** Given that dismissible alert followed by the "Request a change" button, when the customer activates the dismiss control with the keyboard, then focus moves to "Request a change" and `dismissed` emits once. (L2-041)
- **AC-12** Given a warning or danger alert without `dismissLabel`, when it renders, then there is no dismiss control. (L2-036)

### Keyboard and focus

- **AC-13** Given keyboard focus on "Retry reviews" inside the warning alert, when the ring shows, then it is the shared `--color-focus-ring` ring with at least 3:1 contrast against `--color-warning-bg` in both themes. (L2-041)
- **AC-14** Given an alert present when the page loads, when the page renders, then focus does not move to it and no live region announces it. (L2-041)

### Screen readers

- **AC-15** Given a success alert "Your changes are saved" inserted after Maya saves her account with `announce`, when it appears, then it has `role="status"` and is announced politely; given the same alert without `announce`, then it has no role. (L2-041)

### Theming

- **AC-16** Given each tone in the dark theme, when contrast is measured, then the text is at least 4.5:1 and the icon at least 3:1 against the alert background, with the background a deep tint (for warning `--palette-amber-950`). (L2-042)
- **AC-17** Given Windows forced colours, when the alerts render, then each has a `CanvasText` border and its icon and title still distinguish the tone. (L2-041)

### Responsive

- **AC-18** Given a 360 px viewport with text enlarged to 200 %, when the partial-load alert with its action and a dismiss renders, then the text wraps, the icon and dismiss stay top-aligned, nothing is clipped and the page does not scroll horizontally. (L2-042)
- **AC-19** Given the offline banner on a 360 px viewport, when it renders, then the title and text wrap onto separate lines, the inline padding equals `--layout-margin` and the banner has no rounded corners or leading edge. (L2-042)

### Motion

- **AC-20** Given `prefers-reduced-motion: reduce` or not, when an alert appears or is dismissed, then it does so in place with no animation. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/alert/`; file `alert.ts` exporting the standalone component `Alert` with `selector: 'hp-alert'`, host bindings `class.alert` (always), `class.alert--success|--warning|--danger`, `class.banner`, `attr.role` (from `announce` and `tone`, only when the host has no consumer `role`), and `style.--link-inherit-font-weight: var(--font-weight-semibold)`; `OnPush`. Export it from `public-api.ts`.
- Template: `<ng-content select="[slot=icon]"><svg hp-icon [name]="toneIcon()"></svg></ng-content>`, then `div.alert__body` with `@if (heading()) { <p class="alert__title">… }`, `<ng-content />` and `div.alert__actions` holding `<ng-content select="[slot=actions]" />`, then `@if (dismissLabel()) { <button class="close" type="button" [attr.aria-label]="dismissLabel()" (click)="dismiss()"><svg hp-icon name="close" size="sm"></svg></button> }`. Each slot is declared once.
- Styles: port `.alert`, its tones, parts, `.banner` and `.form-summary` rules onto `:host` and `:host(.alert--warning)` and so on, plus `.alert__actions:empty { display: none; }`.
- Dismiss focus (D-5): before emitting, find the next element in document order matching the focusable selector (outside the host), else the previous one, and focus it.
- Composes `svg[hp-icon]` (`info`, `check-circle`, `warning`, `alert-circle`, `close`). Projects `a[hp-link]` and `button[hp-button]`.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Alert.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *The mocks' alerts have no icon, use a bold run-in instead of a title, put "Retry reviews" inside the sentence, have unlinked error summaries, no live role when inserted after an action, and the `confirm` mocks stack a generic warning on danger dialogs. Which wins?* The design system, which records each as drift fixed during extraction: icon + `.alert__title` + text, actions in `.alert__actions`, linked summaries (form layout), `announce` for inserted alerts, and no stacked warning.
- **D-2** *Element host or an inner `div`?* The `hp-alert` host is the `.alert` element (element selector, as the brief fixes), so the form layout's `class="form-summary"`, `tabindex`, `role` and `aria-labelledby` land on the element that carries `.alert`, and `.form-summary` rules apply without a wrapper.
- **D-3** *Are the read pages' offline alerts inline (as the mocks draw them under the page header) or the banner?* The banner: the design system defines the banner for conditions that affect the whole app, names offline as its example, and draws it with exactly the read pages' copy. Form pages keep the inline warning above the form, which the design system's overview and the booking-request offline source use.
- **D-4** *How does the component know an alert was "inserted after load"?* It does not guess; the consumer sets `announce`. A single-page app renders everything after the first load, so only the page knows whether an alert reports a change (connectivity lost, save failed) or is part of the content it opened with.
- **D-5** *Where does focus go when an alert is dismissed?* To the next focusable element after it, else the previous, chosen by the alert before it emits `dismissed` so the consumer can remove it without losing focus to the body. The design system says "the next focusable element in the region".
- **D-6** *How do projected inherit links stay semibold, when the alert's encapsulated `.alert a` rule cannot reach a projected link?* The alert sets `--link-inherit-font-weight: var(--font-weight-semibold)` on its host; the link component reads it (link CRD D-3). Custom properties inherit through encapsulation, so the alert re-skins the link without reaching into it.
- **D-7** *Does the alert set `role` on the error summary?* No. The form layout gives the summary `role="group"` named by its title and focuses it (form layout D-7); the design system's `role="alert"` on the summary would announce it twice, once by the role and again by the focus move. The alert leaves any consumer role untouched.

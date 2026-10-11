# Toast

| Field | Value |
|---|---|
| Selector | `hp-toast`, `hp-toast-region`, `ToastService` (opener), `provideToasts()` (configuration) |
| Library path | `frontend/projects/components/src/lib/toast/` |
| Status | built |
| Traces to | L2-031, L2-034, L2-041, L2-042 |
| Design system | [`toast.html`](../../design-system/components/toast.html) |
| Source mocks | [`notifications/booking-update/info`](../../mocks/notifications/booking-update/info.html), [`notifications/booking-update/success`](../../mocks/notifications/booking-update/success.html), [`notifications/booking-update/warning`](../../mocks/notifications/booking-update/warning.html), [`notifications/booking-update/danger`](../../mocks/notifications/booking-update/danger.html), [`notifications/booking-update/with-action`](../../mocks/notifications/booking-update/with-action.html), [`notifications/booking-update/stacked`](../../mocks/notifications/booking-update/stacked.html), [`notifications/booking-update/persistent`](../../mocks/notifications/booking-update/persistent.html), [`notifications/review-feedback/info`](../../mocks/notifications/review-feedback/info.html), [`notifications/review-feedback/success`](../../mocks/notifications/review-feedback/success.html), [`notifications/review-feedback/warning`](../../mocks/notifications/review-feedback/warning.html), [`notifications/review-feedback/danger`](../../mocks/notifications/review-feedback/danger.html), [`notifications/review-feedback/with-action`](../../mocks/notifications/review-feedback/with-action.html), [`notifications/review-feedback/stacked`](../../mocks/notifications/review-feedback/stacked.html), [`notifications/review-feedback/persistent`](../../mocks/notifications/review-feedback/persistent.html), [`notifications/account-feedback/info`](../../mocks/notifications/account-feedback/info.html), [`notifications/account-feedback/success`](../../mocks/notifications/account-feedback/success.html), [`notifications/account-feedback/warning`](../../mocks/notifications/account-feedback/warning.html), [`notifications/account-feedback/danger`](../../mocks/notifications/account-feedback/danger.html), [`notifications/account-feedback/with-action`](../../mocks/notifications/account-feedback/with-action.html), [`notifications/account-feedback/stacked`](../../mocks/notifications/account-feedback/stacked.html), [`notifications/account-feedback/persistent`](../../mocks/notifications/account-feedback/persistent.html), [`notifications/cookie-consent/info`](../../mocks/notifications/cookie-consent/info.html), [`notifications/cookie-consent/success`](../../mocks/notifications/cookie-consent/success.html), [`notifications/cookie-consent/warning`](../../mocks/notifications/cookie-consent/warning.html), [`notifications/cookie-consent/danger`](../../mocks/notifications/cookie-consent/danger.html), [`notifications/cookie-consent/with-action`](../../mocks/notifications/cookie-consent/with-action.html), [`notifications/cookie-consent/stacked`](../../mocks/notifications/cookie-consent/stacked.html), [`notifications/cookie-consent/persistent`](../../mocks/notifications/cookie-consent/persistent.html) |
| Rendering | [`toast.html`](toast.html) |

## Purpose and scope

A toast confirms that something happened, or failed, without taking the customer away from what she was doing: "Request received", "Time confirmed", "Review not posted". It comes in four tones (info, success, warning, danger), with an optional single action, stacked when several arrive together, and persistent when it reports a failure or asks for a choice. Info and success toasts leave on their own after a documented interval that pauses while the toast is hovered or focused; danger toasts stay until dismissed or acted on.

The feature is three parts: `ToastService.show()`, which pages call; `hp-toast-region`, the two live regions the service creates once in a CDK overlay at start-up; and `hp-toast`, one toast, which carries the `tone` input.

Use something else when:

- the message belongs to one part of the page or must stay while a condition holds (offline, partial data): an [alert](alert.md);
- the customer must decide before going on: a [dialog](dialog.md);
- the customer needs to find the update later: the notification centre (a toast is never the only record of a booking update).

Out of scope:

- The wording, and whether it matches the saved result. The page passes the heading and text it got from the API (L2-029); the toast renders them.
- What the action does. The page subscribes to the toast's own action stream and performs the operation (retry, undo, navigate).
- Which events produce toasts. Booking, review, account and cookie flows decide.

## Usage

Every toast in `docs/mocks/notifications/`, with the design system's corrections applied (D-1): each toast gets its tone icon, the dismiss control is the close icon labelled with the heading, danger toasts go to the assertive region, "View update" becomes an action that names its result, failures offer Retry, and Undo is offered only where the action can be undone.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `notifications/booking-update/info`, `persistent` | info; timed (`info`), persistent (`persistent`) | "Request received" / "Nia has your request and will reply soon." | entering, default, paused, leaving; persistent | inverse toast in the polite region |
| `notifications/booking-update/success` | success, action | "Time confirmed" / "Nia confirmed Sat 24 Oct at 10:00 am."; action "View appointment" (mock: "Undo", D-1) | timed 10 s, paused, leaving | polite region |
| `notifications/booking-update/warning`, `with-action` | warning, action, persistent | "Time needs a change" / "Nia suggested Sun 25 Oct at 11:00 am."; action "View suggestion" (mock: "View update") | default, action focused | polite region |
| `notifications/booking-update/danger` | danger, action, persistent | "Update could not be sent" / "Your request is still saved. Retry when connected."; action "Retry" | default, action focused, leaving on dismiss | assertive region (top) |
| `notifications/booking-update/stacked` | info + success + danger at once | as above | stacked; each action targets its own toast | polite region holds two, assertive region one |
| `notifications/review-feedback/info`, `persistent` | info, action | "Review ready" / "Share how your visit with Nia went."; action "Write review" | timed 10 s; persistent | polite region |
| `notifications/review-feedback/success` | success | "Review posted" / "Thank you for helping others choose." (mock: "Undo"; D-9) | timed 8 s | polite region |
| `notifications/review-feedback/warning`, `with-action` | warning, action | "Review needs attention" / "Please add a rating before posting."; action "Add a rating" (mock: "View update") | persistent | polite region |
| `notifications/review-feedback/danger` | danger, action | "Review not posted" / "Your words are saved. Please try again."; action "Retry" | persistent | assertive region |
| `notifications/account-feedback/info`, `persistent` | info | "Details saved locally" / "We’ll sync your changes when connected." | timed 8 s; persistent | polite region |
| `notifications/account-feedback/success` | success, action | "Details updated" / "Nia can reach you at your new number."; action "Undo" (the previous number is restored) | timed 10 s | polite region |
| `notifications/account-feedback/warning`, `with-action` | warning, action | "Verify your email" / "Open the link sent to maya.chen@example.com."; action "Resend email" (mock: "View update") | persistent | polite region |
| `notifications/account-feedback/danger` | danger, action | "Changes not saved" / "Your edits are still here. Please try again."; action "Retry" | persistent | assertive region |
| `notifications/cookie-consent/info`, `persistent` | info, action, persistent | "Your privacy choices" / "Choose whether optional usage data may be stored."; action "Choose" (opens `dialogs/cookie-preferences`) | persistent until chosen or dismissed | polite region |
| `notifications/cookie-consent/success` | success, action | "Preferences saved" / "You can change them any time."; action "Undo" | timed 10 s | polite region |
| `notifications/cookie-consent/warning`, `with-action` | warning, action | "Choice needed" / "Select a preference to continue."; action "Choose" (mock: "View update") | persistent | polite region |
| `notifications/cookie-consent/danger` | danger, action | "Preferences not saved" / "Please retry before leaving this page."; action "Retry" | persistent | assertive region |
| `notifications/*/stacked` | three tones at once | as above | at most three per region | both regions |
| Feedback pattern (design system) | info, action | "Filters cleared" / "Showing all 12 braiders near Toronto."; action "Undo" | timed 10 s | polite region |
| After a dialog succeeds (dialog pattern) | success | "Change request sent to Nia" / "Nia will reply about Sun 25 Oct at 11:00 am." | timed 8 s | polite region, above the closing dialog's backdrop |

Every row is buildable with `ToastService.show({ tone, heading, text, actionLabel, persistent, key })`.

## Anatomy

1. **Region** — `hp-toast-region` renders two `div.toast-region` live regions, inside one CDK overlay created at start-up whose wrapper sits at `--z-toast`: the polite region `role="status" aria-live="polite"` (bottom) for info, success and warning, and the assertive region `.toast-region--top` with `role="alert" aria-live="assertive"` (top) for danger (D-2, D-3). `display: flex; flex-direction: column; gap: --space-3`.
2. **Toast** — `.toast.toast--{tone}` on the `hp-toast` host. Inverse surface (`--toast-bg`, `--toast-fg`), `--radius-md`, `--shadow-3`, `--space-4` padding, `--space-3` gap, `overflow: hidden`.
3. **Status icon** — first child, `svg.icon` (20 px) in `--toast-icon`: info, check-circle, warning or alert-circle by tone; `aria-hidden="true"`. Tone is never colour alone.
4. **Body** — `.toast__body`: `strong.toast__title` (`--text-label`), `span.toast__text` (`--text-body-sm`), then the optional action.
5. **Action (optional)** — `button.toast__action`: one underlined text button in the text colour, `--target-min` tall.
6. **Dismiss** — `button.close` with the close icon (`icon--sm`), `--target-min` square, always present, `aria-label` from the configured dismiss label ("Dismiss: Time confirmed").
7. **Timer bar (timed toasts only)** — `span.toast__progress`, `--border-width-thick` high, `currentColor` at 40 % opacity, shrinking from full width to zero over the toast's lifetime; paused with the timer.

Host: `hp-toast` is the `.toast` element itself (element selector with the BEM classes on the host); `hp-toast-region` is `display: contents` and its two `div.toast-region` children are the live regions.

## API

### `provideToasts(config)`

| Option | Type | Default | Required | Rule |
|---|---|---|---|---|
| `dismissLabel` | `(heading: string) => string` | — | yes | Builds every dismiss control's `aria-label`: `(h) => \`Dismiss: ${h}\``. Translatable; the component has no copy of its own. |

`provideToasts()` goes in each application's `app.config.ts`. In the browser it creates the overlay and the two regions once, so they exist from load (D-2); on the server it does nothing.

### `ToastService.show(options): ToastRef`

| Option | Type | Default | Required | Rule |
|---|---|---|---|---|
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | no | Sets `.toast--{tone}`, the icon, the region (danger → assertive) and the default lifetime. |
| `heading` | `string` | — | yes | What happened, two to four words: "Time confirmed". Also feeds the dismiss label. |
| `text` | `string` | — | yes | The detail in one sentence: "Nia confirmed Sat 24 Oct at 10:00 am." |
| `actionLabel` | `string` | `undefined` | no | Renders the one action button. Names its result: "View appointment", "Retry", "Undo", "Choose". |
| `persistent` | `boolean` | `false` | no | Keeps an info or success toast until dismissed or acted on (cookie consent, "Details saved locally"). Warning and danger are always persistent (D-4). |
| `key` | `string` | `undefined` | no | A toast shown with the key of a visible toast replaces it in place instead of stacking (a second "Review not posted" after a failed retry). |

Lifetime (D-4): info and success without an action 8 s; with an action 10 s; persistent, warning and danger never time out.

`ToastRef`:

| Member | Type | Rule |
|---|---|---|
| `actioned` | `Observable<void>` | Emits once when this toast's action is activated; the toast then leaves. Never emits for another toast (L2-031). |
| `dismissed` | `Observable<'timeout' \| 'dismiss' \| 'action' \| 'replaced' \| 'evicted'>` | Emits once when the toast leaves, with the reason. |
| `dismiss()` | `() => void` | Removes the toast (for example when the page resolves the failure). |

### `hp-toast` inputs

Used by `hp-toast-region`; applications call the service, not the component.

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | no | Adds `.toast--{tone}` (info included, as in the design-system markup) and picks the icon. |
| `heading` | `string` | — | yes | `.toast__title`. |
| `text` | `string` | — | yes | `.toast__text`. |
| `actionLabel` | `string` | `''` | no | Renders `.toast__action` when not empty. |
| `dismissLabel` | `string` | — | yes | The dismiss control's `aria-label`. |
| `duration` | `number \| null` | `null` | no | Milliseconds until timeout; `null` is persistent and hides the timer bar. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `actioned` | `void` | The action is activated. |
| `dismissed` | `'timeout' \| 'dismiss'` | The timer ends, or the dismiss control or Esc is used. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | Toasts take strings only, so every toast has the same structure and the regions announce plain text. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Info | `.toast--info` | News with no judgement: "Request received", "Review ready". |
| Success | `.toast--success` | The action worked: "Time confirmed", "Details updated". Times out. |
| Warning | `.toast--warning` | Something needs a look but nothing failed: "Time needs a change". Has an action; persistent. |
| Danger | `.toast--danger` | The action failed: "Update could not be sent". Persistent; says the work is safe; offers Retry. |
| With action | `.toast__action` present | One follow-up that names its result. |
| Stacked | several toasts in one region | Up to three per region, newest last (nearest the bottom edge in the polite region). |
| Persistent | no `.toast__progress` | Failures and choices. |

One size: 24rem wide from 640 px; full width minus `--space-4` margins below 640 px.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Entering | inserted | Slides up over `--duration-base` with `--ease-enter` | Region announces heading, text and action label (polite or assertive by tone) |
| Default, timed | 8 s or 10 s remaining | Timer bar shrinking | — |
| Paused | pointer over the toast, focus inside it, or the page hidden | Timer bar stops; time left is kept | — |
| Action or dismiss focused | `:focus-visible` | Focus ring in `--toast-fg` (D-6), timer paused | Control announced by name |
| Leaving | timeout, dismiss, action, replace or evict | `data-state="leaving"`: `fade-out` over `--duration-base` with `--ease-exit`, then removed | Removal not announced |
| Persistent | danger, warning or `persistent` | No timer bar; stays until dismissed or acted on | — |
| Queued | a fourth toast arrives in a region whose three toasts are all persistent | Not shown yet; enters when one leaves (D-5) | Announced when it enters |
| Replaced | `show()` with the key of a visible toast | Content swaps in place; no slide | New text announced |
| Reduced motion | `prefers-reduced-motion: reduce` | Appears and disappears in place (tokens zero `--duration-base`); the timer bar still shrinks (D-7) | — |
| Forced colours | `forced-colors: active` | `CanvasText` border (stylesheet) | — |

## Markup

```html
<!-- rendered: the two regions, created once in the CDK overlay container -->
<div class="cdk-overlay-container">
  <div class="cdk-global-overlay-wrapper" style="z-index: var(--z-toast)">
    <div class="cdk-overlay-pane">
      <hp-toast-region>
        <div class="toast-region" role="status" aria-live="polite">
          <!-- info, success, warning toasts -->
        </div>
        <div class="toast-region toast-region--top" role="alert" aria-live="assertive">
          <!-- danger toasts -->
        </div>
      </hp-toast-region>
    </div>
  </div>
</div>
```

```html
<!-- rendered: success toast with an action, timed -->
<hp-toast class="toast toast--success">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12l3 3 5-6"/></svg>
  <div class="toast__body">
    <strong class="toast__title">Time confirmed</strong>
    <span class="toast__text">Nia confirmed Sat 24 Oct at 10:00 am.</span>
    <button class="toast__action" type="button">View appointment</button>
  </div>
  <button class="close" type="button" aria-label="Dismiss: Time confirmed">
    <svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
  </button>
  <span class="toast__progress" aria-hidden="true"></span>
</hp-toast>
```

```html
<!-- rendered: danger toast in the assertive region (persistent: no timer bar) -->
<hp-toast class="toast toast--danger">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v5M12 16v.01"/></svg>
  <div class="toast__body">
    <strong class="toast__title">Update could not be sent</strong>
    <span class="toast__text">Your request is still saved. Retry when connected.</span>
    <button class="toast__action" type="button">Retry</button>
  </div>
  <button class="close" type="button" aria-label="Dismiss: Update could not be sent">…</button>
</hp-toast>
```

```html
<!-- rendered: leaving -->
<hp-toast class="toast toast--info" data-state="leaving">…</hp-toast>
```

Consumer code:

```ts
// consumer: app.config.ts
providers: [provideToasts({ dismissLabel: (heading) => `Dismiss: ${heading}` })]

// consumer: booking update failed
const ref = this.toasts.show({
  tone: 'danger', key: 'update-HP-1048',
  heading: 'Update could not be sent', text: 'Your request is still saved. Retry when connected.', actionLabel: 'Retry',
});
ref.actioned.subscribe(() => this.retryUpdate('HP-1048'));

// consumer: success with a destination
this.toasts.show({ tone: 'success', heading: 'Time confirmed', text: 'Nia confirmed Sat 24 Oct at 10:00 am.', actionLabel: 'View appointment' })
  .actioned.subscribe(() => this.router.navigate(['/appointments', 'HP-1048']));
```

No toast carries its own `role`; the regions do (design system: never a live role inside a live region). Free to change: the `cdk-*` classes.

## Design

- Region: `position: fixed`; below 640 px `left` and `right` `--space-4`, `bottom: calc(--space-4 + env(safe-area-inset-bottom))`; from 640 px `width: 24rem`, `right` and `bottom` `--space-6`. The assertive region uses `.toast-region--top` (`top: --space-4`, `bottom: auto`). Gap `--space-3`. `pointer-events: none` on the region, `auto` on toasts. `max-height: calc(100dvh - 2 × --space-4)` with `overflow-y: auto` (D-8).
- Toast: padding `--space-4`, gap `--space-3`, `align-items: flex-start`; `--radius-md`; `--shadow-3`; icon nudged down `--space-0-5`.
- Body: column, gap `--space-0-5`; title `--text-label`; text `--text-body-sm`.
- Action: `--text-label`, underlined (`text-underline-offset: 0.15em`), padding `--space-1` block, `min-height: --target-min`, inherits the text colour, start-aligned text that wraps and breaks long words (D-8).
- Dismiss: `--target-min` square, `--radius-sm`, hover fill `color-mix(currentColor 12 %)`.
- Timer bar: `--border-width-thick` high at the bottom edge, `currentColor` at 40 % opacity, `transform: scaleX()` from 1 to 0, linear, over the lifetime; `animation-play-state: paused` while paused.
- Motion: enter `slide-up` over `--duration-base` with `--ease-enter`; leave `fade-out` over `--duration-base` with `--ease-exit`.
- Layer: overlay wrapper `z-index: var(--z-toast)` (above dialogs and their backdrop, below tooltips; dialog D-8).

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--toast-bg` | `--color-bg-inverse` | a calm-surface re-skin (`.toast--raised` in the design-system *Theming* example) |
| `--toast-fg` | `--color-fg-inverse` | the same re-skin; also the focus ring colour (D-6) |
| `--toast-icon` | `--color-info-icon-inverse` | `.toast--success` → `--color-success-icon-inverse`; `.toast--warning` → `--color-warning-icon-inverse`; `.toast--danger` → `--color-danger-icon-inverse` |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Background | `--color-bg-inverse` | `--palette-gray-900` | `--palette-gray-100` |
| Text, action, dismiss, timer bar | `--color-fg-inverse` | `--palette-white` | `--palette-gray-900` |
| Info icon | `--color-info-icon-inverse` | `--palette-plum-300` | `--palette-plum-600` |
| Success icon | `--color-success-icon-inverse` | `--palette-green-300` | `--palette-green-700` |
| Warning icon | `--color-warning-icon-inverse` | `--palette-amber-300` | `--palette-amber-700` |
| Danger icon | `--color-danger-icon-inverse` | `--palette-red-300` | `--palette-red-700` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-inverse` | `--color-bg-inverse` | 4.5:1 | Title, text, action label |
| `--color-info-icon-inverse` | `--color-bg-inverse` | 3:1 | Info icon |
| `--color-success-icon-inverse` | `--color-bg-inverse` | 3:1 | Success icon |
| `--color-warning-icon-inverse` | `--color-bg-inverse` | 3:1 | Warning icon |
| `--color-danger-icon-inverse` | `--color-bg-inverse` | 3:1 | Danger icon |
| `--color-fg-inverse` | `--color-bg-inverse` | 3:1 | Focus ring inside a toast (D-6) |
| `--color-bg-inverse` | `--color-bg-canvas` | 3:1 | Toast edge against the page |

Measured: the shared `--color-focus-ring` reaches only 2.15:1 (light) and 1.92:1 (dark) against `--color-bg-inverse`, which is why the ring inside a toast uses the text colour (D-6). Forced colours: the stylesheet gives `.toast` a `CanvasText` border; the ring maps to `Highlight`.

## Responsive behaviour

- Below 640 px: each region spans the screen width minus `--space-4` on each side, above the safe area; the polite region at the bottom, the assertive region at the top.
- From 640 px: each region docks at the right, 24rem wide, `--space-6` from the bottom (polite) and `--space-4` from the top (assertive).
- Text wraps; nothing truncates. Measured at 320 × 568 px with text at 200 %: one success toast with an action is 550 px tall and its region, anchored 16 px from the bottom, starts 14 px above the viewport, so its heading is cut off; the region's `max-height` and `overflow-y: auto` keep every toast reachable (D-8).
- Toasts never cover the focused element: while the polite region shows toasts, the root's `scroll-padding-bottom` equals its height, so an element focused under it scrolls into view above it (D-10).
- Targets: the action and dismiss are 24 px tall with at least `--space-3` between them (WCAG 2.5.8 minimum); swipe to dismiss is not provided (D-11).
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available.

## Accessibility

### Role and pattern

Two live regions exist from load (D-2): `div.toast-region[role="status"][aria-live="polite"]` for info, success and warning, and `div.toast-region--top[role="alert"][aria-live="assertive"]` for danger ([APG Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)). Toasts are inserted into the right region and never carry their own live role. The regions live inside the CDK overlay container, so an open modal dialog never hides them from assistive technology, and their `aria-live` attributes exempt them from the CDK's `aria-hidden` sweep (dialog D-7).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Reaches the action and the dismiss control in DOM order after the page content; focus inside pauses the timer. While a modal dialog is open, toasts are announced but not reachable until it closes. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activates the action or dismisses. |
| <kbd>Esc</kbd> | With focus inside a toast, dismisses that toast. |

### Focus

- A toast never takes focus when it appears.
- After a toast is dismissed or acted on with focus inside it, focus returns to the element that was focused before focus entered the region; if that element is gone, to the next toast's dismiss control; otherwise to `main` (D-12). An action that navigates leaves focus to the router.
- The focus ring inside a toast is `--focus-ring-width` of `--toast-fg`, offset `--focus-ring-offset` (D-6).

### Labelling

- The heading and text are announced together, followed by the action label.
- The dismiss control is named from the heading ("Dismiss: Time confirmed"); the icon is `aria-hidden`.
- The action names its result ("View appointment", "Retry"), never "View update".

### Announcements

Polite tones are announced when the screen reader is idle; danger interrupts. A replaced toast (same `key`) announces its new text. Removals are silent.

### Motion

Slide-up entry and fade-down exit over `--duration-base`. Under `prefers-reduced-motion: reduce` both are instant; the timer bar keeps shrinking because it shows the time left, not decoration (D-7).

## Content and internationalisation

- Heading: what happened, two to four words: "Time confirmed", "Review posted", "Changes not saved". No "Success!" or "Error!".
- Text: one sentence of detail, who and when: "Nia confirmed Sat 24 Oct at 10:00 am."
- Failures say the work is safe and what to do: "Your words are saved. Please try again." plus "Retry".
- One action at most, naming its result; "Undo" only when the action can really be undone (D-9).
- Dates "Sat 24 Oct", times "10:00 am", emails "maya.chen@example.com" as in the cast.
- Translatable inputs: `heading`, `text`, `actionLabel` and the `dismissLabel` function. Data values: names, dates, references and emails inside the text.
- Long strings wrap within the 24rem toast; nothing truncates.

## Performance

- Change detection: `OnPush` on `hp-toast` and `hp-toast-region`; the region holds toasts in a signal array and renders them with `@for` tracked by id. Timers run outside Angular's change detection and update a signal only when a toast leaves.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Toast.ts` renders one `hp-toast` with `tone="success"`, "Time confirmed", "Nia confirmed Sat 24 Oct at 10:00 am." and "View appointment" in a `.toast-region--inline`; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: `ToastStack` renders the booking-update stack (info "Request received", success "Time confirmed", danger "Update could not be sent").
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: toasts are fixed overlays and never shift page content.
- Weight: `@angular/cdk/overlay` only; composes `svg[hp-icon]`.
- No L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given the app has started, when any page loads, then the overlay container holds a `div.toast-region[role="status"][aria-live="polite"]` and a `div.toast-region.toast-region--top[role="alert"][aria-live="assertive"]`, both empty. (L2-031)
- **AC-2** Given `show({ tone: 'success', heading: 'Time confirmed', text: 'Nia confirmed Sat 24 Oct at 10:00 am.', actionLabel: 'View appointment' })`, when it renders, then the polite region holds an `hp-toast.toast.toast--success` with the check-circle icon, the title, the text, a `.toast__action` "View appointment", a `.close` named "Dismiss: Time confirmed" and a `.toast__progress` bar, and no element inside it has a `role`. (L2-031)
- **AC-3** Given a danger toast "Update could not be sent" with action "Retry", when it renders, then it is in the assertive region, shows the alert-circle icon and has no timer bar. (L2-031)

### States

- **AC-4** Given an info toast "Details saved locally" without an action, when 8 s pass without hover or focus, then it plays the leaving animation, is removed, and `dismissed` emits `'timeout'`. (L2-031)
- **AC-5** Given the success toast "Time confirmed" with "View appointment", when the pointer rests on it at second 6 and leaves at second 20, then it is still shown at second 20 and leaves 4 s after the pointer left. (L2-031)
- **AC-6** Given the success toast "Time confirmed", when focus moves to its "View appointment" action, then the timer and its bar stop until focus leaves the toast. (L2-031)
- **AC-7** Given the danger toast "Review not posted" with "Retry", when 60 s pass, then it is still shown, and when the customer activates "Retry", then that toast's `actioned` emits once, the toast leaves, and the page's retry runs with Maya's review text still in the form. (L2-031)
- **AC-8** Given the stacked booking update (info "Request received", success "Time confirmed" with "View appointment", danger "Update could not be sent" with "Retry"), when the customer activates "Retry", then only the danger toast's `actioned` emits, and the other two toasts stay with their own text. (L2-031)
- **AC-9** Given three timed toasts in the polite region, when a fourth arrives, then the oldest leaves at once with reason `'evicted'` and the region holds three; given three persistent toasts, the fourth waits and enters when one is dismissed. (L2-031)
- **AC-10** Given a visible danger toast with `key: 'update-HP-1048'`, when the retry fails and `show()` is called with the same key, then the toast's content is replaced in place and the region still holds one toast for HP-1048. (L2-031)
- **AC-11** Given no saved cookie preference, when the consent toast "Your privacy choices" with action "Choose" and `persistent: true` shows, then it has no timer bar and stays until the visitor activates "Choose", which opens the cookie preferences dialog, or dismisses it. (L2-034)

### Keyboard and focus

- **AC-12** Given focus on the booking form's "Hair details" field and a new success toast, when the toast appears, then focus stays in "Hair details". (L2-041)
- **AC-13** Given the customer has tabbed from the page into the toast "Time confirmed", when she presses Esc, then the toast is dismissed and focus returns to the element focused before she entered the region. (L2-041)
- **AC-14** Given keyboard focus on a toast's "Retry" action, when the ring shows, then it is a 2 px ring in `--toast-fg` with contrast of at least 3:1 against `--color-bg-inverse` in both themes. (L2-041)

### Screen readers

- **AC-15** Given a screen reader, when the success toast "Time confirmed" appears, then "Time confirmed Nia confirmed Sat 24 Oct at 10:00 am. View appointment" is announced politely, and when the danger toast "Update could not be sent" appears, then it is announced assertively. (L2-041)
- **AC-16** Given the cancel dialog is open and its request succeeds, when the page closes the dialog and shows a success toast, then the toast is announced and is drawn above where the backdrop was; given a toast shows while a dialog stays open, then its region is not `aria-hidden`. (L2-041)

### Theming

- **AC-17** Given the success toast "Time confirmed", when the theme switches to dark, then the toast background is `--color-bg-inverse` grey 100 with grey 900 text and the success icon `--palette-green-700`, and the text contrast is at least 4.5:1 and the icon at least 3:1. (L2-042)

### Responsive

- **AC-18** Given a 360 px viewport, when "Time confirmed" shows, then the polite region spans 328 px at the bottom, 16 px from each side, and given 1280 px, then it is 24rem wide, 24 px from the right and bottom. (L2-042)
- **AC-19** Given a 320 × 568 px viewport with text at 200 %, when "Time confirmed" with "View appointment" shows, then the region is no taller than the viewport minus 32 px, scrolls if needed, and the title, text, action and dismiss control are all reachable. (L2-042)
- **AC-20** Given a 360 px viewport with a toast at the bottom, when keyboard focus moves to the booking form's "Send request" button under it, then the page scrolls so the button is fully visible above the toast. (L2-041)

### Motion

- **AC-21** Given `prefers-reduced-motion: reduce`, when a toast enters and leaves, then it appears and disappears without sliding or fading, and its timer bar still shrinks. (L2-041)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/toast/`; files `toast.ts` (`Toast`, selector `hp-toast`, host classes `toast` and `toast--{tone}`, `[attr.data-state]`), `toast-region.ts` (`ToastRegion`, selector `hp-toast-region`, `display: contents`), `toast.service.ts` (`ToastService`, `ToastRef`), `provide-toasts.ts` (`provideToasts`, `TOAST_CONFIG` token; uses `provideEnvironmentInitializer` and `isPlatformBrowser`). Export all from `public-api.ts`.
- Overlay: `overlay.create({ positionStrategy: overlay.position().global(), hasBackdrop: false, panelClass: 'toast-layer' })`, then `hostElement.style.zIndex = 'var(--z-toast)'` and attach a `ComponentPortal(ToastRegion)`. The `.toast-region` rules keep their own fixed positioning; the pane adds none.
- Styles: port `.toast-region`, `.toast` and parts with `ViewEncapsulation.None` (rendered in the overlay), plus the timer keyframes, the region `max-height` (D-8) and the focus ring colour (D-6). `components.css` gains the last two in the same slice.
- Timers: one per toast, started after the enter animation, paused on `pointerenter` / `focusin` inside the toast and on `visibilitychange` to hidden, resumed with the remaining time; run with `setTimeout` outside the zone.
- Focus return: the region records `relatedTarget` on the first `focusin` from outside; after a keyboard-triggered removal it focuses that element if still connected (D-12).
- Scroll padding (D-10): a `ResizeObserver` on the polite region writes its height plus `--space-4` to `document.documentElement.style.scrollPaddingBottom` and clears it when the region is empty.
- Composes `svg[hp-icon]` (`info`, `check-circle`, `warning`, `alert-circle`, `close`).
- Perf-test scenarios `Toast.ts` and `ToastStack.ts` in `frontend/projects/perf-test/src/scenarios/`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *The mocks show toasts without icons, a "×" dismiss labelled "Dismiss notification", `role="alert"` on a danger toast inside the `role="status"` region, "Undo" on things that cannot be undone (Nia confirming a time), the generic "View update", danger toasts without Retry, and text dimmed to 90 %. Which wins?* The design system, which records each as drift fixed during extraction. Usage lists the corrected copy for every mock.
- **D-2** *When do the live regions exist?* From start-up: `provideToasts()` creates them once in the browser, so the first toast is inserted into an existing region and is announced reliably.
- **D-3** *Where do the regions live, and where do danger toasts appear?* Both in one CDK overlay, the polite region at the bottom and the assertive region at the top (`.toast-region--top`), exactly as the design-system code shows. The overlay keeps them outside the elements an open dialog hides and orders them at `--z-toast`. Two fixed regions cannot share one edge without overlapping, and a single region would need nested live roles, which the design system forbids; so a danger toast appears at the top while news stays at the bottom. The design system's stacked example, which draws all three tones in one documentation stack, shows content, not placement.
- **D-4** *Which toasts time out, and after how long?* Info and success without an action after 8 s; with an action after 10 s (the design system's "at least 10 seconds"); warning, danger and anything marked `persistent` never. The design system names the timing for info and success only and draws no timer bar on warning toasts, and every warning asks for a look or a choice.
- **D-5** *What happens to a fourth toast?* The oldest timed toast in that region leaves at once; persistent toasts are never evicted, because L2-031 requires failures to stay until dismissed or resolved. If all three are persistent, the newcomer waits and enters when one leaves.
- **D-6** *The shared focus ring is `--color-focus-ring`. Measured against the toast's `--color-bg-inverse` it is 2.15:1 in light and 1.92:1 in dark, below the 3:1 L2-041 requires for focus indicators. What does focus look like inside a toast?* The same ring shape in `--toast-fg` (the text colour, 16.7:1 light and 14.6:1 dark). This departs from the design system's "one ring everywhere" rule (needs product confirmation).
- **D-7** *Does the timer bar animate under reduced motion?* Yes. It is a slow linear shrink that conveys how long the toast stays, like the busy spinner that keeps turning; only the entry and exit movement is removed.
- **D-8** *What stops a tall toast from leaving the screen?* Measured at 320 × 568 px with text at 200 %: a single success toast with an action is 550 px tall and its region overflows the top of the viewport by 14 px. The same frame shows the action "View appointment" wider than the toast body and clipped by the toast's `overflow: hidden`. The region gets `max-height: calc(100dvh - 2 × --space-4)` and scrolls, and the title, text and action break long words (`overflow-wrap: anywhere`), so every control stays visible and reachable (L2-042).
- **D-9** *The toast page shows "Undo" on "Review posted", but the feedback pattern says a posted review has nothing to undo. Which is right?* The component offers whatever action the page passes; this CRD's usage follows the feedback pattern and gives "Review posted" no action, because L2-031 requires an Undo to perform exactly that operation and L2-025 records one review per appointment. Whether a posted review can be withdrawn is a product rule (needs product confirmation).
- **D-10** *How does a toast avoid covering the focused element (WCAG 2.4.11)?* Scroll padding: the root's `scroll-padding-bottom` tracks the polite region's height, so focusing an element under the stack scrolls it above. Moving the toasts instead would make them jump while being read.
- **D-11** *Is swipe to dismiss provided?* No. The design system calls it an enhancement; the dismiss control is always there, and a swipe gesture would need a pointer alternative anyway (WCAG 2.5.1).
- **D-12** *Where does focus go after a toast that had focus leaves?* Back to where the customer was before tabbing into the toasts; otherwise the next toast's dismiss control; otherwise `main`. Focus is never lost to the document body.

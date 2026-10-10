# Dialog

| Field | Value |
|---|---|
| Selector | `hp-dialog` (content layout), `hp-dialog-panel` (CDK container), `button[hpDialogClose]` (close directive), `DialogService` (opener) |
| Library path | `frontend/projects/components/src/lib/dialog/` |
| Status | planned |
| Traces to | L2-005, L2-009, L2-011, L2-016, L2-021, L2-022, L2-034, L2-036, L2-041, L2-042 |
| Design system | [`dialog.html`](../../design-system/components/dialog.html) |
| Source mocks | [`dialogs/filter-braiders/default`](../../mocks/dialogs/filter-braiders/default.html), [`dialogs/filter-braiders/busy`](../../mocks/dialogs/filter-braiders/busy.html), [`dialogs/filter-braiders/invalid`](../../mocks/dialogs/filter-braiders/invalid.html), [`dialogs/filter-braiders/failed`](../../mocks/dialogs/filter-braiders/failed.html), [`dialogs/request-review/default`](../../mocks/dialogs/request-review/default.html), [`dialogs/request-review/busy`](../../mocks/dialogs/request-review/busy.html), [`dialogs/request-review/invalid`](../../mocks/dialogs/request-review/invalid.html), [`dialogs/request-review/failed`](../../mocks/dialogs/request-review/failed.html), [`dialogs/cancel-appointment/default`](../../mocks/dialogs/cancel-appointment/default.html), [`dialogs/cancel-appointment/busy`](../../mocks/dialogs/cancel-appointment/busy.html), [`dialogs/cancel-appointment/failed`](../../mocks/dialogs/cancel-appointment/failed.html), [`dialogs/change-appointment/default`](../../mocks/dialogs/change-appointment/default.html), [`dialogs/change-appointment/busy`](../../mocks/dialogs/change-appointment/busy.html), [`dialogs/change-appointment/invalid`](../../mocks/dialogs/change-appointment/invalid.html), [`dialogs/change-appointment/failed`](../../mocks/dialogs/change-appointment/failed.html), [`dialogs/report-review/default`](../../mocks/dialogs/report-review/default.html), [`dialogs/report-review/busy`](../../mocks/dialogs/report-review/busy.html), [`dialogs/report-review/invalid`](../../mocks/dialogs/report-review/invalid.html), [`dialogs/report-review/failed`](../../mocks/dialogs/report-review/failed.html), [`dialogs/sign-out/default`](../../mocks/dialogs/sign-out/default.html), [`dialogs/sign-out/busy`](../../mocks/dialogs/sign-out/busy.html), [`dialogs/cookie-preferences/default`](../../mocks/dialogs/cookie-preferences/default.html), [`dialogs/cookie-preferences/busy`](../../mocks/dialogs/cookie-preferences/busy.html), [`dialogs/cookie-preferences/invalid`](../../mocks/dialogs/cookie-preferences/invalid.html), [`dialogs/cookie-preferences/failed`](../../mocks/dialogs/cookie-preferences/failed.html) |
| Rendering | [`dialog.html`](dialog.html) |

## Purpose and scope

A dialog interrupts the page so the customer can finish one short task or confirm one decision before going on: filter braiders, review a request before Nia receives it, request a change, report a review, cancel request HP-1048, sign out, or choose cookie preferences. Everything behind it waits under a backdrop. It comes in three variants: a **form** dialog that collects one to three values, a **confirmation** dialog that repeats the key facts before an important but safe action, and a **destructive** dialog (`role="alertdialog"`) that confirms a loss with a danger icon and a danger button. Below 640 px every dialog becomes a bottom sheet.

The component is a thin layer over the Angular CDK Dialog (AGENTS.md: never hand-roll a modal). The CDK provides the overlay, focus trap, scroll blocking and focus restoration; this component provides the HairPop panel, header, body and footer, the variant rules, the busy guard and the bottom sheet.

Use something else when:

- the task needs more than one short screen (booking a request is a page, not a dialog);
- the customer only needs to know an outcome: use a [toast](toast.md);
- the information needs no decision and belongs to the page: use an [alert](alert.md);
- one trigger offers several actions: use a [menu](menu.md);
- an icon-only control needs a visible name: use a [tooltip](tooltip.md).

Out of scope:

- The fields, their validation and the error-summary content. The page's dialog component owns its form (a [form layout](form-layout.md)); the dialog only provides the body and keeps focus inside it. The form layout renders the error summary as an [alert](alert.md) with `.form-summary`.
- What the confirm does, its request and its retry. The consumer sets `busy`, swaps the label to "Try again" after a failure and closes the dialog on success.
- The success toast after a dialog closes ("Change request sent to Nia"). The page shows it through the toast service.
- Footer button behaviour. Footer actions and the close control are [buttons](button.md) (`button[hp-button]`); the dialog never redefines their look, busy state or activation.
- Which dialogs exist and when they open. The page decides; the dialog only guarantees that a second dialog replaces the first (D-11).

## Usage

Every dialog in `docs/mocks/dialogs/`, grouped by configuration. The mocks follow the design system (D-1): ARIA on `.dialog__panel`, the close icon in a tooltip wrapper, a safe-action button that closes, a busy confirm that keeps its label, no warning stacked on a danger dialog, and `role="alertdialog"` with a danger chip on destructive dialogs.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/filter-braiders` (from `pages/matching-braiders` "Filters") | form, md, close control | heading "Filter braiders"; description "Choose the travel distance and price range that work for you."; body: "Maximum price" ($ addon, 150 in the mock), "Distance from Toronto" ("10 km"); footer: secondary "Clear filters", primary "Show braiders" | default; busy (busy label "Finding braiders…"); invalid (summary "Check the highlighted field" linking to "Enter a price of at least $160 for this style."); failed (danger alert "We couldn’t save this change." / "Your details remain here. Please try again.", confirm "Try again") | raised panel over backdrop |
| `dialogs/request-review` (from `pages/booking-request` "Review request") | confirmation, md, info chip, close control | heading "Review request"; description "Check your details before Nia receives your request."; body: description list Service "Medium knotless braids", Preferred time "Sat 24 Oct · 10:00 am", Estimate "$180–$240 · about 5 hours"; footer: secondary "Edit details", primary "Send request" | default; busy ("Sending your request…"); invalid (summary "Choose an offered time."); failed (danger alert, confirm "Try again") | raised |
| `dialogs/cancel-appointment` (from `pages/appointment-detail` "Cancel request") | destructive, sm, danger chip (alert-circle), no close control | heading "Cancel request HP-1048?"; description "Nia will see that you no longer need Sat 24 Oct at 10:00 am. You can send a new request later."; no body; footer: secondary "Keep request" (initial focus), danger "Cancel request" | default; busy ("Cancelling your request…"); failed (danger alert "We couldn’t cancel this request." / "Your request is unchanged. Check your connection and try again.", confirm "Try again") | raised |
| `dialogs/change-appointment` (from `pages/appointment-detail` "Request a change") | form, md, close control | heading "Request a change"; description "Tell Nia which new time works for you."; body: "New preferred time" ("Sun 25 Oct, 11:00 am"); footer: secondary "Keep current time", primary "Send change request" | default; busy ("Sending your change request…"); invalid ("Enter a time Nia has offered."); failed | raised |
| `dialogs/report-review` (from `pages/braider-profile` review "Report") | form, md, close control | heading "Report a review"; description "Tell us why this review needs a closer look."; body: "Reason" ("Inaccurate service details"); footer: secondary "Keep browsing", primary "Send report" | default; busy ("Sending your report…"); invalid ("Tell us what needs review."); failed | raised |
| `dialogs/sign-out` (from the account menu or `pages/account-settings`) | destructive, sm, danger chip with the log-out icon (projected), no close control | heading "Sign out?"; description "You can return to browse styles at any time."; no body; footer: secondary "Stay signed in" (initial focus), danger "Sign out" | default; busy ("Signing you out…") | raised |
| `dialogs/cookie-preferences` (from the cookie consent toast "Choose" and the footer) | form, lg, close control | heading "Cookie preferences"; description "Choose whether HairPop may remember optional usage information."; body: checkbox "Remember my optional usage choices"; footer: secondary "Keep browsing", primary "Save preferences" | default; busy ("Saving your preferences…"); invalid; failed (selection kept, never claims saved) | raised |
| Every dialog below 640 px | bottom sheet | same content; footer buttons stretch and wrap with the confirm first | all of the above | raised sheet |

Every row is buildable with the API below: `DialogService.open()` with `variant` and `size`, an `hp-dialog` with `heading`, `description`, `closeLabel`, `busy` and `busyLabel`, the `[slot=icon]`, default and `[slot=footer]` slots, and `hpDialogClose` on the safe action.

## Anatomy

1. **Backdrop** — `.backdrop` on the CDK backdrop element. `--color-bg-backdrop` scrim at `--z-overlay`; fades in. The page behind is `inert` and hidden from assistive technology.
2. **Positioning layer** — `.dialog` on the CDK overlay pane. Fixed, full viewport, at `--z-modal`; places the panel at the bottom centre below 640 px and in the centre with `--space-6` around it from 640 px.
3. **Panel** — `.dialog__panel` (plus `.dialog__panel--sm` or `.dialog__panel--lg`) on the CDK dialog container element `hp-dialog-panel`. Carries `role`, `aria-modal`, `aria-labelledby` and `aria-describedby`. `--dialog-bg` surface, `--shadow-4`, `--radius-lg` (centred) or `--radius-xl` top corners (sheet), width capped by `--dialog-width`, height capped at the viewport minus `--space-12`, scrolls when taller.
4. **Header** — `.dialog__header`: optional icon chip, then the title block, then the close control.
5. **Icon chip (confirmation and destructive only)** — `.dialog__icon.dialog__icon--info` or `.dialog__icon--danger`, a `--control-height-md` circle holding one decorative `svg.icon`.
6. **Title** — `h2.dialog__title`, `--text-h3`. The accessible name.
7. **Description** — `p.text-muted` under the title. The accessible description.
8. **Close control (form and confirmation only)** — a ghost icon-only [button](button.md) "Close dialog" inside a [tooltip](tooltip.md) wrapper; does what Esc does.
9. **Body** — `.dialog__body.stack`: fields, a description list, an error summary or a failure alert; `--space-4` × `--space-6` padding. Hidden when empty (destructive dialogs usually have none).
10. **Footer** — `.dialog__footer`: the safe action, then the confirm; sticky at the bottom of the panel with a `--color-border-default` top divider.
11. **Busy status** — a visually hidden `p.sr-only[role="status"]` at the end of the panel that announces `busyLabel` while busy.

Host: the CDK creates the backdrop, the pane and the container. `DialogService` gives the backdrop the class `backdrop`, the pane the class `dialog`, and uses `hp-dialog-panel` (a `CdkDialogContainer` subclass) as the container, so `.dialog__panel` and the ARIA attributes sit on the CDK container itself (D-2). Inside it, the consumer's dialog component and `hp-dialog` are `display: contents`, so the header, body and footer are the panel's direct flex items, exactly as in the design-system markup.

## API

### `DialogService.open(component, options)`

| Option | Type | Default | Required | Rule |
|---|---|---|---|---|
| `variant` | `'form' \| 'confirmation' \| 'destructive'` | `'form'` | no | Sets the container `role` (`alertdialog` for destructive, otherwise `dialog`), the icon chip (none, info, danger), whether the close control renders (not for destructive) and whether a backdrop click closes (not for destructive). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` for destructive, otherwise `'md'` | no | Adds `.dialog__panel--sm` (24rem) or `.dialog__panel--lg` (48rem); md adds no modifier (32rem). |
| `data` | `D` | `undefined` | no | Passed to the consumer component through the CDK `DIALOG_DATA` token. |
| `returnFocusTo` | `HTMLElement \| string` | the element focused when `open()` ran | no | Where focus goes on close. Pass a selector when the trigger will not exist after success (D-12). |

Returns the CDK `DialogRef<R, C>`. `closed` emits the result passed to `hpDialogClose` or `close(result)`, or `undefined` when dismissed by Esc, the close control or the backdrop.

Fixed configuration the service always passes to the CDK (not inputs): `ariaModal: true`, `hasBackdrop: true`, `backdropClass: 'backdrop'`, `panelClass: 'dialog'`, `container: DialogPanel`, `disableClose: true` (the component handles Esc and backdrop itself so busy can block them), `autoFocus` (D-5), `restoreFocus`, `closeOnNavigation: true`, `ariaLabelledBy` and `ariaDescribedBy` set to ids the service generates and `hp-dialog` stamps on the title and description.

### `hp-dialog` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `heading` | `string` | — | yes | Rendered in `h2.dialog__title` with the generated title id; the accessible name. |
| `description` | `string` | — | yes | Rendered in `p.text-muted` with the generated description id; the accessible description. Every dialog states its consequence in one sentence (design-system *Content*). |
| `closeLabel` | `string` | `''` | yes for form and confirmation | The close control's `aria-label` and tooltip text ("Close dialog"). A form or confirmation dialog without it logs a development-mode console error naming `hp-dialog` (D-10). Ignored for destructive dialogs. |
| `busy` | `boolean` (`booleanAttribute`) | `false` | no | While true, Esc, the close control, a backdrop click and every `hpDialogClose` are ignored, and `busyLabel` is announced. Mirror it on the confirm button's own `busy` input. |
| `busyLabel` | `string` | `''` | yes when `busy` is ever true | Announced once through the busy status region when `busy` becomes true ("Cancelling your request…"). Never shown visually. A busy dialog with an empty `busyLabel` logs a development-mode console error. |

- Inputs are signal inputs; booleans accept bare attributes. The variant and ids come from the injected dialog configuration, never from inputs, so the role and the ARIA references can never disagree with the container.
- Every user-facing string is an input or projected content; the component renders no copy of its own.

### `hpDialogClose` directive

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `hpDialogClose` | `R \| ''` | `''` (dismiss) | no | On `click`, closes the enclosing dialog with this result unless the dialog is busy. Used on the safe action (`<button hp-button hpDialogClose>Keep request</button>`). |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None on `hp-dialog` | — | Closing is observed through `DialogRef.closed`; the confirm is an ordinary button whose `(click)` the consumer handles. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `[slot=icon]` | One `<svg class="icon" aria-hidden="true">` | Replaces the variant's default chip icon (info for confirmation, alert-circle for destructive): the sign-out dialog projects log-out. Ignored for form dialogs. |
| default | Body content: fields, a `<form>`, a description list, an [alert](alert.md) | Projected into `.dialog__body`. The body is hidden when nothing is projected. |
| `[slot=footer]` | Two `button[hp-button]`: the safe action first, the confirm second | Projected into `.dialog__footer` in DOM order. A form dialog's confirm is `type="submit"` with `form` pointing at the body's form (D-6). |

Each slot is declared once in the template (AGENTS.md).

## Variants and sizes

| Variant | Modifier / attribute | Use for |
|---|---|---|
| Form | `role="dialog"`, no chip, close control | Collect one to three values and apply them: "Filter braiders", "Request a change", "Report a review", "Cookie preferences". |
| Confirmation | `role="dialog"`, `.dialog__icon--info` chip, close control | Check details before an important, safe action: "Review request". |
| Destructive | `role="alertdialog"`, `.dialog__icon--danger` chip, no close control, danger confirm | Confirm a loss: "Cancel request HP-1048?", "Sign out?". |

| Size | Modifier | Max width (`--dialog-width`) | Use for |
|---|---|---|---|
| sm | `.dialog__panel--sm` | 24rem (384 px) | Destructive and yes/no confirmations. |
| md | — | 32rem (512 px) | Form dialogs with one to three fields; the confirmation dialog. |
| lg | `.dialog__panel--lg` | 48rem (768 px) | Reading-heavy content: cookie preferences. |

The panel is always the full viewport width below 640 px (bottom sheet); the size only caps it from 640 px.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Opening | `DialogService.open()` | Backdrop fades in over `--duration-base`; panel scales in (centred) or slides up (sheet) over `--duration-slow` with `--ease-enter` | Page behind gets `aria-hidden="true"` and `inert`; focus moves to the initial element (D-5) |
| Default | open, idle | Header, body, footer as configured | Announced as dialog or alert dialog with its title and description |
| Focus | focus on any control | Shared `:focus-visible` ring on that control; focus never leaves the panel | Tab and Shift+Tab wrap inside the panel |
| Busy | `busy` true (with the confirm's own `busy`) | Confirm shows its spinner and keeps its label; nothing else changes | `busyLabel` announced through the panel's status region; Esc, close control, backdrop and `hpDialogClose` ignored; focus stays on the confirm |
| Invalid | the body's form ([form layout](form-layout.md)) renders its error summary, an [alert](alert.md) with `.form-summary`, first in the form, and marks fields `aria-invalid` | Danger summary at the top of the body; field messages under the fields | Summary takes focus and is announced; each field is described by its message; entered values stay |
| Failed | consumer renders a danger [alert](alert.md) with `announce` first in the body and relabels the confirm "Try again" | Danger alert at the top of the body; values kept | Alert announced; focus stays on the confirm |
| Disabled confirm | — | Not used: the confirm stays enabled and explains on activation (design-system *States*) | — |
| Closing | Esc, close control, backdrop (form and confirmation), `hpDialogClose`, or the consumer's `close()` | Panel and backdrop removed at once (no exit animation) | `aria-hidden` and `inert` removed; focus returns to `returnFocusTo` |
| Bottom sheet | viewport below `--layout-breakpoint-sm` (640 px) | Full width at the bottom, `--radius-xl` top corners, slides up, bottom padding `env(safe-area-inset-bottom)`; footer buttons stretch and wrap with the confirm first | Same semantics |
| Tall content | content taller than the viewport minus 48 px, or text enlarged to 200 % | Panel scrolls; footer stays pinned (`position: sticky`) | Same semantics |
| Reduced motion | `prefers-reduced-motion: reduce` | Backdrop and panel appear instantly (the tokens zero the durations) | — |
| Forced colours | `forced-colors: active` | Panel keeps a `CanvasText` border so its edge shows without the shadow (D-9) | — |

## Markup

Rendered DOM. Classes and attributes are the e2e contract; CDK class names (`cdk-*`) are present but free to change with the CDK version.

```html
<!-- rendered: destructive (cancel appointment), default -->
<div class="cdk-overlay-container">
  <div class="cdk-overlay-backdrop backdrop cdk-overlay-backdrop-showing"></div>
  <div class="cdk-global-overlay-wrapper">
    <div class="cdk-overlay-pane dialog">
      <hp-dialog-panel class="cdk-dialog-container dialog__panel dialog__panel--sm" id="hp-dialog-1" tabindex="-1"
          role="alertdialog" aria-modal="true" aria-labelledby="hp-dialog-1-title" aria-describedby="hp-dialog-1-desc">
        <app-cancel-request-dialog>
          <hp-dialog>
            <div class="dialog__header">
              <span class="dialog__icon dialog__icon--danger"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v5M12 16v.01"/></svg></span>
              <div>
                <h2 class="dialog__title" id="hp-dialog-1-title">Cancel request HP-1048?</h2>
                <p class="text-muted" id="hp-dialog-1-desc">Nia will see that you no longer need Sat 24 Oct at 10:00 am. You can send a new request later.</p>
              </div>
            </div>
            <div class="dialog__body stack"></div>
            <div class="dialog__footer">
              <button class="btn" type="button">Keep request</button>
              <button class="btn btn--danger" type="button">Cancel request</button>
            </div>
            <p class="sr-only" role="status"></p>
          </hp-dialog>
        </app-cancel-request-dialog>
      </hp-dialog-panel>
    </div>
  </div>
</div>
```

```html
<!-- rendered: form dialog (filter braiders), header and body; the panel is md so it has no size modifier -->
<hp-dialog-panel class="cdk-dialog-container dialog__panel" role="dialog" aria-modal="true" aria-labelledby="hp-dialog-2-title" aria-describedby="hp-dialog-2-desc" …>
  <div class="dialog__header">
    <div>
      <h2 class="dialog__title" id="hp-dialog-2-title">Filter braiders</h2>
      <p class="text-muted" id="hp-dialog-2-desc">Choose the travel distance and price range that work for you.</p>
    </div>
    <hp-tooltip class="has-tooltip">
      <button class="btn btn--ghost btn--icon" type="button" aria-label="Close dialog">
        <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </hp-tooltip>
  </div>
  <div class="dialog__body stack">
    <form id="filter-braiders-form" class="stack" novalidate>
      <div class="field"><label class="field__label" for="price">Maximum price</label><div class="input-group"><span class="addon">$</span><input class="input" id="price" type="number" value="150"></div></div>
      <div class="field"><label class="field__label" for="distance">Distance from Toronto</label><input class="input" id="distance" type="text" value="10 km"></div>
    </form>
  </div>
  <div class="dialog__footer">
    <button class="btn" type="button">Clear filters</button>
    <button class="btn btn--primary" type="submit" form="filter-braiders-form">Show braiders</button>
  </div>
  <p class="sr-only" role="status"></p>
</hp-dialog-panel>
```

```html
<!-- rendered: confirmation (review request); info chip, description list body -->
<div class="dialog__header">
  <span class="dialog__icon dialog__icon--info"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 7.5v.01"/></svg></span>
  <div><h2 class="dialog__title" id="hp-dialog-3-title">Review request</h2><p class="text-muted" id="hp-dialog-3-desc">Check your details before Nia receives your request.</p></div>
  <hp-tooltip class="has-tooltip"><button class="btn btn--ghost btn--icon" type="button" aria-label="Close dialog">…</button></hp-tooltip>
</div>
<div class="dialog__body stack"><dl class="dl"><dt>Service</dt><dd>Medium knotless braids</dd><dt>Preferred time</dt><dd>Sat 24 Oct · 10:00 am</dd><dt>Estimate</dt><dd>$180–$240 · about 5 hours</dd></dl></div>
<div class="dialog__footer"><button class="btn" type="button">Edit details</button><button class="btn btn--primary" type="button">Send request</button></div>
```

```html
<!-- rendered: busy (cancel appointment) — the confirm keeps its label; the status region announces -->
<div class="dialog__footer">
  <button class="btn" type="button">Keep request</button>
  <button class="btn btn--danger" type="button" aria-busy="true">Cancel request</button>
</div>
<p class="sr-only" role="status">Cancelling your request…</p>
```

```html
<!-- rendered: invalid (filter braiders) — the form layout's summary first, then the invalid field -->
<div class="dialog__body stack">
  <form id="filter-braiders-form" class="stack" novalidate>
    <hp-alert class="alert alert--danger form-summary" tabindex="-1" role="group" aria-labelledby="hp-form-2-summary-title">…<strong id="hp-form-2-summary-title">Check 1 field</strong><ul><li><a href="#price">Maximum price: Enter a price of at least $160 for this style.</a></li></ul>…</hp-alert>
    <div class="field"><label class="field__label" for="price">Maximum price</label><div class="input-group"><span class="addon">$</span><input class="input" id="price" type="number" value="150" aria-invalid="true" aria-describedby="price-error"></div><span class="field__error" id="price-error">Enter a price of at least $160 for this style.</span></div>
    …
  </form>
</div>
```

```html
<!-- rendered: failed (cancel appointment) — danger alert in the body, confirm relabelled -->
<div class="dialog__body stack">
  <hp-alert class="alert alert--danger" role="alert">…<p class="alert__title">We couldn’t cancel this request.</p><p>Your request is unchanged. Check your connection and try again.</p>…</hp-alert>
</div>
<div class="dialog__footer"><button class="btn" type="button">Keep request</button><button class="btn btn--danger" type="button">Try again</button></div>
```

Consumer templates:

```html
<!-- consumer: page opens the destructive dialog -->
<button hp-button variant="link" (click)="openCancel()">Cancel request</button>
```

```ts
// consumer: page component
openCancel() {
  this.dialogs.open(CancelRequestDialog, { variant: 'destructive', data: { reference: 'HP-1048' } })
    .closed.subscribe((result) => { if (result === 'cancelled') this.toasts.show({ tone: 'success', heading: 'Request cancelled', text: 'Nia has been told you no longer need Sat 24 Oct.' }); });
}
```

```html
<!-- consumer: CancelRequestDialog template -->
<hp-dialog heading="Cancel request HP-1048?" description="Nia will see that you no longer need Sat 24 Oct at 10:00 am. You can send a new request later."
           [busy]="cancelling()" busyLabel="Cancelling your request…">
  @if (failed()) {
    <hp-alert tone="danger" announce heading="We couldn’t cancel this request."><p>Your request is unchanged. Check your connection and try again.</p></hp-alert>
  }
  <button hp-button slot="footer" hpDialogClose>Keep request</button>
  <button hp-button slot="footer" variant="danger" [busy]="cancelling()" (click)="cancel()">{{ failed() ? 'Try again' : 'Cancel request' }}</button>
</hp-dialog>
```

```html
<!-- consumer: FilterBraidersDialog template (form dialog) -->
<hp-dialog heading="Filter braiders" description="Choose the travel distance and price range that work for you."
           closeLabel="Close dialog" [busy]="applying()" busyLabel="Finding braiders…">
  <!-- the form-layout component renders its own error summary (an hp-alert with .form-summary) as its first child -->
  <form hp-form-layout id="filter-braiders-form" (submitted)="apply()">…</form>
  <button hp-button slot="footer" (click)="clear()">Clear filters</button>
  <button hp-button slot="footer" variant="primary" type="submit" form="filter-braiders-form" [busy]="applying()">Show braiders</button>
</hp-dialog>
```

```html
<!-- consumer: SignOutDialog projects its own chip icon -->
<hp-dialog heading="Sign out?" description="You can return to browse styles at any time." [busy]="signingOut()" busyLabel="Signing you out…">
  <svg slot="icon" class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/></svg>
  <button hp-button slot="footer" hpDialogClose>Stay signed in</button>
  <button hp-button slot="footer" variant="danger" [busy]="signingOut()" (click)="signOut()">Sign out</button>
</hp-dialog>
```

Free to change: the `cdk-*` classes, the generated id format, and whether the busy status `<p>` sits before or after the footer, as long as it is inside the panel.

## Design

- Layers: backdrop `--z-overlay`; positioning layer and panel `--z-modal`. The service sets the overlay wrapper's and backdrop's `z-index` to these tokens so menus (`--z-dropdown`), toasts (`--z-toast`) and tooltips (`--z-tooltip`) inside the same CDK overlay container stack as the design system orders them (D-8).
- Panel: width 100 % up to `--dialog-width`; `max-height: calc(100dvh - var(--space-12))`; `overflow: auto`; flex column; `--dialog-bg` background; `--color-fg-default` text; `--shadow-4`.
- Shape: `--radius-lg` centred; `--radius-xl` top corners as a sheet.
- Spacing: header `--space-6` on top and sides with `--space-4` gap; body `--space-4` × `--space-6`; footer `--space-4` top and `--space-6` sides and bottom, buttons `--space-3` apart; positioning layer padding `--space-6` from 640 px, 0 below.
- Close control: pulled out by `--space-2` on top and end (`.dialog__header .btn--icon`) so its 40 px box aligns to the panel padding.
- Icon chip: `--control-height-md` circle (`--radius-full`), `--color-danger-bg` with `--color-danger-icon`, or `--color-info-bg` with `--color-info-icon`.
- Typography: title `--text-h3` with `--letter-spacing-normal`; description `--text-body` in `--color-fg-muted`.
- Footer: `--border-width-hairline` top border in `--color-border-default`; `position: sticky; bottom: 0` on `--dialog-bg`; `flex-wrap: wrap-reverse`; buttons `flex: 1 1 auto` below 640 px and `flex: none` from 640 px.
- Motion: backdrop `fade-in` over `--duration-base` with `--ease-enter`; panel `scale-in` (centred) or `slide-up` (sheet) over `--duration-slow` with `--ease-enter`; no exit animation (D-13).

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--dialog-width` | 32rem | `.dialog__panel--sm` → 24rem; `.dialog__panel--lg` → 48rem; a page rule that sets `--dialog-width` (for example 40rem) on a class the page adds to the pane |
| `--dialog-bg` | `--color-bg-surface-raised` | a surface re-skin; also paints the sticky footer |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Backdrop | `--color-bg-backdrop` | near-black at 55 % opacity | black at 65 % opacity |
| Panel and footer background | `--color-bg-surface-raised` | `--palette-white` | `--palette-gray-800` |
| Title and body text | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Description | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Footer divider | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Danger chip background / icon | `--color-danger-bg` / `--color-danger-icon` | `--palette-red-50` / `--palette-red-500` | `--palette-red-950` / `--palette-red-300` |
| Info chip background / icon | `--color-info-bg` / `--color-info-icon` | `--palette-plum-50` / `--palette-plum-600` | `--palette-plum-950` / `--palette-plum-300` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

The rendering shows the live resolved value of each token in both themes. In dark the panel (grey 800) is lighter than the grey 900 surface it covers, so it reads as raised under the darker scrim.

Contrast pairs the component relies on, from `tokens/contrast-pairs.json` and the design-system page, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Title and body |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Description |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Input and secondary-button borders in the body and footer |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus ring in the dialog |
| `--color-danger-solid` | `--color-bg-surface-raised` | 3:1 | Danger confirm edge |
| `--color-fg-on-danger` | `--color-danger-solid` | 4.5:1 | Danger confirm label |
| `--color-danger-icon` | `--color-danger-bg` | 3:1 | Danger chip icon |
| `--color-info-icon` | `--color-info-bg` | 3:1 | Info chip icon |

Forced colours: the shadow disappears, so the panel gets a `--border-width-hairline` `CanvasText` border (D-9); buttons and inputs already get theirs from the stylesheet; the focus ring maps to `Highlight`.

## Responsive behaviour

- Below `--layout-breakpoint-sm` (640 px): bottom sheet. The panel spans the viewport width, sits at the bottom, has `--radius-xl` top corners, slides up, and pads its bottom by `env(safe-area-inset-bottom)`. Footer buttons stretch to share the row and wrap with `wrap-reverse`, so the confirm is first (top) and the safe action below it; measured at 320 and 360 px, "Send change request" and "Keep current time" each take a full row and nothing overflows.
- From 640 px: centred with `--space-6` around it, `--radius-lg` corners, scales in; footer buttons keep their natural width, right-aligned, safe action left of the confirm.
- The panel never exceeds the viewport height minus 48 px; the body scrolls and the footer stays pinned. Measured at 360 × 640 with text at 200 %: the panel is 544 px tall, its content scrolls inside it and both footer buttons stay reachable.
- With text enlarged to 200 % the footer labels are wider than a 360 px panel; they wrap inside the buttons as the [button CRD](button.md) requires (button D-5) instead of overflowing the panel, as the first extracted `white-space: nowrap` did (measured: "Send change request" 395 px wide in a 360 px panel).
- The breakpoint is the design system's 640 px (`--layout-breakpoint-sm`), not L2-042's 576 px XS boundary; between 576 and 639 px the sheet layout still applies (D-14).
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; the close control is 40 × 40 px and footer buttons 40 px tall and full width on phones.

## Accessibility

### Role and pattern

[APG Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) on the Angular CDK Dialog: `role="dialog"`, or `role="alertdialog"` for destructive confirmations, `aria-modal="true"`, `aria-labelledby` the title and `aria-describedby` the description, all on `.dialog__panel`. The page behind is hidden from assistive technology (`aria-hidden="true"`, set by the CDK on every sibling of the overlay container except live regions) and made `inert` by the service on the same elements (D-7). The application root is one of those siblings, so while any dialog is open the whole application, including the skip link and the top bar, can be neither focused nor reached by a virtual cursor ([skip link](skip-link.md) D-5 relies on this).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the dialog's controls and wraps; focus never leaves the panel. |
| <kbd>Esc</kbd> | Closes the dialog like the close control, in every variant, unless it is busy. When a tooltip or menu inside the dialog is open, the first Esc closes that instead. |
| <kbd>Enter</kbd> | In a text field of a form dialog, submits the form (the confirm is its submit button, D-6). Never confirms a destructive dialog: its confirm is not a submit button and initial focus is on the safe action. |

### Focus

- On open, focus moves to the first enabled field in the body; if the body has none (destructive, confirmation), to the first footer button, which is the safe action ("Keep request", "Stay signed in", "Edit details") (D-5).
- On an invalid submit, the error summary takes focus (form layout CRD); focus stays trapped in the panel.
- While busy, focus stays on the confirm; after a failure it is still there, now labelled "Try again".
- On close, focus returns to `returnFocusTo`: by default the control that opened the dialog ("Cancel request" on the appointment card).
- The panel itself has `tabindex="-1"` (CDK) and is focused only when nothing inside can be.

### Labelling

- Name: the title. Description: the sentence under it. The icon chip's SVG is `aria-hidden="true"`.
- The close control is named by `closeLabel` ("Close dialog") and shows the same words in its tooltip.
- The heading is an `h2`: the dialog is a new context above the page's `h1`.

### Announcements

- Opening: screen readers announce the role, title and description from the ARIA references.
- Busy: the panel's `p.sr-only[role="status"]` exists from open and receives `busyLabel` when `busy` becomes true, so "Cancelling your request…" is announced politely; it is cleared when busy ends.
- Invalid and failed: the [alert](alert.md) the consumer renders announces itself (`role="alert"`).

### Motion

The backdrop fades and the panel scales in or slides up. Under `prefers-reduced-motion: reduce` the tokens zero `--duration-base` and `--duration-slow`, so both appear instantly. Nothing loops; the busy spinner belongs to the button and keeps turning.

## Content and internationalisation

- Title: the task as a noun phrase ("Filter braiders", "Request a change") or the decision as a question ("Cancel request HP-1048?", "Sign out?").
- Description: one sentence on the consequence, naming people and times: "Nia will see that you no longer need Sat 24 Oct at 10:00 am."
- Confirm: a verb phrase naming the result: "Show braiders", "Send change request", "Cancel request", never "OK" or "Confirm". After a failure: "Try again".
- Safe action: what staying means: "Keep request", "Keep current time", "Stay signed in", "Keep browsing"; never "Cancel" beside "Cancel request".
- Busy label: what is happening, ending in an ellipsis: "Cancelling your request…", never "Working…".
- Failure: what did not happen and that entries are kept: "We couldn’t cancel this request. Your request is unchanged."
- Dates and times follow the cast format: "Sat 24 Oct at 10:00 am", "Sun 25 Oct, 11:00 am"; prices "$180–$240".
- Translatable inputs: `heading`, `description`, `closeLabel`, `busyLabel`, and every projected label. Data values: the request reference "HP-1048", the braider's first name, dates, prices.
- Long strings wrap: the title and description wrap within the header; nothing truncates.

## Performance

- Change detection: `OnPush` on `hp-dialog` and `hp-dialog-panel`; signal inputs; ids and the variant are read once from the injected configuration.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Dialog.ts` renders `hp-dialog` for the cancel-appointment dialog ("Cancel request HP-1048?", "Keep request", "Cancel request") in the `.dialog--inline` documentation frame, without opening a CDK overlay, so the measurement is the component's own render; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: `DialogFooter` renders the filter-braiders footer (two `button[hp-button]` in `.dialog__footer`), which every dialog repeats.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: the busy state changes no dimension (the button keeps its label); the failure alert pushes the body down inside the panel, never the page.
- Weight: `@angular/cdk/dialog`, `@angular/cdk/overlay` and `@angular/cdk/a11y` only; composes the button, tooltip and icon components. No router import.
- No L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given the filter braiders dialog opened with `variant: 'form'`, when it renders, then `.dialog__panel` has `role="dialog"`, `aria-modal="true"`, an `aria-labelledby` pointing at the `h2.dialog__title` "Filter braiders" and an `aria-describedby` pointing at "Choose the travel distance and price range that work for you.", and a `.backdrop` covers the page. (L2-041)
- **AC-2** Given the cancel dialog for request HP-1048 opened with `variant: 'destructive'`, when it renders, then `.dialog__panel.dialog__panel--sm` has `role="alertdialog"`, the header shows a `.dialog__icon--danger` chip, the title "Cancel request HP-1048?" and the description naming Sat 24 Oct at 10:00 am, and there is no close control. (L2-022)
- **AC-3** Given the review request dialog opened with `variant: 'confirmation'`, when it renders, then the header shows a `.dialog__icon--info` chip, the body lists Service "Medium knotless braids", Preferred time "Sat 24 Oct · 10:00 am" and Estimate "$180–$240 · about 5 hours", and the footer holds "Edit details" then "Send request". (L2-016)
- **AC-4** Given the cookie preferences dialog opened with `size: 'lg'` at 1280 px, when it renders, then the panel has `.dialog__panel--lg`, is at most 768 px wide and is centred with `--radius-lg` corners. (L2-042)
- **AC-5** Given a form dialog with `closeLabel="Close dialog"`, when it renders, then the header ends with `button.btn.btn--ghost.btn--icon` named "Close dialog" inside `hp-tooltip.has-tooltip`, holding the close icon and no "×" text. (L2-041)

### States

- **AC-6** Given the cancel dialog with "Cancel request" activated and `busy` true, when the customer presses Esc, activates "Keep request" or clicks the backdrop, then the dialog stays open, the confirm keeps `aria-busy="true"` and its label "Cancel request", and focus stays on it. (L2-036)
- **AC-7** Given the filter braiders dialog with "Show braiders" pending, when the confirm is activated again, then no second request starts and the entered maximum price "150" and distance "10 km" remain in their fields. (L2-005)
- **AC-8** Given the change dialog, when `busy` becomes true with `busyLabel` "Sending your change request…", then the panel's `role="status"` region contains that text and a screen reader announces it once. (L2-036)
- **AC-9** Given the filter braiders dialog submitted with a maximum price of $150, when the form marks it invalid, then the error summary is the first element in `.dialog__body`, takes focus while focus stays trapped in the panel, links to the price field, the field has `aria-invalid="true"` described by "Enter a price of at least $160 for this style.", and both entered values remain. (L2-005)
- **AC-10** Given the report review dialog submitted with a blank reason, when the page marks it invalid, then focus stays inside the panel on the summary and the "Reason" field is identified with "Tell us what needs review." while the dialog stays open. (L2-009)
- **AC-11** Given the change dialog with "Sun 25 Oct, 11:00 am" entered, when the page reports the time is no longer offered, then the dialog stays open, the field keeps "Sun 25 Oct, 11:00 am" and shows "Enter a time Nia has offered." (L2-021)
- **AC-12** Given the cancel dialog whose request failed, when the failure renders, then a danger alert "We couldn’t cancel this request." is the first child of `.dialog__body`, the confirm reads "Try again", the dialog stays open and focus is on "Try again". (L2-022)
- **AC-13** Given the cookie preferences dialog with "Remember my optional usage choices" unchecked and the save failed, when the failure renders, then the checkbox is still unchecked, the danger alert says the change was not saved and no success toast appears. (L2-034)

### Keyboard and focus

- **AC-14** Given "Request a change" on the appointment card for HP-1048, when the customer activates it, then the change dialog opens with focus in the "New preferred time" field, and Tab and Shift+Tab cycle through the field, "Keep current time", "Send change request" and "Close dialog" without leaving the panel. (L2-041)
- **AC-15** Given the sign-out dialog opened from the account menu, when it opens, then focus is on "Stay signed in", and pressing Enter there closes the dialog without signing out. (L2-011)
- **AC-16** Given the filter braiders dialog opened from "Filters", when the customer presses Esc or activates "Close dialog", then the dialog closes and focus returns to "Filters". (L2-041)
- **AC-17** Given the cancel dialog, when the customer activates "Keep request", presses Esc or clicks the backdrop, then Esc and "Keep request" close it with request HP-1048 still "Awaiting reply", and the backdrop click leaves the dialog open. (L2-022)
- **AC-18** Given the review request dialog opened from the booking form, when the customer closes it, then focus returns to "Review request" and every value they entered in the form is unchanged. (L2-016)
- **AC-19** Given the filter braiders dialog with focus in the distance field, when the customer presses Enter, then the form submits through "Show braiders" exactly as if it were clicked. (L2-005)
- **AC-20** Given an open dialog, when the customer uses a screen reader's virtual cursor or Tab, then nothing behind the panel is reachable: the page's siblings of the overlay container carry `aria-hidden="true"` and `inert`, and both are removed on close. (L2-041)

### Screen readers

- **AC-21** Given a form dialog rendered without `closeLabel` in development mode, when it initialises, then the console reports an error naming `hp-dialog` and the missing `closeLabel`. (L2-041)

### Theming

- **AC-22** Given the cancel dialog, when the theme switches from light to dark, then the panel background changes to the dark `--color-bg-surface-raised` (grey 800), the backdrop to the dark `--color-bg-backdrop`, and the title, description and danger confirm keep at least 4.5:1 contrast. (L2-042)

### Responsive

- **AC-23** Given a 360 px viewport, when the change dialog opens, then it is a bottom sheet spanning the full width with `--radius-xl` top corners, "Send change request" sits above "Keep current time", each fills the footer width, and the page does not scroll horizontally. (L2-042)
- **AC-24** Given a 360 × 640 px viewport with text enlarged to 200 %, when the change dialog opens, then the panel is no taller than the viewport minus 48 px, the body scrolls inside it, the footer stays pinned, and "Send change request" and "Keep current time" are fully visible, wrapped inside their buttons, and operable. (L2-042)

### Motion

- **AC-25** Given `prefers-reduced-motion: reduce`, when any dialog opens, then the backdrop and panel appear without the fade, scale or slide animation. (L2-041)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/dialog/`; files `dialog.service.ts` (`DialogService`, `providedIn: 'root'`, wraps the CDK `Dialog`), `dialog-panel.ts` (`DialogPanel`, selector `hp-dialog-panel`, extends `CdkDialogContainer`, host classes `dialog__panel` and the size modifier, `styles` that port `.backdrop`, `.dialog`, `.dialog__panel` and its parts from `components.css` with `ViewEncapsulation.None` because the backdrop and pane are outside its view), `dialog.ts` (`Dialog`, selector `hp-dialog`, `host: { style: 'display: contents' }`, `OnPush`), `dialog-close.ts` (`DialogClose`, selector `button[hpDialogClose]`). Export all from `public-api.ts`.
- `DialogService.open()` closes any open dialog first (D-11), records `document.activeElement` (or `returnFocusTo`) for `restoreFocus`, generates `hp-dialog-N`, `hp-dialog-N-title` and `hp-dialog-N-desc`, and passes the fixed configuration listed under *API* plus `role`, `width: '100vw'`, `height: '100dvh'` for the pane and the size class. After open it sets `overlayRef.hostElement.style.zIndex = 'var(--z-modal)'` and the backdrop's to `var(--z-overlay)` (D-8), and adds `inert` to every element the CDK hid, removing it on `closed` (D-7).
- Esc and backdrop: `disableClose: true` always; `hp-dialog` subscribes to `dialogRef.keydownEvents` (Escape, not busy → `close()`) and to `click` on the pane where `event.target` is the pane itself (form and confirmation, not busy → `close()`) (D-4).
- Initial focus: `autoFocus` is the selector list `.dialog__body :is(input:not([type=hidden]):not(:disabled), select:not(:disabled), textarea:not(:disabled)), .dialog__footer button` (D-5).
- Panel children: the ported styles include `hp-dialog-panel > * { display: contents; }` so the consumer component host does not break the flex column.
- Busy guard: `hp-dialog` exposes `busy` through an injectable `DialogState` that the close control and `hpDialogClose` read.
- Development checks (`isDevMode()`): missing `closeLabel` on form or confirmation; `busy` true with an empty `busyLabel`.
- Composes `button[hp-button]` (close control, footer), `hp-tooltip` (close control) and `svg[hp-icon]` (default chip icons `info` and `alert-circle`, close icon `close`).
- Perf-test scenarios `Dialog.ts` and `DialogFooter.ts` in `frontend/projects/perf-test/src/scenarios/`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.
- `components.css` carries the forced-colours panel border (D-9); the port keeps it.

## Decisions

- **D-1** *The first mocks put `role="dialog"` on `.dialog`, used a "×" close glyph, an `<a autofocus>` "Keep browsing" that navigates away, a disabled "Working…" busy confirm, a warning alert stacked on danger dialogs (`confirm` mocks), `role="dialog"` on destructive dialogs and "Cancel appointment" as the cancel title. Which wins?* The design system, which records each as drift fixed during extraction: role on `.dialog__panel`, close icon, a safe-action button that closes, `aria-busy` with the label kept, no stacked warning, `role="alertdialog"` with a danger chip, and the question title "Cancel request HP-1048?". The `confirm` state is therefore not a separate state; the dialog mocks now render the corrected markup and have no `confirm` state.
- **D-2** *Where do `.dialog__panel` and the ARIA attributes live, given the CDK always puts `role` and `aria-modal` on its container?* On the container: `hp-dialog-panel` subclasses `CdkDialogContainer` and carries `.dialog__panel`. A panel inside the CDK container would nest two elements claiming the dialog role; this keeps exactly one, where the design system puts it.
- **D-3** *Does a destructive dialog have a close control?* No. Every destructive example on the design-system page has none; "Keep request" and Esc both dismiss it, and the safe action is the deliberate way out. Form and confirmation dialogs have one.
- **D-4** *Does a backdrop click close every dialog?* No: form and confirmation only, never destructive and never busy (design-system *Touch*). Esc closes every variant unless busy (design-system *Keyboard*). Because the full-viewport `.dialog` pane sits above the CDK backdrop, the backdrop click is detected on the pane itself, and the CDK's own Esc and backdrop handling is disabled so one code path applies the busy rule.
- **D-5** *Where does initial focus go?* The first enabled field in the body; otherwise the first footer button, which is always the safe action because the footer is ordered safe-then-confirm. This yields the design system's rule (first field in a form dialog, safe action in a destructive one) without the consumer marking anything, and puts the review dialog's focus on "Edit details" rather than "Send request".
- **D-6** *How does Enter submit a form dialog when the form is in the body and the confirm in the footer?* The confirm is `type="submit"` with `form="<form id>"`, so it is the form's default button and implicit submission from a text field works. Destructive confirms are `type="button"`, so Enter never confirms them.
- **D-7** *Is the page behind made `inert`, or only `aria-hidden`?* Both. `DialogService` passes `ariaModal: true` and `hasBackdrop: true` to the CDK Dialog, which sets `aria-hidden` on every sibling of the overlay container, including the application root; the service then adds `inert` to exactly those siblings after `open()` and restores each one's previous state on `closed`. The skip link lives in the application root, so it is unreachable while a dialog is open, which the skip-link CRD (D-5) assumes. The CDK sets `aria-hidden="true"` on the overlay container's siblings; the design system requires `inert`, which also stops pointer and find-in-page interaction. The service adds and removes `inert` on the same elements. Live regions (the toast regions) are left exposed because the CDK skips elements with `aria-live`, and they live inside the overlay container anyway (toast D-3).
- **D-8** *How do the design system's layers (`--z-dropdown` 1000, `--z-overlay` 1200, `--z-modal` 1300, `--z-toast` 1500, `--z-tooltip` 1600) apply when every overlay lives in one CDK container whose panes all default to `z-index: 1000`?* Each overlay sets its wrapper's `z-index` to its layer token, so the order inside the container matches the design system regardless of which overlay opened last: a tooltip on the close control stays above the dialog, and a toast stays above the backdrop.
- **D-9** *How does the panel's edge show in forced colours, where shadows vanish?* A `--border-width-hairline` `CanvasText` border on `.dialog__panel`, the same treatment the stylesheet gives alerts and toasts. `components.css` carries it and the design-system dialog page states it.
- **D-10** *How is a missing close label caught?* A development-mode `console.error` naming `hp-dialog`, the same proportionate check as button D-9; the dialog still renders.
- **D-11** *What happens when a second dialog opens?* It replaces the first: `open()` closes any open dialog before opening the new one (design-system *Dialogs and overlays* pattern: "One dialog at a time"). Focus then returns to the first dialog's trigger when the second closes.
- **D-12** *Where does focus go when the trigger no longer exists after success (the "Cancel request" link disappears once HP-1048 is cancelled)?* To `returnFocusTo`, which the page passes as a selector for a stable element such as the appointment heading. Without it the CDK default (the trigger) applies.
- **D-13** *Is there a closing animation?* No. The stylesheet defines entry animations only; closing is instant, which also avoids a half-faded dialog holding focus.
- **D-14** *Which width turns the dialog into a bottom sheet, the design system's 640 px or L2-042's 576 px XS boundary?* The design system's `--layout-breakpoint-sm` (640 px). L2-042 requires the dialog to fit and keep its actions reachable in every range, which both layouts do; it does not prescribe where the layout changes.
- **D-15** *How is the busy state announced, given the button exposes only `aria-busy`?* By the dialog: the button CRD assigns progress copy to the form or dialog that owns it, so `hp-dialog` keeps a status region and the `busyLabel` input. A dialog without a visible progress message still satisfies L2-036's "a busy state is announced".

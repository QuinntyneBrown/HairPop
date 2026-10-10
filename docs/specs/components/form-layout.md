# Form layout

| Field | Value |
|---|---|
| Selector | `form[hp-form-layout]`, `div[hp-form-row]`, `div[hp-form-actions]` |
| Library path | `frontend/projects/components/src/lib/form-layout/` |
| Status | planned |
| Traces to | L2-002, L2-005, L2-009, L2-010, L2-014, L2-015, L2-017, L2-021, L2-025, L2-036, L2-041, L2-042 |
| Design system | [`form-layout.html`](../../design-system/components/form-layout.html), [forms pattern](../../design-system/patterns/forms.html) |
| Source mocks | [`pages/booking-request/default`](../../mocks/pages/booking-request/default.html), [`pages/booking-request/invalid`](../../mocks/pages/booking-request/invalid.html), [`pages/booking-request/submitting`](../../mocks/pages/booking-request/submitting.html), [`pages/booking-request/offline`](../../mocks/pages/booking-request/offline.html), [`pages/account-settings/default`](../../mocks/pages/account-settings/default.html), [`pages/account-settings/invalid`](../../mocks/pages/account-settings/invalid.html), [`pages/care-and-review/invalid`](../../mocks/pages/care-and-review/invalid.html), [`pages/sign-in/invalid`](../../mocks/pages/sign-in/invalid.html), [`pages/sign-up/invalid`](../../mocks/pages/sign-up/invalid.html), [`pages/forgot-password/invalid`](../../mocks/pages/forgot-password/invalid.html), [`pages/reset-password/invalid`](../../mocks/pages/reset-password/invalid.html), [`dialogs/filter-braiders/invalid`](../../mocks/dialogs/filter-braiders/invalid.html), [`dialogs/change-appointment/invalid`](../../mocks/dialogs/change-appointment/invalid.html), [`dialogs/report-review/invalid`](../../mocks/dialogs/report-review/invalid.html), [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`pages/matching-braiders/default`](../../mocks/pages/matching-braiders/default.html), [`pages/my-appointments/no-results`](../../mocks/pages/my-appointments/no-results.html) |
| Rendering | [`form-layout.html`](form-layout.html) |

## Purpose and scope

Form layout arranges a HairPop form and makes it safe to submit. It is the `<form>` that stacks [form fields](form-field.md) in one column 16 px apart, pairs short related fields from 768 px, ends with an actions bar whose primary button is full width on phones, and, when Maya submits something invalid, shows a linked error summary at the top, moves focus to it, and lets each link take her to the field. It never loses what she typed. The same component, inline, is the search form in the filter rows of the style gallery, matching braiders and my appointments.

Use something else when:

- one question stands alone with no submit (a sort select that applies at once is not allowed, select D-11; a stand-alone checkbox in a settings list): a form field on its own;
- the action is a destructive confirmation: a confirmation dialog with no form (dialog CRD);
- editing one value from a card: a button that opens a dialog holding a form layout, never an inline form in the page (AGENTS.md).

Out of scope:

- The card that holds a page form and its heading: the card component (`section[hp-card]`). This CRD only specifies the `.form-panel` width rule the page adds to it (D-3).
- Dialog structure, its footer and focus trapping: the dialog CRD. A dialog places a form layout in its body and its submit button in its footer (D-15).
- Field wiring and messages: the [form field](form-field.md). Buttons and their busy state: the button CRD. Status text: the [inline message](inline-message.md).
- Calling the API, the failure alert ("We couldn’t save this change. Your details remain here. Please try again."), the offline banner and the success state: the page.
- The alert's own look: the alert component (`hp-alert`, `tone`); this component owns only the summary's content, linking and focus.

## Usage

Every form in `docs/mocks/`. Summary titles follow the forms pattern's formula "Check {n} field(s) before {doing it}"; busy buttons keep their label with `aria-busy`, and offline forms keep the submit enabled.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/booking-request` | stack; Service, Preferred time, a `.form-row` with Your email and Phone, Hair details, estimate note; actions: status + primary "Send request" | summary "Check 1 field before sending" → "Preferred time: Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am." | default, invalid, submitting (status "Sending your request to Nia…", button busy), offline (alert above the form panel, submit enabled), success (page replaces the form); failed has no mock (it follows account settings) | surface (form panel card) |
| `pages/care-and-review` | stack; Rating, Your review, care note; actions: status + primary "Post review" | "Check 2 fields before posting"; status "Posting your review…" | default, invalid, submitting, offline (alert above the form panel), success (page replaces the form) | surface |
| `pages/account-settings` | stack; Name, Email, Phone; actions: status + primary "Save changes" | "Check 1 field before saving"; status "Saving…", "Saved just now", "Not saved" | default, invalid, submitting, offline (alert above the form panel), failed (danger alert above the form panel, status "Not saved"), success (the form stays, status "Saved just now"); a Notifications card with two switches follows the form panel | surface |
| `pages/sign-in` | stack; Email, Password; actions: status + primary "Sign in"; after the form, the "or" divider and "Create account" | "Check 1 field before signing in" | default, invalid, submitting; error and success replace the form with an empty state | surface |
| `pages/sign-up` | stack; Name, Email, Password; actions: status + primary "Create account" | "Check 2 fields before creating your account" | default, invalid, submitting | surface |
| `pages/forgot-password`, `pages/reset-password` | stack; Email / New password, Confirm password; actions: status + "Send reset link" / "Save password" | "Check 1 field before sending", "Check 1 field before saving" | default, invalid, submitting | surface |
| `pages/verify-email` | stack with no fields: only the actions row, status + primary "Resend email" | no summary (nothing to validate) | default, submitting | surface |
| `dialogs/filter-braiders`, `change-appointment`, `report-review`, `cookie-preferences` (the review-request dialog is a confirmation with a description list and no form) | stack in the dialog body, no actions bar: the footer's primary button submits it through `form` (D-15) | "Check 1 field before showing braiders", "Check 1 field before sending" | default, invalid, busy, failed; cookie preferences has no invalid state (one optional checkbox) | raised (dialog) |
| `pages/style-gallery`, `pages/matching-braiders`, `pages/my-appointments/no-results` | inline (`.filter-row`), `role="search"`; search box plus its actions: the "Find braiders" link (gallery), the "Filters" button and the sort menu trigger (matching braiders), none (my appointments, which shows the search only in `no-results`); applied-filter chips sit outside the form (chip CRD) | "Search style gallery", "Search matching braiders", "Search my appointments" | default, focus | canvas |

Every row is buildable with the API below: a `form[hp-form-layout]` in `stack` or `inline` layout, `summaryTitle`, `busy`, `div[hp-form-row]`, `div[hp-form-actions]`, and the `submitted` and `submitBlocked` outputs.

## Anatomy

1. **Form** — the native `<form novalidate>` host. Stack layout: `.stack` (vertical flex, `--space-4` gap). Inline layout: `.filter-row` (wrapping flex row, `--space-3` gap, `--space-4` below).
2. **Error summary (after a failed submit)** — the first child of the form: an `hp-alert` with `tone="danger"` and the class `form-summary`, `tabindex="-1"`, `role="group"`, `aria-labelledby` naming its title. It holds:
   1. **Title** — `<strong id>` with the count: "Check 1 field before sending".
   2. **List** — `<ul>` of `<li><a href="#{controlId}">{label}: {message}</a></li>`, one per invalid field in document order; links inherit the alert's colour, semibold.
3. **Content** — the projected fields, rows, notes and actions, in reading order.
4. **Row** — `div.form-row` from `div[hp-form-row]`: a grid of one column, two equal columns from 768 px, `--space-4` gap.
5. **Actions** — `div.form-actions` from `div[hp-form-actions]`: a wrapping flex row aligned to the end, `--space-3` gap, `--space-4` above; below 768 px its primary button is full width and first.

Host: all three parts use attribute selectors on native elements, so `form`, `.form-row` and `.form-actions` are the elements the design system and the e2e locators expect (D-1, D-2).

## API

### Inputs: `form[hp-form-layout]`

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `layout` | `'stack' \| 'inline'` | `'stack'` | no | Adds `.stack` or `.filter-row`. The inline layout never shows a summary. |
| `summaryTitle` | `(invalidCount: number) => string` | — | for a stack form with any field that can be invalid | Builds the summary title from the count: `n => n === 1 ? 'Check 1 field before sending' : \`Check ${n} fields before sending\``. Missing when a summary must show is a development-mode console error naming `hp-form-layout`; the summary then renders its list without a title. |
| `busy` | `boolean` (`booleanAttribute`) | `false` | no | While true, every `submit` event is cancelled and nothing is emitted (D-10). Fields stay editable; the form gets no `aria-busy`. Bind it to the same signal as the submit button's `busy`. |

- Inputs are signal inputs; booleans accept bare attributes.
- Native attributes pass through: `id` (needed when a dialog footer button submits through `form="…"`), `role="search"`, `aria-label`, `aria-labelledby`, `autocomplete`, `name`. `novalidate` is always set by the component.
- Forms: `[formGroup]` or `ngForm` sits on the same element. The component reads it (optional) to mark every control touched on submit; it never replaces it.

### Outputs: `form[hp-form-layout]`

| Output | Payload | Emitted when |
|---|---|---|
| `submitted` | `void` | Maya submits (button, Enter, or a footer button with `form`), the form is not busy, no control is pending, and no registered field is invalid. Once per submit. Use it instead of `ngSubmit`, which also fires for invalid forms (D-11). |
| `submitBlocked` | `number` | A submit found invalid fields; the payload is how many. The summary is shown and focused. |

### Methods: `form[hp-form-layout]`

| Method | Effect |
|---|---|
| `showSummary(): void` | Shows and focuses the summary for the fields that are invalid now, exactly as a blocked submit does, without emitting. For server answers: the page sets `setErrors({ server: '…' })` on the affected controls, then calls it (L2-015). Does nothing when no field is invalid. |

### Content slots

| Part | Slot | Accepts | Rule |
|---|---|---|---|
| `form[hp-form-layout]` | default | Form fields, `div[hp-form-row]`, notes (`p.text-muted`), `div[hp-form-actions]` (the page's offline and failure alerts sit above the form panel, outside the form); inline: a search box and its actions (none to two) | Declared once, after the summary. |
| `div[hp-form-row]` | default | Two short related form fields | Declared once. Never a textarea or a group. |
| `div[hp-form-actions]` | default | Optionally one status `hp-inline-message` first, then buttons: secondary, then the one primary | Declared once. Order is the reading order on wide screens (D-12). |

### Field contract (`HP_FORM_LAYOUT`)

The form provides one injection token; every [form field](form-field.md) inside it registers with it. This is what builds the summary.

```ts
export interface FormLayoutField {
  readonly label: Signal<string>;          // the field's label text
  readonly message: Signal<string | null>; // the message the field shows or would show now
  readonly invalid: Signal<boolean>;       // the control has errors (or an explicit error is set)
  readonly controlId: Signal<string>;      // the id the summary link targets
  readonly element: HTMLElement;           // the field host, for document order
  focus(): void;                           // focuses the control and scrolls it to the middle
}

export interface FormLayoutContext {
  /** True from the first submit attempt (or showSummary) until the component is destroyed. */
  readonly submitted: Signal<boolean>;
  register(field: FormLayoutField): () => void;
}

export const HP_FORM_LAYOUT = new InjectionToken<FormLayoutContext>('HP_FORM_LAYOUT');
```

## Variants and sizes

| Variant | Markup | Use for |
|---|---|---|
| Single column | `form.stack` | Every page and dialog form. |
| Paired fields | `div.form-row` inside the stack | Short related pairs from 768 px: "Your email" and "Phone", "Distance from Toronto" and "Sort braiders by". |
| Actions bar | `div.form-actions` at the end of the stack | Page forms. Dialogs use their footer instead. |
| Error summary | `hp-alert.form-summary` first in the form | Shown after a blocked submit or `showSummary()`. |
| Inline | `form.filter-row` | Search forms in filter rows. |

One size. A page form's width comes from its card (`.form-panel`, `--layout-form-max`, 38 rem); a dialog form's from the dialog body; an inline form fills its row.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Fields stacked `--space-4` apart, actions at the end | Native form; fields named by their labels |
| Invalid (summary) | blocked submit or `showSummary()` | Danger alert first in the form: accent left edge, title, linked list; every invalid field shows its error | Focus moves to the summary; its title and items are read; each field is `aria-invalid` |
| Summary focused | after it appears | The shared focus ring, `--focus-ring-offset` outside the alert | Group named by the title |
| Fixing | an invalid field becomes valid | Its line leaves the summary and the title count drops; the summary disappears when the count reaches 0 (D-6) | No announcement (not a live region) |
| Submitting | `busy` true (and the button's `busy`) | Nothing in the form changes; the button shows its spinner; an optional status shows "Sending your request to Nia…" | Status announced politely; further submits do nothing |
| Failed | the page shows its danger alert | Everything Maya typed stays; the summary is not shown | The page's alert; focus stays on the button |
| Offline | the page shows its warning alert above the form | Fields and the submit stay enabled | Activating submit is answered by the page |
| Inline | `layout="inline"` | Search box grows; the action wraps below it on narrow rows | Search landmark when the consumer sets `role="search"` |
| Narrow | below 768 px | One column; primary button full width and first in the actions; status on its own line | Reading order unchanged |
| Forced colours | `(forced-colors: active)` | Alert keeps a `CanvasText` border (alert CRD); links in `LinkText` | — |

## Markup

Rendered DOM. Classes, ids and ARIA attributes are the e2e contract. The summary shows the alert's DOM as the alert CRD renders it (assumed here: host classes, its icon, a body `div`).

```html
<!-- rendered: booking request after a blocked submit -->
<form class="stack" novalidate>
  <hp-alert class="alert alert--danger form-summary" tabindex="-1" role="group" aria-labelledby="hp-form-1-summary-title">
    <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v5M12 16v.01"/></svg>
    <div>
      <strong id="hp-form-1-summary-title">Check 1 field before sending</strong>
      <ul>
        <li><a href="#hp-field-2-control">Preferred time: Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am.</a></li>
      </ul>
    </div>
  </hp-alert>
  <div class="field">…Service…</div>
  <fieldset class="field" aria-describedby="hp-field-2-error">…Preferred time…</fieldset>
  <div class="form-row">
    <div class="field">…Your email…</div>
    <div class="field">…Phone (optional)…</div>
  </div>
  <div class="field">…Hair details…</div>
  <p class="text-muted">Estimate: $180–$240 · about 5 hours. Nia confirms the final price and time.</p>
  <div class="form-actions">
    <p class="inline-status" role="status"></p>
    <button class="btn btn--primary" type="submit">Send request</button>
  </div>
</form>
```

```html
<!-- rendered: submitting -->
<div class="form-actions">
  <p class="inline-status" role="status"><span class="dot dot--pulse" aria-hidden="true"></span>Sending your request to Nia…</p>
  <button class="btn btn--primary" type="submit" aria-busy="true">Send request</button>
</div>
```

```html
<!-- rendered: inline search form in the style gallery -->
<form class="filter-row" novalidate role="search">
  <div class="search search-box">
    <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4"/></svg>
    <input class="input" id="hp-text-field-1" type="search" name="q" aria-label="Search style gallery">
  </div>
  <a class="btn" href="/braiders">Find braiders</a>
</form>
```

```html
<!-- rendered: dialog form submitted from the footer (filter braiders) -->
<form class="stack" id="filter-braiders-form" novalidate>…Maximum price… …Distance from Toronto…</form>
<!-- in the dialog footer -->
<button class="btn btn--primary" type="submit" form="filter-braiders-form">Show braiders</button>
```

Consumer templates:

```html
<!-- consumer: booking request page, inside <section hp-card class="form-panel" aria-labelledby="details-title"><h2 id="details-title">Your details</h2> … </section> -->
<form hp-form-layout [formGroup]="form" [busy]="sending()" [summaryTitle]="checkBeforeSending"
      (submitted)="send()" (submitBlocked)="noop()">
  <div hp-form-field label="Service">…</div>
  <fieldset hp-form-field label="Preferred time" [errorMessages]="{ required: 'Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am.' }">…</fieldset>
  <div hp-form-row>
    <div hp-form-field label="Your email" [errorMessages]="emailMessages">
      <input hp-text-field type="email" formControlName="email" autocomplete="email" required>
    </div>
    <div hp-form-field label="Phone" optionalMarker="(optional)">
      <input hp-text-field type="tel" formControlName="phone" autocomplete="tel">
    </div>
  </div>
  <div hp-form-field label="Hair details" optionalMarker="(optional)" [maxLength]="200" [counterText]="counter">
    <textarea hp-textarea autoGrow formControlName="hair"></textarea>
  </div>
  <p class="text-muted">Estimate: $180–$240 · about 5 hours. Nia confirms the final price and time.</p>
  <div hp-form-actions>
    <p hp-inline-message kind="status" [progress]="sending()">{{ sending() ? 'Sending your request to Nia…' : '' }}</p>
    <button hp-button variant="primary" type="submit" [busy]="sending()">Send request</button>
  </div>
</form>

<!-- consumer: server-side rejection of the slot -->
<!-- this.form.controls.time.setErrors({ server: 'Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am.' }); this.layout().showSummary(); -->
```

Free to change: the generated id pattern; whether the summary's list is `ul` or `ol` is not free (it is `ul`, as the design system draws it).

## Design

- Stack: `display: flex; flex-direction: column; gap: --space-4` (global `.stack` utility, applied by the host class).
- Row: `display: grid; grid-template-columns: minmax(0, 1fr); gap: --space-4`; from `--layout-breakpoint-md` (48 rem) `repeat(2, minmax(0, 1fr))`. Fields in a row align to the top, so a long error under one does not move the other.
- Actions: `display: flex; flex-wrap: wrap; gap: --space-3; justify-content: flex-end; padding-top: --space-4`. Below 48 rem the primary button is `flex: 1 1 100%; order: -1`; from 48 rem `flex: none; order: 0`.
- Inline: `display: flex; flex-wrap: wrap; align-items: center; gap: --space-3; margin-bottom: --space-4`.
- Summary: the alert's padding, colours and `--border-width-accent` left edge (`.form-summary { border-left-width: … }`); list `margin-top: --space-1`, `padding-left: --space-5`; links `color: inherit`, `--font-weight-semibold`, `overflow-wrap: anywhere` (D-14); `:focus-visible` outline offset `--focus-ring-offset`.
- Motion: none. The summary appears in place; scrolling to it follows focus and the global `scroll-behavior`, which reduced motion makes instant.
- Layer: none.

Component tokens: none. The parts read layout tokens directly; the summary's colours are the alert's component tokens (`--alert-bg`, `--alert-fg`, `--alert-border`, `--alert-icon`) set by its danger tone.

| Token | Aliases | Overridden by |
|---|---|---|
| none | — | — |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Summary fill | `--color-danger-bg` | `--palette-red-50` | `--palette-red-950` |
| Summary text and links | `--color-danger-fg` | `--palette-red-700` | `--palette-red-300` |
| Summary border | `--color-danger-border` | `--palette-red-300` | `--palette-red-700` |
| Summary icon | `--color-danger-icon` | `--palette-red-500` | `--palette-red-300` |
| Summary focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

Contrast pairs, from `tokens/contrast-pairs.json`, in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-danger-fg` | `--color-danger-bg` | 4.5:1 | Summary title and links |
| `--color-danger-icon` | `--color-danger-bg` | 3:1 | Summary icon |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focused summary on a form panel |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focused summary in a dialog |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Notes such as the estimate |

Forced colours: the alert's border becomes `CanvasText` (alert CRD); the summary links take the system link colour and stay underlined.

## Responsive behaviour

- Below 768 px: one column; `.form-row` stacks its two fields; the primary button is full width and first in `.form-actions`; a status wraps onto its own line below it (measured at 360 px: button 328 px wide at the top, status on the next line).
- From 768 px: `.form-row` pairs its fields in two equal columns; the primary button returns to its natural width at the end of the actions, with the status before it on the same line.
- The inline layout wraps its action below a growing search box when the row is too narrow (text field).
- The summary is not sticky; it scrolls into view because it receives focus.
- At 360 px with 200 % text the summary's links wrap and long words such as "name@example.com" break (D-14); measured without the rule the link overflows the alert.
- At 320 px nothing scrolls horizontally; the primary action on a phone is a large, full-width button (44 × 44 px or more, button CRD).

## Accessibility

### Role and pattern

A native `<form>`; the inline search form adds `role="search"` from the consumer. The error summary follows the design system's linked-summary pattern: a focusable group (`role="group"`, `tabindex="-1"`, `aria-labelledby` its title) of same-page links (WCAG 3.3.1, 3.3.3).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Enter</kbd> in a text field | Submits the form (implicit submission); cancelled while busy. |
| <kbd>Tab</kbd> from the focused summary | Moves through the summary links in order, then on into the form. |
| <kbd>Enter</kbd> on a summary link | Moves focus to that field's control and scrolls it to the middle of the viewport. |

### Focus

- After a blocked submit or `showSummary()`, focus moves to the summary programmatically after it renders, never with `autofocus`. It shows the focus ring when the submit came from the keyboard.
- A summary link focuses the control itself (the input, the select, the checked or first radio), not the label.
- After a successful submit, focus is the page's decision (the success state's heading, or staying on the button for a toast).
- While busy and after a failure, focus stays on the submit button (button CRD).
- If the summary disappears while it holds focus, focus moves to the first field.

### Labelling

- The summary is named by its title ("Check 1 field before sending"); each link names the field and the fix ("Preferred time: Choose a time Nia offers. …").
- Each invalid field is programmatically tied to its message by the form field (L2-041).

### Announcements

- Moving focus to the summary announces it; it is not a live region, so it is never announced twice.
- Progress ("Sending your request to Nia…", "Saving…") is announced by the status inline message in the actions; the button only exposes `aria-busy`.

### Motion

Nothing animates. Scrolling to the summary or to a field uses the global `scroll-behavior`, which is `auto` under `prefers-reduced-motion: reduce`.

## Content and internationalisation

- Summary title counts the problems and names the action: "Check 1 field before sending", "Check 2 fields before saving", "Check 2 fields before posting". Never "Check the highlighted field" with "Correct the information below and try again.", which names no field.
- Summary lines are the field's label and its own error message, so the two always match.
- Notes beside the action set expectations when the outcome is not final: "Estimate: $180–$240 · about 5 hours. Nia confirms the final price and time."
- Primary buttons name the outcome: "Send request", "Post review", "Save changes" (button CRD).
- Translatable inputs: `summaryTitle`; every other string comes from the form fields, buttons and notes. Data values: prices and times inside notes, formatted by the page.

## Performance

- Change detection: `OnPush`; the summary list and title are `computed` from the registered fields' signals, sorted once per change by document position.
- Perf-test scenarios: `frontend/projects/perf-test/src/scenarios/FormLayout.ts` renders Maya's account settings form (Name "Maya Chen", Email "maya.chen@example.com", Phone "416-555-0148" with "(optional)", actions "Save changes") with its summary showing "Check 1 field before saving"; and the composite `BookingForm.ts` renders the booking request for Nia (Service, Preferred time radio cards, Your email and Phone in a row, Hair details with counter, estimate note, "Send request"), because that composition repeats five fields on a screen. Iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep each at roughly 100–300 ms.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: the summary appears only in response to Maya's own submit and pushes the form down once; busy and failed states change no layout in the form.
- Weight: `@angular/core`, `@angular/forms` (`ControlContainer` type), the alert component. No CDK.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given the booking request form, when it renders, then the DOM is a native `<form class="stack" novalidate>` whose fields are 16 px apart in one column, and no browser validation bubble ever appears. (L2-042)
- **AC-2** Given "Your email" and "Phone" in a `div[hp-form-row]`, when the viewport is 768 px or wider, then they share one row in two equal columns 16 px apart; below 768 px they stack in one column. (L2-042)
- **AC-3** Given the booking form's actions on a 360 px viewport, when they render, then "Send request" spans the full width as the first item; at 1280 px it has its natural width at the end of the row. (L2-042)
- **AC-4** Given the style gallery search form with `layout="inline"` and `role="search"`, when Maya types "knotless braids" and presses Enter, then `submitted` emits once, the DOM is `form.filter-row`, and no summary appears. (L2-002)

### Submitting

- **AC-5** Given a complete, valid booking request for Nia, when Maya activates "Send request", then `submitted` emits exactly once, `submitBlocked` does not emit, and no summary renders. (L2-017)
- **AC-6** Given the booking request with no preferred time chosen, when Maya activates "Send request", then `submitted` does not emit, `submitBlocked` emits 1, a danger summary with the class `form-summary` is the form's first child titled "Check 1 field before sending" with the link "Preferred time: Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am.", and every value Maya entered remains. (L2-036)
- **AC-7** Given a blocked submit, when the summary appears, then focus is on the summary (not set by `autofocus`), and a screen reader announces "Check 1 field before sending" and its link. (L2-041)
- **AC-8** Given the summary listing "Preferred time", when Maya activates that link, then focus moves to the first offered-time radio and the field is scrolled into view. (L2-041)
- **AC-9** Given the sign-up form submitted with "maya.chen@" and a 9-character password, when it is blocked, then the summary is titled "Check 2 fields before creating your account", lists Email before Password in document order, each field shows its own error, and no account request is sent. (L2-010)
- **AC-10** Given the summary listing two fields, when Maya fixes the email, then its line disappears and the title becomes "Check 1 field before creating your account"; when she fixes the password, then the summary disappears. (L2-036)
- **AC-11** Given "Send request" busy with `busy` bound on the form, when Maya presses Enter in "Your email" or activates the button again, then nothing is emitted and no second request starts, and the status reads "Sending your request to Nia…". (L2-036)
- **AC-12** Given the booking form busy, when Maya edits "Hair details", then the textarea accepts the edit: no field is disabled and the form has no `aria-busy`. (L2-036)
- **AC-13** Given the booking request was rejected because the slot is no longer offered, when the page sets the server error on Preferred time and calls `showSummary()`, then the summary lists "Preferred time" with the server's message and takes focus, and nothing is emitted. (L2-015)
- **AC-14** Given the account settings save failed and the page shows its failure alert, when Maya activates "Save changes" again, then her edits are still in the fields and `submitted` emits again. (L2-036)

### Forms across the product

- **AC-15** Given the filter braiders dialog with Maximum price "150" below the style's minimum, when Maya activates "Show braiders" in the footer (`form` attribute), then the summary appears in the dialog body above the fields, the price field shows "Enter a price of at least $160 for this style.", "150" is kept, and the results do not change. (L2-005)
- **AC-16** Given account settings with the email "maya.chen@", when Maya activates "Save changes", then the summary "Check 1 field before saving" links to Email and nothing is saved. (L2-014)
- **AC-17** Given care and review with no rating and a blank review, when Maya activates "Post review", then the summary "Check 2 fields before posting" lists "Rating, 1 to 5" and "Your review" in that order and no review is sent. (L2-025)
- **AC-18** Given the report a review dialog with a blank reason, when Maya activates "Send report", then the summary links to "Reason", the field shows "Tell us what needs review." and the dialog stays open. (L2-009)
- **AC-19** Given the request a change dialog for HP-1048 with no time chosen, when Maya activates "Send change request", then the summary links to "New preferred time" and no change is sent. (L2-021)

### Theming

- **AC-20** Given the summary in the light and the dark theme, when contrast is measured, then its text and links are at least 4.5:1 and its icon at least 3:1 against `--color-danger-bg`. (L2-041)
- **AC-21** Given the summary shown, when the theme switches from light to dark, then it re-colours without a reload and keeps its content and focus. (L2-042)

### Responsive

- **AC-22** Given a 360 px viewport with text enlarged to 200 %, when the summary lists "Your email: Enter an email address like name@example.com.", then the link wraps inside the alert, "name@example.com" breaks rather than overflows, and the page does not scroll horizontally. (L2-042)
- **AC-23** Given the booking form's actions on a 360 px viewport while sending, when the status shows, then it sits on its own line below the full-width button and nothing is clipped. (L2-042)

### Motion

- **AC-24** Given `prefers-reduced-motion: reduce`, when a blocked submit moves focus to the summary or a link moves focus to a field, then the page jumps without smooth scrolling and the summary appears without animation. (L2-041)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/form-layout/`; files `form-layout.ts` (`FormLayout`, `selector: 'form[hp-form-layout]'`), `form-row.ts` (`FormRow`, `selector: 'div[hp-form-row]'`), `form-actions.ts` (`FormActions`, `selector: 'div[hp-form-actions]'`), `form-layout-context.ts` (`HP_FORM_LAYOUT`, `FormLayoutContext`, `FormLayoutField`). Export all from `public-api.ts`.
- `FormLayout` host bindings: `class.stack`, `class.filter-row`, `attr.novalidate` (`''`). Host listener `submit`: `preventDefault()`; if `busy()` return; mark every control touched (`ControlContainer`'s control `markAllAsTouched()` when present, and each registered field's control); set `submitted` true; if any control is `PENDING`, wait for the first status event where none is; collect invalid registered fields sorted with `compareDocumentPosition`; if any, set `summaryOpen` true, focus the summary in `afterNextRender`, emit `submitBlocked(count)`; else set `summaryOpen` false and emit `submitted()`.
- Template: `@if (layout() === 'stack' && summaryOpen() && invalidFields().length) { <hp-alert tone="danger" class="form-summary" tabindex="-1" role="group" [attr.aria-labelledby]="titleId"> <strong [id]="titleId">{{ summaryTitle()?.(count()) }}</strong> <ul> @for (f of invalidFields(); track f.controlId()) { <li><a [href]="'#' + f.controlId()" (click)="go($event, f)">{{ f.label() }}: {{ f.message() }}</a></li> } </ul> </hp-alert> }<ng-content />`. `go()` calls `preventDefault()` and `f.focus()`.
- Assumed alert API (alert CRD, another group): `hp-alert` puts `.alert` and its tone modifier (`.alert--danger` for the summary) on its host, renders its tone icon, projects default content into its body `div`, sets no live role of its own, and accepts `class`, `tabindex`, `role` and `aria-labelledby` as host attributes. If the alert CRD differs, this template adapts in the same pull request; the rendered classes and attributes above stay the contract.
- Styles: `FormLayout` ports `.form-summary`, `.form-summary ul`, `.form-summary a` (plus `overflow-wrap: anywhere`, D-14) and `.form-summary:focus-visible` as `:host ::ng-deep .form-summary …`, and `.filter-row`; `.stack` is the global utility. `FormRow` ports `.form-row` as `:host`. `FormActions` ports `.form-actions` as `:host` and `.form-actions .btn--primary` as `:host ::ng-deep > .btn--primary` inside the same media query (D-2).
- `.form-panel` and `.form-panel > h2` are ported into the global layout stylesheet with `.stack` and `.container` (D-3).
- Perf-test scenarios `FormLayout.ts` and `BookingForm.ts` in `frontend/projects/perf-test/src/scenarios/`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Wrapper or native host?* The native `<form>` through `form[hp-form-layout]`. It keeps implicit submission (Enter), `novalidate`, `role="search"`, the native `form` attribute that lets a dialog footer button submit it, and lets `[formGroup]` sit on the same element.
- **D-2** *Are rows and actions components or global classes?* Components on native `div`s (`div[hp-form-row]`, `div[hp-form-actions]`) so their rules live with the library and stay encapsulated. The actions bar must reach its projected primary button (`.form-actions .btn--primary`, which the button CRD's D-1 relies on), and emulated encapsulation cannot match projected nodes, so that one rule is `:host ::ng-deep > .btn--primary`, scoped to its own direct children.
- **D-3** *Does form layout own the panel card?* It owns the `.form-panel` rule but not the card. A page form sits in the card component (`section[hp-card]`, card CRD) with the consumer class `form-panel`; this CRD specifies that class (`max-width: var(--layout-form-max); margin-inline: auto; width: 100%`, and `> h2` in `--text-h3` with `--space-4` below) and ships it in the global layout stylesheet beside `.stack` and `.container--narrow`, because it styles another component's host and emulated encapsulation cannot reach it. Wrapping the card here would redefine the card's API; dialogs have no panel at all.
- **D-4** *Which classes make up a form?* The ones `components.css`, the form-layout page and the forms pattern define: `form.stack` (or `form.filter-row` inline), `.form-row`, `.form-actions` and `.form-summary`. There is no wrapper class for the form itself; the component adds the layout class to the native `<form>`.
- **D-5** *Who writes the summary's lines?* The form layout, from its registered fields: the field's label, a colon and the field's own message. A shortened second copy of every error would have to be kept in step by hand; repeating the field message word for word means the summary and the field never disagree, and the label tells Maya which field. The forms pattern and form-layout page draw it this way. The colon is punctuation, not copy; the title, the only sentence the layout owns, is an input.
- **D-6** *Is the summary a snapshot or live?* Live from the first blocked submit: lines leave as fields are fixed, the count updates, and the summary disappears at zero, matching the pattern's "re-validate on input" and the field errors beside it. It is not a live region, so updates are silent; Maya hears the field's own state as she fixes it.
- **D-7** *How is the summary focused and named?* Programmatically after render, never with `autofocus` (which fires on page load, not on submit), as a `role="group"` named by `aria-labelledby` its title. ARIA prohibits naming a generic element, so the group role makes the name valid; the design system draws the same.
- **D-8** *Where does the summary sit?* As the form's first child, in page panels and dialog bodies alike, 16 px above the first field, so the component that owns it can insert it and it renders in the same place everywhere.
- **D-9** *What decides validity?* The registered fields (their controls' errors or an explicit `error`), after marking every control touched. A field outside the form's `FormGroup` still blocks the submit, and a disabled control never does (Angular excludes it). Pending async validators are awaited so a submit is never judged half-way.
- **D-10** *What does `busy` do?* It cancels every submit, so Enter in a field cannot start a second request while the button's busy guard covers clicks (L2-036). It never disables fields or sets `aria-busy` on the form: the pattern says only the pressed button is busy and fields stay editable.
- **D-11** *`ngSubmit` or new outputs?* `submitted` and `submitBlocked`. `ngSubmit` fires for invalid forms too, so every page would repeat the same validity check; the layout already knows the answer.
- **D-12** *Where does the status go in the actions?* First, before the buttons. From 768 px the primary then stays at the end of the row as the pattern requires, and on phones the primary's `order: -1` puts it first with the status on the next line, which the inline-message page asks for ("wraps below the form's actions on phones"). The status is not focusable, so its DOM position does not affect focus order.
- **D-13** *What is the "inline" variant?* The filter row, as a search form (`form.filter-row`, `role="search"`): the gallery, matching braiders and my appointments search is submitted with Enter (L2-002), so it is a form, and `.filter-row` is the stylesheet's inline form layout.
- **D-14** *Long words in summary links?* They break (`overflow-wrap: anywhere`). Measured at 360 px with 200 % text, "name@example.com." runs past the alert's edge without it.
- **D-15** *How does a dialog submit its form?* The dialog body holds `form[hp-form-layout]` with an `id`; the footer's primary `button[hp-button] type="submit"` sets the native `form` attribute to that id, which the button CRD passes through. No `hp-form-actions` is used in dialogs; the dialog footer orders its buttons.
- **D-16** *What are the summary titles?* The pattern's formula with each form's action: "before sending", "before saving", "before posting", "before signing in", "before creating your account", "before showing braiders". A title such as "Check the highlighted field" names nothing and is never used.

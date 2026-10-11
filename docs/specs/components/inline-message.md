# Inline message

| Field | Value |
|---|---|
| Selector | `span[hp-inline-message]`, `p[hp-inline-message]` |
| Library path | `frontend/projects/components/src/lib/inline-message/` |
| Status | built |
| Traces to | L2-014, L2-036, L2-041, L2-042 |
| Design system | [`inline-message.html`](../../design-system/components/inline-message.html) |
| Source mocks | [`pages/booking-request/invalid`](../../mocks/pages/booking-request/invalid.html), [`pages/account-settings/invalid`](../../mocks/pages/account-settings/invalid.html), [`pages/reset-password/invalid`](../../mocks/pages/reset-password/invalid.html), [`pages/sign-in/invalid`](../../mocks/pages/sign-in/invalid.html), [`pages/care-and-review/invalid`](../../mocks/pages/care-and-review/invalid.html), [`dialogs/filter-braiders/invalid`](../../mocks/dialogs/filter-braiders/invalid.html), [`dialogs/report-review/invalid`](../../mocks/dialogs/report-review/invalid.html), [`pages/booking-request/submitting`](../../mocks/pages/booking-request/submitting.html), [`pages/account-settings/submitting`](../../mocks/pages/account-settings/submitting.html) |
| Rendering | [`inline-message.html`](inline-message.html) |

## Purpose and scope

An inline message sits right next to what it describes: the hint under a field ("Use at least 12 characters."), the error that says how to fix it ("Enter an email address like name@example.com."), the character counter under Maya's review ("56 of 500 characters"), or a short status beside a form's actions ("Sending your request to Nia…", "Saved just now", "Not saved"). It is small, text-first and never interactive.

The [form field](form-field.md) renders the hint, error and counter kinds for every control; pages render the status kind directly, usually inside the [form layout](form-layout.md) actions. Use something else when:

- the message concerns a whole form, region or page ("You’re offline.", "We couldn’t save this change.", the error summary): use the alert component;
- the feedback is about an action that finished elsewhere or must outlive the screen ("Review posted"): use the toast component;
- the state is a label on a record ("Awaiting reply"): use the badge component.

Out of scope:

- When a hint, error or counter appears, which ids describe a control and when an error first shows. The form field owns that wiring and timing; this component renders the text it is given.
- Error copy and validation rules: pages and their form models.
- Which status to show and when it changes ("Saving…" to "Saved just now"): the page.
- Icons: the iconography foundation defines them; this component sizes and colours a projected `.icon`.

## Usage

Every `.field__error` in `docs/mocks/` (no mock has a hint, counter or inline status: the design system added them from the core set and records the missing hints as drift), plus the configurations the design system and the forms pattern define for the same screens.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Field errors on `pages/sign-in`, `sign-up`, `forgot-password`, `reset-password`, `account-settings`, `booking-request`, `care-and-review` (`invalid`) | `kind="error"` in a form field | "Enter an email address like name@example.com.", "Enter the email address on your account.", "Use at least 12 characters.", "Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am.", "Choose a rating from 1 to 5.", "Write a few words about your visit with Nia." | invalid | surface (form panel) |
| Field errors in `dialogs/filter-braiders`, `change-appointment`, `request-review`, `report-review` (`invalid`) | `kind="error"` | "Enter a price of at least $160 for this style.", "Choose one of the times Nia has offered.", "Choose an offered time.", "Tell us what needs review." | invalid | raised (dialog) |
| Hints on sign-up, reset password, account settings, care and review (design system *Variants*; the mocks show the rule only as an error, drift) | `kind="hint"` | "Use at least 12 characters.", "Braiders text this number.", "What should others know about your visit?" | default, beside an error, under a disabled control ("Verify your email to change this.") | surface |
| Counters on care and review, booking request, report a review | `kind="counter"` | "56 of 500 characters", "225 of 200 characters", "42 of 300 characters" | default, over limit | surface, raised |
| Booking request and account settings while submitting (forms pattern *Submitting*; mocks relabel the button "Working…", drift) | `kind="status"`, `progress`, `p` host in `.form-actions` | "Sending your request to Nia…", "Saving…" | progress | surface |
| Account settings after saving (design system *Variants*) | `kind="status"` with tone and a leading icon | "Saved just now" (success, check), "Saved on this device only" (warning, warning), "Not saved" (danger, alert-circle) | success, warning, danger | surface |

Every row is buildable with the API below: one host, a `kind`, and for status a `tone`, `progress` and `live`, with all copy projected.

## Anatomy

1. **Container** — the host itself, a `<span>` (hint, error, counter, inline status) or a `<p>` (an inline status that stands as its own line), carrying the kind's class: `.field__help`, `.field__error`, `.field__counter` or `.inline-status`.
2. **Warning glyph (error only)** — `::before` generated content `"⚠"` with empty alternative text; never a DOM node, never read.
3. **Leading visual (status only, optional)** — either the pulsing dot `<span class="dot dot--pulse" aria-hidden="true">` rendered by the component when `progress` is true, or one projected `<svg class="icon icon--sm" aria-hidden="true">`.
4. **Message** — the projected text. It is the whole content read by assistive technology.

Host: attribute selectors put the component on the native `<span>` or `<p>`, so the host carries the classes and is the direct flex child that `.field` and `.form-actions` lay out (D-1). The template is the optional dot followed by one `<ng-content>`.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `kind` | `'hint' \| 'error' \| 'counter' \| 'status'` | `'hint'` | no | Adds `.field__help`, `.field__error`, `.field__counter` or `.inline-status` (D-2). |
| `tone` | `'neutral' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | no | Status only: adds `.inline-status--success`, `--warning` or `--danger`; neutral adds no modifier. Ignored for other kinds (D-11). |
| `progress` | `boolean` (`booleanAttribute`) | `false` | no | Status only: renders the pulsing dot before the text. Use for work in progress: "Saving…", "Sending your request to Nia…". |
| `live` | `boolean` (`booleanAttribute`) | `true` | no | Status only: when true the host has `role="status"` from its first render, so later text changes are announced politely (D-3). Set false for a status that never changes after load. |
| `over` | `boolean` (`booleanAttribute`) | `false` | no | Counter only: sets `data-over="true"` (danger colour). Removed, not `"false"`, when false. |

- Inputs are signal inputs; booleans accept bare attributes.
- `id` is a plain native attribute on the host: the form field sets it so a control can list it in `aria-describedby`. The component never reads or rewrites it.
- The component renders no copy; the message is always projected.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The message is not interactive. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Text; for `kind="status"` optionally one leading `<svg class="icon icon--sm" aria-hidden="true">` before the text | Declared once. No links, buttons or other interactive content: messages are never focusable. A status with `progress` takes no icon (the dot is its visual). |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Hint | `.field__help` | What to enter, before anyone makes a mistake: "Use at least 12 characters." |
| Error | `.field__error` | What is wrong and how to fix it, after validation: "Enter a 10-digit phone number like 416-555-0148." |
| Counter | `.field__counter`, `[data-over="true"]` | Characters used against a limit: "56 of 500 characters". |
| Status, neutral | `.inline-status` | Work in progress or a neutral state: "Saving…". |
| Status, success | `.inline-status--success` | Done: "Saved just now". |
| Status, warning | `.inline-status--warning` | Done with a caveat: "Saved on this device only". |
| Status, danger | `.inline-status--danger` | Failed: "Not saved". |

One size everywhere: hints, errors and statuses use `--text-body-sm` and counters `--text-caption`, so messages stay subordinate to the control they describe (design system *Sizes*). Width comes from the container; text wraps.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Hint | `kind="hint"` | `--color-fg-muted` | Read as the control's description |
| Error | `kind="error"` | `--color-danger-fg`, `⚠` glyph before the text, `--space-1` gap | Read as the control's description; glyph silent |
| Counter | `kind="counter"` | `--color-fg-subtle`, right aligned, tabular numbers | Read as part of the description |
| Counter over limit | `over` → `data-over="true"` | `--color-danger-fg` | Text states the count ("225 of 200 characters") |
| Status in progress | `kind="status"` + `progress` | `--color-fg-muted` text with the pulsing dot | `role="status"`: text announced politely when it changes |
| Status success / warning / danger | `tone` | `--color-success-fg` / `--color-warning-fg` / `--color-danger-fg` text and icon | Announced politely; the words carry the meaning |
| Static status | `live` false | As its tone | No role; read in place |
| Reduced motion | `(prefers-reduced-motion: reduce)` | The dot stops pulsing (`--motion-loop-state: paused`) and stays at full opacity | — |
| Forced colours | `(forced-colors: active)` | Text in system colours; tone is carried by the words and the icon shape | — |
| Narrow or enlarged text | column narrower than a word | Wraps and breaks long words (D-7) | — |

Messages have no hover, focus, active, disabled or busy state: they are never interactive. A hint under a disabled control stays at full contrast so the reason ("Verify your email to change this.") is readable.

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: hint, error, counter (inside a form field, which sets the ids) -->
<span class="field__help" id="hp-field-2-hint">Use at least 12 characters.</span>
<span class="field__error" id="hp-field-1-error">Enter an email address like name@example.com.</span>
<span class="field__counter" id="hp-field-9-counter">56 of 500 characters</span>
<span class="field__counter" id="hp-field-5-counter" data-over="true">225 of 200 characters</span>
```

```html
<!-- rendered: status in progress beside the booking form's actions -->
<p class="inline-status" role="status"><span class="dot dot--pulse" aria-hidden="true"></span>Sending your request to Nia…</p>
```

```html
<!-- rendered: status with tone and icon -->
<span class="inline-status inline-status--success" role="status"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12l5 5L19 7"/></svg>Saved just now</span>
<span class="inline-status inline-status--warning" role="status"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4L2.5 20h19zM12 10v4M12 17v.01"/></svg>Saved on this device only</span>
<span class="inline-status inline-status--danger" role="status"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v5M12 16v.01"/></svg>Not saved</span>
```

```html
<!-- rendered: empty live status kept in the DOM before anything happens -->
<p class="inline-status" role="status"></p>
```

Consumer templates:

```html
<!-- consumer: inside the form field template -->
<span hp-inline-message kind="error" [id]="errorId()">{{ message() }}</span>
<span hp-inline-message kind="counter" [id]="counterId()" [over]="over()">{{ counterText()(count(), maxLength()!) }}</span>

<!-- consumer: booking request actions, status kept rendered and its text changed -->
<div hp-form-actions>
  <p hp-inline-message kind="status" [progress]="sending()">{{ sending() ? 'Sending your request to Nia…' : '' }}</p>
  <button hp-button variant="primary" type="submit" [busy]="sending()">Send request</button>
</div>

<!-- consumer: account settings after a save -->
<span hp-inline-message kind="status" tone="success">
  <svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12l5 5L19 7"/></svg>Saved just now
</span>
```

Free to change: the dot's implementation, as long as it is one `aria-hidden` element of the `.dot.dot--pulse` classes.

## Design

- Typography: hint, error and status `--text-body-sm`; counter `--text-caption` with `font-variant-numeric: tabular-nums`, right aligned.
- Error: `display: flex; gap: --space-1; align-items: flex-start`; glyph `content: "⚠" / ""`, `flex: none`.
- Status: `display: inline-flex; align-items: center; gap: --space-2`; dot `0.5rem` square, `--radius-full`, `currentColor`; icon `.icon--sm` (16 px) in `currentColor`.
- Placement: the form field puts hint, error and counter `--space-1` below the control; a status sits in `.form-actions` and wraps below the buttons on phones (form layout).
- Wrapping: all kinds wrap and break a word longer than the line (`overflow-wrap: anywhere`, D-7).
- Motion: none except the dot, which pulses to 35 % opacity once per `--duration-loop-pulse` with `--ease-standard`, `animation-play-state: --motion-loop-state`. Messages appear without animation.
- Layer: none.

Component tokens: none. Kinds and tones read semantic text tokens directly, as the design system's *Theming* section lists.

| Token | Aliases | Overridden by |
|---|---|---|
| none | — | A surface that must recolour hints overrides `--color-fg-muted` on its own selector (the design system's dialog example keeps it). |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Hint, neutral status | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Error, over-limit counter, danger status | `--color-danger-fg` | `--palette-red-700` | `--palette-red-300` |
| Counter | `--color-fg-subtle` | `--palette-gray-500` | `--palette-gray-400` |
| Success status | `--color-success-fg` | `--palette-green-700` | `--palette-green-300` |
| Warning status | `--color-warning-fg` | `--palette-amber-700` | `--palette-amber-300` |

Contrast pairs, from `tokens/contrast-pairs.json` (the dialog error pair is measured for this CRD; the rendering shows live ratios):

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Hint on a card |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Hint in a dialog |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Error on a card |
| `--color-danger-fg` | `--color-bg-canvas` | 4.5:1 | Error on the page |
| `--color-danger-fg` | `--color-bg-surface-raised` | 4.5:1 | Error in a dialog |
| `--color-fg-subtle` | `--color-bg-surface` | 4.5:1 | Counter on a card |
| `--color-success-fg` | `--color-bg-surface` | 4.5:1 | Success status on a card |
| `--color-warning-fg` | `--color-bg-surface` | 4.5:1 | Warning status on a card |
| `--color-success-fg` | `--color-bg-canvas` | 4.5:1 | Success status on the page |
| `--color-warning-fg` | `--color-bg-canvas` | 4.5:1 | Warning status on the page |

Forced colours: text and icons take system colours, so tone is no longer colour-coded; every status says its state in words ("Not saved") and success, warning and danger use different icon shapes, so nothing depends on colour (WCAG 1.4.1).

## Responsive behaviour

- Messages wrap under their control at every width; they never sit beside it, so they cannot overflow at 360 px.
- A word longer than the line breaks (D-7); measured at 360 px with 200 % text, the error "Enter an email address like name@example.com." otherwise needs 322 px in a 296 px column.
- In two-column `.form-row`s from 768 px each field keeps its own messages; rows align to the top so a long error does not push its neighbour.
- A status in `.form-actions` wraps onto its own line below the full-width primary button on phones and sits beside the buttons from 768 px (form layout).
- At 320 px nothing scrolls horizontally or clips; at 200 % text everything stays readable. Messages are not targets.

## Accessibility

### Role and pattern

Hint, error and counter are plain text referenced by a control's `aria-describedby`; the form field adds `aria-invalid="true"` to the control while an error shows. A changing status is a `role="status"` live region (polite), per [WAI-ARIA status](https://www.w3.org/TR/wai-aria-1.2/#status). Messages always sit outside the `<label>`, so they never join a control's name.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skips every message; focus goes to the control, whose hint or error is read as its description. |

### Focus

Messages are never focusable and never move focus. On a failed submit focus goes to the error summary (form layout), then to each field.

### Labelling

- Errors name the problem and the fix in the field's terms: "Enter a 10-digit phone number like 416-555-0148.".
- The error glyph has empty alternative text (`content: "⚠" / ""`).
- Counters say "of 500 characters", never only "56/500", so they are not read as a fraction.
- Icons in a status are `aria-hidden="true"`; the words carry the state.

### Announcements

- Status: `role="status"` from first render, so the region exists before its text changes; a change from "" to "Sending your request to Nia…" and then to "Saved just now" is announced politely, once per change.
- Hint, error and counter: no live role; the form field announces counter changes through its own debounced region, and the error summary announces failed submits.

### Motion

Only the status dot moves: it pulses over `--duration-loop-pulse`. Under `prefers-reduced-motion: reduce`, `--motion-loop-state` pauses it at full opacity. Nothing else animates; messages appear in place.

## Content and internationalisation

- Errors are one sentence: what to do, with an example when the format is unclear. Never blame ("You entered an invalid value") and never be vague ("Enter a valid value to continue.").
- Hints explain a rule before it bites: "Use at least 12 characters.".
- Counters: "56 of 500 characters"; over the limit the error says "Shorten this to 200 characters or fewer.".
- Status: two to four words, past tense for done: "Saved just now", "Not saved", "Saved on this device only"; an ellipsis character for work in progress: "Saving…", "Sending your request to Nia…".
- Translatable content: all projected text. Data values: the braider's first name in "Sending your request to Nia…", counts in counters, prices in "Enter a price of at least $160 for this style." arrive formatted by the page.
- Length: English only today; text wraps and never truncates.

## Performance

- Change detection: `OnPush`, signal inputs; host classes and attributes computed from signals; the template is the optional dot and one `<ng-content>`.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/InlineMessage.ts` renders the account settings email error, `<span hp-inline-message kind="error">Enter an email address like name@example.com.</span>`, beside a success status "Saved just now"; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: `FormField` (form field CRD) renders the hint and counter kinds.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: a live status keeps its host rendered while empty, so changing its text does not insert a node; its height follows its text.
- Weight: `@angular/core` only.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `<span hp-inline-message kind="hint">Use at least 12 characters.</span>` under the sign-up password, when it renders, then the DOM is `<span class="field__help">Use at least 12 characters.</span>` in `--text-body-sm` and `--color-fg-muted`. (L2-041)
- **AC-2** Given `kind="error"` with "Enter an email address like name@example.com." in account settings, when it renders, then the span has the class `field__error`, a `⚠` glyph shows before the text in `--color-danger-fg`, and a screen reader reading the email field's description hears only "Enter an email address like name@example.com.". (L2-041)
- **AC-3** Given the email error's id listed in the input's `aria-describedby`, when the input takes focus, then the error is announced as the input's description, and the message itself is never reachable with Tab. (L2-041)
- **AC-4** Given `kind="counter"` with "56 of 500 characters" under "Your review", when it renders, then it is right aligned in `--text-caption` with tabular numbers in `--color-fg-subtle`. (L2-041)
- **AC-5** Given a counter reading "225 of 200 characters" with `over` true, when it renders, then it has `data-over="true"` and its colour is `--color-danger-fg`, and when `over` becomes false the attribute is removed. (L2-036)

### Status

- **AC-6** Given an empty `<p hp-inline-message kind="status">` in the booking form's actions, when its text changes to "Sending your request to Nia…" with `progress` true, then the host has `role="status"`, a `.dot.dot--pulse` with `aria-hidden="true"` precedes the text, and a screen reader announces "Sending your request to Nia…" once. (L2-036)
- **AC-7** Given account settings saved successfully, when the status shows "Saved just now" with `tone="success"` and a check icon, then it has the classes `inline-status inline-status--success`, the text and icon are `--color-success-fg`, and the text is announced politely. (L2-014)
- **AC-8** Given a failed save in account settings, when the status shows "Not saved" with `tone="danger"`, then it has the class `inline-status--danger`, no success wording is present, and the change is announced politely. (L2-014)
- **AC-9** Given the offline account settings form, when the status shows "Saved on this device only" with `tone="warning"` and the warning icon, then it has the class `inline-status--warning` and its text contrast against `--color-bg-surface` is at least 4.5:1. (L2-036)
- **AC-10** Given a status with `live` false, when it renders, then the host has no `role` attribute. (L2-041)
- **AC-11** Given `tone="success"` on a message whose `kind` is `error`, when it renders, then no `inline-status` class is added and the error looks and reads like any other error. (L2-041)

### Keyboard and focus

- **AC-12** Given the sign-up form with a hint and an error shown, when Maya tabs through the form, then focus never lands on either message and moves from the password input to the "Show" button. (L2-041)

### Theming

- **AC-13** Given the light theme, when hint, error, counter, success and warning messages render on a form panel, then their contrast against `--color-bg-surface` is at least 4.5:1 each, and the error's contrast against `--color-bg-canvas` and `--color-bg-surface-raised` is at least 4.5:1. (L2-041)
- **AC-14** Given the dark theme, when the same messages render, then the error resolves to `--palette-red-300` and every message keeps at least 4.5:1 against `--color-bg-surface` and `--color-bg-surface-raised`. (L2-041)
- **AC-15** Given an error and a success status on screen, when the theme switches from light to dark, then both change colour without a reload. (L2-042)
- **AC-16** Given Windows forced colours, when the success, warning and danger statuses render, then each remains identifiable by its words and icon shape. (L2-041)

### Responsive

- **AC-17** Given a 360 px viewport with text enlarged to 200 %, when the error "Enter an email address like name@example.com." renders under a field, then it wraps inside the column, the address breaks rather than overflows, and the page does not scroll horizontally. (L2-042)
- **AC-18** Given the booking form's actions on a 360 px viewport while sending, when the status renders, then it sits on its own line below the full-width "Send request" button and nothing is clipped. (L2-042)

### Motion

- **AC-19** Given `prefers-reduced-motion: reduce`, when the "Saving…" status renders with `progress`, then the dot does not pulse and stays fully opaque, and no message animates in. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/inline-message/`; file `inline-message.ts` exporting the standalone component `InlineMessage` with `selector: 'span[hp-inline-message], p[hp-inline-message]'`, `changeDetection: OnPush`, template `@if (kind() === 'status' && progress()) { <span class="dot dot--pulse" aria-hidden="true"></span> }<ng-content />`.
- Host bindings: `class.field__help`, `class.field__error`, `class.field__counter`, `class.inline-status` from `kind`; `class.inline-status--success|--warning|--danger` from `tone` when `kind` is status; `attr.data-over` (`'true'` or `null`); `attr.role` (`'status'` or `null`).
- Styles: port `.field__help`, `.field__error` (with the `::before` glyph), `.field__counter`, `.inline-status*`, `.dot`, `.dot--pulse` and the `pulse` keyframes from `docs/design-system/assets/components.css` as `:host(.field__help)` and so on, the status icon rule as `:host ::ng-deep > .icon`, and add `overflow-wrap: anywhere` to every kind (D-7). The same rule lands in `components.css` in the same slice.
- No CDK primitive. Composes nothing; icons are projected.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/InlineMessage.ts`, exported from `src/scenarios/index.ts`, with iterations added to `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Wrapper element or native host?* The native `<span>` or `<p>`, through attribute selectors. Each message is one text element whose classes the `.field` stack and `.form-actions` lay out, and whose `id` the control's `aria-describedby` references; a wrapper would put the id and the class on different nodes.
- **D-2** *One component with a `kind`, or four?* One. Hint, error, counter and status share their size, placement, wrapping and "never interactive" rules (the design system documents them as one component); the form field switches kind by data.
- **D-3** *How is a status announced?* `role="status"` on the host from its first render, and pages change its text rather than inserting the element, because a live region created together with its text is often not announced. `live` false covers a status that is already true at load.
- **D-4** *Pulsing dot or spinner for work in progress?* The pulsing dot. The forms pattern's submitting example draws a small spinner inside `.inline-status`, but the inline-message page defines the in-progress status with `.dot.dot--pulse` and the button beside it already shows the spinner; one spinner per action avoids two competing progress signs.
- **D-5** *Are tone icons built in?* No. Like the button, the component sizes and colours one projected `svg.icon.icon--sm`, so the icon set can change without touching this API; the design system pairs check, warning and alert-circle with success, warning and danger, and pages follow it.
- **D-6** *Counter copy?* "56 of 500 characters" (form field D-9): the inline-message labelling rule beats the slash form on the form-field and textarea pages.
- **D-7** *Long words?* All kinds break a word longer than the line (`overflow-wrap: anywhere`). Measured at 360 px with 200 % text: "Enter an email address like name@example.com." needs 322 px in a 296 px column without it, an L2-042 failure.
- **D-8** *The mocks' `⚠` was read aloud. What does the error render?* The glyph stays as CSS generated content with empty alternative text, as the design system fixed; no DOM node, no `aria-hidden` span to forget.
- **D-9** *`span` or `p`?* Both are allowed hosts. Hints, errors and counters are `span`s inside a field; a status that stands as its own line in `.form-actions` may be a `p`, as the forms pattern draws it. The look is identical.
- **D-10** *Do errors announce themselves?* No live role on hints, errors or counters. Announcing each error as it appears on blur would interrupt the next field; the error summary announces failed submits and each control reads its error on focus (form field).
- **D-11** *What does `tone` do on a non-status kind?* Nothing. Hint, error and counter colours are fixed by their kind, so a stray tone cannot make an error look like a success.

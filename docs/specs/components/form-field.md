# Form field

| Field | Value |
|---|---|
| Selector | `div[hp-form-field]`, `fieldset[hp-form-field]`, `span[hp-field-addon]` |
| Library path | `frontend/projects/components/src/lib/form-field/` |
| Status | built |
| Traces to | L2-005, L2-010, L2-015, L2-025, L2-036, L2-041, L2-042 |
| Design system | [`form-field.html`](../../design-system/components/form-field.html) |
| Source mocks | [`pages/booking-request/invalid`](../../mocks/pages/booking-request/invalid.html), [`pages/sign-in/invalid`](../../mocks/pages/sign-in/invalid.html), [`pages/sign-up/invalid`](../../mocks/pages/sign-up/invalid.html), [`pages/account-settings/invalid`](../../mocks/pages/account-settings/invalid.html), [`pages/reset-password/invalid`](../../mocks/pages/reset-password/invalid.html), [`pages/forgot-password/invalid`](../../mocks/pages/forgot-password/invalid.html), [`pages/care-and-review/invalid`](../../mocks/pages/care-and-review/invalid.html), [`dialogs/filter-braiders/invalid`](../../mocks/dialogs/filter-braiders/invalid.html), [`dialogs/change-appointment/invalid`](../../mocks/dialogs/change-appointment/invalid.html), [`dialogs/report-review/invalid`](../../mocks/dialogs/report-review/invalid.html), [`dialogs/request-review/invalid`](../../mocks/dialogs/request-review/invalid.html), [`dialogs/cookie-preferences/default`](../../mocks/dialogs/cookie-preferences/default.html) |
| Rendering | [`form-field.html`](form-field.html) |

## Purpose and scope

A form field keeps one question together: its label, the control that answers it, a hint, the error that says how to fix it, and a character counter, always in the same order and spacing, and wired so a screen reader hears all of it when the control takes focus. Every question on every HairPop form (booking request, care and review, account settings, the auth screens, the filter, change, review and report dialogs) sits in one. It is not a control; it is the layout and the wiring around one.

It hosts the [text field](text-field.md), [textarea](textarea.md) and [select](select.md) in its single-control variant, and the checkbox group and radio group in its group variant (`<fieldset>` and `<legend>`). The hint, error and counter it shows are [inline messages](inline-message.md). Use something else when:

- the controls form a whole form with a summary and actions: wrap the fields in [form layout](form-layout.md);
- a search box stands alone in a filter row with no visible label: use the text field's search box part without a form field;
- the message concerns the whole form or region ("You’re offline.", "We couldn’t save this change."): use an alert.

Out of scope:

- Validation rules themselves (required, email, 12 characters). The page's form model owns them; the field only shows their result.
- The error summary, focus on a failed submit and the submit itself. [Form layout](form-layout.md) owns them; the field registers with it.
- The look of each control and its own states (hover, focus ring, read-only, disabled). Each control's CRD owns them.
- The options of a checkbox or radio group, their names and values. The group components own them; this CRD only fixes the contract they rely on (see *API*, *Control contract*).
- Placement in rows and columns. [Form layout](form-layout.md) owns `.form-row`; the field only fills its column.

## Usage

Every `.field` in `docs/mocks/`, grouped by configuration, corrected for the drift the design system records (every mock field is a `<label class="field">` wrapping its error; the system uses a `<div>` with `<label for>`, D-1), plus the configurations the design system defines for the same screens.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/sign-in` | div field, text field `type="email"`; div field, text field `type="password"` with suffix "Show" button | "Email", "Password" | default, invalid "Enter an email address like name@example.com." (mock: "Enter a valid email address.", D-11 copy rule), submitting (fields stay editable) | surface (form panel) |
| `pages/sign-up` | Name, Email, Password; password has hint and suffix "Show" | "Name", "Email", "Password", hint "Use at least 12 characters." | default, invalid email, invalid password "Use at least 12 characters." | surface |
| `pages/forgot-password` | Email | "Email" | invalid "Enter the email address on your account." | surface |
| `pages/reset-password` | New password with hint and "Show"; Confirm password with "Show" | "New password", "Confirm password", hint "Use at least 12 characters." | invalid "Use at least 12 characters." | surface |
| `pages/account-settings` | Name, Email, Phone with optional marker and hint | "Name", "Email", "Phone" + "(optional)", hint "Braiders text this number." | default, invalid "Enter an email address like name@example.com.", offline, failed, submitting | surface |
| `pages/booking-request` | Service (select), Preferred time (group variant hosting a radio card group), Your email and Phone in a `.form-row`, Hair details (textarea with counter, limit 200) | "Service", "Preferred time", "Your email", "Phone" + "(optional)", "Hair details" + "(optional)" | default, invalid "Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am.", over limit "Shorten this to 200 characters or fewer." | surface |
| `pages/care-and-review` | Rating (group variant hosting an inline radio group), Your review (textarea, auto-grow, hint, counter, limit 500) | "Rating, 1 to 5", "Your review", hint "What should others know about your visit?", counter "56 of 500 characters" | invalid "Choose a rating from 1 to 5.", invalid "Write a few words about your visit with Nia." | surface |
| `dialogs/filter-braiders` | Maximum price (number text field with hidden `$` prefix addon), Distance from Toronto (select) | "Maximum price", "Distance from Toronto" | invalid "Enter a price of at least $160 for this style.", busy, failed | raised (dialog) |
| `dialogs/change-appointment` | New preferred time (select with option groups) | "New preferred time" | invalid "Choose one of the times Nia has offered." | raised |
| `dialogs/request-review` | Preferred time (select of offered times) | "Preferred time" | invalid "Choose an offered time." | raised |
| `dialogs/report-review` | Reason (textarea with counter, limit 300) | "Reason" | invalid "Tell us what needs review." | raised |
| `dialogs/cookie-preferences` | choice field hosting one checkbox | checkbox "Remember my optional usage choices" | default, busy, failed | raised |
| Design system *Variants* | div field with `km` suffix addon on a number field | "Distance from Toronto" + "km" | default | surface |
| Design system checkbox *States* | choice field with an error | "I’ve read Nia’s cancellation policy", error "Confirm you’ve read the policy to send your request." | invalid | surface |

Every row is buildable with the API below: a `div` or `fieldset` host, `label`, `optionalMarker`, `hint`, `errorMessages` or `error`, `maxLength` with `counterText`, the `choice` flag, and the prefix and suffix slots.

## Anatomy

1. **Container** — `.field` on the host itself: a `<div>` (single control) or a `<fieldset>` (group). Vertical flex stack, `--space-1` between parts, `min-width: 0` so it never widens its column.
2. **Label** — `<label class="field__label" for="{controlId}">` in the div variant; `<legend>` in the group variant (no class, global `legend` rule). Label font, `--color-fg-default`. Never rendered in `choice` mode (the checkbox's own label names it).
3. **Optional marker (optional)** — `<span class="optional">` inside the label, after one space: regular weight, `--color-fg-muted`.
4. **Control** — the projected control. In the div variant with addons, wrapped in `<div class="input-group">` with the prefix before and the suffix after it.
5. **Addon (optional)** — `<span class="addon">` from `span[hp-field-addon]`, or a projected button (the password "Show" toggle).
6. **Hint (optional)** — `<span class="field__help">`, an inline message of kind `hint`.
7. **Error (when shown)** — `<span class="field__error">`, an inline message of kind `error`, with the `⚠` glyph as CSS generated content with empty alternative text.
8. **Counter (optional)** — `<span class="field__counter">`, an inline message of kind `counter`, right aligned, `data-over="true"` past the limit.
9. **Counter announcer (with a counter)** — `<span class="visually-hidden" role="status">`, empty except when announcing (D-10).

Host: attribute selectors put the component on the native `<div>` or `<fieldset>`, so the host **is** `.field` and is the direct child that `.form-row` and the form's `.stack` lay out (D-1). The template renders the label or legend, the control template (D-12), then the messages.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | Text of the `<label>` or `<legend>`, and of the field's line in the error summary. In `choice` mode it is not rendered, only used by the summary. Plain text, never markup (D-14). |
| `optionalMarker` | `string \| undefined` | `undefined` | no | When set, renders `<span class="optional">` with this text after the label: "(optional)". Set only on the minority of fields that are optional. |
| `hint` | `string \| undefined` | `undefined` | no | When set, renders the hint below the control. It stays visible while an error shows. |
| `errorMessages` | `Readonly<Record<string, string>>` | `{}` | no | Message for each validator key: `{ required: 'Enter your email.', email: 'Enter an email address like name@example.com.' }`. The first key of the control's `errors` (in insertion order) that has an entry wins (D-11). |
| `error` | `string \| undefined` | `undefined` | no | An explicit message, shown at once whatever the timing rule and ahead of any validator message. For server answers the page cannot express as a validator error. |
| `maxLength` | `number \| undefined` | `undefined` | no | Shows the counter for a text field or textarea. Counts Unicode code points of the control's value. Never written as the native `maxlength` (D-8). |
| `counterText` | `(count: number, max: number) => string` | — | when `maxLength` is set | Builds the counter copy: `(n, max) => \`${n} of ${max} characters\``. A missing function with `maxLength` set is a development-mode console error naming `hp-form-field`. |
| `choice` | `boolean` (`booleanAttribute`) | `false` | no | For a single checkbox or switch that carries its own label: no `.field__label` is rendered (D-13). `div` hosts only. |

- Inputs are signal inputs; booleans accept bare attributes.
- The host accepts native attributes (`class`, `hidden`, `disabled` on a `<fieldset>`, which natively disables every control in the group). The component never rewrites them.
- Every string arrives as an input; the component renders no copy of its own.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The field displays state; it never acts. Values and validity live in the page's form model. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Exactly one control: `input[hp-text-field]`, `textarea[hp-textarea]`, `select[hp-select]`, a checkbox or switch (in `choice` mode), or, on a `fieldset` host, one checkbox group or radio group | The control registers itself through `HP_FORM_FIELD`. A second registration is a development-mode console error. |
| `[slot=prefix]` | One `span[hp-field-addon]` | `div` hosts only. Rendered before the control inside `.input-group`. |
| `[slot=suffix]` | One `span[hp-field-addon]` or one `button[hp-button]` | `div` hosts only. Rendered after the control inside `.input-group`; the password "Show" toggle uses it. |

Each `ng-content` is declared once, inside one `<ng-template>` rendered with `ngTemplateOutlet` either inside `.input-group` (when a prefix or suffix is present) or bare (D-12).

### `span[hp-field-addon]`

A directive-backed component for a unit or currency beside the control: host classes `addon`, an `id` (`{fieldId}-addon-prefix` or `-suffix`), content projected. When the host has no `aria-hidden="true"` its id joins the control's `aria-describedby` after the hint, so "km" is announced; a currency the label already implies is marked `aria-hidden="true"` by the consumer, as the design system's `$` is (D-12).

### Control contract (`HP_FORM_FIELD`)

The field provides one injection token. Every control that renders inside it, in this library or another group's, injects it optionally and follows these rules. This is the contract the checkbox group and radio group rely on; it does not change.

```ts
export interface FormFieldControl {
  /** Id of the element the label targets and the summary link moves to: the input itself, or the checked (else first) option of a group. */
  readonly id: Signal<string>;
  /** The forms directive on the control (FormControlName, FormControlDirective, NgModel), or null outside Angular forms. */
  readonly ngControl: NgControl | null;
  /** Moves focus to the control; used by error-summary links. */
  focus(): void;
}

export interface FormFieldContext {
  /** Generated id `hp-field-{n}-control`. A control uses it unless its own `id` input is set, and then registers its own id. */
  readonly controlId: Signal<string>;
  /** Space-separated ids in this order: error, hint, described addons, counter; null when there are none. */
  readonly describedBy: Signal<string | null>;
  /** True while the field shows its error. */
  readonly invalid: Signal<boolean>;
  /** True on a fieldset host. */
  readonly group: boolean;
  /** Registers the one control; returns the function that unregisters it (call it on destroy). */
  register(control: FormFieldControl): () => void;
}

export const HP_FORM_FIELD = new InjectionToken<FormFieldContext>('HP_FORM_FIELD');
```

Rules for a single control (`div` host, including `choice` mode):

- Put the id on the focusable native element: the host itself for a control whose host is the native element (text field, textarea, select), or the inner `<input>` for a label-hosted control (checkbox, switch). Use the control's own `id` input where it has one, else `controlId()`; label-hosted controls take no `id` input and use `controlId()` or their own generated id. Register whichever id is used.
- Set `aria-describedby` on that element to the control's own ids first (the consumer's `aria-describedby` input, or a checkbox's or switch's own description), then `describedBy()`.
- Set `aria-invalid="true"` while `invalid()`; remove the attribute otherwise. Exception: a control with no invalid state (the switch, switch CRD D-3) never mirrors `invalid()`; a field hosting a switch is not given validators that can fail.

Rules for a group (`fieldset` host):

- Render only the options container (`.choice-group`, with its modifiers, on the group's host or inside it) and the options; never a `<fieldset>`, `<legend>`, hint or error of its own. The field renders those around it.
- Never set `aria-describedby` on the options: the field puts `describedBy()` on the `<fieldset>`, which every option inherits as its group description.
- Set `aria-invalid="true"` on every option input while `invalid()`.
- Register one `FormFieldControl` whose `id` is the checked option's id, else the first option's, and whose `ngControl` is the group's forms directive.
- Disabled: a `disabled` attribute on the `<fieldset>` host disables every option natively; groups add nothing.

## Variants and sizes

| Variant | Host and modifier | Use for |
|---|---|---|
| Label and control | `div.field` | Every text field, textarea and select: "Your email", "Hair details", "Distance from Toronto". |
| With hint | `div.field` + `.field__help` | A rule to know before typing: "Use at least 12 characters.", "Braiders text this number." |
| With counter | `div.field` + `.field__counter` | A text limit: "Your review" (500), "Hair details" (200), "Reason" (300). |
| With addons | `div.field` + `.input-group` | A unit or currency ("$", "km") or an attached button ("Show"). |
| Optional | `.field__label .optional` | The few optional fields: "Phone (optional)", "Hair details (optional)". |
| Group | `fieldset.field` + `<legend>` | A checkbox group or radio group: "Rating, 1 to 5", "Preferred time". |
| Choice | `div.field`, no label | One checkbox or switch whose own label asks the question: "Remember my optional usage choices". |

The field has one size: it takes its control's height and its column's width. Text fields and selects choose their own size (`fieldSize`).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Label `--color-fg-default`, control at rest, hint `--color-fg-muted` | Control named by the label, described by the hint |
| Control focused | `:focus-visible` on the control | The control's ring; the field itself does not change | — |
| Invalid | error shown (D-3) | `.field__error` in `--color-danger-fg` with `⚠`; the control's invalid edge from its own `aria-invalid`; label colour unchanged | `aria-invalid="true"` on the control (every option in a group); error id first in `aria-describedby` |
| Invalid with hint | error shown and `hint` set | Hint stays above the error | Error read before the hint |
| Over limit | counted value longer than `maxLength` | Counter `data-over="true"` in `--color-danger-fg` at once; error and invalid edge follow the timing rule (D-8) | Counter text in the description; announced after a pause (D-10) |
| Read-only | `readonly` on the control | The control's sunken, dashed look; field unchanged | Read-only exposed by the control |
| Disabled | control disabled, or `disabled` on the fieldset host | The control's disabled look; label and hint unchanged | Disabled exposed; out of the tab order |
| Group invalid | error shown on a `fieldset` host | Error below the options, `--space-1` under them (D-6) | Fieldset described by the error; every option `aria-invalid="true"` |
| Forced colours | `(forced-colors: active)` | The control's border becomes `CanvasText`, so invalid is carried by the error text and its `⚠` glyph | — |
| Narrow or enlarged text | column narrower than a word, 200 % text | Label, hint, error and counter wrap, breaking long words such as "name@example.com" (D-7) | — |

The field has no hover, active, busy or loading state: while a form submits, fields stay editable and nothing in the field changes (form layout, L2-036).

## Markup

Rendered DOM. Classes, ids and ARIA attributes are the e2e contract.

```html
<!-- rendered: label and control (sign-in) -->
<div class="field">
  <label class="field__label" for="hp-field-1-control">Email</label>
  <input class="input" id="hp-field-1-control" name="email" type="email" autocomplete="email">
</div>
```

```html
<!-- rendered: optional marker and hint (account settings) -->
<div class="field">
  <label class="field__label" for="hp-field-3-control">Phone <span class="optional">(optional)</span></label>
  <input class="input" id="hp-field-3-control" name="phone" type="tel" autocomplete="tel" aria-describedby="hp-field-3-hint">
  <span class="field__help" id="hp-field-3-hint">Braiders text this number.</span>
</div>
```

```html
<!-- rendered: invalid with hint (sign-up password); error first in the description -->
<div class="field">
  <label class="field__label" for="hp-field-2-control">Password</label>
  <div class="input-group">
    <input class="input" id="hp-field-2-control" name="password" type="password" autocomplete="new-password"
           aria-invalid="true" aria-describedby="hp-field-2-error hp-field-2-hint">
    <button class="btn" type="button" aria-pressed="false" aria-controls="hp-field-2-control">Show</button>
  </div>
  <span class="field__help" id="hp-field-2-hint">Use at least 12 characters.</span>
  <span class="field__error" id="hp-field-2-error">Use at least 12 characters.</span>
</div>
```

```html
<!-- rendered: addons (filter braiders dialog; design system distance example) -->
<div class="field">
  <label class="field__label" for="hp-field-7-control">Maximum price</label>
  <div class="input-group">
    <span class="addon" id="hp-field-7-addon-prefix" aria-hidden="true">$</span>
    <input class="input" id="hp-field-7-control" name="price" type="number" inputmode="numeric" min="0" step="10">
  </div>
</div>
<div class="field">
  <label class="field__label" for="hp-field-8-control">Distance from Toronto</label>
  <div class="input-group">
    <input class="input" id="hp-field-8-control" name="distance" type="number" inputmode="numeric" aria-describedby="hp-field-8-addon-suffix">
    <span class="addon" id="hp-field-8-addon-suffix">km</span>
  </div>
</div>
```

```html
<!-- rendered: counter, over the limit, with the announcer (booking request hair details) -->
<div class="field">
  <label class="field__label" for="hp-field-5-control">Hair details <span class="optional">(optional)</span></label>
  <textarea class="textarea" id="hp-field-5-control" name="hair"
            aria-invalid="true" aria-describedby="hp-field-5-error hp-field-5-counter">…</textarea>
  <span class="field__error" id="hp-field-5-error">Shorten this to 200 characters or fewer.</span>
  <span class="field__counter" id="hp-field-5-counter" data-over="true">225 of 200 characters</span>
  <span class="visually-hidden" role="status"></span>
</div>
```

```html
<!-- rendered: group variant, invalid (care and review rating) -->
<fieldset class="field" aria-describedby="hp-field-4-error">
  <legend>Rating, 1 to 5</legend>
  <div class="choice-group choice-group--inline"><!-- rendered by hp-radio-group (radio group CRD); its host element is omitted here -->
    <label class="choice"><input type="radio" name="rating" id="rating-1" value="1" aria-invalid="true"><span>1</span></label>
    …
    <label class="choice"><input type="radio" name="rating" id="rating-5" value="5" aria-invalid="true"><span>5 (excellent)</span></label>
  </div>
  <span class="field__error" id="hp-field-4-error">Choose a rating from 1 to 5.</span>
</fieldset>
```

```html
<!-- rendered: choice mode with an error (design system checkbox example) -->
<div class="field">
  <label class="choice"><input type="checkbox" id="hp-field-6-control" aria-invalid="true" aria-describedby="hp-field-6-error"><span>I’ve read Nia’s cancellation policy</span></label>
  <span class="field__error" id="hp-field-6-error">Confirm you’ve read the policy to send your request.</span>
</div>
```

Consumer templates:

```html
<!-- consumer: account settings -->
<div hp-form-field label="Email" [errorMessages]="{ required: 'Enter your email.', email: 'Enter an email address like name@example.com.' }">
  <input hp-text-field type="email" formControlName="email" autocomplete="email" required>
</div>
<div hp-form-field label="Phone" optionalMarker="(optional)" hint="Braiders text this number.">
  <input hp-text-field type="tel" formControlName="phone" autocomplete="tel">
</div>

<!-- consumer: sign-up password with the show toggle -->
<div hp-form-field label="Password" hint="Use at least 12 characters." [errorMessages]="{ minlength: 'Use at least 12 characters.' }">
  <input hp-text-field type="password" formControlName="password" autocomplete="new-password" [revealed]="shown()" #pw>
  <button hp-button slot="suffix" [(pressed)]="shown" [attr.aria-controls]="pw.id">Show</button>
</div>

<!-- consumer: filter braiders, server-side minimum -->
<div hp-form-field label="Maximum price" [error]="priceError()">
  <span hp-field-addon slot="prefix" aria-hidden="true">$</span>
  <input hp-text-field type="number" inputmode="numeric" min="0" step="10" formControlName="price">
</div>

<!-- consumer: care and review -->
<div hp-form-field label="Your review" hint="What should others know about your visit?" [maxLength]="500"
     [counterText]="reviewCounter" [errorMessages]="{ required: 'Write a few words about your visit with Nia.', maxlength: 'Shorten this to 500 characters or fewer.' }">
  <textarea hp-textarea autoGrow formControlName="review"></textarea>
</div>
<fieldset hp-form-field label="Rating, 1 to 5" [errorMessages]="{ required: 'Choose a rating from 1 to 5.' }">
  <hp-radio-group formControlName="rating" orientation="horizontal" required>
    <label hp-radio value="1">1</label> … <label hp-radio value="5">5 (excellent)</label>
  </hp-radio-group>
</fieldset>

<!-- consumer: cookie preferences -->
<div hp-form-field choice label="Remember my optional usage choices">
  <label hp-checkbox formControlName="optionalUsage">Remember my optional usage choices</label>
</div>
```

Free to change: the generated id pattern (ids only need to be unique and stable for the field's lifetime), and whether the announcer span is present while empty, as long as it exists before it first announces.

## Design

- Stack: `display: flex; flex-direction: column; gap: --space-1; min-width: 0`. Fields in a form are `--space-4` apart, set by the form's `.stack` or `.form-row`, not by the field.
- Label: `--text-label` (semibold, `--font-size-sm`), `--color-fg-default`, `display: flex; flex-wrap: wrap; gap: --space-1`; the optional marker is `--font-weight-regular` in `--color-fg-muted`. Sentence case comes from the copy.
- Legend: `--text-label`, `padding: 0`, `margin-bottom: --space-2`, so the options sit 8 px below it and the error 4 px below the options (measured, D-6).
- Hint and error: `--text-body-sm`; counter: `--text-caption` with tabular numbers, right aligned.
- Error glyph: `content: "⚠" / ""` before the text, `flex: none`, gap `--space-1`.
- Wrapping: label, hint, error and counter wrap normally and break a word longer than the line with `overflow-wrap: anywhere` (D-7).
- Input group: `display: flex; align-items: stretch`; inner controls lose their joined corners (`--radius-md` only on the outer ends); an addon is `--space-3` side padding on `--color-bg-subtle` with a `--border-width-hairline` `--color-border-strong` border, `--color-fg-muted` `--text-body-sm`, `white-space: nowrap`, overlapping the control by one hairline.
- Motion: none. Errors, hints and counters appear and disappear without animation so their position is stable for magnifier users.
- Layer: none.

Component tokens: the field declares none. It reads text tokens directly and leaves the control's `--field-*` tokens to the control (see [text field](text-field.md)).

| Token | Aliases | Overridden by |
|---|---|---|
| none | — | A surface that needs a different hint colour overrides `--color-fg-muted` on its own selector; the design system keeps dialog hints at `--color-fg-muted`. |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Label and legend | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Optional marker, hint | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Error, over-limit counter | `--color-danger-fg` | `--palette-red-700` | `--palette-red-300` |
| Counter | `--color-fg-subtle` | `--palette-gray-500` | `--palette-gray-400` |
| Addon fill | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Addon border | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-450` |

Contrast pairs the field relies on, from `tokens/contrast-pairs.json` and, where the file has no pair, measured for this CRD in both themes (the rendering shows the live ratios):

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Label on a form panel |
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Label in a dialog |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Hint and optional marker on a panel |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Hint in a dialog |
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Addon text |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Error on a panel |
| `--color-danger-fg` | `--color-bg-canvas` | 4.5:1 | Error on the page |
| `--color-danger-fg` | `--color-bg-surface-raised` | 4.5:1 | Error in a dialog (not in the pairs file; measured 7.7:1 light, 6.1:1 dark) |
| `--color-fg-subtle` | `--color-bg-surface` | 4.5:1 | Counter on a panel |
| `--color-fg-subtle` | `--color-bg-surface-raised` | 4.5:1 | Counter in a dialog |

Forced colours: the field's text keeps system colours; the controls' borders become `CanvasText`, so the invalid edge and danger colour disappear and the error text with its visible `⚠` carries the state (WCAG 1.4.1 holds because the message is text).

## Responsive behaviour

- The label is always above the control, at every width and zoom; never beside it.
- The field fills its column. Two fields share a row only inside a `.form-row` from 768 px; the field has no breakpoint rules of its own.
- Long labels, hints and errors wrap; a word longer than the line, such as "name@example.com" at 200 % text on a 360 px screen, breaks instead of overflowing (D-7). Measured without the rule: the error's content is 322 px wide in a 296 px column.
- The input group keeps the control and its addon on one line at 320 px; the control shrinks (`min-width: 0`) and the addon keeps its natural width (measured: "km" 46 px beside a 242 px input at 320 px).
- At 320 px nothing scrolls horizontally or clips; at 200 % text everything stays available; tapping the label focuses the control, so the target is the label plus the control.

## Accessibility

### Role and pattern

The `div` variant has no role; `<label for>` names the control (WCAG 1.3.1, 3.3.2). The `fieldset` variant is a native group named by its `<legend>`, the [APG Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) and checkbox group structure. The field is never a `<label>`: help and errors inside a label become part of the name.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Reaches the control (and a suffix button after it). The label, hint, error, counter and addons are never focusable. |

### Focus

- The control shows focus; the field adds no ring.
- After a failed submit focus goes to the error summary, whose link moves focus to the control through `FormFieldControl.focus()` (form layout).
- Showing or hiding an error never moves focus.

### Labelling

- Name: the label text, plus the optional marker ("Phone (optional)").
- Description: `aria-describedby` lists the error, then the hint, then described addons, then the counter (D-4), so the newest, most urgent information is read first.
- `aria-invalid="true"` is on the control exactly while the error text is shown, never without a message (D-8).
- Group: the `<fieldset>` is described by the same list; options carry `aria-invalid`.
- The `⚠` glyph has empty alternative text and is never read.

### Announcements

- Errors are not live regions: they are read with the control when it takes focus, and the error summary announces the failed submit (form layout). Announcing each error on blur would interrupt typing in the next field.
- The counter announces through its own `role="status"` span, politely, once the person pauses typing for 1 s with the count at 90 % of the limit or more, and again on each later pause while the count changes (D-10). It never announces on every keystroke.

### Motion

Nothing animates. `prefers-reduced-motion` changes nothing in the field.

## Content and internationalisation

- Label: a noun in sentence case with no colon: "Your email", "Phone", "Distance from Toronto". A question only when the answer is a choice: "Rating, 1 to 5".
- Optional marker "(optional)" only on the minority of fields; required fields are not marked.
- Hint: one sentence about why or how: "Braiders text this number.", "Use at least 12 characters.". Never in a placeholder.
- Error: what to do, with an example or a real number: "Enter an email address like name@example.com.", "Enter a price of at least $160 for this style.", "Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am.". Never "Enter a valid value to continue." and never blame.
- Counter: "56 of 500 characters", not "56 / 500" (D-9). Over the limit the error states the limit: "Shorten this to 200 characters or fewer.".
- Translatable inputs: `label`, `optionalMarker`, `hint`, `errorMessages`, `error`, `counterText`, addon text. Data values: none; dates, times and prices inside messages ("Sat 24 Oct", "10:00 am", "$160") arrive already formatted by the page.
- Length: copy is English only today; long strings wrap (D-7) and never truncate.

## Performance

- Change detection: `OnPush`, signal inputs; the message, the description list and the counter text are `computed` signals. Control status is read from `AbstractControl.events` into a signal, not by polling in the template.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/FormField.ts` renders Maya's "Your review" field on the care and review page: label, hint "What should others know about your visit?", a textarea holding "Nia explained each step and the braids feel comfortable." and the counter "56 of 500 characters"; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: `BookingForm`, defined by the [form layout](form-layout.md) CRD, repeats five fields.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: the hint and counter are present from first render; an error inserts one line below its control and pushes later fields down, which happens only in response to the customer's own action (blur or submit).
- Weight: `@angular/core` and `@angular/forms` (`NgControl` type only, plus `AbstractControl.events`), `NgTemplateOutlet` from `@angular/common`. No CDK.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `<div hp-form-field label="Your email">` holding `<input hp-text-field type="email" formControlName="email">` in the booking request form, when it renders, then the DOM is a `div.field` whose first child is `label.field__label` with `for` equal to the input's `id`, the field is not a `<label>`, and the input's accessible name is "Your email". (L2-041)
- **AC-2** Given `label="Phone"` and `optionalMarker="(optional)"` in account settings, when it renders, then the label holds `Phone <span class="optional">(optional)</span>` with the marker in regular weight and `--color-fg-muted`, and the input's accessible name is "Phone (optional)". (L2-041)
- **AC-3** Given `hint="Braiders text this number."`, when the phone input takes focus, then a `span.field__help` with that text sits below the input and the input's accessible description is "Braiders text this number.". (L2-041)
- **AC-4** Given `<fieldset hp-form-field label="Rating, 1 to 5">` holding the inline radio group, when it renders, then the DOM is `fieldset.field` with a `<legend>` "Rating, 1 to 5" and the `.choice-group` 8 px below the legend, and each radio is announced inside the group "Rating, 1 to 5". (L2-041)
- **AC-5** Given `choice` mode holding the checkbox "Remember my optional usage choices", when it renders, then no `.field__label` exists and the checkbox's accessible name is "Remember my optional usage choices". (L2-041)
- **AC-6** Given the Maximum price field with a `$` prefix addon marked `aria-hidden="true"` and the distance field with a `km` suffix addon, when they render, then each control sits in a `.input-group` with the addon on the stated side, the distance input's description includes "km", and the price input's description does not include "$". (L2-041)

### Validation timing

- **AC-7** Given an empty required "Your email" on the booking request form, when Maya types "maya.chen@" and keeps focus in the field, then no error shows; when she then presses Tab, then "Enter an email address like name@example.com." appears below the input and the input has `aria-invalid="true"`. (L2-036)
- **AC-8** Given an untouched empty required "Your email", when Maya moves focus into it and out again without typing, then no error shows until the form is submitted. (L2-036)
- **AC-9** Given "Your email" showing its error, when Maya corrects the value to "maya.chen@example.com", then on that input event the error disappears, `aria-invalid` is removed, and the value is unchanged. (L2-036)
- **AC-10** Given the sign-up form submitted with a 9-character password, when the form layout reports the submit, then the password field shows "Use at least 12 characters." below its hint, whether or not the field was touched. (L2-010)
- **AC-11** Given a field with both `hint` and an error shown, when the control takes focus, then the hint is still visible above the error and the description reads the error first, then the hint. (L2-041)
- **AC-12** Given the booking form's Preferred time after the server answers that the slot is no longer offered and the page calls `setErrors({ server: 'Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am.' })`, when the field renders, then it shows exactly that message and the options keep Maya's earlier choice. (L2-015)
- **AC-13** Given the filter braiders dialog with Maximum price "150" and `error` "Enter a price of at least $160 for this style.", when it renders, then the message shows at once with the field untouched, the input has `aria-invalid="true"`, and the input still holds "150". (L2-005)
- **AC-14** Given an error shown, when the field renders, then the `⚠` glyph is visible before the text in `--color-danger-fg`, a screen reader reads only the text, and the label colour is the same as in the default state. (L2-041)

### Counter

- **AC-15** Given "Your review" with `maxLength` 500 and the value "Nia explained each step and the braids feel comfortable.", when it renders, then a right-aligned `span.field__counter` reads "56 of 500 characters" and its id is last in the textarea's description. (L2-041)
- **AC-16** Given "Hair details" with `maxLength` 200, when Maya types her 225-character note, then every character stays in the textarea, the counter reads "225 of 200 characters" with `data-over="true"` in `--color-danger-fg` immediately, and after she leaves the field the error "Shorten this to 200 characters or fewer." shows. (L2-036)
- **AC-17** Given "Your review" at 452 of 500 characters, when Maya stops typing for one second, then the status span announces "452 of 500 characters" once, and keystrokes while the count is below 450 announce nothing. (L2-041)

### Groups

- **AC-18** Given the care and review form submitted with no rating chosen, when the rating field shows "Choose a rating from 1 to 5.", then the `<fieldset>` has `aria-describedby` naming the error, every radio has `aria-invalid="true"`, and the error sits 4 px below the options. (L2-025)
- **AC-19** Given the rating field invalid, when Maya chooses "5 (excellent)", then the error and every `aria-invalid` disappear on that change. (L2-025)

### Keyboard and focus

- **AC-20** Given the sign-in form, when Maya presses Tab from "Email", then focus moves to the password input and then to the "Show" button, and never to a label, hint, error or counter. (L2-041)
- **AC-21** Given a touch device, when Maya taps the label "Your email", then the email input takes focus. (L2-041)

### Theming

- **AC-22** Given the dark theme, when an error renders in the filter braiders dialog and on the account settings panel, then the error text resolves to `--palette-red-300` and its contrast is at least 4.5:1 against `--color-bg-surface-raised` and `--color-bg-surface`. (L2-041)
- **AC-23** Given an invalid field with a hint, when the theme switches from light to dark, then the label, hint, error and counter colours change to their dark values without a reload. (L2-042)

### Responsive

- **AC-24** Given a 360 px viewport with text enlarged to 200 %, when "Your email" shows "Enter an email address like name@example.com.", then the error wraps inside the column, "name@example.com" breaks rather than overflows, and the page does not scroll horizontally. (L2-042)
- **AC-25** Given a 1280 px viewport, when any field renders, then its label sits above the control, never beside it. (L2-042)
- **AC-26** Given the "Distance from Toronto" field with a `km` addon on a 320 px viewport, when it renders, then the input and addon stay on one line within the column and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-27** Given `prefers-reduced-motion: reduce` or not, when an error appears or disappears, then it does so in one frame with no transition. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/form-field/`; files `form-field.ts` (standalone component `FormField`, `selector: 'div[hp-form-field], fieldset[hp-form-field]'`), `field-addon.ts` (`FieldAddon`, `selector: 'span[hp-field-addon]'`), `form-field-context.ts` (`HP_FORM_FIELD`, `FormFieldContext`, `FormFieldControl`). Export all from `public-api.ts`.
- `FormField` provides `HP_FORM_FIELD` with `useExisting: FormField`; it injects `HP_FORM_LAYOUT` optionally (form layout CRD) and registers `{ label, message, invalid, controlId, focus }` with it on init.
- Host bindings: `class.field` always; `attr.aria-describedby` on a `fieldset` host from `describedBy()`.
- Template: `<label>` or `<legend>` (none in `choice` mode); an `<ng-template #control>` holding the three `ng-content` slots; `@if (hasAddons())` renders it inside `<div class="input-group">`, else bare; then `<span hp-inline-message kind="hint">`, `<span hp-inline-message kind="error">`, `<span hp-inline-message kind="counter" [over]>` and the announcer span. `hasAddons()` comes from `contentChildren(FieldAddon)` plus a `contentChild` of the suffix button (`Button`, from the button library entry).
- Status signal: on registration, subscribe to `ngControl.control.events` (Angular 18 or later) with `takeUntilDestroyed`, and bump a `version` signal on every `StatusChangeEvent`, `ValueChangeEvent`, `TouchedChangeEvent` and `PristineChangeEvent`; `computed` signals read `version()` and the control's `errors`, `dirty`, `touched` and `value`. `FormControlName` resolves its control in `ngOnChanges`, so subscribe from the control's `ngOnInit` registration, not in the constructor.
- Error rule (D-3): `shown = !!error() || (hasErrors && (layout?.submitted() || (dirty && touched)))`. Message (D-11): `error()` ?? first `errors` key with an `errorMessages` entry ?? first `errors` value that is a non-empty string ?? `null`, and in development mode a `console.error` naming `hp-form-field`, the label and the unmapped key.
- Counter: `count = [...String(value ?? '')].length`; `over = count > maxLength()`. Announcer: a 1000 ms debounce (`COUNTER_ANNOUNCE_DELAY_MS`) from the last value change, announcing only when `count >= 0.9 * maxLength()` and the text differs from the last announcement; clear the span 500 ms later so a repeat is announced.
- Styles: port `.field`, `.field__label`, `.field__label .optional`, `legend`, `fieldset`, `.input-group` and `.addon` from `docs/design-system/assets/components.css`. Rules that reach projected controls (`.input-group > :first-child`, `:last-child`, `.input-group .input`, `.addon + .input`) are written `:host ::ng-deep .input-group > …` so they stay scoped to the field's own group. Add `overflow-wrap: anywhere` to the label (D-7); the message rules belong to inline message.
- No CDK primitive. Composes [inline message](inline-message.md) and, as content, the controls and `button[hp-button]`.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/FormField.ts`, exported from `src/scenarios/index.ts`, with iterations added to `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is the field a wrapper element (`<hp-form-field>`) or the native element?* The native `<div>` or `<fieldset>`, through attribute selectors, mirroring the button's D-1. The rendered DOM then matches the design system exactly (`div.field`, `fieldset`), the field is the direct child that `.form-row` and `.stack` lay out, and the group variant keeps native `<fieldset>` semantics: the legend names the group and `disabled` on it disables every option. The mocks' `<label class="field">` wrapper is drift the design system fixed.
- **D-2** *How do Angular forms connect: a `ControlValueAccessor` in each control, or native controls with the reactive forms directives?* One rule for the whole forms group: a control whose host is the native form element uses Angular's built-in value accessor, and a control whose host is not (a `<label>`-hosted checkbox or switch, a checkbox group, a radio group) implements `ControlValueAccessor` itself. So text field, textarea and select implement no accessor: `formControlName`, `[formControl]` or `ngModel` sit on the same native element and Angular's `DefaultValueAccessor`, `NumberValueAccessor` and `SelectControlValueAccessor` move the value, which keeps every native attribute (`type`, `autocomplete`, `inputmode`, `min`, `readonly`) and the platform select picker. Checkbox (`boolean`), checkbox group (`string[]`), radio group (`string | null`) and switch (`boolean`) implement the accessor, as their CRDs define, because the forms directive sits on their label or group host, not on a native input. Either way the control obtains its `NgControl` (native controls inject it with `self`; accessor controls read it lazily from the `Injector` to avoid a circular dependency) and registers it through `HP_FORM_FIELD`, so the field reads status the same way for every control.
- **D-3** *When does an error first show?* When the control is invalid and either the enclosing form has been submitted or the control is both dirty and touched (changed, then left); an explicit `error` input shows at once. Once shown it re-evaluates on every input, so it disappears as soon as the value is fixed. The form-field page says "on blur or submit", the inline-message page "validate on blur, then re-validate on every input", and the forms pattern "validate on submit … no errors while Maya is still typing a field for the first time"; this rule satisfies all three, and leaving an untouched field empty (AC-8) is not treated as a mistake.
- **D-4** *What order do the parts appear in, and in what order are they described?* Visual order: label, control, hint, error, counter, as the form-field, text-field, textarea and inline-message anatomies and code samples draw them. Description order: error, hint, described addons, counter, as the inline-message page requires ("put the error first in `aria-describedby` so it is read first"). The form-field page's "help, then error, then counter" description order is superseded by that more specific rule.
- **D-5** *Does the hint sit under the label or under the control?* Under the control. The forms pattern's summary line says "help below the label" and its structure example places one hint there, but the form-field, text-field, textarea and inline-message pages all place it below the control, beside the error it explains. One placement keeps every field identical; the design-system forms pattern catches up in the same change as the implementation.
- **D-6** *Does the group variant's `<fieldset>` carry `.field`?* Yes. The design system draws a bare `<fieldset>`; measured in Chromium, the bare fieldset puts the error directly against the options (0 px), while `fieldset.field` gives legend, 8 px, options, 4 px, hint, 4 px, error, the same rhythm as a single field.
- **D-7** *What happens to a word longer than the line?* It breaks (`overflow-wrap: anywhere` on label, hint, error and counter). Measured at 360 px with 200 % text, "Enter an email address like name@example.com." needs 322 px in a 296 px column, so the message overflowed its field, which L2-042 forbids at 200 % text. Normal words still wrap at spaces.
- **D-8** *Native `maxlength`, and what does over-limit look like?* No native `maxlength`: the limit is a `Validators.maxLength` validator and `maxLength` on the field drives the counter. The design system shows an over-limit state ("231 / 200") and says "never truncate what was typed", which native `maxlength` makes impossible (it silently cuts typing and pasting). Over the limit the counter turns danger at once as live feedback; `aria-invalid` and the error message follow D-3, so the control is never marked invalid without a message (the form-field page: `aria-invalid` "while the error shows"). Counts are Unicode code points, which is what the API's `max` string rule counts, so the counter and the server agree on "225".
- **D-9** *"56 / 500" or "56 of 500 characters"?* "56 of 500 characters". The inline-message page's labelling rule says counters say "of 500 characters", not "23/500"; the form-field and textarea specimens' slash form is read aloud as a fraction.
- **D-10** *How is the counter announced?* By a separate visually hidden `role="status"` span, politely, after a 1 s pause, only from 90 % of the limit. The textarea page asks for "a debounced live region … only when the person pauses near the limit"; the span is a sibling rather than the counter itself so the counter's text is not read twice in the description. The design system names neither the delay nor the threshold; one second is long enough not to interrupt typing, and 90 % gives warning before the limit.
- **D-11** *Where does the message text come from?* In order: the `error` input; the `errorMessages` entry for the first error key; a string-valued error (server answers set with `setErrors({ server: '…' })`); otherwise nothing, with a development-mode console error. The field never invents copy, and the mocks' fallback "Enter a valid value to continue." is the vagueness the design system removed. The sign-in and sign-up mocks' "Enter a valid email address." is replaced by the design system's "Enter an email address like name@example.com." for the same rule.
- **D-12** *How are addons and the "Show" button placed without declaring a slot twice?* The three slots live in one `<ng-template>` rendered with `ngTemplateOutlet`, inside `.input-group` only when a prefix or suffix is present (AGENTS.md). Addons are `span[hp-field-addon]` so the field can give them ids: an addon without `aria-hidden` ("km") joins the description; the design system's hidden `$` stays hidden because the label and the currency of every price imply it.
- **D-13** *How does a single checkbox with an error fit?* `choice` mode: the field renders no label (the checkbox label asks the question, as in the design system's checkbox example), keeps the error and wiring, and still gives the summary a `label`.
- **D-14** *Is the label an input or projected content?* An input string. The error summary needs its text, and a label holding links or controls would break the control's name; the optional marker is a separate input for the same reason.
- **D-15** *Who sets ids?* The field generates `hp-field-{n}`; the control uses `hp-field-{n}-control` unless its own `id` input is set (for example `id="email"` so an old link or test can target it), and registers whichever it uses. Messages use `-hint`, `-error`, `-counter`, addons `-addon-prefix` and `-addon-suffix`.
- **D-16** *How are required fields marked?* They are not; only the minority of optional fields carry "(optional)" (design system *Content*). The `required` attribute on the control exposes required state to assistive technology; with `novalidate` on the form it never triggers browser bubbles.

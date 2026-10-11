# Text field

| Field | Value |
|---|---|
| Selector | `input[hp-text-field]`, `div[hp-search-box]` |
| Library path | `frontend/projects/components/src/lib/text-field/` |
| Status | built |
| Traces to | L2-002, L2-005, L2-011, L2-014, L2-041, L2-042 |
| Design system | [`text-field.html`](../../design-system/components/text-field.html) |
| Source mocks | [`pages/sign-in/default`](../../mocks/pages/sign-in/default.html), [`pages/sign-in/invalid`](../../mocks/pages/sign-in/invalid.html), [`pages/sign-up/default`](../../mocks/pages/sign-up/default.html), [`pages/forgot-password/default`](../../mocks/pages/forgot-password/default.html), [`pages/reset-password/default`](../../mocks/pages/reset-password/default.html), [`pages/account-settings/default`](../../mocks/pages/account-settings/default.html), [`pages/account-settings/invalid`](../../mocks/pages/account-settings/invalid.html), [`pages/booking-request/default`](../../mocks/pages/booking-request/default.html), [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`pages/matching-braiders/default`](../../mocks/pages/matching-braiders/default.html), [`pages/my-appointments/no-results`](../../mocks/pages/my-appointments/no-results.html), [`dialogs/filter-braiders/invalid`](../../mocks/dialogs/filter-braiders/invalid.html) |
| Rendering | [`text-field.html`](text-field.html) |

## Purpose and scope

A text field collects one short, typed answer the customer knows: her name, email, phone, a password, a maximum price, a search term. It is the native `<input>` with the design system's look and the wiring that lets a [form field](form-field.md) label, describe and validate it. A search box part adds the leading search icon for the filter rows on the style gallery, matching braiders and my appointments.

Use something else when:

- the answer runs to more than one sentence ("Your review", "Hair details", "Reason"): use the [textarea](textarea.md);
- the answer must be one of a known set (an offered time, a distance, a service, a rating): use the [select](select.md) or a radio group, never free text;
- the value is a yes or no: use a checkbox or switch.

Out of scope:

- The label, hint, error, counter, addons and the input group around the control: the [form field](form-field.md) renders them; this CRD only specifies the control and how it consumes the field's context.
- Validation rules and messages: the page's form model and the form field.
- The "Show" toggle button itself: it is a `button[hp-button]` with `pressed` (button CRD) projected into the field's suffix slot; this CRD specifies only what the input does when it is revealed.
- What a search does with its term: the page (filtering is L2-002, L2-018).

## Usage

Every `.input` in `docs/mocks/` that stays a text field after the design system's drift fixes (free-text "Preferred time", "New preferred time" and "Distance from Toronto" become selects or radio groups, "Rating, 1 to 5" a radio group, "Your review", "Hair details" and "Reason" textareas, "Service" a select), plus the configurations the design system adds.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/sign-in` | `type="email"` `autocomplete="email"`; `type="password"` `autocomplete="current-password"` with a "Show" suffix button | "Email" `maya.chen@example.com`; "Password" | default, invalid, submitting (editable) | surface (form panel) |
| `pages/sign-up` | `type="text"` `autocomplete="name"`; email; `type="password"` `autocomplete="new-password"` + "Show" | "Name" `Maya Chen`, "Email", "Password" | default, invalid (email, password) | surface |
| `pages/forgot-password` | email | "Email" | default, invalid | surface |
| `pages/reset-password` | two `type="password"` `autocomplete="new-password"`, each with "Show" | "New password", "Confirm password" | default, invalid | surface |
| `pages/account-settings` | name, email, `type="tel"` `autocomplete="tel"` | "Name" `Maya Chen`, "Email" `maya.chen@example.com`, "Phone (optional)" `416-555-0148` | default, invalid email, offline, failed, submitting | surface |
| `pages/booking-request` | email `autocomplete="email"`, tel, in a `.form-row` from 768 px | "Your email", "Phone (optional)" | default, invalid | surface |
| `dialogs/filter-braiders` | `type="number"` `inputmode="numeric"` `min="0"` `step="10"` with a hidden `$` prefix addon | "Maximum price" `150` | default, invalid, busy, failed | raised (dialog) |
| `pages/style-gallery`, `pages/matching-braiders`, `pages/my-appointments` filter rows | search box (`grow`) holding `type="search"` with `aria-label`, inside an inline form | "Search style gallery", "Search matching braiders", "Search my appointments", value "knotless braids" | default, focus | canvas |
| Top bar (top-bar CRD) | search box without `grow` | "Search styles" | default | top bar |
| Design system *States* | `readonly` | "Request number" `HP-1048` | read-only | surface |
| Design system *Sizes* | `fieldSize="sm"` in a dense filter row; `fieldSize="lg"` for a hero search | "Toronto"; "knotless braids" | all | surface |
| Design system *Variants* | number with a `km` suffix addon | "Distance from Toronto" `10` | default | surface |

Every row is buildable with the API below: one native input with `type`, `fieldSize` and `revealed`, all other native attributes passed through, inside a form field or a search box.

## Anatomy

1. **Container** — `.input` on the native `<input>`: full width, `--field-height` minimum height, `--space-2` × `--space-3` padding, `--border-width-hairline` `--field-border`, `--radius-md`, `--field-bg` fill.
2. **Value or placeholder** — `--text-body` at the size's font size; placeholder `--color-fg-subtle`, an example only ("name@example.com").
3. **Focus ring** — 2 px `--color-focus-ring` outline with no offset plus a focus-ring border, so 3 px of accent shows.
4. **Search icon (search box only)** — a projected `<svg class="icon" aria-hidden="true">` positioned inside the start of the field at `--space-3`, `--color-fg-subtle`; the input reserves `--space-10` on its left.

Host: `input[hp-text-field]` is a component on the native `<input>` with an empty template; the host carries `.input`, the size modifier, `type`, `id`, `aria-describedby` and `aria-invalid` (D-1). `div[hp-search-box]` is a component on a native `<div>` carrying `.search` (and `.search-box` when it grows); its template is one `<ng-content>`.

## API

### Inputs: `input[hp-text-field]`

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `type` | `'text' \| 'email' \| 'password' \| 'tel' \| 'number' \| 'search' \| 'url'` | `'text'` | no | Written to the native `type`, except that a revealed password renders `text`. Write it as a static attribute (`type="number"`) so Angular selects its number value accessor (D-2). Date and time types are not offered (D-6). |
| `fieldSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | no | Adds `.input--sm` or `.input--lg`; md adds no modifier. Named to avoid the native `size` attribute (D-3). |
| `revealed` | `boolean` (`booleanAttribute`) | `false` | no | With `type="password"`, renders `type="text"` so the password is visible; the value, selection and focus are untouched. Ignored for other types (D-5). |
| `id` | `string \| undefined` | `undefined` | no | Host id. Inside a form field, defaults to the field's `controlId()`; outside, to a generated `hp-text-field-{n}`. |
| `aria-describedby` | `string \| undefined` | `undefined` | no | Aliased input. Ids the consumer adds; the field's `describedBy()` is appended after them (D-8). |
| `aria-invalid` | `boolean \| undefined` | `undefined` | no | Aliased input, for use outside a form field. Inside one, the field's `invalid()` decides. Renders `aria-invalid="true"` or no attribute. |

- Inputs are signal inputs; booleans accept bare attributes.
- Every other attribute is native and passed through untouched: `name`, `autocomplete`, `inputmode`, `enterkeyhint`, `placeholder`, `min`, `max`, `step`, `pattern`, `required`, `readonly`, `spellcheck`, `aria-label`, `aria-controls`, `form`, and `disabled` (prefer the forms API, which sets it natively).
- Never use the native `maxlength`; the form field's `maxLength` drives the counter and a validator enforces the limit (form field D-8).
- Forms: `formControlName`, `[formControl]` or `ngModel` on the same element; Angular's `DefaultValueAccessor` (or `NumberValueAccessor` for `type="number"`) moves the value. The component implements no value accessor (form field D-2).

### Inputs: `div[hp-search-box]`

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `grow` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.search-box`: fills the free space of a filter row with a minimum of `min(100%, --layout-card-min)`, so the row's action wraps below it when the row is narrower. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| native `input`, `change`, `keydown`, `search` | DOM events | As the platform fires them; the component re-emits nothing. Values flow through the forms directive. |

### Content slots

| Component | Slot | Accepts | Rule |
|---|---|---|---|
| `input[hp-text-field]` | None | — | A void element; the template is empty. |
| `div[hp-search-box]` | default | One `<svg class="icon" aria-hidden="true">` (the search icon), then one `input[hp-text-field] type="search"` with an `aria-label` | Declared once. The input is named by its `aria-label` alone (D-7). |

### Form field contract

Inside a form field the input injects `HP_FORM_FIELD` and follows the single-control rules in the form field CRD: it takes `controlId()` unless its `id` is set, merges `describedBy()` into `aria-describedby`, sets `aria-invalid="true"` while `invalid()`, and registers `{ id, ngControl, focus }`, where `ngControl` is the `NgControl` injected with `{ self: true, optional: true }` and `focus()` focuses the host and calls `scrollIntoView({ block: 'center' })`.

## Variants and sizes

| Variant | Configuration | Use for |
|---|---|---|
| Text | `type="text"` + `autocomplete="name"` | "Name". |
| Email | `type="email"` + `autocomplete="email"` | "Email", "Your email". |
| Password | `type="password"` + `autocomplete="current-password"` or `"new-password"`, text-only "Show" suffix button (D-13) | "Password", "New password", "Confirm password". |
| Phone | `type="tel"` + `autocomplete="tel"` | "Phone". |
| Number | `type="number"` + `inputmode="numeric"`, `min`, `step`; unit addon from the field | "Maximum price" with `$`. |
| Search | `type="search"` + `aria-label` in a search box | Filter rows and the top bar. |
| Read-only | `readonly` | A value shown for reference that can be copied: "HP-1048". |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| sm | `.input--sm` | `--control-height-sm` (32 px) | `--space-1` × `--space-3` | `--text-body` at `--font-size-sm` |
| md | — | `--control-height-md` (40 px) | `--space-2` × `--space-3` | `--text-body` at `--font-size-md` |
| lg | `.input--lg` | `--control-height-lg` (48 px) | `--space-2` × `--space-3` | `--text-body` at `--font-size-lg` |

Line height is `--line-height-snug` at every size, so each size measures exactly its control height (D-4). Medium is the default for every form; small only in dense filter rows on wide screens, never for typing on phones (its 14 px text makes iOS zoom); large for a hero search. Width is always the container's.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | `--field-bg` fill, `--field-border` edge, `--field-fg` value | Name from the field's label (or `aria-label`), role from the type |
| Placeholder | empty with `placeholder` | Placeholder in `--color-fg-subtle` | Not the name; the label stays |
| Hover | `:hover` | Border `--field-border-hover` (`--color-fg-muted`) | — |
| Focus | `:focus-visible` | Border and 2 px outline in `--color-focus-ring`, `outline-offset: 0` | — |
| Invalid | `aria-invalid="true"` | Border `--color-danger-solid` plus a 1 px inset shadow in the same colour (a 2 px danger edge) | Invalid; the error is its first description |
| Required | `required` | No visual change (only optional fields are marked) | Required |
| Read-only | `readonly` | `--color-bg-surface-sunken` fill, dashed border | Read-only; focusable; value selectable |
| Disabled | `disabled` (from the forms API) | `--color-bg-subtle` fill, `--color-fg-disabled` text, `--color-border-default` border, `cursor: not-allowed` | Disabled; out of the tab order; value kept |
| Revealed password | `revealed` with `type="password"` | Plain text value | Read as text; the "Show" button reports `aria-pressed="true"` |
| Search with icon | inside `div[hp-search-box]` | Icon at the start, value indented by `--space-10` | Icon hidden |
| Forced colours | `(forced-colors: active)` | Border `CanvasText`; focus ring `Highlight`; invalid edge colour lost (the error text carries it) | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Border and shadow changes are instant (`--duration-fast` zeroed) | — |

Surface contexts: the field reads `--field-*` component tokens over semantic tokens, so it needs no surface modifier on a form panel (`--color-bg-surface`), on the page canvas (filter rows) or in a dialog (`--color-bg-surface-raised`); the field's own fill stays `--color-bg-surface` everywhere.

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: email inside a form field (account settings) -->
<input class="input" id="hp-field-2-control" name="email" type="email" autocomplete="email" required
       aria-describedby="hp-field-2-hint">
```

```html
<!-- rendered: invalid -->
<input class="input" id="hp-field-2-control" name="email" type="email" autocomplete="email" required
       aria-invalid="true" aria-describedby="hp-field-2-error">
```

```html
<!-- rendered: password, hidden and revealed (the button is the field's suffix) -->
<input class="input" id="hp-field-3-control" name="password" type="password" autocomplete="current-password">
<input class="input" id="hp-field-3-control" name="password" type="text" autocomplete="current-password">
```

```html
<!-- rendered: sizes, read-only, disabled -->
<input class="input input--sm" type="text" aria-label="City">
<input class="input input--lg" type="search" aria-label="Search styles">
<input class="input" id="request-number" type="text" readonly>
<input class="input" id="hp-field-4-control" type="tel" disabled>
```

```html
<!-- rendered: search box in the style gallery filter row -->
<div class="search search-box">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4"/></svg>
  <input class="input" id="hp-text-field-1" type="search" name="q" aria-label="Search style gallery">
</div>
```

Consumer templates:

```html
<!-- consumer: sign-in -->
<div hp-form-field label="Email" [errorMessages]="emailMessages">
  <input hp-text-field type="email" formControlName="email" autocomplete="email" required>
</div>
<div hp-form-field label="Password" [errorMessages]="{ required: 'Enter your password.' }">
  <input hp-text-field type="password" formControlName="password" autocomplete="current-password" required [revealed]="shown()" #pw>
  <button hp-button slot="suffix" [(pressed)]="shown" [attr.aria-controls]="pw.id">Show</button>
</div>

<!-- consumer: maximum price in the filter dialog -->
<div hp-form-field label="Maximum price" [error]="priceError()">
  <span hp-field-addon slot="prefix" aria-hidden="true">$</span>
  <input hp-text-field type="number" inputmode="numeric" min="0" step="10" formControlName="price">
</div>

<!-- consumer: gallery filter row (form layout inline) -->
<form hp-form-layout layout="inline" role="search" [formGroup]="search" (submitted)="applySearch()">
  <div hp-search-box grow>
    <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4"/></svg>
    <input hp-text-field type="search" formControlName="q" aria-label="Search style gallery" enterkeyhint="search">
  </div>
  <a hp-button routerLink="/braiders">Find braiders</a>
</form>
```

Free to change: the generated id pattern, and the order of attributes and classes.

## Design

- Height: `min-height: var(--field-height)`, which is `--control-height-sm` / `-md` / `-lg` by size.
- Padding: `--space-2` block and `--space-3` inline; small uses `--space-1` block. Search inputs pad `--space-10` on the left for the icon.
- Typography: `--text-body` with the size's `--font-size-sm` / `--font-size-md` / `--font-size-lg` and `line-height: var(--line-height-snug)` (D-4). Medium text is 16 px at every width, so iOS does not zoom on focus.
- Shape: `--radius-md`; border `--border-width-hairline`. Inside `.input-group` the joined corners are square (form field).
- Elevation: none. The invalid state's second pixel is an inset shadow, not elevation.
- Motion: `border-color` and `box-shadow` transition over `--duration-fast` with `--ease-standard`; nothing moves.
- Layer: none.
- Search icon: `.icon` (20 px), absolutely positioned at `--space-3` from the start, vertically centred, `--color-fg-subtle`, `pointer-events: none`.

Component tokens (shared with textarea and select, declared on `.input, .select, .textarea`):

| Token | Aliases | Overridden by |
|---|---|---|
| `--field-bg` | `--color-bg-surface` | a surface re-skin |
| `--field-fg` | `--color-fg-default` | a surface re-skin |
| `--field-border` | `--color-border-strong` | a surface re-skin |
| `--field-border-hover` | `--color-fg-muted` | a surface re-skin |
| `--field-height` | `--control-height-md` | `.input--sm` → `--control-height-sm`; `.input--lg` → `--control-height-lg` |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Fill | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Value | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Border | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-450` |
| Border, hover | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Placeholder, search icon | `--color-fg-subtle` | `--palette-gray-500` | `--palette-gray-400` |
| Focus border and ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |
| Invalid edge | `--color-danger-solid` | `--palette-red-600` | `--palette-red-300` |
| Read-only fill | `--color-bg-surface-sunken` | `--palette-gray-100` | `--palette-gray-925` |
| Disabled fill | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Disabled text | `--color-fg-disabled` | `--palette-gray-400` | `--palette-gray-600` |
| Disabled border | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |

Contrast pairs, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Value |
| `--color-fg-default` | `--color-bg-surface-sunken` | 4.5:1 | Read-only value |
| `--color-fg-subtle` | `--color-bg-surface` | 4.5:1 | Placeholder |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Edge on a card |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Edge on the page (filter rows) |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Edge in a dialog |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus on a card |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus on the page |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus in a dialog |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid edge |

Disabled text is exempt from contrast minimums (WCAG 1.4.3); the disabled field is still identified by its label. Forced colours: every `.input` gets a `CanvasText` border and the focus ring maps to `Highlight`; the invalid edge colour is lost and the error text carries the state.

## Responsive behaviour

- The field is always its container's width; forms are one column below 768 px and may pair short related fields in a `.form-row` from 768 px ("Your email" and "Phone").
- Medium text stays 16 px at every width. Small fields are not used for typing on phones.
- In a filter row the search box grows to fill the row; when the row is narrower than the box's minimum plus the action, the action wraps below it (measured at 320 px: the search box takes the full 288 px row and "Find braiders" moves to the next line).
- Long values scroll inside the field natively; the field itself never widens its column.
- At 320 px nothing scrolls horizontally or clips; at 200 % text the field grows in height with its text and everything stays operable; md (40 px) and lg (48 px) exceed the 24 px target minimum and, with the label above, the tap target is larger still.

## Accessibility

### Role and pattern

Native `<input>` with the `type` that matches the data: textbox, searchbox or spinbutton roles come from the platform. Named by the form field's `<label for>`; a search box input is named by its one `aria-label`. `autocomplete` identifies personal data (WCAG 1.3.5); paste and password managers are never blocked (WCAG 3.3.8).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves into and out of the field; a "Show" button follows the password. Read-only fields are focusable; disabled ones are skipped. |
| <kbd>Enter</kbd> | Submits the enclosing form (implicit submission). |
| <kbd>Esc</kbd> | In a search field, clears the value (native). |
| <kbd>↑</kbd> / <kbd>↓</kbd> | In a number field, steps the value by `step`; typing is always possible too. |

### Focus

- The focus ring is the field's own: border and a 2 px outline in `--color-focus-ring` with no offset, so 3 px of accent sit against the surface at 3:1 or more. A pointer click on a field also shows it, because text inputs always match `:focus-visible`.
- Revealing a password never moves focus: it stays on the "Show" button.
- After a failed submit, the error summary's link focuses the field and scrolls it to the middle of the viewport.

### Labelling

- Every field has a visible label from the form field (WCAG 3.3.2); a placeholder is an example, never the label.
- A search box uses one `aria-label` ("Search style gallery"), not a visually hidden label as well (D-7).
- State attributes: `aria-invalid="true"` exactly while the field's error shows; `aria-describedby` lists error, hint, addons and counter; `required` and `readonly` are native.
- The "Show" toggle keeps the label "Show" and reports its state with `aria-pressed`; `aria-controls` names the input.

### Announcements

The field announces nothing itself. Errors are read as its description; the error summary announces failed submits.

### Motion

Border colour and the invalid shadow transition over `--duration-fast`; under `prefers-reduced-motion: reduce` the tokens zero it, so the change is instant. Nothing moves.

## Content and internationalisation

- Labels are nouns in sentence case with no colon: "Email", "Phone", "New password" (form field).
- Placeholders show format only: "name@example.com". Never instructions that vanish on typing.
- Search `aria-label`s name what is searched: "Search style gallery", "Search matching braiders", "Search my appointments".
- Phone numbers are typed freely ("416-555-0148"); the page normalises them.
- Translatable inputs: `placeholder`, `aria-label` and the field's strings. Data values: Maya's name, email and phone, typed search terms.
- Prices are whole dollars typed as numbers ("240"); the `$` addon and the label carry the currency.

## Performance

- Change detection: `OnPush`, signal inputs, host bindings computed from signals; the template is empty.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/TextField.ts` renders Maya's account settings email, `<input hp-text-field type="email" autocomplete="email" value="maya.chen@example.com" aria-label="Email">`; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: `FormField` and `BookingForm` (form field and form layout CRDs); a `SearchBox` scenario renders the gallery search box with "knotless braids".
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: the height is fixed by the size (D-4), so focus, invalid and read-only states never change it; the invalid edge uses an inset shadow, not a thicker border.
- Weight: `@angular/core` and `@angular/forms` (`NgControl` type). No CDK.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `<input hp-text-field type="email" formControlName="email" autocomplete="email">` in the account settings "Email" field, when it renders, then the DOM holds a native `<input class="input" type="email" autocomplete="email">` with no wrapper, its `id` equals the label's `for`, its accessible name is "Email", and it measures 40 px tall. (L2-041)
- **AC-2** Given the "Email", "Name" and "Phone" fields in account settings, when they render, then their `autocomplete` values are `email`, `name` and `tel` exactly as the consumer wrote them. (L2-041)
- **AC-3** Given three text fields with `fieldSize` `sm`, `md` and `lg`, when they render, then they measure 32, 40 and 48 px tall with 14, 16 and 19 px text. (L2-041)
- **AC-4** Given the account settings form bound to Maya's details, when it renders, then the fields show "Maya Chen", "maya.chen@example.com" and "416-555-0148", and when Maya types a new phone number, then the form model holds it on each input event. (L2-014)

### States

- **AC-5** Given an enabled field, when the pointer hovers it, then its border changes to `--color-fg-muted`. (L2-041)
- **AC-6** Given the "Email" field focused by keyboard, when the ring shows, then the border and a 2 px outline with no offset are `--color-focus-ring`, and their contrast against `--color-bg-surface` is at least 3:1. (L2-041)
- **AC-7** Given the email field's form field shows "Enter an email address like name@example.com.", when it renders, then the input has `aria-invalid="true"`, a 2 px `--color-danger-solid` edge built from the border and a 1 px inset shadow, its height is unchanged, and the edge's contrast against `--color-bg-surface` is at least 3:1. (L2-041)
- **AC-8** Given a read-only field holding "HP-1048", when Maya tabs to it, then it takes focus, its fill is `--color-bg-surface-sunken` with a dashed border, and its value can be selected and copied but not changed. (L2-041)
- **AC-9** Given the phone control disabled through the forms API, when it renders, then the native `disabled` attribute is set, the fill is `--color-bg-subtle` with `--color-fg-disabled` text, Tab skips it, and its value "416-555-0148" is kept. (L2-041)
- **AC-10** Given an empty email field with `placeholder="name@example.com"`, when it renders, then the placeholder is `--color-fg-subtle` at 4.5:1 or more against the fill and the accessible name is still the label "Email". (L2-041)
- **AC-11** Given the account settings form whose save failed, when the failure alert shows, then every text field keeps the value Maya entered. (L2-014)

### Password

- **AC-12** Given the sign-in password holding "correcthorse" and a "Show" suffix button bound with `[(pressed)]` to `revealed`, when Maya activates "Show", then the input's `type` becomes `text`, the value and caret are unchanged, focus stays on the button and it reports `aria-pressed="true"`; activating it again restores `type="password"`. (L2-041)
- **AC-13** Given the sign-up password field, when Maya pastes a password from her password manager, then the full value is accepted. (L2-041)
- **AC-14** Given the sign-in form with focus in the password field, when Maya presses Enter, then the form is submitted once. (L2-011)

### Number and search

- **AC-15** Given "Maximum price" holding "150" with `step="10"`, when Maya presses ↑, then it holds "160", and typing "240" directly is also accepted. (L2-005)
- **AC-16** Given the style gallery search box holding "knotless braids", when Maya presses Enter in it, then the inline search form is submitted with that term. (L2-002)
- **AC-17** Given the gallery search holding "knotless braids", when Maya presses Esc, then the value is cleared. (L2-002)
- **AC-18** Given the gallery search box, when a screen reader reaches the input, then it announces the searchbox "Search style gallery" exactly once, and the search icon is not announced. (L2-041)

### Keyboard and focus

- **AC-19** Given a text field used outside a form field with `aria-describedby="search-help"`, when it renders, then the attribute is kept as written. (L2-041)

### Theming

- **AC-20** Given the dark theme, when a field renders on a form panel and in a filter row, then its fill resolves to `--palette-gray-900`, its border to `--palette-gray-450` at 3:1 or more against `--color-bg-surface` and `--color-bg-canvas`, and its value is at least 4.5:1 against the fill. (L2-041)
- **AC-21** Given the email field, when the theme switches from light to dark, then its fill, border and text change without a reload. (L2-042)
- **AC-22** Given Windows forced colours, when the fields render, then each has a `CanvasText` border and the focus ring is `Highlight`. (L2-041)

### Responsive

- **AC-23** Given the style gallery filter row on a 320 px viewport, when it renders, then the search box fills the row's width, "Find braiders" wraps onto the next line, and the page does not scroll horizontally. (L2-042)
- **AC-24** Given the booking request form at 768 px, when "Your email" and "Phone" render in a `.form-row`, then they share one row in two equal columns; below 768 px they stack. (L2-042)
- **AC-25** Given a 360 px viewport with text enlarged to 200 %, when the sign-in form renders, then the fields grow with their text, stay operable, and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-26** Given `prefers-reduced-motion: reduce`, when a field is hovered, focused or marked invalid, then the border change is instant. (L2-041)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/text-field/`; files `text-field.ts` (standalone component `TextField`, `selector: 'input[hp-text-field]'`, `template: ''`) and `search-box.ts` (`SearchBox`, `selector: 'div[hp-search-box]'`, `template: '<ng-content />'`). Export both from `public-api.ts`.
- Host bindings: `class.input`; `class.input--sm`, `class.input--lg`; `attr.type` (`revealed() && type() === 'password' ? 'text' : type()`); `attr.id`; `attr.aria-describedby` (consumer ids then the field's, or `null`); `attr.aria-invalid` (`'true'` or `null`).
- Injections: `HP_FORM_FIELD` (optional), `NgControl` (`{ self: true, optional: true }`), `ElementRef`. Register with the field in `ngOnInit`, unregister on destroy.
- Styles: port the `.input` rules (base, hover, focus, invalid, disabled, read-only, sizes, placeholder) from `docs/design-system/assets/components.css` as `:host(...)` rules, and add `line-height: var(--line-height-snug)` (D-4); `SearchBox` ports `.search`, `.search-box` and `.search .icon` / `.search .input` as `:host ::ng-deep > .icon` and `> .input`. `components.css` and the design-system page change in the same slice.
- No CDK primitive. Composes nothing.
- Perf-test scenarios `TextField.ts` and `SearchBox.ts` in `frontend/projects/perf-test/src/scenarios/`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Wrapper or native host, component or directive?* A component on the native `<input>` (`input[hp-text-field]`) with an empty template, so the host is the field, carries `.input`, keeps every native attribute and behaviour (autofill, implicit submission, spellcheck, the number spinner), and still owns its encapsulated styles. A wrapper would separate the `id` from the element the label targets and break the `.input-group` layout rules, which expect the input as a direct child.
- **D-2** *How does it work with Angular forms?* Through Angular's own value accessors on the same element (form field D-2); the component implements none. `type` is also an input (for D-5), so it must be written as a static attribute: Angular picks `NumberValueAccessor` by matching `input[type=number]` in the template, which a bound `[type]` does not satisfy.
- **D-3** *`size` or another name?* `fieldSize`. `size` is a native `<input>` attribute (visible width in characters); Angular writes static attributes to the DOM, so `size="sm"` would also land as an invalid native value. The button keeps `size` because buttons have no native `size`.
- **D-4** *The design system says fields are 40 px tall, but its stylesheet draws them taller. Which wins?* 40 px. Measured in Chromium, `--text-body`'s `--line-height-normal` (1.65) makes the md field 44 px, sm 33 px and lg 49 px, so a search box sits 4 px taller than the 40 px "Find braiders" button beside it and the "Show" button stretches to 44 px. The design system's stated sizes win over its drift: the field uses `--line-height-snug`, which the tokens reserve for "labels in controls", and every size measures its control height. The textarea keeps the body line height for reading.
- **D-5** *How does the password "Show" toggle work?* The consumer projects a `button[hp-button]` into the form field's suffix slot with `[(pressed)]` bound to a signal it also passes to the input's `revealed`. The input only switches its rendered `type`. This reuses the button's toggle exactly as its CRD defines it, keeps the label "Show" constant with `aria-pressed` (design system), and needs no button inside this component.
- **D-6** *Are date and time types offered?* No. The mocks' `datetime-local` "Preferred time" and free-text times are drift: the design system requires a choice of Nia's offered times (select or radio group), because a typed time can name a slot Nia never offered (L2-015, L2-021).
- **D-7** *The mocks' search box has a visually hidden label and an `aria-label`. Which?* One `aria-label` on the input, in a `div.search`, as the design system fixed; the hidden label made screen readers read the name twice.
- **D-8** *How do the field's ids combine with the consumer's?* `aria-describedby` and `aria-invalid` are aliased inputs, so a consumer's static values reach the component instead of being overwritten by its host bindings; consumer ids come first and the field's are appended. Outside a form field the consumer's values render unchanged.
- **D-9** *Native `maxlength`?* Never; see form field D-8. A typed or pasted value is never cut off.
- **D-10** *Who prevents small fields on phones?* The page, by choosing the size; the component does not resize by viewport. The design system reserves `sm` for dense rows and requires 16 px text when typing on phones.
- **D-11** *Does Enter in a search box need a script?* No. The search box sits in an inline form layout (`<form role="search">`), so Enter submits natively and the form layout emits `submitted`; Esc clearing is the platform's `type="search"` behaviour.
- **D-12** *Does the top bar's search use this?* Yes, the search box without `grow` (`.search` only), as `components.css` styles `.topbar .search`; the top bar CRD places it.
- **D-13** *Does the "Show" toggle carry the design system's eye icon?* No, the label "Show" alone. Measured with `--line-height-snug` fields: with the icon the password input keeps 183 px at 320 px but only 88 px at 360 px and 50 px at 320 px with 200 % text, which leaves almost no room for the value; without it the input keeps 211, 144 and 104 px. L2-042 requires the form to stay operable at 200 % text, and the word already names the action.

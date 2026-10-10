# Checkbox

| Field | Value |
|---|---|
| Selector | `label[hp-checkbox]`, `hp-checkbox-group` |
| Library path | `frontend/projects/components/src/lib/checkbox/` |
| Status | planned |
| Traces to | L2-034, L2-036, L2-041, L2-042 |
| Design system | [`checkbox.html`](../../design-system/components/checkbox.html) |
| Source mocks | [`dialogs/cookie-preferences/default`](../../mocks/dialogs/cookie-preferences/default.html), [`dialogs/cookie-preferences/busy`](../../mocks/dialogs/cookie-preferences/busy.html), [`dialogs/cookie-preferences/failed`](../../mocks/dialogs/cookie-preferences/failed.html) |
| Rendering | [`checkbox.html`](checkbox.html) |

## Purpose and scope

A checkbox turns an independent option on or off, and the choice takes effect when the person saves the form around it: "Remember my optional usage choices" in cookie preferences, "I’ve read Nia’s cancellation policy" on a booking request, "Email me when Nia replies", a row in Maya's appointment history table. A checkbox group holds several related checkboxes under one legend ("Styles to include") and reports the checked values as one list.

Use something else when:

- the setting applies the moment it changes, with no save button: use the [switch](switch.md);
- exactly one option must be chosen: use the [radio group](radio-group.md);
- the control filters what is on screen right away (style type on the gallery): use a filter [chip](chip.md).

Out of scope:

- The fieldset, legend, hint and error message around a group, and the error message under a single required checkbox. The [form field](form-field.md) owns them: `fieldset[hp-form-field]` renders `<fieldset class="field">`, `<legend>`, the hint and the error around a group, and `div[hp-form-field] choice` renders the error under a single checkbox. This component renders the box, its label and its description, and follows the form field's control contract (`HP_FORM_FIELD`) for ids, description and invalid state.
- When errors appear and what they say. The form field decides (its D-3: after submit, or once the control is dirty and touched) and the component reads the result through `HP_FORM_FIELD`; outside a field the consumer uses `invalid` and `describedBy`.
- Tri-state logic between a "Select all" parent and its rows. The table or page computes the parent's `checked` and `indeterminate`; the component renders and reports them.
- Saving. The dialog or form saves on its own button ("Save preferences") and keeps the duplicate-submission guard; the checkbox never saves anything.
- The error summary and the save-failure alert ("We couldn’t save this change."). The form layout inside the dialog renders the summary with its own copy ("Check 1 field before saving"; form-layout D-16), and the dialog renders the failure alert.

## Usage

Every use of `.choice` with a checkbox in `docs/mocks/`, plus the configurations the design system defines for screens that have no mock yet. The chip rows that also appear in the cookie mocks belong to the style gallery behind the dialog (see the chip CRD).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/cookie-preferences/default` | single, with description (D-4) | "Remember my optional usage choices"; description "Helps us improve search. You can change this any time." | checked, unchecked, hover, focus | raised (dialog panel) |
| `dialogs/cookie-preferences/busy` | single, with description | as above | checked and still enabled while "Save preferences" is busy (D-7) | raised |
| `dialogs/cookie-preferences/failed` | single, with description, under the dialog's "We couldn’t save this change." alert | as above | keeps the value Maya chose | raised |
| Booking request policy confirmation (design system *Variants* and *States*; no mock yet) | single, `required`, no description, inside a form field with an error | "I’ve read Nia’s cancellation policy"; error "Confirm you’ve read the policy to send your request." | unchecked, checked, invalid, focus | surface (form panel) |
| Notification choice (design system *Variants*) | single, `card`, with description | "Email me when Nia replies"; description "Updates about HP-1048 go to maya.chen@example.com." | checked, unchecked, hover, focus | surface |
| Style filter group (design system *Variants*, *Do and don't*) | `hp-checkbox-group`, vertical, inside a form field group with legend "Styles to include" | "Knotless braids", "Passion twists", "Cornrows" | checked, unchecked, group invalid | surface |
| Short one-word group (design system *Responsive*) | `hp-checkbox-group`, `orientation="horizontal"` | "Braids", "Twists" | as above; inline, wrapping at every width (D-9) | surface |
| Appointment history table (design system `table.html`, *Selectable*) | single, `hideLabel`, parent with `indeterminate` | "Select all appointments"; rows "Select HP-0992", "Select HP-0911", "Select HP-0874" | checked, unchecked, indeterminate | surface (table cell) |
| Disabled option (design system *States*) | single or in a group, `disabled` | "Unavailable option" | disabled checked and unchecked | surface |

Every row is buildable with the API below: one `label[hp-checkbox]` with `checked`, `indeterminate`, `disabled`, `invalid`, `required`, `card`, `hideLabel` and an optional `description`, optionally inside `hp-checkbox-group`, with every string projected or passed as an input.

## Anatomy

1. **Row** — `.choice` on the host `<label>`. Flex row, `--space-3` gap, box aligned to the first line of text, `--space-1` vertical padding, `min-height` `--target-min`. The whole row is the click target.
2. **Box** — the native `<input type="checkbox">`, drawn with `appearance: none`: `--choice-size` (20 px) square, `--radius-xs` corners, `--border-width-hairline` edge in `--color-border-strong` on `--color-bg-surface`.
3. **Check mark or bar** — the box's `::before`: a 12 px check (clip-path) when checked, a 12 × 2 px bar when indeterminate, both in `--color-fg-on-accent` on an `--color-accent` fill.
4. **Label** — a `<span>` holding the projected text. It is the accessible name (D-3).
5. **Text column (with a description only)** — `.choice__text`, a column with `--space-0-5` gap, holding the label `<span>` and the description `<small>` in `--color-fg-muted`.
6. **Card frame (optional)** — `.choice--card` on the host: `--space-4` padding, `--border-width-hairline` `--color-border-strong` edge, `--radius-md`, `--color-bg-surface`; checked adds an `--color-accent` edge and inset ring and an `--color-accent-subtle` fill.
7. **Group (optional)** — `hp-checkbox-group` with `.choice-group`: a column with `--space-1` gap, or `.choice-group--inline` (a row that wraps at every width, `--space-2` × `--space-6` gaps) when horizontal.

Host: `label[hp-checkbox]` is an attribute selector, so the host **is** the native `<label class="choice">` and the template renders the `<input>` and the text inside it (D-1). `hp-checkbox-group` is an element selector whose host carries `.choice-group`; it is a layout and value container with no role of its own, rendered inside the form field's `<fieldset>` (D-10).

## API

### Inputs — `label[hp-checkbox]`

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `checked` | `boolean` (two-way `model`) | `false` | no | Mirrors the native `checked` property. Each user activation flips it and emits `checkedChange`. Ignored inside a group, which owns the value (D-5). |
| `indeterminate` | `boolean` (two-way `model`) | `false` | no | Sets the native `indeterminate` property (script only; there is no attribute). A user activation clears it and emits `indeterminateChange(false)`, as the browser does (D-8). |
| `disabled` | `boolean` (`booleanAttribute`) | `false` | no | Sets native `disabled` on the input. Also set by `setDisabledState` from Angular forms and by a disabled group. |
| `invalid` | `boolean` (`booleanAttribute`) | `false` | no | Sets `aria-invalid="true"` on the input (`null` when false) while this input, or inside a `div[hp-form-field] choice` the field's `invalid()`, is true (D-6). A group sets it on every child. |
| `describedBy` | `string \| undefined` | `undefined` | no | Space-separated ids the consumer adds to the input's `aria-describedby`, after the description's id. Inside a `div[hp-form-field] choice` the field's `describedBy()` ids (its error first, then its hint) follow them, as the form field contract requires (D-6). Never set on options inside a group. |
| `required` | `boolean` (`booleanAttribute`) | `false` | no | Sets native `required` on the input (D-12). Forms render with `novalidate`, so no browser bubble appears; the requirement is exposed to assistive technology. |
| `description` | `string \| undefined` | `undefined` | no | When set, wraps the label in `.choice__text` and renders `<small>` with this text, referenced by `aria-describedby` (D-2, D-3). |
| `card` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.choice--card` to the host. |
| `hideLabel` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.visually-hidden` to the label `<span>`, for a table selection column; the name stays (D-11). |
| `value` | `string` | `'on'` | inside a group | Written to the native `value` attribute; inside a group it is the item reported in the group's value. Must be unique within a group. |
| `name` | `string \| undefined` | `undefined` | no | Written to the native `name` attribute for native form posts; Angular forms do not need it. |

### Inputs — `hp-checkbox-group`

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `value` | `string[]` (two-way `model`) | `[]` | no | The `value` of every checked child, in the children's DOM order. A child is checked when its `value` is in the list. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | no | Horizontal adds `.choice-group--inline`: a row that wraps at every width (D-9). Use it only for two to four one-word options. |
| `disabled` | `boolean` (`booleanAttribute`) | `false` | no | Disables every child. Also set by `setDisabledState`. |
| `invalid` | `boolean` (`booleanAttribute`) | `false` | no | Sets `aria-invalid="true"` on every child input (D-13). The error text and the fieldset's `aria-describedby` belong to the form field. |

- Inputs are signal inputs (`input()`, `model()`); booleans accept bare attributes.
- `aria-label`, `aria-labelledby` and `id` on a group host are plain attributes; when the group is not inside a fieldset with a legend, the consumer names it with `aria-labelledby` and the group then takes `role="group"` (D-10).
- Form field contract (`HP_FORM_FIELD`, defined by the form field CRD): a single checkbox inside `div[hp-form-field] choice` injects the token, uses the field's `controlId()` as its input `id`, merges `describedBy()` and `invalid()` as above, and registers one `FormFieldControl` (`id`, its `NgControl`, `focus()`) so the error summary can focus it. Inside `fieldset[hp-form-field]`, `hp-checkbox-group` registers instead, with the checked (else first) child's input id and the group's `NgControl`, sets `aria-invalid` on every child while `invalid()`, and never puts the field's ids on the children: the field describes the `<fieldset>`. Outside a field, each input gets a generated id `hp-checkbox-{n}`.
- Angular forms: `label[hp-checkbox]` implements `ControlValueAccessor` with a `boolean` value; `hp-checkbox-group` implements it with a `string[]` value (D-5). `writeValue` never emits `checkedChange` or `valueChange`; the control is marked touched when focus leaves the box (single) or the group.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `checkedChange` | `boolean` | The person toggles a single checkbox (click, Space, click on its label or description). Part of the `checked` model. Not emitted inside a group or on `writeValue`. |
| `indeterminateChange` | `boolean` | A user activation clears `indeterminate`; payload `false`. |
| `valueChange` (group) | `string[]` | The person toggles any child of the group. Part of the group's `value` model. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default (`label[hp-checkbox]`) | Text, optionally with inline emphasis | The label. Declared once inside an `<ng-template>` and rendered with `ngTemplateOutlet` in both the plain and the described layout. It is the accessible name. |
| default (`hp-checkbox-group`) | `label[hp-checkbox]` children only | Declared once. Children register with the group through dependency injection. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Single | — (`.choice`) | One independent option: "Remember my optional usage choices", "I’ve read Nia’s cancellation policy". |
| With description | `.choice__text` inside | An option whose consequence needs a sentence: "Helps us improve search. You can change this any time." |
| Card | `.choice--card` | A weightier choice that reads as a block: "Email me when Nia replies". |
| Group, vertical | `hp-checkbox-group.choice-group` | Several related options under one legend: "Styles to include". |
| Group, horizontal | `.choice-group--inline` | Two to four one-word options, inline and wrapping at every width. |
| Hidden label | `.visually-hidden` on the label span | A selection column where the row itself shows what is selected. |

Checkboxes have one size: a 20 px box (`--choice-size`) in a row at least `--target-min` (24 px) tall. The width is the container's; the label wraps under itself.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Unchecked | `checked` false | `--color-bg-surface` box, `--color-border-strong` edge | Checkbox, not checked |
| Checked | native `:checked` | `--color-accent` fill and edge, check mark in `--color-fg-on-accent` | Checkbox, checked |
| Indeterminate | native `:indeterminate` | `--color-accent` fill and edge, horizontal bar in `--color-fg-on-accent` | Checkbox, mixed |
| Hover | `.choice:hover` (anywhere on the row) | Edge `--color-accent`; checked keeps its fill | — |
| Focus | `:focus-visible` on the input | `--focus-ring-width` outline in `--color-focus-ring`, offset `--focus-ring-offset`, around the box only | Focus on the checkbox |
| Disabled | native `disabled` | `--color-bg-subtle` box, `--color-border-default` edge, label and description `--color-fg-disabled`, `cursor: not-allowed`, no hover change | Disabled; removed from the tab order |
| Disabled checked | `disabled` + `checked` | Same sunken box; the check mark stays visible | Disabled, checked |
| Invalid | `aria-invalid="true"` | Edge `--color-danger-solid` plus a 1 px inset ring in the same colour | Invalid; error text read through `aria-describedby` |
| Card checked | `.choice--card:has(input:checked)` | Card edge and inset ring `--color-accent`, fill `--color-accent-subtle` | — |
| Required | native `required` | No visual change; the form field's label or the error says why | Required |
| Busy form | the dialog's save button is busy | No change: the checkbox stays enabled and keeps its value (D-7) | — |
| Forced colours | `(forced-colors: active)` | Edge `CanvasText` (system mapping); checked box `Highlight` fill with `forced-color-adjust: none`; focus ring `Highlight` | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Fill and edge change instantly (`--duration-fast` is zeroed by the tokens) | — |
| Narrow container or enlarged text | container narrower than the label | The text wraps under itself, never under the box; the box stays top-aligned with the first line; a word longer than the column breaks (D-15) | — |

Surface contexts: the box reads `--color-bg-surface` on every surface. In a dialog panel (`--color-bg-surface-raised`) the checked fill and the box edge keep 3:1 against the panel; both pairs are listed under *Colour*.

## Markup

Rendered DOM. Classes, attributes and the element order are the e2e contract; generated ids (`hp-checkbox-1-…`) are free to change.

```html
<!-- rendered: single, no description (booking request policy), unchecked, required -->
<label class="choice">
  <input type="checkbox" required aria-labelledby="hp-checkbox-1-label">
  <span id="hp-checkbox-1-label">I’ve read Nia’s cancellation policy</span>
</label>
```

```html
<!-- rendered: with description (cookie preferences), checked -->
<label class="choice">
  <input type="checkbox" aria-labelledby="hp-checkbox-2-label" aria-describedby="hp-checkbox-2-description">
  <span class="choice__text">
    <span id="hp-checkbox-2-label">Remember my optional usage choices</span>
    <small id="hp-checkbox-2-description">Helps us improve search. You can change this any time.</small>
  </span>
</label>
```

`checked` and `indeterminate` are properties, so a checked box has no `checked` attribute in the live DOM; e2e tests read them with `toBeChecked()` and the `:indeterminate` selector.

```html
<!-- rendered: invalid single checkbox inside div[hp-form-field] choice (the field renders the error) -->
<div class="field">
  <label class="choice">
    <input type="checkbox" id="hp-field-6-control" required aria-invalid="true" aria-labelledby="hp-checkbox-1-label" aria-describedby="hp-field-6-error">
    <span id="hp-checkbox-1-label">I’ve read Nia’s cancellation policy</span>
  </label>
  <span class="field__error" id="hp-field-6-error">Confirm you’ve read the policy to send your request.</span>
</div>
```

```html
<!-- rendered: card, disabled, hidden label (table cell) -->
<label class="choice choice--card">
  <input type="checkbox" aria-labelledby="hp-checkbox-3-label" aria-describedby="hp-checkbox-3-description">
  <span class="choice__text">
    <span id="hp-checkbox-3-label">Email me when Nia replies</span>
    <small id="hp-checkbox-3-description">Updates about HP-1048 go to maya.chen@example.com.</small>
  </span>
</label>
<label class="choice"><input type="checkbox" disabled aria-labelledby="hp-checkbox-4-label"><span id="hp-checkbox-4-label">Unavailable option</span></label>
<label class="choice"><input type="checkbox" aria-labelledby="hp-checkbox-5-label"><span id="hp-checkbox-5-label" class="visually-hidden">Select HP-0992</span></label>
```

```html
<!-- rendered: group inside fieldset[hp-form-field] -->
<fieldset class="field">
  <legend>Styles to include</legend>
  <hp-checkbox-group class="choice-group">
    <label class="choice"><input type="checkbox" value="knotless" aria-labelledby="hp-checkbox-6-label"><span id="hp-checkbox-6-label">Knotless braids</span></label>
    <label class="choice"><input type="checkbox" value="passion-twists" aria-labelledby="hp-checkbox-7-label"><span id="hp-checkbox-7-label">Passion twists</span></label>
    <label class="choice"><input type="checkbox" value="cornrows" aria-labelledby="hp-checkbox-8-label"><span id="hp-checkbox-8-label">Cornrows</span></label>
  </hp-checkbox-group>
</fieldset>
```

A horizontal group adds `choice-group--inline` to the group host; an invalid group adds `aria-invalid="true"` to every child input, and the field adds `aria-describedby` with its error id to the `<fieldset>`. Inputs outside a field carry generated ids (`hp-checkbox-{n}`), omitted above for brevity.

Consumer templates:

```html
<!-- consumer: cookie preferences dialog -->
<div hp-form-field choice label="Remember my optional usage choices">
  <label hp-checkbox formControlName="optionalUsage" description="Helps us improve search. You can change this any time.">Remember my optional usage choices</label>
</div>

<!-- consumer: booking request policy confirmation; the field shows the error and sets invalid and the description -->
<div hp-form-field choice label="Cancellation policy" [errorMessages]="{ required: 'Confirm you’ve read the policy to send your request.' }">
  <label hp-checkbox required formControlName="policyRead">I’ve read Nia’s cancellation policy</label>
</div>

<!-- consumer: card -->
<label hp-checkbox card [(checked)]="emailReplies" description="Updates about HP-1048 go to maya.chen@example.com.">Email me when Nia replies</label>

<!-- consumer: group inside the form field's group variant -->
<fieldset hp-form-field label="Styles to include" [errorMessages]="{ required: 'Choose at least one style.' }">
  <hp-checkbox-group formControlName="styles">
    <label hp-checkbox value="knotless">Knotless braids</label>
    <label hp-checkbox value="passion-twists">Passion twists</label>
    <label hp-checkbox value="cornrows">Cornrows</label>
  </hp-checkbox-group>
</fieldset>

<!-- consumer: table selection column -->
<label hp-checkbox hideLabel [checked]="allSelected()" [indeterminate]="someSelected()" (checkedChange)="selectAll($event)">Select all appointments</label>
<label hp-checkbox hideLabel [(checked)]="row.selected">Select {{ row.reference }}</label>
```

## Design

- Row: flex, `align-items: flex-start`, gap `--space-3`, `padding-block` `--space-1`, `min-height` `--target-min`, font `--text-body`, `cursor: pointer`.
- Box: `--choice-size` (20 px) square, `margin-top` `--space-0-5` so it centres on the first line of `--text-body`, `--border-width-hairline` edge, `--radius-xs`, `display: grid; place-content: center` for the mark.
- Mark: 0.75 rem check drawn with `clip-path`; indeterminate bar 0.75 rem × `--border-width-thick`.
- Description: `<small>` in `--text-body-sm` at `--color-fg-muted`, `--space-0-5` below the label.
- Wrapping: the label `<span>` and `.choice__text` (`.choice > :not(input)`) have `min-width: 0` and `overflow-wrap: anywhere`, so a word longer than the column (an email address) breaks instead of widening the page; a card also has `flex-wrap: wrap` with its text at `flex: 1 1 8em`, so when fewer than 8 em remain beside the box the text moves under it and takes the card's full width (D-15).
- Card: padding `--space-4`, radius `--radius-md`, edge `--border-width-hairline`.
- Group: column gap `--space-1`; horizontal is a row at every width that wraps with `--space-2` row gap and `--space-6` column gap.
- Motion: `background-color` and `border-color` transition over `--duration-fast` with `--ease-standard`.
- Layer: none.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--choice-size` | 1.25 rem (20 px) | A touch-heavy kiosk surface only (design system *Theming*); never per instance |

The box colours are read directly from semantic tokens (`--color-bg-surface`, `--color-border-strong`, `--color-accent`, `--color-fg-on-accent`, `--color-danger-solid`), as `components.css` does; the component adds no further component tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Box fill | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Box edge | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-450` |
| Checked and indeterminate fill, hover edge | `--color-accent` | `--palette-plum-600` | `--palette-plum-300` |
| Check mark and bar | `--color-fg-on-accent` | `--palette-white` | `--palette-plum-950` |
| Invalid edge and ring | `--color-danger-solid` | `--palette-red-600` | `--palette-red-300` |
| Disabled box | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Disabled edge | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Disabled label | `--color-fg-disabled` | `--palette-gray-400` | `--palette-gray-600` |
| Label | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Description | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Card checked fill | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Box edge on a card or form panel |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Box edge in a dialog |
| `--color-accent` | `--color-bg-surface` | 3:1 | Checked box on a card |
| `--color-accent` | `--color-bg-surface-raised` | 3:1 | Checked box in a dialog |
| `--color-fg-on-accent` | `--color-accent` | 4.5:1 | Check mark on the fill (held to the text minimum) |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid edge |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Label |
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Label in a dialog |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Description |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Description in a dialog |
| `--color-fg-default` | `--color-accent-subtle` | 4.5:1 | Label on a checked card |
| `--color-fg-muted` | `--color-accent-subtle` | 4.5:1 | Description on a checked card |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on a card |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus ring in a dialog |

Disabled boxes and labels are exempt from the contrast minimums (WCAG 1.4.3 and 1.4.11 inactive components).

Forced colours: borders map to `CanvasText` through the tokens, a checked box is painted `Highlight` with `forced-color-adjust: none` (`components.css`), and `--color-focus-ring` maps to `Highlight`. The check mark keeps its `--color-fg-on-accent` value inside the `Highlight` fill.

## Responsive behaviour

- The single checkbox has no breakpoint rules: the label wraps under itself at every width and the box stays aligned with the first line.
- A vertical group stacks at every width. A horizontal group runs inline and wraps at every width (D-9); "Braids" and "Twists" share one row at 320 px, and at 200 % text each takes its own row.
- Measured in Chromium: the cookie checkbox with its description fits a 320 px dialog at 100 % text on two lines plus the description, and at 200 % text wraps to a 164 px column with no horizontal scroll and the box still top-aligned.
- Measured in Chromium at 320 and 360 px with 200 % text, without the D-15 rules the card "Email me when Nia replies" with "Updates about HP-1048 go to maya.chen@example.com." in the form panel pushed the page to 535 px wide, because the email address cannot wrap and the form panel's and card's padding leave about 70 px beside the box. With the D-15 rules the text moves under the box into a 132 px column at 360 px (92 px at 320 px), the address breaks inside the card and the page does not scroll. At 100 % text the card renders as before at 360 and 768 px; at 320 px the description, which overflowed the card's padding by 6 px, now wraps one line earlier.
- Targets: the whole row, at least `--target-min` (24 px) tall, toggles the box; the description is inside the label and toggles it too. In a table cell the hidden-label row is still 24 px or more.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; every target is at least 24 × 24 CSS px.

## Accessibility

### Role and pattern

A native `<input type="checkbox">` inside its `<label>`, following the [APG Checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/), including the mixed state for a "Select all" parent. Groups sit in the form field's `<fieldset>` with a `<legend>`, which names the group; the group host adds no role inside a fieldset.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves to and from each checkbox in turn; every checkbox in a group is its own tab stop. Disabled checkboxes are skipped. |
| <kbd>Space</kbd> | Toggles the focused checkbox; a mixed checkbox becomes checked. |

### Focus

- Focus lands on the native input; the ring surrounds the 20 px box only, `--focus-ring-width` of `--color-focus-ring` offset by `--focus-ring-offset`, and shows on keyboard focus only.
- Toggling never moves focus. A box that becomes disabled while focused loses focus to the body, as the browser does; forms avoid disabling while focused.

### Labelling

- The accessible name is the label text only, through `aria-labelledby` pointing at the label `<span>` (D-3). The description is the accessible description, through `aria-describedby`, followed by any `describedBy` ids (the form field's error).
- The visible label equals the name, so WCAG 2.5.3 Label in Name holds; a hidden label in a table names its row ("Select HP-0992").
- Labels are statements that are true when checked; required checkboxes say why in their error.
- State attributes: native `checked`, `indeterminate`, `disabled`, `required`; `aria-invalid="true"` while the error shows.

### Announcements

The checkbox has no live region. The dialog or form announces the error summary, the save result and any change in a group's count.

### Motion

Fill and edge transition over `--duration-fast`. Under `prefers-reduced-motion: reduce` the tokens zero `--duration-fast`, so the change is instant. Nothing else moves.

## Content and internationalisation

- Labels state the option positively and stay true when checked: "Email me when Nia replies", never "Don’t email me".
- Consequences go in the description, not the label: "Helps us improve search. You can change this any time."
- Legends name the group ("Styles to include"); that copy belongs to the form field.
- Translatable inputs: the projected label, `description`. Data values: the reference and email in "Updates about HP-1048 go to maya.chen@example.com.", the row reference in "Select HP-0992". The component renders no copy of its own.
- Length: labels and descriptions wrap without limit; the box never moves to a second line. Copy is English only today and no L2 requirement covers translation.
- Dates and times inside a description follow the product format ("Sat 24 Oct at 10:00 am").

## Performance

- Change detection: `OnPush`, signal inputs and models, host bindings computed from signals; ids generated once per instance; no work in the template beyond signal reads.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Checkbox.ts` renders the cookie preferences checkbox, `<label hp-checkbox checked description="Helps us improve search. You can change this any time.">Remember my optional usage choices</label>`; `frontend/projects/perf-test/src/scenarios/CheckboxGroup.ts` renders the "Styles to include" group with "Knotless braids" and "Passion twists" checked and "Cornrows" unchecked. Iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep each at roughly 100–300 ms.
- Composite scenarios: none yet; the table CRD names the selectable history table that repeats the hidden-label checkbox.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: checking, indeterminate and invalid change colours and a pseudo-element only; the box size never changes, so nothing shifts.
- Weight: `@angular/core`, `@angular/common` (`NgTemplateOutlet`) and `@angular/forms` (`NG_VALUE_ACCESSOR`) only. No CDK.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `<label hp-checkbox description="Helps us improve search. You can change this any time.">Remember my optional usage choices</label>` in the cookie preferences dialog, when it renders, then the host is the native `<label class="choice">` holding an `<input type="checkbox">` and a `.choice__text` column with the label `<span>` and the description `<small>`, the checkbox's accessible name is "Remember my optional usage choices" and its description is "Helps us improve search. You can change this any time." (L2-034)
- **AC-2** Given `<label hp-checkbox>I’ve read Nia’s cancellation policy</label>` with no description, when it renders, then the label holds the input followed directly by one `<span>` with the text and there is no `.choice__text` or `<small>` element. (L2-041)
- **AC-3** Given an unchecked checkbox in the booking form panel, when it is measured, then the box is 20 × 20 px with `--radius-xs` corners, a 1 px `--color-border-strong` edge on `--color-bg-surface`, a `--space-3` gap before the label, and the row is at least 24 px tall. (L2-041)
- **AC-4** Given a `card` checkbox "Email me when Nia replies" with the description "Updates about HP-1048 go to maya.chen@example.com.", when Maya checks it, then the host has `.choice--card`, its edge and inset ring become `--color-accent` and its fill `--color-accent-subtle`, and the label keeps at least 4.5:1 against that fill. (L2-041)

### States

- **AC-5** Given the cookie preferences checkbox unchecked, when Maya clicks the description text, then the box becomes checked with an `--color-accent` fill and a `--color-fg-on-accent` check mark, and `checkedChange` emits `true` once. (L2-034)
- **AC-6** Given an unchecked checkbox, when the pointer hovers anywhere on its row, then the box edge becomes `--color-accent`, and when the checkbox is disabled, then hovering changes nothing. (L2-041)
- **AC-7** Given the history table's "Select all appointments" checkbox with `indeterminate` true because one of three rows is selected, when Maya presses Space on it, then it shows the check mark instead of the bar, `checked` is true, `indeterminate` is false and `indeterminateChange` emits `false`. (L2-041)
- **AC-8** Given `<label hp-checkbox disabled>Unavailable option</label>`, when it renders, then the input has native `disabled`, the box is `--color-bg-subtle` with a `--color-border-default` edge, the label is `--color-fg-disabled`, Tab skips it and clicking the row does not change it. (L2-041)
- **AC-9** Given the booking request's required "I’ve read Nia’s cancellation policy" left unchecked inside `div[hp-form-field] choice`, when Maya sends the request and the field shows its error, then the input has `aria-invalid="true"`, its box shows a `--color-danger-solid` edge and inset ring, and a screen reader reads "Confirm you’ve read the policy to send your request." as its description. (L2-036)
- **AC-10** Given Maya unchecked "Remember my optional usage choices" and pressed "Save preferences", when the save fails and the dialog shows "We couldn’t save this change.", then the checkbox is still unchecked, still enabled and has not emitted `checkedChange`. (L2-034)
- **AC-11** Given "Save preferences" is busy, when Maya looks at the dialog, then the checkbox keeps the value she chose, is not disabled and still takes focus. (L2-036)

### Forms and groups

- **AC-12** Given a saved preference of `false`, when the dialog opens with `[formControl]` initialised to `false`, then the box is unchecked and `checkedChange` has not emitted; and when Maya presses Space, then the control value becomes `true` and the control is dirty, and when focus leaves the box, then the control is touched. (L2-034)
- **AC-13** Given `<hp-checkbox-group>` bound to a control whose value is `['knotless']` inside the fieldset "Styles to include", when Maya checks "Passion twists" with Space, then the control value becomes `['knotless', 'passion-twists']` and a screen reader reports the group "Styles to include" and "Passion twists, checkbox, checked". (L2-041)
- **AC-14** Given the group with `invalid` true, when it renders, then every child input has `aria-invalid="true"` and shows the `--color-danger-solid` edge, and setting `invalid` false removes the attribute from all of them. (L2-036)
- **AC-15** Given a group with `orientation="horizontal"` holding "Braids" and "Twists", when the viewport is 360 px or 768 px, then they sit on one row with a `--space-6` gap between them, and when the viewport is 320 px with text enlarged to 200 %, then each wraps onto its own row and the page does not scroll horizontally. (L2-042)

### Keyboard and focus

- **AC-16** Given the "Styles to include" group, when Maya presses Tab from the legend's preceding field, then focus lands on "Knotless braids", the next Tab lands on "Passion twists", and Space toggles only the focused checkbox. (L2-041)
- **AC-17** Given a checkbox focused by keyboard in the cookie preferences dialog, when the ring shows, then it is a 2 px `--color-focus-ring` outline offset 2 px around the box only, with at least 3:1 against `--color-bg-surface-raised`, and clicking the row shows no ring. (L2-041)

### Screen readers

- **AC-18** Given the cookie checkbox with its description inside `div[hp-form-field] choice` while the field shows an error, when a screen reader reads it, then the name is only the label text and the description is the description text followed by the field's error text, in that order. (L2-041)
- **AC-19** Given `<label hp-checkbox hideLabel>Select HP-0992</label>` in a table cell, when it renders, then the label `<span>` has `.visually-hidden`, nothing but the box is visible, the accessible name is "Select HP-0992" and the row is at least 24 × 24 px. (L2-041)

### Theming

- **AC-20** Given a checked checkbox in a dialog, when the theme switches from light to dark, then the fill changes from plum 600 to plum 300 and the mark from white to plum 950 without a reload, the checked fill keeps at least 3:1 against `--color-bg-surface-raised` and the unchecked edge at least 3:1 against `--color-bg-surface`. (L2-042)
- **AC-21** Given Windows forced colours, when a checked and an unchecked checkbox render, then the unchecked box has a `CanvasText` edge, the checked box a `Highlight` fill, and the focus ring is `Highlight`. (L2-041)

### Responsive

- **AC-22** Given the cookie preferences dialog on a 320 px viewport with text enlarged to 200 %, when the checkbox with its description renders, then the page does not scroll horizontally, the whole label and description are visible wrapped under each other, and the box stays aligned with the first line of the label. (L2-042)

- **AC-23** Given the card checkbox "Email me when Nia replies" described "Updates about HP-1048 go to maya.chen@example.com." in the booking form panel on a 360 px viewport with text enlarged to 200 %, when it renders, then the label and description move under the box, the email address breaks inside the card, and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-24** Given `prefers-reduced-motion: reduce`, when a checkbox is checked or hovered, then the fill and edge change instantly. (L2-041)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/checkbox/`; files `checkbox.ts` exporting `Checkbox` (`selector: 'label[hp-checkbox]'`) and `checkbox-group.ts` exporting `CheckboxGroup` (`selector: 'hp-checkbox-group'`), both standalone, `OnPush`, with scoped `styles` that port `.choice`, `.choice input…`, `.choice__text`, `.choice--card`, `.choice-group` and `.choice-group--inline` from `docs/design-system/assets/components.css` using `:host` selectors. Export both from `public-api.ts`. The option-row rules (`.choice`, the box, `.choice__text`, `.choice--card`) are shared with the radio group's options: keep them in one shared style constant in the library that both components include, never a copy.
- `Checkbox` template: `<ng-template #label><ng-content /></ng-template>`, the `<input>`, then `@if (description())` a `.choice__text` span holding `<span [id]="labelId">` with `ngTemplateOutlet` and `<small [id]="descriptionId">`, `@else` the `<span [id]="labelId">` with the same outlet. The slot is declared once (AGENTS.md).
- Input bindings: `[checked]`, `[indeterminate]` (property), `[disabled]`, `[required]`, `[attr.aria-invalid]`, `[attr.aria-labelledby]`, `[attr.aria-describedby]` (description id then `describedBy`, `null` when empty), `[attr.value]`, `[attr.name]`; `(change)` updates the models and the forms callback; `(blur)` calls `onTouched`.
- Host bindings: `class.choice` always, `class.choice--card` from `card`.
- Group: `CheckboxGroup` provides an injection token that each `Checkbox` injects optionally; a child inside a group derives `checked` from the group value and reports toggles to the group. `class.choice-group` always, `class.choice-group--inline` from `orientation`; `attr.role` is `'group'` only when the host has `aria-labelledby` and no `fieldset` ancestor (D-10). The inline rule has no media query (D-9).
- Forms: provide `NG_VALUE_ACCESSOR` with `forwardRef` on both classes (D-5). For the form field registration, read the control's `NgControl` lazily from the `Injector` (`injector.get(NgControl, null, { self: true })` after construction), because injecting it in the constructor of a value accessor creates a dependency cycle.
- Form field: inject `HP_FORM_FIELD` optionally (`{ optional: true, skipSelf: false }`); a `Checkbox` inside a `CheckboxGroup` never registers with the field, the group does.
- Development check: in development mode a `hp-checkbox-group` that is neither inside a `fieldset` with a `legend` nor named by `aria-labelledby` logs a `console.error` naming `hp-checkbox-group` (D-10).
- Wrapping (D-15): the ported rules carry `min-width: 0; overflow-wrap: anywhere` on the label span and `.choice__text` (`.choice > :not(input)`), and `flex-wrap: wrap` on `.choice--card` with `flex: 1 1 8em` on its text, exactly as `docs/design-system/assets/components.css` defines them.
- Ids: a module-level counter gives `hp-checkbox-{n}-label` and `hp-checkbox-{n}-description`.
- No CDK primitive. Composes nothing.
- Perf-test scenarios `Checkbox.ts` and `CheckboxGroup.ts` in `frontend/projects/perf-test/src/scenarios/`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is the host a wrapper element or the native label?* The native `<label>`, through the attribute selector `label[hp-checkbox]`, with `.choice` on the host. The design system's markup is `<label class="choice"><input>…</label>`; `.choice-group` lays out `.choice` labels as its direct children, `.choice--card:has(input:checked)` styles the label, and the table puts the label straight into a cell. The native label also makes every click on the text toggle the box with no script. A group is a composite, so it uses the element selector `hp-checkbox-group`, whose host carries `.choice-group`.
- **D-2** *Is the description a slot or an input?* An input, `description`. It needs an id for `aria-describedby` (D-3), and the component renders two different structures (with and without `.choice__text`) exactly as the design system shows; a string input lets it choose the structure without projecting a second slot in two branches.
- **D-3** *Is the description part of the accessible name?* No. The design system puts the description inside the label so it is clickable, which by default makes it part of the name ("Remember my optional usage choices Helps us improve search…"). The input names itself with `aria-labelledby` pointing at the label span and describes itself with `aria-describedby` pointing at the `<small>`, so screen readers hear a short name and the consequence as a description, while the DOM stays the design system's.
- **D-4** *Does the cookie preferences checkbox carry a description?* Yes. The original mock had none; the design system's anatomy and *Do and don't* give the copy "Helps us improve search. You can change this any time.", and the cookie preferences mocks now show it. The component keeps the description optional; the cookie dialog passes it.
- **D-5** *How does the checkbox work with Angular forms?* `label[hp-checkbox]` implements `ControlValueAccessor` with a `boolean` value and `hp-checkbox-group` with a `string[]` value (the checked children's `value`s in DOM order). The `checked` and `value` models stay for template-only use; `writeValue` updates them without emitting. A child inside a group is controlled by the group and ignores its own `checked` and form binding. This matches the radio group (`string | null`) and the switch (`boolean`), so the forms agent can rely on one pattern.
- **D-6** *Does the component decide when it is invalid?* No. Inside a form field it follows the form field's control contract: `aria-invalid` mirrors the field's `invalid()` (which applies the field's timing, its D-3) and the field's `describedBy()` ids follow the component's own. Outside a field, the `invalid` and `describedBy` inputs do the same job for a consumer. The component never reads `NgControl` validity itself, so errors never appear while the person is still choosing. The description's own id comes first, because it belongs to the control; the field's error comes next, ahead of its hint, as the field requires.
- **D-7** *Does the checkbox disable itself while the dialog is busy?* No. The busy mock keeps it enabled, L2-036 asks to preserve work, and the dialog's busy button already blocks a second save.
- **D-8** *Who computes the indeterminate state?* The consumer. The component exposes `indeterminate` as a model, renders it through the native property, and clears it on user activation as the browser does.
- **D-9** *Does a horizontal group stack on phones?* No: `.choice-group--inline` is a wrapping row at every width, and the checkbox page now says so. The checkbox page once said horizontal groups stack below 768 px, but the class is shared with the radio group, whose D-8 measured the wrapping rating at 320 and 360 px and keeps it horizontal; a media query on the shared class would stack the rating too, and a second modifier for the same layout would add API for no gain. Horizontal is only for two to four one-word options, which share one row at 320 px ("Braids", "Twists") and wrap one per row at 200 % text with no horizontal scroll; anything longer uses the vertical group.
- **D-10** *Does the group render a fieldset or a role?* Neither, inside a fieldset: `fieldset[hp-form-field]` renders the `<fieldset class="field">`, `<legend>`, hint and error, and the legend names the group (form field contract, group rules). Outside a fieldset the consumer must pass `aria-labelledby`, and the host then takes `role="group"`; with neither, development mode logs an error.
- **D-11** *How does a table name a checkbox without visible text?* With `hideLabel`, which keeps the label span in the DOM with `.visually-hidden`, exactly as the design system's table markup does. The row stays at least 24 px tall.
- **D-12** *Native `required` or `aria-required`?* Native `required` on a single checkbox; forms use `novalidate`, so the browser shows no bubble and the requirement is still exposed. A group has no `required` input: native `required` on each child would demand every box, so "choose at least one" is a validator the consumer attaches to the group's control, and its error goes through `invalid`.
- **D-13** *How does an invalid group show?* Every child input gets `aria-invalid="true"` and the danger edge, mirroring the radio group's design-system rule; the error text is linked once, from the fieldset.
- **D-14** *Can a checked box be invalid?* Yes, if the form says so (for example a group with a limit); it then shows the accent fill with the danger edge and ring, because `components.css` applies the invalid edge after the checked one. The design system's matrix leaves the cell empty; no current screen needs it.
- **D-15** *What happens to a word longer than the label column?* It breaks. Without a wrapping rule, a flex item's minimum width is its longest word. Measured in Chromium at 320 and 360 px with 200 % text, the card description's "maya.chen@example.com" widened the page to 535 px and made it scroll horizontally, which breaks L2-042. Breaking alone is not enough in a card: the form panel's and the card's padding leave about 70 px beside the box at 360 px with 200 % text, so even "Email" would break. The label span and `.choice__text` therefore get `min-width: 0; overflow-wrap: anywhere`, and a card gets `flex-wrap: wrap` with its text at `flex: 1 1 8em`, so the text moves under the box when fewer than 8 em remain beside it. `components.css` carries these rules and the checkbox page documents them. Measured, this changes nothing at 100 % text at 360 and 768 px, where every label wraps between words. The radio group's options share the rules through the shared choice styles.

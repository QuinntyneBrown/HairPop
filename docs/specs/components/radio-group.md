# Radio group

| Field | Value |
|---|---|
| Selector | `hp-radio-group`, `label[hp-radio]` |
| Library path | `frontend/projects/components/src/lib/radio-group/` |
| Status | planned |
| Traces to | L2-015, L2-025, L2-036, L2-041, L2-042 |
| Design system | [`radio-group.html`](../../design-system/components/radio-group.html) |
| Source mocks | [`pages/care-and-review/default`](../../mocks/pages/care-and-review/default.html), [`pages/care-and-review/invalid`](../../mocks/pages/care-and-review/invalid.html), [`pages/care-and-review/submitting`](../../mocks/pages/care-and-review/submitting.html), [`pages/booking-request/default`](../../mocks/pages/booking-request/default.html), [`pages/booking-request/invalid`](../../mocks/pages/booking-request/invalid.html), [`pages/booking-request/submitting`](../../mocks/pages/booking-request/submitting.html) |
| Rendering | [`radio-group.html`](radio-group.html) |

## Purpose and scope

A radio group asks for exactly one answer from a short list that Maya should compare: how her visit with Nia went on a 1-to-5 rating, which of Nia's offered times to request, which braid size she wants. It shows every option at once, lets her change her mind with the arrow keys, and only ever holds a value the list offers, so a rating of 0, 7 or 4.5 or a time Nia never offered cannot be entered.

Use something else when:

- several options can be chosen together: use a [checkbox group](checkbox.md);
- there are more than five options, or Nia offers many times: use the select component (the change-appointment dialog's "New preferred time" is a select in the design system);
- the choice filters what is on screen immediately: use filter [chips](chip.md);
- the setting is on or off and applies at once: use the [switch](switch.md).

Out of scope:

- The `<fieldset>`, `<legend>` ("Rating, 1 to 5", "Preferred time"), hint and error message ("Choose a rating from 1 to 5."). The [form field](form-field.md)'s group variant, `fieldset[hp-form-field]`, renders them and links the error to the `<fieldset class="field">` with `aria-describedby`; the radio group renders inside it and follows the form field's control contract (`HP_FORM_FIELD`, group rules).
- When the error shows and what it says, the error summary ("Check the highlighted field"), and submission ("Post review", "Send request"). The form owns them.
- Which time is pre-selected. The page passes the value (the time Maya first asked for); the component never picks one.
- Fetching Nia's offered times and removing a withdrawn one. The page builds the options; the component renders what it is given.

## Usage

No mock uses radios yet: the design system replaces the care-and-review rating's number input and the booking request's free `datetime-local` with radio groups, because only 1–5 and Nia's offered times are valid (D-5). Every configuration below comes from those screens and the design system's examples.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/care-and-review/default` | `orientation="horizontal"`, five options, inside the form field group "Rating, 1 to 5" | "1", "2", "3", "4", "5 (excellent)" | unchecked, checked "5", hover, focus | surface (form panel) |
| `pages/care-and-review/invalid` | as above, `invalid` | as above; error "Choose a rating from 1 to 5." from the form field | invalid (every radio), then checked once Maya chooses | surface |
| `pages/care-and-review/submitting`, `offline`, failed retry | as above | as above | checked, enabled, value kept (D-11) | surface |
| `pages/booking-request/default` | `cards`, vertical, inside the form field group "Preferred time" | "Sat 24 Oct · 10:00 am" with description "About 5 hours · estimate $180–$240"; "Sun 25 Oct · 11:00 am" with the same description | checked (the time Maya first asked for), unchecked, hover, focus | surface (form panel) |
| `pages/booking-request/invalid` | `cards`, `invalid` | as above; error "Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am." from the form field (mock: "Choose an offered time."; the form field CRD sets the copy) | invalid | surface |
| `pages/booking-request/submitting`, `offline` | `cards` | as above | checked, enabled, value kept | surface |
| Withdrawn time (design system *States*; L2-015) | `cards`, one option `disabled` | "Sun 25 Oct · 11:00 am" | disabled, disabled checked | surface |
| Braid size (design system *Anatomy*, form field *Variants*) | vertical or `orientation="horizontal"` | "Small", "Medium", "Large" | checked "Medium", unchecked | surface |

Every row is buildable with the API below: `hp-radio-group` with `orientation`, `cards`, `invalid`, `disabled`, `required` and a `string | null` value, holding `label[hp-radio]` options with a `value`, an optional `description` and `disabled`, every string projected or passed as an input.

## Anatomy

1. **Group** — `hp-radio-group` with `.choice-group`: a column with `--space-1` gap; `.choice-group--inline` for horizontal (a wrapping row, `--space-2` row gap, `--space-6` column gap); `--space-2` gap when the options are cards (D-6).
2. **Option row** — `.choice` on the host `<label>` of each option: flex row, `--space-3` gap, control aligned to the first line, `--space-1` vertical padding, `min-height` `--target-min`. The whole row checks the option.
3. **Radio** — the native `<input type="radio">` drawn with `appearance: none`: `--choice-size` (20 px) circle (`--radius-full`), `--border-width-hairline` ring in `--color-border-strong` on `--color-bg-surface`.
4. **Dot** — the radio's `::before`: an 8 px `--color-fg-on-accent` circle centred on an `--color-accent` fill when checked.
5. **Option label** — a `<span>` with the projected text; the accessible name.
6. **Text column (with a description only)** — `.choice__text` holding the label `<span>` and a `<small>` description in `--color-fg-muted`.
7. **Card frame (cards only)** — `.choice--card` on the option: `--space-4` padding, `--border-width-hairline` `--color-border-strong` edge, `--radius-md`; checked adds an `--color-accent` edge and inset ring and an `--color-accent-subtle` fill.

Host: `hp-radio-group` is an element selector (a composite) whose host carries `.choice-group`; it has no role inside the form field's `<fieldset>` (D-3). Each option uses the attribute selector `label[hp-radio]`, so the host is the native `<label class="choice">` and the template renders the `<input type="radio">` and its text inside it (D-1).

## API

### Inputs — `hp-radio-group`

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `value` | `string \| null` (two-way `model`) | `null` | no | The `value` of the checked option, or `null` when none is checked. Setting it checks the matching option; a value no option has checks none (D-4). |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | no | Horizontal adds `.choice-group--inline` at every width; the options wrap (D-8). Use it only for short ordered labels such as ratings. |
| `cards` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.choice--card` to every option and sets the group gap to `--space-2` (D-6). Cards are always one per row (D-7). |
| `name` | `string \| undefined` | generated `hp-radio-group-{n}` | no | Written to every option's native `name`, which is what makes them one group for the browser's arrow keys (D-2). |
| `invalid` | `boolean` (`booleanAttribute`) | `false` | no | Sets `aria-invalid="true"` on every option's input while this input, or inside `fieldset[hp-form-field]` the field's `invalid()`, is true. The error text and the fieldset's `aria-describedby` belong to the form field. |
| `disabled` | `boolean` (`booleanAttribute`) | `false` | no | Disables every option. Also set by `setDisabledState`. |
| `required` | `boolean` (`booleanAttribute`) | `false` | no | Sets native `required` on every option's input, which for radios means "one of these" (D-13). |

### Inputs — `label[hp-radio]`

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `value` | `string` | — | yes | Written to the native `value`; the group reports it when this option is checked. Unique within the group. |
| `description` | `string \| undefined` | `undefined` | no | When set, wraps the label in `.choice__text` and renders a `<small>` referenced by `aria-describedby` (D-10). |
| `disabled` | `boolean` (`booleanAttribute`) | `false` | no | Disables this option only: greyed, skipped by the arrow keys, never checked by the person. |

- Inputs are signal inputs (`input()`, `model()`); booleans accept bare attributes.
- An option outside a `hp-radio-group` is a development error (`console.error` naming `hp-radio`); options never stand alone.
- Angular forms: `hp-radio-group` implements `ControlValueAccessor` with a `string | null` value (D-9). Options do not; `[formControl]` and `formControlName` go on the group. `writeValue` never emits `valueChange`; the control is marked touched when focus leaves the group.
- Form field contract (`HP_FORM_FIELD`, defined by the form field CRD): inside `fieldset[hp-form-field]` the group injects the token, registers one `FormFieldControl` whose `id` is the checked option's input id, else the first enabled option's, whose `ngControl` is the group's forms directive and whose `focus()` focuses that input (so the error summary's "Preferred time" link lands on a radio); sets `aria-invalid` on every option while `invalid()`; and never sets `aria-describedby` from the field on the options, because the field describes the `<fieldset>`. Every option input carries a generated id `hp-radio-{n}`.
- `aria-labelledby` on the group host is a plain attribute; when the group is not inside a fieldset with a legend, the consumer names it this way and the host takes `role="radiogroup"` (D-3).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `valueChange` | `string` | The person checks an option by click, by its label or description, by an arrow key, or by Space. Part of the `value` model. Not emitted by `writeValue` or by setting `value` from the template. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default (`hp-radio-group`) | `label[hp-radio]` options | Declared once. Options register with the group through dependency injection, in DOM order. |
| default (`label[hp-radio]`) | Text | The option label. Declared once inside an `<ng-template>` and rendered with `ngTemplateOutlet` in both the plain and the described layout. It is the accessible name. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Vertical | `.choice-group` | The default; long labels: "Small", "Medium", "Large" with room to grow. |
| Horizontal (rating) | `.choice-group--inline` | Short, ordered labels compared side by side: "1" to "5 (excellent)". |
| Card | `.choice--card` on each option | An option with a title and a description: "Sat 24 Oct · 10:00 am" / "About 5 hours · estimate $180–$240". |

Radios have one size: a 20 px control (`--choice-size`) in a row at least `--target-min` (24 px) tall; the card variant adds padding, not size. A vertical group and cards take the container's width; a horizontal group wraps within it.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Unchecked | — | `--color-bg-surface` circle, `--color-border-strong` ring | Radio button, not checked, "n of m" |
| Checked | native `:checked` | `--color-accent` fill and ring, `--color-fg-on-accent` dot | Radio button, checked |
| Hover | `.choice:hover` | Ring `--color-accent` | — |
| Focus | `:focus-visible` on the input | `--focus-ring-width` outline in `--color-focus-ring`, offset `--focus-ring-offset`, around the circle (also on cards, so the moving control is clear) | Focus on the radio |
| Disabled | native `disabled` | `--color-bg-subtle` circle, `--color-border-default` ring, label `--color-fg-disabled`, no hover | Disabled; skipped by Tab and the arrow keys |
| Disabled checked | `disabled` + checked | Sunken circle with the dot kept | Disabled, checked |
| Invalid | `aria-invalid="true"` on every option | Ring `--color-danger-solid` plus a 1 px inset ring; a card keeps its own edge (D-12) | Invalid; the error is read from the fieldset's description |
| Card | `.choice--card` | Framed row, `--space-4` padding | — |
| Card checked | `.choice--card:has(input:checked)` | Card edge and inset ring `--color-accent`, fill `--color-accent-subtle` | — |
| Busy form | the form's submit is busy | No change: options stay enabled and checked (D-11) | — |
| Forced colours | `(forced-colors: active)` | Ring `CanvasText`; checked circle `Highlight` with `forced-color-adjust: none`; focus ring `Highlight` | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Fill changes instantly | — |
| Wrapped | horizontal group narrower than its options, or enlarged text | Options wrap onto further lines; never clipped; labels wrap under themselves; a card's text moves under the radio when fewer than 8 em remain beside it (D-15) | — |

## Markup

Rendered DOM. Classes, attributes and element order are the e2e contract; generated ids and the generated `name` are free to change.

```html
<!-- rendered: rating inside fieldset[hp-form-field] (care and review) -->
<fieldset class="field">
  <legend>Rating, 1 to 5</legend>
  <hp-radio-group class="choice-group choice-group--inline">
    <label class="choice"><input type="radio" id="hp-radio-1" name="rating" value="1" aria-labelledby="hp-radio-1-label"><span id="hp-radio-1-label">1</span></label>
    <label class="choice"><input type="radio" id="hp-radio-2" name="rating" value="2" aria-labelledby="hp-radio-2-label"><span id="hp-radio-2-label">2</span></label>
    <label class="choice"><input type="radio" id="hp-radio-3" name="rating" value="3" aria-labelledby="hp-radio-3-label"><span id="hp-radio-3-label">3</span></label>
    <label class="choice"><input type="radio" id="hp-radio-4" name="rating" value="4" aria-labelledby="hp-radio-4-label"><span id="hp-radio-4-label">4</span></label>
    <label class="choice"><input type="radio" id="hp-radio-5" name="rating" value="5" aria-labelledby="hp-radio-5-label"><span id="hp-radio-5-label">5 (excellent)</span></label>
  </hp-radio-group>
  <!-- the form field renders the hint and error here; when the error shows it adds aria-describedby to the fieldset -->
</fieldset>
```

```html
<!-- rendered: invalid rating option (every option carries it) -->
<label class="choice"><input type="radio" id="hp-radio-1" name="rating" value="1" aria-invalid="true" aria-labelledby="hp-radio-1-label"><span id="hp-radio-1-label">1</span></label>
```

```html
<!-- rendered: offered times as cards (booking request) -->
<fieldset class="field">
  <legend>Preferred time</legend>
  <hp-radio-group class="choice-group">
    <label class="choice choice--card">
      <input type="radio" id="hp-radio-8" name="time" value="slot-2026-10-24-1000" aria-labelledby="hp-radio-8-label" aria-describedby="hp-radio-8-description">
      <span class="choice__text">
        <span id="hp-radio-8-label">Sat 24 Oct · 10:00 am</span>
        <small id="hp-radio-8-description">About 5 hours · estimate $180–$240</small>
      </span>
    </label>
    <label class="choice choice--card">
      <input type="radio" id="hp-radio-9" name="time" value="slot-2026-10-25-1100" aria-labelledby="hp-radio-9-label" aria-describedby="hp-radio-9-description">
      <span class="choice__text">
        <span id="hp-radio-9-label">Sun 25 Oct · 11:00 am</span>
        <small id="hp-radio-9-description">About 5 hours · estimate $180–$240</small>
      </span>
    </label>
  </hp-radio-group>
</fieldset>
```

The cards group host also gets the `--space-2` gap from the component's styles. A disabled option adds native `disabled` to its input. `checked` is a property, so a checked radio has no `checked` attribute in the live DOM; tests use `toBeChecked()`.

Consumer templates:

```html
<!-- consumer: care and review rating; the field supplies legend, error and invalid state -->
<fieldset hp-form-field label="Rating, 1 to 5" [errorMessages]="{ required: 'Choose a rating from 1 to 5.' }">
  <hp-radio-group formControlName="rating" orientation="horizontal" required>
    <label hp-radio value="1">1</label>
    <label hp-radio value="2">2</label>
    <label hp-radio value="3">3</label>
    <label hp-radio value="4">4</label>
    <label hp-radio value="5">5 (excellent)</label>
  </hp-radio-group>
</fieldset>

<!-- consumer: booking request offered times -->
<fieldset hp-form-field label="Preferred time" [errorMessages]="{ required: 'Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am.' }">
  <hp-radio-group formControlName="slot" cards required>
    @for (slot of offeredSlots(); track slot.id) {
      <label hp-radio [value]="slot.id" [description]="slot.estimateText" [disabled]="slot.withdrawn">{{ slot.startText }}</label>
    }
  </hp-radio-group>
</fieldset>

<!-- consumer: template-only, braid size -->
<hp-radio-group [(value)]="size">
  <label hp-radio value="small">Small</label>
  <label hp-radio value="medium">Medium</label>
  <label hp-radio value="large">Large</label>
</hp-radio-group>
```

## Design

- Option row: flex, `align-items: flex-start`, gap `--space-3`, `padding-block` `--space-1`, `min-height` `--target-min`, `--text-body`, `cursor: pointer`.
- Radio: `--choice-size` circle, `--radius-full`, `--border-width-hairline` ring, `margin-top` `--space-0-5`; dot 0.5 rem.
- Description: `<small>` in `--text-body-sm`, `--color-fg-muted`, `--space-0-5` below the label.
- Wrapping: the label span and `.choice__text` have `min-width: 0` and `overflow-wrap: anywhere`, and a card has `flex-wrap: wrap` with its text at `flex: 1 1 8em`, shared with the checkbox (its D-15): when fewer than 8 em remain beside the radio, the time and estimate move under it (D-15).
- Group: vertical gap `--space-1`; horizontal row gap `--space-2` and column gap `--space-6` (rating options sit 24 px apart); card group gap `--space-2`.
- Card: padding `--space-4`, radius `--radius-md`; a two-line card is at least 52 px tall.
- Motion: fill and ring transition over `--duration-fast` with `--ease-standard`.
- Layer: none.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--choice-size` | 1.25 rem (20 px), shared with the checkbox | A touch-heavy kiosk surface only |

Colours come straight from semantic tokens, as for the checkbox; the radio group adds no component tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Circle fill | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Ring | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-450` |
| Checked fill, hover ring | `--color-accent` | `--palette-plum-600` | `--palette-plum-300` |
| Dot | `--color-fg-on-accent` | `--palette-white` | `--palette-plum-950` |
| Checked card fill | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Invalid ring | `--color-danger-solid` | `--palette-red-600` | `--palette-red-300` |
| Disabled circle | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Disabled ring | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Disabled label | `--color-fg-disabled` | `--palette-gray-400` | `--palette-gray-600` |
| Option label | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Description | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Ring on a form panel |
| `--color-accent` | `--color-bg-surface` | 3:1 | Checked fill on a form panel |
| `--color-fg-on-accent` | `--color-accent` | 4.5:1 | Dot on the fill |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid ring |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Option label |
| `--color-fg-default` | `--color-accent-subtle` | 4.5:1 | Option text on a checked card |
| `--color-fg-muted` | `--color-accent-subtle` | 4.5:1 | Description on a checked card |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Description on an unchecked card |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on a form panel |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Ring in a dialog |

Disabled options are exempt from the contrast minimums. The card's own edge (`--color-border-strong`) is decorative; the radio ring carries the control boundary.

Forced colours: rings map to `CanvasText`, a checked radio is painted `Highlight` with `forced-color-adjust: none` (`components.css`), and the focus ring is `Highlight`.

## Responsive behaviour

- Vertical groups and cards stack at every width; cards are one per row at every width (D-7).
- Horizontal groups wrap at every width (D-8). Measured in Chromium in the care-and-review form panel: the rating fits one row at 768 px; at 320 and 360 px "1" to "4" share the first row and "5 (excellent)" moves to the second, which the design system allows (it switches to vertical only at three lines); at 200 % text each option takes its own row with no horizontal scroll.
- Cards with 200 % text: measured in Chromium, the design system's card left the time and estimate a column narrower than "estimate" beside the radio, so the text ran 52 px (320 px viewport) and 12 px (360 px) past the card's edge. With the shared wrap rules (D-15) the text moves under the radio into a 92 px (320 px) or 132 px (360 px) column and stays inside the card; at 100 % text and at 768 px nothing changes.
- Targets: every row is at least `--target-min` (24 px) tall; horizontal options are `--space-6` (24 px) apart; cards are at least 52 px tall.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; every target is at least 24 × 24 CSS px.

## Accessibility

### Role and pattern

Native radios sharing one `name`, inside the form field's `<fieldset>` whose `<legend>` asks the question, following the [APG Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/). The browser supplies the roving tab stop, the arrow keys and the "n of m" position; the component adds no key handling (D-2).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves into the group, to the checked option or the first enabled option when none is checked, and out of it. The group is one tab stop. |
| <kbd>↓</kbd> / <kbd>→</kbd> | Moves to and checks the next enabled option, wrapping from the last to the first. |
| <kbd>↑</kbd> / <kbd>←</kbd> | Moves to and checks the previous enabled option, wrapping from the first to the last. |
| <kbd>Space</kbd> | Checks the focused option when none is checked. |

### Focus

- Focus lands on the native input; the ring surrounds the 20 px circle, on cards too, and shows on keyboard focus only.
- Checking an option never moves focus out of the group. Where focus goes after a failed submit (the error summary) is the form's rule.

### Labelling

- The legend names the group; each option's name is its label text through `aria-labelledby` (D-10). A card's description ("About 5 hours · estimate $180–$240") is its accessible description.
- Ratings label their top end ("5 (excellent)") so the numbers carry meaning.
- State attributes: native `checked`, `disabled`, `required`; `aria-invalid="true"` on every option while the error shows; the error itself is linked from the fieldset.

### Announcements

None from the component. The form announces the error summary and the result of the submission.

### Motion

The fill transitions over `--duration-fast`; under `prefers-reduced-motion: reduce` the tokens zero it and the change is instant.

## Content and internationalisation

- Legends are questions or nouns ("Rating, 1 to 5", "Preferred time"); they belong to the form field.
- Options are parallel and mutually exclusive. Times read "Sat 24 Oct · 10:00 am", with the estimate as the description: "About 5 hours · estimate $180–$240".
- Pre-select only a safe, likely default (the time Maya first asked for); never pre-select a rating.
- Translatable inputs: the projected option labels ("5 (excellent)"), `description`. Data values: dates, times, durations and prices in offered-time options, formatted by the page in the appointment's local time zone. The component renders no copy of its own.
- Length: option labels and descriptions wrap without limit; a horizontal group wraps whole options. Copy is English only today and no L2 requirement covers translation.

## Performance

- Change detection: `OnPush`, signal inputs and models; each option reads the group's value through one `computed`; ids generated once.
- Perf-test scenarios: `frontend/projects/perf-test/src/scenarios/RadioGroup.ts` renders the care-and-review rating, five options "1" to "5 (excellent)" with "5" checked; `frontend/projects/perf-test/src/scenarios/RadioGroupCards.ts` renders Nia's two offered times as cards, "Sat 24 Oct · 10:00 am" checked. Iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep each at roughly 100–300 ms.
- Composite scenarios: none beyond the two above.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: checking and invalid change colours and a pseudo-element only; nothing shifts. Offered times arrive with the form, so the page shows the form's skeleton until they do.
- Weight: `@angular/core`, `@angular/common` (`NgTemplateOutlet`), `@angular/forms`. No CDK.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given the care-and-review form with `<hp-radio-group orientation="horizontal">` holding options "1" to "5 (excellent)" inside the fieldset "Rating, 1 to 5", when it renders, then the group host has `.choice-group.choice-group--inline`, it holds exactly five `<label class="choice">` options each with an `<input type="radio">` sharing one `name`, and their values are "1" to "5". (L2-025)
- **AC-2** Given an unchecked option "Medium" on a form panel, when it is measured, then the radio is a 20 × 20 px circle with a 1 px `--color-border-strong` ring on `--color-bg-surface`, a `--space-3` gap before the label, and the row is at least 24 px tall. (L2-041)
- **AC-3** Given the booking request's offered times as a `cards` group with "Sat 24 Oct · 10:00 am" and "Sun 25 Oct · 11:00 am", each described "About 5 hours · estimate $180–$240", when it renders, then each option has `.choice--card` and a `.choice__text` column, the group gap is `--space-2`, and only those two times can be chosen. (L2-015)
- **AC-4** Given the offered-times group with "Sat 24 Oct · 10:00 am" checked, when it renders, then that card has an `--color-accent` edge and inset ring and an `--color-accent-subtle` fill, and its time and estimate keep at least 4.5:1 against that fill. (L2-015)

### States

- **AC-5** Given the rating group with no value, when Maya clicks the label "4", then the "4" radio is checked with an `--color-accent` fill and `--color-fg-on-accent` dot, every other option is unchecked, and `valueChange` emits "4" once. (L2-025)
- **AC-6** Given the rating group, when Maya uses any pointer or key on it, then its value is only ever `null` or one of "1", "2", "3", "4", "5", so a rating of 0, 7 or 4.5 cannot be chosen. (L2-025)
- **AC-7** Given Maya presses "Post review" with no rating inside `fieldset[hp-form-field]`, when the field shows its error and the group renders, then every option's input has `aria-invalid="true"` and a `--color-danger-solid` ring, and a screen reader on any option reads the fieldset's error "Choose a rating from 1 to 5." (L2-025)
- **AC-8** Given the offered-times group inside `fieldset[hp-form-field]` with no time chosen after "Send request", when the field shows its error, then each card's radio shows the danger ring while the card edge stays `--color-border-strong`, and a screen reader reads "Choose a time Nia offers. Her first slot on Sat 24 Oct is 10:00 am." from the fieldset. (L2-015)
- **AC-9** Given Maya chose "5 (excellent)" and "Post review" failed, when the form shows its failure and she retries, then the rating group still has "5" checked and has not emitted `valueChange`. (L2-025)
- **AC-10** Given "Send request" is busy, when Maya looks at the offered times, then "Sat 24 Oct · 10:00 am" is still checked and every option is still enabled and focusable. (L2-036)
- **AC-11** Given the page marks "Sun 25 Oct · 11:00 am" `disabled` because Nia withdrew it, when Maya clicks it or arrows onto the group, then it cannot be checked, the arrow keys skip it, and its label is `--color-fg-disabled`. (L2-015)
- **AC-12** Given an unchecked enabled option, when the pointer hovers its row, then the ring becomes `--color-accent`. (L2-041)

### Forms

- **AC-13** Given the review form restored with its rating control set to "5", when the group renders, then "5 (excellent)" is checked and `valueChange` has not emitted; and when the control is reset, then no option is checked; and when the control is disabled, then every option's input is disabled; and when focus leaves the group, then the control is touched. (L2-025)

### Keyboard and focus

- **AC-14** Given the rating group with "3" checked, when Maya presses Tab from the field before it, then focus lands on "3", and the next Tab leaves the group. (L2-041)
- **AC-15** Given focus on "5 (excellent)", when Maya presses → or ↓, then "1" becomes checked and focused and `valueChange` emits "1"; and when she presses ← or ↑, then "5" is checked again. (L2-041)
- **AC-16** Given the rating group with nothing checked and focus on "1", when Maya presses Space, then "1" becomes checked. (L2-041)
- **AC-17** Given a card option focused by keyboard, when the ring shows, then it surrounds the 20 px radio, not the card, as a 2 px `--color-focus-ring` outline with at least 3:1 against `--color-bg-surface`. (L2-041)

### Screen readers

- **AC-18** Given the rating group with "5" checked, when a screen reader enters it, then it announces the group "Rating, 1 to 5" and "5 (excellent), radio button, checked, 5 of 5". (L2-041)
- **AC-19** Given the card option "Sat 24 Oct · 10:00 am", when a screen reader reads it, then the name is "Sat 24 Oct · 10:00 am" and the description is "About 5 hours · estimate $180–$240". (L2-041)

### Theming

- **AC-20** Given a checked radio and a checked card, when the theme switches to dark, then the fill is plum 300 with a plum 950 dot, the card fill plum 950, without a reload, and the card's option text keeps at least 4.5:1 and the unchecked ring at least 3:1 against `--color-bg-surface`. (L2-042)
- **AC-21** Given Windows forced colours, when the rating renders with "5" checked, then the unchecked rings are `CanvasText`, the checked circle is `Highlight`, and the focus ring is `Highlight`. (L2-041)

### Responsive

- **AC-22** Given the care-and-review form on a 360 px viewport, when the rating renders, then "1" to "4" share the first row, "5 (excellent)" wraps to the second, the group never needs a third row at 100 % text, and the page does not scroll horizontally. (L2-042)
- **AC-23** Given the booking request on a 320 px viewport with text enlarged to 200 %, when the offered-time cards render, then the time and estimate move under the radio and wrap inside each card, each card is full width, no text runs past a card's edge, and nothing scrolls horizontally. (L2-042)
- **AC-24** Given the rating group on a touch device, when the options are measured, then each row is at least 24 px tall and neighbouring options are 24 px apart. (L2-041)

### Motion

- **AC-25** Given `prefers-reduced-motion: reduce`, when Maya checks an option, then the fill changes instantly. (L2-041)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/radio-group/`; files `radio-group.ts` exporting `RadioGroup` (`selector: 'hp-radio-group'`) and `radio.ts` exporting `Radio` (`selector: 'label[hp-radio]'`), both standalone, `OnPush`, with scoped `styles` porting the radio rules of `.choice`, `.choice__text`, `.choice--card`, `.choice-group` and `.choice-group--inline` from `docs/design-system/assets/components.css` with `:host` selectors. Export both from `public-api.ts`. The `.choice` rules are shared with the checkbox; keep them in one shared style constant in the library rather than copying them (AGENTS.md: never copy a component).
- `RadioGroup` provides an injection token; each `Radio` injects it (required; a missing group is a development error). The group holds the options in a `contentChildren` signal and exposes `name`, `value`, `invalid`, `disabled` and `required` as signals.
- `Radio` template: `<ng-template #label><ng-content /></ng-template>`, the `<input type="radio">` bound to `[name]`, `[value]`, `[checked]` (from the group's value), `[disabled]`, `[required]`, `[attr.aria-invalid]`, `[attr.aria-labelledby]`, `[attr.aria-describedby]`; then `@if (description())` the `.choice__text` column, `@else` the plain `<span>`, both rendering the template with `ngTemplateOutlet`. `(change)` tells the group, which sets `value` and calls the forms callback.
- Host bindings: on `Radio`, `class.choice` and `class.choice--card` (from the group's `cards`). On `RadioGroup`, `class.choice-group`, `class.choice-group--inline`, `style.gap` `var(--space-2)` when `cards`, and `attr.role` `'radiogroup'` only when the host has `aria-labelledby` and no `fieldset` ancestor (D-3).
- Wrapping (D-15): the shared choice styles carry `min-width: 0; overflow-wrap: anywhere` on the text and `flex-wrap: wrap` with `flex: 1 1 8em` on card text; `components.css` changes in the same slice as the checkbox's.
- Form field: `RadioGroup` injects `HP_FORM_FIELD` optionally and registers as described under *API*; it reads the group's `NgControl` lazily from the `Injector` (`injector.get(NgControl, null, { self: true })`), because injecting it in a value accessor's constructor creates a dependency cycle. Options never inject the token.
- Touched: a `focusout` listener on the group calls `onTouched` when `relatedTarget` is outside the host.
- Forms: provide `NG_VALUE_ACCESSOR` with `forwardRef` on `RadioGroup` (D-9).
- Development checks: an option outside a group, a duplicate option `value`, and a group neither inside a `fieldset` with a `legend` nor named by `aria-labelledby` each log a `console.error` naming the component.
- No CDK primitive: native radios already provide the radio-group keyboard model. Composes nothing.
- Perf-test scenarios `RadioGroup.ts` and `RadioGroupCards.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Element or attribute selectors?* The group is a composite, so it uses the element selector `hp-radio-group` with `.choice-group` on its host, which keeps the design system's layout rules. Each option is one native label around one native radio, so it uses the attribute selector `label[hp-radio]` and carries `.choice` on the host, exactly the design system's `<label class="choice">` markup, which makes a click anywhere on the row check the radio.
- **D-2** *Does the component implement the arrow-key model?* No. Native radios that share a `name` already give one tab stop, arrow keys that move and check with wrapping, Space to check, and "n of m" announcements. The group generates a unique `name` per instance (`hp-radio-group-{n}`) so two groups on one page never merge; a consumer may pass its own.
- **D-3** *Does the group render the fieldset and legend?* No. `fieldset[hp-form-field]` renders `<fieldset class="field">`, `<legend>`, the hint and the error and links the error with `aria-describedby`, and the radio group renders inside it, following the form field's group rules (register the checked or first option, `aria-invalid` on every option, no `aria-describedby` on options). The group host has no role there, because the fieldset already is the group. Outside a fieldset the consumer must name it with `aria-labelledby`, and the host then takes `role="radiogroup"`; with neither, development mode logs an error.
- **D-4** *What type is the value?* `string | null`, the native radio value type. The page converts ("5" to the rating 5; a slot id to its slot). A value that matches no option checks nothing rather than throwing, so a withdrawn slot restored from a draft simply shows no selection, and the form's own validation asks Maya to choose (L2-015).
- **D-5** *The care-and-review mock asks for the rating in a number input and the booking request mock for the time in `datetime-local`. Which wins?* The design system: its *Sources* record both as drift and its *Do and don't* shows why (a number input accepts 0, 7 or 4.5; a free picker accepts times Nia never offered). Both are radio groups. The change-appointment dialog's "New preferred time" is a select in the design system, not a radio group.
- **D-6** *What gap does a card group use?* `--space-2`, as the design system's offered-times example sets on its group; plain options keep `--space-1`. The component applies it on the host, so consumers never write inline styles.
- **D-7** *May cards sit two per row from 768 px, as the design system allows?* No; they are one per row at every width. Measured in Chromium, two cards per row in the form panel (whose maximum width is `--layout-form-max`) wrap "About 5 hours · estimate $180–$240" onto two lines at both 768 and 1280 px, while one per row keeps it on one line. The design system says "may", so this is a choice within it.
- **D-8** *Does horizontal stack on phones, as the checkbox group does?* No. The radio-group page says horizontal groups wrap, and switch to vertical only when they would wrap onto three lines at 360 px. The measured rating wraps onto two lines at 320 and 360 px, so it stays horizontal at every width; the consumer chooses vertical for longer labels.
- **D-9** *How does the group work with Angular forms?* `hp-radio-group` implements `ControlValueAccessor` with a `string | null` value; options do not. The `value` model stays for template-only use, and `writeValue` updates it without emitting. This matches the checkbox (`boolean`, `string[]`) and the switch (`boolean`) so the forms agent can rely on one pattern.
- **D-10** *Is a card's description part of the option's name?* No. As in the checkbox (its D-3), the input is named by `aria-labelledby` pointing at the label span and described by `aria-describedby` pointing at the `<small>`, so the screen reader hears "Sat 24 Oct · 10:00 am" and then the estimate.
- **D-11** *Do options disable while the form submits?* No. The form's busy submit button blocks a second submission (L2-036), and the chosen value stays visible and editable for a retry.
- **D-12** *Does an invalid card change its frame?* No. The design system's matrix marks only the radio ring for an invalid card; the error text under the fieldset carries the message, and colour is never the only signal.
- **D-13** *Native `required` or nothing?* Native `required` on every option's input, which for radios sharing a name means "choose one" and is exposed to assistive technology; forms use `novalidate`, so no browser bubble appears.
- **D-14** *Are there star icons or a dedicated rating component?* No. The design system's rating is a horizontal radio group with numbered labels and a labelled top end ("5 (excellent)"); a rating is a configuration of this component, not a separate one.
- **D-15** *What happens to a card's text when enlarged text leaves no room beside the radio?* It moves under the radio. Measured in Chromium at 320 and 360 px with 200 % text, the form panel's and the card's padding left the time and estimate a column narrower than the word "estimate", and the text ran 52 and 12 px past the card's edge. The options share the checkbox's rules (its D-15): `min-width: 0; overflow-wrap: anywhere` on the text, and on cards `flex-wrap: wrap` with the text at `flex: 1 1 8em`. At 100 % text, and at 768 px with 200 % text, the cards render exactly as the design system draws them.

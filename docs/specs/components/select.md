# Select

| Field | Value |
|---|---|
| Selector | `select[hp-select]` |
| Library path | `frontend/projects/components/src/lib/select/` |
| Status | built |
| Traces to | L2-005, L2-015, L2-021, L2-041, L2-042 |
| Design system | [`select.html`](../../design-system/components/select.html) |
| Source mocks | [`dialogs/filter-braiders/default`](../../mocks/dialogs/filter-braiders/default.html), [`dialogs/filter-braiders/invalid`](../../mocks/dialogs/filter-braiders/invalid.html), [`dialogs/change-appointment/default`](../../mocks/dialogs/change-appointment/default.html), [`dialogs/change-appointment/invalid`](../../mocks/dialogs/change-appointment/invalid.html), [`dialogs/request-review/default`](../../mocks/dialogs/request-review/default.html), [`dialogs/request-review/invalid`](../../mocks/dialogs/request-review/invalid.html), [`pages/booking-request/default`](../../mocks/pages/booking-request/default.html) |
| Rendering | [`select.html`](select.html) |

## Purpose and scope

A select picks one value from a known list the customer does not need to compare side by side: how far she will travel ("Within 10 km"), which of Nia's offered times she wants instead ("Sun 25 Oct, 11:00 am"), which of Nia's services she is requesting ("Medium knotless braids"). It is the native `<select>` with the design system's chevron, sizes and states, and the wiring that lets a [form field](form-field.md) label, describe and validate it. Because only listed values can be chosen, the request is valid by construction.

Use something else when:

- there are five or fewer options people should compare (a rating, two or three offered times shown with their estimate): use a radio group;
- the answer is free text: use the [text field](text-field.md);
- several values may be chosen: use a checkbox group;
- people must type to find one of hundreds of options: a combobox, which the design system does not have yet.

Out of scope:

- Which options exist (Nia's offered times and services, the supported distances): the page loads them from the API.
- The label, hint and error: the form field.
- What happens after a choice: changing the value never acts on its own; the dialog's or form's button does (D-11).

## Usage

No mock uses a select: the distance, preferred-time, new-time and service questions are free-text inputs, which the design system records as drift and replaces with selects of supported values.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `dialogs/filter-braiders` | md, required, in a field | "Distance from Toronto": "Within 5 km", "Within 10 km", "Within 25 km" | default, busy (editable), failed (value kept) | raised (dialog) |
| `dialogs/change-appointment` | md, required, placeholder option, options grouped by day | "New preferred time": "Choose a time"; "Sat 24 Oct": "Sat 24 Oct, 1:00 pm"; "Sun 25 Oct": "Sun 25 Oct, 11:00 am", "Sun 25 Oct, 2:00 pm" | default, invalid "Choose one of the times Nia has offered.", busy, failed | raised |
| `dialogs/request-review` | md, required, Nia's offered times | "Preferred time": "Sat 24 Oct, 10:00 am", "Sun 25 Oct, 11:00 am" | default, invalid "Choose an offered time." | raised |
| `pages/booking-request` | md, preselected from Nia's profile (D-9) | "Service": "Medium knotless braids" and Nia's other published services | default, invalid when the service is no longer offered | surface (form panel) |
| Design system *Variants* | md and sm, paired with the distance select in a `.form-row` from 768 px | "Sort braiders by": "Best match", "Lowest price", "Highest rated", "Nearest" | default | surface |
| Design system *Sizes* | sm, md, lg | — | all | surface |

Every row is buildable with the API below: a native select with `fieldSize`, projected `<option>` and `<optgroup>` elements, inside a form field.

## Anatomy

1. **Container** — `.select` on the native `<select>`: `appearance: none`, full width, `--field-height` minimum height, `--space-2` × `--space-3` padding with `--space-10` on the right for the chevron, `--border-width-hairline` `--field-border`, `--radius-md`, `--field-bg` fill.
2. **Selected value** — the chosen option's text in `--text-body` at the size's font size.
3. **Chevron** — two CSS gradients in `currentColor`, `--select-chevron` square each, centred `--space-5` / `--space-4` from the right, so it follows the text colour and the disabled state.
4. **Option list** — the platform's picker; `color-scheme` makes it dark in the dark theme.

Host: `select[hp-select]` is a component on the native `<select>`; its template is one `<ng-content>` that keeps the consumer's `<option>` and `<optgroup>` children in place (D-1).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `fieldSize` | `'sm' \| 'md' \| 'lg'` | `'md'` | no | Adds `.select--sm` or `.select--lg`; md adds no modifier. Not `size`, which on a `<select>` turns it into a list box (D-3). |
| `id` | `string \| undefined` | `undefined` | no | Host id. Inside a form field defaults to `controlId()`; outside to `hp-select-{n}`. |
| `aria-describedby` | `string \| undefined` | `undefined` | no | Aliased input; consumer ids first, the field's `describedBy()` appended (text field D-8). |
| `aria-invalid` | `boolean \| undefined` | `undefined` | no | Aliased input for use outside a form field; inside one, the field's `invalid()` decides. |

- Inputs are signal inputs.
- Native attributes pass through: `name`, `required`, `autocomplete`, `form`, `aria-label`, `disabled` (prefer the forms API). `multiple` and the native `size` are not supported (D-10).
- Forms: `formControlName`, `[formControl]` or `ngModel` on the same element; Angular's `SelectControlValueAccessor` and `NgSelectOption` move the value. Options bind `[ngValue]` for typed values (D-2).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| native `change` | `Event` | The customer picks another option. Nothing is re-emitted; values flow through the forms directive. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | `<option>` elements, optionally inside `<optgroup label>` elements; at most one placeholder option first | Declared once. A placeholder option is `<option [ngValue]="null" disabled>Choose a time</option>`. Each option's text states the whole value on its own (D-6). |

### Form field contract

Inside a form field the select follows the single-control rules in the form field CRD: takes `controlId()` unless `id` is set, merges `describedBy()`, sets `aria-invalid="true"` while `invalid()`, and registers `{ id, ngControl, focus }`.

## Variants and sizes

| Variant | Markup | Use for |
|---|---|---|
| Native | options only | A value is always chosen: "Distance from Toronto" (default "Within 10 km"), "Service" (preselected). |
| With placeholder option | disabled first option with a `null` value | No sensible default exists and the question is required: "New preferred time". |
| With option groups | `<optgroup label="Sun 25 Oct">` | More than a handful of times, grouped by day. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| sm | `.select--sm` | `--control-height-sm` (32 px) | `--space-1` × `--space-3`, `--space-10` right | `--font-size-sm` |
| md | — | `--control-height-md` (40 px) | `--space-2` × `--space-3`, `--space-10` right | `--font-size-md` |
| lg | `.select--lg` | `--control-height-lg` (48 px) | `--space-2` × `--space-3`, `--space-10` right | `--font-size-lg` |

Line height is `--line-height-snug`, so each size measures its control height (D-4). Width is the container's.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | `--field-bg` fill, `--field-border` edge, value and chevron `--field-fg` | Combo box (collapsed) named by the label, value read |
| Placeholder shown | value `null` with a placeholder option | "Choose a time" in the value colour | Value "Choose a time" |
| Hover | `:hover` | Border `--field-border-hover` | — |
| Focus | `:focus-visible` | Border and 2 px outline `--color-focus-ring`, no offset | — |
| Open | platform picker shown | The platform's list, dark in the dark theme | Expanded; options and group labels read |
| Invalid | `aria-invalid="true"` | `--color-danger-solid` border plus 1 px inset shadow | Invalid; error first in the description |
| Disabled | `disabled` | `--color-bg-subtle` fill, `--color-fg-disabled` value and chevron, `--color-border-default` border | Disabled; skipped by Tab |
| Read-only | — | Not supported; the native select has no read-only state (D-5) | — |
| Forced colours | `(forced-colors: active)` | `CanvasText` border, `Highlight` ring; chevron gradients in system text colour | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Border changes instant | — |
| Long value, narrow and enlarged | value wider than the space left of the chevron | The platform cuts the closed value at the edge; the opened list shows it whole (D-7) | Full value read |

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: distance in the filter braiders dialog -->
<select class="select" id="hp-field-8-control" name="distance" required>
  <option>Within 5 km</option>
  <option selected>Within 10 km</option>
  <option>Within 25 km</option>
</select>
```

```html
<!-- rendered: new preferred time, placeholder and groups, invalid -->
<select class="select" id="hp-field-1-control" name="newTime" required
        aria-invalid="true" aria-describedby="hp-field-1-error">
  <option disabled selected>Choose a time</option>
  <optgroup label="Sat 24 Oct">
    <option>Sat 24 Oct, 1:00 pm</option>
  </optgroup>
  <optgroup label="Sun 25 Oct">
    <option>Sun 25 Oct, 11:00 am</option>
    <option>Sun 25 Oct, 2:00 pm</option>
  </optgroup>
</select>
```

```html
<!-- rendered: sizes and disabled -->
<select class="select select--sm" aria-label="Sort braiders by">…</select>
<select class="select select--lg" aria-label="Distance from Toronto">…</select>
<select class="select" id="hp-field-3-control" disabled>…</select>
```

Angular renders `[ngValue]` options with generated `value` attributes (`"0: Object"` and so on); they are not part of the contract.

Consumer templates:

```html
<!-- consumer: filter braiders -->
<div hp-form-field label="Distance from Toronto">
  <select hp-select formControlName="distanceKm" required>
    @for (d of distances; track d.km) { <option [ngValue]="d.km">{{ d.label }}</option> }
  </select>
</div>

<!-- consumer: request a change -->
<div hp-form-field label="New preferred time" [errorMessages]="{ required: 'Choose one of the times Nia has offered.' }">
  <select hp-select formControlName="slotId" required>
    <option [ngValue]="null" disabled>Choose a time</option>
    @for (day of offeredDays(); track day.date) {
      <optgroup [label]="day.label">
        @for (slot of day.slots; track slot.id) { <option [ngValue]="slot.id">{{ slot.label }}</option> }
      </optgroup>
    }
  </select>
</div>
```

Free to change: the generated id pattern and attribute order.

## Design

- Height: `min-height: var(--field-height)` by size; `line-height: var(--line-height-snug)` (D-4).
- Padding: `--space-2` block (`--space-1` small), `--space-3` left, `--space-10` right for the chevron.
- Chevron: `--select-chevron` (0.3125 rem) per gradient half, positioned at `calc(100% - --space-5)` and `calc(100% - --space-4 + 1px)`, `currentColor`.
- Typography: `--text-body` at the size's font size.
- Shape: `--radius-md`; border `--border-width-hairline`.
- Motion: `border-color` and `box-shadow` over `--duration-fast` with `--ease-standard`. The picker is the platform's.
- Layer: none; the platform draws the picker above everything.

Component tokens: the shared field tokens, plus the chevron size.

| Token | Aliases | Overridden by |
|---|---|---|
| `--field-bg` | `--color-bg-surface` | a surface re-skin |
| `--field-fg` | `--color-fg-default` | a surface re-skin |
| `--field-border` | `--color-border-strong` | a surface re-skin |
| `--field-border-hover` | `--color-fg-muted` | a surface re-skin |
| `--field-height` | `--control-height-md` | `.select--sm`, `.select--lg` |
| `--select-chevron` | 0.3125 rem | none |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Fill | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Value and chevron | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Border | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-450` |
| Border, hover | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Focus | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |
| Invalid edge | `--color-danger-solid` | `--palette-red-600` | `--palette-red-300` |
| Disabled fill, value, border | `--color-bg-subtle`, `--color-fg-disabled`, `--color-border-default` | `--palette-gray-100`, `--palette-gray-400`, `--palette-gray-200` | `--palette-gray-800`, `--palette-gray-600`, `--palette-gray-750` |

Contrast pairs, from `tokens/contrast-pairs.json`, in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Value and chevron |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Edge on a card |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Edge in a dialog |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus on a card |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus in a dialog |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid edge |

Forced colours: `CanvasText` border, `Highlight` ring; the chevron is drawn in `currentColor` and follows the system text colour.

## Responsive behaviour

- Full width of its column. From 768 px two short selects may share a `.form-row` (distance and sort).
- On phones the operating system's picker opens, with large targets; this is why the native select is the default.
- Options are written to fit: at 320 px with default text the longest product value, "Medium knotless braids" (180 px), fits the 234 px left of the chevron (measured).
- With text enlarged to 200 % on a 360 px screen only about 190 px remain beside the chevron, so even "Within 25 km" (198 px) is cut at the edge in the closed control; the opened picker and the accessible value show it whole (D-7). Browser zoom to 400 % keeps text at 16 CSS px in a 320 px viewport and does not cut it.
- Nothing scrolls horizontally at 320 px; the select is at least 40 px tall.

## Accessibility

### Role and pattern

Native `<select>`: a collapsed combo box with a list of options, named by the form field's `<label for>`. A custom listbox is built only if the native control cannot do the job, and then follows the [APG Listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/); no product screen needs one (D-8). Changing the value never submits or navigates (WCAG 3.2.2, D-11).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Focuses the select; disabled selects are skipped. |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Changes the value (Windows) or opens the list (macOS). |
| <kbd>Space</kbd> / <kbd>Alt</kbd>+<kbd>↓</kbd> | Opens the list. |
| A letter | Jumps to the next option starting with it. |
| <kbd>Enter</kbd> | Chooses the highlighted option and closes the list. |
| <kbd>Esc</kbd> | Closes the list without changing the value. |

### Focus

The ring matches the text field: border and 2 px outline in `--color-focus-ring`, no offset. Choosing a value keeps focus on the select. The error summary's link focuses it and scrolls it to the middle of the viewport.

### Labelling

- The visible label names the choice; the selected option's text is the value.
- Option groups are announced with their label ("Sun 25 Oct").
- A placeholder option is disabled and carries a `null` value, so it can never be submitted or chosen again.
- `aria-invalid="true"` exactly while the field's error shows.

### Announcements

None of its own; the form field and error summary announce errors.

### Motion

Border colour over `--duration-fast`, zeroed under reduced motion. The picker's animation is the platform's.

## Content and internationalisation

- Options are short and parallel: "Within 5 km", "Within 10 km", "Within 25 km".
- Order options logically (ascending distance, chronological times), never alphabetically.
- Each option names the whole value, because the closed select shows only the chosen option: "Sun 25 Oct, 11:00 am", even inside a "Sun 25 Oct" group (D-6).
- Placeholder options start with "Choose": "Choose a time", "Choose a distance".
- Dates and times use the product format ("Sat 24 Oct", "10:00 am") in the appointment's local time zone; the page formats them.
- Translatable content: option labels, group labels, placeholder text. Data values: Nia's offered times and services.

## Performance

- Change detection: `OnPush`, signal inputs, host bindings from signals; the template is one `<ng-content>`.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Select.ts` renders the filter dialog's "Distance from Toronto" select with "Within 5 km", "Within 10 km" (selected) and "Within 25 km"; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: `BookingForm` (form layout CRD) holds the "Service" select.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: fixed height by size; the picker overlays without moving the page.
- Weight: `@angular/core` and `@angular/forms` (`NgControl` type). No CDK.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `<select hp-select formControlName="distanceKm">` in the "Distance from Toronto" field, when it renders, then the DOM holds a native `<select class="select">` with its `<option>` children and no wrapper, its `id` equals the label's `for`, its accessible name is "Distance from Toronto", it measures 40 px tall, and the chevron is drawn in the value colour. (L2-041)
- **AC-2** Given three selects with `fieldSize` `sm`, `md` and `lg`, when they render, then they measure 32, 40 and 48 px tall. (L2-041)

### Values

- **AC-3** Given the filter braiders dialog with "Within 10 km" chosen, when Maya picks "Within 25 km", then the form model holds the number 25, and the braider results do not change until she activates "Show braiders". (L2-005)
- **AC-4** Given the filter braiders dialog whose request failed, when the failure alert shows, then the distance select still shows "Within 25 km". (L2-005)
- **AC-5** Given the request a change dialog for HP-1048 with a null value, when it renders, then the select shows "Choose a time", the placeholder option is disabled, and the options are only Nia's offered times. (L2-021)
- **AC-6** Given the request a change dialog submitted with "Choose a time" still shown, when the field shows "Choose one of the times Nia has offered.", then the select has `aria-invalid="true"` and a 2 px `--color-danger-solid` edge. (L2-021)
- **AC-7** Given Maya chose "Sun 25 Oct, 11:00 am" and the server answers that the slot is no longer offered, when the field shows the server's message, then the select still shows "Sun 25 Oct, 11:00 am". (L2-021)
- **AC-8** Given the booking request opened from Nia's profile for medium knotless braids, when it renders, then "Service" shows "Medium knotless braids" and lists only Nia's currently published services. (L2-015)

### States

- **AC-9** Given an enabled select, when hovered, then its border is `--color-fg-muted`; when focused by keyboard, then the border and a 2 px outline are `--color-focus-ring` with at least 3:1 against the dialog surface. (L2-041)
- **AC-10** Given a select disabled through the forms API, when it renders, then it has the native `disabled` attribute, the disabled fill, its value and chevron in `--color-fg-disabled`, and Tab skips it. (L2-041)

### Keyboard and focus

- **AC-11** Given focus on "New preferred time", when Maya presses Alt+↓, then the list opens; when she types "S" the highlight moves to the next option starting with "S"; and when she presses Esc, then the list closes and the value is unchanged. (L2-041)

### Screen readers

- **AC-12** Given the "New preferred time" select with "Sun 25 Oct, 11:00 am" chosen, when a screen reader reaches it, then it announces a combo box named "New preferred time" with the value "Sun 25 Oct, 11:00 am", and inside the open list the group "Sun 25 Oct". (L2-041)

### Theming

- **AC-13** Given the dark theme, when the select renders in a dialog, then its fill is `--palette-gray-900`, its border is at least 3:1 against `--color-bg-surface-raised`, its value at least 4.5:1 against the fill, and the opened native list uses dark colours. (L2-041)
- **AC-14** Given the distance select, when the theme switches from light to dark, then its colours and chevron change without a reload. (L2-042)
- **AC-15** Given Windows forced colours, when the select renders, then it has a `CanvasText` border, a `Highlight` focus ring and a visible chevron. (L2-041)

### Responsive

- **AC-16** Given a 320 px viewport, when the booking request renders, then the "Service" select fills the column, "Medium knotless braids" is fully visible in it, and the page does not scroll horizontally. (L2-042)
- **AC-17** Given a 360 px viewport with text enlarged to 200 %, when Maya opens the "New preferred time" select, then every option is shown whole in the picker and the select remains operable. (L2-042)

### Motion

- **AC-18** Given `prefers-reduced-motion: reduce`, when the select is hovered or focused, then the border change is instant. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/select/`; file `select.ts` exporting the standalone component `Select` with `selector: 'select[hp-select]'`, `template: '<ng-content />'`, `changeDetection: OnPush`. Export from `public-api.ts`.
- Host bindings: `class.select`; `class.select--sm`, `class.select--lg`; `attr.id`; `attr.aria-describedby`; `attr.aria-invalid`.
- Injections and registration as the text field. `NgSelectOption` on projected options finds the `SelectControlValueAccessor` on the select element, because the options are declared in the consumer's template inside it.
- Styles: port `.select` and the shared `.input, .select, .textarea` rules from `docs/design-system/assets/components.css` as `:host(...)` rules and add `line-height: var(--line-height-snug)` (D-4), in `components.css` too in the same slice.
- No CDK primitive.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Select.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Wrapper or native host?* A component on the native `<select>` with a template of one `<ng-content>`, so the platform picker, type-ahead, form submission and accessibility stay native and the options stay the element's children.
- **D-2** *How do values and the placeholder work with Angular forms?* `SelectControlValueAccessor` on the same element and `[ngValue]` on options, so the form model holds typed values (the number 25, a slot id). The design system's `value="" disabled selected` placeholder shows a blank select when a reactive control's value is `null`, because no option matches; `[ngValue]="null" disabled` matches it, shows "Choose a time" and can never be chosen.
- **D-3** *`size` or another name?* `fieldSize`, as the text field: the native `size` attribute turns a select into an open list box.
- **D-4** *Height?* Exactly the control height, with `--line-height-snug`; measured, the design-system stylesheet draws 44 px for a 40 px select (text field D-4).
- **D-5** *Read-only?* Not offered: a native select has no read-only state, and disabling it hides the value from some screen readers' form mode. A value Maya cannot change is shown as text (description list) or a read-only text field.
- **D-6** *Do grouped options repeat the day?* Yes. The closed select shows only the chosen option's text, so the design system's grouped "11:00 am" would read as a time without a day once chosen; "Sun 25 Oct, 11:00 am" stands on its own, matching the design system's own do-example options.
- **D-7** *The closed select cuts long values with 200 % text on a phone. Is that acceptable?* Yes, as the platform's behaviour: measured at 360 px with 200 % text only about 190 px remain beside the chevron, so even "Within 25 km" (198 px) is cut, while the opened picker shows every option whole and assistive technology reads the full value. The design system accepts platform truncation and asks for options under 30 characters; L2-042 asks that content stay readable at 200 % text. The CRD keeps the native select, the most consistent option with both, because the value stays readable and operable through the picker (needs product confirmation).
- **D-8** *Native or custom listbox?* Native everywhere. No product list needs search, rich option content or multi-line options, the conditions under which the design system allows a custom APG listbox.
- **D-9** *The booking request mock types the service as free text. What does the product render?* A select of Nia's currently published services, preselected from her profile. L2-015 requires a service currently offered by the selected braider, and the design system's rule is that an answer from a known set is never free text.
- **D-10** *`multiple` or a list-box `size`?* Not supported. No screen needs a multi-select; several choices use a checkbox group, which shows every option.
- **D-11** *Does changing the value act at once?* Never. Filters apply on "Show braiders" and a change request is sent on "Send change request" (WCAG 3.2.2, design system *Accessibility*).

# Switch

| Field | Value |
|---|---|
| Selector | `label[hp-switch]` |
| Library path | `frontend/projects/components/src/lib/switch/` |
| Status | planned |
| Traces to | L2-031, L2-041, L2-042 |
| Design system | [`switch.html`](../../design-system/components/switch.html) |
| Source mocks | [`pages/account-settings/default`](../../mocks/pages/account-settings/default.html) (notification preferences), [`dialogs/cookie-preferences/default`](../../mocks/dialogs/cookie-preferences/default.html) (correctly a checkbox, not a switch) |
| Rendering | [`switch.html`](switch.html) |

## Purpose and scope

A switch turns a setting on or off the moment it changes, with no save button: email updates about Maya's requests, a reminder the day before her appointment with Nia. It shows its state by position as well as colour, and screen readers announce it as a switch that is on or off.

Use something else when:

- the change only applies after a save button ("Save preferences", "Save changes"): use a [checkbox](checkbox.md); the cookie preferences dialog correctly keeps its checkbox;
- one of several options must be chosen: use a [radio group](radio-group.md);
- the control filters a list: use a filter [chip](chip.md).

Out of scope:

- Saving the setting, and what happens when saving fails. The page saves on `checkedChange`, and on failure writes the saved value back and shows the toast ("Reminders not updated. Try again."); the switch only renders the value it is given (D-4).
- Confirming the saved change in a polite live region. The page's toast region or status line does it.
- The settings list around the switch (cards, dividers, headings). The page or card lays out the rows.

## Usage

The switch is in the design system's core set. Account settings shows it in a "Notifications" card of settings rows that save as soon as they change; the other configurations come from the design-system page.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/account-settings/default` "Notifications" card, after the contact-details form in every form state (`default`, `invalid`, `submitting`, `success`, `failed`, `offline`), introduced by "These settings save as soon as you change them." | `layout="row"` (`.switch--end`), with description | "Appointment reminders", description "A text the day before Sat 24 Oct at 10:00 am." (on); "Email updates", description "News about your requests and appointments, sent to maya.chen@example.com." (off) | off, on, hover, focus, reverted after a failed save | surface (card) |
| Account settings, inline (design system *Variants*) | `layout="inline"` | "Email me when Nia replies" | on, off, hover, focus | surface |
| Short settings in states matrix (design system *States*) | inline | "Reminders", "Email updates" | off, on, hover, focus, disabled off, disabled on | surface |
| Cookie preferences dialog (`dialogs/cookie-preferences/default`) | not a switch: the dialog saves on "Save preferences", so it keeps the checkbox (design system *Do and don't*) | — | — | — |

Every row is buildable with the API below: one `label[hp-switch]` with `checked`, `disabled`, `layout` and an optional `description`, with the label projected.

## Anatomy

1. **Row** — `.switch` on the host `<label>`: inline flex, items centred, `--space-3` gap, `min-height` `--target-min`, `--text-body`. The whole row toggles the switch.
2. **Track** — the native `<input type="checkbox" role="switch">` drawn with `appearance: none`: `--switch-width` × `--switch-height` (44 × 24 px) pill (`--radius-full`) filled with `--switch-track` (off) or `--switch-track-on` (on).
3. **Thumb** — the track's `::before`: a `--switch-thumb` (20 px) circle in `--switch-thumb-bg` with `--shadow-1`, inset `--space-0-5`, sliding `--switch-width` − `--switch-thumb` − 2 × `--space-0-5` (20 px) when on.
4. **Label** — a `<span>` with the projected text, naming the setting.
5. **Text column (with a description only)** — `.choice__text` holding the label `<span>` and a `<small class="text-muted">` description.
6. **Settings row (optional)** — `.switch--end`: full width, label at the start, switch at the end (D-6).

Host: `label[hp-switch]` is an attribute selector, so the host **is** the native `<label class="switch">` and the template renders the `<input>` and the text inside it (D-1).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `checked` | `boolean` (two-way `model`) | `false` | no | On or off. Each user activation flips it and emits `checkedChange` at once. Setting it from the template or `writeValue` never emits (D-4). |
| `disabled` | `boolean` (`booleanAttribute`) | `false` | no | Sets native `disabled` on the input. Also set by `setDisabledState`. |
| `layout` | `'inline' \| 'row'` | `'inline'` | no | `row` adds `.switch--end`: a full-width settings row with the switch at the end (D-5, D-6). |
| `description` | `string \| undefined` | `undefined` | no | When set, wraps the label in `.choice__text` and renders `<small class="text-muted">` referenced by `aria-describedby` (D-7). |
| `name` | `string \| undefined` | `undefined` | no | Written to the native `name` for native form posts; Angular forms do not need it. |

- Inputs are signal inputs (`input()`, `model()`); booleans accept bare attributes.
- There is no `invalid`, `required` or `busy` input (D-3, D-4).
- Form field contract (`HP_FORM_FIELD`, defined by the form field CRD): a switch may sit in `div[hp-form-field] choice` to gain a hint. It then uses the field's `controlId()` as its input id, adds the field's `describedBy()` ids after its own description id, and registers one `FormFieldControl` (`id`, `NgControl`, `focus()`). It never renders the field's `invalid()` as `aria-invalid` (D-3); a switch has no validators, so the field never shows an error for it.
- Angular forms: implements `ControlValueAccessor` with a `boolean` value (D-9). `writeValue` never emits `checkedChange`; the control is marked touched when focus leaves the switch.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `checkedChange` | `boolean` | The person toggles the switch (click on the track, label or description, or Space). Part of the `checked` model. The page saves on this event. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Text | The setting's name ("Appointment reminders"). Declared once inside an `<ng-template>` and rendered with `ngTemplateOutlet` in both the plain and the described layout. It is the accessible name. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Inline (label after the switch) | — (`.switch`) | A single setting in running content: "Email me when Nia replies". |
| Settings row (label first, switch at the end) | `.switch--end` | Lists of settings, so labels align at the start: "Appointment reminders". |
| With description | `.choice__text` inside | A setting whose "on" needs real detail: "A text the day before Sat 24 Oct at 10:00 am." |

Switches have one size: a 44 × 24 px track (`--switch-width`, `--switch-height`) in a row at least `--target-min` (24 px) tall. An inline switch is as wide as its content; a settings row is as wide as its container.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Off | `checked` false | Track `--switch-track` (`--color-border-strong`), thumb at the start | Switch, off |
| On | native `:checked` | Track `--switch-track-on` (`--color-accent`), thumb at the end | Switch, on |
| Hover, off | `.switch:hover` | Track `--color-fg-muted` | — |
| Hover, on | `.switch:hover` | No change | — |
| Focus | `:focus-visible` on the input | `--focus-ring-width` outline in `--color-focus-ring`, offset `--focus-ring-offset`, following the track's pill shape | Focus on the switch |
| Disabled | native `disabled` | Track and thumb at 50 % opacity, label and description `--color-fg-disabled`, `cursor: not-allowed` | Disabled; removed from the tab order |
| Reverted | the page writes the saved value back after a failed save | The thumb returns; no event is emitted (D-4) | The new state is read when focus is on the switch; the page's toast explains |
| Forced colours | `(forced-colors: active)` | Track edge `CanvasText`; thumb `CanvasText`; on: track `Highlight`, thumb `HighlightText` (D-8) | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Slide and recolour are instant (`--duration-base` is zeroed); position still shows the state | — |
| Narrow settings row or enlarged text | container narrower than the label and switch | The label keeps the full width and the switch wraps beneath it at the start (D-6) | — |

A switch has no invalid state: it cannot be wrong (design system *States*).

## Markup

Rendered DOM. Classes, `role="switch"` and element order are the e2e contract; generated ids are free to change.

```html
<!-- rendered: inline, on -->
<label class="switch">
  <input type="checkbox" role="switch" aria-labelledby="hp-switch-1-label">
  <span id="hp-switch-1-label">Email me when Nia replies</span>
</label>
```

```html
<!-- rendered: settings row with description, off -->
<label class="switch switch--end">
  <input type="checkbox" role="switch" aria-labelledby="hp-switch-2-label" aria-describedby="hp-switch-2-description">
  <span class="choice__text">
    <span id="hp-switch-2-label">Appointment reminders</span>
    <small class="text-muted" id="hp-switch-2-description">A text the day before Sat 24 Oct at 10:00 am.</small>
  </span>
</label>
```

```html
<!-- rendered: disabled -->
<label class="switch"><input type="checkbox" role="switch" disabled aria-labelledby="hp-switch-3-label"><span id="hp-switch-3-label">Reminders</span></label>
```

`checked` is a property, so an on switch has no `checked` attribute in the live DOM; tests use `toBeChecked()` or the `aria-checked` the browser computes for `role="switch"`.

Consumer templates:

```html
<!-- consumer: settings row that saves immediately -->
<label hp-switch layout="row" [checked]="reminders()" (checkedChange)="saveReminders($event)"
       description="A text the day before Sat 24 Oct at 10:00 am.">Appointment reminders</label>

<!-- consumer: reactive form control in account settings -->
<label hp-switch [formControl]="emailReplies">Email me when Nia replies</label>
```

```ts
// page: save at once; on failure write the saved value back and show the toast
saveReminders(on: boolean) {
  this.reminders.set(on);
  this.settings.update({ reminders: on }).subscribe({
    error: () => { this.reminders.set(!on); this.toasts.danger('Reminders not updated. Try again.'); },
  });
}
```

## Design

- Row: `inline-flex`, `align-items: center`, gap `--space-3`, `min-height` `--target-min`, `--text-body`, `cursor: pointer`.
- Track: `--switch-width` (2.75 rem) × `--switch-height` (1.5 rem), `--radius-full`, no border.
- Thumb: `--switch-thumb` (1.25 rem), `--radius-full`, `--shadow-1`, inset `--space-0-5`; travel computed from the component tokens.
- Description: `<small>` in `--text-body-sm`, `--color-fg-muted`, `--space-0-5` below the label.
- Settings row: full width, label first, switch last with `justify-content: space-between`; the row wraps when the label cannot keep 10 em beside the switch (D-6).
- Motion: track `background-color` and thumb `translate` over `--duration-base` (200 ms) with `--ease-standard`.
- Layer: none; the thumb is a pseudo-element inside the track.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--switch-track` | `--color-border-strong` | Hover (off) → `--color-fg-muted` |
| `--switch-track-on` | `--color-accent` | A surface re-skin |
| `--switch-thumb-bg` | `--color-bg-surface` | A surface re-skin |
| `--switch-width` | 2.75 rem | A touch-heavy kiosk surface only |
| `--switch-height` | 1.5 rem | As above |
| `--switch-thumb` | 1.25 rem | As above |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Track, off | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-450` |
| Track, off hover | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Track, on | `--color-accent` | `--palette-plum-600` | `--palette-plum-300` |
| Thumb | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Label | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Description | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Disabled label | `--color-fg-disabled` | `--palette-gray-400` | `--palette-gray-600` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Off track against a card |
| `--color-accent` | `--color-bg-surface` | 3:1 | On track against a card |
| `--color-bg-surface` | `--color-border-strong` | 3:1 | Thumb on the off track |
| `--color-bg-surface` | `--color-accent` | 3:1 | Thumb on the on track |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Label |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Description |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on a card |

The hovered off track (`--color-fg-muted`) is darker than the resting track, so it keeps more than the resting 3:1 against the card and the thumb.

Forced colours: system colours replace the track and thumb backgrounds, which made the on switch invisible when measured in Chromium with forced colours emulated (the off switch rendered, the on switch did not). The component therefore sets its own forced-colours rules (D-8): a `CanvasText` hairline edge on the track, a `CanvasText` thumb, and, when on, a `Highlight` track with a `HighlightText` thumb (`forced-color-adjust: none`). The focus ring maps to `Highlight` through the tokens.

## Responsive behaviour

- An inline switch has no breakpoint rules; its label wraps beside the track.
- A settings row (`.switch--end`) keeps the label at the start and the switch at the end on every width while the label has at least 10 em beside the switch; when it does not, the switch wraps beneath the label at the start, and the label keeps the full width (D-6). Measured in Chromium at 320 and 360 px with text enlarged to 200 %, the original `row-reverse` row pushed the label 67 px and 27 px past the start edge of the card, clipping "Appointment reminders"; with the D-6 rule the label wraps across the card and the switch sits beneath it.
- Targets: the whole label row toggles the switch; the track alone is 44 × 24 px and the row at least `--target-min` (24 px) tall.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; every target is at least 24 × 24 CSS px.

## Accessibility

### Role and pattern

A native `<input type="checkbox" role="switch">` inside its `<label>`, following the [APG Switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/). Screen readers announce "switch, on" or "off"; the native checkbox supplies the state, so no `aria-checked` is written by hand.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to and from the switch. A disabled switch is skipped. |
| <kbd>Space</kbd> | Toggles it; the change applies at once and `checkedChange` emits. |

### Focus

- Focus lands on the native input; the ring follows the track's pill shape and shows on keyboard focus only.
- Toggling never moves focus, and neither does a revert after a failed save.

### Labelling

- The name is the setting ("Appointment reminders"), never the action ("Turn on reminders"), so "on" and "off" read correctly. It comes from the label span through `aria-labelledby`; the description is the accessible description (D-7).
- No "On" / "Off" text sits beside the switch; the role announces the state.
- State: native `checked` and `disabled` only. No `aria-invalid`, `aria-required` or `aria-busy` (D-3, D-4).

### Announcements

The switch has no live region. The page confirms a saved change, or explains a failed one, in its polite status or toast region.

### Motion

The thumb slides and the track recolours over `--duration-base`. Under `prefers-reduced-motion: reduce` the tokens zero `--duration-base`, so both are instant; the thumb's position, not only its colour, still shows the state.

## Content and internationalisation

- Labels are nouns for settings in sentence case: "Email updates", "Appointment reminders". "Email me when Nia replies" is the one statement-style label the design system shows for an inline switch.
- Descriptions say what "on" means with real detail: "A text the day before Sat 24 Oct at 10:00 am."
- Translatable inputs: the projected label, `description`. Data values: the braider's first name, dates and times in descriptions, formatted by the page in the appointment's local time zone. The component renders no copy of its own.
- Length: labels and descriptions wrap; a settings row wraps the switch beneath a long label rather than squeezing it (D-6). Copy is English only today and no L2 requirement covers translation.

## Performance

- Change detection: `OnPush`, signal inputs and model; ids generated once.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Switch.ts` renders the settings row `<label hp-switch layout="row" description="A text the day before Sat 24 Oct at 10:00 am.">Appointment reminders</label>`; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none yet; the account settings page's notification list will repeat the row.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: toggling moves a pseudo-element by `translate` and recolours the track; the switch's box never changes size.
- Weight: `@angular/core`, `@angular/common` (`NgTemplateOutlet`), `@angular/forms`. No CDK.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `<label hp-switch>Email me when Nia replies</label>`, when it renders, then the host is the native `<label class="switch">` holding `<input type="checkbox" role="switch">` and a `<span>` with the text, and its role is switch with the accessible name "Email me when Nia replies". (L2-041)
- **AC-2** Given an off switch on a card, when it is measured, then the track is 44 × 24 px with fully rounded ends in `--color-border-strong`, and the thumb is a 20 px `--color-bg-surface` circle with `--shadow-1`, inset 2 px at the start. (L2-041)
- **AC-3** Given `<label hp-switch layout="row" description="A text the day before Sat 24 Oct at 10:00 am.">Appointment reminders</label>` in a 768 px wide settings card, when it renders, then the host has `.switch--end`, fills the card's width, shows the label and description at the start and the switch at the end on one line. (L2-042)

### States

- **AC-4** Given "Appointment reminders" off, when Maya clicks its label, then the thumb slides 20 px to the end, the track becomes `--color-accent`, and `checkedChange` emits `true` at once with no save button involved. (L2-041)
- **AC-5** Given an off switch, when the pointer hovers its row, then the track becomes `--color-fg-muted`, and given an on switch, when hovered, then the track stays `--color-accent`. (L2-041)
- **AC-6** Given `<label hp-switch disabled>Reminders</label>`, when it renders, then the input has native `disabled`, the track and thumb are 50 % opaque, the label is `--color-fg-disabled`, Tab skips it and clicking does nothing. (L2-041)
- **AC-7** Given Maya switched "Appointment reminders" on and the save failed, when the page writes `checked` back to `false` and shows "Reminders not updated. Try again.", then the switch shows off, keeps focus if it had it, and emits no `checkedChange` for the revert. (L2-031)
- **AC-8** Given the switch is bound to a form control that has a validation error, when it renders, then the input never has `aria-invalid`, `aria-required` or `aria-busy`. (L2-041)
- **AC-9** Given a form control set to `true`, when the switch renders, then it is on and has not emitted `checkedChange`; and when Maya toggles it, then the control value becomes `false`; and when the control is disabled, then the input is disabled. (L2-041)

### Keyboard and focus

- **AC-10** Given the settings card, when Maya presses Tab, then focus lands on the switch, Space toggles it, and Enter does not toggle it. (L2-041)
- **AC-11** Given a switch focused by keyboard, when the ring shows, then it is a 2 px `--color-focus-ring` outline offset 2 px that follows the track's pill shape, with at least 3:1 against `--color-bg-surface`, and a pointer click shows no ring. (L2-041)

### Screen readers

- **AC-12** Given "Appointment reminders" off with its description, when a screen reader reads it, then it announces "Appointment reminders, switch, off" and the description "A text the day before Sat 24 Oct at 10:00 am.", and after Space it announces "on". (L2-041)
- **AC-13** Given a switch with a description, when its accessible name is computed, then it is exactly the label text "Appointment reminders" and does not include the description or any "On" / "Off" text. (L2-041)

### Theming

- **AC-14** Given an on switch, when the theme switches to dark, then the track becomes plum 300 and the thumb gray 900 without a reload, and the thumb keeps at least 3:1 against both the on and the off track in both themes. (L2-042)
- **AC-15** Given an off switch on a card, when contrast is measured in light and dark, then the track keeps at least 3:1 against `--color-bg-surface`. (L2-041)
- **AC-16** Given Windows forced colours, when an off and an on switch render, then both tracks are visible with a `CanvasText` edge, the off thumb is `CanvasText`, the on track is `Highlight` with a `HighlightText` thumb, and the focus ring is `Highlight`. (L2-041)

### Responsive

- **AC-17** Given the settings row "Appointment reminders" with its description on a 320 px viewport with text enlarged to 200 %, when it renders, then the whole label and description are visible across the card's width, the switch sits beneath them at the start, and nothing clips or scrolls horizontally. (L2-042)
- **AC-18** Given a switch on a touch device, when the row is measured, then the row is at least 24 px tall, the track 44 px wide, and a tap anywhere on the label row toggles it. (L2-041)

### Motion

- **AC-19** Given the default motion setting, when the switch toggles, then the thumb slides over 200 ms with `--ease-standard`; and given `prefers-reduced-motion: reduce`, when it toggles, then the thumb and track change instantly. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/switch/`; file `switch.ts` exporting the standalone component `Switch` with `selector: 'label[hp-switch]'`, `OnPush`, and scoped `styles` porting `.switch`, `.switch input`, its `::before`, the hover, checked, disabled and `.switch--end` rules from `docs/design-system/assets/components.css` with `:host` selectors. Export it from `public-api.ts`.
- Template: `<ng-template #label><ng-content /></ng-template>`, the `<input type="checkbox" role="switch">` bound to `[checked]`, `[disabled]`, `[attr.name]`, `[attr.aria-labelledby]`, `[attr.aria-describedby]`, `(change)` and `(blur)`; then `@if (description())` the `.choice__text` column with `<small class="text-muted">`, `@else` the plain `<span>`, both rendering the template with `ngTemplateOutlet`.
- Host bindings: `class.switch` always; `class.switch--end` when `layout` is `row`.
- Settings row (D-6): the ported `.switch--end` rule is `flex-wrap: wrap; justify-content: space-between; width: 100%` in the row direction, the input gets `order: 1`, and the text gets `flex: 1 1 10em; min-width: 0`, exactly as `docs/design-system/assets/components.css` defines them.
- Forced colours (D-8): add `@media (forced-colors: active)` rules on the track (`border: var(--border-width-hairline) solid CanvasText`), the thumb (`background: CanvasText`), and the on state (`forced-color-adjust: none; background: Highlight`, thumb `HighlightText`), as `components.css` defines them.
- `.choice__text` and its `small` rule are shared with the checkbox and radio options; include the library's shared choice-text style constant rather than copying it.
- Forms: provide `NG_VALUE_ACCESSOR` with `forwardRef` (D-9).
- Form field: inject `HP_FORM_FIELD` optionally; read the `NgControl` for registration lazily from the `Injector`, to avoid the value-accessor dependency cycle.
- No CDK primitive. Composes nothing.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Switch.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is the host a wrapper or the native label?* The native `<label>`, through the attribute selector `label[hp-switch]`, with `.switch` on the host: the design system's markup is `<label class="switch"><input role="switch">…</label>`, a click anywhere on the label toggles the switch natively, and `.switch--end` styles the label as a full-width row in its container.
- **D-2** *A native checkbox with `role="switch"`, or a `<button aria-checked>`?* The native checkbox with `role="switch"`, as the design system specifies (its *Sources* record the kit's missing role as drift). It brings label activation, Space, form participation and disabled behaviour for free.
- **D-3** *Does the switch have an invalid or required state?* No. The design system says a switch cannot be wrong; a setting that must be accepted before saving is a checkbox. The component never renders `aria-invalid` or `required`, even when bound to a form control that has errors, and even inside a form field, where the control contract would otherwise mirror the field's `invalid()`; this is the one rule of that contract the switch does not follow.
- **D-4** *How does a failed save look, and is there a busy state?* The design system's rule: flip it back and say so in a toast. The page writes the saved value to `checked` (or the form control), which never emits `checkedChange`, so a revert cannot trigger another save; the toast "Reminders not updated. Try again." is the page's. There is no busy state: the switch shows the requested value at once, and the page keeps the last request authoritative if Maya toggles again before the first save returns.
- **D-5** *How is the settings-row variant chosen?* By `layout: 'inline' | 'row'`, mapping `row` to `.switch--end`. A named layout reads better in templates than a boolean about which end the switch sits at.
- **D-6** *What happens to a settings row when the label does not fit beside the switch?* The label keeps the full width and the switch wraps beneath it at the start. Measured in Chromium, the original `row-reverse` row at 320 and 360 px with 200 % text pushed the label past the card's start edge (by 67 and 27 px), clipping "Appointment reminders", which breaks L2-042. Letting the label shrink instead squeezed it into a 46 px column broken mid-word. The rule (row direction, input `order: 1`, label `flex: 1 1 10em; min-width: 0`, `flex-wrap: wrap`), now in `components.css` and on the switch page, renders identically to the old row whenever the label has 10 em beside the switch, which covers every width at 100 % text; the DOM order (input, then text) is unchanged.
- **D-7** *Is the description part of the name?* No, as for the checkbox: `aria-labelledby` names the switch with the label span and `aria-describedby` points at the `<small>`. The design system's `<small class="text-muted">` markup is kept exactly.
- **D-8** *How does the switch look in forced colours?* With its own forced-colours rules, because system colours replace the backgrounds that draw the track and thumb: measured with forced colours emulated in Chromium, the on switch disappeared entirely. `components.css` carries these rules and the switch page documents them.
- **D-9** *Does the switch work with Angular forms?* Yes: it implements `ControlValueAccessor` with a `boolean` value, like the checkbox, so a settings form can bind it. The page still saves on change, not on a submit button.
- **D-10** *Which mocks use a switch?* Account settings, in a "Notifications" card separate from the contact-details form: those settings save the moment they change, so they sit outside the form whose "Save changes" button saves the details. The cookie preferences dialog keeps its checkbox because it saves on "Save preferences".

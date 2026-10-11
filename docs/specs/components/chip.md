# Chip

| Field | Value |
|---|---|
| Selector | `button[hp-chip]`, `span[hp-chip]`, `hp-chip-row` |
| Library path | `frontend/projects/components/src/lib/chip/` |
| Status | built |
| Traces to | L2-002, L2-005, L2-035, L2-041, L2-042 |
| Design system | [`chip.html`](../../design-system/components/chip.html) |
| Source mocks | [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`pages/style-gallery/edge`](../../mocks/pages/style-gallery/edge.html), [`pages/style-gallery/long`](../../mocks/pages/style-gallery/long.html), [`pages/style-gallery/offline`](../../mocks/pages/style-gallery/offline.html), [`pages/style-gallery/no-results`](../../mocks/pages/style-gallery/no-results.html), [`pages/matching-braiders/no-results`](../../mocks/pages/matching-braiders/no-results.html), [`dialogs/cookie-preferences/default`](../../mocks/dialogs/cookie-preferences/default.html), [`notifications/cookie-consent/info`](../../mocks/notifications/cookie-consent/info.html) |
| Rendering | [`chip.html`](chip.html) |

## Purpose and scope

Chips are compact pills for narrowing what is on screen. A filter chip toggles one criterion, such as the style type on the gallery ("All styles", "Braids", "Twists", "Locs"); an input chip shows one applied filter ("Under $150", "Within 10 km") and lets Maya remove it on its own; a static chip tags content ("Knotless", "Toronto West"). A chip row groups chips under one accessible name and, for a single-choice set, keeps exactly one chip pressed.

Use something else when:

- the control performs an action or navigates: use the [button](button.md);
- the label is read-only status ("Awaiting reply"): use the badge component;
- one of several options must be chosen inside a form that is submitted: use a [radio group](radio-group.md) or the select component;
- an independent option is saved with a form: use a [checkbox](checkbox.md).

Out of scope:

- Filtering the results, the results' busy state after a chip is pressed, and the polite announcement of the new count ("12 braiders"). The page owns them; the chip never shows a busy state (design system *States*).
- Which filters exist, their copy and whether "Clear filters" is shown. The page renders "Clear filters" as a `button[hp-button]` (link variant, small) inside the row when two or more filters are applied, and decides where focus goes after it clears them.
- Keeping filters in the URL or the search form. Chip state is page state.
- The filter dialog that sets price and distance (`dialogs/filter-braiders`); it uses text fields and buttons.

## Usage

Every use of `.chip` in `docs/mocks/`, grouped by configuration, plus the configurations the design system defines. The cookie dialog and cookie toast mocks show the style gallery behind them, so they repeat its chip row.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/style-gallery/default`, `edge`, `long`, `offline`; behind `dialogs/cookie-preferences/*` and `notifications/cookie-consent/*` | `hp-chip-row single aria-label="Style type"` with four `button[hp-chip]`, sm | "All styles", "Braids", "Twists", "Locs" | "All styles" pressed, the others not pressed (mock: only the pressed chip carries `aria-pressed` and the row has no name; drift fixed, D-10), hover, focus, active | canvas (page) |
| `pages/style-gallery/no-results` | `hp-chip-row aria-label="Applied filters"` with input chips `span[hp-chip]` | "Knotless", "Toronto", "Under $150"; remove labels "Remove filter: knotless", "Remove filter: Toronto", "Remove filter: under $150" (mock: one badge "Knotless · Toronto · under $150"; drift fixed, D-11) | default, remove hover, remove focus, removal | canvas |
| `pages/matching-braiders/no-results` | as above | "Under $150", "Within 10 km" (the price and distance set in the filter dialog); the selected style stays in the heading, not a chip (L2-005) | as above | canvas |
| Applied filters with "Clear filters" (design system *Variants*) | input chips plus `<button hp-button variant="link" size="sm">` in the row | "Under $200", "Within 10 km", "Clear filters" | default, removal, focus after removal | canvas |
| Matching braiders filter row (design system *Tables and lists* pattern, *Structure*) | `hp-chip-row aria-label="Availability and price"`, independent toggles | "Any day" (pressed), "This weekend", "Under $200" | pressed, not pressed | canvas |
| Content tags (design system *Variants*; badge *Do and don't*; shape and spacing foundations) | `span[hp-chip]` static, in a row or a card | "Knotless", "Twists", "Toronto West" | static only | surface (card) |
| Beside a 40 px search field or as a phone screen's main control (design system *Sizes*, *Responsive*) | `size="md"` | "Braids" | pressed, not pressed | canvas |
| Chips in a `.cluster` (design system container page) | `button[hp-chip]` without a row | "All styles", "Braids", "Twists", "Locs" | as the gallery | canvas |
| Sunken well (design system *Theming*) | any chip with `--chip-bg` overridden by the well | — | all | well (`--color-bg-surface-sunken`) |
| Disabled (design system *States*; rare) | filter `disabled`; input chip `disabled` | "Braids"; "Under $200" | disabled | canvas |

Every row is buildable with the API below: a filter chip (`button[hp-chip]`) with `pressed`, `value`, `size` and `disabled`; a static or input chip (`span[hp-chip]`) with `size`, `removeLabel` and `disabled`; and an optional `hp-chip-row` with `single`, `value` and `focusFallback`. All copy is projected or passed as an input or a native attribute.

## Anatomy

1. **Pill** — `.chip` on the host: `inline-flex`, centred, `--space-1` gap, `min-height` `--chip-height`, `--space-3` side padding (`--space-4` at md), `--radius-full`, `--border-width-hairline` edge in `--chip-border`, fill `--chip-bg`, label `--chip-fg` in `--text-label`.
2. **Label** — the projected text node. On a filter chip it is the accessible name; on an input or static chip it is plain text.
3. **Remove button (input chips)** — `button.remove` rendered by the component after the label: a `--target-min` (24 px) circle, `margin-right` −`--space-2`, transparent, holding the close icon (`svg.icon.icon--sm`, 16 px, `aria-hidden="true"`), named by `removeLabel`.
4. **Static modifier** — `.chip--static` on a `span` host: default cursor, `--color-border-default` edge, no hover fill.
5. **Row** — `hp-chip-row` with `.chip-row`: a wrapping flex row, `--space-2` gap, `role="group"` named by `aria-label` or `aria-labelledby`.

Host: the chip uses attribute selectors, so the host **is** the native `<button>` (filter) or `<span>` (input and static) and carries the `.chip` classes and every ARIA attribute (D-1). A filter chip's template is a single `<ng-content>`; an input chip's template is the `<ng-content>` followed by the remove button. The row is a composite with the element selector `hp-chip-row`, whose host carries `.chip-row` and `role="group"`.

## API

### Inputs — `button[hp-chip]`, `span[hp-chip]`

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `size` | `'sm' \| 'md'` | `'sm'` | no | `md` adds `.chip--md` (40 px, `--space-4` padding, `--font-size-md`). |
| `pressed` | `boolean` (two-way `model`) | `false` | no | `<button>` hosts only. Always rendered as `aria-pressed="true"` or `"false"` (D-2). Each activation flips it and emits `pressedChange`, except inside a `single` row, which owns it (D-3). |
| `value` | `string \| undefined` | `undefined` | inside a `single` row | `<button>` hosts only. The value a `single` row reports when this chip is pressed. Unique within the row. |
| `disabled` | `boolean` (`booleanAttribute`) | `false` | no | `<button>` host: native `disabled`. `<span>` host with a remove button: disables the remove button and dims the chip (D-8). Ignored on a static chip. |
| `removeLabel` | `string \| undefined` | `undefined` | for input chips | `<span>` hosts only. When set, the chip is an input chip and renders the remove button with this `aria-label` ("Remove filter: under $150"). When unset, the chip is static (D-7). |

### Inputs — `hp-chip-row`

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `single` | `boolean` (`booleanAttribute`) | `false` | no | A single-choice set: exactly one child filter chip is pressed, the one whose `value` equals the row's `value`; pressing the pressed chip does nothing (D-3). |
| `value` | `string \| null` (two-way `model`) | `null` | in a `single` row | The pressed chip's `value`. Ignored when `single` is false. |
| `focusFallback` | `HTMLElement \| undefined` | `undefined` | no | Where focus goes when an input chip is removed and the row has no other focusable element (D-5): for example the "Filters" button that opened the filter dialog. |

- Inputs are signal inputs (`input()`, `model()`); booleans accept bare attributes.
- `aria-label` or `aria-labelledby` on `hp-chip-row` is a plain attribute that names the group ("Style type", "Applied filters", "Availability and price"); in development mode a row without either logs a `console.error` naming `hp-chip-row`.
- `type` is always `button` on a filter chip; it never submits a form (D-14).
- No Angular forms integration: chips filter the page and are not form fields (D-4).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `pressedChange` | `boolean` | A filter chip outside a `single` row is activated and flips. Part of the `pressed` model. |
| `removed` | `void` | An input chip's remove button is activated by click, Enter, Space, Backspace or Delete (D-6). Emitted once per activation; the chip does not remove itself. |
| `valueChange` (row) | `string` | In a `single` row, a chip that was not pressed is activated. Part of the row's `value` model. Not emitted when the pressed chip is activated again. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default (chip) | Text | The label, declared once. One or two words; no icons (the remove icon is the component's own). |
| default (`hp-chip-row`) | `button[hp-chip]`, `span[hp-chip]`, and at most one `button[hp-button]` ("Clear filters") | Declared once. Chips register with the row through dependency injection. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Filter (toggle) | `.chip` on `<button aria-pressed>` | Quick, reversible filters: "Braids", "This weekend". In a `single` row, one of a set ("All styles" first, pressed by default). |
| Input (removable) | `.chip.chip--static` on `<span>` with `button.remove` | One applied filter Maya can remove: "Under $150". |
| Static | `.chip.chip--static` on `<span>` | A tag on content: "Toronto West". |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| sm | — | `--control-height-sm` (32 px) | `--space-3` | `--text-label` (`--font-size-sm`) |
| md | `.chip--md` | `--control-height-md` (40 px) | `--space-4` | `--text-label` at `--font-size-md` |

Width comes from the label and padding. The label wraps only when the chip would otherwise be wider than its row (D-9).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (not pressed) | `aria-pressed="false"` | `--chip-bg` `--color-bg-surface`, `--chip-border` `--color-border-strong`, `--chip-fg` `--color-fg-default` | Toggle button, not pressed |
| Hover | `:hover` | `--chip-bg` → `--color-bg-subtle` | — |
| Focus | `:focus-visible` | `--focus-ring-width` outline in `--color-focus-ring`, offset `--focus-ring-offset`, around the pill | — |
| Active | `:active` | `--chip-bg` → `--color-bg-subtle-hover` | — |
| Selected (pressed) | `aria-pressed="true"` | `--chip-bg` `--color-accent-subtle`, `--chip-border` `--color-accent`, `--chip-fg` `--color-fg-accent`: the selected look shared with Button's pressed state and the current nav link (D-13) | Toggle button, pressed |
| Selected hover | `aria-pressed="true"` + `:hover` | `--chip-bg` → `--color-accent-subtle-hover` | — |
| Disabled (filter) | native `disabled` | 50 % opacity, `cursor: not-allowed` | Disabled; removed from the tab order |
| Input chip | `.chip--static` + `button.remove` | `--color-border-default` edge; the remove button is transparent | The chip text is plain text; the remove button is a button named by `removeLabel` |
| Remove hover | `.remove:hover` | Remove circle fill `--color-bg-subtle-hover` | — |
| Remove focus | `.remove:focus-visible` | The shared ring around the 24 px circle | — |
| Input chip disabled | `disabled` on a `span` host | Remove button native `disabled`; chip at 50 % opacity through `:host:has(.remove:disabled)` (D-8) | Remove button disabled |
| Static | `.chip--static`, no remove button | `--color-border-default` edge; hover changes nothing | Plain text; not focusable |
| Forced colours | `(forced-colors: active)` | Edge `CanvasText` on every chip; a pressed chip adds a `--border-width-thick` `Highlight` outline; focus ring `Highlight` | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Fill and edge change instantly | — |
| Narrow row or enlarged text | a chip wider than its row | The label wraps inside the pill and the chip grows in height (D-9) | — |

## Markup

Rendered DOM. Classes, attributes and element order are the e2e contract.

```html
<!-- rendered: style type, a single-choice row -->
<hp-chip-row class="chip-row" role="group" aria-label="Style type">
  <button class="chip" type="button" aria-pressed="true">All styles</button>
  <button class="chip" type="button" aria-pressed="false">Braids</button>
  <button class="chip" type="button" aria-pressed="false">Twists</button>
  <button class="chip" type="button" aria-pressed="false">Locs</button>
</hp-chip-row>
```

```html
<!-- rendered: applied filters with Clear filters -->
<hp-chip-row class="chip-row" role="group" aria-label="Applied filters">
  <span class="chip chip--static">Under $150<button class="remove" type="button" aria-label="Remove filter: under $150"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></span>
  <span class="chip chip--static">Within 10 km<button class="remove" type="button" aria-label="Remove filter: within 10 km"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></span>
  <button class="btn btn--link btn--sm" type="button">Clear filters</button>
</hp-chip-row>
```

```html
<!-- rendered: static tag, md filter, disabled filter, disabled input chip -->
<span class="chip chip--static">Toronto West</span>
<button class="chip chip--md" type="button" aria-pressed="true">Braids</button>
<button class="chip" type="button" aria-pressed="false" disabled>Braids</button>
<span class="chip chip--static">Under $200<button class="remove" type="button" aria-label="Remove filter: under $200" disabled><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></span>
```

The close icon is the iconography foundation's `close` glyph rendered through the icon component as a single `svg.icon.icon--sm` (D-12); its path data is free to change with the icon set.

Consumer templates:

```html
<!-- consumer: style gallery, single choice -->
<hp-chip-row single aria-label="Style type" [(value)]="category">
  <button hp-chip value="all">All styles</button>
  <button hp-chip value="braids">Braids</button>
  <button hp-chip value="twists">Twists</button>
  <button hp-chip value="locs">Locs</button>
</hp-chip-row>

<!-- consumer: matching braiders applied filters -->
<hp-chip-row aria-label="Applied filters" [focusFallback]="filtersButton">
  @for (filter of appliedFilters(); track filter.key) {
    <span hp-chip [removeLabel]="'Remove filter: ' + filter.label.toLowerCase()" (removed)="remove(filter)">{{ filter.label }}</span>
  }
  @if (appliedFilters().length > 1) {
    <button hp-button variant="link" size="sm" (click)="clearFilters()">Clear filters</button>
  }
</hp-chip-row>

<!-- consumer: independent toggles -->
<hp-chip-row aria-label="Availability and price">
  <button hp-chip [(pressed)]="anyDay">Any day</button>
  <button hp-chip [(pressed)]="thisWeekend">This weekend</button>
  <button hp-chip [(pressed)]="under200">Under $200</button>
</hp-chip-row>

<!-- consumer: static tags on a braider card -->
<span hp-chip>Knotless</span>
<span hp-chip>Toronto West</span>
```

The "Remove filter: …" copy shown here is built in the page from translatable strings; the component receives the finished label.

## Design

- Height: `min-height` `--chip-height` (`--control-height-sm`, or `--control-height-md` at md). A wrapped label (D-9) grows the chip.
- Padding: `--space-3` horizontal (`--space-4` at md), none vertical; the remove button pulls in by −`--space-2` so its circle sits close to the pill's end.
- Gap between label and remove button: `--space-1`. Row gap: `--space-2`.
- Typography: `--text-label` (semibold `--font-size-sm`); md uses `--font-size-md`. The chip has `max-width: 100%`, `min-width: 0`, `white-space: normal`, `overflow-wrap: anywhere` and `text-align: center`; because a wrapping flex row moves a chip to the next line before it shrinks it, the label stays on one line whenever the chip fits its row and wraps only when the chip alone is wider than the row (D-9). Measured in Chromium, every chip renders at the same size as with `white-space: nowrap` at 320, 360 and 1280 px, except the one that overflowed.
- Shape: `--radius-full`; edge `--border-width-hairline`.
- Remove button: `--target-min` square, `--radius-full`, no border, `color: inherit`; icon 16 px (`.icon--sm`).
- Motion: `background-color` and `border-color` over `--duration-fast` with `--ease-standard`.
- Layer: none.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--chip-bg` | `--color-bg-surface` | `:hover` → `--color-bg-subtle`; `:active` → `--color-bg-subtle-hover`; `[aria-pressed="true"]` → `--color-accent-subtle` (hover `--color-accent-subtle-hover`); `.well .chip` → `--color-bg-surface-raised`; `.chip--static:hover` keeps `--color-bg-surface` |
| `--chip-fg` | `--color-fg-default` | `[aria-pressed="true"]` → `--color-fg-accent` |
| `--chip-border` | `--color-border-strong` | `[aria-pressed="true"]` → `--color-accent`; `.chip--static` → `--color-border-default` |
| `--chip-height` | `--control-height-sm` | `.chip--md` → `--control-height-md` |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Fill | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Fill, hover | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Fill, active; remove hover | `--color-bg-subtle-hover` | `--palette-gray-200` | `--palette-gray-700` |
| Label | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Edge | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-450` |
| Static and input edge | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Selected fill | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Selected fill, hover | `--color-accent-subtle-hover` | `--palette-plum-100` | `--palette-plum-900` |
| Selected label | `--color-fg-accent` | `--palette-plum-700` | `--palette-plum-300` |
| Selected edge | `--color-accent` | `--palette-plum-600` | `--palette-plum-300` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Label |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Label, hover |
| `--color-fg-default` | `--color-bg-subtle-hover` | 4.5:1 | Label, active |
| `--color-fg-accent` | `--color-accent-subtle` | 4.5:1 | Selected label |
| `--color-fg-accent` | `--color-accent-subtle-hover` | 4.5:1 | Selected label, hover |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Filter chip edge on the page |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Selected edge on the page |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Label on a well re-skin |

The static and input chip edge (`--color-border-default`) is decorative: those chips are not controls, and the remove button is a borderless icon button whose 16 px glyph in `--color-fg-default` carries its boundary.

Forced colours: `components.css` gives every `.chip` a `CanvasText` edge and a pressed chip a `--border-width-thick` `Highlight` outline, so the selected chip stays distinct without colour; `--color-focus-ring` maps to `Highlight`.

## Responsive behaviour

- Chip rows wrap (`flex-wrap: wrap`, `--space-2` gap); they never scroll sideways and never truncate a label.
- Measured in Chromium: the style-type row ("All styles", "Braids", "Twists", "Locs") fits one line at 360 px and wraps "Locs" to a second line at 320 px; the applied-filter row with three chips and "Clear filters" wraps to three lines at 320 and 360 px and fits one line at 768 px.
- At 320 px with text enlarged to 200 %, the input chip "Within 10 km" measured 263 px in a 256 px row with `white-space: nowrap`, overflowing its row by 7 px. The chip therefore wraps its label inside the pill when it would be wider than its row (D-9); measured with that rule, it stays inside the row and grows taller.
- Targets: a small chip is 32 px tall with 8 px between neighbours, passing the 24 px minimum; the remove button is a 24 × 24 px circle. Prefer `size="md"` where the row is a phone screen's main control (D-15).
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; every target is at least 24 × 24 CSS px.

## Accessibility

### Role and pattern

Filter chips are native `<button type="button" aria-pressed>` toggle buttons ([APG Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/), toggle) inside `role="group"` named by the row's `aria-label`. Input chips are a text label plus a real remove `<button>`. Static chips are plain `<span>` text. A `single` row is still a group of toggle buttons, not a radio group: each chip is its own tab stop and the design system keeps `aria-pressed`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves between filter chips and remove buttons; each is a tab stop. Static chips and disabled chips are skipped. |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | Toggles a filter chip (in a `single` row, presses it if it is not pressed); activates a remove button. |
| <kbd>Backspace</kbd> / <kbd>Delete</kbd> | On a focused remove button, also removes the filter. |

### Focus

- The shared `:focus-visible` ring: around the pill on a filter chip, around the 24 px circle on a remove button.
- Pressing a chip never moves focus.
- After an input chip is removed, the row moves focus to the focusable element that took its place (the next chip's remove button, or "Clear filters" when it was the last chip); if none follows, to the previous one; if the row has none left, to `focusFallback`; and only if that is unset, to the row itself with a temporary `tabindex="-1"`. Focus never falls to the top of the page (D-5).

### Labelling

- A filter chip's name is its text, and `aria-pressed` carries the state ("Braids, toggle button, pressed").
- A remove button's name says what it removes: "Remove filter: under $150". It starts with "Remove filter" and includes the visible chip text, satisfying WCAG 2.5.3.
- The row's `aria-label` names the set: "Style type", "Applied filters".

### Announcements

None from the component. The page announces the new result count in a polite live region after each change ("12 braiders").

### Motion

Fill and edge transition over `--duration-fast`; under `prefers-reduced-motion: reduce` the tokens zero it and the change is instant.

## Content and internationalisation

- Sentence-case nouns of one or two words: "Braids", "Twists", "All styles". Put "All …" first in a single-choice set, pressed by default.
- Input chips state the value, not the field: "Under $150", "Within 10 km". Money with a dollar sign and no decimals; distances in km.
- Pair applied-filter chips with "Clear filters" when there are two or more (the page renders it).
- Translatable content: chip labels, `removeLabel`, the row's `aria-label`. Data values: prices and distances inside input chip labels, formatted by the page. The component renders no copy of its own.
- Length: labels are short by rule and never truncate; when a row is narrower than a chip, the label wraps inside the pill (D-9). Copy is English only today and no L2 requirement covers translation.

## Performance

- Change detection: `OnPush`, signal inputs and models; a chip in a `single` row reads `pressed` through one `computed` against the row's value.
- Perf-test scenarios: `frontend/projects/perf-test/src/scenarios/Chip.ts` renders one filter chip, `<button hp-chip pressed>All styles</button>`; `frontend/projects/perf-test/src/scenarios/ChipRow.ts` renders the style gallery's single-choice row "All styles", "Braids", "Twists", "Locs" with "All styles" pressed (a repeated composition on the gallery). Iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep each at roughly 100–300 ms.
- Composite scenarios: `ChipRow` as above.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: pressing changes colours only; the chip's size never changes with its state. The row is rendered with the page, never after the results, so it does not shift the grid.
- Weight: `@angular/core` and the library's icon component only. No CDK, no forms.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given the style gallery's `<hp-chip-row single aria-label="Style type">` with "All styles", "Braids", "Twists" and "Locs", when it renders, then the host has `.chip-row` and `role="group"` named "Style type", it holds four native `<button class="chip" type="button">` elements, each with an `aria-pressed` attribute, and only "All styles" has `aria-pressed="true"`. (L2-002)
- **AC-2** Given a small and a md filter chip "Braids", when they are measured, then they are 32 and 40 px tall with 12 and 16 px side padding, fully rounded, with a 1 px `--color-border-strong` edge and a `--text-label` label. (L2-041)
- **AC-3** Given `<span hp-chip>Toronto West</span>` on a braider card, when it renders, then it is `<span class="chip chip--static">` with a `--color-border-default` edge, it is not focusable, it has no button role, and hovering it changes nothing. (L2-041)
- **AC-4** Given the matching braiders no-results state with the applied filter "Under $150", when its input chip renders, then it is `<span class="chip chip--static">` holding the text and a `button.remove` named "Remove filter: under $150", a 24 × 24 px circle whose 16 px close icon has `aria-hidden="true"`. (L2-005)

### States

- **AC-5** Given the style-type row with "All styles" pressed, when Maya presses "Braids", then "Braids" has `aria-pressed="true"` with the selected look, "All styles" has `aria-pressed="false"`, and the row's `valueChange` emits "braids" once. (L2-002)
- **AC-6** Given "Braids" is pressed in the single-choice row, when Maya presses "Braids" again, then it stays pressed, no other chip changes and no event is emitted. (L2-002)
- **AC-7** Given the "Availability and price" row without `single`, when Maya presses "This weekend" twice, then its `aria-pressed` goes to "true" and back to "false", `pressedChange` emits `true` then `false`, and "Any day" is unaffected. (L2-005)
- **AC-8** Given a pressed chip "Braids", when it renders, then its fill is `--color-accent-subtle`, its edge `--color-accent` and its label `--color-fg-accent`, the same tokens as a pressed `button[hp-button]`, and its label keeps at least 4.5:1 against the fill. (L2-002)
- **AC-9** Given a filter chip not pressed, when the pointer hovers it, then the fill becomes `--color-bg-subtle`; when it is pressed and held, then `--color-bg-subtle-hover`; and given a pressed chip, when hovered, then `--color-accent-subtle-hover`. (L2-041)
- **AC-10** Given `<button hp-chip disabled>Braids</button>`, when it renders, then it has native `disabled`, 50 % opacity, Tab skips it and clicking emits nothing. (L2-041)
- **AC-11** Given the input chip "Under $150", when Maya activates its remove button by click, Enter, Space, Backspace or Delete, then `removed` emits once per activation and the chip stays in the DOM until the page removes the filter. (L2-005)
- **AC-12** Given the matching braiders no-results state after a filter request with price under $150 and distance within 10 km, when it renders, then both criteria stay visible as input chips "Under $150" and "Within 10 km" beside "Clear filters", instead of one badge. (L2-035)

### Keyboard and focus

- **AC-13** Given the applied-filter row "Under $150", "Within 10 km", "Clear filters", when Maya removes "Under $150" with the keyboard and the page removes that filter, then focus lands on the remove button of "Within 10 km"; and when she then removes "Within 10 km", then focus lands on "Clear filters"; and when a row's only chip is removed with no other focusable element left, then focus moves to `focusFallback`, never to the page's top. (L2-041)
- **AC-14** Given the style-type row, when Maya presses Tab from the search field, then each chip in turn receives focus, and Space or Enter presses the focused chip. (L2-041)
- **AC-15** Given a chip focused by keyboard on the page canvas, when the ring shows, then it is a 2 px `--color-focus-ring` outline offset 2 px around the pill with at least 3:1 against `--color-bg-canvas`, and on a remove button it surrounds the 24 px circle. (L2-041)

### Screen readers

- **AC-16** Given the style-type row with "All styles" pressed, when a screen reader moves to "Braids", then it announces the group "Style type" and "Braids, toggle button, not pressed", and after Space "pressed". (L2-041)
- **AC-17** Given the input chip "Within 10 km", when a screen reader reads the row, then the chip text is read as text and the only control is the button "Remove filter: within 10 km". (L2-041)

### Theming

- **AC-18** Given the style-type row with "All styles" pressed, when the theme switches to dark, then the pressed chip's fill is plum 950 with a plum 300 label and edge without a reload, and every chip label keeps at least 4.5:1 against its fill, pressed or not, at rest and on hover. (L2-042)
- **AC-19** Given Windows forced colours, when the style-type row renders, then every chip has a `CanvasText` edge, the pressed chip has a 2 px `Highlight` outline, and the focus ring is `Highlight`. (L2-041)

### Responsive

- **AC-20** Given the style gallery at 360 px, when the style-type row renders, then all four chips sit on one line; and at 320 px, then "Locs" wraps to a second line and the page does not scroll horizontally. (L2-042)
- **AC-21** Given the applied-filter row on a 320 px viewport with text enlarged to 200 %, when "Within 10 km" renders, then the chip is no wider than the row, its label wraps inside the pill, its remove button stays visible and nothing scrolls horizontally. (L2-042)
- **AC-22** Given a row of small chips on a touch device, when it is measured, then each chip is at least 32 px tall with 8 px between chips, and each remove button is at least 24 × 24 px. (L2-041)

### Motion

- **AC-23** Given `prefers-reduced-motion: reduce`, when a chip is hovered or pressed, then its fill and edge change instantly. (L2-041)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/chip/`; files `chip.ts` exporting `Chip` (`selector: 'button[hp-chip], span[hp-chip]'`) and `chip-row.ts` exporting `ChipRow` (`selector: 'hp-chip-row'`), both standalone and `OnPush`, with scoped `styles` porting `.chip`, its states, `.chip--static`, `.chip--md`, `.chip .remove` and `.chip-row` from `docs/design-system/assets/components.css` with `:host` selectors. Export both from `public-api.ts`.
- Host element detection: inject `ElementRef` and read `tagName` once; `<button>` hosts bind `type="button"`, `aria-pressed` and `disabled`, `<span>` hosts bind `class.chip--static` and render the remove button when `removeLabel` is set.
- `Chip` template: `<ng-content />` then `@if (isRemovable()) { <button class="remove" type="button" [attr.aria-label]="removeLabel()" [disabled]="disabled()" (click)="emitRemoved()" (keydown.backspace)="emitRemoved()" (keydown.delete)="emitRemoved()"><svg hp-icon …></svg></button> }`. The slot is declared once, outside the condition.
- Host bindings: `class.chip` always; `class.chip--md` from `size`; `class.chip--static` on `<span>` hosts; `attr.type`, `attr.aria-pressed` and `attr.disabled` on `<button>` hosts; a `click` listener flips `pressed` or asks the row to press it.
- Wrap safety net (D-9): the ported `.chip` rule replaces `white-space: nowrap` with `white-space: normal` and adds `max-width: 100%`, `min-width: 0`, `overflow-wrap: anywhere` and `text-align: center`. `docs/design-system/assets/components.css` and the chip page (which says rows never shrink a label) change in the same slice.
- Disabled input chip (D-8): `:host(:has(.remove:disabled)) { opacity: 0.5; }` in the component styles.
- `ChipRow` provides an injection token that `Chip` injects optionally; it holds the chips in a `contentChildren` signal, `class.chip-row` and `attr.role="group"` on the host. Removal focus (D-5): when a chip emits `removed`, the row records the index of its remove button among the row's focusable elements; when that chip is destroyed, the row focuses, in `afterNextRender`, the focusable element now at that index, else the last one, else `focusFallback`, else itself with a temporary `tabindex="-1"`.
- Development checks: a row without `aria-label` or `aria-labelledby`, a `single` row with a chip lacking `value` or with duplicate values, and a `span` input chip with an empty `removeLabel` each log a `console.error` naming the component.
- Composes the icon component (`svg[hp-icon]`) for the close glyph at its small size; no CDK primitive.
- Perf-test scenarios `Chip.ts` and `ChipRow.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Which elements are the hosts?* Attribute selectors on the native elements: `button[hp-chip]` for filter chips and `span[hp-chip]` for input and static chips, with `.chip` on the host, because the design system's markup is exactly `<button class="chip" aria-pressed>` and `<span class="chip chip--static">`, `.chip-row` lays chips out as direct flex children, and a native button keeps toggle semantics, Space and Enter. The row is a composite, so it uses the element selector `hp-chip-row` with `.chip-row` and `role="group"` on its host.
- **D-2** *Does every filter chip render `aria-pressed`?* Yes, always `"true"` or `"false"`; `pressed` defaults to `false`. Unlike Button, where an undefined `pressed` means "not a toggle", a filter chip is always a toggle. The design system records the gallery mock's chips without `aria-pressed` as drift: they read as plain buttons.
- **D-3** *Who keeps exactly one chip pressed in a single-choice set?* The row, with `single` and a `value` model: pressing an unpressed chip presses it and releases the others, and pressing the pressed chip does nothing, as the design system specifies. Without `single`, chips are independent toggles bound with `[(pressed)]`, which covers the "Availability and price" row.
- **D-4** *Does the chip row implement `ControlValueAccessor`?* No. Chips filter the page immediately and their state belongs to the page and its URL, not to a submitted form; the brief scopes forms integration to the checkbox, radio group and switch. A form that needs one choice of several uses the radio group.
- **D-5** *Where does focus go after an input chip is removed?* To the next focusable element in the row (the next chip's remove button, or "Clear filters"), as the design system says; then the previous one; then `focusFallback`; and only then the row itself. The design system only names the next chip and "Clear filters"; the fallbacks cover a row whose single chip is removed, where "Clear filters" is not shown (it appears only for two or more filters), so focus never drops to the page's top.
- **D-6** *Which keys remove a filter?* Click, Enter and Space on the remove button, as on any button, plus Backspace and Delete on the focused remove button, as the design system's keyboard table specifies. The chip emits `removed` and leaves removal to the page, so a failed or vetoed removal leaves the chip and focus untouched.
- **D-7** *How is an input chip told apart from a static chip?* By `removeLabel`: a `span[hp-chip]` with a label renders the remove button; without one it is static. The label is required for the button to have a name, so making its presence the switch avoids an unnamed remove button.
- **D-8** *How does a disabled input chip look, given `.chip:disabled` cannot match a `<span>`?* The remove button gets native `disabled` and the component dims the chip with `:host(:has(.remove:disabled))`, matching the design system's disabled input chip without adding a documentation-only `data-state` in production. The design system also says disabled chips are rare; filters should stay enabled.
- **D-9** *May a chip label wrap?* Yes, as a safety net only. The design system sets `white-space: nowrap` and says rows never shrink a label. Measured in Chromium at 320 px with 200 % text, "Within 10 km" with its remove button was 7 px wider than its row, which breaks L2-042's 200 % text rule. The chip therefore drops `white-space: nowrap` and gains `max-width: 100%`: a wrapping row still moves a chip to the next line before shrinking it, so the label keeps one line whenever the chip fits (measured: identical sizes at 320, 360 and 1280 px) and wraps inside the pill, growing in height, only when the chip alone is wider than its row. This matches Button's D-5.
- **D-10** *The gallery mock gives only the pressed chip `aria-pressed` and the row no name. Which wins?* The design system: every chip states `aria-pressed`, the row is a group named "Style type", and one chip is pressed at a time.
- **D-11** *The no-results mocks show applied filters as one badge ("Knotless · Toronto · under $150"). Which wins?* The design system: one removable input chip per applied filter, so Maya can widen one criterion at a time (L2-035 keeps the criteria visible and clearable).
- **D-12** *How does the chip render the close icon?* Through the icon component, as the iconography foundation's `close` glyph at the small size, producing one `svg.icon.icon--sm` with `aria-hidden="true"` (16 px). The icon is part of the component, not a slot, because the remove button's look is fixed by the design system.
- **D-13** *Is the selected look the chip's own?* No: it is the shared selected look of Button's pressed state and the current nav link (`--color-accent-subtle`, `--color-accent`, `--color-fg-accent`), so a pressed chip and a pressed "Saved" button read as the same state.
- **D-14** *Can a filter chip submit a form?* No. The component always writes `type="button"`, as the design system's markup does, so a chip inside a search form never submits it.
- **D-15** *When is `md` used?* When the chips share a row with a 40 px search field or button, and when a chip row is the main control of a phone screen, per the design system's *Sizes* and *Touch* guidance. The page chooses; the chip never resizes itself by viewport.
- **D-16** *`components.css` also styles `.chip[aria-selected="true"]`. Does the component use it?* No. Chips are toggle buttons, never options in a listbox or tabs, so the component never renders `aria-selected`; the stylesheet rule stays harmless.

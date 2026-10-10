# Progress bar

| Field | Value |
|---|---|
| Selector | `div[hp-progress]`, `hp-progress-field` |
| Library path | `frontend/projects/components/src/lib/progress-bar/` |
| Status | planned |
| Traces to | L2-036, L2-041, L2-042, L2-045 |
| Design system | [`progress-bar.html`](../../design-system/components/progress-bar.html) |
| Source mocks | None use a progress bar yet. Closest: [`pages/booking-request/submitting`](../../mocks/pages/booking-request/submitting.html) and [`dialogs/cookie-preferences/busy`](../../mocks/dialogs/cookie-preferences/busy.html), short submits that use Button's busy state instead |
| Rendering | [`progress-bar.html`](progress-bar.html) |

## Purpose and scope

A progress bar shows how far a task of known length has come — Maya's inspiration photos uploading for Nia, "2 of 3" — or that a long task of unknown length is still moving. When the task ends the bar shows the outcome in colour and its label says it in words: "Photos uploaded", or "Upload stopped: connection lost" with the count kept at "1 of 3" so Maya knows what is safe.

The component has two parts:

- `div[hp-progress]`, the bar itself (track and fill) with the `progressbar` role;
- `hp-progress-field`, the bar with its visible label, an optional count and an optional action such as "Cancel upload" or "Retry upload".

Use something else when:

- content is loading into a known layout: use the [skeleton](skeleton.md);
- the wait is short and tied to one control ("Send request"): use the [button](button.md)'s `busy` state;
- a small region refreshes in place: use the [spinner](spinner.md).

Out of scope:

- Doing, pausing, cancelling or retrying the task; the consumer owns it and binds `value` and `status`.
- Announcing the start and the outcome: the design system routes those through a toast or the page's polite status region ("Photos uploaded", "Upload stopped: connection lost"). The bar never announces each step.
- Explaining what is kept after a failure ("Your other photos are saved. Retry when connected."): that sentence belongs to the toast or inline message that reports the outcome.
- Marking the region it reports on as busy (`aria-busy`), which is the consumer's element.
- Placement above a bottom-sheet dialog's sticky footer: the dialog's layout owns it.

## Usage

No mock uses a progress bar; it is part of the design system's core set so the first upload flow has a ready, accessible pattern. Every configuration below comes from the design-system page.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Inspiration photos for Nia on `pages/appointment-detail` ("Send any inspiration photos in advance"), design system *Variants*, no mock yet | `hp-progress-field`, determinate, `max` 3 | label "Uploading inspiration photos", count "2 of 3", value text "2 of 3 photos"; action "Cancel upload" | starting (0), in progress, complete ("Photos uploaded", "3 of 3"), failed ("Upload stopped: connection lost", "1 of 3", action "Retry upload") | surface (card, dialog) |
| A photo thumbnail row, design system *Bar only* | `div[hp-progress]` alone, determinate, `max` 100 | `aria-label="Uploading braids-front.jpg"` | in progress (40) | surface |
| A long task of unknown length, design system *Variants* | `hp-progress-field`, indeterminate | label "Importing your past appointments" | running, complete ("Appointments imported", full success bar), failed ("Import stopped", full danger bar) | surface |
| Inside a toast, design system *Theming* | `div[hp-progress]`, determinate, inverse surface | `aria-label` naming the task | in progress | inverse (toast) |
| Not a use: `pages/*/submitting`, `dialogs/*/busy` | — | — | Button's `busy` state, never a bar stacked on a disabled "Working…" button (design system *Do and don't*) | — |

Every row is buildable with the API below: a bar with `value`, `max`, `status` and `valueText`, named natively, or a field that adds the label, count and one action.

## Anatomy

1. **Label** — `hp-progress-field` only: `<span id>` in `.progress-field__label`; names the bar through `aria-labelledby`. Present tense while running, the outcome when ended.
2. **Count (optional)** — `<output>` in the label row: "2 of 3", tabular numbers, `--color-fg-muted`.
3. **Action (optional)** — one projected Button at the end of the label row: "Cancel upload" while running, "Retry upload" after a failure.
4. **Track** — `.progress` on the `div[hp-progress]` host: full width, 8 px tall (`--space-2`), `--radius-full`, `--color-bg-subtle-hover`, `overflow: hidden`.
5. **Fill** — `.progress__bar`: width from `--value`, colour from `--progress-fill`; a 40 % sweeping segment when indeterminate.

Hosts: the bar uses an attribute selector on a native `<div>`, so the host is the `.progress` track with `role="progressbar"` and every ARIA value attribute, and `.progress-field`'s column layout applies to it directly (D-1). The field is a composite with an element selector; its host carries `.progress-field`.

## API

### `div[hp-progress]` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `value` | `number \| null` | `null` | no | Progress from 0 to `max`. Null means the length is unknown: `.progress--indeterminate` while running. Clamped to 0–`max`. |
| `max` | `number` | `100` | no | `aria-valuemax`. Use the countable unit ("3" photos) when the count reads better than a percentage. |
| `status` | `'running' \| 'success' \| 'danger'` | `'running'` | no | `success` adds `.progress--success`, `danger` adds `.progress--danger`. An ended bar is never indeterminate: with `value` null it shows a full bar (D-3). |
| `valueText` | `string \| null` | `null` | no | `aria-valuetext` ("2 of 3 photos", "1 of 3 photos, stopped"). Null leaves assistive technology to read the number. |

- The bar's name is a native attribute on the host: `aria-labelledby` (the field sets it) or `aria-label` ("Uploading braids-front.jpg"). In development mode a bar with neither is reported as a console error naming `hp-progress` (D-5).

### `hp-progress-field` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | The visible label and the bar's name. |
| `displayValue` | `string \| null` | `null` | no | The `<output>` text ("2 of 3"). Null renders no output. Prefer counts people understand; never a count and a percentage together. |
| `value`, `max`, `status`, `valueText` | as above | as above | no | Passed to the inner bar. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The bar is not interactive. The projected action's own `click` is the consumer's. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `hp-progress-field` `[slot=action]` | One `button[hp-button]`, usually `size="sm"`: "Cancel upload", "Retry upload" | Declared once, rendered at the end of the label row. Optional. |
| `div[hp-progress]` | None | The fill is rendered by the component. |

- Inputs are signal inputs. Every string is an input (`label`, `displayValue`, `valueText`) or a native attribute; the component renders no copy of its own.

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Determinate | — | A countable task: bytes, files, steps. The default whenever a count exists. |
| Indeterminate | `.progress--indeterminate` | A long task whose length is truly unknown. |
| Success | `.progress--success` | The task finished. |
| Danger | `.progress--danger` | The task stopped or failed. |
| Bar only | `div[hp-progress]` without a field | A dense row (a thumbnail, a list item); named with `aria-label`. |
| With label and value | `hp-progress-field` | Every other use. |

One size: an 8 px track (`--space-2`). Emphasis comes from the label, not a thicker bar. The width is always the container's.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Starting | `value` 0 | Empty track | `aria-valuenow="0"` |
| In progress | 0 < `value` < `max` | Fill at `value ÷ max`, `--color-accent`; width changes animate over `--duration-deliberate` | `aria-valuenow`, `aria-valuetext` when set; read on demand |
| Indeterminate | `value` null, `status` running | A 40 % accent segment sweeps once per `--duration-loop-shimmer` | No `aria-valuenow`, `aria-valuemin` or `aria-valuemax` |
| Complete | `status` success | `--color-success-solid` fill; full when `value` is null or `max` | `aria-valuenow` equals `max` when `value` is null |
| Failed | `status` danger | `--color-danger-solid` fill at the reached value, or full when `value` is null | `aria-valuenow` kept at the reached value |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Fill changes instantly; the indeterminate segment pauses as a still 40 % segment | — |
| Inverse surface | inside `.toast` | Fill `--color-fg-inverse` | — |
| Forced colours | `(forced-colors: active)` | Track outlined in `CanvasText`, fill `Highlight` (D-6) | — |

The bar is not interactive: no hover, focus, active or disabled state. The action's states are Button's.

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: field, determinate, with action -->
<hp-progress-field class="progress-field">
  <div class="progress-field__label">
    <span id="hp-progress-label-1">Uploading inspiration photos</span>
    <output>2 of 3</output>
    <button class="btn btn--sm" type="button">Cancel upload</button>
  </div>
  <div class="progress" role="progressbar" aria-labelledby="hp-progress-label-1"
       aria-valuemin="0" aria-valuemax="3" aria-valuenow="2" aria-valuetext="2 of 3 photos">
    <div class="progress__bar" style="--value: 66.67%"></div>
  </div>
</hp-progress-field>
```

```html
<!-- rendered: indeterminate bar -->
<div class="progress progress--indeterminate" role="progressbar" aria-labelledby="hp-progress-label-2">
  <div class="progress__bar"></div>
</div>
```

```html
<!-- rendered: failed and complete -->
<div class="progress progress--danger" role="progressbar" aria-labelledby="hp-progress-label-1"
     aria-valuemin="0" aria-valuemax="3" aria-valuenow="1" aria-valuetext="1 of 3 photos, stopped">
  <div class="progress__bar" style="--value: 33.33%"></div>
</div>
<div class="progress progress--success" role="progressbar" aria-labelledby="hp-progress-label-2"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
  <div class="progress__bar" style="--value: 100%"></div>
</div>
```

```html
<!-- rendered: bar only -->
<div class="progress" role="progressbar" aria-label="Uploading braids-front.jpg"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="40">
  <div class="progress__bar" style="--value: 40%"></div>
</div>
```

Consumer templates:

```html
<!-- consumer: inspiration photos -->
<hp-progress-field
  [label]="failed() ? 'Upload stopped: connection lost' : done() ? 'Photos uploaded' : 'Uploading inspiration photos'"
  [displayValue]="uploaded() + ' of ' + total()"
  [value]="uploaded()" [max]="total()"
  [status]="failed() ? 'danger' : done() ? 'success' : 'running'"
  [valueText]="uploaded() + ' of ' + total() + ' photos' + (failed() ? ', stopped' : '')">
  @if (failed()) {
    <button hp-button size="sm" slot="action" (click)="retry()">Retry upload</button>
  } @else if (!done()) {
    <button hp-button size="sm" slot="action" (click)="cancel()">Cancel upload</button>
  }
</hp-progress-field>

<!-- consumer: bar only in a thumbnail row -->
<div hp-progress aria-label="Uploading braids-front.jpg" [value]="40"></div>
```

The label id is generated per instance (`hp-progress-label-n`); its form is free to change. The `--value` percentage may be rounded to two decimals.

## Design

- Track: `width: 100%`, height `--space-2`, `--radius-full`, `--color-bg-subtle-hover`, `overflow: hidden`.
- Fill: `height: 100%`, `width: var(--value, 0%)`, `background: var(--progress-fill)`, radius inherited; `width` transitions over `--duration-deliberate` with `--ease-standard`.
- Indeterminate: fill `width: 40%`, `indeterminate` keyframes (`translate: -100%` to `350%`) over `--duration-loop-shimmer`, `--ease-standard`, infinite, `animation-play-state: var(--motion-loop-state)`.
- Field: column, gap `--space-1`; label row `flex`, `space-between`, gap `--space-3`, `--text-label`, and it wraps: the label grows and the count and action keep their width (D-4); count `--color-fg-muted`, `--font-weight-regular`, tabular numbers.
- Layer and elevation: none.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--progress-fill` | `--color-accent` | `.progress--success` → `--color-success-solid`; `.progress--danger` → `--color-danger-solid`; a toast → `--color-fg-inverse` |
| `--value` | `0%` | The component's `value ÷ max` on `.progress__bar` |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Fill, running | `--color-accent` | `--palette-plum-600` | `--palette-plum-300` |
| Fill, success | `--color-success-solid` | `--palette-green-700` | `--palette-green-300` |
| Fill, danger | `--color-danger-solid` | `--palette-red-600` | `--palette-red-300` |
| Track | `--color-bg-subtle-hover` | `--palette-gray-200` | `--palette-gray-700` |
| Label | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Count | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |

Contrast pairs, from the design-system page and `tokens/contrast-pairs.json`:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-accent` | `--color-bg-surface` | 3:1 | Running fill in a card |
| `--color-success-solid` | `--color-bg-surface` | 3:1 | Complete fill |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Failed fill |
| `--color-accent` | `--color-bg-surface-raised` | 3:1 | Running fill in a dialog |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Label |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Count |
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Label in a dialog |

The track is decorative; the fill, label and count carry the information, and the label always says the outcome so colour is never the only signal.

## Responsive behaviour

- The bar is always 100 % of its container and never sets its own width; place the field inside the form, card or dialog it reports on.
- The label row wraps: the label takes the first line and the count and action follow on the next line when they do not fit. Measured at 320 px, "Upload stopped: connection lost" with "1 of 3" and "Retry upload" wraps without overflow; without wrapping (the original stylesheet) the count was squeezed to 16 px at 320 px and the row overflowed the card by about 200 px at 360 px with text at 200 % (D-4).
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available. The bar is not a target; the action follows Button's sizes (32 px small).

## Accessibility

### Role and pattern

`role="progressbar"` on the `.progress` host ([WAI-ARIA progressbar](https://www.w3.org/TR/wai-aria-1.2/#progressbar)). Determinate bars set `aria-valuemin`, `aria-valuemax` and `aria-valuenow`, and `aria-valuetext` when a count reads better. Indeterminate bars omit all three.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Not focusable. Reaches the field's action ("Cancel upload", "Retry upload") if present, then moves on. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | On the action: Button behaviour. |

### Focus

The bar never takes focus. The action receives focus with the shared ring. When the action changes from "Cancel upload" to "Retry upload" (or disappears on success) while focused, the consumer keeps focus on the replacement or moves it to the field's label; the component renders one action at a time.

### Labelling

Named by `aria-labelledby` pointing at the visible label (field) or `aria-label` (bar only). A bar named "Progress" says nothing: name the task. The count is `<output>`, visible text, not part of the name.

### Announcements

None. Screen readers read the value on demand; announcing every percentage would be noise. The start and the outcome are announced once by the consumer's toast or status region.

### Motion

Determinate fills animate width over `--duration-deliberate` (500 ms); reduced motion makes the change instant. The indeterminate sweep loops on `--duration-loop-shimmer` and pauses under `prefers-reduced-motion: reduce`, leaving a still 40 % segment; the label still says the task is running.

## Content and internationalisation

- Present tense while running ("Uploading inspiration photos"), the outcome when ended ("Photos uploaded", "Upload stopped: connection lost").
- Counts people understand ("2 of 3"); never a count and a percentage together. `valueText` repeats the count with its unit ("2 of 3 photos").
- Do not promise a time remaining unless it is accurate.
- Actions say what they do: "Cancel upload", "Retry upload".
- Translatable inputs: `label`, `displayValue`, `valueText`, the bar's `aria-label`, the projected action label. Data values: counts and file names ("braids-front.jpg"). The product is English-only today; a longer label wraps onto its own line.

## Performance

- Change detection: `OnPush`, signal inputs; the percentage, the modifier classes and the ARIA values are `computed`.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/ProgressBar.ts` renders `<hp-progress-field label="Uploading inspiration photos" displayValue="2 of 3" [value]="2" [max]="3" valueText="2 of 3 photos" />`; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none.
- Regression rule: a change to its template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: the track's height is fixed and the fill moves inside it, so progress never shifts the layout; the indeterminate sweep animates `translate` only.
- Weight: `@angular/core`; Button only through projection. No CDK.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `hp-progress-field` labelled "Uploading inspiration photos" with `displayValue` "2 of 3", `value` 2, `max` 3 and `valueText` "2 of 3 photos", when it renders, then the label row shows the label and an `<output>` reading "2 of 3", and the bar has `role="progressbar"`, `aria-labelledby` pointing at the label, `aria-valuemin="0"`, `aria-valuemax="3"`, `aria-valuenow="2"`, `aria-valuetext="2 of 3 photos"` and a fill two thirds of the track wide. (L2-041)
- **AC-2** Given `<div hp-progress aria-label="Uploading braids-front.jpg" [value]="40">`, when it renders, then its accessible name is "Uploading braids-front.jpg", `aria-valuenow` is 40 of 100 and the fill is 40 % of the track. (L2-041)
- **AC-3** Given a progress field in a 360 px wide dialog body and in a 1280 px card, when it renders, then the track is 8 px tall with fully rounded ends and exactly as wide as its container in both. (L2-042)
- **AC-4** Given a bar with `value` null labelled "Importing your past appointments", when it renders, then it has the class `progress--indeterminate`, no `aria-valuenow`, `aria-valuemin` or `aria-valuemax`, and a 40 % accent segment sweeping across the track. (L2-041)

### States

- **AC-5** Given the inspiration-photo field at "1 of 3", when `value` becomes 2, then `aria-valuenow` becomes 2 at once and the fill widens to two thirds over 500 ms. (L2-041)
- **AC-6** Given all three photos uploaded, when `status` becomes success with label "Photos uploaded" and `displayValue` "3 of 3", then the bar has `.progress--success`, a full `--color-success-solid` fill, and the label, not only the colour, says the outcome. (L2-041)
- **AC-7** Given the indeterminate import bar, when `status` becomes success with `value` still null, then the sweep stops, the bar shows a full success fill, and `aria-valuenow` equals `aria-valuemax`. (L2-041)
- **AC-8** Given the upload reaches "1 of 3" and the connection drops, when the consumer sets `status` to danger and the label to "Upload stopped: connection lost", then the fill turns `--color-danger-solid` and stays at one third, the count stays "1 of 3", and no success state is shown. (L2-036)
- **AC-9** Given the failed upload with a projected "Retry upload" button, when the connection returns, then the bar stays in its danger state and no upload resumes until Maya activates "Retry upload". (L2-045)

### Keyboard and focus

- **AC-10** Given the running upload field with a projected "Cancel upload" button, when Maya presses Tab through the card, then focus skips the bar and lands on "Cancel upload" with the shared focus ring. (L2-041)

### Screen readers

- **AC-11** Given a screen reader on the running upload field, when Maya reaches the bar, then it reads "Uploading inspiration photos", progress bar, "2 of 3 photos", and as `value` changes no live announcement is made by the bar. (L2-041)
- **AC-12** Given a `div[hp-progress]` with neither `aria-label` nor `aria-labelledby` in development mode, when it initialises, then the console reports an error naming `hp-progress` and the missing name. (L2-041)

### Theming

- **AC-13** Given running, success and danger bars in a card, when the theme switches from light to dark, then the fills change to plum 300, green 300 and red 300 and the track to grey 700 without a reload, and each fill keeps a contrast of at least 3:1 against `--color-bg-surface`. (L2-042)
- **AC-14** Given Windows forced colours, when a running bar renders, then the track shows a `CanvasText` outline and the fill is `Highlight`, so the reached value stays visible. (L2-041)
- **AC-15** Given a bar inside a toast, when it renders in either theme, then its fill is `--color-fg-inverse`. (L2-041)

### Responsive

- **AC-16** Given the failed field "Upload stopped: connection lost" with "1 of 3" and "Retry upload" at 320 px, and at 360 px with text enlarged to 200 %, when it renders, then the label, count and button wrap onto further lines inside the card, none is squeezed or clipped, and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-17** Given `prefers-reduced-motion: reduce`, when the value changes from 1 to 2, then the fill width changes instantly, and an indeterminate bar shows a still 40 % segment. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/progress-bar/`; files `progress.ts` (standalone component `Progress`, `selector: 'div[hp-progress]'`) and `progress-field.ts` (standalone component `ProgressField`, `selector: 'hp-progress-field'`), both `OnPush`, exported from `public-api.ts`.
- `Progress` host bindings: `class.progress`; `class.progress--indeterminate` when `value` is null and `status` is running; `class.progress--success` / `class.progress--danger`; `attr.role="progressbar"`; `attr.aria-valuemin`, `attr.aria-valuemax`, `attr.aria-valuenow` (null when indeterminate); `attr.aria-valuetext`. Template `<div class="progress__bar" [style.--value]="percent()"></div>`. Styles port `.progress*` and `@keyframes indeterminate` from `docs/design-system/assets/components.css`, plus the toast rule (`.toast .progress` in `components.css`, ported as `:host-context(.toast) { --progress-fill: var(--color-fg-inverse); }`) and the forced-colours rule (D-6), both as `components.css` defines them.
- `ProgressField`: `host: { class: 'progress-field' }`; template: the label row (`<span [id]="labelId">`, `@if (displayValue())` output, `<ng-content select="[slot=action]" />`) and `<div hp-progress [attr.aria-labelledby]="labelId" …>`. Label id from a module counter. Label-row rule (D-4): `.progress-field__label { flex-wrap: wrap; align-items: center; } .progress-field__label > span { flex: 1 1 auto; }`, exactly as `components.css` defines it.
- Development check (D-5): in `ngOnInit` of `Progress`, when `isDevMode()` and the host has neither `aria-label` nor `aria-labelledby` (and is not inside a field), `console.error` naming `hp-progress`.
- No CDK primitive.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/ProgressBar.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Attribute or element selector for the bar?* An attribute selector on a native `<div>`: the host is the `.progress` track with `role="progressbar"`, exactly the design system's markup, and the field's column layout and any parent rule (`.toast .progress`) apply to it directly. The field is a composite with the element selector `hp-progress-field`, whose host carries `.progress-field`.
- **D-2** *Is the slug's component one selector or two?* Two in one library folder: the bar alone is needed in dense rows (design system *Bar only*), and the field is the common case. Both are specified here so neither API changes when the first upload flow lands.
- **D-3** *What does an ended indeterminate task look like?* A full success or danger bar with `aria-valuenow` equal to `aria-valuemax`, as the design system's states matrix shows; a bar that keeps sweeping after the task ended would look falsely busy.
- **D-4** *The original label row did not wrap. Is that acceptable?* No. Measured in Chromium: with an action, the count was squeezed to 16 px at 320 px and the row overflowed the card at 360 px with text at 200 %, breaking L2-042. The row wraps; the label grows; the count and action keep their width. The design system's own rule (wrap rather than truncate) asks for this; `components.css` now carries the rule and the progress-bar page shows the wrapping row with its action.
- **D-5** *How is a nameless bar caught?* A development-mode console error naming the component, the same proportionate check Button uses for an icon-only button without a label; the bar still renders.
- **D-6** *Forced colours remove the track and fill backgrounds. What shows?* The track gets a `CanvasText` hairline outline and the fill opts out of adjustment with a `Highlight` background, so the reached value stays visible. `components.css` carries the rule and the progress-bar page documents it.
- **D-7** *Where does the action go?* At the end of the label row, after the count: the design system puts "Cancel upload" next to the label, and one row keeps the field compact. Only one action is rendered at a time.
- **D-8** *Does the field announce the outcome itself?* No. The design system routes start and outcome through a toast or the page's status region; putting a live region in the field would duplicate the toast's announcement.

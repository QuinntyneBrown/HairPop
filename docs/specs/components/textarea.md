# Textarea

| Field | Value |
|---|---|
| Selector | `textarea[hp-textarea]` |
| Library path | `frontend/projects/components/src/lib/textarea/` |
| Status | planned |
| Traces to | L2-009, L2-025, L2-036, L2-039, L2-041, L2-042 |
| Design system | [`textarea.html`](../../design-system/components/textarea.html) |
| Source mocks | [`pages/care-and-review/default`](../../mocks/pages/care-and-review/default.html), [`pages/care-and-review/invalid`](../../mocks/pages/care-and-review/invalid.html), [`pages/booking-request/default`](../../mocks/pages/booking-request/default.html), [`dialogs/report-review/default`](../../mocks/dialogs/report-review/default.html), [`dialogs/report-review/invalid`](../../mocks/dialogs/report-review/invalid.html), [`dialogs/report-review/failed`](../../mocks/dialogs/report-review/failed.html) |
| Rendering | [`textarea.html`](textarea.html) |

## Purpose and scope

A textarea collects a few sentences in the customer's own words: Maya's review of her visit with Nia, the hair details for a booking request, the reason she reports a review. It is the native `<textarea>` with the design system's look, an auto-grow variant that grows with the text up to a cap, and the wiring that lets a [form field](form-field.md) label, describe, count and validate it.

Use something else when:

- the answer is a single value ("Email", "Maximum price"): use the [text field](text-field.md);
- the answer is one of a known set: use the [select](select.md) or a radio group.

Out of scope:

- The label, hint, error, counter and its announcement: the [form field](form-field.md) renders them; the limit is the field's `maxLength` plus a validator.
- Trimming, blank-only detection and length rules: the page's validators ("Write a few words about your visit with Nia." for a blank review, L2-025).
- How submitted text is rendered elsewhere (review cards): those components render it as text (L2-039).

## Usage

Every `textarea.textarea` in `docs/mocks/`, plus the configurations the design system adds:

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/care-and-review` | `autoGrow`, in a field with hint and counter (limit 500) | "Your review", "Nia explained each step and the braids feel comfortable.", hint "What should others know about your visit?", "56 of 500 characters" | default, invalid "Write a few words about your visit with Nia.", over limit, submitting (editable), offline, failed | surface (form panel) |
| `pages/booking-request` | `autoGrow`, field marked optional, counter (limit 200) | "Hair details (optional)", "Shoulder length; bringing my own extensions" | default, over limit "Shorten this to 200 characters or fewer.", submitting, offline | surface |
| `dialogs/report-review` | `autoGrow`, counter (limit 300) | "Reason", "Inaccurate service details" | default, invalid "Tell us what needs review.", busy, failed (value kept) | raised (dialog) |
| `notifications/review-feedback` (screens behind the toasts) | as care and review | as above | default | surface |
| Design system *Variants* | default (manually resizable), `rows="3"` | "Hair details" | default | surface |
| Design system *States* | `readonly`, `disabled` | "Comfortable and neat." | read-only, disabled | surface |

Every row is buildable with the API below: one native textarea with `autoGrow`, its native attributes, inside a form field.

## Anatomy

1. **Container** — `.textarea` on the native `<textarea>`: full width, at least 2.5 × `--control-height-md` (100 px) tall, `--space-2` × `--space-3` padding, `--border-width-hairline` `--field-border`, `--radius-md`, `--field-bg` fill.
2. **Text** — `--text-body` with its normal line height, wrapping; placeholder (rarely used) in `--color-fg-subtle`.
3. **Resize handle (default variant)** — the platform's, vertical only.
4. **Focus ring** — as the text field: border and 2 px outline in `--color-focus-ring`, no offset.

Host: `textarea[hp-textarea]` is a component on the native `<textarea>` with an empty template; the host carries `.textarea`, `.textarea--auto-grow` when growing, `id`, `aria-describedby` and `aria-invalid` (D-1).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `autoGrow` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.textarea--auto-grow`: the height follows the text from the 100 px minimum up to 6 × `--control-height-md` (240 px), then the text scrolls; no resize handle (D-3, D-4, D-5). |
| `id` | `string \| undefined` | `undefined` | no | Host id. Inside a form field defaults to the field's `controlId()`; outside to `hp-textarea-{n}`. |
| `aria-describedby` | `string \| undefined` | `undefined` | no | Aliased input; consumer ids first, the field's `describedBy()` appended (text field D-8). |
| `aria-invalid` | `boolean \| undefined` | `undefined` | no | Aliased input for use outside a form field; inside one, the field's `invalid()` decides. |

- Inputs are signal inputs; booleans accept bare attributes.
- Native attributes pass through untouched: `name`, `rows`, `placeholder`, `required`, `readonly`, `spellcheck`, `autocapitalize`, `form`, `disabled` (prefer the forms API). Never `maxlength` (form field D-8).
- Forms: `formControlName`, `[formControl]` or `ngModel` on the same element; Angular's `DefaultValueAccessor` moves the value (form field D-2). Initial text comes from the form model, not from content between the tags (D-1).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| native `input`, `change` | DOM events | As the platform fires them; nothing is re-emitted. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | The template is empty; text placed between the tags is not rendered. Set the value through the forms directive. |

### Form field contract

Inside a form field the textarea follows the single-control rules in the form field CRD exactly as the text field does: takes `controlId()` unless `id` is set, merges `describedBy()`, sets `aria-invalid="true"` while `invalid()`, and registers `{ id, ngControl, focus }`.

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Default | `.textarea` | A fixed starting height the person can drag taller (vertical resize only). Kept for wide-screen tools; the customer screens use auto-grow (D-10). |
| Auto-grow | `.textarea--auto-grow` | Every customer textarea: "Your review", "Hair details", "Reason". |
| With counter | form field `maxLength` | Any textarea with a limit (500, 200, 300). |

One size: medium text (16 px) at every width. `rows` sets the default variant's starting height when it exceeds the 100 px minimum; the auto-grow variant ignores `rows` beyond the minimum. Width is always the container's.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | `--field-bg` fill, `--field-border` edge | Multi-line textbox named by the label |
| Hover | `:hover` | Border `--field-border-hover` | — |
| Focus | `:focus-visible` | Border and 2 px outline `--color-focus-ring`, no offset | — |
| Invalid | `aria-invalid="true"` | `--color-danger-solid` border plus 1 px inset shadow | Invalid; error is the first description |
| Over limit | counted length above the field's `maxLength` | Counter in danger at once; invalid edge when the error shows (form field D-8); every character kept | Counter in the description, announced after a pause |
| Read-only | `readonly` | `--color-bg-surface-sunken` fill, dashed border | Read-only; focusable; selectable |
| Disabled | `disabled` | `--color-bg-subtle` fill, `--color-fg-disabled` text, `--color-border-default` border | Disabled; skipped by Tab; value kept |
| Growing | `autoGrow`, text taller than 100 px | Height follows the text, up to 240 px | — |
| Capped | `autoGrow`, text taller than 240 px | Height stays 240 px; the text scrolls inside | Scrollable; caret kept in view |
| Forced colours | `(forced-colors: active)` | `CanvasText` border; `Highlight` ring | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Border changes instant; growth is always instant | — |

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: care and review, auto-grow, with hint and counter from the form field -->
<textarea class="textarea textarea--auto-grow" id="hp-field-2-control" name="review" required
          aria-describedby="hp-field-2-hint hp-field-2-counter"></textarea>
```

```html
<!-- rendered: invalid, empty review -->
<textarea class="textarea textarea--auto-grow" id="hp-field-2-control" name="review" required
          aria-invalid="true" aria-describedby="hp-field-2-error hp-field-2-hint hp-field-2-counter"></textarea>
```

```html
<!-- rendered: default variant, read-only, disabled -->
<textarea class="textarea" id="hair-notes" name="hair" rows="3"></textarea>
<textarea class="textarea" id="hp-textarea-3" readonly></textarea>
<textarea class="textarea" id="hp-textarea-4" disabled></textarea>
```

Consumer templates:

```html
<!-- consumer: care and review -->
<div hp-form-field label="Your review" hint="What should others know about your visit?"
     [maxLength]="500" [counterText]="counter"
     [errorMessages]="{ required: 'Write a few words about your visit with Nia.', maxlength: 'Shorten this to 500 characters or fewer.' }">
  <textarea hp-textarea autoGrow formControlName="review" required></textarea>
</div>

<!-- consumer: report a review dialog -->
<div hp-form-field label="Reason" [maxLength]="300" [counterText]="counter"
     [errorMessages]="{ required: 'Tell us what needs review.', maxlength: 'Shorten this to 300 characters or fewer.' }">
  <textarea hp-textarea autoGrow formControlName="reason" required></textarea>
</div>
```

Free to change: the generated id pattern and attribute order.

## Design

- Height: `min-height: calc(var(--control-height-md) * 2.5)` (100 px). Auto-grow: `field-sizing: content; max-height: calc(var(--control-height-md) * 6)` (240 px); measured, the cap holds about eight lines of 16 px text before scrolling (D-4).
- Padding: `--space-2` block, `--space-3` inline.
- Typography: `--text-body` with `--line-height-normal`, unlike the text field, because several lines are read together (D-8).
- Shape: `--radius-md`; border `--border-width-hairline`.
- Resize: `resize: vertical` for the default variant; `resize: none` for auto-grow (D-5).
- Motion: `border-color` and `box-shadow` transition over `--duration-fast` with `--ease-standard`; growth is immediate.
- Layer: none.

Component tokens: the shared field tokens declared on `.input, .select, .textarea`.

| Token | Aliases | Overridden by |
|---|---|---|
| `--field-bg` | `--color-bg-surface` | a surface re-skin |
| `--field-fg` | `--color-fg-default` | a surface re-skin |
| `--field-border` | `--color-border-strong` | a surface re-skin |
| `--field-border-hover` | `--color-fg-muted` | a surface re-skin |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Fill | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Text | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Border | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-450` |
| Border, hover | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Focus | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |
| Invalid edge | `--color-danger-solid` | `--palette-red-600` | `--palette-red-300` |
| Read-only fill | `--color-bg-surface-sunken` | `--palette-gray-100` | `--palette-gray-925` |
| Disabled fill and text | `--color-bg-subtle`, `--color-fg-disabled` | `--palette-gray-100`, `--palette-gray-400` | `--palette-gray-800`, `--palette-gray-600` |

Contrast pairs, from `tokens/contrast-pairs.json`, in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Text |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Edge on a card |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Edge in a dialog |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus on a card |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus in a dialog |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Invalid edge |
| `--color-fg-subtle` | `--color-bg-surface` | 4.5:1 | Placeholder |

Disabled text is exempt from contrast minimums. Forced colours: `CanvasText` border, `Highlight` focus ring; the invalid edge colour is lost and the error text carries it.

## Responsive behaviour

- Full width of the form column at every breakpoint; never paired in a `.form-row`.
- Customer textareas auto-grow, so phones never need the hard-to-drag resize handle.
- Text stays 16 px at every width, so iOS does not zoom on focus.
- At 320 px nothing scrolls horizontally; long words wrap inside the textarea natively. At 200 % text the minimum and cap scale with the root size (they are rem-based), so the textarea stays proportionate and operable.
- The target is far larger than 44 × 44 px; tapping the label also focuses it.

## Accessibility

### Role and pattern

Native `<textarea>`: a multi-line textbox named by the form field's `<label for>`, described by error, hint and counter.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves into and out of the textarea; Tab never inserts a tab character. |
| <kbd>Enter</kbd> | Inserts a new line; never submits the form. |
| Arrow keys, <kbd>Page Up</kbd> / <kbd>Page Down</kbd> | Move the caret; a capped auto-grow textarea scrolls to keep it visible. |

### Focus

The focus ring matches the text field. The error summary's link focuses the textarea and scrolls it into the middle of the viewport. Growing never moves focus.

### Labelling

- Visible label from the form field; the label asks the question ("Your review", "Reason").
- Guidance goes in the hint, never in a placeholder that vanishes on typing.
- `aria-invalid="true"` exactly while the field's error shows.

### Announcements

The textarea announces nothing itself; the form field's counter announcer speaks after a pause near the limit (form field D-10).

### Motion

Border colour transitions over `--duration-fast`, zeroed under reduced motion. Growth is instant in every mode.

## Content and internationalisation

- Labels: a question or noun phrase: "Your review", "Hair details", "Reason".
- Hints suggest what a useful answer covers: "What should others know about your visit?".
- Limits are stated in characters: "Shorten this to 200 characters or fewer.".
- Translatable content: the field's strings. Data values: whatever Maya types; it is plain text and is never interpreted as markup (L2-039).
- Whatever is typed is kept through errors, failures and offline states; the component never clears or truncates it.

## Performance

- Change detection: `OnPush`, signal inputs, host bindings from signals; empty template.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Textarea.ts` renders Maya's review, `<textarea hp-textarea autoGrow aria-label="Your review">` holding "Nia explained each step and the braids feel comfortable."; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: `FormField` (form field CRD) and `BookingForm` (form layout CRD).
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: auto-grow uses CSS `field-sizing`, with no script measuring heights; growth happens only as Maya types.
- Weight: `@angular/core` and `@angular/forms` (`NgControl` type). No CDK (`cdkTextareaAutosize` is not needed, D-3).
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `<textarea hp-textarea autoGrow formControlName="review">` in the "Your review" field, when it renders, then the DOM holds a native `<textarea class="textarea textarea--auto-grow">` with no wrapper, its `id` equals the label's `for`, its accessible name is "Your review" and it is 100 px tall. (L2-041)
- **AC-2** Given the care and review form bound to a draft review "Nia explained each step and the braids feel comfortable.", when it renders, then the textarea shows that text, and when Maya edits it, then the form model holds the new text on each input event. (L2-025)

### Variants

- **AC-3** Given the review textarea on a 360 px viewport, when Maya types until her text needs six lines, then the textarea grows to fit them without a scrollbar, and when the text needs more than 240 px, then the height stays 240 px and the text scrolls inside. (L2-042)
- **AC-4** Given an auto-grow textarea, when it renders, then it has no resize handle; given the default variant, then it can be resized vertically only. (L2-041)

### States

- **AC-5** Given an enabled textarea, when hovered, then its border is `--color-fg-muted`; when focused by keyboard, then the border and a 2 px outline are `--color-focus-ring` with at least 3:1 against the surface. (L2-041)
- **AC-6** Given Maya submits the care and review form with "Your review" empty, when the field shows "Write a few words about your visit with Nia.", then the textarea has `aria-invalid="true"` and a 2 px `--color-danger-solid` edge, and its height is unchanged. (L2-025)
- **AC-7** Given the report a review dialog submitted with "Reason" blank, when the error "Tell us what needs review." shows, then the textarea has `aria-invalid="true"`, the dialog stays open, and the textarea still holds whatever Maya had typed. (L2-009)
- **AC-8** Given the report a review dialog with "Inaccurate service details" whose send failed, when the failure alert shows and Maya retries, then the reason is still in the textarea. (L2-009)
- **AC-9** Given "Hair details" with a 200-character limit, when Maya types her 225-character note, then all 225 characters stay in the textarea and none are cut off. (L2-036)
- **AC-10** Given a read-only textarea holding "Comfortable and neat.", when Maya tabs to it, then it takes focus, shows the sunken dashed look and its text can be selected but not changed. (L2-041)
- **AC-11** Given a textarea disabled through the forms API, when it renders, then it has the native `disabled` attribute, the disabled fill and text, Tab skips it, and its text is kept. (L2-041)
- **AC-12** Given Maya types `<b>Great</b> <script>alert(1)</script>` into "Your review", when it renders, then the textarea shows exactly those characters as text and nothing executes. (L2-039)

### Keyboard and focus

- **AC-13** Given focus in "Your review", when Maya presses Enter, then a new line is inserted and the form is not submitted. (L2-041)
- **AC-14** Given focus in "Your review", when Maya presses Tab, then focus moves to the next control and no tab character is inserted. (L2-041)

### Screen readers

- **AC-15** Given "Your review" with hint and counter, when the textarea takes focus, then a screen reader announces a multi-line edit named "Your review", described by "What should others know about your visit?" and "56 of 500 characters". (L2-041)

### Theming

- **AC-16** Given the dark theme, when the textarea renders on a form panel and in the report dialog, then its fill resolves to `--palette-gray-900`, its border is at least 3:1 against `--color-bg-surface` and `--color-bg-surface-raised`, and its text is at least 4.5:1 against the fill. (L2-041)
- **AC-17** Given the review textarea, when the theme switches from light to dark, then its colours change without a reload and its text is kept. (L2-042)
- **AC-18** Given Windows forced colours, when the textarea renders, then it has a `CanvasText` border and a `Highlight` focus ring. (L2-041)

### Responsive

- **AC-19** Given a 320 px viewport, when the care and review form renders, then the textarea fills the column, long words wrap inside it, and the page does not scroll horizontally. (L2-042)
- **AC-20** Given text enlarged to 200 %, when the review textarea renders on a 360 px viewport, then its minimum height and cap scale with the text and it stays readable and operable. (L2-042)

### Motion

- **AC-21** Given `prefers-reduced-motion: reduce`, when the textarea is hovered or focused, then the border change is instant. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/textarea/`; file `textarea.ts` exporting the standalone component `Textarea` with `selector: 'textarea[hp-textarea]'`, `template: ''`, `changeDetection: OnPush`. Export it from `public-api.ts`.
- Host bindings: `class.textarea`; `class.textarea--auto-grow`; `attr.id`; `attr.aria-describedby`; `attr.aria-invalid` (`'true'` or `null`).
- Injections and registration exactly as the text field (`HP_FORM_FIELD` optional, `NgControl` self optional).
- Styles: port `.textarea`, `.textarea--auto-grow` (`field-sizing: content; max-height: calc(var(--control-height-md) * 6); resize: none`) and the shared `.input, .select, .textarea` rules from `docs/design-system/assets/components.css` as `:host(...)` rules.
- No CDK primitive.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Textarea.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Wrapper or native host?* A component on the native `<textarea>` with an empty template, as the text field (text field D-1). Content between the tags is not projected, because a textarea's text content is only its default value; the value always comes from the forms directive, which also keeps it through errors and retries.
- **D-2** *How does it work with Angular forms?* `DefaultValueAccessor` on the same element; no value accessor of its own (form field D-2).
- **D-3** *How is auto-grow built?* CSS `field-sizing: content` behind the `.textarea--auto-grow` modifier in `components.css`, with no script. A modifier class rather than an inline `style` (the design system's first draft) keeps the markup to classes the e2e locators can read. Browsers without `field-sizing` fall back to the 100 px minimum and a scrollbar; the product is tested in Chromium, which supports it.
- **D-4** *How tall may it grow?* To 6 × `--control-height-md` (240 px), the design system's value. Measured at 16 px text the cap holds about eight lines (an earlier design-system draft said "about ten"), so requirements state the token value, not a line count.
- **D-5** *Resize handle on auto-grow?* None (`resize: none`). A manual height would freeze the auto-grow, and the design system calls the handle hard to drag on phones.
- **D-6** *Sizes?* One. The design system defines no textarea sizes; `rows` sets the default variant's starting height above the 100 px minimum.
- **D-7** *Native `maxlength`?* Never (form field D-8). The design system's over-limit example ("231 / 200") requires the text to be kept.
- **D-8** *Line height?* `--line-height-normal`, the body value, unlike the single-line fields (text field D-4): several lines of a review are read as a paragraph.
- **D-9** *Textarea or one-line input for "Your review", "Hair details" and "Reason"?* The textarea, as the design system requires: a one-line input hides most of what was typed (the mocks' first version).
- **D-10** *Which customer textareas auto-grow?* All three. The design system recommends auto-grow for reviews and, on phones, over the resize handle; since a page does not switch variants by viewport, the customer screens use auto-grow everywhere and the default variant stays for wide-screen tools.

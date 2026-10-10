# Description list

| Field | Value |
|---|---|
| Selector | `dl[hp-description-list]` |
| Library path | `frontend/projects/components/src/lib/description-list/` |
| Status | planned |
| Traces to | L2-003, L2-007, L2-016, L2-019, L2-041, L2-042 |
| Design system | [`description-list.html`](../../design-system/components/description-list.html) |
| Source mocks | [`pages/appointment-detail/default`](../../mocks/pages/appointment-detail/default.html), [`pages/appointment-detail/success`](../../mocks/pages/appointment-detail/success.html), [`dialogs/request-review/default`](../../mocks/dialogs/request-review/default.html), [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html), [`pages/braider-profile/partial`](../../mocks/pages/braider-profile/partial.html), [`pages/style-detail/default`](../../mocks/pages/style-detail/default.html) |
| Rendering | [`description-list.html`](description-list.html) |

## Purpose and scope

A description list shows the facts of one record as label and value pairs, so Maya can scan her appointment's service, time, estimate and location instead of reading them out of sentences. It has two layouts: horizontal (labels in a narrow column beside the values from 640 px, stacked on phones) for detail cards and dialogs, and stacked (label above value at every width) for asides and narrow cards. Values can be present, pending (not known yet, said in words) or missing (could not load, with a retry nearby). The mocks render it on the appointment detail, in the review-request dialog and in the braider profile's "Before you book" aside (D-1).

Use something else when:

- the values are editable: use a form built from the form-field and text-field components;
- several records are compared field by field: use the table ([table.md](table.md));
- the facts are a few headline numbers to compare at a glance ("4–7 hours", "$160–$300"): use fact tiles (stat CRD);
- the content is a run of similar items: use the list ([list.md](list.md)).

Out of scope:

- The card or dialog around the list and the heading that names the record. The card ([card.md](card.md)) or dialog owns them.
- Which facts a record has, their wording and whether a fact is pending. The page decides from its data; a fact the record does not have is omitted, never invented (L2-003).
- The badge, link and inline status rendered inside values. Their CRDs own their markup.
- Retrying a missing value. The retry link calls the page.

## Usage

Every `.dl` in `docs/mocks/` (inventory: `usage_inventory.py docs/mocks dl`), plus the states the design system defines.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/appointment-detail/default`, `partial`, `offline` (pending request HP-1048) | horizontal, in the main `section` card under the heading "Medium knotless braids" | Status: badge "Awaiting reply"; Service: "Medium knotless braids"; Braider: link "Nia Okafor"; Preferred time: "Sat 24 Oct · 10:00 am · about 5 hours"; Estimate: "$180–$240"; Final price: "Nia confirms after accepting" (pending); Location: "Shared after Nia accepts" (pending) | present, pending | surface (card) |
| `pages/appointment-detail/success` (confirmed) | horizontal, same card | Status: badge "Confirmed"; Time: "Sat 24 Oct · 10:00 am"; Confirmed estimate: "$210"; Studio address: "1246 Bloor Street West, Toronto" | present | surface |
| `dialogs/request-review/default`, `busy`, `invalid`, `failed` | horizontal in the dialog body | Service: "Medium knotless braids"; Braider: "Nia Okafor"; Preferred time: "Sat 24 Oct · 10:00 am · not confirmed until Nia accepts"; Estimate: "$180–$240 · about 5 hours · Nia confirms the final price"; Location: "Toronto West · address shared after Nia accepts"; Your email: "maya.chen@example.com"; Hair details: "Shoulder length; bringing my own extensions" | present, pending | raised (dialog panel) |
| `pages/braider-profile/*` aside "Before you book" | stacked | Service area: "Toronto West"; Address: "Shared after confirmation" (pending); Typical duration: "5 hours"; Knotless braids: "From $180" | present, pending | surface (aside card) |
| `pages/braider-profile/partial` | stacked, a "Reviews" pair whose value is missing | Reviews: inline danger status "Couldn’t load" · link "Retry reviews" | missing | surface |
| `pages/style-detail/*` when an optional fact is unavailable | horizontal or stacked | the pair is left out entirely (no blank value, no lone dash) | omitted | surface |
| Design system *States* | both layouts | Estimate "$180–$240"; Final price "Nia confirms after accepting"; Reviews "Couldn’t load · Retry reviews" | present, pending, missing | surface |

Every row is buildable with the API below: one `<dl>` host with `layout`, and `<dt>`/`<dd>` pairs projected as its direct children.

## Anatomy

1. **List** — `.dl` on the `<dl>` host: a CSS grid, one column below 640 px, two columns (`max-content` terms, `minmax(0, 1fr)` values) from `--layout-breakpoint-sm`. `.dl--stacked` keeps one column at every width. Margin 0.
2. **Term** — projected `<dt>`: `--text-label` in `--color-fg-muted`; in the horizontal layout its column is as wide as the longest term.
3. **Value** — projected `<dd>`: inherits body type (`--text-body`) in `--color-fg-default`; margin 0 except the stacked spacing below. It may hold text, a badge, a link or an inline status.
4. **Pending value** — a `<dd class="text-muted">` that says in words why the value is not known yet.
5. **Missing value** — a `<dd>` holding an inline status in the danger tone ("Couldn’t load") and, when a retry exists, a link that names it ("Retry reviews").

Host: `hp-description-list` is an attribute component, so the host **is** the native `<dl>` and carries the classes (D-2). Its template is a single `<ng-content />`; the consumer's `<dt>` and `<dd>` elements are its direct children.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `layout` | `'horizontal' \| 'stacked'` | `'horizontal'` | no | `horizontal` adds `.dl` only (stacked below 640 px, two columns from 640 px); `stacked` adds `.dl .dl--stacked` (term above value at every width). Asides and cards narrower than a detail grid's main column use `stacked` (D-3). |

- `aria-label`, `aria-labelledby` and `id` are native attributes; a list inside a named card needs none (the card's heading names the record).
- The input is a signal input. Every user-facing string is projected; the component renders no copy.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The list is static. Links inside values raise their own events. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | `<dt>` and `<dd>` elements only, as direct children, in term–value order; one or more `<dd>` per `<dt>` | Declared once. No `<div>` groups (they break the two-column grid, D-4). Every `<dd>` holds content: a value, a pending sentence or a missing status, never nothing and never a lone dash (D-5). In development mode a child that is not `<dt>`/`<dd>`, or an empty `<dd>`, is reported as a console error. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Horizontal | `.dl` | The facts of a record in a detail card or dialog: appointment detail, request review. |
| Stacked | `.dl--stacked` | Asides and narrow cards: "Before you book". |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One size | — | from content | none; rows `--space-2` apart, columns `--space-6` apart (horizontal from 640 px); below 640 px `--space-1` between term and value and `--space-2` after each value; stacked `--space-3` after each value | terms `--text-label`, values `--text-body` |

Width comes from the container. Keep terms to three words so the term column stays narrow.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Present | a value | Term muted, value default colour | "term, value" pairs in a description list |
| Pending | `<dd class="text-muted">` with a sentence | Value in `--color-fg-muted`: "Nia confirms after accepting", "Shared after Nia accepts" | The sentence is read |
| Missing | `<dd>` with a danger inline status and an optional retry link | "Couldn’t load" in `--color-danger-fg`, then "Retry reviews" | Status text and the link are read; the link is a tab stop |
| Omitted | the page leaves the pair out | No row | Nothing read |
| Value with badge | `<dd>` holds a badge | Badge aligned to the start of the value column | Badge text read ("Awaiting reply") |
| Value with link | `<dd>` holds a link | Link style; the shared focus ring | Link role and name |
| Narrow (below 640 px) | viewport below `--layout-breakpoint-sm` | Horizontal list stacks: term above value | Unchanged |
| Dark theme | `data-theme="dark"` | Terms grey 350, values grey 150 | — |
| Forced colours | `(forced-colors: active)` | System text colour for terms and values | — |

The list is static: no hover, focus, selected or disabled state of its own, and nothing animates.

## Markup

Rendered DOM. The `.dl` classes and the `dt`/`dd` structure are the e2e contract.

```html
<!-- rendered: pending request HP-1048 in the appointment detail card -->
<dl class="dl">
  <dt>Status</dt><dd><span class="badge badge--warning">Awaiting reply</span></dd>
  <dt>Service</dt><dd>Medium knotless braids</dd>
  <dt>Braider</dt><dd><a href="/braiders/nia-okafor">Nia Okafor</a></dd>
  <dt>Preferred time</dt><dd>Sat 24 Oct · 10:00 am · about 5 hours</dd>
  <dt>Estimate</dt><dd>$180–$240</dd>
  <dt>Final price</dt><dd class="text-muted">Nia confirms after accepting</dd>
  <dt>Location</dt><dd class="text-muted">Shared after Nia accepts</dd>
</dl>
```

```html
<!-- rendered: confirmed appointment -->
<dl class="dl">
  <dt>Status</dt><dd><span class="badge badge--success">Confirmed</span></dd>
  <dt>Time</dt><dd>Sat 24 Oct · 10:00 am</dd>
  <dt>Confirmed estimate</dt><dd>$210</dd>
  <dt>Studio address</dt><dd>1246 Bloor Street West, Toronto</dd>
</dl>
```

```html
<!-- rendered: stacked aside with a pending and a missing value -->
<dl class="dl dl--stacked">
  <dt>Service area</dt><dd>Toronto West</dd>
  <dt>Address</dt><dd class="text-muted">Shared after confirmation</dd>
  <dt>Reviews</dt><dd><span class="inline-status inline-status--danger">Couldn’t load</span> · <a href="/braiders/nia-okafor#reviews">Retry reviews</a></dd>
</dl>
```

Consumer templates:

```html
<!-- consumer: appointment detail -->
<section hp-card class="stack" aria-labelledby="appointment-title">
  <h2 id="appointment-title">{{ appt.service }}</h2>
  <dl hp-description-list>
    <dt>Status</dt><dd><span hp-badge [tone]="appt.statusTone">{{ appt.status }}</span></dd>
    <dt>Preferred time</dt><dd>{{ appt.when }} · about {{ appt.duration }}</dd>
    <dt>Estimate</dt><dd>{{ appt.estimate }}</dd>
    @if (appt.location) {
      <dt>Studio address</dt><dd>{{ appt.location }}</dd>
    } @else {
      <dt>Location</dt><dd class="text-muted">Shared after {{ appt.braiderFirstName }} accepts</dd>
    }
  </dl>
</section>

<!-- consumer: stacked aside, optional facts omitted -->
<dl hp-description-list layout="stacked">
  @for (fact of facts(); track fact.term) {
    <dt>{{ fact.term }}</dt><dd>{{ fact.value }}</dd>
  }
</dl>
```

Free to change: nothing in the structure; the order of classes only.

## Design

- Grid: `display: grid; grid-template-columns: minmax(0, 1fr)`; gap `--space-1` (rows) `--space-6` (columns); margin 0.
- From `--layout-breakpoint-sm` (a `min-width: 40rem` query; media queries cannot read custom properties, so the value is written in rem and follows the reader's text size): `grid-template-columns: max-content minmax(0, 1fr)`, gap `--space-2` `--space-6`; `dd` margin 0.
- Below the breakpoint: `dd` margin `0 0 var(--space-2)`.
- Stacked: one column at every width; `dd` margin `0 0 var(--space-3)`.
- Terms: `--text-label`, `--color-fg-muted`. Values: `--text-body`, `--color-fg-default`; long values wrap inside their column (`minmax(0, 1fr)` lets them shrink and wrap).
- No elevation, layer, motion or component tokens. A surface that needs different colours overrides `--color-fg-muted` and `--color-fg-default` on its own selector.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Term | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Value | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Pending value | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Missing status | `--color-danger-fg` | `--palette-red-700` | `--palette-red-300` |
| Link in a value | `--color-fg-link` | `--palette-plum-700` | `--palette-plum-300` |
| Card surface | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Dialog surface | `--color-bg-surface-raised` | `--palette-white` | `--palette-gray-800` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Term and pending value on a card |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Value on a card |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Term in a dialog |
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Value in a dialog |
| `--color-fg-link` | `--color-bg-surface` | 4.5:1 | Link in a value |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Missing status |

Under `prefers-contrast: more` the tokens raise `--color-fg-muted` to `--color-fg-default`. Forced colours: terms and values take the system text colour; nothing depends on colour alone.

## Responsive behaviour

- Horizontal: below 640 px each term sits above its value with `--space-2` after the value; from 640 px the term column is as wide as the longest term and the value takes the rest. Measured: stacked at 320 and 360 px; at 640 px the term column is 97 px ("Preferred time") and the value column 437 px; at 768 px in a detail grid's main card the value column is 261 px.
- Stacked: one column at every width; used in the 256 px detail-grid aside, where a horizontal list leaves a value column of 73 px beside a 109 px term column (measured at 768 px).
- Long values ("Estimate: $180–$240 · about 5 hours · Nia confirms the final price", "1246 Bloor Street West, Toronto") wrap inside the value column; nothing truncates.
- At 200 % text size the breakpoint follows the text (it is in rem): at 768 px the list is stacked, and at 1280 px it has two columns with a 194 px term column (measured), with no horizontal scroll.

## Accessibility

### Role and pattern

Native `<dl>`, `<dt>` and `<dd>`: screen readers announce a description list (or list) with its terms and values in pairs. No ARIA role is added. Pairs are not faked with paragraphs and bold text, and are not wrapped in `<div>` groups (D-4).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Reaches only links or buttons inside values ("Nia Okafor", "Retry reviews"); the list is not focusable. |

### Focus

Not focusable. Links inside values use the shared ring and keep a 24 px target.

### Labelling

- The heading of the card or dialog names the record ("Medium knotless braids", "Review request"); the list needs no name of its own.
- Terms are the labels; a value never repeats its term ("$180–$240", not "Estimate: $180–$240").
- A missing value says what failed in text ("Couldn’t load") and names its retry ("Retry reviews"); colour is never the only signal.

### Announcements

None. A value that loads later (a retried reviews count) is announced by the page's status region if at all.

### Motion

None.

## Content and internationalisation

- Terms are short nouns in sentence case, no colon, three words at most: "Preferred time", "Estimate", "Studio address".
- Values use the product formats: "Sat 24 Oct · 10:00 am", "$180–$240", "about 5 hours", "From $180". A displayed amount says what kind it is through its term: "Estimate", "Confirmed estimate", "Final price" (L2 preamble).
- Say why a value is not known yet ("Shared after Nia accepts", "Nia confirms after accepting") instead of leaving it blank; never a lone dash.
- A fact the record does not have is omitted entirely (term and value).
- Translatable content: every term and every pending or missing sentence, all projected. Data values: names, dates, prices, addresses. The component renders no text.
- Length: terms over three words widen the term column; values wrap.

## Performance

- Change detection: `OnPush`, one signal input, host class bindings; the template is a single `<ng-content />`.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/DescriptionList.ts` renders the facts of Maya's pending request HP-1048 (Status "Awaiting reply", Service "Medium knotless braids", Braider "Nia Okafor", Preferred time "Sat 24 Oct · 10:00 am · about 5 hours", Estimate "$180–$240", Final price and Location pending); iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Regression rule: a change to the template, input, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: the term column is sized by its text, not by data that arrives later; a pending value occupies the same row as the value that replaces it.
- Weight: `@angular/core` only.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given Maya's pending request HP-1048, when its detail card renders the facts with `<dl hp-description-list>`, then the DOM holds `<dl class="dl">` whose direct children are only `<dt>` and `<dd>` elements, with the pairs Status "Awaiting reply", Service "Medium knotless braids", Braider "Nia Okafor", Preferred time "Sat 24 Oct · 10:00 am · about 5 hours" and Estimate "$180–$240". (L2-019)
- **AC-2** Given the same pending request, when the facts render, then Final price reads "Nia confirms after accepting" and Location reads "Shared after Nia accepts", both in `--color-fg-muted`, and no studio address appears anywhere in the list. (L2-019)
- **AC-3** Given HP-1048 after Nia accepts, when the facts render, then Status shows the badge "Confirmed", Confirmed estimate reads "$210" and Studio address reads "1246 Bloor Street West, Toronto". (L2-019)
- **AC-4** Given the review request dialog for HP-1048's booking, when its summary renders, then the Preferred time value says it is not confirmed until Nia accepts and the Estimate value says Nia confirms the final price. (L2-016)
- **AC-5** Given a style whose typical wear is unavailable, when its facts render, then the list has no "Typical wear" term, no empty `<dd>` and no lone dash, and the remaining pairs keep their order. (L2-003)
- **AC-6** Given a `<dl hp-description-list>` containing an empty `<dd>` or a `<div>` child in development mode, when it initialises, then the console reports an error naming `hp-description-list` and the offending child. (L2-003)
- **AC-7** Given Nia's profile when her reviews fail to load, when the "Before you book" aside renders, then the Reviews value shows "Couldn’t load" in the danger tone followed by a "Retry reviews" link, and activating the link retries the reviews. (L2-007)

### Layout

- **AC-8** Given the horizontal list at 1280 px, when it renders, then each term sits in a first column as wide as "Preferred time", each value starts on the same line as its term, rows are 8 px apart and the columns 24 px apart. (L2-042)
- **AC-9** Given the horizontal list at 360 px, when it renders, then each term sits above its value with 8 px below the value, and the page does not scroll horizontally. (L2-042)
- **AC-10** Given `<dl hp-description-list layout="stacked">` in the "Before you book" aside at 1280 px, when it renders, then the class list is `dl dl--stacked` and each term sits above its value. (L2-042)
- **AC-11** Given the review request dialog at 320 px, when the Estimate value "$180–$240 · about 5 hours · Nia confirms the final price" renders, then it wraps inside the dialog and nothing is clipped or scrolled sideways. (L2-042)
- **AC-12** Given the browser's text size at 200 % and a 768 px viewport, when the appointment facts render, then the list is stacked and every term and value is fully readable. (L2-042)

### Keyboard and screen readers

- **AC-13** Given the appointment facts, when a screen reader reads them, then it announces a description list and reads each term with its value ("Estimate, $180–$240"), and the badge in the Status value is read as text. (L2-041)
- **AC-14** Given the appointment facts, when Maya tabs through the card, then focus reaches the "Nia Okafor" link in the Braider value and never stops on the list, a term or a value. (L2-041)

### Theming

- **AC-15** Given the appointment facts, when the theme switches from light to dark, then terms change to grey 350 and values to grey 150 without a reload, and both keep at least 4.5:1 against `--color-bg-surface`. (L2-042)
- **AC-16** Given the review request summary in a dialog, when it renders in either theme, then terms keep at least 4.5:1 against `--color-bg-surface-raised`. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/description-list/`; file `description-list.ts` exporting the standalone component `DescriptionList` with `selector: 'dl[hp-description-list]'`, `template: '<ng-content />'`, `changeDetection: OnPush`. Export it from `public-api.ts`.
- Host bindings: `class.dl` always; `class.dl--stacked` when `layout` is `'stacked'`.
- Styles: `:host` for the grid and its media query; projected `dt` and `dd` rules rooted at the host (`:host ::ng-deep > dt`, `:host ::ng-deep > dd`).
- Development check (`isDevMode()`), once after the first render: every child element is `DT` or `DD`, and every `DD` has non-whitespace text or an element child and is not only a dash (D-5); otherwise `console.error` naming `hp-description-list`.
- No CDK primitive. Composes nothing; badges, links and inline statuses are projected.
- Perf-test scenario `DescriptionList.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Are an appointment's facts written as sentences, and the review dialog as a text field, as the first mocks did?* No: the product renders a description list. Facts written as prose are hard to scan for time, price and place (the design system's do and don't), and the design system names the appointment detail, its confirmed state and the review dialog as the places for it; the braider profile's "Before you book" aside uses the stacked layout. The facts and their copy come from the mocks ("Shared after Nia accepts", "$180–$240", "1246 Bloor Street West, Toronto").
- **D-2** *Is the host the native `<dl>` or a wrapper?* The native `<dl>`, through an attribute selector, because the grid and the screen-reader pairing need `<dt>` and `<dd>` as the `<dl>`'s direct children.
- **D-3** *When is the stacked layout used?* In asides and any container narrower than a detail grid's main column. Measured at 768 px: the aside is 256 px wide, and a horizontal list in it gave "Typical duration" a 109 px column and the values 73 px.
- **D-4** *May pairs be wrapped in `<div>` groups, which HTML allows?* No. A group `<div>` becomes one grid item and breaks the two-column layout, as the design system warns; Angular's `@for` and `@if` blocks add no elements, so consumers never need a wrapper.
- **D-5** *How is the "never blank, never a lone dash" rule enforced?* A development-mode console error for an empty `<dd>` or one holding only a dash, besides the content rule. L2-003 requires an unavailable fact to be omitted without inventing a value, and a blank value reads as a missing fact.
- **D-6** *Which breakpoint does the horizontal layout use?* `--layout-breakpoint-sm` (640 px, written as `40rem` in the query), as the design system defines. It differs from L2-042's 576 px small range on purpose: L2-042 requires usability in each range, which the stacked layout provides below 640 px.

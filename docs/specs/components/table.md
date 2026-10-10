# Table

| Field | Value |
|---|---|
| Selector | `hp-table`, `th[hp-table-sort]` |
| Library path | `frontend/projects/components/src/lib/table/` |
| Status | planned |
| Traces to | L2-018, L2-035, L2-041, L2-042 |
| Design system | [`table.html`](../../design-system/components/table.html) |
| Source mocks | [`pages/my-appointments/default`](../../mocks/pages/my-appointments/default.html), [`pages/my-appointments/long`](../../mocks/pages/my-appointments/long.html), [`pages/my-appointments/loading`](../../mocks/pages/my-appointments/loading.html), [`pages/my-appointments/empty`](../../mocks/pages/my-appointments/empty.html), [`pages/my-appointments/error`](../../mocks/pages/my-appointments/error.html) |
| Rendering | [`table.html`](table.html) |

## Purpose and scope

A table lets a customer compare many records across the same columns: her appointment history by date, status and estimate, her past visits by braider, style and amount. It is the dense alternative to row cards for people who manage several appointments. The component renders a native `<table>` inside a bordered, horizontally scrolling wrapper, in a default or dense density, with sortable column headers, selected rows, row actions revealed on hover and focus, numeric columns, and loading, empty and error bodies. It is a core-set component: no mock renders a table yet; My appointments uses row cards today and the table is specified for its history and long views (D-1).

Use something else when:

- there are only a few records or each needs a sentence of context: use row cards ([card.md](card.md)), as My appointments does today;
- the items are updates read top to bottom: use the list ([list.md](list.md));
- the content is the fields of one record: use the description list ([description-list.md](description-list.md));
- the layout is not tabular data: never use a table for layout.

Out of scope:

- Sorting, filtering and paging the data. The table reports the requested sort; the page sorts (or asks the API) and renders rows; pagination is its own component below the table.
- Announcing a new sort or a new row count. The page's status region says "Sorted by date, newest first" or "126 appointments" (D-6).
- The checkbox, badge, button, skeleton and empty state rendered in cells. Their CRDs own their markup; the table places them.
- The bulk action bar ("1 selected", "Download receipts"). It is page markup with the cluster utility above the table.
- Switching to row cards on phones. A page with four or fewer columns may render row cards below 768 px instead; that is the page's choice.

## Usage

There is no `.table` in `docs/mocks/` (inventory: `usage_inventory.py docs/mocks table` finds none). The rows below are the configurations the design system and the tables-and-lists pattern define, placed on the screens whose data they hold.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| My appointments history (pattern *Row list and table*; `pages/my-appointments/long` shows "Showing 1–3 of 126" as row cards) | `hp-table`, default density, caption "Your appointments", row header Request, sortable Date (descending), Status badge, numeric Estimate, Actions column | HP-1048 · Medium knotless braids · Nia Okafor · Sat 24 Oct · 10:00 am · "Awaiting reply" · $180–$240 · "View HP-1048"; HP-0992 · Medium knotless braids · Nia Okafor · Sat 3 Oct · 9:30 am · "Completed" · $210 · "Review HP-0992" | default, row hover, focus within, sorted | canvas |
| Past appointments (pattern example) | `hp-table`, caption "Past appointments", sortable Date, numeric Paid | Sat 3 Oct · Nia Okafor · Medium knotless braids · $210; Sat 15 Aug · Nia Okafor · Passion twists · $185 | default, hover, sorted | canvas |
| Long history (design system *Selectable and dense*) | `hp-table dense`, visually hidden caption "Past appointments", checkbox column with "Select all appointments", bulk bar above | HP-0992 · Nia Okafor · $210 (selected); HP-0911 · Aisha Mensah · $195; HP-0874 · Jules Baptiste · $170 | selected, dense | canvas |
| `pages/my-appointments/loading` (as a table) | `hp-table loading`, caption "Loading appointments", two skeleton rows | skeleton text in each cell | loading | canvas |
| `pages/my-appointments/empty` (as a table) | `hp-table`, one row spanning all columns holding a compact empty state | "No appointments yet" / "When you request a visit, you’ll find its status and details here." / "Explore styles" (empty-state CRD; the mock's "Nothing here yet" is drift) | empty | canvas |
| `pages/my-appointments/error` (as a table) | `hp-table`, one row spanning all columns holding a compact error state | "We couldn’t load your appointments" / "Check your connection and try again. Your details are safe." / "Try again" (empty-state CRD wording) | error | canvas |
| Design system *Sizes* | default and dense | "Medium" / "Small" with "$180–$240" | default | canvas |

Every row is buildable with the API below: `hp-table` with `dense`, `loading` and a two-way `sort`; `th[hp-table-sort]` for sortable headers; everything else is native table markup and the part classes in *Anatomy*.

## Anatomy

1. **Wrapper** — `.table-wrap`, rendered by the component: `--color-bg-surface`, `--border-width-hairline` border in `--color-border-default`, `--radius-lg`, `overflow-x: auto`. While its content is wider than itself it is a named, focusable scroll region (D-4).
2. **Table** — `table.table`, rendered by the component: full width, collapsed borders, `--text-body-sm`. `.table--dense` for compact padding.
3. **Caption** — the projected `<caption>`: names the table, `--text-label` in `--color-fg-default`, left aligned, padding `--space-3` × `--space-4`. May be `.visually-hidden` when a heading above already names it, but is always present.
4. **Header row** — projected `<thead>` with `<th scope="col">`: `--text-label` in `--color-fg-muted` on `--color-bg-surface-sunken`, no wrapping. An empty header over actions holds visually hidden text ("Actions").
5. **Sortable header** — `th[hp-table-sort]`: wraps its label in a `<button type="button">` that looks like the header text; the sorted column carries `aria-sort` and a decorative arrow (↑ or ↓) after the label.
6. **Row header** — `<th scope="row">` for the identifying cell (the request reference): `--text-label` in `--color-fg-default` on the row's own background (D-3).
7. **Cell** — `<td>`: padding `--space-3` × `--space-4` (dense `--space-2` × `--space-3`), vertically centred, hairline rule in `--color-border-default` below each row but the last.
8. **Numeric cell** — `.num` on `<th>` or `<td>`: right aligned, tabular figures.
9. **Row actions** — `.row-actions` inside the last cell: small ghost buttons that name their record, hidden until the row is hovered or has focus inside, always visible on touch.
10. **Selection** — a checkbox column (checkbox CRD) and `aria-selected="true"` on the selected `<tr>`, which takes the `--color-accent-subtle` tint.

Host: `hp-table` is an element (a composite): it renders the wrapper and the `<table>` and projects the consumer's `<caption>`, `<colgroup>`, `<thead>`, `<tbody>` and `<tfoot>` into the table (D-2). `th[hp-table-sort]` is an attribute component on the native header cell; its template is `<button type="button"><ng-content /></button>`.

## API

### `hp-table` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `dense` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.table--dense`: `--space-2` × `--space-3` cell padding. |
| `loading` | `boolean` (`booleanAttribute`) | `false` | no | Sets `aria-busy="true"` on the wrapper. The consumer renders skeleton rows and a caption that says what is loading. |
| `sort` | `TableSortState \| null` (two-way `model`), where `TableSortState = { column: string; direction: 'ascending' \| 'descending' }` | `null` | no | The sorted column and direction. `th[hp-table-sort]` headers read it to set `aria-sort` and write it when activated. The table never reorders rows. |

### `th[hp-table-sort]` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `hp-table-sort` | `string` | — | yes | The column key, for example `hp-table-sort="date"`. Matched against `sort.column`. |
| `firstDirection` | `'ascending' \| 'descending'` | `'ascending'` | no | The direction applied when an unsorted column is activated. Dates use `'descending'` (newest first). |

- `scope="col"`, `class="num"` and `id` are native attributes on the `<th>`.
- When this column is sorted the host gets `aria-sort="ascending"` or `"descending"`; otherwise no `aria-sort` attribute (D-5).
- Activating the button sets `sort` to `{ column, direction: firstDirection }` when the column is not sorted, or flips the direction when it is.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `sortChange` (on `hp-table`) | `TableSortState` | A sortable header is activated. Part of the `sort` model. The page sorts or refetches and announces the result (D-6). |
| native events | — | Checkboxes, links and buttons in cells raise their own events; the table adds none. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `hp-table` default | `<caption>` (required, first), optional `<colgroup>`, `<thead>`, `<tbody>`, optional `<tfoot>` | Declared once, inside the rendered `<table>`. In development mode a table without a `<caption>` is reported as a console error (D-7). Loading, empty and error bodies are ordinary `<tbody>` rows. |
| `th[hp-table-sort]` default | The column label text | Declared once inside the button. The label is the button's accessible name. |

## Variants and sizes

| Variant | Modifier or markup | Use for |
|---|---|---|
| Default | `.table` | Appointment history, a few columns of comparable facts. |
| Dense | `.table--dense` | Long histories where more rows per screen help. |
| Sortable | `th[hp-table-sort]` with `aria-sort` on the sorted column | Columns people order by: date, amount. |
| Selectable | checkbox column + `tr[aria-selected="true"]` | Acting on several records at once (bulk actions above the table). |
| With row actions | `.row-actions` in the last cell | One or two actions per record, named with the record ("View HP-1048"). |
| Numeric column | `.num` | Money and counts: "$180–$240", "$210". |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| Medium (default) | — | from content | `--space-3` vertical, `--space-4` horizontal | cells `--text-body-sm`, headers `--text-label` |
| Small (dense) | `.table--dense` | from content | `--space-2` vertical, `--space-3` horizontal | same |

The table is always its container's width; extra columns scroll inside the wrapper.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Surface body, sunken header row, hairline rules between rows | Table named by its caption; headers associated by `scope` |
| Row hover | `tr:hover` | Row fill `--color-bg-subtle`, including the row header (D-3); row actions fade in | — |
| Row focus within | `tr:focus-within` | Row actions visible; the focused control shows the shared ring | — |
| Row selected | `tr[aria-selected="true"]` | Row fill `--color-accent-subtle`, including the row header (D-3) | The row's checkbox is checked and named "Select HP-0992" |
| Sorted | `th[aria-sort="ascending" \| "descending"]` | Arrow ↑ or ↓ after the label (decorative, hidden from assistive technology) | `aria-sort` on the header cell |
| Sortable, unsorted | `th[hp-table-sort]` without `aria-sort` | Header text with a pointer cursor; no arrow | Button named by the label |
| Sort header focus | `button:focus-visible` | The shared ring around the label | — |
| Loading | `loading` → wrapper `aria-busy="true"` | Header kept; skeleton rows (skeleton CRD) with `aria-hidden` skeletons | Busy region; caption says what is loading |
| Empty | consumer renders one row, `td colspan` = column count, compact empty state | Header kept; the empty state centred in the body | Empty-state heading and action read |
| Error | as empty, with the error state and "Try again" | As empty | As empty |
| Overflowing | content wider than the wrapper | Horizontal scroll inside the wrapper; the page never scrolls sideways | Wrapper is a region named by the caption and is focusable, so arrow keys scroll it (D-4) |
| Touch | `(hover: none)` | Row actions always visible | — |
| Forced colours | `(forced-colors: active)` | Borders `CanvasText`; a selected row shows a `Highlight` outline inside the row (D-8) | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Row actions appear instantly; skeletons pause | — |
| Dark theme | `data-theme="dark"` | Grey 925 header on a grey 900 body | — |

The header row is sticky only within the wrapper's own scroll area; the wrapper does not scroll vertically, so on the page the header scrolls away with the table and long histories are paginated (D-9).

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: appointment history, sorted by date, with row actions -->
<hp-table>
  <div class="table-wrap" role="region" aria-labelledby="appointments-caption" tabindex="0">
    <table class="table">
      <caption id="appointments-caption">Your appointments</caption>
      <thead>
        <tr>
          <th scope="col">Request</th>
          <th scope="col">Service</th>
          <th scope="col">Braider</th>
          <th scope="col" aria-sort="descending"><button type="button">Date</button></th>
          <th scope="col">Status</th>
          <th scope="col" class="num">Estimate</th>
          <th scope="col"><span class="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">HP-1048</th>
          <td>Medium knotless braids</td>
          <td>Nia Okafor</td>
          <td>Sat 24 Oct · 10:00 am</td>
          <td><span class="badge badge--warning">Awaiting reply</span></td>
          <td class="num">$180–$240</td>
          <td><div class="row-actions"><a class="btn btn--ghost btn--sm" href="/appointments/hp-1048">View HP-1048</a></div></td>
        </tr>
        <tr>
          <th scope="row">HP-0992</th>
          <td>Medium knotless braids</td>
          <td>Nia Okafor</td>
          <td>Sat 3 Oct · 9:30 am</td>
          <td><span class="badge">Completed</span></td>
          <td class="num">$210</td>
          <td><div class="row-actions"><a class="btn btn--ghost btn--sm" href="/appointments/hp-0992/care">Review HP-0992</a></div></td>
        </tr>
      </tbody>
    </table>
  </div>
</hp-table>
```

The wrapper's `role`, `aria-labelledby` and `tabindex` are present only while the table overflows (D-4); at 1280 px the wrapper above renders as `<div class="table-wrap">`.

```html
<!-- rendered: dense, selectable -->
<div class="table-wrap">
  <table class="table table--dense">
    <caption id="past-caption" class="visually-hidden">Past appointments</caption>
    <thead><tr>
      <th scope="col"><label class="choice"><input type="checkbox"><span class="visually-hidden">Select all appointments</span></label></th>
      <th scope="col">Request</th><th scope="col">Braider</th><th scope="col" class="num">Paid</th>
    </tr></thead>
    <tbody>
      <tr aria-selected="true"><td><label class="choice"><input type="checkbox" checked><span class="visually-hidden">Select HP-0992</span></label></td><th scope="row">HP-0992</th><td>Nia Okafor</td><td class="num">$210</td></tr>
      <tr><td><label class="choice"><input type="checkbox"><span class="visually-hidden">Select HP-0911</span></label></td><th scope="row">HP-0911</th><td>Aisha Mensah</td><td class="num">$195</td></tr>
    </tbody>
  </table>
</div>
```

```html
<!-- rendered: loading, empty, error bodies -->
<div class="table-wrap" aria-busy="true">
  <table class="table">
    <caption>Loading appointments</caption>
    <thead><tr><th scope="col">Request</th><th scope="col">Braider</th><th scope="col" class="num">Estimate</th></tr></thead>
    <tbody><tr><td><span class="skeleton skeleton--text" aria-hidden="true"></span></td><td><span class="skeleton skeleton--text" aria-hidden="true"></span></td><td><span class="skeleton skeleton--text" aria-hidden="true"></span></td></tr></tbody>
  </table>
</div>
<!-- empty: one row -->
<tr><td colspan="3"><hp-empty-state class="empty empty--compact"><h3 class="empty__title">No appointments yet</h3><p class="empty__text">When you request a visit, you’ll find its status and details here.</p><div class="empty__actions"><a class="btn btn--primary" href="/styles">Explore styles</a></div></hp-empty-state></td></tr>
<!-- error: one row -->
<tr><td colspan="3"><hp-empty-state class="empty empty--compact empty--error"><h3 class="empty__title">We couldn’t load your appointments</h3><p class="empty__text">Check your connection and try again. Your details are safe.</p><div class="empty__actions"><button class="btn btn--primary" type="button">Try again</button></div></hp-empty-state></td></tr>
```

Consumer templates:

```html
<!-- consumer: appointment history -->
<hp-table [(sort)]="sort" [loading]="loading()">
  <caption>{{ loading() ? 'Loading appointments' : 'Your appointments' }}</caption>
  <thead>
    <tr>
      <th scope="col">Request</th>
      <th scope="col">Service</th>
      <th scope="col">Braider</th>
      <th scope="col" hp-table-sort="date" firstDirection="descending">Date</th>
      <th scope="col">Status</th>
      <th scope="col" class="num" hp-table-sort="estimate">Estimate</th>
      <th scope="col"><span class="visually-hidden">Actions</span></th>
    </tr>
  </thead>
  <tbody>
    @for (a of appointments(); track a.reference) {
      <tr>
        <th scope="row">{{ a.reference }}</th>
        <td>{{ a.service }}</td>
        <td>{{ a.braider }}</td>
        <td>{{ a.when }}</td>
        <td><span hp-badge [tone]="a.statusTone">{{ a.status }}</span></td>
        <td class="num">{{ a.amount }}</td>
        <td><div class="row-actions"><a hp-button variant="ghost" size="sm" [routerLink]="a.link">View {{ a.reference }}</a></div></td>
      </tr>
    } @empty {
      <tr><td colspan="7"><hp-empty-state size="compact" [headingLevel]="3" heading="No appointments yet" text="When you request a visit, you’ll find its status and details here.">…</hp-empty-state></td></tr>
    }
  </tbody>
</hp-table>

<!-- consumer: dense, selectable -->
<hp-table dense>
  <caption class="visually-hidden">Past appointments</caption>
  …
  <tr [attr.aria-selected]="isSelected(a) ? 'true' : null">…</tr>
</hp-table>
```

Free to change: the order of classes, the arrow's implementation as long as it stays decorative, and whether the overflow check uses a `ResizeObserver` or another observer.

## Design

- Wrapper: `overflow-x: auto`, `--border-width-hairline` solid `--color-border-default`, `--radius-lg`, `--color-bg-surface`.
- Table: `width: 100%`, `border-collapse: collapse`, `--text-body-sm`.
- Caption: `--text-label`, `--color-fg-default`, `text-align: left`, padding `--space-3` `--space-4`.
- Cells: `white-space: nowrap` (D-12; a `td[colspan]` holding an empty or error state wraps), `text-align: left`, padding `--space-3` `--space-4` (dense `--space-2` `--space-3`), `vertical-align: middle`, bottom rule `--border-width-hairline` `--color-border-default`; the last body row has none.
- Column headers (`thead th`): `--color-bg-surface-sunken`, `--text-label`, `--color-fg-muted`, `white-space: nowrap`, `position: sticky; top: 0` (effective only inside the wrapper's own scroll area, D-9).
- Row headers (`tbody th[scope="row"]`): `--text-label`, `--color-fg-default`, no background of their own, not sticky (D-3).
- The last body row has no bottom rule on any cell, `th` included (D-3).
- Numeric: `text-align: right`, `font-variant-numeric: tabular-nums`.
- Row hover and focus-within fill `--color-bg-subtle`; selected fill `--color-accent-subtle`.
- Sort button: inherits the header's font and colour, no box (`all: unset`), `display: inline-flex`, gap `--space-1`, `min-height: var(--target-min)` (D-10), pointer cursor, the shared focus ring; the arrow is generated content with empty alternative text (`content: "↓" / ""`).
- Row actions: `opacity: 0` until `tr:hover` or `tr:focus-within`, transition over `--duration-fast` with `--ease-standard`; `opacity: 1` under `(hover: none)`; buttons at least 8 px apart (`--space-2`).
- Layer: none. The sticky header stays in the table's own stacking context.
- Component tokens: none. The table reads semantic tokens only.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Body | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Header row | `--color-bg-surface-sunken` | `--palette-gray-100` | `--palette-gray-925` |
| Header label | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Cell text, row header, caption | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Rules, wrapper edge | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Row hover | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Row selected | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Checkbox edge | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-450` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface-sunken` | 4.5:1 | Header label |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Cell text, row header, caption |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Cell text on a hovered row |
| `--color-fg-default` | `--color-accent-subtle` | 4.5:1 | Cell text on a selected row |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Checkbox edge |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on sort buttons and row actions |

Status is badge text plus colour; the badge CRD owns its pairs. Forced colours: the tokens map borders to `CanvasText` and the ring to `Highlight`; the selected row's tint is a background the system removes, so it also gets a `Highlight` inset outline (D-8).

## Responsive behaviour

- The table is its container's width at every breakpoint; columns that do not fit scroll horizontally inside the wrapper, never the page. Measured at 360 px: the seven-column history is 1,027 px wide in a 326 px wrapper with every value on one line (D-12), and the page's scroll width stays 360 px.
- Keep the identifying column (the request reference row header) first so it is visible before scrolling.
- While it overflows, the wrapper is focusable and named, so keyboard users can scroll it with the arrow keys (D-4); at 1280 px the same table fits and the wrapper is not a tab stop.
- Below 768 px a page may render row cards instead of a table of four or fewer columns; the table itself does not switch.
- Row actions are always visible on touch screens.
- At 200 % text size the table scrolls inside the wrapper as it does on a phone; nothing is clipped.

## Accessibility

### Role and pattern

A native `<table>` with a `<caption>`, `<th scope="col">` column headers and a `<th scope="row">` row header for the identifying cell, following the [APG Table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/). Sortable headers contain a `<button>` and the sorted `<th>` carries `aria-sort`. It is not a grid widget: cells are not focusable, only the controls in them.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the scroll region (when it overflows), sort buttons, checkboxes and row actions in DOM order; focus within a row reveals its actions. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Sorts by the focused column; toggles a checkbox; activates a row action. |
| <kbd>←</kbd> / <kbd>→</kbd> with the wrapper focused | Scrolls a wide table horizontally. |

### Focus

- The shared ring (`--focus-ring-width` of `--color-focus-ring`, offset `--focus-ring-offset`) on the wrapper, sort buttons and row controls. Cell padding keeps the ring inside the wrapper, so the wrapper's `overflow` never clips it.
- A row with focus inside takes the hover fill, so the row being acted on is visible.
- Sorting keeps focus on the activated sort button, even though the page re-renders the rows.

### Labelling

- The caption names the table; the overflowing wrapper is a region labelled by the same caption.
- Row actions name their record ("View HP-1048", "Review HP-0992"); row checkboxes name theirs ("Select HP-0992"); the header checkbox says "Select all appointments"; an empty header over actions holds visually hidden "Actions".
- The sort arrow is hidden from assistive technology; the state is `aria-sort`.
- Loading sets `aria-busy="true"` on the wrapper; skeletons are `aria-hidden="true"`.

### Announcements

The table has no live region. After a sort or a filter, the page's status region announces the result (D-6).

### Motion

Row actions fade in over `--duration-fast`; reduced motion makes it instant. Skeleton shimmer pauses under reduced motion.

## Content and internationalisation

- Column headers are nouns in sentence case: "Request", "Service", "Braider", "Date", "Status", "Estimate", "Paid".
- Dates read "Sat 24 Oct · 10:00 am"; money is right aligned in tabular figures; ranges use an en dash ("$180–$240").
- Status is a badge with text ("Awaiting reply", "Completed"), never colour alone.
- Empty and error rows follow the empty-state formula: what is missing, why, and one action ("No appointments yet" · "Explore styles"; "We couldn’t load your appointments" · "Try again").
- Translatable content: the caption, header labels, "Actions", row action labels, checkbox labels and empty-state copy, all projected. Data values: references, names, dates, amounts. The components render no text; the sort arrow is decorative.
- Length: headers and values stay on one line (D-12), so a column is as wide as its longest value and wide tables scroll inside the wrapper; a full-width empty or error row wraps normally. Free text that needs wrapping does not belong in a table.

## Performance

- Change detection: `OnPush`, signal inputs, the sort `model`; header `aria-sort` is a `computed` of the table's sort; the overflow check runs from a `ResizeObserver`, outside Angular's zone, and writes a signal only when the overflowing state changes.
- Perf-test scenarios: `frontend/projects/perf-test/src/scenarios/Table.ts` renders Maya's appointment history (HP-1048 "Awaiting reply" and HP-0992 "Completed", sorted by date descending, with row actions); `TableSortHeader.ts` renders one sortable "Date" header in a one-row table. Iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep each at roughly 100–300 ms.
- Regression rule: a change to the templates, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: loading keeps the header row and the row height of real rows, so columns do not jump when data arrives; row actions use opacity, which does not move layout.
- Weight: `@angular/core` only; no CDK table, no virtual scrolling (pages paginate).
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `<hp-table>` with the caption "Your appointments" and Maya's two appointments, when it renders, then the DOM holds `div.table-wrap > table.table` with the caption as the table's first child, and a screen reader announces a table named "Your appointments" with 7 columns and 3 rows. (L2-041)
- **AC-2** Given the history table, when it renders, then the row for HP-1048 shows the row header "HP-1048", "Medium knotless braids", "Nia Okafor", "Sat 24 Oct · 10:00 am", the badge "Awaiting reply" (`.badge.badge--warning`) and "$180–$240", and the row for HP-0992 shows the neutral badge "Completed" (`.badge` with no tone modifier) and "$210". (L2-018)
- **AC-3** Given the Estimate column marked `.num`, when it renders, then its header and cells are right aligned with tabular figures. (L2-041)
- **AC-4** Given the row header "HP-1048", when a screen reader moves to the "Nia Okafor" cell, then it announces the column header "Braider" and the row header "HP-1048". (L2-041)
- **AC-5** Given `<hp-table dense>`, when it renders, then the table has `table--dense` and its cells have 8 px vertical and 12 px horizontal padding. (L2-041)
- **AC-6** Given an `hp-table` without a `<caption>` in development mode, when it initialises, then the console reports an error naming `hp-table` and the missing caption. (L2-041)

### Sorting

- **AC-7** Given the history table with `sort` set to date descending, when it renders, then the Date header has `aria-sort="descending"`, shows a ↓ arrow that is not announced, and no other header has `aria-sort`. (L2-041)
- **AC-8** Given the sorted Date header has focus, when Maya presses Enter, then `sortChange` emits `{ column: 'date', direction: 'ascending' }`, the header's `aria-sort` becomes `ascending`, and focus stays on the Date button. (L2-041)
- **AC-9** Given the unsorted Estimate header with the default `firstDirection`, when Maya activates it, then `sortChange` emits `{ column: 'estimate', direction: 'ascending' }`, the Estimate header gains `aria-sort="ascending"` and the Date header loses its `aria-sort`. (L2-041)

### States

- **AC-10** Given the history table, when the pointer hovers HP-0992's row, then the whole row, including its row header, takes `--color-bg-subtle`, the "Review HP-0992" action becomes visible and the cell text keeps at least 4.5:1. (L2-041)
- **AC-11** Given the history table on a pointer device, when Maya tabs to "View HP-1048", then that row's actions are visible, the row takes the hover fill and the button shows the focus ring. (L2-041)
- **AC-12** Given a touch screen (`hover: none`), when the history table renders, then every row's actions are visible without hovering. (L2-041)
- **AC-13** Given the dense table with HP-0992 selected, when it renders, then the row has `aria-selected="true"`, every cell of the row including the row header takes `--color-accent-subtle` with text at least 4.5:1, and its checkbox is checked and named "Select HP-0992". (L2-041)
- **AC-14** Given `<hp-table loading>` with the caption "Loading appointments" and two skeleton rows, when it renders, then the wrapper has `aria-busy="true"`, the header row is visible, the skeletons are `aria-hidden="true"`, and when the data arrives the header row does not move. (L2-035)
- **AC-15** Given Maya has no appointments, when the history table renders, then it keeps its header row and shows one row spanning all columns with the compact empty state "No appointments yet" and an "Explore styles" link. (L2-018)
- **AC-16** Given the history request fails, when the table renders, then one row spanning all columns shows the compact error state "We couldn’t load your appointments" and a "Try again" button. (L2-035)

### Keyboard and scrolling

- **AC-17** Given the seven-column history table at 360 px, when it renders, then the page does not scroll horizontally, the wrapper scrolls horizontally, and the wrapper has `role="region"`, `aria-labelledby` pointing at the caption and `tabindex="0"`. (L2-042)
- **AC-18** Given the overflowing wrapper has keyboard focus, when Maya presses the right arrow key, then the table scrolls right inside the wrapper and the request references stay in the first column. (L2-041)
- **AC-19** Given the same table at 1280 px, when it renders, then nothing overflows and the wrapper has no `tabindex`, `role` or `aria-labelledby`, so it is not a tab stop. (L2-041)

### Theming

- **AC-20** Given the history table, when the theme switches from light to dark, then the header row becomes grey 925 and the body grey 900 without a reload, and the header label keeps at least 4.5:1 against the header row. (L2-042)
- **AC-21** Given Windows forced colours, when the dense table with HP-0992 selected renders, then the selected row shows a `Highlight` outline and the wrapper and row rules use `CanvasText`. (L2-041)

### Responsive

- **AC-22** Given the history table at 200 % text size, when it renders, then the column headers stay on one line, the table scrolls inside the wrapper, and no text is clipped. (L2-042)

### Motion

- **AC-23** Given `prefers-reduced-motion: reduce`, when a row is hovered, then its actions appear instantly. (L2-041)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/table/`; files `table.ts` exporting `Table` (`selector: 'hp-table'`, template `<div class="table-wrap" …><table class="table" [class.table--dense]="dense()"><ng-content /></table></div>`) and `table-sort-header.ts` exporting `TableSortHeader` (`selector: 'th[hp-table-sort]'`, template `<button type="button"><ng-content /></button>`), plus the exported type `TableSortState`. Both `OnPush`; export all three from `public-api.ts`.
- `Table`: host `display: block`; `sort = model<TableSortState | null>(null)`; `overflowing` signal from a `ResizeObserver` on the wrapper (`scrollWidth > clientWidth`), which drives `role="region"`, `tabindex="0"` and `aria-labelledby`; after the first render, reads the projected `<caption>` (assigns `hp-table-caption-<n>` as its id when it has none) and reports a missing caption in development mode (D-7).
- `TableSortHeader`: injects the parent `Table` (the header is declared inside `<hp-table>` in the consumer template, so element injection resolves it); host binding `attr.aria-sort` from a `computed`; a click on the inner button updates the table's `sort` model.
- Styles: the wrapper and table rules live in `Table`'s styles; rules for projected `caption`, `th`, `td`, `tr`, `.num`, `.row-actions`, the sort button and the arrow are rooted at the host (`:host ::ng-deep thead th`), so they style only this table. `TableSortHeader` styles its own button with `:host button`.
- Changes from `components.css` required by this CRD: `position: sticky` and the sunken fill apply to `thead th` only, and `tbody th[scope="row"]` uses the row's background and `--color-fg-default` (D-3); the sort-button rule applies to any `th[hp-table-sort] button`, not only `th[aria-sort]` (D-5), with `min-height: var(--target-min)` (D-10); forced-colour outline on selected rows (D-8); `white-space: nowrap` on cells (D-12). `docs/design-system/assets/components.css` and the design-system table page change in the same slice.
- No CDK table. Composes nothing; checkboxes, badges, buttons, skeletons and empty states are projected.
- Perf-test scenarios `Table.ts` and `TableSortHeader.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *No mock renders a table; which screens is this API built for?* My appointments' history and long views (126 results in `my-appointments/long`) and a past-appointments history, as the tables-and-lists pattern describes. The API covers every configuration the design-system page shows (default, dense, sortable, selectable, row actions, loading, empty, error), so a screen can adopt the table without changing it. My appointments keeps row cards until a page change says otherwise.
- **D-2** *Is the host the native `<table>` or an element that renders it?* An element, `hp-table`, that renders the wrapper and the table. The scroll wrapper must surround the table and carry its own styles and overflow behaviour, which an attribute component on `<table>` cannot add around itself. The consumer's caption and row groups are projected into the native table, so table semantics are unchanged.
- **D-3** *Do row headers keep the column headers' sunken, muted, sticky style?* No. Measured: the design system's `.table th` rule paints `<th scope="row">` with `--color-bg-surface-sunken` and `--color-fg-muted`, so on a selected row the reference cell stayed grey while the rest of the row turned `--color-accent-subtle`, and on hover the row tint stopped at the first cell. Row headers use the row's background and `--color-fg-default` in label type; only `thead th` is sunken and sticky. The last row's row header also loses its bottom rule, which the design system removed only from `td` cells (measured: a rule remained under the last reference).
- **D-4** *Is the scrolling wrapper keyboard accessible?* Yes, while it overflows: it gets `tabindex="0"`, `role="region"` and `aria-labelledby` pointing at the caption. Measured at 360 px in Chromium 141: the history table scrolls inside the wrapper, but Tab went from the Date sort button straight to "View HP-1048" and the wrapper never took focus, so keyboard users could not scroll to read the Status and Estimate cells, which hold no control. When the table fits, the wrapper has none of these attributes and is not a tab stop.
- **D-5** *What does an unsorted sortable column carry?* No `aria-sort`, following the APG's advice to set it on the sorted column only. The design system's button styling was keyed to `th[aria-sort]`, which would have left unsorted sort buttons in the browser's default button style; the styling keys to `th[hp-table-sort]` instead.
- **D-6** *Does the table announce a new sort?* No. `aria-sort` is not announced when it changes, so the page's status region announces the result ("Sorted by date, newest first"), as the tables-and-lists pattern does for filter counts; the table emits `sortChange` and keeps focus on the button.
- **D-7** *Is the caption optional?* No. The design system requires a caption (visually hidden when a heading names the table), and it also names the scroll region. A missing caption is a development-mode console error.
- **D-8** *How does a selected row show in forced colours?* With a `Highlight` outline inside the row, because the system replaces the `--color-accent-subtle` tint with `Canvas`; the checked checkbox keeps its own forced-colour fill. This matches the design system's forced-colour treatment of the current nav link, the selected tab and the pressed chip.
- **D-9** *The design system says the header is sticky "so column names stay visible in long lists". Does it stick?* Not on the page. Measured: after scrolling the page 900 px past a 40-row table, the header row was 652 px above the viewport, because the wrapper's `overflow-x: auto` makes it the sticky header's scroll container and the wrapper never scrolls vertically. The component does not add a vertical scroll area (nested scrolling hurts touch and zoom users); long histories are paginated, as the pattern prefers. The sticky rule stays on `thead th` so it works if a table ever scrolls inside its wrapper.
- **D-10** *How big is a sort button's target?* At least `--target-min` (24 px) tall. The design system unsets the button's box, which leaves it as tall as one line of label text (measured 23 px); the minimum height keeps it at WCAG 2.2's 24 px without changing how the header looks.
- **D-11** *Does the appointment history need a Service column the design system's example lacks?* Yes. L2-018 requires each item to show its service as well as braider, date, amount and status, so the history table's columns are Request, Service, Braider, Date, Status, Estimate and Actions.
- **D-12** *Do cell values wrap?* No; each value stays on one line and the table scrolls inside its wrapper. Measured at 360 px: with wrapping allowed, the browser squeezed every column to its narrowest word, so "Sat 24 Oct · 10:00 am" broke over four lines and "Medium knotless braids" over three, making rows 117 px tall and the dates hard to scan; with `white-space: nowrap` each row stays one line and the 1,027 px table scrolls inside the 326 px wrapper, as the design system's responsive rule intends. A colspan row holding an empty or error state wraps normally.

# Stat

| Field | Value |
|---|---|
| Selector | `div[hp-fact]`, `div[hp-fact-grid]`, `div[hp-stat]` |
| Library path | `frontend/projects/components/src/lib/stat/` |
| Status | planned |
| Traces to | L2-003, L2-007, L2-035, L2-041, L2-042 |
| Design system | [`stat.html`](../../design-system/components/stat.html) |
| Source mocks | [`pages/style-detail/default`](../../mocks/pages/style-detail/default.html), [`pages/style-detail/partial`](../../mocks/pages/style-detail/partial.html), [`pages/style-detail/loading`](../../mocks/pages/style-detail/loading.html), [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html), [`pages/braider-profile/edge`](../../mocks/pages/braider-profile/edge.html), [`dialogs/report-review/default`](../../mocks/dialogs/report-review/default.html) |
| Rendering | [`stat.html`](stat.html) |

## Purpose and scope

Fact tiles answer the questions Maya asks before she books: how long, how much, how long it lasts. Each tile is one short value over one label, "4–7 hours · Typical time", "$160–$300 · Typical price", "From $180 · Knotless braids", and two to four tiles sit side by side in a fact grid. The larger stat (label, a big value, an optional delta with an arrow and words) summarises a figure with a trend, such as a braider's requests this month.

This CRD covers three pieces that the design system documents on one page: the fact tile (`div[hp-fact]`), the grid that lays tiles out and marks them busy (`div[hp-fact-grid]`), and the stat (`div[hp-stat]`).

Use something else when:

- the labels matter more than the values, or there are more than four facts: use the description list;
- the figure is a status ("Awaiting reply"): use the badge (`badge.md`);
- the price is a quote for one appointment ("Estimated price: $180–$240"): the appointment card writes it as a sentence with its estimate wording.

Out of scope:

- Formatting values. The page formats durations, money and ranges ("4–7 hours", "$160–$300", "From $180") and passes strings in; the component never parses or rounds.
- Deciding which facts exist. The page passes `null` for a fact the style or braider has not published; the tile omits itself (D-3).
- The page's own loading state: `pages/style-detail/loading` replaces the whole content with skeleton cards (skeleton CRD). The tile's loading state is for facts that load after their card.
- Omitting the whole grid when every fact is missing, and the quote-factors sentence below the grid; both are the page's.

## Usage

Every use of `.fact-grid` in `docs/mocks/`, plus the configurations the design-system page defines for later screens.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| "What to expect" on `pages/style-detail/default`, `partial`, `edge`, `offline` | grid of three `.fact` tiles with `.fact__value` and `.fact__label` (D-2) | "4–7 hours" / "Typical time"; "$160–$300" / "Typical price"; "4–8 weeks" / "Typical wear" | default; three per row from 992 px, two then one at 360 and 768 px | surface (card) |
| Style detail for a style whose wear is not published (L2-003; design-system "not listed") | grid with the third fact `null` | the first two facts only | omitted (D-3) | surface (card) |
| Nia's profile card on `pages/braider-profile/default`, `partial`, `offline`, `edge`, behind `dialogs/report-review/*` | grid of two `.fact` tiles | "From $180" / "Knotless braids"; "5 hours" / "Typical duration" | default; side by side at every width | surface (card) |
| Facts that arrive after their card (design-system loading) | grid `busy`, tiles `loading` | skeleton bars | loading → loaded | surface (card) |
| Long value (design-system states) | one tile | "From $1,240" / "Waist-length knotless, extra small" | wraps; row tiles equal height | surface (card) |
| Braider summaries with a trend (design-system stat; no customer mock) | stat with delta | "Requests this month" / "24" / up "+6 from September"; "Average reply time" / "3 h" / down "1 h slower than September" | default, loading, zero ("0" / "No requests yet"), long value ("Reviews" / "1,284") | surface |
| Facts on a sunken well (design-system theming) | grid inside `.well` | as above | tile fill switches to `--color-bg-surface` | sunken |

Every row is buildable with the API below.

## Anatomy

Fact tile:

1. **Tile** — `.fact` on the `div[hp-fact]` host. Column flex, gap `--space-0-5`, padding `--space-3`, `--radius-md`, `--color-bg-subtle` fill.
2. **Value** — `.fact__value`, first in reading order: `--text-h4`, tabular figures, `--color-fg-default`. A `<span>`, never `<strong>`.
3. **Label** — `.fact__label`: `--text-body-sm`, `--color-fg-muted`; what the value measures.

Fact grid:

4. **Grid** — `.fact-grid` on the `div[hp-fact-grid]` host: `repeat(auto-fit, minmax(min(8rem, 100%), 1fr))` columns (D-4), gap `--space-4`, block margin `--space-6`; tiles in a row stretch to equal height.

Stat:

5. **Stat** — `.stat` on the `div[hp-stat]` host: column flex, gap `--space-1`.
6. **Label** — `.stat__label`, first: `--text-label`, `--color-fg-muted`.
7. **Value** — `.stat__value`: `--text-h2`, tabular figures.
8. **Delta (optional)** — `.stat__delta` with `--up` or `--down`: `--text-body-sm`, inline flex with `--space-1` gap; an `arrow-up` or `arrow-down` icon (sm, decorative) and the words.

Hosts: all three use attribute selectors on a native `<div>`, so the host carries the BEM class and the grid's tiles are its direct children (D-1). Each template renders the inner spans.

## API

### `div[hp-fact]` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `value` | `string \| null` | — | yes | The formatted value ("4–7 hours"). `null`, empty or whitespace when not `loading`: the host gets `hidden` and renders nothing, so the fact is omitted and the grid reflows (D-3). Never replaced with "N/A", "—" or other copy. |
| `label` | `string` | — | yes | What the value measures ("Typical time"). |
| `loading` | `boolean` (`booleanAttribute`) | `false` | no | Renders the loading tile: `aria-hidden="true"` on the host, and one skeleton bar inside each of the value and label line boxes, so the tile has its loaded height (D-5). `value` is ignored while loading. |

### `div[hp-fact-grid]` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `busy` | `boolean` (`booleanAttribute`) | `false` | no | Sets `aria-busy="true"` on the grid while its tiles load; removes the attribute (not `"false"`) when done. |

### `div[hp-stat]` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | "Requests this month". |
| `value` | `string` | — | yes | The formatted value ("24", "3 h", "1,284"). A zero is a value ("0"), not a missing one. |
| `delta` | `string \| null` | `null` | no | The change in words ("+6 from September", "1 h slower than September", "No requests yet"). Omitted when null. |
| `trend` | `'up' \| 'down' \| null` | `null` | no | `'up'` (better): `.stat__delta--up`, `arrow-up` icon, success colour. `'down'` (worse): `.stat__delta--down`, `arrow-down` icon, danger colour. Null: no modifier and no arrow. Requires `delta` (D-6). |
| `loading` | `boolean` (`booleanAttribute`) | `false` | no | As for the fact: host `aria-hidden="true"`, a skeleton bar inside each of the label and value line boxes; no delta. |

- Inputs are signal inputs; booleans accept bare attributes.
- Every string is an input from the page (labels and delta words are translatable copy; values are formatted data). The component renders no copy of its own.

### Outputs

None. Facts and stats are read-only.

### Content slots

| Component | Slot | Accepts | Rule |
|---|---|---|---|
| `div[hp-fact-grid]` | default | `div[hp-fact]` elements only, two to four | Declared once. Tiles are direct children so the grid places them. |
| `div[hp-fact]`, `div[hp-stat]` | none | — | Rendered from inputs. |

## Variants and sizes

| Variant | Element | Use for |
|---|---|---|
| Fact tile in a fact grid | `.fact-grid > .fact` | Two to four short comparable figures: style detail, braider profile |
| Stat | `.stat` | One figure with presence and an optional trend |
| Stat delta up | `.stat__delta--up` | A better result than the comparison period |
| Stat delta down | `.stat__delta--down` | A worse result |
| Stat delta neutral | `.stat__delta` | Context with no direction ("No requests yet") |

One size each: the fact value uses `--text-h4` (16 px), the stat value `--text-h2` (36 px) at every width. Width comes from the grid (fact) or the container (stat).

## States

Facts and stats are not focusable and have no hover, focus, active or disabled state.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | `value` set | Value over label on the subtle tile | Read in order: "4–7 hours, Typical time" |
| Not listed | `value` null or blank | Not rendered: `hidden`, `display: none`; the other tiles fill the row (D-3) | Not exposed |
| Loading | `loading` on the tile, `busy` on the grid | Skeleton bars in the value and label line boxes; the tile keeps its loaded height (70 px at default text size) | Tile `aria-hidden="true"`; grid `aria-busy="true"` |
| Long value | value or label wider than the tile | Wraps inside the tile; tiles in the same row stretch to equal height | Unchanged |
| On a sunken well | `.well` ancestor | Tile fill `--color-bg-surface` instead of `--color-bg-subtle` | — |
| Stat with delta up / down | `trend` | Delta in `--color-success-fg` / `--color-danger-fg` with an up / down arrow | Arrow hidden; words read: "+6 from September" |
| Stat zero | `value="0"`, neutral `delta` | "0" with "No requests yet" | Read as written |
| Dark theme | theme | Tile `--palette-gray-800` on a `--palette-gray-900` card, so it still reads as inset | — |
| Forced colours | `(forced-colors: active)` | Tile gains a `CanvasText` hairline border so tiles stay distinct (D-7); text in system colours | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Skeleton shimmer pauses (skeleton's `--motion-loop-state`); values never count up | — |

## Markup

Rendered DOM. Classes and attributes are the e2e contract; the `<div>` elements are the hosts.

```html
<!-- rendered: style detail, three facts -->
<div class="fact-grid">
  <div class="fact"><span class="fact__value">4–7 hours</span><span class="fact__label">Typical time</span></div>
  <div class="fact"><span class="fact__value">$160–$300</span><span class="fact__label">Typical price</span></div>
  <div class="fact"><span class="fact__value">4–8 weeks</span><span class="fact__label">Typical wear</span></div>
</div>
```

```html
<!-- rendered: wear not published (omitted) -->
<div class="fact-grid">
  <div class="fact"><span class="fact__value">4–7 hours</span><span class="fact__label">Typical time</span></div>
  <div class="fact"><span class="fact__value">$160–$300</span><span class="fact__label">Typical price</span></div>
  <div class="fact" hidden></div>
</div>
```

```html
<!-- rendered: loading (D-5) -->
<div class="fact-grid" aria-busy="true">
  <div class="fact" aria-hidden="true"><span class="fact__value"><span class="skeleton skeleton--text"></span></span><span class="fact__label"><span class="skeleton skeleton--text"></span></span></div>
  <div class="fact" aria-hidden="true"><span class="fact__value"><span class="skeleton skeleton--text"></span></span><span class="fact__label"><span class="skeleton skeleton--text"></span></span></div>
</div>
```

```html
<!-- rendered: stat with deltas, and neutral -->
<div class="stat"><span class="stat__label">Requests this month</span><span class="stat__value">24</span><span class="stat__delta stat__delta--up"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"></path></svg>+6 from September</span></div>
<div class="stat"><span class="stat__label">Average reply time</span><span class="stat__value">3 h</span><span class="stat__delta stat__delta--down"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"></path></svg>1 h slower than September</span></div>
<div class="stat"><span class="stat__label">Requests</span><span class="stat__value">0</span><span class="stat__delta">No requests yet</span></div>
```

The skeleton bars are `span[hp-skeleton]` blocks with `shape="text"` (`skeleton.md`), whose rendered DOM is `<span class="skeleton skeleton--text" aria-hidden="true">` (attribute order free).

Consumer templates:

```html
<!-- consumer: style detail -->
<div hp-fact-grid [busy]="factsLoading()">
  <div hp-fact [value]="style.typicalDuration" label="Typical time" [loading]="factsLoading()"></div>
  <div hp-fact [value]="style.typicalPrice" label="Typical price" [loading]="factsLoading()"></div>
  <div hp-fact [value]="style.typicalWear" label="Typical wear" [loading]="factsLoading()"></div>
</div>

<!-- consumer: Nia's profile -->
<div hp-fact-grid>
  <div hp-fact value="From $180" label="Knotless braids"></div>
  <div hp-fact value="5 hours" label="Typical duration"></div>
</div>

<!-- consumer: stat -->
<div hp-stat label="Requests this month" value="24" delta="+6 from September" trend="up"></div>
```

Free to change: whitespace between the icon and the delta words (the gap is `--space-1`).

## Design

- Grid: `display: grid; grid-template-columns: repeat(auto-fit, minmax(min(8rem, 100%), 1fr)); gap: --space-4; margin-block: --space-6` (D-4).
- Tile: column flex, gap `--space-0-5`, padding `--space-3`, `--radius-md`, fill `--color-bg-subtle`.
- Fact value: `--text-h4`, `font-variant-numeric: tabular-nums`, `--color-fg-default`; label `--text-body-sm`, `--color-fg-muted` (D-2). Both wrap with `overflow-wrap: anywhere`; values never truncate.
- Loading bars: the skeleton bar inside each line box is `display: inline-block; vertical-align: middle; margin-block: 0`, 60 % wide in the value and 80 % in the label, so the tile's height equals the loaded tile's; its shimmer runs from `--color-bg-subtle-hover` through `--color-bg-surface`, because the skeleton's own `--color-bg-subtle` base is the tile's fill (D-5).
- Stat: column flex, gap `--space-1`; label `--text-label`, `--color-fg-muted`; value `--text-h2`, tabular figures; delta `--text-body-sm`, inline flex, gap `--space-1`, icon `.icon--sm`.
- Elevation, motion, layer: none.

Component tokens: none. The tile, stat and delta read semantic tokens directly; a surface re-skins the tile by overriding its `background`, as the stylesheet's `.well .fact` rule does.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Tile fill | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Tile fill on a well | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Value | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Label | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Delta up | `--color-success-fg` | `--palette-green-700` | `--palette-green-300` |
| Delta down | `--color-danger-fg` | `--palette-red-700` | `--palette-red-300` |

Contrast pairs, from `tokens/contrast-pairs.json` unless noted, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Value on tile |
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Label on tile |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Stat value on a card |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Stat label on a card |
| `--color-success-fg` | `--color-bg-surface` | 4.5:1 | Delta up on a card |
| `--color-danger-fg` | `--color-bg-surface` | 4.5:1 | Delta down on a card |

The tile against its card (`--color-bg-subtle` on `--color-bg-surface`) is a soft inset, not a boundary that carries meaning; no contrast minimum applies.

Forced colours: the tile fill disappears, so tiles gain a `CanvasText` hairline border (D-7); the delta's direction stays in its words and arrow.

## Responsive behaviour

- The grid needs no breakpoints: `auto-fit` with an 8 rem minimum gives, measured in Chromium, two tiles per row at 360 px inside a card (131 px each; the third style fact on a second row), two at 768 px on the style detail page, where the card shares the row with the aside (183 px each), and three at 1280 px (232 px each); a full-width card at 768 px holds three. Nia's two facts sit side by side at every width.
- Values never truncate; they wrap inside the tile, and tiles in a row stretch to equal height. Values are written to stay under about 12 characters so they fit one line at 360 px.
- With text enlarged to 200 % the 8 rem minimum becomes 256 px, wider than the grid at 360 px; `min(8rem, 100%)` makes the grid one column and keeps tiles inside it (D-4).
- A stat's value keeps `--text-h2` at every width.
- Not a target.

## Accessibility

### Role and pattern

Plain elements; no ARIA pattern. Reading order is value then label for a fact ("4–7 hours, Typical time") and label, value, delta for a stat. The value is a `<span>`, not `<strong>`: its weight is visual, not importance.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skips facts and stats; they are not interactive. |

### Focus

None.

### Labelling

- Ranges use an en dash with no spaces ("4–7 hours"), which screen readers read as "to".
- The delta arrow is `aria-hidden`; the words carry the direction ("+6 from September", "1 h slower than September"), so colour and arrow are never the only cue.
- A loading tile is hidden from assistive technology; the grid's `aria-busy="true"` tells it the region is updating.
- An omitted fact is absent, not announced as empty.

### Announcements

None. Loaded values are not announced; the page's loading pattern decides whether a region announces completion.

### Motion

Values do not count up or animate. Skeleton bars shimmer and pause under `prefers-reduced-motion: reduce` through `--motion-loop-state` (skeleton CRD).

## Content and internationalisation

- Value: number and unit, short: "4–7 hours", "$160–$300", "From $180", "5 hours". En dash for ranges, no spaces around it. Whole-dollar prices have no decimals ("$180").
- Label: what it measures, sentence case: "Typical time", "Typical price", "Typical wear", "Typical duration"; for a braider's service, the service name ("Knotless braids") under its starting price.
- Say "typical" or "from" for estimates; the braider confirms the final price (L2-003 asks for typical or estimate language).
- A fact that is not published is omitted, never shown as "N/A", "—" or "Ask Nia" (D-3).
- Translatable content: `label`, `delta`. Data values: `value` (formatted by the page). The component renders no text of its own.
- Length: English only today; a longer label wraps inside its tile.

## Performance

- Change detection: `OnPush`, signal inputs; the hidden state and the delta class are `computed`.
- Perf-test scenarios: `frontend/projects/perf-test/src/scenarios/Fact.ts` renders one tile from the knotless braids page, value "4–7 hours", label "Typical time"; `frontend/projects/perf-test/src/scenarios/FactGrid.ts` renders the style detail's grid of three facts ("4–7 hours", "$160–$300", "4–8 weeks"), the composition that repeats on style and braider pages; `frontend/projects/perf-test/src/scenarios/Stat.ts` renders "Requests this month", "24", "+6 from September", trend up. Iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep each at roughly 100–300 ms.
- Regression rule: a change to any template, input, style or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: the loading tile has the loaded tile's height (D-5), and an omitted fact never renders, so facts arriving or missing do not shift the card below the grid's own row count.
- Weight: `@angular/core`, the icon component (delta arrows) and the skeleton component (loading bars).
- Render cost has no L2 requirement, so it has no criterion here.

## Acceptance criteria

### Rendering

- **AC-1** Given the knotless braids style with typical time, price and wear, when "What to expect" renders, then the grid is `<div class="fact-grid">` with three `<div class="fact">` children whose `.fact__value` and `.fact__label` read "4–7 hours" / "Typical time", "$160–$300" / "Typical price" and "4–8 weeks" / "Typical wear", and no `<strong>` element is used. (L2-003)
- **AC-2** Given a fact tile inside a fact grid, when its computed style is read, then the value is 16 px semibold with tabular figures in `--color-fg-default`, the label 14 px in `--color-fg-muted`, and the tile has a `--color-bg-subtle` fill, 8 px corners and 12 px padding. (L2-041)
- **AC-3** Given Nia Okafor's profile, when her service facts render, then the grid shows "From $180" / "Knotless braids" and "5 hours" / "Typical duration" side by side. (L2-007)
- **AC-4** Given the "4–7 hours / Typical time" tile, when a screen reader reads the grid, then it reads the value before the label and announces no emphasis. (L2-041)

### States

- **AC-5** Given a style whose typical wear is not published, when its detail renders with `value` null for "Typical wear", then that tile has the `hidden` attribute and takes no space, the two remaining tiles fill the row, and the text "N/A", "—" and "Ask Nia" appear nowhere in the grid. (L2-003)
- **AC-6** Given the style facts are still loading after the card has rendered, when the grid renders with `busy` and each tile `loading`, then the grid has `aria-busy="true"`, each tile has `aria-hidden="true"` and two skeleton bars, and each tile is 70 px tall at default text size, the same as a loaded tile. (L2-035)
- **AC-7** Given the loading grid, when the facts arrive, then `aria-busy` is removed, the values replace the bars, and the grid's height does not change. (L2-035)
- **AC-8** Given the tiles "From $1,240" / "Waist-length knotless, extra small" and "5 hours" / "Typical duration" side by side at 360 px, when they render, then the long label wraps inside its tile, nothing is truncated, and both tiles are the same height. (L2-042)

### Stat

- **AC-9** Given `<div hp-stat label="Requests this month" value="24" delta="+6 from September" trend="up">`, when it renders, then the delta has the classes `stat__delta stat__delta--up`, its colour is `--color-success-fg`, it starts with an `arrow-up` icon that has `aria-hidden="true"`, and its text is "+6 from September". (L2-041)
- **AC-10** Given a stat "Average reply time" / "3 h" with delta "1 h slower than September" and `trend="down"`, when it renders, then the delta uses `--color-danger-fg` and an `arrow-down` icon, and the words alone state the direction. (L2-041)
- **AC-11** Given a stat "Requests" / "0" with delta "No requests yet" and no `trend`, when it renders, then the delta has no modifier class and no arrow. (L2-041)
- **AC-12** Given the stat "Reviews" / "1,284" at 360 px and at 1280 px, when it renders, then the value is 36 px with tabular figures at both widths and the label uses `--text-label` in `--color-fg-muted`. (L2-042)

### Keyboard and focus

- **AC-13** Given the style detail page, when Maya presses Tab from the hero area, then focus moves past the fact grid to the next link or button without stopping on any tile. (L2-041)

### Theming

- **AC-14** Given the style facts, when the theme switches from light to dark, then the tile fill changes to the dark `--color-bg-subtle` (grey 800) on the dark card (grey 900) and the value and label change to their dark tokens without a reload. (L2-042)
- **AC-15** Given a fact tile and a stat with both deltas in each theme, when contrast is measured, then the value and label reach at least 4.5:1 against the tile, and the deltas at least 4.5:1 against `--color-bg-surface`. (L2-041)
- **AC-16** Given Windows forced colours, when the style facts and a stat with a delta render, then each tile has a `CanvasText` border, every value and label is visible, and the delta keeps its arrow and words. (L2-041)

### Responsive

- **AC-17** Given the style detail on a 360 px viewport, when the grid renders, then "4–7 hours" and "$160–$300" share the first row and "4–8 weeks" starts the second, each tile inside the card, with no horizontal scrolling. (L2-042)
- **AC-18** Given the style detail at 1280 px, when the grid renders, then the three tiles share one row with equal widths. (L2-042)
- **AC-19** Given the style detail on a 360 px viewport with text enlarged to 200 %, when the grid renders, then the tiles stack in one column, no tile is wider than the grid, and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-20** Given `prefers-reduced-motion: reduce`, when the facts load and then appear, then the skeleton bars do not shimmer and the values appear without counting up or animating. (L2-041)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/stat/`; files `fact.ts` (`Fact`, `selector: 'div[hp-fact]'`), `fact-grid.ts` (`FactGrid`, `selector: 'div[hp-fact-grid]'`, template `<ng-content />`) and `stat.ts` (`Stat`, `selector: 'div[hp-stat]'`), all standalone with `changeDetection: OnPush` and scoped `styles` porting `.fact-grid`, `.fact`, `.fact__value`, `.fact__label`, `.stat`, `.stat__*` from `docs/design-system/assets/components.css` onto `:host`, plus `:host([hidden]) { display: none; }`. Export all three from `public-api.ts`.
- Do not port the mock-parity selectors `:where(.fact-grid > div > strong)` and `:where(.fact-grid > div > span)` (D-2). `components.css` and the design-system stat page already carry the rest of this CRD, so the port is one to one: the parity selectors at zero specificity (D-2), `.fact[hidden]` (D-3), `minmax(min(8rem, 100%), 1fr)` and `overflow-wrap: anywhere` (D-4), the skeleton bars inside the line boxes with their lighter shimmer (D-5), `.well .fact`, and the forced-colours tile border (D-7).
- `Fact` host bindings: `class.fact`; `attr.hidden` (`''` when not loading and the trimmed value is empty); `attr.aria-hidden` (`'true'` while loading). Template: `@if (loading()) { skeleton bars } @else if (value()) { <span class="fact__value">{{ value() }}</span><span class="fact__label">{{ label() }}</span> }`.
- `FactGrid` host bindings: `class.fact-grid`; `attr.aria-busy` (`'true'` or `null`).
- `Stat` template: label, value, then `@if (delta()) { <span class="stat__delta" [class.stat__delta--up]="trend() === 'up'" [class.stat__delta--down]="trend() === 'down'">@if (trend()) {<svg hp-icon [name]="'arrow-' + trend()" size="sm"></svg>}{{ delta() }}</span> }`.
- Composes the icon component (`icon.md`, `arrow-up` and `arrow-down`) and the skeleton component (`skeleton.md`: `<span hp-skeleton shape="text" width="60%">` in the value and `width="80%"` in the label, rendering `<span class="skeleton skeleton--text">`). No CDK primitive.
- Perf-test scenarios `Fact.ts`, `FactGrid.ts` and `Stat.ts` in `frontend/projects/perf-test/src/scenarios/`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Element or attribute selectors?* Attribute selectors on native `<div>` hosts (`div[hp-fact]`, `div[hp-fact-grid]`, `div[hp-stat]`). The grid lays out its direct children, so a tile must be the grid item itself; a wrapper element would become the grid item and need `display: contents`. The rendered DOM then matches the design system's markup that the e2e page objects locate.
- **D-2** *The first mocks marked the value up as `<strong>` in an unclassed `<div>`, and the stylesheet keeps `.fact-grid > div > strong/span` for parity. What renders?* `.fact__value` and `.fact__label` spans in a `.fact` tile, as the design system requires and the mocks now render. Measured in Chromium with the parity selectors at full specificity, `.fact-grid > div > span` outranked `.fact__value` inside a grid and painted every value as a 14 px regular muted label; only the tile outside a grid showed the specified 16 px semibold value. The component does not port the parity selectors, and `components.css` matches them inside `:where()` so they can never outrank the part classes.
- **D-3** *The design system shows a missing fact as "Ask Nia"; L2-003 says an unavailable optional fact is omitted without inventing a value. Which wins?* L2: the tile is omitted (host `hidden`), and the remaining facts fill the row. On the style detail no braider is in context, so "Ask Nia" cannot apply, and on a profile it would still be copy standing in for a value the braider has not published. The design-system "not listed" state and its do and don't show the omitted tile. (needs product confirmation)
- **D-4** *Tiles overflow when text is enlarged.* Measured in Chromium on `pages/style-detail/default` and `pages/braider-profile/default` at 360 px with text at 200 %: the 8 rem column minimum becomes 256 px in a 198 px grid and every tile overruns the card. The column minimum becomes `min(8rem, 100%)`, which changes nothing at default text size (two tiles at 360 px, three at 1280 px, measured) and gives one column when the grid is narrower than 8 rem.
- **D-5** *How tall is a loading tile?* As tall as the loaded tile. A title and a text skeleton stacked in the tile measured 80 px loading against 70 px loaded at default text size, so the card below jumps when facts arrive. The loading tile instead puts one inline-block skeleton bar inside each of the value and label line boxes; measured, both tiles are 70 px. The skeleton's base colour is `--color-bg-subtle`, the tile's own fill, so a bar on a tile would be invisible except for the moving highlight (seen in the rendering); inside a tile the bar's gradient runs from `--color-bg-subtle-hover` through `--color-bg-surface`.
- **D-6** *What do `up` and `down` mean on a stat?* Better and worse, as the design system's examples use them ("1 h slower than September" is down in the danger colour although the number went up). The words always state the actual change, so the arrow and colour only reinforce them. `trend` without `delta` renders nothing, since there are no words to carry the meaning.
- **D-7** *What do tiles look like in forced colours?* Forced colours remove the subtle fill, leaving adjacent values and labels with nothing between them but the gap. Each tile gains a `CanvasText` hairline border, as cards, chips and badges do in the design system.
- **D-8** *Is the stat in scope with no customer mock?* Yes. The design system defines it in the core set for braider summaries, and building it now with the fact tile keeps one component folder and one API; it carries no customer-facing copy until a braider surface uses it.

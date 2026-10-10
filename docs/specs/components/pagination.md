# Pagination

| Field | Value |
|---|---|
| Selector | `hp-pagination` |
| Library path | `frontend/projects/components/src/lib/pagination/` |
| Status | built |
| Traces to | L2-002, L2-005, L2-035, L2-041, L2-042 |
| Design system | [`pagination.html`](../../design-system/components/pagination.html) |
| Source mocks | [`pages/style-gallery/long`](../../mocks/pages/style-gallery/long.html), [`pages/matching-braiders/long`](../../mocks/pages/matching-braiders/long.html), [`pages/my-appointments/long`](../../mocks/pages/my-appointments/long.html), [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html) |
| Rendering | [`pagination.html`](pagination.html) |

## Purpose and scope

Pagination splits a long result set into pages and says where the customer is: 126 styles in the gallery, Toronto braiders who offer knotless braids, a long appointment history, Nia's 86 reviews. It sits under the list as a `<nav>` landmark with a summary ("Showing 1–3 of 126"), Previous and Next, and numbered page links, the current one marked with `aria-current="page"`. Every page has its own URL (`?page=2`), so a page can be bookmarked, shared and reached with Back. A **simple** variant drops the numbers for short sequences where page numbers mean little, such as reviews on Nia's profile.

Use something else when:

- position in the list does not matter (notifications): a secondary "Show more" button that appends ([`button.md`](button.md));
- the list fits on one screen: no pagination (the component renders nothing for one page).

Out of scope:

- Fetching and rendering the page of results, the loading state while it arrives, and the result count. The page reads the query parameter, loads, and passes `page`, `pageCount` and the formatted `summary`.
- Focus after a new page loads. The design system asks the page to move focus to the results heading and announce the new range ("Showing 4–6 of 126"); the page owns its heading and status region.
- Smooth scrolling to the results. The page decides, and never smooth-scrolls under reduced motion.
- Formatting the summary ("Showing 1–3 of 126", "Reviews 11–20 of 86", "1,284"): the page formats it with its locale and passes the string.

## Usage

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/style-gallery/long` | numbered, `label` "Results pages", `queryParam` `page`; the search term and category stay in the URL | summary "Showing 1–3 of 126"; "Previous", "Next"; 42 pages of three | page 1 current, Previous unavailable (mock: live, drift D-7), hover, focus | canvas, under the story-card grid |
| `pages/matching-braiders/long` | numbered, `label` "Braiders pages" (design-system example), `queryParam` `page`; the style, maximum price and distance stay in the URL | "Showing 4–6 of 12 braiders"; "Previous", "Next" | page 1 and page 2 current, both ends available, hover, focus | canvas, under the results |
| `pages/my-appointments/long` | numbered, `label` "Appointment pages", `queryParam` `page`; the status filter stays in the URL | "Showing 1–3 of 126" (mock copy); "Previous", "Next" | page 1 current | canvas |
| Reviews on `pages/braider-profile` (design-system *Variants*; no mock state yet) | simple, `label` "Review pages", `queryParam` `reviews` | "Reviews 11–20 of 86"; hidden "Previous reviews", "Next reviews" | both ends available; first and last pages with one end unavailable | surface (reviews card) |
| Many pages (design-system *Variants*) | numbered with gaps | 1 … 5 6 7 8 9 … 42 from 768 px; 1 … 7 … 42 below (D-4) | current in the middle, ellipses | canvas |

The mocks use an ad-hoc `.pagination-row` with an unstyled `<span>` summary; the design system replaces both (`.pagination`, `.pagination__summary`) and keeps `.pagination-row` only as a stylesheet alias. The component renders the design-system classes. Every row is buildable with the API below.

## Anatomy

1. **Landmark** — `<nav class="pagination" aria-label="…">` inside the host; `.pagination--simple` added for the simple variant. A centred, wrapping flex row with `--space-1` gaps and `--space-6` top margin.
2. **Summary** — `<span class="pagination__summary">`, `--text-body-sm`, `--color-fg-muted`. Numbered: a full-width centred line below 640 px, inline from 640 px. Simple: always inline between the arrows (D-6).
3. **Previous / Next** — `<a href>` text links ("Previous", "Next"); in the simple variant a chevron icon with the label in a `.visually-hidden` span. The unavailable end is `<a role="link" aria-disabled="true">` with no `href`.
4. **Page link** — `<a href>` with the page number; 32 px square minimum (`--control-height-sm`), `--radius-md`, a hairline transparent border.
5. **Current page** — the page link with `aria-current="page"`: `--color-accent-subtle` fill, `--color-accent` border, `--color-fg-accent` label.
6. **Ellipsis** — `<span class="pagination__ellipsis" aria-hidden="true">…</span>`, a 32 px non-interactive box in `--color-fg-muted` (D-3).
7. **Responsive hooks** — `.pagination__wide` on items shown only from 768 px, `.pagination__narrow` on items shown only below 768 px (D-4).

Host: `hp-pagination` is an element selector because the component is a composite of landmark, summary and items (D-1). The host is `display: block`; the classes are on the inner `<nav>`, as in the design system.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes (`input.required`) | The landmark's `aria-label`, naming what it pages: "Results pages", "Braiders pages", "Review pages". A page with two paginations gives them different labels. |
| `page` | `number` | — | yes (`input.required`) | The current page, 1-based. Outside 1…`pageCount` it is clamped for rendering and logs a development error (D-8). |
| `pageCount` | `number` | — | yes (`input.required`) | Total pages. At 1 or less the component renders nothing (D-8). |
| `summary` | `string` | — | yes (`input.required`) | The formatted range: "Showing 1–3 of 126", "Reviews 11–20 of 86". |
| `previousLabel` | `string` | — | yes (`input.required`) | "Previous" (numbered, visible) or "Previous reviews" (simple, visually hidden). |
| `nextLabel` | `string` | — | yes (`input.required`) | "Next" or "Next reviews". |
| `variant` | `'numbered' \| 'simple'` | `'numbered'` | no | Simple adds `.pagination--simple`, renders chevron icons with hidden labels and no page numbers. |
| `queryParam` | `string` | `'page'` | no | The query parameter each link sets. Links use `routerLink` to the current route with `queryParamsHandling: 'merge'`, so every other parameter (search, category, style, price, distance) is kept; page 1 removes the parameter (D-2). |
| `pageLabel` | `((page: number) => string) \| undefined` | `undefined` | no | When set, each number link gets `aria-label` from it ("Page 2"), for contexts where a bare number is unclear. The visible text stays the number, so the name contains it (WCAG 2.5.3). |

- Inputs are signal inputs. Every string is an input; the component renders no copy except page numbers and the "…" glyph, which is hidden from assistive technology.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | Paging is navigation: the router updates the URL and the page reacts to its query parameter. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | The structure (summary, ends, numbers, gaps, responsive hooks) is computed from the inputs. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Numbered with summary | — (`.pagination`) | Results lists: style gallery, matching braiders, appointment history. |
| Simple previous/next | `.pagination--simple` | Short sequences where numbers mean little: reviews on a braider's profile. |

Page window (numbered): from 768 px, the first page, the last page and two either side of the current page; below 768 px, the first, the current and the last page (D-4). A gap of two or more pages shows an ellipsis; a gap of exactly one page shows that page's number instead (D-5).

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One size | — | `--control-height-sm` (32 px), minimum width the same | `--space-2` inline | `--text-label` (14 px semibold), tabular figures |

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (page link, Previous, Next) | — | `--color-fg-muted`, transparent fill and border, no underline | Link named by its text ("2", "Next") or `pageLabel` |
| Hover | `:hover` | Fill `--color-bg-subtle`, label `--color-fg-default` | — |
| Focus | `:focus-visible` | Shared ring: `--focus-ring-width` of `--color-focus-ring`, offset `--focus-ring-offset` | — |
| Active | `:active` | Same as hover (design-system *States*) | — |
| Current | `aria-current="page"` | Fill `--color-accent-subtle`, border `--color-accent`, label `--color-fg-accent` (the selected look shared with chips and the current nav link) | "current page"; still a link and focusable |
| Unavailable end | `role="link"`, `aria-disabled="true"`, no `href` | 50 % opacity, `pointer-events: none`; stays in place so the row does not jump | Announced as an unavailable link; not in the Tab order |
| Ellipsis | gap of two or more pages | "…" in a 32 px box, `--color-fg-muted` | Hidden (`aria-hidden="true"`) |
| Narrow window | viewport below 48 rem | `.pagination__wide` items `display: none` | Hidden items are out of the accessibility tree |
| Wide window | viewport from 48 rem | `.pagination__narrow` items `display: none` | As above |
| One page | `pageCount` ≤ 1 | Nothing rendered | Nothing announced |
| Forced colours | `(forced-colors: active)` | Every item is drawn with a `LinkText` border; the current page adds a `--border-width-thick` `Highlight` outline so it stays distinct (D-9); the ring is `Highlight` | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | No change: nothing animates | — |

There is no loading state: while the next page loads, the pagination keeps showing the page the customer chose (the router has already updated `page`); the results region shows its own loading state.

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: numbered, page 1 of 42 in the style gallery, searching "knotless braids" in Braids -->
<hp-pagination>
  <nav class="pagination" aria-label="Results pages">
    <span class="pagination__summary">Showing 1–3 of 126</span>
    <a role="link" aria-disabled="true">Previous</a>
    <a href="/styles?q=knotless%20braids&amp;category=braids" aria-current="page">1</a>
    <a class="pagination__wide" href="/styles?q=knotless%20braids&amp;category=braids&amp;page=2">2</a>
    <a class="pagination__wide" href="/styles?q=knotless%20braids&amp;category=braids&amp;page=3">3</a>
    <span class="pagination__ellipsis" aria-hidden="true">…</span>
    <a href="/styles?q=knotless%20braids&amp;category=braids&amp;page=42">42</a>
    <a href="/styles?q=knotless%20braids&amp;category=braids&amp;page=2">Next</a>
  </nav>
</hp-pagination>
```

```html
<!-- rendered: numbered, page 7 of 42 (hrefs shortened) -->
<nav class="pagination" aria-label="Results pages">
  <span class="pagination__summary">Showing 19–21 of 126</span>
  <a href="?page=6">Previous</a>
  <a href="?">1</a>
  <span class="pagination__ellipsis" aria-hidden="true">…</span>
  <a class="pagination__wide" href="?page=5">5</a>
  <a class="pagination__wide" href="?page=6">6</a>
  <a href="?page=7" aria-current="page">7</a>
  <a class="pagination__wide" href="?page=8">8</a>
  <a class="pagination__wide" href="?page=9">9</a>
  <span class="pagination__ellipsis" aria-hidden="true">…</span>
  <a href="?page=42">42</a>
  <a href="?page=8">Next</a>
</nav>
```

```html
<!-- rendered: page 4 of 42 — the narrow window needs an ellipsis the wide window does not -->
<a href="?">1</a>
<span class="pagination__ellipsis pagination__narrow" aria-hidden="true">…</span>
<a class="pagination__wide" href="?page=2">2</a>
<a class="pagination__wide" href="?page=3">3</a>
<a href="?page=4" aria-current="page">4</a>
```

```html
<!-- rendered: simple, reviews on Nia Okafor's profile, page 2 of 9 -->
<nav class="pagination pagination--simple" aria-label="Review pages">
  <a href="/braiders/nia-okafor"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg><span class="visually-hidden">Previous reviews</span></a>
  <span class="pagination__summary">Reviews 11–20 of 86</span>
  <a href="/braiders/nia-okafor?reviews=3"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg><span class="visually-hidden">Next reviews</span></a>
</nav>
```

Consumer templates:

```html
<!-- consumer: style gallery -->
<hp-pagination
  label="Results pages"
  [page]="page()"
  [pageCount]="pageCount()"
  [summary]="'Showing ' + first() + '–' + last() + ' of ' + total()"
  previousLabel="Previous"
  nextLabel="Next" />

<!-- consumer: reviews on a braider profile -->
<hp-pagination
  variant="simple"
  label="Review pages"
  queryParam="reviews"
  [page]="reviewPage()"
  [pageCount]="reviewPageCount()"
  [summary]="'Reviews ' + firstReview() + '–' + lastReview() + ' of ' + reviewTotal()"
  previousLabel="Previous reviews"
  nextLabel="Next reviews" />
```

Free to change: whitespace, and the exact URL encoding the router produces. The order of items, the classes and the attributes are fixed.

## Design

- Row: `display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: --space-1`; `margin-top: --space-6`; no list markers.
- Summary: `--text-body-sm`, `--color-fg-muted`, `margin-right: --space-2`; `flex-basis: 100%` and centred below 640 px (`--layout-breakpoint-sm`), `auto` from 640 px. In the simple variant `flex-basis: auto; margin: 0` at every width (D-6).
- Items: `display: inline-grid; place-items: center`; `min-width` and `height` `--control-height-sm`; `padding-inline: --space-2`; `--radius-md`; `--border-width-hairline` transparent border; `--text-label`; no underline; `font-variant-numeric: tabular-nums` on items and summary (D-9).
- Ellipsis: the same 32 px box as an item, `--text-label` in `--color-fg-muted`, no border or fill.
- Icons (simple): `.icon--sm` chevrons, stroked in `currentColor`.
- Window hooks (D-4): `@media (width < 48rem) { .pagination__wide { display: none } }` and `@media (width >= 48rem) { .pagination__narrow { display: none } }`; 48 rem is `--layout-breakpoint-md`.
- Unavailable end: `opacity: 0.5; pointer-events: none`.
- Elevation, layer and motion: none.
- The pagination declares no component tokens; theme it through the semantic tier.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Item label, summary, ellipsis | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Hover fill | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Hover label | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Current fill | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Current border | `--color-accent` | `--palette-plum-600` | `--palette-plum-300` |
| Current label | `--color-fg-accent` | `--palette-plum-700` | `--palette-plum-300` |
| Page behind it | `--color-bg-canvas` | `--palette-gray-50` | `--palette-gray-950` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Page link, Previous, Next, summary |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Simple variant inside the reviews card |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Hovered item |
| `--color-fg-accent` | `--color-accent-subtle` | 4.5:1 | Current page label |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Current page edge |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring in the reviews card |

The unavailable end is inactive and exempt from contrast minimums (WCAG 1.4.3), and is also identified by `aria-disabled`. Forced colours: see D-9.

## Responsive behaviour

- **Below 640 px**: the summary takes its own centred line above the controls (numbered variant).
- **From 640 px**: summary and controls share one centred row.
- **Below 768 px**: the narrow window (first, current, last). Measured in Chromium at 360 px: "Previous 1 … 7 … 42 Next" is 315 px wide and fits the 328 px content width on one row for every page of a 42-page set; at 320 px (288 px of content) "Next" wraps onto a second centred row, and nothing is clipped or scrolls.
- **From 768 px**: the wide window (first, current ± 2, last). Measured at 768 px: the widest two-digit case ("Showing 19–21 of 126" plus "Previous 1 … 5 6 7 8 9 … 42 Next") fits on one row. With three-digit page numbers (1,284 results) the controls wrap onto a second centred row.
- Items stay 32 px tall with 4 px gaps; Previous and Next keep their words in the numbered variant; arrow-only controls carry hidden labels.
- Text enlarged to 200 % moves both breakpoints (40 rem and 48 rem scale with the text), so the narrow window applies and the controls wrap onto further centred rows; measured at 360 px with 200 % text, nothing scrolls horizontally.
- Targets: items are at least 32 × 32 px with 4 px gaps, above the 24 px minimum (`--target-min`).
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available.

## Accessibility

### Role and pattern

A `<nav>` landmark labelled by `label`, containing plain links: each page has its own URL. The current page has `aria-current="page"`. An unavailable end is `<a role="link" aria-disabled="true">` without `href`, so it is announced as an unavailable link but not focusable. Ellipses are `aria-hidden`. There is no APG pattern for pagination; this follows the design system's *Accessibility* section.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the available links in DOM order; unavailable ends, ellipses and hidden window items are skipped. |
| <kbd>Enter</kbd> | Loads that page. |

### Focus

The shared ring around each item. The current page is focusable. After a page loads, the page moves focus to its results heading (out of scope); the pagination never keeps or moves focus itself.

### Labelling

- The landmark is labelled for what it pages; two paginations on one page have different labels.
- Number links read as the number, or as `pageLabel(n)` ("Page 2") when set.
- Icon-only ends (simple) are named by their hidden text: "Previous reviews", "Next reviews".
- The summary is plain text inside the landmark and is read in order.

### Announcements

None. The page announces the new range after loading (design-system *Focus*).

### Motion

None; colour and fill changes are instant.

## Content and internationalisation

- Summary formula: "Showing {first}–{last} of {total}" with an en dash; add the noun when the context is unclear ("of 12 braiders"). The simple variant names the items: "Reviews 11–20 of 86".
- "Previous" and "Next", not "Prev", "«" or "Older".
- Numbers use tabular figures; totals above 999 use a grouping comma ("1,284"), formatted by the page.
- Translatable content: `label`, `summary`, `previousLabel`, `nextLabel`, `pageLabel`. Data values: the numbers inside the summary and the page numbers.
- The mocks' long states show "Showing 1–3 of 126" with only two page links; with three per page that is 42 pages, so the component renders "1 2 3 … 42" from 768 px and "1 … 42" below.

## Performance

- Change detection: `OnPush`; signal inputs; the item list is one `computed` from `page`, `pageCount` and `variant`; the template is a single `@for` over it tracked by key.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Pagination.ts` renders the style gallery's pagination on page 7 of 42 with "Showing 19–21 of 126", "Previous" and "Next" (the widest item set); iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: both windows are in the server-rendered DOM and the media queries choose between them, so nothing changes after hydration; unavailable ends keep their place.
- Weight: `@angular/core`, `RouterLink` and the icon component. No CDK, no breakpoint observer.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given the style gallery on page 1 of 42 at 1280 px, when the pagination renders, then it is `nav.pagination[aria-label="Results pages"]` holding the summary "Showing 1–3 of 126", an unavailable "Previous" with no `href`, page "1" with `aria-current="page"`, pages "2" and "3", one ellipsis, page "42" and an available "Next" to page 2. (L2-035)
- **AC-2** Given page 7 of 42 at 1280 px, when it renders, then the visible page links read "1 … 5 6 7 8 9 … 42" and both ends are available. (L2-035)
- **AC-3** Given page 5 of 42 at 1280 px, when it renders, then the links read "1 2 3 4 5 6 7 … 42": the single missing page 2 shows as a number, never as an ellipsis. (L2-035)
- **AC-4** Given page 42 of 42, when it renders, then "Next" is `<a role="link" aria-disabled="true">` with no `href` and "Previous" links to page 41. (L2-035)
- **AC-5** Given a result set that fits on one page (`pageCount` 1), when the list renders, then no pagination landmark is rendered. (L2-035)

### Variants

- **AC-6** Given the style gallery searching "knotless braids" in the Braids category, when the customer activates "Next" on page 1, then the URL keeps the search term and category and sets `page=2`, and when they then activate "Previous", then the URL keeps both and has no `page` parameter. (L2-002)
- **AC-7** Given Toronto braiders for Knotless braids filtered to a maximum price of $150 within 10 km (the filter dialog's values), when the customer activates page "2", then the URL keeps the style, the price and the distance and sets `page=2`. (L2-005)
- **AC-8** Given Nia's reviews on page 2 of 9 with `variant="simple"`, `label` "Review pages" and `queryParam` `reviews`, when it renders, then the nav has the classes `pagination pagination--simple`, the summary "Reviews 11–20 of 86" sits between two chevron links named "Previous reviews" and "Next reviews", no page numbers render, and activating "Next reviews" sets `reviews=3` without changing any other parameter. (L2-035)
- **AC-9** Given `pageLabel` returning "Page 2" for 2, when the number links render, then link "2" shows the text "2" and has the accessible name "Page 2". (L2-041)
- **AC-10** Given `page` 50 with `pageCount` 42 in development mode, when it renders, then page 42 is marked current and the console reports an error naming `hp-pagination` and the out-of-range page. (L2-035)

### States

- **AC-11** Given page link "2", when the pointer hovers or presses it, then its fill becomes `--color-bg-subtle` and its label `--color-fg-default` with contrast at least 4.5:1. (L2-041)
- **AC-12** Given the current page "1", when it renders, then its fill is `--color-accent-subtle`, its border `--color-accent` and its label `--color-fg-accent`, the label contrast is at least 4.5:1 and the border at least 3:1 against `--color-bg-canvas`. (L2-041)
- **AC-13** Given the unavailable "Previous" on page 1, when it renders and the pointer clicks it, then it is 50 % opaque, stays in its place before "1", and nothing happens. (L2-041)

### Keyboard and focus

- **AC-14** Given page 1 of 42 at 1280 px, when the customer presses Tab from the last story card, then focus visits "1", "2", "3", "42" and "Next" in that order, skipping the unavailable "Previous" and the ellipsis, and Enter on "2" loads page 2. (L2-041)
- **AC-15** Given a page link focused by keyboard, when the ring shows, then it is a 2 px `--color-focus-ring` outline offset 2 px with contrast at least 3:1 against `--color-bg-canvas`. (L2-041)

### Screen readers

- **AC-16** Given page 1 of 42, when a screen reader reads the pagination, then it announces a navigation landmark "Results pages", the summary "Showing 1–3 of 126", "Previous" as an unavailable link, "1" as the current page, and no ellipsis. (L2-041)

### Theming

- **AC-17** Given the pagination, when the theme switches from light to dark, then the current page changes from plum 700 on plum 50 to plum 300 on plum 950 and the other items from grey 600 to grey 350 without a reload. (L2-042)
- **AC-18** Given the pagination in either theme, when contrast is measured, then item labels and the summary are at least 4.5:1 against `--color-bg-canvas`, the current label at least 4.5:1 against `--color-accent-subtle`, and the current edge and focus ring at least 3:1 against `--color-bg-canvas`. (L2-041)
- **AC-19** Given Windows forced colours, when the pagination renders, then the current page carries a 2 px `Highlight` outline that the other items do not, so it remains distinguishable. (L2-041)

### Responsive

- **AC-20** Given page 7 of 42 at 360 px, when it renders, then the summary is on its own centred line and the controls read "Previous 1 … 7 … 42 Next" on one row, with no horizontal scroll. (L2-042)
- **AC-21** Given page 4 of 42 at 360 px, when it renders, then the controls read "Previous 1 … 4 … 42 Next", and at 1280 px they read "Previous 1 2 3 4 5 6 … 42 Next". (L2-042)
- **AC-22** Given page 7 of 42 at 320 px, when it renders, then any control that does not fit wraps onto a second centred row, every control stays fully visible, and the page does not scroll horizontally. (L2-042)
- **AC-23** Given page 1 of 42 at 768 px, when it renders, then the summary and the controls share one centred row. (L2-042)
- **AC-24** Given 360 px with text enlarged to 200 %, when page 7 of 42 renders, then every control is visible and operable across wrapped rows and the page does not scroll horizontally. (L2-042)

### Motion

Nothing in the pagination animates, so it has no motion criterion.

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/pagination/`; file `pagination.ts` exporting the standalone component `Pagination` with `selector: 'hp-pagination'` and `changeDetection: OnPush`; export it from the library's `public-api.ts`.
- Item model: a `computed` producing `{ kind: 'page' | 'gap' | 'previous' | 'next', page?, wide: boolean, narrow: boolean, available: boolean }[]` from two windows: radius 2 (wide) and radius 0 (narrow) around the current page, plus the first and last page, where a one-page gap is filled with that page (D-5). Items in only one window get `.pagination__wide` or `.pagination__narrow`. A gap after page 1 and a gap before the last page are the only gap positions.
- Links: `<a [routerLink]="[]" [queryParams]="{ [queryParam()]: n === 1 ? null : n }" queryParamsHandling="merge">`. Unavailable ends render a separate `<a role="link" aria-disabled="true">` without `routerLink`.
- Scoped `styles`: `:host { display: block }`, the `.pagination` rules from `docs/design-system/assets/components.css` (without the `.pagination-row` alias), plus `.pagination__ellipsis`, `.pagination--simple`, the window media queries, tabular figures and the forced-colours outline (D-3, D-4, D-6, D-9). `components.css` and the design-system page gain these in the same slice.
- Development check (D-8): `page` outside 1…`pageCount` logs `console.error` naming `hp-pagination` when `isDevMode()`.
- Imports `RouterLink` and the icon component: `<svg hp-icon name="chevron-left" size="sm">` and `name="chevron-right"` in the simple variant. No CDK primitive. Does not use the button component: the design system's pagination items are their own anchors, not `.btn`.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Pagination.ts`, exported from `src/scenarios/index.ts`, with iterations added to `e2e/perf-test/config/scenario-iterations.mjs`; it provides a router so `routerLink` resolves.

## Decisions

- **D-1** *Element or attribute selector, and does it reuse the button component?* Element: `hp-pagination`, a composite of landmark, summary and items, with the design system's class on the inner `<nav>`. It does not use `button[hp-button]`/`a[hp-button]`: the design system's markup and `components.css` style pagination items as plain anchors under `.pagination` (32 px, muted, accent-subtle current), not `.btn`.
- **D-2** *Links or buttons, and how are URLs built?* Links to the current route with the page in a query parameter, as the design system requires ("each page has its own URL, so `?page=2` can be bookmarked"). `queryParamsHandling: 'merge'` keeps the search, category, style and filters, which L2-002 and L2-005 require when paging; page 1 removes the parameter so the first page has one canonical URL. `queryParam` lets a second pagination on the same page (reviews) page independently.
- **D-3** *How is the "…" rendered?* `<span class="pagination__ellipsis" aria-hidden="true">…</span>`, a 32 px muted box. The design system specifies a non-interactive "…" but no class or markup. Hidden from assistive technology because the jump in numbers already conveys the gap and "dot dot dot" adds noise.
- **D-4** *Which pages show at which width?* From 768 px: first, last and the current page ± 2 (the design system's rule). Below 768 px: first, current and last. The design system says "below 640px show at most five numbers (first, current ±1, last) so the row fits at 360px", but measured in Chromium the ±1 window ("Previous 1 … 6 7 8 … 42 Next") needs 387 px and wraps "Next" at 360 px (328 px of content), while the current-only window needs 315 px and fits. Measured at 640 px (608 px of content) the wide window plus the inline summary wraps "Next" for middle pages, while at 768 px it fits. So the narrow window keeps the design system's stated goal, one row at 360 px, and the switch moves to `--layout-breakpoint-md`. Both windows are in the DOM and CSS chooses (`.pagination__wide`, `.pagination__narrow`), so server rendering is final at every width.
- **D-5** *What replaces a gap of exactly one page?* That page's number. An ellipsis takes the same 32 px as a number, so showing "2" instead of "…" costs no width and saves a click.
- **D-6** *The design system's simple example keeps the summary inline with an inline `style` attribute. How does the component do it?* With a `.pagination--simple` modifier that sets the summary's `flex-basis: auto; margin: 0` at every width, so the arrows always flank the summary.
- **D-7** *The mocks link "Previous" and "1" to the same page and leave "Previous" live on page 1. Which wins?* The design system, which records it as drift: the unavailable end is `<a role="link" aria-disabled="true">` with no `href`, kept in place so the layout does not jump. The current page stays a link with `aria-current="page"`, as in the design-system code sample.
- **D-8** *What happens with one page, or a page outside the range?* One page or fewer renders nothing: there is nowhere to go and the design system uses pagination only when there is more than one screen. An out-of-range `page` is clamped for rendering and logs a development error naming `hp-pagination`, so a bad URL (`?page=50`) still shows a usable control.
- **D-9** *Two rules the stylesheet lacks: tabular figures and forced colours.* The design system's content rule says numbers use tabular figures; the component sets `font-variant-numeric: tabular-nums` on items and summary so widths do not shift between pages. In forced colours, measured in Chromium, every item is drawn with the same `LinkText` border and the current page's fill disappears, so it cannot be told apart; the component adds a `--border-width-thick` `Highlight` outline to `[aria-current="page"]`, the rule `components.css` already applies to the current nav link, the selected tab and the pressed chip.

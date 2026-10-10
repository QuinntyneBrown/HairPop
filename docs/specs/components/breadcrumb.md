# Breadcrumb

| Field | Value |
|---|---|
| Selector | `hp-breadcrumb` |
| Library path | `frontend/projects/components/src/lib/breadcrumb/` |
| Status | planned |
| Traces to | L2-041, L2-042 |
| Design system | [`breadcrumb.html`](../../design-system/components/breadcrumb.html) |
| Source mocks | [`pages/style-detail/default`](../../mocks/pages/style-detail/default.html), [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html), [`pages/appointment-detail/default`](../../mocks/pages/appointment-detail/default.html), [`pages/matching-braiders/default`](../../mocks/pages/matching-braiders/default.html) |
| Rendering | [`breadcrumb.html`](breadcrumb.html) |

## Purpose and scope

A breadcrumb shows where a detail page sits and gives one tap back to its parent list: Styles › Knotless braids, Braiders › Nia Okafor, Appointments › HP-1048. It sits at the top of a detail page, directly above the page header, as a `<nav>` landmark holding an ordered list of ancestor links followed by the current page, unlinked and marked `aria-current="page"`. From 768 px it shows the full path; below 768 px it collapses to one back link to the parent, with a leading chevron.

Use something else when:

- the page is top-level (Styles, Braiders, Appointments, Help) or an auth or error page: no breadcrumb (design-system *Overview*);
- the control moves between screens of equal rank: that is the top bar's primary navigation;
- the customer needs the history of how they arrived: the browser's Back button; a breadcrumb shows hierarchy only.

Out of scope:

- Which pages carry a breadcrumb and what their trail is. Each detail page builds its `trail` and `current` from its own data; the component renders them.
- Hiding data the customer may not see. A page that ends in an error destination (`pages/forbidden`, `pages/not-found`) renders no breadcrumb, so an appointment reference such as "HP-1048" never appears for a resource the customer cannot open (L2-037 is the page's rule).
- The page header beneath it and the spacing between them (`.product-main > * + *` supplies `--space-6`).
- Routing: the component renders `routerLink` from each trail item; route definitions are the application's.

## Usage

The design system adds a breadcrumb to each detail page (D-7), and the detail mocks render it above the page header. Every configuration:

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/style-detail` (all states that render the style: default, edge, offline, partial) | `trail` [Styles], `current` style name | "Styles" › "Knotless braids" | default, hover, focus, current; collapsed below 768 px to "‹ Styles" | canvas, above the page header |
| `pages/braider-profile` (default, empty, edge, offline, partial) | `trail` [Braiders], `current` braider name | "Braiders" › "Nia Okafor" | default, hover, focus, current; collapsed "‹ Braiders" | canvas |
| `pages/appointment-detail` (default, empty, offline, partial, success) | `trail` [Appointments], `current` request reference | "Appointments" › "HP-1048" | default, hover, focus, current; collapsed "‹ Appointments" | canvas |
| `pages/matching-braiders` for a selected style (default, empty, no-results, long, edge, offline; design-system *Anatomy*) | `trail` [Styles, Knotless braids], `current` "Braiders" | "Styles" › "Knotless braids" › "Braiders" | default, hover, focus, current; collapsed "‹ Knotless braids" | canvas |
| Loading and error states of those pages | not rendered while the page's own data is loading or failed | — | — | — |

Every row is buildable with the API below: a `label`, a `trail` of one or more ancestor links, and the `current` page's name.

## Anatomy

1. **Landmark** — `<nav class="breadcrumb" aria-label="Breadcrumb">` inside the host. The class is on the `<nav>` as in the design-system code sample.
2. **List** — `<ol>`, a wrapping flex row with `--space-2` gaps, `--text-body-sm`, `--color-fg-muted`.
3. **Ancestor link** — `<li><a href>`; `--color-fg-muted`, no underline at rest, underline and `--color-fg-default` on hover, `inline-flex` with a `--target-min` (24 px) minimum height.
4. **Separator** — "/" drawn by `li + li::before` with empty alternative text (`content: "/" / ""`), `--color-fg-subtle`; never in the DOM text, never read.
5. **Current page** — `<li><span aria-current="page">`; `--color-fg-default`, `--font-weight-medium`; not a link.
6. **Back chevron (collapsed only)** — a small chevron-left `svg.icon.icon--sm[aria-hidden="true"]` at the start of the parent link (the last ancestor). Rendered always, shown only below 768 px.

Host: `hp-breadcrumb` is an element selector because the component is a composite of landmark, list and items (D-1). The host is `display: block` and carries no classes; everything the e2e tests locate is inside it.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes (`input.required`) | The landmark's `aria-label`: "Breadcrumb". Copy, so it is an input (no hard-coded strings). |
| `trail` | `readonly BreadcrumbLink[]` | — | yes (`input.required`) | The ancestors from the top of the hierarchy down to the parent, at least one. `BreadcrumbLink` is `{ label: string; link: string \| readonly unknown[] }`; `link` is passed to `routerLink`. An empty trail logs a development error and renders nothing (D-8). |
| `current` | `string` | — | yes (`input.required`) | The current page's name, matching its `<h1>` topic: "Nia Okafor", "HP-1048". |

- Inputs are signal inputs. `BreadcrumbLink` is exported from the library's public API.
- Every string is an input: the landmark label, the section names ("Styles", "Braiders", "Appointments") and the data values (style and braider names, references). The component renders no copy.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | Links navigate through the router; nothing else happens. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | The structure (landmark, ordered list, separators, `aria-current`, collapse) is the component's contract, so items arrive as data, not projected nodes (D-2). |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Full path | — | From 768 px (`--layout-breakpoint-md`): every ancestor, then the current page. |
| Collapsed to parent | — (media query, no class) | Below 768 px: the parent link alone with a leading chevron; the current page is already the `<h1>`. |

The two variants are the same DOM at different widths (D-3); the consumer never chooses.

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One size | — | link targets `--target-min` (24 px) | none; `--space-2` gaps | `--text-body-sm` (14 px) |

Width comes from the items; the row wraps onto further lines instead of truncating.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (ancestor) | — | `--color-fg-muted`, no underline | Link named by its label |
| Hover | `:hover` | `--color-fg-default`, underlined | — |
| Focus | `:focus-visible` | Shared ring: `--focus-ring-width` of `--color-focus-ring`, offset `--focus-ring-offset` | — |
| Active | `:active` | Same as hover (design-system *States*) | — |
| Current | `aria-current="page"` on a `<span>` | `--color-fg-default`, `--font-weight-medium`; no hover or focus | "current page"; not in the Tab order |
| Collapsed | viewport below 48 rem | Only the parent item shows, with its chevron and no separator; the other items are `display: none` | The list has one item; the hidden items are out of the accessibility tree |
| Long path | items wider than the row | The row wraps onto a second line; nothing truncates | Unchanged |
| Forced colours | `(forced-colors: active)` | Links `LinkText`, current page and separators `CanvasText`; focus ring `Highlight` | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | No change: nothing animates | — |

Breadcrumb links are never disabled; there is no loading or error state of its own (the page does not render it until its data has loaded).

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: two levels (Nia Okafor's profile) -->
<hp-breadcrumb>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <ol>
      <li><a href="/braiders"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>Braiders</a></li>
      <li><span aria-current="page">Nia Okafor</span></li>
    </ol>
  </nav>
</hp-breadcrumb>
```

```html
<!-- rendered: three levels (braiders for Knotless braids); only the parent link carries the chevron -->
<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol>
    <li><a href="/styles">Styles</a></li>
    <li><a href="/styles/knotless-braids"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>Knotless braids</a></li>
    <li><span aria-current="page">Braiders</span></li>
  </ol>
</nav>
```

The collapsed variant is the same DOM: below 768 px the stylesheet hides every item except the parent (the second-last `<li>`) and its separator, and shows the chevron; from 768 px the chevron is hidden.

Consumer templates:

```html
<!-- consumer: braider profile -->
<hp-breadcrumb label="Breadcrumb" [trail]="[{ label: 'Braiders', link: '/braiders' }]" [current]="braider().name" />

<!-- consumer: appointment detail -->
<hp-breadcrumb label="Breadcrumb" [trail]="[{ label: 'Appointments', link: '/appointments' }]" [current]="appointment().reference" />

<!-- consumer: braiders for a style -->
<hp-breadcrumb
  label="Breadcrumb"
  [trail]="[{ label: 'Styles', link: '/styles' }, { label: style().name, link: ['/styles', style().slug] }]"
  current="Braiders" />
```

Free to change: whitespace between elements. The chevron's position as the first child of the parent link is fixed.

## Design

- Row: `display: flex; flex-wrap: wrap; align-items: center; gap: --space-2`; no list markers, padding or margin.
- Items: `inline-flex`, centred, `--space-2` gap between the separator and the item.
- Typography: `--text-body-sm`; current page `--font-weight-medium`.
- Links: `inline-flex`, `align-items: center`, `min-height: --target-min`, `text-decoration: none` at rest, `underline` on hover.
- Chevron: `.icon--sm` (1 rem), stroked in `currentColor`, directly before the label as the design system draws it.
- Collapse (D-3), mobile-first in `components.css`: by default `li:nth-last-child(n+3)` (ancestors above the parent) and `li:last-child:not(:only-child)` (the current page) are `display: none` and the parent's `::before` separator is removed; `@media (min-width: 48rem)` shows them again, restores the parent's separator and hides `.breadcrumb li:not(:only-child) a .icon`. A one-item list (a documentation specimen) is never collapsed. 48 rem is `--layout-breakpoint-md`; media queries cannot read custom properties, so the value is written as the stylesheet writes its other breakpoints.
- Shape, elevation, layer and motion: none.
- The breadcrumb declares no component tokens; theme it through the semantic tier (design-system *Theming*).

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Ancestor link, list text | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Separator | `--color-fg-subtle` | `--palette-gray-500` | `--palette-gray-400` |
| Current page, link hover | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Page behind it | `--color-bg-canvas` | `--palette-gray-50` | `--palette-gray-950` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Ancestor link |
| `--color-fg-subtle` | `--color-bg-canvas` | 4.5:1 | Separator (the design system holds it to text contrast) |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Current page and hovered link |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring |

Forced colours: the browser paints links `LinkText` and the current page and separators `CanvasText` (measured in Chromium), so the current page stays distinct without an extra rule; the tokens map the ring to `Highlight`.

## Responsive behaviour

- **Below 768 px**: only the parent link, with a leading chevron ("‹ Knotless braids"). It stays inside the `<nav aria-label="Breadcrumb">`. Measured in Chromium at 360 px: the accessibility tree holds one list item with the link "Knotless braids"; the hidden items and separators are absent.
- **From 768 px**: the full path, chevron hidden. Long paths wrap onto a second line rather than truncating.
- Text enlarged to 200 % moves the 48 rem breakpoint to 1536 px, so most screens show the collapsed parent link, which wraps inside the viewport if its label is longer than the row.
- Targets: links are at least 24 px tall (`--target-min`) with `--space-2` between items; on phones the single parent link sits alone above the page header.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available.

## Accessibility

### Role and pattern

[APG Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/): a `<nav>` landmark labelled "Breadcrumb" containing an ordered list; the current page carries `aria-current="page"`. One breadcrumb per page. Separators are CSS content with empty alternative text, so they are not read.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the visible ancestor links; the current page is skipped. |
| <kbd>Enter</kbd> | Follows the link. |

### Focus

The shared ring around each link: `--focus-ring-width` of `--color-focus-ring`, offset `--focus-ring-offset`. Focus never lands on the current page or a separator. Collapsed, the only stop is the parent link.

### Labelling

- The landmark is labelled by `label` ("Breadcrumb").
- Link text is the destination's topic ("Nia Okafor", not "Nia’s profile page"); the chevron is `aria-hidden`, so the collapsed link is named "Knotless braids".
- The current page is announced with its name and "current page".

### Announcements

None. The breadcrumb never changes while the page is open.

### Motion

None; colour and underline change instantly.

## Content and internationalisation

- Each item is the short name of its page in sentence case: "Styles", "Knotless braids", "Nia Okafor", "HP-1048". No "Home": Styles is HairPop's home.
- The last item matches the page's `<h1>` topic.
- Translatable content: `label` and the section names in `trail` ("Styles", "Braiders", "Appointments") and `current` ("Braiders"). Data values: style names, braider names, request references.
- Long names wrap; nothing truncates.

## Performance

- Change detection: `OnPush`; signal inputs; the template loops over `trail()` with `@for` tracked by index and marks the last ancestor with `$last`.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Breadcrumb.ts` renders the three-level breadcrumb for Knotless braids, `trail` [Styles, Knotless braids] and `current` "Braiders"; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: the collapse is CSS, so the server-rendered page already has the final layout at every width; nothing re-renders after hydration.
- Weight: `@angular/core`, `RouterLink` and the icon component. No CDK, no breakpoint observer.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given Nia Okafor's profile at 1280 px, when the breadcrumb renders with `trail` [Braiders] and `current` "Nia Okafor", then the DOM holds `nav.breadcrumb[aria-label="Breadcrumb"] > ol` with two items, a link "Braiders" and `<span aria-current="page">Nia Okafor</span>`. (L2-041)
- **AC-2** Given the braiders page for Knotless braids at 1280 px, when the breadcrumb renders, then it reads "Styles / Knotless braids / Braiders", the two separators are drawn by CSS, and the text content of the list contains no "/" character. (L2-041)
- **AC-3** Given the appointment detail page for HP-1048, when the breadcrumb renders, then the current item "HP-1048" is a `<span>`, not a link, in `--color-fg-default` at `--font-weight-medium`, and "Appointments" is a link in `--color-fg-muted` with no underline. (L2-041)
- **AC-4** Given any breadcrumb link, when it is measured, then it is at least 24 px tall and at least 8 px from its neighbour. (L2-041)
- **AC-5** Given an empty `trail` in development mode, when the breadcrumb initialises, then the console reports an error naming `hp-breadcrumb` and nothing is rendered. (L2-041)

### States

- **AC-6** Given the "Styles" link, when the pointer hovers or presses it, then its colour becomes `--color-fg-default` and it is underlined, with contrast at least 4.5:1 against `--color-bg-canvas`. (L2-041)

### Keyboard and focus

- **AC-7** Given the three-level breadcrumb at 1280 px, when the customer presses Tab through it, then focus visits "Styles" then "Knotless braids" and moves on without stopping on "Braiders", and Enter on "Knotless braids" opens the style. (L2-041)
- **AC-8** Given a breadcrumb link focused by keyboard, when the ring shows, then it is a 2 px `--color-focus-ring` outline offset 2 px with contrast at least 3:1 against `--color-bg-canvas`. (L2-041)

### Screen readers

- **AC-9** Given the three-level breadcrumb at 1280 px, when a screen reader reads it, then it announces a navigation landmark "Breadcrumb", a list of 3 items, the links "Styles" and "Knotless braids", and "Braiders" as the current page, and reads no separator. (L2-041)

### Theming

- **AC-10** Given the breadcrumb, when the theme switches from light to dark, then links change from grey 600 to grey 350, the separator from grey 500 to grey 400 and the current page from grey 900 to grey 150 without a reload. (L2-042)
- **AC-11** Given the breadcrumb in either theme, when contrast is measured on `--color-bg-canvas`, then links, separators and the current page are each at least 4.5:1. (L2-041)
- **AC-12** Given Windows forced colours, when the breadcrumb renders, then the links use the system link colour and the current page the system text colour, so the current page stays distinct. (L2-041)

### Responsive

- **AC-13** Given Nia's profile at 360 px, when the breadcrumb renders, then only the link "Braiders" shows, preceded by a chevron-left icon, with no separator and no current item, and the accessibility tree holds a list of one item. (L2-042)
- **AC-14** Given the braiders page for Knotless braids at 360 px, when the breadcrumb renders, then the only visible item is the parent link "Knotless braids" with its chevron, named "Knotless braids". (L2-042)
- **AC-15** Given the three-level breadcrumb at 768 px, when it renders, then the full path shows, no chevron is visible, and it fits or wraps within the content width without horizontal scrolling. (L2-042)
- **AC-16** Given a 320 px viewport with text enlarged to 200 %, when the collapsed breadcrumb "‹ Knotless braids" renders, then it stays inside the viewport, wrapping if needed, and the page does not scroll horizontally. (L2-042)

### Motion

Nothing in the breadcrumb animates, so it has no motion criterion; colour and underline changes are instant in every motion setting.

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/breadcrumb/`; file `breadcrumb.ts` exporting the standalone component `Breadcrumb` (`selector: 'hp-breadcrumb'`, `changeDetection: OnPush`) and the `BreadcrumbLink` type; export both from the library's `public-api.ts`.
- Template: `<nav class="breadcrumb" [attr.aria-label]="label()"><ol>@for (item of trail(); track $index) { <li><a [routerLink]="item.link">@if ($last) { <svg hp-icon name="chevron-left" size="sm" /> }{{ item.label }}</a></li> }<li><span aria-current="page">{{ current() }}</span></li></ol></nav>`, wrapped in `@if (trail().length)`.
- Scoped `styles`: `:host { display: block }` and the `.breadcrumb` rules from `docs/design-system/assets/components.css`, including the collapse rules (D-3).
- Development check (D-8): in `ngOnInit`, an empty `trail` logs `console.error` naming `hp-breadcrumb` when `isDevMode()`.
- Imports `RouterLink` and the icon component. No CDK primitive.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Breadcrumb.ts`, exported from `src/scenarios/index.ts`, with iterations added to `e2e/perf-test/config/scenario-iterations.mjs`; it provides a router with the scenario's routes so `routerLink` resolves.

## Decisions

- **D-1** *Element or attribute selector?* Element: `hp-breadcrumb`. The component is a composite (landmark, list, items, separators, collapse rules), no container rule in `components.css` targets the breadcrumb as a direct child, and the design system's class sits on the inner `<nav>` exactly as rendered.
- **D-2** *Are the items projected or passed as data?* Data: `trail` and `current`. The breadcrumb's correctness lives in its structure: an ordered list, the current item as an unlinked `aria-current` span, only the parent carrying the chevron, and the collapse keyed to the second-last item. Projected items would let a consumer break any of those, as the design system's don't ("link the current page to itself") shows.
- **D-3** *How does it collapse below 768 px: by re-rendering or by CSS?* By CSS. The full DOM renders at every width; below 48 rem a media query hides every item but the parent and the parent's separator, and from 48 rem the chevron is hidden. Server-rendered pages then have the right layout at first paint, nothing changes after hydration, and `display: none` removes the hidden items from the accessibility tree, as measured in Chromium (one list item at 360 px, three at 800 px). The rules live in `components.css`, written mobile-first.
- **D-4** *Do breadcrumb links inherit and "stay underlined" like links in alerts and the footer, or are they muted with no underline until hover?* Muted with no underline until hover, as the breadcrumb page and `components.css` draw them; they are the specific source for this component and the only one that renders breadcrumb links. The breadcrumb therefore renders plain anchors styled by `.breadcrumb a`, not the link component. WCAG 1.4.1 is met because the items sit in a labelled navigation list, where links are identified by context, and the one non-link item differs by weight and colour.
- **D-5** *Does the collapsed link say "Back to …"?* No. The design system's collapsed example names the destination only ("Knotless braids") and the chevron is decorative; "Back to" would also break the rule that link text is the destination's topic.
- **D-6** *Where does the chevron go when the trail has one ancestor?* On that ancestor, which is the parent. The chevron is rendered on the last trail item only, so in the full path at 768 px and wider it is hidden and never sits in the middle of a path.
- **D-7** *The first mocks' detail pages had no breadcrumb. Which wins?* The design system, which records the missing path back as drift fixed during extraction and puts one on style detail, braider profile and appointment detail, plus the braiders-for-a-style page in its anatomy example. The detail mocks now render it.
- **D-8** *What does an empty `trail` render?* Nothing, with a development-mode error naming `hp-breadcrumb`. A breadcrumb without a parent has no purpose (the design system skips it on top-level pages), so the consumer's mistake is surfaced instead of rendering a lone current-page span.

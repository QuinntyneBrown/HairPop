# Container, grid and stack

| Field | Value |
|---|---|
| Selector | `hp-app-shell`; global layout classes `.container`, `.container--narrow`, `.product-main`, `.section`, `.stack`, `.cluster`, `.grid`, `.grid--auto`, `.span-full`, `.feature-grid`, `.detail-grid` |
| Library path | `frontend/projects/components/src/lib/container/` |
| Status | built |
| Traces to | L2-041, L2-042 |
| Design system | [`container.html`](../../design-system/components/container.html) |
| Source mocks | [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`pages/matching-braiders/default`](../../mocks/pages/matching-braiders/default.html), [`pages/style-detail/default`](../../mocks/pages/style-detail/default.html), [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html), [`pages/appointment-detail/default`](../../mocks/pages/appointment-detail/default.html), [`pages/my-appointments/default`](../../mocks/pages/my-appointments/default.html), [`pages/booking-request/default`](../../mocks/pages/booking-request/default.html), [`pages/help/default`](../../mocks/pages/help/default.html), [`dialogs/filter-braiders/default`](../../mocks/dialogs/filter-braiders/default.html) |
| Rendering | [`container.html`](container.html) |

## Purpose and scope

The layout primitives place everything else on every HairPop screen. The app shell keeps the top bar above the page, the footer at the bottom of the window, and the page's content in one main landmark. The container centres content, caps it at 1280 px (608 px for narrow forms) and applies the page margins. Stacks and clusters space siblings vertically and in wrapping rows. The grids divide the width: a token-driven 4, 8 or 12 column grid, an auto-fill card grid, the 1 → 2 → 3 column feature grid of the style gallery and matching braiders, and the 2:1 detail grid of style detail, braider profile and appointment detail. Spacing and columns come from the layout tokens and change in one place at each breakpoint.

This CRD specifies two kinds of deliverable (D-1):

- **One Angular component**, `hp-app-shell`, which renders the shell and the main landmark;
- **Global layout utility classes** in one library stylesheet, `layout.css`, for the container, stacks, clusters and grids, because they have no behaviour, no DOM of their own and are combined with other blocks on the same element (`card stack`, `form stack`, `dialog__body stack`, `section feature-grid`).

Use something else when:

- the content needs a surface, edge or padding: use a card ([card.md](card.md));
- a group needs a visible separator: use a divider ([divider.md](divider.md));
- a form needs its field rhythm and action row: use the form-layout component's `.form-panel` and `.form-actions`.

Out of scope:

- The top bar, footer, skip link and page header. Their CRDs own them; the shell places the top bar and footer in its slots, and the skip link sits before the shell.
- Hiding the shell while a modal dialog is open. The CDK Dialog marks the shell `aria-hidden` and traps focus (dialog CRD); the mocks' `inert` on `.product-shell` is that behaviour, not the shell's.
- Moving focus after a route change. The router integration owns it.
- Choosing a grid for a screen and ordering its content. The page decides; the primitives only lay out what they are given, in DOM order.
- Base typography, `scroll-padding-top` on `html` and the prose measure on `p`. They are foundation styles loaded with the tokens; the shell relies on them.

## Usage

Inventory: `usage_inventory.py docs/mocks container`, `… stack`, `… cluster`, `… feature-grid`, `… detail-grid`, plus a search for `product-shell`, `grid`, `span-full`, `section` and `container--narrow`.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Every page, dialog and notification mock (181 files) | `.product-shell` holding `header.topbar`, `main#main.container.product-main`, `footer.site-footer`; the skip link "Skip to content" before it | top bar "✦ HairPop" with Styles, Braiders, Appointments, Help, "Updates" and "Maya"; footer "HairPop · Made for confident hair decisions", Terms, Privacy | default; `inert` + `aria-hidden` while a dialog is open (dialog CRD) | canvas |
| `pages/style-gallery/*`, `pages/matching-braiders/*`, `pages/help/default` | `.feature-grid` of story cards (in `section.stack` on the gallery) | three cards: Knotless braids, Passion twists, Cornrows; Nia Okafor, Aisha Mensah, Jules Baptiste; three help topics | 1 → 2 → 3 columns | canvas |
| `pages/*/loading` (style gallery, matching braiders, appointment detail, my appointments, notification center) | `section.feature-grid aria-label="Loading content"` of skeleton cards | skeletons | loading (shape drift, card CRD D-10) | canvas |
| `pages/style-detail/*` | `.detail-grid`: `section.card` main, `aside.card` | "What to expect"; "Make it yours" | stacked below 768 px | canvas |
| `pages/braider-profile/*` | `.detail-grid` whose main column is a `section.stack` of two cards | profile card and "Customer reviews"; aside "Before you book" | stacked below 768 px | canvas |
| `pages/appointment-detail/*`, and the dialogs opened from it | `.detail-grid`: `section.card.stack` main with a `.cluster` of actions, `aside.card` | "Medium knotless braids" with "Request a change" and "Cancel request"; "Prepare for your visit" | stacked below 768 px | canvas |
| `pages/my-appointments/*`, `pages/notification-center/*` | `section.stack` of row cards or cards | HP-1048, HP-0992 rows | default | canvas |
| Every form page and form dialog | `form.stack` (fields 16 px apart) inside `.form-panel`; `.dialog__body.stack` | "Your details", "Details" | default, invalid, submitting | surface |
| Inside story cards | `div.stack` holding eyebrow, title, summary, link | "Most explored", "Knotless braids" | default | surface |
| Design system *Stack and cluster* | `.stack`, `.stack--sm`, `.stack--lg`; `.cluster`, `.cluster--between` (pagination summary "Showing 1–3 of 126" with "Next", the table's bulk bar "1 selected"), `.cluster--end` | chips "All styles", "Braids", "Twists", "Locs" | wraps | any |
| Design system *Auto grid and spans* | `.grid.grid--auto` of cards at least 288 px wide; `.grid` with a `.span-full` child | Nia Okafor, Aisha Mensah, Jules Baptiste; "Full-width notice" | 4 / 8 / 12 columns | canvas |
| Design system *Sizes* | `.container--narrow` (608 px) for auth and form-only pages; `.section` (32 px block margin) | sign in, booking request | default | canvas |

Every row is buildable with `hp-app-shell` (top bar, main, footer, optional narrow main) and the global classes, which combine freely with other blocks on the same element.

## Anatomy

### App shell (`hp-app-shell`)

1. **Shell** — `.product-shell` on the host: a flex column at least `100dvh` tall, so the footer sits at the bottom of a short page.
2. **Top bar slot** — `[slot=topbar]`: the top bar component, first in the shell.
3. **Main** — `<main id="main" class="container product-main">`, rendered by the shell: the page's only main landmark and the skip link's target; grows to fill the shell (`flex: 1`); padding `--space-6` above (`--space-8` from 768 px) and `--space-12` below; `--space-6` between its top-level blocks.
4. **Footer slot** — `[slot=footer]`: the footer component, last in the shell.

### Layout classes (`layout.css`)

5. **Container** — `.container`: `width: 100%`, `max-width: var(--layout-container-max)` (1280 px), centred, `padding-inline: var(--layout-margin)` (16 → 32 → 48 px). `.container--narrow`: `max-width: var(--layout-form-max)` (608 px).
6. **Stack** — `.stack`: flex column, gap `--space-4` (16 px); `.stack--sm` `--space-2` (8 px); `.stack--lg` `--space-8` (32 px).
7. **Cluster** — `.cluster`: wrapping flex row, gap `--space-3` (12 px), items centred; `.cluster--between` and `.cluster--end` align the row.
8. **Grid** — `.grid`: `--layout-columns` equal tracks (`minmax(0, 1fr)`) with `--layout-gutter` gaps; `.grid--auto` fills with tracks at least `--layout-card-min` (288 px, never wider than the container); `.span-full` spans every column.
9. **Feature grid** — `.feature-grid`: one column, two from 768 px, three from 1024 px, gap `--space-4`.
10. **Detail grid** — `.detail-grid`: one column; from 768 px a `2fr` main track and an aside track of at least `--layout-sidebar-width` (256 px); gap `--space-4`; items aligned to the start.
11. **Section** — `.section`: `--space-8` block margin for a page section.

Host: `hp-app-shell` is an element (a composite that renders the main landmark); its host carries `.product-shell`. The layout classes are not components and have no host.

## API

### `hp-app-shell` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `narrow` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.container--narrow` to the main element, capping the page at `--layout-form-max` (608 px) with the same margins. For form-only and auth pages; a route sets it from its data. |

- The main element's `id` is always `main` (the skip link's `href="#main"`); it is not an input.
- The input is a signal input. The shell renders no copy.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | The shell and the layout classes are not interactive. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `[slot=topbar]` | The top bar (`<header class="topbar">` from the top-bar component) | Declared once, before the main element. |
| default | The page: a `<router-outlet>` in the application, or static content | Declared once, inside the main element. Top-level blocks of the routed page are spaced `--space-6` apart (D-3). |
| `[slot=footer]` | The footer (`<footer class="site-footer">` from the footer component) | Declared once, after the main element. |

### Global layout classes

| Class | Combines with | Rule |
|---|---|---|
| `.container`, `.container--narrow` | `main`, any block | Width cap and page margins. |
| `.product-main` | the shell's main element | Main padding and the `--space-6` rhythm between top-level blocks. |
| `.section` | `section` | `--space-8` above and below. |
| `.stack`, `.stack--sm`, `.stack--lg` | `section`, `form`, `div`, a card host, `.dialog__body` | Vertical flow with one gap; children keep their own width (stretch). |
| `.cluster`, `.cluster--between`, `.cluster--end` | `div`, a card's action row | Wrapping row; items 12 px apart in both directions. |
| `.grid`, `.grid--auto`, `.span-full` | `div`, `section`, `ul` | Token-driven columns. |
| `.feature-grid` | `div`, `section` (with `aria-label` when it is a region) | Card grid, 1 → 2 → 3 columns. |
| `.detail-grid` | `div` | Main and aside; the first child is the main column, the second the aside. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Container | `.container` | Every product page (the shell's main). |
| Narrow container | `.container--narrow` | Auth and form-only pages. |
| Stack small / default / large | `.stack--sm` / `.stack` / `.stack--lg` | Label groups / fields and card content / page sections. |
| Cluster start / between / end | `.cluster` / `--between` / `--end` | Buttons and chips / a count with its action / trailing actions. |
| Grid / auto grid | `.grid` / `.grid--auto` | Column layouts / as many 288 px cards as fit. |
| Feature grid | `.feature-grid` | Style gallery, matching braiders, help topics. |
| Detail grid | `.detail-grid` | Style detail, braider profile, appointment detail. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| Container | `.container` | — | `--layout-margin` inline; max `--layout-container-max` | — |
| Narrow | `.container--narrow` | — | same; max `--layout-form-max` | — |
| Stack gaps | `--sm` / default / `--lg` | — | `--space-2` / `--space-4` / `--space-8` | — |
| Cluster gap | — | — | `--space-3` | — |
| Grid gutter | — | — | `--layout-gutter` (16 → 24 → 32 px) | — |

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (XS, below 768 px) | viewport below `--layout-breakpoint-md` | 4 columns, 16 px gutters and margins; feature grid 1 column; detail grid stacked, main first; main padding 24 px top | Landmarks: banner, main, contentinfo |
| MD (768–1023 px) | `min-width: 48rem` | 8 columns, 24 px gutters, 32 px margins; feature grid 2 columns; detail grid main + aside; main padding 32 px top | Unchanged |
| LG and up (1024 px and wider) | `min-width: 64rem` | 12 columns, 32 px gutters, 48 px margins; feature grid 3 columns | Unchanged |
| XL (1280 px and wider) | viewport wider than `--layout-container-max` | Content stays 1280 px wide, centred | Unchanged |
| Enlarged text | browser text size 200 % | Media queries are in rem, so the layout follows the text: at 1280 px the feature grid is one column and the detail grid stacked | Unchanged |
| Short page | content shorter than the window | Footer at the bottom of the window | — |
| Dialog open | CDK Dialog | Shell unchanged visually under the backdrop | Shell hidden from assistive technology by the dialog |

The primitives have no interactive states and draw no colour; themes do not change them.

## Markup

Rendered DOM. The classes, the `main#main` landmark and the order of the shell's children are the e2e contract.

```html
<!-- rendered: application shell on the style detail page -->
<a class="skip-link" href="#main">Skip to content</a>
<hp-app-shell class="product-shell">
  <header class="topbar">…</header>
  <main id="main" class="container product-main">
    <router-outlet></router-outlet>
    <app-style-detail-page>
      <hp-page-header class="page-header">…<h1>Knotless braids, your way</h1>…</hp-page-header>
      <div class="detail-grid">
        <section class="card" aria-labelledby="expect-title">…</section>
        <aside class="card" aria-labelledby="yours-title">…</aside>
      </div>
    </app-style-detail-page>
  </main>
  <footer class="site-footer">…</footer>
</hp-app-shell>
```

```html
<!-- rendered: narrow main for sign in -->
<main id="main" class="container product-main container--narrow">…</main>
```

```html
<!-- rendered: gallery collection -->
<section class="stack">
  <div class="filter-row">…</div>
  <div class="chip-row">…</div>
  <div class="feature-grid">
    <article class="card story-card">…Knotless braids…</article>
    <article class="card story-card">…Passion twists…</article>
    <article class="card story-card">…Cornrows…</article>
  </div>
</section>
```

```html
<!-- rendered: stack, cluster, auto grid with a full-width item -->
<section class="card stack" aria-labelledby="appointment-title">
  …
  <div class="cluster">
    <button class="btn" type="button">Request a change</button>
    <button class="btn btn--link" type="button">Cancel request</button>
  </div>
</section>
<div class="cluster cluster--between"><span class="text-muted">Showing 1–3 of 126</span><a class="btn btn--sm" href="/appointments?page=2">Next</a></div>
<div class="grid grid--auto">
  <div class="card">Nia Okafor</div><div class="card">Aisha Mensah</div><div class="card">Jules Baptiste</div>
</div>
<div class="grid"><div class="card span-full">Full-width notice</div></div>
```

Consumer templates:

```html
<!-- consumer: application root -->
<a hp-skip-link href="#main">Skip to content</a>
<hp-app-shell [narrow]="narrowRoute()">
  <header slot="topbar" hp-top-bar>…</header>
  <router-outlet />
  <footer slot="footer" hp-footer>…</footer>
</hp-app-shell>

<!-- consumer: a routed page (its host is display: block) -->
<hp-page-header>…</hp-page-header>
<div class="detail-grid">
  <section hp-card aria-labelledby="expect-title">…</section>
  <aside hp-card aria-labelledby="yours-title">…</aside>
</div>
```

The top bar (`header[hp-top-bar]`), footer (`footer[hp-footer]`), skip link (`a[hp-skip-link]`) and page header (`hp-page-header`) are specified by their own CRDs; the shell only requires that the top bar and footer carry `slot="topbar"` and `slot="footer"`.

## Design

- Shell: `min-height: 100dvh; display: flex; flex-direction: column`.
- Main: `flex: 1`; `padding-block: var(--space-6) var(--space-12)`, from 768 px `var(--space-8) var(--space-12)`; top-level blocks `margin-top: var(--space-6)` after the first, including the routed page's blocks (D-3).
- Container: `width: 100%; max-width: var(--layout-container-max); margin-inline: auto; padding-inline: var(--layout-margin)`; narrow `max-width: var(--layout-form-max)`.
- Stack: `display: flex; flex-direction: column; gap: var(--space-4)`; `--sm` `--space-2`; `--lg` `--space-8`.
- Cluster: `display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center`; `--between` `justify-content: space-between`; `--end` `justify-content: flex-end`.
- Grid: `display: grid; gap: var(--layout-gutter); grid-template-columns: repeat(var(--layout-columns), minmax(0, 1fr))`; auto `repeat(auto-fill, minmax(min(100%, var(--layout-card-min)), 1fr))`; `.span-full` `grid-column: 1 / -1`.
- Feature grid: `grid-template-columns: minmax(0, 1fr)`, gap `--space-4`; from `48rem` two columns, from `64rem` three.
- Detail grid: `grid-template-columns: minmax(0, 1fr)`, gap `--space-4`, `align-items: start`; from `48rem` `minmax(0, 2fr) minmax(var(--layout-sidebar-width), 1fr)`.
- Section: `margin-block: var(--space-8)`.
- Media queries are `min-width` only and written in rem (`48rem` for `--layout-breakpoint-md`, `64rem` for `--layout-breakpoint-lg`), because media queries cannot read custom properties; rem keeps them following the reader's text size.
- The responsive tokens `--layout-columns`, `--layout-gutter` and `--layout-margin` change at 768 and 1024 px in `tokens.css`; a denser product overrides them at `:root` and every grid follows.
- No colour, elevation, layer or motion. No component tokens.

## Colour

The primitives draw nothing: no background, border or text colour, and no tokens differ between themes. The canvas behind them is the body's `--color-bg-canvas` (`--palette-gray-50` in light, `--palette-gray-950` in dark), set by the base styles.

| Part | Token | Light | Dark |
|---|---|---|---|
| Page behind the shell | `--color-bg-canvas` | `--palette-gray-50` | `--palette-gray-950` |

Contrast pairs: none apply, because the primitives draw no foreground. The components placed in them carry their own pairs.

## Responsive behaviour

| Width | Columns | Gutter | Margin | Feature grid | Detail grid | Main top padding |
|---|---|---|---|---|---|---|
| 0–767 px | 4 | 16 px | 16 px | 1 column | stacked, main first | 24 px |
| 768–1023 px | 8 | 24 px | 32 px | 2 columns | `2fr` + aside of at least 256 px | 32 px |
| 1024 px and up | 12 | 32 px | 48 px | 3 columns | `2fr` + aside | 32 px |
| 1280 px and up | 12 | 32 px | 48 px, content centred at 1280 px | 3 columns | `2fr` + aside | 32 px |

Measured in Chromium: the feature grid has 1 column at 320 and 360 px, 2 at 768 px and 3 at 1024 and 1280 px; the detail grid is stacked at 320, 360 and 640 px and splits 432 px + 256 px at 768 px and 779 px + 389 px at 1280 px; no page scrolled horizontally at any of these widths. With the browser's text size at 200 % the feature grid is one column and the detail grid stacked at 768 and 1280 px, and the detail grid splits again at 1600 px (928 px + 512 px).

L2-042's five ranges (XS below 576, SM 576–767, MD 768–991, LG 992–1199, XL from 1200 px) are all usable with these two breakpoints: XS and SM share the single-column layout, MD and LG the two-column layouts (three columns from 1024 px), and XL the capped container (D-4).

## Accessibility

### Role and pattern

- The shell provides the landmarks: the top bar's `<header>` (banner), the one `<main id="main">`, the footer's `<footer>` (contentinfo). The detail grid's second column is an `<aside>` (complementary) named by its heading; a `<section>` used as a region is named with `aria-labelledby`.
- The layout classes are applied to elements that keep their own semantics; they add no roles.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Follows DOM order, which matches the visual order in every layout: the detail grid's main column comes before its aside in the DOM and on screen at every width. No `order` or grid placement reorders content (D-5). |

### Focus

- The shell and the primitives are not focusable.
- The skip link's target is `main#main`: after activating "Skip to content", the next Tab lands on the first focusable element in the main content.
- The base `scroll-padding-top` (top bar height plus `--space-4`) keeps a focused element clear of the sticky top bar when the page scrolls to it (WCAG 2.4.11).

### Labelling

A `<section>` or `<aside>` used as a region gets `aria-labelledby` pointing at its heading; a loading `.feature-grid` region says what is loading ("Loading styles"), not "Loading content".

### Announcements

None.

### Motion

None.

## Content and internationalisation

- Keep prose within `--layout-measure` (65 ch); paragraphs cap themselves in the base styles.
- Order content by importance in the DOM: the detail grid's main column first, the aside second; the page header before the collection.
- The primitives render no text, so there is nothing to translate; longer translated text reflows inside the same columns.

## Performance

- Change detection: `hp-app-shell` is `OnPush` with one signal input; its template has three projection points and no bindings except the narrow class.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/AppShell.ts` renders the shell around Maya's My appointments page (page header "My appointments" with "1 request awaiting a reply · 1 completed appointment.", and the HP-1048 and HP-0992 row cards), with the top bar and footer components in their slots; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- The layout classes are CSS only and have no scenario of their own; their render cost is measured in the composite scenarios that use them (`StoryCardGrid` for the feature grid, `AppointmentRows` for the stack, both in [card.md](card.md)).
- Regression rule: a change to the shell's template, input, styles or change detection, or to `layout.css`, is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: tracks are fractions of the container, so content that loads late does not change column widths; `minmax(0, …)` tracks keep long content from widening a column.
- Weight: no dependencies beyond `@angular/core`; `layout.css` is about 2 KB.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### App shell

- **AC-1** Given the application root with `<hp-app-shell>` holding the top bar, a `<router-outlet>` and the footer, when the style gallery route renders, then the shell's children are, in order, `header.topbar`, `main#main.container.product-main` and `footer.site-footer`, and the page has exactly one main landmark, one banner and one contentinfo. (L2-041)
- **AC-2** Given the style detail page, when Maya activates "Skip to content" and presses Tab, then focus lands on the first focusable element inside `main#main`, past the top bar's links. (L2-041)
- **AC-3** Given the not-found page, whose content is shorter than a 900 px tall window, when it renders, then the footer's bottom edge is at the bottom of the window. (L2-042)
- **AC-4** Given the style detail route, when it renders at 360 px, then the page header, the partial-data alert (in `partial`) and the detail grid are 24 px apart, main has 24 px of padding above the page header, and at 768 px that padding is 32 px. (L2-042)
- **AC-5** Given the sign-in route with `narrow` set, when it renders at 1280 px, then main has `container--narrow`, its content is at most 608 px wide and centred. (L2-042)
- **AC-6** Given any page at 1440 px, when it renders, then main's content box is 1280 px wide minus the 48 px margins and centred, and at 360 px the margins are 16 px. (L2-042)
- **AC-7** Given a page with the sticky top bar, when Maya tabs to a link that is scrolled under the top bar, then the page scrolls so the focused link is fully visible below the top bar. (L2-041)

### Grids

- **AC-8** Given the matching-braiders feature grid of Nia Okafor, Aisha Mensah and Jules Baptiste, when it renders at 360, 768 and 1280 px, then it shows 1, 2 and 3 cards per row and the page never scrolls horizontally. (L2-042)
- **AC-9** Given Nia Okafor's profile at 360 px, when it renders, then the main column (profile card, then "Customer reviews") comes first and the "Before you book" aside follows below it in a single column. (L2-042)
- **AC-10** Given the style detail page at 768 px, when it renders, then "What to expect" and "Make it yours" sit side by side, the aside is at least 256 px wide and neither column overflows. (L2-042)
- **AC-11** Given the appointment detail page, when Maya tabs through it at 360 px and at 1280 px, then focus visits "Request a change" and "Cancel request" in the main card before any element in the "Prepare for your visit" aside, matching the visual order at both widths. (L2-041)
- **AC-12** Given a `.grid.grid--auto` of three braider cards at 320 px, when it renders, then each card is the container's full width (never wider) and at 1280 px as many 288 px or wider cards fit per row as the width allows. (L2-042)
- **AC-13** Given the style gallery at 1280 px with the browser's text size at 200 %, when it renders, then the feature grid shows one card per row, and Nia's profile shows its aside below the main column, with no horizontal scrolling. (L2-042)

### Stacks and clusters

- **AC-14** Given the appointment detail card's `.cluster` with "Request a change" and "Cancel request" at 320 px, when the buttons do not fit on one line, then the second wraps below the first with 12 px between them and nothing overflows the card. (L2-042)
- **AC-15** Given the pagination row `.cluster.cluster--between` with "Showing 1–3 of 126" and "Next" at 1280 px, when it renders, then the summary sits at the start and "Next" at the end of the row, and at 320 px both remain visible. (L2-042)
- **AC-16** Given the booking request form's `form.stack`, when it renders, then its fields are 16 px apart and each field is the form's full width. (L2-042)

### Theming

- **AC-17** Given any page, when the theme switches from light to dark, then the shell's layout (column count, gutters, margins and padding) is unchanged and the canvas behind it changes to `--palette-gray-950`. (L2-042)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/container/` holding:
  - `app-shell.ts` exporting the standalone component `AppShell` with `selector: 'hp-app-shell'`, `host: { class: 'product-shell' }`, `changeDetection: OnPush`, and the template `<ng-content select="[slot=topbar]" /><main id="main" class="container product-main" [class.container--narrow]="narrow()"><ng-content /></main><ng-content select="[slot=footer]" />`. It has no styles of its own: its classes are styled by `layout.css`. Export it from `public-api.ts`.
  - `layout.css` with the rules for `.product-shell`, `.product-main`, `.container`, `.container--narrow`, `.section`, `.stack*`, `.cluster*`, `.grid`, `.grid--auto`, `.span-full`, `.feature-grid` and `.detail-grid`, ported from `docs/design-system/assets/components.css` (Layout primitives), plus the routed-page rhythm rule (D-3): `.product-main > router-outlet + * { display: block; margin-top: 0 }` and `.product-main > router-outlet + * > * + * { margin-top: var(--space-6) }`.
- Distribution: `layout.css` is listed in the library's `ng-package.json` `assets` and in each application's `angular.json` `styles`, after the tokens and foundation stylesheets and before any page styles. It is the only global stylesheet this CRD adds (D-1).
- No CDK primitive. The shell composes nothing; the top bar and footer are projected.
- Perf-test scenario `AppShell.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Which primitives are Angular components and which stay global utility classes?* Only the app shell is a component. It renders the main landmark and the skip-link target, appears on every screen of every application, and is reused across applications, so it belongs in the library as `hp-app-shell`. The container, stacks, clusters and grids stay global classes in `layout.css`, as AGENTS.md allows for shared foundations and utilities: they have no inputs, behaviour or DOM, they are combined with other blocks on the same element (`card stack`, `form stack`, `dialog__body stack`, `section feature-grid`), which a component cannot be because an element hosts at most one component, and a wrapper component would add an element between a grid and its cards or a stack and its children, breaking the direct-child rules they depend on.
- **D-2** *Does the shell render the main element or project it?* It renders `<main id="main" class="container product-main">`, so every application has exactly one main landmark with the skip link's target, and `narrow` is the only way to change its width.
- **D-3** *How do a routed page's blocks get the main's 24 px rhythm when Angular puts the page inside its own host element?* `layout.css` makes the element after `<router-outlet>` a block with no top margin of its own and gives its children the same `--space-6` rhythm as main's direct children. Without it, the rhythm would space only `<router-outlet>` and the page's host, and the page header, alerts and grids inside the host would touch. Routed page components therefore render their blocks directly in their template, without a wrapper of their own.
- **D-4** *L2-042 names five ranges with breakpoints at 576, 768, 992 and 1200 px, while the design system changes layout at 768 and 1024 px (and 640 px for dialogs and description lists). Which wins?* The design system's breakpoints. L2-042 requires each range to be usable without horizontal scrolling or clipped controls, not a layout change at each boundary, and the measured layouts meet it in every range; a grid step at 992 px would only crowd the 3-column feature grid.
- **D-5** *May a page reorder content visually, for example put the aside first on phones?* No. Visual order equals DOM order at every width so keyboard and screen-reader order match what is seen (L2-041); a page that needs the aside first puts it first in the DOM.
- **D-6** *Is `.container--narrow` used today?* No mock uses it: the form pages cap their card with the form-layout component's `.form-panel` (also `--layout-form-max`) and keep the page header at full width. The narrow container is kept for auth and form-only pages whose whole content should be narrow, and is reached only through the shell's `narrow` input. The design system collapsed the mocks' 38 rem and 42 rem caps into the one token.
- **D-7** *The loading mocks label the skeleton grid "Loading content". Is that the grid's label?* No. The page labels a loading region with what it loads ("Loading styles", "Loading your appointments"), as L2-035 requires a loading state to identify the region; the feature grid itself adds no label.

# Link

| Field | Value |
|---|---|
| Selector | `a[hp-link]` |
| Library path | `frontend/projects/components/src/lib/link/` |
| Status | planned |
| Traces to | L2-001, L2-006, L2-009, L2-033, L2-036, L2-041, L2-042 |
| Design system | [`link.html`](../../design-system/components/link.html) |
| Source mocks | [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`pages/matching-braiders/default`](../../mocks/pages/matching-braiders/default.html), [`pages/help/default`](../../mocks/pages/help/default.html), [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html), [`pages/style-detail/partial`](../../mocks/pages/style-detail/partial.html), [`pages/braider-profile/partial`](../../mocks/pages/braider-profile/partial.html), [`pages/appointment-detail/partial`](../../mocks/pages/appointment-detail/partial.html), [`pages/terms/default`](../../mocks/pages/terms/default.html), [`dialogs/report-review/default`](../../mocks/dialogs/report-review/default.html) |
| Rendering | [`link.html`](link.html) |

## Purpose and scope

A link takes the customer somewhere: to a style ("Explore Knotless braids"), to a braider ("Explore Nia Okafor"), to the report dialog for a review, to HairPop's terms, or out to another site. It is a native `<a href>` in four variants: **inline** inside running text, **standalone** at the end of a card with a trailing arrow, **external** with the external icon and a hidden "(opens in a new tab)", and **inherit**, which takes the colour of the alert, toast or footer it sits in. Every variant is underlined at rest, so a link never relies on colour alone.

Use something else when:

- activating the control changes something, opens a dialog that is not route-backed, or starts a process: use the button component ([`button.md`](button.md));
- navigation should look like an action ("View request", "Request with Nia"): use the button component on an `<a href>` (`a[hp-button]`);
- the link is a breadcrumb item or a pagination item: the breadcrumb ([`breadcrumb.md`](breadcrumb.md)) and pagination ([`pagination.md`](pagination.md)) components render and style their own anchors;
- the whole card is the target: the card component owns its stretched `.card__link`.

Out of scope:

- The top bar's navigation items (`.nav-link`, `.account-link`, `.topbar__brand`): they are top-bar parts with their own classes and current state. The top bar uses this component only for plain text links it renders.
- Layout of links inside their containers (one standalone link per card, footer link spacing and 24 px footer targets, alert action rows). The container decides; this component only renders one link.
- Routing. Consumers put `routerLink`, `href`, `queryParams` or `fragment` on the host; the component never builds a URL.
- Focus management for same-page targets (error-summary items that move focus to their field, the skip link). The form summary and the skip link component ([`skip-link.md`](skip-link.md)) own that.
- Whether "Retry reviews" in a partial-data alert is a link or a button is the alert's decision; when it is a link, it is this component with `variant="inherit"`.

## Usage

Every link in `docs/mocks/` that is not a button, nav item, breadcrumb or pagination item, plus the configurations the design-system link page defines for later screens.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Story cards on `pages/style-gallery` (default, long, edge, offline), behind `dialogs/cookie-preferences` and `notifications/cookie-consent` | standalone, one per card, `routerLink` to the style | "Explore Knotless braids", "Explore Passion twists", "Explore Cornrows", each with the arrow-right icon in `.link__arrow` (D-8) | default, hover, focus | surface (card) |
| Braider story cards on `pages/matching-braiders/default` and behind `dialogs/filter-braiders` | standalone, `routerLink` to the braider's profile | "Explore Nia Okafor", "Explore Aisha Mensah", "Explore Jules Baptiste" | default, hover, focus | surface (card) |
| Topic cards on `pages/help/default`, `pages/help/offline` | standalone | "Explore How requests work", "Explore Prices and estimates", "Contact support" (copy rule, see *Content*) | default, hover, focus | surface (card) |
| Reviews card on `pages/braider-profile/default` (and behind `dialogs/report-review`) | inline, alone on its line, `routerLink` to the route-backed report dialog | "Report a review" | default, hover, focus | surface (card) |
| Partial-data warning alert on `pages/style-detail/partial`, `pages/braider-profile/partial`, `pages/appointment-detail/partial` | inherit, in the alert's `.alert__actions` row (alert CRD D-1) | "Retry reviews" | default, hover, focus | warning alert |
| Alert actions and error summary (design-system alert page; every `invalid` state) | inherit, `routerLink` with `fragment` to the field | "Enter a valid email address", "Back to settings", "See what changes a price" | default, hover, focus | info, success, warning and danger alerts |
| Site footer on every screen (181 mocks) | inherit, rendered by the footer | "Terms", "Privacy"; later "Help", "Cookie preferences" | default, hover, focus, active | canvas |
| Running text in forms and policies (design-system *Variants*; L2-033 links from booking and account flows) | inline | "Read Nia’s cancellation policy before you send a request.", "Read HairPop’s terms of use before you send your first request." | default, hover, focus, active | surface, dialog surface |
| Links that leave HairPop (design-system *Variants*; no mock yet) | external, opens in a new tab | "WCAG 2.2 guidelines" + hidden " (opens in a new tab)" | default, hover, focus | surface |

Every row is buildable with the API below: one `variant`, projected text, native link attributes on the host, and `newTabText` for external links.

## Anatomy

1. **Host** — the native `<a>` with class `.link`, plus `.link--standalone`, `.link--external` or `.link--inherit` by variant. It carries `href` (or `routerLink`), `target`, `rel` and every ARIA attribute.
2. **Text** — the projected text node. It is the accessible name and says where the link goes.
3. **Underline** — `text-decoration: underline` at `--border-width-hairline`, offset 0.15 em; `--border-width-thick` on hover. Never removed.
4. **Arrow (standalone only)** — `<span class="link__arrow" aria-hidden="true">` wrapping a small arrow-right `svg.icon.icon--sm`, after the text, rendered by the component. Shifts `--space-1` right on hover.
5. **External icon and hint (external only)** — a small external `svg.icon.icon--sm` with `aria-hidden="true"`, then `<span class="visually-hidden">` holding `newTabText`, both rendered by the component after the text.
6. **Focus ring** — the shared `:focus-visible` outline. On a standalone link it wraps the text and arrow as one shape because the host is `inline-flex`.

Host: the attribute selector makes the native `<a>` the host (D-1). There is no wrapper element; the template is the default `<ng-content>` followed by the variant's trailing parts.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `variant` | `'inline' \| 'standalone' \| 'external' \| 'inherit'` | `'inline'` | no | Adds `.link--standalone`, `.link--external` or `.link--inherit`; inline adds only `.link`. Standalone renders the arrow; external renders the icon and hint and sets `target`/`rel` (D-5). |
| `newTabText` | `string` | `''` | when `variant` is `'external'` | Text of the visually hidden hint after the external icon, written by the consumer with its leading space: " (opens in a new tab)". Ignored by the other variants. In development mode an external link with an empty `newTabText` is reported as a console error (D-6). |

- Inputs are signal inputs.
- `href`, `routerLink`, `queryParams`, `fragment`, `aria-label`, `aria-describedby`, `download` and `hreflang` are plain attributes or directives on the host; the component never reads or rewrites them, except that the external variant writes `target="_blank"` and `rel="noopener"` (D-5).
- The component renders no copy of its own: the text is projected, the external hint is an input, and the icons carry no text.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | A link only navigates. Consumers that need to know bind the native `(click)` on the host, as on any anchor. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Text only | Declared once. The text is the whole accessible name (plus the hint for external links). No icons are projected: the variant decides the icon (D-4). |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Inline | — (`.link`) | Links inside running text, and a lone text link such as "Report a review". Never carries an icon. |
| Standalone | `.link--standalone` | The one link that ends a card or section: "Explore Knotless braids". Label font, 24 px minimum height, trailing arrow. |
| External | `.link--external` | A link that leaves HairPop: external icon, opens in a new tab, hidden "(opens in a new tab)". |
| Inherit | `.link--inherit` | A link inside an alert, toast, error summary or the footer: takes the container's text colour, stays underlined. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| Inline, external, inherit | — | the line height of the surrounding text | none | the surrounding text's font |
| Standalone | — | `min-height: --target-min` (24 px) | none; `--space-1` gap before the arrow | `--text-label` at `--font-size-md` (16 px semibold) |

There is one size per variant; inline links take the size of the text they sit in.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | `--color-fg-link` text, hairline underline at 0.15 em offset; inherit: container colour, hairline underline | Role link, name from the text |
| Hover | `:hover` | Text `--color-fg-link-hover`, underline `--border-width-thick`; standalone arrow shifts `--space-1` right; inherit keeps the container colour (or the container's `--link-inherit-hover-fg`) with a thick underline | — |
| Focus | `:focus-visible` | `--focus-ring-width` outline in `--color-focus-ring`, offset `--focus-ring-offset`; no ring after a pointer click | — |
| Active | `:active` | Same as hover (`--color-fg-link-hover`, thick underline) | — |
| Visited | `:visited` | Not restyled: identical to default (design-system *States*) | — |
| External | `variant="external"` | External icon after the text; opens in a new tab | Name ends with the hint: "WCAG 2.2 guidelines (opens in a new tab)" |
| Inside a status container | `variant="inherit"` in an alert or error summary | Container's text colour; semibold when the container sets `--link-inherit-font-weight` (D-3) | Unchanged |
| Inside the footer | `variant="inherit"` in the footer | `--color-fg-muted`, hover `--color-fg-default` through the footer's `--link-inherit-hover-fg` (D-3) | Unchanged |
| Forced colours | `(forced-colors: active)` | The browser paints the text and underline in `LinkText` for every variant; the underline stays; the focus ring is `Highlight` | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | The arrow shift and colour change are instant (`--duration-fast` is zeroed) | — |
| Narrow container or enlarged text | text enlarged to 200 % | Inline links wrap with their sentence; a standalone label wraps inside the link and the arrow stays at the end of the row, centred against the label | — |

Links have no disabled state: a destination the customer cannot use is removed, or still linked with the destination explaining why (design-system *States*). Links have no busy or error state.

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: inline, in running text -->
<p>Read <a class="link" href="/terms">HairPop’s terms of use</a> before you send your first request.</p>
```

```html
<!-- rendered: inline, alone on its line (route-backed dialog) -->
<a class="link" href="/braiders/nia-okafor/reviews/report">Report a review</a>
```

```html
<!-- rendered: standalone -->
<a class="link link--standalone" href="/styles/knotless-braids">
  Explore Knotless braids
  <span class="link__arrow" aria-hidden="true"><svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
</a>
```

```html
<!-- rendered: external -->
<a class="link link--external" href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener">
  WCAG 2.2 guidelines
  <svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>
  <span class="visually-hidden"> (opens in a new tab)</span>
</a>
```

```html
<!-- rendered: inherit, inside the partial-data warning alert -->
<div class="alert alert--warning">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4L2.5 20h19zM12 10v4M12 17v.01"/></svg>
  <div class="alert__body"><p class="alert__title">Some details are unavailable</p><p>Reviews could not load.</p>
    <div class="alert__actions"><a class="link link--inherit" href="/braiders/nia-okafor">Retry reviews</a></div></div>
</div>
```

Consumer templates:

```html
<!-- consumer: running text -->
<p>Read <a hp-link routerLink="/terms">HairPop’s terms of use</a> before you send your first request.</p>

<!-- consumer: story card -->
<a hp-link variant="standalone" [routerLink]="['/styles', style.slug]">Explore {{ style.name }}</a>

<!-- consumer: braider story card -->
<a hp-link variant="standalone" [routerLink]="['/braiders', braider.slug]">Explore {{ braider.name }}</a>

<!-- consumer: external -->
<a hp-link variant="external" href="https://www.w3.org/WAI/standards-guidelines/wcag/" newTabText=" (opens in a new tab)">WCAG 2.2 guidelines</a>

<!-- consumer: error summary item (the summary moves focus to the field) -->
<a hp-link variant="inherit" routerLink="." fragment="email">Enter a valid email address</a>

<!-- consumer: footer (the footer renders its own links) -->
<a hp-link variant="inherit" routerLink="/privacy">Privacy</a>
```

Free to change: the order of classes, and whether the arrow and external icon are drawn by the icon component or inline SVG, as long as the rendered DOM above is unchanged.

## Design

- Colour: the host reads `--color-fg-link` at rest and `--color-fg-link-hover` on hover and active, directly from the semantic tier as the stylesheet's `a, .link` rule does. Inherit reads `color: inherit` and the two container knobs below.
- Underline: `text-decoration-line: underline`, `text-underline-offset: 0.15em`, `text-decoration-thickness: --border-width-hairline` at rest and `--border-width-thick` on hover and active, on every variant.
- Typography: inline, external and inherit links keep the surrounding font. Standalone uses `--text-label` with `--font-size-md` (semibold, 16 px, `--line-height-normal`).
- Standalone layout: `display: inline-flex`, `align-items: center`, `gap: --space-1`, `min-height: --target-min`. The label wraps; it is never `white-space: nowrap`. `.link__arrow` is `flex: none; display: inline-flex`, so the arrow keeps its 1 rem size when the label wraps (D-12).
- Icons: `.icon--sm` (1 rem square), stroked in `currentColor`, so they follow hover and inherit colours.
- External layout: the icon and hint follow the text inline; the icon takes the icon rule (`display: inline-block`, `vertical-align: -0.125em`) plus a `--space-1` left margin, so it sits on the text line and wraps with the last word (D-11).
- Motion: colour and underline change instantly as in the stylesheet; the arrow's `translate` transitions over `--duration-fast` with `--ease-standard`.
- Elevation and layer: none.

Component tokens (container knobs, read with fallbacks; D-3):

| Token | Aliases | Overridden by |
|---|---|---|
| `--link-inherit-font-weight` | falls back to the inherited weight | Alerts and the error summary set `--font-weight-semibold` (design-system *Inherit colour*) |
| `--link-inherit-hover-fg` | falls back to the inherited colour (`currentColor`) | The footer sets `--color-fg-default` (design-system footer *States*) |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Text, underline, icons | `--color-fg-link` | `--palette-plum-700` | `--palette-plum-300` |
| Text, hover and active | `--color-fg-link-hover` | `--palette-plum-800` | `--palette-plum-200` |
| Inherit in a warning alert | `--color-warning-fg` | `--palette-amber-700` | `--palette-amber-300` |
| Inherit in the footer | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Inherit in the footer, hover | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json` plus the dialog and container pairs it adds, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-link` | `--color-bg-canvas` | 4.5:1 | Link on the page |
| `--color-fg-link` | `--color-bg-surface` | 4.5:1 | Link on a card |
| `--color-fg-link` | `--color-bg-surface-raised` | 4.5:1 | Link in a dialog |
| `--color-fg-link-hover` | `--color-bg-surface` | 4.5:1 | Hovered link on a card |
| `--color-fg-link-hover` | `--color-bg-canvas` | 4.5:1 | Hovered link on the page |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | Inherit link in a warning alert |
| `--color-danger-fg` | `--color-danger-bg` | 4.5:1 | Inherit link in the error summary |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Footer link |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Footer link, hover |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on a card |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus ring in a dialog |

The underline, not colour, distinguishes a link from surrounding text (WCAG 1.4.1), so an inherit link that shares its container's colour is still identifiable. Forced colours: links are painted `LinkText` by the browser and keep the underline; the tokens map the focus ring to `Highlight`.

## Responsive behaviour

- The component has no breakpoint rules. The footer wraps its links below 640 px; cards stack below 768 px; neither changes the link.
- Inline links wrap with their sentence. Standalone labels wrap inside the link at narrow widths or 200 % text; measured in Chromium at 360 px with text at 200 %, "Explore Knotless braids" wraps over three lines inside the story card, the arrow stays at the end of the row at full size (D-12), and the page does not scroll horizontally.
- Targets: standalone links are at least 24 px tall (`--target-min`) and get their own line. Inline links inside sentences fall under the WCAG 2.5.8 inline exception and are never closer than one word apart. A lone inline link ("Report a review") sits on its own line with no neighbour within 24 px. Footer links are 24 px tall through the footer's own rule.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; every standalone target is at least 24 × 24 CSS px.

## Accessibility

### Role and pattern

Native `<a href>` following the [APG Link pattern](https://www.w3.org/WAI/ARIA/apg/patterns/link/). Never an anchor without `href`, never a `<span>` or `<button>` with a click handler for navigation; the attribute selector makes anything else impossible.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to and from the link in DOM order. |
| <kbd>Enter</kbd> | Follows the link. |
| <kbd>Space</kbd> | Does not follow the link (the page scrolls, as for any link). |

### Focus

- Focus lands on the host; the arrow and icons are not focusable.
- The ring is the shared `:focus-visible` outline: `--focus-ring-width` of `--color-focus-ring` offset by `--focus-ring-offset`. A standalone link is `inline-flex`, so the ring is one rectangle around text and arrow. An inline link that wraps gets the browser's per-line outline.
- No ring after a pointer click.

### Labelling

- The text is the accessible name and makes sense alone (WCAG 2.4.4): "Explore Knotless braids", never "Explore" or "Learn more". Repeated card links name their card.
- The arrow and the external icon are `aria-hidden="true"` and never part of the name.
- External links end their name with the hidden hint: "WCAG 2.2 guidelines (opens in a new tab)".
- When a consumer adds `aria-label`, it starts with the visible text (WCAG 2.5.3).

### Announcements

None. A link has no live region; destinations announce themselves.

### Motion

Only the standalone arrow moves: 4 px (`--space-1`) right on hover over `--duration-fast`. Under `prefers-reduced-motion: reduce` the tokens zero `--duration-fast`, so the shift is instant.

## Content and internationalisation

- Describe the destination: "Explore Knotless braids", "Read Nia’s reviews", "Terms of use". Sentence case, no trailing punctuation inside the link, never "Click here" or "Link to".
- Keep the arrow for standalone links only; inline links never carry icons except the external icon. The component enforces this by owning the icons (D-4).
- The help page's support card links "Contact support", not "Explore Need a hand?": a question mark inside the link breaks the content rule. The page's copy carries the rule, not the component.
- Translatable content: the projected text and `newTabText`. Data values: style names ("Knotless braids") and braider names ("Nia Okafor") inside "Explore …" labels.
- Long labels wrap; nothing truncates. No dates, prices or distances appear in link text in the mocks; when they do, they follow the page's formats.

## Performance

- Change detection: `OnPush`, signal inputs, host class bindings computed from `variant`; the template holds two `@if` blocks for the trailing parts and nothing else.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Link.ts` renders the style gallery's story-card link, `<a hp-link variant="standalone" href="/styles/knotless-braids">Explore Knotless braids</a>`; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none yet. The card and footer CRDs name the compositions that repeat links.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: the arrow and icon are 1 rem boxes rendered with the text on first paint; hover moves the arrow with `translate`, which does not affect layout.
- Weight: `@angular/core` and the icon component only. No router import: consumers add `routerLink`.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `<a hp-link routerLink="/terms">HairPop’s terms of use</a>` inside the sentence "Read HairPop’s terms of use before you send your first request.", when it renders, then the DOM holds the native `<a class="link" href="/terms">` with no wrapper, its text is `--color-fg-link` with a 1 px underline offset 0.15 em, and its accessible name is "HairPop’s terms of use". (L2-041)
- **AC-2** Given the inline Terms link in the sign-up form, when Maya activates it with a click or Enter while signed out, then the public Terms of use page opens. (L2-033)
- **AC-3** Given the Knotless braids story card on the style gallery, when its link renders, then it is `<a class="link link--standalone">` whose text is "Explore Knotless braids" followed by `.link__arrow[aria-hidden="true"]` containing one `svg.icon.icon--sm`, its label is 16 px semibold, its height is at least 24 px, and activating it opens the Knotless braids style detail. (L2-001)
- **AC-4** Given Nia Okafor's card in the matching braiders results, when the customer activates "Explore Nia Okafor", then Nia's profile opens and the accessible name is exactly "Explore Nia Okafor", with no arrow text in it. (L2-006)
- **AC-5** Given the reviews card on Nia's profile, when the customer activates the inline link "Report a review", then the route-backed report review dialog opens, and the link carries no icon. (L2-009)
- **AC-6** Given `<a hp-link variant="external" newTabText=" (opens in a new tab)">WCAG 2.2 guidelines</a>`, when it renders, then it has `target="_blank"`, `rel="noopener"`, the class `link--external`, one `aria-hidden` external `svg.icon.icon--sm` and a `.visually-hidden` span, and its accessible name is "WCAG 2.2 guidelines (opens in a new tab)". (L2-041)
- **AC-7** Given an external link with an empty `newTabText` in development mode, when it initialises, then the console reports an error naming `hp-link` and the missing new-tab text. (L2-041)
- **AC-8** Given an `a[hp-link]` host with neither `href` nor `routerLink` in development mode, when it has rendered, then the console reports an error naming `hp-link` and the missing destination. (L2-041)

### Variants

- **AC-9** Given Nia's profile in its partial state with the warning alert "Some details are unavailable. Reviews could not load.", when the inherit link "Retry reviews" renders, then its text colour equals the alert's `--color-warning-fg`, it is underlined, it is semibold through the alert's `--link-inherit-font-weight`, and activating it requests the reviews again. (L2-036)
- **AC-10** Given the footer link "Privacy" with `variant="inherit"`, when it renders and is then hovered, then it is `--color-fg-muted` and underlined at rest, and on hover its colour becomes `--color-fg-default` through the footer's `--link-inherit-hover-fg` and its underline 2 px. (L2-033)
- **AC-11** Given an inherit link inside a container that sets neither knob, when it renders and is hovered, then its weight and colour equal the container's own text weight and colour at rest and on hover, so it keeps the container's contrast pair, and only the underline thickness changes. (L2-041)

### States

- **AC-12** Given the inline link "Nia’s cancellation policy" on a card, when the pointer hovers it or presses it, then its text becomes `--color-fg-link-hover`, its underline 2 px, and the contrast against `--color-bg-surface` stays at least 4.5:1. (L2-041)
- **AC-13** Given the standalone link "Explore Cornrows", when the pointer hovers it, then the arrow moves 4 px to the right, the label becomes `--color-fg-link-hover`, and the link's box does not change size. (L2-041)
- **AC-14** Given the sign-in error summary "Check the highlighted field" with the inherit item `<a hp-link variant="inherit" routerLink="." fragment="email">Enter a valid email address</a>`, when Maya activates it, then the browser stays on the sign-in route with `#email` appended instead of navigating to the site root, and the item keeps the summary's `--color-danger-fg`. (L2-036)

### Keyboard and focus

- **AC-15** Given the style gallery, when the customer presses Tab through the first story card, then focus lands on "Explore Knotless braids" after the card's content, Enter opens the style, and Space does not. (L2-041)
- **AC-16** Given a standalone link focused by keyboard, when the ring shows, then it is one 2 px `--color-focus-ring` outline offset 2 px around the text and arrow together, with at least 3:1 contrast against `--color-bg-surface`, and when the same link is focused by a pointer click, then no ring shows. (L2-041)

### Theming

- **AC-17** Given the inline and standalone links, when the theme switches from light to dark, then their text changes from the light `--color-fg-link` (plum 700) to the dark value (plum 300) without a reload. (L2-042)
- **AC-18** Given each variant in the dark theme, when contrast is measured, then link text is at least 4.5:1 against `--color-bg-canvas`, `--color-bg-surface` and `--color-bg-surface-raised`, the hovered text at least 4.5:1 against `--color-bg-surface`, and "Retry reviews" at least 4.5:1 against `--color-warning-bg`. (L2-041)
- **AC-19** Given Windows forced colours, when the links render, then every variant is painted in the system link colour and keeps its underline, and the focus ring is `Highlight`. (L2-041)

### Responsive

- **AC-20** Given the style gallery at 360 px with text enlarged to 200 %, when the story card renders, then "Explore Knotless braids" wraps inside the card with its arrow at the end of the row and still 1 rem square, nothing is clipped, and the page does not scroll horizontally. (L2-042)
- **AC-21** Given the sentence "Read Nia’s cancellation policy before you send a request." at 320 px, when it renders, then the inline link wraps with the sentence across lines and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-22** Given `prefers-reduced-motion: reduce`, when a standalone link is hovered, then the arrow reaches its shifted position immediately with no visible transition. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/link/`; file `link.ts` exporting the standalone component `Link` with `selector: 'a[hp-link]'`, `changeDetection: OnPush`, and a template of `<ng-content />` followed by `@if (variant() === 'standalone')` for the arrow span and `@if (variant() === 'external')` for the icon and hint. Export it from the library's `public-api.ts`.
- Host bindings: `class.link` always; `class.link--standalone`, `class.link--external`, `class.link--inherit` from `variant`; `attr.target` (`'_blank'` or `null`) and `attr.rel` (`'noopener'` or `null`) for external.
- Scoped `styles` port the base `a` rules and the `.link--standalone` rules from `docs/design-system/assets/components.css` onto `:host` and `:host(.link--standalone)`, and add the new rules for `.link--external` and `.link--inherit` (D-2, D-3). The global `a` rule stays in the foundation stylesheet for unclassed anchors in rich text such as legal copy.
- Icons: rendered with the icon component, `<svg hp-icon name="arrow-right" size="sm">` inside the arrow span and `<svg hp-icon name="external" size="sm">` after an external link's text, producing `svg.icon.icon--sm[aria-hidden="true"]` with the paths shown under *Markup*.
- Development checks (D-6): in `ngOnInit`, an external link with an empty `newTabText` logs `console.error`; in `afterNextRender`, a host without an `href` attribute logs `console.error`. Both are skipped outside `isDevMode()`.
- No CDK primitive. Composes the icon component.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Link.ts`, exported from `src/scenarios/index.ts`, with iterations added to `e2e/perf-test/config/scenario-iterations.mjs`.
- `docs/design-system/assets/components.css` defines `.link`, `.link--standalone`, `.link--external`, `.link--inherit`, the two container knobs (set by `.alert` and `.site-footer`), the inline external icon (D-11) and the non-shrinking arrow (D-12); the design-system link page shows each. The component's scoped styles port those rules.

## Decisions

- **D-1** *Is the host a wrapper element or the native anchor?* The native anchor, through `a[hp-link]`. Consumers then put `routerLink`, `href`, `queryParams`, `fragment` and ARIA attributes straight on the element; middle click, "open in new tab" and link semantics stay native; and container rules that target `a` (`.story-card a:not(.btn)`, `.site-footer a`, `.alert a`) still match a direct child, exactly as in the mocks. Matches the button CRD's D-1.
- **D-2** *Which classes does the host carry?* `.link` always, plus `.link--standalone`, `.link--external` or `.link--inherit`. The first extraction had only `.link--standalone` and `.link__arrow`; inline links were styled by the bare `a` rule and inherit links by container rules (`.alert a`, `.site-footer a`). Those container rules cannot reach a link projected from another component's template under Angular's style encapsulation, so the variant needs a class of its own, and `.link` gives every link a BEM block and an e2e hook. The stylesheet now defines `.link` (sharing the `a` rule), `.link--external` and `.link--inherit`, and the design-system link page shows them.
- **D-3** *What does the inherit variant look like, given that alerts make links semibold and the footer turns them to the default text colour on hover?* At rest it takes `color: inherit` and keeps the hairline underline; on hover and active it keeps the inherited colour and thickens the underline. Weight and hover colour come from two container knobs read with fallbacks, `--link-inherit-font-weight` (falls back to the inherited weight) and `--link-inherit-hover-fg` (falls back to `currentColor`). Alerts and the error summary set the first to `--font-weight-semibold`, the footer sets the second to `--color-fg-default`. Custom properties inherit through encapsulation, so containers re-skin the link without reaching into it, the design system's re-skin-by-component-token rule. Measured in Chromium: with no knob set the link computes the container's weight (400 in the footer) and colour; with the knob set it computes the knob's value.
- **D-4** *Are the arrow and external icon projected or rendered by the component?* Rendered by the component from the variant. The design system allows the arrow only on standalone links and the icon only on external ones, and the mocks' "→" text glyph shows what goes wrong when consumers draw their own. Text is the only projected content.
- **D-5** *Does an external link always open a new tab?* Yes. The design-system example and code sample open in a new tab with `rel="noopener"`, and no screen needs an external link in the same tab; leaving HairPop mid-booking in the same tab would lose the customer's place. The component writes `target="_blank"` and `rel="noopener"` so a consumer cannot forget either.
- **D-6** *How are a missing new-tab hint and a missing destination caught?* Development-mode `console.error` messages naming `hp-link`; the link still renders so the page does not break. The design system forbids both (hidden "(opens in a new tab)" is required; never an anchor without `href`); an error log that the e2e harness treats as a failure is the proportionate check, as in the button CRD's D-9.
- **D-7** *Are visited links restyled?* No, as the design-system *States* section decides: HairPop's links mostly lead back to the same browsing pages, so a visited colour adds noise.
- **D-8** *The first mocks drew the standalone arrow as a "→" glyph with no minimum height, and footer links under 24 px. Which wins?* The design system, which records both as drift fixed during extraction: the arrow is the arrow-right icon in `.link__arrow`, and standalone links are at least 24 px tall. The footer's 24 px target is the footer's rule.
- **D-9** *Which variant is "Report a review", alone on its own line in the reviews card?* Inline. The design system's do/don't shows it as a plain link to a route-backed dialog, and standalone links carry an arrow that is reserved for the one link that ends a card ("Explore …"). Alone on its line it has no neighbour within 24 px, so it meets WCAG 2.5.8 by spacing.
- **D-10** *How do same-page fragment links (error summary items) work under client-side routing?* Through the router: consumers write `routerLink="." fragment="email"` on the host so the URL keeps the current route, and the error summary moves focus to the field. The component never intercepts navigation; the skip link component exists because it must move focus itself.
- **D-11** *Where does the external icon sit?* On the text line, after the last word. The foundation reset `img, svg, video { display: block }` pushes the icon onto a line of its own: measured in Chromium, both on the design-system link page (the icon renders 26 px below the text's top, the link 42 px tall) and inside a sentence, where it breaks the sentence over three lines. The `.icon` rule therefore sets every icon to `display: inline-block` with `vertical-align: -0.125em` (the icon CRD, which needs the same for the rating star), and the external variant adds the `--space-1` gap (`.link--external .icon` in `components.css`, shown on the design-system link page).
- **D-12** *What happens to the arrow when a standalone label wraps?* It keeps its size. Measured in Chromium at 360 px with text at 200 %: with the first extracted stylesheet the `.link__arrow` span was a shrinkable flex item, so the 32 px arrow was squeezed to 18 px wide while the label took the row. The span is `flex: none; display: inline-flex` in `components.css`.

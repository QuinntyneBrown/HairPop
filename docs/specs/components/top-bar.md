# Top bar

| Field | Value |
|---|---|
| Selector | `header[hp-top-bar]` |
| Library path | `frontend/projects/components/src/lib/top-bar/` |
| Status | planned |
| Traces to | L2-011, L2-018, L2-030, L2-032, L2-041, L2-042 |
| Design system | [`top-bar.html`](../../design-system/components/top-bar.html) |
| Source mocks | [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`pages/matching-braiders/default`](../../mocks/pages/matching-braiders/default.html), [`pages/my-appointments/default`](../../mocks/pages/my-appointments/default.html), [`pages/help/default`](../../mocks/pages/help/default.html), [`pages/notification-center/unread`](../../mocks/pages/notification-center/unread.html), [`pages/notification-center/read`](../../mocks/pages/notification-center/read.html), [`pages/appointment-detail/default`](../../mocks/pages/appointment-detail/default.html), [`pages/sign-in/default`](../../mocks/pages/sign-in/default.html), [`dialogs/filter-braiders/default`](../../mocks/dialogs/filter-braiders/default.html), [`dialogs/cookie-preferences/default`](../../mocks/dialogs/cookie-preferences/default.html), [`notifications/booking-update/info`](../../mocks/notifications/booking-update/info.html) |
| Rendering | [`top-bar.html`](top-bar.html) |

## Purpose and scope

The top bar is the same on every HairPop screen. It is the banner of the page: the HairPop brand (back to the style gallery), the four primary destinations (Styles, Braiders, Appointments, Help), the Updates link with Maya's unread count, and her account link. It is how a customer moves between styles, braiders and her appointments from anywhere. On phones the four destinations collapse behind a menu button so every one of them is still one tap away.

Use something else when:

- an area has more than six destinations or needs groups (a future account area or braider studio): use the sidebar navigation ([`sidebar-navigation.md`](sidebar-navigation.md));
- the customer switches between views of one page ("Upcoming" and "Past"): use tabs ([`tabs.md`](tabs.md));
- the action belongs to the page ("Book a style", "Request a change"): put it in the page header ([`page-header.md`](page-header.md));
- the destination is secondary or legal (Terms, Privacy, Cookie preferences): put it in the footer ([`footer.md`](footer.md)).

Out of scope:

- The skip link that precedes the bar. It is its own component (`skip-link` in the design system) and targets `<main id="main">`.
- Which destination is current. The application shell decides from route data and passes it in `current` (D-2); the top bar only renders it.
- The unread number and the session. The notifications service supplies `unreadCount`; the identity service decides whether `updates` is shown and what the account link says.
- Where focus goes after a navigation. The page header CRD owns focus on the new page's `<h1>` (D-12).
- `scroll-padding-top` on `html`. It is a global base rule in `components.css` that the bar's height relies on; the bar does not set it.
- Search in the bar. No design-system page or mock places a search there, and `components.css` has no search rule for the bar (D-11).

## Usage

Every mock (181 screens: 22 pages, 7 dialogs, 4 notification sets) starts with the same `header.topbar`. The inventory script groups them by which link carries `aria-current="page"`:

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/style-gallery/*` (8 states), `dialogs/cookie-preferences/*`, `notifications/cookie-consent/*` (19 screens) | signed in, `current: 'styles'` | brand "HairPop"; links Styles, Braiders, Appointments, Help; "Updates" with count 2; account "Maya" | Styles current; link hover, focus | surface (`--topbar-bg`) over canvas |
| `pages/matching-braiders/*` (8), `dialogs/filter-braiders/*` (4) | signed in, `current: 'braiders'` (route `/styles/knotless-braids/braiders`) | as above | Braiders current | surface |
| `pages/my-appointments/*` (8) | signed in, `current: 'appointments'` | as above | Appointments current | surface |
| `pages/help/*` (4) | signed in, `current: 'help'` | as above | Help current | surface |
| Every other screen (109): style detail, braider profile, booking request, appointment detail, care and review, notification center, account settings, legal, error pages, and the dialogs and notifications shown over them | signed in, `current: null` | as above | no current link | surface |
| `pages/notification-center/unread` → `read` | `updates.unreadCount` 2 on `unread`, 0 on `read` once Maya has read both updates | "Updates" + count; hidden ", 2 unread"; plain "Updates" at 0 | count 2, 0 (badge and hidden text removed) | surface |
| `pages/sign-in/*`, `sign-up/*`, `forgot-password/*`, `reset-password/*`, `verify-email/*`, and any page a visitor opens signed out | signed out: `updates: null`, account "Sign in" → `/sign-in` (D-7) | brand, four links, "Sign in" | no Updates link; no current link | surface |
| Design system *Content*: more than 99 unread | `unreadCount: 120` | badge "99+", hidden ", 120 unread" | count capped | surface |
| Every screen below 768 px (design system *Variants*, compact; every mock carries the collapsed menu button) | menu button shown; inline links and account link hidden; links in the menu panel (D-5) | menu button "Menu"; panel: Styles, Braiders, Appointments, Help, "Maya · account" | collapsed, expanded, current link in the panel | surface; panel on surface over content |
| Design system *Theming*: a studio or partner re-skin | `--topbar-bg` overridden by an ancestor rule | — | all | sunken or brand surface |

Every row is buildable with the API below: `links` and `current` cover the four destinations and the current mark, `updates` (or `null`) covers signed in and signed out with any count, `account` covers "Maya" and "Sign in", and the menu panel renders the same link data below 768 px.

## Anatomy

1. **Container** — `.topbar` on the host `<header>`. Sticky at `top: 0` with `--z-sticky`; flex row, `--space-3` gaps, `align-items: center`; `min-height: --layout-topbar-height`; side padding `--layout-margin`; `--topbar-bg` fill; bottom hairline in `--color-border-default`. Wraps onto further rows only when enlarged text needs it (D-8).
2. **Brand** — `a.topbar__brand`: a sparkle `svg.icon` (`aria-hidden="true"`) followed by the brand label, `--text-h4`, `--color-fg-accent`, no underline, `min-height: --target-comfortable`. Links to the style gallery.
3. **Primary navigation** — `nav.topbar__nav` with `aria-label` from `navLabel`; hidden below 768 px, a flex row with `--space-1` gaps and `--space-4` left margin from 768 px. Holds one `a.nav-link` per destination, in the order given.
4. **Nav link** — `a.nav-link`: 44 px (`--target-comfortable`) tall, `--space-3` side padding, `--radius-md`, `--text-label`, `--color-fg-muted`, no underline, never wraps (`white-space: nowrap` inside `.topbar__nav`). The current destination carries `aria-current="page"`.
5. **Spacer** — `span.topbar__spacer` (`flex: 1`), pushes Updates and the account to the end.
6. **Updates link (signed in)** — `a.account-link`: the label, a count badge `span.badge.badge--count` when the count is above zero, and a `span.visually-hidden` with the unread text. 44 px tall; `--font-size-sm` below 768 px, `--font-size-md` from 768 px.
7. **Menu button** — the Button component (`button[hp-button]`, ghost, `iconOnly`) with the extra class `topbar__menu`: rendered classes `btn btn--ghost btn--icon topbar__menu`. Shown below 768 px only. Shows the menu icon when collapsed and the close icon when expanded.
8. **Account link** — `a.account-link.topbar__account`: the customer's first name ("Maya") or "Sign in". Shown in the bar from 768 px; below 768 px it moves into the menu panel (D-5).
9. **Menu panel (phones, expanded only)** — `nav.topbar__panel` with the same `aria-label`, rendered in a CDK Overlay pane attached under the bar (D-3): a column of the same `a.nav-link` elements followed by the account link, `--space-2` between links, padding `--space-2` top, `--layout-margin` sides, `--space-4` bottom, `--topbar-bg` fill, bottom hairline in `--color-border-default`.

Host: the component uses an attribute selector, so the host **is** the native `<header>` and carries `.topbar` (D-1). It is the page's `banner` landmark because it is not inside `<main>`, `<article>`, `<aside>`, `<nav>` or `<section>`. The template renders parts 2–8 as children of the host; part 9 is a `TemplatePortal` the component attaches to a CDK Overlay.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `brandLabel` | `string` | — | yes | Text of the brand link ("HairPop"); it is the link's accessible name. |
| `brandLink` | `string \| readonly unknown[]` | — | yes | `RouterLink` commands for the style gallery (`'/'`). |
| `navLabel` | `string` | — | yes | `aria-label` of the inline nav and of the menu panel ("Primary"). Must differ from any other `<nav>` label on the page. |
| `links` | `readonly TopBarLink[]` | — | yes | The primary destinations in display order. HairPop passes four: Styles, Braiders, Appointments, Help. Each renders one `a.nav-link` inline and one in the menu panel. |
| `current` | `string \| null` | `null` | no | The `id` of the current destination. That link gets `aria-current="page"`; no other does. `null` marks none (detail pages, account pages, errors). An unknown id marks none. |
| `updates` | `TopBarUpdates \| null` | `null` | no | The Updates link. `null` hides it (signed out, D-7). |
| `account` | `TopBarAccount` | — | yes | The account link: "Maya" → account settings when signed in, "Sign in" → `/sign-in` when signed out. |
| `menuLabel` | `string` | — | yes | `aria-label` of the menu button ("Menu"). The name does not change when expanded; `aria-expanded` carries the state. |
| `menuOpen` | `boolean` (two-way `model`) | `false` | no | Whether the phone menu panel is open. The component sets it on every open and close; a consumer may bind it, for example to close the panel from a test. Setting it to `true` at 768 px or wider is ignored. |

```ts
type Commands = string | readonly unknown[];
interface TopBarLink { readonly id: string; readonly label: string; readonly link: Commands; }
interface TopBarUpdates {
  readonly label: string;        // "Updates"
  readonly link: Commands;       // '/notifications'
  readonly unreadCount: number;  // 0 hides the badge and the unread text
  readonly unreadText: string;   // ", 2 unread": visually hidden, read after the count
}
interface TopBarAccount {
  readonly label: string;        // "Maya" or "Sign in"
  readonly link: Commands;       // '/settings' or '/sign-in'
  readonly panelLabel?: string;  // label in the phone menu panel; defaults to label ("Maya · account")
}
```

- Inputs are signal inputs (`input.required()`, `input()`, `model()`); object inputs are treated as immutable, so a new object triggers an update.
- Links render through `RouterLink`, so `href` is produced by the router and navigation stays client-side; modifier clicks open a new tab as for any link.
- The badge shows `unreadCount` when it is 1–99 and "99+" above 99 (D-10). The visually hidden span shows `unreadText` exactly; the consumer writes the full number into it.
- Every user-facing string is an input; the component renders no copy of its own. Icons are inline SVG paths, not text.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `menuOpenChange` | `boolean` | The menu panel opens or closes for any reason (button, Escape, outside pointer, link activation, navigation, viewport reaching 768 px). Part of the `menuOpen` model. |

Link activation is ordinary router navigation; the component emits nothing for it.

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | The top bar is data-driven: the same links render in two places (inline and in the menu panel), which projected content cannot do (AGENTS.md: a slot projects into one place only). |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Default (768 px and wider) | — (viewport) | Brand, the four links inline, spacer, Updates, account. Menu button hidden. |
| Compact (below 768 px) | — (viewport) | Brand, spacer, Updates with its count, menu button. Links and account move into the menu panel. |
| Compact, menu open | `aria-expanded="true"` on the menu button | The menu panel under the bar. |
| Signed out | `updates: null`, account "Sign in" | Any page a visitor reaches without a session. |

The arrangement is decided by the viewport, never by an input. One size: `min-height` `--layout-topbar-height` (56 px) at every breakpoint; only the contents change. Side padding follows `--layout-margin` (16 → 32 → 48 px) so the brand lines up with the page content.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Nav link, default | — | `--color-fg-muted` label, no fill | Link, named by its label |
| Nav link, hover | `:hover` | Fill `--color-bg-subtle`, label `--color-fg-default`, over `--duration-fast` | — |
| Nav link, active | `:active` | Keeps the hover look (no separate pressed look) | — |
| Nav link, focus | `:focus-visible` | `--focus-ring-width` outline in `--color-focus-ring`, offset `--focus-ring-offset` | — |
| Nav link, current | `aria-current="page"` | Fill `--color-accent-subtle`, label `--color-fg-accent`; hover fill `--color-accent-subtle-hover` | "current page" |
| Brand, hover | `:hover` | Label and icon `--color-fg-link-hover` | — |
| Brand, focus | `:focus-visible` | Shared ring | — |
| Account and Updates links, hover | `:hover` | Label `--color-fg-link-hover`, underline `--border-width-thick` (the base link rule) | — |
| Account and Updates links, focus | `:focus-visible` | Shared ring | — |
| Unread count | `updates.unreadCount` 1–99 | `.badge.badge--count`: `--color-danger-solid` pill, `--color-fg-on-danger` digits, tabular figures | Read as part of the link name: "Updates 2, 2 unread" |
| Unread count capped | `unreadCount` > 99 | Badge "99+" | Hidden text gives the full number: "Updates 99+, 120 unread" |
| No unread | `unreadCount` 0 | No badge, no hidden text | "Updates" |
| Signed out | `updates: null` | No Updates link; account link reads "Sign in" | — |
| Menu collapsed | below 768 px, `menuOpen` false | Menu icon; ghost button look | Button "Menu", collapsed |
| Menu button hover, focus, active | Button states | Ghost button hover fill `--color-bg-subtle`, shared ring, active 1 px press (Button CRD) | — |
| Menu expanded | `menuOpen` true | Close icon; panel under the bar | Button "Menu", expanded; `aria-controls` names the panel |
| Wrapped (enlarged text) | content wider than the bar | Items wrap onto further rows; the bar grows in height (D-8) | Order unchanged |
| Forced colours | `(forced-colors: active)` | Current link gains a `--border-width-thick` `Highlight` outline; focus ring `Highlight` | — |
| Print | `@media print` | Bar hidden | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Colour changes instant (tokens zero `--duration-fast`); the panel never animates | — |

The bar itself has no interactive state. Navigation links are never disabled: a destination the customer cannot use yet (Appointments while signed out) still links, and the destination explains why (design system *States*).

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: signed in, 768 px and wider, Styles current -->
<header class="topbar">
  <a class="topbar__brand" href="/">
    <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>HairPop
  </a>
  <nav class="topbar__nav" aria-label="Primary">
    <a class="nav-link" href="/" aria-current="page">Styles</a>
    <a class="nav-link" href="/braiders">Braiders</a>
    <a class="nav-link" href="/appointments">Appointments</a>
    <a class="nav-link" href="/help">Help</a>
  </nav>
  <span class="topbar__spacer"></span>
  <a class="account-link" href="/notifications">Updates <span class="badge badge--count">2</span><span class="visually-hidden">, 2 unread</span></a>
  <button class="btn btn--ghost btn--icon topbar__menu" type="button" aria-label="Menu" aria-expanded="false" aria-controls="hp-top-bar-panel-1">
    <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
  </button>
  <a class="account-link topbar__account" href="/settings">Maya</a>
</header>
```

The menu button and account link are in the DOM at every width; CSS hides the button from 768 px and the account link below 768 px (`display: none`, so neither is focusable while hidden).

```html
<!-- rendered: below 768 px, menu expanded, Appointments current -->
<button class="btn btn--ghost btn--icon topbar__menu" type="button" aria-label="Menu" aria-expanded="true" aria-controls="hp-top-bar-panel-1">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
</button>
<!-- in the CDK overlay container, attached under the bar -->
<div class="cdk-overlay-pane">
  <nav class="topbar__panel" id="hp-top-bar-panel-1" aria-label="Primary">
    <a class="nav-link" href="/">Styles</a>
    <a class="nav-link" href="/braiders">Braiders</a>
    <a class="nav-link" href="/appointments" aria-current="page">Appointments</a>
    <a class="nav-link" href="/help">Help</a>
    <a class="nav-link" href="/settings">Maya · account</a>
  </nav>
</div>
```

```html
<!-- rendered: signed out -->
<header class="topbar">
  <a class="topbar__brand" href="/">…HairPop</a>
  <nav class="topbar__nav" aria-label="Primary">…four links…</nav>
  <span class="topbar__spacer"></span>
  <button class="btn btn--ghost btn--icon topbar__menu" type="button" aria-label="Menu" aria-expanded="false" aria-controls="hp-top-bar-panel-1">…</button>
  <a class="account-link topbar__account" href="/sign-in">Sign in</a>
</header>
```

```html
<!-- rendered: Updates with no unread, and with more than 99 -->
<a class="account-link" href="/notifications">Updates</a>
<a class="account-link" href="/notifications">Updates <span class="badge badge--count">99+</span><span class="visually-hidden">, 120 unread</span></a>
```

Consumer template (the application shell):

```html
<header hp-top-bar
  brandLabel="HairPop" [brandLink]="'/'"
  navLabel="Primary" [links]="primaryLinks" [current]="currentNav()"
  [updates]="session.signedIn() ? { label: 'Updates', link: '/notifications', unreadCount: unread(), unreadText: ', ' + unread() + ' unread' } : null"
  [account]="session.signedIn() ? { label: 'Maya', link: '/settings', panelLabel: 'Maya · account' } : { label: 'Sign in', link: '/sign-in' }"
  menuLabel="Menu"></header>
```

```ts
readonly primaryLinks: readonly TopBarLink[] = [
  { id: 'styles', label: 'Styles', link: '/' },
  { id: 'braiders', label: 'Braiders', link: '/braiders' },
  { id: 'appointments', label: 'Appointments', link: '/appointments' },
  { id: 'help', label: 'Help', link: '/help' },
];
```

Free to change: the order of classes in a class list; the panel id's numeric suffix (it is unique per instance); the overlay pane's CDK classes.

## Design

- Height: `min-height: var(--layout-topbar-height)` (56 px). Links, brand and account links are `--target-comfortable` (44 px) tall; the menu button is 40 px square (`--control-height-md`) with `--space-3` (12 px) to its neighbours.
- Spacing: gap `--space-3`; nav `margin-left: --space-4`, nav gap `--space-1`; nav link padding `0 --space-3`; brand icon gap `--space-2`; account link gap `--space-1`.
- Typography: brand `--text-h4`; nav links `--text-label`; account links `--font-size-sm` below 768 px and `--font-size-md` from 768 px. Brand, links and account labels never wrap (`white-space: nowrap`); the bar wraps between items instead (D-8).
- Shape: nav links `--radius-md`; bottom edge `--border-width-hairline`.
- Elevation and layer: no shadow; sticky at `--z-sticky`. The menu panel sits in the CDK overlay container at `--z-dropdown`, under dialogs (`--z-modal`) and toasts (`--z-toast`).
- Motion: nav link `background-color` and `color` transition over `--duration-fast` with `--ease-standard`. The panel appears and disappears without animation.
- Icons: `.icon` (20 px, `currentColor`). Brand: sparkle. Menu button: menu when collapsed, close when expanded. The paths are the design system's icon set, inlined in the template.
- Panel (D-3): full width of the bar; `components.css` caps it at `max-height: calc(100dvh - var(--layout-topbar-height))` with `overflow-y: auto`, so every link is reachable when text is enlarged. When enlarged text has wrapped the bar taller than 56 px, the component sets `max-height` from the bar's measured bottom edge on open.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--topbar-bg` | `--color-bg-surface` | A theme or sub-brand rule on an ancestor (design system *Theming*: `.studio .topbar { --topbar-bg: var(--color-bg-surface-sunken); }`). The menu panel reads the same token. |
| `--badge-bg`, `--badge-fg` (on the count) | `--color-danger-solid`, `--color-fg-on-danger` via `.badge--count` | Never by the top bar |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Bar and panel fill | `--color-bg-surface` (via `--topbar-bg`) | `--palette-white` | `--palette-gray-900` |
| Bottom edge | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Brand, current link label | `--color-fg-accent` | `--palette-plum-700` | `--palette-plum-300` |
| Brand, hover | `--color-fg-link-hover` | `--palette-plum-800` | `--palette-plum-200` |
| Nav link label | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Nav link hover fill | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Nav link hover label, account links | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Current link fill | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Current link fill, hover | `--color-accent-subtle-hover` | `--palette-plum-100` | `--palette-plum-900` |
| Unread count fill | `--color-danger-solid` | `--palette-red-600` | `--palette-red-300` |
| Unread count digits | `--color-fg-on-danger` | `--palette-white` | `--palette-red-950` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Nav link on the bar |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Hovered nav link |
| `--color-fg-accent` | `--color-accent-subtle` | 4.5:1 | Current link |
| `--color-fg-accent` | `--color-accent-subtle-hover` | 4.5:1 | Current link, hover |
| `--color-fg-accent` | `--color-bg-surface` | 4.5:1 | Brand on the bar |
| `--color-fg-link-hover` | `--color-bg-surface` | 4.5:1 | Brand and account links, hover |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Account and Updates links |
| `--color-fg-on-danger` | `--color-danger-solid` | 4.5:1 | Unread count digits |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Count pill against the bar |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on the bar and panel |

Forced colours: the tokens map `--color-focus-ring` to `Highlight` and borders to `CanvasText`; `components.css` gives the current nav link a `--border-width-thick` `Highlight` outline so the current page is not shown by fill alone.

## Responsive behaviour

- **Below 768 px** (`--layout-breakpoint-md`): `.topbar__nav` and `.topbar__account` are hidden; `.topbar__menu` shows. The menu button opens the panel under the bar with the four links and the account link (D-5). Updates and its count stay in the bar at every width.
- **From 768 px**: the four links show inline after the brand; the menu button is hidden; an open panel closes (D-4). At 768 px all four links, Updates and "Maya" fit on one row (measured: the account link ends at 736 px of 768).
- **320 px**: brand, "Updates 2" and the menu button fit on one 56 px row (measured: the menu button ends at 304 px, inside the 16 px margin). Nothing scrolls horizontally.
- **Enlarged text (200 %)**: the bar wraps between items and grows in height rather than scrolling sideways (D-8). Measured at 360 px with text at 200 %: a bar that does not wrap makes the page 581 px wide; with wrapping the bar is two rows (177 px) and nothing overflows. Every item stays visible and operable.
- **Sticky**: the bar stays at the top of the viewport at every width. `html { scroll-padding-top }` (bar height plus `--space-4`) keeps a focused element from being hidden under it (WCAG 2.4.11).
- Targets: nav links, brand and account links 44 × 44 CSS px minimum height (`--target-comfortable`); the menu button 40 × 40 with 12 px spacing. At 320 px nothing scrolls horizontally or clips; at 200 % text everything stays available.

## Accessibility

### Role and pattern

The host `<header class="topbar">` is the `banner` landmark. Primary links sit in `<nav aria-label="Primary">`, a `navigation` landmark of plain links. The phone menu follows the [APG Disclosure (navigation menu) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/): a `<button aria-expanded aria-controls>` that shows a panel of links. It is not an ARIA `menu`, and not a modal dialog: the page behind stays operable and links stay in Tab order (D-3).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | From 768 px, after the skip link: brand, Styles, Braiders, Appointments, Help, Updates, account. Below 768 px: brand, Updates, menu button, then (when expanded) the panel's links in order. |
| <kbd>Enter</kbd> | Follows a link. On the menu button, opens or closes the panel. |
| <kbd>Space</kbd> | On the menu button, opens or closes the panel. |
| <kbd>Tab</kbd> on the expanded menu button | Moves focus to the panel's first link (D-4). |
| <kbd>Shift</kbd>+<kbd>Tab</kbd> on the panel's first link | Moves focus back to the menu button. |
| <kbd>Tab</kbd> on the panel's last link | Closes the panel and moves focus to the first focusable element after the bar (D-4). |
| <kbd>Esc</kbd> | With the panel open (focus on the button or in the panel): closes it and moves focus to the menu button. |

### Focus

- Every link and the menu button show the shared ring: `--focus-ring-width` of `--color-focus-ring`, offset `--focus-ring-offset`, at least 3:1 against `--color-bg-surface`.
- Opening the panel leaves focus on the menu button (design system *Focus*); the panel's links follow it in keyboard order (D-4).
- Closing with Escape returns focus to the menu button. Closing by an outside pointer leaves focus where the customer clicked. Choosing a link navigates; focus on the new page is the page header's rule (D-12).
- The sticky bar never covers the focused element: the global `scroll-padding-top` matches its height.

### Labelling

- The nav is labelled by `navLabel` ("Primary"); the panel nav carries the same label because only one of the two is rendered visibly at a time.
- The current destination uses `aria-current="page"`, never colour alone.
- The Updates link's accessible name starts with its visible text: "Updates" + count + visually hidden ", 2 unread" reads "Updates 2, 2 unread" (WCAG 2.5.3). Neither the link nor the badge carries an `aria-label` (D-6).
- The menu button is named by `menuLabel` ("Menu") and states `aria-expanded`; `aria-controls` names the panel's id.
- Icons are `aria-hidden="true"`; the brand's name is its text, "HairPop".

### Announcements

None. The count changes silently in place; the notification center and toasts announce new updates. `aria-expanded` changes are announced by screen readers on the focused button.

### Motion

Link fill and colour change over `--duration-fast`; under `prefers-reduced-motion: reduce` the tokens make them instant. The panel appears and disappears without a slide or fade in every mode.

## Content and internationalisation

- Primary links are one-word nouns in this order everywhere: "Styles", "Braiders", "Appointments", "Help" (WCAG 3.2.3; Help in the same place on every screen, WCAG 3.2.6).
- The account link shows the customer's first name ("Maya"); signed out it reads "Sign in". The panel's account link reads "Maya · account".
- "Updates" shows the count only when it is above zero; above 99 it shows "99+" and the hidden text carries the full number (", 120 unread").
- The brand is the word "HairPop" with the sparkle icon; never a tagline.
- Translatable inputs: `brandLabel`, `navLabel`, every `TopBarLink.label`, `updates.label`, `updates.unreadText`, `account.label` when it is "Sign in", `account.panelLabel`, `menuLabel`. Data values: the customer's first name, the unread number.
- Length: labels never wrap inside themselves; when a label is longer (or text is enlarged) the bar wraps between items (D-8). No dates, prices or distances appear in the bar.

## Performance

- Change detection: `OnPush`, signal inputs, `computed` for the badge text, the hidden-text visibility and the per-link `aria-current` value; no function calls in the template.
- The overlay is created lazily on the first open and disposed on destroy; nothing overlay-related is built at 768 px and wider. `BreakpointObserver` subscribes once.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/TopBar.ts` renders Maya's signed-in bar on the style gallery, `current: 'styles'`, Updates with 2 unread, inside `provideRouter([])`; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none. The bar renders once per page and is not repeated.
- Regression rule: a change to its template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: the bar's height is reserved by `min-height` from first paint; the count badge has `min-width: --badge-height`, so a count changing from 9 to 10 does not shift the account link more than the digit width. Server-side rendering renders the final markup (no skeleton).
- Weight: `@angular/core`, `@angular/router` (`RouterLink`), `@angular/cdk/overlay`, `@angular/cdk/layout`, and the library's Button. No icon library at runtime.

## Acceptance criteria

### Rendering

- **AC-1** Given Maya signed in on the style gallery at 1280 px with `current: 'styles'`, when the top bar renders, then the host is `<header class="topbar">` exposed as the banner landmark, holding the brand link "HairPop", a navigation landmark named "Primary" with the links Styles, Braiders, Appointments and Help in that order, the Updates link and the account link "Maya". (L2-041)
- **AC-2** Given `current: 'styles'`, when the bar renders, then only the Styles link has `aria-current="page"` with a `--color-accent-subtle` fill and a `--color-fg-accent` label, and the other three have no `aria-current`. (L2-041)
- **AC-3** Given Maya on appointment detail HP-1048 with `current: null`, when the bar renders, then no link has `aria-current`. (L2-041)
- **AC-4** Given Maya on her appointments list with `current: 'appointments'`, when she activates Styles and then Appointments, then each opens its destination by client-side navigation and Appointments links to the list of her requests and appointments. (L2-018)
- **AC-5** Given any HairPop screen, when a visitor activates "Help" in the top bar, then the Help page opens, and the Help link is the fourth primary link on every screen. (L2-032)

### Updates and account

- **AC-6** Given `updates.unreadCount` 2 and `unreadText` ", 2 unread", when the bar renders, then the Updates link contains `<span class="badge badge--count">2</span>` followed by a visually hidden ", 2 unread", its accessible name is "Updates 2, 2 unread", and neither the link nor the badge has an `aria-label`. (L2-030)
- **AC-7** Given the Updates link shows 2, when Maya opens one unread update and `unreadCount` becomes 1, then the badge reads "1" and the name "Updates 1, 1 unread" without a page reload. (L2-030)
- **AC-8** Given `unreadCount` 0, when the bar renders, then the Updates link has no badge and no hidden text and its name is "Updates". (L2-030)
- **AC-9** Given `unreadCount` 120 and `unreadText` ", 120 unread", when the bar renders, then the badge reads "99+" and the accessible name is "Updates 99+, 120 unread". (L2-030)
- **AC-10** Given Maya confirms sign-out, when the bar re-renders with `updates: null` and the account "Sign in", then no Updates link and no count are present and the account link reads "Sign in" and links to the sign-in page. (L2-011)

### Keyboard and focus

- **AC-11** Given 1280 px and keyboard focus on the skip link, when Maya presses Tab repeatedly, then focus visits the brand, Styles, Braiders, Appointments, Help, Updates and "Maya" in that order and never the hidden menu button. (L2-041)
- **AC-12** Given a nav link focused by keyboard, when the ring shows, then it is a 2 px `--color-focus-ring` outline offset by 2 px with contrast of at least 3:1 against `--color-bg-surface`. (L2-041)
- **AC-13** Given the Braiders link (not current), when the pointer hovers it, then its fill becomes `--color-bg-subtle` and its label `--color-fg-default`, and hovering the current link fills it with `--color-accent-subtle-hover`. (L2-041)

### Phone menu

- **AC-14** Given a 360 px viewport, when the bar renders, then it shows the brand, "Updates" with its count, and `<button class="btn btn--ghost btn--icon topbar__menu" aria-label="Menu" aria-expanded="false">`, and the inline links and the account link are not displayed. (L2-042)
- **AC-15** Given 360 px on My appointments, when Maya activates "Menu" by click, Enter or Space, then a panel named "Primary" opens directly under the bar listing Styles, Braiders, Appointments (with `aria-current="page"`), Help and "Maya · account", the button has `aria-expanded="true"` and shows the close icon, and focus stays on the button. (L2-042)
- **AC-16** Given the open panel with focus on the menu button, when Maya presses Tab, then focus moves to Styles; Shift+Tab from Styles returns it to the button; Tab from "Maya · account" closes the panel and moves focus to the first focusable element after the bar. (L2-041)
- **AC-17** Given the open panel, when Maya presses Escape, then the panel closes, `aria-expanded` is "false" and focus is on the menu button. (L2-041)
- **AC-18** Given the open panel, when Maya clicks the page outside the bar and panel, or activates the Braiders link in the panel, then the panel closes, and in the second case the matching braiders page opens. (L2-042)
- **AC-19** Given Maya has scrolled the style gallery 1500 px down at 360 px, when she opens the menu, then the panel's top edge is at the bar's bottom edge inside the viewport. (L2-042)
- **AC-20** Given the open panel at 760 px, when the viewport widens to 768 px, then the panel closes, `menuOpenChange` emits `false` and the four links show inline. (L2-042)

### Responsive

- **AC-21** Given a 320 px viewport with default text size, when the bar renders, then the brand, "Updates 2" and the 40 × 40 px menu button fit on one row at least 56 px tall, the menu button is at least 12 px from "Updates", and the page does not scroll horizontally. (L2-042)
- **AC-22** Given a 360 px viewport with text enlarged to 200 %, when the bar renders, then it wraps onto further rows, every item is fully visible and operable, and the page does not scroll horizontally. (L2-042)
- **AC-23** Given a 768 px viewport, when the bar renders, then the brand, the four links, Updates and "Maya" sit on one row and the menu button is not displayed. (L2-042)

### Theming

- **AC-24** Given the light theme, when Maya switches to dark, then without a reload the bar's fill changes from `--palette-white` to `--palette-gray-900`, the brand and current label to `--palette-plum-300`, and the current fill to `--palette-plum-950`. (L2-042)
- **AC-25** Given the dark theme, when contrast is measured, then nav labels are at least 4.5:1 on the bar, the current label at least 4.5:1 on its fill, the count digits at least 4.5:1 on the pill, and the focus ring at least 3:1 against the bar. (L2-041)
- **AC-26** Given Windows forced colours, when the bar renders with Styles current, then the Styles link has a `Highlight` outline and the focus ring is `Highlight`. (L2-041)

### Motion

- **AC-27** Given `prefers-reduced-motion: reduce`, when a nav link is hovered and the menu panel is opened, then the colour change is instant and the panel appears without any transition. (L2-041)

### Performance

Render cost is measured by the `TopBar` perf-test scenario and gated by `--fail-on-regression`; no L2 requirement covers client render cost, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/top-bar/`; file `top-bar.ts` exporting the standalone component `TopBar` with `selector: 'header[hp-top-bar]'`, `changeDetection: OnPush`, and scoped `styles` that port the `.topbar`, `.topbar__*` (including `.topbar__account` and `.topbar__panel`), `.nav-link` and `.account-link` rules from `components.css` with `:host` for `.topbar`. The panel is a `TemplatePortal` of the component's own template, so the scoped `.topbar__panel` rule still applies inside the overlay container. Export it and the `TopBarLink`, `TopBarUpdates` and `TopBarAccount` types from the library's `public-api.ts`.
- Host binding: `class.topbar` always.
- `components.css` and the design-system page define the classes this component adds to the extracted bar: `.topbar__panel` (the menu panel, D-3), `.topbar__account` (account link hidden below 768 px, D-5), and `flex-wrap: wrap; row-gap: 0` on `.topbar` (D-8).
- Menu button: `<button hp-button variant="ghost" iconOnly class="topbar__menu" type="button" [attr.aria-label]="menuLabel()" [attr.aria-expanded]="menuOpen()" [attr.aria-controls]="panelId">` with the menu or close `svg.icon` inside, per the Button CRD.
- Overlay (D-3): inject `Overlay`; on first open create an `OverlayRef` with `positionStrategy: overlay.position().flexibleConnectedTo(hostElement).withPositions([{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }]).withFlexibleDimensions(false).withPush(false)`, `scrollStrategy: overlay.scrollStrategies.reposition()`, `hasBackdrop: false`, `width` equal to the host's width (updated on resize). Attach a `TemplatePortal` of the panel template. Close on `overlayRef.keydownEvents()` Escape, `overlayRef.outsidePointerEvents()` (ignoring pointer events on the host), router `NavigationEnd`, and `BreakpointObserver.observe('(min-width: 48rem)')` matching.
- The overlay pane sits outside the `<header>`, so an ancestor's `--topbar-bg` override does not reach it by inheritance (`components.css` falls back to `--color-bg-surface`): on open, the component copies the host's computed `--topbar-bg` onto the panel's inline style, so a re-skinned bar and its panel always match.
- Focus bridging (D-4): a `keydown` listener on the menu button and on the panel handles Tab and Shift+Tab as listed under *Keyboard*. The "first focusable after the bar" is found with CDK `InteractivityChecker.isFocusable` and `isTabbable` over the elements that follow the host in document order.
- Links: `RouterLink` on every `a.nav-link`, the brand and the account links; `[attr.aria-current]` from a `computed` keyed by `current()`.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/TopBar.ts`, exported from `src/scenarios/index.ts`, with iterations added to `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is the host a wrapper element (`<hp-top-bar>`) or the native `<header>`?* The native element, through the attribute selector `header[hp-top-bar]`, with `.topbar` on the host. A sticky element sticks only within its parent: measured at 1280 px after scrolling 1500 px, `.topbar` inside a block wrapper sits at −1500 px (scrolled away), while the native `<header>` as a direct child of `.product-shell` stays at 0. The native host also keeps the `banner` landmark without ARIA.
- **D-2** *How does the bar know the current page?* From a `current` input holding a link `id`, set by the application shell from route data, not from `RouterLinkActive`. The mocks mark Braiders current on the matching braiders route (`/styles/knotless-braids/braiders`), whose URL is not under the Braiders link, and mark nothing on detail pages (style detail, braider profile, appointment detail), which URL matching would get wrong either way.
- **D-3** *How does the phone menu open: in the page flow, or as an overlay?* As a non-modal CDK Overlay panel (`nav.topbar__panel`) attached under the bar's bottom edge, covering the content below it rather than pushing it down (needs product confirmation). The design system first drew the panel as an in-flow `<nav>` after the bar that "pushes content down"; it now shows the overlay panel. Measured at 360 px, an in-flow panel after the sticky bar sits at −1444 px once the customer has scrolled 1500 px, so opening the menu mid-page would show nothing; and AGENTS.md requires CDK Overlay for floating behaviour. Overlay, not Dialog: the design system specifies the APG Disclosure pattern (focus stays on the button, the page stays operable), not a modal.
- **D-4** *An overlay pane lives at the end of `<body>`, so the panel no longer follows the button in DOM order. How does keyboard order still make the panel follow the button, as the design system's disclosure pattern expects?* The component bridges it: Tab from the expanded button enters the panel's first link, Shift+Tab from the first link returns to the button, and Tab from the last link closes the panel and continues to the first focusable element after the bar, as if the panel sat between them. The panel also closes at 768 px and on navigation, so it never outlives the layout that needs it.
- **D-5** *Below 768 px, does the account link stay in the bar?* No, it moves into the panel as its last link, labelled by `account.panelLabel` ("Maya · account"). The design system says so in *Responsive* and in its phone example, and the badge page says the count stays visible "even when Updates is the only nav item left in the top bar". It would fit at default text (measured at 320 px it ends at 304 px), but keeping the compact bar to brand, Updates and menu leaves room for enlarged text and longer names.
- **D-6** *The badge page names the count "Updates 2 unread" (hidden " unread" inside the badge); the top-bar page names it "Updates 2, 2 unread" (hidden ", 2 unread" after the badge). Which?* The top-bar page's form: it is this component's page and its Do/Don't specifies it. The badge renders as `.badge.badge--count` with only the visible number, and one visually hidden span after it carries `updates.unreadText`.
- **D-7** *What does a signed-out visitor see on the sign-in, sign-up, password and verification pages?* No Updates link and an account link reading "Sign in" (design system *Content*); a visitor without a session has no updates to count. The mocks first shared one signed-in shell ("Updates 2", "Maya") on every screen; the auth mocks now render the signed-out bar.
- **D-8** *What happens when text is enlarged and the bar's items no longer fit?* The bar wraps between items (`flex-wrap: wrap`, `row-gap: 0` in `components.css`) and grows taller; items never shrink, truncate or wrap inside. Measured at 360 px with text at 200 %: a bar without wrapping makes the page 581 px wide (horizontal scroll, breaking L2-042); with wrapping the bar becomes two rows (177 px; three rows at 320 px) and nothing overflows. At default text nothing wraps at any width from 320 px.
- **D-9** *The first mocks drew the brand with a "✦" glyph, labelled Updates "Notifications, 2 unread", put an `aria-label` on the badge, declared the gap twice, and hid the links below 768 px with no menu.* The design system's fixes apply: sparkle icon, visible-text-first name, no badge label, one `--space-3` gap, and the disclosure menu button. The design-system page records them as drift fixed during extraction, and the mocks' shared shell now renders the fixed markup.
- **D-10** *How is a large count shown?* "99+" above 99 with the full number in the hidden text, as the design system's *Content* section says. The cap is applied by the component; the hidden text is the consumer's string.
- **D-11** *Does the bar take a search field (`components.css` once had a `.topbar .search` rule)?* No. No design-system page or mock places search in the bar; search belongs to the style gallery and matching braiders pages. The unused rule has been removed from `components.css`.
- **D-12** *Where does focus go after a link in the bar navigates?* The top bar does not move focus. A client-side route change moves focus to the new page's `<h1>` (page-header CRD D-6), which is the only kind of navigation the bar's `RouterLink`s perform; only a full page load starts at the skip link. The design system's top-bar and page-header pages both say so.
- **D-13** *Do the Updates and account links get `aria-current` on their own pages?* No. The design system styles no current state for `.account-link` and the mocks mark none on the notification center or account settings; the page's `<h1>` names the page.
- **D-14** *Is the menu button its own markup or the Button component?* The Button component (`button[hp-button]`, ghost, `iconOnly`) with the extra class `topbar__menu`, so it renders `btn btn--ghost btn--icon topbar__menu` exactly as the design system's code sample does and inherits the Button CRD's states and focus ring.

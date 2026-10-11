# Sidebar navigation

| Field | Value |
|---|---|
| Selector | `hp-sidebar-navigation` |
| Library path | `frontend/projects/components/src/lib/sidebar-navigation/` |
| Status | built |
| Traces to | L2-018, L2-030, L2-041, L2-042 |
| Design system | [`sidebar-navigation.html`](../../design-system/components/sidebar-navigation.html) |
| Source mocks | none use it yet; link states from [`pages/my-appointments/default`](../../mocks/pages/my-appointments/default.html) and the destinations it would group from [`pages/account-settings/default`](../../mocks/pages/account-settings/default.html), [`pages/notification-center/default`](../../mocks/pages/notification-center/default.html), [`pages/care-and-review/default`](../../mocks/pages/care-and-review/default.html), [`pages/terms/default`](../../mocks/pages/terms/default.html), [`pages/privacy/default`](../../mocks/pages/privacy/default.html) |
| Rendering | [`sidebar-navigation.html`](sidebar-navigation.html) |

## Purpose and scope

Sidebar navigation lists many destinations in labelled groups beside the page. HairPop's customer journey does not need it yet; the design system reserves it for an area with more than six destinations or that needs grouping: a future account area (Appointments, Updates, Saved braiders, Account settings, Privacy choices) or a braider studio. From 1024 px it is a sticky column beside the content; below 1024 px it is hidden and opens as a drawer.

Use something else when:

- the destinations are the customer journey's four (Styles, Braiders, Appointments, Help): use the top bar ([`top-bar.md`](top-bar.md));
- the customer switches views of one page: use tabs ([`tabs.md`](tabs.md));
- there are two or three links: a sidebar costs 256 px of every page for no benefit (design system *Do and don't*); link from the page instead.

Out of scope:

- The `.sidebar-layout` grid that places the column beside `<main>`. It is a layout primitive in `components.css`; the page renders it and puts the component in its first column.
- Which destination is current. The application shell passes it in `current` from route data, as for the top bar.
- The counts. The notifications or appointments services supply them.
- The modal mechanics of the drawer beyond what is listed here (scroll lock, inert background, stacking with other dialogs). CDK Dialog provides them; the dialog CRD owns the shared overlay container setup.

## Usage

No mock uses a sidebar yet (design system *Sources*). Every configuration below comes from the design-system page and the account destinations it names; each must be buildable now so the account area or studio can adopt the component without an API change.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Future account area, grouped (design system *Variants*, left) | two groups, icons on every link, one count | "Your HairPop": Appointments (calendar), Updates (bell, count 2); "Account": Account settings (user), Help (help) | Appointments current; Updates hover | surface column beside canvas |
| Future account area, collapsible (design system *Variants*, right) | two collapsible groups, no icons | "Your HairPop" (open): Appointments, Care and review (current); "Legal" (collapsed): Terms of use, Privacy | group expanded, group collapsed, current inside an open group | surface |
| Account area, full list (design system *Overview*) | one or two groups, up to five links | Appointments, Updates, Saved braiders, Account settings, Privacy choices | current on any | surface |
| Braider studio (design system *Overview*, future) | several groups, counts on pending requests | e.g. "Requests" count, "Availability", "Services" | counts 0–99+, current | surface |
| Every sidebar page below 1024 px | drawer from the toggle button (D-4) | toggle "Account menu"; close "Close account menu" | drawer closed, open; full width below 640 px | drawer on raised layer over backdrop |
| Design system *Theming* | semantic tokens overridden on a wrapper | — | all | any surface |

Every row is buildable with the API below: `groups` (with `collapsible` and `collapsed`), item `icon` and `count`, `current`, and the drawer labels.

## Anatomy

1. **Toggle (below 1024 px only)** — the Button component (`button[hp-button]`, ghost) with the extra class `sidebar__toggle`: a menu `svg.icon` and the visible `toggleLabel`. Hidden from 1024 px (D-4).
2. **Container** — `nav.sidebar` with `aria-label` from `label`: `--color-bg-surface`, right hairline `--color-border-default`, `--space-4` padding, flex column with `--space-1` between links. From 1024 px a sticky column `--layout-sidebar-width` (256 px) wide that scrolls on its own; below 1024 px hidden.
3. **Group label** — `p.sidebar__group` (or `summary.sidebar__group` in a collapsible group): `--text-overline`, `--letter-spacing-wide`, uppercase by CSS, `--color-fg-subtle`, padding `--space-4` top, `--space-3` sides, `--space-1` bottom. Not a link.
4. **Collapsible group** — native `<details>` with the group label as its `<summary>` and the group's links inside.
5. **Link** — `a.nav-link`, full width: 44 px tall (`--target-comfortable`), `--space-3` side padding, `--radius-md`, `--text-label`, `--color-fg-muted`. The current destination carries `aria-current="page"`.
6. **Icon (optional)** — a leading `svg.icon` (`aria-hidden="true"`), `--space-2` before the label. On every link or on none.
7. **Count (optional)** — `span.badge.badge--count` pushed to the end of the link (`margin-left: auto`), followed by a `span.visually-hidden` with the item's count text.
8. **Drawer (below 1024 px, open only)** — a CDK Dialog (D-3) whose panel is the same `nav.sidebar` with `data-open="true"`, a close button `button[hp-button]` ghost `iconOnly` with the extra class `sidebar__close` at its top end (D-5), over a backdrop of `--color-bg-backdrop`.

Host: `hp-sidebar-navigation` is an element (D-1), `display: block`, placed as the first child of `.sidebar-layout`. It renders the toggle and the column; the drawer is a `TemplatePortal` the component opens in a CDK Dialog.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | `aria-label` of the `<nav>` ("Account"). Must differ from the top bar's "Primary". |
| `groups` | `readonly SidebarNavGroup[]` | — | yes | Groups in display order, each with at least one item. A group with an empty `label` renders its links without a label. |
| `current` | `string \| null` | `null` | no | The `id` of the current item. That link gets `aria-current="page"`; none other does. The group holding it is always open (D-10). |
| `toggleLabel` | `string` | — | yes | Visible text of the drawer toggle and the drawer dialog's accessible name ("Account menu"). |
| `closeLabel` | `string` | — | yes | `aria-label` of the drawer's close button ("Close account menu"). |
| `open` | `boolean` (two-way `model`) | `false` | no | Whether the drawer is open. Setting it to `true` at 1024 px or wider is ignored. |

```ts
type Commands = string | readonly unknown[];
interface SidebarNavGroup {
  readonly label: string;            // "Your HairPop"
  readonly collapsible?: boolean;    // default false: <p> label; true: <details>/<summary>
  readonly collapsed?: boolean;      // initial state of a collapsible group; default false (open)
  readonly items: readonly SidebarNavItem[];
}
interface SidebarNavItem {
  readonly id: string;               // "appointments"
  readonly label: string;            // "Appointments"
  readonly link: Commands;           // '/appointments'
  readonly icon?: IconName;          // a name from the icon CRD's registry
  readonly count?: number;           // 0 or absent: no badge; above 99: "99+"
  readonly countText?: string;       // visually hidden, read after the count: ", 2 unread"
}
```

- Inputs are signal inputs and models; object inputs are treated as immutable.
- Links render through `RouterLink`. Icons render through the icon component as `<svg hp-icon [name]="item.icon"></svg>`, whose DOM is the same single `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">` shown under *Markup*.
- In development mode, `groups` in which some items have an `icon` and others do not log a `console.error` naming `hp-sidebar-navigation` (D-8).
- Every user-facing string is an input; the component renders no copy of its own.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `openChange` | `boolean` | The drawer opens or closes for any reason (toggle, close button, Escape, backdrop, link activation, viewport reaching 1024 px). Part of the `open` model. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | The links render in two places (column and drawer), which one projection slot cannot do; the component is data-driven, like the top bar. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Grouped | `p.sidebar__group` labels | Destinations grouped by the customer's task ("Your HairPop", "Account"). |
| Collapsible groups | `details` + `summary.sidebar__group` (`collapsible: true`) | Long areas where some sections can fold away ("Legal"). |
| With icons | item `icon` on every link | Areas where icons speed scanning; never on some links only. |
| With counts | item `count` | Unread updates, pending requests. |
| Column (1024 px and wider) | — (viewport) | Persistent sticky column. |
| Drawer (below 1024 px) | `data-open="true"` in a CDK Dialog | Opened from the toggle; full width below 640 px. |

One size: the column is `--layout-sidebar-width` (256 px) wide and links are 44 px tall. Below 640 px the drawer is the viewport's width; from 640 to 1023 px it is 256 px wide.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Link, default | — | `--color-fg-muted` label | Link, named by label (and count text) |
| Link, hover | `:hover` | Fill `--color-bg-subtle`, label `--color-fg-default` | — |
| Link, active | `:active` | Keeps the hover look | — |
| Link, focus | `:focus-visible` | Shared ring (`--focus-ring-width`, `--color-focus-ring`, `--focus-ring-offset`) | — |
| Link, current | `aria-current="page"` | Fill `--color-accent-subtle`, label `--color-fg-accent`; hover `--color-accent-subtle-hover` | "current page" |
| Link with count | `count` > 0 | `.badge--count` pill at the end | "Updates 2, 2 unread" |
| Group expanded | `<details open>` | Links visible under the summary | Summary exposed as expanded by the browser |
| Group collapsed | `<details>` without `open` | Links hidden | Summary exposed as collapsed |
| Summary, focus | `:focus-visible` | Shared ring | — |
| Drawer closed | below 1024 px, `open` false | Column hidden; toggle visible | Toggle `aria-expanded="false"` |
| Drawer open | `open` true | Drawer over a `--color-bg-backdrop` backdrop, sliding in from the left over `--duration-slow` (D-7) | Modal dialog named by `toggleLabel`; toggle `aria-expanded="true"`; background inert |
| Forced colours | `(forced-colors: active)` | Current link gains a `Highlight` outline; focus ring `Highlight` | — |
| Print | `@media print` | Sidebar hidden | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Drawer appears without sliding; colour changes instant | — |

Links are never disabled; a destination the customer cannot reach is removed from `groups` (design system *States*).

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: grouped with icons and a count, 1024 px and wider, Appointments current -->
<hp-sidebar-navigation>
  <button class="btn btn--ghost sidebar__toggle" type="button" aria-expanded="false" aria-haspopup="dialog" aria-controls="hp-sidebar-drawer-1">
    <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>Account menu
  </button>
  <nav class="sidebar" aria-label="Account">
    <p class="sidebar__group">Your HairPop</p>
    <a class="nav-link" href="/appointments" aria-current="page"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/></svg>Appointments</a>
    <a class="nav-link" href="/notifications"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"/></svg>Updates<span class="badge badge--count">2</span><span class="visually-hidden">, 2 unread</span></a>
    <p class="sidebar__group">Account</p>
    <a class="nav-link" href="/settings"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 20a8 8 0 0 1 16 0"/></svg>Account settings</a>
    <a class="nav-link" href="/help"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 16.5v.01"/></svg>Help</a>
  </nav>
</hp-sidebar-navigation>
```

The toggle is in the DOM at every width; CSS hides it from 1024 px and hides the column below 1024 px.

```html
<!-- rendered: collapsible groups, Care and review current -->
<nav class="sidebar" aria-label="Account">
  <details open>
    <summary class="sidebar__group">Your HairPop</summary>
    <a class="nav-link" href="/appointments">Appointments</a>
    <a class="nav-link" href="/appointments/hp-0992/care" aria-current="page">Care and review</a>
  </details>
  <details>
    <summary class="sidebar__group">Legal</summary>
    <a class="nav-link" href="/terms">Terms of use</a>
    <a class="nav-link" href="/privacy">Privacy</a>
  </details>
</nav>
```

```html
<!-- rendered: drawer open below 1024 px (CDK Dialog in the overlay container) -->
<div class="cdk-overlay-backdrop backdrop cdk-overlay-backdrop-showing"></div>
<div class="cdk-global-overlay-wrapper">
  <div class="cdk-overlay-pane">
    <cdk-dialog-container role="dialog" aria-modal="true" aria-label="Account menu" id="hp-sidebar-drawer-1" tabindex="-1">
      <nav class="sidebar" data-open="true" aria-label="Account">
        <button class="btn btn--ghost btn--icon sidebar__close" type="button" aria-label="Close account menu">
          <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <p class="sidebar__group">Your HairPop</p>
        <a class="nav-link" href="/appointments" aria-current="page">…Appointments</a>
        …
      </nav>
    </cdk-dialog-container>
  </div>
</div>
```

Consumer template:

```html
<div class="sidebar-layout">
  <hp-sidebar-navigation label="Account" toggleLabel="Account menu" closeLabel="Close account menu"
    [groups]="accountGroups()" [current]="currentNav()" />
  <main id="main" class="container product-main">…</main>
</div>
```

```ts
readonly accountGroups = computed<readonly SidebarNavGroup[]>(() => [
  { label: 'Your HairPop', items: [
    { id: 'appointments', label: 'Appointments', link: '/appointments', icon: 'calendar' },
    { id: 'updates', label: 'Updates', link: '/notifications', icon: 'bell', count: this.unread(), countText: `, ${this.unread()} unread` },
  ] },
  { label: 'Account', items: [
    { id: 'settings', label: 'Account settings', link: '/settings', icon: 'user' },
    { id: 'help', label: 'Help', link: '/help', icon: 'help' },
  ] },
]);
```

Free to change: the class order; the CDK overlay wrapper classes; the drawer id's numeric suffix.

## Design

- Width `--layout-sidebar-width` (256 px); padding `--space-4`; `--space-1` between links, including between links inside an open `<details>` (D-11).
- Column (from `--layout-breakpoint-lg`, 1024 px): `position: sticky`, `top: var(--layout-topbar-height)`, `height: calc(100dvh - var(--layout-topbar-height))`, `overflow: auto`, so it sits under the sticky top bar and scrolls on its own when links overflow (D-6).
- Links: `--target-comfortable` min-height, `--space-3` side padding, `--radius-md`, `--text-label`, `--space-2` icon gap; the label wraps rather than truncating when the column is narrower than it (labels are kept to three words).
- Group labels: `--text-overline`, `--letter-spacing-wide`, uppercase by CSS; summaries at least `--target-min` (24 px) tall.
- Drawer: CDK Dialog pane at the left edge, full viewport height (`100dvh`), `--layout-sidebar-width` wide from 640 px and `100%` below 640 px; panel fill `--color-bg-surface`; backdrop `--color-bg-backdrop`; layered at `--z-modal` over the backdrop's `--z-overlay`. It slides in from the left (`translate: -100% 0` to `0`) over `--duration-slow` with `--ease-enter` (D-7).
- Toggle: ghost Button (`--control-height-md`, 40 px) with a menu icon and the visible label; placed at the top of the host with `--layout-margin` side padding. Close button: ghost `iconOnly` Button, 40 × 40 px, at the drawer's top end.
- Motion: link colours over `--duration-fast` with `--ease-standard`.

Component tokens: none of its own. The sidebar reads semantic tokens directly; re-theme it by overriding semantic tokens on a wrapper (design system *Theming*). The count reads `--badge-bg` and `--badge-fg` through `.badge--count`.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Column and drawer fill | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Right edge | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Group label | `--color-fg-subtle` | `--palette-gray-500` | `--palette-gray-400` |
| Link label | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Link hover fill | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Link hover label | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Current fill | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Current label | `--color-fg-accent` | `--palette-plum-700` | `--palette-plum-300` |
| Count fill, digits | `--color-danger-solid`, `--color-fg-on-danger` | `--palette-red-600`, `--palette-white` | `--palette-red-300`, `--palette-red-950` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |
| Drawer backdrop | `--color-bg-backdrop` | translucent near-black (55 %) | translucent black (65 %) |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Link label |
| `--color-fg-subtle` | `--color-bg-surface` | 4.5:1 | Group label |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Hovered link |
| `--color-fg-accent` | `--color-accent-subtle` | 4.5:1 | Current link |
| `--color-fg-accent` | `--color-accent-subtle-hover` | 4.5:1 | Current link, hover |
| `--color-fg-on-danger` | `--color-danger-solid` | 4.5:1 | Count digits |
| `--color-danger-solid` | `--color-bg-surface` | 3:1 | Count pill against the column |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring on the column and drawer |

Forced colours: `components.css` gives the current link a `Highlight` outline; the focus ring maps to `Highlight`.

## Responsive behaviour

- **From 1024 px** (`--layout-breakpoint-lg`): the column shows beside the content in `.sidebar-layout`; the toggle is hidden; an open drawer closes.
- **Below 1024 px**: the column is hidden and the toggle shows above the content; the toggle opens the drawer. Measured layout: the host is a block in the single-column grid, so the toggle sits between the top bar and `<main>`.
- **Below 640 px** (`--layout-breakpoint-sm`): the drawer is the full viewport width.
- Group labels and counts stay visible at every width; link labels wrap and never truncate.
- At 320 px nothing scrolls horizontally or clips; at 200 % text everything stays available (the column and drawer scroll vertically); links are 44 px tall, summaries at least 24 px, the toggle and close button 40 px.

## Accessibility

### Role and pattern

`<nav aria-label="Account">` landmark of plain links. Collapsible groups use native `<details>`/`<summary>` ([APG Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)). The drawer covers the content, so it follows the [APG Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) through CDK Dialog (design system *Accessibility*: "follows the dialog rules when it covers content").

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through summaries and links in order. In the open drawer, focus is trapped among the close button, summaries and links. |
| <kbd>Enter</kbd> | Follows a link; on the toggle, opens the drawer. |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | On a summary: expands or collapses the group. On the toggle or close button: opens or closes the drawer. |
| <kbd>Esc</kbd> | In the drawer: closes it and returns focus to the toggle. |

### Focus

- The shared ring on links, summaries, the toggle and the close button.
- Opening the drawer moves focus to its first link (design system *Focus*); closing it by any means returns focus to the toggle (CDK `restoreFocus`).
- Activating a link in the drawer navigates and closes the drawer; focus on the new page is the page header's rule.

### Labelling

- The nav has its own `label`, different from the top bar's "Primary".
- The current page uses `aria-current="page"`, never colour alone.
- A count is followed by visually hidden text that says what it counts: "Updates 2, 2 unread"; neither link nor badge has an `aria-label`.
- The toggle's name is its visible text ("Account menu") and it carries `aria-expanded`, `aria-haspopup="dialog"` and `aria-controls`. The drawer dialog is named by `toggleLabel`; the close button by `closeLabel`.
- Icons are `aria-hidden="true"`.

### Announcements

None beyond the dialog's own name and role when the drawer opens.

### Motion

Link colours change over `--duration-fast`; the drawer slides in over `--duration-slow`. Under `prefers-reduced-motion: reduce` the tokens zero both durations, so the drawer appears in place.

## Content and internationalisation

- Links name destinations as nouns in sentence case: "Appointments", "Account settings", "Care and review". Use the same name as the top bar and the page's `<h1>`.
- Group labels are short and describe ownership or purpose: "Your HairPop", "Account", "Legal". Keep labels to three words.
- Counts: numbers only; "99+" above 99, with the full number in `countText`.
- Translatable inputs: `label`, `toggleLabel`, `closeLabel`, every group `label`, item `label` and `countText`. Data values: counts.
- Long labels wrap inside the 256 px column; nothing truncates.

## Performance

- Change detection: `OnPush`, signal inputs, `computed` for the per-item `aria-current`, badge text and the forced-open group; no function calls in the template.
- The drawer template is instantiated only while open; the column is rendered once. `BreakpointObserver` subscribes once.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/SidebarNavigation.ts` renders Maya's account sidebar: "Your HairPop" (Appointments current, Updates with 2 unread) and "Account" (Account settings, Help), with icons, inside `provideRouter([])`; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none; the sidebar renders once per page.
- Regression rule: a change to its template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: the column's width is fixed from first paint; server-side rendering renders the final links.
- Weight: `@angular/core`, `@angular/router`, `@angular/cdk/dialog`, `@angular/cdk/layout`, and the library's Button.

## Acceptance criteria

### Rendering

- **AC-1** Given Maya's account area at 1280 px with groups "Your HairPop" (Appointments, Updates) and "Account" (Account settings, Help), when the sidebar renders, then the host holds `nav.sidebar` named "Account", the group labels are `p.sidebar__group` paragraphs that are not links, and the links appear in that order, each with an `aria-hidden` icon. (L2-041)
- **AC-2** Given `current: 'appointments'`, when the sidebar renders, then only the Appointments link has `aria-current="page"`, with a `--color-accent-subtle` fill and a `--color-fg-accent` label, and it links to Maya's list of requests and appointments. (L2-018)
- **AC-3** Given the Updates item with `count` 2 and `countText` ", 2 unread", when it renders, then the link ends with `<span class="badge badge--count">2</span>` aligned to its end edge followed by visually hidden ", 2 unread", and its accessible name is "Updates 2, 2 unread". (L2-030)
- **AC-4** Given Maya reads both unread updates and `count` becomes 0, when the sidebar re-renders, then the Updates link has no badge and no hidden text. (L2-030)
- **AC-5** Given a top bar labelled "Primary" on the same page, when landmarks are listed, then the sidebar's navigation landmark is named "Account" and the two names differ. (L2-041)

### Collapsible groups

- **AC-6** Given a collapsible "Legal" group with `collapsed: true` and Terms of use and Privacy inside, when the sidebar renders, then it is a `<details>` without `open` whose `<summary class="sidebar__group">` reads "Legal", and its links are not displayed. (L2-041)
- **AC-7** Given focus on the "Legal" summary, when Maya presses Enter or Space, then the group expands and Terms of use and Privacy become reachable with Tab; pressing again collapses it. (L2-041)
- **AC-8** Given `current: 'care'` inside a collapsible "Your HairPop" group with `collapsed: true`, when the sidebar renders, then that group is open and "Care and review" carries `aria-current="page"`. (L2-041)

### Keyboard and focus

- **AC-9** Given 1280 px, when Maya presses Tab through the sidebar, then focus visits each summary and visible link in visual order and each shows a 2 px `--color-focus-ring` outline with at least 3:1 contrast against `--color-bg-surface`. (L2-041)
- **AC-10** Given the Account settings link, when the pointer hovers it, then its fill becomes `--color-bg-subtle` and its label `--color-fg-default`. (L2-041)

### Column and drawer

- **AC-11** Given 1280 px under the 56 px sticky top bar, when Maya scrolls the page 1500 px, then the column stays in view with its top edge at the top bar's bottom edge, the "Your HairPop" label fully visible, and it scrolls on its own when its links are taller than the viewport. (L2-042)
- **AC-12** Given a 768 px viewport, when the page renders, then the column is not displayed and the toggle "Account menu" is shown with `aria-expanded="false"` and `aria-haspopup="dialog"`. (L2-042)
- **AC-13** Given 768 px, when Maya activates "Account menu", then a modal dialog named "Account menu" opens at the left edge 256 px wide over a backdrop, holding the same groups and links, the toggle has `aria-expanded="true"`, and focus is on the first link, "Appointments". (L2-041)
- **AC-14** Given the open drawer, when Maya presses Tab past the last link, then focus wraps to the close button inside the drawer and never reaches the page behind. (L2-041)
- **AC-15** Given the open drawer, when Maya presses Escape, activates "Close account menu" or clicks the backdrop, then the drawer closes and focus returns to the toggle. (L2-041)
- **AC-16** Given the open drawer, when Maya activates "Updates", then the notification center opens and the drawer closes. (L2-042)
- **AC-17** Given a 360 px viewport, when the drawer opens, then it fills the viewport width, every link is 44 px tall and the page does not scroll horizontally. (L2-042)
- **AC-18** Given the open drawer at 1000 px, when the viewport widens to 1024 px, then the drawer closes, `openChange` emits `false` and the column shows. (L2-042)

### Theming

- **AC-19** Given the light theme, when Maya switches to dark, then without a reload the column fill becomes `--palette-gray-900`, the current link's label `--palette-plum-300` on `--palette-plum-950`, and group labels, link labels and the current label each keep at least 4.5:1 against their backgrounds. (L2-042)
- **AC-20** Given Windows forced colours, when the sidebar renders, then the current link has a `Highlight` outline. (L2-041)

### Motion

- **AC-21** Given `prefers-reduced-motion: reduce`, when the drawer opens, then it appears in place without sliding. (L2-041)

### Performance

Render cost is measured by the `SidebarNavigation` perf-test scenario and gated by `--fail-on-regression`; no L2 requirement covers client render cost, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/sidebar-navigation/`; file `sidebar-navigation.ts` exporting the standalone component `SidebarNavigation` with `selector: 'hp-sidebar-navigation'`, `changeDetection: OnPush`, `host: { style: 'display: block' }`, and scoped `styles` porting `.sidebar`, `.sidebar__group` and `.nav-link` from `components.css`. Export it and the `SidebarNavGroup` and `SidebarNavItem` types from `public-api.ts`.
- New element classes, added to the design-system page and `components.css` in the same slice: `.sidebar__toggle` (D-4) and `.sidebar__close` (D-5); the sticky offset under the top bar (D-6); `--space-1` between links inside `<details>` (D-11); the drawer slide keyframes (D-7).
- The template renders the column and the drawer from one `<ng-template #links>` with `ngTemplateOutlet`, so groups render identically in both.
- Drawer (D-3): inject CDK `Dialog`; on toggle, `dialog.open(drawerTemplate, { ariaLabel: toggleLabel(), autoFocus: '.nav-link', restoreFocus: true, hasBackdrop: true, backdropClass: 'backdrop', positionStrategy: overlay.position().global().left('0').top('0'), height: '100dvh', width: <256 px or 100 % below 640 px>, id })`. Close on `DialogRef.closed`, router `NavigationEnd` and `BreakpointObserver.observe('(min-width: 64rem)')`.
- Collapsible groups: `[open]` bound once from `collapsed` and forced true when the group holds `current`; the component listens to `toggle` events only to keep the forced-open rule and otherwise leaves the native state alone (D-10).
- Development check (D-8): in `ngOnInit` and when `groups` changes, `console.error` when icons are mixed; skipped in production (`isDevMode()`).
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/SidebarNavigation.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is the host the native `<nav>` or an element?* An element, `hp-sidebar-navigation`, because the component owns three things: the toggle, the column and the drawer. The column still sticks: the host is a grid item of `.sidebar-layout`, which stretches it to the row's height, so the sticky `nav.sidebar` inside it has room to stick (measured at 1280 px after scrolling 1500 px: the nav stays at the viewport top). A `.sidebar-layout` rule targets no element type, so nothing in `components.css` depends on the host being a `<nav>`.
- **D-2** *Projected links or data?* Data (`groups`, `current`), because the same links render in the column and in the drawer, and projected content renders in one place only. It also keeps the count and current markup identical to the top bar's.
- **D-3** *Which CDK primitive does the drawer use?* CDK Dialog, as a modal: it covers the content, and the design system says the drawer then follows the dialog rules (focus inside, trapped, Escape closes, focus returns to the trigger), which L2-041 requires of any open dialog. Overlay alone would leave the background operable under a covering panel.
- **D-4** *The design system says the drawer opens "from a menu button in the top bar", but the top bar's menu button is hidden from 768 px and opens the primary links. Where is the drawer's trigger?* The sidebar renders its own toggle, a ghost Button with a menu icon and the visible `toggleLabel` ("Account menu"), above the content below 1024 px (needs product confirmation). Between 768 and 1023 px the top bar has no menu button at all, so a top-bar trigger would leave the account links unreachable there, and reusing the top bar's button would make one control open two different menus.
- **D-5** *The design system's drawer has no close button. How does a touch user close it?* A ghost `iconOnly` close button (`.sidebar__close`) at the drawer's top end, named by `closeLabel`. Dialog rules require a close action besides Escape, and the backdrop is not a discoverable control.
- **D-6** *The column is `position: sticky; top: 0; height: 100dvh`. Does that work under the sticky top bar?* No: measured at 1280 px after scrolling, the "Your HairPop" label (16–56 px) sits entirely under the 56 px bar. The column sticks at `top: var(--layout-topbar-height)` with `height: calc(100dvh - var(--layout-topbar-height))`; measured, it then spans 56 px to the viewport bottom. Every HairPop shell has the top bar (layout foundation), so the offset is unconditional.
- **D-7** *The design system says the drawer "slides in over `--duration-slow`", but `components.css` has no slide-in keyframes.* The component defines its own: `translate` from `-100% 0` over `--duration-slow` with `--ease-enter`. Reduced motion zeroes `--duration-slow`, so it appears in place.
- **D-8** *How is "icons on every link or on none" enforced?* A development-mode `console.error` naming the component; it still renders. No L2 requirement covers it; it is a design-system rule, like Button's icon-only label check.
- **D-9** *How is a count named?* As in the top bar (top-bar D-6): the visible number in `.badge.badge--count`, then one visually hidden span with `countText`; no `aria-label`.
- **D-10** *Who owns a `<details>` group's open state?* The browser, after the initial render from `collapsed`; the component only forces open the group holding the current page, as the design system requires, and never closes a group the customer opened.
- **D-11** *Links inside `<details>` touch each other (measured gap 0 px) while other links are 4 px apart.* The component adds `--space-1` between links inside an open group so the spacing matches the design system's "4px between links" everywhere.
- **D-12** *Does the drawer reach full width below 640 px?* Yes, as the design system's *Responsive* section says; from 640 px it is 256 px, the column's width.

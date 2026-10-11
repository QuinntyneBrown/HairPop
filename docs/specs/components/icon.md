# Icon

| Field | Value |
|---|---|
| Selector | `svg[hp-icon]` |
| Library path | `frontend/projects/components/src/lib/icon/` |
| Status | built |
| Traces to | L2-031, L2-035, L2-037, L2-041, L2-042 |
| Design system | [`iconography.html`](../../design-system/foundations/iconography.html) (foundation page; there is no component page) |
| Source mocks | [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`pages/matching-braiders/default`](../../mocks/pages/matching-braiders/default.html), [`pages/matching-braiders/no-results`](../../mocks/pages/matching-braiders/no-results.html), [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html), [`pages/style-detail/error`](../../mocks/pages/style-detail/error.html), [`pages/style-detail/empty`](../../mocks/pages/style-detail/empty.html), [`pages/booking-request/success`](../../mocks/pages/booking-request/success.html), [`dialogs/cancel-appointment/default`](../../mocks/dialogs/cancel-appointment/default.html), [`notifications/booking-update/success`](../../mocks/notifications/booking-update/success.html) |
| Rendering | [`icon.html`](icon.html) |

## Purpose and scope

An icon is a small line drawing that supports a label: the calendar in "Request with Nia", the close mark in a dialog header, the search glass in an empty no-results state, the star in "4.9 from 86 reviews". HairPop draws every icon from one set of inline SVGs on a 24-unit grid with a 2-unit round stroke in `currentColor`, so an icon always takes the colour of the text or control around it, in both themes. The component turns a name into that SVG and nothing else.

The mocks drew icons with text glyphs (✦, ×, ⌕, !, ✓, →, ★). The iconography foundation replaces every glyph with an SVG icon; this component is how the product does it.

Use something else when:

- the picture is a person: use the avatar (`avatar.md`); the avatar draws the `user` icon itself for an unknown person;
- the picture shows work (braids): use a card photo;
- the mark is the brand wordmark with text: the top bar owns `.topbar__brand`, which contains a `sparkle` icon from this component.

Out of scope:

- Naming a control. An icon-only button is named by the button's `aria-label` (`button.md`); a dismiss control by its own `aria-label`. The icon inside stays decorative.
- Status colour. Alerts, toasts, dialogs and empty states colour their icon through their own component tokens (`--alert-icon`, `--toast-icon`, `.dialog__icon--danger`, `.empty--error`); the icon only paints `currentColor`.
- Size and spacing inside a parent. `.btn .icon` (1.25 em), `.search .icon` (absolutely positioned), `.empty__icon` (the 64 px circle) and the gap between icon and label are the parent's rules.
- Tooltips on icon-only controls (tooltip CRD).
- Rotation, flipping and animation. The set has a separate icon for each direction it needs.

## Usage

Every place the product draws an icon, from the mocks' glyphs (mapped by the foundation) and the design-system component pages. Configurations that share a name, size and role are grouped.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Top bar brand on every page (mock ✦) | `sparkle`, md, decorative | before the text "HairPop" | default, dark | surface (top bar) |
| Style card art panels, `tables-and-lists` pattern | `sparkle`, `fill`, decorative, sized by the panel | none | default, dark | accent-subtle panel |
| Empty states "Nothing here yet" on `pages/style-detail/empty`, `pages/braider-profile/empty` (mock ✦) | `sparkle`, lg, inside `.empty__icon` | none | default, dark | canvas |
| Dialog header close in every dialog (`dialogs/*`, mock ×) | `close`, md, inside a ghost icon-only button named "Close dialog" | none | button hover and focus | raised (dialog) |
| Toast dismiss (`notifications/*`, mock ×), alert dismiss, chip remove | `close`, sm, inside `.close` / `.remove` named "Dismiss notification", "Dismiss: Prices are estimates", "Remove Knotless" | none | control hover and focus | inverse (toast), tinted (alert), surface (chip) |
| No-results on `pages/matching-braiders/no-results`, `pages/style-gallery/no-results`, `pages/my-appointments/no-results` (mock ⌕); not-found page | `search`, lg, inside `.empty__icon` | none | default, dark | canvas |
| Search boxes on `pages/style-gallery`, `pages/matching-braiders`, `pages/my-appointments` | `search`, md, `.search .icon` in `--color-fg-subtle` | none | default | surface (input) |
| Error states on every `pages/*/error` (mock "!"), service error page, danger alerts and toasts, cancel dialog | `alert-circle`, lg inside `.empty--error .empty__icon`; md in `.alert--danger`, `.toast--danger`, `.dialog__icon--danger` | none | default, dark | canvas, tinted, inverse, raised |
| Success states: `pages/booking-request/success` "Request sent to Nia" and every `success` page (mock ✓) | `check`, lg, inside the `.empty__icon` circle | none | default, dark | canvas |
| Success alerts and toasts: "Time confirmed" (`notifications/booking-update/success`), "Your changes are saved" | `check-circle`, md | none | default, dark | inverse (toast), tinted (alert) |
| Info alerts ("Prices are estimates"), info toasts, the review-request dialog icon | `info`, md | none | default, dark | tinted, inverse, raised |
| Warning alerts ("Some details are unavailable"), warning toasts, inline field messages | `warning`, md | none | default, dark | tinted, surface |
| Offline page and offline banners ("You're offline") | `wifi-off`, lg on the page, md in banners | none | default, dark | canvas, tinted |
| Forbidden page "You can't open this page" | `lock`, lg | none | default | canvas |
| Rating meta on `pages/braider-profile` and `pages/matching-braiders` ("4.9 ★ from 86 reviews", mock ★) | `star`, sm, `fill`, `label="out of 5 stars"` | none | default, dark | surface (card) |
| Portfolio empty state "No portfolio photos yet" | `star`, md or lg, inside `.empty__icon` | none | default | surface |
| Story links "Explore Nia Okafor" on `pages/matching-braiders`, `pages/style-gallery`, `pages/help` (mock →) | `arrow-right`, sm, inside `.link__arrow` | none | link hover moves it | surface |
| Partner site link | `external`, sm, after the link text | none | default | surface |
| "Request with Nia" on `pages/braider-profile` | `calendar`, md, leading, inside a primary button (1.25 em) | none | button states | surface |
| "Filters" on `pages/matching-braiders` | `filter`, md, trailing, inside a secondary button | none | button states | surface |
| "Edit request" icon-only button, tooltip examples | `edit`, md | none | button states | surface |
| Top bar menu button on phones | `menu` closed, `close` open | none | default, expanded | surface |
| Menus (appointment actions, account) | `chevron-down` sm on the trigger, `more` on an overflow trigger, item icons `calendar`, `message`, `trash`, `log-out`, `user`, `bell` | none | item hover, focus | raised (menu) |
| Sidebar navigation | `calendar`, `bell`, `user`, `help`, `home` | before the link text | current, hover | surface |
| Breadcrumb, pagination, list rows | `chevron-left`, `chevron-right`, sm or md | none | default | surface |
| Password fields on sign-in, sign-up, reset-password | `eye` (show), `eye-off` (hide) inside the visibility toggle | none | toggled | surface (input) |
| Sign-out dialog | `log-out`, md, inside `.dialog__icon--danger` | none | default | raised |
| Avatar for an unknown person | `user`, sm / md / lg by avatar size (drawn by `avatar.md`) | none | default | accent-subtle frame |
| Stat delta (`stat.md`) | `arrow-up`, `arrow-down`, sm (D-6) | none | default | surface |
| Foundation sheet only, no screen yet | `arrow-left` (back links), `clock` (durations), `map-pin` (service area), `plus`, `refresh`, `mail` | none | default | surface |

Every row is buildable with the API below: a `name` from the set, a `size`, `fill` for the two solid marks, and `label` for the one meaningful standalone icon (the rating star). Everything else is the parent's rule.

## Anatomy

1. **Canvas** — the host `<svg class="icon">` with `viewBox="0 0 24 24"`: a 24 × 24 unit grid with a centred 20 × 20 live area. Sized by the size class; `flex: none` so it never shrinks in a row.
2. **Drawing** — one `<path>` whose `d` comes from the icon registry. Stroke 2 units, round caps and joins, no fill, `stroke: currentColor`; `.icon--fill` swaps to `fill: currentColor; stroke: none`.

Host: the component uses an attribute selector, so the host **is** the native `<svg>` and carries `class="icon"`, `viewBox`, `aria-hidden` and, when labelled, `role` and `aria-label` (D-1). The template is the single `<path>`. Parents that size or place an icon (`.btn .icon`, `.alert > .icon`, `.toast > .icon`, `.search .icon`, `.link__arrow .icon`) therefore match the host exactly as in the design system, including the child combinators.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `name` | `IconName` (the 38 names under *Variants*) | — | yes | Selects the path from the registry. Changing it updates the `d` attribute in place; the `<svg>` node is kept. An unknown name (only possible from untyped data) renders an empty path at the same size and, in development mode, logs a console error naming `hp-icon` and the name (D-5). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | no | Adds `.icon--sm` or `.icon--lg`; md adds no modifier. A parent rule such as `.btn .icon` (1.25 em) overrides it. |
| `fill` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.icon--fill`: solid `currentColor`, no stroke. Only for the rating `star` and the `sparkle` on art panels; never for a control. |
| `label` | `string \| null` | `null` | no | When set, the icon carries meaning on its own: the host gets `role="img"` and `aria-label` equal to the label, and loses `aria-hidden`. When null (the default) the icon is decorative: `aria-hidden="true"` and no role. |

- Inputs are signal inputs; `fill` accepts a bare attribute.
- `class`, `style` and any other attribute a consumer sets on the host stay on the host; consumers may add placement classes (`link__arrow` is a wrapper, not a host class).
- The component renders no copy; `label` is the only string and it is the consumer's translatable text.

### Outputs

None. An icon is never interactive; the control around it emits the events.

### Content slots

None. The `<path>` is generated from `name`; projected content is ignored.

## Variants and sizes

The set: 38 names. Names are kebab-case nouns or verbs and never describe shape ("close", not "x"). One icon means one thing.

| Name | Means | Used for |
|---|---|---|
| `sparkle` | HairPop, styles | Brand, style art, "Nothing here yet" empty states |
| `close` | Close or dismiss | Dialog close, toast and alert dismiss, chip remove, menu panel close |
| `search` | Search, nothing found | Search fields, no-results, not-found page |
| `check` | Done | Success empty states inside the circle, "Back online", inline success |
| `check-circle` | Success status | Success alerts and toasts |
| `info` | Information | Info alerts and toasts, the review-request dialog |
| `alert-circle` | Error status | Error states, danger alerts and toasts, cancel dialog, service error page |
| `warning` | Needs attention | Warning alerts and toasts, field messages, offline banners in forms |
| `arrow-right` | Go forward to | "Explore Nia Okafor" links |
| `arrow-left` | Go back to | Back links |
| `arrow-up` | Increase | Stat delta up (D-6) |
| `arrow-down` | Decrease | Stat delta down (D-6) |
| `chevron-down` | Opens a menu | Menu and select triggers |
| `chevron-left` | Previous | Pagination, breadcrumb back |
| `chevron-right` | Next, opens a row | Pagination, list rows |
| `star` | Rating | Rating meta (filled), portfolio empty state |
| `calendar` | Appointments, booking | "Request with Nia", Appointments navigation, empty appointments |
| `clock` | Duration, time | Durations ("about five hours") |
| `map-pin` | Service area | Service area |
| `bell` | Updates | Updates navigation, menu, empty notifications |
| `user` | Person, account | Unknown-person avatar, account navigation |
| `menu` | Navigation menu | Top bar menu button on phones |
| `filter` | Filters | "Filters" |
| `plus` | Add | Add actions |
| `edit` | Edit | "Edit request" |
| `trash` | Remove permanently | Menu delete item |
| `external` | Leaves HairPop | Partner site links |
| `eye` | Show | Show password |
| `eye-off` | Hide | Hide password |
| `more` | More actions | Overflow menu trigger |
| `refresh` | Retry, refresh | Retry actions |
| `wifi-off` | Offline | Offline page and banners |
| `lock` | Restricted | Forbidden page |
| `mail` | Email | Verify email |
| `message` | Contact | "Message Nia" menu item |
| `log-out` | Sign out | Sign-out dialog and menu item |
| `help` | Help | Help navigation |
| `home` | Home | Home navigation |

Paths are the `ICONS` table of the design system's `build.py`, copied verbatim into the registry, plus `arrow-up` (`M12 19V5M6 11l6-6 6 6`) and `arrow-down` (`M12 5v14M6 13l6 6 6-6`) (D-6).

Glyph mapping (the mocks' glyph → the icon the product renders): ✦ → `sparkle`; × → `close`; ⌕ → `search`; "!" → `alert-circle`; ✓ → `check` inside the `.empty__icon` circle and `check-circle` everywhere else (D-7); → → `arrow-right`; ★ → `star` (filled, labelled); ⚠ → `warning`.

| Size | Modifier | Box | Use |
|---|---|---|---|
| sm | `.icon--sm` | 1 rem (16 px) | Beside 14 px text: dismiss controls, chevrons, link arrows, the rating star, stat deltas |
| md | — | 1.25 rem (20 px) | Beside body text, in alerts, toasts, menus and navigation |
| lg | `.icon--lg` | 1.5 rem (24 px) | Standalone: empty-state and error-page circles |
| in a button | `.btn .icon` (parent rule) | 1.25 em | Scales with the button's size: 17.5, 20 or 22.5 px |

Sizes are rem, so they follow the reader's text size; the design system defines them in `components.css` rather than as tokens (D-4). Never scale an icon with `transform`; change the size.

## States

An icon is not interactive and has no hover, focus, active or disabled state of its own. Its colour follows its parent.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Decorative (default) | `label` null | Stroke in `currentColor` | `aria-hidden="true"`: not in the accessibility tree |
| Labelled | `label` set | Unchanged | `role="img"`, named by `aria-label` |
| Filled | `fill` | Solid `currentColor`, no stroke | Unchanged |
| Inside a hovered or pressed control | the parent's `:hover`, `[aria-pressed="true"]` | Follows the parent's text colour (`--btn-fg`, `--color-fg-accent`) | — |
| Inside a disabled control | the parent's `disabled` | Follows the parent's 50 % opacity | — |
| Inside a status container | `.alert--warning > .icon`, `.toast--success > .icon`, `.empty--error .empty__icon` | The parent's icon token: `--color-warning-icon`, `--color-success-icon-inverse`, `--color-danger-icon` | — |
| Dark theme | `data-theme="dark"` or the system preference | Follows the dark text and icon tokens | — |
| Forced colours | `(forced-colors: active)` | `currentColor` resolves to the system text colour (`CanvasText`, `ButtonText`, `LinkText`), so every icon stays visible | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Nothing changes; icons never animate | — |
| Enlarged text | text size 200 % | sm, md and lg double with the rem; a button icon grows with its label | — |

## Markup

Rendered DOM. Classes and attributes are the e2e contract; the `<svg>` is the host.

```html
<!-- rendered: decorative, md (dialog close, inside the button) -->
<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"></path></svg>
```

```html
<!-- rendered: sizes -->
<svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
<svg class="icon icon--lg" aria-hidden="true" viewBox="0 0 24 24"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4"></path></svg>
```

```html
<!-- rendered: filled and labelled rating star (braider profile meta) -->
<p class="text-muted">Toronto West · 4.9 <svg class="icon icon--sm icon--fill" viewBox="0 0 24 24" role="img" aria-label="out of 5 stars"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"></path></svg> from 86 reviews</p>
```

```html
<!-- rendered: inside parents (their classes, not the icon's) -->
<div class="empty__icon" aria-hidden="true"><svg class="icon icon--lg" aria-hidden="true" viewBox="0 0 24 24"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4"></path></svg></div>
<div class="alert alert--warning" role="status"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4L2.5 20h19zM12 10v4M12 17v.01"></path></svg><div><strong>Some details are unavailable.</strong> Reviews could not load.</div></div>
```

```html
<!-- rendered: stat delta arrows (D-6) -->
<svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"></path></svg>
<svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"></path></svg>
```

Consumer templates:

```html
<!-- consumer: inside a button (button.md slot contract: a projected svg.icon) -->
<a hp-button variant="primary" [routerLink]="['/braiders', 'nia-okafor', 'book']">
  <svg hp-icon name="calendar"></svg>
  Request with Nia
</a>
<button hp-button variant="ghost" iconOnly aria-label="Close dialog" (click)="close()">
  <svg hp-icon name="close"></svg>
</button>

<!-- consumer: empty state, sizes -->
<div class="empty__icon" aria-hidden="true"><svg hp-icon name="search" size="lg"></svg></div>
<span class="link__arrow" aria-hidden="true"><svg hp-icon name="arrow-right" size="sm"></svg></span>

<!-- consumer: the one labelled icon -->
4.9 <svg hp-icon name="star" size="sm" fill label="out of 5 stars"></svg> from 86 reviews

<!-- consumer: a name that changes -->
<svg hp-icon [name]="visible() ? 'eye-off' : 'eye'"></svg>
```

Free to change: attribute order, and whether `aria-hidden` is written before or after `viewBox`.

## Design

- Grid `viewBox="0 0 24 24"`; live area 20 × 20 centred; optical, not mathematical, alignment (a circle touches the live-area edge, a square sits one unit inside).
- Stroke width 2 units, `stroke-linecap: round`, `stroke-linejoin: round`, `fill: none`, `stroke: currentColor`; `.icon--fill` is `fill: currentColor; stroke: none`.
- Box: 1 rem / 1.25 rem / 1.5 rem for sm / md / lg, `flex: none`. Because the stroke is in grid units, it scales with the box: 1.33 px at sm, 1.67 px at md, 2 px at lg.
- Gap to a label: `--space-1` to `--space-2`, set by the parent (`.btn` uses `--space-2`, `.badge` and `.stat__delta` use `--space-1`).
- Colour: `currentColor` only. No colour, size or stroke is ever written into the SVG.
- Motion: none. Layer: none.

Component tokens: none. The icon reads `currentColor`, and its parents set that colour with their own tokens (`--btn-fg`, `--alert-icon`, `--toast-icon`, `--empty-icon-fg`).

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Icon beside body text | `--color-fg-default` (inherited) | `--palette-gray-900` | `--palette-gray-150` |
| Icon in a search field | `--color-fg-subtle` | `--palette-gray-500` | `--palette-gray-400` |
| Brand mark, empty-state circle, art panel | `--color-fg-accent` | `--palette-plum-700` | `--palette-plum-300` |
| Info status | `--color-info-icon` | `--palette-plum-600` | `--palette-plum-300` |
| Success status | `--color-success-icon` | `--palette-green-500` | `--palette-green-300` |
| Warning status | `--color-warning-icon` | `--palette-amber-500` | `--palette-amber-300` |
| Error status | `--color-danger-icon` | `--palette-red-500` | `--palette-red-300` |
| Status on a toast | `--color-success-icon-inverse` (and the info, warning, danger equivalents) | resolved per theme | resolved per theme |

Contrast pairs for icons that carry meaning (WCAG 1.4.11, 3:1), from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-info-icon` | `--color-info-bg` | 3:1 | Info alert icon |
| `--color-success-icon` | `--color-success-bg` | 3:1 | Success alert icon |
| `--color-warning-icon` | `--color-warning-bg` | 3:1 | Warning alert icon |
| `--color-danger-icon` | `--color-danger-bg` | 3:1 | Danger alert icon, error empty circle |
| `--color-info-icon-inverse` | `--color-bg-inverse` | 3:1 | Info toast icon |
| `--color-success-icon-inverse` | `--color-bg-inverse` | 3:1 | Success toast icon |
| `--color-warning-icon-inverse` | `--color-bg-inverse` | 3:1 | Warning toast icon |
| `--color-danger-icon-inverse` | `--color-bg-inverse` | 3:1 | Danger toast icon |
| `--color-fg-accent` | `--color-accent-subtle` | 3:1 | Empty-state circle and art panel |
| `--color-fg-subtle` | `--color-bg-surface` | 3:1 | Search field icon |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Rating star in muted meta text (it sits in a text run) |

Forced colours: `currentColor` resolves to the system text colour of the context, so icons need no forced-colour rule; filled icons fill with it too.

## Responsive behaviour

- The icon has no breakpoint rules. It never shrinks in a flex row (`flex: none`): at 320 px an alert's icon stays 20 px while the message wraps beside it.
- Text enlarged to 200 % doubles sm, md and lg (32, 40, 48 px) because they are rem; button icons follow the button's em size. Nothing overflows, because the icon's parents wrap their text.
- Targets: an icon is never a target. Its control is (a 40 px icon-only button, a 24 px dismiss control, a 44 px navigation link).

## Accessibility

### Role and pattern

An inline `<svg>`. Decorative by default (`aria-hidden="true"`), so it adds nothing to the accessible name of the button, link or heading around it. With `label` it is an image (`role="img"`) named by `aria-label`. No APG pattern applies.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Never stops on an icon. Focus lands on the control around it. |

### Focus

None on the icon. The SVG is never focusable (no `tabindex`, no `focusable` override needed in supported browsers); the parent control shows the shared ring.

### Labelling

- Decorative icons (beside a visible label, or inside a control named by its own text or `aria-label`) carry `aria-hidden="true"` and no `<title>`.
- An icon-only control names the action, not the drawing: `aria-label="Close dialog"`, never "X icon". The icon inside stays decorative.
- An icon that carries meaning with no words beside it gets `label`. The product's one case is the rating star: `4.9` + star labelled "out of 5 stars" reads "4.9 out of 5 stars from 86 reviews" (D-3).
- Status is never the icon alone: every alert, toast and empty state that shows a status icon also states it in words.

### Announcements

None. A changed icon is never announced; the status region of the alert or toast that contains it announces the words.

### Motion

None. Icons do not spin, pulse or move; the link arrow's nudge on hover is the link's own transform and is zeroed with the motion tokens under `prefers-reduced-motion: reduce`.

## Content and internationalisation

- Pair icons with text. An icon alone is only for universally understood controls (close, menu, more, search), and that control is named.
- Use one icon for one meaning: `sparkle` is the brand and styles accent, never "new" or "AI"; `warning` means "needs your attention", never an error.
- No glyphs, emoji or icon fonts beside the set; no rotated or flipped icons to make a new meaning.
- Translatable content: `label` only ("out of 5 stars"). Icons are not mirrored for right-to-left text; the product's copy is English only today and no L2 requirement covers translation, so direction-dependent icons (`arrow-left`, `arrow-right`, `chevron-left`, `chevron-right`) are chosen by the consumer for the reading direction.

## Performance

- Change detection: `OnPush`, signal inputs; the path is a `computed` lookup in a constant registry. No `innerHTML`, no `DomSanitizer`, no HTTP request, no sprite sheet.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Icon.ts` renders the calendar icon from Nia's "Request with Nia" button, `<svg hp-icon name="calendar"></svg>`; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: the button scenario projects an icon; the avatar scenario for an unknown person draws one.
- Regression rule: a change to the template, inputs, registry or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: the box size comes from CSS, so an icon reserves its space before and after the path renders; nothing loads asynchronously.
- Weight: the registry is about 2 KB of path strings; no icon library is imported.
- Render cost has no L2 requirement, so it has no criterion here.

## Acceptance criteria

### Rendering

- **AC-1** Given `<svg hp-icon name="close"></svg>` inside the "Close dialog" button of the cancel appointment dialog, when it renders, then the DOM is exactly `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">` containing one `<path d="M6 6l12 12M18 6L6 18">`, with no wrapper element, and the icon is absent from the accessibility tree. (L2-041)
- **AC-2** Given an icon in its default size beside body text, when its computed style is read, then it is 20 × 20 px with `fill: none`, `stroke-width: 2`, round line caps and joins, and its stroke colour equals the colour of the surrounding text. (L2-041)
- **AC-3** Given three `search` icons with `size` `sm`, `md` and `lg` at default text size, when they render, then they measure 16, 20 and 24 px square and carry the classes `icon icon--sm`, `icon` and `icon icon--lg`. (L2-041)
- **AC-4** Given each of the 38 names listed under *Variants*, when an icon renders with that name, then its path has a non-empty `d` and its drawing's bounding box lies inside the 24 × 24 grid. (L2-041)
- **AC-5** Given the show-password toggle on sign-in with `[name]="visible() ? 'eye-off' : 'eye'"`, when the customer shows the password, then the same `<svg>` element now draws `eye-off` and no element is added or removed. (L2-041)
- **AC-6** Given `<svg hp-icon name="star" size="sm" fill label="out of 5 stars">`, when it renders, then it has the classes `icon icon--sm icon--fill`, a solid `currentColor` fill and no stroke. (L2-041)

### States

- **AC-7** Given the no-results state on matching braiders, when it renders, then its `.empty__icon` holds a `search` icon with the classes `icon icon--lg` and `aria-hidden="true"`, the "⌕" glyph is not in the DOM, and the heading "No matches for these filters" carries the meaning. (L2-035)
- **AC-8** Given the offline, forbidden, service error and not-found destinations, when each renders, then its icon is `wifi-off`, `lock`, `alert-circle` and `search` respectively, each `lg` and decorative, and the page's heading states the condition in words. (L2-037)
- **AC-9** Given the success toast "Time confirmed" with "Nia confirmed Sat 24 Oct at 10:00 am.", when it renders, then its leading icon is `check-circle`, painted in `--color-success-icon-inverse` with at least 3:1 contrast against `--color-bg-inverse`, and the toast's words carry the status. (L2-031)

### Screen readers

- **AC-10** Given the icon-only ghost button `aria-label="Close dialog"` containing the `close` icon, when a screen reader reads it, then it announces "Close dialog, button" and nothing from the icon. (L2-041)
- **AC-11** Given the primary button "Request with Nia" with a leading `calendar` icon, when its accessible name is computed, then the name is exactly "Request with Nia". (L2-041)
- **AC-12** Given Nia's profile meta "Toronto West · 4.9" followed by the star labelled "out of 5 stars" and "from 86 reviews", when a screen reader reads the line, then the star is exposed as an image named "out of 5 stars" and has no `aria-hidden` attribute. (L2-041)
- **AC-13** Given an icon whose `name` is not in the registry in a development build, when it initialises, then it renders an empty 20 px box and the console reports an error naming `hp-icon` and the unknown name. (L2-041)

### Theming

- **AC-14** Given the warning alert "Some details are unavailable", when the theme switches from light to dark, then its icon changes from the light to the dark `--color-warning-icon` without a reload and keeps at least 3:1 contrast against `--color-warning-bg`. (L2-042)
- **AC-15** Given the info, success, warning and danger alert icons in each theme, when contrast is measured against their alert backgrounds, then every ratio is at least 3:1. (L2-041)
- **AC-16** Given Windows forced colours, when the dialog close button, an alert and the rating star render, then every icon is drawn in the system text colour of its context and stays visible. (L2-041)

### Responsive

- **AC-17** Given text enlarged to 200 %, when the sm, md and lg icons render, then they measure 32, 40 and 48 px, and the calendar icon in "Request with Nia" stays 1.25 em of the button's label. (L2-042)
- **AC-18** Given the warning alert on a 320 px viewport, when its message wraps onto several lines, then the icon stays 20 × 20 px and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-19** Given `prefers-reduced-motion: reduce` or not, when any screen renders, then no icon has an animation or a transform of its own. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/icon/`; files `icon.ts` (the standalone component `Icon`, `selector: 'svg[hp-icon]'`, `changeDetection: OnPush`) and `icons.ts` (the `ICONS` registry as a `const` object and `type IconName = keyof typeof ICONS`). Export both from the library's `public-api.ts`.
- Template: `<svg:path [attr.d]="path()" />`; `path = computed(() => ICONS[name()] ?? '')`.
- Host bindings: static `class: 'icon'` and `viewBox: '0 0 24 24'`; `[class.icon--sm]`, `[class.icon--lg]`, `[class.icon--fill]` from the inputs; `[attr.aria-hidden]` `'true'` or `null`; `[attr.role]` `'img'` or `null`; `[attr.aria-label]` the label or `null`.
- Styles: none in the component (D-2). The `.icon`, `.icon--sm`, `.icon--lg` and `.icon--fill` rules stay in the shared foundation stylesheet with the other foundations and utilities.
- Development check (D-5): when `ICONS[name()]` is undefined and `isDevMode()`, `console.error` once per name with `hp-icon` and the name.
- Registry: copy the 36 paths from `docs/design-system/build.py` verbatim and add `arrow-up` and `arrow-down` (D-6); the design-system `ICONS` table and the iconography sheet gain the same two entries in the same slice.
- No CDK primitive. Composes nothing. Used by button, link, alert, toast, dialog, empty state, error page, menu, sidebar navigation, top bar, text field, avatar and stat.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Icon.ts`, exported from `src/scenarios/index.ts`, with iterations added to `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is the host a wrapper element (`<hp-icon>`) or the `<svg>` itself?* The `<svg>`, through the attribute selector `svg[hp-icon]`. The button CRD's slot contract projects an `svg.icon`, and the design system places icons with child combinators (`.alert > .icon`, `.toast > .icon`) and descendant rules (`.btn .icon`, `.search .icon`); a wrapper would break all of them and add a layout box. The rendered DOM is identical to the design system's markup.
- **D-2** *Does the component carry its own encapsulated styles?* No. The iconography page is a foundation, and AGENTS.md keeps foundations global. Global `.icon` rules keep their plain specificity, so every parent's sizing rule (`.btn .icon` at 1.25 em) wins as the design system intends; scoped host styles would compete with those rules.
- **D-3** *How is a meaningful standalone icon named?* With the `label` input, which renders `role="img"` and `aria-label`. The foundation describes visually hidden text after the icon; the label is equivalent for assistive technology, keeps the words with the icon, and is one element instead of two. The rating star is the product's only case today.
- **D-4** *Are icon sizes tokens?* No. The design system defines them as rem values on `.icon`, `.icon--sm` and `.icon--lg` and has no icon size tokens; the CRD does not invent any. Rem keeps them in step with text size.
- **D-5** *What happens with an unknown name?* The type system rejects it at compile time; at run time (untyped data) the icon renders an empty box of the right size, so the layout holds, and development builds log a console error naming `hp-icon` and the name. A broken glyph or a thrown error would be worse for the customer than a blank 20 px box.
- **D-6** *The stat delta uses the text arrows ↑ and ↓, which the foundation says to replace with icons, but the set has no up or down arrow. What renders?* Two new icons, `arrow-up` and `arrow-down`, drawn like `arrow-right` on the same grid. The foundation forbids rotating an icon to make a new meaning (chevrons excepted) and forbids mixing glyphs with the set, so the only consistent option is to add them; the design system's `ICONS` table and sheet catch up in the implementing slice.
- **D-7** *The foundation maps ✓ to `check-circle`, but the empty-state page draws `check` inside its circle. Which is right?* Both, by context: inside the `.empty__icon` circle the circle is already drawn, so the mark is `check`; everywhere else a success status is `check-circle`. This keeps one meaning (success) and avoids a circle inside a circle.
- **D-8** *Is the icon set direction-aware for right-to-left text?* No. No L2 requirement covers translation and the copy is English only; the consumer picks the direction icon it means. Adding mirroring later changes no input.

# Menu

| Field | Value |
|---|---|
| Selector | `ul[hp-menu]`, `button[hp-menu-item]`, `a[hp-menu-item]`, `button[hp-menu-item-radio]`, `button[hp-menu-item-checkbox]`, `li[hpMenuGroupLabel]`, `li[hpMenuDivider]`, `button[hpMenuTriggerFor]` |
| Library path | `frontend/projects/components/src/lib/menu/` |
| Status | planned |
| Traces to | L2-011, L2-022, L2-041, L2-042 |
| Design system | [`menu.html`](../../design-system/components/menu.html) |
| Source mocks | [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`pages/appointment-detail/default`](../../mocks/pages/appointment-detail/default.html), [`pages/matching-braiders/default`](../../mocks/pages/matching-braiders/default.html), [`dialogs/sign-out/default`](../../mocks/dialogs/sign-out/default.html) |
| Rendering | [`menu.html`](menu.html) |

## Purpose and scope

A menu offers three to seven related actions from one trigger, when they do not deserve their own buttons: the account menu behind "Maya" (Account settings, Notifications, Sign out), an appointment's overflow actions (Request a change, Message Nia, Cancel request), or a choice of sort order for matching braiders. It follows the APG Menu Button pattern and is built on the Angular CDK Menu, which positions its panel with the CDK Overlay.

Use something else when:

- the destinations are the product's main sections (Styles, Braiders, Appointments): top bar links;
- the person picks a value inside a form: a select or radio group;
- there are only two actions: two [buttons](button.md), as on the appointment card;
- the content is a decision or a form: a [dialog](dialog.md).

Out of scope:

- What an item does. Items raise `triggered`, or navigate when they are links; "Sign out" and "Cancel request" open their confirmation [dialogs](dialog.md), which own the confirmation.
- The trigger's look and name. The trigger is a [button](button.md) (`button[hp-button]`); the menu only adds `aria-haspopup`, `aria-expanded`, `aria-controls` and the open look.
- The account link in the top bar. `top-bar.md` keeps "Maya" as a plain link to account settings, as the mocks do, so the account menu below has no consumer until the top-bar CRD adopts it; this CRD specifies the menu so that change needs no API change here.
- Submenus. The design system defines none; nested `hpMenuTriggerFor` inside a menu is not supported (D-9).

## Usage

No mock renders a menu yet (the mocks' top bar shows "Maya" as a plain link, and the appointment card shows two buttons). The design system defines the menu's first uses; every row must be buildable:

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Account menu behind "Maya" in the top bar (`pages/style-gallery/default` and every signed-in page) | ghost trigger "Maya" + chevron-down icon; section label; link items with icons; divider; danger button item | label "Account"; `a` "Account settings" (user icon), `a` "Notifications" (bell icon); `button` danger "Sign out" (log-out icon) opening `dialogs/sign-out` | closed, open, item hover, item focus | raised panel over the top bar |
| Appointment overflow on `pages/appointment-detail` when more than two actions apply | ghost `iconOnly` trigger `aria-label="More actions for HP-1048"` with tooltip "More actions"; button items with icons; divider; danger item | "Request a change" (calendar), "Message Nia" (message), "Cancel request" (trash, danger) | closed, open, hover, focus, disabled item "Add to calendar" | raised panel over a card |
| Sort order on `pages/matching-braiders` | secondary trigger "Sort: Best match" + chevron-down; section label; radio items | label "Sort by"; "Best match" (checked), "Lowest price", "Highest rated" | checked, unchecked, hover, focus | raised panel |
| Gallery shortcuts (design system *Variants*, desktop only) | ghost trigger; items with `kbd` shortcuts | "Search styles" `/`, "Toggle theme" `T` | default, hover, focus | raised panel |
| Any menu with more than five items below 640 px | bottom-sheet layout with 44 px items (design system *Responsive*) | as above | open | raised sheet |

Every row is buildable with the API below: a trigger directive on any `button[hp-button]`, a `ul[hp-menu]` in an `ng-template`, and item, radio, checkbox, label and divider elements with projected icons and shortcuts.

## Anatomy

1. **Trigger** — a `button[hp-button]` with `hpMenuTriggerFor`. Gets `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` (the menu id while open) and, while open, the pressed background `--btn-bg-active` (D-4). Shows a trailing chevron-down `.icon.icon--sm` unless it is icon-only.
2. **Panel** — `ul.menu[role="menu"]`, rendered in a CDK overlay pane at `--z-dropdown`. `--color-bg-surface-raised`, `--border-width-hairline` `--color-border-default` border, `--radius-md`, `--shadow-3`, `--space-1` padding, width between `min(12rem, 100vw - 32px)` and `min(20rem, 100vw - 32px)` (D-5).
3. **Item wrapper** — `li[role="none"]` around each item.
4. **Item** — `.menu__item` on a native `button` (`role="menuitem"`, `menuitemradio` or `menuitemcheckbox`) or `a href` (`role="menuitem"`). Min-height `--control-height-sm`, `--space-3` side padding, `--space-3` gap, `--text-body-sm`, `--radius-sm`.
5. **Item icon (optional)** — a leading `svg.icon.icon--sm`, `aria-hidden="true"`.
6. **Shortcut (optional)** — a trailing `kbd`, pushed to the end, `--font-size-xs`.
7. **Check mark (radio and checkbox items)** — `::after` "✓" in `--color-fg-accent` when `aria-checked="true"`.
8. **Section label (optional)** — `li.menu__group`, overline style in `--color-fg-subtle`.
9. **Divider (optional)** — `li.menu__divider[role="separator"]`, `--border-width-hairline` `--color-border-default` with `--space-1` above and below.

Host: every part is a native element with an attribute selector, so the BEM classes and roles sit on the elements the design system shows (D-1). The panel is the `ul[hp-menu]` host itself; the CDK `CdkMenu`, `CdkMenuItem`, `CdkMenuItemRadio`, `CdkMenuItemCheckbox` and `CdkMenuTrigger` directives are host directives that supply roles, roving focus, typeahead and positioning.

## API

### `button[hpMenuTriggerFor]`

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `hpMenuTriggerFor` | `TemplateRef<unknown>` | — | yes | The `ng-template` that holds the `ul[hp-menu]`. Opens it in a CDK overlay below the trigger, start-aligned, flipping above or to the end edge when it would leave the viewport. |

| Output | Payload | Emitted when |
|---|---|---|
| `menuOpened` | `void` | The menu opened. |
| `menuClosed` | `void` | The menu closed for any reason. |

### `ul[hp-menu]`

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| none | — | — | — | Naming: when the consumer sets no `aria-label`, the menu sets `aria-labelledby` to its trigger's id (generating one if the trigger has none). An icon-only trigger's menu takes an `aria-label` that names the object: "Appointment HP-1048 actions". |

### `button[hp-menu-item]`, `a[hp-menu-item]`

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `tone` | `'default' \| 'danger'` | `'default'` | no | `danger` adds `.menu__item--danger`. Use for destructive items, last, after a divider. |
| `disabled` | `boolean` (`booleanAttribute`) | `false` | no | Sets `aria-disabled="true"`; the item stays focusable but does nothing and does not close the menu. Never native `disabled` (D-6). |

| Output | Payload | Emitted when |
|---|---|---|
| `triggered` | `void` | The item is activated by click, Enter or Space and is not disabled. The menu then closes. An `a` item also navigates. |

### `button[hp-menu-item-radio]`, `button[hp-menu-item-checkbox]`

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `checked` | `boolean` (`booleanAttribute`) | `false` | no | Mirrors `aria-checked`. Radios in one menu are exclusive (one radio set per menu, D-7); checkboxes toggle. |
| `disabled` | `boolean` (`booleanAttribute`) | `false` | no | As for items. |

| Output | Payload | Emitted when |
|---|---|---|
| `triggered` | `void` | Activated; the consumer updates `checked`. The menu closes. |

### `li[hpMenuGroupLabel]`, `li[hpMenuDivider]`

No inputs. `hpMenuGroupLabel` adds `.menu__group`, `role="none"` and `aria-hidden="true"` and projects its text; `hpMenuDivider` adds `.menu__divider` and `role="separator"`.

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `ul[hp-menu]` default | `li[role="none"]` wrapping one item each, `li[hpMenuGroupLabel]`, `li[hpMenuDivider]` | Declared once. Three to seven items. |
| item default | Optional leading `<svg class="icon icon--sm" aria-hidden="true">`, the label text, optional trailing `<kbd>` | Declared once. The text is the accessible name and typeahead label. |

Every string is projected content or a native attribute; the components render no copy of their own.

## Variants and sizes

| Variant | Markup | Use for |
|---|---|---|
| With icons | leading `svg.icon.icon--sm` in items | Account and appointment menus. |
| With shortcuts | trailing `kbd` in items | Desktop power features: "Search styles" `/`. |
| With sections | `li[hpMenuGroupLabel]` and dividers | Grouped items: "Account", "Sort by". |
| Danger item | `.menu__item--danger` | "Sign out", "Cancel request". |
| Checkable | `role="menuitemradio"` or `menuitemcheckbox` with `aria-checked` | "Sort by" choices. |
| Bottom sheet | `.menu--sheet`, set by the menu below 640 px when it has more than five items | Long menus on phones (D-8). |

One size: items are `--control-height-sm` (32 px) tall; a sheet's items are `--target-comfortable` (44 px).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Closed | default | Trigger at rest; no panel in the DOM | `aria-expanded="false"` |
| Open | trigger activated | Panel scales in from 96 % and fades over `--duration-fast` with `--ease-enter`; trigger shows `--btn-bg-active` | `aria-expanded="true"`, `aria-controls` the menu id; focus on the first item (or last with ↑) |
| Item hover | `:hover` | `--color-bg-subtle-hover` background (D-3) | — |
| Item focus | roving focus, `:focus-visible` | `--color-bg-subtle-hover` background plus an inset `--focus-ring-width` ring in `--color-focus-ring` (D-3) | Item announced with role and position |
| Item disabled | `aria-disabled="true"` | `--color-fg-disabled` text, no highlight, `cursor: not-allowed` | Focusable, announced as unavailable, inert |
| Item checked | `aria-checked="true"` | "✓" at the end in `--color-fg-accent` | Announced as checked |
| Danger item hover and focus | `.menu__item--danger` | `--color-danger-bg` background, `--color-danger-fg` text; focus adds the inset ring | — |
| Flipped | not enough room below | Panel opens above the trigger, transform origin bottom | — |
| Sheet | below 640 px with more than five items | Full-width panel at the bottom, `--radius-xl` top corners, 44 px items | Same semantics |
| Reduced motion | `prefers-reduced-motion: reduce` | Panel appears without the scale and fade | — |
| Forced colours | `forced-colors: active` | Focused item outline `Highlight`; panel border `CanvasText` | — |

## Markup

```html
<!-- rendered: trigger, open -->
<button class="btn btn--ghost cdk-menu-trigger" type="button" id="account-trigger" aria-haspopup="menu" aria-expanded="true" aria-controls="hp-menu-1">
  Maya <svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
</button>
```

```html
<!-- rendered: account menu panel, in the CDK overlay pane -->
<ul class="menu cdk-menu" id="hp-menu-1" role="menu" aria-labelledby="account-trigger" aria-orientation="vertical" tabindex="-1">
  <li class="menu__group" role="none" aria-hidden="true">Account</li>
  <li role="none"><a class="menu__item cdk-menu-item" role="menuitem" href="/account" tabindex="0">
    <svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 20a8 8 0 0 1 16 0"/></svg>Account settings</a></li>
  <li role="none"><a class="menu__item cdk-menu-item" role="menuitem" href="/updates" tabindex="-1">
    <svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"/></svg>Notifications</a></li>
  <li class="menu__divider" role="separator"></li>
  <li role="none"><button class="menu__item menu__item--danger cdk-menu-item" role="menuitem" type="button" tabindex="-1">
    <svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/></svg>Sign out</button></li>
</ul>
```

```html
<!-- rendered: radio items, disabled item, shortcut -->
<li role="none"><button class="menu__item" role="menuitemradio" aria-checked="true" type="button">Best match</button></li>
<li role="none"><button class="menu__item" role="menuitemradio" aria-checked="false" type="button">Lowest price</button></li>
<li role="none"><button class="menu__item" role="menuitem" aria-disabled="true" type="button">Add to calendar</button></li>
<li role="none"><button class="menu__item" role="menuitem" type="button">Search styles <kbd>/</kbd></button></li>
```

Consumer templates:

```html
<!-- consumer: account menu -->
<button hp-button variant="ghost" id="account-trigger" [hpMenuTriggerFor]="account">
  Maya <svg class="icon icon--sm" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
</button>
<ng-template #account>
  <ul hp-menu>
    <li hpMenuGroupLabel>Account</li>
    <li role="none"><a hp-menu-item routerLink="/account"><svg class="icon icon--sm" …/>Account settings</a></li>
    <li role="none"><a hp-menu-item routerLink="/updates"><svg class="icon icon--sm" …/>Notifications</a></li>
    <li hpMenuDivider></li>
    <li role="none"><button hp-menu-item tone="danger" (triggered)="openSignOut()"><svg class="icon icon--sm" …/>Sign out</button></li>
  </ul>
</ng-template>

<!-- consumer: icon-only overflow trigger with its tooltip -->
<hp-tooltip text="More actions">
  <button hp-button variant="ghost" iconOnly aria-label="More actions for HP-1048" [hpMenuTriggerFor]="actions">
    <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM19 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>
  </button>
</hp-tooltip>
<ng-template #actions>
  <ul hp-menu aria-label="Appointment HP-1048 actions">…</ul>
</ng-template>

<!-- consumer: radio set -->
<ul hp-menu aria-label="Sort braiders">
  <li hpMenuGroupLabel>Sort by</li>
  @for (option of sortOptions; track option.value) {
    <li role="none"><button hp-menu-item-radio [checked]="sort() === option.value" (triggered)="sort.set(option.value)">{{ option.label }}</button></li>
  }
</ul>
```

Free to change: the `cdk-*` classes, the generated ids, and `tabindex` values (roving focus manages them).

## Design

- Panel: `min-width: min(12rem, 100vw - 2 × --space-4)`; `max-width: min(20rem, 100vw - 2 × --space-4)` (D-5); padding `--space-1`; block margin `--space-1`, which is the gap from the trigger above or below; `list-style: none`.
- Item: `display: flex; align-items: center; gap: --space-3`; `min-height: --control-height-sm`; padding `0 --space-3` (plus `--space-1` block padding so a wrapped label keeps its inset); `--text-body-sm`; `--radius-sm`; left-aligned text; no underline on link items; labels wrap (D-5).
- Section label: padding `--space-2 --space-3 --space-1`; `--text-overline`, `--letter-spacing-wide`, uppercase by CSS.
- Divider: `--border-width-hairline` top border, `--space-1` vertical margin.
- Shortcut: `margin-left: auto`; `--font-size-xs`.
- Layer: overlay wrapper `z-index: var(--z-dropdown)` (dialog D-8).
- Motion: `scale-in` over `--duration-fast` with `--ease-enter`, `transform-origin` at the corner nearest the trigger; closing is instant.
- Sheet (D-8): `position: fixed; inset: auto 0 0 0; max-width: none; border-radius: --radius-xl --radius-xl 0 0; padding-bottom: calc(--space-1 + env(safe-area-inset-bottom))`; items `min-height: --target-comfortable`.

Component tokens: none. The menu reads semantic tokens directly.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Panel | `--color-bg-surface-raised` | `--palette-white` | `--palette-gray-800` |
| Panel border, divider | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Item text | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Item highlight (hover, focus) | `--color-bg-subtle-hover` | `--palette-gray-200` | `--palette-gray-700` |
| Focus ring (inset) | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |
| Danger text / highlight | `--color-danger-fg` / `--color-danger-bg` | `--palette-red-700` / `--palette-red-50` | `--palette-red-300` / `--palette-red-950` |
| Check mark | `--color-fg-accent` | `--palette-plum-700` | `--palette-plum-300` |
| Section label | `--color-fg-subtle` | `--palette-gray-500` | `--palette-gray-400` |
| Disabled item | `--color-fg-disabled` | `--palette-gray-400` | `--palette-gray-600` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Item text |
| `--color-fg-default` | `--color-bg-subtle-hover` | 4.5:1 | Highlighted item text |
| `--color-danger-fg` | `--color-bg-surface-raised` | 4.5:1 | Danger item text at rest |
| `--color-danger-fg` | `--color-danger-bg` | 4.5:1 | Danger item highlighted |
| `--color-fg-subtle` | `--color-bg-surface-raised` | 4.5:1 | Section label |
| `--color-fg-accent` | `--color-bg-surface-raised` | 3:1 | Check mark |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focused item ring |
| `--color-focus-ring` | `--color-bg-subtle-hover` | 3:1 | Ring on the highlighted item |

Disabled items are exempt from contrast minimums (WCAG 1.4.3) and are also announced as unavailable. Forced colours: the panel border becomes `CanvasText` and the focus ring `Highlight` (the tokens map `--color-focus-ring`).

## Responsive behaviour

- The panel opens below the trigger, start-aligned, with `--space-1` gap, and flips above, or aligns to the end edge, when it would leave the viewport (CDK flexible connected positions with a `--space-4` viewport margin).
- Width: `min(12rem, 100vw - 32px)` to `min(20rem, 100vw - 32px)`. Measured in Chromium: the stylesheet's fixed `min-width: 12rem` makes the account menu 384 px wide at 200 % text, wider than a 360 px viewport, and the page scrolls horizontally (D-5).
- Labels wrap inside the item instead of truncating (D-5). Measured at 200 % text, the "Account settings" item needs about 333 px (259 px for the padded item text, plus its 32 px icon, 24 px gap and the panel's padding and border), more than the 328 px the panel may take on a 360 px viewport, so it wraps onto two lines (rendering, *Responsive*).
- Below 640 px a menu with more than five items opens as a bottom sheet with 44 px items (D-8). Menus with five or fewer items stay anchored to the trigger.
- Targets: items are 32 px tall and full width with no gaps, above the 24 px minimum.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available.

## Accessibility

### Role and pattern

[APG Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/), implemented with the Angular CDK Menu: trigger `button` with `aria-haspopup="menu"`, `aria-expanded` and `aria-controls`; panel `role="menu"` labelled by the trigger or by `aria-label`; items `role="menuitem"`, `menuitemradio` or `menuitemcheckbox` with `aria-checked`; wrappers `role="none"`; dividers `role="separator"`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Enter</kbd>, <kbd>Space</kbd>, <kbd>↓</kbd> | On the trigger: opens the menu and focuses the first item. |
| <kbd>↑</kbd> | On the trigger: opens the menu and focuses the last item. |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Moves between items, wrapping; disabled items are focusable but inert. |
| <kbd>Home</kbd> / <kbd>End</kbd> | First / last item. |
| A letter | Moves to the next item starting with that letter (typeahead). |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Activates the item and closes the menu; radio and checkbox items change and close. |
| <kbd>Esc</kbd> | Closes the menu and returns focus to the trigger. Inside a dialog it closes only the menu (dialog D-8 ordering). |
| <kbd>Tab</kbd> | Closes the menu and moves on in page order. |

### Focus

Focus moves into the menu on open (roving `tabindex`) and returns to the trigger on close by <kbd>Esc</kbd> or activation. Clicking outside closes the menu without moving focus. An item that opens a dialog hands focus to the dialog; the dialog returns it to the trigger when it closes.

### Labelling

- The menu is named by its trigger ("Maya") or by `aria-label` naming the object ("Appointment HP-1048 actions"). An icon-only trigger has its own `aria-label` ("More actions for HP-1048") and a tooltip.
- Item names come from their text; icons are `aria-hidden`. Shortcut hints are visible text and part of the name.
- Section labels are visual only (`aria-hidden="true"`), so every item names itself fully and a menu holds one radio set (D-7).

### Announcements

None beyond the roles: opening is announced through `aria-expanded` and focus; activation results are announced by what they open or change.

### Motion

The panel scales in from 96 % and fades over `--duration-fast`; closing is instant. Under `prefers-reduced-motion: reduce` the token is zeroed and the panel appears in place.

## Content and internationalisation

- Items are verb phrases in sentence case: "Request a change", "Message Nia", "Sign out". Order by frequency; destructive items last, after a divider. An item that opens a dialog needs no "…".
- The trigger says what the menu is about: the customer's first name for the account ("Maya"), "More actions" for overflow, the current choice for a sort ("Sort: Best match").
- Translatable content: item labels, section labels, `aria-label`s, the trigger label. Data values: the customer's and braider's first names, the request reference "HP-1048". Shortcut keys may differ by keyboard layout.
- Long labels wrap rather than truncate (D-5).

## Performance

- Change detection: `OnPush` on every part; signal inputs. The panel template is instantiated only when the menu opens; a closed menu costs only its trigger directive.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Menu.ts` renders Maya's account menu panel (`ul[hp-menu]` with "Account", "Account settings", "Notifications", a divider and "Sign out") as an inline `.menu--static` list, without the overlay; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none; no screen repeats menus.
- Regression rule: a change to a template, input, style or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: the panel is an overlay; opening it never shifts the page.
- Weight: `@angular/cdk/menu` and `@angular/cdk/overlay` only.
- No L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given the ghost trigger "Maya" with `hpMenuTriggerFor`, when it renders closed, then it has `aria-haspopup="menu"`, `aria-expanded="false"` and no menu exists in the document. (L2-041)
- **AC-2** Given Maya's account menu, when it opens, then `ul.menu[role="menu"]` appears in the CDK overlay below "Maya", labelled by the trigger, holding the label "Account", the link items "Account settings" and "Notifications", a `role="separator"` divider and the danger item "Sign out", and the trigger has `aria-expanded="true"` and `aria-controls` equal to the menu id. (L2-041)
- **AC-3** Given the sort menu on matching braiders with "Best match" checked, when it opens, then "Best match", "Lowest price" and "Highest rated" are `role="menuitemradio"`, only "Best match" has `aria-checked="true"` and shows the check mark in `--color-fg-accent`. (L2-041)
- **AC-4** Given an item "Search styles" with a trailing `kbd` "/", when it renders, then the shortcut sits at the item's end edge in `--font-size-xs`. (L2-041)

### States

- **AC-5** Given the open account menu, when the customer activates "Sign out", then the menu closes and the sign-out dialog opens; dismissing that dialog with "Stay signed in" leaves Maya signed in. (L2-011)
- **AC-6** Given the appointment overflow menu for HP-1048, when the customer activates "Cancel request", then the menu closes and the cancel dialog for HP-1048 opens with its terms and reference. (L2-022)
- **AC-7** Given the disabled item "Add to calendar", when the customer focuses it with the arrow keys and presses Enter, then it has `aria-disabled="true"`, shows `--color-fg-disabled` text, emits nothing and the menu stays open. (L2-041)
- **AC-8** Given the sort menu with "Best match" checked, when the customer activates "Lowest price", then `triggered` fires for "Lowest price", the menu closes, and when it reopens only "Lowest price" is checked. (L2-041)

### Keyboard and focus

- **AC-9** Given focus on the trigger "Maya", when the customer presses Enter, Space or ↓, then the menu opens with focus on "Account settings", and when they press ↑ instead, then focus lands on "Sign out". (L2-041)
- **AC-10** Given the open account menu with focus on "Sign out", when the customer presses ↓, then focus wraps to "Account settings"; Home and End move to the first and last items; typing "n" moves to "Notifications". (L2-041)
- **AC-11** Given the open account menu, when the customer presses Esc, then the menu closes and focus returns to "Maya"; when they press Tab instead, then the menu closes and focus moves to the next control after "Maya". (L2-041)
- **AC-12** Given the open menu, when the customer clicks outside it, then it closes and focus does not move. (L2-041)
- **AC-13** Given keyboard focus on "Notifications", when it shows, then the item has the `--color-bg-subtle-hover` highlight and an inset `--color-focus-ring` ring whose contrast against the panel is at least 3:1 in both themes. (L2-041)

### Screen readers

- **AC-14** Given the icon-only overflow trigger named "More actions for HP-1048", when its menu opens, then the menu is named "Appointment HP-1048 actions" and each item is announced with its role, name and position ("Request a change, menu item, 1 of 3"). (L2-041)

### Theming

- **AC-15** Given the account menu in the dark theme, when "Notifications" is hovered, then its background is `--color-bg-subtle-hover` (grey 700), visibly different from the grey 800 panel, and its text contrast is at least 4.5:1. (L2-042)
- **AC-16** Given the danger item "Sign out" highlighted, when contrast is measured in both themes, then `--color-danger-fg` on `--color-danger-bg` is at least 4.5:1. (L2-041)

### Responsive

- **AC-17** Given a trigger near the bottom of a 360 × 640 px viewport, when its menu opens, then the panel opens above the trigger and stays fully inside the viewport. (L2-042)
- **AC-18** Given a 360 px viewport with text enlarged to 200 %, when the account menu opens, then the panel is no wider than the viewport minus 32 px, every label is fully visible (wrapping if it must, never truncated) and the page does not scroll horizontally. (L2-042)
- **AC-19** Given a menu with six items on a 360 px viewport, when it opens, then it is a full-width bottom sheet with `.menu--sheet` and every item is at least 44 px tall. (L2-042)

### Motion

- **AC-20** Given `prefers-reduced-motion: reduce`, when a menu opens, then it appears without the scale and fade. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/menu/`; files `menu.ts` (`Menu`, selector `ul[hp-menu]`, `hostDirectives: [CdkMenu]`, host class `menu`), `menu-item.ts` (`MenuItem`, selector `button[hp-menu-item], a[hp-menu-item]`, `hostDirectives: [{ directive: CdkMenuItem, inputs: ['cdkMenuItemDisabled: disabled'], outputs: ['cdkMenuItemTriggered: triggered'] }]`, host class `menu__item`, `[class.menu__item--danger]`), `menu-item-radio.ts` and `menu-item-checkbox.ts` (same, with `CdkMenuItemRadio` / `CdkMenuItemCheckbox` and `cdkMenuItemChecked: checked`), `menu-group-label.ts`, `menu-divider.ts`, `menu-trigger.ts` (`MenuTrigger`, selector `button[hpMenuTriggerFor]`, `hostDirectives: [{ directive: CdkMenuTrigger, inputs: ['cdkMenuTriggerFor: hpMenuTriggerFor'], outputs: ['cdkMenuOpened: menuOpened', 'cdkMenuClosed: menuClosed'] }]`). Export all from `public-api.ts`.
- Positions: `cdkMenuPosition` set to below-start, below-end, above-start, above-end with no offset; the `--space-1` gap comes from the panel's block margin. CDK offsets are applied as a `transform` on the pane, which would make the sheet's `position: fixed` resolve to the pane instead of the viewport (D-8). After opening, set the overlay wrapper's `z-index` to `var(--z-dropdown)` (dialog D-8).
- Styles: port `.menu`, `.menu__item`, `.menu__group`, `.menu__divider` and the danger and checked rules with `ViewEncapsulation.None` (the panel renders in the overlay), plus the changes in D-3, D-5 and D-8. The stylesheet's shared hover and focus rule resets item text to `--color-fg-default`; the port keeps `--color-danger-fg` on a highlighted or focused danger item. `components.css` and the design-system menu page change in the same slice. The trigger's open look (D-4) is a rule on `.btn[aria-expanded="true"]` added to the shared stylesheet.
- Sheet (D-8): `Menu` counts its items after content init and, when there are more than five and `(max-width: 39.99rem)` matches, adds `.menu--sheet`.
- Naming: `Menu` injects the CDK `MENU_TRIGGER` to read the trigger element's id for `aria-labelledby`.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Menu.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Are the menu's parts wrapper components or the native elements?* Native elements with attribute selectors (`ul[hp-menu]`, `button[hp-menu-item]`…), each carrying its BEM class and role. The design system's markup is a `ul` of `li[role="none"]` with native `button` and `a` items; wrappers would put unknown elements between `role="menu"` and its items and break the ARIA ownership the pattern needs.
- **D-2** *CDK Menu or a hand-built menu on the CDK Overlay?* CDK Menu: the design-system page names it, and it is built on the CDK Overlay, so it also meets the brief. It supplies the roving focus, typeahead, Home/End, wrap, outside-click and focus-return behaviour the design system's keyboard table lists, with disabled items focusable.
- **D-3** *The design system shows focus with the item background only (`--color-bg-subtle`). Measured, that background is 1.14:1 against the light panel and 1.00:1 (identical, grey 800 on grey 800) against the dark panel, so a focused or hovered item is invisible in dark. What does focus look like?* The highlight uses `--color-bg-subtle-hover` (visible in both themes) and keyboard focus adds the shared ring drawn inset (`outline-offset: calc(-1 * var(--focus-ring-width))`), 7.78:1 light and 5.88:1 dark against the panel, so the focus indicator meets L2-041's contrast criterion. This contradicts the design system's "background instead of a ring" rule (needs product confirmation).
- **D-4** *How does the open trigger look in the product, where `data-state="active"` is documentation only?* `.btn[aria-expanded="true"]` takes `--btn-bg-active`, the pressed background the design system shows for the open state, without the 1 px press offset.
- **D-5** *The design system says labels do not wrap and the panel truncates beyond `min(20rem, 100vw - 32px)`, and the stylesheet sets `min-width: 12rem`. What happens with enlarged text?* Measured at 360 px with text at 200 %: the 12rem minimum is 384 px and the page scrolls horizontally, so the minimum becomes `min(12rem, 100vw - 32px)`. At the same size "Account settings" needs about 333 px of the 328 px available, so truncation would cut off part of the label, which L2-042's 200 % text criterion forbids; labels therefore wrap inside the item instead, the same rule as button D-5. This contradicts the design system's no-wrap, truncate rule (needs product confirmation).
- **D-6** *How is an item disabled?* With `aria-disabled="true"` (CDK `cdkMenuItemDisabled`), never native `disabled`, because the pattern keeps disabled items focusable so keyboard users can discover them.
- **D-7** *How are section labels exposed, given `li.menu__group[role="none"]` in the design-system markup is not associated with its items?* As visual labels only (`aria-hidden="true"`); every item names itself fully, and a menu holds at most one radio set, named by the menu's `aria-label` ("Sort braiders"). Wrapping each section in a `role="group"` would add structure and classes the design system does not have, for menus of three to seven items.
- **D-8** *How does a long menu become a bottom sheet when the CDK Menu only offers connected positions?* By CSS: `Menu` adds `.menu--sheet` below 640 px when it has more than five items, and that modifier fixes the panel to the bottom of the viewport with 44 px items (the pane has no transform because the menu positions use no CDK offset, so `position: fixed` resolves to the viewport). No sheet menu exists yet; the rule keeps the API stable for the design system's three-to-seven-item range. `components.css` gains `.menu--sheet` in the same slice.
- **D-9** *Are submenus supported?* No. The design system defines none and the APG Menu Button pattern used here is single-level; a nested trigger inside a menu is a review error.

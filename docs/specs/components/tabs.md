# Tabs

| Field | Value |
|---|---|
| Selector | `hp-tabs`, `hp-tab`, `ng-template[hpTabContent]` |
| Library path | `frontend/projects/components/src/lib/tabs/` |
| Status | planned |
| Traces to | L2-007, L2-018, L2-035, L2-041, L2-042 |
| Design system | [`tabs.html`](../../design-system/components/tabs.html) |
| Source mocks | none use it yet; the design system names [`pages/my-appointments/default`](../../mocks/pages/my-appointments/default.html) and [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html) as the screens that would use it, with states from [`pages/my-appointments/empty`](../../mocks/pages/my-appointments/empty.html) and [`pages/braider-profile/partial`](../../mocks/pages/braider-profile/partial.html) |
| Rendering | [`tabs.html`](tabs.html) |

## Purpose and scope

Tabs switch between views of the same content without leaving the page: Maya's "Upcoming", "Past" and "Cancelled" appointments, or "About", "Services", "Reviews", "Policies" and "Portfolio" on Nia's profile. Each tab shows its panel in place; the page does not reload. HairPop uses one visual style, the underline, in two sizes, with optional counts, and the list scrolls sideways rather than wrapping.

Use something else when:

- the destinations are different pages: use the top bar ([`top-bar.md`](top-bar.md)) or the sidebar ([`sidebar-navigation.md`](sidebar-navigation.md));
- the customer narrows one list by an attribute (Braids, Twists, Locs): use filter chips, as the style gallery does;
- the views are steps in a sequence ("1. Details", "2. Review"): use a single form; tabs are never steps.

Out of scope:

- What each panel contains, including its loading, empty and error states. The page renders them inside the panel (an empty-state component for "No cancelled appointments").
- Keeping the selection in the URL. The page binds `selected` to a query parameter if it wants deep links; the component never touches the router.
- Fetching a panel's data. The page loads it when `selectedChange` emits, or lazily through `hpTabContent`.

## Usage

No mock uses tabs yet (design system *Sources*). The configurations below come from the design-system page and the screens it names; each must be buildable now so those screens can adopt tabs without an API change.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/my-appointments/*` (design system *Variants*: "as My appointments would use them") | md, automatic activation, `label` "Appointments", 3 tabs, counts | "Upcoming" (info count 1, hidden ", 1 awaiting reply"), "Past" (neutral count 1), "Cancelled" (no count); panels: HP-1048 awaiting Nia's reply; HP-0992 completed Sat 3 Oct; empty "No cancelled appointments" | selected, hover, focus, empty panel | canvas |
| `pages/braider-profile/*` (design system *Variants*, scrollable) | md, 5 tabs, list scrolls at 360 px | "About", "Services", "Reviews" (neutral count 86), "Policies", "Portfolio" | selected, overflow scroll, selected scrolled into view | canvas |
| `pages/braider-profile/partial` (reviews fail while the profile loads) | manual activation or lazy `hpTabContent` for "Reviews" | Reviews panel holds the partial-data alert and "Retry reviews" | lazy panel, error panel | canvas |
| A tab set inside a card or dialog (design system *Sizes*) | `size="sm"` | "Upcoming", "Past" | selected, hover, focus | surface or raised |
| Design system *States* | any tab `disabled` (rare) | "Cancelled" disabled | disabled | canvas |
| Design system *Theming* | `--tab-fg` and `--tab-indicator` overridden on a surface (neutral tabs in a dense card) | — | selected | surface |

Every row is buildable with the API below.

## Anatomy

1. **Tab list** — `div.tabs` with `role="tablist"` and `aria-label`: a flex row with `--space-1` gaps, a hairline `--color-border-default` bottom rule, `overflow-x: auto` with a hidden scrollbar. Small tabs add `.tabs--sm`.
2. **Tab** — `button.tab` with `type="button"`, `role="tab"`, `aria-selected`, `aria-controls`, an `id`, and a roving `tabindex` (`0` on the selected tab, `-1` on the others): 44 px tall (`--target-comfortable`), `--space-3` side padding, `--text-label` in `--tab-fg`, never wraps.
3. **Label** — the text node; one or two words.
4. **Count (optional)** — `span.badge` (neutral) or `span.badge.badge--info` after the label with `--space-1` before it, then an optional `span.visually-hidden` with the count text. The badge is centred vertically in the tab (D-11).
5. **Selected indicator** — the tab's `::after`: a `--border-width-thick` bar in `--tab-indicator` on the bottom edge, `--radius-xs` top corners, overlapping the list's rule.
6. **Panel** — the `hp-tab` host element with `role="tabpanel"`, `id`, `aria-labelledby` and `tabindex="0"`; every panel but the selected one has `hidden`.

Hosts: `hp-tabs` is an element (`display: block`) that renders the tab list and then projects its `hp-tab` children; each `hp-tab` host **is** its panel (D-1). `ng-template[hpTabContent]` inside an `hp-tab` marks lazily rendered panel content (D-7).

## API

### `hp-tabs` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | `aria-label` of the tab list ("Appointments", "Nia’s profile"). |
| `size` | `'md' \| 'sm'` | `'md'` | no | `sm` adds `.tabs--sm`: 32 px tabs with `--font-size-xs` labels, only inside a card or dialog. |
| `activation` | `'automatic' \| 'manual'` | `'automatic'` | no | Automatic: arrow keys move focus and select. Manual: arrow keys move focus; Enter or Space selects. Use manual when a panel loads from the network (design system *Accessibility*). |
| `selected` | `string \| undefined` (two-way `model`) | `undefined` | no | The `value` of the selected tab. Undefined, unknown or disabled: the first enabled tab is selected and the model is updated to it. |

### `hp-tab` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `value` | `string` | — | yes | Unique within the set; used for `selected` and the generated ids. |
| `label` | `string` | — | yes | The tab's visible text and the start of its accessible name. |
| `count` | `number \| null` | `null` | no | Renders the count badge with the number as given when not null (0 included, as a number of items). |
| `countTone` | `'neutral' \| 'info'` | `'neutral'` | no | `neutral` renders `.badge`; `info` renders `.badge.badge--info` (for "needs attention", such as an awaiting request). |
| `countText` | `string \| null` | `null` | no | Visually hidden text after the count when the number alone is unclear: ", 1 awaiting reply". |
| `disabled` | `boolean` (`booleanAttribute`) | `false` | no | Native `disabled` on the tab button: skipped by arrow keys, not selectable, no hover change (D-5). Rare; prefer an enabled tab with an empty panel. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `selectedChange` (on `hp-tabs`) | `string` (the tab's `value`) | The selection changes by click, touch, arrow key (automatic), Enter or Space (manual), Home or End, or the initial fallback to the first enabled tab. Part of the `selected` model. Not emitted when the selected tab is activated again. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `hp-tabs` default | `hp-tab` elements only | Order in the DOM is tab order. Tabs may be added or removed with `@if`/`@for`; the list and ids update. |
| `hp-tab` default | Any panel content | Rendered eagerly, hidden while the tab is not selected. |
| `ng-template[hpTabContent]` inside `hp-tab` | Panel content | Instantiated the first time its tab is selected and kept afterwards (D-7). If both are present, the eager content renders first. |

- Inputs are signal inputs; `disabled` uses `booleanAttribute`.
- Every user-facing string is an input (`label`, tab `label`, `countText`) or projected panel content.

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Underline | — | Every tab set; HairPop has one visual style. |
| With counts | `.badge` or `.badge--info` inside `.tab` | When the number helps the choice: "Upcoming 1", "Reviews 86". |
| Scrollable | — (overflow) | More tabs than fit: the list scrolls sideways; tabs never wrap to a second row. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| md | — | `--target-comfortable` (44 px) | `--space-3` | `--text-label` (`--font-size-sm`) |
| sm | `.tabs--sm` | `--control-height-sm` (32 px) | `--space-3` | `--text-label` at `--font-size-xs` |

Each tab's width comes from its label and count; the list is as wide as its container.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | `aria-selected="false"` | `--tab-fg` `--color-fg-muted`; transparent indicator | Tab, not selected, "n of m" |
| Hover | `:hover` (enabled, unselected) | `--tab-fg` `--color-fg-default`; indicator `--color-border-strong` | — |
| Active | `:active` | Keeps the hover look; selection happens on click | — |
| Focus | `:focus-visible` | Shared ring drawn inside the tab (`outline-offset: -2px`), so the scrolling list never clips it | — |
| Selected | `aria-selected="true"` | `--tab-fg` `--color-fg-accent`; indicator `--color-accent`; hover leaves it unchanged | Tab, selected |
| Disabled | `disabled` | `--color-fg-disabled` label, `not-allowed` cursor, no hover change (D-5) | Tab, unavailable; skipped by arrow keys |
| With count | `count` not null | Badge after the label; selected or not, the badge keeps its own colours | "Upcoming 1, 1 awaiting reply" |
| Panel shown | its tab selected | Panel content visible | `tabpanel` named by its tab |
| Panel hidden | another tab selected | `hidden` | Not exposed |
| Overflowing list | tabs wider than the list | List scrolls horizontally; scrollbar hidden; partly hidden tab at the edge | All tabs reachable by arrow keys |
| Forced colours | `(forced-colors: active)` | Selected tab gains a `--border-width-thick` `Highlight` outline | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Indicator colour change instant; panels always swap instantly | — |

## Markup

Rendered DOM. Classes, roles and ARIA attributes are the e2e contract.

```html
<!-- rendered: My appointments, Upcoming selected -->
<hp-tabs>
  <div class="tabs" role="tablist" aria-label="Appointments">
    <button class="tab" type="button" role="tab" id="hp-tabs-1-tab-upcoming" aria-selected="true" aria-controls="hp-tabs-1-panel-upcoming" tabindex="0">Upcoming<span class="badge badge--info">1</span><span class="visually-hidden">, 1 awaiting reply</span></button>
    <button class="tab" type="button" role="tab" id="hp-tabs-1-tab-past" aria-selected="false" aria-controls="hp-tabs-1-panel-past" tabindex="-1">Past<span class="badge">1</span></button>
    <button class="tab" type="button" role="tab" id="hp-tabs-1-tab-cancelled" aria-selected="false" aria-controls="hp-tabs-1-panel-cancelled" tabindex="-1">Cancelled</button>
  </div>
  <hp-tab role="tabpanel" id="hp-tabs-1-panel-upcoming" aria-labelledby="hp-tabs-1-tab-upcoming" tabindex="0">…HP-1048, Nia Okafor, Sat 24 Oct · 10:00 am, awaiting reply…</hp-tab>
  <hp-tab role="tabpanel" id="hp-tabs-1-panel-past" aria-labelledby="hp-tabs-1-tab-past" tabindex="0" hidden>…</hp-tab>
  <hp-tab role="tabpanel" id="hp-tabs-1-panel-cancelled" aria-labelledby="hp-tabs-1-tab-cancelled" tabindex="0" hidden>…</hp-tab>
</hp-tabs>
```

```html
<!-- rendered: small, and a disabled tab -->
<div class="tabs tabs--sm" role="tablist" aria-label="Appointments">
  <button class="tab" type="button" role="tab" … aria-selected="true" tabindex="0">Upcoming</button>
  <button class="tab" type="button" role="tab" … aria-selected="false" tabindex="-1">Past</button>
</div>
<button class="tab" type="button" role="tab" … aria-selected="false" tabindex="-1" disabled>Cancelled</button>
```

Consumer templates:

```html
<!-- consumer: My appointments -->
<hp-tabs label="Appointments" [(selected)]="view">
  <hp-tab value="upcoming" label="Upcoming" [count]="upcoming().length" countTone="info"
          [countText]="', ' + awaiting() + ' awaiting reply'">…appointment list…</hp-tab>
  <hp-tab value="past" label="Past" [count]="past().length">…appointment list…</hp-tab>
  <hp-tab value="cancelled" label="Cancelled">
    @if (cancelled().length === 0) { …empty state "No cancelled appointments"… } @else { … }
  </hp-tab>
</hp-tabs>

<!-- consumer: Nia's profile, reviews loaded on first view -->
<hp-tabs label="Nia’s profile" [(selected)]="section">
  <hp-tab value="about" label="About">…</hp-tab>
  <hp-tab value="services" label="Services">…</hp-tab>
  <hp-tab value="reviews" label="Reviews" [count]="reviewCount()">
    <ng-template hpTabContent><hp-braider-reviews [braider]="braider()" /></ng-template>
  </hp-tab>
  <hp-tab value="policies" label="Policies">…</hp-tab>
  <hp-tab value="portfolio" label="Portfolio">…</hp-tab>
</hp-tabs>
```

Free to change: the id format (only uniqueness and the `aria-controls`/`aria-labelledby` pairing matter); class order.

## Design

- Tab: `min-height: --target-comfortable` (md) or `--control-height-sm` (sm); `padding: 0 --space-3`; `gap: --space-2`; `--text-label` (sm: `--font-size-xs`); `white-space: nowrap`; no border or fill.
- List: `gap: --space-1`; `border-bottom: --border-width-hairline solid --color-border-default`; `overflow-x: auto; scrollbar-width: none`.
- Indicator: `::after`, `height: --border-width-thick`, `bottom: -1px`, `border-radius: --radius-xs --radius-xs 0 0`, `background: --tab-indicator`.
- Count: `.badge` with `margin-left: --space-1` and `align-self: center` (D-11).
- Focus ring: the shared ring with `outline-offset: calc(-1 * --focus-ring-width)`.
- Motion: indicator `background-color` over `--duration-fast` with `--ease-standard`; panels swap with no transition.
- Layer: none.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--tab-fg` | `--color-fg-muted` | `:hover` → `--color-fg-default`; `[aria-selected="true"]` → `--color-fg-accent`; `:disabled` → `--color-fg-disabled`; a surface rule (design system *Theming*) |
| `--tab-indicator` | `transparent` | `:hover` → `--color-border-strong`; `[aria-selected="true"]` → `--color-accent`; a surface rule |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Label | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Label, hover | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Hover indicator | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-450` |
| Selected label | `--color-fg-accent` | `--palette-plum-700` | `--palette-plum-300` |
| Selected indicator | `--color-accent` | `--palette-plum-600` | `--palette-plum-300` |
| Disabled label | `--color-fg-disabled` | `--palette-gray-400` | `--palette-gray-600` |
| List rule | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Info count | `--color-info-fg` on `--color-info-bg` | `--palette-plum-800` on `--palette-plum-50` | `--palette-plum-200` on `--palette-plum-950` |
| Neutral count | `--color-fg-muted` on `--color-bg-subtle` | `--palette-gray-600` on `--palette-gray-100` | `--palette-gray-350` on `--palette-gray-800` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Unselected label on the page |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Hovered label |
| `--color-fg-accent` | `--color-bg-canvas` | 4.5:1 | Selected label on the page |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Selected indicator on the page |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Hover indicator |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Small tabs in a card |
| `--color-fg-accent` | `--color-bg-surface` | 4.5:1 | Selected small tab in a card |
| `--color-accent` | `--color-bg-surface` | 3:1 | Selected indicator in a card |
| `--color-info-fg` | `--color-info-bg` | 4.5:1 | Info count |
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Neutral count |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring |

The disabled label is exempt from contrast minimums (WCAG 1.4.3 inactive components). Forced colours: `components.css` outlines the selected tab in `Highlight`, so selection does not depend on the indicator colour.

## Responsive behaviour

- Tabs keep one row at every width. When they overflow, the list scrolls horizontally (`overflow-x: auto`, hidden scrollbar) and the page never does. Measured at 360 px: the profile's five tabs end at 473 px inside a list that ends at 344 px; the page width stays 360 px.
- On load and on every selection the selected tab is scrolled fully into view inside the list (horizontal only; the page does not scroll) (D-8).
- On phones keep to four tabs or fewer and one-word labels, so at 360 px at most one tab is partly hidden (a content rule; the profile's five tabs are the scrolling case).
- Tab height stays 44 px (md) at every breakpoint; 32 px (sm) only inside cards and dialogs.
- At 320 px nothing scrolls the page horizontally or clips; at 200 % text the tabs grow with the text and the list scrolls (measured at 360 px: tabs 88 px tall, list scrolls, page 360 px wide); targets are at least 24 × 24 CSS px (sm 32 px, md 44 px).

## Accessibility

### Role and pattern

[APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) with automatic activation by default and manual activation by input. `role="tablist"` with `aria-label`; each `<button role="tab">` has `aria-selected`, `aria-controls` and a roving `tabindex`; each panel has `role="tabpanel"` and `aria-labelledby`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Moves focus into the list, to the selected tab; Tab again moves to the selected panel (`tabindex="0"`). |
| <kbd>←</kbd> / <kbd>→</kbd> | Moves focus to the previous / next enabled tab, wrapping at the ends; automatic activation also selects it. Directions follow the document direction. |
| <kbd>Home</kbd> / <kbd>End</kbd> | Moves focus to the first / last enabled tab (selecting it when automatic). |
| <kbd>Enter</kbd>, <kbd>Space</kbd> | Manual activation: selects the focused tab. Automatic: does nothing further. |

### Focus

- The ring is drawn inside the tab (`outline-offset: -2px`) so the scrolling list does not clip it.
- Focus stays on the tab after selection; the panel is reached with Tab.
- When the tab set re-renders (a tab added or removed), focus stays on the focused tab if it still exists; if the selected tab is removed, the first enabled tab becomes selected and focus is not moved.

### Labelling

- The tab's name is its visible label plus its count: "Reviews 86"; with `countText`, "Upcoming 1, 1 awaiting reply".
- Each panel is named by its tab through `aria-labelledby`.
- No `aria-label` on tabs or badges.

### Announcements

None; screen readers announce the newly focused tab and its selected state ("Past, tab, selected, 2 of 3").

### Motion

The indicator colour changes over `--duration-fast`; panels swap instantly. Under reduced motion the token makes the colour change instant; nothing moves.

## Content and internationalisation

- Labels are one or two words, nouns or adjectives, in sentence case: "Upcoming", "Past", "Cancelled", "Reviews".
- Order tabs by how often they are used; the first tab is selected by default.
- Counts are plain numbers; never a status word in a tab. Use `countText` when the number alone is unclear.
- Translatable inputs: `label` (tab list), each tab `label`, `countText`. Data values: counts.
- Longer translations make tabs wider; the list scrolls rather than wraps.

## Performance

- Change detection: `OnPush`; `hp-tabs` reads its tabs with `contentChildren(Tab)` (a signal) and derives ids, `aria-selected` and `tabindex` with `computed`. Hidden panels keep their eager content but `hpTabContent` panels are not created until first selected.
- Keyboard handling uses CDK `FocusKeyManager`; one listener on the tab list.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Tabs.ts` renders My appointments' tab set: "Upcoming" (info count 1, ", 1 awaiting reply") selected with HP-1048's summary, "Past" (count 1) with HP-0992, "Cancelled" empty; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none; one tab set per screen.
- Regression rule: a change to its template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: tab height is fixed by `min-height`; a count appearing widens only its tab; scrolling the selected tab into view changes the list's `scrollLeft` only, never the page.
- Weight: `@angular/core`, `@angular/cdk/a11y`, `@angular/cdk/bidi`. No router.

## Acceptance criteria

### Rendering

- **AC-1** Given Maya's My appointments tabs "Upcoming", "Past" and "Cancelled" with `label` "Appointments", when they render, then the DOM holds `div.tabs[role=tablist][aria-label="Appointments"]` with three `button.tab[role=tab]` in that order, Upcoming has `aria-selected="true"` and `tabindex="0"`, the others `aria-selected="false"` and `tabindex="-1"`, and each tab's `aria-controls` names an `hp-tab[role=tabpanel]` whose `aria-labelledby` names that tab. (L2-041)
- **AC-2** Given Upcoming with `count` 1, `countTone` "info" and `countText` ", 1 awaiting reply", when it renders, then the tab contains `<span class="badge badge--info">1</span>` centred vertically on the label, followed by the hidden text, and its accessible name is "Upcoming 1, 1 awaiting reply". (L2-018)
- **AC-3** Given Upcoming selected, when the tabs render, then only the Upcoming panel (HP-1048 with Nia Okafor, Sat 24 Oct · 10:00 am, awaiting reply) is displayed and the Past and Cancelled panels carry `hidden`. (L2-018)

### Selection

- **AC-4** Given Upcoming selected, when Maya clicks "Past", then Past gets `aria-selected="true"` and `tabindex="0"`, its panel shows her completed visit HP-0992 of Sat 3 Oct, the Upcoming panel is hidden, and `selectedChange` emits "past" once. (L2-018)
- **AC-5** Given Maya has no cancelled appointments, when she selects "Cancelled", then the tab is enabled and selected and its panel shows the page's empty state "No cancelled appointments" with its next action. (L2-035)
- **AC-6** Given `selected` bound to "reviews" on Nia's profile, when the tabs render, then "Reviews 86" is selected and its panel shown without any click. (L2-007)
- **AC-7** Given the Reviews tab's content is an `ng-template hpTabContent`, when the profile opens on "About", then the reviews content has not been created; when Maya selects "Reviews" it is created, and after she returns to "About" and back it is the same instance. (L2-007)

### Keyboard and focus

- **AC-8** Given focus on "Upcoming" with automatic activation, when Maya presses →, then focus and selection move to "Past"; → on "Cancelled" wraps to "Upcoming"; ← on "Upcoming" wraps to "Cancelled"; Home and End select the first and last tabs. (L2-041)
- **AC-9** Given "Past" is disabled, when Maya presses → on "Upcoming", then focus and selection skip to "Cancelled", and clicking "Past" selects nothing. (L2-041)
- **AC-10** Given `activation="manual"`, when Maya presses → on "Upcoming", then focus moves to "Past" while "Upcoming" stays selected, and Enter or Space then selects "Past". (L2-041)
- **AC-11** Given focus before the tab list with "Past" selected, when Maya presses Tab, then focus lands on "Past", and Tab again lands on the Past panel. (L2-041)
- **AC-12** Given a tab focused by keyboard at the scrolled edge of the list, when the ring shows, then it is a 2 px `--color-focus-ring` outline drawn inside the tab, fully visible, with at least 3:1 contrast against `--color-bg-canvas`. (L2-041)

### States

- **AC-13** Given the unselected "Past", when the pointer hovers it, then its label becomes `--color-fg-default` and a `--color-border-strong` indicator shows; hovering the selected tab leaves its `--color-fg-accent` label and `--color-accent` indicator unchanged. (L2-041)
- **AC-14** Given the selected "Upcoming" on the page canvas in the light theme, when contrast is measured, then its label is at least 4.5:1 and its 2 px indicator at least 3:1 against `--color-bg-canvas`, and unselected labels are at least 4.5:1. (L2-041)
- **AC-15** Given the disabled "Cancelled", when the pointer hovers it, then its label stays `--color-fg-disabled` and no indicator shows. (L2-041)
- **AC-16** Given a screen reader on "Past" (second of three, selected), when it reads the tab, then it reports "Past 1", the role tab, selected, and position 2 of 3. (L2-041)

### Sizes and responsive

- **AC-17** Given `size="sm"` inside a card, when the tabs render, then the list has `tabs tabs--sm` and each tab is 32 px tall with `--font-size-xs` labels. (L2-041)
- **AC-18** Given Nia's profile tabs About, Services, Reviews, Policies and Portfolio at 360 px, when they render, then they stay on one row, the list scrolls horizontally and the page does not. (L2-042)
- **AC-19** Given the profile at 360 px with "About" selected, when Maya presses End, then "Portfolio" is selected and the list scrolls so that it is fully visible, and the page's vertical scroll position does not change. (L2-042)
- **AC-20** Given 360 px with text enlarged to 200 %, when My appointments' tabs render, then each label and count is fully visible inside its tab, the list scrolls horizontally and the page does not. (L2-042)

### Theming and motion

- **AC-21** Given the light theme, when Maya switches to dark, then without a reload the selected label and indicator change to `--palette-plum-300` and unselected labels to `--palette-gray-350`, each keeping its contrast minimum against the canvas. (L2-042)
- **AC-22** Given Windows forced colours, when the tabs render, then the selected tab has a `Highlight` outline. (L2-041)
- **AC-23** Given `prefers-reduced-motion: reduce`, when Maya selects another tab, then the indicator changes instantly and the panel swaps with no transition. (L2-041)

### Performance

Render cost is measured by the `Tabs` perf-test scenario and gated by `--fail-on-regression`; no L2 requirement covers client render cost, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/tabs/`; files `tabs.ts` (`Tabs`, `selector: 'hp-tabs'`), `tab.ts` (`Tab`, `selector: 'hp-tab'`) and `tab-content.ts` (`TabContent` directive, `selector: 'ng-template[hpTabContent]'`), each standalone, `OnPush`, single-file. Export all three from `public-api.ts`.
- `Tabs` template: the tab list built with `@for` over `contentChildren(Tab)`, then one `<ng-content />`. Styles port `.tabs`, `.tab`, `.tabs--sm`, `.tab .badge` and the forced-colours rule from `components.css`, including the disabled rule that clears the hover indicator (D-5) and the centred count (D-11).
- `Tab` host bindings: `role="tabpanel"`, `[attr.id]`, `[attr.aria-labelledby]`, `tabindex="0"`, `[attr.hidden]` from the parent's selection; content is `<ng-content />` plus `@if (rendered()) { <ng-container [ngTemplateOutlet]="lazy()?.template" /> }`, where `rendered` latches true on first selection.
- Ids: a per-instance counter (`hp-tabs-{n}`) plus each tab's `value`.
- Keyboard: CDK `FocusKeyManager` over the tab buttons with `withHorizontalOrientation(dir)`, `withWrap()`, `withHomeAndEnd()` and `skipPredicate(tab => tab.disabled)`; in automatic mode `change` selects.
- Scroll into view (D-8): after selection, set the list's `scrollLeft` so the selected tab's box lies inside it; never call `scrollIntoView`.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Tabs.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Which elements are hosts?* `hp-tabs` is an element composite that renders the tab list; each `hp-tab` host is its own `role="tabpanel"` so no wrapper sits between the tab list and the panels and the panels stay in the consumer's DOM order. No `components.css` rule targets the tab list's parent or the panel element type.
- **D-2** *Select by index or by value?* By `value`, a string. Tabs can be conditionally rendered (a "Cancelled" tab only for customers who cancelled), which would shift indices, and a value maps directly to a query parameter.
- **D-3** *Automatic or manual activation?* Automatic by default, as the design system specifies for loaded panels; manual through `activation`, which the design system asks for when a panel loads from the network.
- **D-4** *Hand-rolled keyboard handling or CDK?* CDK `FocusKeyManager` (`@angular/cdk/a11y`): it already implements roving focus, wrapping, Home/End, skipping disabled items and right-to-left arrows.
- **D-5** *The extracted stylesheet painted the hover indicator on a disabled tab (measured: the `::after` bar was grey 500 on a hovered disabled tab).* A disabled tab shows no hover change: label stays `--color-fg-disabled`, indicator transparent (`components.css` sets `--tab-indicator: transparent` on `.tab:disabled`, which wins over `:hover`). A hover cue on a control that cannot be selected suggests it can.
- **D-6** *Which panels are focusable?* Every panel has `tabindex="0"`, as the design system's code sample shows, so keyboard users can reach a panel whose content has no focusable element ("No cancelled appointments") and scroll a long one.
- **D-7** *How does a panel avoid loading data that is never viewed (Nia's reviews)?* An `ng-template[hpTabContent]` is instantiated on first selection and kept, so returning to the tab does not reload it. Eager content stays the simple default.
- **D-8** *"Scroll the selected tab into view on load": how, without moving the page?* By setting the tab list's `scrollLeft` only. `scrollIntoView` would also scroll the page vertically when the tab list is off screen on load.
- **D-9** *What count tones exist?* Neutral and info only, as the design-system anatomy says ("a neutral or info badge"); status tones would turn a count into a status word, which the content rules forbid.
- **D-10** *No mock uses tabs; is the API speculative?* No: the design system defines the component, its two target screens and their content, and both screens exist as mocks. Whether those pages adopt tabs is a page decision; the component is complete either way.
- **D-11** *`.badge` sets `align-self: flex-start`, so inside a 44 px tab the count sat at the top (measured: badge centre 12 px, tab centre 22 px). Where does the count sit?* Centred vertically on the label (`.tab .badge { align-self: center }` in `components.css`), as the design system's anatomy draws it; `.badge--count` already centres itself for the same reason.

# List

| Field | Value |
|---|---|
| Selector | `ul[hp-list]`, `ol[hp-list]`, `li[hp-list-item]`, `a[hp-list-item]` |
| Library path | `frontend/projects/components/src/lib/list/` |
| Status | planned |
| Traces to | L2-029, L2-030, L2-035, L2-041, L2-042 |
| Design system | [`list.html`](../../design-system/components/list.html) |
| Source mocks | [`pages/notification-center/default`](../../mocks/pages/notification-center/default.html), [`pages/notification-center/unread`](../../mocks/pages/notification-center/unread.html), [`pages/notification-center/read`](../../mocks/pages/notification-center/read.html), [`pages/notification-center/offline`](../../mocks/pages/notification-center/offline.html), [`pages/notification-center/loading`](../../mocks/pages/notification-center/loading.html), [`pages/notification-center/empty`](../../mocks/pages/notification-center/empty.html) |
| Rendering | [`list.html`](list.html) |

## Purpose and scope

A list stacks short, similar items in one column for a customer to scan top to bottom and open one at a time: Maya's notifications, a braider's services, the braiders she has seen, a help topic's articles. Each row is one line or two (a title and a meta line), with an optional leading avatar or icon and an optional trailing chevron or badge. A row can be a link to the item, can be marked as the current item, and can be marked unread. The notification center is its first screen in the mocks (D-1).

Use something else when:

- each item carries media, several facts and its own action, or people choose by look: use cards in a grid or row cards ([card.md](card.md));
- people compare the same three or more fields across many items: use the table ([table.md](table.md));
- the content is the fields of one record: use the description list ([description-list.md](description-list.md));
- the list is steps or bullets in prose ("Prepare for your visit"): use a plain `<ol>` or `<ul>` in the card's flow, without this component;
- the list is a selection widget (pick one braider): use a radio group or a listbox, never `role="listbox"` on this component.

Out of scope:

- The frame. A list that needs the card surface sits in a flush card: `<div hp-card flush>` around `<ul hp-list>` ([card.md](card.md), D-3).
- Order, grouping and paging. The page supplies items newest first and decides groups ("Earlier", with a labelled divider from [divider.md](divider.md)) and pagination.
- Marking an item read. Opening a row or a "Mark all read" action is the page's; the row only reflects its `unread` input.
- The avatar, icon and badge rendered in a row. Their CRDs own their markup; the list places them.
- Loading, empty, offline and error decisions. The page shows skeleton rows, the empty state or a banner; the list only gives rows their shape.

## Usage

Every `.list` in `docs/mocks/` (inventory: `usage_inventory.py docs/mocks list`), plus the configurations the design system and the tables-and-lists pattern define for later screens. The "Prepare for your visit" steps on `pages/appointment-detail/default` are a plain `<ol>` in the card's flow, not this component.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/notification-center/default`, `unread`, `read`, `offline` (offline adds the page's "You’re offline." banner above the same list) | `ul[hp-list] aria-label="Notifications"` in a flush card; rows `li > a[hp-list-item]`, two-line, `unread` on unread rows, trailing chevron on read rows | "Nia received your request" / "Today at 9:42 am · She will confirm the time and final price."; "How to prepare for knotless braids" / "Yesterday · Read Nia’s preparation checklist." (D-1); in `read` both rows are read | default, hover, focus, unread, read | flush card on canvas |
| `pages/notification-center/loading` | the same list with skeleton rows (`li[hp-list-item]` holding skeletons) | skeleton title and meta lines, `aria-hidden`; the region is named "Loading notifications" and is `aria-busy` (D-9) | loading | flush card on canvas |
| `pages/notification-center/empty` | no list; the page's empty state replaces it | "No updates yet" / "Updates about requests and appointments will appear here." / "Explore styles" (empty-state CRD; the mock's "Nothing here yet" is drift fixed there) | empty | canvas |
| Braider profile services (design system *Simple*; no mock yet) | `ul[hp-list]`, rows `li[hp-list-item]`, one line | "Medium knotless braids · from $180", "Passion twists · from $160", "Cornrows · from $90" | default | flush card |
| Braiders list (design system *With avatar*) | `ul[hp-list]`, rows `li[hp-list-item]`, leading `.avatar` (`aria-hidden`), two-line | "Nia Okafor" / "Toronto West · 4.9 ★ from 86 reviews"; "Aisha Mensah" / "North York · 4.8 ★ from 64 reviews" | default | flush card |
| Help topic articles (design system *Interactive*, `pages/help` topics) | `ul[hp-list]`, rows `li > a[hp-list-item]`, one current row | "How requests work" with `current` | default, hover, focus, current | flush card |
| Notification groups (design system list and divider pages) | two lists separated by a labelled divider | "Earlier" | default | flush card |

Every row is buildable with the API below: a native list host, row hosts on `<li>` (static) or `<a>` (link), `unread` and `current` as state inputs, and leading, body and trailing parts as projected markup.

## Anatomy

1. **List** — `.list` on the `<ul>` or `<ol>` host. No bullets, no padding, a flex column. Draws a `--border-width-hairline` rule in `--color-border-default` between rows, none after the last row (D-2).
2. **Row** — `.list__item` on the row host: flex row, wrapping, `align-items: center`, gap `--space-3`, padding `--space-3` × `--space-4`. A link row adds `.list__item--interactive`: `min-height: var(--target-comfortable)`, no underline, inherits the text colour, hover tint.
3. **Leading avatar or icon (optional)** — a projected `.avatar` (40 px) or `.icon` (20 px), `aria-hidden="true"` when the title already names the person.
4. **Body** — `.list__body`: takes the remaining width and never less than half the row (`min-width: 50%`); holds the title and meta.
5. **Title** — `.list__title`: `--text-label` at `--font-size-md`, `--color-fg-default`. In an unread row it starts with an 8 px `--color-accent` dot (`::before`, `--radius-full`, `--space-2` after it).
6. **Meta (optional)** — `.list__meta`: `--text-body-sm` in `--color-fg-muted`; time first. May add `.truncate` for one line with an ellipsis when the full text is on the next screen.
7. **Trailing chevron or badge (optional)** — a projected `.icon` (chevron for navigation rows) or `.badge` (status), kept at the end of the row; it moves to its own line, still at the end, when it would push the body below half the row (D-4).
8. **Unread text** — a projected `<span class="visually-hidden">Unread: </span>` at the start of the title (D-5).

Hosts: `hp-list` and `hp-list-item` are attribute components, so the hosts **are** the native `<ul>`/`<ol>`, `<li>` and `<a>` elements and carry the classes (D-6). A link row is `<li><a hp-list-item href>…</a></li>`; the `<li>` is plain markup. Each template is a single `<ng-content />`.

## API

### `ul[hp-list]`, `ol[hp-list]` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| None | | | | The host's element chooses unordered or ordered. `aria-label` or `aria-labelledby` is a native attribute the consumer sets when several lists share a page ("Notifications"). Adds `.list`. |

### `li[hp-list-item]`, `a[hp-list-item]` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `unread` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.list__item--unread` (the accent dot before the title). The row must also say "Unread" in text: a visually hidden prefix in the title, or a visible badge; in development mode an unread row with neither is reported as a console error (D-5). |
| `current` | `boolean` (`booleanAttribute`) | `false` | no | Sets `aria-current="true"` and the `--color-accent-subtle` tint. When false no `aria-current` attribute is rendered. |

- An `<a>` host always adds `.list__item--interactive`; an `<li>` host never does (the tag decides, read once).
- `href`, `routerLink`, `target`, `rel`, `aria-label` and `aria-describedby` are plain native attributes or consumer directives on the host.
- Inputs are signal inputs; booleans accept bare attributes. Every user-facing string is projected; the components render no copy.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | A row link raises its own native `click`; the list and row emit nothing of their own. Marking a notification read is the page's response to that navigation. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `hp-list` default | `<li>` elements only: `li[hp-list-item]` rows, or plain `<li>` wrapping one `a[hp-list-item]` | Declared once. Rows render in the order given; the list never sorts. |
| `hp-list-item` default | Optional leading `.avatar` or `.icon`; one `.list__body` with a `.list__title` and an optional `.list__meta`; optional trailing `.icon` or `.badge`. A one-line row may hold plain text instead | Declared once. A link row holds no other link or button (one tab stop per row). |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Simple | — | One line per row: a braider's services. |
| Two-line | `.list__body` with `.list__meta` | A title and one line of detail: notifications, braiders. |
| With avatar or icon | leading `.avatar` / `.icon` | People (avatar) or kinds of item (icon). |
| Interactive | `.list__item--interactive` (from an `<a>` host) | Each row opens the item: notifications, help articles. |
| Unread | `.list__item--unread` | An update Maya has not opened yet. |
| Current | `aria-current="true"` | The item open beside the list, or the article being read. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One density | — | from content; link rows at least `--target-comfortable` (44 px) | `--space-3` vertical, `--space-4` horizontal | title `--text-label` at `--font-size-md`, meta `--text-body-sm` |

Rows grow with a second line. Width comes from the container: cap the list with the detail grid's main column or `--layout-form-max` rather than stretching rows to 1280 px. Use a dense table for compact data.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Transparent row on the frame's surface, hairline rule below every row but the last | Native list with its item count; rows in DOM order |
| Hover (link rows) | `:hover` | Fill `--color-bg-subtle`, text colour unchanged | — |
| Focus (link rows) | `:focus-visible` | The shared ring (`--focus-ring-width` of `--color-focus-ring`) drawn inside the row with `outline-offset: calc(-1 * (var(--focus-ring-width) + var(--focus-ring-offset)))`, fully visible inside a flush card (D-7) | Link name read |
| Active (link rows) | `:active` | Hover fill; navigation follows | — |
| Current | `current` → `aria-current="true"` | Fill `--color-accent-subtle` | "current" announced |
| Unread | `unread` → `.list__item--unread` | 8 px `--color-accent` dot before the title | "Unread:" prefix (or the badge text) read with the title |
| Read | `unread` false | No dot, no "Read" badge | Title read alone |
| Loading | rows hold skeletons (skeleton CRD) | Rows keep their padding and the two-line height; skeletons pulse under `--motion-loop-state` | The page's region carries `aria-busy="true"`; skeletons are `aria-hidden` |
| Long title | title longer than the line | Title wraps; the body keeps at least half the row; a trailing badge moves to its own line at the end (D-4) | Full text read |
| Forced colours | `(forced-colors: active)` | Unread dot drawn in `CanvasText` (`forced-color-adjust: none`); current row gets a `--border-width-thick` `Highlight` inset outline (D-8) | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Hover tint instant | — |
| Dark theme | `data-theme="dark"` | Rules grey 750, hover grey 800, current plum 950, dot plum 300 | — |

There is no disabled row: a row that cannot be opened is a static `<li>` row.

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: notification list (interactive, unread and read rows) in a flush card -->
<div class="card card--flush">
  <ul class="list" aria-label="Notifications">
    <li>
      <a class="list__item list__item--interactive list__item--unread" href="/appointments/hp-1048">
        <div class="list__body">
          <div class="list__title"><span class="visually-hidden">Unread: </span>Nia received your request</div>
          <div class="list__meta">Today at 9:42 am · She will confirm the time and final price.</div>
        </div>
      </a>
    </li>
    <li>
      <a class="list__item list__item--interactive" href="/appointments/hp-1048/care">
        <div class="list__body">
          <div class="list__title">How to prepare for knotless braids</div>
          <div class="list__meta">Yesterday · Read Nia’s preparation checklist.</div>
        </div>
        <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
      </a>
    </li>
  </ul>
</div>
```

```html
<!-- rendered: simple list -->
<ul class="list">
  <li class="list__item">Medium knotless braids · from $180</li>
  <li class="list__item">Passion twists · from $160</li>
  <li class="list__item">Cornrows · from $90</li>
</ul>
```

```html
<!-- rendered: two-line rows with a leading avatar -->
<ul class="list">
  <li class="list__item">
    <span class="avatar" aria-hidden="true">NO</span>
    <div class="list__body"><div class="list__title">Nia Okafor</div><div class="list__meta">Toronto West · 4.9 ★ from 86 reviews</div></div>
  </li>
  <li class="list__item">
    <span class="avatar" aria-hidden="true">AM</span>
    <div class="list__body"><div class="list__title">Aisha Mensah</div><div class="list__meta">North York · 4.8 ★ from 64 reviews</div></div>
  </li>
</ul>
```

```html
<!-- rendered: current row, trailing status badge, truncated meta -->
<ul class="list" aria-label="Help topics">
  <li><a class="list__item list__item--interactive" href="/help/requests" aria-current="true"><div class="list__body"><div class="list__title">How requests work</div></div></a></li>
  <li><a class="list__item list__item--interactive" href="/appointments/hp-1048">
    <div class="list__body"><div class="list__title">Medium knotless braids</div><div class="list__meta truncate">Sat 24 Oct · 10:00 am · with Nia Okafor · estimate $180–$240</div></div>
    <span class="badge badge--warning">Awaiting reply</span>
  </a></li>
</ul>
```

Consumer templates:

```html
<!-- consumer: notification center -->
<div hp-card flush>
  <ul hp-list aria-label="Notifications">
    @for (n of notifications(); track n.id) {
      <li>
        <a hp-list-item [routerLink]="n.destination" [unread]="!n.readAt">
          <div class="list__body">
            <div class="list__title">
              @if (!n.readAt) { <span class="visually-hidden">Unread: </span> }
              {{ n.title }}
            </div>
            <div class="list__meta">{{ n.when }} · {{ n.detail }}</div>
          </div>
          @if (n.readAt) { <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg> }
        </a>
      </li>
    }
  </ul>
</div>

<!-- consumer: services (static rows) -->
<ul hp-list aria-label="Nia’s services">
  @for (s of services(); track s.id) { <li hp-list-item>{{ s.name }} · from {{ s.from }}</li> }
</ul>

<!-- consumer: help topics with the current article -->
<ul hp-list aria-label="Help topics">
  @for (t of topics(); track t.slug) {
    <li><a hp-list-item [routerLink]="['/help', t.slug]" [current]="t.slug === slug()"><div class="list__body"><div class="list__title">{{ t.title }}</div></div></a></li>
  }
</ul>
```

Free to change: the order of classes, and whether the rule between rows is a border on the row or on its `<li>`, as long as there is one hairline between rows and none after the last.

## Design

- List: `list-style: none`, padding 0, margin 0, flex column.
- Rule between rows: `--border-width-hairline` solid `--color-border-default` at the bottom of every row whose `<li>` is not the list's last child (D-2).
- Row: flex, `flex-wrap: wrap`, `align-items: center`, gap `--space-3`, padding `--space-3` `--space-4`. Link rows: `min-height: var(--target-comfortable)`, `text-decoration: none`, `color: inherit`, `cursor: pointer`, `background-color` transition over `--duration-fast` with `--ease-standard`.
- Body: `flex: 1 1 50%`, `min-width: 50%` (D-4). Title `--text-label` with `--font-size-md`; meta `--text-body-sm` in `--color-fg-muted`; `.truncate` gives one line with an ellipsis.
- Trailing part (the last child when it is not the body): `margin-inline-start: auto`; a badge aligns to the top of the row.
- Unread dot: `0.5rem` square (the design system's 8 px dot), `--radius-full`, `--color-accent`, `--space-2` after it, vertically centred on the first line.
- Hover fill `--color-bg-subtle`; current fill `--color-accent-subtle`.
- Focus ring: `outline: var(--focus-ring-width) solid var(--color-focus-ring)` with a negative offset of `--focus-ring-width` plus `--focus-ring-offset`, so it sits inside the row (D-7).
- Elevation and layer: none; the frame (a flush card) supplies surface, edge and rounded corners.
- Component tokens: none. The list reads semantic tokens only; a surface re-skins it by overriding `--color-bg-subtle`, `--color-accent-subtle` and `--color-border-default` on its own selector.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Title | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Meta | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Rule between rows | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Hover fill | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Current fill | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Unread dot | `--color-accent` | `--palette-plum-600` | `--palette-plum-300` |
| Surface (from the flush card) | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Title |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Meta |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Title on a hovered row |
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Meta on a hovered row |
| `--color-fg-default` | `--color-accent-subtle` | 4.5:1 | Title on the current row |
| `--color-accent` | `--color-bg-surface` | 3:1 | Unread dot |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring inside a row |

The rule between rows is decorative (rows are also separated by padding and are list items). Forced colours: the tokens map borders to `CanvasText` and the ring to `Highlight`; the unread dot and the current row get explicit forced-colour treatments because both are backgrounds the system would remove (D-8).

## Responsive behaviour

- One column at every width; no breakpoint rules of its own.
- Titles wrap; nothing truncates except a meta line that opts into `.truncate` when its full text is on the next screen.
- The body keeps at least half the row. Measured at 320 px: without this rule, a trailing "Awaiting reply" badge (153 px) squeezed the title "Amara Nkiruka Adeyemi-Williams accepted your change request" into an 89 px column over eight lines. With it, the badge moves to its own line at the end of the row and the title uses the full 254 px (D-4).
- Link rows span the full width and are at least 44 px tall at every width.
- At 320 px nothing scrolls horizontally; at 200 % text size and 400 % zoom the rows reflow the same way.

## Accessibility

### Role and pattern

A native `<ul>` (or `<ol>` when order matters) so the item count is announced; rows are `<li>`. A link row is a native `<a href>` inside its `<li>`. Never `role="listbox"`, `role="menu"` or `role="grid"`: this is a list of links, not a widget.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves between row links in order; each link row is one tab stop; static rows are skipped. |
| <kbd>Enter</kbd> | Opens the focused row. |

### Focus

- Focus lands on the row's `<a>`; there is nothing else to focus in a row.
- The ring is drawn inside the row so the flush card's `overflow: hidden` cannot clip it (D-7). It is at least 3:1 against the row's surface.
- Focus does not move when a row's `unread` state changes.

### Labelling

- A list gets a name when several lists share a page: `aria-label="Notifications"`, "Help topics", "Nia’s services".
- A link row's name is its text: "Unread: Nia received your request Today at 9:42 am · She will confirm the time and final price." The "Unread:" prefix comes first; a leading avatar repeating the title's name is `aria-hidden="true"`; the trailing chevron is `aria-hidden="true"`.
- Unread state is in text (the hidden prefix, or a visible "Unread" badge), never only the dot (D-5). Read rows say nothing extra: mark the exception, not the norm.
- `aria-current="true"` marks the current row.

### Announcements

The list has no live region. The page's status region announces a changed unread count ("1 unread update").

### Motion

The hover tint transitions over `--duration-fast`; reduced motion makes it instant.

## Content and internationalisation

- Titles say what happened or what the item is, in sentence case with no full stop: "Nia received your request", "How to prepare for knotless braids", "Medium knotless braids · from $180".
- Meta starts with the time ("Today at 9:42 am", "Yesterday"), then one clause of detail.
- Prices "from $180", ranges "$180–$240"; dates "Sat 24 Oct · 10:00 am".
- Translatable content: projected titles, meta templates, the "Unread:" prefix and list names. Data values: names, times, prices, references. The components render no text.
- Length: long names and titles wrap inside the row at 320 px; the body keeps half the row.

## Performance

- Change detection: `OnPush`, signal inputs, host bindings computed from signals; each template is a single `<ng-content />`.
- Perf-test scenarios: `frontend/projects/perf-test/src/scenarios/List.ts` renders Maya's notification list in a flush card (the unread row "Nia received your request" and the read row "How to prepare for knotless braids"); `ListItem.ts` renders the single unread row. Iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep each at roughly 100–300 ms.
- Regression rule: a change to the templates, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: skeleton rows keep the row padding and two-line height, so rows do not jump when updates arrive; the unread dot is a pseudo-element of fixed size, so marking a row read does not move its text more than the dot's width.
- Weight: no dependencies beyond `@angular/core`; no CDK, no router import.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given Maya's notifications rendered with `<ul hp-list aria-label="Notifications">` in a flush card, when the list renders, then the DOM holds `<ul class="list" aria-label="Notifications">` with one `<li>` per notification, each containing an `a.list__item.list__item--interactive`, and a screen reader announces a list named "Notifications" with 2 items. (L2-041)
- **AC-2** Given the notifications "Nia received your request" (today) and "How to prepare for knotless braids" (yesterday) supplied newest first, when the list renders, then the rows appear in that order and the list does not reorder them. (L2-030)
- **AC-3** Given the row "Nia received your request" linking to HP-1048, when Maya activates it, then the appointment detail for HP-1048 opens. (L2-029)
- **AC-4** Given `<ul hp-list>` with static `li[hp-list-item]` rows "Medium knotless braids · from $180", "Passion twists · from $160" and "Cornrows · from $90", when it renders, then each row has the class `list__item` only, is not focusable, and a 1 px `--color-border-default` rule separates the rows with none after "Cornrows · from $90". (L2-041)
- **AC-5** Given the two notification link rows, when the list renders, then a 1 px `--color-border-default` rule separates them, no rule follows the last row, and each row is at least 44 px tall and as wide as the list. (L2-041)
- **AC-6** Given a row with a leading avatar "NO" and the title "Nia Okafor", when a screen reader reads it, then "Nia Okafor" is announced once and the avatar is not announced. (L2-041)

### States

- **AC-7** Given the unread notification "Nia received your request", when it renders, then the row has `list__item--unread`, an 8 px `--color-accent` dot precedes the title with at least 3:1 against the surface, and its accessible name starts with "Unread: Nia received your request". (L2-030)
- **AC-8** Given the read notification "How to prepare for knotless braids", when it renders, then it shows no dot and no "Read" badge and its accessible name is "How to prepare for knotless braids Yesterday · Read Nia’s preparation checklist." (L2-030)
- **AC-9** Given the unread row "Nia received your request" with focus, when its `unread` input becomes false, then the dot and the "Unread:" prefix disappear, the row stays in the same position and keeps focus. (L2-030)
- **AC-10** Given an `a[hp-list-item]` with `unread` but neither a `.visually-hidden` element nor a `.badge` inside, rendered in development mode, when it initialises, then the console reports an error naming `hp-list-item` and the missing unread text. (L2-041)
- **AC-11** Given a link row, when the pointer hovers it, then its fill becomes `--color-bg-subtle` and the title and meta keep at least 4.5:1. (L2-041)
- **AC-12** Given the help topic row "How requests work" with `current`, when it renders, then it has `aria-current="true"`, a `--color-accent-subtle` fill with the title at least 4.5:1, and a screen reader announces it as current. (L2-041)
- **AC-13** Given the notification center while loading, when the loading state renders, then it shows the list in a flush card with two-line skeleton rows whose skeletons are `aria-hidden="true"`, and the region names what is loading. (L2-035)

### Keyboard and focus

- **AC-14** Given the notification list, when Maya presses Tab from the page header, then focus moves to "Nia received your request" and then "How to prepare for knotless braids", one stop per row, and Enter opens the focused row. (L2-041)
- **AC-15** Given the first row of a list inside a flush card, when it receives keyboard focus, then the whole 2 px `--color-focus-ring` ring is visible inside the row on all four sides and none of it is clipped by the card's rounded edge. (L2-041)

### Theming

- **AC-16** Given the notification list, when the theme switches from light to dark, then the rule between rows becomes grey 750, the unread dot plum 300 and a hovered row grey 800 without a reload, and the title and meta keep at least 4.5:1. (L2-042)
- **AC-17** Given Windows forced colours, when the list renders, then the unread dot is still visible in `CanvasText` and the current row shows a `Highlight` outline. (L2-041)

### Responsive

- **AC-18** Given the unread row "Amara Nkiruka Adeyemi-Williams accepted your change request" with a trailing "Awaiting reply" badge at 320 px, when it renders, then the title's column is at least half the row's content width, the badge sits on its own line at the end of the row, and the page does not scroll horizontally. (L2-042)
- **AC-19** Given the notification list at 200 % text size, when it renders, then every title and meta line is fully readable, rows grow in height instead of overflowing, and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-20** Given `prefers-reduced-motion: reduce`, when a link row is hovered, then its tint applies instantly. (L2-041)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/list/`; files `list.ts` exporting `List` (`selector: 'ul[hp-list], ol[hp-list]'`) and `list-item.ts` exporting `ListItem` (`selector: 'li[hp-list-item], a[hp-list-item]'`), each with `template: '<ng-content />'` and `changeDetection: OnPush`. Export both from `public-api.ts`.
- `List` host binding `class.list`. Styles: `:host` for the list reset; the rule between rows is rooted at the host: `:host ::ng-deep > li:not(:last-child) > .list__item, :host ::ng-deep > li.list__item:not(:last-child)` (D-2).
- `ListItem` host bindings: `class.list__item` always; `class.list__item--interactive` when the host tag is `A` (read once from `ElementRef`); `class.list__item--unread` from `unread`; `attr.aria-current` `'true'` or `null` from `current`. Styles: `:host` for the row; projected parts (`.list__body`, `.list__title`, `.list__meta`, `.truncate`, the trailing part, the unread dot) rooted at the host with `:host ::ng-deep`.
- `components.css` and the design-system list page already carry this CRD's rules, so the port is one to one: the row rule comes from the list's rows (D-2); `.list__item` has `flex-wrap: wrap`, `.list__body` is `flex: 1 1 50%; min-width: 50%`, the trailing part has `margin-inline-start: auto` and a trailing badge aligns to the top (D-4); interactive rows have the inset focus ring (D-7); the forced-colours block draws the dot in `CanvasText` and outlines the current row in `Highlight` (D-8).
- Development check (`isDevMode()`), once after the first render and again when `unread` becomes true: an unread row must contain a `.visually-hidden` element or a `.badge`; otherwise `console.error` naming `hp-list-item` (D-5).
- No CDK primitive. Composes nothing; avatars, icons and badges are projected.
- Perf-test scenarios `List.ts` and `ListItem.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is each notification a card with a "Read" or "Unread" badge and its own primary button, as the first notification-center mocks drew it?* No. The notification center is an interactive list in a flush card, one link per row, with an unread marker only on unread rows; several primary buttons on one page compete and a "Read" badge marks the norm instead of the exception.
- **D-2** *Where does the rule between rows come from?* From the list, under every row but the last. Measured with a rule drawn by `.list__item` and removed by `.list__item:last-child { border-bottom: 0 }`: that removed the rule from every link row, because each `<a class="list__item">` is the last child of its `<li>`, so link rows rendered with no separators while static rows had them. Drawing the rule from the list's `<li>` children fixes both forms.
- **D-3** *How does a list get the card surface when one element cannot host both components?* By nesting: `<div hp-card flush>` around `<ul hp-list>`, as the design system and the mocks write it. Putting `list card card--flush` on one `<ul>` would need two components on one element, which Angular does not allow, and the card's styles are encapsulated in the card. The nested form renders the same surface, edge, corners and clipping.
- **D-4** *What happens when a trailing badge would squeeze the title?* The row wraps and the badge moves to its own line, still at the end. "Trailing badges stay on the title row" and "never push the title below 50 % of the row" cannot both hold at 320 px for "Awaiting reply" (153 px of a 254 px row). Readability wins: the body keeps at least half the row, measured to leave the title the full width at 320 px.
- **D-5** *How is "unread" said in text?* By a visually hidden "Unread: " prefix at the start of the title, which is the design system's code sample and puts the state first in the link's name. A visible "Unread" badge (info tone, per the badge CRD) is allowed instead, but not both, which would announce "Unread" twice. A development-mode console error catches an unread row with neither.
- **D-6** *Are the hosts native elements or wrappers?* Native, through attribute selectors, so the `<ul>`/`<ol>` keeps its list semantics and item count, rows stay `<li>` children (a custom element inside `<ul>` is invalid), and a link row stays a real `<a>` that `routerLink` can drive.
- **D-7** *Where is the focus ring of a link row?* Inside the row. Measured with the shared ring's default: its 2 px outward offset put it outside the row, and the flush card's `overflow: hidden` clipped it on the first row to a single line at the bottom, indistinguishable from a separator. An inset of the ring width plus its offset keeps all four sides visible, including at the card's 12 px corners.
- **D-8** *What do the unread dot and the current row look like in forced colours?* Measured in Chromium's forced-colours emulation: both backgrounds were replaced by `Canvas`, so the dot vanished and the current row lost its tint. The dot uses `forced-color-adjust: none` with `CanvasText`, and the current row gets a `Highlight` outline, matching the design system's treatment of the current nav link, selected tab and pressed chip.
- **D-9** *What shape does the notification center's loading state take?* Skeleton rows inside the same flush list, not a feature grid of skeleton cards, so nothing changes shape when updates arrive (tables-and-lists pattern: skeletons in the collection's own shape).
- **D-10** *Can a row be a `<button>`?* No. The design system's interactive rows are links; an action that does not navigate (mark all read) is a button outside the list. This keeps one tab stop per row and the list's semantics simple.

# Badge

| Field | Value |
|---|---|
| Selector | `span[hp-badge]` |
| Library path | `frontend/projects/components/src/lib/badge/` |
| Status | planned |
| Traces to | L2-017, L2-018, L2-019, L2-020, L2-022, L2-030, L2-041, L2-042 |
| Design system | [`badge.html`](../../design-system/components/badge.html) |
| Source mocks | [`pages/my-appointments/default`](../../mocks/pages/my-appointments/default.html), [`pages/appointment-detail/default`](../../mocks/pages/appointment-detail/default.html), [`pages/appointment-detail/success`](../../mocks/pages/appointment-detail/success.html), [`pages/my-appointments/edge`](../../mocks/pages/my-appointments/edge.html), [`pages/notification-center/read`](../../mocks/pages/notification-center/read.html), [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`dialogs/cancel-appointment/default`](../../mocks/dialogs/cancel-appointment/default.html), [`notifications/booking-update/info`](../../mocks/notifications/booking-update/info.html) |
| Rendering | [`badge.html`](badge.html) |

## Purpose and scope

A badge labels a status in a word or two, so Maya can scan her requests without opening each one: "Awaiting reply" on HP-1048 until Nia answers, "Confirmed" once she accepts, "Completed" after the visit, "Cancelled" if either side cancels. It also carries the unread count on "Updates" and the occasional "New" marker on media. It is read-only, never focusable, and never the only carrier of meaning: the word says the status and a dot adds a shape cue beside the colour.

Use something else when:

- people can select, toggle or remove the value: use the chip (`chip.html`; its CRD follows), including applied filters such as "Knotless", "Toronto", "Under $150";
- the status needs a sentence: use an alert or inline message;
- the status changes while the customer watches: the toast or the page's status region announces the change; the badge just shows the new state.

Out of scope:

- Which status an appointment is in, and which tone each status uses. The appointment record decides the status and the appointments feature maps it to a label and tone using the table under *Content* (D-9); the badge renders what it is given.
- Bold titles for unread notifications and "Unread" visually hidden prefixes in lists. The notification list and card own those.
- The link around a count ("Updates"), its 44 px target and its name. The top bar and sidebar navigation own them; the count badge supplies only its number, and the link writes the hidden count words after it (D-5).
- Placement: `.card__header`, `.appointment-row`, `.stack`, description-list values (`dd`), `.tab`, `.nav-link`, `.account-link` and `.sidebar .nav-link` position the badge; it is their child (D-1).

## Usage

Every use of `.badge` in `docs/mocks/`, plus the configurations the design-system pages define for later screens. The mocks follow the badge page; the decisions that settled earlier mock drift are cited.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Appointment rows on `pages/my-appointments/default`, `long`, `edge`, `offline` | `tone="warning"` above the title of HP-1048; neutral for HP-0992 (D-3) | "Awaiting reply"; "Completed" | default | surface (card) |
| Appointment card on `pages/appointment-detail/default`, `offline`, `partial`, and behind `dialogs/cancel-appointment/*`, `dialogs/change-appointment/*`, `notifications/booking-update/*` | `tone="warning"` in the description list's "Status" value (`dd`) | "Awaiting reply" | default; hugs its label (`width: fit-content`, D-11) | surface (card) |
| Accepted request on `pages/appointment-detail/success` | `tone="success"` in the "Status" value | "Confirmed" | default | surface (card) |
| Cancelled request: Amara's row on `pages/my-appointments/edge`; design-system lifecycle, appointments table HP-0921 | `tone="danger"` above the row title | "Cancelled" | default | surface (card, table) |
| Declined request (L2-020; no mock yet) | `tone="danger"` (D-4) | "Declined" | default | surface (card) |
| Notification rows on `pages/notification-center/default`, `unread`, `read`, `offline` | not used: unread rows carry the list's unread marker and a visually hidden "Unread: " prefix, read rows carry nothing (list D-1, D-5; D-3) | — | — | — |
| "Updates" in the top bar on every signed-in page (`pages/*`, `dialogs/*`, `notifications/*`; the auth pages show "Sign in" instead), except `pages/notification-center/read` and `empty`, where nothing is unread and no count shows | count form, `[count]="2"`, followed by the top bar's visually hidden ", 2 unread"; no `aria-label` on the badge or the link (D-5) | number | 2; hidden at 0; "99+" above 99 | surface (top bar) |
| "Updates" in the sidebar navigation | count form, `[count]="2"`, followed by the sidebar's visually hidden ", 2 unread" | number | 2, hidden at 0 | surface |
| Tab counts ("Upcoming 1", "Reviews 86") and navigation counts ("Past 3") | `tone="info"` or neutral with a number as the content | "1", "86", "3" | inside a selected, hovered, focused or disabled tab or link | surface |
| Card header "Request HP-1048", description list "Status", appointments table status column (design system) | `tone="warning"` / `"success"` / `"danger"` | lifecycle labels | inside a hovered or selected row | surface |
| Emphasis on a photo or busy card (design system) | `solid` | "New" | default | media, surface |
| Edge mocks `pages/*/edge` | not used: the earlier "Long names and missing photos" badge was a mock annotation, not product content, and is not rendered (D-8) | — | — | — |
| No-results filter summary on `pages/style-gallery/no-results`, `pages/matching-braiders/no-results`, `pages/my-appointments/no-results` | not used: the mocks render one removable input chip per applied filter (chip CRD, D-8) | — | — | — |

Every row is buildable with the API below: a tone, `solid`, or the count form, with the words projected as content.

## Anatomy

1. **Pill** — `.badge` on the host itself. `inline-flex`, centred, `--badge-height` (24 px) minimum height, `--space-2` side padding, `--radius-full`, `--badge-bg` fill, `--badge-fg` text. Hugs its content (`width: fit-content`, which also stops a column parent from stretching it) and never stretches; it takes its parent's cross-axis alignment, so it is centred in a link or tab and starts the line in a column (D-11).
2. **Dot** — the `::before` pseudo-element: 8 px circle in `currentColor`, `--space-1` before the label. Hidden on the count form.
3. **Label** — the projected text, `--text-overline` with `--letter-spacing-wide`, uppercased by CSS. The source copy stays sentence case.
4. **Count (count form only)** — the number only, tabular figures, normal letter spacing. Its meaning ("unread") is the consumer's visually hidden text placed after the badge (D-5).

Host: the component uses an attribute selector, so the host **is** the native `<span>` and carries the `.badge` classes and the `hidden` attribute (D-1). The template is `<ng-content />` followed by the count text when `count` is set. Parent rules (`.tab .badge`, `.sidebar .nav-link .badge`, `.stack` children) apply to the host as in the design system.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | no | Adds `.badge--{tone}`; neutral adds no modifier. Ignored when `solid` is true or `count` is set. |
| `solid` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.badge--solid` and no tone class: `--color-info-solid` fill, `--color-fg-on-accent` label, dot kept (D-6). Ignored when `count` is set. |
| `count` | `number \| null` | `null` | no | When a number, the badge is the count form: classes `badge badge--count`, text the number, or `{max}+` above `max`. A count of 0 or less sets the host's `hidden` attribute, so the badge takes no space and is not exposed (D-7). Non-integers are floored. |
| `max` | `number` | `99` | no | Count form only. The largest number shown; above it the badge shows "99+", and the consumer's hidden text after it gives the full number (", 120 unread"). |

- Inputs are signal inputs; `solid` accepts a bare attribute.
- `aria-hidden`, `id` and `class` set by a consumer on the host are kept. A consumer that names the surrounding link with its own `aria-label` may set `aria-hidden="true"` on the count badge; the design system prefers the hidden-words pattern.
- Every user-facing string is projected content (the status words) or the consumer's hidden text beside a count; the component renders only the number and the "+" overflow sign.

### Outputs

None. A badge is never interactive.

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Text only: one to three words ("Awaiting reply"), or a number for tab and navigation counts ("86") | Declared once. Projected nothing in the count form, where the component renders the number itself. No icons: the dot is the badge's only graphic. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Neutral | — (base `.badge`) | Finished or informational states: "Completed"; plain counts in tabs and navigation ("Reviews 86", "Past 3") |
| Info | `.badge--info` | Something new to read: "Upcoming 1"; "Unread" where a list chooses a visible unread marker (list D-5) |
| Success | `.badge--success` | A good, settled state: "Confirmed" |
| Warning | `.badge--warning` | Waiting on someone, or needs the customer's action: "Awaiting reply" |
| Danger | `.badge--danger` | Ended without the visit: "Cancelled", "Declined" |
| Solid | `.badge--solid` | Emphasis on media or a busy card: "New" |
| Count | `.badge--count` | The unread number on "Updates" |

Badges have one size: `--badge-height` (24 px) minimum, `--text-overline` (12 px semibold). Scale emphasis with tone, not size. Width comes from the label and `--space-2` padding; a single-digit count is a 24 px circle (`min-width: --badge-height`, `--space-1` padding).

## States

A badge is static: no hover, focus, active, disabled or selected state of its own, and never focusable. When it sits inside a link, tab or row, the container owns interaction; the badge keeps its own colours.

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (each tone) | `tone` | `--badge-bg` fill, `--badge-fg` label and dot | Text read as written ("Awaiting reply"); no role |
| Solid | `solid` | `--color-info-solid` fill, `--color-fg-on-accent` label | Text read as written |
| Count | `count` ≥ 1 | `--color-danger-solid` fill, `--color-fg-on-danger` number, no dot, tabular figures | The number; the consumer's hidden text after the badge gives its meaning: "Updates 2, 2 unread" |
| Count above max | `count` > `max` | "99+" | "99+"; the hidden text carries the full number: "Updates 99+, 120 unread" |
| Count zero | `count` ≤ 0 | Not rendered (`hidden`, `display: none`) | Not exposed |
| Inside a link, tab or row | parent | Unchanged; the parent's hover, focus ring and selected look surround it; centred vertically in a row parent (D-11) | Read as part of the parent's name: "Updates 2, 2 unread", "Upcoming 1" |
| Inside a hovered container | parent `:hover` | Unchanged | — |
| Inside a disabled tab | parent `disabled` | Follows the parent's 50 % opacity | Part of the disabled tab's name |
| Narrow container or enlarged text | container narrower than the label (text at 200 %) | Label wraps onto a second line inside the pill and the pill grows in height; never wider than its container (D-2). The count form never wraps. | — |
| Dark theme | theme | Each tone swaps to a deep tint with a light label | — |
| Forced colours | `(forced-colors: active)` | `CanvasText` hairline border (design system); the dot drawn in `CanvasText` so the shape cue survives (D-10); text in `CanvasText` | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Nothing changes; a badge never animates, even when its count changes | — |

## Markup

Rendered DOM. Classes and attributes are the e2e contract; the `<span>` is the host.

```html
<!-- rendered: lifecycle tones -->
<span class="badge badge--warning">Awaiting reply</span>
<span class="badge badge--success">Confirmed</span>
<span class="badge">Completed</span>
<span class="badge badge--danger">Cancelled</span>
<span class="badge badge--danger">Declined</span>
```

```html
<!-- rendered: a visible unread marker, where a list uses one instead of hidden text (list D-5); the notification center does not -->
<span class="badge badge--info">Unread</span>
```

```html
<!-- rendered: count form inside the top bar link, above max, and at zero -->
<a class="account-link" href="/notifications">Updates <span class="badge badge--count">2</span><span class="visually-hidden">, 2 unread</span></a>
<a class="account-link" href="/notifications">Updates <span class="badge badge--count">99+</span><span class="visually-hidden">, 120 unread</span></a>
<span class="badge badge--count" hidden></span>
```

```html
<!-- rendered: solid, and a number as tone-badge content inside a tab -->
<span class="badge badge--solid">New</span>
<button class="tab" type="button" role="tab" aria-selected="true">Upcoming<span class="badge badge--info">1</span></button>
```

Consumer templates:

```html
<!-- consumer: appointment row (my appointments) -->
<span hp-badge [tone]="status().tone">{{ status().label }}</span>

<!-- consumer: appointment detail for HP-1048, pending -->
<span hp-badge tone="warning">Awaiting reply</span>

<!-- consumer: top bar -->
<a class="account-link" routerLink="/notifications">Updates <span hp-badge [count]="unread()"></span>@if (unread() > 0) {<span class="visually-hidden">, {{ unread() }} unread</span>}</a>

<!-- consumer: solid -->
<span hp-badge solid>New</span>
```

Free to change: class order. The visually hidden span's leading space is part of the contract (it separates "2" from "unread").

## Design

- Height: `min-height: --badge-height` (1.5 rem, 24 px); padding `0 --space-2` (count: `0 --space-1`, `min-width: --badge-height`).
- Gap dot to label: `--space-1`; dot 0.5 rem (8 px), `--radius-full`, `currentColor`.
- Typography: `--text-overline` (12 px semibold), `--letter-spacing-wide`, `text-transform: uppercase`; the count uses `--letter-spacing-normal` and `font-variant-numeric: tabular-nums`.
- Wrapping (D-2): `white-space: normal`, `overflow-wrap: break-word`, `max-width: 100%`, `text-align: center`; the count form keeps `white-space: nowrap`. Copy is still written to fit one line at 360 px; "Awaiting reply" is the longest status.
- Shape: `--radius-full`; no border except in forced colours.
- Alignment: no `align-self` of its own (D-11); `width: fit-content` keeps it from stretching in a column, and row parents (`.nav-link`, `.tab`, `.account-link`) centre it. The count form keeps `align-self: center`.
- Elevation, motion, layer: none.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--badge-bg` | `--color-bg-subtle` | `.badge--info` → `--color-info-bg`; `.badge--success` → `--color-success-bg`; `.badge--warning` → `--color-warning-bg`; `.badge--danger` → `--color-danger-bg`; `.badge--solid` → `--color-info-solid`; `.badge--count` → `--color-danger-solid`; a surface re-skin |
| `--badge-fg` | `--color-fg-muted` | `.badge--info` → `--color-info-fg`; `.badge--success` → `--color-success-fg`; `.badge--warning` → `--color-warning-fg`; `.badge--danger` → `--color-danger-fg`; `.badge--solid` → `--color-fg-on-accent`; `.badge--count` → `--color-fg-on-danger` |
| `--badge-height` | 1.5 rem | — |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Neutral fill | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Neutral label and dot | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Info fill | `--color-info-bg` | `--palette-plum-50` | `--palette-plum-950` |
| Info label and dot | `--color-info-fg` | `--palette-plum-800` | `--palette-plum-200` |
| Success fill | `--color-success-bg` | `--palette-green-50` | `--palette-green-950` |
| Success label and dot | `--color-success-fg` | `--palette-green-700` | `--palette-green-300` |
| Warning fill | `--color-warning-bg` | `--palette-amber-50` | `--palette-amber-950` |
| Warning label and dot | `--color-warning-fg` | `--palette-amber-700` | `--palette-amber-300` |
| Danger fill | `--color-danger-bg` | `--palette-red-50` | `--palette-red-950` |
| Danger label and dot | `--color-danger-fg` | `--palette-red-700` | `--palette-red-300` |
| Solid fill | `--color-info-solid` | `--palette-plum-600` | `--palette-plum-300` |
| Solid label | `--color-fg-on-accent` | `--palette-white` | `--palette-plum-950` |
| Count fill | `--color-danger-solid` | `--palette-red-600` | `--palette-red-300` |
| Count label | `--color-fg-on-danger` | `--palette-white` | `--palette-red-950` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-subtle` | 4.5:1 | Neutral label |
| `--color-info-fg` | `--color-info-bg` | 4.5:1 | Info label |
| `--color-success-fg` | `--color-success-bg` | 4.5:1 | Success label |
| `--color-warning-fg` | `--color-warning-bg` | 4.5:1 | Warning label |
| `--color-danger-fg` | `--color-danger-bg` | 4.5:1 | Danger label |
| `--color-fg-on-accent` | `--color-info-solid` | 4.5:1 | Solid label |
| `--color-info-solid` | `--color-bg-surface` | 3:1 | Solid pill against a card |
| `--color-fg-on-danger` | `--color-danger-solid` | 4.5:1 | Count number |
| `--color-danger-solid` | `--color-bg-canvas` | 3:1 | Count pill against the top bar and page |

The tinted fills are not required to contrast with the card: the label carries the status, and the dot repeats the label colour.

Forced colours: the design system gives `.badge` a `CanvasText` hairline border; the dot gets `forced-color-adjust: none` and a `CanvasText` fill (D-10). All tones then look alike, and the words carry the status, as they always must.

## Responsive behaviour

- The badge has no breakpoint rules. At every width it hugs its label beside or above the title it describes.
- At 360 px "Awaiting reply" sits on one line, 24 px tall, above "Nia Okafor · knotless braids" in the appointment row.
- When the container is narrower than the label, as with text enlarged to 200 % at 360 px, the label wraps inside the pill and the badge grows in height instead of overflowing (D-2). The count form stays on one line; its link owns the width.
- The count badge stays visible at every width, including when "Updates" is the only top bar item left on a phone.
- Not a target; nothing to size for touch.

## Accessibility

### Role and pattern

A plain `<span>` with text. No role: the words are the content. Status is never colour alone (WCAG 1.4.1): the word says it, the dot adds a shape cue. No APG pattern applies.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skips the badge; it is never focusable. A badge inside a link, tab or row is part of that control. |

### Focus

None on the badge. The containing link, tab or card shows the shared ring around it.

### Labelling

- A text badge needs nothing extra. Inside a link or tab it joins the control's name: "Upcoming 1", "Reviews 86".
- A count badge shows only the number. The consumer places a visually hidden span with the full count and its meaning directly after the badge (", 2 unread", ", 120 unread" when the badge shows "99+"), so "Updates" reads "Updates 2, 2 unread". The visible label stays at the start of the link's name (WCAG 2.5.3); neither the badge nor the link gets an `aria-label` (D-5).
- A hidden count badge (`hidden`) is not read.

### Announcements

None. A badge has no live region. When a status changes ("Awaiting reply" → "Confirmed") or a count drops, the toast or page status region that reports the change announces it; the badge just shows the new value.

### Motion

None. Counts do not bounce or pulse when they change.

## Content and internationalisation

- One to three words, sentence case in the source ("Awaiting reply"); CSS uppercases it. Describe the state, not the action: "Confirmed", not "Confirm".
- Use the same word and tone for the same state on every screen (my appointments, appointment detail, notifications, tables):

| Appointment state | Label | Tone |
|---|---|---|
| Request sent, waiting for the braider | "Awaiting reply" | warning |
| Braider accepted | "Confirmed" | success |
| Visit done | "Completed" | neutral |
| Cancelled by either side | "Cancelled" | danger |
| Braider declined | "Declined" | danger (D-4) |

- Notifications: the notification center shows no badge on its rows; unread rows carry the list's unread marker and a hidden "Unread: " prefix (list D-1, D-5). A list that shows a visible unread marker uses info "Unread", never warning (D-3).
- Never "Booked" or "Confirmed" before Nia accepts; the pending request is "Awaiting reply" (design system *Content*).
- Counts above 99 show "99+"; the consumer's hidden text after the badge keeps the full number (", 120 unread").
- Translatable content: the projected words. Data values: the count. The hidden count text beside a count badge is the consumer's translatable copy. The component itself renders no words, so there is nothing to translate inside it.
- Length: the copy is English only today and no L2 requirement covers translation; a longer label wraps rather than overflows (D-2).

## Performance

- Change detection: `OnPush`, signal inputs; the displayed count and the host classes are `computed`.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Badge.ts` renders the HP-1048 status, `<span hp-badge tone="warning">Awaiting reply</span>`; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none of its own. Appointment rows and the top bar, which repeat badges, get scenarios from their own CRDs.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: the badge's size depends only on its text; a hidden count takes no space, so the "Updates" link narrows when the last unread item is read, which is the intended change.
- Weight: `@angular/core` only.
- Render cost has no L2 requirement, so it has no criterion here.

## Acceptance criteria

### Rendering

- **AC-1** Given the appointment detail for HP-1048 while it awaits Nia's reply, when the card renders `<span hp-badge tone="warning">Awaiting reply</span>`, then the DOM holds the native `<span class="badge badge--warning">Awaiting reply</span>` with no wrapper, it shows an 8 px dot before the uppercased label, and it is 24 px tall. (L2-019)
- **AC-2** Given a badge with no `tone`, `solid` or `count`, when it renders "Completed", then its class list is exactly `badge`, its fill resolves to `--color-bg-subtle` and its label to `--color-fg-muted`. (L2-018)
- **AC-3** Given the "Awaiting reply" badge as a direct child of a `.stack` column, or in the appointment card's "Status" value, when the card renders at 1280 px, then the badge is as wide as its label plus padding, not as wide as the card. (L2-019)

### Lifecycle

- **AC-4** Given a request Maya has just sent to Nia, when its detail loads, then the status badge reads "Awaiting reply" in the warning tone and no badge on the page reads "Confirmed" or "Booked". (L2-017)
- **AC-5** Given My Appointments with HP-1048 pending and HP-0992 completed, when the list renders, then HP-1048 shows a warning badge "Awaiting reply" and HP-0992 a neutral badge "Completed" with no tone class. (L2-018)
- **AC-6** Given HP-1048 after Nia accepts it, when Maya opens its detail, then the status badge is `<span class="badge badge--success">Confirmed</span>`. (L2-019)
- **AC-7** Given a request Nia declines, when Maya opens its detail, then the status badge is a danger badge reading "Declined". (L2-020)
- **AC-8** Given Maya confirms "Cancel request" for HP-1048 and it succeeds, when the detail and My Appointments render again, then both show a danger badge reading "Cancelled". (L2-022)

### Notifications and counts

- **AC-9** Given the notification center with the unread rows "Nia received your request" and "How to prepare for knotless braids", when it renders and again after both are read, then no row holds a badge (the list marks unread rows, list D-5), and once both are read the top bar's "Updates" link shows no count badge. (L2-030)
- **AC-10** Given two unread notifications, when the top bar renders `<span hp-badge [count]="2">` inside "Updates" followed by the hidden ", 2 unread", then the badge DOM is exactly `<span class="badge badge--count">2</span>`, neither the badge nor the link has an `aria-label`, and the link's accessible name is "Updates 2, 2 unread". (L2-030)
- **AC-11** Given the "Updates" count at 2, when Maya marks one notification read, then the count shows 1 exactly once, and when she marks the last one read, then the badge has the `hidden` attribute, takes no space and is not in the accessibility tree. (L2-030)
- **AC-12** Given 120 unread notifications, when the count badge renders inside "Updates" with the hidden ", 120 unread" after it, then the badge shows "99+" on one line and the link is read as "Updates 99+, 120 unread". (L2-030)
- **AC-13** Given a count badge showing 2, when it renders, then it has no dot, uses tabular figures, is a 24 × 24 px circle, and its number's contrast against `--color-danger-solid` is at least 4.5:1. (L2-041)

### Variants

- **AC-14** Given `<span hp-badge solid tone="warning">New</span>`, when it renders, then its classes are exactly `badge badge--solid`, its fill is `--color-info-solid` and its label contrast is at least 4.5:1. (L2-041)

### Keyboard and screen readers

- **AC-15** Given the appointment row for HP-1048 with its badge and "View request" button, when Maya presses Tab through the row, then focus moves to "View request" without stopping on the badge, and the badge has no `tabindex` and no role. (L2-041)
- **AC-16** Given the "Upcoming" tab containing an info badge "1", when its accessible name is computed, then it is "Upcoming 1", and the badge is vertically centred on the tab's label. (L2-041)
- **AC-17** Given the five lifecycle badges rendered in greyscale, when they are compared, then each is still identified by its words, and each tone badge shows its dot. (L2-041)

### Theming

- **AC-18** Given the "Awaiting reply" badge, when the theme switches from light to dark, then its fill changes from the light to the dark `--color-warning-bg` (amber 950) and its label to the dark `--color-warning-fg` (amber 300) without a reload. (L2-042)
- **AC-19** Given each tone, the solid badge and the count badge in each theme, when label contrast is measured against the badge fill, then every ratio is at least 4.5:1. (L2-041)
- **AC-20** Given Windows forced colours, when the lifecycle badges render, then each has a `CanvasText` border, its dot is drawn in `CanvasText`, and its words are visible. (L2-041)

### Responsive

- **AC-21** Given the appointment row for HP-1048 on a 360 px viewport, when it renders, then "Awaiting reply" sits on one line above "Nia Okafor · knotless braids" and the page does not scroll horizontally. (L2-042)
- **AC-22** Given the appointment card on a 360 px viewport with text enlarged to 200 %, when the "Awaiting reply" badge renders, then the badge is no wider than the card's content box, its label wraps inside the pill, and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-23** Given the "Updates" count changes from 2 to 1, when the badge updates, then the number changes without any animation or transition. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/badge/`; file `badge.ts` exporting the standalone component `Badge` with `selector: 'span[hp-badge]'`, `changeDetection: OnPush`, template `<ng-content />@if (count() !== null) {{{ display() }}}`, and scoped `styles` porting the `.badge` rules from `docs/design-system/assets/components.css` onto `:host` and `:host(.badge--info)` … `:host(.badge--count)`, plus `:host([hidden]) { display: none; }` and the D-2 wrapping, D-10 forced-colour and D-11 alignment rules. Export it from `public-api.ts`.
- Host bindings: `class.badge` always; `class.badge--{tone}` when neither `solid` nor `count` applies; `class.badge--solid`; `class.badge--count`; `attr.hidden` (`''` when `count` ≤ 0, else `null`).
- `display = computed(() => count() > max() ? \`${max()}+\` : String(Math.floor(count())))`.
- The `.visually-hidden` utility stays global (foundation utilities); the badge relies on it.
- The D-2 wrapping, D-7 `[hidden]`, D-10 forced-colour and D-11 alignment rules are product CSS in `docs/design-system/assets/components.css` and are shown on the badge page; the component ports them as they are.
- No CDK primitive. Composes nothing.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Badge.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is the host a wrapper element (`<hp-badge>`) or the `<span>`?* The `<span>`, through `span[hp-badge]`. Other components and pages render badges with the `.badge badge--<tone>` classes and the design system positions them as direct children (`.stack > *`, `.tab .badge`, `.sidebar .nav-link .badge { margin-left: auto }`); the e2e page objects locate `.badge`. A wrapper would add a box and break `align-self` inside a column.
- **D-2** *May a label wrap?* Yes, as a safety net; copy is still written to fit one line at 360 px. The design system first said the badge never wraps (`white-space: nowrap`). Measured in Chromium on `pages/my-appointments/default` and `pages/appointment-detail/default` at 360 px with text enlarged to 200 %, the "Awaiting reply" badge is 290 px wide, overruns the card's content box by 91 px, and the page scrolls horizontally, which breaks L2-042 (text zoom to 200 % stays readable and operable). The label therefore wraps inside the pill and the pill grows in height; the count form keeps `nowrap` because a number never needs to wrap. The same choice as the button's D-5; `components.css` and the badge page now state it.
- **D-3** *The first mocks badged "Completed" in success, "Unread" in warning and "Read" in info. Which wins?* The design system, which records all three as drift, and the mocks now follow it: "Completed" is neutral (nothing is pending), and the notification center drops both badges: unread rows carry the list's unread marker and a visually hidden "Unread: " prefix, read rows carry nothing (list D-1, D-5). L2-030 asks that read and unread are each identified; the marker and the hidden prefix identify the unread items, and their absence identifies the read ones. Where a list does show a visible marker, "Unread" is info, never warning.
- **D-4** *L2-020 requires a declined status, but no mock or design-system page shows one. What does it look like?* A danger badge reading "Declined". Like "Cancelled" it ends the request without a visit, and the slot is no longer confirmed; danger is the tone the design system uses for that outcome.
- **D-5** *Where do the words that give a count its meaning go? The mocks put `aria-label="2 unread"` on the badge and "Notifications, 2 unread" on the link; the badge page puts a hidden " unread" inside the badge ("Updates 2 unread"); the top-bar, sidebar and tabs pages put a hidden ", 2 unread" after the badge ("Updates 2, 2 unread").* After the badge, written by the consumer, and the badge renders the number only. Every consumer of the count form (top bar D-6, sidebar navigation, tabs D-11) already follows its own design-system page in this form, and it carries information the in-badge form cannot: when the badge is capped at "99+" the hidden text still gives the full number (", 120 unread"). Both forms keep the visible "Updates" first in the name (WCAG 2.5.3) and neither uses `aria-label`. The badge page shows this form.
- **D-6** *What does `solid` do with a tone?* Solid ignores the tone: the design system defines one solid look (`--color-info-solid` with `--color-fg-on-accent`), and `.badge--solid` overrides the tone tokens anyway. Rendering only `badge badge--solid` keeps the class list honest.
- **D-7** *What does a count of zero render?* Nothing visible: the host gets `hidden`. The design system drops the badge when nothing is unread, and a "0" pill would read as an alert. The host stays in the DOM so the consumer needs no `@if`.
- **D-8** *Were the "Long names and missing photos" and "Knotless · Toronto · under $150" badges in the first mocks product usages?* No. The first was a mock annotation that labelled each `edge` state; the second was a filter summary that the design system replaces with one removable input chip per filter. Neither shapes the badge API, and the mocks no longer render either.
- **D-9** *Does the badge know appointment statuses (an input like `status="pending"`)?* No. It stays a generic status label with a tone; the appointments feature maps its status to the label and tone in the *Content* table. Keeping the domain out of the shared library lets notifications, tabs and tables reuse it unchanged.
- **D-10** *What happens to the dot in forced colours?* It is drawn in `CanvasText` with `forced-color-adjust: none`. Forced colours replace backgrounds, which would erase the `currentColor` dot and remove the badge's only non-text cue; the words remain the primary signal either way.
- **D-11** *The design system first fixed the stretched badge with `align-self: flex-start`. Is that kept?* No; `components.css` now drops it. Measured in Chromium, `align-self: flex-start` also pins the badge to the top of every row parent: inside a `.nav-link` ("HP-1048 Awaiting reply") and a `.tab` ("Upcoming 1") its centre sits 10 px above the link's centre. `width: fit-content`, which the design system already sets, is enough to stop a column parent from stretching it (a stretched item needs an automatic width), so the badge drops `align-self` and takes its parent's alignment: measured, it is centred in links and tabs and still hugs its label (153 px for "Awaiting reply") at the start of a `.stack` column. The tabs CRD's `.tab .badge { align-self: center }` (its D-11) agrees with this and becomes redundant, not conflicting.

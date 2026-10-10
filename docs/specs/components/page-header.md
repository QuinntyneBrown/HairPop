# Page header

| Field | Value |
|---|---|
| Selector | `hp-page-header` |
| Library path | `frontend/projects/components/src/lib/page-header/` |
| Status | planned |
| Traces to | L2-018, L2-019, L2-035, L2-037, L2-041, L2-042 |
| Design system | [`page-header.html`](../../design-system/components/page-header.html) |
| Source mocks | [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`pages/appointment-detail/default`](../../mocks/pages/appointment-detail/default.html), [`pages/my-appointments/default`](../../mocks/pages/my-appointments/default.html), [`pages/my-appointments/loading`](../../mocks/pages/my-appointments/loading.html), [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html), [`pages/care-and-review/default`](../../mocks/pages/care-and-review/default.html), [`pages/sign-in/default`](../../mocks/pages/sign-in/default.html), [`pages/not-found/default`](../../mocks/pages/not-found/default.html), [`pages/terms/default`](../../mocks/pages/terms/default.html), [`pages/notification-center/default`](../../mocks/pages/notification-center/default.html) |
| Rendering | [`page-header.html`](page-header.html) |

## Purpose and scope

The page header opens every screen. It holds a short eyebrow naming the area ("Discover", "Appointments"), the page's one `<h1>` in the light display face that carries HairPop's voice ("Find a style that feels like you", "Your appointment with Nia"), a subtitle with the facts the customer checks first ("Request HP-1048 · Sat 24 Oct at 10:00 am · awaiting Nia’s reply."), and optional page-level actions.

Use something else when:

- the heading belongs to a section or card inside the page: use an `<h2>` in that section;
- the action is about one card ("Request a change" on the appointment card): keep it in the card;
- the screen is a dialog: the dialog has its own title.

Out of scope:

- The breadcrumb that may precede the header (breadcrumb component).
- The document `<title>` ("My appointments — HairPop"). The router's title strategy sets it from the same words.
- The actions themselves: they are Button or Link components with their own CRDs; the header only lays them out.
- The page's loading, empty and error content below the header.

## Usage

Every mock (181 screens) has one page header; none uses actions yet. The inventory groups them by title:

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/style-gallery/*` (8) | eyebrow, title, subtitle | "Discover" · "Find a style that feels like you" · "Browse protective styles, compare typical time and price, and see real work." | default, loading (header unchanged) | canvas |
| `pages/style-detail/*` (7) | eyebrow, title, subtitle | "Discover" · "Knotless braids, your way" · "A lighter feel at the root, with room to choose length and size." | default, loading | canvas |
| `pages/matching-braiders/*` (8) | eyebrow, title, subtitle | "Discover" · "Braiders for knotless braids" · "12 braiders offer this style near Toronto · prices and availability vary." | default, loading, no-results | canvas |
| `pages/braider-profile/*` (7) | eyebrow, title, subtitle | "Discover" · "Nia Okafor" · "Knotless braids and twists in Toronto · 4.9 from 86 reviews." | default, loading, partial | canvas |
| `pages/booking-request/*` (8) | eyebrow, title, subtitle | "Appointments" (mock: "Your HairPop", D-3) · "Request your appointment" · "Nia will review your details and confirm the time and final price." | default, submitting, success | canvas |
| `pages/appointment-detail/*` (7) | eyebrow, title, subtitle | "Appointments" · "Your appointment with Nia" · "Request HP-1048 · Sat 24 Oct at 10:00 am · awaiting Nia’s reply." | default, loading, partial | canvas |
| `pages/my-appointments/*` (8) | eyebrow, title, subtitle; actions in the design system's anatomy | "Appointments" · "My appointments" · "1 request awaiting a reply · 1 completed appointment."; primary "Book a style" | default, loading, empty, no-results | canvas |
| `pages/care-and-review/*` (8) | eyebrow, title, subtitle | "Appointments" · "Care for your knotless braids" · "Your visit with Nia was on Sat 3 Oct · share how it went." | default, loading, submitting | canvas |
| `pages/notification-center/*` (7), `pages/account-settings/*` (7) | eyebrow, title, subtitle | "Account" · "Notifications" · "2 unread updates about your appointments."; "Account" · "Account settings" · "Keep your contact details current so braiders can reach you." | default, loading | canvas |
| `pages/sign-in`, `sign-up`, `forgot-password`, `reset-password`, `verify-email` (29) | no eyebrow (mock: "Your HairPop", D-3) | "Welcome back", "Join HairPop", "Reset your password", "Choose a new password", "Check your email" + subtitles, e.g. "We sent a verification link to maya.chen@example.com." | default, submitting | canvas |
| `pages/help/*` (4), `pages/terms/*`, `pages/privacy/*` (6) | no eyebrow | "How can we help?"; "Terms of use"; "Privacy at HairPop" + subtitles | default, loading | canvas |
| `pages/not-found`, `forbidden`, `server-error`, `offline` (12) | no eyebrow | "We couldn’t find that page", "You can’t open this page", "HairPop needs a moment", "You’re offline" + subtitles | default | canvas |
| Every dialog and notification mock (60) | the header of the page behind | as for that page | — | canvas under the backdrop |
| Design system *Variants*, with actions | eyebrow, title, subtitle, actions | "Appointments" · "Your appointment with Nia" · secondary "Request a change" + primary "Message Nia" | button states | canvas |

Every row is buildable with `eyebrow`, `heading`, `subtitle` and the `actions` slot.

## Anatomy

1. **Container** — `.page-header` on the host: a wrapping flex row, `align-items: flex-end`, `justify-content: space-between`, `--space-4` gap, `--space-6` below it.
2. **Title block** — an unclassed `<div>` holding parts 3–5.
3. **Eyebrow (optional)** — `p.eyebrow`: `--text-overline`, `--letter-spacing-wide`, uppercase by CSS, `--color-fg-accent`, `--space-2` below. A paragraph before the heading, never inside it.
4. **Title** — the page's `<h1>` with `tabindex="-1"`: `--text-h1` (light, fluid `--font-size-4xl`, 40–68 px), `--letter-spacing-tight`, balanced wrapping, long words broken when they cannot fit (D-5).
5. **Subtitle (optional)** — `p.subtitle`: body text, `--color-fg-muted`, `--space-1` above, capped at `--layout-measure` (65ch).
6. **Actions (optional)** — `div.page-header__actions`: wrapping flex row with `--space-3` gaps; full width below 768 px with the primary full width on its own row; from 768 px inline at the row's end, aligned to the bottom of the title block. Not rendered visibly when empty (D-7).

Host: `hp-page-header` is an element that carries `.page-header` itself (D-1); it renders the title block and the actions container as its only children.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `heading` | `string` | — | yes | The `<h1>` text. Specific, sentence case, no full stop: "Your appointment with Nia". |
| `eyebrow` | `string \| null` | `null` | no | The area name ("Discover", "Appointments", "Account"). `null` renders no eyebrow element (auth, legal, help and error pages, D-3). |
| `subtitle` | `string \| null` | `null` | no | Facts separated by middle dots, ending with a full stop. `null` renders no subtitle element. |
| `focusOnNavigation` | `boolean` (`booleanAttribute`) | `true` | no | When true, the component moves focus to its `<h1>` if it was created by a client-side navigation (D-6). Set false for a header created without a route change (for example, one swapped in by a page state). |

- Inputs are signal inputs. Every user-facing string is an input or projected content.
- Public method `focusHeading(): void` moves focus to the `<h1>` (with `preventScroll: false`); pages call it when they replace their content without a route change and want the same announcement.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The header is static; its actions emit their own events. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `[slot=actions]` | One or more Button (`button[hp-button]`, `a[hp-button]`) or Link components, each with `slot="actions"` | Projected into `.page-header__actions`. At most one `variant="primary"`. Put the primary last, after the secondary actions; DOM order is visual and focus order at every width (D-4). Page-level actions only. Declared once in the template. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Eyebrow, title, subtitle | — | The common form: every browsing and account screen. |
| Title and subtitle | `eyebrow: null` | Auth, legal, help and error pages. |
| Title only | `eyebrow` and `subtitle` null | A legal page where nothing else adds information ("Terms of use"). |
| With actions | `[slot=actions]` content | A page-level action: "Book a style" on My appointments. |

One size. The title scales fluidly with the viewport through `--font-size-4xl` (40 px at 360 px, 68 px from about 1280 px); nothing else changes size.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Eyebrow, title, subtitle as given | `<h1>` in the headings list; eyebrow and subtitle as paragraphs |
| Page loading | the page's data is pending | Unchanged: the header stays real (never a skeleton) because its copy is known before the data arrives | The `<h1>` identifies the page while the region below is busy |
| Focused after navigation | client-side route change created the header | No visible ring on the heading (D-6) | Screen readers read the new heading |
| Actions, button states | the actions' own triggers | As the Button CRD (hover, focus, active, busy, disabled) | As the Button CRD |
| No actions | slot empty | No actions container space (D-7) | — |
| Wrapped title | title wider than the row | Balanced lines; at 200 % text a word that cannot fit breaks across lines, hyphenated where the browser hyphenates English (D-5) | — |

The header itself is not interactive.

## Markup

Rendered DOM. Classes and elements are the e2e contract.

```html
<!-- rendered: appointment detail, pending request -->
<hp-page-header class="page-header">
  <div>
    <p class="eyebrow">Appointments</p>
    <h1 tabindex="-1">Your appointment with Nia</h1>
    <p class="subtitle">Request HP-1048 · Sat 24 Oct at 10:00 am · awaiting Nia’s reply.</p>
  </div>
  <div class="page-header__actions"></div>
</hp-page-header>
```

```html
<!-- rendered: My appointments with a page action -->
<hp-page-header class="page-header">
  <div>
    <p class="eyebrow">Appointments</p>
    <h1 tabindex="-1">My appointments</h1>
    <p class="subtitle">1 request awaiting a reply · 1 completed appointment.</p>
  </div>
  <div class="page-header__actions">
    <a class="btn btn--primary" href="/" slot="actions">Book a style</a>
  </div>
</hp-page-header>
```

```html
<!-- rendered: error page, no eyebrow -->
<hp-page-header class="page-header">
  <div>
    <h1 tabindex="-1">We couldn’t find that page</h1>
    <p class="subtitle">The link may be old, or the address may have changed.</p>
  </div>
  <div class="page-header__actions"></div>
</hp-page-header>
```

Consumer templates:

```html
<hp-page-header eyebrow="Appointments" heading="Your appointment with Nia"
  [subtitle]="'Request ' + ref() + ' · ' + when() + ' · awaiting ' + braiderFirstName() + '’s reply.'" />

<hp-page-header eyebrow="Appointments" heading="My appointments" [subtitle]="summary()">
  <a hp-button variant="primary" slot="actions" routerLink="/">Book a style</a>
</hp-page-header>

<hp-page-header eyebrow="Appointments" heading="Your appointment with Nia" [subtitle]="facts()">
  <button hp-button slot="actions" (click)="requestChange()">Request a change</button>
  <a hp-button variant="primary" slot="actions" [routerLink]="messageLink()">Message Nia</a>
</hp-page-header>
```

Free to change: nothing inside the host except that the empty actions container may be omitted instead of hidden.

## Design

- Container: `display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: --space-4; margin-block: 0 --space-6`. Inside `.product-main` a preceding sibling adds `--space-6` above.
- Eyebrow: `--text-overline`, `--letter-spacing-wide`, `text-transform: uppercase`, `--color-fg-accent`, `margin-bottom: --space-2`.
- Title: `--text-h1` (`--font-weight-light`, `--font-size-4xl`, `--line-height-tight`, `--font-family-display`), `--letter-spacing-tight`, `text-wrap: balance`, `overflow-wrap: anywhere` with `hyphens: auto` (D-5); `--color-fg-default`. No focus outline when focused programmatically (D-6).
- Subtitle: `--text-body`, `--color-fg-muted`, `margin-top: --space-1`, `max-width: --layout-measure`, `text-wrap: pretty`.
- Actions: `display: flex; flex-wrap: wrap; gap: --space-3; width: 100%`; `.btn--primary` inside takes `flex: 1 1 100%`. From `--layout-breakpoint-md`: `width: auto`, primary `flex: none`. `:empty` → `display: none` (D-7).
- Elevation, layer and motion: none.

Component tokens: none. A brand theme changes the display face through `--font-family-display`, never the header rules (design system *Theming*).

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Eyebrow | `--color-fg-accent` | `--palette-plum-700` | `--palette-plum-300` |
| Title | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Subtitle | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Background (page) | `--color-bg-canvas` | `--palette-gray-50` | `--palette-gray-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-accent` | `--color-bg-canvas` | 4.5:1 | Eyebrow (12 px text) |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Title |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Subtitle |

Action contrast is the Button CRD's. Forced colours: text takes `CanvasText`; nothing depends on colour.

## Responsive behaviour

- **Below 768 px**: actions move below the subtitle and take the full width; the primary action is full width on its own row after the secondary actions (D-4). Measured at 360 px: "Request a change" on the first row (16–187 px), "Message Nia" full width on the second (16–344 px).
- **From 768 px**: actions keep their natural width and sit at the end of the row, aligned to the bottom of the title block, whenever the title block leaves room (measured at 1280 px: 918–1232 px beside the title). When the title block takes the whole row, as "Your appointment with Nia" does at 768 px, the actions wrap below it, left-aligned, still at natural width (D-10).
- The title is fluid (40 px at 360 px, 68 px from about 1280 px) and wraps with `text-wrap: balance`; keep it under about 40 characters so it fits in two lines on phones.
- At 200 % text the title's long words break instead of overflowing (D-5). Measured at 360 px: "My appointments" made the page 513 px wide with today's stylesheet; with word breaking it fits in 328 px.
- 24 px (`--space-6`) separates the header from the page content at every width.
- At 320 px nothing scrolls horizontally or clips; at 200 % text everything stays readable; action targets follow the Button CRD (a phone's main action uses `size="lg"`, 48 px).

## Accessibility

### Role and pattern

No ARIA. The title is the page's single `<h1>`. The eyebrow is a paragraph before the heading, not part of it, so the heading reads cleanly in a headings list. The uppercase eyebrow is styled with `text-transform`, so screen readers read "Appointments", not letter by letter.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | The header itself is not in the Tab order (`tabindex="-1"` on the heading allows only programmatic focus). Tab reaches its actions in DOM order, which matches the visual order at every width (D-4). |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate an action (Button and Link rules). |

### Focus

- On a client-side route change the new page's header moves focus to its `<h1>` so screen-reader users hear the new page (design system *Focus*); the next Tab continues from the heading into the page.
- On the first page load the header never moves focus; focus starts at the document and the skip link.
- The heading shows no focus ring when focused programmatically; it is not an operable control (D-6).

### Labelling

The title names the page specifically ("Your appointment with Nia", not "Details"); the document `<title>` starts with the same words. A pending request is never called "confirmed" in the title or subtitle.

### Announcements

None beyond the heading being read when focused after navigation.

### Motion

None.

## Content and internationalisation

- Titles are warm and specific, in sentence case, without a full stop: "Find a style that feels like you", "Care for your knotless braids".
- Subtitles hold facts separated by middle dots and end with a full stop: "Request HP-1048 · Sat 24 Oct at 10:00 am · awaiting Nia’s reply."
- Eyebrows are one or two words: "Discover" for browsing, the area name for account screens ("Appointments", "Account"), none for auth, legal, help and error pages (D-3).
- Dates and times use the appointment's local time zone, as "Sat 24 Oct at 10:00 am"; prices as "$180–$240" with estimate language.
- Translatable inputs: `heading`, `eyebrow`, `subtitle`, projected action labels. Data values inside them: braider names ("Nia"), references ("HP-1048"), dates, counts, the customer's email.
- Long titles wrap over several lines; nothing truncates.

## Performance

- Change detection: `OnPush`, signal inputs; the template is three conditional elements and one slot.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/PageHeader.ts` renders the appointment detail header for HP-1048: "Appointments" · "Your appointment with Nia" · "Request HP-1048 · Sat 24 Oct at 10:00 am · awaiting Nia’s reply."; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none; one header per page.
- Regression rule: a change to its template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: the header renders its final copy on the server and does not become a skeleton while the page loads, so it never shifts (it is the largest text on most pages, so this also protects LCP).
- Weight: `@angular/core`; `@angular/router` is injected optionally to detect client-side navigation.

## Acceptance criteria

### Rendering

- **AC-1** Given Maya's My appointments page, when the header renders, then the host has the class `page-header` and holds `p.eyebrow` "Appointments", one `<h1>` "My appointments" and `p.subtitle` "1 request awaiting a reply · 1 completed appointment.", and the page contains no other `<h1>`. (L2-018)
- **AC-2** Given request HP-1048 is pending, when the appointment detail header renders, then the title is "Your appointment with Nia" and the subtitle reads exactly "Request HP-1048 · Sat 24 Oct at 10:00 am · awaiting Nia’s reply.", with no "confirmed" anywhere in the header. (L2-019)
- **AC-3** Given the headings list of the appointment detail page, when a screen reader lists headings, then the level-one heading is "Your appointment with Nia" without "Appointments", and the eyebrow's text node is "Appointments" in sentence case, displayed uppercase by CSS. (L2-041)
- **AC-4** Given an unknown route, when the not-found page's header renders with `eyebrow: null`, then no `p.eyebrow` element exists, the `<h1>` reads "We couldn’t find that page" and the subtitle "The link may be old, or the address may have changed." (L2-037)
- **AC-5** Given My appointments is loading, when the page renders its loading state, then the header shows "My appointments" and its subtitle as real text with no skeleton in the header, identifying the page being loaded. (L2-035)

### Actions

- **AC-6** Given My appointments with a primary "Book a style" in `[slot=actions]` at 1280 px, when it renders, then the button is inside `.page-header__actions` at the end of the row, bottom-aligned with the title block. (L2-042)
- **AC-7** Given the appointment header with "Request a change" (secondary) then "Message Nia" (primary) at 360 px, when it renders, then the actions sit below the subtitle, "Request a change" comes first and "Message Nia" spans the full width on the next row, and Tab moves from "Request a change" to "Message Nia" in that visual order. (L2-041)
- **AC-8** Given a header with no projected actions at 360 px, when it renders, then the header's height equals its title block's height, with no empty row or extra gap below the title. (L2-042)

### Focus

- **AC-9** Given Maya on My appointments, when she follows "View request" for HP-1048 by client-side navigation, then focus moves to the `<h1>` "Your appointment with Nia" and a screen reader reads it. (L2-041)
- **AC-10** Given a first page load of the style gallery, when the header renders, then focus is not moved and the first Tab reaches the skip link. (L2-041)
- **AC-11** Given `focusOnNavigation` false, when the header is created by a client-side navigation, then focus stays where it was. (L2-041)
- **AC-12** Given the heading focused after navigation, when it is displayed, then no focus ring is drawn around it, and the next Tab moves to the first focusable element after the header. (L2-041)

### Responsive

- **AC-13** Given a 360 px viewport, when "Your appointment with Nia" renders, then the title is 40 px, wraps over at most three balanced lines and does not overflow; at 1280 px it is 68 px. (L2-042)
- **AC-14** Given a 360 px viewport with text enlarged to 200 %, when "My appointments" and "Notifications" render, then each word that cannot fit breaks across lines, the whole title is visible, and the page does not scroll horizontally. (L2-042)
- **AC-15** Given a 320 px viewport, when "Care for your knotless braids" with its subtitle renders, then nothing is clipped, the subtitle wraps, and 24 px separates the header from the content below. (L2-042)

### Theming

- **AC-16** Given the light theme, when Maya switches to dark, then without a reload the eyebrow becomes `--palette-plum-300`, the title `--palette-gray-150` and the subtitle `--palette-gray-350` on the `--palette-gray-950` canvas. (L2-042)
- **AC-17** Given either theme, when contrast is measured, then the eyebrow, title and subtitle are each at least 4.5:1 against `--color-bg-canvas`. (L2-041)

### Performance

Render cost is measured by the `PageHeader` perf-test scenario and gated by `--fail-on-regression`; no L2 requirement covers client render cost, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/page-header/`; file `page-header.ts` exporting the standalone component `PageHeader` with `selector: 'hp-page-header'`, `changeDetection: OnPush`, host binding `class.page-header`, and scoped `styles` porting `.page-header`, `.eyebrow`, `.subtitle` and `.page-header__actions` (`:host` for `.page-header`; `:host` is `display: flex` from that rule). Export it from `public-api.ts`.
- Template: `<div>@if (eyebrow()) {<p class="eyebrow">{{ eyebrow() }}</p>}<h1 #heading tabindex="-1">{{ heading() }}</h1>@if (subtitle()) {<p class="subtitle">{{ subtitle() }}</p>}</div><div class="page-header__actions"><ng-content select="[slot=actions]" /></div>`, with no whitespace inside the actions container so `:empty` matches (D-7).
- New rules, mirrored into `components.css` and the design-system page in the same slice: `.page-header h1 { overflow-wrap: anywhere; hyphens: auto; }` (D-5), `.page-header h1:focus { outline: none; }` (D-6), `.page-header__actions:empty { display: none; }` (D-7).
- Focus (D-6): inject `Router` optionally; in the constructor record `router?.navigated === true` (true only when an earlier navigation has completed); after the first render (`afterNextRender`), if that flag and `focusOnNavigation()` are true, call `focusHeading()`.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/PageHeader.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Wrapper element, native `<div>` host, or element with the class on the host?* The element `hp-page-header` carrying `.page-header` itself. It is a composite (title block and actions), and no rule depends on the element type: `.page-header` and `.product-main > * + *` match any element. With the class on the host there is no extra wrapper, so the DOM matches the mocks except for the element name.
- **D-2** *Title, eyebrow and subtitle as inputs or projected content?* Inputs: every mock's values are plain strings, inputs guarantee the eyebrow is a paragraph outside the `<h1>` and the heading is exactly one `<h1>`, and only actions need projection.
- **D-3** *Every non-browsing mock, including sign in, legal and error pages, uses the eyebrow "Your HairPop".* The design system wins: the area name ("Appointments" for booking, appointment detail, My appointments and care; "Account" for notifications and account settings) or no eyebrow (auth, legal, help and error pages). The design-system page records this as drift fixed during extraction.
- **D-4** *The design system says that below 768 px "the primary action is full width and comes first", but `components.css` does not reorder it, and reordering visually would make the focus order differ from the visual order.* DOM order, visual order and focus order stay identical at every width: consumers put the primary last, and on phones it is full width on its own row after the secondary actions (needs product confirmation). L2-041 requires focus order to follow the content order; `.form-actions` uses `order: -1` for the same purpose, but a page header has no submit semantics that would justify the mismatch. Measured at 360 px with today's stylesheet, this is already how it renders.
- **D-5** *At 200 % text, long title words overflow (measured at 360 px: "My appointments" 513 px, "Notifications" 467 px, "Your appointment with Nia" 474 px wide pages).* The title breaks words that cannot fit (`overflow-wrap: anywhere` with `hyphens: auto`), so L2-042's 200 % text criterion holds; at default text no title breaks a word at 320 px.
- **D-6** *How does the header move focus to the `<h1>` after a client-side route change, and is a ring shown?* The component focuses its heading after first render when the router had already completed a navigation before the component was created, which is true for client-side navigations and false on the first load (so the first load starts at the skip link, as the top bar page says). No ring is drawn: the heading is not operable and the ring would sit around the page's largest text after every navigation. `focusOnNavigation` lets a page opt out, and `focusHeading()` lets it announce a content swap.
- **D-7** *An empty `.page-header__actions` still adds a 16 px gap (measured at 360 px: 59 px header versus 43 px without the container).* The container is hidden when empty (`:empty { display: none }`), so a header without actions is exactly its title block's height.
- **D-8** *Is the heading level configurable?* No. The header always renders the page's only `<h1>`; sections inside the page use `<h2>`.
- **D-9** *What does the header show while the page's data loads, for example a subtitle that needs the appointment's date?* The page passes the strings it already has; a subtitle that depends on unloaded data is passed once known (it is `null` until then), and the header never shows a skeleton or placeholder text. The mocks' loading states show the full header because the static copy is known.
- **D-10** *The design system says actions sit "at the end of the row" from 768 px. Measured at 768 px, the title block of "Your appointment with Nia" (32–621 px) leaves no room and the actions wrap below it. Is that a defect?* No: it is the row's `flex-wrap`, and it keeps both the title and the actions whole. From 768 px the rule that matters is that actions keep their natural width (the primary is no longer full width); they share the title's row only when it has room, as at 1280 px.

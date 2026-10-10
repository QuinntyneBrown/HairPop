# Card

| Field | Value |
|---|---|
| Selector | `article[hp-card]`, `section[hp-card]`, `aside[hp-card]`, `div[hp-card]` |
| Library path | `frontend/projects/components/src/lib/card/` |
| Status | planned |
| Traces to | L2-001, L2-004, L2-006, L2-018, L2-019, L2-035, L2-041, L2-042 |
| Design system | [`card.html`](../../design-system/components/card.html) |
| Source mocks | [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`pages/style-gallery/edge`](../../mocks/pages/style-gallery/edge.html), [`pages/style-gallery/loading`](../../mocks/pages/style-gallery/loading.html), [`pages/matching-braiders/default`](../../mocks/pages/matching-braiders/default.html), [`pages/matching-braiders/edge`](../../mocks/pages/matching-braiders/edge.html), [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html), [`pages/style-detail/default`](../../mocks/pages/style-detail/default.html), [`pages/appointment-detail/default`](../../mocks/pages/appointment-detail/default.html), [`pages/appointment-detail/success`](../../mocks/pages/appointment-detail/success.html), [`pages/my-appointments/default`](../../mocks/pages/my-appointments/default.html), [`pages/my-appointments/edge`](../../mocks/pages/my-appointments/edge.html), [`pages/notification-center/default`](../../mocks/pages/notification-center/default.html), [`pages/help/default`](../../mocks/pages/help/default.html), [`pages/booking-request/default`](../../mocks/pages/booking-request/default.html), [`pages/terms/default`](../../mocks/pages/terms/default.html) |
| Rendering | [`card.html`](card.html) |

## Purpose and scope

A card groups one subject on a raised surface so a customer can compare, choose or check it: a style in the gallery, a braider in the matching results, the appointment summary, a review, a section of a detail page. Every card answers one question and offers at most one main action. The component draws the surface and lays out its parts (media, eyebrow, title, summary, header, footer, action) in one of three layouts: block (a detail section), story (media first, for things chosen by look) and row (a record and its next step on one line). It can also make its whole surface a link target, mark the chosen option in a set, or drop its padding for edge-to-edge media, lists and tables.

Use something else when:

- the items are homogeneous updates read top to bottom (notifications): use the list component ([list.md](list.md));
- people compare the same three or more facts across many records: use the table ([table.md](table.md));
- the content is the fields of one record: put a description list ([description-list.md](description-list.md)) inside a card;
- the content is a whole page or a page section on the canvas: use plain content in the layout primitives ([container.md](container.md)); a card never frames a page;
- something needs separating inside a card: use a divider ([divider.md](divider.md)) or a well, never a nested card.

Out of scope:

- Grid placement and card widths. The layout primitives (`.feature-grid`, `.detail-grid`, `.stack`) decide them ([container.md](container.md)).
- The badge, avatar, button, link, fact tiles, skeleton and empty state rendered inside a card. Their CRDs own their markup; this CRD only places them.
- Which heading level a card title uses. The page decides (h2 in a grid under the page h1, h3 inside a section); the card styles the role, not the level.
- Loading, empty and error decisions. The page decides which state to show; the card only frames skeleton content in the final shape (D-10).
- Copy and data: names, prices, dates, ratings and the rule that a missing rating or availability is never invented (L2-004, L2-008) belong to the page and its data.
- Navigation. The card's link is a native `<a>` the consumer renders; the card adds no router dependency.

## Usage

Every use of `.card` in `docs/mocks/`, grouped by configuration (inventory: `usage_inventory.py docs/mocks card`), plus the configurations the design system defines for later screens. Dialog mocks list cards only because the page behind the dialog uses them; no dialog body contains a card.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/style-gallery/default`, `long`, `offline`, `edge` (feature grid) | `article`, `layout="story"` | photo `.story-card__photo` (Knotless braids, alt "Medium knotless braids shown from the back and side") or art `.story-card__art` holding the `sparkle` icon (`icon--fill`) (Passion twists, Cornrows); `.eyebrow` "Most explored" / "Protective style" / "Classic"; `h2.card__title`; `.text-muted` "Gentle at the root · 4–7 hours · typically $160–$300"; link "Explore Knotless braids →" | default, link hover and focus | canvas, in `.feature-grid` |
| `pages/matching-braiders/default`, `long`, `offline`, `edge` (feature grid) | `article`, `layout="story"` | photo of Nia (alt "Portrait of Nia Okafor", D-7) or art panel (Aisha Mensah, Jules Baptiste); eyebrow "Available Sat 24 Oct" / "Next week" / "Available Sun 25 Oct"; summary "4.9 ★ · 86 reviews · Toronto West · knotless braids from $180"; link "View Nia’s profile →" / "View Aisha’s profile →" / "View Jules’s profile →" (D-7) | default, link hover and focus | canvas, in `.feature-grid` |
| `pages/help/default` (feature grid) | `article`, `layout="story"` | art panel; eyebrow "Appointments" / "Pricing" / "Support"; titles "How requests work", "Prices and estimates", "Need a hand?"; one link each, named by its target: "See how requests work →", "See what changes a quote →", "Contact support →" | default | canvas |
| `pages/style-detail/default`, `partial`, `edge`, `offline` main column | `section`, block, named by its heading (`aria-labelledby`, D-9) | `.hero-photo` (alt "Long medium knotless braids with neat, visible parting"), h2 "What to expect", body, fact tiles, `.text-muted` quote factors | default | canvas, `.detail-grid` main |
| `pages/style-detail/*` aside | `aside`, block | h2 "Make it yours", body, primary button "See braiders for this style" | default | canvas, `.detail-grid` aside |
| `pages/braider-profile/default`, `partial`, `edge` | `div` (in `section.stack`), block | `.profile-head` (avatar "NO", h2 "Nia Okafor", "Toronto West · 4.9 ★ from 86 reviews"), bio, fact tiles, primary button "Request with Nia" | default | canvas, `.detail-grid` main |
| `pages/braider-profile/*` reviews | `div`, block | h2 "Customer reviews", blockquote "The parts were so neat…" cited "Maya Chen, 3 Oct", link "Report a review" | default | canvas |
| `pages/braider-profile/*` aside | `aside`, block | h2 "Before you book", a stacked description list ([description-list.md](description-list.md)): Service area "Toronto West", Address "Shared after confirmation", Typical duration "5 hours", Knotless braids "From $180" | default | canvas, `.detail-grid` aside |
| `pages/appointment-detail/default`, `partial`, `success`, `offline` | `section`, block, with `class="stack"` | badge "Awaiting reply" (warning) or "Confirmed" (success); h2 "Medium knotless braids" named by `aria-labelledby`; the request's facts as a description list ([description-list.md](description-list.md)); `.cluster` with "Request a change" (secondary) and "Cancel request" (link) | default | canvas, `.detail-grid` main |
| `pages/appointment-detail/*` aside | `aside`, block | h2 "Prepare for your visit", ordered list of three steps | default | canvas, `.detail-grid` aside |
| `pages/my-appointments/default`, `long`, `edge`, `offline` | `div`, `layout="row"` | text block (badge "Awaiting reply" (warning) / "Completed" (neutral, badge CRD D-3), `h2.card__title` "Nia Okafor · knotless braids", `.text-muted` "Sat 24 Oct · 10:00 am · estimate $180–$240" / "Sat 3 Oct · review ready") and one action ("View request" primary, "View care and review" secondary) | default, wraps below 768 px | canvas, in `.stack` |
| `pages/*/edge` (style gallery, matching braiders, braider profile, my appointments) | `div`, block | neutral badge "Long names and missing photos" (a mock annotation, D-15), h2 "Amara Nkiruka Adeyemi-Williams", a 1,284-review summary | long name wraps | canvas |
| `pages/*/loading` (every page with a loading state) | the final shape (D-10): story cards with a 3:2 skeleton media box in the feature grid (style gallery, matching braiders, help); row cards in a `.stack` (my appointments); the detail grid's main and aside cards (style detail, braider profile, appointment detail); a flush card of skeleton list rows (notification center); the form panel card (form pages) | skeleton title, text and 3:2 hero skeletons, `aria-hidden` | loading | canvas, in the screen's own collection layout |
| Form pages: `booking-request`, `care-and-review`, `sign-in`, `sign-up`, `forgot-password`, `reset-password`, `account-settings` (every state) | `section`, block, with `class="form-panel"` | h2 "Your details" / "Details", a `form.stack` | default, invalid, submitting, success | canvas |
| `pages/terms/default`, `pages/privacy/default` | `section`, block, with `class="legal-copy"` | h2 "Using HairPop", paragraphs | default | canvas |
| `pages/notification-center/default`, `unread`, `read`, `offline` | `div`, `flush`, holding the notification list ([list.md](list.md), D-6) | "Nia received your request", "How to prepare for knotless braids" | unread, read | canvas |
| Design system *Default, with header and footer* | `section`, block, `.card__header` + `.card__footer` | header h2 "Request HP-1048" + badge "Awaiting reply"; footer "Request a change" (secondary) and "View request" (primary link) | default | canvas or surface |
| Design system *Interactive* | `article`, `layout="story"`, `interactive` | title link `.card__link` "Knotless braids" | default, hover, focus | canvas |
| Design system *Selected* (time or braider picked in a flow) | `div` or `article`, `selected` | "Sat 24 Oct · 10:00 am", "Selected · Nia’s first offered time · about 5 hours" | selected, interactive + selected | canvas |
| Design system *Flush* | `div` or `section`, `flush` | edge-to-edge photo, the notification list, a table | default | canvas |
| Design system *Sizes* | block card containing a `.well` | "A well inside a card for a note or a reference such as HP-1048." | default | canvas |

Every row is buildable with the API below: one native host element, `layout` × `interactive` × `selected` × `flush`, all content projected with the part classes in *Anatomy*, and consumer classes (`stack`, `form-panel`, `legal-copy`) added to the host.

## Anatomy

1. **Container** — `.card` on the host. `--card-bg` surface, `--border-width-hairline` border in `--card-border`, `--radius-lg` corners, `--card-shadow`, `--card-padding` (24 px), `min-width: 0` so long content never widens a grid track. In the block layout, each child after the first gets `--space-4` above it, except dividers, which keep their own `--space-6` (D-4).
2. **Media (optional)** — `.story-card__photo` (a 3:2 `<img>` with real `alt`, `object-fit: cover`) or `.story-card__art` (a 3:2 decorative panel, `aria-hidden="true"`, the filled `sparkle` icon at `1em` of the panel's `--font-size-5xl`, in `--color-fg-accent` on `--color-accent-subtle`); in a detail section, `.hero-photo` or `.hero-art` with `--space-6` below. `--radius-md` corners. The box has its 3:2 height before the image loads.
3. **Eyebrow (optional)** — `.eyebrow` (global type utility): overline in `--color-fg-accent`, why this card is here ("Most explored", "Available Sat 24 Oct").
4. **Title** — a real heading. `.card__title` gives the h4 role (`--text-h4`) in grids and rows; any other `h2`/`h3` inside a card gets the h3 role (`--text-h3`), never the 36 px page h2. Every heading in a card breaks a word that is longer than its line (`overflow-wrap: anywhere`), so a long name never runs past the card (D-16).
5. **Summary** — `.text-muted` (global type utility): one line of facts separated by " · ".
6. **Action (optional)** — one link or button that names its target. In an interactive card it is the title's `.card__link`, stretched over the card.
7. **Header (optional)** — `.card__header`: the title row with a trailing badge or action; wraps when both do not fit (D-3).
8. **Footer (optional)** — `.card__footer`: actions after a `--border-width-hairline` top rule, `--space-4` above, `--space-3` between, aligned to the end, wrapping.
9. **Profile head (optional)** — `.profile-head`: avatar beside the name and summary, wrapping; the text block may shrink below its longest word (`min-width: 0`) so the heading wraps beside the avatar (D-16).
10. **Well (optional)** — `.well`: a sunken box inside a card for a note or a reference.

Badges inside a card wrap their own labels and keep their natural width (`width: fit-content`) without `align-self` (badge CRD D-2, D-11), so the card adds no badge alignment rule.

Host: the component uses attribute selectors, so the host **is** the native `<article>`, `<section>`, `<aside>` or `<div>` and carries the `.card` classes and every ARIA attribute (D-1). The template is a single `<ng-content />`; there is no wrapper element. Parts 2–10 are projected markup carrying the classes above, styled by the card (D-2).

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `layout` | `'block' \| 'story' \| 'row'` | `'block'` | no | `story` adds `.story-card` (media-first column with a `--space-4` gap); `row` adds `.appointment-row` (summary and action on one line, wrapping); `block` adds no class and uses flow spacing between children. |
| `interactive` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.card--interactive`: the one `.card__link` inside is stretched over the card, the card lifts on hover and shows the focus ring while the link has keyboard focus. Requires exactly one `.card__link` and no other link or button in the card; in development mode a violation is reported as a console error (D-11). |
| `selected` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.card--selected`: `--color-accent` edge and a 1 px accent ring. Visual only; the consumer states the selection in text or with `aria-current` on the card's link (D-14). |
| `flush` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.card--flush`: padding 0 and `overflow: hidden`, so a photo, list or table meets the rounded edge. |

- Inputs are signal inputs (`input()`); booleans accept bare attributes.
- `aria-labelledby`, `aria-label`, `aria-current`, `id`, `role` and `aria-selected` are plain native attributes on the host; the component never reads or rewrites them, except that the development check reads `aria-labelledby` and `aria-label` on a `<section>` host (D-9).
- Consumer classes on the host are kept: `stack` (detail card with a single gap), `form-panel` (form width cap from the form-layout CRD), `legal-copy` (long-form copy).
- Every user-facing string is projected content; the component renders no copy of its own.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | A card is not a control. The projected link or button raises its own native events; an interactive card's surface click is a click on its `.card__link` (the stretched pseudo-element belongs to the link). |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Any flow content, using the part classes in *Anatomy* for media, title, header, footer, link, profile head and well | Declared once in the template. Parts are projected markup, not inputs, so their order follows the DOM (media first in a story card). An interactive card contains exactly one `.card__link` and no other interactive element. Never a nested card. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Default (block) | — | A section of a detail page or a form panel: "What to expect", "Prepare for your visit", "Your details". |
| Story | `.story-card` | A thing chosen by look, media first, in a grid: a style, a braider, a help topic. |
| Row | `.appointment-row` | A record and its one next step on a line: My appointments. |
| Interactive | `.card--interactive` | Combines with any layout: the whole card follows its one link. |
| Selected | `.card--selected` | Combines with any layout: the chosen option in a set (a time, a braider) in a flow. |
| Flush | `.card--flush` | Edge-to-edge media, a list or a table inside the card's frame. |
| With header / footer | `.card__header`, `.card__footer` parts | A record summary with a status badge and footer actions. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One size | — | from content | `--card-padding` (`--space-6`, 24 px); 0 when flush | title `--text-h4`, section headings `--text-h3`, summary inherits body or `--text-body-sm` |

Width comes from the grid track or container; the card never sets its own width. A `.well` (`--space-4` padding) is the only smaller box inside a card.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | `--card-bg` surface, `--card-border`, `--card-shadow` (`--shadow-1`) | Role from the host element; `<section>` is a region named by its heading, `<aside>` a complementary landmark, `<article>` an article |
| Hover (interactive only) | `:hover` on the card | Lifts by `translateY(-1px)`, `--card-shadow` becomes `--shadow-2`, `--card-border` becomes `--color-border-strong` | — |
| Focus (interactive only) | `.card__link:focus-visible` | The shared ring (`--focus-ring-width` of `--color-focus-ring`, offset `--focus-ring-offset`) drawn around the whole card with its `--radius-lg` corners; the link draws no ring of its own | Focus is on the link; its name is the title |
| Active (interactive only) | `:active` on the link | No change beyond hover; navigation follows | — |
| Selected | `selected` input or `[aria-selected="true"]` on a `role="option"` host | `--card-border` becomes `--color-accent` plus a 1 px `--color-accent` ring | Said in text ("Selected · …") or `aria-current="true"` on the card's link; `aria-selected` when the consumer builds a listbox |
| Interactive + selected | both inputs | Accent edge; hover lift still applies | `aria-current="true"` on the `.card__link` |
| Static card hover and focus | — | No change; a static card has no hover, focus or disabled state. Links and buttons inside it show their own states | — |
| Loading | consumer projects skeletons (skeleton CRD) | Same padding, radius and media ratio as the loaded card; skeletons pulse under `--motion-loop-state` | The page's region carries `aria-busy`; skeletons are `aria-hidden` |
| Long content | a name longer than the line, for example "Amara Nkiruka Adeyemi-Williams" | Titles and summaries wrap onto further lines; nothing truncates; the card grows in height and never widens its track | Full text read |
| Media pending or missing | photo not yet loaded; record has no photo | The 3:2 box is reserved before the photo loads; a record without a photo renders the art panel at the same 3:2 size | Art panel hidden; photo `alt` read |
| Forced colours | `(forced-colors: active)` | Border `CanvasText`; a selected card's border `Highlight`; the focus ring `Highlight` through `--color-focus-ring` | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Lift, shadow and border changes are instant (`--duration-fast` is zeroed) | — |
| Dark theme | `data-theme="dark"` | Surface grey 900 on a grey 950 canvas, deeper shadow, border grey 750 | — |

There is no disabled state: a card that cannot be acted on has no link.

## Markup

Rendered DOM. Classes and attributes are the e2e contract; the host element carries `.card`.

```html
<!-- rendered: story card with photo (style gallery) -->
<article class="card story-card">
  <img class="story-card__photo" src="/media/styles/knotless-braids.png" width="1200" height="800" alt="Medium knotless braids shown from the back and side">
  <div class="stack">
    <p class="eyebrow">Most explored</p>
    <h2 class="card__title">Knotless braids</h2>
    <p class="text-muted">Gentle at the root · 4–7 hours · typically $160–$300</p>
    <a href="/styles/knotless-braids">Explore Knotless braids <span aria-hidden="true">→</span></a>
  </div>
</article>
```

```html
<!-- rendered: story card with art panel (braider without a photo) -->
<article class="card story-card">
  <div class="story-card__art" aria-hidden="true"><svg class="icon icon--fill" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg></div>
  <div class="stack">
    <p class="eyebrow">Next week</p>
    <h2 class="card__title">Aisha Mensah</h2>
    <p class="text-muted">4.8 ★ · 64 reviews · North York · knotless braids from $195</p>
    <a href="/braiders/aisha-mensah">View Aisha’s profile <span aria-hidden="true">→</span></a>
  </div>
</article>
```

```html
<!-- rendered: interactive story card (stretched title link) -->
<article class="card story-card card--interactive">
  <img class="story-card__photo" src="/media/styles/knotless-braids.png" width="1200" height="800" alt="Medium knotless braids shown from the back and side">
  <div class="stack">
    <p class="eyebrow">Most explored</p>
    <h2 class="card__title"><a class="card__link" href="/styles/knotless-braids">Knotless braids</a></h2>
    <p class="text-muted">Gentle at the root · 4–7 hours · typically $160–$300</p>
  </div>
</article>
```

```html
<!-- rendered: detail section with header and footer -->
<section class="card" aria-labelledby="request-hp-1048">
  <div class="card__header">
    <h2 id="request-hp-1048">Request HP-1048</h2>
    <span class="badge badge--warning">Awaiting reply</span>
  </div>
  <p><strong>Sat 24 Oct · 10:00 am</strong> with Nia Okafor</p>
  <p class="text-muted">Estimated price: $180–$240 · about 5 hours.</p>
  <div class="card__footer">
    <button class="btn" type="button">Request a change</button>
    <a class="btn btn--primary" href="/appointments/hp-1048">View request</a>
  </div>
</section>
```

```html
<!-- rendered: appointment detail card (mock configuration) and its aside -->
<section class="card stack" aria-labelledby="appointment-title">
  <span class="badge badge--warning">Awaiting reply</span>
  <h2 id="appointment-title">Medium knotless braids</h2>
  <p><strong>Sat 24 Oct · 10:00 am</strong> with Nia Okafor</p>
  <div class="cluster">
    <button class="btn" type="button">Request a change</button>
    <button class="btn btn--link" type="button">Cancel request</button>
  </div>
</section>
<aside class="card" aria-labelledby="prepare-title">
  <h2 id="prepare-title">Prepare for your visit</h2>
  <ol>
    <li>Wash and detangle your hair.</li>
    <li>Bring the extensions discussed with Nia.</li>
    <li>Send any inspiration photos in advance.</li>
  </ol>
</aside>
```

```html
<!-- rendered: row card (My appointments) -->
<div class="card appointment-row">
  <div>
    <span class="badge badge--warning">Awaiting reply</span>
    <h2 class="card__title">Nia Okafor · knotless braids</h2>
    <p class="text-muted">Sat 24 Oct · 10:00 am · estimate $180–$240</p>
  </div>
  <a class="btn btn--primary" href="/appointments/hp-1048">View request</a>
</div>
```

```html
<!-- rendered: profile head, selected option, flush media, well -->
<div class="card">
  <div class="profile-head">
    <span class="avatar avatar--xl" aria-hidden="true">NO</span>
    <div><h2>Nia Okafor</h2><p>Toronto West · 4.9 ★ from 86 reviews</p></div>
  </div>
</div>
<div class="card card--selected">
  <h3 class="card__title">Sat 24 Oct · 10:00 am</h3>
  <p class="text-muted">Selected · Nia’s first offered time · about 5 hours</p>
</div>
<div class="card card--flush">
  <img class="story-card__photo" src="/media/styles/knotless-braids.png" width="1200" height="800" alt="Long medium knotless braids with neat, visible parting">
</div>
<div class="card"><p>Your reference</p><div class="well">HP-1048</div></div>
```

Consumer templates (the badge, avatar and button are their own components; see their CRDs):

```html
<!-- consumer: gallery story card -->
<article hp-card layout="story">
  @if (style.photoUrl) {
    <img class="story-card__photo" [src]="style.photoUrl" width="1200" height="800" [alt]="style.photoAlt">
  } @else {
    <div class="story-card__art" aria-hidden="true"><svg hp-icon name="sparkle" fill></svg></div>
  }
  <div class="stack">
    @if (style.eyebrow) { <p class="eyebrow">{{ style.eyebrow }}</p> }
    <h2 class="card__title">{{ style.name }}</h2>
    <p class="text-muted">{{ style.summary }}</p>
    <a [routerLink]="['/styles', style.slug]">Explore {{ style.name }} <span aria-hidden="true">→</span></a>
  </div>
</article>

<!-- consumer: interactive braider card, selected in a flow -->
<article hp-card layout="story" interactive [selected]="chosen() === braider.id">
  <div class="story-card__art" aria-hidden="true"><svg hp-icon name="sparkle" fill></svg></div>
  <h2 class="card__title">
    <a class="card__link" [routerLink]="['/braiders', braider.slug]" [attr.aria-current]="chosen() === braider.id ? 'true' : null">{{ braider.name }}</a>
  </h2>
  <p class="text-muted">{{ braider.summary }}</p>
</article>

<!-- consumer: appointment row -->
<div hp-card layout="row">
  <div>
    <span hp-badge tone="warning">Awaiting reply</span>
    <h2 class="card__title">Nia Okafor · knotless braids</h2>
    <p class="text-muted">Sat 24 Oct · 10:00 am · estimate $180–$240</p>
  </div>
  <a hp-button variant="primary" [routerLink]="['/appointments', 'hp-1048']">View request</a>
</div>

<!-- consumer: named detail section; form panel; flush list -->
<section hp-card class="stack" aria-labelledby="appointment-title">…</section>
<section hp-card class="form-panel" aria-labelledby="details-title">…</section>
<div hp-card flush><ul hp-list aria-label="Notifications">…</ul></div>
```

Free to change: the order of classes in the class list, and how the stretched link and focus ring are drawn, as long as the rendered classes, the one-link rule and the visible result stay the same.

## Design

- Surface: `background: var(--card-bg)`, `border: var(--border-width-hairline) solid var(--card-border)`, `border-radius: var(--radius-lg)`, `box-shadow: var(--card-shadow)`, `padding: var(--card-padding)`, `min-width: 0`.
- Block flow: each child after the first gets `margin-top: var(--space-4)`; dividers (`hr`, `.divider`) are excluded and keep `--space-6` above and below (D-4). `stack`, `story-card`, `appointment-row`, `cluster` and `profile-head` on the host own their gaps instead.
- Headings: `.card__title` uses `--text-h4` with `--letter-spacing-normal`; any other `h2` or `h3` in a card (except `.empty__title`) uses `--text-h3` with `--letter-spacing-normal`.
- Story layout: flex column, gap `--space-4`; a text link (`a:not(.btn)`) aligns to the start so its target is only as wide as its text.
- Media: `width: 100%`, `aspect-ratio: 3 / 2`, `object-fit: cover`, `--radius-md`; the art panel sets `--font-size-5xl` at line height 1 and its `.icon` is `1em` square; `.hero-photo` and `.hero-art` add `--space-6` below.
- Row layout: flex row, wrap, `align-items: center`, `justify-content: space-between`, gap `--space-3`; the text block has `min-width: 0` (D-16).
- Long words: `.card__title` and every `h2`/`h3` in a card use `overflow-wrap: anywhere` (D-16).
- Header: flex row, wrap (D-3), `justify-content: space-between`, `align-items: flex-start`, gap `--space-4`.
- Footer: `padding-top: var(--space-4)`, top rule `--border-width-hairline` in `--color-border-default`, flex wrap, gap `--space-3`, `justify-content: flex-end`.
- Profile head: flex wrap, `align-items: center`, gap `--space-3`; its text block has `min-width: 0` (D-16).
- Well: `--color-bg-surface-sunken`, `--radius-md`, padding `--space-4`.
- Interactive: `position: relative`; the `.card__link::after` covers the card (`inset: 0`) with the card's `--radius-lg`, and draws the focus ring (`outline: var(--focus-ring-width) solid var(--color-focus-ring)`, `outline-offset: var(--focus-ring-offset)`) while the link is `:focus-visible`; the link itself draws no ring; hover lift `translateY(-1px)`; `box-shadow`, `border-color` and `transform` transition over `--duration-fast` with `--ease-standard`.
- Selected: `--card-border: var(--color-accent)` and `box-shadow: 0 0 0 var(--border-width-hairline) var(--color-accent)`.
- Elevation: `--shadow-1` at rest, `--shadow-2` on interactive hover. Layer: none; the card never creates a stacking context above its surroundings.

Component tokens (defined in `components.css`):

| Token | Aliases | Overridden by |
|---|---|---|
| `--card-bg` | `--color-bg-surface` | a consumer re-skin on its own selector (the design system's theming example sets it to `--color-accent-subtle`) |
| `--card-border` | `--color-border-default` | `.card--interactive:hover` → `--color-border-strong`; `.card--selected` → `--color-accent` |
| `--card-shadow` | `--shadow-1` | `.card--interactive:hover` → `--shadow-2` |
| `--card-padding` | `--space-6` | `.card--flush` → `0` |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Surface | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Page behind cards | `--color-bg-canvas` | `--palette-gray-50` | `--palette-gray-950` |
| Border | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Border, interactive hover | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-450` |
| Selected edge | `--color-accent` | `--palette-plum-600` | `--palette-plum-300` |
| Title and body | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Summary | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Eyebrow, art glyph | `--color-fg-accent` | `--palette-plum-700` | `--palette-plum-300` |
| Art panel | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Link | `--color-fg-link` | `--palette-plum-700` | `--palette-plum-300` |
| Well, footer rule | `--color-bg-surface-sunken`, `--color-border-default` | `--palette-gray-100`, `--palette-gray-200` | `--palette-gray-925`, `--palette-gray-750` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Title and body |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Summary |
| `--color-fg-accent` | `--color-bg-surface` | 4.5:1 | Eyebrow |
| `--color-fg-link` | `--color-bg-surface` | 4.5:1 | Action link, interactive title |
| `--color-fg-default` | `--color-bg-surface-sunken` | 4.5:1 | Text in a well |
| `--color-accent` | `--color-bg-surface` | 3:1 | Selected edge against the card |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Selected ring against the page |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring against neighbouring cards |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring against the page |

The default border is decorative (the surface and shadow separate the card) and is exempt from 1.4.11. The art panel is decorative and hidden. Forced colours: the stylesheet gives `.card` a `CanvasText` border and a selected card a `Highlight` border (the accent ring is a shadow the system removes), and the tokens map `--color-focus-ring` to `Highlight`, so the selected edge and the focus ring stay visible.

## Responsive behaviour

- The card has no breakpoint rules of its own; the grid decides its width. In `.feature-grid` it is one column below 768 px, two from 768 px and three from 1024 px; in `.detail-grid` the aside drops under the main card below 768 px ([container.md](container.md)). Measured: media boxes are 238 × 159 at 320 px, 278 × 185 at 360 px, 294 × 196 at 768 px and 334 × 223 at 1280 px, the same for photo and art cards in one row.
- Padding stays `--space-6` at every width; at 320 px a card in the page margins has 238 px of content width, enough for every card in the mocks.
- Row cards wrap: below 768 px the action drops under the summary (measured at 320 and 360 px; on one line at 768 px).
- Headers wrap: when the title and badge do not fit on one line the badge moves under the title (D-3). Without wrapping, the badge of "Request HP-1048" overflowed the 238 px content box at 320 px and the badge of "Amara Nkiruka Adeyemi-Williams" crossed the card's edge.
- Headings break a word longer than their line, measured at 360 px with text at 200 %: without it, "Adeyemi-Williams" ran 6 px past the profile card and the header overflowed (D-16).
- Titles and summaries wrap and never truncate, including "Amara Nkiruka Adeyemi-Williams" at 320 px (two lines, no horizontal scroll). A person's name is never truncated.
- Media keeps 3:2 at every width, so the grid does not jump while images load (measured: the box is 250 × 167 in a 300 px card before the image arrives).
- At 200 % text size (rem media queries follow it) the feature grid is one column even at 1280 px and nothing overflows; at 200 % browser zoom the 320 px layout applies.
- Targets: an interactive card is one large target; a story card's text link is at least `--target-min` (24 px) tall and sits apart from other targets by the `--space-4` gap.

## Accessibility

### Role and pattern

The host is a native sectioning element chosen by meaning: `<article>` for something that stands alone (a style, a braider, a review, a help topic), `<section aria-labelledby>` for a named part of a page (a region landmark), `<aside>` for the detail grid's second column (a complementary landmark), `<div>` for a row or a frame with no meaning of its own. The card has no ARIA role of its own and is never `role="button"` or wrapped in an `<a>`. An interactive card contains exactly one real link.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves through the card's links and buttons in DOM order. A static card is not a tab stop; an interactive card is one tab stop (its `.card__link`). |
| <kbd>Enter</kbd> | Follows the focused link (an interactive card's `.card__link`). |

### Focus

- Focus lands on the projected link or button, never on the card.
- In an interactive card the ring is drawn around the whole card, with its rounded corners, while the `.card__link` has keyboard focus; the link itself draws no second ring. No ring after a pointer click.
- The ring is offset outside the card by `--focus-ring-offset`, so it is measured against the page (`--color-bg-canvas`) and the neighbouring card surface.

### Labelling

- The card title is a real heading at the page's level. A `<section>` card is named by its heading with `aria-labelledby`; in development mode a `<section>` host without `aria-labelledby` or `aria-label` is reported as a console error (D-9).
- Link text names the target ("Explore Knotless braids", "View Nia’s profile"), never "Learn more". Decorative arrows are `aria-hidden="true"`.
- An interactive card's accessible name is its `.card__link` text (the title), not the whole card's text.
- Photos have `alt` that describes the hair or the person ("Medium knotless braids shown from the back and side", "Portrait of Nia Okafor"); art panels are `aria-hidden="true"`; avatars beside a visible name are `aria-hidden="true"`.
- Selection is said in text or with `aria-current="true"` on the card's link, never only by the accent edge. Status inside a card is badge text ("Awaiting reply"), never colour alone.

### Announcements

The card has no live region. Count changes ("12 braiders") and loading are announced by the page's status region.

### Motion

The interactive hover lift, shadow and border change animate over `--duration-fast`. Under `prefers-reduced-motion: reduce` the tokens zero `--duration-fast`, so the change is instant; skeletons inside a loading card pause through `--motion-loop-state`.

## Content and internationalisation

- Title: the thing, not a sentence ("Knotless braids", "Nia Okafor", "Medium knotless braids"). Row titles join braider and service: "Nia Okafor · knotless braids".
- Summary: one line of facts in a fixed order, separated by " · ": rating, reviews, area, price for a braider ("4.9 ★ · 86 reviews · Toronto West · knotless braids from $180"); feel, time, price for a style ("Gentle at the root · 4–7 hours · typically $160–$300"); date, time, estimate for an appointment ("Sat 24 Oct · 10:00 am · estimate $180–$240").
- Eyebrow: one short reason the card is here ("Most explored", "Available Sat 24 Oct"), sentence case in source, uppercase by style. Omit it when there is no reason; never invent availability (L2-004).
- Prices are ranges with an en dash and no spaces ("$180–$240") labelled typical, from or estimate; times read "Sat 24 Oct · 10:00 am".
- One action per card, named by its target: "View Nia’s profile", "View request", "View care and review".
- Translatable content: every projected string (eyebrow, link text, button labels, badge text). Data values: names, areas, ratings, prices, dates, review counts. The component renders no text, so it has nothing to translate.
- Length: the longest name in the cast, "Amara Nkiruka Adeyemi-Williams", and the 1,284-review summary wrap inside the card at 320 px; text enlarged to 200 % wraps the same way.

## Performance

- Change detection: `OnPush`, signal inputs, host class bindings computed from signals; the template is a single `<ng-content />`.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Card.ts` renders Nia Okafor's matching-braiders story card (photo, eyebrow "Available Sat 24 Oct", title "Nia Okafor", summary "4.9 ★ · 86 reviews · Toronto West · knotless braids from $180", link "View Nia’s profile"); iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: `StoryCardGrid.ts` renders the matching-braiders `.feature-grid` of three story cards (Nia Okafor with a photo, Aisha Mensah and Jules Baptiste with art panels), the composition repeated on the style gallery, matching braiders and help screens; `AppointmentRows.ts` renders My appointments' two row cards (HP-1048 "Awaiting reply" with "View request", HP-0992 "Completed" with "View care and review"), repeated page after page in the 126-result list.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: media reserve 3:2 before load (CSS `aspect-ratio` plus `width`/`height` attributes); loading cards use skeletons in the final shape and media ratio (D-10); hover lift uses `transform`, which does not move neighbours.
- Weight: no dependencies beyond `@angular/core`. No CDK, no router, no image library.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given the style gallery's Knotless braids card rendered with `<article hp-card layout="story">`, when it renders, then the DOM holds `<article class="card story-card">` with no wrapper element, an `img.story-card__photo` with alt "Medium knotless braids shown from the back and side", the title "Knotless braids", the summary "Gentle at the root · 4–7 hours · typically $160–$300" and the link "Explore Knotless braids". (L2-001)
- **AC-2** Given the gallery's first row (Knotless braids with a photo, Passion twists and Cornrows with art panels) at 1280 px, when it renders, then each media box measures 3:2 of its card's content width, all three are the same size and the three titles start at the same height. (L2-001)
- **AC-3** Given a story card whose photo has not finished loading, when the grid renders, then the photo box already measures 3:2 of the card width and the title, summary and link do not move when the photo arrives. (L2-001)
- **AC-4** Given Nia Okafor's matching-braiders card, when it renders, then it shows the photo with alt "Portrait of Nia Okafor", the eyebrow "Available Sat 24 Oct", the title "Nia Okafor", the summary "4.9 ★ · 86 reviews · Toronto West · knotless braids from $180" and one link named "View Nia’s profile". (L2-004)
- **AC-5** Given Aisha Mensah's result without a photo, when her card renders, then it shows a `.story-card__art` panel with `aria-hidden="true"` at the same 3:2 size as Nia's photo, and no broken image or empty `img` is rendered. (L2-004)
- **AC-6** Given Nia's result card, when the customer activates "View Nia’s profile", then Nia Okafor's profile opens and the card's summary named her "knotless braids" service. (L2-006)
- **AC-7** Given a `div[hp-card]` with no inputs, when it renders, then its class list is exactly `card`, its padding is 24 px, its corners use `--radius-lg`, and each child after the first is 16 px below the previous one. (L2-041)

### Layouts and variants

- **AC-8** Given My appointments with HP-1048, when its row card renders, then it is `<div class="card appointment-row">` holding the badge "Awaiting reply" (`.badge.badge--warning`), the title "Nia Okafor · knotless braids", the line "Sat 24 Oct · 10:00 am · estimate $180–$240" and one primary link "View request" to HP-1048's detail. (L2-018)
- **AC-9** Given HP-0992's completed row, when it renders, then it shows the neutral badge "Completed" (`.badge` with no tone modifier), "Sat 3 Oct · review ready" and a secondary link "View care and review" that opens its care and review page. (L2-018)
- **AC-10** Given the appointment detail card for HP-1048 rendered as `<section hp-card class="stack" aria-labelledby="appointment-title">`, when it renders, then the region is named "Medium knotless braids", its badge reads "Awaiting reply", and once the request is confirmed the same card shows "Confirmed" (`.badge.badge--success`) without changing its layout. (L2-019)
- **AC-11** Given a card with a `.card__header` holding "Request HP-1048" and the badge "Awaiting reply" and a `.card__footer` holding "Request a change" and "View request", when it renders at 1280 px, then the badge sits at the end of the title row, the footer has a hairline top rule in `--color-border-default` with 16 px above the buttons, and the buttons align to the end. (L2-019)
- **AC-12** Given `<article hp-card layout="story" interactive>` with the title link "Knotless braids", when the customer clicks the card's summary text, then the browser follows the link to the Knotless braids detail, and the card exposes exactly one link, named "Knotless braids". (L2-041)
- **AC-13** Given an interactive card, when the pointer hovers it, then it moves up 1 px, its shadow becomes `--shadow-2`, its border `--color-border-strong`, and the title's contrast stays at least 4.5:1. (L2-041)
- **AC-14** Given an interactive braider card with `selected` and `aria-current="true"` on its link, when it renders, then its border and a 1 px ring use `--color-accent` with at least 3:1 against `--color-bg-surface` and `--color-bg-canvas`, and a screen reader announces the link as current. (L2-041)
- **AC-15** Given a selected time card reading "Selected · Nia’s first offered time · about 5 hours", when it renders in forced colours, then the card keeps a visible border and the word "Selected" still identifies the choice. (L2-041)

### States

- **AC-16** Given an interactive card whose `.card__link` receives keyboard focus, when the ring shows, then a 2 px `--color-focus-ring` outline surrounds the whole card with rounded corners, offset 2 px, at least 3:1 against `--color-bg-canvas`, and no second ring is drawn around the link text. (L2-041)
- **AC-17** Given `<article hp-card interactive>` with no `.card__link`, or with a second link inside, rendered in development mode, when it initialises, then the console reports an error naming `hp-card` and the one-link rule. (L2-041)
- **AC-18** Given `<section hp-card>` without `aria-labelledby` or `aria-label` in development mode, when it initialises, then the console reports an error naming `hp-card` and the missing region name. (L2-041)
- **AC-19** Given My appointments while its data is loading, when the loading state renders, then each placeholder is a row card (`.card.appointment-row`) in the same `.stack`, with the final card's padding and radius, so the collection does not change from a grid to rows when HP-1048 and HP-0992 arrive. (L2-035)
- **AC-20** Given the style gallery while loading, when its placeholder story cards render, then each holds a 3:2 skeleton media box the size of the final photo, the skeletons are `aria-hidden="true"`, and the region identifies what is loading. (L2-035)

### Keyboard and screen readers

- **AC-21** Given the matching-braiders grid of Nia Okafor, Aisha Mensah and Jules Baptiste, when the customer tabs through it, then focus visits "View Nia’s profile", "View Aisha’s profile" and "View Jules’s profile" in that order and never stops on a card itself. (L2-041)
- **AC-22** Given the style detail page, when a screen reader lists landmarks, then it finds a region named "What to expect" and a complementary landmark "Make it yours", and the art panels and decorative arrows are not announced. (L2-041)

### Theming

- **AC-23** Given an appointment row card, when the theme switches from light to dark, then its surface changes from `--palette-white` to `--palette-gray-900` on a `--palette-gray-950` canvas and its border from grey 200 to grey 750 without a reload, and the title, summary and eyebrow keep at least 4.5:1. (L2-042)
- **AC-24** Given Windows forced colours, when cards render, then every card has a `CanvasText` border and an interactive card's focus ring uses `Highlight`. (L2-041)

### Responsive

- **AC-25** Given the edge card "Amara Nkiruka Adeyemi-Williams" at 320 px, when it renders, then the full name is visible on more than one line, nothing is truncated or clipped and the page does not scroll horizontally. (L2-042)
- **AC-26** Given HP-1048's row card at 360 px, when it renders, then "View request" sits below the text block, inside the card, and the page does not scroll horizontally; at 768 px it sits on the same line as the text. (L2-042)
- **AC-27** Given a card header with the title "Amara Nkiruka Adeyemi-Williams" and the badge "Awaiting reply" at 320 px, when it renders, then the badge moves below the title and stays inside the card's padding. (L2-042)
- **AC-28** Given the gallery at 1280 px with the browser's text size at 200 %, when it renders, then the feature grid shows one card per row, every title and summary is readable without horizontal scrolling and every media box keeps 3:2. (L2-042)

- **AC-29** Given the braider-profile edge state with the profile head "Amara Nkiruka Adeyemi-Williams" beside the avatar "AA", at 360 px with the browser's text size at 200 %, when it renders, then the heading wraps (breaking "Adeyemi-Williams" if it must), every character stays inside the card's content box and the page does not scroll horizontally. (L2-042)
- **AC-30** Given HP-1048's row card and a header card titled "Amara Nkiruka Adeyemi-Williams" at 360 px with text at 200 %, when they render, then the title, badge and action all stay inside each card and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-31** Given `prefers-reduced-motion: reduce`, when an interactive card is hovered, then the lift, shadow and border change apply instantly. (L2-041)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/card/`; file `card.ts` exporting the standalone component `Card` with `selector: 'article[hp-card], section[hp-card], aside[hp-card], div[hp-card]'`, `template: '<ng-content />'`, `changeDetection: OnPush`. Export it from the library's `public-api.ts`.
- Host bindings: `class.card` always; `class.story-card` and `class.appointment-row` from `layout`; `class.card--interactive`, `class.card--selected`, `class.card--flush` from the inputs.
- Styles: port the card rules from `docs/design-system/assets/components.css` (`.card`, `.card--*`, `.card__*`, `.story-card*`, `.hero-photo`, `.hero-art`, `.appointment-row`, `.profile-head`, `.well`, and the card lines of the forced-colours block) into the component's `styles`. Rules on the card itself use `:host` and `:host(.card--interactive)`; rules on projected parts are rooted at the host (`:host ::ng-deep .card__title`, `:host(:not(.stack, .story-card, .appointment-row, .cluster, .profile-head)) ::ng-deep > :not(hr, .divider) + :not(hr, .divider)`), so they style only the card's own subtree (D-2).
- `components.css` and the design-system card page already carry this CRD's rules, so the port is one to one: `.card__header` has `flex-wrap: wrap` (D-3); card headings have `overflow-wrap: anywhere` and the profile head's and row's text blocks `min-width: 0` (D-16); the block flow rule skips `hr` and `.divider` (D-4); the interactive focus ring is drawn on the stretched `.card__link::after` (`outline` with `--focus-ring-width` and `--focus-ring-offset`, `border-radius: var(--radius-lg)`) rather than with `:has()` on the card, which gives the same ring without relying on emulated encapsulation scoping `:has()` arguments; the art panel sizes its `sparkle` icon to `1em`; in forced colours a selected card's border is `Highlight`.
- Development checks (`isDevMode()`), run once after the first render: when `interactive` is true, `host.querySelectorAll('.card__link')` must find exactly one element and `host.querySelectorAll('a[href], button')` exactly that one (D-11); when the host is a `<section>`, it must have `aria-labelledby` or `aria-label` (D-9). Violations call `console.error` with a message naming `hp-card`.
- No CDK primitive. Composes nothing; badges, avatars, buttons, fact tiles and skeletons are projected.
- Perf-test scenarios `Card.ts`, `StoryCardGrid.ts` and `AppointmentRows.ts` in `frontend/projects/perf-test/src/scenarios/`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is the host a wrapper element (`<hp-card>`) or the native sectioning element?* The native element, through attribute selectors on `article`, `section`, `aside` and `div`. A card's meaning changes with the host (article, named region, complementary landmark, plain frame), the layout rules address `.card` as a direct child (`.feature-grid`, `.detail-grid`, `.stack`), and consumers combine the card with other classes on the same element (`card stack`, `card form-panel`, `card legal-copy`), all of which an `<hp-card>` wrapper would break or need ARIA roles to imitate. The shared brief names `hp-card` as an example of an element selector for composites; the brief's first rule (one native element whose semantics and parent layout rules matter takes an attribute selector) fits the card exactly, so this CRD follows that rule.
- **D-2** *Are the card's parts inputs, child components or projected markup?* Projected markup with the design system's classes (`.card__title`, `.card__header`, `.card__footer`, `.card__link`, `.story-card__photo`, `.story-card__art`, `.hero-photo`, `.hero-art`, `.profile-head`, `.well`), styled by the card through selectors rooted at its host. The block flow spacing and the heading role must reach any projected child, which only host-rooted selectors can do; the e2e locators already use these classes; and part components would add eight selectors with no behaviour.
- **D-3** *Does the card header wrap?* Yes. Measured with a non-wrapping header at 320 px: the badge of "Request HP-1048" overflowed the content box (header 255 px wide in a 238 px box) and the badge of "Amara Nkiruka Adeyemi-Williams" crossed the card's border. With the badge wrapping its own label (badge CRD D-2) nothing overflows at 320 px, but the title is squeezed beside a narrow, tall badge, and at 360 px with text at 200 % the header still overflowed its card by 234 px. With `flex-wrap: wrap` the badge moves under the title and nothing overflows in any of these cases, which L2-042 requires.
- **D-4** *How much space surrounds a divider inside a card?* `--space-6` above and below, as the divider page states. Measured: a flow rule applied to every child overrode the divider's top margin to 16 px while the bottom stayed 24 px. The flow rule therefore skips `hr` and `.divider`.
- **D-5** *Does the product use interactive story cards on the gallery, matching braiders and help screens?* Not today: those screens keep the mocks' and the design-system anatomy's story card with one named action link ("Explore Knotless braids", "View Nia’s profile"), which keeps the e2e locators and the link text. The interactive variant is fully specified for any screen that wants the whole surface as a target; switching a screen is a page change, not a component change.
- **D-6** *Is a notification a card with its own primary button and a "Read" badge, as the first notification-center mocks drew it?* No. Notifications are an interactive list with an unread marker only on unread rows ([list.md](list.md) D-1), placed in a flush card; several primary buttons on one page compete, and a "Read" badge marks the norm instead of the exception.
- **D-7** *How are a braider card's link and photo named?* The link names what opens ("View Nia’s profile"), as the tables-and-lists pattern records, rather than the style cards' "Explore [name]" that the first matching-braiders mocks reused; the photo alt names the person ("Portrait of Nia Okafor"), not "Portrait of a braider". A screen-reader link list then tells the three braiders apart.
- **D-8** *Do section headings inside detail cards use the 36 px page h2?* No. Plain `h2`/`h3` inside a card use the h3 role and `.card__title` uses the h4 role, so a card heading never competes with the page title. The page keeps the semantic level.
- **D-9** *Must a `<section>` card be named?* Yes. An unnamed `<section>` is not a region landmark, and the design system and the mocks write every section card with `aria-labelledby` pointing at its heading. A development-mode console error catches an unnamed one, as the button does for an unnamed icon button.
- **D-10** *What shape do loading cards take?* The final shape: row cards on My appointments, story cards with a 3:2 skeleton media box in grids, the detail grid's main and aside cards on detail pages. The same three mixed cards in a feature grid on every page would contradict the tables-and-lists pattern ("skeletons in the collection's own shape") and shift the layout when content arrives.
- **D-11** *How is the one-link rule for interactive cards enforced?* A development-mode console error when an interactive card holds no `.card__link`, more than one, or any other link or button; the card still renders. A second control under the stretched link could not be clicked, so the rule protects the customer, and an error the e2e harness treats as a failure is the proportionate check.
- **D-12** *Can an `<li>` host a card?* No. The design system's collections are `<article>` cards in grids and row cards in a stack; homogeneous lists use the list component. Keeping four hosts keeps the semantics predictable.
- **D-13** *What happens when a photo URL fails to load?* The 3:2 box stays, showing the `alt` text, so nothing shifts. The page renders the art panel when the record has no photo; the card does not swap media on a load error, because it does not own the data.
- **D-14** *Does `selected` set any ARIA state?* No. The card cannot know whether the selection is a current page, a chosen option or a listbox choice, so the consumer states it in text or with `aria-current` on the card's link (or `aria-selected` on a `role="option"` host, which the selected style also matches). The design system requires the selection to be said in text or `aria-current`, never only by the accent edge.
- **D-15** *The edge mocks open with a neutral badge "Long names and missing photos". Is it product content?* No: it labels the mock's edge case, and the card's renderings show the long name without it. Its long uppercase label wraps inside the card by the badge's own wrapping rule (badge CRD D-2), not by a card behaviour.
- **D-16** *Who stops a long name from running past a card at 200 % text?* The card, for every heading in it. The avatar CRD (its D-9) leaves the profile head's text to the profile-head layout. Measured at 360 px with the browser's text size at 200 %: the profile head's "Adeyemi-Williams" ran 6 px past the card, and a header or row title with the same name overflowed even after the badge and button wrapped their labels, because a flex item will not shrink below its longest word and `overflow-wrap: break-word` does not change that. `overflow-wrap: anywhere` on card headings and `min-width: 0` on the profile head's and row's text blocks brought every case inside the card (with the badge CRD's D-2 and the button CRD's D-5 applied).

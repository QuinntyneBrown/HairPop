# Skeleton

| Field | Value |
|---|---|
| Selector | `span[hp-skeleton]`, `hp-skeleton-group` |
| Library path | `frontend/projects/components/src/lib/skeleton/` |
| Status | built |
| Traces to | L2-001, L2-035, L2-036, L2-041, L2-042, L2-043 |
| Design system | [`skeleton.html`](../../design-system/components/skeleton.html) |
| Source mocks | [`pages/style-gallery/loading`](../../mocks/pages/style-gallery/loading.html), [`pages/matching-braiders/loading`](../../mocks/pages/matching-braiders/loading.html), [`pages/help/loading`](../../mocks/pages/help/loading.html), [`pages/my-appointments/loading`](../../mocks/pages/my-appointments/loading.html), [`pages/notification-center/loading`](../../mocks/pages/notification-center/loading.html), [`pages/style-detail/loading`](../../mocks/pages/style-detail/loading.html), [`pages/braider-profile/loading`](../../mocks/pages/braider-profile/loading.html), [`pages/appointment-detail/loading`](../../mocks/pages/appointment-detail/loading.html), [`pages/booking-request/loading`](../../mocks/pages/booking-request/loading.html), [`pages/care-and-review/loading`](../../mocks/pages/care-and-review/loading.html), [`pages/account-settings/loading`](../../mocks/pages/account-settings/loading.html), [`pages/sign-in/loading`](../../mocks/pages/sign-in/loading.html), [`pages/terms/loading`](../../mocks/pages/terms/loading.html), [`pages/not-found/loading`](../../mocks/pages/not-found/loading.html) |
| Rendering | [`skeleton.html`](skeleton.html) |

## Purpose and scope

Skeletons hold the shape of content while it loads, so the page settles into place instead of jumping when the style cards, the braiders for knotless braids, Nia's profile or Maya's appointments arrive. A skeleton is the loaded layout drawn in neutral, softly shimmering blocks: the same grid, the same cards, the same 3:2 media. Screen-reader users hear one message that names what is loading ("Loading styles") instead of a pile of empty shapes. If the read is slow, the shapes stay and a line explains it; they never pretend the page is finished.

The component has two parts:

- `span[hp-skeleton]`, one block: a text line, a title bar, a circle, a rectangle or 3:2 media.
- `hp-skeleton-group`, one loading region's contents: its status message, its slow-read line, and either a ready-made placeholder pattern (story cards, appointment rows, list rows) or the page's own composition of blocks.

Use something else when:

- something already on screen refreshes in place ("Refreshing braiders near Toronto…"): keep the content and use the [spinner](spinner.md);
- the task can be measured (photos uploading): use the [progress bar](progress-bar.md);
- the load failed: replace the region with an error [empty state](empty-state.md); a part that failed gets a warning alert;
- a static response (404, 403, 500, offline) is shown: an [error page](error-page.md) renders at once and has no skeleton.

Out of scope:

- The loading region itself. It is the consumer's real content container (`.feature-grid`, `.stack`, `.detail-grid`, `.form-panel`), which carries its accessible name and `aria-busy="true"` while the group is rendered, and holds the loaded content afterwards.
- Starting, cancelling and retrying the read, and deciding that it failed. The group reports "Try again" through an output; the consumer restarts the read.
- Controls outside the region (search box, category chips, the filter button, the page header). They stay real and usable while the region loads.
- The announcement when content arrives ("12 braiders"): the page's results count or status region says it.
- The shells' own styles: the placeholder cards and list rows are the [Card](card.md) and [List](list.md) components (`div[hp-card]` with `layout="story"`, `layout="row"` or `flush`; `ul[hp-list]` with `li[hp-list-item]` rows), so their padding, border, radius and row rules are the loaded content's own.

## Usage

Every loading mock in `docs/mocks/` shows the same three generic cards in a `.feature-grid` with `aria-label="Loading content"`; the design system records that as drift and requires each screen's skeleton to mirror its loaded layout (D-1). The configuration each screen needs:

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/style-gallery/loading` | group, `pattern="story-card"`, `count` 3, inside `section.feature-grid` named "Styles"; the search box and chips above stay real | label "Loading styles" | loading, slow, loaded, failed (error empty state), empty (L2-001) | canvas, cards |
| `pages/matching-braiders/loading` | group, `pattern="story-card"`, `count` 3, in `.feature-grid` named "Braiders for knotless braids"; the search box and "Filters" stay real | label "Loading braiders for knotless braids" | loading, slow, loaded, failed, empty, no-results | canvas, cards |
| `pages/help/loading` | group, `pattern="story-card"`, `count` 3 (art panels share the 3:2 box) | label "Loading help topics" | loading, slow, loaded, failed, offline | canvas, cards |
| `pages/my-appointments/loading` | group, `pattern="appointment-row"`, `count` 3, in `section.stack` named "My appointments" | label "Loading your appointments" | loading, slow, loaded, failed, empty, no-results | canvas, row cards |
| `pages/notification-center/loading` | group, `pattern="list-row"`, `count` 4, the list the design system recommends for notifications (D-7) | label "Loading your updates" | loading, slow, loaded, failed, empty | canvas, flush card |
| `pages/style-detail/loading` | group without a pattern inside `.detail-grid`: main card with a `hero` block, a `title`, two `text` lines, a `.fact-grid` of three `rect` tiles and one `text` line; aside card with a `title`, two `text` lines and a `rect` button | label "Loading knotless braids" | loading, slow, loaded, partial (alert), failed, empty | canvas, cards |
| `pages/braider-profile/loading` | group without a pattern inside `.detail-grid`: a `.stack` of a profile card (`circle` at the profile-avatar size, `title`, `text` lines, a `.fact-grid` of two `rect` tiles, a `rect` button) and a reviews card (`title`, three `text` lines); aside card (`title`, three `text` lines) | label "Loading Nia’s profile" | loading, slow, loaded, partial, failed, empty | canvas, cards |
| `pages/appointment-detail/loading` | group without a pattern inside `.detail-grid`: card (`rect` badge, `title`, three `text` lines, a `.cluster` of two `rect` buttons); aside card (`title`, three `text` lines) | label "Loading your appointment" | loading, slow, loaded, partial, failed | canvas, cards |
| `pages/booking-request/loading`, `care-and-review/loading`, `account-settings/loading`, `sign-in/loading`, `sign-up/loading`, `forgot-password/loading`, `reset-password/loading`, `verify-email/loading` | group without a pattern inside `section.form-panel`: a `title`, then per field a `text` line at 30 % (the label) and a `rect` of `--control-height-md` at full width, then a `rect` button | labels "Loading your booking request", "Loading care and review", "Loading account settings", "Loading sign in", "Loading create account", "Loading forgot password", "Loading reset password", "Loading verify email" | loading, slow, loaded, failed | form panel card |
| `pages/terms/loading`, `pages/privacy/loading` | group without a pattern inside `section.legal-copy`: two groups of a `title` and four `text` lines | labels "Loading terms of use", "Loading privacy" | loading, slow, loaded, failed (L2-033) | card |
| Braider profile reviews card (design system *Overview*: a known layout) | not used: a region already on screen refreshing in place uses the spinner | — | — | — |
| `pages/not-found/loading`, `forbidden/loading`, `server-error/loading`, `offline/loading` | not used: error pages are static responses with no loading state (error-page D-4) | — | — | — |

Every row is buildable with the API below: three patterns rendered by the group, or the page's own composition of the five block shapes inside the group, with one status label and the slow-read line.

## Anatomy

1. **Block** — `span[hp-skeleton]`, host classes `.skeleton` plus one shape: `.skeleton--text`, `.skeleton--title`, `.skeleton--circle`, `.skeleton--rect` or `.skeleton--hero`; always `aria-hidden="true"`. Fill is the shimmer gradient of `--color-bg-subtle` and `--color-bg-subtle-hover`.
2. **Group** — `hp-skeleton-group`, `display: contents`, so its children are direct children of the consumer's grid, stack or card.
3. **Status message** — the group's first child, `<span class="visually-hidden" role="status">`, holding the `label` ("Loading styles"), or the slow message while the read is slow.
4. **Placeholder shells (patterns only)** — `div[hp-card]` hosts with `aria-hidden="true"`: a story card (`.card.story-card`), a row card (`.card.appointment-row`) or one flush card holding a `ul[hp-list]` (`.list`) of `li[hp-list-item]` (`.list__item`) rows, as the list CRD specifies for the notification centre's loading state. Each mirrors the loaded card's structure (below).
5. **Slow-read line (after 10 seconds)** — `<p class="span-full cluster text-sm text-muted">`: the slow message (hidden from assistive technology, which hears it through the status message) and a link-variant Button with the retry label.

Hosts: the block uses an attribute selector on a native `<span>` because the design system's sibling rule (`.skeleton--text:last-child` is 60 % wide) and its parent layouts (`.stack`, `.list__item`, `.fact-grid`) apply to it directly (D-2). The group is a composite and uses an element selector.

## API

### `span[hp-skeleton]` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `shape` | `'text' \| 'title' \| 'circle' \| 'rect' \| 'hero'` | `'text'` | no | Adds `.skeleton--{shape}`. |
| `width` | `string \| null` | `null` | no | Written to the host's `width` style. Text and title lines take a percentage of their container ("30%", "50%"); a rect takes the width of what it stands for ("8rem" for a button, "100%" for a field). Null keeps the shape's default. |
| `height` | `string \| null` | `null` | no | Written to the host's `height` style; rect only (`"var(--control-height-md)"` for a button or field, "1.5rem" for a badge). Ignored for the other shapes, whose height follows the type or the 3:2 ratio. |

### `hp-skeleton-group` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | The status message: "Loading" plus the content's name, sentence case ("Loading styles", "Loading Nia’s profile"). |
| `pattern` | `'story-card' \| 'appointment-row' \| 'list-row' \| null` | `null` | no | Renders that placeholder pattern `count` times. Null projects the default slot instead (the page's composition). |
| `count` | `number` | `3` | no | Placeholders a pattern renders. Story cards beyond the second are hidden below 1024 px, so the first viewport is filled with one row of cards at every width (D-5). Ignored without a pattern. |
| `slowMessage` | `string` | — | yes | Shown and announced after 10 seconds of loading: "Still loading. Check your connection." |
| `retryLabel` | `string` | — | yes | The slow-read line's button: "Try again". |
| `returnFocusTo` | `HTMLElement \| null` | `null` | no | The region's heading (rendered with `tabindex="-1"`). When the group is removed while focus is inside it (on its "Try again"), focus moves here instead of being lost (D-8). |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `retried` | `void` | Maya activates the slow-read line's "Try again". The group sets that button busy, puts the label back in the status message and restarts its 10-second timer; the consumer restarts the read. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | The page's composition of `span[hp-skeleton]` blocks inside its real layout classes and `div[hp-card]` shells, each shell `aria-hidden="true"` | Projected only when `pattern` is null; declared once. Contains no links, buttons or text. |

- Inputs are signal inputs. The component renders no copy of its own: `label`, `slowMessage` and `retryLabel` carry every string.

## Variants and sizes

| Block shape | Modifier | Size | Use for |
|---|---|---|---|
| Text | `.skeleton--text` | `0.875em` tall with `0.375em` above and below; full width, the last in its container 60 % | One line of body text |
| Title | `.skeleton--title` | `1.5em` tall, 40 % wide, `--space-2` below; inside patterns sized to the heading's line (D-4) | A heading |
| Circle | `.skeleton--circle` | `--control-height-md` (40 px) square, `--radius-full` | An avatar |
| Rect | `.skeleton--rect` | Set by `width` and `height`; `--radius-md` | A badge, button, field or fact tile |
| Hero | `.skeleton--hero` | Full width, `aspect-ratio: 3 / 2`, `--radius-md`, `--space-4` below (none inside a story card, D-4) | A style photo, braider portrait or art panel |

| Pattern | Shell | Inside | Mirrors |
|---|---|---|---|
| `story-card` | `.card.story-card` | hero; then a `.stack` of an eyebrow line (30 %), a title, a two-line summary and a link line (40 %) | The style gallery, matching braiders and help topic cards |
| `appointment-row` | `.card.appointment-row` | a body (badge rect 7rem × 1.5rem, title, meta line) and a button rect (8rem × `--control-height-md`) | The My appointments row cards |
| `list-row` | one `.card.card--flush` holding `.list` | per row: circle, then a `.list__body` of a 50 % line and a full line | Notification and other two-line list rows |

Blocks have no sizes of their own: each takes the size of the content it stands for (em-based text, 3:2 media, control heights).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Loading | group rendered | Blocks shimmer once per `--duration-loop-shimmer` (1.4 s), `--ease-standard` | Region `aria-busy="true"` (consumer); one status message names it; blocks hidden |
| Reduced motion | `(prefers-reduced-motion: reduce)` | The sweep pauses through `--motion-loop-state`; blocks stay as still shapes | — |
| Slow | 10 seconds after the group rendered or after the last retry | Blocks keep shimmering; the slow-read line appears under them | Status message changes to the slow message and is announced once |
| Retrying | "Try again" activated | The line's button is busy; blocks unchanged | `retried` emitted; status message back to the label; focus stays on the button |
| Loaded | consumer replaces the group with content | Content in one update; no block remains | Region drops `aria-busy`; status message gone with the group |
| Failed | consumer replaces the group with an error empty state | No block remains or keeps shimmering | Error empty state announces itself |
| Empty or no results | consumer replaces the group with an empty state | No placeholder card remains | — |
| Forced colours | `(forced-colors: active)` | Each block shows a `CanvasText` hairline outline (D-9) | — |

Skeletons are not interactive: no hover, focus, active or disabled state. The only control is the slow-read line's button, whose states are Button's.

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: blocks -->
<span class="skeleton skeleton--text" aria-hidden="true" style="width: 30%"></span>
<span class="skeleton skeleton--title" aria-hidden="true"></span>
<span class="skeleton skeleton--circle" aria-hidden="true"></span>
<span class="skeleton skeleton--rect" aria-hidden="true" style="width: 8rem; height: var(--control-height-md)"></span>
<span class="skeleton skeleton--hero" aria-hidden="true"></span>
```

```html
<!-- rendered: style gallery loading (the region is the page's) -->
<section class="feature-grid" aria-label="Styles" aria-busy="true">
  <hp-skeleton-group>
    <span class="visually-hidden" role="status">Loading styles</span>
    <div class="card story-card" aria-hidden="true">
      <span class="skeleton skeleton--hero"></span>
      <div class="stack">
        <span class="skeleton skeleton--text" style="width: 30%"></span>
        <span class="skeleton skeleton--title"></span>
        <div><span class="skeleton skeleton--text"></span><span class="skeleton skeleton--text"></span></div>
        <span class="skeleton skeleton--text" style="width: 40%"></span>
      </div>
    </div>
    <!-- two more story-card placeholders; the third is hidden below 1024 px -->
  </hp-skeleton-group>
</section>
```

```html
<!-- rendered: my appointments loading -->
<section class="stack" aria-label="My appointments" aria-busy="true">
  <hp-skeleton-group>
    <span class="visually-hidden" role="status">Loading your appointments</span>
    <div class="card appointment-row" aria-hidden="true">
      <div>
        <span class="skeleton skeleton--rect" style="width: 7rem; height: 1.5rem"></span>
        <span class="skeleton skeleton--title"></span>
        <span class="skeleton skeleton--text"></span>
      </div>
      <span class="skeleton skeleton--rect" style="width: 8rem; height: var(--control-height-md)"></span>
    </div>
    <!-- two more rows -->
  </hp-skeleton-group>
</section>
```

```html
<!-- rendered: notification centre loading -->
<section aria-label="Updates" aria-busy="true">
  <hp-skeleton-group>
    <span class="visually-hidden" role="status">Loading your updates</span>
    <div class="card card--flush" aria-hidden="true">
      <ul class="list">
        <li class="list__item"><span class="skeleton skeleton--circle"></span><div class="list__body"><span class="skeleton skeleton--text" style="width: 50%"></span><span class="skeleton skeleton--text"></span></div></li>
        <!-- three more rows -->
      </ul>
    </div>
  </hp-skeleton-group>
</section>
```

```html
<!-- rendered: slow read, after 10 seconds (appended as the group's last child) -->
<span class="visually-hidden" role="status">Still loading. Check your connection.</span>
…
<p class="span-full cluster text-sm text-muted">
  <span aria-hidden="true">Still loading. Check your connection.</span>
  <button class="btn btn--link btn--sm" type="button">Try again</button>
</p>
```

Inside the blocks of a pattern, only `.skeleton*` spans and layout wrappers appear: no text, links or buttons.

Consumer templates:

```html
<!-- consumer: style gallery -->
<section class="feature-grid" aria-label="Styles" [attr.aria-busy]="loading() || null">
  @if (loading()) {
    <hp-skeleton-group pattern="story-card" label="Loading styles"
      slowMessage="Still loading. Check your connection." retryLabel="Try again"
      [returnFocusTo]="pageTitle" (retried)="reload()" />
  } @else {
    @for (style of styles(); track style.slug) { <article hp-card layout="story">…</article> }
  }
</section>

<!-- consumer: style detail, the page's own composition -->
<div class="detail-grid" aria-label="Knotless braids" [attr.aria-busy]="loading() || null">
  @if (loading()) {
    <hp-skeleton-group label="Loading knotless braids"
      slowMessage="Still loading. Check your connection." retryLabel="Try again" (retried)="reload()">
      <div hp-card aria-hidden="true">
        <span hp-skeleton shape="hero"></span>
        <span hp-skeleton shape="title"></span>
        <span hp-skeleton></span><span hp-skeleton></span>
        <div class="fact-grid">
          <span hp-skeleton shape="rect" height="4.375rem"></span>
          <span hp-skeleton shape="rect" height="4.375rem"></span>
          <span hp-skeleton shape="rect" height="4.375rem"></span>
        </div>
        <span hp-skeleton></span>
      </div>
      <div hp-card aria-hidden="true">
        <span hp-skeleton shape="title"></span>
        <span hp-skeleton></span><span hp-skeleton></span>
        <span hp-skeleton shape="rect" width="100%" height="var(--control-height-md)"></span>
      </div>
    </hp-skeleton-group>
  } @else { … }
</div>
```

Free to change: wrapper `div`s inside a pattern may change as long as the measured heights in AC-3, AC-5 and AC-6 hold.

## Design

- Block: `display: block`, `min-height: 1em`, `--radius-sm` (text, title), `--radius-md` (rect, hero), `--radius-full` (circle). Text `0.875em` tall with `0.375em` block margins; title `1.5em` tall, 40 % wide, `--space-2` below; circle width `--control-height-md`, ratio 1; hero ratio 3:2 with `--space-4` below.
- Shimmer: a 90° linear gradient `--color-bg-subtle` 25 %, `--color-bg-subtle-hover` 37 %, `--color-bg-subtle` 63 %, `background-size: 400% 100%`, animated by `shimmer` over `--duration-loop-shimmer` with `--ease-standard`, infinite, `animation-play-state: var(--motion-loop-state)`.
- Story-card pattern (D-4): the hero has no bottom margin (the card's `--space-4` gap spaces it); the title bar is one heading line tall (`calc(var(--line-height-snug) * 1em)`) with no margin. Measured within 1 px of a loaded story card whose summary runs to two lines at 320, 360, 768 and 1280 px.
- Appointment-row pattern (D-4): the body grows from a 21rem basis (`flex: 1 1 21rem`), so the button rect drops below at the same widths as the loaded row's action; the title bar is one `--font-size-xl` heading line tall with no margin.
- Slow-read line: `.span-full` (full grid row), `.cluster` (wraps, `--space-3` gap), `--text-body-sm`, `--color-fg-muted`.
- Elevation and layer: none of its own; the shells are cards.

Component tokens: none. The shimmer reads semantic tokens directly; a surface re-skins it by overriding the gradient, as the design system's *Theming* example does for an accent art panel.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Block base | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Shimmer highlight | `--color-bg-subtle-hover` | `--palette-gray-200` | `--palette-gray-700` |
| Card shell | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Slow-read text | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |

Contrast: blocks are decorative placeholders and exempt from WCAG 1.4.11; the status message is announced, not seen. The text that appears around and after them meets these pairs:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Slow-read line on the page |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Muted text that replaces a line; slow-read line in a card |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Body text that replaces a title |
| `--color-fg-link` | `--color-bg-canvas` | 4.5:1 | "Try again" (link-variant button) on the page |

Forced colours: see D-9.

## Responsive behaviour

- Skeletons live inside the real layout classes, so they reflow exactly like the content: `.feature-grid` is one column below 768 px, two from 768 px and three from 1024 px; `.detail-grid` is one column below 768 px.
- The story-card pattern shows two placeholders below 1024 px and `count` (three) from 1024 px, one row's worth on tablets and desktops and the first viewport on phones (D-5).
- Media blocks keep the 3:2 ratio at every width, so the loaded photo or art panel lands in exactly the same box.
- The appointment-row placeholder wraps its button below the body under about 560 px, as the loaded row does; where the loaded row's own title or date wraps onto a second line (below about 440 px for "Nia Okafor · knotless braids") the loaded row is taller than its placeholder by those lines (D-6).
- The slow-read line wraps; the button drops under the message on narrow screens.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available. Blocks are not targets; the slow-read button is a small button (32 px, above the 24 px minimum).

## Accessibility

### Role and pattern

Every block and every placeholder shell is `aria-hidden="true"`: they have nothing to announce. The consumer's region sets `aria-busy="true"` and keeps its accessible name ("Styles"); the group's one `role="status"` message names what is loading. See [WAI-ARIA aria-busy](https://www.w3.org/TR/wai-aria-1.2/#aria-busy).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skips the placeholders: they contain no links or buttons. Real controls outside the region (search, chips, Filters) stay reachable. After 10 seconds, reaches the slow-read "Try again". |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | On "Try again": emits `retried`. |

### Focus

Focus is never moved when the group renders or when content arrives. If focus is on the slow-read "Try again" when the group is removed (content or an error state arrived), focus moves to `returnFocusTo`, the region's heading, so it is not lost to the page body.

### Labelling

One status message per loading region, never one per block or card. It names the content: "Loading styles", "Loading Nia’s profile", "Loading your appointments".

### Announcements

The status message is polite. The label is present from the first render, so a screen-reader user who reaches the region hears what is loading; the slow message replaces it in the existing region after 10 seconds, so that change is announced once. The slow-read line's visible copy is `aria-hidden` so it is not read twice.

### Motion

The shimmer loops on `--duration-loop-shimmer` and pauses under `prefers-reduced-motion: reduce` through `--motion-loop-state`; the blocks stay still. It is low contrast and slow, far below flash thresholds.

## Content and internationalisation

- The status message is "Loading" plus the content's name, sentence case: "Loading styles", "Loading braiders for knotless braids", "Loading Nia’s profile", "Loading your appointments".
- No visible "Loading…" over skeletons; the shapes say it.
- After about ten seconds: "Still loading. Check your connection." with "Try again".
- Translatable inputs: `label`, `slowMessage`, `retryLabel`. Data values inside a label: the braider's first name ("Nia’s"), the style ("knotless braids"). The product is English-only today; a longer slow message wraps.

## Performance

- Change detection: `OnPush`, signal inputs; the slow state is one signal set by one timer; the pattern loop is a `@for` over a `computed` index array.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Skeleton.ts` renders the style gallery's loading region, `<section class="feature-grid" aria-label="Styles" aria-busy="true"><hp-skeleton-group pattern="story-card" label="Loading styles" …/></section>`, three story-card placeholders; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: the scenario above is the repeated composition; no other.
- Regression rule: a change to its template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: the hero is 3:2 like the photo; the story-card and appointment-row patterns are measured against their loaded cards (AC-2, AC-3, AC-5); the group renders on the server, so the first paint already holds the layout.
- Weight: `@angular/core`, the Card and List components (shells) and Button (slow-read line). No CDK.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given the style gallery is loading, when its region renders, then `section.feature-grid` named "Styles" has `aria-busy="true"` and holds one `span.visually-hidden[role="status"]` reading "Loading styles" followed by story-card placeholders whose shells are `.card.story-card` with `aria-hidden="true"`, each containing a `.skeleton--hero` and a `.stack` of an eyebrow line, a title bar, two summary lines and a link line. (L2-035)
- **AC-2** Given the gallery's story-card placeholders at 360, 768 and 1280 px, when the "Knotless braids" card loads into the same grid cell, then the photo occupies exactly the hero block's box (for example 196 px tall at 768 px), a 3:2 box. (L2-035)
- **AC-3** Given a story-card placeholder and the loaded "Knotless braids" card whose summary runs to two lines, when both are measured at 320, 360, 768 and 1280 px, then their heights differ by no more than 2 px. (L2-035)
- **AC-4** Given the gallery loading with `count` 3, when it renders at 360, 768 and 1280 px, then two, two and three placeholders are visible in one, two and three columns. (L2-042)
- **AC-5** Given My appointments loading with `pattern="appointment-row"`, when it renders, then the status message reads "Loading your appointments", three `.card.appointment-row` placeholders each hold a badge rect, a title bar, a meta line and a button rect, and at every width from 440 px each is within 2 px of the loaded "Awaiting reply" row for HP-1048, with the button rect dropping below the body at the same width as the loaded "View request" action. (L2-035)
- **AC-6** Given the notification centre loading with `pattern="list-row"` and `count` 4, when it renders, then one flush card holds a `.list` of four `.list__item` rows, each a 40 px circle and a `.list__body` of two lines, and each row is within 1 px of the height of the loaded row "Nia received your request". (L2-035)
- **AC-7** Given `<span hp-skeleton>`, `shape="title"`, `shape="circle"`, `shape="rect" width="8rem" height="var(--control-height-md)"` and `shape="hero"`, when they render, then each host carries `.skeleton` and its shape modifier with `aria-hidden="true"`, the rect measures 128 × 40 px, the circle 40 × 40 px, and a text line that is its container's last child is 60 % wide. (L2-035)

### States

- **AC-8** Given the style gallery read has been pending for 10 seconds, when the timer passes, then the placeholders remain and keep shimmering, the region keeps `aria-busy="true"`, the line "Still loading. Check your connection." appears under them with a "Try again" link-variant button, and no empty, no-results or error state is shown. (L2-043)
- **AC-9** Given the slow-read line is shown, when Maya activates "Try again", then `retried` is emitted once, the button shows its busy state and keeps focus, the status message returns to "Loading styles", and the 10-second timer restarts. (L2-043)
- **AC-10** Given the gallery read succeeds, when the styles arrive, then the placeholders are replaced in one update, the region no longer has `aria-busy`, and no `.skeleton` remains in it. (L2-035)
- **AC-11** Given the gallery read fails, when the error arrives, then the error empty state replaces the whole region and no `.skeleton` remains or keeps shimmering. (L2-036)
- **AC-12** Given the gallery read succeeds with no published styles, when it finishes, then no placeholder card remains and only the gallery's empty state is shown, so no shape can be mistaken for a sample style. (L2-001)

### Keyboard and focus

- **AC-13** Given the style gallery loading, when Maya presses Tab from the search box, then focus moves through the category chips and never lands inside the placeholders; before 10 seconds the region contains no focusable element. (L2-041)
- **AC-14** Given focus is on the slow-read "Try again" with `returnFocusTo` set to the page heading "Find a style that feels like you", when the styles arrive and the group is removed, then focus moves to that heading. (L2-041)

### Screen readers

- **AC-15** Given a screen reader reads the loading gallery region, when it reaches the region, then it hears "Loading styles" once and none of the placeholder shapes. (L2-035)
- **AC-16** Given the gallery read passes 10 seconds, when the slow state begins, then the status message changes to "Still loading. Check your connection." and is announced once, politely, and the visible copy of the line is not read a second time. (L2-041)

### Theming

- **AC-17** Given the gallery loading, when the theme switches from light to dark, then the blocks change from grey 100 with a grey 200 highlight to grey 800 with a grey 700 highlight on the grey 900 card, without a reload. (L2-042)
- **AC-18** Given Windows forced colours, when the gallery placeholders render, then every block shows a `CanvasText` hairline outline, so the loading layout stays visible. (L2-041)

### Responsive

- **AC-19** Given a 320 px viewport with text enlarged to 200 %, when the gallery has been loading for 10 seconds, then the placeholders and the wrapped slow-read line fit the viewport, the "Try again" button is fully visible, and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-20** Given `prefers-reduced-motion: reduce`, when the gallery placeholders render, then the shimmer is paused and the blocks are still. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/skeleton/`; files `skeleton.ts` (standalone component `Skeleton`, `selector: 'span[hp-skeleton]'`, `template: ''`) and `skeleton-group.ts` (standalone component `SkeletonGroup`, `selector: 'hp-skeleton-group'`). Both `OnPush`; export both from `public-api.ts`.
- `Skeleton` host bindings: `class.skeleton` always; `class.skeleton--{shape}`; `attr.aria-hidden="true"`; `style.width` from `width`; `style.height` from `height` when `shape` is rect. Styles port `.skeleton*` and `@keyframes shimmer` from `docs/design-system/assets/components.css` as `:host` rules, plus the forced-colours outline (D-9).
- `SkeletonGroup`: `:host { display: contents; }`. Template: the status span; then `@switch (pattern())` rendering the three patterns with `@for` over `computed(() => Array.from({ length: count() }))`, or `<ng-content />` when null; then the slow-read line `@if (slow())`. Pattern-scoped rules (D-4, D-5): `.story-card > .skeleton--hero { margin-bottom: 0 }`, `.story-card .skeleton--title { height: calc(var(--line-height-snug) * 1em); margin: 0; }`, `.appointment-row > div { flex: 1 1 21rem; }`, `.appointment-row .skeleton--title { font-size: var(--font-size-xl); height: calc(var(--line-height-snug) * 1em); margin: 0; }`, and, mobile-first, `.story-card:nth-of-type(n+3) { display: none; }` with `@media (min-width: 64rem) { .story-card:nth-of-type(n+3) { display: flex; } }`.
- Shells compose the Card component (`<div hp-card layout="story">`, `<div hp-card layout="row">`, `<div hp-card flush>`, card CRD) and, for the list-row pattern, the List component (`<ul hp-list>` with `<li hp-list-item>` rows, list CRD); the slow-read line composes Button (`button[hp-button] variant="link" size="sm" [busy]="retrying()"`).
- Slow timer: started in `afterNextRender` (browser only), 10 000 ms, restarted on `retried`; cleared on destroy. `retrying` resets when the timer fires again.
- Focus return: on destroy, if `document.activeElement` is inside the slow-read line and `returnFocusTo` is set, call `returnFocusTo.focus()`.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Skeleton.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Every loading mock shows the same three generic cards with `aria-label="Loading content"`. Which wins?* The design system: each screen's skeleton mirrors its loaded layout, the region is `aria-busy` with one named status message, and every block is `aria-hidden`. The skeleton page and the feedback-and-loading pattern both record the mocks' version as drift fixed during extraction.
- **D-2** *Attribute or element selector for the block?* An attribute selector on a native `<span>`, so the host carries `.skeleton` and its shape: `.skeleton--text:last-child`, `.stack`, `.list__item` and `.fact-grid` rules then apply to it directly, as in the design system's markup. The group is a composite with an element selector.
- **D-3** *Why a group component rather than blocks alone?* The status message, the slow-read line, the timer and three repeated patterns would otherwise be rewritten on 18 pages. The group renders them with `display: contents`, so the consumer's real container stays the grid or stack and the placeholders are its direct children.
- **D-4** *The design system's composed story card (title bar 1.5em plus margin, hero with a bottom margin inside a gapped card) measured 56 px shorter than the loaded card, and its appointment row 4 px shorter. Is that acceptable?* No: the design system requires that the page settles into place without jumping. Inside the story-card pattern the hero drops its bottom margin and the title bar is one heading line with no margin; the summary is two lines and a link line is added. Measured in Chromium against the loaded "Knotless braids" card: 399.5 vs 400.4 px at 320, 426.1 vs 427.1 at 360, 436.8 vs 437.8 at 768 and 463.5 vs 464.4 at 1280. Inside the appointment-row pattern the title bar is one `--font-size-xl` heading line and the body grows from 21rem: 130.6 vs 132 px from 560 px up and 182.6 vs 184 px from 440 to 557 px; the placeholder and the loaded row wrap within 2 px of the same viewport width (558 and 560 px). The 21rem basis is the width of the loaded HP-1048 row's text; with a 20rem basis the placeholder stayed on one line from 545 to 557 px while the loaded row had already wrapped. The primitives keep the design system's sizes everywhere else.
- **D-5** *How many story-card placeholders?* The design system says to fill the first viewport, one or two on phones and three on desktop. The pattern renders `count` (three) and hides those after the second below 1024 px: one card row on tablets, two cards on phones, one row of three on desktops.
- **D-6** *A loaded appointment row whose title or date wraps on a phone is taller than its placeholder. Does the placeholder predict that?* No. Wrapping depends on the braider's name and the date, which are unknown while loading; reserving two title lines would make every one-line row shift instead. The shift is limited to the rows below and to one line per wrapped field.
- **D-7** *The notification-centre mock renders notifications as cards with a primary button each. Which skeleton?* The list-row pattern: the design system's list page records the cards as drift and its skeleton page composes the notification skeleton as list rows, and the [list CRD](list.md) (D-1, D-9) renders the notification centre as a list in a flush card with skeleton rows in its loading state.
- **D-8** *Where does focus go when the slow-read "Try again" disappears with the group?* To `returnFocusTo`, the region's heading, matching the design system's rule that focus inside a reloading region returns to its heading. Without it focus would fall to the page body.
- **D-9** *Forced colours remove backgrounds, so blocks vanish. Is that acceptable?* No: sighted forced-colours users would see an empty region. Each block gets a `CanvasText` hairline outline under `(forced-colors: active)`; `components.css` gains the rule in the slice that builds the component.
- **D-10** *Should skeletons wait 300 ms before showing, like the spinner?* No. A skeleton reserves the loaded layout and is the server-rendered first paint; hiding it for 300 ms would show a blank region that then fills, the flash the delay is meant to avoid.
- **D-11** *What does "slow" mean, and does the skeleton ever give up?* Ten seconds, from the design system's *Content* rule. The skeleton never gives up on its own: L2-043 requires the loading state to remain while a read is slow, so only the consumer replaces it with content or an error.
- **D-12** *Status message: `aria-label` on the region (feedback-and-loading pattern) or a `role="status"` message (skeleton page)?* Both, with different jobs: the region keeps its own name ("Styles"), which identifies it before and after loading, and the status message says it is loading. The skeleton page's markup is the component's contract; the pattern page's `aria-label="Loading styles"` would rename the region and is not used.

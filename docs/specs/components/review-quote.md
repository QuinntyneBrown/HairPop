# Review quote

| Field | Value |
|---|---|
| Selector | `figure[hp-review-quote]` |
| Library path | `frontend/projects/components/src/lib/review-quote/` |
| Status | planned |
| Traces to | L2-007, L2-009, L2-039, L2-041, L2-042 |
| Design system | [`review-quote.html`](../../design-system/components/review-quote.html) |
| Source mocks | [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html), [`dialogs/report-review/default`](../../mocks/dialogs/report-review/default.html) |
| Rendering | [`review-quote.html`](review-quote.html) |

## Purpose and scope

A review quote presents one published review: its score and date, the customer's words, the author and service, and, on the profile, an action to report it (L2-007, L2-009). Inside the Report a review dialog it renders without the action so the customer sees what they are reporting.

Out of scope:

- The reviews list, its loading, partial and empty states: the profile page owns them with [alert](alert.md) and [empty state](empty-state.md).
- Opening the report dialog and sign-in redirection: the page handles the `reportRequested` output.

## Usage

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/braider-profile/default` | `reportable` | Maya Chen, 5, 3 Oct 2026, "The parts were so neat…"; Kemi Adebayo, 5, 26 Sep 2026 | default, action hover and focus | surface (card) |
| `dialogs/report-review/*` | not reportable | Kemi Adebayo's review | default | dialog |
| `pages/braider-profile/edge` | `reportable` | long review text with an unbroken URL | default, long text | surface |

## Anatomy

1. **Header** — `.review__header`: a score-only [rating summary](rating-summary.md) and `time.review__date`.
2. **Quote** — `blockquote.review__quote > p`: the review text, rendered as text.
3. **Author** — `figcaption.review__author`: "{author} · {service}".
4. **Actions** — `.review__actions`: a `button[hp-button]` with `variant="link"` and `size="sm"`, "Report review" plus visually hidden " by {author}".

Host: the native `<figure>` with class `review`.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `rating` | `number` | — | yes | 1–5, passed to the rating summary as score only. |
| `date` | `string` | — | yes | ISO date `YYYY-MM-DD`; set as `datetime` and shown as "3 Oct 2026". |
| `text` | `string` | — | yes | Review text; interpolated as text, never as HTML. |
| `author` | `string` | — | yes | Published reviewer name. |
| `service` | `string` | — | yes | Booked service name. |
| `reportable` | `boolean` | `false` | no | Renders the report action. |
| `reportLabel` | `string` | `'Report review'` | no | Visible action label; " by {author}" is appended visually hidden. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `reportRequested` | `void` | The report action is activated. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | All content comes from inputs. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Reportable | — (`reportable`) | Reviews on a profile. |
| Plain | — | The reviewed item inside the report dialog. |

One size; it fills its container.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | Score, date, quote, author | figure with quote and caption |
| Action hover | `:hover` on the action | Link button hover | — |
| Action focus | `:focus-visible` | Shared focus ring | "Report review by Maya Chen, button" |
| Long text | Unbroken text | Wraps anywhere | — |

## Markup

```html
<!-- rendered: reportable -->
<figure class="review">
  <div class="review__header"><span class="rating">…Rated 5 out of 5…</span><time class="review__date" datetime="2026-10-03">3 Oct 2026</time></div>
  <blockquote class="review__quote"><p>The parts were so neat and Nia checked that nothing felt too tight.</p></blockquote>
  <figcaption class="review__author">Maya Chen · Medium knotless braids</figcaption>
  <div class="review__actions"><button class="btn btn--link btn--sm" type="button">Report review<span class="visually-hidden"> by Maya Chen</span></button></div>
</figure>
```

```html
<!-- consumer -->
<figure hp-review-quote [rating]="r.rating" [date]="r.date" [text]="r.text" [author]="r.author"
  [service]="r.service" reportable (reportRequested)="report(r)"></figure>
```

## Design

- Vertical gap `--space-2`; block padding `--space-4`; a hairline `--color-border-default` divider below each review except the last of its type.
- Quote `--text-body`, author `--text-body-sm`, date `--text-caption`.

Component tokens: none; the component reads semantic tokens directly.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Quote | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Author | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Date | `--color-fg-subtle` | `--palette-gray-500` | `--palette-gray-400` |
| Divider | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Quote |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Author |
| `--color-fg-subtle` | `--color-bg-surface` | 4.5:1 | Date |

## Responsive behaviour

- Below about 16 rem the date wraps under the score.
- Quotes use `overflow-wrap: anywhere`. At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; the report action keeps a 44 × 44 CSS px target.

## Accessibility

### Role and pattern

`<figure>` with `<blockquote>` and `<figcaption>`; the report action is a native `<button>`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Moves to the report action when present. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Emits `reportRequested`. |

### Focus

The shared focus ring on the action. The consumer returns focus to the action when the dialog closes (the dialog service does this by default).

### Labelling

The action's accessible name is "Report review by {author}".

### Announcements

None.

### Motion

None.

## Content and internationalisation

- Dates as "3 Oct 2026" (`en-GB` day-month-year order, UTC so the date never shifts).
- Translatable inputs: `reportLabel`. Data values: `text`, `author`, `service`, `date`, `rating`.

## Performance

- Change detection: `OnPush`, signal inputs.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/ReviewQuote.ts` renders Maya Chen's review of Nia, reportable; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: `BraiderReviews` (summary plus two reviews).
- Layout stability: text only.

## Acceptance criteria

### Rendering

- **AC-1** Given Maya Chen's published review of 5 on 3 Oct 2026, when it renders on Nia's profile, then it shows the score "5", "3 Oct 2026", the quoted text and "Maya Chen · Medium knotless braids". (L2-007)
- **AC-2** Given the review is shown in the report dialog, when it renders without `reportable`, then no report action appears. (L2-009)
- **AC-3** Given review text containing `<script>alert(1)</script>`, when it renders, then the characters appear as text and no script runs. (L2-039)

### States

- **AC-4** Given a reportable review, when the customer activates "Report review", then `reportRequested` is emitted once. (L2-009)

### Keyboard and focus

- **AC-5** Given two reportable reviews, when the customer tabs through them, then focus reaches each report action in order with a visible focus ring. (L2-041)

### Screen readers

- **AC-6** Given Maya Chen's review, when a screen reader reaches its action, then it announces "Report review by Maya Chen, button". (L2-041)
- **AC-7** Given a review, when a screen reader reads its score, then it announces "Rated 5 out of 5". (L2-041)

### Theming

- **AC-8** Given the dark theme, when a review renders, then quote, author and date meet 4.5:1 against the card surface. (L2-042)

### Responsive

- **AC-9** Given a 320 px viewport and a review containing a 60-character URL, when it renders, then the text wraps and the page does not scroll horizontally. (L2-042)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Planned: folder `src/lib/review-quote/` with `review-quote.ts` and `index.ts`. Composes `RatingSummary` and `Button`.

## Decisions

- **D-1** *Button or link for Report?* A button: it opens a dialog and has no destination. The mocks' link pointed at a mock file only.
- **D-2** *Who decides about sign-in?* The page. L2-009 AC4 redirects visitors; the component only emits.
- **D-3** *Date formatting?* In the component, `en-GB` short month, UTC, so "3 Oct 2026" matches the design system everywhere.

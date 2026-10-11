# Rating summary

| Field | Value |
|---|---|
| Selector | `span[hp-rating-summary]` |
| Library path | `frontend/projects/components/src/lib/rating-summary/` |
| Status | planned |
| Traces to | L2-004, L2-008, L2-041, L2-042 |
| Design system | [`rating-summary.html`](../../design-system/components/rating-summary.html) |
| Source mocks | [`pages/matching-braiders/default`](../../mocks/pages/matching-braiders/default.html), [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html), [`pages/braider-profile/empty`](../../mocks/pages/braider-profile/empty.html), [`dialogs/report-review/default`](../../mocks/dialogs/report-review/default.html) |
| Rendering | [`rating-summary.html`](rating-summary.html) |

## Purpose and scope

The rating summary shows a braider's score from published reviews with the number of reviews behind it, or the honest unrated state when there are none (L2-008). It also renders the score of one review inside the [review quote](review-quote.md). It is read-only; collecting a rating uses the [radio group](radio-group.md) with `orientation="horizontal"`.

Out of scope:

- Computing the score. The API supplies the average and count of published reviews only; the component never derives a score.
- Star-per-point displays (five stars). The design system uses one star with the number.

## Usage

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/matching-braiders/default` | `value` 4.9, `count` 86 | "4.9 · 86 reviews" | rated, unrated (Jules) | surface (story card) |
| `pages/braider-profile/default` | `value` 4.9, `count` 86 | profile head and reviews section | rated | surface |
| `pages/braider-profile/empty` | `value` null | "Not yet rated" | unrated | surface |
| `pages/braider-profile/edge`, `pages/matching-braiders/edge` | `value` 4.7, `count` 1284 | "4.7 · 1,284 reviews" | rated, long count | surface |
| `review-quote` (profile, report dialog) | `value` 5, `count` null | "5" | score only | surface, dialog |

## Anatomy

1. **Visual group** — `span.rating__visual[aria-hidden="true"]`: the star, the value and the count, hidden from assistive technology.
2. **Star** — `svg[hp-icon].rating__star`, name `star`, size `sm`, filled.
3. **Value** — `span.rating__value`: the score.
4. **Count** — `span.rating__count`: "· 86 reviews"; absent in score-only use.
5. **Spoken text** — `span.visually-hidden`: one sentence read instead of the visual group.

Host: the native `<span>` with class `rating`; `rating--unrated` when unrated, in which case the host contains only the unrated text.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `value` | `number \| null` | — | yes | Average of published reviews, 1–5. `null` means unrated. Values outside 1–5 log a dev-mode error and render unrated. |
| `count` | `number \| null` | `null` | no | Number of published reviews. `null` renders score only (one review). `0` renders unrated whatever `value` is. |
| `unratedText` | `string` | `'Not yet rated'` | no | Visible and spoken unrated copy. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None — the component is static and has no interaction. | | |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | All content comes from inputs. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Summary | — (`count` set) | A braider's score with its review count. |
| Score only | — (`count` null) | The score of one review. |
| Unrated | `.rating--unrated` | No published reviews. |

One size: body-small text, 16 px star (`size="sm"`).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Rated | `value` 1–5 and `count` null or ≥ 1 | Star, value, count | "Rated 4.9 out of 5 from 86 reviews" |
| Score only | `count` null | Star and value | "Rated 5 out of 5" |
| Unrated | `value` null or `count` 0 | Italic muted text | "Not yet rated" |

The component is never focusable and has no pointer states.

## Markup

```html
<!-- rendered: summary -->
<span class="rating"><span aria-hidden="true" class="rating__visual"><svg class="icon icon--sm icon--fill rating__star" viewBox="0 0 24 24" aria-hidden="true">…</svg><span class="rating__value">4.9</span> <span class="rating__count">· 86 reviews</span></span><span class="visually-hidden">Rated 4.9 out of 5 from 86 reviews</span></span>

<!-- rendered: score only -->
<span class="rating"><span aria-hidden="true" class="rating__visual"><svg …></svg><span class="rating__value">5</span></span><span class="visually-hidden">Rated 5 out of 5</span></span>

<!-- rendered: unrated -->
<span class="rating rating--unrated">Not yet rated</span>
```

```html
<!-- consumer -->
<span hp-rating-summary [value]="braider.rating" [count]="braider.reviewCount"></span>
<span hp-rating-summary [value]="review.rating"></span>
```

## Design

- Gap between parts `--space-1`; text `--text-body-sm`, value `--text-label` with tabular figures.
- The host is `inline-flex` and wraps between value and count only when its container is narrower than the content.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--rating-star` | `--color-warning-icon` | forced colours (`CanvasText`) |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Star | `--rating-star` → `--color-warning-icon` | `--palette-amber-500` | `--palette-amber-300` |
| Value | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Count, unrated text | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Value |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Count, unrated |

The star is decorative and needs no non-text contrast minimum.

## Responsive behaviour

- No breakpoint changes. The count uses thousands separators ("1,284 reviews").
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available. It is not a target.

## Accessibility

### Role and pattern

Plain text; no role. The visual group is `aria-hidden` and one visually hidden sentence is read instead.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skips the component; it is not focusable. |

### Focus

None.

### Labelling

The hidden sentence: "Rated {value} out of 5 from {count} review(s)", or "Rated {value} out of 5" in score-only use. Unrated renders its text once, visible and spoken.

### Announcements

None; the summary is static content.

### Motion

None.

## Content and internationalisation

- Summary values show one decimal ("4.9", "5.0"); score-only values show whole numbers ("5").
- "1 review", "86 reviews"; never "ratings". Counts use `en-CA` grouping.
- Translatable inputs: `unratedText`. Data values: `value`, `count`.

## Performance

- Change detection: `OnPush`, signal inputs, formatting in `computed()`.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/RatingSummary.ts` renders Nia's summary, 4.9 from 86 reviews; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: `MatchingResults` (three result cards).
- Layout stability: inline text; no reserved size needed.

## Acceptance criteria

### Rendering

- **AC-1** Given Nia's published average of 4.9 from 86 reviews, when the summary renders, then it shows "4.9" and "· 86 reviews" beside a star. (L2-008)
- **AC-2** Given a single review's score of 5 and no count, when the summary renders, then it shows "5" with a star and no count. (L2-008)
- **AC-3** Given 1284 published reviews averaging 4.7, when the summary renders, then the count reads "· 1,284 reviews". (L2-008)
- **AC-4** Given one published review averaging 5, when the summary renders, then the count reads "· 1 review". (L2-008)

### States

- **AC-5** Given Jules has no published reviews, when the result renders with `value` null, then it shows "Not yet rated" and no number or star. (L2-004)
- **AC-6** Given a count of 0 with a non-null value, when the summary renders, then it shows the unrated state rather than a numeric rating. (L2-008)

### Keyboard and focus

- **AC-7** Given a page with rating summaries, when the customer tabs through it, then focus never lands on a summary. (L2-041)

### Screen readers

- **AC-8** Given Nia's summary, when a screen reader reads it, then it announces "Rated 4.9 out of 5 from 86 reviews" once and does not announce the star or the separator. (L2-041)
- **AC-9** Given an unrated summary, when a screen reader reads it, then it announces "Not yet rated" once. (L2-041)

### Theming

- **AC-10** Given the dark theme, when the summary renders, then the value and count meet 4.5:1 against the card surface. (L2-042)

### Responsive

- **AC-11** Given a 320 px viewport and a result card, when "4.7 · 1,284 reviews" renders, then it wraps within the card without horizontal scrolling. (L2-042)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Planned: folder `src/lib/rating-summary/` with `rating-summary.ts` and `index.ts`, exported from `public-api.ts`. Composes `Icon`.
- The library's global `.icon` styles size the star; component styles carry the `.rating*` rules from the design system.

## Decisions

- **D-1** *What does a count of 0 with a value mean?* Unrated. L2-008 AC2 forbids a numeric rating without published reviews, so the count wins.
- **D-2** *Should the component format numbers?* Yes, with `Intl.NumberFormat('en-CA')`: one decimal for averages, whole numbers for single scores. Consistent formatting on every screen matters more than consumer flexibility.
- **D-3** *Out-of-range values?* Treated as unrated with a dev-mode error. Showing a fabricated or impossible score violates L2-004 AC3.

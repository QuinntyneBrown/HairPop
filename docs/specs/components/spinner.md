# Spinner

| Field | Value |
|---|---|
| Selector | `hp-spinner` |
| Library path | `frontend/projects/components/src/lib/spinner/` |
| Status | planned |
| Traces to | L2-035, L2-036, L2-041, L2-042, L2-043 |
| Design system | [`spinner.html`](../../design-system/components/spinner.html) |
| Source mocks | [`pages/braider-profile/partial`](../../mocks/pages/braider-profile/partial.html), [`pages/matching-braiders/default`](../../mocks/pages/matching-braiders/default.html), [`pages/booking-request/submitting`](../../mocks/pages/booking-request/submitting.html) (busy button only, not this component), [`dialogs/cancel-appointment/busy`](../../mocks/dialogs/cancel-appointment/busy.html) (busy button only, not this component) |
| Rendering | [`spinner.html`](spinner.html) |

## Purpose and scope

A spinner says "working on it" for a short wait that has no shape yet: Nia's reviews reloading after "Retry reviews", the braider results refreshing in place after Maya changes a filter, a message on its way to Nia. It is a turning ring paired with text that names the work, inside a polite status region, so a screen-reader user hears "Loading Nia’s reviews" while a sighted customer sees the ring. It shows only when the wait is long enough to notice, and once shown it stays long enough to read.

Use something else when:

- the region's layout is known (a gallery, a list, a profile): use a [skeleton](skeleton.md), which holds the shape and avoids layout shift;
- the task can be measured (photos uploading): use a [progress bar](progress-bar.md);
- the wait belongs to the control that was pressed ("Send request", "Cancel request", "Try again"): use the [button](button.md)'s `busy` state, which draws its own spinner. A spinner component is never placed inside or beside a busy button;
- the outcome must be shown ("Saved", "Couldn’t refresh. Try again."): the inline message component replaces the spinner.

Out of scope:

- Marking the refreshed region busy. The region is the consumer's element; the consumer sets `aria-busy="true"` on it while the spinner is active (Usage, AC-10).
- Starting, cancelling or retrying the work, and the timeout or error that may end it. The spinner shows only while the consumer says the work is active.
- The outcome message and its announcement after the work ends.
- Whole-page loading. A page never shows a lone centred spinner; it shows its skeleton.
- Reserving the region's height. A large spinner sits in a card that already has its loaded height (the card's minimum height or skeleton), so nothing jumps when content arrives.

## Usage

No page mock shows a standalone spinner; the only spinners in the mocks are busy buttons, which belong to Button. Every configuration below comes from the design-system page, the feedback-and-loading pattern, and the mocks whose states need an in-place refresh.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/braider-profile/partial` reviews card, after "Retry reviews" (L2-007, L2-036 targeted retry) | `size="lg"`, standalone (label visually hidden), centred in the "Customer reviews" card | label "Loading Nia’s reviews" | hidden for the first 300 ms, spinning, finished (reviews or the compact error empty state replace it) | surface (card) |
| `pages/matching-braiders/default` results refreshing after a search or filter change (pattern *Feedback and loading*) | `size="md"`, `inline`, above the results grid | label "Refreshing braiders near Toronto…" | hidden, spinning, finished (results replace it) | canvas |
| `pages/my-appointments/default`, `pages/notification-center/default` refresh in place (design system *States*) | `size="md"`, standalone, in the page header beside the subtitle | label "Refreshing appointments" | hidden, spinning, finished ("Up to date" or "Couldn’t refresh" inline message) | canvas |
| `pages/booking-request/default` preferred-time check (design system *Anatomy*) | `size="lg"`, `inline`, under the "Preferred time" field | label "Checking Nia’s availability…" | hidden, spinning, label changed while spinning | surface (form panel) |
| `pages/appointment-detail/default` contact path (design system *Variants*, no mock yet) | `size="sm"`, `inline` | label "Sending your message to Nia…" | hidden, spinning | surface (card) |
| Auto-saving rows (design system *States* matrix, no mock yet) | `size="sm"`, `inline` | label "Saving…" | hidden, spinning, finished ("Saved" or "Not saved. Try again.") | surface |
| Inside a toast (design system *Theming*, no mock yet) | `size="sm"`, `inline`, inverse surface | label "Sending…" | spinning | inverse (toast) |
| Not a use: every busy button in `pages/*/submitting`, `dialogs/*/busy` and the "Try again" retry in error states | — | — | Button's `busy` draws the ring as its `::after`; no `hp-spinner` is rendered there | — |

Every row is buildable with the API below: three sizes, standalone or inline, one label input, and an `active` input that the consumer binds to its own "work in progress" signal.

## Anatomy

1. **Status region** — the host `hp-spinner` with `role="status"`. It exists from the first render, empty until the spinner reveals, so the label change is announced. Inline adds `.spinner-inline` to the host.
2. **Ring** — `.spinner` (with `.spinner--sm` or `.spinner--lg`), `aria-hidden="true"`. Track in `--color-border-default`, arc (the top quarter) in `--color-accent`, one turn per `--duration-loop-spin`. Rendered only while revealed.
3. **Label** — the `label` text. Standalone: inside `<span class="visually-hidden">`. Inline: a visible text node after the ring in `--text-body-sm`, `--color-fg-muted`, `--space-2` from the ring. Written only while revealed.

Host: the element selector `hp-spinner` is the status region and carries `role`, `.spinner-inline` and nothing else; the ring and label are its children (D-1). The host is `display: inline` (standalone) or `inline-flex` (inline, from `.spinner-inline`), so it sits in text or in a flex row like the mocks' `<span>`.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `label` | `string` | — | yes | Names the work: "Loading Nia’s reviews", "Refreshing braiders near Toronto…". Written into the status region when the spinner reveals and whenever it changes while revealed. Never empty; generic "Loading" only when the surrounding heading already says what. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | no | Adds `.spinner--sm` or `.spinner--lg` to the ring; md adds no modifier. Ring 16, 20 or 40 px. |
| `inline` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.spinner-inline` to the host and shows the label as visible text; false keeps the label visually hidden. |
| `active` | `boolean` (`booleanAttribute`) | `true` | no | Whether the work is in progress. Becoming true starts the 300 ms show delay; becoming false hides the spinner, but not before it has been visible for 500 ms (D-2). A consumer that renders the spinner under `@if` can leave it at the default; a consumer that wants the minimum-visible rule binds it. |

- Inputs are signal inputs; `inline` and `active` accept bare attributes.
- The component renders no copy of its own; the only string is `label`.
- Configuration: the library exports the injection token `SPINNER_TIMING` (`{ showDelayMs: number; minVisibleMs: number }`, default `{ showDelayMs: 300, minVisibleMs: 500 }`). Applications never override it; the perf-test scenario provides `{ showDelayMs: 0, minVisibleMs: 0 }` so the ring renders in the measured frame (D-9).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The spinner reports nothing; the consumer owns the work and knows when it ends. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | The ring and label are rendered from inputs; projected content is not supported, so the status region can never hold controls. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Standalone | — | A ring alone, label visually hidden: the middle of a card or region ("Loading Nia’s reviews"), a page-header refresh. |
| Inline | `.spinner-inline` (host) | Ring plus visible text in one row: "Refreshing braiders near Toronto…", "Sending your message to Nia…", "Saving…". |
| Button loading (not this component) | `.btn[aria-busy="true"]` | Drawn by Button. Listed so it is never rebuilt here. |

| Size | Modifier | Ring | Ring width | Use beside |
|---|---|---|---|---|
| sm | `.spinner--sm` | 16 px (`--spinner-size` 1rem) | `--border-width-thick` | body-small text, inline rows, toasts |
| md | — | 20 px (`--spinner-size` 1.25rem, the icon size) | `--border-width-thick` | body text, rows, page header |
| lg | `.spinner--lg` | 40 px (`--spinner-size` 2.5rem) | `calc(var(--border-width-thick) * 1.5)`, 3 px (D-6) | the middle of a card or empty region |

Width comes from the ring and, inline, the label; the label wraps instead of truncating.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Waiting to show | `active` true for less than 300 ms | Nothing painted; host empty | Status region present and empty; nothing announced |
| Spinning | `active` true for 300 ms or more | Ring turning; inline label visible | Label written into the status region once and announced politely |
| Label changed | `label` changes while spinning | New text replaces the old | New text announced once |
| Holding | `active` became false less than 500 ms after the reveal | Still spinning until 500 ms have passed since the reveal | Unchanged |
| Finished | `active` false and the minimum passed, or the host removed | Ring and label removed; host empty (the consumer shows the outcome) | Region empty; nothing announced by the spinner |
| Finished early | `active` false before 300 ms | Never painted | Never announced |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Keeps turning at the same speed (the only sign of progress) | — |
| Inverse surface | inside `.toast` | Track `--color-border-inverse`, arc `--color-fg-inverse` | — |
| Forced colours | `(forced-colors: active)` | Track `GrayText`, arc `Highlight` (D-7) | — |
| Server render | SSR | Nothing painted; no timers start until the browser hydrates | Empty status region |

The spinner is not interactive: no hover, focus, active or disabled state.

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: standalone, large, spinning (reviews card) -->
<hp-spinner role="status">
  <span class="spinner spinner--lg" aria-hidden="true"></span>
  <span class="visually-hidden">Loading Nia’s reviews</span>
</hp-spinner>
```

```html
<!-- rendered: inline, medium, spinning (matching braiders) -->
<hp-spinner class="spinner-inline" role="status">
  <span class="spinner" aria-hidden="true"></span>Refreshing braiders near Toronto…
</hp-spinner>
```

```html
<!-- rendered: waiting to show, holding finished, or server render -->
<hp-spinner role="status"></hp-spinner>
```

The small size adds `.spinner--sm` to the ring and nothing else.

Consumer templates:

```html
<!-- consumer: reviews card during "Retry reviews"; the card is busy while the spinner is active -->
<div hp-card aria-labelledby="reviews-title" [attr.aria-busy]="reviewsLoading() || null">
  <h2 id="reviews-title">Customer reviews</h2>
  <hp-spinner size="lg" label="Loading Nia’s reviews" [active]="reviewsLoading()" />
  ...
</div>

<!-- consumer: in-place refresh above the results grid -->
<hp-spinner inline label="Refreshing braiders near Toronto…" [active]="refreshing()" />

<!-- consumer: under @if, default active -->
@if (checking()) {
  <hp-spinner inline size="lg" label="Checking Nia’s availability…" />
}
```

Free to change: the order of children is fixed (ring first), but the label may be a text node or a span when inline.

## Design

- Ring: `width` and `height` from `--spinner-size`; border `--border-width-thick` (`calc(var(--border-width-thick) * 1.5)` at lg); `--radius-full`; `flex: none`.
- Inline row: `inline-flex`, centred on the cross axis, gap `--space-2`, label `--text-body-sm` in `--color-fg-muted`.
- Motion: `spin` keyframes (`rotate: 360deg`) over `--duration-loop-spin`, linear, infinite. Deliberately not bound to `--motion-loop-state`.
- Timing (behaviour, not tokens): show delay 300 ms, minimum visible 500 ms, from the design-system *States* rules.
- Layer: none.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--spinner-size` | 1.25rem | `.spinner--sm` → 1rem; `.spinner--lg` → 2.5rem |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Arc | `--color-accent` | `--palette-plum-600` | `--palette-plum-300` |
| Track | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Inline label | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Arc on a toast | `--color-fg-inverse` | `--palette-white` | `--palette-gray-900` |
| Track on a toast | `--color-border-inverse` | `--palette-gray-700` | `--palette-gray-300` |

Contrast pairs the component relies on, from the design-system page and `tokens/contrast-pairs.json`:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-accent` | `--color-bg-surface` | 3:1 | Arc in a card |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Arc on the page |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Inline label in a card |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Inline label on the page |
| `--color-fg-inverse` | `--color-bg-inverse` | 3:1 | Arc on a toast (the toast text pair, 4.5:1, already covers it) |

The track is decorative; the arc and the label carry the meaning. Forced colours: see D-7.

## Responsive behaviour

- The spinner has no breakpoint rules; sizes are in `rem`, so they follow the text size, not the viewport.
- An inline label longer than its row wraps beside the ring (the ring stays at the start, centred on the label's lines) and never truncates; measured at 360 px with text at 200 %, "Refreshing braiders near Toronto…" wraps onto several lines and the page does not scroll horizontally.
- A large spinner centred in a card keeps the card's loaded height (the card's minimum height), so nothing jumps when content arrives.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available. The spinner is not a target.

## Accessibility

### Role and pattern

The host has `role="status"` (a polite live region, [WAI-ARIA status](https://www.w3.org/TR/wai-aria-1.2/#status)); the ring is `aria-hidden="true"`. The region the work refreshes is the consumer's and carries `aria-busy="true"` while the spinner is active.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Not focusable. Focus stays on the control that started the work ("Retry reviews", the search field). |

### Focus

The spinner never takes or moves focus. When it finishes, focus stays where it was; moving focus to a new view's heading is the consumer's rule.

### Labelling

The label names the work ("Loading Nia’s reviews", "Sending your message to Nia…"). It is the only text in the status region. The ring is never named.

### Announcements

The status region is rendered empty on the first render and the label is written into it only when the spinner reveals, so the change happens inside an existing live region and is announced once, politely. A label change while spinning is announced once. Nothing is announced when the work finishes inside the 300 ms delay, and nothing when the spinner finishes (the consumer announces the outcome).

### Motion

One revolution per `--duration-loop-spin` (800 ms), linear. Under `prefers-reduced-motion: reduce` the spinner keeps turning: it is the only sign that work is in progress and it does not travel across the screen. It flashes nothing.

## Content and internationalisation

- A present-participle phrase that names the thing: "Checking Nia’s availability…", "Sending your request…", "Refreshing braiders near Toronto…". Standalone labels may drop the ellipsis ("Loading Nia’s reviews").
- An ellipsis character (…), never three dots.
- No humour or apology for waits under ten seconds; if a wait passes ten seconds the consumer changes the label to say what is still happening.
- Keep inline labels under about 40 characters so they rarely wrap.
- Translatable input: `label`. Data values inside it: the braider's first name ("Nia’s"), the place ("Toronto"). The product is English-only today; a longer label wraps.

## Performance

- Change detection: `OnPush`, signal inputs; the revealed state is a signal set by one timer; no work in the template.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Spinner.ts` renders `<hp-spinner size="lg" label="Loading Nia’s reviews" />` with `SPINNER_TIMING` set to zero delays, so the revealed ring is what is measured; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none.
- Regression rule: a change to its template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: standalone it is inline and takes no space while hidden; the consumer reserves the region's height.
- Weight: `@angular/core` only; timers through `setTimeout` started in `afterNextRender` so the server never schedules them.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given Nia Okafor's profile after Maya activates "Retry reviews", when `<hp-spinner size="lg" label="Loading Nia’s reviews">` has been active for 300 ms in the "Customer reviews" card, then the host has `role="status"` and contains a 40 px `.spinner.spinner--lg` ring with `aria-hidden="true"` and a `.visually-hidden` span reading "Loading Nia’s reviews". (L2-036)
- **AC-2** Given `<hp-spinner inline label="Refreshing braiders near Toronto…">` above the matching-braiders results, when it reveals, then the host has the class `spinner-inline`, a 20 px ring precedes the visible text "Refreshing braiders near Toronto…" by 8 px, and the text uses `--text-body-sm` in `--color-fg-muted`. (L2-035)
- **AC-3** Given spinners of size `sm`, `md` and `lg` in a card in the light theme, when they render, then the rings measure 16, 20 and 40 px with 2, 2 and 3 px rings, and the `--color-accent` arc has a contrast of at least 3:1 against `--color-bg-surface`. (L2-041)

### States

- **AC-4** Given an active spinner labelled "Refreshing appointments", when the work finishes 200 ms after it started, then nothing was ever painted, the status region stayed empty and nothing was announced. (L2-035)
- **AC-5** Given a spinner that revealed at time t, when `active` becomes false at t + 100 ms, then the ring stays visible until t + 500 ms and is then removed together with the label. (L2-035)
- **AC-6** Given the reviews read takes 12 seconds, when Maya waits, then the spinner keeps turning and its label stays "Loading Nia’s reviews" for the whole wait, and it never ends or changes to a finished look on its own. (L2-043)
- **AC-7** Given a revealed inline spinner labelled "Checking Nia’s availability…", when the consumer changes the label to "Still checking Nia’s availability…", then the visible text and the status region show the new label and it is announced once. (L2-041)
- **AC-8** Given the booking request form with "Send request" busy, when the form renders, then no `hp-spinner` is rendered inside or beside the button; the only ring is the button's own busy indicator. (L2-036)

### Keyboard and focus

- **AC-9** Given Maya activates "Retry reviews" with the keyboard, when the reviews spinner reveals and later finishes, then focus stays on the control she used, the spinner has no `tabindex`, and pressing Tab never lands on it. (L2-041)

### Screen readers

- **AC-10** Given the "Customer reviews" card refreshing, when the spinner is active, then the card has `aria-busy="true"`, and when the reviews arrive, then `aria-busy` is removed in the same update that removes the spinner. (L2-035)
- **AC-11** Given a screen reader is running, when the reviews spinner reveals, then "Loading Nia’s reviews" is announced once, politely, without interrupting current speech, and the ring itself is never announced. (L2-041)

### Theming

- **AC-12** Given the large spinner in the "Customer reviews" card, when the theme switches from light to dark, then the arc changes from plum 600 to plum 300 and the track from grey 200 to grey 750 without a reload, and the arc keeps a contrast of at least 3:1 against `--color-bg-surface`. (L2-042)
- **AC-13** Given a small inline spinner labelled "Sending…" inside a toast, when it renders in either theme, then the arc uses `--color-fg-inverse` and the track `--color-border-inverse`, and the arc has a contrast of at least 3:1 against `--color-bg-inverse`. (L2-041)
- **AC-14** Given Windows forced colours, when a revealed spinner renders, then its track is `GrayText` and its arc `Highlight`, so the turning arc stays visible. (L2-041)

### Responsive

- **AC-15** Given the inline spinner "Refreshing braiders near Toronto…" on a 360 px viewport with text enlarged to 200 %, when it renders, then the label wraps beside the ring, the whole label is visible, and the page does not scroll horizontally. (L2-042)
- **AC-16** Given a 320 px viewport, when the large reviews spinner renders inside the "Customer reviews" card, then it fits within the card's padding and nothing scrolls horizontally. (L2-042)

### Motion

- **AC-17** Given `prefers-reduced-motion: reduce`, when the reviews spinner is revealed, then it keeps turning at one revolution per 800 ms. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/spinner/`; file `spinner.ts` exporting the standalone component `Spinner` with `selector: 'hp-spinner'`, `changeDetection: OnPush`, and scoped styles that port `.spinner`, `.spinner--sm`, `.spinner--lg` and `.spinner-inline` from `docs/design-system/assets/components.css` (host-level `.spinner-inline` as `:host(.spinner-inline)`), plus the `@keyframes spin`.
- Host bindings: `role="status"`; `class.spinner-inline` from `inline`.
- Template: `@if (revealed()) { <span class="spinner" [class.spinner--sm]=… [class.spinner--lg]=… aria-hidden="true"></span> @if (inline()) { {{ label() }} } @else { <span class="visually-hidden">{{ label() }}</span> } }`. The ring and label render only when revealed, so the region is empty before.
- Timing: an `effect` on `active` that, in the browser only (start it from `afterNextRender`), sets a 300 ms timer to reveal and, on deactivation, keeps `revealed` true until 500 ms after the reveal. Clear timers in `DestroyRef.onDestroy`. The delays come from the `SPINNER_TIMING` injection token, whose default factory returns `{ showDelayMs: 300, minVisibleMs: 500 }` with a comment citing the design-system *States* rules.
- Toast context: `:host-context(.toast) .spinner { border-color: var(--color-border-inverse); border-top-color: var(--color-fg-inverse); }`, the design-system *Theming* rule.
- Forced colours (D-7): `@media (forced-colors: active) { .spinner { forced-color-adjust: none; border-color: GrayText; border-top-color: Highlight; } }`. `docs/design-system/assets/components.css` gains the same rule in the slice that builds it.
- Large ring width (D-6): `.spinner--lg { border-width: calc(var(--border-width-thick) * 1.5); }` replaces the raw `3px`; the design-system stylesheet changes in the same slice.
- No CDK primitive; composes nothing.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Spinner.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Element selector or attribute selector on a native `<span>`?* Element selector `hp-spinner`. The spinner is a composite (live region, ring, label) whose host has no native semantics to keep and no parent layout rule in `components.css` that targets it; the host carries the mocks' `.spinner-inline` class and `role="status"`, so e2e locators find the same classes as in the design system's markup.
- **D-2** *Who applies the design system's "show after about 300 ms, keep at least 500 ms" rule?* The component, through `active`. A component cannot delay its own removal under `@if`, so the minimum is honoured only when the consumer binds `active`; the show delay applies either way. Putting both in one place stops every page from writing its own timers, and writing the label only at the reveal is also what makes the announcement reliable.
- **D-3** *How is the live region made reliable?* The host is the `role="status"` region from the first render and stays empty until the reveal, then the label is written into it. The design-system page warns that a region inserted together with its text is often not announced; this order avoids that.
- **D-4** *Does the spinner set `aria-busy` on the region it refreshes?* No. The region is the consumer's element, outside the component; the consumer binds `aria-busy` to the same signal as `active` (AC-10). The spinner's own host is never `aria-busy`, which would suppress its announcement.
- **D-5** *May a spinner sit inside a busy button?* Never. Button's `busy` state draws the ring as a pseudo-element in `--btn-fg`, keeps the label and announces through `aria-busy`; a second ring would double the noise, as the design-system *Do and don't* shows for the mocks' "Working…" state.
- **D-6** *The large ring is a raw `3px` in `components.css`. Which token?* `calc(var(--border-width-thick) * 1.5)`, which is exactly 3 px and keeps the value tied to the border scale; no 3 px token exists.
- **D-7** *What happens in forced colours?* The stylesheet has no rule, so every border becomes `CanvasText` and the arc disappears into a still circle. The ring opts out of forced colour adjustment and uses system colours: track `GrayText`, arc `Highlight`.
- **D-8** *Is a done or error look part of the spinner?* No. The design system's *States* matrix ends a spinner by replacing it with an inline message ("Saved", "Couldn’t refresh") or with content; the spinner only spins.
- **D-9** *How does the perf test measure a spinner that waits 300 ms before painting?* Through the `SPINNER_TIMING` injection token, which the scenario sets to zero. The timing stays a design-system rule for every application; acceptance tests keep the real delays and drive them with Playwright's clock.

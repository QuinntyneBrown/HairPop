# Empty state

| Field | Value |
|---|---|
| Selector | `hp-empty-state` |
| Library path | `frontend/projects/components/src/lib/empty-state/` |
| Status | planned |
| Traces to | L2-001, L2-002, L2-004, L2-005, L2-007, L2-012, L2-014, L2-017, L2-018, L2-025, L2-030, L2-032, L2-033, L2-035, L2-036, L2-041, L2-042 |
| Design system | [`empty-state.html`](../../design-system/components/empty-state.html) |
| Source mocks | [`pages/my-appointments/empty`](../../mocks/pages/my-appointments/empty.html), [`pages/notification-center/empty`](../../mocks/pages/notification-center/empty.html), [`pages/style-gallery/empty`](../../mocks/pages/style-gallery/empty.html), [`pages/matching-braiders/empty`](../../mocks/pages/matching-braiders/empty.html), [`pages/braider-profile/empty`](../../mocks/pages/braider-profile/empty.html), [`pages/style-gallery/no-results`](../../mocks/pages/style-gallery/no-results.html), [`pages/matching-braiders/no-results`](../../mocks/pages/matching-braiders/no-results.html), [`pages/my-appointments/no-results`](../../mocks/pages/my-appointments/no-results.html), [`pages/style-gallery/error`](../../mocks/pages/style-gallery/error.html), [`pages/help/error`](../../mocks/pages/help/error.html), [`pages/terms/error`](../../mocks/pages/terms/error.html), [`pages/booking-request/success`](../../mocks/pages/booking-request/success.html), [`pages/care-and-review/success`](../../mocks/pages/care-and-review/success.html), [`pages/account-settings/success`](../../mocks/pages/account-settings/success.html), [`pages/forgot-password/success`](../../mocks/pages/forgot-password/success.html) |
| Rendering | [`empty-state.html`](empty-state.html) |

## Purpose and scope

An empty state fills a region that has nothing to show yet, nothing that matches, or nothing it could load, and gives Maya one clear next step. It always has the same shape: an icon in a tinted circle, a title that names what is or is not here, one sentence that explains why or what happens next, and one primary action ("Explore styles", "Clear filters", "Try again"), with at most one secondary. The same shape confirms a finished form ("Request sent to Nia").

Use something else when:

- the whole page cannot be shown (404, 403, 500, offline): use the [error page](error-page.md), which composes this component with the page's `h1`;
- only part of a page failed (Nia's reviews did not load but her profile did): a warning alert with a targeted retry replaces that part (alert CRD);
- the region is still loading: use the [skeleton](skeleton.md);
- feedback is transient ("Review posted" while the form stays): use a toast.

Out of scope:

- Deciding which state applies (first-run versus no-results versus error); the page knows whether its data is empty, filtered or failed.
- The actions' behaviour: retrying, clearing filters, navigating. The actions are Buttons the page projects and binds; `busy` on "Try again" is the Button's.
- Keeping the filters and search visible and applied above a no-results state; they are the page's controls.
- Which variant, icon and copy a screen uses; the Usage table lists them, and the page's copy follows the design-system formulas.
- Page shell, page header and landmarks.

## Usage

Every use of `.empty` in `docs/mocks/`, grouped by configuration, plus the configurations the design system defines for regions. The mocks render the configuration in this table: screen-specific titles, SVG icons, proper names in error titles and a `<button>` "Try again" (D-1 records the earlier drift).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/my-appointments/empty` (L2-018) | first-run: `variant` default, `size` full, `headingLevel` 2 | calendar icon; "No appointments yet"; "When you request a visit, you’ll find its status and details here."; primary link "Explore styles" | default, action focused | canvas |
| `pages/notification-center/empty` (L2-030) | first-run, full, h2 | bell icon; "No updates yet"; "Updates about requests and appointments will appear here."; primary link "Explore styles" | default | canvas |
| `pages/style-gallery/empty` (L2-001) | first-run, full, h2 | sparkle icon; "No styles to explore yet"; "Styles are being refreshed. Check back shortly or browse braiders."; primary link "Browse braiders" (D-8) | default | canvas |
| `pages/matching-braiders/empty` (L2-004) | first-run, full, h2 | user icon; "No braiders offer knotless braids yet"; "No braiders have listed this style near Toronto yet. Try another style."; primary link "Explore styles" | default | canvas |
| `pages/braider-profile/empty`, portfolio card (L2-007) | first-run, `size` compact, h3, inside the portfolio card; the rest of the profile stays (D-7) | star icon; "No portfolio photos yet"; "You can still read Nia’s services and policies."; primary link `size="sm"` "Request with Nia" | default | surface (card) |
| Braider profile "Customer reviews" card with no published reviews (L2-007, L2-008) | first-run, compact, h3, no action | star icon; "No reviews yet"; "Nia’s first reviews will appear here after her next appointments." | default | surface (card) |
| `pages/style-detail/empty`, `booking-request/empty`, `appointment-detail/empty`, `care-and-review/empty` | first-run, full, h2 | an icon for the content; a screen-specific title by the first-run formula (for example "No care guidance yet" on care and review); the mock's sentence; primary link "Explore styles" | default | canvas |
| `pages/style-gallery/no-results` (L2-002), `matching-braiders/no-results` (L2-005), `my-appointments/no-results` (L2-018) | no-results: default variant, full, h2, `status` set to the title after a filter or search change | search icon; "No styles match this search", "No braiders match these filters", "No appointments match these filters"; "Try a wider price range or distance to see more options." (braiders); primary `<button>` "Clear filters" | default, action focused, clearing (busy) | canvas, under the page's still-visible filters |
| Error on every page with an `error` mock: `style-gallery`, `style-detail`, `matching-braiders`, `braider-profile`, `booking-request`, `appointment-detail`, `my-appointments`, `care-and-review`, `sign-in`, `sign-up`, `forgot-password`, `reset-password`, `verify-email`, `notification-center`, `account-settings`, `help` (L2-032), `terms`, `privacy` (L2-033) | error: `variant="error"`, full, h2 | alert-circle icon; "We couldn’t load [the thing]" ("We couldn’t load the style gallery", "We couldn’t load Nia’s profile", "We couldn’t load your appointments"); "Check your connection and try again. Your details are safe."; primary `<button>` "Try again" (`busy` while retrying) and secondary link "Explore styles" | default, action focused, retrying (busy), retry failed (announced) | canvas |
| Region error, for example the reviews card when the whole profile is shown from cache (design system *States*) | error, compact, h3 | alert-circle icon; "Reviews didn’t load"; primary `<button>` `size="sm"` "Try again" | default, focused, retrying | surface (card) |
| `pages/booking-request/success` (L2-017) | success: default variant, full, h2, `focusOnRender` | check icon; "Request sent to Nia"; "This is a request, not a confirmed appointment. Nia will reply with the final time and price."; primary link "View appointment" (HP-1048 detail) | default, heading focused | canvas |
| `pages/care-and-review/success` (L2-025) | success, full, h2, `focusOnRender` | check icon; "Your review is posted"; "Your review helps others choose a braider with confidence."; primary link "Explore styles" | default, heading focused | canvas |
| `pages/sign-in/success` (L2-011), `sign-up/success` (L2-010), `forgot-password/success` (L2-012), `reset-password/success` (L2-012), `verify-email/success` (L2-013), `account-settings/success` (L2-014) | success, full, h2, `focusOnRender` | check icon; "You’re signed in", "Your account is ready", "Check your inbox" ("If this email belongs to an account, a reset link is on its way."), "Password updated", "Email sent again", "Your changes are saved"; primary link "Explore styles" | default, heading focused | canvas |
| Error pages `pages/not-found`, `forbidden`, `server-error`, `offline` | composed by [error page](error-page.md): full, `headingLevel` 1, `focusOnRender`, `reference` on 500 | per error-page CRD | per error-page CRD | canvas |
| Permission inside a page (design system *Variants*: "This appointment belongs to another account") | not used (D-9) | — | — | — |

Every row is buildable with the API below: three variants, two sizes, a heading at any level, an optional sentence and reference, an icon slot and an actions slot for Buttons, plus `stackActions`, `busy`, `focusOnRender` and `status`.

## Anatomy

1. **Container** — the host `hp-empty-state` with `.empty` (plus `.empty--error`, `.empty--warning`, `.empty--compact`): a centred column, gap `--space-3`, padding `--space-12` `--space-6` (compact `--space-8` `--space-4`).
2. **Icon** — `.empty__icon`, `aria-hidden="true"`: a 64 px circle (48 px compact) in `--empty-icon-bg` holding the projected `svg.icon` in `--empty-icon-fg`, 24 px (20 px compact).
3. **Title** — `.empty__title`, a real heading `<h1>`–`<h4>` at the level the region needs: `--text-h3`, 28 px (`--font-size-2xl`) from 768 px.
4. **Text (optional)** — `.empty__text`: one sentence in `--color-fg-muted`, at most 36 characters wide (36ch).
5. **Actions (optional)** — `.empty__actions`: the projected Buttons, wrapped and centred, `--space-3` apart; one primary, at most one secondary. Hidden when empty.
6. **Reference (optional)** — `.empty__reference`: a support reference in `--text-code` at `--font-size-xs`, `--color-fg-subtle`, selectable.
7. **Status region** — a visually hidden `role="status"` (or `role="alert"`) span, empty unless `status` is set.

Host: the element selector `hp-empty-state` carries the `.empty` classes itself, so the e2e locators that find `.empty` in the mocks find the host (D-2). Parts 2 to 7 are its children in that order.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `variant` | `'default' \| 'error' \| 'warning'` | `'default'` | no | `error` adds `.empty--error` (danger tint), `warning` adds `.empty--warning` (warning tint). First-run, no-results and success use default; a failed load uses error; permission and offline use warning. |
| `size` | `'full' \| 'compact'` | `'full'` | no | `compact` adds `.empty--compact`: inside cards, panels and dialogs. |
| `heading` | `string` | — | yes | The title text. Names the specific thing ("No appointments yet"); never "Nothing here yet". |
| `headingLevel` | `1 \| 2 \| 3 \| 4` | `2` | no | Renders `<h{n} class="empty__title">`: 2 in a page's main region under its `h1`, 3 inside a card whose section heading is an `h2`, 1 only on an error page. |
| `text` | `string \| null` | `null` | no | The one sentence. Null renders no `.empty__text`. |
| `reference` | `string \| null` | `null` | no | Renders `<p class="empty__reference">` after the actions ("Reference: HP-ERR-7F3K2Q · Sat 10 Oct, 9:42 am"). |
| `busy` | `boolean` (`booleanAttribute`) | `false` | no | Sets `aria-busy="true"` on the host while its action is working (retrying, clearing filters). The action's own `busy` is set on its Button. |
| `stackActions` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.empty--stack-actions`: below 640 px (`--layout-breakpoint-sm`) the actions stack in a column at the empty state's full content width, primary first. For an empty state that fills the screen; error pages always set it (D-6). |
| `focusOnRender` | `boolean` (`booleanAttribute`) | `false` | no | Gives the heading `tabindex="-1"` and moves focus to it after the first render: success states that replace a form, and error pages reached by client-side navigation. |
| `status` | `string \| null` | `null` | no | Text announced through the component's live region. Written after the first render and on every change to a non-null value, so it is announced even when the empty state has just appeared (D-5). |
| `statusRole` | `'status' \| 'alert'` | `'status'` | no | `alert` only when an action Maya took failed (a retry that failed again); `status` for a state that replaced content after a search, filter or retry. |

- Inputs are signal inputs; booleans accept bare attributes. Every string is an input or projected content; the component renders no copy of its own.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The empty state reports nothing; its actions are Buttons whose `click` the page binds. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `[slot=icon]` | One `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">` | Declared once, inside `.empty__icon`. Sized by the component: 24 px full (the `.icon--lg` size), 20 px compact. Text glyphs are not accepted. |
| `[slot=actions]` | One primary `button[hp-button]` or `a[hp-button]`, optionally followed by one secondary | Declared once, inside `.empty__actions`. "Try again" and "Clear filters" are `<button>`s; "Explore styles", "View appointment", "Sign in", "Request with Nia" are `<a href>`s. |

## Variants and sizes

| Variant | Modifier | Icon tint | Use for |
|---|---|---|---|
| Default (first-run, no results, success) | — | `--color-accent-subtle` circle, `--color-fg-accent` icon | Nothing exists yet; filters excluded everything; a form's job is done |
| Error | `.empty--error` | `--color-danger-bg`, `--color-danger-icon` | The content could not load |
| Warning (permission, offline) | `.empty--warning` | `--color-warning-bg`, `--color-warning-icon` | Content exists but this account cannot see it; the device is offline |

| Size | Modifier | Padding | Icon circle | Icon | Use in |
|---|---|---|---|---|---|
| Full | — | `--space-12` block, `--space-6` inline | 4rem (64 px) | 1.5rem (24 px) | A page's main region, a whole gallery or list |
| Compact | `.empty--compact` | `--space-8` block, `--space-4` inline | `--control-height-lg` (48 px) | 1.25rem (20 px) | A card, a detail-grid panel, a dialog body |

The title grows from 22 px to 28 px at 768 px in both sizes; the width is the container's, the text is capped at 36ch.

Layout modifier: `.empty--stack-actions` (`stackActions`) stacks the actions at full content width below 640 px; it combines with any variant and the full size.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | rendered | Icon, title, text, actions centred | Heading in the outline; nothing announced unless `status` is set |
| Action hover, focus, active | the Button's | Button's states | Button's |
| Action focused | `:focus-visible` on a Button | Shared focus ring | — |
| Retrying or clearing | `busy` true, and `busy` on the primary Button | Button's busy ring; everything else unchanged | Host `aria-busy="true"`; Button `aria-busy="true"`; focus stays on the Button |
| Retry failed | consumer sets `status` with `statusRole="alert"` | Unchanged | The message is announced assertively once; focus stays on "Try again" |
| Replaced content | consumer sets `status` to the title after a filter, search or retry | Unchanged | Announced politely once |
| Success, heading focused | `focusOnRender` | Heading receives programmatic focus (no visible ring unless keyboard-initiated) | Heading read on arrival |
| Dark theme | `[data-theme="dark"]` or the system preference | Deep tints (plum, red, amber 950) with light icons | — |
| Actions stacked on phones | `stackActions` and a viewport below 640 px | Actions in a column, each as wide as the empty state's content, primary first | Order unchanged |
| Forced colours | `(forced-colors: active)` | The circle's fill is removed; a `CanvasText` hairline outlines the circle and the icon draws in `CanvasText` (D-11); the title carries the meaning | — |

The empty state itself is static: no hover, focus or disabled state of its own, and no entrance animation.

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: first-run (My appointments) -->
<hp-empty-state class="empty">
  <div class="empty__icon" aria-hidden="true">
    <svg class="icon icon--lg" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/></svg>
  </div>
  <h2 class="empty__title">No appointments yet</h2>
  <p class="empty__text">When you request a visit, you’ll find its status and details here.</p>
  <div class="empty__actions"><a class="btn btn--primary" href="/">Explore styles</a></div>
  <span class="visually-hidden" role="status"></span>
</hp-empty-state>
```

```html
<!-- rendered: error, retrying (style gallery) -->
<hp-empty-state class="empty empty--error" aria-busy="true">
  <div class="empty__icon" aria-hidden="true">
    <svg class="icon icon--lg" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v5M12 16v.01"/></svg>
  </div>
  <h2 class="empty__title">We couldn’t load the style gallery</h2>
  <p class="empty__text">Check your connection and try again. Your details are safe.</p>
  <div class="empty__actions">
    <button class="btn btn--primary" type="button" aria-busy="true">Try again</button>
    <a class="btn" href="/">Explore styles</a>
  </div>
  <span class="visually-hidden" role="status"></span>
</hp-empty-state>
```

```html
<!-- rendered: compact, no action, inside the reviews card -->
<hp-empty-state class="empty empty--compact">
  <div class="empty__icon" aria-hidden="true"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24">…</svg></div>
  <h3 class="empty__title">No reviews yet</h3>
  <p class="empty__text">Nia’s first reviews will appear here after her next appointments.</p>
  <div class="empty__actions"></div>
  <span class="visually-hidden" role="status"></span>
</hp-empty-state>
```

```html
<!-- rendered: success replacing the booking form, heading focused -->
<hp-empty-state class="empty">
  <div class="empty__icon" aria-hidden="true"><svg class="icon icon--lg" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12l5 5L19 7"/></svg></div>
  <h2 class="empty__title" tabindex="-1">Request sent to Nia</h2>
  <p class="empty__text">This is a request, not a confirmed appointment. Nia will reply with the final time and price.</p>
  <div class="empty__actions"><a class="btn btn--primary" href="/appointments/hp-1048">View appointment</a></div>
  <span class="visually-hidden" role="status"></span>
</hp-empty-state>
```

```html
<!-- rendered: no-results after "Show braiders", status announced -->
<hp-empty-state class="empty">
  …<h2 class="empty__title">No braiders match these filters</h2>…
  <div class="empty__actions"><button class="btn btn--primary" type="button">Clear filters</button></div>
  <span class="visually-hidden" role="status">No braiders match these filters</span>
</hp-empty-state>
```

The warning variant adds `.empty--warning` and the reference adds `<p class="empty__reference">` after `.empty__actions`; see the error-page CRD for both.

Consumer templates:

```html
<!-- consumer: style gallery error -->
<hp-empty-state variant="error" heading="We couldn’t load the style gallery"
  text="Check your connection and try again. Your details are safe."
  [busy]="retrying()" [status]="retryFailed() ? 'We couldn’t load the style gallery' : null" statusRole="alert">
  <svg slot="icon" class="icon icon--lg" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v5M12 16v.01"/></svg>
  <button hp-button slot="actions" variant="primary" [busy]="retrying()" (click)="retry()">Try again</button>
  <a hp-button slot="actions" routerLink="/">Explore styles</a>
</hp-empty-state>

<!-- consumer: no reviews, compact, inside the reviews card -->
<hp-empty-state size="compact" [headingLevel]="3" heading="No reviews yet"
  text="Nia’s first reviews will appear here after her next appointments.">
  <svg slot="icon" class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>
</hp-empty-state>

<!-- consumer: booking request success -->
<hp-empty-state heading="Request sent to Nia" focusOnRender
  text="This is a request, not a confirmed appointment. Nia will reply with the final time and price.">
  <svg slot="icon" class="icon icon--lg" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12l5 5L19 7"/></svg>
  <a hp-button slot="actions" variant="primary" [routerLink]="['/appointments', request.reference]">View appointment</a>
</hp-empty-state>
```

Free to change: the position of the hidden status span (it may move to the start), as long as it stays outside the heading and actions.

## Design

- Container: `flex` column, `align-items: center`, `text-align: center`, gap `--space-3`; padding `--space-12` `--space-6` (full) or `--space-8` `--space-4` (compact).
- Icon circle: 4rem square (compact `--control-height-lg`), `--radius-full`, `display: grid; place-items: center`, `--empty-icon-bg` fill, `--empty-icon-fg` colour, `--space-2` below. Projected icon 1.5rem (compact 1.25rem), `currentColor` stroke.
- Title: `--text-h3`, `--letter-spacing-normal`; `--font-size-2xl` from 768 px; `text-wrap: balance` from the heading base style.
- Text: `--color-fg-muted`, `max-width: 36ch`.
- Actions: `flex`, wrap, centred, gap `--space-3`, `--space-2` above; `display: none` when empty. With `.empty--stack-actions` below 640 px: `flex-direction: column`, `align-self: stretch`, each action full width.
- Reference: `--text-code` at `--font-size-xs`, `--color-fg-subtle`; wraps at spaces.
- Motion: none. Elevation: none (it sits on the canvas or inside a card).

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--empty-icon-bg` | `--color-accent-subtle` | `.empty--error` → `--color-danger-bg`; `.empty--warning` → `--color-warning-bg` |
| `--empty-icon-fg` | `--color-fg-accent` | `.empty--error` → `--color-danger-icon`; `.empty--warning` → `--color-warning-icon` |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Icon circle, default | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Icon, default | `--color-fg-accent` | `--palette-plum-700` | `--palette-plum-300` |
| Icon circle, error | `--color-danger-bg` | `--palette-red-50` | `--palette-red-950` |
| Icon, error | `--color-danger-icon` | `--palette-red-500` | `--palette-red-300` |
| Icon circle, warning | `--color-warning-bg` | `--palette-amber-50` | `--palette-amber-950` |
| Icon, warning | `--color-warning-icon` | `--palette-amber-500` | `--palette-amber-300` |
| Title | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Text | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Reference | `--color-fg-subtle` | `--palette-gray-500` | `--palette-gray-400` |

Contrast pairs, from the design-system page and `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Title on the page |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Title in a card |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Text on the page |
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Text in a card |
| `--color-fg-muted` | `--color-bg-surface-raised` | 4.5:1 | Text in a dialog |
| `--color-fg-subtle` | `--color-bg-canvas` | 4.5:1 | Reference on the page |
| `--color-fg-accent` | `--color-accent-subtle` | 3:1 | Default icon on its tint (`contrast-pairs.json` holds it to 4.5:1 as text) |
| `--color-danger-icon` | `--color-danger-bg` | 3:1 | Error icon on its tint |
| `--color-warning-icon` | `--color-warning-bg` | 3:1 | Warning icon on its tint |

The icon is decorative; the title carries the meaning, so the tint is never the only signal. The action Buttons bring their own pairs (button CRD).

## Responsive behaviour

- Centred at every width. The title is 22 px below 768 px and 28 px from 768 px; the text stays at 36ch.
- Actions wrap and centre. Measured at 320 px, "Try again" and "Explore styles" sit on two centred rows; at 360 px they share one row; nothing scrolls horizontally. With `stackActions` they stack at full content width below 640 px (D-6).
- Below 640 px, pages use the compact size inside cards and dialogs so the action stays above the fold; the page's main region keeps the full size.
- A long title wraps (balanced); the reference wraps at its spaces.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; actions are medium Buttons (40 px) or small in compact regions (32 px), at least 24 × 24 CSS px and `--space-3` apart.

## Accessibility

### Role and pattern

A generic container with a real heading at the level the region needs (`h2` in a page's main area, `h3` in a card). No landmark and no ARIA role on the host. A state that replaces content after an action is announced through the component's own live region (`status`).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | The icon, title, text and reference are not focusable; Tab reaches the primary action, then the secondary. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate a button action; Enter follows a link action. |

### Focus

- An empty state that appears on page load never moves focus.
- After a filter change that empties the list, or a retry that fails, focus stays on the control Maya used ("Show braiders" closes its dialog and returns focus to "Filters"; "Try again" keeps focus while busy and after).
- A success state that replaces a form moves focus to its heading (`focusOnRender`), so the confirmation is read. An error page reached by client-side navigation does the same (error-page CRD).

### Labelling

The icon is `aria-hidden`; the title carries the meaning and never relies on the tint: "We couldn’t load…" says it is an error. The reference is plain text labelled "Reference:".

### Announcements

The status span exists from the first render. When `status` is set, the component writes it into the span after the first render (and on every later change), so it is announced once even when the empty state has just replaced the list: politely with `statusRole="status"`, assertively with `alert`.

### Motion

None. The empty state appears in place without an entrance animation, so it never delays the action. A busy "Try again" shows Button's spinner, which keeps turning under reduced motion.

## Content and internationalisation

- **Title** names the specific thing: "No appointments yet", "No braiders match these filters", "We couldn’t load the style gallery". Never "Nothing here yet".
- **First-run formula:** title "No [things] yet" or what is missing; text says when they will appear or how to get one; action is the verb that makes one.
- **No-results formula:** title names the filter problem; text suggests the one change most likely to help; action "Clear filters".
- **Error formula:** title "We couldn’t [verb] [thing]"; text says what is safe and what to try ("Your details are safe."); action "Try again", secondary a safe place ("Explore styles").
- **Success:** a request, not a booking, until the braider accepts: "Request sent to Nia", never "Appointment booked".
- Use the cast: "Nia’s first reviews will appear here…", not "This braider has no reviews". Never blame Maya; never "Oops".
- Translatable inputs: `heading`, `text`, `reference` label, `status`, the projected action labels. Data values: braider names, the style, the reference id and its time ("Sat 10 Oct, 9:42 am"). The product is English-only today; longer titles wrap.

## Performance

- Change detection: `OnPush`, signal inputs; the heading tag is chosen by `@switch` on `headingLevel`; no work in the template.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/EmptyState.ts` renders the style gallery error: `variant="error"`, "We couldn’t load the style gallery", its sentence, the alert-circle icon, a primary "Try again" button and a secondary "Explore styles" link; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: `ErrorPage` (error-page CRD) composes it.
- Regression rule: a change to its template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: static; the busy state changes nothing but the Button's paint.
- Weight: `@angular/core`; Buttons and icons arrive by projection. No CDK.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given Maya has no appointments, when My appointments finishes loading, then an `hp-empty-state.empty` shows a 64 px tinted circle with an `aria-hidden` calendar icon, an `h2.empty__title` "No appointments yet", the text "When you request a visit, you’ll find its status and details here." and one primary link "Explore styles" to the style gallery. (L2-018)
- **AC-2** Given no published styles, when the style gallery finishes loading, then its empty state "No styles to explore yet" is the only content in the results region and no style card or placeholder card is shown. (L2-001)
- **AC-3** Given no braider offers knotless braids, when matching braiders finishes loading, then the empty state reads "No braiders offer knotless braids yet" with the sentence "No braiders have listed this style near Toronto yet. Try another style." (L2-004)
- **AC-4** Given Maya has no notifications, when the notification centre finishes loading, then the empty state reads "No updates yet" with a bell icon and "Updates about requests and appointments will appear here." (L2-030)
- **AC-5** Given Nia's profile with no published reviews, when the "Customer reviews" card renders, then it holds a compact empty state: a 48 px circle, an `h3` "No reviews yet", "Nia’s first reviews will appear here after her next appointments.", no action, and no numeric rating, while the rest of the profile and "Request with Nia" stay usable. (L2-007)

### Variants

- **AC-6** Given a maximum price and distance that match no braider for knotless braids, when "Show braiders" completes, then the empty state "No braiders match these filters" with a search icon offers a `<button>` "Clear filters" as its only primary action, while the active filters remain visible above it. (L2-005)
- **AC-7** Given a style search that matches nothing, when results finish, then the gallery's no-results state offers "Clear filters" and the search term stays in the search box. (L2-002)
- **AC-8** Given a filter on My appointments that matches nothing, when it is applied, then the no-results state "No appointments match these filters" offers "Clear filters" and is distinct from the first-run "No appointments yet". (L2-018)
- **AC-9** Given the style gallery fails to load, when the error renders, then the host has `.empty.empty--error`, the icon sits on a `--color-danger-bg` circle in `--color-danger-icon`, the title reads "We couldn’t load the style gallery", the text ends "Your details are safe.", the primary action is the `<button>` "Try again" and the secondary is the link "Explore styles". (L2-036)
- **AC-10** Given the Help page fails to load, when its error renders, then it offers "Try again" and a safe link out, and no help topic copy is shown. (L2-032)
- **AC-11** Given the Terms of use page fails to load, when its error renders, then the error state "We couldn’t load the terms of use" appears and no illustrative policy text is shown as if it were the terms. (L2-033)
- **AC-12** Given Maya sends request HP-1048, when the booking request succeeds, then the form is replaced by "Request sent to Nia", "This is a request, not a confirmed appointment. Nia will reply with the final time and price." and a primary link "View appointment" to the HP-1048 detail. (L2-017)
- **AC-13** Given Maya posts her review of the 3 Oct visit, when it succeeds, then the form is replaced by "Your review is posted" with a check icon on the default tint. (L2-025)
- **AC-14** Given Maya saves changed account details, when the save succeeds, then "Your changes are saved" replaces the form; and when the save has not succeeded yet, then no success empty state is rendered. (L2-014)
- **AC-15** Given a reset is requested for any syntactically valid email, when the request completes, then the success state reads "Check your inbox" and "If this email belongs to an account, a reset link is on its way." whether or not an account exists. (L2-012)

### States

- **AC-16** Given the gallery error, when Maya activates "Try again", then the host has `aria-busy="true"`, "Try again" shows its busy state and keeps focus, and activating it again starts no second request. (L2-036)
- **AC-17** Given the retry fails again, when the consumer sets `status` with `statusRole="alert"`, then "We couldn’t load the style gallery" is announced once, assertively, and focus is still on "Try again". (L2-041)
- **AC-18** Given the filter dialog's "Show braiders" returns no results, when the no-results state replaces the grid with `status` set to its title, then a screen reader announces "No braiders match these filters" once, politely, and focus returns to "Filters", not to the empty state. (L2-035)
- **AC-19** Given the booking request success renders with `focusOnRender`, when it appears, then focus moves to the heading "Request sent to Nia", which has `tabindex="-1"` and is read by the screen reader. (L2-041)

### Keyboard and focus

- **AC-20** Given the gallery error, when Maya presses Tab through the main region, then focus skips the icon, title and text and lands on "Try again" and then "Explore styles", each with the shared focus ring. (L2-041)

### Theming

- **AC-21** Given the default, error and warning variants, when the theme switches from light to dark, then the circles change to plum 950, red 950 and amber 950 with plum 300, red 300 and amber 300 icons without a reload, and each icon keeps a contrast of at least 3:1 against its circle. (L2-042)
- **AC-22** Given the gallery error on the page and the reviews empty state in a card, when contrast is measured in both themes, then the title is at least 4.5:1 and the text at least 4.5:1 against `--color-bg-canvas` and `--color-bg-surface`. (L2-041)

### Responsive

- **AC-23** Given the gallery error on a 320 px viewport, when it renders, then "Try again" and "Explore styles" sit on two centred rows, the title is 22 px and wraps, and the page does not scroll horizontally; from 768 px the title is 28 px. (L2-042)
- **AC-24** Given a 360 px viewport with text enlarged to 200 %, when the gallery error renders, then the title, text and both actions are fully visible, wrapped, and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-25** Given `prefers-reduced-motion: reduce` and a retry in progress, when the error state renders, then it has no entrance animation and the busy "Try again" keeps its turning spinner. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/empty-state/`; file `empty-state.ts` exporting the standalone component `EmptyState` with `selector: 'hp-empty-state'`, `changeDetection: OnPush`, exported from `public-api.ts`.
- Host bindings: `class.empty` always; `class.empty--error`, `class.empty--warning`, `class.empty--compact`, `class.empty--stack-actions`; `attr.aria-busy` (`'true'` or null). `:host { display: flex; }` comes from the ported `.empty` rule as `:host`.
- Template: `<div class="empty__icon" aria-hidden="true"><ng-content select="[slot=icon]" /></div>`, the heading by `@switch (headingLevel())` with `[attr.tabindex]="focusOnRender() ? -1 : null"`, `@if (text())` paragraph, `<div class="empty__actions"><ng-content select="[slot=actions]" /></div>`, `@if (reference())` paragraph, then `<span class="visually-hidden" [attr.role]="statusRole()" #live></span>`.
- Styles port `.empty*` from `docs/design-system/assets/components.css` as `:host` rules, including the product rules for the stacked actions (D-6: mobile-first `.empty--stack-actions .empty__actions { flex-direction: column; align-self: stretch; }`, reset to `row` and `auto` from `min-width: 40rem`, so its Buttons are full width below it), `.empty__actions:empty { display: none; }`, the icon sizing `.empty__icon .icon { width: 1.5rem; height: 1.5rem; }` and `.empty--compact .empty__icon .icon { width: 1.25rem; height: 1.25rem; }` (D-4), and `@media (forced-colors: active) { .empty__icon { border: var(--border-width-hairline) solid CanvasText; } }` (D-11).
- Live region (D-5): an `effect` on `status` writes `live.textContent` inside `afterNextRender`, clearing it first so a repeated message is announced again.
- Focus: when `focusOnRender`, `afterNextRender(() => heading.focus())`.
- Composes nothing; Buttons and icons are projected. No CDK.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/EmptyState.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *The mocks use "Nothing here yet", text glyphs (✦ ! ⌕ ✓), lower-case generated titles ("We couldn’t load nia’s profile") and `<a class="btn">` for "Try again". Which wins?* The design system: screen-specific titles, SVG icons that are `aria-hidden`, the error formula with proper names, and "Try again" as a `<button>` because it retries in place (button D-10). The empty-state page and the empty-and-error-states pattern record all of these as drift fixed during extraction, and the mocks now follow them.
- **D-2** *Element selector, or an attribute selector on a native `<section>`?* The element selector `hp-empty-state`, carrying `.empty` on the host. It is a composite of six parts; no parent rule in `components.css` targets `section.empty`; and an unnamed `<section>` is not a landmark, so the native element adds no semantics the host lacks. The design system's `<section>` markup becomes `<hp-empty-state>` with the same classes.
- **D-3** *Is the title a heading, and at which level?* Always a heading, at the level the region needs, set by `headingLevel`: the design system requires "a real heading at the right level for its region", and its own examples use paragraphs only to keep the documentation page's outline.
- **D-4** *Who sizes the icon?* The component, by size: 24 px in full (the design system's `icon--lg`) and 20 px in compact, whatever modifier the projected icon carries, so a consumer cannot put a 20 px icon in a 64 px circle.
- **D-5** *How is a state that replaces content announced reliably?* Through the component's own live region, written after the first render. A region inserted together with its text is often not announced; writing the text afterwards, and only when the page asks (`status`), makes the announcement reliable without announcing every empty state that appears on page load.
- **D-6** *Do actions go full width on phones?* Only when the page asks, through `stackActions`. The design system says a single primary action "may" be full width when the empty state fills the screen, and the error page requires stacked, full-width actions on phones; a region inside a card keeps the wrapped, centred actions, which measured at 320 px fit on two centred rows. `components.css` carries `.empty--stack-actions`: below `--layout-breakpoint-sm` (640 px) `.empty__actions` becomes a stretched column.
- **D-7** *The first empty braider profile mock replaced the whole page and offered "Explore styles". Which wins?* The design system and L2-007: the portfolio card shows a compact "No portfolio photos yet" while the rest of the profile stays usable, and the action continues the task ("Request with Nia").
- **D-8** *The first empty style gallery's action "Explore styles" led back to the same gallery. What does it offer instead?* "Browse braiders", the next step its own sentence names ("Check back shortly or browse braiders"), following the design system's rule that the action moves the person forward.
- **D-9** *The design system's permission example reads "This appointment belongs to another account". May a page use it?* No. L2-037 requires the access-unavailable response not to reveal whether another customer's appointment exists, and this title says that it does. Permission states use the error page's forbidden copy, whose wording is recorded in error-page D-3 (needs product confirmation).
- **D-10** *Is there a success variant with the success tint, as the design system's theming example sketches?* No. The variants list and every mock render success on the default accent tint with a check icon, and `components.css` has no `.empty--success` (its earlier theming snippet was removed with this decision); the empty-state page says there is no success tint.
- **D-11** *Forced colours remove the icon circle's fill. Does the icon float alone?* The circle keeps a `CanvasText` hairline outline under `(forced-colors: active)`, a rule in `components.css`, so the icon still sits in its circle; the title carries the meaning either way.

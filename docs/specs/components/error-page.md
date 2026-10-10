# Error page

| Field | Value |
|---|---|
| Selector | `hp-error-page` |
| Library path | `frontend/projects/components/src/lib/error-page/` |
| Status | planned |
| Traces to | L2-003, L2-007, L2-019, L2-029, L2-036, L2-037, L2-041, L2-042, L2-044, L2-045 |
| Design system | [`error-page.html`](../../design-system/components/error-page.html) |
| Source mocks | [`pages/not-found/default`](../../mocks/pages/not-found/default.html), [`pages/forbidden/default`](../../mocks/pages/forbidden/default.html), [`pages/server-error/default`](../../mocks/pages/server-error/default.html), [`pages/offline/default`](../../mocks/pages/offline/default.html) |
| Rendering | [`error-page.html`](error-page.html) |

## Purpose and scope

An error page replaces the page content, not the page, when a whole page cannot be shown: the address does not exist, this account cannot open it, HairPop failed, or the device is offline. The top bar, navigation and footer stay, so Maya can still go anywhere. Inside the main region it is a full-size [empty state](empty-state.md) whose title is the page's only `h1`, with one sentence on what happened and what is safe, and one recovery action: "Explore styles", "Sign in" or "Try again". A server error also shows a reference support can find.

Use something else when:

- only a region failed (the gallery list, Nia's reviews): an error empty state or a warning alert in that region, inside the normal page;
- the device is offline but the page has saved content to show (an appointment Maya opened before): the page shows its content under an offline banner (alert CRD); the offline error page is for a page with nothing saved.

Out of scope:

- Choosing the page. The router and the API layer decide which kind applies (unknown route, 403 or 404 response, 5xx, no connection) and render this component in the shell's main region.
- The HTTP status of a server-rendered response (404, 403, 500) and the document title ("Page not found — HairPop"): the route configuration and the SSR server set them.
- The shell itself: skip link, top bar, navigation, footer and their responsive rules.
- What "Try again" does: the page re-reads the failed route. The component never repeats a state-changing request (L2-037, L2-044).
- Offline caching of appointment summaries (L2-045) and the "Back online" message after recovery.

## Usage

The four `default` mocks. These screens have no `loading` or `error` mock; the manifest marks both not applicable (D-4).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/not-found/default`: unknown routes, unknown or unpublished styles (L2-003) and braiders (L2-007), notification links to destinations that no longer exist (L2-029) | `kind="not-found"`: default tint, search icon | h1 "We couldn’t find that page"; "The link may be old, or the address may have changed."; primary link "Explore styles" | default, action focused | canvas, in the shell |
| `pages/forbidden/default`: another customer's appointment, and an unknown appointment reference (L2-019, L2-037) | `kind="forbidden"`: warning tint, lock icon | h1 "You can’t open this page"; "Sign in with the account you use for your appointments." (D-3); primary link "Sign in" | default, focused | canvas; top bar shows "Sign in" or "Maya" |
| `pages/server-error/default` (L2-037, L2-044) | `kind="server-error"`: error tint, alert-circle icon, `reference` | h1 "HairPop needs a moment"; "We couldn’t load this page. Your booking request has not been resent."; primary `<button>` "Try again" (`busy` while retrying); secondary link "Contact support"; reference "Reference: HP-ERR-7F3K2Q · Sat 10 Oct, 9:42 am" | default, focused, retrying, retry failed, recovered (the page loads in place) | canvas |
| `pages/offline/default` (L2-036, L2-045) | `kind="offline"`: warning tint, wifi-off icon | h1 "You’re offline"; "Saved appointment details remain available. Requests need a connection."; primary `<button>` "Try again" (`busy` while retrying); secondary link "View saved appointments" | default, focused, retrying, still offline, recovered | canvas |
| `loading` and `error` for the four error pages | not applicable: an error page is a static response (D-4) | — | — | — |

Every row is buildable with the API below: four kinds, heading and text inputs, an optional reference, an actions slot for Buttons, and the retry inputs passed to the empty state.

## Anatomy

1. **Product shell (not this component)** — skip link, `header.topbar`, `nav`, `main#main.container.product-main`, `footer`. Kept on every error page.
2. **Host** — `hp-error-page`, `display: block`, the only child of the main region.
3. **Empty state** — an `hp-empty-state` in full size with the kind's variant: `.empty` (not found), `.empty.empty--warning` (forbidden, offline), `.empty.empty--error` (server error).
4. **Icon** — rendered by the component for the kind: search, lock, alert-circle or wifi-off, 24 px, `aria-hidden`.
5. **Heading** — `<h1 class="empty__title" tabindex="-1">`, the page's only `h1`.
6. **Sentence** — `.empty__text`: what happened and what is safe.
7. **Recovery actions** — `.empty__actions`: one primary Button, and a secondary only for server error and offline. Stacked at full width on phones (D-5).
8. **Reference (server error)** — `.empty__reference`, selectable text for support.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `kind` | `'not-found' \| 'forbidden' \| 'server-error' \| 'offline'` | — | yes | Sets the variant and icon: not-found → default and search; forbidden → warning and lock; server-error → error and alert-circle; offline → warning and wifi-off. |
| `heading` | `string` | — | yes | The `h1` text, plain words, no codes: "We couldn’t find that page", "You can’t open this page", "HairPop needs a moment", "You’re offline". |
| `text` | `string` | — | yes | One sentence on what happened and what is safe. |
| `reference` | `string \| null` | `null` | no | Server error only: the full reference line, "Reference: HP-ERR-7F3K2Q · Sat 10 Oct, 9:42 am". Ignored for the other kinds. |
| `busy` | `boolean` (`booleanAttribute`) | `false` | no | Passed to the empty state while "Try again" is working. The Button's own `busy` is set by the page. |
| `status` | `string \| null` | `null` | no | Passed to the empty state's live region: the message announced after a retry fails ("You’re still offline"). |
| `statusRole` | `'status' \| 'alert'` | `'alert'` | no | Passed to the empty state. A failed retry is an action Maya took that failed, so the default is `alert`. |

- Inputs are signal inputs. Every string is an input or projected content; the component renders no copy of its own.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | The recovery actions are Buttons the page projects and binds. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| `[slot=actions]` | One primary `a[hp-button]` or `button[hp-button]`; for server error and offline, one secondary `a[hp-button]` after it | Declared once and re-projected into the empty state's actions. "Try again" is a `<button>`; "Explore styles", "Sign in", "Contact support" and "View saved appointments" are links. |

## Variants and sizes

| Variant (`kind`) | Empty-state modifier | Icon | Recovery |
|---|---|---|---|
| Not found (404) | — (accent tint, so a wrong link does not feel like a failure) | search | "Explore styles" |
| Forbidden (403) | `.empty--warning` | lock | "Sign in" |
| Server error (500) | `.empty--error` | alert-circle | "Try again", secondary "Contact support", plus the reference |
| Offline | `.empty--warning` | wifi-off | "Try again", secondary "View saved appointments" |

One size: the empty state's full size inside the main region. Compact is for regions inside a page, never for an error page.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default (full page load) | the server renders the error route | The empty state under the top bar, rendered in the first paint | Focus starts at the top of the document as on any page |
| Default (client-side navigation) | a route resolves to an error page in the running app | Same | Focus moves to the `h1`, which is read |
| Action focused | `:focus-visible` on a Button | Shared focus ring | — |
| Retrying | the page sets `busy` and the "Try again" Button's `busy` | Button's busy ring | `aria-busy="true"` on the empty state and the Button; focus stays on "Try again" |
| Retry failed | the page sets `status` | Unchanged | The message is announced assertively; focus stays on "Try again" |
| Recovered | the retry succeeds | The requested page replaces the error page in place | The new page's heading takes focus (router behaviour) |
| Dark theme | `[data-theme="dark"]` | The kind's deep tint (plum, red or amber 950) | — |

An error page has no loading, empty or nested error state of its own (D-4).

## Markup

Rendered DOM inside the shell. Classes and attributes are the e2e contract.

```html
<!-- rendered: not found -->
<main id="main" class="container product-main">
  <hp-error-page>
    <hp-empty-state class="empty empty--stack-actions">
      <div class="empty__icon" aria-hidden="true"><svg class="icon icon--lg" aria-hidden="true" viewBox="0 0 24 24"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4"/></svg></div>
      <h1 class="empty__title" tabindex="-1">We couldn’t find that page</h1>
      <p class="empty__text">The link may be old, or the address may have changed.</p>
      <div class="empty__actions"><a class="btn btn--primary" href="/">Explore styles</a></div>
      <span class="visually-hidden" role="alert"></span>
    </hp-empty-state>
  </hp-error-page>
</main>
```

```html
<!-- rendered: server error, with reference -->
<hp-error-page>
  <hp-empty-state class="empty empty--error empty--stack-actions">
    <div class="empty__icon" aria-hidden="true"><svg class="icon icon--lg" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5v5M12 16v.01"/></svg></div>
    <h1 class="empty__title" tabindex="-1">HairPop needs a moment</h1>
    <p class="empty__text">We couldn’t load this page. Your booking request has not been resent.</p>
    <div class="empty__actions">
      <button class="btn btn--primary" type="button">Try again</button>
      <a class="btn" href="/help?reference=HP-ERR-7F3K2Q">Contact support</a>
    </div>
    <p class="empty__reference">Reference: HP-ERR-7F3K2Q · Sat 10 Oct, 9:42 am</p>
    <span class="visually-hidden" role="alert"></span>
  </hp-empty-state>
</hp-error-page>
```

```html
<!-- rendered: forbidden and offline differ in the modifier, icon, copy and actions -->
<hp-empty-state class="empty empty--warning empty--stack-actions">… lock icon … <h1 class="empty__title" tabindex="-1">You can’t open this page</h1> …
  <div class="empty__actions"><a class="btn btn--primary" href="/sign-in">Sign in</a></div> …</hp-empty-state>
<hp-empty-state class="empty empty--warning empty--stack-actions" aria-busy="true">… wifi-off icon … <h1 class="empty__title" tabindex="-1">You’re offline</h1> …
  <div class="empty__actions"><button class="btn btn--primary" type="button" aria-busy="true">Try again</button><a class="btn" href="/appointments">View saved appointments</a></div> …</hp-empty-state>
```

Every error page's empty state carries `.empty--stack-actions` (empty-state `stackActions`, D-5).

Consumer templates:

```html
<!-- consumer: the not-found route -->
<hp-error-page kind="not-found" heading="We couldn’t find that page"
  text="The link may be old, or the address may have changed.">
  <a hp-button slot="actions" variant="primary" routerLink="/">Explore styles</a>
</hp-error-page>

<!-- consumer: server error -->
<hp-error-page kind="server-error" heading="HairPop needs a moment"
  text="We couldn’t load this page. Your booking request has not been resent."
  [reference]="referenceLine()"
  [busy]="retrying()" [status]="retryFailed() ? 'HairPop still needs a moment. Try again shortly.' : null">
  <button hp-button slot="actions" variant="primary" [busy]="retrying()" (click)="reloadRoute()">Try again</button>
  <a hp-button slot="actions" routerLink="/help" [queryParams]="{ reference: error.reference }">Contact support</a>
</hp-error-page>
```

## Design

- The component adds no tokens and no styles of its own beyond `:host { display: block; }`; it inherits the shell and the empty state's tokens.
- Spacing: the shell's `.product-main` padding (`--space-6` then `--space-8` from 768 px above, `--space-12` below) and the empty state's full padding (`--space-12` `--space-6`).
- Reference: `--text-code` at `--font-size-xs` in `--color-fg-subtle`, selectable.
- Motion: none beyond the shell; the page does not animate in.

Component tokens: none of its own. The empty state's `--empty-icon-bg` and `--empty-icon-fg` carry the kind's tint.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Page background | `--color-bg-canvas` | `--palette-gray-50` | `--palette-gray-950` |
| 404 icon circle and icon | `--color-accent-subtle`, `--color-fg-accent` | `--palette-plum-50`, `--palette-plum-700` | `--palette-plum-950`, `--palette-plum-300` |
| 403 and offline icon circle and icon | `--color-warning-bg`, `--color-warning-icon` | `--palette-amber-50`, `--palette-amber-500` | `--palette-amber-950`, `--palette-amber-300` |
| 500 icon circle and icon | `--color-danger-bg`, `--color-danger-icon` | `--palette-red-50`, `--palette-red-500` | `--palette-red-950`, `--palette-red-300` |
| Heading | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Sentence | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Reference | `--color-fg-subtle` | `--palette-gray-500` | `--palette-gray-400` |

Contrast pairs, from the design-system page and `tokens/contrast-pairs.json`:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Heading on the page |
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Sentence on the page |
| `--color-fg-subtle` | `--color-bg-canvas` | 4.5:1 | Reference on the page |
| `--color-fg-accent` | `--color-accent-subtle` | 3:1 | 404 icon on its tint |
| `--color-warning-icon` | `--color-warning-bg` | 3:1 | 403 and offline icon on its tint |
| `--color-danger-icon` | `--color-danger-bg` | 3:1 | 500 icon on its tint |

## Responsive behaviour

- The shell behaves as on every page: the top-bar links collapse into the menu below 768 px; the footer wraps.
- The empty state centres in `.product-main` with its full padding; the title is 22 px below 768 px and 28 px from 768 px.
- Below 640 px the recovery actions stack at the empty state's full content width, primary first; from 640 px they sit side by side and centred (D-5).
- The reference wraps at its spaces rather than overflowing; measured at 320 px it takes two lines, and with text at 200 % on a 360 px viewport it wraps further without horizontal scrolling.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; the recovery action is at least 40 px tall.

## Accessibility

### Role and pattern

A normal page: skip link, `header`, `nav`, `main` and `footer` landmarks, and one `<h1 class="empty__title">`. The mocks' page header that repeated the title as a second heading is not rendered (D-2).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skip link, top bar, then the recovery action and the secondary action, then the footer. The icon, heading, sentence and reference are not in the Tab order. |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Activate "Try again"; Enter follows a link action. |

### Focus

- Full page load (server-rendered, the session's first navigation): focus is not moved; it starts at the top of the document, so the skip link comes first.
- Client-side navigation that resolves to an error page: focus moves to the `h1` (`tabindex="-1"`) after render, so the change is announced.
- After "Try again" fails: focus stays on "Try again" and the page's `status` message is announced.

### Labelling

The icon is `aria-hidden`; the heading carries the meaning. The reference is plain text that starts with "Reference:". The sentence never relies on the tint.

### Announcements

Arrival is announced by focusing the `h1` (client-side) or by the page load. A failed retry is announced through the empty state's live region, assertively by default.

### Motion

None of its own. "Try again" shows Button's busy spinner, which keeps turning under reduced motion.

## Content and internationalisation

- Heading in plain words, no status codes: "We couldn’t find that page", "You can’t open this page", "HairPop needs a moment", "You’re offline".
- One sentence on what happened and what is safe: "Your booking request has not been resent.", "Saved appointment details remain available. Requests need a connection."
- One recovery action: "Explore styles", "Sign in", "Try again". "Contact support" only for a server error; "View saved appointments" only offline.
- Never blame the person ("You typed the wrong address"); never show a stack trace or a raw status code.
- The forbidden page never says whether the requested appointment exists (D-3).
- A server error shows "Reference:" with an id and the local time support can find: "Reference: HP-ERR-7F3K2Q · Sat 10 Oct, 9:42 am" (Toronto time, the product's date and time format).
- Translatable inputs: `heading`, `text`, the reference label, `status`, the projected action labels. Data values: the reference id and time. The product is English-only today; longer copy wraps.

## Performance

- Change detection: `OnPush`, signal inputs; the kind's variant and icon are `computed`.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/ErrorPage.ts` renders the server error with Maya's reference: "HairPop needs a moment", its sentence, "Try again", "Contact support" and "Reference: HP-ERR-7F3K2Q · Sat 10 Oct, 9:42 am"; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: it is itself a composite of `EmptyState`.
- Regression rule: a change to its template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: a static response rendered in the first paint; nothing loads after it.
- Weight: `@angular/core`, `@angular/router` (to tell the first navigation from later ones), the empty-state and icon components. No CDK.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given the unknown route `/styles/box-braids-xl`, when it is opened, then the top bar, navigation and footer remain, and the main region holds an `hp-error-page` whose `.empty` has a search icon on the accent tint, the `h1` "We couldn’t find that page", the sentence "The link may be old, or the address may have changed." and one primary link "Explore styles" to the style gallery. (L2-037)
- **AC-2** Given an unpublished or unknown style identifier, when its detail is requested, then the not-found page appears and no draft style content is in the document. (L2-003)
- **AC-3** Given an unknown or unpublished braider, when the profile is requested, then the not-found page appears and none of the braider's private details are in the document. (L2-007)
- **AC-4** Given Maya is signed in and opens another customer's appointment, when the forbidden page appears, then it has `.empty--warning`, a lock icon, the `h1` "You can’t open this page", the sentence "Sign in with the account you use for your appointments." and a primary link "Sign in", and no text says whether that appointment exists. (L2-037)
- **AC-5** Given Maya opens an appointment reference that does not exist, when the page appears, then its main region is identical to the page for another customer's appointment and no appointment data is in the document. (L2-019)
- **AC-6** Given a notification whose appointment can no longer be opened, when Maya opens it, then she lands on the matching error page, not on another customer's data or a blank screen. (L2-029)
- **AC-7** Given the booking submission for HP-1048 returned a server error, when the server-error page appears, then it has `.empty--error`, an alert-circle icon, the `h1` "HairPop needs a moment", the sentence "We couldn’t load this page. Your booking request has not been resent.", a primary `<button>` "Try again", a secondary link "Contact support", and the line "Reference: HP-ERR-7F3K2Q · Sat 10 Oct, 9:42 am" in `.empty__reference`; and rendering it sends no request. (L2-037)
- **AC-8** Given the server-error page after a failed booking submission, when Maya activates "Try again", then only the page's read is repeated, the booking request is not resent, and "Try again" shows its busy state and keeps focus until the read settles. (L2-044)
- **AC-9** Given the device is offline and the page has nothing saved, when the offline page appears, then it has `.empty--warning`, a wifi-off icon, the `h1` "You’re offline", the sentence "Saved appointment details remain available. Requests need a connection.", a primary `<button>` "Try again" and a secondary link "View saved appointments". (L2-036)
- **AC-10** Given the offline page, when Maya activates "Try again" while still offline, then the page stays, no request or success is claimed, focus stays on "Try again", and the page's `status` "You’re still offline" is announced assertively once. (L2-045)
- **AC-11** Given an error route opened directly, when the first paint arrives, then the error page is already rendered, with no skeleton, no loading state and no nested "We couldn’t load…" state. (L2-037)

### Keyboard and focus

- **AC-12** Given the not-found page, when Maya presses Tab from the top of the document, then focus moves to the skip link, through the top bar, to "Explore styles" and then to the footer links, never to the icon, heading or sentence. (L2-041)
- **AC-13** Given Maya follows an in-app link to a removed style, when the route resolves to the not-found page, then focus moves to the `h1` "We couldn’t find that page" (`tabindex="-1"`) and a screen reader reads it. (L2-041)
- **AC-14** Given the not-found page is the first page of the session, loaded from the server, when it renders, then focus is not moved and the next Tab lands on the skip link. (L2-041)

### Screen readers

- **AC-15** Given any of the four error pages, when its heading outline is read, then it has exactly one `h1`, which is the error title, and the skip link, `header`, `nav`, `main` and `footer` landmarks are present. (L2-041)

### Theming

- **AC-16** Given the not-found, forbidden, server-error and offline pages, when the theme switches from light to dark, then their circles change to plum 950, amber 950, red 950 and amber 950 without a reload, and heading, sentence and reference each keep at least 4.5:1 against `--color-bg-canvas`. (L2-042)
- **AC-17** Given each kind in both themes, when the icon contrast is measured, then the search, lock, alert-circle and wifi-off icons are each at least 3:1 against their circle. (L2-041)

### Responsive

- **AC-18** Given the server-error page on a 320 px viewport, when it renders, then "Try again" and "Contact support" are stacked, each as wide as the empty state's content, "Try again" first, the reference wraps onto two lines, and the page does not scroll horizontally. (L2-042)
- **AC-19** Given the offline page on a 360 px viewport with text enlarged to 200 %, when it renders, then the heading, sentence and both actions are fully visible and the page does not scroll horizontally. (L2-042)
- **AC-20** Given the server-error page at 768 px and 1280 px, when it renders, then the two actions sit side by side, centred, and the title is 28 px. (L2-042)

### Motion

- **AC-21** Given `prefers-reduced-motion: reduce` and a retry in progress on the offline page, when it renders, then the page has no entrance animation and the busy "Try again" keeps its turning spinner. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/error-page/`; file `error-page.ts` exporting the standalone component `ErrorPage` with `selector: 'hp-error-page'`, `changeDetection: OnPush`, exported from `public-api.ts`.
- Template: `<hp-empty-state [variant]="variant()" size="full" [headingLevel]="1" [heading]="heading()" [text]="text()" [reference]="kind() === 'server-error' ? reference() : null" [busy]="busy()" [status]="status()" [statusRole]="statusRole()" [focusOnRender]="focusHeading" stackActions><svg hp-icon slot="icon" size="lg" [name]="icon()"></svg><ng-container ngProjectAs="[slot=actions]"><ng-content select="[slot=actions]" /></ng-container></hp-empty-state>`.
- `focusHeading` is true unless this is the session's first navigation: inject `Router` and read whether a previous successful navigation exists when the component is created.
- Composes `EmptyState` (this group) and the icon component (`svg[hp-icon]` with a `name` input, iconography CRD). Icon paths: search, lock, alert-circle, wifi-off from the iconography foundation.
- The route layer, not this component, sets the document title and the SSR response status, and renders the same forbidden page for unknown and other-customer appointment references (D-3).
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/ErrorPage.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *The first error-page mocks used the ✦ glyph and the accent tint, and the 500 mock had no reference. Which wins?* The design system: an icon and tint per cause (404 accent, 403 and offline warning, 500 danger) and `.empty__reference` on the 500 page, recorded as drift fixed during extraction.
- **D-2** *The first mocks repeated the title as a page-header `h1` and an empty-state `h2`. How many headings?* One: the empty-state title is the page's only `h1`, as the design system records. A repeated heading reads twice and splits the outline.
- **D-3** *The forbidden copy "Sign in with the account used for this appointment." (mock and design system) and the design system's permission example "This appointment belongs to another account" both tell Maya that the appointment exists. L2-037 says the access-unavailable page must not reveal whether another customer's appointment exists. Which copy?* The heading stays "You can’t open this page"; the sentence becomes "Sign in with the account you use for your appointments.", which presupposes nothing about the requested appointment, and an unknown appointment reference renders the same page so the two cases cannot be told apart. (needs product confirmation)
- **D-4** *The not-found, forbidden, server-error and offline mocks each had `loading` and `error` states, and L2-035 asks pages to implement the applicable states the manifest lists. Does the error page implement them?* No. The design system drops them as drift: an error page is a static response with nothing to load and nothing that can fail, so those states are not applicable in L2-035's sense, and a "We couldn’t load page not found" state would be an error about an error. The mocks drop them and the manifest marks them not applicable.
- **D-5** *Do the recovery actions go full width on phones?* Yes. The design system's error page states it twice (responsive: "on phones its actions stack"; touch: "full width on phones when it is the only action"). Below 640 px (`--layout-breakpoint-sm`) the actions stack at the empty state's full content width, primary first, through the empty state's `stackActions` input; from 640 px they sit side by side and centred.
- **D-6** *Should the component set the HTTP status and the document title?* No. They belong to the route configuration and the SSR server, which know the response; the component renders the same DOM on the server and in the browser.
- **D-7** *How does the component tell a full page load from client-side navigation?* By asking the router whether a previous successful navigation exists. A full load keeps focus at the top so the skip link is first; a client-side navigation moves focus to the `h1`, as the design system requires.
- **D-8** *Element selector or attribute selector?* The element selector `hp-error-page`: it is a composite (it renders an empty state, an icon and a heading) and no parent rule targets it; the main region is the shell's.
- **D-9** *Do the stacked actions fit when text is enlarged?* Only because Button's labels wrap (button D-5). Measured on a 360 px viewport with text at 200 %: with today's non-wrapping `.btn`, "View saved appointments" pushed both stacked offline actions to 545 px and the page scrolled horizontally; with the wrapping label the column stays inside the 200 px content box. The error page relies on that Button requirement and adds no rule of its own.

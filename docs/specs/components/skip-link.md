# Skip link

| Field | Value |
|---|---|
| Selector | `a[hp-skip-link]` |
| Library path | `frontend/projects/components/src/lib/skip-link/` |
| Status | planned |
| Traces to | L2-041, L2-042 |
| Design system | [`skip-link.html`](../../design-system/components/skip-link.html) |
| Source mocks | [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`pages/sign-in/default`](../../mocks/pages/sign-in/default.html), [`pages/booking-request/default`](../../mocks/pages/booking-request/default.html), [`pages/not-found/default`](../../mocks/pages/not-found/default.html), [`dialogs/cancel-appointment/default`](../../mocks/dialogs/cancel-appointment/default.html), [`notifications/booking-update/info`](../../mocks/notifications/booking-update/info.html) |
| Rendering | [`skip-link.html`](skip-link.html) |

## Purpose and scope

The skip link is the first thing a keyboard or switch user reaches on every HairPop screen. It stays off-screen until it receives keyboard focus, then appears in the top-left corner over the top bar; activating it moves focus to the page's `<main id="main">`, skipping the brand, the four primary links, Updates and the account link (WCAG 2.4.1 Bypass Blocks). There is one per page, always "Skip to content"; a second one ("Skip to results") is allowed only in front of a very long filter area and names its own target.

Use something else when:

- the link goes to another page or to a section a sighted customer would also use: use the link component ([`link.md`](link.md));
- an error summary item moves focus to a field: the form summary owns that, with a link component item.

Out of scope:

- The `<main id="main">` landmark itself, its heading and its content. The application shell renders them; this component only finds the target by id.
- Making the page inert behind a modal dialog. The dialog does that for the whole application root, which contains the skip link (D-5).
- Route-change focus management (moving focus to the new page's heading after navigation). That is the shell's rule; the skip link only acts when activated.
- Print styles: the stylesheet hides `.skip-link` in print; nothing in the component changes that.

## Usage

The skip link appears on all 170 mocks (every page, every dialog's underlying page, every notification's underlying page) with the same configuration. Grouped:

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Every product page (`pages/style-gallery`, `style-detail`, `matching-braiders`, `braider-profile`, `booking-request`, `my-appointments`, `appointment-detail`, `care-and-review`, `notification-center`, `account-settings`, `help`, `terms`, `privacy`) in every state | `target` `main` (default), first focusable element | "Skip to content" | hidden, focused, hover, active | raised surface over the top bar |
| Auth pages (`pages/sign-in`, `sign-up`, `forgot-password`, `reset-password`, `verify-email`) | same | "Skip to content" | hidden, focused | raised surface over the top bar |
| Error destinations (`pages/not-found`, `forbidden`, `server-error`, `offline`) | same | "Skip to content" | hidden, focused | raised surface over the top bar |
| Every dialog mock (`dialogs/*`) | same, inside the inert application root behind the dialog | "Skip to content" | not focusable while the dialog is open (D-5) | — |
| Every notification mock (`notifications/*`) | same; the toast region is not skipped to | "Skip to content" | hidden, focused | raised surface |
| Very long filter area (design system *Overview*; no mock yet) | second instance, `target="results"` | "Skip to results" | hidden, focused | raised surface |

Every row is buildable with the API below: projected label text and a `target` id.

## Anatomy

1. **Container** — `.skip-link` on the host `<a>`. Absolutely positioned at `left: --space-4`, off-screen at `top: calc(-1 * --space-24)` until focused, then `top: --space-4`. Raised surface, `--radius-md`, `--shadow-3`, padding `--space-2` by `--space-4`, layer `--z-tooltip`.
2. **Label** — the projected text, `--text-label` in `--color-fg-default`, no underline. It is the accessible name.
3. **Focus ring** — the shared `:focus-visible` outline around the container.

Host: the attribute selector makes the native `<a>` the host (D-1). The template is a single `<ng-content>`; the component adds the `href` and the activation handler.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `target` | `string` | `'main'` | no | The id of the element that receives focus, without `#`. Written to the host as `href="#{target}"`. On activation the element is looked up by id at that moment, so a target rendered after the skip link is found. |

- `target` is a signal input. The label is projected content; the component renders no copy.
- `aria-*` attributes are not needed and are never added; the text is the name.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | Activation moves focus; nothing for a consumer to react to. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Text | Declared once. "Skip to content", or "Skip to results" for a second instance. Never an icon. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Skip to content | — (`.skip-link`) | The first element of every page, targeting `main`. |
| Skip to a named region | — (`.skip-link`, other `target`) | A second skip link in front of a very long filter area: "Skip to results". |

`.skip-link--demo` exists only so documentation can show the link in flow; the component never renders it.

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One size | — | the label line plus padding: measured 39 px at default text size | `--space-2` by `--space-4` | `--text-label` (14 px semibold) |

Width comes from the label: measured 134 px for "Skip to content".

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Hidden (default) | — | Off-screen at `top: calc(-1 * --space-24)`; never `display: none` or `visibility: hidden` | In the accessibility tree; first link in the page's links list |
| Focused | `:focus-visible` | Slides to `top: --space-4`, `left: --space-4` over the top bar; raised surface, `--shadow-3`, focus ring | Announced as "Skip to content, link" |
| Hover | `:hover` (only after focus revealed it) | Label `--color-fg-link-hover`, still no underline | — |
| Active | `:active` | Same as hover | — |
| Activated | click or Enter | Returns off-screen as focus leaves; focus is on the target | The screen reader continues from the start of `main` |
| Target missing | no element with the `target` id | Focus stays on the skip link; development mode logs an error (D-6) | Unchanged |
| Inert | the page behind a modal dialog is inert | Not focusable, not in the accessibility tree | Hidden with the page |
| Forced colours | `(forced-colors: active)` | The browser paints the label `LinkText` on `Canvas`; the focus ring is `Highlight` | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Appears instantly: the `top` transition uses `--duration-fast`, which the tokens zero | — |
| Print | `@media print` | Not printed | — |

The skip link is never disabled, busy or invalid.

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: first element of the application root -->
<a class="skip-link" href="#main">Skip to content</a>
```

```html
<!-- rendered: second instance in front of a long filter area -->
<a class="skip-link" href="#results">Skip to results</a>
```

```html
<!-- rendered: the target after activation (attribute added by the component when it was missing) -->
<main id="main" class="container product-main" tabindex="-1">…</main>
```

Consumer templates:

```html
<!-- consumer: application shell, first node of the root template -->
<a hp-skip-link>Skip to content</a>
<div class="product-shell">
  <hp-top-bar … />
  <main id="main" class="container product-main"><router-outlet /></main>
  <hp-footer … />
</div>

<!-- consumer: a page with a very long filter area -->
<a hp-skip-link target="results">Skip to results</a>
```

Nothing in the markup is free to change: the class, the `href` and the position as the first focusable element are what the e2e tests and assistive technology rely on.

## Design

- Position: `position: absolute`, `left: --space-4`, `top: calc(-1 * --space-24)` hidden and `top: --space-4` revealed. The hidden offset is the design system's documented use of `--space-24` (96 px), more than the link's height.
- Spacing: padding `--space-2` vertical, `--space-4` horizontal.
- Typography: `--text-label`; `text-decoration: none`.
- Shape: `--radius-md`. Elevation: `--shadow-3`. Layer: `--z-tooltip`, so nothing on the page (sticky top bar, toasts) covers it.
- Surface: `--color-bg-surface-raised` with `--color-fg-default`.
- Motion: `top` transitions over `--duration-fast` with `--ease-standard`.
- The skip link declares no component tokens; it reads semantic tokens directly, as the stylesheet's `.skip-link` rule does.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Background | `--color-bg-surface-raised` | `--palette-white` | `--palette-gray-800` |
| Label | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Label, hover and active | `--color-fg-link-hover` | `--palette-plum-800` | `--palette-plum-200` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |
| Top bar beneath it | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |

Contrast pairs the component relies on, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface-raised` | 4.5:1 | Label |
| `--color-fg-link-hover` | `--color-bg-surface-raised` | 4.5:1 | Label, hover |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Ring against the link's own surface |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Ring against the top bar beneath it |

`--color-fg-link-hover` on `--color-bg-surface-raised` measures 12.07:1 in light and 7.87:1 in dark; it is checked in `tokens/contrast-pairs.json` and shown in the design system's skip-link contrast list. Forced colours: links are painted `LinkText`, the background `Canvas`, and the tokens map the ring to `Highlight`.

## Responsive behaviour

- The same at every width: it appears `--space-4` from the top-left corner, over the sticky top bar.
- It never wraps at default text size; measured in Chromium, "Skip to content" is 134 × 39 px, well inside a 320 px viewport. At 200 % text it measures 267 × 78 px and still fits at 320 px with no horizontal scroll.
- On touch-only devices it is never revealed, but stays the first element for switch and screen-reader users.
- Target size: 134 × 39 px, above the 24 × 24 px minimum (`--target-min`) (D-7).
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available.

## Accessibility

### Role and pattern

A native same-page link (WCAG 2.4.1 Bypass Blocks), the first focusable element in the document. Activation is handled in script so the browser does not resolve `#main` against `<base href="/">` (D-2).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> (first press on a page) | Focuses and reveals the skip link. |
| <kbd>Enter</kbd> | Moves focus to the target; the next <kbd>Tab</kbd> lands on the first control inside it. |
| <kbd>Tab</kbd> (again, without activating) | Hides the skip link and moves on to the brand in the top bar. |
| <kbd>Shift</kbd>+<kbd>Tab</kbd> | Leaves the page to the browser chrome, as from any first element. |
| <kbd>Space</kbd> | Does not activate it (link semantics). |

### Focus

- Revealed only on `:focus-visible`; the shared ring plus `--shadow-3` make it obvious over the top bar.
- On activation the component gives the target `tabindex="-1"` if it has no `tabindex`, calls `focus()` on it, and removes the attribute again when the target loses focus, so a pointer click inside `main` never focuses the landmark (D-3).
- The target shows no focus ring: the shell styles `main:focus { outline: none }`; the landmark is not a control, and the next Tab lands on a control that shows the ring (D-4).
- No hash is added to the URL and no history entry is created (D-2).

### Labelling

The link text is the name: "Skip to content". Never "Skip navigation", never an icon, never `aria-label`.

### Announcements

None of its own. When focus moves to `main`, screen readers announce the landmark and continue reading from its start.

### Motion

It slides down over `--duration-fast`; under `prefers-reduced-motion: reduce` the tokens zero the duration, so it appears instantly.

## Content and internationalisation

- Always "Skip to content", sentence case. A second instance names its target: "Skip to results".
- Translatable content: the projected label. Data values: none.
- A longer translated label still fits: the link grows with its text and wraps only when wider than the viewport minus `--space-4` each side.

## Performance

- Change detection: `OnPush`; one signal input; the `href` host binding is a `computed`. The click listener is a host listener; no global listeners.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/SkipLink.ts` renders `<a hp-skip-link>Skip to content</a>` above a `<main id="main">` holding the style gallery heading "Find a style that feels like you"; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: absolutely positioned, so revealing it never moves other content.
- Weight: `@angular/core` only (`DOCUMENT` for the lookup). No router, no CDK.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given the style gallery, when it renders, then the first focusable element in the document is `<a class="skip-link" href="#main">Skip to content</a>` with no wrapper, positioned above the viewport, and it is present in the accessibility tree as a link named "Skip to content". (L2-041)
- **AC-2** Given `<a hp-skip-link target="results">Skip to results</a>` in front of a long filter area, when it renders, then its `href` is `#results`. (L2-041)

### States

- **AC-3** Given the style gallery has just loaded, when the customer presses Tab once, then the skip link has focus and is visible 16 px from the top and left edges, above the sticky top bar, on `--color-bg-surface-raised` with `--shadow-3` and the 2 px focus ring. (L2-041)
- **AC-4** Given the focused skip link on `/styles/knotless-braids` with `<base href="/">`, when the customer presses Enter, then focus moves to `<main id="main">`, the URL stays `/styles/knotless-braids` with no hash, and the next Tab focuses the first control inside `main`. (L2-041)
- **AC-5** Given the revealed skip link, when the customer clicks it, then focus moves to `main` exactly as with Enter. (L2-041)
- **AC-6** Given a `main` element without `tabindex`, when the skip link is activated, then `main` has `tabindex="-1"` while it holds focus and loses the attribute again when focus leaves it; a `main` that already had `tabindex="-1"` keeps it. (L2-041)
- **AC-7** Given the focused skip link, when the customer presses Tab instead of Enter, then the skip link returns above the viewport and focus moves to the HairPop brand in the top bar. (L2-041)
- **AC-8** Given the revealed skip link, when the pointer hovers it, then its label becomes `--color-fg-link-hover` with no underline and contrast of at least 4.5:1 against `--color-bg-surface-raised`. (L2-041)
- **AC-9** Given a skip link whose `target` matches no element, in development mode, when it is activated, then the console reports an error naming `hp-skip-link` and the missing id, and focus stays on the skip link. (L2-041)
- **AC-10** Given the cancel appointment dialog open over appointment HP-1048, when the customer presses Tab from the browser's address bar, then focus never lands on the skip link, because the page behind the dialog is inert. (L2-041)

### Screen readers

- **AC-11** Given a screen reader's links list on the booking request page, when it is opened, then "Skip to content" is the first entry, and activating it moves the reading position to the start of `main`. (L2-041)

### Theming

- **AC-12** Given the focused skip link, when the theme switches from light to dark, then its background changes from white to grey 800, its label from grey 900 to grey 150 and its ring from plum 600 to plum 300 without a reload. (L2-042)
- **AC-13** Given the focused skip link in either theme, when contrast is measured, then the label is at least 4.5:1 against `--color-bg-surface-raised` and the ring at least 3:1 against both `--color-bg-surface-raised` and the top bar's `--color-bg-surface`. (L2-041)

### Responsive

- **AC-14** Given a 320 px viewport, when the skip link is focused at default text size and at 200 % text, then "Skip to content" stays on one line inside the viewport and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-15** Given `prefers-reduced-motion: reduce`, when the skip link receives focus, then it reaches its revealed position with no visible slide. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/skip-link/`; file `skip-link.ts` exporting the standalone component `SkipLink` with `selector: 'a[hp-skip-link]'`, `template: '<ng-content />'`, `changeDetection: OnPush`, and scoped `styles` that port the `.skip-link` rules from `docs/design-system/assets/components.css` onto `:host` (including the `:focus-visible` reveal). Export it from the library's `public-api.ts`.
- Host bindings: `class.skip-link` always; `attr.href` = `'#' + target()`.
- Host listener on `click` (Enter on a link fires `click`): `preventDefault()`; look up `document.getElementById(target())`; if absent, `console.error` in development and return; if the target has no `tabindex`, set `tabindex="-1"` and remove it on the target's next `blur` (listener added with `{ once: true }`); call `target.focus()`.
- The application shell renders `<a hp-skip-link>` as the first node of the root component's template, before `.product-shell`. `main:focus { outline: none }` is a global shell rule in `components.css` (D-4).
- No CDK primitive. Composes nothing.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/SkipLink.ts`, exported from `src/scenarios/index.ts`, with iterations added to `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is the host a wrapper element or the native anchor?* The native anchor, through `a[hp-skip-link]`. The `.skip-link` rule positions the element itself against the page, the design system requires a native same-page link, and a wrapper would put a non-link element first in the document. Matches the link and button CRDs.
- **D-2** *Does the browser follow `href="#main"`, or does the component move focus?* The component moves focus and cancels the navigation. Angular apps ship `<base href="/">`, against which `#main` resolves to the site root: on `/styles/knotless-braids` a native follow would load `/#main` and lose the page. Focusing in script also works for client-side routing, as the design system's *Role and pattern* section asks ("set `tabindex="-1"` on `main` and focus it in script"). The `href` stays for semantics, the links list and middle click; no hash is written, so Back does not stop on the same page twice.
- **D-3** *Who adds `tabindex="-1"` to the target?* The component, when it is missing, and it removes it again on blur. The design system's code sample puts `tabindex="-1"` on `main`; adding it on demand means a target such as `#results` works without the consumer remembering, and removing it keeps a pointer click inside `main` from focusing the landmark.
- **D-4** *Does the target show a focus ring?* No. Measured in Chromium: after keyboard activation `main` matches `:focus-visible` and the shared ring outlines the whole content area. `main` is not a control, and the next Tab lands on one that shows the ring, so `components.css` suppresses the outline on `main:focus` in its app-shell rules. WCAG 2.4.7 applies to the controls, not the landmark.
- **D-5** *The first dialog mocks kept the skip link focusable while a modal was open. Which wins?* The design system, which records it as drift: the skip link is inert with the page, as the dialog mocks now render it. The component does nothing itself; it lives inside the application root, which the dialog makes inert while it is open, as for everything else behind the dialog.
- **D-6** *What happens when the target does not exist?* Focus stays on the skip link and development mode logs a `console.error` naming `hp-skip-link` and the id. A missing `main` is a shell bug; an error log that the e2e harness treats as a failure catches it without breaking the page.
- **D-7** *The design system says the revealed link is "at least 40px tall". Must the component enforce 40 px?* No. Measured in Chromium it is 39 px (14 px label at `--line-height-normal` plus `--space-2` padding twice); the binding requirement is the 24 px minimum target (`--target-min`), which it exceeds, and adding a minimum height would change the extracted design for one pixel. The design-system page now gives the measured 39 px.
- **D-8** *Where is the skip link rendered?* As the first node of the root component's template, so it is the first focusable element after the browser chrome. The design system says the first focusable element on the page; in an Angular app `<app-root>` is the first element in `<body>` and the skip link is its first focusable descendant, which gives the same tab order.

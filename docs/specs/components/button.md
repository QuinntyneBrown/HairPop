# Button

| Field | Value |
|---|---|
| Selector | `button[hp-button]`, `a[hp-button]` |
| Library path | `frontend/projects/components/src/lib/button/` |
| Status | planned |
| Traces to | L2-005, L2-007, L2-011, L2-022, L2-036, L2-041, L2-042 |
| Design system | [`button.html`](../../design-system/components/button.html) |
| Source mocks | [`pages/booking-request/default`](../../mocks/pages/booking-request/default.html), [`pages/booking-request/submitting`](../../mocks/pages/booking-request/submitting.html), [`pages/appointment-detail/default`](../../mocks/pages/appointment-detail/default.html), [`pages/my-appointments/default`](../../mocks/pages/my-appointments/default.html), [`pages/style-detail/default`](../../mocks/pages/style-detail/default.html), [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html), [`pages/matching-braiders/default`](../../mocks/pages/matching-braiders/default.html), [`pages/style-gallery/error`](../../mocks/pages/style-gallery/error.html), [`pages/sign-in/default`](../../mocks/pages/sign-in/default.html), [`dialogs/cancel-appointment/default`](../../mocks/dialogs/cancel-appointment/default.html), [`dialogs/cancel-appointment/busy`](../../mocks/dialogs/cancel-appointment/busy.html), [`dialogs/filter-braiders/default`](../../mocks/dialogs/filter-braiders/default.html), [`dialogs/sign-out/default`](../../mocks/dialogs/sign-out/default.html) |
| Rendering | [`button.html`](button.html) |

## Purpose and scope

A button lets a customer act: send a request, show braiders, post a review, cancel an appointment, close a dialog. It is the product's one action control, in five levels of emphasis, three sizes, with optional icons, and a busy state that keeps the customer's work safe while a request is in flight. Navigation that should look like an action ("Request with Nia", "View request", "Explore styles") uses the same component on an `<a href>` and keeps link semantics.

Use something else when:

- the control only takes the person somewhere inside running text or a card footer: use the link component (`link.html` in the design system; its CRD follows);
- one trigger offers several actions: use the menu component;
- the control filters a list by toggling a value in a row of peers: use the chip component;
- the control dismisses a toast: the toast owns its `.close` control.

Out of scope:

- Which action is primary on a view, and that there is only one. That is the page's or dialog's rule (design-system *Overview*); the component renders what it is told.
- Progress copy while busy ("Sending your request…"). The form or dialog owns the live region that announces it; the button only exposes `aria-busy`.
- Form validation, submission and retry. The button raises a native `click` or submits its form; the form decides what happens.
- Dialog opening, closing, focus trapping and initial focus. The dialog CRD owns them; a button inside a dialog is an ordinary button.
- Placement rules (`.form-actions`, `.dialog__footer`, `.page-header__actions`, `.empty__actions`, `.cluster`). Those containers decide order, wrapping and full width; the component only needs to be their direct flex child, which it is (D-1).
- Tooltips on icon-only buttons. The tooltip CRD owns the `.has-tooltip` wrapper and `aria-describedby`; this CRD only requires the `aria-label`.
- Icons themselves. The button sizes and colours a projected `.icon`; the icon set is defined by the iconography foundation and its CRD.

## Usage

Every use of `.btn` in `docs/mocks/`, grouped by configuration, plus the configurations the design system defines for later screens. Controls that open a dialog or re-run a request are `<button>` elements in the mocks and the product alike (D-10).

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Form submit on `pages/sign-in`, `sign-up`, `forgot-password`, `reset-password`, `verify-email`, `account-settings`, `booking-request`, `care-and-review` | `<button>`, primary, md, `type="submit"` | "Sign in", "Create account", "Send reset link", "Save password", "Resend email", "Save changes", "Send request", "Post review" | default; busy in every `submitting` state (label kept, `aria-busy="true"`, still enabled); enabled in every `offline` state, where the offline alert explains (D-7) | surface (form panel) |
| Dialog footer confirm in `dialogs/filter-braiders`, `request-review`, `change-appointment`, `report-review`, `cookie-preferences` | `<button>`, primary, md, `type="button"` (`type="submit"` when the dialog body is a form) | "Show braiders", "Send request", "Send change request", "Send report", "Save preferences"; "Try again" in `failed` | default, busy (`busy` state), focus | raised (dialog panel) |
| Destructive confirm in `dialogs/cancel-appointment`, `dialogs/sign-out` | `<button>`, danger, md, `type="button"` | "Cancel request", "Sign out"; "Try again" in `failed` | default, busy, hover, focus | raised |
| Safe action in every dialog footer | `<button>`, secondary, md, `type="button"` | "Keep request", "Stay signed in", "Keep current time", "Clear filters", "Edit details", "Keep browsing" (closes the dialog; it never navigates) | default, initial focus in destructive dialogs | raised |
| Close control in every dialog header | `<button>`, ghost, md, `iconOnly`, `aria-label="Close dialog"` | close `.icon`, inside the tooltip wrapper | default, hover, focus | raised |
| Appointment card actions on `pages/appointment-detail` | `<button>` secondary md + `<button>` link md, in a `.cluster` | "Request a change", "Cancel request" (both open dialogs) | default, hover, focus | surface (card) |
| Appointment rows on `pages/my-appointments`, notification cards on `pages/notification-center` | `<a href>`, primary or secondary, md | "View request", "View appointment", "View care and review", "View care" | default, hover, focus | surface (card) |
| Style detail aside on `pages/style-detail` | `<a href>`, primary, md | "See braiders for this style" (the longest label in the product) | default | surface (card) |
| Profile card on `pages/braider-profile` | `<a href>`, primary, md, leading calendar `.icon` | "Request with Nia" | default, hover, focus | surface |
| Search box on `pages/style-gallery` and `pages/matching-braiders` | `<a href>` secondary md "Find braiders"; `<button>` secondary md, trailing filter `.icon`, "Filters" (opens the filter dialog) | "Find braiders", "Filters" | default, focus | surface |
| Empty, error, no-results and success states on every page, `pages/forbidden`, `pages/booking-request/success` | `<button>` primary "Try again" / "Clear filters"; `<a href>` primary "Explore styles", "Sign in", "View appointment"; `<a href>` secondary "Explore styles" beside "Try again" | as listed | default, busy ("Try again" while retrying), focus | canvas |
| Pagination and toolbars (design system *Sizes*; `long` mocks use the pagination component's own controls) | `<button>` or `<a>`, secondary, `sm` | "Previous", "Next" | default, disabled | surface |
| Hero and auth screens (design system *Sizes*) | `<button>` primary `lg`; `block` below 768 px via `.form-actions` | "Sign in", "Send request" | default, busy | surface |
| Saved-braider toggle (design system *Pressed*, no mock yet) | `<button>`, secondary, md, `pressed` two-way | "Save braider" / "Saved" | pressed false, pressed true, hover, focus | surface |
| Promotional re-skin (design system *Theming*) | any variant with component tokens overridden by the surface | — | all | inverse surface |

Every row is buildable with the API below: variant × size × `block` × `iconOnly` on either a `<button>` or an `<a>`, with `busy`, `disabled` and `pressed` as state inputs and all copy projected as content.

## Anatomy

1. **Container** — `.btn` on the host element itself. `inline-flex`, centred content, gap `--space-2`, min-height from the size, padding from the size, `--radius-md` corners, `--border-width-hairline` border, label font `--text-label` at the size's font size.
2. **Label** — the projected text node. It is the accessible name. Never swapped while busy.
3. **Leading or trailing icon (optional)** — a projected `<svg class="icon" aria-hidden="true">` before or after the label. Sized to 1.25 em, stroked in `currentColor`, never part of the name.
4. **Spinner (busy only)** — the `::after` pseudo-element: a 1.25 em ring of `--border-width-thick` in `--btn-fg` with a transparent right edge, centred by `inset: 0; margin: auto`, turning over `--duration-loop-spin`.
5. **Focus ring** — the shared `:focus-visible` outline, `--focus-ring-width` of `--color-focus-ring` offset by `--focus-ring-offset`.

Host: the component uses attribute selectors, so the host **is** the native `<button>` or `<a>` and carries the `.btn` classes, `type`, `href`, `disabled` and every ARIA attribute (D-1). There is no inner element; the template is a single `<ng-content>`. Parent layout rules in the design system (`.dialog__footer .btn`, `.form-actions .btn--primary`, `.page-header__actions .btn--primary`) therefore apply to the host as a direct flex child, exactly as in the mocks.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'link' \| 'danger'` | `'secondary'` | no | Adds `.btn--{variant}`; secondary adds no modifier. One primary per view and danger only inside a confirmation dialog are page rules, not enforced here. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | no | Adds `.btn--sm` or `.btn--lg`; md adds no modifier. |
| `block` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.btn--block`: `display: flex; width: 100%`. |
| `iconOnly` | `boolean` (`booleanAttribute`) | `false` | no | Adds `.btn--icon`: square, padding 0, width equal to the height. Requires `aria-label` (or `aria-labelledby`) on the host; in development mode a missing label is reported as a console error (D-9). |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | no | `<button>` hosts only: written to the native `type` attribute, so a button never submits a form by accident (D-4). Ignored on `<a>` hosts. |
| `disabled` | `boolean` (`booleanAttribute`) | `false` | no | `<button>` hosts only: sets the native `disabled` attribute, which removes the button from the tab order and stops `click`. Ignored on `<a>` hosts: a link-styled button is never disabled (D-3). |
| `busy` | `boolean` (`booleanAttribute`) | `false` | no | Sets `aria-busy="true"`; never `aria-disabled` or native `disabled` (D-2). Keeps the label, size and focus; swallows every activation (pointer, Enter, Space, programmatic click, and navigation on an `<a>` host) until it is false. |
| `pressed` | `boolean \| undefined` (two-way `model`) | `undefined` | no | When defined the button is a toggle: `aria-pressed` mirrors the value and each activation flips it (D-8). When undefined no `aria-pressed` attribute is rendered. |

- Inputs are signal inputs (`input()`, `model()`); booleans accept bare attributes.
- `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-expanded`, `aria-haspopup`, `aria-controls`, `autofocus`, `name`, `value`, `form`, `href`, `target`, `rel` and `download` are plain native attributes on the host. The component never reads or rewrites them.
- Every user-facing string is projected content or a native attribute set by the consumer; the component renders no copy of its own.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `pressedChange` | `boolean` | The customer activates a toggle button (`pressed` defined) and the value flips. Part of the `pressed` model. |
| native `click` | `MouseEvent` | Every activation that is not busy or disabled. Not re-emitted by the component: consumers bind `(click)` on the host as they would on any button. A busy button cancels the event before it bubbles, so `(click)` handlers and form submission never run. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Text, and optionally one `<svg class="icon" aria-hidden="true">` before or after the text; or only the icon when `iconOnly` | Declared once in the template. The text is the accessible name; an icon never contributes to it. An `iconOnly` button projects exactly one icon and names itself with `aria-label`. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Primary | `.btn--primary` | The one action the view exists for: "Send request", "Show braiders", "Post review", "View request". |
| Secondary | — (base `.btn`) | Every other action: "Find braiders", "Request a change", "Keep request", "Explore styles" beside "Try again". |
| Ghost | `.btn--ghost` | Dense surfaces: the dialog close control, toolbar and row actions, "Edit details". |
| Link | `.btn--link` | A low-emphasis action placed beside other buttons that should read like a link: "Cancel request" on the appointment card. |
| Danger | `.btn--danger` | The destructive confirm inside a confirmation dialog only: "Cancel request", "Sign out". |

Form modifiers combine with any variant: `.btn--icon` (icon-only, square), `.btn--block` (full width).

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| sm | `.btn--sm` | `--control-height-sm` (32 px) | `--space-3` | `--text-label` at `--font-size-sm` |
| md | — | `--control-height-md` (40 px) | `--space-4` | `--text-label` at `--font-size-md` |
| lg | `.btn--lg` | `--control-height-lg` (48 px) | `--space-6` | `--text-label` at `--font-size-lg` |

Width comes from the label and padding; `block` makes it the container's width. An icon-only button is as wide as it is tall.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | `--btn-bg` fill, `--btn-border` border, `--btn-fg` label as set by the variant | Name from the label, role from the element |
| Hover | `:hover` | Fill `--btn-bg-hover`; primary also sets the border to `--color-accent-hover` and lifts with `--shadow-1`; danger sets the border to `--color-danger-solid-hover`; link and ghost tint with their hover fill | — |
| Focus | `:focus-visible` | `--focus-ring-width` outline in `--color-focus-ring`, offset `--focus-ring-offset`; no ring after a pointer click | — |
| Active | `:active` | Fill `--btn-bg-active`, `translateY(1px)` | — |
| Disabled | native `disabled` (`<button>` only) | 50 % opacity, `cursor: not-allowed`, no transform, no hover change | Removed from the tab order; exposed as disabled; emits nothing |
| Busy | `aria-busy="true"` | Label painted transparent, spinner centred, colours and size kept, `pointer-events: none` | Name unchanged, role unchanged, busy state exposed; focus stays; no activation reaches consumers; progress copy comes from the form's live region |
| Pressed (toggle on) | `aria-pressed="true"` | Fill `--color-accent-subtle`, label `--color-fg-accent`, border `--color-accent`; hover fill `--color-accent-subtle-hover` (the selected look shared with chips and the current nav link) | Toggle button, pressed |
| Pressed (toggle off) | `aria-pressed="false"` | Variant's default look | Toggle button, not pressed |
| Expanded (menu trigger open) | `aria-expanded="true"`, set by the menu trigger directive | Fill `--btn-bg-active`, the variant's active colour, held while the menu is open; no transform (D-13) | Expanded state exposed by the trigger's own attribute |
| Link host | `<a href>` | Identical look; `a.btn:hover` keeps the label colour and no underline (link variant keeps its underline) | Role link; Enter follows, Space does not; middle click opens a new tab |
| Forced colours | `(forced-colors: active)` | Border `CanvasText` on every variant; primary `Highlight` fill with `HighlightText` label; focus ring `Highlight` | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Transitions instant (`--duration-fast` is zeroed by the tokens); the spinner keeps turning | — |
| Narrow container or enlarged text | container narrower than the label, for example text enlarged to 200 % | The label wraps onto further lines and the button grows in height instead of overflowing (D-5) | — |

Surface contexts: the component reads only semantic tokens through its component tokens, so it needs no surface modifier. On a dialog panel (`--color-bg-surface-raised`) and the page canvas the same tokens apply; the contrast pairs for both are listed under *Colour*. A promotional surface re-skins it by overriding `--btn-bg`, `--btn-fg` and `--btn-border` on the surface's selector.

## Markup

Rendered DOM. Classes and attributes are the e2e contract; the element and its attributes are the host.

```html
<!-- rendered: primary submit (booking request form) -->
<button class="btn btn--primary" type="submit">Send request</button>
```

```html
<!-- rendered: secondary (default), ghost, link, danger -->
<button class="btn" type="button">Find braiders</button>
<button class="btn btn--ghost" type="button">Edit details</button>
<button class="btn btn--link" type="button">Cancel request</button>
<button class="btn btn--danger" type="button">Cancel request</button>
```

```html
<!-- rendered: sizes and block -->
<button class="btn btn--primary btn--sm" type="button">Next</button>
<button class="btn btn--primary btn--lg" type="submit">Sign in</button>
<button class="btn btn--primary btn--block" type="submit">Send request</button>
```

```html
<!-- rendered: leading icon, trailing icon -->
<a class="btn btn--primary" href="/braiders/nia-okafor/book">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/></svg>
  Request with Nia
</a>
<button class="btn" type="button" aria-haspopup="dialog">
  Filters
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 5h16l-6 8v6l-4-2v-4z"/></svg>
</button>
```

```html
<!-- rendered: icon-only ghost close control -->
<button class="btn btn--ghost btn--icon" type="button" aria-label="Close dialog">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
</button>
```

```html
<!-- rendered: busy (label kept), disabled, toggle -->
<button class="btn btn--primary" type="submit" aria-busy="true">Send request</button>
<button class="btn btn--primary" type="submit" disabled>Post review</button>
<button class="btn" type="button" aria-pressed="true">Saved</button>
<button class="btn" type="button" aria-pressed="false">Save braider</button>
<button class="btn btn--ghost" type="button" aria-haspopup="menu" aria-expanded="true">More actions</button>
```

```html
<!-- rendered: link-styled navigation -->
<a class="btn btn--primary" href="/styles/knotless-braids/braiders">See braiders for this style</a>
<a class="btn" href="/styles">Explore styles</a>
```

Consumer templates:

```html
<!-- consumer: booking request form -->
<button hp-button variant="primary" type="submit" [busy]="sending()">Send request</button>

<!-- consumer: cancel appointment dialog footer -->
<button hp-button (click)="keep()">Keep request</button>
<button hp-button variant="danger" [busy]="cancelling()" (click)="confirm()">Cancel request</button>

<!-- consumer: dialog close -->
<button hp-button variant="ghost" iconOnly aria-label="Close dialog" (click)="close()">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
</button>

<!-- consumer: navigation that looks like an action -->
<a hp-button variant="primary" [routerLink]="['/braiders', braider.slug, 'book']">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/></svg>
  Request with {{ braider.firstName }}
</a>

<!-- consumer: toggle -->
<button hp-button [(pressed)]="saved">{{ saved() ? 'Saved' : 'Save braider' }}</button>

<!-- consumer: sizes and block -->
<button hp-button variant="primary" size="lg" block type="submit">Sign in</button>
<button hp-button size="sm" [disabled]="page() === 1">Previous</button>
```

Free to change: the order of classes in the class list, and the spinner's implementation as long as it stays a pseudo-element that adds no DOM node.

## Design

- Height: `min-height` of `--control-height-sm` / `--control-height-md` / `--control-height-lg` by size, through `--btn-height`. The height is a minimum, so a wrapped label (D-5) grows the button.
- Padding: `--space-1` vertical and `--btn-padding` horizontal, where `--btn-padding` is `--space-3` / `--space-4` / `--space-6` by size; `0` horizontal for `iconOnly`. The vertical padding keeps a wrapped label off the edge and never raises a single-line button above its minimum height (D-5).
- Gap between icon and label: `--space-2`.
- Typography: `--text-label` (semibold) with the size's `--font-size-sm` / `--font-size-md` / `--font-size-lg`, `--line-height-snug` and centred text; the label wraps and breaks long words with `overflow-wrap: anywhere` instead of staying on one line (D-5). Sentence case comes from the copy, never from CSS.
- Shape: `--radius-md`; border `--border-width-hairline`.
- Elevation: none at rest; primary hover `--shadow-1`.
- Motion: `background-color`, `border-color`, `transform` and `box-shadow` transition over `--duration-fast` with `--ease-standard`; active `translateY(1px)`; busy spinner `spin` over `--duration-loop-spin`, linear, infinite. Reduced motion zeroes `--duration-fast`; the spinner is deliberately not bound to `--motion-loop-state`.
- Layer: none; the button never creates a stacking context above its surface (`position: relative` only anchors the spinner).
- Icon: `.btn .icon` is `1.25em` square, so it scales with the size's font size; stroke `currentColor`.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--btn-bg` | `--color-bg-surface` | `.btn--primary` → `--color-accent`; `.btn--danger` → `--color-danger-solid`; `.btn--ghost`, `.btn--link` → `transparent`; `[aria-pressed="true"]` → `--color-accent-subtle`; a surface re-skin |
| `--btn-fg` | `--color-fg-default` | `.btn--primary` → `--color-fg-on-accent`; `.btn--danger` → `--color-fg-on-danger`; `.btn--link` → `--color-fg-link`; `[aria-pressed="true"]` → `--color-fg-accent` |
| `--btn-border` | `--color-border-strong` | `.btn--primary` → `--color-accent`; `.btn--danger` → `--color-danger-solid`; `.btn--ghost`, `.btn--link` → `transparent`; `[aria-pressed="true"]` → `--color-accent` |
| `--btn-bg-hover` | `--color-bg-subtle` | `.btn--primary` → `--color-accent-hover`; `.btn--danger` → `--color-danger-solid-hover`; `.btn--link` → `--color-accent-subtle`; `[aria-pressed="true"]` → `--color-accent-subtle-hover` |
| `--btn-bg-active` | `--color-bg-subtle-hover` | `.btn--primary` → `--color-accent-active`; `.btn--danger` → `--color-danger-solid-hover`; `.btn--link` → `--color-accent-subtle-hover` |
| `--btn-height` | `--control-height-md` | `.btn--sm`, `.btn--lg` |
| `--btn-padding` | `--space-4` | `.btn--sm` → `--space-3`; `.btn--lg` → `--space-6`; `.btn--icon` → `0` |
| `--btn-font-size` | `--font-size-md` | `.btn--sm` → `--font-size-sm`; `.btn--lg` → `--font-size-lg` |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Primary fill and border | `--color-accent` | `--palette-plum-600` | `--palette-plum-300` |
| Primary fill, hover | `--color-accent-hover` | `--palette-plum-700` | `--palette-plum-200` |
| Primary fill, active | `--color-accent-active` | `--palette-plum-800` | `--palette-plum-100` |
| Primary label | `--color-fg-on-accent` | `--palette-white` | `--palette-plum-950` |
| Secondary fill | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Secondary border | `--color-border-strong` | `--palette-gray-500` | `--palette-gray-450` |
| Secondary and ghost label | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Secondary and ghost fill, hover | `--color-bg-subtle` | `--palette-gray-100` | `--palette-gray-800` |
| Secondary and ghost fill, active | `--color-bg-subtle-hover` | `--palette-gray-200` | `--palette-gray-700` |
| Link label | `--color-fg-link` | `--palette-plum-700` | `--palette-plum-300` |
| Link fill, hover | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Link fill, active | `--color-accent-subtle-hover` | `--palette-plum-100` | `--palette-plum-900` |
| Danger fill and border | `--color-danger-solid` | `--palette-red-600` | `--palette-red-300` |
| Danger fill, hover and active | `--color-danger-solid-hover` | `--palette-red-700` | `--palette-red-100` |
| Danger label | `--color-fg-on-danger` | `--palette-white` | `--palette-red-950` |
| Pressed fill | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Pressed label | `--color-fg-accent` | `--palette-plum-700` | `--palette-plum-300` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-on-accent` | `--color-accent` | 4.5:1 | Primary label |
| `--color-fg-on-accent` | `--color-accent-hover` | 4.5:1 | Primary label, hover |
| `--color-fg-on-accent` | `--color-accent-active` | 4.5:1 | Primary label, active |
| `--color-accent` | `--color-bg-surface` | 3:1 | Primary edge against a card |
| `--color-accent` | `--color-bg-canvas` | 3:1 | Primary edge against the page |
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Secondary and ghost label |
| `--color-fg-default` | `--color-bg-subtle` | 4.5:1 | Secondary and ghost label, hover |
| `--color-border-strong` | `--color-bg-surface` | 3:1 | Secondary border on a card |
| `--color-border-strong` | `--color-bg-canvas` | 3:1 | Secondary border on the page |
| `--color-border-strong` | `--color-bg-surface-raised` | 3:1 | Secondary border in a dialog |
| `--color-fg-link` | `--color-bg-surface` | 4.5:1 | Link label |
| `--color-fg-link` | `--color-bg-canvas` | 4.5:1 | Link label on the page |
| `--color-fg-on-danger` | `--color-danger-solid` | 4.5:1 | Danger label |
| `--color-fg-on-danger` | `--color-danger-solid-hover` | 4.5:1 | Danger label, hover |
| `--color-danger-solid` | `--color-bg-surface-raised` | 3:1 | Danger edge in a dialog |
| `--color-fg-accent` | `--color-accent-subtle` | 4.5:1 | Pressed label |
| `--color-focus-ring` | `--color-bg-surface` | 3:1 | Focus ring against a card |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring against the page |
| `--color-focus-ring` | `--color-bg-surface-raised` | 3:1 | Focus ring in a dialog |

Forced colours: the stylesheet gives every `.btn` a `CanvasText` border, paints `.btn--primary` with `Highlight` and `HighlightText` (`forced-color-adjust: none`), and the tokens map `--color-focus-ring` to `Highlight`. Ghost and link buttons therefore gain a visible border, which is intended.

## Responsive behaviour

- The component has no breakpoint rules of its own. Its containers do: below `--layout-breakpoint-md` (768 px) `.form-actions` makes the primary button full width and visually first (`order: -1`, form-layout CRD), and `.page-header__actions` makes it full width but keeps it last, in DOM order (page-header D-4); `.dialog__footer` stretches every button to share the row and uses `wrap-reverse` so the primary lands on top on phones and last from 640 px (dialog CRD).
- A `block` button is always its container's width, at every breakpoint.
- Labels are written not to wrap at 360 px (three or four words); the longest, "See braiders for this style", fits a medium button inside the style detail card at 320 px. When the container is narrower than the label, as when text is enlarged to 200 %, the label wraps onto further lines, the button grows in height, and nothing overflows or truncates (D-5).
- Targets: md (40 px) and lg (48 px) exceed `--target-min` (24 px) and sm (32 px) exceeds it too; sm appears only where neighbours are at least 8 px apart. A screen's primary action on a phone uses `size="lg"` so it reaches `--target-comfortable` (44 px) (D-6).
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; every target is at least 24 × 24 CSS px, and the primary mobile action 44 × 44.

## Accessibility

### Role and pattern

Native `<button>` (`type="button"`, or `type="submit"` inside a form) following the [APG Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/); a toggle adds `aria-pressed`. A link-styled button is a native `<a href>` and keeps the link role. Never a `<div>` with a click handler; the attribute selector makes anything else impossible.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Moves focus to and from the button in DOM order. A disabled button is skipped; a busy button is not. |
| <kbd>Enter</kbd> | Activates a `<button>`; follows an `<a>` host. Cancelled while busy. |
| <kbd>Space</kbd> | Activates a `<button>` on key up. Does nothing on an `<a>` host (the page scrolls, as for any link). Cancelled while busy. |

### Focus

- Focus lands on the host element; there is nothing else to focus.
- The ring is the shared `:focus-visible` outline: `--focus-ring-width` of `--color-focus-ring`, offset `--focus-ring-offset`, so the offset gap shows the surface and the ring stays at least 3:1 against both the button and the page. No ring after a pointer click.
- A busy button keeps focus; it never moves focus when it becomes busy or when it settles. Where focus goes after an action (into a dialog, to a success heading) is the page's or dialog's rule.
- A button that becomes disabled while focused loses focus to the body, as the browser does; pages that need to avoid that keep the button enabled and explain on activation, which is also the design system's preference.

### Labelling

- The visible text is the accessible name. It is never changed while busy.
- An `iconOnly` button names itself with `aria-label` using a verb and object: "Close dialog", "Edit request", "Filters". Icons are `aria-hidden="true"`.
- When `aria-label` extends a visible label it starts with the visible text (WCAG 2.5.3): `aria-label="Request with Nia Okafor"` on a button that shows "Request with Nia".
- State attributes: `aria-busy="true"` while busy; `aria-pressed` on a toggle; native `disabled` when disabled. `aria-expanded`, `aria-haspopup` and `aria-controls` are set by the consumer that owns the menu or dialog.

### Announcements

The button has no live region. Progress ("Sending your request…"), success and failure are announced by the form's or dialog's status region. The busy state is exposed through `aria-busy` only.

### Motion

Fill, border, transform and shadow animate over `--duration-fast`; the active state moves the button down 1 px. Under `prefers-reduced-motion: reduce` the tokens zero `--duration-fast`, so those changes are instant, while the busy spinner keeps turning because it is the only sign that work is in progress.

## Content and internationalisation

- Labels are verb phrases in sentence case, three or four words: "Send request", "Request a change", "Post review", "Show braiders". Never "OK", "Submit", "Yes", "Click here", and never "Working…" while busy.
- Name the object when the context does not: "Cancel request" in the dialog footer, not "Cancel".
- Pair a destructive action with a safe one that says what staying means: "Keep request" beside "Cancel request".
- Use the braider's first name when it adds confidence: "Request with Nia".
- Translatable content: the projected label and the consumer's `aria-label`. Data values: the braider's first name in "Request with Nia", page numbers in pagination labels. The component itself renders no text, so there is nothing to translate inside it, whichever languages the product later adds.
- Length: the product's copy is English only today and no L2 requirement covers translation, but labels may still outgrow their container when text is enlarged; the label then wraps rather than overflows (D-5), and the button grows in height.
- No dates, times, prices or distances appear in button labels.

## Performance

- Change detection: `OnPush`, signal inputs, host bindings computed from signals; no work in the template (it is a single `<ng-content>`).
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Button.ts` renders the booking form's primary submit, `<button hp-button variant="primary" type="submit">Send request</button>`; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none yet. The dialog and form-layout CRDs will name the footer compositions that repeat the button.
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: the busy state keeps the label in the DOM, so width and height do not change; the spinner is a pseudo-element. Disabled changes opacity only. Nothing is loaded asynchronously.
- Weight: no dependencies beyond `@angular/core`. No CDK, no icon library, no router import (consumers add `routerLink` themselves).
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `<button hp-button variant="primary" type="submit">Send request</button>` in the booking request form, when it renders, then the DOM holds the native `<button class="btn btn--primary" type="submit">Send request</button>` with no wrapper element, its role is button and its accessible name is "Send request". (L2-041)
- **AC-2** Given `<a hp-button variant="primary" href="/braiders/nia-okafor/book">Request with Nia</a>` on Nia Okafor's profile, when a customer activates it with a click, Enter or a middle click, then the browser follows the link to Nia's booking route and assistive technology announces it as a link named "Request with Nia". (L2-007)
- **AC-3** Given a button labelled "Find braiders" with no `variant`, `size`, `block` or `iconOnly` set, when it renders, then its class list is exactly `btn`, its fill resolves to `--color-bg-surface`, its border to `--color-border-strong` and its min-height is 40 px. (L2-041)
- **AC-4** Given `<button hp-button variant="ghost" iconOnly aria-label="Close dialog">` containing one `.icon` SVG, when it renders in a dialog header, then its classes are `btn btn--ghost btn--icon`, it measures 40 × 40 px, the SVG has `aria-hidden="true"` and the accessible name is "Close dialog". (L2-041)
- **AC-5** Given a primary button whose content is a calendar `.icon` SVG followed by the text "Request with Nia", when it renders, then the icon is 1.25 em square in the label colour with a `--space-2` gap before the text and the accessible name is exactly "Request with Nia". (L2-041)
- **AC-6** Given three primary buttons with `size` `sm`, `md` and `lg`, when they render, then their min-heights are 32, 40 and 48 px and their horizontal paddings 12, 16 and 24 px, so every size meets the 24 px minimum target. (L2-041)
- **AC-7** Given `<button hp-button variant="primary" block>Send request</button>` inside a 360 px wide form, when it renders, then it has the class `btn--block` and its width equals the form's content width. (L2-042)

### Variants

- **AC-8** Given the cancel appointment dialog for request HP-1048, when its footer renders, then the confirm is `<button class="btn btn--danger" type="button">Cancel request</button>` filled with `--color-danger-solid`, its label contrast is at least 4.5:1, and the safe action beside it is a secondary button, never a second danger or primary one. (L2-022)
- **AC-9** Given the sign-out dialog, when its footer renders, then the confirm is a danger button labelled "Sign out" and no other button in the dialog is primary or danger. (L2-011)
- **AC-10** Given the appointment card for HP-1048 with the link-variant button "Cancel request", when it renders, then it has the classes `btn btn--link`, a transparent fill and border, an underlined label in `--color-fg-link`, and hovering fills it with `--color-accent-subtle`. (L2-041)
- **AC-11** Given a ghost button "Edit details", when it renders and is then hovered, then its fill and border are transparent at rest, its fill becomes `--color-bg-subtle` on hover and the label stays `--color-fg-default`. (L2-041)

### States

- **AC-12** Given a primary button "Send request", when the pointer hovers it, then its fill and border change to `--color-accent-hover`, it gains `--shadow-1` and the label contrast stays at least 4.5:1. (L2-041)
- **AC-13** Given any enabled button, when it is pressed and held, then its fill is its active colour and it moves down by 1 px, and when it is released it returns to rest. (L2-041)
- **AC-14** Given the booking request submit button "Send request" with `busy` true, when it renders, then it has `aria-busy="true"`, its text is still "Send request" (painted transparent) so the accessible name is unchanged, a spinner is centred over it, its width and height are unchanged, and keyboard focus stays on it. (L2-036)
- **AC-15** Given a busy submit button "Send request" that has focus, when the customer presses Enter or Space or clicks it again, then no click event reaches the form and no second submission starts. (L2-036)
- **AC-16** Given the filter braiders dialog with "Show braiders" busy, when the customer activates it again, then the dialog sends nothing further and the entered maximum price and distance remain in their fields. (L2-005)
- **AC-17** Given `<button hp-button disabled>Post review</button>`, when it renders, then the native `disabled` attribute is present, it is 50 % opaque, it is not in the Tab order and clicking it emits nothing. (L2-041)
- **AC-18** Given `<button hp-button [(pressed)]="saved">` labelled "Save braider" with `pressed` false, when the customer activates it, then `pressed` becomes true, `pressedChange` emits `true`, `aria-pressed="true"` is set and the button shows the selected look: `--color-accent-subtle` fill, `--color-fg-accent` label and `--color-accent` border. (L2-041)

### Keyboard and focus

- **AC-19** Given the booking form's "Send request" button after the hair detail field, when the customer presses Tab from that field, then focus lands on the button, and Enter or Space activates it. (L2-041)
- **AC-20** Given a focused link-styled button "See braiders for this style", when the customer presses Enter, then the link is followed, and when they press Space, then nothing is activated. (L2-041)
- **AC-21** Given a button focused by keyboard, when the ring shows, then it is a 2 px `--color-focus-ring` outline offset by 2 px with contrast of at least 3:1 against `--color-bg-surface` and `--color-bg-canvas`, and when the same button is focused by a pointer click, then no ring shows. (L2-041)

### Screen readers

- **AC-22** Given an `iconOnly` button rendered without `aria-label` or `aria-labelledby` in development mode, when it initialises, then the console reports an error naming `hp-button` and the missing label. (L2-041)
- **AC-23** Given a button with `busy` true, when a screen reader reads it, then it reports the name "Send request", the role button and the busy state, and the label never changes to "Working…". (L2-036)

### Theming

- **AC-24** Given the primary button "Send request", when the page theme switches from light to dark, then its fill changes from the light `--color-accent` (plum 600) to the dark value (plum 300) and its label from white to plum 950 without a reload. (L2-042)
- **AC-25** Given each variant in the dark theme, when contrast is measured, then primary and danger labels are at least 4.5:1 against their fills, the secondary border is at least 3:1 against `--color-bg-surface` and the link label is at least 4.5:1 against `--color-bg-surface`. (L2-041)
- **AC-26** Given Windows forced colours, when the buttons render, then every button has a `CanvasText` border, the primary uses a `Highlight` fill with a `HighlightText` label and the focus ring is `Highlight`. (L2-041)

### Responsive

- **AC-27** Given the style detail aside on a 360 px viewport with text enlarged to 200 %, when the primary button "See braiders for this style" renders, then the page does not scroll horizontally, the whole label is visible wrapped over several lines, and the button is taller than 40 px. (L2-042)
- **AC-28** Given 200 % browser zoom, when the "Send request" button renders, then its text scales with the zoom, it stays fully visible and operable and nothing is clipped. (L2-042)
- **AC-29** Given the primary action of the booking form on a phone, when it renders with `size="lg"` and `block`, then its target is at least 44 × 44 CSS px. (L2-041)

### Motion

- **AC-30** Given `prefers-reduced-motion: reduce`, when a button is hovered, then the colour change is instant, and when it is busy, then the spinner keeps turning. (L2-041)

### Menu trigger

- **AC-31** Given a ghost button "More actions" that triggers the menu for HP-1048, when the menu opens and the trigger gets `aria-expanded="true"`, then the button keeps its variant's active fill (`--btn-bg-active`) without the 1 px press offset for as long as the menu is open, and returns to its default look when the menu closes. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/button/`; file `button.ts` exporting the standalone component `Button` with `selector: 'button[hp-button], a[hp-button]'`, `template: '<ng-content />'`, `changeDetection: OnPush`, and scoped `styles` that port the `.btn` rules from `docs/design-system/assets/components.css` using `:host` and `:host(.btn--primary)` selectors so the BEM classes stay on the host. Export it from the library's `public-api.ts`.
- Host bindings: `class.btn` always; `class.btn--primary` … `class.btn--danger`, `class.btn--sm`, `class.btn--lg`, `class.btn--block`, `class.btn--icon` from the inputs; `attr.type` (`<button>` hosts, D-4); `attr.disabled` (`<button>` hosts, D-3); `attr.aria-busy` (`'true'` or `null`); `attr.aria-pressed` (`'true'`, `'false'` or `null`).
- Busy guard: host listeners on `click`, `keydown` and `keyup` call `preventDefault()` and `stopImmediatePropagation()` when `busy` is true, so neither form submission nor consumer `(click)` handlers nor link navigation run. Register them in the constructor so they precede template listeners.
- Toggle: on an uncancelled `click` with `pressed` defined, set `pressed` to its negation (the model emits `pressedChange`).
- Development check: in `ngOnInit`, when `iconOnly` is true and the host has neither `aria-label` nor `aria-labelledby`, `console.error` a message that names `hp-button` (D-9). Production builds skip it (`isDevMode()`).
- Host element detection: inject `ElementRef` and read `tagName` once; `<a>` hosts skip `type` and `disabled`.
- Wrapping (D-5): the ported `.btn` rule has no `white-space: nowrap`; it sets `overflow-wrap: anywhere`, `text-align: center`, `line-height: var(--line-height-snug)` and `padding-block: var(--space-1)`, exactly as `docs/design-system/assets/components.css` does. The design-system button page documents the rule and the rendering's 200 % frames show it.
- Open menu trigger (D-13): the port keeps the stylesheet's `.btn[aria-expanded="true"]` rule.
- No CDK primitive. Composes nothing; icons are projected.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Button.ts`, exported from `src/scenarios/index.ts`, with iterations added to `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is the host a wrapper element (`<hp-button>`) or the native element?* The native element, through attribute selectors `button[hp-button]` and `a[hp-button]`. The design-system layout rules (`.dialog__footer .btn { flex }`, `.form-actions .btn--primary { flex; order }`, `.page-header__actions .btn--primary`) target `.btn` as a direct flex child, and the e2e page objects locate `.btn` by the mocks' markup; a wrapper would break both or need `display: contents`. The native host also keeps `type`, `href`, `disabled`, middle click and every ARIA attribute native, and the component still has one template and scoped styles, as AGENTS.md requires. The selector prefix is `hp-` (HairPop); no earlier convention exists.
- **D-2** *Does busy set `aria-disabled`?* No: `aria-busy="true"` only. The component stylesheet draws `[aria-disabled="true"]` at 50 % opacity, and the design system requires the busy button to keep its colours. Activation is blocked by the component instead.
- **D-3** *What does `disabled` do on an `<a>` host?* Nothing. The design system says a link-styled button has no `disabled`; a page that cannot offer the navigation removes the control or renders a `<button>`.
- **D-4** *What `type` does a `<button>` host get when the consumer sets none?* `type="button"`. The browser default is `submit`, which would let a dialog's "Edit details" or a toggle submit the enclosing form; every mock button sets its type explicitly, and the design-system code sample does too.
- **D-5** *May a label wrap?* Yes, as a safety net; copy is still written to stay on one line at 360 px. The rule first extracted from the mocks was "labels never truncate or wrap" with `white-space: nowrap`. That holds at 320 px with default text, where the longest label fits (measured in the style detail card). It fails when text is enlarged to 200 %: the same button measured wider than a 360 px viewport and the page scrolled horizontally, which breaks L2-042 (text zoom to 200 % must stay readable and operable) and WCAG 1.4.4 and 1.4.10. So the label wraps and the button grows in height; the stylesheet and the design-system button page carry this rule, and the copy rule (shorten the verb phrase) still applies.
- **D-6** *How does a screen's primary mobile action reach 44 px?* With `size="lg"` (48 px) chosen by the page; the component never resizes itself by viewport. The design system offers "large or full width", but full width does not change the height; `.form-actions` and `.page-header__actions` already supply the width.
- **D-7** *Does a submit that is busy, or offline, disable itself or change its label?* No. Busy keeps the label, sets `aria-busy` and keeps focus; the offline form keeps "Send request" enabled and answers with the offline alert. The extracted mocks disabled the submit and relabelled it "Working…"; the design system's button, dialog and spinner pages record that as drift fixed, and the `submitting`, `busy` and `offline` mocks follow this rule.
- **D-8** *Does the component flip `pressed` itself?* Yes: `pressed` is a two-way `model`, flipped on each activation when defined, so a consumer writes `[(pressed)]="saved"` and nothing else. The label stays as the consumer renders it; the design system allows either an unchanged label or an announced change.
- **D-9** *How is a missing `aria-label` on an icon-only button caught?* A development-mode `console.error` naming the component; the button still renders so the page does not break. The design system requires the label but no L2 criterion names a runtime failure, so an error log that the e2e harness treats as a failure is the proportionate check.
- **D-10** *The first mocks used `<a class="btn">` for "Filters", "Request a change", "Cancel request" (opening dialogs) and "Try again" (re-running a request). Which element does the product render?* A `<button>`: the design system's rule is that a control that changes something, opens a dialog or starts a process is a button, and a link only goes somewhere. "View request", "Explore styles", "See braiders for this style", "Request with Nia", "Sign in" and "View appointment" stay links. The mocks render the same elements; the first extraction used links only to let the gallery navigate between screens.
- **D-11** *Does `busy` apply to an `<a>` host?* Yes, with the same guard, which also cancels navigation while busy. One implementation serves both hosts; it is rare on links and never required by a mock.
- **D-12** *Is there an `icon` input?* No. Icons are projected `<svg class="icon" aria-hidden="true">` content before or after the text, as the design-system anatomy shows, so the icon set can change without touching the button API and an icon-only button is just a button whose only content is an icon.
- **D-13** *How does an open menu trigger look?* It holds the variant's active fill through `.btn[aria-expanded="true"]` reading `--btn-bg-active`, without the active transform. The menu CRD (D-4) needs the open trigger to look engaged, and the rule belongs in the button's styles so the button owns every look it can take; `components.css` and the design-system button page carry it. `aria-expanded` and `aria-haspopup` stay consumer attributes set by the menu trigger; the button never reads or writes them.

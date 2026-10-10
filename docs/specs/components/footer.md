# Footer

| Field | Value |
|---|---|
| Selector | `footer[hp-footer]` |
| Library path | `frontend/projects/components/src/lib/footer/` |
| Status | planned |
| Traces to | L2-032, L2-033, L2-034, L2-041, L2-042 |
| Design system | [`footer.html`](../../design-system/components/footer.html) |
| Source mocks | [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`pages/terms/default`](../../mocks/pages/terms/default.html), [`pages/privacy/default`](../../mocks/pages/privacy/default.html), [`pages/booking-request/default`](../../mocks/pages/booking-request/default.html), [`pages/account-settings/default`](../../mocks/pages/account-settings/default.html), [`dialogs/cookie-preferences/default`](../../mocks/dialogs/cookie-preferences/default.html), [`notifications/cookie-consent/info`](../../mocks/notifications/cookie-consent/info.html) |
| Rendering | [`footer.html`](footer.html) |

## Purpose and scope

The footer closes every HairPop screen with the brand line, "HairPop · Made for confident hair decisions", and the secondary destinations people look for at the bottom of a page: Help, Cookie preferences, Terms and Privacy. They must always be findable but never compete with the task.

Use something else when:

- the destination is primary (Styles, Braiders, Appointments): the top bar owns it ([`top-bar.md`](top-bar.md)); never repeat the primary navigation here;
- the control is an action: actions belong to the page or a dialog; the one exception is the Cookie preferences link, which opens its dialog (D-3).

Out of scope:

- The anchors' own styling and behaviour. Each footer link is the Link component (`a[hp-link]`, `variant="inherit"`, owned by the link CRD); the footer supplies the container rules that colour and size it.
- Opening the cookie preferences dialog. The footer emits `dialogRequested`; the application opens the dialog (dialog CRD).
- Keeping fixed toasts and the cookie banner from covering a focused footer link (WCAG 2.4.11). The toast and cookie-consent components reserve their own space.
- The legal text and its effective date. The Terms and Privacy pages own them.

## Usage

All 181 mocks end with the same product footer:

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Every page, dialog and notification mock (181), and every product screen (design system *Variants*, product footer; the cookie banner it pairs with is `notifications/cookie-consent/*`) | brand line in a `<p>` + four links in a `ul.site-footer__links` (D-2, D-4) | "Help", "Cookie preferences" (opens `dialogs/cookie-preferences`), "Terms", "Privacy" | default, hover, focus, active | canvas |
| `pages/booking-request/*`, `pages/sign-up/*`, `pages/account-settings/*` | same footer; the flows link to Terms and Privacy from here as well as in their own copy | as above | — | canvas |
| `pages/terms/*`, `pages/privacy/*`, `pages/help/*` | same footer on the destinations themselves | as above | link to the current page stays a plain link | canvas |
| Error pages (`not-found`, `forbidden`, `server-error`, `offline`) | same footer; the shell is kept (layout foundation) | as above | — | canvas |

Every row is buildable with `brandLine`, `links` (one to six items) and `opensDialog` on the cookie item.

## Anatomy

1. **Container** — `.site-footer` on the host `<footer>`: a wrapping flex row, `justify-content: space-between`, `--space-3` gaps, top hairline in `--color-border-default`, padding `--space-6` block and `--layout-margin` inline, `--text-body-sm` in `--color-fg-muted`, on the canvas.
2. **Brand line** — a `<p>` holding `brandLine`, capped at `--layout-measure`.
3. **Links** — `ul.site-footer__links`: an unstyled list laid out as a wrapping row, `--space-1` row gap and `--space-4` column gap. Each `<li>` holds one Link component anchor, at least 24 px (`--target-min`) tall, inheriting the muted colour, underlined.

Host: the component uses an attribute selector, so the host **is** the native `<footer>` and carries `.site-footer` (D-1). Placed as a direct child of `.product-shell`, outside `<main>`, it is the page's `contentinfo` landmark.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `brandLine` | `string` | — | yes | The brand sentence ("HairPop · Made for confident hair decisions"). Rendered in a `<p>`. |
| `links` | `readonly FooterLink[]` | — | yes | One to six links in display order. HairPop passes Help, Cookie preferences, Terms, Privacy. More than six logs a development-mode `console.error` naming `hp-footer` (D-8). |

```ts
type Commands = string | readonly unknown[];
interface FooterLink {
  readonly id: string;            // "terms"
  readonly label: string;         // "Terms"
  readonly link: Commands;        // '/terms'
  readonly opensDialog?: boolean; // true only for Cookie preferences
}
```

- Each link renders as `<a hp-link variant="inherit" [routerLink]="link">`. For an item with `opensDialog`, the anchor also has `aria-haspopup="dialog"`, and activation is intercepted: navigation is cancelled and `dialogRequested` emits the item's `id` (D-3). Its `link` is the fallback destination when scripts have not loaded (`/privacy`, where the cookie section lives).
- Inputs are signal inputs. Every user-facing string is an input; the component renders no copy of its own.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `dialogRequested` | `string` (the item's `id`) | A link with `opensDialog: true` is activated by click, touch or Enter. Navigation does not happen. Modified clicks (Ctrl, Meta, Shift, middle button) are not intercepted, so the fallback page opens in a new tab as for any link. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | — | Content comes from `brandLine` and `links`, so the list markup, spacing and dialog behaviour stay consistent on every screen. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Simple | two links | Terms and Privacy only, for a context without help or cookie choices (design system *Variants*). HairPop's shell uses the product footer (D-2). |
| With help and cookie links | four links | The product footer: Help, Cookie preferences, Terms, Privacy. |

One size. Padding follows `--layout-margin` per breakpoint (16 → 32 → 48 px), so the footer lines up with the page content and the top bar.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Link, default | — | `--color-fg-muted` (inherited), underline `--border-width-hairline` | Link, named by its label |
| Link, hover | `:hover` | `--color-fg-default`; underline `--border-width-thick` | — |
| Link, active | `:active` | `--color-fg-default` (hover colour kept) | — |
| Link, focus | `:focus-visible` | Shared ring: `--focus-ring-width` of `--color-focus-ring`, offset `--focus-ring-offset` | — |
| Link, visited | `:visited` | Same as default (the set is small and stable) | — |
| Dialog link | `opensDialog` | Same look as the other links | "Cookie preferences, link, has popup dialog" |
| Wrapped | content wider than the row | Brand line and links stack, left-aligned; links wrap as a row | Order unchanged |
| Print | `@media print` | Footer prints (legal links stay useful on paper) | — |

Footer links are never disabled. The link to the page the customer is on stays a plain link without `aria-current`; the footer is not navigation.

## Markup

Rendered DOM. Classes and structure are the e2e contract; each anchor's `link link--inherit` classes come from the Link component (link CRD).

```html
<!-- rendered: product footer -->
<footer class="site-footer">
  <p>HairPop · Made for confident hair decisions</p>
  <ul class="site-footer__links">
    <li><a class="link link--inherit" href="/help">Help</a></li>
    <li><a class="link link--inherit" href="/privacy" aria-haspopup="dialog">Cookie preferences</a></li>
    <li><a class="link link--inherit" href="/terms">Terms</a></li>
    <li><a class="link link--inherit" href="/privacy">Privacy</a></li>
  </ul>
</footer>
```

```html
<!-- rendered: simple variant -->
<footer class="site-footer">
  <p>HairPop · Made for confident hair decisions</p>
  <ul class="site-footer__links">
    <li><a class="link link--inherit" href="/terms">Terms</a></li>
    <li><a class="link link--inherit" href="/privacy">Privacy</a></li>
  </ul>
</footer>
```

Consumer template (the application shell):

```html
<footer hp-footer brandLine="HairPop · Made for confident hair decisions" [links]="footerLinks"
        (dialogRequested)="openCookiePreferences()"></footer>
```

```ts
readonly footerLinks: readonly FooterLink[] = [
  { id: 'help', label: 'Help', link: '/help' },
  { id: 'cookies', label: 'Cookie preferences', link: '/privacy', opensDialog: true },
  { id: 'terms', label: 'Terms', link: '/terms' },
  { id: 'privacy', label: 'Privacy', link: '/privacy' },
];
```

Free to change: nothing; the anchor classes follow the link CRD if it changes them.

## Design

- Container: `display: flex; flex-wrap: wrap; justify-content: space-between; gap: --space-3`; `padding: --space-6 --layout-margin`; `border-top: --border-width-hairline solid --color-border-default`; `font: --text-body-sm`; `color: --color-fg-muted`; transparent over `--color-bg-canvas`.
- Brand line: `<p>`, `max-width: --layout-measure`.
- Links list: `display: flex; flex-wrap: wrap; gap: --space-1 --space-4; list-style: none; padding: 0; margin: 0`.
- Each link: `color: inherit; display: inline-flex; align-items: center; min-height: --target-min`; regular weight from the container (D-5); underline from the base link rule; hover colour `--color-fg-default`.
- Elevation, layer and motion: none; colour changes are instant (design system *Motion*).

Component tokens: none. The footer reads semantic tokens; the Link's colour is inherited from the container.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Brand line and links | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |
| Link hover and active | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Top rule | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Background (page) | `--color-bg-canvas` | `--palette-gray-50` | `--palette-gray-950` |
| Focus ring | `--color-focus-ring` | `--palette-plum-600` | `--palette-plum-300` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-canvas` | 4.5:1 | Brand line and links |
| `--color-fg-default` | `--color-bg-canvas` | 4.5:1 | Hovered link |
| `--color-focus-ring` | `--color-bg-canvas` | 3:1 | Focus ring on the page |

Links are underlined in every state, so they are distinguishable from the brand line without colour (WCAG 1.4.1). Forced colours: anchors take the system `LinkText` colour and the ring maps to `Highlight`.

## Responsive behaviour

- The layout comes from `flex-wrap`, not from a breakpoint. When the brand line and the links fit on one line they sit apart (brand left, links right); otherwise the links wrap below the brand line, both left-aligned, and the links wrap among themselves with 4 px row gaps. Measured with the four product links: they wrap below the brand line at 560 px and fit beside it at 768 px; with two links they already fit beside it at 560 px.
- At 320 px the four links wrap onto two rows below the brand line (measured: Privacy starts a second row); nothing scrolls horizontally.
- At 200 % text the brand line wraps onto several lines and the links wrap one or two per row; measured at 320 px, nothing overflows.
- Targets: each link is at least 24 px tall with 16 px between links in a row and 4 px between rows, so wrapped rows keep 24 px targets (WCAG 2.5.8).

## Accessibility

### Role and pattern

`<footer class="site-footer">` as a direct child of the shell, outside `<main>`, is the `contentinfo` landmark. Links sit in a `<ul>`, so screen readers announce "list, 4 items". No ARIA beyond `aria-haspopup="dialog"` on the Cookie preferences link. The links follow the [APG Link pattern](https://www.w3.org/WAI/ARIA/apg/patterns/link/).

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Reaches the footer links last, in visual order. |
| <kbd>Enter</kbd> | Follows the link; on Cookie preferences, requests the dialog. |

### Focus

The shared 2 px ring with a 2 px offset, at least 3:1 against the canvas. When the cookie preferences dialog closes, the dialog returns focus to the Cookie preferences link (dialog rules).

### Labelling

Link text is the destination's name ("Help", "Terms", "Privacy"), matching the destination's `<h1>` ("How can we help?", "Terms of use", "Privacy at HairPop") closely enough to be recognised. No decorative separators between links.

### Announcements

None.

### Motion

None; colour changes are instant.

## Content and internationalisation

- The brand line stays "HairPop · Made for confident hair decisions" everywhere.
- Link labels are one or two words in sentence case: "Help", "Cookie preferences", "Terms", "Privacy".
- Order: Help, Cookie preferences, Terms, Privacy. Never more than six links.
- Translatable inputs: `brandLine`, every link `label`. No data values.
- Longer translations wrap; nothing truncates.

## Performance

- Change detection: `OnPush`, signal inputs; the template is a `@for` over `links` with `track id`.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Footer.ts` renders the product footer, "HairPop · Made for confident hair decisions" with Help, Cookie preferences, Terms and Privacy, inside `provideRouter([])`; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: none; one footer per page.
- Regression rule: a change to its template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: static content rendered on the server; nothing loads later.
- Weight: `@angular/core`, `@angular/router`, and the library's Link.

## Acceptance criteria

### Rendering

- **AC-1** Given the product footer, when any HairPop page renders, then the host is `<footer class="site-footer">` exposed as the contentinfo landmark outside `<main>`, holding a `<p>` "HairPop · Made for confident hair decisions" and a `ul.site-footer__links` list of four items, with no "·" separator between links. (L2-041)
- **AC-2** Given the footer links, when they render, then they read Help, Cookie preferences, Terms and Privacy in that order, each a native `<a href>` inside its own `<li>`. (L2-041)

### Destinations

- **AC-3** Given Maya part-way through the booking request form, when she activates "Terms" in the footer, then the public Terms of use page opens without asking her to sign in; and from account settings, "Privacy" opens Privacy at HairPop. (L2-033)
- **AC-4** Given a visitor who is not signed in, when they activate "Terms" or "Privacy" in the footer, then the page opens with its content and effective date, without a sign-in step. (L2-033)
- **AC-5** Given any screen, when a visitor activates "Help" in the footer, then the Help page opens. (L2-032)
- **AC-6** Given Maya dismissed the cookie banner on her first visit, when she activates "Cookie preferences" in the footer, then `dialogRequested` emits "cookies", the page does not navigate, and the cookie preferences dialog opens showing her saved choice. (L2-034)
- **AC-7** Given the Cookie preferences link, when a screen reader reads it, then it announces a link named "Cookie preferences" that opens a dialog (`aria-haspopup="dialog"`). (L2-034)

### Keyboard and focus

- **AC-8** Given keyboard focus in the page content, when Maya presses Tab past the last content control, then focus visits Help, Cookie preferences, Terms and Privacy in that order, and Enter on each follows it (or requests the dialog). (L2-041)
- **AC-9** Given a footer link focused by keyboard, when the ring shows, then it is a 2 px `--color-focus-ring` outline offset by 2 px with at least 3:1 contrast against `--color-bg-canvas`. (L2-041)
- **AC-10** Given the cookie preferences dialog opened from the footer, when Maya closes it with Escape, then focus returns to the Cookie preferences link. (L2-041)

### States and theming

- **AC-11** Given the light theme, when the footer renders and a link is hovered, then text and links are `--color-fg-muted` with at least 4.5:1 against the canvas, links are underlined, and the hovered link turns `--color-fg-default` with a `--border-width-thick` underline. (L2-041)
- **AC-12** Given the light theme, when Maya switches to dark, then without a reload the text becomes `--palette-gray-350` on the `--palette-gray-950` canvas with a `--palette-gray-750` top rule, keeping at least 4.5:1. (L2-042)

### Responsive

- **AC-13** Given a 320 px viewport, when the footer renders, then the brand line and the links stack left-aligned, the links wrap with at least 16 px between neighbours in a row, every link is at least 24 px tall, and the page does not scroll horizontally. (L2-042)
- **AC-14** Given a 768 px viewport, when the footer renders, then the brand line sits at the left and the four links at the right on one line, both inset by `--layout-margin`. (L2-042)
- **AC-15** Given 320 px with text enlarged to 200 %, when the footer renders, then the brand line wraps, the links wrap, every link stays fully visible and operable, and nothing scrolls horizontally. (L2-042)

### Performance

Render cost is measured by the `Footer` perf-test scenario and gated by `--fail-on-regression`; no L2 requirement covers client render cost, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/footer/`; file `footer.ts` exporting the standalone component `Footer` with `selector: 'footer[hp-footer]'`, `changeDetection: OnPush`, scoped `styles` porting `.site-footer`, `.site-footer a` and `.site-footer__links` from `components.css` (`:host` for `.site-footer`). Export it and `FooterLink` from `public-api.ts`.
- Host binding: `class.site-footer` always. The `.footer` alias in `components.css` is not rendered by the component.
- Template: `<p>{{ brandLine() }}</p><ul class="site-footer__links">@for (item of links(); track item.id) { <li><a hp-link variant="inherit" [routerLink]="item.link" [attr.aria-haspopup]="item.opensDialog ? 'dialog' : null" (click)="activate($event, item)">{{ item.label }}</a></li> }</ul>`.
- Hover colour: `components.css` sets the Link component's inherit-variant hover hook on the footer (`.site-footer { --link-inherit-hover-fg: var(--color-fg-default); }`, link CRD D-3) and leaves the weight hook unset, so links stay regular weight (D-5); the component ports that rule onto `:host`.
- `activate`: when `opensDialog` and the click has no modifier keys and is the primary button, call `preventDefault()` (RouterLink then does not navigate) and emit `dialogRequested`.
- Development check (D-8): more than six links logs `console.error` naming `hp-footer`; skipped in production.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Footer.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Wrapper element or the native `<footer>`?* The native element, through the attribute selector `footer[hp-footer]`, with `.site-footer` on the host. The `contentinfo` landmark comes from the native element, and `.product-shell`'s column layout (with `.product-main { flex: 1 }` pushing the footer to the bottom of short pages) expects the footer as its direct child, as in the mocks.
- **D-2** *The first mocks showed Terms and Privacy only, and the design system recommended adding Help and Cookie preferences "once the cookie banner ships". Which does the product render?* All four: Help, Cookie preferences, Terms, Privacy, which the design system and the mocks now show. The cookie banner exists in the mocks (`notifications/cookie-consent/*`), and L2-034 requires that a saved choice "can be revised in Cookie preferences" after the banner is dismissed; the footer is the design system's route back. Help in the footer is the design system's own variant and does not repeat the top bar's journey links.
- **D-3** *Cookie preferences opens a dialog. Is it a button (Button D-10's rule) or a link?* A link, as the design system's footer page specifies ("a link that opens a dialog is the only exception"), so it keeps the footer link look and its place in the list. It is honest about its behaviour (`aria-haspopup="dialog"`), opens the dialog on activation through `dialogRequested`, and still has a real `href` to the Privacy page as a fallback before scripts load and for modified clicks.
- **D-4** *The first mocks put the brand line in a `<span>` and separated the links with "·" glyphs inside one `<span>`.* The design system's markup applies: a `<p>` and a `<ul>` list, with spacing from the list gap. The dot is read aloud and crowds the targets (design system *Do and don't*); the design-system page records it as drift fixed during extraction, and the mocks now render the list.
- **D-5** *The Link component's `inherit` variant becomes semibold inside alerts and toasts. What weight do footer links use?* Regular, from `--text-body-sm`: the footer's states table and anatomy show plain muted links. The footer relies on `inherit` taking both colour and weight from its container here.
- **D-6** *Do visited links change colour?* No; the set is small and stable (design system *States*).
- **D-7** *Does the link to the current page get `aria-current`?* No. The footer is not a navigation landmark and the design system specifies no current state; the page's `<h1>` names the page.
- **D-8** *How is "never more than six links" enforced?* A development-mode `console.error` naming the component; it still renders every link. No L2 requirement covers the limit; it is a design-system content rule.
- **D-9** *The design system first said the footer wraps "below about 560px". Is that a breakpoint?* No: wrapping comes from `flex-wrap` and depends on the number and length of links (measured: four links wrap below the brand line at 560 px; two links fit beside it). The CRD specifies the behaviour, not a pixel value.

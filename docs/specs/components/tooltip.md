# Tooltip

| Field | Value |
|---|---|
| Selector | `hp-tooltip` |
| Library path | `frontend/projects/components/src/lib/tooltip/` |
| Status | planned |
| Traces to | L2-041, L2-042 |
| Design system | [`tooltip.html`](../../design-system/components/tooltip.html) |
| Source mocks | [`dialogs/filter-braiders/default`](../../mocks/dialogs/filter-braiders/default.html), [`dialogs/change-appointment/default`](../../mocks/dialogs/change-appointment/default.html), [`dialogs/report-review/default`](../../mocks/dialogs/report-review/default.html), [`dialogs/request-review/default`](../../mocks/dialogs/request-review/default.html), [`dialogs/cookie-preferences/default`](../../mocks/dialogs/cookie-preferences/default.html) |
| Rendering | [`tooltip.html`](tooltip.html) |

## Purpose and scope

A tooltip shows the name of an icon-only control, or a short supplementary hint, when a pointer hovers it or the keyboard focuses it: "Close dialog", "Edit request", "Search styles /". It repeats what the control's `aria-label` already says, so the name never lives only in the tooltip, and it never holds anything the customer must read to finish a task.

The component wraps one focusable control in the design system's `.has-tooltip` wrapper and renders the `.tooltip` bubble through the Angular CDK Overlay, so the bubble is never clipped by a scrolling dialog panel or the viewport edge (D-1).

Use something else when:

- the information is needed to complete a task (the price rule "Nia confirms the final price and time", a cancellation policy): put it on the page as text or a field hint;
- the content has links, buttons or fields: use a [menu](menu.md) or a [dialog](dialog.md);
- the control already shows its label as text: no tooltip (design-system *Content*: never repeat a visible label).

Out of scope:

- The control's accessible name. The projected [button](button.md) carries `aria-label`; the tooltip only describes it.
- Explaining why a control is unavailable. A disabled button cannot take focus, so the page explains it in visible text (the offline alert does this).
- The toast and alert dismiss controls (`.close`). Their `aria-label` names the message ("Dismiss: Time confirmed"); the design system gives them no tooltip.

## Usage

The form and confirmation dialog mocks wrap their close control in `.has-tooltip` with a hidden `.tooltip.tooltip--below` reading "Close dialog", which the stylesheet reveals on hover and focus (the static stand-in for the overlay, D-1; below, because the panel clips a bubble above its top edge). The other rows come from the design system, for icon-only controls later screens use. One row per configuration:

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Close control in every form and confirmation dialog header (`dialogs/filter-braiders`, `request-review`, `change-appointment`, `report-review`, `cookie-preferences`) | text | `button[hp-button]` ghost, `iconOnly`, `aria-label="Close dialog"`; text "Close dialog" | hidden, hover, keyboard focus, flipped below near the top of a bottom sheet | raised dialog panel, near the panel's top edge |
| Icon-only edit action on a request (design system *Anatomy*) | text | `button[hp-button]` secondary, `iconOnly`, `aria-label="Edit request"`; text "Edit request" | hidden, hover, focus | surface (card) |
| Filters icon button on a narrow search row (design system *States*) | text | `button[hp-button]` secondary, `iconOnly`, `aria-label="Filters"`; text "Filters" | hidden, hover, focus, disabled trigger (no tooltip) | surface |
| Style search shortcut (design system *Variants*) | with shortcut | `button[hp-button]` secondary, `iconOnly`, `aria-label="Search styles"`; text "Search styles", shortcut "/" | hidden, hover, focus | surface |
| Icon-only menu trigger for an appointment's overflow actions (menu CRD) | text | `button[hp-button]` ghost, `iconOnly`, `aria-label="More actions for HP-1048"`, with `hpMenuTriggerFor`; text "More actions" | hidden, hover, focus; hidden while its menu is open | surface (card) |

Every row is buildable with the API below: `text`, optional `shortcut`, and one projected control.

## Anatomy

1. **Wrapper** — `.has-tooltip` on the `hp-tooltip` host. `display: inline-flex`, so it sizes to the control and does not change the control's layout in a header, footer or cluster.
2. **Trigger** — the one projected focusable control (`button[hp-button]` with `iconOnly`). While the bubble shows, its `aria-describedby` includes the bubble's id.
3. **Bubble** — `span.tooltip[role="tooltip"]` with a generated id, rendered in a CDK overlay pane at `--z-tooltip`. `--color-bg-inverse` background, `--color-fg-inverse` text, `--text-caption`, `--space-1` × `--space-2` padding, `--radius-sm`, `--shadow-2`, `white-space: nowrap`.
4. **Arrow** — `.tooltip::after`, a triangle of `--space-1` in the bubble colour pointing at the trigger: down when the bubble is above, up when it is below (`.tooltip--below`, D-3).
5. **Shortcut (optional)** — `kbd` after the text, transparent background, `currentColor` border, `--space-1` start margin.

Host: `hp-tooltip` is the wrapper element and carries `.has-tooltip`; the control inside it is the consumer's own element. The bubble is not a child of the host: the CDK attaches it to the overlay container only while it shows, and removes it when it hides.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `text` | `string` | — | yes | The bubble text. Two to five words, sentence case, no full stop. For an icon-only control it equals the control's `aria-label`. |
| `shortcut` | `string` | `''` | no | When set, rendered as `<kbd>` after the text ("/"). Visible text only; it is also in the description. |
| `position` | `'above' \| 'below'` | `'above'` | no | Preferred side. The CDK flips to the other side, and shifts along the edge, when the preferred side would leave the viewport (D-2). |

- Inputs are signal inputs.
- Every string is an input; the component renders no copy of its own.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | — | A tooltip has no actions; it only shows and hides. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default | Exactly one focusable control, normally `button[hp-button]` with `iconOnly` and `aria-label` | Declared once. The component finds the first focusable element inside the host and treats it as the trigger. A trigger without an accessible name logs a development-mode console error naming `hp-tooltip` (D-6). |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Text | — | Names an icon-only control: "Close dialog", "Edit request", "Filters". |
| With shortcut | `kbd` inside `.tooltip` | A desktop power feature: "Search styles" with "/". |
| Below | `.tooltip--below` (set by the component when flipped) | Any tooltip whose trigger is too close to the top of the viewport, such as the close control of a bottom sheet. |

One size: the bubble is as wide as its text on one line, with `--text-caption` type.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Hidden | default | No bubble in the DOM | Trigger has no `aria-describedby` for the tooltip |
| Visible on hover | pointer rests on the trigger for 300 ms, on devices that can hover (`(hover: hover)`) | Bubble fades in over `--duration-fast` with `--ease-standard`, `--space-2` from the trigger | `aria-describedby` added |
| Visible on keyboard focus | trigger focused from the keyboard (CDK `FocusMonitor` origin `keyboard`) | Bubble shows at once, no delay | Description (the tooltip text) exposed with the focused control (D-5) |
| Hovered bubble | pointer moves from the trigger onto the bubble | Bubble stays (WCAG 1.4.13 hoverable) | — |
| Hiding | pointer leaves trigger and bubble for `--duration-fast`, trigger blurs, <kbd>Esc</kbd>, or the trigger is activated | Bubble removed at once | `aria-describedby` reference removed |
| Flipped | not enough room on the preferred side | `.tooltip--below`, arrow points up | — |
| Disabled trigger | projected control has `disabled` | Never shows | — |
| Touch | pointer is touch, or focus came from a tap | Never shows; the control's `aria-label` still names it | — |
| Reduced motion | `prefers-reduced-motion: reduce` | Appears without the fade (the tokens zero `--duration-fast`) | — |

## Markup

```html
<!-- rendered: hidden -->
<hp-tooltip class="has-tooltip">
  <button class="btn btn--ghost btn--icon" type="button" aria-label="Close dialog">
    <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
  </button>
</hp-tooltip>
```

```html
<!-- rendered: visible (bubble in the CDK overlay container) -->
<hp-tooltip class="has-tooltip">
  <button class="btn btn--ghost btn--icon" type="button" aria-label="Close dialog" aria-describedby="hp-tooltip-4">…</button>
</hp-tooltip>
<div class="cdk-overlay-container">
  <div class="cdk-overlay-connected-position-bounding-box">
    <div class="cdk-overlay-pane">
      <span class="tooltip" role="tooltip" id="hp-tooltip-4">Close dialog</span>
    </div>
  </div>
</div>
```

```html
<!-- rendered: with shortcut, flipped below -->
<span class="tooltip tooltip--below" role="tooltip" id="hp-tooltip-7">Search styles<kbd>/</kbd></span>
```

Consumer templates:

```html
<!-- consumer: dialog close control (rendered by hp-dialog) -->
<hp-tooltip text="Close dialog">
  <button hp-button variant="ghost" iconOnly aria-label="Close dialog" (click)="dismiss()">
    <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
  </button>
</hp-tooltip>

<!-- consumer: shortcut -->
<hp-tooltip text="Search styles" shortcut="/">
  <button hp-button iconOnly aria-label="Search styles" (click)="focusSearch()">
    <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4"/></svg>
  </button>
</hp-tooltip>
```

An existing `aria-describedby` on the control is kept; the tooltip's id is appended while it shows and removed when it hides. Free to change: the `cdk-*` wrapper classes and the id format.

## Design

- Bubble: padding `--space-1` block and `--space-2` inline; `--radius-sm`; `--shadow-2`; `--text-caption`; `white-space: nowrap`.
- Offset: `--space-2` between the trigger edge and the bubble, applied as the CDK position offset; the arrow (`--space-1` border triangle) sits in that gap.
- Position: centred on the trigger; preferred side above; fallback below; `withViewportMargin` of `--space-2`, so the bubble shifts along the edge instead of clipping at 320 px.
- Layer: the overlay wrapper's `z-index` is `--z-tooltip`, above dialogs (`--z-modal`) and toasts (`--z-toast`) (dialog D-8).
- Motion: opacity transition over `--duration-fast` with `--ease-standard` on show; hide is instant; hover delay 300 ms (D-4).
- Pointer: the bubble takes pointer events in the product (`pointer-events: auto`), unlike the documentation rule, so it is hoverable (D-7).
- Wrapper: `.has-tooltip` is `position: relative; display: inline-flex`. The design system's `.has-tooltip:hover .tooltip` CSS reveal does not apply in the product because the bubble is not a descendant; it stays for the documentation pages.

Component tokens: none. The bubble reads `--color-bg-inverse` and `--color-fg-inverse` directly; they swap per theme.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Bubble and arrow | `--color-bg-inverse` | `--palette-gray-900` | `--palette-gray-100` |
| Text and shortcut border | `--color-fg-inverse` | `--palette-white` | `--palette-gray-900` |

The bubble is inverse in both themes: dark grey with light text on light pages, light grey with dark text on dark pages, so it always contrasts with the page behind it.

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-inverse` | `--color-bg-inverse` | 4.5:1 | Tooltip text and shortcut |
| `--color-bg-inverse` | `--color-bg-canvas` | 3:1 | Bubble edge against the page (design-system rule, measured 15.6:1 light, 16.5:1 dark) |
| `--color-bg-inverse` | `--color-bg-surface-raised` | 3:1 | Bubble edge against a dialog panel |

Forced colours: the bubble gets a `--border-width-hairline` `CanvasText` border so it stays distinct when backgrounds are replaced (D-8).

## Responsive behaviour

- The bubble is placed by the CDK flexible connected position strategy: above and centred, else below, shifted to keep `--space-2` from every viewport edge. At 320 px a tooltip on a trigger at the screen edge shifts inward and is never clipped.
- In a dialog the bubble is outside the panel's scroll container. Measured: with the in-place documentation `.has-tooltip` CSS and the bubble above, the close-control tooltip of the filter braiders dialog extends 12 px above the panel and is clipped by its `overflow: auto` (D-1).
- Text never wraps. The longest product text, "Search styles" with "/", measures 119 px at default text and 237 px at 200 % text (measured in Chromium), so it fits a 320 px viewport with the `--space-2` margins.
- Touch devices (`hover: none`) never show tooltips; icon-only controls keep their `aria-label`, and the trigger keeps its own 40 × 40 px target.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available.

## Accessibility

### Role and pattern

[APG Tooltip](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/): the bubble has `role="tooltip"` and an id; the trigger references it with `aria-describedby` while it shows. The tooltip text repeats the icon-only control's `aria-label`, so the name never depends on the tooltip.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Focusing the trigger from the keyboard shows the tooltip at once. Moving focus away hides it. |
| <kbd>Esc</kbd> | Hides the tooltip without moving focus (WCAG 1.4.13 dismissible). The tooltip's overlay receives the key first, so it does not also close an enclosing dialog or menu; a second <kbd>Esc</kbd> does. |

### Focus

Focus stays on the trigger; the bubble is never focusable. It stays visible while the pointer is over the trigger or the bubble (hoverable) and until blur or <kbd>Esc</kbd> (persistent).

### Labelling

- The trigger's name comes from its `aria-label`; the tooltip adds `aria-describedby` only while it shows, so no reference ever points at a missing element.
- Shortcuts use `<kbd>`.

### Announcements

None. The description is read with the focused control; the tooltip has no live region.

### Motion

A fade in over `--duration-fast`; instant hide. Under `prefers-reduced-motion: reduce` the token is zeroed, so it appears in place.

## Content and internationalisation

- Sentence case, no full stop, two to five words: "Close dialog", "Edit request", "Filters".
- Start with the verb for actions; use the noun for indicators ("Unread updates").
- The text equals the control's `aria-label`, or adds a hint after it; never a different name.
- Translatable inputs: `text`, `shortcut` (the key may differ by keyboard layout). Data values: none.
- Long strings never wrap; copy stays within five words. A hint that needs a second line belongs on the page.

## Performance

- Change detection: `OnPush`, signal inputs. Nothing is created until the first show: no overlay, no portal, no listeners beyond `pointerenter`, `pointerleave` and the `FocusMonitor` subscription on the host.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Tooltip.ts` renders the dialog close control, `<hp-tooltip text="Close dialog">` around a ghost icon-only `button[hp-button]`, in its hidden state (the state every page renders); iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: `Dialog` (the close control).
- Regression rule: a change to the template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: the bubble is in an overlay, so showing it never shifts the page.
- Weight: `@angular/cdk/overlay` and `@angular/cdk/a11y` (`FocusMonitor`) only.
- No L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `<hp-tooltip text="Close dialog">` around a ghost icon-only button labelled "Close dialog", when it renders, then the host has the class `has-tooltip`, the button keeps its `aria-label`, and no `.tooltip` element exists in the document. (L2-041)
- **AC-2** Given that close control in the filter braiders dialog, when the pointer rests on it for 300 ms, then a `span.tooltip[role="tooltip"]` reading "Close dialog" appears in the CDK overlay container, centred above the button with a `--space-2` gap, and the button's `aria-describedby` contains its id. (L2-041)
- **AC-3** Given `<hp-tooltip text="Search styles" shortcut="/">`, when it shows, then the bubble reads "Search styles" followed by a `kbd` "/". (L2-041)

### States

- **AC-4** Given a visible tooltip, when the pointer moves from the button onto the bubble, then the bubble stays visible, and when the pointer leaves both, then it disappears and the `aria-describedby` reference is removed. (L2-041)
- **AC-5** Given the "Filters" icon button with `disabled`, when it is hovered, then no tooltip appears. (L2-041)
- **AC-6** Given a touch tap on the "Edit request" icon button, when the button gains focus, then no tooltip appears and the button is still named "Edit request". (L2-041)

### Keyboard and focus

- **AC-7** Given the close control of the change dialog, when the customer Tabs to it, then the tooltip "Close dialog" shows without delay, and when they Tab away, then it hides. (L2-041)
- **AC-8** Given the close control focused with its tooltip visible inside the change dialog, when the customer presses Esc, then the tooltip hides, focus stays on the button and the dialog stays open; a second Esc closes the dialog. (L2-041)
- **AC-9** Given an icon-only button already described by `aria-describedby="hint-1"`, when its tooltip shows and hides, then the attribute reads `hint-1 hp-tooltip-N` while visible and `hint-1` again afterwards. (L2-041)

### Screen readers

- **AC-10** Given `hp-tooltip` wrapped around an icon-only button with no `aria-label` or `aria-labelledby` in development mode, when it initialises, then the console reports an error naming `hp-tooltip` and the unnamed trigger. (L2-041)

### Theming

- **AC-11** Given the tooltip "Edit request", when the theme switches from light to dark, then the bubble changes from `--color-bg-inverse` grey 900 with white text to grey 100 with grey 900 text, and the text contrast stays at least 4.5:1 in both. (L2-041)

### Responsive

- **AC-12** Given a bottom-sheet dialog at 360 × 640 px whose close control is too near the top of the viewport for the bubble above, when the tooltip shows, then it opens below the control with `.tooltip--below`, its arrow points up, and no part of it is clipped. (L2-042)
- **AC-13** Given an icon-only trigger 4 px from the right edge of a 320 px viewport, when its tooltip shows, then the bubble stays at least `--space-2` inside the viewport and the page does not scroll horizontally. (L2-042)
- **AC-14** Given the close control inside the filter braiders dialog at 1280 px, when its tooltip shows, then the whole bubble is visible above the panel's top edge instead of being clipped by the panel. (L2-042)

### Motion

- **AC-15** Given `prefers-reduced-motion: reduce`, when a tooltip shows, then it appears without the opacity transition. (L2-041)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/tooltip/`; file `tooltip.ts` exporting the standalone component `Tooltip` with `selector: 'hp-tooltip'`, `host: { class: 'has-tooltip' }`, template `<ng-content />` plus an `<ng-template>` for the bubble, `OnPush`. Export it from `public-api.ts`.
- Overlay: on first show, create one `OverlayRef` with `overlay.position().flexibleConnectedTo(trigger).withPositions([above, below]).withViewportMargin(8).withPush(true)`, `scrollStrategy: overlay.scrollStrategies.reposition()`, no backdrop; set `overlayRef.hostElement.style.zIndex = 'var(--z-tooltip)'`. Attach a `TemplatePortal` of the bubble on show and detach on hide; reuse the overlay; dispose it on destroy. Listen to `positionChanges` to toggle `.tooltip--below`.
- Show and hide: `pointerenter` (when `matchMedia('(hover: hover)')` and `event.pointerType !== 'touch'`) starts a 300 ms timer; `FocusMonitor.monitor(trigger)` shows at once for origin `keyboard`; `pointerleave` on host and bubble start a `--duration-fast` hide grace; `blur`, the trigger's `click` and the overlay's `keydownEvents` Escape (with `preventDefault` and `stopPropagation`) hide at once.
- `aria-describedby`: append the id on show, remove only that id on hide.
- Port the `.tooltip` rules into the component's styles with `ViewEncapsulation.None` (the bubble renders outside the host), overriding `position: relative`, `pointer-events: auto` and adding `.tooltip--below::after { top: auto; bottom: 100%; border-top-color: transparent; border-bottom-color: var(--color-bg-inverse); }`. `components.css` defines `.tooltip--below`, the `--tooltip-arrow-x` arrow position and the forced-colours border (D-2, D-3, D-8); the port keeps them.
- Composes nothing; the trigger is projected.
- Perf-test scenario `frontend/projects/perf-test/src/scenarios/Tooltip.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is the bubble rendered in place inside `.has-tooltip` (the design-system CSS reveal) or in an overlay?* In a CDK overlay. Measured in Chromium: the in-place bubble of the dialog close control sits 12 px above the panel's top edge and the panel's `overflow: auto` clips it; at the viewport edge it would clip too. The design system's own responsive rule says the product flips and shifts tooltips with the CDK Overlay so they never clip, and the brief requires overlays to use the CDK.
- **D-2** *Which positions?* Above-centre first, below-centre second, with push so the bubble shifts along the edge; when pushed, the arrow is moved (`.tooltip::after` reads `left: var(--tooltip-arrow-x, 50%)`, a component-scoped property the component sets on the bubble on each position change) so it still points at the trigger's centre. These are the design system's placement (above, centred) plus its flip rule; left and right placements are not used, because the arrow is only drawn vertically.
- **D-3** *What does the arrow do when the bubble flips below?* It points up, via the modifier `.tooltip--below` (in `components.css` and on the design-system tooltip page). The first extracted design system drew only the downward arrow; an arrow pointing away from the trigger would mislead, and hiding it would make the two placements look different.
- **D-4** *What is the hover delay, given no duration token is 300 ms?* 300 ms, the design system's stated value, as a component constant. It is a behavioural delay, not a transition, like the toast's 8-second timer; the fade itself uses `--duration-fast`.
- **D-5** *The design system's text tooltips repeat the `aria-label`; does the trigger still get `aria-describedby`?* Yes, while the bubble shows, as the design system's accessibility section and anatomy require. When the text equals the name, a screen reader may read the same words twice; that is the design system's accepted cost of one rule for every tooltip, and a hint that differs from the name (a shortcut) is only reachable this way.
- **D-6** *How is an icon-only trigger without a name caught?* A development-mode `console.error` naming `hp-tooltip`, the same check as button D-9: the tooltip must never become the only name.
- **D-7** *The stylesheet sets `.tooltip { pointer-events: none }` and the design system says it hides immediately, yet also that it stays visible while the pointer moves onto it (WCAG 1.4.13 hoverable). Which wins?* Hoverable: in the product the bubble takes pointer events and hides when the pointer has left both trigger and bubble for `--duration-fast`, a grace that lets the pointer cross the `--space-2` gap. "Immediately" still holds for blur and <kbd>Esc</kbd>. `pointer-events: none` remains right for the static documentation bubbles.
- **D-8** *How does the bubble show in forced colours, where its inverse background is replaced?* A `--border-width-hairline` `CanvasText` border, matching the stylesheet's treatment of alerts and toasts.
- **D-9** *Does a tooltip show for focus that came from a pointer or a tap?* No. Only keyboard focus (and programmatic focus that follows keyboard use) shows it, mirroring `:focus-visible`; pointer users get it through hover, and touch users rely on the visible icon and the `aria-label`. Otherwise every tap on an icon button would leave a stray bubble until blur.
- **D-10** *Does the tooltip hide when its trigger is activated?* Yes. Activating "Close dialog" or a menu trigger changes the context; a bubble lingering over the new state would cover it.

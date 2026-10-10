# Divider

| Field | Value |
|---|---|
| Selector | `hr[hp-divider]`, `div[hp-divider]`, `span[hp-divider]` |
| Library path | `frontend/projects/components/src/lib/divider/` |
| Status | planned |
| Traces to | L2-041, L2-042 |
| Design system | [`divider.html`](../../design-system/components/divider.html) |
| Source mocks | [`pages/sign-in/default`](../../mocks/pages/sign-in/default.html), [`pages/sign-in/invalid`](../../mocks/pages/sign-in/invalid.html), [`pages/sign-in/submitting`](../../mocks/pages/sign-in/submitting.html) |
| Rendering | [`divider.html`](divider.html) |

## Purpose and scope

A divider is a hairline that separates two adjacent groups when space alone would let them read as one: older notifications under "Earlier", a closing note under a card's content, the tagline and the legal links in a footer row, two sign-in methods split by "or". It comes in three forms: a horizontal rule (a thematic break between topics), a labelled divider (a short label centred between two rules) and a vertical divider (between inline groups in a row that stays on one line). The mocks use the labelled form between signing in and creating an account ("or"); every other hairline in the mocks is a border of another component (the top bar's bottom edge, the footer's top edge, table and list rules).

Use something else when:

- spacing already separates the groups: the 4 px spacing scale and the stack gaps come first;
- the separation is a card's footer actions: the card's `.card__footer` has its own top rule ([card.md](card.md));
- the line is part of another component's frame (top bar edge, footer edge, table rules, list rules): it is that component's CSS border, not a divider element;
- the label needs a sentence or names a section: use a heading;
- footer or toolbar links need separating: use the cluster gap, not a typed " · " or a divider between every link.

Out of scope:

- Hiding a vertical divider when its row wraps on phones. The row that contains it renders it only at widths where it stays on one line (for example the footer from 768 px); the divider has no breakpoint rules.
- The grouping itself (which notifications are "Earlier"). The page decides.

## Usage

Every `.divider` in `docs/mocks/` (inventory: `usage_inventory.py docs/mocks divider`), plus the uses the design system defines for later screens.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/sign-in/default`, `invalid`, `submitting` (after the sign-in form, before "Create account") | `div[hp-divider]`, labelled, in the form panel card's block flow | "or" | default | surface (form panel) |
| Notification groups once older updates are grouped (design system *Variants*, list CRD) | `div[hp-divider]`, labelled, between two lists in a flush card | "Earlier" | default | surface (flush card) |
| Card content (design system *Variants*) | `hr[hp-divider]` inside a block card | before "Notifications older than 30 days are archived." | default | surface (card) |
| Footer row (footer CRD) | `span[hp-divider] orientation="vertical"` between "HairPop · Made for confident hair decisions" and the Terms and Privacy links, from 768 px | — | default | canvas |
| Long settings form split into topics (design system *Overview*) | `hr[hp-divider]` between field groups | — | default | surface |
| Inside a well (design system *States*) | `hr[hp-divider]` or labelled | "or" | default | sunken surface |

Every row is buildable with the API below: the host element chooses the form, `orientation` chooses vertical, and the label is projected.

## Anatomy

1. **Rule** — a `--border-width-hairline` line in `--color-border-default`. On `hr` it is the top border; on a labelled divider it is two flexible lines, `::before` and `::after`, either side of the label; on a vertical divider it is the left border, stretched to the row's height.
2. **Label (labelled form only)** — the projected text inside a `<span>`: `--text-overline` with `--letter-spacing-wide`, uppercase by style, in `--color-fg-subtle`, with `--space-3` between it and each line.

Hosts: attribute components, so the host **is** the native element and carries the classes (D-1):

- `hr[hp-divider]` → `<hr class="divider">`, a horizontal rule with the implicit separator role. Template: none rendered (an `<hr>` has no content).
- `div[hp-divider]` → `<div class="divider divider--label"><span>…</span></div>`, a labelled divider. Template: `<span><ng-content /></span>`.
- `span[hp-divider]` or `div[hp-divider]` with `orientation="vertical"` → `<span class="divider divider--vertical" role="separator" aria-orientation="vertical"></span>`. Template: empty.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | no | `vertical` (on a `span` or `div` host) adds `.divider--vertical`, `role="separator"` and `aria-orientation="vertical"` and renders no content. Ignored on an `hr` host, which is always horizontal. |

- A `div` host that is horizontal is the labelled form and must project a label; a horizontal divider without a label is an `<hr>` (D-2). In development mode a horizontal `div`/`span` host with no text, or a vertical host with content, is reported as a console error.
- The input is a signal input. The label is projected; the component renders no copy.
- `aria-label` is never set on a divider (D-3).

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None | | A divider is not interactive. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default (labelled form only) | One or two words of text: "or", "Earlier", "This week" | Declared once, inside the label `<span>`. Ignored on `hr` and vertical hosts. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Horizontal | `hr.divider` | A thematic break between topics in a card, form or prose. |
| Labelled | `.divider--label` | Naming the split: "Earlier" between notification dates, "or" between sign-in methods. |
| Vertical | `.divider--vertical` | Separating inline groups in a row that stays on one line: footer, toolbar. |

| Size | Modifier | Height | Padding | Type |
|---|---|---|---|---|
| One weight | — | `--border-width-hairline` (1 px) rule; a labelled divider is as tall as its label | margin `--space-6` above and below (horizontal); `--space-2` either side (vertical) | label `--text-overline` |

Use space, not a thicker rule, for stronger separation. Horizontal dividers span their container.

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Default | — | 1 px `--color-border-default` rule | `hr`: separator (a thematic break); labelled: its text; vertical: a vertical separator |
| On a sunken surface | inside a `.well` | Same rule and label tokens | — |
| Higher contrast | `(prefers-contrast: more)` | The tokens set `--color-border-default` to `--color-border-strong` and `--color-fg-subtle` to the muted text colour | — |
| Forced colours | `(forced-colors: active)` | The rule takes `CanvasText` through `--color-border-default`; the label takes the system text colour | — |
| Long label | label wider than the line | The label wraps inside its span and the two lines shrink to nothing; nothing overflows (measured at 320 px) | Full text read |
| Dark theme | `data-theme="dark"` | Rule grey 750, label grey 400 | — |

A divider has no interactive states: it is never focusable, hoverable or disabled, and nothing animates.

## Markup

Rendered DOM. Classes and attributes are the e2e contract.

```html
<!-- rendered: horizontal rule in a card -->
<hr class="divider">
```

```html
<!-- rendered: labelled divider between notification groups -->
<div class="divider divider--label"><span>Earlier</span></div>
```

```html
<!-- rendered: vertical divider in the footer row -->
<div class="cluster">
  <span class="text-muted">HairPop · Made for confident hair decisions</span>
  <span class="divider divider--vertical" role="separator" aria-orientation="vertical"></span>
  <a href="/terms">Terms</a>
  <a href="/privacy">Privacy</a>
</div>
```

Consumer templates:

```html
<!-- consumer: card note under a rule -->
<div hp-card>
  <p><strong>Nia received your request</strong><br><span class="text-muted">Today at 9:42 am</span></p>
  <div hp-divider>Earlier</div>
  <p><strong>How to prepare for knotless braids</strong><br><span class="text-muted">Yesterday</span></p>
  <hr hp-divider>
  <p class="text-muted">Notifications older than 30 days are archived.</p>
</div>

<!-- consumer: footer row, vertical only where the row stays on one line -->
@if (wide()) { <span hp-divider orientation="vertical"></span> }

<!-- consumer: sign-in methods -->
<div hp-divider>or</div>
```

Free to change: the order of classes, and whether the labelled form's lines are pseudo-elements, as long as they stay decorative.

## Design

- Horizontal: `border: 0; border-top: var(--border-width-hairline) solid var(--color-border-default); margin: var(--space-6) 0`.
- Labelled: `display: flex; align-items: center; gap: var(--space-3)`; no border of its own; `::before` and `::after` are `flex: 1` with the same top border; the label uses `--text-overline`, `--letter-spacing-wide`, `text-transform: uppercase`, `--color-fg-subtle`; same `--space-6` margin as the rule.
- Vertical: `border-left: var(--border-width-hairline) solid var(--color-border-default); align-self: stretch; margin: 0 var(--space-2)`.
- The margins are the divider's own in every block context, including a card, whose flow spacing skips dividers ([card.md](card.md) D-4). In a flex or grid container with its own gap (`.stack`, `.cluster`) the gap adds to the margin, so horizontal dividers go in block flow, not as stack children (D-4).
- Keep at least 8 px between a divider and a neighbouring target (the vertical form's `--space-2` margin gives it).
- No elevation, layer, motion or component tokens.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Rule | `--color-border-default` | `--palette-gray-200` | `--palette-gray-750` |
| Label | `--color-fg-subtle` | `--palette-gray-500` | `--palette-gray-400` |
| Card surface behind | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |
| Page behind | `--color-bg-canvas` | `--palette-gray-50` | `--palette-gray-950` |

Contrast pairs the component relies on, from `tokens/contrast-pairs.json`, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-subtle` | `--color-bg-surface` | 4.5:1 | Label on a card |
| `--color-fg-subtle` | `--color-bg-canvas` | 4.5:1 | Label on the page |
| `--color-fg-subtle` | `--color-bg-surface-raised` | 4.5:1 | Label in a dialog |

The rule is decorative and exempt from WCAG 1.4.11; grouping is also carried by spacing, headings and, for the labelled form, text. Under `prefers-contrast: more` and in forced colours the tokens strengthen the rule automatically.

## Responsive behaviour

- Horizontal and labelled dividers span their container at every width; they have no breakpoint rules.
- A labelled divider's label wraps when it is wider than the line; its rules shrink to nothing. Measured at 320 px in a card: the label "Earlier this week from your braider" wrapped onto two lines in a 214 px span inside the 238 px content box, and the page did not scroll horizontally.
- A vertical divider appears only in rows that stay on one line; the row drops it where it wraps (Out of scope).
- At 200 % text size the label wraps the same way.

## Accessibility

### Role and pattern

- `<hr>` has the implicit `separator` role and is announced as a separator between topics; use it between topics only.
- A labelled divider is plain text between decorative lines, with no role: the label is read as text, so it must be real content.
- A vertical divider uses `role="separator"` with `aria-orientation="vertical"`.
- Purely decorative lines that are part of another component's frame are CSS borders, not dividers.

### Keyboard

| Key | Action |
|---|---|
| None | Dividers are not focusable and not interactive; Tab passes over them. |

### Focus

Not applicable: a divider never takes focus.

### Labelling

The label text is the content ("or", "Earlier"). No `aria-label` on any divider (D-3).

### Announcements

None.

### Motion

None.

## Content and internationalisation

- Labels are one or two words in sentence case in source ("or", "Earlier", "This week"), uppercase by style.
- A label that needs a sentence is a heading, not a divider.
- Translatable content: the projected label. The component renders no copy. Translated labels that run longer wrap (measured above).

## Performance

- Change detection: `OnPush`, one signal input, host bindings; the template is empty or a single `<span><ng-content /></span>`.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Divider.ts` renders the labelled divider "Earlier" between Maya's notification "Nia received your request" and "How to prepare for knotless braids"; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Regression rule: a change to the template, input, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed (AGENTS.md).
- Layout stability: fixed hairline and margins; nothing loads.
- Weight: `@angular/core` only.
- Render-performance budgets are a repository rule enforced by the perf test; no L2 requirement covers client render cost, so no acceptance criterion cites one.

## Acceptance criteria

### Rendering

- **AC-1** Given `<hr hp-divider>` inside a card between Maya's notifications and the note "Notifications older than 30 days are archived.", when it renders, then the DOM holds `<hr class="divider">` with a 1 px `--color-border-default` top rule spanning the card's content width, 24 px above and 24 px below, and a screen reader announces a separator. (L2-041)
- **AC-2** Given `<div hp-divider>Earlier</div>`, when it renders, then the DOM holds `<div class="divider divider--label"><span>Earlier</span></div>` with a hairline on each side of the label, the label is shown uppercase in `--text-overline` and a screen reader reads "Earlier" as text. (L2-041)
- **AC-3** Given `<span hp-divider orientation="vertical">` between the footer tagline and the Terms link, when it renders, then it has `role="separator"` and `aria-orientation="vertical"`, a 1 px left rule as tall as the row and 8 px on each side. (L2-041)
- **AC-4** Given any divider, when a screen reader inspects it, then it has no `aria-label` and the labelled form's name comes only from its text. (L2-041)
- **AC-5** Given a horizontal `<div hp-divider>` with no label, or a vertical divider with content, in development mode, when it initialises, then the console reports an error naming `hp-divider` and the misuse. (L2-041)

### Keyboard

- **AC-6** Given the card with a rule and a labelled divider between two links, when Maya presses Tab, then focus moves from the first link to the second and never stops on a divider. (L2-041)

### Theming and contrast

- **AC-7** Given the labelled divider "Earlier" on a card, when it renders in the light and dark themes, then its label is at least 4.5:1 against `--color-bg-surface`, and on the page at least 4.5:1 against `--color-bg-canvas`. (L2-041)
- **AC-8** Given a rule and a labelled divider, when the theme switches from light to dark, then the rule changes from grey 200 to grey 750 and the label from grey 500 to grey 400 without a reload. (L2-042)
- **AC-9** Given `prefers-contrast: more`, when a rule renders, then it uses the `--color-border-strong` value. (L2-041)
- **AC-10** Given Windows forced colours, when a rule and a vertical divider render, then both are drawn in `CanvasText`. (L2-041)

### Responsive

- **AC-11** Given the labelled divider "Earlier this week from your braider" in a card at 320 px, when it renders, then the label wraps inside the card, nothing is clipped and the page does not scroll horizontally. (L2-042)
- **AC-12** Given a rule in a card at 320, 768 and 1280 px, when it renders, then it spans the card's full content width at each width. (L2-042)

### Performance

Render cost is measured by the perf-test scenario named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/divider/`; file `divider.ts` exporting the standalone component `Divider` with `selector: 'hr[hp-divider], div[hp-divider], span[hp-divider]'`, `changeDetection: OnPush`, and a template that renders `<span><ng-content /></span>` only for the labelled form (host tag `DIV` or `SPAN` and `orientation` horizontal), read once from `ElementRef`. Export it from `public-api.ts`.
- Host bindings: `class.divider` always; `class.divider--label` for the labelled form; `class.divider--vertical`, `attr.role` `'separator'` and `attr.aria-orientation` `'vertical'` for the vertical form.
- Styles: port `hr, .divider`, `.divider--vertical` and `.divider--label` (with its `::before`, `::after` and label rules) from `components.css` as `:host` rules; the label span is in the component's own template, so it is styled without reaching into projected content.
- Development check (`isDevMode()`), once after the first render: a labelled host must have non-whitespace text; a vertical host must have none (D-2).
- No CDK primitive. Composes nothing.
- Perf-test scenario `Divider.ts`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is the host the native element or a wrapper?* The native element, through attribute selectors, so a rule keeps `<hr>`'s separator semantics and a vertical divider can sit directly in a flex row (`align-self: stretch` needs the divider to be the row's own child).
- **D-2** *How does the component know which form to render?* From the host element and `orientation`: `hr` is the rule, a horizontal `div` is the labelled form, a vertical `span` or `div` is the vertical form. A horizontal divider without a label is always an `<hr>`, which gives it the right semantics for free, so an unlabelled horizontal `div` is a development-mode error rather than a fourth form.
- **D-3** *Does a divider ever take `aria-label`?* No. The design system forbids labels on decorative rules, and a labelled divider's text is already its content; an `aria-label` would read the label twice or name something that is not interactive.
- **D-4** *How much space surrounds a divider?* `--space-6` above and below in block flow, as the design system states, including inside cards: measured, a card flow rule applied to every child cut the space above a divider to 16 px while the space below stayed 24 px, so the card's flow rule skips dividers (card CRD D-4). In a flex or grid container with a gap the gap adds to the margin, so horizontal dividers belong in block flow.
- **D-5** *Does the footer use a vertical divider between its links?* No: between the tagline and the group of legal links only, where the row stays on one line. The design system's do and don't separate individual footer links with the cluster gap and forbid a typed " · ", which screen readers read aloud.

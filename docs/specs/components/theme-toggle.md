# Theme toggle

| Field | Value |
|---|---|
| Selector | `button[hp-button][hpThemeToggle]` (directive) and `ThemeService` |
| Library path | `frontend/projects/components/src/lib/theme-toggle/` |
| Status | planned |
| Traces to | L2-041, L2-042, L2-048 |
| Design system | [`theme-toggle.html`](../../design-system/components/theme-toggle.html) |
| Source mocks | [`pages/style-gallery/default`](../../mocks/pages/style-gallery/default.html), [`pages/braider-requests/default`](../../mocks/pages/braider-requests/default.html) |
| Rendering | [`theme-toggle.html`](theme-toggle.html) |

## Purpose and scope

The theme toggle switches between the light and dark themes and remembers the choice (L2-042 AC3, L2-048). It sits in the top bar's actions slot in the customer and braider apps. `ThemeService` owns the current theme; the directive turns a ghost small [button](button.md) into its control.

Out of scope:

- Other preferences such as contrast or motion; those follow the operating system.
- The top bar layout: see [top bar](top-bar.md) `[slot=actions]`.

## Usage

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Every customer page (top bar) | ghost, small | "Dark theme" | not pressed, pressed, focus | surface (top bar) |
| Every braider page (top bar) | ghost, small | "Dark theme" | not pressed, pressed, focus | surface (top bar) |

## Anatomy

1. **Button** — the host `button.btn.btn--ghost.btn--sm.theme-toggle` with `aria-pressed`.
2. **Label** — projected text, constant.

Host: the consumer's `<button hp-button>`; the directive adds `theme-toggle` and sets the button's `pressed` model.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| None on the directive | | | | The label is projected text; variant and size are Button inputs (`ghost`, `sm`). |

`ThemeService` (`providedIn: 'root'`):

| Member | Type | Rule |
|---|---|---|
| `theme` | `Signal<'light' \| 'dark'>` | The applied theme: the saved choice, otherwise the system preference. |
| `toggle()` | `() => void` | Switches theme, saves it and sets `data-theme` on `<html>`. |
| `set(theme)` | `(theme: 'light' \| 'dark') => void` | Same as toggle with an explicit value. |

`THEME_INIT_SCRIPT` (exported string): the inline script each app places in `index.html` `<head>` to apply the saved theme before first paint.

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| None — state lives in `ThemeService.theme`. | | |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| default (Button) | Text | "Dark theme". |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Toggle | `.btn--ghost.btn--sm.theme-toggle` | The only variant. |

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Not pressed | Light theme applied | Ghost button | "Dark theme, toggle button, not pressed" |
| Pressed | Dark theme applied | Button pressed styling | "…, pressed" |
| Hover | `:hover` | Ghost hover | — |
| Focus | `:focus-visible` | Focus ring | — |
| Active | `:active` | Ghost active | — |

## Markup

```html
<!-- rendered -->
<button class="btn btn--ghost btn--sm theme-toggle" type="button" aria-pressed="false">Dark theme</button>
```

```html
<!-- consumer, inside the top bar -->
<header hp-top-bar …><button slot="actions" hp-button variant="ghost" size="sm" hpThemeToggle>Dark theme</button></header>
```

```html
<!-- index.html head, before styles: the value of THEME_INIT_SCRIPT -->
<script>try{var t=localStorage.getItem('hp-theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;}catch(e){}</script>
```

## Design

- Uses Button's ghost, small and pressed styling; adds no styles of its own.

Component tokens: none.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Label | `--color-fg-default` | `--palette-gray-900` | `--palette-gray-150` |
| Pressed background | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-default` | `--color-bg-surface` | 4.5:1 | Label |

## Responsive behaviour

- Stays in the top bar at every width, before the phone menu button.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; the target is at least 44 × 44 CSS px.

## Accessibility

### Role and pattern

WAI-ARIA button pattern, toggle variant: native `<button>` with `aria-pressed`.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Toggles the theme. |

### Focus

Focus stays on the button after toggling.

### Labelling

Constant visible label "Dark theme"; the pressed state carries the current value.

### Announcements

Screen readers announce the new pressed state; no live region is used.

### Motion

The theme changes instantly.

## Content and internationalisation

- Label: "Dark theme".
- Translatable: the projected label.

## Performance

- Change detection: `OnPush`; `ThemeService.theme` is a signal.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/ThemeToggle.ts` renders the toggle in the top bar actions slot; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: `TopBar`.
- Layout stability: the label never changes, so toggling causes no layout shift.

## Acceptance criteria

### Rendering

- **AC-1** Given no saved choice and a system preference for dark, when Maya opens the style gallery, then the dark theme is applied and "Dark theme" is pressed. (L2-048)
- **AC-2** Given no saved choice and a light system preference, when the gallery opens, then the light theme is applied and "Dark theme" is not pressed. (L2-048)

### States

- **AC-3** Given the light theme, when Maya activates "Dark theme", then every surface switches to dark and the button becomes pressed. (L2-048)
- **AC-4** Given Maya chose dark, when she navigates to My appointments and reloads, then the dark theme is applied before content is shown. (L2-042)
- **AC-5** Given optional storage was declined in Cookie preferences, when Maya toggles the theme, then the choice is still saved, because it is an essential preference. (L2-048)

### Keyboard and focus

- **AC-6** Given focus on "Dark theme", when Maya presses Space, then the theme toggles and focus stays on the button. (L2-041)

### Screen readers

- **AC-7** Given the dark theme, when a screen reader reaches the control, then it announces "Dark theme, toggle button, pressed". (L2-041)

### Theming

- **AC-8** Given either theme, when the toggle renders in the top bar, then its label meets 4.5:1 against the bar. (L2-042)

### Responsive

- **AC-9** Given a 320 px viewport, when the top bar renders, then the toggle, Updates and the menu button fit without horizontal scrolling. (L2-042)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Planned: folder `src/lib/theme-toggle/` with `theme.service.ts`, `theme-toggle.ts` (directive) and `index.ts`.
- SSR: the service reads `localStorage` and `matchMedia` only in the browser (`isPlatformBrowser`); the server renders without `data-theme`, so CSS `prefers-color-scheme` applies until the init script runs.

## Decisions

- **D-1** *Directive or component?* A directive on Button, so the toggle inherits every Button state and style without duplicating them.
- **D-2** *Where is the choice stored?* `localStorage` key `hp-theme`. It is a functional preference, not optional usage data, so L2-034 does not gate it (AC-5).
- **D-3** *Label switches with state?* No. A constant label with `aria-pressed` avoids the ambiguity the design system's do/don't records.
- **D-4** *System preference changes later?* Without a saved choice the service follows `prefers-color-scheme` changes live; with one, the saved choice wins.

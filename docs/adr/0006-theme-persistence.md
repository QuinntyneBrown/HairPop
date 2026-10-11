# 0006 — Theme persistence

- Status: accepted
- Date: 2026-10-10

## Context

L2-042 AC3 and L2-048 require a theme control whose choice persists across navigation without a flash of the other theme. L2-034 restricts optional storage before consent.

## Decision

- The choice is a functional preference stored in `localStorage` under `hp-theme` (`light` or `dark`). It is essential, not optional usage data, so consent does not gate it.
- Each app's `index.html` inlines the theme init script (exported as `THEME_INIT_SCRIPT` by `@hairpop/components`) before its stylesheets; it sets `data-theme` on `<html>` from the saved value.
- Without a saved value no attribute is set, and the tokens follow `prefers-color-scheme`.
- `ThemeService` owns the current value; the `hpThemeToggle` directive on a ghost small button in the top bar's actions slot toggles it.

## Consequences

- Server-rendered HTML carries no theme attribute; the inline script applies the saved one before first paint.

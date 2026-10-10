## Verification

Run on 2026-10-10 from the repository root.

| Check | Command | Result |
|---|---|---|
| Mocks gate | `python .claude/skills/writing-html-mocks/scripts/check_mocks.py docs/mocks` | 33 screens, 181 mocks, 0 errors, 0 warnings, before extraction and again after the mocks were pointed at the system. |
| Contrast, both themes | `python .claude/skills/extracting-design-systems/scripts/check_contrast.py docs/design-system/tokens/tokens.css` | 148 passed, 0 failed (77 declared pairs; 6 are theme-specific, so 74 checks per theme). |
| Structure | `python .claude/skills/extracting-design-systems/scripts/check_design_system.py docs/design-system` | 60 pages (12 foundations, 39 components, 8 patterns, index), 0 errors, 0 warnings. |
| Token coverage | script over `tokens.css` and `foundations/*.html` | All 213 tokens appear as a `data-token` cell on exactly one foundation page. |
| Reflow and runtime | Playwright, every page at 360 and 1280px in light and dark | No horizontal page scroll and no script errors on any page. |
| Visual review | `screenshot_mocks.py docs/design-system --out docs/design-system/.cache/...` | Index, Color, Button, Dialog, Text field and Toast reviewed at 360 and 1280px in both themes. Fixed during review: light previews inside a dark page rendered dark (themed tokens moved to `:root, [data-theme="light"]`), unreadable 10px ramp labels, stacked example canvases stretching fields to 18rem, visually hidden text widening state matrices. |
| Mocks on the system | `docs/mocks/assets/tokens.css` and `ui.css` now `@import` `tokens/tokens.css` and `assets/components.css`; re-screenshotted all default and invalid states | Mocks render with the system; the CSS-level drift above is fixed in them. |

Remaining differences: the drift rows that need a **markup** change (mobile menu button, label/error structure, linked error summary, busy buttons, offered-time and rating controls, SVG icons, toast regions, dialog focus and roles, notification list, breadcrumbs, skeleton layouts, per-screen empty copy) are documented in the system but not yet applied to `docs/mocks/build.py`.

Rebuild after editing a fragment:

```powershell
python docs/design-system/build.py
python .claude/skills/extracting-design-systems/scripts/tokens_to_json.py docs/design-system/tokens/tokens.css
```

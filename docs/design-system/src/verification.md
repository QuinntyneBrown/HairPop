## Verification

Verified on 2026-10-10 from the repository root:

| Check | Result |
|---|---|
| `python .agents/skills/writing-html-mocks/scripts/check_mocks.py docs/mocks` | 33 screens, 181 mocks, 0 errors, 0 warnings. |
| `python docs/design-system/build.py` | Generated 12 foundations, 39 components, 8 patterns, the index, and this README from source fragments. |
| `python .agents/skills/extracting-design-systems/scripts/check_design_system.py docs/design-system` | 60 published pages checked; 0 errors, 0 warnings. |
| `python .agents/skills/extracting-design-systems/scripts/check_contrast.py docs/design-system/tokens/tokens.css` | 148 light/dark foreground-background checks passed; 0 failed or unresolved. |
| `python .agents/skills/extracting-design-systems/scripts/tokens_to_json.py docs/design-system/tokens/tokens.css` | Regenerated the DTCG export (270 entries). |
| Foundation token inventory | All 213 CSS custom properties appear on one foundation page; none are missing or assigned to two foundations. |
| Chromium page reflow | All 60 published pages checked at 360px in light and dark themes; no horizontal page overflow or failing live contrast badge. |
| Design-system screenshots | Index, color, Button, Dialog, and Text field captured at 360×800 and 1280×800 in light and dark themes; reviewed for clipping, hierarchy, and theme surfaces. |
| Mock screenshots | All 181 mocks captured at 360×800, 768×1024, and 1280×800 in light and dark themes (1,086 images). Reviewed representative discovery, booking validation, appointment dialog, and matching states after the mocks switched to the shared stylesheets. |

### Re-verified after the CRD alignment (2026-10-10)

After the CRD, design system and mock alignment ([audit](../alignment-audit.md)):

| Check | Result |
|---|---|
| `python docs/mocks/build.py` then `check_mocks.py docs/mocks --write` | 33 screens, 170 mocks (error pages keep only `default`; the `confirm` dialog state is gone), 0 errors, 0 warnings. |
| `python docs/design-system/build.py` then `check_design_system.py docs/design-system` | 60 pages, 0 errors, 0 warnings. |
| `check_crds.py docs/specs/components` | 40 CRDs, 0 errors, 0 warnings. |
| `check_contrast.py docs/design-system/tokens/tokens.css` | 156 passed, 0 failed (pairs added for inline messages on raised surfaces and the skip link's hover). |
| Class scan | Every class used by the mocks, design-system pages and CRD renderings is defined in `assets/components.css`. |
| Chromium page reflow | Every mock, design-system page and CRD rendering at 360px and 1280px: no horizontal page overflow. |

Screenshots and the contact sheet are local under the ignored `.cache/` directories. The checked-in mocks import [`tokens/tokens.css`](tokens/tokens.css) and [`assets/components.css`](assets/components.css), so subsequent token and component changes appear in both the design system and design references.

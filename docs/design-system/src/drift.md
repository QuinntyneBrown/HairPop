## Drift found in the mocks

Every deviation corrected during extraction. "Resolution" says what the system now does; the mocks pick it up through the shared stylesheets (see Verification) or need a markup change in `docs/mocks/build.py` where noted.

| Mock | Issue | Resolution |
|---|---|---|
| `assets/tokens.css` (all mocks) | Brand ramp was named `--palette-blue-*` although every value is purple. | Renamed to `--palette-plum-*`; semantic tokens unchanged, so no mock markup changes. |
| `assets/tokens.css` (dark theme) | Dark semantic tokens held raw hex (`#14181e`, `#e9ecf1`, `#b3bac5`, `#959eab`, `#2f3640`, `#8d97a5`) instead of primitives. | Added `--palette-gray-150/350/450/750/925`; dark tokens alias them. |
| `assets/tokens.css` (dark theme) | `--color-fg-subtle` `#959eab` was a near-duplicate of `--palette-gray-400`. | Collapsed into `--palette-gray-400` (`#a3abb8`), which also raises its contrast. |
| `assets/tokens.css` | `--text-h2` used a raw `1.15` line height. | Snapped to `--line-height-tight`. |
| `assets/tokens.css` | Light theme lived on bare `:root`, so a light preview inside a dark page inherited dark values. | Themed tokens moved to `:root, [data-theme="light"]`. |
| `assets/ui.css` | Reduced motion was a global `animation-duration: 0.01ms !important`, which also froze spinners and made infinite loops flicker. | Token-driven: durations zero, loops pause through `--motion-loop-state`, spinners keep turning. |
| `assets/ui.css` | Raw loop durations (`0.8s`, `1.4s`, `1.6s`). | `--duration-loop-spin/shimmer/pulse`. |
| `assets/ui.css` | Off-grid sizes: badge height 22px, badge dot 6px, indeterminate bar `0.65rem`, button spinner `1.1em`, tab indicator `2px 2px 0 0`, icon nudge `0.1rem`. | Badge 24px, dot 8px, bar `0.75rem`, spinner `1.25em` (icon size), `--radius-xs`, `--space-0-5`. |
| `assets/ui.css` | `max-width` media queries (`47.99rem`, `39.99rem`) mixed with mobile-first rules; `.topbar` gap declared twice. | Rewritten mobile-first with `min-width` only; one gap. |
| `assets/ui.css` | Layout sizes borrowed spacing tokens: profile avatar `--space-12` wide, art panel `min-height: --space-12`, hero `calc(--space-12 * 4)`, skeleton hero `calc(--space-12 * 3)`. | Avatar uses `.avatar--xl` (`--avatar-size`); art, hero photo and skeleton hero share a 3:2 aspect ratio, so loading causes no layout shift. |
| `assets/ui.css` | `.form-panel` 38rem and `.container--narrow` 42rem were near-duplicates. | One token, `--layout-form-max` (38rem). |
| `assets/ui.css` | `.profile-avatar` duplicated `.avatar`; `.site-footer` duplicated `.footer`; `.eyebrow` duplicated `.overline` with another colour; `.pagination-row` duplicated `.pagination`. | Kept the mock class names as aliases of one rule each, documented once. |
| `assets/ui.css` | Generated content (`⚠`, `/`, `↑`, `↓`, `✓`) was read aloud by screen readers. | `content: "⚠" / ""` alt-text syntax. |
| `pages/appointment-detail/default`, `pages/my-appointments/default`, all detail cards | Badges stretched to full width inside `.stack`. | `.badge` sets `align-self: flex-start; width: fit-content`. |
| `pages/appointment-detail/default`, `pages/style-detail/default`, `pages/braider-profile/default` | Section headings inside cards rendered at the 36px light page `h2`. | `.card h2` uses `--text-h3`; story cards keep `.card__title`. |
| `pages/style-gallery/default`, `pages/matching-braiders/default` | Art panels were shorter than photo cards in the same row. | Photo and art share `aspect-ratio: 3 / 2`. |

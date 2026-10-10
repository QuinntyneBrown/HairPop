# HairPop design system

Extracted from [docs/mocks](../mocks/README.md) on 2026-10-10. Open [index.html](index.html) locally; every page works from disk.

Pages are generated: edit the fragments in `src/`, then run `python docs/design-system/build.py`.

## Foundations

| Page | Covers |
|---|---|
| [Color](foundations/color.html) |  |
| [Typography](foundations/typography.html) |  |
| [Spacing](foundations/spacing.html) |  |
| [Layout](foundations/layout.html) |  |
| [Elevation](foundations/elevation.html) |  |
| [Shape](foundations/shape.html) |  |
| [Motion](foundations/motion.html) |  |
| [Iconography](foundations/iconography.html) |  |
| [Theming](foundations/theming.html) |  |
| [Responsive](foundations/responsive.html) |  |
| [Accessibility](foundations/accessibility.html) |  |
| [Content](foundations/content.html) |  |

## Components

| Component | Group | Variants | States | Source mocks |
|---|---|---|---|---|
| [Button](components/button.html) | Actions | primary, secondary, ghost, link, danger; leading/trailing icon; icon-only; block | default, hover, focus, active, disabled, loading, pressed | [pages/booking-request/default](../mocks/pages/booking-request/default.html), [pages/appointment-detail/default](../mocks/pages/appointment-detail/default.html), [dialogs/cancel-appointment/default](../mocks/dialogs/cancel-appointment/default.html), [pages/booking-request/submitting](../mocks/pages/booking-request/submitting.html) |
| [Link](components/link.html) | Actions |  |  | core set (not yet in a mock) |
| [Menu](components/menu.html) | Actions |  |  | core set (not yet in a mock) |
| [Text field](components/text-field.html) | Inputs |  |  | core set (not yet in a mock) |
| [Textarea](components/textarea.html) | Inputs |  |  | core set (not yet in a mock) |
| [Select](components/select.html) | Inputs |  |  | core set (not yet in a mock) |
| [Checkbox](components/checkbox.html) | Inputs |  |  | core set (not yet in a mock) |
| [Radio group](components/radio-group.html) | Inputs |  |  | core set (not yet in a mock) |
| [Switch](components/switch.html) | Inputs |  |  | core set (not yet in a mock) |
| [Form field](components/form-field.html) | Inputs |  |  | core set (not yet in a mock) |
| [Form layout](components/form-layout.html) | Inputs |  |  | core set (not yet in a mock) |
| [Top bar](components/top-bar.html) | Navigation |  |  | core set (not yet in a mock) |
| [Sidebar navigation](components/sidebar-navigation.html) | Navigation |  |  | core set (not yet in a mock) |
| [Tabs](components/tabs.html) | Navigation |  |  | core set (not yet in a mock) |
| [Breadcrumb](components/breadcrumb.html) | Navigation |  |  | core set (not yet in a mock) |
| [Pagination](components/pagination.html) | Navigation |  |  | core set (not yet in a mock) |
| [Page header](components/page-header.html) | Navigation |  |  | core set (not yet in a mock) |
| [Footer](components/footer.html) | Navigation |  |  | core set (not yet in a mock) |
| [Skip link](components/skip-link.html) | Navigation |  |  | core set (not yet in a mock) |
| [Card](components/card.html) | Containers and overlays |  |  | core set (not yet in a mock) |
| [Dialog](components/dialog.html) | Containers and overlays |  |  | core set (not yet in a mock) |
| [Tooltip](components/tooltip.html) | Containers and overlays |  |  | core set (not yet in a mock) |
| [Divider](components/divider.html) | Containers and overlays |  |  | core set (not yet in a mock) |
| [Container, grid and stack](components/container.html) | Containers and overlays |  |  | core set (not yet in a mock) |
| [Table](components/table.html) | Data display |  |  | core set (not yet in a mock) |
| [List](components/list.html) | Data display |  |  | core set (not yet in a mock) |
| [Description list](components/description-list.html) | Data display |  |  | core set (not yet in a mock) |
| [Avatar](components/avatar.html) | Data display |  |  | core set (not yet in a mock) |
| [Badge](components/badge.html) | Data display |  |  | core set (not yet in a mock) |
| [Chip](components/chip.html) | Data display |  |  | core set (not yet in a mock) |
| [Stat](components/stat.html) | Data display |  |  | core set (not yet in a mock) |
| [Toast](components/toast.html) | Feedback |  |  | core set (not yet in a mock) |
| [Alert and banner](components/alert.html) | Feedback |  |  | core set (not yet in a mock) |
| [Inline message](components/inline-message.html) | Feedback |  |  | core set (not yet in a mock) |
| [Progress bar](components/progress-bar.html) | Feedback |  |  | core set (not yet in a mock) |
| [Spinner](components/spinner.html) | Feedback |  |  | core set (not yet in a mock) |
| [Skeleton](components/skeleton.html) | Feedback |  |  | core set (not yet in a mock) |
| [Empty state](components/empty-state.html) | Feedback |  |  | core set (not yet in a mock) |
| [Error page](components/error-page.html) | Feedback |  |  | core set (not yet in a mock) |

## Patterns

| Pattern | Covers |
|---|---|
| [Forms](patterns/forms.html) |  |
| [Feedback and loading](patterns/feedback-and-loading.html) |  |
| [Empty and error states](patterns/empty-and-error-states.html) |  |
| [Navigation and page structure](patterns/navigation.html) |  |
| [Dialogs and overlays](patterns/dialogs-and-overlays.html) |  |
| [Tables and lists](patterns/tables-and-lists.html) |  |
| [Notifications](patterns/notifications.html) |  |
| [Content and tone](patterns/content-and-tone.html) |  |

## Tokens

- [`tokens/tokens.css`](tokens/tokens.css) — the source of truth: primitives, semantic tokens, light and dark themes, reduced-motion, high-contrast and forced-colours overrides.
- [`tokens/tokens.json`](tokens/tokens.json) — DTCG export generated from `tokens.css` (`tokens_to_json.py`); dark values under `$extensions`.
- [`tokens/contrast-pairs.json`](tokens/contrast-pairs.json) — every foreground/background pairing the components rely on, checked in both themes.
- [`assets/components.css`](assets/components.css) — the component stylesheet; token-driven, with `data-state` hooks for static state previews.
- [`assets/fonts/`](assets/fonts/fonts.css) — local Manrope and JetBrains Mono (SIL OFL 1.1).

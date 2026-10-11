# Gallery

| Field | Value |
|---|---|
| Selector | `ul[hp-gallery]` |
| Library path | `frontend/projects/components/src/lib/gallery/` |
| Status | built (read-only; `removable` lands with the braider profile content screen) |
| Traces to | L2-007, L2-027, L2-041, L2-042 |
| Design system | [`gallery.html`](../../design-system/components/gallery.html) |
| Source mocks | [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html), [`pages/braider-profile-content/default`](../../mocks/pages/braider-profile-content/default.html), [`pages/braider-profile-content/empty`](../../mocks/pages/braider-profile-content/empty.html) |
| Rendering | [`gallery.html`](gallery.html) |

## Purpose and scope

The gallery shows portfolio work as a grid of square, captioned photos: read-only on the public braider profile (L2-007) and with a remove action per item in the braider management app (L2-027).

Out of scope:

- The empty portfolio: the page renders an [empty state](empty-state.md) instead of an empty gallery.
- Uploading: the Add a portfolio photo dialog owns file selection and validation.
- Lightbox or carousel behaviour.

## Usage

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| `pages/braider-profile/default` | read-only | three items: two photos, one missing photo | loaded, missing photo | surface |
| `pages/braider-profile-content/default` | `removable` | the same three items with "Remove" | loaded, remove focus, remove busy | surface |
| `pages/braider-profile-content/empty` | — | empty state instead | — | surface |

## Anatomy

1. **Grid** — host `ul.gallery`.
2. **Item** — `li.gallery__item`.
3. **Photo** — `img.gallery__photo` (`alt` from the item), or `div.gallery__art[aria-hidden="true"]` with the sparkle icon when `src` is null.
4. **Caption** — `figcaption.gallery__caption` inside a `<figure>`.
5. **Actions** — `.gallery__actions` with a `button[hp-button]` ghost small "Remove" and a trash icon; only when `removable`.

Host: the native `<ul>`.

## API

### Inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `items` | `readonly GalleryItem[]` | — | yes | `{ id: string; src: string \| null; alt: string; caption: string }`. Rendered in order, tracked by `id`. |
| `removable` | `boolean` | `false` | no | Shows the remove action on each item. |
| `removeLabel` | `string` | `'Remove'` | no | Visible action label; the caption is appended visually hidden. |
| `busyId` | `string \| null` | `null` | no | The item whose removal is in progress; its button is `aria-busy` and ignores presses. |

### Outputs

| Output | Payload | Emitted when |
|---|---|---|
| `removeRequested` | `GalleryItem` | A remove action is activated and that item is not busy. |

### Content slots

| Slot | Accepts | Rule |
|---|---|---|
| None | | Items come from `items`. |

## Variants and sizes

| Variant | Modifier | Use for |
|---|---|---|
| Read-only | — | Public profile. |
| Editable | — (`removable`) | Braider profile content. |

One item size, set by the grid (`minmax(min(100%, 8rem), 1fr)`, see D-4).

## States

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Loaded | `src` set | Square photo | alt text, then caption |
| Missing photo | `src` null | Accent art panel with sparkle | caption only |
| Remove focus | `:focus-visible` | Focus ring | "Remove Medium knotless braids · Oct 2026, button" |
| Remove busy | `busyId` = item id | Button busy spinner | `aria-busy="true"` |

## Markup

```html
<!-- rendered: editable -->
<ul class="gallery">
  <li class="gallery__item">
    <figure><img class="gallery__photo" src="…" alt="Medium knotless braids shown from the back, with neat square parts"><figcaption class="gallery__caption">Medium knotless braids · Oct 2026</figcaption></figure>
    <div class="gallery__actions"><button class="btn btn--ghost btn--sm" type="button"><svg …trash…></svg>Remove<span class="visually-hidden"> Medium knotless braids · Oct 2026</span></button></div>
  </li>
</ul>
```

```html
<!-- consumer -->
<ul hp-gallery [items]="portfolio()" removable [busyId]="removing()" (removeRequested)="remove($event)"></ul>
```

## Design

- Grid gap `--space-3`; item gap `--space-2`; photo radius `--radius-md`, square aspect ratio, `object-fit: cover`.
- Caption `--text-caption`.

Component tokens: none.

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Art background | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Art icon | `--color-fg-accent` | `--palette-plum-700` | `--palette-plum-300` |
| Caption | `--color-fg-muted` | `--palette-gray-600` | `--palette-gray-350` |

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-muted` | `--color-bg-surface` | 4.5:1 | Caption |
| `--color-fg-accent` | `--color-accent-subtle` | 3:1 | Art icon |

## Responsive behaviour

- Two columns at 360 px inside a card (278 px of content), growing to more columns as the card widens, never narrower than 8 rem per column.
- At 320 px nothing scrolls horizontally or clips; at 200 % zoom everything stays available; remove buttons keep a 44 × 44 CSS px target.

## Accessibility

### Role and pattern

A native list of figures. Screen readers announce the item count.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Moves through the remove buttons in order (editable only). |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Emits `removeRequested` for that item. |

### Focus

When a focused item is removed from `items`, focus moves to the next item's remove button, or the previous one when it was last. When the list becomes empty the consumer moves focus (to "Add photo").

### Labelling

Photos carry the item's `alt`; the art panel is decorative. Each remove button is named "{removeLabel} {caption}".

### Announcements

None from the component; the page announces the outcome with a toast.

### Motion

None.

## Content and internationalisation

- Caption: "{style} · {Mon YYYY}", up to 120 characters.
- Translatable inputs: `removeLabel`. Data values: `items`.

## Performance

- Change detection: `OnPush`, signal inputs, `@for` tracked by `id`; images use `loading="lazy"` and `decoding="async"`.
- Perf-test scenario: `frontend/projects/perf-test/src/scenarios/Gallery.ts` renders Nia's three portfolio items, editable; iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep it at roughly 100–300 ms.
- Composite scenarios: None.
- Layout stability: the square aspect ratio reserves space before images load.

## Acceptance criteria

### Rendering

- **AC-1** Given Nia's three portfolio items, when her public profile renders, then three captioned items appear in order and no remove actions are shown. (L2-007)
- **AC-2** Given an item without a photo, when it renders, then the art panel appears with its caption and no broken image. (L2-007)
- **AC-3** Given the braider profile content screen, when the editable gallery renders, then each item has a "Remove" action. (L2-027)

### States

- **AC-4** Given an editable item, when Nia activates its "Remove", then `removeRequested` is emitted once with that item. (L2-027)
- **AC-5** Given `busyId` is the first item, when Nia activates that item's "Remove" again, then nothing is emitted and the button reports busy. (L2-027)

### Keyboard and focus

- **AC-6** Given focus is on the first item's "Remove" and that item leaves `items`, when the gallery updates, then focus moves to the next item's "Remove". (L2-041)

### Screen readers

- **AC-7** Given the editable gallery, when a screen reader reaches the first action, then it announces "Remove Medium knotless braids · Oct 2026, button". (L2-041)
- **AC-8** Given the photo of medium knotless braids, when a screen reader reaches it, then it reads "Medium knotless braids shown from the back, with neat square parts". (L2-041)

### Theming

- **AC-9** Given the dark theme, when the gallery renders, then captions meet 4.5:1 and the art panel uses the dark accent tint. (L2-042)

### Responsive

- **AC-10** Given a 360 px viewport, when the profile gallery renders in its card, then items form two columns with no horizontal scrolling. (L2-042)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `src/lib/gallery/` with `gallery.ts` and `index.ts`. Composes `Button` and `Icon`.

## Decisions

- **D-1** *Empty items?* The component renders an empty list and logs nothing; pages show an empty state instead (design-system do/don't).
- **D-2** *Focus after removal?* The component owns it while items remain, because only it knows the button order; the consumer owns the empty case.
- **D-4** *Track minimum?* 8 rem, not the 10 rem first drawn. A card at 360 px has 278 px of content, which holds two 10 rem columns only if the gap were negative, so AC-10 could not hold. 8 rem fits two columns there. The design system stylesheet's `.gallery` rule still says 10 rem and needs the same change.
- **D-3** *Confirm before removing?* No dialog. Removing a portfolio photo is reversible by uploading it again, and the page reports the result with a toast.

# Avatar

| Field | Value |
|---|---|
| Selector | `span[hp-avatar]`, `hp-avatar-group` |
| Library path | `frontend/projects/components/src/lib/avatar/` |
| Status | planned |
| Traces to | L2-004, L2-007, L2-041, L2-042 |
| Design system | [`avatar.html`](../../design-system/components/avatar.html) |
| Source mocks | [`pages/braider-profile/default`](../../mocks/pages/braider-profile/default.html), [`pages/braider-profile/edge`](../../mocks/pages/braider-profile/edge.html), [`pages/braider-profile/partial`](../../mocks/pages/braider-profile/partial.html), [`pages/braider-profile/offline`](../../mocks/pages/braider-profile/offline.html), [`pages/matching-braiders/default`](../../mocks/pages/matching-braiders/default.html), [`dialogs/report-review/default`](../../mocks/dialogs/report-review/default.html) |
| Rendering | [`avatar.html`](avatar.html) |

## Purpose and scope

An avatar puts a face, or the initials, beside a person's name so Maya recognises who she is booking with at a glance: Nia Okafor's portrait in her profile header, a braider in a list row, the reviewer beside a review. It helps recognition and never carries information on its own: the name always sits beside it, so beside a name it is decorative. When there is no photo, or the photo fails, it shows the initials ("NO"); when the person is unknown, a `user` icon. A group stacks up to three avatars with a "+9" overflow and names everyone in one label.

Use something else when:

- the picture shows work (the braids), not the person: use the card's media (`.story-card__photo`, `.hero-photo`), including the full-width portrait on a matching result card (D-8);
- the content is loading in a list: use the skeleton's circle (`.skeleton--circle`), not an empty avatar;
- the image is an icon for an action or status: use the icon (`icon.md`).

Out of scope:

- The name, location and rating beside the avatar, and how they wrap. `.profile-head`, list rows and cards own that layout; the avatar only guarantees it never shrinks (D-9).
- The link or button around an avatar, its focus ring and its 44 px target.
- Uploading or cropping a portrait (braider profile maintenance, L2-027).
- The words that repeat the status dot ("Available Sat 24 Oct"); the result row or card writes them.
- Composing the group's accessible label ("Nia Okafor, Aisha Mensah, Jules Baptiste and 9 more braiders"); the consumer passes it in, translated.

## Usage

Every use of `.avatar` and `.profile-avatar` in `docs/mocks/`, plus the configurations the design-system pages define for later screens.

| Where | Configuration | Slots / content | States seen | Surface |
|---|---|---|---|---|
| Profile head on `pages/braider-profile/default`, `partial`, `offline`, and behind `dialogs/report-review/*` | `xl`, initials, decorative beside the `h2` "Nia Okafor" (mock: `div.profile-avatar`, drift D-6) | "NO" | initials (no photo published); 48 px on phones, 64 px from 768 px | surface (card) |
| Profile head with a published portrait (design-system anatomy) | `xl`, image, `loading="eager"`, decorative | Nia's portrait | loading frame, loaded, failed → "NO" | surface (card) |
| Profile head with the longest name and no photo (`pages/braider-profile/edge`) | `xl`, initials | "AA" for "Amara Nkiruka Adeyemi-Williams" | initials; name wraps beside or under it | surface (card) |
| Braider rows in lists: matching results shown as a list, braider lists (design-system list page) | `md`, image or initials, `status="available"` when an offered slot is supplied, decorative beside "Nia Okafor", "Aisha Mensah" | "NO", "AM", portraits | with and without status | surface (card, list) |
| Notification rows ("Nia received your request", list anatomy) | `md`, initials, decorative inside an interactive row link | "NO" | inside a hovered or focused row | surface (list) |
| Reviewer beside a review on `pages/braider-profile` ("Maya Chen, 3 Oct", design-system overview and sizes) | `sm`, initials, decorative | "MC" | default | surface (card) |
| Account control when the person is unknown (design-system overview) | `md`, `name` null → `user` icon, decorative inside a named link | icon | default | surface (top bar, menu) |
| Braiders who offer a style (design-system group) | `hp-avatar-group`, `md`, three people of twelve | Nia (portrait), "AM", "JB", "+9"; label "Nia Okafor, Aisha Mensah, Jules Baptiste and 9 more braiders" | with and without overflow | surface (card) |
| A standalone portrait with no name beside it (design-system labelling rule) | any size, `decorative` false | `alt="Nia Okafor"` or `role="img"` named "Nia Okafor" | default | any |
| Matching result card photo on `pages/matching-braiders/default` | not an avatar: card media (D-8) | `alt="Portrait of a braider"` in the mock, drift | — | — |

Every row is buildable with the API below: `name`, `src`, `size`, `status`, `decorative` and `loading` on the avatar, and `people`, `total`, `max`, `size` and `label` on the group.

## Anatomy

1. **Frame** — `.avatar` on the host. A circle (`--radius-full`) of `--avatar-size`, `--color-accent-subtle` fill that shows while an image loads, `overflow: hidden`, `flex: none`, `position: relative`.
2. **Content** — one of: an `<img>` filling the frame with `object-fit: cover`; two initials in `--avatar-font`, `--color-fg-accent`; or a `user` icon (`svg.icon`) sized to the avatar.
3. **Status dot (optional)** — `.avatar__status`: a quarter of the size (at least 8 px), bottom right, `--color-success-icon`, ringed with `--border-width-thick` of `--color-bg-surface`.
4. **Group** — `.avatar-group` on the `hp-avatar-group` host: a flex row of up to three avatars overlapping by `--space-2`, each ringed in `--color-bg-surface`, followed by an overflow avatar showing "+N".

Hosts: the avatar uses an attribute selector, so the host **is** the `<span class="avatar">` and its content is the template (D-1). The group is a composite with the element selector `hp-avatar-group`; the host carries `.avatar-group`, `role="img"` and `aria-label`, and its children are `span[hp-avatar]` hosts, so `.avatar-group .avatar` rules match them directly.

## API

### `span[hp-avatar]` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `name` | `string \| null` | — | yes | The person's full name. Source of the initials (D-3) and of the accessible name when not decorative. `null` or blank means an unknown person: the `user` icon renders. |
| `src` | `string \| null` | `null` | no | Portrait URL. When set and loading or loaded, the `<img>` renders. On the image's `error` event the avatar switches to initials (or the icon when `name` is null) and stays switched until `src` changes. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | no | Adds `.avatar--sm`, `.avatar--lg` or `.avatar--xl`; md adds no modifier. Selects the icon size for an unknown person: `sm` → `icon--sm`, `md` → default, `lg` and `xl` → `icon--lg`. |
| `status` | `'available' \| null` | `null` | no | `'available'` renders `.avatar__status`. Set it only when the braider has a supplied offered slot, and write the availability beside the avatar in words. |
| `decorative` | `boolean` (`booleanAttribute`) | `true` | no | True: `alt=""` on the image, `aria-hidden="true"` on an initials or icon avatar. False: the image's `alt` is `name`; an initials avatar gets `role="img"` and `aria-label` equal to `name`. False with a null `name` logs a development error naming `hp-avatar` (D-4) and renders as decorative. |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | no | Written to the image's `loading` attribute. The profile header passes `'eager'`, because the portrait is above the fold. |

### `hp-avatar-group` inputs

| Input | Type | Default | Required | Rule |
|---|---|---|---|---|
| `people` | `readonly { name: string \| null; src?: string \| null }[]` | — | yes | The people to show, in order. The first `max` render as decorative avatars. |
| `label` | `string` | — | yes | The group's accessible name, composed and translated by the consumer: "Nia Okafor, Aisha Mensah, Jules Baptiste and 9 more braiders". Written to `aria-label` on the host. |
| `total` | `number \| null` | `null` | no | The real number of people when `people` holds only the first few (12 braiders, three returned). Defaults to `people.length`. |
| `max` | `number` | `3` | no | Faces shown before the overflow. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | no | Passed to every avatar in the group, including the overflow. |

- The overflow avatar renders when `(total ?? people.length) > max`, showing "+" and the remainder ("+9"), decorative.
- Inputs are signal inputs; `decorative` accepts a bare attribute.
- The avatar renders no copy of its own: initials and "+9" are derived from data; `label` and `name` come from the consumer.

### Outputs

None. Neither component is interactive. The image fallback is internal state, not an event.

### Content slots

None. Both templates render from inputs; projected content is ignored.

## Variants and sizes

| Variant | Trigger | Use for |
|---|---|---|
| Image | `src` loaded | The braider's or customer's own portrait. Preferred when one exists. |
| Initials | no `src`, or the image failed | Two letters, first and last name: "NO", "AM", "JB", "MC", "AA". |
| Unknown person | `name` null | The `user` icon, for example in an account control before sign-in. |
| With status | `status="available"` | A braider with a supplied offered slot this week, in a result row. |
| Group | `hp-avatar-group` | Up to three people and a "+N" overflow. |

| Size | Modifier | Box (`--avatar-size`) | Initials (`--avatar-font`) | Use |
|---|---|---|---|---|
| sm | `.avatar--sm` | 2 rem (32 px) | `--text-caption` | Inline with body text, the reviewer beside a review |
| md | — | 2.5 rem (40 px) | `--text-label` | List and result rows, notification rows, groups |
| lg | `.avatar--lg` | 3 rem (48 px) | `--text-h4` | Leading a card |
| xl | `.avatar--xl` | 3 rem (48 px) below 768 px, 4 rem (64 px) from `--layout-breakpoint-md` | `--text-h3` | The profile header |

## States

The avatar is not interactive: no hover, focus, active or disabled state. When it sits in a link or row, the container owns those states and the focus ring. Its content changes with the data:

| State | Trigger | Visual | Assistive technology |
|---|---|---|---|
| Image loading | `src` set, not yet loaded | `--color-accent-subtle` circle at full size from the first paint; no spinner, no fade | Decorative: nothing. Standalone: `alt` already set |
| Image loaded | `load` | The portrait fills the circle, `object-fit: cover` | Decorative: `alt=""`. Standalone: `alt` is the name |
| Image failed | `error` | Initials replace the image at the same size; no broken-image icon | Decorative: `aria-hidden="true"`. Standalone: `role="img"`, named |
| Image missing | `src` null | Initials | As above |
| Unknown person | `name` null | `user` icon in `--color-fg-accent` | Always decorative |
| With status | `status="available"` | Success dot bottom right with a surface ring | The dot is not exposed; the row's words state the availability |
| In a group | parent `hp-avatar-group` | Overlap by `--space-2`, ring `--border-width-thick` of `--color-bg-surface` | Children hidden; the group is one image named by `label` |
| Group overflow | `total` > `max` | A final avatar with "+9" in the initials style | Part of the group's label ("and 9 more braiders") |
| Inside a link or row | parent | Unchanged; the parent shows hover and the focus ring | Not announced separately |
| Dark theme | theme | Frame `--palette-plum-950`, initials `--palette-plum-300` | — |
| Forced colours | `(forced-colors: active)` | A `CanvasText` hairline border keeps the circle visible; initials in `CanvasText`; the status dot in `CanvasText` (D-7) | — |
| Reduced motion | `(prefers-reduced-motion: reduce)` | Nothing changes; nothing animates | — |
| Narrow container or enlarged text | 320 px, text at 200 % | The avatar keeps its size and never shrinks; a group wraps onto a second row instead of overflowing (D-5) | — |

## Markup

Rendered DOM. Classes and attributes are the e2e contract; the `<span>` is the host.

```html
<!-- rendered: initials, decorative (Nia's profile head, no photo) -->
<span class="avatar avatar--xl" aria-hidden="true">NO</span>
```

```html
<!-- rendered: image, decorative; and after the image fails -->
<span class="avatar avatar--xl"><img src="/media/braiders/nia-okafor.jpg" alt="" loading="eager" decoding="async"></span>
<span class="avatar avatar--xl" aria-hidden="true">NO</span>
```

```html
<!-- rendered: unknown person (md) -->
<span class="avatar" aria-hidden="true"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 20a8 8 0 0 1 16 0"></path></svg></span>
```

```html
<!-- rendered: with status (result row) -->
<span class="avatar"><img src="/media/braiders/nia-okafor.jpg" alt="" loading="lazy" decoding="async"><span class="avatar__status"></span></span>
```

```html
<!-- rendered: standalone (no name beside it) -->
<span class="avatar avatar--lg"><img src="/media/braiders/nia-okafor.jpg" alt="Nia Okafor" loading="lazy" decoding="async"></span>
<span class="avatar avatar--lg" role="img" aria-label="Nia Okafor">NO</span>
```

```html
<!-- rendered: group with overflow -->
<hp-avatar-group class="avatar-group" role="img" aria-label="Nia Okafor, Aisha Mensah, Jules Baptiste and 9 more braiders">
  <span class="avatar"><img src="/media/braiders/nia-okafor.jpg" alt="" loading="lazy" decoding="async"></span>
  <span class="avatar" aria-hidden="true">AM</span>
  <span class="avatar" aria-hidden="true">JB</span>
  <span class="avatar" aria-hidden="true">+9</span>
</hp-avatar-group>
```

Sizes add `.avatar--sm`, `.avatar--lg` or `.avatar--xl` to the host and nothing else; the unknown-person icon gains `icon--sm` or `icon--lg` with them.

Consumer templates:

```html
<!-- consumer: braider profile head -->
<div class="profile-head">
  <span hp-avatar [name]="braider.name" [src]="braider.portraitUrl" size="xl" loading="eager"></span>
  <div><h2>{{ braider.name }}</h2><p>{{ braider.area }} · …</p></div>
</div>

<!-- consumer: result row with availability -->
<span hp-avatar [name]="result.braiderName" [src]="result.portraitUrl" [status]="result.nextSlot ? 'available' : null"></span>

<!-- consumer: reviewer -->
<span hp-avatar name="Maya Chen" size="sm"></span>

<!-- consumer: group -->
<hp-avatar-group [people]="braiders()" [total]="12" [label]="groupLabel()" />
```

Free to change: the order of attributes on the `<img>`.

## Design

- Size: `width` and `height` `--avatar-size` (2 / 2.5 / 3 / 3→4 rem by size); `flex: none`, so a flex parent never shrinks it.
- Shape: `--radius-full`; `overflow: hidden` clips the image to the circle.
- Initials: `--avatar-font` (`--text-caption` / `--text-label` / `--text-h4` / `--text-h3`), centred with `display: inline-grid; place-items: center`; uppercase from the derivation, not from CSS.
- Image: `width: 100%; height: 100%; object-fit: cover`.
- Status dot: 25 % of the box with a 0.5 rem minimum, `position: absolute; right: 0; bottom: 0`, ring `box-shadow: 0 0 0 --border-width-thick --color-bg-surface`.
- Group: `display: flex; flex-wrap: wrap; row-gap: --space-1`; each avatar ringed with `--border-width-thick` of `--color-bg-surface` and overlapping the next by `--space-2`, drawn with a negative inline-end margin on each avatar and matching inline-end padding on the group, so a wrapped row starts flush (D-5).
- Elevation, motion, layer: none.

Component tokens:

| Token | Aliases | Overridden by |
|---|---|---|
| `--avatar-size` | 2.5 rem | `.avatar--sm` → 2 rem; `.avatar--lg` → 3 rem; `.avatar--xl` → 3 rem, 4 rem from 768 px; a consumer's local override (a reviewer list) |
| `--avatar-font` | `--text-label` | `.avatar--sm` → `--text-caption`; `.avatar--lg` → `--text-h4`; `.avatar--xl` → `--text-h3` |

## Colour

| Part | Token | Light | Dark |
|---|---|---|---|
| Frame (initials, icon, loading) | `--color-accent-subtle` | `--palette-plum-50` | `--palette-plum-950` |
| Initials and icon | `--color-fg-accent` | `--palette-plum-700` | `--palette-plum-300` |
| Status dot | `--color-success-icon` | `--palette-green-500` | `--palette-green-300` |
| Status ring and group ring | `--color-bg-surface` | `--palette-white` | `--palette-gray-900` |

Contrast pairs, checked in both themes:

| Foreground | Background | Minimum | Use |
|---|---|---|---|
| `--color-fg-accent` | `--color-accent-subtle` | 4.5:1 | Initials and "+9" (from `tokens/contrast-pairs.json`) |
| `--color-success-icon` | `--color-bg-surface` | 3:1 | Status dot against a card (D-10) |

The frame against the card (`--color-accent-subtle` on `--color-bg-surface`) is deliberately low contrast: the circle is decorative and the initials carry the content.

Forced colours: backgrounds are replaced by the system, so the avatar adds a `CanvasText` hairline border and the dot is drawn in `CanvasText` with `forced-color-adjust: none` (D-7). Images keep their colours.

## Responsive behaviour

- Only `xl` changes with the viewport: 48 px below `--layout-breakpoint-md` (768 px), 64 px from it.
- The avatar never shrinks in a row (`flex: none`). Measured on `pages/braider-profile/edge` with "Amara Nkiruka Adeyemi-Williams": at 320 and 360 px the avatar stays 48 × 48 px and the profile head moves the name and meta under it; from 768 px they sit beside it.
- Groups show at most three faces plus the overflow at every width. When the row is wider than its container, as with text enlarged to 200 % at 360 px (four 80 px circles), the group wraps onto a second row, each row starting flush with the container, and nothing overflows (D-5).
- Avatar sizes are rem, so text enlarged to 200 % doubles them (64 px md, 96 px xl on phones) and the initials stay inside the circle.
- Not a target. When an avatar is the only visible part of a link, the link is at least 44 px square (`--target-comfortable`).

## Accessibility

### Role and pattern

A `<span>` with an `<img>`, initials or an icon inside. No ARIA pattern. Beside a visible name the avatar is hidden from assistive technology (`alt=""` or `aria-hidden="true"`), so a screen reader never says "N O, Nia Okafor". A standalone avatar is an image named with the person's name. A group is one image (`role="img"`) named by its label.

### Keyboard

| Key | Action |
|---|---|
| <kbd>Tab</kbd> | Skips the avatar and the group; neither is focusable. Inside a link, focus lands on the link. |

### Focus

None on the avatar. The surrounding link or row shows the shared ring.

### Labelling

- Decorative (default): `alt=""` on the image; `aria-hidden="true"` on initials and icon avatars.
- Standalone (`decorative` false): the image's `alt` is the full name ("Nia Okafor"), never a description ("Portrait of a braider"); an initials avatar is `role="img"` with `aria-label` the full name.
- The status dot is never exposed; the availability is written beside it ("Available Sat 24 Oct").
- A group's children are hidden; the group's `aria-label` names everyone and the overflow ("… and 9 more braiders").

### Announcements

None. An image falling back to initials is not announced.

### Motion

None. Images do not fade in; the frame is visible from the first paint.

## Content and internationalisation

- Initials: the first letter of the first word and of the last word of the name, uppercased with the locale: "Nia Okafor" → "NO", "Maya Chen" → "MC", "Amara Nkiruka Adeyemi-Williams" → "AA". One letter for a single name ("Nia" → "N"). Letters are whole graphemes, so accented initials survive ("Élodie Ngata" → "ÉN") (D-3).
- Use the person's own photo; never stock imagery or a hairstyle photo.
- Overflow reads "+9"; the group label says "and 9 more braiders".
- Translatable content: the group's `label`. Data values: `name`, `src`, the derived initials and the overflow number. The avatar renders no other text.
- Long names never enter the circle; they wrap in the text beside it.

## Performance

- Change detection: `OnPush`, signal inputs; initials, the content mode and the group's visible people and overflow are `computed`. The failed-image flag is a signal reset when `src` changes.
- Perf-test scenarios: `frontend/projects/perf-test/src/scenarios/Avatar.ts` renders Nia's profile-head avatar, `<span hp-avatar name="Nia Okafor" size="xl"></span>` (initials "NO", no network); `frontend/projects/perf-test/src/scenarios/AvatarGroup.ts` renders the group of three braiders of twelve with the label "Nia Okafor, Aisha Mensah, Jules Baptiste and 9 more braiders", using initials only. Iterations in `e2e/perf-test/config/scenario-iterations.mjs` keep each at roughly 100–300 ms.
- Regression rule: a change to either template, inputs, styles or change detection is measured against the base branch with `--fail-on-regression` before it is pushed.
- Layout stability: the frame has its final size before the image loads, and the fallback keeps it, so neither loading nor failing shifts the layout.
- Weight: `@angular/core` and the icon component; `loading="lazy"` and `decoding="async"` keep off-screen portraits from competing with the page's main content.
- Render cost has no L2 requirement, so it has no criterion here.

## Acceptance criteria

### Rendering

- **AC-1** Given Nia Okafor's profile with no published portrait, when the profile head renders `<span hp-avatar name="Nia Okafor" size="xl">` beside the heading "Nia Okafor", then the DOM holds `<span class="avatar avatar--xl" aria-hidden="true">NO</span>` with no wrapper, and a screen reader reads the name once. (L2-007)
- **AC-2** Given Nia's published portrait, when the profile head renders it, then the avatar contains one `<img>` with `alt=""` and `loading="eager"`, cropped to the circle with `object-fit: cover`. (L2-007)
- **AC-3** Given Nia's portrait URL that fails to load, when the image raises its error, then the avatar shows "NO" at the same size, no broken-image icon appears, and the page does not shift. (L2-007)
- **AC-4** Given a portrait that is still downloading, when the profile head paints, then the avatar is already its final size with the `--color-accent-subtle` circle visible, and the heading beside it does not move when the image arrives. (L2-007)
- **AC-5** Given the names "Amara Nkiruka Adeyemi-Williams", "Aisha Mensah", "Maya Chen" and "Nia", when initials avatars render, then they show "AA", "AM", "MC" and "N". (L2-007)
- **AC-6** Given an avatar with `name` null at size `md`, when it renders, then it contains the `user` icon (`svg.icon`, 20 px) in `--color-fg-accent`, and the avatar has `aria-hidden="true"`. (L2-041)

### Sizes

- **AC-7** Given four initials avatars "NO" at `sm`, `md`, `lg` and `xl`, when they render on a 360 px viewport and again at 1280 px, then they measure 32, 40, 48 and 48 px at 360 px, and the `xl` avatar measures 64 px at 1280 px. (L2-042)

### Status

- **AC-8** Given Nia's result row with a supplied offered slot and the text "Available Sat 24 Oct", when her avatar renders with `status="available"`, then it contains `.avatar__status`, a dot a quarter of the avatar's size in `--color-success-icon` with a 2 px `--color-bg-surface` ring, and the dot is not exposed to assistive technology. (L2-004)
- **AC-9** Given Aisha Mensah's result row with no supplied availability, when her avatar renders, then it has no `.avatar__status` element. (L2-004)

### Group

- **AC-10** Given `hp-avatar-group` with Nia (portrait), Aisha and Jules, `total` 12 and the label "Nia Okafor, Aisha Mensah, Jules Baptiste and 9 more braiders", when it renders, then the host has `class="avatar-group"`, `role="img"` and that `aria-label`, shows three avatars and a fourth reading "+9", and none of its children is exposed separately. (L2-041)
- **AC-11** Given a group of two people with no `total`, when it renders, then it shows two avatars and no overflow avatar. (L2-041)
- **AC-12** Given the group of three plus "+9" at default text size, when it is measured, then each avatar overlaps the next by 8 px and is ringed with 2 px of `--color-bg-surface`. (L2-041)

### Screen readers

- **AC-13** Given a standalone avatar for Nia (`decorative` false), when it renders with her portrait, then the image's `alt` is "Nia Okafor"; and when it renders initials, then the avatar is `role="img"` named "Nia Okafor"; in neither case is the text "Portrait of a braider" present. (L2-041)
- **AC-14** Given the notification row link "Nia received your request" with a leading "NO" avatar, when Maya presses Tab, then focus lands on the link, the avatar has no `tabindex`, and the link's accessible name contains no "N O". (L2-041)
- **AC-15** Given an avatar with `decorative` false and `name` null in a development build, when it initialises, then the console reports an error naming `hp-avatar` and the missing name, and the avatar renders as decorative. (L2-041)

### Theming

- **AC-16** Given the "NO" avatar, when the theme switches from light to dark, then its frame changes to the dark `--color-accent-subtle` (plum 950) and its initials to the dark `--color-fg-accent` (plum 300) without a reload. (L2-042)
- **AC-17** Given the initials avatar and the status dot in each theme, when contrast is measured, then the initials reach at least 4.5:1 against the frame and the dot at least 3:1 against `--color-bg-surface`. (L2-041)
- **AC-18** Given Windows forced colours, when an initials avatar with a status dot renders, then the circle has a `CanvasText` border, the initials are visible and the dot is drawn in `CanvasText`. (L2-041)

### Responsive

- **AC-19** Given the braider profile edge state with "Amara Nkiruka Adeyemi-Williams" on a 320 px viewport, when the profile head renders, then the avatar stays 48 × 48 px and keeps its circle, and the avatar causes no horizontal scrolling. (L2-042)
- **AC-20** Given the group of three plus "+9" on a 360 px viewport with text enlarged to 200 %, when it renders, then the avatars wrap onto a second row, no avatar extends past either edge of its container, and the page does not scroll horizontally. (L2-042)

### Motion

- **AC-21** Given a portrait that finishes loading, when it appears, then it appears without a fade or any transition, with or without `prefers-reduced-motion: reduce`. (L2-041)

### Performance

Render cost is measured by the perf-test scenarios named under *Performance* and gated by `--fail-on-regression`; no L2 requirement covers it, so it has no criterion here.

## Implementation notes

- Folder `frontend/projects/components/src/lib/avatar/`; files `avatar.ts` (standalone component `Avatar`, `selector: 'span[hp-avatar]'`) and `avatar-group.ts` (standalone component `AvatarGroup`, `selector: 'hp-avatar-group'`), both `changeDetection: OnPush` with scoped `styles` porting `.avatar`, `.avatar--*`, `.avatar__status` and `.avatar-group` from `docs/design-system/assets/components.css` onto `:host`. Export both and the `AvatarPerson` type from `public-api.ts`.
- `Avatar` host bindings: `class.avatar` always; `class.avatar--sm|lg|xl`; `attr.aria-hidden` (`'true'` when showing initials or the icon and decorative); `attr.role` and `attr.aria-label` (initials, not decorative).
- `Avatar` template: `@switch` over a `mode` computed from `src`, the failed flag and `name`: `<img [src] [alt] [attr.loading] decoding="async" (error)="failed.set(true)">`, the initials text, or `<svg hp-icon name="user" [size]="iconSize()">`; then `@if (status() === 'available') { <span class="avatar__status"></span> }`.
- Initials (D-3): split the trimmed name on whitespace; take the first grapheme (`Intl.Segmenter` with `granularity: 'grapheme'`) of the first and, when there are two or more words, the last word; `toLocaleUpperCase()`.
- `AvatarGroup` host bindings: `class.avatar-group`, `role="img"`, `attr.aria-label` from `label`; template renders `people().slice(0, max())` as `<span hp-avatar [name] [src] [size]>` and, when needed, `<span class="avatar" [class.avatar--…]="…" aria-hidden="true">+{{ overflow() }}</span>`.
- Ported CSS changes, mirrored in `components.css` and the avatar page in the same slice: the group overlap and wrap (D-5); the forced-colour border and dot (D-7); the `.profile-avatar` alias is not rendered by the component (D-6); the ring width uses `--border-width-thick` instead of a literal 2 px.
- Composes the icon component (`icon.md`). No CDK primitive.
- Perf-test scenarios `Avatar.ts` and `AvatarGroup.ts` in `frontend/projects/perf-test/src/scenarios/`, exported from `src/scenarios/index.ts`, with iterations in `e2e/perf-test/config/scenario-iterations.mjs`.

## Decisions

- **D-1** *Is the avatar's host a wrapper (`<hp-avatar>`) or the `<span class="avatar">`?* The span, through `span[hp-avatar]`. The design system's group rules are `.avatar-group .avatar` and `.avatar-group .avatar:first-child`: with a wrapper element every inner span would be a first child and lose its overlap. `.profile-head` also expects the avatar itself as its flex item (`flex: none`). The group is a composite and uses the element selector `hp-avatar-group`.
- **D-2** *Where does the group's label come from?* The consumer, as a required input. The label contains copy ("and 9 more braiders") that must be translatable, and only the consumer knows what the people are (braiders, reviewers).
- **D-3** *How are initials derived, and can a consumer override them?* From `name`: first grapheme of the first and last words, uppercased; one letter for a one-word name. No override input: the design system's rule is mechanical, and every person in the product has a name record. Graphemes, not code units, so accented and combined letters stay whole.
- **D-4** *What happens when a standalone avatar has no name?* It cannot be named, so it renders as decorative and development builds log an error naming `hp-avatar`. The design system requires the name as alt text; a nameless standalone avatar is a consumer bug, caught where it is made.
- **D-5** *The group overflows its container when text is enlarged.* Measured in Chromium with a specimen card at 360 px and text at 200 %: the four 80 px circles need 272 px in a 198 px content box. The group therefore wraps (`flex-wrap: wrap`, `row-gap: --space-1`). With the design system's negative left margin a wrapped row starts 16 px outside the container (measured), so the overlap moves to a negative inline-end margin on each avatar with matching inline-end padding on the group; at default text size the overlap and positions are identical to the design system (measured: 32 px steps).
- **D-6** *The mocks render `div.profile-avatar`; the design system keeps `.profile-avatar` as an alias of `.avatar--xl`. Which classes does the component render?* `span.avatar.avatar--xl`. The design system records `.profile-avatar` as drift kept only so the static mocks still render; the e2e page objects locate `.profile-head .avatar`.
- **D-7** *What does the avatar look like in forced colours?* Forced colours remove the frame's fill, leaving floating initials and an invisible dot. The avatar gains a `CanvasText` hairline border (as badges, chips and cards do in the design system) and the dot is drawn in `CanvasText` with `forced-color-adjust: none`.
- **D-8** *The design system lists the matching-braiders result photo as an avatar source, but the mock and the tables-and-lists pattern draw it as a full-width card photo. Which is it?* The result card keeps the full-width photo as card media (card CRD), with the braider's name as its alt text or `alt=""` beside the heading, as the avatar page's labelling rule says. The avatar, with its status dot, is used where a braider appears in a row (matching results as a list, braider lists), which is where the design system places the dot.
- **D-9** *Who handles the long name in the profile head?* The profile head (card and page), not the avatar. Measured in Chromium with a profile-head specimen in a card (the edge state's name "Amara Nkiruka Adeyemi-Williams" with initials "AA") at 360 px and text at 200 %, the word "Adeyemi-Williams" in the heading runs 3 px past the card's content box while the avatar stays inside; the heading needs to break long words. The avatar's requirement is only that it never shrinks or clips (AC-19).
- **D-10** *The design-system page checks the status dot as `--color-success-solid`, but the stylesheet paints it `--color-success-icon`. Which token?* `--color-success-icon`, as the stylesheet does: it is the token for a status mark, and it reaches 3:1 against `--color-bg-surface` in both themes (4.1:1 light, 9.5:1 dark). The dot is decorative because the availability is written out, so 3:1 is a design-system floor, not a WCAG requirement.

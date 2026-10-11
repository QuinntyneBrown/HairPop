import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Icon } from '../icon/icon';

/** One portfolio photo with its caption. A null `src` renders the art panel instead. */
export interface GalleryItem {
  readonly id: string;
  readonly src: string | null;
  readonly alt: string;
  /** "{style} · {Mon YYYY}", up to 120 characters. */
  readonly caption: string;
}

/**
 * Portfolio work as a grid of square, captioned photos (gallery.md): read-only on the public
 * braider profile. The host is the native `<ul>`, so screen readers announce the item count.
 * The empty portfolio is the page's empty state, not an empty gallery (D-1).
 */
@Component({
  selector: 'ul[hp-gallery]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { class: 'gallery' },
  template: `
    @for (item of items(); track item.id) {
      <li class="gallery__item">
        <figure>
          @if (item.src; as src) {
            <img
              class="gallery__photo"
              [src]="src"
              [alt]="item.alt"
              loading="lazy"
              decoding="async"
            />
          } @else {
            <div class="gallery__art" aria-hidden="true">
              <svg hp-icon name="sparkle" size="lg"></svg>
            </div>
          }
          <figcaption class="gallery__caption">{{ item.caption }}</figcaption>
        </figure>
      </li>
    }
  `,
  styles: `
    :host {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 8rem), 1fr));
      gap: var(--space-3);
    }

    .gallery__item {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    figure {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .gallery__photo,
    .gallery__art {
      display: block;
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: var(--radius-md);
    }

    .gallery__art {
      display: grid;
      place-items: center;
      color: var(--color-fg-accent);
      background: var(--color-accent-subtle);
    }

    .gallery__caption {
      font: var(--text-caption);
      color: var(--color-fg-muted);
      overflow-wrap: anywhere;
    }

    @media (forced-colors: active) {
      .gallery__photo {
        border: var(--border-width-hairline) solid CanvasText;
      }
    }
  `,
})
export class Gallery {
  /** The portfolio items, rendered in order. */
  readonly items = input.required<readonly GalleryItem[]>();
}

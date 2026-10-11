import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Gallery, GalleryItem } from '@hairpop/components';

import { Example } from '../shared';

/** Nia's portfolio: two photos and one item whose photo is missing. */
const NIA_WORK: readonly GalleryItem[] = [
  {
    id: 'work-1',
    src: null,
    alt: 'Medium knotless braids shown from the back, with neat square parts',
    caption: 'Medium knotless braids · Oct 2026',
  },
  {
    id: 'work-2',
    src: null,
    alt: 'Nia Okafor smiling in her studio',
    caption: 'Nia at the studio · Sep 2026',
  },
  { id: 'work-3', src: null, alt: '', caption: 'Passion twists · Sep 2026' },
];

/** Stories for the gallery (gallery.md): the read-only grid and an item without a photo. */
@Component({
  selector: 'hp-gallery-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Example, Gallery],
  template: `
    <hp-example
      heading="Read-only"
      description="Square, captioned items on the public profile. An item without a photo shows the art panel and its caption."
    >
      <ul hp-gallery [items]="work"></ul>
    </hp-example>
  `,
})
export class GalleryExamples {
  protected readonly work = NIA_WORK;
}

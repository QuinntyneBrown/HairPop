import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Gallery, GalleryItem } from '@hairpop/components';

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

/** Nia's three portfolio items on her public profile. */
@Component({
  selector: 'hp-gallery-scenario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Gallery],
  template: `<ul hp-gallery [items]="work"></ul>`,
})
export default class GalleryScenario {
  protected readonly work = NIA_WORK;
}

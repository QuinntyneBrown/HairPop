import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Avatar, AvatarGroup, AvatarPerson } from '@hairpop/components';

import { Example } from '../shared';

/** A neutral silhouette portrait, so the image state renders without a media server. */
const PORTRAIT =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" fill-opacity=".12"/>' +
      '<circle cx="32" cy="25" r="11" fill-opacity=".45"/>' +
      '<path d="M10 64a22 22 0 0 1 44 0z" fill-opacity=".45"/></svg>',
  );

/** Stories for the avatar (avatar.md): every content mode, size, status and the group. */
@Component({
  selector: 'hp-avatar-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, AvatarGroup, Example],
  template: `
    <hp-example heading="Sizes" description="sm 32 px, md 40 px, lg 48 px, xl 48 px then 64 px.">
      <span hp-avatar name="Nia Okafor" size="sm"></span>
      <span hp-avatar name="Nia Okafor"></span>
      <span hp-avatar name="Nia Okafor" size="lg"></span>
      <span hp-avatar name="Nia Okafor" size="xl"></span>
    </hp-example>

    <hp-example heading="Initials" description="First and last word; one word gives one letter.">
      <span hp-avatar name="Maya Chen"></span>
      <span hp-avatar name="Aisha Mensah"></span>
      <span hp-avatar name="Jules Baptiste"></span>
      <span hp-avatar name="Amara Nkiruka Adeyemi-Williams"></span>
      <span hp-avatar name="Nia"></span>
    </hp-example>

    <hp-example heading="Image" description="The portrait fills the circle.">
      <span hp-avatar name="Nia Okafor" [src]="portrait" size="sm"></span>
      <span hp-avatar name="Nia Okafor" [src]="portrait"></span>
      <span hp-avatar name="Nia Okafor" [src]="portrait" size="lg"></span>
      <span hp-avatar name="Nia Okafor" [src]="portrait" size="xl" loading="eager"></span>
    </hp-example>

    <hp-example
      heading="Image failed"
      description="The portrait URL does not load, so initials replace it at the same size."
    >
      <span hp-avatar name="Nia Okafor" src="/media/braiders/nia-okafor.jpg" size="xl"></span>
      <span hp-avatar name="Aisha Mensah" src="/media/braiders/aisha-mensah.jpg"></span>
    </hp-example>

    <hp-example heading="Unknown person" description="No name: the user icon, always decorative.">
      <span hp-avatar [name]="null" size="sm"></span>
      <span hp-avatar [name]="null"></span>
      <span hp-avatar [name]="null" size="lg"></span>
      <span hp-avatar [name]="null" size="xl"></span>
    </hp-example>

    <hp-example
      heading="With status"
      description="A supplied offered slot this week; the row says it in words."
    >
      <div class="row">
        <span hp-avatar name="Nia Okafor" [src]="portrait" status="available"></span>
        <span>Nia Okafor · available Sat 24 Oct</span>
      </div>
      <div class="row">
        <span hp-avatar name="Aisha Mensah" status="available"></span>
        <span>Aisha Mensah · available this week</span>
      </div>
    </hp-example>

    <hp-example
      heading="Standalone"
      description="No name beside it, so the avatar is named: an image alt, or role img."
    >
      <span hp-avatar name="Nia Okafor" [src]="portrait" size="lg" [decorative]="false"></span>
      <span hp-avatar name="Nia Okafor" size="lg" [decorative]="false"></span>
    </hp-example>

    <hp-example heading="Beside a name" description="The reviewer beside a review, decorative.">
      <div class="row">
        <span hp-avatar name="Maya Chen" size="sm"></span>
        <span>Maya Chen · reviewed Sat 3 Oct</span>
      </div>
    </hp-example>

    <hp-example
      heading="Group"
      description="Up to three faces and a “+N” overflow, named as one image."
    >
      <hp-avatar-group
        [people]="braiders"
        [total]="12"
        label="Nia Okafor, Aisha Mensah, Jules Baptiste and 9 more braiders"
      />
      <hp-avatar-group [people]="braiders" label="Nia Okafor, Aisha Mensah and Jules Baptiste" />
      <hp-avatar-group
        [people]="braiders"
        [total]="12"
        size="sm"
        label="Nia Okafor, Aisha Mensah, Jules Baptiste and 9 more braiders"
      />
    </hp-example>

    <hp-example heading="Group, two faces" description="max 2 moves the rest into the overflow.">
      <hp-avatar-group
        [people]="braiders"
        [max]="2"
        size="lg"
        label="Nia Okafor, Aisha Mensah and 1 more braider"
      />
    </hp-example>

    <hp-example heading="Group, narrow" description="A row too narrow for every face wraps flush.">
      <div class="narrow">
        <hp-avatar-group
          [people]="everyone"
          [max]="5"
          size="xl"
          label="Nia Okafor, Aisha Mensah, Jules Baptiste, Maya Chen and Amara Nkiruka Adeyemi-Williams"
        />
      </div>
    </hp-example>
  `,
  styles: `
    .row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .narrow {
      max-width: var(--layout-card-min);
    }
  `,
})
export class AvatarExamples {
  protected readonly portrait = PORTRAIT;

  protected readonly braiders: readonly AvatarPerson[] = [
    { name: 'Nia Okafor', src: PORTRAIT },
    { name: 'Aisha Mensah' },
    { name: 'Jules Baptiste' },
  ];

  protected readonly everyone: readonly AvatarPerson[] = [
    ...this.braiders,
    { name: 'Maya Chen' },
    { name: 'Amara Nkiruka Adeyemi-Williams' },
  ];
}

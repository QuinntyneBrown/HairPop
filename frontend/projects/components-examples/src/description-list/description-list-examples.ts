import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Badge, Button, Card, DescriptionList, InlineMessage, Link } from '@hairpop/components';

import { Example } from '../shared';

/**
 * Stories for the description list (description-list.md): horizontal and stacked layouts, and
 * present, pending, missing and omitted values. Horizontal stacks below 640 px.
 */
@Component({
  selector: 'hp-description-list-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Badge, Button, Card, DescriptionList, Example, InlineMessage, Link],
  template: `
    <hp-example
      heading="Horizontal"
      description="Pending request HP-1048: terms beside values from 640 px."
    >
      <section hp-card class="stack full" aria-labelledby="dl-example-pending">
        <h2 id="dl-example-pending">Medium knotless braids</h2>
        <dl hp-description-list>
          <dt>Status</dt>
          <dd><span hp-badge tone="warning">Awaiting reply</span></dd>
          <dt>Service</dt>
          <dd>Medium knotless braids</dd>
          <dt>Braider</dt>
          <dd><a hp-link href="#nia-okafor">Nia Okafor</a></dd>
          <dt>Preferred time</dt>
          <dd>Sat 24 Oct · 10:00 am · about 5 hours</dd>
          <dt>Estimate</dt>
          <dd>$180–$240</dd>
          <dt>Final price</dt>
          <dd class="text-muted">Nia confirms after accepting</dd>
          <dt>Location</dt>
          <dd class="text-muted">Shared after Nia accepts</dd>
        </dl>
      </section>
    </hp-example>

    <hp-example heading="Confirmed" description="Every value present.">
      <dl hp-description-list class="full">
        <dt>Status</dt>
        <dd><span hp-badge tone="success">Confirmed</span></dd>
        <dt>Time</dt>
        <dd>Sat 24 Oct · 10:00 am</dd>
        <dt>Confirmed estimate</dt>
        <dd>$210</dd>
        <dt>Studio address</dt>
        <dd>1246 Bloor Street West, Toronto</dd>
      </dl>
    </hp-example>

    <hp-example
      heading="Stacked"
      description="Asides and narrow cards: one column at every width, with a missing value."
    >
      <aside hp-card class="aside" aria-labelledby="dl-example-before">
        <h2 id="dl-example-before">Before you book</h2>
        <dl hp-description-list layout="stacked">
          <dt>Service area</dt>
          <dd>Toronto West</dd>
          <dt>Address</dt>
          <dd class="text-muted">Shared after confirmation</dd>
          <dt>Reviews</dt>
          <dd>
            <span hp-inline-message kind="status" tone="danger">Couldn’t load</span> ·
            <a hp-link href="#reviews">Retry reviews</a>
          </dd>
        </dl>
      </aside>
    </hp-example>

    <hp-example
      heading="Omitted"
      description="A fact the record does not have is left out, never shown as a dash."
    >
      <div class="stack full">
        <div>
          <button hp-button size="sm" (click)="hasLocation.set(!hasLocation())">
            {{ hasLocation() ? 'Remove the studio address' : 'Add the studio address' }}
          </button>
        </div>
        <dl hp-description-list>
          <dt>Previous appointment</dt>
          <dd>Sat 3 Oct · HP-0992</dd>
          @if (hasLocation()) {
            <dt>Studio address</dt>
            <dd>1246 Bloor Street West, Toronto</dd>
          }
          <dt>Braider</dt>
          <dd>Nia Okafor</dd>
        </dl>
      </div>
    </hp-example>

    <hp-example heading="Long content" description="Long values wrap in the value column.">
      <dl hp-description-list class="full">
        <dt>Braider</dt>
        <dd>Amara Nkiruka Adeyemi-Williams</dd>
        <dt>Notes for your braider</dt>
        <dd>
          Medium knotless braids to mid-back, with a few face-framing pieces left loose. I’d like
          the same parting Nia used on Sat 3 Oct (HP-0992), and I’ll bring two packs of
          pre-stretched extensions in colour 1B.
        </dd>
      </dl>
    </hp-example>
  `,
  styles: `
    .full {
      flex: 1 1 100%;
    }

    .aside {
      max-width: var(--layout-sidebar-width);
    }
  `,
})
export class DescriptionListExamples {
  protected readonly hasLocation = signal(true);
}

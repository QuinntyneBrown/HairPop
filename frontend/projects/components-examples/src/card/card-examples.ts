import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Avatar, Badge, Button, Card, Skeleton } from '@hairpop/components';

import { Example } from '../shared';

/** One braider option in the selectable set. */
interface BraiderOption {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
}

/** Stories for the card (card.md): every layout, the interactive, selected and flush variants. */
@Component({
  selector: 'hp-card-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Badge, Button, Card, Example, Skeleton],
  template: `
    <hp-example heading="Default" description="A named section of a detail page.">
      <section hp-card class="stack" aria-labelledby="card-example-expect">
        <h2 id="card-example-expect">What to expect</h2>
        <p>
          Medium knotless braids take about five hours. Nia starts at the root with your own hair,
          so there is less tension than a box braid.
        </p>
      </section>
    </hp-example>

    <hp-example heading="Header and footer" description="A record summary with status and actions.">
      <section hp-card aria-labelledby="card-example-request">
        <div class="card__header">
          <h2 id="card-example-request">Request HP-1048</h2>
          <span hp-badge tone="warning">Awaiting reply</span>
        </div>
        <p><strong>Sat 24 Oct · 10:00 am</strong> with Nia Okafor</p>
        <p class="text-muted">Estimated price: $180–$240 · about 5 hours.</p>
        <div class="card__footer">
          <button hp-button>Request a change</button>
          <a hp-button variant="primary" href="#hp-1048">View request</a>
        </div>
      </section>
    </hp-example>

    <hp-example heading="Aside" description="A complementary landmark beside the main card.">
      <aside hp-card aria-labelledby="card-example-prepare">
        <h2 id="card-example-prepare">Prepare for your visit</h2>
        <ol>
          <li>Wash and detangle your hair.</li>
          <li>Bring the extensions discussed with Nia.</li>
          <li>Send any inspiration photos in advance.</li>
        </ol>
      </aside>
    </hp-example>

    <hp-example
      heading="Story"
      description="Media first, in a grid; the art panel stands in for a photo."
    >
      <div class="feature-grid">
        <article hp-card layout="story">
          <div class="story-card__art" aria-hidden="true">✦</div>
          <div class="stack">
            <p class="eyebrow">Most explored</p>
            <h2 class="card__title">Knotless braids</h2>
            <p class="text-muted">Gentle at the root · 4–7 hours · typically $160–$300</p>
            <a href="#knotless-braids">Explore Knotless braids <span aria-hidden="true">→</span></a>
          </div>
        </article>
        <article hp-card layout="story">
          <div class="story-card__art" aria-hidden="true">✦</div>
          <div class="stack">
            <p class="eyebrow">Next week</p>
            <h2 class="card__title">Aisha Mensah</h2>
            <p class="text-muted">4.8 ★ · 64 reviews · North York · knotless braids from $195</p>
            <a href="#aisha-mensah">View Aisha’s profile <span aria-hidden="true">→</span></a>
          </div>
        </article>
      </div>
    </hp-example>

    <hp-example
      heading="Interactive"
      description="The one card link is stretched over the card; hover lifts it."
    >
      <div class="feature-grid">
        <article hp-card layout="story" interactive>
          <div class="story-card__art" aria-hidden="true">✦</div>
          <div class="stack">
            <p class="eyebrow">Most explored</p>
            <h2 class="card__title">
              <a class="card__link" href="#knotless-braids">Knotless braids</a>
            </h2>
            <p class="text-muted">Gentle at the root · 4–7 hours · typically $160–$300</p>
          </div>
        </article>
        <article hp-card interactive>
          <h2 class="card__title">
            <a class="card__link" href="#jules-baptiste">Jules Baptiste</a>
          </h2>
          <p class="text-muted">4.7 ★ · 41 reviews · Scarborough · knotless braids from $170</p>
        </article>
      </div>
    </hp-example>

    <hp-example
      heading="Selected"
      description="The chosen option in a set; selection is said in text and aria-current."
    >
      <div hp-card selected>
        <h3 class="card__title">Sat 24 Oct · 10:00 am</h3>
        <p class="text-muted">Selected · Nia’s first offered time · about 5 hours</p>
      </div>
    </hp-example>

    <hp-example heading="Interactive and selected" description="Choose a braider.">
      <div class="feature-grid">
        @for (braider of braiders; track braider.id) {
          <article hp-card layout="story" interactive [selected]="chosen() === braider.id">
            <div class="story-card__art" aria-hidden="true">✦</div>
            <h2 class="card__title">
              <a
                class="card__link"
                href="#{{ braider.id }}"
                [attr.aria-current]="chosen() === braider.id ? 'true' : null"
                (click)="choose($event, braider.id)"
                >{{ braider.name }}</a
              >
            </h2>
            <p class="text-muted">
              {{ chosen() === braider.id ? 'Selected · ' : '' }}{{ braider.summary }}
            </p>
          </article>
        }
      </div>
    </hp-example>

    <hp-example heading="Row" description="A record and its one next step on a line.">
      <div hp-card layout="row">
        <div>
          <span hp-badge tone="warning">Awaiting reply</span>
          <h2 class="card__title">Nia Okafor · knotless braids</h2>
          <p class="text-muted">Sat 24 Oct · 10:00 am · estimate $180–$240</p>
        </div>
        <a hp-button variant="primary" href="#hp-1048">View request</a>
      </div>
      <div hp-card layout="row">
        <div>
          <span hp-badge>Completed</span>
          <h2 class="card__title">Nia Okafor · knotless braids</h2>
          <p class="text-muted">Sat 3 Oct · HP-0992</p>
        </div>
        <a hp-button href="#hp-0992">Leave a review</a>
      </div>
    </hp-example>

    <hp-example
      heading="Profile head"
      description="An extra-large avatar beside the braider’s name."
    >
      <div hp-card>
        <div class="profile-head">
          <span hp-avatar name="Nia Okafor" size="xl"></span>
          <div>
            <h2>Nia Okafor</h2>
            <p>Toronto West · 4.9 ★ from 86 reviews</p>
          </div>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Flush" description="Content meets the rounded edge.">
      <div hp-card flush>
        <div class="story-card__art" aria-hidden="true">✦</div>
      </div>
    </hp-example>

    <hp-example heading="Well" description="The one smaller box inside a card.">
      <div hp-card>
        <p>Your reference</p>
        <div class="well">HP-1048</div>
      </div>
    </hp-example>

    <hp-example
      heading="Loading"
      description="Skeletons keep the loaded card’s padding and media ratio."
    >
      <div class="feature-grid" aria-busy="true">
        <article hp-card layout="story">
          <span hp-skeleton shape="hero"></span>
          <span hp-skeleton shape="title" width="60%"></span>
          <span hp-skeleton></span>
          <span hp-skeleton width="80%"></span>
        </article>
      </div>
    </hp-example>

    <hp-example
      heading="Long content"
      description="Titles wrap; the card grows in height, never wider."
    >
      <div class="feature-grid">
        <article hp-card layout="story">
          <div class="story-card__art" aria-hidden="true">✦</div>
          <div class="stack">
            <h2 class="card__title">Amara Nkiruka Adeyemi-Williams</h2>
            <p class="text-muted">
              4.9 ★ · 112 reviews · Toronto West · knotless braids, passion twists, cornrows and
              goddess locs from $180
            </p>
          </div>
        </article>
      </div>
    </hp-example>
  `,
  styles: `
    [hp-card],
    .feature-grid {
      flex: 1 1 100%;
    }
  `,
})
export class CardExamples {
  protected readonly braiders: readonly BraiderOption[] = [
    { id: 'nia-okafor', name: 'Nia Okafor', summary: '4.9 ★ · 86 reviews · Toronto West' },
    { id: 'aisha-mensah', name: 'Aisha Mensah', summary: '4.8 ★ · 64 reviews · North York' },
    { id: 'jules-baptiste', name: 'Jules Baptiste', summary: '4.7 ★ · 41 reviews · Scarborough' },
  ];

  protected readonly chosen = signal('nia-okafor');

  protected choose(event: Event, id: string): void {
    event.preventDefault();
    this.chosen.set(id);
  }
}

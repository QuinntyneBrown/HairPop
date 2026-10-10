import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Avatar, Badge, Card, Divider, Icon, List, ListItem, Skeleton } from '@hairpop/components';

import { Example } from '../shared';

interface Topic {
  readonly slug: string;
  readonly title: string;
}

/** Stories for the list (list.md) and its list item: every variant and state. */
@Component({
  selector: 'hp-list-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Avatar, Badge, Card, Divider, Example, Icon, List, ListItem, Skeleton],
  template: `
    <hp-example heading="Simple" description="One line per row: a braider’s services.">
      <div hp-card flush class="demo">
        <ul hp-list aria-label="Nia’s services">
          <li hp-list-item>Medium knotless braids · from $180</li>
          <li hp-list-item>Passion twists · from $160</li>
          <li hp-list-item>Cornrows · from $90</li>
        </ul>
      </div>
    </hp-example>

    <hp-example
      heading="Two-line with avatar"
      description="A leading avatar, title and one line of detail."
    >
      <div hp-card flush class="demo">
        <ul hp-list aria-label="Braiders">
          <li hp-list-item>
            <span hp-avatar name="Nia Okafor"></span>
            <div class="list__body">
              <span class="list__title">Nia Okafor</span>
              <span class="list__meta">Toronto West · 4.9 ★ from 86 reviews</span>
            </div>
          </li>
          <li hp-list-item>
            <span hp-avatar name="Aisha Mensah"></span>
            <div class="list__body">
              <span class="list__title">Aisha Mensah</span>
              <span class="list__meta">North York · 4.8 ★ from 64 reviews</span>
            </div>
          </li>
          <li hp-list-item>
            <span hp-avatar name="Jules Baptiste"></span>
            <div class="list__body">
              <span class="list__title">Jules Baptiste</span>
              <span class="list__meta">Scarborough · 4.7 ★ from 41 reviews</span>
            </div>
          </li>
        </ul>
      </div>
    </hp-example>

    <hp-example
      heading="With icon and badge"
      description="A leading icon for the kind of item and a trailing badge."
    >
      <div hp-card flush class="demo">
        <ul hp-list aria-label="Appointments">
          <li hp-list-item>
            <svg hp-icon name="calendar"></svg>
            <div class="list__body">
              <span class="list__title">Knotless braids with Nia Okafor</span>
              <span class="list__meta">Sat 24 Oct, 10:00 am · HP-1048</span>
            </div>
            <span hp-badge tone="warning">Requested</span>
          </li>
          <li hp-list-item>
            <svg hp-icon name="calendar"></svg>
            <div class="list__body">
              <span class="list__title">Knotless braids with Nia Okafor</span>
              <span class="list__meta">Sat 3 Oct · HP-0992</span>
            </div>
            <span hp-badge tone="success">Completed</span>
          </li>
        </ul>
      </div>
    </hp-example>

    <hp-example
      heading="Unread and read (link rows)"
      description="Unread rows show the accent dot and say “Unread” in text; read rows end with a chevron."
    >
      <div hp-card flush class="demo">
        <ul hp-list aria-label="Notifications">
          <li>
            <a hp-list-item href="#" unread>
              <div class="list__body">
                <span class="list__title"
                  ><span class="visually-hidden">Unread: </span>Nia received your request</span
                >
                <span class="list__meta"
                  >Today at 9:42 am · She will confirm the time and final price.</span
                >
              </div>
            </a>
          </li>
          <li>
            <a hp-list-item href="#">
              <div class="list__body">
                <span class="list__title">How to prepare for knotless braids</span>
                <span class="list__meta">Yesterday · Read Nia’s preparation checklist.</span>
              </div>
              <svg hp-icon name="chevron-right" size="sm"></svg>
            </a>
          </li>
        </ul>
      </div>
    </hp-example>

    <hp-example
      heading="Interactive with current (interactive)"
      description="Each row is one tab stop; selecting a topic marks it current."
    >
      <div hp-card flush class="demo">
        <ul hp-list aria-label="Help topics">
          @for (topic of topics; track topic.slug) {
            <li>
              <a
                hp-list-item
                href="#"
                [current]="topic.slug === currentTopic()"
                (click)="select($event, topic.slug)"
              >
                <div class="list__body">
                  <span class="list__title">{{ topic.title }}</span>
                </div>
                <svg hp-icon name="chevron-right" size="sm"></svg>
              </a>
            </li>
          }
        </ul>
      </div>
    </hp-example>

    <hp-example
      heading="Long title"
      description="The title wraps; the body keeps half the row and the badge moves to its own line."
    >
      <div hp-card flush class="demo narrow">
        <ul hp-list aria-label="Updates">
          <li hp-list-item>
            <div class="list__body">
              <span class="list__title"
                >Nia suggested a new time for your knotless braids request HP-1048 on Sat 24
                Oct</span
              >
              <span class="list__meta">Today at 9:42 am</span>
            </div>
            <span hp-badge tone="info">New time</span>
          </li>
          <li hp-list-item>
            <div class="list__body">
              <span class="list__title truncate"
                >Estimate $180–$240 · about five hours · Nia confirms the final price and time</span
              >
            </div>
          </li>
        </ul>
      </div>
    </hp-example>

    <hp-example heading="Loading" description="Rows hold skeletons and keep their two-line height.">
      <div hp-card flush class="demo" aria-busy="true">
        <ul hp-list aria-label="Notifications">
          @for (row of [1, 2, 3]; track row) {
            <li hp-list-item>
              <div class="list__body" aria-hidden="true">
                <span hp-skeleton shape="title" width="60%"></span>
                <span hp-skeleton width="85%"></span>
              </div>
            </li>
          }
        </ul>
      </div>
    </hp-example>

    <hp-example heading="Ordered" description="An ol host keeps the order meaningful.">
      <div hp-card flush class="demo">
        <ol hp-list aria-label="How requests work">
          <li hp-list-item>Choose a style and a braider</li>
          <li hp-list-item>Send a request with your preferred time</li>
          <li hp-list-item>Nia confirms the final time and price</li>
        </ol>
      </div>
    </hp-example>

    <hp-example heading="Groups" description="Two lists separated by a labelled divider.">
      <div hp-card flush class="demo">
        <ul hp-list aria-label="Today’s notifications">
          <li>
            <a hp-list-item href="#">
              <div class="list__body">
                <span class="list__title">Nia received your request</span>
                <span class="list__meta">Today at 9:42 am</span>
              </div>
            </a>
          </li>
        </ul>
        <div hp-divider>Earlier</div>
        <ul hp-list aria-label="Earlier notifications">
          <li>
            <a hp-list-item href="#">
              <div class="list__body">
                <span class="list__title">How was your visit with Nia?</span>
                <span class="list__meta">Sat 3 Oct · HP-0992</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </hp-example>
  `,
  styles: `
    .demo {
      flex: 1 1 100%;
      max-width: var(--layout-form-max);
    }

    .narrow {
      max-width: var(--layout-card-min);
    }
  `,
})
export class ListExamples {
  protected readonly topics: readonly Topic[] = [
    { slug: 'requests', title: 'How requests work' },
    { slug: 'prices', title: 'Prices and estimates' },
    { slug: 'hand', title: 'Need a hand?' },
  ];

  protected readonly currentTopic = signal('requests');

  protected select(event: Event, slug: string): void {
    event.preventDefault();
    this.currentTopic.set(slug);
  }
}

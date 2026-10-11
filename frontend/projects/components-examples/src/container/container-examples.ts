import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AppShell, Button, Card } from '@hairpop/components';

import { Example } from '../shared';

/**
 * Stories for the container, grid and stack (container.md): the application shell and the
 * global layout classes from layout.css. Grids follow the viewport, so resize the window.
 */
@Component({
  selector: 'hp-container-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppShell, Button, Card, Example],
  template: `
    <hp-example
      heading="App shell"
      description="Top bar, the one main#main landmark and the footer; narrow caps main at the form width. The storybook already has a main, so this frame nests one."
    >
      <div class="stack full">
        <div>
          <button hp-button size="sm" [pressed]="narrow()" (click)="narrow.set(!narrow())">
            Narrow
          </button>
        </div>
        <div class="frame">
          <hp-app-shell [narrow]="narrow()">
            <header slot="topbar" class="placeholder">Top bar · HairPop</header>
            <section hp-card class="stack" aria-labelledby="container-example-request">
              <h2 id="container-example-request">Request HP-1048</h2>
              <p class="text-muted">
                Medium knotless braids with Nia Okafor on Sat 24 Oct at 10:00 am.
              </p>
            </section>
            <footer slot="footer" class="placeholder">Footer · © 2026 HairPop, Toronto</footer>
          </hp-app-shell>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Stacks" description="Small, default and large vertical rhythm.">
      <div class="columns">
        <div class="stack stack--sm">
          <span class="box">Label</span><span class="box">Hint</span><span class="box">Error</span>
        </div>
        <div class="stack">
          <span class="box">Field</span><span class="box">Field</span><span class="box">Field</span>
        </div>
        <div class="stack stack--lg">
          <span class="box">Section</span><span class="box">Section</span>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Clusters" description="Start, between and end alignment.">
      <div class="stack full">
        <div class="cluster">
          <button hp-button>Request a change</button>
          <button hp-button variant="link">Cancel request</button>
        </div>
        <div class="cluster cluster--between">
          <span class="text-muted">Showing 1–3 of 126</span>
          <a hp-button size="sm" href="#page-2">Next</a>
        </div>
        <div class="cluster cluster--end">
          <button hp-button>Keep request</button>
          <button hp-button variant="danger">Cancel request</button>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Grid" description="4, 8 then 12 columns, with a full-width item.">
      <div class="grid full">
        @for (column of columns; track column) {
          <span class="box">{{ column }}</span>
        }
        <span class="box span-full">Full-width notice</span>
      </div>
    </hp-example>

    <hp-example heading="Auto grid" description="As many card-width tracks as fit.">
      <div class="grid grid--auto full">
        <div hp-card>Nia Okafor</div>
        <div hp-card>Aisha Mensah</div>
        <div hp-card>Jules Baptiste</div>
      </div>
    </hp-example>

    <hp-example heading="Feature grid" description="1, 2 then 3 columns: the style gallery.">
      <div class="feature-grid full">
        <article hp-card layout="story">
          <h3 class="card__title">Knotless braids</h3>
          <p class="text-muted">4–7 hours · typically $160–$300</p>
        </article>
        <article hp-card layout="story">
          <h3 class="card__title">Passion twists</h3>
          <p class="text-muted">3–5 hours · typically $140–$220</p>
        </article>
        <article hp-card layout="story">
          <h3 class="card__title">Cornrows</h3>
          <p class="text-muted">1–3 hours · typically $60–$120</p>
        </article>
      </div>
    </hp-example>

    <hp-example
      heading="Detail grid"
      description="Main and aside from 768 px; stacked, main first, below."
    >
      <div class="detail-grid full">
        <section hp-card class="stack" aria-labelledby="container-example-appointment">
          <h3 id="container-example-appointment">Medium knotless braids</h3>
          <p><strong>Sat 24 Oct · 10:00 am</strong> with Nia Okafor</p>
          <p class="text-muted">Estimated price: $180–$240 · about 5 hours.</p>
        </section>
        <aside hp-card aria-labelledby="container-example-prepare">
          <h3 id="container-example-prepare">Prepare for your visit</h3>
          <p>Wash and detangle your hair.</p>
        </aside>
      </div>
    </hp-example>
  `,
  styles: `
    .frame,
    .full {
      flex: 1 1 100%;
    }

    .frame {
      border: var(--border-width-hairline) dashed var(--color-border-strong);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .placeholder {
      display: block;
      padding: var(--space-3) var(--space-4);
      background: var(--color-bg-subtle);
      font: var(--text-label);
      color: var(--color-fg-muted);
    }

    .columns {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--space-8);
    }

    .box {
      display: block;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-sm);
      background: var(--color-accent-subtle);
      color: var(--color-fg-accent);
      font: var(--text-label);
      text-align: center;
    }
  `,
})
export class ContainerExamples {
  protected readonly narrow = signal(false);
  protected readonly columns = Array.from({ length: 12 }, (_, i) => i + 1);
}

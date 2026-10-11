import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  signal,
  viewChild,
} from '@angular/core';
import { Button, Chip, ChipRow } from '@hairpop/components';

import { Example } from '../shared';

/** One applied filter shown as an input chip. */
interface AppliedFilter {
  readonly id: string;
  readonly label: string;
}

const APPLIED_FILTERS: readonly AppliedFilter[] = [
  { id: 'price', label: 'Under $250' },
  { id: 'style', label: 'Knotless braids' },
  { id: 'area', label: 'Toronto West' },
];

/** Stories for the chip (chip.md): filter, input and static chips, sizes, and the chip row. */
@Component({
  selector: 'hp-chip-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Chip, ChipRow, Example],
  template: `
    <hp-example heading="Filter" description="Reversible toggles with aria-pressed.">
      <hp-chip-row aria-label="Quick filters">
        <button hp-chip [(pressed)]="braids">Braids</button>
        <button hp-chip [(pressed)]="weekend">This weekend</button>
        <button hp-chip>Under $250</button>
      </hp-chip-row>
    </hp-example>

    <hp-example heading="Sizes" description="sm 32 px is the default; md is 40 px.">
      <hp-chip-row aria-label="Small chips">
        <button hp-chip>Braids</button>
        <button hp-chip [pressed]="true">This weekend</button>
      </hp-chip-row>
      <hp-chip-row aria-label="Medium chips">
        <button hp-chip size="md">Braids</button>
        <button hp-chip size="md" [pressed]="true">This weekend</button>
      </hp-chip-row>
    </hp-example>

    <hp-example
      heading="Single choice"
      description="Exactly one chip in the row is pressed; the row reports its value."
    >
      <hp-chip-row aria-label="Style" single [(value)]="style">
        <button hp-chip value="all">All styles</button>
        <button hp-chip value="knotless">Knotless braids</button>
        <button hp-chip value="passion-twists">Passion twists</button>
        <button hp-chip value="cornrows">Cornrows</button>
      </hp-chip-row>
      <p class="note">Value: {{ style() }}</p>
    </hp-example>

    <hp-example heading="Disabled" description="Native disabled at 50% opacity.">
      <hp-chip-row aria-label="Unavailable filters">
        <button hp-chip disabled>Sunday</button>
        <button hp-chip disabled [pressed]="true">Saturday</button>
      </hp-chip-row>
    </hp-example>

    <hp-example
      heading="Input"
      description="Applied filters Maya can remove; focus moves to what took the chip’s place."
    >
      <div class="stack stack--sm">
        <hp-chip-row aria-label="Applied filters" [focusFallback]="resetButton()">
          @for (filter of applied(); track filter.id) {
            <span
              hp-chip
              [removeLabel]="'Remove filter: ' + filter.label"
              (removed)="remove(filter.id)"
              >{{ filter.label }}</span
            >
          }
        </hp-chip-row>
        <div>
          <button #reset hp-button size="sm" (click)="applied.set(appliedFilters)">
            Reset filters
          </button>
        </div>
      </div>
    </hp-example>

    <hp-example heading="Input, disabled" description="The remove button is disabled.">
      <hp-chip-row aria-label="Applied filters while searching">
        <span hp-chip disabled removeLabel="Remove filter: Under $250">Under $250</span>
      </hp-chip-row>
    </hp-example>

    <hp-example heading="Static" description="A tag on content; not focusable.">
      <hp-chip-row aria-label="Nia Okafor’s tags">
        <span hp-chip>Toronto West</span>
        <span hp-chip>Knotless braids</span>
        <span hp-chip size="md">Natural hair</span>
      </hp-chip-row>
    </hp-example>

    <hp-example heading="In a well" description="A sunken well re-skins the chip surface.">
      <div class="well">
        <hp-chip-row aria-label="Suggested styles">
          <button hp-chip>Knotless braids</button>
          <button hp-chip [pressed]="true">Passion twists</button>
          <span hp-chip>Cornrows</span>
        </hp-chip-row>
      </div>
    </hp-example>

    <hp-example heading="Long label" description="The label wraps inside the pill.">
      <div class="narrow">
        <hp-chip-row aria-label="Braider">
          <button hp-chip [pressed]="true">Amara Nkiruka Adeyemi-Williams · Toronto West</button>
        </hp-chip-row>
      </div>
    </hp-example>
  `,
  styles: `
    .note {
      margin: 0;
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }

    .well {
      padding: var(--space-4);
      border-radius: var(--radius-md);
      background: var(--color-bg-surface-sunken);
    }

    .narrow {
      max-width: var(--space-24);
    }
  `,
})
export class ChipExamples {
  protected readonly appliedFilters = APPLIED_FILTERS;

  protected readonly braids = signal(true);
  protected readonly weekend = signal(false);
  protected readonly style = signal<string | null>('all');
  protected readonly applied = signal<readonly AppliedFilter[]>(APPLIED_FILTERS);

  /** Focus lands on the reset button once the last input chip is removed. */
  private readonly reset = viewChild<string, ElementRef<HTMLElement>>('reset', {
    read: ElementRef,
  });
  protected readonly resetButton = computed(() => this.reset()?.nativeElement);

  protected remove(id: string): void {
    this.applied.update((filters) => filters.filter((filter) => filter.id !== id));
  }
}

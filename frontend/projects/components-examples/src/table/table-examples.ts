import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  Badge,
  BadgeTone,
  Button,
  Checkbox,
  EmptyState,
  Icon,
  Skeleton,
  Table,
  TableSortHeader,
  TableSortState,
} from '@hairpop/components';

import { Example } from '../shared';

interface Appointment {
  readonly id: string;
  readonly style: string;
  readonly braider: string;
  /** ISO date, used to sort. */
  readonly date: string;
  readonly dateLabel: string;
  readonly time: string;
  readonly status: string;
  readonly tone: BadgeTone;
  readonly estimate: string;
  /** Numeric estimate, used to sort. */
  readonly amount: number;
  readonly action: string;
}

const APPOINTMENTS: readonly Appointment[] = [
  {
    id: 'HP-1048',
    style: 'Medium knotless braids',
    braider: 'Nia Okafor',
    date: '2026-10-24',
    dateLabel: 'Sat 24 Oct',
    time: '10:00 am',
    status: 'Awaiting reply',
    tone: 'info',
    estimate: '$180–$240',
    amount: 180,
    action: 'View',
  },
  {
    id: 'HP-0992',
    style: 'Medium knotless braids',
    braider: 'Nia Okafor',
    date: '2026-10-03',
    dateLabel: 'Sat 3 Oct',
    time: '9:30 am',
    status: 'Completed',
    tone: 'success',
    estimate: '$210',
    amount: 210,
    action: 'Review',
  },
  {
    id: 'HP-0911',
    style: 'Passion twists',
    braider: 'Aisha Mensah',
    date: '2026-08-15',
    dateLabel: 'Sat 15 Aug',
    time: '11:00 am',
    status: 'Completed',
    tone: 'success',
    estimate: '$195',
    amount: 195,
    action: 'Review',
  },
  {
    id: 'HP-0874',
    style: 'Cornrows',
    braider: 'Jules Baptiste',
    date: '2026-07-11',
    dateLabel: 'Sat 11 Jul',
    time: '1:00 pm',
    status: 'Completed',
    tone: 'success',
    estimate: '$170',
    amount: 170,
    action: 'Review',
  },
];

/** Stories for the table (table.md): sizes, sorting, selection, row actions and every state. */
@Component({
  selector: 'hp-table-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Badge, Button, Checkbox, EmptyState, Example, Icon, Skeleton, Table, TableSortHeader],
  template: `
    <hp-example heading="Default" description="Row header, status badge, numeric column.">
      <hp-table class="story-block">
        <caption>
          Past appointments
        </caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Braider</th>
            <th scope="col">Style</th>
            <th scope="col" class="num">Paid</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Sat 3 Oct</th>
            <td>Nia Okafor</td>
            <td>Medium knotless braids</td>
            <td class="num">$210</td>
          </tr>
          <tr>
            <th scope="row">Sat 15 Aug</th>
            <td>Nia Okafor</td>
            <td>Passion twists</td>
            <td class="num">$185</td>
          </tr>
        </tbody>
      </hp-table>
    </hp-example>

    <hp-example
      heading="Sortable with row actions"
      description="Date starts descending; activate a header to sort. The page sorts the rows."
    >
      <div class="story-block">
        <hp-table [(sort)]="sort">
          <caption>
            Your appointments
          </caption>
          <thead>
            <tr>
              <th scope="col">Request</th>
              <th scope="col" hp-table-sort="date" firstDirection="descending">Date</th>
              <th scope="col">Braider</th>
              <th scope="col">Status</th>
              <th scope="col" class="num" hp-table-sort="amount">Estimate</th>
              <th scope="col"><span class="visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            @for (row of sortedRows(); track row.id) {
              <tr>
                <th scope="row">{{ row.id }}</th>
                <td>{{ row.dateLabel }} · {{ row.time }}</td>
                <td>{{ row.braider }}</td>
                <td>
                  <span hp-badge [tone]="row.tone">{{ row.status }}</span>
                </td>
                <td class="num">{{ row.estimate }}</td>
                <td>
                  <div class="row-actions">
                    <button hp-button variant="link" size="sm">
                      {{ row.action }} {{ row.id }}
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </hp-table>
        <p class="story-note">
          Sorted by {{ sort()?.column ?? 'nothing' }}, {{ sort()?.direction ?? 'unsorted' }}
        </p>
      </div>
    </hp-example>

    <hp-example
      heading="Dense and selectable"
      description="Visually hidden caption; selected rows carry aria-selected."
    >
      <hp-table dense class="story-block">
        <caption class="visually-hidden">
          Past appointments
        </caption>
        <thead>
          <tr>
            <th scope="col">
              <label
                hp-checkbox
                hideLabel
                [checked]="allSelected()"
                [indeterminate]="someSelected()"
                (checkedChange)="selectAll($event)"
                >Select all appointments</label
              >
            </th>
            <th scope="col">Request</th>
            <th scope="col">Braider</th>
            <th scope="col" class="num">Paid</th>
          </tr>
        </thead>
        <tbody>
          @for (row of pastRows; track row.id) {
            <tr [attr.aria-selected]="selected().has(row.id)">
              <td>
                <label
                  hp-checkbox
                  hideLabel
                  [checked]="selected().has(row.id)"
                  (checkedChange)="toggle(row.id, $event)"
                  >Select {{ row.id }}</label
                >
              </td>
              <th scope="row">{{ row.id }}</th>
              <td>{{ row.braider }}</td>
              <td class="num">{{ row.estimate }}</td>
            </tr>
          }
        </tbody>
      </hp-table>
    </hp-example>

    <hp-example heading="Sizes" description="Default and dense side by side.">
      <hp-table class="story-half">
        <caption>
          Medium
        </caption>
        <thead>
          <tr>
            <th scope="col">Style</th>
            <th scope="col" class="num">Estimate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Medium knotless braids</th>
            <td class="num">$180–$240</td>
          </tr>
        </tbody>
      </hp-table>
      <hp-table dense class="story-half">
        <caption>
          Small
        </caption>
        <thead>
          <tr>
            <th scope="col">Style</th>
            <th scope="col" class="num">Estimate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Medium knotless braids</th>
            <td class="num">$180–$240</td>
          </tr>
        </tbody>
      </hp-table>
    </hp-example>

    <hp-example heading="Loading" description="Header kept; skeleton rows; the wrapper is busy.">
      <hp-table loading class="story-block">
        <caption>
          Loading appointments
        </caption>
        <thead>
          <tr>
            <th scope="col">Request</th>
            <th scope="col">Date</th>
            <th scope="col">Braider</th>
            <th scope="col" class="num">Estimate</th>
          </tr>
        </thead>
        <tbody>
          @for (row of skeletonRows; track row) {
            <tr>
              <td><span hp-skeleton width="60%"></span></td>
              <td><span hp-skeleton width="80%"></span></td>
              <td><span hp-skeleton width="70%"></span></td>
              <td class="num"><span hp-skeleton width="50%"></span></td>
            </tr>
          }
        </tbody>
      </hp-table>
    </hp-example>

    <hp-example heading="Empty" description="One row spanning every column holds an empty state.">
      <hp-table class="story-block">
        <caption>
          Your appointments
        </caption>
        <thead>
          <tr>
            <th scope="col">Request</th>
            <th scope="col">Date</th>
            <th scope="col">Braider</th>
            <th scope="col" class="num">Estimate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="4">
              <hp-empty-state
                size="compact"
                [headingLevel]="3"
                heading="No appointments yet"
                text="When you request a visit, you’ll find its status and details here."
              >
                <svg slot="icon" hp-icon name="calendar"></svg>
                <a slot="actions" hp-button variant="primary" href="#">Explore styles</a>
              </hp-empty-state>
            </td>
          </tr>
        </tbody>
      </hp-table>
    </hp-example>

    <hp-example heading="Error" description="As empty, with the error state and Try again.">
      <hp-table class="story-block">
        <caption>
          Your appointments
        </caption>
        <thead>
          <tr>
            <th scope="col">Request</th>
            <th scope="col">Date</th>
            <th scope="col">Braider</th>
            <th scope="col" class="num">Estimate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="4">
              <hp-empty-state
                variant="error"
                size="compact"
                [headingLevel]="3"
                heading="We couldn’t load your appointments"
                text="Check your connection and try again. Your details are safe."
              >
                <svg slot="icon" hp-icon name="alert-circle"></svg>
                <button slot="actions" hp-button>
                  <svg hp-icon name="refresh"></svg>
                  Try again
                </button>
              </hp-empty-state>
            </td>
          </tr>
        </tbody>
      </hp-table>
    </hp-example>

    <hp-example
      heading="Overflowing"
      description="Wider than its container: the wrapper scrolls and becomes a focusable region."
    >
      <hp-table class="story-narrow">
        <caption>
          Your appointments
        </caption>
        <thead>
          <tr>
            <th scope="col">Request</th>
            <th scope="col">Style</th>
            <th scope="col">Braider</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col" class="num">Estimate</th>
          </tr>
        </thead>
        <tbody>
          @for (row of pastRows; track row.id) {
            <tr>
              <th scope="row">{{ row.id }}</th>
              <td>{{ row.style }}</td>
              <td>{{ row.braider }}</td>
              <td>{{ row.dateLabel }} · {{ row.time }}</td>
              <td>
                <span hp-badge [tone]="row.tone">{{ row.status }}</span>
              </td>
              <td class="num">{{ row.estimate }}</td>
            </tr>
          }
        </tbody>
      </hp-table>
    </hp-example>
  `,
  styles: `
    .story-block {
      flex: 1 1 100%;
      min-width: 0;
    }

    .story-half {
      flex: 1 1 var(--layout-card-min);
    }

    .story-narrow {
      flex: 1 1 100%;
      max-width: var(--layout-card-min);
    }

    .story-note {
      margin: var(--space-2) 0 0;
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }
  `,
})
export class TableExamples {
  protected readonly sort = signal<TableSortState | null>({
    column: 'date',
    direction: 'descending',
  });

  protected readonly sortedRows = computed(() => {
    const sort = this.sort();
    if (!sort) {
      return APPOINTMENTS;
    }
    const factor = sort.direction === 'ascending' ? 1 : -1;
    return [...APPOINTMENTS].sort((a, b) => {
      const order = sort.column === 'amount' ? a.amount - b.amount : a.date.localeCompare(b.date);
      return order * factor;
    });
  });

  /** Past appointments only: HP-1048 is still awaiting Nia's reply. */
  protected readonly pastRows = APPOINTMENTS.slice(1);
  protected readonly skeletonRows = [1, 2];

  protected readonly selected = signal<ReadonlySet<string>>(new Set(['HP-0992']));
  protected readonly allSelected = computed(() => this.selected().size === this.pastRows.length);
  protected readonly someSelected = computed(() => this.selected().size > 0 && !this.allSelected());

  protected toggle(id: string, checked: boolean): void {
    const next = new Set(this.selected());
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    this.selected.set(next);
  }

  protected selectAll(checked: boolean): void {
    this.selected.set(new Set(checked ? this.pastRows.map((row) => row.id) : []));
  }
}

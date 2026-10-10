import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  InjectionToken,
  Signal,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { TabContent } from './tab-content';

/** What a panel needs from its `hp-tabs` parent. Provided by `Tabs`. */
export interface TabGroup {
  readonly baseId: string;
  readonly selectedValue: Signal<string | undefined>;
}

/** Injection token through which `hp-tab` reads its `hp-tabs` parent. */
export const TAB_GROUP = new InjectionToken<TabGroup>('TAB_GROUP');

/**
 * One tab of an `hp-tabs` set. The host element is the tab's panel
 * (`role="tabpanel"`); the parent renders the tab button from its inputs (D-1).
 */
@Component({
  selector: 'hp-tab',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'tabpanel',
    tabindex: '0',
    '[attr.id]': 'panelId()',
    '[attr.aria-labelledby]': 'tabId()',
    '[attr.hidden]': 'isSelected() ? null : ""',
  },
  template: `<ng-content />
    @if (rendered()) {
      <ng-container [ngTemplateOutlet]="lazy()?.template ?? null" />
    }`,
  styles: `
    :host {
      display: block;
    }
    :host([hidden]) {
      display: none;
    }
  `,
})
export class Tab {
  private readonly group = inject(TAB_GROUP);

  /** Unique within the set; used for `selected` and the generated ids. */
  readonly value = input.required<string>();
  /** The tab's visible text and the start of its accessible name. */
  readonly label = input.required<string>();
  /** Count badge after the label when not null (0 included). */
  readonly count = input<number | null>(null);
  /** `neutral` renders `.badge`; `info` renders `.badge.badge--info`. */
  readonly countTone = input<'neutral' | 'info'>('neutral');
  /** Visually hidden text read after the count: ", 1 awaiting reply". */
  readonly countText = input<string | null>(null);
  /** Native `disabled` on the tab button (D-5). */
  readonly disabled = input(false, { transform: booleanAttribute });

  /** Lazily rendered content (D-7). */
  protected readonly lazy = contentChild(TabContent);

  readonly tabId = computed(() => `${this.group.baseId}-tab-${this.value()}`);
  readonly panelId = computed(() => `${this.group.baseId}-panel-${this.value()}`);
  readonly isSelected = computed(() => this.group.selectedValue() === this.value());

  /** Latches true on first selection so lazy content is created once and kept. */
  protected readonly rendered = linkedSignal<boolean, boolean>({
    source: this.isSelected,
    computation: (selected, previous) => selected || (previous?.value ?? false),
  });
}

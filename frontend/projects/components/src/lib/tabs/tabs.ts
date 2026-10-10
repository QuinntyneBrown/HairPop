import { FocusKeyManager, FocusableOption } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterRenderEffect,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  viewChild,
  viewChildren,
} from '@angular/core';
import { TAB_GROUP, Tab, TabGroup } from './tab';

let nextTabsId = 0;

/** A tab button as the CDK key manager sees it. */
interface TabItem extends FocusableOption {
  readonly tab: Tab;
  readonly disabled: boolean;
}

/**
 * A set of tabs (APG Tabs): renders the `role="tablist"` from its `hp-tab`
 * children and projects those children, each of which is its own panel.
 */
@Component({
  selector: 'hp-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: TAB_GROUP, useExisting: Tabs }],
  host: { '(keydown)': 'onKeydown($event)' },
  template: `<div
      #list
      class="tabs"
      role="tablist"
      [class.tabs--sm]="size() === 'sm'"
      [attr.aria-label]="label()"
    >
      @for (tab of tabs(); track tab; let i = $index) {
        <button
          #tabButton
          class="tab"
          type="button"
          role="tab"
          [id]="tab.tabId()"
          [attr.aria-selected]="tab.isSelected() ? 'true' : 'false'"
          [attr.aria-controls]="tab.panelId()"
          [attr.tabindex]="tab.isSelected() ? 0 : -1"
          [disabled]="tab.disabled()"
          (click)="select(tab)"
          (focus)="onTabFocus(i)"
        >
          {{ tab.label() }}
          @if (tab.count() !== null) {
            <span class="badge" [class.badge--info]="tab.countTone() === 'info'">{{
              tab.count()
            }}</span>
          }
          @if (tab.countText()) {
            <span class="visually-hidden">{{ tab.countText() }}</span>
          }
        </button>
      }
    </div>
    <ng-content />`,
  styles: `
    :host {
      display: block;
    }
    .tabs {
      display: flex;
      gap: var(--space-1);
      border-bottom: var(--border-width-hairline) solid var(--color-border-default);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tabs::-webkit-scrollbar {
      display: none;
    }
    .tab {
      --tab-fg: var(--color-fg-muted);
      --tab-indicator: transparent;
      position: relative;
      display: inline-flex;
      flex: none;
      align-items: center;
      gap: var(--space-2);
      min-height: var(--target-comfortable);
      margin: 0;
      padding: 0 var(--space-3);
      border: 0;
      border-radius: 0;
      background: none;
      color: var(--tab-fg);
      font: var(--text-label);
      cursor: pointer;
      white-space: nowrap;
    }
    .tab::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -1px;
      height: var(--border-width-thick);
      background: var(--tab-indicator);
      border-radius: var(--radius-xs) var(--radius-xs) 0 0;
      transition: background-color var(--duration-fast) var(--ease-standard);
    }
    .tab:hover {
      --tab-fg: var(--color-fg-default);
      --tab-indicator: var(--color-border-strong);
    }
    .tab:focus-visible {
      outline: var(--focus-ring-width) solid var(--color-focus-ring);
      outline-offset: calc(-1 * var(--focus-ring-width));
    }
    .tab:focus:not(:focus-visible) {
      outline: none;
    }
    .tab[aria-selected='true'] {
      --tab-fg: var(--color-fg-accent);
      --tab-indicator: var(--color-accent);
    }
    .tab:disabled {
      --tab-fg: var(--color-fg-disabled);
      cursor: not-allowed;
    }
    .tab:disabled:hover {
      --tab-fg: var(--color-fg-disabled);
      --tab-indicator: transparent;
    }
    .tabs--sm .tab {
      min-height: var(--control-height-sm);
      font-size: var(--font-size-xs);
    }
    .badge {
      --badge-bg: var(--color-bg-subtle);
      --badge-fg: var(--color-fg-muted);
      --badge-height: 1.5rem;
      display: inline-flex;
      align-items: center;
      align-self: center;
      gap: var(--space-1);
      margin-left: var(--space-1);
      padding: 0 var(--space-2);
      min-height: var(--badge-height);
      border-radius: var(--radius-full);
      font: var(--text-overline);
      letter-spacing: var(--letter-spacing-wide);
      text-transform: uppercase;
      background: var(--badge-bg);
      color: var(--badge-fg);
      white-space: nowrap;
      width: fit-content;
    }
    .badge::before {
      content: '';
      width: 0.5rem;
      height: 0.5rem;
      border-radius: var(--radius-full);
      background: currentColor;
      flex: none;
    }
    .badge--info {
      --badge-bg: var(--color-info-bg);
      --badge-fg: var(--color-info-fg);
    }
    .visually-hidden {
      position: absolute !important;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }
    @media (forced-colors: active) {
      .badge {
        border: var(--border-width-hairline) solid CanvasText;
      }
      .tab[aria-selected='true'] {
        outline: var(--border-width-thick) solid Highlight;
      }
    }
  `,
})
export class Tabs implements TabGroup {
  private readonly injector = inject(Injector);
  private readonly dir = inject(Directionality, { optional: true });

  /** `aria-label` of the tab list. */
  readonly label = input.required<string>();
  /** `sm` adds `.tabs--sm`: 32 px tabs, only inside a card or dialog. */
  readonly size = input<'md' | 'sm'>('md');
  /** Automatic: arrows select. Manual: arrows move focus, Enter or Space selects. */
  readonly activation = input<'automatic' | 'manual'>('automatic');
  /** The `value` of the selected tab (two-way). */
  readonly selected = model<string | undefined>(undefined);

  readonly baseId = `hp-tabs-${++nextTabsId}`;

  protected readonly tabs = contentChildren(Tab);
  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  private readonly buttons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  /** The selected tab's value, falling back to the first enabled tab. */
  readonly selectedValue = computed<string | undefined>(() => {
    const tabs = this.tabs();
    const value = this.selected();
    const match = tabs.find((tab) => tab.value() === value);
    if (match && !match.disabled()) {
      return value;
    }
    return tabs.find((tab) => !tab.disabled())?.value();
  });

  private readonly itemCache = new WeakMap<HTMLButtonElement, TabItem>();
  private readonly items = computed<TabItem[]>(() => {
    const tabs = this.tabs();
    return this.buttons()
      .map((ref) => this.itemFor(ref.nativeElement, tabs))
      .filter((item): item is TabItem => item !== null);
  });

  private readonly keyManager = new FocusKeyManager<TabItem>(this.items, this.injector)
    .withHorizontalOrientation(this.dir?.value ?? 'ltr')
    .withWrap()
    .withHomeAndEnd()
    .skipPredicate((item) => item.disabled);

  constructor() {
    // The initial (or replacement) fallback updates the model, which emits selectedChange.
    effect(() => {
      const value = this.selectedValue();
      if (value !== undefined && value !== this.selected()) {
        this.selected.set(value);
      }
    });

    // Automatic activation: focus movement by key selects.
    const changes = this.keyManager.change.subscribe(() => {
      const item = this.keyManager.activeItem;
      if (item && this.activation() === 'automatic') {
        this.select(item.tab);
      }
    });
    const dirChanges = this.dir?.change.subscribe((dir) =>
      this.keyManager.withHorizontalOrientation(dir),
    );
    inject(DestroyRef).onDestroy(() => {
      changes.unsubscribe();
      dirChanges?.unsubscribe();
      this.keyManager.destroy();
    });

    // D-8: keep the selected tab inside the list by scrolling the list only.
    afterRenderEffect(() => {
      this.selectedValue();
      const list = this.list().nativeElement;
      const tab = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      if (!tab) {
        return;
      }
      const listBox = list.getBoundingClientRect();
      const tabBox = tab.getBoundingClientRect();
      if (tabBox.left < listBox.left) {
        list.scrollLeft -= listBox.left - tabBox.left;
      } else if (tabBox.right > listBox.right) {
        list.scrollLeft += tabBox.right - listBox.right;
      }
    });
  }

  /** Selects a tab by click, touch, Enter, Space or (automatic) arrow key. */
  protected select(tab: Tab): void {
    if (tab.disabled()) {
      return;
    }
    const index = this.items().findIndex((item) => item.tab === tab);
    if (index > -1) {
      this.keyManager.updateActiveItem(index);
    }
    if (this.selectedValue() !== tab.value()) {
      this.selected.set(tab.value());
    }
  }

  protected onTabFocus(index: number): void {
    const tab = this.tabs()[index];
    const itemIndex = this.items().findIndex((item) => item.tab === tab);
    if (itemIndex > -1 && this.keyManager.activeItemIndex !== itemIndex) {
      this.keyManager.updateActiveItem(itemIndex);
    }
  }

  /** One listener for the whole set; acts only on keys pressed on a tab of this list. */
  protected onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.parentElement !== this.list().nativeElement) {
      return;
    }
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Home':
      case 'End':
        this.keyManager.onKeydown(event);
        break;
    }
  }

  private itemFor(button: HTMLButtonElement, tabs: readonly Tab[]): TabItem | null {
    const tab = tabs.find((candidate) => candidate.tabId() === button.id);
    if (!tab) {
      return null;
    }
    const cached = this.itemCache.get(button);
    if (cached && cached.tab === tab) {
      return cached;
    }
    const item: TabItem = {
      tab,
      get disabled() {
        return tab.disabled();
      },
      focus: () => button.focus(),
    };
    this.itemCache.set(button, item);
    return item;
  }
}

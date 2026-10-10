import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';

import { Toast } from './toast';
import { ToastEntry, ToastService } from './toast.service';

/**
 * The two toast live regions (toast.md, D-2, D-3), created once by `provideToasts()` inside a
 * CDK overlay: polite at the bottom for info, success and warning; assertive at the top for
 * danger. Toasts never carry a live role of their own.
 */
@Component({
  selector: 'hp-toast-region',
  imports: [Toast, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<div
      #politeRegion
      class="toast-region"
      role="status"
      aria-live="polite"
      (focusin)="onFocusIn($event)"
    >
      @for (entry of toasts.polite(); track entry.id) {
        <ng-container *ngTemplateOutlet="toast; context: { $implicit: entry }" />
      }
    </div>
    <div
      #assertiveRegion
      class="toast-region toast-region--top"
      role="alert"
      aria-live="assertive"
      (focusin)="onFocusIn($event)"
    >
      @for (entry of toasts.assertive(); track entry.id) {
        <ng-container *ngTemplateOutlet="toast; context: { $implicit: entry }" />
      }
    </div>
    <ng-template #toast let-entry>
      <hp-toast
        [id]="'hp-toast-' + entry.id"
        [tone]="entry.content().tone"
        [heading]="entry.content().heading"
        [text]="entry.content().text"
        [actionLabel]="entry.content().actionLabel"
        [dismissLabel]="entry.content().dismissLabel"
        [duration]="entry.content().duration"
        [leaving]="entry.leaving()"
        (actioned)="toasts.actioned(entry)"
        (dismissed)="toasts.closed(entry, $event)"
        (animationend)="onAnimationEnd($event, entry)"
      />
    </ng-template>`,
  styles: `
    hp-toast-region {
      display: contents;
    }

    .toast-region {
      position: fixed;
      z-index: var(--z-toast);
      bottom: calc(var(--space-4) + env(safe-area-inset-bottom));
      left: var(--space-4);
      right: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      max-height: calc(100dvh - 2 * var(--space-4));
      overflow-y: auto;
      pointer-events: none;
    }

    @media (min-width: 40rem) {
      .toast-region {
        left: auto;
        width: 24rem;
        bottom: var(--space-6);
        right: var(--space-6);
      }
    }

    .toast-region--top {
      bottom: auto;
      top: var(--space-4);
    }

    .toast-region--inline {
      position: static;
      z-index: auto;
      width: auto;
      max-width: 24rem;
      max-height: none;
    }

    @media print {
      .toast-region {
        display: none !important;
      }
    }
  `,
})
export class ToastRegion {
  protected readonly toasts = inject(ToastService);
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly politeRegion = viewChild.required<ElementRef<HTMLElement>>('politeRegion');

  /** The element focused before focus entered the regions (D-12). */
  private returnTarget: HTMLElement | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      // D-10: keep a focused element clear of the polite stack.
      if (typeof ResizeObserver === 'undefined') return;
      const region = this.politeRegion().nativeElement;
      const root = this.document.documentElement;
      const observer = new ResizeObserver(() => {
        const height = region.getBoundingClientRect().height;
        if (region.childElementCount > 0 && height > 0) {
          root.style.scrollPaddingBottom = `calc(${height}px + var(--space-4))`;
        } else {
          root.style.removeProperty('scroll-padding-bottom');
        }
      });
      observer.observe(region);
      destroyRef.onDestroy(() => {
        observer.disconnect();
        root.style.removeProperty('scroll-padding-bottom');
      });
    });
  }

  protected onFocusIn(event: FocusEvent): void {
    const from = event.relatedTarget;
    if (from instanceof HTMLElement && !this.host.contains(from)) {
      this.returnTarget = from;
    }
  }

  protected onAnimationEnd(event: AnimationEvent, entry: ToastEntry): void {
    if (event.target === event.currentTarget && event.animationName === 'fade-out') {
      this.toasts.left(entry);
    }
  }

  /**
   * Before a toast that holds focus leaves, moves focus back to where it was before it entered
   * the regions; else to the next toast's dismiss control; else to `main` (D-12).
   */
  releaseFocus(entry: ToastEntry): void {
    const toast = this.document.getElementById(`hp-toast-${entry.id}`);
    const active = this.document.activeElement;
    if (!toast || !active || !toast.contains(active)) return;

    const target = this.returnTarget;
    if (target && target.isConnected && !this.host.contains(target)) {
      target.focus();
      if (this.document.activeElement === target) return;
    }

    const next = Array.from(this.host.querySelectorAll<HTMLElement>('hp-toast')).find(
      (el) => el !== toast && el.getAttribute('data-state') !== 'leaving',
    );
    const close = next?.querySelector<HTMLElement>('.close');
    if (close) {
      close.focus();
      return;
    }

    const main = this.document.querySelector<HTMLElement>('main');
    if (main) {
      if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
      main.focus();
    }
  }
}

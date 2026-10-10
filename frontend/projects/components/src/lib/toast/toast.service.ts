import {
  ComponentRef,
  Injectable,
  Injector,
  PLATFORM_ID,
  Signal,
  WritableSignal,
  inject,
  isDevMode,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Observable, Subject } from 'rxjs';

import { TOAST_CONFIG } from './provide-toasts';
import type { ToastCloseReason, ToastTone } from './toast';
import { ToastRegion } from './toast-region';

/** What `ToastService.show()` takes. */
export interface ToastOptions {
  /** Sets `.toast--{tone}`, the icon, the region (danger → assertive) and the default lifetime. */
  readonly tone?: ToastTone;
  /** What happened, two to four words. Also feeds the dismiss label. */
  readonly heading: string;
  /** The detail in one sentence. */
  readonly text: string;
  /** Renders the one action button; names its result. */
  readonly actionLabel?: string;
  /** Keeps an info or success toast until dismissed or acted on. */
  readonly persistent?: boolean;
  /** A toast shown with the key of a visible toast replaces it in place. */
  readonly key?: string;
}

/** Why a toast left. */
export type ToastDismissReason = 'timeout' | 'dismiss' | 'action' | 'replaced' | 'evicted';

/** Lifetimes (D-4). */
const TIMED_MS = 8000;
const TIMED_WITH_ACTION_MS = 10000;
/** At most three toasts show per region (D-5). */
const MAX_PER_REGION = 3;
/** Removes a leaving toast if its fade never reports its end (for example, a hidden page). */
const LEAVE_FALLBACK_MS = 1000;

/** A handle on one shown toast. */
export class ToastRef {
  private readonly actionedSubject = new Subject<void>();
  private readonly dismissedSubject = new Subject<ToastDismissReason>();
  private finished = false;

  /** Emits once when this toast's action is activated; the toast then leaves. */
  readonly actioned: Observable<void> = this.actionedSubject.asObservable();
  /** Emits once when the toast leaves, with the reason. */
  readonly dismissed: Observable<ToastDismissReason> = this.dismissedSubject.asObservable();

  /** @internal */
  constructor(private readonly close: () => void) {}

  /** Removes the toast (for example when the page resolves the failure). */
  dismiss(): void {
    this.close();
  }

  /** @internal */
  notifyAction(): void {
    if (this.finished) return;
    this.actionedSubject.next();
    this.actionedSubject.complete();
  }

  /** @internal */
  finish(reason: ToastDismissReason): void {
    if (this.finished) return;
    this.finished = true;
    this.dismissedSubject.next(reason);
    this.dismissedSubject.complete();
    this.actionedSubject.complete();
  }
}

/** What a toast shows; replaced as a whole when a toast with the same key arrives. */
export interface ToastContent {
  readonly tone: ToastTone;
  readonly heading: string;
  readonly text: string;
  readonly actionLabel: string;
  readonly dismissLabel: string;
  readonly duration: number | null;
}

/** One toast held by the service. */
export interface ToastEntry {
  readonly id: number;
  readonly region: 'polite' | 'assertive';
  readonly key: string | undefined;
  readonly content: WritableSignal<ToastContent>;
  readonly leaving: WritableSignal<boolean>;
  ref: ToastRef;
  fallback?: ReturnType<typeof setTimeout>;
}

let nextToastId = 0;

/** Shows toasts in the two live regions `provideToasts()` creates (toast.md). */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly injector = inject(Injector);
  private readonly config = inject(TOAST_CONFIG, { optional: true });
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly politeToasts = signal<ToastEntry[]>([]);
  private readonly assertiveToasts = signal<ToastEntry[]>([]);
  private readonly queues: Record<ToastEntry['region'], ToastEntry[]> = {
    polite: [],
    assertive: [],
  };

  /** Toasts in the polite region (info, success, warning), oldest first. */
  readonly polite: Signal<ToastEntry[]> = this.politeToasts.asReadonly();
  /** Toasts in the assertive region (danger), oldest first. */
  readonly assertive: Signal<ToastEntry[]> = this.assertiveToasts.asReadonly();

  private overlayRef: OverlayRef | null = null;
  private regionRef: ComponentRef<ToastRegion> | null = null;

  /** Creates the overlay and its regions once, in the browser. Called by `provideToasts()`. */
  attach(): void {
    if (!this.browser || this.overlayRef) return;
    const overlay = this.injector.get(Overlay);
    this.overlayRef = overlay.create({
      positionStrategy: overlay.position().global(),
      hasBackdrop: false,
      panelClass: 'toast-layer',
      // In the overlay container, not the top layer, so `--z-toast` orders it (D-3).
      usePopover: false,
    });
    this.overlayRef.hostElement.style.zIndex = 'var(--z-toast)';
    this.regionRef = this.overlayRef.attach(new ComponentPortal(ToastRegion, null, this.injector));
  }

  /** Shows a toast and returns its handle. */
  show(options: ToastOptions): ToastRef {
    const tone: ToastTone = options.tone ?? 'info';
    const actionLabel = options.actionLabel ?? '';
    const timed = (tone === 'info' || tone === 'success') && !options.persistent;
    const content: ToastContent = {
      tone,
      heading: options.heading,
      text: options.text,
      actionLabel,
      dismissLabel: this.dismissLabelFor(options.heading),
      duration: timed ? (actionLabel ? TIMED_WITH_ACTION_MS : TIMED_MS) : null,
    };
    const region: ToastEntry['region'] = tone === 'danger' ? 'assertive' : 'polite';

    if (!this.browser) return new ToastRef(() => undefined);
    this.attach();

    if (options.key !== undefined) {
      const replaced = this.replace(options.key, region, content);
      if (replaced) return replaced;
    }

    const entry: ToastEntry = {
      id: ++nextToastId,
      region,
      key: options.key,
      content: signal(content),
      leaving: signal(false),
      ref: new ToastRef(() => this.leave(entry, 'dismiss')),
    };
    this.enter(entry);
    return entry.ref;
  }

  /** @internal The toast's action was activated. */
  actioned(entry: ToastEntry): void {
    if (entry.leaving()) return;
    entry.ref.notifyAction();
    this.leave(entry, 'action');
  }

  /** @internal The toast timed out or was dismissed. */
  closed(entry: ToastEntry, reason: ToastCloseReason): void {
    this.leave(entry, reason);
  }

  /** @internal The leaving animation ended. */
  left(entry: ToastEntry): void {
    clearTimeout(entry.fallback);
    this.listFor(entry.region).update((list) => list.filter((e) => e !== entry));
  }

  private enter(entry: ToastEntry): void {
    const list = this.listFor(entry.region);
    const visible = list().filter((e) => !e.leaving());
    if (visible.length >= MAX_PER_REGION) {
      const oldestTimed = visible.find((e) => e.content().duration !== null);
      if (!oldestTimed) {
        this.queues[entry.region].push(entry);
        return;
      }
      this.leave(oldestTimed, 'evicted', false);
    }
    list.update((l) => [...l, entry]);
  }

  /** Replaces a visible (or queued) toast with the same key in place; null when there is none. */
  private replace(
    key: string,
    region: ToastEntry['region'],
    content: ToastContent,
  ): ToastRef | null {
    const queue = this.queues[region];
    const current =
      this.listFor(region)()
        .filter((e) => !e.leaving())
        .find((e) => e.key === key) ?? queue.find((e) => e.key === key);
    if (!current) {
      // A visible toast with this key in the other region (tone changed) leaves for the new one.
      const other = region === 'polite' ? 'assertive' : 'polite';
      const elsewhere = this.listFor(other)()
        .filter((e) => !e.leaving())
        .find((e) => e.key === key);
      if (elsewhere) this.leave(elsewhere, 'replaced');
      const queued = this.queues[other].find((e) => e.key === key);
      if (queued) {
        this.queues[other] = this.queues[other].filter((e) => e !== queued);
        queued.ref.finish('replaced');
      }
      return null;
    }
    current.ref.finish('replaced');
    const ref = new ToastRef(() => this.leave(current, 'dismiss'));
    current.ref = ref;
    current.content.set(content);
    return ref;
  }

  private leave(entry: ToastEntry, reason: ToastDismissReason, promote = true): void {
    const queue = this.queues[entry.region];
    if (queue.includes(entry)) {
      this.queues[entry.region] = queue.filter((e) => e !== entry);
      entry.ref.finish(reason);
      return;
    }
    if (entry.leaving() || !this.listFor(entry.region)().includes(entry)) return;
    this.regionRef?.instance.releaseFocus(entry);
    entry.leaving.set(true);
    entry.ref.finish(reason);
    entry.fallback = setTimeout(() => this.left(entry), LEAVE_FALLBACK_MS);
    if (promote) this.promote(entry.region);
  }

  /** A queued toast enters when a place frees up (D-5). */
  private promote(region: ToastEntry['region']): void {
    const queue = this.queues[region];
    const list = this.listFor(region);
    while (queue.length && list().filter((e) => !e.leaving()).length < MAX_PER_REGION) {
      const next = queue.shift()!;
      list.update((l) => [...l, next]);
    }
  }

  private listFor(region: ToastEntry['region']): WritableSignal<ToastEntry[]> {
    return region === 'polite' ? this.politeToasts : this.assertiveToasts;
  }

  private dismissLabelFor(heading: string): string {
    if (this.config) return this.config.dismissLabel(heading);
    if (isDevMode()) {
      console.error(
        'hp-toast: no dismiss label configured. Add provideToasts({ dismissLabel }) to app.config.ts.',
      );
    }
    return heading;
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Button, Toast, ToastOptions, ToastService, ToastTone } from '@hairpop/components';

import { Example } from '../shared';

interface StaticToast {
  readonly tone: ToastTone;
  readonly heading: string;
  readonly text: string;
  readonly actionLabel: string;
}

const BOOKING_UPDATES: Readonly<Record<ToastTone, ToastOptions>> = {
  info: {
    tone: 'info',
    heading: 'Request received',
    text: 'Nia has your request and will reply soon.',
  },
  success: {
    tone: 'success',
    heading: 'Time confirmed',
    text: 'Nia confirmed Sat 24 Oct at 10:00 am.',
    actionLabel: 'View appointment',
  },
  warning: {
    tone: 'warning',
    heading: 'Time needs a change',
    text: 'Nia suggested Sun 25 Oct at 11:00 am.',
    actionLabel: 'View suggestion',
  },
  danger: {
    tone: 'danger',
    heading: 'Update could not be sent',
    text: 'Your request is still saved. Retry when connected.',
    actionLabel: 'Retry',
  },
};

/** Stories for the toast (toast.md): every tone through the ToastService, and the toast itself. */
@Component({
  selector: 'hp-toast-examples',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Example, Toast],
  template: `
    <hp-example
      heading="Tones"
      description="Info and success time out; warning and danger stay. Danger goes to the assertive region at the top."
    >
      <button hp-button (click)="show('info')">Show info</button>
      <button hp-button (click)="show('success')">Show success</button>
      <button hp-button (click)="show('warning')">Show warning</button>
      <button hp-button variant="danger" (click)="show('danger')">Show danger</button>
    </hp-example>

    <hp-example heading="With action" description="The action names its result; the page hears it.">
      <button hp-button (click)="showWithAction()">Clear filters</button>
      <span class="story-note" role="status">{{ lastEvent() }}</span>
    </hp-example>

    <hp-example heading="Persistent" description="An info toast kept until dismissed or acted on.">
      <button hp-button (click)="showPersistent()">Show privacy choices</button>
    </hp-example>

    <hp-example
      heading="Stacked and queued"
      description="Up to three per region; a fourth waits while all three are persistent."
    >
      <button hp-button (click)="showStack()">Show three tones at once</button>
      <button hp-button (click)="showQueue()">Show four warnings</button>
    </hp-example>

    <hp-example
      heading="Replaced"
      description="A toast shown with the key of a visible toast swaps its content in place."
    >
      <button hp-button (click)="showKeyed()">Send review update</button>
    </hp-example>

    <hp-example
      heading="Dismiss from the page"
      description="The page removes the toast when it resolves the failure."
    >
      <button hp-button (click)="showOffline()">Go offline</button>
      <button hp-button (click)="resolveOffline()">Reconnect</button>
    </hp-example>

    <hp-example
      heading="Toast component"
      description="Each tone rendered in place, persistent. Applications use the ToastService instead."
    >
      <div class="story-stack">
        @for (toast of staticToasts(); track toast.tone) {
          <hp-toast
            [tone]="toast.tone"
            [heading]="toast.heading"
            [text]="toast.text"
            [actionLabel]="toast.actionLabel"
            [dismissLabel]="'Dismiss: ' + toast.heading"
            (dismissed)="removeStatic(toast.tone)"
            (actioned)="removeStatic(toast.tone)"
          />
        } @empty {
          <button hp-button size="sm" (click)="resetStatic()">Show the toasts again</button>
        }
      </div>
    </hp-example>
  `,
  styles: `
    .story-stack {
      flex: 1 1 100%;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      max-width: var(--layout-form-max);
    }

    .story-note {
      font: var(--text-body-sm);
      color: var(--color-fg-muted);
    }
  `,
})
export class ToastExamples {
  private readonly toasts = inject(ToastService);
  private reviewUpdates = 0;
  private offline: { dismiss(): void } | null = null;

  protected readonly lastEvent = signal('');
  protected readonly staticToasts = signal<readonly StaticToast[]>(this.allStatic());

  protected show(tone: ToastTone): void {
    this.toasts.show(BOOKING_UPDATES[tone]);
  }

  protected showWithAction(): void {
    this.lastEvent.set('Filters cleared.');
    const ref = this.toasts.show({
      tone: 'info',
      heading: 'Filters cleared',
      text: 'Showing all 12 braiders near Toronto.',
      actionLabel: 'Undo',
    });
    ref.actioned.subscribe(() => this.lastEvent.set('Filters restored.'));
    ref.dismissed.subscribe((reason) => this.lastEvent.set(`Toast left: ${reason}.`));
  }

  protected showPersistent(): void {
    this.toasts.show({
      tone: 'info',
      heading: 'Your privacy choices',
      text: 'Choose whether optional usage data may be stored.',
      actionLabel: 'Choose',
      persistent: true,
    });
  }

  protected showStack(): void {
    this.show('info');
    this.show('success');
    this.show('danger');
  }

  protected showQueue(): void {
    for (const heading of [
      'Time needs a change',
      'Review needs attention',
      'Verify your email',
      'Choice needed',
    ]) {
      this.toasts.show({
        tone: 'warning',
        heading,
        text: 'Nia suggested Sun 25 Oct at 11:00 am.',
        actionLabel: 'View suggestion',
      });
    }
  }

  protected showKeyed(): void {
    this.reviewUpdates++;
    this.toasts.show(
      this.reviewUpdates % 2
        ? {
            key: 'review',
            tone: 'info',
            heading: 'Review ready',
            text: 'Share how your visit with Nia went.',
            actionLabel: 'Write review',
            persistent: true,
          }
        : {
            key: 'review',
            tone: 'success',
            heading: 'Review posted',
            text: 'Thank you for helping others choose.',
            persistent: true,
          },
    );
  }

  protected showOffline(): void {
    this.offline?.dismiss();
    this.offline = this.toasts.show({
      tone: 'danger',
      heading: 'Changes not saved',
      text: 'Your edits are still here. Please try again.',
      actionLabel: 'Retry',
    });
  }

  protected resolveOffline(): void {
    this.offline?.dismiss();
    this.offline = null;
  }

  protected removeStatic(tone: ToastTone): void {
    this.staticToasts.update((list) => list.filter((toast) => toast.tone !== tone));
  }

  protected resetStatic(): void {
    this.staticToasts.set(this.allStatic());
  }

  private allStatic(): readonly StaticToast[] {
    return (Object.keys(BOOKING_UPDATES) as ToastTone[]).map((tone) => ({
      tone,
      heading: BOOKING_UPDATES[tone].heading,
      text: BOOKING_UPDATES[tone].text,
      actionLabel: BOOKING_UPDATES[tone].actionLabel ?? '',
    }));
  }
}

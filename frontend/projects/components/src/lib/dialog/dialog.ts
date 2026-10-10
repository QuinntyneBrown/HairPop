import { DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  effect,
  inject,
  input,
  isDevMode,
} from '@angular/core';

import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { Tooltip } from '../tooltip/tooltip';
import { DIALOG_CONTEXT } from './dialog-context';
import { DIALOG_STYLES } from './dialog-panel';
import { DialogState } from './dialog-state';

let nextInlineDialogId = 0;

/**
 * The content layout of a HairPop dialog: header (icon chip, title, description, close
 * control), body, footer and the busy status region (dialog.md). Rendered by the
 * consumer's dialog component inside the `hp-dialog-panel` container that
 * `DialogService` opens. The variant and the ids come from the dialog configuration,
 * never from inputs.
 */
@Component({
  selector: 'hp-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Button, Icon, Tooltip],
  providers: [DialogState],
  host: { style: 'display: contents' },
  template: `
    <div class="dialog__header">
      @if (variant !== 'form') {
        <span
          class="dialog__icon"
          [class.dialog__icon--info]="variant === 'confirmation'"
          [class.dialog__icon--danger]="variant === 'destructive'"
          ><ng-content select="[slot=icon]"
            ><svg hp-icon [name]="variant === 'destructive' ? 'alert-circle' : 'info'"></svg
          ></ng-content>
        </span>
      }
      <div>
        <h2 class="dialog__title" [id]="titleId">{{ heading() }}</h2>
        <p class="text-muted" [id]="descriptionId">{{ description() }}</p>
      </div>
      @if (variant !== 'destructive' && closeLabel()) {
        <hp-tooltip [text]="closeLabel()">
          <button
            hp-button
            variant="ghost"
            iconOnly
            type="button"
            [attr.aria-label]="closeLabel()"
            (click)="dismiss('mouse')"
          >
            <svg hp-icon name="close"></svg>
          </button>
        </hp-tooltip>
      }
    </div>
    <div class="dialog__body stack"><ng-content /></div>
    <div class="dialog__footer"><ng-content select="[slot=footer]" /></div>
    <p class="sr-only" role="status">{{ busy() ? busyLabel() : '' }}</p>
  `,
  styles: DIALOG_STYLES,
})
export class Dialog implements OnInit {
  private readonly dialogRef = inject(DialogRef, { optional: true });
  private readonly context = inject(DIALOG_CONTEXT, { optional: true });
  private readonly state = inject(DialogState);

  /** The title; the dialog's accessible name. */
  readonly heading = input.required<string>();
  /** One sentence on the consequence; the dialog's accessible description. */
  readonly description = input.required<string>();
  /** The close control's name and tooltip ("Close dialog"). Required for form and confirmation dialogs. */
  readonly closeLabel = input('');
  /** While true, Esc, the close control, a backdrop click and `hpDialogClose` are ignored. */
  readonly busy = input(false, { transform: booleanAttribute });
  /** Announced through the status region while busy ("Cancelling your request…"). */
  readonly busyLabel = input('');

  protected readonly variant = this.context?.variant ?? 'form';
  protected readonly titleId: string;
  protected readonly descriptionId: string;

  constructor() {
    const fallbackId = this.context ? '' : `hp-dialog-inline-${++nextInlineDialogId}`;
    this.titleId = this.context?.titleId ?? `${fallbackId}-title`;
    this.descriptionId = this.context?.descriptionId ?? `${fallbackId}-desc`;
    this.state.connect(this.busy);

    effect(() => {
      if (isDevMode() && this.busy() && !this.busyLabel().trim()) {
        console.error(
          'hp-dialog: the dialog is busy but busyLabel is empty. Set busyLabel (for example busyLabel="Cancelling your request…") so the busy state is announced.',
        );
      }
    });

    this.listenForDismissal();
  }

  ngOnInit(): void {
    if (isDevMode() && this.variant !== 'destructive' && !this.closeLabel().trim()) {
      console.error(
        `hp-dialog: a ${this.variant} dialog needs closeLabel for its close control (for example closeLabel="Close dialog"). The dialog "${this.heading()}" renders without it.`,
      );
    }
  }

  /** Closes the dialog without a result unless it is busy. */
  protected dismiss(origin: 'keyboard' | 'mouse'): void {
    if (this.state.busy() || !this.dialogRef) {
      return;
    }
    this.dialogRef.close(undefined, { focusOrigin: origin });
  }

  /** D-4: Esc for every variant, a backdrop click for form and confirmation; never while busy. */
  private listenForDismissal(): void {
    const ref = this.dialogRef;
    if (!ref) {
      return;
    }
    const keydown = ref.keydownEvents.subscribe((event) => {
      // An open menu or tooltip in the dialog handles the first Esc (it prevents default).
      if (
        event.key !== 'Escape' ||
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }
      event.preventDefault();
      this.dismiss('keyboard');
    });

    const pane = ref.overlayRef.overlayElement;
    let pressedOnPane = false;
    const onMouseDown = (event: MouseEvent): void => {
      pressedOnPane = event.target === pane;
      if (pressedOnPane) {
        // The pane is not focusable: keep focus inside the panel.
        event.preventDefault();
      }
    };
    const onClick = (event: MouseEvent): void => {
      const outside = pressedOnPane && event.target === pane;
      pressedOnPane = false;
      if (outside && this.variant !== 'destructive') {
        this.dismiss('mouse');
      }
    };
    pane.addEventListener('mousedown', onMouseDown);
    pane.addEventListener('click', onClick);

    inject(DestroyRef).onDestroy(() => {
      keydown.unsubscribe();
      pane.removeEventListener('mousedown', onMouseDown);
      pane.removeEventListener('click', onClick);
    });
  }
}

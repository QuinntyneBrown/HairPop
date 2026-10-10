import { Injectable, Signal, computed, signal } from '@angular/core';

/**
 * The busy guard shared by `hp-dialog`, its close control and every `hpDialogClose`
 * inside it. `hp-dialog` provides it and connects its `busy` input.
 */
@Injectable()
export class DialogState {
  private readonly source = signal<Signal<boolean>>(signal(false));

  /** Whether the dialog is busy; while true nothing closes it. */
  readonly busy = computed(() => this.source()());

  /** Connects the dialog's `busy` input. */
  connect(busy: Signal<boolean>): void {
    this.source.set(busy);
  }
}

import { ErrorHandler, Injectable } from '@angular/core';

/** Keeps every error Angular reports so a render that throws is reported as a failure. */
@Injectable({ providedIn: 'root' })
export class PerfErrorHandler implements ErrorHandler {
  readonly errors: unknown[] = [];

  handleError(error: unknown): void {
    this.errors.push(error);
    console.error(error);
  }
}

import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  Injector,
  Type,
  ViewContainerRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';

import { scenarios } from '../scenarios';
import { PerfErrorHandler } from './perf-error-handler';
import { reportFailure, reportResult, reportScenarios } from './perf-result';

const DEFAULT_ITERATIONS = 50;

/**
 * Renders one scenario `iterations` times and measures it.
 *
 * `?list=1` publishes the scenario names on `window.__perfScenarios`.
 * `?scenario=<Name>&iterations=<n>` creates every instance, runs change detection once and
 * stops the clock when Angular's next render completes, then publishes `window.__perf`.
 */
@Component({
  selector: 'hp-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="perf-host"><ng-container #outlet /></div>`,
  styles: `
    .perf-host {
      display: block;
      padding: var(--space-4);
    }
  `,
})
export class App {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(Injector);
  private readonly errors = inject(PerfErrorHandler).errors;
  private readonly outlet = viewChild.required('outlet', { read: ViewContainerRef });

  run(): void {
    const params = new URLSearchParams(window.location.search);
    if (params.has('list')) {
      reportScenarios(Object.keys(scenarios));
      return;
    }

    const name = params.get('scenario') ?? '';
    const scenario: Type<unknown> | undefined = Object.hasOwn(scenarios, name)
      ? scenarios[name]
      : undefined;
    if (!scenario) {
      reportFailure(new Error(`Unknown scenario "${name}"`), name);
      return;
    }
    const requested = Number(params.get('iterations'));
    const iterations =
      Number.isInteger(requested) && requested > 0 ? requested : DEFAULT_ITERATIONS;

    try {
      this.measure(name, scenario, iterations);
    } catch (error) {
      reportFailure(error, name);
      return;
    }
    if (this.errors.length > 0) {
      reportFailure(this.errors[0], name);
    } else if (!window.__perf?.done) {
      reportFailure(new Error('The scenario did not finish rendering'), name);
    }
  }

  private measure(name: string, scenario: Type<unknown>, iterations: number): void {
    const outlet = this.outlet();
    performance.mark('perf-render-start');
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      outlet.createComponent(scenario);
    }
    afterNextRender(
      {
        read: () => {
          const renderMs = performance.now() - start;
          performance.mark('perf-render-end');
          performance.measure('perf-render', 'perf-render-start', 'perf-render-end');
          if (this.errors.length === 0) {
            reportResult(name, iterations, renderMs);
          }
        },
      },
      { injector: this.injector },
    );
    this.appRef.tick();
  }
}

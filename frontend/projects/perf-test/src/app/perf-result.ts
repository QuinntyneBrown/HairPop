/** What the runner in `e2e/perf-test/run.mjs` reads from `window.__perf`. */
export interface PerfResult {
  readonly scenario: string | null;
  readonly iterations?: number;
  readonly renderMs?: number;
  readonly error?: string;
  readonly done: true;
}

declare global {
  interface Window {
    __perf?: PerfResult;
    __perfScenarios?: readonly string[];
  }
}

function finish(result: PerfResult): void {
  window.__perf = result;
  document.body.dataset['perfDone'] = 'true';
}

/** Publishes a measured render. */
export function reportResult(scenario: string, iterations: number, renderMs: number): void {
  finish({ scenario, iterations, renderMs, done: true });
}

/** Publishes a failed render; the runner counts it as a failure. */
export function reportFailure(error: unknown, scenario = currentScenario()): void {
  if (window.__perf?.done) {
    return;
  }
  const message = error instanceof Error ? error.message : String(error);
  finish({ scenario, error: message, done: true });
}

/** Publishes the names of every registered scenario. */
export function reportScenarios(names: readonly string[]): void {
  window.__perfScenarios = names;
  finish({ scenario: null, done: true });
}

export function currentScenario(): string | null {
  return new URLSearchParams(window.location.search).get('scenario');
}

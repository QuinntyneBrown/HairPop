import { Type } from '@angular/core';

import Button from './Button';
import ThemeToggle from './ThemeToggle';
import TopBar from './TopBar';

/**
 * Every scenario the perf test renders, by name. Each default export is a standalone component
 * rendering one realistic instance; `e2e/perf-test/config/scenario-iterations.mjs` sets how many
 * times the runner renders it.
 */
export const scenarios: Record<string, Type<unknown>> = {
  Button,
  ThemeToggle,
  TopBar,
};

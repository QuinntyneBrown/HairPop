import { defineConfig, devices } from '@playwright/test';

import { CUSTOMER_PORT, CUSTOMER_URL, STUB_API_PORT } from './fixtures/urls';

const frontendDist = '../frontend/dist';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : [['list']],
  expect: { timeout: 7_000, toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  use: {
    baseURL: CUSTOMER_URL,
    locale: 'en-CA',
    timezoneId: 'America/Toronto',
    trace: 'retain-on-failure',
  },
  // Frontend tests run in Chromium only (AGENTS.md).
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node stub-api/server.mjs',
      url: `http://localhost:${STUB_API_PORT}/__e2e/health`,
      env: { STUB_API_PORT: String(STUB_API_PORT) },
      reuseExistingServer: !process.env['CI'],
    },
    {
      command: `node ${frontendDist}/customer/server/server.mjs`,
      port: CUSTOMER_PORT,
      env: { PORT: String(CUSTOMER_PORT), API_ORIGIN: `http://localhost:${STUB_API_PORT}` },
      reuseExistingServer: !process.env['CI'],
    },
  ],
});

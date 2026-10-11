import { defineConfig, devices } from '@playwright/test';

import { CUSTOMER_PORT, CUSTOMER_URL, STUB_API_PORT } from '../fixtures/urls';

/**
 * Records the demo-video screen captures (docs/videos/README.md). Same servers as the e2e
 * suite: the built SSR app against the stub API, so recordings need no backend.
 * Run through `node tools/video-record/record-clips.mjs docs/videos/<folder>`.
 */
export default defineConfig({
  testDir: '.',
  testMatch: 'record.clips.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 180_000,
  reporter: [['list']],
  outputDir: '../test-results/video-clips',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: CUSTOMER_URL,
    locale: 'en-CA',
    timezoneId: 'America/Toronto',
    viewport: { width: 1408, height: 792 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    // CHROMIUM_PATH points at a pre-installed browser when Playwright's own is missing.
    launchOptions: process.env['CHROMIUM_PATH']
      ? { executablePath: process.env['CHROMIUM_PATH'] }
      : {},
  },
  projects: [{ name: 'chromium' }],
  webServer: [
    {
      command: 'node stub-api/server.mjs',
      cwd: '..',
      url: `http://localhost:${STUB_API_PORT}/__e2e/health`,
      env: { STUB_API_PORT: String(STUB_API_PORT) },
      reuseExistingServer: true,
    },
    {
      command: 'node ../frontend/dist/customer/server/server.mjs',
      cwd: '..',
      port: CUSTOMER_PORT,
      env: { PORT: String(CUSTOMER_PORT), API_ORIGIN: `http://localhost:${STUB_API_PORT}` },
      reuseExistingServer: true,
    },
  ],
});

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'app',
      testDir: './projects/app/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200',
      },
    },
    {
      name: 'app-admin',
      testDir: './projects/app-admin/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4201',
      },
    },
  ],
  webServer: [
    {
      command: 'npm run start -- --port 4200',
      url: 'http://localhost:4200',
      reuseExistingServer: !process.env['CI'],
      timeout: 120000,
    },
    {
      command: 'npm run start:admin -- --port 4201',
      url: 'http://localhost:4201',
      reuseExistingServer: !process.env['CI'],
      timeout: 120000,
    },
  ],
});

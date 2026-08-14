import { defineConfig, devices } from '@playwright/test';

const port = process.env.PORT || '8080';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Each page initializes the full game-data registry. Keep local runs parallel,
  // but cap them so connection tests are not starved by simultaneous bootstraps.
  workers: process.env.CI ? 1 : 4,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        env: { ...process.env, SRSIM_LOCAL_DIR: '.tmp/playwright-local' },
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 15_000,
      },
});

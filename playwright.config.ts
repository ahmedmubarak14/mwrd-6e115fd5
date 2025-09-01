import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Take screenshots on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium-en-ltr',
      use: { 
        ...devices['Desktop Chrome'],
        locale: 'en-US',
        extraHTTPHeaders: {
          'Accept-Language': 'en-US,en;q=0.9'
        }
      },
    },
    {
      name: 'chromium-ar-rtl',
      use: { 
        ...devices['Desktop Chrome'],
        locale: 'ar-SA',
        extraHTTPHeaders: {
          'Accept-Language': 'ar-SA,ar;q=0.9'
        }
      },
    },
    {
      name: 'firefox-en-ltr',
      use: { 
        ...devices['Desktop Firefox'],
        locale: 'en-US'
      },
    },
    {
      name: 'firefox-ar-rtl',
      use: { 
        ...devices['Desktop Firefox'],
        locale: 'ar-SA'
      },
    },
    {
      name: 'webkit-en-ltr',
      use: { 
        ...devices['Desktop Safari'],
        locale: 'en-US'
      },
    },
    {
      name: 'webkit-ar-rtl',
      use: { 
        ...devices['Desktop Safari'],
        locale: 'ar-SA'
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
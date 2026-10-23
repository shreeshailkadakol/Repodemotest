import { defineConfig, devices } from '@playwright/test';
import { envUtils } from './helpers/utils/envUtils';

export default defineConfig({
  timeout: 60 * 1000, // 60 seconds timeout for each test
  testDir: './tests/specs', // Directory where tests are located
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 2, // Limit the number of parallel tests
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    [
      'html',
      {
        open: 'never',
        outputFolder: './reports/html-report/',
      },
    ],
    [
      'allure-playwright',
      {
        resultsDir: './reports/allure/allure-results',
      },
    ],
    [
      './helpers/ai/selectorHealthReporter.ts',
      {
        outputDir: './reports/selector-health',
      },
    ],
  ],

  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: envUtils.getBaseUrl(),

    // Run tests in headless mode by default
    headless: true,

    // Slow down Playwright operations by 1000ms
    launchOptions: {
      slowMo: 1000,
    },

    // Increase timeout for actions
    actionTimeout: 30000,

    // Show test name in the browser window
    contextOptions: {
      colorScheme: 'light',
    },

    // Record video on failure
    video: 'retain-on-failure',

    // Take screenshot on failure
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        // Ignore HTTPS errors for certificate issues
        ignoreHTTPSErrors: true,
        // Enable touch support for accessibility testing
        hasTouch: true,
        isMobile: false,
        launchOptions: {
          args: [
            '--window-size=1280,720',
            '--ignore-certificate-errors',
            '--ignore-ssl-errors',
            '--allow-running-insecure-content',
            '--disable-web-security',
            '--touch-events=enabled', // Enable touch events
          ],
          slowMo: 1000,
        },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
        // Ignore HTTPS errors for certificate issues
        ignoreHTTPSErrors: true,
        launchOptions: {
          args: ['--width=1280', '--height=720'],
          slowMo: 1000,
        },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: ['--window-size=1280,720'],
          slowMo: 1000,
        },
      },
    },
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: ['--window-size=1280,720'],
          slowMo: 1000,
        },
      },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        // Override with custom viewport if needed
        viewport: {
          width: 768,
          height: 1024,
        },
        launchOptions: {
          args: ['--window-size=768,1024'],
          slowMo: 1000,
        },
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        viewport: {
          width: 390,
          height: 844,
        },
        launchOptions: {
          args: ['--window-size=390,844'],
          slowMo: 1000,
        },
      },
    },
    {
      name: 'Tablet',
      use: {
        ...devices['iPad Pro'],
        viewport: {
          width: 1024,
          height: 1366,
        },
        launchOptions: {
          args: ['--window-size=1024,1366'],
          slowMo: 1000,
        },
      },
    },
    {
      name: 'Mobile Device',
      use: {
        ...devices['iPhone 13'],
        hasTouch: true,
        isMobile: true,
        launchOptions: {
          args: ['--touch-events=enabled'],
          slowMo: 1000,
        },
      },
    },
    {
      name: 'Desktop Full HD',
      use: {
        browserName: 'chromium',
        viewport: { width: 1920, height: 1080 },
        hasTouch: true, // Enable touch for accessibility testing
        launchOptions: {
          args: ['--window-size=1920,1080', '--touch-events=enabled'],
          slowMo: 1000,
        },
      },
    },
  ],
});

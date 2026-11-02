/**
 * Component Mapper - Redirect Playwright Config
 * What:
 *   Dedicated Playwright configuration for URL redirect test execution,
 *   including custom setup, teardown, and reporter outputs.
 * Why:
 *   Created to isolate redirect execution behavior from component test config
 *   and prevent cross-suite interference.
 */

import { defineConfig, devices } from '@playwright/test';
import { getRedirectConfig } from './redirectConfig';

const redirectConfig = getRedirectConfig(process.env.NODE_ENV || 'development');

/**
 * Dedicated Playwright configuration for URL redirect testing
 * 
 * This config is separate from the main playwright.config.ts because:
 * - Redirects require sequential execution (no parallel) to avoid rate limiting
 * - Single worker prevents authentication session conflicts  
 * - Specialized timeouts and retry logic for redirect validation
 * - Custom global setup/teardown for Excel file management
 * - Isolated from component tests to prevent interference
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: '../tests/specs',
  testMatch: '**/urlRedirect.spec.ts', // Only run URL redirect tests
  
  /* Run tests in files in parallel */
  fullyParallel: redirectConfig.enableParallelExecution,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : redirectConfig.maxConcurrentWorkers,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: './reports/html-report' }],
    ['json', { outputFile: './reports/test-results.json' }],
    ['junit', { outputFile: './reports/junit-results.xml' }],
    ['list']
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000', // Disabled for redirect testing
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: redirectConfig.screenshotOnFailure ? 'only-on-failure' : 'off',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Navigation timeout */
    navigationTimeout: redirectConfig.navigationTimeout,
    
    /* Action timeout */
    actionTimeout: 10000, // Faster action timeout
    
    /* Preserve browser context across tests for session reuse */
    contextOptions: {
      ignoreHTTPSErrors: true,
      // Optimize for faster loading
      extraHTTPHeaders: {
        'Accept-Language': 'en-GB,en;q=0.9'
      }
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium-redirect-tests',
      use: { 
        ...devices['Desktop Chrome'],
        headless: redirectConfig.headless,
        launchOptions: {
          slowMo: 0, // Remove slowMo for faster execution
          args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
          ]
        }
      },
    },
    // Removed firefox, webkit, mobile and edge projects for faster testing
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

  /* Global setup and teardown for redirect tests */
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  /* Test timeout */
  timeout: 600000, // 10 minutes for redirect tests (100 URLs)
  
  /* Expect timeout */
  expect: {
    timeout: 15000
  },

  /* Output directory for test results */
  outputDir: '../reports/test-results',
});
/**
 * Component Mapper - URL Redirect Component
 * What:
 *   Implements redirect-specific navigation and validation helpers used by
 *   redirect automation specs.
 * Why:
 *   Created to keep redirect verification logic isolated from test cases and
 *   support reusable, data-driven redirect validation.
 */

import { RedirectBasePage } from '../utils/redirectBasePage';
import { Page, Browser, BrowserContext, test, expect } from '@playwright/test';

/**
 * URL Redirect Component Class
 * Handles specific redirect testing functionality
 */
export class URLRedirectComponent extends RedirectBasePage {
  
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Validate a single URL redirect with comprehensive testing
   * @param oldUrl The original URL to test
   * @param expectedUrl The expected redirect destination
   * @param testIndex Index of current test for reporting
   * @param isFirstTest Whether this is the first test (needs authentication)
   * @returns Test result object
   */
  /**
   * Recover page if it's closed by creating a new page in the same context
   */
  private async recoverPageIfClosed(): Promise<boolean> {
    try {
      if (this.page.isClosed()) {
        console.info('Page is closed - attempting recovery');
        
        // Try to create a new page in the existing context
        if (!this.context.browser()) {
          console.error('Browser is closed - cannot recover');
          return false;
        }
        
        // Create new page in the existing context
        const newPage = await this.context.newPage();
        
        // Replace the closed page with the new one
        (this as any).page = newPage;
        
        console.info('Page recovered successfully');
        return true;
      }
      return true; // Page is fine
    } catch (error) {
      console.error(`Page recovery failed: ${error}`);
      return false;
    }
  }

  async validateRedirect(
    oldUrl: string, 
    expectedUrl: string,
    testIndex: number,
    isFirstTest: boolean = false
  ): Promise<{
    success: boolean;
    actualUrl: string;
    status: 'PASS' | 'FAIL';
    errorMessage?: string;
    testDetails: {
      navigationTime: number;
      pageTitle?: string;
      statusCode?: number;
      hasPageErrors: boolean;
      comparisonDetails: string;
    };
  }> {
    const startTime = Date.now();
    
    try {
      // Attempt page recovery if closed
      const pageRecovered = await this.recoverPageIfClosed();
      if (!pageRecovered) {
        throw new Error('Page is closed and recovery failed');
      }

      return await test.step(`Test ${testIndex + 1}: Redirect validation for ${oldUrl}`, async () => {
        
        // Step 1: Navigate with session awareness
        let navigationResult;
        const needsAuthentication = isFirstTest || !(await this.isAuthenticated());
        
        if (needsAuthentication) {
          console.info('AUTHENTICATION: Performing authentication...');
          navigationResult = await this.navigateAndWaitForRedirect(oldUrl);
        } else {
          console.info('SESSION: Reusing authenticated session...');
          
          // Double-check page is still valid before navigation
          const pageOk = await this.recoverPageIfClosed();
          if (!pageOk) {
            throw new Error('Page closed and recovery failed during navigation');
          }
          
          // Use faster navigation to preserve session
          try {
            await this.page.goto(oldUrl, { 
              waitUntil: 'domcontentloaded', // Much faster than networkidle
              timeout: 30000 // Increased timeout for redirect navigation
            });
            navigationResult = { 
              success: true, 
              finalUrl: this.page.url(),
              navigationTime: Date.now() - startTime
            };
          } catch (navError) {
            // Try recovery one more time on navigation error
            console.warn('Navigation failed, attempting recovery...');
            const recovered = await this.recoverPageIfClosed();
            
            if (recovered) {
              // Retry navigation after recovery
              try {
                await this.page.goto(oldUrl, { 
                  waitUntil: 'domcontentloaded',
                  timeout: 30000
                });
                navigationResult = { 
                  success: true, 
                  finalUrl: this.page.url(),
                  navigationTime: Date.now() - startTime
                };
              } catch (retryError) {
                const errorMsg = retryError instanceof Error ? retryError.message : 'Navigation failed after recovery';
                navigationResult = {
                  success: false,
                  finalUrl: oldUrl,
                  error: errorMsg,
                  navigationTime: Date.now() - startTime
                };
              }
            } else {
              const errorMsg = navError instanceof Error ? navError.message : 'Navigation failed';
              navigationResult = {
                success: false,
                finalUrl: oldUrl,
                error: errorMsg,
                navigationTime: Date.now() - startTime
              };
            }
          }
        }
        
        if (!navigationResult.success) {
          throw new Error(navigationResult.error || 'Navigation failed');
        }

        // Step 2: Wait for page to be fully ready
        try {
          await this.waitForPageReady();
        } catch (readyError) {
          console.warn('Page ready check failed, continuing anyway...');
        }

        // Step 3: Get the actual redirected URL (with safety check)
        let actualUrl = navigationResult.finalUrl;
        try {
          if (!this.page.isClosed()) {
            actualUrl = this.page.url();
          }
        } catch (urlError) {
          console.warn('Could not get current URL, using navigation result');
        }

        // Step 4: Compare URLs
        const comparison = this.compareUrls(actualUrl, expectedUrl);

        // Step 5: Check for page errors
        const errorCheck = await this.checkForPageErrors();

        // Step 6: Get page metadata
        const metadata = await this.getPageMetadata();

        // Step 7: Calculate navigation time
        const navigationTime = Date.now() - startTime;

        // Step 8: Determine test status
        // PRIMARY CRITERIA: URLs must match. Page errors are logged but don't fail the test.
        const success = comparison.isMatch;
        const status: 'PASS' | 'FAIL' = success ? 'PASS' : 'FAIL';

        let errorMessage: string | undefined;
        if (!success) {
          // URLs don't match - this is a failure
          errorMessage = comparison.comparisonDetails;
        } else if (errorCheck.hasErrors) {
          // URLs match but page has errors - log as warning but don't fail
          console.warn(`Test PASSED (URLs match) but page has errors: ${errorCheck.errorDetails}`);
        }

        const testResult = {
          success,
          actualUrl,
          status,
          errorMessage,
          testDetails: {
            navigationTime,
            pageTitle: metadata.title,
            statusCode: navigationResult.statusCode,
            hasPageErrors: errorCheck.hasErrors,
            comparisonDetails: comparison.comparisonDetails
          }
        };

        // Step 9: Log test results
        await this.logTestResult(testIndex, oldUrl, expectedUrl, testResult);

        // Step 10: Take screenshot for failed tests
        if (!success) {
          try {
            // Check if page is still valid before taking screenshot
            if (!this.page.isClosed()) {
              await this.takeScreenshot(`redirect-test-${testIndex}`, 'failed-redirect');
            } else {
              console.warn(`Skipping screenshot for test ${testIndex} - page is closed`);
            }
          } catch (screenshotError) {
            console.warn(`Screenshot failed for test ${testIndex}: ${screenshotError}`);
          }
        }

        return testResult;
      });

    } catch (error) {
      const navigationTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Take screenshot for debugging
      try {
        await this.takeScreenshot(`redirect-test-${testIndex}`, 'error');
      } catch (screenshotError) {
        console.warn(`Screenshot failed in catch block for test ${testIndex}: ${screenshotError}`);
      }

      return {
        success: false,
        actualUrl: this.page.url(),
        status: 'FAIL',
        errorMessage,
        testDetails: {
          navigationTime,
          hasPageErrors: true,
          comparisonDetails: `Test execution failed: ${errorMessage}`
        }
      };
    }
  }

  /**
   * Log detailed test results
   * @param testIndex Index of the test
   * @param oldUrl Original URL
   * @param expectedUrl Expected redirect URL
   * @param result Test result object
   */
  private async logTestResult(
    testIndex: number,
    oldUrl: string, 
    expectedUrl: string,
    result: any
  ): Promise<void> {
    await test.step(`Log results for test ${testIndex + 1}`, async () => {
      console.info(`
=== URL Redirect Test ${testIndex + 1} ===
Old URL: ${oldUrl}
Expected URL: ${expectedUrl}
Actual URL: ${result.actualUrl}
Status: ${result.status}
Navigation Time: ${result.testDetails.navigationTime}ms
Page Title: ${result.testDetails.pageTitle || 'N/A'}
Status Code: ${result.testDetails.statusCode || 'N/A'}
Has Page Errors: ${result.testDetails.hasPageErrors}
Comparison: ${result.testDetails.comparisonDetails}
${result.errorMessage ? `Error: ${result.errorMessage}` : ''}
==============================
      `);
    });
  }

  /**
   * Batch validate multiple redirects with session reuse
   * @param redirectData Array of redirect test data
   * @returns Array of test results
   */
  async batchValidateRedirects(redirectData: Array<{
    oldUrl: string;
    expectedUrl: string;
  }>): Promise<Array<{
    index: number;
    oldUrl: string;
    expectedUrl: string;
    result: any;
  }>> {
    const results: Array<any> = [];

    for (let i = 0; i < redirectData.length; i++) {
      const { oldUrl, expectedUrl } = redirectData[i];
      
      try {
        // Mark first test for authentication, rest reuse session
        const isFirstTest = i === 0;
        const result = await this.validateRedirect(oldUrl, expectedUrl, i, isFirstTest);
        results.push({
          index: i,
          oldUrl,
          expectedUrl,
          result
        });
        
        // Small delay between tests to avoid rate limiting
        await this.page.waitForTimeout(1500);
        
      } catch (error) {
        console.error(`Batch validation failed for test ${i}: ${error}`);
        results.push({
          index: i,
          oldUrl,
          expectedUrl,
          result: {
            success: false,
            actualUrl: '',
            status: 'FAIL',
            errorMessage: error instanceof Error ? error.message : 'Batch validation error',
            testDetails: {
              navigationTime: 0,
              hasPageErrors: true,
              comparisonDetails: 'Batch validation failed'
            }
          }
        });
      }
    }

    return results;
  }

  /**
   * Generate summary report of all tests
   * @param results Array of test results
   * @returns Summary object
   */
  generateTestSummary(results: Array<any>): {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    passRate: number;
    averageNavigationTime: number;
    failedUrls: Array<string>;
  } {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.result.status === 'PASS').length;
    const failedTests = totalTests - passedTests;
    const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    
    const navigationTimes = results
      .map(r => r.result.testDetails.navigationTime)
      .filter(time => time > 0);
    
    const averageNavigationTime = navigationTimes.length > 0 
      ? navigationTimes.reduce((sum, time) => sum + time, 0) / navigationTimes.length
      : 0;

    const failedUrls = results
      .filter(r => r.result.status === 'FAIL')
      .map(r => r.testData && r.testData['Old URL'] ? r.testData['Old URL'] : 'Unknown URL');

    return {
      totalTests,
      passedTests,
      failedTests,
      passRate,
      averageNavigationTime,
      failedUrls
    };
  }
}
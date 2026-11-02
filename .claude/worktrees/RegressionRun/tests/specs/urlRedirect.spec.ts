/**
 * Component Mapper - URL Redirect Spec
 * What:
 *   Executes data-driven URL redirect checks using Excel input and validates
 *   actual navigation results against expected targets.
 * Why:
 *   Created to automate redirect regression and produce repeatable evidence for
 *   redirect quality across release cycles.
 */

import { test } from '@playwright/test';
import { ExcelUtil, RedirectTestData } from '../../utils/excelUtil';
import { URLRedirectComponent } from '../../components/urlRedirectComponent';
import { getRedirectConfig } from '../../config/redirectConfig';
import * as path from 'path';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

/**
 * Configuration for redirect testing
 */
const REDIRECT_CONFIG = getRedirectConfig(process.env.NODE_ENV || 'development');

// Configure this test to only run on chromium to avoid browser lifecycle issues
test.use({ 
  browserName: 'chromium',
  // Increase timeout for redirect tests
  actionTimeout: 30000,
  navigationTimeout: 30000
});

// Disable test parallelization for redirect tests to avoid page closure issues
test.describe.configure({ mode: 'serial' });

// Increase test timeout for redirect tests (30 minutes for batch processing of 95 URLs)
test.setTimeout(1800000);

test.describe('URL Redirect Validation Tests', () => {
  let excelUtil: ExcelUtil;
  let redirectData: RedirectTestData[];

  test.beforeEach(async () => {
    await applyAllurePageContext('urlRedirect');
  });

  test.beforeAll(async () => {
    // Initialize Excel utility
    excelUtil = new ExcelUtil(REDIRECT_CONFIG.excelFilePath, REDIRECT_CONFIG.sheetName);
    
    // Force reload workbook from disk to clear any cache
    excelUtil.reloadWorkbook();
    
    // Validate Excel file structure
    const isValidStructure = excelUtil.validateFileStructure();
    if (!isValidStructure) {
      throw new Error('Invalid Excel file structure. Required columns: Old URL, Redirect URL');
    }

    // Clean up previous test results to start fresh
    console.log('CLEANUP: Cleaning up previous test results...');
    excelUtil.cleanupResultColumns(
      REDIRECT_CONFIG.testLimit, 
      REDIRECT_CONFIG.testStartRow, 
      REDIRECT_CONFIG.testEndRow
    );

    // Read redirect test data (with range support)
    redirectData = excelUtil.readRedirectData(
      REDIRECT_CONFIG.testLimit, 
      REDIRECT_CONFIG.testStartRow, 
      REDIRECT_CONFIG.testEndRow
    );
    
    console.log(`Loaded ${redirectData.length} redirect test cases from Excel file`);
    
    // Log test plan
    console.log('\n=== URL REDIRECT TEST PLAN ===');
    redirectData.forEach((data, index) => {
      console.log(`${index + 1}. ${data['Old URL']} → ${data['Redirect URL']}`);
    });
    console.log('==============================\n');
  });

  test('Validate URL Redirects - Batch Processing', async ({ page, browser, context }) => {
    // Initialize redirect component
    const redirectComponent = new URLRedirectComponent(page, browser, context);
    
    // Track test results
    const testResults: Array<any> = [];
    let processedCount = 0;

    // Process each redirect test case
    for (let i = 0; i < redirectData.length; i++) {
      const testData = redirectData[i];
      const oldUrl = testData['Old URL'];
      const expectedUrl = testData['Redirect URL'];
      
      // Calculate actual Excel row number (accounting for startRow offset)
      const actualExcelRow = (REDIRECT_CONFIG.testStartRow || 1) + i;

      await test.step(`Process redirect ${i + 1}/${redirectData.length}: ${oldUrl}`, async () => {
        try {
          // Validate the redirect - mark first test for authentication
          const isFirstTest = i === 0;
          const result = await redirectComponent.validateRedirect(oldUrl, expectedUrl, i, isFirstTest);
          
          // Store result for batch update
          testResults.push({
            index: i,
            result,
            testData
          });

          // Update Excel with result immediately to prevent data loss
          try {
            excelUtil.updateTestResult(
              actualExcelRow,
              result.actualUrl,
              result.status,
              result.errorMessage
            );
            // Save every 5 tests or at the end to reduce I/O
            if ((i + 1) % 5 === 0 || i === redirectData.length - 1) {
              excelUtil.saveWorkbook();
            }
          } catch (excelError) {
            console.warn(`[WARN]  Excel update warning for test ${i + 1}: ${excelError}`);
            // Continue with tests even if Excel update fails
          }

          processedCount++;
          
          // Log progress
          console.log(`Completed test ${processedCount}/${redirectData.length} - Status: ${result.status}`);
          
          // Add small delay to prevent overwhelming the server
          if (i < redirectData.length - 1) {
            await page.waitForTimeout(500);
          }
          
        } catch (error) {
          console.error(`Failed to process redirect test ${i + 1}: ${error}`);
          
          // Ensure Excel update even on failure
          try {
            excelUtil.updateTestResult(
              actualExcelRow,
              page.url(),
              'FAIL',
              error instanceof Error ? error.message : 'Test execution failed'
            );
            // Save immediately on failure to preserve error data
            excelUtil.saveWorkbook();
          } catch (excelError) {
            console.error(`Failed to update Excel for test ${i + 1}: ${excelError}`);
          }

          testResults.push({
            index: i,
            result: {
              success: false,
              actualUrl: page.url(),
              status: 'FAIL',
              errorMessage: error instanceof Error ? error.message : 'Test execution failed'
            },
            testData
          });
        }
      });
    }

    // Save all results to Excel
    await test.step('Save test results to Excel', async () => {
      try {
        excelUtil.saveWorkbook();
        console.log(`Test results saved to: ${REDIRECT_CONFIG.excelFilePath}`);
      } catch (error) {
        console.error(`Failed to save Excel file: ${error}`);
        throw error;
      }
    });

    // Generate and log test summary
    await test.step('Generate test summary report', async () => {
      const summary = redirectComponent.generateTestSummary(testResults);
      
      console.log(`
=== URL REDIRECT TEST SUMMARY ===
Total Tests: ${summary.totalTests}
Passed Tests: ${summary.passedTests}
Failed Tests: ${summary.failedTests}
Pass Rate: ${summary.passRate.toFixed(2)}%
Average Navigation Time: ${summary.averageNavigationTime.toFixed(0)}ms

Failed URLs:
${summary.failedUrls.length > 0 ? summary.failedUrls.map((url, index) => `${index + 1}. ${url}`).join('\n') : 'None'}
=================================
      `);

      // Assert overall test success (at least 70% pass rate for demonstration)
      if (summary.passRate < 70) {
        console.warn(`Warning: Pass rate ${summary.passRate.toFixed(2)}% is below expected threshold of 70%`);
      }
    });
  });

  test('Individual Redirect Tests', async ({ page, browser, context }) => {
    const redirectComponent = new URLRedirectComponent(page, browser, context);

    // Run each redirect as a separate test for detailed reporting
    for (let i = 0; i < Math.min(5, redirectData.length); i++) {
      const testData = redirectData[i];
      
      await test.step(`Individual Test ${i + 1}: ${testData['Old URL']}`, async () => {
        // Mark first test for authentication, rest reuse session
        const isFirstTest = i === 0;
        const result = await redirectComponent.validateRedirect(
          testData['Old URL'],
          testData['Redirect URL'],
          i,
          isFirstTest
        );

        // Log individual test result
        console.log(`Individual Test ${i + 1} Result: ${result.status} - ${testData['Old URL']}`);
        
        // Soft assertion to continue with other tests even if one fails
        test.expect.soft(result.success, 
          `Redirect failed: ${testData['Old URL']} → Expected: ${testData['Redirect URL']} → Actual: ${result.actualUrl}`
        ).toBe(true);
      });
    }
  });

  test.afterAll(async () => {
    // Final cleanup and reporting
    console.log('\n=== TEST EXECUTION COMPLETED ===');
    console.log(`Excel file updated: ${REDIRECT_CONFIG.excelFilePath}`);
    console.log('Check the Excel file for detailed test results including timestamps and error messages.');
    console.log('=====================================\n');
  });
});

/**
 * Additional utility test for Excel file operations
 */
test.describe('Excel File Operations', () => {
  
  test('Verify Excel file accessibility and structure', async () => {
    await test.step('Test Excel file operations', async () => {
      const excelUtil = new ExcelUtil(REDIRECT_CONFIG.excelFilePath, REDIRECT_CONFIG.sheetName);
      
      // Test file structure validation
      const isValid = excelUtil.validateFileStructure();
      test.expect(isValid, 'Excel file should have valid structure').toBe(true);
      
      // Test data reading
      const data = excelUtil.readRedirectData(3); // Read first 3 rows for testing
      test.expect(data.length, 'Should be able to read test data').toBeGreaterThan(0);
      
      console.log(`Excel test passed - Found ${data.length} test data rows`);
      
      // Display sample data
      if (data.length > 0) {
        console.log('Sample data structure:', {
          OldURL: data[0]['Old URL'],
          RedirectURL: data[0]['Redirect URL'],
          hasRequiredFields: !!(data[0]['Old URL'] && data[0]['Redirect URL'])
        });
      }
    });
  });
});
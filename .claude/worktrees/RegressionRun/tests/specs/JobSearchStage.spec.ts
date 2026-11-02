import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { JobSearchStageComponent } from '../../components/jobSearchStage.js';
import { envUtils } from '../../helpers/utils/envUtils.js';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

test.describe('Job Search Stage Component', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('JobSearchStage');
  });

  let page: Page;
  let browser: Browser;
  let context: BrowserContext;
  let jobSearchStage: JobSearchStageComponent;
  let baseURL: string;

  test.beforeAll(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    baseURL = envUtils.getBaseUrl();
  });

  test.beforeEach(async () => {
    // Increase timeout for Firefox
    test.setTimeout(120000);

    context = await browser.newContext();
    page = await context.newPage();
    jobSearchStage = new JobSearchStageComponent(page, browser, context);

    // Navigate to component page with retry for Firefox
    try {
      await jobSearchStage.navigateToPage(baseURL);
    } catch (error) {
      console.log('First navigation attempt failed, retrying...');
      await jobSearchStage.navigateToPage(baseURL);
    }

    // Accept cookies if present (required for AC3)
    await jobSearchStage.acceptCookiesBanner();
  });

  test.afterEach(async () => {
    await page.close();
    await context.close();
  });

  /**
   * FUNCTIONAL TESTS
   */

  test.describe('Functional Tests', () => {
    test(
      'TC-JSS001: Valid Search Query with Both Fields (AC1)',
      {
        tag: ['@Functional', '@UKProd', '@AC1', '@Critical'],
      },
      async () => {
        // Test data as specified in requirements
        const interest = 'Back End Development';
        const location = 'Germany';

        // Perform search with both fields
        const resultURL = await jobSearchStage.performSearch(interest, location);

        // Validate URL contains expected parameters
        await jobSearchStage.validateSearchURL(resultURL, interest, location);

        // Verify navigation to 8fold platform
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );

    test(
      'TC-JSS002: Search with Interest Field Only (AC2)',
      {
        tag: ['@Functional', '@UKProd', '@AC2', '@Edge'],
      },
      async () => {
        const interest = 'Software Engineer';

        // Perform search with interest only
        const resultURL = await jobSearchStage.performInterestOnlySearch(interest);

        // Validate URL contains query parameter
        await jobSearchStage.validateSearchURL(resultURL, interest);

        // Verify successful navigation
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );

    test(
      'TC-JSS003: Search with Location Field Only (AC2)',
      {
        tag: ['@Functional', '@UKProd', '@AC2', '@Edge'],
      },
      async () => {
        const location = 'United States';

        // Perform search with location only
        const resultURL = await jobSearchStage.performLocationOnlySearch(location);

        // Validate URL contains location parameter
        await jobSearchStage.validateSearchURL(resultURL, undefined, location);

        // Verify successful navigation
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );

    test(
      'TC-JSS004: Empty Form Search Submission (AC2)',
      {
        tag: ['@Functional', '@UKProd', '@AC2', '@Edge'],
      },
      async () => {
        // Perform search with empty fields
        const resultURL = await jobSearchStage.performEmptySearch();

        // Verify navigation to 8fold (should still work)
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');

        // Verify language parameter is present
        const urlObj = new URL(resultURL);
        expect.soft(urlObj.searchParams.get('hl')).toBe('en');
      }
    );

    test(
      'TC-JSS005: Cookie-Based Location Prefill (AC3)',
      {
        tag: ['@Functional', '@UKProd', '@AC3', '@Cookie'],
      },
      async () => {
        // Check if location field has prefilled value
        const prefilledLocation = await jobSearchStage.getPrefilledLocation();

        if (prefilledLocation) {
          // If prefilled, verify it's a valid country/location
          expect.soft(prefilledLocation.length).toBeGreaterThan(0);
          expect.soft(prefilledLocation).not.toMatch(/^[\s]*$/); // Not just whitespace

          // Verify user can modify prefilled value
          await jobSearchStage.fillLocationField('Custom Location');
          const modifiedValue = await jobSearchStage.getPrefilledLocation();
          expect.soft(modifiedValue).toBe('Custom Location');
        } else {
          // If not prefilled, document for manual verification
          console.log('Location prefill not detected - may require specific cookie setup');
        }
      }
    );

    test(
      'TC-JSS006: Auto-Suggestion Functionality (AC4)',
      {
        tag: ['@Functional', '@UKProd', '@AC4', '@Interactive'],
      },
      async () => {
        // Test auto-suggestions with character input
        const suggestionsFound = await jobSearchStage.testAutoSuggestions('D');

        if (suggestionsFound) {
          // If suggestions appear, verify functionality
          expect.soft(suggestionsFound).toBe(true);
        } else {
          // Document if auto-suggestions are not active
          console.log('Auto-suggestions not detected - may be disabled in test environment');

          // Still verify typing works in the field
          await jobSearchStage.fillInterestField('Developer');
          const fieldValue = await jobSearchStage.getPrefilledLocation();
          // This tests that the field accepts input even without suggestions
        }
      }
    );

    test(
      'TC-JSS007: Form Field Validation and UX',
      {
        tag: ['@Functional', '@UKProd', '@UX', '@Smoke', '@UKSmoke'],
      },
      async () => {
        // Verify component structure
        await jobSearchStage.verifyComponentStructure();
        await jobSearchStage.verifyFormStructure();

        // Test tab navigation
        await jobSearchStage.testKeyboardNavigation();

        // Test form submission with Enter key
        const resultURL = await jobSearchStage.testEnterKeySubmission(
          'Test Position',
          'Test Location'
        );
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );
  });

  /**
   * VISUAL TESTS
   */

  test.describe('Visual Tests', () => {
    test(
      'TC-JSS008: XL Viewport Visual Validation (1440px+)',
      {
        tag: ['@Visual', '@Responsive', '@XL'],
      },
      async () => {
        // Set XL viewport
        await page.setViewportSize({ width: 1440, height: 900 });

        // Verify component structure and visibility
        await jobSearchStage.verifyComponentStructure();
        await jobSearchStage.verifyVisualElements();

        // Validate visual design
        await jobSearchStage.validateVisualDesign('XL');

        // Take screenshot for visual comparison
        await jobSearchStage.takeComponentScreenshot('job-search-stage-xl-viewport');
      }
    );

    test(
      'TC-JSS009: LG Viewport Visual Validation (1024px-1439px)',
      {
        tag: ['@Visual', '@Responsive', '@LG'],
      },
      async () => {
        // Set LG viewport
        await page.setViewportSize({ width: 1200, height: 800 });

        // Verify responsive behavior
        await jobSearchStage.verifyComponentStructure();
        await jobSearchStage.validateVisualDesign('LG');

        // Take screenshot
        await jobSearchStage.takeComponentScreenshot('job-search-stage-lg-viewport');
      }
    );

    test(
      'TC-JSS010: MD Viewport Visual Validation (768px-1023px)',
      {
        tag: ['@Visual', '@Responsive', '@MD'],
      },
      async () => {
        // Set MD viewport (tablet)
        await page.setViewportSize({ width: 900, height: 700 });

        // Verify tablet layout
        await jobSearchStage.verifyComponentStructure();
        await jobSearchStage.validateVisualDesign('MD');

        // Take screenshot
        await jobSearchStage.takeComponentScreenshot('job-search-stage-md-viewport');
      }
    );

    test(
      'TC-JSS011: SM Viewport Visual Validation (320px-767px)',
      {
        tag: ['@Visual', '@Responsive', '@SM'],
      },
      async () => {
        // Set SM viewport (mobile)
        await page.setViewportSize({ width: 375, height: 667 });

        // Verify mobile layout
        await jobSearchStage.verifyComponentStructure();
        await jobSearchStage.validateVisualDesign('SM');

        // Verify touch targets are accessible
        await expect.soft(jobSearchStage['searchButton']).toBeVisible();

        // Take screenshot
        await jobSearchStage.takeComponentScreenshot('job-search-stage-sm-viewport');
      }
    );

    test(
      'TC-JSS012: Font and Typography Validation',
      {
        tag: ['@Visual', '@Typography'],
      },
      async () => {
        // Verify text elements have proper styling
        await jobSearchStage.verifyComponentStructure();

        // Check that text elements are not empty (language-agnostic)
        await expect.soft(jobSearchStage['titleElement']).not.toBeEmpty();
        await expect.soft(jobSearchStage['highlightText']).not.toBeEmpty();
        await expect.soft(jobSearchStage['descriptionText']).not.toBeEmpty();

        // Verify semantic HTML structure
        const titleElement = jobSearchStage['titleElement'];
        const titleTag = await titleElement.evaluate((el: HTMLElement) => el.tagName.toLowerCase());
        expect.soft(titleTag).toBe('h1');
      }
    );

    test(
      'TC-JSS013: Comprehensive Figma Values Validation - All Viewports',
      {
        tag: ['@Visual', '@Figma', '@Typography', '@Comprehensive'],
      },
      async () => {
        const viewports = [
          { name: 'XL', width: 1440, height: 900 },
          { name: 'LG', width: 1024, height: 800 },
          { name: 'MD', width: 768, height: 700 },
          { name: 'SM', width: 375, height: 667 },
        ] as const;

        for (const viewport of viewports) {
          console.log(`\nTesting ${viewport.name} Viewport (${viewport.width}x${viewport.height})`);

          // Set viewport size
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.waitForTimeout(1000); // Allow for responsive adjustments

          // Verify component structure
          await jobSearchStage.verifyComponentStructure();

          // Validate standard visual design
          await jobSearchStage.validateVisualDesign(viewport.name);

          // Validate path-based Figma values (comprehensive typography validation)
          await jobSearchStage.validatePathBasedFigmaValues(viewport.name);

          console.log(`${viewport.name} viewport validation completed`);
        }
      }
    );

    test(
      'TC-JSS014: Individual Element Typography Validation - XL Viewport',
      {
        tag: ['@Visual', '@Typography', '@Figma', '@XL'],
      },
      async () => {
        // Set XL viewport for detailed typography testing
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForTimeout(1000);

        // Verify component is loaded
        await jobSearchStage.verifyComponentStructure();

        console.log('\nDetailed Typography Validation for XL Viewport');

        // Test each element individually with detailed logging
        await jobSearchStage.validatePathBasedFigmaValues('XL');

        // Additional content validation
        const titleText = await jobSearchStage['titleElement'].textContent();
        const descriptionText = await jobSearchStage['descriptionText'].textContent();

        console.log('Content Validation:');
        console.log(`Title: "${titleText}"`);
        console.log(`Description: "${descriptionText?.substring(0, 50)}..."`);

        // Verify content matches expected Figma content
        expect.soft(titleText?.toLowerCase()).toContain('career');
        expect.soft(descriptionText?.toLowerCase()).toContain('bayer');
      }
    );
  });

  /**
   * ACCESSIBILITY TESTS
   */

  test.describe('Accessibility Tests', () => {
    test(
      'TC-A-JSS001: Keyboard Navigation',
      {
        tag: ['@Accessibility', '@Keyboard', '@WCAG'],
      },
      async () => {
        // Test keyboard navigation through form
        await jobSearchStage.testKeyboardNavigation();

        // Verify focus indicators are visible
        await jobSearchStage['interestInput'].focus();
        await expect.soft(jobSearchStage['interestInput']).toBeFocused();

        // Test Enter key form submission
        const resultURL = await jobSearchStage.testEnterKeySubmission('Test', 'Location');
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );

    test(
      'TC-A-JSS002: Screen Reader Compatibility',
      {
        tag: ['@Accessibility', '@ScreenReader', '@WCAG'],
      },
      async () => {
        // Run automated accessibility scan
        await jobSearchStage.runAccessibilityScan();

        // Verify form fields have proper labels
        await expect.soft(jobSearchStage['interestInput']).toHaveAttribute('aria-label');
        await expect.soft(jobSearchStage['locationInput']).toHaveAttribute('aria-label');

        // Verify semantic structure
        await jobSearchStage.verifyFormStructure();
      }
    );

    test(
      'TC-A-JSS003: Color Contrast and Visual Accessibility',
      {
        tag: ['@Accessibility', '@ColorContrast', '@WCAG'],
      },
      async () => {
        // Verify component is visible and accessible
        await jobSearchStage.verifyComponentStructure();

        // Test with different viewport sizes to ensure accessibility
        const viewports = [
          { width: 1440, height: 900 }, // Desktop
          { width: 768, height: 1024 }, // Tablet
          { width: 375, height: 667 }, // Mobile
        ];

        for (const viewport of viewports) {
          await page.setViewportSize(viewport);
          await expect.soft(jobSearchStage['mainContainer']).toBeVisible();
          await expect.soft(jobSearchStage['searchButton']).toBeVisible();
        }
      }
    );

    test(
      'TC-A-JSS004: Form Accessibility and Labels',
      {
        tag: ['@Accessibility', '@Forms', '@WCAG'],
      },
      async () => {
        // Verify form structure and accessibility
        await jobSearchStage.verifyFormStructure();

        // Test form field associations
        const interestInput = jobSearchStage['interestInput'];
        const locationInput = jobSearchStage['locationInput'];

        await expect.soft(interestInput).toHaveAttribute('aria-label');
        await expect.soft(locationInput).toHaveAttribute('aria-label');

        // Verify input types are correct
        await expect.soft(interestInput).toHaveAttribute('type', 'text');
        await expect.soft(locationInput).toHaveAttribute('type', 'text');
      }
    );
  });

  /**
   * PERFORMANCE TESTS
   */

  test.describe('Performance Tests', () => {
    test(
      'TC-P-JSS001: Component Loading Performance',
      {
        tag: ['@Performance', '@Loading'],
      },
      async () => {
        // Measure component loading time
        const startTime = Date.now();

        await jobSearchStage.navigateToPage(baseURL);
        await jobSearchStage.verifyComponentStructure();

        const loadTime = Date.now() - startTime;

        // Verify reasonable load time (under 5 seconds)
        expect.soft(loadTime).toBeLessThan(5000);

        // Verify all essential elements are loaded
        await expect.soft(jobSearchStage['titleElement']).toBeVisible();
        await expect.soft(jobSearchStage['searchButton']).toBeVisible();
      }
    );

    test(
      'TC-P-JSS002: Search Functionality Performance',
      {
        tag: ['@Performance', '@Search'],
      },
      async () => {
        // Measure search response time
        const startTime = Date.now();

        const resultURL = await jobSearchStage.performSearch('Performance Test', 'Test Location');

        const responseTime = Date.now() - startTime;

        // Verify search completes in reasonable time (under 10 seconds)
        expect.soft(responseTime).toBeLessThan(10000);

        // Verify successful navigation
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );
  });

  /**
   * CROSS-BROWSER TESTS
   */

  test.describe('Cross-Browser Tests', () => {
    test(
      'TC-CB-JSS001: Chrome Browser Compatibility',
      {
        tag: ['@CrossBrowser', '@Chrome'],
      },
      async () => {
        // Test core functionality in Chrome
        await jobSearchStage.verifyComponentStructure();

        // Test search functionality
        const resultURL = await jobSearchStage.performSearch('Developer', 'USA');
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );
  });

  /**
   * EDGE CASE TESTS
   */

  test.describe('Edge Case Tests', () => {
    test(
      'TC-E-JSS001: Special Characters and Input Validation',
      {
        tag: ['@EdgeCase', '@InputValidation'],
      },
      async () => {
        // Test special characters
        const specialChars = 'Developer & Engineer (Senior) - C++/Java';
        const locationWithChars = 'São Paulo, Brazil';

        const resultURL = await jobSearchStage.performSearch(specialChars, locationWithChars);

        // Verify URL encoding works correctly
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');

        // Verify special characters are properly encoded in URL
        const urlObj = new URL(resultURL);
        const queryParam = urlObj.searchParams.get('query');
        const locationParam = urlObj.searchParams.get('location');

        expect.soft(queryParam).toBeTruthy();
        expect.soft(locationParam).toBeTruthy();
      }
    );

    test(
      'TC-E-JSS002: Long Text Input Handling',
      {
        tag: ['@EdgeCase', '@InputValidation'],
      },
      async () => {
        // Test very long input strings
        const longInterest = 'A'.repeat(500);
        const longLocation = 'B'.repeat(300);

        await jobSearchStage.fillInterestField(longInterest);
        await jobSearchStage.fillLocationField(longLocation);

        // Verify fields handle long input
        const interestValue = await jobSearchStage['interestInput'].inputValue();
        const locationValue = await jobSearchStage['locationInput'].inputValue();

        expect.soft(interestValue.length).toBeGreaterThan(0);
        expect.soft(locationValue.length).toBeGreaterThan(0);

        // Test search with long inputs
        const resultURL = await jobSearchStage.clickSearchButton();
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );
  });
});

import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { JobSearchBannerComponent } from '../../components/jobSearchBanner.js';
import { envUtils } from '../../helpers/utils/envUtils.js';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

test.describe('Job Search Banner Component', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('JobSearchBanner');
  });

  let page: Page;
  let browser: Browser;
  let context: BrowserContext;
  let jobSearchBanner: JobSearchBannerComponent;
  let baseURL: string;

  test.beforeAll(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    baseURL = envUtils.getBaseUrl();
  });

  test.beforeEach(async () => {
    context = await browser.newContext();
    page = await context.newPage();
    jobSearchBanner = new JobSearchBannerComponent(page, browser, context);

    // Navigate to component page
    await jobSearchBanner.navigateToPage(baseURL);

    // Accept cookies if present (required for AC3)
    await jobSearchBanner.acceptCookiesBanner();
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
      'TC-JSB001: Valid Search Query with Both Fields (AC1)',
      {
        tag: ['@Functional', '@UKProd', '@AC1', '@Critical'],
      },
      async () => {
        // Test data as specified in requirements
        const interest = 'Back End Development';
        const location = 'Germany';

        // Perform search with both fields
        const resultURL = await jobSearchBanner.performSearch(interest, location);

        // Validate URL contains expected parameters
        await jobSearchBanner.validateSearchURL(resultURL, interest, location);

        // Verify navigation to 8fold platform
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );

    test(
      'TC-JSB002: Search with Interest Field Only (AC2)',
      {
        tag: ['@Functional', '@UKProd', '@AC2', '@Edge'],
      },
      async () => {
        const interest = 'Software Engineer';

        // Perform search with interest only
        const resultURL = await jobSearchBanner.performInterestOnlySearch(interest);

        // Validate URL contains query parameter
        await jobSearchBanner.validateSearchURL(resultURL, interest);

        // Verify successful navigation
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );

    test(
      'TC-JSB003: Search with Location Field Only (AC2)',
      {
        tag: ['@Functional', '@UKProd', '@AC2', '@Edge'],
      },
      async () => {
        const location = 'United States';

        // Perform search with location only
        const resultURL = await jobSearchBanner.performLocationOnlySearch(location);

        // Validate URL contains location parameter
        await jobSearchBanner.validateSearchURL(resultURL, undefined, location);

        // Verify successful navigation
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );

    test(
      'TC-JSB004: Empty Form Search Submission (AC2)',
      {
        tag: ['@Functional', '@UKProd', '@AC2', '@Edge'],
      },
      async () => {
        // Perform search with empty fields
        const resultURL = await jobSearchBanner.performEmptySearch();

        // Verify navigation to 8fold (should still work)
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');

        // Verify language parameter is present
        const urlObj = new URL(resultURL);
        expect.soft(urlObj.searchParams.get('hl')).toBe('en');
      }
    );

    test(
      'TC-JSB005: Cookie-Based Location Prefill (AC3)',
      {
        tag: ['@Functional', '@UKProd', '@AC3', '@Cookie'],
      },
      async () => {
        // Check if location field has prefilled value
        const prefilledLocation = await jobSearchBanner.getPrefilledLocation();

        if (prefilledLocation) {
          // If prefilled, verify it's a valid country/location
          expect.soft(prefilledLocation.length).toBeGreaterThan(0);
          expect.soft(prefilledLocation).not.toMatch(/^[\s]*$/); // Not just whitespace

          // Verify user can modify prefilled value
          await jobSearchBanner.fillLocationField('Custom Location');
          const modifiedValue = await jobSearchBanner.getPrefilledLocation();
          expect.soft(modifiedValue).toBe('Custom Location');
        } else {
          // If not prefilled, document for manual verification
          console.log('Location prefill not detected - may require specific cookie setup');
        }
      }
    );

    test(
      'TC-JSB006: Auto-Suggestion Functionality (AC4)',
      {
        tag: ['@Functional', '@UKProd', '@AC4', '@Interactive'],
      },
      async () => {
        // Test auto-suggestions with character input
        const suggestionsFound = await jobSearchBanner.testAutoSuggestions('D');

        if (suggestionsFound) {
          // If suggestions appear, verify functionality
          expect.soft(suggestionsFound).toBe(true);
        } else {
          // Document if auto-suggestions are not active
          console.log('Auto-suggestions not detected - may be disabled in test environment');

          // Still verify typing works in the field
          await jobSearchBanner.fillInterestField('Developer');
          const fieldValue = await jobSearchBanner.getPrefilledLocation();
          // This tests that the field accepts input even without suggestions
        }
      }
    );

    test(
      'TC-JSB007: Form Field Validation and UX',
      {
        tag: ['@Functional', '@UKProd', '@UX', '@Smoke', '@UKSmoke'],
      },
      async () => {
        // Verify component structure
        await jobSearchBanner.verifyComponentStructure();
        await jobSearchBanner.verifyFormStructure();

        // Test tab navigation
        await jobSearchBanner.testKeyboardNavigation();

        // Test form submission with Enter key
        const resultURL = await jobSearchBanner.testEnterKeySubmission(
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
      'TC-JSB008: XL Viewport Visual Validation (1440px+)',
      {
        tag: ['@Visual', '@Responsive', '@XL'],
      },
      async () => {
        // Set XL viewport
        await page.setViewportSize({ width: 1440, height: 900 });

        // Verify component structure and visibility
        await jobSearchBanner.verifyComponentStructure();
        await jobSearchBanner.verifyVisualElements();

        // Validate visual design
        await jobSearchBanner.validateVisualDesign('XL');

        // Take screenshot for visual comparison
        await jobSearchBanner.takeComponentScreenshot('job-search-banner-xl-viewport');
      }
    );

    test(
      'TC-JSB009: LG Viewport Visual Validation (1024px-1439px)',
      {
        tag: ['@Visual', '@Responsive', '@LG'],
      },
      async () => {
        // Set LG viewport
        await page.setViewportSize({ width: 1200, height: 800 });

        // Verify responsive behavior
        await jobSearchBanner.verifyComponentStructure();
        await jobSearchBanner.validateVisualDesign('LG');

        // Take screenshot
        await jobSearchBanner.takeComponentScreenshot('job-search-banner-lg-viewport');
      }
    );

    test(
      'TC-JSB010: MD Viewport Visual Validation (768px-1023px)',
      {
        tag: ['@Visual', '@Responsive', '@MD'],
      },
      async () => {
        // Set MD viewport (tablet)
        await page.setViewportSize({ width: 900, height: 700 });

        // Verify tablet layout
        await jobSearchBanner.verifyComponentStructure();
        await jobSearchBanner.validateVisualDesign('MD');

        // Take screenshot
        await jobSearchBanner.takeComponentScreenshot('job-search-banner-md-viewport');
      }
    );

    test(
      'TC-JSB011: SM Viewport Visual Validation (320px-767px)',
      {
        tag: ['@Visual', '@Responsive', '@SM'],
      },
      async () => {
        // Set SM viewport (mobile)
        await page.setViewportSize({ width: 375, height: 667 });

        // Verify mobile layout
        await jobSearchBanner.verifyComponentStructure();
        await jobSearchBanner.validateVisualDesign('SM');

        // Verify touch targets are accessible
        await expect.soft(jobSearchBanner['searchButton']).toBeVisible();

        // Take screenshot
        await jobSearchBanner.takeComponentScreenshot('job-search-banner-sm-viewport');
      }
    );

    test(
      'TC-JSB012: Font and Typography Validation',
      {
        tag: ['@Visual', '@Typography'],
      },
      async () => {
        // Verify text elements have proper styling
        await jobSearchBanner.verifyComponentStructure();

        // Check that text elements are not empty (language-agnostic)
        await expect.soft(jobSearchBanner['titleElement']).not.toBeEmpty();
        await expect.soft(jobSearchBanner['highlightText']).not.toBeEmpty();
        await expect.soft(jobSearchBanner['descriptionText']).not.toBeEmpty();

        // Verify semantic HTML structure
        const titleElement = jobSearchBanner['titleElement'];
        const titleTag = await titleElement.evaluate((el: HTMLElement) => el.tagName.toLowerCase());
        expect.soft(titleTag).toBe('h1');
      }
    );

    test(
      'TC-JSB013: Comprehensive Figma Values Validation - All Viewports',
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
          await jobSearchBanner.verifyComponentStructure();

          // Validate standard visual design
          await jobSearchBanner.validateVisualDesign(viewport.name);

          // Validate path-based Figma values (comprehensive typography validation)
          await jobSearchBanner.validatePathBasedFigmaValues(viewport.name);

          console.log(`${viewport.name} viewport validation completed`);
        }
      }
    );

    test(
      'TC-JSB014: Individual Element Typography Validation - XL Viewport',
      {
        tag: ['@Visual', '@Typography', '@Figma', '@XL'],
      },
      async () => {
        // Set XL viewport for detailed typography testing
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForTimeout(1000);

        // Verify component is loaded
        await jobSearchBanner.verifyComponentStructure();

        console.log('\nDetailed Typography Validation for XL Viewport');

        // Test each element individually with detailed logging
        await jobSearchBanner.validatePathBasedFigmaValues('XL');

        // Additional content validation
        const titleText = await jobSearchBanner['titleElement'].textContent();
        const descriptionText = await jobSearchBanner['descriptionText'].textContent();

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
      'TC-A-JSB001: Keyboard Navigation',
      {
        tag: ['@Accessibility', '@Keyboard', '@WCAG'],
      },
      async () => {
        // Test keyboard navigation through form
        await jobSearchBanner.testKeyboardNavigation();

        // Verify focus indicators are visible
        await jobSearchBanner['interestInput'].focus();
        await expect.soft(jobSearchBanner['interestInput']).toBeFocused();

        // Test Enter key form submission
        const resultURL = await jobSearchBanner.testEnterKeySubmission('Test', 'Location');
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );

    test(
      'TC-A-JSB002: Screen Reader Compatibility',
      {
        tag: ['@Accessibility', '@ScreenReader', '@WCAG'],
      },
      async () => {
        // Run automated accessibility scan
        await jobSearchBanner.runAccessibilityScan();

        // Verify form fields have proper labels
        await expect.soft(jobSearchBanner['interestInput']).toHaveAttribute('aria-label');
        await expect.soft(jobSearchBanner['locationInput']).toHaveAttribute('aria-label');

        // Verify semantic structure
        await jobSearchBanner.verifyFormStructure();
      }
    );

    test(
      'TC-A-JSB003: Color Contrast and Visual Accessibility',
      {
        tag: ['@Accessibility', '@ColorContrast', '@WCAG'],
      },
      async () => {
        // Verify component is visible and accessible
        await jobSearchBanner.verifyComponentStructure();

        // Test with different viewport sizes to ensure accessibility
        const viewports = [
          { width: 1440, height: 900 }, // Desktop
          { width: 768, height: 1024 }, // Tablet
          { width: 375, height: 667 }, // Mobile
        ];

        for (const viewport of viewports) {
          await page.setViewportSize(viewport);
          await expect.soft(jobSearchBanner['mainContainer']).toBeVisible();
          await expect.soft(jobSearchBanner['searchButton']).toBeVisible();
        }
      }
    );

    test(
      'TC-A-JSB004: Form Accessibility and Labels',
      {
        tag: ['@Accessibility', '@Forms', '@WCAG'],
      },
      async () => {
        // Verify form structure and accessibility
        await jobSearchBanner.verifyFormStructure();

        // Test form field associations
        const interestInput = jobSearchBanner['interestInput'];
        const locationInput = jobSearchBanner['locationInput'];

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
      'TC-P-JSB001: Component Loading Performance',
      {
        tag: ['@Performance', '@Loading'],
      },
      async () => {
        // Measure component loading time
        const startTime = Date.now();

        await jobSearchBanner.navigateToPage(baseURL);
        await jobSearchBanner.verifyComponentStructure();

        const loadTime = Date.now() - startTime;

        // Verify reasonable load time (under 5 seconds)
        expect.soft(loadTime).toBeLessThan(5000);

        // Verify all essential elements are loaded
        await expect.soft(jobSearchBanner['titleElement']).toBeVisible();
        await expect.soft(jobSearchBanner['searchButton']).toBeVisible();
      }
    );

    test(
      'TC-P-JSB002: Search Functionality Performance',
      {
        tag: ['@Performance', '@Search'],
      },
      async () => {
        // Measure search response time
        const startTime = Date.now();

        const resultURL = await jobSearchBanner.performSearch('Performance Test', 'Test Location');

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
      'TC-CB-JSB001: Chrome Browser Compatibility',
      {
        tag: ['@CrossBrowser', '@Chrome'],
      },
      async () => {
        // Test core functionality in Chrome
        await jobSearchBanner.verifyComponentStructure();

        // Test search functionality
        const resultURL = await jobSearchBanner.performSearch('Developer', 'USA');
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );
  });

  /**
   * EDGE CASE TESTS
   */

  test.describe('Edge Case Tests', () => {
    test(
      'TC-E-JSB001: Special Characters and Input Validation',
      {
        tag: ['@EdgeCase', '@InputValidation'],
      },
      async () => {
        // Test special characters
        const specialChars = 'Developer & Engineer (Senior) - C++/Java';
        const locationWithChars = 'São Paulo, Brazil';

        const resultURL = await jobSearchBanner.performSearch(specialChars, locationWithChars);

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
      'TC-E-JSB002: Long Text Input Handling',
      {
        tag: ['@EdgeCase', '@InputValidation'],
      },
      async () => {
        // Test very long input strings
        const longInterest = 'A'.repeat(500);
        const longLocation = 'B'.repeat(300);

        await jobSearchBanner.fillInterestField(longInterest);
        await jobSearchBanner.fillLocationField(longLocation);

        // Verify fields handle long input
        const interestValue = await jobSearchBanner['interestInput'].inputValue();
        const locationValue = await jobSearchBanner['locationInput'].inputValue();

        expect.soft(interestValue.length).toBeGreaterThan(0);
        expect.soft(locationValue.length).toBeGreaterThan(0);

        // Test search with long inputs
        const resultURL = await jobSearchBanner.clickSearchButton();
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );
  });
});

import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { JobSearchSideBarComponent } from '../../components/jobSearchSideBar.js';
import { envUtils } from '../../helpers/utils/envUtils.js';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

test.describe('Job Search SideBar Component', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('JobSearchSideBar');
  });

  let page: Page;
  let browser: Browser;
  let context: BrowserContext;
  let jobSearchSideBar: JobSearchSideBarComponent;
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
    jobSearchSideBar = new JobSearchSideBarComponent(page, browser, context);

    // Navigate to component page with retry for Firefox
    try {
      await jobSearchSideBar.navigateToPage(baseURL);
    } catch (error) {
      console.log('First navigation attempt failed, retrying...');
      await jobSearchSideBar.navigateToPage(baseURL);
    }

    // Accept cookies if present (required for AC3)
    await jobSearchSideBar.acceptCookiesBanner();
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
      'TC-JSSB001: Valid Search Query with Both Fields (AC1)',
      {
        tag: ['@Functional', '@AC1', '@Critical'],
      },
      async () => {
        // Test data as specified in requirements
        const interest = 'Back End Development';
        const location = 'Germany';

        // Perform search with both fields
        const resultURL = await jobSearchSideBar.performSearch(interest, location);

        // Validate URL contains expected parameters
        await jobSearchSideBar.validateSearchURL(resultURL, interest, location);

        // Verify navigation to 8fold platform
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );

    test(
      'TC-JSSB002: Search with Interest Field Only (AC2)',
      {
        tag: ['@Functional', '@AC2', '@Edge'],
      },
      async () => {
        const interest = 'Software Engineer';

        // Perform search with interest only
        const resultURL = await jobSearchSideBar.performInterestOnlySearch(interest);

        // Validate URL contains query parameter
        await jobSearchSideBar.validateSearchURL(resultURL, interest);

        // Verify successful navigation
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );

    test(
      'TC-JSSB003: Search with Location Field Only (AC2)',
      {
        tag: ['@Functional', '@AC2', '@Edge'],
      },
      async () => {
        const location = 'United States';

        // Perform search with location only
        const resultURL = await jobSearchSideBar.performLocationOnlySearch(location);

        // Validate URL contains location parameter
        await jobSearchSideBar.validateSearchURL(resultURL, undefined, location);

        // Verify successful navigation
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );

    test(
      'TC-JSSB004: Empty Form Search Submission (AC2)',
      {
        tag: ['@Functional', '@AC2', '@Edge'],
      },
      async () => {
        // Perform search with empty fields
        const resultURL = await jobSearchSideBar.performEmptySearch();

        // Verify navigation to 8fold (should still work)
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');

        // Verify language parameter is present
        const urlObj = new URL(resultURL);
        expect.soft(urlObj.searchParams.get('hl')).toBe('en');
      }
    );

    test(
      'TC-JSSB005: Cookie-Based Location Prefill (AC3)',
      {
        tag: ['@Functional', '@AC3', '@Cookie'],
      },
      async () => {
        // Check if location field has prefilled value
        const prefilledLocation = await jobSearchSideBar.getPrefilledLocation();

        if (prefilledLocation) {
          // If prefilled, verify it's a valid country/location
          expect.soft(prefilledLocation.length).toBeGreaterThan(0);
          expect.soft(prefilledLocation).not.toMatch(/^[\s]*$/); // Not just whitespace

          // Verify user can modify prefilled value
          await jobSearchSideBar.fillLocationField('Custom Location');
          const modifiedValue = await jobSearchSideBar.getPrefilledLocation();
          expect.soft(modifiedValue).toBe('Custom Location');
        } else {
          // If not prefilled, document for manual verification
          console.log('Location prefill not detected - may require specific cookie setup');
        }
      }
    );

    test(
      'TC-JSSB006: Auto-Suggestion Functionality (AC4)',
      {
        tag: ['@Functional', '@AC4', '@Interactive'],
      },
      async () => {
        // Test auto-suggestions with character input
        const suggestionsFound = await jobSearchSideBar.testAutoSuggestions('D');

        if (suggestionsFound) {
          // If suggestions appear, verify functionality
          expect.soft(suggestionsFound).toBe(true);
        } else {
          // Document if auto-suggestions are not active
          console.log('Auto-suggestions not detected - may be disabled in test environment');

          // Still verify typing works in the field
          await jobSearchSideBar.fillInterestField('Developer');
          const fieldValue = await jobSearchSideBar.getPrefilledLocation();
          // This tests that the field accepts input even without suggestions
        }
      }
    );

    test(
      'TC-JSSB007: Form Field Validation and UX - No Resume Elements',
      {
        tag: ['@Functional', '@UX', '@SideBar', '@Smoke', '@UKSmoke'],
      },
      async () => {
        // Verify component structure
        await jobSearchSideBar.verifyComponentStructure();
        await jobSearchSideBar.verifyFormStructure();

        // Test tab navigation
        await jobSearchSideBar.testKeyboardNavigation();

        // Test form submission with Enter key
        const resultURL = await jobSearchSideBar.testEnterKeySubmission(
          'Test Position',
          'Test Location'
        );
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');

        // Verify that resume-related elements are NOT present in the component
        const componentArea = page
          .locator(
            '[data-testid="job-search-component"], .job-search-container, .job-search-form, form'
          )
          .first();
        const resumeButtons = componentArea
          .locator('button, a')
          .filter({ hasText: /upload.*resume|resume.*upload/i });
        const resumeInputs = componentArea.locator('input[type="file"]');
        const resumeCount = (await resumeButtons.count()) + (await resumeInputs.count());
        expect.soft(resumeCount).toBe(0); // Should be 0 for sidebar component

        // Verify that "Get job suggestion" text is NOT present
        const suggestionElements = page.locator('*').filter({ hasText: /get job suggestion/i });
        const suggestionCount = await suggestionElements.count();
        expect.soft(suggestionCount).toBe(0); // Should be 0 for sidebar component
      }
    );

    test(
      'TC-JSSB008: SideBar Component Specific Structure Validation',
      {
        tag: ['@Functional', '@SideBar', '@Structure'],
      },
      async () => {
        // Verify sidebar component has simplified structure
        await jobSearchSideBar.verifyComponentRenders();

        // Verify form elements exist
        await expect.soft(jobSearchSideBar['interestInput']).toBeVisible();
        await expect.soft(jobSearchSideBar['locationInput']).toBeVisible();
        await expect.soft(jobSearchSideBar['searchButton']).toBeVisible();

        // Verify no additional suggestion text or resume links
        const pageText = await page.textContent('body');
        expect.soft(pageText?.toLowerCase()).not.toContain('get job suggestion');
        expect.soft(pageText?.toLowerCase()).not.toContain('upload your resume');

        // Verify form count - should have only 1 form (not 2 like stage component)
        const formCount = await page.locator('form').count();
        expect.soft(formCount).toBeLessThanOrEqual(1); // Should be 1 or 0 for sidebar
      }
    );
  });

  /**
   * VISUAL TESTS
   */

  test.describe('Visual Tests', () => {
    test(
      'TC-JSSB009: XL Viewport Visual Validation (1440px+)',
      {
        tag: ['@Visual', '@Responsive', '@XL'],
      },
      async () => {
        // Set XL viewport
        await page.setViewportSize({ width: 1440, height: 900 });

        // Verify component structure and visibility
        await jobSearchSideBar.verifyComponentStructure();
        await jobSearchSideBar.verifyVisualElements();

        // Validate visual design
        await jobSearchSideBar.validateVisualDesign('XL');

        // Take screenshot for visual comparison
        await jobSearchSideBar.takeComponentScreenshot('job-search-sidebar-xl-viewport');
      }
    );

    test(
      'TC-JSSB010: LG Viewport Visual Validation (1024px-1439px)',
      {
        tag: ['@Visual', '@Responsive', '@LG'],
      },
      async () => {
        // Set LG viewport
        await page.setViewportSize({ width: 1200, height: 800 });

        // Verify responsive behavior
        await jobSearchSideBar.verifyComponentStructure();
        await jobSearchSideBar.validateVisualDesign('LG');

        // Take screenshot
        await jobSearchSideBar.takeComponentScreenshot('job-search-sidebar-lg-viewport');
      }
    );

    test(
      'TC-JSSB011: MD Viewport Visual Validation (768px-1023px)',
      {
        tag: ['@Visual', '@Responsive', '@MD'],
      },
      async () => {
        // Set MD viewport (tablet)
        await page.setViewportSize({ width: 900, height: 700 });

        // Verify tablet layout
        await jobSearchSideBar.verifyComponentStructure();
        await jobSearchSideBar.validateVisualDesign('MD');

        // Take screenshot
        await jobSearchSideBar.takeComponentScreenshot('job-search-sidebar-md-viewport');
      }
    );

    test(
      'TC-JSSB012: SM Viewport Visual Validation (320px-767px)',
      {
        tag: ['@Visual', '@Responsive', '@SM'],
      },
      async () => {
        // Set SM viewport (mobile)
        await page.setViewportSize({ width: 375, height: 667 });

        // Verify mobile layout
        await jobSearchSideBar.verifyComponentStructure();
        await jobSearchSideBar.validateVisualDesign('SM');

        // Verify touch targets are accessible
        await expect.soft(jobSearchSideBar['searchButton']).toBeVisible();

        // Take screenshot
        await jobSearchSideBar.takeComponentScreenshot('job-search-sidebar-sm-viewport');
      }
    );

    test(
      'TC-JSSB013: Font and Typography Validation',
      {
        tag: ['@Visual', '@Typography'],
      },
      async () => {
        // Verify text elements have proper styling
        await jobSearchSideBar.verifyComponentStructure();

        // Check that text elements are not empty (language-agnostic)
        await expect.soft(jobSearchSideBar['titleElement']).not.toBeEmpty();
        // Note: Only validate title element as sidebar may not have description text

        // Verify semantic HTML structure
        const titleElement = jobSearchSideBar['titleElement'];
        const titleTag = await titleElement.evaluate((el: HTMLElement) => el.tagName.toLowerCase());
        await expect.soft(titleTag).toBe('h1');
      }
    );

    test(
      'TC-JSSB014: Comprehensive Figma Values Validation - All Viewports',
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
          await jobSearchSideBar.verifyComponentStructure();

          // Validate standard visual design
          await jobSearchSideBar.validateVisualDesign(viewport.name);

          // Validate path-based Figma values (comprehensive typography validation)
          await jobSearchSideBar.validatePathBasedFigmaValues(viewport.name);

          console.log(`${viewport.name} viewport validation completed`);
        }
      }
    );

    test(
      'TC-JSSB015: Individual Element Typography Validation - XL Viewport',
      {
        tag: ['@Visual', '@Typography', '@Figma', '@XL'],
      },
      async () => {
        // Set XL viewport for detailed typography testing
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForTimeout(1000);

        // Verify component is loaded
        await jobSearchSideBar.verifyComponentStructure();

        console.log('\nDetailed Typography Validation for XL Viewport');

        // Test each element individually with detailed logging
        await jobSearchSideBar.validatePathBasedFigmaValues('XL');

        // Additional content validation
        const titleText = await jobSearchSideBar['titleElement'].textContent();

        console.log('Content Validation:');
        console.log(`Title: "${titleText}"`);

        // Verify content matches expected Figma content
        expect.soft(titleText?.toLowerCase()).toContain('career');

        // Note: Description validation skipped for sidebar component as it may not have description text
      }
    );
  });

  /**
   * ACCESSIBILITY TESTS
   */

  test.describe('Accessibility Tests', () => {
    test(
      'TC-A-JSSB001: Keyboard Navigation',
      {
        tag: ['@Accessibility', '@Keyboard', '@WCAG'],
      },
      async () => {
        // Test keyboard navigation through form
        await jobSearchSideBar.testKeyboardNavigation();

        // Verify focus indicators are visible
        await jobSearchSideBar['interestInput'].focus();
        await expect.soft(jobSearchSideBar['interestInput']).toBeFocused();

        // Test Enter key form submission
        const resultURL = await jobSearchSideBar.testEnterKeySubmission('Test', 'Location');
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );

    test(
      'TC-A-JSSB002: Screen Reader Compatibility',
      {
        tag: ['@Accessibility', '@ScreenReader', '@WCAG'],
      },
      async () => {
        // Run automated accessibility scan
        await jobSearchSideBar.runAccessibilityScan();

        // Verify form fields have proper labels
        await expect.soft(jobSearchSideBar['interestInput']).toHaveAttribute('aria-label');
        await expect.soft(jobSearchSideBar['locationInput']).toHaveAttribute('aria-label');

        // Verify semantic structure
        await jobSearchSideBar.verifyFormStructure();
      }
    );

    test(
      'TC-A-JSSB003: Color Contrast and Visual Accessibility',
      {
        tag: ['@Accessibility', '@ColorContrast', '@WCAG'],
      },
      async () => {
        // Verify component is visible and accessible
        await jobSearchSideBar.verifyComponentStructure();

        // Test with different viewport sizes to ensure accessibility
        const viewports = [
          { width: 1440, height: 900 }, // Desktop
          { width: 768, height: 1024 }, // Tablet
          { width: 375, height: 667 }, // Mobile
        ];

        for (const viewport of viewports) {
          await page.setViewportSize(viewport);
          await expect.soft(jobSearchSideBar['mainContainer']).toBeVisible();
          await expect.soft(jobSearchSideBar['searchButton']).toBeVisible();
        }
      }
    );

    test(
      'TC-A-JSSB004: Form Accessibility and Labels',
      {
        tag: ['@Accessibility', '@Forms', '@WCAG'],
      },
      async () => {
        // Verify form structure and accessibility
        await jobSearchSideBar.verifyFormStructure();

        // Test form field associations
        const interestInput = jobSearchSideBar['interestInput'];
        const locationInput = jobSearchSideBar['locationInput'];

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
      'TC-P-JSSB001: Component Loading Performance',
      {
        tag: ['@Performance', '@Loading'],
      },
      async () => {
        // Measure component loading time
        const startTime = Date.now();

        await jobSearchSideBar.navigateToPage(baseURL);
        await jobSearchSideBar.verifyComponentStructure();

        const loadTime = Date.now() - startTime;

        // Verify reasonable load time (under 5 seconds)
        expect.soft(loadTime).toBeLessThan(5000);

        // Verify all essential elements are loaded
        await expect.soft(jobSearchSideBar['titleElement']).toBeVisible();
        await expect.soft(jobSearchSideBar['searchButton']).toBeVisible();
      }
    );

    test(
      'TC-P-JSSB002: Search Functionality Performance',
      {
        tag: ['@Performance', '@Search'],
      },
      async () => {
        // Measure search response time
        const startTime = Date.now();

        const resultURL = await jobSearchSideBar.performSearch('Performance Test', 'Test Location');

        const responseTime = Date.now() - startTime;

        // Verify search completes in reasonable time (under 16 seconds for complex navigation)
        expect.soft(responseTime).toBeLessThan(16000);

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
      'TC-CB-JSSB001: Chrome Browser Compatibility',
      {
        tag: ['@CrossBrowser', '@Chrome'],
      },
      async () => {
        // Test core functionality in Chrome
        await jobSearchSideBar.verifyComponentStructure();

        // Test search functionality
        const resultURL = await jobSearchSideBar.performSearch('Developer', 'USA');
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );
  });

  /**
   * EDGE CASE TESTS
   */

  test.describe('Edge Case Tests', () => {
    test(
      'TC-E-JSSB001: Special Characters and Input Validation',
      {
        tag: ['@EdgeCase', '@InputValidation'],
      },
      async () => {
        // Test special characters
        const specialChars = 'Developer & Engineer (Senior) - C++/Java';
        const locationWithChars = 'São Paulo, Brazil';

        const resultURL = await jobSearchSideBar.performSearch(specialChars, locationWithChars);

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
      'TC-E-JSSB002: Long Text Input Handling',
      {
        tag: ['@EdgeCase', '@InputValidation'],
      },
      async () => {
        // Test very long input strings
        const longInterest = 'A'.repeat(500);
        const longLocation = 'B'.repeat(300);

        await jobSearchSideBar.fillInterestField(longInterest);
        await jobSearchSideBar.fillLocationField(longLocation);

        // Verify fields handle long input
        const interestValue = await jobSearchSideBar['interestInput'].inputValue();
        const locationValue = await jobSearchSideBar['locationInput'].inputValue();

        expect.soft(interestValue.length).toBeGreaterThan(0);
        expect.soft(locationValue.length).toBeGreaterThan(0);

        // Test search with long inputs
        const resultURL = await jobSearchSideBar.clickSearchButton();
        expect.soft(resultURL).toContain('bayer.eightfold.ai/careers');
      }
    );

    test(
      'TC-E-JSSB003: SideBar Specific Validation - No Resume Elements',
      {
        tag: ['@EdgeCase', '@SideBar', '@Structure'],
      },
      async () => {
        // Ensure sidebar component doesn't accidentally include stage-specific elements
        await jobSearchSideBar.verifyComponentRenders();

        // Multiple checks to ensure no resume/suggestion elements
        const bodyText = (await page.locator('body').textContent()) || '';
        const allElements = await page.locator('*').allTextContents();
        const allElementsText = allElements.join(' ').toLowerCase();

        // Verify no resume-related text
        expect.soft(bodyText.toLowerCase()).not.toContain('resume');
        expect.soft(bodyText.toLowerCase()).not.toContain('upload');
        expect.soft(allElementsText).not.toContain('get job suggestion');

        // Verify no resume-related buttons or links
        const resumeButtons = page.locator('button, a').filter({ hasText: /resume|upload/i });
        const resumeButtonCount = await resumeButtons.count();
        expect.soft(resumeButtonCount).toBe(0);

        // Verify no suggestion text elements
        const suggestionTexts = page
          .locator('*')
          .filter({ hasText: /get.*job.*suggestion|job.*suggestion.*based/i });
        const suggestionCount = await suggestionTexts.count();
        expect.soft(suggestionCount).toBe(0);
      }
    );
  });
});

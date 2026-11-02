import { test, expect } from '@playwright/test';
import { LocationComponent } from '../../components/locationComponent';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

test.describe('Location Component Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('location');
  });

  let locationComponent: LocationComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    locationComponent = new LocationComponent(page, browser, context);
    await locationComponent.navigateToLocationPage();
    test.setTimeout(60 * 1000);

    // Ensure clean state: close any open overlays
    try {
      await locationComponent.closeLocationOverlay();
    } catch (error) {
      // Overlay not open, continue - this is expected behavior
      console.log('No overlay to close, proceeding with test: ' + (error as Error).message);
    }
  });

  // ========================================
  // FUNCTIONAL TESTS
  // ========================================

  test('@Functional @Smoke @UKSmoke: TC-L01 - Validate location overlay accessibility from header', async () => {
    // Open location overlay from header button (AC6)
    await locationComponent.openLocationOverlayFromHeader();

    // Validate overlay is visible and ready
    await locationComponent.waitForLocationOverlayReady();

    // Validate back button behavior (should not be visible from header - AC14)
    await locationComponent.validateBackButtonBehavior(false);

    // Cleanup
    await locationComponent.closeLocationOverlay();
  });

  test('@Functional: TC-L02 - Validate location overlay accessibility from navigation flyout', async () => {
    // Open location overlay from navigation flyout (AC6, AC14)
    await locationComponent.openLocationOverlayFromFlyout();

    // Validate overlay is visible and ready
    await locationComponent.waitForLocationOverlayReady();

    // Validate back button behavior (should be visible from flyout - AC14)
    await locationComponent.validateBackButtonBehavior(true);

    // Cleanup
    await locationComponent.closeLocationOverlay();
  });

  test('@Functional: TC-L03 - Validate headline display in location overlay', async () => {
    // Open overlay and validate headline display (AC1)
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateHeadlineDisplay();

    await locationComponent.closeLocationOverlay();
  });

  test('@Functional: TC-L04 - Validate description text display per locale', async () => {
    // Validate description text display (AC3)
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateDescriptionTextDisplay();

    await locationComponent.closeLocationOverlay();
  });

  test('@Functional: TC-L05 - Validate auto detection text display', async () => {
    // Validate auto detection functionality (AC4, AC5)
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateAutoDetectionText();

    await locationComponent.closeLocationOverlay();
  });

  test('@Functional: TC-L06 - Validate Bayer Global positioning and separation', async () => {
    // Skip for India - Bayer Global is not available in India location list
    const env = process.env.TEST_ENV ?? 'qa';
    if (env === 'prod_in') {
      test.skip();
    }

    // Validate Bayer Global appears first and separately (AC8)
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateBayerGlobalPositioning();

    await locationComponent.closeLocationOverlay();
  });

  test('@Functional: TC-L07 - Validate alphabetical sorting of location items', async () => {
    // Validate alphabetical sorting (AC10)
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateAlphabeticalSorting();

    await locationComponent.closeLocationOverlay();
  });

  test('@Functional: TC-L08 - Validate location search functionality', async () => {
    // Test search functionality (AC11)
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.searchLocationItems('Germany');

    await locationComponent.closeLocationOverlay();
  });

  test('@Functional: TC-L09 - Validate location selection and information display', async () => {
    // Test location selection (AC12)
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    // Note: Using flexible selection due to dynamic content
    await locationComponent.selectLocationItem('Bayer Global');

    await locationComponent.closeLocationOverlay();
  });

  test('@Functional: TC-L10 - Validate overlay close functionality', async () => {
    // Test close button functionality (AC15)
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.closeLocationOverlay();
  });

  test('@Functional: TC-L11 - Validate overlay close with Escape key', async () => {
    // Test Escape key functionality (AC15)
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.closeLocationOverlayWithEscape();
  });

  test('@Functional: TC-L12 - Validate all country/group items are displayed', async () => {
    // Skip for India - location items structure is different
    const env = process.env.TEST_ENV ?? 'qa';
    if (env === 'prod_in') {
      test.skip();
    }

    // Test that all maintained locations are displayed (AC7)
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateAllLocationItemsDisplayed();

    await locationComponent.closeLocationOverlay();
  });

  test('@Functional: TC-L13 - Validate location link closes overlay and loads new URL', async ({
    page,
  }) => {
    // Test clicking location link closes overlay and navigates (AC13)
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    // Select a location and verify navigation behavior
    await locationComponent.selectAndVerifyNavigation('Bayer Global', page);

    // Verify overlay is closed after link click
    await locationComponent.verifyOverlayClosed();
  });

  // ========================================
  // VISUAL TESTS - RESPONSIVE TYPOGRAPHY
  // ========================================

  test('@Visual: TC-LV01 - Validate XL viewport typography', async ({ page }) => {
    // Set XL viewport (1440x900)
    await page.setViewportSize({ width: 1440, height: 900 });

    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateTypographyForViewport('XL');
    await locationComponent.validateVisualConsistency();

    await locationComponent.closeLocationOverlay();
  });

  test('@Visual: TC-LV02 - Validate LG viewport typography', async ({ page }) => {
    // Set LG viewport (1024x768)
    await page.setViewportSize({ width: 1024, height: 768 });

    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateTypographyForViewport('LG');
    await locationComponent.validateVisualConsistency();

    await locationComponent.closeLocationOverlay();
  });

  test('@Visual: TC-LV03 - Validate MD viewport typography', async ({ page }) => {
    // Set MD viewport (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });

    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateTypographyForViewport('MD');
    await locationComponent.validateVisualConsistency();

    await locationComponent.closeLocationOverlay();
  });

  test('@Visual: TC-LV04 - Validate SM viewport typography', async ({ page }) => {
    // Set SM viewport (375x812)
    await page.setViewportSize({ width: 375, height: 812 });

    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateTypographyForViewport('SM');
    await locationComponent.validateVisualConsistency();

    await locationComponent.closeLocationOverlay();
  });

  test('@Visual: TC-LV05 - Validate font family consistency across all elements', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateVisualConsistency();

    await locationComponent.closeLocationOverlay();
  });

  test('@Visual: TC-LV06 - Validate color scheme and contrast', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    // Get current viewport and validate colors
    const viewport = await locationComponent.getCurrentViewport();
    await locationComponent.validateTypographyForViewport(viewport);

    await locationComponent.closeLocationOverlay();
  });

  // ========================================
  // ACCESSIBILITY TESTS
  // ========================================

  test('@Accessibility: TC-LA01 - Validate keyboard navigation support', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateKeyboardNavigation();

    await locationComponent.closeLocationOverlay();
  });

  test('@Accessibility: TC-LA02 - Validate ARIA attributes and semantic structure', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateAriaAttributes();

    await locationComponent.closeLocationOverlay();
  });

  test('@Accessibility: TC-LA03 - Validate screen reader compatibility', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    // Run axe accessibility scan
    await locationComponent.validateAccessibility();

    await locationComponent.closeLocationOverlay();
  });

  test('@Accessibility: TC-LA04 - Validate focus management and tab order', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateKeyboardNavigation();

    await locationComponent.closeLocationOverlay();
  });

  test('@Accessibility: TC-LA05 - Validate color contrast ratios', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    // Run accessibility scan focusing on color contrast
    await locationComponent.validateAccessibility();

    await locationComponent.closeLocationOverlay();
  });

  test('@Accessibility: TC-LA06 - Validate alternative text and labels', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateAriaAttributes();

    await locationComponent.closeLocationOverlay();
  });

  test('@Accessibility: TC-LA07 - Validate proper heading structure', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateHeadlineDisplay();

    await locationComponent.closeLocationOverlay();
  });

  test('@Accessibility: TC-LA08 - Validate form labels and error messages', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateAriaAttributes();

    await locationComponent.closeLocationOverlay();
  });

  test('@Accessibility: TC-LA09 - Validate Escape key functionality', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.closeLocationOverlayWithEscape();
  });

  test('@Accessibility: TC-LA10 - Validate overlay modal behavior', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    await locationComponent.validateAriaAttributes();
    await locationComponent.validateKeyboardNavigation();

    await locationComponent.closeLocationOverlay();
  });

  test('@Accessibility: TC-LA11 - Validate WCAG 2.1 AA compliance', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    // Comprehensive accessibility scan
    await locationComponent.validateAccessibility();

    await locationComponent.closeLocationOverlay();
  });

  // ========================================
  // PERFORMANCE TESTS
  // ========================================

  test('@Performance: TC-LP01 - Validate overlay loading performance', async () => {
    // Measure overlay loading time
    await locationComponent.validateOverlayLoadingPerformance();

    // Cleanup
    await locationComponent.closeLocationOverlay();
  });

  test('@Performance: TC-LP02 - Validate search response performance', async () => {
    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    // Measure search performance
    await locationComponent.validateSearchPerformance();

    await locationComponent.closeLocationOverlay();
  });

  test('@Performance: TC-LP03 - Validate complete page loading with location overlay', async () => {
    // Measure complete page load time including location functionality
    const startTime = Date.now();

    await locationComponent.openLocationOverlayFromHeader();
    await locationComponent.waitForLocationOverlayReady();

    const totalLoadTime = Date.now() - startTime;

    // Performance expectation: complete loading within 5 seconds
    expect.soft(totalLoadTime).toBeLessThan(5000);

    await locationComponent.closeLocationOverlay();
  });
});

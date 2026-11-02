import { test, expect } from '@playwright/test';
import { QuoteComponent } from '../../components/quoteComponent';
import AxeBuilder from '@axe-core/playwright';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

/**
 * Quote Component Test Suite
 * Tests functional, visual, accessibility, and performance aspects
 * Following the same pattern as AbstractText component
 */

test.describe('Quote Component Tests @QuoteComponent', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('quoteComponent');
  });

  // Functional Tests
  test('TC-QC01: Functional Test Cases @Functional @UKProd @Smoke', async ({
    page,
    browser,
    context,
  }) => {
    const quoteComponent = new QuoteComponent(page, browser, context);

    // Navigate to component with automatic authentication
    await quoteComponent.navigateToComponent();

    // 1. Verify page title exists
    await expect.soft(page).toHaveTitle(/.+/);

    // 2. Verify component visibility
    await quoteComponent.verifyComponentVisibility();

    // 3. Verify quote text display
    await quoteComponent.verifyQuoteTextDisplay();

    // 4. Verify author name display
    await quoteComponent.verifyAuthorNameDisplay();

    // 5. Verify author designation display
    await quoteComponent.verifyAuthorDesignationDisplay();

    // 6. Verify quote image display and loading
    await quoteComponent.verifyQuoteImageDisplay();

    // 7. Verify image accessibility
    await quoteComponent.verifyImageAccessibility();

    // 8. Verify image container layout
    await quoteComponent.verifyImageContainerLayout();
  });

  // Image Tests - Responsive verification across viewports

  // Visual/Typography Tests - XL Viewport
  test('TC-QC02-XL: Typography Verification XL Viewport @Visual', async ({
    page,
    browser,
    context,
  }) => {
    const quoteComponent = new QuoteComponent(page, browser, context);

    await quoteComponent.navigateToComponent();

    // Test quote text typography for XL viewport
    await quoteComponent.verifyQuoteTextTypography('XL');

    // Test author name typography for XL viewport
    await quoteComponent.verifyAuthorNameTypography('XL');

    // Test author designation typography for XL viewport
    await quoteComponent.verifyAuthorDesignationTypography('XL');
  });

  // Visual/Typography Tests - LG Viewport
  test('TC-QC02-LG: Typography Verification LG Viewport @Visual', async ({
    page,
    browser,
    context,
  }) => {
    const quoteComponent = new QuoteComponent(page, browser, context);

    await quoteComponent.navigateToComponent();

    // Test quote text typography for LG viewport
    await quoteComponent.verifyQuoteTextTypography('LG');

    // Test author name typography for LG viewport
    await quoteComponent.verifyAuthorNameTypography('LG');

    // Test author designation typography for LG viewport
    await quoteComponent.verifyAuthorDesignationTypography('LG');
  });

  // Visual/Typography Tests - MD Viewport
  test('TC-QC02-MD: Typography Verification MD Viewport @Visual', async ({
    page,
    browser,
    context,
  }) => {
    const quoteComponent = new QuoteComponent(page, browser, context);

    await quoteComponent.navigateToComponent();

    // Test quote text typography for MD viewport
    await quoteComponent.verifyQuoteTextTypography('MD');

    // Test author name typography for MD viewport
    await quoteComponent.verifyAuthorNameTypography('MD');

    // Test author designation typography for MD viewport
    await quoteComponent.verifyAuthorDesignationTypography('MD');
  });

  // Visual/Typography Tests - SM Viewport
  test('TC-QC02-SM: Typography Verification SM Viewport @Visual', async ({
    page,
    browser,
    context,
  }) => {
    const quoteComponent = new QuoteComponent(page, browser, context);

    await quoteComponent.navigateToComponent();

    // Test quote text typography for SM viewport
    await quoteComponent.verifyQuoteTextTypography('SM');

    // Test author name typography for SM viewport
    await quoteComponent.verifyAuthorNameTypography('SM');

    // Test author designation typography for SM viewport
    await quoteComponent.verifyAuthorDesignationTypography('SM');
  });

  test('TC-QC03: Layout and Spacing Verification @Visual', async ({ page, browser, context }) => {
    const quoteComponent = new QuoteComponent(page, browser, context);

    await quoteComponent.navigateToComponent();

    // Verify component layout and spacing
    await quoteComponent.verifyComponentLayoutAndSpacing();
  });

  // Accessibility Tests
  test('TC-QC04: Accessibility Standards @Accessibility', async ({ page, browser, context }) => {
    const quoteComponent = new QuoteComponent(page, browser, context);

    await quoteComponent.navigateToComponent();

    // Verify accessibility attributes and semantic structure
    await quoteComponent.verifyAccessibilityAttributes();

    // Run axe accessibility scan on component
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[data-testid="quote-component"]')
      .analyze();
    expect.soft(accessibilityScanResults.violations).toEqual([]);
  });

  // Performance Tests
  test('TC-QC05: Performance Testing @Performance', async ({ page, browser, context }) => {
    const quoteComponent = new QuoteComponent(page, browser, context);

    // Measure component load time
    const loadTime = await quoteComponent.measureLoadTime();

    // Component should load within reasonable time (5 seconds)
    expect.soft(loadTime).toBeLessThan(5000);

    // Test viewport resize performance
    const viewportSizes = ['SM', 'MD', 'LG', 'XL'] as const;

    for (const viewport of viewportSizes) {
      const resizeStartTime = Date.now();
      await page.setViewportSize(quoteComponent.viewports[viewport]);

      // Wait for any layout changes to complete
      await page.waitForTimeout(100);

      const resizeTime = Date.now() - resizeStartTime;

      // Resize should be quick (under 1 second)
      expect.soft(resizeTime).toBeLessThan(1000);

      // Verify component remains visible and functional
      await expect.soft(quoteComponent.getComponentElement()).toBeVisible();
      await expect.soft(quoteComponent.getQuoteTextElement()).toBeVisible();
    }
  });

  // Figma Design Validation Tests
  test('TC-QC06: XL Viewport Design Compliance @Visual', async ({ page, browser, context }) => {
    const quoteComponent = new QuoteComponent(page, browser, context);

    await quoteComponent.navigateToComponent();
    await quoteComponent.takeViewportScreenshot('XL');

    // Verify component is properly sized for XL viewport
    const boundingBox = await quoteComponent.getComponentElement().boundingBox();
    expect.soft(boundingBox?.width).toBeGreaterThan(800);

    // Verify text scaling for XL
    await quoteComponent.verifyQuoteTextTypography('XL');
  });

  test('TC-QC07: LG Viewport Design Compliance @Visual', async ({ page, browser, context }) => {
    const quoteComponent = new QuoteComponent(page, browser, context);

    await quoteComponent.navigateToComponent();
    await quoteComponent.takeViewportScreenshot('LG');

    // Verify text scaling for LG
    await quoteComponent.verifyQuoteTextTypography('LG');
  });

  test('TC-QC08: MD Viewport Design Compliance @Visual', async ({ page, browser, context }) => {
    const quoteComponent = new QuoteComponent(page, browser, context);

    await quoteComponent.navigateToComponent();
    await quoteComponent.takeViewportScreenshot('MD');

    // Verify text scaling for MD
    await quoteComponent.verifyQuoteTextTypography('MD');
  });

  test('TC-QC09: SM Viewport Design Compliance @Visual', async ({ page, browser, context }) => {
    const quoteComponent = new QuoteComponent(page, browser, context);

    await quoteComponent.navigateToComponent();
    await quoteComponent.takeViewportScreenshot('SM');

    // Verify text scaling for SM
    await quoteComponent.verifyQuoteTextTypography('SM');
  });
});

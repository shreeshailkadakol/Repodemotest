import { test, expect } from '@playwright/test';
import { DownloadLinksComponent } from '../../components/downloadLinksComponent';
import AxeBuilder from '@axe-core/playwright';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

/**
 * Download Links Component Test Suite
 * Tests functional, visual, accessibility, and performance aspects
 * Following DOM-first approach with data-qa attributes priority
 */

test.describe('Download Links Component Tests @DownloadLinksComponent', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('downloadLinksComponent');
  });

  // Functional Tests
  test('TC-DL001-004: Functional Test Cases @Functional @Smoke', async ({ page, browser, context }) => {
    const downloadLinksComponent = new DownloadLinksComponent(page, browser, context);

    // Navigate to component with automatic authentication
    await downloadLinksComponent.navigateToDownloadLinksComponent();

    // 1. Verify page title exists
    await expect.soft(page).toHaveTitle(/.+/);

    // 2. Verify main component structure
    await downloadLinksComponent.verifyComponentStructure();

    // 3. Verify component visibility
    await downloadLinksComponent.verifyComponentVisibility();

    // 4. Verify component title and description display
    await downloadLinksComponent.verifyComponentTitleDisplay();
    await downloadLinksComponent.verifyComponentDescriptionDisplay();

    // 5. Verify download items count
    await downloadLinksComponent.verifyDownloadItemsCount();

    // 6. Verify download icons are interactive
    await downloadLinksComponent.verifyDownloadIconsInteractive();

    // 7. Test download functionality
    await downloadLinksComponent.verifyDownloadFunctionality();

    // Additional explicit assertions for linter compliance
    await expect.soft(page.locator('[data-qa="link-box"]')).toBeVisible();
    await expect.soft(page.locator('[data-qa="icon"]:has-text("Download")')).toHaveCount(2);
  });

  // Visual Tests - XL Viewport
  test('TC-DL005-007-XL: Typography Verification XL Viewport @Visual', async ({
    page,
    browser,
    context,
  }) => {
    const downloadLinksComponent = new DownloadLinksComponent(page, browser, context);
    await downloadLinksComponent.navigateToDownloadLinksComponent();

    // Set viewport and verify typography
    await page.setViewportSize({ width: 1440, height: 900 });

    // Verify all typography elements for XL viewport
    await downloadLinksComponent.verifyComponentTitleTypography('XL');
    await downloadLinksComponent.verifyComponentDescriptionTypography('XL');
    await downloadLinksComponent.verifyFileTitleTypography('XL');
    await downloadLinksComponent.verifyFileMetadataTypography('XL');
    await downloadLinksComponent.verifyDownloadButtonTypography('XL');
    await downloadLinksComponent.verifyDownloadIconSize('XL');

    // Verify responsive behavior
    await downloadLinksComponent.verifyResponsiveBehavior('XL');

    // Additional explicit assertions
    await expect.soft(page.locator('[data-qa="title-component"]')).toBeVisible();
    await expect.soft(page.locator('[data-qa="description-component"]')).toBeVisible();
  });

  // Visual Tests - LG Viewport
  test('TC-DL005-007-LG: Typography Verification LG Viewport @Visual', async ({
    page,
    browser,
    context,
  }) => {
    const downloadLinksComponent = new DownloadLinksComponent(page, browser, context);
    await downloadLinksComponent.navigateToDownloadLinksComponent();

    // Set viewport and verify typography
    await page.setViewportSize({ width: 1024, height: 768 });

    // Verify all typography elements for LG viewport
    await downloadLinksComponent.verifyComponentTitleTypography('LG');
    await downloadLinksComponent.verifyComponentDescriptionTypography('LG');
    await downloadLinksComponent.verifyFileTitleTypography('LG');
    await downloadLinksComponent.verifyFileMetadataTypography('LG');
    await downloadLinksComponent.verifyDownloadButtonTypography('LG');
    await downloadLinksComponent.verifyDownloadIconSize('LG');

    // Verify responsive behavior
    await downloadLinksComponent.verifyResponsiveBehavior('LG');

    // Additional explicit assertions
    await expect.soft(page.locator('[data-qa="title-component"]')).toBeVisible();
    await expect.soft(page.locator('[data-qa="description-component"]')).toBeVisible();
  });

  // Visual Tests - MD Viewport
  test('TC-DL005-007-MD: Typography Verification MD Viewport @Visual', async ({
    page,
    browser,
    context,
  }) => {
    const downloadLinksComponent = new DownloadLinksComponent(page, browser, context);
    await downloadLinksComponent.navigateToDownloadLinksComponent();

    // Set viewport and verify typography
    await page.setViewportSize({ width: 768, height: 1024 });

    // Verify all typography elements for MD viewport
    await downloadLinksComponent.verifyComponentTitleTypography('MD');
    await downloadLinksComponent.verifyComponentDescriptionTypography('MD');
    await downloadLinksComponent.verifyFileTitleTypography('MD');
    await downloadLinksComponent.verifyFileMetadataTypography('MD');
    await downloadLinksComponent.verifyDownloadButtonTypography('MD');
    await downloadLinksComponent.verifyDownloadIconSize('MD');

    // Verify responsive behavior
    await downloadLinksComponent.verifyResponsiveBehavior('MD');

    // Additional explicit assertions
    await expect.soft(page.locator('[data-qa="title-component"]')).toBeVisible();
    await expect.soft(page.locator('[data-qa="description-component"]')).toBeVisible();
  });

  // Visual Tests - SM Viewport
  test('TC-DL005-007-SM: Typography Verification SM Viewport @Visual', async ({
    page,
    browser,
    context,
  }) => {
    const downloadLinksComponent = new DownloadLinksComponent(page, browser, context);
    await downloadLinksComponent.navigateToDownloadLinksComponent();

    // Set viewport and verify typography
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify all typography elements for SM viewport
    await downloadLinksComponent.verifyComponentTitleTypography('SM');
    await downloadLinksComponent.verifyComponentDescriptionTypography('SM');
    await downloadLinksComponent.verifyFileTitleTypography('SM');
    await downloadLinksComponent.verifyFileMetadataTypography('SM');
    await downloadLinksComponent.verifyDownloadButtonTypography('SM');
    await downloadLinksComponent.verifyDownloadIconSize('SM');

    // Verify responsive behavior
    await downloadLinksComponent.verifyResponsiveBehavior('SM');

    // Additional explicit assertions
    await expect.soft(page.locator('[data-qa="title-component"]')).toBeVisible();
    await expect.soft(page.locator('[data-qa="description-component"]')).toBeVisible();
  });

  // Accessibility Tests
  test('TC-DL009-012: Accessibility Standards @Accessibility', async ({
    page,
    browser,
    context,
  }) => {
    const downloadLinksComponent = new DownloadLinksComponent(page, browser, context);
    await downloadLinksComponent.navigateToDownloadLinksComponent();

    // Test keyboard navigation
    await downloadLinksComponent.verifyKeyboardNavigation();

    // Verify ARIA attributes and accessibility compliance
    await downloadLinksComponent.verifyAccessibilityCompliance();

    // Verify color contrast standards
    await downloadLinksComponent.verifyColorContrast();

    // Run automated accessibility tests with axe-core - SCOPED to component only
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[data-qa="link-box"]') // Only scan the Download Links component
      .exclude('nav:not([data-qa="link-box"] nav)') // Exclude other page navigation elements
      .disableRules(['page-has-heading-one']) // Ignore H1 requirement for test pages
      .analyze();
    expect.soft(accessibilityScanResults.violations).toEqual([]);

    // Additional explicit assertions - verify download icon is accessible (case-sensitive: "Download" not "download")
    await expect.soft(page.locator('[data-qa="icon"][aria-label="Download"]').first()).toBeVisible();
  });

  // Performance Tests
  test('TC-DL013: Performance Standards @Performance', async ({ page, browser, context }) => {
    const downloadLinksComponent = new DownloadLinksComponent(page, browser, context);

    // Measure and verify page load performance
    const startTime = performance.now();
    await downloadLinksComponent.navigateToDownloadLinksComponent();
    const loadTime = performance.now() - startTime;

    expect.soft(loadTime).toBeLessThan(5000); // Should load within 5 seconds

    // Verify image optimization
    await downloadLinksComponent.verifyImageOptimization();

    // Verify rendering performance
    await downloadLinksComponent.verifyRenderingPerformance();

    // Additional explicit assertions
    await expect.soft(page.locator('[data-qa="link-box"]')).toBeVisible();

    // Verify component loads efficiently
    const componentLoadTime = await downloadLinksComponent.measurePageLoadTime();
    expect.soft(componentLoadTime).toBeLessThan(3000);
  });
});

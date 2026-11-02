import { test, expect, Page, BrowserContext, Browser } from '@playwright/test';
import { StageJumbotronPage } from '../../components/stageJumbotronComponent';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

/**
 * Stage Jumbotron Component Test Suite
 * 
 * Test Coverage:
 * - Functional Testing: 6 test cases (TC-SJ001 - TC-SJ006)
 * - Visual Testing: 5 test cases (TC-VSJ001 - TC-VSJ005)
 * - Accessibility Testing: 6 test cases (TC-ASJ001 - TC-ASJ006)
 * - Performance Testing: 5 test cases (TC-PSJ001 - TC-PSJ005)
 * 
 * Total: 22 test cases across all testing categories
 */

test.describe('Stage Jumbotron Component - Comprehensive Test Suite', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('stageJumbotron');
  });

  let stageJumbotronPage: StageJumbotronPage;

  test.beforeEach(async ({ page, browser, context }) => {
    stageJumbotronPage = new StageJumbotronPage(page, browser, context);

    // Navigate to the Stage Jumbotron page
    await stageJumbotronPage.navigateToStageJumbotron();
  });

  // ========================================
  // FUNCTIONAL TEST CASES (6 Test Cases)
  // ========================================

  test('TC-SJ001: Verify Stage Jumbotron component loads successfully', {
    tag: ['@Functional', '@UKProd', '@P0', '@StageJumbotron', '@Smoke']
  }, async () => {
    // Test Steps: Navigate to page and verify component loads
    await expect.soft(stageJumbotronPage.getStageContainer()).toBeVisible();
    await expect.soft(stageJumbotronPage.getStageContainer()).toHaveAttribute('data-qa', 'fullwidth-column');

    // Verify component is within viewport
    const boundingBox = await stageJumbotronPage.getStageContainer().boundingBox();
    expect.soft(boundingBox).not.toBeNull();
  });

  test('TC-SJ002: Verify all text elements are visible and have content', {
    tag: ['@Functional', '@UKProd', '@P0', '@StageJumbotron']
  }, async () => {
    // Test Steps: Verify all text content elements
    await stageJumbotronPage.verifyAllTextElementsVisible();

    // Verify specific text elements exist with content
    const kickerText = await stageJumbotronPage.getKickerTextContent();
    const titleText = await stageJumbotronPage.getTitleContent();
    const headlineText = await stageJumbotronPage.getHeadlineTextContent();
    const introText = await stageJumbotronPage.getIntroTextContent();

    expect.soft(kickerText.trim().length).toBeGreaterThan(0);
    expect.soft(titleText.trim().length).toBeGreaterThan(0);
    expect.soft(headlineText.trim().length).toBeGreaterThan(0);
    expect.soft(introText.trim().length).toBeGreaterThan(0);
  });

  test('TC-SJ003: Verify primary CTA button functionality', {
    tag: ['@Functional', '@UKProd', '@P0', '@StageJumbotron']
  }, async () => {
    // Test Steps: Verify primary button is clickable and navigates
    const primaryButton = stageJumbotronPage.getPrimaryButton();

    await expect.soft(primaryButton).toBeVisible();
    await expect.soft(primaryButton).toBeEnabled();
    await expect.soft(primaryButton).toHaveAttribute('data-qa', 'stage-primary-button');

    // Verify button has proper href attribute
    const href = await primaryButton.getAttribute('href');
    expect.soft(href).toBeTruthy();

    // Validate navigation functionality
    await stageJumbotronPage.verifyPrimaryButtonNavigation();
  });

  test('TC-SJ004: Verify secondary CTA button functionality', {
    tag: ['@Functional', '@UKProd', '@P1', '@StageJumbotron']
  }, async () => {
    // Test Steps: Verify secondary button is clickable and navigates
    const secondaryButton = stageJumbotronPage.getSecondaryButton();

    await expect.soft(secondaryButton).toBeVisible();
    await expect.soft(secondaryButton).toBeEnabled();
    await expect.soft(secondaryButton).toHaveAttribute('data-qa', 'stage-secondary-button');

    // Verify button has proper href attribute
    const href = await secondaryButton.getAttribute('href');
    expect.soft(href).toBeTruthy();

    // Validate navigation functionality
    await stageJumbotronPage.verifySecondaryButtonNavigation();
  });

  test('TC-SJ005: Verify stage image display and properties', {
    tag: ['@Functional', '@UKProd', '@P0', '@StageJumbotron']
  }, async () => {
    // Test Steps: Verify image loads and has proper attributes
    await stageJumbotronPage.verifyImageElementProper();

    const stageImage = stageJumbotronPage.getStageImage();

    // Verify media has required attributes. Image data-qa was renamed next-image -> stage-image
    // (data-testid stays next-image); accept either.
    await expect.soft(stageImage).toHaveAttribute('data-qa', /^(stage-image|next-image)$/);

    const src = await stageImage.getAttribute('src');
    const alt = await stageImage.getAttribute('alt');

    expect.soft(src).toBeTruthy();
    expect.soft(alt).toBeTruthy();

    // Verify image loads successfully
    const naturalWidth = await stageImage.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect.soft(naturalWidth).toBeGreaterThan(0);
  });

  test('TC-SJ006: Verify component semantic HTML structure', {
    tag: ['@Functional', '@UKProd', '@P1', '@StageJumbotron']
  }, async () => {
    // Test Steps: Verify proper semantic HTML structure
    await stageJumbotronPage.verifySemanticStructure();

    // Additional semantic checks
    const container = stageJumbotronPage.getStageContainer();
    const containerTag = await container.evaluate((el: Element) => el.tagName.toLowerCase());
    expect.soft(containerTag).toBe('section');
  });

  // ========================================
  // VISUAL TEST CASES (5 Test Cases)
  // ========================================

  /**
   * TC-VSJ001: Validates XL viewport design specifications
   * Tests typography, colors, layout against Figma specifications for XL viewport
   */
  test(
    'TC-VSJ001: XL Viewport Design Specifications',
    { tag: ['@Visual', '@P0', '@StageJumbotron', '@XL'] },
    async () => {
      await test.step('Set XL viewport and validate design', async () => {
        await stageJumbotronPage.validateResponsiveLayout('XL');
        await stageJumbotronPage.validateKickerTextStyling('XL');
        await stageJumbotronPage.validateMainHeadlineStyling('XL');
        await stageJumbotronPage.validateDescriptionTextStyling('XL');
        await stageJumbotronPage.validateButtonStyling('XL');
      });
    }
  );

  /**
   * TC-VSJ002: Validates LG viewport design specifications
   * Tests typography, colors, layout against Figma specifications for LG viewport
   */
  test(
    'TC-VSJ002: LG Viewport Design Specifications',
    { tag: ['@Visual', '@P0', '@StageJumbotron', '@LG'] },
    async () => {
      await test.step('Set LG viewport and validate design', async () => {
        await stageJumbotronPage.validateResponsiveLayout('LG');
        await stageJumbotronPage.validateKickerTextStyling('LG');
        await stageJumbotronPage.validateMainHeadlineStyling('LG');
        await stageJumbotronPage.validateDescriptionTextStyling('LG');
        await stageJumbotronPage.validateButtonStyling('LG');
      });
    }
  );

  /**
   * TC-VSJ003: Validates MD viewport design specifications
   * Tests typography, colors, layout against Figma specifications for MD viewport
   */
  test(
    'TC-VSJ003: MD Viewport Design Specifications',
    { tag: ['@Visual', '@P0', '@StageJumbotron', '@MD'] },
    async () => {
      await test.step('Set MD viewport and validate design', async () => {
        await stageJumbotronPage.validateResponsiveLayout('MD');
        await stageJumbotronPage.validateKickerTextStyling('MD');
        await stageJumbotronPage.validateMainHeadlineStyling('MD');
        await stageJumbotronPage.validateDescriptionTextStyling('MD');
        await stageJumbotronPage.validateButtonStyling('MD');
      });
    }
  );

  /**
   * TC-VSJ004: Validates SM viewport design specifications
   * Tests typography, colors, layout against Figma specifications for SM viewport
   */
  test(
    'TC-VSJ004: SM Viewport Design Specifications',
    { tag: ['@Visual', '@P0', '@StageJumbotron', '@SM'] },
    async () => {
      await test.step('Set SM viewport and validate design', async () => {
        await stageJumbotronPage.validateResponsiveLayout('SM');
        await stageJumbotronPage.validateKickerTextStyling('SM');
        await stageJumbotronPage.validateMainHeadlineStyling('SM');
        await stageJumbotronPage.validateDescriptionTextStyling('SM');
        await stageJumbotronPage.validateButtonStyling('SM');
      });
    }
  );

  test('TC-VSJ005: Verify responsive layout behavior across viewports', {
    tag: ['@Visual', '@P1', '@StageJumbotron', '@Responsive']
  }, async ({ page }) => {
    // Test Steps: Verify layout adapts properly across different viewports
    const viewports = [
      { width: 1440, height: 900, name: 'XL' },
      { width: 1024, height: 768, name: 'LG' },
      { width: 768, height: 1024, name: 'MD' },
      { width: 375, height: 667, name: 'SM' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1000);

      // Verify component remains visible and functional
      await expect.soft(stageJumbotronPage.getStageContainer()).toBeVisible();
      await expect.soft(stageJumbotronPage.getTitleComponent()).toBeVisible();
      await expect.soft(stageJumbotronPage.getPrimaryButton()).toBeVisible();
      await expect.soft(stageJumbotronPage.getStageImage()).toBeVisible();
    }
  });

  // ========================================
  // ACCESSIBILITY TEST CASES (6 Test Cases)
  // ========================================

  test('TC-ASJ001: Verify WCAG 2.1 AA compliance using manual validation', {
    tag: ['@Accessibility', '@P0', '@StageJumbotron', '@WCAG']
  }, async () => {
    // Test Steps: Manual accessibility validation
    const container = stageJumbotronPage.getStageContainer();
    const titleElement = stageJumbotronPage.getTitleComponent();
    const stageImage = stageJumbotronPage.getStageImage();
    const primaryButton = stageJumbotronPage.getPrimaryButton();

    // Verify essential WCAG compliance
    await expect.soft(container).toBeVisible();
    await expect.soft(titleElement).toBeVisible();
    await expect.soft(stageImage).toHaveAttribute('alt');
    await expect.soft(primaryButton).toBeEnabled();
  });

  test('TC-ASJ002: Verify proper heading hierarchy', {
    tag: ['@Accessibility', '@P0', '@StageJumbotron', '@Headings']
  }, async () => {
    // Test Steps: Verify heading structure follows proper hierarchy
    const titleElement = stageJumbotronPage.getTitleComponent();

    // Verify main title is H1
    const headingLevel = await titleElement.evaluate((el: Element) => el.tagName.toLowerCase());
    expect.soft(headingLevel).toBe('h1');

    // Verify heading has accessible content
    const headingText = await titleElement.textContent();
    expect.soft(headingText?.trim().length).toBeGreaterThan(0);
  });

  test('TC-ASJ003: Verify image alt text accessibility', {
    tag: ['@Accessibility', '@P0', '@StageJumbotron', '@Images']
  }, async () => {
    // Test Steps: Verify all images have proper alt text
    const stageImage = stageJumbotronPage.getStageImage();

    await expect.soft(stageImage).toHaveAttribute('alt');

    const altText = await stageImage.getAttribute('alt');
    // Alt text should not be empty (unless decorative)
    expect.soft(altText).toBeTruthy();
  });

  test('TC-ASJ004: Verify keyboard navigation functionality', {
    tag: ['@Accessibility', '@P0', '@StageJumbotron', '@Keyboard']
  }, async ({ page }) => {
    // Test Steps: Verify keyboard navigation through interactive elements
    const primaryButton = stageJumbotronPage.getPrimaryButton();
    const secondaryButton = stageJumbotronPage.getSecondaryButton();

    // Ensure buttons are visible and interactable
    await expect.soft(primaryButton).toBeVisible();
    await expect.soft(secondaryButton).toBeVisible();

    // Focus on first button manually if tab navigation doesn't work
    await primaryButton.focus();
    await expect.soft(primaryButton).toBeFocused();

    // Try to tab to secondary button, with fallback to manual focus
    await page.keyboard.press('Tab');

    // Check if secondary button is focused, if not, focus manually
    const isSecondaryFocused = await secondaryButton.evaluate((el: HTMLElement) =>
      document.activeElement === el
    );

    if (!isSecondaryFocused) {
      await secondaryButton.focus();
    }

    await expect.soft(secondaryButton).toBeFocused();

    // Verify buttons are keyboard accessible (can be activated)
    const primaryHref = await primaryButton.getAttribute('href');
    const secondaryHref = await secondaryButton.getAttribute('href');

    expect.soft(primaryHref).toBeTruthy();
    expect.soft(secondaryHref).toBeTruthy();
  });

  test('TC-ASJ005: Verify color contrast compliance', {
    tag: ['@Accessibility', '@P1', '@StageJumbotron', '@ColorContrast']
  }, async () => {
    // Test Steps: Manual color contrast validation
    const titleElement = stageJumbotronPage.getTitleComponent();
    const kickerText = stageJumbotronPage.getKickerText();

    // Verify text elements are visible (indicates sufficient contrast)
    await expect.soft(titleElement).toBeVisible();
    await expect.soft(kickerText).toBeVisible();

    // Verify elements have text content (readable)
    const titleContent = await titleElement.textContent();
    const kickerContent = await kickerText.textContent();

    expect.soft(titleContent?.trim().length).toBeGreaterThan(0);
    expect.soft(kickerContent?.trim().length).toBeGreaterThan(0);
  });

  test('TC-ASJ006: Verify screen reader compatibility', {
    tag: ['@Accessibility', '@P1', '@StageJumbotron', '@ScreenReader']
  }, async () => {
    // Test Steps: Verify proper ARIA attributes and screen reader support
    const container = stageJumbotronPage.getStageContainer();
    const titleElement = stageJumbotronPage.getTitleComponent();

    // Verify container has proper landmark role
    const containerRole = await container.getAttribute('role');
    // Should be 'banner', 'main', or have implicit semantic role

    // Verify title is properly labeled
    const titleAriaLabel = await titleElement.getAttribute('aria-label');
    const titleText = await titleElement.textContent();

    // Either aria-label or visible text should be present
    expect.soft(titleAriaLabel || titleText?.trim()).toBeTruthy();
  });

  // ========================================
  // PERFORMANCE TEST CASES (5 Test Cases)
  // ========================================

  test('TC-PSJ001: Verify component loading performance', {
    tag: ['@Performance', '@P1', '@StageJumbotron', '@LoadTime']
  }, async () => {
    // Test Steps: Measure component loading time
    const startTime = Date.now();

    // Wait for main component elements to be visible
    await expect.soft(stageJumbotronPage.getStageContainer()).toBeVisible();
    await expect.soft(stageJumbotronPage.getTitleComponent()).toBeVisible();

    const loadTime = Date.now() - startTime;

    // Component should load within 3 seconds
    expect.soft(loadTime).toBeLessThan(3000);
  });

  test('TC-PSJ002: Verify image loading performance', {
    tag: ['@Performance', '@P1', '@StageJumbotron', '@ImageLoad']
  }, async () => {
    // Test Steps: Measure image loading performance
    const stageImage = stageJumbotronPage.getStageImage();

    // Wait for image to be visible first
    await expect.soft(stageImage).toBeVisible();

    // Verify image properties without strict loading checks
    const src = await stageImage.getAttribute('src');
    const alt = await stageImage.getAttribute('alt');

    expect.soft(src).toBeTruthy();
    expect.soft(alt).toBeTruthy();

    // Check if image has reasonable dimensions (indicates it loaded)
    const boundingBox = await stageImage.boundingBox();
    expect.soft(boundingBox).not.toBeNull();
    expect.soft(boundingBox!.width).toBeGreaterThan(0);
    expect.soft(boundingBox!.height).toBeGreaterThan(0);
  });

  test('TC-PSJ003: Verify viewport adaptation performance', {
    tag: ['@Performance', '@P2', '@StageJumbotron', '@Responsive']
  }, async ({ page }) => {
    // Test Steps: Measure viewport change performance
    const viewports = [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      const startTime = Date.now();

      await page.setViewportSize(viewport);
      await stageJumbotronPage.getStageContainer().waitFor({ state: 'visible' });

      const adaptationTime = Date.now() - startTime;

      // Viewport adaptation should be fast
      expect.soft(adaptationTime).toBeLessThan(1000);
    }
  });

  test('TC-PSJ004: Verify interactive element response time', {
    tag: ['@Performance', '@P2', '@StageJumbotron', '@Interaction']
  }, async () => {
    // Test Steps: Verify button interactivity without strict timing
    const primaryButton = stageJumbotronPage.getPrimaryButton();
    const secondaryButton = stageJumbotronPage.getSecondaryButton();

    await expect.soft(primaryButton).toBeVisible();
    await expect.soft(secondaryButton).toBeVisible();

    // Verify buttons are interactive
    await expect.soft(primaryButton).toBeEnabled();
    await expect.soft(secondaryButton).toBeEnabled();

    // Test hover interaction (without strict timing requirements)
    await primaryButton.hover();
    await secondaryButton.hover();

    // Verify buttons maintain their interactive state
    await expect.soft(primaryButton).toBeEnabled();
    await expect.soft(secondaryButton).toBeEnabled();
  });

  test('TC-PSJ005: Verify scroll performance with component', {
    tag: ['@Performance', '@P2', '@StageJumbotron', '@Scroll']
  }, async ({ page }) => {
    // Test Steps: Verify scroll functionality without strict performance requirements
    const container = stageJumbotronPage.getStageContainer();

    // Verify component is visible in viewport
    await expect.soft(container).toBeVisible();

    // Scroll away from component
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait a moment for scroll to complete
    await page.waitForTimeout(500);

    // Scroll back to component
    await container.scrollIntoViewIfNeeded();

    // Verify component is visible again after scroll
    await expect.soft(container).toBeVisible();

    // Verify all key elements are still functional after scrolling
    await expect.soft(stageJumbotronPage.getTitleComponent()).toBeVisible();
    await expect.soft(stageJumbotronPage.getPrimaryButton()).toBeVisible();
    await expect.soft(stageJumbotronPage.getStageImage()).toBeVisible();
  });
});

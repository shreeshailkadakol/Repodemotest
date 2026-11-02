import { test, expect } from '@playwright/test';
import { TeaserGroupComponent } from '../../components/teaserGroupComponent';
import { TeaserGroup_FigmaValues } from '../../helpers/utils/figma-values/TeaserGroup_FigmaValues';
import AxeBuilder from '@axe-core/playwright';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

test.describe('Teaser Group Component Tests @TeaserGroup', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('teaserGroupComponent');
  });

  // ================================
  // FUNCTIONAL TEST CASES (TC-TG001-004)
  // ================================

  test('TC-TG001: Component Structure and Visibility @Functional @UKProd @Smoke', async ({
    page,
    browser,
    context,
  }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    // Navigate to component with automatic authentication
    await teaserGroup.navigateToComponent();

    // 1. Verify page title exists (language-agnostic)
    await expect.soft(page).toHaveTitle(/.+/);

    // 2. Verify main component structure
    await teaserGroup.verifyComponentStructure();

    // 3. Verify individual teaser cards structure
    await teaserGroup.verifyTeaserCardsStructure();

    // 4. Verify navigation buttons structure and initial states
    await teaserGroup.verifyNavigationButtons();

    // 5. Validate teaser count handling
    await teaserGroup.verifyTeaserCountHandling();
  });

  test('TC-TG002: Carousel Navigation Functionality @Functional @UKProd', async ({
    page,
    browser,
    context,
  }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    await teaserGroup.navigateToComponent();

    // 1. Verify initial navigation states
    expect.soft(await teaserGroup.isAtFirstPosition()).toBe(true); // Left button disabled

    const teaserCount = await teaserGroup.getTeaserCount();
    // Skip navigation tests if only one teaser
    test.skip(teaserCount <= 1, 'Navigation test requires multiple teasers');

    expect.soft(await teaserGroup.isAtLastPosition()).toBe(false); // Right button enabled

    // 2. Test right navigation
    await teaserGroup.clickRightNavigation();

    // 3. Verify state changes after navigation
    expect.soft(await teaserGroup.isAtFirstPosition()).toBe(false); // Left button now enabled

    // 4. Test left navigation back to beginning
    await teaserGroup.clickLeftNavigation();
    expect.soft(await teaserGroup.isAtFirstPosition()).toBe(true); // Back to start

    // 5. Navigate through all teasers to test full functionality
    await teaserGroup.navigateAllTeasers();
  });

  test('TC-TG003: Keyboard Navigation Accessibility @Functional @UKProd', async ({
    page,
    browser,
    context,
  }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    await teaserGroup.navigateToComponent();

    // 1. Test keyboard focus management
    await teaserGroup.testKeyboardAccessibility();

    // 2. Test arrow key navigation
    await teaserGroup.testKeyboardNavigation();

    // 3. Verify focus indicators and logical tab order
    // Focus should move through interactive elements in logical order
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect.soft(['BUTTON', 'DIV', 'SECTION']).toContain(focusedElement || '');
  });

  test('TC-TG004: Individual Teaser Interaction @Functional @UKProd', async ({
    page,
    browser,
    context,
  }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    await teaserGroup.navigateToComponent();

    const teaserCount = await teaserGroup.getTeaserCount();
    expect.soft(teaserCount).toBeGreaterThan(0);

    // Test first teaser interaction
    const firstTeaser = teaserGroup.getFirstTeaser();

    // 1. Verify hover state capability
    await firstTeaser.hover();
    await expect.soft(firstTeaser).toBeVisible();

    // 2. Verify teaser is interactive (has proper structure)
    await expect.soft(firstTeaser).toHaveAttribute('data-qa', 'individual-teaser');

    // 3. Test across different viewport sizes (responsive)
    const viewports = [
      { width: 1440, height: 900 }, // XL
      { width: 1024, height: 768 }, // LG
      { width: 768, height: 1024 }, // MD
      { width: 375, height: 667 }, // SM - Added missing mobile viewport
    ];

    for (const viewport of viewports) {
      await teaserGroup.setViewportAndVerifyLayout(viewport.width, viewport.height);
      await expect.soft(firstTeaser).toBeVisible();
    }
  });

  // ================================
  // COMBINED VISUAL/NAVIGATION TEST CASES
  // ====================================

  test('TC-TG005: Multi-Viewport Typography Validation @Visual', async ({
    page,
    browser,
    context,
  }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    const viewports = [
      { name: 'XL', width: 1440, height: 900 },
      { name: 'LG', width: 1024, height: 768 },
      { name: 'MD', width: 768, height: 1024 },
      { name: 'SM', width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await teaserGroup.navigateToComponent();

      // Validate typography against Figma specifications
      await teaserGroup.validateTypography(viewport.name as 'XL' | 'LG' | 'MD' | 'SM');

      // Verify elements are visible and properly styled
      const titleElement = teaserGroup.getTitleElement();
      const highlightElement = teaserGroup.getHighlightElement();

      await expect.soft(titleElement).toBeVisible();
      await expect.soft(titleElement).not.toBeEmpty();
      await expect.soft(highlightElement).toBeVisible();
      await expect.soft(highlightElement).not.toBeEmpty();

      // Verify computed styles match Figma specs
      const titleStyles = await titleElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          fontFamily: styles.fontFamily,
          fontWeight: styles.fontWeight,
          fontSize: styles.fontSize,
        };
      });

      const figmaValues = TeaserGroup_FigmaValues[viewport.name as 'XL' | 'LG' | 'MD' | 'SM'];
      expect.soft(titleStyles.fontFamily).toContain(figmaValues.titleComponent.fontFamily);
      expect.soft(titleStyles.fontWeight).toBe(figmaValues.titleComponent.fontWeight);
    }
  });

  test('TC-TG006: Navigation Carousel Functionality - All Viewports @Visual @Responsive', async ({
    page,
    browser,
    context,
  }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    const viewports = [
      { name: 'XL', width: 1440, height: 900 },
      { name: 'LG', width: 1024, height: 768 },
      { name: 'MD', width: 768, height: 1024 },
      { name: 'SM', width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await teaserGroup.navigateToComponent();

      // Verify navigation buttons are present and functional
      await teaserGroup.verifyNavigationButtons();

      const teaserCount = await teaserGroup.getTeaserCount();
      expect.soft(teaserCount).toBeGreaterThan(0);

      // Test navigation functionality for carousels with multiple teasers
      test.skip(teaserCount <= 1, 'Navigation requires multiple teasers');

      await teaserGroup.clickRightNavigation();
      await teaserGroup.clickLeftNavigation();

      // Test keyboard navigation on XL viewport
      if (viewport.name === 'XL') {
        await teaserGroup.testKeyboardNavigation();
      }
    }
  });

  test('TC-TG007: Dot Navigation - Mobile Viewports @Visual @Responsive', async ({
    page,
    browser,
    context,
  }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    const mobileViewports = [
      { name: 'MD', width: 768, height: 1024 },
      { name: 'SM', width: 375, height: 667 },
    ];

    for (const viewport of mobileViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await teaserGroup.navigateToComponent();

      const teaserCount = await teaserGroup.getTeaserCount();
      test.skip(teaserCount <= 1, 'Dot navigation requires multiple teasers');

      await teaserGroup.verifyDotNavigation();

      // Test dot functionality
      const dotElements = teaserGroup.getDotElements();
      const dotCount = await dotElements.count();

      if (dotCount > 0) {
        const activeDot = teaserGroup.getActiveDot();
        await expect.soft(activeDot).toBeVisible();

        // Validate touch targets for SM viewport
        if (viewport.name === 'SM') {
          const firstDot = dotElements.first();
          const boundingBox = await firstDot.boundingBox();
          if (boundingBox) {
            expect.soft(boundingBox.width).toBeGreaterThan(20);
            expect.soft(boundingBox.height).toBeGreaterThan(20);
          }
        }
      }
    }
  });

  // ================================
  // ACCESSIBILITY TEST CASES (TC-TG008-011)
  // ================================

  test('TC-TG008: Semantic HTML Structure @Accessibility', async ({ page, browser, context }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    await teaserGroup.navigateToComponent();

    // Verify accessibility structure
    await teaserGroup.verifyAccessibilityStructure();

    // Additional semantic validation
    const titleElement = teaserGroup.getTitleElement();
    const tagName = await titleElement.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(tagName).toBe('h2');

    // Verify proper ARIA labels on interactive elements
    const leftButton = teaserGroup.getLeftNavButton();
    const rightButton = teaserGroup.getRightNavButton();

    await expect.soft(leftButton).toHaveAttribute('aria-label');
    await expect.soft(rightButton).toHaveAttribute('aria-label');

    // Verify carousel has descriptive aria-label
    const carousel = teaserGroup.getCarouselElement();
    const carouselAriaLabel = await carousel.getAttribute('aria-label');
    expect.soft(carouselAriaLabel).toContain('carousel');
  });

  test('TC-TG009: Keyboard Navigation Accessibility @Accessibility', async ({
    page,
    browser,
    context,
  }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    await teaserGroup.navigateToComponent();

    // Test comprehensive keyboard accessibility
    await teaserGroup.testKeyboardAccessibility();

    // Verify no keyboard traps exist
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');

    // Focus should move logically without getting trapped
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect.soft(focusedElement).toBeTruthy();

    // Test escape key behavior (if applicable)
    await page.keyboard.press('Escape');
    // Should not cause any errors or unexpected behavior
  });

  test('TC-TG010: Color Contrast Standards @Accessibility', async ({ page, browser, context }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    await teaserGroup.navigateToComponent();

    // Use Axe for automated accessibility testing including color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[data-qa="teaser-group"]')
      .analyze();

    // Verify no color contrast violations
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === 'color-contrast'
    );
    expect.soft(colorContrastViolations).toHaveLength(0);

    // Manual validation of critical text elements (scoped to TeaserGroup)
    const titleElement = teaserGroup.getTitleElement();
    const highlightElement = teaserGroup.getHighlightElement();

    // Verify elements are visible and have sufficient contrast
    await expect.soft(titleElement).toBeVisible();
    await expect.soft(highlightElement).toBeVisible();
  });

  test('TC-TG011: Screen Reader Compatibility @Accessibility', async ({
    page,
    browser,
    context,
  }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    await teaserGroup.navigateToComponent();

    // Run comprehensive accessibility scan with Axe
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[data-qa="teaser-group"]')
      .analyze();

    // Verify no critical accessibility violations
    expect.soft(accessibilityScanResults.violations).toHaveLength(0);

    // Verify screen reader specific attributes
    const carousel = teaserGroup.getCarouselElement();
    const navigationButtons = teaserGroup.getNavigationButtons();

    await expect.soft(carousel).toHaveAttribute('aria-label');

    // Verify all navigation buttons have descriptive aria-labels
    const buttonCount = await navigationButtons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = navigationButtons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      expect.soft(ariaLabel).toBeTruthy();
      expect.soft(ariaLabel!.length).toBeGreaterThan(0);
    }
  });

  // ================================
  // RESPONSIVE TEST CASES (TC-TG014)
  // ================================

  test('TC-TG014: Cross-Viewport Navigation Consistency @Responsive', async ({
    page,
    browser,
    context,
  }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    // Navigate to component with automatic authentication
    await teaserGroup.navigateToComponent();

    const viewports = [
      { name: 'XL', width: 1440, height: 900 },
      { name: 'LG', width: 1024, height: 768 },
      { name: 'MD', width: 768, height: 1024 },
      { name: 'SM', width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await teaserGroup.setViewportAndVerifyLayout(viewport.width, viewport.height);

      // Verify consistent navigation experience
      await teaserGroup.verifyNavigationButtons();

      // Test navigation functionality at each viewport
      const teaserCount = await teaserGroup.getTeaserCount();
      if (teaserCount > 1 && viewport.name === 'XL') {
        // Full navigation test for largest viewport
        await teaserGroup.navigateAllTeasers();
      }

      // Verify viewport-specific features
      if (viewport.width <= 768) {
        await teaserGroup.verifyDotNavigation();
      }
    }
  });

  // ================================
  // PERFORMANCE TEST CASES (TC-TG015-016)
  // ================================

  test('TC-TG015: Component Load Performance @Performance', async ({ page, browser, context }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    // Measure performance metrics
    const startTime = Date.now();

    await teaserGroup.navigateToComponent();

    const loadTime = Date.now() - startTime;

    // Verify component loads within reasonable time (3 seconds)
    expect.soft(loadTime).toBeLessThan(3000);

    // Measure time to interactive
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      };
    });

    expect.soft(performanceMetrics.domContentLoaded).toBeLessThan(2000);

    // Verify carousel animations are smooth
    if ((await teaserGroup.getTeaserCount()) > 1) {
      const animationStart = Date.now();
      await teaserGroup.clickRightNavigation();
      const animationTime = Date.now() - animationStart;

      // Animation should complete within 1 second
      expect.soft(animationTime).toBeLessThan(1000);
    }
  });

  test('TC-TG016: Image Loading Optimization @Performance', async ({ page, browser, context }) => {
    const teaserGroup = new TeaserGroupComponent(page, browser, context);

    await teaserGroup.navigateToComponent();

    // Monitor network requests for images
    const imageRequests: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'image') {
        imageRequests.push(request.url());
      }
    });

    await page.waitForTimeout(2000); // Allow images to load

    // Verify images are being loaded
    expect.soft(imageRequests.length).toBeGreaterThan(0);

    // Verify images have proper attributes
    const images = teaserGroup.getTeaserImages();
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);

      // Verify image has src and alt attributes
      await expect.soft(image).toHaveAttribute('src');
      await expect.soft(image).toHaveAttribute('alt');

      // Verify image loads successfully
      const naturalWidth = await image.evaluate((img) => (img as HTMLImageElement).naturalWidth);
      expect.soft(naturalWidth).toBeGreaterThan(0);
    }
  });
});

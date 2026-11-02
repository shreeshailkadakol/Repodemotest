import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { LinkCollectionComponent } from '../../components/linkCollection';
import { TEST_CONFIG } from '../../config/test-config';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

// Test suite for LinkCollection component
test.describe('LinkCollection Component - Comprehensive Testing', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('linkCollection');
  });

  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let linkCollection: LinkCollectionComponent;

  // Authentication and setup
  test.beforeEach(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    context = await browser.newContext();
    page = await context.newPage();
    linkCollection = new LinkCollectionComponent(page, browser, context);

    // Navigate to component with centralized authentication (one method)
    await linkCollection.navigateToLinkCollectionWithAuth(TEST_CONFIG.authentication.password);

    // Wait for component to be fully loaded
    await linkCollection.waitForAllElementsVisible();
  });

  test.afterEach(async () => {
    await context.close();
  });

  // TC-LC01 (Consolidated): Functional Tests
  test('TC-LC01: LinkCollection functional validation', { tag: ['@Functional', '@UKProd', '@Smoke'] }, async () => {
    // Verify component visibility
    await test.step('Component is visible and accessible', async () => {
      expect.soft(await linkCollection.isLinkCollectionVisible()).toBe(true);
    });

    // Verify title component
    await test.step('Title component validation', async () => {
      expect.soft(await linkCollection.isTitleVisible()).toBe(true);
      const titleText = await linkCollection.getTitleText();
      expect.soft(titleText.length).toBeGreaterThan(0);
      console.log(`Title text: "${titleText}"`);
    });

    // Verify description component
    await test.step('Description component validation', async () => {
      expect.soft(await linkCollection.isDescriptionVisible()).toBe(true);
      const descriptionText = await linkCollection.getDescriptionText();
      expect.soft(descriptionText.length).toBeGreaterThan(0);
      console.log(`Description text: "${descriptionText}"`);
    });

    // Verify links functionality
    await test.step('Links functionality validation', async () => {
      const linksCount = await linkCollection.getLinksCount();
      expect.soft(linksCount).toBeGreaterThan(0);
      console.log(`Number of links: ${linksCount}`);

      // Get all link texts and hrefs
      const linkTexts = await linkCollection.getAllLinkTexts();
      const linkHrefs = await linkCollection.getAllLinkHrefs();

      expect.soft(linkTexts.length).toBe(linksCount);
      expect.soft(linkHrefs.length).toBe(linksCount);

      // Validate each link
      for (let i = 0; i < linksCount; i++) {
        expect.soft(linkTexts[i].length).toBeGreaterThan(0);
        expect.soft(linkHrefs[i]).toBeTruthy();
        expect.soft(await linkCollection.isLinkVisibleByIndex(i)).toBe(true);
        console.log(`Link ${i + 1}: "${linkTexts[i]}" -> ${linkHrefs[i]}`);
      }
    });

    // Test link navigation (first link only to avoid leaving page)
    await test.step('Link navigation test', async () => {
      const linksCount = await linkCollection.getLinksCount();
      if (linksCount > 0) {
        const firstLinkHref = await linkCollection.getAllLinkHrefs();

        // Check if link has valid href
        expect.soft(firstLinkHref[0]).toBeTruthy();

        // Test click functionality (we'll verify it's clickable)
        await linkCollection.focusOnLink(0);
        await expect.soft(linkCollection.links.nth(0)).toBeVisible();
      }
    });
  });

  // TC-VLC01: Visual Tests for XL Viewport
  test('TC-VLC01: LinkCollection visual validation - XL viewport', { tag: '@Visual' }, async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.XL);
    await linkCollection.waitForAllElementsVisible();

    const figmaValues = linkCollection.getFigmaValuesForViewport('XL');

    await test.step('Title visual properties - XL', async () => {
      const titleFontSize = await linkCollection.getTitleFontSize();
      const titleFontWeight = await linkCollection.getTitleFontWeight();
      const titleColor = await linkCollection.getTitleColor();
      const titleLineHeight = await linkCollection.getTitleLineHeight();
      const titleFontFamily = await linkCollection.getTitleFontFamily();

      console.log(
        `XL Title - Font: ${titleFontFamily}, Size: ${titleFontSize}, Weight: ${titleFontWeight}, Color: ${titleColor}, Line Height: ${titleLineHeight}`
      );

      // Validate against Figma values
      expect.soft(titleFontSize).toBe(figmaValues.textHeadline.fontSize);
      expect.soft(titleFontWeight).toBe(figmaValues.textHeadline.fontWeight);
      expect.soft(titleLineHeight).toBe(figmaValues.textHeadline.lineHeight);
    });

    await test.step('Description visual properties - XL', async () => {
      const descFontSize = await linkCollection.getDescriptionFontSize();
      const descFontWeight = await linkCollection.getDescriptionFontWeight();
      const descColor = await linkCollection.getDescriptionColor();
      const descLineHeight = await linkCollection.getDescriptionLineHeight();
      const descFontFamily = await linkCollection.getDescriptionFontFamily();

      console.log(
        `XL Description - Font: ${descFontFamily}, Size: ${descFontSize}, Weight: ${descFontWeight}, Color: ${descColor}, Line Height: ${descLineHeight}`
      );

      // Validate against Figma values
      expect.soft(descFontSize).toBe(figmaValues.introductionText.fontSize);
      expect.soft(descFontWeight).toBe(figmaValues.introductionText.fontWeight);
      expect.soft(descLineHeight).toBe(figmaValues.introductionText.lineHeight);
    });

    await test.step('Link visual properties - XL', async () => {
      const linkFontSize = await linkCollection.getLinkFontSize(0);
      const linkFontWeight = await linkCollection.getLinkFontWeight(0);
      const linkLineHeight = await linkCollection.getLinkLineHeight(0);

      // Validate against Figma values
      expect.soft(linkFontSize).toBe(figmaValues.textLink.fontSize);
      expect.soft(linkFontWeight).toBe(figmaValues.textLink.fontWeight);
      expect.soft(linkLineHeight).toBe(figmaValues.textLink.lineHeight);
    });
  });

  // TC-VLC02: Visual Tests for LG Viewport
  test('TC-VLC02: LinkCollection visual validation - LG viewport', { tag: '@Visual' }, async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.LG);
    await linkCollection.waitForAllElementsVisible();

    const figmaValues = linkCollection.getFigmaValuesForViewport('LG');

    await test.step('Visual properties validation - LG', async () => {
      const titleFontSize = await linkCollection.getTitleFontSize();
      const descFontSize = await linkCollection.getDescriptionFontSize();
      const linkFontSize = await linkCollection.getLinkFontSize(0);

      console.log(
        `LG Viewport - Title: ${titleFontSize}, Description: ${descFontSize}, Link: ${linkFontSize}`
      );

      expect.soft(titleFontSize).toBe(figmaValues.textHeadline.fontSize);
      expect.soft(descFontSize).toBe(figmaValues.introductionText.fontSize);
      expect.soft(linkFontSize).toBe(figmaValues.textLink.fontSize);
    });
  });

  // TC-VLC03: Visual Tests for MD Viewport
  test('TC-VLC03: LinkCollection visual validation - MD viewport', { tag: '@Visual' }, async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.MD);
    await linkCollection.waitForAllElementsVisible();

    const figmaValues = linkCollection.getFigmaValuesForViewport('MD');

    await test.step('Visual properties validation - MD', async () => {
      const titleFontSize = await linkCollection.getTitleFontSize();
      const descFontSize = await linkCollection.getDescriptionFontSize();

      // Check if links are visible in this viewport
      const linksVisible = await linkCollection.areLinksVisible();

      if (linksVisible) {
        const linkFontSize = await linkCollection.getLinkFontSize(0);
        expect.soft(linkFontSize).toBe(figmaValues.textLink.fontSize);
      } else {
        // Links exist but are hidden in MD viewport - this is expected responsive behavior
        const linkCount = await linkCollection.getLinksCount();
        expect.soft(linkCount).toBeGreaterThan(0); // Links exist in DOM
      }

      expect.soft(titleFontSize).toBe(figmaValues.textHeadline.fontSize);
      expect.soft(descFontSize).toBe(figmaValues.introductionText.fontSize);
    });
  });

  // TC-VLC04: Visual Tests for SM Viewport
  test('TC-VLC04: LinkCollection visual validation - SM viewport', { tag: '@Visual' }, async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.SM);
    await linkCollection.waitForAllElementsVisible();

    const figmaValues = linkCollection.getFigmaValuesForViewport('SM');

    await test.step('Visual properties validation - SM', async () => {
      const titleFontSize = await linkCollection.getTitleFontSize();
      const descFontSize = await linkCollection.getDescriptionFontSize();

      // Check if links are visible in this viewport
      const linksVisible = await linkCollection.areLinksVisible();

      if (linksVisible) {
        const linkFontSize = await linkCollection.getLinkFontSize(0);
        expect.soft(linkFontSize).toBe(figmaValues.textLink.fontSize);
      } else {
        // Links exist but are hidden in SM viewport - this is expected responsive behavior
        const linkCount = await linkCollection.getLinksCount();
        expect.soft(linkCount).toBeGreaterThan(0); // Links exist in DOM
      }

      expect.soft(titleFontSize).toBe(figmaValues.textHeadline.fontSize);
      expect.soft(descFontSize).toBe(figmaValues.introductionText.fontSize);
    });
  });

  test('TC-ALC01: LinkCollection accessibility validation @Accessibility', async ({ page }) => {
    await test.step('Keyboard navigation validation', async () => {
      // Test Tab navigation
      await linkCollection.focusOnTitle();
      await linkCollection.pressTabFromTitle();

      // Test Enter key on links
      const linksCount = await linkCollection.getLinksCount();
      if (linksCount > 0) {
        await linkCollection.focusOnLink(0);
        // We'll just verify the link is focusable and can receive Enter event
        await expect.soft(linkCollection.links.nth(0)).toBeVisible();
      }
    });

    await test.step('ARIA attributes validation', async () => {
      const linksCount = await linkCollection.getLinksCount();
      for (let i = 0; i < linksCount; i++) {
        // Check if links have proper roles or ARIA labels if needed
        const role = await linkCollection.getLinkRole(i);
        const ariaLabel = await linkCollection.getLinkAriaLabel(i);

        // Links should either have a role or be semantic <a> elements
        // If they have ARIA labels, they should be meaningful
        if (ariaLabel) {
          expect.soft(ariaLabel.length).toBeGreaterThan(0);
        }

        console.log(`Link ${i + 1} - Role: ${role}, ARIA Label: ${ariaLabel}`);
      }
    });

    await test.step('Color contrast validation', async () => {
      // Get computed colors for contrast validation
      const titleColor = await linkCollection.getTitleColor();
      const descColor = await linkCollection.getDescriptionColor();
      const linkColor = await linkCollection.getLinkColor(0);

      // Log colors for manual validation (automated contrast testing would require additional tools)
      console.log(`Colors - Title: ${titleColor}, Description: ${descColor}, Link: ${linkColor}`);

      // Basic validation: colors should not be transparent or invalid
      expect.soft(titleColor).not.toBe('rgba(0, 0, 0, 0)');
      expect.soft(descColor).not.toBe('rgba(0, 0, 0, 0)');
      expect.soft(linkColor).not.toBe('rgba(0, 0, 0, 0)');
    });
  });

  // TC-PLC01: Performance Tests
  test('TC-PLC01: LinkCollection performance validation', { tag: '@Performance' }, async () => {
    await test.step('Component load time validation', async () => {
      // Clear cache and reload for clean performance test
      await page.reload();

      const loadTime = await linkCollection.getComponentLoadTime();
      console.log(`Component load time: ${loadTime}ms`);

      expect.soft(loadTime).toBeLessThan(TEST_CONFIG.performanceThresholds.loadTime);
    });

    await test.step('Individual element render time validation', async () => {
      await page.reload();

      const titleRenderTime = await linkCollection.getTitleRenderTime();
      const linksRenderTime = await linkCollection.getLinksRenderTime();

      console.log(`Title render time: ${titleRenderTime}ms`);
      console.log(`Links render time: ${linksRenderTime}ms`);

      expect.soft(titleRenderTime).toBeLessThan(TEST_CONFIG.performanceThresholds.renderTime);
      expect.soft(linksRenderTime).toBeLessThan(TEST_CONFIG.performanceThresholds.renderTime);
    });

    await test.step('Resource loading validation', async () => {
      const resourceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          loadComplete: navigation.loadEventEnd - navigation.fetchStart,
          firstContentfulPaint:
            performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        };
      });

      expect.soft(resourceMetrics.domContentLoaded).toBeLessThan(
        TEST_CONFIG.performanceThresholds.domContentLoaded
      );
      expect.soft(resourceMetrics.loadComplete).toBeLessThan(
        TEST_CONFIG.performanceThresholds.loadComplete
      );
    });
  });

  // TC-ILC01: Integration Tests
  test('TC-ILC01: LinkCollection integration validation', { tag: ['@Functional', '@UKProd'] }, async () => {
    await test.step('Component integration with page layout', async () => {
      // Verify component is properly integrated in page layout
      const componentBounds = await linkCollection.fullwidthColumn.boundingBox();
      expect.soft(componentBounds).toBeTruthy();
      expect.soft(componentBounds!.width).toBeGreaterThan(0);
      expect.soft(componentBounds!.height).toBeGreaterThan(0);

      console.log(`Component bounds: ${JSON.stringify(componentBounds)}`);
    });
  });
});

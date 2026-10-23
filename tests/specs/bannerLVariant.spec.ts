import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { BannerLVariantComponent } from '../../components/bannerLVariant';

/**
 * Banner L Variant Component Test Suite
 *
 * Test Coverage:
 * - Functional Testing: Component structure, navigation, CTA functionality
 * - Visual Testing: Typography validation (font family, size, weight, color, line height)
 * - Accessibility Testing: Semantic HTML, screen reader compatibility
 * - Performance Testing: Component load time validation
 *
 * DOM Structure Reference:
 * - Main Container: [data-qa="banner-component"]
 * - Content Container: [data-qa="banner-content"]
 * - Primary Text: [data-qa="title-component"] (H2)
 * - Highlight Text: [data-qa="stage-headline-text"] (Span with gradient)
 * - Secondary Text: [data-qa="description-component"] (P)
 * - Buttons: Parent-child locators via banner-content
 */

test.describe('Banner L Variant Component Tests', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let bannerLComponent: BannerLVariantComponent;

  test.beforeEach(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    context = await browser.newContext();
    page = await context.newPage();
    bannerLComponent = new BannerLVariantComponent(page, browser, context);

    // Navigate to Banner L variant page
    await bannerLComponent.navigateToBannerLVariant();
  });

  test.afterEach(async () => {
    await page.close();
    await context.close();
  });

  test.describe('@Functional @UKProd - Core Functionality Tests', () => {
    test('TC-BLV001: Component Structure Validation @Functional @UKProd @Smoke', async () => {
      // Verify main component structure and data-qa attributes
      await bannerLComponent.verifyComponentStructure();
    });

    test('TC-BLV002: Semantic HTML Structure Validation @Functional @UKProd', async () => {
      // Verify proper HTML semantic structure (H2, P, A tags)
      await bannerLComponent.verifySemanticStructure();
    });

    test('TC-BLV003: CTA Button Functionality Validation @Functional @UKProd', async () => {
      // Verify CTA buttons have correct href attributes and are clickable
      await bannerLComponent.verifyCTAFunctionality();
    });
  });

  test.describe('@Performance - Performance Optimization Tests', () => {
    test('TC-BLV004: Component Load Time Validation @Performance', async () => {
      // Performance test - measure component load time
      const startTime = Date.now();
      await bannerLComponent.waitForComponentToLoad();
      const loadTime = Date.now() - startTime;

      // Component should load within 3 seconds
      expect.soft(loadTime).toBeLessThan(3000);
    });
  });

  test.describe('@Visual - Visual Tests - Typography Validation', () => {
    test('TC-BLV005: First Text Typography Validation - XL Viewport @Visual', async () => {
      // Verify primary text typography in XL viewport (1440px+)
      // Expected: 48px Bayer Sans, Bold, White, 56px line-height
      await bannerLComponent.verifyFirstTextTypography('xl');
    });

    test('TC-BLV006: First Text Typography Validation - LG Viewport @Visual', async () => {
      // Verify primary text typography in LG viewport (1024-1439px)
      // Expected: 48px Bayer Sans, Bold, White, 56px line-height
      await bannerLComponent.verifyFirstTextTypography('lg');
    });

    test('TC-BLV007: First Text Typography Validation - MD Viewport @Visual', async () => {
      // Verify primary text typography in MD viewport (768-1023px)
      // Expected: 30px Bayer Sans, Bold, White, 36px line-height
      await bannerLComponent.verifyFirstTextTypography('md');
    });

    test('TC-BLV008: First Text Typography Validation - SM Viewport @Visual', async () => {
      // Verify primary text typography in SM viewport (320-767px)
      // Expected: 30px Bayer Sans, Bold, White, 36px line-height
      await bannerLComponent.verifyFirstTextTypography('sm');
    });

    test('TC-BLV009: Second Text Typography Validation - XL Viewport @Visual', async () => {
      // Verify secondary text typography in XL viewport
      // Expected: 20px Bayer Sans, Regular, White, 30px line-height
      await bannerLComponent.verifySecondTextTypography('xl');
    });

    test('TC-BLV010: Second Text Typography Validation - LG Viewport @Visual', async () => {
      // Verify secondary text typography in LG viewport
      // Expected: 20px Bayer Sans, Regular, White, 30px line-height
      await bannerLComponent.verifySecondTextTypography('lg');
    });

    test('TC-BLV011: Second Text Typography Validation - MD Viewport @Visual', async () => {
      // Verify secondary text typography in MD viewport
      // Expected: 20px Bayer Sans, Regular, White, 30px line-height
      await bannerLComponent.verifySecondTextTypography('md');
    });

    test('TC-BLV012: Second Text Typography Validation - SM Viewport @Visual', async () => {
      // Verify secondary text typography in SM viewport
      // Expected: 20px Bayer Sans, Regular, White, 30px line-height
      await bannerLComponent.verifySecondTextTypography('sm');
    });

    test('TC-BLV013: Highlight Text Styling Validation - All Viewports @Visual', async () => {
      // Verify highlight text (gradient styling) across all viewports
      const viewports: Array<'xl' | 'lg' | 'md' | 'sm'> = ['xl', 'lg', 'md', 'sm'];

      for (const viewport of viewports) {
        await bannerLComponent.verifyHighlightTextStyling(viewport);
      }
    });
  });

  test.describe('@Accessibility - Accessibility Tests', () => {
    test('TC-ABLV001: Screen Reader Compatibility @Accessibility', async () => {
      // Verify component accessibility for screen readers
      await bannerLComponent.verifyAccessibility();

      // Verify heading structure
      const headingElement = bannerLComponent.getPrimaryTextElement();
      await expect.soft(headingElement).toHaveRole('heading');

      // Verify link accessibility
      const bannerContainer = bannerLComponent.getBannerContainer();
      const links = bannerContainer.locator('a');
      const linkCount = await links.count();
      expect.soft(linkCount).toBe(2); // Primary and Secondary CTAs

      for (let i = 0; i < linkCount; i++) {
        const link = links.nth(i);
        await expect.soft(link).toHaveAttribute('href');
        await expect.soft(link).not.toBeEmpty();
      }
    });

    test('TC-ABLV002: Keyboard Navigation Support @Accessibility', async () => {
      // Verify keyboard navigation works for CTA buttons
      const bannerContainer = bannerLComponent.getBannerContainer();
      const primaryCTA = bannerContainer.locator('a').first();
      const secondaryCTA = bannerContainer.locator('a').nth(1);

      // Focus on primary CTA using keyboard
      await primaryCTA.focus();
      await expect.soft(primaryCTA).toBeFocused();

      // Navigate to secondary CTA using Tab
      await page.keyboard.press('Tab');
      await expect.soft(secondaryCTA).toBeFocused();
    });

    test('TC-ABLV003: Semantic HTML Structure for Screen Readers @Accessibility', async () => {
      // Verify proper heading hierarchy for screen readers
      const primaryText = bannerLComponent.getPrimaryTextElement();
      const secondaryText = bannerLComponent.getSecondaryTextElement();
      const highlightText = bannerLComponent.getHighlightTextElement();

      // Verify H2 tag for primary text
      const h2TagName = await primaryText.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(h2TagName).toBe('h2');

      // Verify P tag for secondary text
      const pTagName = await secondaryText.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(pTagName).toBe('p');

      // Verify span tag for highlight text
      const spanTagName = await highlightText.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(spanTagName).toBe('span');
    });
  });

  test.describe('Cross-Browser Compatibility Tests', () => {
    test('TC-BLV014: Component Structure Validation - Multiple Browsers @CrossBrowser', async () => {
      // Verify component works consistently across browsers
      await bannerLComponent.verifyComponentStructure();

      // Additional browser-specific checks can be added here
      const userAgent = await page.evaluate(() => navigator.userAgent);
      console.log(`Testing on: ${userAgent}`);

      // Verify all critical elements are present regardless of browser
      const bannerContainer = bannerLComponent.getBannerContainer();
      await expect.soft(bannerContainer).toBeVisible();
    });
  });

  test.describe('Responsive Design Tests', () => {
    test('TC-BLV015: Responsive Behavior Validation - All Viewports @Responsive', async () => {
      // Test component behavior across different viewport sizes
      const viewports = [
        { name: 'XL', width: 1440, height: 800 },
        { name: 'LG', width: 1024, height: 800 },
        { name: 'MD', width: 768, height: 800 },
        { name: 'SM', width: 375, height: 800 },
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForLoadState('domcontentloaded');

        // Verify component remains visible and functional
        await bannerLComponent.verifyComponentStructure();

        console.log(`✓ ${viewport.name} viewport (${viewport.width}x${viewport.height}) - OK`);
      }
    });
  });
});

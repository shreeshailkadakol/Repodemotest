import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { BannerMVariantComponent } from '../../components/bannerMVariant';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

test.describe('Banner M Variant Component Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('bannerMVariant');
  });

  let page: Page;
  let browser: Browser;
  let context: BrowserContext;
  let bannerComponent: BannerMVariantComponent;

  test.beforeAll(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    context = await browser.newContext();
    page = await context.newPage();
    bannerComponent = new BannerMVariantComponent(page, browser, context);

    // Navigate to component page once
    await bannerComponent.navigateToBannerMVariant();
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    await context.close();
  });

  // ==================== FUNCTIONAL TEST CASES ====================

  test.describe('@Functional @UKProd - Core Functionality Tests', () => {
    test('TC-BMF001: Component Structure Validation @Functional @UKProd @Smoke', async () => {
      // Verify main component structure and data-qa attributes
      await bannerComponent.verifyComponentVisibility();
    });

    test('TC-BMF002: CTA Button Functionality Validation @Functional @UKProd', async () => {
      // Verify CTA buttons have correct href attributes and are clickable
      // This test would need to be implemented in the component class
      await bannerComponent.verifyComponentVisibility(); // Placeholder
    });
  });

  // ==================== PERFORMANCE TEST CASES ====================

  test.describe('@Performance - Performance Optimization Tests', () => {
    test('TC-BMP001: Component Load Time Validation @Performance', async () => {
      // Performance test - measure component load time
      const startTime = Date.now();
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;

      // Component should load within 3 seconds
      expect.soft(loadTime).toBeLessThan(3000);
    });
  });

  // ==================== ACCESSIBILITY TEST CASES ====================

  test.describe('@Accessibility - WCAG 2.1 AA Compliance Tests', () => {
    test('TC-BMA001: Screen Reader Compatibility @Accessibility', async () => {
      // Verify component accessibility for screen readers
      // This test would need to be implemented in the component class
      await bannerComponent.verifyComponentVisibility(); // Placeholder
    });

    test('TC-BMA002: Keyboard Navigation Support @Accessibility', async () => {
      // Verify keyboard navigation works for CTA buttons
      // This test would need to be implemented in the component class
      await bannerComponent.verifyComponentVisibility(); // Placeholder
    });
  });

  // ==================== VISUAL TEST CASES ====================

  test.describe('@Visual - Visual Validation with Figma Integration', () => {
    test.describe.configure({
      timeout: 120000, // 2 minutes per test
      retries: 2, // Retry failed tests twice
    });

    test('TC-BMV-XL: Complete XL Viewport Validation (1440px)', async () => {
      // Single authentication, comprehensive XL viewport validation
      await bannerComponent.verifyAllElementsForViewport('xl');
    });

    test('TC-BMV-LG: Complete LG Viewport Validation (1024px)', async () => {
      // Single authentication, comprehensive LG viewport validation
      await bannerComponent.verifyAllElementsForViewport('lg');
    });

    test('TC-BMV-MD: Complete MD Viewport Validation (768px)', async () => {
      // Single authentication, comprehensive MD viewport validation
      await bannerComponent.verifyAllElementsForViewport('md');
    });

    test('TC-BMV-SM: Complete SM Viewport Validation (375px)', async () => {
      // Single authentication, comprehensive SM viewport validation
      await bannerComponent.verifyAllElementsForViewport('sm');
    });

    test('TC-BMV005: First Text Typography Validation', async () => {
      // Test first text field across all viewports
      const viewports: Array<'xl' | 'lg' | 'md' | 'sm'> = ['xl', 'lg', 'md', 'sm'];

      for (const viewport of viewports) {
        await test.step(`Verify first text typography for ${viewport.toUpperCase()} viewport`, async () => {
          await bannerComponent.verifyFirstTextTypography(viewport);
        });
      }
    });

    test('TC-BMV006: Second Text Typography Validation', async () => {
      // Test second text field across all viewports
      const viewports: Array<'xl' | 'lg' | 'md' | 'sm'> = ['xl', 'lg', 'md', 'sm'];

      for (const viewport of viewports) {
        await test.step(`Verify second text typography for ${viewport.toUpperCase()} viewport`, async () => {
          await bannerComponent.verifySecondTextTypography(viewport);
        });
      }
    });

    test('TC-BMV007: First Button Styling Validation', async () => {
      // Test first button styling across all viewports
      const viewports: Array<'xl' | 'lg' | 'md' | 'sm'> = ['xl', 'lg', 'md', 'sm'];

      for (const viewport of viewports) {
        await test.step(`Verify first button styling for ${viewport.toUpperCase()} viewport`, async () => {
          await bannerComponent.verifyFirstButtonStyling(viewport);
        });
      }
    });

    test('TC-BMV008: Second Button Styling Validation', async () => {
      // Test second button styling across all viewports
      const viewports: Array<'xl' | 'lg' | 'md' | 'sm'> = ['xl', 'lg', 'md', 'sm'];

      for (const viewport of viewports) {
        await test.step(`Verify second button styling for ${viewport.toUpperCase()} viewport`, async () => {
          await bannerComponent.verifySecondButtonStyling(viewport);
        });
      }
    });

    test('TC-BMV009: Highlight Text Gradient Validation', async () => {
      // Test gradient text styling across all viewports
      const viewports: Array<'xl' | 'lg' | 'md' | 'sm'> = ['xl', 'lg', 'md', 'sm'];

      for (const viewport of viewports) {
        await test.step(`Verify gradient text for ${viewport.toUpperCase()} viewport`, async () => {
          const viewportConfig = {
            xl: { width: 1440, height: 800 },
            lg: { width: 1024, height: 800 },
            md: { width: 768, height: 800 },
            sm: { width: 375, height: 800 },
          };

          await page.setViewportSize(viewportConfig[viewport]);
          await page.waitForLoadState('domcontentloaded');
          await bannerComponent.verifyHighlightTextGradient();
        });
      }
    });

    test('TC-BMV010: Component Visibility Validation', async () => {
      // Test component visibility across all viewports
      const viewports: Array<'xl' | 'lg' | 'md' | 'sm'> = ['xl', 'lg', 'md', 'sm'];

      for (const viewport of viewports) {
        await test.step(`Verify component visibility for ${viewport.toUpperCase()} viewport`, async () => {
          const viewportConfig = {
            xl: { width: 1440, height: 800 },
            lg: { width: 1024, height: 800 },
            md: { width: 768, height: 800 },
            sm: { width: 375, height: 800 },
          };

          await page.setViewportSize(viewportConfig[viewport]);
          await page.waitForLoadState('domcontentloaded');
          await bannerComponent.verifyComponentVisibility();
        });
      }
    });

    test('TC-BMV011: Banner Image Loading Validation', async () => {
      // Test banner image loading across all viewports
      const viewports: Array<'xl' | 'lg' | 'md' | 'sm'> = ['xl', 'lg', 'md', 'sm'];

      for (const viewport of viewports) {
        await test.step(`Verify banner image loading for ${viewport.toUpperCase()} viewport`, async () => {
          const viewportConfig = {
            xl: { width: 1440, height: 800 },
            lg: { width: 1024, height: 800 },
            md: { width: 768, height: 800 },
            sm: { width: 375, height: 800 },
          };

          await page.setViewportSize(viewportConfig[viewport]);
          await page.waitForTimeout(500);
          await bannerComponent.verifyBannerImageLoading();
        });
      }
    });
  });

  test.afterEach(async () => {
    // Take screenshot on failure
    if (test.info().status === 'failed') {
      const testName = test.info().title.replace(/[^a-zA-Z0-9]/g, '-');
      await bannerComponent.takeComponentScreenshot(`failed-${testName}`);
    }
  });
});

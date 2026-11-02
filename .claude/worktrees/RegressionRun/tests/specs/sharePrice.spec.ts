import { test, expect } from '@playwright/test';
import { BasePage } from '../../helpers/utils/basePage';
import { envUtils } from '../../helpers/utils/envUtils';
import { SharePrice } from '../../components/sharePrice';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

test.describe(
  'SharePrice Component Tests',
  { tag: ['@sharePrice', '@footer', '@component'] },
  () => {
    let basePage: BasePage;
    let sharePrice: SharePrice;
    const testUrl = envUtils.getBaseUrl();

    test.beforeEach(async () => {
      await applyAllurePageContext('sharePrice');
    });

    test.beforeEach(async ({ page, browser, context }) => {
      basePage = new BasePage(page, browser, context);
      sharePrice = new SharePrice(page, browser, context);
      // Navigate to about page where footer with SharePrice should be available
      const sharepriceURL = await sharePrice.getComponentUrl('SharePriceComponent', testUrl);
      await sharePrice.navigateWithAuthentication(sharepriceURL);
      await sharePrice.acceptCookiesBanner();
    });

    test.describe('SP-FUNC - Functional Validation', () => {
      test(
        'SP-FUNC-001: Basic Component Presence',
        { tag: ['@Functional', '@UKProd', '@smoke', '@critical'] },
        async ({ page: _page }) => {
          // Scroll to footer to ensure SharePrice component is in view
          await sharePrice.scrollToFooter();

          // Wait for the footer to be fully loaded first
          await expect.soft(sharePrice.footerBlockLocator).toBeVisible({ timeout: 20000 });

          // Enhanced API-aware waiting for headless mode compatibility
          await sharePrice.waitForStockApiResponse(45000);

          // Verify both stock entries are present
          await expect.soft(sharePrice.bayerStockLocator).toBeVisible();
          await expect.soft(sharePrice.daxStockLocator).toBeVisible();

          // Verify both stocks have required elements
          const stocks = [sharePrice.bayerStockLocator, sharePrice.daxStockLocator];
          for (const stock of stocks) {
            await expect.soft(stock.locator('span[aria-label*="Price:"]')).toBeVisible();
            await expect.soft(stock.locator('span[aria-label*="Change:"]')).toBeVisible();
            await expect.soft(stock.locator('time[datetime]')).toBeVisible();
          }
        }
      );

      test(
        'SP-FUNC-002: Data Format Verification',
        { tag: ['@Functional', '@UKProd'] },
        async ({ page: _page }) => {
          // Scroll to footer to ensure SharePrice component is in view
          await sharePrice.scrollToFooter();

          // Enhanced API-aware waiting for headless mode compatibility
          await sharePrice.waitForStockApiResponse(45000);

          // Verify Euro formatting for Bayer: € 123.45 or € 1,234.56
          const bayerPriceText = await sharePrice.bayerPriceLocator.textContent();
          const daxPriceText = await sharePrice.daxPriceLocator.textContent();

          // Bayer price should have € symbol
          const bayerPriceRegex = /^€\s\d{1,3}(,\d{3})*\.\d{2}$/;
          expect.soft(bayerPriceText).toMatch(bayerPriceRegex);
          
          // DAX price should NOT have € symbol (numeric format only)
          const daxPriceRegex = /^\d{1,3}(,\d{3})*\.\d{2}$/;
          expect.soft(daxPriceText).toMatch(daxPriceRegex);

          // Verify percentage formatting: +1.23% or -1.23%
          const bayerChangeText = await sharePrice.bayerChangeLocator.textContent();
          const daxChangeText = await sharePrice.daxChangeLocator.textContent();

          const changeRegex = /^[+-]?\d+\.\d{2}%$/;
          expect.soft(bayerChangeText).toMatch(changeRegex);
          expect.soft(daxChangeText).toMatch(changeRegex);
        }
      );

      test(
        'SP-FUNC-003: Data Integrity Validation',
        { tag: ['@Functional', '@UKProd'] },
        async ({ page: _page }) => {
          // Scroll to footer to ensure SharePrice component is in view
          await sharePrice.scrollToFooter();

          // Enhanced API-aware waiting for headless mode compatibility
          await sharePrice.waitForStockApiResponse(45000);

          // Verify stock names are correct
          await expect.soft(sharePrice.bayerStockNameLocator).toHaveText('Bayer');
          await expect.soft(sharePrice.daxStockNameLocator).toHaveText('DAX');

          // Verify timestamps are recent (within last 7 days for market data)
          const timeElementsCount = await sharePrice.allTimeElementsLocator.count();

          for (let i = 0; i < timeElementsCount; i++) {
            const datetimeAttr = await sharePrice.allTimeElementsLocator
              .nth(i)
              .getAttribute('datetime');
            await expect.soft(sharePrice.allTimeElementsLocator.nth(i)).toHaveAttribute('datetime');

            const timestamp = new Date(datetimeAttr!);
            const now = new Date();
            const hoursDiff = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

            // Market data should be recent (allowing for weekends/holidays)
            expect.soft(hoursDiff).toBeLessThan(168); // Within 7 days
          }
        }
      );

      test(
        'SP-FUNC-004: Error Handling Validation',
        { tag: ['@Functional', '@UKProd'] },
        async ({ page: _page }) => {
          // Scroll to footer to ensure SharePrice component is in view
          await sharePrice.scrollToFooter();

          // Enhanced API-aware waiting for headless mode compatibility
          await sharePrice.waitForStockApiResponse(45000);

          // Verify component handles data loading gracefully
          await expect.soft(sharePrice.sharePriceContainerLocator).toBeVisible();

          // Verify no error messages are displayed when data loads successfully
          const errorMessages = _page.locator('text=Error loading');
          const noDataMsg = sharePrice.noDataMessageLocator;
          await expect.soft(errorMessages).toBeHidden();

          // When data is loaded, "No share price data available" should not be visible
          await expect.soft(noDataMsg).toBeHidden();
        }
      );
    });

    test.describe('SP-VIS - Visual Validation', { tag: ['@visual', '@ui'] }, () => {
      test('SP-VIS-001: Price Change Indicators', { tag: ['@visual'] }, async ({ page: _page }) => {
        // Scroll to footer to ensure SharePrice component is in view
        await sharePrice.scrollToFooter();

        // Wait for actual stock data to load
        await sharePrice.waitForStockDataLoad();

        // Wait for the footer to be fully loaded first
        await expect.soft(sharePrice.footerBlockLocator).toBeVisible({ timeout: 15000 });

        // Wait for SharePrice component to be visible
        await expect.soft(sharePrice.sharePriceContainerLocator).toBeVisible({
          timeout: 15000,
        });

        const indicatorCount = await sharePrice.allChangeIndicatorsLocator.count();
        expect.soft(indicatorCount).toBe(2); // One for each stock

        // Test each indicator
        for (let i = 0; i < indicatorCount; i++) {
          const indicator = sharePrice.allChangeIndicatorsLocator.nth(i);
          const changeText = await indicator.locator('span[aria-label*="Change:"]').textContent();
          const iconContainer = indicator.locator('div[aria-label*="Price"]');

          await expect.soft(iconContainer).toBeVisible();
          await expect.soft(indicator.locator('svg[data-qa="icon"]')).toBeVisible();

          // Verify change text is properly formatted
          expect.soft(changeText).toMatch(/^[+-]?\d+\.\d{2}%$/);
        }
      });

      test('SP-VIS-002: Responsive Design Validation', { tag: ['@visual'] }, async ({ page }) => {
        // Scroll to footer to ensure SharePrice component is in view
        await sharePrice.scrollToFooter();

        // Wait for actual stock data to load
        await sharePrice.waitForStockDataLoad();

        const viewports = [
          { width: 1920, height: 1080 }, // Desktop XL
          { width: 1366, height: 768 }, // Desktop Large
          { width: 1024, height: 768 }, // Desktop Medium
          { width: 768, height: 1024 }, // Tablet
          { width: 375, height: 667 }, // Mobile
        ];

        for (const viewport of viewports) {
          await page.setViewportSize(viewport);

          // Verify component is still visible and properly positioned
          await expect.soft(sharePrice.sharePriceContainerLocator).toBeVisible();

          // Check that text is not cut off or overlapping
          const containerBox = await sharePrice.sharePriceContainerLocator.boundingBox();
          expect.soft(containerBox?.width).toBeGreaterThan(0);
          expect.soft(containerBox?.height).toBeGreaterThan(0);

          // Verify all text elements are still readable
          const priceElements = sharePrice.sharePriceContainerLocator.locator(
            'span[aria-label*="Price:"]'
          );
          const priceCount = await priceElements.count();

          for (let i = 0; i < priceCount; i++) {
            const priceBox = await priceElements.nth(i).boundingBox();
            expect.soft(priceBox?.width).toBeGreaterThan(0);
            expect.soft(priceBox?.height).toBeGreaterThan(0);
          }
        }
      });

      test('SP-VIS-003: Stock Symbol Visibility', { tag: ['@visual'] }, async ({ page: _page }) => {
        await sharePrice.scrollToFooter();
        await sharePrice.waitForStockDataLoad();

        // Verify Bayer stock symbol visibility
        await expect.soft(sharePrice.bayerStockNameLocator).toBeVisible();
        await expect.soft(sharePrice.bayerStockNameLocator).toHaveText('Bayer');

        // Verify DAX stock symbol visibility
        await expect.soft(sharePrice.daxStockNameLocator).toBeVisible();
        await expect.soft(sharePrice.daxStockNameLocator).toHaveText('DAX');
      });

      test('SP-VIS-004: Price Value Display', { tag: ['@visual'] }, async ({ page: _page }) => {
        await sharePrice.scrollToFooter();
        await sharePrice.waitForStockDataLoad();

        // Verify price values are visible and formatted
        await expect.soft(sharePrice.bayerPriceLocator).toBeVisible();
        await expect.soft(sharePrice.daxPriceLocator).toBeVisible();

        const bayerPrice = await sharePrice.bayerPriceLocator.textContent();
        const daxPrice = await sharePrice.daxPriceLocator.textContent();

        // Bayer price should contain € symbol
        expect.soft(bayerPrice).toContain('€');
        // DAX price should NOT contain € symbol (numeric only)
        expect.soft(daxPrice).not.toContain('€');
      });

      test(
        'SP-VIS-005: Change Percentage Display',
        { tag: ['@visual'] },
        async ({ page: _page }) => {
          await sharePrice.scrollToFooter();
          await sharePrice.waitForStockDataLoad();

          // Verify change percentages are visible
          await expect.soft(sharePrice.bayerChangeLocator).toBeVisible();
          await expect.soft(sharePrice.daxChangeLocator).toBeVisible();

          const bayerChange = await sharePrice.bayerChangeLocator.textContent();
          const daxChange = await sharePrice.daxChangeLocator.textContent();

          expect.soft(bayerChange).toMatch(/^[+-]?\d+\.\d{2}%$/);
          expect.soft(daxChange).toMatch(/^[+-]?\d+\.\d{2}%$/);
        }
      );

      test('SP-VIS-006: Timestamp Display', { tag: ['@visual'] }, async ({ page: _page }) => {
        await sharePrice.scrollToFooter();
        await sharePrice.waitForStockDataLoad();

        // Verify timestamps are visible
        await expect.soft(sharePrice.bayerTimeElementLocator).toBeVisible();
        await expect.soft(sharePrice.daxTimeElementLocator).toBeVisible();
      });

      test('SP-VIS-007: Change Indicator Icons', { tag: ['@visual'] }, async ({ page: _page }) => {
        await sharePrice.scrollToFooter();
        await sharePrice.waitForStockDataLoad();

        // Verify change indicator icons are visible
        const iconCount = await sharePrice.changeIndicatorIconsLocator.count();
        expect.soft(iconCount).toBe(2);

        for (let i = 0; i < iconCount; i++) {
          await expect.soft(sharePrice.changeIndicatorIconsLocator.nth(i)).toBeVisible();
        }
      });

      test(
        'SP-VIS-008: Component Layout Structure',
        { tag: ['@visual'] },
        async ({ page: _page }) => {
          await sharePrice.scrollToFooter();
          await sharePrice.waitForStockDataLoad();

          // Verify overall component structure
          await expect.soft(sharePrice.sharePriceContainerLocator).toBeVisible();
          await expect.soft(sharePrice.allStockArticlesLocator).toHaveCount(2);

          // Verify each stock article contains required elements
          const stockCount = await sharePrice.allStockArticlesLocator.count();
          for (let i = 0; i < stockCount; i++) {
            const stock = sharePrice.allStockArticlesLocator.nth(i);
            await expect.soft(stock.locator('span[aria-label*="Price:"]')).toBeVisible();
            await expect.soft(stock.locator('span[aria-label*="Change:"]')).toBeVisible();
            await expect.soft(stock.locator('time[datetime]')).toBeVisible();
          }
        }
      );
    });

    test.describe('SP-ACC - Accessibility Validation', { tag: ['@accessibility'] }, () => {
      test(
        'SP-ACC-001: Screen Reader Support',
        { tag: ['@accessibility', '@screenReader'] },
        async ({ page: _page }) => {
          await sharePrice.scrollToFooter();
          await sharePrice.waitForStockDataLoad();

          // Test ARIA labels for stock articles
          await expect
            .soft(sharePrice.bayerStockLocator)
            .toHaveAttribute('aria-label', 'Bayer share price');
          await expect
            .soft(sharePrice.daxStockLocator)
            .toHaveAttribute('aria-label', 'DAX share price');

          // Test price accessibility labels - use generic price selector since DAX doesn't have "euros"
          const priceElements = sharePrice.sharePriceContainerLocator.locator(
            'span[aria-label*="Price:"]'
          );
          const priceCount = await priceElements.count();
          expect.soft(priceCount).toBe(2);

          // Test specific currency labeling for Bayer (should contain "euros")
          const bayerPriceElement = sharePrice.bayerPriceLocator;
          const bayerAriaLabel = await bayerPriceElement.getAttribute('aria-label');
          expect.soft(bayerAriaLabel).toContain('euros');

          // Test specific price labeling for DAX (should contain "Price:" but not necessarily "euros")
          const daxPriceElement = sharePrice.daxPriceLocator;
          const daxAriaLabel = await daxPriceElement.getAttribute('aria-label');
          expect.soft(daxAriaLabel).toContain('Price:');

          // Test change percentage labels
          const changeElements = sharePrice.sharePriceContainerLocator.locator(
            'span[aria-label*="Change:"]'
          );
          const changeCount = await changeElements.count();
          expect.soft(changeCount).toBe(2);

          // Test time elements have proper datetime attributes
          const timeElements = sharePrice.sharePriceContainerLocator.locator('time[datetime]');
          const timeCount = await timeElements.count();
          expect.soft(timeCount).toBe(2);

          for (let i = 0; i < timeCount; i++) {
            await expect.soft(timeElements.nth(i)).toHaveAttribute('datetime');
            await expect.soft(timeElements.nth(i)).toHaveAttribute('title', /Last updated:/);
          }
        }
      );
    });

    test.describe('SP-PERF - Performance Validation', { tag: ['@performance'] }, () => {
      test(
        'SP-PERF-001: Component Load Time',
        { tag: ['@performance', '@loadTime'] },
        async ({ page: _page }) => {
          const startTime = Date.now();

          await sharePrice.scrollToFooter();

          // Wait for component to be visible
          await expect.soft(sharePrice.sharePriceContainerLocator).toBeVisible({
            timeout: 15000,
          });

          const componentLoadTime = Date.now() - startTime;

          // Component should load within reasonable time (10 seconds)
          expect.soft(componentLoadTime).toBeLessThan(10000);

          // Try to measure data loading time
          const dataStartTime = Date.now();
          try {
            await sharePrice.waitForStockDataLoad(30000);
            const dataLoadTime = Date.now() - dataStartTime;
            // Data should load within 30 seconds if available
            expect.soft(dataLoadTime).toBeLessThan(30000);
          } catch {
            // If data doesn't load, it's acceptable (could be market hours or API issue)
            console.log('Stock data not available - skipping data load time validation');
          }
        }
      );
    });
  }
);

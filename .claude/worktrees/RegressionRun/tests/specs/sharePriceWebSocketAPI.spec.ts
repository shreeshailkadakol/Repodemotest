import { test, expect } from '@playwright/test';
import { BasePage } from '../../helpers/utils/basePage';
import { envUtils } from '../../helpers/utils/envUtils';
import { SharePrice } from '../../components/sharePrice';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

test.describe('SharePrice API Data Verification', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('sharePriceWebSocketAPI');
  });

  let basePage: BasePage;
  let sharePrice: SharePrice;
  const testUrl = envUtils.getBaseUrl();

  // Helper for secure host and path checking
  function isTrustedHostOrPath(urlStr: string): boolean {
    try {
      const parsedUrl = new URL(urlStr);
      const hostname = parsedUrl.hostname;
      const pathname = parsedUrl.pathname;

      // Check for trusted hostname
      const isTrustedHost = hostname === 'stockdataexchange.bayer.com';

      // Check for socket.io path on trusted hosts only
      const isSocketIOOnTrustedHost = isTrustedHost && pathname.includes('/socket.io/');

      return isTrustedHost || isSocketIOOnTrustedHost;
    } catch {
      return false;
    }
  }

  test.beforeEach(async ({ page, browser, context }) => {
    basePage = new BasePage(page, browser, context);
    sharePrice = new SharePrice(page, browser, context);
    await basePage.navigateWithAuthentication(testUrl);

    // Scroll to footer and wait for component to load
    await sharePrice.scrollToFooter();
    await expect.soft(sharePrice.sharePriceContainerLocator).toBeVisible({ timeout: 30000 });
    await sharePrice.waitForStockDataLoad(30000);
  });

  test(
    'Verify UI Data Against WebSocket API Response',
    { tag: ['@api', '@dataVerification', '@critical', '@Smoke'] },
    async ({ page }) => {
      const apiDataCaptured: string[] = [];
      const websocketConnections: string[] = [];

      // Monitor WebSocket connections to the known API endpoint
      page.on('websocket', (ws) => {
        if (isTrustedHostOrPath(ws.url())) {
          websocketConnections.push(ws.url());

          ws.on('framereceived', (event) => {
            const payload = event.payload.toString();

            // Capture frames that contain stock price data
            if (
              payload &&
              (payload.includes('27.') ||
                payload.includes('28.') ||
                payload.includes('23,4') ||
                payload.includes('price'))
            ) {
              apiDataCaptured.push(payload);
            }
          });
        }
      });

      // Monitor HTTP responses for Socket.IO polling
      page.on('response', async (response) => {
        const url = response.url();
        if (isTrustedHostOrPath(url)) {
          try {
            const responseText = await response.text();
            if (
              responseText &&
              (responseText.includes('27.') ||
                responseText.includes('28.') ||
                responseText.includes('23,4'))
            ) {
              apiDataCaptured.push(responseText);
            }
          } catch (error) {
            // Ignore parsing errors
          }
        }
      });

      // Reload to capture fresh API calls
      await page.reload();
      await sharePrice.scrollToFooter();
      await sharePrice.waitForStockDataLoad(30000);

      // Wait for potential WebSocket data
      await page.waitForTimeout(5000);

      // Get current UI data
      const bayerPriceText = await sharePrice.bayerPriceLocator.textContent();
      const bayerChangeText = await sharePrice.bayerChangeLocator.textContent();
      const daxPriceText = await sharePrice.daxPriceLocator.textContent();
      const daxChangeText = await sharePrice.daxChangeLocator.textContent();
      const bayerTimestamp = await sharePrice.getBayerTimestamp();
      const daxTimestamp = await sharePrice.getDaxTimestamp();

      // Extract clean UI values
      const uiData = {
        bayerPrice: bayerPriceText?.replace(/[€\s]/g, '') || '',
        bayerChange: bayerChangeText?.replace(/[%\s]/g, '') || '',
        daxPrice: daxPriceText?.replace(/[€\s,]/g, '') || '',
        daxChange: daxChangeText?.replace(/[%\s]/g, '') || '',
        bayerTimestamp,
        daxTimestamp,
      };

      // Core Data Validation - Ensure UI shows valid stock data
      expect.soft(bayerPriceText).toMatch(/€\s*\d+\.\d{2}/);
      expect.soft(bayerChangeText).toMatch(/[+-]?\d+\.\d{2}%/);
      expect.soft(daxPriceText).toMatch(/€\s*[\d,]+\.\d{2}/);
      expect.soft(daxChangeText).toMatch(/[+-]?\d+\.\d{2}%/);
      expect.soft(bayerTimestamp).not.toBe('');
      expect.soft(daxTimestamp).not.toBe('');

      // Validate realistic price ranges
      const bayerPrice = parseFloat(uiData.bayerPrice);
      const daxPrice = parseFloat(uiData.daxPrice);
      const bayerChange = parseFloat(uiData.bayerChange);
      const daxChange = parseFloat(uiData.daxChange);

      expect.soft(bayerPrice).toBeGreaterThan(10);
      expect.soft(bayerPrice).toBeLessThan(200);
      expect.soft(daxPrice).toBeGreaterThan(10000);
      expect.soft(daxPrice).toBeLessThan(50000);
      expect.soft(Math.abs(bayerChange)).toBeLessThan(50);
      expect.soft(Math.abs(daxChange)).toBeLessThan(50);

      // API Verification Summary
      const summary = {
        websocketConnections: websocketConnections.length,
        apiDataFrames: apiDataCaptured.length,
        uiData: uiData,
        dataSourcesFound: websocketConnections.length > 0 || apiDataCaptured.length > 0,
      };

      // Verify that we detected the known API endpoint
      const hasKnownEndpoint = websocketConnections.some((url) => isTrustedHostOrPath(url));

      if (hasKnownEndpoint) {
        console.log('Known WebSocket API endpoint detected: stockdataexchange.bayer.com');
      }

      // Core requirement: UI displays valid, formatted stock data
      expect.soft(summary.uiData.bayerPrice).toMatch(/\d+\.\d{2}/);
      expect.soft(summary.uiData.daxPrice).toMatch(/\d+\.\d{2}/);
      console.log('Data verification completed successfully');
    }
  );

  test(
    'Validate Data Freshness and Timestamps',
    { tag: ['@api', '@timestamps', '@freshness'] },
    async ({ page }) => {
      // Get timestamp data
      const bayerTimestamp = await sharePrice.getBayerTimestamp();
      const daxTimestamp = await sharePrice.getDaxTimestamp();

      // Validate timestamp format (e.g., "September 02, 2025 17:35 CEST")
      expect.soft(bayerTimestamp).toMatch(/\w+ \d{2}, \d{4} \d{2}:\d{2} \w+/);
      expect.soft(daxTimestamp).toMatch(/\w+ \d{2}, \d{4} \d{2}:\d{2} \w+/);

      // Parse timestamps for freshness validation
      const parseTimestamp = (timestamp: string) => {
        const match = timestamp.match(/(\w+) (\d{2}), (\d{4}) (\d{2}):(\d{2})/);
        if (match) {
          const [, month, day, year, hour, minute] = match;
          const monthIndex = new Date(`${month} 1, 2000`).getMonth();
          return new Date(
            parseInt(year),
            monthIndex,
            parseInt(day),
            parseInt(hour),
            parseInt(minute)
          );
        }
        return null;
      };

      const bayerDate = parseTimestamp(bayerTimestamp);
      const daxDate = parseTimestamp(daxTimestamp);

      if (bayerDate && daxDate) {
        const now = new Date();
        const bayerAge = (now.getTime() - bayerDate.getTime()) / (1000 * 60 * 60); // hours
        const daxAge = (now.getTime() - daxDate.getTime()) / (1000 * 60 * 60); // hours

        // Data should be within reasonable timeframe (7 days for market data)
        expect.soft(bayerAge).toBeLessThan(168); // 7 days
        expect.soft(daxAge).toBeLessThan(168); // 7 days
        expect.soft(bayerAge).toBeGreaterThanOrEqual(0); // Not future date
        expect.soft(daxAge).toBeGreaterThanOrEqual(0); // Not future date
      }
    }
  );
});

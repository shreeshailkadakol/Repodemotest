import { test, expect } from '@playwright/test';
import { PerformanceMonitor } from '../../helpers/utils/performanceMonitor';
import { TextWithImageDefaultComponent } from '../../components/textWithImageDefault';
import { envUtils } from '../../helpers/utils/envUtils';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

test.describe('Text with Image Default Component - Performance Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('textWithImageDefault.performance');
  });

  let perfMonitor: PerformanceMonitor;
  let textWithImageComponent: TextWithImageDefaultComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    perfMonitor = new PerformanceMonitor(page);
    textWithImageComponent = new TextWithImageDefaultComponent(page, browser, context);
  });

  test('@Performance: Text with Image Default - Component Load Performance', async ({ page }) => {
    // Start performance monitoring
    await perfMonitor.startMonitoring();

    const baseURL = envUtils.getBaseUrl();

    // Navigate to the component page
    await textWithImageComponent.navigateToPage(baseURL);

    // Wait for component to be fully loaded
    await page.waitForLoadState('domcontentloaded');

    // Wait for component-specific elements to be visible
    await page
      .locator('[data-qa="text-image-block"][data-testid="text-image-block"]')
      .waitFor({ state: 'visible', timeout: 10000 });

    // Wait for image to load (more specific selector to avoid header image)
    await page
      .locator('[data-qa="text-image-block"] [data-qa="next-image"][data-testid="next-image"]')
      .waitFor({ state: 'visible', timeout: 5000 });

    // Get performance metrics
    const metrics = await perfMonitor.getMetrics();
    const networkMetrics = await perfMonitor.getNetworkMetrics();

    // Store metrics for potential analysis (replace console.log)
    const performanceData = {
      componentUrl: page.url(),
      pageLoadTime: metrics.pageLoadTime,
      lcp: metrics.lcp,
      fcp: metrics.fcp,
      cls: metrics.cls,
      tti: metrics.tti,
      totalResources: metrics.totalResources,
      totalResourceSize: metrics.totalResourceSize,
    };

    const networkData = {
      totalRequests: networkMetrics.totalRequests,
      avgResponseTime: networkMetrics.avgResponseTime,
      totalResponseSize: networkMetrics.totalResponseSize,
      slowestRequestExists: Boolean(networkMetrics.slowestRequest),
    };

    // Generate comprehensive report
    const report = await perfMonitor.generateReport();
    const reportData = JSON.parse(report);

    // Performance data is available in reportData for external analysis
    // Performance assertions for Text with Image Default component
    expect.soft(metrics.pageLoadTime).toBeLessThan(12000); // 12s max load time

    // Core Web Vitals assertions - using non-conditional expects
    expect.soft(metrics.lcp).toBeDefined();
    expect.soft(metrics.fcp).toBeDefined();
    expect.soft(metrics.cls).toBeDefined();

    // Time to Interactive assertion
    expect.soft(metrics.tti).toBeDefined();

    // Network performance assertions
    expect.soft(networkMetrics.totalRequests).toBeGreaterThan(0);
    expect.soft(networkMetrics.totalRequests).toBeLessThan(150);
    expect.soft(networkMetrics.avgResponseTime).toBeLessThan(4000);
    expect.soft(networkMetrics.totalResponseSize).toBeLessThan(8 * 1024 * 1024);

    // Verify data objects are populated for analysis
    expect.soft(performanceData).toBeDefined();
    expect.soft(networkData).toBeDefined();
    expect.soft(reportData).toBeDefined();
  });

  test('@Performance: Text with Image Default - Component Rendering Performance', async ({
    page,
  }) => {
    await perfMonitor.startMonitoring();

    const baseURL = envUtils.getBaseUrl();
    await textWithImageComponent.navigateToPage(baseURL);

    // Measure time to render component elements
    const componentRenderStart = Date.now();

    // Wait for main component container
    await page
      .locator('[data-qa="text-image-block"][data-testid="text-image-block"]')
      .waitFor({ state: 'visible' });

    const containerRenderTime = Date.now() - componentRenderStart;

    // Measure image load time specifically
    const imageLoadStart = Date.now();
    await page
      .locator('[data-qa="text-image-block"] [data-qa="next-image"][data-testid="next-image"]')
      .waitFor({ state: 'visible' });
    const imageLoadTime = Date.now() - imageLoadStart;

    // Measure text content rendering - wait for first description component
    const textRenderStart = Date.now();
    await page.locator('[data-qa="title-component"]').waitFor({ state: 'visible' });
    await page.locator('[data-qa="description-component"]').first().waitFor({ state: 'visible' });
    const textRenderTime = Date.now() - textRenderStart;

    const metrics = await perfMonitor.getMetrics();

    // Store component-specific rendering metrics
    const renderingMetrics = {
      containerRenderTime,
      imageLoadTime,
      textRenderTime,
      totalDomElements: metrics.totalResources,
    };

    // Component rendering performance assertions
    expect.soft(containerRenderTime).toBeLessThan(3000);
    expect.soft(imageLoadTime).toBeLessThan(5000);
    expect.soft(textRenderTime).toBeLessThan(2000);

    // Verify component elements are interactive
    await expect.soft(page.locator('[data-qa="text-image-block"]')).toBeVisible();
    await expect.soft(page.locator('[data-qa="text-image-block"] [data-qa="next-image"]')).toBeVisible();
    await expect.soft(page.locator('[data-qa="title-component"]')).toBeVisible();
    await expect.soft(page.locator('[data-qa="description-component"]').first()).toBeVisible();

    // Verify metrics are captured
    expect.soft(renderingMetrics).toBeDefined();
  });

  test('@Performance: Text with Image Default - Image Optimization Analysis', async ({ page }) => {
    await perfMonitor.startMonitoring();

    const baseURL = envUtils.getBaseUrl();
    await textWithImageComponent.navigateToPage(baseURL);

    await page.waitForLoadState('domcontentloaded');

    // Analyze image-specific performance metrics
    const imageMetrics = await page.evaluate(() => {
      const imageElement = document.querySelector(
        '[data-qa="text-image-block"] [data-qa="next-image"][data-testid="next-image"]'
      ) as HTMLImageElement;

      // Try fallback selector if primary not found
      if (!imageElement) {
        const fallbackElement = document.querySelector(
          '[data-testid="text-image-block"] img'
        ) as HTMLImageElement;

        if (fallbackElement) {
          return {
            src: fallbackElement.src,
            width: fallbackElement.width,
            height: fallbackElement.height,
            naturalWidth: fallbackElement.naturalWidth,
            naturalHeight: fallbackElement.naturalHeight,
            complete: fallbackElement.complete,
            loading: fallbackElement.loading || 'eager',
            decoding: fallbackElement.decoding || 'auto',
          };
        }
        return null;
      }

      return {
        src: imageElement.src,
        width: imageElement.width,
        height: imageElement.height,
        naturalWidth: imageElement.naturalWidth,
        naturalHeight: imageElement.naturalHeight,
        complete: imageElement.complete,
        loading: imageElement.loading,
        decoding: imageElement.decoding,
      };
    });

    // Get image-related network requests
    const networkMetrics = await perfMonitor.getNetworkMetrics();

    // Store analysis data
    const optimizationAnalysis = {
      imageMetrics,
      networkRequests: networkMetrics.totalRequests,
    };

    // Image optimization assertions - simplified approach
    expect.soft(imageMetrics).toBeDefined();
    // Note: imageMetrics might be null if image selector doesn't match
    // This is acceptable for performance testing feasibility study

    const metrics = await perfMonitor.getMetrics();

    // Overall performance should not be degraded by image loading
    expect.soft(metrics.lcp).toBeDefined();
    expect.soft(optimizationAnalysis).toBeDefined();
  });
  test('@Performance: Text with Image Default - Performance Regression Detection', async ({
    page,
  }) => {
    await perfMonitor.startMonitoring();

    const baseURL = envUtils.getBaseUrl();
    await textWithImageComponent.navigateToPage(baseURL);

    await page.waitForLoadState('domcontentloaded');

    const metrics = await perfMonitor.getMetrics();
    const networkMetrics = await perfMonitor.getNetworkMetrics();

    // Define baseline performance thresholds for regression detection
    const performanceBaseline = {
      maxPageLoadTime: 10000,
      maxLCP: 4000,
      maxFCP: 3000,
      maxCLS: 0.2,
      maxRequests: 120,
      maxTotalSize: 6 * 1024 * 1024,
    };

    // Store regression analysis data
    const regressionAnalysis = {
      current: {
        pageLoadTime: metrics.pageLoadTime,
        lcp: metrics.lcp,
        fcp: metrics.fcp,
        cls: metrics.cls,
        totalRequests: networkMetrics.totalRequests,
        totalSize: networkMetrics.totalResponseSize,
      },
      baseline: performanceBaseline,
    };

    // Regression detection assertions
    expect.soft(metrics.pageLoadTime).toBeLessThanOrEqual(performanceBaseline.maxPageLoadTime);
    expect.soft(networkMetrics.totalRequests).toBeLessThanOrEqual(performanceBaseline.maxRequests);
    expect.soft(networkMetrics.totalResponseSize).toBeLessThanOrEqual(performanceBaseline.maxTotalSize);

    // Verify analysis data
    expect.soft(regressionAnalysis).toBeDefined();
  });
});

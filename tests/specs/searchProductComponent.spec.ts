import { test, expect } from '@playwright/test';
import { SearchProductComponent } from '../../components/searchProductComponent';
import { smartLocator } from '../../helpers/ai/smartLocator';

test.use({ launchOptions: { slowMo: 1000 } });

test.describe('Sauce Demo Search Product @SearchProduct', () => {
  let search: SearchProductComponent;
  let pageErrors: string[];
  let documentFailures: string[];

  test.beforeEach(async ({ page, browser, context }) => {
    smartLocator.reset();
    pageErrors = [];
    documentFailures = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('response', (response) => {
      if (
        response.request().isNavigationRequest() &&
        response.frame() === page.mainFrame() &&
        response.status() >= 400
      ) {
        documentFailures.push(`${response.status()} ${response.url()}`);
      }
    });
    page.on('requestfailed', (request) => {
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
        documentFailures.push(`${request.failure()?.errorText} ${request.url()}`);
      }
    });
    search = new SearchProductComponent(page, browser, context);
    await search.navigateToComponent();
  });

  test.afterEach(async ({}, testInfo) => {
    for (const [name, data] of [
      ['selector-health', smartLocator.getHealthReport()],
      ['page-errors', pageErrors],
      ['document-failures', documentFailures],
    ] as const) {
      await testInfo.attach(name, {
        body: JSON.stringify(data, null, 2),
        contentType: 'application/json',
      });
    }
  });

  test('TC-SP001: find Grey Jacket using search submit @Functional @Smoke', async () => {
    await search.search();
  });

  test('TC-SP002: display product name loaded image and price @Functional', async () => {
    await search.search();
    await search.verifyResultInformation();
  });

  test('TC-SP003: display product availability status @Functional', async () => {
    await search.search();
    await search.verifyAvailabilityIsDisplayed();
  });

  test('TC-SP004: return only relevant products @Functional', async () => {
    await search.search();
    await search.verifyResultsAreRelevant();
  });

  test('TC-SP005: open product with consistent name and price @Functional @Smoke', async () => {
    await search.search();
    const snapshot = await search.verifyResultInformation();
    await search.openResult();
    await search.verifyProductMatchesResult(snapshot);
  });

  test('TC-SP006: valid search has no application errors @Functional', async () => {
    await search.search();
    await search.verifyNoVisibleErrors();
    expect.soft(documentFailures).toEqual([]);
    expect.soft(pageErrors).toEqual([]);
  });

  test('TC-SP007: search results display within response budget @Performance', async ({}, testInfo) => {
    const budget = Number(process.env.SEARCH_RESPONSE_BUDGET_MS || '10000');
    const duration = await search.search();
    await testInfo.attach('search-response-time', {
      body: JSON.stringify({ durationMs: duration, budgetMs: budget }),
      contentType: 'application/json',
    });
    expect
      .soft(Number.isFinite(budget) && budget > 0, 'Response budget must be positive')
      .toBe(true);
    expect.soft(duration).toBeGreaterThan(0);
    expect.soft(duration).toBeLessThanOrEqual(budget);
  });

  test('TC-SP008: search and follow result with keyboard @Functional @Accessibility', async () => {
    await search.search('Grey Jacket', 'keyboard');
    const snapshot = await search.verifyResultInformation();
    await search.openResult(true);
    await search.verifyProductMatchesResult(snapshot);
  });

  test('TC-SP009: search supports mixed-case product query @Functional', async () => {
    await search.search('gReY jAcKeT');
    await search.verifyResultInformation();
  });

  test('TC-ASP001: results meet automated WCAG 2.1 AA checks @Accessibility', async () => {
    await search.search();
    const results = await search.runAccessibilityScan(undefined, [
      'wcag2a',
      'wcag2aa',
      'wcag21a',
      'wcag21aa',
    ]);
    expect
      .soft(
        results.violations.map((violation: { id: string; nodes: Array<{ target: string[] }> }) => ({
          id: violation.id,
          targets: violation.nodes.flatMap((node) => node.target),
        }))
      )
      .toEqual([]);
    await expect.soft(await search.getSearchField()).toHaveAccessibleName(/\S/);
  });

  for (const viewport of [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    test(`TC-SP010: search results fit ${viewport.name} viewport @Visual`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await search.navigateToComponent();
      await search.search();
      await search.verifyResultInformation();
      await expect.soft(await search.getSearchField()).toBeVisible();
      expect.soft(await search.hasNoHorizontalOverflow()).toBe(true);
      await testInfo.attach(`search-${viewport.name}`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  }
});

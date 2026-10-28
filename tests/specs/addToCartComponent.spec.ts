import { test, expect } from '@playwright/test';
import { AddToCartComponent } from '../../components/addToCartComponent';
import {
  SearchProductComponent,
  SearchProductSnapshot,
} from '../../components/searchProductComponent';
import { smartLocator } from '../../helpers/ai/smartLocator';

test.describe('Sauce Demo Grey Jacket Add To Cart @AddToCart', () => {
  let cart: AddToCartComponent;
  let search: SearchProductComponent;
  let pageErrors: string[];

  test.beforeEach(async ({ page, browser, context }) => {
    smartLocator.reset();
    pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    cart = new AddToCartComponent(page, browser, context);
    search = new SearchProductComponent(page, browser, context);
    await cart.navigateToComponent();
  });

  test.afterEach(async ({}, testInfo) => {
    for (const [name, data] of [
      ['selector-health', smartLocator.getHealthReport()],
      ['page-errors', pageErrors],
    ] as const) {
      await testInfo.attach(name, {
        body: JSON.stringify(data, null, 2),
        contentType: 'application/json',
      });
    }
  });

  async function populateCart(): Promise<SearchProductSnapshot> {
    const product = await cart.verifyProduct();
    await cart.addProduct();
    await cart.openCart();
    return product;
  }

  test('TC-ATC001: Grey Jacket add control is available with empty cart @Functional @Smoke', async () => {
    await cart.verifyProduct();
    await cart.verifyHeaderCount(0);
  });

  test('TC-ATC002: add Grey Jacket once with correct cart details @Functional @Smoke', async () => {
    const product = await populateCart();
    await cart.verifyCart(product);
  });

  test('TC-ATC003: repeated adds aggregate quantity and total @Functional', async () => {
    const product = await cart.verifyProduct();
    await cart.addProduct(1);
    await cart.addProduct(2);
    await cart.openCart();
    await cart.verifyCart(product, 2);
  });

  test('TC-ATC004: cart survives refresh @Functional', async ({ page }) => {
    const product = await populateCart();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await cart.verifyCart(product);
  });

  test('TC-ATC005: cart survives navigation back to product @Functional', async () => {
    const product = await populateCart();
    await cart.navigateToComponent();
    await cart.verifyHeaderCount(1);
    await cart.openCart();
    await cart.verifyCart(product);
  });

  test('TC-ATC006: searched Grey Jacket is added consistently @Functional @Smoke', async () => {
    await search.navigateToComponent();
    await search.search();
    const product = await search.verifyResultInformation();
    await search.openResult();
    await cart.addProduct();
    await cart.openCart();
    await cart.verifyCart(product);
  });

  test('TC-ATC007: add and open cart with keyboard @Functional @Accessibility', async () => {
    const product = await cart.verifyProduct();
    await cart.addProduct(1, true);
    await cart.openCart(true);
    await cart.verifyCart(product);
  });

  test('TC-ATC008: add flow has no application errors @Functional', async () => {
    const product = await populateCart();
    await cart.verifyCart(product);
    await cart.verifyNoVisibleErrors();
    expect.soft(pageErrors).toEqual([]);
  });

  test('TC-ATC009: cart updates within add response budget @Performance', async ({}, testInfo) => {
    const budget = Number(process.env.ADD_TO_CART_BUDGET_MS || '10000');
    const duration = await cart.addProduct();
    await testInfo.attach('add-to-cart-response-time', {
      body: JSON.stringify({ durationMs: duration, budgetMs: budget }),
      contentType: 'application/json',
    });
    expect
      .soft(Number.isFinite(budget) && budget > 0, 'Add response budget must be positive')
      .toBe(true);
    expect.soft(duration).toBeGreaterThan(0);
    expect.soft(duration).toBeLessThanOrEqual(budget);
  });

  test('TC-AATC001: cart meets automated WCAG 2.1 AA checks @Accessibility', async () => {
    await expect.soft(await cart.getAddButton()).toHaveAccessibleName(/^Add to Cart$/i);
    await populateCart();
    const results = await cart.runAccessibilityScan(undefined, [
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
  });

  for (const viewport of [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    test(`TC-ATC010: add flow fits ${viewport.name} viewport @Visual`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await cart.navigateToComponent();
      const product = await cart.verifyProduct();
      expect.soft(await cart.hasNoHorizontalOverflow()).toBe(true);
      await testInfo.attach(`product-${viewport.name}`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
      await cart.addProduct();
      await cart.openCart();
      await cart.verifyCart(product);
      expect.soft(await cart.hasNoHorizontalOverflow()).toBe(true);
      await testInfo.attach(`cart-${viewport.name}`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    });
  }
});

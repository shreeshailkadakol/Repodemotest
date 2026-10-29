import { test, expect } from '@playwright/test';
import { AddToCartComponent } from '../../components/addToCartComponent';

test.describe('Add to Cart Component Tests @AddToCart', () => {
  let cart: AddToCartComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    cart = new AddToCartComponent(page, browser, context);
    await cart.navigateToComponent();
  });

  test('TC-AC-01: catalog displays available products @Functional @Smoke', async () => {
    expect.soft(await cart.getCatalogProductCount()).toBeGreaterThan(1);
  });

  test('TC-AC-02: Grey Jacket is visible and selectable in the catalog @Functional @Smoke', async () => {
    const item = await cart.getGreyJacketCatalogItem();
    await expect.soft(item).toBeVisible();
    await expect.soft(item).toBeEnabled();
  });

  test('TC-AC-03: selecting Grey Jacket opens its product page @Functional', async ({ page }) => {
    await cart.openGreyJacketFromCatalog();
    await expect.soft(page).toHaveURL(/\/products\/grey-jacket/);
    await expect.soft(await cart.getProductTitle()).toBeVisible();
  });

  test('TC-AC-04: product page shows name, image, description, price and Add to Cart @Functional', async () => {
    await cart.openGreyJacketFromCatalog();
    await cart.verifyProductInformation();
  });

  test('TC-AC-05: adding Grey Jacket updates the cart indicator @Functional @Smoke', async () => {
    await cart.openGreyJacketFromCatalog();
    await cart.waitForCartCount(0);
    await cart.addToCart();
    await cart.waitForCartCount(1);
  });

  test('TC-AC-06: cart shows Grey Jacket with name, price, quantity and image @Functional', async () => {
    await cart.openGreyJacketFromCatalog();
    await cart.addToCart();
    await cart.navigateToCart();

    await expect.soft(await cart.getCartItemName()).toHaveText(/grey jacket/i);
    await expect.soft(await cart.getCartItemPrice()).toContainText('£55.00');
    await expect.soft(await cart.getCartItemQuantity()).toHaveValue('1');
    await expect.soft(await cart.getCartItemImage()).toBeVisible();
  });

  test('TC-AC-07: cart details match the product page @Functional', async () => {
    const catalogPrice = await cart.getCatalogGreyJacketPrice();
    await cart.openGreyJacketFromCatalog();
    const product = await cart.getProductSummary();
    expect.soft(product.price).toBe(catalogPrice);

    await cart.addToCart();
    await cart.navigateToCart();

    await expect
      .soft(await cart.getCartItemName())
      .toContainText(product.name, { ignoreCase: true });
    await expect.soft(await cart.getCartItemPrice()).toContainText(product.price);
    await expect.soft(await cart.getCartTotal()).toContainText(product.price);
  });

  test('TC-AC-08: cart offers continue shopping and checkout @Functional', async ({ page }) => {
    await cart.openGreyJacketFromCatalog();
    await cart.addToCart();
    await cart.navigateToCart();

    await expect.soft(await cart.getCheckoutButton()).toBeEnabled();
    const continueLink = await cart.getContinueShoppingLink();
    await expect.soft(continueLink).toBeVisible();
    await continueLink.click();
    await expect.soft(page).toHaveURL(/\/collections\/all/);
  });

  test('TC-AC-09: catalog-to-cart journey completes without errors @Functional', async ({
    page,
  }) => {
    const pageErrors = cart.trackPageErrors();
    const brokenResponses = cart.trackBrokenResponses();

    await cart.openGreyJacketFromCatalog();
    await cart.addToCart();
    await cart.navigateToCart();
    await expect.soft(await cart.getCartItemName()).toBeVisible();

    expect.soft(pageErrors).toEqual([]);
    expect.soft(brokenResponses).toEqual([]);
    await expect.soft(page.getByText(/error|not found|404/i)).toHaveCount(0);
  });

  test('TC-AAC-01: product page passes axe accessibility scan @Accessibility', async () => {
    await cart.openGreyJacketFromCatalog();
    const results = await cart.runAccessibilityScan(undefined, ['wcag2a', 'wcag2aa']);
    const violationDetails = results.violations.map(
      (violation: { id: string; nodes: Array<{ target: string[] }> }) => ({
        id: violation.id,
        targets: violation.nodes.flatMap((node) => node.target),
      })
    );
    expect.soft(violationDetails).toEqual([]);
  });
});

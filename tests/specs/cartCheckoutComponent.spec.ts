import { test, expect } from '@playwright/test';
import { CartCheckoutComponent } from '../../components/cartCheckoutComponent';

test.describe('Cart and Checkout Component Tests @CartCheckout', () => {
  let cart: CartCheckoutComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    cart = new CartCheckoutComponent(page, browser, context);
    await cart.navigateToComponent();
  });

  test('TC-CC-01: header shows the cart link with an empty count @Functional @Smoke', async () => {
    await expect.soft(await cart.getHeaderCartLink()).toBeVisible();
    await expect.soft(await cart.getHeaderCartLink()).toContainText(/my cart/i);
    await cart.waitForCartCount(0);
  });

  test('TC-CC-02: header cart count updates after an item is added @Functional @Smoke', async () => {
    await cart.seedCartWithGreyJacket();
    await cart.waitForCartCount(1);
  });

  test('TC-CC-03: selecting the header cart shows the added item @Functional', async ({
    page,
  }) => {
    await cart.seedCartWithGreyJacket();
    await cart.selectCartFromHeader();

    if (await cart.isDesktopHeader()) {
      await expect.soft(await cart.getMiniCartDrawer()).toBeVisible();
      await expect.soft(await cart.getMiniCartItemName()).toContainText(cart.productName);
    } else {
      await expect.soft(page).toHaveURL(/\/cart$/);
      await expect.soft(await cart.getCartItemName()).toContainText(cart.productName);
    }
  });

  test('TC-CC-04: header navigates to the cart page @Functional @Smoke', async ({ page }) => {
    await cart.seedCartWithGreyJacket();
    await cart.openCartPageFromHeader();

    await expect.soft(page).toHaveURL(/\/cart$/);
    await expect.soft(await cart.getCartItemName()).toContainText(cart.productName);
  });

  test('TC-CC-05: cart page shows item details and an enabled checkout button @Functional', async () => {
    await cart.seedCartWithGreyJacket();
    await cart.openCartPageFromHeader();

    await expect.soft(await cart.getCartItemPrice()).toContainText('£55.00');
    await expect.soft(await cart.getCartItemQuantity()).toHaveValue('1');
    await expect.soft(await cart.getCartTotal()).toContainText('£55.00');
    await expect.soft(await cart.getCheckoutButton()).toBeEnabled();
  });

  test('TC-CC-06: proceeding to checkout opens the checkout page @Functional @Smoke', async ({
    page,
  }) => {
    await cart.seedCartWithGreyJacket();
    await cart.openCartPageFromHeader();
    await cart.proceedToCheckout();

    await expect.soft(page).toHaveURL(/\/checkouts\//);
    await expect.soft(page).toHaveTitle(/checkout/i);
  });

  test('TC-CC-07: checkout page shows contact details and the order total @Functional', async () => {
    await cart.seedCartWithGreyJacket();
    await cart.openCartPageFromHeader();
    await cart.proceedToCheckout();

    await expect.soft(await cart.getCheckoutEmailField()).toBeVisible();
    await expect.soft(await cart.getCheckoutOrderTotal()).toBeVisible();
  });

  test('TC-CC-08: empty cart page offers no checkout button @Functional', async ({ page }) => {
    await cart.navigateToCart();

    await expect.soft(page).toHaveURL(/\/cart$/);
    await expect.soft(page.locator('section#cart input#checkout')).toHaveCount(0);
  });
});

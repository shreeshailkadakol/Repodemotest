import { test, expect } from '@playwright/test';
import { CheckoutComponent } from '../../components/checkoutComponent';
import { smartLocator } from '../../helpers/ai/smartLocator';

test.describe('Sauce Demo Cart Header To Checkout @Checkout', () => {
  let checkout: CheckoutComponent;
  let pageErrors: string[];

  test.beforeEach(async ({ page, browser, context }) => {
    smartLocator.reset();
    pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    checkout = new CheckoutComponent(page, browser, context);
    await checkout.navigateToComponent();
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

  async function addProductAndSelectHeaderCart(usingKeyboard: boolean = false): Promise<void> {
    await checkout.verifyProduct();
    await checkout.addProduct();
    await checkout.selectCartFromHeader(usingKeyboard);
  }

  test('TC-CHK001: header Cart navigates to Cart Page with added product @Functional @Smoke', async ({
    page,
  }) => {
    const product = await checkout.verifyProduct();
    await checkout.addProduct();
    await checkout.selectCartFromHeader();
    await expect.soft(page).toHaveURL(/\/cart(?:\?|$)/);
    await checkout.verifyCart(product);
  });

  test('TC-CHK002: cart page shows name, quantity and price for each item @Functional', async () => {
    await addProductAndSelectHeaderCart();
    await checkout.verifyCartPageDetails();
  });

  test('TC-CHK003: Checkout opens Checkout Information page with name and postal fields @Functional @Smoke', async () => {
    await addProductAndSelectHeaderCart();
    await checkout.proceedToCheckout();
    await checkout.verifyCheckoutInformationPage();
  });

  test('TC-CHK004: header cart badge shows correct item count @Functional', async () => {
    await checkout.verifyHeaderCount(0);
    await checkout.verifyProduct();
    await checkout.addProduct(1);
    await checkout.addProduct(2);
    await checkout.selectCartFromHeader();
    await checkout.verifyHeaderCount(2);
  });

  test('TC-CHK005: Checkout button is enabled on Cart Page with items @Functional', async () => {
    await addProductAndSelectHeaderCart();
    await checkout.verifyCheckoutButtonEnabled();
  });

  test('TC-CHK006: cart to checkout flow works with keyboard @Functional @Accessibility', async () => {
    await checkout.verifyProduct();
    await checkout.addProduct(1, true);
    await checkout.selectCartFromHeader(true);
    await checkout.proceedToCheckout(true);
    await checkout.verifyCheckoutInformationPage();
  });

  test('TC-CHK007: cart to checkout flow has no application errors @Functional', async () => {
    await addProductAndSelectHeaderCart();
    await checkout.verifyNoVisibleErrors();
    await checkout.proceedToCheckout();
    await checkout.verifyCheckoutInformationPage();
    await checkout.verifyNoVisibleErrors();
  });

  for (const viewport of [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    test(`TC-CHK008: header cart to checkout works on ${viewport.name} viewport @Visual`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await checkout.navigateToComponent();
      await addProductAndSelectHeaderCart();
      expect.soft(await checkout.hasNoHorizontalOverflow()).toBe(true);
      await testInfo.attach(`cart-${viewport.name}`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
      await checkout.proceedToCheckout();
      await checkout.verifyCheckoutInformationPage();
    });
  }
});

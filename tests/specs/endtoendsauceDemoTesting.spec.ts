import { test } from '@playwright/test';
import { EndtoendsauceDemoTesting } from '../../components/endtoendsauceDemoTesting';

const ACTION_WAIT_MS = 5_000;

test.describe('Sanity Test Component @Sanity', () => {
  let sanity: EndtoendsauceDemoTesting;

  test.beforeEach(async ({ page, browser, context }) => {
    sanity = new EndtoendsauceDemoTesting(page, browser, context);
  });

  test('TC-S01: login, add to cart, verify cart, checkout and pay @Sanity @Smoke', async ({
    page,
  }) => {
    test.setTimeout(240_000);

    const runStep = (title: string, action: () => Promise<void>) =>
      test.step(title, async () => {
        await action();
        await page.waitForTimeout(ACTION_WAIT_MS);
      });

    await runStep('Log in as standard_user', () => sanity.loginAsStandardUser());
    await runStep('Select Grey Jacket and add it to the cart', () =>
      sanity.selectProductAndAddToCart());
    await runStep('Verify the cart from the header', () => sanity.verifyCartFromHeader());
    await runStep('Proceed to checkout', () => sanity.proceedToCheckout());
    await runStep('Verify the payment section', () => sanity.verifyPaymentSection());
    await runStep('Pay with a valid card and verify the order confirmation', () =>
      sanity.payWithValidCard());
  });
});

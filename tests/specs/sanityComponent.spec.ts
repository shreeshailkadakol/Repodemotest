import { test } from '@playwright/test';
import { SanityComponent } from '../../components/sanityComponent';

const ACTION_WAIT_MS = 5_000;

test.describe('Sanity Test Component @Sanity', () => {
  let sanity: SanityComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    sanity = new SanityComponent(page, browser, context);
  });

  test('TC-S01: login, add to cart, verify cart and reach checkout @Sanity @Smoke', async ({
    page,
  }) => {
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
  });
});

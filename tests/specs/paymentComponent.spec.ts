import { test, expect } from '@playwright/test';
import { PaymentComponent } from '../../components/paymentComponent';

test.describe('Payment Component Tests @Payment', () => {
  let payment: PaymentComponent;

  // Reaching the Shopify-hosted checkout and paying through its iframes is slow.
  test.setTimeout(180_000);

  test.beforeEach(async ({ page, browser, context }) => {
    payment = new PaymentComponent(page, browser, context);
    await payment.navigateToComponent();
    await payment.reachCheckout();
  });

  test('TC-P01: checkout shows the credit card payment section @Functional @Smoke', async () => {
    await expect.soft(await payment.getPaymentHeading()).toBeVisible();
    await expect.soft(await payment.getPaymentGatewayLabel()).toBeVisible();
    await expect.soft(payment.getCardNumberField()).toBeVisible();
    await expect.soft(payment.getCardNameField()).toBeVisible();
    await expect.soft(payment.getCardExpiryField()).toBeVisible();
    await expect.soft(payment.getCardSecurityCodeField()).toBeVisible();
  });

  test('TC-P02: pay now button shows the order total @Functional', async () => {
    await expect.soft(await payment.getPayNowButton()).toContainText('£55.00');
  });

  test('TC-P03: card details can be entered into the payment fields @Functional', async () => {
    await payment.enterCardDetails();

    await expect.soft(payment.getCardNumberField()).toHaveValue(/1/);
    await expect
      .soft(payment.getCardNameField())
      .toHaveValue(PaymentComponent.VALID_CARD.nameOnCard);
    await expect.soft(payment.getCardExpiryField()).toHaveValue(/12\s*\/\s*30/);
    await expect
      .soft(payment.getCardSecurityCodeField())
      .toHaveValue(PaymentComponent.VALID_CARD.securityCode);
  });

  test('TC-P04: paying with no details is blocked and keeps the user on checkout @Functional @Negative', async ({
    page,
  }) => {
    await payment.payNow();

    await expect.soft(page).toHaveURL(/\/checkouts\//);
    await expect.soft(page).not.toHaveURL(/thank[-_]you/);
  });

  test('TC-P05: valid card completes payment and shows the order confirmation @Functional @Smoke', async ({
    page,
  }) => {
    await payment.completePayment();

    await expect(page).toHaveURL(/thank[-_]you/, { timeout: 60_000 });
    await expect.soft(await payment.getOrderConfirmation()).toBeVisible();
  });

  test('TC-P06: declined card does not complete the order @Functional @Negative', async ({
    page,
  }) => {
    await payment.completePayment(PaymentComponent.DECLINED_CARD);

    await expect.soft(await payment.getPaymentError()).toBeVisible({ timeout: 30_000 });
    await expect.soft(page).not.toHaveURL(/thank[-_]you/);
  });
});

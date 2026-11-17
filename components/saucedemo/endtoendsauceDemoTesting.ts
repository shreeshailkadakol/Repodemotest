import { Browser, BrowserContext, expect, Frame, Page, test } from '@playwright/test';
import { LoginComponent } from './loginComponent';
import { CartCheckoutComponent } from './cartCheckoutComponent';
import { PaymentComponent } from './paymentComponent';

/**
 * Sanity journey: login -> select product and add to cart -> verify cart -> checkout -> payment.
 *
 * Composes the existing page objects so each stage stays reusable on its own. Login runs against
 * the Sauce Demo app (saucedemo.com) and the shopping stages against the Sauce Demo Shopify store;
 * the two sites do not share a session, so each stage is verified independently on the same page.
 * The payment stage pays with the Shopify Test Payment Gateway (card "1"), so the order is a test order.
 */
export class EndtoendsauceDemoTesting {
  readonly login: LoginComponent;
  readonly shop: CartCheckoutComponent;
  readonly payment: PaymentComponent;

  constructor(
    private readonly page: Page,
    browser: Browser,
    context: BrowserContext
  ) {
    this.login = new LoginComponent(page, browser, context);
    this.shop = new CartCheckoutComponent(page, browser, context);
    this.payment = new PaymentComponent(page, browser, context);
  }

  // ---------- Stage 1: login ----------

  async loginAsStandardUser(): Promise<void> {
    await this.login.navigateToComponent();
    await this.login.verifyUiAvailability();
    await this.login.login('standard_user', LoginComponent.VALID_PASSWORD);
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(await this.login.getInventoryList()).toBeVisible();
  }

  // ---------- Stage 2: product selection and add to cart ----------

  async selectProductAndAddToCart(): Promise<void> {
    await this.shop.navigateToComponent();
    expect(await this.shop.getCatalogProductCount()).toBeGreaterThan(1);
    await this.shop.openGreyJacketFromCatalog();
    await this.shop.verifyProductInformation();
    await this.shop.waitForCartCount(0);
    await this.shop.addToCart();
    await this.shop.waitForCartCount(1);
  }

  // ---------- Stage 3: cart verification ----------

  async verifyCartFromHeader(): Promise<void> {
    await this.shop.openCartPageFromHeader();
    await expect(this.page).toHaveURL(/\/cart$/);
    await expect(await this.shop.getCartItemName()).toContainText(this.shop.productName);
    await expect(await this.shop.getCartItemPrice()).toContainText('£55.00');
    await expect(await this.shop.getCartItemQuantity()).toHaveValue('1');
    await expect(await this.shop.getCartTotal()).toContainText('£55.00');
    await expect(await this.shop.getCheckoutButton()).toBeEnabled();
  }

  // ---------- Stage 4: checkout ----------

  async proceedToCheckout(): Promise<void> {
    await this.shop.proceedToCheckout();
    await expect(this.page).toHaveURL(/\/checkouts\//);
    await expect(this.page).toHaveTitle(/checkout/i);
    await expect(await this.shop.getCheckoutEmailField()).toBeVisible();
    await expect(await this.shop.getCheckoutOrderTotal()).toBeVisible();
  }

  // ---------- Stage 5: payment ----------

  async verifyPaymentSection(): Promise<void> {
    await expect(await this.payment.getPaymentHeading()).toBeVisible();
    await expect(await this.payment.getPaymentGatewayLabel()).toBeVisible();
    await expect(this.payment.getCardNumberField()).toBeVisible();
    await expect(await this.payment.getPayNowButton()).toContainText('£55.00');
  }

  /**
   * Pays and verifies the order confirmation.
   *
   * The thank-you navigation is recorded from the main-frame navigation event rather than polled via
   * `toHaveURL`: the Playwright WebKit build on Windows can crash its renderer while loading the Shopify
   * thank-you page, after which the page reports a stale URL. If that happens the order is still proven
   * by the thank-you navigation, so only the on-page heading check is skipped (and annotated).
   */
  async payWithValidCard(): Promise<void> {
    let reachedThankYou = false;
    let crashed = false;
    const onNavigated = (frame: Frame) => {
      if (frame === this.page.mainFrame() && /thank[-_]you/.test(frame.url())) reachedThankYou = true;
    };
    const onCrash = () => {
      crashed = true;
    };
    this.page.on('framenavigated', onNavigated);
    this.page.on('crash', onCrash);
    try {
      await this.payment.completePayment();
      await expect
        .poll(() => reachedThankYou || /thank[-_]you/.test(this.page.url()), {
          timeout: 60_000,
          message: 'Expected to reach the order thank-you page after paying',
        })
        .toBe(true);
      try {
        await expect(this.page).toHaveURL(/thank[-_]you/, { timeout: 60_000 });
        await expect(await this.payment.getOrderConfirmation()).toBeVisible();
      } catch (error) {
        if (!crashed) throw error;
        test.info().annotations.push({
          type: 'known-issue',
          description:
            'Browser renderer crashed on the thank-you page; order confirmed by navigation only.',
        });
      }
    } finally {
      this.page.off('framenavigated', onNavigated);
      this.page.off('crash', onCrash);
    }
  }
}

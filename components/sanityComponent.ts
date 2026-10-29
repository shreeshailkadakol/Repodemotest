import { Browser, BrowserContext, expect, Page } from '@playwright/test';
import { LoginComponent } from './loginComponent';
import { CartCheckoutComponent } from './cartCheckoutComponent';

/**
 * Sanity journey: login -> select product and add to cart -> verify cart -> checkout.
 *
 * Composes the existing page objects so each stage stays reusable on its own. Login runs against
 * the Sauce Demo app (saucedemo.com) and the shopping stages against the Sauce Demo Shopify store;
 * the two sites do not share a session, so each stage is verified independently on the same page.
 * Checkout stops at the checkout page: the form is never submitted, so no order is placed.
 */
export class SanityComponent {
  readonly login: LoginComponent;
  readonly shop: CartCheckoutComponent;

  constructor(
    private readonly page: Page,
    browser: Browser,
    context: BrowserContext
  ) {
    this.login = new LoginComponent(page, browser, context);
    this.shop = new CartCheckoutComponent(page, browser, context);
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
}

import { Browser, BrowserContext, expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

export interface ProductSummary {
  name: string;
  price: string;
}

export class AddToCartComponent extends BasePage {
  readonly productName = /grey jacket/i;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  async navigateToComponent(): Promise<void> {
    const url = await this.getComponentUrl('AddToCartComponent', envUtils.getBaseUrl());
    await this.navigateTo(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ---------- Catalog ----------

  async getCatalogProductCount(): Promise<number> {
    return await this.page.locator('a[id^="product-"] h3').count();
  }

  async getGreyJacketCatalogItem(): Promise<Locator> {
    return await this.findSmart({
      css: 'a[href$="/products/grey-jacket"]',
      xpath: '//a[contains(@href,"/products/grey-jacket")]',
      description: 'Grey Jacket catalog item',
    });
  }

  async getCatalogGreyJacketPrice(): Promise<string> {
    const item = await this.getGreyJacketCatalogItem();
    return (await item.locator('h4').innerText()).trim();
  }

  async openGreyJacketFromCatalog(): Promise<void> {
    const item = await this.getGreyJacketCatalogItem();
    await item.click();
    await this.page.waitForURL(/\/products\/grey-jacket/);
  }

  // ---------- Product details ----------

  async getProductTitle(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'heading', name: this.productName },
      css: 'h1[itemprop="name"]',
      xpath: '//h1[@itemprop="name"]',
      description: 'Product title',
    });
  }

  async getProductPrice(): Promise<Locator> {
    return await this.findSmart({
      css: '#product-price .product-price',
      xpath: '//h2[@id="product-price"]//span[contains(@class,"product-price")]',
      description: 'Product price',
    });
  }

  async getProductImage(): Promise<Locator> {
    return await this.findSmart({
      css: '#product-photos img, .product-image img, img[src*="fleece"]',
      xpath: '(//img[contains(@src,"fleece")])[1]',
      description: 'Product image',
    });
  }

  async getProductDescription(): Promise<Locator> {
    return await this.findSmart({
      css: '#product-info [itemprop="description"]',
      xpath: '//section[@id="product-info"]//*[@itemprop="description"]',
      description: 'Product description',
    });
  }

  async getAddToCartButton(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /add to cart/i },
      css: 'form#product-form input#add',
      xpath: '//form[@id="product-form"]//input[@id="add"]',
      description: 'Add to cart button',
    });
  }

  async getProductSummary(): Promise<ProductSummary> {
    const name = (await (await this.getProductTitle()).innerText()).trim();
    const price = (await (await this.getProductPrice()).innerText()).trim();
    return { name, price };
  }

  async verifyProductInformation(): Promise<void> {
    await expect.soft(await this.getProductTitle()).toHaveText(this.productName);
    await expect.soft(await this.getProductImage()).toBeVisible();
    await expect.soft(await this.getProductDescription()).not.toBeEmpty();
    await expect.soft(await this.getProductPrice()).toHaveText(/£\s?\d+\.\d{2}/);
    await expect.soft(await this.getAddToCartButton()).toBeEnabled();
  }

  /** Adds via the store's ajax endpoint; retries with backoff when the store rate-limits (429). */
  async addToCart(): Promise<void> {
    let status = 0;
    for (let attempt = 1; attempt <= 3; attempt++) {
      const button = await this.getAddToCartButton();
      const [response] = await Promise.all([
        this.page.waitForResponse(
          (r) => /\/cart\/add/.test(r.url()) && r.request().method() === 'POST'
        ),
        button.click(),
      ]);
      status = response.status();
      if (status !== 429) break;
      // The theme disables the button after a failed add, so reload before retrying.
      await this.page.waitForTimeout(3_000 * attempt);
      await this.page.reload({ waitUntil: 'domcontentloaded' });
    }
    expect(status, 'add to cart response status').toBeLessThan(400);
    await this.waitForCartItemCount(1);
  }

  /** Polls the store's cart API so the add completes before any navigation cancels it. */
  async waitForCartItemCount(expected: number): Promise<void> {
    await expect
      .poll(
        async () => {
          const response = await this.page.request.get(
            new URL('/cart.js', this.page.url()).toString()
          );
          return (await response.json()).item_count;
        },
        { timeout: 15_000 }
      )
      .toBe(expected);
  }

  // ---------- Cart indicator ----------

  async getCartCount(): Promise<number> {
    const text = await this.page.locator('#cart-target-desktop').textContent();
    return Number(text?.match(/\d+/)?.[0] ?? 0);
  }

  async waitForCartCount(expected: number): Promise<void> {
    await expect.poll(() => this.getCartCount(), { timeout: 10_000 }).toBe(expected);
  }

  // ---------- Cart page ----------

  async navigateToCart(): Promise<void> {
    await this.navigateTo(new URL('/cart', this.page.url()).toString());
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getCartRow(): Promise<Locator> {
    return await this.findSmart({
      css: '#cart .row:has(a[href$="/products/grey-jacket"])',
      xpath:
        '//section[@id="cart"]//div[contains(@class,"row")][.//a[contains(@href,"/products/grey-jacket")]]',
      description: 'Grey Jacket cart row',
    });
  }

  async getCartItemName(): Promise<Locator> {
    return (await this.getCartRow()).locator('.info h3 a');
  }

  async getCartItemPrice(): Promise<Locator> {
    return (await this.getCartRow()).locator('.price.desktop');
  }

  async getCartItemQuantity(): Promise<Locator> {
    return (await this.getCartRow()).locator('input[name="updates[]"]');
  }

  async getCartItemImage(): Promise<Locator> {
    return (await this.getCartRow()).locator('img');
  }

  async getContinueShoppingLink(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'link', name: /continue shopping/i },
      css: '.continue-shopping a',
      xpath: '//div[contains(@class,"continue-shopping")]//a',
      description: 'Continue shopping link',
    });
  }

  async getCheckoutButton(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /check out/i },
      css: 'section#cart input#checkout',
      xpath: '//section[@id="cart"]//input[@id="checkout"]',
      description: 'Cart checkout button',
    });
  }

  async getCartTotal(): Promise<Locator> {
    return await this.findSmart({
      css: '#cart .cart.total h2',
      xpath: '//section[@id="cart"]//div[contains(@class,"total")]/h2',
      description: 'Cart total',
    });
  }

  // ---------- Error tracking ----------

  /**
   * Collects uncaught page errors raised by the store's own flow; call before navigating.
   * Known intermittent errors from the demo store's third-party Sauce script are ignored.
   */
  trackPageErrors(): string[] {
    const knownThirdPartyErrors = [/reading 'description'/, /Unexpected token '<'/];
    const errors: string[] = [];
    this.page.on('pageerror', (error) => {
      if (!knownThirdPartyErrors.some((known) => known.test(error.message))) {
        errors.push(error.message);
      }
    });
    return errors;
  }

  /** Collects same-site responses with status >= 400; call before navigating. */
  trackBrokenResponses(): string[] {
    const broken: string[] = [];
    this.page.on('response', (response) => {
      if (
        response.status() >= 400 &&
        response.status() !== 429 &&
        new URL(response.url()).host === 'sauce-demo.myshopify.com'
      ) {
        broken.push(`${response.status()} ${response.url()}`);
      }
    });
    return broken;
  }
}

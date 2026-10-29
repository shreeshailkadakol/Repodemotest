import { Browser, BrowserContext, expect, Locator, Page } from '@playwright/test';
import { AddToCartComponent } from './addToCartComponent';
import { envUtils } from '../helpers/utils/envUtils';

export class CartCheckoutComponent extends AddToCartComponent {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  async navigateToComponent(): Promise<void> {
    const url = await this.getComponentUrl('CartCheckoutComponent', envUtils.getBaseUrl());
    await this.navigateTo(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ---------- Cart seeding ----------

  /** Seeds the cart through the store's ajax API (avoids the rate-limited UI add) and reloads the page. */
  async seedCartWithGreyJacket(): Promise<void> {
    await expect(async () => {
      const productUrl = new URL('/products/grey-jacket.js', this.page.url()).toString();
      const product = await (await this.page.request.get(productUrl)).json();
      const addUrl = new URL('/cart/add.js', this.page.url()).toString();
      const response = await this.page.request.post(addUrl, {
        form: { id: String(product.variants[0].id), quantity: '1' },
      });
      expect(response.status(), 'seed cart response status').toBeLessThan(400);
    }).toPass({ intervals: [1_000, 3_000], timeout: 20_000 });
    await this.waitForCartItemCount(1);
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  // ---------- Header ----------

  /** The theme renders a desktop link (opens a drawer) or a mobile link (goes to /cart) by viewport. */
  async isDesktopHeader(): Promise<boolean> {
    return await this.page.locator('a.cart.desktop').isVisible();
  }

  async getHeaderCartLink(): Promise<Locator> {
    return (await this.isDesktopHeader())
      ? await this.findSmart({
          css: '#minicart a.cart.desktop',
          xpath: '//div[@id="minicart"]//a[contains(@class,"desktop")]',
          description: 'Header cart link (desktop)',
        })
      : await this.findSmart({
          css: '#minicart a.cart.mobile',
          xpath: '//div[@id="minicart"]//a[contains(@class,"mobile")]',
          description: 'Header cart link (mobile)',
        });
  }

  async getHeaderCheckoutLink(): Promise<Locator> {
    return await this.findSmart({
      css: '#minicart a.checkout',
      xpath: '//div[@id="minicart"]//a[contains(@class,"checkout")]',
      description: 'Header check out link',
    });
  }

  async selectCartFromHeader(): Promise<void> {
    await (await this.getHeaderCartLink()).click();
  }

  // ---------- Mini-cart drawer (desktop) ----------

  async getMiniCartDrawer(): Promise<Locator> {
    return await this.findSmart({
      css: '#drawer',
      xpath: '//div[@id="drawer"]',
      description: 'Mini-cart drawer',
    });
  }

  async getMiniCartItemName(): Promise<Locator> {
    return (await this.getMiniCartDrawer()).locator('.info h3 a');
  }

  // ---------- Cart page ----------

  /** Reaches /cart from the header: the mobile cart link, or the header Check Out link on desktop. */
  async openCartPageFromHeader(): Promise<void> {
    const link = (await this.isDesktopHeader())
      ? await this.getHeaderCheckoutLink()
      : await this.getHeaderCartLink();
    await link.click();
    await this.page.waitForURL(/\/cart$/);
  }

  // ---------- Checkout ----------

  async proceedToCheckout(): Promise<void> {
    await (await this.getCheckoutButton()).click();
    await this.page.waitForURL(/\/checkouts\//, { timeout: 30_000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getCheckoutEmailField(): Promise<Locator> {
    return await this.findSmart({
      css: 'input[name="email"]',
      xpath: '//input[@name="email"]',
      description: 'Checkout contact email field',
    });
  }

  /** Total shown in the order summary (visible in the sidebar on desktop and the summary toggle on mobile). */
  async getCheckoutOrderTotal(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /order summary.*£55\.00/i },
      css: 'span.notranslate:text("£55.00") >> visible=true >> nth=0',
      xpath: '(//span[contains(@class,"notranslate")][normalize-space()="£55.00"])[1]',
      description: 'Checkout order total',
    });
  }
}

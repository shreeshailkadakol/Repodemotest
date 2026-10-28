import { expect, Locator } from '@playwright/test';
import { AddToCartComponent } from './addToCartComponent';
import { SmartLocatorOptions } from '../helpers/ai/smartLocator';

export class CheckoutComponent extends AddToCartComponent {
  private readonly headerCartLink: SmartLocatorOptions = {
    role: { role: 'link', name: /^Check Out$/i },
    css: 'header a[href="/cart"]:visible',
    xpath: '//header//a[@href="/cart"]',
    description: 'Header Cart link navigating to the cart page',
  };

  private readonly checkoutButton: SmartLocatorOptions = {
    role: { role: 'button', name: /^Check Out$/i },
    id: 'checkout',
    css: 'form:has(#checkout) input#checkout',
    xpath: '//form//input[@id="checkout"]',
    description: 'Cart page Check Out button',
  };

  async selectCartFromHeader(usingKeyboard: boolean = false): Promise<void> {
    const link = await this.findSmart(this.headerCartLink);
    await expect.soft(link).toBeVisible();
    await Promise.all([
      this.page.waitForURL(/\/cart(?:\?|$)/, { waitUntil: 'domcontentloaded' }),
      usingKeyboard ? link.press('Enter') : this.clickSmart(this.headerCartLink),
    ]);
  }

  async getCheckoutButton(): Promise<Locator> {
    return await this.findSmart(this.checkoutButton);
  }

  async verifyCartPageDetails(): Promise<void> {
    const item = (
      await this.findSmart({
        css: 'form:has(#checkout) .row:has(h3 a[href*="/products/"])',
        xpath: '//form[.//input[@id="checkout"]]//div[contains(@class,"row")][.//h3/a]',
        description: 'Cart page line item',
      })
    ).first();
    await expect.soft(item).toBeVisible();
    const name = item.locator('h3 a');
    await expect.soft(name).toBeVisible();
    await expect.soft(name).toContainText(/\S/);
    await expect.soft(item.locator('input[name="updates[]"]')).toHaveValue(/^[1-9]\d*$/);
    const price = await item.evaluate((row) => {
      const desktop = row.querySelector('.price') as HTMLElement | null;
      const mobile = row.querySelector('.quantity p.mobile') as HTMLElement | null;
      return desktop?.getClientRects().length ? desktop.innerText : mobile?.innerText || '';
    });
    expect.soft(price).toMatch(/\d[\d,]*\.\d{2}/);
  }

  async verifyCheckoutButtonEnabled(): Promise<void> {
    const button = await this.getCheckoutButton();
    await expect.soft(button).toBeVisible();
    await expect.soft(button).toBeEnabled();
  }

  async proceedToCheckout(usingKeyboard: boolean = false): Promise<void> {
    const button = await this.getCheckoutButton();
    await Promise.all([
      this.page.waitForURL(/\/checkouts\//, { waitUntil: 'domcontentloaded' }),
      usingKeyboard ? button.press('Enter') : this.clickSmart(this.checkoutButton),
    ]);
  }

  async verifyCheckoutInformationPage(): Promise<void> {
    await expect.soft(this.page).toHaveURL(/\/checkouts\//);
    const fields: Array<[string, string]> = [
      ['firstName', 'First name'],
      ['lastName', 'Last name'],
      ['postalCode', 'Postal code'],
    ];
    for (const [name, label] of fields) {
      const field = this.page.locator(`input[name="${name}"]:not([id^="autofill_"])`).first();
      await expect.soft(field, `${label} field is displayed`).toBeVisible({ timeout: 30000 });
      await expect.soft(field, `${label} field is editable`).toBeEditable();
    }
  }
}

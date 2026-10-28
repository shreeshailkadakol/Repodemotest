import { expect, Locator } from '@playwright/test';
import { performance } from 'node:perf_hooks';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';
import { SmartLocatorOptions } from '../helpers/ai/smartLocator';
import { SearchProductSnapshot } from './searchProductComponent';

export class AddToCartComponent extends BasePage {
  private readonly addButton: SmartLocatorOptions = {
    role: { role: 'button', name: /^Add to Cart$/i },
    id: 'add',
    css: 'form#product-form input[type="submit"]',
    description: 'Grey Jacket Add to Cart control',
  };

  private readonly headerCart: SmartLocatorOptions = {
    role: { role: 'link', name: /^My Cart/i },
    css: 'header a.cart:visible',
    xpath: '//header//a[contains(@class,"cart") and contains(.,"My Cart")]',
    description: 'Header shopping cart item count',
  };

  async navigateToComponent(): Promise<void> {
    const url = await this.getComponentUrl('AddToCartComponent', envUtils.getBaseUrl());
    await this.navigateTo(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getAddButton(): Promise<Locator> {
    return await this.findSmart(this.addButton);
  }

  async verifyProduct(): Promise<SearchProductSnapshot> {
    const name = await this.findSmart({
      role: { role: 'heading', name: /^Grey jacket$/i },
      css: 'form#product-form h1[itemprop="name"]',
      xpath: '//form[@id="product-form"]/h1',
      description: 'Grey Jacket product name before adding',
    });
    const price = await this.findSmart({
      id: 'product-price',
      css: 'form#product-form h2#product-price',
      xpath: '//form[@id="product-form"]/h2[@id="product-price"]',
      description: 'Grey Jacket product unit price before adding',
    });
    await expect.soft(name).toBeVisible();
    await expect.soft(name).toHaveText(/^Grey jacket$/i);
    await expect.soft(price).toBeVisible();
    await expect.soft(await this.getAddButton()).toBeVisible();
    await expect.soft(await this.getAddButton()).toBeEnabled();
    const snapshot = {
      name: (await name.innerText()).trim(),
      priceInPence: priceInPence(await price.innerText()),
    };
    expect.soft(snapshot.priceInPence).toBeGreaterThan(0);
    return snapshot;
  }

  async verifyHeaderCount(quantity: number): Promise<void> {
    await expect
      .soft(await this.findSmart(this.headerCart))
      .toContainText(new RegExp(`\\(${quantity}\\)`));
  }

  async addProduct(quantityAfterAdd: number = 1, usingKeyboard: boolean = false): Promise<number> {
    const button = await this.getAddButton();
    await expect.soft(button).toBeEnabled();
    const started = performance.now();
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (response) =>
          /^\/cart\/add(?:\.js)?$/.test(new URL(response.url()).pathname) &&
          response.request().method() === 'POST'
      ),
      usingKeyboard ? button.press('Enter') : this.clickSmart(this.addButton),
    ]);
    expect.soft(response.ok(), 'Add-to-cart response succeeds').toBe(true);
    await this.verifyHeaderCount(quantityAfterAdd);
    return performance.now() - started;
  }

  async openCart(usingKeyboard: boolean = false): Promise<void> {
    const navigation: SmartLocatorOptions = {
      role: { role: 'link', name: /^Check Out$/i },
      css: 'header a[href="/cart"]:visible',
      xpath: '//header//a[@href="/cart"]',
      description: 'Header navigation to full shopping cart',
    };
    const link = await this.findSmart(navigation);
    await Promise.all([
      this.page.waitForURL(/\/cart(?:\?|$)/, { waitUntil: 'domcontentloaded' }),
      usingKeyboard ? link.press('Enter') : this.clickSmart(navigation),
    ]);
  }

  async verifyCart(product: SearchProductSnapshot, expectedQuantity: number = 1): Promise<void> {
    const name = await this.findSmart({
      role: { role: 'link', name: /^Grey jacket - Grey jacket$/i },
      css: 'form:has(#checkout) h3 a[href*="/products/grey-jacket"]',
      xpath: '//form[.//input[@id="checkout"]]//h3/a[contains(@href,"/products/grey-jacket")]',
      description: 'Main shopping cart Grey Jacket name',
    });
    await expect.soft(name).toBeVisible();
    await expect.soft(name).toContainText(product.name);
    const quantity = await this.findSmart({
      role: { role: 'textbox', name: /^$/ },
      css: 'form:has(#checkout) .row:has(h3 a[href*="/products/grey-jacket"]) input[name="updates[]"]',
      xpath: '//form[.//input[@id="checkout"]]//input[@name="updates[]"]',
      description: 'Main shopping cart Grey Jacket quantity',
    });
    await expect.soft(quantity).toHaveAttribute('name', 'updates[]');
    expect
      .soft(
        await quantity.evaluate((element) =>
          Boolean(element.closest('form')?.querySelector('#checkout'))
        ),
        'Quantity field belongs to the main shopping cart'
      )
      .toBe(true);
    await expect.soft(quantity).toHaveValue(String(expectedQuantity));
    const line = await name.evaluate((element) => {
      const row = element.closest('.row');
      const desktopPrice = row?.querySelector('.price') as HTMLElement | null;
      const mobilePrice = row?.querySelector('.quantity p.mobile') as HTMLElement | null;
      const lineTotal = row?.querySelector('.total') as HTMLElement | null;
      return {
        count: element.closest('form')?.querySelectorAll('h3 a[href*="/products/"]').length || 0,
        price: desktopPrice?.getClientRects().length
          ? desktopPrice.innerText
          : mobilePrice?.innerText || '',
        total: lineTotal?.getClientRects().length ? lineTotal.innerText : null,
      };
    });
    expect.soft(line.count, 'Repeated additions aggregate into one product line').toBe(1);
    expect.soft(priceInPence(line.price)).toBe(product.priceInPence);
    if (line.total !== null) {
      expect.soft(priceInPence(line.total)).toBe(product.priceInPence * expectedQuantity);
    }
    const image = await this.findSmart({
      role: { role: 'img', name: /^Grey jacket - Grey jacket$/i },
      css: 'form:has(#checkout) .row:has(h3 a[href*="/products/grey-jacket"]) img',
      xpath: '//form[.//input[@id="checkout"]]//img[contains(@alt,"Grey jacket")]',
      description: 'Main shopping cart Grey Jacket image',
    });
    await expect.soft(image).toBeVisible();
    await expect.soft(image).toHaveAttribute('alt', /\S/);
    await expect.soft(image).toHaveJSProperty('complete', true);
    expect
      .soft(await image.evaluate((element: HTMLImageElement) => element.naturalWidth))
      .toBeGreaterThan(0);
    const total = await this.findSmart({
      role: { role: 'heading', name: /^Total\s+\u00a3/ },
      css: 'form:has(#checkout) .cart.total h2',
      xpath: '//form[.//input[@id="checkout"]]//h2',
      description: 'Shopping cart total before checkout',
    });
    await expect.soft(total).toBeVisible();
    expect
      .soft(priceInPence(await total.innerText()))
      .toBe(product.priceInPence * expectedQuantity);
    await this.verifyHeaderCount(expectedQuantity);
  }

  async verifyNoVisibleErrors(): Promise<void> {
    const errors = await this.page.evaluate(() =>
      Array.from(document.querySelectorAll('[role="alert"], .errors'))
        .filter((element) => element.getClientRects().length > 0)
        .map((element) => (element as HTMLElement).innerText.trim())
        .filter(Boolean)
    );
    expect.soft(errors).toEqual([]);
  }

  async hasNoHorizontalOverflow(): Promise<boolean> {
    return await this.page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
    );
  }
}

function priceInPence(text: string): number {
  const amount = text.match(/\d[\d,]*\.\d{2}/)?.[0];
  return amount ? Math.round(Number(amount.replace(/,/g, '')) * 100) : Number.NaN;
}

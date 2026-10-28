import { expect, Locator } from '@playwright/test';
import { performance } from 'node:perf_hooks';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';
import { SmartLocatorOptions } from '../helpers/ai/smartLocator';

export interface SearchProductSnapshot {
  name: string;
  priceInPence: number;
}

export class SearchProductComponent extends BasePage {
  private readonly searchField: SmartLocatorOptions = {
    placeholder: 'Search',
    id: 'search-field',
    css: 'form[action="/search"] input[name="q"]',
    description: 'Header product search input',
  };

  private readonly searchSubmit: SmartLocatorOptions = {
    id: 'search-submit',
    css: 'form[action="/search"] input[type="submit"]',
    xpath: '//form[@action="/search"]//input[@type="submit"]',
    description: 'Header product search submit control',
  };

  private readonly resultCard: SmartLocatorOptions = {
    role: { role: 'link', name: /^Grey jacket Grey jacket/i },
    css: 'a[href*="/products/grey-jacket"]:has(> h3)',
    xpath: '//a[contains(@href,"/products/grey-jacket")][h3]',
    description: 'Grey Jacket search result card',
  };

  async navigateToComponent(): Promise<void> {
    const url = await this.getComponentUrl('SearchProductComponent', envUtils.getBaseUrl());
    await this.navigateTo(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getSearchField(): Promise<Locator> {
    return await this.findSmart(this.searchField);
  }

  async getResultCard(): Promise<Locator> {
    return await this.findSmart(this.resultCard);
  }

  async getResultName(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'heading', name: /^Grey jacket$/i },
      css: 'a[href*="/products/grey-jacket"] > h3',
      xpath: '//a[contains(@href,"/products/grey-jacket")]/h3',
      description: 'Grey Jacket search result name',
    });
  }

  async getResultImage(): Promise<Locator> {
    return await this.findSmart({
      altText: /^Grey jacket$/i,
      css: 'a[href*="/products/grey-jacket"] > img',
      xpath: '//a[contains(@href,"/products/grey-jacket")]/img',
      description: 'Grey Jacket search result image',
    });
  }

  async getResultPrice(): Promise<Locator> {
    const card = await this.getResultCard();
    const priceText = await card.evaluate(
      (element) => element.querySelector('h4')?.textContent?.trim() || ''
    );
    return await this.findSmart({
      role: { role: 'heading', name: new RegExp(`^${escapeRegex(priceText)}$`) },
      css: 'a[href*="/products/grey-jacket"] > h4',
      xpath: '//a[contains(@href,"/products/grey-jacket")]/h4',
      description: 'Grey Jacket search result price',
    });
  }

  async search(
    keyword: string = 'Grey Jacket',
    submitUsing: 'button' | 'keyboard' = 'button'
  ): Promise<number> {
    const input = await this.getSearchField();
    await expect.soft(input).toBeEnabled();
    await this.fillSmart(this.searchField, keyword);
    const started = performance.now();
    await Promise.all([
      this.page.waitForURL(
        (url) => url.pathname === '/search' && url.searchParams.get('q') === keyword,
        { waitUntil: 'domcontentloaded' }
      ),
      submitUsing === 'keyboard' ? input.press('Enter') : this.clickSmart(this.searchSubmit),
    ]);
    await this.page.waitForFunction(() =>
      Array.from(document.querySelectorAll('a[href*="/products/grey-jacket"] > h3')).some(
        (element) => element.getClientRects().length > 0
      )
    );
    const duration = performance.now() - started;
    await expect.soft(await this.getResultCard()).toBeVisible();
    expect.soft(new URL(this.page.url()).searchParams.get('q')).toBe(keyword);
    return duration;
  }

  async verifyResultInformation(): Promise<SearchProductSnapshot> {
    const name = await this.getResultName();
    await expect.soft(name).toBeVisible();
    await expect.soft(name).toHaveText(/^Grey jacket$/i);
    const image = await this.getResultImage();
    await expect.soft(image).toBeVisible();
    await expect.soft(image).toHaveAttribute('alt', /\S/);
    await expect.soft(image).toHaveAttribute('src', /\S/);
    await expect.soft(image).toHaveJSProperty('complete', true);
    expect
      .soft(await image.evaluate((element: HTMLImageElement) => element.naturalWidth))
      .toBeGreaterThan(0);
    const price = await this.getResultPrice();
    await expect.soft(price).toBeVisible();
    expect
      .soft(await price.evaluate((element) => element.parentElement?.getAttribute('href') || ''))
      .toMatch(/\/products\/grey-jacket/);
    const priceText = (await price.innerText()).trim();
    expect.soft(priceText).toMatch(/^\u00a3[\d,]+\.\d{2}$/);
    const snapshot = {
      name: (await name.innerText()).trim(),
      priceInPence: priceInPence(priceText),
    };
    expect.soft(snapshot.priceInPence).toBeGreaterThan(0);
    return snapshot;
  }

  async verifyAvailabilityIsDisplayed(): Promise<void> {
    const card = await this.getResultCard();
    const labels = await card.evaluate((element) =>
      Array.from(element.children)
        .filter((child) => !['IMG', 'H3', 'H4'].includes(child.tagName))
        .filter((child) => child.getClientRects().length > 0)
        .map((child) => (child as HTMLElement).innerText.trim())
        .filter(Boolean)
    );
    expect
      .soft(
        labels.filter((label) =>
          /in stock|available|sold out|out of stock|pre.?order/i.test(label)
        ),
        'AC2 requires a visible availability/status label on the Grey Jacket result'
      )
      .not.toEqual([]);
  }

  async verifyResultsAreRelevant(): Promise<void> {
    const titles = await this.page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href*="/products/"] > h3'))
        .filter((element) => element.getClientRects().length > 0)
        .map((element) => element.textContent?.trim() || '')
    );
    expect.soft(titles.length).toBeGreaterThan(0);
    for (const title of titles) {
      expect.soft(title, `AC3 unrelated search result: ${title}`).toMatch(/grey jacket/i);
    }
  }

  async openResult(usingKeyboard: boolean = false): Promise<void> {
    const card = await this.getResultCard();
    await Promise.all([
      this.page.waitForURL(/\/products\/grey-jacket(?:\?|$)/, { waitUntil: 'domcontentloaded' }),
      usingKeyboard ? card.press('Enter') : this.clickSmart(this.resultCard),
    ]);
  }

  async verifyProductMatchesResult(snapshot: SearchProductSnapshot): Promise<void> {
    const name = await this.findSmart({
      role: { role: 'heading', name: /^Grey jacket$/i },
      css: 'form#product-form h1[itemprop="name"]',
      xpath: '//form[@id="product-form"]/h1',
      description: 'Grey Jacket product detail name',
    });
    const price = await this.findSmart({
      id: 'product-price',
      css: 'form#product-form h2#product-price',
      xpath: '//form[@id="product-form"]/h2[@id="product-price"]',
      description: 'Grey Jacket product detail price',
    });
    await expect.soft(name).toBeVisible();
    await expect.soft(name).toHaveText(snapshot.name);
    expect.soft(priceInPence(await price.innerText())).toBe(snapshot.priceInPence);
  }

  async verifyNoVisibleErrors(): Promise<void> {
    const errors = await this.page.evaluate(() =>
      Array.from(document.querySelectorAll('[role="alert"], .errors'))
        .filter((element) => element.getClientRects().length > 0)
        .map((element) => (element as HTMLElement).innerText.trim())
        .filter(Boolean)
    );
    expect.soft(errors).toEqual([]);
    await expect.soft(await this.getResultCard()).toBeVisible();
  }

  async hasNoHorizontalOverflow(): Promise<boolean> {
    return await this.page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
    );
  }
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function priceInPence(text: string): number {
  const amount = text.match(/\d[\d,]*\.\d{2}/)?.[0];
  return amount ? Math.round(Number(amount.replace(/,/g, '')) * 100) : Number.NaN;
}

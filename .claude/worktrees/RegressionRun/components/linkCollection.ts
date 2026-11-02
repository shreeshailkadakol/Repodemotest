import { Page, Locator, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { LinkCollection_FigmaValues } from '../helpers/utils/figma-values/LinkCollection_FigmaValues';
import { envUtils } from '../helpers/utils/envUtils';

export class LinkCollectionComponent extends BasePage {
  // Main container
  readonly fullwidthColumn: Locator;

  // Linkboc=x container
  readonly linkBoxComponent: Locator;

  // Title component
  readonly titleComponent: Locator;

  // Description component
  readonly descriptionComponent: Locator;

  // All links in the component
  readonly links: Locator;

  // Individual link by index
  readonly firstLink: Locator;
  readonly secondLink: Locator;
  readonly thirdLink: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
    this.fullwidthColumn = page.locator('[data-qa="fullwidth-column"]');
    this.linkBoxComponent = page.locator('[data-qa="link-box"]');
    // Scope the title component to the specific LinkCollection container to avoid conflicts
    this.titleComponent = this.linkBoxComponent.locator('[data-qa="title-component"]').first();
    this.descriptionComponent = this.linkBoxComponent.locator('[data-qa="description-component"]').first();
    this.links = this.linkBoxComponent.locator('[datatestid="link-box-link-button"]');
    this.firstLink = this.links.nth(0);
    this.secondLink = this.links.nth(1);
    this.thirdLink = this.links.nth(2);
  }

  // Navigate to LinkCollection test page
  async navigateToLinkCollection() {
    await this.navigateTo('LinkCollectionComponent');
  }

  // Navigate to LinkCollection test page with authentication
  async navigateToLinkCollectionWithAuth(password?: string) {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('LinkCollectionComponent', baseURL);
    await this.navigateWithAuthentication(url, password);
  }

  // Main component visibility check
  async isLinkCollectionVisible(): Promise<boolean> {
    return await this.fullwidthColumn.isVisible();
  }

  // Title component methods
  async getTitleText(): Promise<string> {
    return (await this.titleComponent.textContent()) || '';
  }

  async isTitleVisible(): Promise<boolean> {
    return await this.titleComponent.isVisible();
  }

  // Description component methods
  async getDescriptionText(): Promise<string> {
    return (await this.descriptionComponent.textContent()) || '';
  }

  async isDescriptionVisible(): Promise<boolean> {
    return await this.descriptionComponent.isVisible();
  }

  // Get links count (including hidden ones for responsive testing)
  async getLinksCount(): Promise<number> {
    return await this.links.count();
  }

  // Check if links are visible in current viewport
  async areLinksVisible(): Promise<boolean> {
    const count = await this.getLinksCount();
    if (count === 0) return false;

    // Check if at least one link is visible
    for (let i = 0; i < Math.min(count, 3); i++) {
      const boundingBox = await this.links.nth(i).boundingBox();
      if (boundingBox && boundingBox.width > 0 && boundingBox.height > 0) {
        return true;
      }
    }
    return false;
  }

  async getAllLinkTexts(): Promise<string[]> {
    const count = await this.getLinksCount();
    const linkTexts: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await this.links.nth(i).textContent();
      linkTexts.push(text || '');
    }

    return linkTexts;
  }

  async getAllLinkHrefs(): Promise<string[]> {
    const count = await this.getLinksCount();
    const linkHrefs: string[] = [];

    for (let i = 0; i < count; i++) {
      const href = await this.links.nth(i).getAttribute('href');
      linkHrefs.push(href || '');
    }

    return linkHrefs;
  }

  async clickLinkByIndex(index: number): Promise<void> {
    await this.links.nth(index).click();
  }

  async isLinkVisibleByIndex(index: number): Promise<boolean> {
    return await this.links.nth(index).isVisible();
  }

  // Visual validation methods
  async getTitleFontSize(): Promise<string> {
    return await this.titleComponent.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
  }

  async getTitleFontWeight(): Promise<string> {
    return await this.titleComponent.evaluate((el) => {
      return window.getComputedStyle(el).fontWeight;
    });
  }

  async getTitleColor(): Promise<string> {
    return await this.titleComponent.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
  }

  async getTitleLineHeight(): Promise<string> {
    return await this.titleComponent.evaluate((el) => {
      return window.getComputedStyle(el).lineHeight;
    });
  }

  async getTitleFontFamily(): Promise<string> {
    return await this.titleComponent.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });
  }

  async getDescriptionFontSize(): Promise<string> {
    return await this.descriptionComponent.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
  }

  async getDescriptionFontWeight(): Promise<string> {
    return await this.descriptionComponent.evaluate((el) => {
      return window.getComputedStyle(el).fontWeight;
    });
  }

  async getDescriptionColor(): Promise<string> {
    return await this.descriptionComponent.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
  }

  async getDescriptionLineHeight(): Promise<string> {
    return await this.descriptionComponent.evaluate((el) => {
      return window.getComputedStyle(el).lineHeight;
    });
  }

  async getDescriptionFontFamily(): Promise<string> {
    return await this.descriptionComponent.evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });
  }

  async getLinkFontSize(index: number = 0): Promise<string> {
    return await this.links.nth(index).evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
  }

  async getLinkFontWeight(index: number = 0): Promise<string> {
    return await this.links.nth(index).evaluate((el) => {
      return window.getComputedStyle(el).fontWeight;
    });
  }

  async getLinkColor(index: number = 0): Promise<string> {
    return await this.links.nth(index).evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
  }

  async getLinkLineHeight(index: number = 0): Promise<string> {
    return await this.links.nth(index).evaluate((el) => {
      return window.getComputedStyle(el).lineHeight;
    });
  }

  async getLinkFontFamily(index: number = 0): Promise<string> {
    return await this.links.nth(index).evaluate((el) => {
      return window.getComputedStyle(el).fontFamily;
    });
  }

  // Accessibility methods
  async getTitleRole(): Promise<string | null> {
    return await this.titleComponent.getAttribute('role');
  }

  async getLinkRole(index: number = 0): Promise<string | null> {
    return await this.links.nth(index).getAttribute('role');
  }

  async getLinkAriaLabel(index: number = 0): Promise<string | null> {
    return await this.links.nth(index).getAttribute('aria-label');
  }

  async getLinkTabIndex(index: number = 0): Promise<string | null> {
    return await this.links.nth(index).getAttribute('tabindex');
  }

  // Focus and keyboard navigation
  async focusOnTitle(): Promise<void> {
    await this.titleComponent.focus();
  }

  async focusOnLink(index: number = 0): Promise<void> {
    await this.links.nth(index).focus();
  }

  async pressTabFromTitle(): Promise<void> {
    await this.titleComponent.focus();
    await this.page.keyboard.press('Tab');
  }

  async pressEnterOnLink(index: number = 0): Promise<void> {
    await this.links.nth(index).focus();
    await this.page.keyboard.press('Enter');
  }

  // Performance monitoring
  async getComponentLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.fullwidthColumn.waitFor({ state: 'visible' });
    return Date.now() - startTime;
  }

  async getTitleRenderTime(): Promise<number> {
    const startTime = Date.now();
    await this.titleComponent.waitFor({ state: 'visible' });
    return Date.now() - startTime;
  }

  async getLinksRenderTime(): Promise<number> {
    const startTime = Date.now();
    await this.links.first().waitFor({ state: 'visible' });
    return Date.now() - startTime;
  }

  // Helper method to get Figma values for current viewport
  getFigmaValuesForViewport(viewport: 'XL' | 'LG' | 'MD' | 'SM') {
    return LinkCollection_FigmaValues[viewport];
  }

  // Wait for all component elements to be visible
  async waitForAllElementsVisible(): Promise<void> {
    await Promise.all([
      this.fullwidthColumn.waitFor({ state: 'visible' }),
      this.titleComponent.waitFor({ state: 'visible' }),
      this.descriptionComponent.waitFor({ state: 'visible' }),
    ]);

    // Wait for at least one link to be attached. In headless mode the link
    // items hydrate slightly later than the title/description, so checking
    // the count immediately races and returns 0. Allow up to 10s for the
    // first link to attach before falling back to the count assertion.
    try {
      await this.links.first().waitFor({ state: 'attached', timeout: 10000 });
    } catch {
      // fall through to count check which throws a clearer error
    }

    // For links, just ensure they exist in DOM (they may be hidden in responsive view)
    const linkCount = await this.getLinksCount();
    if (linkCount === 0) {
      throw new Error('No links found in component');
    }
  }
}

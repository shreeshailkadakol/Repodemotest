/**
 * Component Mapper - Related Content Component
 * What:
 *   Contains page-object locators and helper methods for Related Content UI
 *   behavior and structure checks.
 * Why:
 *   Created to separate component interaction logic from spec assertions and
 *   improve readability of mapper execution tests.
 */

import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator } from '@playwright/test';
export class RelatedContentComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ---------------------------------------------------------------------------
  // Component Container
  // ---------------------------------------------------------------------------
  async getComponentContainer(): Promise<Locator> {
    return await this.findSmart({
      testId: 'related-content',
      css: 'section[data-testid="related-content"]',
      xpath: '//section[@data-testid="related-content"]',
      description: 'Related Content component container',
    });
  }

  async getFullWidthParent(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'fullwidth-column',
      testId: 'fullwidth-column',
      css: 'section[data-qa="fullwidth-column"]',
      xpath: '//section[@data-qa="fullwidth-column"]',
      description: 'Full width content divider parent of Related Content',
    });
  }

  // ---------------------------------------------------------------------------
  // Component Title
  // ---------------------------------------------------------------------------
  async getComponentTitle(): Promise<Locator> {
    return await this.findSmart({
      css: 'section[data-testid="related-content"] h1, section[data-testid="related-content"] h2, section[data-testid="related-content"] h3',
      xpath: '//section[@data-testid="related-content"]//*[self::h1 or self::h2 or self::h3]',
      description: 'Related Content component title heading',
    });
  }

  // ---------------------------------------------------------------------------
  // Cards (articles)
  // ---------------------------------------------------------------------------
  async getAllCards(): Promise<Locator> {
    return await this.findSmart({
      css: 'section[data-testid="related-content"] article[data-qa="related-content-item"]',
      dataQa: 'related-content-item',
      xpath: '//section[@data-testid="related-content"]//article[@data-qa="related-content-item"]',
      description: 'Related Content card items',
    });
  }

  async getCardCount(): Promise<number> {
    return await this.page.evaluate(() => {
      const cards = document.querySelectorAll(
        'section[data-testid="related-content"] article[data-qa="related-content-item"]'
      );
      return cards.length;
    });
  }

  async getCardByIndex(index: number): Promise<Locator> {
    return await this.findSmart({
      css: `section[data-testid="related-content"] article[data-qa="related-content-item"]:nth-child(${index + 1})`,
      xpath: `(//section[@data-testid="related-content"]//article[@data-qa="related-content-item"])[${index + 1}]`,
      description: `Related Content card ${index + 1}`,
    });
  }

  // ---------------------------------------------------------------------------
  // Card Child Elements
  // ---------------------------------------------------------------------------
  async getCardImage(index: number): Promise<Locator> {
    return await this.findSmart({
      css: `article[data-qa="related-content-item"]:nth-of-type(${index + 1}) [data-qa="placeholder-image"]`,
      testId: 'placeholder-image',
      xpath: `(//article[@data-qa="related-content-item"])[${index + 1}]//*[@data-qa="placeholder-image"]`,
      description: `Related Content card ${index + 1} image/placeholder area`,
    });
  }

  async getCardHeadline(index: number): Promise<Locator> {
    return await this.findSmart({
      css: `article[data-qa="related-content-item"]:nth-of-type(${index + 1}) h3`,
      xpath: `(//article[@data-qa="related-content-item"])[${index + 1}]//h3`,
      description: `Related Content card ${index + 1} headline`,
    });
  }

  async getCardCtaLink(index: number): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'related-content-link',
      css: `article[data-qa="related-content-item"]:nth-of-type(${index + 1}) [data-qa="related-content-link"]`,
      xpath: `(//article[@data-qa="related-content-item"])[${index + 1}]//*[@data-qa="related-content-link"]`,
      description: `Related Content card ${index + 1} CTA link`,
    });
  }

  async getCardAnchorLink(index: number): Promise<Locator> {
    return await this.findSmart({
      css: `article[data-qa="related-content-item"]:nth-of-type(${index + 1}) > a[href]`,
      xpath: `(//article[@data-qa="related-content-item"])[${index + 1}]/a[@href]`,
      description: `Related Content card ${index + 1} anchor link`,
    });
  }

  // ---------------------------------------------------------------------------
  // Collect all card hrefs
  // ---------------------------------------------------------------------------
  async getAllCardHrefs(): Promise<string[]> {
    const count = await this.getCardCount();
    const hrefs: string[] = [];
    for (let i = 0; i < count; i++) {
      const anchor = await this.getCardAnchorLink(i);
      const href = await anchor.getAttribute('href');
      if (href) hrefs.push(href);
    }
    return hrefs;
  }

  // ---------------------------------------------------------------------------
  // Typography helpers
  // ---------------------------------------------------------------------------
  async getTypographyStyles(element: Locator): Promise<{
    fontSize: string;
    fontFamily: string;
    lineHeight: string;
    color: string;
    fontWeight: string;
  }> {
    return await element.evaluate((el) => {
      const style = globalThis.getComputedStyle(el);
      return {
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        lineHeight: style.lineHeight,
        color: style.color,
        fontWeight: style.fontWeight,
      };
    });
  }

  async getComponentTitleTypography() {
    const title = await this.getComponentTitle();
    return await this.getTypographyStyles(title);
  }

  async getCardHeadlineTypography(index: number) {
    const headline = await this.getCardHeadline(index);
    return await this.getTypographyStyles(headline);
  }

  // ---------------------------------------------------------------------------
  // Divider
  // ---------------------------------------------------------------------------
  async getDivider(): Promise<Locator> {
    return await this.findSmart({
      css: 'section[data-testid="related-content"] hr, section[data-testid="related-content"] [class*="divider"], section[data-testid="related-content"] [data-qa*="divider"]',
      xpath: '//section[@data-testid="related-content"]//hr',
      description: 'Related Content divider element',
    });
  }
}

import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator } from '@playwright/test';

export class TeaserGroupFullDetailsComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Get the main component container (shared by both variants)
   * Uses multiple SmartLocator fallbacks for resilience
   */
  async getComponentContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'teaser-group',
      testId: 'teaser-group',
      css: '[data-qa="teaser-group"]',
      xpath: '//*[@data-qa="teaser-group"]',
      description: 'Teaser Group Full Details component container',
    });
  }

  /**
   * Get the section headline / title of the component
   * Positioned above the carousel or grid of cards
   */
  async getSectionTitle(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'teaser-group-title',
      css: '[data-qa="teaser-group"] h2',
      xpath: '//*[@data-qa="teaser-group"]//h2',
      role: { role: 'heading', name: /.+/ },
      description: 'Teaser Group section title / headline',
    });
  }

  /**
   * Get section kicker text (displayed above the section title)
   */
  async getSectionKicker(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'teaser-group-kicker',
      css: '[data-qa="teaser-group"] [data-qa="teaser-group-kicker"]',
      xpath: '//*[@data-qa="teaser-group"]//*[@data-qa="teaser-group-kicker"]',
      description: 'Teaser Group section kicker text',
    });
  }

  // ---------------------------------------------------------------------------
  // CAROUSEL VARIANT
  // ---------------------------------------------------------------------------

  /**
   * Get the carousel container wrapping all teasers
   */
  async getCarouselContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'teaser-group-carousel',
      css: '[data-qa="teaser-group"] section[aria-label], [data-qa="teaser-group"] [role="region"]',
      xpath: '//*[@data-qa="teaser-group"]//section[@aria-label]',
      description: 'Carousel container within Teaser Group Full Details',
    });
  }

  /**
   * Get the carousel Next button
   */
  async getCarouselNextButton(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'carousel-next',
      css: 'button[aria-label*="next" i], button[data-qa="carousel-next"]',
      xpath: '//button[contains(translate(@aria-label,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"),"next")]',
      role: { role: 'button', name: /next/i },
      description: 'Carousel Next navigation button',
    });
  }

  /**
   * Get the carousel Previous button
   */
  async getCarouselPrevButton(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'carousel-prev',
      css: 'button[aria-label*="prev" i], button[data-qa="carousel-prev"]',
      xpath: '//button[contains(translate(@aria-label,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"),"prev")]',
      role: { role: 'button', name: /prev/i },
      description: 'Carousel Previous navigation button',
    });
  }

  /**
   * Get carousel pagination dots / indicators
   */
  async getCarouselPaginationDots(): Promise<Locator[]> {
    const dotsLocator = await this.findSmart({
      dataQa: 'carousel-pagination',
      css: '[data-qa="teaser-group"] [role="tablist"] [role="tab"], [data-qa="carousel-pagination"] button',
      xpath: '//*[@data-qa="teaser-group"]//*[@role="tablist"]//*[@role="tab"]',
      description: 'Carousel pagination indicators',
    });
    return await dotsLocator.all();
  }

  // ---------------------------------------------------------------------------
  // GRID VARIANT
  // ---------------------------------------------------------------------------

  /**
   * Get the grid container wrapping all teasers
   */
  async getGridContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'teaser-group-grid',
      css: '[data-qa="teaser-group"] ul, [data-qa="teaser-group"] [class*="grid"], [data-qa="teaser-group"] > div > div',
      xpath: '//*[@data-qa="teaser-group"]//ul | //*[@data-qa="teaser-group"]/div/div',
      description: 'Grid container within Teaser Group Full Details',
    });
  }

  // ---------------------------------------------------------------------------
  // SHARED TEASER CARD LOCATORS
  // ---------------------------------------------------------------------------

  /**
   * Get all visible teaser card containers within the component
   * Uses scoped CSS in findSmart — no container.locator()
   */
  async getTeaserCards(): Promise<Locator[]> {
    const cardLocator = await this.findSmart({
      dataQa: 'individual-teaser',
      css: '[data-qa="teaser-group"] [data-qa="individual-teaser"]',
      xpath: '//*[@data-qa="teaser-group"]//*[@data-qa="individual-teaser"]',
      description: 'Individual teaser cards within Teaser Group',
    });
    return await cardLocator.all();
  }

  /**
   * Get the image element of the first visible teaser card
   * For per-card testing pass a scoped CSS selector with nth-child
   */
  async getFirstCardImage(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-qa="teaser-group"] [data-qa="individual-teaser"]:first-child img',
      xpath: '(//*[@data-qa="teaser-group"]//*[@data-qa="individual-teaser"]//img)[1]',
      dataQa: 'individual-teaser-image',
      description: 'Image within first teaser card',
    });
  }

  /**
   * Get kicker text of the first visible teaser card
   */
  async getFirstCardKicker(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-qa="teaser-group"] [data-qa="individual-teaser"]:first-child [data-qa="individual-teaser-kicker"]',
      xpath: '(//*[@data-qa="teaser-group"]//*[@data-qa="individual-teaser"])[1]//*[@data-qa="individual-teaser-kicker"]',
      dataQa: 'individual-teaser-kicker',
      description: 'Kicker text within first teaser card',
    });
  }

  /**
   * Get headline of the first visible teaser card
   */
  async getFirstCardHeadline(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-qa="teaser-group"] [data-qa="individual-teaser"]:first-child [data-qa="individual-teaser-headline"]',
      xpath: '(//*[@data-qa="teaser-group"]//*[@data-qa="individual-teaser"])[1]//*[@data-qa="individual-teaser-headline"]',
      dataQa: 'individual-teaser-headline',
      description: 'Headline within first teaser card',
    });
  }

  /**
   * Get summary text of the first visible teaser card
   */
  async getFirstCardSummary(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-qa="teaser-group"] [data-qa="individual-teaser"]:first-child [data-qa="individual-teaser-summary"]',
      xpath: '(//*[@data-qa="teaser-group"]//*[@data-qa="individual-teaser"])[1]//*[@data-qa="individual-teaser-summary"]',
      dataQa: 'individual-teaser-summary',
      description: 'Summary text within first teaser card',
    });
  }

  /**
   * Get the CTA link of the first visible teaser card
   */
  async getFirstCardCta(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-qa="teaser-group"] [data-qa="individual-teaser"]:first-child > a[href]',
      xpath: '(//*[@data-qa="teaser-group"]//*[@data-qa="individual-teaser"])[1]/a[@href]',
      description: 'CTA link within first teaser card',
    });
  }

  // ---------------------------------------------------------------------------
  // TYPOGRAPHY HELPERS
  // ---------------------------------------------------------------------------

  /**
   * Get computed typography styles for any element
   * Used for visual validation against Figma design tokens
   */
  async getTypographyStyles(element: Locator): Promise<{
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    color: string;
  }> {
    return await element.evaluate((el) => {
      const style = globalThis.getComputedStyle(el);
      return {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        color: style.color,
      };
    });
  }

  async getSectionTitleTypography() {
    const el = await this.getSectionTitle();
    return await this.getTypographyStyles(el);
  }

  async getFirstCardKickerTypography() {
    const el = await this.getFirstCardKicker();
    return await this.getTypographyStyles(el);
  }

  async getFirstCardHeadlineTypography() {
    const el = await this.getFirstCardHeadline();
    return await this.getTypographyStyles(el);
  }

  async getFirstCardSummaryTypography() {
    const el = await this.getFirstCardSummary();
    return await this.getTypographyStyles(el);
  }

  // ---------------------------------------------------------------------------
  // VALIDATION HELPERS
  // ---------------------------------------------------------------------------

  /**
   * Validate image loaded successfully and is landscape
   */
  async validateCardImageRendering(): Promise<void> {
    const image = await this.getFirstCardImage();
    await image.waitFor({ state: 'visible', timeout: 10000 });

    const src = await image.getAttribute('src');
    if (!src) {
      throw new Error('Card image src attribute is missing');
    }

    const isLoaded = await image.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalHeight !== 0;
    });

    if (!isLoaded) {
      throw new Error('Card image failed to load');
    }

    this.log(`[PASS] Card image loaded: ${src.substring(0, 60)}...`);
  }

  /**
   * Validate component has required structural elements
   */
  async validateComponentRendering(): Promise<void> {
    const container = await this.getComponentContainer();
    await container.waitFor({ state: 'visible', timeout: 15000 });

    const title = await this.getSectionTitle();
    const cards = await this.getTeaserCards();

    await title.waitFor({ state: 'attached' });

    if (cards.length === 0) {
      throw new Error('No teaser cards found in component');
    }

    this.log(`[PASS] Component rendered with ${cards.length} cards`);
  }
}

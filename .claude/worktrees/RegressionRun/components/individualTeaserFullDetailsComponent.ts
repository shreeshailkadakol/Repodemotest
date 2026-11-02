

import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator } from '@playwright/test';

export class IndividualTeaserFullDetailsComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Get the main Individual Teaser component container
   * Uses SmartLocator with multiple fallback strategies
   */
  async getComponentContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'individual-teaser',
      testId: 'individual-teaser',
      role: { role: 'article' },
      css: 'article[data-qa="individual-teaser"]',
      description: 'Individual Teaser component container',
    });
  }

  /**
   * Get the parent column container for layout validation (AC2)
   * Searches up the parent hierarchy to find columns33 or columns25
   */
  async getParentColumnContainer(): Promise<Locator> {
    // Search up parent hierarchy for columns33 or columns25
    const columnContainer = await this.page.evaluate((selector) => {
      const teaser = document.querySelector(selector);
      if (!teaser) return null;
      
      let current = teaser.parentElement;
      let level = 0;
      
      // Search up to 10 levels
      while (current && level < 10) {
        const dataQa = current.dataset.qa;
        if (dataQa === 'columns33' || dataQa === 'columns25') {
          return dataQa;
        }
        current = current.parentElement;
        level++;
      }
      
      return null;
    }, '[data-qa="individual-teaser"]');
    
    if (!columnContainer) {
      throw new Error('Could not find columns33 or columns25 parent container in hierarchy');
    }
    
    return await this.findSmart({
      dataQa: columnContainer,
      css: `[data-qa="${columnContainer}"]`,
      description: `Parent column container (${columnContainer})`,
    });
  }

  /**
   * Validate parent column layout (AC2 - FE validation)
   * Component should be in 25% or 33% column only
   */
  async validateColumnLayout(): Promise<string> {
    // Search up parent hierarchy for columns container
    const dataQa = await this.page.evaluate((selector) => {
      const teaser = document.querySelector(selector);
      if (!teaser) return null;
      
      let current = teaser.parentElement;
      let level = 0;
      
      // Search up to 10 levels
      while (current && level < 10) {
        const qa = current.dataset.qa;
        if (qa === 'columns33' || qa === 'columns25') {
          return qa;
        }
        current = current.parentElement;
        level++;
      }
      
      return null;
    }, '[data-qa="individual-teaser"]');
    
    if (dataQa === 'columns33' || dataQa === 'columns25') {
      this.log(`[PASS] Component is in valid column layout: ${dataQa}`);
      return dataQa;
    }
    
    throw new Error(`Component is in invalid column layout: ${dataQa}. Expected columns33 or columns25`);
  }

  /**
   * Get image element using SmartLocator with multiple fallback strategies
   * Image should be landscape, above text content
   * DOM-verified attributes: data-qa, data-testid, aria-label, dam-id
   */
  async getImageElement(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'individual-teaser-image',
      testId: 'individual-teaser-image',
      css: 'article[data-qa="individual-teaser"] img',
      xpath: '//article[@data-qa="individual-teaser"]//img',
      description: 'Individual Teaser image',
    });
  }

  /**
   * Get kicker text element with multiple fallback strategies
   * Positioned above headline, typically smaller text
   * DOM-verified: span with data-qa="individual-teaser-kicker"
   */
  async getKickerElement(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'individual-teaser-kicker',
      css: 'article[data-qa="individual-teaser"] span[data-qa="individual-teaser-kicker"]',
      xpath: '//article[@data-qa="individual-teaser"]//span[@data-qa="individual-teaser-kicker"]',
      description: 'Individual Teaser kicker text',
    });
  }

  /**
   * Get headline element with multiple fallback strategies
   * Should be H2 or H3 for semantic structure
   * DOM-verified: h2 with data-qa="individual-teaser-headline"
   */
  async getHeadlineElement(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'individual-teaser-headline',
      css: 'article[data-qa="individual-teaser"] h2[data-qa="individual-teaser-headline"]',
      xpath: '//article[@data-qa="individual-teaser"]//h2[@data-qa="individual-teaser-headline"]',
      altText: 'article[data-qa="individual-teaser"] h2',
      description: 'Individual Teaser headline',
    });
  }

  /**
   * Get summary text element with multiple fallback strategies
   * Description/body text below headline
   * DOM-verified: p with data-qa="individual-teaser-summary"
   */
  async getSummaryElement(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'individual-teaser-summary',
      css: 'article[data-qa="individual-teaser"] p[data-qa="individual-teaser-summary"]',
      xpath: '//article[@data-qa="individual-teaser"]//p[@data-qa="individual-teaser-summary"]',
      description: 'Individual Teaser summary text',
    });
  }

  /**
   * Get link/CTA element with multiple fallback strategies
   * Whole card should be clickable
   * DOM-verified: anchor tag with href (no data-qa, uses semantic selector)
   */
  async getLinkElement(): Promise<Locator> {
    return await this.findSmart({
      css: 'article[data-qa="individual-teaser"] > a[href]',
      xpath: '//article[@data-qa="individual-teaser"]/a[@href]',
      altText: 'article[data-qa="individual-teaser"] a',
      description: 'Individual Teaser card link',
    });
  }

  /**
   * Validate image properties (FE rendering)
   */
  async validateImageRendering(): Promise<void> {
    const image = await this.getImageElement();
    
    // Wait for visibility
    await image.waitFor({ state: 'visible', timeout: 10000 });
    
    // Validate has src attribute
    const src = await image.getAttribute('src');
    if (!src) {
      throw new Error('Image src attribute is missing');
    }
    this.log(`Image src found: ${src.substring(0, 50)}...`);
    
    // Validate has alt attribute (accessibility)
    const hasAlt = await image.getAttribute('alt');
    if (hasAlt === null) {
      this.log('[WARNING] Image alt attribute is missing');
    }
    
    // Validate image loaded successfully
    const isLoaded = await image.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalHeight !== 0;
    });
    
    if (!isLoaded) {
      throw new Error('Image failed to load');
    }
    
    // Validate landscape orientation (width > height)
    const dimensions = await image.evaluate((img: HTMLImageElement) => ({
      width: img.naturalWidth,
      height: img.naturalHeight,
    }));
    
    if (dimensions.width <= dimensions.height) {
      this.log(`[WARNING] Image may not be landscape (${dimensions.width}x${dimensions.height})`);
    } else {
      this.log(`[PASS] Image is landscape: ${dimensions.width}x${dimensions.height}`);
    }
  }

  /**
   * Validate kicker text is not empty
   */
  async validateKickerContent(): Promise<string> {
    const kicker = await this.getKickerElement();
    await kicker.waitFor({ state: 'visible', timeout: 10000 });
    
    const text = await kicker.textContent();
    if (!text || text.trim() === '') {
      throw new Error('Kicker text is empty');
    }
    
    this.log(`[PASS] Kicker text found: "${text.trim()}"`);
    return text.trim();
  }

  /**
   * Validate headline element (FE rendering)
   */
  async validateHeadlineRendering(): Promise<{text: string; tagName: string}> {
    const headline = await this.getHeadlineElement();
    await headline.waitFor({ state: 'visible', timeout: 10000 });
    
    const text = await headline.textContent();
    if (!text || text.trim() === '') {
      throw new Error('Headline text is empty');
    }
    
    // Validate semantic HTML (H2 or H3)
    const tagName = await headline.evaluate(el => el.tagName.toLowerCase());
    if (tagName !== 'h2' && tagName !== 'h3') {
      this.log(`[WARNING] Headline uses <${tagName}> instead of <h2> or <h3>`);
    } else {
      this.log(`[PASS] Headline uses semantic <${tagName}> tag`);
    }
    
    this.log(`[PASS] Headline text: "${text.trim()}"`);
    return { text: text.trim(), tagName };
  }

  /**
   * Validate summary text content
   */
  async validateSummaryContent(): Promise<string> {
    const summary = await this.getSummaryElement();
    await summary.waitFor({ state: 'visible', timeout: 10000 });
    
    const text = await summary.textContent();
    if (!text || text.trim() === '') {
      throw new Error('Summary text is empty');
    }
    
    this.log(`[PASS] Summary text found (${text.length} chars)`);
    return text.trim();
  }

  /**
   * Validate link element (FE rendering)
   */
  async validateLinkRendering(): Promise<{href: string; target: string  | null}> {
    const link = await this.getLinkElement();
    await link.waitFor({ state: 'visible', timeout: 10000 });
    
    // Validate href attribute
    const href = await link.getAttribute('href');
    if (!href) {
      throw new Error('Link href attribute is missing');
    }
    
    // Get target attribute (opens in same/new tab)
    const target = await link.getAttribute('target');
    
    this.log(`[PASS] Link href: ${href}`);
    this.log(`Link target: ${target || 'same tab (_self)'}`);
    
    return { href, target };
  }

  /**
   * Validate whole card is clickable (interactive area requirement)
   */
  async validateCardClickable(): Promise<boolean> {
    const container = await this.getComponentContainer();
    
    // Check if container or child link is clickable
    const isClickable = await container.evaluate(el => {
      const link = el.querySelector('a');
      return link !== null;
    });
    
    if (!isClickable) {
      throw new Error('Card does not contain a clickable link element');
    }
    
    this.log('[PASS] Card is clickable (contains link element)');
    return true;
  }

  /**
   * Click the teaser card (navigates to link target)
   */
  async clickCard(): Promise<void> {
    await this.clickSmart({
      dataQa: 'individual-teaser',
      role: { role: 'link' },
      css: 'article[data-qa="individual-teaser"] a',
      description: 'Individual Teaser card link',
    });
    
    this.log('[PASS] Clicked Individual Teaser card');
  }

  /**
   * Hover over card to trigger animations
   * Used for testing image zoom and slanted line animation
   */
  async hoverOverCard(): Promise<void> {
    const container = await this.getComponentContainer();
    await container.hover();
    await this.page.waitForTimeout(500); // Allow animation to complete
    this.log('[PASS] Hovered over Individual Teaser card');
  }

  /**
   * Validate image zoom on hover (100% → 105%)
   * Returns initial and hover scale values
   */
  async validateImageZoomOnHover(): Promise<{initial: number; onHover: number}> {
    const image = await this.getImageElement();
    
    // Get initial transform
    const initialTransform = await image.evaluate(img => {
      const style = globalThis.getComputedStyle(img);
      return style.transform;
    });
    
    // Hover over card
    await this.hoverOverCard();
    
    // Wait for animation
    await this.page.waitForTimeout(300);
    
    // Get transform on hover
    const hoverTransform = await image.evaluate(img => {
      const style = globalThis.getComputedStyle(img);
      return style.transform;
    });
    
    this.log(`Initial transform: ${initialTransform}`);
    this.log(`Hover transform: ${hoverTransform}`);
    
    // Extract scale values (matrix format: matrix(scaleX, 0, 0, scaleY, tx, ty))
    const extractScale = (matrix: string): number => {
      if (matrix === 'none') return 1;
      const regex = /matrix\(([^)]+)\)/;
      const match = regex.exec(matrix);
      const values = match?.[1].split(', ');
      return values ? Number.parseFloat(values[0]) : 1;
    };
    
    const initialScale = extractScale(initialTransform);
    const hoverScale = extractScale(hoverTransform);
    
    this.log(`Image scale: ${(initialScale * 100).toFixed(0)}% → ${(hoverScale * 100).toFixed(0)}%`);
    
    return { initial: initialScale, onHover: hoverScale };
  }

  /**
   * Get computed typography styles for an element
   * Used for visual validation against Figma
   */
  async getTypographyStyles(element: Locator): Promise<{
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    color: string;
  }> {
    return await element.evaluate(el => {
      const style = globalThis.getComputedStyle(el);
      return {
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        color: style.color,
      };
    });
  }

  /**
   * Get kicker typography styles
   */
  async getKickerTypography(): Promise<{
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    color: string;
  }> {
    const kicker = await this.getKickerElement();
    return await this.getTypographyStyles(kicker);
  }

  /**
   * Get headline typography styles
   */
  async getHeadlineTypography(): Promise<{
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    color: string;
  }> {
    const headline = await this.getHeadlineElement();
    return await this.getTypographyStyles(headline);
  }

  /**
   * Get summary typography styles
   */
  async getSummaryTypography(): Promise<{
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    color: string;
  }> {
    const summary = await this.getSummaryElement();
    return await this.getTypographyStyles(summary);
  }

  /**
   * Validate component renders on page mount
   */
  async validateComponentRendering(): Promise<void> {
    const container = await this.getComponentContainer();
    await container.waitFor({ state: 'visible', timeout: 15000 });
    
    // Validate all required elements are present
    const image = await this.getImageElement();
    const kicker = await this.getKickerElement();
    const headline = await this.getHeadlineElement();
    const summary = await this.getSummaryElement();
    const link = await this.getLinkElement();
    
    await Promise.all([
      image.waitFor({ state: 'attached' }),
      kicker.waitFor({ state: 'attached' }),
      headline.waitFor({ state: 'attached' }),
      summary.waitFor({ state: 'attached' }),
      link.waitFor({ state: 'attached' }),
    ]);
    
    this.log('[PASS] All required component elements rendered');
  }
}

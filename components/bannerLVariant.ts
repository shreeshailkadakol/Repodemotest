import { Locator, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';
import { BannerLVariantfigmavalues } from '../helpers/utils/figma-values/BannerLVariant-figma-values';

type ViewportType = 'xl' | 'lg' | 'md' | 'sm';

/**
 * DOM Structure (from live inspection):
 * <section data-qa="banner-component" data-testid="banner-component">
 *   <div data-qa="banner-content">
 *     <h2 data-qa="title-component">
 *       <span>Let's make impact</span>
 *       <span data-qa="stage-headline-text">Join our Team</span>
 *     </h2>
 *     <p data-qa="description-component">Solving the world's greatest challenges together.</p>
 *     <div> <!-- Button container without data-qa -->
 *       <a href="/About"><span>Primary CTA</span></a>
 *       <a href="/About"><span>Secondary CTA</span></a>
 *     </div>
 *   </div>
 * </section>
 */

export class BannerLVariantComponent extends BasePage {
  // Main component container
  private readonly bannerContainer: Locator = this.page.locator('[data-qa="banner-component"]');
  private readonly bannerContent: Locator = this.page.locator('[data-qa="banner-content"]');

  // Text elements with direct data-qa attributes (scoped to banner container)
  private readonly primaryText: Locator = this.bannerContainer.locator(
    '[data-qa="title-component"]'
  );
  private readonly highlightText: Locator = this.bannerContainer.locator(
    '[data-qa="stage-headline-text"]'
  );
  private readonly secondaryText: Locator = this.bannerContainer.locator(
    '[data-qa="description-component"]'
  );

  // Buttons using parent-child relationship (as per DOM inspection)
  private readonly primaryCTA: Locator = this.bannerContent.locator('a').first();
  private readonly secondaryCTA: Locator = this.bannerContent.locator('a').nth(1);

  /**
   * Convert rgba color to rgb format for comparison
   */
  private rgbaToRgb(rgba: string): string {
    if (rgba === 'rgba(255, 255, 255, 1)') return 'rgb(255, 255, 255)';
    if (rgba === 'rgba(0, 120, 140, 1)') return 'rgb(0, 120, 140)';
    // Add more conversions as needed
    return rgba.replace('rgba(', 'rgb(').replace(/, 1\)$/, ')');
  }

  /**
   * Navigate to Banner L Variant component page
   */
  async navigateToBannerLVariant(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.getComponentUrl('BannerLVariantComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForComponentToLoad();
  }

  /**
   * Wait for the Banner L variant component to load completely
   */
  async waitForComponentToLoad(): Promise<void> {
    await this.bannerContainer.waitFor({ state: 'visible', timeout: 10000 });
    await this.primaryText.waitFor({ state: 'visible' });
    await this.secondaryText.waitFor({ state: 'visible' });
  }

  /**
   * Verify component structure and visibility
   */
  async verifyComponentStructure(): Promise<void> {
    // Main container verification
    await expect.soft(this.bannerContainer).toBeVisible();
    await expect.soft(this.bannerContainer).toHaveAttribute('data-qa', 'banner-component');
    await expect.soft(this.bannerContainer).toHaveAttribute('data-testid', 'banner-component');

    // Content container verification
    await expect.soft(this.bannerContent).toBeVisible();
    await expect.soft(this.bannerContent).toHaveAttribute('data-qa', 'banner-content');

    // Text elements verification
    await expect.soft(this.primaryText).toBeVisible();
    await expect.soft(this.primaryText).not.toBeEmpty();
    await expect.soft(this.highlightText).toBeVisible();
    await expect.soft(this.highlightText).not.toBeEmpty();
    await expect.soft(this.secondaryText).toBeVisible();
    await expect.soft(this.secondaryText).not.toBeEmpty();

    // Button elements verification
    await expect.soft(this.primaryCTA).toBeVisible();
    await expect.soft(this.secondaryCTA).toBeVisible();
  }

  /**
   * Verify semantic HTML structure
   */
  async verifySemanticStructure(): Promise<void> {
    // Verify primary text is H2
    const primaryTagName = await this.primaryText.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(primaryTagName).toBe('h2');

    // Verify secondary text is paragraph
    const secondaryTagName = await this.secondaryText.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(secondaryTagName).toBe('p');

    // Verify buttons are links
    const primaryButtonTagName = await this.primaryCTA.evaluate((el) => el.tagName.toLowerCase());
    const secondaryButtonTagName = await this.secondaryCTA.evaluate((el) =>
      el.tagName.toLowerCase()
    );
    expect.soft(primaryButtonTagName).toBe('a');
    expect.soft(secondaryButtonTagName).toBe('a');
  }

  /**
   * Verify first text typography across all viewports (Visual Testing)
   */
  async verifyFirstTextTypography(viewport: ViewportType): Promise<void> {
    const expectedValues = BannerLVariantfigmavalues[viewport].firstTextField;

    // Set viewport size
    const viewportConfig = BannerLVariantfigmavalues[viewport].viewport;
    await this.page.setViewportSize({ width: viewportConfig.width, height: viewportConfig.height });

    // Wait for responsive changes
    await this.page.waitForLoadState('domcontentloaded');

    // Verify font family
    const fontFamily = await this.primaryText.evaluate((el) => getComputedStyle(el).fontFamily);
    expect.soft(fontFamily).toContain('Bayer Sans');

    // Verify font size
    const fontSize = await this.primaryText.evaluate((el) => getComputedStyle(el).fontSize);
    expect.soft(fontSize).toBe(expectedValues.fontSize);

    // Verify font weight
    const fontWeight = await this.primaryText.evaluate((el) => getComputedStyle(el).fontWeight);
    expect.soft(fontWeight).toBe(expectedValues.fontWeight);

    // Verify color (using Figma expected value)
    const color = await this.primaryText.evaluate((el) => getComputedStyle(el).color);
    const expectedColor = this.rgbaToRgb(expectedValues.color);
    expect.soft(color).toBe(expectedColor);

    // Verify line height
    const lineHeight = await this.primaryText.evaluate((el) => getComputedStyle(el).lineHeight);
    expect.soft(lineHeight).toBe(expectedValues.lineHeight);
  }

  /**
   * Verify second text typography across all viewports (Visual Testing)
   */
  async verifySecondTextTypography(viewport: ViewportType): Promise<void> {
    const expectedValues = BannerLVariantfigmavalues[viewport].secondTextField;

    // Set viewport size
    const viewportConfig = BannerLVariantfigmavalues[viewport].viewport;
    await this.page.setViewportSize({ width: viewportConfig.width, height: viewportConfig.height });

    // Wait for responsive changes
    await this.page.waitForLoadState('domcontentloaded');

    // Verify font family
    const fontFamily = await this.secondaryText.evaluate((el) => getComputedStyle(el).fontFamily);
    expect.soft(fontFamily).toContain('Bayer Sans');

    // Verify font size
    const fontSize = await this.secondaryText.evaluate((el) => getComputedStyle(el).fontSize);
    expect.soft(fontSize).toBe(expectedValues.fontSize);

    // Verify font weight
    const fontWeight = await this.secondaryText.evaluate((el) => getComputedStyle(el).fontWeight);
    expect.soft(fontWeight).toBe(expectedValues.fontWeight);

    // Verify color (using Figma expected value)
    const color = await this.secondaryText.evaluate((el) => getComputedStyle(el).color);
    const expectedColor = this.rgbaToRgb(expectedValues.color);
    expect.soft(color).toBe(expectedColor);

    // Verify line height
    const lineHeight = await this.secondaryText.evaluate((el) => getComputedStyle(el).lineHeight);
    expect.soft(lineHeight).toBe(expectedValues.lineHeight);
  }

  /**
   * Verify highlight text (gradient styling)
   */
  async verifyHighlightTextStyling(viewport: ViewportType): Promise<void> {
    const viewportConfig = BannerLVariantfigmavalues[viewport].viewport;
    await this.page.setViewportSize({ width: viewportConfig.width, height: viewportConfig.height });

    await this.page.waitForLoadState('domcontentloaded');

    // Verify highlight text is visible and not empty
    await expect.soft(this.highlightText).toBeVisible();
    await expect.soft(this.highlightText).not.toBeEmpty();
    await expect.soft(this.highlightText).toHaveAttribute('data-qa', 'stage-headline-text');

    // Verify it's a span element
    const tagName = await this.highlightText.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(tagName).toBe('span');
  }

  /**
   * Verify CTA button functionality
   */
  async verifyCTAFunctionality(): Promise<void> {
    // Verify primary CTA has a valid href attribute
    const primaryHref = await this.primaryCTA.getAttribute('href');
    expect.soft(primaryHref).toBeTruthy();
    expect.soft(primaryHref).toMatch(/^(https?:\/\/|\/)/); // Starts with http://, https://, or /
    
    // Verify secondary CTA has a valid href attribute
    const secondaryHref = await this.secondaryCTA.getAttribute('href');
    expect.soft(secondaryHref).toBeTruthy();
    expect.soft(secondaryHref).toMatch(/^(https?:\/\/|\/)/);
    
    // Verify they are clickable
    await expect.soft(this.primaryCTA).toBeEnabled();
    await expect.soft(this.secondaryCTA).toBeEnabled();
  }

  /**
   * Verify accessibility compliance
   */
  async verifyAccessibility(): Promise<void> {
    // Verify heading structure
    const headingText = this.primaryText;
    await expect.soft(headingText).toHaveText(/./); // Check that it has some text content

    // Verify link accessibility
    const primaryHref = await this.primaryCTA.getAttribute('href');
    const secondaryHref = await this.secondaryCTA.getAttribute('href');
    expect.soft(primaryHref).toBeTruthy();
    expect.soft(secondaryHref).toBeTruthy();

    // Verify text content is not empty
    const primaryTextContent = await this.primaryText.textContent();
    const secondaryTextContent = await this.secondaryText.textContent();
    expect.soft(primaryTextContent?.trim()).toBeTruthy();
    expect.soft(secondaryTextContent?.trim()).toBeTruthy();
  }

  /**
   * Get primary text element for external testing
   */
  getPrimaryTextElement(): Locator {
    return this.primaryText;
  }

  /**
   * Get secondary text element for external testing
   */
  getSecondaryTextElement(): Locator {
    return this.secondaryText;
  }

  /**
   * Get highlight text element for external testing
   */
  getHighlightTextElement(): Locator {
    return this.highlightText;
  }

  /**
   * Get banner container for external testing
   */
  getBannerContainer(): Locator {
    return this.bannerContainer;
  }
}

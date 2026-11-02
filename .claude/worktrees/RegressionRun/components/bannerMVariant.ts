import { Page, Locator, Browser, BrowserContext, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';
import { BannerMVariantfigmavalues } from '../helpers/utils/figma-values/BannerMVariant-figma-values';

export class BannerMVariantComponent extends BasePage {
  // Main container
  private readonly bannerContainer: Locator = this.page.locator('[data-qa="banner-component"]');

  // Image element. data-qa was renamed next-image -> banner-image (data-testid stays
  // next-image); match either for resilience.
  private readonly bannerImage: Locator = this.bannerContainer.locator(
    '[data-qa="banner-image"], [data-testid="next-image"]'
  );

  // Content container
  private readonly bannerContent: Locator = this.bannerContainer.locator(
    '[data-qa="banner-content"]'
  );

  // Text elements
  private readonly titleComponent: Locator = this.bannerContainer.locator(
    '[data-qa="title-component"]'
  );
  private readonly highlightText: Locator = this.titleComponent.locator(
    '[data-qa="stage-headline-text"]'
  );
  private readonly descriptionText: Locator = this.bannerContainer.locator(
    '[data-qa="description-component"]'
  );

  // CTA buttons using parent-child relationship (missing data-qa attributes)
  private readonly primaryCTA: Locator = this.bannerContent.locator('a').first();
  private readonly secondaryCTA: Locator = this.bannerContent.locator('a').last();

  // Icons within buttons
  private readonly primaryCTAIcon: Locator = this.primaryCTA.locator('[data-qa="icon"]');
  private readonly secondaryCTAIcon: Locator = this.secondaryCTA.locator('[data-qa="icon"]');

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Navigate to Banner M Variant component page with authentication
   */
  async navigateToBannerMVariant(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('BannerMVariantComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForNetworkIdle();
    // Wait for component to be fully loaded
    await this.bannerContainer.waitFor({ state: 'visible', timeout: 30000 });
  }

  /**
   * Get all component elements for testing
   */
  getAllElements() {
    return {
      bannerContainer: this.bannerContainer,
      bannerImage: this.bannerImage,
      bannerContent: this.bannerContent,
      titleComponent: this.titleComponent,
      highlightText: this.highlightText,
      descriptionText: this.descriptionText,
      primaryCTA: this.primaryCTA,
      secondaryCTA: this.secondaryCTA,
      primaryCTAIcon: this.primaryCTAIcon,
      secondaryCTAIcon: this.secondaryCTAIcon,
    };
  }

  /**
   * Verify component visibility
   */
  async verifyComponentVisibility(): Promise<void> {
    await expect.soft(this.bannerContainer).toBeVisible();
    await expect.soft(this.bannerImage).toBeVisible();
    await expect.soft(this.bannerContent).toBeVisible();
    await expect.soft(this.titleComponent).toBeVisible();
    await expect.soft(this.descriptionText).toBeVisible();
    await expect.soft(this.primaryCTA).toBeVisible();
    await expect.soft(this.secondaryCTA).toBeVisible();
  }

  /**
   * Verify banner image loading
   */
  async verifyBannerImageLoading(): Promise<void> {
    await expect.soft(this.bannerImage).toBeVisible();
    await expect.soft(this.bannerImage).toHaveAttribute('src');
    await expect.soft(this.bannerImage).toHaveAttribute('alt');
  }

  /**
   * Verify first text field typography based on viewport
   */
  async verifyFirstTextTypography(viewport: 'xl' | 'lg' | 'md' | 'sm'): Promise<void> {
    const expectedValues = BannerMVariantfigmavalues[viewport].firstTextField;

    // Set viewport size before checking typography
    const viewportConfig = BannerMVariantfigmavalues[viewport].viewport;
    await this.page.setViewportSize({
      width: viewportConfig.width,
      height: viewportConfig.height,
    });

    // Wait for responsive changes to take effect
    await this.page.waitForTimeout(500);

    const computedStyles = await this.titleComponent.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
      };
    });

    // Verify font family
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');

    // Verify font size
    const actualFontSize = parseInt(computedStyles.fontSize.replace('px', ''));
    const expectedFontSize = parseInt(expectedValues.fontSize.replace('px', ''));
    expect.soft(actualFontSize).toBeCloseTo(expectedFontSize, 2);

    // Verify font weight
    const actualWeight = parseInt(computedStyles.fontWeight);
    const expectedWeight = parseInt(expectedValues.fontWeight);
    expect.soft(actualWeight).toBe(expectedWeight);

    // Verify line height
    const actualLineHeight = parseInt(computedStyles.lineHeight.replace('px', ''));
    const expectedLineHeight = parseInt(expectedValues.lineHeight.replace('px', ''));
    expect.soft(actualLineHeight).toBeCloseTo(expectedLineHeight, 2);
  }

  /**
   * Verify second text field typography based on viewport
   */
  async verifySecondTextTypography(viewport: 'xl' | 'lg' | 'md' | 'sm'): Promise<void> {
    const expectedValues = BannerMVariantfigmavalues[viewport].secondTextField;

    // Set viewport size before checking typography
    const viewportConfig = BannerMVariantfigmavalues[viewport].viewport;
    await this.page.setViewportSize({
      width: viewportConfig.width,
      height: viewportConfig.height,
    });

    // Wait for responsive changes to take effect
    await this.page.waitForTimeout(500);

    const computedStyles = await this.descriptionText.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
      };
    });

    // Verify font family
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');

    // Verify font size
    const actualFontSize = parseInt(computedStyles.fontSize.replace('px', ''));
    const expectedFontSize = parseInt(expectedValues.fontSize.replace('px', ''));
    expect.soft(actualFontSize).toBeCloseTo(expectedFontSize, 2);

    // Verify font weight
    const actualWeight = parseInt(computedStyles.fontWeight);
    const expectedWeight = parseInt(expectedValues.fontWeight);
    expect.soft(actualWeight).toBe(expectedWeight);

    // Verify line height
    const actualLineHeight = parseInt(computedStyles.lineHeight.replace('px', ''));
    const expectedLineHeight = parseInt(expectedValues.lineHeight.replace('px', ''));
    expect.soft(actualLineHeight).toBeCloseTo(expectedLineHeight, 2);
  }

  /**
   * Verify first button styling based on viewport
   */
  async verifyFirstButtonStyling(viewport: 'xl' | 'lg' | 'md' | 'sm'): Promise<void> {
    const expectedValues = BannerMVariantfigmavalues[viewport].firstButton;

    const computedStyles = await this.primaryCTA.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      };
    });

    // Verify font family
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');

    // Verify font size
    const actualFontSize = parseInt(computedStyles.fontSize.replace('px', ''));
    const expectedFontSize = parseInt(expectedValues.fontSize.replace('px', ''));
    expect.soft(actualFontSize).toBeCloseTo(expectedFontSize, 2);

    // Verify font weight
    const actualWeight = parseInt(computedStyles.fontWeight);
    const expectedWeight = parseInt(expectedValues.fontWeight);
    expect.soft(actualWeight).toBe(expectedWeight);
  }

  /**
   * Verify second button styling based on viewport
   */
  async verifySecondButtonStyling(viewport: 'xl' | 'lg' | 'md' | 'sm'): Promise<void> {
    const expectedValues = BannerMVariantfigmavalues[viewport].secondButton;

    const computedStyles = await this.secondaryCTA.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      };
    });

    // Verify font family
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');

    // Verify font size
    const actualFontSize = parseInt(computedStyles.fontSize.replace('px', ''));
    const expectedFontSize = parseInt(expectedValues.fontSize.replace('px', ''));
    expect.soft(actualFontSize).toBeCloseTo(expectedFontSize, 2);

    // Verify font weight
    const actualWeight = parseInt(computedStyles.fontWeight);
    const expectedWeight = parseInt(expectedValues.fontWeight);
    expect.soft(actualWeight).toBe(expectedWeight);
  }

  /**
   * Verify highlight text gradient styling
   */
  async verifyHighlightTextGradient(): Promise<void> {
    const gradientStyles = await this.highlightText.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        backgroundImage: styles.backgroundImage,
        webkitBackgroundClip: styles.webkitBackgroundClip,
        webkitTextFillColor: styles.webkitTextFillColor,
        color: styles.color,
      };
    });

    // Verify gradient background is applied
    expect.soft(gradientStyles.backgroundImage).toContain('gradient');
    expect.soft(gradientStyles.webkitBackgroundClip).toBe('text');
  }

  /**
   * Verify all elements for a specific viewport
   */
  async verifyAllElementsForViewport(viewport: 'xl' | 'lg' | 'md' | 'sm'): Promise<void> {
    // Set appropriate viewport size
    const viewportConfig = BannerMVariantfigmavalues[viewport].viewport;
    await this.page.setViewportSize({
      width: viewportConfig.width,
      height: viewportConfig.height,
    });

    // Wait for viewport change to take effect
    await this.page.waitForTimeout(1000);

    // Verify component visibility
    await this.verifyComponentVisibility();

    // Verify typography for both text fields
    await this.verifyFirstTextTypography(viewport);
    await this.verifySecondTextTypography(viewport);

    // Verify button styling
    await this.verifyFirstButtonStyling(viewport);
    await this.verifySecondButtonStyling(viewport);

    // Verify gradient text
    await this.verifyHighlightTextGradient();
  }

  /**
   * Take screenshot of the component
   */
  async takeComponentScreenshot(name: string): Promise<void> {
    await this.bannerContainer.screenshot({
      path: `reports/screenshots/banner-m-variant-${name}.png`,
    });
  }
}

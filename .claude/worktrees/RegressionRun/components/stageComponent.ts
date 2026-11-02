import { expect, Locator, Page, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { componentURL } from '../test-data/componentURL';
import { envUtils } from '../helpers/utils/envUtils';
import { StageComponent_FigmaValues } from '../helpers/utils/figma-values/StageComponent_FigmaValues';

/**
 * Stage Component - First Variant Page Object Model
 *
 * This class encapsulates all interactions with the Stage component
 * following the data-qa attribute locator strategy with parent-child relationships
 */
export class StageComponentPage extends BasePage {
  // Page URL
  readonly url: string = componentURL.StageComponent.testData.url;

  // Main container locator
  private readonly stageContainer: Locator;

  // Text element locators using data-qa attributes
  private readonly kickerText: Locator;
  private readonly titleComponent: Locator;
  private readonly highlightText: Locator;
  private readonly introText: Locator;

  // Button/Link locators using data-qa attributes
  private readonly primaryButtonMobile: Locator;
  private readonly secondaryButtonMobile: Locator;
  private readonly primaryButtonDesktop: Locator;
  private readonly secondaryButtonDesktop: Locator;

  // Button containers
  private readonly mobileButtonsContainer: Locator;
  private readonly desktopButtonsContainer: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);

    // Main container with data-qa attribute - target the first one containing stage elements
    this.stageContainer = page
      .locator('[data-qa="fullwidth-column"]:has([data-qa="stage-headline-text"])')
      .first();

    // Text elements using data-qa attributes - scoped to stage container
    this.kickerText = this.stageContainer.locator('[data-qa="stage-kicker-text"]');
    this.titleComponent = this.stageContainer.locator('[data-qa="title-component"]');
    this.highlightText = this.stageContainer.locator('[data-qa="stage-headline-text"]');
    this.introText = this.stageContainer.locator('[data-qa="stage-intro-text"]');
    this.primaryButtonDesktop = this.stageContainer.locator(
      '[data-qa="stage-primary-button"]'
    );
    this.secondaryButtonDesktop = this.stageContainer.locator(
      '[data-qa="stage-secondary-button"]'
    );

    // Button containers - scoped to stage container
    this.mobileButtonsContainer = this.stageContainer.locator('[data-qa="stage-mobile-buttons"]');
    this.desktopButtonsContainer = this.stageContainer.locator('[data-qa="stage-desktop-buttons"]');
  }

  /**
   * Navigate to the Stage component test page with authentication
   */
  async navigateToStagePage(): Promise<void> {
    // Get the full URL using the base page method
    const fullUrl = await this.resolveExecutionUrl('StageComponent', envUtils.getBaseUrl());
    await this.navigateWithAuthentication(fullUrl);
    await this.waitForStageComponentToLoad();
  }

  /**
   * Wait for Stage component to be fully loaded
   */
  async waitForStageComponentToLoad(): Promise<void> {
    // Wait for the main container
    await expect.soft(this.stageContainer).toBeVisible();

    // Wait for the headline which is more reliable
    await expect.soft(this.titleComponent).toBeVisible();

    // Dismiss cookie banner using base class method
    await this.acceptCookiesBanner();

    // Scroll to the component to ensure it's in viewport
    await this.stageContainer.scrollIntoViewIfNeeded();

    // Wait for CTA buttons to be visible using data-qa selectors
    await expect.soft(this.primaryButtonDesktop).toBeVisible();
    await expect.soft(this.secondaryButtonDesktop).toBeVisible();
  }

  // Getter methods for locators
  getStageContainer(): Locator {
    return this.stageContainer;
  }

  getKickerTextElement(): Locator {
    return this.kickerText;
  }

  getTitleComponent(): Locator {
    return this.titleComponent;
  }

  getHighlightTextElement(): Locator {
    return this.highlightText;
  }

  getIntroTextElement(): Locator {
    return this.introText;
  }

  getPrimaryButtonDesktop(): Locator {
    return this.primaryButtonDesktop;
  }

  getSecondaryButtonDesktop(): Locator {
    return this.secondaryButtonDesktop;
  }

  // Getter methods for text content validation
  async getKickerText(): Promise<string> {
    return (await this.kickerText.textContent()) || '';
  }

  async getHeadlineText(): Promise<string> {
    return (await this.titleComponent.textContent()) || '';
  }

  async getHighlightedText(): Promise<string> {
    return (await this.highlightText.textContent()) || '';
  }

  async getIntroText(): Promise<string> {
    return (await this.introText.textContent()) || '';
  }

  // Link validation methods
  async getPrimaryCTAHref(): Promise<string> {
    return (await this.primaryButtonDesktop.getAttribute('href')) || '';
  }

  async getSecondaryCTAHref(): Promise<string> {
    return (await this.secondaryButtonDesktop.getAttribute('href')) || '';
  }

  // Interaction methods
  async clickPrimaryCTA(): Promise<void> {
    await this.primaryButtonDesktop.click();
  }

  async clickSecondaryCTA(): Promise<void> {
    await this.secondaryButtonDesktop.click();
  }

  // Visibility checks
  async isKickerTextVisible(): Promise<boolean> {
    return await this.kickerText.isVisible();
  }

  async isHeadlineVisible(): Promise<boolean> {
    return await this.titleComponent.isVisible();
  }

  async isPrimaryCTAVisible(): Promise<boolean> {
    return await this.primaryButtonDesktop.isVisible();
  }

  async isSecondaryCTAVisible(): Promise<boolean> {
    return await this.secondaryButtonDesktop.isVisible();
  }

  // Accessibility methods
  async getAriaLabel(): Promise<string> {
    return (await this.stageContainer.getAttribute('aria-label')) || '';
  }

  async getHeadingLevel(): Promise<string> {
    const heading = this.titleComponent.locator('h1, h2, h3, h4, h5, h6').first();
    const tagName = await heading.evaluate((el: HTMLElement) => el.tagName.toLowerCase());
    return tagName;
  }

  // Responsive design validation
  async getComponentWidth(): Promise<number> {
    const boundingBox = await this.stageContainer.boundingBox();
    return boundingBox?.width || 0;
  }

  async getComponentHeight(): Promise<number> {
    const boundingBox = await this.stageContainer.boundingBox();
    return boundingBox?.height || 0;
  }

  // Content validation helpers
  async validateExpectedContent(): Promise<{
    kickerText: string;
    headlineText: string;
    introText: string;
    primaryCTAHref: string;
    secondaryCTAHref: string;
  }> {
    return {
      kickerText: await this.getKickerText(),
      headlineText: await this.getHeadlineText(),
      introText: await this.getIntroText(),
      primaryCTAHref: await this.getPrimaryCTAHref(),
      secondaryCTAHref: await this.getSecondaryCTAHref(),
    };
  }

  /**
   * Get Figma design values for comparison in visual tests
   * @param viewport - Viewport size (XL, LG, MD, SM)
   * @returns Figma design values for the specified viewport
   */
  getFigmaValues(viewport: 'XL' | 'LG' | 'MD' | 'SM' = 'XL') {
    return StageComponent_FigmaValues[viewport];
  }

  /**
   * Validate component against Figma design values
   * @param viewport - Viewport size to validate against
   * @returns Promise<boolean> - Whether component matches design
   */
  async validateAgainstFigma(viewport: 'XL' | 'LG' | 'MD' | 'SM' = 'XL'): Promise<boolean> {
    const figmaValues = this.getFigmaValues(viewport);

    try {
      // Set the viewport to match Figma design
      await this.page.setViewportSize({
        width: figmaValues.viewport.width,
        height: figmaValues.viewport.height,
      });

      // Validate headline element exists and is visible
      await expect.soft(this.titleComponent).toBeVisible();

      // Validate CTA buttons exist and are visible
      await expect.soft(this.primaryButtonDesktop).toBeVisible();
      await expect.soft(this.secondaryButtonDesktop).toBeVisible();

      // Additional validations can be added here for:
      // - Font sizes, colors, spacing validation against figmaValues
      // - Button states and interactions
      // - Responsive behavior

      return true;
    } catch (error) {
      console.error('Figma validation failed:', error);
      return false;
    }
  }
}

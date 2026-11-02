import { Page, expect, Locator, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';
import {
  CTA_FigmaValues,
  PrimaryCTAStates,
  SecondaryCTAStates,
  TextLinkCTAStates,
} from '../helpers/utils/figma-values/CTA_FigmaValues';

/**
 * CTA Component Page Object Model
 * Based on DOM inspection of the test page with authentication
 * Supports Primary, Secondary, and Text Link variations with all states
 */
export class CTAComponent extends BasePage {
  // Primary CTA Button Elements (data-qa based)
  readonly primaryCTADefault: Locator;
  readonly primaryCTAHover: Locator;
  readonly primaryCTAPressed: Locator;
  readonly primaryCTAFocus: Locator;

  // Secondary CTA Button Elements (data-qa based)
  readonly secondaryCTADefault: Locator;
  readonly secondaryCTAHover: Locator;
  readonly secondaryCTAPressed: Locator;
  readonly secondaryCTAFocus: Locator;

  // Text Link CTA Elements (data-qa based)
  readonly textLinkCTADefault: Locator;
  readonly textLinkCTAHover: Locator;
  readonly textLinkCTAPressed: Locator;
  readonly textLinkCTAFocus: Locator;

  // Container elements for comprehensive testing
  readonly ctaComponentContainer: Locator;
  readonly primaryCTASection: Locator;
  readonly secondaryCTASection: Locator;
  readonly textLinkCTASection: Locator;

  // Fallback selectors for elements without data-testid
  readonly allCTAButtons: Locator;
  readonly allCTALinks: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);

    // Primary CTA Button Locators (using data-qa="cta-button-primary")
    // From DOM inspection: Primary CTAs use data-qa="cta-button-primary"
    this.primaryCTADefault = page.locator('[data-qa="cta-button-primary"]').first();
    this.primaryCTAHover = page.locator('[data-qa="cta-button-primary"]').first();
    this.primaryCTAPressed = page.locator('[data-qa="cta-button-primary"]').first();
    this.primaryCTAFocus = page.locator('[data-qa="cta-button-primary"]').first();

    // Secondary CTA Button Locators (using data-qa="cta-button-secondary")
    // From DOM inspection: Secondary CTAs use data-qa="cta-button-secondary"
    this.secondaryCTADefault = page.locator('[data-qa="cta-button-secondary"]').first();
    this.secondaryCTAHover = page.locator('[data-qa="cta-button-secondary"]').first();
    this.secondaryCTAPressed = page.locator('[data-qa="cta-button-secondary"]').first();
    this.secondaryCTAFocus = page.locator('[data-qa="cta-button-secondary"]').first();

    // Text Link CTA Locators (using data-qa="cta-button-textLink")
    // From DOM inspection: Text Link CTAs use data-qa="cta-button-textLink"
    // Select the first visible and enabled text link
    this.textLinkCTADefault = page.locator('[data-qa="cta-button-textLink"]').first();
    this.textLinkCTAHover = page.locator('[data-qa="cta-button-textLink"]').first();
    this.textLinkCTAPressed = page.locator('[data-qa="cta-button-textLink"]').first();
    this.textLinkCTAFocus = page.locator('[data-qa="cta-button-textLink"]').first();

    // Container and section locators (updated to use data-qa)
    this.ctaComponentContainer = page.locator('[data-qa="columns255025"]'); // Main CTA container from DOM inspection
    this.primaryCTASection = page.locator('[data-qa="cta-button-primary"]').first().locator('..');
    this.secondaryCTASection = page
      .locator('[data-qa="cta-button-secondary"]')
      .first()
      .locator('..');
    this.textLinkCTASection = page.locator('[data-qa="cta-button-textLink"]').first().locator('..');

    // Fallback selectors for comprehensive coverage (updated to include data-qa)
    this.allCTAButtons = page.locator(
      '[data-qa*="cta-button"], button[class*="cta"], a[role="button"][data-qa*="cta"]'
    );
    this.allCTALinks = page.locator('[data-qa*="cta-button"]:not([role="button"])');
  }

  /**
   * Navigate to CTA component test page with authentication
   */
  async navigateToComponent(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('CTAComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForNetworkIdle();
  }

  /**
   * Wait for all CTA elements to be loaded and visible
   */
  async waitForCTAComponentsToLoad(): Promise<void> {
    await this.waitForNetworkIdle();

    // Wait for at least one CTA element to be visible (using data-qa selector)
    await this.page.locator('[data-qa="cta-button-primary"]').first().waitFor({ state: 'visible' });
  }

  /**
   * Verify Primary CTA Button Typography
   */
  async verifyPrimaryCTATypography(
    ctaState: 'Default' | 'Hover' | 'Pressed' | 'Focus' = 'Default'
  ): Promise<void> {
    const locator = this.getPrimaryCTALocator(ctaState);
    const expectedValues = PrimaryCTAStates[ctaState];

    await this.validateFontFamilyCSS(locator, expectedValues.typography.fontFamily);
    await expect.soft(locator).toHaveCSS('font-size', expectedValues.typography.fontSize);
    await expect.soft(locator).toHaveCSS('font-weight', expectedValues.typography.fontWeight);
    await expect.soft(locator).toHaveCSS('line-height', expectedValues.typography.lineHeight);
  }

  /**
   * Verify Primary CTA Button Colors
   */
  async verifyPrimaryCTAColors(
    ctaState: 'Default' | 'Hover' | 'Pressed' | 'Focus' = 'Default'
  ): Promise<void> {
    const locator = this.getPrimaryCTALocator(ctaState);
    const expectedValues = PrimaryCTAStates[ctaState];

    await this.validateColorCSS(locator, 'color', expectedValues.colors.text);
    await this.validateColorCSS(locator, 'background-color', expectedValues.colors.background);
    if (expectedValues.colors.border !== 'transparent') {
      await this.validateColorCSS(locator, 'border-color', expectedValues.colors.border);
    }
  }

  /**
   * Verify Secondary CTA Button Typography
   */
  async verifySecondaryCTATypography(
    ctaState: 'Default' | 'Hover' | 'Pressed' | 'Focus' = 'Default'
  ): Promise<void> {
    const locator = this.getSecondaryCTALocator(ctaState);
    const expectedValues = SecondaryCTAStates[ctaState];

    await this.validateFontFamilyCSS(locator, expectedValues.typography.fontFamily);
    await expect.soft(locator).toHaveCSS('font-size', expectedValues.typography.fontSize);
    await expect.soft(locator).toHaveCSS('font-weight', expectedValues.typography.fontWeight);
    await expect.soft(locator).toHaveCSS('line-height', expectedValues.typography.lineHeight);
    await expect.soft(locator).toHaveCSS('letter-spacing', expectedValues.typography.letterSpacing);
  }

  /**
   * Verify Secondary CTA Button Colors
   */
  async verifySecondaryCTAColors(
    ctaState: 'Default' | 'Hover' | 'Pressed' | 'Focus' = 'Default'
  ): Promise<void> {
    const locator = this.getSecondaryCTALocator(ctaState);
    const expectedValues = SecondaryCTAStates[ctaState];

    await this.validateColorCSS(locator, 'color', expectedValues.colors.text);
    await this.validateColorCSS(locator, 'background-color', expectedValues.colors.background);
    await this.validateColorCSS(locator, 'border-color', expectedValues.colors.border);
  }

  /**
   * Verify Text Link CTA Typography
   */
  async verifyTextLinkCTATypography(
    ctaState: 'Default' | 'Hover' | 'Pressed' | 'Focus' = 'Default'
  ): Promise<void> {
    const locator = this.getTextLinkCTALocator(ctaState);
    const expectedValues = TextLinkCTAStates[ctaState];

    await this.validateFontFamilyCSS(locator, expectedValues.typography.fontFamily);
    await expect.soft(locator).toHaveCSS('font-size', expectedValues.typography.fontSize);
    await expect.soft(locator).toHaveCSS('font-weight', expectedValues.typography.fontWeight);
    await expect.soft(locator).toHaveCSS('line-height', expectedValues.typography.lineHeight);
    await expect.soft(locator).toHaveCSS('letter-spacing', expectedValues.typography.letterSpacing);
  }

  /**
   * Verify Text Link CTA Colors
   */
  async verifyTextLinkCTAColors(
    ctaState: 'Default' | 'Hover' | 'Pressed' | 'Focus' = 'Default'
  ): Promise<void> {
    const locator = this.getTextLinkCTALocator(ctaState);
    const expectedValues = TextLinkCTAStates[ctaState];

    await this.validateColorCSS(locator, 'color', expectedValues.colors.text);
    if (expectedValues.colors.background !== 'transparent') {
      await this.validateColorCSS(locator, 'background-color', expectedValues.colors.background);
    }
  }

  /**
   * Simulate hover interaction on Primary CTA
   */
  async hoverPrimaryCTA(
    ctaState: 'Default' | 'Hover' | 'Pressed' | 'Focus' = 'Default'
  ): Promise<void> {
    const locator = this.getPrimaryCTALocator(ctaState);
    await locator.hover();
    await this.page.waitForTimeout(300); // Allow for hover transition
  }

  /**
   * Simulate focus interaction on Primary CTA
   */
  async focusPrimaryCTA(
    ctaState: 'Default' | 'Hover' | 'Pressed' | 'Focus' = 'Default'
  ): Promise<void> {
    const locator = this.getPrimaryCTALocator(ctaState);
    await locator.focus();
    await this.page.waitForTimeout(300); // Allow for focus transition
  }

  /**
   * Click Primary CTA button
   */
  async clickPrimaryCTA(
    ctaState: 'Default' | 'Hover' | 'Pressed' | 'Focus' = 'Default'
  ): Promise<void> {
    const locator = this.getPrimaryCTALocator(ctaState);
    await locator.click();
  }

  /**
   * Click Secondary CTA button
   */
  async clickSecondaryCTA(
    ctaState: 'Default' | 'Hover' | 'Pressed' | 'Focus' = 'Default'
  ): Promise<void> {
    const locator = this.getSecondaryCTALocator(ctaState);
    await locator.click();
  }

  /**
   * Click Text Link CTA
   */
  async clickTextLinkCTA(
    ctaState: 'Default' | 'Hover' | 'Pressed' | 'Focus' = 'Default'
  ): Promise<void> {
    const locator = this.getTextLinkCTALocator(ctaState);
    await locator.click();
  }

  /**
   * Verify CTA is clickable/accessible (only for enabled elements)
   */
  async verifyCTAAccessibility(locator: Locator): Promise<void> {
    await expect.soft(locator).toBeVisible();

    // Check if element is disabled first, skip if disabled since we're not testing disabled states
    const isDisabled = await locator.getAttribute('aria-disabled');
    const tabIndex = await locator.getAttribute('tabindex');

    // Skip disabled elements since disabled state testing is out of scope
    if (isDisabled === 'true' || tabIndex === '-1') {
      return;
    }

    await expect.soft(locator).toBeEnabled();

    // Check for proper ARIA attributes
    const role = await locator.getAttribute('role');

    // Verify role is either button or link
    expect.soft(['button', 'link', null]).toContain(role);

    // Verify tabindex allows keyboard navigation (should not be -1 unless specifically disabled)
    if (tabIndex !== null) {
      expect.soft(parseInt(tabIndex)).toBeGreaterThanOrEqual(0);
    }
  }

  /**
   * Get all visible and enabled CTA elements on the page (excludes disabled elements)
   */
  async getAllVisibleCTAElements(): Promise<Locator[]> {
    const allCTAs = await this.allCTAButtons.all();
    const visibleEnabledCTAs: Locator[] = [];

    for (const cta of allCTAs) {
      if (await cta.isVisible()) {
        // Check if element is disabled
        const isDisabled = await cta.getAttribute('aria-disabled');
        const tabIndex = await cta.getAttribute('tabindex');

        // Skip disabled elements since disabled state testing is out of scope
        if (isDisabled !== 'true' && tabIndex !== '-1') {
          visibleEnabledCTAs.push(cta);
        }
      }
    }

    return visibleEnabledCTAs;
  }

  /**
   * Verify minimum touch target size for mobile accessibility
   */
  async verifyTouchTargetSize(locator: Locator): Promise<void> {
    const boundingBox = await locator.boundingBox();
    expect.soft(boundingBox).not.toBeNull();

    if (boundingBox) {
      expect.soft(boundingBox.width).toBeGreaterThanOrEqual(44);
      expect.soft(boundingBox.height).toBeGreaterThanOrEqual(44);
    }
  }

  /**
   * Helper method to get Primary CTA locator by state
   */
  private getPrimaryCTALocator(state: 'Default' | 'Hover' | 'Pressed' | 'Focus'): Locator {
    switch (state) {
      case 'Default':
        return this.primaryCTADefault;
      case 'Hover':
        return this.primaryCTAHover;
      case 'Pressed':
        return this.primaryCTAPressed;
      case 'Focus':
        return this.primaryCTAFocus;
      default:
        return this.primaryCTADefault;
    }
  }

  /**
   * Helper method to get Secondary CTA locator by state
   */
  private getSecondaryCTALocator(state: 'Default' | 'Hover' | 'Pressed' | 'Focus'): Locator {
    switch (state) {
      case 'Default':
        return this.secondaryCTADefault;
      case 'Hover':
        return this.secondaryCTAHover;
      case 'Pressed':
        return this.secondaryCTAPressed;
      case 'Focus':
        return this.secondaryCTAFocus;
      default:
        return this.secondaryCTADefault;
    }
  }

  /**
   * Helper method to get Text Link CTA locator by state
   */
  private getTextLinkCTALocator(state: 'Default' | 'Hover' | 'Pressed' | 'Focus'): Locator {
    switch (state) {
      case 'Default':
        return this.textLinkCTADefault;
      case 'Hover':
        return this.textLinkCTAHover;
      case 'Pressed':
        return this.textLinkCTAPressed;
      case 'Focus':
        return this.textLinkCTAFocus;
      default:
        return this.textLinkCTADefault;
    }
  }

  /**
   * Take screenshot for visual regression testing
   */
  async takeComponentScreenshot(screenshotName: string): Promise<void> {
    await this.ctaComponentContainer.screenshot({
      path: `reports/screenshots/${screenshotName}.png`,
      type: 'png',
    });
  }

  /**
   * Measure and validate performance metrics
   */
  async measureCTAPerformance(): Promise<{
    loadTime: number;
    interactionDelay: number;
    animationDuration: number;
  }> {
    const startTime = Date.now();
    await this.waitForCTAComponentsToLoad();
    const loadTime = Date.now() - startTime;

    // Measure actual interaction responsiveness (DOM update time)
    const interactionStart = performance.now();
    await this.primaryCTADefault.hover(); // Remove timeout - let it complete naturally
    const interactionDelay = performance.now() - interactionStart;

    // Measure CSS animation duration by monitoring computed styles
    const animationDuration = await this.page.evaluate(async () => {
      const element = document.querySelector('[data-testid="cta-primary-default"]') as HTMLElement;
      if (!element) return 0;

      const startTime = performance.now();

      // Trigger hover state and measure CSS transition duration
      element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      // Wait for transition to complete by monitoring computed styles
      const computedStyle = window.getComputedStyle(element);
      const transitionDuration = computedStyle.transitionDuration || '0s';

      // Parse transition duration (e.g., "0.3s" -> 300ms)
      const duration =
        parseFloat(transitionDuration) * (transitionDuration.includes('ms') ? 1 : 1000);

      // Return actual CSS animation time, not artificial wait time
      return Math.max(duration, performance.now() - startTime);
    });

    return {
      loadTime,
      interactionDelay,
      animationDuration,
    };
  }
}

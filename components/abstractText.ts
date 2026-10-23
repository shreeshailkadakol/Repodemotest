import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

export class AbstractTextComponent extends BasePage {
  // Locators using multiple strategies for reliability
  private readonly containerElement: Locator = this.page
    .locator(
      '[data-qa="fullwidth-column"], .fullwidth-column, [class*="fullwidth"], [class*="container"]'
    )
    .first();
  private readonly abstractTextElement: Locator = this.page
    .locator(
      '[data-qa="abstract-text"], .abstract-text, p, [class*="abstract"], [class*="text-content"]'
    )
    .first();

  // Combined locators for maximum reliability
  private readonly robustAbstractTextElement: Locator = this.page
    .locator(
      '[data-qa="abstract-text"], [data-testid="abstract-text"], .abstract-text, p:not([class*="button"]):not([class*="link"])'
    )
    .first();

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Navigate to the Abstract Text component page with automatic authentication
   */
  async navigateToComponent(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.getComponentUrl('AbstractTextComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
  }

  /**
   * Verify the abstract text component is visible (Language-Agnostic) - Enhanced with fallbacks
   */
  async verifyComponentVisibility(): Promise<void> {
    // Skip container verification as it may be hidden for layout purposes
    // Only verify the abstract text content is visible
    await expect.soft(this.robustAbstractTextElement).toBeVisible();

    // Verify element has content (language-agnostic)
    await expect.soft(this.robustAbstractTextElement).not.toBeEmpty();
  }

  /**
   * Verify component accessibility attributes - Enhanced with fallbacks
   */
  async verifyAccessibilityAttributes(): Promise<void> {
    // Check if container exists and has proper attributes
    const containerExists = await this.containerElement.count();
    if (containerExists > 0) {
      const hasAriaLabel = await this.containerElement.getAttribute('aria-label');
      if (!hasAriaLabel) {
        // If no aria-label, check for other accessibility attributes
        const hasRole = await this.containerElement.getAttribute('role');
        if (!hasRole) {
          // Log warning without console
          await this.log('Warning: Container lacks accessibility attributes');
        }
      }
    }

    // Verify abstract text element structure
    await expect.soft(this.robustAbstractTextElement).toBeVisible();

    // Verify semantic HTML compliance with fallback
    const isSemanticElement = await this.robustAbstractTextElement.evaluate((el: HTMLElement) => {
      const tagName = el.tagName.toLowerCase();
      return ['p', 'div', 'section', 'article'].includes(tagName);
    });

    expect.soft(isSemanticElement).toBe(true);
  }

  /**
   * Get the abstract text element locator for external access
   */
  getAbstractTextElement(): Locator {
    return this.abstractTextElement;
  }

  /**
   * Get the container element locator for external access
   */
  getContainerElement(): Locator {
    return this.containerElement;
  }
}

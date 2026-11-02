import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';

export class Footer extends BasePage {
  private readonly copyrightText: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
    this.copyrightText = this.page.locator('[data-qa="footer-copyright"]');
  }

  async scrollToFooter(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    // Wait for scroll to complete by waiting for footer element to be stable
    await this.copyrightText.waitFor({ state: 'visible', timeout: 5000 });
  }

  async validateCopyright(): Promise<void> {
    // Scroll to footer first to ensure element is in view
    await this.scrollToFooter();

    // Wait for copyright text to be visible
    await this.copyrightText.waitFor({ state: 'visible' });
    const copyrightContent = await this.copyrightText.textContent();

    // Check if copyright text exists and is not empty
    if (!copyrightContent || copyrightContent.trim() === '') {
      throw new Error('Copyright text is empty or missing');
    }
  }

  async validateBasicAccessibility(): Promise<void> {
    await this.scrollToFooter();

    // Basic check: copyright text is visible and has content
    await expect.soft(this.copyrightText).toBeVisible();
    const textContent = await this.copyrightText.textContent();
    expect.soft(textContent?.trim()).toBeTruthy();
  }
}

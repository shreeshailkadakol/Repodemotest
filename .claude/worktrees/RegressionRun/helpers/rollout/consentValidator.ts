/**
 * Consent Validator
 * Validates consent script and banner integration
 * Based on Azure DevOps ticket 256
 */

import { Page, expect } from '@playwright/test';
import { rolloutConfig } from '../../config/rollout-config';

export interface ConsentValidationResult {
  scriptLoaded: boolean;
  bannerAppears: boolean;
  acceptButtonVisible: boolean;
  rejectButtonVisible: boolean;
  manageButtonVisible: boolean;
  cookiesBeforeConsent: string[];
  cookiesAfterConsent: string[];
  isValid: boolean;
  errors: string[];
}

export class ConsentValidator {
  private page: Page;
  private config = rolloutConfig.consent;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Perform complete consent validation
   */
  async validateConsent(): Promise<ConsentValidationResult> {
    const errors: string[] = [];
    let scriptLoaded = false;
    let bannerAppears = false;
    let acceptButtonVisible = false;
    let rejectButtonVisible = false;
    let manageButtonVisible = false;
    const cookiesBeforeConsent: string[] = [];
    const cookiesAfterConsent: string[] = [];

    try {
      // Check if consent script is loaded
      scriptLoaded = await this.isConsentScriptLoaded();
      if (!scriptLoaded) {
        errors.push('Consent script not loaded');
      }

      // Check if consent banner appears
      bannerAppears = await this.isConsentBannerVisible();
      if (!bannerAppears) {
        errors.push('Consent banner not visible');
      }

      // Check buttons visibility
      if (bannerAppears) {
        acceptButtonVisible = await this.isButtonVisible(this.config.acceptButtonSelector);
        rejectButtonVisible = await this.isButtonVisible(this.config.rejectButtonSelector || '');
        manageButtonVisible = await this.isButtonVisible(this.config.manageButtonSelector || '');

        if (!acceptButtonVisible) {
          errors.push('Accept button not found');
        }
      }

      // Get cookies before consent
      const initialCookies = await this.page.context().cookies();
      cookiesBeforeConsent.push(...initialCookies.map((c) => c.name));
    } catch (error: any) {
      errors.push(`Consent validation error: ${error.message}`);
    }

    return {
      scriptLoaded,
      bannerAppears,
      acceptButtonVisible,
      rejectButtonVisible,
      manageButtonVisible,
      cookiesBeforeConsent,
      cookiesAfterConsent,
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if consent script is loaded
   */
  private async isConsentScriptLoaded(): Promise<boolean> {
    return await this.page.evaluate((scriptUrl) => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.some((script) => script.src.includes(scriptUrl));
    }, this.config.scriptUrl);
  }

  /**
   * Check if consent banner is visible
   */
  private async isConsentBannerVisible(): Promise<boolean> {
    try {
      const banner = this.page.locator(this.config.bannerSelector);
      // Wait longer for OneTrust banner to load asynchronously
      await banner.waitFor({ state: 'visible', timeout: 15000 });
      return await banner.isVisible();
    } catch {
      // Banner might not appear if consent was already given
      return false;
    }
  }

  /**
   * Check if button is visible
   */
  private async isButtonVisible(selector: string): Promise<boolean> {
    if (!selector) return false;

    try {
      // Wait for button to be in DOM first
      await this.page.waitForSelector(selector, { state: 'attached', timeout: 10000 });
      // Then check visibility
      const button = this.page.locator(selector);
      return await button.isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }

  /**
   * Accept consent
   */
  async acceptConsent(): Promise<void> {
    const acceptButton = this.page.locator(this.config.acceptButtonSelector);
    await acceptButton.waitFor({ state: 'visible', timeout: 10000 });
    await acceptButton.click();

    // Wait for banner to disappear
    await this.page.waitForTimeout(1000);
  }

  /**
   * Reject consent
   */
  async rejectConsent(): Promise<void> {
    if (!this.config.rejectButtonSelector) {
      throw new Error('Reject button selector not configured');
    }

    const rejectButton = this.page.locator(this.config.rejectButtonSelector);
    await rejectButton.waitFor({ state: 'visible', timeout: 10000 });
    await rejectButton.click();

    // Wait for banner to disappear
    await this.page.waitForTimeout(1000);
  }

  /**
   * Validate analytics behavior before consent
   */
  async validateAnalyticsBeforeConsent(): Promise<boolean> {
    // Check if analytics cookies are NOT set before consent
    const cookies = await this.page.context().cookies();
    const analyticsCookies = cookies.filter((c) => 
      c.name.includes('_ga') || 
      c.name.includes('_gid') || 
      c.name.includes('_gtm')
    );

    return analyticsCookies.length === 0;
  }

  /**
   * Validate analytics behavior after consent
   */
  async validateAnalyticsAfterConsent(): Promise<boolean> {
    // Check if analytics cookies ARE set after accepting consent
    await this.page.waitForTimeout(2000); // Wait for analytics to initialize

    const cookies = await this.page.context().cookies();
    const analyticsCookies = cookies.filter((c) => 
      c.name.includes('_ga') || 
      c.name.includes('_gid') || 
      c.name.includes('_gtm')
    );

    return analyticsCookies.length > 0;
  }

  /**
   * Generate consent report
   */
  generateReport(result: ConsentValidationResult, language: string): string {
    let report = `\n========== CONSENT VALIDATION REPORT (${language}) - ADO #256 ==========\n`;
    report += `Page: ${this.page.url()}\n\n`;

    report += `Consent Script Loaded: ${result.scriptLoaded ? '✓' : '✗'}\n`;
    report += `Banner Appears: ${result.bannerAppears ? '✓' : '✗'}\n`;
    report += `Accept Button Visible: ${result.acceptButtonVisible ? '✓' : '✗'}\n`;
    report += `Reject Button Visible: ${result.rejectButtonVisible ? '✓' : '✗'}\n`;
    report += `Manage Button Visible: ${result.manageButtonVisible ? '✓' : '✗'}\n`;

    report += `\nCookies Before Consent (${result.cookiesBeforeConsent.length}):\n`;
    result.cookiesBeforeConsent.forEach((cookie) => {
      report += `  - ${cookie}\n`;
    });

    if (result.errors.length > 0) {
      report += `\nErrors:\n`;
      result.errors.forEach((error) => {
        report += `  - ${error}\n`;
      });
    }

    report += `\nStatus: ${result.isValid ? '✓ PASS' : '✗ FAIL'}\n`;

    return report;
  }
}

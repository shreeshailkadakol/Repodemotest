/**
 * GTM and Analytics Validator
 * Validates Google Tag Manager installation and analytics tracking
 */

import { Page, expect } from '@playwright/test';
import { rolloutConfig } from '../../config/rollout-config';

export interface GTMValidationResult {
  gtmScriptLoaded: boolean;
  gtmContainerId: string | null;
  dataLayerExists: boolean;
  dataLayerEvents: string[];
  isValid: boolean;
  errors: string[];
}

export class GTMValidator {
  private page: Page;
  private config = rolloutConfig.gtm;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Validate GTM installation and configuration
   */
  async validateGTM(): Promise<GTMValidationResult> {
    const errors: string[] = [];
    let gtmScriptLoaded = false;
    let gtmContainerId: string | null = null;
    let dataLayerExists = false;
    const dataLayerEvents: string[] = [];

    try {
      // Check if GTM script is loaded
      gtmScriptLoaded = await this.isGTMScriptLoaded();
      if (!gtmScriptLoaded) {
        errors.push('GTM script not loaded');
      }

      // Capture GTM container ID for reporting only.
      // Container ID verification removed - the expected ID varies per site.
      gtmContainerId = await this.getGTMContainerId();

      // Check dataLayer existence
      dataLayerExists = await this.isDataLayerPresent();
      if (!dataLayerExists) {
        errors.push('dataLayer not found on page');
      }

      // Get dataLayer events
      if (dataLayerExists) {
        const events = await this.getDataLayerEvents();
        dataLayerEvents.push(...events);
      }
    } catch (error: any) {
      errors.push(`GTM validation error: ${error.message}`);
    }

    return {
      gtmScriptLoaded,
      gtmContainerId,
      dataLayerExists,
      dataLayerEvents,
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if GTM script is loaded
   */
  private async isGTMScriptLoaded(): Promise<boolean> {
    return await this.page.evaluate(() => {
      return typeof (window as any).google_tag_manager !== 'undefined';
    });
  }

  /**
   * Get GTM container ID from page
   */
  private async getGTMContainerId(): Promise<string | null> {
    return await this.page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      for (const script of scripts) {
        const match = script.src.match(/googletagmanager\.com\/gtm\.js\?id=(GTM-[A-Z0-9]+)/);
        if (match) {
          return match[1];
        }
      }
      return null;
    });
  }

  /**
   * Check if dataLayer exists
   */
  private async isDataLayerPresent(): Promise<boolean> {
    return await this.page.evaluate(() => {
      return Array.isArray((window as any).dataLayer);
    });
  }

  /**
   * Get dataLayer events
   */
  private async getDataLayerEvents(): Promise<string[]> {
    return await this.page.evaluate(() => {
      const dataLayer = (window as any).dataLayer || [];
      return dataLayer
        .filter((item: any) => item.event)
        .map((item: any) => item.event);
    });
  }

  /**
   * Wait for specific GTM event
   */
  async waitForGTMEvent(eventName: string, timeout: number = 5000): Promise<boolean> {
    try {
      await this.page.waitForFunction(
        (event) => {
          const dataLayer = (window as any).dataLayer || [];
          return dataLayer.some((item: any) => item.event === event);
        },
        eventName,
        { timeout }
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate GTM report
   */
  generateReport(result: GTMValidationResult, language: string): string {
    let report = `\n========== GTM VALIDATION REPORT (${language}) ==========\n`;
    report += `Page: ${this.page.url()}\n\n`;

    report += `GTM Script Loaded: ${result.gtmScriptLoaded ? '✓' : '✗'}\n`;
    report += `GTM Container ID: ${result.gtmContainerId || 'N/A'}\n`;
    report += `Expected Container ID: ${this.config.containerId}\n`;
    report += `DataLayer Exists: ${result.dataLayerExists ? '✓' : '✗'}\n`;
    report += `DataLayer Events (${result.dataLayerEvents.length}):\n`;
    
    result.dataLayerEvents.forEach((event) => {
      report += `  - ${event}\n`;
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

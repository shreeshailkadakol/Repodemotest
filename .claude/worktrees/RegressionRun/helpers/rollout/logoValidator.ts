/**
 * Logo Validator
 * Validates Bayer logo color (white) and visibility
 */

import { Page, expect } from '@playwright/test';
import { rolloutConfig } from '../../config/rollout-config';

export interface LogoValidationResult {
  logoVisible: boolean;
  logoColor: string | null;
  isWhite: boolean;
  logoSrc: string | null;
  logoAlt: string | null;
  isValid: boolean;
  errors: string[];
}

export class LogoValidator {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Perform complete logo validation
   */
  async validateLogo(): Promise<LogoValidationResult> {
    const errors: string[] = [];
    let logoVisible = false;
    let logoColor: string | null = null;
    let isWhite = false;
    let logoSrc: string | null = null;
    let logoAlt: string | null = null;

    try {
      // Check if logo is visible
      const logoSelector = rolloutConfig.logo.selector;
      const logo = this.page.locator(logoSelector).first();

      // Wait for logo to be attached and visible (increased timeout for slow-loading sites)
      try {
        await logo.waitFor({ state: 'attached', timeout: 15000 });
        await logo.waitFor({ state: 'visible', timeout: 10000 });
        logoVisible = true;
      } catch (error) {
        logoVisible = false;
      }

      if (!logoVisible) {
        errors.push('Logo not visible');
        return { logoVisible, logoColor, isWhite, logoSrc, logoAlt, isValid: false, errors };
      }

      // Get logo attributes
      logoSrc = await logo.getAttribute('src');
      logoAlt = await logo.getAttribute('alt');

      // Check if logo uses white color
      isWhite = await this.isLogoWhite(logo);
      logoColor = isWhite ? 'white' : 'other';

      if (!isWhite && rolloutConfig.logo.expectedColor === 'white') {
        errors.push('Logo is not white as expected');
      }

      if (!logoAlt) {
        errors.push('Logo missing alt attribute');
      }
    } catch (error: any) {
      errors.push(`Logo validation error: ${error.message}`);
    }

    return {
      logoVisible,
      logoColor,
      isWhite,
      logoSrc,
      logoAlt,
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if logo is white using CSS computed styles
   */
  private async isLogoWhite(logo: any): Promise<boolean> {
    try {
      // Method 1: Check if image is SVG with white fill/stroke
      const tagName = await logo.evaluate((el: Element) => el.tagName.toLowerCase());

      if (tagName === 'svg') {
        const fill = await logo.evaluate((el: SVGElement) => {
          return window.getComputedStyle(el).fill;
        });
        return this.isColorWhite(fill);
      }

      // Method 2: Check if parent container has white color filter
      const filter = await logo.evaluate((el: Element) => {
        return window.getComputedStyle(el).filter;
      });

      if (filter && filter.includes('brightness')) {
        // High brightness can indicate white
        return true;
      }

      // Method 3: Check if image URL contains 'white' or 'light'
      const src = await logo.getAttribute('src');
      if (src && (src.includes('white') || src.includes('light'))) {
        return true;
      }

      // Method 4: Visual inspection using screenshot (advanced)
      // This would require image analysis - placeholder for future enhancement
      // const screenshot = await logo.screenshot();
      // return this.analyzeImageColor(screenshot);

      // Default: Cannot determine definitively
      console.warn('[Logo Validator] Unable to definitively determine logo color');
      return false;
    } catch (error) {
      console.error('[Logo Validator] Error checking logo color:', error);
      return false;
    }
  }

  /**
   * Check if CSS color value represents white
   */
  private isColorWhite(color: string): boolean {
    if (!color) return false;

    const whiteVariants = [
      'rgb(255, 255, 255)',
      'rgba(255, 255, 255, 1)',
      '#ffffff',
      '#fff',
      'white',
    ];

    return whiteVariants.some((variant) => 
      color.toLowerCase().replace(/\s/g, '') === variant.toLowerCase().replace(/\s/g, '')
    );
  }

  /**
   * Validate logo is clickable and links to homepage
   */
  async validateLogoClickability(): Promise<{ isClickable: boolean; href: string | null }> {
    try {
      const logoSelector = rolloutConfig.logo.selector;
      const logoLink = this.page.locator(logoSelector).locator('xpath=ancestor::a').first();

      const isClickable = await logoLink.isVisible({ timeout: 2000 }).catch(() => false);
      const href = isClickable ? await logoLink.getAttribute('href') : null;

      return { isClickable, href };
    } catch {
      return { isClickable: false, href: null };
    }
  }

  /**
   * Advanced: Analyze screenshot to detect white color
   * Requires image processing library like sharp or jimp
   * Placeholder implementation
   */
  private async analyzeImageColor(screenshot: Buffer): Promise<boolean> {
    // TODO: Implement pixel-level color analysis
    // 1. Load screenshot buffer
    // 2. Sample pixel colors from center region
    // 3. Check if majority of pixels are white (RGB values close to 255)
    // 4. Return true if > 80% pixels are white

    console.warn('[Logo Validator] Image color analysis not yet implemented');
    return false;
  }

  /**
   * Generate logo report
   */
  generateReport(result: LogoValidationResult, language: string): string {
    let report = `\n========== LOGO VALIDATION REPORT (${language}) ==========\n`;
    report += `Page: ${this.page.url()}\n\n`;

    report += `Logo Visible: ${result.logoVisible ? '✓' : '✗'}\n`;
    report += `Logo Color: ${result.logoColor || 'N/A'}\n`;
    report += `Is White: ${result.isWhite ? '✓' : '✗'}\n`;
    report += `Logo Source: ${result.logoSrc || 'N/A'}\n`;
    report += `Logo Alt Text: ${result.logoAlt || 'N/A'}\n`;

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

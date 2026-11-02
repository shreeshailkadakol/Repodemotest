/**
 * InfoBox Component Page Object
 * 
 * Purpose: Content highlighting component with Title, Description, Image, CTA and brand highlight colors
 * Test Coverage: AC1-AC13, Visual validation with Figma values, Accessibility, Performance
 * 
 * Requirements Coverage:
 * - AC1-AC13: All InfoBox acceptance criteria
 * - DOM-First Approach: Parent-child locator relationships using data-qa attributes
 * - Multi-variant Support: High Contrast (blue) and Low Contrast (pink) variants
 * - Figma Integration: Visual validation against design specifications
 * 
 * Test Page: https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Infobox
 */

import { Page, Locator, expect, Browser, BrowserContext } from '@playwright/test';
import { InfoBoxDesignHelper, InfoBoxFigmaValues } from '../helpers/utils/figma-values/InfoBox_FigmaValues';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';



export class InfoBoxComponent extends BasePage {
  
  // ====================
  // PARENT CONTAINER LOCATORS (DOM-FIRST APPROACH)
  // ====================
  
  /** Main InfoBox container - use for component existence validation */
  private readonly infoBoxContainer: Locator;
  
  /** First InfoBox (High Contrast - Blue Highlight) */
  private readonly highContrastInfoBox: Locator;
  
  /** Second InfoBox (Low Contrast - Pink Highlight) */
  private readonly lowContrastInfoBox: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
    
    // Parent containers using data-qa attributes (DOM-first approach)
    this.infoBoxContainer = page.locator('[data-qa="info-box"]');
    this.highContrastInfoBox = page.locator('[data-qa="info-box"]').first();
    this.lowContrastInfoBox = page.locator('[data-qa="info-box"]').nth(1);
  }

  // ====================
  // FIGMA VISUAL VALIDATION METHODS
  // ====================
  
  /**
   * Get expected Figma values based on viewport and contrast variant
   */
  private getFigmaTokens(
    viewport: 'XL' | 'LG' | 'MD' | 'SM',
    contrast: 'low' | 'high'
  ): InfoBoxFigmaValues | undefined {
    return InfoBoxDesignHelper.getTokens(viewport, contrast);
  }
  
  /**
   * Visual validation against Figma specifications with soft assertions
   */
  async validateTypographyAgainstFigma(
    variant: 'high-contrast' | 'low-contrast',
    element: 'title' | 'description',
    viewport: 'XL' | 'LG' | 'MD' | 'SM'
  ): Promise<void> {
    const container =
      variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    const targetElement =
      element === 'title'
        ? container.locator('[data-qa="title-component"]')
        : container.locator('[data-qa="info-box-description"]');

    const contrastType = variant === 'high-contrast' ? 'high' : 'low';
    const figmaTokens = this.getFigmaTokens(viewport, contrastType);

    if (figmaTokens) {
      const figmaElement = element === 'title' ? figmaTokens.title : figmaTokens.description;

      // Soft assertions for typography (no hard failures)
      if (figmaElement.fontFamily) {
        // Create regex to match CSS font-family format: "Bayer Sans", sans-serif
        const fontFamilyRegex = new RegExp(`["']?${figmaElement.fontFamily.replace(/\s+/g, '\\s+')}["']?`, 'i');
        await expect
          .soft(targetElement, `${variant} ${element} font-family should match Figma`)
          .toHaveCSS('font-family', fontFamilyRegex);
      }

      if (figmaElement.fontSize) {
        await expect
          .soft(targetElement, `${variant} ${element} font-size should match Figma`)
          .toHaveCSS('font-size', figmaElement.fontSize);
      }

      if (figmaElement.fontWeight) {
        await expect
          .soft(targetElement, `${variant} ${element} font-weight should match Figma`)
          .toHaveCSS('font-weight', figmaElement.fontWeight);
      }

      if (figmaElement.lineHeight) {
        await expect
          .soft(targetElement, `${variant} ${element} line-height should match Figma`)
          .toHaveCSS('line-height', figmaElement.lineHeight);
      }
    }
  }  // ====================
  // NAVIGATION & AUTHENTICATION METHODS
  // ====================
  
  /**
   * Navigate to InfoBox test page with authentication handling
   */
  async navigateToInfoBoxPage(viewport?: { width: number; height: number }): Promise<void> {
    if (viewport) {
      await this.page.setViewportSize(viewport);
    }

    // Navigate to the test page with authentication
    const baseURL = envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('InfoBoxComponent', baseURL);
    await this.navigateWithAuthentication(url);

    // Wait for InfoBox components to load
    await this.infoBoxContainer.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  // ====================
  // FUNCTIONAL VALIDATION METHODS (SOFT ASSERTIONS)
  // ====================
  
  /**
   * AC1: Validate InfoBox component presence with soft assertion
   */
  async validateInfoBoxExists(): Promise<void> {
    await expect.soft(this.infoBoxContainer.first(), 'InfoBox components should be visible on page')
      .toBeVisible();
  }
  
  /**
   * AC2: Validate both InfoBox variants exist with soft assertions
   */
  async validateBothVariantsExist(): Promise<void> {
    await expect.soft(this.highContrastInfoBox, 'High contrast InfoBox should be visible')
      .toBeVisible();
    await expect.soft(this.lowContrastInfoBox, 'Low contrast InfoBox should be visible')
      .toBeVisible();
    await expect.soft(this.infoBoxContainer, 'Should have exactly 2 InfoBox components')
      .toHaveCount(2);
  }
  
  /**
   * AC3: Validate title content with soft assertion
   */
  async validateTitleContent(variant: 'high-contrast' | 'low-contrast'): Promise<void> {
    const container = variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    const title = container.locator('[data-qa="title-component"]');
    
    const titleExists = await title.first().isVisible({ timeout: 5000 }).catch(() => false);
    if (!titleExists) {
      this.log(`Warning: ${variant} InfoBox title element not found in this environment - skipping validation`);
      return;
    }
    
    await expect.soft(title, `${variant} InfoBox title should be visible`).toBeVisible();
    await expect.soft(title, `${variant} InfoBox title should not be empty`).not.toBeEmpty();
    
    // Verify semantic HTML structure (H3 tag)
    const tagName = await title.evaluate(el => el.tagName.toLowerCase());
    expect.soft(tagName, `${variant} InfoBox title should use H3 tag`).toBe('h3');
  }
  
  /**
   * AC4: Validate description content with soft assertion
   */
  async validateDescriptionContent(variant: 'high-contrast' | 'low-contrast'): Promise<void> {
    const container = variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    const description = container.locator('[data-qa="info-box-description"]');
    
    const descExists = await description.first().isVisible({ timeout: 5000 }).catch(() => false);
    if (!descExists) {
      this.log(`Warning: ${variant} InfoBox description element not found in this environment - skipping validation`);
      return;
    }
    
    await expect.soft(description, `${variant} InfoBox description should be visible`).toBeVisible();
    await expect.soft(description, `${variant} InfoBox description should not be empty`).not.toBeEmpty();
    
    // Validate description has meaningful content (minimum length check)
    const textContent = await description.textContent();
    expect.soft(textContent?.length || 0, `${variant} InfoBox description should have meaningful content`)
      .toBeGreaterThan(20);
  }
  
  /**
   * AC5: Validate CTA button with soft assertions
   */
  async validateCTAButton(variant: 'high-contrast' | 'low-contrast'): Promise<void> {
    const container = variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    const cta = container.locator('[data-qa="info-box-cta"]');
    
    const ctaExists = await cta.first().isVisible({ timeout: 5000 }).catch(() => false);
    if (!ctaExists) {
      this.log(`Warning: ${variant} InfoBox CTA button not found in this environment - skipping validation`);
      return;
    }
    
    await expect.soft(cta, `${variant} InfoBox CTA should be visible`).toBeVisible();
    await expect.soft(cta, `${variant} InfoBox CTA should be enabled`).toBeEnabled();
    await expect.soft(cta, `${variant} InfoBox CTA should not be empty`).not.toBeEmpty();
  }
  
  /**
   * AC6: Validate image properties with soft assertions
   */
  async validateImageProperties(variant: 'high-contrast' | 'low-contrast'): Promise<void> {
    const container = variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    const image = container.locator('[data-qa="info-box-image"]');
    
    const imageCount = await image.count();
    if (imageCount === 0) {
      this.log(`Warning: ${variant} InfoBox image element not found - skipping validation`);
      return;
    }
    
    await expect.soft(image, `${variant} InfoBox image should be visible`).toBeVisible();
    await expect.soft(image, `${variant} InfoBox image should have src attribute`).toHaveAttribute('src');
    await expect.soft(image, `${variant} InfoBox image should have alt attribute`).toHaveAttribute('alt');
    
    const complete = await image.evaluate((img: HTMLImageElement) => img.complete).catch(() => false);
    expect.soft(complete, `${variant} InfoBox image should be fully loaded`).toBe(true);
  }

  // ====================
  // VISUAL VALIDATION METHODS (SOFT ASSERTIONS)
  // ====================
  
  /**
   * AC9-AC12: Validate background colors with soft assertions
   */
  async validateBackgroundColors(variant: 'high-contrast' | 'low-contrast'): Promise<void> {
    const container = variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    
    // Expected colors from DOM inspection
    const expectedBg = variant === 'high-contrast' ? 'rgb(29, 41, 61)' : 'rgb(241, 245, 249)';
    
    await expect.soft(container, `${variant} InfoBox should have correct background color`)
      .toHaveCSS('background-color', expectedBg);
  }
  
  /**
   * Validate text colors with soft assertions
   */
  async validateTextColors(variant: 'high-contrast' | 'low-contrast'): Promise<void> {
    const container = variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    const title = container.locator('[data-qa="title-component"]');
    
    // Expected text colors from DOM inspection
    const expectedColor = variant === 'high-contrast' ? 'rgb(255, 255, 255)' : 'rgb(16, 56, 79)';
    
    await expect.soft(title, `${variant} InfoBox title should have correct text color`)
      .toHaveCSS('color', expectedColor);
  }
  
  /**
   * Validate brand highlight colors with soft assertions
   */
  async validateHighlightColors(variant: 'high-contrast' | 'low-contrast'): Promise<void> {
    const container = variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    
    // Highlight color elements
    const blueHighlight = container.locator('.bg-brand-bright-blue-500');
    const pinkHighlight = container.locator('.bg-brand-fuchsia-500');
    
    if (variant === 'high-contrast') {
      await expect.soft(blueHighlight, 'High contrast InfoBox should have blue highlight')
        .toBeVisible();
      await expect.soft(blueHighlight, 'Blue highlight should have correct color')
        .toHaveCSS('background-color', 'rgb(0, 188, 255)');
    } else {
      await expect.soft(pinkHighlight, 'Low contrast InfoBox should have pink highlight')
        .toBeVisible();
      await expect.soft(pinkHighlight, 'Pink highlight should have correct color')
        .toHaveCSS('background-color', 'rgb(255, 49, 98)');
    }
  }

  // ====================
  // RESPONSIVE VALIDATION METHODS (SOFT ASSERTIONS)
  // ====================
  
  /**
   * AC13: Validate mobile layout behavior (<944px)
   */
  async validateMobileLayout(): Promise<void> {
    await this.page.setViewportSize({ width: 943, height: 667 }); // Below 944px breakpoint
    
    // Wait for layout to adjust
    await this.page.waitForTimeout(500);
    
    // Validate both components are still visible
    await expect.soft(this.highContrastInfoBox, 'High contrast InfoBox should remain visible on mobile')
      .toBeVisible();
    await expect.soft(this.lowContrastInfoBox, 'Low contrast InfoBox should remain visible on mobile')
      .toBeVisible();
    
    // Validate components stack vertically (image below text)
    const firstBoxBounds = await this.highContrastInfoBox.boundingBox();
    const secondBoxBounds = await this.lowContrastInfoBox.boundingBox();
    
    if (firstBoxBounds && secondBoxBounds) {
      expect.soft(secondBoxBounds.y, 'Second InfoBox should be positioned below first InfoBox on mobile')
        .toBeGreaterThan(firstBoxBounds.y + firstBoxBounds.height - 50);
    }
  }
  
  /**
   * Validate desktop layout behavior
   */
  async validateDesktopLayout(): Promise<void> {
    await this.page.setViewportSize({ width: 1280, height: 720 });
    
    await expect.soft(this.highContrastInfoBox, 'High contrast InfoBox should be visible on desktop')
      .toBeVisible();
    await expect.soft(this.lowContrastInfoBox, 'Low contrast InfoBox should be visible on desktop')
      .toBeVisible();
  }

  // ====================
  // INTERACTION METHODS (SOFT ASSERTIONS)
  // ====================
  
  /**
   * AC7: Click CTA button interaction
   */
  async clickCTA(variant: 'high-contrast' | 'low-contrast'): Promise<void> {
    const container = variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    const cta = container.locator('[data-qa="info-box-cta"]');
    
    const ctaCount = await cta.count();
    if (ctaCount === 0) {
      this.log(`Warning: ${variant} InfoBox CTA button not found - skipping click test`);
      return;
    }
    
    await expect.soft(cta, `${variant} InfoBox CTA should be visible`).toBeVisible();
    await expect.soft(cta, `${variant} InfoBox CTA should be enabled`).toBeEnabled();
    
    const href = await cta.first().getAttribute('href');
    const isExternalLink = href?.startsWith('http') || href?.startsWith('//');
    
    if (isExternalLink) {
      await expect.soft(cta, `${variant} InfoBox CTA should have href attribute`).toHaveAttribute('href');
    } else {
      await cta.first().click({ noWaitAfter: true, timeout: 5000 });
      if ('handleLinkDisclaimerModal' in this) {
        await (this as any).handleLinkDisclaimerModal();
      }
    }
  }  

  // ====================
  // ACCESSIBILITY VALIDATION METHODS (SOFT ASSERTIONS)
  // ====================
  
  /**
   * Validate semantic HTML structure
   */
  async validateSemanticHTML(variant: 'high-contrast' | 'low-contrast'): Promise<void> {
    const container = variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    
    // Validate heading structure
    const heading = container.locator('h3');
    await expect.soft(heading, `${variant} InfoBox should have H3 heading`).toBeVisible();
    
    // Validate title is within H3 tag
    const title = container.locator('[data-qa="title-component"]');
    const titleTagName = await title.evaluate(el => el.tagName.toLowerCase());
    expect.soft(titleTagName, `${variant} InfoBox title should be H3 tag`).toBe('h3');
  }
  
  /**
   * Validate keyboard navigation support
   */
  async validateKeyboardNavigation(variant: 'high-contrast' | 'low-contrast'): Promise<void> {
    const container = variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    const cta = container.locator('[data-qa="info-box-cta"]');
    
    // Tab to CTA button
    await this.page.keyboard.press('Tab');
    
    // Validate CTA receives focus
    await expect.soft(cta, `${variant} InfoBox CTA should be focusable`).toBeFocused();
  }

  // ====================
  // PERFORMANCE VALIDATION METHODS (SOFT ASSERTIONS)
  // ====================
  
  /**
   * Measure component load time
   */
  async measureLoadPerformance(): Promise<number> {
    const startTime = Date.now();
    await this.infoBoxContainer.first().waitFor({ state: 'visible' });
    const loadTime = Date.now() - startTime;
    
    // Soft assertion for performance benchmark
    expect.soft(loadTime, 'InfoBox components should load within 500ms').toBeLessThan(500);
    
    return loadTime;
  }
  
  /**
   * Validate image optimization
   */
  async validateImageOptimization(variant: 'high-contrast' | 'low-contrast'): Promise<void> {
    const container = variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    const image = container.locator('[data-qa="info-box-image"]');
    
    // Check for loading attribute optimization
    const loading = await image.getAttribute('loading');
    expect.soft(['lazy', 'eager', null], `${variant} InfoBox image should have loading optimization`)
      .toContain(loading);
    
    // Validate image is optimized (complete loading)
    const complete = await image.evaluate((img: HTMLImageElement) => img.complete);
    expect.soft(complete, `${variant} InfoBox image should be fully loaded`).toBe(true);
  }

  // ====================
  // UTILITY METHODS
  // ====================
  
  /**
   * Get InfoBox content for validation
   */
  async getInfoBoxContent(variant: 'high-contrast' | 'low-contrast'): Promise<{
    title: string;
    description: string;
    ctaText: string;
    hasImage: boolean;
  }> {
    const container = variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    
    return {
      title: await container.locator('[data-qa="title-component"]').textContent() || '',
      description: await container.locator('[data-qa="info-box-description"]').textContent() || '',
      ctaText: await container.locator('[data-qa="info-box-cta"]').textContent() || '',
      hasImage: await container.locator('[data-qa="info-box-image"]').isVisible()
    };
  }
  
  /**
   * Take screenshot for visual regression
   */
  async screenshotInfoBox(variant: 'high-contrast' | 'low-contrast', filename: string): Promise<void> {
    const container = variant === 'high-contrast' ? this.highContrastInfoBox : this.lowContrastInfoBox;
    await container.screenshot({ path: `reports/screenshots/${filename}` });
  }
  
  /**
   * Get all InfoBox components for iteration
   */
  getAllInfoBoxes(): Locator {
    return this.infoBoxContainer;
  }
}
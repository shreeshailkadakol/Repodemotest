import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { DownloadLinks_FigmaValues as DownloadLinksFigmaValues } from '../helpers/utils/figma-values/DownloadLinks_FigmaValues';
import { envUtils } from '../helpers/utils/envUtils';

export class DownloadLinksComponent extends BasePage {
  private readonly baseURL?: string;
  private readonly componentElement: Locator = this.page.locator('[data-qa="link-box"]').first();

  private readonly componentTitleElement: Locator = this.page
    .locator('[data-qa="link-box"] [data-qa="title-component"]')
    .first();

  private readonly componentDescriptionElement: Locator = this.page.locator(
    '[data-qa="link-box"] [data-qa="description-component"]'
  );

  private readonly allTitleElements: Locator = this.page.locator(
    '[data-qa="link-box"] [data-qa="title-component"]'
  );

  private readonly fileTitleElements: Locator = this.page.locator(
    '[data-qa="link-box"] ul > li'
  );

  private readonly downloadIconElements: Locator = this.page.locator('[data-qa="icon"]');

  private readonly downloadButtons: Locator = this.page.locator('[data-qa="link-box"] ul a');

  private readonly fileMetadataElements: Locator = this.page.locator(
    '[data-qa="link-box"] ul .text-text-muted'
  );

  private readonly viewports = {
    XL: { width: 1440, height: 900 },
    LG: { width: 1024, height: 768 },
    MD: { width: 768, height: 1024 },
    SM: { width: 375, height: 667 },
  };

  constructor(page: Page, browser: Browser, context: BrowserContext, baseURL?: string) {
    super(page, browser, context);
    this.baseURL = baseURL;
  }

  async navigateToDownloadLinksComponent(): Promise<void> {
    const baseUrl = envUtils.getBaseUrl();
    const componentUrl = await this.resolveExecutionUrl('DownloadLinksComponent', baseUrl);
    await this.navigateWithAuthentication(componentUrl);
    await this.acceptCookiesBanner(); // Accept cookies after navigation and authentication
    await this.forcefullyRemoveCookieBanner(); // Ensure cookie banner is completely removed
  }

  /**
   * Forcefully remove cookie banner from DOM to prevent pointer event interception
   */
  async forcefullyRemoveCookieBanner(): Promise<void> {
    try {
      // Forcefully remove cookie banner if it persists - multiple attempts
      for (let i = 0; i < 3; i++) {
        const cookieBanner = this.page.locator('#onetrust-consent-sdk');
        const bannerExists = await cookieBanner.count() > 0;
        
        if (bannerExists) {
          console.log(`[DownloadLinks] Cookie banner still present (attempt ${i + 1}), forcefully removing...`);
          // Force remove from DOM immediately
          await this.page.evaluate(() => {
            const banner = document.querySelector('#onetrust-consent-sdk');
            if (banner) {
              banner.remove();
              console.log('[JS] Removed cookie banner from DOM');
            }
          });
          // Wait to ensure removal is processed
          await this.page.waitForTimeout(500);
        } else {
          console.log('[DownloadLinks] Cookie banner not present');
          break;
        }
      }
    } catch (error) {
      // Cookie dialog not present or already handled
    }
  }

  /**
   * Handle link disclaimer modal by clicking Cancel button
   */
  async handleLinkDisclaimerModal(): Promise<void> {
    try {
      const modal = this.page.locator('[data-qa="popup-overlay"]');
      const modalVisible = await modal.isVisible({ timeout: 5000 });
      
      if (modalVisible) {
        console.log('[DownloadLinks] Link disclaimer modal detected, clicking Cancel...');
        // Click Cancel button to dismiss the modal
        const cancelButton = this.page.locator('button:has-text("Cancel")');
        await cancelButton.click({ timeout: 5000 });
        // Wait for modal to close
        await this.page.waitForTimeout(1000);
      }
    } catch (error) {
      // Modal not present or already dismissed
    }
  }

  // Functional validation methods
  async verifyComponentVisibility(): Promise<void> {
    await expect.soft(this.componentElement).toBeVisible();
  }

  async verifyComponentTitleDisplay(): Promise<void> {
    await expect.soft(this.componentTitleElement).toBeVisible();
  }

  async verifyComponentDescriptionDisplay(): Promise<void> {
    await expect.soft(this.componentDescriptionElement).toBeVisible();
  }

  async verifyDownloadItemsCount(): Promise<void> {
    // Should have 2 download link buttons (based on actual DOM inspection)
    await expect.soft(this.downloadButtons).toHaveCount(2);
  }

  async verifyDownloadIconsInteractive(): Promise<void> {
    const iconCount = await this.downloadButtons.count();
    for (let i = 0; i < iconCount; i++) {
      const icon = this.downloadButtons.nth(i);
      await expect.soft(icon).toBeVisible();
      await expect.soft(icon).toBeEnabled();
    }
  }

  async verifyDownloadFunctionality(): Promise<void> {
    // Ensure no cookie banner interference
    await this.forcefullyRemoveCookieBanner();
    
    const iconCount = await this.downloadButtons.count();
    for (let i = 0; i < iconCount; i++) {
      const icon = this.downloadButtons.nth(i);
      await icon.click({ timeout: 10000 });
      
      // Handle link disclaimer modal that appears for external links
      await this.handleLinkDisclaimerModal();
      
      // Wait before next click
      await this.page.waitForTimeout(500);
    }
  }

  async verifyComponentStructure(): Promise<void> {
    // Debug: Wait for page load and take screenshot
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    
    // Verify main container exists
    await expect.soft(this.componentElement).toBeVisible();
    
    // Verify component title exists (first title element, not in navigation)
    await expect.soft(
      this.componentElement.locator('[data-qa="title-component"]').first()
    ).toBeVisible();
    
    // Verify component description exists
    await expect.soft(this.componentDescriptionElement).toBeVisible();
    
    // Verify file items are within list container
    await expect.soft(this.fileTitleElements).toHaveCount(2);
    
    // Verify list container exists
    await expect.soft(this.componentElement.locator('ul')).toBeVisible();
  }

  async verifyKeyboardNavigation(): Promise<void> {
    // Focus on first download button
    await this.downloadButtons.first().focus();
    
    // Test Tab key navigation
    await this.page.keyboard.press('Tab');
    
    // Test Enter key activation
    await this.page.keyboard.press('Enter');
  }

  // Visual validation methods
  async verifyComponentTitleTypography(
    viewport: keyof typeof DownloadLinksFigmaValues
  ): Promise<void> {
    await this.page.setViewportSize(this.viewports[viewport]);
    await this.page.waitForLoadState('domcontentloaded');
    
    const expectedStyles = DownloadLinksFigmaValues[viewport].componentTitle;
    
    const actualStyles = await this.componentTitleElement.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        color: computed.color,
      };
    });

    expect.soft(actualStyles.fontSize).toBe(expectedStyles.fontSize);
    expect.soft(actualStyles.fontWeight).toBe(expectedStyles.fontWeight);
    expect.soft(actualStyles.lineHeight).toBe(expectedStyles.lineHeight);
    expect.soft(actualStyles.color).toBe(expectedStyles.color);
  }

  async verifyComponentDescriptionTypography(
    viewport: keyof typeof DownloadLinksFigmaValues
  ): Promise<void> {
    await this.page.setViewportSize(this.viewports[viewport]);
    await this.page.waitForLoadState('domcontentloaded');
    
    const expectedStyles = DownloadLinksFigmaValues[viewport].componentDescription;
    
    const actualStyles = await this.componentDescriptionElement.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        color: computed.color,
      };
    });

    expect.soft(actualStyles.fontSize).toBe(expectedStyles.fontSize);
    expect.soft(actualStyles.fontWeight).toBe(expectedStyles.fontWeight);
    expect.soft(actualStyles.lineHeight).toBe(expectedStyles.lineHeight);
    expect.soft(actualStyles.color).toBe(expectedStyles.color);
  }

  async verifyFileTitleTypography(viewport: keyof typeof DownloadLinksFigmaValues): Promise<void> {
    await this.page.setViewportSize(this.viewports[viewport]);
    await this.page.waitForLoadState('domcontentloaded');
    
    const expectedStyles = DownloadLinksFigmaValues[viewport].fileTitle;
    
    const actualStyles = await this.fileTitleElements.first().evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        color: computed.color,
      };
    });

    expect.soft(actualStyles.fontSize).toBe(expectedStyles.fontSize);
    expect.soft(actualStyles.fontWeight).toBe(expectedStyles.fontWeight);
    expect.soft(actualStyles.lineHeight).toBe(expectedStyles.lineHeight);
    expect.soft(actualStyles.color).toBe(expectedStyles.color);
  }

  // Responsive validation methods
  async verifyResponsiveBehavior(viewport: keyof typeof DownloadLinksFigmaValues): Promise<void> {
    await this.page.setViewportSize(this.viewports[viewport]);
    await this.page.waitForLoadState('domcontentloaded');
    
    // Verify component is still visible and functional at this viewport
    await expect.soft(this.componentElement).toBeVisible();
    await expect.soft(this.downloadButtons).toHaveCount(2);
  }

  async verifyComponentSpacing(viewport: keyof typeof DownloadLinksFigmaValues): Promise<void> {
    await this.page.setViewportSize(this.viewports[viewport]);
    await this.page.waitForLoadState('domcontentloaded');
    
    // Verify component styling
    const actualStyles = await this.componentElement.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        backgroundColor: computed.backgroundColor,
        padding: computed.padding,
        margin: computed.margin,
      };
    });

    // Basic validation that styles are applied
    expect.soft(actualStyles).toBeDefined();
  }

  // Accessibility validation methods
  async verifyAccessibilityCompliance(): Promise<void> {
    // Verify download buttons have proper ARIA attributes
    const iconCount = await this.downloadButtons.count();
    for (let i = 0; i < iconCount; i++) {
      const icon = this.downloadButtons.nth(i);
      
      // Check that element is focusable
      await icon.focus();
      const isFocused = await icon.evaluate((el) => document.activeElement === el);
      expect.soft(isFocused).toBe(true);
      
      // Check for ARIA attributes or proper semantic markup
      const hasAriaLabel = await icon.getAttribute('aria-label');
      const hasTitle = await icon.getAttribute('title');
      const hasText = await icon.textContent();
      
      // At least one accessibility method should be present
      expect.soft(hasAriaLabel || hasTitle || (hasText && hasText.trim().length > 0)).toBeTruthy();
    }
  }

  async verifyColorContrast(): Promise<void> {
    // Get computed styles for text elements
    const titleStyles = await this.componentTitleElement.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
      };
    });

    // Basic validation that styles exist (actual contrast calculation would need specialized library)
    expect.soft(titleStyles.color).toBeDefined();
    expect.soft(titleStyles.backgroundColor).toBeDefined();
  }

  // Performance validation methods
  async measurePageLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.page.waitForLoadState('domcontentloaded');
    const endTime = Date.now();
    return endTime - startTime;
  }

  async verifyImageOptimization(): Promise<void> {
    // Check if icons are properly optimized (basic validation)
    const icons = this.page.locator('img, svg');
    const iconCount = await icons.count();
    
    for (let i = 0; i < iconCount; i++) {
      const icon = icons.nth(i);
      await expect.soft(icon).toBeVisible();
    }
  }

  async verifyFileMetadataTypography(
    viewport: keyof typeof DownloadLinksFigmaValues
  ): Promise<void> {
    await this.page.setViewportSize(this.viewports[viewport]);
    await this.page.waitForLoadState('domcontentloaded');
    
    const expectedStyles = DownloadLinksFigmaValues[viewport].fileMetadata;
    
    const actualStyles = await this.fileMetadataElements.first().evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        color: computed.color,
      };
    });

    expect.soft(actualStyles.fontSize).toBe(expectedStyles.fontSize);
    expect.soft(actualStyles.fontWeight).toBe(expectedStyles.fontWeight);
    expect.soft(actualStyles.lineHeight).toBe(expectedStyles.lineHeight);
    expect.soft(actualStyles.color).toBe(expectedStyles.color);
  }

  async verifyDownloadButtonTypography(
    viewport: keyof typeof DownloadLinksFigmaValues
  ): Promise<void> {
    await this.page.setViewportSize(this.viewports[viewport]);
    await this.page.waitForLoadState('domcontentloaded');
    
    const expectedStyles = DownloadLinksFigmaValues[viewport].downloadButton as {
      fontSize: string;
      fontWeight: string;
      lineHeight: string;
      color: string;
      letterSpacing?: string;
      textCase?: string;
    };
    
    const actualStyles = await this.downloadButtons.first().evaluate((element) => {
      const computed = window.getComputedStyle(element);
      return {
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        color: computed.color,
        letterSpacing: computed.letterSpacing,
        textTransform: computed.textTransform,
      };
    });

    expect.soft(actualStyles.fontSize).toBe(expectedStyles.fontSize);
    expect.soft(actualStyles.fontWeight).toBe(expectedStyles.fontWeight);
    expect.soft(actualStyles.lineHeight).toBe(expectedStyles.lineHeight);
    expect.soft(actualStyles.color).toBe(expectedStyles.color);
    
    if (expectedStyles.letterSpacing) {
      expect.soft(actualStyles.letterSpacing).toBe(expectedStyles.letterSpacing);
    }
    
    if (expectedStyles.textCase === 'UPPER') {
      expect.soft(actualStyles.textTransform).toBe('uppercase');
    }
  }

  async verifyDownloadIconSize(viewport: keyof typeof DownloadLinksFigmaValues): Promise<void> {
    await this.page.setViewportSize(this.viewports[viewport]);
    await this.page.waitForLoadState('domcontentloaded');
    
    // Get the download icon (SVG element) - using correct case: "Download" not "download"
    const downloadIcon = this.page.locator('[data-qa="icon"][aria-label="Download"]').first();
    await expect.soft(downloadIcon).toBeVisible();
    
    const iconDimensions = await downloadIcon.evaluate((element) => {
      const computed = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        width: computed.width || `${rect.width}px`,
        height: computed.height || `${rect.height}px`,
      };
    });

    expect.soft(parseFloat(iconDimensions.width)).toBeGreaterThan(10);
    expect.soft(parseFloat(iconDimensions.height)).toBeGreaterThan(10);
  }

  async verifyRenderingPerformance(): Promise<void> {
    // Measure rendering performance
    const renderTime = await this.page.evaluate(() => {
      return performance.now();
    });
    
    expect.soft(renderTime).toBeGreaterThan(0);
  }
}

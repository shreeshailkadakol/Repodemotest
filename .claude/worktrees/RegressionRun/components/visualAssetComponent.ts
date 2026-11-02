

import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { envUtils } from '../helpers/utils/envUtils';

type ViewportType = 'XL' | 'LG' | 'MD' | 'SM';

export class VisualAssetComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  async navigateToComponent(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('VisualAssetComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForComponentToLoad();
  }

  async waitForComponentToLoad(): Promise<void> {
    const container = await this.getComponentContainer();
    await expect.soft(container).toBeVisible({ timeout: 15000 });
    // Wait for loading state to disappear (component renders async)
    const loadingState = this.page.locator('[data-testid="va-loading-state"]');
    await loadingState.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    // Wait for either desktop or mobile grid to have content
    await this.page.waitForFunction(
      () => {
        const desktop = document.querySelector('[data-testid="va-grid-desktop"]');
        const mobile = document.querySelector('[data-testid="va-grid-mobile"]');
        return (desktop && desktop.children.length > 0 && (desktop as HTMLElement).offsetHeight > 0) ||
               (mobile && mobile.children.length > 0 && (mobile as HTMLElement).offsetHeight > 0);
      },
      { timeout: 15000 }
    ).catch(() => {});
  }

  // ============================================================================
  // COMPONENT CONTAINER LOCATORS (SmartLocator)
  // ============================================================================

  async getComponentContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'visual-assets',
      testId: 'visual-assets',
      css: '[data-qa="visual-assets"]',
      xpath: '//div[@data-qa="visual-assets"]',
      description: 'Visual Asset component main container',
    });
  }

  async getHeading(): Promise<Locator> {
    return await this.findSmart({
      testId: 'va-heading',
      css: '[data-testid="visual-assets"] [data-testid="va-heading"]',
      xpath: '//div[@data-testid="visual-assets"]//h2[@data-testid="va-heading"]',
      description: 'Visual Asset section heading',
    });
  }

  // ============================================================================
  // GRID LOCATORS
  // ============================================================================

  async getMobileGrid(): Promise<Locator> {
    return await this.findSmart({
      testId: 'va-grid-mobile',
      css: '[data-testid="visual-assets"] [data-testid="va-grid-mobile"]',
      xpath: '//div[@data-testid="visual-assets"]//div[@data-testid="va-grid-mobile"]',
      description: 'Visual Asset mobile grid container',
    });
  }

  /**
   * Check if mobile grid is present and hidden (for desktop viewport checks).
   * Uses page.locator directly since SmartLocator throws for hidden elements.
   */
  async isMobileGridHidden(): Promise<boolean> {
    const mobileGrid = this.page.locator('[data-testid="va-grid-mobile"]');
    const count = await mobileGrid.count();
    if (count === 0) return true;
    return !(await mobileGrid.isVisible());
  }

  /**
   * Get all visible lightbox trigger buttons from the currently active grid.
   * On desktop: uses va-grid-desktop (mobile is hidden with md:hidden)
   * On mobile: uses va-grid-mobile (desktop is hidden)
   * NOTE: Uses page.locator directly because SmartLocator returns .first() only.
   */
  async getAllVisibleCards(): Promise<Locator> {
    const desktopGrid = this.page.locator('[data-testid="va-grid-desktop"]');
    const isDesktopVisible = await desktopGrid.isVisible().catch(() => false);
    if (isDesktopVisible) {
      return this.page.locator('[data-testid="va-grid-desktop"] button[aria-label^="Open:"]');
    }
    return this.page.locator('[data-testid="va-grid-mobile"] button[aria-label^="Open:"]');
  }

  async getVisibleCardCount(): Promise<number> {
    const buttons = await this.getAllVisibleCards();
    // Wait for at least one button to appear
    await buttons.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    return await buttons.count();
  }

  async getCardByIndex(index: number): Promise<Locator> {
    const buttons = await this.getAllVisibleCards();
    return buttons.nth(index);
  }

  // ============================================================================
  // CARD ELEMENTS
  // ============================================================================

  /**
   * Get all visible thumbnail images.
   * On desktop: images are inside divs adjacent to lightbox buttons
   * On mobile: images have data-qa="va-thumbnail"
   */
  async getAllThumbnails(): Promise<Locator> {
    // Use images that are siblings of Open buttons (works on both grids)
    return this.page.locator('[data-testid="visual-assets"] button[aria-label^="Open:"] ~ img, [data-testid="visual-assets"] img:has(~ button[aria-label^="Open:"]), [data-testid="visual-assets"] button[aria-label^="Open:"]').locator('xpath=ancestor::div[1]//img').first().locator('xpath=//div[@data-testid="visual-assets"]//img[not(@data-testid="icon")]');
  }

  /**
   * Get all thumbnail images using a simple page evaluate approach
   */
  async getAllThumbnailImages(): Promise<Locator> {
    // Images that share a parent with Open: buttons inside the visual-assets container
    return this.page.locator('[data-testid="visual-assets"] img[alt]:not([data-testid="icon"]):not([alt=""])');
  }

  async getLightboxTriggerButton(index: number): Promise<Locator> {
    const buttons = await this.getAllVisibleCards();
    return buttons.nth(index);
  }

  // ============================================================================
  // LOAD MORE
  // ============================================================================

  async getLoadMoreContainer(): Promise<Locator> {
    return await this.findSmart({
      testId: 'va-load-more-container',
      css: '[data-testid="va-load-more-container"]',
      xpath: '//div[@data-testid="va-load-more-container"]',
      description: 'Visual Asset Load More container',
    });
  }

  async getLoadMoreButton(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'va-load-more',
      css: 'button[data-qa="va-load-more"]',
      xpath: '//button[@data-qa="va-load-more"]',
      role: { role: 'button', name: /load more/i },
      description: 'Visual Asset Load More button',
    });
  }

  async clickLoadMore(): Promise<void> {
    await this.clickSmart({
      dataQa: 'va-load-more',
      css: 'button[data-qa="va-load-more"]',
      role: { role: 'button', name: /load more/i },
      description: 'Click Load More button',
    });
  }

  // ============================================================================
  // LIGHTBOX ELEMENTS
  // ============================================================================

  async getLightboxDialog(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'dialog' },
      css: '[role="dialog"][data-state="open"]',
      xpath: '//div[@role="dialog"][@data-state="open"]',
      description: 'Visual Asset lightbox dialog',
    });
  }

  async getLightboxImage(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'next-image',
      testId: 'next-image',
      css: '[role="dialog"] img[data-qa="next-image"]',
      xpath: '//div[@role="dialog"]//img[@data-qa="next-image"]',
      description: 'Lightbox full-size image',
    });
  }

  async getLightboxCaption(): Promise<Locator> {
    return await this.findSmart({
      testId: 'va-lightbox-caption',
      css: '[role="dialog"] [data-testid="va-lightbox-caption"]',
      xpath: '//div[@role="dialog"]//p[@data-testid="va-lightbox-caption"]',
      description: 'Lightbox image caption',
    });
  }

  async getLightboxMetadata(): Promise<Locator> {
    return await this.findSmart({
      testId: 'va-metadata',
      css: '[role="dialog"] [data-testid="va-metadata"]',
      xpath: '//div[@role="dialog"]//p[@data-testid="va-metadata"]',
      description: 'Lightbox metadata (format, dimensions, size)',
    });
  }

  async getLightboxDownloadButton(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /download/i },
      css: '[role="dialog"] button[aria-label="Download image"]',
      xpath: '//div[@role="dialog"]//button[@aria-label="Download image"]',
      description: 'Lightbox download button',
    });
  }

  async getLightboxCloseButton(): Promise<Locator> {
    // The dialog header has 2 buttons: download (aria-label="Download image") and close (no aria-label)
    // Use the last button in the fixed header bar
    return this.page.locator('[role="dialog"] .fixed button:not([aria-label="Download image"])');
  }

  async getLightboxTitle(): Promise<Locator> {
    return await this.findSmart({
      css: '[role="dialog"] h2.sr-only',
      xpath: '//div[@role="dialog"]//h2[contains(@class, "sr-only")]',
      role: { role: 'heading', name: /image lightbox/i },
      description: 'Lightbox sr-only title',
    });
  }

  async getLightboxDescription(): Promise<Locator> {
    return await this.findSmart({
      css: '[role="dialog"] p.sr-only',
      xpath: '//div[@role="dialog"]//p[contains(@class, "sr-only")]',
      description: 'Lightbox sr-only description',
    });
  }

  async getLightboxUsageText(): Promise<Locator> {
    return await this.findSmart({
      css: '[role="dialog"] .text-text-dimmed:first-of-type',
      xpath: '(//div[@role="dialog"]//p[contains(@class, "text-text-dimmed")])[1]',
      description: 'Lightbox usage/utilization text',
    });
  }

  async getLightboxAuthorText(): Promise<Locator> {
    return await this.findSmart({
      css: '[role="dialog"] .text-text-dimmed:last-of-type',
      xpath: '(//div[@role="dialog"]//p[contains(@class, "text-text-dimmed")])[2]',
      description: 'Lightbox author text',
    });
  }

  // ============================================================================
  // ACTIONS
  // ============================================================================

  async openLightboxForCard(index: number): Promise<void> {
    // Get buttons from the visible grid only
    const buttons = await this.getAllVisibleCards();
    const button = buttons.nth(index);
    await button.waitFor({ state: 'visible', timeout: 15000 });
    await button.scrollIntoViewIfNeeded();
    await button.click({ force: true });
    // Wait for dialog to appear
    await this.page.waitForSelector('[role="dialog"][data-state="open"]', { timeout: 5000 });
  }

  async closeLightbox(): Promise<void> {
    const closeBtn = await this.getLightboxCloseButton();
    await closeBtn.click();
    await this.page.waitForSelector('[role="dialog"][data-state="open"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  }

  async closeLightboxWithEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.page.waitForSelector('[role="dialog"][data-state="open"]', { state: 'detached', timeout: 5000 }).catch(() => {});
  }

  // ============================================================================
  // VIEWPORT HELPERS
  // ============================================================================

  async setViewport(viewport: ViewportType): Promise<void> {
    const sizes = {
      XL: { width: 1440, height: 900 },
      LG: { width: 1024, height: 768 },
      MD: { width: 768, height: 1024 },
      SM: { width: 375, height: 812 },
    };
    await this.page.setViewportSize(sizes[viewport]);
  }

  async scrollToComponent(): Promise<void> {
    const container = await this.getComponentContainer();
    await container.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
  }

  // ============================================================================
  // VALIDATION HELPERS
  // ============================================================================

  async getComputedStyles(locator: Locator): Promise<Record<string, string>> {
    return await locator.evaluate((el: HTMLElement) => {
      const styles = globalThis.getComputedStyle(el);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      };
    });
  }

  async isLightboxOpen(): Promise<boolean> {
    try {
      const dialog = this.page.locator('[role="dialog"][data-state="open"]');
      return (await dialog.count()) > 0;
    } catch {
      return false;
    }
  }

  async getGridColumnCount(): Promise<number> {
    const desktopGrid = this.page.locator('[data-testid="va-grid-desktop"]');
    const count = await desktopGrid.count();
    if (count === 0) return 1;
    // Wait for the grid to be visible and have rendered content
    try {
      await desktopGrid.waitFor({ state: 'visible', timeout: 10000 });
    } catch {
      return 1;
    }
    // Count direct child divs (columns in the masonry layout)
    const columns = desktopGrid.locator('> div');
    const colCount = await columns.count();
    return colCount > 0 ? colCount : 1;
  }

  async getMetadataFormat(): Promise<{ format: string; dimensions: string; size: string } | null> {
    const metadata = await this.getLightboxMetadata();
    const text = await metadata.textContent();
    if (!text) return null;
    // Expected format: "JPG | 720 x 720 px | 69.4 KB"
    const parts = text.split('|').map((p) => p.trim());
    if (parts.length >= 3) {
      return {
        format: parts[0],
        dimensions: parts[1],
        size: parts[2],
      };
    }
    return null;
  }
}

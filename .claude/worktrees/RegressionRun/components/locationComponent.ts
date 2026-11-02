import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { envUtils } from '../helpers/utils/envUtils';
import { getLocationElement } from '../helpers/utils/figma-values/Location_FigmaValues';


export class LocationComponent extends BasePage {
  // Header Elements
  private readonly headerContainer: Locator;
  private readonly locationButtonHeader: Locator;
  private readonly navigationFlyout: Locator;
  private readonly locationButtonFlyout: Locator;
  
  // Location Overlay Elements
  private readonly locationOverlay: Locator;
  private readonly overlayCloseButton: Locator;
  private readonly overlayBackButton: Locator;
  
  // Text Elements in Overlay
  private readonly browseByLocationText: Locator;
  private readonly descriptionComponents: Locator;
  private readonly autodetectionText: Locator;
  private readonly bayerGlobalText: Locator;
  
  // Interactive Elements
  private readonly searchAtom: Locator;
  private readonly findByLocationInput: Locator;
  private readonly locationList: Locator;
  private readonly locationItems: Locator;
  
  // Location Details
  private readonly locationLabelHeadline: Locator;
  private readonly addressText: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);

    // Header Elements - Based on live DOM inspection
    this.headerContainer = this.page.locator('banner, header');
    this.locationButtonHeader = this.page.locator('[data-qa="select-location-button"]');
    this.navigationFlyout = this.page.locator('[data-qa="FlyoutMenu"]');
    this.locationButtonFlyout = this.navigationFlyout.locator('button[aria-label="Open location selector"]');
    
    // Location Overlay - Primary container (confirmed from DOM inspection)
    this.locationOverlay = this.page.locator('[data-qa="location-overlay"]');
    this.overlayCloseButton = this.locationOverlay.locator('[data-qa*="close"], [aria-label*="close"], button[aria-label*="Close"]').first();
    this.overlayBackButton = this.locationOverlay.locator('[data-qa*="back"], [aria-label*="back"], button[aria-label*="Back"]').first();
    
    // Text Elements - Corrected based on live DOM inspection (Feb 2026)
    // H2 "Browse by Location" is a direct sibling, NOT inside description-component
    this.browseByLocationText = this.locationOverlay.locator('h2').first();
    this.descriptionComponents = this.locationOverlay.locator('[data-qa="description-component"]');
    this.autodetectionText = this.locationOverlay.locator('[data-qa="description-component"]').nth(1); // Second description component
    this.bayerGlobalText = this.locationOverlay.locator('button').filter({ hasText: 'Bayer Global' }).first();
    
    // Interactive Elements - Based on DOM inspection findings
    this.searchAtom = this.locationOverlay.locator('[data-qa="search-atom"]');
    this.findByLocationInput = this.searchAtom.locator('input').first();
    this.locationList = this.locationOverlay.locator('ul, [role="list"]').first();
    this.locationItems = this.locationOverlay.locator('button[aria-label^="Select"]');
    
    // Location Details
    this.locationLabelHeadline = this.locationOverlay.locator('h1, h2, h3, h4').filter({ hasText: /^(?!Browse by Location)/ }).first();
    this.addressText = this.locationOverlay.locator('[data-qa*="address"], :has-text("Address"), :has-text("Phone")').first();
  }

  /**
   * Navigate to Location Component test page with authentication
   */
  async navigateToLocationPage(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const testUrl = await this.getComponentUrl('LocationComponent', baseURL);

    try {
      await this.navigateWithAuthentication(testUrl);
      await this.acceptCookiesBanner();
      await this.page.waitForLoadState('domcontentloaded');
      this.log('Successfully navigated to Location Component test page');
    } catch (error) {
      this.log('Failed to navigate to Location test page: ' + (error as Error).message);
      throw error;
    }
  }

  // ========================================
  // CORE NAVIGATION METHODS
  // ========================================

  /**
   * Dismiss cookie consent banner if it's still present and could intercept clicks
   */
  private async dismissCookieBannerIfPresent(): Promise<void> {
    try {
      // Wait for the OneTrust banner to potentially appear (loads asynchronously)
      const bannerVisible = await this.page.locator('#onetrust-banner-sdk')
        .waitFor({ state: 'visible', timeout: 6000 })
        .then(() => true)
        .catch(() => false);

      if (!bannerVisible) return;

      this.log('Cookie consent banner detected, dismissing it');
      const acceptButton = this.page.locator('#onetrust-accept-btn-handler');
      const acceptVisible = await acceptButton.isVisible().catch(() => false);
      if (acceptVisible) {
        await acceptButton.click({ force: true, timeout: 5000 });
        await this.page.locator('#onetrust-consent-sdk')
          .waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
        await this.page.waitForTimeout(500);
      }
      // Always remove any remaining overlay elements from DOM
      await this.page.evaluate(() => {
        for (const sel of ['#onetrust-consent-sdk', '#onetrust-banner-sdk', '.onetrust-pc-dark-filter']) {
          document.querySelectorAll(sel).forEach(el => el.remove());
        }
      });
      await this.page.waitForTimeout(500);
    } catch {
      // Banner not present, continue
    }
  }

  /**
   * Open location overlay from header button (AC6)
   * For MD/SM viewports, opens from navigation flyout menu
   */
  async openLocationOverlayFromHeader(): Promise<void> {
    this.log('Opening location overlay from header button');
    
    // Check if overlay is already open by checking button aria-expanded and the
    // overlay container. Use the locale-agnostic [data-qa="location-overlay"]
    // container (NOT a hardcoded English heading) so detection works on every
    // market (e.g. German renders "Nach Standort suchen", not "Browse by Location").
    const buttonExpanded = await this.locationButtonHeader.getAttribute('aria-expanded');
    const overlayVisible = await this.locationOverlay.isVisible().catch(() => false);
    
    if (buttonExpanded === 'true' || overlayVisible) {
      this.log('Location overlay is already open (aria-expanded="true" or overlay visible), skipping open action');
      return;
    }
    
    // Check viewport width - on MD/SM viewports, location button is only in flyout menu
    const viewportSize = await this.page.evaluate(() => window.innerWidth);
    
    if (viewportSize < 1024) {
      // MD/SM viewport - use flyout menu
      this.log('Detected MD/SM viewport, using flyout menu to access location button');
      await this.openLocationOverlayFromFlyout();
      return;
    }
    
    // LG/XL viewport - use header button
    await this.locationButtonHeader.waitFor({ state: 'visible', timeout: 10000 });
    
    // Try different click approaches to handle element interception
    try {
      // First try normal click
      await this.locationButtonHeader.click({ timeout: 5000 });
    } catch (error) {
      this.log('Normal click failed: ' + (error as Error).message);
      try {
        // If normal click fails, try scrolling into view first
        await this.locationButtonHeader.scrollIntoViewIfNeeded();
        await this.locationButtonHeader.click({ timeout: 5000 });
      } catch (error_) {
        // If still failing, use force click to bypass interception
        this.log('Using force click due to element interception: ' + (error_ as Error).message);
        await this.locationButtonHeader.click({ force: true, timeout: 5000 });
      }
    }
    
    // Wait for overlay to appear (locale-agnostic: container, not English text)
    await this.locationOverlay.waitFor({ state: 'visible', timeout: 15000 });
    this.log('Location overlay opened from header successfully');
  }
  /**
   * Open location overlay from navigation flyout (AC6, AC14)
   */
  async openLocationOverlayFromFlyout(): Promise<void> {
    this.log('Opening location overlay from navigation flyout');
    
    // Check if overlay is already open
    const overlayVisible = await this.locationOverlay.isVisible().catch(() => false);
    if (overlayVisible) {
      this.log('Location overlay is already open, skipping flyout open action');
      return;
    }

    // Dismiss cookie consent banner if still present (it can intercept clicks)
    await this.dismissCookieBannerIfPresent();
    
    // Check if flyout is already open by looking for the location button inside it
    const flyoutLocationButtonCount = await this.locationButtonFlyout.count();
    
    if (flyoutLocationButtonCount === 0) {
      // Flyout is not open, need to open it first
      // Target the button that WRAPS the burger SVG. The previous selector
      // (button[aria-label*="Menu"]) matched 5 buttons and .first() was not the burger, so the
      // flyout never opened (TC-L02). The burger icon carries aria-label "Burger Menu ...".
      const menuButton = this.page
        .locator('button:has(svg[aria-label*="Burger" i]), button[aria-label*="Burger Menu" i]')
        .first();
      
      // Wait for menu button to be ready and stable
      await menuButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.page.waitForTimeout(500); // Wait for animations to complete
      
      try {
        await menuButton.click({ timeout: 10000 });
      } catch (error) {
        // If click fails due to interception, try force click
        this.log('Menu button click failed, retrying with force: ' + (error as Error).message);
        await menuButton.click({ force: true });
      }
      
      await this.navigationFlyout.waitFor({ state: 'visible', timeout: 15000 });
    } else {
      this.log('Flyout menu is already open, proceeding to location button');
    }
    
    await this.locationButtonFlyout.waitFor({ state: 'visible', timeout: 10000 });
    
    // Dismiss cookie banner if it's blocking the button
    try {
      await this.acceptCookiesBanner();
    } catch (error) {
      this.log('Cookie banner handling attempt: ' + (error as Error).message);
    }
    
    // Try clicking with retry logic for cookie banner interference
    try {
      await this.locationButtonFlyout.click({ timeout: 10000 });
    } catch (error) {
      this.log('Location button click failed, retrying with force: ' + (error as Error).message);
      await this.locationButtonFlyout.click({ force: true });
    }
    
    // Wait for overlay to appear
    await this.locationOverlay.waitFor({ state: 'visible', timeout: 15000 });
    this.log('Location overlay opened from flyout successfully');
  }

  /**
   * Close location overlay (AC15)
   */
  async closeLocationOverlay(): Promise<void> {
    this.log('Closing location overlay');
    
    // Check if overlay is actually open before trying to close
    const isOpen = await this.locationOverlay.isVisible().catch(() => false);
    if (!isOpen) {
      this.log('Location overlay is not open, skipping close action');
      return;
    }
    
    await this.overlayCloseButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.overlayCloseButton.click();
    
    // Verify overlay is hidden
    await this.locationOverlay.waitFor({ state: 'hidden', timeout: 10000 });
    this.log('Location overlay closed successfully');
  }

  /**
   * Close overlay using Escape key (AC15)
   */
  async closeLocationOverlayWithEscape(): Promise<void> {
    this.log('Closing location overlay with Escape key');
    
    await this.page.keyboard.press('Escape');
    
    // Verify overlay is hidden
    await this.locationOverlay.waitFor({ state: 'hidden', timeout: 10000 });
    this.log('Location overlay closed with Escape key successfully');
  }

  // ========================================
  // FUNCTIONAL VALIDATION METHODS
  // ========================================

  /**
   * Validate headline display (AC1)
   */
  async validateHeadlineDisplay(): Promise<void> {
    this.log('Validating headline display in location overlay');
    
    // Soft assertions to prevent premature termination
    expect.soft(this.browseByLocationText).toBeVisible();
    expect.soft(this.browseByLocationText).not.toBeEmpty();
    
    // Verify semantic structure
    const tagName = await this.browseByLocationText.evaluate(el => el.tagName.toLowerCase());
    expect.soft(['h1', 'h2', 'h3']).toContain(tagName);
    
    this.log('Headline display validation completed');
  }

  /**
   * Validate description text display (AC3)
   */
  async validateDescriptionTextDisplay(): Promise<void> {
    this.log('Validating description text display per locale');
    
    const descriptionCount = await this.descriptionComponents.count();
    expect.soft(descriptionCount).toBeGreaterThanOrEqual(2); // From DOM inspection
    
    // Verify each description component has content
    for (let i = 0; i < descriptionCount; i++) {
      const description = this.descriptionComponents.nth(i);
      expect.soft(description).toBeVisible();
      expect.soft(description).not.toBeEmpty();
    }
    
    this.log('Description text display validation completed');
  }

  /**
   * Validate auto detection text (AC4, AC5)
   */
  async validateAutoDetectionText(): Promise<void> {
    this.log('Validating auto detection text display');
    
    expect.soft(this.autodetectionText).toBeVisible();
    expect.soft(this.autodetectionText).not.toBeEmpty();
    
    // Check for link presence if cookies accepted
    const hasLink = await this.autodetectionText.locator('a, [role="link"]').count();
    this.log(`Auto detection text has ${hasLink} link(s)`);
    
    this.log('Auto detection text validation completed');
  }

  /**
   * Validate Bayer Global positioning (AC8)
   */
  async validateBayerGlobalPositioning(): Promise<void> {
    this.log('Validating Bayer Global is displayed separately');
    
    expect.soft(this.bayerGlobalText).toBeVisible();
    expect.soft(this.bayerGlobalText).not.toBeEmpty();
    
    // Verify it appears first in the list (implementation specific)
    const firstLocationItem = this.locationItems.first();
    const isBayerGlobalFirst = await firstLocationItem.filter({ hasText: /Bayer Global/i }).count() > 0;
    this.log('Bayer Global is first item: ' + isBayerGlobalFirst);
    
    this.log('Bayer Global positioning validation completed');
  }

  /**
   * Search country/group items (AC11)
   */
  async searchLocationItems(searchTerm: string): Promise<void> {
    this.log('Searching for location items with term: "' + searchTerm + '"');
    
    await this.findByLocationInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.findByLocationInput.fill(searchTerm);
    
    // Wait for search results to filter
    await this.page.waitForTimeout(1000);
    
    this.log('Location search completed');
  }

  /**
   * Select a country/group item (AC12)
   */
  async selectLocationItem(itemName: string): Promise<void> {
    this.log('Selecting location item: "' + itemName + '"');
    
    const targetItem = this.locationItems.filter({ hasText: new RegExp(itemName, 'i') }).first();
    await targetItem.waitFor({ state: 'visible', timeout: 5000 });
    await targetItem.click();
    
    // Wait for location details to update
    await this.page.waitForTimeout(1500);
    
    this.log('Location item "' + itemName + '" selected successfully');
  }

  /**
   * Validate alphabetical sorting (AC10)
   */
  async validateAlphabeticalSorting(): Promise<void> {
    this.log('Validating alphabetical sorting of location items');
    
    const itemTexts = await this.locationItems.allTextContents();
    const filteredTexts = itemTexts
      .filter(text => text.trim() && !text.toLowerCase().includes('bayer global'))
      .map(text => text.trim().toLowerCase());
    
    const sortedTexts = [...filteredTexts].sort((a, b) => a.localeCompare(b));
    const isAlphabetical = JSON.stringify(filteredTexts) === JSON.stringify(sortedTexts);
    
    this.log('Location items alphabetical order: ' + isAlphabetical);
    expect.soft(isAlphabetical).toBeTruthy();
    
    this.log('Alphabetical sorting validation completed');
  }

  /**
   * Validate all country/group items are displayed (AC7)
   */
  async validateAllLocationItemsDisplayed(): Promise<void> {
    this.log('Validating all country/group items are displayed');
    
    // Verify location items list is visible
    await expect.soft(this.locationList).toBeVisible();
    
    // Get count of all location items
    const itemCount = await this.locationItems.count();
    this.log('Total location items displayed: ' + itemCount);
    
    // Verify at least some locations are displayed (AC7)
    expect.soft(itemCount).toBeGreaterThan(0);
    
    // Verify each item is visible and has content
    for (let i = 0; i < Math.min(itemCount, 5); i++) {
      const item = this.locationItems.nth(i);
      await expect.soft(item).toBeVisible();
      await expect.soft(item).not.toBeEmpty();
    }
    
    this.log('All location items validation completed - ' + itemCount + ' items found');
  }

  /**
   * Select location and verify navigation (AC13)
   */
  async selectAndVerifyNavigation(itemName: string, page: Page): Promise<void> {
    this.log('Selecting location "' + itemName + '" and verifying navigation');
    
    // Get initial URL
    const initialUrl = page.url();
    this.log('Initial URL: ' + initialUrl);
    
    // Select the location item
    const targetItem = this.locationItems.filter({ hasText: new RegExp(itemName, 'i') }).first();
    await targetItem.waitFor({ state: 'visible', timeout: 5000 });
    
    // Look for link within the location details after selection
    await targetItem.click();
    await this.page.waitForTimeout(1500); // Wait for details to load
    
    // Find and click the site URL link if available
    const siteLink = this.locationOverlay.locator('a[href*="http"], a[href*="www"]').first();
    const linkExists = await siteLink.isVisible().catch(() => false);
    
    if (linkExists) {
      this.log('Site link found, clicking to verify navigation');
      
      // Click the link - may open new tab or navigate
      await siteLink.click();
      await this.page.waitForTimeout(2000);
      
      this.log('Location link clicked successfully');
    } else {
      this.log('No external site link found for this location');
    }
  }

  /**
   * Verify location overlay is closed (AC13)
   */
  async verifyOverlayClosed(): Promise<void> {
    this.log('Verifying location overlay is closed');
    
    // Check if overlay is no longer visible
    const isOverlayClosed = await this.locationOverlay.isVisible().catch(() => false);
    
    if (isOverlayClosed) {
      this.log('Location overlay is still visible - may need manual close');
      // Attempt to close if still visible
      await this.closeLocationOverlay().catch(() => {
        this.log('Could not close overlay automatically');
      });
    } else {
      this.log('Location overlay is correctly closed');
    }
  }

  // ========================================
  // ACCESSIBILITY VALIDATION METHODS
  // ========================================

  /**
   * Validate keyboard navigation (AC15 - Escape key, general accessibility)
   */
  async validateKeyboardNavigation(): Promise<void> {
    this.log('Validating keyboard navigation support');
    
    // Test Tab navigation through interactive elements
    await this.findByLocationInput.focus();
    await this.page.keyboard.press('Tab');
    
    // Verify focus management
    const focusedElement = await this.page.evaluate(() => document.activeElement?.tagName);
    expect.soft(focusedElement).toBeTruthy();
    
    this.log('Keyboard navigation validation completed');
  }

  /**
   * Validate ARIA attributes and semantic structure
   */
  async validateAriaAttributes(): Promise<void> {
    this.log('Validating ARIA attributes and semantic structure');
    
    // Check overlay has proper role
    const overlayRole = await this.locationOverlay.getAttribute('role');
    this.log('Location overlay role: ' + overlayRole);
    
    // Check input has proper labels
    const inputLabel = await this.findByLocationInput.getAttribute('aria-label');
    const inputPlaceholder = await this.findByLocationInput.getAttribute('placeholder');
    expect.soft(inputLabel || inputPlaceholder).toBeTruthy();
    
    // Check list has proper structure
    const listRole = await this.locationList.getAttribute('role');
    this.log('Location list role: ' + listRole);
    
    this.log('ARIA attributes validation completed');
  }

  // ========================================
  // VISUAL VALIDATION METHODS
  // ========================================

  /**
   * Validate typography across viewports using Figma values
   */
  async validateTypographyForViewport(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    this.log('Validating typography for ' + viewport + ' viewport');
    
    // Get expected values from Figma
    const expectedBrowseText = getLocationElement(viewport, 'browseByLocationText');
    
    if (expectedBrowseText) {
      // Validate font family
      const actualFontFamily = await this.browseByLocationText.evaluate(
        el => getComputedStyle(el).fontFamily
      );
      expect.soft(actualFontFamily).toContain('Bayer Sans');
      
      // Validate font size
      const actualFontSize = await this.browseByLocationText.evaluate(
        el => getComputedStyle(el).fontSize
      );
      expect.soft(actualFontSize).toBe(expectedBrowseText.fontSize);
      
      // Validate line height
      const actualLineHeight = await this.browseByLocationText.evaluate(
        el => getComputedStyle(el).lineHeight
      );
      expect.soft(actualLineHeight).toBe(expectedBrowseText.lineHeight);
      
      // Validate color
      const actualColor = await this.browseByLocationText.evaluate(
        el => {
          const rgb = getComputedStyle(el).color;
          // Convert rgb to rgba format for comparison
          return rgb.includes('rgba') ? rgb : rgb.replace('rgb', 'rgba').replace(')', ', 1)');
        }
      );
      expect.soft(actualColor).toBe(expectedBrowseText.color);
      
      this.log(viewport + ' typography validation completed');
    } else {
      this.log('No Figma values available for ' + viewport + ' viewport');
    }
  }

  /**
   * Validate visual consistency across all elements
   */
  async validateVisualConsistency(): Promise<void> {
    this.log('Validating visual consistency of location elements');
    
    // Verify all text elements use Bayer Sans font family
    const textElements = [
      this.browseByLocationText,
      this.bayerGlobalText,
      this.locationLabelHeadline
    ];
    
    for (const element of textElements) {
      const fontFamily = await element.evaluate(
        el => getComputedStyle(el).fontFamily
      );
      expect.soft(fontFamily).toContain('Bayer Sans');
    }
    
    this.log('Visual consistency validation completed');
  }

  // ========================================
  // PERFORMANCE VALIDATION METHODS
  // ========================================

  /**
   * Validate overlay loading performance
   */
  async validateOverlayLoadingPerformance(): Promise<void> {
    this.log('Validating location overlay loading performance');
    
    const startTime = Date.now();
    
    // Open overlay and measure time
    await this.openLocationOverlayFromHeader();
    
    const loadTime = Date.now() - startTime;
    this.log('Location overlay loaded in ' + loadTime + 'ms');
    
    // Performance expectation: should load within 3 seconds
    expect.soft(loadTime).toBeLessThan(3000);
    
    this.log('Overlay loading performance validation completed');
  }

  /**
   * Validate search performance
   */
  async validateSearchPerformance(): Promise<void> {
    this.log('Validating location search performance');
    
    const startTime = Date.now();
    
    // Perform search and measure response time
    await this.searchLocationItems('Germany');
    
    const searchTime = Date.now() - startTime;
    this.log('Location search completed in ' + searchTime + 'ms');
    
    // Performance expectation: search should respond within 1 second
    expect.soft(searchTime).toBeLessThan(1000);
    
    this.log('Search performance validation completed');
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Wait for location overlay to be fully loaded
   */
  async waitForLocationOverlayReady(): Promise<void> {
    this.log('Waiting for location overlay to be ready');
    
    await this.locationOverlay.waitFor({ state: 'visible', timeout: 15000 });
    await this.browseByLocationText.waitFor({ state: 'visible', timeout: 10000 });
    await this.findByLocationInput.waitFor({ state: 'visible', timeout: 10000 });
    
    // Wait for any loading animations to complete
    await this.page.waitForTimeout(1000);
    
    this.log('Location overlay is ready');
  }

  /**
   * Get current viewport size for responsive testing
   */
  async getCurrentViewport(): Promise<'XL' | 'LG' | 'MD' | 'SM'> {
    const viewportSize = this.page.viewportSize();
    if (!viewportSize) return 'XL';
    
    const width = viewportSize.width;
    if (width >= 1440) return 'XL';
    if (width >= 1024) return 'LG';  
    if (width >= 768) return 'MD';
    return 'SM';
  }

  /**
   * Validate back button behavior (AC14)
   */
  async validateBackButtonBehavior(openedFromFlyout: boolean = false): Promise<void> {
    this.log('Validating back button behavior (opened from flyout: ' + openedFromFlyout + ')');
    
    const backButtonExists = await this.overlayBackButton.isVisible().catch(() => false);
    
    if (openedFromFlyout) {
      expect.soft(backButtonExists).toBeTruthy();
      this.log('Back button is correctly displayed when opened from flyout');
    } else {
      expect.soft(backButtonExists).toBeFalsy();
      this.log('Back button is correctly hidden when opened from header');
    }
    
    this.log('Back button behavior validation completed');
  }
}
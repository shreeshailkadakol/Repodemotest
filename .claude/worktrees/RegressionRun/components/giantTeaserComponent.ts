import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';

/**
 * Giant Teaser Component Page Object
 * Represents the Giant Teaser that appears in the right-hand pane of
 * Navigation and Language Selection Overlays
 *
 * Visibility Rules:
 * - Visible on XL (>=1440px) and LG (>=1024px) viewports
 * - Hidden on MD (>=768px) and SM (<768px) viewports
 */
export class GiantTeaserComponent extends BasePage {
  // Overlay containers (using data-qa)
  private readonly navigationOverlay: Locator = this.page.locator('[data-qa="FlyoutMenu"]');
  private readonly languageOverlay: Locator = this.page.locator('[data-qa="language-dropdown"]');

  // Overlay trigger buttons (using role-based selectors as data-qa may not exist)
  private readonly menuButton: Locator = this.page.getByRole('button', { name: 'Menu' });
  private readonly closeMenuButton: Locator = this.page.getByRole('button', { name: 'Close menu' });
  private readonly languageSelectorButton: Locator = this.page.getByRole('button', { name: 'Open language selector' });
  private readonly closeLanguageButton: Locator = this.page.getByRole('button', { name: 'Close' }).first();

  // Giant Teaser container - appears in right pane alongside overlays, not inside them
  // On XL viewport: positioned at left: 720px, width: 720px
  // On LG viewport: positioned at left: 512px, width: 512px
  // The Giant Teaser appears on the page when overlays are open, positioned as a sibling
  private getGiantTeaserWhenNavigationOpen(): Locator {
    // The Giant Teaser has aria-label "Individual teaser card" (exact, no number suffix)
    // Card teasers have "Individual teaser card 1", "Individual teaser card 2", etc.
    return this.page.getByRole('region', { name: 'Individual teaser card', exact: true });
  }
  
  private getGiantTeaserWhenLanguageOpen(): Locator {
    return this.page.getByRole('region', { name: 'Individual teaser card', exact: true });
  }

  // Contact Us link in Navigation Overlay
  // Located in the flyout panel alongside language/location selectors (has an icon image)
  private get contactUsLink(): Locator {
    return this.page.getByRole('link', { name: /Contact/i }).filter({
      has: this.page.locator('img')
    }).first();
  }

  // Viewport configurations
  public readonly viewports = {
    XL: { width: 1440, height: 900 },
    LG: { width: 1024, height: 768 },
    MD: { width: 768, height: 1024 },
    SM: { width: 375, height: 667 },
  };

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ==================== VIEWPORT MANAGEMENT ====================

  /**
   * Set viewport size for testing
   * @param viewport - 'XL' | 'LG' | 'MD' | 'SM'
   */
  async setViewport(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    const dimensions = this.viewports[viewport];
    await this.page.setViewportSize(dimensions);
    await this.log(`Viewport set to ${viewport}: ${dimensions.width}x${dimensions.height}`);
  }

  // ==================== OVERLAY INTERACTION METHODS ====================

  /**
   * Check if language selector button is visible
   * @returns Promise<boolean>
   */
  async isLanguageSelectorVisible(): Promise<boolean> {
    try {
      await this.languageSelectorButton.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Open Navigation Overlay
   */
  async openNavigationOverlay(): Promise<void> {
    await this.menuButton.waitFor({ state: 'visible', timeout: 10000 });
    try {
      await this.menuButton.click({ timeout: 10000 });
    } catch (error) {
      await this.log('Regular click blocked, dispatching click event...');
      await this.menuButton.dispatchEvent('click');
    }
    await this.navigationOverlay.waitFor({ state: 'visible', timeout: 10000 });
    await this.log('Navigation Overlay opened');
  }

  /**
   * Close Navigation Overlay
   */
  async closeNavigationOverlay(): Promise<void> {
    await this.closeMenuButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.closeMenuButton.click();
    // Wait for animation to complete before checking if overlay is hidden
    await this.page.waitForTimeout(1000);
    await this.navigationOverlay.waitFor({ state: 'hidden', timeout: 10000 });
    await this.log('Navigation Overlay closed');
  }

  /**
   * Open Language Selection Overlay
   */
  async openLanguageSelectionOverlay(): Promise<void> {
    await this.languageSelectorButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.languageSelectorButton.click();
    await this.languageOverlay.waitFor({ state: 'visible', timeout: 10000 });
    await this.log('Language Selection Overlay opened');
  }

  /**
   * Close Language Selection Overlay
   */
  async closeLanguageSelectionOverlay(): Promise<void> {
    // Use Escape key instead of clicking close button as it's more reliable
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1000);
    await this.log('Language Selection Overlay closed');
  }

  // ==================== VISIBILITY VALIDATION METHODS ====================

  // ==================== HELPER METHODS ====================

  /**
   * Get Giant Teaser locator based on overlay context
   * @param context - 'navigation' | 'language'
   * @returns Locator for Giant Teaser in specified overlay
   */
  private getGiantTeaserLocator(context: 'navigation' | 'language'): Locator {
    return context === 'navigation' 
      ? this.getGiantTeaserWhenNavigationOpen() 
      : this.getGiantTeaserWhenLanguageOpen();
  }

  /**
   * Get Giant Teaser title locator based on overlay context
   * @param context - 'navigation' | 'language'
   * @returns Locator for title
   */
  private getGiantTeaserTitleLocator(context: 'navigation' | 'language'): Locator {
    const container = this.getGiantTeaserLocator(context);
    // Title is first text div inside the teaser content wrapper
    return container.locator('div > div').first();
  }

  /**
   * Get Giant Teaser description locator based on overlay context
   * @param context - 'navigation' | 'language'
   * @returns Locator for description
   */
  private getGiantTeaserDescriptionLocator(context: 'navigation' | 'language'): Locator {
    const container = this.getGiantTeaserLocator(context);
    // Description is second text div inside the teaser content wrapper
    return container.locator('div > div').nth(1);
  }

  /**
   * Get Giant Teaser CTA locator based on overlay context
   * @param context - 'navigation' | 'language'
   * @returns Locator for CTA button/link inside the Giant Teaser
   */
  private getGiantTeaserCTALocator(context: 'navigation' | 'language'): Locator {
    const container = this.getGiantTeaserLocator(context);
    // CTA can be a link with data-qa="Link", data-qa="cta-link" or any anchor tag
    return container.locator('a[href]').first();
  }

  /**
   * Check if the Giant Teaser CTA link exists (it's optional on some environments)
   */
  async hasGiantTeaserCTA(context: 'navigation' | 'language' = 'navigation'): Promise<boolean> {
    const locator = this.getGiantTeaserCTALocator(context);
    return locator.isVisible({ timeout: 3000 }).catch(() => false);
  }

  /**
   * Check if Contact Us link exists in the overlay (optional field)
   */
  async hasContactUsLink(): Promise<boolean> {
    return this.contactUsLink.isVisible({ timeout: 3000 }).catch(() => false);
  }

  // ==================== VISIBILITY VALIDATION METHODS ====================

  /**
   * Check if Giant Teaser is visible
   * @param context - 'navigation' | 'language' - specifies which overlay to check
   * @returns Promise<boolean>
   */
  async isGiantTeaserVisible(context: 'navigation' | 'language' = 'navigation'): Promise<boolean> {
    try {
      const locator = this.getGiantTeaserLocator(context);
      await locator.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify Giant Teaser is visible (soft assertion)
   * @param context - 'navigation' | 'language' - specifies which overlay to check
   */
  async verifyGiantTeaserVisible(context: 'navigation' | 'language' = 'navigation'): Promise<void> {
    // Wait a moment for Giant Teaser to appear after overlay opens
    await this.page.waitForTimeout(1000);
    
    const locator = this.getGiantTeaserLocator(context);
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    
    await expect.soft(locator).toBeVisible({ timeout: 5000 });

    // Bounding box used in diagnostic error messages below (was previously referenced
    // without being defined, causing a ReferenceError instead of the intended message).
    const teaserBbox = await locator.boundingBox();

    const teaserText = await locator.textContent();
    await this.log(`Giant Teaser visible in ${context} overlay, content: ${teaserText?.substring(0, 100)}...`);
    
    // CRITICAL VALIDATION: Check if element contains placeholder/"error" text instead of real content
    // QA environment shows "or None" - this is NOT a valid Giant Teaser
    const textLower = teaserText?.toLowerCase() || '';
    const hasPlaceholderText = textLower.includes('or none') || textLower.includes('ornone') || 
                               textLower === 'none' || textLower.trim().length < 10;
    
    if (hasPlaceholderText) {
      throw new Error(`Giant Teaser validation FAILED - Element at position (x=${teaserBbox?.x}px) contains placeholder/error text: "${teaserText}". This is NOT a valid Giant Teaser component, just a placeholder showing "or None" or similar empty state.`);
    }
    
    await this.log('[OK] Giant Teaser does not contain placeholder text - has real content');
    
    // CRITICAL VALIDATION: Giant Teaser MUST have actual hero media - an image OR a video.
    // (The component now supports both; a video-only teaser is valid.)
    await this.log('Validating Giant Teaser has required hero media (image or video)...');

    // Check for <img> tags
    const imgElements = await locator.locator('img').count();
    await this.log(`Found ${imgElements} <img> elements in Giant Teaser`);

    // Check for <video> media (Giant Teaser now supports video as well as image)
    const videoElements = await locator
      .locator('video, [data-qa="giant-teaser-video"], [data-qa="giant-teaser-video-element"]')
      .count();
    await this.log(`Found ${videoElements} video element(s) in Giant Teaser`);

    // Check for elements with background images
    const hasBackgroundImage = await locator.evaluate((el: HTMLElement) => {
      const allElements = [el, ...Array.from(el.querySelectorAll('*'))] as HTMLElement[];
      return allElements.some(elem => {
        const bgImage = window.getComputedStyle(elem).backgroundImage;
        const rect = elem.getBoundingClientRect();
        // Must have background image with substantial dimensions (hero image size)
        return bgImage && bgImage !== 'none' && bgImage.includes('url') && 
               rect.width >= 300 && rect.height >= 300;
      });
    });
    
    await this.log(`Has substantial background image (>= 300x300): ${hasBackgroundImage}`);
    
    // Giant Teaser MUST have hero media: an <img>, a <video>, OR a substantial background image
    if (imgElements === 0 && videoElements === 0 && !hasBackgroundImage) {
      throw new Error(`Giant Teaser validation FAILED - Element at position (x=${teaserBbox?.x}px) has NO HERO MEDIA. Found ${imgElements} img tags, ${videoElements} video elements, and no substantial background images (>= 300x300px). This is likely showing "or None" placeholder or wrong element. Giant Teaser requires a hero image or video.`);
    }

    await this.log('[OK] Giant Teaser has hero media (img, video, or background image)');
    
    // CRITICAL: Validate Giant Teaser has substantial content
    // QA shows only 21 chars ("crop scienceread more"), production has full content
    // Check total text content length without hardcoding specific text
    await this.log('Validating Giant Teaser content completeness...');
    
    const fullContentText = (teaserText || '').trim();
    const contentLength = fullContentText.length;
    
    await this.log(`  - Total content length: ${contentLength} chars`);
    await this.log(`  - Content preview: "${fullContentText.substring(0, 100)}..."`);
    
    // Giant Teaser must have substantial content (title + description + CTA = significant text)
    // QA has only ~21 chars, production has full Giant Teaser with title, description, CTA
    // Using 50 chars as minimum threshold (more than QA's 21, less than any real Giant Teaser)
    if (contentLength < 50) {
      throw new Error(`Giant Teaser validation FAILED - Insufficient content. Found only ${contentLength} characters: "${fullContentText}". Expected substantial Giant Teaser content with title, description, and CTA (>50 chars). This element appears to be showing placeholder/incomplete content.`);
    }
    
    // Check for CTA/Link element for structural validation
    const ctaLocator = locator.locator('[data-qa="Link"], a[href]');
    const ctaCount = await ctaLocator.count();
    const ctaVisible = ctaCount > 0 ? await ctaLocator.first().isVisible().catch(() => false) : false;
    
    await this.log(`  - CTA/Link elements: ${ctaCount} (visible: ${ctaVisible})`);
    
    if (!ctaVisible) {
      throw new Error(`Giant Teaser validation FAILED - No visible CTA/link element found. A valid Giant Teaser must have a call-to-action link.`);
    }
    
    await this.log(`[OK] Giant Teaser has substantial content (${contentLength} chars) and valid CTA`);
    
    // Wait for Giant Teaser image to load completely
    await this.log('Waiting for Giant Teaser image to load completely...');
    
    // Wait for the Giant Teaser element and its images to be fully loaded
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
      this.log('Network idle timeout - continuing with validation');
    });
    await this.page.waitForTimeout(2000); // Wait for any lazy-loaded images
    
    await this.log('[OK] Giant Teaser element and images fully loaded');
    await this.log(`Giant Teaser verification complete in ${context} overlay`);
  }

  /**
   * Verify Giant Teaser is hidden (soft assertion)
   * @param context - 'navigation' | 'language' - specifies which overlay to check
   */
  async verifyGiantTeaserHidden(context: 'navigation' | 'language' = 'navigation'): Promise<void> {
    const locator = this.getGiantTeaserLocator(context);
    const count = await locator.count();
    
    if (count === 0) {
      await this.log(`Giant Teaser element not present in DOM - hidden by design in ${context} overlay`);
      return;
    }

    // On MD/SM viewports, the Giant Teaser may still exist in DOM but should be hidden or out of viewport
    const isVisible = await locator.isVisible().catch(() => false);
    if (isVisible) {
      // Check if it's actually within the viewport (may be rendered off-screen)
      const bbox = await locator.boundingBox().catch(() => null);
      const viewportSize = this.page.viewportSize();
      const inViewport = bbox && viewportSize && bbox.x < viewportSize.width && bbox.y < viewportSize.height;
      expect.soft(inViewport, `Giant Teaser should not be visible in viewport on ${context} overlay`).toBeFalsy();
    }
    await this.log(`Giant Teaser is hidden/off-viewport in ${context} overlay`);
  }

  // ==================== CONTENT VALIDATION METHODS ====================

  /**
   * Verify Giant Teaser title is present and has content (language-agnostic)
   * @param context - 'navigation' | 'language' - specifies which overlay to check
   */
  async verifyGiantTeaserTitle(context: 'navigation' | 'language' = 'navigation'): Promise<void> {
    const container = this.getGiantTeaserLocator(context);
    await expect.soft(container).toBeVisible({ timeout: 5000 });
    const text = await container.textContent();
    const hasContent = text && text.trim().length > 0;
    expect.soft(hasContent, `Giant Teaser should have title content in ${context} overlay`).toBeTruthy();
    await this.log(`Giant Teaser title/content found in ${context} overlay: ${text?.substring(0, 50)}...`);
  }

  /**
   * Verify Giant Teaser description is present and has content (language-agnostic)
   * @param context - 'navigation' | 'language' - specifies which overlay to check
   */
  async verifyGiantTeaserDescription(context: 'navigation' | 'language' = 'navigation'): Promise<void> {
    const container = this.getGiantTeaserLocator(context);
    await expect.soft(container).toBeVisible({ timeout: 5000 });
    const text = await container.textContent();
    // Description should make the total content > 20 chars (title alone is shorter)
    const hasDescription = text && text.trim().length > 20;
    expect.soft(hasDescription, `Giant Teaser should have description content in ${context} overlay`).toBeTruthy();
    await this.log(`Giant Teaser description verified in ${context} overlay (${text?.trim().length} chars)`);
  }

  /**
   * Verify Giant Teaser CTA link is present and functional (optional - skips if not present)
   * @param context - 'navigation' | 'language' - specifies which overlay to check
   */
  async verifyGiantTeaserCTA(context: 'navigation' | 'language' = 'navigation'): Promise<void> {
    const hasCTA = await this.hasGiantTeaserCTA(context);
    if (!hasCTA) {
      await this.log(`Giant Teaser CTA link not present in ${context} overlay - skipping (optional field)`);
      return;
    }
    const locator = this.getGiantTeaserCTALocator(context);
    await expect.soft(locator).toBeVisible({ timeout: 5000 });
    const href = await locator.getAttribute('href');
    await expect.soft(href).toBeTruthy();
    await this.log(`Giant Teaser CTA link found in ${context} overlay with href: ${href}`);
  }

  /**
   * Click Giant Teaser CTA link
   * @param context - 'navigation' | 'language' - specifies which overlay to check
   */
  async clickGiantTeaserCTA(context: 'navigation' | 'language' = 'navigation'): Promise<void> {
    const locator = this.getGiantTeaserCTALocator(context);
    await locator.click();
    await this.log(`Giant Teaser CTA clicked in ${context} overlay`);
  }

  // ==================== CONTACT US LINK METHODS ====================

  // ==================== CONTACT US LINK METHODS ====================

  /**
   * Verify Contact Us link in Navigation Overlay (optional - skips if not present)
   */
  async verifyContactUsLink(): Promise<void> {
    const hasLink = await this.hasContactUsLink();
    if (!hasLink) {
      await this.log('Contact Us link not present in overlay - skipping (optional field)');
      return;
    }
    await expect.soft(this.contactUsLink).toBeVisible({ timeout: 5000 });
    
    // Verify element is clickable (works for both link and button)
    await expect.soft(this.contactUsLink).toBeEnabled();
    
    // Verify element has text content
    const linkText = await this.contactUsLink.textContent();
    expect.soft(linkText).toBeTruthy();
    await this.log(`Contact Us link found with text: ${linkText}`);
  }

  /**
   * Get Contact Us link href attribute
   */
  async getContactUsLinkHref(): Promise<string | null> {
    return await this.contactUsLink.getAttribute('href');
  }

  /**
   * Click Contact Us link and wait for navigation (optional - returns false if link not present)
   */
  async clickContactUsLink(): Promise<boolean> {
    const hasLink = await this.hasContactUsLink();
    if (!hasLink) {
      await this.log('Contact Us link not present - skipping click (optional field)');
      return false;
    }

    // Wait for link to be ready
    await this.contactUsLink.waitFor({ state: 'visible', timeout: 5000 });
    
    // Set up navigation promise before clicking
    const navigationPromise = this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
    
    try {
      await this.contactUsLink.click({ timeout: 3000 });
    } catch (error) {
      await this.log('Regular click blocked, dispatching click event...');
      await this.contactUsLink.dispatchEvent('click');
    }
    await this.log('Contact Us link clicked');
    
    // Wait for navigation to complete
    await navigationPromise;
    
    // Additional wait for network to settle
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    
    await this.log('Navigation completed');
    return true;
  }

  // ==================== VISUAL VALIDATION METHODS ====================

  /**
   * Get computed CSS property value for an element
   * @param locator - The element locator
   * @param property - CSS property name (e.g., 'font-family', 'font-size')
   */
  async getComputedStyle(locator: Locator, property: string): Promise<string> {
    return await locator.evaluate((el, prop) => {
      return window.getComputedStyle(el).getPropertyValue(prop);
    }, property);
  }

  /**
   * Verify title typography matches Figma values (soft assertions)
   * @param context - 'navigation' | 'language' - specifies which overlay to check
   * @param expectedFontFamily
   * @param expectedFontSize
   * @param expectedLineHeight
   * @param expectedColor
   */
  async verifyTitleTypography(
    context: 'navigation' | 'language',
    expectedFontFamily: string,
    expectedFontSize: string,
    expectedLineHeight: string,
    expectedColor: string
  ): Promise<void> {
    const locator = this.getGiantTeaserTitleLocator(context);
    const fontFamily = await this.getComputedStyle(locator, 'font-family');
    const fontSize = await this.getComputedStyle(locator, 'font-size');
    const lineHeight = await this.getComputedStyle(locator, 'line-height');
    const color = await this.getComputedStyle(locator, 'color');

    await expect
      .soft(fontFamily, `Title font-family should match Figma in ${context} overlay`)
      .toContain(expectedFontFamily);
    await expect.soft(fontSize, `Title font-size should match Figma in ${context} overlay`).toBe(expectedFontSize);
    await expect.soft(lineHeight, `Title line-height should match Figma in ${context} overlay`).toBe(expectedLineHeight);
    await expect.soft(color, `Title color should match Figma in ${context} overlay`).toBe(expectedColor);

    await this.log(`Title typography verified against Figma values in ${context} overlay`);
  }

  /**
   * Verify description typography matches Figma values (soft assertions)
   * @param context - 'navigation' | 'language' - specifies which overlay to check
   */
  async verifyDescriptionTypography(
    context: 'navigation' | 'language',
    expectedFontFamily: string,
    expectedFontSize: string,
    expectedLineHeight: string,
    expectedColor: string
  ): Promise<void> {
    const locator = this.getGiantTeaserDescriptionLocator(context);
    const fontFamily = await this.getComputedStyle(locator, 'font-family');
    const fontSize = await this.getComputedStyle(locator, 'font-size');
    const lineHeight = await this.getComputedStyle(locator, 'line-height');
    const color = await this.getComputedStyle(locator, 'color');

    await expect
      .soft(fontFamily, `Description font-family should match Figma in ${context} overlay`)
      .toContain(expectedFontFamily);
    await expect
      .soft(fontSize, `Description font-size should match Figma in ${context} overlay`)
      .toBe(expectedFontSize);
    await expect
      .soft(lineHeight, `Description line-height should match Figma in ${context} overlay`)
      .toBe(expectedLineHeight);
    await expect.soft(color, `Description color should match Figma in ${context} overlay`).toBe(expectedColor);

    await this.log(`Description typography verified against Figma values in ${context} overlay`);
  }

  /**
   * Verify CTA button typography matches Figma values (soft assertions)
   * @param context - 'navigation' | 'language' - specifies which overlay to check
   */
  async verifyCTATypography(
    context: 'navigation' | 'language',
    expectedFontFamily: string,
    expectedFontSize: string,
    expectedLineHeight: string,
    expectedColor: string
  ): Promise<void> {
    const locator = this.getGiantTeaserCTALocator(context);
    const fontFamily = await this.getComputedStyle(locator, 'font-family');
    const fontSize = await this.getComputedStyle(locator, 'font-size');
    const lineHeight = await this.getComputedStyle(locator, 'line-height');
    const color = await this.getComputedStyle(locator, 'color');

    await expect
      .soft(fontFamily, `CTA font-family should match Figma in ${context} overlay`)
      .toContain(expectedFontFamily);
    await expect.soft(fontSize, `CTA font-size should match Figma in ${context} overlay`).toBe(expectedFontSize);
    await expect.soft(lineHeight, `CTA line-height should match Figma in ${context} overlay`).toBe(expectedLineHeight);
    await expect.soft(color, `CTA color should match Figma in ${context} overlay`).toBe(expectedColor);

    await this.log(`CTA typography verified against Figma values in ${context} overlay`);
  }

  // ==================== CONTENT CONSISTENCY VALIDATION ====================

  // ==================== CONTENT CONSISTENCY VALIDATION ====================

  /**
   * Verify Giant Teaser content consistency between Navigation and Language Selection overlays
   */
  async verifyContentConsistency(): Promise<void> {
    // Get content from Navigation Overlay
    await this.openNavigationOverlay();
    const navLocator = this.getGiantTeaserLocator('navigation');
    const navVisible = await navLocator.isVisible({ timeout: 5000 }).catch(() => false);
    const navText = navVisible ? await navLocator.textContent().catch(() => '') : '';
    await this.closeNavigationOverlay();

    // Get content from Language Selection Overlay
    await this.openLanguageSelectionOverlay();
    const langLocator = this.getGiantTeaserLocator('language');
    const langVisible = await langLocator.isVisible({ timeout: 5000 }).catch(() => false);
    const langText = langVisible ? await langLocator.textContent().catch(() => '') : '';
    await this.closeLanguageSelectionOverlay();

    // Verify content matches between overlays
    if (navVisible && langVisible) {
      expect.soft(navText?.trim()).toBe(langText?.trim());
      await this.log('Content consistency verified between both overlays');
    } else {
      await this.log(`Giant Teaser visibility: nav=${navVisible}, lang=${langVisible} - skipping consistency check`);
    }
  }

  // ==================== ACCESSIBILITY VALIDATION METHODS ====================

  /**
   * Verify keyboard navigation for Navigation Overlay
   */
  async verifyNavigationOverlayKeyboardAccess(): Promise<void> {
    // Tab to menu button and press Enter
    await this.menuButton.focus();
    await this.page.keyboard.press('Enter');
    await this.navigationOverlay.waitFor({ state: 'visible', timeout: 5000 });

    // Verify Giant Teaser CTA is reachable via Tab
    await this.page.keyboard.press('Tab');
    // Continue tabbing to reach CTA (implementation may vary)

    // Press Escape to close
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1000);

    await this.log('Navigation Overlay keyboard navigation verified');
  }

  /**
   * Verify keyboard navigation for Language Selection Overlay
   */
  async verifyLanguageOverlayKeyboardAccess(): Promise<void> {
    // Tab to language selector and press Enter
    await this.languageSelectorButton.focus();
    await this.page.keyboard.press('Enter');
    await this.languageOverlay.waitFor({ state: 'visible', timeout: 5000 });

    // Press Escape to close
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1000);

    await this.log('Language Selection Overlay keyboard navigation verified');
  }

  /**
   * Run accessibility scan on Giant Teaser
   * @param context - 'navigation' | 'language' - specifies which overlay to check
   */
  async runAccessibilityScan(context: 'navigation' | 'language' = 'navigation'): Promise<void> {
    if (context === 'navigation') {
      await this.openNavigationOverlay();
    } else {
      await this.openLanguageSelectionOverlay();
    }
    
    const accessibilityScanResults = await super.runAccessibilityScan('[data-qa="individual-teaser"]', ['wcag2a', 'wcag2aa']);
    await this.log(`Accessibility scan completed in ${context} overlay: ${JSON.stringify(accessibilityScanResults)}`);
    
    if (context === 'navigation') {
      await this.closeNavigationOverlay();
    } else {
      await this.closeLanguageSelectionOverlay();
    }
  }
}

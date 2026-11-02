import { Page, Locator, Browser, BrowserContext, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';

export class SocialMediaComponent extends BasePage {
  // Parent containers using DOM-first approach
  private readonly footerLinksSection: Locator;
  private readonly socialMediaContainer: Locator;
  
  // Social media links using parent-child relationship with generic data-qa="Link"
  private readonly socialMediaLinks: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);

    // Parent container (first footer links section to avoid strict mode violation)
    this.footerLinksSection = this.page.locator('[data-qa="footer-links"]').first();

    // Social media section container - search page-wide first to see if element exists
    this.socialMediaContainer = this.page.locator('[data-qa="social-media-links"]').first();

    // Individual social media links using generic data-qa="Link" (supports any platform)
    this.socialMediaLinks = this.socialMediaContainer.locator('a[data-qa="Link"]');
  }

  /**
   * Navigate to the Social Media component test page (homepage)
   */
  async navigateToPage(baseURL: string): Promise<void> {
    const url = await this.resolveExecutionUrl('SocialMediaComponent', baseURL);
    await this.navigateWithAuthentication(url);
    
    // Accept cookies banner if present
    await this.acceptCookiesBanner();
    
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load completely and scroll to footer area
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    
    // Scroll to footer area to ensure social media section is visible
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Wait a bit for any lazy-loaded content
    await this.page.waitForTimeout(1500);
    
    // Wait for social media container to be attached to DOM (not necessarily visible)
    await this.socialMediaContainer.waitFor({ state: 'attached', timeout: 10000 });
  }

  /**
   * Get footer links section locator
   */
  getFooterLinksSection(): Locator {
    return this.footerLinksSection;
  }

  /**
   * Get social media container element
   */
  getSocialMediaContainer(): Locator {
    return this.socialMediaContainer;
  }

  /**
   * Get all social media links
   */
  getSocialMediaLinks(): Locator {
    return this.socialMediaLinks;
  }

  /**
   * Get specific social media link by index (0-based)
   * @param index - Index of the link (0 for first link, 1 for second, etc.)
   */
  getSocialMediaLinkByIndex(index: number): Locator {
    return this.socialMediaLinks.nth(index);
  }

  /**
   * Get first social media link matching href pattern (for specific platform if needed)
   * @param hrefPattern - Pattern to match in href attribute (e.g., 'facebook', 'instagram')
   */
  getSocialMediaLinkByHref(hrefPattern: string): Locator {
    return this.socialMediaContainer.locator(`a[data-qa="Link"][href*="${hrefPattern}"]`).first();
  }

  /**
   * Verify social media component structure
   */
  async verifySocialMediaStructure(): Promise<void> {
    // Check if social media container exists in DOM (it might be hidden if no links configured)
    const containerCount = await this.socialMediaContainer.count();
    expect.soft(containerCount).toBeGreaterThan(0);
    
    // Verify it has the correct data-qa attribute
    await expect.soft(this.socialMediaContainer).toHaveAttribute('data-qa', 'social-media-links');
    
    // Check if container is visible
    const isVisible = await this.socialMediaContainer.isVisible();
    console.log(`Social media container visibility: ${isVisible}`);
    
    // If container is visible, verify social media links are present
    if (isVisible) {
      const linkCount = await this.socialMediaLinks.count();
      console.log(`Social media links found: ${linkCount}`);
      expect.soft(linkCount).toBeGreaterThan(0);
    } else {
      console.log('Social media container is present but hidden - may indicate no social links configured');
      // Verify at least the container structure exists
      await expect.soft(this.socialMediaContainer).toHaveAttribute('data-testid', 'social-media-links');
    }
  }

  /**
   * Verify all social media links are visible and clickable
   */
  async verifyLinksVisibilityAndClickability(): Promise<void> {
    const linkCount = await this.socialMediaLinks.count();
    
    // Verify each link is visible and clickable
    for (let i = 0; i < linkCount; i++) {
      const link = this.socialMediaLinks.nth(i);
      await expect.soft(link).toBeVisible();
      await expect.soft(link).toBeEnabled();
    }
  }

  /**
   * Verify external URLs and new tab behavior
   */
  async verifyExternalNavigation(): Promise<void> {
    const linkCount = await this.socialMediaLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = this.socialMediaLinks.nth(i);
      
      // Verify each link has proper href attribute (external URL)
      await expect.soft(link).toHaveAttribute('href');
      const href = await link.getAttribute('href');
      expect.soft(href).toBeTruthy();
      expect.soft(href).toMatch(/^https?:\/\//); // Verify it's a proper URL
      
      // Authoring flexibility: Content authors can choose target behavior
      // Validate target attribute is properly configured (either _blank or empty/same tab)
      const targetAttr = await link.getAttribute('target');
      
      // If target is _blank, must have security attributes
      if (targetAttr === '_blank') {
        await expect.soft(link).toHaveAttribute('rel', /noopener/);
      }
      
      // Ensure target attribute is either _blank or empty (no invalid values)
      if (targetAttr && targetAttr.trim() !== '') {
        expect.soft(['_blank', '_self']).toContain(targetAttr);
      }
    }
  }

  /**
   * Verify hover text functionality (title attributes)
   */
  async verifyHoverText(): Promise<void> {
    const linkCount = await this.socialMediaLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = this.socialMediaLinks.nth(i);
      
      // Verify each link has title attribute for hover text
      await expect.soft(link).toHaveAttribute('title');
      
      // Verify title attribute is not empty (language-agnostic approach)
      const title = await link.getAttribute('title');
      expect.soft(title).toBeTruthy();
    }
  }

  /**
   * Verify SVG icons are present and properly structured
   */
  async verifySVGIcons(): Promise<void> {
    const linkCount = await this.socialMediaLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = this.socialMediaLinks.nth(i);
      const icon = link.locator('svg');
      
      // Verify SVG icon is visible
      await expect.soft(icon).toBeVisible();
      
      // Verify SVG has proper attributes (common patterns)
      await expect.soft(icon).toHaveAttribute('viewBox');
      
      // Verify icon has dimensions
      const width = await icon.getAttribute('width');
      const height = await icon.getAttribute('height');
      expect.soft(width).toBeTruthy();
      expect.soft(height).toBeTruthy();
    }
  }

  /**
   * Verify keyboard navigation functionality
   */
  async verifyKeyboardNavigation(): Promise<void> {
    const linkCount = await this.socialMediaLinks.count();
    
    // Focus on first social media link
    const firstLink = this.socialMediaLinks.first();
    await firstLink.focus();
    await expect.soft(firstLink).toBeFocused();

    // Tab through all social media links
    for (let i = 1; i < linkCount; i++) {
      await this.page.keyboard.press('Tab');
      const currentLink = this.socialMediaLinks.nth(i);
      await expect.soft(currentLink).toBeFocused();
    }
  }

  /**
   * Test external navigation functionality (opens new tab) for any platform
   * @param hrefPattern - Pattern to match in href (e.g., 'facebook', 'instagram', etc.)
   */
  async testExternalNavigation(hrefPattern: string): Promise<void> {
    // Get the link that matches the href pattern
    const linkToTest = this.getSocialMediaLinkByHref(hrefPattern);
    
    // Verify the link exists
    await expect.soft(linkToTest).toBeVisible();

    // Get current page count
    const currentPages = this.context.pages().length;

    // Click the link (should open new tab)
    await linkToTest.click();

    // Wait for new page to be created
    await this.page
      .waitForFunction((expected) => window.parent.length >= expected, currentPages + 1, {
        timeout: 5000,
      })
      .catch(() => {});

    // Verify new page was opened
    const newPages = this.context.pages().length;
    expect.soft(newPages).toBe(currentPages + 1);

    // Get the new page and verify URL contains expected pattern
    const newPage = this.context.pages()[newPages - 1];
    await newPage.waitForLoadState('domcontentloaded');
    
    const newPageUrl = newPage.url();
    expect.soft(newPageUrl).toContain(hrefPattern); // Use hrefPattern instead of expectedDomain

    // Close the new page to clean up
    await newPage.close();
  }

  /**
   * Verify responsive grid layout
   */
  async verifyResponsiveLayout(): Promise<void> {
    // Verify container has proper responsive classes
    await expect.soft(this.socialMediaContainer).toHaveClass(/grid/);
    await expect.soft(this.socialMediaContainer).toHaveClass(/grid-cols-1/);
    await expect.soft(this.socialMediaContainer).toHaveClass(/gap-6/);
    await expect.soft(this.socialMediaContainer).toHaveClass(/lg:gap-10/);
  }

  /**
   * Scroll to footer section (utility method)
   */
  async scrollToFooter(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Wait for footer links section to be visible
    await this.footerLinksSection.waitFor({ state: 'visible' });
  }
}
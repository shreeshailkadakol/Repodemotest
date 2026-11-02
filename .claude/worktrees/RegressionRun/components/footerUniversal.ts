import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Universal Footer Component - Works across all Bayer sites
 * Uses flexible, site-agnostic selectors
 */
export class FooterUniversal extends BasePage {
  private readonly footerContainer: Locator;
  private readonly copyrightText: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);

    // Universal footer selectors - works on all sites
    // Use .last() to get the main site footer, not content section footers
    this.footerContainer = this.page.locator('footer[data-qa="footer-block"], footer, [role="contentinfo"]').last();
    this.copyrightText = this.page.locator('[data-qa="footer-copyright"]');
  }

  /**
   * Navigate to the component page with authentication
   */
  async navigateToComponent(): Promise<void> {
    const componentUrl = await this.resolveExecutionUrl(
      'FooterComponent',
      process.env.BASE_URL || ''
    );
    await this.navigateWithAuthentication(componentUrl);
    await this.acceptCookiesBanner();
    await this.waitForFooterLoad();
  }

  /**
   * Wait for footer to be fully loaded and visible
   */
  async waitForFooterLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    
    // Scroll to bottom to reveal footer
    await this.scrollToFooter();
    
    // Wait for footer container
    try {
      await this.footerContainer.waitFor({ state: 'visible', timeout: 5000 });
    } catch (error) {
      console.warn('Footer container not immediately visible');
    }
  }

  /**
   * Scroll to footer section
   */
  async scrollToFooter(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await this.page.waitForTimeout(1000); // Wait for scroll and lazy loading
  }

  /**
   * Get all footer links using multiple strategies (works across all sites)
   */
  async getAllFooterLinks(): Promise<Locator[]> {
    await this.scrollToFooter();

    // Strategy 1: Try data-qa="Link" (standard Bayer attribute)
    const qaLinks = await this.footerContainer.locator('[data-qa="Link"]').all();
    if (qaLinks.length > 0) {
      return qaLinks;
    }

    // Strategy 2: Get all <a> tags with href in footer
    const allAnchorTags = await this.footerContainer.locator('a[href]').all();
    if (allAnchorTags.length > 0) {
      return allAnchorTags;
    }

    // Strategy 3: Any clickable elements
    return await this.footerContainer.locator('a, button, [role="link"]').all();
  }

  /**
   * Get only footer navigation links (EXCLUDES social media links)
   * Social media links are validated separately in socialMediaComponent.spec.ts
   */
  async getFooterNavigationLinks(): Promise<Locator[]> {
    const allLinks = await this.getAllFooterLinks();
    const navigationLinks: Locator[] = [];

    const socialDomains = [
      'facebook.com',
      'instagram.com',
      'linkedin.com',
      'youtube.com',
      'twitter.com',
      'weibo.com',
      'wechat.com',
      'tiktok.com'
    ];

    for (const link of allLinks) {
      const href = (await link.getAttribute('href')) || '';
      let isSocialMedia = false;

      try {
        // Parse URL and validate based on hostname instead of substring matching
        const parsedUrl = new URL(href, 'http://placeholder.local');
        const host = parsedUrl.hostname.toLowerCase();
        isSocialMedia = socialDomains.some((domain) => host === domain || host.endsWith(`.${domain}`));
      } catch {
        // If URL parsing fails, keep default classification (non-social)
        isSocialMedia = false;
      }

      if (!isSocialMedia) {
        navigationLinks.push(link);
      }
    }

    return navigationLinks;
  }

  /**
   * Validate ONLY footer navigation links (excluding social media)
   * Social media links are handled by dedicated socialMediaComponent tests
   */
  async validateFooterNavigationLinks(): Promise<{
    totalNavigationLinks: number;
    visibleLinks: number;
    clickableLinks: number;
    internalLinks: number;
    externalLinks: number;
    brokenLinks: string[];
    linkDetails: Array<{
      text: string;
      href: string;
      isVisible: boolean;
      isClickable: boolean;
      type: 'internal' | 'external' | 'anchor';
    }>;
  }> {
    const navigationLinks = await this.getFooterNavigationLinks();
    const totalNavigationLinks = navigationLinks.length;
    
    let visibleLinks = 0;
    let clickableLinks = 0;
    let externalLinks = 0;
    let internalLinks = 0;
    const brokenLinks: string[] = [];
    const linkDetails: Array<{
      text: string;
      href: string;
      isVisible: boolean;
      isClickable: boolean;
      type: 'internal' | 'external' | 'anchor';
    }> = [];

    for (const link of navigationLinks) {
      try {
        const isVisible = await link.isVisible();
        const href = (await link.getAttribute('href')) || '';
        const text = ((await link.textContent()) || '').trim();
        const ariaLabel = await link.getAttribute('aria-label');
        
        if (isVisible) visibleLinks++;

        // Check if clickable
        let isClickable = false;
        try {
          await expect(link).toBeEnabled({ timeout: 1000 });
          isClickable = true;
          clickableLinks++;
        } catch {
          // Link not enabled
        }

        // Categorize link type (excluding social media)
        let linkType: 'internal' | 'external' | 'anchor' = 'internal';

        if (href.startsWith('#')) {
          linkType = 'anchor';
        } else if (href.startsWith('http')) {
          try {
            const hostname = new URL(href).hostname;
            if (hostname.endsWith('.bayer.com') || hostname === 'bayer.com' || hostname.includes('bayer')) {
              linkType = 'internal';
              internalLinks++;
            } else {
              linkType = 'external';
              externalLinks++;
            }
          } catch {
            linkType = 'external';
            externalLinks++;
          }
        } else {
          linkType = 'internal';
          internalLinks++;
        }

        // Check for broken links (icon links without text are valid)
        if (!href || !isClickable) {
          brokenLinks.push(`${text || ariaLabel || 'Icon link'} (${href || 'no href'})`);
        }

        linkDetails.push({
          text: text || ariaLabel || 'No text',
          href: href,
          isVisible: isVisible,
          isClickable: isClickable,
          type: linkType
        });
      } catch (error) {
        console.warn(`Error processing navigation link: ${error}`);
      }
    }

    return {
      totalNavigationLinks,
      visibleLinks,
      clickableLinks,
      internalLinks,
      externalLinks,
      brokenLinks,
      linkDetails
    };
  }

  /**
   * Validate all footer links are present and functional
   * Returns comprehensive link validation results
   */
  async validateFooterLinks(): Promise<{
    totalLinks: number;
    visibleLinks: number;
    clickableLinks: number;
    linksWithHref: number;
    externalLinks: number;
    internalLinks: number;
    socialMediaLinks: number;
    brokenLinks: string[];
    linkDetails: Array<{
      text: string;
      href: string;
      isVisible: boolean;
      isClickable: boolean;
      type: 'internal' | 'external' | 'social' | 'anchor';
    }>;
  }> {
    const allLinks = await this.getAllFooterLinks();
    const totalLinks = allLinks.length;
    
    let visibleLinks = 0;
    let clickableLinks = 0;
    let linksWithHref = 0;
    let externalLinks = 0;
    let internalLinks = 0;
    let socialMediaLinks = 0;
    const brokenLinks: string[] = [];
    const linkDetails: Array<{
      text: string;
      href: string;
      isVisible: boolean;
      isClickable: boolean;
      type: 'internal' | 'external' | 'social' | 'anchor';
    }> = [];

    for (const link of allLinks) {
      try {
        const isVisible = await link.isVisible();
        const href = (await link.getAttribute('href')) || '';
        const text = ((await link.textContent()) || '').trim();
        const ariaLabel = await link.getAttribute('aria-label');
        
        if (isVisible) visibleLinks++;
        if (href) linksWithHref++;

        // Check if clickable
        let isClickable = false;
        try {
          await expect(link).toBeEnabled({ timeout: 1000 });
          isClickable = true;
          clickableLinks++;
        } catch {
          // Link not enabled
        }

        // Categorize link type
        let linkType: 'internal' | 'external' | 'social' | 'anchor' = 'internal';

        if (href.startsWith('#')) {
          linkType = 'anchor';
        } else if (href.startsWith('http')) {
          try {
            const hostname = new URL(href).hostname;
            const socialHosts = ['facebook.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'twitter.com', 'x.com'];
            if (socialHosts.some(h => hostname === h || hostname.endsWith('.' + h))) {
              linkType = 'social';
              socialMediaLinks++;
            } else if (hostname.endsWith('.bayer.com') || hostname === 'bayer.com' || hostname.includes('bayer')) {
              linkType = 'internal';
              internalLinks++;
            } else {
              linkType = 'external';
              externalLinks++;
            }
          } catch {
            linkType = 'external';
            externalLinks++;
          }
        } else if (href.startsWith('/')) {
          linkType = 'internal';
          internalLinks++;
        }

        // Check for broken links (icon links without text are valid)
        if (!href || !isClickable) {
          brokenLinks.push(`${text || ariaLabel || 'Icon link'} (${href || 'no href'})`);
        }

        linkDetails.push({
          text: text || ariaLabel || 'No text',
          href: href,
          isVisible: isVisible,
          isClickable: isClickable,
          type: linkType
        });

      } catch (error) {
        brokenLinks.push(`Link error: ${error}`);
      }
    }

    return {
      totalLinks,
      visibleLinks,
      clickableLinks,
      linksWithHref,
      externalLinks,
      internalLinks,
      socialMediaLinks,
      brokenLinks,
      linkDetails
    };
  }

  /**
   * Validate footer copyright text
   */
  async validateCopyright(): Promise<boolean> {
    await this.scrollToFooter();
    
    try {
      await this.copyrightText.waitFor({ state: 'visible', timeout: 5000 });
      const copyrightContent = await this.copyrightText.textContent();
      
      return copyrightContent !== null && copyrightContent.trim() !== '';
    } catch (error) {
      console.error('Copyright validation failed:', error);
      return false;
    }
  }

  /**
   * Validate footer accessibility (WCAG 2.1 AA compliance)
   */
  async validateAccessibility(): Promise<{
    passedChecks: number;
    violations: any[];
    incomplete: any[];
    keyboardNavigable: boolean;
    hasLandmark: boolean;
  }> {
    await this.scrollToFooter();

    // Run axe-core accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page: this.page })
      .include('footer, [role="contentinfo"]')
      .analyze();

    // Check keyboard navigation
    const links = await this.getAllFooterLinks();
    let keyboardNavigable = true;
    
    if (links.length > 0) {
      try {
        await links[0].focus();
        const isFocused = await links[0].evaluate(el => el === document.activeElement);
        keyboardNavigable = isFocused;
      } catch {
        keyboardNavigable = false;
      }
    }

    // Check if footer has proper landmark
    const hasLandmark = await this.footerContainer.count() > 0;

    return {
      passedChecks: accessibilityScanResults.passes.length,
      violations: accessibilityScanResults.violations,
      incomplete: accessibilityScanResults.incomplete,
      keyboardNavigable,
      hasLandmark
    };
  }

  /**
   * Validate footer structure across different viewport sizes
   */
  async validateResponsiveLayout(): Promise<{
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
    widescreen: boolean;
  }> {
    const viewports = {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1366, height: 768 },
      widescreen: { width: 1920, height: 1080 }
    };

    const results = {
      mobile: false,
      tablet: false,
      desktop: false,
      widescreen: false
    };

    for (const [size, viewport] of Object.entries(viewports)) {
      await this.page.setViewportSize(viewport);
      await this.scrollToFooter();
      await this.page.waitForTimeout(500); // Wait for layout shift

      try {
        const isVisible = await this.footerContainer.isVisible();
        const links = await this.getAllFooterLinks();
        const hasLinks = links.length > 0;

        results[size as keyof typeof results] = isVisible && hasLinks;
      } catch (error) {
        console.error(`Responsive check failed for ${size}:`, error);
        results[size as keyof typeof results] = false;
      }
    }

    // Reset to default viewport
    await this.page.setViewportSize({ width: 1366, height: 768 });

    return results;
  }

  /**
   * Get footer statistics for reporting
   */
  async getFooterStatistics(): Promise<{
    isPresent: boolean;
    hasCopyright: boolean;
    totalLinks: number;
    linkBreakdown: {
      internal: number;
      external: number;
      social: number;
      anchor: number;
    };
    accessibility: {
      isAccessible: boolean;
      violationCount: number;
      keyboardNavigable: boolean;
    };
    responsive: {
      allSizesWork: boolean;
      supportedSizes: string[];
    };
  }> {
    const linkValidation = await this.validateFooterLinks();
    const accessibilityResults = await this.validateAccessibility();
    const responsiveResults = await this.validateResponsiveLayout();

    const supportedSizes = Object.entries(responsiveResults)
      .filter(([_, works]) => works)
      .map(([size]) => size);

    return {
      isPresent: await this.footerContainer.isVisible(),
      hasCopyright: await this.validateCopyright(),
      totalLinks: linkValidation.totalLinks,
      linkBreakdown: {
        internal: linkValidation.internalLinks,
        external: linkValidation.externalLinks,
        social: linkValidation.socialMediaLinks,
        anchor: linkValidation.linkDetails.filter(l => l.type === 'anchor').length
      },
      accessibility: {
        isAccessible: accessibilityResults.violations.length === 0,
        violationCount: accessibilityResults.violations.length,
        keyboardNavigable: accessibilityResults.keyboardNavigable
      },
      responsive: {
        allSizesWork: Object.values(responsiveResults).every(v => v),
        supportedSizes
      }
    };
  }

  /**
   * Get footer NAVIGATION statistics (EXCLUDES social media links)
   * Social media links are validated separately in socialMediaComponent.spec.ts
   */
  async getFooterNavigationStatistics(): Promise<{
    isPresent: boolean;
    hasCopyright: boolean;
    totalNavigationLinks: number;
    navigationLinkBreakdown: {
      internal: number;
      external: number;
      anchor: number;
    };
    accessibility: {
      isAccessible: boolean;
      violationCount: number;
      keyboardNavigable: boolean;
    };
    responsive: {
      allSizesWork: boolean;
      supportedSizes: string[];
    };
  }> {
    const navLinkValidation = await this.validateFooterNavigationLinks();
    const accessibilityResults = await this.validateAccessibility();
    const responsiveResults = await this.validateResponsiveLayout();

    const supportedSizes = Object.entries(responsiveResults)
      .filter(([_, works]) => works)
      .map(([size]) => size);

    return {
      isPresent: await this.footerContainer.isVisible(),
      hasCopyright: await this.validateCopyright(),
      totalNavigationLinks: navLinkValidation.totalNavigationLinks,
      navigationLinkBreakdown: {
        internal: navLinkValidation.internalLinks,
        external: navLinkValidation.externalLinks,
        anchor: navLinkValidation.linkDetails.filter(l => l.type === 'anchor').length
      },
      accessibility: {
        isAccessible: accessibilityResults.violations.length === 0,
        violationCount: accessibilityResults.violations.length,
        keyboardNavigable: accessibilityResults.keyboardNavigable
      },
      responsive: {
        allSizesWork: Object.values(responsiveResults).every(v => v),
        supportedSizes
      }
    };
  }

  /**
   * Comprehensive footer validation - all checks in one
   */
  async validateFooterComprehensive(): Promise<{
    passed: boolean;
    results: {
      structure: { passed: boolean; message: string };
      links: { passed: boolean; message: string; details: any };
      accessibility: { passed: boolean; message: string; details: any };
      responsive: { passed: boolean; message: string; details: any };
      copyright: { passed: boolean; message: string };
    };
  }> {
    await this.scrollToFooter();

    // Structure check
    const isFooterPresent = await this.footerContainer.count() > 0;
    const structureResult = {
      passed: isFooterPresent,
      message: isFooterPresent ? 'Footer structure found' : 'Footer not found'
    };

    // Links check
    const linkValidation = await this.validateFooterLinks();
    const linksResult = {
      passed: linkValidation.totalLinks > 0 && linkValidation.brokenLinks.length === 0,
      message: `Found ${linkValidation.totalLinks} links, ${linkValidation.brokenLinks.length} broken`,
      details: linkValidation
    };

    // Accessibility check
    const accessibilityValidation = await this.validateAccessibility();
    const accessibilityResult = {
      passed: accessibilityValidation.violations.length === 0 && accessibilityValidation.keyboardNavigable,
      message: `${accessibilityValidation.violations.length} violations, keyboard: ${accessibilityValidation.keyboardNavigable}`,
      details: accessibilityValidation
    };

    // Responsive check
    const responsiveValidation = await this.validateResponsiveLayout();
    const allResponsive = Object.values(responsiveValidation).every(v => v);
    const responsiveResult = {
      passed: allResponsive,
      message: `Responsive: ${Object.entries(responsiveValidation).filter(([_, v]) => v).map(([k]) => k).join(', ')}`,
      details: responsiveValidation
    };

    // Copyright check
    const hasCopyright = await this.validateCopyright();
    const copyrightResult = {
      passed: hasCopyright,
      message: hasCopyright ? 'Copyright present' : 'Copyright missing'
    };

    const allPassed = structureResult.passed && 
                     linksResult.passed && 
                     accessibilityResult.passed && 
                     responsiveResult.passed && 
                     copyrightResult.passed;

    return {
      passed: allPassed,
      results: {
        structure: structureResult,
        links: linksResult,
        accessibility: accessibilityResult,
        responsive: responsiveResult,
        copyright: copyrightResult
      }
    };
  }
}

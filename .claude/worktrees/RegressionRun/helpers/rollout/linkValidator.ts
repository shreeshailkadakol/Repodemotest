/**
 * Link Validator Helper
 * Validates navigation links, footer links, and checks for broken links
 */

import { Page, expect } from '@playwright/test';
import { rolloutConfig } from '../../config/rollout-config';

export interface LinkValidationResult {
  url: string;
  text: string;
  href: string;
  statusCode: number | null;
  isValid: boolean;
  errorMessage?: string;
  isExternal: boolean;
  isClickable?: boolean;
  clickabilityError?: string;
}

export interface BrokenLinkReport {
  pageUrl: string;
  language: string;
  linkText: string;
  href: string;
  statusCode: number | null;
  errorMessage: string;
  timestamp: string;
}

export interface FooterLinkSummary {
  total: number;
  clickable: number;
  nonClickable: number;
  notFound: number;
  nonOk: number;
  skippedExternal: number;
  phantom: number;
}

export interface PhantomFooterLink {
  text: string;
  tag: string;
  reason: string;
}

/** Generic alias - a phantom link can occur in any navigation section. */
export type PhantomLink = PhantomFooterLink;

export interface FooterLinkReport {
  summary: FooterLinkSummary;
  report: string;
  phantomLinks: PhantomFooterLink[];
}

export class LinkValidator {
  private page: Page;
  private brokenLinks: BrokenLinkReport[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Accept cookie consent banner if present
   * Handles OneTrust and other consent frameworks
   */
  async acceptCookies(): Promise<void> {
    try {
      // Wait for the OneTrust banner to appear (it loads asynchronously)
      const bannerVisible = await this.page.locator('#onetrust-banner-sdk')
        .waitFor({ state: 'visible', timeout: 8000 })
        .then(() => true)
        .catch(() => false);

      if (!bannerVisible) {
        console.log('[Cookie Consent] No cookie banner detected, proceeding without action');
        return;
      }

      // Try standard accept button selectors
      const bannerSelectors = [
        '#onetrust-accept-btn-handler',
        'button[id*="onetrust-accept"]',
        'button[aria-label*="Accept"]',
        '[data-testid="cookie-accept"]',
      ];

      for (const selector of bannerSelectors) {
        const button = this.page.locator(selector).first();
        const isVisible = await button.isVisible().catch(() => false);

        if (isVisible) {
          console.log(`[Cookie Consent] Accepting via ${selector}...`);
          await button.click({ force: true });
          await this.page.waitForTimeout(2000);
          await this.page.locator('#onetrust-banner-sdk').waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
          await this.removeCookieOverlays();
          console.log('[Cookie Consent] Cookies accepted and overlays removed');
          return;
        }
      }

      // No standard button matched — banner uses non-English text (e.g. Japanese).
      // Remove the entire OneTrust DOM so it cannot block interactions.
      console.log('[Cookie Consent] Banner visible but no standard accept button — removing overlay from DOM');
      await this.removeCookieOverlays();

    } catch (error) {
      console.log('[Cookie Consent] Error handling cookie banner, removing overlays');
      await this.removeCookieOverlays().catch(() => {});
    }
  }

  private async removeCookieOverlays(): Promise<void> {
    await this.page.evaluate(() => {
      for (const sel of [
        '#onetrust-consent-sdk',
        '#onetrust-banner-sdk',
        '.onetrust-pc-dark-filter',
        '[role="alertdialog"]',
        '[role="dialog"][aria-modal="true"]',
      ]) {
        document.querySelectorAll(sel).forEach(el => el.remove());
      }
    });
    await this.page.waitForTimeout(500);
  }

  /**
   * Ensure all overlays are dismissed before testing interactions
   */
  private async dismissOverlays(): Promise<void> {
    await this.removeCookieOverlays();
    await this.page.evaluate(() => globalThis.scrollTo(0, 0));
    await this.page.waitForTimeout(500);
  }

  /**
   * Validate all pill navigation links
   * Pill navigation consists of main navigation buttons/links in the header area
   */
  async validatePillNavigationLinks(): Promise<LinkValidationResult[]> {
    const results: LinkValidationResult[] = [];
    
    try {
      // Dismiss any overlays that might be blocking header
      await this.dismissOverlays();
      
      // Look for pill navigation or header nav — try multiple patterns
      const pillSelectors = [
        'nav[data-qa="middle-links"]',
        '[data-qa="pill-navigation"]',
        '[role="navigation"][aria-label*="pill"]',
        'header nav',
        '[data-testid="Header"] nav',
      ];

      let headerNav = null;
      for (const sel of pillSelectors) {
        const candidate = this.page.locator(sel).first();
        const candidateCount = await candidate.locator('button, a[href]').count().catch(() => 0);
        if (candidateCount > 0) {
          headerNav = candidate;
          console.log(`[Pill Navigation] Matched via: ${sel} (${candidateCount} items)`);
          break;
        }
      }

      if (!headerNav) {
        console.log('[Pill Navigation] No pill navigation container found');
        return results;
      }

      // Only validate actual links (a[href]) — buttons without hrefs are
      // section headers (e.g. footer column labels) not navigation items.
      const navLinks = headerNav.locator('a[href]');
      let count = await navLinks.count();

      console.log(`[Pill Navigation] Found ${count} navigation links`);

      for (let i = 0; i < count; i++) {
        const item = navLinks.nth(i);

        try {
          await expect(item).toBeVisible({ timeout: 5000 });
          const text = (await item.textContent())?.trim() || '';

          const clickabilityCheck = await this.validateClickability(item, text);
          if (!clickabilityCheck.isClickable) {
            console.error(`[Pill Navigation] Item not clickable: "${text}" - ${clickabilityCheck.error}`);
          }

          const tagName = 'a';
          if (tagName === 'a') {
            const href = await item.getAttribute('href');
            if (href && !this.shouldIgnoreLink(href)) {
              const isExternal = this.isExternalLink(href);
              const fullUrl = this.resolveUrl(href);
              const result = await this.checkLinkStatus(fullUrl, text, href, isExternal);
              
              // Add clickability validation results
              result.isClickable = clickabilityCheck.isClickable;
              result.clickabilityError = clickabilityCheck.error;
              result.isValid = result.isValid && clickabilityCheck.isClickable;
              if (!clickabilityCheck.isClickable) {
                result.errorMessage = result.errorMessage 
                  ? `${result.errorMessage}; ${clickabilityCheck.error}`
                  : clickabilityCheck.error;
              }
              
              results.push(result);
              
              if (!result.isValid) {
                this.logBrokenLink(text, href, result.statusCode, result.errorMessage || 'Unknown error');
              }
            }
          }
        } catch (error) {
          console.error(`[Pill Navigation] Error validating item ${i}:`, error);
        }
      }
    } catch (error) {
      console.error('[Pill Navigation] Error finding navigation:', error);
    }

    return results;
  }

  /**
   * Validate menu navigation structure and links
   * Opens hamburger menu and validates ALL navigation levels:
   * - Level 1: Main menu sections (expandable buttons)
   * - Level 2: Sub-items within each section
   * - Level 3: Deep sub-items if present
   * - Link validation: HTTP status + clickability for all menu links
   */
  async validateMenuNavigationLinks(): Promise<LinkValidationResult[]> {
    const results: LinkValidationResult[] = [];
    const navigationStructure: any = {
      level1: [],
      level2Total: 0,
      level3Sample: 0
    };
    
    try {
      // Dismiss any lingering overlays before opening menu
      await this.dismissOverlays();
      
      // Capture all visible link hrefs BEFORE opening menu (baseline)
      const baselineLinks = new Set<string>();
      const baseLocator = this.page.locator('a[href]:visible');
      const baseCount = await baseLocator.count();
      for (let i = 0; i < baseCount; i++) {
        const href = await baseLocator.nth(i).getAttribute('href').catch(() => null);
        if (href) baselineLinks.add(href);
      }
      
      // Click the hamburger menu to open the flyout
      const hamburgerButton = this.page.locator('button[aria-label*="Burger Menu"], button[aria-label*="Menu"], button[aria-label*="menu"]').first();
      const hamburgerVisible = await hamburgerButton.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (!hamburgerVisible) {
        console.log('[Menu Navigation] Hamburger menu button not found');
        return results;
      }
      
      console.log('[Menu Navigation] Opening flyout menu...');
      // Remove cookie overlays that may have loaded after initial dismissal
      await this.removeCookieOverlays();
      await hamburgerButton.click({ force: true, timeout: 5000 });
      await this.page.waitForTimeout(2000);
      // Remove cookie overlays again in case they re-injected during the wait
      await this.removeCookieOverlays();

      // Check if flyout opened (informational, not blocking)
      const flyoutPanel = await this.findFlyoutPanel();
      console.log(`[Menu Navigation] ${flyoutPanel ? 'Flyout panel located' : 'Using page-wide selectors'}`);
      
      // ==== LEVEL 1 VALIDATION ====
      // Level 1 items are the main section buttons with chevron arrows (SVG)
      // Search page-wide since the flyout container may not be a <nav> element
      let level1Buttons = this.page.locator('button:has(svg):visible, a:has(svg):visible').filter({
        hasNotText: /^(Previous|Next|\d+|Configuración de Cookies|Cookie Settings|Close|Fechar|Back|Voltar|×|X|Brazil|Brasil|Contact Us|Fale Conosco)$/i
      });
      
      let level1Count = await level1Buttons.count();
      
      // If too many matches (includes header pills + flyout), filter to only large text items
      // The flyout Level 1 items have specific data attributes or larger text classes
      if (level1Count > 8) {
        // Try data-testid="Text" which are the flyout section headers
        const dataButtons = this.page.locator('[data-testid="Text"]:visible, [data-qa="Text"]:visible').filter({
          hasNotText: /^(Previous|Next|\d+|Close|Fechar|Back|Voltar)$/i
        });
        const dataCount = await dataButtons.count();
        if (dataCount >= 3) {
          level1Buttons = dataButtons;
          level1Count = dataCount;
        }
      }
      
      console.log(`[Menu Navigation] ✓ LEVEL 1: ${level1Count} main sections found`);
      
      // Store all Level 1 items
      for (let i = 0; i < level1Count; i++) {
        const button = level1Buttons.nth(i);
        try {
          const isVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);
          const isEnabled = await button.isEnabled().catch(() => false);
          
          if (isVisible && isEnabled) {
            const buttonText = (await button.textContent({ timeout: 2000 }))?.trim() || `Section ${i + 1}`;
            // Only include if text looks like a menu section (not empty, not just icons)
            if (buttonText.length > 0 && buttonText.length < 100) {
              navigationStructure.level1.push({ index: i, text: buttonText, level2Count: 0 });
              console.log(`[Menu Navigation]   ${navigationStructure.level1.length}. ${buttonText}`);
            }
          }
        } catch (error) {
          // Skip items that timeout
        }
      }
      
      // ==== LEVEL 2 VALIDATION ====
      console.log(`[Menu Navigation] Validating LEVEL 2 structure...`);
      
      if (navigationStructure.level1.length > 0) {
        try {
          const firstSection = navigationStructure.level1[0];
          const button = level1Buttons.nth(firstSection.index);
          
          // Count visible interactive items before expanding (links + buttons, excluding footer)
          const itemsBefore = await this.page.locator('a[href]:visible:not(footer a):not([data-qa="footer"] a), button:visible:not(footer button)').count();
          
          // Expand first section
          await button.click({ force: true, timeout: 5000 });
          await this.page.waitForTimeout(1500);
          
          // Count visible interactive items after expanding
          const itemsAfter = await this.page.locator('a[href]:visible:not(footer a):not([data-qa="footer"] a), button:visible:not(footer button)').count();
          const level2Count = Math.max(0, itemsAfter - itemsBefore);
          
          firstSection.level2Count = level2Count > 0 ? level2Count : itemsAfter;
          navigationStructure.level2Total = firstSection.level2Count;
          
          console.log(`[Menu Navigation]     ${firstSection.text}: ${navigationStructure.level2Total} Level 2 items`);
          
        } catch (error) {
          console.log(`[Menu Navigation]     Error validating Level 2: ${error instanceof Error ? error.message.split('\n')[0] : String(error)}`);
        }
      }

      // ==== LINK VALIDATION ====
      // Validate links NOW while menu is open and stable
      console.log(`[Menu Navigation] Starting link validation...`);
      
      try {
        // Get menu links: if flyout panel found, scope to it; otherwise use all visible non-footer links
        let menuLinkItems: { link: any; href: string; text: string }[] = [];
        
        if (flyoutPanel) {
          // Scope to flyout panel container — collect both links and navigable buttons
          const panelLinks = flyoutPanel.locator('a[href]:visible');
          const panelLinksCount = await panelLinks.count();

          for (let i = 0; i < panelLinksCount; i++) {
            const link = panelLinks.nth(i);
            try {
              const href = await link.getAttribute('href', { timeout: 2000 });
              if (!href || this.shouldIgnoreLink(href)) continue;
              const text = (await link.textContent({ timeout: 1000 }))?.trim() || '';
              if (text.length > 80) continue;
              menuLinkItems.push({ link, href, text });
            } catch {
              // Skip
            }
          }

          // Also collect visible buttons that are navigation items (not utility controls)
          const skipPattern = /^(Back|Close|Close menu|Search|×|X)?$/i;
          const panelButtons = flyoutPanel.locator('button:visible').filter({
            hasNotText: skipPattern
          });
          const panelButtonCount = await panelButtons.count();
          let navButtonCount = 0;

          for (let i = 0; i < panelButtonCount; i++) {
            const btn = panelButtons.nth(i);
            try {
              const ariaLabel = await btn.getAttribute('aria-label', { timeout: 1000 }).catch(() => '');
              if (ariaLabel && /close|back|search|language|location/i.test(ariaLabel)) continue;
              const text = (await btn.textContent({ timeout: 1000 }))?.trim() || '';
              if (!text || text.length > 80) continue;
              if (/language|location|cookie|search/i.test(text)) continue;

              navButtonCount++;
              results.push({
                url: '',
                text,
                href: 'button',
                statusCode: null,
                isValid: true,
                errorMessage: undefined,
                isExternal: false,
                isClickable: true,
                clickabilityError: undefined,
              });
            } catch {
              // Skip
            }
          }
          console.log(`[Menu Navigation] Found ${menuLinkItems.length} links + ${navButtonCount} nav buttons in flyout panel`);
        } else {
          // Fallback: find links that appeared after menu opened (diff approach)
          const currentLinks = this.page.locator('a[href]:visible');
          const currentCount = await currentLinks.count();
          
          for (let i = 0; i < currentCount; i++) {
            const link = currentLinks.nth(i);
            try {
              const href = await link.getAttribute('href', { timeout: 2000 });
              if (!href || this.shouldIgnoreLink(href)) continue;
              // For diff: skip if href was in baseline (but allow duplicates with different text)
              if (baselineLinks.has(href)) continue;
              const text = (await link.textContent({ timeout: 1000 }))?.trim() || '';
              if (text.length > 80) continue;
              menuLinkItems.push({ link, href, text });
            } catch {
              // Skip
            }
          }
          console.log(`[Menu Navigation] Found ${menuLinkItems.length} menu-specific links (diff from ${currentCount} total)`);
        }
        
        for (const { link, href, text } of menuLinkItems) {
          try {
            
            if (!href || this.shouldIgnoreLink(href)) {
              continue;
            }
            
            const isExternal = this.isExternalLink(href);
            const fullUrl = this.resolveUrl(href);
            
            // Skip HTTP validation for known external domains
            if (isExternal && this.isKnownExternalDomain(href)) {
              results.push({
                url: fullUrl,
                text,
                href,
                statusCode: null,
                isValid: true,
                errorMessage: 'External link (not validated via HTTP)',
                isExternal,
                isClickable: true,
                clickabilityError: undefined,
              });
              continue;
            }
            
            // Validate HTTP status (skip trial-click for menu links as flyout
            // panels have scrollable containers that prevent reliable trial clicks)
            const result = await this.checkLinkStatus(fullUrl, text, href, isExternal);
            result.isClickable = true; // Assumed clickable since visible in flyout
            
            results.push(result);
            
            if (!result.isValid) {
              this.logBrokenLink(text, href, result.statusCode, result.errorMessage || 'Unknown error');
            }
          } catch (error) {
            console.log(`[Menu Navigation] Error validating link "${text}": ${error instanceof Error ? error.message.split('\n')[0] : String(error)}`);
          }
        }
        
        console.log(`[Menu Navigation] Link validation complete: ${results.length} links validated`);
      } catch (error) {
        console.error('[Menu Navigation] Error during link validation:', error);
      }
      
      // ==== LEVEL 3 VALIDATION ====
      // Look for expandable Level 2 items within the flyout panel
      if (navigationStructure.level2Total > 0) {
        try {
          console.log(`[Menu Navigation] Validating LEVEL 3 structure...`);
          
          // Look for Level 2 items with arrow icons (page-wide, excluding footer)
          // These should be links or buttons that expand further
          const level2Expandable = this.page.locator('a:has(svg):visible:not(footer *), button:has(svg):visible:not(footer *)').filter({
            hasNotText: /^(Previous|Next|\d+|Close|Fechar|Back|Voltar|×|X)$/i
          });
          
          const expandableCount = await level2Expandable.count();
          // Subtract Level 1 items to get true Level 2 expandables
          const level2ExpandableCount = Math.max(0, expandableCount - navigationStructure.level1.length);
          
          console.log(`[Menu Navigation]     Found ${level2ExpandableCount} potential Level 2 expandable items`);
          
          if (level2ExpandableCount > 0) {
            // Sample first 2 items after Level 1 buttons
            const startIndex = navigationStructure.level1.length;
            const samplesToExpand = Math.min(level2ExpandableCount, 2);
            let totalLevel3Items = 0;
            
            for (let i = startIndex; i < startIndex + samplesToExpand; i++) {
              try {
                const item = level2Expandable.nth(i);
                const isEnabled = await item.isEnabled().catch(() => false);
                const isVisible = await item.isVisible({ timeout: 1000 }).catch(() => false);
                
                if (!isEnabled || !isVisible) continue;
                
                const itemText = (await item.textContent({ timeout: 1000 }))?.trim().substring(0, 40) || '';
                
                // Count visible links before click
                const linksBefore = await this.page.locator('a[href]:visible:not(footer a)').count();
                
                await item.click({ timeout: 3000 });
                await this.page.waitForTimeout(1000);
                
                const linksAfter = await this.page.locator('a[href]:visible:not(footer a)').count();
                const level3Count = linksAfter - linksBefore;
                
                if (level3Count > 0) {
                  totalLevel3Items += level3Count;
                  console.log(`[Menu Navigation]       └─ "${itemText}": ${level3Count} Level 3 items ✓`);
                }
                
                // Navigate back if possible
                const backButton = this.page.locator('button:has-text("Back"), button:has-text("BACK"), button[aria-label*="Back"]').first();
                if (await backButton.isVisible({ timeout: 1000 }).catch(() => false)) {
                  await backButton.click().catch(() => {});
                  await this.page.waitForTimeout(500);
                }
              } catch (error) {
                // Skip items that can't be expanded
              }
            }
            
            navigationStructure.level3Sample = totalLevel3Items;
            if (totalLevel3Items > 0) {
              console.log(`[Menu Navigation]     ✓ Level 3 CONFIRMED: ${totalLevel3Items} total items`);
            } else {
              console.log(`[Menu Navigation]     ℹ Level 3: 2-level navigation structure`);
            }
          } else {
            console.log(`[Menu Navigation]     ℹ Level 3: No expandable items found (2-level navigation)`);
          }
        } catch (error) {
          console.log('[Menu Navigation]     ℹ Level 3: Unable to detect');
        }
      }
      
      // ==== SUMMARY ====
      console.log(`[Menu Navigation] ========================================`);
      console.log(`[Menu Navigation] NAVIGATION STRUCTURE VALIDATION COMPLETE`);
      console.log(`[Menu Navigation] ========================================`);
      console.log(`[Menu Navigation] Level 1: ${navigationStructure.level1.length} main sections`);
      console.log(`[Menu Navigation] Level 2: ${navigationStructure.level2Total} items (sampled from first section)`);
      console.log(`[Menu Navigation] Level 3: ${navigationStructure.level3Sample > 0 ? navigationStructure.level3Sample + ' items (confirmed)' : 'Not applicable'}`);
      console.log(`[Menu Navigation] Links Validated: ${results.length}`);
      console.log(`[Menu Navigation] ========================================`);
      
      // Close the menu
      try {
        const closeButton = this.page.locator('button[aria-label*="Close"]:visible, button[aria-label*="Fechar"]:visible, button:has-text("×"):visible').first();
        if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await closeButton.click({ force: true, timeout: 5000 }).catch(() => {});
          await this.page.waitForTimeout(500);
        }
      } catch {
        // Menu might already be closed
      }
      
    } catch (error) {
      console.error('[Menu Navigation] Error:', error);
    }
    
    return results;
  }

  /**
   * Find the flyout navigation panel after hamburger menu is clicked
   * Uses DOM inspection to find the fixed/absolute positioned overlay container
   */
  private async findFlyoutPanel() {
    // Use JavaScript to find the flyout: a fixed/absolute container with nav items
    const flyoutSelector = await this.page.evaluate(() => {
      const allElements = document.querySelectorAll('div, aside, section, nav');
      let bestElement: Element | null = null;
      let bestScore = 0;

      for (const el of allElements) {
        // Skip cookie/consent overlays — they compete with the flyout
        if (el.closest('#onetrust-consent-sdk, #onetrust-banner-sdk, [id*="onetrust"]')) continue;

        const style = globalThis.getComputedStyle(el);
        const isOverlay = style.position === 'fixed' || style.position === 'absolute';
        const rect = el.getBoundingClientRect();
        const isLarge = rect.height > 300 && rect.width > 200;
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0;

        if (!isOverlay || !isLarge || !isVisible) continue;

        const linkCount = el.querySelectorAll('a[href], button').length;
        if (linkCount > bestScore) {
          bestScore = linkCount;
          bestElement = el;
        }
      }
      
      if (bestElement && bestScore >= 5) {
        const id = bestElement.id;
        if (id) return `#${id}`;

        const testId = bestElement.getAttribute('data-testid');
        if (testId) return `[data-testid="${testId}"]`;

        const dataQa = bestElement.getAttribute('data-qa');
        if (dataQa) return `[data-qa="${dataQa}"]`;

        // Tag element with a temporary attribute for reliable selection
        bestElement.setAttribute('data-flyout-panel', 'true');
        return '[data-flyout-panel="true"]';
      }
      return null;
    });
    
    if (flyoutSelector) {
      const panel = this.page.locator(flyoutSelector).first();
      const isVisible = await panel.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        const count = await panel.locator('a[href], button').count();
        console.log(`[Menu Navigation] Flyout panel found via DOM inspection: ${flyoutSelector} (${count} items)`);
        return panel;
      }
    }
    
    // Fallback: use page body
    console.log(`[Menu Navigation] Flyout panel: using page-wide selectors (fallback)`);
    return null;
  }

  /**
   * Validate all footer links
   * Note: External social media links may return errors via HTTP request but work in browser
   */
  async validateFooterLinks(): Promise<LinkValidationResult[]> {
    // Dismiss overlays before footer validation
    await this.dismissOverlays();
    
    const footer = this.page.locator(rolloutConfig.navigation.footerSelector);
    const links = footer.locator(rolloutConfig.navigation.linkSelector);

    return await this.validateLinks(links, 'Footer', true);
  }

  /**
   * Detect "phantom" links in a navigation region: entries that are rendered
   * to look like navigation links (inside `<ul><li>` link lists) but have NO
   * navigable URL - i.e. they are NOT wrapped in an `<a href>`.
   *
   * These are invisible to the standard `a[href]` selector, so a region can
   * appear "all valid" while visible links do nothing when clicked.
   *
   * Detection heuristics (either is sufficient), scoped to `<ul><li>` link
   * lists and excluding known functional controls (e.g. cookie settings):
   *   A. The item contains a design-system text element (`[data-qa="Text"]`)
   *      masquerading as a link but with no `href`.
   *   B. The item sits in a link list where a sibling item IS a real `<a href>`,
   *      proving it is a link list with a missing/un-tagged URL.
   *
   * @param regionSelector - CSS selector for the navigation region(s) to scan.
   * @param section - Label used in logs (e.g. "Footer", "Menu Navigation").
   * @returns Array of phantom links (deduplicated by text).
   */
  private async detectPhantomLinks(
    regionSelector: string,
    section: string
  ): Promise<PhantomLink[]> {
    const phantoms = await this.page.evaluate((selector) => {
      const regions = Array.from(document.querySelectorAll(selector));
      const results: { text: string; tag: string; reason: string }[] = [];
      const seen = new Set<string>();

      // Controls that are intentionally not anchors (functional buttons).
      const FUNCTIONAL =
        '[data-qa="CookieConsentButton"], [data-testid*="Cookie"], [onclick]';

      const record = (text: string, tag: string, reason: string) => {
        const key = text.toLowerCase();
        if (!text || seen.has(key)) {
          return;
        }
        seen.add(key);
        results.push({ text: text.slice(0, 80), tag, reason });
      };

      regions.forEach((region) => {
        const listItems = Array.from(region.querySelectorAll('ul li'));

        listItems.forEach((li) => {
          const text = (li.textContent || '').trim();
          if (!text) {
            return;
          }

          // A real navigable link is present -> not a phantom.
          if (li.querySelector('a[href]')) {
            return;
          }

          // Skip known functional controls (e.g. cookie settings button).
          if (li.querySelector(FUNCTIONAL)) {
            return;
          }

          // Only consider items that actually render link-like content.
          const linkStyled = li.querySelector('[data-qa="Text"], button, span');
          if (!linkStyled) {
            return;
          }

          // Heuristic A: design-system text element posing as a link.
          const isTextMasquerade = !!li.querySelector('[data-qa="Text"]');

          // Heuristic B: link list where a sibling item is a real link.
          const parentList = li.closest('ul');
          const siblingHasLink = parentList
            ? !!parentList.querySelector('li a[href]')
            : false;

          if (isTextMasquerade || siblingHasLink) {
            record(
              text,
              linkStyled.tagName,
              isTextMasquerade
                ? 'Rendered as inert text (no <a href>) - not clickable as a link'
                : 'Link-list item has no <a href> (sibling items are links)'
            );
          }
        });
      });

      return results;
    }, regionSelector);

    if (phantoms.length > 0) {
      console.error(
        `[${section}] Detected ${phantoms.length} phantom link(s) with no navigable URL:`
      );
      phantoms.forEach((p, i) =>
        console.error(`  ${i + 1}. "${p.text}" (<${p.tag.toLowerCase()}>) - ${p.reason}`)
      );
    }

    return phantoms;
  }

  /**
   * Detect "phantom" footer links: footer entries rendered as links but with
   * no navigable URL (no `<a href>`). See {@link detectPhantomLinks}.
   *
   * @returns Array of phantom footer links (deduplicated by text).
   */
  async detectPhantomFooterLinks(): Promise<PhantomFooterLink[]> {
    return await this.detectPhantomLinks(
      rolloutConfig.navigation.footerSelector,
      'Footer'
    );
  }

  /**
   * Detect "phantom" menu navigation links by BEHAVIOURAL verification:
   * entries that are rendered to look like links/menu items but do NOTHING
   * when clicked (no navigation, no section expand/collapse).
   *
   * Unlike the footer, the main menu is a dynamic flyout whose top-level items
   * are legitimately rendered as <button> elements - some navigate, some expand
   * sub-menus. Rather than guess from markup (e.g. a chevron icon), we actually
   * click each candidate and observe the result:
   *   1. Open the hamburger flyout.
   *   2. Pick the next untested link-like item (`[data-qa="Text"]`) scoped to the
   *      main menu list (`<nav>`), so the flyout's fixed bottom utility bar
   *      (Contact / language / location selectors) is NOT treated as menu
   *      navigation. Real `<a href>` links and functional controls are skipped.
   *   3. Click it and observe:
   *        - the URL changed  -> working link (navigated),
   *        - the flyout content size changed -> working toggle (expanded/collapsed),
   *        - nothing changed  -> PHANTOM (inert).
   *   4. Re-open the flyout each iteration so state stays deterministic even
   *      after a probe navigates away or mutates the DOM.
   *
   * A per-item verdict summary is logged covering ALL menu items - working
   * navigable links, working expandable sections, and phantoms - not just the
   * phantoms, so passing items are visible too.
   *
   * @returns Array of phantom menu links (deduplicated by text).
   */
  async detectPhantomMenuLinks(): Promise<PhantomLink[]> {
    const FUNCTIONAL =
      '[data-qa="CookieConsentButton"], [data-testid*="Cookie"], [onclick]';
    const menuUrl = this.page.url();

    // Re-open the hamburger flyout, returning true when a panel is visible.
    const openFlyout = () => this.openMenuFlyout();

    // Signature of the currently open flyout (size of its visible content),
    // used to detect whether a click expanded/collapsed a section.
    const flyoutSignature = async (): Promise<{ count: number; textLen: number }> => {
      return await this.page.evaluate(() => {
        let root: Element | null = null;
        let best = 0;
        for (const el of Array.from(
          document.querySelectorAll('div, aside, section, nav')
        )) {
          const s = globalThis.getComputedStyle(el);
          const overlay = s.position === 'fixed' || s.position === 'absolute';
          const rect = el.getBoundingClientRect();
          const large = rect.height > 300 && rect.width > 200;
          const vis =
            s.display !== 'none' &&
            s.visibility !== 'hidden' &&
            Number.parseFloat(s.opacity) > 0;
          if (!overlay || !large || !vis) {
            continue;
          }
          const score = el.querySelectorAll('a[href], button').length;
          if (score > best) {
            best = score;
            root = el;
          }
        }
        if (!root) {
          return { count: 0, textLen: 0 };
        }
        const visibleEls = Array.from(root.querySelectorAll('*')).filter(
          (e) => (e as HTMLElement).offsetParent !== null
        );
        const textLen = (root.textContent || '').replace(/\s+/g, '').length;
        return { count: visibleEls.length, textLen };
      });
    };

    const phantoms: PhantomLink[] = [];
    const working: { text: string; kind: string }[] = [];
    const tested = new Set<string>();
    let capturedLinks = false;

    // Probe one candidate per iteration; re-open the flyout each time so the
    // DOM state is deterministic regardless of what the previous click did.
    for (let guard = 0; guard < 40; guard++) {
      if (this.page.url() !== menuUrl) {
        await this.page
          .goto(menuUrl, { waitUntil: 'domcontentloaded' })
          .catch(() => undefined);
      }
      if (!(await openFlyout())) {
        break;
      }

      // Capture the menu's real <a href> links once - they are working links
      // (validated separately by HTTP) and belong in the verdict summary.
      if (!capturedLinks) {
        capturedLinks = true;
        const navLinks = await this.page.evaluate(() => {
          // Largest visible overlay container = the open flyout (same heuristic
          // used elsewhere) so we don't pick up footer/social <nav> links.
          let root: Element | null = null;
          let best = 0;
          for (const el of Array.from(
            document.querySelectorAll('div, aside, section, nav')
          )) {
            const s = globalThis.getComputedStyle(el);
            const overlay = s.position === 'fixed' || s.position === 'absolute';
            const rect = el.getBoundingClientRect();
            const large = rect.height > 300 && rect.width > 200;
            const vis =
              s.display !== 'none' &&
              s.visibility !== 'hidden' &&
              Number.parseFloat(s.opacity) > 0;
            if (overlay && large && vis) {
              const score = el.querySelectorAll('a[href], button').length;
              if (score > best) {
                best = score;
                root = el;
              }
            }
          }
          if (!root) {
            return [] as string[];
          }

          const links: string[] = [];
          const seen = new Set<string>();
          root.querySelectorAll('nav a[href]').forEach((a) => {
            const t = (a.textContent || '').trim();
            if (
              t &&
              t.length <= 80 &&
              (a as HTMLElement).offsetParent !== null &&
              !seen.has(t.toLowerCase())
            ) {
              seen.add(t.toLowerCase());
              links.push(t.slice(0, 80));
            }
          });
          return links;
        });
        navLinks.forEach((t) => working.push({ text: t, kind: 'navigable link' }));
      }

      // Tag the next untested candidate so we can target it precisely.
      const probe = await this.page.evaluate(
        (args: { funcSel: string; testedList: string[] }) => {
          const { funcSel, testedList } = args;
          const testedSet = new Set(testedList);

          // Clear any stale probe tag from a previous (phantom) iteration.
          document
            .querySelectorAll('[data-phantom-probe]')
            .forEach((e) => delete (e as HTMLElement).dataset.phantomProbe);

          // Largest visible overlay container = the open flyout.
          const findRoot = (): Element | null => {
            let root: Element | null = null;
            let best = 0;
            for (const el of Array.from(
              document.querySelectorAll('div, aside, section, nav')
            )) {
              const s = globalThis.getComputedStyle(el);
              const overlay = s.position === 'fixed' || s.position === 'absolute';
              const rect = el.getBoundingClientRect();
              const large = rect.height > 300 && rect.width > 200;
              const vis =
                s.display !== 'none' &&
                s.visibility !== 'hidden' &&
                Number.parseFloat(s.opacity) > 0;
              if (overlay && large && vis) {
                const score = el.querySelectorAll('a[href], button').length;
                if (score > best) {
                  best = score;
                  root = el;
                }
              }
            }
            return best >= 5 ? root : null;
          };

          // Is this item a phantom candidate (link-like, untested, not a real
          // link or known functional control)?
          const isCandidate = (el: Element): boolean => {
            const raw = (el.textContent || '').trim();
            if (!raw || raw.length > 80 || testedSet.has(raw.toLowerCase())) {
              return false;
            }
            return !el.closest('a[href]') && !el.closest(funcSel);
          };

          const root = findRoot();
          if (!root) {
            return null;
          }
          // Scope to the main menu list (<nav>) so we ignore the flyout's fixed
          // bottom utility bar (Contact / language / location selectors), which
          // are NOT main-menu navigation. Fall back to the whole flyout only if
          // it has no <nav> (so we never silently miss phantoms).
          let pool = Array.from(
            root.querySelectorAll('nav [data-qa="Text"], nav [data-testid="Text"]')
          );
          if (pool.length === 0) {
            pool = Array.from(
              root.querySelectorAll('[data-qa="Text"], [data-testid="Text"]')
            );
          }
          const el = pool.find(
            (node) => (node as HTMLElement).offsetParent !== null && isCandidate(node)
          );

          if (!el) {
            return null;
          }
          const target = (el.closest('button') ?? el) as HTMLElement;
          target.dataset.phantomProbe = 'active';
          return { text: (el.textContent || '').trim().slice(0, 80), tag: target.tagName };
        },
        { funcSel: FUNCTIONAL, testedList: Array.from(tested) }
      );

      if (!probe) {
        break; // No untested candidates remain.
      }
      tested.add(probe.text.toLowerCase());

      const target = this.page.locator('[data-phantom-probe="active"]').first();
      const sigBefore = await flyoutSignature();
      const urlBefore = this.page.url();

      await target.click({ force: true, timeout: 5000 }).catch(() => undefined);
      await this.page.waitForTimeout(1000);

      // Navigated -> working link.
      if (this.page.url() !== urlBefore) {
        working.push({ text: probe.text, kind: 'navigates on click' });
        continue;
      }

      // Flyout grew/shrank -> working expandable section. Reset to collapse it.
      const sigAfter = await flyoutSignature();
      const changed =
        Math.abs(sigAfter.count - sigBefore.count) > 2 ||
        Math.abs(sigAfter.textLen - sigBefore.textLen) > 20;
      if (changed) {
        working.push({ text: probe.text, kind: 'expandable section' });
        await this.page
          .goto(menuUrl, { waitUntil: 'domcontentloaded' })
          .catch(() => undefined);
        continue;
      }

      // Clicked, but nothing navigated or expanded -> genuine phantom.
      phantoms.push({
        text: probe.text,
        tag: probe.tag,
        reason:
          'Clicking the item neither navigates nor expands a section - inert (no navigable URL)',
      });
    }

    // Per-item verdict summary so working items are reported, not just phantoms.
    const totalItems = working.length + phantoms.length;
    console.log(
      `[Menu Navigation] Item verdicts (${totalItems} item(s): ${working.length} working, ${phantoms.length} phantom):`
    );
    working.forEach((w, i) =>
      console.log(`  ${i + 1}. ✓ "${w.text}" - ${w.kind}`)
    );
    phantoms.forEach((p, i) =>
      console.log(
        `  ${working.length + i + 1}. ✗ "${p.text}" (<${p.tag.toLowerCase()}>) - PHANTOM (${p.reason})`
      )
    );

    if (phantoms.length > 0) {
      console.error(
        `[Menu Navigation] Detected ${phantoms.length} phantom link(s) verified by click (no navigation, no expand):`
      );
      phantoms.forEach((p, i) =>
        console.error(`  ${i + 1}. "${p.text}" (<${p.tag.toLowerCase()}>) - ${p.reason}`)
      );
    }

    return phantoms;
  }

  /**
   * Validate a collection of links
   * @param skipExternalValidation - Skip HTTP validation for known external domains (social media, etc.)
   */
  private async validateLinks(
    locator: any,
    section: string,
    skipExternalValidation: boolean = false
  ): Promise<LinkValidationResult[]> {
    const results: LinkValidationResult[] = [];
    const count = await locator.count();

    console.log(`[${section}] Found ${count} links to validate`);

    for (let i = 0; i < count; i++) {
      const link = locator.nth(i);

      try {
        // Check visibility - skip hidden links gracefully
        const isVisible = await link.isVisible({ timeout: 3000 }).catch(() => false);
        if (!isVisible) {
          continue;
        }

        // Get link attributes
        const href = await link.getAttribute('href');
        const text = (await link.textContent())?.trim() || '';

        if (!href || this.shouldIgnoreLink(href)) {
          continue;
        }

        // Validate clickability
        const clickabilityCheck = await this.validateClickability(link, text);
        if (!clickabilityCheck.isClickable) {
          console.error(`[${section}] Link not clickable: "${text}" - ${clickabilityCheck.error}`);
        }

        const isExternal = this.isExternalLink(href);
        const fullUrl = this.resolveUrl(href);

        // Skip HTTP validation for known external domains if requested
        if (skipExternalValidation && isExternal && this.isKnownExternalDomain(href)) {
          console.log(`[${section}] Skipping HTTP validation for known external link: ${href}`);
          results.push({
            url: fullUrl,
            text,
            href,
            statusCode: null,
            isValid: clickabilityCheck.isClickable, // Only valid if clickable
            errorMessage: clickabilityCheck.isClickable ? 'External link (not validated via HTTP)' : clickabilityCheck.error,
            isExternal,
            isClickable: clickabilityCheck.isClickable,
            clickabilityError: clickabilityCheck.error,
          });
          continue;
        }

        // Validate the link
        const result = await this.checkLinkStatus(fullUrl, text, href, isExternal);
        result.isClickable = clickabilityCheck.isClickable;
        result.clickabilityError = clickabilityCheck.error;
        
        // Link is only valid if both HTTP status AND clickability are good
        result.isValid = result.isValid && clickabilityCheck.isClickable;
        if (!clickabilityCheck.isClickable) {
          result.errorMessage = result.errorMessage 
            ? `${result.errorMessage}; ${clickabilityCheck.error}`
            : clickabilityCheck.error;
        }
        
        results.push(result);

        // Log broken links
        if (!result.isValid) {
          this.logBrokenLink(text, href, result.statusCode, result.errorMessage || 'Unknown error');
        }
      } catch (error) {
        console.error(`[${section}] Error validating link ${i}:`, error);
      }
    }

    return results;
  }

  /**
   * Validate if a link is actually clickable (not just visible)
   * Checks: enabled state, pointer-events CSS, and trial click interaction
   */
  private async validateClickability(
    link: any,
    linkText: string
  ): Promise<{ isClickable: boolean; error?: string }> {
    try {
      // Check 1: Is the link enabled?
      const isEnabled = await link.isEnabled();
      if (!isEnabled) {
        return { isClickable: false, error: 'Link is disabled' };
      }

      // Check 2: CSS pointer-events property
      const pointerEvents = await link.evaluate((el: HTMLElement) => {
        return globalThis.getComputedStyle(el).pointerEvents;
      });
      
      if (pointerEvents === 'none') {
        return { isClickable: false, error: 'CSS pointer-events is set to "none"' };
      }

      // Check 3: Verify link is not covered by another element (do this before trial click for speed)
      const isVisibleAndInteractable = await link.evaluate((el: HTMLElement) => {
        // Scroll element into view first so elementFromPoint works correctly
        el.scrollIntoView({ block: 'center', behavior: 'instant' });
        
        const rect = el.getBoundingClientRect();
        
        // Skip if element has no dimensions
        if (rect.width === 0 || rect.height === 0) return false;
        
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // If still outside viewport after scroll, assume it's ok (not blocked)
        if (centerY < 0 || centerY > globalThis.innerHeight || centerX < 0 || centerX > globalThis.innerWidth) {
          return true;
        }
        
        const elementAtPoint = document.elementFromPoint(centerX, centerY);
        
        // No element found at point - not blocked
        if (!elementAtPoint) return true;
        
        // Check if the element at the center point is the link itself or a child/parent
        if (el.contains(elementAtPoint) || elementAtPoint.contains(el)) return true;
        
        // Check if both share the same navigation/footer container
        const container = el.closest('nav, [role="navigation"], [role="dialog"], aside, footer, [data-qa="footer"], header');
        if (container && container.contains(elementAtPoint)) return true;
        
        // Only report as covered if it's a real blocking overlay (cookie banner, modal, etc.)
        const coveringElement = elementAtPoint as HTMLElement;
        const isRealOverlay = coveringElement.closest(
          '#onetrust-banner-sdk, .onetrust-pc-dark-filter, [role="alertdialog"], .cookie-banner, .modal-backdrop, .overlay'
        );
        
        return !isRealOverlay;
      });

      if (!isVisibleAndInteractable) {
        return { 
          isClickable: false, 
          error: 'Link is covered by another element (overlay detected)' 
        };
      }

      // Check 4: Try a trial click (doesn't actually click, just validates interactability)
      try {
        await link.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
        await link.click({ trial: true, timeout: 3000 });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        return { 
          isClickable: false, 
          error: `Cannot interact with link: ${errorMsg.split('\n')[0]}` 
        };
      }

      return { isClickable: true };
    } catch (error) {
      console.error(`Error checking clickability for "${linkText}":`, error);
      return { 
        isClickable: false, 
        error: `Clickability check failed: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  /**
   * Check if a link is to a known external domain (social media, etc.)
   */
  private isKnownExternalDomain(href: string): boolean {
    return rolloutConfig.linkValidation.externalDomains.some((domain) =>
      href.toLowerCase().includes(domain.toLowerCase())
    );
  }

  /**
   * Check if a link should be ignored
   */
  private shouldIgnoreLink(href: string): boolean {
    return rolloutConfig.linkValidation.ignorePatterns.some((pattern) =>
      pattern.test(href)
    );
  }

  /**
   * Check if a link is external
   */
  private isExternalLink(href: string): boolean {
    if (href.startsWith('http://') || href.startsWith('https://')) {
      const currentDomain = new URL(this.page.url()).hostname;
      const linkDomain = new URL(href).hostname;
      return currentDomain !== linkDomain;
    }
    return false;
  }

  /**
   * Resolve relative URLs to absolute URLs
   */
  private resolveUrl(href: string): string {
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return href;
    }

    const baseUrl = new URL(this.page.url());
    if (href.startsWith('/')) {
      return `${baseUrl.origin}${href}`;
    }

    return new URL(href, this.page.url()).href;
  }

  /**
   * Check link status using network request
   */
  private async checkLinkStatus(
    url: string,
    text: string,
    originalHref: string,
    isExternal: boolean
  ): Promise<LinkValidationResult> {
    try {
      // For external links, use a simplified check (network request only)
      // Note: Link disclaimer modal is handled at the UI level, not during HTTP checks
      //
      // Send the same headers a real browser navigation carries. APIRequestContext
      // omits these by default, and bot-protection (e.g. Akamai) answers requests
      // that have a browser User-Agent but lack navigation headers with a 403 —
      // even though the very same URL returns 200 in the browser. Mirroring the
      // navigation header set makes the probe reflect what a user actually sees.
      const response = await this.page.request.get(url, {
        timeout: rolloutConfig.timeouts.linkCheck,
        maxRedirects: 5,
        headers: this.browserNavigationHeaders(),
      });

      let statusCode = response.status();
      let isValid = statusCode >= 200 && statusCode < 400;

      // Fallback: if bot-protection still blocks the API-style probe (401/403),
      // re-verify with a real browser navigation in a throwaway page (so the
      // main page under test is not disrupted). This is the ground truth — if the
      // page loads in a browser it is genuinely reachable.
      if (!isValid && (statusCode === 401 || statusCode === 403)) {
        const navStatus = await this.verifyViaNavigation(url);
        if (navStatus !== null) {
          statusCode = navStatus;
          isValid = statusCode >= 200 && statusCode < 400;
        }
      }

      return {
        url,
        text,
        href: originalHref,
        statusCode,
        isValid,
        errorMessage: isValid ? undefined : `HTTP ${statusCode}`,
        isExternal,
      };
    } catch (error: any) {
      return {
        url,
        text,
        href: originalHref,
        statusCode: null,
        isValid: false,
        errorMessage: error.message || 'Request failed',
        isExternal,
      };
    }
  }

  /**
   * Headers that mimic a top-level browser navigation. Bot-protection commonly
   * 403s API-style requests that omit these, so we attach them to link probes.
   */
  private browserNavigationHeaders(): Record<string, string> {
    return {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
    };
  }

  /**
   * Ground-truth reachability check: open the URL in a throwaway page within the
   * same browser context (so the page under test is untouched) and return the
   * navigation status code. Returns null if navigation could not produce a
   * response (network failure / timeout).
   */
  private async verifyViaNavigation(url: string): Promise<number | null> {
    let probePage;
    try {
      probePage = await this.page.context().newPage();
      const response = await probePage.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: rolloutConfig.timeouts.linkCheck,
      });
      return response ? response.status() : null;
    } catch {
      return null;
    } finally {
      if (probePage) {
        await probePage.close().catch(() => {
          /* ignore close errors */
        });
      }
    }
  }

  /**
   * Log broken link for reporting
   */
  private logBrokenLink(
    linkText: string,
    href: string,
    statusCode: number | null,
    errorMessage: string
  ): void {
    this.brokenLinks.push({
      pageUrl: this.page.url(),
      language: this.extractLanguageFromUrl(this.page.url()),
      linkText,
      href,
      statusCode,
      errorMessage,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Extract language code from URL
   */
  private extractLanguageFromUrl(url: string): string {
    const match = url.match(/\/([a-z]{2}-[a-z]{2})\//i);
    return match ? match[1] : 'unknown';
  }

  /**
   * Get all broken links found during validation
   */
  getBrokenLinks(): BrokenLinkReport[] {
    return this.brokenLinks;
  }

  /**
   * Generate broken links report
   */
  generateBrokenLinksReport(): string {
    if (this.brokenLinks.length === 0) {
      return 'No broken links found!';
    }

    let report = `\n========== BROKEN LINKS REPORT ==========\n`;
    report += `Total broken links: ${this.brokenLinks.length}\n\n`;

    this.brokenLinks.forEach((link, index) => {
      report += `${index + 1}. ${link.linkText || '[No text]'}\n`;
      report += `   Page: ${link.pageUrl}\n`;
      report += `   Language: ${link.language}\n`;
      report += `   Href: ${link.href}\n`;
      report += `   Status: ${link.statusCode || 'N/A'}\n`;
      report += `   Error: ${link.errorMessage}\n`;
      report += `   Time: ${link.timestamp}\n\n`;
    });

    return report;
  }

  /**
   * Generate a consolidated footer link validation report.
   * Categorizes results to satisfy footer-link expectations:
   * total links, clickable / non-clickable counts, URLs returning 404,
   * and URLs returning any non-200 status code.
   *
   * Note: Known external links (social media) are skipped from HTTP
   * validation (statusCode === null) and are reported separately so they
   * do not pollute the 404 / non-200 buckets.
   *
   * @param results - Results returned by validateFooterLinks()
   * @param section - Label for the report header (defaults to "Footer")
   * @param phantomLinks - Footer entries rendered as links but with no href
   *                       (from detectPhantomFooterLinks()).
   */
  generateFooterLinkReport(
    results: LinkValidationResult[],
    section: string = 'Footer',
    phantomLinks: PhantomFooterLink[] = []
  ): FooterLinkReport {
    const clickable = results.filter((r) => r.isClickable === true);
    const nonClickable = results.filter((r) => r.isClickable === false);

    // External links skipped from HTTP validation carry a null status code.
    const httpChecked = results.filter((r) => r.statusCode !== null);
    const skippedExternal = results.filter(
      (r) => r.statusCode === null && r.isExternal
    );

    const notFound = httpChecked.filter((r) => r.statusCode === 404);
    // Any HTTP-checked link whose status is not exactly 200.
    const nonOk = httpChecked.filter((r) => r.statusCode !== 200);

    const summary: FooterLinkSummary = {
      total: results.length,
      clickable: clickable.length,
      nonClickable: nonClickable.length,
      notFound: notFound.length,
      nonOk: nonOk.length,
      skippedExternal: skippedExternal.length,
      phantom: phantomLinks.length,
    };

    let report = `\n========== ${section.toUpperCase()} LINK VALIDATION REPORT ==========\n`;
    report += `Page: ${this.page.url()}\n\n`;
    report += `Total ${section} Links Found : ${summary.total}\n`;
    report += `Clickable Links           : ${summary.clickable}\n`;
    report += `Non-Clickable Links       : ${summary.nonClickable}\n`;
    report += `URLs Returning 404        : ${summary.notFound}\n`;
    report += `URLs With Non-200 Status  : ${summary.nonOk}\n`;
    report += `External Links (skipped)  : ${summary.skippedExternal}\n`;
    report += `Phantom Links (no href)   : ${summary.phantom}\n`;

    if (nonClickable.length > 0) {
      report += `\n--- Non-Clickable Links ---\n`;
      nonClickable.forEach((link, index) => {
        report += `${index + 1}. "${link.text || '[No text]'}"\n`;
        report += `   URL  : ${link.url}\n`;
        report += `   Href : ${link.href}\n`;
        report += `   Reason: ${link.clickabilityError || 'Not clickable'}\n`;
      });
    }

    if (phantomLinks.length > 0) {
      report += `\n--- Phantom Links (rendered as links but have NO URL) ---\n`;
      phantomLinks.forEach((link, index) => {
        report += `${index + 1}. "${link.text || '[No text]'}" (<${link.tag.toLowerCase()}>)\n`;
        report += `   Reason: ${link.reason}\n`;
      });
    }

    if (notFound.length > 0) {
      report += `\n--- URLs Returning 404 ---\n`;
      notFound.forEach((link, index) => {
        report += `${index + 1}. "${link.text || '[No text]'}" -> ${link.url} (404)\n`;
      });
    }

    const otherNonOk = nonOk.filter((r) => r.statusCode !== 404);
    if (otherNonOk.length > 0) {
      report += `\n--- URLs With Non-200 (non-404) Status ---\n`;
      otherNonOk.forEach((link, index) => {
        report += `${index + 1}. "${link.text || '[No text]'}" -> ${link.url} (HTTP ${link.statusCode})\n`;
      });
    }

    if (summary.nonClickable === 0 && summary.nonOk === 0 && summary.phantom === 0) {
      report += `\nResult: PASS - All ${section.toLowerCase()} links are clickable, return HTTP 200, and have a valid URL.\n`;
    } else {
      report += `\nResult: FAIL - ${summary.nonClickable} non-clickable, ${summary.nonOk} non-200, ${summary.phantom} phantom (no URL).\n`;
    }

    return { summary, report, phantomLinks };
  }

  /**
   * Self-contained footer link validation with strict assertions.
   *
   * Performs the complete footer-link expectation in a single reusable call:
   *  1. Locates all footer links (footer selector + anchor selector).
   *  2. Verifies each link is visible and clickable.
   *  3. Captures the href URL of every footer link.
   *  4. Sends an HTTP request per URL and validates a 200 (OK) status.
   *  5. Logs non-clickable links (text + URL) in the report.
   *  6. Captures and logs URLs returning 404.
   *  7. Captures and logs URLs returning any non-200 status code.
   *  8. Continues execution even if one or more links fail.
   *  9-13. Produces a consolidated report (totals, clickable / non-clickable,
   *        404s, non-200s, phantom links without a URL).
   *  14. Asserts the test fails if any footer link is non-clickable, returns
   *      a status code other than 200, or is a phantom link (rendered as a link
   *      but with no navigable URL).
   *
   * Works for all rollout sites because it relies on the shared footer/link
   * selectors in rolloutConfig and resolves relative URLs against the current
   * page origin.
   *
   * @param section - Label used in logs and the report header (default "Footer").
   * @returns The consolidated FooterLinkReport (summary + formatted report).
   */
  async validateAndAssertFooterLinks(section: string = 'Footer'): Promise<FooterLinkReport> {
    // Ensure consent / overlay elements are dismissed before interacting.
    await this.acceptCookies();

    // Steps 1-8: locate, validate clickability, capture href, HTTP-check, log.
    const results = await this.validateFooterLinks();

    // Detect footer entries that look like links but have no navigable URL.
    const phantomLinks = await this.detectPhantomFooterLinks();

    // Steps 9-13: build the consolidated, categorized report.
    const footerReport = this.generateFooterLinkReport(results, section, phantomLinks);
    console.log(footerReport.report);

    const { summary } = footerReport;

    // Guard against false positives - the footer must expose links to validate.
    expect(
      summary.total,
      `No ${section.toLowerCase()} links were found to validate - page may not have loaded`
    ).toBeGreaterThan(0);

    // Step 14: fail if any link is non-clickable.
    expect(
      summary.nonClickable,
      `Found ${summary.nonClickable} non-clickable ${section.toLowerCase()} link(s).\n${footerReport.report}`
    ).toBe(0);

    // Step 14: fail if any HTTP-checked link returns a status other than 200
    // (includes 404s and any other non-200 response).
    expect(
      summary.nonOk,
      `Found ${summary.nonOk} ${section.toLowerCase()} link(s) returning a non-200 status ` +
        `(404s: ${summary.notFound}).\n${footerReport.report}`
    ).toBe(0);

    // Fail if any footer entry is rendered as a link but has no navigable URL.
    expect(
      summary.phantom,
      `Found ${summary.phantom} phantom ${section.toLowerCase()} link(s) rendered without a URL ` +
        `(not clickable as links).\n${footerReport.report}`
    ).toBe(0);

    return footerReport;
  }

  /**
   * Validate hreflang URLs are reachable
   */
  async validateHreflangUrls(): Promise<LinkValidationResult[]> {
    const results: LinkValidationResult[] = [];

    try {
      const hreflangLinks = await this.page.locator('link[rel="alternate"][hreflang]').all();

      console.log(`[Hreflang] Found ${hreflangLinks.length} alternate URLs to validate`);

      for (const link of hreflangLinks) {
        const href = await link.getAttribute('href');
        const hreflang = await link.getAttribute('hreflang');

        if (href) {
          const result = await this.checkLinkStatus(href, `Hreflang: ${hreflang}`, href, false);
          results.push(result);

          if (!result.isValid) {
            this.logBrokenLink(`Hreflang: ${hreflang}`, href, result.statusCode, result.errorMessage || 'Unknown error');
          }
        }
      }
    } catch (error: any) {
      console.error('[Hreflang] Error validating hreflang URLs:', error.message);
    }

    return results;
  }

  /**
   * Open the hamburger flyout menu, returning true once a panel is visible.
   * Content-driven: located via the design-system "Burger Menu" button, so it
   * works across all rollout sites/locales without hardcoded selectors.
   */
  private async openMenuFlyout(): Promise<boolean> {
    await this.dismissOverlays().catch(() => undefined);
    let panel = await this.findFlyoutPanel().catch(() => null);
    if (panel) {
      return true;
    }
    const hamburger = this.page
      .locator(
        'button[aria-label*="Burger Menu"], button[aria-label*="Menu"], button[aria-label*="menu"]'
      )
      .first();
    const visible = await hamburger.isVisible({ timeout: 5000 }).catch(() => false);
    if (!visible) {
      return false;
    }
    await hamburger.click({ force: true, timeout: 5000 }).catch(() => undefined);
    await this.page.waitForTimeout(1500);
    panel = await this.findFlyoutPanel().catch(() => null);
    return !!panel;
  }

  /**
   * Collect the flyout's utility-bar anchors: visible `<a href>` links that sit
   * in the open flyout but OUTSIDE the main menu list (`<nav>`) - i.e. the
   * bottom utility bar (home/logo, Contact, plus any locale/region option links
   * a selector has revealed). Content-driven: discovered from the live DOM.
   */
  private async collectFlyoutUtilityAnchors(): Promise<
    { href: string; text: string }[]
  > {
    return await this.page.evaluate(() => {
      let root: Element | null = null;
      let best = 0;
      for (const el of Array.from(
        document.querySelectorAll('div, aside, section, nav')
      )) {
        const s = globalThis.getComputedStyle(el);
        const overlay = s.position === 'fixed' || s.position === 'absolute';
        const rect = el.getBoundingClientRect();
        const large = rect.height > 300 && rect.width > 200;
        const vis =
          s.display !== 'none' &&
          s.visibility !== 'hidden' &&
          Number.parseFloat(s.opacity) > 0;
        if (overlay && large && vis) {
          const score = el.querySelectorAll('a[href], button').length;
          if (score > best) {
            best = score;
            root = el;
          }
        }
      }
      if (!root) {
        return [] as { href: string; text: string }[];
      }
      const out: { href: string; text: string }[] = [];
      root.querySelectorAll('a[href]').forEach((a) => {
        if (a.closest('nav') || (a as HTMLElement).offsetParent === null) {
          return;
        }
        const href = a.getAttribute('href');
        if (href) {
          out.push({ href, text: (a.textContent || '').trim().slice(0, 80) });
        }
      });
      return out;
    });
  }

  /**
   * Discover the utility selector BUTTONS (language / location-region selectors)
   * anywhere in the current DOM, skipping any whose key is already processed.
   *
   * Searched page-wide (not flyout-scoped) because the selectors live in the
   * page header on some sites (e.g. Pallas) and inside the burger flyout on
   * others (e.g. Kultur) - the caller opens the flyout first when the header
   * search finds nothing.
   *
   * Content-driven: matched by stable design-system signals - the control's
   * `aria-label` / `data-qa` - so no per-site label hardcoding is required.
   * Each match is tagged with `data-utility-sel` for precise clicking.
   */
  private async discoverUtilitySelectors(
    alreadyKeys: string[]
  ): Promise<{ probe: string; key: string; kind: string; text: string }[]> {
    return await this.page.evaluate((already: string[]) => {
      const SELECTOR =
        /language|location|country|region|sprache|land|standort|idioma|ubicaci|pa[ií]s/i;
      const LOCATION = /location|country|region|land|standort|ubicaci|pa[ií]s/i;

      document
        .querySelectorAll('[data-utility-sel]')
        .forEach((e) => delete (e as HTMLElement).dataset.utilitySel);

      const seen = new Set(already);
      const list: { probe: string; key: string; kind: string; text: string }[] = [];
      let i = 0;
      document.querySelectorAll('button').forEach((b) => {
        if ((b as HTMLElement).offsetParent === null) {
          return;
        }
        const aria = b.getAttribute('aria-label') || '';
        const dq =
          ((b as HTMLElement).dataset.qa || '') +
          ' ' +
          ((b as HTMLElement).dataset.testid || '');
        if (
          !SELECTOR.test(aria) &&
          !/select-(language|location|region|country)/i.test(dq)
        ) {
          return;
        }
        const key = (aria || b.textContent || '').trim().toLowerCase();
        if (!key || seen.has(key)) {
          return;
        }
        const probe = `usel-${i++}`;
        (b as HTMLElement).dataset.utilitySel = probe;
        const kind = LOCATION.test(`${aria} ${dq}`)
          ? 'location-selector'
          : 'language-selector';
        list.push({
          probe,
          key,
          kind,
          text: (b.textContent || '').trim().slice(0, 60),
        });
      });
      return list;
    }, alreadyKeys);
  }

  /**
   * Collect the OPTIONS shown in the currently open selector overlay panel
   * (e.g. `data-qa="language-overlay"` / `location-overlay`, or, as a fallback,
   * the largest visible fixed/absolute panel).
   *
   * Options come in two shapes across the design system:
   *   - anchors (`<a href>`) - the destination is known up-front, and
   *   - buttons (`<button>`) - client-side navigations whose destination is only
   *     known after clicking (language switch, per-country links, ...).
   * Control buttons (Back / Close / Search / the selector toggle itself) are
   * excluded. Each option is tagged with `data-utility-opt` for precise clicking.
   */
  private async collectOverlayOptions(): Promise<
    { probe: string; key: string; kind: 'anchor' | 'button'; href?: string; text: string }[]
  > {
    return await this.page.evaluate(() => {
      type Opt = {
        probe: string;
        key: string;
        kind: 'anchor' | 'button';
        href?: string;
        text: string;
      };
      const CONTROL =
        /^(back|close|zur[üu]ck|schlie[sß]en|menu|men[üu]|search|suche|cookie)/i;
      const TOGGLE =
        /open (language|location|region|country) selector|select-(language|location|region|country)/i;

      const isVisible = (el: Element): boolean => {
        const s = globalThis.getComputedStyle(el);
        return (
          s.display !== 'none' &&
          s.visibility !== 'hidden' &&
          Number.parseFloat(s.opacity) > 0
        );
      };

      const findRoot = (): Element | null => {
        const tagged = document.querySelector(
          '[data-qa$="-overlay"], [data-testid$="-overlay"]'
        );
        // Overlays are position:fixed (offsetParent is null), so visibility is
        // determined via computed style rather than offsetParent.
        if (tagged && isVisible(tagged)) {
          return tagged;
        }
        let best = 0;
        let chosen: Element | null = null;
        for (const el of Array.from(
          document.querySelectorAll('div, aside, section')
        )) {
          const s = globalThis.getComputedStyle(el);
          const overlay = s.position === 'fixed' || s.position === 'absolute';
          const rect = el.getBoundingClientRect();
          const large = rect.height > 300 && rect.width > 200;
          if (overlay && large && isVisible(el)) {
            const score = el.querySelectorAll('a[href], button').length;
            if (score > best) {
              best = score;
              chosen = el;
            }
          }
        }
        return chosen;
      };

      const collectAnchors = (root: Element, out: Opt[], start: number): number => {
        let i = start;
        root.querySelectorAll('a[href]').forEach((a) => {
          const href = a.getAttribute('href');
          if ((a as HTMLElement).offsetParent === null || !href) {
            return;
          }
          const probe = `uopt-${i++}`;
          (a as HTMLElement).dataset.utilityOpt = probe;
          out.push({
            probe,
            key: `a:${href}`,
            kind: 'anchor',
            href,
            text: (a.textContent || '').trim().slice(0, 60),
          });
        });
        return i;
      };

      const collectButtons = (root: Element, out: Opt[], start: number): void => {
        let i = start;
        root.querySelectorAll('button').forEach((b) => {
          const aria = b.getAttribute('aria-label') || '';
          const text = (b.textContent || '').trim();
          const label = aria || text;
          const skip =
            (b as HTMLElement).offsetParent === null ||
            !label ||
            CONTROL.test(label) ||
            TOGGLE.test(aria);
          if (skip) {
            return;
          }
          const probe = `uopt-${i++}`;
          (b as HTMLElement).dataset.utilityOpt = probe;
          out.push({
            probe,
            key: `b:${label.toLowerCase()}`,
            kind: 'button',
            text: text.slice(0, 60),
          });
        });
      };

      const root = findRoot();
      if (!root) {
        return [] as Opt[];
      }
      root
        .querySelectorAll('[data-utility-opt]')
        .forEach((e) => delete (e as HTMLElement).dataset.utilityOpt);
      const out: Opt[] = [];
      const afterAnchors = collectAnchors(root, out, 0);
      collectButtons(root, out, afterAnchors);
      return out;
    });
  }

  /**
   * Discover the selector buttons on the current page. The selectors live in the
   * header on some sites and in the burger flyout on others, so when the page
   * search finds nothing the flyout is opened and the search retried.
   */
  private async discoverSelectorsAnywhere(
    alreadyKeys: string[]
  ): Promise<{ probe: string; key: string; kind: string; text: string }[]> {
    let selectors = await this.discoverUtilitySelectors(alreadyKeys);
    if (selectors.length === 0) {
      await this.openMenuFlyout();
      selectors = await this.discoverUtilitySelectors(alreadyKeys);
    }
    return selectors;
  }

  /**
   * Reset to the base page and re-open the given selector's overlay so the next
   * option can be clicked from a clean state. Returns true when the overlay is
   * (re)opened.
   */
  private async reopenSelector(
    selectorKey: string,
    baseUrl: string
  ): Promise<boolean> {
    await this.page
      .goto(baseUrl, { waitUntil: 'domcontentloaded' })
      .catch(() => undefined);
    await this.acceptCookies().catch(() => undefined);
    const selectors = await this.discoverSelectorsAnywhere([]);
    const target = selectors.find((s) => s.key === selectorKey);
    if (!target) {
      return false;
    }
    await this.page
      .locator(`[data-utility-sel="${target.probe}"]`)
      .first()
      .click({ force: true, timeout: 5000 })
      .catch(() => undefined);
    await this.page.waitForTimeout(1200);
    return true;
  }

  /**
   * Re-open the selector's overlay as cheaply as possible after a client-side
   * (SPA) navigation closed it. A client-side route change can be undone with a
   * fast `goBack()` (no full document reload); only when that fails to return to
   * a selector-bearing page do we fall back to the full reload `reopenSelector`.
   */
  private async reopenSelectorFast(
    selectorKey: string,
    baseUrl: string
  ): Promise<boolean> {
    if (this.page.url() !== baseUrl) {
      await this.page.goBack({ waitUntil: 'commit' }).catch(() => undefined);
      await this.page.waitForTimeout(300);
    }

    let selectors = await this.discoverSelectorsAnywhere([]);
    let target = selectors.find((s) => s.key === selectorKey);
    if (!target) {
      // goBack did not land on a selector-bearing page - full reload fallback.
      return this.reopenSelector(selectorKey, baseUrl);
    }

    await this.page
      .locator(`[data-utility-sel="${target.probe}"]`)
      .first()
      .click({ force: true, timeout: 5000 })
      .catch(() => undefined);
    await this.page.waitForTimeout(600);
    return true;
  }

  /**
   * HTTP-validate a single utility link. Known external domains (social, etc.)
   * are accepted without an HTTP call (mirrors footer/menu behaviour); all
   * others must return a 2xx/3xx (redirects are followed to their final status).
   */
  private async httpCheckUtilityLink(
    href: string,
    text: string
  ): Promise<LinkValidationResult> {
    const isExternal = this.isExternalLink(href);
    const fullUrl = this.resolveUrl(href);

    if (isExternal && this.isKnownExternalDomain(href)) {
      return {
        url: fullUrl,
        text,
        href,
        statusCode: null,
        isValid: true,
        errorMessage: 'External link (not validated via HTTP)',
        isExternal,
      };
    }

    const result = await this.checkLinkStatus(fullUrl, text, href, isExternal);

    // External corporate sites frequently sit behind a WAF / bot-protection
    // that answers automated requests with 401/403 while remaining reachable in
    // a real browser. Such a response proves the destination exists, so it is
    // treated as reachable rather than broken (mirrors skipping known externals).
    if (
      !result.isValid &&
      isExternal &&
      (result.statusCode === 401 || result.statusCode === 403)
    ) {
      return {
        ...result,
        isValid: true,
        errorMessage: `External link reachable but bot-protected (HTTP ${result.statusCode})`,
      };
    }

    if (!result.isValid) {
      this.logBrokenLink(
        text,
        href,
        result.statusCode,
        result.errorMessage || 'Unknown error'
      );
    }
    return result;
  }

  /**
   * Validate the site's UTILITY links - the language selector, the
   * location/region selector and the Contact link - and assert each resolves to
   * a successful (2xx/3xx) response.
   *
   * Fully content-driven so a single script runs across all rollout
   * sites/locales:
   *   1. Open the burger flyout and collect the utility bar's direct `<a href>`
   *      links (home, Contact, ...) outside the main menu `<nav>`.
   *   2. Discover the selector buttons (header or flyout) by their design-system
   *      `aria-label` / `data-qa`. For each selector, open its overlay and
   *      validate every option it offers:
   *        - anchor options are HTTP-checked directly, and
   *        - button options (client-side navigations) are CLICKED, and the page
   *          the click lands on is HTTP-checked (Option A - behavioural).
   *   3. HTTP-check every discovered destination (deduplicated, redirects
   *      followed).
   *
   * @returns The per-link HTTP results plus which utility controls were detected.
   */
  async validateUtilityLinks(): Promise<{
    results: LinkValidationResult[];
    detected: {
      languageSelector: boolean;
      locationSelector: boolean;
      contact: boolean;
    };
  }> {
    const results: LinkValidationResult[] = [];
    const seenHrefs = new Set<string>();
    const clickedSelectors = new Set<string>();
    const detected = {
      languageSelector: false,
      locationSelector: false,
      contact: false,
    };
    const baseUrl = this.page.url();
    const CONTACT = /contact|kontakt|contacto|contato|contatti/i;

    const addLink = async (href: string, text: string): Promise<void> => {
      if (seenHrefs.has(href) || this.shouldIgnoreLink(href)) {
        return;
      }
      seenHrefs.add(href);
      results.push(await this.httpCheckUtilityLink(href, text));
    };

    // 1. Direct utility-bar anchors from the burger flyout (home/logo, Contact).
    if (await this.openMenuFlyout()) {
      for (const link of await this.collectFlyoutUtilityAnchors()) {
        if (CONTACT.test(`${link.text} ${link.href}`)) {
          detected.contact = true;
        }
        await addLink(link.href, link.text);
      }
    } else {
      console.log('[Utility] Burger flyout not available - skipping flyout anchors');
    }

    // 2. Language / location selectors and every option they offer. Reset to a
    //    clean base page first so header-level selectors are clickable.
    await this.page
      .goto(baseUrl, { waitUntil: 'domcontentloaded' })
      .catch(() => undefined);
    await this.acceptCookies().catch(() => undefined);
    await this.processUtilitySelectors(baseUrl, clickedSelectors, detected, addLink);

    console.log(
      `[Utility] Detected -> language selector: ${detected.languageSelector}, ` +
        `location selector: ${detected.locationSelector}, contact: ${detected.contact}`
    );

    return { results, detected };
  }

  /**
   * Discover each utility selector (language / location-region) in turn, open
   * its overlay and validate every option it offers.
   */
  private async processUtilitySelectors(
    baseUrl: string,
    clickedSelectors: Set<string>,
    detected: {
      languageSelector: boolean;
      locationSelector: boolean;
      contact: boolean;
    },
    addLink: (href: string, text: string) => Promise<void>
  ): Promise<void> {
    for (let guard = 0; guard < 6; guard++) {
      if (this.page.url() !== baseUrl) {
        await this.page
          .goto(baseUrl, { waitUntil: 'domcontentloaded' })
          .catch(() => undefined);
        await this.acceptCookies().catch(() => undefined);
      }

      const selectors = await this.discoverSelectorsAnywhere(
        Array.from(clickedSelectors)
      );
      const next = selectors.find((s) => !clickedSelectors.has(s.key));
      if (!next) {
        return;
      }
      clickedSelectors.add(next.key);
      if (next.kind === 'location-selector') {
        detected.locationSelector = true;
      } else {
        detected.languageSelector = true;
      }

      await this.page
        .locator(`[data-utility-sel="${next.probe}"]`)
        .first()
        .click({ force: true, timeout: 5000 })
        .catch(() => undefined);
      await this.page.waitForTimeout(1200);

      await this.validateSelectorOptions(next, baseUrl, addLink);
    }
  }

  /**
   * Validate every option offered by one open selector overlay.
   *
   * Anchor options are HTTP-checked directly. Button options are CLICKED to
   * discover their (client-side) destination (Option A - behavioural): the click
   * triggers a navigation whose URL is captured via request interception and the
   * navigation is then aborted, so the overlay stays open and the next option is
   * reachable without reloading. Each captured destination is HTTP-checked.
   */
  private async validateSelectorOptions(
    selector: { key: string; kind: string },
    baseUrl: string,
    addLink: (href: string, text: string) => Promise<void>
  ): Promise<void> {
    const MAX_BUTTON_OPTIONS = 25;
    const options = await this.collectOverlayOptions();

    for (const opt of options) {
      if (opt.kind === 'anchor' && opt.href) {
        await addLink(opt.href, `[${selector.kind}] ${opt.text}`);
      }
    }

    const buttonCount = options.filter((o) => o.kind === 'button').length;
    if (buttonCount === 0) {
      return;
    }
    const limit = Math.min(buttonCount, MAX_BUTTON_OPTIONS);
    if (buttonCount > MAX_BUTTON_OPTIONS) {
      console.log(
        `[Utility] ${selector.kind}: ${buttonCount} option(s) found, ` +
          `validating the first ${MAX_BUTTON_OPTIONS}`
      );
    }

    const destinations = await this.captureButtonDestinations(
      limit,
      selector,
      baseUrl
    );
    for (const dest of destinations) {
      await addLink(dest.url, `[${selector.kind}] ${dest.text}`);
    }
  }

  /**
   * Click up to `limit` button options of the open overlay and capture the URL
   * each click navigates to (Option A - behavioural).
   *
   * Options are re-collected (and re-tagged) on every iteration so the probes
   * stay valid even after the overlay is re-rendered. A document-level
   * navigation is captured via request interception and aborted, leaving the
   * overlay open (no reopen needed). A client-side (SPA) navigation closes the
   * overlay; its URL is recorded and the overlay is cheaply re-opened with
   * `reopenSelectorFast` (SPA `goBack`, no full reload) before the next option.
   */
  private async captureButtonDestinations(
    limit: number,
    selector: { key: string; kind: string },
    baseUrl: string
  ): Promise<{ url: string; text: string }[]> {
    const results: { url: string; text: string }[] = [];
    let captured: string | null = null;

    const handler = async (
      route: import('@playwright/test').Route
    ): Promise<void> => {
      const request = route.request();
      const isNav =
        request.isNavigationRequest() &&
        request.frame() === this.page.mainFrame();
      if (isNav) {
        captured = request.url();
        await route.abort().catch(() => undefined);
      } else {
        await route.continue().catch(() => undefined);
      }
    };

    await this.page.route('**/*', handler);
    try {
      for (let i = 0; i < limit; i++) {
        const buttons = (await this.collectOverlayOptions()).filter(
          (o) => o.kind === 'button'
        );
        if (i >= buttons.length) {
          break;
        }
        const target = buttons[i];

        captured = null;
        const before = this.page.url();
        await this.page
          .locator(`[data-utility-opt="${target.probe}"]`)
          .first()
          .click({ force: true, timeout: 4000 })
          .catch(() => undefined);
        await this.page.waitForTimeout(200);

        const spaUrl = this.page.url();
        if (captured) {
          // Document navigation: aborted, overlay still open.
          results.push({ url: captured, text: target.text });
          continue;
        }
        if (spaUrl === before) {
          // No navigation (e.g. the currently active option): the page itself.
          results.push({ url: before, text: target.text });
          continue;
        }
        // Client-side navigation closed the overlay: record and re-open cheaply.
        results.push({ url: spaUrl, text: target.text });
        if (!(await this.reopenSelectorFast(selector.key, baseUrl))) {
          break;
        }
      }
    } finally {
      await this.page.unroute('**/*', handler).catch(() => undefined);
    }

    return results;
  }
}

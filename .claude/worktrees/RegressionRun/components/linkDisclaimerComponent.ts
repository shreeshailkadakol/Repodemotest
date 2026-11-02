import { BasePage } from '../helpers/utils/basePage';
import { Page, Locator, Browser, BrowserContext, expect } from '@playwright/test';
import { componentURL } from '../test-data/componentURL';
import { envUtils } from '../helpers/utils/envUtils';

export class LinkDisclaimerComponent extends BasePage {
  // Location selector elements (trigger mechanism)
  private readonly locationSelectorButton: Locator = this.page.locator(
    '[data-qa="select-location-button"]'
  );
  private readonly locationDropdown: Locator = this.page.locator('[data-qa="location-dropdown"]');
  private readonly locationOverlay: Locator = this.page.locator('[data-qa="location-overlay"]');

  // External links in location overlay
  private readonly externalBayerLinks: Locator = this.page.locator('a[href*="bayer.com"]');
  private readonly specificBayerLink: Locator = this.page.locator('a[href="http://www.bayer.com"]');

  // Social media links in the footer — clicking any of these external links
  // triggers the Link Disclaimer popup on the homepage.
  private readonly socialMediaLinks: Locator = this.page.locator(
    '[data-qa="social-media-links"] a'
  );

  // The external URL of the social media link that triggered the disclaimer,
  // captured so tests can assert the Continue button navigates to it.
  private lastExternalUrl: string | null = null;

  // Link Disclaimer modal elements
  private readonly disclaimerModal: Locator = this.page.locator('[data-qa="popup"]');
  private readonly disclaimerOverlay: Locator = this.page.locator(
    '[data-qa="popup-overlay"], [role="dialog"]:has([data-qa="popup"])'
  );
  private readonly disclaimerTitle: Locator = this.page.locator('#popup-title');
  // The popup has no dedicated title element; the disclaimer text is the body
  // block rendered above the action buttons.
  private readonly disclaimerMessage: Locator = this.page
    .locator('[data-qa="popup"] > div')
    .first();

  // Modal buttons
  private readonly continueButton: Locator = this.page.locator(
    '[data-qa="link-disclaimer-primary-button"]'
  );
  private readonly cancelButton: Locator = this.page.locator(
    '[data-qa="link-disclaimer-secondary-button"]'
  );

  // Internal navigation links (for negative testing). Locale-aware: internal
  // links are prefixed with the current market's locale segment (e.g. /en/,
  // /de-de/, /en-gb/). Hardcoding /en/ caused this to match nothing on non-en
  // markets, making the click time out.
  private readonly internalLinks: Locator = this.page.locator(
    `a[href^="/${envUtils.getLocalePath()}/"]`
  );

  // Cookie consent (prerequisite)
  private readonly cookieAcceptButton: Locator = this.page.locator('#onetrust-accept-btn-handler');

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Navigate to the Link Disclaimer test page and handle authentication.
   *
   * Iterates the candidate URLs from componentURL.ts (primary + fallbacks).
   * Non-prod environments (pre-prod / QA / staging) prefer the fallback URL
   * (dedicated QA test page) since the prod-style location-selector flow
   * usually isn't wired up there.
   */
  async navigateToTestPage(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    // Cross-site mode: when SITE_BASE_URL is set, baseURL is already the
    // localized microsite home (e.g. .../fr-fr/france), so navigate straight to
    // it. The default getComponentUrlsWithFallback composition appends a
    // {locale} token (defaulting to en-gb) + a QA-only fallback page, which
    // produce invalid URLs on real microsites.
    const candidateUrls = process.env.SITE_BASE_URL?.trim()
      ? [baseURL]
      : await this.getComponentUrlsWithFallback('LinkDisclaimerComponent', baseURL);

    let lastError: unknown;

    for (const url of candidateUrls) {
      try {
        await this.navigateWithAuthentication(url);
        await this.page.waitForLoadState('domcontentloaded', { timeout: 20000 });

        // The Link Disclaimer is triggered from the homepage footer: scroll to
        // the bottom so lazy-loaded social media links attach to the DOM, then
        // confirm at least one social media link is present as the entrypoint.
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.page.waitForTimeout(1000);

        const hasEntrypoint = await this.socialMediaLinks
          .first()
          .waitFor({ state: 'attached', timeout: 10000 })
          .then(() => true)
          .catch(() => false);

        if (!hasEntrypoint) {
          throw new Error(`No social media links (Link Disclaimer entrypoint) found on ${url}`);
        }
        return;
      } catch (error) {
        lastError = error;
        // Continue to next candidate URL.
      }
    }

    throw new Error(
      `Failed to navigate to Link Disclaimer component on any of: ${candidateUrls.join(', ')}. Last error: ${lastError}`
    );
  }

  /**
   * Accept cookie consent if present and forcefully remove banner (prerequisite)
   */
  async acceptCookieConsentIfPresent(): Promise<void> {
    try {
      await this.acceptCookiesBanner();

      // Forcefully remove cookie banner if it persists - multiple attempts
      for (let i = 0; i < 3; i++) {
        const cookieBanner = this.page.locator('#onetrust-consent-sdk');
        const bannerExists = (await cookieBanner.count()) > 0;

        if (bannerExists) {
          console.log(
            `[LinkDisclaimer] Cookie banner still present (attempt ${i + 1}), forcefully removing...`
          );
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
          console.log('[LinkDisclaimer] Cookie banner not present');
          break;
        }
      }
    } catch (error) {
      // Cookie dialog not present or already handled
    }
  }

  /**
   * Click location selector to open location overlay
   */
  async clickLocationSelector(): Promise<void> {
    // Scroll to ensure location button is in view
    await this.locationSelectorButton.scrollIntoViewIfNeeded();

    // Wait for button to be visible and stable
    await this.locationSelectorButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(1000); // Wait for any animations to settle

    // Force click if needed to handle overlays
    await this.locationSelectorButton.click({ force: true });

    // Wait for location overlay to load completely
    await this.locationOverlay.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForTimeout(2000); // Additional wait for animation
  }

  /**
   * Click external bayer.com link to trigger Link Disclaimer.
   *
   * On the dedicated QA test page we prefer links inside <main>/content area
   * because the disclaimer is only wired up on content links — header/footer
   * bayer.com links navigate directly without showing the popup.
   */
  async clickExternalBayerLink(): Promise<void> {
    const onDedicatedTestPage = /linkdisclaimer/i.test(this.page.url());

    const scopedLinks = onDedicatedTestPage
      ? this.page.locator('main a[href*="bayer.com"], [data-qa="content"] a[href*="bayer.com"]')
      : this.externalBayerLinks;

    let candidates = await scopedLinks.all();
    if (candidates.length === 0) {
      // Fall back to global search if scoped lookup found nothing
      candidates = await this.externalBayerLinks.all();
    }

    for (const link of candidates) {
      const isVisible = await link.isVisible();
      if (isVisible) {
        const href = await link.getAttribute('href');

        // Skip RSS feeds - we want navigation links that trigger disclaimers
        if (href && href.includes('/rss')) {
          continue;
        }

        // Scroll into view and click
        await link.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await link.click({ force: true });

        // Wait a bit for Link Disclaimer to potentially appear
        await this.page.waitForTimeout(2000);
        break;
      }
    }
  }

  /**
   * Complete trigger sequence: (optional) location selector → external link → disclaimer.
   *
   * Two supported flows:
   *  - Prod homepage flow: open location overlay first, then click an external link.
   *  - Dedicated QA test page: external bayer.com links are rendered directly, no
   *    location selector is required. We detect this via URL and skip the overlay step.
   */
  async triggerLinkDisclaimer(): Promise<void> {
    // The disclaimer is triggered from the homepage by clicking an external
    // social media link in the footer.
    await this.clickSocialMediaLink();

    // Wait for Link Disclaimer modal to appear
    await this.disclaimerModal.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Click an external social media link in the footer to trigger the Link
   * Disclaimer popup. The clicked link's href is stored so callers can assert
   * the Continue button navigates to that external destination.
   */
  async clickSocialMediaLink(): Promise<void> {
    // Ensure the footer (and its lazy-loaded social links) is in view.
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(1000);

    await this.socialMediaLinks.first().waitFor({ state: 'attached', timeout: 15000 });

    const count = await this.socialMediaLinks.count();
    for (let i = 0; i < count; i++) {
      const link = this.socialMediaLinks.nth(i);
      const href = await link.getAttribute('href');
      if (!href) {
        continue;
      }
      this.lastExternalUrl = href;
      await link.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(300);
      await link.click({ force: true });
      return;
    }

    throw new Error('No social media links found to trigger the Link Disclaimer.');
  }

  /**
   * Host of the external social media link that triggered the disclaimer
   * (e.g. "www.instagram.com"). Used to assert Continue navigation.
   */
  getLastExternalHost(): string {
    if (!this.lastExternalUrl) {
      return '';
    }
    try {
      return new URL(this.lastExternalUrl).host;
    } catch {
      return this.lastExternalUrl;
    }
  }

  /**
   * Host of the current environment's base URL (e.g.
   * "bayer-beyond-prod-kultur.vercel.app"). Used to assert the user stayed on
   * the site after Cancel / internal navigation.
   */
  getBaseHost(): string {
    try {
      return new URL(envUtils.getBaseUrl()).host;
    } catch {
      return envUtils.getBaseUrl();
    }
  }

  /**
   * Click Continue button and verify navigation to external site (opens in new tab)
   */
  async clickContinueButton(): Promise<string> {
    // Ensure cookie banner is removed before clicking
    await this.acceptCookieConsentIfPresent();

    // The Continue button opens the external destination in a new tab.
    const newPagePromise = this.page
      .context()
      .waitForEvent('page', { timeout: 30000 })
      .catch(() => null);

    // Click Continue button
    await this.continueButton.click();

    const newPage = await newPagePromise;

    if (newPage) {
      await newPage.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
      const newUrl = newPage.url();
      await newPage.close();
      return newUrl;
    }

    // Fallback: some markets navigate in the same tab.
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    return this.page.url();
  }

  /**
   * Click Cancel button and verify modal closure
   */
  async clickCancelButton(): Promise<void> {
    // Ensure cookie banner is removed before clicking
    await this.acceptCookieConsentIfPresent();

    await this.cancelButton.click({ timeout: 10000 });
    await this.page.waitForTimeout(2000); // Wait for modal to close
  }

  /**
   * Click internal navigation link (for negative testing)
   */
  async clickInternalLink(): Promise<void> {
    const internalLink = this.internalLinks.first();
    await internalLink.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Verify Link Disclaimer modal is visible and contains required elements
   */
  async verifyDisclaimerModalStructure(): Promise<void> {
    // Modal container
    await expect.soft(this.disclaimerModal).toBeVisible();
    await expect.soft(this.disclaimerModal).toHaveAttribute('data-qa', 'popup');

    // Disclaimer message — the popup has no separate title element; the body
    // text block carries the "you are now leaving our website" message.
    await expect.soft(this.disclaimerMessage).toBeVisible();
    await expect.soft(this.disclaimerMessage).toContainText(/\S/); // Contains non-whitespace

    // Continue (primary) button
    await expect.soft(this.continueButton).toBeVisible();
    await expect
      .soft(this.continueButton)
      .toHaveAttribute('data-qa', 'link-disclaimer-primary-button');

    // Cancel (secondary) button
    await expect.soft(this.cancelButton).toBeVisible();
    await expect
      .soft(this.cancelButton)
      .toHaveAttribute('data-qa', 'link-disclaimer-secondary-button');
  }

  /**
   * Verify modal is closed/not visible
   */
  async verifyDisclaimerModalClosed(): Promise<void> {
    await expect.soft(this.disclaimerModal).toBeHidden();
  }

  /**
   * Verify URL matches expected pattern
   */
  async verifyCurrentUrl(expectedPattern: string): Promise<void> {
    const currentUrl = this.page.url();
    expect.soft(currentUrl).toContain(expectedPattern);
  }

  /**
   * Navigate modal using keyboard
   */
  async navigateModalWithKeyboard(): Promise<void> {
    // Ensure modal is visible and ready
    await this.disclaimerModal.waitFor({ state: 'visible', timeout: 5000 });

    // Click somewhere in the modal to establish focus context
    await this.disclaimerModal.click();
    await this.page.waitForTimeout(500);

    // Now tab to the first focusable element (OK button)
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(300);
    await expect.soft(this.continueButton).toBeFocused();

    // Tab to the second focusable element (Cancel button)
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(300);
    await expect.soft(this.cancelButton).toBeFocused();
  }

  /**
   * Test Escape key to close modal
   */
  async pressEscapeKey(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1000);
  }

  /**
   * Test Enter key on focused element
   */
  async pressEnterKey(): Promise<void> {
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get accessibility scan results for modal
   */
  async getAccessibilityScanResults(): Promise<any> {
    return await this.runAccessibilityScan();
  }

  /**
   * Verify ARIA attributes and semantic HTML
   */
  async verifyAccessibilityAttributes(): Promise<void> {
    // Check if modal has proper role using the correct selector
    await expect.soft(this.disclaimerOverlay).toHaveAttribute('role', 'dialog');

    // Verify semantic HTML structure
    const titleTag = await this.disclaimerTitle.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(titleTag).toBe('h2');

    // Check ARIA labels on buttons (Continue button has aria-label, Cancel may not)
    await expect.soft(this.continueButton).toHaveAttribute('aria-label');

    // Cancel button might not have aria-label - check if it has meaningful text instead
    const cancelText = await this.cancelButton.textContent();
    const hasCancelAriaLabel = await this.cancelButton.getAttribute('aria-label');

    // Either should have aria-label OR meaningful text content
    expect
      .soft(hasCancelAriaLabel !== null || (cancelText && cancelText.trim().length > 0))
      .toBeTruthy();
  }

  /**
   * Measure performance metrics
   */
  async measureModalDisplayTime(): Promise<number> {
    const startTime = Date.now();
    await this.triggerLinkDisclaimer();
    await this.disclaimerModal.waitFor({ state: 'visible' });
    return Date.now() - startTime;
  }

  /**
   * Measure button response time
   */
  async measureButtonResponseTime(buttonType: 'continue' | 'cancel'): Promise<number> {
    const button = buttonType === 'continue' ? this.continueButton : this.cancelButton;

    const startTime = Date.now();
    await button.click();

    if (buttonType === 'cancel') {
      await this.disclaimerModal.waitFor({ state: 'hidden' });
    } else {
      await this.page.waitForTimeout(1000); // Wait for navigation start
    }

    return Date.now() - startTime;
  }

  /**
   * Take screenshot for visual testing
   */
  async takeModalScreenshot(filename: string): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${filename}.png`,
      fullPage: true,
    });
  }

  /**
   * Get modal dimensions for responsive testing
   */
  async getModalDimensions(): Promise<{ width: number; height: number }> {
    const box = await this.disclaimerModal.boundingBox();
    return {
      width: box?.width || 0,
      height: box?.height || 0,
    };
  }

  /**
   * Verify no disclaimer appears (negative test)
   */
  async verifyNoDisclaimerAppears(): Promise<void> {
    await expect.soft(this.disclaimerModal).toBeHidden();
  }
}

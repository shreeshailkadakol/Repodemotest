/**
 * Component Mapper - Analytics Validation Component
 * What:
 *   Encapsulates analytics dataLayer checks for page-level and component-level
 *   validation scenarios.
 * Why:
 *   Created to keep analytics assertions reusable and maintainable instead of
 *   duplicating dataLayer logic directly inside spec files.
 */

import { Page, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

/**
 * Analytics Validation Component - User Story 2194
 *
 * Validates dataLayer variables for analytics implementation:
 * - page_referring_url: Captures referring URL without protocol/www
 * - internal_source: Captures on-site source (Entry, header navigation, etc.)
 * - visitor_type: Differentiates internal/external traffic
 *
 * DOM Structure (inspected 2026-04-10):
 * - dataLayer is a global JS array (window.dataLayer)
 * - pageview event contains all marketing variables
 * - OneTrust consent groups control tracking (C0001-C0004)
 */
export class AnalyticsValidationComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Navigate to homepage and accept cookies
   */
  async navigateToComponent(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.getComponentUrl('AnalyticsValidationComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForNetworkIdle();
  }

  /**
   * Navigate to homepage WITHOUT accepting cookies (for consent testing)
   */
  async navigateWithoutConsent(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.getComponentUrl('AnalyticsValidationComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.waitForNetworkIdle();
  }

  /**
   * Navigate with UTM parameters appended to the URL (no referrer header).
   * Used to test UTM fallback: when browser referrer is unavailable,
   * page_referring_url should be populated from UTM variables.
   */
  async navigateWithUtmParams(utmParams: Record<string, string>): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.getComponentUrl('AnalyticsValidationComponent', baseURL);
    const qs = new URLSearchParams(utmParams).toString();
    const separator = url.includes('?') ? '&' : '?';
    const fullUrl = `${url}${separator}${qs}`;
    // No Referer header — browser referrer will be empty
    await this.page.setExtraHTTPHeaders({});
    await this.navigateWithAuthentication(fullUrl);
    await this.acceptCookiesBanner();
    await this.waitForNetworkIdle();
  }

  /**
   * Navigate with a specific referrer header
   */
  async navigateWithReferrer(referrer: string): Promise<void> {
    await this.page.setExtraHTTPHeaders({ Referer: referrer });
    const baseURL = envUtils.getBaseUrl();
    const url = await this.getComponentUrl('AnalyticsValidationComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForNetworkIdle();
    // Clear the extra headers after navigation
    await this.page.setExtraHTTPHeaders({});
  }

  /**
   * Navigate to an internal page by clicking a content link matching the href pattern.
   * Uses real link clicks (preserves referrer) instead of page.goto (resets referrer).
   */
  async clickContentLink(hrefPattern: string): Promise<void> {
    const link = this.page.locator(`a[href*="${hrefPattern}"]`).first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }

  /**
   * Navigate via header navigation link (Primary navigation nav element).
   * On STG the header links are inside nav[aria-label="Primary navigation"].
   */
  async clickHeaderNavLink(hrefPattern: string): Promise<void> {
    // Ensure consent banner is dismissed before clicking navigation
    await this.dismissConsentBannerIfPresent();

    const link = this.page
      .locator('nav[aria-label="Primary navigation"]')
      .locator(`a[href*="${hrefPattern}"]`)
      .first();
    await link.click({ force: true });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }

  /**
   * Navigate via footer navigation link (Secondary footer navigation).
   */
  async clickFooterNavLink(hrefPattern: string): Promise<void> {
    // Ensure consent banner is dismissed before clicking navigation
    await this.dismissConsentBannerIfPresent();

    const link = this.page
      .locator('nav[aria-label="Secondary footer navigation"]')
      .locator(`a[href*="${hrefPattern}"]`)
      .first();
    await link.scrollIntoViewIfNeeded();
    await link.click({ force: true });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }

  /**
   * Dismiss the OneTrust consent banner if it's still visible and blocking interactions.
   */
  private async dismissConsentBannerIfPresent(): Promise<void> {
    try {
      const consentBanner = this.page.locator('#onetrust-consent-sdk');
      const isVisible = await consentBanner.isVisible().catch(() => false);
      if (isVisible) {
        const acceptBtn = this.page.locator('#onetrust-accept-btn-handler');
        const btnVisible = await acceptBtn.isVisible().catch(() => false);
        if (btnVisible) {
          await acceptBtn.click({ force: true, timeout: 3000 });
          await consentBanner.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
          await this.page.waitForTimeout(500);
        }
      }
    } catch {
      // Silently continue if banner is not present
    }
  }

  /**
   * Get the full dataLayer array
   */
  async getDataLayer(): Promise<Record<string, unknown>[]> {
    return this.page.evaluate(() => {
      return (globalThis as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer || [];
    });
  }

  /**
   * Get the latest pageview entry from dataLayer
   */
  async getPageviewEntry(): Promise<Record<string, unknown> | null> {
    return this.page.evaluate(() => {
      const dl = (globalThis as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer;
      if (!dl) return null;
      const entries = dl.filter((e) => e.event === 'pageview');
      return entries.at(-1) ?? null;
    });
  }

  /**
   * Get consent groups from dataLayer
   */
  async getConsentGroups(): Promise<{ event: string; groups: string }[]> {
    return this.page.evaluate(() => {
      const dl = (globalThis as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer;
      if (!dl) return [];
      return dl
        .filter((e) => e.OnetrustActiveGroups || e.OptanonActiveGroups)
        .map((e) => {
          let groups = '';
          if (typeof e.OnetrustActiveGroups === 'string') {
            groups = e.OnetrustActiveGroups;
          } else if (typeof e.OptanonActiveGroups === 'string') {
            groups = e.OptanonActiveGroups;
          }
          return {
            event: typeof e.event === 'string' ? e.event : '',
            groups,
          };
        });
    });
  }

  /**
   * Get event order from dataLayer (for initialization timing validation)
   */
  async getEventOrder(): Promise<{ index: number; event: string }[]> {
    return this.page.evaluate(() => {
      const dl = (globalThis as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer;
      if (!dl) return [];
      return dl
        .map((e, i) => ({ index: i, event: typeof e.event === 'string' ? e.event : '' }))
        .filter((e) => e.event);
    });
  }

  /**
   * Inject a dataLayer overlay on the page and take a screenshot
   */
  async captureDataLayerScreenshot(screenshotName: string, title: string): Promise<void> {
    const entry = await this.getPageviewEntry();
    const dl = await this.getDataLayer();

    const relevantVars = entry
      ? {
          event: entry.event,
          page_referring_url: entry.page_referring_url,
          internal_source: entry.internal_source,
          visitor_type: entry.visitor_type,
          page_path: entry.page_path,
          page_name: entry.page_name,
          page_type: entry.page_type,
          language: entry.language,
          utc_time: entry.utc_time,
        }
      : { error: 'No pageview entry found' };

    await this.page.evaluate(
      (data: { title: string; vars: Record<string, unknown>; total: number }) => {
        const overlay = document.createElement('div');
        overlay.id = 'qa-datalayer-overlay';
        overlay.style.cssText =
          'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;padding:30px;overflow:auto;font-family:monospace;color:#00ff00;';
        overlay.innerHTML =
          '<h2 style="color:#fff;font-family:sans-serif;margin-bottom:15px;">' +
          data.title +
          '</h2>' +
          '<pre style="font-size:14px;line-height:1.6;background:#111;padding:20px;border-radius:8px;border:1px solid #333;">' +
          JSON.stringify(data.vars, null, 2) +
          '</pre>' +
          '<p style="color:#aaa;margin-top:10px;font-family:sans-serif;">Total dataLayer entries: ' +
          data.total +
          '</p>';
        document.body.appendChild(overlay);
      },
      { title, vars: relevantVars, total: dl.length }
    );

    await this.takeScreenshot(screenshotName);

    await this.page.evaluate(() => {
      const el = document.getElementById('qa-datalayer-overlay');
      if (el) el.remove();
    });
  }
}

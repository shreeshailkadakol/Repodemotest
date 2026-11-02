import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator, Response, expect } from '@playwright/test';

/**
 * Error404Page - language-agnostic validation of the Bayer Beyond 404 page.
 *
 * DOM confirmed via live inspection on www.bayer.co.uk/en-gb (EN),
 * www.conosur.bayer.com/es-es (ES) and the Vercel prod-global build. Structure
 * / data-qa are identical across locales, so every check is structural /
 * attribute / href based - never text. See docs/dom-inspection-404.md.
 *
 * A 404 is reached by appending random characters to a site URL, e.g.
 *   https://<host>/<locale>/<country>/<random>
 *
 * Cross-site resilience: element lookups are NON-ABORTING (safeLocator returns
 * null instead of throwing) and every assertion is SOFT, so a site missing an
 * element (a real defect we want to catch, e.g. "footer not configured") is
 * reported without aborting the remaining checks or the other sites.
 */
export class Error404Page extends BasePage {
  private static readonly PRESENCE_TIMEOUT = 5000;

  /** Last navigation error message (for reporting when a site fails to load). */
  private lastNavError: string | null = null;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ==========================================================================
  // Navigation
  // ==========================================================================

  /**
   * Navigate to a guaranteed-404 URL derived from a site base URL.
   * Sets Vercel basic-auth for *.vercel.app hosts; handles cookie banner.
   */
  async goToNotFound(baseUrl: string): Promise<Response | null> {
    if (/vercel\.app/i.test(baseUrl)) {
      await this.context.setHTTPCredentials({ username: 'bayercorp', password: 'beyond2026' });
    }
    try {
      const resp = await this.page.goto(this.buildNotFoundUrl(baseUrl), {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
      await this.dismissCookieBanner();
      await this.page.waitForLoadState('load').catch(() => {});
      // Stabilize before element checks: wait for the error section to render
      // (kills flake where body image / links are read before they mount).
      await this.page
        .locator('[data-qa="error-page"]')
        .first()
        .waitFor({ state: 'visible', timeout: 10000 })
        .catch(() => {});
      return resp;
    } catch (e) {
      // Navigation failed (timeout / unreachable / bot-wall). Record the reason
      // and return null so the caller reports a soft failure, not a hard abort.
      this.lastNavError = (e as Error).message.split('\n')[0];
      return null;
    }
  }

  private buildNotFoundUrl(baseUrl: string): string {
    return `${baseUrl.replace(/\/+$/, '')}/qa-404-check-${Date.now().toString(36)}`;
  }

  /** Locale = first path segment (en-gb, es-es, en-US, ...). */
  private localeOf(baseUrl: string): string {
    return (new URL(baseUrl).pathname.replace(/^\/+/, '').split('/')[0] || '').trim();
  }

  private normalizePath(p: string): string {
    try {
      return decodeURIComponent(p).toLowerCase().replace(/\/+$/, '') || '/';
    } catch {
      return p.toLowerCase().replace(/\/+$/, '') || '/';
    }
  }

  /**
   * A "home" link resolves to the site's own landing path (the baseUrl
   * pathname, e.g. /en-us/bayer-united-states on the multi-tenant Vercel host)
   * OR the locale root (/en-gb on single-tenant prod). Case/slash-insensitive.
   */
  private isHomeHref(pathname: string, baseUrl: string): boolean {
    const target = this.normalizePath(pathname);
    const base = this.normalizePath(new URL(baseUrl).pathname);
    const localeRoot = this.normalizePath('/' + this.localeOf(baseUrl));
    return target === base || target === localeRoot;
  }

  private async dismissCookieBanner(): Promise<void> {
    await this.page.waitForTimeout(1500);
    for (const sel of [
      '#onetrust-accept-btn-handler',
      'button:has-text("ACCEPT COOKIES")',
      'button:has-text("Accept All")',
    ]) {
      const b = this.page.locator(sel).first();
      if (await b.isVisible().catch(() => false)) {
        await b.click().catch(() => {});
        break;
      }
    }
  }

  /**
   * Non-aborting SmartLocator: returns the located element or null (never
   * throws), with a short timeout so missing elements fail fast.
   */
  private async safeLocator(
    options: Parameters<BasePage['findSmart']>[0]
  ): Promise<Locator | null> {
    try {
      const loc = await this.findSmart({ timeout: Error404Page.PRESENCE_TIMEOUT, ...options });
      return (await loc.first().count()) > 0 ? loc.first() : null;
    } catch {
      return null;
    }
  }

  // ==========================================================================
  // Validations (all soft, all non-aborting)
  // ==========================================================================

  async verifyHttpStatus404(resp: Response | null): Promise<void> {
    expect.soft(resp?.status(), 'HTTP status should be 404').toBe(404);
  }

  /** Header Bayer logo present and its link points to the site home (/<locale>). */
  async verifyHeaderLogoLinksHome(baseUrl: string): Promise<void> {
    const logo = await this.safeLocator({
      css: 'header img[aria-label="Bayer Logo"]',
      altText: /Bayer Logo/i,
      description: 'Header Bayer logo',
    });
    expect.soft(logo, 'Header logo should be present').not.toBeNull();

    // The anchor wrapping the logo (non-throwing, no page.evaluate needed).
    const href = await this.page
      .locator('header a:has(img[aria-label="Bayer Logo"])')
      .first()
      .getAttribute('href')
      .catch(() => null);
    let resolvesHome = false;
    if (href) {
      try {
        resolvesHome = this.isHomeHref(new URL(href, this.page.url()).pathname, baseUrl);
      } catch {
        resolvesHome = false;
      }
    }
    expect.soft(resolvesHome, `Logo link should point to site home (got: ${href})`).toBe(true);
  }

  /**
   * Language selector must NOT be accessible: either absent (single-language
   * sites) or present-but-disabled. It must never be present AND enabled.
   */
  async verifyLanguageSelectorNotAccessible(): Promise<void> {
    const langBtn = await this.safeLocator({
      dataQa: 'select-language-button',
      css: '[data-qa="language-dropdown"] button, button[data-qa="select-language-button"]',
      description: 'Language selector button',
    });
    const enabled = langBtn ? await langBtn.isEnabled().catch(() => false) : false;
    expect
      .soft(enabled, 'Language selector must not be accessible (absent or disabled)')
      .toBe(false);
  }

  /** Location selector present in header and accessible (enabled). */
  async verifyLocationSelectorPresentAndEnabled(): Promise<void> {
    const locBtn = await this.safeLocator({
      dataQa: 'select-location-button',
      css: '[data-qa="location-dropdown"] button, button[data-qa="select-location-button"]',
      description: 'Location selector button',
    });
    expect.soft(locBtn, 'Location selector should be present').not.toBeNull();
    const enabled = locBtn ? await locBtn.isEnabled().catch(() => false) : false;
    expect.soft(enabled, 'Location selector should be enabled/accessible').toBe(true);
  }

  /** Body has an image inside the error section. */
  async verifyBodyImage(): Promise<void> {
    const img = await this.safeLocator({
      css: '[data-qa="error-page"] img, main img[aria-label="404 Error"]',
      altText: /404/i,
      description: 'Body 404 image',
    });
    expect.soft(img, 'Body image should be present').not.toBeNull();
  }

  /** Body has descriptive text (non-empty), language-agnostic. */
  async verifyBodyText(): Promise<void> {
    const desc = await this.safeLocator({
      dataQa: 'error-description',
      css: '[data-qa="error-description"]',
      description: 'Body error description text',
    });
    expect.soft(desc, 'Body text container should be present').not.toBeNull();
    const text = desc ? ((await desc.textContent().catch(() => '')) || '').trim() : '';
    expect.soft(text.length, 'Body text should be non-empty').toBeGreaterThan(0);
  }

  /**
   * The body links, identified by href pattern (never text):
   *   home -> site home (/<locale>), search -> contains /search,
   *   worldwide -> bayer.com global, news -> structural (internal links present).
   */
  async verifyBodyLinks(baseUrl: string): Promise<void> {
    const container = await this.safeLocator({
      dataQa: 'error-page',
      css: '[data-qa="error-page"], main',
      description: 'Error page body container (for links)',
    });
    if (!container) {
      expect.soft(container, 'Error body container should exist (for links)').not.toBeNull();
      return;
    }

    const pageUrl = this.page.url();
    const siteHost = new URL(baseUrl).host;

    const hrefs = await container
      .locator('a[href]')
      .evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href') || ''))
      .catch(() => [] as string[]);

    const resolved = hrefs
      .filter(Boolean)
      .map((h) => {
        try {
          return new URL(h, pageUrl);
        } catch {
          return null;
        }
      })
      .filter((u): u is URL => u !== null);

    const hasHome = resolved.some((u) => this.isHomeHref(u.pathname, baseUrl));
    const hasWorldwide = resolved.some((u) => /(^|\.)bayer\.com$/i.test(u.host));
    const internal = resolved.filter(
      (u) => u.host === siteHost || u.host === new URL(pageUrl).host
    );

    expect.soft(hasHome, 'Body should have a Home link to the site landing').toBe(true);
    expect.soft(hasWorldwide, 'Body should have a Bayer Worldwide link (bayer.com)').toBe(true);
    expect
      .soft(resolved.length, 'Body should have at least 4 links (home/search/worldwide/news)')
      .toBeGreaterThanOrEqual(4);
    // Search + News slugs are localized (suche, recherche, novedades, media, ...)
    // and the links carry no data-qa, so they cannot be matched by path across
    // locales. Validate structurally instead: home + search + news are internal
    // links (Bayer Worldwide is the only external one).
    expect
      .soft(internal.length, 'Body should have >=3 internal links (home + search + news)')
      .toBeGreaterThanOrEqual(3);
  }

  async verifyFooterExists(): Promise<void> {
    const footer = await this.safeLocator({
      css: 'footer',
      role: { role: 'contentinfo' },
      description: 'Page footer',
    });
    expect.soft(footer, 'Footer should exist').not.toBeNull();
  }

  async verifyPillNavigation(): Promise<void> {
    const pill = await this.safeLocator({
      dataQa: 'PillNavigation',
      testId: 'PillNavigation',
      css: 'section[data-qa="PillNavigation"], [aria-label="PillNavigation"]',
      description: 'Pill navigation',
    });
    expect.soft(pill, 'Pill navigation should be present').not.toBeNull();
  }

  /** Run every 404 validation for one site (all soft, non-aborting). */
  async validateNotFoundPage(baseUrl: string): Promise<void> {
    const resp = await this.goToNotFound(baseUrl);
    // If navigation failed (timeout / unreachable), report once and stop -
    // element checks on an unloaded page are noise.
    if (!resp) {
      expect
        .soft(
          resp,
          `Page did not load (${this.lastNavError ?? 'navigation failed/timeout'}): ${baseUrl}`
        )
        .not.toBeNull();
      return;
    }
    await this.verifyHttpStatus404(resp);
    await this.verifyHeaderLogoLinksHome(baseUrl);
    await this.verifyLanguageSelectorNotAccessible();
    await this.verifyLocationSelectorPresentAndEnabled();
    await this.verifyBodyImage();
    await this.verifyBodyText();
    await this.verifyBodyLinks(baseUrl);
    await this.verifyFooterExists();
    await this.verifyPillNavigation();
  }
}

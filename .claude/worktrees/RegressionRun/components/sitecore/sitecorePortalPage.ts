/**
 * SitecorePortalPage - Page object base for Sitecore Cloud Portal (BE) automation.
 *
 * What:
 *   A starting page object for back-end / Sitecore Cloud Portal tests. It assumes
 *   the browser context was created with a saved authenticated session
 *   (storageState = `.auth/sitecore.json`), so no login happens here.
 *
 * Why:
 *   Sitecore login uses Microsoft Entra ID SSO with Authenticator MFA, which is
 *   captured once via `npm run sitecore:auth`. Specs then reuse that session.
 *
 * Note on locators:
 *   The portal DOM has not yet been inspected live. The methods below use
 *   resilient, language-agnostic checks. When building real BE test cases,
 *   follow the framework's `playwright-dom-inspection` + `playwright-smart-locators`
 *   skills (data-qa first, SmartLocator helpers) to add concrete element actions.
 */
import { Page, expect } from '@playwright/test';

export class SitecorePortalPage {
  private readonly page: Page;
  private readonly portalUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.portalUrl = process.env.SITECORE_PORTAL_URL || 'https://portal.sitecorecloud.io/';
  }

  /** Navigate to the portal landing page (session is reused from storageState). */
  async open(): Promise<void> {
    await this.page.goto(this.portalUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  }

  /**
   * True when we are authenticated on the Sitecore portal app.
   *
   * IMPORTANT: the login page lives on `auth.sitecorecloud.io`, so a plain
   * "url contains sitecorecloud.io" check is NOT enough (it would pass on the
   * login screen too). We require the authenticated app host
   * (`portal.sitecorecloud.io`) AND the absence of any login form input.
   * If this returns false, the saved session likely expired -> re-run
   * `npm run sitecore:auth`.
   */
  async isAuthenticated(): Promise<boolean> {
    let host = '';
    try {
      host = new URL(this.page.url()).hostname;
    } catch {
      return false;
    }
    if (host !== 'portal.sitecorecloud.io') {
      return false;
    }
    const loginInput = this.page.locator(
      'input[name="username"], input[type="email"], input[name="loginfmt"], input[type="password"]'
    );
    const onLoginForm = await loginInput
      .first()
      .isVisible()
      .catch(() => false);
    return !onLoginForm;
  }

  /** Assert we have an authenticated portal session; fails with a helpful hint. */
  async assertAuthenticated(): Promise<void> {
    const authenticated = await this.isAuthenticated();
    expect(
      authenticated,
      'Expected an authenticated Sitecore portal session. ' +
        'If this fails, the saved session likely expired - run: npm run sitecore:auth'
    ).toBe(true);
  }

  /** Current page URL - handy for assertions and debugging. */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /** Page <title> once the SPA has rendered. */
  async getTitle(): Promise<string> {
    return this.page.title();
  }
}

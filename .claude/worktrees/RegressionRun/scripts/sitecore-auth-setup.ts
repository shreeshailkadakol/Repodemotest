/**
 * Sitecore Portal - One-time authenticated session capture (MFA-aware)
 *
 * What:
 *   Opens a HEADED browser to the Sitecore Cloud Portal, lets you complete the
 *   Microsoft Entra ID (Azure AD) SSO login INCLUDING the Authenticator MFA
 *   approval on your phone, then saves the authenticated session (cookies +
 *   localStorage) to `.auth/sitecore.json` so automated specs can reuse it
 *   without logging in again.
 *
 * Why:
 *   Sitecore login is protected by Microsoft Authenticator push MFA, which
 *   cannot (and should not) be scripted. The standard, secure pattern is
 *   "log in once manually, reuse the saved session". Re-run this whenever the
 *   saved session expires.
 *
 * Usage:
 *   1. Add to your .env (gitignored - never committed):
 *        SITECORE_PORTAL_URL=https://portal.sitecorecloud.io/
 *        SITECORE_USERNAME=you@valtech.com
 *        SITECORE_PASSWORD=your-password
 *   2. Run:  npm run sitecore:auth
 *   3. When the Authenticator prompt appears, approve it on your phone
 *      (match the number shown in the browser).
 *
 * Security:
 *   - Credentials are read from .env ONLY (never hardcoded / committed).
 *   - `.auth/sitecore.json` holds live session tokens -> it is gitignored.
 *   - If a credential is ever exposed, rotate it immediately.
 */
import 'dotenv/config';
import { chromium, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_DIR = path.resolve(process.cwd(), '.auth');
const STORAGE_STATE_PATH = path.join(AUTH_DIR, 'sitecore.json');

/**
 * Resolves when the page is on the authenticated portal app
 * (host = portal.sitecorecloud.io) with no visible login form. Returns false on
 * timeout. We poll because the login flow hops across several domains
 * (portal -> auth.sitecorecloud.io -> login.microsoftonline.com -> back).
 */
async function waitForAuthenticatedPortal(page: Page, timeoutMs: number): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    let host = '';
    try {
      host = new URL(page.url()).hostname;
    } catch {
      host = '';
    }

    if (host === 'portal.sitecorecloud.io') {
      // Confirm we are past the login form (no email/identifier input visible).
      const loginInput = page.locator(
        'input[name="username"], input[type="email"], input[name="loginfmt"], input[type="password"]'
      );
      const stillOnLogin = await loginInput
        .first()
        .isVisible()
        .catch(() => false);
      if (!stillOnLogin) {
        return true;
      }
    }

    await page.waitForTimeout(1500);
  }
  return false;
}

async function main(): Promise<void> {
  const portalUrl = process.env.SITECORE_PORTAL_URL || 'https://portal.sitecorecloud.io/';
  const username = process.env.SITECORE_USERNAME;
  const password = process.env.SITECORE_PASSWORD;
  // Generous window so there is time to approve the MFA push on your phone.
  const loginTimeoutMs = Number(process.env.SITECORE_LOGIN_TIMEOUT_MS || 240000);

  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  console.info('SITECORE AUTH: Launching browser for a one-time login...');
  console.info(`SITECORE AUTH: Target -> ${portalUrl}`);
  if (!username || !password) {
    console.info(
      'SITECORE AUTH: SITECORE_USERNAME / SITECORE_PASSWORD not set in .env - ' +
        'you can still type credentials manually in the browser window.'
    );
  }

  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(portalUrl, { waitUntil: 'domcontentloaded' });

  // Best-effort autofill to save typing. The login is a chain:
  //   portal -> auth.sitecorecloud.io (Auth0 email step) -> login.microsoftonline.com
  //   (password) -> Authenticator MFA (manual) -> back to portal.
  // If any selector differs, just finish the steps manually in the open window;
  // the script only waits for the authenticated end state.
  try {
    if (username) {
      // Auth0 "Email address" identifier step (auth.sitecorecloud.io)
      const auth0Email = page.locator('input[name="username"], input[type="email"], input#username');
      await auth0Email.first().waitFor({ state: 'visible', timeout: 15000 });
      await auth0Email.first().fill(username);
      await page
        .getByRole('button', { name: /continue|next/i })
        .first()
        .click()
        .catch(() => {});
    }
    if (password) {
      // Microsoft Entra ID password step (login.microsoftonline.com)
      const passwordField = page.locator('input[type="password"], input[name="passwd"]');
      await passwordField.first().waitFor({ state: 'visible', timeout: 20000 });
      await passwordField.first().fill(password);
      await page
        .getByRole('button', { name: /sign in/i })
        .first()
        .click()
        .catch(() => {});
    }
  } catch {
    console.info(
      'SITECORE AUTH: Auto-fill skipped/partial - please complete the login manually in the window.'
    );
  }

  console.info('\n========================================================');
  console.info('  ACTION REQUIRED');
  console.info('  Approve the Microsoft Authenticator prompt on your phone.');
  console.info('  (Match the number shown in the browser, if asked.)');
  console.info('  Waiting for you to land back on the Sitecore portal...');
  console.info('========================================================\n');

  // Login is complete only when we are on the AUTHENTICATED portal app
  // (host = portal.sitecorecloud.io) AND no login form is showing.
  // Note: the login page lives on auth.sitecorecloud.io, so we must NOT treat
  // any *.sitecorecloud.io URL as "logged in".
  const authenticated = await waitForAuthenticatedPortal(page, loginTimeoutMs);
  if (!authenticated) {
    console.error('SITECORE AUTH: Timed out waiting for an authenticated portal - no session saved.');
    console.error('SITECORE AUTH: Re-run and finish the login (password + MFA) within the time limit.');
    await browser.close();
    process.exit(1);
  }
  // Let the SPA settle and persist tokens to localStorage before we capture.
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  await context.storageState({ path: STORAGE_STATE_PATH });
  console.info(`SITECORE AUTH: Success - session saved to ${STORAGE_STATE_PATH}`);
  console.info('SITECORE AUTH: You can now run Sitecore specs that reuse this session.');

  await browser.close();
}

main().catch((err) => {
  console.error('SITECORE AUTH: Unexpected error:', err);
  process.exit(1);
});

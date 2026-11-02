/**
 * Sitecore Portal - verify the saved session is still valid.
 *
 * What:
 *   Loads `.auth/sitecore.json` into a fresh (headless) browser context, opens
 *   the portal, and reports whether the session is still authenticated - i.e.
 *   it lands on the portal app (portal.sitecorecloud.io) with no login form,
 *   rather than being bounced to the Auth0/Microsoft login.
 *
 * Why:
 *   Sessions expire (Entra/Auth0 policy). This is a quick health check before a
 *   test run so you know whether to re-run `npm run sitecore:auth`.
 *
 * Usage:
 *   npm run sitecore:verify
 *   Exit code 0 = session valid, 1 = missing/expired (re-auth needed).
 */
import 'dotenv/config';
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), '.auth', 'sitecore.json');

async function main(): Promise<void> {
  const portalUrl = process.env.SITECORE_PORTAL_URL || 'https://portal.sitecorecloud.io/';

  if (!fs.existsSync(STORAGE_STATE_PATH)) {
    console.error(`SITECORE VERIFY: No saved session at ${STORAGE_STATE_PATH}`);
    console.error('SITECORE VERIFY: Run "npm run sitecore:auth" to capture one.');
    process.exit(1);
  }

  console.info('SITECORE VERIFY: Loading saved session and opening the portal...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
  const page = await context.newPage();

  await page.goto(portalUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const finalUrl = page.url();
  let host = '';
  try {
    host = new URL(finalUrl).hostname;
  } catch {
    host = '';
  }

  const loginInput = page.locator(
    'input[name="username"], input[type="email"], input[name="loginfmt"], input[type="password"]'
  );
  const onLoginForm = await loginInput
    .first()
    .isVisible()
    .catch(() => false);

  const title = await page.title();
  const authenticated = host === 'portal.sitecorecloud.io' && !onLoginForm;

  console.info('--------------------------------------------------------');
  console.info(`SITECORE VERIFY: Final URL : ${finalUrl}`);
  console.info(`SITECORE VERIFY: Title     : ${title}`);
  console.info(`SITECORE VERIFY: Login form visible: ${onLoginForm}`);
  console.info('--------------------------------------------------------');

  await browser.close();

  if (authenticated) {
    console.info('SITECORE VERIFY: PASS - session is valid and authenticated.');
    process.exit(0);
  } else {
    console.error('SITECORE VERIFY: FAIL - session is missing/expired (bounced to login).');
    console.error('SITECORE VERIFY: Re-run "npm run sitecore:auth".');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('SITECORE VERIFY: Unexpected error:', err);
  process.exit(1);
});

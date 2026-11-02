/**
 * Sitecore Cloud Portal (BE) - session-reuse smoke tests.
 *
 * Prerequisite (one-time, MFA-aware):
 *   npm run sitecore:auth
 *   -> logs in manually + approves Authenticator, saves `.auth/sitecore.json`.
 *
 * These tests then reuse that saved session via `storageState`, so they run
 * without any login. When the session expires, re-run `npm run sitecore:auth`.
 */
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { SitecorePortalPage } from '../../../components/sitecore/sitecorePortalPage';

const STORAGE_STATE_PATH = path.resolve(process.cwd(), '.auth', 'sitecore.json');
const hasSession = fs.existsSync(STORAGE_STATE_PATH);

let portal: SitecorePortalPage;

test.describe('Sitecore Cloud Portal - BE session smoke', () => {
  // Skip cleanly (instead of failing) when no session has been captured yet.
  test.skip(
    !hasSession,
    'No saved Sitecore session found. Run "npm run sitecore:auth" first to capture one.'
  );

  // Reuse the authenticated session for every test in this file.
  test.use({ storageState: STORAGE_STATE_PATH });

  test.beforeEach(async ({ page }) => {
    portal = new SitecorePortalPage(page);
    await portal.open();
  });

  test('@Smoke TC-SC001: Saved session loads the portal without a login redirect', async () => {
    await portal.assertAuthenticated();
    expect(portal.getCurrentUrl(), 'Should be on a sitecorecloud.io page').toContain(
      'sitecorecloud.io'
    );
  });

  test('@Smoke TC-SC002: Portal page renders a title', async () => {
    const title = await portal.getTitle();
    console.log(`Sitecore portal title: ${title}`);
    expect.soft(title.length, 'Portal page should have a non-empty title').toBeGreaterThan(0);
  });
});

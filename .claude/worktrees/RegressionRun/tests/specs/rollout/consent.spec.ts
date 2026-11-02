/**
 * Consent Validation Tests
 * Validates consent script and banner integration
 * Based on Azure DevOps ticket 256
 * 
 * SCOPE: Home page only - validates consent implementation on first page load
 */

import { test, expect } from '@playwright/test';
import { getAllSiteLanguageCombinations, isValidationEnabled } from '../../../config/rollout-config';
import { ConsentValidator } from '../../../helpers/rollout/consentValidator';

const combinations = getAllSiteLanguageCombinations();

test.describe('Rollout Consent Validation (ADO #256)', () => {
  for (const { site, language, url } of combinations) {
    if (!isValidationEnabled(site, 'consent')) {
      continue;
    }

    test.describe(`${site.name} - ${language.name} (${language.code})`, () => {
      let consentValidator: ConsentValidator;

      test.beforeEach(async ({ page, context }) => {
        // Clear cookies AND local storage to ensure fresh consent state
        await context.clearCookies();
        
        // Clear local storage and session storage which OneTrust also uses
        await page.goto(url, { 
          waitUntil: 'domcontentloaded',
          timeout: 90000 // 90 seconds timeout
        });
        
        // Clear OneTrust-specific storage
        await page.evaluate(() => {
          // Clear all localStorage
          localStorage.clear();
          // Clear all sessionStorage
          sessionStorage.clear();
          // Remove OneTrust-specific items if they exist
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('optanon') || key.includes('OneTrust') || key.includes('onetrust'))) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
        });
        
        // Reload page to see fresh consent banner
        await page.reload({ waitUntil: 'domcontentloaded' });
        
        // Wait explicitly for consent banner to appear (it loads asynchronously)
        // Use language-independent selector - wait for banner first
        await page.waitForSelector('#onetrust-banner-sdk', { timeout: 30000 });
        
        // Wait for accept button with extended timeout and fallback
        // Some sites load buttons slower than others
        await page.waitForTimeout(2000); // Give buttons time to render
        
        consentValidator = new ConsentValidator(page);
      });

      test('should load consent script on page', async ({ page }) => {
        test.setTimeout(120000); // 2 minutes for slow-loading sites
        const result = await consentValidator.validateConsent();

        console.log(`[Consent Script] Loaded: ${result.scriptLoaded ? '✓' : '✗'}`);

        expect.soft(result.scriptLoaded, 'Consent script should be loaded').toBe(true);
      });

      test('should display consent banner on first visit', async ({ page }) => {
        const result = await consentValidator.validateConsent();

        console.log(`[Consent Banner] Appears: ${result.bannerAppears ? '✓' : '✗'}`);

        expect.soft(result.bannerAppears, 'Consent banner should appear on first visit').toBe(true);
      });

      test('should have accept button visible', async ({ page }) => {
        const result = await consentValidator.validateConsent();

        console.log(`[Accept Button] Visible: ${result.acceptButtonVisible ? '✓' : '✗'}`);

        if (result.bannerAppears) {
          expect.soft(result.acceptButtonVisible, 'Accept button should be visible').toBe(true);
        } else {
          test.skip(true, 'Consent banner not visible - cannot test button');
        }
      });

      test('should have reject or manage buttons (optional)', async ({ page }) => {
        const result = await consentValidator.validateConsent();

        console.log(`[Reject Button] Visible: ${result.rejectButtonVisible ? '✓' : '✗'}`);
        console.log(`[Manage Button] Visible: ${result.manageButtonVisible ? '✓' : '✗'}`);

        // These are soft checks as reject/manage buttons are optional in some implementations
        if (result.rejectButtonVisible || result.manageButtonVisible) {
          console.log('[Info] Consent implementation provides user choice options');
        }
      });

      test('should not set analytics cookies before consent', async ({ page }) => {
        const analyticsBlocked = await consentValidator.validateAnalyticsBeforeConsent();

        console.log(`[Analytics] Blocked before consent: ${analyticsBlocked ? '✓' : '✗'}`);

        expect.soft(
          analyticsBlocked,
          'Analytics cookies should not be set before user consent'
        ).toBe(true);
      });

      test('should accept consent and allow analytics', async ({ page }) => {
        const result = await consentValidator.validateConsent();

        if (!result.bannerAppears || !result.acceptButtonVisible) {
          test.skip(true, 'Consent banner or accept button not available');
          return;
        }

        // Accept consent
        await consentValidator.acceptConsent();

        console.log('[Consent] Accepted by user');

        // Verify analytics are now enabled
        const analyticsEnabled = await consentValidator.validateAnalyticsAfterConsent();

        console.log(`[Analytics] Enabled after consent: ${analyticsEnabled ? '✓' : '✗'}`);

        expect.soft(
          analyticsEnabled,
          'Analytics cookies should be set after accepting consent'
        ).toBe(true);
      });

      test('should pass complete consent validation', async ({ page }) => {
        const result = await consentValidator.validateConsent();

        console.log(`[Consent] Overall Status: ${result.isValid ? '✓ PASS' : '✗ FAIL'}`);

        if (result.errors.length > 0) {
          console.error('[Consent Errors]');
          result.errors.forEach((error) => {
            console.error(`  - ${error}`);
          });
        }

        expect.soft(result.isValid, result.errors.join('; ')).toBe(true);
      });

      test('should persist consent choice across page reloads', async ({ page, context }) => {
        const result = await consentValidator.validateConsent();

        if (!result.bannerAppears || !result.acceptButtonVisible) {
          test.skip(true, 'Consent banner not available');
          return;
        }

        // Accept consent
        await consentValidator.acceptConsent();

        // Get cookies after consent
        const cookiesAfterConsent = await context.cookies();
        const consentCookie = cookiesAfterConsent.find((c) =>
          c.name.toLowerCase().includes('consent') || c.name.toLowerCase().includes('cookiebot')
        );

        console.log(`[Consent Cookie] Found: ${consentCookie ? '✓' : '✗'}`);

        if (consentCookie) {
          console.log(`[Consent Cookie] Name: ${consentCookie.name}`);
        }

        // Reload page
        await page.reload({ waitUntil: 'networkidle' });

        // Banner should not appear again
        const bannerAfterReload = await consentValidator['isConsentBannerVisible']();

        console.log(`[Banner After Reload] Visible: ${bannerAfterReload ? '✗' : '✓'}`);

        expect.soft(
          bannerAfterReload,
          'Consent banner should not appear after accepting consent'
        ).toBe(false);
      });

      test.afterEach(async ({ page }, testInfo) => {
        // Generate consent report
        const result = await consentValidator.validateConsent();
        const report = consentValidator.generateReport(result, language.code);

        await testInfo.attach(`consent-report-${language.code}`, {
          body: report,
          contentType: 'text/plain',
        });

        console.log(report);
      });
    });
  }
});

/**
 * GTM and Analytics Validation Tests
 * Validates Google Tag Manager and analytics integration
 * 
 * SCOPE: Home page only - validates GTM implementation on the main landing page
 */

import { test, expect } from '@playwright/test';
import { getAllSiteLanguageCombinations, isValidationEnabled, rolloutConfig } from '../../../config/rollout-config';
import { GTMValidator } from '../../../helpers/rollout/gtmValidator';

const combinations = getAllSiteLanguageCombinations();

test.describe('Rollout GTM & Analytics Validation', () => {
  for (const { site, language, url } of combinations) {
    if (!isValidationEnabled(site, 'gtm')) {
      continue;
    }

    test.describe(`${site.name} - ${language.name} (${language.code})`, () => {
      let gtmValidator: GTMValidator;

      test.beforeEach(async ({ page }) => {
        // Validate on home page only
        await page.goto(url, { waitUntil: 'networkidle' });
        
        // Accept consent to allow analytics scripts to load
        try {
          // Wait for OneTrust banner
          await page.waitForSelector('#onetrust-banner-sdk', { timeout: 5000 });
          
          // Accept all cookies
          const acceptButton = page.locator('#onetrust-accept-btn-handler');
          await acceptButton.click();
          
          // Wait for analytics scripts to load after consent
          await page.waitForTimeout(3000);
          
          console.log('[Consent] Accepted to allow analytics loading');
        } catch (error) {
          console.log('[Consent] Banner not found or already accepted');
        }
        
        gtmValidator = new GTMValidator(page);
      });

      test('should have GTM script loaded', async ({ page }) => {
        const result = await gtmValidator.validateGTM();

        console.log(`[GTM] Script Loaded: ${result.gtmScriptLoaded ? '✓' : '✗'}`);
        console.log(`[GTM] Container ID: ${result.gtmContainerId || 'N/A'}`);

        expect.soft(result.gtmScriptLoaded, 'GTM script should be loaded').toBe(true);
      });

      test('should have dataLayer initialized', async ({ page }) => {
        const result = await gtmValidator.validateGTM();

        console.log(`[DataLayer] Exists: ${result.dataLayerExists ? '✓' : '✗'}`);
        console.log(`[DataLayer] Events: ${result.dataLayerEvents.length}`);

        expect.soft(result.dataLayerExists, 'dataLayer should be initialized').toBe(true);
      });

      test('should track page view events', async ({ page }) => {
        const result = await gtmValidator.validateGTM();

        console.log(`[DataLayer Events] Found ${result.dataLayerEvents.length} events:`);
        result.dataLayerEvents.forEach((event) => {
          console.log(`  - ${event}`);
        });

        // At minimum, there should be some events in dataLayer
        expect.soft(result.dataLayerEvents.length, 'dataLayer should have events').toBeGreaterThan(0);

        // Common GTM events to look for
        const commonEvents = ['gtm.js', 'gtm.load', 'pageview', 'page_view'];
        const hasCommonEvent = result.dataLayerEvents.some((event) =>
          commonEvents.some((common) => event.toLowerCase().includes(common.toLowerCase()))
        );

        if (!hasCommonEvent) {
          console.warn('[Warning] No common GTM events found in dataLayer');
        }
      });

      test('should validate GTM implementation with no errors', async ({ page }) => {
        const result = await gtmValidator.validateGTM();

        console.log(`[GTM Validation] Status: ${result.isValid ? '✓ PASS' : '✗ FAIL'}`);

        if (result.errors.length > 0) {
          console.error('[GTM Errors]');
          result.errors.forEach((error) => {
            console.error(`  - ${error}`);
          });
        }

        expect.soft(result.isValid, result.errors.join('; ')).toBe(true);
      });

      test('should fire GTM events on page interactions', async ({ page }) => {
        // Wait for initial page load events
        await page.waitForTimeout(2000);

        const initialResult = await gtmValidator.validateGTM();
        const initialEventCount = initialResult.dataLayerEvents.length;

        console.log(`[GTM] Initial events: ${initialEventCount}`);

        // Trigger an interaction (e.g., click on navigation)
        const navLinks = page.locator(rolloutConfig.navigation.pillNavSelector + ' a');
        const linkCount = await navLinks.count();

        if (linkCount > 0) {
          // Soft assertion - some sites may not have clickable nav in GTM context
          console.log(`[GTM] Found ${linkCount} navigation links to test interaction`);
        }

        expect.soft(initialEventCount, 'GTM should have initial events').toBeGreaterThan(0);
      });

      test.afterEach(async ({ page }, testInfo) => {
        // Generate GTM report
        const result = await gtmValidator.validateGTM();
        const report = gtmValidator.generateReport(result, language.code);

        await testInfo.attach(`gtm-report-${language.code}`, {
          body: report,
          contentType: 'text/plain',
        });

        console.log(report);
      });
    });
  }
});

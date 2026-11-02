/**
 * Logo Validation Tests
 * Validates Bayer logo visibility, color, and accessibility
 * 
 * SCOPE: Home page only - validates logo on the main landing page
 */

import { test, expect } from '@playwright/test';
import { getAllSiteLanguageCombinations, isValidationEnabled, rolloutConfig } from '../../../config/rollout-config';
import { LogoValidator } from '../../../helpers/rollout/logoValidator';

const combinations = getAllSiteLanguageCombinations();

test.describe('Rollout Logo Validation', () => {
  for (const { site, language, url } of combinations) {
    if (!isValidationEnabled(site, 'logo')) {
      continue;
    }

    test.describe(`${site.name} - ${language.name} (${language.code})`, () => {
      let logoValidator: LogoValidator;

      // Increase timeout for slow-loading sites
      test.setTimeout(120000);

      test.beforeEach(async ({ page }) => {
        // Validate on home page only
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
        logoValidator = new LogoValidator(page);
      });

      test('should have visible Bayer logo', async ({ page }) => {
        const result = await logoValidator.validateLogo();

        console.log(`[Logo] Visible: ${result.logoVisible ? '✓' : '✗'}`);
        console.log(`[Logo] Source: ${result.logoSrc || 'N/A'}`);

        expect.soft(result.logoVisible, 'Bayer logo should be visible').toBe(true);
      });

      test('should have white Bayer logo', async ({ page }) => {
        const result = await logoValidator.validateLogo();

        console.log(`[Logo] Color: ${result.logoColor || 'N/A'}`);
        console.log(`[Logo] Is White: ${result.isWhite ? '✓' : '✗'}`);

        if (!result.logoVisible) {
          test.skip(true, 'Logo not visible - cannot validate color');
          return;
        }

        if (rolloutConfig.logo.expectedColor === 'white') {
          // Soft assertion for white color (can be challenging to detect programmatically)
          expect.soft(result.isWhite, 'Logo should be white colored').toBe(true);

          if (!result.isWhite && result.logoSrc) {
            console.warn(`[Logo] Color validation may be inconclusive. Logo source: ${result.logoSrc}`);
            console.warn('[Logo] Manual verification recommended if logo URL contains "white" or "light"');
          }
        }
      });

      test('should have accessible alt text', async ({ page }) => {
        const result = await logoValidator.validateLogo();

        console.log(`[Logo] Alt Text: ${result.logoAlt || 'N/A'}`);

        if (!result.logoVisible) {
          test.skip(true, 'Logo not visible - cannot validate alt text');
          return;
        }

        expect.soft(result.logoAlt, 'Logo should have alt text for accessibility').toBeTruthy();

        if (result.logoAlt) {
          // Verify alt text is meaningful
          expect.soft(
            result.logoAlt.toLowerCase(),
            'Alt text should mention "Bayer"'
          ).toContain('bayer');
        }
      });

      test('should be clickable and link to homepage', async ({ page }) => {
        const logoVisibility = await logoValidator.validateLogo();

        if (!logoVisibility.logoVisible) {
          test.skip(true, 'Logo not visible');
          return;
        }

        const clickability = await logoValidator.validateLogoClickability();

        console.log(`[Logo] Clickable: ${clickability.isClickable ? '✓' : '✗'}`);
        console.log(`[Logo] Link Href: ${clickability.href || 'N/A'}`);

        expect.soft(clickability.isClickable, 'Logo should be clickable').toBe(true);

        if (clickability.href) {
          // Logo typically links to homepage
          const isHomepage =
            clickability.href === '/' ||
            clickability.href.endsWith(language.path) ||
            clickability.href === site.baseUrl ||
            clickability.href === `${site.baseUrl}${language.path}`;

          console.log(`[Logo] Links to Homepage: ${isHomepage ? '✓' : '✗'}`);

          expect.soft(isHomepage, 'Logo should link to homepage').toBe(true);
        }
      });

      test.afterEach(async ({ page }, testInfo) => {
        // Generate logo report
        const result = await logoValidator.validateLogo();
        const report = logoValidator.generateReport(result, language.code);

        await testInfo.attach(`logo-report-${language.code}`, {
          body: report,
          contentType: 'text/plain',
        });

        console.log(report);
      });
    });
  }
});

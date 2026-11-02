/**
 * Navigation Validation Tests
 * Validates pill navigation, menu navigation, and footer links across all sites and languages
 */

import { test, expect } from '@playwright/test';
import { getAllSiteLanguageCombinations, isValidationEnabled } from '../../../config/rollout-config';
import { LinkValidator } from '../../../helpers/rollout/linkValidator';

const combinations = getAllSiteLanguageCombinations();

test.describe('Rollout Navigation Validation', () => {
  // Run tests for each site-language combination
  for (const { site, language, url } of combinations) {
    // Skip if navigation validation is disabled for this site
    if (!isValidationEnabled(site, 'navigation')) {
      continue;
    }

    test.describe(`${site.name} - ${language.name} (${language.code})`, () => {
      let linkValidator: LinkValidator;

      // Timeout for navigation validation
      test.setTimeout(120000);

      test.beforeEach(async ({ page }) => {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
        linkValidator = new LinkValidator(page);
        
        // Accept cookies before validation
        await linkValidator.acceptCookies();
      });

      test('should validate pill navigation links are visible and clickable', async ({ page }) => {
        const results = await linkValidator.validatePillNavigationLinks();

        // All links should be valid (no 404/500 errors)
        const validLinks = results.filter((r) => r.isValid);
        const brokenLinks = results.filter((r) => !r.isValid);

        console.log(`[Pill Nav] Total links: ${results.length}`);
        console.log(`[Pill Nav] Valid links: ${validLinks.length}`);
        console.log(`[Pill Nav] Broken links: ${brokenLinks.length}`);

        // Ensure at least some items were validated (prevent false positives)
        expect(results.length, 'No pill navigation items were validated - test may have failed silently').toBeGreaterThan(0);

        if (brokenLinks.length > 0) {
          console.error(linkValidator.generateBrokenLinksReport());
        }

        expect(brokenLinks, `Found ${brokenLinks.length} broken pill navigation links`).toHaveLength(0);
      });

      test('should validate menu navigation links are visible and clickable', async ({ page }) => {
        const results = await linkValidator.validateMenuNavigationLinks();

        const validLinks = results.filter((r) => r.isValid);
        const brokenLinks = results.filter((r) => !r.isValid);

        // Detect menu entries rendered as links but with no navigable URL.
        const phantomLinks = await linkValidator.detectPhantomMenuLinks();

        console.log(`[Menu Nav] Total links: ${results.length}`);
        console.log(`[Menu Nav] Valid links: ${validLinks.length}`);
        console.log(`[Menu Nav] Broken links: ${brokenLinks.length}`);
        console.log(`[Menu Nav] Phantom links (no URL): ${phantomLinks.length}`);

        // Ensure at least some links were validated (prevent false positives)
        expect(results.length, 'No menu navigation links were validated - test may have failed silently').toBeGreaterThan(0);

        if (brokenLinks.length > 0) {
          console.error(linkValidator.generateBrokenLinksReport());
        }

        if (phantomLinks.length > 0) {
          console.error(
            `[Menu Nav] Phantom links rendered without a URL:\n` +
              phantomLinks
                .map((p, i) => `  ${i + 1}. "${p.text}" (<${p.tag.toLowerCase()}>) - ${p.reason}`)
                .join('\n')
          );
        }

        expect(brokenLinks, `Found ${brokenLinks.length} broken menu navigation links`).toHaveLength(0);

        expect(
          phantomLinks,
          `Found ${phantomLinks.length} phantom menu navigation link(s) rendered without a URL (not clickable as links): ` +
            phantomLinks.map((p) => `"${p.text}"`).join(', ')
        ).toHaveLength(0);
      });

      test('should validate utility links (language/location selectors, contact) return 200', async ({ page }) => {
        // Content-driven: discovers the utility controls dynamically, so the same
        // script validates language selector, location selector and the contact
        // link across all sites/locales without hardcoded URLs. Behavioural
        // option validation (clicking each option) is heavier, so allow longer.
        test.setTimeout(300000);
        const { results, detected } = await linkValidator.validateUtilityLinks();

        const brokenLinks = results.filter((r) => !r.isValid);

        console.log(
          `[Utility] Detected -> language: ${detected.languageSelector}, location: ${detected.locationSelector}, contact: ${detected.contact}`
        );
        console.log(`[Utility] Total utility links: ${results.length}`);
        console.log(`[Utility] Valid (200): ${results.length - brokenLinks.length}`);
        console.log(`[Utility] Broken: ${brokenLinks.length}`);

        // Skip sites without a flyout utility bar (no utility links present).
        if (results.length === 0) {
          test.skip(true, 'No utility links found for this site');
          return;
        }

        if (brokenLinks.length > 0) {
          console.error(linkValidator.generateBrokenLinksReport());
        }

        // Every utility link (Contact + language/location option links) must
        // resolve to a successful response.
        expect(
          brokenLinks,
          `Found ${brokenLinks.length} utility link(s) not returning 200: ` +
            brokenLinks
              .map((b) => `"${b.text}" -> ${b.href} (${b.statusCode ?? b.errorMessage})`)
              .join(', ')
        ).toHaveLength(0);
      });

      test('should validate footer links are visible and clickable', async ({ page }) => {
        const results = await linkValidator.validateFooterLinks();

        const validLinks = results.filter((r) => r.isValid);
        const brokenLinks = results.filter((r) => !r.isValid);

        // Detect footer entries rendered as links but with no navigable URL.
        const phantomLinks = await linkValidator.detectPhantomFooterLinks();

        console.log(`[Footer] Total links: ${results.length}`);
        console.log(`[Footer] Valid links: ${validLinks.length}`);
        console.log(`[Footer] Broken links: ${brokenLinks.length}`);
        console.log(`[Footer] Phantom links (no URL): ${phantomLinks.length}`);

        // Ensure at least some links were validated (prevent false positives)
        expect(results.length, 'No footer links were validated - test may have failed silently').toBeGreaterThan(0);

        if (brokenLinks.length > 0) {
          console.error(linkValidator.generateBrokenLinksReport());
        }

        if (phantomLinks.length > 0) {
          console.error(
            `[Footer] Phantom links rendered without a URL:\n` +
              phantomLinks
                .map((p, i) => `  ${i + 1}. "${p.text}" (<${p.tag.toLowerCase()}>) - ${p.reason}`)
                .join('\n')
          );
        }

        expect(brokenLinks, `Found ${brokenLinks.length} broken footer links`).toHaveLength(0);

        expect(
          phantomLinks,
          `Found ${phantomLinks.length} phantom footer link(s) rendered without a URL (not clickable as links): ` +
            phantomLinks.map((p) => `"${p.text}"`).join(', ')
        ).toHaveLength(0);
      });

      test('should validate external links without cross-domain failures', async ({ page }) => {
        const results = await linkValidator.validateMenuNavigationLinks();
        const externalLinks = results.filter((r) => r.isExternal);

        console.log(`[External Links] Total: ${externalLinks.length}`);

        // External links should be reachable (soft assertion to avoid blocking on third-party failures)
        const brokenExternal = externalLinks.filter((r) => !r.isValid);
        if (brokenExternal.length > 0) {
          console.warn(`[External Links] ${brokenExternal.length} external links failed validation (non-blocking)`);
          console.warn(linkValidator.generateBrokenLinksReport());
        }

        // Hard assertion for internal links only
        const internalBroken = results.filter((r) => !r.isExternal && !r.isValid);
        expect(internalBroken, `Found ${internalBroken.length} broken internal links`).toHaveLength(0);
      });

      test('should validate hreflang URLs are reachable', async ({ page }) => {
        const results = await linkValidator.validateHreflangUrls();

        if (results.length === 0) {
          test.skip(true, 'No hreflang tags found');
          return;
        }

        const brokenUrls = results.filter((r) => !r.isValid);

        console.log(`[Hreflang] Total URLs: ${results.length}`);
        console.log(`[Hreflang] Valid URLs: ${results.length - brokenUrls.length}`);
        console.log(`[Hreflang] Broken URLs: ${brokenUrls.length}`);

        if (brokenUrls.length > 0) {
          console.error(linkValidator.generateBrokenLinksReport());
        }

        expect(brokenUrls, `Found ${brokenUrls.length} broken hreflang URLs`).toHaveLength(0);
      });

      test.afterEach(async ({ page }, testInfo) => {
        // Generate broken links report on failure
        if (testInfo.status === 'failed') {
          const report = linkValidator.generateBrokenLinksReport();
          await testInfo.attach('broken-links-report', {
            body: report,
            contentType: 'text/plain',
          });
        }
      });
    });
  }
});

/**
 * Indexing Validation Tests (ADO #2583)
 * =====================================
 * Validates search-engine indexing configuration for every rollout
 * site/language: robots.txt, sitemap.xml, and on-page meta robots.
 *
 * SCOPE
 *  - Home page only. Each site+language URL from rolloutConfig is loaded once;
 *    robots.txt and sitemap.xml are fetched from the site ROOT (site.baseUrl),
 *    not from per-language paths.
 *  - Data-driven: getAllSiteLanguageCombinations() generates one test block per
 *    site/language; sites with indexing validation disabled are skipped.
 *  - All assertions are SOFT (expect.soft) so a single run reports EVERY issue
 *    instead of stopping at the first failure.
 *
 * WHAT IS VALIDATED (6 checks per site/language)
 *  1. robots.txt accessible - exists at site root and parses without errors.
 *  2. Allows crawling        - robots.txt does not block all crawlers
 *                              (no blanket "User-agent: * / Disallow: /").
 *  3. Sitemap referenced     - robots.txt contains a Sitemap: line and that URL
 *                              is absolute (https).
 *  4. Valid sitemap.xml      - sitemap exists, contains at least one URL
 *                              (urlCount > 0) and has no errors.
 *  5. Meta robots tags       - page <meta name="robots"> marks it indexable
 *                              (not noindex) with no errors.
 *  6. Complete validation    - aggregate result.isValid passes; logs all
 *                              robots.txt / sitemap / meta-robots errors together.
 */

import { test, expect } from '@playwright/test';
import { getAllSiteLanguageCombinations, isValidationEnabled } from '../../../config/rollout-config';
import { IndexingValidator } from '../../../helpers/rollout/indexingValidator';

const combinations = getAllSiteLanguageCombinations();

test.describe('Rollout Indexing Validation (ADO #2583)', () => {
  for (const { site, language, url } of combinations) {
    if (!isValidationEnabled(site, 'indexing')) {
      continue;
    }

    test.describe(`${site.name} - ${language.name} (${language.code})`, () => {
      let indexingValidator: IndexingValidator;

      // Increase timeout for slow-loading sites
      test.setTimeout(120000);

      test.beforeEach(async ({ page }) => {
        // Validate on home page only
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
        indexingValidator = new IndexingValidator(page);
      });

      test('should have accessible robots.txt file', async ({ page }) => {
        const result = await indexingValidator.validateIndexing(site.baseUrl);

        console.log(`[robots.txt] Exists: ${result.robotsTxt.exists ? '✓' : '✗'}`);
        console.log(`[robots.txt] Allows Crawling: ${result.robotsTxt.allowsCrawling ? '✓' : '✗'}`);

        expect.soft(result.robotsTxt.exists, 'robots.txt should exist').toBe(true);
        expect.soft(result.robotsTxt.errors.length, result.robotsTxt.errors.join('; ')).toBe(0);
      });

      test('should allow search engine crawling', async ({ page }) => {
        const result = await indexingValidator.validateIndexing(site.baseUrl);

        console.log(`[Crawling] Allowed: ${result.robotsTxt.allowsCrawling ? '✓' : '✗'}`);

        if (result.robotsTxt.content) {
          const disallowAll = result.robotsTxt.content.match(/User-agent: \*\s+Disallow: \//i);
          if (disallowAll) {
            console.warn('[Warning] robots.txt is blocking all crawlers');
          }
        }

        expect.soft(
          result.robotsTxt.allowsCrawling,
          'robots.txt should allow search engine crawling'
        ).toBe(true);
      });

      test('should reference sitemap in robots.txt', async ({ page }) => {
        const result = await indexingValidator.validateIndexing(site.baseUrl);

        console.log(`[robots.txt] Sitemap URL: ${result.robotsTxt.sitemapUrl || 'N/A'}`);

        expect.soft(result.robotsTxt.sitemapUrl, 'robots.txt should contain sitemap URL').toBeTruthy();

        if (result.robotsTxt.sitemapUrl) {
          // Verify sitemap URL is valid
          expect.soft(result.robotsTxt.sitemapUrl, 'Sitemap URL should be absolute').toMatch(/^https?:\/\//);
        }
      });

      test('should have valid sitemap.xml with URLs', async ({ page }) => {
        const result = await indexingValidator.validateIndexing(site.baseUrl);

        console.log(`[sitemap.xml] Exists: ${result.sitemap.exists ? '✓' : '✗'}`);
        console.log(`[sitemap.xml] URL Count: ${result.sitemap.urlCount}`);

        expect.soft(result.sitemap.exists, 'sitemap.xml should exist').toBe(true);
        expect.soft(result.sitemap.urlCount, 'Sitemap should contain URLs').toBeGreaterThan(0);
        expect.soft(result.sitemap.errors.length, result.sitemap.errors.join('; ')).toBe(0);
      });

      test('should have sitemap URLs matching this site', async () => {
        const match = await indexingValidator.validateSitemapUrlsMatchSite(site.baseUrl);

        console.log(`[sitemap match] ${match.matchingCount}/${match.totalLocs} URLs belong to this site`);
        match.sample.forEach((u) => console.log(`  sample: ${u}`));

        expect
          .soft(
            match.matchingCount,
            `Sitemap should contain URLs for this site. ${match.errors.join('; ')}`
          )
          .toBeGreaterThan(0);
      });

      test('should have proper meta robots tags', async ({ page }) => {
        const result = await indexingValidator.validateIndexing(site.baseUrl);

        console.log(`[Meta Robots] Tag: ${result.metaRobots.tag || 'Not specified'}`);
        console.log(`[Meta Robots] Indexable: ${result.metaRobots.isIndexable ? '✓' : '✗'}`);

        // Page should be indexable (not marked as noindex)
        expect.soft(result.metaRobots.isIndexable, 'Page should be indexable').toBe(true);

        if (result.metaRobots.errors.length > 0) {
          console.error('[Meta Robots Errors]');
          result.metaRobots.errors.forEach((error) => {
            console.error(`  - ${error}`);
          });
        }

        expect.soft(result.metaRobots.errors.length, 'Meta robots should have no errors').toBe(0);
      });

      test('should pass complete indexing validation', async ({ page }) => {
        const result = await indexingValidator.validateIndexing(site.baseUrl);

        console.log(`[Indexing] Overall Status: ${result.isValid ? '✓ PASS' : '✗ FAIL'}`);

        // Collect all errors
        const allErrors = [
          ...result.robotsTxt.errors,
          ...result.sitemap.errors,
          ...result.metaRobots.errors,
        ];

        if (allErrors.length > 0) {
          console.error('[Indexing Errors]');
          allErrors.forEach((error) => {
            console.error(`  - ${error}`);
          });
        }

        expect.soft(result.isValid, 'Complete indexing validation should pass').toBe(true);
      });

      test.afterEach(async ({ page }, testInfo) => {
        // Generate indexing report
        const result = await indexingValidator.validateIndexing(site.baseUrl);
        const report = indexingValidator.generateReport(result, language.code);

        await testInfo.attach(`indexing-report-${language.code}`, {
          body: report,
          contentType: 'text/plain',
        });

        console.log(report);
      });
    });
  }
});

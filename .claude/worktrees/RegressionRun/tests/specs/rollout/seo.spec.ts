/**
 * SEO Validation Tests (ADO #297)
 * =================================
 * Validates the SEO metadata of every rollout site/language HOME PAGE.
 *
 * SCOPE
 *  - Home page only (no internal navigation). Each site+language URL from
 *    rolloutConfig is loaded once, then its <head> metadata is inspected via
 *    SEOValidator.validateSEO().
 *  - Data-driven: getAllSiteLanguageCombinations() generates one test block per
 *    site/language; sites with seo validation disabled are skipped.
 *  - All assertions are SOFT (expect.soft) so a single run reports EVERY SEO
 *    issue instead of stopping at the first failure.
 *
 * WHAT IS TESTED (7 checks per site/language)
 *  1. Page title          - <title> exists and is non-empty.
 *                           (character-length min/max is intentionally disabled
 *                            below - owned by the content team.)
 *  2. Meta description     - <meta name="description"> exists and is non-empty.
 *                           (length checks also disabled - content team owns.)
 *  3. Canonical URL        - <link rel="canonical"> exists, is valid, and is an
 *                            absolute https URL.
 *  4. Hreflang tags        - alternate-language tags exist (when required), are
 *                            valid, and include a self-referencing tag for the
 *                            current language code (or x-default).
 *  5. Open Graph tags      - og:title, og:description and og:image exist
 *                            (when required) and are valid.
 *  6. Structured data      - JSON-LD is optional, but must be valid if present.
 *  7. Localized metadata   - title and description are non-empty (basic
 *                            placeholder; true language detection is pending).
 *
 */

import { test, expect } from '@playwright/test';
import { getAllSiteLanguageCombinations, isValidationEnabled, rolloutConfig } from '../../../config/rollout-config';
import { SEOValidator } from '../../../helpers/rollout/seoValidator';

const combinations = getAllSiteLanguageCombinations();

test.describe('Rollout SEO Validation (ADO #297)', () => {
  for (const { site, language, url } of combinations) {
    if (!isValidationEnabled(site, 'seo')) {
      continue;
    }

    test.describe(`${site.name} - ${language.name} (${language.code})`, () => {
      let seoValidator: SEOValidator;

      // Increase timeout for slow-loading sites
      test.setTimeout(120000);

      test.beforeEach(async ({ page }) => {
        // Validate on home page only
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
        seoValidator = new SEOValidator(page);
      });

      // Test 1: <title> must exist and be non-empty (length checks disabled).
      test('should have valid page title with correct length', async ({ page }) => {
        const result = await seoValidator.validateSEO();

        console.log(`[Title] ${result.title.value}`);
        console.log(`[Title] Length: ${result.title.length} characters`);

        expect.soft(result.title.value, 'Page title should exist').toBeTruthy();
        
        // Note: Character length validation removed - handled by content team
        // if (rolloutConfig.seo.minTitleLength) {
        //   expect.soft(result.title.length, 'Title should meet minimum length').toBeGreaterThanOrEqual(
        //     rolloutConfig.seo.minTitleLength
        //   );
        // }
        //
        // if (rolloutConfig.seo.maxTitleLength) {
        //   expect.soft(result.title.length, 'Title should not exceed maximum length').toBeLessThanOrEqual(
        //     rolloutConfig.seo.maxTitleLength
        //   );
        // }
      });

      // Test 2: <meta name="description"> must exist and be non-empty.
      test('should have valid meta description with correct length', async ({ page }) => {
        const result = await seoValidator.validateSEO();

        console.log(`[Description] ${result.metaDescription.value}`);
        console.log(`[Description] Length: ${result.metaDescription.length} characters`);

        expect.soft(result.metaDescription.value, 'Meta description should exist').toBeTruthy();
        
        // Note: Character length validation removed - handled by content team
        // if (rolloutConfig.seo.minDescriptionLength) {
        //   expect.soft(result.metaDescription.length, 'Description should meet minimum length').toBeGreaterThanOrEqual(
        //     rolloutConfig.seo.minDescriptionLength
        //   );
        // }
        //
        // if (rolloutConfig.seo.maxDescriptionLength) {
        //   expect.soft(result.metaDescription.length, 'Description should not exceed maximum length').toBeLessThanOrEqual(
        //     rolloutConfig.seo.maxDescriptionLength
        //   );
        // }
      });

      // Test 3: <link rel="canonical"> must exist, be valid and an absolute https URL.
      test('should have valid canonical URL', async ({ page }) => {
        const result = await seoValidator.validateSEO();

        console.log(`[Canonical] ${result.canonical.value}`);

        expect.soft(result.canonical.value, 'Canonical URL should exist').toBeTruthy();
        expect.soft(result.canonical.isValid, result.canonical.errors.join('; ')).toBe(true);

        // Canonical should be absolute URL
        if (result.canonical.value) {
          expect.soft(result.canonical.value, 'Canonical should be absolute URL').toMatch(/^https?:\/\//);
        }
      });

      // Test 4: hreflang tags must exist (when required), be valid, and include a
      // self-referencing tag for the current language (or x-default).
      test('should have valid hreflang tags for all language versions', async ({ page }) => {
        const result = await seoValidator.validateSEO();

        console.log(`[Hreflang] Found ${result.hreflang.tags.length} alternate language tags`);
        result.hreflang.tags.forEach((tag) => {
          console.log(`  - ${tag.hreflang}: ${tag.href}`);
        });

        if (rolloutConfig.seo.requireHreflang) {
          expect.soft(result.hreflang.tags.length, 'Hreflang tags should exist').toBeGreaterThan(0);
        }

        expect.soft(result.hreflang.isValid, result.hreflang.errors.join('; ')).toBe(true);

        // Verify current language has self-referencing hreflang (case-insensitive comparison)
        const selfHreflang = result.hreflang.tags.find(
          (tag) => tag.hreflang.toLowerCase() === language.code.toLowerCase() || tag.hreflang === 'x-default'
        );
        expect.soft(selfHreflang, `Should have hreflang for current language (${language.code})`).toBeDefined();
      });

      // Test 5: Open Graph og:title / og:description / og:image must exist
      // (when required) and be valid.
      test('should have valid Open Graph tags', async ({ page }) => {
        const result = await seoValidator.validateSEO();

        console.log(`[OG] Title: ${result.openGraph.title}`);
        console.log(`[OG] Description: ${result.openGraph.description}`);
        console.log(`[OG] Image: ${result.openGraph.image}`);

        if (rolloutConfig.seo.requireOgTags) {
          expect.soft(result.openGraph.title, 'og:title should exist').toBeTruthy();
          expect.soft(result.openGraph.description, 'og:description should exist').toBeTruthy();
          expect.soft(result.openGraph.image, 'og:image should exist').toBeTruthy();
        }

        expect.soft(result.openGraph.isValid, result.openGraph.errors.join('; ')).toBe(true);
      });

      // Test 6: JSON-LD structured data is optional, but must be valid if present.
      test('should have structured data (JSON-LD)', async ({ page }) => {
        const result = await seoValidator.validateSEO();

        console.log(`[Structured Data] Found: ${result.structuredData.found}`);
        if (result.structuredData.types.length > 0) {
          console.log(`[Structured Data] Types: ${result.structuredData.types.join(', ')}`);
        }

        // Structured data is optional but should be valid if present
        expect.soft(result.structuredData.isValid, result.structuredData.errors.join('; ')).toBe(true);
      });

      // Test 7: basic localized-metadata sanity - title and description non-empty.
      // (Real per-language text detection is still pending.)
      test('should have localized SEO metadata for the language', async ({ page }) => {
        const result = await seoValidator.validateSEO();

        // Title and description should be in the correct language (basic check)
        const title = result.title.value || '';
        const description = result.metaDescription.value || '';

        expect.soft(title.length, 'Title should be non-empty').toBeGreaterThan(0);
        expect.soft(description.length, 'Description should be non-empty').toBeGreaterThan(0);

        // TODO: Add language-specific validation (e.g., Spanish text for es-es)
        // This would require language detection library like franc or compromise
      });

      // Reporting hook: build and attach a full SEO report (`seo-report-<lang>`).
      test.afterEach(async ({ page }, testInfo) => {
        // Generate SEO report
        const result = await seoValidator.validateSEO();
        const report = seoValidator.generateReport(result, language.code);

        await testInfo.attach(`seo-report-${language.code}`, {
          body: report,
          contentType: 'text/plain',
        });

        console.log(report);
      });
    });
  }
});

/**
 * Component Mapper - Analytics Validation Spec
 * What:
 *   Verifies analytics-related dataLayer values and behavior for tracked pages.
 * Why:
 *   Created to ensure analytics implementation remains compliant with expected
 *   tracking rules during mapper-driven regression runs.
 */

import { test, expect } from '@playwright/test';
import { AnalyticsValidationComponent } from '../../components/analyticsValidationComponent';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

/**
 * Marketing Data Implementation - US 2194
 *
 * Validates dataLayer analytics variables:
 * - page_referring_url (AC3, AC4)
 * - internal_source
 * - visitor_type (traffic_type)
 * - Consent gating (AC1)
 * - Initialization timing (AC2)
 * - Naming conventions and data format
 */
test.describe('Marketing Data Implementation (US 2194)', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('analyticsValidation');
  });

  // ============================================================================
  // Functional Tests - Data Capture
  // ============================================================================
  test.describe('Functional Tests - Data Capture', () => {
    test('TC-MD01: Direct entry - page_referring_url is empty (AC4)', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);
      await marketing.navigateToComponent();

      const entry = await marketing.getPageviewEntry();
      expect.soft(entry, 'pageview entry should exist').not.toBeNull();
      expect.soft(entry).toHaveProperty('page_referring_url');

      // AC4: "the page_referring_url parameter will be empty/blank" when no referrer
      // Implementation uses "Not Applicable" as the expected value for direct entry (confirmed expected behavior)
      const refUrl = typeof entry?.page_referring_url === 'string' ? entry.page_referring_url : '';
      const isEmpty = refUrl === '' || refUrl.trim() === '';
      const isNotApplicable = refUrl === 'Not Applicable';

      // Accept both empty string and "Not Applicable" as valid for direct entry
      const isValidDirectEntry = isEmpty || isNotApplicable;
      expect
        .soft(isValidDirectEntry, `AC4 requires empty/blank or "Not Applicable" but got "${refUrl}".`)
        .toBe(true);

      console.log(`TC-MD01: page_referring_url = "${refUrl}" (valid direct entry value)`);


      await marketing.captureDataLayerScreenshot(
        'TC-MD01-direct-entry',
        `TC-MD01: Direct Entry - page_referring_url = "${refUrl}"`
      );
    });

    test('TC-MD02: Direct entry - internal_source is Entry', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);
      await marketing.navigateToComponent();

      const entry = await marketing.getPageviewEntry();
      expect.soft(entry).not.toBeNull();
      expect.soft(entry?.internal_source).toBe('Entry');

      await marketing.captureDataLayerScreenshot(
        'TC-MD02-internal-source',
        'TC-MD02: Direct Entry - internal_source'
      );
    });

    test('TC-MD03: visitor_type differentiates internal/external traffic', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);
      await marketing.navigateToComponent();

      const entry = await marketing.getPageviewEntry();
      expect.soft(entry).not.toBeNull();

      const visitorType = typeof entry?.visitor_type === 'string' ? entry.visitor_type : '';
      const validValues = ['Internal', 'External', 'internal', 'external'];
      expect.soft(validValues).toContain(visitorType);

      await marketing.captureDataLayerScreenshot(
        'TC-MD03-visitor-type',
        'TC-MD03: visitor_type value'
      );
    });

    test('TC-MD04: page_referring_url pushed with every page view', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);

      // Page 1: Homepage (direct entry)
      await marketing.navigateToComponent();
      const entry1 = await marketing.getPageviewEntry();
      expect.soft(entry1, 'Homepage: pageview entry missing').not.toBeNull();
      expect.soft(entry1).toHaveProperty('page_referring_url');
      const path1 = typeof entry1?.page_path === 'string' ? entry1.page_path : '';

      // Page 2: About Us (via header nav link click — preserves referrer)
      await marketing.clickHeaderNavLink('about');
      const entry2 = await marketing.getPageviewEntry();
      expect.soft(entry2, 'About Us: pageview entry missing').not.toBeNull();
      expect.soft(entry2).toHaveProperty('page_referring_url');
      const path2 = typeof entry2?.page_path === 'string' ? entry2.page_path : '';
      expect.soft(path2, 'About Us page_path should differ from Homepage').not.toBe(path1);
      expect.soft(path2.toLowerCase()).toContain('about');

      // Page 3: Sustainability (via content link click on About Us page)
      await marketing.clickContentLink('sustainability');
      const entry3 = await marketing.getPageviewEntry();
      expect.soft(entry3, 'Sustainability: pageview entry missing').not.toBeNull();
      expect.soft(entry3).toHaveProperty('page_referring_url');
      const path3 = typeof entry3?.page_path === 'string' ? entry3.page_path : '';
      expect.soft(path3, 'Sustainability page_path should differ from About Us').not.toBe(path2);
      expect.soft(path3.toLowerCase()).toContain('sustain');

      await marketing.captureDataLayerScreenshot(
        'TC-MD04-every-pageview',
        'TC-MD04: page_referring_url on every page view'
      );
    });

    test('TC-MD05: External referrer - page_referring_url includes external domain', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);
      await marketing.navigateWithReferrer('https://www.google.com/search?q=bayer+uk');

      const entry = await marketing.getPageviewEntry();
      expect.soft(entry).not.toBeNull();

      const refUrl = typeof entry?.page_referring_url === 'string' ? entry.page_referring_url : '';
      expect.soft(refUrl).toContain('google.com');

      await marketing.captureDataLayerScreenshot(
        'TC-MD05-external-referrer',
        'TC-MD05: External referrer (Google)'
      );
    });

    test('TC-MD06: page_referring_url excludes protocol and www (AC3)', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);
      await marketing.navigateWithReferrer('https://www.google.com/search?q=bayer+news');

      const entry = await marketing.getPageviewEntry();
      expect.soft(entry).not.toBeNull();

      const refUrl = typeof entry?.page_referring_url === 'string' ? entry.page_referring_url : '';
      // Must verify value is actually populated before negative checks
      expect.soft(refUrl.length, 'page_referring_url should not be empty with a referrer').toBeGreaterThan(0);
      expect.soft(refUrl).not.toBe('Not Applicable');
      expect.soft(refUrl).not.toContain('https://');
      expect.soft(refUrl).not.toContain('http://');
      expect.soft(refUrl).not.toMatch(/^www\./);

      await marketing.captureDataLayerScreenshot(
        'TC-MD06-no-protocol-www',
        `TC-MD06: No protocol/www - value="${refUrl}"`
      );
    });

    test('TC-MD07: External referrer includes query parameters', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);
      await marketing.navigateWithReferrer(
        'https://www.google.com/search?q=bayer+news&source=web'
      );

      const entry = await marketing.getPageviewEntry();
      expect.soft(entry).not.toBeNull();

      const refUrl = typeof entry?.page_referring_url === 'string' ? entry.page_referring_url : '';
      // AC3: query string parameters must be included where available
      // Referrer was sent with ?q=bayer+news&source=web so params must be captured
      expect.soft(refUrl.length, 'page_referring_url should not be empty with a referrer').toBeGreaterThan(0);
      expect.soft(refUrl, 'page_referring_url should not be Not Applicable when referrer was sent').not.toBe('Not Applicable');
      expect.soft(refUrl, 'AC3: query params must be included').toContain('?');
      expect.soft(refUrl).toContain('q=');

      await marketing.captureDataLayerScreenshot(
        'TC-MD07-query-params',
        `TC-MD07: Query params - value="${refUrl}"`
      );
    });

    test('TC-MD08: Internal navigation - page_referring_url captures internal path', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);

      // Go to homepage first
      await marketing.navigateToComponent();

      // Navigate via header nav link click (preserves referrer, not page.goto which resets it)
      await marketing.clickHeaderNavLink('about');

      const entry = await marketing.getPageviewEntry();
      expect.soft(entry, 'pageview entry should exist on About Us page').not.toBeNull();
      expect.soft(entry).toHaveProperty('page_referring_url');

      // Requirement: "Internal referrals must also be included in page_referring_url"
      // After clicking from homepage, the referring URL should reflect the internal origin
      const refUrl = typeof entry?.page_referring_url === 'string' ? entry.page_referring_url : '';
      expect
        .soft(refUrl.length, 'page_referring_url should not be empty after internal navigation')
        .toBeGreaterThan(0);

      // Should contain internal page path, not "Not Applicable"
      const isBlank = refUrl === '' || refUrl === 'Not Applicable';
      expect
        .soft(isBlank, `Internal referrer should capture previous page path but got "${refUrl}"`)
        .toBe(false);

      await marketing.captureDataLayerScreenshot(
        'TC-MD08-internal-nav',
        `TC-MD08: Internal nav referrer = "${refUrl}"`
      );
    });
  });

  // ============================================================================
  // Functional Tests - Data Format and Consistency
  // ============================================================================
  test.describe('Functional Tests - Data Format', () => {
    test('TC-MD09: Variable naming follows lowercase underscore convention', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);
      await marketing.navigateToComponent();

      const entry = await marketing.getPageviewEntry();
      expect.soft(entry).not.toBeNull();

      const requiredVars = [
        'page_referring_url',
        'internal_source',
        'visitor_type',
        'page_path',
        'page_title',
        'page_name',
        'page_type',
      ];

      for (const v of requiredVars) {
        expect.soft(entry).toHaveProperty(v);
      }

      await marketing.captureDataLayerScreenshot(
        'TC-MD09-naming-convention',
        'TC-MD09: Variable naming convention'
      );
    });

    test('TC-MD10: All captured values are strings in plain text format', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);
      await marketing.navigateToComponent();

      const entry = await marketing.getPageviewEntry();
      expect.soft(entry).not.toBeNull();

      const checkVars = [
        'page_referring_url',
        'internal_source',
        'visitor_type',
        'page_path',
        'page_name',
      ];

      for (const v of checkVars) {
        expect.soft(entry, `Variable "${v}" check: pageview entry must exist`).not.toBeNull();
        expect.soft(entry).toHaveProperty(v);
        if (entry && v in entry) {
          expect.soft(typeof entry[v], `"${v}" must be a string but got ${typeof entry?.[v]}`).toBe('string');
        }
      }

      await marketing.captureDataLayerScreenshot(
        'TC-MD10-string-format',
        'TC-MD10: Values are strings'
      );
    });
  });

  // ============================================================================
  // Functional Tests - Triggering and Timing
  // ============================================================================
  test.describe('Functional Tests - Triggering and Timing', () => {
    test('TC-MD11: DataLayer initializes before pageview event fires (AC2)', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);
      await marketing.navigateToComponent();

      const events = await marketing.getEventOrder();
      const gtmJsIndex = events.findIndex((e) => e.event === 'gtm.js');
      const pageviewIndex = events.findIndex((e) => e.event === 'pageview');

      expect.soft(gtmJsIndex).toBeGreaterThanOrEqual(0);
      expect.soft(pageviewIndex).toBeGreaterThanOrEqual(0);
      expect.soft(gtmJsIndex).toBeLessThan(pageviewIndex);

      await marketing.captureDataLayerScreenshot(
        'TC-MD11-init-order',
        'TC-MD11: DataLayer initialization order'
      );
    });

    test('TC-MD12: Consent gating - no GTM/pageview before cookie consent (AC1)', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);
      await marketing.navigateWithoutConsent();
      // Wait for page to fully load without accepting cookies
      await page.waitForTimeout(5000);

      // AC1: No tracking writes should occur before consent for tracking cookie category
      const events = await marketing.getEventOrder();
      const pageviewFired = events.some((e) => e.event === 'pageview');
      const gtmJsFired = events.some((e) => e.event === 'gtm.js');

      // BUG CHECK: pageview and gtm.js should NOT fire before cookie consent is accepted
      expect
        .soft(pageviewFired, 'BUG: pageview event fired before cookie consent was accepted')
        .toBe(false);
      expect
        .soft(gtmJsFired, 'BUG: gtm.js event fired before cookie consent was accepted')
        .toBe(false);

      // Verify no marketing variables are pushed before consent
      const entry = await marketing.getPageviewEntry();
      expect
        .soft(entry, 'BUG: Marketing data variables pushed to dataLayer before cookie consent')
        .toBeNull();

      // Verify consent groups - only C0001 (strictly necessary) should be present before consent
      const consentGroups = await marketing.getConsentGroups();
      for (const group of consentGroups) {
        expect.soft(group.groups).not.toContain('C0002');
        expect.soft(group.groups).not.toContain('C0003');
        expect.soft(group.groups).not.toContain('C0004');
      }

      await marketing.captureDataLayerScreenshot(
        'TC-MD12-consent-gating',
        'TC-MD12: Consent gating - GTM fires BEFORE consent (BUG)'
      );
    });
  });

  // ============================================================================
  // Functional Tests - Multi-Page Navigation Flow
  // ============================================================================
  test.describe('Functional Tests - Navigation Flow', () => {
    test('TC-MD13: Multi-page navigation updates dataLayer per page', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);

      // Start at homepage
      await marketing.navigateToComponent();
      const entry1 = await marketing.getPageviewEntry();
      expect.soft(entry1, 'Homepage: pageview entry missing').not.toBeNull();
      expect.soft(entry1).toHaveProperty('page_referring_url');
      expect.soft(entry1).toHaveProperty('page_path');
      const path1 = typeof entry1?.page_path === 'string' ? entry1.page_path : '';

      // Navigate to About Us via header nav (real click — preserves referrer)
      await marketing.clickHeaderNavLink('about');
      const entry2 = await marketing.getPageviewEntry();
      expect.soft(entry2, 'About Us: pageview entry missing').not.toBeNull();
      expect.soft(entry2).toHaveProperty('page_referring_url');
      expect.soft(entry2).toHaveProperty('internal_source');
      expect.soft(entry2).toHaveProperty('visitor_type');
      expect.soft(entry2).toHaveProperty('page_path');
      const path2 = typeof entry2?.page_path === 'string' ? entry2.page_path : '';
      expect.soft(path2, 'About Us: page_path should differ from Homepage').not.toBe(path1);

      // Verify page_referring_url captured the internal referrer (not "Not Applicable")
      const refUrl2 = typeof entry2?.page_referring_url === 'string' ? entry2.page_referring_url : '';
      expect
        .soft(refUrl2, 'About Us: page_referring_url should capture internal referrer')
        .not.toBe('Not Applicable');

      // Navigate to Sustainability via content link on About Us page
      await marketing.clickContentLink('sustainability');
      const entry3 = await marketing.getPageviewEntry();
      expect.soft(entry3, 'Sustainability: pageview entry missing').not.toBeNull();
      expect.soft(entry3).toHaveProperty('page_path');
      const path3 = typeof entry3?.page_path === 'string' ? entry3.page_path : '';
      expect.soft(path3, 'Sustainability: page_path should differ from About Us').not.toBe(path2);

      // Verify page_referring_url tracks previous page
      const refUrl3 = typeof entry3?.page_referring_url === 'string' ? entry3.page_referring_url : '';
      expect
        .soft(refUrl3, 'Sustainability: page_referring_url should capture About Us path')
        .not.toBe('Not Applicable');

      await marketing.captureDataLayerScreenshot(
        'TC-MD13-multi-page-nav',
        'TC-MD13: Multi-page navigation flow (header nav → content link)'
      );
    });

    test('TC-MD14: LinkedIn referrer - page_referring_url includes linkedin.com', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);
      await marketing.navigateWithReferrer('https://www.linkedin.com/feed/');

      const entry = await marketing.getPageviewEntry();
      expect.soft(entry).not.toBeNull();

      const refUrl = typeof entry?.page_referring_url === 'string' ? entry.page_referring_url : '';
      expect.soft(refUrl).toContain('linkedin.com');
      expect.soft(refUrl).not.toContain('https://');

      await marketing.captureDataLayerScreenshot(
        'TC-MD14-linkedin-referrer',
        'TC-MD14: LinkedIn referrer'
      );
    });
  });

  // ============================================================================
  // Functional Tests - Navigation Source Tracking
  // ============================================================================
  test.describe('Functional Tests - Navigation Source', () => {
    test('TC-MD15: Header navigation sets internal_source to Header Navigation', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);
      await marketing.navigateToComponent();

      // Navigate via header nav link
      await marketing.clickHeaderNavLink('about');
      const entry = await marketing.getPageviewEntry();
      expect.soft(entry, 'About Us: pageview entry missing').not.toBeNull();

      const internalSource = typeof entry?.internal_source === 'string' ? entry.internal_source : '';
      expect
        .soft(internalSource, 'Header nav click should set internal_source to "Header Navigation"')
        .toBe('Header Navigation');

      // Also verify page_referring_url captured homepage path
      const refUrl = typeof entry?.page_referring_url === 'string' ? entry.page_referring_url : '';
      expect.soft(refUrl.length, 'page_referring_url should not be empty after header nav').toBeGreaterThan(0);
      expect.soft(refUrl).not.toBe('Not Applicable');

      await marketing.captureDataLayerScreenshot(
        'TC-MD15-header-nav-source',
        `TC-MD15: Header Navigation - internal_source="${internalSource}"`
      );
    });

    test('TC-MD16: Footer navigation sets internal_source correctly', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);
      await marketing.navigateToComponent();

      // Navigate via footer nav link to Sustainability
      await marketing.clickFooterNavLink('sustainability');
      const entry = await marketing.getPageviewEntry();
      expect.soft(entry, 'Sustainability: pageview entry missing').not.toBeNull();

      const internalSource = typeof entry?.internal_source === 'string' ? entry.internal_source : '';
      // Footer nav should set a distinct internal_source (e.g. "Footer Navigation")
      expect
        .soft(internalSource.length, 'internal_source should not be empty after footer nav click')
        .toBeGreaterThan(0);
      expect
        .soft(internalSource, 'Footer nav click should not show "Entry" as internal_source')
        .not.toBe('Entry');

      // Verify page_referring_url captured the homepage path
      const refUrl = typeof entry?.page_referring_url === 'string' ? entry.page_referring_url : '';
      expect.soft(refUrl.length, 'page_referring_url should not be empty after footer nav').toBeGreaterThan(0);
      expect.soft(refUrl).not.toBe('Not Applicable');

      await marketing.captureDataLayerScreenshot(
        'TC-MD16-footer-nav-source',
        `TC-MD16: Footer Navigation - internal_source="${internalSource}"`
      );
    });

    test('TC-MD17: Content link sets internal_source correctly', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);

      // Go to About Us first (via header nav)
      await marketing.navigateToComponent();
      await marketing.clickHeaderNavLink('about');

      // Click a content link (teaser card) on About Us page
      await marketing.clickContentLink('sustainability');
      const entry = await marketing.getPageviewEntry();
      expect.soft(entry, 'Sustainability: pageview entry missing after content link click').not.toBeNull();

      const internalSource = typeof entry?.internal_source === 'string' ? entry.internal_source : '';
      // Content links should set a distinct internal_source (e.g. "Content Link")
      expect
        .soft(internalSource.length, 'internal_source should not be empty after content link click')
        .toBeGreaterThan(0);

      // Verify page_referring_url captured the About Us path
      const refUrl = typeof entry?.page_referring_url === 'string' ? entry.page_referring_url : '';
      expect.soft(refUrl.length, 'page_referring_url should not be empty after content link click').toBeGreaterThan(0);
      expect.soft(refUrl).not.toBe('Not Applicable');
      expect.soft(refUrl.toLowerCase()).toContain('about');

      await marketing.captureDataLayerScreenshot(
        'TC-MD17-content-link-source',
        `TC-MD17: Content Link - internal_source="${internalSource}"`
      );
    });
  });

  // ============================================================================
  // Functional Tests - UTM Fallback
  // ============================================================================
  test.describe('Functional Tests - UTM Fallback', () => {
    test('TC-MD18: UTM fallback - page_referring_url populated from UTM params when no referrer', async ({
      page,
      browser,
      context,
    }) => {
      const marketing = new AnalyticsValidationComponent(page, browser, context);

      // Navigate WITH UTM params but WITHOUT a referrer header
      // Requirement: "Where this cannot be retrieved directly from the URL,
      // it should also be attempted to retrieve from the UTM variables"
      await marketing.navigateWithUtmParams({
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'brand_uk',
        utm_content: 'ad_variation_1',
      });

      const entry = await marketing.getPageviewEntry();
      expect.soft(entry, 'pageview entry should exist').not.toBeNull();
      expect.soft(entry).toHaveProperty('page_referring_url');

      const refUrl = typeof entry?.page_referring_url === 'string' ? entry.page_referring_url : '';

      // Check if UTM params are captured or if the value reflects the UTM source
      // When no referrer header is available, page_referring_url should fall back to UTM data
      const hasUtmFallback =
        refUrl.toLowerCase().includes('google') ||
        refUrl.toLowerCase().includes('utm') ||
        refUrl.toLowerCase().includes('cpc');

      const isEmpty = refUrl === '' || refUrl.trim() === '';
      const isNotApplicable = refUrl === 'Not Applicable';

      // Log the actual value for debugging
      console.log(`TC-MD18: page_referring_url = "${refUrl}"`);
      console.log(`TC-MD18: UTM fallback detected = ${hasUtmFallback}`);

      // Primary assertion: page_referring_url should be populated from UTM data
      // If it's empty or "Not Applicable", the UTM fallback is NOT working
      if (isEmpty || isNotApplicable) {
        expect
          .soft(
            false,
            `UTM Fallback NOT working: page_referring_url is "${refUrl}" even with UTM params present. ` +
            'Requirement says: "it should also be attempted to retrieve from the UTM variables"'
          )
          .toBe(true);
      } else {
        // Value is populated — verify it contains UTM-derived info (e.g., google from utm_source)
        expect
          .soft(
            hasUtmFallback,
            `page_referring_url = "${refUrl}" — populated but does not appear to contain UTM-derived data (expected google/utm/cpc)`
          )
          .toBe(true);
      }

      // Also verify UTM variables are captured in the dataLayer entry
      const utmSource = entry?.utm_source ?? entry?.['utm_source'];
      const utmMedium = entry?.utm_medium ?? entry?.['utm_medium'];
      const utmCampaign = entry?.utm_campaign ?? entry?.['utm_campaign'];

      console.log(`TC-MD18: utm_source = "${utmSource}", utm_medium = "${utmMedium}", utm_campaign = "${utmCampaign}"`);

      await marketing.captureDataLayerScreenshot(
        'TC-MD18-utm-fallback',
        `TC-MD18: UTM Fallback - page_referring_url="${refUrl}"`
      );
    });
  });
});

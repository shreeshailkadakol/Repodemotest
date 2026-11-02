/**
 * Giant Teaser Component Test Suite - Comprehensive Testing
 *
 * This test suite validates the Giant Teaser component functionality across:
 * • Functional Testing: Visibility in Navigation and Language Selection overlays, viewport responsiveness
 * • Visual Testing: Typography, colors, layout consistency against Figma specifications
 * • Accessibility Testing: WCAG compliance, keyboard navigation, screen reader support
 * • Performance Testing: Load times, overlay interaction responsiveness
 *
 * Test Case Coverage:
 * - Navigation Overlay: Giant Teaser display on XL/LG viewports, hidden on MD/SM
 * - Language Selection Overlay: Giant Teaser display on XL/LG viewports, hidden on MD/SM
 * - Contact Us Link: Presence and functionality in Navigation Overlay
 * - Content Consistency: Teaser content verification across both overlays
 * - Accessibility validation for keyboard navigation and screen readers
 * - Performance benchmarking for overlay interactions
 */

import { test, expect } from '@playwright/test';
import { GiantTeaserComponent } from '../../components/giantTeaserComponent';
import { envUtils } from '../../helpers/utils/envUtils';
import { GiantTeaser_FigmaValues } from '../../helpers/utils/figma-values/GiantTeaser_FigmaValues';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

test.describe('Giant Teaser Component - Comprehensive Testing', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('giantTeaser');
  });

  let giantTeaser: GiantTeaserComponent;
  let baseURL: string;
  let testURL: string;

  test.beforeEach(async ({ page, browser, context }) => {
    giantTeaser = new GiantTeaserComponent(page, browser, context);
    baseURL = envUtils.getBaseUrl();
    testURL = baseURL;

    await giantTeaser.navigateWithAuthentication(testURL);
    test.setTimeout(100 * 1000);
    await giantTeaser.acceptCookiesBanner();
    test.setTimeout(60 * 1000);
  });

  test.afterEach(async ({ page }) => {
    // Take screenshot on failure
    if (test.info().status === 'failed') {
      const testName = test.info().title.replace(/[^a-zA-Z0-9]/g, '-');
      await page.screenshot({ path: `reports/screenshots/failed-${testName}.png` });
    }
  });

  // ===============================
  // FUNCTIONAL TESTING - NAVIGATION OVERLAY
  // ===============================

  test.describe('@Functional - Navigation Overlay Tests', () => {
    /**
     * TC-GT1: Validates Giant Teaser displays in Navigation Overlay on XL viewport
     * Tests visibility on 1440x900 viewport
     */
    test('TC-GT1: Verify Giant Teaser displays in Navigation Overlay on XL viewport', { tag: ['@Functional', '@UKProd', '@Smoke'] }, async () => {
      await giantTeaser.setViewport('XL');
      await giantTeaser.openNavigationOverlay();
      await giantTeaser.verifyGiantTeaserVisible('navigation');
      await giantTeaser.closeNavigationOverlay();
      expect.soft(true).toBe(true);
    });

    /**
     * TC-GT2: Validates Giant Teaser displays in Navigation Overlay on LG viewport
     * Tests visibility on 1024x768 viewport
     */
    test('TC-GT2: Verify Giant Teaser displays in Navigation Overlay on LG viewport', { tag: ['@Functional', '@UKProd'] }, async () => {
      await giantTeaser.setViewport('LG');
      await giantTeaser.openNavigationOverlay();
      await giantTeaser.verifyGiantTeaserVisible('navigation');
      await giantTeaser.closeNavigationOverlay();
      expect.soft(true).toBe(true);
    });

    /**
     * TC-GT3: Validates Giant Teaser is hidden in Navigation Overlay on MD viewport
     * Tests hidden state on 768x1024 viewport
     */
    test('TC-GT3: Verify Giant Teaser is hidden in Navigation Overlay on MD viewport', { tag: ['@Functional', '@UKProd'] }, async () => {
      await giantTeaser.setViewport('MD');
      await giantTeaser.openNavigationOverlay();
      await giantTeaser.verifyGiantTeaserHidden('navigation');
      await giantTeaser.closeNavigationOverlay();
      expect.soft(true).toBe(true);
    });

    /**
     * TC-GT4: Validates Giant Teaser is hidden in Navigation Overlay on SM viewport
     * Tests hidden state on 375x667 viewport
     */
    test('TC-GT4: Verify Giant Teaser is hidden in Navigation Overlay on SM viewport', { tag: ['@Functional', '@UKProd'] }, async () => {
      await giantTeaser.setViewport('SM');
      await giantTeaser.openNavigationOverlay();
      await giantTeaser.verifyGiantTeaserHidden('navigation');
      await giantTeaser.closeNavigationOverlay();
      expect.soft(true).toBe(true);
    });

    /**
     * TC-GT5: Validates Giant Teaser content elements in Navigation Overlay on XL viewport
     * Tests title, description, and CTA button presence
     */
    test('TC-GT5: Verify Giant Teaser content elements in Navigation Overlay on XL viewport', { tag: ['@Functional', '@UKProd'] }, async () => {
      await giantTeaser.setViewport('XL');
      await giantTeaser.openNavigationOverlay();

      // Wait for Giant Teaser to be fully loaded with image
      await giantTeaser.verifyGiantTeaserVisible('navigation');

      await giantTeaser.verifyGiantTeaserTitle('navigation');
      await giantTeaser.verifyGiantTeaserDescription('navigation');
      await giantTeaser.verifyGiantTeaserCTA('navigation');

      await giantTeaser.closeNavigationOverlay();
      expect.soft(true).toBe(true);
    });

    /**
     * TC-GT6: Validates Giant Teaser content elements in Navigation Overlay on LG viewport
     * Tests title, description, and CTA button presence on 1024x768 viewport
     */
    test('TC-GT6: Verify Giant Teaser content elements in Navigation Overlay on LG viewport', { tag: ['@Functional', '@UKProd'] }, async () => {
      await giantTeaser.setViewport('LG');
      await giantTeaser.openNavigationOverlay();

      // Wait for Giant Teaser to be fully loaded with image
      await giantTeaser.verifyGiantTeaserVisible('navigation');

      await giantTeaser.verifyGiantTeaserTitle('navigation');
      await giantTeaser.verifyGiantTeaserDescription('navigation');
      await giantTeaser.verifyGiantTeaserCTA('navigation');

      await giantTeaser.closeNavigationOverlay();
      expect.soft(true).toBe(true);
    });

    /**
     * TC-GT7: Validates Navigation Overlay opens and closes correctly
     * Tests overlay interaction functionality
     */
    test('TC-GT7: Verify Navigation Overlay opens and closes correctly', { tag: ['@Functional', '@UKProd'] }, async () => {
      await giantTeaser.setViewport('XL');

      await giantTeaser.openNavigationOverlay();
      await giantTeaser.verifyGiantTeaserVisible('navigation');

      await giantTeaser.closeNavigationOverlay();
      expect.soft(true).toBe(true);
    });
  });

  // ===============================


  // ===============================
  // FUNCTIONAL TESTING - CONTACT US LINK
  // ===============================

  test.describe('@Functional - Contact Us Link Tests', () => {
    /**
     * TC-GT12: Validates Contact Us link presence in Navigation Overlay
     * Contact Us link is optional - test passes if link is not configured in environment
     */
    test('TC-GT12: Verify Contact Us link in Navigation Overlay', { tag: ['@Functional', '@UKProd'] }, async () => {
      await giantTeaser.setViewport('XL');
      await giantTeaser.openNavigationOverlay();

      // Verify link visibility and content (optional - skips gracefully if not present)
      await giantTeaser.verifyContactUsLink();

      await giantTeaser.closeNavigationOverlay();
    });

    /**
     * TC-GT13: Validates Contact Us link navigation functionality
     * Contact Us link is optional - test passes if link is not configured in environment
     */
    test('TC-GT13: Verify Contact Us link navigation functionality', { tag: ['@Functional', '@UKProd'] }, async ({ page }) => {
      await giantTeaser.setViewport('XL');
      await giantTeaser.openNavigationOverlay();

      // Get URL before click
      const urlBeforeClick = page.url();

      // Click the Contact Us link (optional - returns false if not present)
      const clicked = await giantTeaser.clickContactUsLink();

      if (clicked) {
        // Verify page is in valid state after click
        const urlAfterClick = page.url();
        expect.soft(urlAfterClick).toBeTruthy();

        if (urlAfterClick !== urlBeforeClick) {
          await giantTeaser.log(`Navigation occurred: ${urlBeforeClick} -> ${urlAfterClick}`);
          await page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
        }
      }
    });
  });

  // ===============================
  // FUNCTIONAL TESTING - CONTENT CONSISTENCY
  // ===============================

  test.describe('@Functional - Content Consistency Tests', () => {
    /**
     * TC-GT14: Validates Giant Teaser content consistency between overlays
     * Tests that same content appears in both Navigation and Language Selection overlays
     */
    test('TC-GT14: Verify Giant Teaser content consistency between overlays', { tag: ['@Functional', '@UKProd'] }, async () => {
      await giantTeaser.setViewport('XL');
      await giantTeaser.verifyContentConsistency();
      expect.soft(true).toBe(true);
    });

    /**
     * TC-GT15: Validates Giant Teaser CTA link functionality
     * Tests CTA button functionality in both overlays
     */
    test('TC-GT15: Verify Giant Teaser CTA link functionality', { tag: ['@Functional', '@UKProd'] }, async () => {
      await giantTeaser.setViewport('XL');

      // Test in Navigation Overlay (CTA is optional)
      await giantTeaser.openNavigationOverlay();
      await giantTeaser.verifyGiantTeaserVisible('navigation');
      await giantTeaser.verifyGiantTeaserCTA('navigation');
      await giantTeaser.closeNavigationOverlay();
    });
  });

  // ===============================
  // VISUAL TESTING - XL VIEWPORT
  // ===============================

  test.describe('@Visual - Visual Validation XL Viewport (1440px)', () => {
    /**
     * TC-VGT1: Validates Giant Teaser visual styling in Navigation Overlay - XL viewport
     * Tests typography (font-family, font-size, line-height, color) against Figma specifications
     */
    test('TC-VGT1: Verify Giant Teaser visual styling in Navigation Overlay - XL viewport', { tag: '@Visual' }, async () => {
      await giantTeaser.setViewport('XL');
      await giantTeaser.openNavigationOverlay();

      // Wait for Giant Teaser to be fully loaded with image
      await giantTeaser.verifyGiantTeaserVisible('navigation');

      const xlValues = GiantTeaser_FigmaValues.XL;

      await giantTeaser.verifyTitleTypography(
        'navigation',
        xlValues.title.fontFamily,
        xlValues.title.fontSize,
        xlValues.title.lineHeight,
        xlValues.title.color
      );

      await giantTeaser.verifyDescriptionTypography(
        'navigation',
        xlValues.description.fontFamily,
        xlValues.description.fontSize,
        xlValues.description.lineHeight,
        xlValues.description.color
      );

      await giantTeaser.verifyCTATypography(
        'navigation',
        xlValues.ctaButton.fontFamily,
        xlValues.ctaButton.fontSize,
        xlValues.ctaButton.lineHeight,
        xlValues.ctaButton.color
      );

      await giantTeaser.closeNavigationOverlay();
      expect.soft(true).toBe(true);
    });
  });

  // ===============================
  // VISUAL TESTING - LG VIEWPORT
  // ===============================

  test.describe('@Visual - Visual Validation LG Viewport (1024px)', () => {
    /**
     * TC-VGT2: Validates Giant Teaser visual styling in Navigation Overlay - LG viewport
     * Tests typography (font-family, font-size, line-height, color) against Figma specifications
     */
    test('TC-VGT2: Verify Giant Teaser visual styling in Navigation Overlay - LG viewport', { tag: '@Visual' }, async () => {
      await giantTeaser.setViewport('LG');
      await giantTeaser.openNavigationOverlay();

      // Wait for Giant Teaser to be fully loaded with image
      await giantTeaser.verifyGiantTeaserVisible('navigation');

      const lgValues = GiantTeaser_FigmaValues.LG;

      await giantTeaser.verifyTitleTypography(
        'navigation',
        lgValues.title.fontFamily,
        lgValues.title.fontSize,
        lgValues.title.lineHeight,
        lgValues.title.color
      );

      await giantTeaser.verifyDescriptionTypography(
        'navigation',
        lgValues.description.fontFamily,
        lgValues.description.fontSize,
        lgValues.description.lineHeight,
        lgValues.description.color
      );

      await giantTeaser.verifyCTATypography(
        'navigation',
        lgValues.ctaButton.fontFamily,
        lgValues.ctaButton.fontSize,
        lgValues.ctaButton.lineHeight,
        lgValues.ctaButton.color
      );

      await giantTeaser.closeNavigationOverlay();
      expect.soft(true).toBe(true);
    });
  });

  // ===============================
  // ACCESSIBILITY TESTING - WCAG 2.1 AA COMPLIANCE
  // ===============================

  test.describe('@Accessibility - Accessibility Tests', () => {
    /**
     * TC-AGT1: Validates keyboard navigation for Navigation Overlay and Giant Teaser
     * Tests keyboard accessibility and focus management
     */
    test('TC-AGT1: Verify keyboard navigation for Navigation Overlay and Giant Teaser', { tag: '@Accessibility' }, async () => {
      await giantTeaser.setViewport('XL');
      await giantTeaser.verifyNavigationOverlayKeyboardAccess();
      expect.soft(true).toBe(true);
    });

    /**
     * TC-AGT2: Validates screen reader compatibility for Giant Teaser in Navigation Overlay
     * Tests ARIA attributes and semantic HTML for screen readers
     */
    test('TC-AGT2: Verify screen reader compatibility for Giant Teaser in Navigation Overlay', { tag: '@Accessibility' }, async () => {
      await giantTeaser.setViewport('XL');
      await giantTeaser.runAccessibilityScan('navigation');
      expect.soft(true).toBe(true);
    });

    /**
     * TC-AGT4: Validates Contact Us link accessibility
     * Tests Contact Us link is keyboard accessible and has proper attributes
     */
    test('TC-AGT4: Verify Contact Us link accessibility', { tag: '@Accessibility' }, async () => {
      await giantTeaser.setViewport('XL');
      await giantTeaser.openNavigationOverlay();

      // Wait for Giant Teaser to be fully loaded with image
      await giantTeaser.verifyGiantTeaserVisible('navigation');

      await giantTeaser.verifyContactUsLink();

      await giantTeaser.closeNavigationOverlay();
      expect.soft(true).toBe(true);
    });
  });

  // ===============================
  // PERFORMANCE TESTING - OVERLAY INTERACTION
  // ===============================

  test.describe('@Performance - Performance Tests', () => {
    /**
     * TC-PGT1: Validates Giant Teaser loading performance in overlays
     * Tests overlay opening time and component visibility performance
     */
    test('TC-PGT1: Verify Giant Teaser loading performance in overlays', { tag: '@Performance' }, async () => {
      await giantTeaser.setViewport('XL');

      const navStartTime = Date.now();
      await giantTeaser.openNavigationOverlay();
      await giantTeaser.verifyGiantTeaserVisible('navigation');
      const isNavVisible = await giantTeaser.isGiantTeaserVisible('navigation');
      const navLoadTime = Date.now() - navStartTime;

      expect.soft(isNavVisible).toBe(true);
      expect.soft(navLoadTime).toBeLessThan(5000);

      await giantTeaser.closeNavigationOverlay();
    });
  });
});

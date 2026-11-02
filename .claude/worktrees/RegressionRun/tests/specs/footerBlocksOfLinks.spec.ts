import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { FooterBlocksOfLinksComponent } from '../../components/footerBlocksOfLinks';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

test.describe('Footer Blocks of Links - Comprehensive Test Suite', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('footerBlocksOfLinks');
  });

  let page: Page;
  let browser: Browser;
  let context: BrowserContext;
  let footerComponent: FooterBlocksOfLinksComponent;

  test.beforeEach(async ({ page: testPage, browser: testBrowser, context: testContext }) => {
    page = testPage;
    browser = testBrowser;
    context = testContext;
    footerComponent = new FooterBlocksOfLinksComponent(page, browser, context);

    // Navigate to component first
    const componentUrl = await footerComponent['getComponentUrl'](
      'FooterBlocksOfLinksComponent',
      process.env.BASE_URL || ''
    );
    await footerComponent['navigateWithAuthentication'](componentUrl);

    // Then accept cookies and handle authentication separately
    await footerComponent.acceptCookiesBanner();
    await footerComponent['handleVercelAuthentication']();

    // Finally wait for page load
    await footerComponent['waitForPageLoad']();
  });

  test.describe('TC-FBL-F01: Functional Tests - Complete Footer Validation', () => {
    test('TC-FBL-F001: Footer Functional Validation @Smoke', async () => {
      test.setTimeout(120000); // 2 minutes timeout
      // Run the comprehensive integrated test
      const results = await footerComponent.runComprehensiveTest();

      // Log results for debugging
      console.log('Functional test results:', JSON.stringify(results.functional, null, 2));

      // Functional Tests
      expect.soft(
        results.functional.linkValidation.brokenLinks.length,
        'No broken links should exist'
      ).toBe(0);
      expect.soft(
        results.functional.structureValidation.upperSection,
        'Upper section should be present'
      ).toBe(true);
      expect.soft(
        results.functional.structureValidation.middleSection,
        'Middle section should be present'
      ).toBe(true);
      expect.soft(
        results.functional.structureValidation.bottomSection,
        'Bottom section should be present'
      ).toBe(true);
    });

    test('TC-FBL-A001: Footer Accessibility Validation @Accessibility', async () => {
      test.setTimeout(120000); // 2 minutes timeout
      // Run the comprehensive integrated test
      const results = await footerComponent.runComprehensiveTest();

      // Log results for debugging
      console.log('Accessibility test results:', JSON.stringify(results.accessibility, null, 2));

      // Accessibility Tests
      expect.soft(results.accessibility.keyboardNavigation, 'Keyboard navigation should work').toBe(
        true
      );
      expect.soft(results.accessibility.focusIndicators, 'Focus indicators should be visible').toBe(
        true
      );
      expect.soft(results.accessibility.ariaAttributes, 'ARIA attributes should be proper').toBe(true);
    });

    test('TC-FBL-F002: Generic Link Functionality - Production Adaptable', async () => {
      // Test all links regardless of configuration using DOM-first approach
      const linkResults = await footerComponent.validateAllLinksClickable();

      // Assert minimum link expectations
      expect.soft(linkResults.totalLinks, 'Footer should contain links').toBeGreaterThan(0);
      expect.soft(linkResults.workingLinks, 'Some links should be functional').toBeGreaterThan(0);
      expect.soft(linkResults.brokenLinks.length, 'No broken links should exist').toBe(0);

      // Validate link distribution across sections
      const structureResults = await footerComponent.validateFooterStructure();

      // Validate each section has at least some content
      expect.soft(
        structureResults.upperLinks + structureResults.middleLinks + structureResults.bottomLinks,
        'Footer should contain links across sections'
      ).toBeGreaterThan(0);

      console.log(`Footer Link Distribution:
        Upper Section: ${structureResults.upperLinks} links
        Middle Section: ${structureResults.middleLinks} links  
        Bottom Section: ${structureResults.bottomLinks} links
        Total: ${linkResults.totalLinks} links`);
    });

    test('TC-FBL-F003: Responsive Layout Behavior', async () => {
      const responsiveResults = await footerComponent.validateResponsiveBehavior();

      // Assert footer works on all viewport sizes
      Object.entries(responsiveResults).forEach(([viewport, isWorking]) => {
        expect.soft(isWorking, `Footer functionality on ${viewport} viewport`).toBe(true);
      });

      // Responsive validation completed
    });

    test('TC-FBL-A002: WCAG 2.1 AA Accessibility Compliance @Accessibility', async () => {
      const accessibilityResults = await footerComponent.validateFooterAccessibility();

      // Assert no critical accessibility violations
      expect.soft(accessibilityResults.axeResults.violations.length).toBe(0);

      // Assert keyboard navigation works
      expect.soft(accessibilityResults.keyboardNavigation).toBe(true);

      // Assert focus indicators are visible
      expect.soft(accessibilityResults.focusIndicators).toBe(true);

      // Assert proper ARIA attributes
      expect.soft(accessibilityResults.ariaAttributes).toBe(true);

      // Assert color contrast compliance
      expect.soft(accessibilityResults.colorContrast).toBe(true);

      // Accessibility validation completed
    });
  });

  test.describe('Edge Cases and Error Handling', () => {
    test('TC-FBL-F004: Handle Missing or Broken Links Gracefully', async () => {
      // This test validates the component handles production edge cases
      const linkResults = await footerComponent.validateAllLinksClickable();

      // Even if some links are broken, the component should still function
      expect.soft(linkResults.totalLinks).toBeGreaterThan(0);

      // Log any broken links for investigation (but don't fail the test)
      // Broken links are logged in test results

      // At least 80% of links should be working
      const workingPercentage = (linkResults.workingLinks / linkResults.totalLinks) * 100;
      expect.soft(workingPercentage).toBeGreaterThan(80);
    });

    test('TC-FBL-F005: Validate Footer Structure Flexibility', async () => {
      // This ensures the component works with different footer configurations
      const structure = await footerComponent.validateFooterStructure();

      // At least one section should exist and have content
      // Verify at least one section is present
      expect.soft(structure.upperSection || structure.middleSection || structure.bottomSection).toBe(
        true
      );

      // Verify at least one section has links
      expect.soft(structure.upperLinks + structure.middleLinks + structure.bottomLinks).toBeGreaterThan(
        0
      ); // Footer configuration validated
    });
  });

  test.afterEach(async () => {
    // Clean up and reset state for next test
    await page.evaluate(() => {
      // Reset scroll position
      window.scrollTo(0, 0);
    });
  });

  test.afterAll(async () => {
    // Test suite completed
  });
});

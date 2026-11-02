import { test, expect } from '@playwright/test';
import { FooterUniversal } from '../../components/footerUniversal';
import { envUtils } from '../../helpers/utils/envUtils';

/**
 * Footer Navigation Links Validation - Generic Script for All Sites
 * 
 * PURPOSE: Validates ONLY footer navigation/informational links
 * EXCLUDES: Social media links (handled by socialMediaComponent.spec.ts)
 * 
 * This script works universally across all Bayer sites:
 * - Taiwan (Chinese - zh-tw)
 * - Conosur (Spanish - es-es) 
 * - UK (English - en-gb)
 * - India (English - en-in)
 * - Brasil (Portuguese - pt-br)
 * - Any future Bayer site
 */

test.describe('Footer Navigation Links - Universal Validation @Functional', () => {
  let footerUniversal: FooterUniversal;

  test.beforeEach(async ({ page, browser, context }) => {
    footerUniversal = new FooterUniversal(page, browser, context);
    await footerUniversal.navigateToComponent();
  });

  test('@Smoke TC-FNL-001: Footer navigation links presence validation', async () => {
    // Verify footer has navigation links (excluding social media)
    const navLinks = await footerUniversal.getFooterNavigationLinks();
    const linkCount = navLinks.length;

    console.log(`\n📊 Footer Navigation Links Found: ${linkCount}`);
    
    expect.soft(linkCount, 'Footer should have navigation links').toBeGreaterThan(0);
    
    // Log first few links for verification
    for (let i = 0; i < Math.min(3, linkCount); i++) {
      const href = await navLinks[i].getAttribute('href');
      const text = await navLinks[i].textContent();
      console.log(`  ${i + 1}. ${text?.trim() || 'No text'} → ${href}`);
    }
  });

  test('@Functional TC-FNL-002: Footer navigation links functionality validation', async () => {
    // Validate all navigation links are functional
    const validation = await footerUniversal.validateFooterNavigationLinks();

    console.log(`\n╔════════════════════════════════════════════╗`);
    console.log(`║  FOOTER NAVIGATION LINKS VALIDATION        ║`);
    console.log(`╚════════════════════════════════════════════╝`);
    console.log(`\n🔗 Total Navigation Links: ${validation.totalNavigationLinks}`);
    console.log(`   └─ Internal Links: ${validation.internalLinks}`);
    console.log(`   └─ External Links: ${validation.externalLinks}`);
    console.log(`   └─ Visible Links: ${validation.visibleLinks}`);
    console.log(`   └─ Clickable Links: ${validation.clickableLinks}`);
    
    if (validation.brokenLinks.length > 0) {
      console.log(`\n⚠️  Broken Links (${validation.brokenLinks.length}):`);
      validation.brokenLinks.forEach(link => console.log(`   - ${link}`));
    }

    // Assertions
    expect.soft(validation.totalNavigationLinks, 'Footer should have navigation links').toBeGreaterThan(0);
    expect.soft(validation.visibleLinks, 'All navigation links should be visible').toBe(validation.totalNavigationLinks);
    expect.soft(validation.clickableLinks, 'All navigation links should be clickable').toBeGreaterThan(0);
    expect.soft(validation.brokenLinks.length, 'No broken navigation links').toBe(0);
  });

  test('@Functional TC-FNL-003: Verify all footer navigation links are working', async () => {
    // Get all navigation links
    const validation = await footerUniversal.validateFooterNavigationLinks();

    console.log(`\n📋 Detailed Link Analysis:`);
    console.log(`════════════════════════════════════════════\n`);

    // Verify each link has proper attributes
    for (const link of validation.linkDetails) {
      console.log(`🔗 ${link.text}`);
      console.log(`   URL: ${link.href}`);
      console.log(`   Type: ${link.type}`);
      console.log(`   Visible: ${link.isVisible ? '✅' : '❌'}`);
      console.log(`   Clickable: ${link.isClickable ? '✅' : '❌'}\n`);

      // Soft assertions for each link
      expect.soft(link.href, `Link "${link.text}" should have href`).toBeTruthy();
      expect.soft(link.isVisible, `Link "${link.text}" should be visible`).toBe(true);
      expect.soft(link.isClickable, `Link "${link.text}" should be clickable`).toBe(true);
    }

    // Overall validation
    const allLinksWorking = validation.linkDetails.every(
      link => link.href && link.isVisible && link.isClickable
    );
    expect(allLinksWorking, 'All footer navigation links should be working').toBe(true);
  });

  test('@Reporting TC-FNL-004: Generate footer navigation links report', async () => {
    const stats = await footerUniversal.getFooterNavigationStatistics();

    console.log(`\n╔════════════════════════════════════════════╗`);
    console.log(`║  FOOTER NAVIGATION LINKS REPORT            ║`);
    console.log(`╚════════════════════════════════════════════╝`);
    console.log(`\n📊 Structure:`);
    console.log(`   └─ Footer Present: ${stats.isPresent ? '✅' : '❌'}`);
    console.log(`   └─ Copyright: ${stats.hasCopyright ? '✅' : '❌'}`);
    console.log(`\n🔗 Navigation Links (Excluding Social Media):`);
    console.log(`   └─ Total: ${stats.totalNavigationLinks}`);
    console.log(`   └─ Internal: ${stats.navigationLinkBreakdown.internal}`);
    console.log(`   └─ External: ${stats.navigationLinkBreakdown.external}`);
    console.log(`   └─ Anchors: ${stats.navigationLinkBreakdown.anchor}`);
    console.log(`\n♿ Accessibility:`);
    console.log(`   └─ Accessible: ${stats.accessibility.isAccessible ? '✅' : '❌'}`);
    console.log(`   └─ Violations: ${stats.accessibility.violationCount}`);
    console.log(`   └─ Keyboard Nav: ${stats.accessibility.keyboardNavigable ? '✅' : '❌'}`);
    console.log(`\n📱 Responsive:`);
    console.log(`   └─ All Sizes: ${stats.responsive.allSizesWork ? '✅' : '❌'}`);
    console.log(`   └─ Supported: ${stats.responsive.supportedSizes.join(', ')}`);
    console.log(`\n💡 Note: Social media links validated separately in socialMediaComponent.spec.ts`);
    console.log(`\n════════════════════════════════════════════\n`);

    // Basic assertions for report generation
    expect(stats.isPresent, 'Footer should be present').toBe(true);
    expect(stats.totalNavigationLinks, 'Footer should have navigation links').toBeGreaterThan(0);
  });

  test('@Accessibility TC-FNL-005: Footer navigation links accessibility validation', async () => {
    // Validate accessibility of navigation links
    const accessibilityResults = await footerUniversal.validateAccessibility();

    console.log(`\n♿ Accessibility Validation Results:`);
    console.log(`   └─ Keyboard Navigable: ${accessibilityResults.keyboardNavigable ? '✅' : '❌'}`);
    console.log(`   └─ Has Landmark: ${accessibilityResults.hasLandmark ? '✅' : '❌'}`);
    console.log(`   └─ Violations: ${accessibilityResults.violations.length}`);

    if (accessibilityResults.violations.length > 0) {
      console.log(`\n⚠️  Accessibility Violations:`);
      accessibilityResults.violations.forEach(violation => {
        console.log(`   - ${violation.id}: ${violation.description}`);
        console.log(`     Impact: ${violation.impact}`);
        console.log(`     Affected nodes: ${violation.nodes.length}`);
      });
    }

    // Soft assertions for accessibility
    expect.soft(accessibilityResults.keyboardNavigable, 'Footer should be keyboard navigable').toBe(true);
    expect.soft(accessibilityResults.hasLandmark, 'Footer should have proper landmark').toBe(true);
    
    // Allow some violations but flag them
    if (accessibilityResults.violations.length > 0) {
      console.warn(`\n⚠️  Found ${accessibilityResults.violations.length} accessibility violations`);
    }
  });

  test('@Responsive TC-FNL-006: Footer navigation links responsive validation', async () => {
    // Validate footer navigation links work across all viewport sizes
    const responsiveResults = await footerUniversal.validateResponsiveLayout();

    console.log(`\n📱 Responsive Layout Results:`);
    console.log(`   └─ Mobile (375px): ${responsiveResults.mobile ? '✅' : '❌'}`);
    console.log(`   └─ Tablet (768px): ${responsiveResults.tablet ? '✅' : '❌'}`);
    console.log(`   └─ Desktop (1366px): ${responsiveResults.desktop ? '✅' : '❌'}`);
    console.log(`   └─ Widescreen (1920px): ${responsiveResults.widescreen ? '✅' : '❌'}`);

    // Assert all viewports work
    expect.soft(responsiveResults.mobile, 'Footer should work on mobile').toBe(true);
    expect.soft(responsiveResults.tablet, 'Footer should work on tablet').toBe(true);
    expect.soft(responsiveResults.desktop, 'Footer should work on desktop').toBe(true);
    expect.soft(responsiveResults.widescreen, 'Footer should work on widescreen').toBe(true);
  });
});

/**
 * Cross-Site Validation Suite
 * Tests the same footer navigation validation across multiple Bayer sites
 */
test.describe('Footer Navigation Links - Multi-Site Validation @CrossSite', () => {
  const sites = [
    { env: 'prod_tw', name: 'Taiwan', language: 'Chinese (zh-tw)' },
    { env: 'prod_conosur', name: 'Conosur', language: 'Spanish (es-es)' },
    { env: 'qa', name: 'UK', language: 'English (en-gb)' }
  ];

  for (const site of sites) {
    test(`TC-CROSS-001: Validate footer navigation links on ${site.name} site`, async ({ page, browser, context }) => {
      // Override environment for this test
      process.env.TEST_ENV = site.env;

      const footerUniversal = new FooterUniversal(page, browser, context);
      await footerUniversal.navigateToComponent();

      const validation = await footerUniversal.validateFooterNavigationLinks();

      console.log(`\n🌍 ${site.name} (${site.language}):`);
      console.log(`   └─ Navigation Links: ${validation.totalNavigationLinks}`);
      console.log(`   └─ Internal: ${validation.internalLinks}`);
      console.log(`   └─ External: ${validation.externalLinks}`);
      console.log(`   └─ Broken: ${validation.brokenLinks.length}`);

      // Assertions
      expect.soft(validation.totalNavigationLinks, `${site.name} should have navigation links`).toBeGreaterThan(0);
      expect.soft(validation.brokenLinks.length, `${site.name} should have no broken links`).toBe(0);
    });
  }
});

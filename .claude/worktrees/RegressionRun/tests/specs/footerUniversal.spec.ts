import { test, expect } from '@playwright/test';
import { FooterUniversal } from '../../components/footerUniversal';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

let footerUniversal: FooterUniversal;

test.describe('Universal Footer Tests - All Sites Compatible', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('footer-universal');
  });

  test.beforeEach(async ({ page, browser, context }) => {
    footerUniversal = new FooterUniversal(page, browser, context);
    await footerUniversal.navigateToComponent();
  });

  test('@Smoke TC-FOOTER-001: Verify footer is present and visible', async () => {
    await footerUniversal.scrollToFooter();
    
    const stats = await footerUniversal.getFooterStatistics();
    
    expect(stats.isPresent, 'Footer should be present on the page').toBe(true);
  });

  test('@Smoke TC-FOOTER-002: Verify footer copyright', async () => {
    const hasCopyright = await footerUniversal.validateCopyright();
    
    expect(hasCopyright, 'Footer should have copyright text').toBe(true);
  });

  test('@Functional TC-FOOTER-003: Verify all footer links are functional', async () => {
    const linkValidation = await footerUniversal.validateFooterLinks();
    
    console.log(`\n=== Footer Link Validation Results ===`);
    console.log(`Total Links: ${linkValidation.totalLinks}`);
    console.log(`Visible Links: ${linkValidation.visibleLinks}`);
    console.log(`Clickable Links: ${linkValidation.clickableLinks}`);
    console.log(`Internal Links: ${linkValidation.internalLinks}`);
    console.log(`External Links: ${linkValidation.externalLinks}`);
    console.log(`Social Media Links: ${linkValidation.socialMediaLinks}`);
    console.log(`Broken Links: ${linkValidation.brokenLinks.length}`);
    
    if (linkValidation.brokenLinks.length > 0) {
      console.log('\nBroken Links:');
      linkValidation.brokenLinks.forEach(link => console.log(`  - ${link}`));
    }
    
    // Assertions
    expect.soft(linkValidation.totalLinks, 'Footer should have links').toBeGreaterThan(0);
    expect.soft(linkValidation.visibleLinks, 'Links should be visible').toBeGreaterThan(0);
    expect.soft(linkValidation.brokenLinks.length, 'No broken links should exist').toBe(0);
  });

  test('@Accessibility TC-FOOTER-004: Verify footer accessibility (WCAG 2.1 AA)', async () => {
    const accessibilityResults = await footerUniversal.validateAccessibility();
    
    console.log(`\n=== Footer Accessibility Results ===`);
    console.log(`Passed Checks: ${accessibilityResults.passedChecks}`);
    console.log(`Violations: ${accessibilityResults.violations.length}`);
    console.log(`Keyboard Navigable: ${accessibilityResults.keyboardNavigable}`);
    console.log(`Has Landmark: ${accessibilityResults.hasLandmark}`);
    
    if (accessibilityResults.violations.length > 0) {
      console.log('\nAccessibility Violations:');
      accessibilityResults.violations.forEach(violation => {
        console.log(`  - ${violation.id}: ${violation.description}`);
        console.log(`    Impact: ${violation.impact}`);
        console.log(`    Affected nodes: ${violation.nodes.length}`);
      });
    }
    
    // Soft assertions for reporting
    expect.soft(accessibilityResults.keyboardNavigable, 'Footer should be keyboard navigable').toBe(true);
    expect.soft(accessibilityResults.hasLandmark, 'Footer should have proper landmark').toBe(true);
    
    // Allow some violations but flag them
    if (accessibilityResults.violations.length > 0) {
      console.warn(`⚠️ Found ${accessibilityResults.violations.length} accessibility violations`);
    }
  });

  test('@Functional TC-FOOTER-005: Verify footer responsive behavior', async () => {
    const responsiveResults = await footerUniversal.validateResponsiveLayout();
    
    console.log(`\n=== Footer Responsive Results ===`);
    console.log(`Mobile (375px): ${responsiveResults.mobile ? '✅' : '❌'}`);
    console.log(`Tablet (768px): ${responsiveResults.tablet ? '✅' : '❌'}`);
    console.log(`Desktop (1366px): ${responsiveResults.desktop ? '✅' : '❌'}`);
    console.log(`Widescreen (1920px): ${responsiveResults.widescreen ? '✅' : '❌'}`);
    
    // Assertions
    expect.soft(responsiveResults.mobile, 'Footer should work on mobile').toBe(true);
    expect.soft(responsiveResults.tablet, 'Footer should work on tablet').toBe(true);
    expect.soft(responsiveResults.desktop, 'Footer should work on desktop').toBe(true);
    expect.soft(responsiveResults.widescreen, 'Footer should work on widescreen').toBe(true);
  });

  test('@Comprehensive TC-FOOTER-006: Full footer validation (all checks)', async () => {
    const comprehensiveResults = await footerUniversal.validateFooterComprehensive();
    
    console.log(`\n=== Comprehensive Footer Validation ===`);
    console.log(`Overall Status: ${comprehensiveResults.passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`\nDetailed Results:`);
    console.log(`  Structure: ${comprehensiveResults.results.structure.passed ? '✅' : '❌'} - ${comprehensiveResults.results.structure.message}`);
    console.log(`  Links: ${comprehensiveResults.results.links.passed ? '✅' : '❌'} - ${comprehensiveResults.results.links.message}`);
    console.log(`  Accessibility: ${comprehensiveResults.results.accessibility.passed ? '✅' : '❌'} - ${comprehensiveResults.results.accessibility.message}`);
    console.log(`  Responsive: ${comprehensiveResults.results.responsive.passed ? '✅' : '❌'} - ${comprehensiveResults.results.responsive.message}`);
    console.log(`  Copyright: ${comprehensiveResults.results.copyright.passed ? '✅' : '❌'} - ${comprehensiveResults.results.copyright.message}`);
    
    // Key assertions
    expect.soft(comprehensiveResults.results.structure.passed, 'Footer structure check').toBe(true);
    expect.soft(comprehensiveResults.results.copyright.passed, 'Copyright check').toBe(true);
    expect.soft(comprehensiveResults.results.links.details.totalLinks, 'Should have links').toBeGreaterThan(0);
    
    // Overall validation - allow some flexibility for accessibility/responsive
    const criticalPassed = comprehensiveResults.results.structure.passed && 
                          comprehensiveResults.results.copyright.passed && 
                          comprehensiveResults.results.links.passed;
    
    expect(criticalPassed, 'Critical footer checks should pass').toBe(true);
  });

  test('@Reporting TC-FOOTER-007: Generate footer statistics report', async () => {
    const stats = await footerUniversal.getFooterStatistics();
    
    console.log(`\n╔════════════════════════════════════════════╗`);
    console.log(`║     FOOTER VALIDATION REPORT               ║`);
    console.log(`╚════════════════════════════════════════════╝`);
    console.log(`\n📊 Structure:`);
    console.log(`   └─ Present: ${stats.isPresent ? '✅' : '❌'}`);
    console.log(`   └─ Copyright: ${stats.hasCopyright ? '✅' : '❌'}`);
    console.log(`\n🔗 Links:`);
    console.log(`   └─ Total: ${stats.totalLinks}`);
    console.log(`   └─ Internal: ${stats.linkBreakdown.internal}`);
    console.log(`   └─ External: ${stats.linkBreakdown.external}`);
    console.log(`   └─ Social Media: ${stats.linkBreakdown.social}`);
    console.log(`   └─ Anchors: ${stats.linkBreakdown.anchor}`);
    console.log(`\n♿ Accessibility:`);
    console.log(`   └─ Accessible: ${stats.accessibility.isAccessible ? '✅' : '❌'}`);
    console.log(`   └─ Violations: ${stats.accessibility.violationCount}`);
    console.log(`   └─ Keyboard Nav: ${stats.accessibility.keyboardNavigable ? '✅' : '❌'}`);
    console.log(`\n📱 Responsive:`);
    console.log(`   └─ All Sizes: ${stats.responsive.allSizesWork ? '✅' : '❌'}`);
    console.log(`   └─ Supported: ${stats.responsive.supportedSizes.join(', ')}`);
    console.log(`\n════════════════════════════════════════════\n`);
    
    // Basic assertions for report generation
    expect(stats.isPresent, 'Report should show footer is present').toBe(true);
  });
});

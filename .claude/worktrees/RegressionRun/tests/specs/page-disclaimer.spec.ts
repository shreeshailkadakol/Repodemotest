import { test, expect } from '@playwright/test';
import { PageDisclaimerComponent } from '../../components/pageDisclaimerComponent';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

const viewports = {
  XL: { width: 1440, height: 900 },
  LG: { width: 1024, height: 768 },
  MD: { width: 768, height: 1024 },
  SM: { width: 375, height: 812 },
};

/**
 * Page Disclaimer Component Test Suite
 *
 * This comprehensive test suite validates the Page Disclaimer modal functionality
 * according to the following Acceptance Criteria:
 *
 * AC4: Modal appears when landing on page with Page Disclaimer active
 * AC5: Continue button closes modal and shows desired page
 * AC6: Cancel button redirects to defined redirect link
 * AC7: Component adapts responsively across all viewports
 *
 * Test Categories:
 * - @functional : Core functionality validation
 * - @accessibility: WCAG compliance and keyboard navigation
 * - @visual: Design token validation and responsive behavior
 * - @performance: Load times and interaction responsiveness
 *
 * Actual DOM Structure (from live inspection):
 * - Modal Overlay: [data-qa="popup-overlay"]
 * - Modal Container: [data-qa="popup"]
 * - Continue Button: [data-qa="disclaimer-primary-button"]
 * - Cancel Button: [data-qa="disclaimer-secondary-button"]
 */

test.describe('Page Disclaimer Modal Component', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('page-disclaimer');
  });

  let pageDisclaimer: PageDisclaimerComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    pageDisclaimer = new PageDisclaimerComponent(page, browser, context);
    await pageDisclaimer.navigateToPageDisclaimerPage();
    await pageDisclaimer.waitForModalReady();
  });

  // ==========================================
  // FUNCTIONAL TESTS (AC4-AC6 COVERAGE)
  // ==========================================

  test('TC-PD-001: Modal appears on page load (AC4) @functional @Smoke @UKSmoke', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    // AC4: Modal should appear when landing on page with Page Disclaimer active
    await pageDisclaimer.validateModalAppearsOnLoad();
  });


  test('TC-PD-003: Continue button functionality (AC5) @functional', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    // AC5: Continue button should close modal and show desired page
    await pageDisclaimer.testContinueButtonFunctionality();
  });

  test('TC-PD-004: Cancel button functionality (AC6) @functional', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    // AC6: Cancel button should redirect to defined redirect link
    await pageDisclaimer.testCancelButtonFunctionality();
  });

  test('TC-PD-005: Modal positioning and visibility @functional  @visual', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    // Test modal positioning across viewports
    for (const [, viewport] of Object.entries(viewports)) {
      await pageDisclaimer.validateModalPositioning(viewport);
    }
  });

  test('TC-PD-006: Overlay interaction behavior @functional', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    // Test overlay click behavior (should not dismiss modal in most implementations)
    await pageDisclaimer.testOverlayDismissal();
  });

  // ==========================================
  // ACCESSIBILITY TESTS (WCAG COMPLIANCE)
  // ==========================================

  test('TC-PD-007: Keyboard navigation - Tab sequence @accessibility', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    await pageDisclaimer.testKeyboardNavigation();
  });

  test('TC-PD-008: Keyboard navigation - Escape key @accessibility', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    await pageDisclaimer.testEscapeKeyBehavior();
  });

  test('TC-PD-009: Focus management and accessibility @accessibility', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    // WCAG Compliance: Modal MUST have proper accessibility attributes
    // This test will fail until component team adds role='dialog' and ARIA attributes
    await pageDisclaimer.validateAccessibility();
  });

  test('TC-PD-010: Screen reader compatibility @accessibility', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    // WCAG Compliance: Modal MUST have ARIA attributes for screen reader compatibility
    // This test will fail until component team implements proper ARIA labeling
    await pageDisclaimer.validateAccessibility();
  });

  test('TC-PD-011: Color contrast compliance @accessibility @visual', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    await pageDisclaimer.validateColorContrast();
  });

  test('TC-PD-011B: Visual design tokens validation @visual', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    // Test continues even if individual validations fail - comprehensive font, color, and spacing validation
    await pageDisclaimer.validateVisualDesignTokens();

    // Additional viewport-specific visual validation
    for (const [, viewport] of Object.entries(viewports)) {
      await page.setViewportSize(viewport);
      await pageDisclaimer.validateModalPositioning(viewport);
    }
  });

  // ==========================================
  // VISUAL REGRESSION TESTS (AC7 COVERAGE)
  // ==========================================

  test('TC-PD-012: XL viewport design validation (AC7) @visual', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    await page.setViewportSize(viewports.XL);
    await pageDisclaimer.validateModalAppearsOnLoad();

    // Visual screenshot comparison
    await pageDisclaimer.takeModalScreenshot('page-disclaimer-xl-viewport');
  });

  test('TC-PD-013: LG viewport design validation (AC7) @visual', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    await page.setViewportSize(viewports.LG);
    await pageDisclaimer.validateModalAppearsOnLoad();
    await pageDisclaimer.takeModalScreenshot('page-disclaimer-lg-viewport');
  });

  test('TC-PD-014: MD viewport design validation (AC7) @visual', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    await page.setViewportSize(viewports.MD);
    await pageDisclaimer.validateModalAppearsOnLoad();
    await pageDisclaimer.takeModalScreenshot('page-disclaimer-md-viewport');
  });

  test('TC-PD-015: SM viewport design validation (AC7) @visual', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    await page.setViewportSize(viewports.SM);
    await pageDisclaimer.validateModalAppearsOnLoad();
    await pageDisclaimer.takeModalScreenshot('page-disclaimer-sm-viewport');
  });

  // ==========================================
  // PERFORMANCE TESTS
  // ==========================================

  test('TC-PD-016: Modal load performance @performance', async ({ page, browser, context }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    const loadTime = await pageDisclaimer.measureModalPerformance();
    expect.soft(loadTime).toBeLessThan(4000); // Modal should load within 4 seconds (adjusted for QA environment)
  });

  test('TC-PD-017: Button interaction responsiveness @performance', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    // Measure button click responsiveness
    const startTime = Date.now();
    await pageDisclaimer.testContinueButtonFunctionality();
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect.soft(responseTime).toBeLessThan(4000); // Button should respond within 4 seconds (adjusted for QA environment + cookie dismissal overhead)
  });

  // ==========================================
  // ERROR HANDLING & EDGE CASES
  // ==========================================

  test('TC-PD-018: Modal behavior on slow network @functional', async ({
    page,
    browser,
    context,
  }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    // Simulate slow network conditions
    await page.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });

    await pageDisclaimer.validateModalAppearsOnLoad();
  });

  test('TC-PD-019: Modal state validation @functional', async ({ page, browser, context }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    const modalState = await pageDisclaimer.getModalState();
    expect.soft(modalState.overlayVisible).toBe(true);
    expect.soft(modalState.containerVisible).toBe(true);
    expect.soft(modalState.continueVisible).toBe(true);
    expect.soft(modalState.cancelVisible).toBe(true);
  });

  test('TC-PD-020: Multiple viewport transitions @visual', async ({ page, browser, context }) => {
    const pageDisclaimer = new PageDisclaimerComponent(page, browser, context);

    // Test modal behavior during viewport transitions - each viewport tested independently
    for (const [viewportName, viewport] of Object.entries(viewports)) {
      await page.setViewportSize(viewport);

      // Use soft assertions to ensure all viewports are tested even if one fails
      await test.step(`Testing ${viewportName} viewport (${viewport.width}x${viewport.height})`, async () => {
        await pageDisclaimer.validateModalAppearsOnLoad();
        await pageDisclaimer.validateModalPositioning(viewport);
        // Viewport validation completed for viewportName
      });
    }
  });
});

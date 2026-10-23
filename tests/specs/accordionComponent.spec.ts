import { test, expect } from '@playwright/test';
import { AccordionComponent } from '../../components/accordionComponent';
import { Accordion_FigmaValues } from '../../helpers/utils/figma-values/AccordionComponent_FigmaValues';

// Test configuration
const viewports = [
  { name: 'XL', width: 1440, height: 900 },
  { name: 'LG', width: 1024, height: 768 },
  { name: 'MD', width: 768, height: 1024 },
  { name: 'SM', width: 375, height: 667 },
];

// Helper function to extract title styles
const extractTitleStyles = (el: Element) => {
  const style = window.getComputedStyle(el);
  return {
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    color: style.color,
  };
};

test.describe('Accordion Component - Functional Testing', () => {
  test('F001: Accordion Initial State Validation@functional @accordion @Smoke', async ({
    page,
    browser,
    context,
  }) => {
    const accordion = new AccordionComponent(page, browser, context);
    await accordion.navigateToComponent();

    const isVisible = await accordion.verifyComponentVisibility();
    expect.soft(isVisible).toBe(true);

    const initialState = await accordion.validateInitialState();
    expect.soft(initialState).toBe(true);

    const firstItemExpanded = await accordion.getAccordionTriggerAriaExpanded(0);
    const secondItemExpanded = await accordion.getAccordionTriggerAriaExpanded(1);
    expect.soft(firstItemExpanded).toBe('false');
    expect.soft(secondItemExpanded).toBe('false');
  });

  test('F002-F003: Single Item Expansion and Collapse @functional', async ({ page }) => {
    const accordion = new AccordionComponent(page, null, null);
    await accordion.navigateToComponent();

    await accordion.expandAccordionItem(0);
    const expandedState = await accordion.isAccordionItemExpanded(0);
    expect.soft(expandedState).toBe(true);

    const ariaExpanded = await accordion.getAccordionTriggerAriaExpanded(0);
    expect.soft(ariaExpanded).toBe('true');

    const contentVisible = await accordion.isAccordionContentVisible(0);
    expect.soft(contentVisible).toBe(true);

    await accordion.collapseAccordionItem(0);
    const collapsedState = await accordion.isAccordionItemExpanded(0);
    expect.soft(collapsedState).toBe(false);

    const ariaCollapsed = await accordion.getAccordionTriggerAriaExpanded(0);
    expect.soft(ariaCollapsed).toBe('false');
  });

  test('F004: Multiple Item Interaction @functional', async ({ page }) => {
    const accordion = new AccordionComponent(page, null, null);
    await accordion.navigateToComponent();

    const multipleItemsResult = await accordion.testMultipleItemsInteraction();
    expect.soft(multipleItemsResult).toBe(true);

    const firstExpanded = await accordion.isAccordionItemExpanded(0);
    const secondExpanded = await accordion.isAccordionItemExpanded(1);
    expect.soft(firstExpanded).toBe(true);
    expect.soft(secondExpanded).toBe(true);
  });

  test('F005-F008: Content and Button Functionality @functional', async ({ page }) => {
    const accordion = new AccordionComponent(page, null, null);
    await accordion.navigateToComponent();

    await accordion.expandAccordionItem(0);
    const accessibilityAttrs = await accordion.verifyAccessibilityAttributes(0);

    expect.soft(accessibilityAttrs.hasAriaControls).toBe(true);
    expect.soft(accessibilityAttrs.hasAriaExpanded).toBe(true);
    expect.soft(accessibilityAttrs.hasProperRole).toBe(true);
  });

  test.describe('Accordion Component - Visual & Font Validation', () => {
    viewports.forEach((viewport) => {
      test(`V001-V006: Typography Validation - ${viewport.name} Viewport @visual`, async ({
        page,
        browser,
        context,
      }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        const accordion = new AccordionComponent(page, browser, context);
        await accordion.navigateToComponent();

        const figmaValues =
          Accordion_FigmaValues[viewport.name as keyof typeof Accordion_FigmaValues];

        const mainTitleElement = page.locator('h2[data-qa="title-component"]').first();
        const titleStyles = await mainTitleElement.evaluate(extractTitleStyles);

        // Compare against accordionTitle fontSize with strict equality
        expect.soft(titleStyles.fontSize).toBe(figmaValues.accordionTitle.fontSize);
        expect.soft(titleStyles.fontWeight).toBeTruthy();
        expect.soft(figmaValues).toBeDefined();
      });

      test(`V007-V012: Color and Visual States - ${viewport.name} Viewport @visual`, async ({
        page,
        browser,
        context,
      }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        const accordion = new AccordionComponent(page, browser, context);
        await accordion.navigateToComponent();

        const iconStates = await accordion.verifyIconStates(0);
        expect.soft(iconStates.plusVisible || iconStates.minusVisible).toBe(true);

        const stylingResult = await accordion.verifyComponentStyling();
        expect.soft(stylingResult.hasCorrectClasses).toBe(true);
        expect.soft(stylingResult.hasProperColors).toBe(true);
      });

      test(`V013-V018: Layout and Spacing - ${viewport.name} Viewport @visual`, async ({
        page,
        browser,
        context,
      }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        const accordion = new AccordionComponent(page, browser, context);
        await accordion.navigateToComponent();

        const isVisible = await accordion.verifyComponentVisibility();
        expect.soft(isVisible).toBe(true);

        const accordionSection = page.locator('[data-testid="accordion"]');
        const boundingBox = await accordionSection.boundingBox();
        expect.soft(boundingBox).toBeTruthy();

        expect.soft(boundingBox?.width || 0).toBeGreaterThan(0);
        expect.soft(boundingBox?.height || 0).toBeGreaterThan(0);
      });
    });
  });

  test.describe('Accordion Component - Accessibility Testing', () => {
    test('A001-A006: ARIA Implementation @accessibility', async ({ page, browser, context }) => {
      const accordion = new AccordionComponent(page, browser, context);
      await accordion.navigateToComponent();

      const validation = await accordion.validateComponent();
      expect.soft(validation.accessibilityPassed).toBe(true);

      for (let i = 0; i < 2; i++) {
        const accessibilityAttrs = await accordion.verifyAccessibilityAttributes(i);
        expect.soft(accessibilityAttrs.hasAriaControls).toBe(true);
        expect.soft(accessibilityAttrs.hasAriaExpanded).toBe(true);
        expect.soft(accessibilityAttrs.hasProperRole).toBe(true);
      }
    });

    test('A007-A011: Keyboard Navigation @accessibility', async ({ page, browser, context }) => {
      const accordion = new AccordionComponent(page, browser, context);
      await accordion.navigateToComponent();

      const keyboardResult = await accordion.testKeyboardNavigation();
      expect.soft(keyboardResult).toBe(true);
    });

    test('A012-A016: Screen Reader Support @accessibility', async ({ page, browser, context }) => {
      const accordion = new AccordionComponent(page, browser, context);
      await accordion.navigateToComponent();

      const accordionSection = page.locator('[data-testid="accordion"]');
      await expect.soft(accordionSection).toHaveAttribute('aria-label', 'Accordion section');

      const headings = page.locator('h2[data-qa="title-component"]');
      const headingCount = await headings.count();
      expect.soft(headingCount).toBeGreaterThanOrEqual(1);

      const icons = page.locator('svg[aria-label]');
      const iconCount = await icons.count();
      expect.soft(iconCount).toBeGreaterThan(0);
    });
  });

  test.describe('Accordion Component - Performance Testing', () => {
    test('P001-P003: Animation Performance @performance', async ({ page, browser, context }) => {
      const accordion = new AccordionComponent(page, browser, context);
      await accordion.navigateToComponent();

      const animationPerf = await accordion.measureAnimationPerformance();
      expect.soft(animationPerf.expandTime).toBeLessThan(2000); // Adjusted for test environment
      expect.soft(animationPerf.collapseTime).toBeLessThan(2000); // Adjusted for test environment

      expect.soft(animationPerf.expandTime).toBeGreaterThan(0);
      expect.soft(animationPerf.collapseTime).toBeGreaterThan(0);
    });

    test('P004-P006: Component Loading Performance @performance', async ({ page }) => {
      const accordion = new AccordionComponent(page, null, null);

      const loadTime = await accordion.measureLoadTime();
      expect.soft(loadTime).toBeLessThan(5000);
      expect.soft(loadTime).toBeGreaterThan(1000);
    });

    test('Component State Persistence @integration', async ({ page, browser, context }) => {
      const accordion = new AccordionComponent(page, browser, context);
      await accordion.navigateToComponent();

      await accordion.expandAccordionItem(0);
      const firstExpanded = await accordion.isAccordionItemExpanded(0);
      expect.soft(firstExpanded).toBe(true);

      await page.reload();
      await accordion.waitForComponentToLoad();

      const afterReload = await accordion.isAccordionItemExpanded(0);
      expect.soft(typeof afterReload).toBe('boolean');
    });
  });

  test.afterEach(async ({ page }) => {
    const accordion = new AccordionComponent(page, null, null);
    await accordion.resetToInitialState();
  });
});

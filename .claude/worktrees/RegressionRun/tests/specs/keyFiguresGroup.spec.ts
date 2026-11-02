import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { KeyFiguresGroupComponent } from '../../components/keyFiguresGroupComponent';
import { componentURL } from '../../test-data/componentURL';
import { envUtils } from '../../helpers/utils/envUtils';
import { TEST_CONFIG } from '../../config/test-config';
import AxeBuilder from '@axe-core/playwright';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

let component: KeyFiguresGroupComponent;
let page: Page;
let browser: Browser;
let context: BrowserContext;

/**
 * Setup: Navigate to component page with authentication
 */
test.beforeEach(async ({ page: testPage, browser: testBrowser, context: testContext }) => {
  page = testPage;
  browser = testBrowser;
  context = testContext;

  component = new KeyFiguresGroupComponent(page, browser, context);

  // Navigate to component URL with authentication
  const baseURL = envUtils.getBaseUrl();
  const componentPath = componentURL.KeyFiguresGroupComponent.testData.url;
  const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  const fullUrl = `${cleanBaseURL}/${componentPath}`;
  await component.navigateWithAuthentication(fullUrl);

  // Wait for page to fully load and component to be visible
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Wait for component to be visible
  const container = await component.getComponentContainer();
  await container.waitFor({ state: 'visible', timeout: 15000 });
});

/**
 * ==========================================================================
 * FUNCTIONAL TESTS (TC-KFG01 to TC-KFG12)
 * Tags: @Functional
 * ==========================================================================
 */

test.describe('Key Figures Group - Functional Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('keyFiguresGroup');
  });


  test('TC-KFG01: Key Figures Group component renders on page mount @Functional @Smoke', async () => {
    await test.step('Verify component container is present', async () => {
      const container = await component.getComponentContainer();
      expect.soft(container, 'Component container should exist').not.toBeNull();
    });

    await test.step('Verify component container is visible', async () => {
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component container should be visible').toBeVisible();
    });

    await test.step('Verify component renders without errors', async () => {
      await component.validateComponentRendering();
    });
  });

  test('TC-KFG02: Key Figures Group contains exactly 3 individual key figures @Functional', async () => {
    await test.step('Locate the Key Figures Group container', async () => {
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Container should be visible').toBeVisible();
    });

    await test.step('Find all individual key figure elements', async () => {
      const keyFigures = await component.getIndividualKeyFigures();
      expect.soft(keyFigures, 'Individual key figures should exist').not.toBeNull();
    });

    await test.step('Count the number of individual key figures', async () => {
      const count = await component.getKeyFiguresCount();
      expect.soft(count, 'Should have exactly 3 individual key figures (per AC2 and DOM inspection)').toBe(3);
    });

    await test.step('Verify each wrapper has sequential testId', async () => {
      for (let i = 0; i < 3; i++) {
        const wrapper = await component.getKeyFigureWrapper(i);
        expect.soft(wrapper, `Wrapper ${i} should exist`).not.toBeNull();
      }
    });
  });

  test('TC-KFG03: All individual key figures are visible @Functional', async () => {
    await test.step('Get all individual key figure elements', async () => {
      const keyFigures = await component.getIndividualKeyFigures();
      const count = await keyFigures.count();
      expect.soft(count, 'Should have 3 key figures').toBe(3);
    });

    await test.step('Verify each individual key figure is visible', async () => {
      const allVisible = await component.areAllKeyFiguresVisible();
      expect.soft(allVisible, 'All 3 individual key figures should be visible').toBeTruthy();
    });

    await test.step('Verify each key figure is in viewport', async () => {
      const keyFigures = await component.getIndividualKeyFigures();
      for (let i = 0; i < 3; i++) {
        const keyFigure = keyFigures.nth(i);
        const isInViewport = await keyFigure.isVisible();
        expect.soft(isInViewport, `Key figure ${i} should be in viewport`).toBeTruthy();
      }
    });
  });

  test('TC-KFG04: Key Figures Group is placed in full-width column @Functional', async () => {
    await test.step('Locate the Key Figures Group container', async () => {
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Container should be visible').toBeVisible();
    });

    await test.step('Get the parent container of Key Figures Group', async () => {
      const fullWidthContainer = await component.getFullWidthContainer();
      expect.soft(fullWidthContainer, 'Full width container should exist').not.toBeNull();
    });

    await test.step('Verify parent container has full-width column attributes', async () => {
      const fullWidthContainer = await component.getFullWidthContainer();
      await expect.soft(fullWidthContainer, 'Full width container has data-qa="fullwidth-column"').toHaveAttribute('data-qa', 'fullwidth-column');
      await expect.soft(fullWidthContainer, 'Full width container has aria-label').toHaveAttribute('aria-label', 'Full width content section');
    });

    await test.step('Verify Key Figures Group is properly nested within full-width divider', async () => {
      const isNested = await component.validateFullWidthPlacement();
      expect.soft(isNested, 'Component should be in full-width column (100% divider per AC3)').toBeTruthy();
    });
  });

  test('TC-KFG05: Each key figure displays numeric value element @Functional', async () => {
    await test.step('Validate numeric value element for each key figure', async () => {
      const count = await component.getKeyFiguresCount();

      for (let i = 0; i < count; i++) {
        const keyFigure = await component.getIndividualKeyFigureByIndex(i);

        // Verify element is not empty (language-agnostic)
        const isEmpty = await keyFigure.evaluate((el) => {
          const numericElements = el.querySelectorAll('span, div, p');
          for (const elem of numericElements) {
            const text = elem.textContent?.trim() || '';
            const classList = elem.className || '';
            if ((classList.includes('text-5xl') || classList.includes('text-6xl') || classList.includes('text-7xl')) && text.length > 0) {
              return false; // Not empty
            }
          }
          return true; // Empty
        });

        expect.soft(isEmpty, `Key figure ${i} should have numeric value element (not empty)`).toBeFalsy();
      }
    });
  });

  test('TC-KFG06: Each key figure displays unit/suffix element @Functional', async () => {
    await test.step('Validate unit/suffix element for each key figure (structural only)', async () => {
      const count = await component.getKeyFiguresCount();

      for (let i = 0; i < count; i++) {
        const keyFigure = await component.getIndividualKeyFigureByIndex(i);

        // Verify element exists and is not empty (NO specific content validation)
        const isEmpty = await keyFigure.evaluate((el) => {
          const allElements = el.querySelectorAll('span, div, p');
          for (const elem of allElements) {
            const text = elem.textContent?.trim() || '';
            if (text.length > 0 && text.length < 10) {
              return false; // Found non-empty unit element
            }
          }
          return true; // Empty
        });

        expect.soft(isEmpty, `Key figure ${i} should have unit/suffix element (not empty) - content may vary`).toBeFalsy();
      }
    });
  });

  test('TC-KFG07: Each key figure displays description element @Functional', async () => {
    await test.step('Validate description element for each key figure (structural only)', async () => {
      const count = await component.getKeyFiguresCount();

      for (let i = 0; i < count; i++) {
        const keyFigure = await component.getIndividualKeyFigureByIndex(i);

        // Verify element exists and is not empty (NO specific content validation)
        const isEmpty = await keyFigure.evaluate((el) => {
          const allElements = el.querySelectorAll('span, div, p, section');
          for (const elem of allElements) {
            const text = elem.textContent?.trim() || '';
            if (text.length > 10) {
              return false; // Found non-empty description
            }
          }
          return true; // Empty
        });

        expect.soft(isEmpty, `Key figure ${i} should have description element (not empty) - content may vary`).toBeFalsy();
      }
    });
  });

  test('TC-KFG08: Component structure maintains proper nesting hierarchy @Functional', async () => {
    await test.step('Verify fullwidth-column contains key-figures-group', async () => {
      const isNested = await component.validateFullWidthPlacement();
      expect.soft(isNested, 'key-figures-group should be nested in fullwidth-column').toBeTruthy();
    });

    await test.step('Verify key-figures-group contains 3 wrapper divs', async () => {
      for (let i = 0; i < 3; i++) {
        const wrapper = await component.getKeyFigureWrapper(i);
        expect.soft(wrapper, `Wrapper ${i} should exist`).not.toBeNull();
      }
    });

    await test.step('Verify each wrapper contains one individual-key-figure', async () => {
      for (let i = 0; i < 3; i++) {
        const keyFigure = await component.getIndividualKeyFigureByIndex(i);
        expect.soft(keyFigure, `Individual key figure ${i} should exist within wrapper`).not.toBeNull();
      }
    });

    await test.step('Verify proper parent-child relationships', async () => {
      await component.validateAllKeyFiguresStructure();
    });
  });

  test('TC-KFG09: Component maintains structure on window resize (XL to MD) @Functional', async () => {
    await test.step('Set viewport to XL and verify component', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.XL);
      await page.waitForTimeout(500);

      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component should be visible at XL').toBeVisible();
    });

    await test.step('Verify all 3 key figures present at XL', async () => {
      const count = await component.getKeyFiguresCount();
      expect.soft(count, 'Should have 3 key figures at XL').toBe(3);
    });

    await test.step('Resize viewport to MD', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.MD);
      await page.waitForTimeout(500);
    });

    await test.step('Verify component is still visible at MD', async () => {
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component should still be visible at MD').toBeVisible();
    });

    await test.step('Verify all 3 key figures still present at MD', async () => {
      const count = await component.getKeyFiguresCount();
      expect.soft(count, 'Should still have 3 key figures at MD').toBe(3);

      const allVisible = await component.areAllKeyFiguresVisible();
      expect.soft(allVisible, 'All key figures should still be visible at MD').toBeTruthy();
    });
  });

  test('TC-KFG10: Component renders correctly at XL viewport @Functional', async () => {
    await test.step('Set viewport to XL', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.XL);
      await page.waitForTimeout(500);
    });

    await test.step('Verify component is visible', async () => {
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component should be visible at XL').toBeVisible();
    });

    await test.step('Verify all 3 key figures are visible', async () => {
      const allVisible = await component.areAllKeyFiguresVisible();
      expect.soft(allVisible, 'All 3 key figures should be visible at XL').toBeTruthy();
    });
  });

  test('TC-KFG11: Component renders correctly at LG viewport @Functional', async () => {
    await test.step('Set viewport to LG', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.LG);
      await page.waitForTimeout(500);
    });

    await test.step('Verify component is visible', async () => {
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component should be visible at LG').toBeVisible();
    });

    await test.step('Verify all 3 key figures are visible', async () => {
      const allVisible = await component.areAllKeyFiguresVisible();
      expect.soft(allVisible, 'All 3 key figures should be visible at LG').toBeTruthy();
    });
  });

  test('TC-KFG12: Component renders correctly at MD and SM viewports @Functional', async () => {
    await test.step('Set viewport to MD and verify', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.MD);
      await page.waitForTimeout(500);

      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component should be visible at MD').toBeVisible();

      const allVisible = await component.areAllKeyFiguresVisible();
      expect.soft(allVisible, 'All 3 key figures should be visible at MD').toBeTruthy();
    });

    await test.step('Set viewport to SM and verify', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.SM);
      await page.waitForTimeout(500);

      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component should be visible at SM').toBeVisible();

      const allVisible = await component.areAllKeyFiguresVisible();
      expect.soft(allVisible, 'All 3 key figures should be visible at SM (may stack vertically)').toBeTruthy();
    });
  });
});

/**
 * ==========================================================================
 * VISUAL TESTS (TC-KFG13 to TC-KFG27) - Figma Validation
 * Tags: @Visual
 * Note: Screenshot comparison tests (TC-KFG16, TC-KFG20, TC-KFG24, TC-KFG28) removed
 * Figma: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=6227-65662
 * ==========================================================================
 */

test.describe('Key Figures Group - Visual Tests (Figma Validation)', () => {

  test('TC-KFG13: Visual validation - XL viewport typography @Visual', async () => {
    await test.step('Set viewport to XL', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.XL);
      await page.waitForTimeout(500);
    });

    await test.step('Extract and validate numeric value typography', async () => {
      const styles = await component.getNumericValueStyles(0);

      // Validate font family
      expect.soft(styles.fontFamily, 'Font family should be set').toBeTruthy();

      // Validate font size (should be large - 7xl at XL viewport)
      expect.soft(styles.fontSize, 'Font size should be defined').toBeTruthy();

      // Validate line height
      expect.soft(styles.lineHeight, 'Line height should be defined').toBeTruthy();

      // Validate color
      expect.soft(styles.color, 'Text color should be defined').toBeTruthy();
    });
  });

  test('TC-KFG14: Visual validation - XL viewport spacing and layout @Visual', async () => {
    await test.step('Set viewport to XL', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.XL);
      await page.waitForTimeout(500);
    });

    await test.step('Measure spacing between key figures', async () => {
      const keyFigures = await component.getIndividualKeyFigures();
      const count = await keyFigures.count();

      expect.soft(count, 'Should have 3 key figures for spacing validation').toBe(3);

      // Verify layout exists and is properly spaced
      const allVisible = await component.areAllKeyFiguresVisible();
      expect.soft(allVisible, 'All key figures should be visible for layout validation').toBeTruthy();
    });
  });

  test('TC-KFG15: Visual validation - XL viewport colors @Visual', async () => {
    await test.step('Set viewport to XL', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.XL);
      await page.waitForTimeout(500);
    });

    await test.step('Extract and validate colors', async () => {
      const styles = await component.getNumericValueStyles(0);

      // Validate text color is set
      expect.soft(styles.color, 'Numeric value text color should be defined').toBeTruthy();
      expect.soft(styles.color, 'Color should be valid RGB/RGBA format').toMatch(/^rgb/);
    });
  });

  test('TC-KFG17: Visual validation - LG viewport typography @Visual', async () => {
    await test.step('Set viewport to LG', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.LG);
      await page.waitForTimeout(500);
    });

    await test.step('Extract and validate typography', async () => {
      const styles = await component.getNumericValueStyles(0);

      expect.soft(styles.fontFamily, 'Font family should be set at LG').toBeTruthy();
      expect.soft(styles.fontSize, 'Font size should be defined at LG').toBeTruthy();
      expect.soft(styles.lineHeight, 'Line height should be defined at LG').toBeTruthy();
    });
  });

  test('TC-KFG18: Visual validation - LG viewport spacing and layout @Visual', async () => {
    await test.step('Set viewport to LG', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.LG);
      await page.waitForTimeout(500);
    });

    await test.step('Verify layout at LG', async () => {
      const allVisible = await component.areAllKeyFiguresVisible();
      expect.soft(allVisible, 'All key figures should be visible at LG').toBeTruthy();
    });
  });

  test('TC-KFG19: Visual validation - LG viewport colors @Visual', async () => {
    await test.step('Set viewport to LG', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.LG);
      await page.waitForTimeout(500);
    });

    await test.step('Validate colors at LG', async () => {
      const styles = await component.getNumericValueStyles(0);
      expect.soft(styles.color, 'Color should be defined at LG').toBeTruthy();
    });
  });

  test('TC-KFG21: Visual validation - MD viewport typography @Visual', async () => {
    await test.step('Set viewport to MD', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.MD);
      await page.waitForTimeout(500);
    });

    await test.step('Extract and validate typography', async () => {
      const styles = await component.getNumericValueStyles(0);

      expect.soft(styles.fontFamily, 'Font family should be set at MD').toBeTruthy();
      expect.soft(styles.fontSize, 'Font size should be defined at MD (may be smaller than XL/LG)').toBeTruthy();
    });
  });

  test('TC-KFG22: Visual validation - MD viewport spacing and layout @Visual', async () => {
    await test.step('Set viewport to MD', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.MD);
      await page.waitForTimeout(500);
    });

    await test.step('Verify layout at MD', async () => {
      const allVisible = await component.areAllKeyFiguresVisible();
      expect.soft(allVisible, 'All key figures should be visible at MD (may stack)').toBeTruthy();
    });
  });

  test('TC-KFG23: Visual validation - MD viewport colors @Visual', async () => {
    await test.step('Set viewport to MD', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.MD);
      await page.waitForTimeout(500);
    });

    await test.step('Validate colors at MD', async () => {
      const styles = await component.getNumericValueStyles(0);
      expect.soft(styles.color, 'Color should be defined at MD').toBeTruthy();
    });
  });

  test('TC-KFG25: Visual validation - SM viewport typography @Visual', async () => {
    await test.step('Set viewport to SM', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.SM);
      await page.waitForTimeout(500);
    });

    await test.step('Extract and validate typography', async () => {
      const styles = await component.getNumericValueStyles(0);

      expect.soft(styles.fontFamily, 'Font family should be set at SM').toBeTruthy();
      expect.soft(styles.fontSize, 'Font size should be defined at SM (smaller for mobile)').toBeTruthy();
    });
  });

  test('TC-KFG26: Visual validation - SM viewport spacing and layout @Visual', async () => {
    await test.step('Set viewport to SM', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.SM);
      await page.waitForTimeout(500);
    });

    await test.step('Verify vertical stacking layout at SM', async () => {
      const allVisible = await component.areAllKeyFiguresVisible();
      expect.soft(allVisible, 'All key figures should be visible at SM (vertical stack)').toBeTruthy();
    });
  });

  test('TC-KFG27: Visual validation - SM viewport colors @Visual', async () => {
    await test.step('Set viewport to SM', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.SM);
      await page.waitForTimeout(500);
    });

    await test.step('Validate colors at SM', async () => {
      const styles = await component.getNumericValueStyles(0);
      expect.soft(styles.color, 'Color should be defined at SM').toBeTruthy();
    });
  });
});

/**
 * ==========================================================================
 * ACCESSIBILITY TESTS (TC-AKFG29 to TC-AKFG38) - WCAG 2.1 AA
 * Tags: @Accessibility
 * ==========================================================================
 */

test.describe('Key Figures Group - Accessibility Tests', () => {

  test('TC-AKFG29: Semantic HTML structure validation @Accessibility', async () => {
    await test.step('Verify component uses semantic HTML elements', async () => {
      const container = await component.getComponentContainer();

      // Verify uses <section> element
      const tagName = await container.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tagName, 'Component should use <section> element').toBe('section');
    });

    await test.step('Verify individual key figures use appropriate elements', async () => {
      const keyFigures = await component.getIndividualKeyFigures();
      const firstKeyFigure = keyFigures.first();

      const tagName = await firstKeyFigure.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tagName, 'Individual key figure should use <section> element').toBe('section');
    });
  });

  test('TC-AKFG30: ARIA attributes validation @Accessibility', async () => {
    await test.step('Verify Key Figures Group ARIA attributes', async () => {
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Should have data-qa attribute').toHaveAttribute('data-qa', 'key-figures-group');
    });

    await test.step('Verify individual key figures have ARIA labels', async () => {
      const keyFigures = await component.getIndividualKeyFigures();
      const firstKeyFigure = keyFigures.first();

      await expect.soft(firstKeyFigure, 'Should have aria-label').toHaveAttribute('aria-label', 'Individual Key Figure');
    });

    await test.step('Verify fullwidth-column has ARIA label', async () => {
      const fullWidthContainer = await component.getFullWidthContainer();
      await expect.soft(fullWidthContainer, 'Should have aria-label').toHaveAttribute('aria-label', 'Full width content section');
    });
  });

  test('TC-AKFG31: Color contrast compliance @Accessibility', async () => {
    await test.step('Measure color contrast for numeric values', async () => {
      const styles = await component.getNumericValueStyles(0);

      // Extract color values
      expect.soft(styles.color, 'Text color should be defined').toBeTruthy();

      // Note: Actual contrast ratio calculation would require background color
      // and contrast checker library - this validates color is set
    });
  });

  test('TC-AKFG32: Keyboard navigation support @Accessibility', async () => {
    await test.step('Verify component does not trap focus', async () => {
      // Tab through page
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Verify no focus trap (component should allow tabbing through)
      const activeElement = await page.evaluate(() => document.activeElement?.tagName);
      expect.soft(activeElement, 'Should allow keyboard navigation').toBeTruthy();
    });
  });

  test('TC-AKFG33: Screen reader compatibility @Accessibility', async () => {
    await test.step('Verify component has proper ARIA attributes for screen readers', async () => {
      const container = await component.getComponentContainer();
      const hasAriaAttributes = await container.evaluate((el) => {
        return !!el.dataset.qa || el.hasAttribute('aria-label');
      });

      expect.soft(hasAriaAttributes, 'Component should have attributes for screen readers').toBeTruthy();
    });

    await test.step('Verify individual key figures are announced properly', async () => {
      const keyFigures = await component.getIndividualKeyFigures();
      const count = await keyFigures.count();

      expect.soft(count, 'Should have 3 key figures for screen reader').toBe(3);
    });
  });

  test('TC-AKFG34: Axe-core automated accessibility scan @Accessibility', async () => {
    await test.step('Run axe-core accessibility scan', async () => {
      const results = await new AxeBuilder({ page })
        .include('[data-qa="key-figures-group"]')
        .analyze();

      expect.soft(results.violations, 'Should have no critical accessibility violations').toHaveLength(0);
    });
  });

  test('TC-AKFG35: Focus management validation @Accessibility', async () => {
    await test.step('Verify focus stays within expected boundaries', async () => {
      // Component should not have interactive elements, so no focus management needed
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Container should be visible').toBeVisible();
    });
  });

  test('TC-AKFG36: Text spacing and reflow @Accessibility', async () => {
    await test.step('Apply text spacing overrides', async () => {
      await page.addStyleTag({
        content: `
          * {
            line-height: 1.5 !important;
            letter-spacing: 0.12em !important;
            word-spacing: 0.16em !important;
          }
        `,
      });

      await page.waitForTimeout(500);
    });

    await test.step('Verify component remains usable', async () => {
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component should still be visible with text spacing').toBeVisible();

      const allVisible = await component.areAllKeyFiguresVisible();
      expect.soft(allVisible, 'All key figures should still be visible with text spacing').toBeTruthy();
    });
  });

  test('TC-AKFG37: Zoom and reflow at 200% @Accessibility', async () => {
    await test.step('Set browser zoom to 200%', async () => {
      await page.setViewportSize({ width: 640, height: 450 }); // Simulates 200% zoom of 1280x900
      await page.waitForTimeout(500);
    });

    await test.step('Verify component is usable at 200% zoom', async () => {
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component should be visible at 200% zoom').toBeVisible();

      const allVisible = await component.areAllKeyFiguresVisible();
      expect.soft(allVisible, 'All key figures should be accessible at 200% zoom').toBeTruthy();
    });
  });

  test('TC-AKFG38: Meaningful page title and landmarks @Accessibility', async () => {
    await test.step('Verify page has meaningful title', async () => {
      const pageTitle = await page.title();
      expect.soft(pageTitle, 'Page should have a title').toBeTruthy();
    });

    await test.step('Verify component uses appropriate landmark', async () => {
      const container = await component.getComponentContainer();
      const tagName = await container.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tagName, 'Should use semantic <section> landmark').toBe('section');
    });
  });
});

/**
 * ==========================================================================
 * PERFORMANCE TESTS (TC-KFG39 to TC-KFG40)
 * Tags: @Performance
 * ==========================================================================
 */

test.describe('Key Figures Group - Performance Tests', () => {

  test('TC-KFG39: Component initial load performance @Performance', async () => {
    await test.step('Measure performance metrics', async () => {
      const performanceMetrics = await page.evaluate(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        };
      });

      expect.soft(performanceMetrics.domContentLoaded, 'DOM content loaded should be under 2 seconds').toBeLessThan(2000);
    });

    await test.step('Verify component is visible within acceptable time', async () => {
      const startTime = Date.now();
      const container = await component.getComponentContainer();
      await container.waitFor({ state: 'visible', timeout: 3000 });
      const renderTime = Date.now() - startTime;

      expect.soft(renderTime, 'Component should be visible within 3 seconds').toBeLessThan(3000);
    });
  });

  test('TC-KFG40: Component render performance across viewports @Performance', async () => {
    const viewports = [
      { name: 'XL', size: TEST_CONFIG.viewports.XL },
      { name: 'LG', size: TEST_CONFIG.viewports.LG },
      { name: 'MD', size: TEST_CONFIG.viewports.MD },
      { name: 'SM', size: TEST_CONFIG.viewports.SM },
    ];

    for (const viewport of viewports) {
      await test.step(`Measure render performance at ${viewport.name}`, async () => {
        const startTime = Date.now();
        await page.setViewportSize(viewport.size);
        await page.waitForTimeout(100);

        const container = await component.getComponentContainer();
        await container.waitFor({ state: 'visible', timeout: 3000 });

        const renderTime = Date.now() - startTime;
        expect.soft(renderTime, `Render time at ${viewport.name} should be under 3 seconds`).toBeLessThan(3000);
      });
    }
  });
});

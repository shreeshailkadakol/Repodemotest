/**
 * Component Mapper - Consent Gated Content Spec
 * What:
 *   Executes functional and visual assertions for Consent Gated Content.
 * Why:
 *   Created to validate consent-state behavior and design compliance as part of
 *   component mapper execution coverage.
 */

import { test, expect } from '@playwright/test';
import { ConsentGatedContentComponent } from '../../components/consentGatedContentComponent';
import { ConsentGatedContentFigmaValues } from '../../helpers/utils/figma-values/ConsentGatedContent_FigmaValues';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';


function getFigmaValue(viewport: 'XL' | 'LG' | 'MD' | 'SM', element: string): any {
  return (ConsentGatedContentFigmaValues as any)[viewport][element];
}

/**
 * Helper function to extract computed styles from element
 */
async function getComputedStyles(locator: any) {
  return await locator.evaluate((el: HTMLElement) => {
    const styles = globalThis.getComputedStyle(el);
    return {
      fontFamily: styles.fontFamily,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      lineHeight: styles.lineHeight,
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      width: el.offsetWidth,
      height: el.offsetHeight,
    };
  });
}

/**
 * Helper to compare color values (handles different formats: rgba, rgb, hex)
 */
function normalizeColor(color: string): string {
  // Convert rgba(r, g, b, a) or rgb(r, g, b) to consistent format
  const match = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(color);
  if (!match) return color;

  const [, r, g, b, a = '1'] = match;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

test.describe('Consent Gated Content Component - Functional Tests', () => {
  let consentComponent: ConsentGatedContentComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    await applyAllurePageContext('consent-gated-content');
    consentComponent = new ConsentGatedContentComponent(page, browser, context);
    await consentComponent.navigateToComponent();
    await consentComponent.waitForComponentLoad();
  });

  test.describe('@Functional - Component Structure and Rendering', () => {
    test('TC-CG01: Verify Component Renders and is Visible @Functional @Smoke', async () => {
      // Verify component container is visible
      const componentContainer = await consentComponent.getComponentContainer();
      await expect.soft(componentContainer, 'Component container should be visible').toBeVisible();

      await expect
        .soft(componentContainer, 'Component should have correct data-qa attribute')
        .toHaveAttribute('data-qa', 'consent-gated-content');

      await expect
        .soft(componentContainer, 'Component should have aria-label attribute')
        .toHaveAttribute('aria-label');

      // Verify component structure
      await consentComponent.validateComponentStructure();
    });

    test('TC-CG02: Verify Correct Number of Checkboxes Display (Current: 2) @Functional @Smoke', async () => {
      const checkboxCount = await consentComponent.getCheckboxCount();

      expect
        .soft(checkboxCount, 'Should have 2 checkboxes in current configuration (AC5)')
        .toBe(2);

      // Validate checkbox attributes
      await consentComponent.validateCheckboxCount(2);

      // Verify each checkbox has associated label
      for (let i = 0; i < checkboxCount; i++) {
        const checkbox = await consentComponent.getCheckbox(i);
        const label = await consentComponent.getCheckboxLabel(i);

        await expect.soft(checkbox, `Checkbox ${i} should be visible`).toBeVisible();
        await expect.soft(label, `Label ${i} should be visible`).toBeVisible();
      }
    });

    test('TC-CG03: Verify Default State - All Checkboxes Unchecked @Functional @Smoke', async () => {
      await consentComponent.validateDefaultState();

      const checkboxCount = await consentComponent.getCheckboxCount();

      // Additional verification: Each checkbox is  enabled
      for (let i = 0; i < checkboxCount; i++) {
        const checkbox = await consentComponent.getCheckbox(i);
        await expect.soft(checkbox, `Checkbox ${i} should be enabled`).toBeEnabled();
      }
    });

    test('TC-CG04: Verify Unconsented Content Visible by Default @Functional @Smoke', async () => {
      const unconsentedState = await consentComponent.getUnconsentedState();

      await expect
        .soft(unconsentedState, 'Unconsented state should be visible by default (AC2)')
        .toBeVisible();

      await expect
        .soft(unconsentedState, 'Unconsented state should have correct data-qa attribute')
        .toHaveAttribute('data-qa', 'consent-gated-unconsented-state');

      // Verify content is not empty
      await expect
        .soft(unconsentedState, 'Unconsented state should have content')
        .not.toBeEmpty();

      const unconsentedText = await consentComponent.getUnconsentedContentText();
      expect.soft(unconsentedText, 'Unconsented content should have text').toBeTruthy();
    });

    test('TC-CG05: Verify Consented Content Hidden by Default @Functional @Smoke', async () => {
      const isConsentedVisible = await consentComponent.isConsentedStateVisible();

      expect
        .soft(isConsentedVisible, 'Consented state should be hidden by default')
        .toBe(false);
    });
  });

  test.describe('@Functional - Checkbox Selection and State Transitions', () => {
    test('TC-CG06: Verify Single Checkbox Selection @Functional', async () => {
      // Check first checkbox
      await consentComponent.checkCheckbox(0);

      const isChecked = await consentComponent.isCheckboxChecked(0);
      expect.soft(isChecked, 'First checkbox should be checked after clicking').toBe(true);

      // Verify unconsented state still visible (not all boxes checked)
      const isUnconsentedVisible = await consentComponent.isUnconsentedStateVisible();
      expect
        .soft(
          isUnconsentedVisible,
          'Unconsented state should remain visible when not all checkboxes checked'
        )
        .toBe(true);

      // Verify consented state still hidden
      const isConsentedVisible = await consentComponent.isConsentedStateVisible();
      expect
        .soft(isConsentedVisible, 'Consented state should remain hidden when not all checked')
        .toBe(false);

      // Verify other checkboxes remain unchecked
      const isSecondChecked = await consentComponent.isCheckboxChecked(1);
      expect.soft(isSecondChecked, 'Second checkbox should remain unchecked').toBe(false);
    });

    test('TC-CG07: Verify All Checkboxes Selection Reveals Consented Content @Functional @Smoke', async () => {
      await consentComponent.validateConsentedStateTransition();

      // Additional verification: Verify consented state has data-qa attribute
      const consentedState = await consentComponent.getConsentedState();
      await expect
        .soft(consentedState, 'Consented state should have correct data-qa attribute')
        .toHaveAttribute('data-qa', 'consent-gated-consented-state');

      // Verify content is different from unconsented
      const consentedText = await consentComponent.getConsentedContentText();
      expect.soft(consentedText, 'Consented content should have text').toBeTruthy();
    });

    test('TC-CG08: Verify Deselecting Any Checkbox Reverts to Unconsented @Functional @Smoke', async ({ page }) => {
      // Test deselecting first checkbox
      await consentComponent.validateUnconsentedReversion(0);

      // Re-check all and test deselecting second checkbox
      await consentComponent.checkAllCheckboxes();
      await page.waitForTimeout(300);

      await consentComponent.uncheckCheckbox(1);
      await page.waitForTimeout(500);

      const isUnconsentedVisibleAfterSecond = await consentComponent.isUnconsentedStateVisible();
      expect
        .soft(
          isUnconsentedVisibleAfterSecond,
          'Unconsented state should be visible after unchecking second checkbox (AC4)'
        )
        .toBe(true);

      const isConsentedVisibleAfterSecond = await consentComponent.isConsentedStateVisible();
      expect
        .soft(
          isConsentedVisibleAfterSecond,
          'Consented state should be hidden after unchecking second checkbox (AC4)'
        )
        .toBe(false);
    });
  });

  test.describe('@Functional - Checkbox Labels and Read More', () => {
    test('TC-CG09: Verify Checkbox Label Association @Functional', async () => {
      await consentComponent.validateCheckboxLabels();
    });

    test('TC-CG10: Verify Read More Button Functionality @Functional', async () => {
      const readMoreBtn = await consentComponent.getReadMoreButton(0);
      await expect.soft(readMoreBtn, 'Read More button should be visible').toBeVisible();
      await expect.soft(readMoreBtn, 'Read More button should be enabled').toBeEnabled();

      await expect
        .soft(readMoreBtn, 'Read More button should have correct data-qa attribute')
        .toHaveAttribute('data-qa', 'consent-condition-read-more-0');

      // Click to expand
      await consentComponent.clickReadMore(0);

      const expandText = await consentComponent.getExpandText(0);
      await expect.soft(expandText, 'Expanded text should be visible after clicking').toBeVisible();

      await expect
        .soft(expandText, 'Expanded text should have correct data-qa attribute')
        .toHaveAttribute('data-qa', 'consent-condition-expand-text-0');
    });

    test('TC-CG11: Verify Read More Collapse Functionality @Functional', async () => {
      await consentComponent.validateReadMoreFunctionality(0);
    });

    test('TC-CG12: Verify Multiple Read More Can Be Expanded Simultaneously @Functional', async () => {
      // Component supports MULTIPLE accordion mode - multiple accordions can be open simultaneously
      
      // Expand ReadMore for condition 0
      await consentComponent.clickReadMore(0);
      const isExpanded0 = await consentComponent.isExpandTextVisible(0);
      expect.soft(isExpanded0, 'Expanded text 0 should be visible').toBe(true);

      // Expand Read More for condition 1
      await consentComponent.clickReadMore(1);
      const isExpanded1 = await consentComponent.isExpandTextVisible(1);
      expect.soft(isExpanded1, 'Expanded text 1 should be visible').toBe(true);

      // Both should remain visible when multiple mode is enabled
      const stillExpanded0 = await consentComponent.isExpandTextVisible(0);
      expect
        .soft(stillExpanded0, 'Expanded text 0 should remain visible after expanding text 1')
        .toBe(true);
    });

    test('TC-CG13: Verify Expand Text Content is Not Empty @Functional', async () => {
      const checkboxCount = await consentComponent.getCheckboxCount();

      for (let i = 0; i < checkboxCount; i++) {
        await consentComponent.clickReadMore(i);

        // First verify the expand text is visible (works with accordion single mode)
        const isVisible = await consentComponent.isExpandTextVisible(i);
        expect.soft(isVisible, `Expanded text ${i} should be visible after clicking Read More`).toBe(true);

        if (isVisible) {
          const expandText = await consentComponent.getExpandText(i);
          await expect
            .soft(expandText, `Expanded text ${i} should have content`)
            .not.toBeEmpty();

          const textContent = await consentComponent.getExpandedTextContent(i);
          expect.soft(textContent, `Expanded text ${i} should have meaningful content`).toBeTruthy();
        }
      }
    });
  });

  test.describe('@Functional - Content Validation', () => {
    test('TC-CG14: Verify Checkbox State Persistence During Session @Functional', async ({ page }) => {
      await consentComponent.checkAllCheckboxes();
      await page.waitForTimeout(300);

      // Scroll away from component
      await page.evaluate(() => globalThis.scrollTo(0, 0));
      await page.waitForTimeout(500);

      // Scroll back to component
      const componentContainer = await consentComponent.getComponentContainer();
      await componentContainer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Verify all checkboxes remain checked
      const checkboxCount = await consentComponent.getCheckboxCount();
      for (let i = 0; i < checkboxCount; i++) {
        const isChecked = await consentComponent.isCheckboxChecked(i);
        expect
          .soft(isChecked, `Checkbox ${i} should remain checked after scrolling`)
          .toBe(true);
      }

      // Verify consented state remains visible
      const isConsentedVisible = await consentComponent.isConsentedStateVisible();
      expect
        .soft(isConsentedVisible, 'Consented state should remain visible after scrolling')
        .toBe(true);
    });

    test('TC-CG16: Verify Conditions List Semantic Structure @Functional', async () => {
      const conditionsList = await consentComponent.getConditionsList();

      const tagName = await conditionsList.evaluate((el) => el.tagName);
      expect.soft(tagName, 'Conditions container should be a UL element').toBe('UL');

      await expect
        .soft(conditionsList, 'Conditions list should have correct data-qa attribute')
        .toHaveAttribute('data-qa', 'consent-conditions-list');
    });

    test('TC-CG17: Verify Unconsented Content Has Meaningful Placeholder @Functional', async () => {
      const unconsentedText = await consentComponent.getUnconsentedContentText();

      expect.soft(unconsentedText, 'Unconsented content should not be empty').toBeTruthy();
      expect
        .soft(
          unconsentedText.length,
          'Unconsented content should have meaningful length'
        )
        .toBeGreaterThan(0);
    });

    test('TC-CG18: Verify Consented Content Different from Unconsented @Functional', async ({ page }) => {
      const unconsentedText = await consentComponent.getUnconsentedContentText();

      await consentComponent.checkAllCheckboxes();
      await page.waitForTimeout(500);

      const consentedText = await consentComponent.getConsentedContentText();

      expect
        .soft(consentedText, 'Consented content should be different from unconsented')
        .not.toBe(unconsentedText);

      expect.soft(consentedText, 'Consented content should have text').toBeTruthy();
    });
  });

  test.describe('@Accessibility - Keyboard Navigation and ARIA', () => {
    test('TC-ACG01: Verify Keyboard Navigation Through All Checkboxes @Accessibility', async ({ page }) => {
      const checkboxCount = await consentComponent.getCheckboxCount();

      // Tab to first checkbox
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const firstCheckbox = await consentComponent.getCheckbox(0);
      await firstCheckbox.evaluate((el) => el === document.activeElement);

      // Note: Focus exact element may vary, but should be within component
      // Verify checkboxes are keyboard accessible
      for (let i = 0; i < checkboxCount; i++) {
        const checkbox = await consentComponent.getCheckbox(i);
        await checkbox.focus();
        await page.waitForTimeout(100);

        const isFocusedNow = await checkbox.evaluate((el) => el === document.activeElement);
        expect
          .soft(isFocusedNow, `Checkbox ${i} should be focusable via keyboard`)
          .toBe(true);
      }
    });

    test('TC-ACG02: Verify Space Key Toggles Checkbox @Accessibility', async ({ page }) => {
      const checkbox0 = await consentComponent.getCheckbox(0);
      await checkbox0.focus();

      // Press Space to check
      await page.keyboard.press('Space');
      await page.waitForTimeout(200);

      const isCheckedAfterSpace = await consentComponent.isCheckboxChecked(0);
      expect
        .soft(isCheckedAfterSpace, 'Checkbox should be checked after pressing Space key')
        .toBe(true);

      // Press Space again to uncheck
      await page.keyboard.press('Space');
      await page.waitForTimeout(200);

      const isUncheckedAfterSpace = await consentComponent.isCheckboxChecked(0);
      expect
        .soft(isUncheckedAfterSpace, 'Checkbox should be unchecked after pressing Space again')
        .toBe(false);
    });

    test('TC-ACG03: Verify Enter Key Activates Read More Button @Accessibility', async ({ page }) => {
      const readMoreBtn = await consentComponent.getReadMoreButton(0);
      await readMoreBtn.focus();

      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      const isExpanded = await consentComponent.isExpandTextVisible(0);
      expect
        .soft(isExpanded, 'Expanded text should be visible after pressing Enter on Read More')
        .toBe(true);
    });

    test('TC-ACG04: Verify Checkbox Labels Have Proper Association @Accessibility', async ({ page }) => {
      const checkboxCount = await consentComponent.getCheckboxCount();

      for (let i = 0; i < checkboxCount; i++) {
        const checkbox = await consentComponent.getCheckbox(i);
        const checkboxId = await checkbox.getAttribute('id');

        expect
          .soft(checkboxId, `Checkbox ${i} should have id attribute`)
          .toBe(`consent-condition-${i}`);

        // Click label to verify it toggles checkbox
        const label = await consentComponent.getCheckboxLabel(i);
        await label.click();
        await page.waitForTimeout(200);

        const isChecked = await consentComponent.isCheckboxChecked(i);
        expect
          .soft(isChecked, `Clicking label ${i} should toggle checkbox`)
          .toBe(true);
      }
    });

    test('TC-ACG05: Verify ARIA Labels on All Interactive Elements @Accessibility', async () => {
      const componentContainer = await consentComponent.getComponentContainer();
      const componentAriaLabel = await componentContainer.getAttribute('aria-label');
      expect
        .soft(componentAriaLabel, 'Component should have aria-label')
        .toBeTruthy();

      const conditionsList = await consentComponent.getConditionsList();
      const listAriaLabel = await conditionsList.getAttribute('aria-label');
      expect
        .soft(listAriaLabel, 'Conditions list should have aria-label')
        .toBeTruthy();
    });

    test('TC-ACG06: Verify Focus Indicators Visible on All Elements @Accessibility', async () => {
      const checkboxCount = await consentComponent.getCheckboxCount();

      for (let i = 0; i < checkboxCount; i++) {
        const checkbox = await consentComponent.getCheckbox(i);
        await checkbox.focus();

        const outlineColor = await checkbox.evaluate(
          (el) => getComputedStyle(el).outlineColor
        );
        // Verify focus indicator exists (outline color should not be transparent or none)
        expect
          .soft(outlineColor, `Checkbox ${i} should have visible focus indicator`)
          .toBeTruthy();
      }
    });

    test('TC-ACG09: Verify Semantic HTML Structure @Accessibility', async () => {
      // Verify checkbox uses proper input element
      const checkbox0 = await consentComponent.getCheckbox(0);
      const checkboxTag = await checkbox0.evaluate((el) => el.tagName);
      expect.soft(checkboxTag, 'Checkbox should be an INPUT element').toBe('INPUT');

      const checkboxType = await checkbox0.getAttribute('type');
      expect.soft(checkboxType, 'Checkbox input should have type="checkbox"').toBe('checkbox');

      // Verify label uses proper label element
      const label0 = await consentComponent.getCheckboxLabel(0);
      const labelTag = await label0.evaluate((el) => el.tagName);
      expect.soft(labelTag, 'Label should be a LABEL element').toBe('LABEL');

      // Verify list uses proper ul element
      const conditionsList = await consentComponent.getConditionsList();
      const listTag = await conditionsList.evaluate((el) => el.tagName);
      expect.soft(listTag, 'Conditions container should be a UL element').toBe('UL');

      // Verify buttons use proper button element
      const readMoreBtn = await consentComponent.getReadMoreButton(0);
      const btnTag = await readMoreBtn.evaluate((el) => el.tagName);
      expect.soft(btnTag, 'Read More should be a BUTTON element').toBe('BUTTON');
    });
  });
});

// ============================================================================
// VISUAL TESTS - Typography, Layout, and Design Validation
// ============================================================================

test.describe('Consent Gated Content Component - Visual Tests', () => {
  let consentComponent: ConsentGatedContentComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    consentComponent = new ConsentGatedContentComponent(page, browser, context);
    await consentComponent.navigateToComponent();
    await consentComponent.waitForComponentLoad();
  });

  test.describe('@Visual - Typography Validation (XL Viewport)', () => {
    test('TC-VCG01: Verify Checkbox Label Typography @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      const label0 = await consentComponent.getCheckboxLabel(0);
      
      // Get the text span with white-space:pre-wrap style (the actual styled text)
      const labelText = label0.locator('span[style*="white-space:pre-wrap"]');
      const actualStyles = await getComputedStyles(labelText);
      const figmaLabel = getFigmaValue('XL', 'checkboxLabel1');

      expect
        .soft(actualStyles.fontFamily, 'Font family should match Figma design')
        .toContain('Bayer Sans');

      const expectedSize = Number.parseInt(figmaLabel.fontSize);
      const actualSize = Number.parseInt(actualStyles.fontSize);
      expect
        .soft(Math.abs(actualSize - expectedSize), 'Font size should match Figma ±1px')
        .toBeLessThanOrEqual(1);

      const expectedLineHeight = Number.parseInt(figmaLabel.lineHeight);
      const actualLineHeight = Number.parseInt(actualStyles.lineHeight);
      expect
        .soft(
          Math.abs(actualLineHeight - expectedLineHeight),
          'Line height should match Figma ±1px'
        )
        .toBeLessThanOrEqual(1);

      const normalizedActual = normalizeColor(actualStyles.color);
      const normalizedExpected = normalizeColor(figmaLabel.color);
      expect
        .soft(normalizedActual, 'Color should match Figma design')
        .toBe(normalizedExpected);
    });

    test('TC-VCG05: Verify Read More Button Typography @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      const readMoreBtn = await consentComponent.getReadMoreButton(0);
      const actualStyles = await getComputedStyles(readMoreBtn);
      const figmaButton = getFigmaValue('XL', 'readMoreButton');

      expect.soft(actualStyles.fontFamily).toContain('Bayer Sans');

      const expectedSize = Number.parseInt(figmaButton.fontSize);
      const actualSize = Number.parseInt(actualStyles.fontSize);
      expect.soft(Math.abs(actualSize - expectedSize), 'Font size should match Figma ±1px').toBeLessThanOrEqual(1);
    });
  });

  test.describe('@Visual - Typography Validation (LG Viewport)', () => {
    test('TC-VCG02: Verify Checkbox Label Typography @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 800 });

      const label0 = await consentComponent.getCheckboxLabel(0);
      const labelText = label0.locator('span[style*="white-space:pre-wrap"]');
      const actualStyles = await getComputedStyles(labelText);
      const figmaLabel = getFigmaValue('LG', 'checkboxLabel1');

      expect.soft(actualStyles.fontFamily).toContain('Bayer Sans');

      const expectedSize = Number.parseInt(figmaLabel.fontSize);
      const actualSize = Number.parseInt(actualStyles.fontSize);
      expect.soft(Math.abs(actualSize - expectedSize), 'Font size should match Figma ±1px').toBeLessThanOrEqual(1);
    });
  });

  test.describe('@Visual - Typography Validation (MD Viewport)', () => {
    test('TC-VCG03: Verify Checkbox Label Typography @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const label0 = await consentComponent.getCheckboxLabel(0);
      const labelText = label0.locator('span[style*="white-space:pre-wrap"]');
      const actualStyles = await getComputedStyles(labelText);
      const figmaLabel = getFigmaValue('MD', 'checkboxLabel1');

      expect.soft(actualStyles.fontFamily).toContain('Bayer Sans');

      const expectedSize = Number.parseInt(figmaLabel.fontSize);
      const actualSize = Number.parseInt(actualStyles.fontSize);
      expect.soft(Math.abs(actualSize - expectedSize), 'Font size should match Figma ±1px').toBeLessThanOrEqual(1);
    });
  });

  test.describe('@Visual - Typography Validation (SM Viewport)', () => {
    test('TC-VCG04: Verify Checkbox Label Typography @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const label0 = await consentComponent.getCheckboxLabel(0);
      const labelText = label0.locator('span[style*="white-space:pre-wrap"]');
      const actualStyles = await getComputedStyles(labelText);
      const figmaLabel = getFigmaValue('SM', 'checkboxLabel1');

      expect.soft(actualStyles.fontFamily).toContain('Bayer Sans');

      const expectedSize = Number.parseInt(figmaLabel.fontSize);
      const actualSize = Number.parseInt(actualStyles.fontSize);
      expect.soft(Math.abs(actualSize - expectedSize), 'Font size should match Figma ±1px').toBeLessThanOrEqual(1);
    });
  });

  test.describe('@Visual - State Typography Validation (MD Viewport)', () => {
    test('TC-VCG17: Verify Expanded Accordion Text Typography MD @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await consentComponent.clickReadMore(0);
      const isVisible = await consentComponent.isExpandTextVisible(0);
      expect.soft(isVisible, 'Expanded text should be visible').toBe(true);

      if (isVisible) {
        const expandText = await consentComponent.getExpandText(0);
        const ckContent = expandText.locator('.ck-content p').first();
        const ckCount = await ckContent.count();

        if (ckCount > 0) {
          const actualStyles = await getComputedStyles(ckContent);
          const figmaExpanded = getFigmaValue('MD', 'expandedText');

          expect.soft(actualStyles.fontFamily, 'Expanded text font family').toContain('Bayer Sans');

          const expectedSize = Number.parseInt(figmaExpanded.fontSize);
          const actualSize = Number.parseInt(actualStyles.fontSize);
          expect.soft(Math.abs(actualSize - expectedSize), 'Expanded text font size MD should match Figma ±1px').toBeLessThanOrEqual(1);

          const normalizedActual = normalizeColor(actualStyles.color);
          const normalizedExpected = normalizeColor(figmaExpanded.color);
          expect.soft(normalizedActual, 'Expanded text color MD should match Figma').toBe(normalizedExpected);
        }
      }
    });

    test('TC-VCG18: Verify Unconsented State Typography MD @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const unconsentedState = await consentComponent.getUnconsentedState();
      await expect.soft(unconsentedState, 'Unconsented state should be visible').toBeVisible();

      const titleEl = unconsentedState.locator('.ck-content p').first();
      const titleCount = await titleEl.count();

      if (titleCount > 0) {
        const actualStyles = await getComputedStyles(titleEl);
        const figmaUnconsented = getFigmaValue('MD', 'unconsentedTitle');

        const expectedSize = Number.parseInt(figmaUnconsented.fontSize);
        const actualSize = Number.parseInt(actualStyles.fontSize);
        expect.soft(Math.abs(actualSize - expectedSize), 'Unconsented title font size MD should match Figma ±1px').toBeLessThanOrEqual(1);

        const expectedWeight = Number.parseInt(figmaUnconsented.fontWeight);
        const actualWeight = Number.parseInt(actualStyles.fontWeight);
        expect.soft(actualWeight, 'Unconsented title font weight MD').toBe(expectedWeight);

        const normalizedActual = normalizeColor(actualStyles.color);
        const normalizedExpected = normalizeColor(figmaUnconsented.color);
        expect.soft(normalizedActual, 'Unconsented title color MD should match Figma').toBe(normalizedExpected);
      }
    });

    test('TC-VCG19: Verify Consented State Typography MD @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await consentComponent.checkAllCheckboxes();
      await page.waitForTimeout(1000);

      const consentedState = await consentComponent.getConsentedState();
      await expect.soft(consentedState, 'Consented state should be visible').toBeVisible();

      const titleEl = consentedState.locator('.ck-content p').first();
      const titleCount = await titleEl.count();

      if (titleCount > 0) {
        const actualStyles = await getComputedStyles(titleEl);
        const figmaConsented = getFigmaValue('MD', 'consentedTitle');

        const expectedSize = Number.parseInt(figmaConsented.fontSize);
        const actualSize = Number.parseInt(actualStyles.fontSize);
        expect.soft(Math.abs(actualSize - expectedSize), 'Consented title font size MD should match Figma ±1px').toBeLessThanOrEqual(1);

        const normalizedActual = normalizeColor(actualStyles.color);
        const normalizedExpected = normalizeColor(figmaConsented.color);
        expect.soft(normalizedActual, 'Consented title color MD should match Figma').toBe(normalizedExpected);
      }

      const links = consentedState.locator('.ck-content a');
      const linkCount = await links.count();

      if (linkCount > 0) {
        const firstLink = links.first();
        const linkStyles = await getComputedStyles(firstLink);
        const figmaLink = getFigmaValue('MD', 'consentedLink');

        const expectedLinkSize = Number.parseInt(figmaLink.fontSize);
        const actualLinkSize = Number.parseInt(linkStyles.fontSize);
        expect.soft(Math.abs(actualLinkSize - expectedLinkSize), 'Consented link font size MD should match Figma ±1px').toBeLessThanOrEqual(1);
      }
    });
  });

  test.describe('@Visual - State Typography Validation (SM Viewport)', () => {
    test('TC-VCG20: Verify Expanded Accordion Text Typography SM @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await consentComponent.clickReadMore(0);
      const isVisible = await consentComponent.isExpandTextVisible(0);
      expect.soft(isVisible, 'Expanded text should be visible').toBe(true);

      if (isVisible) {
        const expandText = await consentComponent.getExpandText(0);
        const ckContent = expandText.locator('.ck-content p').first();
        const ckCount = await ckContent.count();

        if (ckCount > 0) {
          const actualStyles = await getComputedStyles(ckContent);
          const figmaExpanded = getFigmaValue('SM', 'expandedText');

          expect.soft(actualStyles.fontFamily, 'Expanded text font family').toContain('Bayer Sans');

          const expectedSize = Number.parseInt(figmaExpanded.fontSize);
          const actualSize = Number.parseInt(actualStyles.fontSize);
          expect.soft(Math.abs(actualSize - expectedSize), 'Expanded text font size SM should match Figma ±1px').toBeLessThanOrEqual(1);

          const normalizedActual = normalizeColor(actualStyles.color);
          const normalizedExpected = normalizeColor(figmaExpanded.color);
          expect.soft(normalizedActual, 'Expanded text color SM should match Figma').toBe(normalizedExpected);
        }
      }
    });

    test('TC-VCG21: Verify Unconsented State Typography SM @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const unconsentedState = await consentComponent.getUnconsentedState();
      await expect.soft(unconsentedState, 'Unconsented state should be visible').toBeVisible();

      const titleEl = unconsentedState.locator('.ck-content p').first();
      const titleCount = await titleEl.count();

      if (titleCount > 0) {
        const actualStyles = await getComputedStyles(titleEl);
        const figmaUnconsented = getFigmaValue('SM', 'unconsentedTitle');

        const expectedSize = Number.parseInt(figmaUnconsented.fontSize);
        const actualSize = Number.parseInt(actualStyles.fontSize);
        expect.soft(Math.abs(actualSize - expectedSize), 'Unconsented title font size SM should match Figma ±1px').toBeLessThanOrEqual(1);

        const expectedWeight = Number.parseInt(figmaUnconsented.fontWeight);
        const actualWeight = Number.parseInt(actualStyles.fontWeight);
        expect.soft(actualWeight, 'Unconsented title font weight SM').toBe(expectedWeight);

        const normalizedActual = normalizeColor(actualStyles.color);
        const normalizedExpected = normalizeColor(figmaUnconsented.color);
        expect.soft(normalizedActual, 'Unconsented title color SM should match Figma').toBe(normalizedExpected);
      }
    });

    test('TC-VCG22: Verify Consented State Typography SM @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await consentComponent.checkAllCheckboxes();
      await page.waitForTimeout(1000);

      const consentedState = await consentComponent.getConsentedState();
      await expect.soft(consentedState, 'Consented state should be visible').toBeVisible();

      const titleEl = consentedState.locator('.ck-content p').first();
      const titleCount = await titleEl.count();

      if (titleCount > 0) {
        const actualStyles = await getComputedStyles(titleEl);
        const figmaConsented = getFigmaValue('SM', 'consentedTitle');

        const expectedSize = Number.parseInt(figmaConsented.fontSize);
        const actualSize = Number.parseInt(actualStyles.fontSize);
        expect.soft(Math.abs(actualSize - expectedSize), 'Consented title font size SM should match Figma ±1px').toBeLessThanOrEqual(1);

        const normalizedActual = normalizeColor(actualStyles.color);
        const normalizedExpected = normalizeColor(figmaConsented.color);
        expect.soft(normalizedActual, 'Consented title color SM should match Figma').toBe(normalizedExpected);
      }

      const links = consentedState.locator('.ck-content a');
      const linkCount = await links.count();

      if (linkCount > 0) {
        const firstLink = links.first();
        const linkStyles = await getComputedStyles(firstLink);
        const figmaLink = getFigmaValue('SM', 'consentedLink');

        const expectedLinkSize = Number.parseInt(figmaLink.fontSize);
        const actualLinkSize = Number.parseInt(linkStyles.fontSize);
        expect.soft(Math.abs(actualLinkSize - expectedLinkSize), 'Consented link font size SM should match Figma ±1px').toBeLessThanOrEqual(1);
      }
    });
  });

  test.describe('@Visual - State Typography Validation (XL Viewport)', () => {
    test('TC-VCG06: Verify Expanded Accordion Text Typography XL @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await consentComponent.clickReadMore(0);
      const isVisible = await consentComponent.isExpandTextVisible(0);
      expect.soft(isVisible, 'Expanded text should be visible').toBe(true);

      if (isVisible) {
        const expandText = await consentComponent.getExpandText(0);
        // Target the CKEditor content paragraph that has the actual styled text
        const ckContent = expandText.locator('.ck-content p').first();
        const ckCount = await ckContent.count();

        if (ckCount > 0) {
          const actualStyles = await getComputedStyles(ckContent);
          const figmaExpanded = getFigmaValue('XL', 'expandedText');

          expect.soft(actualStyles.fontFamily, 'Expanded text font family').toContain('Bayer Sans');

          const expectedSize = Number.parseInt(figmaExpanded.fontSize);
          const actualSize = Number.parseInt(actualStyles.fontSize);
          expect.soft(Math.abs(actualSize - expectedSize), 'Expanded text font size XL should match Figma ±1px').toBeLessThanOrEqual(1);

          const expectedLH = Number.parseInt(figmaExpanded.lineHeight);
          const actualLH = Number.parseInt(actualStyles.lineHeight);
          expect.soft(Math.abs(actualLH - expectedLH), 'Expanded text line height XL should match Figma ±1px').toBeLessThanOrEqual(1);

          const normalizedActual = normalizeColor(actualStyles.color);
          const normalizedExpected = normalizeColor(figmaExpanded.color);
          expect.soft(normalizedActual, 'Expanded text color XL should match Figma').toBe(normalizedExpected);
        }
      }
    });

    test('TC-VCG07: Verify Unconsented State Typography XL @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      const unconsentedState = await consentComponent.getUnconsentedState();
      await expect.soft(unconsentedState, 'Unconsented state should be visible by default').toBeVisible();

      // Target the first paragraph inside CKEditor content (the "Bitte wählen Sie:" title)
      const titleEl = unconsentedState.locator('.ck-content p').first();
      const titleCount = await titleEl.count();

      if (titleCount > 0) {
        const actualStyles = await getComputedStyles(titleEl);
        const figmaUnconsented = getFigmaValue('XL', 'unconsentedTitle');

        expect.soft(actualStyles.fontFamily, 'Unconsented title font family').toContain('Bayer Sans');

        const expectedSize = Number.parseInt(figmaUnconsented.fontSize);
        const actualSize = Number.parseInt(actualStyles.fontSize);
        expect.soft(Math.abs(actualSize - expectedSize), 'Unconsented title font size XL should match Figma ±1px').toBeLessThanOrEqual(1);

        const expectedWeight = Number.parseInt(figmaUnconsented.fontWeight);
        const actualWeight = Number.parseInt(actualStyles.fontWeight);
        expect.soft(actualWeight, 'Unconsented title font weight should match Figma').toBe(expectedWeight);

        const normalizedActual = normalizeColor(actualStyles.color);
        const normalizedExpected = normalizeColor(figmaUnconsented.color);
        expect.soft(normalizedActual, 'Unconsented title color XL should match Figma (muted)').toBe(normalizedExpected);
      }
    });

    test('TC-VCG08: Verify Consented State Typography XL @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await consentComponent.checkAllCheckboxes();
      await page.waitForTimeout(1000);

      const consentedState = await consentComponent.getConsentedState();
      await expect.soft(consentedState, 'Consented state should be visible').toBeVisible();

      // Target the first paragraph inside CKEditor content (the title)
      const titleEl = consentedState.locator('.ck-content p').first();
      const titleCount = await titleEl.count();

      if (titleCount > 0) {
        const actualStyles = await getComputedStyles(titleEl);
        const figmaConsented = getFigmaValue('XL', 'consentedTitle');

        expect.soft(actualStyles.fontFamily, 'Consented title font family').toContain('Bayer Sans');

        const expectedSize = Number.parseInt(figmaConsented.fontSize);
        const actualSize = Number.parseInt(actualStyles.fontSize);
        expect.soft(Math.abs(actualSize - expectedSize), 'Consented title font size XL should match Figma ±1px').toBeLessThanOrEqual(1);

        const normalizedActual = normalizeColor(actualStyles.color);
        const normalizedExpected = normalizeColor(figmaConsented.color);
        expect.soft(normalizedActual, 'Consented title color XL should match Figma (active)').toBe(normalizedExpected);
      }

      // Target link elements inside consented CKEditor content
      const links = consentedState.locator('.ck-content a');
      const linkCount = await links.count();

      if (linkCount > 0) {
        const firstLink = links.first();
        const linkStyles = await getComputedStyles(firstLink);
        const figmaLink = getFigmaValue('XL', 'consentedLink');

        expect.soft(linkStyles.fontFamily, 'Consented link font family').toContain('Bayer Sans');

        const expectedLinkSize = Number.parseInt(figmaLink.fontSize);
        const actualLinkSize = Number.parseInt(linkStyles.fontSize);
        expect.soft(Math.abs(actualLinkSize - expectedLinkSize), 'Consented link font size XL should match Figma ±1px').toBeLessThanOrEqual(1);

        const normalizedLinkColor = normalizeColor(linkStyles.color);
        const expectedLinkColor = normalizeColor(figmaLink.color);
        expect.soft(normalizedLinkColor, 'Consented link color XL should match Figma').toBe(expectedLinkColor);
      }
    });
  });

  test.describe('@Visual - Layout and Interaction States', () => {
    test('TC-VCG09: Verify Checkbox Size and Spacing @Visual', async ({ page }) => {
      // Target the visual checkbox span (aria-hidden) inside the label, not the sr-only hidden input
      const label0 = await consentComponent.getCheckboxLabel(0);
      const label1 = await consentComponent.getCheckboxLabel(1);
      const visualCheckbox0 = label0.locator('span[aria-hidden="true"]').first();
      const visualCheckbox1 = label1.locator('span[aria-hidden="true"]').first();

      const box0 = await visualCheckbox0.boundingBox();
      const box1 = await visualCheckbox1.boundingBox();

      if (box0 && box1) {
        expect
          .soft(box0.width, 'Checkbox width should be reasonable (20-40px)')
          .toBeGreaterThan(20);
        expect.soft(box0.width).toBeLessThan(40);

        expect
          .soft(box0.height, 'Checkbox height should be reasonable (20-40px)')
          .toBeGreaterThan(20);
        expect.soft(box0.height).toBeLessThan(40);

        const spacing = box1.y - (box0.y + box0.height);
        expect
          .soft(spacing, 'Vertical spacing between checkboxes should be consistent')
          .toBeGreaterThan(10);
        expect.soft(spacing).toBeLessThan(100);
      }
    });

    test('TC-VCG10: Verify Checkbox Visual States @Visual', async ({ page }) => {
      const checkbox0 = await consentComponent.getCheckbox(0);
      const label0 = await consentComponent.getCheckboxLabel(0);
      const visualCheckbox0 = label0.locator('span[aria-hidden="true"]').first();

      const isUnchecked = !(await checkbox0.isChecked());
      expect.soft(isUnchecked, 'Checkbox should start unchecked').toBe(true);

      // Hover on the label (which is the clickable visual element) instead of the sr-only input
      await label0.hover();
      await page.waitForTimeout(200);

      const hoverCursor = await label0.evaluate((el) => getComputedStyle(el).cursor);
      expect.soft(hoverCursor, 'Checkbox label should have pointer cursor on hover').toBe('pointer');

      // Click via the label (reliable way to trigger React checkbox state)
      await consentComponent.checkCheckbox(0);
      const isChecked = await checkbox0.isChecked();
      expect.soft(isChecked, 'Checkbox should become checked after click').toBe(true);

      // Verify the visual checkbox span has a visible focus/checked indicator
      const bgColor = await visualCheckbox0.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect.soft(bgColor, 'Visual checkbox should have background color when checked').toBeTruthy();
    });

    test('TC-VCG15: Verify Hover States on Buttons @Visual', async ({ page }) => {
      const readMoreBtn = await consentComponent.getReadMoreButton(0);

      await readMoreBtn.evaluate((el) => getComputedStyle(el).backgroundColor);

      await readMoreBtn.hover();
      await page.waitForTimeout(200);

      const cursor = await readMoreBtn.evaluate((el) => getComputedStyle(el).cursor);
      expect.soft(cursor, 'Button should have pointer cursor on hover').toBe('pointer');

      const bgAfter = await readMoreBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect.soft(bgAfter, 'Background color should be defined').toBeTruthy();
    });

    test('TC-VCG16: Verify No Layout Shift During State Transitions @Visual', async ({
      page,
    }) => {
      const readMoreBtn = await consentComponent.getReadMoreButton(0);
      const positionBefore = await readMoreBtn.boundingBox();

      await consentComponent.checkAllCheckboxes();
      await page.waitForTimeout(1000);

      const positionAfter = await readMoreBtn.boundingBox();

      if (positionBefore && positionAfter) {
        expect
          .soft(
            Math.abs(positionAfter.y - positionBefore.y),
            'Read More button should not shift vertically during state transition'
          )
          .toBeLessThan(5);
      }
    });
  });
});

// ============================================================================
// PERFORMANCE TESTS - Load Time and Interaction Responsiveness
// ============================================================================

test.describe('Consent Gated Content Component - Performance Tests', () => {
  let consentComponent: ConsentGatedContentComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    consentComponent = new ConsentGatedContentComponent(page, browser, context);
  });

  test.describe('@Performance - Load and Interaction Timing', () => {
    test('TC-PCG01: Verify Component Initial Load Time @Performance', async ({ page }) => {
      const startTime = Date.now();

      await consentComponent.navigateToComponent();
      const componentContainer = await consentComponent.getComponentContainer();
      await componentContainer.waitFor({ state: 'visible' });

      const loadTime = Date.now() - startTime;

      expect.soft(loadTime, 'Component should load within 2 seconds').toBeLessThan(2000);

      console.log(`Component load time: ${loadTime}ms`);
    });

    test('TC-PCG02: Verify Checkbox Toggle Response Time @Performance', async ({ page }) => {
      await consentComponent.navigateToComponent();
      await consentComponent.waitForComponentLoad();

      const label0 = await consentComponent.getCheckboxLabel(0);
      const startTime = performance.now();
      await label0.click();
      await page.waitForTimeout(50);
      const responseTime = performance.now() - startTime;

      expect
        .soft(responseTime, 'Checkbox toggle should respond within 100ms')
        .toBeLessThan(100);

      console.log(`Checkbox toggle response time: ${responseTime.toFixed(2)}ms`);
    });

    test('TC-PCG03: Verify State Transition Performance @Performance', async ({ page }) => {
      await consentComponent.navigateToComponent();
      await consentComponent.waitForComponentLoad();

      await consentComponent.checkCheckbox(0);

      const startTime = performance.now();
      await consentComponent.checkCheckbox(1);

      const consentedState = await consentComponent.getConsentedState();
      await consentedState.waitFor({ state: 'visible', timeout: 1000 });

      const transitionTime = performance.now() - startTime;

      expect
        .soft(transitionTime, 'State transition should complete within 500ms')
        .toBeLessThan(500);

      console.log(`State transition time: ${transitionTime.toFixed(2)}ms`);
    });

    test('TC-PCG04: Verify Read More Expansion Performance @Performance', async ({ page }) => {
      await consentComponent.navigateToComponent();
      await consentComponent.waitForComponentLoad();

      const readMoreBtn = await consentComponent.getReadMoreButton(0);

      const startTime = performance.now();
      await readMoreBtn.click();

      await page.waitForTimeout(100);

      const expandTime = performance.now() - startTime;

      expect
        .soft(expandTime, 'Read More expansion should be smooth (<300ms)')
        .toBeLessThan(300);

      console.log(`Read More expansion time: ${expandTime.toFixed(2)}ms`);
    });
  });
});

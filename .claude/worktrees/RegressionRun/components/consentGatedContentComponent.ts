/**
 * Component Mapper - Consent Gated Content Component
 * What:
 *   Provides page-object actions and validations for consent-gated content.
 * Why:
 *   Created so consent-specific interactions are centralized and reusable across
 *   mapper-driven and standalone test execution.
 */

import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { envUtils } from '../helpers/utils/envUtils';


export class ConsentGatedContentComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Navigate to Consent Gated Content component page with authentication
   * Includes cookie banner handling
   */
  async navigateToComponent(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.getComponentUrl('ConsentGatedContentComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForNetworkIdle();
    
    // Scroll to component
    const component = await this.getComponentContainer();
    await component.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for component to load completely
   */
  async waitForComponentLoad(): Promise<void> {
    await this.waitForNetworkIdle();
    const component = await this.getComponentContainer();
    await component.waitFor({ state: 'visible', timeout: 10000 });
  }

  // ============================================================================
  // COMPONENT CONTAINER LOCATORS (SmartLocator)
  // ============================================================================

  /**
   * Get main component container
   * DOM: <section data-qa="consent-gated-content" data-testid="consent-gated-content">
   * SmartLocator with 4 fallback strategies
   */
  async getComponentContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'consent-gated-content',
      testId: 'consent-gated-content',
      css: 'section[data-qa="consent-gated-content"]',
      xpath: '//section[@data-qa="consent-gated-content"]',
      description: 'Consent Gated Content component container',
    });
  }

  /**
   * Get consent conditions list container
   * DOM: <ul data-qa="consent-conditions-list" data-testid="consent-conditions-list">
   * SmartLocator with 4 fallback strategies
   */
  async getConditionsList(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'consent-conditions-list',
      testId: 'consent-conditions-list',
      css: 'ul[data-qa="consent-conditions-list"]',
      role: { role: 'list' },
      description: 'Consent conditions list container',
    });
  }

  /**
   * Get consent gated state wrapper
   * DOM: <div data-qa="consent-gated-state">
   */
  async getConsentGatedState(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'consent-gated-state',
      testId: 'consent-gated-state',
      css: 'div[data-qa="consent-gated-state"]',
      description: 'Consent gated state wrapper',
    });
  }

  // ============================================================================
  // CHECKBOX LOCATORS (SmartLocator with indexed access)
  // ============================================================================

  /**
   * Get checkbox by index (0-based)
   * DOM: <input data-qa="consent-condition-checkbox-{index}" type="checkbox">
   * SmartLocator with 4 fallback strategies
   * 
   * @param index - Checkbox index (0, 1, or 2)
   */
  async getCheckbox(index: number): Promise<Locator> {
    return await this.findSmart({
      dataQa: `consent-condition-checkbox-${index}`,
      testId: `consent-condition-checkbox-${index}`,
      css: `input[data-qa="consent-condition-checkbox-${index}"][type="checkbox"]`,
      id: `consent-condition-${index}`,
      description: `Consent condition checkbox ${index}`,
    });
  }

  /**
   * Get total count of checkboxes
   * Validates AC5: 1-3 checkboxes supported
   * Iterates through individual SmartLocator calls (max 3 per AC5)
   */
  async getCheckboxCount(): Promise<number> {
    let count = 0;
    for (let i = 0; i < 3; i++) {
      try {
        const checkbox = await this.findSmart({
          dataQa: `consent-condition-checkbox-${i}`,
          css: `input[data-qa="consent-condition-checkbox-${i}"]`,
          description: `Consent condition checkbox ${i} count check`,
        });
        if (await checkbox.count() > 0) {
          count++;
        }
      } catch {
        break;
      }
    }
    return count;
  }

  /**
   * Check if checkbox is checked by index
   */
  async isCheckboxChecked(index: number): Promise<boolean> {
    const checkbox = await this.getCheckbox(index);
    return await checkbox.isChecked();
  }

  /**
   * Check (select) checkbox by index
   * Clicks the label element to reliably trigger React state changes
   * @param index - Checkbox index (0, 1, or 2)
   */
  async checkCheckbox(index: number): Promise<void> {
    const isChecked = await this.isCheckboxChecked(index);
    if (!isChecked) {
      const label = await this.getCheckboxLabel(index);
      await label.click();
      await this.page.waitForTimeout(200);
    }
  }

  /**
   * Uncheck (deselect) checkbox by index
   * Clicks the label element to reliably trigger React state changes
   * @param index - Checkbox index (0, 1, or 2)
   */
  async uncheckCheckbox(index: number): Promise<void> {
    const isChecked = await this.isCheckboxChecked(index);
    if (isChecked) {
      const label = await this.getCheckboxLabel(index);
      await label.click();
      await this.page.waitForTimeout(200);
    }
  }

  /**
   * Check ALL checkboxes
   * Triggers state transition to consented content (AC3)
   */
  async checkAllCheckboxes(): Promise<void> {
    const count = await this.getCheckboxCount();
    for (let i = 0; i < count; i++) {
      await this.checkCheckbox(i);
      await this.page.waitForTimeout(300); // Small delay between selections
    }
  }

  /**
   * Uncheck ALL checkboxes
   */
  async uncheckAllCheckboxes(): Promise<void> {
    const count = await this.getCheckboxCount();
    for (let i = 0; i < count; i++) {
      await this.uncheckCheckbox(i);
    }
  }

  // ============================================================================
  // CHECKBOX LABEL LOCATORS (SmartLocator with indexed access)
  // ============================================================================

  /**
   * Get checkbox label by index
   * DOM: <label data-qa="consent-condition-label-{index}">
   * SmartLocator with 4 fallback strategies
   */
  async getCheckboxLabel(index: number): Promise<Locator> {
    return await this.findSmart({
      dataQa: `consent-condition-label-${index}`,
      testId: `consent-condition-label-${index}`,
      css: `label[data-qa="consent-condition-label-${index}"]`,
      xpath: `//label[@data-qa="consent-condition-label-${index}"]`,
      description: `Consent condition label ${index}`,
    });
  }

  /**
   * Get text content from checkbox label
   */
  async getCheckboxLabelText(index: number): Promise<string> {
    const label = await this.getCheckboxLabel(index);
    return (await label.textContent()) || '';
  }

  // ============================================================================
  // READ MORE / EXPAND TEXT LOCATORS (SmartLocator)
  // ============================================================================

  /**
   * Get accordion container by index
   * DOM: <div data-qa="consent-condition-accordion-{index}">
   */
  async getAccordion(index: number): Promise<Locator> {
    return await this.findSmart({
      dataQa: `consent-condition-accordion-${index}`,
      testId: `consent-condition-accordion-${index}`,
      css: `div[data-qa="consent-condition-accordion-${index}"]`,
      description: `Consent condition accordion ${index}`,
    });
  }

  /**
   * Get Read More button by index
   * DOM: <button data-qa="consent-condition-read-more-{index}">
   * SmartLocator with 4 fallback strategies
   */
  async getReadMoreButton(index: number): Promise<Locator> {
    return await this.findSmart({
      dataQa: `consent-condition-read-more-${index}`,
      testId: `consent-condition-read-more-${index}`,
      css: `button[data-qa="consent-condition-read-more-${index}"]`,
      xpath: `//button[@data-qa="consent-condition-read-more-${index}"]`,
      description: `Consent condition Read More button ${index}`,
    });
  }

  /**
   * Get expanded text container by index
   * DOM: <div data-qa="consent-condition-expand-text-{index}">
   * SmartLocator with 4 fallback strategies
   */
  async getExpandText(index: number): Promise<Locator> {
    return await this.findSmart({
      dataQa: `consent-condition-expand-text-${index}`,
      testId: `consent-condition-expand-text-${index}`,
      css: `div[data-qa="consent-condition-expand-text-${index}"]`,
      id: `consent-expand-${index}`,
      description: `Consent condition expanded text ${index}`,
    });
  }

  /**
   * Click Read More button to expand/collapse
   */
  async clickReadMore(index: number): Promise<void> {
    const readMoreBtn = await this.getReadMoreButton(index);
    await readMoreBtn.scrollIntoViewIfNeeded();
    await readMoreBtn.click();
    await this.page.waitForTimeout(1500); // Wait longer for accordion animation to fully complete
  }

  /**
   * Check if  expanded text is visible
   * Waits for accordion animation to complete before checking
   */
  async isExpandTextVisible(index: number): Promise<boolean> {
    // Wait for accordion animation to complete (data-state animation)
    await this.page.waitForTimeout(1200);
    
    // Check if element exists in DOM and is visible using SmartLocator
    try {
      const expandText = await this.findSmart({
        dataQa: `consent-condition-expand-text-${index}`,
        css: `[data-qa="consent-condition-expand-text-${index}"]`,
        description: `Consent condition expanded text ${index} visibility check`,
      });
      const count = await expandText.count();
      if (count === 0) return false;
      return await expandText.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get text content from expanded section
   */
  async getExpandedTextContent(index: number): Promise<string> {
    const expandText = await this.getExpandText(index);
    return (await expandText.textContent()) || '';
  }

  // ============================================================================
  // STATE CONTENT LOCATORS (SmartLocator)
  // ============================================================================

  /**
   * Get unconsented state content
   * DOM: <section data-qa="consent-gated-unconsented-state">
   * Visible by default when NOT all checkboxes are checked (AC2)
   * SmartLocator with 4 fallback strategies
   */
  async getUnconsentedState(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'consent-gated-unconsented-state',
      testId: 'consent-gated-unconsented-state',
      css: 'section[data-qa="consent-gated-unconsented-state"]',
      xpath: '//section[@data-qa="consent-gated-unconsented-state"]',
      description: 'Unconsented state content (AC2)',
    });
  }

  /**
   * Get consented state content
   * DOM: <section data-qa="consent-gated-consented-state">
   * Visible ONLY when ALL checkboxes are checked (AC3)
   * SmartLocator with 4 fallback strategies
   */
  async getConsentedState(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'consent-gated-consented-state',
      testId: 'consent-gated-consented-state',
      css: 'section[data-qa="consent-gated-consented-state"]',
      xpath: '//section[@data-qa="consent-gated-consented-state"]',
      description: 'Consented state content (AC3)',
    });
  }

  /**
   * Check if unconsented state exists in DOM
   * AC3: Element is removed from DOM when all checkboxes are checked
   * AC4: Element reappears in DOM when any checkbox is unchecked
   */
  async isUnconsentedStateInDOM(): Promise<boolean> {
    try {
      const element = await this.findSmart({
        dataQa: 'consent-gated-unconsented-state',
        css: '[data-qa="consent-gated-unconsented-state"]',
        description: 'Unconsented state DOM existence check',
      });
      const count = await element.count();
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Check if unconsented state is visible
   * AC2: Should be visible by default (no checkboxes checked)
   * AC4: Should become visible when any checkbox is unchecked
   */
  async isUnconsentedStateVisible(): Promise<boolean> {
    const existsInDOM = await this.isUnconsentedStateInDOM();
    if (!existsInDOM) return false;
    
    const unconsentedState = await this.getUnconsentedState();
    return await unconsentedState.isVisible().catch(() => false);
  }

  /**
   * Check if consented state is visible
   * AC3: Should be visible when ALL checkboxes are checked
   * AC4: Should become hidden when ANY checkbox is unchecked
   */
  async isConsentedStateVisible(): Promise<boolean> {
    try {
      const consentedState = await this.getConsentedState();
      const count = await consentedState.count();
      if (count === 0) return false;
      return await consentedState.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get unconsented content text
   */
  async getUnconsentedContentText(): Promise<string> {
    const unconsentedState = await this.getUnconsentedState();
    return (await unconsentedState.textContent()) || '';
  }

  /**
   * Get consented content text
   */
  async getConsentedContentText(): Promise<string> {
    const consentedState = await this.getConsentedState();
    return (await consentedState.textContent()) || '';
  }

  // ============================================================================
  // VALIDATION METHODS (Test Case Helpers)
  // ============================================================================

  /**
   * Validate component structure (TC-CG01)
   * Verifies component container and key elements are present
   */
  async validateComponentStructure(): Promise<void> {
    const component = await this.getComponentContainer();
    await expect.soft(component, 'Component container should be visible').toBeVisible();
    await expect.soft(component, 'Component should have data-qa attribute').toHaveAttribute(
      'data-qa',
      'consent-gated-content'
    );

    const conditionsList = await this.getConditionsList();
    await expect.soft(conditionsList, 'Conditions list should be visible').toBeVisible();

    const gatedState = await this.getConsentGatedState();
    await expect.soft(gatedState, 'Gated state container should be visible').toBeVisible();
  }

  /**
   * Validate default state (TC-CG03, TC-CG04, TC-CG05)
   * All checkboxes unchecked, unconsented content visible
   */
  async validateDefaultState(): Promise<void> {
    const checkboxCount = await this.getCheckboxCount();

    // Verify all checkboxes are unchecked
    for (let i = 0; i < checkboxCount; i++) {
      const isChecked = await this.isCheckboxChecked(i);
      expect
        .soft(isChecked, `Checkbox ${i} should be unchecked by default`)
        .toBe(false);
    }

    // Verify unconsented state is visible
    const isUnconsentedVisible = await this.isUnconsentedStateVisible();
    expect
      .soft(isUnconsentedVisible, 'Unconsented state should be visible by default (AC2)')
      .toBe(true);

    // Verify consented state is hidden
    const isConsentedVisible = await this.isConsentedStateVisible();
    expect
      .soft(isConsentedVisible, 'Consented state should be hidden by default')
      .toBe(false);
  }

  /**
   * Validate checkbox count (TC-CG02 - AC5)
   * @param expectedCount - Expected number of checkboxes (1-3)
   */
  async validateCheckboxCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getCheckboxCount();
    expect
      .soft(actualCount, `Should have ${expectedCount} checkboxes (AC5)`)
      .toBe(expectedCount);

    // Verify each checkbox has proper data-qa attributes
    for (let i = 0; i < actualCount; i++) {
      const checkbox = await this.getCheckbox(i);
      await expect
        .soft(checkbox, `Checkbox ${i} should have correct data-qa attribute`)
        .toHaveAttribute('data-qa', `consent-condition-checkbox-${i}`);
    }
  }

  /**
   * Validate state transition to consented (TC-CG07 - AC3)
   * Check all boxes → consented content should appear
   */
  async validateConsentedStateTransition(): Promise<void> {
    await this.checkAllCheckboxes();

    // Wait for state transition and animation
    await this.page.waitForTimeout(1000);

    // Check if unconsented state is removed from DOM (component behavior)
    const isUnconsentedInDOM = await this.isUnconsentedStateInDOM();
    expect
      .soft(isUnconsentedInDOM, 'Unconsented state should be removed from DOM when all checked (AC3)')
      .toBe(false);

    const isConsentedVisible = await this.isConsentedStateVisible();
    expect
      .soft(isConsentedVisible, 'Consented state should be visible when all checked (AC3)')
      .toBe(true);

    // Verify all checkboxes are checked
    const checkboxCount = await this.getCheckboxCount();
    for (let i = 0; i < checkboxCount; i++) {
      const isChecked = await this.isCheckboxChecked(i);
      expect.soft(isChecked, `Checkbox ${i} should be checked`).toBe(true);
    }
  }

  /**
   * Validate reversion to unconsented state (TC-CG08 - AC4)
   * Uncheck any checkbox → unconsented content should appear
   */
  async validateUnconsentedReversion(checkboxToUncheck: number = 0): Promise<void> {
    // First ensure all are checked
    await this.checkAllCheckboxes();
    await this.page.waitForTimeout(300);

    // Uncheck specified checkbox
    await this.uncheckCheckbox(checkboxToUncheck);
    await this.page.waitForTimeout(500);

    const isUnconsentedVisible = await this.isUnconsentedStateVisible();
    expect
      .soft(
        isUnconsentedVisible,
        'Unconsented state should be visible when any checkbox unchecked (AC4)'
      )
      .toBe(true);

    const isConsentedVisible = await this.isConsentedStateVisible();
    expect
      .soft(
        isConsentedVisible,
        'Consented state should be hidden when any checkbox unchecked (AC4)'
      )
      .toBe(false);
  }

  /**
   * Validate Read More expand/collapse functionality (TC-CG10, TC-CG11)
   */
  async validateReadMoreFunctionality(index: number = 0): Promise<void> {
    const readMoreBtn = await this.getReadMoreButton(index);
    await expect.soft(readMoreBtn, 'Read More button should be visible').toBeVisible();
    await expect.soft(readMoreBtn, 'Read More button should be enabled').toBeEnabled();

    // Click to expand
    await this.clickReadMore(index);
    const isExpandedAfterClick = await this.isExpandTextVisible(index);
    expect
      .soft(isExpandedAfterClick, 'Expanded text should be visible after clicking Read More')
      .toBe(true);

    // Click again to collapse
    await this.clickReadMore(index);
    const isExpandedAfterSecondClick = await this.isExpandTextVisible(index);
    expect
      .soft(
        isExpandedAfterSecondClick,
        'Expanded text should be hidden after clicking Read More again'
      )
      .toBe(false);
  }

  /**
   * Validate checkbox label association (TC-CG09, TC-ACG04)
   */
  async validateCheckboxLabels(): Promise<void> {
    const checkboxCount = await this.getCheckboxCount();

    for (let i = 0; i < checkboxCount; i++) {
      const label = await this.getCheckboxLabel(i);
      await expect.soft(label, `Label ${i} should be visible`).toBeVisible();

      const labelText = await this.getCheckboxLabelText(i);
      expect.soft(labelText, `Label ${i} should have text content`).toBeTruthy();

      // Verify label can toggle checkbox (click label → checkbox toggles)
      const wasChecked = await this.isCheckboxChecked(i);
      await label.click();
      await this.page.waitForTimeout(200);
      const isCheckedAfter = await this.isCheckboxChecked(i);
      expect
        .soft(
          isCheckedAfter,
          `Clicking label ${i} should toggle checkbox state`
        )
        .not.toBe(wasChecked);
    }
  }
}

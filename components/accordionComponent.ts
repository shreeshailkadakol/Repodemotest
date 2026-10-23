import { Page } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';

export class AccordionComponent extends BasePage {
  // Accordion Component Selectors
  private accordionSelectors = {
    // Main container
    accordionSection: '[data-testid="accordion"]',
    accordionContainer: '.AccordionRoot',
    accordionTitle: 'h2[data-qa="title-component"]',

    // Accordion items
    accordionItem: '[data-testid="accordion-item"]',
    accordionItemFirst: '[data-testid="accordion-item"]:first-child',
    accordionItemSecond: '[data-testid="accordion-item"]:nth-child(2)',

    // Triggers and buttons
    accordionTrigger: '.AccordionTrigger',
    accordionTriggerFirst: '[data-testid="accordion-item"]:first-child .AccordionTrigger',
    accordionTriggerSecond: '[data-testid="accordion-item"]:nth-child(2) .AccordionTrigger',

    // Icons
    plusIcon: '[aria-label="plus"]',
    minusIcon: '[aria-label="minus"]',

    // Content areas
    accordionContent: '[role="region"]',
    accordionContentFirst: '[data-testid="accordion-item"]:first-child [role="region"]',
    accordionContentSecond: '[data-testid="accordion-item"]:nth-child(2) [role="region"]',

    // State selectors
    closedState: '[data-state="closed"]',
    openState: '[data-state="open"]',
    expandedTrigger: '[aria-expanded="true"]',
    collapsedTrigger: '[aria-expanded="false"]',

    // Typography and visual elements
    itemTitle: '.AccordionTrigger h2',
    iconContainer: '.AccordionTrigger > div:last-child',
  };

  constructor(page: Page, browser: any, context: any) {
    super(page, browser, context);
  }

  /**
   * Navigate to the Accordion component test page
   */
  async navigateToComponent(): Promise<void> {
    const componentUrl = await this.getComponentUrl(
      'AccordionComponent',
      process.env.baseURL || ''
    );
    await this.navigateWithAuthentication(componentUrl);
    await this.waitForNetworkIdle();
    await this.waitForComponentToLoad();
  }

  /**
   * Wait for the accordion component to fully load
   */
  async waitForComponentToLoad(): Promise<void> {
    await this.page.locator(this.accordionSelectors.accordionSection).first().waitFor({
      state: 'visible',
      timeout: 30000,
    });
    await this.page.locator(this.accordionSelectors.accordionItem).first().waitFor({
      state: 'visible',
    });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Verify the accordion component is visible and properly loaded
   */
  async verifyComponentVisibility(): Promise<boolean> {
    try {
      const accordionSection = this.page.locator(this.accordionSelectors.accordionSection).first();
      const isVisible = await accordionSection.isVisible();

      if (!isVisible) {
        await this.logError('Accordion section is not visible');
        return false;
      }

      const itemCount = await this.page.locator(this.accordionSelectors.accordionItem).count();
      if (itemCount === 0) {
        await this.logError('No accordion items found');
        return false;
      }

      await this.log(`Accordion component loaded successfully with ${itemCount} items`);
      return true;
    } catch (error) {
      await this.logError(`Error verifying component visibility: ${error}`);
      return false;
    }
  }

  /**
   * Get the main accordion title
   */
  async getMainTitle(): Promise<string> {
    try {
      const titleElement = this.page.locator(this.accordionSelectors.accordionTitle).first();
      const title = (await titleElement.textContent()) || '';
      await this.log(`Main accordion title: ${title}`);
      return title.trim();
    } catch (error) {
      await this.logError(`Error getting main title: ${error}`);
      return '';
    }
  }

  /**
   * Get accordion item titles
   */
  async getAccordionItemTitles(): Promise<string[]> {
    try {
      const titles = await this.page.locator(this.accordionSelectors.itemTitle).allTextContents();
      await this.log(`Accordion item titles: ${titles.join(', ')}`);
      return titles.map((title) => title.trim());
    } catch (error) {
      await this.logError(`Error getting accordion item titles: ${error}`);
      return [];
    }
  }

  /**
   * Check if an accordion item is expanded
   */
  async isAccordionItemExpanded(itemIndex: number = 0): Promise<boolean> {
    try {
      const item = this.page.locator(this.accordionSelectors.accordionItem).nth(itemIndex);
      const state = await item.getAttribute('data-state');
      const isExpanded = state === 'open';
      await this.log(`Accordion item ${itemIndex + 1} expanded state: ${isExpanded}`);
      return isExpanded;
    } catch (error) {
      await this.logError(
        `Error checking accordion item ${itemIndex + 1} expanded state: ${error}`
      );
      return false;
    }
  }

  /**
   * Check if accordion trigger has correct aria-expanded attribute
   */
  async getAccordionTriggerAriaExpanded(itemIndex: number = 0): Promise<string> {
    try {
      const trigger = this.page.locator(this.accordionSelectors.accordionTrigger).nth(itemIndex);
      const ariaExpanded = (await trigger.getAttribute('aria-expanded')) || 'false';
      await this.log(`Accordion trigger ${itemIndex + 1} aria-expanded: ${ariaExpanded}`);
      return ariaExpanded;
    } catch (error) {
      await this.logError(`Error getting aria-expanded for trigger ${itemIndex + 1}: ${error}`);
      return 'false';
    }
  }

  /**
   * Click on an accordion item trigger
   */
  async clickAccordionItem(itemIndex: number = 0): Promise<void> {
    try {
      const trigger = this.page.locator(this.accordionSelectors.accordionTrigger).nth(itemIndex);

      // Wait for the trigger to be clickable
      await trigger.waitFor({ state: 'visible' });
      await trigger.click();

      // Wait for animation to complete
      await this.page.waitForFunction(() => {
        return document.readyState === 'complete';
      });

      await this.log(`Clicked accordion item ${itemIndex + 1}`);
    } catch (error) {
      await this.logError(`Error clicking accordion item ${itemIndex + 1}: ${error}`);
      throw error;
    }
  }

  /**
   * Expand a specific accordion item
   */
  async expandAccordionItem(itemIndex: number = 0): Promise<void> {
    const isExpanded = await this.isAccordionItemExpanded(itemIndex);
    if (!isExpanded) {
      await this.clickAccordionItem(itemIndex);
      await this.log(`Expanded accordion item ${itemIndex + 1}`);
    } else {
      await this.log(`Accordion item ${itemIndex + 1} already expanded`);
    }
  }

  /**
   * Collapse a specific accordion item
   */
  async collapseAccordionItem(itemIndex: number = 0): Promise<void> {
    const isExpanded = await this.isAccordionItemExpanded(itemIndex);
    if (isExpanded) {
      await this.clickAccordionItem(itemIndex);
      await this.log(`Collapsed accordion item ${itemIndex + 1}`);
    } else {
      await this.log(`Accordion item ${itemIndex + 1} already collapsed`);
    }
  }

  /**
   * Verify accordion icon states (plus/minus)
   */
  async verifyIconStates(
    itemIndex: number = 0
  ): Promise<{ plusVisible: boolean; minusVisible: boolean }> {
    try {
      const item = this.page.locator(this.accordionSelectors.accordionItem).nth(itemIndex);
      const plusIcon = item.locator(this.accordionSelectors.plusIcon);
      const minusIcon = item.locator(this.accordionSelectors.minusIcon);

      const plusVisible = await plusIcon.isVisible();
      const minusVisible = await minusIcon.isVisible();

      await this.log(
        `Item ${itemIndex + 1} - Plus icon visible: ${plusVisible}, Minus icon visible: ${minusVisible}`
      );

      return { plusVisible, minusVisible };
    } catch (error) {
      await this.logError(`Error verifying icon states for item ${itemIndex + 1}: ${error}`);
      return { plusVisible: false, minusVisible: false };
    }
  }

  /**
   * Get accordion content visibility
   */
  async isAccordionContentVisible(itemIndex: number = 0): Promise<boolean> {
    try {
      const content = this.page.locator(this.accordionSelectors.accordionContent).nth(itemIndex);
      const isVisible = await content.isVisible();
      await this.log(`Accordion content ${itemIndex + 1} visible: ${isVisible}`);
      return isVisible;
    } catch (error) {
      await this.logError(`Error checking content visibility for item ${itemIndex + 1}: ${error}`);
      return false;
    }
  }

  /**
   * Verify accessibility attributes
   */
  async verifyAccessibilityAttributes(itemIndex: number = 0): Promise<{
    hasAriaLabel: boolean;
    hasAriaControls: boolean;
    hasAriaExpanded: boolean;
    hasProperRole: boolean;
  }> {
    try {
      const trigger = this.page.locator(this.accordionSelectors.accordionTrigger).nth(itemIndex);
      const content = this.page.locator(this.accordionSelectors.accordionContent).nth(itemIndex);

      const ariaControls = await trigger.getAttribute('aria-controls');
      const ariaExpanded = await trigger.getAttribute('aria-expanded');
      const contentRole = await content.getAttribute('role');

      const results = {
        hasAriaLabel: !!(
          (await trigger.getAttribute('aria-label')) ||
          (await content.getAttribute('aria-labelledby'))
        ),
        hasAriaControls: !!ariaControls,
        hasAriaExpanded: !!ariaExpanded,
        hasProperRole: contentRole === 'region',
      };

      await this.log(
        `Accessibility attributes for item ${itemIndex + 1}: ${JSON.stringify(results)}`
      );
      return results;
    } catch (error) {
      await this.logError(
        `Error verifying accessibility attributes for item ${itemIndex + 1}: ${error}`
      );
      return {
        hasAriaLabel: false,
        hasAriaControls: false,
        hasAriaExpanded: false,
        hasProperRole: false,
      };
    }
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(): Promise<boolean> {
    try {
      // Try to dismiss any cookie banners or overlays
      try {
        const cookieBanner = this.page.locator(
          '#onetrust-close-btn-container, #onetrust-reject-all-handler, .cookie-banner-close'
        );
        if (await cookieBanner.first().isVisible({ timeout: 2000 })) {
          await cookieBanner.first().click();
          await this.page.waitForTimeout(1000);
        }
      } catch (e) {
        // Ignore if no cookie banner found
      }

      // Focus on first accordion trigger
      await this.page.locator(this.accordionSelectors.accordionTriggerFirst).focus();

      // Test Enter key
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(500);

      const isExpandedAfterEnter = await this.isAccordionItemExpanded(0);

      // Test Space key to collapse if Enter worked, or to expand if Enter didn't work
      await this.page.keyboard.press('Space');
      await this.page.waitForTimeout(500);

      const isExpandedAfterSpace = await this.isAccordionItemExpanded(0);

      // Test Tab navigation
      await this.page.keyboard.press('Tab');
      const focusedElement = await this.page.evaluate(
        () => document.activeElement?.className || document.activeElement?.id || 'unknown'
      );

      await this.log(
        `Keyboard navigation test - Enter: ${isExpandedAfterEnter}, Space: ${isExpandedAfterSpace}, Tab focus: ${focusedElement}`
      );

      // Either Enter should work, or Space should work
      return isExpandedAfterEnter || isExpandedAfterSpace;
    } catch (error) {
      await this.logError(`Error testing keyboard navigation: ${error}`);
      return false;
    }
  }

  /**
   * Measure accordion animation performance
   */
  async measureAnimationPerformance(): Promise<{ expandTime: number; collapseTime: number }> {
    try {
      // Measure expand animation
      const expandStart = performance.now();
      await this.expandAccordionItem(0);
      await this.page.waitForTimeout(100); // Wait for animation to settle
      const expandEnd = performance.now();
      const expandTime = expandEnd - expandStart;

      // Measure collapse animation
      const collapseStart = performance.now();
      await this.collapseAccordionItem(0);
      await this.page.waitForTimeout(100); // Wait for animation to settle
      const collapseEnd = performance.now();
      const collapseTime = collapseEnd - collapseStart;

      await this.log(
        `Animation performance - Expand: ${expandTime}ms, Collapse: ${collapseTime}ms`
      );

      return { expandTime, collapseTime };
    } catch (error) {
      await this.logError(`Error measuring animation performance: ${error}`);
      return { expandTime: 0, collapseTime: 0 };
    }
  }

  /**
   * Test multiple accordion items interaction
   */
  async testMultipleItemsInteraction(): Promise<boolean> {
    try {
      // Expand first item
      await this.expandAccordionItem(0);
      const firstExpanded = await this.isAccordionItemExpanded(0);

      // Expand second item
      await this.expandAccordionItem(1);
      const secondExpanded = await this.isAccordionItemExpanded(1);

      // Check if first item is still expanded (testing exclusive vs non-exclusive)
      const firstStillExpanded = await this.isAccordionItemExpanded(0);

      await this.log(
        `Multiple items test - First: ${firstExpanded}, Second: ${secondExpanded}, First still expanded: ${firstStillExpanded}`
      );

      return firstExpanded && secondExpanded;
    } catch (error) {
      await this.logError(`Error testing multiple items interaction: ${error}`);
      return false;
    }
  }

  /**
   * Verify component styling and visual states
   */
  async verifyComponentStyling(): Promise<{
    hasCorrectClasses: boolean;
    hasHoverStates: boolean;
    hasProperColors: boolean;
  }> {
    try {
      const accordionRoot = this.page.locator(this.accordionSelectors.accordionContainer);
      const accordionItem = this.page.locator(this.accordionSelectors.accordionItem).first();

      // Check for expected CSS classes
      const rootClass = await accordionRoot.getAttribute('class');
      const itemClass = await accordionItem.getAttribute('class');

      const hasCorrectClasses = !!(
        rootClass?.includes('AccordionRoot') && itemClass?.includes('AccordionItem')
      );

      // Test hover state by hovering over an item
      await accordionItem.hover();
      await this.page.waitForTimeout(200);

      // Check if hover class is applied (simplified check)
      const itemClassAfterHover = await accordionItem.getAttribute('class');
      const hasHoverStates = itemClassAfterHover !== itemClass;

      // Check for proper color attributes (simplified)
      const triggerElement = this.page.locator(this.accordionSelectors.accordionTrigger).first();
      const computedStyle = await triggerElement.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
        };
      });

      const hasProperColors = !!computedStyle.color;

      const results = {
        hasCorrectClasses,
        hasHoverStates,
        hasProperColors,
      };

      await this.log(`Component styling verification: ${JSON.stringify(results)}`);
      return results;
    } catch (error) {
      await this.logError(`Error verifying component styling: ${error}`);
      return {
        hasCorrectClasses: false,
        hasHoverStates: false,
        hasProperColors: false,
      };
    }
  }

  /**
   * Validate all accordion items are in closed state initially
   */
  async validateInitialState(): Promise<boolean> {
    try {
      const itemCount = await this.page.locator(this.accordionSelectors.accordionItem).count();
      let allClosed = true;

      for (let i = 0; i < itemCount; i++) {
        const isExpanded = await this.isAccordionItemExpanded(i);
        if (isExpanded) {
          allClosed = false;
          await this.logError(`Accordion item ${i + 1} is expanded in initial state`);
        }
      }

      await this.log(`Initial state validation - All items closed: ${allClosed}`);
      return allClosed;
    } catch (error) {
      await this.logError(`Error validating initial state: ${error}`);
      return false;
    }
  }

  /**
   * Comprehensive component validation
   */
  async validateComponent(): Promise<{
    isVisible: boolean;
    hasCorrectTitle: boolean;
    hasCorrectItems: boolean;
    initialStateClosed: boolean;
    functionalityWorks: boolean;
    accessibilityPassed: boolean;
  }> {
    try {
      const isVisible = await this.verifyComponentVisibility();
      const mainTitle = await this.getMainTitle();
      const itemTitles = await this.getAccordionItemTitles();

      const hasCorrectTitle = mainTitle.includes('Accordion Title');
      const hasCorrectItems = itemTitles.length >= 2;
      const initialStateClosed = await this.validateInitialState();

      // Test basic functionality
      await this.expandAccordionItem(0);
      const expandedAfterClick = await this.isAccordionItemExpanded(0);
      await this.collapseAccordionItem(0);
      const collapsedAfterClick = await this.isAccordionItemExpanded(0);
      const functionalityWorks = expandedAfterClick && !collapsedAfterClick;

      // Test accessibility
      const accessibilityAttrs = await this.verifyAccessibilityAttributes(0);
      const accessibilityPassed = Object.values(accessibilityAttrs).every(Boolean);

      const results = {
        isVisible,
        hasCorrectTitle,
        hasCorrectItems,
        initialStateClosed,
        functionalityWorks,
        accessibilityPassed,
      };

      await this.log(`Component validation results: ${JSON.stringify(results)}`);
      return results;
    } catch (error) {
      await this.logError(`Error during component validation: ${error}`);
      return {
        isVisible: false,
        hasCorrectTitle: false,
        hasCorrectItems: false,
        initialStateClosed: false,
        functionalityWorks: false,
        accessibilityPassed: false,
      };
    }
  }

  /**
   * Measure component load time
   */
  async measureLoadTime(): Promise<number> {
    try {
      const startTime = performance.now();
      await this.navigateToComponent();
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      await this.log(`Accordion component load time: ${loadTime}ms`);
      return loadTime;
    } catch (error) {
      await this.logError(`Error measuring load time: ${error}`);
      return 0;
    }
  }

  /**
   * Reset accordion to initial state (all items closed)
   */
  async resetToInitialState(): Promise<void> {
    try {
      const itemCount = await this.page.locator(this.accordionSelectors.accordionItem).count();

      for (let i = 0; i < itemCount; i++) {
        const isExpanded = await this.isAccordionItemExpanded(i);
        if (isExpanded) {
          await this.collapseAccordionItem(i);
        }
      }

      await this.log('Reset accordion to initial state (all items closed)');
    } catch (error) {
      await this.logError(`Error resetting accordion state: ${error}`);
    }
  }
}

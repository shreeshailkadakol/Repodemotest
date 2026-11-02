import { Page, Locator, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

/**
 * Tabbed Content Component (Story 683)
 *
 * Radix UI Tabs implementation. Tabs/tablist/panels expose ARIA roles
 * (role="tablist" | "tab" | "tabpanel") but NO data-qa/data-testid, so
 * locators use role + scoped CSS (language-agnostic). Radix element IDs are
 * dynamic (radix-*) and must NOT be hardcoded.
 *
 * DOM (from live inspection):
 *   section[data-qa="tabbed-content"]
 *     div[data-qa="tabbed-component"]
 *       div.overflow-x-auto                     <- horizontal scroll container (AC5)
 *         div[role="tablist"][aria-label]        <- tab navigation (AC3)
 *           button[role="tab"][aria-selected][data-state][aria-controls]
 *       div[role="tabpanel"][data-state]         <- active one not [hidden] (AC4)
 *         section[data-qa="text-image-block"]    <- Text-Image content
 */

const COMPONENT_CSS = '[data-qa="tabbed-content"]';
const INNER_CSS = '[data-qa="tabbed-component"]';
const TABLIST_CSS = `${COMPONENT_CSS} [role="tablist"]`;
const TAB_CSS = `${COMPONENT_CSS} [role="tab"]`;
const ACTIVE_TAB_CSS = `${COMPONENT_CSS} [role="tab"][aria-selected="true"]`;
const TABPANEL_CSS = `${COMPONENT_CSS} [role="tabpanel"]`;
const ACTIVE_PANEL_CSS = `${COMPONENT_CSS} [role="tabpanel"][data-state="active"]`;
const SCROLL_CONTAINER_CSS = `${INNER_CSS} .overflow-x-auto`;
const SCROLL_CONTAINER_XPATH = `//div[@data-qa="tabbed-component"]//div[contains(@class,"overflow-x-auto")]`;
const TEXT_IMAGE_BLOCK_CSS = `${ACTIVE_PANEL_CSS} [data-qa="text-image-block"]`;

export class TabbedComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  async navigateToTestPage(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('TabbedComponent', baseURL);
    await this.navigateWithAuthentication(url);
  }

  // --- Single-element SmartLocators ---------------------------------------

  async getComponent(): Promise<Locator> {
    return this.findSmart({
      dataQa: 'tabbed-content',
      testId: 'tabbed-content',
      css: COMPONENT_CSS,
      description: 'Tabbed Content component container',
    });
  }

  async getInner(): Promise<Locator> {
    return this.findSmart({
      dataQa: 'tabbed-component',
      testId: 'tabbed-component',
      css: INNER_CSS,
      description: 'Tabbed Content inner wrapper',
    });
  }

  async getTabList(): Promise<Locator> {
    return this.findSmart({
      role: { role: 'tablist' },
      css: TABLIST_CSS,
      xpath: `//section[@data-qa="tabbed-content"]//div[@role="tablist"]`,
      description: 'Tab navigation list',
    });
  }

  async getActiveTab(): Promise<Locator> {
    return this.findSmart({
      css: ACTIVE_TAB_CSS,
      xpath: `//section[@data-qa="tabbed-content"]//*[@role="tab" and @aria-selected="true"]`,
      description: 'Active (selected) tab',
    });
  }

  async getActivePanel(): Promise<Locator> {
    return this.findSmart({
      css: ACTIVE_PANEL_CSS,
      xpath: `//section[@data-qa="tabbed-content"]//*[@role="tabpanel" and @data-state="active"]`,
      description: 'Active tab content panel',
    });
  }

  async getTextImageBlock(): Promise<Locator> {
    return this.findSmart({
      css: TEXT_IMAGE_BLOCK_CSS,
      dataQa: 'text-image-block',
      xpath: `//section[@data-qa="tabbed-content"]//*[@role="tabpanel" and @data-state="active"]//section[@data-qa="text-image-block"]`,
      description: 'Text-Image content block inside active panel',
    });
  }

  async getScrollContainer(): Promise<Locator> {
    return this.findSmart({
      css: SCROLL_CONTAINER_CSS,
      xpath: SCROLL_CONTAINER_XPATH,
      description: 'Horizontal scroll container for tab navigation',
    });
  }

  // --- Collection locators (mirror accordion pattern) ---------------------
  // findSmart returns .first(); collections legitimately use scoped locators
  // for count()/nth() (see components/accordionComponent.ts).

  getTabs(): Locator {
    return this.page.locator(TAB_CSS);
  }

  getPanels(): Locator {
    return this.page.locator(TABPANEL_CSS);
  }

  getTabByIndex(index: number): Locator {
    return this.getTabs().nth(index);
  }

  async getTabCount(): Promise<number> {
    return this.getTabs().count();
  }

  async getVisiblePanelCount(): Promise<number> {
    // Panels that are NOT hidden (Radix marks inactive panels with [hidden])
    return this.page.locator(`${TABPANEL_CSS}:not([hidden])`).count();
  }

  // --- Interactions -------------------------------------------------------

  async clickTabByIndex(index: number): Promise<void> {
    await this.getTabByIndex(index).click();
  }

  async focusTabByIndex(index: number): Promise<void> {
    await this.getTabByIndex(index).focus();
  }

  // --- Scroll helpers -----------------------------------------------------

  async getScrollMetrics(): Promise<{
    scrollWidth: number;
    clientWidth: number;
    scrollLeft: number;
  }> {
    const container = await this.getScrollContainer();
    return container.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      scrollLeft: el.scrollLeft,
    }));
  }

  async setScrollLeft(px: number): Promise<void> {
    const container = await this.getScrollContainer();
    await container.evaluate((el, value) => {
      el.scrollLeft = value;
    }, px);
  }
}

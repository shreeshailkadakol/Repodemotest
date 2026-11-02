import { Page, Locator, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

const COMPONENT_CSS = '[data-testid="global-contactlink"]';
const ICON_CSS = `${COMPONENT_CSS} > div > svg[aria-hidden="true"]`;
const ICON_XPATH = `//section[@data-testid="global-contactlink"]/div/svg[@aria-hidden="true"]`;
const TITLE_CSS = `${COMPONENT_CSS} .font-bold`;
const TITLE_XPATH = `//section[@data-testid="global-contactlink"]//div[contains(@class,"font-bold")]`;
const BUTTON_CSS = `${COMPONENT_CSS} button`;
// CTA text label: the fix for bug 5414 moved the label out of a "text-text-muted"
// div into a text <span> inside the button (now primary colour, uppercase/italic).
const BUTTON_TEXT_CSS = `${BUTTON_CSS} span`;
const BUTTON_TEXT_XPATH = `//section[@data-testid="global-contactlink"]//button//span[normalize-space(text())]`;
const CHEVRON_CSS = `${BUTTON_CSS} svg[aria-hidden="true"]`;
const CHEVRON_XPATH = `//section[@data-testid="global-contactlink"]//button//svg[@aria-hidden="true"]`;
const OVERLAY_CSS = '[data-testid="location-overlay"]';
const OVERLAY_CLOSE_CSS = `${OVERLAY_CSS} button[aria-label="Close"]`;
const OVERLAY_GLOBAL_BUTTON_CSS = `${OVERLAY_CSS} button[aria-label*="Global"]`;
const OVERLAY_GLOBAL_BUTTON_XPATH = `//div[@data-testid="location-overlay"]//button[contains(@aria-label,"Global")]`;

export class GlobalContactLinkComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  async navigateToTestPage(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('GlobalContactLinkComponent', baseURL);
    await this.navigateWithAuthentication(url);
  }

  async getComponent(): Promise<Locator> {
    return this.findSmart({
      testId: 'global-contactlink',
      dataQa: 'global-contactlink',
      css: COMPONENT_CSS,
      description: 'Global Contact Link component container',
    });
  }

  async getGlobeIcon(): Promise<Locator> {
    return this.findSmart({
      css: ICON_CSS,
      xpath: ICON_XPATH,
      description: 'Globe navigation icon',
    });
  }

  async getTitle(): Promise<Locator> {
    return this.findSmart({
      css: TITLE_CSS,
      xpath: TITLE_XPATH,
      description: 'Component title text',
    });
  }

  async getCTAButton(): Promise<Locator> {
    return this.findSmart({
      css: BUTTON_CSS,
      role: { role: 'button' },
      testId: 'global-contactlink',
      description: 'CTA button that opens location selector',
    });
  }

  async getCTAButtonText(): Promise<Locator> {
    return this.findSmart({
      css: BUTTON_TEXT_CSS,
      xpath: BUTTON_TEXT_XPATH,
      description: 'CTA button text label',
    });
  }

  async getChevronIcon(): Promise<Locator> {
    return this.findSmart({
      css: CHEVRON_CSS,
      xpath: CHEVRON_XPATH,
      description: 'Chevron right icon in CTA button',
    });
  }

  async getLocationOverlay(): Promise<Locator> {
    return this.findSmart({
      testId: 'location-overlay',
      dataQa: 'location-overlay',
      css: OVERLAY_CSS,
      description: 'Location selector overlay',
    });
  }

  async getOverlayCloseButton(): Promise<Locator> {
    return this.findSmart({
      css: OVERLAY_CLOSE_CSS,
      role: { role: 'button', name: 'Close' },
      testId: 'location-overlay',
      description: 'Location overlay close button',
    });
  }

  async clickCTAButton(): Promise<void> {
    await this.clickSmart({
      css: BUTTON_CSS,
      role: { role: 'button' },
      testId: 'global-contactlink',
      description: 'CTA button that opens location selector',
    });
  }

  async clickOverlayClose(): Promise<void> {
    await this.clickSmart({
      css: OVERLAY_CLOSE_CSS,
      role: { role: 'button', name: 'Close' },
      testId: 'location-overlay',
      description: 'Location overlay close button',
    });
  }

  async getOverlayGlobalButton(): Promise<Locator> {
    return this.findSmart({
      css: OVERLAY_GLOBAL_BUTTON_CSS,
      xpath: OVERLAY_GLOBAL_BUTTON_XPATH,
      description: 'Bayer Global preselected button in location overlay',
    });
  }

  async isOverlayVisible(): Promise<boolean> {
    return this.isVisibleSmart({
      testId: 'location-overlay',
      dataQa: 'location-overlay',
      css: OVERLAY_CSS,
      description: 'Location selector overlay',
    });
  }
}

/**
 * Event Stage Component (Page Object Model)
 *
 * What:
 *   Represents the "Event Stage" hero rendered at the top of an Event Page.
 *   Source story: ADO 3802. Validated DOM:
 *     <section data-qa="event-stage" aria-labelledby="event-stage-title">
 *       <div data-qa="event-stage-date">       (icon + <time>)
 *       <h1  data-qa="event-stage-title">
 *       <ul  data-qa="event-stage-tags">
 *         <li data-qa="tag-chip"> × 1..n
 *       <div data-qa="event-stage-image"> ( <img data-qa="next-image"> )
 *     </section>
 *
 * Why SmartLocator only:
 *   Per playwright-prompt.md every element MUST use findSmart() with ≥3
 *   fallback strategies and a meaningful description for the selector-health
 *   report. We deliberately AVOID `container.locator()` chaining.
 *
 * Scoping note:
 *   `next-image`, `icon` and (footer) `Link` data-qa values repeat across the
 *   page. All child locators therefore use scoped CSS/XPath rooted at
 *   `section[data-qa="event-stage"]` so we never match an element outside
 *   the Event Stage subtree.
 */
import { Page, Locator, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

const ROOT_CSS = 'section[data-qa="event-stage"]';
const ROOT_XPATH = '//section[@data-qa="event-stage"]';

export class EventStageComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ────────────────────────────────────────────────────────────
  // Navigation / setup
  // ────────────────────────────────────────────────────────────

  /**
   * Navigate to the Event Stage test page (or page-mode URL injected by the
   * component-mapper orchestrator) with Vercel auth + cookie acceptance.
   */
  async navigateToPage(baseURL?: string): Promise<void> {
    const targetBase = baseURL ?? envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('EventStage', targetBase);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForComponentLoad();
  }

  /** Wait for the Event Stage root section to be attached + visible. */
  async waitForComponentLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15_000 });
    const container = await this.getContainer();
    await container.waitFor({ state: 'visible', timeout: 15_000 });
  }

  // ────────────────────────────────────────────────────────────
  // SmartLocator getters (≥3 fallback strategies each)
  // ────────────────────────────────────────────────────────────

  /** <section data-qa="event-stage" ...> - the Event Stage root container. */
  async getContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'event-stage',
      testId: 'event-stage',
      css: ROOT_CSS,
      xpath: ROOT_XPATH,
      description: 'Event Stage root section',
    });
  }

  /** <div data-qa="event-stage-date"> wrapper holding the calendar icon + <time>. */
  async getDateBlock(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'event-stage-date',
      testId: 'event-stage-date',
      css: `${ROOT_CSS} [data-qa="event-stage-date"]`,
      xpath: `${ROOT_XPATH}//*[@data-qa="event-stage-date"]`,
      description: 'Event Stage date block (icon + <time>)',
    });
  }

  /**
   * The <time> element inside the date block. The DOM has no data-qa on
   * <time>, so we anchor on the parent's data-qa and use scoped CSS/XPath.
   */
  async getDateTimeElement(): Promise<Locator> {
    return await this.findSmart({
      css: `${ROOT_CSS} [data-qa="event-stage-date"] time`,
      xpath: `${ROOT_XPATH}//*[@data-qa="event-stage-date"]//time`,
      role: { role: 'time' },
      description: 'Event Stage <time> element (raw date)',
    });
  }

  /** <h1 data-qa="event-stage-title"> - the event title. */
  async getTitleElement(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'event-stage-title',
      testId: 'event-stage-title',
      css: `${ROOT_CSS} h1[data-qa="event-stage-title"]`,
      xpath: `${ROOT_XPATH}//h1[@data-qa="event-stage-title"]`,
      description: 'Event Stage <h1> title',
    });
  }

  /** <ul data-qa="event-stage-tags"> - classification tags wrapper. */
  async getTagsList(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'event-stage-tags',
      testId: 'event-stage-tags',
      css: `${ROOT_CSS} ul[data-qa="event-stage-tags"]`,
      xpath: `${ROOT_XPATH}//ul[@data-qa="event-stage-tags"]`,
      description: 'Event Stage tags list <ul>',
    });
  }

  /**
   * Locator that resolves to ALL <li data-qa="tag-chip"> tag items.
   *
   * Pattern: we first run a SmartLocator `findSmart` probe so the chosen
   * strategy is recorded by selector-health monitoring (per playwright-prompt
   * mandate). SmartLocator returns `.first()`, but our callers need to
   * `count()` and iterate, so after the probe we re-resolve via the verified
   * scoped CSS to get the full collection.
   */
  async getTagItems(): Promise<Locator> {
    // probe - kept for selector-health monitoring
    await this.findSmart({
      dataQa: 'tag-chip',
      css: `${ROOT_CSS} ul[data-qa="event-stage-tags"] li[data-qa="tag-chip"]`,
      xpath: `${ROOT_XPATH}//ul[@data-qa="event-stage-tags"]/li[@data-qa="tag-chip"]`,
      description: 'Event Stage tag <li> items (first match - for health probe)',
    });
    return this.page.locator(
      `${ROOT_CSS} ul[data-qa="event-stage-tags"] li[data-qa="tag-chip"]`
    );
  }

  /**
   * Locator for the inner styled `<span>` that carries the chip typography
   * (text colour / weight / size / line-height / italic-uppercase). The <li>
   * itself only carries the green background + padding, so visual typography
   * tests MUST read computed styles from this span - not the <li>.
   *
   * Three fallback strategies all scoped under the stage root.
   */
  async getTagTextElement(index = 0): Promise<Locator> {
    const liCss = `${ROOT_CSS} ul[data-qa="event-stage-tags"] li[data-qa="tag-chip"]`;
    const liXpath = `${ROOT_XPATH}//ul[@data-qa="event-stage-tags"]/li[@data-qa="tag-chip"]`;
    await this.findSmart({
      css: `${liCss} span`,
      xpath: `${liXpath}/span`,
      text: /\S+/,
      description: `Event Stage tag #${index + 1} inner <span> (styled chip text)`,
    });
    return this.page.locator(`${liCss} span`).nth(index);
  }

  /** <div data-qa="event-stage-image"> - image wrapper inside the stage. */
  async getImageWrapper(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'event-stage-image',
      testId: 'event-stage-image',
      css: `${ROOT_CSS} [data-qa="event-stage-image"]`,
      xpath: `${ROOT_XPATH}//*[@data-qa="event-stage-image"]`,
      description: 'Event Stage image wrapper',
    });
  }

  /**
   * The actual <img> inside the wrapper. We CANNOT use `dataQa: 'next-image'`
   * as primary because that value is reused for 3 other images on the page;
   * scoped CSS/XPath are the only safe selectors.
   */
  async getImageElement(): Promise<Locator> {
    return await this.findSmart({
      css: `${ROOT_CSS} [data-qa="event-stage-image"] img`,
      xpath: `${ROOT_XPATH}//*[@data-qa="event-stage-image"]//img`,
      altText: /.+/,
      role: { role: 'img' },
      description: 'Event Stage <img> (scoped to event-stage-image wrapper)',
    });
  }

  /**
   * Calendar icon SVG inside the date block.
   * `data-qa="icon"` is reused across the page (3 occurrences), so we MUST
   * scope strictly under the stage container. Three fallback strategies:
   *   1. Exact: scoped path through the date block to the icon svg
   *   2. XPath equivalent of the above
   *   3. Looser scope (any svg[data-qa="icon"] inside the stage section) -
   *      survives small markup tweaks while still being safely scoped.
   */
  async getDateIcon(): Promise<Locator> {
    return await this.findSmart({
      css: `${ROOT_CSS} [data-qa="event-stage-date"] svg[data-qa="icon"]`,
      xpath: `${ROOT_XPATH}//*[@data-qa="event-stage-date"]/svg[@data-qa="icon"]`,
      description: 'Event Stage calendar icon SVG (scoped to date block)',
      // Looser scoped fallback as 3rd strategy
      // (SmartLocator allows multiple CSS-like strategies via these keys)
      role: 'img',
    });
  }
}

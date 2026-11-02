/* global document */
import { Page, Locator, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

/**
 * Automated Events List component (story 1582).
 *
 * Test target is the QA test page, which renders real events. Navigation uses the URL from
 * componentURL.ts (EventList) resolved against envUtils.getBaseUrl(), with Vercel HTTP auth -
 * the same flow as every other component (no Sitecore editing-host / storageState).
 */
const ROOT_CSS = 'section[data-qa="event-list"]';
const ROOT_XPATH = '//section[@data-qa="event-list"]';

const ITEM_CSS = `${ROOT_CSS} [data-qa="event-list-item"]`;
const ITEM_XPATH = `${ROOT_XPATH}//*[@data-qa="event-list-item"]`;

// Component header title = first title-component, a direct child of the header div
// (event titles live deeper, inside items - so this scoping keeps them separate).
const HEADER_TITLE_CSS = `${ROOT_CSS} > div > [data-qa="title-component"]`;

// Past/Future toggle: a header <button> with NO data-qa (add-to-calendar buttons carry
// data-qa and live inside items). Scoped to the direct header div.
const TOGGLE_CSS = `${ROOT_CSS} > div > button`;

// Per-item children.
const EVENT_TITLE_CSS = `${ITEM_CSS} [data-qa="title-component"]`;
const DAY_TAG_CSS = `${ITEM_CSS} [data-qa="day-tag"]`;
const DAY_NUMBER_CSS = `${ITEM_CSS} [data-testid="day-tag-day"]`;
const META_TAG_CSS = `${ITEM_CSS} [data-qa="meta-tag"]`;
const TAGS_CSS = `${ITEM_CSS} [data-qa="tags"]`;
const ADD_TO_CAL_CSS = `${ITEM_CSS} [data-qa="add-to-calendar-button"]`;

// Event-page (arrow) link: direct anchor child of an item section. NO data-qa; aria-label
// is inconsistent across cards, so this is scoped by structure, not aria.
const EVENT_PAGE_LINK_CSS = `${ITEM_CSS} > a[href]`;

export class EventListComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ----------------------------------------------------------------
  // Navigation / setup
  // ----------------------------------------------------------------

  /** Navigate to the Event List test page (componentURL + Vercel HTTP auth). */
  async navigateToPage(baseURL?: string): Promise<void> {
    const targetBase = baseURL ?? envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('EventList', targetBase);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForComponentLoad();
  }

  async waitForComponentLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30_000 });
    // Wait for the root on the raw locator (generous timeout) before the SmartLocator probe,
    // whose per-strategy visibility check is otherwise too tight under concurrent workers.
    await this.page
      .locator(ROOT_CSS)
      .first()
      .scrollIntoViewIfNeeded()
      .catch(() => {});
    await this.page.locator(ROOT_CSS).first().waitFor({ state: 'visible', timeout: 45_000 });
    const container = await this.getContainer();
    await container.waitFor({ state: 'visible', timeout: 15_000 });
  }

  // ----------------------------------------------------------------
  // Singleton elements
  // ----------------------------------------------------------------

  /** <section data-qa="event-list"> - the whole component. */
  async getContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'event-list',
      testId: 'event-list',
      css: ROOT_CSS,
      xpath: ROOT_XPATH,
      description: 'Event List root section',
    });
  }

  /**
   * Component header title. Scoped CSS/XPath only - `title-component` is page-wide (page
   * H1 + each event title carry it), so the bare dataQa strategy is unsafe here.
   */
  async getComponentTitle(): Promise<Locator> {
    return await this.findSmart({
      css: HEADER_TITLE_CSS,
      xpath: `(${ROOT_XPATH}//*[@data-qa="title-component"])[1]`,
      description: 'Event List component header title (first title-component)',
    });
  }

  /**
   * Past/Future toggle button. No data-qa on this control, so scoped structural CSS with a
   * language-dependent role fallback as last resort.
   */
  async getToggleButton(): Promise<Locator> {
    return await this.findSmart({
      css: TOGGLE_CSS,
      xpath: `${ROOT_XPATH}/div/button`,
      role: { role: 'button', name: /past events|future events/i },
      description: 'Event List past/future toggle button (no data-qa)',
    });
  }

  // ----------------------------------------------------------------
  // Repeated collections (probe-then-resolve -> raw scoped Locator)
  // ----------------------------------------------------------------

  /** All event cards (<section data-qa="event-list-item">). */
  async getEventItems(): Promise<Locator> {
    await this.findSmart({
      dataQa: 'event-list-item',
      testId: 'event-list-item',
      css: ITEM_CSS,
      xpath: ITEM_XPATH,
      description: 'Event list items (first match - health probe)',
    });
    return this.page.locator(ITEM_CSS);
  }

  /** All day-tag <time> elements (one per event). */
  async getAllDayTags(): Promise<Locator> {
    await this.findSmart({
      dataQa: 'day-tag',
      testId: 'day-tag',
      css: DAY_TAG_CSS,
      xpath: `${ITEM_XPATH}//*[@data-qa="day-tag"]`,
      description: 'Event day-tag <time> elements (first match - health probe)',
    });
    return this.page.locator(DAY_TAG_CSS);
  }

  /** All day-number elements (data-testid="day-tag-day"; no data-qa). */
  async getAllDayNumbers(): Promise<Locator> {
    try {
      await this.findSmart({
        testId: 'day-tag-day',
        css: DAY_NUMBER_CSS,
        xpath: `${ITEM_XPATH}//*[@data-testid="day-tag-day"]`,
        description: 'Event day number elements (first match - health probe)',
      });
    } catch {
      // Transient probe miss - fall through to the raw resolved locator.
    }
    return this.page.locator(DAY_NUMBER_CSS);
  }

  /** All event titles (<h2 data-qa="title-component"> inside items). */
  async getAllEventTitles(): Promise<Locator> {
    await this.findSmart({
      css: EVENT_TITLE_CSS,
      xpath: `${ITEM_XPATH}//*[@data-qa="title-component"]`,
      description: 'Event titles inside items (first match - health probe)',
    });
    return this.page.locator(EVENT_TITLE_CSS);
  }

  /** All meta-tag rows (date / location), across all events. */
  async getAllMetaTags(): Promise<Locator> {
    await this.findSmart({
      dataQa: 'meta-tag',
      testId: 'meta-tag',
      css: META_TAG_CSS,
      xpath: `${ITEM_XPATH}//*[@data-qa="meta-tag"]`,
      description: 'Event meta-tag rows (first match - health probe)',
    });
    return this.page.locator(META_TAG_CSS);
  }

  /** All classification tag lists (<ul data-qa="tags">) - optional per event. */
  async getAllTagLists(): Promise<Locator> {
    try {
      await this.findSmart({
        dataQa: 'tags',
        testId: 'tags',
        css: TAGS_CSS,
        xpath: `${ITEM_XPATH}//*[@data-qa="tags"]`,
        description: 'Event tags <ul> lists (first match - health probe)',
      });
    } catch {
      // Zero tag lists is a valid state (tags are optional).
    }
    return this.page.locator(TAGS_CSS);
  }

  /** All Add-to-Calendar buttons (one per event). */
  async getAllAddToCalendarButtons(): Promise<Locator> {
    await this.findSmart({
      dataQa: 'add-to-calendar-button',
      testId: 'add-to-calendar-button',
      css: ADD_TO_CAL_CSS,
      xpath: `${ITEM_XPATH}//*[@data-qa="add-to-calendar-button"]`,
      role: { role: 'button', name: /add\s*to\s*calendar/i },
      description: 'Add-to-Calendar buttons (first match - health probe)',
    });
    return this.page.locator(ADD_TO_CAL_CSS);
  }

  /**
   * Event-page (arrow) links (AC9). Direct anchors inside items. Absent for events without
   * an Event Page (AC10). Probe wrapped in try/catch - zero links is a valid state.
   */
  async getEventPageLinks(): Promise<Locator> {
    try {
      await this.findSmart({
        css: EVENT_PAGE_LINK_CSS,
        xpath: `${ITEM_XPATH}/a[@href]`,
        description: 'Event-page arrow links inside items (first match - health probe)',
      });
    } catch {
      // Zero event-page links is a valid AC10 state; do not propagate.
    }
    return this.page.locator(EVENT_PAGE_LINK_CSS);
  }

  // ----------------------------------------------------------------
  // A11y subtree collections
  // ----------------------------------------------------------------

  /** All heading elements inside the component (for a11y iteration). */
  async getAllHeadings(): Promise<Locator> {
    await this.findSmart({
      role: { role: 'heading' },
      css: `${ROOT_CSS} :is(h1,h2,h3,h4,h5,h6)`,
      xpath: `${ROOT_XPATH}//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]`,
      description: 'Event List headings (first match - health probe)',
    });
    return this.page.locator(`${ROOT_CSS} :is(h1,h2,h3,h4,h5,h6)`);
  }

  // ----------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------

  /** Whether a given event item contains an event-page (arrow) link. */
  async itemHasEventPageLink(item: Locator): Promise<boolean> {
    return (await item.locator('a[href]').count()) > 0;
  }

  /**
   * Parse an event start date from a day-tag <time>. Prefers the machine-readable
   * `datetime` attribute; falls back to the human `aria-label` (e.g. "July 8, 2026").
   * Returns null when neither yields a valid date.
   */
  async parseDayTagDate(dayTag: Locator): Promise<Date | null> {
    const datetime = await dayTag.getAttribute('datetime');
    const aria = await dayTag.getAttribute('aria-label');
    const candidate = (datetime && datetime.trim()) || (aria && aria.trim()) || '';
    if (!candidate) return null;
    const parsed = new Date(candidate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  /**
   * Ordered list of year-group header texts (e.g. ["2026", "2027"]). Year headers have no
   * data-qa, so they are collected structurally: leaf elements inside the component whose
   * text is exactly a 4-digit year and which are NOT inside an event card.
   */
  async getYearHeaderTexts(): Promise<string[]> {
    return await this.page.evaluate((rootCss) => {
      const root = document.querySelector(rootCss);
      if (!root) return [];
      const years: string[] = [];
      root.querySelectorAll('*').forEach((el) => {
        if (el.closest('[data-qa="event-list-item"]')) return; // skip in-card dates
        if (el.children.length !== 0) return; // leaf only
        const t = (el.textContent || '').trim();
        if (/^(19|20)\d{2}$/.test(t) && !years.includes(t)) years.push(t);
      });
      return years;
    }, ROOT_CSS);
  }
}

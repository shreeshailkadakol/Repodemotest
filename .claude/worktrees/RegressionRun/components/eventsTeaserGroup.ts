import { Page, Locator, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

const ROOT_CSS = 'section[data-qa="event-teaser-group"]';
const ROOT_XPATH = '//section[@data-qa="event-teaser-group"]';

const ITEMS_CSS = `${ROOT_CSS} [data-qa="event-teaser-items"]`;
const ITEMS_XPATH = `${ROOT_XPATH}//*[@data-qa="event-teaser-items"]`;

const ITEM_CSS = `${ITEMS_CSS} [data-qa="event-teaser-list-item"]`;

// Group title = the FIRST title-component in the group (it precedes the items in DOM order).
// Event titles live inside the items wrapper and are matched separately.
const GROUP_TITLE_CSS = `${ROOT_CSS} [data-qa="title-component"]`;
const EVENT_TITLE_CSS = `${ITEMS_CSS} [data-qa="title-component"]`;

// Tag-chip text styling lives on the inner element; the <li data-qa="tag-chip"> only
// carries the green pill background. Read typography from the inner element.
const TAG_CHIP_TEXT_CSS = `${ITEM_CSS} [data-qa="tag-chip"] > *`;

// Overview link carries data-qa="Link"; the event-page arrows have NO data-qa, so this is unique.
const OVERVIEW_CSS = `${ROOT_CSS} a[data-qa="Link"]`;

// Event-page (arrow) links: anchors inside items that expose an aria-label (= event title).
const EVENT_PAGE_LINK_CSS = `${ITEMS_CSS} a[aria-label]`;

export class EventsTeaserGroupComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ----------------------------------------------------------------
  // Navigation / setup
  // ----------------------------------------------------------------

  async navigateToPage(baseURL?: string): Promise<void> {
    const targetBase = baseURL ?? envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('EventsTeaserGroup', targetBase);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForComponentLoad();
  }

  async waitForComponentLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15_000 });
    const container = await this.getContainer();
    await container.waitFor({ state: 'visible', timeout: 15_000 });
  }

  // ----------------------------------------------------------------
  // Singleton elements
  // ----------------------------------------------------------------

  /** <section data-qa="event-teaser-group"> - the whole component. */
  async getContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'event-teaser-group',
      testId: 'event-teaser-group',
      css: ROOT_CSS,
      xpath: ROOT_XPATH,
      description: 'Events Teaser Group root section',
    });
  }

  /**
   * Group title ("Calendar"). Scoped CSS/XPath only - `title-component` is page-wide
   * (page H1 + each event title carry it), so the bare dataQa strategy is unsafe here.
   */
  async getGroupTitle(): Promise<Locator> {
    return await this.findSmart({
      css: GROUP_TITLE_CSS,
      xpath: `(${ROOT_XPATH}//*[@data-qa="title-component"])[1]`,
      description: 'Events Teaser Group title (Calendar) - first title-component in the group',
    });
  }

  /**
   * Overview link (AC7). Unique via data-qa="Link" scoped to the group. No broad role
   * fallback: role:link would match the page header logo/nav links (unstyled), producing
   * false visual/label failures.
   */
  async getOverviewLink(): Promise<Locator> {
    return await this.findSmart({
      css: OVERVIEW_CSS,
      xpath: `${ROOT_XPATH}//a[@data-qa="Link"]`,
      description: 'Events Teaser Group Overview link (AC7) - scoped, no role fallback',
    });
  }

  /** <div data-qa="event-teaser-items"> - the items wrapper. */
  async getItemsWrapper(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'event-teaser-items',
      testId: 'event-teaser-items',
      css: ITEMS_CSS,
      xpath: ITEMS_XPATH,
      description: 'Events Teaser Group items wrapper',
    });
  }

  // ----------------------------------------------------------------
  // Repeated collections (probe-then-resolve -> raw scoped Locator)
  // ----------------------------------------------------------------

  /** All event items (<section data-qa="event-teaser-list-item">). */
  async getEventItems(): Promise<Locator> {
    await this.findSmart({
      dataQa: 'event-teaser-list-item',
      testId: 'event-teaser-list-item',
      css: ITEM_CSS,
      xpath: `${ITEMS_XPATH}//*[@data-qa="event-teaser-list-item"]`,
      description: 'Event teaser list items (first match - health probe)',
    });
    return this.page.locator(ITEM_CSS);
  }

  /** All day-tag <time> elements (one per event). */
  async getAllDayTags(): Promise<Locator> {
    await this.findSmart({
      dataQa: 'day-tag',
      testId: 'day-tag',
      css: `${ITEM_CSS} [data-qa="day-tag"]`,
      xpath: `${ITEMS_XPATH}//*[@data-qa="day-tag"]`,
      description: 'Event day-tag <time> elements (first match - health probe)',
    });
    return this.page.locator(`${ITEM_CSS} [data-qa="day-tag"]`);
  }

  /**
   * All day-number elements (data-testid="day-tag-day"; no data-qa).
   * Probe is wrapped in try/catch so a transient visibility miss (seen at SM during
   * the double-navigation beforeEach) does not hard-fail; callers guard on count().
   */
  async getAllDayNumbers(): Promise<Locator> {
    try {
      await this.findSmart({
        testId: 'day-tag-day',
        css: `${ITEM_CSS} [data-testid="day-tag-day"]`,
        xpath: `${ITEMS_XPATH}//*[@data-testid="day-tag-day"]`,
        description: 'Event day number elements (first match - health probe)',
      });
    } catch {
      // Transient probe miss - fall through to the raw resolved locator below.
    }
    return this.page.locator(`${ITEM_CSS} [data-testid="day-tag-day"]`);
  }

  /** All tags lists (<ul data-qa="tags">, one per event). */
  async getAllTagLists(): Promise<Locator> {
    await this.findSmart({
      dataQa: 'tags',
      testId: 'tags',
      css: `${ITEM_CSS} [data-qa="tags"]`,
      xpath: `${ITEMS_XPATH}//*[@data-qa="tags"]`,
      description: 'Event tags <ul> lists (first match - health probe)',
    });
    return this.page.locator(`${ITEM_CSS} [data-qa="tags"]`);
  }

  /** All tag chips (<li data-qa="tag-chip">) across all events. */
  async getAllTagChips(): Promise<Locator> {
    await this.findSmart({
      dataQa: 'tag-chip',
      css: `${ITEM_CSS} [data-qa="tag-chip"]`,
      xpath: `${ITEMS_XPATH}//*[@data-qa="tag-chip"]`,
      description: 'Event tag chips (first match - health probe)',
    });
    return this.page.locator(`${ITEM_CSS} [data-qa="tag-chip"]`);
  }

  /**
   * Inner text elements of tag chips (typography lives here, not on the <li>).
   * Falls back to the chip itself when a chip has no child element.
   */
  async getAllTagChipTexts(): Promise<Locator> {
    const inner = this.page.locator(TAG_CHIP_TEXT_CSS);
    if ((await inner.count()) > 0) {
      await this.findSmart({
        css: TAG_CHIP_TEXT_CSS,
        xpath: `${ITEMS_XPATH}//*[@data-qa="tag-chip"]/*[1]`,
        description: 'Tag chip inner text elements (first match - health probe)',
      });
      return inner;
    }
    return this.page.locator(`${ITEM_CSS} [data-qa="tag-chip"]`);
  }

  /** All event titles (<h2 data-qa="title-component"> inside items). */
  async getAllEventTitles(): Promise<Locator> {
    await this.findSmart({
      css: EVENT_TITLE_CSS,
      xpath: `${ITEMS_XPATH}//*[@data-qa="title-component"]`,
      description: 'Event titles inside items (first match - health probe)',
    });
    return this.page.locator(EVENT_TITLE_CSS);
  }

  /** All Add-to-Calendar buttons (one per event). */
  async getAllAddToCalendarButtons(): Promise<Locator> {
    await this.findSmart({
      dataQa: 'add-to-calendar-button',
      testId: 'add-to-calendar-button',
      css: `${ITEM_CSS} [data-qa="add-to-calendar-button"]`,
      xpath: `${ITEMS_XPATH}//*[@data-qa="add-to-calendar-button"]`,
      role: { role: 'button', name: /add\s*to\s*calendar/i },
      description: 'Add-to-Calendar buttons (first match - health probe)',
    });
    return this.page.locator(`${ITEM_CSS} [data-qa="add-to-calendar-button"]`);
  }

  /**
   * Event-page (arrow) links (AC5). Anchors inside items exposing an aria-label
   * (= event title). No data-qa on these, so scoped CSS/XPath only. Absent for
   * events without an Event Page (AC6). Probe is wrapped in try/catch because a
   * page could legitimately have zero such links.
   */
  async getEventPageLinks(): Promise<Locator> {
    try {
      await this.findSmart({
        css: EVENT_PAGE_LINK_CSS,
        xpath: `${ITEMS_XPATH}//a[@aria-label]`,
        description: 'Event-page arrow links inside items (first match - health probe)',
      });
    } catch {
      // Zero event-page links is a valid AC6 state; do not propagate probe failure.
    }
    return this.page.locator(EVENT_PAGE_LINK_CSS);
  }

  // ----------------------------------------------------------------
  // A11y subtree collections
  // ----------------------------------------------------------------

  /** All heading elements inside the group (for a11y iteration). */
  async getAllHeadings(): Promise<Locator> {
    await this.findSmart({
      role: { role: 'heading' },
      css: `${ROOT_CSS} :is(h1,h2,h3,h4,h5,h6)`,
      xpath: `${ROOT_XPATH}//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]`,
      description: 'Events Teaser Group headings (first match - health probe)',
    });
    return this.page.locator(`${ROOT_CSS} :is(h1,h2,h3,h4,h5,h6)`);
  }

  /** All anchor elements inside the group (for a11y iteration). */
  async getAllAnchors(): Promise<Locator> {
    await this.findSmart({
      role: { role: 'link' },
      css: `${ROOT_CSS} a`,
      xpath: `${ROOT_XPATH}//a`,
      description: 'Events Teaser Group anchors (first match - health probe)',
    });
    return this.page.locator(`${ROOT_CSS} a`);
  }

  // ----------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------

  /**
   * Whether a given event item contains an event-page (arrow) link.
   * Used to distinguish AC5 (has page) from AC6 (no page) items.
   */
  async itemHasEventPageLink(item: Locator): Promise<boolean> {
    return (await item.locator('a[aria-label]').count()) > 0;
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
}

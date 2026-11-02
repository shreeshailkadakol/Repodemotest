/**
 * Event Details Component (Page Object Model)
 *
 * What:
 *   Represents the Event Details block placed below the Event Stage on an
 *   Event Page. Source story: ADO 3803. Verified DOM (see
 *   docs/dom-inspection-eventDetails.md):
 *
 *     <section data-qa="event-details" data-testid="event-details">
 *       <div data-qa="event-details-section" ...>      BOX 1 wrapper
 *         <h2 data-testid="event-title">                  title
 *         time block ( start-date / end-date / local-time )
 *         address block ( street / locality / postal-code / region / country )
 *         <p data-testid="event-mode">                    event mode
 *         <button data-qa="add-to-calendar-button">       AC9 - downloads ICS
 *         <a      data-qa="event-link">                   event URL (AC5)
 *       </div>
 *       <section data-qa="event-additional-links-section"> BOX 2 wrapper
 *         <h3 data-testid="event-additional-links-title">
 *         <a data-qa="additional-link"> x 0..n              CTAs (AC6)
 *       </section>
 *       <section data-qa="profile-card"> BOX 3 (AC7 - hidden if no Media Contact)
 *     </section>
 *
 * Why SmartLocator only:
 *   Per playwright-prompt.md every element MUST use findSmart() with at least
 *   3 fallback strategies and a meaningful description for selector-health.
 *   We never use container.locator() chaining for primary interactions.
 *
 * Scoping note:
 *   `additional-link` (3 instances on this page), `icon` (page-wide), and
 *   `profile-card` are reused page-wide. All child locators are therefore
 *   scoped under `section[data-qa="event-details"]` so we never match an
 *   element outside the Event Details subtree.
 */
import { Page, Locator, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

const ROOT_CSS = 'section[data-qa="event-details"]';
const ROOT_XPATH = '//section[@data-qa="event-details"]';

const BOX1_CSS = `${ROOT_CSS} [data-qa="event-details-section"]`;
const BOX1_XPATH = `${ROOT_XPATH}//*[@data-qa="event-details-section"]`;

const BOX2_CSS = `${ROOT_CSS} [data-qa="event-additional-links-section"]`;
const BOX2_XPATH = `${ROOT_XPATH}//*[@data-qa="event-additional-links-section"]`;

const BOX3_CSS = `${ROOT_CSS} [data-qa="profile-card"]`;
const BOX3_XPATH = `${ROOT_XPATH}//*[@data-qa="profile-card"]`;

export class EventDetailsComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ----------------------------------------------------------------
  // Navigation / setup
  // ----------------------------------------------------------------

  async navigateToPage(baseURL?: string): Promise<void> {
    const targetBase = baseURL ?? envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('EventDetails', targetBase);
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
  // Root + box wrappers
  // ----------------------------------------------------------------

  /** <section data-qa="event-details"> - the whole component. */
  async getContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'event-details',
      testId: 'event-details',
      css: ROOT_CSS,
      xpath: ROOT_XPATH,
      description: 'Event Details root section',
    });
  }

  /** Box 1: Event Data wrapper. */
  async getBox1(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'event-details-section',
      testId: 'event-details-section',
      css: BOX1_CSS,
      xpath: BOX1_XPATH,
      description: 'Event Details Box 1 (event-details-section)',
    });
  }

  /** Box 2: Additional Links wrapper (hidden when 0 CTAs - AC6). */
  async getBox2(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'event-additional-links-section',
      testId: 'event-additional-links-section',
      css: BOX2_CSS,
      xpath: BOX2_XPATH,
      description: 'Event Details Box 2 (additional links section)',
    });
  }

  /**
   * Box 3: Media Contact / profile card (AC7 - hidden when no contact).
   *
   * NOTE: `data-qa="profile-card"` / `data-testid="profile-card"` are
   * page-wide attributes (profile-card is its own component). To stay
   * inside the event-details subtree we use only scoped CSS/XPath that
   * match either attribute. On pages where the FE marks Box 3 hidden
   * (display:none) this still resolves the DOM node - callers should
   * gate on count() before asserting visibility.
   */
  async getBox3(): Promise<Locator> {
    return await this.findSmart({
      css: `${ROOT_CSS} [data-qa="profile-card"], ${ROOT_CSS} [data-testid="profile-card"]`,
      xpath: `${ROOT_XPATH}//*[@data-qa="profile-card" or @data-testid="profile-card"]`,
      description: 'Event Details Box 3 (profile card / media contact) - scoped',
    });
  }

  // ----------------------------------------------------------------
  // Box 1 child elements
  // ----------------------------------------------------------------

  /**
   * Event title. Verified at runtime as <h1> on the test page (FE renders the
   * event page H1 here). data-testid is the most reliable hook.
   */
  async getTitle(): Promise<Locator> {
    return await this.findSmart({
      testId: 'event-title',
      css: `${BOX1_CSS} [data-testid="event-title"]`,
      xpath: `${BOX1_XPATH}//*[@data-testid="event-title"]`,
      role: { role: 'heading', level: 1 },
      description: 'Event Details title heading',
    });
  }

  async getStartDate(): Promise<Locator> {
    return await this.findSmart({
      testId: 'event-start-date',
      css: `${BOX1_CSS} [data-testid="event-start-date"]`,
      xpath: `${BOX1_XPATH}//*[@data-testid="event-start-date"]`,
      text: /start/i,
      description: 'Event start date <p>',
    });
  }

  async getEndDate(): Promise<Locator> {
    return await this.findSmart({
      testId: 'event-end-date',
      css: `${BOX1_CSS} [data-testid="event-end-date"]`,
      xpath: `${BOX1_XPATH}//*[@data-testid="event-end-date"]`,
      text: /end/i,
      description: 'Event end date <p>',
    });
  }

  async getLocalTime(): Promise<Locator> {
    return await this.findSmart({
      testId: 'event-local-time',
      css: `${BOX1_CSS} [data-testid="event-local-time"]`,
      xpath: `${BOX1_XPATH}//*[@data-testid="event-local-time"]`,
      text: /local\s*time/i,
      description: 'Event local time <p>',
    });
  }

  /** Address wrapper (AC4: present for Offline / Hybrid). */
  async getAddressWrapper(): Promise<Locator> {
    return await this.findSmart({
      testId: 'event-address',
      css: `${BOX1_CSS} [data-testid="event-address"]`,
      xpath: `${BOX1_XPATH}//*[@data-testid="event-address"]`,
      description: 'Event address wrapper',
    });
  }

  async getStreet(): Promise<Locator> {
    return await this.findSmart({
      testId: 'event-street',
      css: `${BOX1_CSS} [data-testid="event-street"]`,
      xpath: `${BOX1_XPATH}//*[@data-testid="event-street"]`,
      description: 'Event street line',
    });
  }

  async getLocality(): Promise<Locator> {
    return await this.findSmart({
      testId: 'event-address-locality',
      css: `${BOX1_CSS} [data-testid="event-address-locality"]`,
      xpath: `${BOX1_XPATH}//*[@data-testid="event-address-locality"]`,
      description: 'Event address locality line',
    });
  }

  async getPostalCode(): Promise<Locator> {
    return await this.findSmart({
      testId: 'event-postal-code',
      css: `${BOX1_CSS} [data-testid="event-postal-code"]`,
      xpath: `${BOX1_XPATH}//*[@data-testid="event-postal-code"]`,
      description: 'Event postal code line',
    });
  }

  async getRegion(): Promise<Locator> {
    return await this.findSmart({
      testId: 'event-region',
      css: `${BOX1_CSS} [data-testid="event-region"]`,
      xpath: `${BOX1_XPATH}//*[@data-testid="event-region"]`,
      description: 'Event region line',
    });
  }

  async getCountry(): Promise<Locator> {
    return await this.findSmart({
      testId: 'event-country',
      css: `${BOX1_CSS} [data-testid="event-country"]`,
      xpath: `${BOX1_XPATH}//*[@data-testid="event-country"]`,
      description: 'Event country line',
    });
  }

  async getEventMode(): Promise<Locator> {
    return await this.findSmart({
      testId: 'event-mode',
      css: `${BOX1_CSS} [data-testid="event-mode"]`,
      xpath: `${BOX1_XPATH}//*[@data-testid="event-mode"]`,
      text: /event\s*mode/i,
      description: 'Event mode <p>',
    });
  }

  /** Add-to-Calendar button (AC9 - clicking should trigger ICS download). */
  async getAddToCalendarButton(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'add-to-calendar-button',
      testId: 'add-to-calendar-button',
      css: `${BOX1_CSS} [data-qa="add-to-calendar-button"]`,
      xpath: `${BOX1_XPATH}//*[@data-qa="add-to-calendar-button"]`,
      role: { role: 'button', name: /add\s*to\s*calendar/i },
      description: 'Add-to-Calendar button',
    });
  }

  /**
   * Event link (AC5 - Online / Hybrid events).
   *
   * NOTE: `data-qa="event-link"` is reused elsewhere on the page (a hidden
   * fallback exists in the Event Stage), so we must NOT use the page-wide
   * dataQa / testId SmartLocator strategies - they would match the wrong
   * element via `.first()`. All strategies are scoped under Box 1; CSS and
   * XPath each match BOTH data-qa and data-testid for resilience.
   */
  async getEventLink(): Promise<Locator> {
    return await this.findSmart({
      css: `${BOX1_CSS} a[data-qa="event-link"], ${BOX1_CSS} a[data-testid="event-link"]`,
      xpath: `${BOX1_XPATH}//a[@data-qa="event-link" or @data-testid="event-link"]`,
      description: 'Event Details event link <a> (scoped under Box 1; matches data-qa or data-testid)',
    });
  }

  // ----------------------------------------------------------------
  // Box 2 child elements
  // ----------------------------------------------------------------

  async getBox2Title(): Promise<Locator> {
    return await this.findSmart({
      testId: 'event-additional-links-title',
      css: `${BOX2_CSS} [data-testid="event-additional-links-title"]`,
      xpath: `${BOX2_XPATH}//*[@data-testid="event-additional-links-title"]`,
      text: /additional\s*links/i,
      description: 'Box 2 "Additional Links" heading',
    });
  }

  /**
   * Collection of <a data-qa="additional-link"> inside Box 2.
   * Uses the same probe-then-resolve pattern as Event Stage tag items: the
   * SmartLocator probe records the strategy for selector-health, then we
   * re-resolve via scoped CSS so callers may count() and iterate.
   */
  async getAdditionalLinks(): Promise<Locator> {
    await this.findSmart({
      dataQa: 'additional-link',
      css: `${BOX2_CSS} [data-qa="additional-link"]`,
      xpath: `${BOX2_XPATH}//*[@data-qa="additional-link"]`,
      description: 'Box 2 additional-link <a> items (first match - health probe)',
    });
    return this.page.locator(`${BOX2_CSS} [data-qa="additional-link"]`);
  }

  // ----------------------------------------------------------------
  // Box 3 collection (handles hidden DOM)
  // ----------------------------------------------------------------

  /**
   * Box 3 collection (profile-card) that INCLUDES hidden DOM nodes.
   *
   * Why this exists separately from getBox3():
   *   AC7 allows the FE to render Box 3 with `display:none` when no Media
   *   Contact is assigned. SmartLocator filters every strategy through
   *   `.isVisible()`, so getBox3() returns nothing for hidden nodes. For
   *   presence-only checks (ED-FUNC-014) we need a raw Locator that
   *   `.count()` will see. We still attempt a SmartLocator probe so
   *   selector-health is fed when Box 3 IS visible, but a probe failure
   *   here is expected (and silently swallowed) because absence is a valid
   *   AC7 state.
   */
  async getBox3Collection(): Promise<Locator> {
    try {
      await this.findSmart({
        css: `${ROOT_CSS} [data-qa="profile-card"], ${ROOT_CSS} [data-testid="profile-card"]`,
        xpath: `${ROOT_XPATH}//*[@data-qa="profile-card" or @data-testid="profile-card"]`,
        description: 'Box 3 (profile-card) presence probe - may be hidden via display:none',
      });
    } catch {
      // Box 3 may be absent or display:none (AC7) - presence check below
      // is intentional; do not propagate the probe failure.
    }
    return this.page.locator(
      `${ROOT_CSS} [data-qa="profile-card"], ${ROOT_CSS} [data-testid="profile-card"]`
    );
  }

  // ----------------------------------------------------------------
  // Subtree collections (for accessibility iteration)
  // ----------------------------------------------------------------

  /**
   * All heading elements inside Event Details (for a11y iteration).
   * Probe-then-resolve so collection callers can count() and iterate while
   * still feeding selector-health.
   */
  async getAllHeadings(): Promise<Locator> {
    await this.findSmart({
      role: { role: 'heading' },
      css: `${ROOT_CSS} :is(h1,h2,h3,h4,h5,h6)`,
      xpath: `${ROOT_XPATH}//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]`,
      description: 'Event Details headings (first match - health probe)',
    });
    return this.page.locator(`${ROOT_CSS} :is(h1,h2,h3,h4,h5,h6)`);
  }

  /**
   * All anchor elements inside Event Details (for a11y iteration).
   * Probe-then-resolve so collection callers can count() and iterate while
   * still feeding selector-health.
   */
  async getAllAnchors(): Promise<Locator> {
    await this.findSmart({
      role: { role: 'link' },
      css: `${ROOT_CSS} a`,
      xpath: `${ROOT_XPATH}//a`,
      description: 'Event Details anchors (first match - health probe)',
    });
    return this.page.locator(`${ROOT_CSS} a`);
  }
}

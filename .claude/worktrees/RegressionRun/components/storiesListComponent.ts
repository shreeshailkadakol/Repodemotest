import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator } from '@playwright/test';

/**
 * Stories List Component (US 3094)
 * Container: <div data-qa="stories-list" data-testid="stories-list" aria-label="Stories List">
 * All child element lookups go through findSmart() (no traditional locators).
 */
export class StoriesListComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ---------------------------------------------------------------------------
  // Component Container
  // ---------------------------------------------------------------------------
  async getComponentContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'stories-list',
      testId: 'stories-list',
      label: 'Stories List',
      css: '[data-qa="stories-list"]',
      xpath: '//div[@data-qa="stories-list"]',
      description: 'Stories List component container',
    });
  }

  async getFullWidthParent(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'fullwidth-column',
      testId: 'fullwidth-column',
      css: 'section[data-qa="fullwidth-column"]',
      xpath: '//section[@data-qa="fullwidth-column"]',
      description: 'Full width content divider parent of Stories List',
    });
  }

  // ---------------------------------------------------------------------------
  // Headline (with highlight)
  // ---------------------------------------------------------------------------
  async getHeadline(): Promise<Locator> {
    // NOTE: Do not use bare `dataQa: 'title-component'` here — the page-level H1
    // also uses data-qa="title-component", which would resolve incorrectly.
    return await this.findSmart({
      css: '[data-qa="stories-list"] h2[data-qa="title-component"]',
      xpath: '//div[@data-qa="stories-list"]//h2[@data-qa="title-component"]',
      description: 'Stories List headline (h2 inside stories-list)',
    });
  }

  async getHighlightSpan(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'stage-headline-text',
      css: '[data-qa="stories-list"] [data-qa="stage-headline-text"]',
      xpath: '//div[@data-qa="stories-list"]//*[@data-qa="stage-headline-text"]',
      description: 'Headline highlight span (gradient-styled)',
    });
  }

  // ---------------------------------------------------------------------------
  // Search input + button
  // ---------------------------------------------------------------------------
  async getSearchInput(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'stories-search-input',
      testId: 'stories-search-input',
      placeholder: /Search Stories/i,
      css: '[data-qa="stories-search-input"]',
      xpath: '//input[@data-qa="stories-search-input"]',
      description: 'Stories search input field',
    });
  }

  async getSearchButton(): Promise<Locator> {
    // Scoped to the stories-list ONLY. An unscoped role:{button, name:/Search/i} would match
    // the global header search button, which opens the site-search overlay instead of
    // submitting the stories-list search (root cause of TC-SL16/TC-SL17 failures).
    return await this.findSmart({
      css: '[data-qa="stories-list"] [data-testid="search-btn"], [data-qa="stories-list"] button[type="submit"]',
      xpath: '//div[@data-qa="stories-list"]//button[@data-testid="search-btn"]',
      description: 'Stories-list search submit button (scoped)',
    });
  }

  // ---------------------------------------------------------------------------
  // Topic filter dropdown
  // ---------------------------------------------------------------------------
  async getTopicFilterButton(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'stories-topic-filter',
      testId: 'stories-topic-filter',
      role: { role: 'button', name: /Select Topic/i },
      css: '[data-qa="stories-topic-filter"]',
      xpath: '//button[@data-qa="stories-topic-filter"]',
      description: 'Topic filter trigger button',
    });
  }

  async getTopicListbox(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'listbox' },
      css: '[role="listbox"]',
      xpath: '//*[@role="listbox"]',
      description: 'Topic filter open listbox',
    });
  }

  async getTopicOptions(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'option' },
      css: '[role="listbox"] [role="option"]',
      xpath: '//*[@role="listbox"]//*[@role="option"]',
      description: 'Topic filter listbox options',
    });
  }

  async openTopicFilter(): Promise<void> {
    const btn = await this.getTopicFilterButton();
    const expanded = await btn.getAttribute('aria-expanded');
    if (expanded !== 'true') {
      await btn.click();
      await this.page.waitForTimeout(400);
    }
  }

  async closeTopicFilter(): Promise<void> {
    const btn = await this.getTopicFilterButton();
    const expanded = await btn.getAttribute('aria-expanded');
    if (expanded === 'true') {
      await btn.click();
      await this.page.waitForTimeout(300);
    }
  }

  async selectTopicByIndex(index: number): Promise<string> {
    await this.openTopicFilter();
    const options = await this.getTopicOptions();
    const opt = options.nth(index);
    const label = (await opt.textContent())?.trim() ?? '';
    await opt.click();
    await this.page.waitForTimeout(500);
    return label;
  }

  // ---------------------------------------------------------------------------
  // Story items
  // ---------------------------------------------------------------------------
  async getStoryItems(): Promise<Locator> {
    // The story collection may legitimately be EMPTY (e.g. a no-match search shows a
    // "No Results Found" message with zero items). findSmart waits-for-presence and is
    // unsuitable for counting a possibly-empty set, so we run it only as a selector-health
    // probe (tolerating failure when there are no items) and resolve to a raw scoped
    // locator whose .count() reports 0 accurately.
    const css = '[data-qa="stories-list"] [data-qa="news-list-item"]';
    try {
      await this.findSmart({
        dataQa: 'news-list-item',
        label: 'News List Item',
        css,
        xpath: '//div[@data-qa="stories-list"]//*[@data-qa="news-list-item"]',
        description: 'Story list items (paginated)',
      });
    } catch {
      // Zero items is a valid state (no-match search) - fall through to the raw locator.
    }
    return this.page.locator(css);
  }

  async getStoryCount(): Promise<number> {
    const items = await this.getStoryItems();
    return await items.count();
  }

  async getStoryByIndex(index: number): Promise<Locator> {
    return await this.findSmart({
      css: `[data-qa="stories-list"] [data-qa="news-list-item"]:nth-of-type(${index + 1})`,
      xpath: `(//div[@data-qa="stories-list"]//*[@data-qa="news-list-item"])[${index + 1}]`,
      description: `Story item ${index + 1}`,
    });
  }

  async getStoryTitle(index: number): Promise<Locator> {
    return await this.findSmart({
      css: `[data-qa="stories-list"] [data-qa="news-list-item"]:nth-of-type(${index + 1}) h3[data-qa="title-component"]`,
      xpath: `(//div[@data-qa="stories-list"]//*[@data-qa="news-list-item"])[${index + 1}]//h3[@data-qa="title-component"]`,
      description: `Story ${index + 1} title (h3)`,
    });
  }

  async getStoryTags(index: number): Promise<Locator> {
    return await this.findSmart({
      css: `[data-qa="stories-list"] [data-qa="news-list-item"]:nth-of-type(${index + 1}) [data-qa="tag-chip"]`,
      xpath: `(//div[@data-qa="stories-list"]//*[@data-qa="news-list-item"])[${index + 1}]//*[@data-qa="tag-chip"]`,
      description: `Story ${index + 1} tag chips`,
    });
  }

  async getStoryImage(index: number): Promise<Locator> {
    return await this.findSmart({
      css: `[data-qa="stories-list"] [data-qa="news-list-item"]:nth-of-type(${index + 1}) img`,
      xpath: `(//div[@data-qa="stories-list"]//*[@data-qa="news-list-item"])[${index + 1}]//img`,
      description: `Story ${index + 1} image`,
    });
  }

  async getStoryPlaceholderImage(index: number): Promise<Locator> {
    return await this.findSmart({
      css: `[data-qa="stories-list"] [data-qa="news-list-item"]:nth-of-type(${index + 1}) [data-qa="placeholder-image"]`,
      xpath: `(//div[@data-qa="stories-list"]//*[@data-qa="news-list-item"])[${index + 1}]//*[@data-qa="placeholder-image"]`,
      description: `Story ${index + 1} placeholder image`,
    });
  }

  async getStoryLink(index: number): Promise<Locator> {
    return await this.findSmart({
      css: `[data-qa="stories-list"] [data-qa="news-list-item"]:nth-of-type(${index + 1}) a[href]`,
      xpath: `(//div[@data-qa="stories-list"]//*[@data-qa="news-list-item"])[${index + 1}]//a[@href]`,
      description: `Story ${index + 1} clickable link/anchor`,
    });
  }

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------
  async getPaginationNav(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'navigation', name: /Pagination/i },
      label: /Pagination/i,
      css: 'nav[aria-label="Pagination"]',
      xpath: '//nav[@aria-label="Pagination"]',
      description: 'Pagination navigation container',
    });
  }

  async getPaginationButtons(): Promise<Locator> {
    return await this.findSmart({
      css: 'nav[aria-label="Pagination"] button',
      xpath: '//nav[@aria-label="Pagination"]//button',
      description: 'All pagination buttons',
    });
  }

  async getPaginationPageButton(pageNum: number): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: new RegExp(`(Go to (first |last )?page,? page ${pageNum}|^${pageNum}$)`, 'i') },
      css: `nav[aria-label="Pagination"] button:has-text("${pageNum}")`,
      xpath: `//nav[@aria-label="Pagination"]//button[normalize-space(.)="${pageNum}"]`,
      description: `Pagination page ${pageNum} button`,
    });
  }

  async getPaginationPrev(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /Previous/i },
      css: 'nav[aria-label="Pagination"] button:has-text("Previous"), nav[aria-label="Pagination"] button[aria-label*="previous" i]',
      xpath: '//nav[@aria-label="Pagination"]//button[contains(., "Previous") or contains(translate(@aria-label, "PREVIOUS", "previous"), "previous")]',
      description: 'Pagination Previous button',
    });
  }

  async getPaginationNext(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /Next/i },
      css: 'nav[aria-label="Pagination"] button:has-text("Next"), nav[aria-label="Pagination"] button[aria-label*="next" i]',
      xpath: '//nav[@aria-label="Pagination"]//button[contains(., "Next") or contains(translate(@aria-label, "NEXT", "next"), "next")]',
      description: 'Pagination Next button',
    });
  }

  // ---------------------------------------------------------------------------
  // Search behaviour helpers
  // ---------------------------------------------------------------------------
  async searchAndSubmit(text: string): Promise<void> {
    const input = await this.getSearchInput();
    await input.click();
    await input.fill(text);
    // Submit via Enter. Do NOT click a "Search" button by role: the only /Search/i button on
    // this page is the global header search, which opens the site-search overlay instead of
    // filtering the stories list. The input's Enter key submits the stories search reliably.
    await input.press('Enter');
    await this.waitForResultsToSettle();
  }

  /**
   * Wait for the search/filter results to actually update before counting. A fixed 1500ms
   * was flaky (TC-SL16: a no-match search had not finished clearing the list when the count
   * was read). Strategy: DELAY-then-READ and require the item count to hold steady for two
   * further reads. Reading only after a delay avoids mistaking the not-yet-updated (stale)
   * list for a settled one.
   */
  private async waitForResultsToSettle(): Promise<void> {
    const css = '[data-qa="stories-list"] [data-qa="news-list-item"]';
    let previous = -1;
    let stableReads = 0;
    for (let i = 0; i < 14; i++) {
      await this.page.waitForTimeout(500); // let the async update run before reading
      const current = await this.page.locator(css).count();
      if (current === previous) {
        if (++stableReads >= 2) break; // three equal reads in a row => settled
      } else {
        stableReads = 0;
        previous = current;
      }
    }
  }

  async clearSearch(): Promise<void> {
    const input = await this.getSearchInput();
    await input.click();
    await input.fill('');
    await input.press('Enter');
    await this.waitForResultsToSettle();
  }

  // ---------------------------------------------------------------------------
  // No-result message (best-effort tolerant locator)
  // ---------------------------------------------------------------------------
  async getNoResultMessage(): Promise<Locator> {
    return await this.findSmart({
      text: /no result|no matches|no stories|nothing found/i,
      css: '[data-qa="stories-list"] [data-qa*="no-result" i], [data-qa="stories-list"] [class*="no-result" i]',
      xpath: '//div[@data-qa="stories-list"]//*[contains(translate(., "NORESULT", "noresult"), "no result")]',
      description: 'No results message (when search yields zero)',
    });
  }

  // ---------------------------------------------------------------------------
  // Typography helper
  // ---------------------------------------------------------------------------
  async getTypographyStyles(element: Locator): Promise<{
    fontSize: string;
    fontFamily: string;
    lineHeight: string;
    color: string;
    fontWeight: string;
  }> {
    return await element.evaluate((el) => {
      const s = globalThis.getComputedStyle(el);
      return {
        fontSize: s.fontSize,
        fontFamily: s.fontFamily,
        lineHeight: s.lineHeight,
        color: s.color,
        fontWeight: s.fontWeight,
      };
    });
  }

  // ---------------------------------------------------------------------------
  // JSON-LD / Schema.org collection (AC18)
  // ---------------------------------------------------------------------------
  async getJsonLdEntries(): Promise<unknown[]> {
    return await this.page.evaluate(() => {
      const out: unknown[] = [];
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach((s) => {
        try {
          out.push(JSON.parse(s.textContent || '{}'));
        } catch {
          /* ignore malformed */
        }
      });
      return out;
    });
  }
}

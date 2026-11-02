import { Page, Locator, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';

/**
 * Development Pipeline Component Page Object
 * User Story: 2600 - Development Pipeline component (DevelopmentPipeline + DevelopmentPipelineBanner)
 *
 * All element interactions use SmartLocator methods (findSmart/clickSmart/fillSmart/getTextSmart/isVisibleSmart)
 * with multiple fallback strategies and meaningful descriptions for selector health monitoring.
 *
 * DOM anchors (from live inspection):
 *  - [data-qa="title-component"]                          Title heading
 *  - [data-qa="development-pipeline-banner"]              Counter banner
 *  - [data-qa="pipeline-search-input"]                    Search wrapper (input child: aria-label "Search the Pipeline")
 *  - [data-qa="pipeline-sidebar-filters"]                 Filter sidebar (rendered desktop + mobile)
 *  - [data-qa="pipeline-filter-accordion-toggle"]         Filter toggle
 *  - [data-qa="pipeline-filter-group-{therapeutic_area|phase|modality|program_type}"]
 *  - [data-qa^="pipeline-chip-{category}-"]               Filter chips (GUID suffix; match by text)
 *  - [data-qa="pipeline-product-card"]                    Product cards (inner fields have no data-qa)
 *  - Pagination / page-size: semantic only (aria-label / text)
 */
export class DevelopmentPipelineComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ================================
  // Navigation and Setup
  // ================================

  /**
   * Navigate to the Development Pipeline test page, authenticate, accept cookies, wait for listing.
   * @param baseURL - Base URL of the application
   */
  async navigateAndSetup(baseURL: string): Promise<void> {
    const url = await this.getComponentUrl('DevelopmentPipeline', baseURL);
    console.log(`Navigating to Development Pipeline page: ${url}`);

    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForNetworkIdle();
    await this.waitForListingToLoad();
  }

  /**
   * Wait for the product listing to render (Sitecore Search powered, ~1s).
   */
  async waitForListingToLoad(): Promise<void> {
    try {
      await this.page.waitForSelector('[data-qa="pipeline-product-card"]', {
        state: 'visible',
        timeout: 20000,
      });
      // Allow banner counters to calculate from listing data (briefly shows 0).
      await this.page.waitForTimeout(1500);
    } catch {
      console.log('Product cards not visible within timeout (data may be empty or indexing delayed).');
    }
  }

  // ================================
  // Banner / Header Locators
  // ================================

  async getTitle(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'title-component',
      role: { role: 'heading' },
      css: '[data-qa="title-component"]',
      xpath: '//*[@data-qa="title-component"]',
      description: 'Development Pipeline title heading',
    });
  }

  async getBanner(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'development-pipeline-banner',
      testId: 'development-pipeline-banner',
      css: '[data-qa="development-pipeline-banner"]',
      xpath: '//*[@data-qa="development-pipeline-banner"]',
      description: 'Development Pipeline counter banner',
    });
  }

  /**
   * Get the "as of [date]" timestamp element (scoped to banner/header region).
   */
  async getAsOfDate(): Promise<Locator> {
    return await this.findSmart({
      text: /as of/i,
      css: '[data-qa="development-pipeline-banner"] ~ * :text("as of"), :text("as of")',
      xpath: '//*[contains(translate(text(), "ASOF", "asof"), "as of")]',
      description: 'As of [date] timestamp',
    });
  }

  /**
   * Get the component's design title ("Pipeline overview") rendered inside the listing.
   * This differs from getTitle() which returns the CMS page H1 (data-qa="title-component").
   * The design title is the element matched by the Figma "title" typography token.
   */
  async getComponentTitle(): Promise<Locator> {
    return await this.findSmart({
      text: /pipeline overview/i,
      css: '[data-qa="development-pipeline-banner"] ~ * p, p',
      xpath: '//p[contains(translate(text(), "PIPELINEOVERVW", "pipelineovervw"), "pipeline overview")]',
      description: 'Component design title (Pipeline overview)',
    });
  }

  /**
   * Get the intro description paragraph ("The following table lists ...").
   * Matched by the Figma "description" typography token.
   */
  async getDescription(): Promise<Locator> {
    return await this.findSmart({
      text: /following table lists|advancing through different stages/i,
      css: '[data-qa="development-pipeline-banner"] ~ * p',
      xpath: '//p[contains(translate(text(), "FOLLWNGTABLEIS", "follwngtableis"), "following table lists")]',
      description: 'Intro description paragraph',
    });
  }

  // ================================
  // Search Locators
  // ================================

  async getSearchWrapper(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'pipeline-search-input',
      testId: 'pipeline-search-input',
      css: '[data-qa="pipeline-search-input"]',
      xpath: '//*[@data-qa="pipeline-search-input"]',
      description: 'Pipeline search input wrapper',
    });
  }

  /**
   * Get the actual search <input> (no data-qa; uses aria-label/placeholder, scoped to wrapper).
   */
  async getSearchInput(): Promise<Locator> {
    return await this.findSmart({
      label: /search the pipeline/i,
      placeholder: /search the pipeline/i,
      role: { role: 'textbox', name: /search the pipeline/i },
      css: '[data-qa="pipeline-search-input"] input[type="text"]',
      xpath: '//*[@data-qa="pipeline-search-input"]//input[@type="text"]',
      description: 'Pipeline search text input',
    });
  }

  /**
   * Enter a search term and wait for the listing to update.
   */
  async search(term: string): Promise<void> {
    const input = await this.getSearchInput();
    await input.fill(term);
    await input.press('Enter');
    await this.page.waitForTimeout(1500);
    await this.waitForNetworkIdle();
  }

  // ================================
  // Filter Locators
  // ================================

  async getSidebarFilters(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'pipeline-sidebar-filters',
      testId: 'pipeline-sidebar-filters',
      css: '[data-qa="pipeline-sidebar-filters"]',
      xpath: '//*[@data-qa="pipeline-sidebar-filters"]',
      description: 'Pipeline filter sidebar',
    });
  }

  async getFilterToggle(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'pipeline-filter-accordion-toggle',
      testId: 'pipeline-filter-accordion-toggle',
      role: { role: 'button', name: /filter/i },
      css: '[data-qa="pipeline-filter-accordion-toggle"]',
      xpath: '//*[@data-qa="pipeline-filter-accordion-toggle"]',
      description: 'Filter accordion toggle button',
    });
  }

  /**
   * Get a filter group section by category.
   * @param category therapeutic_area | phase | modality | program_type
   */
  async getFilterGroup(category: string): Promise<Locator> {
    return await this.findSmart({
      dataQa: `pipeline-filter-group-${category}`,
      css: `[data-qa="pipeline-filter-group-${category}"]`,
      xpath: `//*[@data-qa="pipeline-filter-group-${category}"]`,
      description: `Filter group: ${category}`,
    });
  }

  /**
   * Get a filter chip button by category and visible label text (scoped to first/desktop instance).
   * Chips have GUID suffixes on data-qa, so match by category prefix + text.
   * @param category therapeutic_area | phase | modality
   * @param label visible chip text (e.g. "Oncology", "PHASE I", "Small Molecule")
   */
  async getFilterChip(category: string, label: string | RegExp): Promise<Locator> {
    const labelRegex = typeof label === 'string' ? new RegExp(label, 'i') : label;
    return await this.findSmart({
      role: { role: 'button', name: labelRegex },
      text: labelRegex,
      css: `[data-qa="pipeline-filter-group-${category}"] [data-qa^="pipeline-chip-${category}-"]`,
      xpath: `(//*[@data-qa="pipeline-filter-group-${category}"]//*[starts-with(@data-qa, "pipeline-chip-${category}-")])[1]`,
      description: `Filter chip ${category}: ${label}`,
    });
  }

  /**
   * Click a filter chip by category and label, then wait for the list to update.
   */
  async applyFilterChip(category: string, label: string | RegExp): Promise<void> {
    const chip = await this.getFilterChip(category, label);
    await chip.click();
    await this.page.waitForTimeout(1500);
    await this.waitForNetworkIdle();
  }

  /**
   * Get a Type (program_type) radio option by label.
   */
  async getTypeOption(label: string | RegExp): Promise<Locator> {
    const labelRegex = typeof label === 'string' ? new RegExp(label, 'i') : label;
    return await this.findSmart({
      role: { role: 'radio', name: labelRegex },
      text: labelRegex,
      css: '[data-qa="pipeline-filter-group-program_type"] input[type="radio"]',
      xpath: '(//*[@data-qa="pipeline-filter-group-program_type"]//input[@type="radio"])[1]',
      description: `Type option: ${label}`,
    });
  }

  /**
   * Get a filter group information/tooltip trigger by group name.
   */
  async getFilterTooltipTrigger(groupName: string | RegExp): Promise<Locator> {
    const nameRegex = typeof groupName === 'string' ? new RegExp(`${groupName} information`, 'i') : groupName;
    return await this.findSmart({
      role: { role: 'button', name: nameRegex },
      label: nameRegex,
      css: `[aria-label*="information" i]`,
      xpath: `//button[contains(translate(@aria-label, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "information")]`,
      description: `Filter tooltip trigger: ${groupName}`,
    });
  }

  async getResetAll(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /reset all/i },
      text: /reset all/i,
      css: '[data-qa="pipeline-sidebar-filters"] button',
      xpath: '//*[contains(translate(text(), "RESET ALL", "reset all"), "reset all")]',
      description: 'Reset all button',
    });
  }

  /**
   * Reset all search and filters, wait for the list to update.
   */
  async resetAll(): Promise<void> {
    const reset = await this.getResetAll();
    await reset.click();
    await this.page.waitForTimeout(1500);
    await this.waitForNetworkIdle();
  }

  // ================================
  // Product Card Locators
  // ================================

  async getProductCards(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'pipeline-product-card',
      testId: 'pipeline-product-card',
      css: '[data-qa="pipeline-product-card"]',
      xpath: '//*[@data-qa="pipeline-product-card"]',
      description: 'Pipeline product cards',
    });
  }

  async getProductCard(index: number): Promise<Locator> {
    const cards = await this.getProductCards();
    return cards.nth(index);
  }

  /**
   * Count the visible product cards. Returns 0 (without throwing) when the listing
   * is empty, since an empty result set is a valid state (e.g. after a no-match search).
   */
  async getProductCardsCount(): Promise<number> {
    try {
      const cards = await this.findSmart({
        dataQa: 'pipeline-product-card',
        testId: 'pipeline-product-card',
        css: '[data-qa="pipeline-product-card"]',
        xpath: '//*[@data-qa="pipeline-product-card"]',
        timeout: 3000,
        description: 'Pipeline product cards (count)',
      });
      return await cards.count();
    } catch {
      return 0;
    }
  }

  /**
   * Get the visible titles of all product cards on the current page.
   */
  async getProductCardTitles(): Promise<string[]> {
    const cards = await this.getProductCards();
    const count = await cards.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await cards.nth(i).textContent()) ?? '';
      titles.push(text.trim());
    }
    return titles;
  }

  /**
   * Expand a product card by index and wait for details to render.
   */
  async expandProductCard(index: number): Promise<void> {
    const card = await this.getProductCard(index);
    await card.click();
    await this.page.waitForTimeout(800);
  }

  /**
   * Get the first link inside an expanded product card (scoped via SmartLocator).
   * Cards lack per-card data-qa, so links are scoped to the product-card container.
   */
  async getExpandedProductLink(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'link' },
      css: '[data-qa="pipeline-product-card"] a[href]',
      xpath: '(//*[@data-qa="pipeline-product-card"]//a[@href])[1]',
      description: 'Link inside expanded product card',
    });
  }

  /**
   * Count links inside a given product card (by index), scoped to that card.
   */
  async getProductCardLinkCount(index: number): Promise<number> {
    const card = await this.getProductCard(index);
    return await card.getByRole('link').count();
  }

  // ================================
  // Pagination / Page Size Locators
  // ================================

  async getPagination(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'navigation', name: /pagination/i },
      css: 'nav[aria-label*="pagination" i], [data-qa*="pagination" i]',
      xpath: '//nav[contains(translate(@aria-label, "PAGINATION", "pagination"), "pagination")]',
      description: 'Pagination navigation',
    });
  }

  async getPaginationFirstPage(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /go to first page|page 1/i },
      label: /go to first page/i,
      text: /^1$/,
      css: 'button[aria-label*="first page" i]',
      xpath: '//button[contains(translate(@aria-label, "FIRST PAGE", "first page"), "first page")]',
      description: 'Pagination: first page',
    });
  }

  async getPaginationNext(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /next/i },
      text: /^next$/i,
      label: /next/i,
      css: 'button[aria-label*="next" i]',
      xpath: '//button[contains(translate(., "NEXT", "next"), "next")]',
      description: 'Pagination: next page',
    });
  }

  async getPaginationPrevious(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /previous/i },
      text: /^previous$/i,
      label: /previous/i,
      css: 'button[aria-label*="previous" i]',
      xpath: '//button[contains(translate(., "PREVIOUS", "previous"), "previous")]',
      description: 'Pagination: previous page',
    });
  }

  /**
   * Get a pagination page button by page number.
   */
  async getPaginationPage(pageNumber: number): Promise<Locator> {
    const pageRegex = new RegExp(`^${pageNumber}$`);
    return await this.findSmart({
      role: { role: 'button', name: pageRegex },
      text: pageRegex,
      css: `button`,
      xpath: `//button[normalize-space(text())="${pageNumber}"]`,
      description: `Pagination: page ${pageNumber}`,
    });
  }

  /**
   * Navigate to a specific page number and wait for the list to update.
   */
  async goToPage(pageNumber: number): Promise<void> {
    const pageButton = await this.getPaginationPage(pageNumber);
    await pageButton.click();
    await this.page.waitForTimeout(1500);
    await this.waitForNetworkIdle();
  }

  /**
   * Get the page-size selector control ("Projects per page" value button, default 15).
   */
  async getPageSizeControl(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /^15$|projects per page/i },
      text: /^15$/,
      css: '[data-qa="pipeline-search-input"] ~ * button, button',
      xpath: '(//button[normalize-space(text())="15"])[1]',
      description: 'Projects per page selector',
    });
  }

  /**
   * Get the "No Results Found" empty-state message.
   */
  async getNoResultsMessage(): Promise<Locator> {
    return await this.findSmart({
      text: /no results found/i,
      role: { role: 'status' },
      css: '[data-qa*="no-results" i], [role="status"]',
      xpath: '//*[contains(translate(text(), "NO RESULTS FOUND", "no results found"), "no results found")]',
      description: 'No Results Found message',
    });
  }

  /**
   * Convenience: returns true if any product card is visible.
   */
  async hasProducts(): Promise<boolean> {
    const count = await this.getProductCardsCount();
    return count > 0;
  }

  /**
   * Get the "Projects per page" label element.
   */
  async getPageSizeLabel(): Promise<Locator> {
    return await this.findSmart({
      text: /projects per page/i,
      css: 'label, span, p',
      xpath: '//*[contains(translate(text(), "PROJECTS PER PAGE", "projects per page"), "projects per page")]',
      description: 'Projects per page label',
    });
  }

  /**
   * Collect the computed typography of every VISIBLE leaf text node within a container.
   * A leaf text node is an element that renders non-empty text and has no element children
   * that themselves carry text (so we read the node that actually styles the glyphs).
   *
   * This avoids brittle per-element selectors for inner nodes that lack data-qa, and it
   * naturally skips the hidden mobile-duplicate sidebar (filtered by visibility).
   */
  async collectVisibleTextStyles(
    container: Locator
  ): Promise<Array<{ text: string; fontFamily: string; fontSize: string; fontWeight: string; lineHeight: string; color: string; letterSpacing: string }>> {
    return await container.evaluate((root) => {
      const isVisible = (el: Element): boolean => {
        const he = el as HTMLElement;
        const rects = he.getClientRects();
        if (rects.length === 0) return false;
        const s = globalThis.getComputedStyle(he);
        return s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) !== 0;
      };
      const hasDirectText = (el: Element): boolean =>
        Array.from(el.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim().length > 0
        );
      const results: Array<{ text: string; fontFamily: string; fontSize: string; fontWeight: string; lineHeight: string; color: string; letterSpacing: string }> = [];
      const walk = (el: Element) => {
        if (!isVisible(el)) return;
        if (hasDirectText(el)) {
          const s = globalThis.getComputedStyle(el);
          results.push({
            text: (el.textContent ?? '').trim().slice(0, 80),
            fontFamily: s.fontFamily,
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            lineHeight: s.lineHeight,
            color: s.color,
            letterSpacing: s.letterSpacing,
          });
        }
        Array.from(el.children).forEach(walk);
      };
      walk(root as Element);
      return results;
    });
  }

  /**
   * Get the component root element (body) using SmartLocator pattern.
   * Used by visual tests that need to collect styles across the entire component scope.
   */
  async getComponentRoot(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'document' },
      css: 'body',
      xpath: '//body',
      description: 'Component root container (body)',
    });
  }

  /**
   * Get the search wrapper's parent container using SmartLocator pattern.
   * Used by visual tests to collect typography from the search container's parent scope.
   */
  async getSearchWrapperParent(): Promise<Locator> {
    // Return the direct parent of the search input using SmartLocator fallbacks.
    return await this.findSmart({
      xpath: '//*[@data-qa="pipeline-search-input"]/..',
      css: ':has(> [data-qa="pipeline-search-input"])',
      description: 'Search input wrapper parent container',
    });
  }

  /**
   * Log the current component state for debugging.
   */
  async logComponentState(): Promise<void> {
    const count = await this.getProductCardsCount();
    console.log(`Development Pipeline state: ${count} product cards visible`);
  }
}

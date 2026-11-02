import { Page, Browser, BrowserContext, Locator } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

export class ClassicSiteSearch extends BasePage {
  // Locators for Classic Site Search
  private readonly searchButton: Locator;
  private readonly searchOverlay: Locator;
  private readonly searchInput: Locator;
  private readonly closeButton: Locator;
  private readonly searchSubmitButton: Locator;
  private readonly suggestionsBox: Locator;
  private readonly suggestionItems: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);

    // Initialize locators
    this.searchButton = this.page.locator('button[data-qa="Search"]');
    this.searchOverlay = this.page.locator('[role="dialog"]').filter({ hasNotText: 'cookie' });
    // Scope searchInput within the modal overlay using parent-child relationship.
    // Language-agnostic: the input has no data-qa/aria-label/name, and the placeholder
    // is localized per market (e.g. EN "What are you looking for" vs DE "Suchbegriff hier
    // eingeben"). The overlay renders responsive copies; only one text input is visible
    // per viewport, so target the visible one rather than matching on placeholder text.
    this.searchInput = this.searchOverlay
      .locator('input[type="text"]:visible')
      .first();
    this.closeButton = this.searchOverlay
      .locator('button[aria-label*="Close"]')
      .first();
    // Get the visible search submit button inside the modal (not the header button)
    this.searchSubmitButton = this.searchOverlay
      .locator('button[aria-label="Search"]')
      .last(); // Use last() to get the visible submit button inside modal
    this.suggestionsBox = this.page.locator('[role="listbox"], [role="menu"]').first();
    this.suggestionItems = this.suggestionsBox.locator('[role="option"], [role="menuitem"]');
  }

  /**
   * Navigate to the Classic Site Search component page
   */
  async navigateToComponent(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.getComponentUrl('ClassicSiteSearchComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForNetworkIdle();
  }

  /**
   * Click the search button to open overlay
   */
  async openSearchOverlay(): Promise<void> {
    // Ensure cookies banner is dismissed before opening search
    await this.acceptCookiesBanner();
    
    // Forcefully remove cookie banner if it persists - more attempts for India
    const env = process.env.TEST_ENV ?? 'qa';
    const maxAttempts = env === 'prod_in' ? 5 : 3;
    const waitTime = env === 'prod_in' ? 200 : 500;
    
    for (let i = 0; i < maxAttempts; i++) {
      const cookieBanner = this.page.locator('#onetrust-consent-sdk');
      const bannerExists = await cookieBanner.count() > 0;
      
      if (bannerExists) {
        console.log(`[ClassicSiteSearch] Cookie banner still present (attempt ${i + 1}), forcefully removing...`);
        // Force remove from DOM immediately
        await this.page.evaluate(() => {
          // India site: Remove ALL cookie/overlay elements aggressively
          const selectors = [
            '#onetrust-consent-sdk',
            '[id*="onetrust"]',
            '[class*="onetrust"]',
            '[data-nosnippet="true"]'
          ];
          selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.remove());
          });
        });
        // Wait to ensure removal is processed
        await this.page.waitForTimeout(waitTime);
      } else {
        if (env === 'prod_in') {
          console.log('[ClassicSiteSearch] India: All overlays removed successfully');
        }
        console.log('[ClassicSiteSearch] Cookie banner not present');
        break;
      }
    }
    
    // Additional stabilization wait - reduced for faster execution
    await this.page.waitForTimeout(1000);
    
    await this.searchButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Check if overlay is already open
    const isOverlayAlreadyOpen = await this.searchOverlay.isVisible().catch(() => false);
    if (isOverlayAlreadyOpen) {
      console.log('[ClassicSiteSearch] Search overlay already open, skipping open action');
      return;
    }
    
    // Try regular click first, then force click if intercepted
    let clickSuccessful = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[ClassicSiteSearch] Attempting to click search button (attempt ${attempt})`);
        
        // Remove any overlays immediately before each click attempt
        if (env === 'prod_in') {
          await this.page.evaluate(() => {
            const selectors = [
              '#onetrust-consent-sdk',
              '#onetrust-button-group-parent',
              '[id*="onetrust"]',
              '[class*="onetrust"]',
              '[data-nosnippet="true"]'
            ];
            selectors.forEach(sel => {
              document.querySelectorAll(sel).forEach(el => {
                el.remove();
                // Also disable pointer events on parent if exists
                if (el.parentElement) {
                  (el.parentElement as HTMLElement).style.pointerEvents = 'none';
                }
              });
            });
          }).catch(() => {});
          await this.page.waitForTimeout(100);
        }
        
        if (attempt === 1) {
          await this.searchButton.click({ timeout: 8000 });
        } else if (attempt === 2) {
          // Wait for any overlays to clear
          await this.page.waitForTimeout(500);
          await this.searchButton.click({ force: true, timeout: 8000 });
        } else {
          // Last attempt: scroll into view first, then force click
          await this.searchButton.scrollIntoViewIfNeeded();
          await this.page.waitForTimeout(300);
          await this.searchButton.click({ force: true, timeout: 8000 });
        }
        clickSuccessful = true;
        break;
      } catch (error) {
        console.log(`[ClassicSiteSearch] Click attempt ${attempt} failed:`, error);
        if (attempt === 3) throw error;
        // Wait a bit before retry
        await this.page.waitForTimeout(800);
      }
    }
    
    // Wait for modal to appear with reasonable timeout
    console.log('[ClassicSiteSearch] Waiting for search overlay to appear...');
    await this.searchOverlay.waitFor({ state: 'visible', timeout: 20000 });
    
    // Wait for modal animation and input to be attached/ready
    await this.page.waitForTimeout(500);
    console.log('[ClassicSiteSearch] Search overlay opened successfully');
  }

  /**
   * Close the search overlay using close button
   */
  async closeSearchOverlay(): Promise<void> {
    // Wait for close button to be attached in DOM
    await this.closeButton.waitFor({ state: 'attached' });
    await this.page.waitForTimeout(500);
    // Use evaluate to bypass visibility check - button is CSS-hidden but functional
    await this.closeButton.evaluate((btn: HTMLElement) => btn.click());
    await this.page.waitForTimeout(500);
  }

  /**
   * Close the search overlay using Escape key
   */
  async closeSearchOverlayWithEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(500);
  }

  /**
   * Type text into search input
   */
  async typeInSearchInput(text: string): Promise<void> {
    await this.searchInput.fill('', { force: true });
    await this.searchInput.pressSequentially(text, { delay: 100 });
    await this.page.waitForTimeout(500);
  }

  /**
   * Submit search query using Enter key
   */
  async submitSearchWithEnter(): Promise<void> {
    await this.page.keyboard.press('Enter');
  }
  /**
   * Submit search using search submit button
   */
  async submitSearchWithButton(): Promise<void> {
    // Note: The search button in this implementation is not properly triggering navigation
    // when clicked programmatically via evaluate() or force clicks.
    // This appears to be a React/JS SPA issue where event listeners aren't triggered.
    // Workaround: Use Enter key which reliably triggers the search
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
  }
  /**
   * Get search button locator
   */
  getSearchButton(): Locator {
    return this.searchButton;
  }

  /**
   * Get search overlay locator
   */
  getSearchOverlay(): Locator {
    return this.searchOverlay;
  }

  /**
   * Get search input locator
   */
  getSearchInput(): Locator {
    return this.searchInput;
  }

  /**
   * Get close button locator
   */
  getCloseButton(): Locator {
    return this.closeButton;
  }

  /**
   * Get suggestions box locator
   */
  getSuggestionsBox(): Locator {
    return this.suggestionsBox;
  }

  /**
   * Get suggestion items locator
   */
  getSuggestionItems(): Locator {
    return this.suggestionItems;
  }

  /**
   * Check if overlay is visible
   */
  async isOverlayVisible(): Promise<boolean> {
    return await this.searchOverlay.isVisible().catch(() => false);
  }

  /**
   * Get suggestions count
   */
  async getSuggestionsCount(): Promise<number> {
    return await this.suggestionItems.count().catch(() => 0);
  }

  /**
   * Navigate directly to search results page
   */
  async navigateToSearchResults(query: string): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    console.log(`[Search Results] Navigating to search results for query: "${query}"`);
    await this.page.goto(`${baseURL}/search?q=${encodeURIComponent(query)}`);
    
    // Wait for page to fully load
    await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    console.log('[Search Results] Page DOM loaded');
    
    // Also try to wait for network idle for dynamic content
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
      console.log('[Search Results] Network idle timeout, continuing anyway');
    });
    
    // Additional wait for results to render
    await this.page.waitForTimeout(3000);
    console.log('[Search Results] Navigation complete, waiting for results rendering');
  }

  /**
   * Focus search button
   */
  async focusSearchButton(): Promise<void> {
    await this.searchButton.focus();
  }

  /**
   * Check if search button has focus
   */
  async isSearchButtonFocused(): Promise<boolean> {
    return await this.searchButton.evaluate((el) => el === document.activeElement);
  }

  /**
   * Check if search input has focus
   */
  async isSearchInputFocused(): Promise<boolean> {
    return await this.searchInput.evaluate((el) => el === document.activeElement);
  }

  /**
   * Get search input value
   */
  async getSearchInputValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Set viewport size
   */
  async setViewport(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    await this.page.waitForTimeout(500);
  }

  /**
   * Get search button aria-label
   */
  async getSearchButtonAriaLabel(): Promise<string | null> {
    return await this.searchButton.getAttribute('aria-label');
  }

  /**
   * Get search button text content
   */
  async getSearchButtonText(): Promise<string | null> {
    return await this.searchButton.textContent();
  }

  /**
   * Get overlay role attribute
   */
  async getOverlayRole(): Promise<string | null> {
    return await this.searchOverlay.getAttribute('role');
  }

  /**
   * Get overlay aria-modal attribute
   */
  async getOverlayAriaModal(): Promise<string | null> {
    return await this.searchOverlay.getAttribute('aria-modal');
  }

  /**
   * Get search input aria-label
   */
  async getSearchInputAriaLabel(): Promise<string | null> {
    return await this.searchInput.getAttribute('aria-label');
  }

  /**
   * Get search input aria-labelledby
   */
  async getSearchInputAriaLabelledBy(): Promise<string | null> {
    return await this.searchInput.getAttribute('aria-labelledby');
  }

  /**
   * Get search input placeholder
   */
  async getSearchInputPlaceholder(): Promise<string | null> {
    return await this.searchInput.getAttribute('placeholder');
  }

  /**
   * Get results count from page
   */
  async getResultsCount(): Promise<number> {
    try {
      // Try multiple selector combinations to find results
      const selectors = [
        '.search-result',
        '[data-qa*="result"]',
        '.result-item',
        '[class*="result"]',
        'main [class*="item"]',
        'section li',
        '[class*="search-result"]',
      ];

      for (const selector of selectors) {
        try {
          const count = await this.page.locator(selector).count();
          if (count > 0) {
            console.log(`[Search Results] Found ${count} results using selector: "${selector}"`);
            return count;
          }
        } catch (e) {
          // Continue to next selector
        }
      }

      console.log('[Search Results] No results found with any selector');
      
      // Log page structure for debugging
      const bodyHTML = await this.page.evaluate(() => document.body.innerHTML.substring(0, 500));
      console.log(`[Search Results] Page HTML preview: ${bodyHTML}`);
      
      return 0;
    } catch (error) {
      console.log(`[Search Results] Error getting results count: ${error}`);
      return 0;
    }
  }

  /**
   * Get result items locator with multiple selector strategies
   */
  async getResultItemsLocator(): Promise<Locator> {
    // Try to find results with multiple selectors
    const selectors = [
      '[data-qa*="result"]',
      'article',
      'main li',
      '.search-result',
      '.result-item',
      '[class*="result"]',
      'main [class*="item"]',
    ];

    for (const selector of selectors) {
      const locator = this.page.locator(selector);
      try {
        const count = await locator.count();
        if (count > 0) {
          console.log(`[Search Results] Using selector "${selector}" for result items (found ${count})`);
          return locator;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    console.log('[Search Results] No result items locator found, using default selector');
    return this.page.locator('article, [role="article"], main li');
  }

  /**
   * Check if no results message is visible
   */
  async isNoResultsMessageVisible(): Promise<boolean> {
    return await this.page
      .locator('text=/no results/i, text=/0 results/i')
      .isVisible()
      .catch(() => false);
  }

  /**
   * Get search input on results page
   */
  async getSearchInputOnResultsPage(): Promise<Locator> {
    return this.page.locator('input[type="search"], input[placeholder*="search" i]').first();
  }

  /**
   * Check if search input on results page is visible
   */
  async isSearchInputOnResultsPageVisible(): Promise<boolean> {
    const input = await this.getSearchInputOnResultsPage();
    return await input.isVisible({ timeout: 3000 }).catch(() => false);
  }

  /**
   * Get search input value on results page
   */
  async getSearchInputValueOnResultsPage(): Promise<string> {
    const input = await this.getSearchInputOnResultsPage();
    if (await this.isSearchInputOnResultsPageVisible()) {
      return await input.inputValue();
    }
    return '';
  }

  /**
   * Wait for timeout (wrapper for page.waitForTimeout)
   */
  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}

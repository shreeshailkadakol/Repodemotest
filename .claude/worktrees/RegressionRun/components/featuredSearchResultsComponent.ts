import { Page, Locator, Browser, BrowserContext, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';


export class FeaturedSearchResultsComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ================================
  // Navigation and Setup Methods
  // ================================

  /**
   * Navigate to search page and perform search to display Featured Results
   * @param baseURL - Base URL of the application
   * @param searchTerm - Search term that triggers Featured Results (default: "Bayer Beyond")
   */
  async navigateAndSearch(baseURL: string, searchTerm: string = 'Bayer Beyond'): Promise<void> {
    const url = await this.getComponentUrl('FeaturedSearchResultsComponent', baseURL);
    console.log(`Navigating to search page: ${url}`);

    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForNetworkIdle();

    // Perform search to trigger Featured Results
    await this.performSearch(searchTerm);
  }

  /**
   * Perform search using search input
   * @param searchTerm - Term to search for
   */
  async performSearch(searchTerm: string): Promise<void> {
    const searchInput = await this.findSmart({
      css: 'input[type="text"][placeholder*="looking for" i]',
      role: { role: 'textbox' },
      placeholder: /looking for/i,
      xpath: '//input[@type="text" and contains(@placeholder, "looking for")]',
      description: 'Search input field',
    });

    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.fill(searchTerm);
    await searchInput.press('Enter');

    // Wait for search to complete - look for results count text or Featured Results
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    
    // Wait for either results count or Featured Results to appear (indicates search completed)
    try {
      await this.page.waitForSelector('[data-qa="search-results"]', { state: 'visible', timeout: 15000 });
      await this.page.waitForTimeout(3000); // Additional wait for Featured Results to render
    } catch {
      console.log('Search results container not found immediately, waiting longer...');
      await this.page.waitForTimeout(5000);
    }
  }

  // ================================
  // Featured Results Section Locators (SmartLocator)
  // ================================

  /**
   * Get Featured Results section heading text
   */
  async getFeaturedResultsSection(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-qa="featured-search-results"] > div.text-xl.font-bold',
      text: /featured results/i,
      xpath: '//div[@data-qa="featured-search-results"]/div[contains(@class, "text-xl") and contains(@class, "font-bold")]',
      description: 'Featured Results section heading',
    });
  }

  /**
   * Get Featured Results container
   */
  async getFeaturedResultsContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'featured-search-results',
      css: 'div[data-qa="featured-search-results"]',
      xpath: '//div[@data-qa="featured-search-results"]',
      description: 'Featured Results container with elevated background',
    });
  }

  /**
   * Get all featured result cards
   * Uses news-list-item pattern which has data-qa attribute
   */
  async getFeaturedCards(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-qa="featured-search-results"] [data-qa="news-list-item"]',
      xpath: '//div[@data-qa="featured-search-results"]//section[@data-qa="news-list-item"]',
      role: { role: 'region', name: /news list item/i },
      description: 'Featured result cards (news-list-item within Featured Results container)',
    });
  }

  /**
   * Get specific featured card by index (0-based)
   */
  async getFeaturedCard(index: number): Promise<Locator> {
    const cards = await this.getFeaturedCards();
    return cards.nth(index);
  }

  /**
   * Get first featured card
   */
  async getFirstFeaturedCard(): Promise<Locator> {
    return await this.getFeaturedCard(0);
  }

  // ================================
  // Featured Card Child Element Locators (SmartLocator)
  // ================================

  /**
   * Get image element within a featured card
   * @param card - The card locator (from getFeaturedCard)
   */
  async getFeaturedCardImage(card: Locator): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'placeholder-image',
      css: '[data-qa="featured-search-results"] [data-qa="placeholder-image"] img, [data-qa="featured-search-results"] [data-qa="news-list-item"] img',
      role: { role: 'img' },
      xpath: '//div[@data-qa="featured-search-results"]//div[@data-qa="placeholder-image"]//img',
      description: 'Featured card image',
    });
  }

  /**
   * Get classification tags within a featured card
   * @param card - The card locator (from getFeaturedCard)
   */
  async getFeaturedCardTags(card: Locator): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'tag-chip',
      css: '[data-qa="featured-search-results"] [data-qa="tag-chip"]',
      xpath: '//div[@data-qa="featured-search-results"]//button[@data-qa="tag-chip"]',
      description: 'Featured card classification tags',
    });
  }

  /**
   * Get title/headline element within a featured card
   * @param card - The card locator (from getFeaturedCard)
   */
  async getFeaturedCardTitle(card: Locator): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'title-component',
      css: '[data-qa="featured-search-results"] [data-qa="title-component"]',
      role: { role: 'heading', name: /title-component/i },
      xpath: '//div[@data-qa="featured-search-results"]//h3[@data-qa="title-component"]',
      description: 'Featured card title',
    });
  }

  /**
   * Get description element within a featured card (if available)
   * @param card - The card locator (from getFeaturedCard)
   */
  async getFeaturedCardDescription(card: Locator): Promise<Locator> {
    return await this.findSmart({
      css: '[data-qa="featured-search-results"] [data-qa="news-list-item"] p.text-text-toned',
      xpath: '//div[@data-qa="featured-search-results"]//section[@data-qa="news-list-item"]//p[contains(@class, "text-text-toned")]',
      description: 'Featured card description',
    });
  }

  /**
   * Get clickable link from a featured card
   * @param card - The card locator (from getFeaturedCard)
   */
  async getFeaturedCardLink(card: Locator): Promise<Locator> {
    return await this.findSmart({
      css: '[data-qa="featured-search-results"] [data-qa="news-list-item"] a',
      role: { role: 'link' },
      xpath: '//div[@data-qa="featured-search-results"]//section[@data-qa="news-list-item"]//a',
      description: 'Featured card link',
    });
  }

  // ================================
  // Search Results Page Elements (SmartLocator)
  // ================================

  /**
   * Get search results container
   */
  async getSearchResultsContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'search-results',
      css: '[data-qa="search-results"]',
      xpath: '//*[@data-qa="search-results"]',
      description: 'Search results container',
    });
  }

  /**
   * Get results count text
   */
  async getResultsCountText(): Promise<string> {
    const resultsText = await this.findSmart({
      css: '[data-qa="search-results"] h2',
      role: { role: 'heading', name: /results found/i },
      xpath: '//div[@data-qa="search-results"]//h2',
      description: 'Search results count heading',
    });

    return await resultsText.textContent() || '';
  }

  /**
   * Get regular search result items (news-list-item below Featured Results)
   */
  async getRegularSearchResults(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-qa="search-results"] [data-qa="news-list-item"]:not([data-qa="featured-search-results"] [data-qa="news-list-item"])',
      xpath: '//div[@data-qa="search-results"]//section[@data-qa="news-list-item" and not(ancestor::div[@data-qa="featured-search-results"])]',
      description: 'Regular search result items (excluding featured)',
    });
  }

  // ================================
  // Validation Methods
  // ================================

  /**
   * Verify Featured Results section is visible
   */
  async verifyFeaturedResultsSectionVisible(): Promise<void> {
    const section = await this.getFeaturedResultsSection();
    await expect.soft(section).toBeVisible({ timeout: 10000 });
  }

  /**
   * Verify Featured Results section heading text
   */
  async verifyFeaturedResultsHeading(): Promise<void> {
    const heading = await this.getFeaturedResultsSection();
    const headingText = await heading.textContent();
    expect.soft(headingText?.toLowerCase()).toContain('featured results');
  }

  /**
   * Get count of featured cards displayed
   */
  async getFeaturedCardsCount(): Promise<number> {
    const cards = await this.getFeaturedCards();
    return await cards.count();
  }

  /**
   * Verify Featured Results card count is between 1-3
   */
  async verifyFeaturedCardCount(): Promise<void> {
    const count = await this.getFeaturedCardsCount();
    expect.soft(count).toBeGreaterThanOrEqual(1);
    expect.soft(count).toBeLessThanOrEqual(3);
    console.log(`Featured Results cards displayed: ${count}`);
  }

  /**
   * Verify Featured Results appears above regular search results
   */
  async verifyFeaturedResultsPositioning(): Promise<void> {
    const featuredContainer = await this.getFeaturedResultsContainer();
    const regularResults = await this.getRegularSearchResults();

    // Get bounding boxes
    const featuredBox = await featuredContainer.boundingBox();
    const regularBox = await regularResults.first().boundingBox();

    if (featuredBox && regularBox) {
      expect.soft(featuredBox.y).toBeLessThan(regularBox.y);
      console.log(`Featured Results Y: ${featuredBox.y}, Regular Results Y: ${regularBox.y}`);
    } else {
      throw new Error('Could not get bounding boxes for positioning verification');
    }
  }

  /**
   * Verify featured card structure (has image, tags, title)
   */
  async verifyCardStructure(cardIndex: number = 0): Promise<void> {
    const card = await this.getFeaturedCard(cardIndex);
    await expect.soft(card).toBeVisible();

    // Check for image using SmartLocator
    const image = await this.findSmart({
      dataQa: 'placeholder-image',
      css: '[data-qa="featured-search-results"] [data-qa="news-list-item"] img',
      role: { role: 'img' },
      xpath: '//div[@data-qa="featured-search-results"]//section[@data-qa="news-list-item"]//img',
      description: 'Featured card image',
    });
    await expect.soft(image).toBeVisible();

    // Check for title using SmartLocator
    const title = await this.findSmart({
      dataQa: 'title-component',
      css: '[data-qa="featured-search-results"] [data-qa="title-component"]',
      role: { role: 'heading' },
      xpath: '//div[@data-qa="featured-search-results"]//h3[@data-qa="title-component"]',
      description: 'Featured card title',
    });
    await expect.soft(title).toBeVisible();
    const titleText = await title.textContent();
    expect.soft(titleText).toBeTruthy();
    if (titleText) {
      expect.soft(titleText.trim().length).toBeGreaterThan(0);
    }

    // Check for tags using SmartLocator (may or may not be present)
    const tags = await this.findSmart({
      dataQa: 'tag-chip',
      css: '[data-qa="featured-search-results"] [data-qa="tag-chip"]',
      xpath: '//div[@data-qa="featured-search-results"]//button[@data-qa="tag-chip"]',
      description: 'Featured card tags',
    });
    const tagsCount = await tags.count();
    console.log(`Featured card ${cardIndex} has ${tagsCount} tags`);
  }

  /**
   * Click on a featured card and verify navigation
   */
  async clickFeaturedCard(cardIndex: number = 0): Promise<string> {
    const card = await this.getFeaturedCard(cardIndex);
    const link = await this.getFeaturedCardLink(card);

    // Get href before clicking
    const href = await link.getAttribute('href');
    console.log(`Clicking featured card ${cardIndex}, href: ${href}`);

    await link.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });

    return href || '';
  }

  /**
   * Verify Featured Results persist after pagination (if pagination exists)
   */
  async verifyFeaturedResultsPersistOnPagination(): Promise<void> {
    // Check if pagination exists using SmartLocator
    const paginationNext = await this.findSmart({
      css: 'nav[aria-label="Pagination"] button:not([disabled]):last-of-type',
      role: { role: 'button', name: /next/i },
      xpath: '//nav[@aria-label="Pagination"]//button[not(@disabled)][last()]',
      description: 'Pagination next button',
    });
    const hasPagination = await paginationNext.count() > 0;

    if (!hasPagination) {
      console.log('No pagination found - skipping persistence test');
      return;
    }

    // Click next page
    await paginationNext.click();
    await this.page.waitForLoadState('networkidle');

    // Verify Featured Results still visible
    const section = await this.getFeaturedResultsSection();
    await expect.soft(section).toBeVisible();
    console.log('Featured Results persisted after pagination');
  }

  /**
   * Verify search is case-insensitive
   */
  async verifyCaseInsensitiveSearch(searchTerm: string): Promise<void> {
    // Test lowercase
    await this.performSearch(searchTerm.toLowerCase());
    await this.page.waitForTimeout(1000);
    let isVisible = await this.isVisibleSmart({
      dataQa: 'featured-search-results',
      css: '[data-qa="featured-search-results"]',
      description: 'Featured Results section',
    });
    expect.soft(isVisible).toBe(true);

    // Test uppercase
    await this.performSearch(searchTerm.toUpperCase());
    await this.page.waitForTimeout(1000);
    isVisible = await this.isVisibleSmart({
      dataQa: 'featured-search-results',
      css: '[data-qa="featured-search-results"]',
      description: 'Featured Results section',
    });
    expect.soft(isVisible).toBe(true);

    console.log(`Case-insensitive search verified for: ${searchTerm}`);
  }

  /**
   * Get featured card element by index for validation
   */
  async getCardElement(cardIndex: number, elementType: 'image' | 'title' | 'tags' | 'link'): Promise<Locator> {
    const card = await this.getFeaturedCard(cardIndex);

    switch (elementType) {
      case 'image':
        return await this.findSmart({
          dataQa: 'placeholder-image',
          css: '[data-qa="featured-search-results"] [data-qa="news-list-item"] img',
          role: { role: 'img' },
          xpath: '//div[@data-qa="featured-search-results"]//section[@data-qa="news-list-item"]//img',
          description: 'Featured card image',
        });
      case 'title':
        return await this.findSmart({
          dataQa: 'title-component',
          css: '[data-qa="featured-search-results"] [data-qa="title-component"]',
          role: { role: 'heading' },
          xpath: '//div[@data-qa="featured-search-results"]//h3[@data-qa="title-component"]',
          description: 'Featured card title',
        });
      case 'tags':
        return await this.findSmart({
          dataQa: 'tag-chip',
          css: '[data-qa="featured-search-results"] [data-qa="tag-chip"]',
          xpath: '//div[@data-qa="featured-search-results"]//button[@data-qa="tag-chip"]',
          description: 'Featured card tags',
        });
      case 'link':
        return await this.getFeaturedCardLink(card);
      default:
        throw new Error(`Unknown element type: ${elementType}`);
    }
  }

  /**
   * Log component state for debugging
   */
  async logComponentState(): Promise<void> {
    console.log('=== Featured Search Results Component State ===');

    try {
      const isSectionVisible = await this.isVisibleSmart({
        dataQa: 'featured-search-results',
        css: '[data-qa="featured-search-results"]',
        description: 'Featured Results section',
      });
      console.log(`Section visible: ${isSectionVisible}`);

      if (isSectionVisible) {
        const cardCount = await this.getFeaturedCardsCount();
        console.log(`Featured cards count: ${cardCount}`);

        for (let i = 0; i < cardCount; i++) {
          const title = await this.findSmart({
            dataQa: 'title-component',
            css: '[data-qa="featured-search-results"] [data-qa="title-component"]',
            role: { role: 'heading' },
            xpath: '//div[@data-qa="featured-search-results"]//h3[@data-qa="title-component"]',
            description: 'Featured card title for logging',
          });
          const titleText = await title.textContent();
          console.log(`  Card ${i}: ${titleText?.trim()}`);
        }
      }
    } catch (error) {
      console.error('Error logging component state:', error);
    }

    console.log('==============================================');
  }
}

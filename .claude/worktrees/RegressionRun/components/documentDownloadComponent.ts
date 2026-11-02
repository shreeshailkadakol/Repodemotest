import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { envUtils } from '../helpers/utils/envUtils';

/**
 * Document Download Component Page Object Model
 * User Story 2049 - AC10-AC14
 * 
 * MANDATORY: All element interactions use SmartLocator methods with minimum 3 fallback strategies
 * DOM inspection date: February 26, 2026
 * 
 * Component Features:
 * - Browse, search, and filter documents
 * - Single and bulk download capabilities  
 * - Multiple filter types (Document Type, Year, Quarter)
 * - Pagination support (separate URL)
 */
export class DocumentDownloadComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Navigate to Document Download component page with authentication
   * Includes cookie banner handling as per CTA component pattern
   */
  async navigateToDocumentDownloadPage(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.getComponentUrl('DocumentDownloadComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForNetworkIdle();
  }

  /**
   * Navigate to pagination-specific test page
   * [WARN] USE ONLY for pagination test scenarios (TC-DD020-DD023)
   */
  async navigateToPaginationPage(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.getComponentUrl('DocumentDownloadPaginationComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForNetworkIdle();
  }

  /**
   * Wait for component to load completely
   * Verifies headline is visible as indicator of component load
   */
  async waitForComponentLoad(): Promise<void> {
    await this.waitForNetworkIdle();
    const headline = await this.getHeadline();
    await headline.waitFor({ state: 'visible', timeout: 10000 });
    // Wait for documents to render (needed under parallel worker load)
    await this.page.locator('h3[data-qa="document-title"]').first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  }

  // ============================================================================
  // COMPONENT STRUCTURE LOCATORS (SmartLocator)
  // ============================================================================

  /**
   * Get component headline element
   * DOM: H3 with data-qa="title-component", text: "Headline of doc download"
   * SmartLocator with 4 fallback strategies: data-qa → role → css → xpath
   */
  async getHeadline(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'title-component',
      role: { role: 'heading', name: /headline/i },
      css: 'h3[data-qa="title-component"]',
      description: 'Document Download component headline',
    });
  }

  /**
   * Get divider element (positioned after headline)
   * AC10: Divider should appear after headline and before component content
   * SmartLocator with flexible fallback strategies for various divider implementations
   */
  async getDivider(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'divider',
      css: 'hr, [class*="divider"], [class*="separator"], [data-qa*="divider"]',
      xpath: '//hr | //*[contains(@class, "divider")] | //*[contains(@class, "separator")]',
      description: 'Divider after headline (AC10)',
    });
  }

  /**
   * Get search input field
   * DOM: input with data-qa="search-documents-input", placeholder="Search documents..."
   * SmartLocator with 4 fallback strategies
   */
  async getSearchInput(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'search-documents-input',
      testId: 'search-documents-input',
      role: { role: 'textbox' },
      placeholder: 'Search documents...',
      description: 'Search documents input field',
    });
  }

  /**
   * Get Document Type filter button
   * DOM: button with data-qa="document-type-filter", text="Document Type"
   * SmartLocator with 4 fallback strategies
   */
  async getDocumentTypeFilter(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'document-type-filter',
      testId: 'document-type-filter',
      role: { role: 'button', name: /document type/i },
      text: /document type/i,
      description: 'Document Type filter button',
    });
  }

  /**
   * Get Year filter button
   * DOM: button with data-qa="year-filter", text="Year"
   * SmartLocator with 4 fallback strategies
   */
  async getYearFilter(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'year-filter',
      testId: 'year-filter',
      role: { role: 'button', name: /year/i },
      text: /^year$/i,
      description: 'Year filter button',
    });
  }

  /**
   * Get Quarter filter button
   * DOM: button with data-qa="quarter-filter", text="Quarter"
   * SmartLocator with 4 fallback strategies
   */
  async getQuarterFilter(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'quarter-filter',
      testId: 'quarter-filter',
      role: { role: 'button', name: /quarter/i },
      text: /^quarter$/i,
      description: 'Quarter filter button',
    });
  }

  /**
   * Get bulk download button
   * DOM: button with data-qa="bulk-download-button", text="0 Selected" (dynamic count)
   * SmartLocator with 3 fallback strategies
   */
  async getBulkDownloadButton(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'bulk-download-button',
      testId: 'bulk-download-button',
      role: { role: 'button', name: /selected/i },
      description: 'Bulk download button with selection count',
    });
  }

  /**
   * Get all document cards on the page
   * Returns all document card elements for iteration
   */
  async getAllDocumentCards(): Promise<Locator> {
    const cardsLocator = await this.findSmart({
      dataQa: 'document-title',
      css: 'h3[data-qa="document-title"]',
      description: 'All document title elements',
    });
    return cardsLocator;
  }

  /**
   * Get count of documents displayed
   */
  async getDocumentCount(): Promise<number> {
    const cards = await this.findSmart({
      dataQa: 'document-title',
      css: 'h3[data-qa="document-title"]',
      description: 'Document title elements for counting',
    });
    return await cards.count();
  }

  // ============================================================================
  // DOCUMENT CARD CHILD ELEMENTS (SmartLocator with parent-child relationships)
  // ============================================================================

  /**
   * Get document title by index (0-based)
   * DOM: H3 with data-qa="document-title"
   */
  async getDocumentTitle(index: number = 0): Promise<Locator> {
    // Get all document titles first, then select by index
    const allTitles = this.page.locator('h3[data-qa="document-title"]');
    return allTitles.nth(index);
  }

  /**
   * Get document title by name (partial match)
   * Useful for searching specific documents
   */
  async getDocumentTitleByName(documentName: string): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'document-title',
      text: new RegExp(documentName, 'i'),
      css: `h3[data-qa="document-title"]`,
      description: `Document title containing "${documentName}"`,
    });
  }

  /**
   * Get checkbox for document by index
   * DOM: input with data-qa="document-checkbox", data-testid="document-checkbox-{uniqueId}"
   */
  async getDocumentCheckbox(index: number = 0): Promise<Locator> {
    // Get all checkboxes first, then select by index
    const allCheckboxes = this.page.locator('input[data-qa="document-checkbox"]');
    return allCheckboxes.nth(index);
  }

  /**
   * Get checkbox by unique document ID
   * DOM: input with data-testid="document-checkbox-{uniqueId}"
   */
  async getDocumentCheckboxById(documentId: string): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'document-checkbox',
      testId: `document-checkbox-${documentId}`,
      role: { role: 'checkbox' },
      description: `Document checkbox for ID: ${documentId}`,
    });
  }

  /**
   * Get all document checkboxes
   * Returns all checkboxes for bulk operations
   */
  async getAllDocumentCheckboxes(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'document-checkbox',
      role: { role: 'checkbox' },
      css: 'input[data-qa="document-checkbox"]',
      description: 'All document checkboxes',
    });
  }

  /**
   * Get individual download button for a document
   * [WARN] NOTE: Download buttons don't have data-qa attributes (DOM inspection finding)
   * Using semantic selectors with role and text
   */
  async getDocumentDownloadButton(index: number = 0): Promise<Locator> {
    // Get all download buttons, then select by index
    const allDownloadButtons = this.page.locator('button:has-text("Download")');
    return allDownloadButtons.nth(index);
  }

  // ============================================================================
  // FILTER INTERACTION METHODS (SmartLocator)
  // ============================================================================

  /**
   * Search for documents by title
   * Types text into search input and waits for filtering
   */
  async searchDocuments(searchTerm: string): Promise<void> {
    const searchInput = await this.getSearchInput();
    await searchInput.fill(searchTerm);
    await this.waitForNetworkIdle();
    await this.page.waitForTimeout(500); // Allow real-time filtering to complete
    
    // Scroll to show search results
    await this.scrollToResults();
  }

  /**
   * Clear search input
   */
  async clearSearch(): Promise<void> {
    const searchInput = await this.getSearchInput();
    await searchInput.clear();
    await this.waitForNetworkIdle();
    
    // Scroll to show all results after clearing
    await this.scrollToResults();
  }

  /**
   * Scroll to show document results area
   * Useful for headed mode test observation
   */
  async scrollToResults(): Promise<void> {
    // Try to scroll to first document title if available
    try {
      const firstDocument = await this.getDocumentTitle(0);
      await firstDocument.scrollIntoViewIfNeeded();
    } catch {
      // If no documents, scroll to search area
      const searchInput = await this.getSearchInput();
      await searchInput.scrollIntoViewIfNeeded();
    }
  }

  /**
   * Click Document Type filter button
   */
  async clickDocumentTypeFilter(): Promise<void> {
    const filterButton = await this.getDocumentTypeFilter();
    await filterButton.click();
    await this.page.waitForTimeout(300); // Allow dropdown to open
  }

  /**
   * Click Year filter button
   */
  async clickYearFilter(): Promise<void> {
    const filterButton = await this.getYearFilter();
    await filterButton.click();
    await this.page.waitForTimeout(300); // Allow dropdown to open
  }

  /**
   * Click Quarter filter button
   */
  async clickQuarterFilter(): Promise<void> {
    const filterButton = await this.getQuarterFilter();
    await filterButton.click();
    await this.page.waitForTimeout(300); // Allow dropdown to open
  }

  /**
   * Select a year filter option (e.g., "2025")
   * [WARN] Filter options need to be identified during test execution
   */
  async selectYearFilter(year: string): Promise<void> {
    await this.clickYearFilter();
    // Click year option button (using SmartLocator with text fallback since no data-qa)
    const yearOption = await this.findSmart({
      role: { role: 'button', name: new RegExp(year, 'i') },
      text: new RegExp(year, 'i'),
      description: `Year filter option: ${year}`,
    });
    await yearOption.click();
    await this.waitForNetworkIdle();
    
    // Scroll to show filtered results
    await this.scrollToResults();
  }

  /**
   * Select a quarter filter option (e.g., "Q2")
   */
  async selectQuarterFilter(quarter: string): Promise<void> {
    await this.clickQuarterFilter();
    const quarterOption = await this.findSmart({
      role: { role: 'button', name: new RegExp(quarter, 'i') },
      text: new RegExp(quarter, 'i'),
      description: `Quarter filter option: ${quarter}`,
    });
    await quarterOption.click();
    await this.waitForNetworkIdle();    
    // Scroll to show filtered results
    await this.scrollToResults();    
    // Scroll to show filtered results
    await this.scrollToResults();
  }

  // ============================================================================
  // CHECKBOX & DOWNLOAD ACTIONS (SmartLocator)
  // ============================================================================

  /**
   * Check/select a document checkbox by index
   */
  async selectDocument(index: number = 0): Promise<void> {
    const checkbox = await this.getDocumentCheckbox(index);
    if (await checkbox.isChecked()) {
      return;
    }

    // Self-healing click: on a cold deployment the checkbox change handler may not
    // be hydrated yet, so the first click can be swallowed and the bulk counter
    // never updates. Retry the click until the checkbox reflects the checked state.
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await checkbox.click();
      // Wait for UI to update bulk button count
      await this.page.waitForTimeout(300);

      if (await checkbox.isChecked()) {
        return;
      }

      if (attempt < maxAttempts) {
        await this.page.waitForTimeout(500);
      }
    }
  }

  /**
   * Uncheck/deselect a document checkbox by index
   */
  async deselectDocument(index: number = 0): Promise<void> {
    const checkbox = await this.getDocumentCheckbox(index);
    const isChecked = await checkbox.isChecked();
    if (isChecked) {
      await checkbox.click();
      // Wait for UI to update bulk button count
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Select multiple documents by indices
   */
  async selectMultipleDocuments(indices: number[]): Promise<void> {
    for (const index of indices) {
      // Scroll to checkbox to ensure it's visible
      const checkbox = await this.getDocumentCheckbox(index);
      await checkbox.scrollIntoViewIfNeeded();
      
      // Select the document
      await this.selectDocument(index);
      
      // Add extra wait between selections to allow UI to update
      await this.page.waitForTimeout(500);
    }
    // Wait for all selections to complete and UI to stabilize
    await this.page.waitForTimeout(1000);
  }

  /**
   * Click bulk download button
   */
  async clickBulkDownload(): Promise<void> {
    const bulkButton = await this.getBulkDownloadButton();
    await bulkButton.click();
  }

  /**
   * Click individual download button for a document
   */
  async downloadDocument(index: number = 0): Promise<void> {
    const downloadButton = await this.getDocumentDownloadButton(index);
    await downloadButton.click();
  }

  // ============================================================================
  // VALIDATION METHODS (Soft Assertions)
  // ============================================================================

  /**
   * Verify component headline is visible and has correct text
   */
  async verifyHeadlineVisible(): Promise<void> {
    const headline = await this.getHeadline();
    await expect.soft(headline).toBeVisible();
    const headlineText = await headline.textContent() || '';
    this.log(`Component headline: ${headlineText}`);
  }

  /**
   * Verify divider is present after headline (AC10)
   */
  async verifyDividerPlacement(): Promise<void> {
    const divider = await this.getDivider();
    await expect.soft(divider).toBeVisible();
    this.log('[AC10] Divider is visible after headline');
  }

  /**
   * Verify search input is visible and functional
   */
  async verifySearchInputVisible(): Promise<void> {
    const searchInput = await this.getSearchInput();
    await expect.soft(searchInput).toBeVisible();
    await expect.soft(searchInput).toBeEditable();
  }

  /**
   * Verify all three filter buttons are visible
   */
  async verifyFilterButtonsVisible(): Promise<void> {
    const docTypeFilter = await this.getDocumentTypeFilter();
    const yearFilter = await this.getYearFilter();
    const quarterFilter = await this.getQuarterFilter();

    await expect.soft(docTypeFilter).toBeVisible();
    await expect.soft(yearFilter).toBeVisible();
    await expect.soft(quarterFilter).toBeVisible();
    this.log('All filter buttons are visible');
  }

  /**
   * Verify bulk download button is visible
   */
  async verifyBulkDownloadButtonVisible(): Promise<void> {
    const bulkButton = await this.getBulkDownloadButton();
    await expect.soft(bulkButton).toBeVisible();
  }

  /**
   * Verify bulk download button shows correct selection count
   */
  async verifyBulkDownloadCount(expectedCount: number): Promise<void> {
    const bulkButton = await this.getBulkDownloadButton();
    const buttonText = await bulkButton.textContent() || '';
    expect.soft(buttonText).toContain(`${expectedCount} Selected`);
    this.log(`Bulk download button shows: ${buttonText}`);
  }

  /**
   * Verify bulk download button is disabled (when 0 documents selected)
   */
  async verifyBulkDownloadDisabled(): Promise<void> {
    const bulkButton = await this.getBulkDownloadButton();
    await expect.soft(bulkButton).toBeDisabled();
    this.log('Bulk download button is disabled (0 selected)');
  }

  /**
   * Verify bulk download button is enabled (when 1+ documents selected)
   */
  async verifyBulkDownloadEnabled(): Promise<void> {
    const bulkButton = await this.getBulkDownloadButton();
    await expect.soft(bulkButton).toBeEnabled();
    this.log('Bulk download button is enabled');
  }

  /**
   * Verify expected number of documents are displayed
   */
  async verifyDocumentCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getDocumentCount();
    expect.soft(actualCount).toBe(expectedCount);
    this.log(`Document count: ${actualCount} (expected: ${expectedCount})`);
  }

  /**
   * Verify specific document is visible by name
   */
  async verifyDocumentVisible(documentName: string): Promise<void> {
    const docTitle = await this.getDocumentTitleByName(documentName);
    await expect.soft(docTitle).toBeVisible();
    this.log(`Document visible: ${documentName}`);
  }

  /**
   * Verify checkbox is checked
   */
  async verifyCheckboxChecked(index: number): Promise<void> {
    const checkbox = await this.getDocumentCheckbox(index);
    await expect.soft(checkbox).toBeChecked();
  }

  /**
   * Verify checkbox is unchecked
   */
  async verifyCheckboxUnchecked(index: number): Promise<void> {
    const checkbox = await this.getDocumentCheckbox(index);
    await expect.soft(checkbox).not.toBeChecked();
  }

  // ============================================================================
  // EMPTY STATE & LOADING LOCATORS (SmartLocator)
  // ============================================================================

  /**
   * Get empty state message element
   * [WARN] Needs to be triggered by search with no results to identify exact selector
   */
  async getEmptyStateMessage(): Promise<Locator> {
    return await this.findSmart({
      text: /no documents found/i,
      css: '[class*="empty"], [class*="no-results"]',
      description: 'Empty state message when no results',
    });
  }

  /**
   * Verify empty state is displayed
   */
  async verifyEmptyStateVisible(): Promise<void> {
    const emptyState = await this.getEmptyStateMessage();
    await expect.soft(emptyState).toBeVisible();
    this.log('Empty state is visible (no results)');
  }

  /**
   * Get loading spinner element
   * [WARN] Needs to be triggered during initial load to identify exact selector
   */
  async getLoadingSpinner(): Promise<Locator> {
    return await this.findSmart({
      css: '[class*="loading"], [class*="spinner"]',
      xpath: '//*[contains(@class, "loading") or contains(@class, "spinner")]',
      description: 'Loading spinner during data fetch',
    });
  }

  // ============================================================================
  // PAGINATION LOCATORS (for pagination test URL only)
  // ============================================================================

  /**
   * Get previous page button
   */
  async getPreviousPageButton(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /previous/i },
      text: /previous/i,
      css: 'button[aria-label*="previous"]',
      description: 'Previous page button',
    });
  }

  /**
   * Get next page button
   */
  async getNextPageButton(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /next/i },
      text: /next/i,
      css: 'button[aria-label*="next"]',
      description: 'Next page button',
    });
  }

  /**
   * Get page number button
   */
  async getPageNumberButton(pageNumber: number): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: new RegExp(`${pageNumber}`, 'i') },
      text: new RegExp(`^${pageNumber}$`),
      css: `button[aria-label*="page ${pageNumber}"]`,
      description: `Page ${pageNumber} button`,
    });
  }

  /**
   * Go to specific page
   */
  async goToPage(pageNumber: number): Promise<void> {
    const pageButton = await this.getPageNumberButton(pageNumber);
    await pageButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Click next page
   */
  async clickNextPage(): Promise<void> {
    const nextButton = await this.getNextPageButton();
    await nextButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Click previous page
   */
  async clickPreviousPage(): Promise<void> {
    const prevButton = await this.getPreviousPageButton();
    await prevButton.click();
    await this.waitForNetworkIdle();
  }
}

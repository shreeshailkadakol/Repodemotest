import { Page, Locator, expect, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';
import { TransparencyDatagridFigmaValues } from '../helpers/utils/figma-values/TransparencyDatagrid_FigmaValues';

type ViewportSize = 'xl' | 'lg' | 'md' | 'sm';

interface TransparencyDatagridData {
  totalRows: number;
  visibleRows: number;
  columns: string[];
  hasData: boolean;
}

/**
 * Transparency Datagrid Component - Page Object Model (SmartLocator)
 *
 * DOM Structure (inspected from live component):
 * - Container: section[data-testid="transparency-datagrid"]
 * - Desktop bar (hidden xl:flex): headline + export + search + page-size
 * - Mobile bar (xl:hidden): headline-lg + filter-toggle + export + search + page-size
 * - Table (hidden xl:block): table > thead > tr > th + tbody > tr > td
 * - Cards (xl:hidden): div[data-testid="card-undefined"] for mobile layout
 * - Pagination: nav[aria-label="Pagination"] with page buttons
 *
 * Filters are per-column checkbox dropdowns in table headers.
 * No sorting functionality exists.
 *
 * ALL element interactions use SmartLocator methods with minimum 3 fallback strategies.
 */
export class TransparencyDatagrid extends BasePage {
  constructor(page: Page, browser?: Browser, context?: BrowserContext) {
    super(page, browser as Browser, context as BrowserContext);
  }

  // ============================================================================
  // SMART LOCATOR ELEMENT METHODS
  // ============================================================================

  /**
   * Get main datagrid container
   * DOM: section[data-testid="transparency-datagrid"]
   */
  async getDatagridContainer(): Promise<Locator> {
    return await this.findSmart({
      testId: 'transparency-datagrid',
      css: 'section[data-testid="transparency-datagrid"]',
      xpath: '//section[@data-testid="transparency-datagrid"]',
      description: 'Transparency Datagrid main container',
    });
  }

  /**
   * Get headline element (desktop - visible at XL/1280+)
   * DOM: [data-qa="transparency-datagrid-headline"]
   */
  async getHeadlineDesktop(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'transparency-datagrid-headline',
      role: { role: 'heading' },
      css: '[data-testid="transparency-datagrid"] [data-qa="transparency-datagrid-headline"]',
      description: 'Transparency Datagrid desktop headline',
    });
  }

  /**
   * Get headline element (mobile/tablet - visible below XL)
   * DOM: [data-qa="transparency-datagrid-headline-lg"]
   */
  async getHeadlineMobile(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'transparency-datagrid-headline-lg',
      role: { role: 'heading' },
      css: '[data-testid="transparency-datagrid"] [data-qa="transparency-datagrid-headline-lg"]',
      description: 'Transparency Datagrid mobile headline',
    });
  }

  /**
   * Get appropriate headline based on current viewport
   */
  async getHeadline(): Promise<Locator> {
    const viewport = this.page.viewportSize();
    const width = viewport?.width || 1440;
    return width >= 1280
      ? await this.getHeadlineDesktop()
      : await this.getHeadlineMobile();
  }

  /**
   * Get export button (default - visible at XL)
   * DOM: [data-testid="export-excel-button"]
   */
  async getExportButtonDefault(): Promise<Locator> {
    return await this.findSmart({
      testId: 'export-excel-button',
      role: { role: 'button', name: /download excel/i },
      css: '[data-testid="transparency-datagrid"] [data-testid="export-excel-button"]',
      description: 'Export Excel button (default/XL)',
    });
  }

  /**
   * Get export button (small - visible below MD)
   * DOM: [data-testid="export-excel-button-sm"]
   */
  async getExportButtonSmall(): Promise<Locator> {
    return await this.findSmart({
      testId: 'export-excel-button-sm',
      role: { role: 'button', name: /download excel/i },
      css: '[data-testid="transparency-datagrid"] [data-testid="export-excel-button-sm"]',
      description: 'Export Excel button (small/SM)',
    });
  }

  /**
   * Get export button (large - visible at MD-LG)
   * DOM: [data-testid="export-excel-button-lg"]
   */
  async getExportButtonLarge(): Promise<Locator> {
    return await this.findSmart({
      testId: 'export-excel-button-lg',
      role: { role: 'button', name: /download excel/i },
      css: '[data-testid="transparency-datagrid"] [data-testid="export-excel-button-lg"]',
      description: 'Export Excel button (large/LG)',
    });
  }

  /**
   * Get appropriate export button based on current viewport
   */
  async getExportButton(): Promise<Locator> {
    const viewport = this.page.viewportSize();
    const width = viewport?.width || 1440;
    if (width < 768) return await this.getExportButtonSmall();
    if (width < 1280) return await this.getExportButtonLarge();
    return await this.getExportButtonDefault();
  }

  /**
   * Get page size selector (top - visible at XL)
   * DOM: select[data-testid="page-size-select-top"]
   */
  async getPageSizeSelectTop(): Promise<Locator> {
    return await this.findSmart({
      testId: 'page-size-select-top',
      css: '[data-testid="transparency-datagrid"] select[data-testid="page-size-select-top"]',
      xpath: '//section[@data-testid="transparency-datagrid"]//select[@data-testid="page-size-select-top"]',
      description: 'Page size selector (top/XL)',
    });
  }

  /**
   * Get page size selector (large - visible below XL)
   * DOM: select[data-testid="page-size-select-lg"]
   */
  async getPageSizeSelectLarge(): Promise<Locator> {
    return await this.findSmart({
      testId: 'page-size-select-lg',
      css: '[data-testid="transparency-datagrid"] select[data-testid="page-size-select-lg"]',
      xpath: '//section[@data-testid="transparency-datagrid"]//select[@data-testid="page-size-select-lg"]',
      description: 'Page size selector (large/LG-MD-SM)',
    });
  }

  /**
   * Get appropriate page size selector based on viewport
   */
  async getPageSizeSelector(): Promise<Locator> {
    const viewport = this.page.viewportSize();
    const width = viewport?.width || 1440;
    return width >= 1280
      ? await this.getPageSizeSelectTop()
      : await this.getPageSizeSelectLarge();
  }

  /**
   * Get filter panel toggle button (visible below XL)
   * DOM: [data-testid="filter-panel-toggle"]
   */
  async getFilterPanelToggle(): Promise<Locator> {
    return await this.findSmart({
      testId: 'filter-panel-toggle',
      role: { role: 'button', name: /filter/i },
      css: '[data-testid="transparency-datagrid"] [data-testid="filter-panel-toggle"]',
      description: 'Filter panel toggle button (mobile)',
    });
  }

  /**
   * Get search input (desktop - visible at XL)
   * DOM: [data-qa="search-atom"] input (first instance)
   */
  async getSearchInputDesktop(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'search-atom',
      placeholder: 'Search',
      label: 'Search',
      css: '[data-testid="transparency-datagrid"] [data-qa="search-atom"] input',
      description: 'Search input (desktop/XL)',
    });
  }

  /**
   * Get search input (mobile - visible below XL)
   */
  async getSearchInputMobile(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-testid="transparency-datagrid"] .xl\\:hidden [data-qa="search-atom"] input',
      placeholder: 'Search',
      label: 'Search',
      xpath: '//section[@data-testid="transparency-datagrid"]//*[contains(@class,"xl:hidden")]//*[@data-qa="search-atom"]//input',
      description: 'Search input (mobile/tablet)',
    });
  }

  /**
   * Get appropriate search input based on viewport
   */
  async getSearchInput(): Promise<Locator> {
    const viewport = this.page.viewportSize();
    const width = viewport?.width || 1440;
    return width >= 1280
      ? await this.getSearchInputDesktop()
      : await this.getSearchInputMobile();
  }

  /**
   * Get table element (visible at XL)
   * DOM: section[data-testid="transparency-datagrid"] table
   */
  async getTable(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'table' },
      css: '[data-testid="transparency-datagrid"] table',
      xpath: '//section[@data-testid="transparency-datagrid"]//table',
      description: 'Data table (desktop view)',
    });
  }

  /**
   * Get table header elements
   * DOM: table > thead > tr > th
   */
  async getTableHeaders(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-testid="transparency-datagrid"] table thead th',
      xpath: '//section[@data-testid="transparency-datagrid"]//table//thead//th',
      role: { role: 'columnheader' },
      description: 'Table column headers',
    });
  }

  /**
   * Get table body rows
   * DOM: table > tbody > tr
   */
  async getTableRows(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-testid="transparency-datagrid"] table tbody tr',
      xpath: '//section[@data-testid="transparency-datagrid"]//table//tbody//tr',
      role: { role: 'row' },
      description: 'Table data rows',
    });
  }

  /**
   * Get card elements (mobile view)
   * DOM: [data-testid^="card-"]
   */
  async getCards(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-testid="transparency-datagrid"] [data-testid^="card-"]',
      xpath: '//section[@data-testid="transparency-datagrid"]//*[starts-with(@data-testid,"card-")]',
      description: 'Data cards (mobile view)',
    });
  }

  /**
   * Get pagination navigation container
   * DOM: nav[aria-label="Pagination"]
   */
  async getPaginationNav(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'navigation', name: 'Pagination' },
      css: '[data-testid="transparency-datagrid"] nav[aria-label="Pagination"]',
      xpath: '//section[@data-testid="transparency-datagrid"]//nav[@aria-label="Pagination"]',
      description: 'Pagination navigation container',
    });
  }

  /**
   * Get pagination Previous button
   */
  async getPaginationPrevious(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-testid="transparency-datagrid"] nav[aria-label="Pagination"] button:has(.sr-only:text("Previous"))',
      xpath: '//section[@data-testid="transparency-datagrid"]//nav[@aria-label="Pagination"]//button[.//*[contains(@class,"sr-only") and text()="Previous"]]',
      role: { role: 'button', name: /previous/i },
      description: 'Pagination Previous button',
    });
  }

  /**
   * Get pagination Next button
   */
  async getPaginationNext(): Promise<Locator> {
    return await this.findSmart({
      css: '[data-testid="transparency-datagrid"] nav[aria-label="Pagination"] button:has(.sr-only:text("Next"))',
      xpath: '//section[@data-testid="transparency-datagrid"]//nav[@aria-label="Pagination"]//button[.//*[contains(@class,"sr-only") and text()="Next"]]',
      role: { role: 'button', name: /next/i },
      description: 'Pagination Next button',
    });
  }

  /**
   * Get filter button for a specific column
   * DOM: [data-testid="filter-button-{columnKey}"]
   */
  async getFilterButton(columnKey: string): Promise<Locator> {
    return await this.findSmart({
      testId: `filter-button-${columnKey}`,
      css: `[data-testid="transparency-datagrid"] [data-testid="filter-button-${columnKey}"]`,
      xpath: `//section[@data-testid="transparency-datagrid"]//*[@data-testid="filter-button-${columnKey}"]`,
      description: `Filter button for column: ${columnKey}`,
    });
  }

  /**
   * Get filter dropdown for a specific column
   * DOM: [data-testid="filter-dropdown-{columnKey}"]
   */
  async getFilterDropdown(columnKey: string): Promise<Locator> {
    return await this.findSmart({
      testId: `filter-dropdown-${columnKey}`,
      css: `[data-testid="transparency-datagrid"] [data-testid="filter-dropdown-${columnKey}"]`,
      xpath: `//section[@data-testid="transparency-datagrid"]//*[@data-testid="filter-dropdown-${columnKey}"]`,
      description: `Filter dropdown for column: ${columnKey}`,
    });
  }

  /**
   * Get filter option within a dropdown
   * DOM: [data-testid="filter-option-{columnKey}-{optionValue}"]
   */
  async getFilterOption(columnKey: string, optionValue: string): Promise<Locator> {
    return await this.findSmart({
      testId: `filter-option-${columnKey}-${optionValue}`,
      css: `[data-testid="filter-dropdown-${columnKey}"] [data-testid="filter-option-${columnKey}-${optionValue}"]`,
      xpath: `//*[@data-testid="filter-dropdown-${columnKey}"]//*[@data-testid="filter-option-${columnKey}-${optionValue}"]`,
      description: `Filter option: ${optionValue} in column: ${columnKey}`,
    });
  }

  /**
   * Get filter count badge for a column
   * DOM: [data-testid="filter-count-{columnKey}"]
   */
  async getFilterCountBadge(columnKey: string): Promise<Locator> {
    return await this.findSmart({
      testId: `filter-count-${columnKey}`,
      css: `[data-testid="transparency-datagrid"] [data-testid="filter-count-${columnKey}"]`,
      xpath: `//section[@data-testid="transparency-datagrid"]//*[@data-testid="filter-count-${columnKey}"]`,
      description: `Filter count badge for column: ${columnKey}`,
    });
  }

  /**
   * Get specific table header by column key
   * DOM: [data-testid="table-header-{columnKey}"]
   */
  async getTableHeaderByColumn(columnKey: string): Promise<Locator> {
    return await this.findSmart({
      testId: `table-header-${columnKey}`,
      css: `[data-testid="transparency-datagrid"] [data-testid="table-header-${columnKey}"]`,
      xpath: `//section[@data-testid="transparency-datagrid"]//*[@data-testid="table-header-${columnKey}"]`,
      description: `Table header: ${columnKey}`,
    });
  }

  /**
   * Get no results message element
   * DOM: [data-testid="no-results-message"]
   */
  async getNoResultsMessage(): Promise<Locator> {
    return await this.findSmart({
      testId: 'no-results-message',
      text: /no.*results|no.*data/i,
      css: '[data-testid="transparency-datagrid"] [data-testid="no-results-message"]',
      description: 'No results message',
    });
  }

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  async navigateToComponent(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const candidateUrls = await this.getComponentUrlsWithFallback(
      'TransparencyDatagridComponent',
      baseURL
    );

    let lastError: unknown;

    for (const url of candidateUrls) {
      try {
        await this.page.setViewportSize({ width: 1440, height: 900 });
        await this.navigateWithAuthentication(url);
        await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
        await this.acceptCookiesBanner();

        const container = await this.getDatagridContainer();
        await container.waitFor({ state: 'attached', timeout: 15000 });
        await container.scrollIntoViewIfNeeded();
        await container.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});

        // Wait for table rows to appear
        const tableRows = await this.getTableRows();
        await tableRows.first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
        await expect.soft(container).toBeVisible();
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw new Error(
      `Failed to navigate to Transparency Datagrid. Error: ${lastError instanceof Error ? lastError.message : String(lastError)}`
    );
  }

  // ============================================================================
  // DATA INTERACTION METHODS
  // ============================================================================

  async waitForDataLoad(timeout: number = 30000): Promise<void> {
    try {
      const viewport = this.page.viewportSize();
      const width = viewport?.width || 1440;
      if (width >= 1280) {
        const rows = await this.getTableRows();
        await rows.first().waitFor({ state: 'visible', timeout });
      } else {
        const cards = await this.getCards();
        await cards.first().waitFor({ state: 'visible', timeout });
      }
    } catch {
      // Data may already be loaded
    }
  }

  async getVisibleRowCount(): Promise<number> {
    const viewport = this.page.viewportSize();
    const width = viewport?.width || 1440;
    if (width >= 1280) {
      const rows = await this.getTableRows();
      return await rows.count();
    }
    const cards = await this.getCards();
    return await cards.count();
  }

  async changePageSize(size: 5 | 10 | 20): Promise<void> {
    const selector = await this.getPageSizeSelector();
    await selector.selectOption({ value: size.toString() });
    await this.page.waitForTimeout(2000);
    await this.waitForDataLoad();
  }

  async verifyPageSize(expectedSize: number): Promise<void> {
    const rowCount = await this.getVisibleRowCount();
    expect.soft(rowCount, `Page size should be <= ${expectedSize}`).toBeLessThanOrEqual(expectedSize);
  }

  /**
   * Open the search input by clicking the search trigger button if needed.
   * The search UI uses a button (aria-label="Open search") that reveals the actual input on click.
   */
  async openSearchInput(): Promise<Locator> {
    const container = await this.getDatagridContainer();
    const viewport = this.page.viewportSize();
    const width = viewport?.width || 1440;

    // Try to find an already-visible text input first
    const existingInput = container.locator('input[type="text"][placeholder*="earch"], input[type="search"]').first();
    if (await existingInput.isVisible().catch(() => false)) {
      return existingInput;
    }

    // Click the search trigger button to reveal the input
    const searchTrigger = this.page.getByLabel(/open search|search/i).first();
    if (await searchTrigger.isVisible().catch(() => false)) {
      await searchTrigger.click();
      await this.page.waitForTimeout(500);
    }

    // Now find the revealed input
    const revealedInput = container.locator('input[type="text"], input[type="search"], input[placeholder*="earch"]').first();
    await revealedInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return revealedInput;
  }

  async search(query: string): Promise<void> {
    const input = await this.openSearchInput();
    await input.clear();
    await input.fill(query);
    await input.press('Enter');
    await this.page.waitForTimeout(2000);
    await this.waitForDataLoad();
  }

  async clearSearch(): Promise<void> {
    const input = await this.openSearchInput();
    await input.clear();
    await input.press('Enter');
    await this.page.waitForTimeout(2000);
    await this.waitForDataLoad();
  }

  /**
   * Apply filter on a column. columnKey must match the data-testid suffix:
   * Division, Subject_Of_Collaboration, Collaboration_Type, Partner_Name,
   * Partner_Country, Country_Of_Legal_Entity, Funding_Committed, Effective_Date, Clms_Status
   */
  async applyFilter(columnKey: string, optionValue: string): Promise<void> {
    const filterButton = await this.getFilterButton(columnKey);
    await filterButton.click();

    const dropdown = await this.getFilterDropdown(columnKey);
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });

    const option = await this.getFilterOption(columnKey, optionValue);
    await option.click();

    // Close dropdown
    await filterButton.click();
    await this.page.waitForTimeout(2000);
    await this.waitForDataLoad();
  }

  async clearFilters(): Promise<void> {
    const container = await this.getDatagridContainer();
    const filterButtons = await container
      .locator('[data-testid^="filter-button-"]')
      .all();

    for (const btn of filterButtons) {
      const testid = await btn.getAttribute('data-testid');
      const columnKey = testid?.replace('filter-button-', '');
      if (!columnKey) continue;

      await btn.click();
      const dropdown = await this.getFilterDropdown(columnKey);
      const isVisible = await dropdown.isVisible().catch(() => false);
      if (isVisible) {
        const selectAll = dropdown.locator(
          `[data-testid="filter-select-all-${columnKey}"] input`
        );
        const isChecked = await selectAll.isChecked();
        if (!isChecked) {
          await selectAll.click();
        }
        await btn.click();
      }
      await this.page.waitForTimeout(300);
    }
    await this.page.waitForTimeout(2000);
    await this.waitForDataLoad();
  }

  async getColumnHeaders(): Promise<string[]> {
    const container = await this.getDatagridContainer();
    const headers = container.locator('table thead th');
    const allHeaders = await headers.all();
    const texts: string[] = [];
    for (const h of allHeaders) {
      const text = await h.locator('span').first().textContent();
      texts.push(text?.trim() || '');
    }
    return texts;
  }

  async getCellText(rowIndex: number, columnKey: string): Promise<string> {
    const container = await this.getDatagridContainer();
    const rows = container.locator('table tbody tr');
    const cell = rows.nth(rowIndex).locator(
      `td[data-testid$="-${columnKey}"] span`
    );
    return (await cell.textContent())?.trim() || '';
  }

  async exportToExcel(): Promise<any> {
    const exportButton = await this.getExportButton();
    const downloadPromise = this.page.waitForEvent('download');
    await exportButton.click();
    return downloadPromise;
  }

  async verifyExportButton(): Promise<void> {
    const exportButton = await this.getExportButton();
    await expect.soft(exportButton, 'Export button should be visible').toBeVisible();
    await expect.soft(exportButton, 'Export button should be enabled').toBeEnabled();
    const ariaLabel = await exportButton.getAttribute('aria-label');
    expect.soft(ariaLabel, 'Export button should have aria-label').toContain('Download Excel');
  }

  async goToNextPage(): Promise<void> {
    const nextBtn = await this.getPaginationNext();
    await nextBtn.click();
    await this.page.waitForTimeout(2000);
    await this.waitForDataLoad();
  }

  async goToPreviousPage(): Promise<void> {
    const prevBtn = await this.getPaginationPrevious();
    await prevBtn.click();
    await this.page.waitForTimeout(2000);
    await this.waitForDataLoad();
  }

  async goToPage(pageNumber: number): Promise<void> {
    const paginationNav = await this.getPaginationNav();
    const pageButton = paginationNav.locator(`button:text-is("${pageNumber}")`);
    await pageButton.click();
    await this.page.waitForTimeout(2000);
    await this.waitForDataLoad();
  }

  // ============================================================================
  // RESPONSIVE VERIFICATION
  // ============================================================================

  async verifyResponsiveFilters(viewport: ViewportSize): Promise<void> {
    const width = this.getViewportWidth(viewport);
    await this.page.setViewportSize({ width, height: 900 });
    await this.page.waitForTimeout(500);

    // Use direct, scoped locators (not findSmart) for these presence/visibility
    // checks: findSmart throws when the table is absent (mobile/tablet) and its
    // broad role fallbacks can match an unrelated "filter" button on desktop.
    const filterToggle = this.page
      .locator('[data-testid="transparency-datagrid"] [data-testid="filter-panel-toggle"]')
      .first();
    const table = this.page
      .locator('[data-testid="transparency-datagrid"] table')
      .first();

    if (width < 1280) {
      await expect.soft(filterToggle, 'Filter toggle should be visible on mobile').toBeVisible();
      const tableVisible = await table.isVisible().catch(() => false);
      expect.soft(tableVisible, 'Table should be hidden on mobile').toBe(false);
    } else {
      const toggleVisible = await filterToggle.isVisible().catch(() => false);
      expect.soft(toggleVisible, 'Filter toggle should be hidden on desktop').toBe(false);
      await expect.soft(table, 'Table should be visible on desktop').toBeVisible();
    }
  }

  async verifyResponsiveCards(viewport: ViewportSize): Promise<void> {
    const width = this.getViewportWidth(viewport);
    await this.page.setViewportSize({ width, height: 900 });
    await this.page.waitForTimeout(500);

    // Direct, scoped locators so absence of the table on mobile does not throw.
    const cards = this.page.locator(
      '[data-testid="transparency-datagrid"] [data-testid^="card-"]'
    );
    const table = this.page
      .locator('[data-testid="transparency-datagrid"] table')
      .first();

    if (width < 1280) {
      const cardCount = await cards.count();
      expect.soft(cardCount, 'Cards should be visible on mobile').toBeGreaterThan(0);
      const tableVisible = await table.isVisible().catch(() => false);
      expect.soft(tableVisible, 'Table should be hidden on mobile').toBe(false);
    } else {
      await expect.soft(table, 'Table should be visible on desktop').toBeVisible();
    }
  }

  async openFilterPanel(): Promise<void> {
    const viewport = this.page.viewportSize();
    const width = viewport?.width || 1440;
    if (width < 1280) {
      const filterToggle = await this.getFilterPanelToggle();
      await filterToggle.click();
      await this.page.waitForTimeout(500);
    }
  }

  // ============================================================================
  // STRUCTURE VERIFICATION
  // ============================================================================

  async verifyComponentStructure(): Promise<void> {
    const container = await this.getDatagridContainer();
    await expect.soft(container, 'Datagrid container should be visible').toBeVisible();
    const headline = await this.getHeadline();
    await expect.soft(headline, 'Headline should be visible').toBeVisible();
    const exportButton = await this.getExportButton();
    await expect.soft(exportButton, 'Export button should be visible').toBeVisible();
    const pageSelector = await this.getPageSizeSelector();
    await expect.soft(pageSelector, 'Page size selector should be visible').toBeVisible();
  }

  async verifyDataIntegrity(): Promise<boolean> {
    const rowCount = await this.getVisibleRowCount();
    if (rowCount === 0) return false;
    try {
      const id = await this.getCellText(0, 'Bayer_ID');
      const division = await this.getCellText(0, 'Division');
      const status = await this.getCellText(0, 'Clms_Status');
      return id.length > 0 && division.length > 0 && status.length > 0;
    } catch {
      return false;
    }
  }

  async getGridData(): Promise<TransparencyDatagridData> {
    const totalRows = await this.getVisibleRowCount();
    const columns = await this.getColumnHeaders();
    return { totalRows, visibleRows: totalRows, columns, hasData: totalRows > 0 };
  }

  async verifyNoConsoleErrors(): Promise<void> {
    const errors: string[] = [];
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await this.page.waitForTimeout(2000);
    const relevantErrors = errors.filter(
      (e) => !e.includes('share-price') && !e.includes('Share Price')
    );
    expect.soft(relevantErrors.length, 'No console errors should exist').toBe(0);
  }

  /**
   * Get pagination controls (accessor for spec file)
   */
  get paginationControls(): Promise<Locator> {
    return this.getPaginationNav();
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private getViewportWidth(viewport: ViewportSize): number {
    const widths = { xl: 1440, lg: 1024, md: 768, sm: 375 };
    return widths[viewport];
  }
}

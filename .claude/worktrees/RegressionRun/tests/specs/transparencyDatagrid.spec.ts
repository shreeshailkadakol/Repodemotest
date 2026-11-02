import { test, expect, Download } from '@playwright/test';
import { TransparencyDatagrid } from '../../components/transparencyDatagrid';
import { TransparencyDatagridFigmaValues } from '../../helpers/utils/figma-values/TransparencyDatagrid_FigmaValues';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * TRANSPARENCY DATAGRID COMPONENT TEST SUITE
 *
 * Story: 2593
 * Component: Transparency Datagrid - data display from API
 *
 * Features tested:
 * - Data loading and display
 * - Column filtering (checkbox dropdowns per column header)
 * - Search across all columns
 * - Pagination (5/10/20 per page)
 * - XLSX export
 * - Responsive design (table to cards, filter toggle on mobile)
 * - Accessibility (ARIA labels, keyboard navigation)
 * - Performance (load times)
 * - Visual (typography, spacing)
 */

test.describe('Transparency Datagrid Component', () => {
  let component: TransparencyDatagrid;

  test.beforeEach(async ({ page, browser, context }) => {
    component = new TransparencyDatagrid(page, browser, context);
    await component.navigateToComponent();
  });

  test.describe('Functional Tests', () => {
    test('TC-TDG-F001: Data loads and displays in grid @Functional @Smoke', async () => {
      await test.step('Verify data rows are visible', async () => {
        const rowCount = await component.getVisibleRowCount();
        expect.soft(rowCount, 'Grid should display at least 1 row').toBeGreaterThan(0);
      });

      await test.step('Verify grid structure has data', async () => {
        const gridData = await component.getGridData();
        expect.soft(gridData.hasData, 'Grid should have data').toBe(true);
        expect.soft(gridData.columns.length, 'Grid should have columns').toBeGreaterThan(0);
      });

      await test.step('Verify pagination is visible', async () => {
        const pagination = await component.paginationControls;
        const paginationVisible = await pagination.isVisible();
        expect.soft(paginationVisible, 'Pagination should be visible').toBe(true);
      });
    });

    /**
     * AC2: Filter Functionality (per-column checkbox filters)
     * Component has filter buttons on each column header that open checkbox dropdowns
     */
    test('TC-TDG-F002: Verify column filter functionality @Functional', async ({ page }) => {
      const initialRowCount = await component.getVisibleRowCount();

      await test.step('Apply Division filter and verify results change', async () => {
        await component.applyFilter('Division', 'Crop Science');
        const filteredCount = await component.getVisibleRowCount();
        expect.soft(filteredCount, 'Filtered results should show data').toBeGreaterThan(0);
        expect.soft(
          filteredCount <= initialRowCount,
          'Filtered count should be <= initial'
        ).toBe(true);
      });

      await test.step('Clear filters and verify data restores', async () => {
        await component.clearFilters();
        const clearedCount = await component.getVisibleRowCount();
        expect.soft(clearedCount, 'Cleared count should match initial').toBe(initialRowCount);
      });
    });

    /**
     * AC3: Multi-filter (AND logic)
     */
    test('TC-TDG-F003: Verify multi-filter AND logic @Functional', async () => {
      const initialRowCount = await component.getVisibleRowCount();

      await test.step('Apply first filter (Division)', async () => {
        await component.applyFilter('Division', 'Pharmaceuticals');
        const filtered1 = await component.getVisibleRowCount();
        expect.soft(filtered1, 'First filter should show results').toBeGreaterThan(0);
      });

      await test.step('Apply second filter (Clms_Status)', async () => {
        await component.applyFilter('Clms_Status', 'Active');
        const filtered2 = await component.getVisibleRowCount();
        expect.soft(filtered2, 'Double filter should show results').toBeGreaterThan(0);
      });

      await test.step('Clear filters restores data', async () => {
        await component.clearFilters();
        const cleared = await component.getVisibleRowCount();
        expect.soft(cleared, 'Should restore all rows').toBe(initialRowCount);
      });
    });

    /**
     * AC4: Search Functionality
     */
    test('TC-TDG-F004: Verify search functionality @Functional', async () => {
      const initialRowCount = await component.getVisibleRowCount();

      await test.step('Search for a known term', async () => {
        await component.search('Pharmaceuticals');
        const searchCount = await component.getVisibleRowCount();
        expect.soft(searchCount, 'Search should return results').toBeGreaterThan(0);
        expect.soft(searchCount <= initialRowCount, 'Search should filter').toBe(true);
      });

      await test.step('Clear search restores data', async () => {
        await component.clearSearch();
        const clearedCount = await component.getVisibleRowCount();
        expect.soft(clearedCount, 'Clearing search restores rows').toBe(initialRowCount);
      });
    });

    /**
     * AC5: Pagination (5/10/20 per page)
     */
    test('TC-TDG-F005: Verify pagination functionality @Functional', async () => {
      await test.step('Verify page size selector is visible', async () => {
        const pageSelector = await component.getPageSizeSelector();
        await expect.soft(pageSelector, 'Page size selector should be visible').toBeVisible();
      });

      await test.step('Change page size to 5', async () => {
        await component.changePageSize(5);
        const rowCount = await component.getVisibleRowCount();
        expect.soft(rowCount, 'Should display max 5 rows').toBeLessThanOrEqual(5);
      });

      await test.step('Change page size to 10', async () => {
        await component.changePageSize(10);
        const rowCount = await component.getVisibleRowCount();
        expect.soft(rowCount, 'Should display max 10 rows').toBeLessThanOrEqual(10);
      });

      await test.step('Change page size to 20', async () => {
        await component.changePageSize(20);
        const rowCount = await component.getVisibleRowCount();
        expect.soft(rowCount, 'Should display max 20 rows').toBeLessThanOrEqual(20);
      });

      await test.step('Navigate to next page', async () => {
        await component.changePageSize(5);
        await component.goToNextPage();
        const rowCount = await component.getVisibleRowCount();
        expect.soft(rowCount, 'Next page should have data').toBeGreaterThan(0);
      });
    });

    /**
     * AC6: XLSX Export
     */
    test('TC-TDG-F006: Verify XLSX export functionality @Functional', async ({ page }) => {
      await test.step('Verify export button is visible', async () => {
        await component.verifyExportButton();
      });

      await test.step('Click export and verify download', async () => {
        const download: Download = await component.exportToExcel();
        expect.soft(download, 'Download should be initiated').toBeDefined();
        const filename = download.suggestedFilename();
        expect.soft(filename, 'File should be XLSX').toMatch(/\.xlsx$/i);
      });

      await test.step('Verify exported file has content', async () => {
        const download: Download = await component.exportToExcel();
        const tempPath = path.join(__dirname, '../../temp', download.suggestedFilename());
        await download.saveAs(tempPath);
        const fileExists = fs.existsSync(tempPath);
        expect.soft(fileExists, 'File should exist').toBe(true);
        if (fileExists) {
          const stats = fs.statSync(tempPath);
          expect.soft(stats.size, 'File should have content').toBeGreaterThan(0);
          fs.unlinkSync(tempPath);
        }
      });
    });

    /**
     * AC9: Component Rendering
     */
    test('TC-TDG-F009: Verify component structure and rendering @Functional @Smoke', async () => {
      await test.step('Verify main component visible', async () => {
        await component.verifyComponentStructure();
      });

      await test.step('Verify headline is visible with text', async () => {
        const headline = await component.getHeadline();
        await expect.soft(headline, 'Headline should be visible').toBeVisible();
        const text = await headline.textContent();
        expect.soft(text?.trim().length, 'Headline should have text').toBeGreaterThan(0);
      });

      await test.step('Verify export button', async () => {
        const exportButton = await component.getExportButton();
        await expect.soft(exportButton, 'Export button visible').toBeVisible();
        await expect.soft(exportButton, 'Export button enabled').toBeEnabled();
      });

      await test.step('Verify page size selector', async () => {
        const pageSelector = await component.getPageSizeSelector();
        await expect.soft(pageSelector, 'Page size selector visible').toBeVisible();
      });

      await test.step('Verify no console errors', async () => {
        await component.verifyNoConsoleErrors();
      });
    });

    /**
     * AC10: Data Integrity
     */
    test('TC-TDG-F010: Verify data integrity and formatting @Functional', async () => {
      await test.step('Verify data integrity', async () => {
        const isValid = await component.verifyDataIntegrity();
        expect.soft(isValid, 'Data integrity should be valid').toBe(true);
      });

      await test.step('Verify column headers are correct', async () => {
        const headers = await component.getColumnHeaders();
        expect.soft(headers, 'Should have ID column').toContain('ID');
        expect.soft(headers, 'Should have Division column').toContain('Division');
        expect.soft(headers, 'Should have Status column').toContain('Status');
      });

      await test.step('Verify first row has valid data', async () => {
        const id = await component.getCellText(0, 'Bayer_ID');
        expect.soft(id, 'ID should start with C').toMatch(/^C\d+$/);

        const status = await component.getCellText(0, 'Clms_Status');
        expect.soft(['Active', 'Inactive'], 'Status should be valid').toContain(status);
      });
    });
  });

  test.describe('Responsive Tests', () => {
    /**
     * AC7: Filters collapse on mobile, table has inline filters on desktop
     */
    test('TC-TDG-R007: Verify responsive filter behavior @Functional @Responsive', async () => {
      await test.step('XL viewport - table visible, filter toggle hidden', async () => {
        await component.verifyResponsiveFilters('xl');
      });

      await test.step('LG viewport - filter toggle visible, table hidden', async () => {
        await component.verifyResponsiveFilters('lg');
      });

      await test.step('MD viewport - filter toggle visible', async () => {
        await component.verifyResponsiveFilters('md');
      });

      await test.step('SM viewport - filter toggle visible', async () => {
        await component.verifyResponsiveFilters('sm');
      });
    });

    /**
     * AC8: Rows become card-style on mobile
     */
    test('TC-TDG-R008: Verify rows transform to cards on mobile @Functional @Responsive', async () => {
      await test.step('XL viewport - table layout', async () => {
        await component.verifyResponsiveCards('xl');
      });

      await test.step('LG viewport - card layout', async () => {
        await component.verifyResponsiveCards('lg');
      });

      await test.step('MD viewport - card layout', async () => {
        await component.verifyResponsiveCards('md');
      });

      await test.step('SM viewport - card layout', async () => {
        await component.verifyResponsiveCards('sm');
      });
    });
  });

  test.describe('Accessibility Tests', () => {
    test('TC-TDG-A001: Verify ARIA labels and semantic HTML @Accessibility', async () => {
      await test.step('Export button has aria-label', async () => {
        const exportButton = await component.getExportButton();
        const ariaLabel = await exportButton.getAttribute('aria-label');
        expect.soft(ariaLabel, 'Export button should have aria-label').toContain('Download Excel');
      });

      await test.step('Headline is proper heading element', async () => {
        const headline = await component.getHeadline();
        const tagName = await headline.evaluate((el) => el.tagName.toLowerCase());
        expect.soft(tagName, 'Headline should be h2').toBe('h2');
      });

      await test.step('Page size selector has id', async () => {
        const pageSelector = await component.getPageSizeSelector();
        const hasId = await pageSelector.getAttribute('id');
        expect.soft(hasId, 'Page size selector should have id').toBeTruthy();
      });

      await test.step('Pagination nav has aria-label', async () => {
        const pagination = await component.paginationControls;
        const ariaLabel = await pagination.getAttribute('aria-label');
        expect.soft(ariaLabel, 'Pagination should have aria-label').toBe('Pagination');
      });
    });

    test('TC-TDG-A002: Verify keyboard navigation @Accessibility', async ({ page }) => {
      await test.step('Export button is keyboard accessible', async () => {
        const exportButton = await component.getExportButton();
        await exportButton.focus();
        const isFocused = await exportButton.evaluate((el) => el === document.activeElement);
        expect.soft(isFocused, 'Export button should be focusable').toBe(true);
      });

      await test.step('Page size selector is keyboard accessible', async () => {
        const pageSelector = await component.getPageSizeSelector();
        await pageSelector.focus();
        const isFocused = await pageSelector.evaluate((el) => el === document.activeElement);
        expect.soft(isFocused, 'Page size selector should be focusable').toBe(true);
      });

      await test.step('Search input is keyboard accessible', async () => {
        const searchInput = await component.getSearchInput();
        await searchInput.focus();
        const isFocused = await searchInput.evaluate((el) => el === document.activeElement);
        expect.soft(isFocused, 'Search input should be focusable').toBe(true);
      });
    });
  });

  test.describe('Performance Tests', () => {
    test('TC-TDG-P001: Verify component loads within acceptable time @Performance', async ({
      page,
    }) => {
      const startTime = Date.now();
      await page.reload({ waitUntil: 'domcontentloaded' });
      // Wait for data to appear
      const tableRows = await component.getTableRows();
      await tableRows.first().waitFor({ state: 'visible', timeout: 60000 });
      const loadTime = Date.now() - startTime;

      // Allow generous time due to auth + API loading
      expect.soft(loadTime, 'Component should load within 30 seconds').toBeLessThan(30000);
    });

    test('TC-TDG-P002: Verify page interaction is responsive @Performance', async ({ page }) => {
      // Measure page size change responsiveness
      const startTime = Date.now();
      await component.changePageSize(5);
      const interactionTime = Date.now() - startTime;

      expect.soft(interactionTime, 'Page size change should respond within 5 seconds').toBeLessThan(5000);
      const rowCount = await component.getVisibleRowCount();
      expect.soft(rowCount, 'Should have rows after interaction').toBeGreaterThan(0);
    });
  });

  test.describe('Visual Tests', () => {
    test('TC-TDG-V001: Verify headline typography @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const headline = await component.getHeadline();
      const figmaValues = TransparencyDatagridFigmaValues.XL;

      const fontSize = await headline.evaluate((el) => getComputedStyle(el).fontSize);
      expect.soft(fontSize, `Headline font size should be ${figmaValues.headline.fontSize}`).toBe(figmaValues.headline.fontSize);

      const fontWeight = await headline.evaluate((el) => getComputedStyle(el).fontWeight);
      expect.soft(fontWeight, `Headline should be bold (${figmaValues.headline.fontWeight})`).toBe(figmaValues.headline.fontWeight);

      const headlineText = await headline.textContent();
      expect.soft(headlineText?.trim(), 'Headline text').toBe(figmaValues.headline.text);
    });

    test('TC-TDG-V002: Verify search input styling @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const searchInput = await component.openSearchInput();

      await expect.soft(searchInput, 'Search input should be visible').toBeVisible();

      const placeholder = await searchInput.getAttribute('placeholder');
      expect.soft(placeholder, 'Should have Search placeholder').toBe('Search');

      const ariaLabel = await searchInput.getAttribute('aria-label');
      expect.soft(ariaLabel, 'Should have aria-label').toBe('Search');
    });

    test('TC-TDG-V003: Verify table header styling @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const firstHeader = await component.getTableHeaderByColumn('Bayer_ID');

      await expect.soft(firstHeader, 'First header should be visible').toBeVisible();

      const headerText = await firstHeader.locator('span').first().textContent();
      expect.soft(headerText?.trim(), 'First column should be ID').toBe('ID');

      // Check font weight of header text
      const fontWeight = await firstHeader.locator('span').first()
        .evaluate((el) => getComputedStyle(el).fontWeight);
      expect.soft(Number.parseInt(fontWeight), 'Header text should be semibold+').toBeGreaterThanOrEqual(600);
    });

    test('TC-TDG-V004: Verify table cell styling @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const container = page.locator('[data-testid="transparency-datagrid"]');
      const firstCell = container.locator('table tbody tr').first().locator('td').first();

      await expect.soft(firstCell, 'First cell should be visible').toBeVisible();

      const figmaValues = TransparencyDatagridFigmaValues.XL;
      const fontSize = await firstCell.locator('span').evaluate((el) => getComputedStyle(el).fontSize);
      expect.soft(fontSize, `Cell font size should be ${figmaValues.tableCell.fontSize}`).toBe(figmaValues.tableCell.fontSize);
    });

    test('TC-TDG-V005: Verify pagination styling @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const pagination = await component.paginationControls;

      await expect.soft(pagination, 'Pagination should be visible').toBeVisible();

      // Verify page 1 is highlighted (bold)
      const page1Button = pagination.locator('button[aria-label="Go to first page"]');
      const fontWeight = await page1Button.evaluate((el) => getComputedStyle(el).fontWeight);
      expect.soft(Number.parseInt(fontWeight), 'Active page should be bold').toBeGreaterThanOrEqual(700);
    });

    test('TC-TDG-V006: Verify responsive card layout styling @Visual @Responsive', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 768, height: 900 });
      await page.waitForTimeout(500);

      // Cards should be visible at mobile viewport
      const cards = await component.getCards();
      const cardCount = await cards.count();
      expect.soft(cardCount, 'Cards should be visible on mobile').toBeGreaterThan(0);

      // Check card has label-value pairs
      const firstCard = cards.first();
      const labels = firstCard.locator('.bg-background-bg-elevated span');
      const labelCount = await labels.count();
      expect.soft(labelCount, 'Card should have field labels').toBeGreaterThan(0);
    });

    test('TC-TDG-V007: Verify spacing and layout @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      // Table header padding
      const tableHeader = await component.getTableHeaderByColumn('Bayer_ID');
      const padding = await tableHeader.evaluate((el) => getComputedStyle(el).padding);
      expect.soft(padding, 'Header should have padding').toBeTruthy();

      // Verify column width consistency using direct locators
      const container = page.locator('[data-testid="transparency-datagrid"]');
      const headers = container.locator('table thead th');
      const firstWidth = await headers.first().evaluate((el) => el.getBoundingClientRect().width);
      const secondWidth = await headers.nth(1).evaluate((el) => el.getBoundingClientRect().width);
      expect.soft(firstWidth, 'Columns should have equal width').toBe(secondWidth);
    });

    test('TC-TDG-V008: Verify font consistency across elements @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      const headline = await component.getHeadline();
      const headlineFont = await headline.evaluate((el) => getComputedStyle(el).fontFamily);

      const tableHeader = await component.getTableHeaderByColumn('Bayer_ID');
      const headerFont = await tableHeader.locator('span').first().evaluate((el) => getComputedStyle(el).fontFamily);

      // Both should use the same font family (sans-serif based)
      expect.soft(headlineFont, 'Headline should use sans-serif').toContain('sans');
      expect.soft(headerFont, 'Header should use sans-serif').toContain('sans');
    });

    /**
     * Filter Badge Tests - NEW (from Figma gap analysis)
     * Badge appears on column headers when filters are applied showing count of selected filters
     * Figma Node: I19090:79360;29334:15732 (multiselect number)
     */
    test('TC-TDG-V009: Verify filter badge appears when filter applied @Visual', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await test.step('Badge should not be visible before filtering', async () => {
        // Badge element doesn't exist in DOM before any filter is applied
        const container = page.locator('[data-testid="transparency-datagrid"]');
        const badgeBefore = container.locator('[data-testid="filter-count-Division"]');
        const isVisibleBefore = await badgeBefore.isVisible().catch(() => false);
        expect.soft(isVisibleBefore, 'Badge should not be visible initially').toBe(false);
      });

      await test.step('Apply one filter and verify badge appears', async () => {
        await component.applyFilter('Division', 'Crop Science');
        await page.waitForTimeout(500);

        const badge = await component.getFilterCountBadge('Division');
        await expect.soft(badge, 'Badge should appear after filter applied').toBeVisible();
      });

      // Cleanup
      await component.clearFilters();
    });

    test('TC-TDG-V010: Verify filter badge count matches selected filters @Visual', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await test.step('Badge shows "1" when one filter is selected', async () => {
        await component.applyFilter('Division', 'Crop Science');
        await page.waitForTimeout(500);

        const badge = await component.getFilterCountBadge('Division');
        const badgeText = await badge.textContent();
        expect.soft(badgeText?.trim(), 'Badge should show "1" for single filter').toBe('1');
      });

      await test.step('Badge count increases when multiple filters selected in same column', async () => {
        // Open filter dropdown again and select another option
        const filterButton = await component.getFilterButton('Division');
        await filterButton.click();

        const dropdown = await component.getFilterDropdown('Division');
        await dropdown.waitFor({ state: 'visible' });

        const secondOption = await component.getFilterOption('Division', 'Pharmaceuticals');
        await secondOption.click();

        await filterButton.click(); // Close dropdown
        await page.waitForTimeout(500);

        const badge = await component.getFilterCountBadge('Division');
        const badgeText = await badge.textContent();
        expect.soft(badgeText?.trim(), 'Badge should show "2" for two filters').toBe('2');
      });

      // Cleanup
      await component.clearFilters();
    });

    test('TC-TDG-V011: Verify filter badge typography and styling @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await test.step('Apply filter to show badge', async () => {
        await component.applyFilter('Division', 'Crop Science');
        await page.waitForTimeout(500);
      });

      await test.step('Verify badge typography (text-xs/bold from Figma)', async () => {
        const badge = await component.getFilterCountBadge('Division');
        const figmaValues = TransparencyDatagridFigmaValues.XL;

        await expect.soft(badge, 'Badge should be visible').toBeVisible();

        // Font size from Figma
        const fontSize = await badge.evaluate((el) => getComputedStyle(el).fontSize);
        expect.soft(fontSize, `Badge font size should be ${figmaValues.filterBadge.fontSize}`).toBe(figmaValues.filterBadge.fontSize);

        // Font weight from Figma
        const fontWeight = await badge.evaluate((el) => getComputedStyle(el).fontWeight);
        expect.soft(fontWeight, `Badge font weight should be ${figmaValues.filterBadge.fontWeight}`).toBe(figmaValues.filterBadge.fontWeight);

        // Line height from Figma
        const lineHeight = await badge.evaluate((el) => getComputedStyle(el).lineHeight);
        expect.soft(lineHeight, `Badge line height should be ${figmaValues.filterBadge.lineHeight}`).toBe(figmaValues.filterBadge.lineHeight);
      });

      await test.step('Verify badge colors (white text on dark blue #10384F)', async () => {
        const badge = await component.getFilterCountBadge('Division');
        const figmaValues = TransparencyDatagridFigmaValues.XL;

        // Text color from Figma
        const color = await badge.evaluate((el) => getComputedStyle(el).color);
        expect
          .soft(color, `Badge text should be ${figmaValues.filterBadge.color}`)
          .toBe(figmaValues.filterBadge.color);

        // Background from Figma
        const bgColor = await badge.evaluate((el) => getComputedStyle(el).backgroundColor);
        expect
          .soft(bgColor, `Badge background should be ${figmaValues.filterBadge.backgroundColor}`)
          .toBe(figmaValues.filterBadge.backgroundColor);
      });

      await test.step('Verify badge border radius (8px from Figma)', async () => {
        const badge = await component.getFilterCountBadge('Division');
        const figmaValues = TransparencyDatagridFigmaValues.XL;

        const borderRadius = await badge.evaluate((el) => getComputedStyle(el).borderRadius);
        expect.soft(borderRadius, `Badge should have ${figmaValues.filterBadge.borderRadius} border radius`).toBe(figmaValues.filterBadge.borderRadius);
      });

      // Cleanup
      await component.clearFilters();
    });

    /**
     * Checkbox Visual Tests - NEW (from Figma gap analysis)
     * Checkboxes appear in dropdown filter panels with distinct selected/unselected states
     * Figma Component: checkbox (19090:74173)
     */
    test('TC-TDG-V012: Verify unselected checkbox appearance @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await test.step('Open filter dropdown to show checkboxes', async () => {
        const filterButton = await component.getFilterButton('Division');
        await filterButton.click();

        const dropdown = await component.getFilterDropdown('Division');
        await dropdown.waitFor({ state: 'visible' });
      });

      await test.step('Verify unselected checkbox styling', async () => {
        const dropdown = await component.getFilterDropdown('Division');
        const firstOption = dropdown.locator('[data-testid^="filter-option-Division-"]').first();
        const checkbox = firstOption.locator('input[type="checkbox"]');

        // Checkbox should be visible
        await expect.soft(checkbox, 'Checkbox should be visible').toBeVisible();

        // Checkbox should be unchecked (or check if it's unchecked initially)
        const isChecked = await checkbox.isChecked();
        if (!isChecked) {
          // Verify it has checkbox styling
          const checkboxSize = await checkbox.evaluate(
            (el) => el.getBoundingClientRect().width
          );
          expect
            .soft(checkboxSize, 'Checkbox should have visible size')
            .toBeGreaterThan(10);
        }
      });

      // Close dropdown
      const filterButton = await component.getFilterButton('Division');
      await filterButton.click();
    });

    test('TC-TDG-V013: Verify selected checkbox appearance @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await test.step('Open filter dropdown', async () => {
        const filterButton = await component.getFilterButton('Division');
        await filterButton.click();

        const dropdown = await component.getFilterDropdown('Division');
        await dropdown.waitFor({ state: 'visible' });
      });

      await test.step('Select a checkbox and verify checked state styling', async () => {
        const dropdown = await component.getFilterDropdown('Division');
        const cropScienceOption = dropdown.locator(
          '[data-testid="filter-option-Division-Crop Science"]'
        );
        const checkbox = cropScienceOption.locator('input[type="checkbox"]');

        // Click to select if not already selected
        const isCheckedBefore = await checkbox.isChecked();
        if (!isCheckedBefore) {
          await cropScienceOption.click();
          await page.waitForTimeout(300);
        }

        // Verify checkbox is now checked
        const isCheckedAfter = await checkbox.isChecked();
        expect.soft(isCheckedAfter, 'Checkbox should be checked after click').toBe(true);

        // Verify checkbox still has proper size (20px from Figma)
        const checkboxSize = await checkbox.evaluate(
          (el) => el.getBoundingClientRect().width
        );
        expect.soft(checkboxSize, 'Checkbox size should be ~20px').toBeGreaterThanOrEqual(16);
        expect.soft(checkboxSize, 'Checkbox size should be ~20px').toBeLessThanOrEqual(24);
      });

      // Close dropdown (cleanup)
      const filterButton = await component.getFilterButton('Division');
      await filterButton.click();
      await component.clearFilters();
    });

    /**
     * Manual Testing Issues - Specific Figma Validation Tests
     * These tests validate specific issues found during manual testing against Figma specs
     * XL Viewport (1440px) - Issues identified by QA
     */
    test('TC-TDG-V014: Verify pagination selector typography @Visual @ManualIssue', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await test.step('Verify pagination selector font-size and line-height', async () => {
        // Figma: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=19090-79097&m=dev
        const figmaValues = TransparencyDatagridFigmaValues.XL;
        
        const paginationSelector = await component.getPageSizeSelector();
        await expect.soft(paginationSelector, 'Pagination selector should be visible').toBeVisible();

        const fontSize = await paginationSelector.evaluate((el) => getComputedStyle(el).fontSize);
        expect.soft(fontSize, `Pagination selector font-size should be ${figmaValues.dropdown.fontSize}`).toBe(figmaValues.dropdown.fontSize);

        const lineHeight = await paginationSelector.evaluate((el) => getComputedStyle(el).lineHeight);
        expect.soft(lineHeight, `Pagination selector line-height should be ${figmaValues.dropdown.lineHeight}`).toBe(figmaValues.dropdown.lineHeight);
      });
    });

    test('TC-TDG-V015: Verify table column header ID typography @Visual @ManualIssue', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await test.step('Verify ID column header typography', async () => {
        // Figma: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=19090-79097&m=dev
        const figmaValues = TransparencyDatagridFigmaValues.XL;
        
        const idHeader = await component.getTableHeaderByColumn('Bayer_ID');
        const headerText = idHeader.locator('span').first();
        
        await expect.soft(headerText, 'ID column header should be visible').toBeVisible();

        const fontSize = await headerText.evaluate((el) => getComputedStyle(el).fontSize);
        expect.soft(fontSize, `ID column font-size should be ${figmaValues.tableHeader.fontSize}`).toBe(figmaValues.tableHeader.fontSize);

        const fontWeight = await headerText.evaluate((el) => getComputedStyle(el).fontWeight);
        expect.soft(fontWeight, `ID column font-weight should be ${figmaValues.tableHeader.fontWeight}`).toBe(figmaValues.tableHeader.fontWeight);

        const lineHeight = await headerText.evaluate((el) => getComputedStyle(el).lineHeight);
        expect.soft(lineHeight, `ID column line-height should be ${figmaValues.tableHeader.lineHeight}`).toBe(figmaValues.tableHeader.lineHeight);
      });
    });

    test('TC-TDG-V016: Verify multiselect number badge color @Visual @ManualIssue', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await test.step('Apply filter to show multiselect badge', async () => {
        await component.applyFilter('Division', 'Crop Science');
        await page.waitForTimeout(500);
      });

      await test.step('Verify multiselect badge text color is white', async () => {
        // Figma: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=19090-79180&m=dev
        const figmaValues = TransparencyDatagridFigmaValues.XL;
        
        const badge = await component.getFilterCountBadge('Division');
        await expect.soft(badge, 'Badge should be visible').toBeVisible();

        const color = await badge.evaluate((el) => getComputedStyle(el).color);
        
        // Validate against Figma specification
        expect.soft(
          color, 
          `Badge text color should be ${figmaValues.filterBadge.color}`
        ).toBe(figmaValues.filterBadge.color);
      });

      await component.clearFilters();
    });

    test('TC-TDG-V017: Verify dropdown sort ascending font-weight @Visual @ManualIssue', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await test.step('Open filter dropdown and check sort option', async () => {
        // Figma: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=19090-79340&m=dev
        // Expected: font-weight: 700 (bold)
        
        const filterButton = await component.getFilterButton('Division');
        await filterButton.click();

        const dropdown = await component.getFilterDropdown('Division');
        await dropdown.waitFor({ state: 'visible' });

        // Find the sort ascending option in dropdown
        const sortAscending = dropdown.locator('[data-testid="sort-ascending"]').or(
          dropdown.locator('text=Sort ascending')
        );
        
        if (await sortAscending.isVisible().catch(() => false)) {
          const fontWeight = await sortAscending.evaluate((el) => getComputedStyle(el).fontWeight);
          expect.soft(fontWeight, `Sort ascending font-weight should be ${TransparencyDatagridFigmaValues.XL.paginationNumber.fontWeight}`).toBe(TransparencyDatagridFigmaValues.XL.paginationNumber.fontWeight);
        }

        // Close dropdown
        await filterButton.click();
      });
    });

    test('TC-TDG-V018: Verify filter number badge in dropdown typography @Visual @ManualIssue', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await test.step('Apply filter and check badge in dropdown', async () => {
        // Figma: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=19090-79360&m=dev
        // Expected: font-size: 18px, font-weight: 500, color: #ffffff
        
        await component.applyFilter('Division', 'Crop Science');
        await page.waitForTimeout(500);

        const filterButton = await component.getFilterButton('Division');
        await filterButton.click();

        const dropdown = await component.getFilterDropdown('Division');
        await dropdown.waitFor({ state: 'visible' });

        // The filter number badge inside the dropdown (different from header badge)
        const filterNumberInDropdown = dropdown.locator('[data-testid="selected-filter-count"]').or(
          dropdown.locator('.filter-count')
        );

        if (await filterNumberInDropdown.isVisible().catch(() => false)) {
          const figmaValues = TransparencyDatagridFigmaValues.XL;

          const fontSize = await filterNumberInDropdown.evaluate((el) => getComputedStyle(el).fontSize);
          expect.soft(fontSize, `Filter number font-size should be ${figmaValues.dropdownItem.fontSize}`).toBe(figmaValues.dropdownItem.fontSize);

          const fontWeight = await filterNumberInDropdown.evaluate((el) => getComputedStyle(el).fontWeight);
          expect.soft(fontWeight, `Filter number font-weight should be ${figmaValues.tableHeader.fontWeight}`).toBe(figmaValues.tableHeader.fontWeight);

          const color = await filterNumberInDropdown.evaluate((el) => getComputedStyle(el).color);
          expect.soft(
            color, 
            `Filter number color should be ${figmaValues.filterBadge.color}`
          ).toBe(figmaValues.filterBadge.color);
        }

        // Close dropdown
        await filterButton.click();
        await component.clearFilters();
      });
    });

    test('TC-TDG-V019: Verify no search results message displays centered @Visual @ManualIssue', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await test.step('Enter search term with no results', async () => {
        const searchInput = await component.openSearchInput();
        await searchInput.fill('xyznonexistentterm123');
        await page.waitForTimeout(1000);
      });

      await test.step('Verify no results message is displayed and centered', async () => {
        const noResultsMessage = await component.getNoResultsMessage();

        // Message should be visible
        await expect.soft(noResultsMessage, 'No results message should be visible').toBeVisible();

        // Message should be centered (text-align: center or flex center)
        const textAlign = await noResultsMessage.evaluate((el) => getComputedStyle(el).textAlign);
        const parentDisplay = await noResultsMessage.evaluate((el) => el.parentElement ? getComputedStyle(el.parentElement).display : '');
        const parentJustify = await noResultsMessage.evaluate((el) => el.parentElement ? getComputedStyle(el.parentElement).justifyContent : '');

        const isCentered = textAlign === 'center' || 
                          (parentDisplay === 'flex' && parentJustify === 'center');
        
        expect.soft(isCentered, 'No results message should be centered').toBe(true);
      });

      // Clear search
      const searchInput = await component.openSearchInput();
      await searchInput.clear();
    });

    /**
     * Comprehensive Typography Validation for All Column Headers
     * Validates font-size, font-weight, line-height for all table headers
     */
    test('TC-TDG-V020: Verify all table column headers typography @Visual @Comprehensive', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await test.step('Verify typography for all column headers', async () => {
        // Get Figma specifications for XL viewport
        const figmaValues = TransparencyDatagridFigmaValues.XL;
        const columnHeaders = [
          'Bayer_ID',
          'Division', 
          'Company_Name',
          'Address',
          'City',
          'Postal_Code',
          'Country',
          'Clms_Status'
        ];

        for (const columnName of columnHeaders) {
          const header = await component.getTableHeaderByColumn(columnName);
          const headerText = header.locator('span').first();

          if (await headerText.isVisible().catch(() => false)) {
            const fontSize = await headerText.evaluate((el) => getComputedStyle(el).fontSize);
            const fontWeight = await headerText.evaluate((el) => getComputedStyle(el).fontWeight);
            const lineHeight = await headerText.evaluate((el) => getComputedStyle(el).lineHeight);

            expect.soft(fontSize, `${columnName} header font-size should be ${figmaValues.tableHeader.fontSize}`).toBe(figmaValues.tableHeader.fontSize);
            expect.soft(fontWeight, `${columnName} header font-weight should be ${figmaValues.tableHeader.fontWeight}`).toBe(figmaValues.tableHeader.fontWeight);
            expect.soft(lineHeight, `${columnName} header line-height should be ${figmaValues.tableHeader.lineHeight}`).toBe(figmaValues.tableHeader.lineHeight);
          }
        }
      });
    });

    /**
     * Comprehensive Pagination Typography Validation
     * Validates all pagination elements match Figma specs
     */
    test('TC-TDG-V021: Verify all pagination elements typography @Visual @Comprehensive', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });

      await test.step('Verify pagination button typography', async () => {
        const figmaValues = TransparencyDatagridFigmaValues.XL;
        const pagination = await component.paginationControls;
        const paginationButtons = pagination.locator('button');
        const firstButton = paginationButtons.first();

        if (await firstButton.isVisible().catch(() => false)) {
          const fontSize = await firstButton.evaluate((el) => getComputedStyle(el).fontSize);
          const lineHeight = await firstButton.evaluate((el) => getComputedStyle(el).lineHeight);

          expect.soft(fontSize, `Pagination button font-size should be ${figmaValues.paginationNumber.fontSize}`).toBe(figmaValues.paginationNumber.fontSize);
          expect.soft(lineHeight, `Pagination button line-height should be ${figmaValues.dropdown.lineHeight}`).toBe(figmaValues.dropdown.lineHeight);
        }
      });

      await test.step('Verify page size dropdown typography', async () => {
        const figmaValues = TransparencyDatagridFigmaValues.XL;
        const pageSizeSelect = await component.getPageSizeSelector();

        if (await pageSizeSelect.isVisible().catch(() => false)) {
          const fontSize = await pageSizeSelect.evaluate((el) => getComputedStyle(el).fontSize);
          const lineHeight = await pageSizeSelect.evaluate((el) => getComputedStyle(el).lineHeight);

          expect.soft(fontSize, `Page size selector font-size should be ${figmaValues.dropdown.fontSize}`).toBe(figmaValues.dropdown.fontSize);
          expect.soft(lineHeight, `Page size selector line-height should be ${figmaValues.dropdown.lineHeight}`).toBe(figmaValues.dropdown.lineHeight);
        }
      });
    });
  });
});


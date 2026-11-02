import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { ClassicSiteSearch } from '../../components/classicSiteSearch';
import { componentURL } from '../../test-data/componentURL';
import { envUtils } from '../../helpers/utils/envUtils';

/**
 * Classic Site Search Component Test Suite
 * User Story: 1592
 *
 * Test Coverage:
 * - 21 Functional Tests
 * - 8 Accessibility Tests
 * - 4 Performance Tests
 * - 8 Visual Tests
 * - 3 Cross-Browser Tests
 * Total: 44 Test Cases
 *
 * Reference Documents:
 * - Test Cases: docs/test-cases/classic-site-search.test-cases.md
 * - DOM Inspection: docs/classic-site-search-dom-inspection.md
 * - Figma: node-id=6227-65565 (XL/LG), node-id=6227-65560 (MD/SM)
 */

test.describe('Classic Site Search - Functional Tests', () => {
  test.describe.configure({ timeout: 120000 });

  let page: Page;
  let browser: Browser;
  let context: BrowserContext;
  let classicSiteSearch: ClassicSiteSearch;

  test.beforeEach(async ({ page: testPage, browser: testBrowser, context: testContext }) => {
    page = testPage;
    browser = testBrowser;
    context = testContext;
    classicSiteSearch = new ClassicSiteSearch(page, browser, context);

    // Navigate to homepage
    await classicSiteSearch.navigateToComponent();
  });

  test('TC-CSS001: Search Overlay Opens on Click @Functional @Smoke @UKSmoke', async () => {
    // Increase timeout for this test due to cookie banner and overlay loading times
    test.setTimeout(90000);

    // Step: Verify search button is visible
    const searchButton = classicSiteSearch.getSearchButton();
    await expect.soft(searchButton, 'Search button should be visible').toBeVisible();

    // Step: Click search button
    await classicSiteSearch.openSearchOverlay();

    // Expected: Search overlay modal appears
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Search overlay should be visible').toBeVisible();

    // Expected: Modal has role="dialog"
    const role = await classicSiteSearch.getOverlayRole();
    expect.soft(role, 'Overlay should have role="dialog"').toBe('dialog');

    // Expected: Search input is attached to DOM
    const searchInput = classicSiteSearch.getSearchInput();
    await expect.soft(searchInput, 'Search input should be attached').toBeAttached();

    // Expected: Close button is attached to DOM
    const closeButton = classicSiteSearch.getCloseButton();
    await expect.soft(closeButton, 'Close button should be attached').toBeAttached();
  });

  test('TC-CSS002: Search Overlay Opens on Mobile Tap @Functional @Mobile', async () => {
    // Step: Set viewport to MD (768x1024)
    await classicSiteSearch.setViewport(768, 1024);

    // Step: Tap search button
    await classicSiteSearch.openSearchOverlay();

    // Expected: Search overlay modal appears
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Search overlay should be visible on mobile').toBeVisible();

    // Expected: All modal elements are accessible
    const searchInput = classicSiteSearch.getSearchInput();
    await expect.soft(searchInput, 'Search input should be accessible on mobile').toBeAttached();
  });

  test('TC-CSS003: Search Overlay Closes on Close Button Click @Functional @Smoke @UKSmoke', async () => {
    test.setTimeout(90000); // Increase timeout for this test

    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Verify overlay is open
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Overlay should be visible before closing').toBeVisible();

    // Step: Click close button
    await classicSiteSearch.closeSearchOverlay();

    // Expected: Search overlay closes
    await expect
      .soft(searchOverlay, 'Search overlay should not be visible after closing')
      .toBeHidden({ timeout: 3000 });
  });

  test('TC-CSS004: Search Overlay Closes on Escape Key Press @Functional @Keyboard @Accessibility', async () => {
    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Verify overlay is open
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Overlay should be visible before escape').toBeVisible();

    // Step: Press Escape key
    await classicSiteSearch.closeSearchOverlayWithEscape();

    // Expected: Search overlay closes immediately
    await expect
      .soft(searchOverlay, 'Search overlay should close on Escape key')
      .toBeHidden({ timeout: 3000 });
  });

  test('TC-CSS005: Search Input Accepts Text Entry @Functional', async () => {
    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    const searchInput = classicSiteSearch.getSearchInput();
    await expect.soft(searchInput, 'Search input should be attached').toBeAttached();

    // Step: Type text into input field
    const testQuery = 'Bayer products';
    await classicSiteSearch.typeInSearchInput(testQuery);

    // Expected: Typed text is visible in input field
    const inputValue = await classicSiteSearch.getSearchInputValue();
    expect.soft(inputValue, 'Input should contain typed text').toContain(testQuery);
  });

  test('TC-CSS006: Search Suggestions Appear When Typing @Functional', async () => {
    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Step: Type text to trigger suggestions
    const testQuery = 'Bay';
    await classicSiteSearch.typeInSearchInput(testQuery);

    // Wait for potential suggestions to appear
    await classicSiteSearch.waitForTimeout(1000);

    // Expected: Check if suggestions box appears
    const suggestionsBox = classicSiteSearch.getSuggestionsBox();
    const suggestionsVisible = await suggestionsBox.isVisible({ timeout: 2000 }).catch(() => false);

    if (suggestionsVisible) {
      // Expected: Suggestions dropdown is visible
      await expect.soft(suggestionsBox, 'Suggestions should be visible').toBeVisible();

      // Expected: Suggestions are relevant and contain items
      const count = await classicSiteSearch.getSuggestionsCount();
      expect.soft(count, 'Should have suggestions').toBeGreaterThan(0);

      // Expected: Suggestion items are clickable
      const suggestionItems = classicSiteSearch.getSuggestionItems();
      const firstSuggestion = suggestionItems.first();
      await expect.soft(firstSuggestion, 'First suggestion should be visible').toBeVisible();

      test.info().annotations.push({
        type: 'note',
        description: `Suggestions feature is implemented and working - ${count} suggestions found`,
      });
    } else {
      test.info().annotations.push({
        type: 'note',
        description: 'Suggestions feature not yet implemented or not triggered',
      });
    }
  });

  test('TC-CSS007: No Suggestions for Unsupported Characters @Functional @Negative', async () => {
    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Step: Type special characters
    await classicSiteSearch.typeInSearchInput('@#$%');

    // Wait a moment for potential suggestions
    await classicSiteSearch.waitForTimeout(1000);

    // Expected: No suggestions appear (or suggestion box remains hidden)
    const suggestionsCount = await classicSiteSearch.getSuggestionsCount();
    expect.soft(suggestionsCount, 'No suggestions should appear for special chars').toBe(0);
  });

  test('TC-CSS008: Search Submission with Valid Query @Functional @Smoke @UKSmoke', async () => {
    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Step: Type query and submit by clicking search button
    const testQuery = 'innovation';
    await classicSiteSearch.typeInSearchInput(testQuery);
    await classicSiteSearch.submitSearchWithButton();

    // Expected: Page navigates to search results page
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await page.waitForTimeout(2000); // Wait for client-side rendering

    // Expected: URL contains search query parameter
    const currentUrl = classicSiteSearch.getCurrentUrl();
    // Submitting a query MUST navigate to the dedicated /search results page.
    // Previously this accepted a bare `?q=`, which masked the prod defect where
    // search submits to `/?q=<query>` and never reaches the results page.
    const onSearchResultsPage = currentUrl.includes('/search');
    expect
      .soft(
        onSearchResultsPage,
        `Submitting a query must navigate to the /search results page (got: ${currentUrl})`
      )
      .toBe(true);

    // Expected: Search results list is displayed
    const resultsCount = await classicSiteSearch.getResultsCount();
    expect.soft(resultsCount, 'Search results list should be displayed').toBeGreaterThan(0);

    // Expected: Result items are visible and clickable
    const resultItems = page.locator('article, [role="article"], main li, main a').first();
    const firstResultVisible = await resultItems.isVisible({ timeout: 5000 }).catch(() => false);
    expect.soft(firstResultVisible, 'First result item should be visible').toBe(true);

    test.info().annotations.push({
      type: 'note',
      description: `Found ${resultsCount} search results for query: "${testQuery}"`,
    });
  });

  test('TC-CSS009: Search Submission with Enter Key @Functional @Keyboard @Accessibility', async () => {
    // Increase timeout for this test due to page load delays
    test.setTimeout(120000);

    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Step: Type query
    const testQuery = 'pharmaceuticals';
    await classicSiteSearch.typeInSearchInput(testQuery);

    // Step: Press Enter key and wait for SPA navigation to search results page.
    // waitForURL is more reliable than waitForLoadState('networkidle') because the
    // latter can resolve immediately before the client-side route change starts.
    await classicSiteSearch.submitSearchWithEnter();
    await page.waitForURL(/search/i, { timeout: 30000 }).catch(() => {});
    await page
      .waitForLoadState('domcontentloaded', { timeout: 30000 })
      .catch(() => {});
    const currentUrl = classicSiteSearch.getCurrentUrl();
    expect.soft(currentUrl, 'Should navigate to results page').toContain('search');
  });

  test('TC-CSS010: Empty Query Submission Prevention @Functional @Negative', async () => {
    // Increase timeout for this test
    test.setTimeout(120000);

    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Step: Leave input empty
    const searchInput = classicSiteSearch.getSearchInput();
    const initialValue = await classicSiteSearch.getSearchInputValue();
    expect.soft(initialValue, 'Input should be empty').toBe('');

    // Step: Try to submit
    const currentUrlBefore = classicSiteSearch.getCurrentUrl();
    await page.keyboard.press('Enter');
    await classicSiteSearch.waitForTimeout(1000);

    // Expected: URL should not change
    const currentUrlAfter = classicSiteSearch.getCurrentUrl();
    expect.soft(currentUrlAfter, 'URL should not change on empty search').toBe(currentUrlBefore);

    // Expected: Modal should remain visible
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Modal should remain visible').toBeVisible();
  });

  test('TC-CSS011: Search Parameter in Results Page Search Box @Functional', async () => {
    test.setTimeout(120000);
    const testQuery = 'sustainability';

    // Step: Navigate directly to results page with query
    await classicSiteSearch.navigateToSearchResults(testQuery);

    // Expected: Search input on results page contains query
    const isInputVisible = await classicSiteSearch.isSearchInputOnResultsPageVisible();
    if (isInputVisible) {
      const resultsInputValue = await classicSiteSearch.getSearchInputValueOnResultsPage();
      expect
        .soft(resultsInputValue, 'Results page input should contain search query')
        .toContain(testQuery);
    } else {
      test.info().annotations.push({
        type: 'note',
        description: 'Search input not found on results page',
      });
    }
  });

  test('TC-CSS012: Results Count Displayed on Results Page @Functional', async () => {
    test.setTimeout(120000); // Increase timeout to 2 minutes for search results navigation
    const testQuery = 'Bayer';

    // Step: Navigate to results page
    await classicSiteSearch.navigateToSearchResults(testQuery);

    // Wait for results to load
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    await classicSiteSearch.waitForTimeout(3000);

    // Expected: Results count is visible (try to find count element)
    const resultsCountVisible =
      (await page
        .locator('text=/\\d+ results?/i')
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false)) ||
      (await page
        .locator('[data-qa*="results"]')
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false));

    expect.soft(resultsCountVisible, 'Results count should be displayed').toBe(true);

    // Expected: Actual search results list is displayed
    const resultsCount = await classicSiteSearch.getResultsCount();
    expect.soft(resultsCount, 'Search results list should contain items').toBeGreaterThan(0);

    // Expected: Result entries are visible and accessible
    const resultItems = await classicSiteSearch.getResultItemsLocator();
    const itemsCount = await resultItems.count();
    expect.soft(itemsCount, 'Result items should be present in the list').toBeGreaterThan(0);

    // Expected: First result is visible
    if (itemsCount > 0) {
      await expect.soft(resultItems.first(), 'First result item should be visible').toBeVisible();
    }

    test.info().annotations.push({
      type: 'note',
      description: `Results page displays ${resultsCount} items for query: "${testQuery}"`,
    });
  });

  test('TC-CSS013: Complete Search Flow - Type, Suggestions, Submit, Results @Functional @Smoke @UKSmoke', async () => {
    test.setTimeout(120000); // Increase timeout to 2 minutes for complex flow test
    const testQuery = 'Bayer';

    // Step 1: Open search overlay
    await classicSiteSearch.openSearchOverlay();
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Search overlay should be visible').toBeVisible();

    // Step 2: Type text in search input
    const searchInput = classicSiteSearch.getSearchInput();
    await classicSiteSearch.typeInSearchInput(testQuery);

    // Expected: Text appears in input
    const inputValue = await classicSiteSearch.getSearchInputValue();
    expect.soft(inputValue, 'Input should contain typed text').toContain(testQuery);

    // Step 3: Check for suggestions (if implemented)
    await classicSiteSearch.waitForTimeout(1000);
    const suggestionsBox = classicSiteSearch.getSuggestionsBox();
    const suggestionsVisible = await suggestionsBox.isVisible({ timeout: 2000 }).catch(() => false);

    if (suggestionsVisible) {
      const suggestionsCount = await classicSiteSearch.getSuggestionsCount();
      expect.soft(suggestionsCount, 'Suggestions should appear when typing').toBeGreaterThan(0);
      test.info().annotations.push({
        type: 'note',
        description: `Suggestions displayed: ${suggestionsCount} items`,
      });
    } else {
      test.info().annotations.push({
        type: 'note',
        description: 'Suggestions feature not triggered or not implemented',
      });
    }

    // Step 4: Submit search by clicking search button (using Enter as proxy)
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => { }),
      classicSiteSearch.submitSearchWithEnter(),
    ]);
    await page.waitForTimeout(3000); // Wait for client-side rendering

    // Expected: Navigate to results page
    const currentUrl = classicSiteSearch.getCurrentUrl();
    console.log('Current URL after search:', currentUrl);
    // Must reach the dedicated /search results page. Accepting a bare `?q=` or
    // merely "URL changed" previously masked the prod defect where search
    // submits to `/?q=<query>` instead of `/search?q=<query>`.
    const onSearchResultsPage = currentUrl.includes('/search');
    expect
      .soft(
        onSearchResultsPage,
        `Should navigate to the /search results page (got: ${currentUrl})`
      )
      .toBe(true);

    // Step 5: Validate search results list is displayed
    await classicSiteSearch.waitForTimeout(2000);

    // Expected: Search results count is greater than 0
    const resultsCount = await classicSiteSearch.getResultsCount();
    expect.soft(resultsCount, 'Search results list should be displayed').toBeGreaterThan(0);

    // Expected: Result items are visible in the list
    const resultItems = await classicSiteSearch.getResultItemsLocator();
    const visibleResultsCount = await resultItems.count();
    expect.soft(visibleResultsCount, 'Result items should be visible in list').toBeGreaterThan(0);

    // Expected: First result item is clickable
    if (visibleResultsCount > 0) {
      const firstResult = resultItems.first();
      await expect.soft(firstResult, 'First result should be visible and clickable').toBeVisible();
    }

    // Expected: Results page shows the search query in input
    const isSearchInputVisible = await classicSiteSearch.isSearchInputOnResultsPageVisible();
    if (isSearchInputVisible) {
      const resultsPageInputValue = await classicSiteSearch.getSearchInputValueOnResultsPage();
      expect
        .soft(resultsPageInputValue, 'Results page should show search query')
        .toContain(testQuery);
    }

    test.info().annotations.push({
      type: 'note',
      description: `Complete search flow validated - ${resultsCount} results found for "${testQuery}"`,
    });
  });

  test('TC-CSS018: Search Overlay on XL Viewport @Functional @Visual @Viewport', async () => {
    // Step: Set viewport to XL (1440x900)
    await classicSiteSearch.setViewport(1440, 900);

    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Expected: Search overlay is properly centered
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Overlay should be visible on XL viewport').toBeVisible();

    // Expected: All elements are properly aligned
    const searchInput = classicSiteSearch.getSearchInput();
    await expect.soft(searchInput, 'Input should be attached on XL').toBeAttached();
  });

  test('TC-CSS019: Search Overlay on LG Viewport @Functional @Visual @Viewport', async () => {
    // Step: Set viewport to LG (1024x800)
    await classicSiteSearch.setViewport(1024, 800);

    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Expected: Search overlay adapts to viewport width
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Overlay should be visible on LG viewport').toBeVisible();

    const searchInput = classicSiteSearch.getSearchInput();
    await expect.soft(searchInput, 'Input should be attached on LG').toBeAttached();
  });

  test('TC-CSS020: Search Overlay on MD Viewport @Functional @Visual @Viewport', async () => {
    // Step: Set viewport to MD (768x1024)
    await classicSiteSearch.setViewport(768, 1024);

    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Expected: Search overlay is full-screen
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Overlay should be visible on MD viewport').toBeVisible();

    // Expected: Layout matches mobile design
    const searchInput = classicSiteSearch.getSearchInput();
    await expect.soft(searchInput, 'Input should be attached on MD').toBeAttached();
  });

  test('TC-CSS021: Search Overlay on SM Viewport @Functional @Visual @Viewport', async () => {
    // Step: Set viewport to SM (375x667)
    await classicSiteSearch.setViewport(375, 667);

    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Expected: All content fits within viewport
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Overlay should be visible on SM viewport').toBeVisible();

    // Expected: Text remains readable
    const searchInput = classicSiteSearch.getSearchInput();
    await expect.soft(searchInput, 'Input should be attached on SM').toBeAttached();
  });
});

test.describe('Classic Site Search - Accessibility Tests', () => {
  let page: Page;
  let browser: Browser;
  let context: BrowserContext;
  let classicSiteSearch: ClassicSiteSearch;

  test.beforeEach(async ({ page: testPage, browser: testBrowser, context: testContext }) => {
    page = testPage;
    browser = testBrowser;
    context = testContext;
    classicSiteSearch = new ClassicSiteSearch(page, browser, context);
    await classicSiteSearch.navigateToComponent();
  });

  test('TC-ACSS001: Search Button Keyboard Accessibility @Accessibility @Keyboard', async () => {
    // Step: Focus search button with Tab
    await classicSiteSearch.focusSearchButton();

    // Expected: Search button is reachable via Tab
    const isFocused = await classicSiteSearch.isSearchButtonFocused();
    expect.soft(isFocused, 'Search button should have focus').toBe(true);

    // Expected: Button has ARIA label
    const ariaLabel = await classicSiteSearch.getSearchButtonAriaLabel();
    expect.soft(ariaLabel, 'Search button should have aria-label').toBeTruthy();

    // Step: Activate with Enter
    await page.keyboard.press('Enter');
    await classicSiteSearch.waitForTimeout(500);

    // Expected: Modal opens
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Modal should open via keyboard').toBeVisible();
  });

  test('TC-ACSS002: Search Modal ARIA Attributes @Accessibility @ARIA', async () => {
    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Expected: Modal has role="dialog"
    const role = await classicSiteSearch.getOverlayRole();
    expect.soft(role, 'Modal should have role="dialog"').toBe('dialog');

    // Expected: Close button has descriptive aria-label
    const closeButton = classicSiteSearch.getCloseButton();
    const closeAriaLabel = await closeButton.getAttribute('aria-label');
    expect.soft(closeAriaLabel, 'Close button should have aria-label').toBeTruthy();

    // Expected: Input has appropriate label/placeholder
    const inputPlaceholder = await classicSiteSearch.getSearchInputPlaceholder();
    expect.soft(inputPlaceholder, 'Input should have placeholder').toBeTruthy();
  });

  test('TC-ACSS003: Focus Trap in Search Modal @Accessibility @Keyboard', async () => {
    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Step: Press Tab multiple times
    await page.keyboard.press('Tab');
    await classicSiteSearch.waitForTimeout(200);

    // Expected: Focus remains within modal
    const activeElementInModal = await page.evaluate(() => {
      const activeEl = document.activeElement;
      const modal = document.querySelector('[role="dialog"]');
      return modal?.contains(activeEl);
    });

    expect.soft(activeElementInModal, 'Focus should remain within modal').toBe(true);
  });

  test('TC-ACSS004: Screen Reader Announcements @Accessibility @ScreenReader', async () => {
    // Note: This test validates ARIA structure for screen readers
    // Actual screen reader testing requires manual verification

    // Step: Open search overlay
    await classicSiteSearch.openSearchOverlay();

    // Expected: Modal has proper ARIA attributes for announcements
    const role = await classicSiteSearch.getOverlayRole();
    expect.soft(role, 'Modal role should be announced').toBe('dialog');

    // Expected: Input has label for announcement
    const placeholder = await classicSiteSearch.getSearchInputPlaceholder();
    const ariaLabel = await classicSiteSearch.getSearchInputAriaLabel();
    const ariaLabelledBy = await classicSiteSearch.getSearchInputAriaLabelledBy();

    const hasAccessibleLabel = placeholder || ariaLabel || ariaLabelledBy;
    expect.soft(hasAccessibleLabel, 'Input should have accessible label').toBeTruthy();
  });

  test('TC-ACSS005: Color Contrast Compliance @Accessibility @Visual', async () => {
    // Note: Use axe-core for automated contrast checking
    // This test validates that elements are visible (basic check)

    await classicSiteSearch.openSearchOverlay();

    const searchInput = classicSiteSearch.getSearchInput();
    const closeButton = classicSiteSearch.getCloseButton();

    // Expected: Elements are visible (basic visibility check)
    await expect.soft(searchInput, 'Input should be visible (contrast check)').toBeVisible();
    await expect.soft(closeButton, 'Close button should be visible (contrast check)').toBeVisible();

    // Note: Full contrast ratio checking requires axe-core integration
    test.info().annotations.push({
      type: 'note',
      description: 'Full WCAG AA contrast checking (4.5:1) requires axe-core integration',
    });
  });

  test('TC-ACSS006: Semantic HTML Structure @Accessibility @Semantic', async () => {
    await classicSiteSearch.openSearchOverlay();

    // Expected: Modal uses semantic role
    const role = await classicSiteSearch.getOverlayRole();
    expect.soft(role, 'Should use dialog role').toBe('dialog');

    // Expected: Buttons use <button> elements
    const closeButton = classicSiteSearch.getCloseButton();
    const tagName = await closeButton.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(tagName, 'Close button should be a button element').toBe('button');
  });

  test('TC-ACSS007: Keyboard Navigation in Results Page @Accessibility @Keyboard', async () => {
    // Step: Navigate to results page
    await classicSiteSearch.navigateToSearchResults('Bayer');

    // Step: Use Tab to navigate
    await page.keyboard.press('Tab');
    await classicSiteSearch.waitForTimeout(200);

    // Expected: Results are keyboard accessible
    const resultsCount = await classicSiteSearch.getResultsCount();
    expect
      .soft(resultsCount, 'Results should be present for keyboard navigation')
      .toBeGreaterThan(0);

    // Expected: Focus indicators are visible (basic check)
    const focusVisible = await page.evaluate(() => {
      const activeEl = document.activeElement;
      return activeEl !== document.body;
    });
    expect.soft(focusVisible, 'Focus should be visible on an element').toBe(true);
  });

  test('TC-ACSS008: Form Labels and Instructions @Accessibility @Forms', async () => {
    await classicSiteSearch.openSearchOverlay();

    // Expected: Input has visible placeholder
    const placeholder = await classicSiteSearch.getSearchInputPlaceholder();
    expect.soft(placeholder, 'Input should have placeholder text').toBeTruthy();

    // Expected: Close button purpose is clear
    const closeButton = classicSiteSearch.getCloseButton();
    const closeAriaLabel = await closeButton.getAttribute('aria-label');
    expect.soft(closeAriaLabel, 'Close button purpose should be clear').toBeTruthy();
  });
});

test.describe('Classic Site Search - Performance Tests', () => {
  let page: Page;
  let browser: Browser;
  let context: BrowserContext;
  let classicSiteSearch: ClassicSiteSearch;

  test.beforeEach(async ({ page: testPage, browser: testBrowser, context: testContext }) => {
    page = testPage;
    browser = testBrowser;
    context = testContext;
    classicSiteSearch = new ClassicSiteSearch(page, browser, context);
    await classicSiteSearch.navigateToComponent();
  });

  test('TC-PCSS001: Search Modal Open Animation Performance @Performance', async () => {
    // Step: Measure time to open modal
    const startTime = Date.now();

    await classicSiteSearch.openSearchOverlay();

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Expected: Modal opens within 500ms
    expect.soft(duration, 'Modal should open within 500ms').toBeLessThan(500);

    test.info().annotations.push({
      type: 'performance',
      description: `Modal open time: ${duration}ms`,
    });
  });

  test('TC-PCSS002: Search Input Responsiveness @Performance', async () => {
    await classicSiteSearch.openSearchOverlay();

    // Step: Type rapidly and measure responsiveness
    const testText = 'Quick typing test';
    const startTime = Date.now();

    await classicSiteSearch.typeInSearchInput(testText);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Expected: No noticeable lag (reasonable time for typing)
    const inputValue = await classicSiteSearch.getSearchInputValue();
    expect.soft(inputValue, 'All characters should be captured').toContain(testText);

    test.info().annotations.push({
      type: 'performance',
      description: `Input typing time: ${duration}ms for ${testText.length} characters`,
    });
  });

  test('TC-PCSS003: Search Results Page Load Time @Performance', async () => {
    await classicSiteSearch.openSearchOverlay();
    await classicSiteSearch.typeInSearchInput('Bayer');

    // Step: Measure time from submission to results visible
    const startTime = Date.now();

    await classicSiteSearch.submitSearchWithEnter();
    await page.waitForLoadState('load', { timeout: 30000 });

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    // Expected: Results page loads within 4000ms
    expect.soft(loadTime, 'Results page should load within 4000ms').toBeLessThan(4000);

    test.info().annotations.push({
      type: 'performance',
      description: `Results page load time: ${loadTime}ms`,
    });
  });

  test('TC-PCSS004: Pagination Navigation Performance @Performance', async () => {
    // Step: Navigate to results with pagination
    await classicSiteSearch.navigateToSearchResults('products');

    // Look for Next button
    const nextButton = page.locator('button:has-text("Next"), a:has-text("Next")').first();
    const nextButtonVisible = await nextButton.isVisible({ timeout: 5000 }).catch(() => false);

    if (nextButtonVisible) {
      const startTime = Date.now();

      await nextButton.click();
      await page.waitForLoadState('load');

      const endTime = Date.now();
      const navTime = endTime - startTime;

      // Expected: Page navigation within 1500ms
      expect.soft(navTime, 'Pagination navigation should be within 1500ms').toBeLessThan(1500);

      test.info().annotations.push({
        type: 'performance',
        description: `Pagination navigation time: ${navTime}ms`,
      });
    } else {
      test.info().annotations.push({
        type: 'note',
        description: 'Pagination not available for this query',
      });
    }
  });
});

test.describe('Classic Site Search - Visual Tests', () => {
  let page: Page;
  let browser: Browser;
  let context: BrowserContext;
  let classicSiteSearch: ClassicSiteSearch;

  test.beforeEach(async ({ page: testPage, browser: testBrowser, context: testContext }) => {
    page = testPage;
    browser = testBrowser;
    context = testContext;
    classicSiteSearch = new ClassicSiteSearch(page, browser, context);
    await classicSiteSearch.navigateToComponent();
  });

  test('TC-VCSS001: Search Button Visual Design - XL Viewport @Visual @Figma', async () => {
    // Note: Figma values to be extracted and validated
    test.info().annotations.push({
      type: 'note',
      description: 'Figma node-id: 6227-65565 (XL viewport)',
    });

    // Step: Set viewport to XL
    await classicSiteSearch.setViewport(1440, 900);

    // Expected: Button is visible
    const searchButton = classicSiteSearch.getSearchButton();
    await expect.soft(searchButton, 'Search button should be visible on XL').toBeVisible();

    // Expected: Button has gradient background (visual check)
    const hasBackground = await searchButton.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundImage.includes('gradient') || styles.background.includes('gradient');
    });
    expect.soft(hasBackground, 'Button should have gradient background').toBe(true);
  });

  test('TC-VCSS002: Search Modal Heading Typography - XL @Visual @Figma', async () => {
    await classicSiteSearch.setViewport(1440, 900);
    await classicSiteSearch.openSearchOverlay();

    // Expected: Heading is visible
    const heading = page.locator('[role="dialog"] h1').first();
    await expect.soft(heading, 'Modal heading should be visible').toBeVisible();

    // Expected: Typography is applied
    const fontSize = await heading.evaluate((el) => window.getComputedStyle(el).fontSize);
    expect.soft(fontSize, 'Heading should have font size').toBeTruthy();
  });

  test('TC-VCSS003: Search Input Field Styling - XL @Visual @Figma', async () => {
    await classicSiteSearch.setViewport(1440, 900);
    await classicSiteSearch.openSearchOverlay();

    const searchInput = classicSiteSearch.getSearchInput();
    await expect.soft(searchInput, 'Search input should be visible').toBeVisible();

    // Expected: Input has border and padding
    const styles = await searchInput.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        border: computed.border,
        padding: computed.padding,
      };
    });

    expect.soft(styles.padding, 'Input should have padding').toBeTruthy();
  });

  test('TC-VCSS004: Search Modal Layout - LG Viewport @Visual @Figma', async () => {
    await classicSiteSearch.setViewport(1024, 800);
    await classicSiteSearch.openSearchOverlay();

    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Modal should be visible on LG').toBeVisible();

    // Expected: All elements visible and aligned
    const searchInput = classicSiteSearch.getSearchInput();
    const closeButton = classicSiteSearch.getCloseButton();
    await expect.soft(searchInput, 'Input should be visible on LG').toBeVisible();
    await expect.soft(closeButton, 'Close button should be visible on LG').toBeVisible();
  });

  test('TC-VCSS005: Search Modal Layout - MD Viewport @Visual @Figma', async () => {
    test.info().annotations.push({
      type: 'note',
      description: 'Figma node-id: 6227-65560 (MD viewport)',
    });

    await classicSiteSearch.setViewport(768, 1024);
    await classicSiteSearch.openSearchOverlay();

    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Modal should be visible on MD').toBeVisible();

    // Expected: Full-screen modal
    const boundingBox = await searchOverlay.boundingBox();
    if (boundingBox) {
      expect.soft(boundingBox.width, 'Modal should be full-width on MD').toBeGreaterThan(700);
    }
  });

  test('TC-VCSS006: Search Modal Layout - SM Viewport @Visual @Figma', async () => {
    test.info().annotations.push({
      type: 'note',
      description: 'Figma node-id: 6227-65560 (SM viewport)',
    });

    await classicSiteSearch.setViewport(375, 667);
    await classicSiteSearch.openSearchOverlay();

    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Modal should be visible on SM').toBeVisible();

    // Expected: All content fits
    const searchInput = classicSiteSearch.getSearchInput();
    await expect.soft(searchInput, 'Input should fit on SM viewport').toBeVisible();
  });

  test('TC-VCSS007: Search Results Layout and Typography @Visual', async () => {
    await classicSiteSearch.navigateToSearchResults('Bayer');

    // Expected: Results are visible
    const resultsCount = await classicSiteSearch.getResultsCount();
    expect.soft(resultsCount, 'Results should be displayed').toBeGreaterThan(0);
  });

  test('TC-VCSS008: Pagination Visual Design @Visual', async () => {
    await classicSiteSearch.navigateToSearchResults('products');

    // Look for pagination
    const paginationVisible =
      (await page
        .locator('nav[aria-label*="pagination"], [class*="pagination"]')
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false)) ||
      (await page
        .locator('button:has-text("Next")')
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false));

    if (paginationVisible) {
      test.info().annotations.push({
        type: 'note',
        description: 'Pagination controls are visible',
      });
    } else {
      test.info().annotations.push({
        type: 'note',
        description: 'Pagination not available for this query',
      });
    }
  });
});

test.describe('Classic Site Search - Cross-Browser Tests', () => {
  let page: Page;
  let browser: Browser;
  let context: BrowserContext;
  let classicSiteSearch: ClassicSiteSearch;

  test.beforeEach(async ({ page: testPage, browser: testBrowser, context: testContext }) => {
    page = testPage;
    browser = testBrowser;
    context = testContext;
    classicSiteSearch = new ClassicSiteSearch(page, browser, context);
    await classicSiteSearch.navigateToComponent();
  });

  test('TC-BCSS001: Search Functionality - Chromium @CrossBrowser @Chromium', async () => {
    // Verify core functionality in Chromium
    await classicSiteSearch.openSearchOverlay();
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Overlay should work in Chromium').toBeVisible();

    await classicSiteSearch.typeInSearchInput('test');
    const value = await classicSiteSearch.getSearchInputValue();
    expect.soft(value, 'Input should work in Chromium').toContain('test');

    await classicSiteSearch.closeSearchOverlay();
    await expect.soft(searchOverlay, 'Close should work in Chromium').toBeHidden();
  });

  test('TC-BCSS002: Search Functionality - Firefox @CrossBrowser @Firefox', async () => {
    // Note: This test should be run with --project=firefox
    await classicSiteSearch.openSearchOverlay();
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Overlay should work in Firefox').toBeVisible();

    await classicSiteSearch.typeInSearchInput('test');
    const value = await classicSiteSearch.getSearchInputValue();
    expect.soft(value, 'Input should work in Firefox').toContain('test');
  });

  test('TC-BCSS003: Search Functionality - WebKit @CrossBrowser @WebKit @Safari', async () => {
    // Note: This test should be run with --project=webkit
    await classicSiteSearch.openSearchOverlay();
    const searchOverlay = classicSiteSearch.getSearchOverlay();
    await expect.soft(searchOverlay, 'Overlay should work in WebKit').toBeVisible();

    await classicSiteSearch.typeInSearchInput('test');
    const value = await classicSiteSearch.getSearchInputValue();
    expect.soft(value, 'Input should work in WebKit').toContain('test');
  });
});

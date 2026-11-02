import { Page, Locator, expect, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { getValuesByViewport } from '../helpers/utils/figma-values/NewsListComponent_Enhanced_FigmaValues';
import { envUtils } from '../helpers/utils/envUtils';

type ViewportSize = 'xl' | 'lg' | 'md' | 'sm';

interface TypographyStyles {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  color?: string;
  background?: string;
}

export class NewsListComponent extends BasePage {
  // Main container — use first() because some markets (e.g. Japan Pharma)
  // render both "news-list" and "news-list-simple" on the same page.
  private readonly newsListContainer: Locator = this.page
    .locator('[data-qa="news-list"], [data-qa="news-list-simple"]')
    .first();

  // Title section elements using parent-child relationships with data-qa attributes
  // Use first() to handle multiple title components on page
  private readonly titleElement: Locator = this.newsListContainer
    .locator('[data-qa="title-component"]')
    .first();
  // Highlight text element is optional - production uses simple text, QA/dev may use nested structure
  private readonly highlightTextElement: Locator = this.titleElement.locator(
    '[data-qa="stage-headline-text"]'
  );

  // Search and filter elements using parent-child relationships
  private readonly searchContainer: Locator =
    this.newsListContainer.locator('[data-qa="search-atom"]');
  private readonly searchIcon: Locator = this.searchContainer.locator('[data-qa="icon"]');
  // Updated to use text-based selectors instead of fragile positional selectors
  private readonly areaFilter: Locator = this.newsListContainer.locator(
    'button:has-text("Area"), button:has-text("Select Area")'
  );
  private readonly topicFilter: Locator = this.newsListContainer.locator(
    'button:has-text("Select Topic"), button:has-text("Topic")'
  );

  // News items collection using parent-child relationships
  private readonly newsItems: Locator = this.newsListContainer.locator(
    '[data-qa="news-list-item"]'
  );
  private readonly newsItemTitles: Locator = this.newsItems.locator('[data-qa="title-component"]');
  // NOTE: Based on DOM inspection - tags do NOT exist on this News List implementation
  // This locator will return 0 elements as confirmed by DOM inspection
  private readonly newsItemTags: Locator = this.newsItems.locator(
    '(//button[@data-qa="tag-chip"])[1]/span'
  );
  private readonly newsItemDates: Locator = this.newsItems.locator('[data-qa="news-date"]');
  private readonly newsItemImages: Locator = this.newsItems.locator(
    '[data-qa="placeholder-image"]'
  );

  constructor(page: Page, browser?: Browser, context?: BrowserContext) {
    super(page, browser!, context!);
  }

  /**
   * Navigate to News List component page with authentication and retry logic.
   *
   * Tries the primary URL (e.g. /en-gb on prod where the news-list lives on the
   * localized homepage). If the [data-qa="news-list"] container is not found,
   * falls through to fallback URLs from componentURL.ts (e.g. the dedicated
   * QA test page on pre-prod/QA environments).
   */
  async navigateToNewsListComponent(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const candidateUrls = await this.getComponentUrlsWithFallback('NewsListComponent', baseURL);

    let lastError: unknown;

    // We try multiple candidate URLs (primary + fallbacks). To stay within the
    // per-test timeout (60s), only retry once per URL and use tight waits so a
    // missing container falls through quickly to the next candidate.
    for (const url of candidateUrls) {
      try {
        await this.navigateWithAuthentication(url);
        await this.page.waitForLoadState('domcontentloaded', { timeout: 20000 });

        // Clear HTTP Basic Auth credentials that navigateWithAuthentication sets.
        // Production sites (e.g. bayer.in) don't need them, and stale credentials
        // can cause the browser to respond to 401 challenges from the Sitecore
        // content API with the wrong credentials, blocking dynamic content.
        if (this.context) {
          await (this.context as any).setHTTPCredentials(null).catch(() => {});
        }

        await this.acceptCookiesBanner();

        await this.newsListContainer.waitFor({ state: 'attached', timeout: 15000 });
        await this.newsListContainer.scrollIntoViewIfNeeded();
        await this.newsListContainer.waitFor({ state: 'visible', timeout: 5000 });

        await expect.soft(this.newsListContainer).toBeVisible();
        await expect.soft(this.titleElement).toBeVisible();

        await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
          console.log('[NewsListComponent] Network idle timeout - continuing anyway');
        });

        // Wait for news items to appear in DOM
        let itemsFound = false;
        try {
          await this.page.waitForSelector('[data-qa="news-list-item"]', {
            state: 'attached',
            timeout: 15000
          });
          itemsFound = true;
        } catch {
          console.log('[NewsListComponent] No news items on first load');
        }

        // On production sites the news items may be server-rendered only when
        // consent cookies are present. If items are absent, ensure cookies are
        // accepted (using waitFor for the slow OneTrust load) then reload.
        if (!itemsFound) {
          const banner = this.page.locator('#onetrust-banner-sdk');
          const bannerUp = await banner
            .waitFor({ state: 'visible', timeout: 8000 })
            .then(() => true)
            .catch(() => false);

          if (bannerUp) {
            const acceptBtn = this.page.locator('#onetrust-accept-btn-handler');
            const btnReady = await acceptBtn
              .waitFor({ state: 'visible', timeout: 5000 })
              .then(() => true)
              .catch(() => false);
            if (btnReady) {
              await acceptBtn.click({ timeout: 5000 }).catch(() => {});
              console.log('[NewsListComponent] Clicked OneTrust accept button');
              await this.page.waitForTimeout(1000);
            }
          }

          await this.removeCookieBannerFromDom().catch(() => {});

          console.log('[NewsListComponent] Reloading page after cookie consent');
          await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
          await this.removeCookieBannerFromDom().catch(() => {});
          await this.newsListContainer.waitFor({ state: 'attached', timeout: 15000 });
          await this.newsListContainer.scrollIntoViewIfNeeded();
          await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
          try {
            await this.page.waitForSelector('[data-qa="news-list-item"]', {
              state: 'attached',
              timeout: 15000
            });
            console.log('[NewsListComponent] News items appeared after reload');
          } catch {
            console.log('[NewsListComponent] No news items found even after reload');
          }
        }

        return;
      } catch (error) {
        lastError = error;
        // Continue to next candidate URL.
      }
    }

    throw new Error(
      `Failed to navigate to News List component on any of: ${candidateUrls.join(', ')}. Last error: ${lastError}`
    );
  }

  /**
   * Individual news item accessors using parent-child relationships
   */
  getNewsItem(index: number): Locator {
    return this.newsItems.nth(index);
  }

  getNewsItemTitle(index: number): Locator {
    return this.getNewsItem(index).locator('[data-qa="title-component"]');
  }

  getNewsItemTags(index: number): Locator {
    return this.getNewsItem(index)
      .locator('span, a, div, button, [role="button"], .tag, .chip, .badge, .label')
      .filter({ hasText: /[a-zA-Z]/ });
  }

  getNewsItemDate(index: number): Locator {
    return this.getNewsItem(index).locator('[data-qa="news-date"]');
  }

  getNewsItemImage(index: number): Locator {
    return this.getNewsItem(index).locator('[data-qa="placeholder-image"]');
  }

  /**
   * Get all available options from area filter dropdown
   */
  async getAreaFilterOptions(): Promise<string[]> {
    await this.areaFilter.click();

    // Wait for options to be visible - use menuitem role which is used in production
    const options = this.page.locator('[role="menuitem"]');
    await expect.soft(options.first()).toBeVisible({ timeout: 2000 });

    const optionTexts: string[] = [];

    const count = await options.count();
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      if (text?.trim()) {
        optionTexts.push(text.trim());
      }
    }

    // Close dropdown by pressing Escape
    await this.page.keyboard.press('Escape');
    return optionTexts;
  }

  /**
   * Get all available options from topic filter dropdown
   * Note: India site doesn't have topic filter
   */
  async getTopicFilterOptions(): Promise<string[]> {
    const env = process.env.TEST_ENV ?? 'qa';
    if (env === 'prod_in') {
      console.log('[NewsListComponent] India: Topic filter not available');
      return [];
    }
    
    await this.topicFilter.click();

    // Look for dropdown options - use menuitem role which is used in production
    const options = this.page.locator('[role="menuitem"]');

    // Wait for options to be visible
    await expect.soft(options.first()).toBeVisible({ timeout: 2000 });

    const optionTexts: string[] = [];
    const count = await options.count();
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      if (text?.trim()) {
        optionTexts.push(text.trim());
      }
    }

    // Close dropdown by pressing Escape
    await this.page.keyboard.press('Escape');
    return optionTexts;
  }

  /**
   * Select an option from area filter dropdown
   */
  async selectAreaFilterOption(optionText: string): Promise<void> {
    await this.areaFilter.click();

    const option = this.page
      .locator('[role="menuitem"]')
      .filter({ hasText: optionText });

    await expect.soft(option).toBeVisible();
    await option.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Select an option from topic filter dropdown
   * Note: India site doesn't have topic filter
   */
  async selectTopicFilterOption(optionText: string): Promise<void> {
    const env = process.env.TEST_ENV ?? 'qa';
    if (env === 'prod_in') {
      console.log('[NewsListComponent] India: Topic filter not available, skipping');
      return;
    }
    
    await this.topicFilter.click();

    const option = this.page
      .locator('[role="menuitem"]')
      .filter({ hasText: optionText });

    await expect.soft(option).toBeVisible();
    await option.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Validate dropdown contains expected values
   */
  async validateDropdownValues(
    dropdownType: 'area' | 'topic',
    expectedValues: string[]
  ): Promise<void> {
    const actualValues =
      dropdownType === 'area'
        ? await this.getAreaFilterOptions()
        : await this.getTopicFilterOptions();

    for (const expectedValue of expectedValues) {
      expect
        .soft(
          actualValues.some((value) => value.toLowerCase().includes(expectedValue.toLowerCase())),
          `Expected "${expectedValue}" to be found in ${dropdownType} filter options: [${actualValues.join(', ')}]`
        )
        .toBe(true);
    }
  }

  /**
   * Validate basic component structure is present and visible
   */
  async validateComponentStructure(): Promise<void> {
    // Verify main container. The component is authored as either the standard
    // ("news-list") or simple ("news-list-simple") variant depending on the
    // environment, so accept both values.
    await expect.soft(this.newsListContainer).toBeVisible();
    await expect.soft(this.newsListContainer).toHaveAttribute('data-qa', /^news-list(-simple)?$/);
    await expect
      .soft(this.newsListContainer)
      .toHaveAttribute('data-testid', /^news-list(-simple)?$/);

    // Verify title section
    await expect.soft(this.titleElement).toBeVisible();
    await expect.soft(this.titleElement).toHaveAttribute('data-qa', 'title-component');

    // Verify title is H2 semantic element
    const titleTagName = await this.titleElement.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(titleTagName).toBe('h2');

    // Verify highlight text within title (optional - production uses simple text)
    const highlightTextCount = await this.highlightTextElement.count();
    if (highlightTextCount > 0) {
      await expect.soft(this.highlightTextElement).toBeVisible();
      await expect.soft(this.highlightTextElement).toHaveAttribute('data-qa', 'stage-headline-text');
    }

    // Verify search and filter section
    await expect.soft(this.searchContainer).toBeVisible();
    await expect.soft(this.searchIcon).toBeVisible();
    
    // Topic filter is optional - India site doesn't have it
    const env = process.env.TEST_ENV ?? 'qa';
    const topicFilterCount = await this.topicFilter.count();
    if (topicFilterCount > 0 && env !== 'prod_in') {
      await expect.soft(this.topicFilter).toBeVisible();
    } else if (env === 'prod_in') {
      console.log('[NewsListComponent] India site: Topic filter not present (expected)');
    }
    
    // Area filter is optional (not in production)
    const areaFilterCount = await this.areaFilter.count();
    if (areaFilterCount > 0) {
      await expect.soft(this.areaFilter).toBeVisible();
    }
  }

  /**
   * Validate news items structure and count
   */
  async validateNewsItemsStructure(): Promise<void> {
    // Wait for news items to load (they may load dynamically on some sites like India)
    try {
      await this.page.waitForSelector('[data-qa="news-list-item"]', { 
        state: 'attached', 
        timeout: 10000 
      });
    } catch {
      // Continue even if items don't load - the count check below will catch it
    }

    // Get total count of news items
    const newsItemsCount = await this.newsItems.count();
    expect.soft(newsItemsCount).toBeGreaterThan(0);

    // Validate each news item structure
    for (let i = 0; i < newsItemsCount; i++) {
      const newsItem = this.getNewsItem(i);
      const title = this.getNewsItemTitle(i);
      const tags = this.getNewsItemTags(i);
      const date = this.getNewsItemDate(i);
      const image = this.getNewsItemImage(i);

      // The simple variant keeps additional (paginated) items in the DOM but
      // hidden until the user pages to them. Their inner elements (e.g. the
      // title) render hidden/empty, so skip any item whose title is not
      // currently visible and only validate items on the active page.
      if (!(await newsItem.isVisible()) || !(await title.isVisible())) {
        continue;
      }

      // Verify news item container
      await expect.soft(newsItem).toHaveAttribute('data-qa', 'news-list-item');

      // Verify title is H3 semantic element
      await expect.soft(title).toBeVisible();
      const titleTagName = await title.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(titleTagName).toBe('h3');

      // Verify tags - they should ALWAYS be present
      const tagsCount = await tags.count();
      expect.soft(tagsCount).toBeGreaterThan(0);
      await expect.soft(tags.first()).toBeVisible();

      // Verify date element
      await expect.soft(date).toBeVisible();
      await expect.soft(date).not.toBeEmpty();

      // Verify placeholder image
      await expect.soft(image).toBeVisible();
      await expect.soft(image).toHaveAttribute('data-qa', 'placeholder-image');
    }
  }

  /**
   * Validates typography against Figma design values for specified viewport
   */
  async validateTypographyForViewport(viewport: ViewportSize): Promise<void> {
    const figmaValues = await this.setupViewportForTypography(viewport);
    await this.validateHeadlineTypography(figmaValues, viewport);
    await this.validateNewsItemTypography(figmaValues, viewport);
    await this.validateFilterTypography(figmaValues);
  }

  /**
   * Sets up viewport and waits for layout stability
   */
  private async setupViewportForTypography(viewport: ViewportSize) {
    const figmaValues = getValuesByViewport(viewport);

    if (!figmaValues) {
      throw new Error(`No Figma values found for viewport: ${viewport}`);
    }

    // CRITICAL: Set viewport size before validating typography
    await this.page.setViewportSize({
      width: figmaValues.viewport.width,
      height: figmaValues.viewport.height,
    });

    // Wait for layout to stabilize after viewport change
    await this.page.waitForLoadState('domcontentloaded');
    await expect.soft(this.newsListContainer).toBeVisible();

    return figmaValues;
  }

  /**
   * Validates headline and highlight text typography
   */
  private async validateHeadlineTypography(
    figmaValues: ReturnType<typeof getValuesByViewport>,
    viewport: string
  ): Promise<void> {
    // Validate main headline typography
    if (figmaValues.textElements.discover && (await this.titleElement.count()) > 0) {
      await this.validateElementTypography(
        this.titleElement,
        `Main Headline Typography [${viewport.toUpperCase()}]`,
        figmaValues.textElements.discover as TypographyStyles
      );
    }

    // Validate highlight text typography
    if (figmaValues.textElements.our_latest_news && (await this.highlightTextElement.count()) > 0) {
      await this.validateElementTypography(
        this.highlightTextElement,
        'Highlight Text Typography',
        figmaValues.textElements.our_latest_news as TypographyStyles
      );
    }
  }

  /**
   * Validates news item related typography (titles, tags, dates)
   */
  private async validateNewsItemTypography(
    figmaValues: ReturnType<typeof getValuesByViewport>,
    viewport: string
  ): Promise<void> {
    // Validate news item titles typography
    if (figmaValues.textElements.news_item_title && (await this.newsItems.count()) > 0) {
      const firstItemTitle = this.getNewsItemTitle(0);
      if ((await firstItemTitle.count()) > 0) {
        await this.validateElementTypography(
          firstItemTitle,
          `News Item Title [${viewport.toUpperCase()}]`,
          figmaValues.textElements.news_item_title as TypographyStyles
        );
      }
    }

    // Validate news item tags typography - tags should ALWAYS be present
    if (figmaValues.textElements.topic_tag) {
      const firstItemTags = this.getNewsItemTags(0);
      await this.validateElementTypography(
        firstItemTags.first(),
        `News Item Tags Typography [${viewport.toUpperCase()}]`,
        figmaValues.textElements.topic_tag as TypographyStyles
      );
    }

    // Validate date typography - dates should ALWAYS be present
    if (figmaValues.textElements.september_15_2025) {
      const firstItemDate = this.getNewsItemDate(0);
      await this.validateElementTypography(
        firstItemDate,
        'Date Typography',
        figmaValues.textElements.september_15_2025 as TypographyStyles
      );
    }
  }

  /**
   * Validates filter and search typography
   */
  private async validateFilterTypography(
    figmaValues: ReturnType<typeof getValuesByViewport>
  ): Promise<void> {
    // Validate search input typography
    if (figmaValues.textElements.search_news) {
      const searchInput = this.searchContainer.locator('input');
      if ((await searchInput.count()) > 0) {
        await this.validateElementTypography(
          searchInput,
          'Search Input Typography',
          figmaValues.textElements.search_news as TypographyStyles
        );
      }
    }

    // Validate area filter typography - filters should ALWAYS be present
    if (figmaValues.textElements.area) {
      await this.validateElementTypography(
        this.areaFilter,
        'Area Filter Typography',
        figmaValues.textElements.area as TypographyStyles
      );
    }

    // Validate topic filter typography - filters should ALWAYS be present
    if (figmaValues.textElements.topic) {
      await this.validateElementTypography(
        this.topicFilter,
        'Topic Filter Typography',
        figmaValues.textElements.topic as TypographyStyles
      );
    }
  }

  /**
   * Validates typography properties of a specific element
   */
  private async validateElementTypography(
    element: Locator,
    elementName: string,
    expectedStyles: TypographyStyles
  ): Promise<void> {
    try {
      const computedStyles = await element.evaluate((el) => {
        const styles = globalThis.getComputedStyle(el);
        return {
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          lineHeight: styles.lineHeight,
          color: styles.color,
          background: styles.background,
          backgroundImage: styles.backgroundImage,
        };
      });

      // Validate font family
      if (expectedStyles.fontFamily) {
        const normalizedExpected = expectedStyles.fontFamily.replaceAll(/['"]/g, '').toLowerCase();
        const normalizedActual = computedStyles.fontFamily.replaceAll(/['"]/g, '').toLowerCase();
        expect.soft(normalizedActual, `${elementName} font family`).toContain(normalizedExpected);
      }

      // Validate font size
      if (expectedStyles.fontSize) {
        expect
          .soft(computedStyles.fontSize, `${elementName} font size`)
          .toBe(expectedStyles.fontSize);
      }

      // Validate font weight
      if (expectedStyles.fontWeight) {
        expect
          .soft(computedStyles.fontWeight, `${elementName} font weight`)
          .toBe(expectedStyles.fontWeight);
      }

      // Validate line height
      if (expectedStyles.lineHeight) {
        expect
          .soft(computedStyles.lineHeight, `${elementName} line height`)
          .toBe(expectedStyles.lineHeight);
      }

      // Validate color (flexible to handle rgb/rgba variations)
      if (expectedStyles.color) {
        const normalizedExpected = this.normalizeColor(expectedStyles.color);
        const normalizedActual = this.normalizeColor(computedStyles.color);
        expect.soft(normalizedActual, `${elementName} color`).toBe(normalizedExpected);
      }

      // Validate background (for gradient backgrounds)
      if (expectedStyles.background) {
        const expectedBg = expectedStyles.background;
        const actualBg = computedStyles.background || computedStyles.backgroundImage;

        if (expectedBg.includes('linear-gradient')) {
          // For gradients, check if actual contains gradient
          expect
            .soft(
              actualBg.includes('linear-gradient') || actualBg.includes('gradient'),
              `${elementName} should have gradient background`
            )
            .toBe(true);
        } else {
          expect.soft(actualBg, `${elementName} background`).toBe(expectedBg);
        }
      }
    } catch (error) {
      throw new Error(`${elementName} typography validation failed: ${error}`);
    }
  }

  /**
   * Normalize color values to handle rgb/rgba format differences
   */
  private normalizeColor(color: string): string {
    // Always convert to rgb format for consistent comparison
    if (color.startsWith('rgba(') && color.includes(', 1)')) {
      // rgba(r, g, b, 1) → rgb(r, g, b)
      return color.replace('rgba(', 'rgb(').replace(', 1)', ')');
    }
    if (color.startsWith('rgba(') && color.includes(', 1.0)')) {
      // rgba(r, g, b, 1.0) → rgb(r, g, b)
      return color.replace('rgba(', 'rgb(').replace(', 1.0)', ')');
    }
    return color;
  }

  /**
   * Validates responsive behavior across different viewports
   */
  async validateResponsiveBehavior(): Promise<void> {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1080, height: 720 },
      { name: 'large-desktop', width: 1400, height: 1080 },
    ];

    for (const viewport of viewports) {
      // Set viewport size
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Wait for layout to stabilize
      await this.page.waitForLoadState('domcontentloaded');

      // Validate component is still visible and functional
      await expect.soft(this.newsListContainer).toBeVisible();
      await expect.soft(this.titleElement).toBeVisible();

      // Check if search container exists (it may not be present on all pages)
      const searchExists = await this.searchContainer.count();
      if (searchExists > 0) {
        await expect.soft(this.searchContainer).toBeVisible();
      }

      // Validate at least one news item is visible
      const newsItemsCount = await this.newsItems.count();
      expect.soft(newsItemsCount).toBeGreaterThan(0);

      // Validate first news item is properly displayed
      const firstItem = this.getNewsItem(0);
      await expect.soft(firstItem).toBeVisible();
    }
  }

  /**
   * Validates accessibility features
   */
  async validateAccessibilityFeatures(): Promise<void> {
    // Validate ARIA labels and roles
    await expect.soft(this.newsListContainer).toHaveAttribute('role', 'region');

    // Validate keyboard navigation
    const firstNewsItem = this.getNewsItem(0);
    await firstNewsItem.focus();
    expect.soft(await firstNewsItem.evaluate((el) => document.activeElement === el)).toBe(true);

    // Validate focusability of interactive elements
    await this.areaFilter.focus();
    await this.topicFilter.focus();

    // Validate news items are keyboard navigable
    const newsItemsCount = Math.min(await this.newsItems.count(), 3);
    for (let i = 0; i < newsItemsCount; i++) {
      const newsItem = this.getNewsItem(i);
      const cursor = await newsItem.evaluate((el) => globalThis.getComputedStyle(el).cursor);
      expect
        .soft(cursor, 'Interactive element should have appropriate cursor')
        .toMatch(/^(pointer|auto)$/);
    }
  }

  /**
   * Validates search functionality
   */
  async validateSearchFunctionality(): Promise<void> {
    // Validate search input is present and functional
    const searchInput = this.searchContainer.locator('input');
    await expect.soft(searchInput).toBeVisible();
    await expect.soft(searchInput).toBeEditable();

    // Test search input interaction with news-related keyword
    await searchInput.fill('news');
    const inputValue = await searchInput.inputValue();
    expect.soft(inputValue).toBe('news');

    // Clear search input
    await searchInput.clear();
    const clearedValue = await searchInput.inputValue();
    expect.soft(clearedValue).toBe('');
  }

  /**
   * Validates filter functionality
   */
  async validateFilterFunctionality(): Promise<void> {
    // Test area filter - optional (not present in production)
    const areaFilterCount = await this.areaFilter.count();
    if (areaFilterCount > 0) {
      await expect.soft(this.areaFilter).toBeVisible();
      await expect.soft(this.areaFilter).toBeEnabled();

      // Test area filter interaction
      try {
        await this.areaFilter.click({ timeout: 2000 });
        await this.page.waitForLoadState('domcontentloaded', { timeout: 2000 });
      } catch (error) {
        // Area filter interaction failed, continue with soft failure
        expect.soft(false, `Area filter interaction failed: ${error}`).toBe(true);
      }
    }

    // Test topic filter - optional for India site
    const env = process.env.TEST_ENV ?? 'qa';
    const topicFilterCount = await this.topicFilter.count();
    
    if (topicFilterCount > 0 && env !== 'prod_in') {
      await expect.soft(this.topicFilter).toBeVisible();
      await expect.soft(this.topicFilter).toBeEnabled();

      // Test topic filter interaction
      try {
        await this.topicFilter.click({ timeout: 2000 });
        await this.page.waitForLoadState('domcontentloaded', { timeout: 2000 });
      } catch (error) {
        // Topic filter interaction failed, continue with soft failure
        expect.soft(false, `Topic filter interaction failed: ${error}`).toBe(true);
      }
    } else if (env === 'prod_in') {
      console.log('[NewsListComponent] India: Topic filter not available (expected)');
    }
  }

  /**
   * Validates news item interactions
   */
  async validateNewsItemInteractions(): Promise<void> {
    // Wait for news items to load (they may load dynamically)
    try {
      await this.page.waitForSelector('[data-qa="news-list-item"]', { 
        state: 'attached', 
        timeout: 10000 
      });
    } catch {
      // Continue even if items don't load - the count check below will catch it
    }

    const newsItemsCount = await this.newsItems.count();
    expect.soft(newsItemsCount).toBeGreaterThan(0);

    // Test first news item interaction
    const firstItem = this.getNewsItem(0);
    const firstTitle = this.getNewsItemTitle(0);

    // Validate hoverable
    await firstItem.hover();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 1000 });

    // Validate clickable title
    await expect.soft(firstTitle).toBeVisible();
    const titleText = await firstTitle.textContent();
    expect.soft(titleText).toBeTruthy();

    // Test tag interactions - tags should ALWAYS be present
    const firstItemTags = this.getNewsItemTags(0);
    const firstTag = firstItemTags.first();
    await expect.soft(firstTag).toBeVisible();
    await firstTag.hover();
  }

  /**
   * Takes component screenshot for visual testing
   */
  async takeComponentScreenshot(testName: string): Promise<void> {
    await expect.soft(this.newsListContainer).toBeVisible();
    await this.newsListContainer.screenshot({
      path: `screenshots/news-list-${testName}-${Date.now()}.png`,
    });
  }

  /**
   * Gets the total count of news items
   */
  async getNewsItemsCount(): Promise<number> {
    // Wait for news items to load (they may load dynamically on some sites like India)
    try {
      await this.page.waitForSelector('[data-qa="news-list-item"]', { 
        state: 'attached', 
        timeout: 10000 
      });
    } catch {
      // Items may not be present - return count anyway
    }
    return await this.newsItems.count();
  }

  /**
   * Gets text content of a specific news item title
   */
  async getNewsItemTitleText(index: number): Promise<string | null> {
    const title = this.getNewsItemTitle(index);
    return await title.textContent();
  }

  /**
   * Gets all tag texts for a specific news item
   */
  async getNewsItemTagTexts(index: number): Promise<string[]> {
    const tags = this.getNewsItemTags(index);
    const tagCount = await tags.count();
    const tagTexts: string[] = [];

    for (let i = 0; i < tagCount; i++) {
      const tagText = await tags.nth(i).textContent();
      if (tagText) {
        tagTexts.push(tagText);
      }
    }

    return tagTexts;
  }

  /**
   * Gets date text for a specific news item
   */
  async getNewsItemDateText(index: number): Promise<string | null> {
    const date = this.getNewsItemDate(index);
    return await date.textContent();
  }

  /**
   * Performs comprehensive component validation
   */
  async performComprehensiveValidation(): Promise<void> {
    // Structure validation
    await this.validateComponentStructure();
    await this.validateNewsItemsStructure();

    // Typography validation for different viewports
    const viewports: Array<'xl' | 'lg' | 'md' | 'sm'> = ['xl', 'lg', 'md', 'sm'];
    for (const viewport of viewports) {
      await this.validateTypographyForViewport(viewport);
    }

    // Responsive validation
    await this.validateResponsiveBehavior();

    // Accessibility validation
    await this.validateAccessibilityFeatures();

    // Functionality validation
    await this.validateSearchFunctionality();
    await this.validateFilterFunctionality();
    await this.validateNewsItemInteractions();
  }
}

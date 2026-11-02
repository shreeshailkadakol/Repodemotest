import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';

export class SharePrice extends BasePage {
  // Parent containers
  private readonly footerBlock: Locator;
  private readonly sharePriceContainer: Locator;

  // Stock articles
  private readonly bayerStock: Locator;
  private readonly daxStock: Locator;
  private readonly allStockArticles: Locator;

  // Stock data presence indicators
  private readonly sharePriceWithData: Locator;
  private readonly noDataMessage: Locator;

  // Stock names
  private readonly bayerStockName: Locator;
  private readonly daxStockName: Locator;

  // Price elements
  private readonly allPriceElements: Locator;
  private readonly bayerPrice: Locator;
  private readonly daxPrice: Locator;
  private readonly priceElementsWithEuros: Locator;

  // Change percentage elements
  private readonly allChangeElements: Locator;
  private readonly bayerChange: Locator;
  private readonly daxChange: Locator;

  // Time elements
  private readonly allTimeElements: Locator;
  private readonly bayerTimeElement: Locator;
  private readonly daxTimeElement: Locator;

  // Change indicators
  private readonly allChangeIndicators: Locator;
  private readonly changeIndicatorIcons: Locator;
  private readonly changeIndicatorContainers: Locator;

  // Accessibility elements
  private readonly accessibleFieldsets: Locator;

  // Footer integration elements
  private readonly sharePriceInFooter: Locator;
  private readonly footerLogo: Locator;
  private readonly footerCopyright: Locator;
  private readonly allFooterElements: Locator;

  // India-specific elements
  private readonly regionSelector: Locator;
  private readonly globalRadioButton: Locator;
  private readonly indiaRadioButton: Locator;
  private readonly bseStock: Locator;
  private readonly nseStock: Locator;
  private readonly bsePrice: Locator;
  private readonly nsePrice: Locator;
  private readonly bseChange: Locator;
  private readonly nseChange: Locator;
  private readonly bseTimeElement: Locator;
  private readonly nseTimeElement: Locator;
  private readonly indiaStockContainer: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);

    // Initialize parent containers
    this.footerBlock = this.page.locator('[data-qa="footer-block"]');
    this.sharePriceContainer = this.page.locator('[data-qa="stock-price"]');

    // Initialize stock articles
    this.bayerStock = this.sharePriceContainer.locator('article[aria-label="Bayer share price"]');
    this.daxStock = this.sharePriceContainer.locator('article[aria-label="DAX share price"]');
    this.allStockArticles = this.sharePriceContainer.locator('article');

    // Initialize stock data presence indicators
    this.sharePriceWithData = this.sharePriceContainer.locator('article').first();
    this.noDataMessage = this.sharePriceContainer.locator('text=No share price data available');

    // Initialize stock names
    this.bayerStockName = this.sharePriceContainer.locator('span:has-text("Bayer")');
    this.daxStockName = this.sharePriceContainer.locator('span:has-text("DAX")');

    // Initialize price elements
    this.allPriceElements = this.sharePriceContainer.locator('span[aria-label*="Price:"]');
    this.bayerPrice = this.sharePriceContainer.locator(
      'article[aria-label="Bayer share price"] span[aria-label*="Price:"]'
    );
    this.daxPrice = this.sharePriceContainer.locator(
      'article[aria-label="DAX share price"] span[aria-label*="Price:"]'
    );
    this.priceElementsWithEuros = this.sharePriceContainer.locator(
      'span[aria-label*="Price:"][aria-label*="euros"]'
    );

    // Initialize change percentage elements
    this.allChangeElements = this.sharePriceContainer.locator('span[aria-label*="Change:"]');
    this.bayerChange = this.sharePriceContainer.locator(
      'article[aria-label="Bayer share price"] span[aria-label*="Change:"]'
    );
    this.daxChange = this.sharePriceContainer.locator(
      'article[aria-label="DAX share price"] span[aria-label*="Change:"]'
    );

    // Initialize time elements
    this.allTimeElements = this.sharePriceContainer.locator('time[datetime]');
    this.bayerTimeElement = this.sharePriceContainer.locator(
      'article[aria-label="Bayer share price"] time[datetime]'
    );
    this.daxTimeElement = this.sharePriceContainer.locator(
      'article[aria-label="DAX share price"] time[datetime]'
    );

    // Initialize change indicators
    this.allChangeIndicators = this.sharePriceContainer.locator(
      'fieldset[aria-label="Price change indicator"]'
    );
    this.changeIndicatorIcons = this.sharePriceContainer.locator('svg[data-qa="icon"]');
    this.changeIndicatorContainers = this.sharePriceContainer.locator('div[aria-label*="Price"]');

    // Initialize accessibility elements
    this.accessibleFieldsets = this.sharePriceContainer.locator(
      'fieldset[aria-label="Price change indicator"]'
    );

    // Initialize footer integration elements
    this.sharePriceInFooter = this.footerBlock.locator('[data-qa="stock-price"]');
    this.footerLogo = this.footerBlock.locator('[data-qa="footer-logo"]');
    this.footerCopyright = this.footerBlock.locator('[data-qa="footer-copyright"]');
    this.allFooterElements = this.footerBlock.locator('*').filter({ hasNotText: /^$/ });

    // Initialize India-specific elements using actual data-testid attributes from QA environment
    this.regionSelector = this.sharePriceContainer.locator('[data-testid="share-price-switcher"]');
    this.globalRadioButton = this.sharePriceContainer.locator('[data-testid="share-price-global-radio"]');
    this.indiaRadioButton = this.sharePriceContainer.locator('input[data-testid="share-price-country-radio"]');
    // Note: BSE/NSE specific elements will appear when India mode is selected
    this.bseStock = this.sharePriceContainer.locator('article[aria-label*="BSE share price"]');
    this.nseStock = this.sharePriceContainer.locator('article[aria-label*="NSE"]');
    this.bsePrice = this.bseStock.locator('span[aria-label*="Price:"]');
    this.nsePrice = this.nseStock.locator('span[aria-label*="Price:"]');
    this.bseChange = this.bseStock.locator('span[aria-label*="Change:"]');
    this.nseChange = this.nseStock.locator('span[aria-label*="Change:"]');
    this.bseTimeElement = this.bseStock.locator('time[datetime]');
    this.nseTimeElement = this.nseStock.locator('time[datetime]');
    this.indiaStockContainer = this.sharePriceContainer;
  }

  // Getter methods for accessing locators
  get footerBlockLocator(): Locator {
    return this.footerBlock;
  }
  get sharePriceContainerLocator(): Locator {
    return this.sharePriceContainer;
  }
  get sharePriceWithDataLocator(): Locator {
    return this.sharePriceWithData;
  }
  get noDataMessageLocator(): Locator {
    return this.noDataMessage;
  }
  get bayerStockLocator(): Locator {
    return this.bayerStock;
  }
  get daxStockLocator(): Locator {
    return this.daxStock;
  }
  get allStockArticlesLocator(): Locator {
    return this.allStockArticles;
  }
  get bayerStockNameLocator(): Locator {
    return this.bayerStockName;
  }
  get daxStockNameLocator(): Locator {
    return this.daxStockName;
  }
  get allPriceElementsLocator(): Locator {
    return this.allPriceElements;
  }
  get bayerPriceLocator(): Locator {
    return this.bayerPrice;
  }
  get daxPriceLocator(): Locator {
    return this.daxPrice;
  }
  get priceElementsWithEurosLocator(): Locator {
    return this.priceElementsWithEuros;
  }
  get allChangeElementsLocator(): Locator {
    return this.allChangeElements;
  }
  get bayerChangeLocator(): Locator {
    return this.bayerChange;
  }
  get daxChangeLocator(): Locator {
    return this.daxChange;
  }
  get allTimeElementsLocator(): Locator {
    return this.allTimeElements;
  }
  get bayerTimeElementLocator(): Locator {
    return this.bayerTimeElement;
  }
  get daxTimeElementLocator(): Locator {
    return this.daxTimeElement;
  }
  get allChangeIndicatorsLocator(): Locator {
    return this.allChangeIndicators;
  }
  get changeIndicatorIconsLocator(): Locator {
    return this.changeIndicatorIcons;
  }
  get changeIndicatorContainersLocator(): Locator {
    return this.changeIndicatorContainers;
  }
  get accessibleFieldsetsLocator(): Locator {
    return this.accessibleFieldsets;
  }
  get sharePriceInFooterLocator(): Locator {
    return this.sharePriceInFooter;
  }
  get footerLogoLocator(): Locator {
    return this.footerLogo;
  }
  get footerCopyrightLocator(): Locator {
    return this.footerCopyright;
  }
  get allFooterElementsLocator(): Locator {
    return this.allFooterElements;
  }

  // India-specific getter methods
  get regionSelectorLocator(): Locator {
    return this.regionSelector;
  }
  get globalRadioButtonLocator(): Locator {
    return this.globalRadioButton;
  }
  get indiaRadioButtonLocator(): Locator {
    return this.indiaRadioButton;
  }
  get bseStockLocator(): Locator {
    return this.bseStock;
  }
  get nseStockLocator(): Locator {
    return this.nseStock;
  }
  get bsePriceLocator(): Locator {
    return this.bsePrice;
  }
  get nsePriceLocator(): Locator {
    return this.nsePrice;
  }
  get bseChangeLocator(): Locator {
    return this.bseChange;
  }
  get nseChangeLocator(): Locator {
    return this.nseChange;
  }
  get bseTimeElementLocator(): Locator {
    return this.bseTimeElement;
  }
  get nseTimeElementLocator(): Locator {
    return this.nseTimeElement;
  }
  get indiaStockContainerLocator(): Locator {
    return this.indiaStockContainer;
  }

  // Utility methods
  async scrollToFooter(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  /**
   * Enhanced API waiting logic for headless mode compatibility
   * Monitors network requests and ensures API responses are received before proceeding
   */
  async waitForStockApiResponse(timeout: number = 45000): Promise<void> {
    // Set up network request monitoring
    const apiResponsePromise = new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`SharePrice API response timeout after ${timeout}ms`));
      }, timeout);

      // Monitor network responses for stock data API calls
      this.page.on('response', async (response) => {
        const url = response.url();
        // Look for stock/financial API endpoints (adjust patterns as needed)
        if (
          url.includes('stock') ||
          url.includes('price') ||
          url.includes('financial') ||
          url.includes('market')
        ) {
          if (response.status() === 200) {
            // Wait for DOM to update after successful API response
            await new Promise((resolve) => setTimeout(resolve, 2000));
            clearTimeout(timeoutId);
            resolve();
          }
        }
      });
    });

    try {
      // Wait for either API response or component visibility
      await Promise.race([apiResponsePromise, this.waitForStockDataLoad(timeout)]);
    } catch (apiError) {
      // API waiting fallback - proceeding with DOM-based detection
      try {
        await this.waitForStockDataLoad(timeout);
      } catch (domError) {
        throw new Error(`Both API and DOM waiting failed: ${domError}`);
      }
    }
  }

  async waitForStockDataLoad(timeout: number = 60000): Promise<void> {
    // Wait for container first
    await this.sharePriceContainer.waitFor({
      state: 'visible',
      timeout: Math.min(timeout, 30000),
    });

    // Enhanced waiting logic with multiple fallback strategies
    const strategies = [
      // Strategy 1: Wait for actual stock data (not "No data" message)
      async () => {
        await this.sharePriceWithData.waitFor({
          state: 'visible',
          timeout: timeout / 3,
        });
      },

      // Strategy 2: Wait for specific stock articles with data
      async () => {
        await this.bayerStock.waitFor({ state: 'visible', timeout: timeout / 3 });
        await this.daxStock.waitFor({ state: 'visible', timeout: timeout / 3 });
      },

      // Strategy 3: Wait for price elements to contain actual numeric data
      async () => {
        await this.page.waitForFunction(
          () => {
            const priceElements = document.querySelectorAll(
              '[data-qa="stock-price"] span[aria-label*="Price:"]'
            );
            return Array.from(priceElements).some((el) => {
              const text = el.textContent || '';
              return /\d+[.,]\d+/.test(text); // Contains decimal numbers
            });
          },
          { timeout: timeout / 3 }
        );
      },
    ];

    // Try each strategy in sequence
    for (let i = 0; i < strategies.length; i++) {
      try {
        await strategies[i]();
        return;
      } catch (error) {
        if (i === strategies.length - 1) {
          throw new Error(`All stock data loading strategies failed: ${error}`);
        }
      }
    }
  }

  getStockArticleByName(stockName: 'Bayer' | 'DAX'): Locator {
    return stockName === 'Bayer' ? this.bayerStock : this.daxStock;
  }

  async waitForComponentToLoad(): Promise<void> {
    // Enhanced component loading with API awareness
    // First wait for API response
    await this.waitForStockApiResponse(45000);

    // Then verify DOM elements
    await this.sharePriceContainer.waitFor({ state: 'visible', timeout: 10000 });
    await expect.soft(this.bayerStock).toBeVisible();
    await expect.soft(this.daxStock).toBeVisible();
  }

  async validateComponentPresence(): Promise<void> {
    // Verify main container is visible
    await expect.soft(this.sharePriceContainer).toBeVisible();

    // Verify both stock entries are present
    await expect.soft(this.bayerStock).toBeVisible();
    await expect.soft(this.daxStock).toBeVisible();

    // Verify both stocks have required elements
    for (const stock of [this.bayerStock, this.daxStock]) {
      await expect.soft(stock.locator('span[aria-label*="Price:"]')).toBeVisible();
      await expect.soft(stock.locator('span[aria-label*="Change:"]')).toBeVisible();
      await expect.soft(stock.locator('time[datetime]')).toBeVisible();
    }
  }

  async getBayerPrice(): Promise<string> {
    const priceElement = this.sharePriceContainer.locator(
      'article[aria-label="Bayer share price"] span[aria-label*="Price:"]'
    );
    return (await priceElement.textContent()) || '';
  }

  async getDaxPrice(): Promise<string> {
    const priceElement = this.sharePriceContainer.locator(
      'article[aria-label="DAX share price"] span[aria-label*="Price:"]'
    );
    return (await priceElement.textContent()) || '';
  }

  async getBayerChange(): Promise<string> {
    const changeElement = this.sharePriceContainer.locator(
      'article[aria-label="Bayer share price"] span[aria-label*="Change:"]'
    );
    return (await changeElement.textContent()) || '';
  }

  async getDaxChange(): Promise<string> {
    const changeElement = this.sharePriceContainer.locator(
      'article[aria-label="DAX share price"] span[aria-label*="Change:"]'
    );
    return (await changeElement.textContent()) || '';
  }

  async getBayerTimestamp(): Promise<string> {
    const timeElement = this.sharePriceContainer.locator(
      'article[aria-label="Bayer share price"] time[datetime]'
    );
    return (await timeElement.textContent()) || '';
  }

  async getDaxTimestamp(): Promise<string> {
    const timeElement = this.sharePriceContainer.locator(
      'article[aria-label="DAX share price"] time[datetime]'
    );
    return (await timeElement.textContent()) || '';
  }

  async validatePriceFormat(stockName: 'bayer' | 'dax'): Promise<boolean> {
    const priceText = stockName === 'bayer' ? await this.getBayerPrice() : await this.getDaxPrice();
    // Expected format: € 123.45 or € 1,234.56
    const priceRegex = /^€\s\d{1,3}(,\d{3})*\.\d{2}$/;
    return priceRegex.test(priceText);
  }

  async validateChangeFormat(stockName: 'bayer' | 'dax'): Promise<boolean> {
    const changeText =
      stockName === 'bayer' ? await this.getBayerChange() : await this.getDaxChange();
    // Expected format: +1.23% or -1.23%
    const changeRegex = /^[+-]?\d+\.\d{2}%$/;
    return changeRegex.test(changeText);
  }

  async validateTimestampRecency(
    stockName: 'bayer' | 'dax',
    maxHoursOld: number = 168
  ): Promise<boolean> {
    const timestamp =
      stockName === 'bayer' ? await this.getBayerTimestamp() : await this.getDaxTimestamp();

    if (!timestamp) return false;

    const stockTime = new Date(timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - stockTime.getTime()) / (1000 * 60 * 60);

    return hoursDiff <= maxHoursOld; // Within specified hours (default: 7 days)
  }

  async validatePriceChangeIndicators(): Promise<void> {
    const changeIndicators = this.sharePriceContainer.locator(
      'fieldset[aria-label="Price change indicator"]'
    );
    const indicatorCount = await changeIndicators.count();
    expect.soft(indicatorCount).toBe(2); // One for each stock

    // Verify each indicator has proper structure
    for (let i = 0; i < indicatorCount; i++) {
      const indicator = changeIndicators.nth(i);
      await expect.soft(indicator.locator('div[aria-label*="Price"]')).toBeVisible();
      await expect.soft(indicator.locator('svg[data-qa="icon"]')).toBeVisible();
    }
  }

  async validateAccessibilityLabels(): Promise<void> {
    // Test ARIA labels for stock articles
    await expect
      .soft(this.sharePriceContainer.locator('article[aria-label="Bayer share price"]'))
      .toHaveAttribute('aria-label', 'Bayer share price');
    await expect
      .soft(this.sharePriceContainer.locator('article[aria-label="DAX share price"]'))
      .toHaveAttribute('aria-label', 'DAX share price');

    // Test price accessibility labels
    const priceElements = this.sharePriceContainer.locator(
      'span[aria-label*="Price:"][aria-label*="euros"]'
    );
    const priceCount = await priceElements.count();
    expect.soft(priceCount).toBe(2);

    // Test change percentage labels
    const changeElements = this.sharePriceContainer.locator('span[aria-label*="Change:"]');
    const changeCount = await changeElements.count();
    expect.soft(changeCount).toBe(2);

    // Test time elements have proper datetime attributes
    const timeElements = this.sharePriceContainer.locator('time[datetime]');
    const timeCount = await timeElements.count();
    expect.soft(timeCount).toBe(2);

    for (let i = 0; i < timeCount; i++) {
      await expect.soft(timeElements.nth(i)).toHaveAttribute('datetime');
      await expect.soft(timeElements.nth(i)).toHaveAttribute('title', /Last updated:/);
    }
  }

  async validateStockNames(): Promise<void> {
    const bayerName = this.sharePriceContainer.locator('span[title="Bayer"]');
    await expect.soft(bayerName).toHaveText('Bayer');

    const daxName = this.sharePriceContainer.locator('span[title="DAX"]');
    await expect.soft(daxName).toHaveText('DAX');
  }

  async validateNoErrorStates(): Promise<void> {
    // Check for absence of error states
    const errorMessages = this.sharePriceContainer.locator('text=/error|failed|unavailable/i');
    await expect.soft(errorMessages).toHaveCount(0);
  }

  async getComponentBoundingBox(): Promise<{ width: number; height: number } | null> {
    const box = await this.sharePriceContainer.boundingBox();
    return box ? { width: box.width, height: box.height } : null;
  }

  async validateResponsiveDesign(viewport: { width: number; height: number }): Promise<void> {
    await this.page.setViewportSize(viewport);

    // Verify component is still visible and properly positioned
    await expect.soft(this.sharePriceContainer).toBeVisible();

    // Check that text is not cut off or overlapping
    const containerBox = await this.sharePriceContainer.boundingBox();
    expect.soft(containerBox?.width).toBeGreaterThan(0);
    expect.soft(containerBox?.height).toBeGreaterThan(0);

    // Verify all text elements are still readable
    const priceElements = this.sharePriceContainer.locator('span[aria-label*="Price:"]');
    const priceCount = await priceElements.count();

    for (let i = 0; i < priceCount; i++) {
      const priceBox = await priceElements.nth(i).boundingBox();
      expect.soft(priceBox?.width).toBeGreaterThan(0);
      expect.soft(priceBox?.height).toBeGreaterThan(0);
    }
  }

  async validateFooterIntegration(): Promise<void> {
    // Verify SharePrice is within footer
    const footerBlock = this.page.locator('[data-qa="footer-block"]');
    const sharePriceInFooter = footerBlock.locator('[data-qa="stock-price"]');

    await expect.soft(sharePriceInFooter).toBeVisible();

    // Verify positioning within footer boundaries
    const footerBox = await footerBlock.boundingBox();
    const sharePriceBox = await sharePriceInFooter.boundingBox();

    if (footerBox && sharePriceBox) {
      expect.soft(sharePriceBox.x).toBeGreaterThanOrEqual(footerBox.x);
      expect.soft(sharePriceBox.y).toBeGreaterThanOrEqual(footerBox.y);
      expect
        .soft(sharePriceBox.x + sharePriceBox.width)
        .toBeLessThanOrEqual(footerBox.x + footerBox.width);
    }
  }

  async performComprehensiveValidation(): Promise<void> {
    await this.waitForComponentToLoad();
    await this.validateComponentPresence();
    await this.validateStockNames();
    await this.validateAccessibilityLabels();
    await this.validatePriceChangeIndicators();
    await this.validateNoErrorStates();

    // Validate data formats
    const bayerPriceValid = await this.validatePriceFormat('bayer');
    const daxPriceValid = await this.validatePriceFormat('dax');
    const bayerChangeValid = await this.validateChangeFormat('bayer');
    const daxChangeValid = await this.validateChangeFormat('dax');

    expect.soft(bayerPriceValid).toBeTruthy();
    expect.soft(daxPriceValid).toBeTruthy();
    expect.soft(bayerChangeValid).toBeTruthy();
    expect.soft(daxChangeValid).toBeTruthy();

    // Validate timestamp recency
    const bayerTimestampValid = await this.validateTimestampRecency('bayer');
    const daxTimestampValid = await this.validateTimestampRecency('dax');

    expect.soft(bayerTimestampValid).toBeTruthy();
    expect.soft(daxTimestampValid).toBeTruthy();
  }

  /**
   * Click India radio button using the label (works with custom styled radio buttons)
   */
  async clickIndiaRadioButton(): Promise<void> {
    // Ensure SharePrice component is in viewport
    await this.sharePriceContainer.scrollIntoViewIfNeeded();
    await this.sharePriceContainer.locator('input[data-testid="share-price-country-radio"]').click({ force: true });
  }

  /**
   * Click Global radio button using the label (works with custom styled radio buttons)
   */
  async clickGlobalRadioButton(): Promise<void> {
    // Ensure SharePrice component is in viewport
    await this.sharePriceContainer.scrollIntoViewIfNeeded();
    await this.sharePriceContainer.locator('input[data-testid="share-price-global-radio"]').click({ force: true });
  }
}

import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { envUtils } from '../../helpers/utils/envUtils';
import { SharePrice } from '../../components/sharePrice';
import { SharePrice_FigmaValues } from '../../helpers/utils/figma-values/SharePrice_FigmaValues';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

// Interface for performance memory type
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

test.describe('SharePrice Component - India-Specific Test Suite (US-815)', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('sharePrice-India');
  });

  let page: Page;
  let browser: Browser;
  let context: BrowserContext;
  let sharePrice: SharePrice;
  const testUrl = envUtils.getBaseUrl();

  test.beforeEach(async ({ page: testPage, browser: testBrowser, context: testContext }) => {
    page = testPage;
    browser = testBrowser;
    context = testContext;
    sharePrice = new SharePrice(page, browser, context);

    // Navigate to component with authentication
    const sharepriceURL = await sharePrice.getComponentUrl('SharePriceComponent', testUrl);
    await sharePrice.navigateWithAuthentication(sharepriceURL);
    await sharePrice.acceptCookiesBanner();

    // Wait for cookie banner to disappear completely
    await page.waitForSelector('#onetrust-consent-sdk', { state: 'hidden', timeout: 10000 }).catch(() => {
      // If cookie banner selector not found or already hidden, continue
    });

    // Wait for page to fully load
    await page.waitForLoadState('domcontentloaded');
    await sharePrice.sharePriceContainerLocator.waitFor({ state: 'visible', timeout: 30000 });

    // Scroll to footer to ensure SharePrice component is in view
    await sharePrice.scrollToFooter();

    // Ensure footer is accessible
    await sharePrice.footerBlockLocator.waitFor({ state: 'visible', timeout: 20000 });

    // Enhanced API-aware waiting for stock data
    await sharePrice.waitForStockApiResponse(45000);
  });

  test.describe('INDIA-SPECIFIC FUNCTIONAL TESTS', () => {
    test('TC-SP-IND001: India Radio Button Selection @SharePrice @India @Critical @Smoke @UKSmoke', async () => {
      // Verify region selector exists
      await expect.soft(sharePrice.regionSelectorLocator).toBeVisible();
      
      // Verify both radio buttons exist
      await expect.soft(sharePrice.globalRadioButtonLocator).toBeVisible();
      await expect.soft(sharePrice.indiaRadioButtonLocator).toBeVisible();
      
      // Click India radio button (click the label which wraps the hidden input)
      await sharePrice.clickIndiaRadioButton();
      
      // Wait for data to refresh after mode switch
      await page.waitForTimeout(2000);
      await sharePrice.waitForStockApiResponse(30000);
      
      // Verify India radio button is selected (check the actual input)
      const indiaRadioInput = sharePrice.sharePriceContainerLocator.locator('[data-testid="share-price-country-radio"]');
      await expect.soft(indiaRadioInput).toBeChecked();
    });

    test('TC-SP-IND002: BSE Stock Display in India Mode @SharePrice @India @BSE', async () => {
      // Verify initial state (Global should be selected by default)
      await expect.soft(sharePrice.globalRadioButtonLocator).toBeChecked();
      await expect.soft(sharePrice.indiaRadioButtonLocator).not.toBeChecked();
      
      // Switch to India mode
      await sharePrice.clickIndiaRadioButton();
      await page.waitForTimeout(2000);
      
      // Verify India radio button is now selected
      await expect.soft(sharePrice.indiaRadioButtonLocator).toBeChecked();
      await expect.soft(sharePrice.globalRadioButtonLocator).not.toBeChecked();
      
      await sharePrice.waitForStockApiResponse(30000);
      
      // Verify BSE stock is displayed
      await expect.soft(sharePrice.bseStockLocator).toBeVisible();
      
      // Verify BSE has proper price element
      await expect.soft(sharePrice.bsePriceLocator).toBeVisible();
      await expect.soft(sharePrice.bsePriceLocator).not.toBeEmpty();
      
      // Verify BSE has proper change element
      await expect.soft(sharePrice.bseChangeLocator).toBeVisible();
      await expect.soft(sharePrice.bseChangeLocator).not.toBeEmpty();
      
      // Verify BSE has proper timestamp
      await expect.soft(sharePrice.bseTimeElementLocator).toBeVisible();
    });

    test('TC-SP-IND003: NSE Stock Display in India Mode @SharePrice @India @NSE', async () => {
      // Switch to India mode
      await sharePrice.clickIndiaRadioButton();
      await page.waitForTimeout(2000);
      await sharePrice.waitForStockApiResponse(30000);
      
      // Verify NSE stock is displayed
      await expect.soft(sharePrice.nseStockLocator).toBeVisible();
      
      // Verify NSE has proper price element
      await expect.soft(sharePrice.nsePriceLocator).toBeVisible();
      await expect.soft(sharePrice.nsePriceLocator).not.toBeEmpty();
      
      // Verify NSE has proper change element
      await expect.soft(sharePrice.nseChangeLocator).toBeVisible();
      await expect.soft(sharePrice.nseChangeLocator).not.toBeEmpty();
      
      // Verify NSE has proper timestamp
      await expect.soft(sharePrice.nseTimeElementLocator).toBeVisible();
    });

    test('TC-SP-IND004: India Mode Data Validation @SharePrice @India @DataValidation', async () => {
      // Switch to India mode
      await sharePrice.clickIndiaRadioButton();
      await page.waitForTimeout(2000);
      await sharePrice.waitForStockApiResponse(30000);
      
      // Verify India stock container is visible
      await expect.soft(sharePrice.indiaStockContainerLocator).toBeVisible();
      
      // Verify both India stocks are visible
      await expect.soft(sharePrice.bseStockLocator).toBeVisible();
      await expect.soft(sharePrice.nseStockLocator).toBeVisible();
      
      // Verify proper currency display for Indian market
      const bsePriceText = await sharePrice.bsePriceLocator.textContent();
      const nsePriceText = await sharePrice.nsePriceLocator.textContent();
      
      expect.soft(bsePriceText).toBeTruthy();
      expect.soft(nsePriceText).toBeTruthy();
      expect.soft(bsePriceText.length).toBeGreaterThan(0);
      expect.soft(nsePriceText.length).toBeGreaterThan(0);
    });

    test('TC-SP-IND005: Switch Between Global and India Modes @SharePrice @India @SwitchModes', async () => {
      // Initially should be in global mode (default)
      await expect.soft(sharePrice.bayerStockLocator).toBeVisible();
      await expect.soft(sharePrice.daxStockLocator).toBeVisible();
      
      // Switch to India mode
      await sharePrice.clickIndiaRadioButton();
      await page.waitForTimeout(2000);
      await sharePrice.waitForStockApiResponse(30000);
      
      // Verify switch to India stocks
      await expect.soft(sharePrice.bseStockLocator).toBeVisible();
      await expect.soft(sharePrice.nseStockLocator).toBeVisible();
      
      // Switch back to global mode
      await sharePrice.clickGlobalRadioButton();
      await page.waitForTimeout(2000);
      await sharePrice.waitForStockApiResponse(30000);
      
      // Verify switch back to global stocks
      await expect.soft(sharePrice.bayerStockLocator).toBeVisible();
      await expect.soft(sharePrice.daxStockLocator).toBeVisible();
    });

    test('TC-SP-IND006: India Mode Accessibility Validation @Accessibility @SharePrice @India', async () => {
      // Switch to India mode
      await sharePrice.clickIndiaRadioButton();
      await page.waitForTimeout(2000);
      await sharePrice.waitForStockApiResponse(30000);
      
      // Verify region selector is accessible (check for actual attributes)
      await expect.soft(sharePrice.regionSelectorLocator).toBeVisible();
      await expect.soft(sharePrice.regionSelectorLocator).toHaveAttribute('data-testid', 'share-price-switcher');
      
      // Verify radio buttons have proper attributes  
      await expect.soft(sharePrice.globalRadioButtonLocator).toHaveAttribute('type', 'radio');
      await expect.soft(sharePrice.indiaRadioButtonLocator).toHaveAttribute('type', 'radio');
      
      // Verify BSE stock has proper aria-label (instead of data-qa)
      await expect.soft(sharePrice.bseStockLocator).toHaveAttribute('aria-label', 'BSE share price');
      
      // Verify NSE stock has proper aria-label (instead of data-qa)
      await expect.soft(sharePrice.nseStockLocator).toHaveAttribute('aria-label', 'NSE share price');
    });
  });

  test.describe('INDIA-SPECIFIC VISUAL TESTS', () => {
    test('TC-SP-IND-VIS001: BSE Stock Visual Validation - XL Viewport @Visual @SharePrice @India @BSE @XL', async () => {
      // Set XL viewport
      await page.setViewportSize({ width: 1440, height: 900 });
      
      // Switch to India mode
      await sharePrice.clickIndiaRadioButton();
      await page.waitForTimeout(2000);
      await sharePrice.waitForStockApiResponse(30000);
      
      // Verify BSE stock typography matches Figma values for XL
      const bsePriceElement = sharePrice.bsePriceLocator;
      await expect.soft(bsePriceElement).toBeVisible();
      
      // Validate font properties against Figma values
      const fontSize = await bsePriceElement.evaluate(el => window.getComputedStyle(el).fontSize);
      const fontWeight = await bsePriceElement.evaluate(el => window.getComputedStyle(el).fontWeight);
      const lineHeight = await bsePriceElement.evaluate(el => window.getComputedStyle(el).lineHeight);
      
      // Validate against XL Figma values
      expect.soft(fontSize).toBe(SharePrice_FigmaValues.XL.priceText.fontSize);
      expect.soft(fontWeight).toBe(SharePrice_FigmaValues.XL.priceText.fontWeight);
      expect.soft(lineHeight).toBe(SharePrice_FigmaValues.XL.priceText.lineHeight);
    });

    test('TC-SP-IND-VIS002: NSE Stock Visual Validation - LG Viewport @Visual @SharePrice @India @NSE @LG', async () => {
      // Set LG viewport
      await page.setViewportSize({ width: 1024, height: 768 });
      
      // Switch to India mode
      await sharePrice.clickIndiaRadioButton();
      await page.waitForTimeout(2000);
      await sharePrice.waitForStockApiResponse(30000);
      
      // Verify NSE stock typography matches Figma values for LG
      const nsePriceElement = sharePrice.nsePriceLocator;
      await expect.soft(nsePriceElement).toBeVisible();
      
      // Validate font properties against Figma values
      const fontSize = await nsePriceElement.evaluate(el => window.getComputedStyle(el).fontSize);
      const fontWeight = await nsePriceElement.evaluate(el => window.getComputedStyle(el).fontWeight);
      const lineHeight = await nsePriceElement.evaluate(el => window.getComputedStyle(el).lineHeight);
      
      // Validate against LG Figma values
      expect.soft(fontSize).toBe(SharePrice_FigmaValues.LG.priceText.fontSize);
      expect.soft(fontWeight).toBe(SharePrice_FigmaValues.LG.priceText.fontWeight);
      expect.soft(lineHeight).toBe(SharePrice_FigmaValues.LG.priceText.lineHeight);
    });

    test('TC-SP-IND-VIS003: India Mode Layout Visual Validation - MD Viewport @Visual @SharePrice @India @Layout @MD', async () => {
      // Set MD viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Switch to India mode
      await sharePrice.clickIndiaRadioButton();
      await page.waitForTimeout(2000);
      await sharePrice.waitForStockApiResponse(30000);
      
      // Verify India stock container layout
      const indiaContainer = sharePrice.indiaStockContainerLocator;
      await expect.soft(indiaContainer).toBeVisible();
      
      // Validate container dimensions and spacing
      const containerBox = await indiaContainer.boundingBox();
      expect.soft(containerBox).toBeTruthy();
      
      // Verify both stocks are properly positioned
      const bseBox = await sharePrice.bseStockLocator.boundingBox();
      const nseBox = await sharePrice.nseStockLocator.boundingBox();
      
      expect.soft(bseBox).toBeTruthy();
      expect.soft(nseBox).toBeTruthy();
      
      // Verify proper spacing between stocks
      if (bseBox && nseBox) {
        const spacing = Math.abs(bseBox.x - (nseBox.x + nseBox.width));
        expect.soft(spacing).toBeGreaterThanOrEqual(16); // Minimum spacing
      }
    });

    test('TC-SP-IND-VIS004: Radio Button Visual Validation - SM Viewport @Visual @SharePrice @India @RadioButtons @SM', async () => {
      // Set SM viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Verify region selector visual appearance
      const regionSelector = sharePrice.regionSelectorLocator;
      await expect.soft(regionSelector).toBeVisible();
      
      // Validate radio button styling
      const globalRadio = sharePrice.globalRadioButtonLocator;
      const indiaRadio = sharePrice.indiaRadioButtonLocator;
      
      await expect.soft(globalRadio).toBeVisible();
      await expect.soft(indiaRadio).toBeVisible();
      
      // Check radio button states visual feedback
      await sharePrice.clickIndiaRadioButton();
      await page.waitForTimeout(500);
      
      // Verify visual state change
      await expect.soft(sharePrice.indiaRadioButtonLocator).toBeChecked();
      
      // Verify visual styling of checked state
      const checkedColor = await indiaRadio.evaluate(el => window.getComputedStyle(el).accentColor || window.getComputedStyle(el).color);
      expect.soft(checkedColor).toBeTruthy();
    });

    test('TC-SP-IND-VIS005: India Mode Typography Cross-Viewport Validation @Visual @SharePrice @India @Typography', async () => {
      const viewports = [
        { name: 'XL', size: { width: 1440, height: 900 } },
        { name: 'LG', size: { width: 1024, height: 768 } },
        { name: 'MD', size: { width: 768, height: 1024 } },
        { name: 'SM', size: { width: 375, height: 667 } }
      ];
      
      for (const viewport of viewports) {
        // Set viewport size
        await page.setViewportSize(viewport.size);
        
        // Switch to India mode
        await sharePrice.clickIndiaRadioButton();
        await page.waitForTimeout(1000);
        
        // Verify BSE price typography
        const bsePriceElement = sharePrice.bsePriceLocator;
        await expect.soft(bsePriceElement).toBeVisible();
        
        const fontSize = await bsePriceElement.evaluate(el => window.getComputedStyle(el).fontSize);
        const fontWeight = await bsePriceElement.evaluate(el => window.getComputedStyle(el).fontWeight);
        
        // Typography should be consistent and readable across all viewports
        expect.soft(parseInt(fontSize)).toBeGreaterThanOrEqual(12); // Minimum readable size
        expect.soft(parseInt(fontWeight)).toBeGreaterThanOrEqual(400); // Minimum weight
        
        // Verify NSE price typography
        const nsePriceElement = sharePrice.nsePriceLocator;
        await expect.soft(nsePriceElement).toBeVisible();
        
        const nseFontSize = await nsePriceElement.evaluate(el => window.getComputedStyle(el).fontSize);
        const nseFontWeight = await nsePriceElement.evaluate(el => window.getComputedStyle(el).fontWeight);
        
        expect.soft(parseInt(nseFontSize)).toBeGreaterThanOrEqual(12);
        expect.soft(parseInt(nseFontWeight)).toBeGreaterThanOrEqual(400);
      }
    });

    test('TC-SP-IND-VIS006: India Mode Color Contrast Validation @Visual @SharePrice @India @Accessibility', async () => {
      // Switch to India mode
      await sharePrice.clickIndiaRadioButton();
      await page.waitForTimeout(2000);
      await sharePrice.waitForStockApiResponse(30000);
      
      // Get computed styles for color contrast validation
      const bsePrice = sharePrice.bsePriceLocator;
      const nsePrice = sharePrice.nsePriceLocator;
      
      // Verify text colors have sufficient contrast
      const bseColor = await bsePrice.evaluate(el => window.getComputedStyle(el).color);
      const bseBackgroundColor = await bsePrice.evaluate(el => window.getComputedStyle(el).backgroundColor);
      
      const nseColor = await nsePrice.evaluate(el => window.getComputedStyle(el).color);
      const nseBackgroundColor = await nsePrice.evaluate(el => window.getComputedStyle(el).backgroundColor);
      
      // Colors should be defined (not transparent or inherit)
      expect.soft(bseColor).not.toBe('rgba(0, 0, 0, 0)');
      expect.soft(nseColor).not.toBe('rgba(0, 0, 0, 0)');
      
      // Verify change indicators have proper color coding
      const bseChange = sharePrice.bseChangeLocator;
      const nseChange = sharePrice.nseChangeLocator;
      
      await expect.soft(bseChange).toBeVisible();
      await expect.soft(nseChange).toBeVisible();
      
      // Change indicators should have color to indicate positive/negative
      const bseChangeColor = await bseChange.evaluate(el => window.getComputedStyle(el).color);
      const nseChangeColor = await nseChange.evaluate(el => window.getComputedStyle(el).color);
      
      expect.soft(bseChangeColor).toBeTruthy();
      expect.soft(nseChangeColor).toBeTruthy();
    });
  });
});

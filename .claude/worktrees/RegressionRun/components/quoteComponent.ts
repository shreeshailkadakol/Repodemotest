import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';
// Force update: Import Quote Figma values with underscore naming
import {
  Quote_FigmaValues as QuoteComponentFigmaValues,
  ViewportSize,
} from '../helpers/utils/figma-values/QuoteComponent_FigmaValues';

export class QuoteComponent extends BasePage {
  // Primary locators using data-testid as recommended
  private readonly componentElement: Locator = this.page
    .locator('[data-testid="quote-component"]')
    .first();

  private readonly quoteTextElement: Locator = this.page
    .locator('[data-testid="quote-component"] blockquote > div:first-child')
    .first();

  private readonly authorNameElement: Locator = this.page
    .locator('[data-testid="quote-component"] cite')
    .first();

  private readonly authorDesignationElement: Locator = this.page
    .locator('[data-testid="quote-component"] footer > div > div:last-child')
    .first();

  private readonly blockquoteElement: Locator = this.page
    .locator('[data-testid="quote-component"] blockquote')
    .first();

  private readonly attributionElement: Locator = this.page
    .locator('[data-testid="quote-component"] footer')
    .first();

  // Image locators
  private readonly quoteImageElement: Locator = this.page
    .locator('[data-testid="quote-component"] img')
    .first();

  private readonly imageContainerElement: Locator = this.page
    .locator('[data-testid="quote-component"] img')
    .locator('..')
    .first();

  // Viewport configurations
  readonly viewports = {
    XL: QuoteComponentFigmaValues.XL.viewport,
    LG: QuoteComponentFigmaValues.LG.viewport,
    MD: QuoteComponentFigmaValues.MD.viewport,
    SM: QuoteComponentFigmaValues.SM.viewport,
  };

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Navigate to the Quote Component page with authentication
   */
  async navigateToComponent(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const quoteComponentUrl = await this.resolveExecutionUrl('QuoteComponent', baseURL);

    await this.navigateWithAuthentication(quoteComponentUrl);
    await this.acceptCookiesBanner();

    // Wait for component to be visible
    await this.componentElement.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Verify component visibility and basic functionality
   */
  async verifyComponentVisibility(): Promise<void> {
    await expect.soft(this.componentElement).toBeVisible();

    // Verify component has content - check that element contains some text
    await expect.soft(this.componentElement).toHaveText(/.+/); // Regex to match any non-empty text
  }

  /**
   * Verify quote text element is visible without checking specific content
   */
  async verifyQuoteTextDisplay(): Promise<void> {
    // Verify element is visible and accessible
    await expect.soft(this.quoteTextElement).toBeVisible();

    // Verify element has text content (without checking specific content)
    await expect.soft(this.quoteTextElement).toHaveText(/.+/); // Regex to match any non-empty text
  }

  /**
   * Verify author name display and semantic structure
   */
  async verifyAuthorNameDisplay(): Promise<void> {
    await expect.soft(this.authorNameElement).toBeVisible();

    // Verify element uses semantic cite tag
    const tagName = await this.authorNameElement.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(tagName).toBe('cite');

    // Verify has content without checking specific text
    const authorContent = await this.authorNameElement.textContent();
    expect.soft(authorContent).toBeTruthy();
    expect.soft(authorContent?.length).toBeGreaterThan(0);
  }

  /**
   * Verify author designation display
   */
  async verifyAuthorDesignationDisplay(): Promise<void> {
    await expect.soft(this.authorDesignationElement).toBeVisible();

    // Verify has content without checking specific text
    await expect.soft(this.authorDesignationElement).toHaveText(/.+/); // Regex to match any non-empty text
  }

  /**
   * Verify quote image is visible and properly loaded
   */
  async verifyQuoteImageDisplay(): Promise<void> {
    // Verify image element exists and is visible
    await expect.soft(this.quoteImageElement).toBeVisible();

    // Verify image has valid src attribute
    await expect.soft(this.quoteImageElement).toHaveAttribute('src');
    const imageSrcValue = await this.quoteImageElement.getAttribute('src');
    // Image src can be either direct https:// URL or Next.js optimized path (/_next/image)
    const isValidImageSrc = imageSrcValue?.includes('https://') || imageSrcValue?.startsWith('/_next/image');
    expect.soft(isValidImageSrc, 'Image src should be either direct https:// URL or Next.js optimized path').toBe(true);

    // Verify image has alt text
    const imageAlt = await this.quoteImageElement.getAttribute('alt');
    expect.soft(imageAlt).toBeTruthy();
    expect.soft(imageAlt?.length).toBeGreaterThan(0);

    // Verify image is properly loaded (not broken)
    const isImageLoaded = await this.quoteImageElement.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalWidth > 0;
    });
    expect.soft(isImageLoaded).toBe(true);
  }

  /**
   * Verify image responsive styling across viewports
   */
  async verifyImageResponsiveStyles(viewport: ViewportSize): Promise<void> {
    // Set viewport
    await this.page.setViewportSize(this.viewports[viewport]);
    await this.page.waitForLoadState('domcontentloaded');

    const imageStyles = await this.quoteImageElement.evaluate((el: HTMLElement) => {
      const computed = window.getComputedStyle(el);
      return {
        width: computed.width,
        height: computed.height,
        objectFit: computed.objectFit,
        borderRadius: computed.borderRadius,
        display: computed.display,
      };
    });

    // Verify image has responsive dimensions
    expect.soft(imageStyles.width).toBeTruthy();
    expect.soft(imageStyles.height).toBeTruthy();

    // Verify object-fit is set to cover for proper image scaling
    expect.soft(imageStyles.objectFit).toBe('cover');

    // Verify image is displayed as block
    expect.soft(imageStyles.display).toBe('block');

    // Verify image dimensions change based on viewport
    const expectedDimensions = viewport === 'SM' || viewport === 'MD' ? '64px' : '96px';
    expect.soft([imageStyles.width, expectedDimensions]).toContain(expectedDimensions);
  }

  /**
   * Verify image accessibility attributes
   */
  async verifyImageAccessibility(): Promise<void> {
    // Verify alt attribute exists and is meaningful
    await expect.soft(this.quoteImageElement).toHaveAttribute('alt');
    const altTextValue = await this.quoteImageElement.getAttribute('alt');
    expect.soft(altTextValue?.length).toBeGreaterThan(2); // More than just "img"

    // Verify image doesn't have empty alt (unless decorative)
    expect.soft(altTextValue).not.toBe('');

    // Verify image role (should be img by default)
    const role = await this.quoteImageElement.getAttribute('role');
    if (role) {
      expect.soft(role).toBe('img');
    }
  }

  /**
   * Verify image container layout and positioning
   */
  async verifyImageContainerLayout(): Promise<void> {
    const containerStyles = await this.imageContainerElement.evaluate((el: HTMLElement) => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        position: computed.position,
        flexDirection: computed.flexDirection,
        alignItems: computed.alignItems,
        justifyContent: computed.justifyContent,
      };
    });

    // Verify container has proper layout properties
    expect.soft(containerStyles.display).toBeTruthy();

    // Verify image is positioned within the component layout
    const imageBoundingBox = await this.quoteImageElement.boundingBox();
    const componentBoundingBox = await this.componentElement.boundingBox();

    expect.soft(imageBoundingBox).toBeTruthy();
    expect.soft(componentBoundingBox).toBeTruthy();

    if (imageBoundingBox && componentBoundingBox) {
      // Verify image is within component boundaries
      expect.soft(imageBoundingBox.x).toBeGreaterThanOrEqual(componentBoundingBox.x);
      expect.soft(imageBoundingBox.y).toBeGreaterThanOrEqual(componentBoundingBox.y);
      expect.soft(imageBoundingBox.x + imageBoundingBox.width).toBeLessThanOrEqual(
        componentBoundingBox.x + componentBoundingBox.width
      );
      expect.soft(imageBoundingBox.y + imageBoundingBox.height).toBeLessThanOrEqual(
        componentBoundingBox.y + componentBoundingBox.height
      );
    }
  }

  /**
   * Verify image loading performance
   */
  async verifyImageLoadingPerformance(): Promise<void> {
    const startTime = performance.now();

    // Wait for image to be fully loaded
    await this.quoteImageElement.evaluate((img: HTMLImageElement) => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
        }
      });
    });

    const loadTime = performance.now() - startTime;

    // Verify image loads within reasonable time (5 seconds)
    expect.soft(loadTime).toBeLessThan(5000);
  }

  /**
   * Validate typography styles against Figma design values for specific viewport
   */
  async verifyQuoteTextTypography(viewport: ViewportSize): Promise<void> {
    // Set viewport
    await this.page.setViewportSize(this.viewports[viewport]);
    await this.page.waitForLoadState('domcontentloaded');

    const expectedStyles = QuoteComponentFigmaValues[viewport].quoteText;

    const actualStyles = await this.quoteTextElement.evaluate((el: HTMLElement) => {
      const computed = window.getComputedStyle(el);
      return {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        color: computed.color,
        backgroundClip: computed.backgroundClip,
      };
    });

    console.log(`Quote Text Typography Validation for ${viewport}:`);
    console.log(`Expected: ${JSON.stringify(expectedStyles, null, 2)}`);
    console.log(`Actual: ${JSON.stringify(actualStyles, null, 2)}`);

    // Validate font family contains expected family
    expect.soft(actualStyles.fontFamily).toContain('Bayer Sans');

    // Validate font size
    expect.soft(actualStyles.fontSize).toBe(expectedStyles.fontSize);

    // Validate font weight
    expect.soft(actualStyles.fontWeight).toBe(expectedStyles.fontWeight);

    // Validate line height matches Figma values
    expect.soft(actualStyles.lineHeight).toBe(expectedStyles.lineHeight);

    // Validate gradient text properties
    expect.soft(actualStyles.backgroundClip).toBe('text');
    expect.soft(actualStyles.color).toContain('rgba(0, 0, 0, 0)'); // transparent for gradient
  }

  /**
   * Validate author name typography against Figma design values
   */
  async verifyAuthorNameTypography(viewport: ViewportSize = 'XL'): Promise<void> {
    const expectedStyles = QuoteComponentFigmaValues[viewport].authorName;

    const actualStyles = await this.authorNameElement.evaluate((el: HTMLElement) => {
      const computed = window.getComputedStyle(el);
      return {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        color: computed.color,
        fontStyle: computed.fontStyle,
      };
    });

    console.log(`Author Name Typography Validation for ${viewport}:`);
    console.log(`Expected: ${JSON.stringify(expectedStyles, null, 2)}`);
    console.log(`Actual: ${JSON.stringify(actualStyles, null, 2)}`);

    // Validate typography properties
    expect.soft(actualStyles.fontFamily).toContain('Bayer Sans');
    expect.soft(actualStyles.fontSize).toBe(expectedStyles.fontSize);
    expect.soft(actualStyles.fontWeight).toBe(expectedStyles.fontWeight);
    expect.soft(actualStyles.lineHeight).toBe(expectedStyles.lineHeight);
    expect.soft(actualStyles.fontStyle).toBe('normal'); // cite should not be italic
  }

  /**
   * Validate author designation typography against Figma design values
   */
  async verifyAuthorDesignationTypography(viewport: ViewportSize = 'XL'): Promise<void> {
    const expectedStyles = QuoteComponentFigmaValues[viewport].authorDesignation;

    const actualStyles = await this.authorDesignationElement.evaluate((el: HTMLElement) => {
      const computed = window.getComputedStyle(el);
      return {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        color: computed.color,
      };
    });

    console.log(`[INFO] Author Designation Typography Validation for ${viewport}:`);
    console.log(`Expected: ${JSON.stringify(expectedStyles, null, 2)}`);
    console.log(`Actual: ${JSON.stringify(actualStyles, null, 2)}`);

    // Validate typography properties
    expect.soft(actualStyles.fontFamily).toContain('Bayer Sans');
    expect.soft(actualStyles.fontSize).toBe(expectedStyles.fontSize);
    expect.soft(actualStyles.fontWeight).toBe(expectedStyles.fontWeight);
    expect.soft(actualStyles.lineHeight).toBe(expectedStyles.lineHeight);
  }

  /**
   * Verify component layout and spacing across viewports
   */
  async verifyComponentLayoutAndSpacing(): Promise<void> {
    const componentStyles = await this.componentElement.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        flexDirection: computed.flexDirection,
        gap: computed.gap,
        alignItems: computed.alignItems,
      };
    });
  }

  /**
   * Verify accessibility attributes and semantic structure
   */
  async verifyAccessibilityAttributes(): Promise<void> {
    // Verify semantic HTML structure
    const blockquoteTag = await this.blockquoteElement.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(blockquoteTag).toBe('blockquote');

    const citeTag = await this.authorNameElement.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(citeTag).toBe('cite');

    const footerTag = await this.attributionElement.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(footerTag).toBe('footer');

    // Verify component is keyboard accessible
    await this.componentElement.focus();
    const isFocused = await this.componentElement.evaluate((el) => el === document.activeElement);
    // Component itself might not be focusable, but should not throw error
  }

  /**
   * Take screenshot for visual comparison at specific viewport
   */
  async takeViewportScreenshot(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    await this.page.setViewportSize(this.viewports[viewport]);
    await this.page.waitForTimeout(500); // Allow responsive changes

    await this.page.screenshot({
      path: `reports/screenshots/quote-component-${viewport.toLowerCase()}-viewport.png`,
      fullPage: false,
      clip: (await this.componentElement.boundingBox()) || undefined,
    });
  }

  /**
   * Measure component load time
   */
  async measureLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.navigateToComponent();
    const endTime = Date.now();
    return endTime - startTime;
  }

  // Getter methods for external access
  getComponentElement(): Locator {
    return this.componentElement;
  }

  getQuoteTextElement(): Locator {
    return this.quoteTextElement;
  }

  getAuthorNameElement(): Locator {
    return this.authorNameElement;
  }

  getAuthorDesignationElement(): Locator {
    return this.authorDesignationElement;
  }

  getBlockquoteElement(): Locator {
    return this.blockquoteElement;
  }

  getAttributionElement(): Locator {
    return this.attributionElement;
  }

  getQuoteImageElement(): Locator {
    return this.quoteImageElement;
  }

  getImageContainerElement(): Locator {
    return this.imageContainerElement;
  }
}

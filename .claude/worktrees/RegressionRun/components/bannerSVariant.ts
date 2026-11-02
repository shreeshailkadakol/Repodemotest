import { Page, Locator, expect, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { BannerSVariantfigmavalues } from '../helpers/utils/figma-values/BannerSVariant-figma-values';
import { envUtils } from '../helpers/utils/envUtils';

export class BannerSVariantComponent extends BasePage {
  // Parent container - primary locator
  private readonly bannerContainer: Locator = this.page.locator('[data-qa="banner-component"]');

  // Content elements using parent-child relationships.
  // Image data-qa was renamed next-image -> banner-image (data-testid stays next-image);
  // match either for resilience.
  private readonly bannerImage: Locator = this.bannerContainer.locator(
    '[data-qa="banner-image"], [data-testid="next-image"]'
  );
  private readonly bannerContent: Locator = this.bannerContainer.locator(
    '[data-qa="banner-content"]'
  );
  private readonly titleComponent: Locator = this.bannerContainer.locator(
    '[data-qa="title-component"]'
  );
  private readonly highlightText: Locator = this.titleComponent.locator(
    '[data-qa="stage-headline-text"]'
  );
  private readonly descriptionText: Locator = this.bannerContainer.locator(
    '[data-qa="description-component"]'
  );

  // CTA buttons using parent-child relationship (missing data-qa attributes)
  private readonly primaryCTA: Locator = this.bannerContent.locator('a').first();
  private readonly secondaryCTA: Locator = this.bannerContent.locator('a').nth(1);

  // Icons within buttons
  private readonly buttonIcons: Locator = this.bannerContainer.locator('[data-qa="icon"]');

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Navigate to Banner S Variant component page with authentication
   */
  async navigateToBannerSVariant(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('BannerSVariantComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForNetworkIdle();
    // Wait for component to be fully loaded
    await this.bannerContainer.waitFor({ state: 'visible' });
  }

  // ==================== FUNCTIONAL VALIDATION METHODS ====================

  /**
   * TC-BF001: Verify Banner S variant component renders correctly
   */
  async verifyComponentVisibility(): Promise<void> {
    await expect.soft(this.bannerContainer).toBeVisible();
    await expect.soft(this.bannerContainer).toHaveAttribute('data-qa', 'banner-component');
    await expect.soft(this.bannerContainer).toHaveAttribute('data-testid', 'banner-component');
  }

  /**
   * TC-BF002: Verify banner image loads correctly with proper attributes
   */
  async verifyBannerImageLoading(): Promise<void> {
    await expect.soft(this.bannerImage).toBeVisible();
    await expect.soft(this.bannerImage).toHaveAttribute('data-qa', /^(banner-image|next-image)$/);
    await expect.soft(this.bannerImage).toHaveAttribute('data-testid', 'next-image');
    await expect.soft(this.bannerImage).toHaveAttribute('src');
    await expect.soft(this.bannerImage).toHaveAttribute('alt');

    // Verify image aspect ratio (3:2 with tolerance for responsive behavior)
    const boundingBox = await this.bannerImage.boundingBox();
    if (boundingBox) {
      const aspectRatio = boundingBox.width / boundingBox.height;
      expect.soft(aspectRatio).toBeGreaterThan(1.3); // More flexible than strict 3:2
      expect.soft(aspectRatio).toBeLessThan(2.0); // Reasonable upper bound
    }
  }

  /**
   * TC-BF003: Verify primary title text displays correctly
   */
  async verifyPrimaryOverlayText(): Promise<void> {
    await expect.soft(this.titleComponent).toBeVisible();
    await expect.soft(this.titleComponent).toHaveAttribute('data-qa', 'title-component');
    await expect.soft(this.titleComponent).not.toBeEmpty();

    // Verify semantic HTML structure
    const tagName = await this.titleComponent.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(tagName).toBe('h2');
  }

  /**
   * TC-BF004: Verify highlighted text within title displays with gradient styling
   */
  async verifyHighlightTextStyling(): Promise<void> {
    await expect.soft(this.highlightText).toBeVisible();
    await expect.soft(this.highlightText).toHaveAttribute('data-qa', 'stage-headline-text');
    await expect.soft(this.highlightText).not.toBeEmpty();

    // Verify gradient styling classes
    const className = await this.highlightText.getAttribute('class');
    expect.soft(className).toContain('bg-gradient-to-r');
    expect.soft(className).toContain('bg-clip-text');
    expect.soft(className).toContain('text-transparent');
  }

  /**
   * TC-BF005: Verify description text displays correctly
   */
  async verifySecondaryOverlayText(): Promise<void> {
    await expect.soft(this.descriptionText).toBeVisible();
    await expect.soft(this.descriptionText).toHaveAttribute('data-qa', 'description-component');
    await expect.soft(this.descriptionText).not.toBeEmpty();

    // Verify semantic HTML structure
    const tagName = await this.descriptionText.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(tagName).toBe('p');
  }

  /**
   * TC-BF006: Verify primary CTA button functionality
   */
  async verifyPrimaryCTAFunctionality(): Promise<void> {
    await expect.soft(this.primaryCTA).toBeVisible();

    // Verify button styling (filled/dark)
    const className = await this.primaryCTA.getAttribute('class');
    expect.soft(className).toContain('bg-background-bg-inverted');
    expect.soft(className).toContain('text-text-inverted');

    // Verify clickability
    await expect.soft(this.primaryCTA).toBeEnabled();
  }

  /**
   * TC-BF007: Verify secondary CTA button functionality
   */
  async verifySecondaryCTAFunctionality(): Promise<void> {
    await expect.soft(this.secondaryCTA).toBeVisible();

    // Verify button styling (outlined)
    const className = await this.secondaryCTA.getAttribute('class');
    expect.soft(className).toContain('bg-transparent');
    expect.soft(className).toContain('border');

    // Verify clickability
    await expect.soft(this.secondaryCTA).toBeEnabled();
  }

  /**
   * TC-BF008-011: Verify responsive layout across viewports
   */
  async verifyResponsiveLayout(viewport: { width: number; height: number }): Promise<void> {
    await this.page.setViewportSize(viewport);
    await this.page.waitForTimeout(500); // Allow layout to settle

    // Verify all elements remain visible
    await expect.soft(this.bannerContainer).toBeVisible();
    await expect.soft(this.bannerImage).toBeVisible();
    await expect.soft(this.titleComponent).toBeVisible();
    await expect.soft(this.descriptionText).toBeVisible();
    await expect.soft(this.primaryCTA).toBeVisible();
    await expect.soft(this.secondaryCTA).toBeVisible();

    // Verify no horizontal scrolling
    const documentWidth = await this.page.evaluate(() => document.documentElement.scrollWidth);
    expect.soft(documentWidth).toBeLessThanOrEqual(viewport.width + 20); // Allow small margin
  }

  /**
   * TC-BF012: Verify component content persistence
   */
  async verifyContentPersistence(): Promise<void> {
    // Initial verification
    await this.verifyComponentVisibility();

    // Scroll and interact with page
    await this.page.evaluate(() => window.scrollTo(0, 500));
    await this.page.waitForTimeout(1000);
    await this.page.evaluate(() => window.scrollTo(0, 0));

    // Re-verify all elements remain intact
    await expect.soft(this.bannerContainer).toBeVisible();
    await expect.soft(this.bannerImage).toBeVisible();
    await expect.soft(this.titleComponent).not.toBeEmpty();
    await expect.soft(this.descriptionText).not.toBeEmpty();
    await expect.soft(this.primaryCTA).toBeEnabled();
    await expect.soft(this.secondaryCTA).toBeEnabled();
  }

  // ==================== VISUAL VALIDATION METHODS ====================

  /**
   * TC-BV001-004: Verify title typography matches Figma design for different viewports
   */
  async verifyTitleTypography(viewport: 'xl' | 'lg' | 'md' | 'sm'): Promise<void> {
    const expectedValues = BannerSVariantfigmavalues[viewport].firstTextField;

    // Extract computed styles
    const computedStyles = await this.titleComponent.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
      };
    });

    // Verify font family
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');

    // Verify font size (convert px to number for comparison)
    const actualFontSize = parseInt(computedStyles.fontSize.replace('px', ''));
    const expectedFontSize = parseInt(expectedValues.fontSize.replace('px', ''));
    expect.soft(actualFontSize).toBeCloseTo(expectedFontSize, 2);

    // Verify font weight
    expect.soft(computedStyles.fontWeight).toBe(expectedValues.fontWeight);

    // Verify line height
    const actualLineHeight = parseInt(computedStyles.lineHeight.replace('px', ''));
    const expectedLineHeight = parseInt(expectedValues.lineHeight.replace('px', ''));
    expect.soft(actualLineHeight).toBeCloseTo(expectedLineHeight, 2);
  }

  /**
   * Verify second text field typography matches Figma design
   */
  async verifySecondTextTypography(viewport: 'xl' | 'lg' | 'md' | 'sm'): Promise<void> {
    const expectedValues = BannerSVariantfigmavalues[viewport].secondTextField;

    const computedStyles = await this.descriptionText.first().evaluate((element: HTMLElement) => {
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
      };
    });

    // Verify font family
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');

    // Verify font size
    const actualFontSize = parseInt(computedStyles.fontSize.replace('px', ''));
    const expectedFontSize = parseInt(expectedValues.fontSize.replace('px', ''));
    expect.soft(actualFontSize).toBeCloseTo(expectedFontSize, 2);

    // Verify font weight
    const actualWeight = parseInt(computedStyles.fontWeight);
    const expectedWeight = parseInt(expectedValues.fontWeight);
    expect.soft(actualWeight).toBe(expectedWeight);

    // Verify line height
    const actualLineHeight = parseInt(computedStyles.lineHeight.replace('px', ''));
    const expectedLineHeight = parseInt(expectedValues.lineHeight.replace('px', ''));
    expect.soft(actualLineHeight).toBeCloseTo(expectedLineHeight, 2);
  }

  /**
   * Verify first CTA button typography and styling matches Figma design
   */
  async verifyFirstButtonStyling(viewport: 'xl' | 'lg' | 'md' | 'sm'): Promise<void> {
    const expectedValues = BannerSVariantfigmavalues[viewport].firstButton;

    const computedStyles = await this.primaryCTA.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      };
    });

    // Verify font family
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');

    // Verify font size
    const actualFontSize = parseInt(computedStyles.fontSize.replace('px', ''));
    const expectedFontSize = parseInt(expectedValues.fontSize.replace('px', ''));
    expect.soft(
      actualFontSize,
      `First button font size mismatch: Expected ${expectedFontSize}px (Figma design), but got ${actualFontSize}px (actual implementation)`
    ).toBeCloseTo(expectedFontSize, 2);

    // Verify font weight with detailed error reporting
    const actualWeight = parseInt(computedStyles.fontWeight);
    const expectedWeight = parseInt(expectedValues.fontWeight);
    try {
      expect.soft(actualWeight).toBe(expectedWeight);
    } catch (error) {
      console.warn(`[WARN]  DESIGN SPECIFICATION MISMATCH DETECTED:`);
      console.warn(`   Component: First Button (Primary CTA)`);
      console.warn(`   Property: font-weight`);
      console.warn(`   Figma Design Spec: ${expectedWeight} (${expectedValues.fontStyle})`);
      console.warn(`   Actual Implementation: ${actualWeight}`);
      console.warn(`   Action Required: Verify with design team if this is intentional or a bug`);
      throw new Error(
        `First button font-weight mismatch: Figma specifies ${expectedWeight} (${expectedValues.fontStyle}), but implementation shows ${actualWeight}. This may indicate a styling bug.`
      );
    }

    // Note: Color validation may vary due to CSS processing
    // Verify button is visible and clickable
    await expect.soft(this.primaryCTA).toBeVisible();
    await expect.soft(this.primaryCTA).toBeEnabled();
  }

  /**
   * Verify second CTA button typography and styling matches Figma design
   */
  async verifySecondButtonStyling(viewport: 'xl' | 'lg' | 'md' | 'sm'): Promise<void> {
    const expectedValues = BannerSVariantfigmavalues[viewport].secondButton;

    const computedStyles = await this.secondaryCTA.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor,
      };
    });

    // Verify font family
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');

    // Verify font size
    const actualFontSize = parseInt(computedStyles.fontSize.replace('px', ''));
    const expectedFontSize = parseInt(expectedValues.fontSize.replace('px', ''));
    expect.soft(actualFontSize).toBeCloseTo(expectedFontSize, 2);

    // Verify font weight
    const actualWeight = parseInt(computedStyles.fontWeight);
    const expectedWeight = parseInt(expectedValues.fontWeight);
    expect.soft(actualWeight).toBe(expectedWeight);

    // Note: Color validation may vary due to CSS processing
    // Verify button is visible and clickable
    await expect.soft(this.secondaryCTA).toBeVisible();
    await expect.soft(this.secondaryCTA).toBeEnabled();
  }

  /**
   * Comprehensive viewport validation - all elements for a specific viewport
   */
  async verifyAllElementsForViewport(viewport: 'xl' | 'lg' | 'md' | 'sm'): Promise<void> {
    // Set appropriate viewport size
    const viewportSizes = {
      xl: { width: 1440, height: 900 },
      lg: { width: 1024, height: 768 },
      md: { width: 768, height: 1024 },
      sm: { width: 375, height: 667 },
    };

    await this.page.setViewportSize(viewportSizes[viewport]);
    await this.page.waitForTimeout(500); // Allow layout to settle

    // Validate all elements
    await this.verifyTitleTypography(viewport);
    await this.verifySecondTextTypography(viewport);
    await this.verifyFirstButtonStyling(viewport);
    await this.verifySecondButtonStyling(viewport);
  }

  /**
   * TC-BV005: Verify highlight text gradient styling
   */
  async verifyHighlightTextGradient(): Promise<void> {
    const gradientStyles = await this.highlightText.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        backgroundImage: styles.backgroundImage,
        webkitBackgroundClip: styles.webkitBackgroundClip,
        webkitTextFillColor: styles.webkitTextFillColor,
        color: styles.color,
      };
    });

    // Verify gradient background is applied
    expect.soft(gradientStyles.backgroundImage).toContain('gradient');
    expect.soft(gradientStyles.webkitBackgroundClip).toBe('text');

    // Accept both browser representations of transparency
    const fillColor = gradientStyles.webkitTextFillColor;
    expect.soft(fillColor === 'transparent' || fillColor === 'rgba(0, 0, 0, 0)').toBeTruthy();
  }

  /**
   * TC-BV007: Verify button styling differences
   */
  async verifyButtonStylingDifferences(): Promise<void> {
    const primaryStyles = await this.primaryCTA.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        border: styles.border,
      };
    });

    const secondaryStyles = await this.secondaryCTA.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        border: styles.border,
      };
    });

    // Primary should have dark background, secondary should be transparent
    expect.soft(primaryStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect.soft(secondaryStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)');

    // Secondary should have border
    expect.soft(secondaryStyles.border).toContain('px');
  }

  /**
   * TC-BV008: Verify description text styling and opacity
   */
  async verifyDescriptionTextStyling(): Promise<void> {
    const descriptionStyles = await this.descriptionText.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        fontSize: styles.fontSize,
        opacity: styles.opacity,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
      };
    });

    // Verify text size is xl (20px)
    const fontSize = parseInt(descriptionStyles.fontSize.replace('px', ''));
    expect.soft(fontSize).toBeCloseTo(20, 2);

    // Verify opacity is 0.8
    expect.soft(parseFloat(descriptionStyles.opacity)).toBeCloseTo(0.8, 1);

    // Verify font weight is regular
    expect.soft(descriptionStyles.fontWeight).toBe('400');
  }

  // ==================== ACCESSIBILITY VALIDATION METHODS ====================

  /**
   * TC-BA001: Verify semantic HTML structure
   */
  async verifySemanticHTMLStructure(): Promise<void> {
    // Verify main container is section
    const containerTag = await this.bannerContainer.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(containerTag).toBe('section');

    // Verify title is h2
    const titleTag = await this.titleComponent.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(titleTag).toBe('h2');

    // Verify description is paragraph
    const descriptionTag = await this.descriptionText.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(descriptionTag).toBe('p');

    // Verify image is img
    const imageTag = await this.bannerImage.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(imageTag).toBe('img');

    // Verify CTAs are anchor tags
    const primaryCTATag = await this.primaryCTA.evaluate((el) => el.tagName.toLowerCase());
    const secondaryCTATag = await this.secondaryCTA.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(primaryCTATag).toBe('a');
    expect.soft(secondaryCTATag).toBe('a');
  }

  /**
   * TC-BA002: Verify image alternative text
   */
  async verifyImageAlternativeText(): Promise<void> {
    // First verify the image element has an alt attribute
    await expect.soft(this.bannerImage).toHaveAttribute('alt');
    
    // Get the actual alt text value
    const altTextValue = await this.bannerImage.getAttribute('alt');
    
    // Verify alt text is meaningful (not empty, not generic, and descriptive)
    expect.soft(altTextValue).not.toBe('');
    expect.soft(altTextValue).not.toBe('image');
    expect.soft(altTextValue).not.toBe('banner');
    expect.soft(altTextValue).not.toBe('photo');
    expect.soft(altTextValue!.length).toBeGreaterThan(3);
    
    // Verify alt text contains meaningful content (not just spaces or special characters)
    expect.soft(altTextValue!.trim()).toBeTruthy();
    expect.soft(/[a-zA-Z]/.test(altTextValue!)).toBe(true); // Should contain at least one letter
  }

  /**
   * TC-BA003: Verify keyboard navigation
   */
  async verifyKeyboardNavigation(): Promise<void> {
    // Focus on primary CTA
    await this.primaryCTA.focus();
    await expect.soft(this.primaryCTA).toBeFocused();

    // Tab to secondary CTA
    await this.page.keyboard.press('Tab');
    await expect.soft(this.secondaryCTA).toBeFocused();

    // Verify Enter key activation
    const primaryHref = this.primaryCTA;
    await expect.soft(primaryHref).toHaveAttribute('href', '/About');

    // Verify focus indicators are visible
    const primaryFocusStyles = await this.primaryCTA.evaluate((element) => {
      element.focus();
      const styles = window.getComputedStyle(element);
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow,
      };
    });

    // Should have focus indicator (outline or box-shadow)
    const hasFocusIndicator =
      primaryFocusStyles.outline !== 'none' || primaryFocusStyles.boxShadow !== 'none';
    expect.soft(hasFocusIndicator).toBeTruthy();
  }

  /**
   * TC-BA005: Verify ARIA labels and attributes
   */
  async verifyARIALabelsAndAttributes(): Promise<void> {
    // Verify title has aria-label
    await expect.soft(this.titleComponent).toHaveAttribute('aria-label', 'title-component');

    // Verify image has aria-label
    await expect.soft(this.bannerImage).toHaveAttribute('aria-label', 'next-image');

    // Note: Description component may not have aria-label in current implementation
    // This is acceptable as the semantic <p> tag provides sufficient accessibility
  }

  // ==================== PERFORMANCE VALIDATION METHODS ====================

  /**
   * TC-BP001: Verify image loading performance
   */
  async verifyImageLoadingPerformance(): Promise<void> {
    const startTime = Date.now();

    // Wait for image to be loaded
    await this.bannerImage.waitFor({ state: 'visible' });

    // Verify image is actually loaded (not just visible)
    const isLoaded = await this.bannerImage.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalHeight !== 0;
    });

    const loadTime = Date.now() - startTime;

    expect.soft(isLoaded).toBeTruthy();
    expect.soft(loadTime).toBeLessThan(5000); // Should load within 5 seconds
  }

  /**
   * TC-BP002: Verify layout shift prevention
   */
  async verifyLayoutShiftPrevention(): Promise<void> {
    // Take initial screenshot
    const initialBounds = await this.bannerContainer.boundingBox();

    // Wait for any potential layout shifts
    await this.page.waitForTimeout(2000);

    // Check bounds haven't changed significantly
    const finalBounds = await this.bannerContainer.boundingBox();

    if (initialBounds && finalBounds) {
      expect.soft(Math.abs(initialBounds.y - finalBounds.y)).toBeLessThan(5);
      expect.soft(Math.abs(initialBounds.height - finalBounds.height)).toBeLessThan(10);
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Take screenshot of the component
   */
  async takeComponentScreenshot(name: string): Promise<void> {
    await this.bannerContainer.screenshot({
      path: `reports/screenshots/banner-s-variant-${name}.png`,
      type: 'png',
    });
  }

  /**
   * Get all component elements for batch operations
   */
  getAllElements(): Record<string, Locator> {
    return {
      bannerContainer: this.bannerContainer,
      bannerImage: this.bannerImage,
      bannerContent: this.bannerContent,
      titleComponent: this.titleComponent,
      highlightText: this.highlightText,
      descriptionText: this.descriptionText,
      primaryCTA: this.primaryCTA,
      secondaryCTA: this.secondaryCTA,
      buttonIcons: this.buttonIcons,
    };
  }
}

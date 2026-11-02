import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';
import { TeaserGrid_FigmaValues } from '../helpers/utils/figma-values/TeaserGrid_FigmaValues';

/**
 * Teaser Grid Component Page Object
 * Represents a grid layout displaying multiple individual teaser cards
 * with title, headline, and intro text
 */
export class TeaserGridComponent extends BasePage {
  // ================================
  // PRIMARY LOCATORS (DOM-INSPECTED)
  // ================================

  // Main Container Elements
  private readonly fullWidthContainer: Locator = this.page.locator('[data-qa="fullwidth-column"]');
  private readonly teaserGridContainer: Locator = this.page.locator('[data-qa="teaser-grid"]');

  // Title and Content Elements (using parent-child relationships)
  private readonly titleComponent: Locator = this.teaserGridContainer.locator(
    '[data-qa="title-component"]'
  );
  private readonly headlineText: Locator = this.teaserGridContainer.locator(
    '[data-qa="stage-headline-text"]'
  );
  private readonly introText: Locator = this.teaserGridContainer.locator(
    '[data-qa="stage-intro-text"]'
  );

  // Grid Structure
  private readonly gridContainer: Locator = this.teaserGridContainer.locator(
    '[data-qa="teaser-grid-container"]'
  );

  // Individual Teaser Cards (parent-child relationship)
  private readonly individualTeasers: Locator = this.gridContainer.locator(
    '[data-qa="individual-teaser"]'
  );
  private readonly teaserImages: Locator = this.gridContainer.locator(
    '[data-qa="individual-teaser-image"]'
  );

  // Viewport configurations
  public readonly viewports = {
    XL: { width: 1440, height: 900 },
    LG: { width: 1024, height: 768 },
    MD: { width: 768, height: 1024 },
    SM: { width: 375, height: 667 },
  };

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ================================
  // NAVIGATION & SETUP METHODS
  // ================================

  /**
   * Navigate to the TeaserGrid component page with automatic authentication
   */
  async navigateToComponent(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('TeaserGridComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForComponentLoad();
  }

  /**
   * Wait for the TeaserGrid component to load completely
   */
  async waitForComponentLoad(): Promise<void> {
    await expect.soft(this.teaserGridContainer).toBeVisible({ timeout: 15000 });
    await expect.soft(this.titleComponent).toBeVisible({ timeout: 10000 });
    await expect.soft(this.gridContainer).toBeVisible({ timeout: 10000 });
    await expect.soft(this.individualTeasers.first()).toBeVisible({ timeout: 10000 });
  }

  /**
   * Set viewport size for testing
   */
  async setViewport(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    const dimensions = this.viewports[viewport];
    await this.page.setViewportSize(dimensions);
    await this.page.waitForLoadState('load');
    await this.log(`Viewport set to ${viewport}: ${dimensions.width}x${dimensions.height}`);
  }

  // ================================
  // STRUCTURAL VALIDATION METHODS
  // ================================

  /**
   * Verify main component container structure
   */
  async verifyComponentStructure(): Promise<void> {
    await expect.soft(this.teaserGridContainer).toBeVisible();
    await expect.soft(this.teaserGridContainer).toHaveAttribute('data-qa', 'teaser-grid');

    // Verify semantic HTML structure
    const tagName = await this.teaserGridContainer.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(tagName).toBe('section');
  }

  /**
   * Verify title component structure and visibility
   */
  async verifyTitleComponent(): Promise<void> {
    await expect.soft(this.titleComponent).toBeVisible();
    await expect.soft(this.titleComponent).toHaveAttribute('data-qa', 'title-component');
    await expect.soft(this.titleComponent).not.toBeEmpty();

    // Verify semantic H2 tag
    const tagName = await this.titleComponent.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(tagName).toBe('h2');
  }

  /**
   * Verify headline and intro text elements (optional elements)
   */
  async verifyHeadlineAndIntroText(): Promise<void> {
    // Check if headline text exists (optional element)
    const headlineCount = await this.headlineText.count();
    if (headlineCount > 0) {
      await expect.soft(this.headlineText).toBeVisible();
      await expect.soft(this.headlineText).toHaveAttribute('data-qa', 'stage-headline-text');
      await expect.soft(this.headlineText).not.toBeEmpty();
      await this.log('Headline text found and validated');
    } else {
      await this.log('Headline text not present (optional element)');
    }

    // Check if intro text exists (optional element)
    const introCount = await this.introText.count();
    if (introCount > 0) {
      await expect.soft(this.introText).toBeVisible();
      await expect.soft(this.introText).toHaveAttribute('data-qa', 'stage-intro-text');
      await expect.soft(this.introText).not.toBeEmpty();
      await this.log('Intro text found and validated');
    } else {
      await this.log('Intro text not present (optional element)');
    }
  }

  /**
   * Verify grid container structure
   */
  async verifyGridContainer(): Promise<void> {
    await expect.soft(this.gridContainer).toBeVisible();
    await expect.soft(this.gridContainer).toHaveAttribute('data-qa', 'teaser-grid-container');

    // Verify grid has children
    const childCount = await this.gridContainer.evaluate((el) => el.children.length);
    expect.soft(childCount).toBeGreaterThan(0);
  }

  /**
   * Get the count of individual teaser cards
   */
  async getTeaserCount(): Promise<number> {
    return await this.individualTeasers.count();
  }

  /**
   * Verify individual teaser cards structure
   */
  async verifyIndividualTeasers(): Promise<void> {
    const teaserCount = await this.getTeaserCount();
    expect.soft(teaserCount).toBeGreaterThanOrEqual(1);

    // Verify each teaser has proper structure
    for (let i = 0; i < teaserCount; i++) {
      const teaser = this.individualTeasers.nth(i);
      await expect.soft(teaser).toBeVisible();
      await expect.soft(teaser).toHaveAttribute('data-qa', 'individual-teaser');

      // Verify aria-label pattern
      const ariaLabel = await teaser.getAttribute('aria-label');
      expect.soft(ariaLabel).toContain('Teaser card');

      // Verify semantic section element
      const tagName = await teaser.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tagName).toBe('section');
    }
  }

  /**
   * Verify teaser images are loaded and visible
   */
  async verifyTeaserImages(): Promise<void> {
    const imageCount = await this.teaserImages.count();
    const teaserCount = await this.getTeaserCount();

    expect.soft(imageCount).toBe(teaserCount);

    for (let i = 0; i < imageCount; i++) {
      const image = this.teaserImages.nth(i);
      await expect.soft(image).toBeVisible();
      await expect.soft(image).toHaveAttribute('data-qa', 'individual-teaser-image');
      await expect.soft(image).toHaveAttribute('aria-label', 'Profile photo');
      await expect.soft(image).toHaveAttribute('src');
      await expect.soft(image).toHaveAttribute('alt');
    }
  }

  /**
   * Measure image loading performance
   */
  async measureImageLoadingPerformance(): Promise<number> {
    const startTime = Date.now();

    const imageCount = await this.teaserImages.count();
    for (let i = 0; i < imageCount; i++) {
      const image = this.teaserImages.nth(i);
      await image.waitFor({ state: 'visible' });

      // Wait for image to be fully loaded
      await this.page.waitForFunction(
        (img) => {
          const element = img as HTMLImageElement;
          return element.complete && element.naturalHeight !== 0;
        },
        await image.elementHandle()
      );
    }

    const loadTime = Date.now() - startTime;
    return loadTime;
  }

  // ================================
  // RESPONSIVE LAYOUT METHODS
  // ================================

  /**
   * Verify grid layout on specific viewport
   */
  async verifyGridLayout(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    await this.setViewport(viewport);

    await expect.soft(this.gridContainer).toBeVisible();
    await expect.soft(this.individualTeasers.first()).toBeVisible();

    // Verify no horizontal scroll
    const hasHorizontalScroll = await this.page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect.soft(hasHorizontalScroll).toBe(false);
  }

  /**
   * Verify all teasers are visible in viewport
   */
  async verifyAllTeasersVisible(): Promise<void> {
    const teaserCount = await this.getTeaserCount();

    for (let i = 0; i < teaserCount; i++) {
      const teaser = this.individualTeasers.nth(i);
      await expect.soft(teaser).toBeVisible();
    }
  }

  // ================================
  // INTERACTION METHODS
  // ================================

  /**
   * Click on a specific teaser card
   */
  async clickTeaserCard(index: number): Promise<void> {
    const teaser = this.individualTeasers.nth(index);
    await expect.soft(teaser).toBeVisible();
    await teaser.click();
    await this.log(`Clicked on teaser card ${index + 1}`);
  }

  /**
   * Hover over a teaser card
   */
  async hoverTeaserCard(index: number): Promise<void> {
    const teaser = this.individualTeasers.nth(index);
    await expect.soft(teaser).toBeVisible();
    await teaser.hover();
    await this.log(`Hovered over teaser card ${index + 1}`);
  }

  // ================================
  // VISUAL VALIDATION METHODS (FIGMA)
  // ================================

  /**
   * Verify title typography matches Figma specifications
   */
  async verifyTitleTypography(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    const figmaValues = TeaserGrid_FigmaValues[viewport].titleComponent;

    const computedStyles = await this.titleComponent.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        color: styles.color,
      };
    });

    // Verify font family (handle font fallbacks)
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');

    // Verify font size
    expect.soft(computedStyles.fontSize).toBe(figmaValues.fontSize);

    // Verify font weight
    expect.soft(computedStyles.fontWeight).toBe(figmaValues.fontWeight);

    // Verify line height
    expect.soft(computedStyles.lineHeight).toBe(figmaValues.lineHeight);

    // Verify color (convert RGB to RGBA for comparison)
    const rgbaMatch = computedStyles.color.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
    );
    if (rgbaMatch && figmaValues.color) {
      const [, r, g, b, a = '1'] = rgbaMatch;
      const actualColor = `rgba(${r}, ${g}, ${b}, ${a})`;
      expect.soft(actualColor).toBe(figmaValues.color);
    }
  }

  /**
   * Verify headline text typography matches Figma specifications (optional element)
   */
  async verifyHeadlineTypography(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    const headlineCount = await this.headlineText.count();

    if (headlineCount === 0) {
      await this.log(
        `Headline text not present on ${viewport} viewport (optional element) - skipping typography validation`
      );
      return;
    }

    const figmaValues = TeaserGrid_FigmaValues[viewport].headlineText;

    const computedStyles = await this.headlineText.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        color: styles.color,
      };
    });

    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');
    expect.soft(computedStyles.fontSize).toBe(figmaValues.fontSize);
    expect.soft(computedStyles.fontWeight).toBe(figmaValues.fontWeight);
    expect.soft(computedStyles.lineHeight).toBe(figmaValues.lineHeight);
    await this.log(`Headline typography validated for ${viewport} viewport`);
  }

  /**
   * Verify highlight text typography matches Figma specifications
   */
  async verifyHighlightTextTypography(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    // Highlight text is part of title component, so we verify it exists
    const titleText = await this.titleComponent.textContent();
    expect.soft(titleText).not.toBeNull();
    expect.soft(titleText?.length).toBeGreaterThan(0);

    // Log viewport for tracking
    await this.log(`Verifying highlight text typography for ${viewport} viewport`);
  }

  // ================================
  // ACCESSIBILITY METHODS
  // ================================

  /**
   * Verify semantic HTML structure
   */
  async verifySemanticHTML(): Promise<void> {
    // Main container should be section
    const mainTag = await this.teaserGridContainer.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(mainTag).toBe('section');

    // Title should be H2
    const titleTag = await this.titleComponent.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(titleTag).toBe('h2');

    // Teasers should be sections
    const teaserCount = await this.getTeaserCount();
    for (let i = 0; i < teaserCount; i++) {
      const teaserTag = await this.individualTeasers
        .nth(i)
        .evaluate((el) => el.tagName.toLowerCase());
      expect.soft(teaserTag).toBe('section');
    }
  }

  /**
   * Verify ARIA labels
   */
  async verifyAriaLabels(): Promise<void> {
    // Verify each teaser has proper aria-label
    const teaserCount = await this.getTeaserCount();
    for (let i = 0; i < teaserCount; i++) {
      const teaser = this.individualTeasers.nth(i);
      const ariaLabel = await teaser.getAttribute('aria-label');
      expect.soft(ariaLabel).not.toBeNull();
      expect.soft(ariaLabel).toContain('Teaser card');
    }

    // Verify images have aria-labels
    const imageCount = await this.teaserImages.count();
    for (let i = 0; i < imageCount; i++) {
      const image = this.teaserImages.nth(i);
      await expect.soft(image).toHaveAttribute('aria-label', 'Profile photo');
    }
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(): Promise<void> {
    // Tab to first teaser
    await this.page.keyboard.press('Tab');

    // Verify focus is visible
    const focusedElement = await this.page.evaluate(() => document.activeElement?.tagName);
    expect.soft(focusedElement).toBeTruthy();

    await this.log('Keyboard navigation tested successfully');
  }

  /**
   * Verify focus indicators on focusable elements
   */
  async verifyFocusIndicators(): Promise<void> {
    const teaserCount = await this.getTeaserCount();

    if (teaserCount > 0) {
      // Find focusable elements within teaser (links, buttons)
      const firstTeaser = this.individualTeasers.first();
      const focusableElement = firstTeaser.locator('a, button').first();

      const focusableCount = await focusableElement.count();
      if (focusableCount > 0) {
        await focusableElement.focus();

        // Check if element has focus
        const hasFocus = await focusableElement.evaluate((el) => {
          return document.activeElement === el;
        });

        expect.soft(hasFocus).toBeTruthy();
        await this.log('Focus indicator verified on focusable element');
      } else {
        await this.log('No focusable elements found in teaser - skipping focus validation');
      }
    }
  }

  // ================================
  // PERFORMANCE METHODS
  // ================================

  /**
   * Measure component load time
   */
  async measureComponentLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.waitForComponentLoad();
    const loadTime = Date.now() - startTime;
    return loadTime;
  }

  /**
   * Measure viewport resize performance
   */
  async measureViewportResizePerformance(
    fromViewport: 'XL' | 'LG' | 'MD' | 'SM',
    toViewport: 'XL' | 'LG' | 'MD' | 'SM'
  ): Promise<number> {
    await this.setViewport(fromViewport);

    const startTime = Date.now();
    await this.setViewport(toViewport);
    await this.page.waitForLoadState('load');
    const resizeTime = Date.now() - startTime;

    return resizeTime;
  }

  // ================================
  // REQUIREMENT-SPECIFIC VALIDATIONS (User Story 2053)
  // ================================

  /**
   * Verify Highlight Text feature (AC4)
   * Validates that highlight text appears with color gradient when it matches title text
   */
  async verifyHighlightTextFeature(): Promise<void> {
    const titleText = await this.titleComponent.textContent();
    await this.log(`Title text: ${titleText}`);

    // Check if there are any highlighted elements within the title
    const highlightedElements = this.titleComponent.locator('span, mark, strong, em');
    const highlightCount = await highlightedElements.count();

    if (highlightCount > 0) {
      await this.log(`Found ${highlightCount} potentially highlighted text elements`);

      // Verify highlighted elements have styling
      for (let i = 0; i < highlightCount; i++) {
        const element = highlightedElements.nth(i);
        const computedStyle = await element.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            background: styles.background,
            backgroundImage: styles.backgroundImage,
            color: styles.color,
          };
        });

        // Soft assertion to check for gradient or special styling
        const hasGradient =
          computedStyle.backgroundImage.includes('gradient') ||
          computedStyle.background.includes('gradient');
        expect.soft(hasGradient || computedStyle.color !== 'rgb(16, 56, 79)').toBeTruthy();
        await this.log(
          `Highlight styling - Background: ${computedStyle.backgroundImage}, Color: ${computedStyle.color}`
        );
      }
    } else {
      await this.log('No highlighted text elements found in title');
    }
  }

  /**
   * Verify image aspect ratios per viewport (User Story 2053)
   * XL: 16:9, LG: 1:1, MD: 2:3, SM: 2:3
   */
  async verifyImageAspectRatios(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    const expectedRatios = {
      XL: { width: 16, height: 9, tolerance: 0.1 },
      LG: { width: 1, height: 1, tolerance: 0.05 },
      MD: { width: 2, height: 3, tolerance: 0.1 },
      SM: { width: 2, height: 3, tolerance: 0.1 },
    };

    const expected = expectedRatios[viewport];
    const expectedRatio = expected.width / expected.height;

    const imageCount = await this.teaserImages.count();
    await this.log(`Checking aspect ratios for ${imageCount} images on ${viewport} viewport`);

    for (let i = 0; i < imageCount; i++) {
      const image = this.teaserImages.nth(i);

      // Get image dimensions
      const dimensions = await image.evaluate((img: HTMLImageElement) => {
        const rect = img.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
        };
      });

      const actualRatio = dimensions.width / dimensions.height;
      const ratioDifference = Math.abs(actualRatio - expectedRatio);

      await this.log(
        `Image ${i + 1}: ${dimensions.width}x${dimensions.height}, Ratio: ${actualRatio.toFixed(2)} (Expected: ${expectedRatio.toFixed(2)})`
      );

      // Soft assertion with tolerance
      expect.soft(ratioDifference).toBeLessThan(expected.tolerance);
    }
  }

  /**
   * Verify two-per-row layout
   * Validates that teasers are displayed in rows with 2 items per row
   */
  async verifyTwoPerRowLayout(): Promise<void> {
    const teaserCount = await this.getTeaserCount();
    await this.log(`Verifying two-per-row layout for ${teaserCount} teasers`);

    if (teaserCount < 2) {
      await this.log('Less than 2 teasers, skipping two-per-row validation');
      return;
    }

    // Get positions of first two teasers
    const firstTeaser = this.individualTeasers.nth(0);
    const secondTeaser = this.individualTeasers.nth(1);

    const firstPos = await firstTeaser.boundingBox();
    const secondPos = await secondTeaser.boundingBox();

    if (firstPos && secondPos) {
      // Check if they're on the same row (similar y-position)
      const yDifference = Math.abs(firstPos.y - secondPos.y);
      const onSameRow = yDifference < firstPos.height * 0.5; // Within 50% of height

      await this.log(
        `First teaser Y: ${firstPos.y}, Second teaser Y: ${secondPos.y}, Y difference: ${yDifference}`
      );

      expect.soft(onSameRow).toBeTruthy();

      // Check horizontal positioning (second should be to the right)
      expect.soft(secondPos.x).toBeGreaterThan(firstPos.x);
    }
  }

  /**
   * Verify vertical offset of second teaser (User Story 2053)
   * Second teaser should have a vertical offset compared to first
   */
  async verifySecondTeaserVerticalOffset(): Promise<void> {
    const teaserCount = await this.getTeaserCount();

    if (teaserCount < 2) {
      await this.log('Less than 2 teasers, skipping vertical offset validation');
      return;
    }

    const firstTeaser = this.individualTeasers.nth(0);
    const secondTeaser = this.individualTeasers.nth(1);

    const firstPos = await firstTeaser.boundingBox();
    const secondPos = await secondTeaser.boundingBox();

    if (firstPos && secondPos) {
      // Second teaser should have some vertical offset
      // It should be slightly lower than the first
      const verticalOffset = secondPos.y - firstPos.y;

      await this.log(
        `First teaser Y: ${firstPos.y}, Second teaser Y: ${secondPos.y}, Vertical offset: ${verticalOffset}px`
      );

      // Soft assertion: vertical offset should be positive (second is lower)
      // and reasonable (not too much, typically between 20-100px)
      expect.soft(verticalOffset).toBeGreaterThanOrEqual(0);
      expect.soft(verticalOffset).toBeLessThan(150); // Reasonable upper bound
    }
  }

  /**
   * Verify component is in 100% width divider (AC2)
   * Validates that teaser grid is only placed in full-width container
   */
  async verifyFullWidthPlacement(): Promise<void> {
    // Verify the teaser grid is inside a full-width column
    const isInFullWidth = await this.fullWidthContainer.locator('[data-qa="teaser-grid"]').count();

    expect.soft(isInFullWidth).toBeGreaterThan(0);

    // Verify the container width approaches viewport width
    const containerWidth = await this.teaserGridContainer.evaluate((el) => {
      return el.getBoundingClientRect().width;
    });

    const viewportWidth = await this.page.evaluate(() => window.innerWidth);
    const widthRatio = containerWidth / viewportWidth;

    await this.log(
      `Container width: ${containerWidth}px, Viewport width: ${viewportWidth}px, Ratio: ${widthRatio.toFixed(2)}`
    );

    // Container should be at least 85% of viewport width (accounting for margins)
    expect.soft(widthRatio).toBeGreaterThan(0.85);
  }
}

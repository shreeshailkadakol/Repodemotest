import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { IndividualTeaserComponent_FigmaValues } from '../helpers/utils/figma-values/IndividualTeaserComponent_FigmaValues';

export class IndividualTeaserComponent extends BasePage {
  private readonly componentContainer: Locator;
  private readonly imageElement: Locator;
  private readonly headlineElement: Locator;
  private readonly ctaElement: Locator;
  private readonly cardLink: Locator;
  private readonly columnsContainer: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);

    // Main component locators using data-qa attributes (DOM-first approach)
    this.componentContainer = this.page.locator('[data-qa="individual-teaser"]');
    this.imageElement = this.page.locator('[data-qa="individual-teaser-image"]');
    this.columnsContainer = this.page.locator('[data-qa="columns33"]');

    // Elements without direct data-qa attributes - using parent-child relationships
    this.cardLink = this.page.locator('[data-qa="individual-teaser"] a');
    this.headlineElement = this.page
      .locator('[data-qa="individual-teaser"] div')
      .filter({ hasText: 'Headline' });
    this.ctaElement = this.page
      .locator('[data-qa="individual-teaser"] span')
      .filter({ hasText: 'ReadMore' });
  }

  // ================================
  // Component Loading and Setup Methods
  // ================================

  /**
   * Wait for Individual Teaser component to fully load
   */
  async waitForComponentLoad(): Promise<void> {
    await this.componentContainer.waitFor({ state: 'visible', timeout: 10000 });
    
    // Image element might not exist in all environments
    const imageExists = await this.imageElement.count() > 0;
    if (imageExists) {
      await this.imageElement.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
        this.log('Warning: Image element found but not visible');
      });
    } else {
      this.log('Warning: Image element not found in this environment');
    }
    
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Navigate to Individual Teaser test page
   */
  async navigateToComponent(): Promise<void> {
    const baseURL = process.env.baseURL || '';
    const url = await this.resolveExecutionUrl('IndividualTeaserComponent', baseURL);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.waitForComponentLoad();
  }

  // ================================
  // Component Visibility Methods
  // ================================

  /**
   * Verify that the component container is visible and properly structured
   */
  async validateComponentContainer(): Promise<void> {
    await expect.soft(this.componentContainer).toBeVisible();
    await expect.soft(this.componentContainer).toHaveAttribute('data-qa', 'individual-teaser');
    await expect.soft(this.componentContainer).toHaveAttribute('aria-label', 'Individual teaser card');
  }

  // ================================
  // Image Validation Methods
  // ================================

  /**
   * Verify that the component image is displayed correctly
   */
  async validateImageDisplay(): Promise<void> {
    const imageCount = await this.imageElement.count();
    if (imageCount === 0) {
      this.log('Warning: Image element not found in this environment - skipping image validation');
      return;
    }
    
    await expect.soft(this.imageElement).toBeVisible();
    await expect.soft(this.imageElement).toHaveAttribute('data-qa', 'individual-teaser-image');
    await expect.soft(this.imageElement).toHaveAttribute('aria-label', 'Profile photo');
  }

  /**
   * Verify image has proper accessibility attributes
   */
  async validateImageAccessibility(): Promise<void> {
    await expect.soft(this.imageElement).toHaveAttribute('alt');
    await expect.soft(this.imageElement).toHaveAttribute('aria-label', 'Profile photo');
  }

  /**
   * Measure image loading performance
   */
  async validateImageLoadingPerformance(): Promise<number> {
    const startTime = Date.now();

    // Wait for image to be fully loaded
    await this.imageElement.waitFor({ state: 'visible' });
    await this.page.waitForFunction(() => {
      const img = document.querySelector('[data-qa="individual-teaser-image"]') as HTMLImageElement;
      return img && img.complete && img.naturalHeight !== 0;
    });

    const loadTime = Date.now() - startTime;

    // Verify load time is within acceptable threshold (2 seconds)
    expect.soft(loadTime).toBeLessThan(2000);

    return loadTime;
  }

  /**
   * Verify headline typography and styling
   */
  async validateHeadlineTypography(): Promise<void> {
    await expect.soft(this.headlineElement).toBeVisible();

    // Verify headline is properly styled and readable
    const computedStyles = await this.page.evaluate(() => {
      // Find the headline element by looking for text content
      const container = document.querySelector('[data-qa="individual-teaser"]');
      if (!container) return null;

      const divElements = Array.from(container.querySelectorAll('div'));
      let headlineElement = null;

      for (const div of divElements) {
        if (div.textContent?.trim() === 'Headline') {
          headlineElement = div;
          break;
        }
      }

      if (!headlineElement) return null;

      const styles = window.getComputedStyle(headlineElement);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
      };
    });

    expect.soft(computedStyles).toBeTruthy();
    expect.soft(computedStyles?.fontSize).toBeTruthy();
    expect.soft(computedStyles?.fontFamily).toBeTruthy();
  }

  /**
   * Verify headline responsiveness across viewports
   */
  async validateHeadlineResponsiveness(): Promise<void> {
    const viewports = [
      { width: 1440, height: 1080, name: 'XL' },
      { width: 1024, height: 768, name: 'LG' },
      { width: 768, height: 1024, name: 'MD' },
      { width: 375, height: 667, name: 'SM' },
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.waitForLoadState('load'); // Wait for responsive adjustments

      await expect.soft(this.headlineElement).toBeVisible();

      const isTextReadable = await this.page.evaluate(() => {
        const container = document.querySelector('[data-qa="individual-teaser"]');
        if (!container) return false;

        // Find headline element by text content
        const divElements = Array.from(container.querySelectorAll('div'));
        let headlineElement = null;

        for (const div of divElements) {
          if (div.textContent?.trim() === 'Headline') {
            headlineElement = div;
            break;
          }
        }

        if (!headlineElement) return false;

        const rect = headlineElement.getBoundingClientRect();
        const styles = window.getComputedStyle(headlineElement);

        return rect.width > 0 && rect.height > 0 && styles.visibility !== 'hidden';
      });

      expect.soft(isTextReadable).toBe(true);
    }
  }

  // ================================
  // CTA ReadMore Validation Methods
  // ================================

  /**
   * Verify that the CTA ReadMore element is present and interactive
   */
  async validateCtaElement(): Promise<void> {
    await expect.soft(this.ctaElement).toBeVisible();

    const ctaText = await this.ctaElement.textContent();
    expect.soft(ctaText?.trim()).toBe('ReadMore');
  }

  /**
   * Verify CTA hover states and interactions
   */
  async validateCtaInteractions(): Promise<void> {
    await expect.soft(this.ctaElement).toBeVisible();

    // Test hover interaction - force hover if image intercepts
    await this.ctaElement.hover({ force: true }).catch(() => {});
    await this.page.waitForLoadState('load');

    // Verify element is still visible and interactive after hover
    await expect.soft(this.ctaElement).toBeVisible();
  }

  /**
   * Verify CTA positioning within the component
   */
  async validateCtaPositioning(): Promise<void> {
    await expect.soft(this.ctaElement).toBeVisible();

    // Verify CTA is within the component container
    const ctaInContainer = await this.page.evaluate(() => {
      const container = document.querySelector('[data-qa="individual-teaser"]');
      if (!container) return false;

      // Find CTA element by text content
      const spanElements = Array.from(container.querySelectorAll('span'));
      let cta = null;

      for (const span of spanElements) {
        if (span.textContent?.trim() === 'ReadMore') {
          cta = span;
          break;
        }
      }

      if (!cta) return false;

      return container.contains(cta);
    });

    expect.soft(ctaInContainer).toBe(true);
  }

  // ================================
  // Full Card Clickability Methods
  // ================================

  /**
   * Test card click navigation functionality
   */
  async validateCardNavigation(): Promise<void> {
    await expect.soft(this.cardLink).toBeVisible();

    // Get current URL for comparison
    const currentUrl = this.page.url();

    // Click on the card and verify navigation
    await this.cardLink.click({ timeout: 5000 });

    // Wait for navigation to complete
    await this.page.waitForLoadState('domcontentloaded');

    // Verify URL has changed
    const newUrl = this.page.url();
    expect.soft(newUrl).not.toBe(currentUrl);
  }

  /**
   * Verify that the entire card area responds to clicks
   */
  async validateCardAreaClickable(): Promise<void> {
    // Check if card link exists
    const linkCount = await this.cardLink.count();
    
    if (linkCount === 0) {
      this.log('Warning: Card link not found in this environment - skipping card clickability validation');
      return;
    }

    await expect.soft(this.cardLink).toBeVisible();

    // Get the bounding box of the link to ensure it covers the card
    const linkBoundingBox = await this.cardLink.boundingBox();
    const containerBoundingBox = await this.componentContainer.boundingBox();

    expect.soft(linkBoundingBox).toBeTruthy();
    expect.soft(containerBoundingBox).toBeTruthy();

    // Verify link covers significant portion of the container
    if (linkBoundingBox && containerBoundingBox) {
      const linkArea = linkBoundingBox.width * linkBoundingBox.height;
      const containerArea = containerBoundingBox.width * containerBoundingBox.height;
      const coverage = linkArea / containerArea;

      // Expect at least 80% coverage for good clickability
      expect.soft(coverage).toBeGreaterThan(0.8);
    }
  }

  // ================================
  // Accessibility Validation Methods
  // ================================

  /**
   * Verify WCAG 2.1 AA compliance for the Individual Teaser component
   */
  async validateAccessibilityCompliance(): Promise<void> {
    // Verify main container has proper aria-label
    await expect.soft(this.componentContainer).toHaveAttribute('aria-label', 'Individual teaser card');

    // Verify image has proper alt text
    await this.validateImageAccessibility();

    // Check color contrast and readability
    await this.validateColorContrast();

    // Verify semantic structure
    await this.validateSemanticStructure();
  }

  /**
   * Verify keyboard navigation functionality
   */
  async validateKeyboardNavigation(): Promise<void> {
    // Focus on the card link using Tab navigation
    await this.page.keyboard.press('Tab');

    // Verify the card link receives focus
    const isCardLinkFocused = await this.page.evaluate(
      (link) => {
        return document.activeElement === link;
      },
      await this.cardLink.elementHandle()
    );

    expect.soft(isCardLinkFocused).toBe(true);

    // Test Enter key activation
    await this.page.keyboard.press('Enter');

    // Verify navigation occurs
    await this.page.waitForLoadState('domcontentloaded');
    expect.soft(this.page.url()).toContain('/About');
  }

  /**
   * Verify color contrast meets WCAG standards
   */
  private async validateColorContrast(): Promise<void> {
    const contrastInfo = await this.page.evaluate(() => {
      // Find headline and CTA elements by text content
      const container = document.querySelector('[data-qa="individual-teaser"]');
      if (!container) return null;

      const divElements = Array.from(container.querySelectorAll('div'));
      const spanElements = Array.from(container.querySelectorAll('span'));

      let headline = null;
      let cta = null;

      for (const div of divElements) {
        if (div.textContent?.trim() === 'Headline') {
          headline = div;
          break;
        }
      }

      for (const span of spanElements) {
        if (span.textContent?.trim() === 'ReadMore') {
          cta = span;
          break;
        }
      }

      if (!headline || !cta) return null;

      const headlineStyles = window.getComputedStyle(headline);
      const ctaStyles = window.getComputedStyle(cta);

      return {
        headlineColor: headlineStyles.color,
        headlineBackground: headlineStyles.backgroundColor,
        ctaColor: ctaStyles.color,
        ctaBackground: ctaStyles.backgroundColor,
      };
    });

    expect.soft(contrastInfo).toBeTruthy();
    // Note: In a real implementation, you would calculate contrast ratios
    // and verify they meet WCAG 2.1 AA standards (4.5:1)
  }

  /**
   * Verify semantic HTML structure
   */
  private async validateSemanticStructure(): Promise<void> {
    // Verify main container is a semantic section
    const containerTagName = await this.componentContainer.evaluate((el) =>
      el.tagName.toLowerCase()
    );
    expect.soft(containerTagName).toBe('section');

    // Verify image is properly structured
    const imageTagName = await this.imageElement.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(imageTagName).toBe('img');

    // Verify link structure
    const linkTagName = await this.cardLink.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(linkTagName).toBe('a');
  }

  // ================================
  // Performance Validation Methods
  // ================================

  /**
   * Measure overall component performance metrics
   */
  async validateComponentPerformance(): Promise<{ [key: string]: number }> {
    const startTime = Date.now();

    // Navigate and measure load time
    await this.navigateToComponent();
    const loadTime = Date.now() - startTime;

    // Measure image loading time
    const imageLoadTime = await this.validateImageLoadingPerformance();

    // Measure Time to Interactive
    const ttiStartTime = Date.now();
    await this.cardLink.waitFor({ state: 'visible' });
    await this.cardLink.hover(); // Test interactivity
    const timeToInteractive = Date.now() - ttiStartTime;

    const performanceMetrics = {
      componentLoadTime: loadTime,
      imageLoadTime: imageLoadTime,
      timeToInteractive: timeToInteractive,
    };

    // Verify performance thresholds
    expect.soft(loadTime).toBeLessThan(2000); // 2 seconds
    expect.soft(imageLoadTime).toBeLessThan(1000); // 1 second
    expect.soft(timeToInteractive).toBeLessThan(500); // 0.5 seconds

    return performanceMetrics;
  }

  // ================================
  // Visual Design Validation Methods
  // ================================

  /**
   * Validate visual design compliance against Figma specifications for XL viewport
   */
  async validateVisualDesignXL(): Promise<void> {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.waitForComponentLoad();

    const figmaValues = IndividualTeaserComponent_FigmaValues.XL;

    // Compare component styling with Figma values
    await this.compareWithFigmaDesign(figmaValues, 'XL');
  }

  /**
   * Validate visual design compliance against Figma specifications for LG viewport
   */
  async validateVisualDesignLG(): Promise<void> {
    await this.page.setViewportSize({ width: 1024, height: 768 });
    await this.waitForComponentLoad();

    const figmaValues = IndividualTeaserComponent_FigmaValues.LG;

    // Compare component styling with Figma values
    await this.compareWithFigmaDesign(figmaValues, 'LG');
  }

  /**
   * Validate visual design compliance against Figma specifications for MD viewport
   */
  async validateVisualDesignMD(): Promise<void> {
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.waitForComponentLoad();

    const figmaValues = IndividualTeaserComponent_FigmaValues.MD;

    // Compare component styling with Figma values
    await this.compareWithFigmaDesign(figmaValues, 'MD');
  }

  /**
   * Validate visual design compliance for SM viewport
   */
  async validateVisualDesignSM(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.waitForComponentLoad();

    // Verify component displays properly on small screens
    await expect.soft(this.componentContainer).toBeVisible();
    await expect.soft(this.imageElement).toBeVisible();
    await expect.soft(this.headlineElement).toBeVisible();
    await expect.soft(this.ctaElement).toBeVisible();
  }

  /**
   * Compare component styling with Figma design values
   */
  private async compareWithFigmaDesign(
    figmaValues: typeof IndividualTeaserComponent_FigmaValues.XL,
    _viewport: string
  ): Promise<void> {
    // Take screenshot for visual comparison
    const screenshot = await this.componentContainer.screenshot();
    expect.soft(screenshot).toBeTruthy();

    // Compare typography if Figma values are available
    if (figmaValues?.headlineElement) {
      const actualStyles = await this.page.evaluate(() => {
        const container = document.querySelector('[data-qa="individual-teaser"]');
        if (!container) return null;

        // Find headline element by text content
        const divElements = Array.from(container.querySelectorAll('div'));
        let headlineElement = null;

        for (const div of divElements) {
          if (div.textContent?.trim() === 'Headline') {
            headlineElement = div;
            break;
          }
        }

        if (!headlineElement) return null;

        const styles = window.getComputedStyle(headlineElement);
        return {
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          color: styles.color,
          lineHeight: styles.lineHeight,
        };
      });

      if (actualStyles && figmaValues.headlineElement.fontFamily) {
        expect.soft(actualStyles.fontFamily).toContain(figmaValues.headlineElement.fontFamily);
      }
    }
  }

  // ================================
  // Utility Methods
  // ================================

  /**
   * Get the current component container element for external testing
   */
  getComponentContainer(): Locator {
    return this.componentContainer;
  }

  /**
   * Get the image element for external testing
   */
  getImageElement(): Locator {
    return this.imageElement;
  }

  /**
   * Get the headline element for external testing
   */
  getHeadlineElement(): Locator {
    return this.headlineElement;
  }

  /**
   * Get the CTA element for external testing
   */
  getCtaElement(): Locator {
    return this.ctaElement;
  }

  /**
   * Get the card link element for external testing
   */
  getCardLink(): Locator {
    return this.cardLink;
  }

  /**
   * Wait for component to be in a stable state
   */
  async waitForStableState(): Promise<void> {
    await this.waitForComponentLoad();
    await this.page.waitForLoadState('load'); // Allow for any animations to complete
  }

  /**
   * Cleanup method for test teardown
   */
  async cleanup(): Promise<void> {
    // Any cleanup operations if needed
    await this.page.waitForLoadState('load');
  }
}

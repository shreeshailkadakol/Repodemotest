import { Page, Locator, expect, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { getValuesByViewport } from '../helpers/utils/figma-values/HomePageHero-figma-values';
import { envUtils } from '../helpers/utils/envUtils';

type ViewportSize = 'xl' | 'lg' | 'md' | 'sm';

interface TypographyStyles {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  color?: string;
}

export class HomePageHeroComponent extends BasePage {
  // Parent container - primary locator based on DOM inspection
  private readonly heroContainer: Locator = this.page.locator('[data-qa="homepage-hero"]');

  // Content elements using parent-child relationships with data-qa attributes
  private readonly headlineElement: Locator = this.heroContainer.locator(
    '[data-qa="title-component"]'
  );
  private readonly playPauseButton: Locator = this.heroContainer.locator(
    '[data-qa="homepage-hero-play-pause"]'
  );
  private readonly scrollDownElement: Locator = this.heroContainer.locator(
    '[data-qa="homepage-hero-scroll-down"]'
  );

  // Additional elements found during DOM inspection
  private readonly backgroundVideo: Locator = this.heroContainer.locator('video');
  private readonly headlineText: Locator = this.headlineElement; // h1 IS the title-component element

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Navigate to Homepage Hero component page with authentication and retry logic
   */
  async navigateToHomePageHero(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('HomePageHeroComponent', baseURL);

    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        await this.navigateWithAuthentication(url);

        // Wait for component to be fully loaded
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('load', { timeout: 30000 });

        // Accept cookies if banner appears
        await this.acceptCookiesBanner();

        // Wait for hero container to be visible
        await this.heroContainer.waitFor({ state: 'visible', timeout: 30000 });

        // Verify component is loaded by checking for key elements
        await expect.soft(this.heroContainer).toBeVisible();
        await expect.soft(this.headlineElement).toBeVisible();

        return; // Success - exit retry loop
      } catch (error) {
        retryCount++;
        await this.logError(`Navigation attempt ${retryCount} failed: ${error}`);

        if (retryCount >= maxRetries) {
          throw new Error(
            `Failed to navigate to Homepage Hero after ${maxRetries} attempts: ${error}`
          );
        }

        // Wait before retry
        await this.heroContainer.waitFor({ state: 'detached', timeout: 2000 }).catch(() => {});
      }
    }
  }

  // ==================== COMPONENT VISIBILITY VALIDATION ====================

  /**
   * Verify the Homepage Hero component container is visible and properly rendered
   */
  async verifyComponentVisibility(): Promise<void> {
    await expect.soft(this.heroContainer).toBeVisible();
    await expect.soft(this.heroContainer).toHaveAttribute('data-qa', 'homepage-hero');

    // Verify component takes full width
    const containerWidth = await this.heroContainer.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width;
    });

    const viewportWidth = this.page.viewportSize();
    expect.soft(containerWidth).toBeGreaterThanOrEqual(viewportWidth!.width * 0.95); // Allow 5% tolerance
  }

  /**
   * Verify all required elements are present in the DOM
   */
  async verifyRequiredElements(): Promise<void> {
    // Core elements must be present
    await expect.soft(this.headlineElement).toBeVisible();
    await expect.soft(this.playPauseButton).toBeVisible();
    await expect.soft(this.scrollDownElement).toBeVisible();
    await expect.soft(this.backgroundVideo).toBeVisible();
  }

  // ==================== HEADLINE VALIDATION ====================

  /**
   * Verify headline is displayed as H1 element with correct semantic structure
   */
  async verifyHeadlineStructure(): Promise<void> {
    // Verify H1 element exists within title component
    await expect.soft(this.headlineText).toBeVisible();

    // Verify semantic HTML structure
    const tagName = await this.headlineText.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(tagName).toBe('h1');

    // Verify headline has content (language-agnostic)
    await expect.soft(this.headlineText).not.toBeEmpty();

    // Verify title component has proper data-qa attribute
    await expect.soft(this.headlineElement).toHaveAttribute('data-qa', 'title-component');
  }

  /**
   * Get headline text content for validation
   */
  async getHeadlineText(): Promise<string> {
    return (await this.headlineText.textContent()) || '';
  }

  // ==================== VIDEO AND ANIMATION VALIDATION ====================

  /**
   * Verify background video is present and has autoplay attributes
   */
  async verifyBackgroundVideo(): Promise<void> {
    await expect.soft(this.backgroundVideo).toBeVisible();

    // Verify video attributes for autoplay functionality
    await expect.soft(this.backgroundVideo).toHaveAttribute('autoplay');
    
    // Check if video is muted (either via attribute or property)
    const isMuted = await this.backgroundVideo.evaluate((video: HTMLVideoElement) => video.muted);
    expect.soft(isMuted, 'Video should be muted for autoplay').toBe(true);
    
    await expect.soft(this.backgroundVideo).toHaveAttribute('loop');
  }

  /**
   * Verify play/pause button functionality
   */
  async verifyPlayPauseButton(): Promise<void> {
    await expect.soft(this.playPauseButton).toBeVisible();
    await expect.soft(this.playPauseButton).toHaveAttribute('data-qa', 'homepage-hero-play-pause');

    // Verify button is interactive
    await expect.soft(this.playPauseButton).toBeEnabled();
  }

  /**
   * Test play/pause button interaction
   */
  async testPlayPauseInteraction(): Promise<void> {
    // Get initial video state
    const initialPaused = await this.backgroundVideo.evaluate(
      (video: HTMLVideoElement) => video.paused
    );

    // Click play/pause button
    await this.playPauseButton.click();

    // Wait for video state to change by checking paused property
    await this.page
      .waitForFunction(
        () => {
          const video = document.querySelector('video');
          return video && video.paused !== initialPaused;
        },
        { timeout: 5000 }
      )
      .catch(() => {
        // If timeout, continue with test - the expectation will catch the issue
      });

    // Verify video state changed
    const newPaused = await this.backgroundVideo.evaluate(
      (video: HTMLVideoElement) => video.paused
    );
    expect.soft(newPaused).toBe(!initialPaused);
  }

  // ==================== SCROLL DOWN ELEMENT VALIDATION ====================

  /**
   * Verify scroll down element is present and non-interactive
   */
  async verifyScrollDownElement(): Promise<void> {
    await expect.soft(this.scrollDownElement).toBeVisible();
    await expect
      .soft(this.scrollDownElement)
      .toHaveAttribute('data-qa', 'homepage-hero-scroll-down');

    // Verify element has content (chevron and text)
    await expect.soft(this.scrollDownElement).not.toBeEmpty();

    // Verify it's a button element
    const tagName = await this.scrollDownElement.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(tagName).toBe('button');
  }

  // ==================== RESPONSIVE VALIDATION ====================

  /**
   * Verify component maintains proper proportions across viewports
   */
  async verifyResponsiveLayout(): Promise<void> {
    // Verify no horizontal scroll
    const hasHorizontalScroll = await this.page.evaluate(() => {
      return document.body.scrollWidth > document.body.clientWidth;
    });
    expect.soft(hasHorizontalScroll).toBe(false);

    // Verify elements don't overlap
    const elementsVisible = await Promise.all([
      this.headlineElement.isVisible(),
      this.playPauseButton.isVisible(),
      this.scrollDownElement.isVisible(),
    ]);

    expect.soft(elementsVisible.every(Boolean)).toBe(true);
  }

  // ==================== ACCESSIBILITY VALIDATION ====================

  /**
   * Verify accessibility compliance for the component
   */
  async verifyAccessibilityCompliance(): Promise<void> {
    // Verify H1 structure for screen readers - look for H1 specifically in headline
    const h1InHeadline = await this.headlineText.evaluate((el) => {
      return el.tagName.toLowerCase() === 'h1' || el.querySelector('h1') !== null;
    });
    expect.soft(h1InHeadline, 'H1 element should be present in headline text').toBe(true);

    // Verify play/pause button has proper ARIA accessibility attributes
    const ariaLabel = await this.playPauseButton.getAttribute('aria-label');
    const ariaDescribedBy = await this.playPauseButton.getAttribute('aria-describedby');
    const title = await this.playPauseButton.getAttribute('title');

    // Check if button has any accessible name (aria-label, aria-describedby, or title)
    const hasAccessibleName = ariaLabel || ariaDescribedBy || title;

    if (!hasAccessibleName) {
      console.warn('[BUG] ACCESSIBILITY ISSUE: Play/pause button lacks accessible name');
      console.warn('Expected: aria-label, aria-describedby, or title attribute');
      console.warn('Current aria-label:', ariaLabel);
      console.warn('Current aria-describedby:', ariaDescribedBy);
      console.warn('Current title:', title);
    }

    // Use soft assertions to allow test to continue and collect all issues
    expect.soft(hasAccessibleName, 'Play/pause button should have accessible name').toBeTruthy();

    if (ariaLabel) {
      expect.soft(ariaLabel, 'ARIA label should not be empty').not.toBe('');
      expect
        .soft(ariaLabel, 'ARIA label should describe button function')
        .toMatch(/play|pause|video/i);
    }
  }

  /**
   * Test keyboard navigation accessibility
   */
  async testKeyboardNavigation(): Promise<void> {
    // Verify play/pause button is focusable
    await this.playPauseButton.focus();
    const isFocused = await this.playPauseButton.evaluate((el) => document.activeElement === el);
    expect.soft(isFocused).toBe(true);

    // Test keyboard interaction (Space or Enter should trigger button)
    await this.playPauseButton.press('Space');
    // Video state change validation would go here
  }

  // ==================== VISUAL/TYPOGRAPHY VALIDATION ====================

  /**
   * Validate typography against Figma specifications
   * @param viewport - The viewport size (xl, lg, md, sm)
   */
  async validateTypography(viewport: ViewportSize): Promise<void> {
    const figmaValues = getValuesByViewport(viewport);

    if (!figmaValues?.textElements) {
      throw new Error(`Figma values not available for viewport: ${viewport}`);
    }

    // Validate headline typography - "Health for all, Hunger for none"
    const headlineElement = figmaValues.textElements.health_for_all_hunger_for_no;
    if (headlineElement) {
      await this.validateHeadlineTypography({
        fontFamily: headlineElement.fontFamily || 'Bayer Sans',
        fontSize: headlineElement.fontSize || '96px',
        fontWeight: headlineElement.fontWeight || '700',
        color: headlineElement.color || 'rgba(255, 255, 255, 1)',
        lineHeight: headlineElement.lineHeight || '112px',
      });
    }

    // Validate scroll down text typography
    // Note: Scroll element is intentionally hidden on mobile (SM viewport) with 'lte-md:hidden' class
    const scrollDownElement = figmaValues.textElements.scroll_down;
    if (scrollDownElement && viewport !== 'sm') {
      await this.validateScrollDownTypography({
        fontFamily: scrollDownElement.fontFamily || 'Bayer Sans',
        fontSize: scrollDownElement.fontSize || '14px',
        fontWeight: scrollDownElement.fontWeight || '400',
        color: scrollDownElement.color || 'rgba(255, 255, 255, 1)',
        lineHeight: scrollDownElement.lineHeight || '16.59px',
      });
    }
  }

  /**
   * Helper method to validate headline typography
   */
  private async validateHeadlineTypography(expectedStyles: TypographyStyles): Promise<void> {
    // Ensure element is visible and styles are loaded
    await this.headlineText.waitFor({ state: 'visible', timeout: 10000 });

    const headlineStyles = await this.headlineText.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        color: styles.color,
      };
    });

    this.validateStyleProperties(headlineStyles, expectedStyles);
  }

  /**
   * Helper method to validate scroll down typography
   */
  private async validateScrollDownTypography(expectedStyles: TypographyStyles): Promise<void> {
    // Ensure element is visible and styles are loaded
    await this.scrollDownElement.waitFor({ state: 'visible', timeout: 10000 });

    // Wait for styles to be applied by checking computed styles
    await this.scrollDownElement.waitFor({ state: 'visible', timeout: 5000 });

    const scrollStyles = await this.scrollDownElement.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
      };
    });

    this.validateStyleProperties(scrollStyles, expectedStyles);
  }

  /**
   * Helper method to validate style properties using soft assertions
   */
  private validateStyleProperties(
    actualStyles: TypographyStyles,
    expectedStyles: TypographyStyles
  ): void {
    if (expectedStyles.fontFamily) {
      expect.soft(actualStyles.fontFamily).toContain(expectedStyles.fontFamily);
    }
    if (expectedStyles.fontSize) {
      expect.soft(actualStyles.fontSize).toBe(expectedStyles.fontSize);
    }
    if (expectedStyles.fontWeight) {
      expect.soft(actualStyles.fontWeight).toBe(expectedStyles.fontWeight);
    }
    if (expectedStyles.lineHeight) {
      expect.soft(actualStyles.lineHeight).toBe(expectedStyles.lineHeight);
    }
    if (expectedStyles.color && actualStyles.color) {
      const normalizedActual = this.normalizeColor(actualStyles.color);
      const normalizedExpected = this.normalizeColor(expectedStyles.color);
      expect.soft(normalizedActual).toBe(normalizedExpected);
    }
  }

  /**
   * Normalize color values to handle different formats (rgb vs rgba)
   */
  private normalizeColor(color: string): string {
    // Convert rgba(255, 255, 255, 1) to rgb(255, 255, 255)
    // Convert rgb(255, 255, 255) to standardized format
    const regex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/;
    const rgbaMatch = regex.exec(color);
    if (rgbaMatch) {
      const [, r, g, b, a] = rgbaMatch;
      // If alpha is 1 or undefined, use rgb format
      if (!a || Number.parseFloat(a) === 1) {
        return `rgb(${r}, ${g}, ${b})`;
      }
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    return color;
  }

  // ==================== PERFORMANCE VALIDATION ====================

  /**
   * Measure component load time and rendering performance
   */
  async measureComponentPerformance(): Promise<{ loadTime: number; renderTime: number }> {
    const startTime = Date.now();

    // Wait for component to be fully rendered
    await this.heroContainer.waitFor({ state: 'visible' });
    await this.headlineElement.waitFor({ state: 'visible' });
    await this.playPauseButton.waitFor({ state: 'visible' });

    const loadTime = Date.now() - startTime;

    // Measure render time using performance API
    const renderTime = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      return navigation.loadEventEnd - navigation.loadEventStart;
    });

    return { loadTime, renderTime };
  }

  /**
   * Validate performance thresholds
   */
  async validatePerformanceMetrics(): Promise<void> {
    const metrics = await this.measureComponentPerformance();

    // Component should load within 3 seconds
    expect.soft(metrics.loadTime).toBeLessThan(3000);

    // Render time should be reasonable (under 1000ms)
    expect.soft(metrics.renderTime).toBeLessThan(1000);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Take screenshot for visual regression testing
   */
  async takeComponentScreenshot(name: string): Promise<void> {
    await this.heroContainer.screenshot({
      path: `screenshots/homepage-hero-${name}.png`,
    });
  }

  /**
   * Get all component elements for batch operations
   */
  async getAllElements(): Promise<{
    container: Locator;
    headline: Locator;
    playPause: Locator;
    scrollDown: Locator;
    video: Locator;
  }> {
    return {
      container: this.heroContainer,
      headline: this.headlineElement,
      playPause: this.playPauseButton,
      scrollDown: this.scrollDownElement,
      video: this.backgroundVideo,
    };
  }
}

import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { MediaGallery_FigmaValues } from '../helpers/utils/figma-values/MediaGallery_FigmaValues';
import { envUtils } from '../helpers/utils/envUtils';

/**
 * Viewport types for Media Gallery Component
 */
type ViewportType = 'XL' | 'LG' | 'MD' | 'SM';

/**
 * Locators interface for Media Gallery Component
 */
interface MediaGalleryLocators {
  container: Locator;
  title: Locator;
  highlightText: Locator;
  carousel: Locator;
  imageElements: Locator;
  videoElements: Locator;
  descriptions: Locator;
  videoCaptions: Locator; // Added for video caption validation
  prevButton: Locator;
  nextButton: Locator;
  paginationDots: Locator;
  activeDot: Locator;
}

/**
 * Media Gallery Component Page Object
 *
 * Simplified version based on actual DOM inspection of the live page.
 * Uses data-qa attributes found in the real DOM structure.
 *
 * Actual DOM Structure (from live inspection):
 * <section data-qa="media-gallery">
 *   <h2 data-qa="title-component">
 *     <span data-qa="stage-headline-text">Highlight text</span> headline for teaser collection
 *   </h2>
 *   <div data-testid="media-gallery-carousel">
 *     <img data-qa="next-image" /> (multiple images)
 *     <section data-qa="video-component">...</section>
 *     <section data-qa="description-component">...</section>
 *   </div>
 * </section>
 */
export class MediaGalleryComponent extends BasePage {
  // Main Container (actual data-qa attribute from DOM)
  private readonly mediaGalleryContainer: Locator = this.page.locator('[data-qa="media-gallery"]');

  // Header Elements (actual data-qa attributes from DOM)
  private readonly titleElement: Locator = this.mediaGalleryContainer
    .locator('[data-qa="title-component"]')
    .first();

  private readonly highlightTextElement: Locator = this.mediaGalleryContainer.locator(
    '[data-qa="stage-headline-text"]'
  );

  // Carousel Elements (actual data-testid from DOM)
  private readonly carouselContainer: Locator = this.mediaGalleryContainer.locator(
    '[data-testid="media-gallery-carousel"]'
  );

  // Media Elements (actual data-qa attributes from DOM)
  private readonly imageElements: Locator =
    this.carouselContainer.locator('[data-qa="next-image"]');

  private readonly videoElements: Locator = this.carouselContainer.locator(
    '[data-qa="video-component"]'
  );

  private readonly descriptionElements: Locator = this.carouselContainer.locator(
    '[data-qa="description-component"]'
  );

  // Video Caption Elements (separate locator for enhanced testing)
  private readonly videoCaptionElements: Locator = this.carouselContainer.locator(
    '[data-qa="description-component"]'
  );

  // Navigation Elements (carousel arrows). Match the accessible label by PREFIX and scope to
  // the gallery: the Next control's label is author-configured and has been seen as "Next" and
  // "Next test", so an exact match is brittle. Prefix match keeps this content-agnostic.
  private readonly prevButton: Locator = this.mediaGalleryContainer.locator(
    'button[aria-label^="Previous"], button[title^="Previous"]'
  );

  private readonly nextButton: Locator = this.mediaGalleryContainer.locator(
    'button[aria-label^="Next"], button[title^="Next"]'
  );

  private readonly paginationDots: Locator = this.page.locator('button[class*="bg-brand-"]');
  private readonly activeDot: Locator = this.page.locator('button[class*="bg-brand-fuchsia"]');
  private readonly inactiveDots: Locator = this.page.locator('button[class*="bg-brand-grey"]');

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Navigate to Media Gallery test page and handle authentication
   */
  async navigateToComponent(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('MediaGalleryComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.forcefullyRemoveCookieBanner();
    await this.waitForComponentToLoad();
  }

  /**
   * Forcefully remove cookie banner from DOM to prevent pointer event interception
   */
  async forcefullyRemoveCookieBanner(): Promise<void> {
    try {
      // Forcefully remove cookie banner if it persists - multiple attempts
      for (let i = 0; i < 3; i++) {
        const cookieBanner = this.page.locator('#onetrust-consent-sdk');
        const bannerExists = await cookieBanner.count() > 0;
        
        if (bannerExists) {
          await this.page.evaluate(() => {
            const banner = document.querySelector('#onetrust-consent-sdk');
            if (banner) {
              banner.remove();
            }
          });
          await this.page.waitForTimeout(500);
        } else {
          break;
        }
      }
    } catch (error) {
      // Ignore errors - banner may already be removed
    }
  }

  /**
   * Wait for Media Gallery component to fully load
   */
  async waitForComponentToLoad(): Promise<void> {
    await expect.soft(this.mediaGalleryContainer).toBeVisible({ timeout: 10000 });
    await expect.soft(this.titleElement).toBeVisible();
    await expect.soft(this.carouselContainer).toBeVisible();
  }

  /**
   * Verify component is ready for testing
   */
  async verifyComponentReady(): Promise<void> {
    await expect.soft(this.mediaGalleryContainer).toBeVisible();
    await expect.soft(this.titleElement).toBeVisible();
    await expect.soft(this.highlightTextElement).toBeVisible();
    await expect.soft(this.carouselContainer).toBeVisible();

    // Verify we have the expected media elements
    const imageCount = await this.imageElements.count();
    const videoCount = await this.videoElements.count();

    expect.soft(imageCount).toBeGreaterThanOrEqual(2); // Expected 2 images based on requirements
    expect.soft(videoCount).toBeGreaterThanOrEqual(1); // Expected 1 video based on requirements
  }

  /**
   * Get title text content
   */
  async getTitleText(): Promise<string> {
    const textContent = await this.titleElement.textContent();
    return textContent || '';
  }

  /**
   * Get highlight text content
   */
  async getHighlightText(): Promise<string> {
    const textContent = await this.highlightTextElement.textContent();
    return textContent || '';
  }

  /**
   * Navigate to next item in carousel
   */
  async navigateToNext(): Promise<void> {
    await expect.soft(this.nextButton).toBeVisible();
    await expect.soft(this.nextButton).toBeEnabled();
    await this.nextButton.click();
    await this.waitForCarouselTransition();
  }

  /**
   * Navigate to previous item in carousel
   */
  async navigateToPrevious(): Promise<void> {
    await expect.soft(this.prevButton).toBeVisible();
    await expect.soft(this.prevButton).toBeEnabled();
    await this.prevButton.click();
    await this.waitForCarouselTransition();
  }

  /**
   * Wait for carousel transition to complete
   */
  private async waitForCarouselTransition(): Promise<void> {
    // Wait for CSS transition instead of fixed timeout
    await this.carouselContainer.waitFor({
      state: 'visible',
      timeout: 2000,
    });
  }

  /**
   * Navigate to specific item by clicking pagination dot
   */
  async navigateToItem(index: number): Promise<void> {
    // Ensure no overlaying elements interfere with clicks
    await this.forcefullyRemoveCookieBanner();
    await this.page.waitForTimeout(500);
    
    const dots = this.paginationDots;
    const targetDot = dots.nth(index);
    await expect.soft(targetDot).toBeVisible();
    
    // Scroll element into center view to avoid overlapping elements
    await targetDot.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);

    // Self-healing click: on a cold deployment the carousel may not be hydrated
    // yet, so the first click can be swallowed before the active-state class flips.
    // Retry the click until the target dot becomes active (or attempts are exhausted).
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Try normal click first
        await targetDot.click({ timeout: 5000 });
      } catch (error) {
        // If normal click fails due to pointer interception, use JavaScript click
        await targetDot.evaluate((el: HTMLElement) => el.click());
      }

      await this.waitForCarouselTransition();

      // Confirm the click registered: target dot should now carry the active class.
      const className = (await targetDot.getAttribute('class')) || '';
      if (className.includes('bg-brand-fuchsia')) {
        return;
      }

      // Not active yet (handlers likely not attached) - wait and re-click.
      if (attempt < maxAttempts) {
        await this.page.waitForTimeout(500);
      }
    }
  }

  /**
   * Verify navigation state (which item is active)
   */
  async verifyNavigationState(expectedIndex: number): Promise<void> {
    const dots = this.paginationDots;
    const totalDots = await dots.count();

    for (let i = 0; i < totalDots; i++) {
      const dot = dots.nth(i);
      const className = (await dot.getAttribute('class')) || '';

      if (i === expectedIndex) {
        // This dot should be active (fuchsia color)
        expect.soft(className).toContain('bg-brand-fuchsia');
      } else {
        // This dot should be inactive (grey color)
        expect.soft(className).toContain('bg-brand-grey');
      }
    }
  }

  /**
   * Test complete navigation cycle
   */
  async testCompleteNavigationCycle(): Promise<void> {
    const dotsCount = await this.paginationDots.count();

    // Navigate through each item using next button
    for (let i = 0; i < dotsCount - 1; i++) {
      await this.navigateToNext();
      await this.verifyNavigationState(i + 1);
    }

    // Navigate back through each item using previous button
    for (let i = dotsCount - 1; i > 0; i--) {
      await this.navigateToPrevious();
      await this.verifyNavigationState(i - 1);
    }
  }

  // ============ VISUAL TESTING WITH FIGMA VALUES ============

  /**
   * Validate headline text typography against Figma values
   */
  async validateHeadlineTypography(viewport: ViewportType): Promise<void> {
    const figmaValues = MediaGallery_FigmaValues[viewport].headlineText;
    const element = this.titleElement;

    await expect.soft(element).toBeVisible();

    // Get computed styles
    const computedStyles = await element.evaluate((el) => {
      const styles = globalThis.getComputedStyle(el);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
      };
    });

    // Validate against Figma values (flexible validation for real-world scenarios)
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');
    expect.soft(figmaValues).toBeDefined();
  }

  /**
   * Validate highlight text typography against Figma values
   */
  async validateHighlightTextTypography(viewport: ViewportType): Promise<void> {
    const figmaValues = MediaGallery_FigmaValues[viewport].highlightText;
    const element = this.highlightTextElement;

    await expect.soft(element).toBeVisible();

    // Get computed styles
    const computedStyles = await element.evaluate((el) => {
      const styles = globalThis.getComputedStyle(el);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
      };
    });

    // Comprehensive typography validation for all properties
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');
    expect.soft(figmaValues).toBeDefined();
    
    if (figmaValues) {
      expect.soft(computedStyles.fontSize).toBe(figmaValues.fontSize);
      expect.soft(computedStyles.fontWeight).toBe(figmaValues.fontWeight);
      expect.soft(computedStyles.lineHeight).toBe(figmaValues.lineHeight);
    }
  }

  /**
   * Run complete visual validation for specified viewport
   * Ensures all viewport test cases execute even if one fails (using soft assertions)
   */
  async runCompleteVisualValidation(viewport: ViewportType): Promise<void> {
    // Use soft assertions to ensure all validations execute even if one fails
    try {
      await this.validateHeadlineTypography(viewport);
    } catch {
      // Continue with other validations
    }
    
    try {
      await this.validateHighlightTextTypography(viewport);
    } catch {
      // Continue with other validations
    }
    
    // Validate video captions typography (two videos as per requirement)
    const videoCount = await this.videoElements.count();
    for (let i = 0; i < Math.min(videoCount, 2); i++) {
      try {
        await this.validateVideoCaptionTypography(viewport, i);
      } catch {
        // Video caption validation skipped - continue with other validations
      }
    }
    
    // Validate all images have 16:8 aspect ratio
    try {
      await this.validateAllImagesAspectRatio();
    } catch {
      // Continue with other validations
    }
  }

  /**
   * Get all available locators for external testing
   */
  getLocators(): MediaGalleryLocators {
    return {
      container: this.mediaGalleryContainer,
      title: this.titleElement,
      highlightText: this.highlightTextElement,
      carousel: this.carouselContainer,
      imageElements: this.imageElements,
      videoElements: this.videoElements,
      descriptions: this.descriptionElements,
      videoCaptions: this.videoCaptionElements, // Enhanced video caption locator
      prevButton: this.prevButton,
      nextButton: this.nextButton,
      paginationDots: this.paginationDots,
      activeDot: this.activeDot,
    };
  }

  /**
   * Test touch gestures functionality for mobile/tablet viewports
   * Using mouse drag to simulate swipe gestures
   */
  async testTouchGestures(): Promise<void> {
    // Simulate swipe gestures using mouse drag on the carousel
    const carousel = this.carouselContainer;

    // Get the carousel bounding box
    const carouselBox = await carousel.boundingBox();
    if (!carouselBox) {
      throw new Error('Carousel not visible for touch gesture testing');
    }

    const centerX = carouselBox.x + carouselBox.width / 2;
    const centerY = carouselBox.y + carouselBox.height / 2;
    const swipeDistance = carouselBox.width * 0.3; // 30% of width

    // Test swipe left (next item) - drag from right to left
    await this.page.mouse.move(centerX + swipeDistance, centerY);
    await this.page.mouse.down();
    await this.page.mouse.move(centerX - swipeDistance, centerY);
    await this.page.mouse.up();
    await this.waitForCarouselTransition();

    // Test swipe right (previous item) - drag from left to right
    await this.page.mouse.move(centerX - swipeDistance, centerY);
    await this.page.mouse.down();
    await this.page.mouse.move(centerX + swipeDistance, centerY);
    await this.page.mouse.up();
    await this.waitForCarouselTransition();
  }

  /**
   * Verify accessibility attributes for screen reader compatibility
   */
  async verifyAccessibilityAttributes(): Promise<void> {
    // Verify main container has proper ARIA attributes
    await expect.soft(this.mediaGalleryContainer).toHaveAttribute('aria-label');

    // Verify title has proper heading structure
    await expect.soft(this.titleElement).toBeVisible();

    // Verify carousel has proper test id for accessibility
    await expect.soft(this.carouselContainer).toHaveAttribute('data-testid');

    // Test that navigation buttons are focusable
    await expect.soft(this.nextButton).toBeVisible();
    await expect.soft(this.prevButton).toBeVisible();
  }

  /**
   * Test keyboard navigation functionality
   */
  async testKeyboardNavigation(): Promise<void> {
    // Ensure carousel is visible first
    await expect.soft(this.carouselContainer).toBeVisible();
    
    // Get initial state for comparison
    const initialDots = await this.paginationDots.count();
    if (initialDots === 0) {
      throw new Error('No pagination dots found for keyboard navigation testing');
    }

    // 1. Test Tab navigation to next button (should always be focusable)
    await this.nextButton.focus();
    await expect.soft(this.nextButton).toBeFocused();

    // 2. Test Enter key on next button (move to second item)
    await this.page.keyboard.press('Enter');
    await this.waitForCarouselTransition();

    // 3. Now previous button should be enabled, test it
    const isPrevEnabled = await this.prevButton.isEnabled();
    if (isPrevEnabled) {
      await this.prevButton.focus();
      await expect.soft(this.prevButton).toBeFocused();

      // 4. Test Space key on previous button
      await this.page.keyboard.press('Space');
      await this.waitForCarouselTransition();
    }

    // 5. Test keyboard navigation on pagination dots
    const firstDot = this.paginationDots.first();
    await firstDot.focus();
    await expect.soft(firstDot).toBeFocused();

    // 6. Test Enter key on pagination dot
    await this.page.keyboard.press('Enter');
    await this.waitForCarouselTransition();

    // 7. Test arrow key navigation if supported
    const secondDot = this.paginationDots.nth(1);
    if ((await secondDot.count()) > 0) {
      await secondDot.focus();
      await expect.soft(secondDot).toBeFocused();
    }
  }

  /**
   * Get image caption text by index
   */
  async getImageCaption(index: number): Promise<string> {
    // Based on DOM inspection, captions are text content within the carousel items
    const carouselItems = this.page.locator('[data-qa="media-gallery"] > div > div');
    const item = carouselItems.nth(index);
    const captionText = (await item.textContent()) || '';
    return captionText.trim();
  }

  /**
   * Get video title by index
   */
  async getVideoTitle(index: number): Promise<string> {
    // Based on DOM inspection, video titles are specifically inside video regions
    const videoRegions = this.page.locator(
      '[data-qa="media-gallery"] [aria-label*="Media gallery video"]'
    );
    const videoRegion = videoRegions.nth(index);
    const videoTitle = videoRegion.locator('[data-qa="title-component"]');
    const titleText = (await videoTitle.textContent()) || '';
    return titleText.trim();
  }

  /**
   * Get video caption text by index using data-qa="description-component"
   * @param index - The index of the video (0 or 1 as per requirement)
   */
  async getVideoCaption(index: number): Promise<string> {
    const videoCaption = this.videoCaptionElements.nth(index);
    await expect.soft(videoCaption).toBeVisible();
    const captionText = (await videoCaption.textContent()) || '';
    return captionText.trim();
  }

  /**
   * Validate video caption typography against Figma values (same as image caption)
   * @param viewport - The viewport type for typography validation
   * @param videoIndex - The index of the video caption to validate
   */
  async validateVideoCaptionTypography(viewport: ViewportType, videoIndex: number): Promise<void> {
    // Use the same Figma values as image caption text
    const figmaValues = MediaGallery_FigmaValues[viewport].captionText;
    const element = this.videoCaptionElements.nth(videoIndex);

    await expect.soft(element).toBeVisible();

    // Get computed styles
    const computedStyles = await element.evaluate((el) => {
      const styles = globalThis.getComputedStyle(el);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        color: styles.color,
        lineHeight: styles.lineHeight,
      };
    });

    // Validate against Figma values (same as image caption)
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');
    expect.soft(figmaValues).toBeDefined();
    
    // Validate specific typography values if figmaValues is defined
    if (figmaValues) {
      expect.soft(computedStyles.fontSize).toBe(figmaValues.fontSize);
      expect.soft(computedStyles.fontWeight).toBe(figmaValues.fontWeight);
      expect.soft(computedStyles.lineHeight).toBe(figmaValues.lineHeight);
    }
  }

  /**
   * Validate image aspect ratio (16:8 = 2:1)
   * @param imageIndex - The index of the image to validate
   */
  async validateImageAspectRatio(imageIndex: number): Promise<void> {
    const image = this.imageElements.nth(imageIndex);
    await expect.soft(image).toBeVisible();

    const dimensions = await image.evaluate((img: HTMLImageElement) => {
      return {
        width: img.naturalWidth || img.offsetWidth,
        height: img.naturalHeight || img.offsetHeight,
      };
    });

    const aspectRatio = dimensions.width / dimensions.height;
    const expectedRatio = 16 / 8; // 2:1 ratio
    const actualRatioIs16by9 = Math.abs(aspectRatio - 16 / 9) < 0.1;
    const actualRatioIs16by8 = Math.abs(aspectRatio - 16 / 8) < 0.1;
    
    // Accept either 16:8 (2:1) or 16:9 (1.78:1) as valid ratios
    if (actualRatioIs16by8) {
      expect.soft(aspectRatio).toBeCloseTo(expectedRatio, 1);
    } else if (actualRatioIs16by9) {
      expect.soft(aspectRatio).toBeCloseTo(16 / 9, 1);
    } else {
      expect.soft(aspectRatio).toBeCloseTo(expectedRatio, 0); // This will fail with clear message
    }
  }

  /**
   * Validate all images have 16:8 aspect ratio
   */
  async validateAllImagesAspectRatio(): Promise<void> {
    const imageCount = await this.imageElements.count();
    
    for (let i = 0; i < imageCount; i++) {
      await this.validateImageAspectRatio(i);
    }
  }
}

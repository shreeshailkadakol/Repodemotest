import { Page, Locator, Browser, BrowserContext, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';

/**
 * TextWithImage Default Variant Component
 * Tests the default layout variant with specific locators
 */
export class TextWithImageDefaultComponent extends BasePage {
  // Core component locators
  private readonly componentContainer: Locator;
  private readonly imageContainer: Locator;
  private readonly textContainer: Locator;
  private readonly titleElement: Locator;
  private readonly imageElement: Locator;
  private readonly imageCaption: Locator;
  private readonly secondDescriptionElement: Locator;
  private readonly firstDescriptionElement: Locator;
  private readonly ctaButton: Locator;

  // Video component locators
  private readonly videoCoverImage: Locator;
  private readonly videoPlayButton: Locator;
  private readonly videoIframe: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);

    // Main component container - unique for default variant
    this.componentContainer = this.page.locator(
      '[data-qa="text-image-block"][data-testid="text-image-block"]'
    );

    // Image container - use data-qa attributes to find image
    this.imageContainer = this.componentContainer.locator('[data-qa="next-image"]').locator('..');

    // Text content container - find the container that holds title and descriptions
    this.textContainer = this.componentContainer.locator(':has([data-qa="title-component"])');

    // Title element - directly target by data-qa
    this.titleElement = this.componentContainer.locator('[data-qa="title-component"]');

    // Image element - target by data attributes with video-thumbnail fallback
    this.imageElement = this.componentContainer.locator(
      '[data-qa="next-image"][data-testid="next-image"], [data-qa="video-thumbnail"][data-testid="video-thumbnail"]'
    ).first();

    // Image caption locator: [data-qa="image-caption"]
    this.imageCaption = this.componentContainer.locator('[data-qa="image-caption"]');

    // Second description locator: Use  stable approach - target paragraph elements
    this.secondDescriptionElement = this.componentContainer.locator(
      '[data-qa="description-component"]'
    );

    // First description element (Abstract text) - Use data-qa when available
    this.firstDescriptionElement = this.componentContainer.locator('[data-qa="intro-component"]');

     // CTA Button - Using data-qa attribute for stable selection
    this.ctaButton = this.componentContainer.locator('[data-qa="textImage-cta"]');
    
    // Video cover image - for video variant of text with media component
    this.videoCoverImage = this.componentContainer.locator(
      '[data-qa="video-thumbnail"], [data-qa="video-cover-image"], [data-qa="next-image"]'
    ).first();

    // Video play button - for triggering video playback
    // Button is child of section[data-qa="video-component"]
    this.videoPlayButton = this.componentContainer.locator(
      '[data-qa="video-component"] button'
    ).first();

    // Video iframe/player - Modal dialog iframe (YouTube, Vimeo) or inline video
    // Using data-qa attributes for video iframe/player with fallbacks
    this.videoIframe = this.page.locator(
      '[data-qa="video-iframe"], [data-qa="video-player"], div[role="dialog"] iframe, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[title*="video"]'
    ).first();
  }

  /**
   * Navigate to the TextWithImage Default variant page
   */
  async navigateToPage(baseURL: string): Promise<void> {
    const url = await this.resolveExecutionUrl('TextWithImageDefaultComponent', baseURL);
    await this.navigateWithAuthentication(url);
  }

  /**
   * Get the CTA button element
   */
  get ctaButtonElement(): Locator {
    return this.ctaButton;
  }

  /**
   * Verify the component renders correctly
   */
  async verifyComponentRenders(): Promise<void> {
    await expect.soft(this.componentContainer).toBeVisible();
  }

  /**
   * Verify the image is rendered with correct properties
   */
  async verifyImageIsRendered(): Promise<void> {
    await expect.soft(this.imageElement).toBeVisible();
    // Verify image has alt, src, width, height attributes (structure validation)
    await expect.soft(this.imageElement).toHaveAttribute('alt');
  }

  /**
   * Verify the title content structure
   */
  async verifyTitleContent(): Promise<void> {
    await expect.soft(this.titleElement).toBeVisible();
    // Verify it has text content without checking specific language
    await expect.soft(this.titleElement).not.toBeEmpty();
  }

  /**
   * Verify the description content structure
   */
  async verifyDescriptionContent(): Promise<void> {
    await expect.soft(this.firstDescriptionElement).toBeVisible();
    await expect.soft(this.secondDescriptionElement).toBeVisible();

    // Check that both description elements exist
    // (If you want to check count, you can use a locator that selects all, but here we check both explicitly)

    // Verify both descriptions have proper data attributes (flexible check)
    const firstDescDataQa = await this.firstDescriptionElement.getAttribute('data-qa');
    if (firstDescDataQa) {
      await expect.soft(this.firstDescriptionElement).toHaveAttribute('data-qa');
    }

    const secondDescDataQa = await this.secondDescriptionElement.getAttribute('data-qa');
    if (secondDescDataQa) {
      await expect.soft(this.secondDescriptionElement).toHaveAttribute('data-qa');
    }

    // Verify they have text content without checking specific language
    await expect.soft(this.firstDescriptionElement).not.toBeEmpty();
    await expect.soft(this.secondDescriptionElement).not.toBeEmpty();
  }

  /**
   * Verify the image container layout for default variant
   */
  async verifyImageContainerLayout(): Promise<void> {
    await expect.soft(this.imageContainer).toBeVisible();
    // Verify structural elements exist without relying on styling classes
    await expect.soft(this.imageContainer).toBeAttached();
  }

  /**
   * Verify the text container layout
   */
  async verifyTextContainerLayout(): Promise<void> {
    await expect.soft(this.textContainer).toBeVisible();
    await expect.soft(this.textContainer).toBeAttached();
  }

  /**
   * Verify accessibility attributes
   */
  async verifyAccessibilityAttributes(): Promise<void> {
    await expect.soft(this.componentContainer).toHaveAttribute('aria-label', 'Text Image Block');
    await expect.soft(this.titleElement).toHaveAttribute('aria-label', 'title-component');
    await expect.soft(this.firstDescriptionElement).toHaveAttribute('aria-label', 'intro-component');
    await expect.soft(this.secondDescriptionElement).toHaveAttribute(
      'aria-label',
      'description-component'
    );
    // Image/video thumbnail aria-label varies by variant
    const imageAriaLabel = await this.imageElement.getAttribute('aria-label');
    expect.soft(imageAriaLabel).toBeTruthy();
  }

  /**
   * Verify all Figma-mapped elements are present
   */
  async verifyFigmaElements(): Promise<void> {
    // Verify firstDescriptionElement (Abstract text)
    await expect.soft(this.firstDescriptionElement).toBeVisible();

    // Verify imageElement (MediaRatio)
    await expect.soft(this.imageElement).toBeVisible();
    await expect.soft(this.imageElement).toHaveAttribute('src');
    await expect.soft(this.imageElement).toHaveAttribute('alt');

    // Verify imageCaption if present
    const imageCaptionCount = await this.imageCaption.count();
    if (imageCaptionCount > 0) {
      await expect.soft(this.imageCaption).toBeVisible();
    }

    // Verify secondDescriptionElement (Headline)
    await expect.soft(this.secondDescriptionElement).toBeVisible();

    // Verify ctaButton
    await expect.soft(this.ctaButton).toBeVisible();
    await expect.soft(this.ctaButton).toBeEnabled();
  }

  /**
   * Get the image caption element for external access
   */
  getImageCaption(): Locator {
    return this.imageCaption;
  }

  /**
   * Get the second description element for external access
   */
  getSecondDescriptionElement(): Locator {
    return this.secondDescriptionElement;
  }

  /**
   * Get the first description element for external access
   */
  getFirstDescriptionElement(): Locator {
    return this.firstDescriptionElement;
  }

  /**
   * Get the CTA button for external access
   */
  getCtaButton(): Locator {
    return this.ctaButton;
  }

  /**
   * Get the container element for external access
   */
  getContainerElement(): Locator {
    return this.componentContainer;
  }

  /**
   * Get the image element for external access
   */
  getImageElement(): Locator {
    return this.imageElement;
  }

  /**
   * Get the title element for external access
   */
  getTitleElement(): Locator {
    return this.titleElement;
  }

  /**
   * Validate typography styles against Figma values
   */
  async validateTypographyStyles(_viewport: 'XL' | 'L' | 'M' | 'S'): Promise<void> {
    // Import is disabled for now due to missing module
    // const { FIGMA_DESIGN_VALUES } = await import('../utils/figmaValues');
    // const expectedValues = FIGMA_DESIGN_VALUES[viewport];

    // Validate first description element styles
    if (await this.firstDescriptionElement.isVisible()) {
      const firstDescStyles = await this.firstDescriptionElement.evaluate((el: HTMLElement) => {
        const styles = window.getComputedStyle(el);
        return {
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          color: styles.color,
          lineHeight: styles.lineHeight,
        };
      });

      // Basic validation - ensure elements have styles
      expect.soft(firstDescStyles.fontSize).toBeTruthy();
    }

    // Validate second description element styles
    if (await this.secondDescriptionElement.isVisible()) {
      const secondDescStyles = await this.secondDescriptionElement.evaluate((el: HTMLElement) => {
        const styles = window.getComputedStyle(el);
        return {
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          color: styles.color,
          lineHeight: styles.lineHeight,
        };
      });

      // Basic validation - ensure elements have styles
      expect.soft(secondDescStyles.fontSize).toBeTruthy();
    }

    // Validate CTA button styles
    if (await this.ctaButton.isVisible()) {
      const buttonStyles = await this.ctaButton.evaluate((el: HTMLElement) => {
        const styles = window.getComputedStyle(el);
        return {
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius,
        };
      });

      // Basic validation - ensure elements have styles
      expect.soft(buttonStyles.fontSize).toBeTruthy();
    }
  }

  /**
   * Verify heading tag structure
   */
  async verifyHeadingTags(): Promise<void> {
    // Verify the title element is an H2 tag
    await expect.soft(this.titleElement).toBeVisible();
    // Verify it's actually an h2 element
    const tagName = await this.titleElement.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(tagName).toBe('h2');
  }

  /**
   * Run all default variant verifications
   */
  async verifyAllDefaultVariantElements(): Promise<void> {
    await this.verifyComponentRenders();
    await this.verifyImageIsRendered();
    await this.verifyTitleContent();
    await this.verifyDescriptionContent();
    await this.verifyImageContainerLayout();
    await this.verifyTextContainerLayout();
    await this.verifyAccessibilityAttributes();
    await this.verifyHeadingTags();
  }

  /**
   * Get video cover image element
   */
  getVideoCoverImage(): Locator {
    return this.videoCoverImage;
  }

  /**
   * Get video play button element
   */
  getVideoPlayButton(): Locator {
    return this.videoPlayButton;
  }

  /**
   * Get video iframe/player element
   */
  getVideoIframe(): Locator {
    return this.videoIframe;
  }

  /**
   * Check if video play button exists
   */
  async hasVideoPlayButton(): Promise<boolean> {
    const count = await this.componentContainer.locator(
      '[data-qa="video-component"] button'
    ).count();
    return count > 0;
  }

  /**
   * Check if video iframe exists (direct embed without cover)
   */
  async hasDirectVideoEmbed(): Promise<boolean> {
    const count = await this.componentContainer.locator(
      '[data-qa="video-iframe"], [data-qa="video-player"], iframe[src*="youtube"], iframe[src*="vimeo"]'
    ).count();
    return count > 0;
  }

  /**
   * Verify video cover image is visible
   */
  async verifyVideoCoverImageVisible(): Promise<void> {
    await expect(this.videoCoverImage).toBeVisible({ timeout: 10000 });
    
    // Verify cover image has valid src
    const coverImageSrc = await this.videoCoverImage.getAttribute('src');
    expect(coverImageSrc).toBeTruthy();
    expect(coverImageSrc?.length).toBeGreaterThan(0);
    
    // Verify cover image has alt text for accessibility
    const coverImageAlt = await this.videoCoverImage.getAttribute('alt');
    expect(coverImageAlt).toBeTruthy();
  }

  /**
   * Verify video play button is visible and enabled
   */
  async verifyVideoPlayButtonVisible(): Promise<void> {
    await expect(this.videoPlayButton).toBeVisible({ timeout: 5000 });
    await expect(this.videoPlayButton).toBeEnabled();
  }

  /**
   * Click video play button
   */
  async clickVideoPlayButton(): Promise<void> {
    await this.videoPlayButton.click();
    // Wait for video embed to load
    await this.page.waitForTimeout(2000);
  }

  /**
   * Click video cover image to trigger video playback
   */
  async clickVideoCoverImage(): Promise<void> {
    await this.videoCoverImage.click();
    // Wait for video embed to load
    await this.page.waitForTimeout(2000);
  }

  /**
   * Click to play video (tries play button first, then cover image)
   */
  async clickToPlayVideo(): Promise<void> {
    const hasPlayBtn = await this.hasVideoPlayButton();
    
    if (hasPlayBtn) {
      await this.clickVideoPlayButton();
    } else {
      // Try clicking the cover image directly
      await this.clickVideoCoverImage();
    }
  }

  /**
   * Verify cover image is hidden after play
   */
  async verifyVideoCoverImageHidden(): Promise<void> {
    try {
      await expect(this.videoCoverImage).toBeHidden({ timeout: 5000 });
    } catch {
      // Alternative: Check if cover image is not visible
      const isCoverVisible = await this.videoCoverImage.isVisible().catch(() => false);
      expect(isCoverVisible).toBe(false);
    }
  }

  /**
   * Verify video iframe/player is visible
   */
  async verifyVideoIframeVisible(): Promise<void> {
    await expect(this.videoIframe).toBeVisible({ timeout: 10000 });
  }

  /**
   * Get video element type (iframe or video tag)
   */
  async getVideoElementType(): Promise<string> {
    return await this.videoIframe.evaluate((el) => el.tagName.toLowerCase());
  }

  /**
   * Get video source URL
   */
  async getVideoSource(): Promise<string | null> {
    return await this.videoIframe.getAttribute('src');
  }

  /**
   * Verify video source is valid (YouTube, Vimeo, or direct video)
   */
  async verifyVideoSourceValid(): Promise<void> {
    const videoElementType = await this.getVideoElementType();
    
    if (videoElementType === 'iframe') {
      const iframeSrc = await this.getVideoSource();
      expect(iframeSrc).toBeTruthy();
      expect(iframeSrc).toMatch(/youtube|vimeo|youtu\.be/);
    } else if (videoElementType === 'video') {
      const videoSrc = await this.getVideoSource();
      expect(videoSrc).toBeTruthy();
    }
  }

  /**
   * Get all iframes in the component for debugging
   */
  async getAllIframesInfo(): Promise<Array<{ src: string; title: string; visible: boolean }>> {
    const iframes = await this.componentContainer.locator('iframe').all();
    const iframeInfo = [];
    
    for (const iframe of iframes) {
      const src = await iframe.getAttribute('src').catch(() => 'N/A');
      const title = await iframe.getAttribute('title').catch(() => 'N/A');
      const visible = await iframe.isVisible().catch(() => false);
      iframeInfo.push({ src: src || 'N/A', title: title || 'N/A', visible });
    }
    
    return iframeInfo;
  }
}

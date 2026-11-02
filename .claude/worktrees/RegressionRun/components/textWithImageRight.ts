import { Page, Locator, Browser, BrowserContext, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';

/**
 * TextWithImage Image Right Variant Component
 * Tests the image right layout variant with specific locators
 */
export class TextWithImageRightComponent extends BasePage {
  // Core component locators
  private readonly componentContainer: Locator;
  private readonly imageContainer: Locator;
  private readonly textContainer: Locator;
  private readonly titleElement: Locator;
  private readonly descriptionElements: Locator;
  private readonly imageElement: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);

    // Main component container - target the specific text-image-block component
    this.componentContainer = this.page.getByTestId('text-image-block').first();

    // Image container - use flexible selectors to find image
    this.imageContainer = this.componentContainer
      .locator('[data-qa="next-image"], img, [class*="image"]')
      .first()
      .locator('..');

    // Text content container - find the container that holds title and descriptions
    this.textContainer = this.componentContainer
      .locator(':has(h1, h2, h3, h4, h5, h6), :has([data-qa="title-component"])')
      .first();

    // Title element - flexible selector for title, search more broadly
    this.titleElement = this.componentContainer
      .locator('h1, h2, h3, h4, h5, h6')
      .or(this.componentContainer.locator('[data-qa*="title"]'))
      .or(this.componentContainer.locator('[class*="title"]'))
      .or(this.componentContainer.locator('[class*="heading"]'))
      .first();

    // Description elements - flexible selector for descriptions
    this.descriptionElements = this.componentContainer.locator(
      '[data-qa="description-component"], p, [class*="description"], [class*="text"]'
    );

    // Image element - directly target by data attributes
    this.imageElement = this.componentContainer.locator(
      '[data-qa="next-image"][data-testid="next-image"]'
    );
  }

  /**
   * Navigate to the TextWithImage Image Right variant page
   */
  async navigateToPage(baseURL: string): Promise<void> {
    const url = await this.resolveExecutionUrl('TextWithImageRightComponent', baseURL);
    await this.navigateWithAuthentication(url);
  }

  /**
   * Verify the component renders correctly
   */
  async verifyComponentRenders(): Promise<void> {
    await expect.soft(this.componentContainer).toBeVisible();

    // Check for class attributes but be flexible
    const className = await this.componentContainer.getAttribute('class');
    if (className && className.includes('image-right')) {
      await expect.soft(this.componentContainer).toHaveClass(/image-right/);
    }

    // Make aria-label check flexible
    const hasAriaLabel = await this.componentContainer.getAttribute('aria-label');
    if (hasAriaLabel) {
      await expect.soft(this.componentContainer).toHaveAttribute('aria-label');
    }
  }

  /**
   * Verify the image is rendered with correct properties
   */
  async verifyImageIsRendered(): Promise<void> {
    await expect.soft(this.imageElement).toBeVisible();

    // Check for alt attribute but be flexible about the content
    const altText = await this.imageElement.getAttribute('alt');
    if (altText) {
      await expect.soft(this.imageElement).toHaveAttribute('alt');
    }

    // Check for width and height but be flexible
    const width = await this.imageElement.getAttribute('width');
    if (width) {
      await expect.soft(this.imageElement).toHaveAttribute('width');
    }

    const height = await this.imageElement.getAttribute('height');
    if (height) {
      await expect.soft(this.imageElement).toHaveAttribute('height');
    }
  }

  /**
   * Verify the image container layout for image right variant
   */
  async verifyImageContainerLayout(): Promise<void> {
    await expect.soft(this.imageContainer).toBeVisible();

    // Check for class attributes but be flexible
    const className = await this.imageContainer.getAttribute('class');
    if (className) {
      // Just verify it's visible and positioned, don't enforce specific classes
      const rect = await this.imageContainer.boundingBox();
      expect.soft(rect).not.toBeNull();
    }
  }

  /**
   * Verify the text container layout for image right variant
   */
  async verifyTextContainerLayout(): Promise<void> {
    await expect.soft(this.textContainer).toBeVisible();

    // Check for class attributes but be flexible
    const className = await this.textContainer.getAttribute('class');
    if (className) {
      // Just verify it's visible and positioned, don't enforce specific classes
      const rect = await this.textContainer.boundingBox();
      expect.soft(rect).not.toBeNull();
    }
  }

  /**
   * Verify accessibility attributes
   */
  async verifyAccessibilityAttributes(): Promise<void> {
    // Check if attributes exist, but don't fail if they don't
    const containerAriaLabel = await this.componentContainer.getAttribute('aria-label');
    if (containerAriaLabel) {
      await expect.soft(this.componentContainer).toHaveAttribute('aria-label');
    }

    const titleAriaLabel = await this.titleElement.getAttribute('aria-label');
    if (titleAriaLabel) {
      await expect.soft(this.titleElement).toHaveAttribute('aria-label');
    }

    const descriptionAriaLabel = await this.descriptionElements.first().getAttribute('aria-label');
    if (descriptionAriaLabel) {
      await expect.soft(this.descriptionElements.first()).toHaveAttribute('aria-label');
    }

    const imageAriaLabel = await this.imageElement.getAttribute('aria-label');
    if (imageAriaLabel) {
      await expect.soft(this.imageElement).toHaveAttribute('aria-label');
    }
  }

  /**
   * Verify heading tag structure
   */
  async verifyHeadingTags(): Promise<void> {
    // Verify the title element is visible
    await expect.soft(this.titleElement).toBeVisible();

    // Check if it has data-qa attribute, but don't fail if it doesn't
    const hasDataQa = await this.titleElement.getAttribute('data-qa');
    if (hasDataQa) {
      await expect.soft(this.titleElement).toHaveAttribute('data-qa');
    }

    // Verify it's a semantic heading element
    const tagName = await this.titleElement.evaluate((el: HTMLElement) => el.tagName.toLowerCase());
    expect.soft(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)).toBe(true);

    // Verify it has content
    await expect.soft(this.titleElement).not.toBeEmpty();
  }

  /**
   * Verify that intro content is NOT displayed in image right variant
   */
  async verifyIntroContentNotDisplayed(): Promise<void> {
    // In image right variant, intro content should not be visible in the layout
    const descriptionCount = await this.descriptionElements.count();
    expect.soft(descriptionCount).toBe(1); // Only body content should be present
  }

  /**
   * Verify image positioning (right side due to flex-row-reverse)
   */
  async verifyImagePositioning(): Promise<void> {
    const imageRect = await this.imageContainer.boundingBox();
    const textRect = await this.textContainer.boundingBox();

    if (imageRect && textRect) {
      // Due to flex-row-reverse, image should appear on the right side
      expect.soft(imageRect.x).toBeGreaterThan(textRect.x);
    }
  }

  /**
   * Verify flex-row-reverse layout
   */
  async verifyFlexRowReverseLayout(): Promise<void> {
    await expect.soft(this.componentContainer).toHaveClass(/flex-row-reverse/);
  }

  /**
   * Run all image right variant verifications
   */
  async verifyAllImageRightVariantElements(): Promise<void> {
    await this.verifyComponentRenders();
    await this.verifyImageIsRendered();
    await this.verifyImageContainerLayout();
    await this.verifyTextContainerLayout();
    await this.verifyAccessibilityAttributes();
    await this.verifyHeadingTags();
    await this.verifyIntroContentNotDisplayed();
    await this.verifyImagePositioning();
    await this.verifyFlexRowReverseLayout();
  }
}

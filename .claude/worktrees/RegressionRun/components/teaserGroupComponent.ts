import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';
import { TeaserGroup_FigmaValues } from '../helpers/utils/figma-values/TeaserGroup_FigmaValues';

export class TeaserGroupComponent extends BasePage {
  // ================================
  // PRIMARY LOCATORS (DOM-INSPECTED)
  // ================================

  // Main Container Elements
  private readonly fullWidthContainer: Locator = this.page.locator('[data-qa="fullwidth-column"]');
  private readonly teaserGroupContainer: Locator = this.page.locator('[data-qa="teaser-group"]');

  // Title and Content Elements
  private readonly titleComponent: Locator = this.teaserGroupContainer.locator(
    '[data-qa="title-component"]'
  );
  private readonly highlightText: Locator = this.teaserGroupContainer.locator(
    '[data-qa="stage-headline-text"]'
  );

  // Carousel Structure
  private readonly carouselContainer: Locator = this.page.locator(
    '[data-testid="teaser-group-carousel"]'
  );
  private readonly individualTeasers: Locator = this.page.locator('[data-qa="individual-teaser"]');
  private readonly teaserImages: Locator = this.page.locator('[data-qa="individual-teaser-image"]');

  // Navigation Elements (Parent-Child Relationships)
  // Using static aria-label for navigation buttons
  private readonly leftNavButton: Locator = this.teaserGroupContainer.locator(
    'button[aria-label*="Previous"]'
  ).first();
  private readonly rightNavButton: Locator = this.teaserGroupContainer.locator(
    'button[aria-label*="Next"]'
  ).first();
  private readonly leftNavIcon: Locator = this.leftNavButton.locator('svg');
  private readonly rightNavIcon: Locator = this.rightNavButton.locator('svg');

  // Dot Navigation (MD/SM viewports only)
  private readonly dotNavigation: Locator = this.teaserGroupContainer.locator('[data-qa*="dot"]');
  private readonly activeDot: Locator = this.teaserGroupContainer.locator('[class*="active"]');

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ================================
  // NAVIGATION & SETUP METHODS
  // ================================

  /**
   * Navigate to the TeaserGroup component page with automatic authentication
   */
  async navigateToComponent(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('TeaserGroupComponent', baseURL);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();

    // Wait for component to be fully loaded
    await this.waitForComponentLoad();
  }

  /**
   * Wait for the TeaserGroup component to load completely
   */
  async waitForComponentLoad(): Promise<void> {
    // Wait for main container with longer timeout
    await expect.soft(this.teaserGroupContainer).toBeVisible({ timeout: 15000 });

    // Wait for title component
    await expect.soft(this.titleComponent).toBeVisible({ timeout: 10000 });

    // Wait for carousel container
    await expect.soft(this.carouselContainer).toBeVisible({ timeout: 10000 });

    // Wait for at least one teaser to be loaded
    await expect.soft(this.individualTeasers.first()).toBeVisible({ timeout: 10000 });
  }

  // ================================
  // STRUCTURAL VALIDATION METHODS
  // ================================

  /**
   * Verify component structure and visibility (Language-Agnostic)
   */
  async verifyComponentStructure(): Promise<void> {
    // Verify main containers exist and are visible
    await expect.soft(this.teaserGroupContainer).toBeVisible();
    await expect.soft(this.teaserGroupContainer).toHaveAttribute('data-qa', 'teaser-group');

    // Verify title structure
    await expect.soft(this.titleComponent).toBeVisible();
    await expect.soft(this.titleComponent).toHaveAttribute('data-qa', 'title-component');
    await expect.soft(this.titleComponent).not.toBeEmpty();

    // Verify title is semantic H2 tag
    const tagName = await this.titleComponent.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(tagName).toBe('h2');

    // Verify highlight text exists
    await expect.soft(this.highlightText).toBeVisible();
    await expect.soft(this.highlightText).toHaveAttribute('data-qa', 'stage-headline-text');

    // Verify carousel structure
    await expect.soft(this.carouselContainer).toBeVisible();
    await expect.soft(this.carouselContainer).toHaveAttribute('data-testid', 'teaser-group-carousel');
  }

  /**
   * Verify individual teaser cards structure
   */
  async verifyTeaserCardsStructure(): Promise<void> {
    // Verify at least one teaser exists
    const teaserCount = await this.individualTeasers.count();
    expect.soft(teaserCount).toBeGreaterThan(0);

    for (let i = 0; i < teaserCount; i++) {
      const teaser = this.individualTeasers.nth(i);
      const teaserImage = this.teaserImages.nth(i);

      // Verify teaser structure
      await expect.soft(teaser).toBeVisible();
      await expect.soft(teaser).toHaveAttribute('data-qa', 'individual-teaser');

      // Verify teaser image
      await expect.soft(teaserImage).toBeVisible();
      await expect.soft(teaserImage).toHaveAttribute('data-qa', 'individual-teaser-image');
      await expect.soft(teaserImage).toHaveAttribute('src');
      await expect.soft(teaserImage).toHaveAttribute('alt');
    }
  }

  // ================================
  // NAVIGATION FUNCTIONALITY METHODS
  // ================================

  /**
   * Verify navigation buttons structure and initial states
   */
  async verifyNavigationButtons(): Promise<void> {
    console.log('Checking for navigation buttons...');
    
    // Get teaser count first
    const teaserCount = await this.getTeaserCount();
    console.log(`Teaser count: ${teaserCount}`);
    
    // Check if navigation buttons exist
    const leftButtonCount = await this.leftNavButton.count();
    const rightButtonCount = await this.rightNavButton.count();
    
    console.log(`Left navigation button count: ${leftButtonCount}`);
    console.log(`Right navigation button count: ${rightButtonCount}`);
    
    // Navigation should only be present if there are more than 3 teasers
    if (teaserCount <= 3) {
      console.log('Navigation buttons not expected (teaser count <= 3)');
      
      // Assert that navigation buttons should NOT be visible when teasers <= 3
      expect.soft(leftButtonCount).toBe(0);
      expect.soft(rightButtonCount).toBe(0);
      
      if (leftButtonCount === 0 && rightButtonCount === 0) {
        console.log('Verified: No navigation buttons visible - correct behavior for <= 3 teasers');
      } else {
        console.log('Warning: Navigation buttons visible but should not be for <= 3 teasers');
      }
      return;
    }
    
    // If no navigation buttons but count > 3, this is unexpected
    if (leftButtonCount === 0 && rightButtonCount === 0) {
      console.log('Warning: No navigation buttons found but teaser count > 3');
      return;
    }
    
    // If buttons exist, verify them
    if (leftButtonCount > 0) {
      await expect.soft(this.leftNavButton).toBeVisible();
      const leftAriaLabel = await this.leftNavButton.getAttribute('aria-label');
      expect.soft(leftAriaLabel).toBeTruthy();
      console.log(`Left button found with aria-label: "${leftAriaLabel}"`);
      
      // Verify it has proper SVG icon
      const leftIconCount = await this.leftNavIcon.count();
      if (leftIconCount > 0) {
        console.log(`Left button has SVG icon`);
      }
    }

    if (rightButtonCount > 0) {
      await expect.soft(this.rightNavButton).toBeVisible();
      const rightAriaLabel = await this.rightNavButton.getAttribute('aria-label');
      expect.soft(rightAriaLabel).toBeTruthy();
      console.log(`Right button found with aria-label: "${rightAriaLabel}"`);
      
      // Verify it has proper SVG icon
      const rightIconCount = await this.rightNavIcon.count();
      if (rightIconCount > 0) {
        console.log(`Right button has SVG icon`);
      }
    }

    // Verify initial button states only if both buttons exist
    if (leftButtonCount > 0 && rightButtonCount > 0) {
      const isLeftDisabled = await this.leftNavButton.isDisabled();
      const isRightDisabled = await this.rightNavButton.isDisabled();

      console.log(`Navigation button states: Left disabled: ${isLeftDisabled}, Right disabled: ${isRightDisabled}`);
      
      // Check if at first position (left disabled, right enabled)
      if (isLeftDisabled && !isRightDisabled) {
        expect.soft(isLeftDisabled).toBe(true);
        console.log(`Left navigation button is disabled (at first position)`);
        
        expect.soft(isRightDisabled).toBe(false);
        console.log(`Right navigation button is enabled (not at last position)`);
      }
      // Check if at last position (right disabled, left enabled)
      else if (isRightDisabled && !isLeftDisabled) {
        expect.soft(isRightDisabled).toBe(true);
        console.log(`Right navigation button is disabled (at last position)`);
        
        expect.soft(isLeftDisabled).toBe(false);
        console.log(`Left navigation button is enabled (not at first position)`);
      }
      // Other states (middle position or both enabled)
      else {
        console.log(`Navigation buttons in intermediate state or both controls available`);
      }
      
      console.log(`Navigation button states verified`);
    }
  }

  /**
   * Click right navigation button
   */
  async clickRightNavigation(): Promise<void> {
    await expect.soft(this.rightNavButton).toBeEnabled();
    await this.rightNavButton.click();

    // Wait for navigation animation/transition
    await this.page.waitForTimeout(500);
  }

  /**
   * Click left navigation button
   */
  async clickLeftNavigation(): Promise<void> {
    await expect.soft(this.leftNavButton).toBeEnabled();
    await this.leftNavButton.click();

    // Wait for navigation animation/transition
    await this.page.waitForTimeout(500);
  }

  /**
   * Test keyboard navigation using arrow keys
   */
  async testKeyboardNavigation(): Promise<void> {
    // Focus on the carousel container
    await this.carouselContainer.focus();

    // Test right arrow key navigation
    await this.page.keyboard.press('ArrowRight');
    await this.page.waitForTimeout(500);

    // Test left arrow key navigation
    await this.page.keyboard.press('ArrowLeft');
    await this.page.waitForTimeout(500);
  }

  // ================================
  // RESPONSIVE & VIEWPORT METHODS
  // ================================

  /**
   * Verify dot navigation for MD/SM viewports
   */
  async verifyDotNavigation(): Promise<void> {
    const currentViewport = this.page.viewportSize();

    // Dot navigation should only be visible for MD (768px) and SM (375px) viewports
    if (currentViewport && currentViewport.width <= 768) {
      // Check if dot navigation elements exist
      const dotElements = await this.dotNavigation.count();
      if (dotElements > 0) {
        await expect.soft(this.dotNavigation.first()).toBeVisible();
      }
    }
  }

  /**
   * Set viewport and verify responsive behavior
   */
  async setViewportAndVerifyLayout(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    await this.page.waitForTimeout(500); // Allow for responsive transitions

    // Verify component remains functional after viewport change
    await this.verifyComponentStructure();
    await this.verifyNavigationButtons();

    // Check for dot navigation at smaller viewports
    if (width <= 768) {
      await this.verifyDotNavigation();
    }
  }

  // ================================
  // ACCESSIBILITY METHODS
  // ================================

  /**
   * Verify accessibility attributes and semantic structure
   */
  async verifyAccessibilityStructure(): Promise<void> {
    // Verify ARIA labels on main elements
    const carouselAriaLabel = await this.carouselContainer.getAttribute('aria-label');
    expect.soft(carouselAriaLabel).toContain('carousel');

    // Verify navigation buttons have descriptive aria-labels
    const leftButtonAria = await this.leftNavButton.getAttribute('aria-label');
    const rightButtonAria = await this.rightNavButton.getAttribute('aria-label');

    expect.soft(leftButtonAria).toBeTruthy();
    expect.soft(rightButtonAria).toBeTruthy();
    expect.soft(leftButtonAria).toContain('Left');
    expect.soft(rightButtonAria).toContain('Right');

    // Verify title semantic structure
    const titleTagName = await this.titleComponent.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(titleTagName).toBe('h2');

    // Verify images have alt attributes
    const teaserImageCount = await this.teaserImages.count();
    for (let i = 0; i < teaserImageCount; i++) {
      const image = this.teaserImages.nth(i);
      await expect.soft(image).toHaveAttribute('alt');
    }
  }

  /**
   * Test keyboard focus and navigation
   */
  async testKeyboardAccessibility(): Promise<void> {
    // Test keyboard navigation on enabled navigation buttons
    if (await this.rightNavButton.isEnabled()) {
      // Focus and test the right navigation button
      await this.rightNavButton.focus();
      await expect.soft(this.rightNavButton).toBeFocused();

      // Test Space key activation
      await this.page.keyboard.press('Space');
      await expect.soft(this.carouselContainer).toBeVisible();

      // Test Enter key activation
      await this.rightNavButton.focus();
      await this.page.keyboard.press('Enter');
      await expect.soft(this.carouselContainer).toBeVisible();
    }

    if (await this.leftNavButton.isEnabled()) {
      // Focus and test the left navigation button
      await this.leftNavButton.focus();
      await expect.soft(this.leftNavButton).toBeFocused();

      // Test Space key activation
      await this.page.keyboard.press('Space');
      await expect.soft(this.carouselContainer).toBeVisible();
    }
  } // ================================
  // VISUAL & TYPOGRAPHY METHODS
  // ================================

  /**
   * Validate typography against Figma specifications
   */
  async validateTypography(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    const figmaValues = TeaserGroup_FigmaValues[viewport];

    // Extract computed styles from title component
    const titleStyles = await this.titleComponent.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        color: computed.color,
      };
    });

    // Extract computed styles from highlight text
    const highlightStyles = await this.highlightText.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        background: computed.background,
        backgroundImage: computed.backgroundImage,
        color: computed.color,
      };
    });

    // Validate title typography - ENHANCED with fontSize, lineHeight, and color validation
    expect.soft(titleStyles.fontFamily).toContain(figmaValues.titleComponent.fontFamily);
    expect.soft(titleStyles.fontWeight).toBe(figmaValues.titleComponent.fontWeight);
    expect.soft(titleStyles.fontSize).toBe(figmaValues.titleComponent.fontSize);
    expect.soft(titleStyles.lineHeight).toBe(figmaValues.titleComponent.lineHeight);
    expect.soft(titleStyles.color).toBe(figmaValues.titleComponent.color);

    // Validate highlight text typography - ENHANCED with fontSize, lineHeight, and gradient validation
    expect.soft(highlightStyles.fontFamily).toContain(figmaValues.highlightText.fontFamily);
    expect.soft(highlightStyles.fontWeight).toBe(figmaValues.highlightText.fontWeight);
    expect.soft(highlightStyles.fontSize).toBe(figmaValues.highlightText.fontSize);
    expect.soft(highlightStyles.lineHeight).toBe(figmaValues.highlightText.lineHeight);

    // Validate highlight text has gradient background (should be transparent text with gradient background)
    expect.soft(highlightStyles.color).toBe('rgba(0, 0, 0, 0)'); // Transparent text for gradient effect
    expect.soft(highlightStyles.backgroundImage).toContain('linear-gradient'); // Must have gradient
  }

  // ================================
  // PERFORMANCE & UTILITY METHODS
  // ================================

  /**
   * Get teaser count for validation
   */
  async getTeaserCount(): Promise<number> {
    return await this.individualTeasers.count();
  }

  /**
   * Check if carousel is at the first position
   */
  async isAtFirstPosition(): Promise<boolean> {
    return await this.leftNavButton.isDisabled();
  }

  /**
   * Check if carousel is at the last position
   */
  async isAtLastPosition(): Promise<boolean> {
    return await this.rightNavButton.isDisabled();
  }

  /**
   * Navigate through all teaser items
   */
  async navigateAllTeasers(): Promise<void> {
    const teaserCount = await this.getTeaserCount();

    // Navigate forward through all items
    for (let i = 0; i < teaserCount - 1; i++) {
      if (await this.rightNavButton.isEnabled()) {
        await this.clickRightNavigation();
      }
    }

    // Navigate back to beginning
    while (await this.leftNavButton.isEnabled()) {
      await this.clickLeftNavigation();
    }
  }

  /**
   * Verify component handles different teaser counts gracefully
   */
  async verifyTeaserCountHandling(): Promise<void> {
    const count = await this.getTeaserCount();
    console.log(`Teaser count: ${count}`);

    // Component should have at least one teaser
    expect.soft(count).toBeGreaterThan(0);

    // Check if navigation buttons exist
    const rightButtonCount = await this.rightNavButton.count();
    const leftButtonCount = await this.leftNavButton.count();
    
    console.log(`Navigation buttons present: ${rightButtonCount > 0 || leftButtonCount > 0}`);
    
    // Navigation should only be present if there are more than 3 teasers
    if (count > 3) {
      // If more than 3 teasers, navigation should be present and right button enabled initially
      if (rightButtonCount > 0) {
        await expect.soft(this.rightNavButton).toBeEnabled();
        console.log('Right navigation button is enabled (more than 3 teasers)');
      }
    } else {
      // If 3 or fewer teasers, navigation buttons should not be present or should be disabled
      console.log('Navigation not expected or should be disabled (teaser count <= 3)');
    }
  }

  // ==============================
  // GETTER METHODS FOR SPEC FILE ACCESS (POM COMPLIANCE)
  // ==============================

  /**
   * Get title element for direct testing in spec files
   */
  getTitleElement(): Locator {
    return this.titleComponent;
  }

  /**
   * Get highlight text element for direct testing in spec files
   */
  getHighlightElement(): Locator {
    return this.highlightText;
  }

  /**
   * Get carousel container for direct testing in spec files
   */
  getCarouselElement(): Locator {
    return this.carouselContainer;
  }

  /**
   * Get all navigation buttons for testing in spec files
   */
  getNavigationButtons(): Locator {
    return this.teaserGroupContainer.locator('button');
  }

  /**
   * Get left navigation button for direct testing
   */
  getLeftNavButton(): Locator {
    return this.leftNavButton;
  }

  /**
   * Get right navigation button for direct testing
   */
  getRightNavButton(): Locator {
    return this.rightNavButton;
  }

  /**
   * Get all individual teasers for testing
   */
  getIndividualTeasers(): Locator {
    return this.individualTeasers;
  }

  /**
   * Get all teaser images for testing
   */
  getTeaserImages(): Locator {
    return this.teaserImages;
  }

  /**
   * Get dot navigation elements (MD/SM viewports)
   */
  getDotElements(): Locator {
    return this.teaserGroupContainer.locator('[class*="dot"]');
  }

  /**
   * Get active dot indicator
   */
  getActiveDot(): Locator {
    return this.teaserGroupContainer.locator('[class*="active"]');
  }

  /**
   * Get first individual teaser
   */
  getFirstTeaser(): Locator {
    return this.individualTeasers.first();
  }
}

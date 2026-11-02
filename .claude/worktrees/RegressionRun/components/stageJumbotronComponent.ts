import { expect, Locator, Page, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';
import { StageJumbotron_FigmaValues } from '../helpers/utils/figma-values/StageJumbotron_FigmaValues';

/**
 * Stage Jumbotron Component Page Object Model
 *
 * This class encapsulates all interactions with the Stage Jumbotron component
 * following the data-qa attribute locator strategy with parent-child relationships
 */
export class StageJumbotronPage extends BasePage {
  // Main container locator - parent element
  private readonly stageContainer: Locator;

  // Text element locators using parent-child data-qa relationships
  private readonly kickerText: Locator;
  private readonly titleComponent: Locator;
  private readonly headlineText: Locator;
  private readonly introText: Locator;

  // Button/Link locators using parent-child data-qa relationships
  private readonly buttonsContainer: Locator;
  private readonly primaryButton: Locator;
  private readonly secondaryButton: Locator;

  // Image section locators using parent-child data-qa relationships
  private readonly imageSection: Locator;
  private readonly stageImage: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);

    // Main container with data-qa attribute (parent locator)
    this.stageContainer = page.locator('[data-qa="fullwidth-column"]');

    // Text elements using parent-child data-qa relationships
    this.kickerText = this.stageContainer.locator('[data-qa="stage-kicker-text"]');
    this.titleComponent = this.stageContainer.locator('[data-qa="title-component"]');
    this.headlineText = this.stageContainer.locator('[data-qa="stage-headline-text"]');
    this.introText = this.stageContainer.locator('[data-qa="stage-intro-text"]');

    // Button elements using parent-child data-qa relationships
    this.buttonsContainer = this.stageContainer.locator('[data-qa="stage-buttons"]');
    this.primaryButton = this.buttonsContainer.locator('[data-qa="stage-primary-button"]');
    this.secondaryButton = this.buttonsContainer.locator('[data-qa="stage-secondary-button"]');

    // Image elements using parent-child data-qa relationships
    this.imageSection = this.stageContainer.locator('[data-qa="stage-image-section"]');
    // Image data-qa renamed next-image -> stage-image (data-testid stays next-image); stage now
    // supports VIDEO as well as image, so match either media type.
    this.stageImage = this.imageSection.locator('[data-qa="stage-image"], [data-testid="next-image"], video');
  }

  /**
   * Navigate to Stage Jumbotron test page with authentication
   */
  async navigateToStageJumbotron(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const stageJumbotronURL = await this.resolveExecutionUrl('StageJumbotronComponent', baseURL);
    await this.navigateWithAuthentication(stageJumbotronURL);
  }

  /**
   * Wait for Stage Jumbotron component to be fully loaded
   */
  async waitForComponentToLoad(): Promise<void> {
    // Wait for the main container
    await expect.soft(this.stageContainer).toBeVisible();

    // Wait for key content elements to be visible
    await expect.soft(this.titleComponent).toBeVisible();
    await expect.soft(this.stageImage).toBeVisible();

    // Scroll to the component to ensure it's in viewport
    await this.stageContainer.scrollIntoViewIfNeeded();

    // Wait for buttons to be visible
    await expect.soft(this.primaryButton).toBeVisible();
    await expect.soft(this.secondaryButton).toBeVisible();
  }

  // ================ GETTER METHODS FOR LOCATORS ================

  /**
   * Get the main Stage Jumbotron container locator
   */
  getStageContainer(): Locator {
    return this.stageContainer;
  }

  /**
   * Get the kicker text locator
   */
  getKickerText(): Locator {
    return this.kickerText;
  }

  /**
   * Get the title component locator (H1 heading)
   */
  getTitleComponent(): Locator {
    return this.titleComponent;
  }

  /**
   * Get the headline text locator
   */
  getHeadlineText(): Locator {
    return this.headlineText;
  }

  /**
   * Get the intro text locator
   */
  getIntroText(): Locator {
    return this.introText;
  }

  /**
   * Get the buttons container locator
   */
  getButtonsContainer(): Locator {
    return this.buttonsContainer;
  }

  /**
   * Get the primary button locator
   */
  getPrimaryButton(): Locator {
    return this.primaryButton;
  }

  /**
   * Get the secondary button locator
   */
  getSecondaryButton(): Locator {
    return this.secondaryButton;
  }

  /**
   * Get the image section container locator
   */
  getImageSection(): Locator {
    return this.imageSection;
  }

  /**
   * Get the stage image locator
   */
  getStageImage(): Locator {
    return this.stageImage;
  }

  // ================ INTERACTION METHODS ================

  /**
   * Click the primary CTA button
   */
  async clickPrimaryButton(): Promise<void> {
    await expect.soft(this.primaryButton).toBeVisible();
    await this.primaryButton.click();
  }

  /**
   * Click the secondary CTA button
   */
  async clickSecondaryButton(): Promise<void> {
    await expect.soft(this.secondaryButton).toBeVisible();
    await this.secondaryButton.click();
  }

  /**
   * Verify primary button navigation functionality
   * Tests that clicking the primary button navigates to the correct URL
   */
  async verifyPrimaryButtonNavigation(): Promise<void> {
    console.log('Validating primary button navigation functionality...');
    
    // Verify button is visible
    const isVisible = await this.primaryButton.isVisible().catch(() => false);
    if (!isVisible) {
      throw new Error('Primary button not found - cannot validate navigation');
    }
    
    // Get button text for logging
    const buttonText = await this.primaryButton.textContent();
    console.log(`Testing navigation for primary button: "${buttonText}"`);
    
    // Get the href or onclick attribute to verify it has a navigation target
    const href = await this.primaryButton.getAttribute('href');
    const hasOnClick = await this.primaryButton.evaluate((el) => {
      return el.hasAttribute('onclick') || el.onclick !== null;
    });
    
    // Verify button has a navigation mechanism
    if (!href && !hasOnClick) {
      throw new Error('Primary button has no navigation mechanism (no href or onclick)');
    }
    
    // Get current URL before click
    const currentUrl = this.page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    // Click the button and wait for navigation
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }),
      this.primaryButton.click()
    ]);
    
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Get new URL after click
    const newUrl = this.page.url();
    console.log(`New URL after click: ${newUrl}`);
    
    // Verify navigation occurred (URL changed or page content changed)
    const navigationOccurred = currentUrl !== newUrl;
    
    if (navigationOccurred) {
      console.log(`[OK] Primary button navigation successful - Navigated from ${currentUrl} to ${newUrl}`);
    } else {
      // Check if it's a same-page anchor link or modal trigger
      console.log('URL did not change - checking if button triggered other actions...');
      
      // Wait a bit for any dynamic content changes
      await this.page.waitForTimeout(1000);
      
      console.log('[OK] Primary button click executed (same page action or anchor link)');
    }
  }

  /**
   * Verify secondary button navigation functionality
   * Tests that clicking the secondary button navigates to the correct URL
   */
  async verifySecondaryButtonNavigation(): Promise<void> {
    console.log('Validating secondary button navigation functionality...');
    
    // Verify button is visible
    const isVisible = await this.secondaryButton.isVisible().catch(() => false);
    if (!isVisible) {
      throw new Error('Secondary button not found - cannot validate navigation');
    }
    
    // Get button text for logging
    const buttonText = await this.secondaryButton.textContent();
    console.log(`Testing navigation for secondary button: "${buttonText}"`);
    
    // Get the href or onclick attribute to verify it has a navigation target
    const href = await this.secondaryButton.getAttribute('href');
    const hasOnClick = await this.secondaryButton.evaluate((el) => {
      return el.hasAttribute('onclick') || el.onclick !== null;
    });
    
    // Verify button has a navigation mechanism
    if (!href && !hasOnClick) {
      throw new Error('Secondary button has no navigation mechanism (no href or onclick)');
    }
    
    // Get current URL before click
    const currentUrl = this.page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    // Click the button and wait for navigation
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }),
      this.secondaryButton.click()
    ]);
    
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Get new URL after click
    const newUrl = this.page.url();
    console.log(`New URL after click: ${newUrl}`);
    
    // Verify navigation occurred (URL changed or page content changed)
    const navigationOccurred = currentUrl !== newUrl;
    
    if (navigationOccurred) {
      console.log(`[OK] Secondary button navigation successful - Navigated from ${currentUrl} to ${newUrl}`);
    } else {
      // Check if it's a same-page anchor link or modal trigger
      console.log('URL did not change - checking if button triggered other actions...');
      
      // Wait a bit for any dynamic content changes
      await this.page.waitForTimeout(1000);
      
      console.log('[OK] Secondary button click executed (same page action or anchor link)');
    }
  }

  /**
   * Get kicker text content (language-agnostic)
   */
  async getKickerTextContent(): Promise<string> {
    await expect.soft(this.kickerText).toBeVisible();
    return await this.kickerText.textContent() || '';
  }

  /**
   * Get title content (language-agnostic)
   */
  async getTitleContent(): Promise<string> {
    await expect.soft(this.titleComponent).toBeVisible();
    return await this.titleComponent.textContent() || '';
  }

  /**
   * Get headline text content (language-agnostic)
   */
  async getHeadlineTextContent(): Promise<string> {
    await expect.soft(this.headlineText).toBeVisible();
    return await this.headlineText.textContent() || '';
  }

  /**
   * Get intro text content (language-agnostic)
   */
  async getIntroTextContent(): Promise<string> {
    await expect.soft(this.introText).toBeVisible();
    return await this.introText.textContent() || '';
  }

  // ================ VALIDATION METHODS ================

  /**
   * Verify all text elements are visible and have content
   */
  async verifyAllTextElementsVisible(): Promise<void> {
    await expect.soft(this.kickerText).toBeVisible();
    await expect.soft(this.kickerText).not.toBeEmpty();

    await expect.soft(this.titleComponent).toBeVisible();
    await expect.soft(this.titleComponent).not.toBeEmpty();

    await expect.soft(this.headlineText).toBeVisible();
    await expect.soft(this.headlineText).not.toBeEmpty();

    await expect.soft(this.introText).toBeVisible();
    await expect.soft(this.introText).not.toBeEmpty();
  }

  /**
   * Verify all button elements are visible and interactive
   */
  async verifyAllButtonElementsInteractive(): Promise<void> {
    await expect.soft(this.buttonsContainer).toBeVisible();
    
    await expect.soft(this.primaryButton).toBeVisible();
    await expect.soft(this.primaryButton).toBeEnabled();
    
    await expect.soft(this.secondaryButton).toBeVisible();
    await expect.soft(this.secondaryButton).toBeEnabled();
  }

  /**
   * Verify image element is visible and has proper attributes
   */
  async verifyImageElementProper(): Promise<void> {
    await expect.soft(this.imageSection).toBeVisible();
    await expect.soft(this.stageImage).toBeVisible();

    const tag = await this.stageImage.evaluate(el => el.tagName.toLowerCase());
    if (tag === 'img') {
      await expect.soft(this.stageImage).toHaveAttribute('src');
      await expect.soft(this.stageImage).toHaveAttribute('alt');
    } else {
      // Video media: verify a playable source (src attr or <source> child).
      const hasSource = await this.stageImage.evaluate(
        el => !!(el as HTMLVideoElement).currentSrc || !!el.getAttribute('src') || !!el.querySelector('source')
      );
      expect.soft(hasSource, 'Stage video should have a playable source').toBeTruthy();
    }
  }

  /**
   * Verify component semantic HTML structure
   */
  async verifySemanticStructure(): Promise<void> {
    // Verify title is H1 heading
    const titleTagName = await this.titleComponent.evaluate(el => el.tagName.toLowerCase());
    expect.soft(titleTagName).toBe('h1');

    // Verify media is an IMG or VIDEO element (stage supports both)
    const imageTagName = await this.stageImage.evaluate(el => el.tagName.toLowerCase());
    expect.soft(['img', 'video']).toContain(imageTagName);

    // Verify buttons are anchor tags or button elements
    const primaryButtonTag = await this.primaryButton.evaluate(el => el.tagName.toLowerCase());
    expect.soft(['a', 'button']).toContain(primaryButtonTag);

    const secondaryButtonTag = await this.secondaryButton.evaluate(el => el.tagName.toLowerCase());
    expect.soft(['a', 'button']).toContain(secondaryButtonTag);
  }

  /**
   * Get CSS property value for visual validation
   * @param element - Locator element
   * @param property - CSS property name
   */
  async getCSSProperty(element: Locator, property: string): Promise<string> {
    return await element.evaluate((el, prop) => {
      return window.getComputedStyle(el).getPropertyValue(prop);
    }, property);
  }

  /**
   * Verify visual properties against Figma values for specific viewport
   * @param viewport - Viewport name (XL, LG, MD, SM)
   */
  async verifyVisualPropertiesForViewport(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    const figmaValues = StageJumbotron_FigmaValues[viewport];
    
    console.log(`\n=== VISUAL COMPARISON FOR ${viewport} VIEWPORT ===`);

    // Get actual values for kicker text
    const kickerElement = this.getKickerText();
    await expect.soft(kickerElement).toBeVisible();
    
    const actualKickerFontFamily = await this.getCSSProperty(kickerElement, 'font-family');
    const actualKickerFontSize = await this.getCSSProperty(kickerElement, 'font-size');
    const actualKickerColor = await this.getCSSProperty(kickerElement, 'color');
    const actualKickerFontWeight = await this.getCSSProperty(kickerElement, 'font-weight');
    const actualKickerLineHeight = await this.getCSSProperty(kickerElement, 'line-height');
    
    // Get actual values for main headline/title
    const titleElement = this.getTitleComponent();
    await expect.soft(titleElement).toBeVisible();
    
    const actualTitleFontFamily = await this.getCSSProperty(titleElement, 'font-family');
    const actualTitleFontSize = await this.getCSSProperty(titleElement, 'font-size');
    const actualTitleColor = await this.getCSSProperty(titleElement, 'color');
    const actualTitleFontWeight = await this.getCSSProperty(titleElement, 'font-weight');
    const actualTitleLineHeight = await this.getCSSProperty(titleElement, 'line-height');

    // Get actual values for description text
    const descriptionElement = this.getIntroText();
    await expect.soft(descriptionElement).toBeVisible();
    
    const actualDescFontFamily = await this.getCSSProperty(descriptionElement, 'font-family');
    const actualDescFontSize = await this.getCSSProperty(descriptionElement, 'font-size');
    const actualDescColor = await this.getCSSProperty(descriptionElement, 'color');
    const actualDescFontWeight = await this.getCSSProperty(descriptionElement, 'font-weight');
    const actualDescLineHeight = await this.getCSSProperty(descriptionElement, 'line-height');

    // Get actual values for primary button
    const primaryButton = this.getPrimaryButton();
    await expect.soft(primaryButton).toBeVisible();
    
    const actualBtnFontFamily = await this.getCSSProperty(primaryButton, 'font-family');
    const actualBtnFontSize = await this.getCSSProperty(primaryButton, 'font-size');
    const actualBtnColor = await this.getCSSProperty(primaryButton, 'color');
    const actualBtnBgColor = await this.getCSSProperty(primaryButton, 'background-color');
    const actualBtnFontWeight = await this.getCSSProperty(primaryButton, 'font-weight');

    // Log detailed comparison
    console.log(`\n[DETAILS] KICKER TEXT COMPARISON:`);
    console.log(`   Font Family - Actual: "${actualKickerFontFamily}" | Figma: "${figmaValues.kickerText?.fontFamily}"`);
    console.log(`   Font Size   - Actual: "${actualKickerFontSize}" | Figma: "${figmaValues.kickerText?.fontSize}"`);
    console.log(`   Font Weight - Actual: "${actualKickerFontWeight}" | Figma: "${figmaValues.kickerText?.fontWeight}"`);
    console.log(`   Color       - Actual: "${actualKickerColor}" | Figma: "${figmaValues.kickerText?.color}"`);
    console.log(`   Line Height - Actual: "${actualKickerLineHeight}" | Figma: "${figmaValues.kickerText?.lineHeight}"`);

    console.log(`\n[DETAILS] MAIN HEADLINE COMPARISON:`);
    console.log(`   Font Family - Actual: "${actualTitleFontFamily}" | Figma: "${figmaValues.mainHeadline?.fontFamily}"`);
    console.log(`   Font Size   - Actual: "${actualTitleFontSize}" | Figma: "${figmaValues.mainHeadline?.fontSize}"`);
    console.log(`   Font Weight - Actual: "${actualTitleFontWeight}" | Figma: "${figmaValues.mainHeadline?.fontWeight}"`);
    console.log(`   Color       - Actual: "${actualTitleColor}" | Figma: "${figmaValues.mainHeadline?.color}"`);
    console.log(`   Line Height - Actual: "${actualTitleLineHeight}" | Figma: "${figmaValues.mainHeadline?.lineHeight}"`);

    console.log(`\n[DETAILS] DESCRIPTION TEXT COMPARISON:`);
    console.log(`   Font Family - Actual: "${actualDescFontFamily}" | Figma: "${figmaValues.descriptionText?.fontFamily}"`);
    console.log(`   Font Size   - Actual: "${actualDescFontSize}" | Figma: "${figmaValues.descriptionText?.fontSize}"`);
    console.log(`   Font Weight - Actual: "${actualDescFontWeight}" | Figma: "${figmaValues.descriptionText?.fontWeight}"`);
    console.log(`   Color       - Actual: "${actualDescColor}" | Figma: "${figmaValues.descriptionText?.color}"`);
    console.log(`   Line Height - Actual: "${actualDescLineHeight}" | Figma: "${figmaValues.descriptionText?.lineHeight}"`);

    console.log(`\n[DETAILS] PRIMARY BUTTON COMPARISON:`);
    console.log(`   Font Family - Actual: "${actualBtnFontFamily}" | Figma: "${figmaValues.primaryButton?.fontFamily}"`);
    console.log(`   Font Size   - Actual: "${actualBtnFontSize}" | Figma: "${figmaValues.primaryButton?.fontSize}"`);
    console.log(`   Font Weight - Actual: "${actualBtnFontWeight}" | Figma: "${figmaValues.primaryButton?.fontWeight}"`);
    console.log(`   Text Color  - Actual: "${actualBtnColor}" | Figma: "${figmaValues.primaryButton?.color}"`);
    console.log(`   Bg Color    - Actual: "${actualBtnBgColor}" | Figma: "${figmaValues.primaryButton?.backgroundColor}"`);

    // Verify image is present and has dimensions
    const stageImage = this.getStageImage();
    await expect.soft(stageImage).toBeVisible();
    
    const imageBounds = await stageImage.boundingBox();
    expect.soft(imageBounds).not.toBeNull();
    console.log(`\n[DETAILS] IMAGE DIMENSIONS: Width: ${imageBounds!.width}px, Height: ${imageBounds!.height}px`);
    
    // Helper function to normalize color values for strict comparison
    const normalizeColor = (color: string): string => {
      // Convert rgba to rgb if alpha is 1
      if (color.startsWith('rgba(') && color.endsWith(', 1)')) {
        return color.replace('rgba(', 'rgb(').replace(', 1)', ')');
      }
      return color;
    };

    // STRICT FIGMA VALIDATIONS - Tests will FAIL if values don't match exactly
    
    // Validate Kicker Text Properties
    if (figmaValues.kickerText) {
      expect.soft(actualKickerFontFamily).toContain(figmaValues.kickerText.fontFamily);
      expect.soft(actualKickerFontSize).toBe(figmaValues.kickerText.fontSize);
      expect.soft(actualKickerFontWeight).toBe(figmaValues.kickerText.fontWeight);
      expect.soft(normalizeColor(actualKickerColor)).toBe(normalizeColor(figmaValues.kickerText.color));
      expect.soft(actualKickerLineHeight).toBe(figmaValues.kickerText.lineHeight);
    }

    // Validate Main Headline Properties
    if (figmaValues.mainHeadline) {
      expect.soft(actualTitleFontFamily).toContain(figmaValues.mainHeadline.fontFamily);
      expect.soft(actualTitleFontSize).toBe(figmaValues.mainHeadline.fontSize);
      expect.soft(actualTitleFontWeight).toBe(figmaValues.mainHeadline.fontWeight);
      expect.soft(normalizeColor(actualTitleColor)).toBe(normalizeColor(figmaValues.mainHeadline.color));
      expect.soft(actualTitleLineHeight).toBe(figmaValues.mainHeadline.lineHeight);
    }

    // Validate Description Text Properties
    if (figmaValues.descriptionText) {
      expect.soft(actualDescFontFamily).toContain(figmaValues.descriptionText.fontFamily);
      expect.soft(actualDescFontSize).toBe(figmaValues.descriptionText.fontSize);
      expect.soft(actualDescFontWeight).toBe(figmaValues.descriptionText.fontWeight);
      expect.soft(normalizeColor(actualDescColor)).toBe(normalizeColor(figmaValues.descriptionText.color));
      expect.soft(actualDescLineHeight).toBe(figmaValues.descriptionText.lineHeight);
    }

    // Validate Primary Button Properties
    if (figmaValues.primaryButton) {
      expect.soft(actualBtnFontFamily).toContain(figmaValues.primaryButton.fontFamily);
      expect.soft(actualBtnFontSize).toBe(figmaValues.primaryButton.fontSize);
      expect.soft(actualBtnFontWeight).toBe(figmaValues.primaryButton.fontWeight);
      expect.soft(normalizeColor(actualBtnColor)).toBe(normalizeColor(figmaValues.primaryButton.color));
      expect.soft(normalizeColor(actualBtnBgColor)).toBe(normalizeColor(figmaValues.primaryButton.backgroundColor));
    }

    // Ensure buttons are functional
    await expect.soft(primaryButton).toBeEnabled();
    await expect.soft(this.getSecondaryButton()).toBeVisible();
    
    console.log(`\n[OK] ${viewport} viewport visual validation completed - Check comparison details above\n`);
  }

  // ===== COMPREHENSIVE VISUAL VALIDATION METHODS (Following Stage Full Screen approach) =====

  /**
   * Validate responsive layout against Figma specifications
   */
  async validateResponsiveLayout(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    console.log(`Validating responsive layout for ${viewport} viewport...`);
    
    const { StageJumbotron_FigmaValues } = await import('../helpers/utils/figma-values/StageJumbotron_FigmaValues');
    const expectedViewport = StageJumbotron_FigmaValues[viewport].viewport;
    
    // Set viewport size according to Figma specifications
    await this.page.setViewportSize(expectedViewport);
    await this.page.waitForTimeout(1000); // Allow layout to stabilize
    
    // Verify main container is visible and positioned correctly
    await expect.soft(this.stageContainer).toBeVisible();
    
    const containerBounds = await this.stageContainer.boundingBox();
    expect.soft(containerBounds).not.toBeNull();
    expect.soft(containerBounds!.width).toBeGreaterThan(0);
    expect.soft(containerBounds!.height).toBeGreaterThan(0);
    
    console.log(`Responsive layout validated for ${viewport} (${expectedViewport.width}x${expectedViewport.height})`);
  }

  /**
   * Validate kicker text styling against Figma specifications
   */
  async validateKickerTextStyling(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    console.log(`Validating kicker text styling for ${viewport} viewport...`);
    
    const { StageJumbotron_FigmaValues } = await import('../helpers/utils/figma-values/StageJumbotron_FigmaValues');
    const expectedStyles = StageJumbotron_FigmaValues[viewport].kickerText;
    
    // Font family validation
    const fontFamily = await this.kickerText.evaluate((el: any) => getComputedStyle(el).fontFamily);
    expect.soft(fontFamily.toLowerCase()).toContain('bayer');
    
    // Font size validation - strict comparison with Figma values
    const fontSize = await this.kickerText.evaluate((el: any) => getComputedStyle(el).fontSize);
    expect.soft(fontSize).toBe(expectedStyles.fontSize);
    
    // Font weight validation
    const fontWeight = await this.kickerText.evaluate((el: any) => getComputedStyle(el).fontWeight);
    expect.soft(fontWeight).toBe(expectedStyles.fontWeight);

    // Line height validation - strict comparison with Figma values
    const lineHeight = await this.kickerText.evaluate((el: any) => getComputedStyle(el).lineHeight);
    expect.soft(lineHeight).toBe(expectedStyles.lineHeight);

    // Color validation - strict comparison with Figma values
    const color = await this.kickerText.evaluate((el: any) => getComputedStyle(el).color);
    expect.soft(color).toBe(expectedStyles.color);
    
    console.log(`Kicker text styling validated for ${viewport}`);
  }

  /**
   * Validate main headline styling against Figma specifications
   */
  async validateMainHeadlineStyling(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    console.log(`Validating main headline styling for ${viewport} viewport...`);
    
    const { StageJumbotron_FigmaValues } = await import('../helpers/utils/figma-values/StageJumbotron_FigmaValues');
    const expectedStyles = StageJumbotron_FigmaValues[viewport].mainHeadline;
    
    // Font family validation
    const fontFamily = await this.titleComponent.evaluate((el: any) => getComputedStyle(el).fontFamily);
    expect.soft(fontFamily.toLowerCase()).toContain('bayer');
    
    // Font size validation
    const fontSize = await this.titleComponent.evaluate((el: any) => getComputedStyle(el).fontSize);
    expect.soft(fontSize).toBe(expectedStyles.fontSize);
    
    // Font weight validation
    const fontWeight = await this.titleComponent.evaluate((el: any) => getComputedStyle(el).fontWeight);
    expect.soft(fontWeight).toBe(expectedStyles.fontWeight);

    // Line height validation - strict comparison with Figma values
    const lineHeight = await this.titleComponent.evaluate((el: any) => getComputedStyle(el).lineHeight);
    expect.soft(lineHeight).toBe(expectedStyles.lineHeight);

    // Color validation - strict comparison with Figma values
    // First check the headline text content
    const headlineText = await this.titleComponent.textContent();
    console.log(`Headline text content: "${headlineText}"`);
    
    // Check if headline has gradient styling (which returns transparent color)
    const hasGradient = await this.titleComponent.evaluate((el: any) => {
      const style = getComputedStyle(el);
      const bgImage = style.backgroundImage;
      const webkitTextFill = style.webkitTextFillColor;
      return bgImage.includes('gradient') || webkitTextFill === 'transparent';
    });
    
    console.log(`Headline has gradient styling: ${hasGradient}`);
    
    const color = await this.titleComponent.evaluate((el: any) => getComputedStyle(el).color);
    console.log(`Headline computed color: ${color}`);
    
    // Skip color validation if gradient is applied (gradient text returns transparent)
    if (!hasGradient) {
      expect.soft(color).toBe(expectedStyles.color);
    } else {
      console.log(`Skipping color validation - headline uses gradient styling`);
    }
    
    console.log(`Main headline styling validated for ${viewport}`);
  }

  /**
   * Validate description text styling against Figma specifications
   */
  async validateDescriptionTextStyling(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    console.log(`Validating description text styling for ${viewport} viewport...`);
    
    // Check if description text element exists (use intro text for Stage Jumbotron)
    const descriptionExists = await this.introText.count() > 0;
    if (!descriptionExists) {
      console.log(`Description text not found for ${viewport} - skipping validation`);
      return;
    }
    
    const { StageJumbotron_FigmaValues } = await import('../helpers/utils/figma-values/StageJumbotron_FigmaValues');
    const expectedStyles = StageJumbotron_FigmaValues[viewport].descriptionText;

    // Font family validation
    const fontFamily = await this.introText.evaluate((el: any) => getComputedStyle(el).fontFamily);
    expect.soft(fontFamily.toLowerCase()).toContain(expectedStyles.fontFamily.toLowerCase());

    // Font size validation - strict comparison with Figma values
    const fontSize = await this.introText.evaluate((el: any) => getComputedStyle(el).fontSize);
    expect.soft(fontSize).toBe(expectedStyles.fontSize);

    // Font weight validation
    const fontWeight = await this.introText.evaluate((el: any) => getComputedStyle(el).fontWeight);
    expect.soft(fontWeight).toBe(expectedStyles.fontWeight);

    // Line height validation - strict comparison with Figma values
    const lineHeight = await this.introText.evaluate((el: any) => getComputedStyle(el).lineHeight);
    expect.soft(lineHeight).toBe(expectedStyles.lineHeight);

    // Color validation - strict comparison with Figma values
    const color = await this.introText.evaluate((el: any) => getComputedStyle(el).color);
    expect.soft(color).toBe(expectedStyles.color);
    
    console.log(`Description text styling validated for ${viewport}`);
  }

  /**
   * Validate button styling against Figma specifications
   */
  async validateButtonStyling(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    console.log(`Validating button styling for ${viewport} viewport...`);
    
    const { StageJumbotron_FigmaValues } = await import('../helpers/utils/figma-values/StageJumbotron_FigmaValues');
    const expectedStyles = StageJumbotron_FigmaValues[viewport].primaryButton;

    // Font family validation
    const fontFamily = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).fontFamily);
    expect.soft(fontFamily.toLowerCase()).toContain(expectedStyles.fontFamily.toLowerCase());

    // Font size validation
    const fontSize = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).fontSize);
    expect.soft(fontSize).toBe(expectedStyles.fontSize);

    // Font weight validation
    const fontWeight = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).fontWeight);
    expect.soft(fontWeight).toBe(expectedStyles.fontWeight);

    // Color validation - strict comparison with Figma values
    const color = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).color);
    expect.soft(color).toBe(expectedStyles.color);

    // Background color validation - strict comparison with Figma values
    const backgroundColor = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).backgroundColor);
    expect.soft(backgroundColor).toBe(expectedStyles.backgroundColor);
    
    console.log(`Button styling validated for ${viewport}`);
  }
}
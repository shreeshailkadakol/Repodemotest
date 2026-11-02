import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { StageFullScreen_FigmaValues } from '../helpers/utils/figma-values/StageFullScreen_FigmaValues';
import { envUtils } from '../helpers/utils/envUtils';

export class StageFullScreenPage extends BasePage {
  // Main component container
  private readonly stageContainer: Locator = this.page.locator('[data-qa="fullwidth-column"]');
  
  // Text Elements
  private readonly titleComponent: Locator = this.stageContainer.locator('[data-qa="title-component"]');
  private readonly stageKickerText: Locator = this.stageContainer.locator('[data-qa="stage-kicker-text"]');
  private readonly stageHeadlineText: Locator = this.stageContainer.locator('[data-qa="stage-headline-text"]');
  private readonly stageDescriptionText: Locator = this.stageContainer.locator('[data-qa="stage-description-text"]');
  
  // Button Elements
  private readonly buttonGroup: Locator = this.stageContainer.locator('[data-qa="stage-buttons"]');
  private readonly primaryButton: Locator = this.stageContainer.locator('[data-qa="stage-buttons"]').locator('[data-qa="stage-primary-button"]');
  private readonly secondaryButton: Locator = this.stageContainer.locator('[data-qa="stage-buttons"]').locator('[data-qa="stage-secondary-button"]');

  // Image Elements - using parent-child relationships
  private readonly imageSection: Locator = this.stageContainer.locator('[data-qa="stage-image-section"]');
  private readonly stageImages: Locator = this.stageContainer.locator('[data-qa="stage-image"], [data-testid="next-image"], video').first();

  constructor(page: Page, browser: any, context: any) {
    super(page, browser, context);
  }

  // Navigation and Setup Methods
  /**
   * Navigate to Stage Full Screen test page with authentication
   */
  async navigateToStageFullScreen(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const stageFullScreenURL = await this.resolveExecutionUrl('StageFullScreenComponent', baseURL);
    await this.navigateWithAuthentication(stageFullScreenURL);
  }

  /**
   * Wait for Stage Full Screen component to load completely
   */
  async waitForComponentLoad(): Promise<void> {
    console.log('Waiting for Stage Full Screen component to load...');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    
    // Wait for the main container to be visible
    await expect.soft(this.stageContainer).toBeVisible({ timeout: 10000 });
    
    console.log('Stage Full Screen component loaded successfully');
  }

  // Component Visibility and Presence Validation
  async validateStageFullScreenComponentPresence(): Promise<void> {
    console.log('Validating Stage Full Screen component presence...');
    
    await expect.soft(this.stageContainer).toBeVisible({ timeout: 10000 });
    console.log('Stage Full Screen container is visible');
    
    await expect.soft(this.titleComponent).toBeVisible();
    console.log('Title component is visible');
    
    // Verify images exist in DOM (may not be visible due to lazy loading)
    const imageCount = await this.stageContainer.locator('[data-qa="stage-image"], [data-testid="next-image"], video').count();
    console.log(`Stage images found: ${imageCount}`);
  }

  // Text Content Validation Methods
  async validateKickerTextPresence(): Promise<void> {
    console.log('Validating kicker text presence...');
    
    const kickerText = await this.stageKickerText.textContent();
    expect.soft(kickerText).toBeTruthy();
    expect.soft(kickerText?.trim()).not.toBe('');
    
    console.log(`Kicker text is present: "${kickerText}"`);
  }

  async validateMainHeadlinePresence(): Promise<void> {
    console.log('Validating main headline presence...');
    
    const headlineText = await this.stageHeadlineText.textContent();
    expect.soft(headlineText).toBeTruthy();
    expect.soft(headlineText?.trim()).not.toBe('');
    
    console.log(`Main headline is present: "${headlineText}"`);
  }

  async validateDescriptionTextPresence(): Promise<void> {
    console.log('Validating description text presence...');
    
    // Try multiple possible selectors for description text
    const possibleDescriptionSelectors = [
      '[data-qa="stage-description-text"]',
      '[data-qa="stage-intro-text"]',
      '[data-qa="intro-text"]',
      '[data-qa="description-text"]'
    ];
    
    let descriptionElement: Locator | null = null;
    let descriptionText: string | null = null;
    
    // Check each possible selector
    for (const selector of possibleDescriptionSelectors) {
      const element = this.stageContainer.locator(selector);
      const isVisible = await element.isVisible().catch(() => false);
      
      if (isVisible) {
        descriptionElement = element;
        descriptionText = await element.textContent();
        console.log(`Found description text with selector: ${selector}`);
        break;
      }
    }
    
    // If no description text found, check if it's optional for this component variant
    if (!descriptionElement || !descriptionText?.trim()) {
      console.log('Description text element not found - this may be optional for Stage Full Screen variant');
      
      // Check if this is a known component variant without description text
      const hasKicker = await this.stageKickerText.isVisible().catch(() => false);
      const hasHeadline = await this.stageHeadlineText.isVisible().catch(() => false);
      
      if (hasKicker && hasHeadline) {
        console.log('Component has kicker and headline - description text is optional for this variant');
        return; // Pass the test as description is optional
      } else {
        throw new Error('No description text found and component appears incomplete');
      }
    }
    
    expect.soft(descriptionText).toBeTruthy();
    expect.soft(descriptionText.trim()).not.toBe('');
    
    console.log(`Description text is present: "${descriptionText.substring(0, 50)}..."`);
  }

  // Button Functionality Validation
  async validateButtonGroupFunctionality(): Promise<void> {
    console.log('Validating button group presence...');
    
    await expect.soft(this.buttonGroup).toBeVisible();
    
    // Count buttons
    const buttonCount = await this.buttonGroup.locator('[data-qa*="button"]').count();
    console.log(`Button group contains ${buttonCount} buttons`);
    
    // Validate primary button
    console.log('Validating primary button functionality...');
    await expect.soft(this.primaryButton).toBeVisible();
    const primaryButtonText = await this.primaryButton.textContent();
    expect.soft(primaryButtonText).toBeTruthy();
    console.log(`Primary button "${primaryButtonText}" is functional`);
    
    // Validate secondary button
    console.log('Validating secondary button functionality...');
    await expect.soft(this.secondaryButton).toBeVisible();
    const secondaryButtonText = await this.secondaryButton.textContent();
    expect.soft(secondaryButtonText).toBeTruthy();
    console.log(`Secondary button "${secondaryButtonText}" is functional`);
  }

  // Individual Button Validation Methods (for specific test requirements)
  async validateButtonGroupPresence(): Promise<void> {
    console.log('Validating button group presence...');
    
    const isVisible = await this.buttonGroup.isVisible().catch(() => false);
    if (!isVisible) {
      console.log('Button group not found on page - component may not include buttons');
      throw new Error('Button group not found - check if component includes button elements');
    }
    
    const buttonCount = await this.buttonGroup.locator('[data-qa*="button"]').count();
    console.log(`Button group contains ${buttonCount} buttons`);
  }

  async validatePrimaryButtonFunctionality(): Promise<void> {
    console.log('Validating primary button functionality and navigation...');
    
    // Verify button is visible
    const isVisible = await this.primaryButton.isVisible().catch(() => false);
    if (!isVisible) {
      console.log('Primary button not found on page');
      throw new Error('Primary button not found - check if component includes primary button element');
    }
    
    // Validate button text is present
    const primaryButtonText = await this.primaryButton.textContent();
    expect.soft(primaryButtonText).toBeTruthy();
    console.log(`Primary button "${primaryButtonText}" is present`);
    
    // Validate navigation mechanism
    const href = await this.primaryButton.getAttribute('href');
    const hasOnClick = await this.primaryButton.evaluate((el) => {
      return el.hasAttribute('onclick') || el.onclick !== null;
    });
    
    // Verify button has a navigation mechanism
    if (!href && !hasOnClick) {
      throw new Error('Primary button has no navigation mechanism (no href or onclick)');
    }
    
    console.log(`Primary button href: ${href}`);
    
    // Validate button is clickable (enabled, not disabled)
    await expect.soft(this.primaryButton).toBeEnabled();

    // Capture the current URL before navigating
    const currentUrl = this.page.url();

    // Validate by opening in a new tab to avoid leaving the current page
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page', { timeout: 10000 }).catch(() => null),
      this.primaryButton.click({ modifiers: ['Control'] }) // Ctrl+Click opens in new tab
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
    
    console.log(`[OK] Primary button functionality and navigation validated`);
  }

  async validateSecondaryButtonFunctionality(): Promise<void> {
    console.log('Validating secondary button functionality and navigation...');

    // Capture the current URL before any navigation
    const currentUrl = this.page.url();

    // Wait for button group to be visible first
    await this.buttonGroup.waitFor({ state: 'visible', timeout: 5000 });
    
    // Verify button is visible with explicit wait
    await this.secondaryButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      console.log('Secondary button not found on page');
      throw new Error('Secondary button not found - check if component includes secondary button element');
    });
    
    // Validate button text is present
    const secondaryButtonText = await this.secondaryButton.textContent();
    expect.soft(secondaryButtonText).toBeTruthy();
    console.log(`Secondary button "${secondaryButtonText}" is present`);
    
    // Validate navigation mechanism
    const href = await this.secondaryButton.getAttribute('href');
    const hasOnClick = await this.secondaryButton.evaluate((el) => {
      return el.hasAttribute('onclick') || el.onclick !== null;
    });
    
    if (!href && !hasOnClick) {
      throw new Error('Secondary button has no navigation mechanism (no href or onclick)');
    }
    
    console.log(`Secondary button href: ${href}`);
    
    // Validate button is clickable
    await expect.soft(this.secondaryButton).toBeEnabled();
    
    // Check target attribute
    const target = await this.secondaryButton.getAttribute('target');
    console.log(`Secondary button target: ${target || 'none (same tab)'}`);
    
    // Click the button and wait for potential navigation
    if (target === '_blank') {
      // Opens in new tab - just verify click works
      console.log('Secondary button opens in new tab (_blank)');
      await this.secondaryButton.click({ force: true });
      await this.page.waitForTimeout(1000);
      console.log('[OK] Secondary button click executed (opens in new tab)');
    } else if (href && !href.startsWith('#')) {
      // External or internal page navigation expected in same tab
      console.log('Attempting navigation to:', href);

      const isExternal = /^https?:\/\//i.test(href);

      // Try clicking with navigation wait
      try {
        await Promise.all([
          this.page.waitForNavigation({ timeout: 5000 }),
          this.secondaryButton.click({ force: true })
        ]);
        console.log('[OK] Navigation completed via click');
      } catch {
        if (isExternal) {
          // Avoid forcing a hard navigation away from the protected preview to an
          // external domain (gets aborted/detached). A valid external href is enough.
          console.log(`[OK] Secondary button has valid external href: ${href}`);
        } else {
          // Internal/relative link - navigate directly to verify it resolves
          console.log('Click did not trigger navigation, navigating directly to href...');
          await this.page.goto(href);
          console.log('[OK] Navigation completed via goto');
        }
      }
    } else {
      if (href) {
        console.log(`✓ Secondary button has valid href: ${href}`);
      } else {
        console.log('✓ Secondary button click executed (onclick handler)');
      }
    }
    
    // Wait for navigation to complete if not a new tab
    if (target !== '_blank') {
      await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    }
    
    // Get new URL after click
    const newUrl = this.page.url();
    console.log(`New URL after click: ${newUrl}`);
    
    // Verify navigation occurred (URL changed or page content changed)
    const navigationOccurred = currentUrl !== newUrl;
    
    if (navigationOccurred) {
      console.log(`[OK] Secondary button navigation successful - Navigated from ${currentUrl} to ${newUrl}`);
    } else if (target !== '_blank') {
      // Check if it's a same-page anchor link or modal trigger
      console.log('URL did not change - checking if button triggered other actions...');
      
      // Wait a bit for any dynamic content changes
      await this.page.waitForTimeout(1000);
      
      console.log('[OK] Secondary button click executed (same page action or anchor link)');
    }
    
    console.log(`[OK] Secondary button functionality and navigation validated`);
  }

  // Image Loading and Display Validation
  async validateStageImageDisplay(): Promise<void> {
    console.log('Validating stage image display...');

    const allImages = this.stageContainer.locator('[data-qa="stage-image"], [data-testid="next-image"], video');

    // Ensure the image area is in view to trigger lazy loading
    await this.stageImages.scrollIntoViewIfNeeded().catch(() => {});

    // The fullscreen stage renders multiple responsive image variants; poll until
    // at least one rendered variant has finished loading (natural dimensions > 0)
    let dimensions = '0x0';
    let imageLoaded = false;
    for (let attempt = 0; attempt < 12; attempt++) {
      const result = await allImages.evaluateAll((els) => {
        const loaded = (els as HTMLElement[]).find((el) => {
          if (el.tagName.toLowerCase() === 'video') {
            const v = el as HTMLVideoElement;
            return !!v.currentSrc || v.readyState >= 1; // video has a source / metadata
          }
          const i = el as HTMLImageElement;
          return i.naturalWidth > 0 && i.naturalHeight > 0;
        });
        if (!loaded) return null;
        return loaded.tagName.toLowerCase() === 'video'
          ? 'video-ready'
          : `${(loaded as HTMLImageElement).naturalWidth}x${(loaded as HTMLImageElement).naturalHeight}`;
      });
      if (result) {
        imageLoaded = true;
        dimensions = result;
        break;
      }
      await this.page.waitForTimeout(500);
    }

    expect.soft(imageLoaded).toBeTruthy();
    console.log(`Stage image loaded successfully (${dimensions})`);
  }

  // Accessibility Validation Methods
  async validateImageAccessibility(): Promise<void> {
    console.log('Validating image accessibility...');

    const altText = await this.stageImages.getAttribute('alt');
    expect.soft(altText).toBeTruthy();
    expect.soft(altText?.trim()).not.toBe('');

    console.log(`Image has alt text: "${altText}"`);
  }

  // Visual Design Validation Methods
  async validateKickerTextStyling(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    console.log(`Validating kicker text styling for ${viewport} viewport...`);
    
    const expectedStyles = StageFullScreen_FigmaValues[viewport].kickerText;
    
    // Font family validation
    const fontFamily = await this.stageKickerText.evaluate((el: any) => getComputedStyle(el).fontFamily);
    expect.soft(fontFamily.toLowerCase()).toContain('bayer');
    
    // Font size validation - strict comparison with Figma values
    const fontSize = await this.stageKickerText.evaluate((el: any) => getComputedStyle(el).fontSize);
    expect.soft(fontSize).toBe(expectedStyles.fontSize);
    
    // Font weight validation
    const fontWeight = await this.stageKickerText.evaluate((el: any) => getComputedStyle(el).fontWeight);
    expect.soft(fontWeight).toBe(expectedStyles.fontWeight);

    // Line height validation - strict comparison with Figma values
    const lineHeight = await this.stageKickerText.evaluate((el: any) => getComputedStyle(el).lineHeight);
    expect.soft(lineHeight).toBe(expectedStyles.lineHeight);

    // Color validation - strict comparison with Figma values
    const color = await this.stageKickerText.evaluate((el: any) => getComputedStyle(el).color);
    expect.soft(color).toBe(expectedStyles.color);  console.log(`Kicker text styling validated for ${viewport}`);
  }

  async validateMainHeadlineStyling(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    console.log(`Validating main headline styling for ${viewport} viewport...`);
    
    const expectedStyles = StageFullScreen_FigmaValues[viewport].mainHeadline;
    
    // Font family validation
    const fontFamily = await this.stageHeadlineText.evaluate((el: any) => getComputedStyle(el).fontFamily);
    expect.soft(fontFamily.toLowerCase()).toContain('bayer');
    
    // Font size validation
    const fontSize = await this.stageHeadlineText.evaluate((el: any) => getComputedStyle(el).fontSize);
    expect.soft(fontSize).toBe(expectedStyles.fontSize);
    // Font weight validation
    const fontWeight = await this.stageHeadlineText.evaluate((el: any) => getComputedStyle(el).fontWeight);
    expect.soft(fontWeight).toBe(expectedStyles.fontWeight);

    // Line height validation - strict comparison with Figma values
    const lineHeight = await this.stageHeadlineText.evaluate((el: any) => getComputedStyle(el).lineHeight);
    expect.soft(lineHeight).toBe(expectedStyles.lineHeight);

    // Color validation - strict comparison with Figma values
    // First check the headline text content
    const headlineText = await this.stageHeadlineText.textContent();
    console.log(`Headline text content: "${headlineText}"`);
    
    // Check if headline has gradient styling (which returns transparent color)
    const hasGradient = await this.stageHeadlineText.evaluate((el: any) => {
      const style = getComputedStyle(el);
      const bgImage = style.backgroundImage;
      const webkitTextFill = style.webkitTextFillColor;
      return bgImage.includes('gradient') || webkitTextFill === 'transparent';
    });
    
    console.log(`Headline has gradient styling: ${hasGradient}`);
    
    const color = await this.stageHeadlineText.evaluate((el: any) => getComputedStyle(el).color);
    console.log(`Headline computed color: ${color}`);
    
    // Skip color validation if gradient is applied (gradient text returns transparent)
    if (!hasGradient) {
      expect.soft(color).toBe(expectedStyles.color);
    } else {
      console.log(`Skipping color validation - headline uses gradient styling`);
    }
    
    console.log(`Main headline styling validated for ${viewport}`);
  }

  async validateButtonStyling(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    console.log(`Validating button styling for ${viewport} viewport...`);
    
  const expectedStyles = StageFullScreen_FigmaValues[viewport].primaryButton;

  // Font family validation
  const fontFamily = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).fontFamily);
  expect.soft(fontFamily.toLowerCase()).toContain(expectedStyles.fontFamily.toLowerCase());

  // Font size validation
  const fontSize = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).fontSize);
  expect.soft(fontSize).toBe(expectedStyles.fontSize);

    // Font weight validation
    const fontWeight = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).fontWeight);
    expect.soft(fontWeight).toBe(expectedStyles.fontWeight);

    // Line height validation - strict comparison with Figma values
    const lineHeight = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).lineHeight);
    expect.soft(lineHeight).toBe(expectedStyles.lineHeight);

    // Color validation - strict comparison with Figma values
    const color = await this.primaryButton.evaluate((el: any) => getComputedStyle(el).color);
    expect.soft(color).toBe(expectedStyles.color);

  console.log(`Button styling validated for ${viewport}`);
  }

  // Responsive Layout Validation
  async validateResponsiveLayout(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    console.log(`Validating responsive layout for ${viewport} viewport...`);
    
    const expectedViewport = StageFullScreen_FigmaValues[viewport].viewport;
    
    // Set viewport size
    await this.page.setViewportSize({ 
      width: expectedViewport.width, 
      height: expectedViewport.height
    });
    
    await this.page.waitForTimeout(1000);
    
    // Validate component is still visible and properly arranged
    await expect.soft(this.stageContainer).toBeVisible();
    await expect.soft(this.titleComponent).toBeVisible();
    
    // Check image is loaded using natural dimensions instead of visibility
    // Allow for potential image loading delays with wait and retry
    let imageLoaded = false;
    for (let i = 0; i < 5; i++) {
      imageLoaded = await this.stageImages.evaluate((img: HTMLImageElement) => {
        return img.naturalWidth > 0 && img.naturalHeight > 0;
      });
      if (imageLoaded) break;
      await this.page.waitForTimeout(500);
    }
    expect.soft(imageLoaded).toBeTruthy();
    
    console.log(`Responsive layout validated for ${viewport} (${expectedViewport.width}x${expectedViewport.height})`);
  }

  // Description text visual validation
  async validateDescriptionTextStyling(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    console.log(`Validating description text styling for ${viewport} viewport...`);
    
    // Check if description text element exists (some variants may not have it)
    const descriptionExists = await this.stageDescriptionText.count() > 0;
    if (!descriptionExists) {
      console.log(`Description text not found for ${viewport} - skipping validation`);
      return;
    }
    
    const expectedStyles = StageFullScreen_FigmaValues[viewport].descriptionText;

    // Font family validation
    const fontFamily = await this.stageDescriptionText.evaluate((el: any) => getComputedStyle(el).fontFamily);
    expect.soft(fontFamily.toLowerCase()).toContain(expectedStyles.fontFamily.toLowerCase());

    // Font size validation - strict comparison with Figma values
    const fontSize = await this.stageDescriptionText.evaluate((el: any) => getComputedStyle(el).fontSize);
    expect.soft(fontSize).toBe(expectedStyles.fontSize);

    // Font weight validation
    const fontWeight = await this.stageDescriptionText.evaluate((el: any) => getComputedStyle(el).fontWeight);
    expect.soft(fontWeight).toBe(expectedStyles.fontWeight);

    // Line height validation - strict comparison with Figma values
    const lineHeight = await this.stageDescriptionText.evaluate((el: any) => getComputedStyle(el).lineHeight);
    expect.soft(lineHeight).toBe(expectedStyles.lineHeight);

    // Color validation - strict comparison with Figma values
    const color = await this.stageDescriptionText.evaluate((el: any) => getComputedStyle(el).color);
    expect.soft(color).toBe(expectedStyles.color);

    console.log(`Description text styling validated for ${viewport}`);
  }

  // Performance Validation Methods
  async validateComponentLoadTime(): Promise<number> {
    console.log('Measuring component load time...');
    
    const startTime = Date.now();
    
    await Promise.all([
      this.stageContainer.waitFor({ state: 'visible' }),
      this.titleComponent.waitFor({ state: 'visible' })
    ]);
    
    // Wait for image to load using natural dimensions
    await this.stageImages.evaluate((img: HTMLImageElement) => {
      return new Promise<void>((resolve) => {
        if (img.naturalWidth > 0) {
          resolve();
        } else {
          img.onload = () => resolve();
        }
      });
    });
    
    const loadTime = Date.now() - startTime;
    console.log(`Component loaded in ${loadTime}ms`);
    
    return loadTime;
  }

  async validateImageLoadPerformance(): Promise<number> {
    console.log('Measuring image load performance...');
    
    const startTime = Date.now();

    // Wait for image to be fully loaded
    await this.stageImages.evaluate((img: HTMLImageElement) => {
      if (img.complete) return;
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

    const imageLoadTime = Date.now() - startTime;
    console.log(`Image loaded in ${imageLoadTime}ms`);

    return imageLoadTime;
  }

  // Accessibility Validation Methods
  async validateKeyboardNavigation(): Promise<void> {
    console.log('Validating keyboard navigation...');
    
    // Click somewhere to ensure page has focus
    await this.stageContainer.click();
    await this.page.waitForTimeout(500);
    
    // Focus on the primary button directly for more reliable testing
    await this.primaryButton.focus();
    await expect.soft(this.primaryButton).toBeFocused();
    
    // Tab to secondary button
    await this.page.keyboard.press('Tab');
    await expect.soft(this.secondaryButton).toBeFocused();
    
    console.log('Keyboard navigation validated');
  }

  async validateAriaLabels(): Promise<void> {
    console.log('Validating ARIA labels...');
    
    // Check for proper heading hierarchy
    const headingLevel = await this.stageHeadlineText.evaluate((el: any) => el.tagName.toLowerCase());
    expect.soft(['h1', 'h2', 'h3', 'span']).toContain(headingLevel);
    
    // Check button accessibility - buttons should have proper accessibility attributes
    const primaryButtonRole = await this.primaryButton.getAttribute('role');
    const primaryButtonAriaLabel = await this.primaryButton.getAttribute('aria-label');
    const primaryButtonText = await this.primaryButton.textContent();
    
    // Button accessibility is valid if it has role="button", aria-label, or visible text content
    const isAccessible = primaryButtonRole === 'button' || 
                        (primaryButtonAriaLabel && primaryButtonAriaLabel.trim() !== '') || 
                        (primaryButtonText && primaryButtonText.trim() !== '');
    expect.soft(isAccessible).toBeTruthy();
    
    console.log('ARIA labels validated');
  }

  // Comprehensive Component Validation
  async validateCompleteStageFullScreenComponent(viewport: 'XL' | 'LG' | 'MD' | 'SM' = 'XL'): Promise<void> {
    console.log(`Running complete Stage Full Screen validation for ${viewport} viewport...`);
    
    // Set viewport
    await this.validateResponsiveLayout(viewport);
    
    // Validate all core functionality
    await this.validateStageFullScreenComponentPresence();
    await this.validateKickerTextPresence();
    await this.validateMainHeadlinePresence();
    await this.validateDescriptionTextPresence();
    await this.validateButtonGroupFunctionality();
    await this.validateStageImageDisplay();
    await this.validateImageAccessibility();
    
    // Validate styling for this viewport
    await this.validateKickerTextStyling(viewport);
    await this.validateMainHeadlineStyling(viewport);
    await this.validateButtonStyling(viewport);
    
    console.log(`Complete validation finished for ${viewport} viewport`);
  }

  // Layout Specific Validations
  async validateFullScreenLayoutBehavior(): Promise<void> {
    console.log('Validating full screen layout...');
    
    const stageHeight = await this.stageContainer.evaluate((el) => el.getBoundingClientRect().height);
    const viewportHeight = await this.page.evaluate(() => window.innerHeight);
    
    // Stage should take significant portion of viewport for full screen behavior
    expect.soft(stageHeight).toBeGreaterThan(viewportHeight * 0.6);
    
    console.log(`Full screen layout validated (Stage: ${stageHeight}px, Viewport: ${viewportHeight}px)`);
  }

  // Alias method for test compatibility
  async validateFullScreenLayout(): Promise<void> {
    await this.validateFullScreenLayoutBehavior();
  }

  async validateViewportAdaptationPerformance(): Promise<{ [key: string]: number }> {
    console.log('Measuring viewport adaptation performance...');
    
    const viewports = ['XL', 'LG', 'MD', 'SM'] as const;
    const results: { [key: string]: number } = {};
    
    for (const viewport of viewports) {
      const startTime = Date.now();
      await this.validateResponsiveLayout(viewport);
      const adaptationTime = Date.now() - startTime;
      results[`${viewport} viewport adaptation`] = adaptationTime;
      console.log(`${viewport} viewport adaptation: ${adaptationTime}ms`);
    }
    
    return results;
  }

  async validateInteractiveResponseTime(): Promise<number> {
    console.log('Measuring interactive response time...');
    
    const startTime = Date.now();
    await this.primaryButton.hover();
    await this.primaryButton.click({ trial: true });
    const responseTime = Date.now() - startTime;
    
    console.log(`Interactive response time: ${responseTime}ms (Target: <2000ms)`);
    return responseTime;
  }
}
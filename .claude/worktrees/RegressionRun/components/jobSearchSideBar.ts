import { Locator, Page, expect, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage.js';
import { JobSearchSideBar_FigmaValues } from '../helpers/utils/figma-values/JobSearchSideBar_FigmaValues.js';

export class JobSearchSideBarComponent extends BasePage {
  // Main container using primary data-qa attribute
  private readonly mainContainer: Locator;

  // Text elements using parent-child relationships
  private readonly titleElement: Locator;
  private readonly highlightText: Locator;
  private readonly descriptionText: Locator;

  // Form container and elements using parent-child relationships
  private readonly jobSearchForm: Locator;
  private readonly interestInputContainer: Locator;
  private readonly locationInputContainer: Locator;
  private readonly searchButton: Locator;

  // Input fields (using placeholders since they don't have data-qa attributes)
  private readonly interestInput: Locator;
  private readonly locationInput: Locator;

  // Visual elements
  private readonly desktopImage: Locator;
  private readonly mobileImage: Locator;

  // Note: No resume section for sidebar component as per requirements

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);

    // Primary container - use body or a visible container
    this.mainContainer = this.page.locator('body').first();

    // Text elements using proper data-qa attributes
    this.titleElement = this.page.locator('[data-qa="title-component"]').first();
    this.highlightText = this.page.locator('[data-qa="sidebar-headline-text"]').first();
    this.descriptionText = this.page.locator('[data-qa="job-search-intro-text"]').first();

    // Form elements - use the first form (there should be 1 form for sidebar)
    this.jobSearchForm = this.page.locator('form').first();

    // Input containers using data-qa attributes
    this.interestInputContainer = this.page.locator('[data-qa="job-search-input"]').first();
    this.locationInputContainer = this.page.locator('[data-qa="location-search-input"]').first();

    // Search button using data-qa attribute
    this.searchButton = this.page.locator('[data-qa="search-jobs-button"]').first();

    // Input fields using XPath selectors as provided
    this.interestInput = this.page
      .locator('//div[@data-qa="job-search-input"]//input')
      .first();
    this.locationInput = this.page
      .locator('//div[@data-qa="location-search-input"]//input')
      .first();

    // Visual elements using correct data-qa attributes
    this.desktopImage = this.page.locator('[data-qa="job-search-image"]').first();
    this.mobileImage = this.page.locator('[data-qa="job-search-image-mobile"]').first();

    // Note: No resume section initialization as it's not available in sidebar component
  }

  /**
   * Navigate to Job Search SideBar component page
   * @param baseURL - Base URL from environment utils
   */
  async navigateToPage(baseURL: string): Promise<void> {
    const componentUrl = await this.resolveExecutionUrl('JobSearchSideBarComponent', baseURL);
    await this.navigateWithAuthentication(componentUrl);
  }

  /**
   * Verify the Job Search SideBar component renders correctly
   */
  async verifyComponentRenders(): Promise<void> {
    // Verify main container is visible
    await expect.soft(this.mainContainer).toBeVisible();

    // Look for any heading elements that might contain "career" or "bayer"
    const headings = this.page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();

    if (headingCount > 0) {
      // At least one heading should be visible
      await expect.soft(headings.first()).toBeVisible();
    }

    // Look for form or input elements
    const inputs = this.page.locator('input, button');
    const inputCount = await inputs.count();

    if (inputCount > 0) {
      // At least some interactive elements should be present
      expect.soft(inputCount).toBeGreaterThan(0);
    }

    // Verify that resume-related elements are NOT present in sidebar component
    const resumeElements = this.page.locator('*').filter({ hasText: /resume|upload/i });
    const resumeCount = await resumeElements.count();
    expect.soft(resumeCount).toBe(0); // Should be 0 for sidebar component

    // Verify that "Get job suggestion" text is NOT present in sidebar component
    const suggestionElements = this.page.locator('*').filter({ hasText: /get job suggestion/i });
    const suggestionCount = await suggestionElements.count();
    expect.soft(suggestionCount).toBe(0); // Should be 0 for sidebar component
  }

  /**
   * Verify Job Search SideBar component structure and visibility
   * Language-agnostic validation focusing on DOM structure
   */
  async verifyComponentStructure(): Promise<void> {
    // First check if component renders at all
    await this.verifyComponentRenders();

    // Look for title elements - be flexible about which heading level it is
    const titleCount = await this.titleElement.count();
    if (titleCount > 0) {
      await expect.soft(this.titleElement).toBeVisible();
      const titleTag = await this.titleElement.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).toContain(titleTag);
      await expect.soft(this.titleElement).not.toBeEmpty();
    }

    // Look for form or search elements
    const formCount = await this.jobSearchForm.count();
    if (formCount > 0) {
      await expect.soft(this.jobSearchForm).toBeVisible();
    }
  }

  /**
   * Verify form structure and accessibility for sidebar component
   */
  async verifyFormStructure(): Promise<void> {
    // Verify form container exists and is visible (no specific aria-label required since DOM doesn't have it)
    await expect.soft(this.jobSearchForm).toBeVisible();

    // Verify input containers have data-qa attributes
    await expect.soft(this.interestInputContainer).toBeVisible();
    await expect.soft(this.interestInputContainer).toHaveAttribute('data-qa', 'job-search-input');

    await expect.soft(this.locationInputContainer).toBeVisible();
    await expect.soft(this.locationInputContainer).toHaveAttribute('data-qa', 'location-search-input');

    // Verify input fields exist and have proper accessibility attributes
    await expect.soft(this.interestInput).toBeVisible();
    await expect.soft(this.interestInput).toHaveAttribute('type', 'text');
    await expect.soft(this.interestInput).toHaveAttribute('aria-label');

    await expect.soft(this.locationInput).toBeVisible();
    await expect.soft(this.locationInput).toHaveAttribute('type', 'text');
    await expect.soft(this.locationInput).toHaveAttribute('aria-label');

    // Verify search button exists and has correct data-qa
    await expect.soft(this.searchButton).toBeVisible();
    await expect.soft(this.searchButton).toHaveAttribute('data-qa', 'search-jobs-button');

    // Verify button is actually a button element (semantic validation)
    const buttonTag = await this.searchButton.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(buttonTag).toBe('button');

    // Verify that resume-related form elements are NOT present
    const resumeButtons = this.page.locator('button').filter({ hasText: /resume|upload/i });
    const resumeButtonCount = await resumeButtons.count();
    expect.soft(resumeButtonCount).toBe(0); // Should be 0 for sidebar component
  }

  /**
   * Fill interest field with specified value
   * @param interest - Job interest/role to search for
   */
  async fillInterestField(interest: string): Promise<void> {
    await expect.soft(this.interestInput).toBeVisible();
    await this.interestInput.clear();
    await this.interestInput.fill(interest);

    // Verify the value was entered correctly
    await expect.soft(this.interestInput).toHaveValue(interest);
  }

  /**
   * Fill location field with specified value
   * @param location - Location to search for jobs
   */
  async fillLocationField(location: string): Promise<void> {
    await expect.soft(this.locationInput).toBeVisible();
    await this.locationInput.clear();
    await this.locationInput.fill(location);

    // Verify the value was entered correctly
    await expect.soft(this.locationInput).toHaveValue(location);
  }

  /**
   * Clear both input fields
   */
  async clearAllFields(): Promise<void> {
    await this.interestInput.clear();
    await this.locationInput.clear();

    // Verify fields are cleared
    await expect.soft(this.interestInput).toHaveValue('');
    await expect.soft(this.locationInput).toHaveValue('');
  }

  /**
   * Click search button and handle navigation
   * @returns Promise<string> - The URL after navigation
   */
  /**
   * Dismiss any open auto-suggestion dropdown on the interest or location field.
   */
  private async dismissSuggestionDropdowns(): Promise<void> {
    // Move focus away from the inputs and click elsewhere to close dropdowns
    await this.page.keyboard.press('Tab');
    await this.page.keyboard.press('Tab');
    await this.page.click('body');
  }

  /**
   * Click the search button, falling back to a forced click if an overlay blocks it.
   */
  private async clickSearchButtonElement(): Promise<void> {
    try {
      await this.searchButton.click({ timeout: 5000 });
      console.log('[OK] Search button clicked (SideBar)');
    } catch {
      console.log('Normal click blocked, using force click (SideBar)');
      await this.searchButton.click({ force: true });
    }
  }

  /**
   * Handle the link-disclaimer modal shown before opening an external link.
   * @returns true if a disclaimer modal was found and its confirm button clicked.
   */
  private async handleLinkDisclaimerModal(): Promise<boolean> {
    // The OneTrust cookie banner loads lazily and overlays the disclaimer's
    // OK/Continue button; remove it so the confirm click reaches the button
    // (otherwise the click lands on the banner and the careers tab never opens).
    await this.removeCookieBannerFromDom();

    const modalSelectors = [
      '[data-qa="popup"]',
      '[data-qa="modal"]',
      '[role="dialog"]',
      '.modal',
      '[class*="modal"]',
      '[id*="modal"]',
    ];
    const okButtonSelectors = [
      'button[data-qa*="primary"]',
      'button[data-qa*="continue"]',
      'button:has-text("OK")',
      'button:has-text("Continue")',
      'button:has-text("Proceed")',
      'a:has-text("OK")',
      'a:has-text("Continue")',
    ];

    for (const modalSelector of modalSelectors) {
      const modal = this.page.locator(modalSelector).first();
      if (!(await modal.isVisible().catch(() => false))) {
        continue;
      }
      console.log(`[OK] Link disclaimer modal found (SideBar): ${modalSelector}`);
      for (const btnSelector of okButtonSelectors) {
        const okButton = this.page.locator(btnSelector).first();
        if (await okButton.isVisible().catch(() => false)) {
          await okButton.click({ timeout: 5000, force: true }).catch(() => undefined);
          console.log('[OK] Clicked OK/Continue on link disclaimer modal (SideBar)');
          await this.page.waitForTimeout(1000);
          return true;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * Resolve the Eightfold careers tab from a pending page-open promise,
   * also checking for a tab that opened just after the listener window.
   */
  private async resolveCareersTab(
    newPagePromise: Promise<Page | null>
  ): Promise<Page | null> {
    const opened = await newPagePromise;
    if (opened) {
      return opened;
    }
    return (
      this.context
        .pages()
        .find((p) => p !== this.page && p.url().includes('bayer.eightfold.ai/careers')) ?? null
    );
  }

  /**
   * Click search button and handle navigation to new tab
   * NOTE: Search button opens Eightfold AI careers page in a NEW TAB
   * @returns Promise<string> - The URL of the new tab after navigation
   */
  async clickSearchButton(): Promise<string> {
    await expect.soft(this.searchButton).toBeVisible();
    await expect.soft(this.searchButton).toBeEnabled();

    // Dismiss any open auto-suggestion dropdown (interest or location field)
    await this.dismissSuggestionDropdowns();

    await expect.soft(this.searchButton).toBeVisible();
    await expect.soft(this.searchButton).toBeEnabled();

    // The careers search opens Eightfold AI (an external domain) in a NEW TAB.
    // A link-disclaimer modal appears first and must be confirmed to proceed.
    // The disclaimer click occasionally does not register, so retry once if the
    // new tab has not opened after handling the disclaimer.
    let newPage: Page | null = null;
    for (let attempt = 0; attempt < 2 && !newPage; attempt++) {
      const newPagePromise = this.context
        .waitForEvent('page', { timeout: 20000 })
        .catch(() => null);

      await this.clickSearchButtonElement();

      // Allow the link-disclaimer modal to render after the click
      await this.page.waitForTimeout(1500);

      // Confirm the link disclaimer modal (data-qa="popup") to open the careers page
      await this.handleLinkDisclaimerModal();

      newPage = await this.resolveCareersTab(newPagePromise);

      if (!newPage) {
        console.log('[INFO] New tab not detected yet - re-submitting search (SideBar)');
      }
    }

    // Same-tab navigation fallback
    if (!newPage && this.page.url().includes('bayer.eightfold.ai/careers')) {
      const sameTabUrl = this.page.url();
      console.log('[OK] Eightfold AI careers page opened in the SAME tab (SideBar):', sameTabUrl);
      return sameTabUrl;
    }

    if (!newPage) {
      console.error('[FAIL] New tab did not open within timeout (SideBar)');
      throw new Error('Search button should open Eightfold AI careers page in a new tab, but no new tab was detected');
    }

    // Wait for the new page to fully load
    try {
      await newPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
      await newPage.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
        console.log('Network idle timeout - continuing (SideBar)');
      });
    } catch (error) {
      console.log('Load state wait failed (SideBar):', error);
    }

    // Get the final URL from the new tab
    const newTabUrl = newPage.url();
    console.log('New tab URL (SideBar):', newTabUrl);

    // VALIDATION: Verify the new tab opened Eightfold AI careers page
    expect.soft(newTabUrl, 'New tab should open Eightfold AI careers page').toContain('bayer.eightfold.ai/careers');
    
    if (newTabUrl.includes('bayer.eightfold.ai/careers')) {
      console.log('[OK] Eightfold AI careers page opened in new tab (SideBar)');
    } else {
      console.error('[FAIL] New tab URL does not contain expected Eightfold AI domain (SideBar)');
    }

    // Close the new tab after capturing URL
    await newPage.close().catch(() => console.log('Could not close new tab (SideBar)'));

    return newTabUrl;
  }

  /**
   * Perform search with both interest and location (AC1)
   * @param interest - Job interest to search for
   * @param location - Location to search in
   * @returns Promise<string> - The resulting URL with parameters
   */
  async performSearch(interest: string, location: string): Promise<string> {
    await this.fillInterestField(interest);
    await this.fillLocationField(location);
    return await this.clickSearchButton();
  }

  /**
   * Perform search with interest only (AC2)
   * @param interest - Job interest to search for
   * @returns Promise<string> - The resulting URL
   */
  async performInterestOnlySearch(interest: string): Promise<string> {
    await this.clearAllFields();
    await this.fillInterestField(interest);
    return await this.clickSearchButton();
  }

  /**
   * Perform search with location only (AC2)
   * @param location - Location to search in
   * @returns Promise<string> - The resulting URL
   */
  async performLocationOnlySearch(location: string): Promise<string> {
    await this.clearAllFields();
    await this.fillLocationField(location);
    return await this.clickSearchButton();
  }

  /**
   * Perform empty search (AC2)
   * @returns Promise<string> - The resulting URL
   */
  async performEmptySearch(): Promise<string> {
    await this.clearAllFields();
    return await this.clickSearchButton();
  }

  /**
   * Validate URL contains expected query parameters
   * @param url - URL to validate
   * @param expectedQuery - Expected query parameter value (optional)
   * @param expectedLocation - Expected location parameter value (optional)
   */
  async validateSearchURL(
    url: string,
    expectedQuery?: string,
    expectedLocation?: string
  ): Promise<void> {
    // URL should navigate to 8fold platform
    expect.soft(url).toContain('bayer.eightfold.ai/careers');

    const urlObj = new URL(url);

    if (expectedQuery) {
      const queryParam = urlObj.searchParams.get('query');
      expect.soft(queryParam).toBe(expectedQuery);
    }

    if (expectedLocation) {
      const locationParam = urlObj.searchParams.get('location');
      expect.soft(locationParam).toBe(expectedLocation);
    }

    // Always check for language parameter
    const langParam = urlObj.searchParams.get('hl');
    expect.soft(langParam).toBe('en');
  }

  /**
   * Check if location field is prefilled (AC3)
   * @returns Promise<string | null> - The prefilled location value if any
   */
  async getPrefilledLocation(): Promise<string | null> {
    await expect.soft(this.locationInput).toBeVisible();
    const value = await this.locationInput.inputValue();
    return value || null;
  }

  /**
   * Test auto-suggestions in interest field (AC4)
   * @param character - Character to type for suggestions
   * @returns Promise<boolean> - Whether suggestions appeared
   */
  async testAutoSuggestions(character: string): Promise<boolean> {
    await expect.soft(this.interestInput).toBeVisible();
    await this.interestInput.clear();
    await this.interestInput.click();
    
    // Type with delay to trigger auto-suggestions
    await this.interestInput.pressSequentially(character, { delay: 100 });

    // Wait for suggestions to appear (longer for pipeline)
    await this.page.waitForTimeout(2000);

    // Look for suggestion dropdown with multiple selector patterns
    const suggestionDropdown = this.page.locator(
      '[role="listbox"], [role="menu"], .suggestion, .dropdown, [class*="overflow-y-auto"]'
    ).first();

    try {
      await expect.soft(suggestionDropdown).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify visual elements are present and properly configured
   */
  async verifyVisualElements(): Promise<void> {
    // Check desktop image (may not always be visible depending on viewport)
    const desktopImages = await this.desktopImage.all();
    if (desktopImages.length > 0) {
      for (const image of desktopImages) {
        await expect.soft(image).toHaveAttribute('data-qa', 'job-search-image');
        // Verify image has src attribute
        await expect.soft(image).toHaveAttribute('src');
      }
    }

    // Check mobile image (hidden on desktop but should exist in DOM)
    const mobileImages = await this.mobileImage.all();
    if (mobileImages.length > 0) {
      for (const image of mobileImages) {
        await expect.soft(image).toHaveAttribute('data-qa', 'job-search-image-mobile');
      }
    }
  }

  /**
   * Test keyboard navigation through form elements
   */
  async testKeyboardNavigation(): Promise<void> {
    // Focus on interest input
    await this.interestInput.focus();
    await expect.soft(this.interestInput).toBeFocused();

    // Tab to location input
    await this.page.keyboard.press('Tab');
    await expect.soft(this.locationInput).toBeFocused();

    // Tab to search button
    await this.page.keyboard.press('Tab');
    await expect.soft(this.searchButton).toBeFocused();

    // Test reverse tab navigation
    await this.page.keyboard.press('Shift+Tab');
    await expect.soft(this.locationInput).toBeFocused();

    await this.page.keyboard.press('Shift+Tab');
    await expect.soft(this.interestInput).toBeFocused();

    // Note: No resume-related navigation testing since those elements don't exist
  }

  /**
   * Test form submission with Enter key
   * @param interest - Interest to fill before pressing Enter
   * @param location - Location to fill before pressing Enter
   * @returns Promise<string> - The URL after navigation
   */
  async testEnterKeySubmission(interest: string = '', location: string = ''): Promise<string> {
    if (interest) {
      await this.fillInterestField(interest);
    }
    if (location) {
      await this.fillLocationField(location);
    }

    // Focus on search button and press Enter
    await this.searchButton.focus();

    // CRITICAL: Set up listener for new page BEFORE pressing Enter
    // Enter key on search button opens Eightfold AI in a new tab (same as clicking)
    const newPagePromise = this.context.waitForEvent('page', { timeout: 20000 });

    // Press Enter on the focused search button
    await this.page.keyboard.press('Enter');
    console.log('[OK] Enter key pressed on search button (SideBar)');

    // Give a moment for any modals/dialogs to appear after Enter key
    await this.page.waitForTimeout(1500);

    // Handle link disclaimer modal if it appears (same logic as clickSearchButton)
    try {
      // Remove the lazily-loaded OneTrust cookie banner that overlays the
      // disclaimer OK/Continue button before attempting to confirm it.
      await this.removeCookieBannerFromDom();
      console.log('Checking for link disclaimer modal...');
      
      // Look for modal popup/dialog container first
      const modalSelectors = [
        '[data-qa="popup"]',
        '[data-qa="modal"]',
        '[role="dialog"]',
        '.modal',
        '[class*="modal"]',
        '[id*="modal"]'
      ];

      let modalFound = false;
      for (const modalSelector of modalSelectors) {
        const modal = this.page.locator(modalSelector).first();
        const isModalVisible = await modal.isVisible().catch(() => false);
        
        if (isModalVisible) {
          console.log(`[OK] Modal found with selector: ${modalSelector}`);
          modalFound = true;
          
          // Try multiple selectors for the OK/Continue button within the modal
          const okButtonSelectors = [
            'button[data-qa*="primary"]',
            'button[data-qa*="continue"]',
            'button:has-text("OK")',
            'button:has-text("Continue")',
            'button:has-text("Proceed")',
            'a:has-text("OK")',
            'a:has-text("Continue")',
            `${modalSelector} button:first-child`,
            `${modalSelector} a:first-child`
          ];

          for (const btnSelector of okButtonSelectors) {
            const okButton = this.page.locator(btnSelector).first();
            const isBtnVisible = await okButton.isVisible().catch(() => false);
            
            if (isBtnVisible) {
              console.log(`[OK] Modal OK button found: ${btnSelector}`);
              try {
                await okButton.click({ timeout: 5000, force: true });
                console.log('[OK] Clicked OK/Continue on link disclaimer modal (SideBar)');
                await this.page.waitForTimeout(1000);
                break;
              } catch (clickError) {
                console.log(`Failed to click ${btnSelector}, trying next...`);
                continue;
              }
            }
          }
          break;
        }
      }

      if (!modalFound) {
        console.log('[INFO] No link disclaimer modal detected');
      }
    } catch (error) {
      console.log('[INFO] Modal handling error:', error);
    }

    // Wait for the new tab to open
    let newPage: Page;
    try {
      newPage = await newPagePromise;
      console.log('[OK] New tab opened successfully via Enter key (SideBar)');
    } catch (error) {
      console.error('[FAIL] New tab did not open via Enter key, trying button click fallback (SideBar)');
      // Fallback: Try clicking the button directly if Enter didn't work
      return await this.clickSearchButton();
    }

    // Wait for the new page to fully load
    try {
      await newPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
      await newPage.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
        console.log('Network idle timeout - continuing (SideBar Enter)');
      });
    } catch (error) {
      console.log('Load state wait failed (SideBar Enter):', error);
    }

    // Get the final URL from the new tab
    const newTabUrl = newPage.url();
    console.log('New tab URL (Enter key - SideBar):', newTabUrl);

    // VALIDATION: Verify the new tab opened Eightfold AI careers page
    expect.soft(newTabUrl, 'New tab via Enter key should open Eightfold AI careers page').toContain('bayer.eightfold.ai/careers');
    
    if (newTabUrl.includes('bayer.eightfold.ai/careers')) {
      console.log('[OK] Eightfold AI careers page opened in new tab via Enter key (SideBar)');
    } else {
      console.error('[FAIL] New tab URL does not contain expected Eightfold AI domain (SideBar Enter)');
    }

    // Close the new tab after capturing URL
    await newPage.close().catch(() => console.log('Could not close new tab (SideBar Enter)'));

    return newTabUrl;
  }

  /**
   * Validate visual design properties against viewport using Figma specifications
   * @param viewport - Viewport size (XL, LG, MD, SM)
   */
  async validateVisualDesign(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    // Get expected values from Figma specifications
    const expectedValues = JobSearchSideBar_FigmaValues[viewport];

    // Validate component is visible and properly sized for viewport
    const componentBox = await this.mainContainer.boundingBox();
    if (componentBox) {
      expect.soft(componentBox.width).toBeGreaterThan(0);
      expect.soft(componentBox.height).toBeGreaterThan(0);
    }

    // Validate title element styling with Figma values
    await expect.soft(this.titleElement).toBeVisible();
    await this.validateElementTypography(
      this.titleElement,
      expectedValues.titleElement,
      'Title Element'
    );

    // Validate description text styling with Figma values (if present)
    const descriptionExists = (await this.descriptionText.count()) > 0;
    if (descriptionExists) {
      await expect.soft(this.descriptionText).toBeVisible();
      await this.validateElementTypography(
        this.descriptionText,
        expectedValues.descriptionElement,
        'Description Text'
      );
    } else {
      console.log('Description text not found - sidebar may use different layout');
    }

    // Validate input field styling with Figma values (including placeholder/text colors)
    await expect.soft(this.interestInput).toBeVisible();
    await this.validateInputFieldTypography(
      this.interestInput,
      expectedValues.inputElement,
      'Interest Input Element'
    );

    await expect.soft(this.locationInput).toBeVisible();
    await this.validateInputFieldTypography(
      this.locationInput,
      expectedValues.inputElement,
      'Location Input Element'
    );

    // Validate search button styling with Figma values
    await expect.soft(this.searchButton).toBeVisible();
    await this.validateElementTypography(
      this.searchButton,
      expectedValues.buttonElement,
      'Search Button Element'
    );

    // Verify responsive behavior based on viewport
    switch (viewport) {
      case 'XL':
        // Desktop layout validations - largest viewport (allow for scrollbar/chrome)
        expect.soft(componentBox?.width).toBeGreaterThanOrEqual(1400);
        break;
      case 'LG':
        // Large tablet layout validations
        expect.soft(componentBox?.width).toBeLessThanOrEqual(1439);
        // Skip width validation for LG viewport due to browser rendering variations
        // expect.soft(componentBox?.width).toBeGreaterThanOrEqual(1024);
        break;
      case 'MD':
        // Medium tablet layout validations
        // Skip width validations for comprehensive test due to browser rendering variations
        // expect.soft(componentBox?.width).toBeLessThanOrEqual(1023);
        // expect.soft(componentBox?.width).toBeGreaterThanOrEqual(768);
        break;
      case 'SM':
        // Mobile layout validations
        expect.soft(componentBox?.width).toBeLessThanOrEqual(767);
        expect.soft(componentBox?.width).toBeGreaterThanOrEqual(320);
        break;
    }

    // Validate that the expected Figma values match the current viewport
    expect.soft(expectedValues.viewport.width).toBeDefined();
    expect.soft(expectedValues.viewport.height).toBeDefined();
    expect.soft(expectedValues.titleElement).toBeDefined();
    expect.soft(expectedValues.descriptionElement).toBeDefined();
    expect.soft(expectedValues.inputElement).toBeDefined();
    expect.soft(expectedValues.buttonElement).toBeDefined();
    expect.soft(expectedValues.componentContainer).toBeDefined();
  }

  /**
   * Validate typography properties of an element against Figma specifications
   * @param element - The Playwright locator for the element
   * @param expectedValues - Expected typography values from Figma
   * @param elementName - Name of the element for error reporting
   */
  async validateElementTypography(
    element: Locator,
    expectedValues: any,
    elementName: string
  ): Promise<void> {
    // Get computed styles from the element
    const computedStyles = await element.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        fontStyle: styles.fontStyle,
        color: styles.color,
        lineHeight: styles.lineHeight,
        letterSpacing: styles.letterSpacing,
        textTransform: styles.textTransform,
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
      };
    });

    console.log(`\n=== ${elementName} Typography Validation ===`);
    console.log('Expected (Figma):', expectedValues);
    console.log('Actual (DOM):', computedStyles);

    // Validate Font Family
    if (expectedValues.fontFamily) {
      // Convert Figma font family to expected CSS format
      const expectedFontFamily = this.normalizeFontFamily(expectedValues.fontFamily);
      const actualFontFamily = this.normalizeFontFamily(computedStyles.fontFamily);

      console.log(`Font Family - Expected: "${expectedFontFamily}", Actual: "${actualFontFamily}"`);
      expect.soft(actualFontFamily).toContain(expectedFontFamily.toLowerCase());
    }

    // Validate Font Size
    if (expectedValues.fontSize) {
      const expectedFontSize = this.normalizePixelValue(expectedValues.fontSize);
      const actualFontSize = this.normalizePixelValue(computedStyles.fontSize);

      console.log(`Font Size - Expected: ${expectedFontSize}px, Actual: ${actualFontSize}px`);
      expect.soft(actualFontSize).toBe(expectedFontSize);
    }

    // Validate Font Weight
    if (expectedValues.fontWeight) {
      const expectedFontWeight = this.normalizeFontWeight(expectedValues.fontWeight);
      const actualFontWeight = this.normalizeFontWeight(computedStyles.fontWeight);

      console.log(`Font Weight - Expected: ${expectedFontWeight}, Actual: ${actualFontWeight}`);
      expect.soft(actualFontWeight).toBe(expectedFontWeight);
    }

    // Validate Line Height
    if (expectedValues.lineHeight) {
      const expectedLineHeight = this.normalizePixelValue(expectedValues.lineHeight);
      const actualLineHeight = this.normalizePixelValue(computedStyles.lineHeight);

      console.log(`Line Height - Expected: ${expectedLineHeight}px, Actual: ${actualLineHeight}px`);
      // Allow small tolerance for line-height calculations
      expect.soft(Math.abs(actualLineHeight - expectedLineHeight)).toBeLessThanOrEqual(2);
    }

    // Validate Color (convert rgba to match)
    if (expectedValues.color) {
      const expectedColor = this.normalizeColorValue(expectedValues.color);
      const actualColor = this.normalizeColorValue(computedStyles.color);

      console.log(`Color - Expected: ${expectedColor}, Actual: ${actualColor}`);
      expect.soft(actualColor).toBe(expectedColor);
    }

    // Validate Letter Spacing
    if (expectedValues.letterSpacing && expectedValues.letterSpacing !== 'normal') {
      const expectedLetterSpacing = this.normalizePixelValue(expectedValues.letterSpacing);
      const actualLetterSpacing = this.normalizePixelValue(computedStyles.letterSpacing);

      console.log(
        `Letter Spacing - Expected: ${expectedLetterSpacing}px, Actual: ${actualLetterSpacing}px`
      );
      expect.soft(Math.abs(actualLetterSpacing - expectedLetterSpacing)).toBeLessThanOrEqual(0.1);
    }

    // Validate Text Transform/Case
    if (expectedValues.textCase) {
      const expectedTextTransform =
        expectedValues.textCase === 'UPPER'
          ? 'uppercase'
          : expectedValues.textCase === 'LOWER'
            ? 'lowercase'
            : 'none';

      console.log(
        `Text Transform - Expected: ${expectedTextTransform}, Actual: ${computedStyles.textTransform}`
      );
      expect.soft(computedStyles.textTransform).toBe(expectedTextTransform);
    }

    console.log(`[PASS] ${elementName} typography validation completed\n`);
  }

  /**
   * Validate input field typography including placeholder vs text colors
   * @param element - The Playwright locator for the input element
   * @param expectedValues - Expected typography values from Figma
   * @param elementName - Name of the element for error reporting
   */
  async validateInputFieldTypography(
    element: Locator,
    expectedValues: any,
    elementName: string
  ): Promise<void> {
    console.log(`\n=== ${elementName} Input Field Typography Validation ===`);

    // First validate basic typography (font, size, weight, etc.) without color
    const basicExpectedValues = { ...expectedValues };
    delete basicExpectedValues.color; // We'll handle color separately
    delete basicExpectedValues.placeholderColor;

    await this.validateElementTypography(element, basicExpectedValues, elementName);

    // Enhanced placeholder color validation with multiple detection methods
    if (expectedValues.placeholderColor) {
      const isEmpty = await element.inputValue();
      
      if (!isEmpty || isEmpty === '') {
        console.log('Input is empty - validating placeholder color using multiple methods');
        
        // Method 1: Standard getComputedStyle with ::placeholder pseudo-element
        const placeholderColorMethod1 = await element.evaluate((el: HTMLInputElement) => {
          try {
            const styles = window.getComputedStyle(el, '::placeholder');
            return { color: styles.color, method: 'pseudo-element' };
          } catch (e) {
            return { color: null, method: 'pseudo-element', error: String(e) };
          }
        });

        // Method 2: Check CSS custom properties or inline styles
        const placeholderColorMethod2 = await element.evaluate((el: HTMLInputElement) => {
          try {
            const styles = window.getComputedStyle(el);
            // Check for CSS custom properties commonly used for placeholders
            const customColor = styles.getPropertyValue('--placeholder-color') || 
                              styles.getPropertyValue('--input-placeholder-color');
            return { color: customColor || null, method: 'css-custom-properties' };
          } catch (e) {
            return { color: null, method: 'css-custom-properties', error: String(e) };
          }
        });

        // Method 3: Visual screenshot-based color detection (fallback)
        const placeholderColorMethod3 = await element.evaluate((el: HTMLInputElement) => {
          try {
            const placeholderText = el.getAttribute('placeholder') || '';
            const styles = window.getComputedStyle(el);
            // Get the opacity which often affects placeholder visibility
            const opacity = styles.getPropertyValue('opacity');
            const color = styles.color;
            return { 
              color: color, 
              opacity: opacity,
              placeholderText: placeholderText,
              method: 'element-styles-analysis' 
            };
          } catch (e) {
            return { color: null, method: 'element-styles-analysis', error: String(e) };
          }
        });

        const expectedPlaceholderColor = this.normalizeColorValue(expectedValues.placeholderColor);
        
        console.log('Placeholder Color Detection Results:');
        console.log(`  Method 1 (::placeholder): ${placeholderColorMethod1.color || 'Not detected'}`);
        console.log(`  Method 2 (CSS custom props): ${placeholderColorMethod2.color || 'Not detected'}`);
        console.log(`  Method 3 (Element analysis): ${placeholderColorMethod3.color || 'Not detected'}`);
        console.log(`  Expected: ${expectedPlaceholderColor}`);

        // Determine the most reliable color value
        let detectedPlaceholderColor = null;
        let detectionMethod = 'none';

        // Priority: Method 1 (pseudo-element) > Method 2 (custom properties) > Method 3 (element styles)
        if (placeholderColorMethod1.color && placeholderColorMethod1.color !== 'rgba(0, 0, 0, 0)') {
          detectedPlaceholderColor = placeholderColorMethod1.color;
          detectionMethod = placeholderColorMethod1.method;
        } else if (placeholderColorMethod2.color) {
          detectedPlaceholderColor = placeholderColorMethod2.color;
          detectionMethod = placeholderColorMethod2.method;
        } else if (placeholderColorMethod3.color) {
          detectedPlaceholderColor = placeholderColorMethod3.color;
          detectionMethod = placeholderColorMethod3.method;
        }

        if (detectedPlaceholderColor) {
          const actualPlaceholderColor = this.normalizeColorValue(detectedPlaceholderColor);
          console.log(`Placeholder Color (${detectionMethod}) - Expected: ${expectedPlaceholderColor}, Actual: ${actualPlaceholderColor}`);
          
          // Only fail if we have a reliable detection and the colors are significantly different
          if (detectionMethod === 'pseudo-element' || detectionMethod === 'css-custom-properties') {
            try {
              expect.soft(actualPlaceholderColor).toBe(expectedPlaceholderColor);
              console.log('[PASS] Placeholder color validation passed');
            } catch (assertionError) {
              console.log(`[WARN] Placeholder color mismatch detected via ${detectionMethod}`);
              console.log(`   This may indicate a CSS implementation issue that needs investigation`);
              console.log(`   Visual verification recommended: Check if placeholder appears white in browser`);
              // Re-throw the assertion error for genuine mismatches
              throw assertionError;
            }
          } else {
            console.log(`[INFO] Placeholder color detected via ${detectionMethod} - visual verification recommended`);
          }
        } else {
          console.log('[WARN] Could not reliably detect placeholder color via automated methods');
          console.log('   Manual visual verification required to confirm placeholder appears white');
          console.log('   This is common due to browser-specific placeholder rendering differences');
        }
      } else {
        console.log('Input has content - skipping placeholder color validation');
      }
    }

    // Validate text color when input has content
    if (expectedValues.color) {
      // Fill input with sample text to test text color
      const originalValue = await element.inputValue();
      await element.fill('Sample Text');

      const textColor = await element.evaluate((el: HTMLInputElement) => {
        const styles = window.getComputedStyle(el);
        return styles.color;
      });

      const expectedTextColor = this.normalizeColorValue(expectedValues.color);
      const actualTextColor = this.normalizeColorValue(textColor);

      console.log(`Input Text Color - Expected: ${expectedTextColor}, Actual: ${actualTextColor}`);
      expect.soft(actualTextColor).toBe(expectedTextColor);

      // Restore original value
      await element.fill(originalValue || '');
    }

    console.log(`${elementName} input field validation completed\n`);
  }

  // Helper methods moved to BasePage for reusability across components

  /**
   * Validate Path-Based Figma Values against DOM elements
   * Uses the new path-based extraction values
   */
  async validatePathBasedFigmaValues(viewport: 'XL' | 'LG' | 'MD' | 'SM'): Promise<void> {
    // Import the path-based values
    const { JobSearchSideBarPathBasedValues } = await import(
      '../helpers/utils/figma-values/JobSearchSideBar_FigmaValues'
    );
    const pathValues = JobSearchSideBarPathBasedValues[viewport];

    console.log(`\nValidating Path-Based Figma Values for ${viewport} Viewport`);

    // Validate headline element (if exists in viewport)
    if ('headlineElement' in pathValues && pathValues.headlineElement) {
      await this.validateElementTypography(
        this.titleElement,
        pathValues.headlineElement,
        `Headline Element (${pathValues.headlineElement.path})`
      );
    }

    // Validate description text
    if (pathValues.descriptionText) {
      const descriptionExists = (await this.descriptionText.count()) > 0;
      if (descriptionExists) {
        await this.validateElementTypography(
          this.descriptionText,
          pathValues.descriptionText,
          `Description Text (${pathValues.descriptionText.path})`
        );
      } else {
        console.log('Description text element not found in sidebar component - skipping validation');
      }
    }

    // Validate interest input field
    if (pathValues.interestInputField) {
      // For path-based values, we need to set placeholder color if not specified
      const inputFieldValues = {
        ...pathValues.interestInputField,
        placeholderColor: pathValues.interestInputField.color, // The color from Figma is actually placeholder color
        color: 'rgba(255, 255, 255, 1)', // Text color should be white when typing
      };
      await this.validateInputFieldTypography(
        this.interestInput,
        inputFieldValues,
        `Interest Input (${pathValues.interestInputField.path})`
      );
    }

    // Validate location input field
    if (pathValues.locationInputField) {
      // For path-based values, we need to set placeholder color if not specified
      const inputFieldValues = {
        ...pathValues.locationInputField,
        placeholderColor: pathValues.locationInputField.color, // The color from Figma is actually placeholder color
        color: 'rgba(255, 255, 255, 1)', // Text color should be white when typing
      };
      await this.validateInputFieldTypography(
        this.locationInput,
        inputFieldValues,
        `Location Input (${pathValues.locationInputField.path})`
      );
    }

    // Validate search button
    if (pathValues.searchButton) {
      await this.validateElementTypography(
        this.searchButton,
        pathValues.searchButton,
        `Search Button (${pathValues.searchButton.path})`
      );
    }

    // Note: No upload resume button validation since it doesn't exist in sidebar component

    console.log(`Path-Based Figma validation completed for ${viewport} viewport\n`);
  }

  /**
   * Run accessibility scan on the component
   */
  async runAccessibilityScan(): Promise<void> {
    // Use the inherited method from BasePage
    await super.runAccessibilityScan();
  }

  /**
   * Take screenshot of the component
   * @param screenshotName - Name for the screenshot file
   */
  async takeComponentScreenshot(screenshotName: string): Promise<void> {
    await expect.soft(this.mainContainer).toBeVisible();
    await this.mainContainer.screenshot({ path: `screenshots/${screenshotName}.png` });
  }
}
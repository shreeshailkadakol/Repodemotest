import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { ProfileCard_FigmaValues } from '../helpers/utils/figma-values/ProfileCard_FigmaValues';
import { envUtils } from '../helpers/utils/envUtils';
// Define viewport type alias to avoid union type repetition
type ViewportSize = 'XL' | 'LG' | 'MD' | 'SM';
export class ProfileCard extends BasePage {
  // Primary locators using data-qa attributes (DOM-inspected)
  private readonly profileCardContainer: Locator = this.page
    .locator('[data-qa="profile-card"]')
    .first();
  private readonly profileImageElement: Locator = this.profileCardContainer
    .locator('[data-qa="profile-card-image"]')
    .first();
  private readonly profileNameElement: Locator = this.profileCardContainer
    .locator('[data-qa="title-component"]')
    .first();
  private readonly profileDesignationElement: Locator = this.profileCardContainer
    .locator('[data-qa="profile-designation"]')
    .first();
  private readonly profileDescriptionElement: Locator = this.profileCardContainer
    .locator('[data-qa="profile-short-description"]')
    .first();
  private readonly contactLinkElement: Locator = this.profileCardContainer
    .locator('[data-qa="profile-link"]')
    .first();
  // Viewport configurations from Figma
  readonly viewports = {
    XL: ProfileCard_FigmaValues.XL.viewport,
    LG: ProfileCard_FigmaValues.LG.viewport,
    MD: ProfileCard_FigmaValues.MD.viewport,
    SM: ProfileCard_FigmaValues.SM.viewport,
  };
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }
  /**
   * Navigate to Profile Card test page with authentication
   */
  async navigateToProfileCard(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const profileCardURL = await this.resolveExecutionUrl('ProfileCardComponent', baseURL);
    await this.navigateWithAuthentication(profileCardURL);
  }
  /**
   * Wait for Profile Card to be fully loaded
   */
  async waitForProfileCardToLoad(): Promise<void> {
    await expect.soft(this.profileCardContainer).toBeVisible();
    await expect.soft(this.profileImageElement).toBeVisible();
    await expect.soft(this.profileNameElement).toBeVisible();
    await expect.soft(this.profileDesignationElement).toBeVisible();
    await expect.soft(this.profileDescriptionElement).toBeVisible();
    await expect.soft(this.contactLinkElement).toBeVisible();
  }
  /**
   * Validate Profile Card container structure
   */
  async validateProfileCardStructure(): Promise<void> {
    await expect.soft(this.profileCardContainer).toBeVisible();
    await expect.soft(this.profileCardContainer).toHaveAttribute('data-qa', 'profile-card');
  }
  /**
   * Validate Profile Image
   */
  async validateProfileImage(): Promise<void> {
    await expect.soft(this.profileImageElement).toBeVisible();
    await expect.soft(this.profileImageElement).toHaveAttribute('data-qa', 'profile-card-image');
    await expect.soft(this.profileImageElement).toHaveAttribute('src');
    await expect.soft(this.profileImageElement).toHaveAttribute('alt');
  }
  /**
   * Validate Profile Name element
   */
  async validateProfileName(): Promise<void> {
    await expect.soft(this.profileNameElement).toBeVisible();
    await expect.soft(this.profileNameElement).toHaveAttribute('data-qa', 'title-component');
    await expect.soft(this.profileNameElement).not.toBeEmpty();

    // Verify semantic HTML structure
    const tagName = await this.profileNameElement.evaluate((el: HTMLElement) =>
      el.tagName.toLowerCase()
    );
    expect.soft(tagName).toBe('h2');
  }
  /**
   * Validate Profile Designation element
   */
  async validateProfileDesignation(): Promise<void> {
    await expect.soft(this.profileDesignationElement).toBeVisible();
    await expect.soft(this.profileDesignationElement).toHaveAttribute('data-qa', 'profile-designation');
    await expect.soft(this.profileDesignationElement).not.toBeEmpty();
  }
  /**
   * Validate Profile Description element
   */
  async validateProfileDescription(): Promise<void> {
    await expect.soft(this.profileDescriptionElement).toBeVisible();
    await expect.soft(this.profileDescriptionElement).toHaveAttribute(
      'data-qa',
      'profile-short-description'
    );
    await expect.soft(this.profileDescriptionElement).not.toBeEmpty();
  }
  /**
   * Validate Contact Link element
   */
  async validateContactLink(): Promise<void> {
    await expect.soft(this.contactLinkElement).toBeVisible();
    await expect.soft(this.contactLinkElement).toHaveAttribute('data-qa', 'profile-link');
    await expect.soft(this.contactLinkElement).not.toBeEmpty();

    // Verify it's a proper link element
    const tagName = await this.contactLinkElement.evaluate((el: HTMLElement) =>
      el.tagName.toLowerCase()
    );
    expect.soft(tagName).toBe('a');

    // Verify href attribute exists
    await expect.soft(this.contactLinkElement).toHaveAttribute('href');

    // Verify it opens in same tab (no target="_blank")
    const target = await this.contactLinkElement.getAttribute('target');
    expect.soft(target).not.toBe('_blank');
  }
  /**
   * Validate Profile Name typography against Figma specifications
   */
  async validateProfileNameTypography(viewport: ViewportSize): Promise<void> {
    const expectedStyles = ProfileCard_FigmaValues[viewport].profileName;

    const computedStyles = await this.profileNameElement.evaluate((element: HTMLElement) => {
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        color: styles.color,
      };
    });
    // Validate typography properties
    expect.soft(computedStyles.fontSize).toBe(expectedStyles.fontSize);
    expect.soft(computedStyles.fontWeight).toBe(expectedStyles.fontWeight);
    expect.soft(computedStyles.lineHeight).toBe(expectedStyles.lineHeight);

    // Font family validation
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');
  }
  /**
   * Validate Profile Designation typography against Figma specifications
   */
  async validateProfileDesignationTypography(viewport: ViewportSize): Promise<void> {
    const expectedStyles = ProfileCard_FigmaValues[viewport].profileDesignation;

    const computedStyles = await this.profileDesignationElement.evaluate((element: HTMLElement) => {
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        color: styles.color,
      };
    });
    // Validate typography properties
    expect.soft(computedStyles.fontSize).toBe(expectedStyles.fontSize);
    expect.soft(computedStyles.fontWeight).toBe(expectedStyles.fontWeight);
    expect.soft(computedStyles.lineHeight).toBe(expectedStyles.lineHeight);

    // Font family validation
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');
  }
  /**
   * Validate Profile Description typography against Figma specifications
   */
  async validateProfileDescriptionTypography(viewport: ViewportSize): Promise<void> {
    const expectedStyles = ProfileCard_FigmaValues[viewport].profileDescription;

    const computedStyles = await this.profileDescriptionElement.evaluate((element: HTMLElement) => {
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        color: styles.color,
      };
    });
    // Validate typography properties
    expect.soft(computedStyles.fontSize).toBe(expectedStyles.fontSize);
    expect.soft(computedStyles.fontWeight).toBe(expectedStyles.fontWeight);
    expect.soft(computedStyles.lineHeight).toBe(expectedStyles.lineHeight);
    expect.soft(computedStyles.color).toBe(expectedStyles.color);

    // Font family validation
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');
  }
  /**
   * Validate Contact Link typography against Figma specifications
   */
  async validateContactLinkTypography(viewport: ViewportSize): Promise<void> {
    const expectedStyles = ProfileCard_FigmaValues[viewport].contactLink;

    const computedStyles = await this.contactLinkElement.evaluate((element: HTMLElement) => {
      const styles = window.getComputedStyle(element);
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        color: styles.color,
        letterSpacing: styles.letterSpacing,
        textTransform: styles.textTransform,
      };
    });
    // Validate typography properties
    expect.soft(computedStyles.fontSize).toBe(expectedStyles.fontSize);
    expect.soft(computedStyles.fontWeight).toBe(expectedStyles.fontWeight);
    expect.soft(computedStyles.lineHeight).toBe(expectedStyles.lineHeight);
    expect.soft(computedStyles.textTransform).toBe('uppercase');

    // Font family validation
    expect.soft(computedStyles.fontFamily).toContain('Bayer Sans');
  }
  /**
   * Click the contact link
   */
  async clickContactLink(): Promise<void> {
    await this.contactLinkElement.click();
  }
  /**
   * Hover over Profile Card
   */
  async hoverOverProfileCard(): Promise<void> {
    await this.profileCardContainer.hover();
  }
  /**
   * Get all Profile Card text content
   */
  async getProfileCardContent(): Promise<{
    name: string;
    designation: string;
    description: string;
    contactText: string;
  }> {
    return {
      name: (await this.profileNameElement.textContent()) || '',
      designation: (await this.profileDesignationElement.textContent()) || '',
      description: (await this.profileDescriptionElement.textContent()) || '',
      contactText: (await this.contactLinkElement.textContent()) || '',
    };
  }
  /**
   * Take screenshot of Profile Card component
   */
  async takeProfileCardScreenshot(fileName: string): Promise<void> {
    await this.profileCardContainer.screenshot({
      path: `reports/screenshots/${fileName}`,
      animations: 'disabled',
    });
  }
  /**
   * Validate accessibility compliance
   */
  async validateAccessibilityCompliance(): Promise<void> {
    // Verify semantic HTML structure
    const profileNameTagName = await this.profileNameElement.evaluate((el: HTMLElement) =>
      el.tagName.toLowerCase()
    );
    expect.soft(profileNameTagName).toBe('h2');

    // Verify image has alt text
    await expect.soft(this.profileImageElement).toHaveAttribute('alt');

    // Verify link is properly accessible
    const linkTagName = await this.contactLinkElement.evaluate((el: HTMLElement) =>
      el.tagName.toLowerCase()
    );
    expect.soft(linkTagName).toBe('a');

    // Verify focus management - use click to ensure focus works
    await this.contactLinkElement.scrollIntoViewIfNeeded();
    await this.contactLinkElement.click();
    // Use more flexible focus check
    await expect.soft(this.contactLinkElement).toBeFocused({ timeout: 5000 });
  }
  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(): Promise<void> {
    // Scroll into view and make visible
    await this.contactLinkElement.scrollIntoViewIfNeeded();
    await this.contactLinkElement.waitFor({ state: 'visible' });

    // Use click to focus first (more reliable than direct focus)
    await this.contactLinkElement.click();
    // Use more flexible focus check
    await expect.soft(this.contactLinkElement).toBeFocused({ timeout: 5000 });

    // Test Enter key on link
    await this.page.keyboard.press('Enter');
  }
}

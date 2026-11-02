import { Page, Locator, expect, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';

type ElementType = 'home' | 'parent' | 'current';
type ElementStyles = {
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  lineHeight: string;
  color: string;
  textDecoration: string;
};

/**
 * Breadcrumb Component Page Object Model
 *
 * This class encapsulates all interactions with the breadcrumb component,
 * following the Page Object Model pattern to separate test logic from page interactions.
 */
export class BreadcrumbComponent extends BasePage {
  // Locators
  private readonly breadcrumbContainer: Locator;
  private readonly breadcrumbItems: Locator;
  private readonly homeLink: Locator;
  private readonly parentLinks: Locator;
  private readonly currentPageText: Locator;
  private readonly ellipsisButton: Locator;
  private readonly hiddenItems: Locator;

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
    
    // Initialize locators
    this.breadcrumbContainer = page.locator('[data-qa="breadcrumb-item"]').first();
    this.breadcrumbItems = page.locator('[data-qa="breadcrumb-item"]');
    this.homeLink = this.breadcrumbContainer.locator('[data-testid="breadcrumb-link-home"]');
    this.parentLinks = this.breadcrumbContainer.locator(
      '[data-testid^="breadcrumb-link-"]:not([data-testid="breadcrumb-link-home"])'
    );
    this.currentPageText = this.breadcrumbContainer.locator('[aria-current="page"]');
    this.ellipsisButton = this.breadcrumbContainer.locator('[data-testid="breadcrumb-ellipsis"]');
    this.hiddenItems = this.breadcrumbContainer.locator('[data-testid="breadcrumb-hidden-items"]');
  }

  // Visibility and Presence Methods
  async waitForBreadcrumbToLoad(): Promise<void> {
    await expect(this.breadcrumbContainer).toBeVisible();
  }

  async isBreadcrumbVisible(): Promise<boolean> {
    try {
      await expect(this.breadcrumbContainer).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }

  async getBreadcrumbItemsCount(): Promise<number> {
    return await this.breadcrumbItems.count();
  }

  // Navigation Methods
  async clickHomeLink(): Promise<void> {
    await this.homeLink.click();
  }

  async clickParentLink(linkText: string): Promise<void> {
    await this.parentLinks.filter({ hasText: linkText }).click();
  }

  async clickParentLinkByIndex(index: number): Promise<void> {
    await this.parentLinks.nth(index).click();
  }

  async clickEllipsis(): Promise<void> {
    await this.ellipsisButton.click();
  }

  // Content Validation Methods
  async getHomeText(): Promise<string> {
    return (await this.homeLink.textContent()) || '';
  }

  async getCurrentPageText(): Promise<string> {
    return (await this.currentPageText.textContent()) || '';
  }

  async getParentLinkTexts(): Promise<string[]> {
    const links = await this.parentLinks.all();
    const texts: string[] = [];
    for (const link of links) {
      const text = await link.textContent();
      if (text) texts.push(text);
    }
    return texts;
  }

  async getAllBreadcrumbTexts(): Promise<string[]> {
    const items = await this.breadcrumbItems.all();
    const texts: string[] = [];
    for (const item of items) {
      const text = await item.textContent();
      if (text) texts.push(text.trim());
    }
    return texts;
  }

  // State Validation Methods
  async isEllipsisVisible(): Promise<boolean> {
    try {
      await expect(this.ellipsisButton).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }

  async isCurrentPageNonClickable(): Promise<boolean> {
    const tabIndex = await this.currentPageText.getAttribute('tabindex');
    return tabIndex === '-1' || tabIndex === null;
  }

  async areHiddenItemsVisible(): Promise<boolean> {
    try {
      await expect(this.hiddenItems).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }

  // Accessibility Methods
  async focusHomeLink(): Promise<void> {
    await this.homeLink.focus();
  }

  async focusParentLink(index: number): Promise<void> {
    await this.parentLinks.nth(index).focus();
  }

  async isFocused(element: ElementType, index?: number): Promise<boolean> {
    let targetElement: Locator;
    
    switch (element) {
      case 'home':
        targetElement = this.homeLink;
        break;
      case 'parent':
        if (index === undefined) throw new Error('Index required for parent element');
        targetElement = this.parentLinks.nth(index);
        break;
      case 'current':
        targetElement = this.currentPageText;
        break;
    }
    
    try {
      await expect(targetElement).toBeFocused();
      return true;
    } catch {
      return false;
    }
  }

  async getAriaLabel(element: ElementType, index?: number): Promise<string> {
    let targetElement: Locator;
    
    switch (element) {
      case 'home':
        targetElement = this.homeLink;
        break;
      case 'parent':
        if (index === undefined) throw new Error('Index required for parent element');
        targetElement = this.parentLinks.nth(index);
        break;
      case 'current':
        targetElement = this.currentPageText;
        break;
    }
    
    return await targetElement.getAttribute('aria-label') || '';
  }

  // Performance Methods
  async measureLoadTime(): Promise<number> {
    const startTime = Date.now();
    await this.waitForBreadcrumbToLoad();
    return Date.now() - startTime;
  }

  // Validation Methods for Expected Breadcrumb Paths
  async validateBreadcrumbPath(expectedPath: string[]): Promise<boolean> {
    const actualTexts = await this.getAllBreadcrumbTexts();
    
    if (actualTexts.length !== expectedPath.length) {
      return false;
    }
    
    return expectedPath.every((expected, index) => 
      actualTexts[index].toLowerCase().includes(expected.toLowerCase())
    );
  }

  async validateHomeNavigation(): Promise<void> {
    await this.clickHomeLink();
    await this.page.waitForURL('**/');
  }

  async validateParentNavigation(parentText: string, expectedUrl: string): Promise<void> {
    await this.clickParentLink(parentText);
    await this.page.waitForURL(`**/${expectedUrl}`);
  }

  // Responsive Methods
  async getContainerWidth(): Promise<number> {
    const boundingBox = await this.breadcrumbContainer.boundingBox();
    return boundingBox?.width || 0;
  }

  async checkResponsiveBehavior(viewport: { width: number; height: number }): Promise<boolean> {
    await this.page.setViewportSize(viewport);
    await this.waitForBreadcrumbToLoad();
    
    // Check if ellipsis appears in smaller viewports (typical responsive behavior)
    if (viewport.width < 768) {
      return await this.isEllipsisVisible();
    } else {
      return !(await this.isEllipsisVisible());
    }
  }

  // Font and Styling Methods
  async getElementStyles(element: ElementType, index?: number): Promise<ElementStyles> {
    let targetElement: Locator;
    
    switch (element) {
      case 'home':
        targetElement = this.homeLink;
        break;
      case 'parent':
        if (index === undefined) throw new Error('Index required for parent element');
        targetElement = this.parentLinks.nth(index);
        break;
      case 'current':
        targetElement = this.currentPageText;
        break;
    }
    
    return await targetElement.evaluate((el) => {
      const styles = globalThis.getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        color: styles.color,
        textDecoration: styles.textDecoration,
      };
    });
  }

  async validateFontSizes(): Promise<boolean> {
    try {
      const homeStyles = await this.getElementStyles('home');
      const currentStyles = await this.getElementStyles('current');
      
      // Validate font sizes are not zero or undefined
      const homeFontSize = Number.parseFloat(homeStyles.fontSize);
      const currentFontSize = Number.parseFloat(currentStyles.fontSize);
      
      return homeFontSize > 0 && currentFontSize > 0;
    } catch {
      return false;
    }
  }

  async validateFontFamily(): Promise<boolean> {
    try {
      const homeStyles = await this.getElementStyles('home');
      const currentStyles = await this.getElementStyles('current');
      
      // Check that font family is defined and not empty
      return homeStyles.fontFamily !== '' && currentStyles.fontFamily !== '';
    } catch {
      return false;
    }
  }

  async validateLineHeight(): Promise<boolean> {
    try {
      const homeStyles = await this.getElementStyles('home');
      const currentStyles = await this.getElementStyles('current');
      
      // Validate line height is set
      return homeStyles.lineHeight !== 'normal' && currentStyles.lineHeight !== 'normal';
    } catch {
      return false;
    }
  }

  async validateColorContrast(): Promise<boolean> {
    try {
      const homeStyles = await this.getElementStyles('home');
      const currentStyles = await this.getElementStyles('current');
      
      // Validate colors are not transparent
      return homeStyles.color !== 'rgba(0, 0, 0, 0)' && 
             currentStyles.color !== 'rgba(0, 0, 0, 0)';
    } catch {
      return false;
    }
  }

  // Structure Validation Methods (Content-agnostic)
  async validateBreadcrumbStructure(): Promise<boolean> {
    try {
      // Check minimum structure: at least one item should be present
      const itemsCount = await this.getBreadcrumbItemsCount();
      if (itemsCount === 0) return false;

      // Verify home link exists (first item should always be home)
      const homeExists = await this.homeLink.count() > 0;
      if (!homeExists) return false;

      // Verify current page has aria-current attribute
      const currentPageHasAria = await this.currentPageText.count() > 0;
      
      return currentPageHasAria;
    } catch {
      return false;
    }
  }

  async validateBreadcrumbHierarchy(): Promise<boolean> {
    try {
      // First check if breadcrumb is compressed with ellipsis
      const isEllipsisVisible = await this.isEllipsisVisible();
      if (isEllipsisVisible) {
        // For compressed breadcrumbs, just validate that at least 1 item exists
        const itemsCount = await this.getBreadcrumbItemsCount();
        return itemsCount >= 1;
      }
      
      const allTexts = await this.getAllBreadcrumbTexts();
      
      // For non-compressed breadcrumbs, check that we have at least 1 item (could be just current page)
      if (allTexts.length < 1) return false;
      
      // Check that no items are empty
      return allTexts.every(text => text.trim().length > 0);
    } catch {
      return false;
    }
  }

  async getNavigationUrls(): Promise<string[]> {
    const links = await this.homeLink.count() > 0 ? 
      [this.homeLink, ...await this.parentLinks.all()] : 
      await this.parentLinks.all();
    
    const urls: string[] = [];
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href) urls.push(href);
    }
    return urls;
  }

  // Helper Methods for Complex Scenarios
  async expandCollapsedItems(): Promise<void> {
    if (await this.isEllipsisVisible()) {
      await this.clickEllipsis();
      await expect(this.hiddenItems).toBeVisible();
    }
  }

  async validateKeyboardNavigation(): Promise<boolean> {
    try {
      // Focus home link
      await this.focusHomeLink();
      if (!(await this.isFocused('home'))) return false;

      // Tab to next focusable element
      await this.page.keyboard.press('Tab');
      
      // Check if parent link is focused (if it exists)
      const parentCount = await this.parentLinks.count();
      if (parentCount > 0) {
        return await this.isFocused('parent', 0);
      }
      
      return true;
    } catch {
      return false;
    }
  }

  async validateAriaAttributes(): Promise<boolean> {
    try {
      // Check aria-current on current page
      const ariaCurrent = await this.currentPageText.getAttribute('aria-current');
      if (ariaCurrent !== 'page') return false;

      // Check that links have appropriate roles
      const homeRole = await this.homeLink.getAttribute('role');
      if (homeRole && homeRole !== 'link') return false;

      return true;
    } catch {
      return false;
    }
  }
}
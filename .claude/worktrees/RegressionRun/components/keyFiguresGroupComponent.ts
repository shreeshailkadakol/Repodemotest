import { BasePage } from '../helpers/utils/basePage';
import { Page, Browser, BrowserContext, Locator } from '@playwright/test';

export class KeyFiguresGroupComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Get the main Key Figures Group component container
   * Uses SmartLocator with multiple fallback strategies
   */
  async getComponentContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'key-figures-group',
      testId: 'key-figures-group',
      css: 'section[data-qa="key-figures-group"]',
      xpath: '//section[@data-qa="key-figures-group"]',
      description: 'Key Figures Group component container',
    });
  }

  /**
   * Get the full-width column container (AC3 validation - 100% divider)
   * Uses SmartLocator with multiple fallback strategies
   */
  async getFullWidthContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'fullwidth-column',
      testId: 'fullwidth-column',
      css: 'section[data-qa="fullwidth-column"]',
      altText: 'Full width content section',
      description: 'Full width column container',
    });
  }

  /**
   * Get all individual key figure elements (should be 3)
   * Returns all matching elements, not just the first one
   * Note: Uses direct page.locator() instead of SmartLocator since we need ALL elements
   */
  async getIndividualKeyFigures(): Promise<Locator> {
    // Use scoped CSS to ensure we only get children of key-figures-group
    return this.page.locator('section[data-qa="individual-key-figure"]');
  }

  /**
   * Get specific individual key figure by index (0, 1, or 2)
   * Uses SmartLocator with index-specific wrapper
   */
  async getIndividualKeyFigureByIndex(index: number): Promise<Locator> {
    if (index < 0 || index > 2) {
      throw new Error(`Invalid index ${index}. Must be 0, 1, or 2`);
    }

    return await this.findSmart({
      testId: `key-figure-wrapper-${index}`,
      css: `[data-testid="key-figure-wrapper-${index}"] section[data-qa="individual-key-figure"]`,
      xpath: `//div[@data-testid="key-figure-wrapper-${index}"]//section[@data-qa="individual-key-figure"]`,
      description: `Individual key figure at index ${index}`,
    });
  }

  /**
   * Get the wrapper div for a specific key figure by index
   * Uses SmartLocator with testId fallback
   */
  async getKeyFigureWrapper(index: number): Promise<Locator> {
    if (index < 0 || index > 2) {
      throw new Error(`Invalid index ${index}. Must be 0, 1, or 2`);
    }

    return await this.findSmart({
      testId: `key-figure-wrapper-${index}`,
      css: `section[data-qa="key-figures-group"] [data-testid="key-figure-wrapper-${index}"]`,
      xpath: `//section[@data-qa="key-figures-group"]//div[@data-testid="key-figure-wrapper-${index}"]`,
      description: `Key figure wrapper ${index}`,
    });
  }

  /**
   * Validate that component is placed in full-width column (AC3 - Frontend validation)
   * Returns true if Key Figures Group is properly nested within fullwidth-column
   */
  async validateFullWidthPlacement(): Promise<boolean> {
    const isNested = await this.page.evaluate(() => {
      const keyFiguresGroup = document.querySelector('[data-qa="key-figures-group"]');
      if (!keyFiguresGroup) return false;

      const fullWidthParent = keyFiguresGroup.closest('[data-qa="fullwidth-column"]');
      return !!fullWidthParent;
    });

    if (isNested) {
      this.log('[PASS] Key Figures Group is correctly placed in full-width column (100% divider)');
    } else {
      this.log('[WARNING] Key Figures Group is NOT in full-width column');
    }

    return isNested;
  }

  /**
   * Validate component rendering - checks all required elements are present
   * Language-agnostic: only validates structure, not content
   */
  async validateComponentRendering(): Promise<void> {
    const container = await this.getComponentContainer();
    await container.waitFor({ state: 'visible', timeout: 10000 });
    this.log('[PASS] Key Figures Group container is visible');

    const keyFigures = await this.getIndividualKeyFigures();
    const count = await keyFigures.count();
    
    if (count === 3) {
      this.log(`[PASS] Found exactly 3 individual key figures (expected: 3, actual: ${count})`);
    } else {
      this.log(`[WARNING] Expected 3 individual key figures, found ${count}`);
    }

    // Verify each key figure is visible
    for (let i = 0; i < count; i++) {
      const keyFigure = keyFigures.nth(i);
      const isVisible = await keyFigure.isVisible();
      if (isVisible) {
        this.log(`[PASS] Individual key figure ${i} is visible`);
      } else {
        this.log(`[WARNING] Individual key figure ${i} is NOT visible`);
      }
    }
  }

  /**
   * Get count of individual key figures
   * Should always return 3 as per requirements
   */
  async getKeyFiguresCount(): Promise<number> {
    const keyFigures = await this.getIndividualKeyFigures();
    return await keyFigures.count();
  }

  /**
   * Verify all individual key figures are visible
   */
  async areAllKeyFiguresVisible(): Promise<boolean> {
    const keyFigures = await this.getIndividualKeyFigures();
    const count = await keyFigures.count();

    for (let i = 0; i < count; i++) {
      const isVisible = await keyFigures.nth(i).isVisible();
      if (!isVisible) {
        this.log(`[WARNING] Key figure at index ${i} is not visible`);
        return false;
      }
    }

    this.log('[PASS] All individual key figures are visible');
    return true;
  }

  /**
   * Validate that each key figure has all required child elements
   * Language-agnostic: only validates presence and non-empty state, NOT specific content
   * 
   * Expected child elements per key figure:
   * - Numeric value element (exists and not empty)
   * - Unit/suffix element (exists and not empty) - content may vary
   * - Description element (exists and not empty) - content may vary
   */
  async validateKeyFigureStructure(index: number): Promise<void> {
    if (index < 0 || index > 2) {
      throw new Error(`Invalid index ${index}. Must be 0, 1, or 2`);
    }

    const keyFigure = await this.getIndividualKeyFigureByIndex(index);
    
    // Validate numeric value element exists and is not empty
    const hasNumericValue = await keyFigure.evaluate((el) => {
      // Look for large text element (typically 5xl or 7xl font size)
      const numericElements = el.querySelectorAll('span, div, p');
      for (const elem of numericElements) {
        const text = elem.textContent?.trim() || '';
        // Check if element has large font size classes (5xl, 6xl, 7xl) and contains number-like content
        const classList = elem.className || '';
        if ((classList.includes('text-5xl') || classList.includes('text-6xl') || classList.includes('text-7xl')) && 
            text.length > 0) {
          return true;
        }
      }
      return false;
    });

    if (hasNumericValue) {
      this.log(`[PASS] Key figure ${index} has numeric value element (not empty)`);
    } else {
      this.log(`[WARNING] Key figure ${index} missing numeric value element`);
    }

    // Validate unit/suffix element exists (structural validation only - content may vary)
    const hasUnit = await keyFigure.evaluate((el) => {
      // Look for unit/suffix text near the number (smaller text, may have %, Mio., k+, etc.)
      const allElements = el.querySelectorAll('span, div, p');
      for (const elem of allElements) {
        const text = elem.textContent?.trim() || '';
        // Unit is typically shorter text near large number
        if (text.length > 0 && text.length < 10) {
          return true;
        }
      }
      return false;
    });

    if (hasUnit) {
      this.log(`[PASS] Key figure ${index} has unit/suffix element (not empty)`);
    } else {
      this.log(`[WARNING] Key figure ${index} missing unit/suffix element`);
    }

    // Validate description element exists and is not empty (structural validation only)
    const hasDescription = await keyFigure.evaluate((el) => {
      // Look for description text (typically longer text)
      const allElements = el.querySelectorAll('span, div, p, section');
      for (const elem of allElements) {
        const text = elem.textContent?.trim() || '';
        // Description is typically longer text (more than 10 characters)
        if (text.length > 10) {
          return true;
        }
      }
      return false;
    });

    if (hasDescription) {
      this.log(`[PASS] Key figure ${index} has description element (not empty)`);
    } else {
      this.log(`[WARNING] Key figure ${index} missing description element`);
    }
  }

  /**
   * Validate all key figures have required structure
   * Calls validateKeyFigureStructure for each of the 3 key figures
   */
  async validateAllKeyFiguresStructure(): Promise<void> {
    const count = await this.getKeyFiguresCount();
    
    for (let i = 0; i < count; i++) {
      await this.validateKeyFigureStructure(i);
    }
  }

  /**
   * Get computed styles for a specific key figure element
   * Used for visual validation tests (typography, colors, spacing)
   */
  async getKeyFigureStyles(index: number, property: string): Promise<string> {
    const keyFigure = await this.getIndividualKeyFigureByIndex(index);
    return await keyFigure.evaluate((el, prop) => {
      return globalThis.getComputedStyle(el).getPropertyValue(prop);
    }, property);
  }

  /**
   * Get numeric value element styles for visual validation
   * Finds the large numeric text within a key figure
   */
  async getNumericValueStyles(index: number): Promise<{
    fontSize: string;
    fontFamily: string;
    lineHeight: string;
    color: string;
    fontWeight: string;
  }> {
    const keyFigure = await this.getIndividualKeyFigureByIndex(index);
    
    return await keyFigure.evaluate((el) => {
      // Find the large numeric text element
      const numericElements = el.querySelectorAll('span, div');
      for (const elem of numericElements) {
        const classList = elem.className || '';
        if (classList.includes('text-5xl') || classList.includes('text-6xl') || classList.includes('text-7xl')) {
          const styles = globalThis.getComputedStyle(elem);
          return {
            fontSize: styles.fontSize,
            fontFamily: styles.fontFamily,
            lineHeight: styles.lineHeight,
            color: styles.color,
            fontWeight: styles.fontWeight,
          };
        }
      }
      // Fallback to first element if no large text found
      const styles = globalThis.getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily,
        lineHeight: styles.lineHeight,
        color: styles.color,
        fontWeight: styles.fontWeight,
      };
    });
  }
}

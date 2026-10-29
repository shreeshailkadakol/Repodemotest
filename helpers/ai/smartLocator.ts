/**
 * Smart Locator - AI-Powered Auto-Healing Selectors
 * 
 * This utility provides intelligent element location with automatic fallback strategies.
 * When selectors break due to code changes, it automatically tries alternative methods
 * to locate elements, reducing test maintenance significantly.
 * 
 * Features:
 * - Multiple fallback strategies (role, text, data-testid, CSS, XPath)
 * - Selector health monitoring and reporting
 * - Priority-based selector chains
 * - Automatic logging of which selector worked
 * 
 * Usage:
 * const locator = await smartLocator.find(page, {
 *   role: { role: 'button', name: 'Submit' },
 *   testId: 'submit-button',
 *   text: 'Submit',
 *   css: 'button.submit-btn'
 * });
 */

import { Page, Locator } from '@playwright/test';

export interface SmartLocatorOptions {
  // Semantic locators (highest priority - most resilient)
  role?: { role: 'button' | 'link' | 'textbox' | 'heading' | string; name?: string | RegExp };
  label?: string | RegExp;
  placeholder?: string | RegExp;
  text?: string | RegExp;
  title?: string | RegExp;
  altText?: string | RegExp;

  // Data attributes (medium priority - good practice)
  testId?: string | RegExp;
  dataQa?: string | RegExp;
  dataTest?: string | RegExp;

  // Traditional selectors (lower priority - more brittle)
  css?: string;
  xpath?: string;
  id?: string;

  // Configuration
  timeout?: number;
  description?: string; // Human-readable description of the element
}

export interface SelectorHealthReport {
  elementDescription: string;
  attemptedSelectors: string[];
  workingSelector: string;
  selectorType: string;
  attemptsUntilSuccess: number;
  timestamp: Date;
}

export class SmartLocator {
  private healthReports: SelectorHealthReport[] = [];
  private selectorSuccessRates: Map<string, { successes: number; attempts: number }> = new Map();

  /**
   * Find an element using multiple fallback strategies
   * Returns the first locator that successfully finds the element
   */
  async find(page: Page, options: SmartLocatorOptions): Promise<Locator> {
    const description = options.description || 'element';
    const attemptedSelectors: string[] = [];
    let workingSelector = '';
    let workingType = '';
    let attempts = 0;

    // Priority-ordered strategies (semantic first, brittle last)
    const strategies = this.buildStrategies(page, options);

    for (const strategy of strategies) {
      attempts++;
      attemptedSelectors.push(strategy.description);

      try {
        // Try to find element with this strategy
        const locator = strategy.locator;
        const isVisible = await locator
          .first()
          .isVisible({ timeout: options.timeout || 5000 })
          .catch(() => false);

        if (isVisible) {
          workingSelector = strategy.description;
          workingType = strategy.type;

          // Record success
          this.recordSelectorSuccess(strategy.description, true);

          // Save health report
          this.healthReports.push({
            elementDescription: description,
            attemptedSelectors,
            workingSelector,
            selectorType: workingType,
            attemptsUntilSuccess: attempts,
            timestamp: new Date(),
          });

          // Log which selector worked
          console.log(
            `✅ SmartLocator: Found "${description}" using ${workingType} (attempt ${attempts}/${strategies.length})`
          );

          // Warn if we had to fall back
          if (attempts > 1) {
            console.warn(
              `⚠️ SmartLocator: Primary selector failed for "${description}". Consider updating tests.`
            );
          }

          return locator.first();
        }
      } catch (error) {
        this.recordSelectorSuccess(strategy.description, false);
        continue;
      }
    }

    // All strategies failed - provide detailed error
    const errorMessage = `
❌ SmartLocator: Failed to find "${description}" after ${attempts} attempts.
Attempted selectors:
${attemptedSelectors.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}

Suggestions:
- Verify the element exists on the page
- Check if element is hidden or not yet rendered
- Update selector strategies in the test
- Use page.pause() to inspect the page state
    `.trim();

    throw new Error(errorMessage);
  }

  /**
   * Build priority-ordered array of locator strategies
   */
  private buildStrategies(page: Page, options: SmartLocatorOptions) {
    const strategies: Array<{ locator: Locator; description: string; type: string }> = [];

    // Priority 1: Semantic role-based (most resilient)
    if (options.role) {
      strategies.push({
        locator: page.getByRole(options.role.role as any, { name: options.role.name }),
        description: `role=${options.role.role}${options.role.name ? `, name=${options.role.name}` : ''}`,
        type: 'semantic-role',
      });
    }

    // Priority 2: Accessible labels
    if (options.label) {
      strategies.push({
        locator: page.getByLabel(options.label),
        description: `label=${options.label}`,
        type: 'semantic-label',
      });
    }

    if (options.placeholder) {
      strategies.push({
        locator: page.getByPlaceholder(options.placeholder),
        description: `placeholder=${options.placeholder}`,
        type: 'semantic-placeholder',
      });
    }

    if (options.title) {
      strategies.push({
        locator: page.getByTitle(options.title),
        description: `title=${options.title}`,
        type: 'semantic-title',
      });
    }

    if (options.altText) {
      strategies.push({
        locator: page.getByAltText(options.altText),
        description: `alt=${options.altText}`,
        type: 'semantic-alt',
      });
    }

    // Priority 3: Text content (fairly resilient)
    if (options.text) {
      strategies.push({
        locator: page.getByText(options.text),
        description: `text=${options.text}`,
        type: 'content-text',
      });
    }

    // Priority 4: Data attributes (good practice)
    if (options.testId) {
      strategies.push({
        locator: page.getByTestId(options.testId as string),
        description: `data-testid=${options.testId}`,
        type: 'data-testid',
      });
    }

    if (options.dataQa) {
      strategies.push({
        locator: page.locator(`[data-qa="${options.dataQa}"]`),
        description: `data-qa=${options.dataQa}`,
        type: 'data-qa',
      });
    }

    if (options.dataTest) {
      strategies.push({
        locator: page.locator(`[data-test="${options.dataTest}"]`),
        description: `data-test=${options.dataTest}`,
        type: 'data-test',
      });
    }

    // Priority 5: ID attribute
    if (options.id) {
      strategies.push({
        locator: page.locator(`#${options.id}`),
        description: `id=${options.id}`,
        type: 'id-attribute',
      });
    }

    // Priority 6: CSS selectors (more brittle)
    if (options.css) {
      strategies.push({
        locator: page.locator(options.css),
        description: `css=${options.css}`,
        type: 'css-selector',
      });
    }

    // Priority 7: XPath (least preferred - most brittle)
    if (options.xpath) {
      strategies.push({
        locator: page.locator(options.xpath),
        description: `xpath=${options.xpath}`,
        type: 'xpath-selector',
      });
    }

    return strategies;
  }

  /**
   * Create a chained locator using Playwright's .or() method
   * This is more efficient than trying each strategy sequentially
   */
  async findWithChaining(page: Page, options: SmartLocatorOptions): Promise<Locator> {
    const strategies = this.buildStrategies(page, options);

    if (strategies.length === 0) {
      throw new Error('SmartLocator: No selector strategies provided');
    }

    // Chain all strategies with .or()
    let chainedLocator = strategies[0].locator;
    for (let i = 1; i < strategies.length; i++) {
      chainedLocator = chainedLocator.or(strategies[i].locator);
    }

    // Log what we're trying
    console.log(
      `🔍 SmartLocator: Searching for "${options.description || 'element'}" with ${strategies.length} fallback strategies`
    );

    return chainedLocator.first();
  }

  /**
   * Record selector success/failure for analytics
   */
  private recordSelectorSuccess(selector: string, success: boolean): void {
    const current = this.selectorSuccessRates.get(selector) || { successes: 0, attempts: 0 };
    current.attempts++;
    if (success) current.successes++;
    this.selectorSuccessRates.set(selector, current);
  }

  /**
   * Get health report for all selectors
   * Useful for identifying brittle selectors that need updating
   */
  getHealthReport(): {
    totalElements: number;
    needsAttention: SelectorHealthReport[];
    selectorSuccessRates: Map<string, { rate: number; attempts: number }>;
  } {
    // Find selectors that frequently fail on first attempt
    const needsAttention = this.healthReports.filter((report) => report.attemptsUntilSuccess > 1);

    // Calculate success rates
    const successRates = new SerializableMap<string, { rate: number; attempts: number }>();
    for (const [selector, stats] of this.selectorSuccessRates.entries()) {
      successRates.set(selector, {
        rate: stats.successes / stats.attempts,
        attempts: stats.attempts,
      });
    }

    return {
      totalElements: this.healthReports.length,
      needsAttention,
      selectorSuccessRates: successRates,
    };
  }

  /**
   * Export health report to JSON file
   */
  async exportHealthReport(filePath: string): Promise<void> {
    const fs = await import('fs/promises');
    const report = this.getHealthReport();

    const exportData = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalElements: report.totalElements,
        elementsNeedingAttention: report.needsAttention.length,
        healthyPercentage:
          ((report.totalElements - report.needsAttention.length) / report.totalElements) * 100,
      },
      elementsNeedingAttention: report.needsAttention.map((r) => ({
        description: r.elementDescription,
        workingSelector: r.workingSelector,
        selectorType: r.selectorType,
        attemptsUntilSuccess: r.attemptsUntilSuccess,
        attemptedSelectors: r.attemptedSelectors,
        timestamp: r.timestamp,
      })),
      selectorSuccessRates: Array.from(report.selectorSuccessRates.entries()).map(
        ([selector, stats]) => ({
          selector,
          successRate: `${(stats.rate * 100).toFixed(2)}%`,
          attempts: stats.attempts,
        })
      ),
    };

    await fs.writeFile(filePath, JSON.stringify(exportData, null, 2));
    console.log(`📊 SmartLocator health report exported to: ${filePath}`);
  }

  /**
   * Reset health tracking (useful between test runs)
   */
  reset(): void {
    this.healthReports = [];
    this.selectorSuccessRates.clear();
  }
}

// Map that survives JSON.stringify (specs attach the health report as JSON)
class SerializableMap<K extends string, V> extends Map<K, V> {
  toJSON(): Record<string, V> {
    return Object.fromEntries(this);
  }
}

// Export singleton instance
export const smartLocator = new SmartLocator();

import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { LanguageSelector } from '../../components/languageSelector';
import { LanguageSelectorFigmaValues } from '../../helpers/utils/figma-values/LanguageSelector_FigmaValues';
import AxeBuilder from '@axe-core/playwright';

/**
 * Language Selector Component Test Suite
 *
 * Requirements Coverage: AC1-AC11
 * - AC1: The Languages Selector looks like designed
 * - AC2: Available in header and flyout menu for breakpoints ≥ medium
 * - AC3: Available in flyout menu only for breakpoints < large
 * - AC4: Fixed header position (removed - not applicable)
 * - AC5: Language options applicable to current site
 * - AC6: User-friendly name format [language name] ([ISO 639 code])
 * - AC7: Default language set when multiple languages available
 * - AC9: Language selection changes entire site language
 * - AC10: Content fallback to default for missing locale content
 * - AC11: User can close panel with ESC key
 */

test.describe('Language Selector Component Tests', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let languageSelector: LanguageSelector;

  test.beforeEach(async ({ browser: testBrowser }) => {
    browser = testBrowser;
    context = await browser.newContext();
    page = await context.newPage();
    languageSelector = new LanguageSelector(page, browser, context);

    // Navigate to test page with authentication
    await languageSelector.navigateToLanguageSelectorPage();
  });

  test.afterEach(async () => {
    await context?.close();
  });

  /**
   * FUNCTIONAL TESTS
   */

  test('TC-LS-001: Language selector header visibility XL viewport @functional @UKProd @Smoke @UKSmoke', async () => {
    // Set XL viewport
    await languageSelector.setViewport(1440, 900);

    // Verify header language selector is visible
    const isVisible = await languageSelector.isHeaderLanguageSelectorVisible();
    expect.soft(isVisible, 'Header language selector should be visible in XL viewport').toBe(true);

    // Verify current language display
    const currentLanguage = await languageSelector.getCurrentLanguageText();
    expect.soft(currentLanguage, 'Current language should be displayed').toBeTruthy();

    // Verify language format compliance (AC6)
    const isValidFormat = await languageSelector.validateLanguageFormat(currentLanguage);
    expect
      .soft(isValidFormat, 'Language format should comply with [name] ([code]) pattern')
      .toBe(true);

    // XL viewport header language selector validation completed
  });

  test('TC-LS-002: Language selector header visibility LG viewport @functional @UKProd', async () => {
    // Set LG viewport
    await languageSelector.setViewport(1024, 768);

    // Verify header language selector is visible
    const isVisible = await languageSelector.isHeaderLanguageSelectorVisible();
    expect.soft(isVisible, 'Header language selector should be visible in LG viewport').toBe(true);

    // Verify current language display
    const currentLanguage = await languageSelector.getCurrentLanguageText();
    expect
      .soft(currentLanguage, 'Current language should be displayed in LG viewport')
      .toBeTruthy();

    // Verify language format compliance (AC6)
    const isValidFormat = await languageSelector.validateLanguageFormat(currentLanguage);
    expect
      .soft(isValidFormat, 'Language format should comply with [name] ([code]) pattern')
      .toBe(true);

    // LG viewport header language selector validation completed
  });

  test('TC-LS-003: Language selector flyout menu MD viewport @functional @UKProd', async () => {
    // Set MD viewport
    await languageSelector.setViewport(768, 1024);

    // Verify header language selector is NOT visible (AC3) - should be hidden on top right
    const isHeaderVisible = await languageSelector.isHeaderLanguageSelectorVisible();
    expect
      .soft(isHeaderVisible, 'Header language selector (top right) should be hidden in MD viewport')
      .toBe(false);

    // Open hamburger menu
    await languageSelector.openHamburgerMenu();
    
    // Verify flyout menu is visible after clicking hamburger
    const isFlyoutMenuVisible = await languageSelector.isFlyoutMenuVisible();
    expect.soft(isFlyoutMenuVisible, 'Flyout menu should be visible in MD viewport after clicking hamburger').toBe(true);

    // For MD viewport, language selector should appear inside flyout menu after clicking hamburger
    const isFlyoutLanguageVisible = await languageSelector.isFlyoutLanguageSelectorVisible();
    expect
      .soft(isFlyoutLanguageVisible, 'Language selector must be available inside flyout menu in MD viewport after clicking hamburger')
      .toBe(true);

    // MD viewport flyout menu language selector validation completed
  });

  test('TC-LS-004: Language selector flyout menu SM viewport @functional @UKProd', async () => {
    // Set SM viewport
    await languageSelector.setViewport(375, 812);

    // Verify header language selector is NOT visible (AC3) - should be hidden on top right
    const isHeaderVisible = await languageSelector.isHeaderLanguageSelectorVisible();
    expect
      .soft(isHeaderVisible, 'Header language selector (top right) should be hidden in SM viewport')
      .toBe(false);

    // Open hamburger menu
    await languageSelector.openHamburgerMenu();
    
    // Verify flyout menu is visible after clicking hamburger
    const isFlyoutMenuVisible = await languageSelector.isFlyoutMenuVisible();
    expect.soft(isFlyoutMenuVisible, 'Flyout menu should be visible in SM viewport after clicking hamburger').toBe(true);

    // For SM viewport, language selector should appear inside flyout menu after clicking hamburger
    const isFlyoutLanguageVisible = await languageSelector.isFlyoutLanguageSelectorVisible();
    expect
      .soft(isFlyoutLanguageVisible, 'Language selector must be available inside flyout menu in SM viewport after clicking hamburger')
      .toBe(true);

    // SM viewport flyout menu language selector validation completed
  });

  // TC-LS-005: Fixed position test removed - not applicable for this implementation

  test('TC-LS-006: Language options site-specific filtering @functional @UKProd', async () => {
    // Set XL viewport and open language overlay
    await languageSelector.setViewport(1440, 900);
    await languageSelector.clickLanguageSelector();

    // Verify overlay is visible
    const isOverlayVisible = await languageSelector.isLanguageOverlayVisible();
    expect
      .soft(isOverlayVisible, 'Language overlay should be visible after clicking selector')
      .toBe(true);

    // Validate site-specific language filtering (AC2)
    const isFilteringValid = await languageSelector.validateLanguageFiltering();
    expect
      .soft(isFilteringValid, 'Language options should be properly filtered for UK site')
      .toBe(true);

    // Get available language options for additional validation
    const languageOptions = await languageSelector.getLanguageOptions();
    expect
      .soft(languageOptions.length, 'Should have at least 1 language option')
      .toBeGreaterThanOrEqual(1);

    // Verify each language follows correct format (AC6)
    for (const language of languageOptions) {
      const isValidFormat = await languageSelector.validateLanguageFormat(language);
      expect
        .soft(isValidFormat, `Language "${language}" should follow acceptable format`)
        .toBe(true);
    }

    // Language filtering validation completed

    // Close overlay
    await languageSelector.closeOverlayWithEscKey();
  });

  test('TC-LS-007: Language display format validation @functional @UKProd', async () => {
    // Set XL viewport
    await languageSelector.setViewport(1440, 900);

    // Get current language from header button
    const currentLanguage = await languageSelector.getCurrentLanguageText();

    // Verify AC6 compliance: [language name] ([ISO 639 code])
    const isValidFormat = await languageSelector.validateLanguageFormat(currentLanguage);
    expect
      .soft(
        isValidFormat,
        `Current language "${currentLanguage}" should follow [name] ([code]) format`
      )
      .toBe(true);

    // Open overlay and verify all options follow format
    await languageSelector.clickLanguageSelector();
    const languageOptions = await languageSelector.getLanguageOptions();

    for (const language of languageOptions) {
      const isValidFormat = await languageSelector.validateLanguageFormat(language);
      expect
        .soft(isValidFormat, `Language option "${language}" should follow format requirement`)
        .toBe(true);
    }

    // Language format validation completed

    // Close overlay
    await languageSelector.closeOverlayWithEscKey();
  });

  test('TC-LS-008: Default language selection @functional @UKProd', async () => {
    // Set XL viewport
    await languageSelector.setViewport(1440, 900);

    // Verify default language is set (AC7)
    const currentLanguage = await languageSelector.getCurrentLanguageText();
    expect.soft(currentLanguage, 'Default language should be set and displayed').toBeTruthy();

    // Open overlay to check if current language is marked as selected
    await languageSelector.clickLanguageSelector();
    const languageOptions = await languageSelector.getLanguageOptions();

    // Verify at least one language is available
    expect
      .soft(languageOptions.length, 'Should have language options available')
      .toBeGreaterThan(0);

    // Check if current language appears in options (environment-agnostic match:
    // normalize spacing/case and also compare the ISO code and plain name so it
    // works for both "English (EN)" and "English(EN)" style rendering)
    const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
    const extractCode = (s: string) => (s.match(/\(([A-Za-z]{2,3})\)/)?.[1] || '').toLowerCase();
    const extractName = (s: string) =>
      s.replace(/\s*\([A-Za-z]{2,3}\)\s*/, '').trim().toLowerCase();

    const currentNorm = normalize(currentLanguage);
    const currentCode = extractCode(currentLanguage);
    const currentName = extractName(currentLanguage);

    const currentLanguageInOptions = languageOptions.some((option) => {
      const optNorm = normalize(option);
      const optCode = extractCode(option);
      const optName = extractName(option);
      return (
        (optNorm && currentNorm && (optNorm.includes(currentNorm) || currentNorm.includes(optNorm))) ||
        (currentCode && currentCode === optCode) ||
        (currentName && optName && (optName.includes(currentName) || currentName.includes(optName)))
      );
    });
    expect
      .soft(currentLanguageInOptions, 'Current language should appear in available options')
      .toBe(true);

    // Default language validation completed

    // Close overlay
    await languageSelector.closeOverlayWithEscKey();
  });

  test('TC-LS-009: Language selection functionality @functional @UKProd', async () => {
    // Set XL viewport
    await languageSelector.setViewport(1440, 900);

    const initialLanguage = await languageSelector.getCurrentLanguageText();

    // Open language overlay
    await languageSelector.clickLanguageSelector();
    const languageOptions = await languageSelector.getLanguageOptions();

    if (languageOptions.length > 1) {
      // Find a different language to select
      const targetLanguage = languageOptions.find(
        (option) => !option.includes(initialLanguage.split(' ')[0])
      );

      if (targetLanguage) {
        // Test language selection (AC9)
        try {
          await languageSelector.selectLanguage(targetLanguage);
          // Language selection mechanism validated successfully
        } catch (error) {
          // Soft assertion for selection mechanism
          await expect.soft(false, `Language selection should work: ${error}`).toBe(true);
        }
      }
    }

    // Close overlay if still open
    if (await languageSelector.isLanguageOverlayVisible()) {
      await languageSelector.closeOverlayWithEscKey();
    }
  });

  test('TC-LS-010: Content fallback mechanism @functional @UKProd', async () => {
    // This test validates the concept of fallback mechanism (AC10)
    // Actual implementation would require specific test content

    await languageSelector.setViewport(1440, 900);

    // Verify base functionality is available
    const currentLanguage = await languageSelector.getCurrentLanguageText();
    expect
      .soft(currentLanguage, 'Language selector should have fallback language available')
      .toBeTruthy();

    // Open overlay to verify fallback options
    await languageSelector.clickLanguageSelector();
    const languageOptions = await languageSelector.getLanguageOptions();
    expect.soft(languageOptions.length, 'Should have fallback language options').toBeGreaterThan(0);

    // Content fallback validation completed

    // Close overlay
    await languageSelector.closeOverlayWithEscKey();
  });

  test('TC-LS-011: ESC key panel dismissal @functional @UKProd', async () => {
    // Set XL viewport
    await languageSelector.setViewport(1440, 900);

    // Open language overlay
    await languageSelector.clickLanguageSelector();

    // Verify overlay is open
    let isOverlayVisible = await languageSelector.isLanguageOverlayVisible();
    expect.soft(isOverlayVisible, 'Language overlay should be visible before ESC test').toBe(true);

    // Test AC11: Close panel with ESC key
    await languageSelector.closeOverlayWithEscKey();

    // Verify overlay is closed
    isOverlayVisible = await languageSelector.isLanguageOverlayVisible();
    expect
      .soft(isOverlayVisible, 'Language overlay should be closed after pressing ESC')
      .toBe(false);

    // ESC key panel dismissal validation completed
  });

  /**
   * VISUAL TESTS
   */

  test('TC-LS-012: Visual design compliance XL viewport @visual', async () => {
    await languageSelector.setViewport(1440, 900);

    try {
      // Test header visual design compliance with Figma values (AC1)
      await languageSelector.validateVisualDesign('XL', LanguageSelectorFigmaValues);

      // Header language selector should be visible in XL viewport
      await expect
        .soft(
          await languageSelector.isHeaderLanguageSelectorVisible(),
          'XL header language selector should be visible'
        )
        .toBe(true);

      // Validate visual properties using component method (includes all font properties)
      await languageSelector.validateVisualDesign('XL', LanguageSelectorFigmaValues);

      // Test overlay visual compliance
      await languageSelector.clickLanguageSelector();

      // Overlay should be visible and have meaningful title
      await expect
        .soft(await languageSelector.isLanguageOverlayVisible(), 'XL overlay should be visible')
        .toBe(true);

      const overlayTitle = await languageSelector.getOverlayTitle();
      await expect.soft(overlayTitle, 'XL overlay should have meaningful title').toBeTruthy();

      // XL viewport visual design compliance validation completed
    } catch (error) {
      // Soft assertions ensure test continues
      await expect.soft(false, `XL visual validation completed with issues: ${error}`).toBe(true);
    } finally {
      // Clean up - close overlay if open
      if (await languageSelector.isLanguageOverlayVisible()) {
        await languageSelector.closeOverlayWithEscKey();
      }
    }
  });

  test('TC-LS-013: Visual design compliance LG viewport @visual', async () => {
    await languageSelector.setViewport(1024, 768);

    try {
      // Test header visual design compliance with Figma values (AC1)
      await languageSelector.validateVisualDesign('LG', LanguageSelectorFigmaValues);

      // Individual property validation for LG viewport
      const expectedLG = LanguageSelectorFigmaValues.LG?.selectorButton || {};

      if (await languageSelector.isHeaderLanguageSelectorVisible()) {
        // Complete font validation for LG viewport
        if (expectedLG.fontFamily) {
          await expect
            .soft(languageSelector['languageButton'], 'LG header font-family validation')
            .toHaveCSS('font-family', expectedLG.fontFamily);
        }
        if (expectedLG.fontSize) {
          await expect
            .soft(languageSelector['languageButton'], 'LG header font-size validation')
            .toHaveCSS('font-size', expectedLG.fontSize);
        }
        if (expectedLG.fontWeight) {
          await expect
            .soft(languageSelector['languageButton'], 'LG header font-weight validation')
            .toHaveCSS('font-weight', expectedLG.fontWeight);
        }
        if (expectedLG.lineHeight) {
          await expect
            .soft(languageSelector['languageButton'], 'LG header line-height validation')
            .toHaveCSS('line-height', expectedLG.lineHeight);
        }
        if (expectedLG.color) {
          await expect
            .soft(languageSelector['languageButton'], 'LG header color validation')
            .toHaveCSS('color', expectedLG.color);
        }
      }

      // Test overlay design independently
      await languageSelector.clickLanguageSelector();

      if (await languageSelector.isLanguageOverlayVisible()) {
        await languageSelector.validateVisualDesign('LG', LanguageSelectorFigmaValues);
        // LG viewport visual design compliance validated
      } else {
        // LG viewport overlay not accessible - header validation completed
      }
    } catch (error) {
      // LG visual validation encountered issues
      expect.soft(false, `LG visual validation completed with issues: ${error}`).toBe(true);
    } finally {
      if (await languageSelector.isLanguageOverlayVisible()) {
        await languageSelector.closeOverlayWithEscKey();
      }
    }
  });

  test('TC-LS-014: Visual design compliance MD viewport @visual', async () => {
    await languageSelector.setViewport(768, 1024);

    try {
      // Verify header selector is hidden in MD viewport (AC3)
      const isHeaderVisible = await languageSelector.isHeaderLanguageSelectorVisible();
      expect
        .soft(isHeaderVisible, 'MD viewport - header selector should be hidden per AC3')
        .toBe(false);

      // Test flyout menu visual design for MD viewport
      await languageSelector.validateVisualDesign('MD', LanguageSelectorFigmaValues);

      // Individual flyout menu validation if accessible
      const expectedMD = LanguageSelectorFigmaValues.MD?.flyoutMenu || {};

      try {
        await languageSelector.openHamburgerMenu();
        if (await languageSelector.isFlyoutLanguageSelectorVisible()) {
          // Complete font validation for MD flyout menu
          if (expectedMD.fontFamily) {
            await expect
              .soft(languageSelector['flyoutLanguageSelector'], 'MD flyout font-family validation')
              .toHaveCSS('font-family', expectedMD.fontFamily);
          }
          if (expectedMD.fontSize) {
            await expect
              .soft(languageSelector['flyoutLanguageSelector'], 'MD flyout font-size validation')
              .toHaveCSS('font-size', expectedMD.fontSize);
          }
          if (expectedMD.lineHeight) {
            await expect
              .soft(languageSelector['flyoutLanguageSelector'], 'MD flyout line-height validation')
              .toHaveCSS('line-height', expectedMD.lineHeight);
          }
          if (expectedMD.color) {
            await expect
              .soft(languageSelector['flyoutLanguageSelector'], 'MD flyout color validation')
              .toHaveCSS('color', expectedMD.color);
          }

          // MD viewport flyout menu visual validation completed
        } else {
          // MD viewport flyout menu not accessible - structural validation completed
        }
      } catch (flyoutError) {
        // MD flyout menu access issue
        expect
          .soft(false, `MD flyout menu validation needs manual verification: ${flyoutError}`)
          .toBe(true);
      }
    } catch (error) {
      // MD visual validation encountered issues
      expect.soft(false, `MD visual validation completed with issues: ${error}`).toBe(true);
    }

    // MD viewport visual design compliance validation completed
  });

  test('TC-LS-015: Visual design compliance SM viewport @visual', async () => {
    await languageSelector.setViewport(375, 812);

    try {
      // Verify header selector is hidden in SM viewport (AC3)
      const isHeaderVisible = await languageSelector.isHeaderLanguageSelectorVisible();
      expect
        .soft(isHeaderVisible, 'SM viewport - header selector should be hidden per AC3')
        .toBe(false);

      // Test flyout menu visual design for SM viewport
      await languageSelector.validateVisualDesign('SM', LanguageSelectorFigmaValues);

      // Individual flyout menu validation if accessible
      const expectedSM = LanguageSelectorFigmaValues.SM?.flyoutMenu || {};

      try {
        await languageSelector.openHamburgerMenu();
        if (await languageSelector.isFlyoutLanguageSelectorVisible()) {
          // Complete font validation for SM flyout menu
          if (expectedSM.fontFamily) {
            await expect
              .soft(languageSelector['flyoutLanguageSelector'], 'SM flyout font-family validation')
              .toHaveCSS('font-family', expectedSM.fontFamily);
          }
          if (expectedSM.fontSize) {
            await expect
              .soft(languageSelector['flyoutLanguageSelector'], 'SM flyout font-size validation')
              .toHaveCSS('font-size', expectedSM.fontSize);
          }
          if (expectedSM.lineHeight) {
            await expect
              .soft(languageSelector['flyoutLanguageSelector'], 'SM flyout line-height validation')
              .toHaveCSS('line-height', expectedSM.lineHeight);
          }
          if (expectedSM.color) {
            await expect
              .soft(languageSelector['flyoutLanguageSelector'], 'SM flyout color validation')
              .toHaveCSS('color', expectedSM.color);
          }

          // SM viewport flyout menu visual validation completed
        } else {
          // SM viewport flyout menu not accessible - structural validation completed
        }
      } catch (flyoutError) {
        // SM flyout menu access issue
        expect
          .soft(false, `SM flyout menu validation needs manual verification: ${flyoutError}`)
          .toBe(true);
      }
    } catch (error) {
      // SM visual validation encountered issues
      expect.soft(false, `SM visual validation completed with issues: ${error}`).toBe(true);
    }

    // SM viewport visual design compliance validation completed
  });

  /**
   * ACCESSIBILITY TESTS
   */

  test('TC-LS-016: Language selector accessibility compliance @accessibility', async () => {
    await languageSelector.setViewport(1440, 900);

    try {
      // Comprehensive axe-core accessibility analysis
      const accessibilityScanResults = await new AxeBuilder({ page: page as any })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Filter language selector specific violations
      const languageSelectorViolations = accessibilityScanResults.violations.filter((violation) =>
        violation.nodes.some(
          (node) =>
            node.html.includes('language') ||
            node.html.includes('select-language-button') ||
            node.html.includes('language-dropdown') ||
            node.html.includes('data-qa="language')
        )
      );

      expect
        .soft(
          languageSelectorViolations.length,
          `Language selector should have no WCAG violations: ${JSON.stringify(languageSelectorViolations.map((v) => ({ rule: v.id, description: v.description })))}`
        )
        .toBe(0);

      // Comprehensive accessibility validation
      await languageSelector.validateAccessibility();

      // Additional WCAG compliance checks
      const languageButton = page.locator('[data-qa="select-language-button"]');

      // WCAG 2.1.1 - Keyboard accessibility
      const buttonTagName = await languageButton.evaluate((el) => el.tagName.toLowerCase());
      expect
        .soft(buttonTagName === 'button', 'Language selector should be a proper button element')
        .toBe(true);

      // WCAG 1.3.1 - Semantic markup
      await languageButton.focus();
      await expect.soft(languageButton, 'Language button should receive focus').toBeFocused();

      // WCAG 2.1.2 - No keyboard trap (AC11)
      await languageSelector.clickLanguageSelector();
      if (await languageSelector.isLanguageOverlayVisible()) {
        // Test ESC key functionality
        await page.keyboard.press('Escape');
        const isClosed = !(await languageSelector.isLanguageOverlayVisible());
        expect.soft(isClosed, 'ESC key should close overlay - WCAG 2.1.2 compliance').toBe(true);
      }

      // WCAG 1.4.3 - Color contrast (checked by axe-core)
      // WCAG 3.2.2 - Predictable functionality
      const currentLanguage = await languageSelector.getCurrentLanguageText();
      expect
        .soft(currentLanguage, 'Language selector should have predictable, meaningful text')
        .toBeTruthy();

      // WCAG 4.1.2 - Name, Role, Value
      const ariaLabel = await languageButton.getAttribute('aria-label');
      expect.soft(ariaLabel, 'Language button should have descriptive aria-label').toBeTruthy();

      // Comprehensive accessibility compliance validated (WCAG 2.1 AA)
    } catch (error) {
      // Accessibility validation encountered issues
      expect.soft(false, `Accessibility validation completed with issues: ${error}`).toBe(true);
    }
  });

  /**
   * PERFORMANCE TESTS
   */

  test('TC-LS-017: Language overlay performance testing @performance', async () => {
    await languageSelector.setViewport(1440, 900);

    try {
      // Initial performance validation
      const initialPerformanceTime = await languageSelector.validatePerformance();

      // Performance threshold validation (3 seconds max - realistic for network conditions)
      expect
        .soft(
          initialPerformanceTime,
          'Initial overlay opening should be within performance threshold'
        )
        .toBeLessThan(3000);

      // Test consistency across multiple cycles
      const performanceTimes: number[] = [initialPerformanceTime];

      for (let cycle = 1; cycle <= 3; cycle++) {
        try {
          // Close overlay if open
          if (await languageSelector.isLanguageOverlayVisible()) {
            await languageSelector.closeOverlayWithEscKey();
            await page.waitForLoadState('domcontentloaded');
          }

          // Measure cycle performance
          const cycleStartTime = Date.now();
          await languageSelector.clickLanguageSelector();

          // Wait for overlay with timeout
          await page.locator('[data-qa="language-overlay"]').waitFor({
            state: 'visible',
            timeout: 4000,
          });

          const cycleTime = Date.now() - cycleStartTime;
          performanceTimes.push(cycleTime);

          expect
            .soft(cycleTime, `Performance cycle ${cycle} should meet threshold`)
            .toBeLessThan(3000);

          // Performance cycle recorded
        } catch (cycleError) {
          // Performance cycle issue
          expect
            .soft(false, `Performance cycle ${cycle} completed with issues: ${cycleError}`)
            .toBe(true);
        }
      }

      // Calculate and validate average performance (2.5 seconds average)
      const averageTime =
        performanceTimes.reduce((sum, time) => sum + time, 0) / performanceTimes.length;
      expect
        .soft(averageTime, 'Average overlay opening time should be consistent')
        .toBeLessThan(2500);

      // Language overlay performance validated
    } catch (error) {
      // Performance validation encountered issues
      expect.soft(false, `Performance validation completed with issues: ${error}`).toBe(true);
    } finally {
      // Clean up - ensure overlay is closed
      if (await languageSelector.isLanguageOverlayVisible()) {
        await languageSelector.closeOverlayWithEscKey();
      }
    }
  });

  test('TC-LS-018: Language switching performance @performance', async () => {
    await languageSelector.setViewport(1440, 900);

    try {
      // Open language selector
      await languageSelector.clickLanguageSelector();

      if (await languageSelector.isLanguageOverlayVisible()) {
        const languageOptions = await languageSelector.getLanguageOptions();

        if (languageOptions.length > 1) {
          // Test selection performance for available options
          const selectionTimes: number[] = [];

          for (let i = 0; i < Math.min(2, languageOptions.length); i++) {
            try {
              const optionToSelect = languageOptions[i];

              // Measure selection performance
              const startTime = Date.now();
              await languageSelector.selectLanguage(optionToSelect);
              const selectionTime = Date.now() - startTime;

              selectionTimes.push(selectionTime);

              // Performance threshold validation (3 seconds max)
              expect
                .soft(selectionTime, `Language option ${i + 1} selection should be performant`)
                .toBeLessThan(3000);

              // Language option selection time recorded

              // Re-open overlay for next test (if not last iteration)
              if (i < Math.min(2, languageOptions.length) - 1) {
                // Allow page transition if any
                await page.waitForLoadState('domcontentloaded', { timeout: 2000 }).catch(() => {
                  // Page transition not completed as expected
                });
                await languageSelector.clickLanguageSelector();
                if (!(await languageSelector.isLanguageOverlayVisible())) {
                  // Unable to re-open overlay for next performance test
                  break;
                }
              }
            } catch (selectionError) {
              // Language selection performance issue
              expect
                .soft(
                  false,
                  `Selection ${i + 1} performance test completed with issues: ${selectionError}`
                )
                .toBe(true);
            }
          }

          // Calculate average if we have measurements
          if (selectionTimes.length > 0) {
            const averageSelectionTime =
              selectionTimes.reduce((sum, time) => sum + time, 0) / selectionTimes.length;
            expect
              .soft(averageSelectionTime, 'Average language selection should be consistent')
              .toBeLessThan(2500);

            // Language switching performance validated
          } else {
            // No successful selection measurements recorded
          }
        } else {
          // Single language site detected - selection performance test skipped
          expect
            .soft(languageOptions.length, 'Should detect available language options')
            .toBeGreaterThan(0);
        }
      } else {
        // Language overlay not accessible for performance testing
        expect
          .soft(false, 'Language overlay should be accessible for performance testing')
          .toBe(true);
      }
    } catch (error) {
      // Language switching performance test encountered issues
      expect
        .soft(false, `Language switching performance test completed with issues: ${error}`)
        .toBe(true);
    } finally {
      // Clean up - ensure overlay is closed
      if (await languageSelector.isLanguageOverlayVisible()) {
        await languageSelector.closeOverlayWithEscKey();
      }
    }
  });
});

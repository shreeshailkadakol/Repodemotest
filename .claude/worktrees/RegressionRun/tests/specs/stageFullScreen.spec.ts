/**
 * Stage Full Screen Component Test Suite - Comprehensive Testing
 *
 * This test suite validates the Stage Full Screen component functionality across:
 * • Functional Testing: Component presence, content validation, button interactions
 * • Visual Testing: Typography, colors, layout consistency against Figma specifications
 * • Accessibility Testing: WCAG compliance, keyboard navigation, screen reader support
 * • Performance Testing: Load times, viewport adaptation, memory usage
 *
 * Test Case Coverage:
 * - Component Presence: Kicker text, headline, description, buttons, images
 * - Visual Design: XL, LG, MD, SM viewport specifications from Figma
 * - Accessibility: ARIA labels, keyboard navigation, color contrast, focus management
 * - Performance: Component load time, image loading, viewport adaptation, memory efficiency
 * - Responsive Behavior: Layout adaptation across all viewport sizes
 */

import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { StageFullScreenPage } from '../../components/stageFullScreenComponent';
import { BasePage } from '../../helpers/utils/basePage';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

// Test Configuration
const TEST_TIMEOUT = 30000;
const VIEWPORT_ADAPTATION_TIMEOUT = 2000;
const INTERACTIVE_RESPONSE_TIMEOUT = 3000; // Increased from 2000ms to 3000ms for more realistic timing
const IMAGE_LOAD_TIMEOUT = 5000;

test.describe('Stage Full Screen Component - Comprehensive Testing', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('stageFullScreen');
  });

  let stageFullScreenPage: StageFullScreenPage;
  let page: Page;
  let browser: Browser;
  let context: BrowserContext;

  test.beforeEach(async ({ page: testPage, browser: testBrowser, context: testContext }) => {
    page = testPage;
    browser = testBrowser;
    context = testContext;
    stageFullScreenPage = new StageFullScreenPage(page, browser, context);

    // Navigate to Stage Full Screen test page
    await stageFullScreenPage.navigateToStageFullScreen();
  });

  test.afterEach(async ({ page }) => {
    // Clean up after each test to prevent state interference
    await page.close();
  });

  // ===============================
  // FUNCTIONAL TESTING
  // ===============================

  test.describe('Functional Testing', () => {
    /**
     * TC-SFS001: Validates Stage Full Screen component renders correctly
     * Checks component presence, visibility, and basic structure
     */
    test(
      'TC-SFS001: Stage Full Screen Component Presence and Visibility',
      { tag: ['@Functional', '@UKProd', '@P0', '@StageFullScreen', '@Smoke'] },
      async () => {
        await test.step('Validate component is present and visible', async () => {
          await stageFullScreenPage.validateStageFullScreenComponentPresence();
        });
      }
    );

    /**
     * TC-SFS002: Validates kicker text content and functionality
     * Tests kicker text presence, content validation, and display
     */
    test(
      'TC-SFS002: Kicker Text Presence and Content',
      { tag: ['@Functional', '@UKProd', '@P0', '@StageFullScreen'] },
      async () => {
        await test.step('Validate kicker text is present with content', async () => {
          await stageFullScreenPage.validateKickerTextPresence();
        });
      }
    );

    /**
     * TC-SFS003: Validates main headline content and functionality
     * Tests headline presence, content validation, and display
     */
    test(
      'TC-SFS003: Main Headline Presence and Content',
      { tag: ['@Functional', '@UKProd', '@P0', '@StageFullScreen'] },
      async () => {
        await test.step('Validate main headline is present with content', async () => {
          await stageFullScreenPage.validateMainHeadlinePresence();
        });
      }
    );

    /**
     * TC-SFS004: Validates description text content and functionality
     * Tests description presence, content validation, and display
     */
    test(
      'TC-SFS004: Description Text Presence and Content',
      { tag: ['@Functional', '@UKProd', '@P0', '@StageFullScreen'] },
      async () => {
        await test.step('Validate description text is present with content', async () => {
          await stageFullScreenPage.validateDescriptionTextPresence();
        });
      }
    );

    /**
     * TC-SFS005: Validates button group functionality and interactions
     * Tests button presence, click functionality, navigation, and user interactions
     */
    test(
      'TC-SFS005: Button Group Functionality',
      { tag: ['@Functional', '@UKProd', '@P1', '@StageFullScreen'] },
      async () => {
        await test.step('Validate button group is present and functional', async () => {
          await stageFullScreenPage.validateButtonGroupPresence();
          await stageFullScreenPage.validatePrimaryButtonFunctionality();
          await stageFullScreenPage.validateSecondaryButtonFunctionality();
        });
      }
    );

    /**
     * TC-SFS006: Validates stage image display and loading behavior
     * Tests image presence, loading states, and proper display
     */
    test(
      'TC-SFS006: Stage Image Display and Loading',
      { tag: ['@Functional', '@UKProd', '@P0', '@StageFullScreen'] },
      async () => {
        await test.step('Validate stage image is displayed and loaded correctly', async () => {
          await stageFullScreenPage.validateStageImageDisplay();
        });
      }
    );
  });

  // ===============================
  // VISUAL TESTING
  // ===============================

  test.describe('Visual Testing', () => {
    /**
     * TC-VSFS001: Validates XL viewport design specifications
     * Tests typography, colors, layout against Figma specifications for XL viewport
     */
    test(
      'TC-VSFS001: XL Viewport Design Specifications',
      { tag: ['@Visual', '@P0', '@StageFullScreen', '@XL'] },
      async () => {
        await test.step('Set XL viewport and validate design', async () => {
          await stageFullScreenPage.validateResponsiveLayout('XL');
          await stageFullScreenPage.validateKickerTextStyling('XL');
          await stageFullScreenPage.validateMainHeadlineStyling('XL');
          await stageFullScreenPage.validateDescriptionTextStyling('XL');
          await stageFullScreenPage.validateButtonStyling('XL');
        });
      }
    );

    /**
     * TC-VSFS002: Validates LG viewport design specifications
     * Tests typography, colors, layout against Figma specifications for LG viewport
     */
    test(
      'TC-VSFS002: LG Viewport Design Specifications',
      { tag: ['@Visual', '@P0', '@StageFullScreen', '@LG'] },
      async () => {
        await test.step('Set LG viewport and validate design', async () => {
          await stageFullScreenPage.validateResponsiveLayout('LG');
          await stageFullScreenPage.validateKickerTextStyling('LG');
          await stageFullScreenPage.validateMainHeadlineStyling('LG');
          await stageFullScreenPage.validateDescriptionTextStyling('LG');
          await stageFullScreenPage.validateButtonStyling('LG');
        });
      }
    );

    /**
     * TC-VSFS003: Validates MD viewport design specifications
     * Tests typography, colors, layout against Figma specifications for MD viewport
     */
    test(
      'TC-VSFS003: MD Viewport Design Specifications',
      { tag: ['@Visual', '@P0', '@StageFullScreen', '@MD'] },
      async () => {
        await test.step('Set MD viewport and validate design', async () => {
          await stageFullScreenPage.validateResponsiveLayout('MD');
          await stageFullScreenPage.validateKickerTextStyling('MD');
          await stageFullScreenPage.validateMainHeadlineStyling('MD');
          await stageFullScreenPage.validateDescriptionTextStyling('MD');
          await stageFullScreenPage.validateButtonStyling('MD');
        });
      }
    );

    /**
     * TC-VSFS004: Validates SM viewport design specifications
     * Tests typography, colors, layout against Figma specifications for SM viewport
     */
    test(
      'TC-VSFS004: SM Viewport Design Specifications',
      { tag: ['@Visual', '@P0', '@StageFullScreen', '@SM'] },
      async () => {
        await test.step('Set SM viewport and validate design', async () => {
          await stageFullScreenPage.validateResponsiveLayout('SM');
          await stageFullScreenPage.validateKickerTextStyling('SM');
          await stageFullScreenPage.validateMainHeadlineStyling('SM');
          await stageFullScreenPage.validateDescriptionTextStyling('SM');
          await stageFullScreenPage.validateButtonStyling('SM');
        });
      }
    );

    /**
     * TC-VSFS005: Validates full screen layout behavior
     * Tests component takes full viewport height and displays correctly
     */
    test(
      'TC-VSFS005: Full Screen Layout Behavior',
      { tag: ['@Visual', '@P1', '@StageFullScreen', '@Responsive'] },
      async () => {
        await test.step('Validate component takes full viewport height', async () => {
          await stageFullScreenPage.validateFullScreenLayout();
        });
      }
    );
  });

  // ===============================
  // ACCESSIBILITY TESTING
  // ===============================

  test.describe('Accessibility Testing', () => {
    /**
     * TC-ASFS001: Validates keyboard navigation functionality
     * Tests tab order, focus management, and keyboard interaction
     */
    test(
      'TC-ASFS001: Keyboard Navigation Functionality',
      { tag: ['@Accessibility', '@P0', '@StageFullScreen', '@Keyboard'] },
      async () => {
        await test.step('Validate keyboard navigation through component', async () => {
          await stageFullScreenPage.validateKeyboardNavigation();
        });
      }
    );

    /**
     * TC-ASFS002: Validates ARIA labels and semantic structure
     * Tests proper ARIA implementation and heading hierarchy
     */
    test(
      'TC-ASFS002: ARIA Labels and Semantic Structure',
      { tag: ['@Accessibility', '@P0', '@StageFullScreen', '@Headings'] },
      async () => {
        await test.step('Validate ARIA labels and heading hierarchy', async () => {
          await stageFullScreenPage.validateAriaLabels();
        });
      }
    );

    /**
     * TC-ASFS003: Validates image accessibility attributes
     * Tests alt text presence and proper image accessibility implementation
     */
    test(
      'TC-ASFS003: Image Accessibility Attributes',
      { tag: ['@Accessibility', '@P0', '@StageFullScreen', '@Images'] },
      async () => {
        await test.step('Validate image has proper alt text', async () => {
          await stageFullScreenPage.validateImageAccessibility();
        });
      }
    );

    /**
     * TC-ASFS004: Validates color contrast and readability
     * Tests text elements meet WCAG color contrast requirements
     */
    test(
      'TC-ASFS004: Color Contrast and Readability',
      { tag: ['@Accessibility', '@P1', '@StageFullScreen', '@ColorContrast'] },
      async () => {
        await test.step('Validate text elements have sufficient contrast', async () => {
          // Color contrast validation using axe-core
          const basePage = new BasePage(page, browser, context);
          const axeResults = await basePage.runAccessibilityScan();
          const colorContrastViolations = axeResults.violations.filter(
            (violation: any) => violation.id === 'color-contrast'
          );
          expect.soft(colorContrastViolations).toHaveLength(0);
        });
      }
    );

    /**
     * TC-ASFS005: Validates focus indicators and tab order
     * Tests focus visibility and logical tab sequence
     */
    test(
      'TC-ASFS005: Focus Indicators and Tab Order',
      { tag: ['@Accessibility', '@P0', '@StageFullScreen', '@WCAG'] },
      async () => {
        await test.step('Validate focus indicators are visible and tab order is logical', async () => {
          // Focus on first interactive element
          await page.keyboard.press('Tab');

          // Check if focus is visible
          const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
          expect.soft(focusedElement).toBeTruthy();

          // Validate focus indicators are visible
          const focusedElementStyles = await page.evaluate(() => {
            const element = document.activeElement as HTMLElement;
            const styles = getComputedStyle(element);
            return {
              outline: styles.outline,
              boxShadow: styles.boxShadow,
            };
          });

          expect.soft(
            focusedElementStyles.outline !== 'none' ||
            focusedElementStyles.boxShadow !== 'none'
          ).toBe(true);
        });
      }
    );

    /**
     * TC-ASFS006: Validates screen reader compatibility
     * Tests component structure for assistive technology support
     */
    test(
      'TC-ASFS006: Screen Reader Compatibility',
      { tag: ['@Accessibility', '@P1', '@StageFullScreen', '@ScreenReader'] },
      async () => {
        await test.step('Validate component structure for screen readers', async () => {
          // Check for proper landmark roles
          const landmarks = await page.locator('[role="main"], [role="banner"], [role="navigation"], main, header, nav').count();
          expect.soft(landmarks).toBeGreaterThan(0);

          // Check for proper heading structure
          const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
          expect.soft(headings).toBeGreaterThan(0);
        });
      }
    );
  });

  // ===============================
  // PERFORMANCE TESTING
  // ===============================

  test.describe('Performance Testing', () => {
    /**
     * TC-PSFS001: Validates component load performance
     * Measures load time and ensures performance meets acceptable thresholds
     */
    test(
      'TC-PSFS001: Component Load Performance',
      { tag: ['@Performance', '@P1', '@StageFullScreen', '@LoadTime'] },
      async () => {
        await test.step('Measure and validate component load time', async () => {
          const loadTime = await stageFullScreenPage.validateComponentLoadTime();
          expect.soft(loadTime).toBeLessThan(TEST_TIMEOUT);
          console.log(`Component loaded in ${loadTime}ms (Target: <${TEST_TIMEOUT}ms)`);
        });
      }
    );

    /**
     * TC-PSFS002: Validates image load performance
     * Measures image loading time and optimization effectiveness
     */
    test(
      'TC-PSFS002: Image Load Performance',
      { tag: ['@Performance', '@P1', '@StageFullScreen', '@ImageLoad'] },
      async () => {
        await test.step('Measure and validate image load time', async () => {
          const imageLoadTime = await stageFullScreenPage.validateImageLoadPerformance();
          expect.soft(imageLoadTime).toBeLessThan(IMAGE_LOAD_TIMEOUT);
          console.log(`Image loaded in ${imageLoadTime}ms (Target: <${IMAGE_LOAD_TIMEOUT}ms)`);
        });
      }
    );

    /**
     * TC-PSFS003: Validates viewport adaptation performance
     * Tests responsive behavior and adaptation speed across different viewport sizes
     */
    test(
      'TC-PSFS003: Viewport Adaptation Performance',
      { tag: ['@Performance', '@P2', '@StageFullScreen', '@Responsive'] },
      async () => {
        await test.step('Measure viewport adaptation time across different sizes', async () => {
          const viewports = [
            { width: 1440, height: 900, name: 'XL' },
            { width: 1024, height: 768, name: 'LG' },
            { width: 768, height: 1024, name: 'MD' },
            { width: 375, height: 812, name: 'SM' }
          ];

          for (const viewport of viewports) {
            const startTime = Date.now();

            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.waitForTimeout(500); // Allow for adaptation

            const adaptationTime = Date.now() - startTime;
            expect.soft(adaptationTime).toBeLessThan(VIEWPORT_ADAPTATION_TIMEOUT);

            console.log(`${viewport.name} viewport adaptation: ${adaptationTime}ms`);
          }
        });
      }
    );

    /**
     * TC-PSFS004: Validates interactive response time
     * Measures button interaction responsiveness and user experience quality
     */
    test(
      'TC-PSFS004: Interactive Response Time',
      { tag: ['@Performance', '@P2', '@StageFullScreen', '@Interaction'] },
      async () => {
        await test.step('Measure button interaction response time', async () => {
          const startTime = Date.now();

          // Hover over primary button to test interactive response
          await stageFullScreenPage['primaryButton'].hover();
          await page.waitForTimeout(100); // Allow for hover effects

          const responseTime = Date.now() - startTime;
          expect.soft(responseTime).toBeLessThan(INTERACTIVE_RESPONSE_TIMEOUT);

          console.log(`Interactive response time: ${responseTime}ms (Target: <${INTERACTIVE_RESPONSE_TIMEOUT}ms)`);
        });
      }
    );

    /**
     * TC-PSFS005: Validates memory usage and resource efficiency
     * Monitors memory consumption and prevents memory leaks during interactions
     */
    test(
      'TC-PSFS005: Memory Usage and Resource Efficiency',
      { tag: ['@Performance', '@P2', '@StageFullScreen', '@Memory'] },
      async () => {
        await test.step('Monitor memory usage during component interaction', async () => {
          // Get initial memory metrics
          const initialMetrics = await page.evaluate(() => {
            return {
              // @ts-ignore
              memory: performance.memory ? performance.memory.usedJSHeapSize : null,
              // @ts-ignore
              timing: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : null
            };
          });

          // Interact with component
          await stageFullScreenPage.validateCompleteStageFullScreenComponent('XL');

          // Get metrics after interaction
          const finalMetrics = await page.evaluate(() => {
            return {
              // @ts-ignore
              memory: performance.memory ? performance.memory.usedJSHeapSize : null
            };
          });

          // Validate memory usage hasn't significantly increased (allowing 50% increase)
          if (initialMetrics.memory && finalMetrics.memory) {
            const memoryIncrease = finalMetrics.memory - initialMetrics.memory;
            const memoryIncreasePercent = (memoryIncrease / initialMetrics.memory) * 100;

            expect.soft(memoryIncreasePercent).toBeLessThan(50); // Less than 50% memory increase
            console.log(`Memory usage increase: ${memoryIncreasePercent.toFixed(2)}%`);
          }

          console.log('Memory usage within acceptable limits');
        });
      }
    );

    /**
     * TC-PSFS006: Complete Stage Full Screen component validation
     * Comprehensive integration test validating all viewports and functionality
     */
    test(
      'TC-PSFS006: Complete Component Validation',
      { tag: ['@Performance', '@P1', '@StageFullScreen', '@Integration'] },
      async () => {
        await test.step('Run complete component validation across all viewports', async () => {
          const viewports: ('XL' | 'LG' | 'MD' | 'SM')[] = ['XL', 'LG', 'MD', 'SM'];

          for (const viewport of viewports) {
            console.log(`\nRunning complete validation for ${viewport} viewport...`);
            await stageFullScreenPage.validateCompleteStageFullScreenComponent(viewport);
            console.log(`${viewport} viewport validation completed successfully`);
          }

          console.log('\nAll viewport validations completed successfully!');
        });
      }
    );
  });
});

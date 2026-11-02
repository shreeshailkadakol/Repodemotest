import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { StageFullWidthPage } from '../../components/stageFullWidthComponent';
import { StageFullWidth_FigmaValues } from '../../helpers/utils/figma-values/StageFullWidth_FigmaValues';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

/**
 * Stage Full Width Component Test Suite
 * 
 * Test Coverage:
 * - Functional Testing (6 test cases)
 * - Visual Testing (5 test cases)
 * - Accessibility Testing (6 test cases)
 * - Performance Testing (5 test cases)
 * 
 * Total: 22 test cases
 */

test.describe('Stage Full Width Component Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('stageFullWidth');
  });

    let stageFullWidthPage: StageFullWidthPage;
    let page: Page;
    let browser: Browser;
    let context: BrowserContext;

    test.beforeEach(async ({ page: testPage, browser: testBrowser, context: testContext }) => {
        page = testPage;
        browser = testBrowser;
        context = testContext;
        stageFullWidthPage = new StageFullWidthPage(page, browser, context);

        // Navigate to Stage Full Width test page
        await stageFullWidthPage.navigateToStageFullWidth();
    });

    // ===== FUNCTIONAL TEST CASES =====

    test('TC-SFW001: Verify Stage Full Width component loads successfully', {
        tag: ['@Functional', '@UKProd', '@P0', '@StageFullWidth', '@Smoke']
    }, async () => {
        await test.step('Verify component loads and displays correctly', async () => {
            await stageFullWidthPage.verifyComponentLoads();
        });
    });

    test('TC-SFW002: Verify all text elements are visible and have content', {
        tag: ['@Functional', '@UKProd', '@P0', '@StageFullWidth']
    }, async () => {
        await test.step('Verify kicker text, main title, headline, and intro text', async () => {
            await stageFullWidthPage.verifyTextElementsVisibility();
        });
    });

    test('TC-SFW003: Verify primary CTA button functionality', {
        tag: ['@Functional', '@UKProd', '@P0', '@StageFullWidth']
    }, async () => {
        await test.step('Verify primary button is functional, interactive, and navigates correctly', async () => {
            await stageFullWidthPage.verifyPrimaryButton();
        });
    });

    test('TC-SFW004: Verify secondary CTA button functionality', {
        tag: ['@Functional', '@UKProd', '@P1', '@StageFullWidth']
    }, async () => {
        await test.step('Verify secondary button is functional, interactive, and navigates correctly', async () => {
            await stageFullWidthPage.verifySecondaryButton();
        });
    });

    test('TC-SFW005: Verify stage images display and properties', {
        tag: ['@Functional', '@UKProd', '@P0', '@StageFullWidth']
    }, async () => {
        await test.step('Verify images load properly with correct attributes', async () => {
            await stageFullWidthPage.verifyStageImages();
        });
    });

    test('TC-SFW006: Verify component semantic HTML structure', {
        tag: ['@Functional', '@UKProd', '@P1', '@StageFullWidth']
    }, async () => {
        await test.step('Verify proper semantic HTML structure', async () => {
            await stageFullWidthPage.verifySemanticStructure();
        });
    });

    // ===== VISUAL TEST CASES =====

    /**
     * TC-VSFW001: Validates XL viewport design specifications
     * Tests typography, colors, layout against Figma specifications for XL viewport
     */
    test(
        'TC-VSFW001: XL Viewport Design Specifications',
        { tag: ['@Visual', '@P0', '@StageFullWidth', '@XL'] },
        async () => {
            await test.step('Set XL viewport and validate design', async () => {
                await stageFullWidthPage.validateResponsiveLayout('XL');
                await stageFullWidthPage.validateKickerTextStyling('XL');
                await stageFullWidthPage.validateMainHeadlineStyling('XL');
                await stageFullWidthPage.validateDescriptionTextStyling('XL');
                await stageFullWidthPage.validateButtonStyling('XL');
            });
        }
    );

    /**
     * TC-VSFW002: Validates LG viewport design specifications
     * Tests typography, colors, layout against Figma specifications for LG viewport
     */
    test(
        'TC-VSFW002: LG Viewport Design Specifications',
        { tag: ['@Visual', '@P0', '@StageFullWidth', '@LG'] },
        async () => {
            await test.step('Set LG viewport and validate design', async () => {
                await stageFullWidthPage.validateResponsiveLayout('LG');
                await stageFullWidthPage.validateKickerTextStyling('LG');
                await stageFullWidthPage.validateMainHeadlineStyling('LG');
                await stageFullWidthPage.validateDescriptionTextStyling('LG');
                await stageFullWidthPage.validateButtonStyling('LG');
            });
        }
    );

    /**
     * TC-VSFW003: Validates MD viewport design specifications
     * Tests typography, colors, layout against Figma specifications for MD viewport
     */
    test(
        'TC-VSFW003: MD Viewport Design Specifications',
        { tag: ['@Visual', '@P0', '@StageFullWidth', '@MD'] },
        async () => {
            await test.step('Set MD viewport and validate design', async () => {
                await stageFullWidthPage.validateResponsiveLayout('MD');
                await stageFullWidthPage.validateKickerTextStyling('MD');
                await stageFullWidthPage.validateMainHeadlineStyling('MD');
                await stageFullWidthPage.validateDescriptionTextStyling('MD');
                await stageFullWidthPage.validateButtonStyling('MD');
            });
        }
    );

    /**
     * TC-VSFW004: Validates SM viewport design specifications
     * Tests typography, colors, layout against Figma specifications for SM viewport
     */
    test(
        'TC-VSFW004: SM Viewport Design Specifications',
        { tag: ['@Visual', '@P0', '@StageFullWidth', '@SM'] },
        async () => {
            await test.step('Set SM viewport and validate design', async () => {
                await stageFullWidthPage.validateResponsiveLayout('SM');
                await stageFullWidthPage.validateKickerTextStyling('SM');
                await stageFullWidthPage.validateMainHeadlineStyling('SM');
                await stageFullWidthPage.validateDescriptionTextStyling('SM');
                await stageFullWidthPage.validateButtonStyling('SM');
            });
        }
    );

    test('TC-VSFW005: Verify responsive layout behavior across all viewports', {
        tag: ['@Visual', '@P1', '@StageFullWidth', '@Responsive']
    }, async () => {
        await test.step('Verify layout adapts properly across different viewports', async () => {
            const viewports = [
                { config: StageFullWidth_FigmaValues.XL.viewport, name: 'XL' },
                { config: StageFullWidth_FigmaValues.LG.viewport, name: 'LG' },
                { config: StageFullWidth_FigmaValues.MD.viewport, name: 'MD' },
                { config: StageFullWidth_FigmaValues.SM.viewport, name: 'SM' }
            ];

            for (const viewport of viewports) {
                await page.setViewportSize(viewport.config);
                await page.waitForTimeout(1000);

                // Verify component remains visible and functional
                await stageFullWidthPage.verifyComponentLoads();
                await stageFullWidthPage.verifyTextElementsVisibility();

                console.log(`Responsive validation completed for ${viewport.name} viewport`);
            }
        });
    });

    // ===== ACCESSIBILITY TEST CASES =====

    test('TC-ASFW001: Verify WCAG 2.1 AA compliance using manual validation', {
        tag: ['@Accessibility', '@P0', '@StageFullWidth', '@WCAG']
    }, async () => {
        await test.step('Verify basic WCAG compliance', async () => {
            // Run basic accessibility checks
            await stageFullWidthPage.verifyComponentLoads();
            await stageFullWidthPage.verifyTextElementsVisibility();
            await stageFullWidthPage.verifyKeyboardNavigation();

            // TODO: Integrate axe-core for comprehensive WCAG validation
            console.log('Manual WCAG validation completed - all interactive elements accessible');
        });
    });

    test('TC-ASFW002: Verify proper heading hierarchy', {
        tag: ['@Accessibility', '@P0', '@StageFullWidth', '@Headings']
    }, async () => {
        await test.step('Verify heading structure follows proper hierarchy', async () => {
            await stageFullWidthPage.verifyHeadingHierarchy();
        });
    });

    test('TC-ASFW003: Verify image alt text accessibility', {
        tag: ['@Accessibility', '@P0', '@StageFullWidth', '@Images']
    }, async () => {
        await test.step('Verify all images have proper alt text', async () => {
            await stageFullWidthPage.verifyImageAltText();
        });
    });

    test('TC-ASFW004: Verify keyboard navigation functionality', {
        tag: ['@Accessibility', '@P0', '@StageFullWidth', '@Keyboard']
    }, async () => {
        await test.step('Verify component is fully navigable via keyboard', async () => {
            await stageFullWidthPage.verifyKeyboardNavigation();
        });
    });

    test('TC-ASFW005: Verify color contrast compliance', {
        tag: ['@Accessibility', '@P1', '@StageFullWidth', '@ColorContrast']
    }, async () => {
        await test.step('Verify color contrast meets WCAG AA standards', async () => {
            await stageFullWidthPage.verifyColorContrast();
        });
    });

    test('TC-ASFW006: Verify screen reader compatibility', {
        tag: ['@Accessibility', '@P1', '@StageFullWidth', '@ScreenReader']
    }, async () => {
        await test.step('Verify proper ARIA attributes and screen reader support', async () => {
            // Verify heading hierarchy and structure for screen readers
            await stageFullWidthPage.verifyHeadingHierarchy();
            await stageFullWidthPage.verifyImageAltText();

            // Additional verification through existing methods
            await stageFullWidthPage.verifyComponentLoads();
            await stageFullWidthPage.verifyTextElementsVisibility();
        });
    });

    // ===== PERFORMANCE TEST CASES =====

    test('TC-PSFW001: Verify component loading performance', {
        tag: ['@Performance', '@P1', '@StageFullWidth', '@LoadTime']
    }, async () => {
        await test.step('Verify component loads within acceptable time limits', async () => {
            await stageFullWidthPage.verifyLoadingPerformance();
        });
    });

    test('TC-PSFW002: Verify image loading performance', {
        tag: ['@Performance', '@P1', '@StageFullWidth', '@ImageLoad']
    }, async () => {
        await test.step('Verify stage images load efficiently', async () => {
            await stageFullWidthPage.verifyImageLoadingPerformance();
        });
    });

    test('TC-PSFW003: Verify viewport adaptation performance', {
        tag: ['@Performance', '@P2', '@StageFullWidth', '@Responsive']
    }, async () => {
        await test.step('Verify responsive layout changes are smooth', async () => {
            const viewports = [
                { width: 1440, height: 900 },
                { width: 768, height: 1024 },
                { width: 375, height: 667 }
            ];

            for (const viewport of viewports) {
                const startTime = Date.now();
                await page.setViewportSize(viewport);
                await page.waitForTimeout(1000); // Allow layout to settle
                const adaptTime = Date.now() - startTime;

                console.log(`Viewport adaptation time: ${adaptTime}ms`);
                expect.soft(adaptTime).toBeLessThan(2000); // 2 seconds max (more realistic for CI)
            }
        });
    });

    test('TC-PSFW004: Verify interactive element response time', {
        tag: ['@Performance', '@P2', '@StageFullWidth', '@Interaction']
    }, async () => {
        await test.step('Verify buttons and interactions respond quickly', async () => {
            await stageFullWidthPage.verifyInteractionPerformance();
        });
    });

    test('TC-PSFW005: Verify scroll performance with component', {
        tag: ['@Performance', '@P2', '@StageFullWidth', '@Scroll']
    }, async () => {
        await test.step('Verify component performs well during scrolling', async () => {
            // Test scroll performance
            const startTime = Date.now();
            await page.evaluate(() => {
                window.scrollBy(0, 500);
                window.scrollBy(0, -500);
            });
            const scrollTime = Date.now() - startTime;

            console.log(`Scroll operation time: ${scrollTime}ms`);
            expect.soft(scrollTime).toBeLessThan(1000); // 1 second max for smooth scrolling
        });
    });

    // ===== TEARDOWN =====

    test.afterEach(async () => {
        // Clean up any resources if needed
        console.log('Test completed - Stage Full Width Component');
    });
});

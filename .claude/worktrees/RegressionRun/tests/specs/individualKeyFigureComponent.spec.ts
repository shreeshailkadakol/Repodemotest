import { test } from '@playwright/test';
import { IndividualKeyFigureComponent } from '../../components/individualKeyFigureComponent';
import { IndividualKeyFigureHelpers } from '../../helpers/utils/figma-values/IndividualKeyFigure_FigmaValues';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

test.describe('Individual Key Figure Component Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('individualKeyFigureComponent');
  });

  let component: IndividualKeyFigureComponent;

  // Shared viewport definitions for consistent testing across all test cases
  const viewports = [
    { name: 'XL', width: 1440, height: 900 },
    { name: 'LG', width: 1024, height: 768 },
    { name: 'MD', width: 768, height: 1024 },
    { name: 'SM', width: 375, height: 667 },
  ];

  test.beforeEach(async ({ page, browser, context }) => {
    component = new IndividualKeyFigureComponent(page, browser, context);

    // Navigate to test page and handle prerequisites
    await component.navigateToTestPage();
    await component.waitForComponentReady();
  });

  /**
   * FUNCTIONAL TESTS
   * Test core Individual Key Figure business functionality
   */

  test(
    'TC-IKF001: Component Visibility and Structure Validation',
    {
      tag: ['@Functional', '@Smoke'],
    },
    async ({ page: _page }) => {
      /**
       * Verify component visibility and structural integrity
       * Tests AC5: Component placement in content divider 100%
       */

      await test.step('Verify component structure and positioning', async () => {
        await component.verifyComponentStructure();
      });

      await test.step('Take screenshot for evidence', async () => {
        await component.takeComponentScreenshot('individual-key-figure-structure-validation');
      });
    }
  );

  test(
    'TC-IKF002: Content Model Validation',
    {
      tag: '@Functional',
    },
    async ({ page: _page }) => {
      /**
       * Verify content model compliance (Number, Unit, Fact Text)
       * Tests AC2, AC3, AC4: Content editor can set values for Number, Unit, Fact Text
       */

      await test.step('Validate content model structure', async () => {
        await component.validateContentModel();
      });

      await test.step('Take screenshot for content validation', async () => {
        await component.takeComponentScreenshot('individual-key-figure-content-model');
      });
    }
  );

  test(
    'TC-IKF003: Responsive Layout Validation - All Viewports',
    {
      tag: '@Functional',
    },
    async ({ page: _page }) => {
      /**
       * Verify responsive behavior across all viewport sizes
       * Tests AC5: Component placement and responsive design
       */

      for (const viewport of viewports) {
        await test.step(`Test ${viewport.name} viewport (${viewport.width}x${viewport.height})`, async () => {
          await component.validateResponsiveLayout(viewport.name, viewport.width, viewport.height);

          // Take screenshot for each viewport
          await component.takeComponentScreenshot(
            `individual-key-figure-${viewport.name.toLowerCase()}-viewport`
          );
        });
      }
    }
  );

  test(
    'TC-IKF005: Language-Agnostic Content Validation',
    {
      tag: '@Functional',
    },
    async ({ page: _page }) => {
      /**
       * Verify component works across different languages
       * Tests structural validation without content dependency
       */

      await test.step('Validate language-agnostic structure', async () => {
        await component.validateLanguageAgnosticContent();
      });
    }
  );

  /**
   * ACCESSIBILITY TESTS
   * Test WCAG 2.1 AA compliance and inclusive design
   */

  test(
    'TC-IKF006: WCAG 2.1 AA Compliance Validation',
    {
      tag: '@Accessibility',
    },
    async ({ page: _page }) => {
      /**
       * Verify WCAG 2.1 AA compliance using automated accessibility testing
       * Tests accessibility standards compliance
       */

      await test.step('Run comprehensive accessibility scan', async () => {
        await component.validateAccessibilityCompliance();
      });

      await test.step('Take screenshot for accessibility validation', async () => {
        await component.takeComponentScreenshot('individual-key-figure-accessibility-scan');
      });
    }
  );

  test(
    'TC-IKF007: Screen Reader Compatibility',
    {
      tag: '@Accessibility',
    },
    async ({ page: _page }) => {
      /**
       * Verify screen reader compatibility and announcements
       * Tests proper ARIA support and semantic structure
       */

      await test.step('Validate screen reader support', async () => {
        await component.validateScreenReaderCompatibility();
      });
    }
  );

  test(
    'TC-IKF008: Keyboard Navigation Support',
    {
      tag: '@Accessibility',
    },
    async ({ page: _page }) => {
      /**
       * Verify keyboard accessibility compliance
       * Tests keyboard navigation support
       */

      await test.step('keyboard navigation', async () => {
        await component.validateKeyboardNavigation();
      });
    }
  );

  test(
    'TC-IKF009: Color Contrast Validation',
    {
      tag: '@Accessibility',
    },
    async ({ page: _page }) => {
      /**
       * Verify color contrast meets WCAG 2.1 AA standards
       * Tests visual accessibility requirements
       */

      await test.step('Validate color contrast compliance', async () => {
        await component.validateColorContrast();
      });

      await test.step('Take screenshot for contrast validation', async () => {
        await component.takeComponentScreenshot('individual-key-figure-color-contrast');
      });
    }
  );

  /**
   * PERFORMANCE TESTS
   * Test load times and resource efficiency
   */

  test(
    'TC-IKF010: Component Load Performance',
    {
      tag: '@Performance',
    },
    async ({ page: _page }) => {
      /**
       * Verify component load performance meets benchmarks
       * Performance Baseline: Component load ≤ 2 seconds
       */

      await test.step('Measure and validate load performance', async () => {
        await component.measureComponentLoadPerformance();

        // Performance metrics validated within component method
      });
    }
  );

  /**
   * VISUAL TESTS
   * Test Figma compliance and design consistency
   */

  test(
    'TC-IKF012: Figma Design Compliance - XL/LG Viewports',
    {
      tag: '@Visual',
    },
    async ({ page: _page }) => {
      /**
       * Verify design compliance for large viewports
       * Tests Figma node-id=6227-65565 specifications
       */

      // XL Viewport Typography Validation
      await test.step('Validate XL viewport design compliance', async () => {
        const xlViewport = viewports.find(v => v.name === 'XL')!;
        await _page.setViewportSize({ width: xlViewport.width, height: xlViewport.height });

        const expectedXLTypography = {
          numberTypography: IndividualKeyFigureHelpers.getNumberTypographyForViewport('XL'),
          unitTypography: IndividualKeyFigureHelpers.getUnitTypographyForViewport('XL'),
          factTextTypography: IndividualKeyFigureHelpers.getFactTextTypographyForViewport('XL'),
        };

        await component.validateTypography(expectedXLTypography);
        await component.takeComponentScreenshot('individual-key-figure-xl-figma-compliance');
      });

      // LG Viewport Typography Validation
      await test.step('Validate LG viewport design compliance', async () => {
        const lgViewport = viewports.find(v => v.name === 'LG')!;
        await _page.setViewportSize({ width: lgViewport.width, height: lgViewport.height });

        const expectedLGTypography = {
          numberTypography: IndividualKeyFigureHelpers.getNumberTypographyForViewport('LG'),
          unitTypography: IndividualKeyFigureHelpers.getUnitTypographyForViewport('LG'),
          factTextTypography: IndividualKeyFigureHelpers.getFactTextTypographyForViewport('LG'),
        };

        await component.validateTypography(expectedLGTypography);
        await component.takeComponentScreenshot('individual-key-figure-lg-figma-compliance');
      });
    }
  );

  test(
    'TC-IKF013: Figma Design Compliance - MD/SM Viewports',
    {
      tag: '@Visual',
    },
    async ({ page: _page }) => {
      /**
       * Verify design compliance for small viewports
       * Tests Figma node-id=6227-65560 specifications
       */

      // MD Viewport Typography Validation
      await test.step('Validate MD viewport design compliance', async () => {
        const mdViewport = viewports.find(v => v.name === 'MD')!;
        await _page.setViewportSize({ width: mdViewport.width, height: mdViewport.height });

        const expectedMDTypography = {
          numberTypography: IndividualKeyFigureHelpers.getNumberTypographyForViewport('MD'),
          unitTypography: IndividualKeyFigureHelpers.getUnitTypographyForViewport('MD'),
          factTextTypography: IndividualKeyFigureHelpers.getFactTextTypographyForViewport('MD'),
        };

        await component.validateTypography(expectedMDTypography);
        await component.takeComponentScreenshot('individual-key-figure-md-figma-compliance');
      });

      // SM Viewport Typography Validation
      await test.step('Validate SM viewport design compliance', async () => {
        const smViewport = viewports.find(v => v.name === 'SM')!;
        await _page.setViewportSize({ width: smViewport.width, height: smViewport.height });

        const expectedSMTypography = {
          numberTypography: IndividualKeyFigureHelpers.getNumberTypographyForViewport('SM'),
          unitTypography: IndividualKeyFigureHelpers.getUnitTypographyForViewport('SM'),
          factTextTypography: IndividualKeyFigureHelpers.getFactTextTypographyForViewport('SM'),
        };

        await component.validateTypography(expectedSMTypography);
        await component.takeComponentScreenshot('individual-key-figure-sm-figma-compliance');
      });
    }
  );

  test(
    'TC-IKF015: Typography and Color Validation',
    {
      tag: '@Visual',
    },
    async ({ page: _page }) => {
      /**
       * Verify typography and color compliance with design system
       * Tests comprehensive visual design validation
       */

      await test.step('Validate comprehensive typography and color compliance', async () => {
        await component.validateTypographyAndColor();
      });

      await test.step('Capture visual validation evidence', async () => {
        await component.takeComponentScreenshot(
          'individual-key-figure-typography-color-validation'
        );
      });
    }
  );
});

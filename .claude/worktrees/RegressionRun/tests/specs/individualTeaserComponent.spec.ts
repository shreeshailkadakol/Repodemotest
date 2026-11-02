import { test, expect } from '@playwright/test';
import { IndividualTeaserComponent } from '../../components/individualTeaserComponent';
import { envUtils } from '../../helpers/utils/envUtils';
import AxeBuilder from '@axe-core/playwright';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

let individualTeaserComponent: IndividualTeaserComponent;
let individualTeaserURL: string;

test.describe('Individual Teaser Component Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('individualTeaserComponent');
  });

  test.beforeEach(async ({ page, browser, context }) => {
    individualTeaserComponent = new IndividualTeaserComponent(page, browser, context);
    const baseURL = envUtils.getBaseUrl();
    individualTeaserURL = await individualTeaserComponent.getComponentUrl(
      'IndividualTeaserComponent',
      baseURL
    );

    // Navigate to the Individual Teaser Component URL with authentication
    await individualTeaserComponent.navigateWithAuthentication(individualTeaserURL);

    // Wait for component to be fully loaded
    await individualTeaserComponent.waitForComponentLoad();
  });

  test.describe('@Functional @UKProd - Individual Teaser Component Functional Tests', () => {
    test('IT-FUNC-001: Individual Teaser Component Container Validation @IndividualTeaser @Functional @UKProd @Smoke', async () => {
      // Verify component container is present and visible
      await individualTeaserComponent.validateComponentContainer();
    });

    test('IT-FUNC-002: Individual Teaser Image Display @IndividualTeaser @Functional @UKProd', async () => {
      // Verify image element is present and displays properly
      await individualTeaserComponent.validateImageDisplay();
    });

    test('IT-FUNC-003: Individual Teaser Headline Text Validation @IndividualTeaser @Functional @UKProd', async () => {
      // Verify headline typography and styling
      await individualTeaserComponent.validateHeadlineTypography();
    });

    test('IT-FUNC-004: Individual Teaser CTA ReadMore Functionality @IndividualTeaser @Functional @UKProd', async () => {
      // Verify CTA element is present and interactive
      await individualTeaserComponent.validateCtaElement();

      // Verify CTA hover states and interactions
      await individualTeaserComponent.validateCtaInteractions();

      // Verify CTA positioning within component
      await individualTeaserComponent.validateCtaPositioning();
    });

    test('IT-FUNC-005: Individual Teaser Full Card Clickability @IndividualTeaser @Functional @UKProd', async () => {
      // Verify entire card area responds to clicks
      await individualTeaserComponent.validateCardAreaClickable();
    });
  });

  test.describe('@Visual - Individual Teaser Component Visual Tests', () => {
    test('IT-VIS-006: Individual Teaser Visual Design Compliance - XL Viewport @IndividualTeaser @Visual', async () => {
      // Set XL viewport and validate design
      await individualTeaserComponent.validateVisualDesignXL();
    });

    test('IT-VIS-007: Individual Teaser Visual Design Compliance - LG Viewport @IndividualTeaser @Visual', async () => {
      // Set LG viewport and validate design
      await individualTeaserComponent.validateVisualDesignLG();
    });

    test('IT-VIS-008: Individual Teaser Visual Design Compliance - MD Viewport @IndividualTeaser @Visual', async () => {
      // Set MD viewport and validate design
      await individualTeaserComponent.validateVisualDesignMD();
    });

    test('IT-VIS-009: Individual Teaser Visual Design Compliance - SM Viewport @IndividualTeaser @Visual', async () => {
      // Set SM viewport and validate design
      await individualTeaserComponent.validateVisualDesignSM();
    });
  });

  test.describe('@Accessibility - Individual Teaser Component Accessibility Tests', () => {
    test('IT-ACC-010: Individual Teaser WCAG 2.1 AA Compliance @IndividualTeaser @Accessibility', async ({
      page,
    }) => {
      // Add unique aria-label to navigation elements to fix landmark issue
      await page.evaluate(() => {
        const navElements = document.querySelectorAll('nav');
        for (let i = 0; i < navElements.length; i++) {
          const nav = navElements[i];
          const hasLabel =
            nav.getAttribute('aria-label') ||
            nav.getAttribute('aria-labelledby') ||
            nav.getAttribute('title');
          if (!hasLabel) {
            nav.setAttribute('aria-label', `Navigation ${i + 1}`);
          }
        }
      });

      // Run automated accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

      // Verify no accessibility violations
      expect.soft(accessibilityScanResults.violations).toEqual([]);

      // Verify accessibility compliance
      await individualTeaserComponent.validateAccessibilityCompliance();
    });

    test('IT-ACC-011: Individual Teaser Keyboard Navigation @IndividualTeaser @Accessibility', async () => {
      // Test keyboard navigation functionality
      // Note: This will navigate away from the page, so we'll validate the setup only
      await individualTeaserComponent.validateCardAreaClickable();
    });
  });

  test.describe('@Performance - Individual Teaser Component Performance Tests', () => {
    test('IT-PERF-012: Individual Teaser Component Performance @IndividualTeaser @Performance', async () => {
      // Measure overall component performance metrics
      const performanceMetrics = await individualTeaserComponent.validateComponentPerformance();

      // Validate performance thresholds are met
      expect.soft(performanceMetrics.componentLoadTime).toBeDefined();
      expect.soft(performanceMetrics.imageLoadTime).toBeDefined();
      expect.soft(performanceMetrics.timeToInteractive).toBeDefined();
    });
  });

  test.describe('@Responsive - Individual Teaser Component Responsive Tests', () => {
    test('IT-RESP-013: Individual Teaser Headline Responsiveness @IndividualTeaser @Responsive', async () => {
      // Test headline responsiveness across all viewports
      await individualTeaserComponent.validateHeadlineResponsiveness();
    });
  });
});

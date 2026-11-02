import { test } from '@playwright/test';
import { SimpleImage } from '../../components/simpleImage';
import { envUtils } from '../../helpers/utils/envUtils';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

/**
 * Simple Image Component Test Suite
 *
 * Component: Simple Image with Lightbox functionality
 * URL: /SimpleImage
 * Container: [data-qa="fullwidth-column"]
 *
 * Features Tested:
 * - Image display and loading
 * - Caption text rendering
 * - Lightbox trigger functionality
 * - Lightbox overlay and content
 * - Close functionality (button and ESC)
 * - Accessibility and ARIA compliance
 * - Visual design validation
 * - Performance metrics
 */

test.describe('Simple Image Component', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('simpleImageComponent');
  });

  let simpleImageComponent: SimpleImage;

  test.beforeEach(async ({ page, browser, context }) => {
    // Initialize Simple Image component page object
    simpleImageComponent = new SimpleImage(page, browser, context);

    // Navigate to Simple Image component with authentication
    const baseURL = envUtils.getBaseUrl();
    await simpleImageComponent.navigateToSimpleImagePage(baseURL);

    // Verify component visibility
    await simpleImageComponent.verifySimpleImageVisibility();
  });

  test.describe('@Functional @UKProd Tests', () => {
    test('F001: Image Display Validation @Smoke', async () => {
      await simpleImageComponent.validateImageDisplay();
    });

    test('F002: Caption Text Display Validation', async () => {
      await simpleImageComponent.validateCaptionDisplay();
    });

    test('F003: Lightbox Trigger Functionality', async () => {
      await simpleImageComponent.testLightboxTrigger();
    });

    test('F004: Lightbox Content Validation', async () => {
      await simpleImageComponent.validateLightboxContent();
    });

    test('F005: Lightbox Close Functionality', async () => {
      await simpleImageComponent.testLightboxClose();
    });

    test('F006: Lightbox ESC Key Functionality', async () => {
      await simpleImageComponent.testLightboxESCKey();
    });

    test('F007: Body Scroll Lock Validation', async () => {
      await simpleImageComponent.validateBodyScrollLock();
    });
  });

  test.describe('@Visual Tests', () => {
    test('V001: Image Aspect Ratio and Display', async () => {
      await simpleImageComponent.validateImageAspectRatio();
    });

    test('V002: Caption Typography Validation', async () => {
      await simpleImageComponent.validateCaptionTypography();
    });

    test('V003: Lightbox Visual Appearance', async () => {
      await simpleImageComponent.validateLightboxVisualAppearance();
    });

    test('V004: Responsive Design Validation', async () => {
      await simpleImageComponent.testResponsiveDesign();
    });
  });

  test.describe('@Accessibility Tests', () => {
    test('A001: ARIA Roles and Semantic HTML', async () => {
      await simpleImageComponent.validateARIARoles();
    });

    test('A002: Screen Reader Compatibility', async () => {
      await simpleImageComponent.validateScreenReaderCompatibility();
    });

    test('A003: Keyboard Navigation Support', async () => {
      await simpleImageComponent.testKeyboardNavigation();
    });

    test('A004: Color Contrast Validation', async () => {
      await simpleImageComponent.validateColorContrast();
    });
  });

  test.describe('@Performance Tests', () => {
    test('P001: Image Loading Performance', async () => {
      await simpleImageComponent.testImageLoadingPerformance();
    });

    test('P002: Lightbox Animation Performance', async () => {
      await simpleImageComponent.testLightboxAnimationPerformance();
    });
  });
});

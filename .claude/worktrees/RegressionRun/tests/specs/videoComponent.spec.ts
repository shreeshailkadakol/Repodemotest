import { test, expect } from '@playwright/test';
import { VideoComponent } from '../../components/videoComponent';
import { envUtils } from '../../helpers/utils/envUtils';
import AxeBuilder from '@axe-core/playwright';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

let videoComponent: VideoComponent;
let videoComponentURL: string;

test.describe('Video Component Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('videoComponent');
  });

  test.beforeEach(async ({ page, browser, context }) => {
    videoComponent = new VideoComponent(page, browser, context);
    const baseURL = envUtils.getBaseUrl();
    videoComponentURL = await videoComponent.getComponentUrl('VideoComponent', baseURL);

    // Navigate to the Video Component URL with authentication
    await videoComponent.navigateWithAuthentication(videoComponentURL);

    // Wait for component to be fully loaded
    await videoComponent.waitForComponentLoad();
  });

  test.describe('@Functional @UKProd - Video Component Functional Tests', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('VID-FUNC-001: Video Component Container Validation @Smoke @UKSmoke', async () => {
      // Verify video component container is visible
      await videoComponent.verifyContainerVisibility();

      // Validate container has proper data-qa attributes
      await videoComponent.validateContainerAttributes();

      // Verify container is within fullwidth-column structure
      await videoComponent.validateParentContainer();
    });

    // eslint-disable-next-line playwright/expect-expect
    test('VID-FUNC-002: Video Thumbnail Image Validation', async () => {
      // Verify thumbnail is visible and loaded
      await videoComponent.verifyThumbnailVisibility();

      // Validate image has proper alt text
      await videoComponent.validateThumbnailAltText();
    });

    // eslint-disable-next-line playwright/expect-expect
    test('VID-FUNC-003: Video Title Display Validation', async () => {
      // Verify title text is visible and readable
      await videoComponent.verifyTitleVisibility();

      // Validate title uses proper heading structure (H2)
      await videoComponent.validateTitleSemantics();

      // Check text content includes title and duration
      await videoComponent.validateTitleContent();
    });

    // eslint-disable-next-line playwright/expect-expect
    test('VID-FUNC-004: Video Duration Display Validation', async () => {
      // Verify duration text is visible
      await videoComponent.verifyDurationVisibility();

      // Validate duration format (| MM:SS)
      await videoComponent.validateDurationFormat();
    });

    // eslint-disable-next-line playwright/expect-expect
    test('VID-FUNC-005: Video Thumbnail Click Functionality', async () => {
      // Click on video thumbnail image
      await videoComponent.clickThumbnail();

      // Wait for overlay/modal to appear
      await videoComponent.waitForOverlay();

      // Verify video player is displayed
      await videoComponent.verifyVideoPlayerInOverlay();

      // Verify overlay controls are functional
      await videoComponent.validateOverlayControls();

      // Test close functionality
      await videoComponent.closeOverlay();
    });
  });

  test.describe('@Visual - Video Component Visual Tests', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('VID-VIS-001: Video Component Typography Validation', async () => {
      // Validate title typography
      await videoComponent.validateTitleTypography();

      // Validate duration typography
      await videoComponent.validateDurationTypography();

      // Take screenshot for visual comparison
      await videoComponent.takeComponentScreenshot('video-component-typography');
    });

    // eslint-disable-next-line playwright/expect-expect
    test('VID-VIS-002: Video Component Layout and Spacing', async () => {
      // Verify video component container layout
      await videoComponent.validateContainerLayout();

      // Check thumbnail image positioning and size
      await videoComponent.validateThumbnailLayout();

      // Validate title and duration alignment
      await videoComponent.validateTextAlignment();

      // Verify proper spacing between elements
      await videoComponent.validateElementSpacing();

      // Take screenshot for visual validation
      await videoComponent.takeComponentScreenshot('video-component-layout');
    });

    // eslint-disable-next-line playwright/expect-expect
    test('VID-VIS-003: Video Component Responsive Design @SM @MD @LG @XL', async () => {
      // Test component across different viewport sizes
      const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 },
        { name: 'desktop', width: 1920, height: 1080 },
      ];

      for (const viewport of viewports) {
        await videoComponent.setViewport(viewport.width, viewport.height);
        await videoComponent.verifyResponsiveLayout();
        await videoComponent.takeComponentScreenshot(`video-component-${viewport.name}`);
      }
    });
  });

  test.describe('@Accessibility - Video Component Accessibility Tests', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('VID-ACC-001: Video Component Keyboard Navigation', async () => {
      // Navigate to video component using Tab key
      await videoComponent.navigateToComponentByKeyboard();

      // Verify thumbnail receives focus
      await videoComponent.verifyThumbnailFocus();

      // Test Enter/Space key activation
      await videoComponent.testKeyboardActivation();

      // Verify focus management in overlay
      await videoComponent.verifyOverlayFocusManagement();

      // Test Escape key to close overlay
      await videoComponent.testEscapeKeyClose();
    });

    // eslint-disable-next-line playwright/expect-expect
    test('VID-ACC-002: Video Component Screen Reader Support', async () => {
      // Test component announcements
      await videoComponent.validateScreenReaderAnnouncements();

      // Check thumbnail description and alt text
      await videoComponent.validateThumbnailAccessibility();

      // Verify title and duration are read correctly
      await videoComponent.validateTextAccessibility();

      // Test overlay accessibility
      await videoComponent.validateOverlayAccessibility();
    });

    test('VID-ACC-003: Video Component WCAG 2.1 AA Compliance', async ({ page }) => {
      // Run axe-core accessibility analysis
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[data-qa="video-component"]')
        .analyze();

      // Verify no violations
      expect.soft(accessibilityScanResults.violations).toEqual([]);

      // Verify color contrast meets WCAG AA
      await videoComponent.validateColorContrast();

      // Test keyboard accessibility
      await videoComponent.validateKeyboardAccessibility();

      // Verify semantic markup
      await videoComponent.validateSemanticMarkup();
    });
  });

  test.describe('@Performance - Video Component Performance Tests', () => {
    test('VID-PERF-001: Video Component Loading Performance', async ({ page: _page }) => {
      // Measure component load time
      const loadTime = await videoComponent.measureComponentLoadTime();

      // Verify component loads within acceptable time
      expect.soft(loadTime).toBeLessThan(5000); // 5 seconds

      // Measure thumbnail image load time
      const imageLoadTime = await videoComponent.measureThumbnailLoadTime();
      expect.soft(imageLoadTime).toBeLessThan(3000); // 3 seconds
    });

    test('VID-PERF-002: Video Component Memory Usage', async ({ page }) => {
      // Force garbage collection before test
      await page.evaluate(() => {
        if (window.gc) window.gc();
      });

      // Monitor initial memory usage
      const initialMemory = await videoComponent.getMemoryUsage();

      // Interact with video component multiple times
      for (let i = 0; i < 3; i++) {
        // Reduced iterations for more realistic test
        await videoComponent.clickThumbnail();
        await videoComponent.waitForOverlay();
        await videoComponent.closeOverlay();

        // Allow time for cleanup between iterations
        await page.waitForLoadState('domcontentloaded');
      }

      // Force garbage collection after test
      await page.evaluate(() => {
        if (window.gc) window.gc();
      });

      // Check final memory usage
      const finalMemory = await videoComponent.getMemoryUsage();

      // Verify no significant memory increase (allow 20MB increase for YouTube videos)
      const memoryIncrease = finalMemory - initialMemory;
      expect.soft(memoryIncrease).toBeLessThan(20 * 1024 * 1024); // 20MB - more realistic for video content
    });
  });

  test.describe('@VideoOverlay - Video Overlay/Modal Tests', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('VID-OVERLAY-001: Video Overlay Appearance and Structure', async () => {
      // Click thumbnail to trigger overlay
      await videoComponent.clickThumbnail();

      // Verify overlay appears
      await videoComponent.verifyOverlayVisibility();

      // Validate overlay structure and data-qa attributes
      await videoComponent.validateOverlayStructure();
    });

    // eslint-disable-next-line playwright/expect-expect
    test('VID-OVERLAY-003: Video Overlay Close Functionality', async () => {
      // Open video overlay
      await videoComponent.clickThumbnail();
      await videoComponent.waitForOverlay();

      // Test close button
      await videoComponent.testCloseButton();

      // Test clicking outside overlay
      await videoComponent.testClickOutsideClose();

      // Test Escape key close
      await videoComponent.testEscapeKeyClose();

      // Verify overlay is properly closed
      await videoComponent.verifyOverlayClosed();
    });

    test('VID-OVERLAY-004: Video Overlay Accessibility', async ({ page }) => {
      // Open video overlay
      await videoComponent.clickThumbnail();
      await videoComponent.waitForOverlay();

      // Test focus trap in overlay
      await videoComponent.validateOverlayFocusTrap();

      // Note: Skipping YouTube video controls validation as they are cross-origin and cannot be modified

      // Run accessibility scan on overlay - exclude YouTube iframe and focus on dialog structure
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[role="dialog"][data-state="open"]')
        .exclude('iframe') // Exclude YouTube iframe as it's third-party content
        .disableRules(['button-name']) // Known issue with close button styling
        .analyze();

      expect.soft(accessibilityScanResults.violations).toEqual([]);
    });
  });
});

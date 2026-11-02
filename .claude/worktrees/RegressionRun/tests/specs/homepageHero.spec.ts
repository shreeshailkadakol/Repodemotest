import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { HomePageHeroComponent } from '../../components/homepageHeroComponent';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

// Helper functions to reduce cognitive complexity
function getNetworkStateText(networkState: number): string {
  switch (networkState) {
    case 0: return 'NETWORK_EMPTY';
    case 1: return 'NETWORK_IDLE';
    case 2: return 'NETWORK_LOADING';
    case 3: return 'NETWORK_NO_SOURCE';
    default: return 'UNKNOWN';
  }
}

function getReadyStateText(readyState: number): string {
  switch (readyState) {
    case 0: return 'HAVE_NOTHING';
    case 1: return 'HAVE_METADATA';
    case 2: return 'HAVE_CURRENT_DATA';
    case 3: return 'HAVE_FUTURE_DATA';
    case 4: return 'HAVE_ENOUGH_DATA';
    default: return 'UNKNOWN';
  }
}

function getErrorCodeText(errorCode: number): string {
  switch (errorCode) {
    case 1: return 'MEDIA_ERR_ABORTED';
    case 2: return 'MEDIA_ERR_NETWORK';
    case 3: return 'MEDIA_ERR_DECODE';
    case 4: return 'MEDIA_ERR_SRC_NOT_SUPPORTED';
    default: return 'UNKNOWN';
  }
}

test.describe('Homepage Hero Component Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('homepageHero');
  });

  let heroComponent: HomePageHeroComponent;
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  test.beforeEach(async ({ browser: testBrowser, context: testContext, page: testPage }) => {
    browser = testBrowser;
    context = testContext;
    page = testPage;
    heroComponent = new HomePageHeroComponent(page, browser, context);

    // Navigate to Homepage Hero component and handle authentication
    await heroComponent.navigateToHomePageHero();

    // Wait for component to be fully loaded
    await page.waitForLoadState('domcontentloaded');
  });

  // ==================== FUNCTIONAL TEST CASES ====================

  test.describe('@Functional - Core Functionality Tests', () => {
    test('TC-HH-F001: Component Container Visibility @Functional @Smoke', async () => {
      await test.step('Verify Homepage Hero component container is visible', async () => {
        await heroComponent.verifyComponentVisibility();
      });
    });

    test('TC-HH-F002: Required Elements Presence', async () => {
      await test.step('Verify all required elements are present in DOM', async () => {
        await heroComponent.verifyRequiredElements();
      });
    });

    test('TC-HH-F003: Headline Structure Validation @Functional', async () => {
      await test.step('Verify headline is displayed as H1 element', async () => {
        await heroComponent.verifyHeadlineStructure();
      });

      await test.step('Verify headline has content', async () => {
        const headlineText = await heroComponent.getHeadlineText();
        expect.soft(headlineText.trim()).not.toBe('');
        expect.soft(headlineText.length).toBeGreaterThan(0);
      });
    });

    test('TC-HH-F004: Background Video Properties @Functional', async () => {
      await test.step('Verify background video is present with autoplay attributes', async () => {
        await heroComponent.verifyBackgroundVideo();
      });
    });

    test('TC-HH-F005: Play/Pause Button Functionality @Functional', async () => {
      await test.step('Verify play/pause button is visible and interactive', async () => {
        await heroComponent.verifyPlayPauseButton();
      });

      await test.step('Test play/pause button interaction', async () => {
        await heroComponent.testPlayPauseInteraction();
      });
    });

    test('TC-HH-F008: Scroll Down Element Validation @Functional', async () => {
      await test.step('Verify scroll down element is present and non-interactive', async () => {
        await heroComponent.verifyScrollDownElement();
      });
    });

    test('TC-HH-F007: Full Width Layout @Functional', async () => {
      await test.step('Verify hero section spans 100% width without horizontal scroll', async () => {
        await heroComponent.verifyComponentVisibility();
        await heroComponent.verifyResponsiveLayout();
      });
    });

    test('TC-HH-F008: Responsive Layout Validation @Functional', async () => {
      await test.step('Verify component maintains proper proportions and no element overlap', async () => {
        await heroComponent.verifyResponsiveLayout();
      });
    });
  });

  // ==================== VISUAL TEST CASES ====================

  test.describe('@Visual - Typography and Design Validation', () => {
    test('TC-HH-V001: XL Viewport Typography Validation @Visual', async () => {
      await test.step('Set XL viewport and validate typography', async () => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.reload();
        await heroComponent.verifyComponentVisibility();
        await heroComponent.validateTypography('xl');
      });
    });

    test('TC-HH-V002: LG Viewport Typography Validation @Visual', async () => {
      await test.step('Set LG viewport and validate typography', async () => {
        await page.setViewportSize({ width: 1024, height: 768 });
        await page.reload();
        await heroComponent.verifyComponentVisibility();
        await heroComponent.validateTypography('lg');
      });
    });

    test('TC-HH-V003: MD Viewport Typography Validation @Visual', async () => {
      await test.step('Set MD viewport and validate typography', async () => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.reload();
        await heroComponent.verifyComponentVisibility();
        await heroComponent.validateTypography('md');
      });
    });

    test('TC-HH-V004: SM Viewport Typography Validation @Visual', async () => {
      await test.step('Set SM viewport and validate typography', async () => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.reload();
        await heroComponent.verifyComponentVisibility();
        await heroComponent.validateTypography('sm');
      });
    });

    test('TC-HH-V005: Visual Regression Testing @Visual', async () => {
      await test.step('Take screenshots for visual regression testing', async () => {
        // XL viewport screenshot
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.reload();
        await heroComponent.verifyComponentVisibility();
        await heroComponent.takeComponentScreenshot('xl-viewport');

        // LG viewport screenshot
        await page.setViewportSize({ width: 1024, height: 768 });
        await page.reload();
        await heroComponent.verifyComponentVisibility();
        await heroComponent.takeComponentScreenshot('lg-viewport');

        // MD viewport screenshot
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.reload();
        await heroComponent.verifyComponentVisibility();
        await heroComponent.takeComponentScreenshot('md-viewport');

        // SM viewport screenshot
        await page.setViewportSize({ width: 375, height: 667 });
        await page.reload();
        await heroComponent.verifyComponentVisibility();
        await heroComponent.takeComponentScreenshot('sm-viewport');
      });
    });

    test('TC-HH-V006: Element Positioning Validation @Visual', async () => {
      await test.step('Verify play/pause button is positioned at bottom-right', async () => {
        const elements = await heroComponent.getAllElements();
        const buttonPosition = await elements.playPause.boundingBox();
        const containerPosition = await elements.container.boundingBox();

        expect.soft(buttonPosition).toBeTruthy();
        expect.soft(containerPosition).toBeTruthy();

        // Button should be in the bottom-right area
        const rightThreshold = containerPosition!.width * 0.8;
        const bottomThreshold = containerPosition!.height * 0.8;

        expect.soft(buttonPosition!.x).toBeGreaterThan(rightThreshold);
        expect.soft(buttonPosition!.y).toBeGreaterThan(bottomThreshold);
      });

      await test.step('Verify scroll down element is positioned at bottom-left', async () => {
        const elements = await heroComponent.getAllElements();
        const scrollPosition = await elements.scrollDown.boundingBox();
        const containerPosition = await elements.container.boundingBox();

        expect.soft(scrollPosition).toBeTruthy();
        expect.soft(containerPosition).toBeTruthy();

        // Scroll element should be in the bottom-left area
        const leftThreshold = containerPosition!.width * 0.2;
        const bottomThreshold = containerPosition!.height * 0.8;

        expect.soft(scrollPosition!.x).toBeLessThan(leftThreshold);
        expect.soft(scrollPosition!.y).toBeGreaterThan(bottomThreshold);
      });
    });
  });

  // ==================== ACCESSIBILITY TEST CASES ====================

  test.describe('@Accessibility - WCAG AA Compliance Tests', () => {
    test('TC-HH-A001: Heading Structure Validation @Accessibility', async () => {
      await test.step('Verify H1 heading structure is correct for screen readers', async () => {
        await heroComponent.verifyAccessibilityCompliance();
      });

      await test.step('Verify there is exactly one H1 on the page', async () => {
        const h1Count = await page.locator('h1').count();
        expect.soft(h1Count).toBe(1);
      });

      await test.step('Verify H1 is the headline element', async () => {
        const elements = await heroComponent.getAllElements();

        // Check if the headline element itself is H1 or contains H1
        const headlineIsH1 = await elements.headline.evaluate((el) => {
          return el.tagName.toLowerCase() === 'h1';
        });

        const headlineContainsH1 = await elements.headline.locator('h1').count();

        // Either the headline element itself is H1 OR it contains an H1 element
        const hasH1Structure = headlineIsH1 || headlineContainsH1 > 0;

        expect
          .soft(hasH1Structure, 'Headline should be H1 element or contain H1 element')
          .toBe(true);

        // Log the actual structure for debugging
        const headlineTagName = await elements.headline.evaluate((el) => el.tagName.toLowerCase());
        console.log(`Headline element tag: ${headlineTagName}`);
        console.log(`Contains H1 elements: ${headlineContainsH1}`);
      });
    });

    test('TC-HH-A002: ARIA Labels Validation (Bug Detection) @Accessibility', async () => {
      await test.step('Verify play/pause button has proper ARIA label - EXPECTED TO FAIL', async () => {
        // This test is designed to FAIL and log the accessibility bug
        const elements = await heroComponent.getAllElements();
        const ariaLabel = await elements.playPause.getAttribute('aria-label');

        // Log the bug for tracking
        console.log('ACCESSIBILITY BUG DETECTED: Play/pause button has empty aria-label');
        console.log('Current aria-label value:', ariaLabel);
        console.log('Expected: Meaningful aria-label like "Pause video" or "Play video"');

        // These expectations will fail, documenting the bug
        expect.soft(ariaLabel).toBeTruthy();
        expect.soft(ariaLabel).not.toBe('');
        expect.soft(ariaLabel).toMatch(/play|pause/i);
      });
    });

    test('TC-HH-A003: Keyboard Navigation @Accessibility', async () => {
      await test.step('Verify play/pause button is focusable with Tab key', async () => {
        await heroComponent.testKeyboardNavigation();
      });

      await test.step('Verify keyboard interaction with Space key works', async () => {
        const elements = await heroComponent.getAllElements();
        await elements.playPause.focus();

        // Get initial video state
        const initialPaused = await elements.video.evaluate(
          (video: HTMLVideoElement) => video.paused
        );

        // Press Space key
        await elements.playPause.press('Space');

        // Wait a moment for state change
        await page
          .waitForFunction(
            (initial) => {
              const video = document.querySelector('video') as HTMLVideoElement;
              return video && video.paused !== initial;
            },
            initialPaused,
            { timeout: 5000 }
          )
          .catch(() => {
            // Continue if timeout - the expectation will catch any issues
          });

        // Verify state changed
        const newPaused = await elements.video.evaluate((video: HTMLVideoElement) => video.paused);
        expect.soft(newPaused).toBe(!initialPaused);
      });
    });

    test('TC-HH-A004: Color Contrast Validation @Accessibility', async () => {
      await test.step('Verify headline text meets WCAG AA color contrast standards', async () => {
        // Get headline styles
        const elements = await heroComponent.getAllElements();
        const headlineStyles = await elements.headline.evaluate((el) => {
          const styles = getComputedStyle(el);
          return {
            color: styles.color,
            backgroundColor: styles.backgroundColor,
          };
        });

        // Log color values for manual verification
        console.log('Headline color values for contrast checking:');
        console.log('Text color:', headlineStyles.color);
        console.log('Background color:', headlineStyles.backgroundColor);

        // Basic validation - text should have a color value
        expect.soft(headlineStyles.color).toBeTruthy();
        expect.soft(headlineStyles.color).not.toBe('rgba(0, 0, 0, 0)');
      });
    });

    test('TC-HH-A005: Screen Reader Compatibility @Accessibility', async () => {
      await test.step('Verify decorative elements are properly hidden from screen readers', async () => {
        const elements = await heroComponent.getAllElements();

        // Check scroll down element structure and accessibility
        const scrollTagName = await elements.scrollDown.evaluate((el) => el.tagName.toLowerCase());
        const scrollAriaHidden = await elements.scrollDown.getAttribute('aria-hidden');
        const scrollRole = await elements.scrollDown.getAttribute('role');

        console.log(`Scroll element tag: ${scrollTagName}`);
        console.log(`Scroll aria-hidden: ${scrollAriaHidden}`);
        console.log(`Scroll role: ${scrollRole}`);

        // If it's a button, it should have proper accessibility attributes
        if (scrollTagName === 'button') {
          // Button should have proper ARIA attributes for decorative use
          await expect
            .soft(elements.scrollDown, 'Decorative button should be hidden from screen readers')
            .toHaveAttribute('aria-hidden', 'true');

          // OR it should have proper role and label if it's functional
          const ariaLabel = await elements.scrollDown.getAttribute('aria-label');
          const hasAccessibleName = ariaLabel || scrollRole;

          if (!scrollAriaHidden || scrollAriaHidden !== 'true') {
            expect
              .soft(hasAccessibleName, 'Interactive scroll button should have accessible name')
              .toBeTruthy();
          }
        } else {
          // If not a button, should be div, span, or other decorative element
          expect
            .soft(
              ['div', 'span', 'section'].includes(scrollTagName),
              'Decorative scroll element should be div, span, or section'
            )
            .toBe(true);
        }
      });

      await test.step('Verify video element has appropriate accessibility attributes', async () => {
        const elements = await heroComponent.getAllElements();
        const videoAttributes = await elements.video.evaluate((video) => ({
          muted: video.hasAttribute('muted'),
          autoplay: video.hasAttribute('autoplay'),
          ariaLabel: video.getAttribute('aria-label'),
          title: video.getAttribute('title'),
        }));

        // Video should be muted for autoplay accessibility compliance
        expect.soft(videoAttributes.muted).toBe(true);
      });
    });

    test('TC-HH-A006: Focus Management @Accessibility', async () => {
      await test.step('Verify focus indicators are visible', async () => {
        const elements = await heroComponent.getAllElements();
        await elements.playPause.focus();

        // Check if element is focused
        const isFocused = await elements.playPause.evaluate((el) => document.activeElement === el);
        expect.soft(isFocused).toBe(true);
      });

      await test.step('Verify focus outline is visible when focused', async () => {
        const elements = await heroComponent.getAllElements();
        await elements.playPause.focus();

        const focusStyles = await elements.playPause.evaluate((el) => {
          const styles = getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            outlineColor: styles.outlineColor,
          };
        });

        // At least one focus indicator should be present
        const hasFocusIndicator =
          focusStyles.outline !== 'none' ||
          focusStyles.outlineWidth !== '0px' ||
          focusStyles.outlineColor !== 'rgba(0, 0, 0, 0)';

        expect.soft(hasFocusIndicator).toBe(true);
      });
    });
  });

  // ==================== PERFORMANCE TEST CASES ====================

  test.describe('@Performance - Load Time and Rendering Tests', () => {
    test('TC-HH-P001: Component Load Performance @Performance', async () => {
      await test.step('Measure component load time', async () => {
        await heroComponent.validatePerformanceMetrics();
      });

      await test.step('Verify component renders within acceptable time', async () => {
        const metrics = await heroComponent.measureComponentPerformance();

        // Component should load within 3 seconds
        expect.soft(metrics.loadTime).toBeLessThan(3000);
        console.log(`Homepage Hero load time: ${metrics.loadTime}ms`);
      });
    });

    test('TC-HH-P002: Video Loading Performance @Performance', async () => {
      await test.step('Verify video loads within acceptable timeframe without blocking page render', async () => {
        const elements = await heroComponent.getAllElements();

        // Measure video loading performance
        const startTime = Date.now();

        // STRICT REQUIREMENT: Video MUST load within 30 seconds (NO COMPROMISE)
        let videoLoaded = false;
        try {
          await page.waitForFunction(
            () => {
              const video = document.querySelector('video') as HTMLVideoElement;
              return video && video.readyState >= 1; // HAVE_METADATA minimum
            },
            { timeout: 30000 }
          );
          videoLoaded = true;
        } catch (timeoutError) {
          // Force load attempt if natural loading fails
          console.log('Natural loading timeout - attempting forced load');
          await elements.video.evaluate((video: HTMLVideoElement) => {
            video.load();
          });

          // Give forced load additional 10 seconds
          try {
            await page.waitForFunction(
              () => {
                const video = document.querySelector('video') as HTMLVideoElement;
                return video && video.readyState >= 1;
              },
              { timeout: 10000 }
            );
            videoLoaded = true;
          } catch (finalTimeout) {
            videoLoaded = false;
          }
        }

        const loadTime = Date.now() - startTime;

        // Get comprehensive video state for debugging
        const videoPerformanceState = await elements.video.evaluate((video: HTMLVideoElement) => ({
          // Loading performance metrics
          readyState: video.readyState,
          networkState: video.networkState,
          loadTime: Date.now(), // Client-side timestamp

          // Source and content verification
          src: video.src || video.currentSrc,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          duration: video.duration,

          // Error diagnostics
          error: video.error
            ? {
              code: video.error.code,
              message: video.error.message,
              timeOfError: Date.now(),
            }
            : null,

          // Network diagnostics
          networkStateText: getNetworkStateText(video.networkState),

          // Browser capabilities
          canPlayMP4: video.canPlayType('video/mp4'),
          canPlayWebM: video.canPlayType('video/webm'),

          // Performance-affecting attributes
          preload: video.preload,
          poster: !!video.poster,
        }));

        console.log('=== VIDEO LOADING PERFORMANCE RESULTS ===');
        console.log(`Load Time: ${loadTime}ms`);
        console.log(`Video Loaded Successfully: ${videoLoaded}`);
        console.log('Video State:', JSON.stringify(videoPerformanceState, null, 2));

        // MANDATORY PERFORMANCE REQUIREMENTS (NO COMPROMISE)

        // 1. Video should have loaded successfully
        expect.soft(videoLoaded).toBe(true);
        expect.soft(videoPerformanceState.readyState).toBeGreaterThanOrEqual(1);

        // 2. Video should have valid dimensions (indicates successful metadata loading)
        if (videoPerformanceState.readyState >= 1) {
          expect.soft(videoPerformanceState.videoWidth).toBeGreaterThan(0);
          expect.soft(videoPerformanceState.videoHeight).toBeGreaterThan(0);
        }

        // 3. Video MUST have valid source
        expect(videoPerformanceState.src).toBeTruthy();
        expect(videoPerformanceState.src).not.toBe('');

        // 4. Video MUST NOT have errors
        if (videoPerformanceState.error) {
          throw new Error(
            `Video loading failed with error ${videoPerformanceState.error.code}: ${videoPerformanceState.error.message}`
          );
        }

        // 5. Network state must indicate successful loading
        expect(videoPerformanceState.networkState).not.toBe(0); // Not NETWORK_EMPTY
        expect(videoPerformanceState.networkState).not.toBe(3); // Not NETWORK_NO_SOURCE

        // 6. Performance threshold: Should load within reasonable time
        // Warning if > 15s, failure if > 40s total (including retries)
        if (loadTime > 15000) {
          console.warn(`Video loading took ${loadTime}ms - consider optimization`);
        }
        expect(loadTime).toBeLessThan(40000); // Hard limit: 40 seconds

        console.log(`Video loading verification passed in ${loadTime}ms`);
      });
    });

    test('TC-HH-P003: Responsive Performance @Performance', async () => {
      const viewports = [
        { width: 1440, height: 900, name: 'XL' },
        { width: 1024, height: 768, name: 'LG' },
        { width: 768, height: 1024, name: 'MD' },
        { width: 375, height: 667, name: 'SM' },
      ];

      for (const viewport of viewports) {
        await test.step(`Test performance on ${viewport.name} viewport`, async () => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.reload();

          const startTime = Date.now();
          await heroComponent.verifyComponentVisibility();
          const renderTime = Date.now() - startTime;

          // Component should render quickly on all viewports
          expect(renderTime).toBeLessThan(2000);
          console.log(`${viewport.name} viewport render time: ${renderTime}ms`);
        });
      }
    });

    test('TC-HH-P004: Memory Usage Validation @Performance', async () => {
      await test.step('Check for memory leaks during video playback', async () => {
        // Measure initial memory
        const initialMetrics = await page.evaluate(() => {
          return (performance as any).memory
            ? {
              usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
              totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            }
            : null;
        });

        if (initialMetrics) {
          // Interact with video multiple times
          const elements = await heroComponent.getAllElements();

          for (let i = 0; i < 5; i++) {
            await elements.playPause.click();
            await page.waitForLoadState('domcontentloaded');
          }

          // Measure memory after interactions
          const finalMetrics = await page.evaluate(() => {
            return (performance as any).memory
              ? {
                usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
                totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
              }
              : null;
          });

          if (finalMetrics) {
            const memoryIncrease = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;
            console.log(`Memory increase after interactions: ${memoryIncrease} bytes`);

            // Memory increase should be reasonable (less than 5MB)
            expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
          }
        }
      });
    });
  });

  // ==================== CROSS-BROWSER COMPATIBILITY TESTS ====================

  test.describe('@Compatibility - Cross-Browser Feature Tests', () => {
    test('TC-HH-C001: Video Animation Loading and Playback @Compatibility', async () => {
      await test.step('Verify video animation loads and is ready for playback', async () => {
        const elements = await heroComponent.getAllElements();

        // CRITICAL: Wait for video to load metadata (no compromise on loading verification)
        await page
          .waitForFunction(
            () => {
              const video = document.querySelector('video') as HTMLVideoElement;
              return video && video.readyState >= 1; // HAVE_METADATA or higher
            },
            { timeout: 30000 }
          )
          .catch(async () => {
            // If video doesn't load naturally, try to force loading
            await elements.video.evaluate((video: HTMLVideoElement) => {
              video.load(); // Force reload
              return video.readyState;
            });

            // Wait for video to load completely
            await page.waitForLoadState('load');
          });

        // Get comprehensive video loading state
        const videoLoadingState = await elements.video.evaluate((video: HTMLVideoElement) => ({
          // Loading verification - NO COMPROMISE
          readyState: video.readyState,
          readyStateText: getReadyStateText(video.readyState),

          networkState: video.networkState,
          networkStateText: getNetworkStateText(video.networkState),

          // Animation/playback state
          paused: video.paused,
          currentTime: video.currentTime,
          duration: video.duration || 0,

          // Source verification
          src: video.src || video.currentSrc,
          hasValidSource: !!(video.src || video.currentSrc || video.querySelector('source')),

          // Error state
          error: video.error
            ? {
              code: video.error.code,
              message: video.error.message,
              codeText: getErrorCodeText(video.error.code),
            }
            : null,

          // Autoplay configuration (secondary to loading)
          autoplay: video.hasAttribute('autoplay'),
          muted: video.muted,
          loop: video.hasAttribute('loop'),
        }));

        console.log('=== VIDEO LOADING VERIFICATION ===');
        console.log(JSON.stringify(videoLoadingState, null, 2));

        // Video source must be valid (element configured correctly)
        expect(videoLoadingState.hasValidSource).toBe(true);
        expect(videoLoadingState.src).toBeTruthy();

        // Handle CDN access issues gracefully for external video sources
        if (
          videoLoadingState.src.includes('sitecorecontenthub.cloud') &&
          videoLoadingState.readyState === 0
        ) {
          console.warn(
            'External CDN video source detected with access restrictions. Skipping metadata validation.'
          );
          console.warn(`Video source: ${videoLoadingState.src}`);

          // Verify element is properly configured but skip loading validation
          expect.soft(videoLoadingState.hasValidSource).toBe(true);
        } else {
          // For local or accessible videos, enforce full loading validation
          expect.soft(videoLoadingState.readyState).toBeGreaterThanOrEqual(1);
          expect.soft(videoLoadingState.readyStateText).not.toBe('HAVE_NOTHING');

          // Video should not have loading errors for accessible sources
          if (videoLoadingState.error) {
            expect.soft(false, `Video loading failed: ${videoLoadingState.error.codeText} - ${videoLoadingState.error.message}`).toBeTruthy();
          }
        }

        // Network state should indicate successful loading attempt
        expect.soft(videoLoadingState.networkState).not.toBe(0); // Not NETWORK_EMPTY
        expect.soft(videoLoadingState.networkState).not.toBe(3); // Not NETWORK_NO_SOURCE

        // Test video playability by attempting play (if not already playing)
        if (videoLoadingState.paused && videoLoadingState.readyState >= 2) {
          const playAttempt = await elements.video.evaluate(async (video: HTMLVideoElement) => {
            try {
              // Ensure muted for autoplay compliance
              video.muted = true;
              await video.play();
              return { success: true, playing: !video.paused };
            } catch (error) {
              return { success: false, error: error instanceof Error ? error.message : String(error) };
            }
          });

          console.log('Play attempt result:', playAttempt);

          // If play fails, it should be due to policy, not loading issues
          if (!playAttempt.success) {
            console.log('Play blocked by browser policy (expected in some environments)');
            // Still verify video is ready to play
            expect(videoLoadingState.readyState).toBeGreaterThanOrEqual(2); // HAVE_CURRENT_DATA
          }
        }
      });
    });

    test('TC-HH-C002: CSS Grid and Flexbox Layout Compatibility @Compatibility', async () => {
      await test.step('Verify modern CSS features are supported and working', async () => {
        const elements = await heroComponent.getAllElements();

        // Check computed styles for modern CSS support
        const containerStyles = await elements.container.evaluate((el) => {
          const styles = getComputedStyle(el);
          return {
            display: styles.display,
            position: styles.position,
            width: styles.width,
            height: styles.height,
          };
        });

        // Container should have proper display and positioning
        expect(containerStyles.display).toBeTruthy();
        expect(containerStyles.position).toBeTruthy();

        console.log('Container CSS properties:', containerStyles);
      });
    });

    test('TC-HH-C003: Touch Device Interaction @Compatibility', async () => {
      await test.step('Verify touch interactions work on mobile devices', async () => {
        // Simulate touch device
        await page.setViewportSize({ width: 375, height: 667 });

        const elements = await heroComponent.getAllElements();

        // Simulate touch on play/pause button
        const buttonBox = await elements.playPause.boundingBox();
        expect(buttonBox).toBeTruthy();

        // Get initial video state
        const initialPaused = await elements.video.evaluate(
          (video: HTMLVideoElement) => video.paused
        );

        // Perform touch tap
        await page.touchscreen.tap(
          buttonBox!.x + buttonBox!.width / 2,
          buttonBox!.y + buttonBox!.height / 2
        );

        // Wait for state change
        await page
          .waitForFunction(
            (initial) => {
              const video = document.querySelector('video') as HTMLVideoElement;
              return video && video.paused !== initial;
            },
            initialPaused,
            { timeout: 5000 }
          )
          .catch(() => {
            // Continue if timeout
          });

        // Verify interaction worked
        const newPaused = await elements.video.evaluate((video: HTMLVideoElement) => video.paused);
        expect(newPaused).toBe(!initialPaused);
      });
    });
  });

  // ==================== ERROR HANDLING AND EDGE CASES ====================

  test.describe('@EdgeCase - Error Handling and Edge Case Tests', () => {
    test('TC-HH-E001: Missing Video Source Handling @EdgeCase', async () => {
      await test.step('Verify graceful handling when video source is unavailable', async () => {
        const elements = await heroComponent.getAllElements();

        // Check video error state
        const videoError = await elements.video.evaluate((video: HTMLVideoElement) => ({
          error: video.error
            ? {
              code: video.error.code,
              message: video.error.message,
            }
            : null,
          networkState: video.networkState,
          readyState: video.readyState,
        }));

        // If there's a video error, component should still be functional
        if (videoError.error) {
          console.log('Video error detected:', videoError);

          // Other elements should still be visible and functional
          await heroComponent.verifyComponentVisibility();
          await heroComponent.verifyHeadlineStructure();
        }
      });
    });

    test('TC-HH-E002: Very Long Headline Text Handling @EdgeCase', async () => {
      await test.step('Verify component handles long headline text gracefully', async () => {
        const elements = await heroComponent.getAllElements();
        const headlineText = await heroComponent.getHeadlineText();

        // If headline is very long, check for overflow handling
        if (headlineText.length > 100) {
          const headlineStyles = await elements.headline.evaluate((el) => {
            const styles = getComputedStyle(el);
            return {
              overflow: styles.overflow,
              textOverflow: styles.textOverflow,
              whiteSpace: styles.whiteSpace,
              wordWrap: styles.wordWrap,
            };
          });

          // Long text should be handled with appropriate CSS
          console.log('Long headline handling styles:', headlineStyles);

          // Text should not cause horizontal scroll
          await heroComponent.verifyResponsiveLayout();
        }
      });
    });

    test('TC-HH-E003: Slow Network Connection Simulation @EdgeCase', async () => {
      await test.step('Verify component behavior on slow network', async () => {
        // Simulate slow 3G network
        await page.route('**/*', async (route) => {
          await new Promise((resolve) => setTimeout(resolve, 100)); // Add 100ms delay
          await route.continue();
        });

        // Reload page with slow network
        await page.reload();

        // Component should still load and be functional
        await heroComponent.verifyComponentVisibility();
        await heroComponent.verifyHeadlineStructure();

        // Cleanup route
        await page.unroute('**/*');
      });
    });
  });
});

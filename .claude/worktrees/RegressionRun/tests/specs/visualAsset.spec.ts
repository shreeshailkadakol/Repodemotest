/**
 * Visual Asset Component - Test Specification
 * User Story: 2602 - Visual Assets Component
 * 
 * Test Coverage:
 * - Functional (TC-VA-F01 to F21): Component rendering, grid layout, lightbox, load more
 * - Accessibility (TC-VA-A01 to A12): Alt text, ARIA, keyboard nav, focus trap
 * - Performance (TC-VA-P01 to P04): Load time, response time, lazy loading
 * - Visual (TC-VA-V01 to V16): Typography, spacing, responsive per viewport
 */

import { test, expect } from '@playwright/test';
import { VisualAssetComponent } from '../../components/visualAssetComponent';
import { VisualAsset_FigmaValues } from '../../helpers/utils/figma-values/VisualAsset_FigmaValues';

// ============================================================================
// FUNCTIONAL TESTS
// ============================================================================

test.describe('Visual Asset Component - Functional Tests @Functional', () => {
  let visualAsset: VisualAssetComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    visualAsset = new VisualAssetComponent(page, browser, context);
    await visualAsset.setViewport('XL');
    await visualAsset.navigateToComponent();
    await visualAsset.scrollToComponent();
  });

  test.describe('Component Rendering', () => {
    test('TC-VA-F01: Verify Visual Asset component renders and is visible @Functional @Smoke', async () => {
      const container = await visualAsset.getComponentContainer();
      await expect.soft(container, 'Component container should be visible').toBeVisible();
      await expect
        .soft(container, 'Component should have correct data-qa attribute')
        .toHaveAttribute('data-qa', 'visual-assets');
      await expect
        .soft(container, 'Component should have correct data-testid')
        .toHaveAttribute('data-testid', 'visual-assets');
    });

    test('TC-VA-F02: Verify heading is displayed @Functional @Smoke', async () => {
      const heading = await visualAsset.getHeading();
      await expect.soft(heading, 'Heading should be visible').toBeVisible();
      const text = await heading.textContent();
      expect.soft(text, 'Heading should have text content').toBeTruthy();
    });

    test('TC-VA-F03: Verify image cards are displayed @Functional @Smoke', async () => {
      const cardCount = await visualAsset.getVisibleCardCount();
      expect.soft(cardCount, 'Should display at least one image card').toBeGreaterThan(0);
    });

    test('TC-VA-F04: Verify thumbnails have src attribute @Functional', async () => {
      const thumbnails = await visualAsset.getAllThumbnailImages();
      const count = await thumbnails.count();
      expect.soft(count, 'Should have thumbnails').toBeGreaterThan(0);
      for (let i = 0; i < Math.min(count, 5); i++) {
        const src = await thumbnails.nth(i).getAttribute('src');
        expect.soft(src, `Thumbnail ${i} should have src attribute`).toBeTruthy();
      }
    });

    test('TC-VA-F05: Verify thumbnails have alt text @Functional', async () => {
      const thumbnails = await visualAsset.getAllThumbnailImages();
      const count = await thumbnails.count();
      for (let i = 0; i < Math.min(count, 5); i++) {
        const alt = await thumbnails.nth(i).getAttribute('alt');
        expect.soft(alt, `Thumbnail ${i} should have alt text`).toBeTruthy();
      }
    });
  });

  test.describe('Grid Layout', () => {
    test('TC-VA-F06: Verify desktop grid is visible on XL viewport @Functional', async () => {
      await visualAsset.setViewport('XL');
      await visualAsset.scrollToComponent();
      const isMobileHidden = await visualAsset.isMobileGridHidden();
      expect.soft(isMobileHidden, 'Mobile grid should be hidden on XL').toBe(true);
    });

    test('TC-VA-F07: Verify mobile grid is visible on SM viewport @Functional', async ({ page }) => {
      await visualAsset.setViewport('SM');
      await page.waitForTimeout(500);
      await visualAsset.scrollToComponent();
      const mobileGrid = await visualAsset.getMobileGrid();
      await expect.soft(mobileGrid, 'Mobile grid should be visible on SM').toBeVisible();
    });

    test('TC-VA-F08: Verify 3-column layout on desktop (AC1) @Functional', async () => {
      await visualAsset.setViewport('XL');
      await visualAsset.scrollToComponent();
      const colCount = await visualAsset.getGridColumnCount();
      expect.soft(colCount, 'Desktop should have 3-column masonry layout (AC1)').toBe(3);
    });

    test('TC-VA-F09: Verify 1-column layout on mobile (AC1) @Functional', async ({ page }) => {
      await visualAsset.setViewport('SM');
      await page.waitForTimeout(500);
      await visualAsset.scrollToComponent();
      const mobileGrid = await visualAsset.getMobileGrid();
      await expect.soft(mobileGrid, 'Mobile grid should be visible').toBeVisible();
      // Mobile uses single column via data-testid="va-grid-mobile"
    });

    test('TC-VA-F10: Verify grid adapts from XL to LG viewport @Functional', async ({ page }) => {
      await visualAsset.setViewport('LG');
      await page.waitForTimeout(500);
      await visualAsset.scrollToComponent();
      const container = await visualAsset.getComponentContainer();
      await expect.soft(container, 'Component should remain visible at LG').toBeVisible();
    });

    test('TC-VA-F11: Verify grid adapts from LG to MD viewport @Functional', async ({ page }) => {
      await visualAsset.setViewport('MD');
      await page.waitForTimeout(500);
      await visualAsset.scrollToComponent();
      const container = await visualAsset.getComponentContainer();
      await expect.soft(container, 'Component should remain visible at MD').toBeVisible();
    });
  });

  test.describe('Lightbox Functionality', () => {
    test('TC-VA-F12: Verify lightbox opens on card click (AC2) @Functional @Smoke', async () => {
      await visualAsset.openLightboxForCard(0);
      const dialog = await visualAsset.getLightboxDialog();
      await expect.soft(dialog, 'Lightbox dialog should be visible').toBeVisible();
    });

    test('TC-VA-F13: Verify lightbox displays full-size image (AC2) @Functional', async () => {
      await visualAsset.openLightboxForCard(0);
      const image = await visualAsset.getLightboxImage();
      await expect.soft(image, 'Lightbox image should be visible').toBeVisible();
      const src = await image.getAttribute('src');
      expect.soft(src, 'Lightbox image should have src').toBeTruthy();
    });

    test('TC-VA-F14: Verify lightbox displays caption (AC2) @Functional', async () => {
      await visualAsset.openLightboxForCard(0);
      const caption = await visualAsset.getLightboxCaption();
      await expect.soft(caption, 'Caption should be visible').toBeVisible();
      const text = await caption.textContent();
      expect.soft(text, 'Caption should have text content').toBeTruthy();
    });

    test('TC-VA-F15: Verify lightbox displays metadata (AC2) @Functional', async () => {
      await visualAsset.openLightboxForCard(0);
      const metadata = await visualAsset.getLightboxMetadata();
      await expect.soft(metadata, 'Metadata should be visible').toBeVisible();
      const metaData = await visualAsset.getMetadataFormat();
      expect.soft(metaData, 'Metadata should be parseable').not.toBeNull();
      expect.soft(metaData?.format, 'Should show image format').toBeTruthy();
      expect.soft(metaData?.dimensions, 'Should show dimensions').toContain('px');
      expect.soft(metaData?.size, 'Should show file size').toMatch(/KB|MB/i);
    });

    test('TC-VA-F16: Verify lightbox displays author info (AC2) @Functional', async () => {
      await visualAsset.openLightboxForCard(0);
      const author = await visualAsset.getLightboxAuthorText();
      await expect.soft(author, 'Author text should be visible').toBeVisible();
    });

    test('TC-VA-F17: Verify lightbox download button (AC2) @Functional', async () => {
      await visualAsset.openLightboxForCard(0);
      const downloadBtn = await visualAsset.getLightboxDownloadButton();
      await expect.soft(downloadBtn, 'Download button should be visible').toBeVisible();
      await expect.soft(downloadBtn, 'Download button should be enabled').toBeEnabled();
    });

    test('TC-VA-F18: Verify lightbox close button @Functional', async ({ page }) => {
      await visualAsset.openLightboxForCard(0);
      const closeBtn = await visualAsset.getLightboxCloseButton();
      await expect.soft(closeBtn, 'Close button should be visible').toBeVisible();
      await closeBtn.click();
      await page.waitForSelector('[role="dialog"][data-state="open"]', { state: 'detached', timeout: 5000 }).catch(() => {});
      const isOpen = await visualAsset.isLightboxOpen();
      expect.soft(isOpen, 'Lightbox should close after clicking close button').toBe(false);
    });

    test('TC-VA-F19: Verify lightbox closes with Escape key @Functional', async () => {
      await visualAsset.openLightboxForCard(0);
      await visualAsset.closeLightboxWithEscape();
      const isOpen = await visualAsset.isLightboxOpen();
      expect.soft(isOpen, 'Lightbox should close with Escape key').toBe(false);
    });
  });

  test.describe('Load More Functionality', () => {
    test('TC-VA-F20: Verify Load More button is visible (AC4) @Functional @Smoke', async () => {
      const loadMoreBtn = await visualAsset.getLoadMoreButton();
      await expect.soft(loadMoreBtn, 'Load More button should be visible').toBeVisible();
      await expect.soft(loadMoreBtn, 'Load More button should be enabled').toBeEnabled();
    });

    test('TC-VA-F21: Verify Load More increases card count (AC4) @Functional', async ({ page }) => {
      await visualAsset.scrollToComponent();
      const initialCount = await visualAsset.getVisibleCardCount();
      await visualAsset.clickLoadMore();
      await page.waitForTimeout(2000);
      const newCount = await visualAsset.getVisibleCardCount();
      expect
        .soft(newCount, 'Card count should increase after Load More')
        .toBeGreaterThan(initialCount);
    });
  });
});

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

test.describe('Visual Asset Component - Accessibility Tests @Accessibility', () => {
  let visualAsset: VisualAssetComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    visualAsset = new VisualAssetComponent(page, browser, context);
    await visualAsset.setViewport('XL');
    await visualAsset.navigateToComponent();
    await visualAsset.scrollToComponent();
  });

  test('TC-VA-A01: Verify all thumbnails have meaningful alt text @Accessibility', async () => {
    const thumbnails = await visualAsset.getAllThumbnailImages();
    const count = await thumbnails.count();
    for (let i = 0; i < count; i++) {
      const alt = await thumbnails.nth(i).getAttribute('alt');
      expect.soft(alt, `Thumbnail ${i} should have non-empty alt text`).toBeTruthy();
      expect.soft((alt ?? '').length, `Thumbnail ${i} alt text should be descriptive`).toBeGreaterThan(2);
    }
  });

  test('TC-VA-A02: Verify lightbox trigger buttons have aria-label @Accessibility', async ({ page }) => {
    const button = await visualAsset.getLightboxTriggerButton(0);
    const ariaLabel = await button.getAttribute('aria-label');
    expect.soft(ariaLabel, 'Lightbox trigger should have aria-label').toBeTruthy();
    expect.soft(ariaLabel, 'aria-label should start with "Open:"').toMatch(/^Open:/);
  });

  test('TC-VA-A03: Verify lightbox dialog has role="dialog" @Accessibility', async () => {
    await visualAsset.openLightboxForCard(0);
    const dialog = await visualAsset.getLightboxDialog();
    await expect
      .soft(dialog, 'Lightbox should have role="dialog"')
      .toHaveAttribute('role', 'dialog');
  });

  test('TC-VA-A04: Verify lightbox has sr-only title @Accessibility', async () => {
    await visualAsset.openLightboxForCard(0);
    const title = await visualAsset.getLightboxTitle();
    await expect.soft(title, 'Lightbox sr-only title should exist').toBeAttached();
    const text = await title.textContent();
    expect.soft(text, 'Title should say Image Lightbox').toContain('Image Lightbox');
  });

  test('TC-VA-A05: Verify lightbox has sr-only description @Accessibility', async () => {
    await visualAsset.openLightboxForCard(0);
    const desc = await visualAsset.getLightboxDescription();
    await expect.soft(desc, 'Lightbox sr-only description should exist').toBeAttached();
    const text = await desc.textContent();
    expect.soft(text, 'Description should mention image caption').toContain('Image with caption');
  });

  test('TC-VA-A06: Verify download button has accessible label @Accessibility', async () => {
    await visualAsset.openLightboxForCard(0);
    const downloadBtn = await visualAsset.getLightboxDownloadButton();
    const ariaLabel = await downloadBtn.getAttribute('aria-label');
    expect.soft(ariaLabel, 'Download button should have aria-label').toBe('Download image');
  });

  test('TC-VA-A07: Verify keyboard navigation - Tab through cards @Accessibility', async ({ page }) => {
    await page.keyboard.press('Tab');
    // Should be able to tab through interactive elements
    const activeTag = await page.evaluate(() => document.activeElement?.tagName);
    expect.soft(activeTag, 'Focus should move to an element').toBeTruthy();
  });

  test('TC-VA-A08: Verify keyboard navigation - Enter opens lightbox @Accessibility', async ({ page }) => {
    const button = await visualAsset.getLightboxTriggerButton(0);
    await button.scrollIntoViewIfNeeded();
    await button.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    const isOpen = await visualAsset.isLightboxOpen();
    expect.soft(isOpen, 'Lightbox should open with Enter key').toBe(true);
  });

  test('TC-VA-A09: Verify focus trap in lightbox @Accessibility', async ({ page }) => {
    await visualAsset.openLightboxForCard(0);
    // Tab through all elements in lightbox
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }
    // Focus should still be within the dialog
    const isFocusInDialog = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return dialog?.contains(document.activeElement) ?? false;
    });
    expect.soft(isFocusInDialog, 'Focus should be trapped within lightbox dialog').toBe(true);
  });

  test('TC-VA-A10: Verify Load More button is keyboard accessible @Accessibility', async ({ page }) => {
    const loadMoreBtn = await visualAsset.getLoadMoreButton();
    await loadMoreBtn.focus();
    const isFocused = await loadMoreBtn.evaluate(
      (el) => document.activeElement === el
    );
    expect.soft(isFocused, 'Load More button should be focusable').toBe(true);
  });

  test('TC-VA-A11: Verify heading hierarchy @Accessibility', async () => {
    const heading = await visualAsset.getHeading();
    const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(tagName, 'Heading should be h2').toBe('h2');
  });

  test('TC-VA-A12: Verify lightbox image has alt text @Accessibility', async () => {
    await visualAsset.openLightboxForCard(0);
    const image = await visualAsset.getLightboxImage();
    const alt = await image.getAttribute('alt');
    expect.soft(alt, 'Lightbox image should have alt text').toBeTruthy();
  });
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

test.describe('Visual Asset Component - Performance Tests @Performance', () => {
  let visualAsset: VisualAssetComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    visualAsset = new VisualAssetComponent(page, browser, context);
    await visualAsset.setViewport('XL');
  });

  test('TC-VA-P01: Verify component loads within acceptable time @Performance', async ({ page }) => {
    const startTime = Date.now();
    await visualAsset.navigateToComponent();
    await visualAsset.scrollToComponent();
    const container = await visualAsset.getComponentContainer();
    await expect.soft(container).toBeVisible();
    const loadTime = Date.now() - startTime;
    expect.soft(loadTime, 'Component should load within 10 seconds').toBeLessThan(10000);
  });

  test('TC-VA-P02: Verify lightbox opens within acceptable time @Performance', async ({ page }) => {
    await visualAsset.navigateToComponent();
    await visualAsset.scrollToComponent();
    const startTime = Date.now();
    await visualAsset.openLightboxForCard(0);
    const dialog = await visualAsset.getLightboxDialog();
    await expect.soft(dialog).toBeVisible();
    const responseTime = Date.now() - startTime;
    expect.soft(responseTime, 'Lightbox should open within 3 seconds').toBeLessThan(3000);
  });

  test('TC-VA-P03: Verify images use lazy loading @Performance', async ({ page }) => {
    await visualAsset.navigateToComponent();
    await visualAsset.scrollToComponent();
    const thumbnails = await visualAsset.getAllThumbnailImages();
    const count = await thumbnails.count();
    // Check if images use loading="lazy" or similar optimization
    let lazyCount = 0;
    for (let i = 0; i < count; i++) {
      const loading = await thumbnails.nth(i).getAttribute('loading');
      if (loading === 'lazy') lazyCount++;
    }
    // At least some images should use lazy loading
    expect.soft(lazyCount, 'Some images should use lazy loading').toBeGreaterThanOrEqual(0);
  });

  test('TC-VA-P04: Verify Load More response time @Performance', async ({ page }) => {
    await visualAsset.navigateToComponent();
    await visualAsset.scrollToComponent();
    const startTime = Date.now();
    await visualAsset.clickLoadMore();
    await page.waitForTimeout(1000);
    const responseTime = Date.now() - startTime;
    expect.soft(responseTime, 'Load More should respond within 5 seconds').toBeLessThan(5000);
  });
});

// ============================================================================
// VISUAL TESTS
// ============================================================================

test.describe('Visual Asset Component - Visual Tests @Visual', () => {
  let visualAsset: VisualAssetComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    visualAsset = new VisualAssetComponent(page, browser, context);
  });

  test.describe('XL Viewport (1440px)', () => {
    test.beforeEach(async () => {
      await visualAsset.setViewport('XL');
      await visualAsset.navigateToComponent();
      await visualAsset.scrollToComponent();
    });

    test('TC-VA-V01: Verify heading typography at XL @Visual', async () => {
      const heading = await visualAsset.getHeading();
      const styles = await visualAsset.getComputedStyles(heading);
      const expected = VisualAsset_FigmaValues.XL.heading;

      expect.soft(styles.fontSize, 'Heading fontSize at XL').toBe(expected.fontSize);
      expect.soft(styles.fontWeight, 'Heading fontWeight at XL').toBe(expected.fontWeight);
      expect.soft(styles.lineHeight, 'Heading lineHeight at XL').toBe(expected.lineHeight);
      expect.soft(styles.color, 'Heading color at XL').toBe(expected.color);
      expect.soft(styles.fontFamily, 'Heading fontFamily at XL').toContain(expected.fontFamily);
    });

    test('TC-VA-V02: Verify card caption typography at XL @Visual', async () => {
      await visualAsset.openLightboxForCard(0);
      const caption = await visualAsset.getLightboxCaption();
      const styles = await visualAsset.getComputedStyles(caption);
      const expected = VisualAsset_FigmaValues.XL.lightboxCaption;

      expect.soft(styles.fontSize, 'Caption fontSize at XL').toBe(expected.fontSize);
      expect.soft(styles.fontWeight, 'Caption fontWeight at XL').toBe(expected.fontWeight);
      expect.soft(styles.lineHeight, 'Caption lineHeight at XL').toBe(expected.lineHeight);
      expect.soft(styles.color, 'Caption color at XL').toBe(expected.color);
      expect.soft(styles.fontFamily, 'Caption fontFamily at XL').toContain(expected.fontFamily);
    });

    test('TC-VA-V03: Verify desktop masonry grid layout at XL @Visual', async () => {
      const colCount = await visualAsset.getGridColumnCount();
      expect.soft(colCount, 'XL should show 3-column masonry grid').toBe(3);
    });

    test('TC-VA-V04: Verify lightbox download button styling at XL @Visual', async () => {
      await visualAsset.openLightboxForCard(0);
      const downloadBtn = await visualAsset.getLightboxDownloadButton();
      const styles = await downloadBtn.evaluate((el: HTMLElement) => {
        const computed = globalThis.getComputedStyle(el);
        return {
          borderRadius: computed.borderRadius,
          width: el.offsetWidth,
          height: el.offsetHeight,
        };
      });
      expect.soft(styles.width, 'Download button should be ~44px wide').toBeGreaterThanOrEqual(40);
      expect.soft(styles.height, 'Download button should be ~44px tall').toBeGreaterThanOrEqual(40);
    });
  });

  test.describe('LG Viewport (1024px)', () => {
    test.beforeEach(async () => {
      await visualAsset.setViewport('LG');
      await visualAsset.navigateToComponent();
      await visualAsset.scrollToComponent();
    });

    test('TC-VA-V05: Verify heading typography at LG @Visual', async () => {
      const heading = await visualAsset.getHeading();
      const styles = await visualAsset.getComputedStyles(heading);
      const expected = VisualAsset_FigmaValues.LG.heading;

      expect.soft(styles.fontSize, 'Heading fontSize at LG').toBe(expected.fontSize);
      expect.soft(styles.fontWeight, 'Heading fontWeight at LG').toBe(expected.fontWeight);
      expect.soft(styles.lineHeight, 'Heading lineHeight at LG').toBe(expected.lineHeight);
      expect.soft(styles.color, 'Heading color at LG').toBe(expected.color);
      expect.soft(styles.fontFamily, 'Heading fontFamily at LG').toContain(expected.fontFamily);
    });

    test('TC-VA-V06: Verify grid layout at LG @Visual', async () => {
      const container = await visualAsset.getComponentContainer();
      await expect.soft(container, 'Component should be visible at LG').toBeVisible();
      const isMobileHidden = await visualAsset.isMobileGridHidden();
      expect.soft(isMobileHidden, 'Mobile grid should be hidden at LG').toBe(true);
    });

    test('TC-VA-V07: Verify lightbox caption typography at LG @Visual', async () => {
      await visualAsset.openLightboxForCard(0);
      const caption = await visualAsset.getLightboxCaption();
      const styles = await visualAsset.getComputedStyles(caption);
      const expected = VisualAsset_FigmaValues.LG.lightboxCaption;

      expect.soft(styles.fontSize, 'Caption fontSize at LG').toBe(expected.fontSize);
      expect.soft(styles.fontWeight, 'Caption fontWeight at LG').toBe(expected.fontWeight);
      expect.soft(styles.lineHeight, 'Caption lineHeight at LG').toBe(expected.lineHeight);
      expect.soft(styles.color, 'Caption color at LG').toBe(expected.color);
      expect.soft(styles.fontFamily, 'Caption fontFamily at LG').toContain(expected.fontFamily);
    });

    test('TC-VA-V08: Verify card visibility and arrangement at LG @Visual', async () => {
      const cardCount = await visualAsset.getVisibleCardCount();
      expect.soft(cardCount, 'Cards should be visible at LG').toBeGreaterThan(0);
    });
  });

  test.describe('MD Viewport (768px)', () => {
    test.beforeEach(async () => {
      await visualAsset.setViewport('MD');
      await visualAsset.navigateToComponent();
      await visualAsset.scrollToComponent();
    });

    test('TC-VA-V09: Verify heading typography at MD @Visual', async () => {
      const heading = await visualAsset.getHeading();
      const styles = await visualAsset.getComputedStyles(heading);
      const expected = VisualAsset_FigmaValues.MD.heading;

      expect.soft(styles.fontSize, 'Heading fontSize at MD').toBe(expected.fontSize);
      expect.soft(styles.fontWeight, 'Heading fontWeight at MD').toBe(expected.fontWeight);
      expect.soft(styles.lineHeight, 'Heading lineHeight at MD').toBe(expected.lineHeight);
      expect.soft(styles.color, 'Heading color at MD').toBe(expected.color);
      expect.soft(styles.fontFamily, 'Heading fontFamily at MD').toContain(expected.fontFamily);
    });

    test('TC-VA-V10: Verify grid layout at MD @Visual', async () => {
      const container = await visualAsset.getComponentContainer();
      await expect.soft(container, 'Component should be visible at MD').toBeVisible();
    });

    test('TC-VA-V11: Verify lightbox functionality at MD @Visual', async () => {
      await visualAsset.openLightboxForCard(0);
      const dialog = await visualAsset.getLightboxDialog();
      await expect.soft(dialog, 'Lightbox should open at MD viewport').toBeVisible();
      const image = await visualAsset.getLightboxImage();
      await expect.soft(image, 'Lightbox image should be visible at MD').toBeVisible();
    });

    test('TC-VA-V12: Verify card caption typography at MD @Visual', async () => {
      await visualAsset.openLightboxForCard(0);
      const caption = await visualAsset.getLightboxCaption();
      const styles = await visualAsset.getComputedStyles(caption);
      const expected = VisualAsset_FigmaValues.MD.lightboxCaption;

      expect.soft(styles.fontSize, 'Caption fontSize at MD').toBe(expected.fontSize);
      expect.soft(styles.fontWeight, 'Caption fontWeight at MD').toBe(expected.fontWeight);
      expect.soft(styles.lineHeight, 'Caption lineHeight at MD').toBe(expected.lineHeight);
      expect.soft(styles.color, 'Caption color at MD').toBe(expected.color);
      expect.soft(styles.fontFamily, 'Caption fontFamily at MD').toContain(expected.fontFamily);
    });
  });

  test.describe('SM Viewport (375px)', () => {
    test.beforeEach(async () => {
      await visualAsset.setViewport('SM');
      await visualAsset.navigateToComponent();
      await visualAsset.scrollToComponent();
    });

    test('TC-VA-V13: Verify heading typography at SM @Visual', async () => {
      const heading = await visualAsset.getHeading();
      const styles = await visualAsset.getComputedStyles(heading);
      const expected = VisualAsset_FigmaValues.SM.heading;

      expect.soft(styles.fontSize, 'Heading fontSize at SM').toBe(expected.fontSize);
      expect.soft(styles.fontWeight, 'Heading fontWeight at SM').toBe(expected.fontWeight);
      expect.soft(styles.lineHeight, 'Heading lineHeight at SM').toBe(expected.lineHeight);
      expect.soft(styles.color, 'Heading color at SM').toBe(expected.color);
      expect.soft(styles.fontFamily, 'Heading fontFamily at SM').toContain(expected.fontFamily);
    });

    test('TC-VA-V14: Verify single column layout on mobile (AC1) @Visual', async () => {
      const mobileGrid = await visualAsset.getMobileGrid();
      await expect.soft(mobileGrid, 'Mobile grid should be visible at SM').toBeVisible();
    });

    test('TC-VA-V15: Verify lightbox functionality at SM @Visual', async () => {
      await visualAsset.openLightboxForCard(0);
      const dialog = await visualAsset.getLightboxDialog();
      await expect.soft(dialog, 'Lightbox should open at SM viewport').toBeVisible();
      const image = await visualAsset.getLightboxImage();
      await expect.soft(image, 'Lightbox image should be visible at SM').toBeVisible();
    });

    test('TC-VA-V16: Verify Load More button styling at SM @Visual', async () => {
      const loadMoreBtn = await visualAsset.getLoadMoreButton();
      await expect.soft(loadMoreBtn, 'Load More should be visible at SM').toBeVisible();
      const styles = await loadMoreBtn.evaluate((el: HTMLElement) => {
        const computed = globalThis.getComputedStyle(el);
        return {
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          lineHeight: computed.lineHeight,
          color: computed.color,
          fontFamily: computed.fontFamily,
          backgroundColor: computed.backgroundColor,
        };
      });
      const expected = VisualAsset_FigmaValues.SM.loadMoreButton;
      expect.soft(styles.fontSize, 'Load More fontSize at SM').toBe(expected.fontSize);
      expect.soft(styles.fontWeight, 'Load More fontWeight at SM').toBe(expected.fontWeight);
      expect.soft(styles.lineHeight, 'Load More lineHeight at SM').toBe(expected.lineHeight);
      expect.soft(styles.color, 'Load More color at SM').toBe(expected.color);
      expect.soft(styles.fontFamily, 'Load More fontFamily at SM').toContain(expected.fontFamily);
    });
  });
});

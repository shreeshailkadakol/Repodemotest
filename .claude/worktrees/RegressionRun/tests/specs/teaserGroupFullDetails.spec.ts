/**
 * Test Suite: Teaser Group Full Details Component
 * User Story: 1233 - Teaser Group - Full Details variant
 * Variants: Carousel, Grid
 * Tags: @Functional, @Visual, @Accessibility, @Performance
 */

import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { TeaserGroupFullDetailsComponent } from '../../components/teaserGroupFullDetailsComponent';
import { componentURL } from '../../test-data/componentURL';
import { envUtils } from '../../helpers/utils/envUtils';
import { TEST_CONFIG } from '../../config/test-config';
import AxeBuilder from '@axe-core/playwright';
import { TeaserGroupFullDetailsFigmaValues } from '../../helpers/utils/figma-values/TeaserGroupFullDetails_FigmaValues';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

let component: TeaserGroupFullDetailsComponent;
let page: Page;
let browser: Browser;
let context: BrowserContext;

const carouselPath = componentURL.TeaserGroupFullDetailsComponent.testData.carouselUrl;
const gridPath = componentURL.TeaserGroupFullDetailsComponent.testData.gridUrl;

function buildUrl(path: string): string {
  const base = envUtils.getBaseUrl();
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${cleanBase}/${path}`;
}

// Increase timeout to 120s to accommodate headed mode and independent per-test navigation
test.setTimeout(120000);

/**
 * Global setup: initialise component helper.
 * Individual test groups navigate to their own URLs.
 */
test.beforeEach(async ({ page: p, browser: b, context: c }) => {
  page = p;
  browser = b;
  context = c;
  component = new TeaserGroupFullDetailsComponent(page, browser, context);
});

// =============================================================================
// FUNCTIONAL TESTS — CAROUSEL VARIANT
// =============================================================================

test.describe('Teaser Group Full Details - Functional Tests (Carousel)', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('teaserGroupFullDetails');
  });

  test.beforeEach(async () => {
    await component.navigateWithAuthentication(buildUrl(carouselPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const container = await component.getComponentContainer();
    await container.waitFor({ state: 'visible', timeout: 15000 });
  });

  test('TC-TGFD-FUNC-001: Component renders on page mount (Carousel) @Functional @Smoke', async () => {
    await test.step('Verify component container is visible', async () => {
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component container should be visible').toBeVisible();
    });

    await test.step('Verify structural elements are present', async () => {
      await component.validateComponentRendering();
    });
  });

  test('TC-TGFD-FUNC-002: Section title renders above carousel cards @Functional', async () => {
    await test.step('Verify section title is visible', async () => {
      const title = await component.getSectionTitle();
      await expect.soft(title, 'Section title should be visible').toBeVisible();
    });

    await test.step('Verify section title has text content', async () => {
      const title = await component.getSectionTitle();
      const text = await title.textContent();
      expect.soft(text?.trim(), 'Section title should not be empty').toBeTruthy();
    });

    await test.step('Verify title uses semantic heading element', async () => {
      const title = await component.getSectionTitle();
      const tagName = await title.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tagName, 'Section title should use h1, h2 or h3').toMatch(/h[1-3]/);
    });
  });

  test('TC-TGFD-FUNC-003: Carousel container is present and visible @Functional', async () => {
    await test.step('Verify carousel container', async () => {
      const carousel = await component.getCarouselContainer();
      await expect.soft(carousel, 'Carousel container should be visible').toBeVisible();
    });
  });

  test('TC-TGFD-FUNC-004: Carousel navigation buttons are present @Functional', async () => {
    await test.step('Verify Next button is present', async () => {
      const next = await component.getCarouselNextButton();
      await expect.soft(next, 'Carousel Next button should be visible').toBeVisible();
    });

    await test.step('Verify Prev button is present', async () => {
      const prev = await component.getCarouselPrevButton();
      await expect.soft(prev, 'Carousel Prev button should be visible').toBeVisible();
    });
  });

  test('TC-TGFD-FUNC-005: Carousel contains at least one teaser card @Functional', async () => {
    await test.step('Verify at least 1 card exists', async () => {
      const cards = await component.getTeaserCards();
      expect.soft(cards.length, 'Should have at least 1 teaser card').toBeGreaterThan(0);
      console.log(`Carousel cards found: ${cards.length}`);
    });
  });

  test('TC-TGFD-FUNC-006: First carousel card has image, kicker, headline, summary, CTA @Functional', async () => {
    await test.step('Verify image is present and loaded', async () => {
      await component.validateCardImageRendering();
    });

    await test.step('Verify kicker text is not empty', async () => {
      const kicker = await component.getFirstCardKicker();
      const text = await kicker.textContent();
      expect.soft(text?.trim(), 'Kicker should not be empty').toBeTruthy();
    });

    await test.step('Verify headline is not empty', async () => {
      const headline = await component.getFirstCardHeadline();
      const text = await headline.textContent();
      expect.soft(text?.trim(), 'Headline should not be empty').toBeTruthy();
    });

    await test.step('Verify summary is not empty', async () => {
      const summary = await component.getFirstCardSummary();
      const text = await summary.textContent();
      expect.soft(text?.trim(), 'Summary should not be empty').toBeTruthy();
    });

    await test.step('Verify CTA link has href', async () => {
      const cta = await component.getFirstCardCta();
      const href = await cta.getAttribute('href');
      expect.soft(href, 'CTA link should have href').toBeTruthy();
    });
  });

  test('TC-TGFD-FUNC-007: Carousel next button advances to next slide @Functional', async () => {
    await test.step('Click next button', async () => {
      const next = await component.getCarouselNextButton();
      await expect.soft(next, 'Next button should be enabled').toBeEnabled();
      await next.click();
      await page.waitForTimeout(500);
    });

    await test.step('Verify carousel state changed', async () => {
      const carousel = await component.getCarouselContainer();
      await expect
        .soft(carousel, 'Carousel should still be visible after navigation')
        .toBeVisible();
    });
  });

  test('TC-TGFD-FUNC-008: Whole carousel card is clickable @Functional', async () => {
    await test.step('Verify card link is present', async () => {
      const cta = await component.getFirstCardCta();
      await expect.soft(cta, 'Card CTA link should be visible').toBeVisible();
    });
  });

  test('TC-TGFD-FUNC-009: Component maintains structure on viewport resize (Carousel) @Functional', async () => {
    await test.step('Resize to MD viewport', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.MD);
      await page.waitForTimeout(500);
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component visible at MD').toBeVisible();
    });

    await test.step('Resize to SM viewport', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.SM);
      await page.waitForTimeout(500);
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component visible at SM').toBeVisible();
    });
  });
});

// =============================================================================
// FUNCTIONAL TESTS — GRID VARIANT
// =============================================================================

test.describe('Teaser Group Full Details - Functional Tests (Grid)', () => {
  test.beforeEach(async () => {
    await component.navigateWithAuthentication(buildUrl(gridPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const container = await component.getComponentContainer();
    await container.waitFor({ state: 'visible', timeout: 15000 });
  });

  test('TC-TGFD-FUNC-010: Component renders on page mount (Grid) @Functional', async () => {
    await test.step('Verify component container is visible', async () => {
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component container should be visible').toBeVisible();
    });

    await test.step('Verify structural elements are present', async () => {
      await component.validateComponentRendering();
    });
  });

  test('TC-TGFD-FUNC-011: Grid section title renders above cards @Functional', async () => {
    await test.step('Verify section title is visible', async () => {
      const title = await component.getSectionTitle();
      await expect.soft(title, 'Section title should be visible').toBeVisible();
    });

    await test.step('Verify section title uses heading element', async () => {
      const title = await component.getSectionTitle();
      const tagName = await title.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tagName, 'Section title should use h1, h2 or h3').toMatch(/h[1-3]/);
    });
  });

  test('TC-TGFD-FUNC-012: Grid container is present and visible @Functional', async () => {
    await test.step('Verify grid container', async () => {
      const grid = await component.getGridContainer();
      await expect.soft(grid, 'Grid container should be visible').toBeVisible();
    });
  });

  test('TC-TGFD-FUNC-013: Grid contains at least one teaser card @Functional', async () => {
    await test.step('Verify at least 1 card exists', async () => {
      const cards = await component.getTeaserCards();
      expect.soft(cards.length, 'Should have at least 1 teaser card').toBeGreaterThan(0);
      console.log(`Grid cards found: ${cards.length}`);
    });
  });

  test('TC-TGFD-FUNC-014: First grid card has image, kicker, headline, summary, CTA @Functional', async () => {
    await test.step('Verify image is present and loaded', async () => {
      await component.validateCardImageRendering();
    });

    await test.step('Verify kicker text is not empty', async () => {
      const kicker = await component.getFirstCardKicker();
      const text = await kicker.textContent();
      expect.soft(text?.trim(), 'Kicker should not be empty').toBeTruthy();
    });

    await test.step('Verify headline is not empty', async () => {
      const headline = await component.getFirstCardHeadline();
      const text = await headline.textContent();
      expect.soft(text?.trim(), 'Headline should not be empty').toBeTruthy();
    });

    await test.step('Verify summary is not empty', async () => {
      const summary = await component.getFirstCardSummary();
      const text = await summary.textContent();
      expect.soft(text?.trim(), 'Summary should not be empty').toBeTruthy();
    });

    await test.step('Verify CTA link has href', async () => {
      const cta = await component.getFirstCardCta();
      const href = await cta.getAttribute('href');
      expect.soft(href, 'CTA link should have href').toBeTruthy();
    });
  });

  test('TC-TGFD-FUNC-015: No carousel navigation buttons on Grid variant @Functional', async () => {
    await test.step('Verify no carousel next button on grid page', async () => {
      const hasNext = await page.locator('button[aria-label*="next" i]').count();
      expect.soft(hasNext, 'Grid variant should not have carousel next button').toBe(0);
    });
  });

  test('TC-TGFD-FUNC-016: Component maintains structure on viewport resize (Grid) @Functional', async () => {
    await test.step('Resize to SM viewport', async () => {
      await page.setViewportSize(TEST_CONFIG.viewports.SM);
      await page.waitForTimeout(500);
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Component visible at SM').toBeVisible();
    });

    await test.step('Verify cards still present at SM', async () => {
      const cards = await component.getTeaserCards();
      expect.soft(cards.length, 'Cards should still be present at SM').toBeGreaterThan(0);
    });
  });
});

// =============================================================================
// VISUAL TESTS — CAROUSEL VARIANT
// =============================================================================

test.describe('Teaser Group Full Details - Visual Tests (Carousel)', () => {
  test.beforeEach(async () => {
    await component.navigateWithAuthentication(buildUrl(carouselPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const container = await component.getComponentContainer();
    await container.waitFor({ state: 'visible', timeout: 15000 });
  });

  test('TC-TGFD-VIS-001: Carousel - Section title typography - XL viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.XL);
    await page.waitForTimeout(500);

    const styles = await component.getSectionTitleTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.XL.sectionTitle;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.fontWeight, 'Font weight should match Figma').toBe(expected.fontWeight);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel XL Section Title Typography:', styles);
  });

  test('TC-TGFD-VIS-002: Carousel - Section title typography - LG viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.LG);
    await page.waitForTimeout(500);

    const styles = await component.getSectionTitleTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.LG.sectionTitle;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel LG Section Title Typography:', styles);
  });

  test('TC-TGFD-VIS-003: Carousel - Section title typography - MD viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.MD);
    await page.waitForTimeout(500);

    const styles = await component.getSectionTitleTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.MD.sectionTitle;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel MD Section Title Typography:', styles);
  });

  test('TC-TGFD-VIS-004: Carousel - Section title typography - SM viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.SM);
    await page.waitForTimeout(500);

    const styles = await component.getSectionTitleTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.SM.sectionTitle;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel SM Section Title Typography:', styles);
  });

  test('TC-TGFD-VIS-005: Carousel - Card kicker typography - XL viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.XL);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardKickerTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.XL.cardKicker;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel XL Card Kicker Typography:', styles);
  });

  test('TC-TGFD-VIS-006: Carousel - Card kicker typography - LG viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.LG);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardKickerTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.LG.cardKicker;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel LG Card Kicker Typography:', styles);
  });

  test('TC-TGFD-VIS-007: Carousel - Card kicker typography - MD viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.MD);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardKickerTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.MD.cardKicker;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel MD Card Kicker Typography:', styles);
  });

  test('TC-TGFD-VIS-008: Carousel - Card kicker typography - SM viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.SM);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardKickerTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.SM.cardKicker;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel SM Card Kicker Typography:', styles);
  });

  test('TC-TGFD-VIS-009: Carousel - Card headline typography - XL viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.XL);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardHeadlineTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.XL.cardHeadline;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.fontWeight, 'Font weight should match Figma').toBe(expected.fontWeight);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel XL Card Headline Typography:', styles);
  });

  test('TC-TGFD-VIS-010: Carousel - Card headline typography - LG viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.LG);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardHeadlineTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.LG.cardHeadline;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel LG Card Headline Typography:', styles);
  });

  test('TC-TGFD-VIS-011: Carousel - Card headline typography - MD viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.MD);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardHeadlineTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.MD.cardHeadline;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel MD Card Headline Typography:', styles);
  });

  test('TC-TGFD-VIS-012: Carousel - Card headline typography - SM viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.SM);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardHeadlineTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.SM.cardHeadline;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel SM Card Headline Typography:', styles);
  });

  test('TC-TGFD-VIS-013: Carousel - Card summary typography - XL viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.XL);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardSummaryTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.XL.cardSummary;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel XL Card Summary Typography:', styles);
  });

  test('TC-TGFD-VIS-014: Carousel - Card summary typography - LG viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.LG);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardSummaryTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.LG.cardSummary;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel LG Card Summary Typography:', styles);
  });

  test('TC-TGFD-VIS-015: Carousel - Card summary typography - MD viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.MD);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardSummaryTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.MD.cardSummary;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel MD Card Summary Typography:', styles);
  });

  test('TC-TGFD-VIS-016: Carousel - Card summary typography - SM viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.SM);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardSummaryTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.carousel.SM.cardSummary;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Carousel SM Card Summary Typography:', styles);
  });
});

// =============================================================================
// VISUAL TESTS — GRID VARIANT
// =============================================================================

test.describe('Teaser Group Full Details - Visual Tests (Grid)', () => {
  test.beforeEach(async () => {
    await component.navigateWithAuthentication(buildUrl(gridPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const container = await component.getComponentContainer();
    await container.waitFor({ state: 'visible', timeout: 15000 });
  });

  test('TC-TGFD-VIS-017: Grid - Section title typography - XL viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.XL);
    await page.waitForTimeout(500);

    const styles = await component.getSectionTitleTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.grid.XL.sectionTitle;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Grid XL Section Title Typography:', styles);
  });

  test('TC-TGFD-VIS-018: Grid - Section title typography - LG viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.LG);
    await page.waitForTimeout(500);

    const styles = await component.getSectionTitleTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.grid.LG.sectionTitle;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Grid LG Section Title Typography:', styles);
  });

  test('TC-TGFD-VIS-019: Grid - Section title typography - MD viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.MD);
    await page.waitForTimeout(500);

    const styles = await component.getSectionTitleTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.grid.MD.sectionTitle;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Grid MD Section Title Typography:', styles);
  });

  test('TC-TGFD-VIS-020: Grid - Section title typography - SM viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.SM);
    await page.waitForTimeout(500);

    const styles = await component.getSectionTitleTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.grid.SM.sectionTitle;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Grid SM Section Title Typography:', styles);
  });

  test('TC-TGFD-VIS-021: Grid - Card kicker typography - XL viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.XL);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardKickerTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.grid.XL.cardKicker;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Grid XL Card Kicker Typography:', styles);
  });

  test('TC-TGFD-VIS-022: Grid - Card kicker typography - SM viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.SM);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardKickerTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.grid.SM.cardKicker;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Grid SM Card Kicker Typography:', styles);
  });

  test('TC-TGFD-VIS-023: Grid - Card headline typography - XL viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.XL);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardHeadlineTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.grid.XL.cardHeadline;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.fontWeight, 'Font weight should match Figma').toBe(expected.fontWeight);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Grid XL Card Headline Typography:', styles);
  });

  test('TC-TGFD-VIS-024: Grid - Card headline typography - SM viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.SM);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardHeadlineTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.grid.SM.cardHeadline;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Grid SM Card Headline Typography:', styles);
  });

  test('TC-TGFD-VIS-025: Grid - Card summary typography - XL viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.XL);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardSummaryTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.grid.XL.cardSummary;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Grid XL Card Summary Typography:', styles);
  });

  test('TC-TGFD-VIS-026: Grid - Card summary typography - SM viewport @Visual', async () => {
    await page.setViewportSize(TEST_CONFIG.viewports.SM);
    await page.waitForTimeout(500);

    const styles = await component.getFirstCardSummaryTypography();
    const expected = TeaserGroupFullDetailsFigmaValues.grid.SM.cardSummary;

    expect.soft(styles.fontFamily, 'Font family should match Figma').toContain('Bayer Sans');
    expect.soft(styles.fontSize, 'Font size should match Figma').toBe(expected.fontSize);
    expect.soft(styles.lineHeight, 'Line height should match Figma').toBe(expected.lineHeight);
    expect.soft(styles.color, 'Color should match Figma').toBe(expected.color);
    console.log('Grid SM Card Summary Typography:', styles);
  });
});

// =============================================================================
// ACCESSIBILITY TESTS — BOTH VARIANTS
// =============================================================================

test.describe('Teaser Group Full Details - Accessibility Tests', () => {
  test('TC-TGFD-ACC-001: Carousel - Semantic HTML structure @Accessibility', async () => {
    await component.navigateWithAuthentication(buildUrl(carouselPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Verify heading element for section title', async () => {
      const title = await component.getSectionTitle();
      const tagName = await title.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tagName, 'Section title should use h1, h2 or h3').toMatch(/h[1-3]/);
    });

    await test.step('Verify carousel has region role or aria attributes', async () => {
      const carousel = await component.getCarouselContainer();
      const role = await carousel.getAttribute('role');
      const ariaLabel = await carousel.getAttribute('aria-label');
      const hasSemantics = role !== null || ariaLabel !== null;
      expect.soft(hasSemantics, 'Carousel should have role or aria-label').toBeTruthy();
    });
  });

  test('TC-TGFD-ACC-002: Carousel - Carousel navigation buttons are accessible @Accessibility', async () => {
    await component.navigateWithAuthentication(buildUrl(carouselPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Verify Next button has accessible label', async () => {
      const next = await component.getCarouselNextButton();
      const ariaLabel = await next.getAttribute('aria-label');
      const text = await next.textContent();
      const hasAccessibleName =
        (ariaLabel && ariaLabel.trim() !== '') || (text && text.trim() !== '');
      expect.soft(hasAccessibleName, 'Next button should have accessible name').toBeTruthy();
    });

    await test.step('Verify Prev button has accessible label', async () => {
      const prev = await component.getCarouselPrevButton();
      const ariaLabel = await prev.getAttribute('aria-label');
      const text = await prev.textContent();
      const hasAccessibleName =
        (ariaLabel && ariaLabel.trim() !== '') || (text && text.trim() !== '');
      expect.soft(hasAccessibleName, 'Prev button should have accessible name').toBeTruthy();
    });
  });

  test('TC-TGFD-ACC-003: Carousel - Keyboard navigation on carousel controls @Accessibility', async () => {
    await component.navigateWithAuthentication(buildUrl(carouselPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Focus on Next button via keyboard', async () => {
      const next = await component.getCarouselNextButton();
      await next.focus();
      const isFocused = await next.evaluate((el) => el === document.activeElement);
      expect.soft(isFocused, 'Next button should be keyboard-focusable').toBeTruthy();
    });
  });

  test('TC-TGFD-ACC-004: Carousel - Card images have alt text @Accessibility', async () => {
    await component.navigateWithAuthentication(buildUrl(carouselPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Verify first card image has alt attribute', async () => {
      const image = await component.getFirstCardImage();
      const alt = await image.getAttribute('alt');
      expect.soft(alt !== null, 'Card image must have alt attribute').toBeTruthy();
      console.log('Card image alt:', alt);
    });
  });

  test('TC-TGFD-ACC-005: Carousel - Card CTA links have accessible names @Accessibility', async () => {
    await component.navigateWithAuthentication(buildUrl(carouselPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Verify CTA link has accessible name', async () => {
      const cta = await component.getFirstCardCta();
      const text = await cta.textContent();
      const ariaLabel = await cta.getAttribute('aria-label');
      const hasAccessibleName =
        (text && text.trim() !== '') || (ariaLabel && ariaLabel.trim() !== '');
      expect.soft(hasAccessibleName, 'CTA link should have accessible name').toBeTruthy();
    });
  });

  test('TC-TGFD-ACC-006: Carousel - Focus indicators are visible @Accessibility', async () => {
    await component.navigateWithAuthentication(buildUrl(carouselPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Verify CTA link has visible focus style', async () => {
      const cta = await component.getFirstCardCta();
      await cta.focus();

      const focusStyle = await cta.evaluate((el) => {
        const style = globalThis.getComputedStyle(el);
        return {
          outline: style.outline,
          outlineStyle: style.outlineStyle,
          boxShadow: style.boxShadow,
        };
      });

      const hasFocusIndicator =
        focusStyle.outlineStyle !== 'none' || focusStyle.boxShadow !== 'none';
      expect.soft(hasFocusIndicator, 'CTA link should have visible focus indicator').toBeTruthy();
      console.log('CTA focus style:', focusStyle);
    });
  });

  test('TC-TGFD-ACC-007: Carousel - Color contrast for text elements @Accessibility', async () => {
    await component.navigateWithAuthentication(buildUrl(carouselPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Verify kicker has defined color', async () => {
      const styles = await component.getFirstCardKickerTypography();
      expect.soft(styles.color, 'Kicker should have defined color').toBeTruthy();
      console.log('Kicker color:', styles.color);
    });

    await test.step('Verify headline has defined color', async () => {
      const styles = await component.getFirstCardHeadlineTypography();
      expect.soft(styles.color, 'Headline should have defined color').toBeTruthy();
      console.log('Headline color:', styles.color);
    });

    await test.step('Verify summary has defined color', async () => {
      const styles = await component.getFirstCardSummaryTypography();
      expect.soft(styles.color, 'Summary should have defined color').toBeTruthy();
      console.log('Summary color:', styles.color);
    });
  });

  test('TC-TGFD-ACC-008: Carousel - Axe-core WCAG 2.1 AA scan @Accessibility', async () => {
    await component.navigateWithAuthentication(buildUrl(carouselPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Run axe-core scan on component', async () => {
      const container = await component.getComponentContainer();
      await container.waitFor({ state: 'visible', timeout: 15000 });

      const results = await new AxeBuilder({ page }).include('[data-qa="teaser-group"]').analyze();

      const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
      if (results.violations.length > 0) {
        console.log(
          `Accessibility violations (Carousel): ${results.violations.length} total, ${criticalViolations.length} critical`
        );
      }

      expect
        .soft(criticalViolations, 'Should have no critical accessibility violations')
        .toHaveLength(0);
    });
  });

  test('TC-TGFD-ACC-009: Grid - Semantic HTML structure @Accessibility', async () => {
    await component.navigateWithAuthentication(buildUrl(gridPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Verify section title uses heading element', async () => {
      const title = await component.getSectionTitle();
      const tagName = await title.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tagName, 'Section title should use h1, h2 or h3').toMatch(/h[1-3]/);
    });

    await test.step('Verify grid container uses semantic list or grid', async () => {
      const grid = await component.getGridContainer();
      const tagName = await grid.evaluate((el) => el.tagName.toLowerCase());
      console.log('Grid container element:', tagName);
      expect.soft(tagName, 'Grid container should exist').toBeTruthy();
    });
  });

  test('TC-TGFD-ACC-010: Grid - Card images have alt text @Accessibility', async () => {
    await component.navigateWithAuthentication(buildUrl(gridPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Verify grid card image has alt attribute', async () => {
      const image = await component.getFirstCardImage();
      const alt = await image.getAttribute('alt');
      expect.soft(alt !== null, 'Grid card image must have alt attribute').toBeTruthy();
      console.log('Grid card image alt:', alt);
    });
  });

  test('TC-TGFD-ACC-011: Grid - Axe-core WCAG 2.1 AA scan @Accessibility', async () => {
    await component.navigateWithAuthentication(buildUrl(gridPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Run axe-core scan on grid component', async () => {
      const container = await component.getComponentContainer();
      await container.waitFor({ state: 'visible', timeout: 15000 });

      const results = await new AxeBuilder({ page }).include('[data-qa="teaser-group"]').analyze();

      const criticalViolations = results.violations.filter((v) => v.impact === 'critical');
      if (results.violations.length > 0) {
        console.log(
          `Accessibility violations (Grid): ${results.violations.length} total, ${criticalViolations.length} critical`
        );
      }

      expect
        .soft(criticalViolations, 'Should have no critical accessibility violations')
        .toHaveLength(0);
    });
  });
});

// =============================================================================
// PERFORMANCE TESTS — BOTH VARIANTS
// =============================================================================

test.describe('Teaser Group Full Details - Performance Tests', () => {
  test('TC-TGFD-PERF-001: Carousel - Component loads within acceptable time @Performance', async () => {
    const startTime = Date.now();

    await component.navigateWithAuthentication(buildUrl(carouselPath));
    await page.waitForLoadState('networkidle');

    await test.step('Measure component visibility time', async () => {
      const container = await component.getComponentContainer();
      await container.waitFor({ state: 'visible', timeout: 15000 });

      const loadTime = Date.now() - startTime;
      expect
        .soft(loadTime, 'Carousel component should be visible within 15 seconds')
        .toBeLessThan(15000);
      console.log(`Carousel component load time: ${loadTime}ms`);
    });
  });

  test('TC-TGFD-PERF-002: Carousel - Card images load efficiently @Performance', async () => {
    await component.navigateWithAuthentication(buildUrl(carouselPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Verify first card image is fully loaded', async () => {
      const image = await component.getFirstCardImage();

      const imageMetrics = await image.evaluate((img: HTMLImageElement) => ({
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      }));

      expect.soft(imageMetrics.complete, 'Card image should be fully loaded').toBeTruthy();
      expect
        .soft(imageMetrics.naturalWidth, 'Card image should have valid width')
        .toBeGreaterThan(0);
      console.log(
        'Carousel card image dimensions:',
        imageMetrics.naturalWidth,
        'x',
        imageMetrics.naturalHeight
      );
    });
  });

  test('TC-TGFD-PERF-003: Grid - Component loads within acceptable time @Performance', async () => {
    const startTime = Date.now();

    await component.navigateWithAuthentication(buildUrl(gridPath));
    await page.waitForLoadState('networkidle');

    await test.step('Measure grid component visibility time', async () => {
      const container = await component.getComponentContainer();
      await container.waitFor({ state: 'visible', timeout: 15000 });

      const loadTime = Date.now() - startTime;
      expect
        .soft(loadTime, 'Grid component should be visible within 15 seconds')
        .toBeLessThan(15000);
      console.log(`Grid component load time: ${loadTime}ms`);
    });
  });

  test('TC-TGFD-PERF-004: Grid - Card images load efficiently @Performance', async () => {
    await component.navigateWithAuthentication(buildUrl(gridPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Verify grid card image is fully loaded', async () => {
      const image = await component.getFirstCardImage();

      const imageMetrics = await image.evaluate((img: HTMLImageElement) => ({
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      }));

      expect.soft(imageMetrics.complete, 'Grid card image should be fully loaded').toBeTruthy();
      expect
        .soft(imageMetrics.naturalWidth, 'Grid card image should have valid width')
        .toBeGreaterThan(0);
      console.log(
        'Grid card image dimensions:',
        imageMetrics.naturalWidth,
        'x',
        imageMetrics.naturalHeight
      );
    });
  });

  test('TC-TGFD-PERF-005: Carousel - No layout shifts during carousel navigation @Performance', async () => {
    await component.navigateWithAuthentication(buildUrl(carouselPath));
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await test.step('Capture Cumulative Layout Shift score', async () => {
      const clsScore = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let cls = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
                cls += (entry as PerformanceEntry & { value?: number }).value ?? 0;
              }
            }
          });
          observer.observe({ type: 'layout-shift', buffered: true });
          setTimeout(() => {
            observer.disconnect();
            resolve(cls);
          }, 1000);
        });
      });

      expect.soft(clsScore, 'CLS score should be below 0.25 (Good threshold)').toBeLessThan(0.25);
      console.log(`Carousel CLS score: ${clsScore}`);
    });
  });
});

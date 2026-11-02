/**
 * Component Mapper - Related Content Spec
 * What:
 *   Validates Related Content component behavior, structure, and expected UI
 *   values against configured test data.
 * Why:
 *   Created to ensure Related Content quality is covered in mapper-driven page
 *   validation and standalone component regression.
 */

import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { RelatedContentComponent } from '../../components/relatedContentComponent';
import { componentURL } from '../../test-data/componentURL';
import { envUtils } from '../../helpers/utils/envUtils';
import { TEST_CONFIG, ViewportName } from '../../config/test-config';
import { RelatedContentFigmaValues } from '../../helpers/utils/figma-values/RelatedContent_FigmaValues';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

let component: RelatedContentComponent;
let page: Page;
let browser: Browser;
let context: BrowserContext;

const componentPath = componentURL.RelatedContentComponent.testData.url;

function buildUrl(path: string): string {
  const base = envUtils.getBaseUrl();
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${cleanBase}/${path}`;
}

test.setTimeout(120000);

test.beforeEach(async ({ page: p, browser: b, context: c }) => {
  await applyAllurePageContext('relatedContent');
  page = p;
  browser = b;
  context = c;
  component = new RelatedContentComponent(page, browser, context);
});

// =============================================================================
// FUNCTIONAL TESTS
// =============================================================================

test.describe('Related Content - Functional Tests', () => {
  test.beforeEach(async () => {
    await component.navigateWithAuthentication(buildUrl(componentPath));
    await page.waitForLoadState('load');
    await component.acceptCookiesBanner();
    await page.waitForTimeout(2000);
    const container = await component.getComponentContainer();
    await container.waitFor({ state: 'visible', timeout: 15000 });
  });

  test('TC-RC01: Component renders inside full-width content divider @Functional @Smoke', async () => {
    await test.step('Verify component container is visible', async () => {
      const container = await component.getComponentContainer();
      await expect.soft(container, 'Related Content container should be visible').toBeVisible();
    });

    await test.step('Verify component is within fullwidth-column parent', async () => {
      const isInsideFullWidth = await page.evaluate(() => {
        const relatedContent = document.querySelector('[data-testid="related-content"]');
        if (!relatedContent) return false;
        const parent = relatedContent.closest('[data-qa="fullwidth-column"]');
        return parent !== null;
      });
      expect.soft(isInsideFullWidth, 'Component should be inside fullwidth-column (AC3)').toBeTruthy();
    });
  });

  test('TC-RC02: Component title is visible and non-empty @Functional', async () => {
    await test.step('Verify title heading is visible', async () => {
      const title = await component.getComponentTitle();
      await expect.soft(title, 'Component title should be visible').toBeVisible();
    });

    await test.step('Verify title has text content', async () => {
      const title = await component.getComponentTitle();
      const text = await title.textContent();
      expect.soft(text?.trim().length, 'Title text should not be empty').toBeGreaterThan(0);
    });

    await test.step('Verify title uses semantic heading element', async () => {
      const title = await component.getComponentTitle();
      const tagName = await title.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tagName, 'Title should use a heading element (h1-h3)').toMatch(/h[1-3]/);
    });
  });

  test('TC-RC03: Card count is between 2 and 4 @Functional', async () => {
    await test.step('Verify minimum 2 and maximum 4 cards displayed', async () => {
      const count = await component.getCardCount();
      expect.soft(count, 'Card count should be at least 2 (AC8)').toBeGreaterThanOrEqual(2);
      expect.soft(count, 'Card count should be at most 4 (AC9)').toBeLessThanOrEqual(4);
    });
  });

  test('TC-RC04: Each card displays a headline/title text @Functional', async () => {
    const count = await component.getCardCount();
    for (let i = 0; i < count; i++) {
      await test.step(`Verify card ${i + 1} headline is visible and non-empty`, async () => {
        const headline = await component.getCardHeadline(i);
        await expect.soft(headline, `Card ${i + 1} headline should be visible`).toBeVisible();
        const text = await headline.textContent();
        expect.soft(text?.trim().length, `Card ${i + 1} headline should have text (AC14)`).toBeGreaterThan(0);
      });
    }
  });

  test('TC-RC05: Each card displays an image or placeholder @Functional', async () => {
    const count = await component.getCardCount();
    for (let i = 0; i < count; i++) {
      await test.step(`Verify card ${i + 1} has image or placeholder`, async () => {
        const imageArea = await component.getCardImage(i);
        await expect.soft(imageArea, `Card ${i + 1} image area should be visible (AC15)`).toBeVisible();
      });
    }
  });

  test('TC-RC06: Each card has a CTA link @Functional', async () => {
    const count = await component.getCardCount();
    for (let i = 0; i < count; i++) {
      await test.step(`Verify card ${i + 1} CTA link exists`, async () => {
        const ctaLink = await component.getCardCtaLink(i);
        await expect.soft(ctaLink, `Card ${i + 1} should have a CTA link`).toBeVisible();
      });
    }
  });

  test('TC-RC07: Current page does not appear among card links @Functional', async () => {
    await test.step('Verify self-exclusion (AC7)', async () => {
      const hrefs = await component.getAllCardHrefs();
      const currentUrl = page.url();
      const currentPath = new URL(currentUrl).pathname;
      for (const href of hrefs) {
        const hrefPath = href.startsWith('http') ? new URL(href).pathname : href;
        expect.soft(
          hrefPath.toLowerCase(),
          `Card link ${href} should not match current page (AC7)`
        ).not.toBe(currentPath.toLowerCase());
      }
    });
  });

  test('TC-RC08: No duplicate pages among cards @Functional', async () => {
    await test.step('Verify all card links are unique (AC11)', async () => {
      const hrefs = await component.getAllCardHrefs();
      const uniqueHrefs = new Set(hrefs.map((h) => h.toLowerCase()));
      expect.soft(uniqueHrefs.size, 'All card links should be unique (AC11)').toBe(hrefs.length);
    });
  });

  test('TC-RC09: CTA links have valid href values @Functional', async () => {
    const hrefs = await component.getAllCardHrefs();
    for (const href of hrefs) {
      await test.step(`Verify href "${href}" is valid`, async () => {
        const isValid = href.startsWith('/') || href.startsWith('http');
        expect.soft(isValid, `Href "${href}" should be a valid URL`).toBeTruthy();
      });
    }
  });

  test('TC-RC10: Component uses semantic article elements for cards @Functional', async () => {
    const count = await component.getCardCount();
    for (let i = 0; i < count; i++) {
      await test.step(`Verify card ${i + 1} is an article element`, async () => {
        const card = await component.getCardByIndex(i);
        const tagName = await card.evaluate((el) => el.tagName.toLowerCase());
        expect.soft(tagName, `Card ${i + 1} should be an <article> element`).toBe('article');
      });
    }
  });
});

// =============================================================================
// ACCESSIBILITY TESTS
// =============================================================================

test.describe('Related Content - Accessibility Tests', () => {
  test.beforeEach(async () => {
    await component.navigateWithAuthentication(buildUrl(componentPath));
    await page.waitForLoadState('load');
    await component.acceptCookiesBanner();
    await page.waitForTimeout(2000);
    const container = await component.getComponentContainer();
    await container.waitFor({ state: 'visible', timeout: 15000 });
  });

  test('TC-RC11: Cards have aria-label matching content @Accessibility', async () => {
    const count = await component.getCardCount();
    for (let i = 0; i < count; i++) {
      await test.step(`Verify card ${i + 1} aria-label is non-empty`, async () => {
        const card = await component.getCardByIndex(i);
        const ariaLabel = await card.getAttribute('aria-label');
        expect.soft(ariaLabel, `Card ${i + 1} should have aria-label`).toBeTruthy();
        expect.soft(
          ariaLabel?.trim().length,
          `Card ${i + 1} aria-label should not be empty`
        ).toBeGreaterThan(0);
      });
    }
  });

  test('TC-RC12: CTA links have aria-label @Accessibility', async () => {
    const count = await component.getCardCount();
    for (let i = 0; i < count; i++) {
      await test.step(`Verify card ${i + 1} CTA link has aria-label`, async () => {
        const ctaLink = await component.getCardCtaLink(i);
        const ariaLabel = await ctaLink.getAttribute('aria-label');
        expect.soft(ariaLabel, `Card ${i + 1} CTA should have aria-label`).toBeTruthy();
      });
    }
  });

  test('TC-RC13: Keyboard navigation through cards and links @Accessibility', async () => {
    await test.step('Tab through component and verify focus reaches CTA links', async () => {
      const container = await component.getComponentContainer();
      await container.scrollIntoViewIfNeeded();

      const count = await component.getCardCount();
      // Click on the component container to move focus into it before tabbing
      const firstCard = await component.getCardByIndex(0);
      await firstCard.scrollIntoViewIfNeeded();
      await firstCard.click({ position: { x: 5, y: 5 } });

      // Tab through the cards - each card should have at least one focusable anchor
      for (let i = 0; i < count; i++) {
        await page.keyboard.press('Tab');
        const focusedTag = await page.evaluate(() => {
          const el = document.activeElement;
          return el ? el.tagName.toLowerCase() : '';
        });
        expect.soft(
          focusedTag,
          `Focus after tab ${i + 1} should land on an interactive element`
        ).toMatch(/a|button/);
      }
    });
  });

  test('TC-RC14: Focus indicators visible on interactive elements @Accessibility', async () => {
    const count = await component.getCardCount();
    for (let i = 0; i < count; i++) {
      await test.step(`Verify card ${i + 1} link has focus indicator`, async () => {
        const anchor = await component.getCardAnchorLink(i);
        await anchor.focus();
        const focusStyles = await anchor.evaluate((el) => {
          const style = globalThis.getComputedStyle(el);
          return {
            outline: style.outline,
            outlineWidth: style.outlineWidth,
            outlineStyle: style.outlineStyle,
            outlineColor: style.outlineColor,
            boxShadow: style.boxShadow,
            borderColor: style.borderColor,
            borderWidth: style.borderWidth,
            textDecoration: style.textDecoration,
          };
        });
        const hasFocusIndicator =
          (focusStyles.outlineWidth !== '0px' && focusStyles.outlineStyle !== 'none') ||
          focusStyles.boxShadow !== 'none' ||
          focusStyles.borderWidth !== '0px' ||
          focusStyles.textDecoration.includes('underline');
        expect.soft(
          hasFocusIndicator,
          `Card ${i + 1} link should have visible focus indicator (outline, box-shadow, border, or underline)`
        ).toBeTruthy();
      });
    }
  });

  test('TC-RC15: Placeholder images have accessible aria-label @Accessibility', async () => {
    const count = await component.getCardCount();
    for (let i = 0; i < count; i++) {
      await test.step(`Verify card ${i + 1} image area has alt or aria-label`, async () => {
        const imageArea = await component.getCardImage(i);
        // Check if there is an img child with alt, or placeholder has aria-label
        const hasAccessibleLabel = await imageArea.evaluate((el) => {
          const img = el.querySelector('img');
          if (img?.alt) return true;
          if (el.getAttribute('aria-label')) return true;
          return false;
        });
        expect.soft(
          hasAccessibleLabel,
          `Card ${i + 1} image should have alt text or aria-label`
        ).toBeTruthy();
      });
    }
  });

  test('TC-RC16: Semantic HTML structure @Accessibility', async () => {
    await test.step('Verify wrapper is section element', async () => {
      const container = await component.getComponentContainer();
      const tag = await container.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tag, 'Component wrapper should be <section>').toBe('section');
    });

    await test.step('Verify title is heading element', async () => {
      const title = await component.getComponentTitle();
      const tag = await title.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tag, 'Title should be a heading element').toMatch(/h[1-6]/);
    });

    await test.step('Verify cards are article elements', async () => {
      const count = await component.getCardCount();
      for (let i = 0; i < count; i++) {
        const card = await component.getCardByIndex(i);
        const tag = await card.evaluate((el) => el.tagName.toLowerCase());
        expect.soft(tag, `Card ${i + 1} should be <article>`).toBe('article');
      }
    });

    await test.step('Verify card headlines are h3 elements', async () => {
      const count = await component.getCardCount();
      for (let i = 0; i < count; i++) {
        const headline = await component.getCardHeadline(i);
        const tag = await headline.evaluate((el) => el.tagName.toLowerCase());
        expect.soft(tag, `Card ${i + 1} headline should be <h3>`).toBe('h3');
      }
    });
  });
});

// =============================================================================
// PERFORMANCE TESTS
// =============================================================================

test.describe('Related Content - Performance Tests', () => {
  test('TC-RC17: Component loads within acceptable time @Performance', async () => {
    await test.step('Measure component load time', async () => {
      const startTime = Date.now();
      await component.navigateWithAuthentication(buildUrl(componentPath));
      await page.waitForLoadState('load');
      await page.waitForTimeout(2000);
      const container = await component.getComponentContainer();
      await container.waitFor({ state: 'visible', timeout: 15000 });
      const loadTime = Date.now() - startTime;
      expect.soft(loadTime, `Component should load within 15000ms (took ${loadTime}ms)`).toBeLessThan(15000);
    });
  });
});

// =============================================================================
// VISUAL TESTS - Typography per viewport
// =============================================================================

const viewportNames: ViewportName[] = ['XL', 'LG', 'MD', 'SM'];

test.describe('Related Content - Visual Tests', () => {
  test('TC-RC18: Component title typography across viewports @Visual', async () => {
    for (const vp of viewportNames) {
      await test.step(`Verify title typography at ${vp} viewport`, async () => {
        const viewport = TEST_CONFIG.viewports[vp];
        await component.navigateWithAuthentication(buildUrl(componentPath));
        await page.waitForLoadState('load');
        await component.acceptCookiesBanner();
        await page.setViewportSize(viewport);
        await page.waitForTimeout(2000);
        const container = await component.getComponentContainer();
        await container.waitFor({ state: 'visible', timeout: 15000 });

        const typography = await component.getComponentTitleTypography();
        const expected = RelatedContentFigmaValues[vp].sectionTitle;

        expect.soft(typography.fontFamily, `[${vp}] Title font-family should contain Bayer Sans`).toContain(expected.fontFamily);
        expect.soft(typography.fontSize, `[${vp}] Title font-size should match Figma (${expected.fontSize})`).toBe(expected.fontSize);
        expect.soft(typography.fontWeight, `[${vp}] Title font-weight should match Figma (${expected.fontWeight})`).toBe(expected.fontWeight);
        expect.soft(typography.lineHeight, `[${vp}] Title line-height should match Figma (${expected.lineHeight})`).toBe(expected.lineHeight);
        expect.soft(typography.color, `[${vp}] Title color should match Figma`).toBe(expected.color);
      });
    }
  });

  test('TC-RC19: Card headline typography across viewports @Visual', async () => {
    for (const vp of viewportNames) {
      await test.step(`Verify card headline typography at ${vp} viewport`, async () => {
        const viewport = TEST_CONFIG.viewports[vp];
        await component.navigateWithAuthentication(buildUrl(componentPath));
        await page.waitForLoadState('load');
        await component.acceptCookiesBanner();
        await page.setViewportSize(viewport);
        await page.waitForTimeout(2000);
        const container = await component.getComponentContainer();
        await container.waitFor({ state: 'visible', timeout: 15000 });

        const typography = await component.getCardHeadlineTypography(0);
        const expected = RelatedContentFigmaValues[vp].cardHeadline;

        expect.soft(typography.fontFamily, `[${vp}] Card headline font-family should contain Bayer Sans`).toContain(expected.fontFamily);
        expect.soft(typography.fontSize, `[${vp}] Card headline font-size should match Figma (${expected.fontSize})`).toBe(expected.fontSize);
        expect.soft(typography.fontWeight, `[${vp}] Card headline font-weight should match Figma (${expected.fontWeight})`).toBe(expected.fontWeight);
        expect.soft(typography.lineHeight, `[${vp}] Card headline line-height should match Figma (${expected.lineHeight})`).toBe(expected.lineHeight);
        expect.soft(typography.color, `[${vp}] Card headline color should match Figma`).toBe(expected.color);
      });
    }
  });

  test('TC-RC20: Card layout - responsive grid behavior @Visual', async () => {
    for (const vp of viewportNames) {
      await test.step(`Verify card layout at ${vp} viewport`, async () => {
        const viewport = TEST_CONFIG.viewports[vp];
        await page.setViewportSize(viewport);
        await component.navigateWithAuthentication(buildUrl(componentPath));
        await page.waitForLoadState('load');
        await component.acceptCookiesBanner();
        await page.waitForTimeout(2000);
        const container = await component.getComponentContainer();
        await container.waitFor({ state: 'visible', timeout: 15000 });

        const count = await component.getCardCount();
        if (count < 2) return;

        // Check if cards are laid out side by side (2-col) or stacked (1-col)
        const card0 = await component.getCardByIndex(0);
        const card1 = await component.getCardByIndex(1);
        const box0 = await card0.boundingBox();
        const box1 = await card1.boundingBox();

        if (box0 && box1) {
          if (vp === 'SM') {
            // SM: cards should be stacked (card1.y > card0.y + card0.height - some tolerance)
            expect.soft(
              box1.y,
              `[${vp}] Cards should be stacked vertically on mobile`
            ).toBeGreaterThan(box0.y + box0.height * 0.5);
          } else {
            // XL/LG/MD: cards side by side (same row - similar y position)
            const yDifference = Math.abs(box1.y - box0.y);
            expect.soft(
              yDifference,
              `[${vp}] Cards should be in same row (2-column grid)`
            ).toBeLessThan(box0.height * 0.5);
          }
        }
      });
    }
  });

  test('TC-RC21: Image/placeholder sizing renders correctly @Visual', async () => {
    await component.navigateWithAuthentication(buildUrl(componentPath));
    await page.waitForLoadState('load');
    await component.acceptCookiesBanner();
    await page.waitForTimeout(2000);
    const container = await component.getComponentContainer();
    await container.waitFor({ state: 'visible', timeout: 15000 });

    const count = await component.getCardCount();
    for (let i = 0; i < count; i++) {
      await test.step(`Verify card ${i + 1} image area has valid dimensions`, async () => {
        const imageArea = await component.getCardImage(i);
        const box = await imageArea.boundingBox();
        expect.soft(box, `Card ${i + 1} image area should have bounding box`).toBeTruthy();
        if (box) {
          expect.soft(box.width, `Card ${i + 1} image width should be > 0`).toBeGreaterThan(0);
          expect.soft(box.height, `Card ${i + 1} image height should be > 0`).toBeGreaterThan(0);
        }
      });
    }
  });

  test('TC-RC22: Component is placed within full-width container @Visual', async () => {
    await component.navigateWithAuthentication(buildUrl(componentPath));
    await page.waitForLoadState('load');
    await component.acceptCookiesBanner();
    await page.waitForTimeout(2000);

    await test.step('Verify full-width container wraps the component', async () => {
      const isFullWidth = await page.evaluate(() => {
        const comp = document.querySelector('[data-testid="related-content"]');
        if (!comp) return false;
        const parent = comp.closest('[data-qa="fullwidth-column"]');
        if (!parent) return false;
        const parentStyle = globalThis.getComputedStyle(parent);
        const parentWidth = parseFloat(parentStyle.width);
        // Full-width parent should span most of the viewport
        return parentWidth > globalThis.innerWidth * 0.8;
      });
      expect.soft(
        isFullWidth,
        'Component should be inside a full-width container (AC3)'
      ).toBeTruthy();
    });
  });
});

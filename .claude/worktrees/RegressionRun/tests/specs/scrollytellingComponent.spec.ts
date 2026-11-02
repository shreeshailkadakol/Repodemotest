/**
 * Scrollytelling Component — Frontend test suite
 *
 * Scope: FE rendering & behaviour only (CMS authoring is out of scope).
 * Categories: @Functional, @Accessibility, @Performance, @Visual.
 * All assertions are SOFT so a single failure never masks the rest of the run.
 * Every element interaction is routed through SmartLocator helpers on the
 * ScrollytellingComponent page object.
 *
 * Requirement: User Story 2183 (AC2–AC6).
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ScrollytellingComponent } from '../../components/scrollytellingComponent';
import { Scrollytelling_FigmaValues } from '../../helpers/utils/figma-values/Scrollytelling_FigmaValues';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

type Viewport = 'XL' | 'LG' | 'MD' | 'SM';

const VIEWPORT_SIZES: Record<Viewport, { width: number; height: number }> = {
  XL: { width: 1440, height: 900 },
  LG: { width: 1180, height: 820 },
  MD: { width: 834, height: 1112 },
  SM: { width: 390, height: 844 },
};

/** Extract the typography-relevant computed styles from a locator. */
async function getComputedStyles(locator: import('@playwright/test').Locator) {
  return locator.evaluate((el: HTMLElement) => {
    const s = globalThis.getComputedStyle(el);
    return {
      fontFamily: s.fontFamily,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      lineHeight: s.lineHeight,
      color: s.color,
    };
  });
}

/** Normalise rgb/rgba colours to a comparable rgb(r, g, b) form. */
function normalizeColor(color: string): string {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(color);
  return m ? `rgb(${m[1]}, ${m[2]}, ${m[3]})` : color;
}

function pxToNumber(value: string): number {
  return parseFloat(value.replace('px', '')) || 0;
}

test.describe('Scrollytelling Component', () => {
  let scrolly: ScrollytellingComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    await applyAllurePageContext('scrollytellingComponent');
    scrolly = new ScrollytellingComponent(page, browser, context);
    await scrolly.navigateToTestPage();
    await scrolly.acceptCookiesBanner();
  });

  // ===========================================================================
  // FUNCTIONAL
  // ===========================================================================
  test.describe('@Functional', () => {
    test('TC-ST01: Component loads and is visible @Functional @Smoke', async () => {
      const component = await scrolly.getComponent();
      await expect.soft(component, 'Scrollytelling component should be visible').toBeVisible();
      await expect
        .soft(component, 'Component should expose data-qa="scrollytelling"')
        .toHaveAttribute('data-qa', 'scrollytelling');
    });

    test('TC-ST02: All configured steps render (>= 2) @Functional', async () => {
      const count = await scrolly.getStepCount();
      expect
        .soft(count, 'Component should render at least 2 steps (AC: min 2 steps)')
        .toBeGreaterThanOrEqual(2);

      // Each step indicator should be present and carry an accessible label.
      for (let i = 0; i < count; i++) {
        const indicator = await scrolly.getStepIndicator(i);
        await expect.soft(indicator, `Step indicator #${i} should be attached`).toBeAttached();
        await expect
          .soft(indicator, `Step indicator #${i} should have an aria-label`)
          .toHaveAttribute('aria-label', /.+/);
      }
    });

    test('TC-ST03: Active step renders title (with highlight span) and description @Functional', async () => {
      const title = await scrolly.getActiveTitle();
      await expect.soft(title, 'Step title should be visible').toBeVisible();
      const titleText = (await title.textContent())?.trim() || '';
      expect.soft(titleText.length, 'Title should not be empty').toBeGreaterThan(0);

      const highlight = await scrolly.getTitleHighlightSpan();
      await expect
        .soft(highlight, 'Title should contain a highlight <span>')
        .toBeAttached();

      const description = await scrolly.getActiveDescription();
      await expect.soft(description, 'Step description should be visible').toBeVisible();
      const descText = (await description.textContent())?.trim() || '';
      expect.soft(descText.length, 'Description should not be empty').toBeGreaterThan(0);
    });

    test('TC-ST04: Stepper / pagination is sticky @Functional', async () => {
      // AC5: the sticky stepper is a scroll-motion behaviour deferred to #3319
      // and is not implemented on the current test page (compact, non scroll-
      // jacked layout). Re-enable once the sticky stepper ships.
      test.fixme(true, 'Sticky stepper is motion behaviour deferred to #3319');
      const pagination = await scrolly.getPaginationContainer();
      await expect.soft(pagination, 'Pagination container should be attached').toBeAttached();
      const sticky = await scrolly.isPaginationSticky();
      expect
        .soft(sticky, 'Stepper navigation should use sticky/fixed positioning (AC5)')
        .toBe(true);
    });

    test('TC-ST05: One indicator per step @Functional', async () => {
      const count = await scrolly.getStepCount();
      const labels = await scrolly.getStepLabels();
      expect
        .soft(labels.length, 'There should be exactly one indicator label per step')
        .toBe(count);
    });

    test('TC-ST06: Clicking a step indicator activates that step @Functional', async () => {
      const count = await scrolly.getStepCount();
      test.skip(count < 2, 'Needs at least 2 steps');

      await scrolly.clickStepIndicator(1);
      const activeIndex = await scrolly.getActiveStepIndex();
      expect
        .soft(activeIndex, 'Clicking indicator #1 should activate step #1 (AC4)')
        .toBe(1);
    });

    test('TC-ST07: Next arrow advances to the following step @Functional', async () => {
      const count = await scrolly.getStepCount();
      test.skip(count < 2, 'Needs at least 2 steps');

      await scrolly.clickStepIndicator(0);
      await scrolly.clickNext();
      const activeIndex = await scrolly.getActiveStepIndex();
      expect.soft(activeIndex, 'Next arrow should advance to step #1 (AC4)').toBe(1);
    });

    test('TC-ST08: Previous arrow goes back and is disabled on the first step @Functional', async () => {
      const count = await scrolly.getStepCount();
      test.skip(count < 2, 'Needs at least 2 steps');

      await scrolly.clickStepIndicator(0);
      const disabledOnFirst = await scrolly.isPreviousDisabled();
      expect
        .soft(disabledOnFirst, 'Previous arrow should be disabled on the first step')
        .toBe(true);

      await scrolly.clickStepIndicator(1);
      await scrolly.clickPrevious();
      const activeIndex = await scrolly.getActiveStepIndex();
      expect.soft(activeIndex, 'Previous arrow should return to step #0 (AC4)').toBe(0);
    });

    test('TC-ST09: Next arrow is disabled on the last step @Functional', async () => {
      const count = await scrolly.getStepCount();
      test.skip(count < 2, 'Needs at least 2 steps');

      await scrolly.clickStepIndicator(count - 1);
      const disabledOnLast = await scrolly.isNextDisabled();
      expect
        .soft(disabledOnLast, 'Next arrow should be disabled on the last step')
        .toBe(true);
    });

    test('TC-ST10: Scrolling updates the active step @Functional', async () => {
      // AC5: scroll-driven step transitions are motion behaviour deferred to
      // #3319 and are not present on the current test page (all panels render
      // simultaneously; scrolling does not switch the active step). Step
      // switching via click/arrow/keyboard is covered by TC-ST06/07/08.
      test.fixme(true, 'Scroll-driven step change is motion behaviour deferred to #3319');
      const count = await scrolly.getStepCount();
      test.skip(count < 2, 'Needs at least 2 steps');

      await scrolly.clickStepIndicator(0);
      const observed = await scrolly.scrollThroughComponent(14);
      expect
        .soft(observed.length, `Scrolling should surface more than one step (saw: ${observed.join(' | ')})`)
        .toBeGreaterThan(1);
    });

    test('TC-ST11: Step image renders for the active step @Functional', async () => {
      const image = await scrolly.getStepImage();
      await expect.soft(image, 'A step image should be visible').toBeVisible();
      const src = await image.getAttribute('src');
      expect.soft(src && src.length > 0, 'Step image should have a src').toBe(true);
    });

    test('TC-ST12: Image placement is rendered (full-width or reduced) @Functional', async () => {
      const placement = await scrolly.getActiveImagePlacement();
      expect
        .soft(['full', 'reduced'], 'Image placement should resolve to full or reduced (AC6)')
        .toContain(placement);

      if (placement === 'full') {
        const bg = await scrolly.getBackgroundImageContainer();
        await expect.soft(bg, 'Full-width image container should be attached').toBeAttached();
      } else {
        const positioned = await scrolly.getPositionedImageContainer();
        await expect
          .soft(positioned, 'Reduced image container should be attached')
          .toBeAttached();
      }
    });

    // -------------------------------------------------------------------------
    // Layout variants — the test page authors all four variants, one per step:
    //   Crop Science     -> full-screen image, text container right
    //   Consumer Health  -> full-screen image, text container left
    //   Pharmaceuticals  -> half (reduced) image, text container right
    //   Divisions        -> half (reduced) image, text container left
    // Typography is identical across variants; only placement + alignment differ.
    // -------------------------------------------------------------------------
    test('TC-ST13: All four layout variants are rendered (full/half × left/right) @Functional', async () => {
      const panels = await scrolly.getPanelLayouts();
      expect
        .soft(panels.length, 'Four content panels (one per layout variant) should render')
        .toBeGreaterThanOrEqual(4);

      const combos = new Set(panels.map((p) => `${p.placement}-${p.textSide}`));
      for (const expected of ['full-right', 'full-left', 'half-right', 'half-left']) {
        expect
          .soft(combos.has(expected), `Layout variant "${expected}" should be present`)
          .toBe(true);
      }
    });

    test('TC-ST14: Crop Science panel uses full-screen image with text container right @Functional', async () => {
      const panels = await scrolly.getPanelLayouts();
      const panel = panels.find((p) => /crop science/i.test(p.title));
      expect.soft(panel, 'Crop Science panel should be present').toBeTruthy();
      expect.soft(panel?.placement, 'Crop Science should use a full-screen image').toBe('full');
      expect.soft(panel?.textSide, 'Crop Science text container should sit right').toBe('right');
    });

    test('TC-ST15: Consumer Health panel uses full-screen image with text container left @Functional', async () => {
      const panels = await scrolly.getPanelLayouts();
      const panel = panels.find((p) => /consumer health/i.test(p.title));
      expect.soft(panel, 'Consumer Health panel should be present').toBeTruthy();
      expect.soft(panel?.placement, 'Consumer Health should use a full-screen image').toBe('full');
      expect.soft(panel?.textSide, 'Consumer Health text container should sit left').toBe('left');
    });

    test('TC-ST16: Pharmaceuticals panel uses half image with text container right @Functional', async () => {
      const panels = await scrolly.getPanelLayouts();
      const panel = panels.find((p) => /pharmaceuticals/i.test(p.title));
      expect.soft(panel, 'Pharmaceuticals panel should be present').toBeTruthy();
      expect.soft(panel?.placement, 'Pharmaceuticals should use a half (reduced) image').toBe('half');
      expect.soft(panel?.textSide, 'Pharmaceuticals text container should sit right').toBe('right');
    });

    test('TC-ST17: Divisions panel uses half image with text container left @Functional', async () => {
      const panels = await scrolly.getPanelLayouts();
      const panel = panels.find((p) => /divisions/i.test(p.title));
      expect.soft(panel, 'Divisions panel should be present').toBeTruthy();
      expect.soft(panel?.placement, 'Divisions should use a half (reduced) image').toBe('half');
      expect.soft(panel?.textSide, 'Divisions text container should sit left').toBe('left');
    });
  });

  // ===========================================================================
  // ACCESSIBILITY
  // ===========================================================================
  test.describe('@Accessibility', () => {
    test('TC-ST-A11Y01: No critical axe-core violations on the component @Accessibility', async ({
      page,
    }) => {
      const results = await new AxeBuilder({ page })
        .include('[data-qa="scrollytelling"]')
        // The title highlight uses gradient-clipped transparent text fill, which
        // axe-core cannot evaluate for contrast (reports a false positive). The
        // visible (non-highlight) title text is still covered by the scan.
        .exclude('[data-qa="scrollytelling-item-title"] span')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const serious = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical'
      );
      if (serious.length > 0) {
        console.log(
          'A11Y serious/critical violations:',
          JSON.stringify(
            serious.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
            null,
            2
          )
        );
      }
      expect
        .soft(serious.length, `Serious/critical a11y violations: ${serious.map((v) => v.id).join(', ')}`)
        .toBe(0);
    });

    test('TC-ST-A11Y02: Step indicators expose accessible names @Accessibility', async () => {
      const count = await scrolly.getStepCount();
      for (let i = 0; i < count; i++) {
        const indicator = await scrolly.getStepIndicator(i);
        const aria = (await indicator.getAttribute('aria-label')) || '';
        const text = (await indicator.textContent())?.trim() || '';
        expect
          .soft(aria.length > 0 || text.length > 0, `Indicator #${i} should have an accessible name`)
          .toBe(true);
      }

      const next = await scrolly.getNextButton();
      await expect.soft(next, 'Next button should have an aria-label').toHaveAttribute('aria-label', /.+/);
      const prev = await scrolly.getPreviousButton();
      await expect
        .soft(prev, 'Previous button should have an aria-label')
        .toHaveAttribute('aria-label', /.+/);
    });

    test('TC-ST-A11Y03: Step indicators are keyboard operable (Tab + Enter) @Accessibility', async ({
      page,
    }) => {
      const count = await scrolly.getStepCount();
      test.skip(count < 2, 'Needs at least 2 steps');

      const indicator = await scrolly.getStepIndicator(1);
      await indicator.focus();
      const isFocused = await indicator.evaluate((el) => el === document.activeElement);
      expect.soft(isFocused, 'Step indicator should be focusable').toBe(true);

      await page.keyboard.press('Enter');
      await page.waitForTimeout(1200);
      const activeIndex = await scrolly.getActiveStepIndex();
      expect.soft(activeIndex, 'Enter on indicator #1 should activate step #1').toBe(1);
    });

    test('TC-ST-A11Y04: Prev/Next arrows are keyboard operable @Accessibility', async ({ page }) => {
      const count = await scrolly.getStepCount();
      test.skip(count < 2, 'Needs at least 2 steps');

      await scrolly.clickStepIndicator(0);
      const next = await scrolly.getNextButton();
      await next.focus();
      const focused = await next.evaluate((el) => el === document.activeElement);
      expect.soft(focused, 'Next arrow should be focusable').toBe(true);

      await page.keyboard.press('Enter');
      await page.waitForTimeout(1200);
      const activeIndex = await scrolly.getActiveStepIndex();
      expect.soft(activeIndex, 'Enter on Next should advance to step #1').toBe(1);
    });

    test('TC-ST-A11Y05: Step images provide alt text @Accessibility', async ({ page }) => {
      const images = page.locator('img[data-qa="next-image"]');
      const total = await images.count();
      expect.soft(total, 'At least one step image should be present').toBeGreaterThan(0);

      for (let i = 0; i < total; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect
          .soft(alt !== null, `Step image #${i} should declare an alt attribute`)
          .toBe(true);
      }
    });
  });

  // ===========================================================================
  // PERFORMANCE
  // ===========================================================================
  test.describe('@Performance', () => {
    test('TC-ST-PERF01: Component becomes visible within threshold @Performance', async () => {
      const start = Date.now();
      const component = await scrolly.getComponent();
      await component.waitFor({ state: 'visible', timeout: 15000 });
      const elapsed = Date.now() - start;
      expect
        .soft(elapsed, 'Component should be visible within 10s')
        .toBeLessThanOrEqual(10000);
    });

    test('TC-ST-PERF02: Active step image finishes loading (naturalWidth > 0) @Performance', async ({
      page,
    }) => {
      const image = await scrolly.getStepImage();
      await image.waitFor({ state: 'visible', timeout: 15000 });

      // Poll until the browser reports the image as fully decoded.
      let loaded = false;
      const deadline = Date.now() + 15000;
      while (Date.now() < deadline) {
        loaded = await image.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0
        );
        if (loaded) break;
        await page.waitForTimeout(500);
      }
      expect.soft(loaded, 'Active step image should finish loading').toBe(true);
    });

    test('TC-ST-PERF03: Step transition settles after navigation @Performance', async () => {
      const count = await scrolly.getStepCount();
      test.skip(count < 2, 'Needs at least 2 steps');

      const start = Date.now();
      await scrolly.clickStepIndicator(1);
      const title = await scrolly.getActiveTitle();
      await title.waitFor({ state: 'visible', timeout: 10000 });
      const elapsed = Date.now() - start;
      expect
        .soft(elapsed, 'Step transition should settle within 8s')
        .toBeLessThanOrEqual(8000);
    });
  });

  // ===========================================================================
  // VISUAL (typography vs Figma — soft assertions with tolerance)
  // ===========================================================================
  test.describe('@Visual', () => {
    test('TC-ST-VIS01: Title typography matches Figma (XL) @Visual', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.XL);
      await page.waitForTimeout(500);

      const expected = Scrollytelling_FigmaValues.XL.title;
      const title = await scrolly.getActiveTitle();
      const actual = await getComputedStyles(title);

      expect
        .soft(actual.fontFamily.toLowerCase(), 'Title font-family should include Bayer Sans')
        .toContain('bayer sans');
      expect
        .soft(Math.abs(pxToNumber(actual.fontSize) - pxToNumber(expected.fontSize)), 'Title font-size within 2px of Figma')
        .toBeLessThanOrEqual(2);
      expect
        .soft(actual.fontWeight, 'Title font-weight should match Figma')
        .toBe(expected.fontWeight);
      expect
        .soft(normalizeColor(actual.color), 'Title colour should match Figma')
        .toBe(normalizeColor(expected.color));
    });

    test('TC-ST-VIS02: Description typography matches Figma (XL) @Visual', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.XL);
      await page.waitForTimeout(500);

      const expected = Scrollytelling_FigmaValues.XL.description;
      const description = await scrolly.getActiveDescription();
      const actual = await getComputedStyles(description);

      expect
        .soft(actual.fontFamily.toLowerCase(), 'Description font-family should include Bayer Sans')
        .toContain('bayer sans');
      expect
        .soft(Math.abs(pxToNumber(actual.fontSize) - pxToNumber(expected.fontSize)), 'Description font-size within 2px of Figma')
        .toBeLessThanOrEqual(2);
      expect
        .soft(actual.fontWeight, 'Description font-weight should match Figma')
        .toBe(expected.fontWeight);
    });

    test('TC-ST-VIS03: Title highlight span uses a gradient/clipped fill @Visual', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.XL);
      await page.waitForTimeout(500);

      const highlight = await scrolly.getTitleHighlightSpan();
      await expect.soft(highlight, 'Highlight span should be attached').toBeAttached();

      const fill = await highlight.evaluate((el) => {
        const s = globalThis.getComputedStyle(el);
        return {
          backgroundImage: s.backgroundImage,
          webkitTextFillColor: (s as any).webkitTextFillColor || '',
          backgroundClip: (s as any).webkitBackgroundClip || s.backgroundClip,
        };
      });

      const hasGradient =
        /gradient/i.test(fill.backgroundImage) ||
        /text/i.test(fill.backgroundClip) ||
        fill.webkitTextFillColor === 'rgba(0, 0, 0, 0)' ||
        fill.webkitTextFillColor === 'transparent';
      expect
        .soft(hasGradient, 'Highlight span should render a gradient/clipped text fill')
        .toBe(true);
    });

    test('TC-ST-VIS04: Title typography is responsive across XL/LG/MD/SM @Visual', async ({ page }) => {
      for (const vp of ['XL', 'LG', 'MD', 'SM'] as Viewport[]) {
        await page.setViewportSize(VIEWPORT_SIZES[vp]);
        await page.waitForTimeout(600);

        const expected = Scrollytelling_FigmaValues[vp].title;
        const title = await scrolly.getActiveTitle();
        const actual = await getComputedStyles(title);

        expect
          .soft(
            Math.abs(pxToNumber(actual.fontSize) - pxToNumber(expected.fontSize)),
            `[${vp}] Title font-size within 3px of Figma (${expected.fontSize})`
          )
          .toBeLessThanOrEqual(3);
        expect
          .soft(normalizeColor(actual.color), `[${vp}] Title colour should match Figma`)
          .toBe(normalizeColor(expected.color));
      }
    });
  });
});

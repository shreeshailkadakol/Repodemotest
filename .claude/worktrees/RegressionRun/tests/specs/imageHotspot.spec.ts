/**
 * Image Hotspot Component — Frontend test suite
 *
 * Scope: FE rendering & behaviour only (CMS authoring is out of scope).
 * Categories: @Functional, @Accessibility, @Visual.
 * All assertions are SOFT so a single failure never masks the rest of the run.
 *
 * Requirement: User Story 1576 (AC5, AC12–AC14).
 */

import { test, expect } from '@playwright/test';
import { ImageHotspotComponent } from '../../components/imageHotspotComponent';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';
import { ImageHotspot_FigmaValues } from '../../helpers/utils/figma-values/ImageHotspot_FigmaValues';

const VIEWPORT_SM = { width: 375, height: 812 };

test.describe('Image Hotspot Component', () => {
  let hotspot: ImageHotspotComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    await applyAllurePageContext('imageHotspotComponent');
    hotspot = new ImageHotspotComponent(page, browser, context);
    await hotspot.navigateToTestPage();
    await hotspot.acceptCookiesBanner();
  });

  // ===========================================================================
  // FUNCTIONAL
  // ===========================================================================
  test.describe('@Functional', () => {
    test('TC-IH01: Component renders with image and hotspot pins @Functional @Smoke', async () => {
      const component = await hotspot.getComponent();
      await expect.soft(component, 'Component container should be visible').toBeVisible();

      const image = await hotspot.getImage();
      await expect.soft(image, 'Component image should be visible').toBeVisible();
      const src = image;
      await expect.soft(src, 'Image should have a valid src attribute').toHaveAttribute('src');

      const pinCount = await hotspot.getHotspotPinCount();
      expect.soft(pinCount, 'At least one hotspot pin should be present').toBeGreaterThanOrEqual(1);
    });

    test('TC-IH02: Hotspot pins are positioned using percentage-based coordinates @Functional', async () => {
      const visiblePins = await hotspot.getVisibleHotspotPins();
      expect
        .soft(visiblePins.length, 'At least one visible pin (non-zero position) should exist')
        .toBeGreaterThanOrEqual(1);

      for (let i = 0; i < visiblePins.length; i++) {
        const pos = await hotspot.getHotspotPinPosition(visiblePins[i]);
        expect
          .soft(pos.left, `Pin ${i} should have a left percentage value`)
          .toMatch(/^\d+(\.\d+)?%$/);
        expect
          .soft(pos.top, `Pin ${i} should have a top percentage value`)
          .toMatch(/^\d+(\.\d+)?%$/);
      }
    });

    test('TC-IH03: Clicking a hotspot pin opens the overlay card @Functional', async () => {
      await hotspot.clickVisibleHotspotPin(0);

      const overlayVisible = await hotspot.isOverlayVisible();
      expect
        .soft(overlayVisible, 'Overlay should be visible after clicking a hotspot pin')
        .toBe(true);

      const dialog = await hotspot.getOverlayDialog();
      await expect
        .soft(dialog, 'Overlay dialog should have open attribute')
        .toHaveAttribute('open', '');

      await hotspot.closeOverlayByEscape();
    });

    test('TC-IH04: Overlay displays title, description, image, and CTA link @Functional', async () => {
      await hotspot.clickVisibleHotspotPin(0);

      const title = await hotspot.getOverlayTitle();
      await expect.soft(title, 'Overlay title should be visible').toBeVisible();
      const titleText = await title.textContent();
      expect.soft(titleText?.trim().length, 'Title should not be empty').toBeGreaterThan(0);

      const description = await hotspot.getOverlayDescription();
      await expect.soft(description, 'Overlay description should be visible').toBeVisible();

      const overlayImage = await hotspot.getOverlayImage();
      await expect.soft(overlayImage, 'Overlay image should be visible').toBeVisible();
      const imgSrc = overlayImage;
      await expect.soft(imgSrc, 'Overlay image should have a valid src').toHaveAttribute('src');

      const ctaLink = await hotspot.getOverlayCTALink();
      await expect.soft(ctaLink, 'CTA link should be visible').toBeVisible();

      await hotspot.closeOverlayByEscape();
    });

    test('TC-IH05: Close overlay using the X (close) button @Functional', async () => {
      await hotspot.clickVisibleHotspotPin(0);

      let overlayVisible = await hotspot.isOverlayVisible();
      expect.soft(overlayVisible, 'Overlay should be visible before closing').toBe(true);

      await hotspot.closeOverlayByButton();

      overlayVisible = await hotspot.isOverlayVisible();
      expect
        .soft(overlayVisible, 'Overlay should be hidden after clicking close button')
        .toBe(false);
    });

    test('TC-IH06: Close overlay using the Escape key @Functional', async () => {
      await hotspot.clickVisibleHotspotPin(0);

      let overlayVisible = await hotspot.isOverlayVisible();
      expect.soft(overlayVisible, 'Overlay should be visible before pressing Escape').toBe(true);

      await hotspot.closeOverlayByEscape();

      overlayVisible = await hotspot.isOverlayVisible();
      expect.soft(overlayVisible, 'Overlay should be hidden after pressing Escape').toBe(false);
    });

    test('TC-IH07: CTA link in overlay has target="_blank" @Functional', async () => {
      await hotspot.clickVisibleHotspotPin(0);

      const ctaLink = await hotspot.getOverlayCTALink();
      await expect
        .soft(ctaLink, 'CTA link should have target="_blank"')
        .toHaveAttribute('target', '_blank');
      await expect
        .soft(ctaLink, 'CTA link should have rel="noopener noreferrer"')
        .toHaveAttribute('rel', /noopener/);

      const href = ctaLink;
      await expect.soft(href, 'CTA link should have a valid href').toHaveAttribute('href');

      await hotspot.closeOverlayByEscape();
    });

    test('TC-IH08: SM viewport - overlay backdrop covers full viewport @Functional @Responsive', async ({
      page,
    }) => {
      await page.setViewportSize(VIEWPORT_SM);
      await page.waitForTimeout(500);

      await hotspot.clickVisibleHotspotPin(0);

      const backdropVisible = await hotspot.isBackdropVisible();
      expect.soft(backdropVisible, 'Backdrop should be visible on SM viewport').toBe(true);

      const backdrop = await hotspot.getOverlayBackdrop();
      const position = await backdrop.evaluate(
        (el: HTMLElement) => globalThis.getComputedStyle(el).position
      );
      expect.soft(position, 'Backdrop should have position: fixed').toBe('fixed');

      const inset = await backdrop.evaluate(
        (el: HTMLElement) => globalThis.getComputedStyle(el).inset
      );
      expect.soft(inset, 'Backdrop should cover full viewport (inset: 0px)').toBe('0px');

      await hotspot.closeOverlayByEscape();
    });

    test('TC-IH09: Overlay stays within viewport bounds @Functional', async ({ page }) => {
      const visiblePins = await hotspot.getVisibleHotspotPins();
      const pinsToTest = Math.min(visiblePins.length, 3);

      for (let i = 0; i < pinsToTest; i++) {
        await hotspot.clickVisibleHotspotPin(i);

        const result = await hotspot.verifyOverlayWithinViewport();
        expect
          .soft(
            result.withinViewport,
            `Pin ${i} overlay should be within viewport: ${result.details}`
          )
          .toBe(true);

        await hotspot.closeOverlayByEscape();
        await page.waitForTimeout(300);
      }
    });

    test('TC-IH10: Multiple hotspots can be opened sequentially @Functional', async () => {
      const visiblePins = await hotspot.getVisibleHotspotPins();
      if (visiblePins.length < 2) {
        test.skip();
        return;
      }

      await hotspot.clickVisibleHotspotPin(0);
      const title1 = await hotspot.getOverlayTitle();
      await expect.soft(title1, 'First overlay title should be visible').toBeVisible();
      await hotspot.closeOverlayByButton();

      let overlayGone = await hotspot.isOverlayVisible();
      expect.soft(overlayGone, 'Overlay should close before opening next').toBe(false);

      await hotspot.clickVisibleHotspotPin(1);
      const overlayVisible = await hotspot.isOverlayVisible();
      expect.soft(overlayVisible, 'Second hotspot overlay should open').toBe(true);

      const title2 = await hotspot.getOverlayTitle();
      const titleText2 = await title2.textContent();
      expect
        .soft(titleText2?.trim().length, 'Second overlay title should not be empty')
        .toBeGreaterThan(0);

      await hotspot.closeOverlayByEscape();
    });

    test('TC-IH11: Image wrapper scales responsively across breakpoints @Functional @Responsive', async ({
      page,
    }) => {
      const wrapper = await hotspot.getImageWrapper();
      await wrapper.scrollIntoViewIfNeeded();
      const xlBox = await wrapper.boundingBox();
      expect.soft(xlBox, 'Image wrapper should have a bounding box at XL').toBeTruthy();
      const xlWidth = xlBox!.width;

      await page.setViewportSize(VIEWPORT_SM);
      await page.waitForTimeout(1000);
      await wrapper.scrollIntoViewIfNeeded();

      const smBox = await wrapper.boundingBox();
      expect.soft(smBox, 'Image wrapper should have a bounding box at SM').toBeTruthy();
      const smWidth = smBox!.width;

      expect
        .soft(smWidth, 'Image wrapper should be narrower on SM than XL viewport')
        .toBeLessThan(xlWidth);
      expect.soft(smWidth, 'Image wrapper should still be visible on SM').toBeGreaterThan(0);
    });

    test('TC-IH12: Hotspot positions maintain proportional CSS coordinates on resize @Functional @Responsive', async ({
      page,
    }) => {
      const visiblePins = await hotspot.getVisibleHotspotPins();
      if (visiblePins.length === 0) {
        test.skip();
        return;
      }

      const pin = visiblePins[0];
      const xlPos = await hotspot.getHotspotPinPosition(pin);
      expect.soft(xlPos.left, 'Pin should have a left percentage at XL').toMatch(/^\d+(\.\d+)?%$/);
      expect.soft(xlPos.top, 'Pin should have a top percentage at XL').toMatch(/^\d+(\.\d+)?%$/);

      await page.setViewportSize(VIEWPORT_SM);
      await page.waitForTimeout(1000);

      const smPos = await hotspot.getHotspotPinPosition(pin);
      expect
        .soft(
          smPos.left,
          `Pin left% should be preserved across viewports (XL: ${xlPos.left}, SM: ${smPos.left})`
        )
        .toBe(xlPos.left);
      expect
        .soft(
          smPos.top,
          `Pin top% should be preserved across viewports (XL: ${xlPos.top}, SM: ${smPos.top})`
        )
        .toBe(xlPos.top);
    });

    test('TC-IH13: Hotspot pin size adapts between viewports @Functional @Responsive', async ({
      page,
    }) => {
      const visiblePins = await hotspot.getVisibleHotspotPins();
      if (visiblePins.length === 0) {
        test.skip();
        return;
      }

      const pin = visiblePins[0];
      await pin.scrollIntoViewIfNeeded();
      const xlPinBox = await pin.boundingBox();
      expect.soft(xlPinBox, 'Pin should have a bounding box at XL').toBeTruthy();
      const xlPinWidth = xlPinBox!.width;

      await page.setViewportSize(VIEWPORT_SM);
      await page.waitForTimeout(1000);
      await pin.scrollIntoViewIfNeeded();

      const smPinBox = await pin.boundingBox();
      expect.soft(smPinBox, 'Pin should have a bounding box at SM').toBeTruthy();
      const smPinWidth = smPinBox!.width;

      expect.soft(smPinWidth, 'Pin should be visible on SM').toBeGreaterThan(0);
      expect
        .soft(
          smPinWidth,
          `Pin size should differ between viewports (XL: ${xlPinWidth}px, SM: ${smPinWidth}px)`
        )
        .not.toBe(xlPinWidth);
    });

    test('TC-IH14: Image displays in original aspect ratio @Functional', async () => {
      const natural = await hotspot.getImageNaturalDimensions();
      const rendered = await hotspot.getImageBoundingBox();

      expect.soft(natural.naturalWidth, 'Image should have natural dimensions').toBeGreaterThan(0);
      expect.soft(rendered, 'Image should have rendered dimensions').toBeTruthy();

      const naturalRatio = natural.naturalWidth / natural.naturalHeight;
      const renderedRatio = rendered!.width / rendered!.height;

      const ratioDiff = Math.abs(naturalRatio - renderedRatio);
      expect
        .soft(
          ratioDiff,
          `Aspect ratio should be preserved (natural: ${naturalRatio.toFixed(3)}, rendered: ${renderedRatio.toFixed(3)})`
        )
        .toBeLessThan(0.05);
    });
  });

  // ===========================================================================
  // ACCESSIBILITY
  // ===========================================================================
  test.describe('@Accessibility', () => {
    test('TC-AIH01: Hotspot pins have descriptive aria-labels @Accessibility', async () => {
      const visiblePins = await hotspot.getVisibleHotspotPins();

      for (let i = 0; i < visiblePins.length; i++) {
        await expect
          .soft(visiblePins[i], `Pin ${i} should have a non-empty aria-label`)
          .toHaveAttribute('aria-label', /.+/);
      }
    });

    test('TC-AIH02: Overlay dialog uses semantic dialog element with aria-labelledby @Accessibility', async () => {
      await hotspot.clickVisibleHotspotPin(0);

      const dialog = await hotspot.getOverlayDialog();
      const tagName = await dialog.evaluate((el: HTMLElement) => el.tagName);
      expect.soft(tagName, 'Overlay should use <dialog> element').toBe('DIALOG');

      await expect
        .soft(dialog, 'Dialog should have aria-labelledby attribute')
        .toHaveAttribute('aria-labelledby', /.+/);

      const ariaAndId = await dialog.evaluate((el: HTMLElement) => {
        const h2 = el.querySelector('h2[data-qa="title-component"]');
        return {
          ariaLabelledby: el.getAttribute('aria-labelledby') || '',
          titleId: h2?.getAttribute('id') || '',
        };
      });
      expect
        .soft(ariaAndId.ariaLabelledby, 'aria-labelledby should reference the title element id')
        .toBe(ariaAndId.titleId);

      await hotspot.closeOverlayByEscape();
    });

    test('TC-AIH03: Close button has accessible label @Accessibility', async () => {
      await hotspot.clickVisibleHotspotPin(0);

      const closeBtn = await hotspot.getOverlayCloseButton();
      await expect
        .soft(closeBtn, 'Close button should have a non-empty aria-label')
        .toHaveAttribute('aria-label', /.+/);

      await hotspot.closeOverlayByEscape();
    });

    test('TC-AIH04: Keyboard navigation - Tab to hotspots, Enter to open, Escape to close @Accessibility @Keyboard', async ({
      page,
    }) => {
      const component = await hotspot.getComponent();
      await component.scrollIntoViewIfNeeded();

      const visiblePins = await hotspot.getVisibleHotspotPins();
      if (visiblePins.length === 0) {
        test.skip();
        return;
      }

      await visiblePins[0].focus();
      const isFocused = await visiblePins[0].evaluate(
        (el: HTMLElement) => globalThis.document.activeElement === el
      );
      expect.soft(isFocused, 'Hotspot pin should be focusable').toBe(true);

      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      let overlayVisible = await hotspot.isOverlayVisible();
      expect.soft(overlayVisible, 'Enter key should open the overlay').toBe(true);

      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      overlayVisible = await hotspot.isOverlayVisible();
      expect.soft(overlayVisible, 'Escape key should close the overlay').toBe(false);
    });
  });

  // ===========================================================================
  // VISUAL
  // ===========================================================================
  test.describe('@Visual', () => {
    test('TC-VIH01: Hotspot pin styling - accent color inner circle @Visual', async () => {
      const visiblePins = await hotspot.getVisibleHotspotPins();
      if (visiblePins.length === 0) {
        test.skip();
        return;
      }

      const pin = visiblePins[0];
      const outerSvg = pin.locator('svg').first();
      const outerFill = await outerSvg.evaluate((el: SVGElement) =>
        globalThis.getComputedStyle(el).getPropertyValue('fill')
      );
      expect.soft(outerFill, 'Outer circle should have a fill color').toBeTruthy();

      const innerSvg = pin.locator('svg').nth(1);
      const innerClasses = await innerSvg.getAttribute('class');
      expect
        .soft(innerClasses, 'Inner circle should use primary-accent fill class')
        .toContain('fill-background-bg-primary-accent');
    });

    test('TC-VIH02: Overlay card dimensions and structure @Visual', async () => {
      await hotspot.clickVisibleHotspotPin(0);

      const dialog = await hotspot.getOverlayDialog();
      const width = await dialog.evaluate(
        (el: HTMLElement) => globalThis.getComputedStyle(el).width
      );
      const widthPx = parseFloat(width.replace('px', ''));
      expect.soft(widthPx, 'Overlay card should have a defined width').toBeGreaterThan(0);

      const title = await hotspot.getOverlayTitle();
      const titleFontWeight = await title.evaluate(
        (el: HTMLElement) => globalThis.getComputedStyle(el).fontWeight
      );
      expect
        .soft(Number(titleFontWeight), 'Title should be bold (weight >= 700)')
        .toBeGreaterThanOrEqual(700);

      await hotspot.closeOverlayByEscape();
    });

    test('TC-VIH03: CTA link typography matches Figma spec @Visual', async () => {
      await hotspot.clickVisibleHotspotPin(0);

      const ctaLink = await hotspot.getOverlayCTALink();
      const styles = await ctaLink.evaluate((el: HTMLElement) => {
        const cs = globalThis.getComputedStyle(el);
        return {
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          fontStyle: cs.fontStyle,
          textTransform: cs.textTransform,
          letterSpacing: cs.letterSpacing,
        };
      });

      const expected = ImageHotspot_FigmaValues.ctaLink.XL;
      expect
        .soft(styles.fontSize, `CTA fontSize should be ${expected.fontSize}`)
        .toBe(expected.fontSize);
      expect
        .soft(Number(styles.fontWeight), `CTA fontWeight should be ${expected.fontWeight}`)
        .toBeGreaterThanOrEqual(Number(expected.fontWeight));
      expect.soft(styles.fontStyle, 'CTA should be italic').toBe(expected.fontStyle);
      expect
        .soft(styles.textTransform, 'CTA should be uppercase')
        .toBe(expected.textTransform.toLowerCase());

      await hotspot.closeOverlayByEscape();
    });

    test('TC-VIH04: Overlay panel width matches Figma spec per viewport @Visual @Responsive', async ({
      page,
    }) => {
      const VIEWPORT_XL = { width: 1440, height: 900 };
      await page.setViewportSize(VIEWPORT_XL);
      await page.waitForTimeout(1000);

      await hotspot.clickVisibleHotspotPin(0);

      const dialog = await hotspot.getOverlayDialog();
      const xlWidth = await dialog.evaluate((el: HTMLElement) =>
        parseFloat(globalThis.getComputedStyle(el).width)
      );
      const expectedXL = ImageHotspot_FigmaValues.panel.XL.width;
      expect
        .soft(xlWidth, `Panel width at XL (1440px) should be ~${expectedXL}px`)
        .toBeCloseTo(expectedXL, -1);

      await hotspot.closeOverlayByEscape();

      await page.setViewportSize(VIEWPORT_SM);
      await page.waitForTimeout(1000);

      await hotspot.clickVisibleHotspotPin(0);

      const smWidth = await dialog.evaluate((el: HTMLElement) =>
        parseFloat(globalThis.getComputedStyle(el).width)
      );
      const expectedSM = ImageHotspot_FigmaValues.panel.SM.width;
      expect
        .soft(smWidth, `Panel width at SM should be ~${expectedSM}px`)
        .toBeCloseTo(expectedSM, -1);

      await hotspot.closeOverlayByEscape();
    });

    test('TC-VIH05: Overlay typography scales per viewport @Visual @Responsive', async ({
      page,
    }) => {
      const VIEWPORT_XL = { width: 1440, height: 900 };
      await page.setViewportSize(VIEWPORT_XL);
      await page.waitForTimeout(1000);

      await hotspot.clickVisibleHotspotPin(0);

      const title = await hotspot.getOverlayTitle();
      const xlTitleSize = await title.evaluate(
        (el: HTMLElement) => globalThis.getComputedStyle(el).fontSize
      );
      expect
        .soft(
          xlTitleSize,
          `Title fontSize at XL should be ${ImageHotspot_FigmaValues.panelTitle.XL.fontSize}`
        )
        .toBe(ImageHotspot_FigmaValues.panelTitle.XL.fontSize);

      const description = await hotspot.getOverlayDescription();
      const descTextEl = description.locator('p').first();
      const xlDescSize = await descTextEl.evaluate(
        (el: HTMLElement) => globalThis.getComputedStyle(el).fontSize
      );
      expect
        .soft(
          xlDescSize,
          `Description fontSize at XL should be ${ImageHotspot_FigmaValues.panelDescription.XL.fontSize}`
        )
        .toBe(ImageHotspot_FigmaValues.panelDescription.XL.fontSize);

      await hotspot.closeOverlayByEscape();

      await page.setViewportSize(VIEWPORT_SM);
      await page.waitForTimeout(1000);

      await hotspot.clickVisibleHotspotPin(0);

      const smTitleSize = await title.evaluate(
        (el: HTMLElement) => globalThis.getComputedStyle(el).fontSize
      );
      expect
        .soft(
          smTitleSize,
          `Title fontSize at SM should be ${ImageHotspot_FigmaValues.panelTitle.SM.fontSize}`
        )
        .toBe(ImageHotspot_FigmaValues.panelTitle.SM.fontSize);

      const smDescSize = await descTextEl.evaluate(
        (el: HTMLElement) => globalThis.getComputedStyle(el).fontSize
      );
      expect
        .soft(
          smDescSize,
          `Description fontSize at SM should be ${ImageHotspot_FigmaValues.panelDescription.SM.fontSize}`
        )
        .toBe(ImageHotspot_FigmaValues.panelDescription.SM.fontSize);

      await hotspot.closeOverlayByEscape();
    });

    test('TC-VIH06: Hotspot pin size matches Figma spec per viewport @Visual @Responsive', async ({
      page,
    }) => {
      const visiblePins = await hotspot.getVisibleHotspotPins();
      if (visiblePins.length === 0) {
        test.skip();
        return;
      }

      const pin = visiblePins[0];
      await pin.scrollIntoViewIfNeeded();
      const xlBox = await pin.boundingBox();
      expect.soft(xlBox, 'Pin should have a bounding box at XL').toBeTruthy();
      const expectedXL = ImageHotspot_FigmaValues.hotspotPin.XL.size;
      expect
        .soft(xlBox!.width, `Pin width at XL should be ~${expectedXL}px`)
        .toBeCloseTo(expectedXL, -1);
      expect
        .soft(xlBox!.height, `Pin height at XL should be ~${expectedXL}px`)
        .toBeCloseTo(expectedXL, -1);

      await page.setViewportSize(VIEWPORT_SM);
      await page.waitForTimeout(1000);
      await pin.scrollIntoViewIfNeeded();

      const smBox = await pin.boundingBox();
      expect.soft(smBox, 'Pin should have a bounding box at SM').toBeTruthy();
      const expectedSM = ImageHotspot_FigmaValues.hotspotPin.SM.size;
      expect
        .soft(smBox!.width, `Pin width at SM should be ~${expectedSM}px`)
        .toBeCloseTo(expectedSM, -1);
      expect
        .soft(smBox!.height, `Pin height at SM should be ~${expectedSM}px`)
        .toBeCloseTo(expectedSM, -1);
    });
  });
});

/**
 * Global Contact Link Component - Frontend test suite
 *
 * Scope: FE rendering & behaviour only (CMS authoring is out of scope).
 * Categories: @Functional, @Accessibility, @Visual.
 * All assertions are SOFT so a single failure never masks the rest of the run.
 *
 * Requirement: User Story 4883 (AC3, AC4).
 */

import { test, expect } from '@playwright/test';
import { GlobalContactLinkComponent } from '../../components/globalContactLinkComponent';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';
import { GlobalContactLink_FigmaValues } from '../../helpers/utils/figma-values/GlobalContactLink_FigmaValues';

test.describe('Global Contact Link Component', () => {
  let gcl: GlobalContactLinkComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    await applyAllurePageContext('globalContactLinkComponent');
    gcl = new GlobalContactLinkComponent(page, browser, context);
    await gcl.navigateToTestPage();
    await gcl.acceptCookiesBanner();
  });

  // ===========================================================================
  // FUNCTIONAL
  // ===========================================================================
  test.describe('@Functional', () => {
    test('TC-GCL01: Component renders with icon, title, and CTA button @Functional @Smoke', async () => {
      const component = await gcl.getComponent();
      await expect.soft(component, 'Component container should be visible').toBeVisible();

      const icon = await gcl.getGlobeIcon();
      await expect.soft(icon, 'Globe icon should be visible').toBeVisible();

      const title = await gcl.getTitle();
      await expect.soft(title, 'Title should be visible').toBeVisible();

      const button = await gcl.getCTAButton();
      await expect.soft(button, 'CTA button should be visible').toBeVisible();
    });

    test('TC-GCL02: Globe icon is visible and decorative @Functional', async () => {
      const icon = await gcl.getGlobeIcon();
      await expect.soft(icon, 'Globe icon should be visible').toBeVisible();
      await expect
        .soft(icon, 'Globe SVG should have aria-hidden=true')
        .toHaveAttribute('aria-hidden', 'true');
    });

    test('TC-GCL03: CTA button click opens location selector overlay @Functional', async () => {
      await gcl.clickCTAButton();

      const overlay = await gcl.getLocationOverlay();
      await expect
        .soft(overlay, 'Location overlay should be visible after CTA click')
        .toBeVisible();
    });

    test('TC-GCL04: Location overlay can be closed via Close button @Functional', async ({
      page,
    }) => {
      await gcl.clickCTAButton();

      const overlay = await gcl.getLocationOverlay();
      await expect.soft(overlay, 'Overlay should be visible').toBeVisible();

      await gcl.clickOverlayClose();

      await expect
        .soft(
          page.locator('[data-testid="location-overlay"]'),
          'Overlay should not be visible after closing'
        )
        .toBeHidden({ timeout: 5000 });
    });

    test('TC-GCL05: Title text is present and non-empty @Functional', async () => {
      const title = await gcl.getTitle();
      const text = await title.textContent();
      expect.soft(text?.trim().length, 'Title text should be non-empty').toBeGreaterThan(0);
    });

    test('TC-GCL06: CTA button text is present and non-empty @Functional', async () => {
      const buttonText = await gcl.getCTAButtonText();
      const text = await buttonText.textContent();
      expect.soft(text?.trim().length, 'CTA button text should be non-empty').toBeGreaterThan(0);
    });

    test('TC-GCL07: Location overlay opens with Global preselected @Functional', async ({
      page,
    }) => {
      await gcl.clickCTAButton();

      const overlay = await gcl.getLocationOverlay();
      await expect.soft(overlay, 'Location overlay should be visible').toBeVisible();

      // Overlay content loads asynchronously — use page.locator with extended timeout
      const globalButtonLocator = page.locator(
        '[data-testid="location-overlay"] button[aria-label*="Global"]'
      );
      await expect
        .soft(globalButtonLocator, 'Bayer Global button should be visible in overlay')
        .toBeVisible({ timeout: 10000 });
      await expect
        .soft(globalButtonLocator, 'Bayer Global button should have aria-label containing Global')
        .toHaveAttribute('aria-label', /Global/);
    });
  });

  // ===========================================================================
  // ACCESSIBILITY
  // ===========================================================================
  test.describe('@Accessibility', () => {
    test('TC-AGCL01: Globe SVG has aria-hidden=true @Accessibility', async () => {
      const icon = await gcl.getGlobeIcon();
      await expect
        .soft(icon, 'Globe SVG should be aria-hidden for screen readers')
        .toHaveAttribute('aria-hidden', 'true');
    });

    test('TC-AGCL02: CTA button has aria-label attribute @Accessibility', async () => {
      const button = await gcl.getCTAButton();
      await expect
        .soft(button, 'CTA button should have an aria-label')
        .toHaveAttribute('aria-label', /.+/);
    });

    test('TC-AGCL03: Chevron SVG has aria-hidden=true @Accessibility', async () => {
      const chevron = await gcl.getChevronIcon();
      await expect
        .soft(chevron, 'Chevron SVG should be aria-hidden for screen readers')
        .toHaveAttribute('aria-hidden', 'true');
    });

    test('TC-AGCL04: CTA button is keyboard-focusable and activatable with Enter @Accessibility', async ({
      page,
    }) => {
      const button = await gcl.getCTAButton();
      await button.focus();
      await expect.soft(button, 'CTA button should be focused').toBeFocused();

      await page.keyboard.press('Enter');

      const overlay = await gcl.getLocationOverlay();
      await expect.soft(overlay, 'Location overlay should open on Enter key').toBeVisible();
    });
  });

  // ===========================================================================
  // VISUAL
  // ===========================================================================
  test.describe('@Visual', () => {
    const figma = GlobalContactLink_FigmaValues;

    test('TC-VGCL01: Title typography matches Figma @Visual', async () => {
      const title = await gcl.getTitle();
      const fontSize = await gcl.getCssValue(title, 'font-size');
      const fontWeight = await gcl.getCssValue(title, 'font-weight');
      const lineHeight = await gcl.getCssValue(title, 'line-height');
      const color = await gcl.getCssValue(title, 'color');

      expect.soft(fontSize, 'Title fontSize').toBe(figma.title.XL.fontSize);
      expect.soft(fontWeight, 'Title fontWeight').toBe(figma.title.XL.fontWeight);
      expect.soft(lineHeight, 'Title lineHeight').toBe(figma.title.XL.lineHeight);
      expect
        .soft(gcl.normalizeCssColor(color), 'Title color')
        .toBe(gcl.normalizeCssColor(figma.colors.textPrimary));
    });

    test('TC-VGCL02: CTA text typography matches Figma @Visual', async () => {
      const ctaText = await gcl.getCTAButtonText();
      const fontSize = await gcl.getCssValue(ctaText, 'font-size');
      const color = await gcl.getCssValue(ctaText, 'color');

      expect.soft(fontSize, 'CTA fontSize').toBe(figma.ctaLink.XL.fontSize);
      expect
        .soft(gcl.normalizeCssColor(color), 'CTA text color')
        .toBe(gcl.normalizeCssColor(figma.colors.textPrimary));
    });

    test('TC-VGCL03: Icon dimensions match Figma at XL @Visual', async () => {
      const icon = await gcl.getGlobeIcon();
      const width = await gcl.getCssValue(icon, 'width');
      const height = await gcl.getCssValue(icon, 'height');

      expect.soft(width, 'Icon width (XL)').toBe(`${figma.icon.XL.width}px`);
      expect.soft(height, 'Icon height (XL)').toBe(`${figma.icon.XL.height}px`);
    });

    test('TC-VGCL05: Icon dimensions match Figma at SM viewport @Visual', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 720 });

      const icon = await gcl.getGlobeIcon();
      await expect.soft(icon, 'Icon should be visible at SM viewport').toBeVisible();
      const width = await gcl.getCssValue(icon, 'width');
      const height = await gcl.getCssValue(icon, 'height');

      expect.soft(width, 'Icon width (SM)').toBe(`${figma.icon.SM.width}px`);
      expect.soft(height, 'Icon height (SM)').toBe(`${figma.icon.SM.height}px`);
    });

    test('TC-VGCL04: Section background color and padding match Figma @Visual', async () => {
      const component = await gcl.getComponent();
      const bg = await gcl.getCssValue(component, 'background-color');
      const padding = await gcl.getCssValue(component, 'padding');

      expect
        .soft(gcl.normalizeCssColor(bg), 'Section background color')
        .toBe(gcl.normalizeCssColor(figma.colors.sectionBackground));
      expect.soft(padding, 'Section padding').toBe(figma.spacing.XL.padding);
    });
  });
});

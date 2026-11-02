/**
 * Tabbed Content Component - Frontend test suite
 *
 * Scope: FE rendering & behaviour only (CMS authoring AC1/AC2 are out of scope).
 * Categories: @Functional, @Accessibility, @Visual.
 * All assertions are SOFT so a single failure never masks the rest of the run.
 * Language-agnostic: validates roles/attributes/structure, never tab label text.
 *
 * Requirement: User Story 683 (AC3, AC4, AC5).
 */

import { test, expect } from '@playwright/test';
import { TabbedComponent } from '../../components/tabbedComponent';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';
import { TabbedComponent_FigmaValues } from '../../helpers/utils/figma-values/TabbedComponent_FigmaValues';

test.describe('Tabbed Content Component', () => {
  let tabbed: TabbedComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    await applyAllurePageContext('tabbedComponent');
    tabbed = new TabbedComponent(page, browser, context);
    await tabbed.navigateToTestPage();
    await tabbed.acceptCookiesBanner();
  });

  // ===========================================================================
  // FUNCTIONAL
  // ===========================================================================
  test.describe('@Functional', () => {
    test('TC-TC1: Component renders with tab navigation and content panel @Functional @Smoke', async () => {
      const component = await tabbed.getComponent();
      await expect.soft(component, 'Component container should be visible').toBeVisible();

      const tabList = await tabbed.getTabList();
      await expect.soft(tabList, 'Tab navigation should be visible').toBeVisible();

      const activePanel = await tabbed.getActivePanel();
      await expect.soft(activePanel, 'Active content panel should be visible').toBeVisible();

      const tabCount = await tabbed.getTabCount();
      expect.soft(tabCount, 'There should be at least two tabs').toBeGreaterThan(1);
    });

    test('TC-TC2: First tab is selected by default @Functional', async () => {
      const firstTab = tabbed.getTabByIndex(0);
      await expect
        .soft(firstTab, 'First tab should be selected by default')
        .toHaveAttribute('aria-selected', 'true');
      await expect
        .soft(firstTab, 'First tab should have data-state active')
        .toHaveAttribute('data-state', 'active');
    });

    test('TC-TC3: Tab navigation renders horizontally above the content panel @Functional', async () => {
      const tabList = await tabbed.getTabList();
      const activePanel = await tabbed.getActivePanel();

      const tabListBox = await tabList.boundingBox();
      const panelBox = await activePanel.boundingBox();

      expect.soft(tabListBox, 'Tab list bounding box should exist').not.toBeNull();
      expect.soft(panelBox, 'Panel bounding box should exist').not.toBeNull();

      // Tab navigation sits above the content (smaller top offset).
      expect
        .soft(tabListBox?.y ?? 0, 'Tab navigation should be positioned above the content panel')
        .toBeLessThan(panelBox?.y ?? 0);
    });

    test('TC-TC4: Selecting another tab moves selection and swaps the content panel @Functional', async () => {
      const firstTab = tabbed.getTabByIndex(0);
      const secondTab = tabbed.getTabByIndex(1);

      // Panel controlled by the tab we are about to select.
      const secondTabControls = await secondTab.getAttribute('aria-controls');

      await tabbed.clickTabByIndex(1);

      await expect
        .soft(secondTab, 'Selected tab should become active')
        .toHaveAttribute('aria-selected', 'true');
      await expect
        .soft(firstTab, 'Previously active tab should be deselected')
        .toHaveAttribute('aria-selected', 'false');

      // The now-visible panel should be the one the selected tab controls.
      const activePanel = await tabbed.getActivePanel();
      await expect
        .soft(activePanel, 'Visible panel should match the selected tab aria-controls')
        .toHaveAttribute('id', secondTabControls ?? '');
    });

    test('TC-TC5: Exactly one tab panel is visible at a time @Functional', async () => {
      const visibleBefore = await tabbed.getVisiblePanelCount();
      expect.soft(visibleBefore, 'Exactly one panel should be visible by default').toBe(1);

      await tabbed.clickTabByIndex(1);

      const visibleAfter = await tabbed.getVisiblePanelCount();
      expect
        .soft(visibleAfter, 'Exactly one panel should remain visible after switching tabs')
        .toBe(1);
    });

    test('TC-TC6: Tab navigation scrolls horizontally when tabs overflow @Functional', async () => {
      const metrics = await tabbed.getScrollMetrics();
      expect
        .soft(metrics.scrollWidth, 'Tab bar content should overflow its container')
        .toBeGreaterThan(metrics.clientWidth);

      await tabbed.setScrollLeft(200);
      const after = await tabbed.getScrollMetrics();
      expect.soft(after.scrollLeft, 'Tab bar should scroll horizontally').toBeGreaterThan(0);
    });

    test('TC-TC7: Active panel contains the Text-Image content block @Functional', async () => {
      const block = await tabbed.getTextImageBlock();
      await expect.soft(block, 'Active panel should contain a Text-Image block').toBeVisible();
    });
  });

  // ===========================================================================
  // ACCESSIBILITY
  // ===========================================================================
  test.describe('@Accessibility', () => {
    test('TC-ATC1: Tablist exposes role=tablist with an accessible name @Accessibility', async () => {
      const tabList = await tabbed.getTabList();
      await expect
        .soft(tabList, 'Tablist should expose role=tablist')
        .toHaveAttribute('role', 'tablist');
      await expect
        .soft(tabList, 'Tablist should have a non-empty accessible name')
        .toHaveAttribute('aria-label', /.+/);
    });

    test('TC-ATC2: Tabs and panels expose correct roles and selection state @Accessibility', async () => {
      const firstTab = tabbed.getTabByIndex(0);
      await expect.soft(firstTab, 'Tab should expose role=tab').toHaveAttribute('role', 'tab');
      await expect
        .soft(firstTab, 'Tab should expose an aria-selected state')
        .toHaveAttribute('aria-selected', /true|false/);

      const panelCount = await tabbed.getPanels().count();
      const tabCount = await tabbed.getTabCount();
      expect.soft(panelCount, 'Each tab should have a corresponding tabpanel').toBe(tabCount);
    });

    test('TC-ATC3: Active tab aria-controls references the visible panel @Accessibility', async () => {
      const activeTab = await tabbed.getActiveTab();
      await expect
        .soft(activeTab, 'Active tab should reference a panel via aria-controls')
        .toHaveAttribute('aria-controls', /.+/);

      const controls = await activeTab.getAttribute('aria-controls');
      const activePanel = await tabbed.getActivePanel();
      await expect
        .soft(activePanel, 'Visible panel id should match active tab aria-controls')
        .toHaveAttribute('id', controls ?? '');
    });

    test('TC-ATC4: Tab navigation is keyboard operable @Accessibility', async ({ page }) => {
      const firstTab = tabbed.getTabByIndex(0);
      const secondTab = tabbed.getTabByIndex(1);

      // ARIA APG Tabs: the active tab must be in the tab order (tabindex="0") so
      // keyboard users can Tab into the tablist on load.
      await expect
        .soft(firstTab, 'Active tab should be keyboard-focusable (tabindex=0)')
        .toHaveAttribute('tabindex', '0');

      // Arrow-key navigation should move the selection to the next tab.
      // Click first to place keyboard focus on a tab reliably.
      await tabbed.clickTabByIndex(0);
      await page.keyboard.press('ArrowRight');
      await expect
        .soft(secondTab, 'ArrowRight should move selection to the next tab')
        .toHaveAttribute('aria-selected', 'true');
    });
  });

  // ===========================================================================
  // VISUAL
  // ===========================================================================
  test.describe('@Visual', () => {
    const figma = TabbedComponent_FigmaValues;
    const VIEWPORTS = [
      { name: 'XL', width: 1280, height: 720 },
      { name: 'LG', width: 1024, height: 768 },
      { name: 'MD', width: 768, height: 1024 },
      { name: 'SM', width: 375, height: 720 },
    ] as const;

    for (const vp of VIEWPORTS) {
      test(`TC-VTC1-${vp.name}: Active tab typography, highlight and padding match Figma at ${vp.name} @Visual`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        const spec = figma.tabText[vp.name];
        const activeTab = await tabbed.getActiveTab();

        expect
          .soft(
            await tabbed.getCssValue(activeTab, 'font-size'),
            `Active tab font-size (${vp.name})`
          )
          .toBe(spec.fontSize);
        expect
          .soft(
            await tabbed.getCssValue(activeTab, 'font-weight'),
            `Active tab font-weight (${vp.name})`
          )
          .toBe(spec.fontWeight);
        expect
          .soft(
            await tabbed.getCssValue(activeTab, 'line-height'),
            `Active tab line-height (${vp.name})`
          )
          .toBe(spec.lineHeight);
        expect
          .soft(
            tabbed.normalizeCssColor(await tabbed.getCssValue(activeTab, 'color')),
            `Active tab text color (${vp.name})`
          )
          .toBe(tabbed.normalizeCssColor(figma.colors.activeText));
        expect
          .soft(
            tabbed.normalizeCssColor(await tabbed.getCssValue(activeTab, 'background-color')),
            `Active tab background (${vp.name})`
          )
          .toBe(tabbed.normalizeCssColor(figma.colors.activeBackground));
        expect
          .soft(
            await tabbed.getCssValue(activeTab, 'border-bottom-width'),
            `Active tab bottom-border width (${vp.name})`
          )
          .toBe(figma.tabItem.activeBorderBottomWidth);
        expect
          .soft(
            tabbed.normalizeCssColor(await tabbed.getCssValue(activeTab, 'border-bottom-color')),
            `Active tab bottom-border color (${vp.name})`
          )
          .toBe(tabbed.normalizeCssColor(figma.colors.activeBorder));
        expect
          .soft(await tabbed.getCssValue(activeTab, 'padding'), `Tab item padding (${vp.name})`)
          .toBe(figma.tabItem.padding);
      });

      test(`TC-VTC2-${vp.name}: Inactive tab colour and inter-element spacing match Figma at ${vp.name} @Visual`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        const spec = figma.tabText[vp.name];
        const inactiveTab = tabbed.getTabByIndex(1);

        expect
          .soft(
            await tabbed.getCssValue(inactiveTab, 'font-size'),
            `Inactive tab font-size (${vp.name})`
          )
          .toBe(spec.fontSize);
        expect
          .soft(
            tabbed.normalizeCssColor(await tabbed.getCssValue(inactiveTab, 'color')),
            `Inactive tab text color (${vp.name})`
          )
          .toBe(tabbed.normalizeCssColor(figma.colors.textPrimary));

        const tabList = await tabbed.getTabList();
        expect
          .soft(await tabbed.getCssValue(tabList, 'column-gap'), `Tab list gap (${vp.name})`)
          .toBe(figma.tabList.gap);

        const inner = await tabbed.getInner();
        expect
          .soft(await tabbed.getCssValue(inner, 'row-gap'), `Tab-row to content gap (${vp.name})`)
          .toBe(figma.layout.tabRowToContentGap);
      });

      test(`TC-VTC3-${vp.name}: Tab bar remains horizontally scrollable at ${vp.name} @Visual`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });

        const tabList = await tabbed.getTabList();
        await expect.soft(tabList, `Tab list should be visible (${vp.name})`).toBeVisible();

        const metrics = await tabbed.getScrollMetrics();
        expect
          .soft(metrics.scrollWidth, `Tab bar should overflow and scroll (${vp.name})`)
          .toBeGreaterThan(metrics.clientWidth);
      });
    }
  });
});

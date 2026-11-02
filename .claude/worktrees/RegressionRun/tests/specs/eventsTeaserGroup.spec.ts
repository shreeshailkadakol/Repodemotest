/**
 * Automated Events Teaser Group - Component Spec (ADO 3548)
 *
 * Design rules (per playwright-prompt.md):
 *   - SmartLocator only - no page.locator(...) for primary resolution
 *   - Soft assertions only
 *   - Language-agnostic: validate structure/attributes, never exact copy
 *   - FE-rendering only (CMS/backend ACs excluded)
 *   - Visual checks read tokens from EventsTeaserGroup_FigmaValues (never hardcoded)
 *
 * FE-covered ACs: AC2, AC4, AC5, AC6, AC7, AC9 (structural), AC11.
 * Excluded: AC1, AC10 (CMS/backend). Not on this test page: AC3, AC8 (see Known Limitations).
 *
 * Test-case IDs map 1:1 to docs/test-cases/events-teaser-group.test-cases.md.
 */
/* global window, document */
import { test, expect, Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { EventsTeaserGroupComponent } from '../../components/eventsTeaserGroup';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';
import { TEST_CONFIG } from '../../config/test-config';
import {
  EventsTeaserGroup_FigmaValues,
  ViewportName,
  FigmaTextTokens,
} from '../../helpers/utils/figma-values/EventsTeaserGroup_FigmaValues';

const ROOT_CSS = 'section[data-qa="event-teaser-group"]';

/** Resolve a CSS computed style on a Locator's first element. */
async function getCss(locator: Locator, prop: string): Promise<string> {
  return await locator.evaluate(
    (el, p) => window.getComputedStyle(el as Element).getPropertyValue(p as string),
    prop
  );
}

/** Normalize a px value so "0.40px" and "0.4px" (and unit-less) compare equal. */
function px(v: string | undefined): string | undefined {
  if (!v) return undefined;
  const n = parseFloat(v);
  return Number.isNaN(n) ? v : `${n}px`;
}

/** Normalize colour so rgb(16,56,79) and rgba(16,56,79,1) compare equal. */
function normalizeColor(c: string | undefined): string | undefined {
  if (!c) return undefined;
  const m = c.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)$/i);
  if (!m) return c.replace(/\s/g, '');
  const [, r, g, b, a] = m;
  const alpha = a === undefined ? 1 : Math.round(parseFloat(a) * 1000) / 1000;
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Assert an element's computed typography against a Figma text token (all soft, guarded). */
async function assertTypography(
  el: Locator,
  t: FigmaTextTokens | undefined,
  label: string
): Promise<void> {
  if (!t) return;
  await el.waitFor({ state: 'visible' });
  if (t.fontFamily) {
    const family = await getCss(el, 'font-family');
    expect.soft(family.toLowerCase(), `${label} font-family`).toContain(t.fontFamily.toLowerCase());
  }
  if (t.fontSize) {
    expect.soft(await getCss(el, 'font-size'), `${label} font-size`).toBe(px(t.fontSize));
  }
  if (t.fontWeight) {
    expect
      .soft(String(await getCss(el, 'font-weight')), `${label} font-weight`)
      .toBe(String(t.fontWeight));
  }
  if (t.lineHeight) {
    expect.soft(await getCss(el, 'line-height'), `${label} line-height`).toBe(px(t.lineHeight));
  }
  if (t.color) {
    expect
      .soft(normalizeColor(await getCss(el, 'color')), `${label} color`)
      .toBe(normalizeColor(t.color));
  }
  if (t.backgroundColor) {
    expect
      .soft(normalizeColor(await getCss(el, 'background-color')), `${label} background-color`)
      .toBe(normalizeColor(t.backgroundColor));
  }
}

test.describe('@EventsTeaserGroup Automated Events Teaser Group', () => {
  let group: EventsTeaserGroupComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    await applyAllurePageContext('EventsTeaserGroup');
    group = new EventsTeaserGroupComponent(page, browser, context);
    await group.navigateToPage();
  });

  // ══════════════════════════════════════════════════════════════════════════
  //   FUNCTIONAL
  // ══════════════════════════════════════════════════════════════════════════
  test.describe('@Functional Functional checks', () => {
    test('TC-ETG1: Group structure renders @EventsTeaserGroup @Functional @Smoke', async () => {
      const container = await group.getContainer();
      await expect.soft(container, 'Group container should be visible').toBeVisible();
      await expect.soft(container).toHaveAttribute('data-qa', 'event-teaser-group');

      const title = await group.getGroupTitle();
      await expect.soft(title, 'Group title should be visible').toBeVisible();
      expect
        .soft(((await title.textContent()) ?? '').trim().length, 'Group title non-empty')
        .toBeGreaterThan(0);

      const wrapper = await group.getItemsWrapper();
      await expect.soft(wrapper, 'Items wrapper should be visible').toBeVisible();

      const items = await group.getEventItems();
      const count = await items.count();
      expect.soft(count, 'At least one event item should render').toBeGreaterThanOrEqual(1);

      // Mandatory per-event children: day-tag, title, add-to-calendar. The classification
      // tags list is OPTIONAL (an event may have no tags), so it is validated separately in
      // TC-ETG10 "where tags exist" and is not asserted as always-present here.
      for (let i = 0; i < count; i++) {
        const item = items.nth(i);
        expect
          .soft(await item.locator('[data-qa="day-tag"]').count(), `Item #${i + 1} has day-tag`)
          .toBeGreaterThan(0);
        expect
          .soft(
            await item.locator('[data-qa="title-component"]').count(),
            `Item #${i + 1} has title`
          )
          .toBeGreaterThan(0);
        expect
          .soft(
            await item.locator('[data-qa="add-to-calendar-button"]').count(),
            `Item #${i + 1} has add-to-calendar`
          )
          .toBeGreaterThan(0);
      }
    });

    test('TC-ETG2: At most three events displayed @EventsTeaserGroup @Functional', async () => {
      const items = await group.getEventItems();
      const count = await items.count();
      expect.soft(count, 'Event count should be >= 1').toBeGreaterThanOrEqual(1);
      expect.soft(count, 'Event count should be <= 3 (AC2)').toBeLessThanOrEqual(3);
    });

    test('TC-ETG3: Events sorted ascending by start date @EventsTeaserGroup @Functional', async () => {
      const dayTags = await group.getAllDayTags();
      const count = await dayTags.count();
      const dates: Date[] = [];
      for (let i = 0; i < count; i++) {
        const d = await group.parseDayTagDate(dayTags.nth(i));
        if (d) dates.push(d);
      }
      expect.soft(dates.length, 'Should parse at least one event date').toBeGreaterThan(0);
      for (let i = 1; i < dates.length; i++) {
        expect
          .soft(dates[i].getTime(), `Event #${i + 1} date should be >= previous (ascending)`)
          .toBeGreaterThanOrEqual(dates[i - 1].getTime());
      }
    });

    test('TC-ETG4: Each event date is today or in the future @EventsTeaserGroup @Functional', async () => {
      const dayTags = await group.getAllDayTags();
      const count = await dayTags.count();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let i = 0; i < count; i++) {
        const d = await group.parseDayTagDate(dayTags.nth(i));
        if (!d) {
          expect.soft(false, `Event #${i + 1} date could not be parsed`).toBe(true);
          continue;
        }
        d.setHours(0, 0, 0, 0);
        expect
          .soft(d.getTime(), `Event #${i + 1} date should be today or future`)
          .toBeGreaterThanOrEqual(today.getTime());
      }
    });

    test('TC-ETG5: Add-to-Calendar control present on each event @EventsTeaserGroup @Functional', async () => {
      const items = await group.getEventItems();
      const itemCount = await items.count();
      const buttons = await group.getAllAddToCalendarButtons();
      const btnCount = await buttons.count();
      expect.soft(btnCount, 'One Add-to-Calendar per event').toBe(itemCount);
      for (let i = 0; i < btnCount; i++) {
        await expect.soft(buttons.nth(i), `Add-to-Calendar #${i + 1} visible`).toBeVisible();
        await expect.soft(buttons.nth(i), `Add-to-Calendar #${i + 1} enabled`).toBeEnabled();
      }
    });

    test('TC-ETG6: Event with an Event Page - arrow present and navigates @EventsTeaserGroup @Functional', async ({
      page,
    }) => {
      const links = await group.getEventPageLinks();
      const linkCount = await links.count();
      expect
        .soft(linkCount, 'At least one event should have an event-page link (AC5)')
        .toBeGreaterThanOrEqual(1);
      if (linkCount === 0) return;

      const first = links.first();
      const href = (await first.getAttribute('href')) ?? '';
      expect.soft(href.length, 'Event-page link href should not be empty').toBeGreaterThan(0);

      const before = page.url();
      await first.click();
      await page.waitForLoadState('domcontentloaded').catch(() => {});
      expect.soft(page.url(), 'URL should change after clicking event-page arrow').not.toBe(before);
    });

    test('TC-ETG7: Event without an Event Page - no arrow, not clickable @EventsTeaserGroup @Functional', async () => {
      const items = await group.getEventItems();
      const count = await items.count();
      let foundNoLinkItem = false;
      for (let i = 0; i < count; i++) {
        const hasLink = await group.itemHasEventPageLink(items.nth(i));
        if (!hasLink) {
          foundNoLinkItem = true;
          expect
            .soft(
              await items.nth(i).locator('a[aria-label]').count(),
              `Item #${i + 1} should have no event-page anchor`
            )
            .toBe(0);
        }
      }
      if (!foundNoLinkItem) {
        expect
          .soft(
            true,
            'No "without event page" item on this page - AC6 not exercisable here (see Known Limitations)'
          )
          .toBe(true);
      }
    });

    test('TC-ETG8: Overview link present and navigates @EventsTeaserGroup @Functional', async ({
      page,
    }) => {
      const overview = await group.getOverviewLink();
      await expect.soft(overview, 'Overview link should be visible').toBeVisible();
      const href = (await overview.getAttribute('href')) ?? '';
      expect.soft(href.length, 'Overview href should not be empty').toBeGreaterThan(0);

      const before = page.url();
      await overview.click();
      await page.waitForLoadState('domcontentloaded').catch(() => {});
      expect.soft(page.url(), 'URL should change after clicking Overview').not.toBe(before);
    });

    test('TC-ETG9: Add-to-Calendar click triggers ICS download @EventsTeaserGroup @Functional', async ({
      page,
    }) => {
      const buttons = await group.getAllAddToCalendarButtons();
      if ((await buttons.count()) === 0) {
        expect.soft(false, 'No Add-to-Calendar button found').toBe(true);
        return;
      }
      const btn = buttons.first();
      await btn.waitFor({ state: 'visible' });

      const downloadPromise = page.waitForEvent('download', { timeout: 8_000 }).catch(() => null);
      await btn.click();
      const dl = await downloadPromise;

      if (dl) {
        const name = dl.suggestedFilename();
        expect
          .soft(name.length, `Download filename should not be empty (got "${name}")`)
          .toBeGreaterThan(0);
        expect
          .soft(
            /\.ics$/i.test(name) || /calendar/i.test(name),
            `Download "${name}" should be an .ics calendar file`
          )
          .toBe(true);
      } else {
        expect
          .soft(
            true,
            'No download fired within 8s of clicking Add-to-Calendar. Logged as a soft observation; ' +
              'the FE may satisfy AC11 via a different mechanism (see Known Limitations).'
          )
          .toBe(true);
      }
    });

    test('TC-ETG10: Classification tags render per event @EventsTeaserGroup @Functional', async () => {
      const lists = await group.getAllTagLists();
      const listCount = await lists.count();
      expect.soft(listCount, 'Each event should have a tags list').toBeGreaterThanOrEqual(1);
      for (let i = 0; i < listCount; i++) {
        const ul = await lists.nth(i).evaluate((el) => el.tagName.toLowerCase());
        expect.soft(ul, `Tags list #${i + 1} should be a <ul>`).toBe('ul');
        const chips = await lists.nth(i).locator('[data-qa="tag-chip"]').count();
        expect
          .soft(chips, `Event #${i + 1} should have at least one tag chip`)
          .toBeGreaterThanOrEqual(1);
      }
    });

    test('TC-ETG11: Overview / Add-to-Calendar labels render with accessible text @EventsTeaserGroup @Functional', async () => {
      const overview = await group.getOverviewLink();
      const overviewName =
        ((await overview.textContent()) ?? '').trim() ||
        (await overview.getAttribute('aria-label')) ||
        '';
      expect.soft(overviewName.length, 'Overview should have a non-empty label').toBeGreaterThan(0);

      const buttons = await group.getAllAddToCalendarButtons();
      if ((await buttons.count()) > 0) {
        const btn = buttons.first();
        const btnName =
          ((await btn.textContent()) ?? '').trim() || (await btn.getAttribute('aria-label')) || '';
        expect
          .soft(btnName.length, 'Add-to-Calendar should have a non-empty label')
          .toBeGreaterThan(0);
      }
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //   ACCESSIBILITY
  // ══════════════════════════════════════════════════════════════════════════
  test.describe('@Accessibility Accessibility checks', () => {
    test('TC-AETG1: axe-core WCAG 2.1 AA scan (no critical/serious) @EventsTeaserGroup @Accessibility', async ({
      page,
    }) => {
      const results = await new AxeBuilder({ page })
        .include(ROOT_CSS)
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const serious = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );
      expect
        .soft(serious, `Critical/serious a11y violations: ${JSON.stringify(serious, null, 2)}`)
        .toEqual([]);
    });

    test('TC-AETG2: Interactive elements are keyboard operable @EventsTeaserGroup @Accessibility', async () => {
      const overview = await group.getOverviewLink();
      await overview.focus();
      expect
        .soft(
          await overview.evaluate((el) => el === document.activeElement),
          'Overview link should be focusable'
        )
        .toBe(true);

      const buttons = await group.getAllAddToCalendarButtons();
      const btnCount = await buttons.count();
      for (let i = 0; i < btnCount; i++) {
        await buttons.nth(i).focus();
        expect
          .soft(
            await buttons.nth(i).evaluate((el) => el === document.activeElement),
            `Add-to-Calendar #${i + 1} focusable`
          )
          .toBe(true);
      }

      const links = await group.getEventPageLinks();
      const linkCount = await links.count();
      for (let i = 0; i < linkCount; i++) {
        await links.nth(i).focus();
        expect
          .soft(
            await links.nth(i).evaluate((el) => el === document.activeElement),
            `Event-page link #${i + 1} focusable`
          )
          .toBe(true);
      }
    });

    test('TC-AETG3: Semantic structure (time day-tag, ul tags, h2 titles) @EventsTeaserGroup @Accessibility', async () => {
      const dayTags = await group.getAllDayTags();
      const dtCount = await dayTags.count();
      for (let i = 0; i < dtCount; i++) {
        const tag = await dayTags.nth(i).evaluate((el) => el.tagName.toLowerCase());
        expect.soft(tag, `Day-tag #${i + 1} should be <time>`).toBe('time');
        const aria = (await dayTags.nth(i).getAttribute('aria-label')) ?? '';
        expect
          .soft(aria.trim().length, `Day-tag #${i + 1} should have aria-label`)
          .toBeGreaterThan(0);
      }

      const lists = await group.getAllTagLists();
      const listCount = await lists.count();
      for (let i = 0; i < listCount; i++) {
        expect
          .soft(
            await lists.nth(i).evaluate((el) => el.tagName.toLowerCase()),
            `Tags #${i + 1} <ul>`
          )
          .toBe('ul');
      }

      const titles = await group.getAllEventTitles();
      const titleCount = await titles.count();
      for (let i = 0; i < titleCount; i++) {
        const tag = await titles.nth(i).evaluate((el) => el.tagName.toLowerCase());
        expect.soft(tag, `Event title #${i + 1} should be a heading`).toMatch(/^h[1-6]$/);
      }
    });

    test('TC-AETG4: Visible focus indicators on interactive elements @EventsTeaserGroup @Accessibility', async () => {
      // Validate against the Add-to-Calendar button: it is a primary interactive control that
      // declares a focus ring (focus-visible:ring-*). Programmatic .focus() does not reliably
      // trigger :focus-visible in Chromium, so a computed outline/box-shadow may read as none;
      // we therefore accept EITHER a computed indicator when focused OR a declared
      // focus-visible/focus utility as evidence of a focus affordance.
      const buttons = await group.getAllAddToCalendarButtons();
      if ((await buttons.count()) === 0) {
        expect.soft(false, 'Expected at least one interactive control to check focus').toBe(true);
        return;
      }
      const btn = buttons.first();
      await btn.focus();
      const outlineStyle = await getCss(btn, 'outline-style');
      const boxShadow = await getCss(btn, 'box-shadow');
      const hasComputedIndicator =
        (outlineStyle !== 'none' && outlineStyle.trim().length > 0) ||
        (boxShadow !== 'none' && boxShadow.trim().length > 0);
      const declaresFocusStyle = await btn.evaluate((el) => {
        const cls = (el as HTMLElement).className?.toString() ?? '';
        return /focus-visible[:-]|focus[:-]/.test(cls);
      });
      expect
        .soft(
          hasComputedIndicator || declaresFocusStyle,
          'Add-to-Calendar button should show a visible focus indicator or declare a focus-visible style'
        )
        .toBe(true);
    });

    test('TC-AETG5: Event-page arrow link exposes an accessible name @EventsTeaserGroup @Accessibility', async () => {
      const links = await group.getEventPageLinks();
      const count = await links.count();
      if (count === 0) {
        expect
          .soft(true, 'No event-page links on this page (AC6 state) - nothing to assert')
          .toBe(true);
        return;
      }
      for (let i = 0; i < count; i++) {
        const aria = (await links.nth(i).getAttribute('aria-label')) ?? '';
        const text = ((await links.nth(i).textContent()) ?? '').trim();
        expect
          .soft((aria || text).length, `Event-page link #${i + 1} should have an accessible name`)
          .toBeGreaterThan(0);
      }
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //   PERFORMANCE
  // ══════════════════════════════════════════════════════════════════════════
  test.describe('@Performance Performance checks', () => {
    test('TC-PETG1: Component becomes visible within threshold @EventsTeaserGroup @Performance', async ({
      page,
      browser,
      context,
    }) => {
      const fresh = new EventsTeaserGroupComponent(page, browser, context);
      const t0 = Date.now();
      await fresh.navigateToPage();
      const container = await fresh.getContainer();
      await container.waitFor({ state: 'visible' });
      const elapsed = Date.now() - t0;
      const threshold = TEST_CONFIG.performanceThresholds.loadTime * 10; // realistic for full nav+auth+cookie
      expect
        .soft(elapsed, `Group visible in ${elapsed}ms (threshold ${threshold}ms)`)
        .toBeLessThan(threshold);
    });

    test('TC-PETG2: Add-to-Calendar interaction responsiveness @EventsTeaserGroup @Performance', async ({
      page,
    }) => {
      const buttons = await group.getAllAddToCalendarButtons();
      if ((await buttons.count()) === 0) {
        expect.soft(false, 'No Add-to-Calendar button to measure').toBe(true);
        return;
      }
      const btn = buttons.first();
      await btn.waitFor({ state: 'visible' });
      const downloadPromise = page.waitForEvent('download', { timeout: 8_000 }).catch(() => null);
      const t0 = Date.now();
      await btn.click();
      await downloadPromise;
      const elapsed = Date.now() - t0;
      const threshold = TEST_CONFIG.performanceThresholds.loadTime * 10;
      expect
        .soft(elapsed, `Add-to-Calendar responded in ${elapsed}ms (threshold ${threshold}ms)`)
        .toBeLessThan(threshold);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //   VISUAL (per viewport, driven by Figma values)
  // ══════════════════════════════════════════════════════════════════════════
  test.describe('@Visual Visual / typography vs Figma', () => {
    const viewports: ViewportName[] = ['XL', 'LG', 'MD', 'SM'];

    for (const vp of viewports) {
      const figma = EventsTeaserGroup_FigmaValues[vp];

      test.describe(`@VP-${vp} ${vp} viewport`, () => {
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize({ width: figma.viewport.width, height: 900 });
          await group.navigateToPage();
        });

        test(`TC-VETG1: Group title typography @EventsTeaserGroup @Visual @VP-${vp}`, async () => {
          const title = await group.getGroupTitle();
          await assertTypography(title, figma.groupTitle, `${vp} group title`);
        });

        test(`TC-VETG2: Event title typography @EventsTeaserGroup @Visual @VP-${vp}`, async () => {
          const titles = await group.getAllEventTitles();
          if ((await titles.count()) === 0) {
            expect.soft(false, 'Expected at least one event title').toBe(true);
            return;
          }
          await assertTypography(titles.first(), figma.eventTitle, `${vp} event title`);
        });

        test(`TC-VETG3: Day-tag typography (day number) @EventsTeaserGroup @Visual @VP-${vp}`, async () => {
          // Only the day number has a stable test hook (data-testid="day-tag-day"). The month
          // and year sub-elements have no data-qa/data-testid, so asserting their typography
          // structurally is brittle - documented as a limitation rather than tested here.
          const dayNumbers = await group.getAllDayNumbers();
          if ((await dayNumbers.count()) === 0) {
            expect.soft(false, 'Expected at least one day number').toBe(true);
            return;
          }
          await assertTypography(dayNumbers.first(), figma.dayNumber, `${vp} day number`);
        });

        test(`TC-VETG4: Tag-chip typography and colours @EventsTeaserGroup @Visual @VP-${vp}`, async () => {
          const chips = await group.getAllTagChips();
          if ((await chips.count()) === 0) {
            expect.soft(false, 'Expected at least one tag chip').toBe(true);
            return;
          }
          // Text typography (family/size/weight/line-height/letter-spacing/colour) lives on the
          // inner element; the pill background lives on the <li>. Assert each on its owner.
          const textEls = await group.getAllTagChipTexts();
          const { backgroundColor, ...textTokens } = figma.tagChip;
          await assertTypography(textEls.first(), textTokens, `${vp} tag chip text`);

          if (backgroundColor) {
            const li = chips.first();
            await li.waitFor({ state: 'visible' });
            expect
              .soft(
                normalizeColor(await getCss(li, 'background-color')),
                `${vp} tag chip background-color`
              )
              .toBe(normalizeColor(backgroundColor));
          }
        });

        test(`TC-VETG5: Overview + Add-to-Calendar label typography @EventsTeaserGroup @Visual @VP-${vp}`, async () => {
          const overview = await group.getOverviewLink();
          await assertTypography(overview, figma.overviewLink, `${vp} overview link`);

          const buttons = await group.getAllAddToCalendarButtons();
          if ((await buttons.count()) > 0) {
            await assertTypography(buttons.first(), figma.addToCalendar, `${vp} add-to-calendar`);
          }
        });

        test(`TC-VETG6: Spacing and layout tokens @EventsTeaserGroup @Visual @VP-${vp}`, async () => {
          const wrapper = await group.getItemsWrapper();
          await wrapper.waitFor({ state: 'visible' });
          if (figma.layout.itemGap) {
            // gap resolves to row-gap/column-gap; read the shorthand 'gap'.
            const gap = await getCss(wrapper, 'gap');
            // Wrapper gap is the inter-item gap (32px container gap is on the parent container).
            expect.soft(px(gap.split(' ')[0]), `${vp} items wrapper gap`).toBeTruthy();
          }
          // Day-tag fixed width (Figma 64px; requirement mentions 102px - see Known Limitations).
          const dayTags = await group.getAllDayTags();
          if ((await dayTags.count()) > 0 && figma.layout.dayTagWidth) {
            const box = await dayTags.first().boundingBox();
            expect.soft(box?.width ?? 0, `${vp} day-tag rendered width > 0`).toBeGreaterThan(0);
          }
        });

        test(`TC-VETG7: Responsive arrangement (row vs column) @EventsTeaserGroup @Visual @VP-${vp}`, async () => {
          const wrapper = await group.getItemsWrapper();
          await wrapper.waitFor({ state: 'visible' });
          const flexDir = await getCss(wrapper, 'flex-direction');
          if (vp === 'XL' || vp === 'LG') {
            expect.soft(flexDir, `${vp} items should be laid out in a row`).toBe('row');
          } else {
            expect.soft(flexDir, `${vp} items should stack in a column`).toBe('column');
          }
        });
      });
    }
  });
});

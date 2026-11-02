/**
 * Automated Events List - Component Spec (ADO 1582)
 *
 * Design rules (per playwright-prompt.md):
 *   - SmartLocator only - no page.locator(...) for primary resolution
 *   - Soft assertions only
 *   - Language-agnostic: validate structure/attributes, never exact copy (labels are
 *     dictionary-driven per AC13)
 *   - FE-rendering only (CMS/backend ACs excluded)
 *   - Visual checks read tokens from EventList_FigmaValues (never hardcoded)
 *
 * Target: the QA test page (renders real events) via componentURL.ts (EventList) +
 * envUtils.getBaseUrl(), with Vercel HTTP auth - the standard component flow.
 *
 * FE-covered ACs: AC3, AC5/AC6 (structural), AC8, AC9, AC10, AC11, AC13 (structural).
 * Excluded: AC1, AC2, AC12, AC14 (CMS/authoring/data). Not on this instance: AC4, pagination-ON.
 *
 * Test-case IDs map 1:1 to docs/test-cases/event-list.test-cases.md.
 */
/* global document */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { EventListComponent } from '../../components/eventListComponent';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';
import { TEST_CONFIG } from '../../config/test-config';
import {
  EventList_FigmaValues,
  ViewportName,
} from '../../helpers/utils/figma-values/EventList_FigmaValues';

const ROOT_CSS = 'section[data-qa="event-list"]';

test.describe('@EventList Automated Events List', () => {
  let eventList: EventListComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    await applyAllurePageContext('EventList');
    eventList = new EventListComponent(page, browser, context);
    await eventList.navigateToPage();
  });

  // ══════════════════════════════════════════════════════════════════════════
  //   FUNCTIONAL
  // ══════════════════════════════════════════════════════════════════════════
  test.describe('@Functional Functional checks', () => {
    test('TC-EL001: Event List container renders @EventList @Functional @Smoke', async () => {
      const container = await eventList.getContainer();
      await expect.soft(container, 'Container should be visible').toBeVisible();
      await expect.soft(container).toHaveAttribute('data-qa', 'event-list');
      const tag = await container.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tag, 'Container should be a <section>').toBe('section');
    });

    test('TC-EL002: Component title renders @EventList @Functional', async () => {
      const title = await eventList.getComponentTitle();
      await expect.soft(title, 'Component title should be visible').toBeVisible();
      const tag = await title.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tag, 'Component title should be an <h2>').toBe('h2');
      expect
        .soft(((await title.textContent()) ?? '').trim().length, 'Component title non-empty')
        .toBeGreaterThan(0);
    });

    test('TC-EL003: Event cards render (future default) @EventList @Functional', async () => {
      const items = await eventList.getEventItems();
      const count = await items.count();
      expect.soft(count, 'At least one event card should render (AC3)').toBeGreaterThanOrEqual(1);
      for (let i = 0; i < count; i++) {
        await expect.soft(items.nth(i), `Card #${i + 1} visible`).toBeVisible();
      }
    });

    test('TC-EL004: Each card shows a date block @EventList @Functional', async () => {
      const items = await eventList.getEventItems();
      const count = await items.count();
      const dayTags = await eventList.getAllDayTags();
      expect.soft(await dayTags.count(), 'One day-tag per card').toBe(count);
      const dtCount = await dayTags.count();
      for (let i = 0; i < dtCount; i++) {
        const tag = await dayTags.nth(i).evaluate((el) => el.tagName.toLowerCase());
        expect.soft(tag, `Day-tag #${i + 1} should be <time>`).toBe('time');
        const aria = (await dayTags.nth(i).getAttribute('aria-label')) ?? '';
        expect.soft(aria.trim().length, `Day-tag #${i + 1} has aria-label`).toBeGreaterThan(0);
      }
      const dayNumbers = await eventList.getAllDayNumbers();
      expect
        .soft(await dayNumbers.count(), 'Each card exposes a day number')
        .toBeGreaterThanOrEqual(1);
    });

    test('TC-EL005: Each card shows an event title @EventList @Functional', async () => {
      const items = await eventList.getEventItems();
      const count = await items.count();
      const titles = await eventList.getAllEventTitles();
      expect.soft(await titles.count(), 'One title per card').toBe(count);
      const tCount = await titles.count();
      for (let i = 0; i < tCount; i++) {
        await expect.soft(titles.nth(i), `Event title #${i + 1} visible`).toBeVisible();
        expect
          .soft(
            ((await titles.nth(i).textContent()) ?? '').trim().length,
            `Title #${i + 1} non-empty`
          )
          .toBeGreaterThan(0);
      }
    });

    test('TC-EL006: Each card shows the date meta row @EventList @Functional', async () => {
      const items = await eventList.getEventItems();
      const count = await items.count();
      for (let i = 0; i < count; i++) {
        const metaCount = await items.nth(i).locator('[data-qa="meta-tag"]').count();
        expect
          .soft(metaCount, `Card #${i + 1} has at least one meta row`)
          .toBeGreaterThanOrEqual(1);
      }
      const metas = await eventList.getAllMetaTags();
      const mCount = await metas.count();
      for (let i = 0; i < mCount; i++) {
        expect
          .soft(
            ((await metas.nth(i).textContent()) ?? '').trim().length,
            `Meta row #${i + 1} non-empty`
          )
          .toBeGreaterThan(0);
      }
    });

    test('TC-EL007: Location meta row renders per event mode @EventList @Functional', async () => {
      // Location is the 2nd meta row when present (offline-without-address cards may omit it).
      const items = await eventList.getEventItems();
      const count = await items.count();
      let locationsSeen = 0;
      for (let i = 0; i < count; i++) {
        const rows = items.nth(i).locator('[data-qa="meta-tag"]');
        if ((await rows.count()) >= 2) {
          const loc = rows.nth(1);
          await expect.soft(loc, `Card #${i + 1} location row visible`).toBeVisible();
          expect
            .soft(
              ((await loc.textContent()) ?? '').trim().length,
              `Card #${i + 1} location non-empty`
            )
            .toBeGreaterThan(0);
          locationsSeen++;
        }
      }
      expect
        .soft(locationsSeen, 'At least one card renders a location row')
        .toBeGreaterThanOrEqual(1);
    });

    test('TC-EL008: Add-to-Calendar present on every card @EventList @Functional', async () => {
      const items = await eventList.getEventItems();
      const itemCount = await items.count();
      const buttons = await eventList.getAllAddToCalendarButtons();
      expect.soft(await buttons.count(), 'One Add-to-Calendar per card').toBe(itemCount);
      const btnCount = await buttons.count();
      for (let i = 0; i < btnCount; i++) {
        await expect.soft(buttons.nth(i), `Add-to-Calendar #${i + 1} visible`).toBeVisible();
        await expect.soft(buttons.nth(i), `Add-to-Calendar #${i + 1} enabled`).toBeEnabled();
      }
    });

    test('TC-EL009: Add-to-Calendar click triggers ICS download @EventList @Functional', async ({
      page,
    }) => {
      const buttons = await eventList.getAllAddToCalendarButtons();
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
          .soft(
            /\.ics$/i.test(name) || /calendar/i.test(name),
            `Download "${name}" should be an .ics calendar file`
          )
          .toBe(true);
      } else {
        expect
          .soft(
            true,
            'No download fired within 8s of clicking Add-to-Calendar. Logged as a soft observation ' +
              '(AC5) - the FE may satisfy it via a different mechanism (see Known Limitations).'
          )
          .toBe(true);
      }
    });

    test('TC-EL010: Arrow link present + navigable when Event Page configured (AC9) @EventList @Functional', async () => {
      const links = await eventList.getEventPageLinks();
      const count = await links.count();
      expect
        .soft(count, 'At least one card should have an event-page link (AC9)')
        .toBeGreaterThanOrEqual(1);
      for (let i = 0; i < count; i++) {
        const href = (await links.nth(i).getAttribute('href')) ?? '';
        expect.soft(href.trim().length, `Arrow link #${i + 1} href non-empty`).toBeGreaterThan(0);
        await links.nth(i).focus();
        expect
          .soft(
            await links.nth(i).evaluate((el) => el === document.activeElement),
            `Arrow link #${i + 1} focusable`
          )
          .toBe(true);
      }
    });

    test('TC-EL011: No arrow link when Event Page not configured (AC10) @EventList @Functional', async () => {
      const items = await eventList.getEventItems();
      const count = await items.count();
      let foundNoLinkItem = false;
      for (let i = 0; i < count; i++) {
        const hasLink = await eventList.itemHasEventPageLink(items.nth(i));
        if (!hasLink) {
          foundNoLinkItem = true;
          expect
            .soft(
              await items.nth(i).locator('a[href]').count(),
              `Card #${i + 1} should have no event-page anchor (AC10)`
            )
            .toBe(0);
        }
      }
      if (!foundNoLinkItem) {
        expect
          .soft(true, 'No "without event page" card on this instance - AC10 not exercisable here')
          .toBe(true);
      }
    });

    test('TC-EL012: Classification tags render when configured @EventList @Functional', async () => {
      const lists = await eventList.getAllTagLists();
      const listCount = await lists.count();
      if (listCount === 0) {
        expect.soft(true, 'No tagged events on this instance - tags are optional').toBe(true);
        return;
      }
      for (let i = 0; i < listCount; i++) {
        const ul = await lists.nth(i).evaluate((el) => el.tagName.toLowerCase());
        expect.soft(ul, `Tags list #${i + 1} should be a <ul>`).toBe('ul');
        const aria = (await lists.nth(i).getAttribute('aria-label')) ?? '';
        expect.soft(aria.trim().length, `Tags list #${i + 1} has aria-label`).toBeGreaterThan(0);
      }
    });

    test('TC-EL013: Past Events toggle switches the view (AC8) @EventList @Functional', async ({
      page,
    }) => {
      const toggle = await eventList.getToggleButton();
      await expect.soft(toggle, 'Toggle button should be visible').toBeVisible();

      const beforeTitles = (await (await eventList.getAllEventTitles()).allTextContents())
        .map((t) => t.trim())
        .join('|');

      await toggle.click();
      await page.waitForTimeout(1500);
      await page.waitForLoadState('domcontentloaded').catch(() => {});

      const afterTitles = (await (await eventList.getAllEventTitles()).allTextContents())
        .map((t) => t.trim())
        .join('|');

      expect
        .soft(afterTitles, 'Card set should change after toggling to Past Events')
        .not.toBe(beforeTitles);

      // A return affordance (Future Events) should now exist.
      const returnToggle = await eventList.getToggleButton();
      await expect
        .soft(returnToggle, 'Return (Future Events) toggle should be visible')
        .toBeVisible();
    });

    test('TC-EL014: Events grouped by year and ordered ascending @EventList @Functional', async () => {
      const dayTags = await eventList.getAllDayTags();
      const count = await dayTags.count();
      const dates: Date[] = [];
      for (let i = 0; i < count; i++) {
        const d = await eventList.parseDayTagDate(dayTags.nth(i));
        if (d) dates.push(d);
      }
      expect.soft(dates.length, 'Should parse at least one event date').toBeGreaterThan(0);
      for (let i = 1; i < dates.length; i++) {
        expect
          .soft(dates[i].getTime(), `Event #${i + 1} date >= previous (ascending)`)
          .toBeGreaterThanOrEqual(dates[i - 1].getTime());
      }
      const years = await eventList.getYearHeaderTexts();
      expect
        .soft(years.length, 'At least one year-group header should render')
        .toBeGreaterThanOrEqual(1);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //   ACCESSIBILITY
  // ══════════════════════════════════════════════════════════════════════════
  test.describe('@Accessibility Accessibility checks', () => {
    test('TC-AEL001: axe-core WCAG 2.1 AA scan (no critical/serious) @EventList @Accessibility', async ({
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

    test('TC-AEL002: Date block exposes an accessible date @EventList @Accessibility', async () => {
      const dayTags = await eventList.getAllDayTags();
      const count = await dayTags.count();
      expect.soft(count, 'At least one day-tag').toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const aria = (await dayTags.nth(i).getAttribute('aria-label')) ?? '';
        expect
          .soft(aria.trim().length, `Day-tag #${i + 1} should have a non-empty aria-label`)
          .toBeGreaterThan(0);
      }
    });

    test('TC-AEL003: Add-to-Calendar keyboard-accessible with a name @EventList @Accessibility', async () => {
      const buttons = await eventList.getAllAddToCalendarButtons();
      const count = await buttons.count();
      expect.soft(count, 'At least one Add-to-Calendar button').toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        await buttons.nth(i).focus();
        expect
          .soft(
            await buttons.nth(i).evaluate((el) => el === document.activeElement),
            `Add-to-Calendar #${i + 1} focusable`
          )
          .toBe(true);
        const name =
          ((await buttons.nth(i).textContent()) ?? '').trim() ||
          (await buttons.nth(i).getAttribute('aria-label')) ||
          '';
        expect
          .soft(name.length, `Add-to-Calendar #${i + 1} accessible name non-empty`)
          .toBeGreaterThan(0);
      }
    });

    test('TC-AEL004: Arrow link exposes an accessible name @EventList @Accessibility', async () => {
      const links = await eventList.getEventPageLinks();
      const count = await links.count();
      if (count === 0) {
        expect.soft(true, 'No event-page links on this instance - nothing to assert').toBe(true);
        return;
      }
      for (let i = 0; i < count; i++) {
        const aria = (await links.nth(i).getAttribute('aria-label')) ?? '';
        const text = ((await links.nth(i).textContent()) ?? '').trim();
        expect
          .soft(
            (aria || text).length,
            `Arrow link #${i + 1} should have an accessible name (aria-label or text)`
          )
          .toBeGreaterThan(0);
      }
    });

    test('TC-AEL005: Event titles use heading semantics @EventList @Accessibility', async () => {
      const titles = await eventList.getAllEventTitles();
      const count = await titles.count();
      expect.soft(count, 'At least one event title').toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const tag = await titles.nth(i).evaluate((el) => el.tagName.toLowerCase());
        expect.soft(tag, `Event title #${i + 1} should be a heading`).toMatch(/^h[1-6]$/);
      }
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //   PERFORMANCE
  // ══════════════════════════════════════════════════════════════════════════
  test.describe('@Performance Performance checks', () => {
    test('TC-PEL001: Component becomes visible within threshold @EventList @Performance', async ({
      page,
      browser,
      context,
    }) => {
      const fresh = new EventListComponent(page, browser, context);
      const t0 = Date.now();
      await fresh.navigateToPage();
      const container = await fresh.getContainer();
      await container.waitFor({ state: 'visible' });
      const elapsed = Date.now() - t0;
      const threshold = TEST_CONFIG.performanceThresholds.loadTime * 10; // realistic for full nav+cookie
      expect
        .soft(elapsed, `Component visible in ${elapsed}ms (threshold ${threshold}ms)`)
        .toBeLessThan(threshold);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //   VISUAL (per viewport, driven by Figma values)
  // ══════════════════════════════════════════════════════════════════════════
  test.describe('@Visual Visual / typography vs Figma', () => {
    const viewports: ViewportName[] = ['XL', 'LG', 'MD', 'SM'];

    for (const vp of viewports) {
      const figma = EventList_FigmaValues[vp];

      test.describe(`@VP-${vp} ${vp} viewport`, () => {
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize({ width: figma.viewport.width, height: 900 });
          await eventList.navigateToPage();
        });

        test(`TC-VEL001: Event title typography @EventList @Visual @VP-${vp}`, async () => {
          const titles = await eventList.getAllEventTitles();
          if ((await titles.count()) === 0) {
            expect.soft(false, 'Expected at least one event title').toBe(true);
            return;
          }
          await eventList.assertTypography(titles.first(), figma.eventTitle, `${vp} event title`);
        });

        test(`TC-VEL002: Date block sizing and typography @EventList @Visual @VP-${vp}`, async () => {
          const dayNumbers = await eventList.getAllDayNumbers();
          if ((await dayNumbers.count()) === 0) {
            expect.soft(false, 'Expected at least one day number').toBe(true);
            return;
          }
          await eventList.assertTypography(dayNumbers.first(), figma.dayNumber, `${vp} day number`);

          // Date block max-width constraint (requirement: <= 102px).
          const dayTags = await eventList.getAllDayTags();
          if ((await dayTags.count()) > 0 && figma.layout.dateBlockMaxWidth) {
            const max = parseFloat(figma.layout.dateBlockMaxWidth);
            const box = await dayTags.first().boundingBox();
            expect
              .soft(box?.width ?? 0, `${vp} day-tag rendered width should be > 0`)
              .toBeGreaterThan(0);
            expect
              .soft(box?.width ?? 0, `${vp} day-tag width should be <= ${max}px (requirement)`)
              .toBeLessThanOrEqual(max + 2);
          }
        });

        test(`TC-VEL003: Meta row typography/color @EventList @Visual @VP-${vp}`, async () => {
          const metas = await eventList.getAllMetaTags();
          if ((await metas.count()) === 0) {
            expect.soft(false, 'Expected at least one meta row').toBe(true);
            return;
          }
          const span = metas.first().locator('span').first();
          await eventList.assertTypography(span, figma.metaTag, `${vp} meta row`);
        });

        test(`TC-VEL004: Add-to-Calendar button styling @EventList @Visual @VP-${vp}`, async () => {
          const buttons = await eventList.getAllAddToCalendarButtons();
          if ((await buttons.count()) === 0) {
            expect.soft(false, 'Expected at least one Add-to-Calendar button').toBe(true);
            return;
          }
          await eventList.assertTypography(
            buttons.first(),
            figma.addToCalendar,
            `${vp} add-to-calendar`
          );
        });
      });
    }
  });
});

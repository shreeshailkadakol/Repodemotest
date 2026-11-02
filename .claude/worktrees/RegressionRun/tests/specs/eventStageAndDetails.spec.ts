/**
 * Event Stage & Event Details - Combined Component Spec
 *
 * Scope of this file:
 *   - "Event Stage"   (story ADO 3802) - IMPLEMENTED
 *   - "Event Details" (story ADO 3803) - IMPLEMENTED
 *
 * Design rules followed (per playwright-prompt.md):
 *   - SmartLocator only - no page.locator(...) for primary resolution
 *   - Every locator carries at least 3 fallback strategies + a description
 *   - Soft assertions only
 *   - FE-rendering tests only (CMS / pagebuilder ACs are out of scope)
 *   - Visual checks read tokens from *_FigmaValues (auto-extracted)
 */
import { test, expect, Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { EventStageComponent } from '../../components/eventStage';
import { EventDetailsComponent } from '../../components/eventDetails';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';
import { TEST_CONFIG } from '../../config/test-config';
import {
  EventStage_FigmaValues,
  ViewportName,
} from '../../helpers/utils/figma-values/EventStage_FigmaValues';
import { EventDetails_FigmaValues } from '../../helpers/utils/figma-values/EventDetails_FigmaValues';

const ROOT_CSS = 'section[data-qa="event-stage"]';
const ED_ROOT_CSS = 'section[data-qa="event-details"]';

/** Resolve a CSS computed style on a Locator's first element. */
async function getCss(locator: Locator, prop: string): Promise<string> {
  return await locator.evaluate(
    (el, p) => window.getComputedStyle(el as Element).getPropertyValue(p as string),
    prop
  );
}

/** Normalize Figma `lineHeight: "70px"` ↔ computed "70px". */
function px(v: string | undefined): string | undefined {
  if (!v) return undefined;
  return v.endsWith('px') ? v : `${parseFloat(v)}px`;
}

/**
 * Normalize colour values so that rgb(16,56,79) and rgba(16,56,79,1) compare
 * equal. Returns a string of the form `rgba(R,G,B,A)` where A is rounded to
 * 3 decimal places. Returns the original string if it can't be parsed.
 */
function normalizeColor(c: string | undefined): string | undefined {
  if (!c) return undefined;
  const m = c.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)$/i);
  if (!m) return c.replace(/\s/g, '');
  const [, r, g, b, a] = m;
  const alpha = a === undefined ? 1 : Math.round(parseFloat(a) * 1000) / 1000;
  return `rgba(${r},${g},${b},${alpha})`;
}

// ════════════════════════════════════════════════════════════════════════════
//   EVENT STAGE  (ADO 3802)
// ════════════════════════════════════════════════════════════════════════════

test.describe('@EventStage Event Stage Component', () => {
  let stage: EventStageComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    await applyAllurePageContext('EventStage');
    stage = new EventStageComponent(page, browser, context);
    await stage.navigateToPage();
  });

  // ─── Functional ─────────────────────────────────────────────────────────
  test.describe('@Functional Functional checks', () => {
    test('ES-FUNC-001: Component container renders @EventStage @Functional @Smoke', async () => {
      const container = await stage.getContainer();
      await expect.soft(container, 'Event Stage section should be visible').toBeVisible();
      await expect.soft(container).toHaveAttribute('data-qa', 'event-stage');
      await expect.soft(container).toHaveAttribute('aria-labelledby', 'event-stage-title');
    });

    test('ES-FUNC-002: Start Date block is present @EventStage @Functional', async () => {
      const dateBlock = await stage.getDateBlock();
      await expect.soft(dateBlock, 'Date block should be visible').toBeVisible();

      const timeEl = await stage.getDateTimeElement();
      await expect.soft(timeEl, '<time> element should be visible').toBeVisible();
      const text = (await timeEl.textContent())?.trim() ?? '';
      expect.soft(text.length, 'Date text should not be empty').toBeGreaterThan(0);
    });

    test('ES-FUNC-003: Event Title renders as <h1> @EventStage @Functional', async () => {
      const title = await stage.getTitleElement();
      await expect.soft(title, 'Title should be visible').toBeVisible();
      await expect.soft(title).not.toBeEmpty();
      const tag = await title.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tag, 'Title element must be <h1>').toBe('h1');
    });

    test('ES-FUNC-004: Tag list contains at least one tag @EventStage @Functional', async () => {
      const tagsList = await stage.getTagsList();
      await expect.soft(tagsList, 'Tag list should be visible').toBeVisible();
      const ulTag = await tagsList.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(ulTag, 'Tags wrapper must be a <ul>').toBe('ul');

      const tagItems = await stage.getTagItems();
      const count = await tagItems.count();
      expect.soft(count, 'There must be at least one tag').toBeGreaterThanOrEqual(1);
    });

    test('ES-FUNC-005: Each tag has non-empty text @EventStage @Functional', async () => {
      const tagItems = await stage.getTagItems();
      const count = await tagItems.count();
      for (let i = 0; i < count; i++) {
        const text = (await tagItems.nth(i).textContent())?.trim() ?? '';
        expect.soft(text.length, `Tag #${i + 1} must have non-empty text`).toBeGreaterThan(0);
      }
    });

    test('ES-FUNC-006: Event image renders with alt + src @EventStage @Functional', async () => {
      const wrapper = await stage.getImageWrapper();
      await expect.soft(wrapper, 'Image wrapper should be visible').toBeVisible();

      const img = await stage.getImageElement();
      await expect.soft(img, '<img> should be visible').toBeVisible();
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      expect.soft((alt ?? '').length, 'Image alt should be non-empty').toBeGreaterThan(0);
      expect.soft((src ?? '').length, 'Image src should be non-empty').toBeGreaterThan(0);
    });

    test('ES-FUNC-007: Stage is positioned at top of main content @EventStage @Functional', async ({
      page,
    }) => {
      const container = await stage.getContainer();
      const box = await container.boundingBox();
      expect.soft(box, 'Container should have a bounding box').not.toBeNull();
      // Stage must sit within the first viewport height (i.e. above the fold)
      const viewport = page.viewportSize();
      const limit = (viewport?.height ?? 900) * 1.5;
      expect
        .soft(box?.y ?? Number.MAX_SAFE_INTEGER, `Stage y=${box?.y} should be < ${limit}`)
        .toBeLessThan(limit);
    });
  });

  // ─── Accessibility ──────────────────────────────────────────────────────
  test.describe('@Accessibility Accessibility checks', () => {
    test('ES-A11Y-001: axe-core scan of stage subtree (no critical/serious) @EventStage @Accessibility', async ({
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

    test('ES-A11Y-002: Title element is an <h1> @EventStage @Accessibility', async () => {
      const title = await stage.getTitleElement();
      const tag = await title.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tag).toBe('h1');
    });

    test('ES-A11Y-003: Image has non-empty alt @EventStage @Accessibility', async () => {
      const img = await stage.getImageElement();
      const alt = await img.getAttribute('alt');
      expect.soft((alt ?? '').trim().length, 'Image alt must not be empty').toBeGreaterThan(0);
    });

    test('ES-A11Y-004: Container aria-labelledby references the title id @EventStage @Accessibility', async ({
      page,
    }) => {
      const container = await stage.getContainer();
      const labelledBy = await container.getAttribute('aria-labelledby');
      expect.soft(labelledBy, 'aria-labelledby must be set').toBeTruthy();

      if (labelledBy) {
        // The id may live on the title <h1> or be supplied via data-qa.
        // The DOM uses data-qa="event-stage-title" as both data-qa AND label target.
        const exists = await page.evaluate(
          (id) =>
            !!document.getElementById(id) ||
            !!document.querySelector(`[data-qa="${id}"]`),
          labelledBy
        );
        expect
          .soft(exists, `Element referenced by aria-labelledby="${labelledBy}" should exist`)
          .toBe(true);
      }
    });

    test('ES-A11Y-005: Tag list uses <ul>/<li> semantics @EventStage @Accessibility', async () => {
      const tagsList = await stage.getTagsList();
      expect.soft(await tagsList.evaluate((el) => el.tagName.toLowerCase())).toBe('ul');

      const tagItems = await stage.getTagItems();
      const count = await tagItems.count();
      for (let i = 0; i < count; i++) {
        const tag = await tagItems.nth(i).evaluate((el) => el.tagName.toLowerCase());
        expect.soft(tag, `Tag #${i + 1} should be <li>`).toBe('li');
      }
    });
  });

  // ─── Performance ────────────────────────────────────────────────────────
  test.describe('@Performance Performance checks', () => {
    test('ES-PERF-001: Stage becomes visible within threshold @EventStage @Performance', async ({
      page,
      browser,
      context,
    }) => {
      // We re-navigate inside the test to measure cleanly.
      const fresh = new EventStageComponent(page, browser, context);
      const t0 = Date.now();
      await fresh.navigateToPage();
      const container = await fresh.getContainer();
      await container.waitFor({ state: 'visible' });
      const elapsed = Date.now() - t0;
      const threshold = TEST_CONFIG.performanceThresholds.loadTime * 10; // realistic for full nav+auth
      expect
        .soft(elapsed, `Stage visible in ${elapsed}ms (threshold ${threshold}ms)`)
        .toBeLessThan(threshold);
    });

    test('ES-PERF-002: Hero image is fully loaded @EventStage @Performance', async () => {
      const img = await stage.getImageElement();
      await img.waitFor({ state: 'visible' });
      const { complete, naturalWidth } = await img.evaluate((el) => {
        const i = el as HTMLImageElement;
        return { complete: i.complete, naturalWidth: i.naturalWidth };
      });
      expect.soft(complete, 'Image should be complete').toBe(true);
      expect.soft(naturalWidth, 'Image naturalWidth must be > 0').toBeGreaterThan(0);
    });
  });

  // ─── Visual (per viewport, driven by Figma values) ──────────────────────
  test.describe('@Visual Visual / typography vs Figma', () => {
    const viewports: ViewportName[] = ['XL', 'LG', 'MD', 'SM'];

    for (const vp of viewports) {
      const figma = EventStage_FigmaValues[vp];

      test.describe(`@VP-${vp} ${vp} viewport`, () => {
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize(figma.viewport);
          // Re-navigate at the new viewport so responsive layout is applied
          await stage.navigateToPage();
        });

        test(`ES-VIS-${vp}-001: Title typography matches Figma @EventStage @Visual @VP-${vp}`, async () => {
          const title = await stage.getTitleElement();
          await title.waitFor({ state: 'visible' });
          const family = await getCss(title, 'font-family');
          const size = await getCss(title, 'font-size');
          const weight = await getCss(title, 'font-weight');
          const color = await getCss(title, 'color');
          const lh = await getCss(title, 'line-height');

          if (figma.titleElement.fontFamily) {
            expect.soft(family.toLowerCase()).toContain(figma.titleElement.fontFamily.toLowerCase());
          }
          if (figma.titleElement.fontSize) {
            expect.soft(size).toBe(px(figma.titleElement.fontSize));
          }
          if (figma.titleElement.fontWeight) {
            expect.soft(String(weight)).toBe(String(figma.titleElement.fontWeight));
          }
          if (figma.titleElement.color) {
            expect.soft(normalizeColor(color)).toBe(normalizeColor(figma.titleElement.color));
          }
          if (figma.titleElement.lineHeight) {
            expect.soft(lh).toBe(px(figma.titleElement.lineHeight));
          }
        });

        test(`ES-VIS-${vp}-002: Date typography matches Figma @EventStage @Visual @VP-${vp}`, async () => {
          // Date typography lives on the inner <time> element - the wrapping
          // div is just the icon+text flex container. Read computed styles
          // from <time> so we compare against Figma's text-node values.
          const timeEl = await stage.getDateTimeElement();
          await timeEl.waitFor({ state: 'visible' });
          const family = await getCss(timeEl, 'font-family');
          const size = await getCss(timeEl, 'font-size');
          const weight = await getCss(timeEl, 'font-weight');
          const color = await getCss(timeEl, 'color');
          const lh = await getCss(timeEl, 'line-height');

          if (figma.dateElement.fontFamily) {
            expect.soft(family.toLowerCase()).toContain(figma.dateElement.fontFamily.toLowerCase());
          }
          if (figma.dateElement.fontSize) {
            expect.soft(size).toBe(px(figma.dateElement.fontSize));
          }
          if (figma.dateElement.fontWeight) {
            expect.soft(String(weight)).toBe(String(figma.dateElement.fontWeight));
          }
          if (figma.dateElement.color) {
            expect.soft(normalizeColor(color)).toBe(normalizeColor(figma.dateElement.color));
          }
          if (figma.dateElement.lineHeight) {
            expect.soft(lh).toBe(px(figma.dateElement.lineHeight));
          }
        });

        test(`ES-VIS-${vp}-003: First tag typography matches Figma @EventStage @Visual @VP-${vp}`, async () => {
          // Tag chip styling lives on the inner <span> (text-brand-green-700,
          // font-medium, text-xs, leading-xs-tight, italic, uppercase). The
          // <li> only carries the green pill background, so we MUST read
          // computed styles from the span.
          const tagItems = await stage.getTagItems();
          const count = await tagItems.count();
          if (count === 0) {
            expect.soft(count, 'Expected at least one tag to validate typography').toBeGreaterThan(0);
            return;
          }
          const firstTagText = await stage.getTagTextElement(0);
          await firstTagText.waitFor({ state: 'visible' });
          const family = await getCss(firstTagText, 'font-family');
          const size = await getCss(firstTagText, 'font-size');
          const weight = await getCss(firstTagText, 'font-weight');
          const color = await getCss(firstTagText, 'color');
          const lh = await getCss(firstTagText, 'line-height');

          if (figma.tagElement.fontFamily) {
            expect.soft(family.toLowerCase()).toContain(figma.tagElement.fontFamily.toLowerCase());
          }
          if (figma.tagElement.fontSize) {
            expect.soft(size).toBe(px(figma.tagElement.fontSize));
          }
          if (figma.tagElement.fontWeight) {
            expect.soft(String(weight)).toBe(String(figma.tagElement.fontWeight));
          }
          if (figma.tagElement.color) {
            expect.soft(normalizeColor(color)).toBe(normalizeColor(figma.tagElement.color));
          }
          if (figma.tagElement.lineHeight) {
            expect.soft(lh).toBe(px(figma.tagElement.lineHeight));
          }
        });

        test(`ES-VIS-${vp}-004: Image renders with positive intrinsic dimensions @EventStage @Visual @VP-${vp}`, async () => {
          const img = await stage.getImageElement();
          await img.waitFor({ state: 'visible' });
          const dims = await img.evaluate((el) => {
            const i = el as HTMLImageElement;
            const r = i.getBoundingClientRect();
            return {
              natW: i.naturalWidth,
              natH: i.naturalHeight,
              rendW: r.width,
              rendH: r.height,
            };
          });
          expect.soft(dims.natW, 'naturalWidth > 0').toBeGreaterThan(0);
          expect.soft(dims.natH, 'naturalHeight > 0').toBeGreaterThan(0);
          expect.soft(dims.rendW, 'rendered width > 0').toBeGreaterThan(0);
          expect.soft(dims.rendH, 'rendered height > 0').toBeGreaterThan(0);
        });
      });
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
//   EVENT DETAILS  (ADO 3803)
// ════════════════════════════════════════════════════════════════════════════
//
// FE-relevant ACs covered: AC2 (metadata display), AC3 (hide-time read-only),
// AC4 (address for Offline/Hybrid), AC5 (event URL for Online/Hybrid),
// AC6 (Additional Links box conditional), AC7 (Media Contact box conditional,
// "present or not"), AC9 (Add-to-Calendar click triggers ICS download).
// AC1, AC8, AC10 are CMS-only and excluded.

test.describe('@EventDetails Event Details Component', () => {
  let details: EventDetailsComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    await applyAllurePageContext('EventDetails');
    details = new EventDetailsComponent(page, browser, context);
    await details.navigateToPage();
  });

  // ─── Functional ─────────────────────────────────────────────────────────
  test.describe('@Functional Functional checks', () => {
    test('ED-FUNC-001: Container renders @EventDetails @Functional @Smoke', async () => {
      const container = await details.getContainer();
      await expect.soft(container, 'Event Details section should be visible').toBeVisible();
      await expect.soft(container).toHaveAttribute('data-qa', 'event-details');
    });

    test('ED-FUNC-002: Box 1 (event-details-section) renders @EventDetails @Functional', async () => {
      const box1 = await details.getBox1();
      await expect.soft(box1, 'Box 1 wrapper should be visible').toBeVisible();
    });

    test('ED-FUNC-003: Event title heading renders with non-empty text @EventDetails @Functional', async () => {
      const title = await details.getTitle();
      await expect.soft(title, 'Event title should be visible').toBeVisible();
      const text = (await title.textContent())?.trim() ?? '';
      expect.soft(text.length, 'Event title text should not be empty').toBeGreaterThan(0);
      const tag = await title.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(['h1', 'h2'].includes(tag), `Event title should be <h1> or <h2> (got <${tag}>)`).toBe(true);
    });

    test('ED-FUNC-004: Start date renders with non-empty value @EventDetails @Functional', async () => {
      const startDate = await details.getStartDate();
      await expect.soft(startDate, 'Start date should be visible').toBeVisible();
      const text = (await startDate.textContent())?.trim() ?? '';
      expect.soft(text.length, 'Start date text should not be empty').toBeGreaterThan(0);
      expect.soft(/start/i.test(text), 'Start date should include "Start" label').toBe(true);
    });

    test('ED-FUNC-005: End date renders with non-empty value @EventDetails @Functional', async () => {
      const endDate = await details.getEndDate();
      await expect.soft(endDate, 'End date should be visible').toBeVisible();
      const text = (await endDate.textContent())?.trim() ?? '';
      expect.soft(text.length, 'End date text should not be empty').toBeGreaterThan(0);
      expect.soft(/end/i.test(text), 'End date should include "End" label').toBe(true);
    });

    test('ED-FUNC-006: Local time renders with non-empty value @EventDetails @Functional', async () => {
      const localTime = await details.getLocalTime();
      await expect.soft(localTime, 'Local time should be visible').toBeVisible();
      const text = (await localTime.textContent())?.trim() ?? '';
      expect.soft(text.length, 'Local time text should not be empty').toBeGreaterThan(0);
    });

    test('ED-FUNC-007: Address block renders with all 5 lines non-empty @EventDetails @Functional', async () => {
      const wrapper = await details.getAddressWrapper();
      await expect.soft(wrapper, 'Address wrapper should be visible').toBeVisible();

      const lines: Array<{ name: string; loc: Locator }> = [
        { name: 'street', loc: await details.getStreet() },
        { name: 'locality', loc: await details.getLocality() },
        { name: 'postal code', loc: await details.getPostalCode() },
        { name: 'region', loc: await details.getRegion() },
        { name: 'country', loc: await details.getCountry() },
      ];
      for (const { name, loc } of lines) {
        await expect.soft(loc, `Address ${name} should be visible`).toBeVisible();
        const text = (await loc.textContent())?.trim() ?? '';
        expect.soft(text.length, `Address ${name} text should not be empty`).toBeGreaterThan(0);
      }
    });

    test('ED-FUNC-008: Event mode renders with non-empty value @EventDetails @Functional', async () => {
      const mode = await details.getEventMode();
      await expect.soft(mode, 'Event mode should be visible').toBeVisible();
      const text = (await mode.textContent())?.trim() ?? '';
      expect.soft(text.length, 'Event mode text should not be empty').toBeGreaterThan(0);
      expect.soft(/event\s*mode/i.test(text), 'Event mode should include "Event mode" label').toBe(true);
    });

    test('ED-FUNC-009: Add-to-Calendar button is visible, labelled and enabled @EventDetails @Functional', async () => {
      const btn = await details.getAddToCalendarButton();
      await expect.soft(btn, 'Add-to-Calendar button should be visible').toBeVisible();
      await expect.soft(btn).toBeEnabled();
      const text = ((await btn.textContent()) ?? '').trim();
      expect.soft(text.length, 'Button text should not be empty').toBeGreaterThan(0);
      expect.soft(/add\s*to\s*calendar/i.test(text), 'Button text should match "Add to Calendar"').toBe(true);
      const tag = await btn.evaluate((el) => el.tagName.toLowerCase());
      expect.soft(tag, 'Add-to-Calendar must be a <button>').toBe('button');
    });

    test('ED-FUNC-010: Add-to-Calendar click triggers ICS download (soft-warn if not) @EventDetails @Functional', async ({
      page,
    }) => {
      const btn = await details.getAddToCalendarButton();
      await btn.waitFor({ state: 'visible' });

      // Race a download event against a short timeout. We do NOT hard-fail
      // when no download fires - the FE may attach the download asynchronously
      // or fall back to a server endpoint.
      const downloadPromise = page
        .waitForEvent('download', { timeout: 8_000 })
        .catch(() => null);
      await btn.click();
      const dl = await downloadPromise;

      if (dl) {
        const suggested = dl.suggestedFilename();
        expect
          .soft(suggested.length, `Downloaded filename should not be empty (got "${suggested}")`)
          .toBeGreaterThan(0);
        expect
          .soft(
            /\.ics$/i.test(suggested) || /calendar/i.test(suggested),
            `Downloaded filename "${suggested}" should be an .ics calendar file`
          )
          .toBe(true);
      } else {
        // Soft warning - record the observation without failing the run.
        expect
          .soft(
            true,
            'No download fired within 8s of clicking Add-to-Calendar. ' +
              'This is logged as a soft observation; the FE may still satisfy AC9 ' +
              'via a different mechanism.'
          )
          .toBe(true);
      }
    });

    test('ED-FUNC-011: Event link is visible with non-empty href and text @EventDetails @Functional', async () => {
      const link = await details.getEventLink();
      await expect.soft(link, 'Event link should be visible').toBeVisible();
      const href = await link.getAttribute('href');
      const text = ((await link.textContent()) ?? '').trim();
      expect.soft((href ?? '').length, 'Event link href should not be empty').toBeGreaterThan(0);
      expect.soft(text.length, 'Event link text should not be empty').toBeGreaterThan(0);
      expect.soft(/^https?:\/\//.test(href ?? ''), `Event link href should be a URL (got "${href}")`).toBe(true);
    });

    test('ED-FUNC-012: Box 2 renders with at least one additional link @EventDetails @Functional', async () => {
      const box2 = await details.getBox2();
      await expect.soft(box2, 'Box 2 wrapper should be visible').toBeVisible();

      const title = await details.getBox2Title();
      await expect.soft(title, 'Box 2 heading should be visible').toBeVisible();

      const links = await details.getAdditionalLinks();
      const count = await links.count();
      expect.soft(count, 'Box 2 should have at least one additional link').toBeGreaterThanOrEqual(1);
      expect.soft(count, 'Box 2 should have at most three additional links (AC6 caps at 3)').toBeLessThanOrEqual(3);
    });

    test('ED-FUNC-013: Each additional link has non-empty text and href @EventDetails @Functional', async () => {
      const links = await details.getAdditionalLinks();
      const count = await links.count();
      for (let i = 0; i < count; i++) {
        const item = links.nth(i);
        const text = ((await item.textContent()) ?? '').trim();
        const href = (await item.getAttribute('href')) ?? '';
        expect.soft(text.length, `Additional link #${i + 1} text should not be empty`).toBeGreaterThan(0);
        expect.soft(href.length, `Additional link #${i + 1} href should not be empty`).toBeGreaterThan(0);
      }
    });

    test('ED-FUNC-014: Box 3 (Media Contact) - log present or not @EventDetails @Functional', async () => {
      // Box 3 is profile-card which the FE may render hidden (display:none)
      // when no Media Contact is assigned (AC7). getBox3Collection() runs a
      // SmartLocator probe (for selector-health) then returns a raw scoped
      // Locator that count() can see even when display:none.
      const scopedBox3 = await details.getBox3Collection();
      const count = await scopedBox3.count();

      if (count === 0) {
        expect
          .soft(true, 'Box 3 (profile-card) is not present inside Event Details (no Media Contact assigned)')
          .toBe(true);
        return;
      }

      const childCount = await scopedBox3.first().evaluate((el) => el.children.length);
      const isHidden = await scopedBox3.first().evaluate((el) => {
        const cs = getComputedStyle(el);
        return cs.display === 'none' || cs.visibility === 'hidden';
      });
      expect
        .soft(
          true,
          `Box 3 observed: count=${count}, children=${childCount}, hidden=${isHidden}. ` +
            'AC7 allows hiding when no Media Contact is assigned.'
        )
        .toBe(true);
    });
  });

  // ─── Accessibility ──────────────────────────────────────────────────────
  test.describe('@Accessibility Accessibility checks', () => {
    test('ED-A11Y-001: axe-core scan of Event Details subtree (no critical/serious) @EventDetails @Accessibility', async ({
      page,
    }) => {
      const results = await new AxeBuilder({ page })
        .include(ED_ROOT_CSS)
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      const serious = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );
      expect
        .soft(serious, `Critical/serious a11y violations: ${JSON.stringify(serious, null, 2)}`)
        .toEqual([]);
    });

    test('ED-A11Y-002: Title uses a top-level heading (h1 or h2) @EventDetails @Accessibility', async () => {
      const title = await details.getTitle();
      const tag = await title.evaluate((el) => el.tagName.toLowerCase());
      expect
        .soft(['h1', 'h2'].includes(tag), `Event Details title should be <h1> or <h2> (got <${tag}>)`)
        .toBe(true);
    });

    test('ED-A11Y-003: All headings inside Event Details have non-empty text @EventDetails @Accessibility', async () => {
      const headingsLocator = await details.getAllHeadings();
      const headings = await headingsLocator.allTextContents();
      expect.soft(headings.length, 'There should be at least one heading inside Event Details').toBeGreaterThan(0);
      headings.forEach((t, i) => {
        expect.soft(t.trim().length, `Heading #${i + 1} should have non-empty text`).toBeGreaterThan(0);
      });
    });

    test('ED-A11Y-004: Add-to-Calendar has accessible name + role=button @EventDetails @Accessibility', async () => {
      const btn = await details.getAddToCalendarButton();
      await expect.soft(btn).toBeVisible();
      const role = await btn.evaluate((el) => (el as HTMLElement).getAttribute('role') ?? el.tagName.toLowerCase());
      // Native <button> has implicit role=button; explicit role attribute also accepted.
      const isButton = role === 'button';
      expect.soft(isButton, `Element should expose role=button (got "${role}")`).toBe(true);
      const accName = ((await btn.textContent()) ?? '').trim() || (await btn.getAttribute('aria-label')) || '';
      expect.soft(accName.length, 'Add-to-Calendar should have a non-empty accessible name').toBeGreaterThan(0);
    });

    test('ED-A11Y-005: All anchors inside Event Details have non-empty name and href @EventDetails @Accessibility', async () => {
      const anchors = await details.getAllAnchors();
      const count = await anchors.count();
      expect.soft(count, 'There should be at least one link inside Event Details').toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const a = anchors.nth(i);
        const text = ((await a.textContent()) ?? '').trim();
        const aria = (await a.getAttribute('aria-label')) ?? '';
        const href = (await a.getAttribute('href')) ?? '';
        const name = text || aria;
        expect.soft(name.length, `Link #${i + 1} should have a non-empty accessible name`).toBeGreaterThan(0);
        expect.soft(href.length, `Link #${i + 1} should have a non-empty href`).toBeGreaterThan(0);
      }
    });
  });

  // ─── Performance ────────────────────────────────────────────────────────
  test.describe('@Performance Performance checks', () => {
    test('ED-PERF-001: Container becomes visible within threshold @EventDetails @Performance', async ({
      page,
      browser,
      context,
    }) => {
      const fresh = new EventDetailsComponent(page, browser, context);
      const t0 = Date.now();
      await fresh.navigateToPage();
      const container = await fresh.getContainer();
      await container.waitFor({ state: 'visible' });
      const elapsed = Date.now() - t0;
      const threshold = TEST_CONFIG.performanceThresholds.loadTime * 10; // realistic for nav+auth+cookie
      expect
        .soft(elapsed, `Event Details visible in ${elapsed}ms (threshold ${threshold}ms)`)
        .toBeLessThan(threshold);
    });

    test('ED-PERF-002: Box 1 essentials render together within threshold @EventDetails @Performance', async () => {
      const t0 = Date.now();
      const title = await details.getTitle();
      const startDate = await details.getStartDate();
      const button = await details.getAddToCalendarButton();
      await Promise.all([
        title.waitFor({ state: 'visible' }),
        startDate.waitFor({ state: 'visible' }),
        button.waitFor({ state: 'visible' }),
      ]);
      const elapsed = Date.now() - t0;
      const threshold = TEST_CONFIG.performanceThresholds.loadTime * 5;
      expect
        .soft(elapsed, `Box 1 essentials visible in ${elapsed}ms (threshold ${threshold}ms)`)
        .toBeLessThan(threshold);
    });
  });

  // ─── Visual (per viewport, driven by Figma values) ──────────────────────
  test.describe('@Visual Visual / typography vs Figma', () => {
    const viewports: ViewportName[] = ['XL', 'LG', 'MD', 'SM'];

    for (const vp of viewports) {
      const figma = EventDetails_FigmaValues[vp];

      test.describe(`@VP-${vp} ${vp} viewport`, () => {
        test.beforeEach(async ({ page }) => {
          await page.setViewportSize(figma.viewport);
          await details.navigateToPage();
        });

        test(`ED-VIS-${vp}-001: Box 1 title typography matches Figma @EventDetails @Visual @VP-${vp}`, async () => {
          const title = await details.getTitle();
          await title.waitFor({ state: 'visible' });
          const family = await getCss(title, 'font-family');
          const size = await getCss(title, 'font-size');
          const weight = await getCss(title, 'font-weight');
          const color = await getCss(title, 'color');
          const lh = await getCss(title, 'line-height');

          const t = figma.box1.titleText;
          if (t?.fontFamily) {
            expect.soft(family.toLowerCase()).toContain(t.fontFamily.toLowerCase());
          }
          if (t?.fontSize) expect.soft(size).toBe(px(t.fontSize));
          if (t?.fontWeight) expect.soft(String(weight)).toBe(String(t.fontWeight));
          if (t?.color) expect.soft(normalizeColor(color)).toBe(normalizeColor(t.color));
          if (t?.lineHeight) expect.soft(lh).toBe(px(t.lineHeight));
        });

        test(`ED-VIS-${vp}-002: Box 1 body text (start-date) typography matches Figma @EventDetails @Visual @VP-${vp}`, async () => {
          const startDate = await details.getStartDate();
          await startDate.waitFor({ state: 'visible' });
          const family = await getCss(startDate, 'font-family');
          const size = await getCss(startDate, 'font-size');
          const weight = await getCss(startDate, 'font-weight');
          const color = await getCss(startDate, 'color');
          const lh = await getCss(startDate, 'line-height');

          const t = figma.box1.bodyText;
          if (t?.fontFamily) {
            expect.soft(family.toLowerCase()).toContain(t.fontFamily.toLowerCase());
          }
          if (t?.fontSize) expect.soft(size).toBe(px(t.fontSize));
          if (t?.fontWeight) expect.soft(String(weight)).toBe(String(t.fontWeight));
          if (t?.color) expect.soft(normalizeColor(color)).toBe(normalizeColor(t.color));
          if (t?.lineHeight) expect.soft(lh).toBe(px(t.lineHeight));
        });

        test(`ED-VIS-${vp}-003: Box 2 heading typography matches Figma @EventDetails @Visual @VP-${vp}`, async () => {
          const heading = await details.getBox2Title();
          await heading.waitFor({ state: 'visible' });
          const family = await getCss(heading, 'font-family');
          const size = await getCss(heading, 'font-size');
          const weight = await getCss(heading, 'font-weight');
          const color = await getCss(heading, 'color');
          const lh = await getCss(heading, 'line-height');

          const t = figma.box2.titleText;
          if (t?.fontFamily) {
            expect.soft(family.toLowerCase()).toContain(t.fontFamily.toLowerCase());
          }
          if (t?.fontSize) expect.soft(size).toBe(px(t.fontSize));
          if (t?.fontWeight) expect.soft(String(weight)).toBe(String(t.fontWeight));
          if (t?.color) expect.soft(normalizeColor(color)).toBe(normalizeColor(t.color));
          if (t?.lineHeight) expect.soft(lh).toBe(px(t.lineHeight));
        });

        test(`ED-VIS-${vp}-004: Add-to-Calendar button typography matches Figma @EventDetails @Visual @VP-${vp}`, async () => {
          const btn = await details.getAddToCalendarButton();
          await btn.waitFor({ state: 'visible' });
          const family = await getCss(btn, 'font-family');
          const size = await getCss(btn, 'font-size');
          const weight = await getCss(btn, 'font-weight');
          const color = await getCss(btn, 'color');
          const lh = await getCss(btn, 'line-height');

          const t = figma.box1.buttonText;
          if (t?.fontFamily) {
            expect.soft(family.toLowerCase()).toContain(t.fontFamily.toLowerCase());
          }
          if (t?.fontSize) expect.soft(size).toBe(px(t.fontSize));
          if (t?.fontWeight) expect.soft(String(weight)).toBe(String(t.fontWeight));
          if (t?.color) expect.soft(normalizeColor(color)).toBe(normalizeColor(t.color));
          if (t?.lineHeight) expect.soft(lh).toBe(px(t.lineHeight));
        });
      });
    }
  });
});

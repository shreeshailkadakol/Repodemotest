import { BasePage } from '../helpers/utils/basePage';
import { Page, Locator, Browser, BrowserContext } from '@playwright/test';
import { envUtils } from '../helpers/utils/envUtils';

/**
 * Scrollytelling Component — Frontend (rendering / behaviour) page object.
 *
 * Scope: validates only what the FE renders and how it behaves. CMS authoring
 * (creating/editing steps, config fields) is intentionally out of scope.
 *
 * Every element interaction goes through the BasePage SmartLocator helpers
 * (`findSmart`) with multiple prioritized fallback strategies and a human
 * readable description, so the suite self-heals and feeds the selector health
 * report.
 *
 * Verified DOM (from temp/scrollytelling-dom-inspection.json):
 *  - [data-qa="scrollytelling"]                 -> <section> component wrapper
 *  - [data-qa="scrollytelling-pagination"]      -> sticky stepper container
 *  - .scrollytelling-indicators                 -> indicators wrapper
 *  - [data-qa="pagination-previous"]            -> Previous section <button>
 *  - [data-qa="pagination-next"]                -> Next section <button>
 *  - [data-qa="pagination-item-{n}"]            -> step indicator buttons
 *  - [data-qa="scrollytelling-item-title"]      -> <h3> step title (+highlight span)
 *  - [data-qa="scrollytelling-item-description"]-> step description
 *  - [data-qa="scrollytelling-background-image"]-> full-width image container
 *  - [data-qa="scrollytelling-positioned-image"]-> reduced/half image container
 *  - [data-qa="next-image"]                     -> <img> per step
 */
export class ScrollytellingComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  /**
   * Navigate to the Scrollytelling QA test page and handle Vercel / basic auth.
   */
  async navigateToTestPage(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const candidateUrls = await this.getComponentUrlsWithFallback(
      'ScrollytellingComponent',
      baseURL
    );

    let lastError: unknown;
    for (const url of candidateUrls) {
      try {
        await this.navigateWithAuthentication(url);
        await this.page.waitForLoadState('domcontentloaded', { timeout: 20000 });

        // Confirm the component mounted before continuing.
        const wrapper = await this.findSmart({
          dataQa: 'scrollytelling',
          testId: 'scrollytelling',
          css: 'section[data-qa="scrollytelling"]',
          description: 'Scrollytelling component wrapper',
          timeout: 15000,
        });
        await wrapper.waitFor({ state: 'attached', timeout: 15000 });
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw new Error(
      `Failed to navigate to Scrollytelling component on any of: ${candidateUrls.join(', ')}. Last error: ${lastError}`
    );
  }

  // ---------------------------------------------------------------------------
  // Structural elements (SmartLocator, >=3 fallbacks each)
  // ---------------------------------------------------------------------------

  async getComponent(): Promise<Locator> {
    return this.findSmart({
      dataQa: 'scrollytelling',
      testId: 'scrollytelling',
      css: 'section[data-qa="scrollytelling"]',
      xpath: '//section[@data-qa="scrollytelling"]',
      description: 'Scrollytelling component wrapper',
    });
  }

  async getPaginationContainer(): Promise<Locator> {
    return this.findSmart({
      dataQa: 'scrollytelling-pagination',
      testId: 'scrollytelling-pagination',
      css: '[data-qa="scrollytelling-pagination"]',
      xpath: '//*[@data-qa="scrollytelling-pagination"]',
      description: 'Scrollytelling sticky pagination/stepper container',
    });
  }

  async getIndicatorsWrapper(): Promise<Locator> {
    return this.findSmart({
      css: '.scrollytelling-indicators',
      dataQa: 'scrollytelling-pagination',
      xpath: '//*[contains(@class,"scrollytelling-indicators")]',
      description: 'Scrollytelling step indicators wrapper',
    });
  }

  async getPreviousButton(): Promise<Locator> {
    // The stepper renders twice (mobile + desktop). Only one is displayed per
    // breakpoint, so target the visible instance to avoid the hidden copy.
    return this.findSmart({
      css: '[data-qa="pagination-previous"]:visible',
      role: { role: 'button', name: /Previous section/i },
      dataQa: 'pagination-previous',
      xpath: '//button[@data-qa="pagination-previous"]',
      description: 'Pagination Previous section button',
    });
  }

  async getNextButton(): Promise<Locator> {
    return this.findSmart({
      css: '[data-qa="pagination-next"]:visible',
      role: { role: 'button', name: /Next section/i },
      dataQa: 'pagination-next',
      xpath: '//button[@data-qa="pagination-next"]',
      description: 'Pagination Next section button',
    });
  }

  /**
   * Step indicator button for the given zero-based index.
   * (The page renders the stepper twice — mobile + desktop — so we resolve the
   * visible instance for the active layout.)
   */
  async getStepIndicator(index: number): Promise<Locator> {
    return this.findSmart({
      css: `[data-qa="pagination-item-${index}"]:visible`,
      dataQa: `pagination-item-${index}`,
      xpath: `//button[@data-qa="pagination-item-${index}"]`,
      description: `Step indicator button #${index}`,
    });
  }

  async getActiveTitle(): Promise<Locator> {
    return this.findSmart({
      css: '[data-qa="scrollytelling-item-title"]:visible',
      dataQa: 'scrollytelling-item-title',
      xpath: '//*[@data-qa="scrollytelling-item-title"]',
      description: 'Active step title (h3)',
    });
  }

  async getActiveDescription(): Promise<Locator> {
    return this.findSmart({
      css: '[data-qa="scrollytelling-item-description"]:visible',
      dataQa: 'scrollytelling-item-description',
      xpath: '//*[@data-qa="scrollytelling-item-description"]',
      description: 'Active step description',
    });
  }

  /**
   * Highlight span nested inside the active title (the gradient emphasis text).
   */
  async getTitleHighlightSpan(): Promise<Locator> {
    const title = await this.getActiveTitle();
    return title.locator('span').first();
  }

  async getBackgroundImageContainer(): Promise<Locator> {
    return this.findSmart({
      dataQa: 'scrollytelling-background-image',
      css: '[data-qa="scrollytelling-background-image"]',
      xpath: '//*[@data-qa="scrollytelling-background-image"]',
      description: 'Full-width (background) image container',
    });
  }

  async getPositionedImageContainer(): Promise<Locator> {
    return this.findSmart({
      dataQa: 'scrollytelling-positioned-image',
      css: '[data-qa="scrollytelling-positioned-image"]',
      xpath: '//*[@data-qa="scrollytelling-positioned-image"]',
      description: 'Reduced/half (positioned) image container',
    });
  }

  async getStepImage(): Promise<Locator> {
    return this.findSmart({
      css: 'img[data-qa="next-image"]:visible',
      dataQa: 'next-image',
      testId: 'next-image',
      xpath: '//img[@data-qa="next-image"]',
      description: 'Step image (next-image)',
    });
  }

  // ---------------------------------------------------------------------------
  // Counts / collections (read-only — locator-level queries on smart roots)
  // ---------------------------------------------------------------------------

  /**
   * Number of distinct steps, derived from the unique pagination-item indices.
   */
  async getStepCount(): Promise<number> {
    let count = 0;
    for (let i = 0; i < 50; i++) {
      const exists =
        (await this.page.locator(`[data-qa="pagination-item-${i}"]`).count()) > 0;
      if (!exists) break;
      count++;
    }
    return count;
  }

  /**
   * Labels of all step indicators (first rendered stepper instance).
   */
  async getStepLabels(): Promise<string[]> {
    const labels: string[] = [];
    const count = await this.getStepCount();
    for (let i = 0; i < count; i++) {
      const indicator = await this.getStepIndicator(i);
      const aria = (await indicator.getAttribute('aria-label')) || '';
      labels.push(aria);
    }
    return labels;
  }

  // ---------------------------------------------------------------------------
  // Interactions (all entered via SmartLocator)
  // ---------------------------------------------------------------------------

  async clickStepIndicator(index: number): Promise<void> {
    const indicator = await this.getStepIndicator(index);
    await indicator.scrollIntoViewIfNeeded();
    await indicator.click();
    await this.page.waitForTimeout(1200); // allow the opacity transition (700ms) to settle
  }

  async clickNext(): Promise<void> {
    const next = await this.getNextButton();
    await next.scrollIntoViewIfNeeded();
    await next.click();
    await this.page.waitForTimeout(1200);
  }

  async clickPrevious(): Promise<void> {
    const prev = await this.getPreviousButton();
    await prev.scrollIntoViewIfNeeded();
    await prev.click();
    await this.page.waitForTimeout(1200);
  }

  async focusFirstStepIndicator(): Promise<void> {
    const indicator = await this.getStepIndicator(0);
    await indicator.focus();
  }

  /**
   * Scroll through the whole component from top to bottom in increments so the
   * scroll-driven step transitions fire. Returns the distinct active-step
   * titles observed along the way (in order of first appearance).
   */
  async scrollThroughComponent(increments = 12): Promise<string[]> {
    const component = await this.getComponent();
    await component.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);

    const seen: string[] = [];
    const record = async () => {
      const t = await this.getActiveStepTitleText();
      if (t && !seen.includes(t)) seen.push(t);
    };
    await record();

    const box = await component.boundingBox();
    const total = box ? box.height : 3000;
    const step = Math.max(250, Math.round(total / increments));

    for (let i = 0; i < increments; i++) {
      await this.page.evaluate((dy) => window.scrollBy(0, dy), step);
      await this.page.waitForTimeout(700);
      await record();
    }
    return seen;
  }

  // ---------------------------------------------------------------------------
  // Active-step detection
  //
  // The component stacks all step panels and toggles opacity (no aria-current),
  // so "active" == the title whose effective (ancestor-multiplied) opacity is
  // highest. We resolve the root via SmartLocator, then read state from it.
  // ---------------------------------------------------------------------------

  /**
   * Returns the text of the currently displayed (most opaque) step title.
   */
  async getActiveStepTitleText(): Promise<string> {
    const component = await this.getComponent();
    return component.evaluate((root) => {
      const titles = Array.from(
        root.querySelectorAll('[data-qa="scrollytelling-item-title"]')
      ) as HTMLElement[];
      if (titles.length === 0) return '';

      const isRendered = (el: HTMLElement): boolean => {
        // display:none elements have a null offsetParent (and zero size).
        const rect = el.getBoundingClientRect();
        return el.offsetParent !== null && rect.width > 0 && rect.height > 0;
      };

      const effectiveOpacity = (el: HTMLElement): number => {
        let node: HTMLElement | null = el;
        let opacity = 1;
        while (node && node !== root.parentElement) {
          const o = parseFloat(window.getComputedStyle(node).opacity || '1');
          if (!Number.isNaN(o)) opacity *= o;
          node = node.parentElement;
        }
        return opacity;
      };

      const rendered = titles.filter(isRendered);
      const pool = rendered.length > 0 ? rendered : titles;

      let best = pool[0];
      let bestOpacity = -1;
      for (const t of pool) {
        const o = effectiveOpacity(t);
        if (o > bestOpacity) {
          bestOpacity = o;
          best = t;
        }
      }
      return (best.textContent || '').replace(/\s+/g, ' ').trim();
    });
  }

  /**
   * Index of the active step. Prefers the accessible `aria-current="true"`
   * marker on the indicator buttons; falls back to matching the displayed
   * title text against the ordered step labels.
   */
  async getActiveStepIndex(): Promise<number> {
    // Preferred: aria-current on the visible stepper instance.
    const ariaIndex = await this.page.evaluate(() => {
      const items = Array.from(
        document.querySelectorAll('[data-qa^="pagination-item-"]')
      ) as HTMLElement[];
      for (const item of items) {
        if (item.offsetParent === null) continue; // skip hidden (mobile/desktop) copy
        if (item.getAttribute('aria-current') === 'true') {
          const qa = item.getAttribute('data-qa') || '';
          const m = /pagination-item-(\d+)/.exec(qa);
          if (m) return parseInt(m[1], 10);
        }
      }
      return -1;
    });
    if (ariaIndex >= 0) return ariaIndex;

    const activeText = (await this.getActiveStepTitleText()).toLowerCase();
    if (!activeText) return -1;
    const labels = await this.getStepLabels();
    for (let i = 0; i < labels.length; i++) {
      // aria-label form: "Go to {StepName}: {Title}"
      const stepName = labels[i].replace(/^Go to\s+/i, '').split(':')[0].trim().toLowerCase();
      if (stepName && activeText.includes(stepName)) return i;
    }
    return -1;
  }

  /**
   * Whether the Previous button is in its disabled/non-interactive state
   * (class `cursor-not-allowed`/`opacity-20` or the disabled attribute).
   */
  async isPreviousDisabled(): Promise<boolean> {
    const prev = await this.getPreviousButton();
    return prev.evaluate((el) => {
      const cls = el.className || '';
      const ariaDisabled = el.getAttribute('aria-disabled') === 'true';
      const nativeDisabled = (el as HTMLButtonElement).disabled === true;
      return (
        nativeDisabled ||
        ariaDisabled ||
        /cursor-not-allowed/.test(cls) ||
        /opacity-20/.test(cls)
      );
    });
  }

  async isNextDisabled(): Promise<boolean> {
    const next = await this.getNextButton();
    return next.evaluate((el) => {
      const cls = el.className || '';
      const ariaDisabled = el.getAttribute('aria-disabled') === 'true';
      const nativeDisabled = (el as HTMLButtonElement).disabled === true;
      return (
        nativeDisabled ||
        ariaDisabled ||
        /cursor-not-allowed/.test(cls) ||
        /opacity-20/.test(cls)
      );
    });
  }

  /**
   * Whether the pagination/stepper is sticky (AC5 — stays in place while
   * scrolling). Checks for CSS sticky/fixed on the container, its ancestors or
   * the indicators wrapper; falls back to a behavioural check (the stepper
   * remains pinned in the viewport while the page scrolls).
   */
  async isPaginationSticky(): Promise<boolean> {
    const container = await this.getPaginationContainer();

    const cssSticky = await container.evaluate((el) => {
      const hasSticky = (node: Element | null): boolean => {
        let cur: Element | null = node;
        while (cur && cur !== document.body) {
          const pos = window.getComputedStyle(cur).position;
          if (pos === 'sticky' || pos === 'fixed') return true;
          cur = cur.parentElement;
        }
        return false;
      };
      // Check the container, its ancestors and any descendant wrapper.
      if (hasSticky(el)) return true;
      const descendants = Array.from(el.querySelectorAll('*')).slice(0, 30);
      return descendants.some((d) => {
        const pos = window.getComputedStyle(d).position;
        return pos === 'sticky' || pos === 'fixed';
      });
    });
    if (cssSticky) return true;

    // Behavioural fallback: a sticky stepper stays at (roughly) the same
    // viewport offset after the page scrolls within the component region.
    const component = await this.getComponent();
    await component.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(400);
    const before = await container.boundingBox();
    await this.page.evaluate(() => window.scrollBy(0, 400));
    await this.page.waitForTimeout(600);
    const after = await container.boundingBox();
    if (!before || !after) return false;
    return Math.abs(after.y - before.y) < 80;
  }

  /**
   * Resolved horizontal placement of the active text container, derived from the
   * positioned-image side classes (text sits opposite the image).
   * Returns 'left' | 'right' | 'full' ('full' == full-width background image).
   */
  async getActiveImagePlacement(): Promise<'full' | 'reduced'> {
    const hasPositioned =
      (await this.page
        .locator('[data-qa="scrollytelling-positioned-image"]')
        .count()) > 0;
    return hasPositioned ? 'reduced' : 'full';
  }

  /**
   * Returns the static layout of every content panel rendered by the component.
   *
   * The test page authors all four layout variants at once (one per step), each
   * panel coexisting in the DOM and toggled by opacity. Layout (image placement
   * and text-container side) is therefore static and measurable regardless of
   * which step is currently active.
   *
   *  - `placement`: 'full'  -> full-screen background image
   *                 'half'  -> reduced / positioned image
   *  - `textSide`:  'left' | 'right' -> which half of the component the text
   *                 container sits in.
   *
   * Content panels are those whose subtree contains exactly one image type
   * (full XOR half); the hidden stepper-preview duplicates contain both and are
   * excluded.
   */
  async getPanelLayouts(): Promise<
    Array<{ title: string; placement: 'full' | 'half'; textSide: 'left' | 'right' }>
  > {
    // Anchor on the component root via SmartLocator before reading the DOM.
    const root = await this.findSmart({
      dataQa: 'scrollytelling',
      testId: 'scrollytelling',
      css: 'section[data-qa="scrollytelling"]',
      description: 'Scrollytelling component wrapper',
      timeout: 15000,
    });
    await root.waitFor({ state: 'visible', timeout: 15000 });

    return this.page.evaluate(() => {
      const rootEl = document.querySelector('[data-qa="scrollytelling"]');
      if (!rootEl) return [];

      const rootBox = rootEl.getBoundingClientRect();
      const midX = rootBox.x + rootBox.width / 2;

      const titles = Array.from(
        rootEl.querySelectorAll('[data-qa="scrollytelling-item-title"]')
      ) as HTMLElement[];

      const panels: Array<{
        title: string;
        placement: 'full' | 'half';
        textSide: 'left' | 'right';
      }> = [];

      for (const titleEl of titles) {
        // Walk up to the panel container that owns an image.
        let panel: HTMLElement | null = titleEl;
        for (let up = 0; up < 6 && panel; up++) {
          if (
            panel.querySelector('[data-qa="scrollytelling-background-image"]') ||
            panel.querySelector('[data-qa="scrollytelling-positioned-image"]')
          ) {
            break;
          }
          panel = panel.parentElement;
        }
        if (!panel) continue;

        const hasFull = !!panel.querySelector('[data-qa="scrollytelling-background-image"]');
        const hasHalf = !!panel.querySelector('[data-qa="scrollytelling-positioned-image"]');

        // Content panels expose exactly one image type; skip preview duplicates.
        if (hasFull === hasHalf) continue;

        const tb = titleEl.getBoundingClientRect();
        const titleCenter = tb.x + tb.width / 2;

        panels.push({
          title: (titleEl.textContent ?? '').replace(/\s+/g, ' ').trim(),
          placement: hasFull ? 'full' : 'half',
          textSide: titleCenter < midX ? 'left' : 'right',
        });
      }

      return panels;
    });
  }
}

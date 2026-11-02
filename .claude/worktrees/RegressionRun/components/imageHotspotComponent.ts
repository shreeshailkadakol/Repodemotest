import { BasePage } from '../helpers/utils/basePage';
import { Page, Locator, Browser, BrowserContext } from '@playwright/test';
import { envUtils } from '../helpers/utils/envUtils';

/**
 * Image Hotspot Component — Frontend page object.
 *
 * Scope: FE rendering and behaviour only. CMS/editor ACs are out of scope.
 *
 * Verified DOM (live inspection 2026-07-17):
 *  - [data-testid="image-with-hotspots"][data-qa="image-with-hotspots"]  -> component wrapper
 *  - [data-testid="image-with-hotspots-image-wrapper"]                   -> image wrapper (relative)
 *  - [data-testid="next-image"][data-qa="image-with-hotspots-image"]     -> <img>
 *  - [data-testid="image-with-hotspots-pin"]                             -> hotspot <button> pins
 *  - [data-testid="overlay-card-backdrop"]                               -> backdrop (SM only, md:hidden)
 *  - [data-testid="overlay-card-dialog"]                                 -> <dialog> overlay
 *  - [data-testid="overlay-card-close-button"][data-qa="overlay-card-close-button"] -> close btn
 *  - h2[data-qa="title-component"]                                       -> overlay title
 */
export class ImageHotspotComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  async navigateToTestPage(): Promise<void> {
    const baseURL = envUtils.getBaseUrl();
    const candidateUrls = await this.getComponentUrlsWithFallback('ImageHotspotComponent', baseURL);

    let lastError: unknown;
    for (const url of candidateUrls) {
      try {
        await this.navigateWithAuthentication(url);
        await this.page.waitForLoadState('domcontentloaded', { timeout: 20000 });

        const wrapper = await this.findSmart({
          dataQa: 'image-with-hotspots',
          testId: 'image-with-hotspots',
          css: '[data-component="ImageWithHotspots"]',
          description: 'Image Hotspot component wrapper',
          timeout: 15000,
        });
        await wrapper.waitFor({ state: 'attached', timeout: 15000 });
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw new Error(
      `Failed to navigate to Image Hotspot component on any of: ${candidateUrls.join(', ')}. Last error: ${lastError}`
    );
  }

  // ---------------------------------------------------------------------------
  // Structural elements (SmartLocator, >=3 fallbacks each)
  // ---------------------------------------------------------------------------

  async getComponent(): Promise<Locator> {
    return this.findSmart({
      dataQa: 'image-with-hotspots',
      testId: 'image-with-hotspots',
      css: '[data-component="ImageWithHotspots"]',
      xpath: '//*[@data-qa="image-with-hotspots"]',
      description: 'Image Hotspot component wrapper',
    });
  }

  async getImageWrapper(): Promise<Locator> {
    return this.findSmart({
      testId: 'image-with-hotspots-image-wrapper',
      css: '[data-testid="image-with-hotspots-image-wrapper"]',
      xpath: '//*[@data-testid="image-with-hotspots-image-wrapper"]',
      description: 'Image wrapper container',
    });
  }

  async getImage(): Promise<Locator> {
    return this.findSmart({
      dataQa: 'image-with-hotspots-image',
      testId: 'next-image',
      css: '[data-qa="image-with-hotspots-image"]',
      xpath: '//img[@data-qa="image-with-hotspots-image"]',
      description: 'Hotspot component image',
    });
  }

  async getHotspotPins(): Promise<Locator[]> {
    const pins = this.page.locator('[data-testid="image-with-hotspots-pin"]');
    const count = await pins.count();
    const result: Locator[] = [];
    for (let i = 0; i < count; i++) {
      result.push(pins.nth(i));
    }
    return result;
  }

  async getHotspotPinCount(): Promise<number> {
    return this.page.locator('[data-testid="image-with-hotspots-pin"]').count();
  }

  async getHotspotPinByIndex(index: number): Promise<Locator> {
    return this.findSmart({
      testId: 'image-with-hotspots-pin',
      css: `[data-testid="image-with-hotspots-pin"]:nth-of-type(${index + 2})`,
      xpath: `(//*[@data-testid="image-with-hotspots-pin"])[${index + 1}]`,
      description: `Hotspot pin button #${index}`,
    });
  }

  async getVisibleHotspotPins(): Promise<Locator[]> {
    const allPins = await this.getHotspotPins();
    const visible: Locator[] = [];
    for (const pin of allPins) {
      const style = await pin.getAttribute('style');
      if (style && !style.includes('left:0%') && !style.includes('top:0%')) {
        visible.push(pin);
      }
    }
    return visible;
  }

  // ---------------------------------------------------------------------------
  // Overlay elements
  // ---------------------------------------------------------------------------

  async getOverlayDialog(): Promise<Locator> {
    return this.findSmart({
      testId: 'overlay-card-dialog',
      css: 'dialog[data-testid="overlay-card-dialog"]',
      xpath: '//dialog[@data-testid="overlay-card-dialog"]',
      description: 'Hotspot overlay dialog',
    });
  }

  async getOverlayBackdrop(): Promise<Locator> {
    return this.findSmart({
      testId: 'overlay-card-backdrop',
      css: '[data-testid="overlay-card-backdrop"]',
      xpath: '//*[@data-testid="overlay-card-backdrop"]',
      description: 'Hotspot overlay backdrop (SM only)',
    });
  }

  async getOverlayCloseButton(): Promise<Locator> {
    return this.findSmart({
      dataQa: 'overlay-card-close-button',
      testId: 'overlay-card-close-button',
      role: { role: 'button', name: /Close modal/i },
      css: '[data-testid="overlay-card-close-button"]',
      description: 'Overlay close (X) button',
    });
  }

  async getOverlayTitle(): Promise<Locator> {
    const dialog = await this.getOverlayDialog();
    return dialog.locator('h2[data-qa="title-component"]');
  }

  async getOverlayDescription(): Promise<Locator> {
    const dialog = await this.getOverlayDialog();
    return dialog.locator('div:has(> div > p), div:has(> p)').first();
  }

  async getOverlayImage(): Promise<Locator> {
    const dialog = await this.getOverlayDialog();
    return dialog.locator('img');
  }

  async getOverlayCTALink(): Promise<Locator> {
    const dialog = await this.getOverlayDialog();
    return dialog.locator('a');
  }

  // ---------------------------------------------------------------------------
  // Interactions
  // ---------------------------------------------------------------------------

  async clickHotspotPin(index: number): Promise<void> {
    const pin = await this.getHotspotPinByIndex(index);
    await pin.scrollIntoViewIfNeeded();
    await pin.click();
    await this.page.waitForTimeout(500);
  }

  async clickVisibleHotspotPin(index: number): Promise<void> {
    const visiblePins = await this.getVisibleHotspotPins();
    if (index >= visiblePins.length) {
      throw new Error(
        `Visible hotspot pin index ${index} out of range (${visiblePins.length} visible pins)`
      );
    }
    await visiblePins[index].scrollIntoViewIfNeeded();
    await visiblePins[index].click();
    await this.page.waitForTimeout(500);
  }

  async closeOverlayByButton(): Promise<void> {
    const closeBtn = await this.getOverlayCloseButton();
    await closeBtn.click();
    await this.page.waitForTimeout(300);
  }

  async closeOverlayByEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
  }

  // ---------------------------------------------------------------------------
  // Verification helpers
  // ---------------------------------------------------------------------------

  async isOverlayVisible(): Promise<boolean> {
    const dialog = this.page.locator('[data-testid="overlay-card-dialog"]');
    const count = await dialog.count();
    if (count === 0) return false;
    return dialog.first().isVisible();
  }

  async isBackdropVisible(): Promise<boolean> {
    const backdrop = this.page.locator('[data-testid="overlay-card-backdrop"]');
    const count = await backdrop.count();
    if (count === 0) return false;
    const box = await backdrop.first().boundingBox();
    return box !== null && box.width > 0 && box.height > 0;
  }

  async getHotspotPinPosition(pin: Locator): Promise<{ left: string; top: string }> {
    const style = (await pin.getAttribute('style')) || '';
    const leftMatch = /left:\s*([\d.]+%)/.exec(style);
    const topMatch = /top:\s*([\d.]+%)/.exec(style);
    return {
      left: leftMatch ? leftMatch[1] : '',
      top: topMatch ? topMatch[1] : '',
    };
  }

  async getOverlayBoundingBox(): Promise<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null> {
    const dialog = await this.getOverlayDialog();
    return dialog.boundingBox();
  }

  async getImageBoundingBox(): Promise<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null> {
    const image = await this.getImage();
    return image.boundingBox();
  }

  async getImageNaturalDimensions(): Promise<{ naturalWidth: number; naturalHeight: number }> {
    const image = await this.getImage();
    return image.evaluate((el: HTMLImageElement) => ({
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
    }));
  }

  async getHotspotPinBoundingBox(
    pin: Locator
  ): Promise<{ x: number; y: number; width: number; height: number } | null> {
    return pin.boundingBox();
  }

  async verifyOverlayWithinViewport(): Promise<{ withinViewport: boolean; details: string }> {
    const box = await this.getOverlayBoundingBox();
    if (!box) return { withinViewport: false, details: 'Overlay not found or not visible' };

    const viewport = this.page.viewportSize();
    if (!viewport) return { withinViewport: false, details: 'Viewport size not available' };

    const withinLeft = box.x >= 0;
    const withinTop = box.y >= 0;
    const withinRight = box.x + box.width <= viewport.width;
    const withinBottom = box.y + box.height <= viewport.height;
    const withinViewport = withinLeft && withinTop && withinRight && withinBottom;

    return {
      withinViewport,
      details: `box(${Math.round(box.x)},${Math.round(box.y)},${Math.round(box.width)}x${Math.round(box.height)}) viewport(${viewport.width}x${viewport.height})`,
    };
  }
}

import { Page, Locator, Browser, BrowserContext } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

/**
 * Profile Card with Link Variant - Page Object (ADO 4317).
 *
 * Design rules (per playwright skills):
 *   - SmartLocator only for primary resolution (findSmart probe), then a scoped raw
 *     Locator is returned for collection iteration - same probe-then-resolve pattern
 *     as EventsTeaserGroupComponent.
 *   - Language-agnostic: structure/attributes only, never exact copy.
 *   - Per-card children are resolved by scoping under [data-qa="profile-card"].
 *
 * DOM (from docs/dom-inspection-profile-card-link-variant.md):
 *   section[data-qa="columns25252525"] > section[data-qa="profile-card"] (x2)
 *     img[data-qa="profile-card-image"]
 *     button.bg-alpha-black-50 > svg[data-qa="icon"]        (zoom trigger, no data-qa)
 *     h2[data-qa="title-component"]
 *     section[data-qa="profile-designation"]                (full-fields only)
 *     section[data-qa="profile-short-description"]          (full-fields only)
 *     a[data-qa="profile-link"] > svg[data-qa="icon"]
 *   Lightbox: div[role="dialog"] (no data-qa) with next-image / va-lightbox-caption /
 *     va-metadata and Close / Download buttons located by role/aria-label.
 */

const DIVIDER_CSS = 'section[data-qa="columns25252525"]';
const CARD_CSS = '[data-qa="profile-card"]';

// Exported scope selectors for spec-level tools that require a CSS string (e.g. axe-core
// `.include(...)`). Locators are defined here in the page object, never in the spec file.
export const PROFILE_CARD_SELECTOR = CARD_CSS;
export const LIGHTBOX_SELECTOR = '[role="dialog"]:has([data-testid="next-image"])';
const IMAGE_CSS = `${CARD_CSS} [data-qa="profile-card-image"]`;
const TITLE_CSS = `${CARD_CSS} [data-qa="title-component"]`;
const DESIGNATION_CSS = `${CARD_CSS} [data-qa="profile-designation"]`;
const SHORT_DESC_CSS = `${CARD_CSS} [data-qa="profile-short-description"]`;
const LINK_CSS = `${CARD_CSS} [data-qa="profile-link"]`;
// Zoom trigger has no data-qa: the only <button> inside a card, wrapping svg[data-qa="icon"].
const ZOOM_CSS = `${CARD_CSS} button:has(svg[data-qa="icon"])`;

// The page also renders a hidden cookie-consent dialog (role="dialog",
// aria-label="Usage of Cookies"). Scope the Lightbox to the dialog that actually
// contains the lightbox image so [role="dialog"].first() never resolves to the
// cookie banner.
const LIGHTBOX_CSS = LIGHTBOX_SELECTOR;
const LB_IMAGE_CSS = `${LIGHTBOX_CSS} [data-testid="next-image"]`;
const LB_CAPTION_CSS = `${LIGHTBOX_CSS} [data-testid="va-lightbox-caption"]`;
const LB_METADATA_CSS = `${LIGHTBOX_CSS} [data-testid="va-metadata"]`;

export class ProfileCardLinkVariantComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ----------------------------------------------------------------
  // Navigation / setup
  // ----------------------------------------------------------------

  async navigateToPage(baseURL?: string): Promise<void> {
    const targetBase = baseURL ?? envUtils.getBaseUrl();
    const url = await this.resolveExecutionUrl('ProfileCardLinkVariantComponent', targetBase);
    await this.navigateWithAuthentication(url);
    await this.acceptCookiesBanner();
    await this.waitForComponentLoad();
  }

  async waitForComponentLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15_000 });
    const firstCard = this.page.locator(CARD_CSS).first();
    await firstCard.waitFor({ state: 'visible', timeout: 15_000 });
  }

  // ----------------------------------------------------------------
  // Containers / collections (probe-then-resolve -> raw scoped Locator)
  // ----------------------------------------------------------------

  /**
   * The content divider that hosts the cards. On the current test page this is a
   * 25/25/25/25 divider; fall back to the cards' nearest section when absent so the
   * getter still resolves on a 33/33/33 page.
   */
  async getContainer(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'columns25252525',
      css: DIVIDER_CSS,
      xpath: `//section[@data-qa="columns25252525"]`,
      description: 'Profile Card Link Variant content divider (25/25/25/25)',
    });
  }

  /** All profile-card instances. */
  async getCards(): Promise<Locator> {
    await this.findSmart({
      dataQa: 'profile-card',
      css: CARD_CSS,
      xpath: `//*[@data-qa="profile-card"]`,
      description: 'Profile cards (first match - health probe)',
    });
    return this.page.locator(CARD_CSS);
  }

  /** All card images. */
  async getAllImages(): Promise<Locator> {
    await this.findSmart({
      css: IMAGE_CSS,
      xpath: `//*[@data-qa="profile-card"]//*[@data-qa="profile-card-image"]`,
      description: 'Profile card images (first match - health probe)',
    });
    return this.page.locator(IMAGE_CSS);
  }

  /** All card titles (<h2 data-qa="title-component"> inside cards). */
  async getAllTitles(): Promise<Locator> {
    await this.findSmart({
      css: TITLE_CSS,
      xpath: `//*[@data-qa="profile-card"]//*[@data-qa="title-component"]`,
      description: 'Profile card titles (first match - health probe)',
    });
    return this.page.locator(TITLE_CSS);
  }

  /** All card links (<a data-qa="profile-link">). */
  async getAllLinks(): Promise<Locator> {
    await this.findSmart({
      css: LINK_CSS,
      xpath: `//*[@data-qa="profile-card"]//*[@data-qa="profile-link"]`,
      description: 'Profile card links (first match - health probe)',
    });
    return this.page.locator(LINK_CSS);
  }

  /** All designations (present only on full-fields / Minimal-unchecked cards). */
  async getAllDesignations(): Promise<Locator> {
    return this.page.locator(DESIGNATION_CSS);
  }

  /** All short descriptions (present only on full-fields / Minimal-unchecked cards). */
  async getAllShortDescriptions(): Promise<Locator> {
    return this.page.locator(SHORT_DESC_CSS);
  }

  /** All zoom trigger buttons overlaying the card images. */
  async getAllZoomButtons(): Promise<Locator> {
    try {
      await this.findSmart({
        css: ZOOM_CSS,
        xpath: `//*[@data-qa="profile-card"]//button[.//*[@data-qa="icon"]]`,
        description: 'Card zoom trigger buttons (first match - health probe)',
      });
    } catch {
      // Zoom may be disabled on a card; callers guard on count().
    }
    return this.page.locator(ZOOM_CSS);
  }

  // ----------------------------------------------------------------
  // Per-card child accessors (parent/child pattern)
  // ----------------------------------------------------------------

  getCardImage(card: Locator): Locator {
    return card.locator('[data-qa="profile-card-image"]').first();
  }

  getCardTitle(card: Locator): Locator {
    return card.locator('[data-qa="title-component"]').first();
  }

  getCardDesignation(card: Locator): Locator {
    return card.locator('[data-qa="profile-designation"]').first();
  }

  getCardShortDescription(card: Locator): Locator {
    return card.locator('[data-qa="profile-short-description"]').first();
  }

  /** All designation elements within a card (0 for a Minimal-Fields card). */
  getCardDesignations(card: Locator): Locator {
    return card.locator('[data-qa="profile-designation"]');
  }

  /** All short-description elements within a card (0 for a Minimal-Fields card). */
  getCardShortDescriptions(card: Locator): Locator {
    return card.locator('[data-qa="profile-short-description"]');
  }

  getCardLink(card: Locator): Locator {
    return card.locator('[data-qa="profile-link"]').first();
  }

  getCardZoomButton(card: Locator): Locator {
    return card.locator('button:has(svg[data-qa="icon"])').first();
  }

  /**
   * A card is in the Minimal-Fields (checked) configuration when it renders neither
   * a designation nor a short description.
   */
  async isMinimalCard(card: Locator): Promise<boolean> {
    const designation = await card.locator('[data-qa="profile-designation"]').count();
    const shortDesc = await card.locator('[data-qa="profile-short-description"]').count();
    return designation === 0 && shortDesc === 0;
  }

  /**
   * The first full-fields (Minimal-unchecked) card, or null when the page has none.
   * The Figma tokens were extracted from the full "with background" card, so visual
   * typography/spacing assertions must target a full card - the Minimal card renders
   * its title with intentionally different (smaller/toned) styling.
   */
  async getFirstFullCard(): Promise<Locator | null> {
    const cards = await this.getCards();
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      if (!(await this.isMinimalCard(cards.nth(i)))) return cards.nth(i);
    }
    return null;
  }

  // ----------------------------------------------------------------
  // Lightbox
  // ----------------------------------------------------------------

  /** The Lightbox dialog (opened via a card zoom button). */
  async getLightbox(): Promise<Locator> {
    return await this.findSmart({
      css: LIGHTBOX_CSS,
      xpath: `//*[@role="dialog"][.//*[@data-testid="next-image"]]`,
      description: 'Lightbox dialog (scoped to the one containing the lightbox image)',
    });
  }

  getLightboxImage(): Locator {
    return this.page.locator(LB_IMAGE_CSS).first();
  }

  getLightboxCaption(): Locator {
    return this.page.locator(LB_CAPTION_CSS).first();
  }

  getLightboxMetadata(): Locator {
    return this.page.locator(LB_METADATA_CSS).first();
  }

  /** Lightbox Close control (no data-qa; scoped to the lightbox dialog). */
  async getLightboxClose(): Promise<Locator> {
    return await this.findSmart({
      css: `${LIGHTBOX_CSS} button[aria-label*="close" i]`,
      xpath: `//*[@role="dialog"][.//*[@data-testid="next-image"]]//button[contains(translate(@aria-label,"CLOSE","close"),"close")]`,
      description: 'Lightbox Close button',
    });
  }

  /** Lightbox Download control (no data-qa; scoped to the lightbox dialog). */
  async getLightboxDownload(): Promise<Locator> {
    return await this.findSmart({
      css: `${LIGHTBOX_CSS} button[aria-label*="download" i]`,
      xpath: `//*[@role="dialog"][.//*[@data-testid="next-image"]]//button[contains(translate(@aria-label,"DOWNLOAD","download"),"download")]`,
      description: 'Lightbox Download button',
    });
  }

  /**
   * Open the Lightbox from a card's zoom button and wait for the dialog.
   * Returns the dialog Locator.
   */
  async openLightboxFromCard(card: Locator): Promise<Locator> {
    const zoom = this.getCardZoomButton(card);
    await zoom.scrollIntoViewIfNeeded();
    await zoom.click();
    const dialog = this.page.locator(LIGHTBOX_CSS).first();
    await dialog.waitFor({ state: 'visible', timeout: 10_000 });
    return dialog;
  }
}

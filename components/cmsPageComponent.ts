import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { SmartLocatorOptions } from '../helpers/ai/smartLocator';
import { componentURL } from '../data/componentURL';

export type CmsFieldKind = 'text' | 'textarea' | 'richtext' | 'image';

export interface CmsFieldValue {
  /** Field label as shown in the editor (used as a fallback locator). */
  label: string;
  /** Property name = the input's `name` attribute (most stable locator in the Dojo editor). */
  propertyName?: string;
  kind: CmsFieldKind;
  value: string;
  /** Set false for fields the page template does not render itself (e.g. Teaser text); they are only verified in the CMS. */
  rendersOnFrontend?: boolean;
}

export interface CmsComponentSpec {
  /** Block type tile title, e.g. 'Editorial'. */
  type: string;
  /** Content-area label the block is added to, e.g. 'Large content area'. */
  target: string;
  /** Name given to the created shared block. */
  name: string;
  fields: CmsFieldValue[];
}

export interface CmsPageSpec {
  pageType: string;
  name: string;
  fields: CmsFieldValue[];
  components: CmsComponentSpec[];
}

/**
 * Optimizely CMS page-creation component.
 *
 * DOM Structure (from live inspection; the editor is Dojo + React with NO data-qa/data-testid):
 * - Create (+):        span[role="button"][title="Create content"] -> menu .dijitMenuItem "Create Page"
 * - Create dialog:     input[placeholder="Enter a name"], type tiles [title="<Page type>"],
 *                      button.oui-button--highlight "Create"
 * - Page fields:       input|textarea[name="teaserText" | "metaTitle" | "metaDescription" | ...]
 *                      rich text = iframe[title="Rich Text Area"] (TinyMCE)
 * - Content area:      label text + span[role="button"] "Select Content" -> menu "Create a new Block"
 * - Create Shared Block view: name input + block type cards
 * Dojo ids (uniqName_*, dijit_form_*) are generated per session and are NOT used.
 */
export class CmsPageComponent extends BasePage {
  /** Pages created by THIS instance (one per test); cleanup only ever touches these. */
  readonly createdPages: string[] = [];

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  // ---------- URLs / naming ----------

  /** Pages are RETAINED by default. Cleanup (move to Trash) only runs when CMS_CLEANUP=delete is set explicitly. */
  static get cleanupEnabled(): boolean {
    return (process.env.CMS_CLEANUP ?? 'keep').toLowerCase() === 'delete';
  }

  /** Only pages named like automation output may be deleted by this component. */
  private static readonly DELETABLE_PREFIX = /^QA-Auto/;

  static get urls(): { dashboard: string; publishedBase: string } {
    const data = componentURL.CmsPageComponent.testData;
    return { dashboard: data.url, publishedBase: data.publishedBase };
  }

  /** Unique, easy-to-find name for pages/blocks created by automation. */
  static uniqueName(prefix = 'QA-Auto'): string {
    return `${prefix}-${Date.now()}`;
  }

  /** Published URL = <publishedBase>/<name lower-cased, non-alphanumerics -> '-'>/ (verify per site). */
  static publishedUrl(pageName: string): string {
    const slug = pageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${CmsPageComponent.urls.publishedBase.replace(/\/$/, '')}/${slug}/`;
  }

  // ---------- Waiting helper (findSmart does not wait) ----------

  /** Poll until the smart locator resolves to a visible element, then return it. */
  private async waitSmart(options: SmartLocatorOptions, timeout = 30000): Promise<Locator> {
    await expect
      .poll(async () => this.isVisibleSmart({ ...options, timeout: 500 }), {
        timeout,
        message: `Waiting for ${options.description ?? 'element'}`,
      })
      .toBe(true);
    return this.findSmart(options);
  }

  // ---------- Locators ----------

  private createContentButton = (): SmartLocatorOptions => ({
    title: 'Create content',
    css: 'span[role="button"][title="Create content"]',
    description: 'CMS toolbar Create (+) button',
  });

  private menuItem = (text: string): SmartLocatorOptions => ({
    css: `.dijitMenuItem:has-text("${text}")`,
    role: { role: 'menuitem', name: text },
    text,
    description: `menu item "${text}"`,
  });

  private nameInput = (): SmartLocatorOptions => ({
    placeholder: 'Enter a name',
    css: 'input[placeholder="Enter a name"]',
    id: 'add_layout_name-input',
    description: 'Create dialog name input',
  });

  /** Exact-title regex: tree rows carry titles like "..., (Type: Standard Page)", so a substring title match hits hidden rows. */
  private static exactTitle(value: string): RegExp {
    return new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  }

  private typeTile = (type: string): SmartLocatorOptions => ({
    title: CmsPageComponent.exactTitle(type),
    css: `[title="${type}"]`,
    xpath: `//*[@title="${type}"]`,
    description: `type tile "${type}"`,
  });

  private publishButton = (): SmartLocatorOptions => ({
    css: 'button.oui-button--highlight:has-text("Publish")',
    role: { role: 'button', name: /^Publish/ },
    text: 'Publish',
    description: 'Toolbar Publish button',
  });

  // ---------- Navigation ----------

  async navigateToComponent(): Promise<void> {
    await this.navigateTo(CmsPageComponent.urls.dashboard);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** The dashboard has no Create (+) button; go to the Edit view. */
  async openEditView(): Promise<void> {
    const createVisible = await this.isVisibleSmart({ ...this.createContentButton(), timeout: 1000 });
    if (!createVisible) {
      await this.navigateTo(componentURL.OptimizelyLoginComponent.testData.url);
      await this.page.waitForLoadState('domcontentloaded');
    }
    await this.waitSmart(this.createContentButton());
  }

  // ---------- Create page ----------

  async openCreatePageDialog(): Promise<void> {
    await (await this.waitSmart(this.createContentButton())).click();
    await (await this.waitSmart(this.menuItem('Create Page'))).click();
    await this.waitSmart(this.nameInput());
  }

  async createPage(name: string, pageType: string): Promise<void> {
    await this.openCreatePageDialog();
    await (await this.findSmart(this.nameInput())).fill(name);
    await (await this.waitSmart(this.typeTile(pageType))).click();
    await this.clickSmart({
      css: 'button.oui-button--highlight:has-text("Create")',
      role: { role: 'button', name: /^Create$/ },
      text: 'Create',
      description: 'Create dialog Create button',
    });
    // Register immediately so cleanup still removes the page if a later step fails.
    this.createdPages.push(name);
    await this.verifyPageOpenInEditor(name);
  }

  // ---------- Fields ----------

  /** Visible TinyMCE frame only: the page editor's frame stays in the DOM behind the block view. */
  private readonly richTextFrame = 'iframe[title="Rich Text Area"]:visible';

  private fieldLocator(field: CmsFieldValue): SmartLocatorOptions {
    const tag = field.kind === 'textarea' ? 'textarea' : 'input';
    // Labels in the Dojo editor are not <label> elements, so there is no label strategy (it always missed).
    return {
      css: field.propertyName ? `${tag}[name="${field.propertyName}"]` : undefined,
      xpath: `//*[normalize-space(text())="${field.label}"]/following::${tag}[1]`,
      description: `field "${field.label}"`,
    };
  }

  /**
   * Image picker (live DOM): "Select Image" is a Dojo span[role=button] (the page editor keeps a hidden one
   * behind the block view, so only the visible one is used) -> dialog[role=dialog] with a Search textbox,
   * result rows by file name, and OK.
   */
  private async pickImage(fileName: string): Promise<void> {
    await (
      await this.waitSmart({
        css: 'span[role="button"]:has-text("Select Image"):visible',
        description: 'visible "Select Image" button',
      })
    ).click();
    const search = await this.waitSmart({
      css: 'div[role="dialog"] input[role="textbox"]:visible',
      description: 'image picker search box',
    });
    await search.fill(fileName);
    await (
      await this.waitSmart({
        css: `div[role="dialog"] :text("${fileName}")`,
        text: fileName,
        description: `image "${fileName}" in the picker results`,
      })
    ).click();
    await (
      await this.waitSmart({
        css: 'div[role="dialog"] span[role="button"]:has-text("OK")',
        role: { role: 'button', name: 'OK' },
        description: 'image picker OK button',
      })
    ).click();
    await expect
      .poll(async () => this.page.locator('div[role="dialog"]:visible').count(), {
        timeout: 15000,
        message: 'Image picker should close after OK',
      })
      .toBe(0);
  }

  async setField(field: CmsFieldValue): Promise<void> {
    if (field.kind === 'image') {
      await this.pickImage(field.value);
      return;
    }
    if (field.kind === 'richtext') {
      await this.waitSmart({ css: this.richTextFrame, description: 'rich text editor frame' });
      const body = this.page.frameLocator(this.richTextFrame).first().locator('body');
      await expect(body).toBeVisible({ timeout: 30000 });
      await body.click();
      await body.fill(field.value);
      return;
    }
    const el = await this.waitSmart(this.fieldLocator(field));
    await el.fill(field.value);
    await el.press('Tab'); // commit the Dojo widget value; the editor auto-saves the draft
  }

  async verifyFieldSaved(field: CmsFieldValue): Promise<void> {
    if (field.kind === 'image') {
      return; // image selection is validated on the published page (rendered <img>)
    }
    if (field.kind === 'richtext') {
      const body = this.page.frameLocator(this.richTextFrame).first().locator('body');
      await expect(body).toContainText(field.value);
      return;
    }
    await expect(await this.findSmart(this.fieldLocator(field))).toHaveValue(field.value);
  }

  // ---------- Components (blocks) ----------

  /** Opens the "Select Content" menu of the content area with the given label. */
  private selectContentButton(target: string): SmartLocatorOptions {
    return {
      xpath: `//*[normalize-space(text())="${target}"]/following::span[@role="button"][contains(.,"Select Content")][1]`,
      css: 'span[role="button"]:has-text("Select Content")',
      description: `"Select Content" button of "${target}"`,
    };
  }

  async addComponent(spec: CmsComponentSpec): Promise<void> {
    await (await this.waitSmart(this.selectContentButton(spec.target))).click();
    await (await this.waitSmart(this.menuItem('Create a new Block'))).click();

    // "Create Shared Block" view: name + block-type cards
    const blockName = await this.waitSmart({
      xpath: '(//*[normalize-space(text())="Name"])[last()]/following::input[1]',
      css: 'input:focus',
      description: 'shared block name input',
    });
    await blockName.fill(spec.name);
    await (
      await this.waitSmart({
        xpath: `//li[.//h3[normalize-space()="${spec.type}"]]`,
        role: { role: 'heading', name: spec.type },
        text: spec.type,
        description: `block type card "${spec.type}"`,
      })
    ).click();

    for (const field of spec.fields) {
      await this.setField(field);
    }

    // Confirm the block: the Create button of the "Create Shared Block" view.
    await (
      await this.waitSmart({
        role: { role: 'button', name: /^Create$/ },
        css: 'button:has-text("Create"), span[role="button"]:has-text("Create")',
        text: 'Create',
        description: 'Create Shared Block confirm button',
      })
    ).click();
    // Back on the page editor with the block listed in the content area.
    await this.waitSmart(this.createContentButton(), 45000);
  }

  async verifyComponentInArea(spec: CmsComponentSpec): Promise<void> {
    await expect(
      await this.waitSmart({ text: spec.name, description: `block "${spec.name}" in content area` })
    ).toBeVisible();
  }

  async populatePage(spec: CmsPageSpec): Promise<void> {
    for (const field of spec.fields) {
      await this.setField(field);
    }
    for (const component of spec.components) {
      await this.addComponent(component);
    }
  }

  // ---------- Publish ----------

  /** Publishing is two clicks: the toolbar Publish opens a panel; the panel's own Publish confirms. */
  async publish(): Promise<void> {
    await (await this.waitSmart(this.publishButton())).click();
    await (
      await this.waitSmart({
        // Live DOM: the panel's Publish is a Dojo span[role=button] inside an <li>; the toolbar one sits in .edit-action-panel.
        css: 'li span[role="button"]:has-text("Publish")',
        xpath: '//li//span[@role="button"][contains(., "Publish")]',
        description: 'publish panel Publish button',
      })
    ).click();
  }

  // ---------- Verification ----------

  /** CMS layer: after publishing, the toolbar Publish button is replaced by "Options" only. */
  async verifyPublishedInCms(): Promise<void> {
    await expect
      .poll(async () => this.page.getByRole('button', { name: /^Publish/ }).count(), {
        timeout: 30000,
        message: 'Toolbar Publish button should disappear once the page is published',
      })
      .toBe(0);
    // Guard against a false pass: the editor toolbar must still be rendered.
    expect(await this.isVisibleSmart({ text: 'Options', description: 'toolbar Options button' })).toBe(true);
  }

  async verifyPageOpenInEditor(name: string): Promise<void> {
    const header = await this.waitSmart({
      // No `title` strategy: it resolves first to a hidden node (tree row / preview) and forces a fallback every time.
      css: `.content-info-name span.title[title="${name}"]`,
      xpath: `//span[contains(@class,"title")][@title="${name}"]`,
      description: `editor header for page "${name}"`,
      timeout: 5000,
    }, 45000);
    await expect(header).toBeVisible();
  }

  /** Page and content are live: URL returns 200 and shows the page name and entered values. */
  async verifyPublishedOnFrontend(spec: CmsPageSpec): Promise<void> {
    const url = CmsPageComponent.publishedUrl(spec.name);
    await expect
      .poll(async () => (await this.page.request.get(url)).status(), {
        timeout: 60000,
        message: `Published URL ${url} should return 200`,
      })
      .toBe(200);

    await this.navigateTo(url);
    await expect(this.page.locator('body')).toContainText(spec.name, { ignoreCase: true });
    const entered = [...spec.fields, ...spec.components.flatMap((c) => c.fields)].filter(
      (f) => f.rendersOnFrontend !== false && f.kind !== 'image'
    );
    for (const field of entered) {
      await expect(this.page.locator('body')).toContainText(field.value);
    }

    // Images: the site header uses the same logo, so tie each image to its block via the block's first text value.
    for (const component of spec.components) {
      const image = component.fields.find((f) => f.kind === 'image');
      const anchor = component.fields.find((f) => f.kind !== 'image' && f.kind !== 'richtext');
      if (!image || !anchor) continue;
      const stem = image.value.replace(/\.[a-z0-9]+$/i, '');
      const img = this.page
        .locator(`xpath=//*[contains(normalize-space(text()), "${anchor.value}")]/ancestor::*[.//img][1]//img`)
        .first();
      await expect(img, `image of block "${component.name}"`).toBeVisible();
      await expect(img).toHaveAttribute('src', new RegExp(stem, 'i'));
      expect(
        await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0),
        `image "${image.value}" should load without error`
      ).toBe(true);
    }
  }

  // ---------- Cleanup ----------

  private treeRow = (name: string): SmartLocatorOptions => ({
    title: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},`),
    css: `div.dijitTreeRow[title^="${name},"]`,
    xpath: `//div[contains(@class,"dijitTreeRow")][starts-with(@title,"${name},")]`,
    description: `content tree row "${name}"`,
    timeout: 1000,
  });

  /**
   * Moves ONE automation-created page to the CMS Trash (recoverable from the Wastebasket).
   * Refuses any page whose name does not start with "QA-Auto".
   * Flow (live DOM): navigation pane -> tree row -> hover -> span.epi-iconContextMenu -> "Move to Trash" -> confirm dialog.
   */
  async deletePage(name: string): Promise<void> {
    if (!CmsPageComponent.DELETABLE_PREFIX.test(name)) {
      throw new Error(`Refusing to delete "${name}": only pages named "QA-Auto*" may be removed by automation.`);
    }
    await this.openEditView();

    if (!(await this.isVisibleSmart(this.treeRow(name)))) {
      await this.clickSmart({
        css: 'span[role="button"][title="Toggle navigation pane"]',
        title: 'Toggle navigation pane',
        description: 'Toggle navigation pane button',
      });
    }
    const row = await this.waitSmart(this.treeRow(name), 20000);
    await row.hover();
    // The menu icon is positioned off-screen until Dojo lays it out; a dispatched click triggers its Dojo handler.
    await row.locator('span.epi-iconContextMenu').first().dispatchEvent('click');
    await (
      await this.waitSmart({
        css: '.dijitMenuItem:has-text("Move to Trash"):visible',
        xpath: '//*[contains(@class,"dijitMenuItem")][contains(.,"Move to Trash")]',
        description: 'tree menu "Move to Trash"',
      })
    ).click();

    const dialog = this.page.locator('div[role="dialog"]:visible');
    await expect(dialog).toContainText(name); // the confirmation must name exactly this page
    await (
      await this.waitSmart({
        css: 'div[role="dialog"] span[role="button"]:has-text("Move to Trash")',
        description: 'confirm dialog "Move to Trash" button',
      })
    ).click();

    await expect
      .poll(async () => this.isVisibleSmart(this.treeRow(name)), {
        timeout: 30000,
        message: `Page "${name}" should disappear from the content tree`,
      })
      .toBe(false);
  }

  /** Deletes every page this instance created (unless CMS_CLEANUP=keep). Never throws: leftovers are returned by name. */
  async cleanupCreatedPages(): Promise<{ deleted: string[]; leftovers: string[] }> {
    const result = { deleted: [] as string[], leftovers: [] as string[] };
    if (!CmsPageComponent.cleanupEnabled) {
      result.leftovers.push(...this.createdPages);
      return result;
    }
    for (const name of this.createdPages) {
      try {
        await this.deletePage(name);
        result.deleted.push(name);
      } catch (error) {
        console.warn(`Cleanup failed for "${name}": ${(error as Error).message.split('\n')[0]}`);
        result.leftovers.push(name);
      }
    }
    return result;
  }
}

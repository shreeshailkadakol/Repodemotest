import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import { BasePage } from '../helpers/utils/basePage';

dotenv.config();

/**
 * Optimizely CMS admin login component.
 *
 * DOM Structure (from live inspection, no data-qa/data-testid exist on this page):
 * <div id="LoginControl" class="js-login-wrapper login-wrapper">
 *   <form>
 *     <input id="UserName" name="UserName" type="text" />
 *     <input id="Password" name="Password" type="password" />
 *     <input id="Submit" name="Submit" type="submit" />
 *   </form>
 *   <div class="text--error">...</div>   (only after a failed login)
 * </div>
 * Authenticated: URL /optimizely/cms#context=..., <div id="epi-navigation-root">
 */
export class OptimizelyLoginComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /** Credentials come from .env (OPTIMIZELY_CMS_USERNAME / OPTIMIZELY_CMS_PASSWORD) - never hardcoded. */
  static get credentials(): { username: string; password: string } {
    const username = process.env.OPTIMIZELY_CMS_USERNAME;
    const password = process.env.OPTIMIZELY_CMS_PASSWORD;
    if (!username || !password) {
      throw new Error('Set OPTIMIZELY_CMS_USERNAME and OPTIMIZELY_CMS_PASSWORD in .env');
    }
    return { username, password };
  }

  async navigateToComponent(): Promise<void> {
    const url = await this.getComponentUrl('OptimizelyLoginComponent', '');
    await this.navigateTo(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getUsernameField(): Promise<Locator> {
    return this.findSmart({
      id: 'UserName',
      label: 'Name',
      css: 'input[name="UserName"]',
      description: 'Optimizely login username field',
    });
  }

  async getPasswordField(): Promise<Locator> {
    return this.findSmart({
      id: 'Password',
      css: 'input[name="Password"]',
      description: 'Optimizely login password field',
    });
  }

  async getSubmitButton(): Promise<Locator> {
    return this.findSmart({
      id: 'Submit',
      css: 'input[name="Submit"]',
      description: 'Optimizely login submit button',
    });
  }

  async getErrorMessage(): Promise<Locator> {
    return this.findSmart({
      css: '#LoginControl .text--error',
      description: 'Optimizely login error message',
      timeout: 5000,
    });
  }

  async getCmsNavigation(): Promise<Locator> {
    return this.findSmart({
      id: 'epi-navigation-root',
      css: '#epi-navigation-root',
      description: 'Optimizely CMS navigation',
      timeout: 30000,
    });
  }

  async login(username: string, password: string): Promise<void> {
    if (username) {
      await this.fillSmart(
        { id: 'UserName', css: 'input[name="UserName"]', description: 'Optimizely login username field' },
        username
      );
    }
    if (password) {
      await this.fillSmart(
        { id: 'Password', css: 'input[name="Password"]', description: 'Optimizely login password field' },
        password
      );
    }
    await this.clickSmart({
      id: 'Submit',
      css: 'input[name="Submit"]',
      description: 'Optimizely login submit button',
    });
  }

  async verifyUiAvailability(): Promise<void> {
    for (const getField of [
      () => this.getUsernameField(),
      () => this.getPasswordField(),
      () => this.getSubmitButton(),
    ]) {
      const el = await getField();
      await expect.soft(el).toBeVisible();
      await expect.soft(el).toBeEnabled();
    }
  }

  async verifyLoggedIn(): Promise<void> {
    await expect.soft(this.page).toHaveURL(/\/optimizely\/cms/);
    expect.soft(this.page.url()).not.toContain('/Util/Login');
    await expect.soft(await this.getCmsNavigation()).toBeVisible();
  }

  async verifyOnLoginPage(): Promise<void> {
    expect.soft(this.page.url()).toContain('/Util/Login');
    await expect.soft(await this.getSubmitButton()).toBeVisible();
  }

  async verifyLoginFailed(): Promise<void> {
    await expect.soft(await this.getErrorMessage()).toBeVisible();
    await this.verifyOnLoginPage();
  }
}

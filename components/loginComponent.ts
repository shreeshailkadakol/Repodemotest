import { Page, Browser, BrowserContext, Locator, expect } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

/**
 * SauceDemo Login component.
 *
 * DOM Structure (from live inspection):
 * <div data-test="login-container">
 *   <input data-test="username" id="user-name" placeholder="Username" type="text" />
 *   <input data-test="password" id="password" placeholder="Password" type="password" />
 *   <input data-test="login-button" id="login-button" type="submit" />
 *   <h3 data-test="error">...</h3>   (only after a failed login)
 * </div>
 */
export class LoginComponent extends BasePage {
  static readonly VALID_PASSWORD = 'secret_sauce';

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  async navigateToComponent(): Promise<void> {
    const url = await this.getComponentUrl('LoginComponent', envUtils.getBaseUrl());
    await this.navigateTo(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getUsernameField(): Promise<Locator> {
    return await this.findSmart({
      dataQa: 'username',
      testId: 'username',
      dataTest: 'username',
      placeholder: 'Username',
      id: 'user-name',
      css: 'input[data-test="username"]',
      description: 'Login username field',
    });
  }

  async getPasswordField(): Promise<Locator> {
    return await this.findSmart({
      dataTest: 'password',
      placeholder: 'Password',
      id: 'password',
      css: 'input[data-test="password"]',
      description: 'Login password field',
    });
  }

  async getLoginButton(): Promise<Locator> {
    return await this.findSmart({
      dataTest: 'login-button',
      role: { role: 'button', name: /login/i },
      id: 'login-button',
      css: 'input[data-test="login-button"]',
      description: 'Login button',
    });
  }

  async getErrorMessage(): Promise<Locator> {
    return await this.findSmart({
      dataTest: 'error',
      css: '[data-test="error"]',
      xpath: '//*[@data-test="error"]',
      description: 'Login error message',
      timeout: 5000,
    });
  }

  async getInventoryList(): Promise<Locator> {
    return await this.findSmart({
      dataTest: 'inventory-list',
      css: '[data-test="inventory-list"]',
      xpath: '//*[@data-test="inventory-list"]',
      description: 'Inventory product list',
      timeout: 5000,
    });
  }

  async login(username: string, password: string): Promise<void> {
    if (username) {
      await this.fillSmart(
        {
          dataTest: 'username',
          placeholder: 'Username',
          id: 'user-name',
          css: 'input[data-test="username"]',
          description: 'Login username field',
        },
        username
      );
    }
    if (password) {
      await this.fillSmart(
        {
          dataTest: 'password',
          placeholder: 'Password',
          id: 'password',
          css: 'input[data-test="password"]',
          description: 'Login password field',
        },
        password
      );
    }
    await this.clickSmart({
      dataTest: 'login-button',
      role: { role: 'button', name: /login/i },
      id: 'login-button',
      css: 'input[data-test="login-button"]',
      description: 'Login button',
    });
  }

  async verifyUiAvailability(): Promise<void> {
    for (const getField of [
      () => this.getUsernameField(),
      () => this.getPasswordField(),
      () => this.getLoginButton(),
    ]) {
      const el = await getField();
      await expect.soft(el).toBeVisible();
      await expect.soft(el).toBeEnabled();
    }
  }

  async verifyOnLoginPage(): Promise<void> {
    expect.soft(this.page.url()).not.toContain('inventory');
    await expect.soft(await this.getLoginButton()).toBeVisible();
  }

  async verifyError(expected: RegExp): Promise<void> {
    const error = await this.getErrorMessage();
    await expect.soft(error).toBeVisible();
    await expect.soft(error).toHaveText(expected);
  }
}

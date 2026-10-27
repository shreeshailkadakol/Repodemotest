import { Browser, BrowserContext, expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';
import { envUtils } from '../helpers/utils/envUtils';

export class RegisterComponent extends BasePage {
  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  async navigateToComponent(): Promise<void> {
    const url = await this.getComponentUrl('RegisterComponent', envUtils.getBaseUrl());
    await this.navigateTo(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getRegistrationForm(): Promise<Locator> {
    return await this.findSmart({
      css: 'form#create_customer',
      xpath: '//form[@id="create_customer"]',
      description: 'Customer registration form',
    });
  }

  async getHeading(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'heading', name: /create account/i },
      text: /create account/i,
      css: 'h1',
      xpath: '//h1',
      description: 'Create account heading',
    });
  }

  async getFirstNameField(): Promise<Locator> {
    return await this.findSmart({
      css: 'form#create_customer input[name="customer[first_name]"]',
      xpath: '//form[@id="create_customer"]//input[@name="customer[first_name]"]',
      description: 'Registration first name field',
    });
  }

  async getLastNameField(): Promise<Locator> {
    return await this.findSmart({
      css: 'form#create_customer input[name="customer[last_name]"]',
      xpath: '//form[@id="create_customer"]//input[@name="customer[last_name]"]',
      description: 'Registration last name field',
    });
  }

  async getEmailField(): Promise<Locator> {
    return await this.findSmart({
      css: 'form#create_customer input[name="customer[email]"]',
      xpath: '//form[@id="create_customer"]//input[@name="customer[email]"]',
      description: 'Registration email field',
    });
  }

  async getPasswordField(): Promise<Locator> {
    return await this.findSmart({
      css: 'form#create_customer input[name="customer[password]"]',
      xpath: '//form[@id="create_customer"]//input[@name="customer[password]"]',
      description: 'Registration password field',
    });
  }

  async getCreateButton(): Promise<Locator> {
    return await this.findSmart({
      role: { role: 'button', name: /create/i },
      css: 'form#create_customer input[type="submit"][value="Create"]',
      xpath: '//form[@id="create_customer"]//input[@type="submit"]',
      description: 'Create account button',
    });
  }

  async verifyFormAvailability(): Promise<void> {
    const controls = [
      await this.getHeading(),
      await this.getFirstNameField(),
      await this.getLastNameField(),
      await this.getEmailField(),
      await this.getPasswordField(),
      await this.getCreateButton(),
    ];

    for (const control of controls) {
      await expect.soft(control).toBeVisible();
      await expect.soft(control).toBeEnabled();
    }
  }

  async verifyFieldTypes(): Promise<void> {
    await expect.soft(await this.getFirstNameField()).toHaveAttribute('type', 'text');
    await expect.soft(await this.getLastNameField()).toHaveAttribute('type', 'text');
    await expect.soft(await this.getEmailField()).toHaveAttribute('type', 'email');
    await expect.soft(await this.getPasswordField()).toHaveAttribute('type', 'password');
  }

  async verifyInvalidEmailIsRejected(email: string): Promise<void> {
    const emailField = await this.getEmailField();
    await this.fillSmart(
      {
        css: 'form#create_customer input[name="customer[email]"]',
        xpath: '//form[@id="create_customer"]//input[@name="customer[email]"]',
        description: 'Registration email field',
      },
      email
    );

    const isInvalid = await emailField.evaluate(
      (element: HTMLInputElement) => element.validity.typeMismatch && !element.validity.valid
    );
    expect.soft(isInvalid).toBe(true);
  }

  async hasNoHorizontalOverflow(): Promise<boolean> {
    return await this.page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
    );
  }

  async getDomContentLoadedTime(): Promise<number> {
    return await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as
        | PerformanceNavigationTiming
        | undefined;
      return navigation ? navigation.domContentLoadedEventEnd - navigation.startTime : 0;
    });
  }
}

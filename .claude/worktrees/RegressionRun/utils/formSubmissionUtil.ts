/**
 * Component Mapper - Form Submission Utility
 * What:
 *   Generic helper for navigation, field population, submission, and success
 *   validation for region-based contact form tests.
 * Why:
 *   Created to keep form automation reusable and reduce duplicated interaction
 *   code across form submission specs.
 */

import { Page, Locator } from '@playwright/test';
import { FormConfig, FormFieldConfig } from '../config/formConfigs';

export class FormSubmissionUtil {
  private readonly page: Page;
  private readonly formConfig: FormConfig;
  private readonly logger: (message: string) => void;

  constructor(page: Page, formConfig: FormConfig, customLogger?: (message: string) => void) {
    this.page = page;
    this.formConfig = formConfig;
    this.logger = customLogger || console.log;
  }

  /**
   * Main function to fill and submit form
   */
  async fillAndSubmitForm(): Promise<void> {
    await this.handleAuthentication();
    await this.navigateToForm();
    await this.handleCookieBanner();
    await this.fillFormFields();
    await this.submitForm();
    await this.validateSuccess();
  }

  /**
   * Navigate to form URL
   */
  private async navigateToForm(): Promise<void> {
    this.logger(`Navigating to ${this.formConfig.formName} at ${this.formConfig.url}`);
    
    try {
      await this.page.goto(this.formConfig.url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      this.logger(`Successfully navigated to form`);
    } catch (error) {
      this.logger(`Navigation failed: ${error}`);
      throw new Error(`Failed to navigate to ${this.formConfig.url}`);
    }
  }

  /**
   * Handle HTTP Basic Authentication if present
   */
  private async handleAuthentication(): Promise<void> {
    const authPassword = process.env.AUTH_PASSWORD || 'beyond2026';
    
    try {
      const context = this.page.context();
      // Note: setHTTPCredentials is deprecated but still functional
      await context.setHTTPCredentials({
        username: 'bayercorp',
        password: authPassword
      });
      this.logger(`Authentication credentials set`);
    } catch (error) {
      this.logger(`Warning: Authentication setup failed (may not be needed): ${String(error)}`);
    }
  }

  /**
   * Handle cookie consent banner
   */
  private async handleCookieBanner(): Promise<void> {
    try {
      // Wait a moment for cookie banner to appear
      await this.page.waitForTimeout(1000);
      
      // Try multiple strategies to find and accept cookie banner
      const cookieSelectors = [
        // Role-based selectors
        this.page.getByRole('button', { name: /accept cookies/i }),
        this.page.getByRole('button', { name: /accept all/i }),
        // Text-based selectors
        this.page.getByText('ACCEPT COOKIES', { exact: true }),
        this.page.getByText('Accept Cookies'),
        this.page.getByText('Accept All'),
        // CSS selectors as fallback
        this.page.locator('button:has-text("ACCEPT COOKIES")'),
        this.page.locator('button:has-text("Accept")').filter({ hasText: /cookie/i })
      ];
      
      for (const selector of cookieSelectors) {
        try {
          if (await selector.isVisible({ timeout: 2000 }).catch(() => false)) {
            await selector.click();
            this.logger(`Cookie consent accepted`);
            // Wait for cookie banner to disappear
            await this.page.waitForTimeout(1000);
            return;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      this.logger(`Warning: No cookie banner found or already handled`);
    } catch (error) {
      this.logger(`Warning: Cookie banner handling skipped: ${String(error)}`);
    }
  }

  /**
   * Fill all form fields dynamically
   */
  private async fillFormFields(): Promise<void> {
    this.logger(`Starting to fill form fields...`);
    
    for (const [fieldName, fieldConfig] of Object.entries(this.formConfig.fields)) {
      await this.fillField(fieldName, fieldConfig);
    }
    
    this.logger(`All form fields filled successfully`);
  }

  /**
   * Fill a single field based on its configuration
   */
  private async fillField(fieldName: string, fieldConfig: FormFieldConfig): Promise<void> {
    const isOptional = this.formConfig.optionalFields?.includes(fieldName);
    
    try {
      const locator = await this.findFieldLocator(fieldConfig);
      
      // Check if field exists and is visible
      const isVisible = await locator.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (!isVisible) {
        if (!isOptional && fieldConfig.required) {
          this.logger(`Warning: Required field "${fieldName}" not found!`);
          throw new Error(`Required field "${fieldName}" is not visible`);
        } else {
          this.logger(`Optional field "${fieldName}" not present, skipping`);
          return;
        }
      }

      // Fill field based on type
      switch (fieldConfig.type) {
        case 'text':
        case 'email':
        case 'tel':
          // Check if it's a combobox widget (custom dropdown)
          if (fieldConfig.role === 'combobox') {
            await this.fillCombobox(locator, fieldName, fieldConfig.value);
          } else {
            await this.fillTextInput(locator, fieldName, fieldConfig.value);
          }
          break;
          
        case 'textarea':
          await this.fillTextInput(locator, fieldName, fieldConfig.value);
          break;
          
        case 'select':
          await this.fillSelect(locator, fieldName, fieldConfig.value);
          break;
          
        case 'checkbox':
          await this.fillCheckbox(locator, fieldName);
          break;
          
        case 'radio':
          await this.fillRadio(locator, fieldName);
          break;
          
        default:
          this.logger(`Warning: Unknown field type for "${fieldName}"`);
      }
      
    } catch (error) {
      if (!isOptional && fieldConfig.required) {
        this.logger(`Failed to fill required field "${fieldName}": ${error}`);
        throw error;
      } else {
        this.logger(`Warning: Failed to fill optional field "${fieldName}", continuing...`);
      }
    }
  }

  /**
   * Find field locator using multiple strategies
   */
  private async findFieldLocator(fieldConfig: FormFieldConfig): Promise<Locator> {
    // For radio, checkbox, and combobox with role, prioritize CSS selector (more reliable for these types)
    if ((fieldConfig.type === 'radio' || fieldConfig.type === 'checkbox' || fieldConfig.role === 'combobox') && fieldConfig.selector) {
      const locator = this.page.locator(fieldConfig.selector).first();
      if (await locator.count() > 0) return locator;
    }
    
    // Try role-based locator first (most reliable for other types)
    if (fieldConfig.role && fieldConfig.label) {
      try {
        const labelPattern = fieldConfig.label instanceof RegExp ? fieldConfig.label: new RegExp(fieldConfig.label, 'i');
        const locator = this.page.getByRole(fieldConfig.role as any, { 
          name: labelPattern 
        });
        if (await locator.count() > 0) return locator;
      } catch {}
    }

    // Try label-based locator
    if (fieldConfig.label) {
      try {
        const labelPattern = fieldConfig.label instanceof RegExp ? fieldConfig.label : new RegExp(fieldConfig.label, 'i');
        const locator = this.page.getByLabel(labelPattern);
        if (await locator.count() > 0) return locator;
      } catch {}
    }

    // Try placeholder
    if (fieldConfig.placeholder) {
      try {
        const locator = this.page.getByPlaceholder(new RegExp(fieldConfig.placeholder, 'i'));
        if (await locator.count() > 0) return locator;
      } catch {}
    }

    // Try test ID
    if (fieldConfig.testId) {
      try {
        const locator = this.page.getByTestId(fieldConfig.testId);
        if (await locator.count() > 0) return locator;
      } catch {}
    }

    // Fallback to CSS selector
    if (fieldConfig.selector) {
      return this.page.locator(fieldConfig.selector).first();
    }

    throw new Error(`Could not find locator for field`);
  }

  /**
   * Fill text input field
   */
  private async fillTextInput(locator: Locator, fieldName: string, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    await locator.clear();
    await locator.fill(value);
    this.logger(`Filled "${fieldName}" with "${value}"`);
    
    // Verify value was set
    const currentValue = await locator.inputValue();
    if (currentValue !== value) {
      this.logger(`Warning: Value verification failed for "${fieldName}"`);
    }
  }

  /**
   * Fill select dropdown
   */
  private async fillSelect(locator: Locator, fieldName: string, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    
    try {
      // Try selecting by value
      await locator.selectOption({ label: value });
      this.logger(`Selected "${value}" for "${fieldName}"`);
    } catch {
      try {
        // Try selecting by text (case-insensitive)
        await locator.selectOption({ label: new RegExp(value, 'i') } as any);
        this.logger(`Selected "${value}" for "${fieldName}" (regex match)`);
      } catch {
        // Last resort: select by index (first non-empty option)
        await locator.selectOption({ index: 1 });
        this.logger(`Warning: Selected by index for "${fieldName}"`);
      }
    }
  }

  /**
   * Fill checkbox
   */
  private async fillCheckbox(locator: Locator, fieldName: string): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    
    const isChecked = await locator.isChecked();
    if (isChecked) {
      this.logger(`"${fieldName}" already checked`);
    } else {
      await locator.check();
      this.logger(`Checked "${fieldName}"`);
    }
  }

  /**
   * Fill radio button
   */
  private async fillRadio(locator: Locator, fieldName: string): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    await locator.check();
    this.logger(`Selected radio "${fieldName}"`);
  }

  /**
   * Fill custom combobox widget (readonly input with dropdown)
   */
  private async fillCombobox(locator: Locator, fieldName: string, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    
    // Click the combobox to open dropdown
    await locator.click();
    this.logger(`Opened combobox for "${fieldName}"`);
    
    // Wait for dropdown to appear
    await this.page.waitForTimeout(500);
    
    // Try multiple strategies to find and click the option
    try {
      // Strategy 1: Look for option by exact text
      const option = this.page.locator(`[role="option"]:has-text("${value}")`).first();
      if (await option.isVisible({ timeout: 2000 })) {
        await option.click();
        this.logger(`Selected "${value}" for "${fieldName}"`);
        return;
      }
    } catch {}
    
    try {
      // Strategy 2: Look for option by partial text match
      const option = this.page.getByRole('option', { name: new RegExp(value, 'i') }).first();
      if (await option.isVisible({ timeout: 2000 })) {
        await option.click();
        this.logger(`Selected "${value}" for "${fieldName}" (regex match)`);
        return;
      }
    } catch {}
    
    try {
      // Strategy 3: Look for any li or button containing the text
      const option = this.page.locator(`li:has-text("${value}"), button:has-text("${value}")`).first();
      if (await option.isVisible({ timeout: 2000 })) {
        await option.click();
        this.logger(`Selected "${value}" for "${fieldName}" (fallback)`);
        return;
      }
    } catch {}
    
    // Strategy 4: Just click the first available option if value not found
    try {
      const firstOption = this.page.locator('[role="option"]').first();
      if (await firstOption.isVisible({ timeout: 1000 })) {
        await firstOption.click();
        this.logger(`Warning: Selected first option for "${fieldName}" (value "${value}" not found)`);
        return;
      }
    } catch {}
    
    this.logger(`Warning: Could not select value for combobox "${fieldName}"`);
  }

  /**
   * Submit the form
   */
  private async submitForm(): Promise<void> {
    this.logger(`Submitting form...`);
    
    // Wait before submit if configured
    if (this.formConfig.preSubmitWait) {
      await this.page.waitForTimeout(this.formConfig.preSubmitWait);
    }

    // Handle cookie banner again before clicking submit
    await this.handleCookieBanner();

    try {
      const submitButton = await this.findSubmitButton();
      
      // Ensure button is visible and enabled
      await submitButton.waitFor({ state: 'visible', timeout: 5000 });
      
      const isEnabled = await submitButton.isEnabled();
      if (!isEnabled) {
        this.logger(`Warning: Submit button is disabled, waiting...`);
        await this.page.waitForTimeout(2000);
      }

      // Click submit and wait for navigation/response
      await Promise.all([
        this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {}),
        submitButton.click()
      ]);
      
      this.logger(`Form submitted`);
      
      // Wait after submit if configured
      if (this.formConfig.postSubmitWait) {
        await this.page.waitForTimeout(this.formConfig.postSubmitWait);
      }
      
    } catch (error) {
      this.logger(`Form submission failed: ${error}`);
      throw new Error(`Failed to submit form: ${error}`);
    }
  }

  /**
   * Find submit button using multiple strategies (public for reuse by validation tests).
   * Language-agnostic: uses the per-config submitButton (selector/role/text/testId), so each
   * site/language supplies its own identifiers — no hardcoded button text.
   */
  async getSubmitButton(): Promise<Locator> {
    return this.findSubmitButton();
  }

  /**
   * Find submit button using multiple strategies
   */
  private async findSubmitButton(): Promise<Locator> {
    const config = this.formConfig.submitButton;

    // Try role with text
    if (config.role && config.text) {
      try {
        const locator = this.page.getByRole(config.role as any, { name: config.text });
        if (await locator.count() > 0) return locator;
      } catch {}
    }

    // Try test ID
    if (config.testId) {
      try {
        const locator = this.page.getByTestId(config.testId);
        if (await locator.count() > 0) return locator;
      } catch {}
    }

    // Try selector
    if (config.selector) {
      const locator = this.page.locator(config.selector);
      if (await locator.count() > 0) return locator;
    }

    // Fallback: find any submit button
    const fallbackLocator = this.page.locator('button[type="submit"]').first();
    if (await fallbackLocator.count() > 0) return fallbackLocator;

    throw new Error('Could not find submit button');
  }

  /**
   * Validate form submission success
   */
  private async validateSuccess(): Promise<void> {
    this.logger(`Validating form submission success...`);
    
    // Handle cookie banner again in case it reappears after submission
    await this.handleCookieBanner();
    
    const validation = this.formConfig.successValidation;
    const timeout = validation.timeout || 10000;

    try {
      switch (validation.type) {
        case 'message':
          await this.validateSuccessMessage(validation.selector!, validation.text, timeout);
          break;
          
        case 'url':
          await this.validateSuccessURL(validation.urlPattern!, timeout);
          break;
          
        case 'element':
          await this.validateSuccessElement(validation.selector!, timeout);
          break;
          
        default:
          throw new Error(`Unknown validation type: ${validation.type}`);
      }
      
      this.logger(`Form submission validated successfully!`);
    } catch (error) {
      this.logger(`Success validation failed: ${error}`);
      throw new Error(`Form submission validation failed: ${error}`);
    }
  }

  /**
   * Validate success message
   */
  private async validateSuccessMessage(
    selector: string, 
    textPattern?: RegExp | string, 
    timeout: number = 10000
  ): Promise<void> {
    // Try the provided selector
    const locator = this.page.locator(selector).first();
    await locator.waitFor({ state: 'visible', timeout });
    this.logger(`Success message validated via selector`);
  }

  /**
   * Validate success URL
   */
  private async validateSuccessURL(urlPattern: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForURL(new RegExp(urlPattern, 'i'), { timeout });
    this.logger(`Success URL validated`);
  }

  /**
   * Validate success element
   */
  private async validateSuccessElement(selector: string, timeout: number = 10000): Promise<void> {
    const locator = this.page.locator(selector).first();
    await locator.waitFor({ state: 'visible', timeout });
    this.logger(`Success element validated`);
  }

  /**
   * Take screenshot (useful for debugging)
   */
  async takeScreenshot(name: string): Promise<void> {
    const screenshotPath = `./screenshots/${this.formConfig.region}_${name}_${Date.now()}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    this.logger(`Screenshot saved: ${screenshotPath}`);
  }

  /**
   * Get form submission summary
   */
  getFormSummary(): string {
    return `Form: ${this.formConfig.formName} (${this.formConfig.region}) - URL: ${this.formConfig.url}`;
  }
}

/**
 * Standalone helper function for simple use cases
 */
export async function fillAndSubmitForm(page: Page, formConfig: FormConfig): Promise<void> {
  const util = new FormSubmissionUtil(page, formConfig);
  await util.fillAndSubmitForm();
}

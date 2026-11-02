/* global window, document, process, console, __dirname, getComputedStyle */
import { Page, Locator, Browser, BrowserContext, expect, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import percySnapshot from '@percy/playwright';
import * as XLSX from 'xlsx';
import csv from 'csv-parser';
import { componentURL } from '../../test-data/componentURL';
import AxeBuilder from '@axe-core/playwright';
import { smartLocator, SmartLocatorOptions } from '../ai/smartLocator';
import { envUtils } from './envUtils';
interface Config {
  [key: string]: unknown;
}

/**
 * Generic design typography token used by assertTypography. Component-specific
 * Figma token shapes (e.g. FigmaTextTokens) are structurally compatible with this.
 */
export interface TypographyExpectation {
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textCase?: string;
  color?: string;
}

// This is a base page class that can be extended by other page classes.

export class BasePage {
  protected page: Page;
  protected browser: Browser;
  protected context: BrowserContext;
  // Configuration object to hold environment-specific settings
  protected config: Config = {};
  private readonly initialURL: string = '';

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    this.page = page;
    this.browser = browser;
    this.context = context;
  }

  // Create a new context (optionally using a storage state file)
  async createContext(storageStatePath?: string): Promise<void> {
    this.context = await this.browser.newContext(
      storageStatePath ? { storageState: storageStatePath } : {}
    );
    this.page = await this.context.newPage();
  }

  /**
   * Returns full URL for a component based on baseURL + component path
   * Supports environment-specific URLs (e.g., prod_in, prod_au)
   */
  async getComponentUrl(
    componentName: keyof typeof componentURL,
    baseURL: string
  ): Promise<string> {
    const testData = componentURL[componentName]?.testData as any;

    if (!testData) {
      throw new Error(
        `Test data for component ${String(componentName)} not defined in componentURLs.ts`
      );
    }

    // Check for environment-specific override first (e.g., prod_tw, prod_conosur)
    const env = process.env.TEST_ENV || 'qa';
    const envOverride = testData[env];

    // Use environment-specific path if available, otherwise use default url
    const componentPath = envOverride || testData.url;

    if (!componentPath) {
      throw new Error(`URL for component ${String(componentName)} not defined in componentURLs.ts`);
    }

    // Handle homepage case: '/' means the market's LOCALIZED homepage.
    // Resolve it through the {locale} token so markets whose base URL omits the
    // locale (e.g. India `www.bayer.in/`) still land on `/<locale>`, while
    // markets whose base URL already includes the locale collapse the duplicate
    // boundary segment (no change for UK/Kultur/Japan etc.).
    if (componentPath === '/') {
      return this.buildComponentUrl(baseURL, '{locale}');
    }

    return this.buildComponentUrl(baseURL, componentPath);
  }

  /**
   * Resolves a component path against the base URL, in a market-aware way:
   *   1. Substitutes the `{locale}` token with the current market's locale
   *      segment (e.g. en-gb / en-in / en) from envUtils.getLocalePath().
   *   2. Joins base + path while collapsing a duplicated locale segment at the
   *      boundary, so a base that already contains the locale (e.g. Kultur
   *      `.../en/`) does not produce `/en/en`.
   */
  private buildComponentUrl(baseURL: string, componentPath: string): string {
    const locale = envUtils.getLocalePath();
    const resolvedPath = componentPath.replace(/\{locale\}/g, locale);

    const trimmedBase = baseURL.replace(/\/+$/, '');
    const trimmedPath = resolvedPath.replace(/^\/+/, '');
    if (trimmedPath === '') {
      return trimmedBase;
    }

    const baseSegments = trimmedBase.split('/');
    const pathSegments = trimmedPath.split('/');

    // Collapse a duplicated boundary segment (e.g. base `.../en` + path `en/...`)
    if (baseSegments[baseSegments.length - 1].toLowerCase() === pathSegments[0].toLowerCase()) {
      pathSegments.shift();
    }

    return [trimmedBase, ...pathSegments].join('/');
  }

  /**
   * Returns the list of candidate URLs to try for a component, in priority order:
   *   1. testData[currentEnv]   (environment-specific — e.g. prod_in, prod_au)
   *   2. testData.url           (primary — e.g. localized homepage on prod)
   *   3. testData.fallbackUrls  (e.g. dedicated QA test page on pre-prod/QA)
   *
   * Use this when a component may live in different locations across environments
   * (e.g. NewsList on prod homepage vs. on a QA test page on pre-prod).
   */
  async getComponentUrlsWithFallback(
    componentName: keyof typeof componentURL,
    baseURL: string
  ): Promise<string[]> {
    const testData = (componentURL[componentName]?.testData as any) ?? {};
    const currentEnv = process.env.TEST_ENV ?? 'qa';

    // Check for environment-specific URL first (e.g., prod_in, prod_au)
    const envSpecific: string | undefined = testData[currentEnv];
    const primary: string | undefined = testData.url;
    const fallbacks: string[] = Array.isArray(testData.fallbackUrls) ? testData.fallbackUrls : [];

    if (!envSpecific && !primary && fallbacks.length === 0) {
      throw new Error(`URL for component ${String(componentName)} not defined in componentURLs.ts`);
    }

    // '/' is treated as the localized homepage (see getComponentUrl).
    const buildUrl = (path: string) =>
      this.buildComponentUrl(baseURL, path === '/' ? '{locale}' : path);

    // Priority: env-specific URL > default URL > fallbacks
    const ordered = [envSpecific, primary, ...fallbacks].filter((p): p is string => Boolean(p));
    return ordered.map(buildUrl);
  }

  /**
   * Resolves the URL to navigate to based on the current execution mode.
   *
   * - "component" mode (default): uses the dedicated component test page URL
   *   from componentURL.ts — existing behaviour, nothing changes.
   * - "page" mode: uses PAGE_URL injected by ComponentTestRunner,
   *   so the spec validates the component on a real production/QA page.
   *
   * @param componentName  key in componentURL.ts
   * @param baseURL        result of envUtils.getBaseUrl()
   */
  async resolveExecutionUrl(
    componentName: keyof typeof componentURL,
    baseURL: string
  ): Promise<string> {
    if (process.env.EXECUTION_MODE === 'page' && process.env.PAGE_URL) {
      return process.env.PAGE_URL;
    }
    return this.getComponentUrl(componentName, baseURL);
  }

  // Navigates to the specified URL
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  //Clicks on the given element
  async clickOnElement(selectorOrText: string, options?: { name?: string | RegExp }) {
    let element;

    if (options?.name) {
      // If using a locator with name (e.g., role-based locator)
      element = this.page.getByRole('link', { name: options.name });
    } else if (selectorOrText.startsWith('//') || selectorOrText.startsWith('xpath=')) {
      // XPath support
      element = this.page.locator(selectorOrText);
    } else if (selectorOrText.startsWith('text=')) {
      // text selector
      element = this.page.locator(selectorOrText);
    } else if (selectorOrText.includes('[')) {
      // Assume it's a CSS selector
      element = this.page.locator(selectorOrText);
    } else {
      // Fallback: treat as visible text
      element = this.page.getByText(selectorOrText, { exact: true });
    }

    await element.waitFor({ state: 'visible', timeout: 5000 });
    await element.click();
  }

  /**
   * Types text into an input field with a potential delay per character.
   * @param selector The CSS selector of the input field.
   * @param text The text to type.
   * @param delayPerCharMs Optional delay in milliseconds between each character.
   */
  async typeText(selector: string, text: string, delayPerCharMs: number = 50) {
    await this.page.locator(selector).pressSequentially(text, { delay: delayPerCharMs });
  }

  // You can add more common methods here, e.g., for scrolling, waiting for elements, etc.
  async scrollDown(pixels: number) {
    await this.page.evaluate((px) => window.scrollBy(0, px), pixels);
    await this.page.waitForLoadState('domcontentloaded'); // Small pause after scroll
  }

  // ============ Smart Locator Methods (AI Auto-Healing) ============
  /**
   * Find element using AI auto-healing selectors with multiple fallback strategies
   * @param options SmartLocatorOptions with multiple selector strategies
   * @returns Locator that will automatically try fallbacks
   *
   * @example
   * const submitButton = await this.findSmart({
   *   role: { role: 'button', name: /submit/i },
   *   testId: 'submit-btn',
   *   css: 'button.submit',
   *   description: 'Submit button'
   * });
   */
  async findSmart(options: SmartLocatorOptions): Promise<Locator> {
    return await smartLocator.find(this.page, options);
  }

  /**
   * Find element with chained locators (more efficient for simple cases)
   * Uses Playwright's .or() to try all strategies simultaneously
   */
  async findSmartChained(options: SmartLocatorOptions): Promise<Locator> {
    return await smartLocator.findWithChaining(this.page, options);
  }

  /**
   * Click element using smart locator with auto-healing
   */
  async clickSmart(options: SmartLocatorOptions): Promise<void> {
    const element = await this.findSmart(options);
    await element.click();
  }

  /**
   * Fill input using smart locator with auto-healing
   */
  async fillSmart(options: SmartLocatorOptions, text: string): Promise<void> {
    const element = await this.findSmart(options);
    await element.fill(text);
  }

  /**
   * Get text from element using smart locator
   */
  async getTextSmart(options: SmartLocatorOptions): Promise<string> {
    const element = await this.findSmart(options);
    return (await element.textContent()) || '';
  }

  /**
   * Check if element is visible using smart locator
   */
  async isVisibleSmart(options: SmartLocatorOptions): Promise<boolean> {
    try {
      const element = await this.findSmart(options);
      return await element.isVisible();
    } catch {
      return false;
    }
  }

  // ============ Visual / computed-style helpers (shared) ============
  /** Read a computed CSS property from a locator's first element. */
  async getCssValue(locator: Locator, prop: string): Promise<string> {
    return await locator.evaluate(
      (el, p) => window.getComputedStyle(el as Element).getPropertyValue(p as string),
      prop
    );
  }

  /** Normalize a px value so "0.40px" and "0.4px" (and unit-less) compare equal. */
  normalizePx(value?: string): string | undefined {
    if (!value) return undefined;
    const n = parseFloat(value);
    return Number.isNaN(n) ? value : `${n}px`;
  }

  /**
   * Normalize a colour so rgb(16,56,79) and rgba(16,56,79,1) compare equal.
   * Named normalizeCssColor (not normalizeColor) to avoid clashing with the private
   * normalizeColor methods some components already declare.
   */
  normalizeCssColor(color?: string): string | undefined {
    if (!color) return undefined;
    const m = color.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)(?:,([\d.]+))?\)$/i);
    if (!m) return color.replace(/\s/g, '');
    const [, r, g, b, a] = m;
    const alpha = a === undefined ? 1 : Math.round(parseFloat(a) * 1000) / 1000;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  /**
   * Assert an element's computed typography against a design token (all soft, guarded).
   * Undefined token fields are skipped ("no design value -> do not assert"). Letter-spacing
   * uses a small tolerance because em-derived values render slightly off the absolute spec.
   */
  async assertTypography(
    el: Locator,
    t: TypographyExpectation | undefined,
    label: string
  ): Promise<void> {
    if (!t) return;
    await el.waitFor({ state: 'visible' });
    if (t.fontFamily) {
      const family = await this.getCssValue(el, 'font-family');
      expect
        .soft(family.toLowerCase(), `${label} font-family`)
        .toContain(t.fontFamily.toLowerCase());
    }
    if (t.fontSize) {
      expect
        .soft(await this.getCssValue(el, 'font-size'), `${label} font-size`)
        .toBe(this.normalizePx(t.fontSize));
    }
    if (t.fontWeight) {
      expect
        .soft(String(await this.getCssValue(el, 'font-weight')), `${label} font-weight`)
        .toBe(String(t.fontWeight));
    }
    if (t.lineHeight) {
      expect
        .soft(await this.getCssValue(el, 'line-height'), `${label} line-height`)
        .toBe(this.normalizePx(t.lineHeight));
    }
    if (t.letterSpacing) {
      const actualLs = parseFloat(await this.getCssValue(el, 'letter-spacing'));
      const expectedLs = parseFloat(t.letterSpacing);
      expect
        .soft(
          Math.abs(actualLs - expectedLs),
          `${label} letter-spacing actual ${actualLs}px vs ${expectedLs}px`
        )
        .toBeLessThanOrEqual(0.1);
    }
    if (t.textCase === 'UPPER') {
      expect
        .soft(await this.getCssValue(el, 'text-transform'), `${label} text-transform`)
        .toBe('uppercase');
    }
    if (t.color) {
      expect
        .soft(this.normalizeCssColor(await this.getCssValue(el, 'color')), `${label} color`)
        .toBe(this.normalizeCssColor(t.color));
    }
  }

  // Gets the inner text of the specified element
  async getText(locator: string): Promise<string> {
    return await this.page.locator(locator).innerText();
  }

  // Wait for element to appear
  async waitForElement(locator: string): Promise<void> {
    await this.page.locator(locator).waitFor({ state: 'visible' });
  }

  // Check if element is visible
  async isElementVisible(locator: string): Promise<boolean> {
    return await this.page.locator(locator).isVisible();
  }

  // Wait for specific text in element
  async waitForText(selector: string, expectedText: string): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'visible' });
    const actualText = await this.page.locator(selector).textContent();
    if (!actualText?.includes(expectedText)) {
      throw new Error(`Expected text '${expectedText}' not found. Got: '${actualText}'`);
    }
  }

  // Wait for network to become idle
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Take screenshot with name
  async takeScreenshot(name: string): Promise<void> {
    const screenshotPath = path.resolve(`screenshots/${name}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
  }

  // Start video recording
  async startVideoRecording(): Promise<void> {
    this.context = await this.browser.newContext({ recordVideo: { dir: 'videos/' } });
    this.page = await this.context.newPage();
  }

  // Stop video recording
  async stopVideoRecording(): Promise<void> {
    await this.context.close();
  }

  // Assert element has exact text
  async assertElementText(selector: string, expected: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(expected);
  }

  // Assert element exists
  async assertElementExists(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveCount(1);
  }

  // ============ Browser/Test Lifecycle ============
  /**
   * Sets up the browser and page before each test and also this we can use if we are using pre-conditions
   * @returns {Promise<Page>} The Playwright Page instance.
   */
  async beforeEachTestSetup(): Promise<Page> {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    return this.page;
  }

  /**
   * Cleans up browser context and closes the browser after each test.
   * Promise<void> The function does something asynchronous (like launching a browser, waiting for navigation, reading files, etc.).
   */
  async afterEachTestCleanup(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();
  }

  // ============ Element Actions ============
  /**
   * Selects an option from a dropdown by visible label.
   * @param {Page} page - Playwright Page instance.
   * @param {string} selector - CSS selector of the dropdown.
   * @param {string} option - Label of the option to select.
   */
  async selectDropdown(selector: string, option: string): Promise<void> {
    await this.page.selectOption(selector, { label: option });
  }

  /**
   * Accepts a cookie consent banner if it is visible.
   * Handles both OneTrust and custom Bayer cookie banners.
   * @param {Page} page - Playwright Page instance.
   * @param {string} selector - Selector of the cookie accept button (default provided).
   */
  async acceptCookiesBanner(): Promise<void> {
    try {
      // Wait a moment for the banner to appear after page load
      await this.page.waitForTimeout(1500);

      // Strategy 1: Try text-based selectors for "ACCEPT COOKIES" button (Bayer custom banner)
      const acceptCookiesButton = this.page.getByRole('button', { name: /ACCEPT COOKIES/i });
      const acceptButtonVisible = await acceptCookiesButton.isVisible().catch(() => false);

      if (acceptButtonVisible) {
        await acceptCookiesButton.click({ timeout: 5000 });
        // Wait for banner to disappear
        await this.page.waitForTimeout(1000);
        return;
      }

      // Strategy 2: Try OneTrust cookie banner
      const cookieBanner = this.page.locator('#onetrust-consent-sdk');
      const bannerVisible = await cookieBanner.isVisible().catch(() => false);

      if (bannerVisible) {
        // Try multiple button selectors in case of different OneTrust configurations
        const buttonSelectors = [
          '#onetrust-accept-btn-handler',
          'button#accept-recommended-btn-handler',
          '.onetrust-close-btn-handler',
          'button[aria-label*="Accept"]',
          'button:has-text("Accept All Cookies")',
          'button:has-text("Accept All")',
          'button:has-text("Accept")',
          'button:has-text("承諾")',
          'button:has-text("同意")',
          'button:has-text("Akzeptieren")',
          '.accept-cookies-button',
        ];

        let clicked = false;
        for (const selector of buttonSelectors) {
          try {
            const acceptButton = this.page.locator(selector);
            const buttonCount = await acceptButton.count();

            if (buttonCount > 0) {
              await acceptButton.first().waitFor({ state: 'visible', timeout: 3000 });
              await acceptButton.first().click({ timeout: 3000, force: true });
              clicked = true;
              console.log(`[OK] Clicked cookie accept button: ${selector}`);
              break;
            }
          } catch {
            continue;
          }
        }

        if (clicked) {
          // Wait for the banner to be removed from DOM
          await cookieBanner.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});

          // Additional wait for page stability
          await this.page.waitForTimeout(1000);
        }
      }
    } catch (error) {
      // Silently ignore if cookies banner is not present
      // This is expected behavior if cookies were already accepted
    }
  }

  /**
   * Force-remove any cookie-consent banner node from the DOM.
   *
   * Unlike acceptCookiesBanner(), this does not depend on clicking an accept
   * button (whose label varies by market, e.g. "ACCEPT OPTIONAL COOKIES") and is
   * safe to call repeatedly. The OneTrust banner loads lazily and can re-appear
   * after acceptCookiesBanner() has already run, overlaying interactive elements
   * such as the link-disclaimer OK/Continue button and swallowing the click.
   * Removing the banner node guarantees those controls are reachable.
   */
  async removeCookieBannerFromDom(): Promise<void> {
    await this.page
      .evaluate(() => {
        const selectors = [
          '#onetrust-consent-sdk',
          '#onetrust-banner-sdk',
          '#onetrust-pc-sdk',
          '.onetrust-pc-dark-filter',
        ];
        selectors.forEach((selector) =>
          document.querySelectorAll(selector).forEach((el) => el.remove())
        );
      })
      .catch(() => undefined);
  }

  /**
   * Navigate to URL with authentication
   * Navigates to the URL and handles password authentication if required
   * @param url - The URL to navigate to
   * @param password - Optional password override (uses ENV variable if not provided)
   */
  async navigateWithAuthentication(url: string, password?: string): Promise<void> {
    const authPassword = password ?? process.env.AUTH_PASSWORD ?? 'beyond2026';

    try {
      // Set up HTTP Basic Authentication handler for popup dialogs
      this.page.on('dialog', async (dialog) => {
        if (dialog.type() === 'beforeunload') {
          await dialog.accept();
        }
      });

      // Handle HTTP Basic Authentication using context credentials
      if (this.context) {
        await this.context.setHTTPCredentials({
          username: 'bayercorp',
          password: 'beyond2026',
        });
      }

      // Navigate to the URL first. Use 'commit' (resolves as soon as the
      // navigation response is received) rather than 'domcontentloaded' so a
      // slow full-page load does not blow the navigation timeout. Readiness is
      // gated downstream by each component's explicit element waitFor(), so we
      // only wait as long as the element the test actually needs requires.
      await this.page.goto(url, {
        waitUntil: 'commit',
        timeout: 60000,
      });

      // Use the robust authentication handler for Vercel password pages
      await this.handleVercelAuthentication(authPassword);
    } catch (error) {
      await this.logError(`Navigation or authentication failed: ${error}`);
      throw error;
    }
  }

  /**
   * Handle Vercel authentication specifically for sites protected with beyond2026 password
   * This method should be called after navigation to handle the auth prompt
   * Only authenticates if password popup/page is detected, otherwise proceeds without authentication
   * @param password - Optional password override (defaults to 'beyond2026')
   */
  async handleVercelAuthentication(password: string = 'beyond2026'): Promise<void> {
    try {
      // Check if we're on a Vercel authentication page with multiple password field selectors
      const passwordSelectors = [
        'input[name="_vercel_password"]',
        'input[type="password"]',
        'input[name="password"]',
        '[role="textbox"]',
      ];

      let passwordField = null;
      let isAuthPage = false;

      // Try each password selector until we find a visible one
      for (const selector of passwordSelectors) {
        passwordField = this.page.locator(selector);
        isAuthPage = await passwordField.isVisible({ timeout: 5000 }).catch(() => false);
        if (isAuthPage) {
          break;
        }
      }

      // If no authentication page detected, skip authentication and proceed
      if (!isAuthPage) {
        this.log('No authentication page detected - proceeding without authentication');
        return;
      }

      // Authentication page detected - proceed with login
      if (passwordField) {
        this.log('Authentication page detected - attempting to authenticate');

        // Fill the password field
        await passwordField.fill(password);

        // Find and click submit button with multiple fallback strategies
        const submitSelectors = [
          'button[type="submit"]',
          'button.submit',
          'input[type="submit"]',
          'button:has-text("Continue")',
          'button:has-text("Submit")',
        ];

        let submitted = false;
        for (const selector of submitSelectors) {
          const button = this.page.locator(selector);
          if (await button.isVisible()) {
            await button.click();
            submitted = true;
            break;
          }
        }

        // If no submit button found, try pressing Enter
        if (!submitted) {
          await passwordField.press('Enter');
        }

        // Wait for navigation to complete
        await this.page.waitForLoadState('load', { timeout: 15000 });

        // Verify authentication was successful (no more password field visible)
        let stillOnAuthPage = false;
        for (const selector of passwordSelectors) {
          const field = this.page.locator(selector);
          if (await field.isVisible({ timeout: 2000 }).catch(() => false)) {
            stillOnAuthPage = true;
            break;
          }
        }

        if (stillOnAuthPage) {
          throw new Error('Authentication failed - still on password page');
        }

        this.log('Authentication successful');
      }
    } catch (error) {
      // Only log error if we were actually trying to authenticate
      await this.logError(`Vercel authentication error: ${error}`);
      throw error;
    }
  }

  // ...existing code...

  // ============ Environment Related Config ============
  /**
   * Loads environment-specific configuration JSON.
   * @param {string} env - Environment name (e.g., 'staging', 'prod').
   * @returns {any} Parsed config object.
   */
  async loadEnvironment(env: string): Promise<void> {
    const envPath = path.resolve(`config/${env}.json`);
    if (!fs.existsSync(envPath)) throw new Error(`Config file for ${env} not found`);
    this.config = JSON.parse(fs.readFileSync(envPath, 'utf8'));
  }

  // ============ Visual Regression Testing if we are using Playwright ============
  /**
   * Compares the current page screenshot with a baseline/Figma image for visual regression.
   * @param {Page} page - Playwright Page instance.
   * @param {string} name - Name of the screenshot.
   */
  async compareScreenshot(name: string): Promise<void> {
    await expect(this.page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  }

  // ============ Visual Regression Testing if we are using Percey ============
  /**
   * Captures a visual snapshot for Percy visual regression testing.
   * @param page Playwright page instance
   * @param name Name of the snapshot (must be unique per test)
   * @param options Optional Percy options (widths, minHeight, etc.)
   */
  async capturePercySnapshot(
    page: Page,
    name: string,
    options: { widths?: number[]; minHeight?: number; percyCSS?: string } = {}
  ): Promise<void> {
    await percySnapshot(page as any, name, options);
  }

  // ============ Logging ============
  /**
  //   * Utility to format current timestamp.
  // */
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Logs informational messages with additional context: timestamp, env, browser, etc.
   * @param message - The message to log.
   * @param context - Optional extra context like test step or feature name.
   */
  async log(message: string, context?: string): Promise<void> {
    const env = process.env.TEST_ENV ?? 'qa';
    const contextStr = context ? ` [${context}]` : '';
    // Log information for debugging purposes
    // console.log(`[INFO] [${this.getTimestamp()}] [Env: ${env}]${contextStr} - ${message}`);
  }

  /**
   * Logs error messages with context: timestamp, env, browser, etc.
   * @param error - The error message or object.
   * @param context - Optional extra context to help identify where error occurred.
   */
  async logError(error: string | Error, context?: string): Promise<void> {
    const errorMessage = typeof error === 'string' ? error : (error.stack ?? error.message);
    const env = process.env.TEST_ENV ?? 'qa';
    const contextStr = context ? ` [${context}]` : '';
    console.error(`[ERROR] [${this.getTimestamp()}] [Env: ${env}]${contextStr} - ${errorMessage}`);
  }

  // ============ Accessibility Testing ============
  /**
   * Runs comprehensive accessibility scan using axe-core
   * @param selector Optional selector to scan specific component
   * @param tags Optional axe-core tags to include/exclude
   * @returns Promise<any> Accessibility scan results
   */
  async runAccessibilityScan(selector?: string, tags?: string[]): Promise<any> {
    let axeBuilder = new AxeBuilder({ page: this.page });

    if (tags) {
      axeBuilder = axeBuilder.withTags(tags);
    }

    if (selector) {
      axeBuilder = axeBuilder.include(selector);
    }

    const results = await axeBuilder.analyze();
    return results;
  }

  /**
   * Validates accessibility compliance and throws error if violations found
   * @param selector Optional selector to scan specific component
   * @param allowedViolations Optional array of violation IDs to ignore
   */
  async validateAccessibility(selector?: string, allowedViolations: string[] = []): Promise<void> {
    const results = await this.runAccessibilityScan(selector, ['wcag2a', 'wcag2aa']);

    // Filter out allowed violations
    const criticalViolations = results.violations.filter(
      (violation: any) => !allowedViolations.includes(violation.id)
    );

    if (criticalViolations.length > 0) {
      const violationSummary = criticalViolations
        .map((v: any) => `${v.id}: ${v.description} (${v.nodes.length} instances)`)
        .join('\n');

      throw new Error(`Accessibility violations found:\n${violationSummary}`);
    }
  }

  /**
   * Checks basic accessibility attributes
   * @param element Locator for the element to check
   * @param expectedAttributes Object with expected attribute values
   */
  async validateAccessibilityAttributes(
    element: Locator,
    expectedAttributes: { [key: string]: string | null }
  ): Promise<void> {
    for (const [attribute, expectedValue] of Object.entries(expectedAttributes)) {
      if (expectedValue === null) {
        // Just check attribute exists
        await expect(element).toHaveAttribute(attribute);
      } else {
        // Check attribute has specific value
        await expect(element).toHaveAttribute(attribute, expectedValue);
      }
    }
  }

  // Validate CSS selectors font for the component
  async validateFontStyles(
    locator: Locator,
    expectedStyles: Record<string, string | number>
  ): Promise<void> {
    for (const [prop, expected] of Object.entries(expectedStyles)) {
      // Get the computed style property value and trim it
      const actualValue = await locator.evaluate(
        (el, property) => window.getComputedStyle(el).getPropertyValue(property),
        prop
      );
      const trimmedValue = actualValue.trim();

      // For font-size and line-height, compare as numbers if expected is a number
      if (typeof expected === 'number' && (prop === 'font-size' || prop === 'line-height')) {
        const numericActual = parseFloat(trimmedValue);
        if (isNaN(numericActual) || Math.abs(numericActual - expected) > 0.5) {
          throw new Error(
            `Font style mismatch for "${prop}": expected approximately "${expected}", got "${trimmedValue}"`
          );
        }
      } else {
        if (trimmedValue !== expected) {
          throw new Error(
            `Font style mismatch for "${prop}": expected "${expected}", got "${trimmedValue}"`
          );
        }
      }
    }
  }

  // Reusable locator
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  // Validate image component is visible and has correct src
  protected async validateImageExists(locator: Locator): Promise<void> {
    const src = locator;
    await expect(locator).toBeVisible();
    await expect(src, 'image `src` should not be empty').toHaveAttribute('src');
  }

  // Validate that the text component exists (non-empty)
  protected async validateTextExists(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    const text = await locator.textContent();
    expect(text && text.trim().length > 0, 'Text should not be empty').toBeTruthy();
  }

  //Clicks on a link by its visible text and verifies that the URL has changed.//
  // async clickLinkAndVerifyNavigation(locator: Locator): Promise<void> {
  //   const initialURL = this.page.url();
  //   locator.click();
  //   await this.page.waitForLoadState('load');
  //   const newURL = this.page.url();
  //   expect(newURL, 'After clicking Read More, URL should not be null or empty').toBeTruthy();
  //   expect(newURL, 'After clicking Read More, URL should change').not.toBe(initialURL);
  // }
  protected async clickLinkAndVerifyNavigation(locator: Locator): Promise<void> {
    const initialURL = this.page.url();
    await Promise.all([
      locator.click(),
      // Wait for the page to navigate after clicking the link
      this.page.waitForLoadState('load'),
    ]);
    const newURL = this.page.url();
    expect(newURL, 'After clicking the link, URL should not be null or empty').toBeTruthy();
    expect(newURL, 'After clicking the link, URL should change').not.toBe(initialURL);
  }

  /**
   * Clicks on an element located by its ARIA role (e.g., button, link, heading) and accessible name.
   * Waits for the element to be visible before clicking.
   *
   * @param role - The ARIA role of the target element (e.g., 'button', 'link').
   * @param options - Options to locate the element by its accessible name (string or RegExp).
   */
  async clickByRole(
    role: 'link' | 'button' | 'heading' | 'navigation' | 'textbox' | 'img', // extend as needed
    options: { name: string | RegExp; exact?: boolean }
  ): Promise<void> {
    const element = this.page.getByRole(role, options);
    await element.waitFor({ state: 'visible', timeout: 10000 });
    await element.click();
  }

  /**
   * Clicks on an element containing the specified text.
   * The search for the text is case-insensitive and partial by default.
   * Waits for the element to be visible before clicking.
   *
   * @param text - The visible text to identify the element.
   */
  async clickOnText(text: string): Promise<void> {
    const element = this.page.getByText(text, { exact: false });
    await element.waitFor({ state: 'visible', timeout: 5000 });
    await element.click();
  }

  /**
   * Asserts that the specified element (by selector) contains the expected text.
   * Waits for the element to be present and then compares its text content.
   *
   * @param selector - The selector (e.g., CSS) of the target element.
   * @param expectedText - The text that is expected to be present in the element.
   */
  async expectTextToBePresent(selector: string, expectedText: string): Promise<void> {
    await this.page.locator(selector).waitFor({ timeout: 5000 });
    const actualText = await this.page.textContent(selector);
    expect(actualText?.trim()).toContain(expectedText);
  }

  /**
   * Navigates to a given URL with a potential delay.
   * @param url The URL to navigate to.
   * @param delayMs Optional delay in milliseconds before navigation.
   */
  async goto(url: string, delayMs: number = 0) {
    if (delayMs > 0) {
      // Optional delay before navigation
      await this.page.waitForLoadState('domcontentloaded');
    }
    await this.page.goto(url, { waitUntil: 'domcontentloaded' }); // Use domcontentloaded for faster load
    await expect(this.page).toHaveURL(url); // Assert that navigation was successful
  }

  /**
   * Clicks an element with a potential post-click delay.
   * @param selector The CSS selector of the element to click.
   * @param delayMs Optional delay in milliseconds after clicking.
   */
  async clickElement(selector: string, delayMs: number = 0) {
    await this.page.locator(selector).click();
    if (delayMs > 0) {
      console.log(`Waiting for ${delayMs}ms after clicking ${selector}`);
      await this.page.waitForTimeout(delayMs);
    }
  }

  // ============ Authentication Methods ============
  /**
   * Performs basic authentication for protected pages
   * @param username - The username for authentication
   * @param password - The password for authentication
   */
  async performBasicAuth(username: string, password: string): Promise<void> {
    try {
      // Check if already authenticated by looking for logout/profile indicators
      const isLoggedIn = await this.isUserLoggedIn();
      if (isLoggedIn) {
        this.log('User is already authenticated');
        return;
      }

      // Look for common authentication elements
      const loginButton = this.page.locator(
        '[data-qa="login-button"], [data-testid="login"], .login-button, button:has-text("Login"), button:has-text("Sign In")'
      );
      const usernameField = this.page.locator(
        '[data-qa="username"], [data-testid="username"], input[name="username"], input[type="email"]'
      );
      const passwordField = this.page.locator(
        '[data-qa="password"], [data-testid="password"], input[name="password"], input[type="password"]'
      );
      const submitButton = this.page.locator(
        '[data-qa="submit"], [data-testid="submit"], button[type="submit"], button:has-text("Login"), button:has-text("Sign In")'
      );

      // Wait for page to load
      await this.page.waitForLoadState('domcontentloaded');

      // Click login button if it exists
      if ((await loginButton.count()) > 0) {
        await loginButton.first().click();
        await this.page.waitForLoadState('domcontentloaded');
      }

      // Fill in credentials
      if ((await usernameField.count()) > 0 && (await passwordField.count()) > 0) {
        await usernameField.first().fill(username);
        await passwordField.first().fill(password);

        // Submit the form
        if ((await submitButton.count()) > 0) {
          await submitButton.first().click();
        } else {
          // Try pressing Enter as fallback
          await passwordField.first().press('Enter');
        }

        // Wait for authentication to complete
        await this.page.waitForLoadState('domcontentloaded');
        this.log('Authentication completed successfully');
      } else {
        this.log('Authentication form not found, proceeding without login');
      }
    } catch (error) {
      this.log(`Authentication failed: ${error}`);
      // Continue with test execution even if auth fails
    }
  }

  /**
   * Checks if user is already logged in
   * @returns Promise<boolean> - True if logged in, false otherwise
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      // Look for common indicators of logged-in state
      const loggedInIndicators = this.page.locator(
        [
          '[data-qa="user-profile"]',
          '[data-qa="logout"]',
          '[data-testid="user-menu"]',
          '.user-profile',
          '.logout-button',
          'button:has-text("Logout")',
          'button:has-text("Sign Out")',
          '[data-qa="user-avatar"]',
        ].join(', ')
      );

      const count = await loggedInIndicators.count();
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Handles authentication for development/test environments
   * Uses environment variables for credentials
   */
  async handleTestEnvironmentAuth(): Promise<void> {
    const username = process.env.TEST_USERNAME || 'testuser';
    const password = process.env.TEST_PASSWORD || 'testpass';

    await this.performBasicAuth(username, password);
  }

  // ============ CSS Validation Utilities ============
  /**
   * Helper function to normalize CSS color values for comparison
   * Converts to consistent rgba format for reliable comparison
   */
  public normalizeColorValue(colorValue: string): string {
    // Handle transparent values
    if (colorValue === 'transparent') {
      return 'rgba(0, 0, 0, 0)';
    }

    // Convert rgba(r, g, b, a) to consistent format
    const rgbaMatch = colorValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      const [, r, g, b, a = '1'] = rgbaMatch;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    return colorValue;
  }

  /**
   * Helper function to normalize font family values
   * Removes quotes and fallback fonts for comparison
   */
  protected normalizeFontFamily(fontValue: string): string {
    // Remove quotes and fallback fonts for comparison
    return fontValue.replace(/['"]/g, '').split(',')[0].trim().toLowerCase();
  }

  /**
   * Enhanced color validation that handles both rgb() and rgba() formats
   */
  protected async validateColorCSS(
    locator: Locator,
    cssProperty: string,
    expectedValue: string
  ): Promise<void> {
    const actualValue = await locator.evaluate(
      (el, prop) => getComputedStyle(el).getPropertyValue(prop),
      cssProperty
    );

    const normalizedExpected = this.normalizeColorValue(expectedValue);
    const normalizedActual = this.normalizeColorValue(actualValue);

    expect(normalizedActual).toBe(normalizedExpected);
  }

  /**
   * Enhanced font family validation that handles quotes and fallback fonts
   */
  protected async validateFontFamilyCSS(locator: Locator, expectedValue: string): Promise<void> {
    const actualValue = await locator.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('font-family')
    );

    const normalizedExpected = this.normalizeFontFamily(expectedValue);
    const normalizedActual = this.normalizeFontFamily(actualValue);

    expect(normalizedActual).toBe(normalizedExpected);
  }

  /**
   * Helper method to extract pixel value from CSS value
   * Useful for typography validation (font-size, line-height, letter-spacing)
   */
  protected normalizePixelValue(value: string): number {
    const match = value.match(/([\d.]+)px/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Helper method to normalize font weight values
   * Maps weight names to numeric values for consistent comparison
   */
  protected normalizeFontWeight(weight: string): string {
    const weightMap: { [key: string]: string } = {
      '100': '100',
      thin: '100',
      '200': '200',
      'extra-light': '200',
      'ultra-light': '200',
      '300': '300',
      light: '300',
      '400': '400',
      normal: '400',
      regular: '400',
      '500': '500',
      medium: '500',
      '600': '600',
      'semi-bold': '600',
      'demi-bold': '600',
      '700': '700',
      bold: '700',
      '800': '800',
      'extra-bold': '800',
      'ultra-bold': '800',
      '900': '900',
      black: '900',
      heavy: '900',
    };

    return weightMap[weight.toLowerCase()] || weight;
  }
}

// ============ Config Utilities ============
/**
 * This kind of utility method avoids hard-coding and helps in cleaner config management.
 * Fetches a configuration value by key from a config JSON file.
 * Supports different environments (e.g., QA, Staging, Prod) if structure is designed that way.
 *
 * @param {string} key - The configuration key to fetch (e.g., 'baseUrl', 'username').
 * @returns {string} The corresponding value from the config file.
 * @throws Will throw an error if config file is missing or key is not found.
 */
export async function getConfigValue(key: string): Promise<string> {
  const env = process.env.TEST_ENV || 'qa'; // Default to 'qa' if not set
  const configPath = path.resolve(__dirname, `../config/${env}.config.json`);

  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found for environment: ${env}`);
  }

  const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  if (!(key in configData)) {
    throw new Error(`Key "${key}" not found in ${env}.config.json`);
  }

  return configData[key];
}

// ============ Data Utilities ============
/**
 * Generates a unique random email address for test users.
 * @returns {string} A unique email string.
 */
export async function generateRandomEmail(): Promise<string> {
  const rand = Math.random().toString(36).substring(2, 10);
  return `user_${rand}.ext@bayer.com`;
}

/**
 * this will manage test data outside code, making it reusable and easy to update.
 * Reads test data from JSON, Excel, or CSV files.
 * @param {string} filePath - Path to the data file.
 * @returns {any | Promise<any>} Parsed data from the file.
 */
export async function readTestData(filePath: string): Promise<any> {
  const ext = path.extname(filePath);
  const fullPath = path.resolve(filePath);

  if (ext === '.json') {
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } else if (ext === '.xlsx' || ext === '.xls') {
    const workbook = XLSX.readFile(fullPath);
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  } else if (ext === '.csv') {
    const results: any[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(fullPath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  } else {
    throw new Error('Unsupported file format');
  }
}

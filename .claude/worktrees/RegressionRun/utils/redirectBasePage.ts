import { Page, Browser, BrowserContext, expect, test } from '@playwright/test';
import { BasePage } from '../helpers/utils/basePage';

/**
 * Base page class for URL redirect testing
 * Contains common functionality for navigation and URL validation
 */
export class RedirectBasePage extends BasePage {

  constructor(page: Page, browser: Browser, context: BrowserContext) {
    super(page, browser, context);
  }

  /**
   * Navigate to URL and wait for redirect to complete
   * @param url The URL to navigate to
   * @param timeout Maximum time to wait for redirect
   * @returns Object. containing success status, final URL, and any error
   */
  async navigateAndWaitForRedirect(
    url: string, 
    timeout: number = 10000
  ): Promise<{
    success: boolean;
    finalUrl: string;
    error?: string;
    statusCode?: number;
  }> {
    try {
      // Check if page is closed before navigation
      if (this.page.isClosed()) {
        throw new Error('Page is closed - cannot navigate');
      }

      await test.step(`Navigate to URL: ${url}`, async () => {
        // Use authentication-aware navigation from BasePage
        await this.navigateWithAuthentication(url);
        
        // Wait for any potential redirects with error handling
        try {
          await this.page.waitForLoadState('networkidle', { timeout: timeout });
        } catch (timeoutError) {
          // If networkidle times out, try domcontentloaded as fallback
          console.warn(`NetworkIdle timeout, falling back to domcontentloaded`);
          await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 }).catch(() => {
            console.warn('DOMContentLoaded also timed out, continuing anyway');
          });
        }
        
        return {
          success: true,
          finalUrl: this.page.url()
        };
      });

      return {
        success: true,
        finalUrl: this.page.url()
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Try to get current URL even on error, but handle page closure
      let currentUrl = url;
      try {
        if (!this.page.isClosed()) {
          currentUrl = this.page.url();
        }
      } catch {
        // Ignore errors getting URL
      }
      
      return {
        success: false,
        finalUrl: currentUrl,
        error: errorMessage
      };
    }
  }

  /**
   * Compare actual URL with expected URL
   * @param actualUrl The actual redirected URL
   * @param expectedUrl The expected redirect URL
   * @returns Object containing comparison result and details
   */
  compareUrls(
    actualUrl: string, 
    expectedUrl: string
  ): {
    isMatch: boolean;
    normalizedActual: string;
    normalizedExpected: string;
    comparisonDetails: string;
  } {
    try {
      // First, aggressively clean both URLs
      const cleanActual = actualUrl.trim().toLowerCase().replace(/\/+$/, '').replace(/\s+/g, '');
      const cleanExpected = expectedUrl.trim().toLowerCase().replace(/\/+$/, '').replace(/\s+/g, '');
      
      // Check if they're identical after aggressive cleaning
      if (cleanActual === cleanExpected) {
        return {
          isMatch: true,
          normalizedActual: cleanActual,
          normalizedExpected: cleanExpected,
          comparisonDetails: 'URLs match (exact match after cleaning)'
        };
      }
      
      // Normalize URLs for comparison (remove trailing slashes, convert to lowercase)
      const normalizedActual = this.normalizeUrl(actualUrl);
      const normalizedExpected = this.normalizeUrl(expectedUrl);
      
      // Basic match check
      let isMatch = normalizedActual === normalizedExpected;
      let matchReason = '';
      
      if (isMatch) {
        matchReason = 'exact match after normalization';
      }
      
      // Handle domain equivalency: Production vs Vercel staging domains
      if (!isMatch) {
        // Convert both URLs to their path components for comparison
        const actualPath = this.extractPath(normalizedActual);
        const expectedPath = this.extractPath(normalizedExpected);
        
        // Check if we're comparing production domain to Vercel domain
        const isProductionToVercel = (
          normalizedExpected.includes('www.bayer.co.uk') && 
          normalizedActual.includes('bayer-beyond-prod-uk.vercel.app')
        ) || (
          normalizedActual.includes('www.bayer.co.uk') && 
          normalizedExpected.includes('bayer-beyond-prod-uk.vercel.app')
        );
        
        if (isProductionToVercel && actualPath === expectedPath) {
          isMatch = true;
          matchReason = 'domain equivalency match';
        }
      }
      
      const comparisonDetails = isMatch 
        ? `URLs match (${matchReason})`
        : `URL mismatch - Expected: ${normalizedExpected}, Actual: ${normalizedActual}`;
      
      return {
        isMatch,
        normalizedActual,
        normalizedExpected,
        comparisonDetails
      };

    } catch (error) {
      return {
        isMatch: false,
        normalizedActual: actualUrl,
        normalizedExpected: expectedUrl,
        comparisonDetails: `URL comparison failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Extract path component from URL for comparison
   * @param url Full URL
   * @returns Path component (e.g., '/en-gb')
   */
  private extractPath(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      // Fallback: extract path manually
      const match = url.match(/^https?:\/\/[^\/]+(.*)$/);
      return match ? match[1] : '';
    }
  }

  /**
   * Normalize URL for consistent comparison
   * @param url The URL to normalize
   * @returns Normalized URL string
   */
  private normalizeUrl(url: string): string {
    try {
      // Remove trailing slashes and convert to lowercase
      let normalized = url.trim().toLowerCase();
      
      // Remove ALL trailing slashes (not just one)
      while (normalized.endsWith('/') && normalized.length > 1) {
        normalized = normalized.slice(0, -1);
      }
      
      // Handle protocol normalization
      if (normalized.startsWith('http://')) {
        normalized = normalized.replace('http://', 'https://');
      }
      
      return normalized;
    } catch (error) {
      console.warn(`Failed to normalize URL: ${url}, using original`);
      return url;
    }
  }

  /**
   * Take screenshot for debugging purposes
   * @param testName Name of the test for screenshot filename
   * @param stepName Specific step name
   */
  async takeScreenshot(testName: string, stepName: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotName = `${testName}-${stepName}-${timestamp}`;
      
      await test.step(`Take screenshot: ${screenshotName}`, async () => {
        await this.page.screenshot({
          path: `reports/screenshots/${screenshotName}.png`,
          fullPage: true
        });
      });
    } catch (error) {
      console.warn(`Failed to take screenshot: ${error}`);
    }
  }

  /**
   * Check if user is authenticated by looking for auth indicators
   */
  protected async isAuthenticated(): Promise<boolean> {
    try {
      if (this.page.isClosed()) {
        return false;
      }
      
      // Check if we can access the page without authentication errors
      const url = this.page.url();
      return url && !url.includes('login') && !url.includes('auth');
    } catch {
      return false;
    }
  }

  /**
   * Wait for page to be ready after redirect
   */
  async waitForPageReady(): Promise<void> {
    try {
      if (this.page.isClosed()) {
        throw new Error('Page is closed');
      }
      
      // Only wait for domcontentloaded to speed up execution
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      // Skip networkidle wait to improve performance
    } catch (error) {
      console.warn(`Page ready timeout - continuing anyway: ${error}`);
    }
  }

  /**
   * Get page metadata for additional validation
   */
  async getPageMetadata(): Promise<{
    title: string;
    metaDescription?: string;
    canonicalUrl?: string;
  }> {
    try {
      const title = await this.page.title();
      
      const metaDescription = await this.page
        .locator('meta[name="description"]')
        .getAttribute('content')
        .catch(() => undefined);
      
      const canonicalUrl = await this.page
        .locator('link[rel="canonical"]')
        .getAttribute('href')
        .catch(() => undefined);

      return {
        title,
        metaDescription,
        canonicalUrl
      };
    } catch (error) {
      console.warn(`Failed to get page metadata: ${error}`);
      return { title: 'Unknown' };
    }
  }

  /**
   * Check if page has any error indicators including 404 pages
   */
  async checkForPageErrors(): Promise<{
    hasErrors: boolean;
    errorType?: string;
    errorDetails?: string;
  }> {
    try {
      // Check page title first for 404 indicator
      const pageTitle = await this.page.title().catch(() => '');
      if (pageTitle.toLowerCase().includes('404')) {
        return {
          hasErrors: true,
          errorType: '404 Page',
          errorDetails: `Page title indicates 404: "${pageTitle}"`
        };
      }

      // Check for common error page indicators
      const errorSelectors = [
        'h1:has-text("404")',
        'h1:has-text("Page Not Found")',
        'h1:has-text("Error")',
        'title:has-text("404")',
        '[data-qa*="error"]',
        '.error-page',
        '#error',
        '.not-found'
      ];

      for (const selector of errorSelectors) {
        const errorElement = await this.page.locator(selector).first();
        if (await errorElement.isVisible().catch(() => false)) {
          const errorText = await errorElement.textContent().catch(() => '');
          return {
            hasErrors: true,
            errorType: selector.includes('404') ? '404 Page' : 'Page Error',
            errorDetails: `Found error element: ${selector} with text: "${errorText}"`
          };
        }
      }

      // Additional check: if URL contains the same path as original (no redirect occurred)
      // and page title is "404", mark as error
      const currentUrl = this.page.url();
      if (pageTitle === '404' || currentUrl.includes('/404')) {
        return {
          hasErrors: true,
          errorType: '404 Page',
          errorDetails: `404 page detected - URL: ${currentUrl}, Title: ${pageTitle}`
        };
      }

      return { hasErrors: false };
    } catch (error) {
      return {
        hasErrors: true,
        errorType: 'Error Check Failed',
        errorDetails: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
/**
 * Indexing Validator
 * Validates robots.txt, sitemap.xml, and meta robots tags
 * Based on Azure DevOps ticket 2583
 */

import { Page, expect } from '@playwright/test';
import { rolloutConfig } from '../../config/rollout-config';

export interface IndexingValidationResult {
  robotsTxt: {
    exists: boolean;
    content: string | null;
    allowsCrawling: boolean;
    sitemapUrl: string | null;
    errors: string[];
  };
  sitemap: {
    exists: boolean;
    urlCount: number;
    errors: string[];
  };
  metaRobots: {
    tag: string | null;
    isIndexable: boolean;
    errors: string[];
  };
  isValid: boolean;
}

/**
 * Result of "Option A" sitemap check: does the sitemap contain URLs that
 * belong to THIS site (same host + this site's base path)?
 */
export interface SitemapSiteMatchResult {
  sitemapUrl: string;
  totalLocs: number; // total page URLs found across the sitemap (index followed)
  matchingCount: number; // how many belong to this site
  sample: string[]; // a few matching URLs (not the whole sitemap)
  errors: string[];
}

export class IndexingValidator {
  private page: Page;
  private config = rolloutConfig.indexing;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Perform complete indexing validation
   */
  async validateIndexing(baseUrl: string): Promise<IndexingValidationResult> {
    const result: IndexingValidationResult = {
      robotsTxt: await this.validateRobotsTxt(baseUrl),
      sitemap: await this.validateSitemap(baseUrl),
      metaRobots: await this.validateMetaRobots(),
      isValid: false,
    };

    result.isValid =
      result.robotsTxt.errors.length === 0 &&
      result.sitemap.errors.length === 0 &&
      result.metaRobots.errors.length === 0;

    return result;
  }

  /**
   * Validate robots.txt file
   */
  private async validateRobotsTxt(baseUrl: string): Promise<IndexingValidationResult['robotsTxt']> {
    const errors: string[] = [];
    let exists = false;
    let content: string | null = null;
    let allowsCrawling = false;
    let sitemapUrl: string | null = null;

    if (!this.config.checkRobotsTxt) {
      return { exists, content, allowsCrawling, sitemapUrl, errors };
    }

    try {
      const robotsTxtUrl = `${baseUrl}/robots.txt`;
      const response = await this.page.request.get(robotsTxtUrl);

      if (response.status() === 200) {
        exists = true;
        content = await response.text();

        // Check if robots.txt allows crawling
        allowsCrawling = !content.match(/User-agent: \*\s+Disallow: \//i);

        // Extract sitemap URL
        const sitemapMatch = content.match(/Sitemap:\s*(.+)/i);
        if (sitemapMatch) {
          sitemapUrl = sitemapMatch[1].trim();
        } else {
          errors.push('Sitemap URL not found in robots.txt');
        }
      } else {
        errors.push(`robots.txt not found (HTTP ${response.status()})`);
      }
    } catch (error: any) {
      errors.push(`Error fetching robots.txt: ${error.message}`);
    }

    return { exists, content, allowsCrawling, sitemapUrl, errors };
  }

  /**
   * Validate sitemap.xml
   */
  private async validateSitemap(baseUrl: string): Promise<IndexingValidationResult['sitemap']> {
    const errors: string[] = [];
    let exists = false;
    let urlCount = 0;

    if (!this.config.checkSitemap) {
      return { exists, urlCount, errors };
    }

    try {
      const sitemapUrl = `${baseUrl}/sitemap.xml`;
      const response = await this.page.request.get(sitemapUrl);

      if (response.status() === 200) {
        exists = true;
        const content = await response.text();

        // Count URLs in sitemap
        const urlMatches = content.match(/<loc>/g);
        urlCount = urlMatches ? urlMatches.length : 0;

        if (urlCount === 0) {
          errors.push('Sitemap contains no URLs');
        }
      } else {
        errors.push(`sitemap.xml not found (HTTP ${response.status()})`);
      }
    } catch (error: any) {
      errors.push(`Error fetching sitemap.xml: ${error.message}`);
    }

    return { exists, urlCount, errors };
  }

  /**
   * Option A sitemap check: verify the sitemap actually contains URLs that
   * belong to THIS site (same host + this site's base path), sampling a few
   * rather than crawling everything.
   *
   * Handles the real structure: the sitemap lives at the app ROOT
   * ({origin}/sitemap.xml), and it is a sitemap INDEX pointing to child
   * sitemaps - so we follow the index one level to reach the page URLs.
   */
  async validateSitemapUrlsMatchSite(
    baseUrl: string,
    sampleSize = 5
  ): Promise<SitemapSiteMatchResult> {
    const origin = new URL(baseUrl).origin;
    const homePath = new URL(baseUrl).pathname.replace(/\/+$/, '').toLowerCase();
    const sitemapUrl = `${origin}/sitemap.xml`;
    const errors: string[] = [];

    const locs = await this.collectSitemapLocs(sitemapUrl, 0, errors);
    const matching = locs.filter((loc) => {
      try {
        const u = new URL(loc);
        // Match by PATH (locale/country), host-agnostic: sitemaps legitimately
        // list canonical prod URLs (e.g. www.conosur.bayer.com/es-ES/...) even on
        // a Vercel build, so the host will differ from the URL under test.
        return u.pathname.toLowerCase().startsWith(homePath);
      } catch {
        return false;
      }
    });

    if (locs.length === 0) {
      errors.push(`No page URLs found via ${sitemapUrl}`);
    } else if (matching.length === 0) {
      errors.push(`Sitemap contains no URLs for this site (expected path prefix "${homePath}")`);
    }

    return {
      sitemapUrl,
      totalLocs: locs.length,
      matchingCount: matching.length,
      sample: matching.slice(0, sampleSize),
      errors,
    };
  }

  /**
   * Fetch <loc> entries from a sitemap. If it is a sitemap index, follow one
   * level into the child sitemaps and gather their page <loc>s. Missing/errored
   * children are skipped (and noted) rather than aborting.
   */
  private async collectSitemapLocs(
    sitemapUrl: string,
    depth: number,
    errors: string[]
  ): Promise<string[]> {
    if (depth > 1) return []; // index -> child only; do not recurse deeper
    const resp = await this.page.request.get(sitemapUrl, { timeout: 30000 }).catch(() => null);
    if (!resp || resp.status() !== 200) {
      errors.push(`sitemap fetch failed: ${sitemapUrl} (HTTP ${resp ? resp.status() : 'error'})`);
      return [];
    }
    const body = await resp.text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
    if (/<sitemapindex/i.test(body)) {
      const pages: string[] = [];
      for (const child of locs) {
        pages.push(...(await this.collectSitemapLocs(child, depth + 1, errors)));
      }
      return pages;
    }
    return locs;
  }

  /**
   * Validate meta robots tags
   */
  private async validateMetaRobots(): Promise<IndexingValidationResult['metaRobots']> {
    const errors: string[] = [];
    let metaRobots: string | null = null;
    let isIndexable = true;

    try {
      // Meta robots tag is optional - use short timeout
      metaRobots = await this.page
        .locator('meta[name="robots"]')
        .getAttribute('content', { timeout: 5000 });

      if (metaRobots) {
        const content = metaRobots.toLowerCase();
        isIndexable = !content.includes('noindex');

        if (content.includes('noindex')) {
          errors.push('Page is marked as noindex');
        }
        if (content.includes('nofollow')) {
          errors.push('Page is marked as nofollow');
        }
      }
    } catch (error) {
      // Meta robots tag doesn't exist - this is fine, page is indexable by default
      metaRobots = null;
      isIndexable = true;
    }

    return {
      tag: metaRobots,
      isIndexable,
      errors,
    };
  }

  /**
   * Generate indexing report
   */
  generateReport(result: IndexingValidationResult, language: string): string {
    let report = `\n========== INDEXING VALIDATION REPORT (${language}) - ADO #2583 ==========\n`;
    report += `Page: ${this.page.url()}\n\n`;

    // Robots.txt
    report += `Robots.txt: ${result.robotsTxt.exists ? '✓' : '✗'}\n`;
    report += `  Allows Crawling: ${result.robotsTxt.allowsCrawling ? 'Yes' : 'No'}\n`;
    report += `  Sitemap URL: ${result.robotsTxt.sitemapUrl || 'N/A'}\n`;
    if (result.robotsTxt.errors.length > 0) {
      report += `  Errors: ${result.robotsTxt.errors.join(', ')}\n`;
    }

    // Sitemap
    report += `\nSitemap.xml: ${result.sitemap.exists ? '✓' : '✗'}\n`;
    report += `  URL Count: ${result.sitemap.urlCount}\n`;
    if (result.sitemap.errors.length > 0) {
      report += `  Errors: ${result.sitemap.errors.join(', ')}\n`;
    }

    // Meta Robots
    report += `\nMeta Robots: ${result.metaRobots.tag || 'Not specified'}\n`;
    report += `  Indexable: ${result.metaRobots.isIndexable ? '✓' : '✗'}\n`;
    if (result.metaRobots.errors.length > 0) {
      report += `  Errors: ${result.metaRobots.errors.join(', ')}\n`;
    }

    report += `\nStatus: ${result.isValid ? '✓ PASS' : '✗ FAIL'}\n`;

    return report;
  }
}

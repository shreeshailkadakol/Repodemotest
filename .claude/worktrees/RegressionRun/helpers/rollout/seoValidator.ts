/**
 * SEO Validator Helper
 * Validates SEO metadata based on Azure DevOps ticket 297
 */

import { Page, expect } from '@playwright/test';
import { rolloutConfig } from '../../config/rollout-config';

export interface SEOValidationResult {
  title: {
    value: string | null;
    isValid: boolean;
    length: number;
    errors: string[];
  };
  metaDescription: {
    value: string | null;
    isValid: boolean;
    length: number;
    errors: string[];
  };
  canonical: {
    value: string | null;
    isValid: boolean;
    errors: string[];
  };
  hreflang: {
    tags: Array<{ hreflang: string; href: string }>;
    isValid: boolean;
    errors: string[];
  };
  openGraph: {
    title: string | null;
    description: string | null;
    image: string | null;
    isValid: boolean;
    errors: string[];
  };
  structuredData: {
    found: boolean;
    types: string[];
    isValid: boolean;
    errors: string[];
  };
}

export class SEOValidator {
  private page: Page;
  private config = rolloutConfig.seo;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Perform complete SEO validation
   */
  async validateSEO(): Promise<SEOValidationResult> {
    const result: SEOValidationResult = {
      title: await this.validateTitle(),
      metaDescription: await this.validateMetaDescription(),
      canonical: await this.validateCanonical(),
      hreflang: await this.validateHreflang(),
      openGraph: await this.validateOpenGraph(),
      structuredData: await this.validateStructuredData(),
    };

    return result;
  }

  /**
   * Validate page title
   */
  private async validateTitle(): Promise<SEOValidationResult['title']> {
    const errors: string[] = [];
    const titleElement = await this.page.locator('title').first();
    const title = await titleElement.textContent();
    const length = title?.length || 0;

    if (!title && this.config.requireTitle) {
      errors.push('Page title is missing');
    }

    if (title) {
      if (this.config.minTitleLength && length < this.config.minTitleLength) {
        errors.push(`Title too short (${length} chars, min: ${this.config.minTitleLength})`);
      }
      if (this.config.maxTitleLength && length > this.config.maxTitleLength) {
        errors.push(`Title too long (${length} chars, max: ${this.config.maxTitleLength})`);
      }
    }

    return {
      value: title,
      isValid: errors.length === 0,
      length,
      errors,
    };
  }

  /**
   * Validate meta description
   */
  private async validateMetaDescription(): Promise<SEOValidationResult['metaDescription']> {
    const errors: string[] = [];
    const metaDesc = await this.page.locator('meta[name="description"]').getAttribute('content');
    const length = metaDesc?.length || 0;

    if (!metaDesc && this.config.requireDescription) {
      errors.push('Meta description is missing');
    }

    if (metaDesc) {
      if (this.config.minDescriptionLength && length < this.config.minDescriptionLength) {
        errors.push(`Description too short (${length} chars, min: ${this.config.minDescriptionLength})`);
      }
      if (this.config.maxDescriptionLength && length > this.config.maxDescriptionLength) {
        errors.push(`Description too long (${length} chars, max: ${this.config.maxDescriptionLength})`);
      }
    }

    return {
      value: metaDesc,
      isValid: errors.length === 0,
      length,
      errors,
    };
  }

  /**
   * Validate canonical URL
   */
  private async validateCanonical(): Promise<SEOValidationResult['canonical']> {
    const errors: string[] = [];
    const canonical = await this.page.locator('link[rel="canonical"]').getAttribute('href');

    if (!canonical && this.config.requireCanonical) {
      errors.push('Canonical URL is missing');
    }

    if (canonical) {
      try {
        new URL(canonical); // Validate URL format
      } catch {
        errors.push(`Invalid canonical URL format: ${canonical}`);
      }
    }

    return {
      value: canonical,
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate hreflang tags
   */
  private async validateHreflang(): Promise<SEOValidationResult['hreflang']> {
    const errors: string[] = [];
    const hreflangLinks = await this.page.locator('link[rel="alternate"][hreflang]').all();
    const tags: Array<{ hreflang: string; href: string }> = [];

    for (const link of hreflangLinks) {
      const hreflang = await link.getAttribute('hreflang');
      const href = await link.getAttribute('href');

      if (hreflang && href) {
        tags.push({ hreflang, href });
      }
    }

    if (tags.length === 0 && this.config.requireHreflang) {
      errors.push('No hreflang tags found');
    }

    return {
      tags,
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate Open Graph tags
   */
  private async validateOpenGraph(): Promise<SEOValidationResult['openGraph']> {
    const errors: string[] = [];
    const ogTitle = await this.page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await this.page.locator('meta[property="og:description"]').getAttribute('content');
    const ogImage = await this.page.locator('meta[property="og:image"]').getAttribute('content');

    if (this.config.requireOgTags) {
      if (!ogTitle) errors.push('og:title is missing');
      if (!ogDescription) errors.push('og:description is missing');
      if (!ogImage) errors.push('og:image is missing');
    }

    return {
      title: ogTitle,
      description: ogDescription,
      image: ogImage,
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate structured data (JSON-LD)
   */
  private async validateStructuredData(): Promise<SEOValidationResult['structuredData']> {
    const errors: string[] = [];
    const types: string[] = [];

    try {
      const scripts = await this.page.locator('script[type="application/ld+json"]').all();
      const found = scripts.length > 0;

      for (const script of scripts) {
        const content = await script.textContent();
        if (content) {
          try {
            const data = JSON.parse(content);
            const type = data['@type'] || data.type;
            if (type) {
              types.push(Array.isArray(type) ? type.join(', ') : type);
            }
          } catch {
            errors.push('Invalid JSON-LD format');
          }
        }
      }

      return {
        found,
        types,
        isValid: errors.length === 0,
        errors,
      };
    } catch {
      return {
        found: false,
        types: [],
        isValid: true,
        errors: [],
      };
    }
  }

  /**
   * Generate SEO report
   */
  generateReport(result: SEOValidationResult, language: string): string {
    let report = `\n========== SEO VALIDATION REPORT (${language}) ==========\n`;
    report += `Page: ${this.page.url()}\n\n`;

    // Title
    report += `Title: ${result.title.isValid ? '✓' : '✗'}\n`;
    report += `  Value: ${result.title.value || 'N/A'}\n`;
    report += `  Length: ${result.title.length} characters\n`;
    if (result.title.errors.length > 0) {
      report += `  Errors: ${result.title.errors.join(', ')}\n`;
    }

    // Meta Description
    report += `\nMeta Description: ${result.metaDescription.isValid ? '✓' : '✗'}\n`;
    report += `  Value: ${result.metaDescription.value || 'N/A'}\n`;
    report += `  Length: ${result.metaDescription.length} characters\n`;
    if (result.metaDescription.errors.length > 0) {
      report += `  Errors: ${result.metaDescription.errors.join(', ')}\n`;
    }

    // Canonical
    report += `\nCanonical: ${result.canonical.isValid ? '✓' : '✗'}\n`;
    report += `  Value: ${result.canonical.value || 'N/A'}\n`;
    if (result.canonical.errors.length > 0) {
      report += `  Errors: ${result.canonical.errors.join(', ')}\n`;
    }

    // Hreflang
    report += `\nHreflang: ${result.hreflang.isValid ? '✓' : '✗'}\n`;
    report += `  Tags found: ${result.hreflang.tags.length}\n`;
    result.hreflang.tags.forEach((tag) => {
      report += `    - ${tag.hreflang}: ${tag.href}\n`;
    });

    // Open Graph
    report += `\nOpen Graph: ${result.openGraph.isValid ? '✓' : '✗'}\n`;
    report += `  og:title: ${result.openGraph.title || 'N/A'}\n`;
    report += `  og:description: ${result.openGraph.description || 'N/A'}\n`;
    report += `  og:image: ${result.openGraph.image || 'N/A'}\n`;

    // Structured Data
    report += `\nStructured Data: ${result.structuredData.isValid ? '✓' : '✗'}\n`;
    report += `  Found: ${result.structuredData.found ? 'Yes' : 'No'}\n`;
    if (result.structuredData.types.length > 0) {
      report += `  Types: ${result.structuredData.types.join(', ')}\n`;
    }

    return report;
  }
}

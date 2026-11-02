/**
 * Component Mapper
 * What:
 *   Loads page-component mapping JSON and provides lookup utilities
 *   used by componentTestRunner.ts and pageScanner.ts.
 * Why:
 *   Centralizes the page → component spec lookup so the orchestrator
 *   can determine which spec files to execute for a given URL.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { Page } from '@playwright/test';
import {
  getComponentByDataQa,
  isRegisteredComponent,
} from '../../config/component-registry';

export interface ComponentMappingEntry {
  dataQa: string;
  componentName: string;
  specFile: string;
  testTags: string[];
}

export interface PageMapping {
  url: string;
  pageName: string;
  environment: string;
  components: ComponentMappingEntry[];
  scannedAt?: string;
}

const MAPPING_FILE = path.resolve(process.cwd(), 'config/page-component-mapping.json');

export class ComponentMapper {
  private pages: PageMapping[] = [];

  constructor() {
    this.loadMappings();
  }

  private loadMappings(): void {
    try {
      if (fs.existsSync(MAPPING_FILE)) {
        const raw = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
        this.pages = Array.isArray(raw?.pages) ? raw.pages : [];
      } else {
        this.pages = [];
      }
    } catch {
      this.pages = [];
    }
  }

  private saveMappings(): void {
    fs.writeFileSync(
      MAPPING_FILE,
      JSON.stringify({ pages: this.pages }, null, 2),
      'utf-8'
    );
  }

  getPageByUrl(url: string): PageMapping | undefined {
    return this.pages.find((p) => p.url === url);
  }

  getAllPages(): PageMapping[] {
    return this.pages;
  }

  getComponentsForPage(url: string): ComponentMappingEntry[] {
    return this.getPageByUrl(url)?.components ?? [];
  }

  addPageMapping(mapping: PageMapping): void {
    this.pages = this.pages.filter((p) => p.url !== mapping.url);
    this.pages.push({ ...mapping, scannedAt: new Date().toISOString() });
    this.saveMappings();
  }

  /**
   * Scan a page in the browser and return only data-qa values that
   * are registered in the component registry.
   */
  async scanPageComponents(page: Page): Promise<string[]> {
    const allDataQa: string[] = await page.evaluate(() => {
      const seen = new Set<string>();
      document.querySelectorAll('[data-qa]').forEach((el) => {
        const v = el.getAttribute('data-qa');
        if (v) seen.add(v);
      });
      return Array.from(seen);
    });

    return allDataQa.filter(isRegisteredComponent);
  }

  async verifyComponentExists(page: Page, dataQa: string): Promise<boolean> {
    return (await page.locator(`[data-qa="${dataQa}"]`).count()) > 0;
  }

  exportToCSV(filePath: string = path.resolve(process.cwd(), 'config/page-component-mapping.csv')): void {
    const lines = ['pageName,url,environment,dataQa,componentName,specFile,testTags'];
    for (const p of this.pages) {
      for (const c of p.components) {
        lines.push(
          [
            JSON.stringify(p.pageName),
            JSON.stringify(p.url),
            p.environment,
            c.dataQa,
            c.componentName,
            c.specFile,
            JSON.stringify(c.testTags.join('|')),
          ].join(',')
        );
      }
    }
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  }

  generateSummary(): string {
    const totalPages = this.pages.length;
    const totalComponents = this.pages.reduce((sum, p) => sum + p.components.length, 0);
    return `[MAPPER] Pages: ${totalPages} | Total mapped components: ${totalComponents}`;
  }

  // Re-export registry helper for convenience
  static lookup(dataQa: string) {
    return getComponentByDataQa(dataQa);
  }
}

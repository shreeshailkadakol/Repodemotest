import { chromium, Browser, Page, BrowserContext } from '@playwright/test';
import { ComponentMapper, PageMapping } from '../utils/componentMapper';
import { BasePage } from '../utils/basePage';
import { getComponentByDataQa, isRegisteredComponent } from '../../config/component-registry';
import { CsvInputReader, PageInput } from './csvInputReader';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Page Scanner - Discovers components on production/QA pages
 * Generates mapping configuration automatically
 */

export class PageScanner {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private basePage: BasePage | null = null;
  private mapper: ComponentMapper;

  constructor() {
    this.mapper = new ComponentMapper();
  }

  /**
   * Initialize browser
   */
  async initialize(): Promise<void> {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.basePage = new BasePage(this.page, this.browser, this.context);
    console.log('✅ Browser initialized');
  }

  /**
   * Close browser
   */
  async close(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.browser) await this.browser.close();
    console.log('✅ Browser closed');
  }

  /**
   * Scan a single page and detect all components
   */
  async scanPage(url: string, authenticate: boolean = true): Promise<string[]> {
    if (!this.page || !this.basePage) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    console.log(`\n🔍 Scanning page: ${url}`);

    try {
      // Use BasePage authentication method
      await this.basePage.navigateWithAuthentication(url);
      
      // Accept cookies if banner exists
      await this.basePage.acceptCookiesBanner();

      // Wait for page to be fully loaded
      await this.page.waitForLoadState('load');
      await this.page.waitForTimeout(2000);

      // Scan for components
      const components = await this.mapper.scanPageComponents(this.page);
      
      console.log(`✅ Found ${components.length} components:`);
      components.forEach(comp => console.log(`   - ${comp}`));

      return components;
    } catch (error) {
      console.error(`❌ Error scanning page: ${error}`);
      return [];
    }
  }

  /**
   * Handle Vercel password authentication
   */
  /**
   * Generate component mapping for a page using component registry
   */
  async generatePageMapping(
    url: string,
    pageName: string,
    environment: string = 'qa'
  ): Promise<PageMapping | null> {
    const components = await this.scanPage(url);
    
    if (components.length === 0) {
      console.log('⚠️ No registered components found on page');
      return null;
    }

    // Map components using registry (already filtered by scanPage)
    const componentMappings = components.map(dataQa => {
      const componentDef = getComponentByDataQa(dataQa);
      
      if (!componentDef) {
        // Fallback (should not happen as scanPage filters)
        console.warn(`⚠️ Component ${dataQa} not found in registry`);
        return {
          dataQa,
          componentName: this.guessComponentName(dataQa),
          specFile: this.guessSpecFile(this.guessComponentName(dataQa)),
          testTags: [`@${this.guessComponentName(dataQa)}`, '@Functional']
        };
      }
      
      return {
        dataQa: componentDef.dataQa,
        componentName: componentDef.componentName,
        specFile: componentDef.specFile,
        testTags: componentDef.testTags
      };
    });

    const pageMapping: PageMapping = {
      url,
      pageName,
      environment,
      components: componentMappings
    };

    console.log(`\n✅ Generated mapping for ${pageName}`);
    return pageMapping;
  }

  /**
   * Guess component name from data-qa attribute
   */
  private guessComponentName(dataQa: string): string {
    // Convert kebab-case to PascalCase
    return dataQa
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  /**
   * Guess spec file path from component name
   */
  private guessSpecFile(componentName: string): string {
    // Convert PascalCase to kebab-case
    const fileName = componentName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
    
    return `tests/specs/${fileName}.spec.ts`;
  }

  /**
   * Scan multiple pages and update configuration
   */
  async scanAndUpdateConfig(pages: { url: string; pageName: string; environment?: string }[]): Promise<void> {
    await this.initialize();

    const newMappings: PageMapping[] = [];

    for (const pageInfo of pages) {
      const mapping = await this.generatePageMapping(
        pageInfo.url,
        pageInfo.pageName,
        pageInfo.environment || 'qa'
      );
      
      if (mapping) {
        newMappings.push(mapping);
      }
    }

    await this.close();

    // Update configuration
    if (newMappings.length > 0) {
      console.log(`\n📝 Updating configuration with ${newMappings.length} pages...`);
      
      newMappings.forEach(mapping => {
        this.mapper.addPageMapping(mapping);
      });

      // Export to CSV
      this.mapper.exportToCSV();
      
      console.log('✅ Configuration updated successfully');
      console.log(this.mapper.generateSummary());
    }
  }

  /**
   * Verify components exist on page
   */
  async verifyPageComponents(url: string): Promise<{ component: string; exists: boolean }[]> {
    if (!this.page) {
      await this.initialize();
    }

    const components = this.mapper.getComponentsForPage(url);
    const results: { component: string; exists: boolean }[] = [];

    console.log(`\n🔍 Verifying components on: ${url}`);

    for (const comp of components) {
      const exists = await this.mapper.verifyComponentExists(this.page!, comp.dataQa);
      results.push({ component: comp.dataQa, exists });
      
      const status = exists ? '✅' : '❌';
      console.log(`${status} ${comp.componentName} (${comp.dataQa})`);
    }

    return results;
  }
}

// CLI Usage
if (require.main === module) {
  const scanner = new PageScanner();
  
  // Read pages from CSV input
  const csvReader = new CsvInputReader();
  
  if (!csvReader.validateCsv()) {
    console.error('❌ Invalid CSV format. Please fix and try again.');
    process.exit(1);
  }
  
  const pageInputs = csvReader.readPageInputs();
  const pagesToScan = pageInputs
    .filter(p => p.runTests)
    .map(p => ({
      url: p.pageUrl,
      pageName: p.pageName,
      environment: p.environment
    }));

  console.log(`\n📋 Scanning ${pagesToScan.length} pages from CSV input...\n`);

  scanner.scanAndUpdateConfig(pagesToScan)
    .then(() => {
      console.log('\n✅ Scanning complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Scanning failed:', error);
      process.exit(1);
    });
}

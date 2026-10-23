import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { getComponentByDataQa, isRegisteredComponent } from '../../config/component-registry';

/**
 * Component Mapper Utility
 * Maps page URLs to their components and manages test execution
 */

export interface ComponentMapping {
  dataQa: string;
  componentName: string;
  specFile: string;
  testTags: string[];
}

export interface PageMapping {
  url: string;
  pageName: string;
  environment: string;
  components: ComponentMapping[];
}

export interface PageComponentConfig {
  pages: PageMapping[];
}

export class ComponentMapper {
  private config: PageComponentConfig;
  private configPath: string;

  constructor(configPath: string = 'config/page-component-mapping.json') {
    this.configPath = path.resolve(process.cwd(), configPath);
    this.loadConfig();
  }

  /**
   * Load the page-component mapping configuration
   */
  private loadConfig(): void {
    try {
      if (!fs.existsSync(this.configPath)) {
        console.log(`ℹ️  Config file not found, creating empty mapping...`);
        this.config = { pages: [] };
        return;
      }
      
      const configContent = fs.readFileSync(this.configPath, 'utf-8');
      this.config = JSON.parse(configContent);
      console.log(`✅ Loaded mapping config with ${this.config.pages.length} pages`);
    } catch (error) {
      console.error(`❌ Failed to load config from ${this.configPath}:`, error);
      this.config = { pages: [] };
    }
  }

  /**
   * Get all page mappings
   */
  getAllPages(): PageMapping[] {
    return this.config.pages;
  }

  /**
   * Get page mapping by URL
   */
  getPageByUrl(url: string): PageMapping | undefined {
    return this.config.pages.find(page => page.url === url);
  }

  /**
   * Get page mapping by name
   */
  getPageByName(pageName: string): PageMapping | undefined {
    return this.config.pages.find(page => 
      page.pageName.toLowerCase() === pageName.toLowerCase()
    );
  }

  /**
   * Get all components for a specific page
   */
  getComponentsForPage(pageUrl: string): ComponentMapping[] {
    const page = this.getPageByUrl(pageUrl);
    return page ? page.components : [];
  }

  /**
   * Scan page and detect components
   */
  /**
   * Scan page for registered components only (filters out sub-elements)
   * Scans both data-qa and data-testid attributes
   */
  async scanPageComponents(page: Page): Promise<string[]> {
    try {
      const allDataQa = await page.evaluate(() => {
        const componentSet = new Set<string>();
        
        // Check data-qa attributes
        document.querySelectorAll('[data-qa]').forEach(el => {
          const dataQa = el.getAttribute('data-qa');
          if (dataQa) componentSet.add(dataQa);
        });
        
        // Check data-testid attributes
        document.querySelectorAll('[data-testid]').forEach(el => {
          const dataTestId = el.getAttribute('data-testid');
          if (dataTestId) componentSet.add(dataTestId);
        });
        
        return Array.from(componentSet);
      });

      // Filter to only registered components (not sub-elements)
      const registeredComponents = allDataQa.filter(dataQa => isRegisteredComponent(dataQa));

      console.log(`✅ Found ${allDataQa.length} total data-qa/data-testid attributes`);
      console.log(`✅ Filtered to ${registeredComponents.length} registered components`);
      
      return registeredComponents;
    } catch (error) {
      console.error('❌ Error scanning page components:', error);
      return [];
    }
  }

  /**
   * Verify component exists on page
   */
  async verifyComponentExists(page: Page, dataQa: string): Promise<boolean> {
    try {
      const count = await page.locator(`[data-qa="${dataQa}"]`).count();
      return count > 0;
    } catch (error) {
      console.error(`❌ Error checking component ${dataQa}:`, error);
      return false;
    }
  }

  /**
   * Get component spec file path
   */
  getSpecFileForComponent(pageUrl: string, dataQa: string): string | null {
    const components = this.getComponentsForPage(pageUrl);
    const component = components.find(c => c.dataQa === dataQa);
    return component ? component.specFile : null;
  }

  /**
   * Generate summary report
   */
  generateSummary(): string {
    let summary = '\n📊 Component Mapper Summary\n';
    summary += '═'.repeat(50) + '\n';
    
    this.config.pages.forEach(page => {
      summary += `\n📄 ${page.pageName}\n`;
      summary += `   URL: ${page.url}\n`;
      summary += `   Components: ${page.components.length}\n`;
      page.components.forEach(comp => {
        summary += `   - ${comp.componentName} (${comp.dataQa})\n`;
      });
    });
    
    return summary;
  }

  /**
   * Add new page mapping
   */
  addPageMapping(pageMapping: PageMapping): void {
    this.config.pages.push(pageMapping);
    this.saveConfig();
  }

  /**
   * Update existing page mapping
   */
  updatePageMapping(url: string, updatedMapping: PageMapping): void {
    const index = this.config.pages.findIndex(page => page.url === url);
    if (index !== -1) {
      this.config.pages[index] = updatedMapping;
      this.saveConfig();
    }
  }

  /**
   * Save configuration to file
   */
  private saveConfig(): void {
    try {
      fs.writeFileSync(
        this.configPath,
        JSON.stringify(this.config, null, 2),
        'utf-8'
      );
      console.log('✅ Configuration saved successfully');
    } catch (error) {
      console.error('❌ Error saving configuration:', error);
    }
  }

  /**
   * Export mapping to CSV
   */
  exportToCSV(outputPath: string = 'config/page-component-mapping.csv'): void {
    const csvPath = path.resolve(process.cwd(), outputPath);
    let csvContent = 'PageURL,PageName,ComponentName,DataQA,SpecFile,TestTags\n';
    
    this.config.pages.forEach(page => {
      page.components.forEach(comp => {
        csvContent += `"${page.url}","${page.pageName}","${comp.componentName}","${comp.dataQa}","${comp.specFile}","${comp.testTags.join(';')}"\n`;
      });
    });

    try {
      fs.writeFileSync(csvPath, csvContent, 'utf-8');
      console.log(`✅ CSV exported to ${csvPath}`);
    } catch (error) {
      console.error('❌ Error exporting CSV:', error);
    }
  }
}

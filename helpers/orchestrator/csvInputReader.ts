import * as fs from 'fs';
import * as path from 'path';

/**
 * CSV Input Reader for Page URLs
 * Reads pages-to-scan.csv and returns page configurations
 */

export interface PageInput {
  pageName: string;
  pageUrl: string;
  environment: string;
  runTests: boolean;
}

export class CsvInputReader {
  private csvPath: string;

  constructor(csvPath: string = 'config/pages-to-scan.csv') {
    this.csvPath = path.resolve(process.cwd(), csvPath);
  }

  /**
   * Read CSV file and parse page inputs
   */
  readPageInputs(): PageInput[] {
    try {
      const csvContent = fs.readFileSync(this.csvPath, 'utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      // Skip header row
      const dataLines = lines.slice(1);
      
      const pageInputs: PageInput[] = dataLines.map(line => {
        const [pageName, pageUrl, environment, runTests] = this.parseCsvLine(line);
        
        return {
          pageName: pageName.trim(),
          pageUrl: pageUrl.trim(),
          environment: environment.trim() || 'qa',
          runTests: runTests.trim().toLowerCase() === 'true'
        };
      });

      console.log(`✅ Loaded ${pageInputs.length} pages from CSV`);
      return pageInputs;
    } catch (error) {
      console.error(`❌ Error reading CSV file ${this.csvPath}:`, error);
      throw error;
    }
  }

  /**
   * Parse CSV line handling quoted values with commas
   */
  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  /**
   * Validate CSV format
   */
  validateCsv(): boolean {
    try {
      const csvContent = fs.readFileSync(this.csvPath, 'utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        console.error('❌ CSV must have header and at least one data row');
        return false;
      }

      const header = lines[0];
      const expectedHeader = 'PageName,PageURL,Environment,RunTests';
      
      if (!header.includes('PageName') || !header.includes('PageURL')) {
        console.error('❌ CSV header must include PageName and PageURL');
        return false;
      }

      console.log('✅ CSV format is valid');
      return true;
    } catch (error) {
      console.error('❌ CSV validation failed:', error);
      return false;
    }
  }

  /**
   * Create sample CSV file
   */
  static createSampleCsv(outputPath: string = 'config/pages-to-scan.csv'): void {
    const sampleContent = `PageName,PageURL,Environment,RunTests
Homepage,https://bayer-beyond-qa-uk.vercel.app/en/,qa,true
TeaserGrid Test Page,https://bayer-beyond-qa-uk.vercel.app/en/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Sprint-9/TeaserGrid,qa,true
Early Careers,https://bayer-beyond-qa-uk.vercel.app/en/career/Early-Careers,qa,true
Search Page,https://bayer-beyond-qa-uk.vercel.app/en/search,qa,true`;

    const resolvedPath = path.resolve(process.cwd(), outputPath);
    fs.writeFileSync(resolvedPath, sampleContent, 'utf-8');
    console.log(`✅ Sample CSV created at ${resolvedPath}`);
  }
}

// CLI Usage
if (require.main === module) {
  const reader = new CsvInputReader();
  
  if (process.argv[2] === 'create-sample') {
    CsvInputReader.createSampleCsv();
  } else if (process.argv[2] === 'validate') {
    reader.validateCsv();
  } else {
    console.log('📖 Reading pages from CSV...\n');
    const pages = reader.readPageInputs();
    
    console.log('\n📊 Page Configuration:');
    console.log('═'.repeat(60));
    pages.forEach((page, index) => {
      console.log(`\n${index + 1}. ${page.pageName}`);
      console.log(`   URL: ${page.pageUrl}`);
      console.log(`   Environment: ${page.environment}`);
      console.log(`   Run Tests: ${page.runTests ? '✅ Yes' : '❌ No'}`);
    });
  }
}

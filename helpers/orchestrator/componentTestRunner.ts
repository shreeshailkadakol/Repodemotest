import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { ComponentMapper } from '../utils/componentMapper';

const execPromise = promisify(exec);

/**
 * Component Test Runner
 * Executes actual component spec files based on page-component mapping
 */

export interface TestRunResult {
  component: string;
  specFile: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export interface PageTestResult {
  pageName: string;
  pageUrl: string;
  totalComponents: number;
  testsRun: number;
  testsPassed: number;
  testsFailed: number;
  componentResults: TestRunResult[];
  duration: number;
}

export class ComponentTestRunner {
  private mapper: ComponentMapper;

  constructor() {
    this.mapper = new ComponentMapper();
  }

  /**
   * Run all component specs for a specific page
   */
  async runTestsForPage(pageUrl: string, project: string = 'chromium'): Promise<PageTestResult> {
    const startTime = Date.now();
    const pageMapping = this.mapper.getPageByUrl(pageUrl);
    
    if (!pageMapping) {
      throw new Error(`No mapping found for page: ${pageUrl}`);
    }

    console.log(`\n${'='.repeat(70)}`);
    console.log(`🧪 Running tests for: ${pageMapping.pageName}`);
    console.log(`📄 URL: ${pageUrl}`);
    console.log(`🔢 Components to test: ${pageMapping.components.length}`);
    console.log('='.repeat(70));

    const componentResults: TestRunResult[] = [];
    
    for (const component of pageMapping.components) {
      console.log(`\n▶️  Testing ${component.componentName}...`);
      
      const result = await this.runComponentSpec(
        component.specFile,
        component.componentName,
        project
      );
      
      componentResults.push(result);
      
      const status = result.passed ? '✅ PASSED' : '❌ FAILED';
      console.log(`   ${status} - ${result.duration}ms`);
    }

    const duration = Date.now() - startTime;
    const testsPassed = componentResults.filter(r => r.passed).length;
    const testsFailed = componentResults.filter(r => !r.passed).length;

    return {
      pageName: pageMapping.pageName,
      pageUrl,
      totalComponents: pageMapping.components.length,
      testsRun: componentResults.length,
      testsPassed,
      testsFailed,
      componentResults,
      duration
    };
  }

  /**
   * Run a single component spec file
   */
  private async runComponentSpec(
    specFile: string,
    componentName: string,
    project: string
  ): Promise<TestRunResult> {
    const startTime = Date.now();
    
    try {
      // Check if spec file exists
      const specPath = path.resolve(process.cwd(), specFile);
      if (!fs.existsSync(specPath)) {
        return {
          component: componentName,
          specFile,
          passed: false,
          duration: Date.now() - startTime,
          error: 'Spec file not found'
        };
      }

      // Run Playwright test for this spec file
      const command = `npx playwright test ${specFile} --project=${project} --workers=1`;
      
      const { stdout, stderr } = await execPromise(command, {
        cwd: process.cwd(),
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });

      const duration = Date.now() - startTime;
      
      // Check if tests passed (simple check based on exit code)
      return {
        component: componentName,
        specFile,
        passed: true,
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      // Playwright returns exit code 1 for test failures
      // We consider this as "ran but failed" rather than error
      return {
        component: componentName,
        specFile,
        passed: false,
        duration,
        error: error.message
      };
    }
  }

  /**
   * Run tests for all pages in mapping
   */
  async runAllPageTests(project: string = 'chromium'): Promise<PageTestResult[]> {
    const allPages = this.mapper.getAllPages();
    const results: PageTestResult[] = [];

    console.log('\n' + '='.repeat(70));
    console.log('🚀 COMPONENT MAPPER - FULL TEST EXECUTION');
    console.log('='.repeat(70));
    console.log(`📊 Total pages to test: ${allPages.length}`);
    console.log(`🖥️  Browser: ${project}`);
    console.log('='.repeat(70));

    for (const page of allPages) {
      const result = await this.runTestsForPage(page.url, project);
      results.push(result);
    }

    // Print summary
    this.printSummary(results);

    return results;
  }

  /**
   * Run tests for specific components only
   */
  async runTestsForComponents(
    componentNames: string[],
    project: string = 'chromium'
  ): Promise<TestRunResult[]> {
    const allPages = this.mapper.getAllPages();
    const results: TestRunResult[] = [];

    console.log(`\n🎯 Running tests for specific components: ${componentNames.join(', ')}`);

    for (const page of allPages) {
      const componentsToTest = page.components.filter(c =>
        componentNames.includes(c.componentName)
      );

      for (const component of componentsToTest) {
        console.log(`\n▶️  Testing ${component.componentName} on ${page.pageName}...`);
        
        const result = await this.runComponentSpec(
          component.specFile,
          component.componentName,
          project
        );
        
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Print test execution summary
   */
  private printSummary(results: PageTestResult[]): void {
    console.log('\n' + '='.repeat(70));
    console.log('📊 TEST EXECUTION SUMMARY');
    console.log('='.repeat(70));

    const totalComponents = results.reduce((sum, r) => sum + r.totalComponents, 0);
    const totalPassed = results.reduce((sum, r) => sum + r.testsPassed, 0);
    const totalFailed = results.reduce((sum, r) => sum + r.testsFailed, 0);
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    results.forEach(result => {
      console.log(`\n📄 ${result.pageName}`);
      console.log(`   URL: ${result.pageUrl}`);
      console.log(`   Components: ${result.totalComponents}`);
      console.log(`   ✅ Passed: ${result.testsPassed}`);
      console.log(`   ❌ Failed: ${result.testsFailed}`);
      console.log(`   ⏱️  Duration: ${(result.duration / 1000).toFixed(2)}s`);
    });

    console.log('\n' + '-'.repeat(70));
    console.log(`Total Components Tested: ${totalComponents}`);
    console.log(`✅ Total Passed: ${totalPassed}`);
    console.log(`❌ Total Failed: ${totalFailed}`);
    console.log(`⏱️  Total Duration: ${(totalDuration / 1000).toFixed(2)}s`);
    console.log('='.repeat(70));

    if (totalFailed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! 🎉\n');
    } else {
      console.log('\n⚠️  SOME TESTS FAILED - Review results above\n');
    }
  }

  /**
   * Generate HTML report
   */
  generateHtmlReport(results: PageTestResult[], outputPath: string = 'reports/component-mapper-report.html'): void {
    const totalComponents = results.reduce((sum, r) => sum + r.totalComponents, 0);
    const totalPassed = results.reduce((sum, r) => sum + r.testsPassed, 0);
    const totalFailed = results.reduce((sum, r) => sum + r.testsFailed, 0);
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Component Mapper Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
    .summary-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
    .summary-card.passed { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); }
    .summary-card.failed { background: linear-gradient(135deg, #f44336 0%, #da190b 100%); }
    .summary-card h2 { margin: 0; font-size: 2.5em; }
    .summary-card p { margin: 5px 0 0 0; font-size: 0.9em; }
    .page-section { margin: 30px 0; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .page-header { background: #667eea; color: white; padding: 15px; font-size: 1.2em; }
    .component-list { padding: 0; margin: 0; list-style: none; }
    .component-item { padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
    .component-item:last-child { border-bottom: none; }
    .component-item:hover { background: #f9f9f9; }
    .status { padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 0.9em; }
    .status.passed { background: #4CAF50; color: white; }
    .status.failed { background: #f44336; color: white; }
    .timestamp { text-align: center; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🧪 Component Mapper Test Report</h1>
    
    <div class="summary">
      <div class="summary-card">
        <h2>${results.length}</h2>
        <p>Pages Tested</p>
      </div>
      <div class="summary-card">
        <h2>${totalComponents}</h2>
        <p>Components</p>
      </div>
      <div class="summary-card passed">
        <h2>${totalPassed}</h2>
        <p>Passed</p>
      </div>
      <div class="summary-card failed">
        <h2>${totalFailed}</h2>
        <p>Failed</p>
      </div>
    </div>

    ${results.map(page => `
      <div class="page-section">
        <div class="page-header">
          📄 ${page.pageName}
          <div style="font-size: 0.8em; margin-top: 5px; opacity: 0.9;">${page.pageUrl}</div>
        </div>
        <ul class="component-list">
          ${page.componentResults.map(comp => `
            <li class="component-item">
              <div>
                <strong>${comp.component}</strong>
                <div style="font-size: 0.85em; color: #666;">${comp.specFile}</div>
              </div>
              <div>
                <span class="status ${comp.passed ? 'passed' : 'failed'}">
                  ${comp.passed ? '✅ PASSED' : '❌ FAILED'}
                </span>
                <span style="margin-left: 10px; color: #999;">${comp.duration}ms</span>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('')}

    <div class="timestamp">
      Generated on ${new Date().toLocaleString()}
    </div>
  </div>
</body>
</html>
    `;

    const resolvedPath = path.resolve(process.cwd(), outputPath);
    const dir = path.dirname(resolvedPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(resolvedPath, html, 'utf-8');
    console.log(`\n📊 HTML Report generated: ${resolvedPath}`);
  }
}

// CLI Usage
if (require.main === module) {
  const runner = new ComponentTestRunner();
  const project = process.argv[2] || 'chromium';

  runner.runAllPageTests(project)
    .then(results => {
      runner.generateHtmlReport(results);
      
      const totalFailed = results.reduce((sum, r) => sum + r.testsFailed, 0);
      process.exit(totalFailed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

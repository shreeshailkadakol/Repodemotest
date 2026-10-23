/**
 * Selector Health Reporter
 * 
 * Custom Playwright reporter that tracks and reports selector health
 * Generates reports after test runs showing which selectors are brittle
 */

import {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';
import * as fs from 'fs/promises';
import * as path from 'path';
import { smartLocator } from './smartLocator';

export default class SelectorHealthReporter implements Reporter {
  private outputDir: string;
  private config: FullConfig | undefined;

  constructor(options: { outputDir?: string } = {}) {
    this.outputDir = options.outputDir || './reports/selector-health';
  }

  async onBegin(config: FullConfig, suite: Suite): Promise<void> {
    this.config = config;
    console.log('🩺 Selector Health Monitoring: ENABLED');

    // Create output directory
    await fs.mkdir(this.outputDir, { recursive: true });
  }

  async onEnd(result: FullResult): Promise<void> {
    console.log('\n📊 Generating Selector Health Report...');

    const healthReport = smartLocator.getHealthReport();

    // Generate HTML report
    await this.generateHTMLReport(healthReport);

    // Generate JSON report
    await this.generateJSONReport(healthReport);

    // Print summary to console
    this.printConsoleSummary(healthReport);

    // Reset for next run
    smartLocator.reset();
  }

  private async generateHTMLReport(healthReport: any): Promise<void> {
    const htmlPath = path.join(this.outputDir, 'selector-health.html');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Selector Health Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #667eea;
    }
    .stat-label {
      color: #666;
      margin-top: 5px;
    }
    .section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background: #f0f0f0;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #ddd;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .success {
      background: #d4edda;
      border-left: 4px solid #28a745;
      padding: 15px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    .badge-semantic { background: #28a745; color: white; }
    .badge-data { background: #17a2b8; color: white; }
    .badge-css { background: #ffc107; color: black; }
    .badge-xpath { background: #dc3545; color: white; }
    .health-bar {
      width: 100%;
      height: 20px;
      background: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      margin-top: 10px;
    }
    .health-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #28a745, #20c997);
      transition: width 0.3s ease;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🩺 Selector Health Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
  </div>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-value">${healthReport.totalElements}</div>
      <div class="stat-label">Total Elements Tested</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${healthReport.needsAttention.length}</div>
      <div class="stat-label">Need Attention</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${((healthReport.totalElements - healthReport.needsAttention.length) / healthReport.totalElements * 100).toFixed(1)}%</div>
      <div class="stat-label">Healthy Selectors</div>
    </div>
  </div>

  ${healthReport.totalElements === 0 ? '<div class="warning">⚠️ No selector data collected. Ensure SmartLocator is being used in tests.</div>' : ''}

  ${healthReport.needsAttention.length === 0 ? '<div class="success">✅ All selectors are healthy! No immediate action needed.</div>' : `
  <div class="section">
    <div class="section-title">⚠️ Selectors Needing Attention</div>
    <p>These selectors required fallback strategies to locate elements. Consider updating tests to use more resilient selectors.</p>
    <table>
      <thead>
        <tr>
          <th>Element</th>
          <th>Working Selector</th>
          <th>Type</th>
          <th>Attempts</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        ${healthReport.needsAttention.map((report: any) => `
          <tr>
            <td>${report.elementDescription}</td>
            <td><code>${report.workingSelector}</code></td>
            <td><span class="badge badge-${this.getBadgeClass(report.selectorType)}">${report.selectorType}</span></td>
            <td>${report.attemptsUntilSuccess}</td>
            <td>${new Date(report.timestamp).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  `}

  <div class="section">
    <div class="section-title">📈 Selector Success Rates</div>
    <table>
      <thead>
        <tr>
          <th>Selector</th>
          <th>Success Rate</th>
          <th>Attempts</th>
        </tr>
      </thead>
      <tbody>
        ${Array.from(healthReport.selectorSuccessRates.entries())
          .sort(([, a], [, b]) => b.rate - a.rate)
          .map(([selector, stats]: [string, any]) => `
          <tr>
            <td><code>${selector}</code></td>
            <td>
              <div>${(stats.rate * 100).toFixed(1)}%</div>
              <div class="health-bar">
                <div class="health-bar-fill" style="width: ${stats.rate * 100}%"></div>
              </div>
            </td>
            <td>${stats.attempts}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">💡 Recommendations</div>
    <ul>
      <li><strong>Semantic Selectors (Best):</strong> Use role, label, placeholder - most resilient to UI changes</li>
      <li><strong>Data Attributes (Good):</strong> Use data-testid, data-qa - better than CSS, easier to maintain</li>
      <li><strong>CSS Selectors (Acceptable):</strong> Use sparingly, prefer specific classes over complex selectors</li>
      <li><strong>XPath (Avoid):</strong> Brittle and hard to maintain, use only as last resort</li>
    </ul>
    ${healthReport.needsAttention.length > 0 ? `
      <div class="warning">
        <strong>Action Required:</strong> ${healthReport.needsAttention.length} selector(s) needed fallbacks. 
        Review the "Selectors Needing Attention" section and update tests to use primary selectors.
      </div>
    ` : ''}
  </div>
</body>
</html>
    `.trim();

    await fs.writeFile(htmlPath, html);
    console.log(`✅ HTML report: ${htmlPath}`);
  }

  private async generateJSONReport(healthReport: any): Promise<void> {
    const jsonPath = path.join(this.outputDir, 'selector-health.json');

    const jsonReport = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalElements: healthReport.totalElements,
        needsAttention: healthReport.needsAttention.length,
        healthyPercentage:
          healthReport.totalElements > 0
            ? ((healthReport.totalElements - healthReport.needsAttention.length) /
                healthReport.totalElements) *
              100
            : 0,
      },
      elementsNeedingAttention: healthReport.needsAttention,
      selectorSuccessRates: Array.from(healthReport.selectorSuccessRates.entries()).map(
        ([selector, stats]: [string, any]) => ({
          selector,
          successRate: stats.rate,
          attempts: stats.attempts,
        })
      ),
    };

    await fs.writeFile(jsonPath, JSON.stringify(jsonReport, null, 2));
    console.log(`✅ JSON report: ${jsonPath}`);
  }

  private printConsoleSummary(healthReport: any): void {
    console.log('\n' + '='.repeat(60));
    console.log('🩺 SELECTOR HEALTH SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Elements: ${healthReport.totalElements}`);
    console.log(`Needs Attention: ${healthReport.needsAttention.length}`);
    console.log(
      `Health Score: ${healthReport.totalElements > 0 ? ((healthReport.totalElements - healthReport.needsAttention.length) / healthReport.totalElements * 100).toFixed(1) : 0}%`
    );

    if (healthReport.needsAttention.length > 0) {
      console.log('\n⚠️  Elements needing attention:');
      healthReport.needsAttention.slice(0, 5).forEach((report: any) => {
        console.log(`  - ${report.elementDescription} (${report.attemptsUntilSuccess} attempts)`);
      });
      if (healthReport.needsAttention.length > 5) {
        console.log(`  ... and ${healthReport.needsAttention.length - 5} more`);
      }
    }

    console.log('='.repeat(60) + '\n');
  }

  private getBadgeClass(selectorType: string): string {
    if (selectorType.startsWith('semantic')) return 'semantic';
    if (selectorType.startsWith('data')) return 'data';
    if (selectorType.includes('css') || selectorType.includes('id')) return 'css';
    if (selectorType.includes('xpath')) return 'xpath';
    return 'css';
  }
}

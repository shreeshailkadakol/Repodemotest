/**
 * Component Mapper - Market Smoke Test
 * What:
 *   Validates that configured market homepages respond correctly and render
 *   expected page content after deployment.
 * Why:
 *   Created as a quick production health gate to detect broad site issues
 *   before deeper component-level validation begins.
 *
 * Usage:
 *   npx ts-node scripts/smoke-test.ts
 *   npx ts-node scripts/smoke-test.ts --config config/MarketURLs.json
 *   npx ts-node scripts/smoke-test.ts --parallel 5
 *
 * Config: config/MarketURLs.json
 */

import { chromium, Browser, Page, BrowserContext } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface MarketConfig {
  market: string;
  url: string;
  expectedTitle?: string;
  expectedText?: string;
  selector?: string;
}

interface CheckResult {
  market: string;
  url: string;
  status: 'PASS' | 'FAIL';
  httpStatus: number | string;
  responseTime: string;
  attempts: number;
  error: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 20_000;
const NAVIGATION_TIMEOUT_MS = 30_000;
const ERROR_PAGE_PATTERNS = [
  'Server Error',
  'Application Error',
  '404 Not Found',
  '404 - Page Not Found',
  'Page Not Found',
  'Internal Server Error',
  '503 Service Unavailable',
  'This page isn\'t working',
  'HTTP ERROR',
];

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------
function parseArgs(): { configPath: string; parallel: number } {
  const args = process.argv.slice(2);
  let configPath = path.resolve(__dirname, '..', 'config', 'MarketURLs.json');
  let parallel = 3;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' && args[i + 1]) {
      configPath = path.resolve(args[i + 1]);
      i++;
    }
    if (args[i] === '--parallel' && args[i + 1]) {
      parallel = parseInt(args[i + 1], 10) || 3;
      i++;
    }
  }

  return { configPath, parallel };
}

// ---------------------------------------------------------------------------
// Load market config
// ---------------------------------------------------------------------------
function loadMarkets(configPath: string): MarketConfig[] {
  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(configPath, 'utf-8');
  const markets: MarketConfig[] = JSON.parse(raw);

  if (!Array.isArray(markets) || markets.length === 0) {
    console.error('Config file must contain a non-empty array of market objects.');
    process.exit(1);
  }

  return markets;
}

// ---------------------------------------------------------------------------
// Delay helper
// ---------------------------------------------------------------------------
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Single market validation
// ---------------------------------------------------------------------------
async function validateMarket(
  browser: Browser,
  market: MarketConfig
): Promise<CheckResult> {
  let lastError = '';
  let attempts = 0;
  let httpStatus: number | string = 0;
  let responseTime = '0ms';

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    attempts = attempt;
    let context: BrowserContext | null = null;
    let page: Page | null = null;

    try {
      context = await browser.newContext({
        ignoreHTTPSErrors: true,
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      });
      page = await context.newPage();

      // Navigate and measure load time
      const startTime = Date.now();
      const response = await page.goto(market.url, {
        waitUntil: 'domcontentloaded',
        timeout: NAVIGATION_TIMEOUT_MS,
      });
      const elapsed = Date.now() - startTime;
      responseTime = `${elapsed}ms`;

      // 1. HTTP status check
      httpStatus = response?.status() ?? 'N/A';
      if (typeof httpStatus === 'number' && httpStatus !== 200) {
        throw new Error(`HTTP ${httpStatus} (expected 200)`);
      }

      // 2. Error page content check
      const bodyText = await page.textContent('body');
      if (bodyText) {
        for (const pattern of ERROR_PAGE_PATTERNS) {
          if (bodyText.includes(pattern)) {
            throw new Error(`Error page detected: found "${pattern}" in page body`);
          }
        }
      }

      // 3. Title check
      const pageTitle = await page.title();
      if (!pageTitle || pageTitle.trim().length === 0) {
        throw new Error('Page has no title');
      }

      // 4. Expected title check
      if (market.expectedTitle) {
        const fullContent = bodyText ?? '';
        const titleMatch =
          pageTitle.toLowerCase().includes(market.expectedTitle.toLowerCase()) ||
          fullContent.toLowerCase().includes(market.expectedTitle.toLowerCase());
        if (!titleMatch) {
          throw new Error(
            `Expected title/content "${market.expectedTitle}" not found. Actual title: "${pageTitle}"`
          );
        }
      }

      // 5. Expected text check (optional)
      if (market.expectedText) {
        const fullContent = bodyText ?? '';
        if (!fullContent.toLowerCase().includes(market.expectedText.toLowerCase())) {
          throw new Error(`Expected text "${market.expectedText}" not found on page`);
        }
      }

      // 6. Selector check (optional)
      if (market.selector) {
        const element = await page.$(market.selector);
        if (!element) {
          throw new Error(`Expected selector "${market.selector}" not found on page`);
        }
      }

      // All checks passed
      await context.close();
      return {
        market: market.market,
        url: market.url,
        status: 'PASS',
        httpStatus,
        responseTime,
        attempts,
        error: '',
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : String(err);

      // Capture screenshot on failure
      if (page) {
        const screenshotDir = path.resolve(__dirname, '..', 'screenshots', 'smoke-test');
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }
        const safeName = market.market.replace(/[^a-zA-Z0-9]/g, '_');
        await page
          .screenshot({
            path: path.join(screenshotDir, `${safeName}_attempt${attempt}.png`),
            fullPage: true,
          })
          .catch(() => {
            /* screenshot best-effort */
          });
      }

      if (context) {
        await context.close().catch(() => {});
      }

      // Retry with delay if not last attempt
      if (attempt < MAX_RETRIES) {
        console.log(
          `  [${market.market}] Attempt ${attempt} failed: ${lastError}. Retrying in ${RETRY_DELAY_MS / 1000}s...`
        );
        await delay(RETRY_DELAY_MS);
      }
    }
  }

  return {
    market: market.market,
    url: market.url,
    status: 'FAIL',
    httpStatus,
    responseTime,
    attempts,
    error: lastError,
  };
}

// ---------------------------------------------------------------------------
// Parallel execution with concurrency limit
// ---------------------------------------------------------------------------
async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const currentIndex = index++;
      results[currentIndex] = await fn(items[currentIndex]);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () =>
    worker()
  );
  await Promise.all(workers);
  return results;
}

// ---------------------------------------------------------------------------
// Print results table
// ---------------------------------------------------------------------------
function printResults(results: CheckResult[]): void {
  console.log('\n  POST-DEPLOYMENT SMOKE TEST RESULTS\n');

  // Build table data for console.table
  const tableData = results.map((r) => ({
    Market: r.market,
    URL: r.url,
    Status: r.status,
    HTTP: r.httpStatus,
    'Response Time': r.responseTime,
    Attempts: r.attempts,
    Error: r.error || '-',
  }));

  console.table(tableData);

  // Summary
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`\n  Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n  FAILED MARKETS:');
    for (const r of results.filter((r) => r.status === 'FAIL')) {
      console.log(`    - ${r.market} (${r.url}): ${r.error}`);
    }
  }

  console.log('');
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  const { configPath, parallel } = parseArgs();

  console.log('Post-Deployment Smoke Test');
  console.log(`Config: ${configPath}`);
  console.log(`Parallel workers: ${parallel}`);
  console.log(`Max retries per market: ${MAX_RETRIES}`);
  console.log(`Retry delay: ${RETRY_DELAY_MS / 1000}s\n`);

  const markets = loadMarkets(configPath);
  console.log(`Loaded ${markets.length} market(s) to validate.\n`);

  const browser = await chromium.launch({ headless: false });

  try {
    const results = await runWithConcurrency(markets, parallel, (market) =>
      validateMarket(browser, market)
    );

    printResults(results);

    const hasFailures = results.some((r) => r.status === 'FAIL');
    if (hasFailures) {
      process.exit(1);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

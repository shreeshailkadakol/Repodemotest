/**
 * Component Mapper - Page Validator
 * What:
 *   Single command that scans a page, detects registered components,
 *   executes mapped tests in page mode, and generates a page-level Allure report.
 * Why:
 *   Created to replace manual scan + run + report steps with one repeatable flow
 *   for faster and more reliable page-level component validation.
 *
 * Usage:
 *   npx tsx scripts/page-validate.ts "<URL>" "<Page Name>" [environment] [browser]
 *
 * Examples:
 *   npx tsx scripts/page-validate.ts "https://www.bayer.co.uk/en-gb" "Bayer UK Homepage"
 *   npx tsx scripts/page-validate.ts "https://www.bayer.de/de/" "Bayer Germany Homepage" prod firefox
 *   npx tsx scripts/page-validate.ts "https://bayer-beyond-qa-uk.vercel.app/en/career" "Careers Page" qa
 */

import { chromium } from '@playwright/test';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { getComponentByDataQa } from '../config/component-registry';
import { ComponentTestRunner } from '../helpers/orchestrator/componentTestRunner';

const execPromise = promisify(exec);

const TARGET_URL    = process.argv[2];
const PAGE_NAME     = process.argv[3];
const ENVIRONMENT   = process.argv[4] || 'prod';
const PROJECT       = process.argv[5] || 'chromium';

const MAPPING_FILE       = path.resolve(__dirname, '..', 'config/page-component-mapping.json');
const PAGE_RESULTS_DIR   = 'reports/allure/page-level-results';
const PAGE_REPORT_DIR    = 'reports/allure/page-level-report';

if (!TARGET_URL || !PAGE_NAME) {
  console.error('\nUsage: npx tsx scripts/page-validate.ts "<URL>" "<Page Name>" [environment] [browser]');
  console.error('Example: npx tsx scripts/page-validate.ts "https://www.bayer.co.uk/en-gb" "Bayer UK Homepage"');
  process.exit(1);
}

// STEP 1: Scan page and detect registered components
async function scanPage(): Promise<string[]> {
  console.log('\n' + '='.repeat(60));
  console.log('STEP 1: SCANNING PAGE');
  console.log(`URL  : ${TARGET_URL}`);
  console.log(`Name : ${PAGE_NAME}`);
  console.log('='.repeat(60));

  const authUser = process.env.VERCEL_AUTH_USER || 'bayercorp';
  const authPassword = process.env.VERCEL_AUTH_PASSWORD || 'beyond2026';
  const headless = process.env.HEADED === 'true' ? false : true;

  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    httpCredentials: { username: authUser, password: authPassword },
  });
  const page = await context.newPage();

  try {
    // Use baked-in basic auth in URL for Vercel-protected QA/Prod pages
    const authedUrl = TARGET_URL.replace(
      /^https?:\/\//,
      (m) => `${m}${encodeURIComponent(authUser)}:${encodeURIComponent(authPassword)}@`
    );
    await page.goto(authedUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Handle Vercel password-protection page
    try {
      const pwdInput = page.locator('input[name="_vercel_password"], input[type="password"]').first();
      if (await pwdInput.isVisible({ timeout: 5000 })) {
        await pwdInput.fill(authPassword);
        await page.keyboard.press('Enter');
        await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
        console.log('  Vercel password entered.');
      }
    } catch { /* no password page */ }

    // Accept cookies
    try {
      const cookieBtn = page.locator(
        '#onetrust-accept-btn-handler, button:has-text("Accept All"), button:has-text("Accept")'
      );
      if (await cookieBtn.first().isVisible({ timeout: 4000 })) {
        await cookieBtn.first().click();
        await page.waitForTimeout(1000);
      }
    } catch { /* no banner */ }

    await page.waitForLoadState('load');
    await page.waitForTimeout(3000);

    // Trigger lazy-loaded components by scrolling
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let total = 0;
        const distance = 600;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          total += distance;
          if (total >= document.body.scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 200);
      });
    });
    await page.waitForTimeout(1500);

    // Collect all data-qa values on the page
    const allDataQa: string[] = await page.evaluate(() => {
      const values = new Set<string>();
      document.querySelectorAll('[data-qa]').forEach(el => {
        const v = el.getAttribute('data-qa');
        if (v) values.add(v);
      });
      return Array.from(values);
    });

    console.log(`\ndata-qa attributes found: ${allDataQa.length}`);

    // Filter to registered components only
    const matched = allDataQa.filter(qa => !!getComponentByDataQa(qa));
    const componentMappings = matched.map(qa => {
      const def = getComponentByDataQa(qa)!;
      console.log(`  [OK] ${def.componentName} → ${def.specFile}`);
      return {
        dataQa: def.dataQa,
        componentName: def.componentName,
        specFile: def.specFile,
        testTags: def.testTags
      };
    });

    if (componentMappings.length === 0) {
      console.log('  [WARN] No registered components found on this page.');
      console.log('  Unregistered data-qa values:');
      allDataQa.forEach(qa => console.log(`    "${qa}"`));
    }

    // Save to mapping file
    let mapping: { pages: any[] } = { pages: [] };
    if (fs.existsSync(MAPPING_FILE)) {
      mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
    }
    mapping.pages = mapping.pages.filter((p: any) => p.url !== TARGET_URL);
    mapping.pages.push({
      url: TARGET_URL,
      pageName: PAGE_NAME,
      environment: ENVIRONMENT,
      components: componentMappings,
      scannedAt: new Date().toISOString()
    });
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), 'utf-8');
    console.log(`\nMapping saved (${componentMappings.length} components) → ${MAPPING_FILE}`);

    return matched;
  } finally {
    await browser.close();
  }
}

// STEP 2: Run component specs in page mode
async function runTests() {
  // Clear previous page-level results
  if (fs.existsSync(PAGE_RESULTS_DIR)) {
    fs.rmSync(PAGE_RESULTS_DIR, { recursive: true, force: true });
  }

  console.log('\n' + '='.repeat(60));
  console.log('STEP 2: RUNNING COMPONENT TESTS IN PAGE MODE');
  console.log(`URL    : ${TARGET_URL}`);
  console.log(`Browser: ${PROJECT}`);
  console.log('='.repeat(60));

  const runner = new ComponentTestRunner();
  const result = await runner.runTestsForPage(TARGET_URL, PROJECT);

  return result;
}

// STEP 3: Generate and open Allure report
async function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('STEP 3: GENERATING PAGE-LEVEL ALLURE REPORT');
  console.log('='.repeat(60));

  try {
    await execPromise(
      `npx allure generate ${PAGE_RESULTS_DIR} --clean -o ${PAGE_REPORT_DIR}`,
      { cwd: process.cwd() }
    );
    console.log(`\n[OK] Report ready: ${PAGE_REPORT_DIR}/index.html`);
    exec(`npx allure open ${PAGE_REPORT_DIR}`, { cwd: process.cwd() });
  } catch {
    console.warn('[WARN] Could not generate Allure report — no results in', PAGE_RESULTS_DIR);
  }
}

// MAIN
async function main() {
  const components = await scanPage();

  if (components.length === 0) {
    console.log('\nNo components to run. Exiting.');
    process.exit(0);
  }

  const result = await runTests();
  await generateReport();

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log(`  Page       : ${PAGE_NAME}`);
  console.log(`  URL        : ${TARGET_URL}`);
  console.log(`  Components : ${result.totalComponents}`);
  console.log(`  [OK] Passed  : ${result.testsPassed}`);
  console.log(`  [FAIL] Failed  : ${result.testsFailed}`);
  console.log('='.repeat(60) + '\n');

  process.exit(result.testsFailed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

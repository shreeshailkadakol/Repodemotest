/**
 * Component Mapper - Redirect Checker
 * What:
 *   Reads URLs from Excel or CSV, validates HTTP and redirect behavior,
 *   and writes result columns for status, code, failure reason, and final URL.
 * Why:
 *   Created to support mapper-related release validation with a fast,
 *   repeatable URL health check and auditable output for stakeholders.
 *
 * Reads every URL found in your Excel/CSV, checks if it's working,
 * and writes 4 result columns right next to each URL column:
 *
 *   Source URL | Status | Status Code | Reason to Fail | Final URL
 *
 * Usage:
 *   npm run redirect:check
 *   npx tsx redirect-checker/redirect-checker.ts
 *   npx tsx redirect-checker/redirect-checker.ts input/my-file.xlsx
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

const SCRIPT_DIR  = path.resolve(__dirname);
const INPUT_DIR   = path.join(SCRIPT_DIR, 'input');
const REPORTS_DIR = path.join(SCRIPT_DIR, 'reports');
const CONCURRENCY = 15;

// Find input file

function findInputFile(cliArg?: string): string {
  if (cliArg) return path.resolve(SCRIPT_DIR, cliArg);
  const files = fs.readdirSync(INPUT_DIR).filter(f => /\.(xlsx?|csv)$/i.test(f));
  if (!files.length) throw new Error(`No Excel/CSV file found in ${INPUT_DIR}`);
  const pick = files.find(f => !f.includes('-results-')) || files[0];
  console.log(`Using: ${pick}`);
  return path.join(INPUT_DIR, pick);
}

// Check a single URL

async function checkURL(url: string): Promise<{
  status: string;
  statusCode: string;
  reasonToFail: string;
  finalURL: string;
}> {
  try {
    let response = await axios.head(url, {
      maxRedirects: 10,
      validateStatus: () => true,
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; URLChecker/1.0)' },
    }).catch(() =>
      axios.get(url, {
        maxRedirects: 10,
        validateStatus: () => true,
        timeout: 15000,
        responseType: 'stream',
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; URLChecker/1.0)' },
      })
    );

    if (response.data?.destroy) response.data.destroy();

    const code     = response.status;
    const finalURL = response.request?.res?.responseUrl || url;
    const ok       = code >= 200 && code < 400;

    return {
      status:       ok ? 'PASS' : 'FAIL',
      statusCode:   String(code),
      reasonToFail: ok ? '' : httpReason(code),
      finalURL,
    };
  } catch (err: any) {
    return {
      status:       'FAIL',
      statusCode:   'ERROR',
      reasonToFail: simplifyError(err.message || String(err)),
      finalURL:     url,
    };
  }
}

function httpReason(code: number): string {
  const map: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized - Login required',
    403: 'Forbidden - Access denied',
    404: 'Not Found - Page does not exist',
    410: 'Gone - Page permanently removed',
    429: 'Too Many Requests - Rate limited',
    500: 'Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  };
  return map[code] || `HTTP ${code} Error`;
}

function simplifyError(msg: string): string {
  if (msg.includes('ENOTFOUND') || msg.includes('getaddrinfo')) return 'Domain not found';
  if (msg.includes('ECONNREFUSED'))  return 'Connection refused';
  if (msg.includes('ETIMEDOUT') || msg.includes('timeout')) return 'Request timed out';
  if (msg.includes('certificate'))   return 'SSL certificate error';
  return msg.slice(0, 80);
}

// Run all URLs with concurrency

async function runAll(urls: string[]): Promise<Map<string, any>> {
  const results = new Map<string, any>();
  let index = 0;

  async function worker() {
    while (index < urls.length) {
      const i   = index++;
      const url = urls[i];
      const res = await checkURL(url);
      results.set(url, res);
      const icon = res.status === 'PASS' ? '[PASS]' : '[FAIL]';
      if ((i + 1) % 20 === 0 || i === 0 || i === urls.length - 1) {
        console.log(`[${i + 1}/${urls.length}] ${icon} ${res.status} (${res.statusCode})`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

// Main

async function main() {
  console.log('\n[LINK] URL CHECKER');

  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const inputFile = findInputFile(process.argv[2]);
  const wb        = XLSX.readFile(inputFile, { raw: false });
  const sheetName = wb.SheetNames[0];
  const sheet     = wb.Sheets[sheetName];
  const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  if (!rows.length) throw new Error('File is empty.');

  // Find all columns that contain URLs in the first row
  const firstRow   = rows[0];
  const urlColKeys = Object.keys(firstRow).filter(k => {
    const v = String(firstRow[k] || '').trim();
    return v.startsWith('http://') || v.startsWith('https://');
  });

  if (!urlColKeys.length) throw new Error('No URL columns found.');

  console.log(`[LIST] URL columns: ${urlColKeys.join(', ')}`);

  // Collect all unique URLs
  const allURLs = new Set<string>();
  for (const row of rows) {
    for (const col of urlColKeys) {
      const v = String(row[col] || '').trim();
      if (v.startsWith('http')) allURLs.add(v);
    }
  }

  console.log(`[COUNT] URLs to check: ${allURLs.size}`);

  const results = await runAll([...allURLs]);

  let pass = 0, fail = 0;
  results.forEach(r => r.status === 'PASS' ? pass++ : fail++);

  console.log('\n[SUMMARY]');
  console.log(`[PASS] PASS : ${pass}`);
  console.log(`[FAIL] FAIL : ${fail}`);
  console.log(`[TOTAL] Total: ${allURLs.size}`);

  // Build simple 5-column results sheet
  const resultRows: Record<string, string>[] = [];
  for (const row of rows) {
    for (const col of urlColKeys) {
      const url = String(row[col] || '').trim();
      if (!url.startsWith('http')) continue;
      const r = results.get(url);
      resultRows.push({
        'Source URL':      url,
        'Status':          r?.status       ?? '',
        'Status Code':     r?.statusCode    ?? '',
        'Reason to Fail':  r?.reasonToFail  ?? '',
        'Final URL':       (r?.finalURL && r.finalURL !== url) ? r.finalURL : '',
      });
    }
  }

  // Write results as a new sheet "Results" in the original file
  wb.Sheets['Results'] = XLSX.utils.json_to_sheet(resultRows);
  if (!wb.SheetNames.includes('Results')) wb.SheetNames.push('Results');
  XLSX.writeFile(wb, inputFile);

  // Also save a backup in reports/
  const ts     = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backup = path.join(REPORTS_DIR, `${path.basename(inputFile, path.extname(inputFile))}-results-${ts}.xlsx`);
  XLSX.writeFile(wb, backup);

  console.log('\n[DONE]:');
  console.log(`[PASS] Written back to: ${inputFile}`);
  console.log(`[LIST] Backup at: ${backup}`);
  console.log('');

  if (fail > 0) process.exit(1);
}

main().catch(err => {
  console.error('[FAIL] Error:', err.message || err);
  process.exit(1);
});


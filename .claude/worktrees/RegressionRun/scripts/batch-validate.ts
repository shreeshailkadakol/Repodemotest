/**
 * Batch page validator
 *
 * Runs page-validate.ts for each URL listed in `config/batch-urls.txt`
 * (or a file passed as the first arg) and aggregates ALL Allure results
 * into a single combined report.
 *
 * Usage:
 *   npx tsx scripts/batch-validate.ts                      # uses config/batch-urls.txt
 *   npx tsx scripts/batch-validate.ts ./my-urls.txt        # custom list
 *
 * URL list file format: one URL per line. Optional second column (TAB or "|"
 * separated) for page name. Lines starting with # are ignored.
 *
 * Env vars (forwarded to page-validate.ts):
 *   HEADED=true                Run browsers headed
 *   PAGE_GREP=@Functional      Tag filter (default @Smoke in runner)
 *   VERCEL_AUTH_USER / VERCEL_AUTH_PASSWORD
 */

import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const PAGE_RESULTS_DIR  = 'reports/allure/page-level-results';
const BATCH_RESULTS_DIR = 'reports/allure/batch-results';
const BATCH_REPORT_DIR  = 'reports/allure/batch-report';

interface UrlEntry { url: string; name: string; }

function parseUrlList(file: string): UrlEntry[] {
  const raw = fs.readFileSync(file, 'utf-8');
  const out: UrlEntry[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const parts = t.split(/\s*[|\t]\s*/);
    const url = parts[0];
    const name = parts[1] || deriveName(url);
    out.push({ url, name });
  }
  return out;
}

function deriveName(url: string): string {
  try {
    const u = new URL(url);
    const seg = u.pathname.split('/').filter(Boolean).pop() || u.hostname;
    return `${u.hostname.replace(/^bayer-beyond-prod-/, '').replace('.vercel.app', '')} - ${seg}`;
  } catch {
    return url;
  }
}

// Strip non-ASCII / shell-unfriendly chars (npm dies on em-dash etc.)
// Also collapse spaces to underscores so cmd.exe doesn't split into multiple argv tokens.
function sanitize(name: string): string {
  return name
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/[^\x20-\x7E]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

function ensureDir(dir: string) { fs.mkdirSync(dir, { recursive: true }); }

function clearDir(dir: string) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(dir);
}

function copyAllureResults(from: string, to: string, prefix: string) {
  if (!fs.existsSync(from)) return 0;
  let copied = 0;
  for (const f of fs.readdirSync(from)) {
    const src = path.join(from, f);
    const dst = path.join(to, `${prefix}__${f}`);
    try {
      fs.copyFileSync(src, dst);
      copied++;
    } catch { /* ignore */ }
  }
  return copied;
}

async function main() {
  const listFile = process.argv[2] || 'config/batch-urls.txt';
  if (!fs.existsSync(listFile)) {
    console.error(`URL list not found: ${listFile}`);
    process.exit(1);
  }

  const entries = parseUrlList(listFile);
  if (entries.length === 0) {
    console.error('No URLs to process.');
    process.exit(1);
  }

  console.log('='.repeat(70));
  console.log(`BATCH PAGE VALIDATOR — ${entries.length} URL(s)`);
  console.log(`Source : ${listFile}`);
  console.log(`Headed : ${process.env.HEADED === 'true' ? 'yes' : 'no'}`);
  console.log(`Filter : ${process.env.PAGE_GREP || '@Smoke (default)'}`);
  console.log('='.repeat(70));

  clearDir(BATCH_RESULTS_DIR);

  const summary: Array<{ name: string; url: string; copied: number; exit: number }> = [];

  for (let i = 0; i < entries.length; i++) {
    const { url } = entries[i];
    const name = sanitize(entries[i].name);
    console.log('\n' + '#'.repeat(70));
    console.log(`# [${i + 1}/${entries.length}] ${name}`);
    console.log(`# ${url}`);
    console.log('#'.repeat(70));

    const proc = spawnSync(
      'npx',
      ['tsx', path.join(__dirname, 'page-validate.ts'), url, name],
      { stdio: 'inherit', shell: true, env: process.env }
    );

    const prefix = `page${String(i + 1).padStart(2, '0')}-${name.replace(/[^a-z0-9]+/gi, '-').slice(0, 40)}`;
    const copied = copyAllureResults(PAGE_RESULTS_DIR, BATCH_RESULTS_DIR, prefix);
    summary.push({ name, url, copied, exit: proc.status ?? -1 });
  }

  // Generate combined report
  console.log('\n' + '='.repeat(70));
  console.log('GENERATING COMBINED ALLURE REPORT');
  console.log('='.repeat(70));

  const gen = spawnSync(
    'npx',
    ['allure', 'generate', BATCH_RESULTS_DIR, '--clean', '-o', BATCH_REPORT_DIR],
    { stdio: 'inherit', shell: true }
  );

  console.log('\n' + '='.repeat(70));
  console.log('BATCH SUMMARY');
  console.log('='.repeat(70));
  for (const s of summary) {
    const status = s.exit === 0 ? '[OK]   ' : '[FAIL] ';
    console.log(`${status} (${s.copied} tests) ${s.name}`);
  }
  const totalTests = summary.reduce((a, b) => a + b.copied, 0);
  console.log('-'.repeat(70));
  console.log(`Total pages : ${summary.length}`);
  console.log(`Total tests : ${totalTests}`);
  if (gen.status === 0) {
    console.log(`Report      : ${BATCH_REPORT_DIR}/index.html`);
    console.log(`\nServe with: npx allure open ${BATCH_REPORT_DIR}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });

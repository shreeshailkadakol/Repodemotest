#!/usr/bin/env node
/**
 * Summarises Playwright/Allure results for the daily and weekly pipelines.
 *
 * Reads  : reports/allure/allure-results/*-result.json (written by allure-playwright, see playwright.config.ts)
 * Writes : reports/summary/summary.json, summary.md, execution-report.html, email_body.html
 *          reports/history/<pipeline>-history.json (appended; restored/saved by the workflow cache)
 * Outputs: key=value lines to $GITHUB_OUTPUT (status, subject, total, passed, failed, skipped)
 *
 * No third-party dependencies. Never fails the build itself: missing results => zero counts.
 *
 * Env: PIPELINE_NAME (Daily|Weekly), JOB_STATUS, TEST_OUTCOME, RESULTS_DIR, HISTORY_DIR, OUT_DIR,
 *      RUN_URL, ARTIFACT_URL, REPO, BRANCH, SHA, RUN_ID, RUN_ATTEMPT, TREND_POINTS
 */
const fs = require('fs');
const path = require('path');

const env = (k, d = '') => (process.env[k] ?? d).toString();
const pipeline = env('PIPELINE_NAME', 'Daily');
const resultsDir = env('RESULTS_DIR', 'reports/allure/allure-results');
const historyDir = env('HISTORY_DIR', 'reports/history');
const outDir = env('OUT_DIR', 'reports/summary');
const trendPoints = parseInt(env('TREND_POINTS', '10'), 10);

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const stripAnsi = (s) => String(s || '').replace(/\u001b\[[0-9;]*m/g, '');

// ---- 1. Read results (dedupe retries: keep the last attempt per test) ----
const latest = new Map();
let readErrors = 0;
if (fs.existsSync(resultsDir)) {
  for (const f of fs.readdirSync(resultsDir)) {
    if (!f.endsWith('-result.json')) continue;
    try {
      const r = JSON.parse(fs.readFileSync(path.join(resultsDir, f), 'utf8'));
      const key = r.historyId || r.testCaseId || r.fullName || r.uuid || f;
      const prev = latest.get(key);
      const attempts = (prev ? prev.attempts : 0) + 1;
      if (!prev || (r.stop || 0) >= (prev.stop || 0)) latest.set(key, { ...r, attempts });
      else prev.attempts = attempts;
    } catch {
      readErrors++;
    }
  }
}

let passed = 0, failed = 0, skipped = 0, flaky = 0;
const failures = [];
let minStart = Infinity, maxStop = 0;
for (const r of latest.values()) {
  if (r.start) minStart = Math.min(minStart, r.start);
  if (r.stop) maxStop = Math.max(maxStop, r.stop);
  if (r.status === 'passed') {
    passed++;
    if (r.attempts > 1) flaky++;
  } else if (r.status === 'skipped') {
    skipped++;
  } else {
    failed++; // failed | broken | unknown
    failures.push({
      name: r.fullName || r.name || 'unknown test',
      message: stripAnsi(r.statusDetails && r.statusDetails.message).split('\n').slice(0, 4).join(' ').slice(0, 400),
    });
  }
}
const total = passed + failed + skipped;
const durationSec = maxStop > minStart ? Math.round((maxStop - minStart) / 1000) : 0;
const duration = durationSec ? `${Math.floor(durationSec / 60)}m ${durationSec % 60}s` : 'n/a';

// ---- 2. Build status ----
const jobStatus = env('JOB_STATUS', 'success');
const testOutcome = env('TEST_OUTCOME', 'success');
const noResults = total === 0;
const success = jobStatus === 'success' && testOutcome === 'success' && failed === 0 && !noResults;
const status = success ? 'Success' : 'Failure';
const errorDetails = [];
if (noResults) errorDetails.push('No test results were produced (setup/install step failed, or tests did not start).');
if (jobStatus !== 'success' && !noResults) errorDetails.push(`A pipeline step failed (job status: ${jobStatus}). See the run log.`);
if (jobStatus !== 'success' && noResults) errorDetails.push(`Job status: ${jobStatus}. Check the run log for the failing step.`);
if (testOutcome !== 'success' && failed === 0 && !noResults) errorDetails.push(`Test step outcome: ${testOutcome}.`);
if (readErrors) errorDetails.push(`${readErrors} result file(s) could not be parsed.`);

// ---- 3. History / trend ----
const now = new Date();
const fmt = (tz) =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: tz }).format(now) +
  ` ${tz === 'UTC' ? 'UTC' : 'IST'}`;
const executedAt = `${fmt('UTC')} (${fmt('Asia/Kolkata')})`;

fs.mkdirSync(historyDir, { recursive: true });
const historyFile = path.join(historyDir, `${pipeline.toLowerCase()}-history.json`);
let history = [];
try { history = JSON.parse(fs.readFileSync(historyFile, 'utf8')); } catch { /* first run */ }
if (!Array.isArray(history)) history = [];
const entry = { date: now.toISOString(), runId: env('RUN_ID'), status, total, passed, failed, skipped, flaky, durationSec };
// Idempotent: the workflow runs this script twice per run (second time to add the artifact link).
if (entry.runId && history.length && history[history.length - 1].runId === entry.runId) history[history.length - 1] = entry;
else history.push(entry);
history = history.slice(-50);
const prev = history.length > 1 ? history[history.length - 2] : null;
fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

const rate = (h) => (h.total ? Math.round((h.passed / h.total) * 1000) / 10 : 0);
const trend = history.slice(-trendPoints);
const delta = prev ? Math.round((rate(history[history.length - 1]) - rate(prev)) * 10) / 10 : null;
const trendHtml = `
  <h3>Execution trend (last ${trend.length} ${pipeline.toLowerCase()} runs)</h3>
  <table><tr><th>Date (UTC)</th><th>Status</th><th>Total</th><th>Passed</th><th>Failed</th><th>Skipped</th><th>Pass rate</th></tr>
  ${trend.slice().reverse().map((h) => `<tr><td>${esc(h.date.slice(0, 16).replace('T', ' '))}</td><td>${esc(h.status)}</td><td>${h.total}</td><td>${h.passed}</td><td>${h.failed}</td><td>${h.skipped}</td><td>${rate(h)}%</td></tr>`).join('\n')}
  </table>
  <p>${delta === null ? 'No previous run available for comparison (trend builds up over time).' : `Pass rate vs previous run: <b>${delta > 0 ? '+' : ''}${delta} pts</b>.`}</p>`;

// ---- 4. Render ----
const runUrl = env('RUN_URL');
const artifactUrl = env('ARTIFACT_URL') || runUrl;
const color = success ? '#2e7d32' : '#c62828';
const failuresHtml = failures.length
  ? `<h3>Failed tests${failures.length > 10 ? ' (first 10)' : ''}</h3><ul>${failures.slice(0, 10).map((f) => `<li><b>${esc(f.name)}</b><br><code>${esc(f.message || 'no message')}</code></li>`).join('')}</ul>`
  : '';
const errorsHtml = errorDetails.length ? `<h3>Error details</h3><ul>${errorDetails.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : '';

const body = (withTrend) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:Arial,sans-serif;color:#222} .box{max-width:760px;margin:auto;border:1px solid #ddd;padding:20px}
table{border-collapse:collapse;width:100%;margin:10px 0} th,td{border:1px solid #ccc;padding:8px;text-align:center} th{background:#eee}
code{font-size:12px;color:#8a1f1f;word-break:break-word} .s{color:${color};font-weight:bold}
</style></head><body><div class="box">
<h2>${esc(pipeline)} Pipeline – <span class="s">${status}</span></h2>
<p><b>Pipeline:</b> ${esc(pipeline)}<br><b>Executed:</b> ${esc(executedAt)}<br><b>Build status:</b> <span class="s">${status}</span><br>
<b>Repository / branch:</b> ${esc(env('REPO'))} @ ${esc(env('BRANCH'))} (${esc(env('SHA').slice(0, 7))})<br><b>Duration:</b> ${esc(duration)}</p>
<table><tr><th>Total</th><th>Passed</th><th>Failed</th><th>Skipped</th><th>Flaky (passed on retry)</th></tr>
<tr><td>${total}</td><td style="color:green">${passed}</td><td style="color:red">${failed}</td><td>${skipped}</td><td>${flaky}</td></tr></table>
${errorsHtml}${failuresHtml}
<p><a href="${esc(artifactUrl)}">Download report (GitHub Actions artifact)</a><br>
<a href="${esc(runUrl)}">GitHub Actions execution</a><br><small>${esc(runUrl)}</small></p>
${withTrend ? trendHtml : ''}
<p><small>Artifact downloads require access to the repository.</small></p>
</div></body></html>`;

const md = `## ${pipeline} pipeline – ${status}
- Executed: ${executedAt}
- Total: **${total}** | Passed: **${passed}** | Failed: **${failed}** | Skipped: **${skipped}** | Flaky: ${flaky}
- Duration: ${duration}
${errorDetails.map((e) => `- ⚠️ ${e}`).join('\n')}
${failures.slice(0, 10).map((f) => `- ❌ ${f.name}: ${f.message}`).join('\n')}
${delta === null ? '' : `- Pass-rate delta vs previous run: ${delta} pts`}
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify({ pipeline, status, executedAt, total, passed, failed, skipped, flaky, duration, failures, errorDetails, trend }, null, 2));
fs.writeFileSync(path.join(outDir, 'summary.md'), md);
fs.writeFileSync(path.join(outDir, 'execution-report.html'), body(true));
// Email: weekly carries the trend table; daily stays compact.
fs.writeFileSync(path.join(outDir, 'email_body.html'), body(pipeline.toLowerCase() === 'weekly'));

const subject = `[Playwright ${pipeline}] ${status} – ${passed}/${total} passed, ${failed} failed, ${skipped} skipped – ${env('REPO')}`;
const lines = { status, subject, total, passed, failed, skipped };
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, Object.entries(lines).map(([k, v]) => `${k}=${v}`).join('\n') + '\n');
}
if (process.env.GITHUB_STEP_SUMMARY && !env('ARTIFACT_URL')) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
console.log(subject);

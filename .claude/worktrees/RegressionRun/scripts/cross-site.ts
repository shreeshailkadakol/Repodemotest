/**
 * cross-site.ts
 *
 * Runs one or more EXISTING component specs against every microsite in
 * config/micrositeUrls.ts, by setting SITE_BASE_URL per site (honored by
 * envUtils.getBaseUrl). Reuses the specs unchanged - adding a component to a
 * cross-site run is just adding its spec path, no code change.
 *
 * Usage:
 *   npm run cross-site -- --specs "tests/specs/LanguageSelector.spec.ts tests/specs/location.spec.ts"
 *   npm run cross-site -- --specs tests/specs/LanguageSelector.spec.ts --grep "@[Ff]unctional"
 *   npm run cross-site -- --specs <paths> --concurrency 3   (default 1 = sequential, most reliable)
 *
 * Runs headless. Default concurrency is 1 (sequential) to avoid the flake that
 * parallel browsers caused; raise --concurrency only if you accept some noise.
 */

import { spawn } from 'child_process';
import { micrositeUrls, MicrositeUrl } from '../config/micrositeUrls';

interface SiteResult {
  site: MicrositeUrl;
  passed: number;
  failed: number;
  code: number | null;
}

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      out[key] = val;
    }
  }
  return out;
}

function runSite(specs: string[], grep: string, site: MicrositeUrl): Promise<SiteResult> {
  return new Promise((resolve) => {
    const env = {
      ...process.env,
      TEST_ENV: process.env.TEST_ENV || 'prod',
      SITE_BASE_URL: site.baseUrl,
    };
    const p = spawn(
      'npx',
      [
        'playwright',
        'test',
        ...specs,
        '--project=chromium',
        '--grep',
        grep,
        '--reporter=line',
        '--workers=1',
      ],
      { env, shell: true }
    );
    let out = '';
    p.stdout.on('data', (d) => (out += d.toString()));
    p.stderr.on('data', (d) => (out += d.toString()));
    p.on('close', (code) => {
      const passed = Number((out.match(/(\d+)\s+passed/) || [])[1] || 0);
      const failed = Number((out.match(/(\d+)\s+failed/) || [])[1] || 0);
      const status = failed > 0 || code !== 0 ? 'FAIL' : 'PASS';
      // eslint-disable-next-line no-console
      console.log(
        `[${status}] ${`${site.country} (${site.locale})`.padEnd(34)} passed=${passed} failed=${failed}`
      );
      resolve({ site, passed, failed, code });
    });
  });
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const specs = (args.specs && args.specs !== 'true' ? args.specs : '')
    .split(/[\s,]+/)
    .filter(Boolean);
  const grep = args.grep && args.grep !== 'true' ? args.grep : '@[Ff]unctional';
  const concurrency = Math.max(1, Number(args.concurrency || 1));

  if (specs.length === 0) {
    console.error('[cross-site] ERROR: --specs "<spec paths>" is required');
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(
    `[cross-site] specs=[${specs.join(', ')}] grep="${grep}" sites=${micrositeUrls.length} concurrency=${concurrency}\n`
  );

  const queue = [...micrositeUrls];
  const results: SiteResult[] = [];
  async function worker(): Promise<void> {
    for (;;) {
      const site = queue.shift();
      if (!site) return;
      results.push(await runSite(specs, grep, site));
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const withFailures = results.filter((r) => r.failed > 0 || r.code !== 0);
  // eslint-disable-next-line no-console
  console.log('\n================ SUMMARY ================');
  // eslint-disable-next-line no-console
  console.log(
    `Sites: ${results.length}  |  clean: ${results.length - withFailures.length}  |  with failures: ${withFailures.length}`
  );
  if (withFailures.length) {
    // eslint-disable-next-line no-console
    console.log('\nSites with failures:');
    withFailures
      .sort((a, b) => a.site.country.localeCompare(b.site.country))
      .forEach((r) =>
        // eslint-disable-next-line no-console
        console.log(`  - ${r.site.country} (${r.site.locale})  failed=${r.failed} exit=${r.code}`)
      );
  }
  // eslint-disable-next-line no-console
  console.log('\nNote: re-run any failing site in isolation to separate real defects from flake.');
}

main();

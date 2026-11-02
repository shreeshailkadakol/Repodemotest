---
name: playwright-execution-reporting
description: How to execute Playwright tests and read/share the resulting reports in this framework (Bayer Beyond). Use when running a spec or suite, choosing the environment (TEST_ENV) or project/viewport, filtering by tag, running headed/debug, or locating and opening reports (HTML, Allure, selector-health) and failure artifacts (video, screenshots). Covers Steps 7–8 of the test-authoring flow.
---

# Playwright Test Execution & Reporting

> Consolidates the run commands and report locations that were previously scattered across the authoring
> Step 7/8 notes. Failure *triage* (Expected/Received extraction, debugging) lives in
> **playwright-test-failure-analysis**; this skill is about *running* tests and *finding/reading* the reports.
> All facts below are verified against `playwright.config.ts` and `package.json`.

## Environment selection (`TEST_ENV`)

Tests are env-driven via `cross-env TEST_ENV=<env>`. The base URL comes from `envUtils.getBaseUrl()`.
Seen in `package.json`: `prod`, `prod_in`, `qa`. Always set `TEST_ENV` explicitly.

```bash
# Default suite (prod)
npm test                                   # cross-env TEST_ENV=prod playwright test

# A single spec
npx cross-env TEST_ENV=prod npx playwright test tests/specs/<Component>.spec.ts
```

## Running tests

```bash
# Single spec, headed, one project
npx cross-env TEST_ENV=prod npx playwright test tests/specs/<Component>.spec.ts --headed --project=chromium

# Filter by tag (tags like @functional, @Accessibility, @visual, @performance)
npx cross-env TEST_ENV=prod npx playwright test tests/specs/<Component>.spec.ts --grep "@[Ff]unctional\b"

# Debug / step through
npx cross-env TEST_ENV=prod npx playwright test tests/specs/<Component>.spec.ts --debug
```

**Projects** (from `playwright.config.ts`, `--project="<name>"`): `chromium`, `firefox`, `webkit`,
`Microsoft Edge`, `Mobile Chrome`, `Mobile Safari`, `Tablet`, `Mobile Device`, `Desktop Full HD`.

**Config defaults worth knowing**: 60s per-test timeout, `fullyParallel`, `workers: 2`, `slowMo: 1000`,
`actionTimeout: 30000`, headless by default, retries only on CI.

### Handy npm scripts (already defined)
- `npm test` — full suite on `prod`
- `npm run test:desktop` — full suite on `Desktop Full HD`
- `npm run test:prod:suite:functional` — curated functional suite (`@functional`, headed, `--reporter=list`)
- `npm run test:allure` — run suite, then generate & open Allure

> ⚠️ The `vrt:baseline` / `vrt:compare` scripts reference `tests/specs/visual-regression.spec.ts`, which is **not present** in the repo. Treat them as orphaned until that spec exists; the `@percy/*` deps are likewise unused. Don't rely on these for visual regression.
- `npm run validate` — `lint` + `format:check` (run before a PR)

## Reports — where they land & how to open

Four reporters are configured in `playwright.config.ts` (all under `./reports/`):

| Report | Output folder | Open with |
|--------|---------------|-----------|
| **List** (console) | — (stdout) | inline during run |
| **HTML** | `./reports/html-report/` (`open: 'never'`) | `npx playwright show-report ./reports/html-report` |
| **Allure** | results: `./reports/allure/allure-results` → report: `./reports/allure/allure-report` | `npm run allure:generate` then `npm run allure:open` |
| **Selector Health** (custom) | `./reports/selector-health/` | open `reports/selector-health/selector-health.html` |

- Allure results dir can be overridden with `ALLURE_RESULTS_DIR`.
- The HTML reporter is set to `open: 'never'`, so it will **not** auto-open — use `show-report`.
- One-shot run + Allure: `npm run test:allure` (or `test:viewport:report` for a headed run + Allure).

## Failure artifacts (auto-captured)

From `use` in `playwright.config.ts`:
- **Video**: `retain-on-failure` — kept only for failed tests.
- **Screenshot**: `only-on-failure`.

These attach to the HTML/Allure reports and live under the Playwright output dir for the run. For systematic
failure analysis (grouping by viewport/element/property, Expected vs Received extraction), switch to the
**playwright-test-failure-analysis** skill.

## Step 7–8 of the authoring flow (where this fits)

- **Step 7 — Execute**: run the spec(s) with the right `TEST_ENV` and project, wait for full page load.
- **Step 8 — Report review**: open the **Selector Health** report (`reports/selector-health/selector-health.html`)
  to spot brittle selectors, plus the HTML/Allure reports for pass/fail and artifacts. Target >95% healthy
  selectors (per **playwright-pre-pr-checklist**).

## Related skills
- **playwright-test-failure-analysis** — triage/debug failures from these reports
- **playwright-pre-pr-checklist** — selector-health thresholds, pre-PR validation commands
- **playwright-test-authoring** — full Step 1–8 process this plugs into

# Scheduled CI Pipelines (Daily & Weekly)

Workflows: [daily-pipeline.yml](../.github/workflows/daily-pipeline.yml), [weekly-pipeline.yml](../.github/workflows/weekly-pipeline.yml).
Summary/report generator: [scripts/ci/summarize-results.js](../scripts/ci/summarize-results.js) (no extra dependencies; reads the Allure results already produced by `playwright.config.ts`).

## Schedules

| Pipeline | Cron (UTC) | Local time | Tests |
|---|---|---|---|
| Daily | `30 3 * * *` | 09:00 IST, every day | `tests/specs/saucedemo`, `--grep "@Smoke\|@Sanity"`, chromium |
| Weekly | `0 1 * * 1` | 06:30 IST, every Monday | all of `tests/specs/saucedemo` (full regression), chromium by default |

Scope note: the Optimizely specs (`tests/specs/optimizely`) target `https://localhost:5000` and need CMS credentials, so they cannot run on GitHub-hosted runners and are excluded. The SauceDemo specs use public sites.

> GitHub only fires `schedule` triggers from the **default branch** (`main`). Merge these files to `main` for the schedules to start. `workflow_dispatch` works from any branch that contains the files.

## Required GitHub Secrets

Repo → Settings → Secrets and variables → Actions → *New repository secret*.

| Secret | Example / meaning |
|---|---|
| `SMTP_SERVER` | `smtp.office365.com`, `smtp.gmail.com` or your relay host |
| `SMTP_PORT` | `587` (STARTTLS) or `465` (SSL; enabled automatically) |
| `SMTP_USERNAME` | mailbox / service account used to authenticate |
| `SMTP_PASSWORD` | password or app password (never commit it) |
| `MAIL_FROM` | sender, e.g. `Playwright CI <ci-reports@yourdomain.com>` |

The recipient (`shreeshail.kadakol@valtech.com`) is set as `MAIL_TO` in each workflow's `env`.
Confirm with Valtech IT which SMTP service is approved for automated mail, and whether the account needs SMTP AUTH enabled (Microsoft 365 often disables it by default). Use a dedicated service account with app password, not a personal login.

## Email content

Subject: `[Playwright Daily|Weekly] Success|Failure – P/T passed, F failed, S skipped – owner/repo`.
Body: pipeline name, execution date/time (UTC + IST), build status, total/passed/failed/skipped (+ flaky), failed-test names with error messages, error details for setup failures, artifact download link, run URL. The weekly mail also includes the trend table.
Emails are sent on both success and failure (`if: always()`).

## Run manually

Actions tab → select **Daily Pipeline** or **Weekly Pipeline** → **Run workflow** → choose branch (Daily also accepts a `--grep` expression; Weekly accepts the browser project).
CLI: `gh workflow run daily-pipeline.yml` / `gh workflow run weekly-pipeline.yml`.

## Reports

Open the run (link in the email) → **Artifacts** → `daily-report-<run_id>` / `weekly-report-<run_id>` (kept 30 days). Contents:
- `reports/summary/execution-report.html` – self-contained summary (+ trend), `summary.json`, `summary.md`
- `reports/html-report/` – Playwright HTML report (`npx playwright show-report`)
- `reports/allure/allure-report/` – Allure report (serve over HTTP, e.g. `npx allure open <dir>`)
- `reports/selector-health/`, `test-results/` (videos/screenshots of failures), `reports/history/`

The run's **Summary** page also shows the counts. Artifact download requires repo access.

## Trend data

History (`reports/history/<pipeline>-history.json`) is persisted between runs with the Actions cache (restore-key prefix). GitHub evicts caches unused for 7 days, so the weekly trend may reset if a run is missed; the history file is also in each artifact. Trends build up over time; the first run shows no comparison.

## Behaviour notes

- Tests run with `continue-on-error`, so the report, artifact upload and email always happen; the job is then failed explicitly so the run status stays red.
- Retries on CI are 1 (from `playwright.config.ts`); a test that passes on retry counts as passed and as "flaky".
- `dawidd6/action-send-mail` is a third-party action pinned to a major tag; for stricter supply-chain control pin it to a commit SHA.
- Config has `slowMo: 1000`, so runs are slow; timeouts are 60 min (daily) / 240 min (weekly).

---
description: Run the prod rollout validation suite (optionally against a new site URL)
argument-hint: "[site URL] [site name]"
allowed-tools: Bash(npm run*), PowerShell(npm run*), Bash(npx cross-env*), PowerShell(npx cross-env*)
---

Run the **rollout validation suite**. The canonical spec list and default env live in the `test:prod:suite:rollout` script in `package.json` — that is the source of truth; do not re-list the specs here.

## Always ask for the target URL first
When a QA engineer asks to run rollout validation, **ask them in the chat window to enter the full site URL including the locale segment** (e.g. `https://www.bayer.co.uk/en-gb/`) before doing anything else. Do not assume a default site.
- Wait for their reply, then proceed with that URL as the target (treat it the same as `$1` if they passed one on the command line).
- Only if the QA engineer explicitly says to use the default / no specific site, fall back to `npm run test:prod:suite:rollout` (maps to `TEST_ENV=prod_kultur`).

## Configure the URL, then run
Once you have the URL (with locale), run **both** rollout sub-scripts, swapping only `TEST_ENV`:
1. Derive an env key `prod_<slug>` from the URL host (e.g. `pallas-versicherung.de` → `prod_pallas`).
2. Update **both** places so every script that resolves the URL is in sync (these are the only places the URL/locale need configuring):
   - `config/rollout-config.ts` (`rolloutConfig.sites`) — add or update the site entry with its `baseUrl`, `env`, and `languages[]` (`code` / `name` / `path`) derived from the locale the QA engineer entered.
   - `helpers/utils/envUtils.ts` — add or update the same key in `baseUrls` (and `localePaths` only if the base URL has no locale segment) so `getBaseUrl()` does not throw.
   Those files (the `RolloutSite` interface and existing entries) are the source of truth for the exact shape — follow them. Confirm the derived env key and the parsed locale back to the QA engineer.
3. Run the suite in **two sequential commands** (the rollout specs have no `@Functional` tag, so they need a separate invocation without `--grep`):
   - **Command 1 — Rollout core specs (no grep):** Read the spec list from the `test:prod:suite:rollout:core` script in `package.json` and run it with `TEST_ENV=<key>` (e.g. `npx cross-env TEST_ENV=<key> npx playwright test <rollout specs> --project=chromium --headed --reporter=list`).
   - **Command 2 — Component specs (with @Functional grep):** Read the spec list from the `test:prod:suite:rollout:components` script in `package.json` and run it with `TEST_ENV=<key>` (e.g. `npx cross-env TEST_ENV=<key> npx playwright test <component specs> --project=chromium --grep "@[Ff]unctional\b" --headed --reporter=list`).
   Run Command 2 regardless of whether Command 1 had failures — both must complete to get a full report.

After the run:
1. Report total / passed / failed, grouped by rollout area (navigation, seo, gtm, indexing, consent, logo) and by component spec.
2. **Caveat:** logo, gtm (hard-coded container ID), and consent (OneTrust) checks are calibrated for Bayer sites. On a non-Bayer site, flag failures there as likely per-site config rather than real defects.
3. Point to the HTML report. Do not edit test files.

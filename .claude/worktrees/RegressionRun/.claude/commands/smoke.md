---
description: Run the market smoke test (validates all market homepages in MarketURLs.json)
argument-hint: "[--parallel N] [--config path]"
allowed-tools: Bash(npm run smoke:test), PowerShell(npm run smoke:test), Bash(npx tsx*), PowerShell(npx tsx*)
---

Run the **market smoke test**.

- Command: `npm run smoke:test` (= `npx tsx scripts/smoke-test.ts`). Pass `$ARGUMENTS` through, e.g. `--parallel <N>` or `--config <path>`.
- What it checks and how (HTTP status, error-page detection, expected title, retries) is defined in `scripts/smoke-test.ts` and the market list in `config/MarketURLs.json` — those are the source of truth; don't restate their rules here.

After the run:
1. Report total / passed / failed.
2. For each failure, give the market, URL, HTTP status, and error, and classify it as a **site problem** (non-200, error page, timeout) vs a **config mismatch** (expected title/text not matching the live page).
3. Failure screenshots are under `screenshots/smoke-test/`. Read-only run — do not edit files.

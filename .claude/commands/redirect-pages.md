---
description: Validate PAGE redirects from the UK-Redirects file
argument-hint: "[input file — default test-data/UK-Redirects.xlsx]"
allowed-tools: Bash(npx tsx*), PowerShell(npx tsx*), Bash(npm run*)
---

Validate **page redirects**.

- Input: `$1` if provided, otherwise `test-data/UK-Redirects.xlsx`.
- Command: `npx tsx redirect-checker/redirect-checker.ts ../test-data/UK-Redirects.xlsx` (paths are resolved relative to the `redirect-checker/` folder; if `$1` is absolute or already relative to that folder, pass it as given).
- How the checker reads URL columns and what result columns it writes are defined in `redirect-checker/redirect-checker.ts` — the source of truth.

First, a prerequisite check: if the input file does not exist, stop and tell the user where to place the page URL list.

After the run:
1. Summarize how many URLs passed vs failed.
2. List failures with their status code, reason, and final URL.
3. Point to the results file written under `redirect-checker/reports/`.

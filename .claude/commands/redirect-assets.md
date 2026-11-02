---
description: Validate ASSET redirects from the assets input file
argument-hint: "[input file — default redirect-checker/input/assets.xlsx]"
allowed-tools: Bash(npx tsx*), PowerShell(npx tsx*), Bash(npm run*)
---

Validate **asset redirects** (PDFs, images, downloadable documents, etc.).

- Input: `$1` if provided, otherwise `redirect-checker/input/assets.xlsx`.
- Command: `npx tsx redirect-checker/redirect-checker.ts input/assets.xlsx` (pass the `$1` path instead if one was given; paths are resolved relative to the `redirect-checker/` folder).
- Behaviour (URL columns read / result columns written) is defined in `redirect-checker/redirect-checker.ts` — the source of truth.

First, a prerequisite check: if the assets input file does not exist, stop and tell the user to place their asset URL list at `redirect-checker/input/assets.xlsx`.

After the run:
1. Summarize how many asset URLs passed vs failed.
2. List failures with their status code, reason, and final URL.
3. Point to the results file written under `redirect-checker/reports/`.

---
description: Run the prod sanity suite (India functional suite)
allowed-tools: Bash(npm run*), PowerShell(npm run*)
---

Run the **prod sanity suite**.

- Command: `npm run test:prod:suite:functional:india`. The env (`prod_in`), spec list, tag filter and browser are all defined by that script in `package.json` — the source of truth; don't restate them here.

After the run:
1. Report total / passed / failed.
2. For each failure, list the spec file and the failing assertion (Expected vs Received), grouped by component.
3. If anything failed, point to the HTML report and offer to open it.
4. Read-only run — do not edit test files.

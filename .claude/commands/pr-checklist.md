---
description: Run the Pre-PR validation checklist against the current changes
allowed-tools: Bash(npm run lint), PowerShell(npm run lint), Bash(npm run validate), Bash(git*), PowerShell(git*)
---

Run the **Pre-PR checklist** on the current branch's changes only (`git diff --name-only main...HEAD` plus uncommitted changes).

Work through the gates defined in the `playwright-pre-pr-checklist` skill — SmartLocator compliance, soft-assertions-only, visual / cross-browser, code standards (`npm run lint` + `npm run validate`), selector health, and documentation. The skill is the source of truth for each gate's criteria; do not restate them here.

Produce a single pass/fail checklist with `file:line` references for every issue found. Report only — do **not** auto-fix unless asked.

---
description: Generate BE + FE test cases as a sheet (.xlsx, ADO-import) for a story
argument-hint: "<component name or work item ID>"
allowed-tools: Bash(npm run fetch-requirements*), PowerShell(npm run fetch-requirements*), Bash(npx tsx scripts/generate-testcase-sheet.ts*), PowerShell(npx tsx scripts/generate-testcase-sheet.ts*)
---

Generate scope-driven **BE + FE test cases** for **$ARGUMENTS**.

Follow the `ado-test-case-generation` skill for the how - scope classification,
the 9-column ADO-import format, hard vs. conditional rules, and producing the
`.xlsx` via `scripts/generate-testcase-sheet.ts`. That skill is the source of
truth; do not restate its rules here.

Orchestration specific to this command:
1. If a work item ID is given, fetch it first via `azure-devops-bug-workflow` so
   cases trace to the acceptance criteria. If only a component name is given,
   work from the existing requirement/task file.
2. **Confirm the scope classification** (which ACs are BE vs FE, which
   conditional dimensions are in/out) with the user BEFORE generating the full
   sheet.
3. This command produces the BE + FE sheet only - it does not write Playwright
   scripts. For the FE-only Playwright markdown blueprint, use
   `/generate-test-cases` instead.

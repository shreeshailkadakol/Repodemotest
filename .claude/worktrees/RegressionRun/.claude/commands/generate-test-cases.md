---
description: Generate test-case documentation for a component / requirement
argument-hint: "<component name or work item ID>"
---

Generate test cases for **$ARGUMENTS**.

Follow the `playwright-test-documentation` skill for the how — file location, `TC-{Component Initial}{Number}` naming, traceability matrix, README update, and format. That skill is the source of truth; do not restate its rules here.

Orchestration specific to this command:
1. If a requirement/story ID is given, fetch it first via the `azure-devops-bug-workflow` skill so the test cases trace to the acceptance criteria. If only a component name is given, work from the existing requirement/task file.
2. Cover functional, accessibility, visual, and performance dimensions as applicable.
3. This command **stops at documentation** — it does not write Playwright scripts. Present the generated test-case list for review before anything else.

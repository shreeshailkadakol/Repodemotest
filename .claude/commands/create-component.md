---
description: Full end-to-end component automation — requirement to bug logging
argument-hint: "<ADO work item ID or component name> [TEST_ENV]"
---

Run the **full component automation flow** for: **$ARGUMENTS**. Keep scope frontend-only.

Execute the phases in order, invoking the named skill for each (via the Skill tool). Each skill is the source of truth for *how* that step is done — don't restate its rules here. Stop and report if a phase can't complete.

0. **Inputs (do this first).** This flow does NOT auto-discover the page URL or Figma design. Check for `reference/task-<component>.md` under the `playwright-test-authoring` skill. If it's missing, copy `_TASK-TEMPLATE.md` to it and ask the user for **story number(s), Test Page URL(s), and Figma URL + node IDs per viewport**, then wait — do not invent them. (If `$ARGUMENTS` already supplies these, use them.)
1. **Fetch requirement** — `azure-devops-bug-workflow` skill. Use `npm run fetch-requirements <id>` (PAT-based, from `.env`) — do NOT use the MCP ADO tool. Summarize the acceptance criteria before continuing.
2. **DOM inspection** — `playwright-dom-inspection` skill. Mandatory before any locator work.
3. **Generate test cases** — `playwright-test-documentation` skill. Get user confirmation on the test-case list before writing scripts.
4. **Fetch Figma values** — `playwright-figma-visual` skill.
5. **Generate test scripts** — `playwright-test-authoring` + `playwright-smart-locators` (plus `playwright-accessibility` for the a11y tests).
6. **Self-review** — `playwright-pre-pr-checklist` skill, then `npm run lint`. Fix issues before executing.
7. **Execute** — `playwright-execution-reporting` skill. Use `TEST_ENV=$2` if a second argument was given, else the env appropriate for the component.
8. **Analyze report** — `playwright-test-failure-analysis` skill.
9. **Log bug (only if real defects remain)** — `azure-devops-bug-workflow` skill. **CONFIRM with the user before creating any ADO Bug** — it is outward-facing and hard to reverse. Show the proposed title/description and wait for approval.

At the end, give a concise summary: requirement covered, test cases created, scripts added, execution result, report location, and any bug logged.

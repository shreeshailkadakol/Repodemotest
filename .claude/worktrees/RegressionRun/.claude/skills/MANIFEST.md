# Skills Manifest — playwright-prompt.md split

This maps every section of the original `playwright-prompt.md` to its new location.

- **Untouched backup**: `docs/ai-prompt-source/playwright-prompt.original.md` (byte-for-byte copy; md5 verified)
- **Original (still in repo root)**: `playwright-prompt.md`
- **Skills root**: `.claude/skills/`

> Goal: no information lost. Every instruction, command, checklist item, example, and rule from the original is preserved in exactly one primary destination (cross-references point to it rather than duplicating).

## Skills created

| Skill | Responsibility |
|-------|----------------|
| `playwright-test-authoring` | Entry point / orchestrator: test-first process, URL management, component & test-file structure, generalized Step 1–8, frontend-only scope. Contains `reference/` for one-off content. |
| `playwright-smart-locators` | MANDATORY SmartLocator + data-qa locator rules, parent/child patterns, language-agnostic assertions, naming conventions, locator debugging, Step 5 locator details. |
| `playwright-dom-inspection` | DOM-first rule + full Practical DOM Inspection Workflow (inspector test, run, doc template, cleanup, auth & cookie patterns, common issues), DOM inspection example & process. |
| `playwright-figma-visual` | Figma extraction (Step 3.5), figma-values files, @visual test pattern, "never hardcode" rule, Visual Validation. |
| `playwright-accessibility` | @Accessibility testing guidelines (WCAG 2.1 AA, structure, required checks). |
| `playwright-test-failure-analysis` | Systematic Test Analysis Framework, Debugging Guidelines, Test Failure Analysis Guidelines. |
| `playwright-test-documentation` | Documentation Requirements (test-case md, README updates, format, review). |
| `playwright-pre-pr-checklist` | Component Development Checklist, Step 6 self-review, Pre-PR checklist + validation commands. |

## Skills added after the original split (not derived from playwright-prompt.md)

| Skill | Responsibility | Source of truth |
|-------|----------------|-----------------|
| `playwright-execution-reporting` | Test execution (`TEST_ENV`, projects, headed/debug, tag filter) + reports (HTML, Allure, selector-health) + failure artifacts. Covers Steps 7–8. | Verified against `playwright.config.ts` + `package.json` |
| `azure-devops-bug-workflow` | Read requirements, log bugs, re-verify bugs. Wraps `scripts/fetch-requirements.js`, `scripts/log-bug.js`, `scripts/bug-helper.js` + Azure DevOps MCP. Has its own `reference/` for per-task data. | Verified against the three scripts + `package.json` |
| `ado-test-case-generation` | Scope-driven BE + FE test-case sheet (`.xlsx`, ADO-import 9-column). Classifies each AC as BE (Sitecore authoring/roles) vs FE (rendering), applies conditional rules only when the story triggers them. Distinct from `playwright-test-documentation` (FE-only markdown blueprint). Backed by `scripts/generate-testcase-sheet.ts`. | Verified against `scripts/generate-testcase-sheet.ts` + the `xlsx` dependency |
| `requirement-analysis` | Analyze a fetched requirement into a QA-ready output: plain-language summary, QA scope (in/out of scope, test types, sites/languages/environments, prerequisites), and business gaps (ambiguous/missing/untestable ACs, edge cases, open questions). Read-only thinking step before test design. Backs the `/analyze-requirement` command; builds on `azure-devops-bug-workflow` for the fetch. | Verified against `azure-devops-bug-workflow`, `config/rollout-config.ts`, `helpers/utils/envUtils.ts` |

> Note: `playwright-test-authoring` also gained `reference/sample-task-invocation.md`, `reference/example-requirement-document-download.md`, `reference/_TASK-TEMPLATE.md`, `reference/task-visualasset.md`, and `reference/README.md` (per-task data + worked examples). The byte-for-byte backup now exists at `docs/ai-prompt-source/playwright-prompt.original.md` (md5 verified).

## Section-by-section mapping (by original line range)

| Original lines | Original section | Destination |
|---|---|---|
| 1–19 | File header comment + Usage/Note bullets + Last Updated | `playwright-test-authoring/SKILL.md` → "Original file header & global notes" |
| 21–69 | 🚀 CRITICAL: SmartLocator Implementation (MANDATORY) | `playwright-smart-locators/SKILL.md` |
| 73–104 | CRITICAL: Systematic Test Analysis Framework | `playwright-test-failure-analysis/SKILL.md` |
| 106–113 | CRITICAL: DOM-First Approach for Multi-Language Support | `playwright-dom-inspection/SKILL.md` |
| 115–121 | Implementation Guidelines → 1. URL Management | `playwright-test-authoring/SKILL.md` |
| 123–140 | 2. Locator Guidelines (SmartLocator priority order + benefits) | `playwright-smart-locators/SKILL.md` |
| 141–151 | DOM Inspection Process (MANDATORY STEPS) | `playwright-dom-inspection/SKILL.md` |
| 153–225 | SmartLocator Implementation Pattern + Language-Agnostic Assertions | `playwright-smart-locators/SKILL.md` |
| 227–242 | DOM Structure Documentation | `playwright-dom-inspection/SKILL.md` |
| 244–248 | 3. Component Structure | `playwright-test-authoring/SKILL.md` |
| 249–285 | 4. Why Use data-qa Attributes + Comparison + Multi-Language Compatibility | `playwright-smart-locators/SKILL.md` |
| 287–308 | 5. DOM Inspection Workflow (MANDATORY) | `playwright-dom-inspection/SKILL.md` |
| 310–314 | 6. Test File Structure | `playwright-test-authoring/SKILL.md` |
| 315–321 | 7. Debugging Guidelines (headed/debug/slowMo/video/screenshots) | `playwright-test-failure-analysis/SKILL.md` |
| 322–329 | Critical: Systematic Test Analysis to Prevent Missing Issues | `playwright-test-failure-analysis/SKILL.md` |
| 330–347 | Locator Debugging (Updated for data-qa) + DOM Inspection Commands | `playwright-smart-locators/SKILL.md` |
| 349–434 | Quick Reference: data-qa Patterns + Naming + SmartLocator Pattern for ALL Elements (incl. child) | `playwright-smart-locators/SKILL.md` |
| 436–462 | Multi-Language Test Patterns | `playwright-smart-locators/SKILL.md` |
| 464–537 | DOM Inspection Example - Step by Step Process | `playwright-dom-inspection/SKILL.md` |
| 539–857 | 🔍 Practical DOM Inspection Workflow (inspector file, run, doc, cleanup, auth, best practices, common issues) | `playwright-dom-inspection/SKILL.md` |
| 859–890 | Documentation Requirements | `playwright-test-documentation/SKILL.md` |
| 892–901 | Component Development Checklist | `playwright-pre-pr-checklist/SKILL.md` |
| 903–920 | Accessibility Testing Guidelines | `playwright-accessibility/SKILL.md` |
| 922–971 | Test Failure Analysis Guidelines (incl. TC-A id format + WCAG notes at 968–970) | `playwright-test-failure-analysis/SKILL.md` (TC-A/WCAG notes also echoed in `playwright-accessibility/SKILL.md`) |
| 973–1140 | Requirements → Document Download Component (example) | `playwright-test-authoring/reference/example-requirement-document-download.md` |
| 1145–1183 | Testing Process Guidelines (Test-First 5 phases) | `playwright-test-authoring/SKILL.md` |
| 1186–1210 | Implementation Notes (componentURL, envUtils, run commands) | `playwright-test-authoring/SKILL.md` |
| 1213–1235 | Visual asset component task: Steps 1–3 + Test Page URLs | `playwright-test-authoring/reference/sample-task-invocation.md` (generalized form in SKILL.md) |
| 1239–1287 | Step 3.5: Extract Figma Design Specifications | `playwright-figma-visual/SKILL.md` (verbatim copy also in sample-task-invocation.md) |
| 1290–1307 | Step 4 + ⚠️ Frontend Validation Only | `playwright-test-authoring/SKILL.md` (verbatim copy also in sample-task-invocation.md) |
| 1309–1334 | Step 5: SmartLocator Implementation (MANDATORY) + example | `playwright-smart-locators/SKILL.md` (verbatim copy also in sample-task-invocation.md) |
| 1336–1338 | Visual Validation (general rule + Figma URL) | `playwright-figma-visual/SKILL.md` |
| 1341–1356 | Transparency datagrid Figma node IDs (task-specific) | `playwright-test-authoring/reference/sample-task-invocation.md` |
| 1359–1368 | Step 6: Self review checklist | `playwright-pre-pr-checklist/SKILL.md` (verbatim copy also in sample-task-invocation.md) |
| 1370–1372 | Step 7 + Step 8 (execute + selector health review) | `playwright-test-authoring/SKILL.md` (verbatim copy also in sample-task-invocation.md) |
| 1376–1433 | Prompt to provide before raising a PR (Pre-PR Checklist + commands) | `playwright-pre-pr-checklist/SKILL.md` |
| 1435–1443 | Trailing blank lines | (none — no content) |

## Notes
- The dangling doc references in the original (`docs/AI-AUTO-HEALING-SELECTORS.md`, `docs/SMART-LOCATORS-CHEATSHEET.md`) were preserved verbatim in `playwright-smart-locators/SKILL.md`, with an added note that those files do not currently exist in the repo.
- Where the original repeated content (e.g. Step 3.5 Figma block appears both as general guidance and inside the task block), the reusable copy lives in the topic skill and the verbatim task copy is preserved in the `reference/` file. Nothing was summarized away.

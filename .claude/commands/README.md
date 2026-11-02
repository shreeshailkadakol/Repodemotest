# Team Slash Commands

Shared, standardized commands for this framework. They are committed to the repo, so **every team member gets the same commands automatically on `git pull`** — no per-person setup. Type `/` in the Claude Code chat and pick the command (or type its name).

| Command | What it does | Backing |
|---|---|---|
| `/smoke [--parallel N] [--config path]` | Market smoke test — validates all homepages in `MarketURLs.json` | `npm run smoke:test` (`npx tsx scripts/smoke-test.ts`) |
| `/sanity-prod` | Run the prod sanity suite | `npm run test:prod:suite:functional:india` |
| `/rollout-validation` | Run the prod rollout validation suite | `npm run test:prod:suite:rollout` |
| `/redirect-pages [file]` | Validate page redirects | `test-data/UK-Redirects.xlsx` |
| `/redirect-assets [file]` | Validate asset redirects | `redirect-checker/input/assets.xlsx` |
| `/create-component <id> [env]` | Full end-to-end flow (orchestrates the standalone steps below) | `playwright-*` + `azure-devops-bug-workflow` skills |
| `/analyze-requirement <id>` | Analyze an Azure DevOps work item — summary, QA scope & business gaps | `requirement-analysis` skill |
| `/generate-test-cases <id\|name>` | Generate **FE** test cases as Playwright docs under `docs/test-cases/` (markdown blueprint) | `playwright-test-documentation` skill |
| `/generate-be-fe-test-cases <id\|name>` | Generate **BE + FE** test cases as a sheet (`.xlsx`, ADO-import 9-column) | `ado-test-case-generation` skill |
| `/log-bug <desc>` | Draft & (after approval) log an ADO bug | `azure-devops-bug-workflow` skill |
| `/pr-checklist` | Run the Pre-PR validation gates on the current diff | `playwright-pre-pr-checklist` skill |

The standalone commands (`/analyze-requirement`, `/generate-test-cases`, `/log-bug`, `/pr-checklist`) can be run on their own, or `/create-component` runs them as one chained flow.

## Notes
- **Page redirects** read `test-data/UK-Redirects.xlsx` by default. **Asset redirects** expect `redirect-checker/input/assets.xlsx` (place your asset URL list there) — or pass a path, e.g. `/redirect-assets ../test-data/UK-Assets.xlsx`.
- **`/create-component` inputs are NOT auto-discovered.** You must supply the user story ID, Test Page URL, and Figma URL/node IDs via a `reference/task-<component>.md` file (copied from `_TASK-TEMPLATE.md`). The flow fetches the *requirement content* and *Figma values* from those inputs — it does not find the URLs for you.
- **Bug logging** in `/create-component` always pauses for confirmation before creating an Azure DevOps work item.
- **Two test-case commands, two deliverables.** `/generate-test-cases` produces the **FE** Playwright markdown blueprint (`docs/test-cases/*.md`, TC-IDs, DOM tree, Figma tables) that feeds automation. `/generate-be-fe-test-cases` produces a scope-driven **BE + FE** manual/exploratory sheet (`.xlsx`, ADO-import) covering Sitecore authoring + roles + FE rendering.
- These commands wrap the existing skills in `.claude/skills/` and npm scripts in `package.json` — update those if test invocations change.

# CLAUDE.md

Project guidance for Claude Code. Keep this short — it loads every session. Detailed workflows live in `.claude/skills/`; on-demand actions live in `.claude/commands/`.

## What this project is
Playwright + TypeScript test-automation framework for **Bayer Beyond** — component tests plus multi-site/multi-language **rollout validation** for the Sitecore migration. Scope is **frontend only**.

## How to work with us (honesty over agreement)
Be direct and evidence-based, not a yes-man. Specifically:
- **Disagree when warranted.** If an instruction, assumption, or piece of code is wrong, say so and explain why — don't go along with it to be agreeable.
- **Hold a correct position under pushback.** Don't reverse a right answer just because it's questioned; re-verify, then either defend it with evidence or correct it for a real reason.
- **Report reality plainly.** If tests fail, say they failed and show the output. If a step was skipped or a result is uncertain, state that. Never spin failures as success.
- **State confidence honestly.** Flag assumptions and uncertainty; don't project false confidence to please.
- **Skip flattery.** No "great question" padding — lead with the substance.
- This means honest, not contrarian — don't manufacture disagreement; the goal is accuracy.

## Non-negotiable conventions
- **DOM-first:** inspect the live DOM and capture real `data-qa` / `data-testid` attributes BEFORE writing any locator (see skill `playwright-dom-inspection`).
- **SmartLocators only:** use `findSmart/clickSmart/fillSmart/getTextSmart/isVisibleSmart` with 3+ fallbacks and a meaningful `description`. No raw `page.locator()` / `container.locator()` (see skill `playwright-smart-locators`).
- **Soft assertions only** — never hard assertions that abort the run and hide defects.
- **Language-agnostic** — no content-dependent text assertions; validate structure/attributes so tests work across locales.
- **No emojis** anywhere in test code, names, or console output.
- **Never hardcode** base URLs or design values — base URLs via `envUtils.getBaseUrl()`, component URLs in `componentURL.ts`, design values from Figma (skill `playwright-figma-visual`).

## URLs & environments
- Component-spec base URL: `envUtils.getBaseUrl()`, selected by `TEST_ENV` (keys in `helpers/utils/envUtils.ts`: `qa`, `prod`, `prod_in`, `prod_kultur`, `prod_au`, `prod_japan`, `prod_pallas`, …).
- **Rollout** targets are NOT from envUtils — they come from `config/rollout-config.ts` (`rolloutConfig.sites[]`); `getAllSiteLanguageCombinations()` filters to one site when `TEST_ENV` matches its `env`. Adding a site needs an entry in BOTH `rollout-config.ts` and `envUtils.ts` (the latter so `playwright.config.ts`'s `getBaseUrl()` doesn't throw).

## Common commands
- Run all (prod): `npm test` · Lint: `npm run lint` / fix: `npm run lint:fix` · Validate: `npm run validate`
- Rollout suite: `npm run test:prod:suite:rollout` · Sanity (India): `npm run test:prod:suite:functional:india`
- Single env run: `npx cross-env TEST_ENV=<key> npx playwright test <spec> --project=chromium --grep "@Functional" --reporter=list`
- Reports: Allure via `npm run allure:generate` / `allure:open`; selector health at `reports/selector-health/selector-health.html`

## Project structure
- `tests/specs/` component specs · `tests/specs/rollout/` rollout-area specs
- `helpers/` page objects + utils (`helpers/rollout/linkValidator.ts`, `helpers/utils/envUtils.ts`)
- `config/` (`rollout-config.ts`, `MarketURLs.json`) · `docs/test-cases/` test-case docs
- `redirect-checker/` URL/redirect validation (`npm run redirect:check`)

## Workflow expectations
- **Test-first:** requirements → test cases → review → implementation → execution → analysis (orchestrated by skill `playwright-test-authoring`; pre-PR gates in `playwright-pre-pr-checklist`).
- **Azure DevOps:** fetch requirements / log bugs via skill `azure-devops-bug-workflow` (`npm run fetch-requirements` / `log-bug`). Always confirm with the user before creating an ADO work item.
- **Secrets:** never commit or print tokens/keys (e.g. `FIGMA_TOKEN`); they come from env vars.

## Team commands (type `/` in chat)
`/smoke` · `/sanity-prod` · `/rollout-validation` · `/redirect-pages` · `/redirect-assets` · `/create-component` · `/analyze-requirement` · `/generate-test-cases` (FE) · `/generate-be-fe-test-cases` (BE + FE) · `/log-bug` · `/pr-checklist` — see `.claude/commands/README.md`.

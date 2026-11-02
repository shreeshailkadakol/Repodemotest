# Bayer Beyond – Test Automation Framework

A new-teammate guide to what this project is, what it can do, and how to use it.
If you only read one page, read this one.

---

## 1. What is this?

This is an automated **testing framework for the Bayer Beyond website**, built with
[Playwright](https://playwright.dev/) and TypeScript. It checks that website components
(headers, teasers, search, forms, etc.) look and behave correctly across browsers and
screen sizes — automatically, instead of by hand.

It tests the **frontend** (what the end user sees and interacts with). It does **not** test
the CMS/backend that produces the content.

---

## 2. What can it do? (Capabilities)

| Capability | What it means |
|------------|---------------|
| **Component tests** | Verify each website component renders and behaves correctly. ~60 components covered. |
| **Functional testing** | Clicks, links, forms, navigation work as expected (`@functional`). |
| **Accessibility testing** | WCAG 2.1 AA checks using axe-core — keyboard, screen-reader, contrast (`@Accessibility`). |
| **Visual testing** | Typography, colours, spacing checked against the **Figma** design (`@visual`). |
| **Performance testing** | Load times and responsiveness (`@performance`). |
| **Cross-browser / responsive** | Chromium, Firefox, WebKit, Edge + mobile/tablet/desktop viewports. |
| **Smart locators** | AI-assisted, self-healing element locators that survive small UI changes. |
| **URL redirect testing** | Validates redirects from an Excel list (see `redirect-checker/`). |
| **Smoke testing** | Quick health check that market homepages load (`scripts/smoke-test.ts`). |
| **Azure DevOps integration** | Pull requirements from user stories and log bugs back, from the command line. |
| **Reporting** | Playwright HTML report, Allure report, and a Selector-Health report. |

---

## 3. Project layout

```
components/          Page objects — one per website component
tests/specs/         The actual test files (*.spec.ts)
test-data/           Test data: URLs (componentURL.ts), fixtures
config/              Settings: viewports, registries, redirect config, global setup
helpers/             Shared utilities (base page, SmartLocator, reporters, orchestrator)
scripts/             Standalone tools (page-validate, batch-validate, smoke-test, figma-extractor)
docs/                Documentation (you are here) + per-component test cases in docs/test-cases/
reports/             Generated test reports (HTML, Allure, selector-health)
redirect-checker/    URL redirect testing tool
.claude/skills/      AI assistant skills (see "AI assistance")
```

---

## 4. Prerequisites & access

Before your first run, make sure you have:

- **Node.js** (LTS), **Git**, and **VS Code** installed.
- **Azure DevOps access** to the project (organization `Bayer-SMO-UniNetHub`, project `BayCorpWeb`)
  and a **Personal Access Token (PAT)** with **Work Items (Read & Write)** scope.
  Create one in Azure DevOps → *User settings* → *Personal access tokens*. Use least privilege.
- **Figma access** and a **Figma token** — needed for visual tests and design extraction.
- **Test-page access:** the test pages are **protected by HTTP basic auth**. Get the
  username/password from your team lead (they're handled in code by `BasePage`/config — **don't
  commit them anywhere**).

> 🔒 **Never commit secrets.** Tokens go in `.env` (gitignored). If a token leaks, rotate it immediately.

---

## 5. First-time setup

1. **Clone the repo** and open it in VS Code.
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Install browsers** (Playwright):
   ```bash
   npx playwright install
   ```
4. **Create a `.env` file** in the project root:
   ```
   AZURE_DEVOPS_PAT=your-azure-personal-access-token   # for requirements/bugs
   FIGMA_TOKEN=your-figma-token                          # for visual tests
   ```
   See [`ENV-SETUP.md`](./ENV-SETUP.md) for the full list.

> **Note on MCP / AI tools:** the figma and azure-devops integrations also need these values
> set as **environment variables** (not just `.env`) — see [`mcp-setup.md`](./mcp-setup.md).

---

## 6. Recommended editor setup

VS Code is the assumed editor. Install these extensions:

- **Playwright Test for VSCode** (`ms-playwright.playwright`) — run/debug tests from the editor
- **ESLint** (`dbaeumer.vscode-eslint`) — code quality
- **Prettier** (`esbenp.prettier-vscode`) — formatting
- **SonarLint** (`SonarSource.sonarlint-vscode`) — extra static analysis
- **GitHub Copilot** and/or **Claude Code** — the AI assistant that drives the skills

After setting environment variables, **restart the editor** so the AI/MCP tools pick them up.

### Enabling the MCP servers (Figma / Playwright / Azure DevOps)

The AI assistant uses three MCP servers. They're configured for both tools — `.vscode/mcp.json` (Copilot)
and root `.mcp.json` (Claude Code) — but the servers read tokens from your **real OS environment, not `.env`**.
So a one-time setup is needed:

1. **Put the tokens in your OS environment** (not just `.env`). On Windows, from the repo root in **Git Bash**:
   ```bash
   # reads the values from .env and sets them as persistent USER env vars (no token printed)
   FIGMA_TOKEN=$(grep '^FIGMA_TOKEN=' .env | cut -d= -f2- | tr -d '\r')
   ADO_PAT=$(grep '^AZURE_DEVOPS_PAT=' .env | cut -d= -f2- | tr -d '\r')
   setx FIGMA_TOKEN "$FIGMA_TOKEN"
   setx AZURE_DEVOPS_PAT "$ADO_PAT"
   ```
   (Or in PowerShell: `[Environment]::SetEnvironmentVariable('FIGMA_TOKEN','<value>','User')`.)

2. **Fully quit and reopen VS Code** — `setx` only affects newly launched processes, and this same
   restart makes Claude Code re-read the root `.mcp.json`. (A "Reload Window" is **not** enough.)

3. **Approve** the three project MCP servers (`figma`, `playwright`, `azure-devops`) when Claude Code
   prompts on the fresh session.

4. **Verify:**
   - In Claude Code, run **`/mcp`** → all three should show *connected*.
   - In a new terminal: `echo $FIGMA_TOKEN` (Git Bash) / `$env:FIGMA_TOKEN` (PowerShell) should print a value.

> 🔒 These tokens then live in your user registry — rotate them periodically, and never commit `.env`.
> Full details and the Copilot-vs-Claude-Code schema differences: [`mcp-setup.md`](./mcp-setup.md).

---

## 7. How to run tests

Tests pick an environment with `TEST_ENV` (`prod`, `prod_in`, or `qa`).

```bash
# Run the whole suite (prod)
npm test

# Run a single component's tests
npx cross-env TEST_ENV=prod npx playwright test tests/specs/<Component>.spec.ts

# See the browser while it runs (headed), one browser only
npx cross-env TEST_ENV=prod npx playwright test tests/specs/<Component>.spec.ts --headed --project=chromium

# Run only one type of test (by tag)
npx cross-env TEST_ENV=prod npx playwright test tests/specs/<Component>.spec.ts --grep "@Accessibility"

# Step-through debug mode
npx cross-env TEST_ENV=prod npx playwright test tests/specs/<Component>.spec.ts --debug
```

More run options and report locations: see the `playwright-execution-reporting` skill.

---

## 8. Reading the results

After a run, reports are written under `reports/`:

| Report | Location | Open with |
|--------|----------|-----------|
| HTML report | `reports/html-report/` | `npx playwright show-report ./reports/html-report` |
| Allure report | `reports/allure/` | `npm run allure:generate` then `npm run allure:open` |
| Selector health | `reports/selector-health/selector-health.html` | open in a browser |

Failed tests automatically save a **video** and **screenshot** for debugging.

---

## 9. Creating a new component test

**You don't do these steps by hand.** You fill in a small template with a few details, and the
AI assistant runs the whole flow for you.

**Your part (just fill in a template):**

1. Copy the task template
   `.claude/skills/playwright-test-authoring/reference/_TASK-TEMPLATE.md`
   to a new file like `reference/task-<component-name>.md`.
2. Fill in only the variable details:
   - **Component name**
   - **User story number(s)**
   - **Test page URL**
   - **Figma URL + per-viewport node IDs**
3. In chat, point the assistant at your task file, for example:
   > Follow the playwright test-authoring skills. Use `reference/task-<component-name>.md`
   > for the story number, test page URL, and Figma node IDs. Execute Steps 1–8.

(There's a worked example to copy from: `reference/task-visualasset.md`.)

**What the assistant then does for you (test-first):**

1. Fetches the requirement from Azure DevOps (`fetch-requirements`)
2. Inspects the live page's DOM for stable `data-qa` attributes
3. Pulls design values from Figma for visual checks
4. Writes the test cases (in `docs/test-cases/`) — **for your review**
5. Writes the test scripts using SmartLocators
6. Runs, reviews, and refines

You only review at the checkpoints (test cases, results). The detailed rules live in the skills —
you don't have to memorise them.

---

## 10. AI assistance (Claude Code skills)

This repo ships **skills** that guide the AI assistant (and you) through common tasks. They live
in `.claude/skills/`:

- **playwright-test-authoring** – the start-to-finish process for building a component's tests
- **playwright-dom-inspection** – inspect the live DOM before writing locators
- **playwright-smart-locators** – the locator rules (always use SmartLocators)
- **playwright-figma-visual** – extract Figma values for visual tests
- **playwright-accessibility** – accessibility (WCAG) testing
- **playwright-execution-reporting** – running tests and reading reports
- **playwright-test-failure-analysis** – debugging failures systematically
- **playwright-test-documentation** – writing the test-case docs
- **playwright-pre-pr-checklist** – what to check before raising a PR
- **azure-devops-bug-workflow** – read requirements, log bugs, re-verify

These use **MCP servers** (figma, playwright, azure-devops) configured for both GitHub Copilot
and Claude Code — see [`mcp-setup.md`](./mcp-setup.md).

---

## 11. Logging and verifying bugs

```bash
# Interactive bug wizard (easiest)
npm run bug-helper

# Or log a bug directly
npm run log-bug -- --title="..." --steps="Step 1|Step 2" --parent-story=1234 --tags="FE,visual"
```

Bugs are created in Azure DevOps, linked to their user story, with a local copy saved in
`docs/bugs/`. To re-verify a fix, re-run the test and re-check the bug's state. Full details:
the `azure-devops-bug-workflow` skill.

---

## 12. Other tools

```bash
npm run smoke:test       # quick health check of market homepages
npm run redirect:check   # validate URL redirects
npm run lint             # check code quality
npm run format           # auto-format code
```

---

## 13. Contributing & PR workflow

1. **Branch** off the main branch using a `type/description` name, e.g. `feature/news-list-tests`,
   `chore/cleanup`, `fix/footer-locator`. (Confirm the target branch — `main` or `develop` — with your team.)
2. **Make your changes**, following the conventions the skills enforce: SmartLocators only, soft
   assertions, meaningful descriptions, no emojis in code/console.
3. **Before you raise a PR**, run the checks:
   ```bash
   npm run lint      # or: npm run lint:fix
   npm run format
   npm test          # run the relevant tests
   ```
   Then walk the **playwright-pre-pr-checklist** skill (SmartLocator compliance, assertions,
   selector-health report, docs).
4. **Open the PR.** CI (GitHub Actions, incl. `playwright.yml`) runs automatically — make sure it's green.
5. **Update docs** — add/adjust the component's file in `docs/test-cases/` as part of the PR.

---

## 14. Troubleshooting

| Problem | Fix |
|---------|-----|
| **Blank/auth-error page** (`ERR_INVALID_AUTH_CREDENTIALS`) | Test pages need HTTP basic auth — make sure the credentials are configured (see Prerequisites). `BasePage` applies them. |
| **Cookie banner covers content** | Handled by `acceptCookiesBanner()`; for a brand-new page, wait a moment then accept. |
| **Token/env var "not set"** | Tokens must be in `.env` for the scripts **and** in your real environment for MCP. Restart the editor after changing them. |
| **"browser not found"** | Run `npx playwright install`. |
| **Lint/format errors** | `npm run lint:fix` and `npm run format`. |
| **Test is slow/flaky** | `slowMo` is enabled by config; run `--headed` to watch what happens, or `--debug` to step through. |

For analysing test failures systematically, use the **playwright-test-failure-analysis** skill.

---

## 15. Glossary

- **SmartLocator** – an AI-assisted way to find elements that tries several strategies and
  self-heals when the UI changes. Always used instead of raw `page.locator()`.
- **data-qa** – a stable HTML attribute added just for testing; the preferred, language-independent
  way to identify elements.
- **Page object** – a class per component (in `components/`) holding its locators and actions.
- **Test tags** – labels like `@functional`, `@Accessibility`, `@visual`, `@performance` used to
  run a subset of tests with `--grep`.
- **TEST_ENV** – which environment to run against: `prod`, `prod_in`, or `qa`.
- **Selector-health report** – a report (`reports/selector-health/`) showing which locators are
  brittle and may need attention.
- **MCP** – "Model Context Protocol" servers (figma, playwright, azure-devops) the AI assistant uses.

---

## 16. Where to find more

- **Per-component test cases:** `docs/test-cases/`
- **Environment setup:** [`ENV-SETUP.md`](./ENV-SETUP.md)
- **MCP / AI tool setup:** [`mcp-setup.md`](./mcp-setup.md)
- **Redirect testing:** [`URL-Redirect-Testing-Framework.md`](./URL-Redirect-Testing-Framework.md)
- **Performance testing:** [`Performance-Testing-Documentation.md`](./Performance-Testing-Documentation.md)
- **The detailed rules the AI follows:** `.claude/skills/` and the root `playwright-prompt.md`

Welcome to the team — when in doubt, ask the AI assistant to follow the relevant skill, or check
the docs above.

---
name: playwright-test-authoring
description: Entry-point/orchestrator skill for creating Playwright component tests in this framework (Bayer Beyond). Use when asked to build automated tests for a component/user story from scratch. Covers the test-first process (requirements → test cases → review → implementation → execution), the generalized Step 1-8 flow, URL management, component/test-file structure, frontend-only scope, and links to the focused sub-skills.
---

# Playwright Component Test Authoring (Process Entry Point)

> Source: extracted verbatim from `playwright-prompt.md` (backup at `docs/ai-prompt-source/playwright-prompt.original.md`). See `.claude/skills/MANIFEST.md` for the full section map.

## Original file header & global notes (from playwright-prompt.md)

```
File: playwright-prompt.md
Purpose: This file contains pre-defined prompts for interacting with the Playwright MCP server
         using the Claudia AI assistant integrated in Visual Studio Code.

Usage:
  - Use these prompts to automate tasks related to test execution, test status, test generation,
    debugging, and environment configuration using Playwright and Claudia AI.

Note:
  - Make sure Claudia is configured with access to the MCP server and Playwright test suite.
  - Use short and precise prompts to receive faster and more accurate results.
  - ALWAYS inspect live DOM structure before creating locators
  - PRIORITIZE data-qa attributes for multi-language compatibility
  - CRITICAL: Use systematic extraction commands for test failure analysis - NEVER manually scan output
  - MANDATORY: ALL new components MUST use SmartLocator methods (See SmartLocator Guidelines below)

Last Updated: February 14, 2026
```

## Related skills (split out from the same source)
- **playwright-smart-locators** — MANDATORY SmartLocator + data-qa locator rules (incl. Step 5 locator details)
- **playwright-dom-inspection** — MANDATORY live-DOM inspection workflow (run before any locators)
- **playwright-figma-visual** — Figma extraction (Step 3.5) + @visual test rules
- **playwright-accessibility** — @Accessibility testing guidelines
- **playwright-test-failure-analysis** — systematic failure triage + debugging (Steps 7–8 analysis)
- **playwright-test-documentation** — docs/test-cases requirements
- **playwright-pre-pr-checklist** — Component Development Checklist, Step 6 self-review, Pre-PR checklist

## Reference (one-off content preserved losslessly)
- `reference/example-requirement-document-download.md` — full Document Download Component requirement example
- `reference/sample-task-invocation.md` — the Visual Asset Component / Transparency datagrid task invocation (Steps 1–8, specific URLs, Figma node IDs)

---

## Implementation Guidelines
Before implementing any test case, ensure the following rules are followed:

1. **URL Management**:
   - All URLs should be stored in the `componentURL.ts` file under a meaningful component name.
   - URLs must be accessed using the `getComponentUrl` method from the base class.
   - Base URLs should NEVER be hardcoded in test files, always use `envUtils.getBaseUrl()`.

2. **Locator Guidelines** — see **playwright-smart-locators** and **playwright-dom-inspection** (MANDATORY SmartLocator + DOM-first rules).

3. **Component Structure**:
   - Each component should extend the BasePage class.
   - Components should handle their own cookie acceptance using inherited `acceptCookiesBanner()`.
   - Keep related functionality within the same component.

4. **Why Use data-qa Attributes (Primary Choice)** — see **playwright-smart-locators**.

5. **DOM Inspection Workflow (MANDATORY)** — see **playwright-dom-inspection**.

6. **Test File Structure**:
   - Import envUtils for base URL management.
   - Use component's own methods for common actions (e.g., cookie acceptance).
   - Follow the page object pattern strictly.

7. **Debugging Guidelines** — see **playwright-test-failure-analysis** (and locator debugging in **playwright-smart-locators**).

---

## Testing Process Guidelines

**CRITICAL: Test-First Approach - Always Follow This Order**

When creating test automation for any requirement, you MUST follow this exact sequence:

#### 1. **Requirements Analysis Phase** (MANDATORY FIRST STEP)
- Fetch and analyze the specific requirement from Azure DevOps
- Understand the acceptance criteria thoroughly
- Identify the component/functionality to be tested
- Determine the test scope and boundaries

#### 2. **Test Case Design Phase** (BEFORE ANY CODE)
- Create comprehensive test case documentation first
- Document test scenarios in markdown format
- Include test steps, expected results, and test data
- Use proper test case IDs following the format: TC-{Component Initial}{Number}
- Cover positive, negative, and edge cases
- Include accessibility test cases with "@Accessibility" tag
- Add performance and cross-browser test scenarios

#### 3. **Test Case Review Phase** (VALIDATION)
- Review test cases against requirements
- Ensure complete coverage of acceptance criteria
- Validate test scenarios make logical sense
- Check for any missing test cases

#### 4. **Test Script Implementation Phase** (AFTER TEST CASES)
- Convert documented test cases into automated scripts
- Use test case documentation as the blueprint
- Implement proper page object model structure
- Follow existing framework patterns and conventions
- Add appropriate test tags and annotations

#### 5. **Test Execution Phase** (FINAL STEP)
- Execute the implemented test scripts
- Verify all test cases pass as expected
- Report any failures or issues found
- Update test cases if needed based on execution results

---

## Implementation Notes

- Store component URL in `componentURL.ts`:
  ```typescript
  SocialMediaComponent: {
      testData: {
          url: "en/"
      }
  }
  ```
- Use envUtils for base URL:
  ```typescript
  const baseURL = envUtils.getBaseUrl();
  const url = await component.getComponentUrl('SocialMediaComponent', baseURL);
  ```
- Run tests:
  ```bash
  # Normal run
  cross-env TEST_ENV=prod playwright test tests/specs/SocialMedia.spec.ts

  # Headed mode
  cross-env TEST_ENV=prod playwright test tests/specs/SocialMedia.spec.ts --headed --project=chromium

  # Debug mode
  cross-env TEST_ENV=prod playwright test tests/specs/SocialMedia.spec.ts --debug
  ```

---

## Generalized Step 1–8 Test-Generation Flow

> This is the reusable form of the numbered steps. A concrete, task-specific instance (Visual Asset Component / Transparency datagrid, user stories 2602 / 2593) is preserved verbatim in `reference/sample-task-invocation.md`.

**Step 1**: Go through the prompt/skills completely and follow them strictly.

**Step 2**: Fetch the requirement from the user story using `fetch-requirements.js` script, AND fetch the complete requirement from the user story using the Azure DevOps MCP server including:
- Synopsis (User Story)
- Description (Component behavior and key features)
- Acceptance Criteria (All ACs)
- Assumptions (API, data, technical assumptions)
- Technical Notes (API endpoints, documentation links)
- Comments/History (Latest updates and QA notes)

**Step 3**: Launch the test page and understand what all need to be validated from FE and share your understanding with user for review and inspect the DOM Structure by creating the DOM Inspect file. Authentication methods are available in base page. Check how other components handle authentication by looking at the BasePage implementation.
- For Step 3 DOM inspection implementation, refer to the **playwright-dom-inspection** skill ("Practical DOM Inspection Workflow") which provides complete code examples for authentication handling, cookie acceptance, and DOM structure extraction.

**Step 3.5**: Extract Figma Design Specifications (MANDATORY BEFORE STEP 4) — see **playwright-figma-visual**.

**Step 4**: Based on the DOM understanding, Figma design specifications, and FE requirements from user story, generate the Functional, Accessibility, Performance, Visual test cases and get it reviewed from user without fail.

**⚠️ CRITICAL - Frontend Validation Only**:
- **ONLY test Frontend rendering and behavior** - what the end user sees and interacts with
- **EXCLUDE CMS functionality** from test cases:
  - ❌ Do NOT test CMS create/edit/delete capabilities (AC1-type requirements)
  - ❌ Do NOT test CMS content editor fields or interfaces (AC3-type requirements)
  - ❌ Do NOT test CMS configuration interfaces (AC4-type requirements)
- **INCLUDE Frontend validations**:
  - ✅ Component renders correctly on the page
  - ✅ All content fields display properly (image, text, links)
  - ✅ Layout restrictions are enforced (e.g., 25%/33% column placement)
  - ✅ Interactive behavior works (hover effects, click functionality, navigation)
  - ✅ Visual design matches Figma (typography, colors, spacing)
  - ✅ Accessibility compliance (WCAG 2.1 AA)
  - ✅ Performance metrics (load time, animation smoothness)

**Test Case Focus**: Validate the **rendered output** that appears on the website, not the CMS backend that creates it.

**Step 5**: Generate the test scripts based on the test cases — see **playwright-smart-locators** (SmartLocator implementation, MANDATORY) and **playwright-figma-visual** (Visual Validation).

**Step 6**: Self review all the test scripts against the requirement — see **playwright-pre-pr-checklist**.

**Step 7**: Execute tests and wait for the page to load completely. (Run commands, `TEST_ENV`, projects, headed/debug — see **playwright-execution-reporting**.)

**Step 8**: After test execution, review the Selector Health Report at `reports/selector-health/selector-health.html` to identify any selectors needing optimization. (Reports & where they land: see **playwright-execution-reporting**; failure analysis: see **playwright-test-failure-analysis**.)

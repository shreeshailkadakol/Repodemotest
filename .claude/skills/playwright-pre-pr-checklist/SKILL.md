---
name: playwright-pre-pr-checklist
description: Pre-flight checklists and validation gates for Playwright test work in this framework. Use before starting a component (Component Development Checklist), during self-review of generated test scripts (Step 6), and before raising a PR (SmartLocator compliance, code quality, assertions, visual/cross-browser, code standards, documentation) including the validation commands to run.
---

# Checklists & Pre-PR Validation

> Source: extracted verbatim from `playwright-prompt.md` (backup at `docs/ai-prompt-source/playwright-prompt.original.md`). See `.claude/skills/MANIFEST.md` for the section map.

## Component Development Checklist
Before creating any new component test:

- [ ] **DOM Inspection Completed**: Live website inspected, actual data-qa attributes documented
- [ ] **Locators Use data-qa**: Primary locators use `[data-qa="..."]` attributes from actual DOM
- [ ] **Language-Agnostic Assertions**: No content-dependent assertions (toContainText, toHaveText with specific text)
- [ ] **Structural Validation**: Verify HTML semantic structure (H1, H2, IMG tags, etc.)
- [ ] **Multi-Language Ready**: Tests work across different language versions
- [ ] **Accessibility Compliant**: aria-label and other accessibility attributes verified
- [ ] **No CSS Class Dependencies**: Avoid CSS class-based locators unless absolutely necessary

---

## Step 6: Self review all the test scripts against the requirement
- Ensure ALL element interactions use SmartLocator methods (no traditional locators)
- **CRITICAL: Verify child element methods use `findSmart()`, NOT `container.locator()`**
- Verify EVERY element has multiple fallback strategies (minimum 3)
- Verify all data-qa attributes exist via DOM inspection (don't assume)
- Check for ambiguous role selectors that can match elements outside component
- Ensure all test scripts have functional, accessibility, performance, visual tags
- Soft assertion should be provided, strictly NO hard assertion
- Verify meaningful descriptions added for health monitoring
- Check selector health report will be generated at: reports/selector-health/selector-health.html

---

## Prompt to provide in the chat before raising a PR

**Pre-PR Checklist - SmartLocator Compliance**:

1. **SmartLocator Verification (CRITICAL)**:
   - [ ] ALL element interactions use SmartLocator methods (`findSmart`, `clickSmart`, `fillSmart`, etc.)
   - [ ] NO traditional `page.locator()` or hard-coded locators exist (including in child element methods)
   - [ ] **CHILD ELEMENTS: Verify ALL child/nested element methods use `findSmart()`, NOT `container.locator()`**
   - [ ] EVERY element has minimum 3 fallback strategies (semantic → data-qa → CSS)
   - [ ] ALL data-qa attributes verified via DOM inspection (not assumed)
   - [ ] Scoped CSS selectors used for child elements: `parent[data-qa="x"] child[data-qa="y"]`
   - [ ] No ambiguous role selectors that can match elements outside component scope
   - [ ] ALL SmartLocator calls include meaningful `description` field
   - [ ] Reviewed selector health report at reports/selector-health/selector-health.html
   - [ ] No selectors flagged as "needs attention" in health report

2. **Code Quality**:
   - [ ] No redundant or duplicate methods
   - [ ] lint checks with zero errors
   - [ ] All requirements and acceptance criteria fully covered

3. **Assertions & Error Handling**:
   - [ ] Use soft assertions for all validations (Playwright built-in `.soft` assertions)
   - [ ] No hard assertions that terminate tests prematurely
   - [ ] Code does not suppress or bypass potential defects
   - [ ] Full bug visibility maintained

4. **Visual & Cross-Browser Testing**:
   - [ ] All viewport test cases execute even if one fails
   - [ ] Font size, font family, line height, color verification for ALL elements
   - [ ] All viewport sizes are correct across all files

5. **Code Standards**:
   - [ ] No emojis in console statements, test case names, or anywhere in test scripts
   - [ ] No lint errors
   - [ ] Follows SmartLocator patterns from examples (see components/examples/headerSmart.example.ts)

6. **Documentation**:
   - [ ] Component uses SmartLocator methods documented with examples
   - [ ] DOM structure documented with actual data-qa/testId attributes found
   - [ ] Selector health considerations noted if any selector needed multiple attempts

**Run Pre-PR Validation Commands**:
```bash
# Run lint
npm run lint

# Run tests
playwright test [your-spec-file]

# Check selector health report (MANDATORY)
start reports\selector-health\selector-health.html

# Verify no traditional locators exist (should return 0 matches in your new code)
findstr /S /I "page.locator" components\YourComponent.ts
```

**SmartLocator Health Score Target**: Aim for >95% healthy selectors (green in health report)

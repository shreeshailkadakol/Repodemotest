---
name: playwright-test-failure-analysis
description: MANDATORY systematic process for analyzing Playwright test failures and debugging. Use whenever inspecting test output, triaging failures, comparing Expected vs Received values, grouping failures by viewport/element/property, or debugging tests (headed/debug/slowMo/video/screenshots). Enforces systematic extraction over manual scanning.
---

# Systematic Test Analysis & Failure Triage

> Source: extracted verbatim from `playwright-prompt.md` (backup at `docs/ai-prompt-source/playwright-prompt.original.md`). See `.claude/skills/MANIFEST.md` for the section map.

### CRITICAL: Systematic Test Analysis Framework
**MANDATORY REQUIREMENT**: Always use systematic approach to analyze test failures - NEVER manually scan output

**Systematic Analysis Process**:
1. **Extract ALL failure patterns systematically**:
   ```bash
   # Extract all Expected vs Received patterns
   playwright test [spec] --reporter=line 2>&1 | findstr /C:"Expected:" /C:"Received:"

   # Extract all error types
   playwright test [spec] --reporter=line 2>&1 | findstr /i "Error: expect"

   # Get failure summary
   playwright test [spec] --reporter=line 2>&1 | findstr /C:"failed"
   ```

2. **Mandatory Analysis Checklist** (Complete BEFORE concluding):
   - [ ] **Counted total failures** vs reported failures match
   - [ ] **Extracted every "Expected: X, Received: Y"** pattern systematically
   - [ ] **Grouped failures by viewport** (XL, LG, MD, SM)
   - [ ] **Grouped failures by element type** (Title, Description, Input, Button)
   - [ ] **Grouped failures by property** (fontSize, lineHeight, color, etc.)
   - [ ] **Cross-referenced with test names** to understand context
   - [ ] **Verified no issues missed** in any viewport

3. **Quality Assurance Questions** (Ask before submitting analysis):
   - "Did I find the same number of issues as the test summary reports?"
   - "Did I check EVERY viewport mentioned in the output?"
   - "Are there any 'Expected/Received' lines I didn't analyze?"
   - "Did I verify the issue pattern across similar components/viewports?"

4. **Never rely on manual scanning** - use systematic extraction commands above

---

## Debugging Guidelines

- Run tests in headed mode: `--headed --project=chromium`
- Use debug mode for investigating failures: `--debug`
- Add slowMo in playwright.config.ts for slower execution
- Enable video recording for failed and pass tests
- Use screenshots on failure

- **Critical: Systematic Test Analysis to Prevent Missing Issues**:
  ```bash
  # NEVER manually scan output - ALWAYS use systematic extraction
  playwright test [spec] --reporter=line 2>&1 | findstr /C:"Expected:" /C:"Received:"
  ```
  - Always cross-check failure count with systematic extraction
  - Verify patterns across ALL viewports mentioned in output
  - Use checklist approach rather than assumption-based analysis

> Locator-specific debugging (browser console checks, `.highlight()`, typo checks, DOM inspection commands) lives in the **playwright-smart-locators** skill.

---

## Test Failure Analysis Guidelines
⚠️ **CRITICAL**: Use systematic approach to analyze ALL test failures - never rely on manual scanning

1. **Systematic Failure Extraction Commands**:
   ```bash
   # Extract all Expected vs Received values systematically
   playwright test [spec] --reporter=line 2>&1 | findstr /C:"Expected:" /C:"Received:"

   # Extract all error types and patterns
   playwright test [spec] --reporter=line 2>&1 | findstr /i "Error: expect"

   # Get failure counts and summary
   playwright test [spec] --reporter=line 2>&1 | findstr /C:"failed"
   ```

2. **Mandatory Pre-Analysis Verification**:
   - [ ] **Total failure count matches** between extraction and test summary
   - [ ] **Every "Expected: X, Received: Y" pattern extracted** and analyzed
   - [ ] **All viewports checked** (XL, LG, MD, SM) for consistent patterns
   - [ ] **All element types analyzed** (Title, Description, Input, Button, etc.)
   - [ ] **All properties checked** (fontSize, lineHeight, color, width, etc.)
   - [ ] **Cross-referenced with test names** to understand failure context

3. **Analysis Structure Template**:
   ```markdown
   ## Component Test Analysis: [Component Name]
   ### ✅ Passing Tests: [X/Total]
   ### ❌ Failed Tests: [Y/Total]

   **Systematic Failure Breakdown:**
   1. **[Viewport] - [Element] - [Property] Issue:**
      - Expected: `[value]`, Actual: `[value]`
      - Test: `[test name]`
      - Root Cause: `[implementation/design issue]`

   **Verification Checklist Completed:**
   - [x] All Expected/Received patterns extracted
   - [x] All viewports analyzed for consistent issues
   - [x] Failure count matches test summary
   ```

4. **Quality Assurance Questions** (Always ask before concluding):
   - "Did I miss any viewport-specific issues?"
   - "Are there consistent patterns across similar elements?"
   - "Did I verify the same issue doesn't exist in other viewports?"
   - "Is my failure count accurate vs the test summary?"
      - Use test case IDs following format: TC-A{Component Initial}{Number}
      - Include specific WCAG success criteria being tested
      - Document any approved exceptions or limitations

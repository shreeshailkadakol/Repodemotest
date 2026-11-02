---
name: playwright-test-documentation
description: Documentation requirements for Playwright component test work in this framework. Use when creating or updating test-case markdown in docs/test-cases/, updating docs/test-cases/README.md, writing traceability matrices, naming test cases (TC-{Component Initial}{Number}), or preparing documentation for a PR review.
---

# Documentation Requirements

> Source: extracted verbatim from `playwright-prompt.md` (backup at `docs/ai-prompt-source/playwright-prompt.original.md`). See `.claude/skills/MANIFEST.md` for the section map.

1. **Test Case Documentation**:
   - Create a markdown file for each component in `docs/test-cases/` directory
   - File naming: `{component-name}.test-cases.md`
   - **MANDATORY - match the existing format.** BEFORE writing, open a recent sibling
     doc (e.g. `giant-teaser.test-cases.md`, `teaser-grid.test-cases.md`,
     `banner-s-variant.test-cases.md`) and mirror its structure and depth. New docs
     are typically 400-1200 lines - a short bullet list is NOT acceptable. Every test
     case is a fully-expanded block, never a one-line summary.
   - Include:
     - Traceability matrix linking tests to requirements
     - Detailed test steps and expected results
     - Prerequisites and setup requirements
     - Known limitations or special conditions

1a. **Required document structure (in this order):**
   ```
   # <Component> - Test Cases

   ## Component Information
   - Component Name, User Story (+ state), Test Page URL, Figma URL,
     Last Updated, Test Status, Scope (frontend only)

   ## Requirements Summary
   <1-2 paragraphs from the fetched requirement>
   ### Acceptance Criteria
   - AC1..ACn verbatim, then a frontend-testability note (which ACs are CMS-only)

   ## Design Reference Values (Figma ...)      <- when visual tests exist
   <table of typography/color/spacing per viewport, sourced from the FigmaValues file>

   ## Actual DOM Structure (from live inspection)   <- MANDATORY, fenced code block
   <the real data-qa tree captured in Step 2>

   ## Traceability Matrix
   | Test Case ID | AC | Test Type | Status |   <- one row per test case

   ---
   ## Functional Test Cases
   ## Accessibility Test Cases
   ## Visual Test Cases
   ## Performance Test Cases

   ## Prerequisites
   ## Assumptions and Notes
   ## Known Limitations
   ```

1b. **Per-test-case block format** (repeat for EVERY case, separated by `---`):
   ```
   ### TC-XX#: <clear title>
   **AC**: <ACs covered>
   **Priority**: High | Medium | Low
   **Tags**: @Component @Type ... (the exact tags the spec will use)

   **Preconditions**:
   - <state/setup, e.g. auth applied, cookie accepted, viewport>

   **Test Steps**:
   1. <numbered, concrete actions>

   **Expected Results**:
   - <bulleted, verifiable outcomes; language-agnostic; note soft assertions>
   ```

1c. **Test Case ID prefixes** (component initials after the type letter):
   - Functional: `TC-<Initials>#` (e.g. `TC-IT1`)
   - Accessibility: `TC-A<Initials>#` (e.g. `TC-AIT1`)
   - Visual: `TC-V<Initials>#` (e.g. `TC-VIT1`)
   - Performance: `TC-P<Initials>#` (e.g. `TC-PIT1`)

2. **README.md Updates**:
   - Update `docs/test-cases/README.md` when adding/modifying components
   - Add new component entry under the Components section
   - Include brief description of test coverage
   - Link to the component's test case file
   - Update status indicators in traceability matrix

3. **Documentation Format**:
   - Use clear, concise language
   - Include test case IDs following format: TC-{Component Initial}{Number}
   - Document status: Ready, Implemented, Blocked, or Deprecated
   - Add timestamps for last updates
   - Reference related tickets or requirements
   - **MANDATORY**: Include actual DOM structure found during inspection

4. **Review Process**:
   - Documentation updates are required as part of the PR
   - Review documentation for completeness and accuracy
   - Ensure traceability between requirements and test cases
   - Verify all links and references are working
   - **NEW**: Verify DOM inspection was performed and documented
   - **NEW**: Verify the doc matches the structure in section 1a and that every test
     case uses the full block format in section 1b (no terse/summary-only lists).
     Compare side-by-side against a sibling doc before considering it done.

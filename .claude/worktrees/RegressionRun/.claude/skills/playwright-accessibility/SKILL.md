---
name: playwright-accessibility
description: Accessibility (a11y) testing guidelines for Playwright component tests in this framework. Use when writing @Accessibility tests, validating WCAG 2.1 AA compliance, axe-core integration, keyboard navigation, screen-reader/ARIA checks, color contrast, alt text, heading structure, or form labels.
---

# Accessibility Testing Guidelines

> Source: extracted verbatim from `playwright-prompt.md` (backup at `docs/ai-prompt-source/playwright-prompt.original.md`). See `.claude/skills/MANIFEST.md` for the section map.

1. **Accessibility Standards**:
   - Tests should validate compliance with WCAG 2.1 AA standards
   - Use Playwright's accessibility testing features with axe-core integration
   - Focus on color contrast, keyboard navigation, screen reader compatibility, semantic HTML , Alt text for images and videos , Proper labeling for all form fields
2. **Accessibility Test Structure**:
   - Each component should have dedicated accessibility tests
   - Tests should be tagged with "@Accessibility"
   - test should be created respective component test spec file
3. **Required Accessibility Checks**:
   - Screen reader compatibility (aria attributes)
   - Keyboard navigation and focus management
   - Color contrast ratios
   - Alternative text for images
   - Proper heading structures
   - Form labels and error messages
4. **Accessibility Documentation**:
   - Add accessibility test cases to component documentation

> Related ID/format rules (preserved from the Test Failure Analysis section of the original prompt):
> - Use test case IDs following format: TC-A{Component Initial}{Number}
> - Include specific WCAG success criteria being tested
> - Document any approved exceptions or limitations

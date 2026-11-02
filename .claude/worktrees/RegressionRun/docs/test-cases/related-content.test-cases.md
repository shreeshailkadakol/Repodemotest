# Test Cases: Related Content Component

## Component Details
- **User Story**: 732 - Related Content component
- **Test Page**: https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint15/relatedcomponent
- **Figma**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=7096-61241
- **Date Created**: 2026-04-15
- **Total Test Cases**: 22 (10 Functional + 6 Accessibility + 1 Performance + 5 Visual)

---

## Traceability Matrix

| Test Case | AC | Category | Description | Status |
|-----------|----|----------|-------------|--------|
| TC-RC01 | AC3, AC10 | Functional | Component renders inside full-width content divider | Ready |
| TC-RC02 | AC10 | Functional | Component title is visible and non-empty | Ready |
| TC-RC03 | AC8, AC9, AC10 | Functional | Card count is between 2 and 4 | Ready |
| TC-RC04 | AC14 | Functional | Each card displays headline/title text | Ready |
| TC-RC05 | AC15 | Functional | Each card displays image or placeholder | Ready |
| TC-RC06 | AC10 | Functional | Each card has a CTA link | Ready |
| TC-RC07 | AC7 | Functional | Current page excluded from card links | Ready |
| TC-RC08 | AC11 | Functional | No duplicate pages among cards | Ready |
| TC-RC09 | AC10 | Functional | CTA links have valid href values | Ready |
| TC-RC10 | AC10 | Functional | Semantic article elements for cards | Ready |
| TC-RC11 | AC10 | Accessibility | Cards have aria-label | Ready |
| TC-RC12 | AC10 | Accessibility | CTA links have aria-label | Ready |
| TC-RC13 | AC10 | Accessibility | Keyboard navigation through cards | Ready |
| TC-RC14 | AC10 | Accessibility | Focus indicators visible | Ready |
| TC-RC15 | AC10 | Accessibility | Placeholder images have accessible label | Ready |
| TC-RC16 | AC10 | Accessibility | Semantic HTML structure | Ready |
| TC-RC17 | AC10 | Performance | Component loads within 3 seconds | Ready |
| TC-RC18 | AC10 | Visual | Component title typography (XL/LG/MD/SM) | Ready |
| TC-RC19 | AC10 | Visual | Card headline typography (XL/LG/MD/SM) | Ready |
| TC-RC20 | AC10 | Visual | Card layout responsive behavior | Ready |
| TC-RC21 | AC10 | Visual | Image/placeholder sizing | Ready |
| TC-RC22 | AC3 | Visual | Divider placement | Ready |

---

## AC Coverage Summary

| Acceptance Criteria | FE Relevant? | Test Coverage |
|--------------------|-------------|---------------|
| AC1 (CMS add/remove) | No - CMS only | Excluded |
| AC2 (CMS template filter) | No - CMS only | Excluded |
| AC3 (Full-width divider) | Yes - FE layout | TC-RC01, TC-RC22 |
| AC4 (Admin title default) | No - CMS only | Excluded |
| AC5 (Editor title override) | No - CMS only | Excluded |
| AC6 (Ranking logic) | No - Backend/Search | Excluded |
| AC7 (Self-exclusion) | Yes - FE output | TC-RC07 |
| AC8 (Min 2 cards) | Yes - FE count | TC-RC03 |
| AC9 (Max 4 cards) | Yes - FE count | TC-RC03 |
| AC10 (FE design match) | Yes - FE rendering | TC-RC01 to TC-RC22 |
| AC11 (No duplicates) | Yes - FE output | TC-RC08 |
| AC12 (Template filtering) | No - Backend/Search | Excluded |
| AC13 (No-index exclusion) | No - Backend/Search | Excluded |
| AC14 (Headline logic) | Yes - FE display | TC-RC04 |
| AC15 (Image logic) | Yes - FE display | TC-RC05 |

---

---

## Test Execution

```bash
# All tests
npx cross-env TEST_ENV=qa npx playwright test tests/specs/relatedContent.spec.ts --project=chromium

# Headed mode
npx cross-env TEST_ENV=qa npx playwright test tests/specs/relatedContent.spec.ts --headed --project=chromium

# Functional tests only
npx cross-env TEST_ENV=qa npx playwright test tests/specs/relatedContent.spec.ts -g "@Functional"

# Accessibility tests only
npx cross-env TEST_ENV=qa npx playwright test tests/specs/relatedContent.spec.ts -g "@Accessibility"
```

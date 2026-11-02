# Test Cases for TeaserGroupFullDetails Component

**Component**: TeaserGroupFullDetailsComponent
**User Story**: 1233
**Test Page (Carousel)**: https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint12/teasergroupfulldetails/carouselvariant
**Test Page (Grid)**: https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint12/teasergroupfulldetails/gridvariant
**Figma (Carousel)**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=8585-29681&m=dev
**Figma (Grid)**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=8585-29836&m=dev

---

## Traceability Matrix

| User Story | Test Case ID | Test Case Description | Status |
|------------|--------------|-----------------------|--------|
| 1233 | TC-TGFD-FUNC-001 | Verify component structure for Carousel variant | Ready |
| 1233 | TC-TGFD-FUNC-002 | Verify component structure for Grid variant | Ready |
| 1233 | TC-TGFD-FUNC-003 | Verify teaser card content and interactions (Carousel) | Ready |
| 1233 | TC-TGFD-FUNC-004 | Verify teaser card content and interactions (Grid) | Ready |
| 1233 | TC-TGFD-FUNC-005 | Verify carousel navigation controls | Ready |
| 1233 | TC-TGFD-VIS-001 | Verify visual styles for Carousel variant (XL viewport) | Ready |
| 1233 | TC-TGFD-VIS-002 | Verify visual styles for Grid variant (XL viewport) | Ready |
| 1233 | TC-TGFD-ACC-001 | Verify accessibility standards (WCAG 2.1 AA) for both variants | Ready |
| 1233 | TC-TGFD-PERF-001 | Verify component load performance for both variants | Ready |

---

## 1. Functional Test Cases

### TC-TGFD-FUNC-001: Verify component structure for Carousel variant
**Objective**: Ensure the main structural elements of the Carousel variant are rendered correctly.
**Steps**:
1. Navigate to the Carousel variant test page.
2. Verify the main component container with `data-qa="teaser-group-full-details"` is visible.
3. Verify the headline/title of the component is visible.
4. Verify the carousel container with `data-qa="carousel"` is visible.
5. Verify that the carousel contains a set of teaser cards.
6. Verify the 'previous' and 'next' navigation buttons are visible.

**Expected Result**: All main structural elements are present and visible on the page.

### TC-TGFD-FUNC-002: Verify component structure for Grid variant
**Objective**: Ensure the main structural elements of the Grid variant are rendered correctly.
**Steps**:
1. Navigate to the Grid variant test page.
2. Verify the main component container with `data-qa="teaser-group-full-details"` is visible.
3. Verify the headline/title of the component is visible.
4. Verify the grid container is visible.
5. Verify that the grid contains a set of teaser cards.

**Expected Result**: All main structural elements are present and visible on the page.

### TC-TGFD-FUNC-003: Verify teaser card content and interactions (Carousel)
**Objective**: Ensure each teaser card in the carousel displays the correct content and is interactive.
**Steps**:
1. Navigate to the Carousel variant test page.
2. For each visible teaser card:
    a. Verify an image is displayed.
    b. Verify a headline is displayed and is not empty.
    c. Verify a description/abstract text is displayed and is not empty.
    d. Verify a CTA link/button is present and has a valid `href` attribute.
3. Hover over a teaser card.
4. Click on the CTA of a teaser card.

**Expected Result**:
- All content elements (image, headline, description, CTA) are visible for each card.
- Hovering over a card may show a visual effect (to be confirmed by visual tests).
- Clicking the CTA should navigate to the correct URL.

### TC-TGFD-FUNC-004: Verify teaser card content and interactions (Grid)
**Objective**: Ensure each teaser card in the grid displays the correct content and is interactive.
**Steps**:
1. Navigate to the Grid variant test page.
2. For each teaser card in the grid:
    a. Verify an image is displayed.
    b. Verify a headline is displayed and is not empty.
    c. Verify a description/abstract text is displayed and is not empty.
    d. Verify a CTA link/button is present and has a valid `href` attribute.
3. Hover over a teaser card.
4. Click on the CTA of a teaser card.

**Expected Result**:
- All content elements (image, headline, description, CTA) are visible for each card.
- Hovering over a card may show a visual effect.
- Clicking the CTA should navigate to the correct URL.

### TC-TGFD-FUNC-005: Verify carousel navigation controls
**Objective**: Ensure the carousel's next and previous buttons function correctly.
**Steps**:
1. Navigate to the Carousel variant test page.
2. Click the 'next' button.
3. Verify the carousel slides to the next set of items.
4. Click the 'previous' button.
5. Verify the carousel slides back to the previous set of items.
6. Continue clicking 'next' until the end is reached.
7. Verify the 'next' button becomes disabled.
8. Continue clicking 'previous' until the beginning is reached.
9. Verify the 'previous' button becomes disabled.

**Expected Result**: The carousel navigation controls allow the user to slide between teaser cards, and the buttons disable appropriately at the start and end of the carousel.

---

## 2. Visual Test Cases

### TC-TGFD-VIS-001: Verify visual styles for Carousel variant (XL viewport)
**Objective**: Ensure the visual styling of the Carousel variant matches the Figma design for the XL viewport.
**Steps**:
1. Set viewport to XL (e.g., 1920x1080).
2. Navigate to the Carousel variant test page.
3. For the main title:
    a. Verify `font-family`, `font-size`, `font-weight`, `line-height`, and `color` match Figma specs.
4. For a teaser card:
    a. Verify the `font-family`, `font-size`, `font-weight`, `line-height`, and `color` for the headline match Figma specs.
    b. Verify the `font-family`, `font-size`, `font-weight`, `line-height`, and `color` for the description match Figma specs.
    c. Verify the `background-color` of the card matches Figma.
    d. Verify the spacing/padding within the card and between cards matches Figma.
5. Take a full-page screenshot and compare it against a baseline image.

**Expected Result**: All visual properties and the overall layout match the Figma design specifications for the XL viewport.

### TC-TGFD-VIS-002: Verify visual styles for Grid variant (XL viewport)
**Objective**: Ensure the visual styling of the Grid variant matches the Figma design for the XL viewport.
**Steps**:
1. Set viewport to XL (e.g., 1920x1080).
2. Navigate to the Grid variant test page.
3. For the main title:
    a. Verify `font-family`, `font-size`, `font-weight`, `line-height`, and `color` match Figma specs.
4. For a teaser card:
    a. Verify the `font-family`, `font-size`, `font-weight`, `line-height`, and `color` for the headline match Figma specs.
    b. Verify the `font-family`, `font-size`, `font-weight`, `line-height`, and `color` for the description match Figma specs.
    c. Verify the `background-color` of the card matches Figma.
    d. Verify the spacing/padding within the card and the gap between grid items match Figma.
5. Take a full-page screenshot and compare it against a baseline image.

**Expected Result**: All visual properties and the overall layout match the Figma design specifications for the XL viewport.

*(Note: Similar visual tests should be created for LG, MD, and SM viewports for complete coverage.)*

---

## 3. Accessibility Test Cases

### TC-TGFD-ACC-001: Verify accessibility standards (WCAG 2.1 AA) for both variants
**Objective**: Ensure the component is accessible to users with disabilities.
**Steps**:
1. Navigate to the Carousel variant test page.
2. Run the `axe-core` accessibility scanner on the page.
3. Verify there are no critical or serious accessibility violations.
4. Verify all images have `alt` text.
5. Verify all interactive elements (links, buttons) are focusable via keyboard (Tab key).
6. Verify the carousel can be navigated using keyboard controls (e.g., arrow keys or Tab to buttons).
7. Verify proper ARIA attributes are used for the carousel (`role="region"`, `aria-label`, etc.).
8. Repeat steps 1-7 for the Grid variant test page.

**Expected Result**: The component meets WCAG 2.1 AA standards with no critical violations. All interactive elements are keyboard accessible, and proper ARIA roles and attributes are in place.

---

## 4. Performance Test Cases

### TC-TGFD-PERF-001: Verify component load performance for both variants
**Objective**: Ensure the component loads efficiently without impacting page performance.
**Steps**:
1. Navigate to the Carousel variant test page with performance tracing enabled.
2. Capture key performance metrics (e.g., Largest Contentful Paint (LCP), Time to Interactive (TTI)).
3. Verify the metrics are within acceptable thresholds.
4. Repeat steps 1-3 for the Grid variant test page.

**Expected Result**: The component loads quickly, with LCP and TTI meeting the project's performance budget.

# Test Cases - Key Figures Group Component

**Component**: Key Figures Group
**User Story**: #2058
**Test Page**: https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint12/keyfiguregroup
**Created**: February 25, 2026
**Status**: Ready for Implementation

---

## Test Case Summary

| Category | Count | Test IDs |
|----------|-------|----------|
| Functional | 12 | TC-KFG01 - TC-KFG12 |
| Visual | 16 | TC-KFG13 - TC-KFG28 |
| Accessibility | 10 | TC-KFG29 - TC-KFG38 |
| Performance | 2 | TC-KFG39 - TC-KFG40 |
| **Total** | **40** | |

---

## 🧪 Functional Test Cases

### TC-KFG01: Key Figures Group component renders on page mount @Functional
**Priority**: High  
**Objective**: Verify that the Key Figures Group component renders correctly when the page loads

**Prerequisites**:
- Navigate to test page with authentication

**Test Steps**:
1. Navigate to the Key Figures Group test page
2. Wait for page to fully load
3. Verify Key Figures Group container is present
4. Verify Key Figures Group container is visible

**Expected Results**:
- Component container with `data-qa="key-figures-group"` exists
- Component container is visible on the page
- Component is rendered without errors

**Data-qa Attributes Used**:
- `data-qa="key-figures-group"`
- `data-testid="key-figures-group"`

---

### TC-KFG02: Key Figures Group contains exactly 3 individual key figures @Functional
**Priority**: High  
**Objective**: Verify that the component displays the correct number of individual key figure items (per AC2: 2-3 items, actual implementation: 3)

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Locate the Key Figures Group container
2. Find all individual key figure elements within the group
3. Count the number of individual key figures

**Expected Results**:
- Total count of individual key figures equals 3
- Each individual key figure has `data-qa="individual-key-figure"`
- Each wrapper has sequential `data-testid="key-figure-wrapper-{0|1|2}"`

**Data-qa Attributes Used**:
- `data-qa="key-figures-group"`
- `data-qa="individual-key-figure"`
- `data-testid="key-figure-wrapper-0"`, `"key-figure-wrapper-1"`, `"key-figure-wrapper-2"`

---

### TC-KFG03: All individual key figures are visible @Functional
**Priority**: High  
**Objective**: Verify that all 3 individual key figure items are visible on the page

**Prerequisites**:
- TC-KFG02 passed

**Test Steps**:
1. Get all individual key figure elements
2. For each individual key figure:
   - Verify element is visible
   - Verify element is in viewport

**Expected Results**:
- All 3 individual key figures are visible
- No hidden or collapsed key figures

**Data-qa Attributes Used**:
- `data-qa="individual-key-figure"`

---

### TC-KFG04: Key Figures Group is placed in full-width column @Functional
**Priority**: High  
**Objective**: Verify component placement in 100% content divider (per AC3)

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Locate the Key Figures Group container
2. Get the parent container of Key Figures Group
3. Verify parent container has full-width column attributes

**Expected Results**:
- Parent container has `data-qa="fullwidth-column"`
- Parent container has `aria-label="Full width content section"`
- Component is properly nested within full-width divider

**Data-qa Attributes Used**:
- `data-qa="key-figures-group"`
- `data-qa="fullwidth-column"`
- `data-testid="fullwidth-column"`

---

### TC-KFG05: Each key figure displays numeric value element @Functional
**Priority**: High  
**Objective**: Verify that each individual key figure contains a numeric value element (structural validation only)

**Prerequisites**:
- TC-KFG03 passed

**Test Steps**:
1. For each individual key figure (3 total):
   - Locate numeric value element within the key figure
   - Verify element exists
   - Verify element is not empty
   - Verify element is visible

**Expected Results**:
- Each key figure has a numeric value element
- Numeric element contains content (not empty)
- No validation of specific number content (language-agnostic)

**Notes**:
- ⚠️ Do NOT validate specific numeric values (e.g., "500", "95", "12")
- Only verify structural presence and non-empty state

---

### TC-KFG06: Each key figure displays unit/suffix element @Functional
**Priority**: High  
**Objective**: Verify that each individual key figure contains a unit/suffix element (structural validation only)

**Prerequisites**:
- TC-KFG03 passed

**Test Steps**:
1. For each individual key figure (3 total):
   - Locate unit/suffix element within the key figure
   - Verify element exists
   - Verify element is not empty
   - Verify element is visible

**Expected Results**:
- Each key figure has a unit/suffix element
- Unit/suffix element contains content (not empty)
- No validation of specific unit text (language-agnostic)

**Notes**:
- ⚠️ Do NOT validate specific content (e.g., "%", "Mio.", "k+")
- Content may vary across implementations
- Only verify structural presence and non-empty state

---

### TC-KFG07: Each key figure displays description element @Functional
**Priority**: High  
**Objective**: Verify that each individual key figure contains a description text element (structural validation only)

**Prerequisites**:
- TC-KFG03 passed

**Test Steps**:
1. For each individual key figure (3 total):
   - Locate description element within the key figure
   - Verify element exists
   - Verify element is not empty
   - Verify element is visible

**Expected Results**:
- Each key figure has a description element
- Description element contains content (not empty)
- No validation of specific description text (language-agnostic)

**Notes**:
- ⚠️ Do NOT validate specific description content
- Only verify structural presence and non-empty state

---

### TC-KFG08: Component structure maintains proper nesting hierarchy @Functional
**Priority**: Medium  
**Objective**: Verify correct DOM hierarchy and nesting structure

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Verify fullwidth-column contains key-figures-group
2. Verify key-figures-group contains 3 wrapper divs
3. Verify each wrapper contains one individual-key-figure
4. Verify proper parent-child relationships

**Expected Results**:
- DOM hierarchy matches specification:
  ```
  fullwidth-column
    └─ key-figures-group
         ├─ key-figure-wrapper-0
         │    └─ individual-key-figure
         ├─ key-figure-wrapper-1
         │    └─ individual-key-figure
         └─ key-figure-wrapper-2
              └─ individual-key-figure
  ```

**Data-qa Attributes Used**:
- All component data-qa attributes

---

### TC-KFG09: Component maintains structure on window resize (XL to MD) @Functional
**Priority**: Medium  
**Objective**: Verify component integrity during viewport changes

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Set viewport to XL (1440×900)
2. Wait for component to render
3. Verify component is visible
4. Resize viewport to MD (768×1024)
5. Wait for responsive adjustments
6. Verify component is still visible
7. Verify all 3 individual key figures still present

**Expected Results**:
- Component remains visible after resize
- All 3 individual key figures maintained
- No elements lost during viewport change
- Responsive behavior works correctly

---

### TC-KFG10: Component renders correctly at XL viewport @Functional
**Priority**: High  
**Objective**: Verify component rendering at XL breakpoint (1440×900)

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Set viewport to XL (1440×900)
2. Wait for page load
3. Verify component is visible
4. Verify all 3 key figures are visible
5. Verify layout is horizontal/grid as per design

**Expected Results**:
- Component renders correctly at XL viewport
- All elements visible and properly laid out

---

### TC-KFG11: Component renders correctly at LG viewport @Functional
**Priority**: High  
**Objective**: Verify component rendering at LG breakpoint (1024×800)

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Set viewport to LG (1024×800)
2. Wait for page load
3. Verify component is visible
4. Verify all 3 key figures are visible
5. Verify layout adjusts appropriately

**Expected Results**:
- Component renders correctly at LG viewport
- All elements visible and properly laid out

---

### TC-KFG12: Component renders correctly at MD and SM viewports @Functional
**Priority**: High  
**Objective**: Verify component rendering at smaller breakpoints (MD: 768×1024, SM: 375×667)

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Set viewport to MD (768×1024)
2. Verify component is visible
3. Verify all 3 key figures are visible
4. Set viewport to SM (375×667)
5. Verify component is visible
6. Verify all 3 key figures are visible (may stack vertically)

**Expected Results**:
- Component renders correctly at both MD and SM viewports
- All elements visible at smaller screen sizes
- Layout adapts responsively (likely stacked/vertical)

---

## 🎨 Visual Test Cases (Figma Validation)

**Figma Reference**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=6227-65662&t=ctrZMvEmOzsbY7dt-1

### TC-KFG13: Visual validation - XL viewport typography @Visual
**Priority**: High  
**Objective**: Verify typography matches Figma design at XL breakpoint

**Prerequisites**:
- TC-KFG10 passed
- Figma values extracted for XL (node-id=6227-65727)

**Test Steps**:
1. Set viewport to XL (1440×900)
2. Extract computed styles from key figure numeric value
3. Compare with Figma values:
   - Font family
   - Font size (expected: 7xl)
   - Line height
   - Font weight
   - Color

**Expected Results**:
- Font family matches Figma
- Font size matches Figma (7xl for large numbers)
- Line height matches Figma
- Text color matches Figma
- Unit/description typography also validated

**Figma Node**: 6227-65727

---

### TC-KFG14: Visual validation - XL viewport spacing and layout @Visual
**Priority**: High  
**Objective**: Verify spacing and layout match Figma design at XL

**Prerequisites**:
- TC-KFG10 passed

**Test Steps**:
1. Set viewport to XL (1440×900)
2. Measure spacing between key figures
3. Verify alignment of elements
4. Compare with Figma specifications

**Expected Results**:
- Spacing between key figures matches Figma
- Padding/margins match Figma
- Grid/flex layout matches design

**Figma Node**: 6227-65727

---

### TC-KFG15: Visual validation - XL viewport colors @Visual
**Priority**: High  
**Objective**: Verify colors match Figma design at XL

**Prerequisites**:
- TC-KFG10 passed

**Test Steps**:
1. Set viewport to XL (1440×900)
2. Extract colors:
   - Numeric value text color
   - Unit text color
   - Description text color
   - Background color (if any)
3. Compare with Figma color tokens

**Expected Results**:
- All text colors match Figma specifications
- Background colors (if any) match Figma

**Figma Node**: 6227-65727

---

### TC-KFG16: Visual validation - XL viewport complete screenshot comparison @Visual
**Priority**: High  
**Objective**: Full visual regression test at XL viewport

**Prerequisites**:
- TC-KFG10 passed

**Test Steps**:
1. Set viewport to XL (1440×900)
2. Take screenshot of component
3. Compare with Figma design/baseline

**Expected Results**:
- Visual match with Figma design
- No visual regressions

**Figma Node**: 6227-65727

---

### TC-KFG17: Visual validation - LG viewport typography @Visual
**Priority**: High  
**Objective**: Verify typography matches Figma design at LG breakpoint

**Prerequisites**:
- TC-KFG11 passed
- Figma values extracted for LG (node-id=6227-65708)

**Test Steps**:
1. Set viewport to LG (1024×800)
2. Extract computed styles from key figure numeric value
3. Compare with Figma values:
   - Font family
   - Font size (expected: 7xl)
   - Line height
   - Font weight
   - Color

**Expected Results**:
- Typography matches Figma LG specifications

**Figma Node**: 6227-65708

---

### TC-KFG18: Visual validation - LG viewport spacing and layout @Visual
**Priority**: High  
**Objective**: Verify spacing and layout match Figma design at LG

**Prerequisites**:
- TC-KFG11 passed

**Test Steps**:
1. Set viewport to LG (1024×800)
2. Measure spacing between key figures
3. Verify layout adjustments from XL
4. Compare with Figma specifications

**Expected Results**:
- Spacing matches Figma LG design
- Layout adapts correctly

**Figma Node**: 6227-65708

---

### TC-KFG19: Visual validation - LG viewport colors @Visual
**Priority**: High  
**Objective**: Verify colors match Figma design at LG

**Prerequisites**:
- TC-KFG11 passed

**Test Steps**:
1. Set viewport to LG (1024×800)
2. Extract and compare colors with Figma

**Expected Results**:
- All colors match Figma LG specifications

**Figma Node**: 6227-65708

---

### TC-KFG20: Visual validation - LG viewport complete screenshot comparison @Visual
**Priority**: High  
**Objective**: Full visual regression test at LG viewport

**Prerequisites**:
- TC-KFG11 passed

**Test Steps**:
1. Set viewport to LG (1024×800)
2. Take screenshot of component
3. Compare with Figma design/baseline

**Expected Results**:
- Visual match with Figma LG design

**Figma Node**: 6227-65708

---

### TC-KFG21: Visual validation - MD viewport typography @Visual
**Priority**: High  
**Objective**: Verify typography matches Figma design at MD breakpoint

**Prerequisites**:
- TC-KFG12 passed
- Figma values extracted for MD (node-id=6227-65687)

**Test Steps**:
1. Set viewport to MD (768×1024)
2. Extract computed styles from key figure numeric value
3. Compare with Figma values:
   - Font family
   - Font size (expected: 5xl or similar)
   - Line height
   - Font weight
   - Color

**Expected Results**:
- Typography matches Figma MD specifications
- Font sizes may be smaller than XL/LG

**Figma Node**: 6227-65687

---

### TC-KFG22: Visual validation - MD viewport spacing and layout @Visual
**Priority**: High  
**Objective**: Verify spacing and layout match Figma design at MD

**Prerequisites**:
- TC-KFG12 passed

**Test Steps**:
1. Set viewport to MD (768×1024)
2. Measure spacing between key figures
3. Verify layout changes (may stack vertically)
4. Compare with Figma specifications

**Expected Results**:
- Spacing matches Figma MD design
- Layout adapts correctly (stacked if designed)

**Figma Node**: 6227-65687

---

### TC-KFG23: Visual validation - MD viewport colors @Visual
**Priority**: High  
**Objective**: Verify colors match Figma design at MD

**Prerequisites**:
- TC-KFG12 passed

**Test Steps**:
1. Set viewport to MD (768×1024)
2. Extract and compare colors with Figma

**Expected Results**:
- All colors match Figma MD specifications

**Figma Node**: 6227-65687

---

### TC-KFG24: Visual validation - MD viewport complete screenshot comparison @Visual
**Priority**: High  
**Objective**: Full visual regression test at MD viewport

**Prerequisites**:
- TC-KFG12 passed

**Test Steps**:
1. Set viewport to MD (768×1024)
2. Take screenshot of component
3. Compare with Figma design/baseline

**Expected Results**:
- Visual match with Figma MD design

**Figma Node**: 6227-65687

---

### TC-KFG25: Visual validation - SM viewport typography @Visual
**Priority**: High  
**Objective**: Verify typography matches Figma design at SM breakpoint

**Prerequisites**:
- TC-KFG12 passed
- Figma values extracted for SM (node-id=6227-65664)

**Test Steps**:
1. Set viewport to SM (375×667)
2. Extract computed styles from key figure numeric value
3. Compare with Figma values:
   - Font family
   - Font size (expected: 5xl)
   - Line height
   - Font weight
   - Color

**Expected Results**:
- Typography matches Figma SM specifications
- Smaller font sizes appropriate for mobile

**Figma Node**: 6227-65664

---

### TC-KFG26: Visual validation - SM viewport spacing and layout @Visual
**Priority**: High  
**Objective**: Verify spacing and layout match Figma design at SM

**Prerequisites**:
- TC-KFG12 passed

**Test Steps**:
1. Set viewport to SM (375×667)
2. Measure spacing between key figures
3. Verify vertical stacking layout
4. Compare with Figma specifications

**Expected Results**:
- Spacing matches Figma SM design
- Key figures stack vertically for mobile

**Figma Node**: 6227-65664

---

### TC-KFG27: Visual validation - SM viewport colors @Visual
**Priority**: High  
**Objective**: Verify colors match Figma design at SM

**Prerequisites**:
- TC-KFG12 passed

**Test Steps**:
1. Set viewport to SM (375×667)
2. Extract and compare colors with Figma

**Expected Results**:
- All colors match Figma SM specifications

**Figma Node**: 6227-65664

---

### TC-KFG28: Visual validation - SM viewport complete screenshot comparison @Visual
**Priority**: High  
**Objective**: Full visual regression test at SM viewport

**Prerequisites**:
- TC-KFG12 passed

**Test Steps**:
1. Set viewport to SM (375×667)
2. Take screenshot of component
3. Compare with Figma design/baseline

**Expected Results**:
- Visual match with Figma SM design

**Figma Node**: 6227-65664

---

## ♿ Accessibility Test Cases (WCAG 2.1 AA)

### TC-AKFG29: Semantic HTML structure validation @Accessibility
**Priority**: High  
**Objective**: Verify component uses proper semantic HTML elements

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Inspect component DOM structure
2. Verify use of semantic HTML elements:
   - `<section>` for Key Figures Group container
   - Proper heading tags if any (h1, h2, etc.)
   - Proper use of `<div>` for wrappers only
3. Verify no misuse of semantic elements

**Expected Results**:
- Component uses `<section>` element appropriately
- No `<div>` tags where semantic elements should be used
- Proper HTML5 semantic structure

**WCAG Criteria**: 1.3.1 Info and Relationships (Level A)

---

### TC-AKFG30: ARIA attributes validation @Accessibility
**Priority**: High  
**Objective**: Verify proper ARIA attributes are present and correct

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Verify Key Figures Group has appropriate ARIA attributes
2. Verify individual key figures have `aria-label="Individual Key Figure"`
3. Verify fullwidth-column has `aria-label="Full width content section"`
4. Verify no conflicting or incorrect ARIA attributes

**Expected Results**:
- All ARIA labels are present and descriptive
- ARIA attributes enhance accessibility
- No ARIA misuse

**WCAG Criteria**: 4.1.2 Name, Role, Value (Level A)

**Data-qa Attributes Used**:
- `aria-label` attributes on all components

---

### TC-AKFG31: Color contrast compliance @Accessibility
**Priority**: High  
**Objective**: Verify text meets WCAG 2.1 AA color contrast requirements (4.5:1 for normal text, 3:1 for large text)

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Measure color contrast ratios:
   - Numeric value text vs background
   - Unit text vs background
   - Description text vs background
2. Compare against WCAG thresholds:
   - Large text (14pt bold / 18pt regular): minimum 3:1
   - Normal text: minimum 4.5:1

**Expected Results**:
- All text elements meet or exceed minimum contrast ratios
- Large numeric values: ≥ 3:1 contrast ratio
- Regular text (descriptions): ≥ 4.5:1 contrast ratio

**WCAG Criteria**: 1.4.3 Contrast (Minimum) (Level AA)

---

### TC-AKFG32: Keyboard navigation support @Accessibility
**Priority**: High  
**Objective**: Verify component is accessible via keyboard navigation

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Use Tab key to navigate through page
2. Verify component elements receive focus if interactive
3. Verify focus indicators are visible
4. Verify logical focus order

**Expected Results**:
- All interactive elements are keyboard accessible
- Focus indicators clearly visible
- Tab order is logical
- No keyboard traps

**WCAG Criteria**: 2.1.1 Keyboard (Level A), 2.4.7 Focus Visible (Level AA)

**Notes**:
- If component has no interactive elements, verify it doesn't trap focus

---

### TC-AKFG33: Screen reader compatibility @Accessibility
**Priority**: High  
**Objective**: Verify component is properly announced by screen readers

**Prerequisites**:
- TC-KFG01 passed
- Screen reader tool available (NVDA/JAWS)

**Test Steps**:
1. Enable screen reader
2. Navigate to Key Figures Group component
3. Verify announcements:
   - Component container is announced
   - Individual key figures are announced
   - Numeric values are read correctly
   - Descriptions are read properly
4. Verify proper reading order

**Expected Results**:
- All content is accessible to screen readers
- Announcements are clear and meaningful
- Reading order is logical
- No hidden or inaccessible content

**WCAG Criteria**: 1.3.1 Info and Relationships (Level A), 4.1.2 Name, Role, Value (Level A)

---

### TC-AKFG34: Axe-core automated accessibility scan @Accessibility
**Priority**: High  
**Objective**: Run automated accessibility checks using axe-core

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Load page with Key Figures Group component
2. Run axe-core accessibility scan
3. Review violations, if any
4. Verify no critical/serious violations

**Expected Results**:
- Zero critical accessibility violations
- Zero serious accessibility violations
- Any minor/moderate violations documented
- Component passes automated WCAG 2.1 AA checks

**WCAG Criteria**: All automated checks

**Tool**: Playwright AxeBuilder integration

---

### TC-AKFG35: Focus management validation @Accessibility
**Priority**: Medium  
**Objective**: Verify proper focus management throughout component

**Prerequisites**:
- TC-KFG32 passed

**Test Steps**:
1. Navigate to component with keyboard
2. Verify focus stays within expected boundaries
3. Verify focus indicators meet contrast requirements
4. Verify no focus loss

**Expected Results**:
- Focus is properly managed
- Focus indicators have ≥ 3:1 contrast
- No unexpected focus behavior

**WCAG Criteria**: 2.4.7 Focus Visible (Level AA), 1.4.11 Non-text Contrast (Level AA)

---

### TC-AKFG36: Text spacing and reflow @Accessibility
**Priority**: Medium  
**Objective**: Verify component supports text spacing adjustments and reflows properly

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Apply text spacing overrides:
   - Line height: 1.5× font size
   - Paragraph spacing: 2× font size
   - Letter spacing: 0.12× font size
   - Word spacing: 0.16× font size
2. Verify component remains usable
3. Verify no content overlap
4. Verify no loss of functionality

**Expected Results**:
- Component adapts to text spacing changes
- All content remains readable
- No text truncation or overlap
- Functionality preserved

**WCAG Criteria**: 1.4.12 Text Spacing (Level AA)

---

### TC-AKFG37: Zoom and reflow at 200% @Accessibility
**Priority**: Medium  
**Objective**: Verify component works correctly at 200% zoom level

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Set browser zoom to 200%
2. Verify component is visible
3. Verify no horizontal scrolling required
4. Verify all content accessible
5. Verify layout adapts appropriately

**Expected Results**:
- Component usable at 200% zoom
- No horizontal scrolling on viewport width 1280px
- All content accessible
- Layout reflows appropriately

**WCAG Criteria**: 1.4.10 Reflow (Level AA)

---

### TC-AKFG38: Meaningful page title and landmarks @Accessibility
**Priority**: Low  
**Objective**: Verify page has meaningful title and component uses appropriate landmarks

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. Verify page has descriptive `<title>` tag
2. Verify component is within appropriate landmark region
3. Verify landmark structure is logical

**Expected Results**:
- Page title is descriptive
- Component is within appropriate landmark (main, section, etc.)
- Landmark structure aids navigation

**WCAG Criteria**: 2.4.2 Page Titled (Level A)

---

## ⚡ Performance Test Cases

### TC-KFG39: Component initial load performance @Performance
**Priority**: High  
**Objective**: Verify component loads within acceptable time limits

**Prerequisites**:
- Navigate to test page

**Test Steps**:
1. Navigate to test page with performance monitoring enabled
2. Measure time from navigation start to component visible
3. Record performance metrics:
   - DOM content loaded time
   - Component render time
   - Time to interactive

**Expected Results**:
- Component visible within 3 seconds of page load
- DOM content loaded < 2 seconds
- Time to interactive < 5 seconds
- No performance bottlenecks

**Performance Threshold**:
- Component render: < 3000ms
- Time to interactive: < 5000ms

---

### TC-KFG40: Component render performance across viewports @Performance
**Priority**: Medium  
**Objective**: Verify component renders efficiently across all viewport sizes

**Prerequisites**:
- TC-KFG01 passed

**Test Steps**:
1. For each viewport (XL, LG, MD, SM):
   - Clear cache
   - Navigate to page
   - Measure component render time
   - Verify performance is consistent
2. Compare render times across viewports

**Expected Results**:
- Render time consistent across viewports (< 3 seconds)
- No significant performance degradation on smaller viewports
- Responsive transitions smooth (< 500ms)

**Performance Threshold**:
- Render time per viewport: < 3000ms
- Viewport resize performance: < 500ms

---

## 📊 Traceability Matrix

| Test ID | Category | Acceptance Criteria | Priority |
|---------|----------|---------------------|----------|
| TC-KFG01 - TC-KFG12 | Functional | AC3 (100% divider) | High |
| TC-KFG13 - TC-KFG28 | Visual | Design specs | High |
| TC-AKFG29 - TC-AKFG38 | Accessibility | WCAG 2.1 AA | High |
| TC-KFG39 - TC-KFG40 | Performance | Performance standards | Medium |

---

## 📝 Notes

### Language-Agnostic Testing Approach:
- ⚠️ **DO NOT** validate specific text content (numbers, units, descriptions)
- ✅ **DO** validate structural presence and non-empty state
- ✅ **DO** validate proper HTML semantics and attributes
- ✅ **DO** validate visual design (typography, colors, spacing)

### SmartLocator Requirements:
- All test implementations MUST use SmartLocator methods
- Minimum 3-4 fallback strategies per element
- Child elements MUST use `findSmart()`, NOT `container.locator()`

### Test Execution Order:
1. Functional tests first (establish baseline)
2. Visual tests (verify design implementation)
3. Accessibility tests (ensure WCAG compliance)
4. Performance tests (verify efficiency)

---

**Total Test Cases**: 40  
**Estimated Execution Time**: ~45-60 minutes (full suite)  
**Next Step**: Implement test automation scripts using Playwright + SmartLocator

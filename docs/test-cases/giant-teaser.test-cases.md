# Giant Teaser Component - Test Cases

## Component Information
- **Component Name**: Giant Teaser
- **Test Page URL**: https://bayer-beyond-qa-uk.vercel.app
- **Figma URL**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=12-24067
- **Last Updated**: December 3, 2025
- **Test Status**: Ready for Implementation

## Requirements Summary

The Giant Teaser appears in the right-hand pane of both Navigation and Language Selection Overlays. It is only visible on XL and LG breakpoints (larger viewports). The Navigation Overlay also includes a "Contact Us" link.

### Acceptance Criteria
- **AC3**: The specified Teaser content for a given site is shown as per the designs in the Navigation Overlay
- **AC4**: The specified Teaser content for a given site is shown as per the designs in the Language Selection Overlay
- **AC5**: The Contact Us link is shown as per the designs, with the specified label text and target, in the Navigation Overlay

## Traceability Matrix

| Test Case ID | AC | Test Type | Status |
|--------------|-----|-----------|--------|
| TC-GT1 | AC3 | Functional | Ready |
| TC-GT2 | AC3 | Functional | Ready |
| TC-GT3 | AC3 | Functional | Ready |
| TC-GT4 | AC3 | Functional | Ready |
| TC-GT5 | AC3 | Functional | Ready |
| TC-GT6 | AC4 | Functional | Ready |
| TC-GT7 | AC4 | Functional | Ready |
| TC-GT8 | AC4 | Functional | Ready |
| TC-GT9 | AC5 | Functional | Ready |
| TC-GT10 | AC5 | Functional | Ready |
| TC-GT11 | AC3, AC4 | Functional | Ready |
| TC-GT12 | AC3, AC4 | Functional | Ready |
| TC-GT13 | AC3, AC4 | Functional | Ready |
| TC-GT14 | AC3, AC4 | Functional | Ready |
| TC-AGT1 | AC3 | Accessibility | Ready |
| TC-AGT2 | AC3 | Accessibility | Ready |
| TC-AGT3 | AC4 | Accessibility | Ready |
| TC-AGT4 | AC5 | Accessibility | Ready |
| TC-VGT1 | AC3 | Visual | Ready |
| TC-VGT2 | AC3 | Visual | Ready |
| TC-VGT3 | AC4 | Visual | Ready |
| TC-VGT4 | AC5 | Visual | Ready |
| TC-PGT1 | AC3, AC4 | Performance | Ready |

---

## Functional Test Cases

### TC-GT1: Verify Giant Teaser displays in Navigation Overlay on XL viewport
**AC**: AC3  
**Priority**: High  
**Tags**: @Functional @Responsive

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL

**Test Steps**:
1. Open Navigation Overlay by clicking menu button
2. Verify Giant Teaser container is visible
3. Verify Giant Teaser is positioned in right-hand pane

**Expected Results**:
- Giant Teaser container with data-qa="individual-teaser" is visible
- Giant Teaser is displayed in the correct position (right pane)

---

### TC-GT2: Verify Giant Teaser displays in Navigation Overlay on LG viewport
**AC**: AC3  
**Priority**: High  
**Tags**: @Functional @Responsive

**Preconditions**:
- Browser is set to LG viewport (1024x768)
- Navigate to test page URL

**Test Steps**:
1. Open Navigation Overlay by clicking menu button
2. Verify Giant Teaser container is visible
3. Verify Giant Teaser is positioned in right-hand pane

**Expected Results**:
- Giant Teaser container is visible on LG viewport
- Layout and positioning match design specifications

---

### TC-GT3: Verify Giant Teaser is hidden in Navigation Overlay on MD viewport
**AC**: AC3  
**Priority**: High  
**Tags**: @Functional @Responsive

**Preconditions**:
- Browser is set to MD viewport (768x1024)
- Navigate to test page URL

**Test Steps**:
1. Open Navigation Overlay by clicking menu button
2. Verify Giant Teaser container is not visible

**Expected Results**:
- Giant Teaser is hidden/not displayed on MD viewport
- Navigation menu displays correctly without Giant Teaser

---

### TC-GT4: Verify Giant Teaser is hidden in Navigation Overlay on SM viewport
**AC**: AC3  
**Priority**: High  
**Tags**: @Functional @Responsive

**Preconditions**:
- Browser is set to SM viewport (375x667)
- Navigate to test page URL

**Test Steps**:
1. Open Navigation Overlay by clicking menu button
2. Verify Giant Teaser container is not visible

**Expected Results**:
- Giant Teaser is hidden/not displayed on SM viewport
- Mobile navigation displays correctly without Giant Teaser

---

### TC-GT5: Verify Giant Teaser content elements in Navigation Overlay
**AC**: AC3  
**Priority**: High  
**Tags**: @Functional

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL

**Test Steps**:
1. Open Navigation Overlay
2. Verify Giant Teaser title is present and visible
3. Verify Giant Teaser description is present and visible
4. Verify Giant Teaser image/background is displayed
5. Verify Giant Teaser CTA link is present and visible

**Expected Results**:
- All Giant Teaser content elements are visible
- Title element is not empty
- Description element is not empty
- CTA link is clickable

---

### TC-GT6: Verify Giant Teaser displays in Language Selection Overlay on XL viewport
**AC**: AC4  
**Priority**: High  
**Tags**: @Functional @Responsive

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL

**Test Steps**:
1. Open Language Selection Overlay by clicking language selector button
2. Verify Giant Teaser container is visible
3. Verify Giant Teaser is positioned in right-hand pane

**Expected Results**:
- Giant Teaser container is visible in Language Selection Overlay
- Positioning matches design specifications

---

### TC-GT7: Verify Giant Teaser displays in Language Selection Overlay on LG viewport
**AC**: AC4  
**Priority**: High  
**Tags**: @Functional @Responsive

**Preconditions**:
- Browser is set to LG viewport (1024x768)
- Navigate to test page URL

**Test Steps**:
1. Open Language Selection Overlay by clicking language selector button
2. Verify Giant Teaser container is visible
3. Verify Giant Teaser is positioned in right-hand pane

**Expected Results**:
- Giant Teaser is visible on LG viewport
- Layout matches Navigation Overlay Giant Teaser

---

### TC-GT8: Verify Giant Teaser is hidden in Language Selection Overlay on MD and SM viewports
**AC**: AC4  
**Priority**: High  
**Tags**: @Functional @Responsive

**Preconditions**:
- Browser is set to MD (768x1024) or SM (375x667) viewport
- Navigate to test page URL

**Test Steps**:
1. Open Language Selection Overlay by clicking language selector button
2. Verify Giant Teaser container is not visible

**Expected Results**:
- Giant Teaser is hidden on MD and SM viewports
- Language selection list displays correctly

---

### TC-GT9: Verify Contact Us link in Navigation Overlay
**AC**: AC5  
**Priority**: High  
**Tags**: @Functional

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL

**Test Steps**:
1. Open Navigation Overlay by clicking menu button
2. Verify Contact Us link is visible
3. Verify Contact Us link label text is correct
4. Verify Contact Us link has href attribute

**Expected Results**:
- Contact Us link is visible with data-qa="Link"
- Link has proper label text
- Link has valid href target

---

### TC-GT10: Verify Contact Us link navigation functionality
**AC**: AC5  
**Priority**: High  
**Tags**: @Functional

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL
- Navigation Overlay is open

**Test Steps**:
1. Click on Contact Us link
2. Verify navigation occurs to the correct target URL

**Expected Results**:
- Clicking Contact Us link navigates to specified target
- Navigation completes successfully

---

### TC-GT11: Verify Giant Teaser content consistency between overlays
**AC**: AC3, AC4  
**Priority**: High  
**Tags**: @Functional

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL

**Test Steps**:
1. Open Navigation Overlay and capture Giant Teaser title text
2. Close Navigation Overlay
3. Open Language Selection Overlay and capture Giant Teaser title text
4. Compare title text from both overlays
5. Repeat for description and CTA elements

**Expected Results**:
- Giant Teaser content is identical in both overlays
- Title, description, and CTA match exactly

---

### TC-GT12: Verify Navigation Overlay opens and closes correctly
**AC**: AC3  
**Priority**: Medium  
**Tags**: @Functional

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL

**Test Steps**:
1. Click menu button to open Navigation Overlay
2. Verify overlay opens with smooth transition
3. Verify Giant Teaser loads and displays
4. Click close button to close overlay
5. Verify overlay closes properly

**Expected Results**:
- Navigation Overlay opens successfully
- Giant Teaser is visible when overlay is open
- Overlay closes completely when close button clicked

---

### TC-GT13: Verify Language Selection Overlay opens and closes correctly
**AC**: AC4  
**Priority**: Medium  
**Tags**: @Functional

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL

**Test Steps**:
1. Click language selector button to open Language Selection Overlay
2. Verify overlay opens with transition
3. Verify Giant Teaser loads and displays
4. Click close button to close overlay
5. Verify overlay closes properly

**Expected Results**:
- Language Selection Overlay opens successfully
- Giant Teaser is visible when overlay is open
- Overlay closes when close button clicked

---

### TC-GT14: Verify Giant Teaser CTA link functionality
**AC**: AC3, AC4  
**Priority**: High  
**Tags**: @Functional

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL

**Test Steps**:
1. Open Navigation Overlay
2. Click Giant Teaser CTA link
3. Verify navigation to target URL occurs
4. Return to test page
5. Open Language Selection Overlay
6. Click Giant Teaser CTA link
7. Verify same navigation behavior

**Expected Results**:
- CTA link is clickable in both overlays
- Navigation to target URL works correctly
- Link behavior is consistent

---

## Accessibility Test Cases

### TC-AGT1: Verify keyboard navigation for Navigation Overlay and Giant Teaser
**AC**: AC3  
**Priority**: High  
**Tags**: @Accessibility

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL
- Use keyboard only (no mouse)

**Test Steps**:
1. Tab to menu button and press Enter to open Navigation Overlay
2. Verify focus moves into overlay
3. Tab through overlay elements including Giant Teaser
4. Verify Giant Teaser CTA link is reachable via keyboard
5. Press Escape key to close overlay
6. Verify focus returns appropriately

**Expected Results**:
- Navigation Overlay can be opened via keyboard
- All interactive elements are keyboard accessible
- Giant Teaser CTA is reachable via Tab key
- Escape key closes overlay
- Focus management is logical

---

### TC-AGT2: Verify screen reader compatibility for Giant Teaser in Navigation Overlay
**AC**: AC3  
**Priority**: High  
**Tags**: @Accessibility

**Preconditions**:
- Screen reader is enabled (NVDA/JAWS)
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL

**Test Steps**:
1. Open Navigation Overlay
2. Verify Giant Teaser container has proper aria-label
3. Verify Giant Teaser elements are announced correctly
4. Verify CTA link has descriptive text
5. Verify Contact Us link is announced properly

**Expected Results**:
- Giant Teaser container has aria-label="Individual teaser card"
- Screen reader announces all elements correctly
- Links have descriptive accessible names
- No accessibility violations detected

---

### TC-AGT3: Verify keyboard navigation for Language Selection Overlay
**AC**: AC4  
**Priority**: High  
**Tags**: @Accessibility

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL
- Use keyboard only

**Test Steps**:
1. Tab to language selector button and press Enter
2. Verify focus moves into Language Selection Overlay
3. Tab through language options and Giant Teaser
4. Verify Giant Teaser CTA is keyboard accessible
5. Press Escape to close overlay

**Expected Results**:
- Language Selection Overlay opens via keyboard
- Focus trap works within overlay
- Giant Teaser elements are keyboard accessible
- Escape key closes overlay

---

### TC-AGT4: Verify Contact Us link accessibility
**AC**: AC5  
**Priority**: High  
**Tags**: @Accessibility

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL
- Screen reader is enabled

**Test Steps**:
1. Open Navigation Overlay via keyboard
2. Tab to Contact Us link
3. Verify link has visible focus indicator
4. Verify screen reader announces link text and purpose
5. Press Enter to activate link

**Expected Results**:
- Contact Us link has data-qa="Link" attribute
- Link has visible focus indicator
- Screen reader announces link correctly
- Link is activatable via keyboard

---

## Visual Test Cases

### TC-VGT1: Verify Giant Teaser visual styling in Navigation Overlay - XL viewport
**AC**: AC3  
**Priority**: High  
**Tags**: @Visual @Responsive

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL

**Test Steps**:
1. Open Navigation Overlay
2. Verify Giant Teaser title font-family matches Figma design
3. Verify Giant Teaser title font-size matches Figma design
4. Verify Giant Teaser title line-height matches Figma design
5. Verify Giant Teaser title color matches Figma design
6. Verify Giant Teaser description font-family matches Figma design
7. Verify Giant Teaser description font-size matches Figma design
8. Verify Giant Teaser description line-height matches Figma design
9. Verify Giant Teaser description color matches Figma design
10. Verify CTA link font-family, font-size, line-height, color

**Expected Results**:
- Title font-family: [from Figma XL node 12:34371]
- Title font-size: [from Figma]
- Title line-height: [from Figma]
- Title color: [from Figma]
- Description font-family: [from Figma]
- Description font-size: [from Figma]
- Description line-height: [from Figma]
- Description color: [from Figma]
- CTA styling matches Figma specifications

---

### TC-VGT2: Verify Giant Teaser visual styling in Navigation Overlay - LG viewport
**AC**: AC3  
**Priority**: High  
**Tags**: @Visual @Responsive

**Preconditions**:
- Browser is set to LG viewport (1024x768)
- Navigate to test page URL

**Test Steps**:
1. Open Navigation Overlay
2. Verify Giant Teaser title font-family matches Figma design
3. Verify Giant Teaser title font-size matches Figma design
4. Verify Giant Teaser title line-height matches Figma design
5. Verify Giant Teaser title color matches Figma design
6. Verify Giant Teaser description styling matches Figma
7. Verify CTA link styling matches Figma

**Expected Results**:
- Title font properties match Figma LG node 12:34503
- Description font properties match Figma LG specifications
- CTA styling matches Figma LG design
- All visual properties match design specifications

---

### TC-VGT3: Verify Giant Teaser visual styling in Language Selection Overlay
**AC**: AC4  
**Priority**: High  
**Tags**: @Visual @Responsive

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL

**Test Steps**:
1. Open Language Selection Overlay
2. Verify Giant Teaser visual styling matches Navigation Overlay
3. Verify title, description, and CTA styling consistency
4. Verify spacing and alignment match design

**Expected Results**:
- Visual styling is identical to Navigation Overlay Giant Teaser
- Font properties are consistent across both overlays
- No visual discrepancies between overlays

---

### TC-VGT4: Verify Contact Us link visual styling
**AC**: AC5  
**Priority**: Medium  
**Tags**: @Visual

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL

**Test Steps**:
1. Open Navigation Overlay
2. Verify Contact Us link font-family matches navigation design
3. Verify Contact Us link font-size matches navigation design
4. Verify Contact Us link line-height matches navigation design
5. Verify Contact Us link color matches navigation design
6. Verify Contact Us link positioning and alignment

**Expected Results**:
- Contact Us link styling matches navigation design specifications
- Link is styled consistently with other navigation links
- Visual appearance matches Figma design

---

## Performance Test Cases

### TC-PGT1: Verify Giant Teaser loading performance in overlays
**AC**: AC3, AC4  
**Priority**: Medium  
**Tags**: @Performance

**Preconditions**:
- Browser is set to XL viewport (1440x900)
- Navigate to test page URL

**Test Steps**:
1. Open Navigation Overlay
2. Measure time for Giant Teaser to become visible
3. Close Navigation Overlay
4. Open Language Selection Overlay
5. Measure time for Giant Teaser to become visible
6. Verify no console errors or warnings

**Expected Results**:
- Giant Teaser loads within acceptable time (< 2 seconds)
- No performance degradation
- No console errors related to Giant Teaser
- Smooth transitions and animations

---

## Cross-Browser Test Scenarios

All functional, accessibility, and visual test cases should be executed across:
- **Chromium** (Primary)
- **Firefox**
- **WebKit** (Safari)

---

## Test Data

### URLs
- **Test Page**: https://bayer-beyond-qa-uk.vercel.app
- **Expected CTA Target**: https://www.youtube.com/
- **Expected Contact Us Target**: https://www.google.com/

### Viewport Configurations
- **XL**: 1440 x 900
- **LG**: 1024 x 768
- **MD**: 768 x 1024
- **SM**: 375 x 667

### Locators
- **Giant Teaser Container**: `[data-qa="individual-teaser"][aria-label="Individual teaser card"]`
- **Navigation Overlay**: `[data-qa="FlyoutMenu"]`
- **Language Overlay**: `[data-qa="language-dropdown"]`
- **Contact Us Link**: `[data-qa="Link"]`

---

## Known Limitations

1. Giant Teaser title and description elements do not have dedicated data-qa attributes
   - Solution: Use parent-child relationship from main container
   
2. Multiple SVG icons share the same data-qa="icon" attribute
   - Solution: Use parent-child relationship for specificity

3. Contact Us link text is environment-specific ("careers123" in QA)
   - Solution: Validate presence and functionality, not exact text content

---

## Test Execution Notes

1. Always accept cookies banner before opening overlays
2. Wait for page to fully load before interacting
3. Use soft assertions throughout to prevent premature test termination
4. Verify viewport size is correctly set before each test
5. Close overlays between test scenarios to reset state

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Test Designer | | | |
| Technical Lead | | | |
| QA Manager | | | |

---

**End of Test Cases Document**

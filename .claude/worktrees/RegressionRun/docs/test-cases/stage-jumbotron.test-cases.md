# Stage Jumbotron - Comprehensive Test Cases

**Date**: October 30, 2025  
**Component**: Stage Variants Component - Jumbotron Variant  
**Test Page URL**: `https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Stage-Variants/StageJumbotron`  
**Figma Reference**: `https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=4802-66936&m=dev`

## Test Coverage Overview

This document contains comprehensive test cases for the Stage Jumbotron component covering:
- **Functional Testing** (6 test cases)
- **Visual Testing** (5 test cases) 
- **Accessibility Testing** (6 test cases)
- **Performance Testing** (5 test cases)

**Total Test Cases**: 22

---

## 🔧 FUNCTIONAL TEST CASES

### TC-SJ001: Component Structure Validation
- **Priority**: P0
- **Description**: Verify Stage Jumbotron component renders with correct DOM structure
- **Test Steps**:
  1. Navigate to Stage Jumbotron test page
  2. Verify main container `[data-qa="fullwidth-column"]` is visible
  3. Verify all required child elements are present
- **Expected Results**:
  - Main container exists and is visible
  - All required elements (kicker, title, intro, buttons, image) are present
  - DOM structure matches inspection documentation
- **Locator Strategy**: Parent-child relationships using data-qa attributes

### TC-SJ002: Kicker Text Display
- **Priority**: P1
- **Description**: Verify kicker text element renders correctly
- **Test Steps**:
  1. Navigate to component
  2. Locate kicker text using `[data-qa="stage-kicker-text"]`
  3. Verify element is visible and contains content
- **Expected Results**:
  - Kicker text element is visible
  - Element is not empty (language-agnostic)
  - Element has correct data-qa attribute

### TC-SJ003: Main Headline Validation
- **Priority**: P0
- **Description**: Verify main headline structure and semantic HTML
- **Test Steps**:
  1. Navigate to component
  2. Locate headline using `[data-qa="title-component"]`
  3. Verify H1 semantic structure
  4. Verify highlighted text span `[data-qa="stage-headline-text"]`
- **Expected Results**:
  - Main headline is H1 element
  - Element contains highlighted text span
  - Both elements have correct data-qa attributes
  - Content is not empty

### TC-SJ004: CTA Buttons Functionality
- **Priority**: P0
- **Description**: Verify both CTA buttons are functional and accessible
- **Test Steps**:
  1. Navigate to component
  2. Locate button container `[data-qa="stage-buttons"]`
  3. Verify primary button `[data-qa="stage-primary-button"]`
  4. Verify secondary button `[data-qa="stage-secondary-button"]`
  5. Check href attributes and click functionality
- **Expected Results**:
  - Both buttons are visible and clickable
  - Buttons have valid href attributes
  - Buttons are within button container
  - Parent-child relationship is correct

### TC-SJ005: Image Display and Properties
- **Priority**: P1
- **Description**: Verify stage image renders with correct properties
- **Test Steps**:
  1. Navigate to component
  2. Locate image section `[data-qa="stage-image-section"]`
  3. Locate image `[data-qa="stage-image"]`
  4. Verify image attributes (alt, src, aria-label)
- **Expected Results**:
  - Image is visible within image section
  - Image has alt text attribute
  - Image has valid src attribute
  - Parent-child relationship is maintained

### TC-SJ006: Cross-Viewport Responsiveness
- **Priority**: P0
- **Description**: Verify component renders correctly across all viewports
- **Test Steps**:
  1. Test XL viewport (1440px+)
  2. Test LG viewport (1024-1439px)
  3. Test MD viewport (768-1023px)
  4. Test SM viewport (320-767px)
  5. Verify all elements remain visible and functional
- **Expected Results**:
  - Component adapts to viewport sizes
  - All elements remain accessible
  - No layout breaks or overlaps
  - Functionality preserved across viewports

---

## 🎨 VISUAL TEST CASES (Figma Integration)

### TC-VSJ001: Typography Validation - Kicker Text
- **Priority**: P1
- **Description**: Verify kicker text typography matches Figma specifications
- **Test Steps**:
  1. Navigate to component
  2. Extract computed styles from `[data-qa="stage-kicker-text"]`
  3. Compare with Figma values for all viewports
- **Expected Results** (Figma API Integration):
  - Font family matches Figma specification
  - Font size matches across viewports
  - Line height matches specification
  - Color values match Figma design
- **Viewports**: XL(4802:66937), LG(4802:66938), MD(4802:66939), SM(4802:66940)

### TC-VSJ002: Typography Validation - Main Headline
- **Priority**: P0
- **Description**: Verify main headline typography and gradient styling
- **Test Steps**:
  1. Extract styles from `[data-qa="title-component"]`
  2. Verify gradient text on `[data-qa="stage-headline-text"]`
  3. Compare with Figma specifications
- **Expected Results**:
  - H1 font size matches Figma (5xl on desktop, 7xl on larger screens)
  - Font weight is bold as specified
  - Gradient text renders correctly
  - Line height matches tight specification

### TC-VSJ003: Button Styling Consistency
- **Priority**: P1
- **Description**: Verify CTA button styling matches Figma design
- **Test Steps**:
  1. Extract styles from primary button `[data-qa="stage-primary-button"]`
  2. Extract styles from secondary button `[data-qa="stage-secondary-button"]`
  3. Compare with Figma button specifications
- **Expected Results**:
  - Primary button: inverted background styling
  - Secondary button: transparent with border styling
  - Font styling matches specifications
  - Hover states function correctly

### TC-VSJ004: Image Aspect Ratio Validation
- **Priority**: P1
- **Description**: Verify stage image maintains correct aspect ratio across viewports
- **Test Steps**:
  1. Measure image dimensions on `[data-qa="stage-image"]`
  2. Calculate aspect ratio across viewports
  3. Compare with Figma specifications
- **Expected Results**:
  - Image maintains 1.5 aspect ratio (from Figma values)
  - Dimensions match viewport specifications
  - Image covers container correctly
  - No distortion across viewports

### TC-VSJ005: Layout Spacing and Positioning
- **Priority**: P1
- **Description**: Verify component spacing matches Figma layout specifications
- **Test Steps**:
  1. Measure padding and margins on main container
  2. Verify spacing between elements
  3. Compare with Figma layout specifications
- **Expected Results**:
  - Container padding matches grid margins
  - Element spacing matches Figma specifications
  - Layout positioning is consistent
  - Viewport-specific spacing is correct

---

## ♿ ACCESSIBILITY TEST CASES (WCAG 2.1 AA)

### TC-ASJ001: Semantic HTML Structure
- **Priority**: P0
- **Tag**: @Accessibility
- **Description**: Verify proper semantic HTML structure for screen readers
- **Test Steps**:
  1. Navigate to component
  2. Verify H1 tag for main headline
  3. Verify proper paragraph tags for text content
  4. Check aria-label attributes
- **Expected Results**:
  - Main headline uses H1 tag (proper heading hierarchy)
  - Text content uses paragraph tags
  - aria-label present on title-component and stage-image
  - Semantic structure supports screen readers
- **WCAG Criteria**: 1.3.1 (Info and Relationships)

### TC-ASJ002: Image Alt Text and Descriptions
- **Priority**: P0
- **Tag**: @Accessibility
- **Description**: Verify images have proper alternative text
- **Test Steps**:
  1. Locate image `[data-qa="stage-image"]`
  2. Verify alt attribute exists
  3. Verify aria-label attribute
  4. Test with screen reader
- **Expected Results**:
  - Image has descriptive alt text
  - aria-label provides additional context
  - Screen reader announces image appropriately
  - No decorative images without proper alt=""
- **WCAG Criteria**: 1.1.1 (Non-text Content)

### TC-ASJ003: Keyboard Navigation
- **Priority**: P0
- **Tag**: @Accessibility
- **Description**: Verify all interactive elements are keyboard accessible
- **Test Steps**:
  1. Navigate to component using Tab key only
  2. Verify focus moves to CTA buttons
  3. Test Enter/Space key activation
  4. Verify focus indicators are visible
- **Expected Results**:
  - Both CTA buttons are reachable via keyboard
  - Focus indicators are clearly visible
  - Buttons activate with Enter/Space keys
  - Tab order is logical and predictable
- **WCAG Criteria**: 2.1.1 (Keyboard), 2.4.7 (Focus Visible)

### TC-ASJ004: Color Contrast Compliance
- **Priority**: P1
- **Tag**: @Accessibility
- **Description**: Verify text color contrast meets WCAG AA standards
- **Test Steps**:
  1. Measure color contrast for all text elements
  2. Test kicker text against background
  3. Test headline text contrast
  4. Test button text contrast
- **Expected Results**:
  - All text meets 4.5:1 contrast ratio minimum
  - Button text meets contrast requirements
  - Gradient text maintains sufficient contrast
  - No contrast violations detected
- **WCAG Criteria**: 1.4.3 (Contrast Minimum)

### TC-ASJ005: Screen Reader Compatibility
- **Priority**: P1
- **Tag**: @Accessibility
- **Description**: Verify component works correctly with screen readers
- **Test Steps**:
  1. Use screen reader to navigate component
  2. Verify all content is announced
  3. Check reading order and structure
  4. Test button announcements
- **Expected Results**:
  - All text content is read aloud
  - Heading structure is announced correctly
  - Buttons are identified as clickable
  - Reading order matches visual order
- **WCAG Criteria**: 4.1.2 (Name, Role, Value)

### TC-ASJ006: Focus Management
- **Priority**: P1
- **Tag**: @Accessibility
- **Description**: Verify proper focus management and visibility
- **Test Steps**:
  1. Tab through all interactive elements
  2. Verify focus remains within component
  3. Check focus indicator visibility
  4. Test focus after button activation
- **Expected Results**:
  - Focus moves logically between elements
  - Focus indicators are always visible
  - No focus traps or lost focus
  - Focus returns appropriately after interactions
- **WCAG Criteria**: 2.4.7 (Focus Visible), 2.4.3 (Focus Order)

---

## ⚡ PERFORMANCE TEST CASES

### TC-PSJ001: Page Load Performance
- **Priority**: P1
- **Description**: Verify component loads within acceptable time limits
- **Test Steps**:
  1. Navigate to test page with performance monitoring
  2. Measure time to first contentful paint (FCP)
  3. Measure largest contentful paint (LCP)
  4. Record cumulative layout shift (CLS)
- **Expected Results**:
  - FCP < 2.5 seconds
  - LCP < 4 seconds
  - CLS < 0.1
  - Component renders without blocking page load

### TC-PSJ002: Image Optimization
- **Priority**: P1
- **Description**: Verify stage image is optimized for web performance
- **Test Steps**:
  1. Analyze image loading behavior
  2. Check image format and compression
  3. Verify responsive image loading
  4. Test lazy loading if implemented
- **Expected Results**:
  - Images are properly optimized
  - Appropriate formats used (WebP, etc.)
  - Responsive images load for viewport
  - No unnecessary image downloads

### TC-PSJ003: Cross-Browser Performance
- **Priority**: P2
- **Description**: Verify consistent performance across browsers
- **Test Steps**:
  1. Test in Chrome, Firefox, Safari, Edge
  2. Measure load times in each browser
  3. Verify rendering consistency
  4. Check for browser-specific issues
- **Expected Results**:
  - Consistent performance across browsers
  - No browser-specific rendering issues
  - Load times within acceptable range
  - All functionality works in all browsers

### TC-PSJ004: Viewport Performance Impact
- **Priority**: P2
- **Description**: Verify performance impact of viewport changes
- **Test Steps**:
  1. Test component at different viewport sizes
  2. Measure rendering performance during resize
  3. Check for layout thrashing
  4. Verify smooth transitions
- **Expected Results**:
  - Viewport changes don't cause performance issues
  - No layout thrashing during resize
  - Smooth responsive behavior
  - Consistent performance across viewports

### TC-PSJ005: Memory Usage Analysis
- **Priority**: P2
- **Description**: Verify component doesn't cause memory leaks
- **Test Steps**:
  1. Monitor memory usage during component interaction
  2. Test repeated navigation to/from page
  3. Check for memory cleanup
  4. Verify no memory leaks
- **Expected Results**:
  - Memory usage remains stable
  - No memory leaks detected
  - Proper cleanup on navigation
  - Efficient memory utilization

---

## Test Implementation Guidelines

### Locator Strategies (Parent-Child Relationships)
```typescript
// Main container and child elements
private readonly stageContainer: Locator = this.page.locator('[data-qa="fullwidth-column"]');
private readonly kickerText: Locator = this.stageContainer.locator('[data-qa="stage-kicker-text"]');
private readonly mainHeadline: Locator = this.stageContainer.locator('[data-qa="title-component"]');

// Button container with children
private readonly buttonContainer: Locator = this.stageContainer.locator('[data-qa="stage-buttons"]');
private readonly primaryButton: Locator = this.buttonContainer.locator('[data-qa="stage-primary-button"]');
private readonly secondaryButton: Locator = this.buttonContainer.locator('[data-qa="stage-secondary-button"]');

// Image section with child image
private readonly imageSection: Locator = this.stageContainer.locator('[data-qa="stage-image-section"]');
private readonly stageImage: Locator = this.imageSection.locator('[data-qa="stage-image"]');
```

### Figma Integration
- **Figma Values File**: `helpers/utils/figma-values/StageJumbotron_FigmaValues.ts`
- **Viewport Node IDs**: XL(4802:66937), LG(4802:66938), MD(4802:66939), SM(4802:66940)
- **Visual Validation**: Font properties, colors, spacing, dimensions

### Authentication Requirements
- **Status**: ✅ No authentication required
- **Cookie Handling**: Use `acceptCookiesBanner()` from BasePage if needed

### Test Execution Priority
1. **P0 Tests**: Critical functionality (6 tests)
2. **P1 Tests**: Important features (11 tests) 
3. **P2 Tests**: Nice-to-have validations (5 tests)

---

## Traceability Matrix

| Requirement | Test Cases | Status |
|-------------|------------|--------|
| Component Structure | TC-SJ001, TC-ASJ001 | Ready |
| Kicker Text | TC-SJ002, TC-VSJ001 | Ready |
| Main Headline | TC-SJ003, TC-VSJ002 | Ready |
| CTA Buttons | TC-SJ004, TC-VSJ003, TC-ASJ003 | Ready |
| Stage Image | TC-SJ005, TC-VSJ004, TC-ASJ002 | Ready |
| Cross-Viewport | TC-SJ006, TC-VSJ005, TC-PSJ004 | Ready |
| Accessibility | TC-ASJ001-006 | Ready |
| Performance | TC-PSJ001-005 | Ready |
| Visual Design | TC-VSJ001-005 | Ready |

**Total Coverage**: 22 test cases covering all requirements

---

## Ready for Implementation

✅ **Functional Tests**: 6 test cases ready  
✅ **Visual Tests**: 5 test cases with Figma integration  
✅ **Accessibility Tests**: 6 test cases with WCAG compliance  
✅ **Performance Tests**: 5 test cases for optimization  
✅ **Figma Values**: Extracted and configured  
✅ **Locator Strategy**: Parent-child data-qa relationships defined  

**Next Steps**: Review test cases and proceed to Step 4 (Implementation & Execution)
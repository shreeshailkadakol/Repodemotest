# Stage Full Width Component - Test Cases Documentation

**Component**: Stage Full Width Variant  
**Test Page URL**: https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Stage-Variants/StageFullwidth  
**Figma URL**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=4802-66953&m=dev  
**Created**: October 30, 2025  
**Status**: Ready for Implementation  

## 📋 Test Coverage Overview

### **Test Categories:**
- **Functional Testing**: 6 test cases (TC-SFW001 - TC-SFW006)
- **Visual Testing**: 5 test cases (TC-VSFW001 - TC-VSFW005) 
- **Accessibility Testing**: 6 test cases (TC-ASFW001 - TC-ASFW006)
- **Performance Testing**: 5 test cases (TC-PSFW001 - TC-PSFW005)
- **Cross-Browser Testing**: 1 test case (TC-SFW007)

**Total**: 23 test cases across all testing categories

---

## 🔧 **FUNCTIONAL TEST CASES (6 Test Cases)**

### **TC-SFW001: Verify Stage Full Width component loads successfully**
- **Priority**: P0
- **Tags**: @Functional, @P0, @StageFullWidth
- **Objective**: Verify the Stage Full Width component loads and displays correctly
- **Preconditions**: 
  - User navigates to the Stage Full Width test page
  - Page authentication is handled
  - Cookies are accepted
- **Test Steps**:
  1. Navigate to Stage Full Width test page
  2. Accept cookies banner if present
  3. Verify main stage container is visible
  4. Verify container has correct data-qa attribute
  5. Verify component is within viewport
- **Expected Results**:
  - Stage container `[data-qa="fullwidth-column"]` is visible
  - Container has correct data-qa attribute value
  - Component bounding box exists and is not null
  - No console errors related to component loading
- **Data Requirements**: None
- **DOM Elements**:
  - Container: `[data-qa="fullwidth-column"]`

---

### **TC-SFW002: Verify all text elements are visible and have content**
- **Priority**: P0
- **Tags**: @Functional, @P0, @StageFullWidth
- **Objective**: Verify all text elements within the component are properly displayed
- **Preconditions**: 
  - Stage Full Width component is loaded
  - All text elements are rendered
- **Test Steps**:
  1. Verify kicker text element is visible
  2. Verify main title element is visible 
  3. Verify headline highlight text is visible
  4. Verify introduction text is visible
  5. Verify all text elements contain non-empty content
  6. Verify semantic HTML structure
- **Expected Results**:
  - Kicker text `[data-qa="stage-kicker-text"]` is visible and not empty
  - Main title `[data-qa="title-component"]` is visible and not empty
  - Headline text `[data-qa="stage-headline-text"]` is visible and not empty
  - Intro text `[data-qa="stage-intro-text"]` is visible and not empty
  - Main title uses H1 semantic tag
  - All elements have appropriate content length
- **DOM Elements**:
  - Kicker: `[data-qa="stage-kicker-text"]`
  - Title: `[data-qa="title-component"]`
  - Headline: `[data-qa="stage-headline-text"]`
  - Intro: `[data-qa="stage-intro-text"]`

---

### **TC-SFW003: Verify primary CTA button functionality**
- **Priority**: P0
- **Tags**: @Functional, @P0, @StageFullWidth
- **Objective**: Verify primary CTA button is functional and interactive
- **Preconditions**:
  - Stage Full Width component is loaded
  - Primary button is rendered
- **Test Steps**:
  1. Verify primary button is visible
  2. Verify button is enabled/clickable
  3. Verify button has correct data-qa attribute
  4. Verify button has proper href attribute
  5. Verify button click functionality (if navigable)
  6. Verify button hover states work
- **Expected Results**:
  - Primary button `[data-qa="stage-primary-button"]` is visible
  - Button is enabled and clickable
  - Button has valid href attribute
  - Button responds to hover interactions
  - Button maintains proper styling states
- **DOM Elements**:
  - Button: `[data-qa="stage-primary-button"]`
  - Container: `[data-qa="stage-buttons"]`

---

### **TC-SFW004: Verify secondary CTA button functionality**
- **Priority**: P1
- **Tags**: @Functional, @P1, @StageFullWidth
- **Objective**: Verify secondary CTA button is functional and interactive
- **Preconditions**:
  - Stage Full Width component is loaded
  - Secondary button is rendered
- **Test Steps**:
  1. Verify secondary button is visible
  2. Verify button is enabled/clickable
  3. Verify button has correct data-qa attribute
  4. Verify button has proper href attribute
  5. Verify button click functionality (if navigable)
  6. Verify button hover states work
- **Expected Results**:
  - Secondary button `[data-qa="stage-secondary-button"]` is visible
  - Button is enabled and clickable
  - Button has valid href attribute
  - Button responds to hover interactions
  - Button maintains proper styling states
- **DOM Elements**:
  - Button: `[data-qa="stage-secondary-button"]`
  - Container: `[data-qa="stage-buttons"]`

---

### **TC-SFW005: Verify stage images display and properties**
- **Priority**: P0
- **Tags**: @Functional, @P0, @StageFullWidth
- **Objective**: Verify stage images load properly with correct attributes
- **Preconditions**:
  - Stage Full Width component is loaded
  - Images are rendered
- **Test Steps**:
  1. Verify image section container is visible
  2. Verify at least one stage image is visible
  3. Verify images have required attributes (src, alt)
  4. Verify images load successfully (natural width > 0)
  5. Verify image data-qa attributes are correct
  6. Verify responsive image behavior
- **Expected Results**:
  - Image section `[data-qa="stage-image-section"]` is visible
  - Stage images `[data-qa="stage-image"]` are visible
  - Images have valid src and alt attributes
  - Images have loaded successfully (natural dimensions)
  - Multiple responsive images are available
- **DOM Elements**:
  - Container: `[data-qa="stage-image-section"]`
  - Images: `[data-qa="stage-image"]`

---

### **TC-SFW006: Verify component semantic HTML structure**
- **Priority**: P1
- **Tags**: @Functional, @P1, @StageFullWidth
- **Objective**: Verify proper semantic HTML structure for accessibility and SEO
- **Preconditions**:
  - Stage Full Width component is loaded
  - All elements are rendered
- **Test Steps**:
  1. Verify main container uses semantic HTML
  2. Verify heading hierarchy is correct
  3. Verify paragraph structure is appropriate
  4. Verify link/button elements use correct tags
  5. Verify image alt attributes are present
  6. Verify overall markup validity
- **Expected Results**:
  - Main container uses SECTION tag
  - Main title uses H1 tag
  - Introduction uses P tag
  - Buttons use A tags with proper hrefs
  - Images have alt attributes
  - Semantic structure follows accessibility guidelines
- **DOM Elements**:
  - All component elements with focus on tag types

---

## 🎨 **VISUAL TEST CASES (5 Test Cases)**

### **TC-VSFW001: Verify visual properties on XL viewport (Desktop Large)**
- **Priority**: P0
- **Tags**: @Visual, @P0, @StageFullWidth, @XL
- **Figma Node ID**: 4802:66954
- **Objective**: Verify visual properties match Figma specifications for XL viewport
- **Preconditions**:
  - Viewport set to 1440x900 (XL)
  - Figma values fetched for node 4802:66954
- **Test Steps**:
  1. Set viewport to XL dimensions (1440x900)
  2. Wait for layout stabilization
  3. Extract actual CSS properties for all text elements
  4. Compare with Figma expected values
  5. Validate font families, sizes, weights, colors, line heights
  6. Verify button styling properties
- **Expected Results** (from Figma):
  - **Kicker Text**: Font family, size, weight, color, line height match Figma
  - **Main Headline**: Font family, size, weight, color, line height match Figma  
  - **Description Text**: Font family, size, weight, color, line height match Figma
  - **Primary Button**: Font family, size, weight, colors match Figma
  - **Secondary Button**: Font family, size, weight, colors match Figma
- **DOM Elements**: All text and button elements for CSS validation

---

### **TC-VSFW002: Verify visual properties on LG viewport (Desktop)**
- **Priority**: P0
- **Tags**: @Visual, @P0, @StageFullWidth, @LG
- **Figma Node ID**: 4802:66955
- **Objective**: Verify visual properties match Figma specifications for LG viewport
- **Test Steps**: Same as TC-VSFW001 but with LG viewport (1200x800)
- **Expected Results**: Visual properties match Figma node 4802:66955

---

### **TC-VSFW003: Verify visual properties on MD viewport (Tablet)**
- **Priority**: P0
- **Tags**: @Visual, @P0, @StageFullWidth, @MD
- **Figma Node ID**: 4802:66956
- **Objective**: Verify visual properties match Figma specifications for MD viewport
- **Test Steps**: Same as TC-VSFW001 but with MD viewport (768x1024)
- **Expected Results**: Visual properties match Figma node 4802:66956

---

### **TC-VSFW004: Verify visual properties on SM viewport (Mobile)**
- **Priority**: P0
- **Tags**: @Visual, @P0, @StageFullWidth, @SM
- **Figma Node ID**: 4802:66959
- **Objective**: Verify visual properties match Figma specifications for SM viewport
- **Test Steps**: Same as TC-VSFW001 but with SM viewport (375x667)
- **Expected Results**: Visual properties match Figma node 4802:66959

---

### **TC-VSFW005: Verify responsive layout behavior across viewports**
- **Priority**: P1
- **Tags**: @Visual, @P1, @StageFullWidth, @Responsive
- **Objective**: Verify layout adapts properly across different viewports
- **Preconditions**: Component loaded successfully
- **Test Steps**:
  1. Test each viewport: XL (1440x900), LG (1200x800), MD (768x1024), SM (375x667)
  2. For each viewport, verify all elements remain visible and functional
  3. Verify no layout breaks or overlaps occur
  4. Verify images adapt to container sizes
  5. Verify text readability is maintained
  6. Verify button accessibility is preserved
- **Expected Results**:
  - All elements remain visible across viewports
  - No layout breaks or content overflow
  - Images scale appropriately
  - Text remains readable
  - Buttons remain clickable and properly sized

---

## ♿ **ACCESSIBILITY TEST CASES (6 Test Cases)**

### **TC-ASFW001: Verify WCAG 2.1 AA compliance using manual validation**
- **Priority**: P0
- **Tags**: @Accessibility, @P0, @StageFullWidth, @WCAG
- **Objective**: Verify component meets WCAG 2.1 AA accessibility standards
- **Test Steps**:
  1. Verify all interactive elements are keyboard accessible
  2. Verify proper focus management
  3. Verify color contrast ratios meet standards
  4. Verify text alternatives for images
  5. Verify proper labeling for interactive elements
  6. Run basic accessibility checks
- **Expected Results**:
  - All elements pass basic WCAG validation
  - Interactive elements are keyboard accessible
  - Images have proper alt text
  - Color contrast meets AA standards
  - Focus indicators are visible

---

### **TC-ASFW002: Verify proper heading hierarchy**
- **Priority**: P0
- **Tags**: @Accessibility, @P0, @StageFullWidth, @Headings
- **Objective**: Verify heading structure follows proper hierarchy
- **Test Steps**:
  1. Verify main title uses H1 tag
  2. Verify no heading levels are skipped
  3. Verify heading content is meaningful
  4. Verify heading structure is logical
- **Expected Results**:
  - Main title uses H1 tag properly
  - Heading hierarchy is logical and sequential
  - Headings have meaningful, accessible content

---

### **TC-ASFW003: Verify image alt text accessibility**
- **Priority**: P0
- **Tags**: @Accessibility, @P0, @StageFullWidth, @Images
- **Objective**: Verify all images have proper alt text for screen readers
- **Test Steps**:
  1. Verify all images have alt attributes
  2. Verify alt text is descriptive and meaningful
  3. Verify decorative images have appropriate alt handling
  4. Verify images are accessible to screen readers
- **Expected Results**:
  - All images have alt attributes
  - Alt text is descriptive and helpful
  - Images are properly accessible

---

### **TC-ASFW004: Verify keyboard navigation functionality**
- **Priority**: P0
- **Tags**: @Accessibility, @P0, @StageFullWidth, @Keyboard
- **Objective**: Verify component is fully navigable via keyboard
- **Test Steps**:
  1. Navigate through component using Tab key
  2. Verify focus moves logically through interactive elements
  3. Verify buttons can be activated with Enter/Space
  4. Verify focus indicators are visible
  5. Verify no keyboard traps exist
- **Expected Results**:
  - Tab navigation works through all interactive elements
  - Focus order is logical and intuitive
  - Buttons activate properly with keyboard
  - Focus indicators are clearly visible
  - No keyboard accessibility barriers

---

### **TC-ASFW005: Verify color contrast compliance**
- **Priority**: P1
- **Tags**: @Accessibility, @P1, @StageFullWidth, @ColorContrast
- **Objective**: Verify color contrast meets WCAG AA standards
- **Test Steps**:
  1. Measure color contrast ratios for all text elements
  2. Verify text against background meets 4.5:1 ratio
  3. Verify large text meets 3:1 ratio
  4. Verify button text contrast is adequate
  5. Test with different color schemes if applicable
- **Expected Results**:
  - All text meets WCAG AA color contrast requirements
  - Buttons have adequate contrast ratios
  - Text remains readable across all elements

---

### **TC-ASFW006: Verify screen reader compatibility**
- **Priority**: P1
- **Tags**: @Accessibility, @P1, @StageFullWidth, @ScreenReader
- **Objective**: Verify proper ARIA attributes and screen reader support
- **Test Steps**:
  1. Verify proper ARIA attributes are present
  2. Verify semantic roles are appropriate
  3. Verify screen reader announcements are meaningful
  4. Verify component has proper landmarks
  5. Test navigation with screen reader simulation
- **Expected Results**:
  - ARIA attributes are properly implemented
  - Component has appropriate semantic roles
  - Content is announced meaningfully to screen readers
  - Navigation landmarks are properly defined

---

## ⚡ **PERFORMANCE TEST CASES (5 Test Cases)**

### **TC-PSFW001: Verify component loading performance**
- **Priority**: P1
- **Tags**: @Performance, @P1, @StageFullWidth, @LoadTime
- **Objective**: Verify component loads within acceptable time limits
- **Test Steps**:
  1. Measure time from page start to component visibility
  2. Verify main container loads quickly
  3. Verify text elements appear promptly
  4. Monitor for performance bottlenecks
- **Expected Results**:
  - Component loads within 3 seconds
  - Main elements visible within 1 second
  - No significant performance delays

---

### **TC-PSFW002: Verify image loading performance**
- **Priority**: P1
- **Tags**: @Performance, @P1, @StageFullWidth, @ImageLoad
- **Objective**: Verify stage images load efficiently
- **Test Steps**:
  1. Measure image loading times
  2. Verify images have proper dimensions
  3. Verify responsive image loading
  4. Check for lazy loading if implemented
- **Expected Results**:
  - Images load within reasonable time
  - Images have proper dimensions when loaded
  - Responsive images load appropriately
  - No broken image states

---

### **TC-PSFW003: Verify viewport adaptation performance**
- **Priority**: P2
- **Tags**: @Performance, @P2, @StageFullWidth, @Responsive
- **Objective**: Verify responsive layout changes are smooth
- **Test Steps**:
  1. Test viewport changes between breakpoints
  2. Measure layout adaptation time
  3. Verify no layout thrashing occurs
  4. Test multiple viewport transitions
- **Expected Results**:
  - Viewport changes adapt smoothly
  - Layout transitions are fast (< 1 second)
  - No visual glitches during transitions

---

### **TC-PSFW004: Verify interactive element response time**
- **Priority**: P2
- **Tags**: @Performance, @P2, @StageFullWidth, @Interaction
- **Objective**: Verify buttons and interactions respond quickly
- **Test Steps**:
  1. Test button hover response times
  2. Test button click response
  3. Measure interaction feedback timing
  4. Verify smooth animations/transitions
- **Expected Results**:
  - Button interactions respond immediately
  - Hover effects are smooth and fast
  - No noticeable interaction delays
  - Animations are smooth and performant

---

### **TC-PSFW005: Verify scroll performance with component**
- **Priority**: P2
- **Tags**: @Performance, @P2, @StageFullWidth, @Scroll
- **Objective**: Verify component performs well during scrolling
- **Test Steps**:
  1. Test scrolling performance through component
  2. Verify scroll smoothness
  3. Test scroll-triggered animations if any
  4. Monitor performance during scroll
- **Expected Results**:
  - Scrolling through component is smooth
  - No performance degradation during scroll
  - Scroll-triggered effects work properly
  - Component remains functional after scrolling

---

## 🌐 **CROSS-BROWSER TEST CASES (1 Test Case)**

### **TC-SFW007: Verify component functionality across different browsers**
- **Priority**: P1
- **Tags**: @CrossBrowser, @P1, @StageFullWidth
- **Objective**: Verify component works consistently across major browsers
- **Test Steps**:
  1. Run core functionality tests in Chrome, Firefox, Safari
  2. Verify all text elements display correctly
  3. Verify all buttons work consistently
  4. Verify images display properly
  5. Verify responsive behavior is consistent
  6. Check for browser-specific issues
- **Expected Results**:
  - Component functions identically across browsers
  - No browser-specific layout issues
  - All interactions work consistently
  - Visual consistency maintained

---

## 📊 **Traceability Matrix**

| Test ID | Category | Priority | Status | Acceptance Criteria Coverage |
|---------|----------|----------|--------|------------------------------|
| TC-SFW001 | Functional | P0 | Ready | Component Loading |
| TC-SFW002 | Functional | P0 | Ready | Text Element Display |
| TC-SFW003 | Functional | P0 | Ready | Primary CTA Functionality |
| TC-SFW004 | Functional | P1 | Ready | Secondary CTA Functionality |
| TC-SFW005 | Functional | P0 | Ready | Image Display & Properties |
| TC-SFW006 | Functional | P1 | Ready | Semantic HTML Structure |
| TC-VSFW001 | Visual | P0 | Ready | XL Viewport Visual Properties |
| TC-VSFW002 | Visual | P0 | Ready | LG Viewport Visual Properties |
| TC-VSFW003 | Visual | P0 | Ready | MD Viewport Visual Properties |
| TC-VSFW004 | Visual | P0 | Ready | SM Viewport Visual Properties |
| TC-VSFW005 | Visual | P1 | Ready | Responsive Layout Behavior |
| TC-ASFW001 | Accessibility | P0 | Ready | WCAG 2.1 AA Compliance |
| TC-ASFW002 | Accessibility | P0 | Ready | Heading Hierarchy |
| TC-ASFW003 | Accessibility | P0 | Ready | Image Alt Text |
| TC-ASFW004 | Accessibility | P0 | Ready | Keyboard Navigation |
| TC-ASFW005 | Accessibility | P1 | Ready | Color Contrast |
| TC-ASFW006 | Accessibility | P1 | Ready | Screen Reader Compatibility |
| TC-PSFW001 | Performance | P1 | Ready | Component Loading Performance |
| TC-PSFW002 | Performance | P1 | Ready | Image Loading Performance |
| TC-PSFW003 | Performance | P2 | Ready | Viewport Adaptation Performance |
| TC-PSFW004 | Performance | P2 | Ready | Interactive Element Response |
| TC-PSFW005 | Performance | P2 | Ready | Scroll Performance |
| TC-SFW007 | Cross-Browser | P1 | Ready | Cross-Browser Compatibility |

## 📝 **Notes and Assumptions**

1. **Visual Testing**: Requires Figma API integration for expected values
2. **Authentication**: Uses BasePage authentication methods
3. **Multi-Language**: All tests designed to be language-agnostic
4. **DOM Structure**: Based on actual DOM inspection findings
5. **Responsive Design**: Tests cover XL, LG, MD, SM breakpoints
6. **Accessibility**: Focuses on WCAG 2.1 AA compliance
7. **Performance**: Realistic thresholds for production environment

## ✅ **Test Case Review Checklist**

- [ ] All test cases have clear, measurable objectives
- [ ] Test steps are detailed and executable
- [ ] Expected results are specific and verifiable
- [ ] DOM elements reference actual inspected structure
- [ ] Language-agnostic validation approaches used
- [ ] Accessibility requirements covered comprehensively
- [ ] Visual testing integrated with Figma specifications
- [ ] Performance benchmarks are realistic
- [ ] Cross-browser compatibility addressed
- [ ] Test case IDs follow standard format
- [ ] Traceability to requirements established
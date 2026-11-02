# Teaser Grid Component Test Cases

## Overview
This document contains comprehensive test cases for the Teaser Grid Component based on user requirements. The component displays a grid of individual teaser cards with title, images, and content.

## Component Structure
The Teaser Grid component consists of:
1. Main container with proper data-qa attributes
2. Title component with headline and intro text
3. Grid container holding individual teaser cards
4. Individual teaser cards with images and content
5. Responsive layout adapting to different viewports

## Test Case Categories
- **Functional Testing**: Component structure, visibility, interaction
- **Visual Testing**: Typography, colors, layout against Figma specifications
- **Accessibility Testing**: WCAG compliance, keyboard navigation, screen reader support
- **Performance Testing**: Load times, rendering performance

---

## FUNCTIONAL TEST CASES

### TC-TG001: Verify Teaser Grid Component Container Structure and Full-Width Placement (AC2)
**Priority:** High  
**Type:** Functional  
**Tag:** @Functional @UKProd

**Description:**  
Verify that the Teaser Grid component container is properly displayed with correct data-qa attributes, semantic HTML structure, and is placed in a 100% full-width divider as per AC2.

**Prerequisites:**
- Application is running in QA environment
- Teaser Grid test page is accessible
- Authentication is successful

**Test Steps:**
1. Navigate to Teaser Grid test page
2. Accept cookie banner if present
3. Wait for component to be fully loaded
4. Verify main container has data-qa="teaser-grid"
5. Verify container is a semantic section element
6. Verify container is visible on the page
7. Verify component is inside fullwidth-column container
8. Measure container width vs viewport width
9. Verify width ratio is >85% (full-width placement)

**Expected Results:**
- Main container exists and is visible
- Correct data-qa attribute is present
- Semantic HTML structure is maintained
- Component is inside full-width divider (AC2)
- Container width is at least 85% of viewport
- Component loads without errors

**Test Data:**
- Container selector: `[data-qa="teaser-grid"]`
- Expected element type: `<section>`
- Minimum width ratio: 0.85

---

### TC-TG002: Verify Title Component Display
**Priority:** High  
**Type:** Functional  
**Tag:** @Functional @UKProd

**Description:**  
Verify that the title component within the Teaser Grid is properly displayed with correct semantic structure.

**Prerequisites:**
- Application is running
- Teaser Grid component is visible

**Test Steps:**
1. Navigate to Teaser Grid test page
2. Locate title component with data-qa="title-component"
3. Verify title is an H2 semantic element
4. Verify title has aria-label attribute
5. Verify title is not empty
6. Verify title is visible and readable

**Expected Results:**
- Title component is visible
- Element is semantic H2 tag
- Title has meaningful content
- Proper accessibility attributes present

**Test Data:**
- Title selector: `[data-qa="title-component"]`
- Expected tag: `h2`

---

### TC-TG003: Verify Headline and Intro Text Display
**Priority:** Medium  
**Type:** Functional  
**Tag:** @Functional @UKProd

**Description:**  
Verify that headline text and introduction text are properly displayed within the Teaser Grid component.

**Prerequisites:**
- Teaser Grid component is loaded
- Component structure is verified

**Test Steps:**
1. Navigate to component page
2. Verify headline text element exists with data-qa="stage-headline-text"
3. Verify headline text is visible
4. Verify headline text is not empty
5. Verify intro text element exists with data-qa="stage-intro-text"
6. Verify intro text is visible
7. Verify intro text is not empty

**Expected Results:**
- Headline text element is present and visible
- Introduction text element is present and visible
- Both elements contain content
- Text is readable and properly styled

**Test Data:**
- Headline selector: `[data-qa="stage-headline-text"]`
- Intro selector: `[data-qa="stage-intro-text"]`

---

### TC-TG004: Verify Teaser Grid Container Structure
**Priority:** High  
**Type:** Functional  
**Tag:** @Functional @UKProd

**Description:**  
Verify that the teaser grid container is properly structured and contains the expected layout elements.

**Prerequisites:**
- Teaser Grid component is visible
- Page is fully loaded

**Test Steps:**
1. Navigate to test page
2. Locate grid container with data-qa="teaser-grid-container"
3. Verify container is visible
4. Verify container has child elements
5. Verify grid layout is applied
6. Check that container adapts to viewport size

**Expected Results:**
- Grid container is visible and properly structured
- Container has data-qa="teaser-grid-container"
- Grid displays teaser cards in proper layout
- Layout is responsive

**Test Data:**
- Grid container selector: `[data-qa="teaser-grid-container"]`

---

### TC-TG005: Verify Individual Teaser Cards Count and Structure
**Priority:** High  
**Type:** Functional  
**Tag:** @Functional @UKProd

**Description:**  
Verify that the correct number of individual teaser cards are rendered and each has proper structure.

**Prerequisites:**
- Teaser Grid is loaded
- Grid container is visible

**Test Steps:**
1. Navigate to Teaser Grid page
2. Locate all individual teasers with data-qa="individual-teaser"
3. Count the number of teaser cards
4. Verify each teaser is a section element
5. Verify each teaser has proper aria-label (e.g., "Teaser card 1")
6. Verify each teaser is visible
7. Verify each teaser contains an image element

**Expected Results:**
- Correct number of teaser cards displayed (3 in QA environment)
- Each teaser has data-qa="individual-teaser"
- Each teaser has meaningful aria-label
- All teasers are visible and properly structured

**Test Data:**
- Teaser selector: `[data-qa="individual-teaser"]`
- Expected count: 3 (minimum)
- Expected element type: `<section>`

---

### TC-TG006: Verify Teaser Images Display
**Priority:** High  
**Type:** Functional  
**Tag:** @Functional @UKProd

**Description:**  
Verify that images within each teaser card are properly loaded and displayed with correct accessibility attributes.

**Prerequisites:**
- Teaser cards are visible
- Network connection is available

**Test Steps:**
1. Navigate to Teaser Grid page
2. Locate all teaser images with data-qa="individual-teaser-image"
3. Verify image count matches teaser count
4. For each image:
   - Verify it is visible
   - Verify it has aria-label="Profile photo"
   - Verify it has loaded successfully
   - Verify src attribute is present
   - Verify alt attribute exists
5. Measure image loading time

**Expected Results:**
- All images are visible and loaded
- Each image has data-qa="individual-teaser-image"
- Each image has aria-label="Profile photo"
- Images have proper alt text
- Images load within acceptable time (< 3 seconds)

**Test Data:**
- Image selector: `[data-qa="individual-teaser-image"]`
- Expected aria-label: "Profile photo"
- Performance threshold: < 3000ms

---

### TC-TG007: Verify Responsive Grid Layout - XL Viewport
**Priority:** High  
**Type:** Functional  
**Tag:** @Functional @UKProd

**Description:**  
Verify that the Teaser Grid displays correctly on XL viewport (1440x900) with appropriate column layout.

**Prerequisites:**
- Browser supports viewport resizing
- Component is loaded

**Test Steps:**
1. Navigate to Teaser Grid page
2. Set viewport to XL (1440x900)
3. Wait for responsive adjustments
4. Verify grid container is visible
5. Verify teasers are displayed in grid layout
6. Check grid columns arrangement
7. Verify no horizontal scroll appears
8. Verify all teasers are visible without scrolling

**Expected Results:**
- Grid displays properly on XL viewport
- Teasers arranged in appropriate columns (likely 3 columns)
- No layout overflow or horizontal scroll
- All content is visible and accessible
- Spacing and gaps are consistent

**Test Data:**
- Viewport: 1440x900
- Expected layout: 3 columns (TBD based on design)

---

### TC-TG008: Verify Responsive Grid Layout - LG Viewport
**Priority:** High  
**Type:** Functional  
**Tag:** @Functional @UKProd

**Description:**  
Verify that the Teaser Grid adapts correctly to LG viewport (1024x768) with proper column adjustment.

**Prerequisites:**
- Component is loaded
- XL viewport test passed

**Test Steps:**
1. Navigate to Teaser Grid page
2. Set viewport to LG (1024x768)
3. Wait for responsive layout changes
4. Verify grid container adapts to new viewport
5. Verify column count adjusts appropriately
6. Verify teasers remain visible and properly sized
7. Check that no content is cut off

**Expected Results:**
- Grid adapts to LG viewport
- Column layout adjusts (likely 2-3 columns)
- All teasers remain visible
- Layout is balanced and aesthetically pleasing
- No horizontal scrolling required

**Test Data:**
- Viewport: 1024x768
- Expected layout: 2-3 columns

---

### TC-TG009: Verify Responsive Grid Layout - MD Viewport
**Priority:** High  
**Type:** Functional  
**Tag:** @Functional @UKProd

**Description:**  
Verify that the Teaser Grid displays correctly on MD viewport (768x1024) with tablet-appropriate layout.

**Prerequisites:**
- Component is responsive
- Previous viewport tests passed

**Test Steps:**
1. Navigate to Teaser Grid page
2. Set viewport to MD (768x1024)
3. Wait for layout recalculation
4. Verify grid adjusts to tablet layout
5. Check column count (likely 2 columns or single column)
6. Verify teasers stack appropriately
7. Verify touch-friendly spacing
8. Check vertical scrolling is available if needed

**Expected Results:**
- Grid adapts to MD tablet viewport
- Layout changes to 1-2 columns
- Touch targets are appropriately sized
- Content remains accessible
- Vertical scrolling works smoothly

**Test Data:**
- Viewport: 768x1024
- Expected layout: 1-2 columns

---

### TC-TG010: Verify Responsive Grid Layout - SM Viewport
**Priority:** High  
**Type:** Functional  
**Tag:** @Functional @UKProd

**Description:**  
Verify that the Teaser Grid displays correctly on SM viewport (375x667) with mobile-optimized layout.

**Prerequisites:**
- Component supports mobile layouts
- Responsive design is implemented

**Test Steps:**
1. Navigate to Teaser Grid page
2. Set viewport to SM (375x667)
3. Wait for mobile layout to render
4. Verify grid stacks to single column
5. Verify teasers are vertically stacked
6. Check touch target sizes are adequate
7. Verify no horizontal overflow
8. Test vertical scrolling

**Expected Results:**
- Grid displays in single-column mobile layout
- Teasers stack vertically
- Touch targets meet minimum size requirements (44x44px)
- No horizontal scrolling needed
- All content is accessible
- Mobile-friendly spacing and padding

**Test Data:**
- Viewport: 375x667
- Expected layout: Single column

---

### TC-TG011: Verify Teaser Card Click Interaction
**Priority:** High  
**Type:** Functional  
**Tag:** @Functional @UKProd

**Description:**  
Verify that individual teaser cards are clickable and provide appropriate interaction feedback.

**Prerequisites:**
- Teaser cards are visible
- Cards are interactive elements

**Test Steps:**
1. Navigate to Teaser Grid page
2. Hover over first teaser card
3. Verify hover state visual feedback
4. Click on the teaser card
5. Verify navigation or action occurs
6. Repeat for additional teaser cards
7. Verify consistent behavior across all cards

**Expected Results:**
- Teaser cards respond to hover events
- Visual feedback is provided on hover
- Cards are clickable
- Click action works consistently
- Navigation or modal appears as expected

**Test Data:**
- Teaser selector: `[data-qa="individual-teaser"]`
- Expected behavior: Navigation or content display

---

### TC-TG012: Verify Component Load Time
**Priority:** Medium  
**Type:** Performance  
**Tag:** @Performance @UKProd

**Description:**  
Measure and verify that the Teaser Grid component loads within acceptable performance thresholds.

**Prerequisites:**
- Network connection is stable
- Performance measurement tools are available

**Test Steps:**
1. Clear browser cache
2. Navigate to Teaser Grid page
3. Start performance timer
4. Wait for component to be fully loaded
5. Wait for all images to load
6. Stop timer when component is interactive
7. Record total load time
8. Verify load time is within threshold

**Expected Results:**
- Component loads within 5 seconds
- All images load within 3 seconds each
- Component is interactive without lag
- No performance warnings in console

**Test Data:**
- Performance threshold: < 5000ms for component
- Image threshold: < 3000ms per image

---

## VISUAL TEST CASES (FIGMA VALIDATION)

### TC-VTG001: Verify Title Typography - XL Viewport
**Priority:** High  
**Type:** Visual  
**Tag:** @Visual @UKProd

**Description:**  
Verify that the title component typography matches Figma specifications on XL viewport.

**Prerequisites:**
- Figma values are fetched and available
- Component is displayed on XL viewport

**Test Steps:**
1. Navigate to Teaser Grid page
2. Set viewport to XL (1440x900)
3. Locate title component with data-qa="title-component"
4. Extract computed styles for title
5. Compare font-family with Figma value
6. Compare font-size with Figma value
7. Compare font-weight with Figma value
8. Compare line-height with Figma value
9. Compare color with Figma value

**Expected Results:**
- Font family matches Figma (Bayer Sans)
- Font size matches Figma specification
- Font weight matches Figma specification
- Line height matches Figma specification
- Color matches Figma specification (rgba format)

**Test Data:**
- Viewport: 1440x900
- Element: `[data-qa="title-component"]`
- Figma Node ID: 6042:164548

---

### TC-VTG002: Verify Title Typography - LG Viewport
**Priority:** High  
**Type:** Visual  
**Tag:** @Visual @UKProd

**Description:**  
Verify that the title component typography matches Figma specifications on LG viewport.

**Prerequisites:**
- Figma values fetched for LG viewport
- Component renders on LG viewport

**Test Steps:**
1. Navigate to Teaser Grid page
2. Set viewport to LG (1024x768)
3. Locate title component
4. Extract computed styles
5. Compare with Figma LG specifications for:
   - font-family
   - font-size
   - font-weight
   - line-height
   - color

**Expected Results:**
- All typography values match Figma LG specifications
- Visual consistency is maintained

**Test Data:**
- Viewport: 1024x768
- Figma Node ID: 6042:164538

---

### TC-VTG003: Verify Title Typography - MD Viewport
**Priority:** High  
**Type:** Visual  
**Tag:** @Visual @UKProd

**Description:**  
Verify that the title component typography matches Figma specifications on MD viewport.

**Prerequisites:**
- Figma MD values are available
- Component displays on MD viewport

**Test Steps:**
1. Navigate to Teaser Grid page
2. Set viewport to MD (768x1024)
3. Extract title typography styles
4. Validate against Figma MD specifications

**Expected Results:**
- Typography matches Figma MD values
- Responsive typography scaling works correctly

**Test Data:**
- Viewport: 768x1024
- Figma Node ID: 6042:164532

---

### TC-VTG004: Verify Title Typography - SM Viewport
**Priority:** High  
**Type:** Visual  
**Tag:** @Visual @UKProd

**Description:**  
Verify that the title component typography matches Figma specifications on SM viewport.

**Prerequisites:**
- Figma SM values available
- Mobile viewport accessible

**Test Steps:**
1. Navigate to Teaser Grid page
2. Set viewport to SM (375x667)
3. Validate title typography against Figma SM specifications

**Expected Results:**
- Mobile typography matches Figma specifications
- Text remains readable on small screens

**Test Data:**
- Viewport: 375x667
- Figma Node ID: 6042:164609

---

### TC-VTG005: Verify Headline Text Typography - All Viewports
**Priority:** Medium  
**Type:** Visual  
**Tag:** @Visual @UKProd

**Description:**  
Verify that the headline text (stage-headline-text) typography matches Figma specifications across all viewports.

**Prerequisites:**
- Figma values fetched for all viewports
- Component is accessible

**Test Steps:**
1. For each viewport (XL, LG, MD, SM):
   - Set viewport size
   - Locate headline text with data-qa="stage-headline-text"
   - Extract computed styles
   - Validate font-family, font-size, font-weight, line-height, color
   - Compare with Figma specifications

**Expected Results:**
- Headline typography matches Figma for each viewport
- Consistent scaling across viewports
- Color and font family remain consistent

**Test Data:**
- Element: `[data-qa="stage-headline-text"]`
- Viewports: XL, LG, MD, SM

---

### TC-VTG006: Verify Intro Text Typography - All Viewports
**Priority:** Medium  
**Type:** Visual  
**Tag:** @Visual @UKProd

**Description:**  
Verify that the introduction text typography matches Figma specifications across all viewports.

**Prerequisites:**
- Figma values available
- Element is visible

**Test Steps:**
1. For each viewport (XL, LG, MD, SM):
   - Set viewport size
   - Locate intro text with data-qa="stage-intro-text"
   - Extract and validate typography styles
   - Compare with Figma values

**Expected Results:**
- Introduction text typography matches Figma specifications
- Responsive scaling is correct
- Readability is maintained across viewports

**Test Data:**
- Element: `[data-qa="stage-intro-text"]`
- Viewports: XL, LG, MD, SM

---

### TC-VTG007: Verify Grid Container Spacing and Layout
**Priority:** Medium  
**Type:** Visual  
**Tag:** @Visual @UKProd

**Description:**  
Verify that grid container spacing, gaps, and layout properties match Figma specifications.

**Prerequisites:**
- Figma layout values available
- Grid is rendered

**Test Steps:**
1. For each viewport:
   - Extract grid gap/spacing values
   - Verify padding and margins
   - Check column count and width
   - Validate against Figma specifications

**Expected Results:**
- Grid spacing matches Figma
- Gaps between teasers are consistent
- Layout measurements are accurate

**Test Data:**
- Element: `[data-qa="teaser-grid-container"]`
- Properties: grid-gap, padding, margin

---

### TC-VTG008: Verify Color Scheme Consistency
**Priority:** Medium  
**Type:** Visual  
**Tag:** @Visual @UKProd

**Description:**  
Verify that all text colors, background colors, and component colors match Figma specifications.

**Prerequisites:**
- Figma color values extracted
- Component fully rendered

**Test Steps:**
1. Extract colors for:
   - Title component
   - Headline text
   - Intro text
   - Background colors
2. Compare with Figma color specifications
3. Verify consistency across viewports

**Expected Results:**
- All colors match Figma specifications
- Color contrast meets WCAG standards
- Consistent color application

---

## ACCESSIBILITY TEST CASES

### TC-ATG001: Verify Semantic HTML Structure
**Priority:** High  
**Type:** Accessibility  
**Tag:** @Accessibility @UKProd

**Description:**  
Verify that the Teaser Grid uses proper semantic HTML elements for accessibility.

**Prerequisites:**
- Component is loaded
- Browser supports semantic HTML

**Test Steps:**
1. Navigate to Teaser Grid page
2. Verify main container is a section element
3. Verify title is an H2 element
4. Verify proper heading hierarchy
5. Verify teaser cards use section elements
6. Verify images use img elements with alt text
7. Run automated accessibility scan

**Expected Results:**
- Proper semantic HTML structure
- Heading hierarchy is logical
- All elements use appropriate tags
- No semantic HTML violations

**Test Data:**
- Expected structure: section > h2, section (teasers)

---

### TC-ATG002: Verify ARIA Labels and Attributes
**Priority:** High  
**Type:** Accessibility  
**Tag:** @Accessibility @UKProd

**Description:**  
Verify that all interactive elements have proper ARIA labels and attributes for screen readers.

**Prerequisites:**
- Component is accessible
- ARIA attributes are implemented

**Test Steps:**
1. Navigate to component page
2. Verify title has aria-label="title-component"
3. Verify each teaser has aria-label="Teaser card {number}"
4. Verify images have aria-label="Profile photo"
5. Verify no missing or incorrect ARIA labels
6. Test with screen reader (if available)

**Expected Results:**
- All elements have appropriate ARIA labels
- Labels are meaningful and descriptive
- Screen reader announces elements correctly
- No ARIA violations detected

**Test Data:**
- Title: aria-label="title-component"
- Teasers: aria-label="Teaser card 1", "Teaser card 2", etc.
- Images: aria-label="Profile photo"

---

### TC-ATG003: Verify Keyboard Navigation Support
**Priority:** High  
**Type:** Accessibility  
**Tag:** @Accessibility @UKProd

**Description:**  
Verify that the Teaser Grid component supports full keyboard navigation.

**Prerequisites:**
- Component is interactive
- Keyboard events are supported

**Test Steps:**
1. Navigate to Teaser Grid page
2. Use Tab key to navigate through component
3. Verify focus moves to each teaser card
4. Verify focus indicators are visible
5. Press Enter on focused teaser to activate
6. Use Shift+Tab to navigate backwards
7. Verify focus order is logical
8. Test Escape key if applicable

**Expected Results:**
- All interactive elements are keyboard accessible
- Tab order is logical and intuitive
- Focus indicators are clearly visible
- Enter key activates focused elements
- No keyboard traps exist

---

### TC-ATG004: Verify Color Contrast Compliance
**Priority:** High  
**Type:** Accessibility  
**Tag:** @Accessibility @UKProd

**Description:**  
Verify that all text and interactive elements meet WCAG 2.1 AA color contrast requirements.

**Prerequisites:**
- Component is rendered
- Color contrast tool is available

**Test Steps:**
1. Navigate to component page
2. Measure color contrast for:
   - Title text
   - Headline text
   - Intro text
   - Any overlay text on images
3. Verify contrast ratios meet WCAG AA standards
4. Test against different backgrounds
5. Run automated contrast checker

**Expected Results:**
- Normal text has contrast ratio >= 4.5:1
- Large text has contrast ratio >= 3:1
- All text meets WCAG AA standards
- No contrast violations detected

**Test Data:**
- WCAG AA requirement: 4.5:1 for normal text
- WCAG AA requirement: 3:1 for large text (18pt+)

---

### TC-ATG005: Verify Screen Reader Compatibility
**Priority:** High  
**Type:** Accessibility  
**Tag:** @Accessibility @UKProd

**Description:**  
Verify that the Teaser Grid component is fully compatible with screen readers.

**Prerequisites:**
- Screen reader software available (NVDA, JAWS, or VoiceOver)
- Component is loaded

**Test Steps:**
1. Navigate to component with screen reader active
2. Verify screen reader announces component structure
3. Verify title is read correctly
4. Verify teaser cards are announced with proper labels
5. Verify images have meaningful alt text announced
6. Navigate through component using screen reader controls
7. Verify no content is skipped or inaccessible

**Expected Results:**
- Screen reader announces all content correctly
- Navigation flow is logical
- All images have descriptive alt text
- No accessibility barriers detected
- Component is fully usable with screen reader

---

### TC-ATG006: Verify Focus Management
**Priority:** Medium  
**Type:** Accessibility  
**Tag:** @Accessibility @UKProd

**Description:**  
Verify that focus is properly managed when interacting with the Teaser Grid component.

**Prerequisites:**
- Component supports focus management
- Interactive elements exist

**Test Steps:**
1. Navigate to component page
2. Tab to first teaser card
3. Verify focus is visible with clear indicator
4. Click on a teaser
5. Verify focus management after interaction
6. Test focus restoration if applicable
7. Verify no focus is lost during interactions

**Expected Results:**
- Focus is always visible
- Focus indicators meet contrast requirements
- Focus is managed properly during interactions
- Focus restoration works correctly
- No focus loss during component updates

---

### TC-ATG007: Run Axe Core Accessibility Scan
**Priority:** High  
**Type:** Accessibility  
**Tag:** @Accessibility @UKProd

**Description:**  
Run automated accessibility scan using Axe Core to detect any WCAG violations.

**Prerequisites:**
- Axe Core is integrated
- Component is fully rendered

**Test Steps:**
1. Navigate to Teaser Grid page
2. Wait for component to load completely
3. Run Axe Core accessibility scan
4. Analyze violations by severity
5. Verify no critical or serious violations
6. Document any moderate or minor issues

**Expected Results:**
- Zero critical accessibility violations
- Zero serious violations
- Minimal moderate violations (if any)
- All violations have context and remediation plans
- Component meets WCAG 2.1 AA standards

**Test Data:**
- Tool: @axe-core/playwright
- Standard: WCAG 2.1 AA

---

## PERFORMANCE TEST CASES

### TC-PTG001: Measure Component Initial Load Time
**Priority:** Medium  
**Type:** Performance  
**Tag:** @Performance @UKProd

**Description:**  
Measure the time taken for the Teaser Grid component to render and become interactive.

**Prerequisites:**
- Network is stable
- Performance API is available

**Test Steps:**
1. Clear browser cache
2. Navigate to Teaser Grid page
3. Measure time from navigation start to component visible
4. Record time to interactive
5. Verify load time is within threshold
6. Repeat test 3 times and average results

**Expected Results:**
- Component visible within 2 seconds
- Component interactive within 3 seconds
- Consistent performance across test runs
- No performance degradation

**Test Data:**
- Threshold: < 3000ms to interactive
- Expected: < 2000ms for first render

---

### TC-PTG002: Measure Image Loading Performance
**Priority:** Medium  
**Type:** Performance  
**Tag:** @Performance @UKProd

**Description:**  
Measure the time taken for all teaser images to load completely.

**Prerequisites:**
- Network connection is available
- Images are hosted and accessible

**Test Steps:**
1. Navigate to Teaser Grid page
2. Start timer when page loads
3. Wait for all images to be fully loaded
4. Record load time for each image
5. Calculate average load time
6. Verify total load time is acceptable

**Expected Results:**
- Individual images load within 2 seconds
- All images load within 5 seconds total
- No broken image links
- Progressive loading works correctly

**Test Data:**
- Per image threshold: < 2000ms
- Total threshold: < 5000ms

---

### TC-PTG003: Measure Viewport Resize Performance
**Priority:** Low  
**Type:** Performance  
**Tag:** @Performance @UKProd

**Description:**  
Measure performance impact when resizing viewport and triggering responsive layout changes.

**Prerequisites:**
- Component is loaded
- Viewports can be changed

**Test Steps:**
1. Load component on XL viewport
2. Start performance timer
3. Resize to SM viewport
4. Measure time for layout recalculation
5. Verify smooth transition
6. Test reverse (SM to XL)
7. Measure performance impact

**Expected Results:**
- Layout recalculation within 500ms
- Smooth visual transition
- No layout shift or jank
- Responsive design performs well

**Test Data:**
- Threshold: < 500ms for layout recalc
- No visible jank or stuttering

---

## REQUIREMENT-SPECIFIC TEST CASES (User Story 2053)

### TC-TG013: Verify Highlight Text with Color Gradient (AC4)
**Priority:** High  
**Type:** Functional, Visual  
**Tag:** @Functional @Visual @UKProd

**Description:**  
Verify that when Highlight Text matches text within the Title, the highlighted portion displays with a color gradient on the frontend.

**Prerequisites:**
- Teaser Grid component has Title configured
- Highlight Text is configured to match portion of Title

**Test Steps:**
1. Navigate to Teaser Grid component
2. Locate title component with data-qa="title-component"
3. Extract full title text content
4. Identify highlighted text elements (span, mark, strong, em)
5. Verify highlighted elements have gradient background or special color
6. Verify gradient styling is applied via background-image CSS
7. Compare with non-highlighted text styling

**Expected Results:**
- Highlighted text elements are identified
- Gradient background-image CSS is present
- Visual distinction from regular text
- Color gradient matches design specifications

**Test Data:**
- Expected gradient pattern in CSS
- Background-image contains "gradient" keyword

---

### TC-TG014: Verify Image Aspect Ratio - XL Viewport (16:9)
**Priority:** High  
**Type:** Visual  
**Tag:** @Visual @UKProd

**Description:**  
Verify that teaser images maintain 16:9 aspect ratio on XL viewport as per User Story 2053.

**Test Steps:**
1. Set viewport to XL (1440x900)
2. Wait for images to load
3. Measure all image dimensions
4. Calculate aspect ratios
5. Verify ratios match 16:9

**Expected Results:**
- All images have 16:9 aspect ratio
- Ratio approximately 1.778
- Tolerance: ±0.1

---

### TC-TG015: Verify Image Aspect Ratio - LG Viewport (1:1)
**Priority:** High  
**Type:** Visual  
**Tag:** @Visual @UKProd

**Description:**  
Verify teaser images maintain 1:1 square aspect ratio on LG viewport.

**Expected Results:**
- Images have 1:1 aspect ratio
- Square appearance
- Tolerance: ±0.05

---

### TC-TG016-17: Verify Image Aspect Ratio - MD/SM Viewports (2:3)
**Priority:** High  
**Type:** Visual  
**Tag:** @Visual @UKProd

**Description:**  
Verify teaser images maintain 2:3 portrait aspect ratio on MD and SM viewports.

**Expected Results:**
- Images have 2:3 portrait ratio (0.667)
- Tolerance: ±0.1

---

### TC-TG018: Verify Two Teasers Per Row Layout
**Priority:** High  
**Type:** Functional  
**Tag:** @Functional @UKProd

**Description:**  
Verify teasers display in rows with two items per row.

**Expected Results:**
- Two teasers per row
- Horizontal alignment maintained
- Second teaser right of first

---

### TC-TG019: Verify Second Teaser Vertical Offset
**Priority:** High  
**Type:** Visual  
**Tag:** @Visual @UKProd

**Description:**  
Verify second teaser has vertical offset for visual interest.

**Expected Results:**
- Positive vertical offset (0-150px)
- Staggered visual effect

---

## Test Case Summary

| Category | Test Cases | Priority High | Priority Medium | Priority Low |
|----------|-----------|---------------|-----------------|--------------|
| Functional | 14 | 12 | 2 | 0 |
| Visual | 13 | 9 | 4 | 0 |
| Accessibility | 7 | 6 | 1 | 0 |
| Performance | 3 | 0 | 2 | 1 |
| **Total** | **37** | **27** | **9** | **1** |

## Test Execution Notes

1. All tests should use soft assertions to prevent premature termination
2. Visual tests require Figma values to be fetched before execution
3. Accessibility tests should be run on multiple browsers
4. Performance tests should be run with cleared cache
5. All viewport tests must verify responsiveness

## Traceability Matrix

| Test Case ID | User Story | Acceptance Criteria | Status |
|-------------|------------|---------------------|---------|
| TC-TG001-TC-TG012 | 2053 | Functional Requirements | Ready |
| TC-VTG001-TC-VTG008 | 2053 | Visual Requirements | Ready |
| TC-ATG001-TC-ATG007 | 2053 | Accessibility Requirements | Ready |
| TC-PTG001-TC-PTG003 | 2053 | Performance Requirements | Ready |

## Notes

- DOM inspection completed on: 2026-01-17
- Test page URL: https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Sprint-9/TeaserGrid
- Figma Node IDs provided for visual validation
- All data-qa attributes verified through live DOM inspection

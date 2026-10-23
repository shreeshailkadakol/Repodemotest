# QuoteCarousel Component - Test Cases Documentation

**Component Name:** QuoteCarousel  
**Requirement ID:** User Story 1588  
**Test Page URL:** https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Sprint10/QuoteCarousel  
**Created:** January 13, 2026  
**Status:** ✅ **READY FOR REVIEW**

## Requirements Traceability Matrix

| **Acceptance Criteria** | **Test Cases** | **Coverage** |
|-------------------------|---------------|--------------|
| **AC1:** Content Editor can create/edit/delete Quote Carousel | N/A (CMS functionality) | Not in scope for FE testing |
| **AC2:** Component placement in content divider | N/A (CMS functionality) | Not in scope for FE testing |
| **AC3:** Edit Quote slides individually | TC-QC-001, TC-QC-005 | ✅ Functional |
| **AC4:** Edit Quote instance settings | TC-QC-002, TC-QC-003, TC-QC-004 | ✅ Functional |
| **AC5:** Arrow navigation functionality | TC-QC-006, TC-QC-007, TC-QC-008 | ✅ Functional |
| **AC6:** Keyboard navigation support | TC-QC-020, TC-QC-021, TC-QC-022 | ✅ Accessibility |
| **AC7:** Touch device swipe gesture support | TC-QC-026, TC-QC-027 | ✅ Performance |
| **AC8:** System-wide aria labels | TC-QC-023, TC-QC-024, TC-QC-025 | ✅ Accessibility |

---

## 🔧 FUNCTIONAL TEST CASES

### TC-QC-001: Quote Carousel Component Visibility
**Priority:** High | **Tags:** `@Functional` | **Requirement:** AC3

**Test Steps:**
1. Navigate to QuoteCarousel test page
2. Accept cookie banner
3. Verify main carousel container is visible
4. Verify carousel has multiple quote slides

**Expected Results:**
- Main container `[data-qa="quotes-carousel"]` is visible
- At least 2 quote slides are present
- Component loads without errors

**Test Data:** N/A  
**Prerequisites:** Authentication completed

---

### TC-QC-002: Quote Text Content Validation
**Priority:** High | **Tags:** `@Functional` | **Requirement:** AC4

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Locate first quote slide
3. Verify quote text is present and visible
4. Verify text contains quote marks or blockquote structure
5. Verify content is not empty

**Expected Results:**
- Quote text is visible within `quote-component` context
- Text content is meaningful (>10 characters)
- Proper quote formatting (blockquote or quotation marks)
- Content is language-agnostic validated

**Test Data:** Quote text content  
**Prerequisites:** Component loaded successfully

---

### TC-QC-003: Author Information Validation
**Priority:** High | **Tags:** `@Functional` | **Requirement:** AC4

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Locate author information elements
3. Verify author name is present (`cite` element)
4. Verify author designation is present
5. Verify author image is loaded

**Expected Results:**
- Author name exists in `cite` element
- Author designation text is visible
- Author image `[data-qa="author-image"]` loads successfully
- Image has proper alt attribute for accessibility

**Test Data:** Dr. Dominik Ruettinger, Global Head of Oncology Research  
**Prerequisites:** Quote slide is visible

---

### TC-QC-004: Author Image Properties Validation
**Priority:** Medium | **Tags:** `@Functional` | **Requirement:** AC4

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Locate author image element
3. Verify image has proper data attributes
4. Verify image source is valid
5. Verify responsive sizing classes

**Expected Results:**
- Image has `data-qa="author-image"` attribute
- Image has `aria-label="Author photo"` attribute
- Image src attribute is not empty
- Responsive classes present (h-16 w-16 md:h-24 md:w-24)

**Test Data:** Author image properties  
**Prerequisites:** Component rendered

---

### TC-QC-005: Multiple Quote Slides Validation
**Priority:** High | **Tags:** `@Functional` | **Requirement:** AC3

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Count total number of quote slides
3. Verify each slide has quote-slide data attribute
4. Verify each slide contains quote component
5. Verify slides are properly structured

**Expected Results:**
- Multiple slides with `[data-qa="quote-slide"]` are present
- Each slide contains `[data-qa="quote-component"]`
- Each slide has proper parent-child structure
- Slides contain complete quote content

**Test Data:** Expected: 5 slides  
**Prerequisites:** Carousel loaded

---

### TC-QC-006: Next Navigation Button Functionality
**Priority:** High | **Tags:** `@Functional` | **Requirement:** AC5

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Locate next navigation button
3. Click next button
4. Verify slide transition occurs
5. Verify current slide indicator updates

**Expected Results:**
- Next button `[aria-label="Next quote"]` is clickable
- Slide content changes on click
- Pagination indicator reflects new position
- Navigation works smoothly without errors

**Test Data:** N/A  
**Prerequisites:** Multiple slides present

---

### TC-QC-007: Previous Navigation Button Functionality
**Priority:** High | **Tags:** `@Functional` | **Requirement:** AC5

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Navigate to second slide (using next button)
3. Locate previous navigation button
4. Click previous button
5. Verify slide returns to first position

**Expected Results:**
- Previous button `[aria-label="Previous quote"]` is clickable
- Slide transitions backward correctly
- Pagination indicator updates appropriately
- Button is disabled/dimmed when on first slide

**Test Data:** N/A  
**Prerequisites:** On second or later slide

---

### TC-QC-008: Pagination Indicators Functionality
**Priority:** Medium | **Tags:** `@Functional` | **Requirement:** AC5

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Locate pagination indicators
3. Click on second slide indicator
4. Verify direct navigation to slide 2
5. Verify current state indicator

**Expected Results:**
- Pagination buttons `[aria-label*="Go to slide"]` are clickable
- Direct navigation to specific slides works
- Current slide indicator shows active state
- Proper aria-label indicates current slide

**Test Data:** Slide indicators  
**Prerequisites:** Multiple slides and indicators visible

---

### TC-QC-009: Edge Case - First Slide Navigation
**Priority:** Medium | **Tags:** `@Functional` | **Requirement:** AC5

**Test Steps:**
1. Navigate to QuoteCarousel component (should start on slide 1)
2. Attempt to click previous button
3. Verify appropriate handling
4. Verify current position remains on slide 1

**Expected Results:**
- Previous button is disabled/non-functional on first slide
- No error occurs when clicking disabled previous
- Position indicator remains on slide 1
- User experience is intuitive

**Test Data:** N/A  
**Prerequisites:** Carousel on first slide

---

### TC-QC-010: Edge Case - Last Slide Navigation
**Priority:** Medium | **Tags:** `@Functional` | **Requirement:** AC5

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Navigate to last slide using next button
3. Attempt to click next button again
4. Verify appropriate handling

**Expected Results:**
- Next button is disabled/non-functional on last slide
- No error occurs when clicking disabled next
- Position remains on last slide
- Navigation wraps around OR stops appropriately

**Test Data:** N/A  
**Prerequisites:** Carousel on last slide

---

## ♿ ACCESSIBILITY TEST CASES

### TC-QC-020: Keyboard Navigation Support
**Priority:** High | **Tags:** `@Accessibility` | **Requirement:** AC6, WCAG 2.1 AA

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Use Tab key to focus navigation elements
3. Use Enter/Space to activate buttons
4. Use arrow keys for slide navigation (if supported)
5. Verify focus indicators are visible

**Expected Results:**
- All interactive elements are keyboard focusable
- Tab order is logical (left to right, top to bottom)
- Enter/Space activates navigation buttons
- Focus indicators are clearly visible
- No keyboard traps exist

**Test Data:** Keyboard inputs: Tab, Enter, Space, Arrow keys  
**Prerequisites:** Component loaded, keyboard available

---

### TC-QC-021: Screen Reader Compatibility
**Priority:** High | **Tags:** `@Accessibility` | **Requirement:** AC8, WCAG 2.1 AA

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Verify aria-labels are present on navigation
3. Verify semantic HTML structure
4. Verify quote content is readable
5. Test with screen reader simulation

**Expected Results:**
- All buttons have descriptive aria-labels
- Carousel container has appropriate aria-label
- Quote content uses semantic HTML (blockquote, cite)
- Screen reader can navigate and understand content
- Current slide position is announced

**Test Data:** Aria-label values  
**Prerequisites:** Accessibility testing tools available

---

### TC-QC-022: Focus Management During Navigation
**Priority:** Medium | **Tags:** `@Accessibility` | **Requirement:** AC6, WCAG 2.1 AA

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Focus on next button using Tab
3. Press Enter to navigate to next slide
4. Verify focus remains manageable
5. Test focus after slide transitions

**Expected Results:**
- Focus is maintained or logically moved after navigation
- Focus does not disappear into hidden elements
- User can continue keyboard navigation naturally
- Focus indicators remain visible during transitions

**Test Data:** N/A  
**Prerequisites:** Keyboard navigation working

---

### TC-QC-023: Aria-Label Validation for Navigation Controls
**Priority:** Medium | **Tags:** `@Accessibility` | **Requirement:** AC8, WCAG 2.1 AA

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Inspect previous button aria-label
3. Inspect next button aria-label
4. Inspect pagination indicators aria-labels
5. Verify labels are descriptive and accurate

**Expected Results:**
- Previous button: aria-label="Previous quote"
- Next button: aria-label="Next quote"  
- Pagination: aria-label="Go to slide X" or "Go to slide X (current)"
- Labels accurately describe button function
- Labels update when state changes

**Test Data:** Expected aria-label values  
**Prerequisites:** Navigation controls visible

---

### TC-QC-024: Semantic HTML Structure Validation
**Priority:** Medium | **Tags:** `@Accessibility` | **Requirement:** AC8, WCAG 2.1 AA

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Verify blockquote elements are used for quotes
3. Verify cite elements are used for attribution
4. Verify heading hierarchy (if any)
5. Verify proper sectioning elements

**Expected Results:**
- Quote text uses `<blockquote>` element
- Author names use `<cite>` element
- Proper semantic markup throughout
- No heading hierarchy violations
- Appropriate sectioning (div, section) elements

**Test Data:** HTML tag validation  
**Prerequisites:** Component loaded

---

### TC-QC-025: Color Contrast and Visual Accessibility
**Priority:** Medium | **Tags:** `@Accessibility` | **Requirement:** WCAG 2.1 AA

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Verify text color contrast ratios
3. Verify navigation button visibility
4. Test with high contrast mode
5. Verify focus indicators meet contrast requirements

**Expected Results:**
- Quote text has minimum 4.5:1 contrast ratio
- Author information has minimum 4.5:1 contrast ratio
- Navigation controls have sufficient contrast
- Component works in high contrast mode
- Focus indicators meet 3:1 minimum contrast

**Test Data:** Color contrast measurements  
**Prerequisites:** Color testing tools available

---

## ⚡ PERFORMANCE TEST CASES

### TC-QC-026: Carousel Initialization Performance
**Priority:** Medium | **Tags:** `@Performance` | **Requirement:** General performance

**Test Steps:**
1. Navigate to QuoteCarousel test page
2. Measure time from page load to carousel interactivity
3. Verify smooth initial rendering
4. Check for layout shifts during loading
5. Measure resource loading times

**Expected Results:**
- Carousel becomes interactive within 2 seconds
- No visible layout shifts during initialization
- Images load progressively without blocking
- Total initialization time < 3 seconds
- CPU usage remains reasonable during load

**Test Data:** Performance metrics thresholds  
**Prerequisites:** Performance monitoring tools

---

### TC-QC-027: Slide Transition Performance
**Priority:** Medium | **Tags:** `@Performance` | **Requirement:** AC7, smooth UX

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Measure slide transition duration
3. Test rapid consecutive clicks
4. Monitor frame rate during transitions
5. Test on slower devices/connections

**Expected Results:**
- Slide transitions complete within 500ms
- Smooth 60fps animation during transitions
- No performance degradation with rapid clicks
- Transitions work on slower devices
- Memory usage stays stable during navigation

**Test Data:** Timing thresholds  
**Prerequisites:** Performance monitoring

---

### TC-QC-028: Touch/Swipe Gesture Performance
**Priority:** Medium | **Tags:** `@Performance` | **Requirement:** AC7

**Test Steps:**
1. Navigate to QuoteCarousel on touch device
2. Test swipe gesture responsiveness
3. Measure touch input to transition delay
4. Test various swipe speeds
5. Verify gesture recognition accuracy

**Expected Results:**
- Swipe gestures recognized within 100ms
- Smooth transition follows swipe direction
- Touch feedback is immediate
- Works with various swipe speeds and distances
- No accidental triggers from scroll gestures

**Test Data:** Touch gesture timing  
**Prerequisites:** Touch device or simulation

---

### TC-QC-029: Memory Usage During Extended Navigation
**Priority:** Low | **Tags:** `@Performance` | **Requirement:** General stability

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Perform 50+ navigation actions
3. Monitor memory consumption
4. Check for memory leaks
5. Verify cleanup after navigation

**Expected Results:**
- Memory usage remains stable over time
- No significant memory leaks detected
- Garbage collection works effectively
- Performance doesn't degrade with extended use
- Resource cleanup occurs properly

**Test Data:** Memory usage baselines  
**Prerequisites:** Memory monitoring tools

---

## 🎨 VISUAL TEST CASES

### TC-QC-030: XL Viewport Visual Validation
**Priority:** High | **Tags:** `@Visual` | **Requirement:** Responsive design (1280px+)

**Test Steps:**
1. Set viewport to XL size (1920x1080)
2. Navigate to QuoteCarousel component
3. Verify quote text styling matches Figma XL design
4. Verify author image sizing (24x24 expected)
5. Verify navigation controls positioning

**Expected Results:**
- Quote text: font-size XL (to be verified with Figma)
- Quote text: gradient color matches design
- Author image: 24x24px (md:h-24 md:w-24)
- Navigation controls properly positioned
- Overall layout matches XL Figma design

**Test Data:** Figma XL design (node-id=3276-7022)  
**Prerequisites:** Figma values extracted

---

### TC-QC-031: LG Viewport Visual Validation
**Priority:** High | **Tags:** `@Visual` | **Requirement:** Responsive design (1024px+)

**Test Steps:**
1. Set viewport to LG size (1024x768)
2. Navigate to QuoteCarousel component
3. Verify quote text styling matches Figma LG design
4. Verify author image sizing adjusts appropriately
5. Verify responsive layout changes

**Expected Results:**
- Quote text: font-size LG (to be verified with Figma)
- Layout adjusts for smaller screen
- Author image sizing appropriate for LG
- Navigation remains functional
- Design matches LG Figma specifications

**Test Data:** Figma LG design (node-id=3276-7047)  
**Prerequisites:** Figma values extracted

---

### TC-QC-032: MD Viewport Visual Validation
**Priority:** High | **Tags:** `@Visual` | **Requirement:** Responsive design (768px+)

**Test Steps:**
1. Set viewport to MD size (768x1024)
2. Navigate to QuoteCarousel component
3. Verify mobile adaptation of quote text
4. Verify author image sizing (16x16 expected)
5. Verify navigation controls adapt to mobile

**Expected Results:**
- Quote text: font-size MD (to be verified with Figma)
- Author image: 16x16px (h-16 w-16)
- Navigation controls remain accessible on mobile
- Layout is optimized for tablet/mobile
- Matches MD Figma design specifications

**Test Data:** Figma MD design (node-id=3276-7072)  
**Prerequisites:** Figma values extracted

---

### TC-QC-033: SM Viewport Visual Validation
**Priority:** High | **Tags:** `@Visual` | **Requirement:** Responsive design (640px+)

**Test Steps:**
1. Set viewport to SM size (375x667)
2. Navigate to QuoteCarousel component
3. Verify mobile-first quote text styling
4. Verify compact layout works
5. Verify touch-friendly navigation

**Expected Results:**
- Quote text: font-size SM (to be verified with Figma)
- Compact layout without horizontal scroll
- Touch targets are minimum 44px
- All content remains accessible
- Matches SM Figma design specifications

**Test Data:** Figma SM design (node-id=3276-7097)  
**Prerequisites:** Figma values extracted

---

### TC-QC-034: Quote Text Typography Validation
**Priority:** Medium | **Tags:** `@Visual` | **Requirement:** Typography consistency

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Extract quote text font properties
3. Verify font-family matches design system
4. Verify line-height across viewports
5. Verify gradient color application

**Expected Results:**
- Font-family: matches design system specification
- Font-weight: bold (as seen in DOM classes)
- Line-height: responsive (2xl-tight to 5xl-tight)
- Gradient: from-gradient-display-text-2 to-gradient-display-text-1
- Typography is consistent across viewports

**Test Data:** Figma typography specifications  
**Prerequisites:** Figma font values extracted

---

### TC-QC-035: Author Information Typography Validation
**Priority:** Medium | **Tags:** `@Visual` | **Requirement:** Typography consistency

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Extract author name styling (cite element)
3. Extract author designation styling
4. Verify text color matches design (text-muted)
5. Verify font sizes are consistent

**Expected Results:**
- Author name: font-size lg, font-weight bold, not-italic
- Author designation: font-size lg, color text-muted
- Line-height: leading-lg for both elements
- Colors match design system text-muted specification
- Typography hierarchy is clear

**Test Data:** Figma text specifications  
**Prerequisites:** Design system values available

---

### TC-QC-036: Navigation Controls Visual Validation
**Priority:** Medium | **Tags:** `@Visual` | **Requirement:** Interactive element design

**Test Steps:**
1. Navigate to QuoteCarousel component
2. Verify navigation button styling
3. Verify pagination indicator styling
4. Test hover states
5. Verify active/inactive states

**Expected Results:**
- Navigation buttons have proper sizing and padding
- Pagination indicators show clear active/inactive states
- Hover effects work smoothly
- Focus states are visually distinct
- Colors and states match design specifications

**Test Data:** Interactive states design  
**Prerequisites:** Interaction design specifications

---

### TC-QC-037: Cross-Browser Visual Consistency
**Priority:** Medium | **Tags:** `@Visual` | **Requirement:** Browser compatibility

**Test Steps:**
1. Test QuoteCarousel in Chrome
2. Test in Firefox
3. Test in Safari (if available)
4. Test in Edge
5. Compare visual rendering across browsers

**Expected Results:**
- Carousel appears identical across browsers
- Typography renders consistently
- Colors and gradients display correctly
- Navigation works uniformly
- No browser-specific visual bugs

**Test Data:** Browser compatibility matrix  
**Prerequisites:** Multiple browser access

---

## 🔗 CROSS-BROWSER TEST CASES

### TC-QC-040: Chrome Browser Compatibility
**Priority:** High | **Tags:** `@CrossBrowser` | **Requirement:** Browser support

**Test Steps:**
1. Open QuoteCarousel in Chrome
2. Verify full functionality
3. Test all navigation features
4. Verify visual appearance
5. Test responsive behavior

**Expected Results:**
- All features work in Chrome
- Visual design matches specifications
- Performance is optimal
- No Chrome-specific issues

**Test Data:** Chrome version compatibility  
**Prerequisites:** Chrome browser available

---

### TC-QC-041: Firefox Browser Compatibility
**Priority:** Medium | **Tags:** `@CrossBrowser` | **Requirement:** Browser support

**Test Steps:**
1. Open QuoteCarousel in Firefox
2. Verify functionality parity with Chrome
3. Test navigation and interactions
4. Verify visual consistency
5. Check for Firefox-specific issues

**Expected Results:**
- Feature parity with Chrome
- Visual consistency maintained
- No Firefox-specific bugs
- Performance remains acceptable

**Test Data:** Firefox compatibility requirements  
**Prerequisites:** Firefox browser available

---

### TC-QC-042: Edge Browser Compatibility
**Priority:** Medium | **Tags:** `@CrossBrowser` | **Requirement:** Browser support

**Test Steps:**
1. Open QuoteCarousel in Edge
2. Verify complete functionality
3. Test interaction behaviors
4. Verify visual rendering
5. Check performance characteristics

**Expected Results:**
- Full compatibility with Edge
- Visual and functional consistency
- No Edge-specific issues
- Acceptable performance metrics

**Test Data:** Edge compatibility matrix  
**Prerequisites:** Edge browser available

---

## 📱 RESPONSIVE TEST CASES

### TC-QC-050: Responsive Breakpoint Transitions
**Priority:** High | **Tags:** `@Responsive` | **Requirement:** Responsive design

**Test Steps:**
1. Start at XL viewport (1920px)
2. Gradually resize to LG (1024px)
3. Continue to MD (768px)
4. Finish at SM (375px)
5. Verify smooth transitions at each breakpoint

**Expected Results:**
- Smooth visual transitions at each breakpoint
- No content overflow or cutoff
- Navigation remains accessible at all sizes
- Typography scales appropriately
- Component maintains usability

**Test Data:** Breakpoint specifications  
**Prerequisites:** Responsive testing tools

---

### TC-QC-051: Mobile Device Orientation Testing
**Priority:** Medium | **Tags:** `@Responsive` | **Requirement:** Mobile optimization

**Test Steps:**
1. Load QuoteCarousel on mobile device
2. Test in portrait orientation
3. Rotate to landscape orientation
4. Verify layout adaptation
5. Test navigation in both orientations

**Expected Results:**
- Component adapts to orientation changes
- Navigation remains accessible
- Content fits screen in both orientations
- No horizontal scrolling required
- Touch targets remain appropriate size

**Test Data:** Mobile device specifications  
**Prerequisites:** Mobile device or emulation

---

## 📊 Test Case Summary

| **Category** | **Test Cases** | **Priority Distribution** |
|-------------|---------------|------------------------|
| **Functional** | TC-QC-001 to TC-QC-010 | High: 7, Medium: 3 |
| **Accessibility** | TC-QC-020 to TC-QC-025 | High: 3, Medium: 3 |
| **Performance** | TC-QC-026 to TC-QC-029 | Medium: 3, Low: 1 |
| **Visual** | TC-QC-030 to TC-QC-037 | High: 4, Medium: 4 |
| **Cross-Browser** | TC-QC-040 to TC-QC-042 | High: 1, Medium: 2 |
| **Responsive** | TC-QC-050 to TC-QC-051 | High: 1, Medium: 1 |
| **TOTAL** | **31 Test Cases** | **High: 16, Medium: 14, Low: 1** |

## 🏷️ Test Tags Summary

- `@Functional`: Core functionality testing
- `@Accessibility`: WCAG 2.1 AA compliance
- `@Performance`: Loading and interaction performance
- `@Visual`: Design and responsive validation
- `@CrossBrowser`: Multi-browser compatibility
- `@Responsive`: Viewport and device adaptation

## 📋 Implementation Notes

### **Test Prerequisites:**
1. **Authentication:** Two-step authentication (Vercel + username/password)
2. **Cookie Acceptance:** Required for proper component interaction
3. **Figma Values:** Must be extracted for visual test validation
4. **Performance Tools:** Required for performance test execution

### **Key Testing Strategies:**
1. **Language-Agnostic Approach:** All assertions avoid content-dependent validation
2. **Parent-Child Locators:** Use data-qa attributes with hierarchical relationships
3. **Soft Assertions:** All validations use soft assertions to prevent test termination
4. **Responsive Testing:** Comprehensive viewport coverage (XL, LG, MD, SM)

### **Coverage Completeness:**
✅ **All AC Requirements Covered**  
✅ **Multi-Viewport Responsive Testing**  
✅ **WCAG 2.1 AA Accessibility Compliance**  
✅ **Performance and UX Validation**  
✅ **Cross-Browser Compatibility**

---

**Test Cases Status:** ✅ **READY FOR REVIEW**  
**Total Coverage:** 31 comprehensive test cases  
**Next Step:** User review and approval before script implementation

**❓ Please review these test cases and approve before I proceed to Step 5 (Generate test scripts with Figma values).**
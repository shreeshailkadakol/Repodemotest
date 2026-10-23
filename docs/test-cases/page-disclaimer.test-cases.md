# Page Disclaimer Component - Test Cases

**Component:** Page Disclaimer  
**Test Page URL:** https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Page-Disclaimer  
**Date Created:** November 20, 2025  
**Status:** Ready for Implementation  
**Requirements:** AC4, AC5, AC6, AC7  

## Traceability Matrix

| Test Case ID | Requirement | Test Type | Priority | Status |
|--------------|-------------|-----------|----------|---------|
| TC-PD01 | AC4 | Functional | High | Ready |
| TC-PD02 | AC5 | Functional | High | Ready |
| TC-PD03 | AC6 | Functional | High | Ready |
| TC-PD04 | AC7 | Functional | High | Ready |
| TC-PD05 | UI/UX | Functional | Medium | Ready |
| TC-PD06 | Responsive | Functional | Medium | Ready |
| TC-PD07 | N/A | Visual | High | Ready |
| TC-PD08 | N/A | Visual | High | Ready |
| TC-PD09 | N/A | Visual | High | Ready |
| TC-PD10 | N/A | Visual | High | Ready |
| TC-APD01 | WCAG 2.1 | Accessibility | High | Ready |
| TC-APD02 | WCAG 2.1 | Accessibility | High | Ready |
| TC-APD03 | WCAG 2.1 | Accessibility | High | Ready |
| TC-APD04 | WCAG 2.1 | Accessibility | High | Ready |
| TC-APD05 | WCAG 2.1 | Accessibility | Medium | Ready |
| TC-PPD01 | Performance | Performance | Medium | Ready |
| TC-PPD02 | Performance | Performance | Medium | Ready |

---

## Functional Test Cases

### TC-PD01: Modal Display on Page Load (AC4)
**Requirement:** A visitor to a page which has a Page Disclaimer active will be shown the Page Disclaimer when landing on the page.

**Preconditions:**
- Browser session has no existing Page Disclaimer session data
- Test page is accessible

**Test Steps:**
1. Navigate to the Page Disclaimer test URL
2. Handle authentication if required
3. Wait for page to fully load

**Expected Results:**
- Modal overlay `[data-qa="popup-overlay"]` is visible
- Modal container `[data-qa="popup"]` is displayed in center
- Backdrop blur effect is applied
- Main page content is not accessible (covered by modal)
- Modal displays above all other content (z-index: 1001)

**Test Data:** N/A  
**Tags:** @Functional @Smoke @AC4

---

### TC-PD02: Continue Button Functionality (AC5)
**Requirement:** When a site visitor clicks/taps/follows the Continue link, the Page Disclaimer will be closed and the desired page will be shown.

**Preconditions:**
- Page Disclaimer modal is visible (TC-PD01 passed)

**Test Steps:**
1. Verify Continue button `[data-qa="disclaimer-primary-button"]` is visible
2. Verify button displays "Yes" text
3. Verify button has primary styling (dark background, white text)
4. Click the Continue button
5. Wait for modal to disappear

**Expected Results:**
- Continue button is clickable and responsive
- Modal overlay disappears after click
- Main page content becomes accessible
- No page redirect occurs (stays on same page)
- Session storage/localStorage updated (for AC7)

**Test Data:** N/A  
**Tags:** @Functional @Critical @AC5

---

### TC-PD03: Cancel Button Functionality (AC6)
**Requirement:** When a site visitor clicks/taps/follows the Cancel link, they will be redirected to the defined Redirect Link.

**Preconditions:**
- Page Disclaimer modal is visible (TC-PD01 passed)

**Test Steps:**
1. Verify Cancel button `[data-qa="disclaimer-secondary-button"]` is visible
2. Verify button displays "No" text
3. Verify button has secondary styling (transparent background, border)
4. Verify button is implemented as link element (`<a>`)
5. Click the Cancel button
6. Wait for navigation to complete

**Expected Results:**
- Cancel button is clickable with proper styling
- User is redirected to predefined URL (redirect link)
- Navigation occurs (URL changes)
- Modal disappears during redirect

**Test Data:** Redirect URL (to be confirmed from component configuration)  
**Tags:** @Functional @Critical @AC6

---

### TC-PD04: Session Management (AC7)
**Requirement:** A site visitor who has already tapped the Continue link for a Page Disclaimer will not be shown that Page Disclaimer again in the current browser session.

**Preconditions:**
- Fresh browser session
- Page Disclaimer modal is visible

**Test Steps:**
1. Complete TC-PD02 (click Continue button)
2. Verify modal disappears
3. Navigate away from the page (e.g., to another test page)
4. Navigate back to the Page Disclaimer test URL
5. Wait for page to load completely

**Expected Results:**
- Modal does NOT appear on return visit
- Page content is immediately accessible
- Session persistence works correctly
- Behavior persists across page refreshes in same session

**Test Data:** N/A  
**Tags:** @Functional @Critical @AC7 @SessionManagement

---

### TC-PD05: Modal Structure and Content
**Requirement:** Verify modal displays correct content and structure

**Preconditions:**
- Page Disclaimer modal is visible

**Test Steps:**
1. Verify modal title element `#popup-title` is visible
2. Verify title displays: "Page contains resources intendend for journalists only."
3. Verify message content contains: "For media enquiries about our relases please contact ukmediaenquiries@bayer.co.uk."
4. Verify both buttons are present and correctly labeled
5. Verify modal structure matches DOM inspection

**Expected Results:**
- Title is displayed as H2 heading element
- Message content is properly formatted
- All elements use correct semantic HTML
- Content is displayed clearly and readably

**Test Data:** 
- Title text: "Page contains resources intendend for journalists only."
- Message text: "For media enquiries about our relases please contact ukmediaenquiries@bayer.co.uk."

**Tags:** @Functional @UI @Content

---

### TC-PD06: Responsive Modal Display
**Requirement:** Modal displays correctly across all viewport sizes

**Preconditions:**
- Page Disclaimer modal is visible

**Test Steps:**
1. Test modal display on XL viewport (1440x900)
2. Test modal display on LG viewport (1024x768)
3. Test modal display on MD viewport (768x1024)
4. Test modal display on SM viewport (375x667)
5. Verify modal width and positioning on each viewport

**Expected Results:**
- XL/LG viewports: Modal width 690px, centered
- MD/SM viewports: Modal width 335px, centered
- Modal remains centered on all viewports
- Content remains readable and accessible
- Buttons maintain proper sizing and spacing

**Test Data:** Viewport dimensions as specified  
**Tags:** @Functional @Responsive @CrossViewport

---

## Visual Test Cases

### TC-PD07: XL Viewport Visual Validation (1440x900)
**Requirement:** Verify visual appearance matches Figma design on XL viewport

**Preconditions:**
- Browser set to XL viewport (1440x900)
- Page Disclaimer modal is visible

**Test Steps:**
1. Verify modal container width and positioning
2. Validate title font properties (family, size, weight, line-height,color)
3. Validate message text font properties
4. Verify Continue button styling (background, text color, font)
5. Verify Cancel button styling (border, text color, font)
6. Check spacing and padding values

**Expected Results:**
- All font properties match Figma specifications (node-id: 4883:3144)
- Colors match design tokens
- Spacing and layout align with design
- Button styling matches primary/secondary design patterns

**Test Data:** 
- Figma values from node-id: 4883:3144
- Expected values available in `PageDisclaimer_FigmaValues.XL`
- Title: Bayer Sans, 24px, 700 weight, 30px line-height, rgba(16, 56, 79, 1)
- Message: Bayer Sans, 20px, 400 weight, 30px line-height, rgba(64, 96, 114, 1)
- Continue Button: Bayer Sans, 14px, 500 weight, 20px line-height, rgba(255, 255, 255, 1)
- Cancel Button: Bayer Sans, 14px, 500 weight, 20px line-height, rgba(16, 56, 79, 1)

**Tags:** @Visual @Figma @XL @FontValidation

---

### TC-PD08: LG Viewport Visual Validation (1024x768)
**Requirement:** Verify visual appearance matches Figma design on LG viewport

**Preconditions:**
- Browser set to LG viewport (1024x768)
- Page Disclaimer modal is visible

**Test Steps:**
1. Verify modal container width and positioning
2. Validate title font properties (family, size, weight, line-height)
3. Validate message text font properties
4. Verify button font properties and sizing
5. Check responsive adjustments vs XL viewport

**Expected Results:**
- All font properties match Figma specifications (node-id: 4883:3132)
- Modal width adapts correctly (690px maintained)
- Typography scales appropriately
- Layout maintains design integrity

**Test Data:** 
- Figma values from node-id: 4883:3132
- Expected values available in `PageDisclaimer_FigmaValues.LG`
- Same typography as XL viewport with modal width maintained at 690px

**Tags:** @Visual @Figma @LG @FontValidation

---

### TC-PD09: MD Viewport Visual Validation (768x1024)
**Requirement:** Verify visual appearance matches Figma design on MD viewport

**Preconditions:**
- Browser set to MD viewport (768x1024)
- Page Disclaimer modal is visible

**Test Steps:**
1. Verify modal container width changes to 335px
2. Validate title font properties adjust for smaller screen
3. Validate message text font properties
4. Verify button sizing and layout adjustments
5. Check padding and margin adjustments

**Expected Results:**
- All font properties match Figma specifications (node-id: 4883:3156)
- Modal width adapts to 335px
- Typography remains readable on smaller screens
- Buttons maintain usability and touch targets

**Test Data:** 
- Figma values from node-id: 4883:3156
- Expected values available in `PageDisclaimer_FigmaValues.MD`
- Title: Bayer Sans, 20px, 700 weight, 25px line-height (responsive adjustment)
- Message: Bayer Sans, 16px, 400 weight, 24px line-height (responsive adjustment)
- Modal width: 335px (responsive adjustment)

**Tags:** @Visual @Figma @MD @FontValidation

---

### TC-PD10: SM Viewport Visual Validation (375x667)
**Requirement:** Verify visual appearance matches Figma design on SM viewport

**Preconditions:**
- Browser set to SM viewport (375x667)
- Page Disclaimer modal is visible

**Test Steps:**
1. Verify modal container maintains 335px width
2. Validate title font properties for mobile
3. Validate message text font properties
4. Verify button touch targets and spacing
5. Check overall mobile usability

**Expected Results:**
- All font properties match Figma specifications (node-id: 4883:3168)
- Modal fits properly on small screens
- Touch targets meet accessibility guidelines (44px minimum)
- Content remains fully readable and accessible

**Test Data:** 
- Figma values from node-id: 4883:3168
- Expected values available in `PageDisclaimer_FigmaValues.SM`
- Same typography as MD viewport (20px title, 16px message)
- Modal width maintained at 335px for mobile
- Button touch targets verified for accessibility

**Tags:** @Visual @Figma @SM @FontValidation @Mobile

---

## Accessibility Test Cases (@Accessibility)

### TC-APD01: Keyboard Navigation
**Requirement:** Modal supports full keyboard navigation per WCAG 2.1 AA

**Preconditions:**
- Page Disclaimer modal is visible
- Keyboard navigation enabled

**Test Steps:**
1. Tab through modal elements
2. Verify focus order: Continue button → Cancel button
3. Test Enter key on focused buttons
4. Test Escape key to close modal (if implemented)
5. Verify focus trap within modal

**Expected Results:**
- Tab order is logical and predictable
- Focus indicators are clearly visible
- Buttons activate correctly with Enter key
- Focus remains trapped within modal
- Focus returns to appropriate element after modal closes

**Test Data:** N/A  
**Tags:** @Accessibility @Keyboard @WCAG @FocusManagement

---

### TC-APD02: Screen Reader Compatibility
**Requirement:** Modal is properly announced by screen readers

**Preconditions:**
- Screen reader enabled (NVDA/JAWS)
- Page Disclaimer modal is visible

**Test Steps:**
1. Navigate modal with screen reader
2. Verify modal role and properties are announced
3. Check title and message content announcement
4. Verify button labels and roles are clear
5. Test with different screen readers if possible

**Expected Results:**
- Modal is announced as dialog/popup
- Title and content are read in correct order
- Button purposes are clearly communicated
- No content is skipped or misinterpreted
- Navigation instructions are clear

**Test Data:** N/A  
**Tags:** @Accessibility @ScreenReader @WCAG @ARIA

---

### TC-APD03: Color Contrast Validation
**Requirement:** All text meets WCAG 2.1 AA color contrast requirements (4.5:1)

**Preconditions:**
- Page Disclaimer modal is visible
- Color contrast analyzer available

**Test Steps:**
1. Test title text color contrast against background
2. Test message text color contrast
3. Test Continue button text contrast (white on dark)
4. Test Cancel button text contrast (dark on transparent)
5. Use automated accessibility scanner

**Expected Results:**
- All text meets minimum 4.5:1 contrast ratio
- Button text is clearly readable
- No color-only information conveyance
- Design maintains accessibility in all themes

**Test Data:** Color values from Figma specifications  
**Tags:** @Accessibility @ColorContrast @WCAG @VisualDesign

---

### TC-APD04: Semantic HTML Structure
**Requirement:** Modal uses proper semantic HTML elements

**Preconditions:**
- Page Disclaimer modal is visible

**Test Steps:**
1. Verify modal uses appropriate ARIA roles
2. Check heading hierarchy (H2 for title)
3. Verify button vs link semantics
4. Test landmark navigation
5. Validate HTML structure with accessibility tools

**Expected Results:**
- Title uses proper heading level (H2)
- Continue button is semantic button element
- Cancel action uses link element (for navigation)
- ARIA properties enhance structure
- HTML validates without accessibility errors

**Test Data:** N/A  
**Tags:** @Accessibility @SemanticHTML @WCAG @Structure

---

### TC-APD05: Focus Management
**Requirement:** Modal properly manages focus when opened and closed

**Preconditions:**
- Page initially loaded without modal focus

**Test Steps:**
1. Trigger modal display
2. Verify focus moves to modal area
3. Complete Continue action (TC-PD02)
4. Verify focus returns to appropriate page element
5. Test focus behavior across different entry points

**Expected Results:**
- Focus automatically moves to modal on display
- Focus is trapped within modal while open
- Focus returns to logical page element after close
- Focus management works consistently
- No focus lost or confused states

**Test Data:** N/A  
**Tags:** @Accessibility @FocusManagement @WCAG @UserExperience

---

## Performance Test Cases (@Performance)

### TC-PPD01: Modal Load Performance
**Requirement:** Modal displays within acceptable performance thresholds

**Preconditions:**
- Network conditions: Regular 3G and WiFi
- Performance monitoring enabled

**Test Steps:**
1. Navigate to page and measure modal display time
2. Record Time to Interactive for modal elements
3. Measure backdrop blur rendering performance
4. Test on different device capabilities
5. Monitor memory usage during modal lifecycle

**Expected Results:**
- Modal appears within 500ms of page load
- Interactive elements respond within 100ms
- Backdrop effects render smoothly (60fps)
- Memory usage remains stable
- No performance degradation on lower-end devices

**Test Data:** Performance thresholds and device specifications  
**Tags:** @Performance @LoadTime @Rendering @ResponsivePerformance

---

### TC-PPD02: Animation and Transition Performance
**Requirement:** Modal animations are smooth and performant

**Preconditions:**
- Modal display includes transition animations
- Performance monitoring enabled

**Test Steps:**
1. Measure modal fade-in animation smoothness
2. Test backdrop blur performance during transition
3. Monitor button hover and focus animations
4. Test modal close animation performance
5. Validate animations on various devices

**Expected Results:**
- Animations maintain 60fps frame rate
- No janky or stuttering transitions
- CPU usage remains reasonable during animations
- Animations are smooth across all tested devices
- Fallbacks work properly on less capable devices

**Test Data:** Animation duration and performance metrics  
**Tags:** @Performance @Animation @60FPS @SmoothTransitions

---

## Cross-Browser and Device Testing

### Additional Test Scenarios
- **Browser Compatibility:** Chrome, Firefox, Safari, Edge
- **Device Testing:** Desktop, Tablet, Mobile
- **Operating Systems:** Windows, macOS, iOS, Android
- **Network Conditions:** 3G, 4G, WiFi, Offline scenarios

---

## Test Execution Notes

### Prerequisites
1. Test environment setup with authentication credentials
2. Figma design values extracted and available
3. Accessibility testing tools configured
4. Performance monitoring tools enabled

### Test Data Requirements
- Figma node values for all viewports
- Expected redirect URL configuration
- Session management validation data
- Color contrast specifications

### Known Limitations
- AC7 session management implementation needs verification
- Redirect URL configuration may vary per environment
- Some accessibility tests may require manual validation

---

**Last Updated:** November 20, 2025  
**Total Test Cases:** 17 (6 Functional, 4 Visual, 5 Accessibility, 2 Performance)  
**Ready for Implementation:** ✅  
**Figma Values:** ✅ Extracted from all viewports (XL: 4883:3144, LG: 4883:3132, MD: 4883:3156, SM: 4883:3168)  
**Design Tokens:** Available in `helpers/utils/figma-values/PageDisclaimer_FigmaValues.ts`  
**Next Steps:** Implement test automation scripts with visual validation
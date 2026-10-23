# Video Component Test Cases

**Component:** Video Component  
**URL:** https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Video-Component  
**Date:** 2025-09-17  

## Test Case Categories

### 1. Functional Test Cases

#### VID-FUNC-001: Video Component Container Validation
**Objective:** Verify that the main video component container is present and properly structured  
**Priority:** High  
**Prerequisites:** User navigated to Video Component page  

**Test Steps:**
1. Navigate to Video Component page with authentication
2. Wait for page load completion
3. Verify video component container is visible
4. Validate container has proper data-qa attributes

**Expected Results:**
- Video component section `[data-qa="video-component"]` is visible
- Container has proper aria-label "Video Component"
- Container is within fullwidth-column structure
- All child elements are properly nested

**Data-QA Locators:**
- Primary: `[data-qa="video-component"]`
- Parent: `[data-qa="fullwidth-column"]`

---

#### VID-FUNC-002: Video Thumbnail Image Validation
**Objective:** Verify that the video thumbnail image is displayed correctly  
**Priority:** High  
**Prerequisites:** Video component is loaded  

**Test Steps:**
1. Locate video thumbnail element
2. Verify image is visible and loaded
3. Validate image has proper alt text
4. Check image source URL is valid
5. Verify proper data-qa attributes

**Expected Results:**
- Video thumbnail `[data-qa="video-thumbnail"]` is visible
- Image has descriptive alt text
- Image source URL is accessible
- Proper aria-label "Video thumbnail" is present

**Data-QA Locators:**
- Primary: `[data-qa="video-thumbnail"]`

---

#### VID-FUNC-003: Video Title Display Validation
**Objective:** Verify that the video title is displayed with proper formatting  
**Priority:** High  
**Prerequisites:** Video component is loaded  

**Test Steps:**
1. Locate video title element
2. Verify title text is visible and readable
3. Validate title uses proper heading structure (H2)
4. Check text content includes title and duration
5. Verify proper data-qa attributes

**Expected Results:**
- Video title `[data-qa="title-component"]` is visible
- Title uses H2 semantic structure
- Text content displays "Video Title| 1:31" format
- Proper aria-label is present

**Data-QA Locators:**
- Primary: `[data-qa="title-component"]`

---

#### VID-FUNC-004: Video Duration Display Validation
**Objective:** Verify that the video duration is displayed in correct format  
**Priority:** Medium  
**Prerequisites:** Video component is loaded  

**Test Steps:**
1. Locate video duration element
2. Verify duration text is visible
3. Validate duration format (MM:SS)
4. Check duration displays "| 1:31"
5. Verify proper data-qa attributes

**Expected Results:**
- Video duration `[data-qa="video-duration"]` is visible
- Duration format follows "| MM:SS" pattern
- Text displays "| 1:31"
- Element uses span structure

**Data-QA Locators:**
- Primary: `[data-qa="video-duration"]`

---

#### VID-FUNC-005: Video Thumbnail Click Functionality
**Objective:** Verify that clicking video thumbnail triggers video overlay/modal  
**Priority:** High  
**Prerequisites:** Video component is loaded  

**Test Steps:**
1. Locate video thumbnail
2. Click on video thumbnail image
3. Wait for overlay/modal to appear
4. Verify video player is displayed
5. Verify overlay controls are functional

**Expected Results:**
- Click on thumbnail triggers fullscreen overlay
- Video player appears in overlay
- Play controls are functional
- Close button is available

**Data-QA Locators:**
- Primary: `[data-qa="video-thumbnail"]`
- Overlay: Look for modal/overlay data-qa attributes

---

### 2. Visual Test Cases

#### VID-VIS-001: Video Component Typography Validation
**Objective:** Verify font family, color, font size, and line height for video component text elements  
**Priority:** High  
**Prerequisites:** Video component is loaded  

**Test Steps:**
1. Locate video title element `[data-qa="title-component"]`
2. Extract and validate font-family CSS property
3. Extract and validate color CSS property
4. Extract and validate font-size CSS property
5. Extract and validate line-height CSS property
6. Repeat for duration element `[data-qa="video-duration"]`

**Expected Results:**
- **Title (H2) Typography:**
  - Font-family: Matches design system specifications
  - Color: Proper contrast ratio and brand colors
  - Font-size: Appropriate heading size
  - Line-height: Proper spacing for readability
- **Duration Typography:**
  - Font-family: Consistent with design system
  - Color: Complementary to title color
  - Font-size: Smaller than title, readable
  - Line-height: Proper spacing

**Data-QA Locators:**
- Primary: `[data-qa="title-component"]`
- Secondary: `[data-qa="video-duration"]`

---

#### VID-VIS-002: Video Component Layout and Spacing
**Objective:** Verify proper layout, spacing, and alignment of video component elements  
**Priority:** Medium  
**Prerequisites:** Video component is loaded  

**Test Steps:**
1. Verify video component container layout
2. Check thumbnail image positioning and size
3. Validate title and duration alignment
4. Verify proper spacing between elements
5. Check component responsiveness

**Expected Results:**
- Container has proper dimensions and spacing
- Thumbnail image maintains aspect ratio
- Title and duration are properly aligned
- Consistent spacing between elements
- Component adapts to different screen sizes

**Data-QA Locators:**
- Container: `[data-qa="video-component"]`
- Thumbnail: `[data-qa="video-thumbnail"]`
- Title: `[data-qa="title-component"]`
- Duration: `[data-qa="video-duration"]`

---

### 3. Accessibility Test Cases

#### VID-ACC-001: Video Component Keyboard Navigation
**Objective:** Verify that video component is fully accessible via keyboard navigation  
**Priority:** High  
**Prerequisites:** Video component is loaded  

**Test Steps:**
1. Navigate to video component using Tab key
2. Verify thumbnail receives focus
3. Test Enter/Space key activation
4. Verify focus management in overlay
5. Test Escape key to close overlay

**Expected Results:**
- Video thumbnail is reachable via Tab navigation
- Focus indicator is clearly visible
- Enter/Space keys trigger video overlay
- Focus management works properly in overlay
- Escape key closes overlay and returns focus

**Data-QA Locators:**
- Primary: `[data-qa="video-thumbnail"]`
- Container: `[data-qa="video-component"]`

---

#### VID-ACC-002: Video Component Screen Reader Support
**Objective:** Verify that video component provides proper screen reader announcements  
**Priority:** High  
**Prerequisites:** Video component is loaded  

**Test Steps:**
1. Use screen reader to navigate to video component
2. Verify component is announced properly
3. Check thumbnail description and alt text
4. Verify title and duration are read correctly
5. Test overlay accessibility

**Expected Results:**
- Component section is announced as "Video Component"
- Thumbnail alt text "Res_check.jpg" is read
- Title "Video Title" is announced as heading
- Duration "1:31" is read in context
- Overlay provides proper accessibility

**Data-QA Locators:**
- Container: `[data-qa="video-component"]`
- Thumbnail: `[data-qa="video-thumbnail"]`
- Title: `[data-qa="title-component"]`
- Duration: `[data-qa="video-duration"]`

---

#### VID-ACC-003: Video Component WCAG 2.1 AA Compliance
**Objective:** Verify that all elements meet WCAG 2.1 AA accessibility standards  
**Priority:** High  
**Prerequisites:** Video component is loaded  

**Test Steps:**
1. Run axe-core accessibility analysis on component
2. Check color contrast ratios for all text elements
3. Verify keyboard accessibility standards
4. Test semantic markup compliance
5. Validate focus management
6. Check for proper ARIA attributes and roles
7. Test with assistive technology compatibility

**Expected Results:**
- **Axe-core Scan:** Zero accessibility violations detected
- **Color Contrast:** All text meets WCAG AA standard (4.5:1 ratio minimum)
- **Keyboard Navigation:** All interactive elements accessible via keyboard
- **Semantic HTML:** Proper heading hierarchy and landmark roles
- **Focus Management:** Visible focus indicators and logical tab order
- **ARIA Compliance:** Proper labels, roles, and states for all elements
- **Screen Reader:** Compatible with NVDA, JAWS, and VoiceOver

**WCAG 2.1 AA Specific Criteria:**
- **1.3.1 Info and Relationships:** Proper semantic structure
- **1.4.3 Contrast (Minimum):** 4.5:1 contrast ratio for normal text
- **2.1.1 Keyboard:** All functionality available from keyboard
- **2.4.3 Focus Order:** Logical and intuitive focus sequence
- **2.4.7 Focus Visible:** Clear visual focus indicators
- **4.1.2 Name, Role, Value:** Proper programmatic identification

**Data-QA Locators:**
- Container: `[data-qa="video-component"]`
- All Interactive Elements: `button, [role="button"], [tabindex]`
- Text Elements: `[data-qa="title-component"], [data-qa="video-duration"]`

---

### 4. Video Overlay/Modal Test Cases

#### VID-OVERLAY-001: Video Overlay Appearance and Structure
**Objective:** Verify that clicking video thumbnail triggers overlay and displays proper structure  
**Priority:** High  
**Prerequisites:** Video component is loaded  

**Test Steps:**
1. Click on video thumbnail image
2. Verify overlay/modal appears
3. Validate overlay structure and data-qa attributes
4. Verify video element is present in overlay
5. Check overlay accessibility attributes

**Expected Results:**
- Clicking thumbnail triggers fullscreen overlay
- Overlay has proper modal structure and ARIA attributes
- Video player element is visible within overlay
- Overlay traps focus properly
- Modal can be closed via multiple methods

**Data-QA Locators:**
- Trigger: `[data-qa="video-thumbnail"]`
- Overlay: `[data-qa*="overlay"], [data-qa*="modal"], [role="dialog"]`
- Video Player: `video, [data-qa*="video-player"]`

---

#### VID-OVERLAY-002: Video Overlay Controls Functionality
**Objective:** Verify all video controls function properly within overlay  
**Priority:** High  
**Prerequisites:** Video overlay is open  

**Test Steps:**
1. Open video overlay by clicking thumbnail
2. Test play/pause button functionality
3. Test volume controls if available
4. Test fullscreen toggle functionality
5. Test timeline/seek controls if available
6. Verify all controls have proper ARIA labels

**Expected Results:**
- Play/pause controls function correctly
- Volume controls adjust audio properly
- Fullscreen mode works as expected
- Timeline allows seeking through video
- All controls are keyboard accessible

**Data-QA Locators:**
- Play/Pause: `[aria-label*="play"], [aria-label*="pause"]`
- Volume: `[aria-label*="volume"]`
- Fullscreen: `[aria-label*="fullscreen"]`
- Timeline: `input[type="range"], [data-qa*="timeline"]`

---

#### VID-OVERLAY-003: Video Overlay Close Functionality
**Objective:** Verify overlay can be closed through multiple methods  
**Priority:** High  
**Prerequisites:** Video overlay is open  

**Test Steps:**
1. Open video overlay
2. Test close button functionality
3. Test Escape key to close overlay
4. Test clicking outside overlay to close
5. Verify focus returns to thumbnail after close
6. Verify overlay is completely removed from DOM

**Expected Results:**
- Close button closes overlay properly
- Escape key closes overlay
- Clicking outside overlay closes it
- Focus management works correctly
- No memory leaks or DOM remnants

**Data-QA Locators:**
- Close Button: `[aria-label*="close"], [data-qa*="close"]`
- Overlay: `[data-qa*="overlay"], [role="dialog"]`

---

#### VID-OVERLAY-004: Video Overlay WCAG 2.1 AA Accessibility
**Objective:** Verify overlay meets WCAG 2.1 AA accessibility standards  
**Priority:** High  
**Prerequisites:** Video overlay is open  

**Test Steps:**
1. Open video overlay
2. Verify focus trap functionality
3. Test keyboard navigation within overlay
4. Validate ARIA attributes for modal
5. Run axe-core accessibility scan
6. Test with screen reader announcements
7. Verify color contrast for overlay elements

**Expected Results:**
- Focus is trapped within overlay
- All elements are keyboard accessible
- Modal has proper ARIA attributes (role="dialog", aria-modal="true")
- No accessibility violations detected
- Screen reader properly announces overlay content
- All text meets 4.5:1 contrast ratio

**Data-QA Locators:**
- Modal: `[role="dialog"], [aria-modal="true"]`
- Controls: `button, [role="button"]`

---

### 5. Performance Test Cases

#### VID-PERF-001: Video Component Loading Performance
**Objective:** Verify that video component loads within acceptable time limits  
**Priority:** High  
**Prerequisites:** Clean browser session  

**Test Steps:**
1. Navigate to Video Component page
2. Measure time to component visibility
3. Measure thumbnail image load time
4. Verify total component initialization time
5. Test on different network conditions

**Expected Results:**
- Component visible within 3 seconds
- Thumbnail image loads within 2 seconds
- Total initialization within 5 seconds
- Performance consistent across network conditions

**Data-QA Locators:**
- Container: `[data-qa="video-component"]`
- Thumbnail: `[data-qa="video-thumbnail"]`

---

#### VID-PERF-002: Video Component Memory Usage
**Objective:** Verify that video component doesn't cause memory leaks or excessive usage  
**Priority:** Medium  
**Prerequisites:** Video component is loaded  

**Test Steps:**
1. Monitor initial memory usage
2. Interact with video component
3. Open and close video overlay multiple times
4. Monitor memory usage over time
5. Check for memory leaks

**Expected Results:**
- Memory usage remains stable
- No significant memory leaks detected
- Component cleanup works properly
- Browser performance not degraded

**Data-QA Locators:**
- Container: `[data-qa="video-component"]`
- Thumbnail: `[data-qa="video-thumbnail"]`

---

## Test Execution Summary

### Total Test Cases: 15
- **Functional Tests:** 5 cases
- **Visual Tests:** 3 cases  
- **Accessibility Tests:** 3 cases
- **Performance Tests:** 2 cases
- **Video Overlay Tests:** 4 cases

### Test Tags for Execution
```bash
# Run all tests
npx playwright test tests/specs/videoComponent.spec.ts

# Run by category
npx playwright test tests/specs/videoComponent.spec.ts --grep "@Functional"
npx playwright test tests/specs/videoComponent.spec.ts --grep "@Visual" 
npx playwright test tests/specs/videoComponent.spec.ts --grep "@Accessibility"
npx playwright test tests/specs/videoComponent.spec.ts --grep "@Performance"
npx playwright test tests/specs/videoComponent.spec.ts --grep "@VideoOverlay"

# Run specific viewport tests
npx playwright test tests/specs/videoComponent.spec.ts --grep "@SM|@MD|@LG|@XL"
```

### WCAG 2.1 AA Compliance Matrix
| Criterion | Test Case | Status |
|-----------|-----------|---------|
| 1.3.1 Info and Relationships | VID-ACC-003 | ✅ Covered |
| 1.4.3 Contrast (Minimum) | VID-ACC-003 | ✅ Covered |
| 2.1.1 Keyboard | VID-ACC-001, VID-ACC-003 | ✅ Covered |
| 2.4.3 Focus Order | VID-ACC-001 | ✅ Covered |
| 2.4.7 Focus Visible | VID-ACC-001 | ✅ Covered |
| 4.1.2 Name, Role, Value | VID-ACC-002, VID-ACC-003 | ✅ Covered |

### Cross-Browser Test Matrix

### Desktop Browsers
- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)

### Mobile Browsers
- ✅ Chrome Mobile
- ✅ Safari Mobile
- ✅ Samsung Internet

### Viewport Sizes
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

## Test Data Requirements

### Video Content
- **Title:** "Video Title"
- **Duration:** "1:31" (1 minute 31 seconds)
- **Thumbnail:** Res_check.jpg image
- **Alt Text:** "Res_check.jpg"

### URL Structure
- **Base URL:** https://bayer-beyond-qa-uk.vercel.app
- **Component Path:** /Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Video-Component

## Execution Notes

### Prerequisites
1. User must be authenticated (password: beyond2025)
2. Page must be fully loaded before testing
3. Network connectivity required for image loading

### Known Issues
- No explicit play button found in DOM (triggers on thumbnail click)
- Video overlay not visible until interaction
- Duration appears both in title and separate element

### Test Environment
- **Framework:** Playwright with TypeScript
- **Approach:** DOM-first with data-qa attributes
- **Authentication:** Vercel password protection
- **Reporting:** Allure reports with screenshots
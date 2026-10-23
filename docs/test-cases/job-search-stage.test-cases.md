# Job Search Stage Component - Test Cases Documentation

**Component:** Job Search Stage  
**Created:** October 24, 2025  
**Test Page URL:** https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/JobSearchStage  
**Figma URL:** https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=3265-47511&m=dev  
**Status:** Ready for Implementation  

---

## **Requirements Analysis**

### **Acceptance Criteria Breakdown:**

| **AC** | **Requirement** | **Test Priority** | **Validation Method** |
|--------|-----------------|-------------------|----------------------|
| **AC1** | Search query + location transmitted to 8fold via URL parameters | **HIGH** | URL parameter validation |
| **AC2** | Optional fields - either field can be empty | **HIGH** | Form submission scenarios |
| **AC3** | Cookie-based location prefill functionality | **MEDIUM** | Cookie acceptance + location prefill |
| **AC4** | Auto-suggestion in "Where are you interested in" field | **MEDIUM** | Character input + dropdown validation |

### **DOM Structure Reference:**
- **Main Container**: `[data-qa="fullwidth-column"]`
- **Interest Input Container**: `[data-qa="job-search-input"]`
- **Location Input Container**: `[data-qa="location-search-input"]`
- **Search Button**: `[data-qa="search-jobs-button"]`
- **Title Element**: `[data-qa="title-component"]`
- **Description Text**: `[data-qa="job-search-intro-text"]`

---

## **FUNCTIONAL TEST CASES**

### **TC-JSS001: Valid Search Query with Both Fields (AC1)**
**Priority:** HIGH  
**Tags:** @Functional @AC1 @Critical

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Accept cookie banner if present
3. Locate interest input using `[data-qa="job-search-input"] input`
4. Enter "Back End Development" in interest field
5. Locate location input using `[data-qa="location-search-input"] input`
6. Enter "Germany" in location field
7. Click search button using `[data-qa="search-jobs-button"]`
8. Wait for navigation to 8fold platform
9. Validate URL contains query parameters

**Expected Result:**
- URL should be: `https://bayer.eightfold.ai/careers?query=Back+End+Development&location=Germany&hl=en`
- Page successfully redirects to 8fold with correct parameters
- Both search terms properly URL encoded

**Test Data:**
- Interest: "Back End Development"
- Location: "Germany"

---

### **TC-JSS002: Search with Interest Field Only (AC2)**
**Priority:** HIGH  
**Tags:** @Functional @AC2 @Edge

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Accept cookie banner if present
3. Enter "Software Engineer" in interest field only
4. Leave location field empty
5. Click search button
6. Validate URL parameters

**Expected Result:**
- URL contains query parameter with interest value
- Location parameter either missing or empty
- Search executes successfully with partial data

**Test Data:**
- Interest: "Software Engineer"
- Location: (empty)

---

### **TC-JSS003: Search with Location Field Only (AC2)**
**Priority:** HIGH  
**Tags:** @Functional @AC2 @Edge

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Accept cookie banner if present
3. Leave interest field empty
4. Enter "United States" in location field only
5. Click search button
6. Validate URL parameters

**Expected Result:**
- URL contains location parameter
- Query parameter either missing or empty
- Search executes successfully with partial data

**Test Data:**
- Interest: (empty)
- Location: "United States"

---

### **TC-JSS004: Empty Form Search Submission (AC2)**
**Priority:** HIGH  
**Tags:** @Functional @AC2 @Edge

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Accept cookie banner if present
3. Leave both fields empty
4. Click search button
5. Validate navigation and URL

**Expected Result:**
- Navigation to 8fold occurs successfully
- URL contains language parameter: `hl=en`
- General job search page loads without specific filters

---

### **TC-JSS005: Cookie-Based Location Prefill (AC3)**
**Priority:** MEDIUM  
**Tags:** @Functional @AC3 @Cookie

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Accept cookies when banner appears (required for prefill)
3. Check if location field has prefilled value
4. If prefilled, verify value is meaningful location string
5. Verify user can modify prefilled value
6. Perform search with modified value

**Expected Result:**
- Location field shows prefilled value from cookies/geolocation
- Prefilled value represents valid country/region
- User can override prefilled value
- Search works with both prefilled and custom locations

**Note:** May require specific cookie/session setup for consistent testing

---

### **TC-JSS006: Auto-Suggestion Functionality (AC4)**
**Priority:** MEDIUM  
**Tags:** @Functional @AC4 @Interactive

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Accept cookie banner if present
3. Focus on interest input field
4. Type single character (e.g., "D")
5. Wait for suggestions dropdown to appear
6. Verify suggestions are relevant to character input
7. Test selecting suggestion from dropdown

**Expected Result:**
- Suggestions appear after character input
- Suggestions are job-related and relevant
- User can select suggestion from dropdown
- Selected suggestion populates the field correctly

**Note:** Auto-suggestions may be environment-dependent

---

### **TC-JSS007: Form Field Validation and UX**
**Priority:** HIGH  
**Tags:** @Functional @UX @Validation

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Verify component structure and visibility
3. Test keyboard tab navigation through fields
4. Test form submission with Enter key
5. Verify input field placeholder text
6. Test clearing and re-entering values

**Expected Result:**
- All form elements are accessible via keyboard
- Tab order: Interest → Location → Search Button
- Enter key submits form successfully
- Placeholder text is meaningful and visible
- Field values can be cleared and updated

---

## **VISUAL TEST CASES**

### **TC-JSS008: XL Viewport Visual Validation (1440px+)**
**Priority:** HIGH  
**Tags:** @Visual @Responsive @XL

**Figma Node ID:** 3265:47481

**Test Steps:**
1. Set viewport to 1440px width
2. Navigate to Job Search Stage test page
3. Take screenshot of component
4. Extract Figma design tokens for XL viewport
5. Validate visual elements match design specifications

**Elements to Validate:**
- **Highlight Text & Headline**: `panel > text > headline > text`
- **Description Text**: `panel > text > text`
- **Interest Input**: `form > Text Fields > Input Container > Input Text`
- **Location Input**: `form > Text Fields > Input Container > Input Text`
- **Location Icon**: `form > Text Fields > Input Container > Search Icon`
- **Arrow Icon**: `buttonGroup > Button > icon > arrow_forward`
- **Search Button**: `buttonGroup > Button`

**Expected Result:**
- Component renders with proper desktop layout
- Typography matches Figma specifications (48px title, 20px description)
- Input fields properly sized and aligned
- Search button styled correctly with proper text case (UPPERCASE)

---

### **TC-JSS009: LG Viewport Visual Validation (1024px-1439px)**
**Priority:** HIGH  
**Tags:** @Visual @Responsive @LG

**Test Steps:**
1. Set viewport to 1200px width
2. Navigate to Job Search Stage test page
3. Verify responsive layout adjustments
4. Validate typography and spacing
5. Take screenshot for comparison

**Expected Result:**
- Layout adapts appropriately for large tablet/small desktop
- Typography remains consistent with XL viewport
- Component maintains visual hierarchy

---

### **TC-JSS010: MD Viewport Visual Validation (768px-1023px)**
**Priority:** HIGH  
**Tags:** @Visual @Responsive @MD

**Test Steps:**
1. Set viewport to 900px width (tablet)
2. Navigate to Job Search Stage test page
3. Verify tablet-specific layout
4. Validate typography scaling (30px title, 16px description)
5. Check input field and button sizing

**Expected Result:**
- Component adjusts for tablet viewport
- Typography scales appropriately
- Touch targets remain accessible
- Layout maintains usability

---

### **TC-JSS011: SM Viewport Visual Validation (320px-767px)**
**Priority:** HIGH  
**Tags:** @Visual @Responsive @SM

**Test Steps:**
1. Set viewport to 375px width (mobile)
2. Navigate to Job Search Stage test page
3. Verify mobile layout and stacking
4. Validate touch targets and accessibility
5. Check text readability and button sizing

**Expected Result:**
- Component renders properly on mobile devices
- Elements stack appropriately
- Touch targets meet minimum size requirements (44px)
- Text remains readable at small sizes

---

### **TC-JSS012: Font and Typography Validation**
**Priority:** MEDIUM  
**Tags:** @Visual @Typography @Figma

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Extract computed styles for text elements
3. Compare font family, size, weight, and color with Figma
4. Validate line height and letter spacing
5. Check text alignment and hierarchy

**Expected Result:**
- Font family: "Bayer Sans" across all elements
- Title: 48px (XL/LG), 30px (MD/SM), weight 700
- Description: 20px (XL/LG/SM), 16px (MD), weight 400
- Input text: 18px, weight 400
- Button text: 14px, weight 500, uppercase

---

### **TC-JSS013: Comprehensive Figma Values Validation - All Viewports**
**Priority:** HIGH  
**Tags:** @Visual @Figma @Typography @Comprehensive

**Test Steps:**
1. For each viewport (XL, LG, MD, SM):
   - Set appropriate viewport size
   - Navigate to component page
   - Extract all typography values
   - Compare with Figma design tokens
   - Validate color values and spacing

**Expected Result:**
- All typography values match Figma specifications
- Color values are accurate across viewports
- Spacing and layout match design system
- Responsive behavior is consistent

---

## **ACCESSIBILITY TEST CASES**

### **TC-A-JSS001: Keyboard Navigation**
**Priority:** HIGH  
**Tags:** @Accessibility @Keyboard @WCAG

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Use Tab key to navigate through form elements
3. Verify focus indicators are visible
4. Test Shift+Tab for reverse navigation
5. Use Enter key to submit form from button focus

**Expected Result:**
- Tab order: Interest → Location → Search Button
- Focus indicators are clearly visible
- Enter key submits form successfully
- Navigation is logical and intuitive

**WCAG Guidelines:** 2.1.1 (Keyboard), 2.4.3 (Focus Order)

---

### **TC-A-JSS002: Screen Reader Compatibility**
**Priority:** HIGH  
**Tags:** @Accessibility @ScreenReader @WCAG

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Run automated accessibility scan
3. Verify form fields have proper labels
4. Check aria-label attributes on input fields
5. Validate semantic HTML structure

**Expected Result:**
- Input fields have accessible labels
- Form has proper semantic structure
- No accessibility violations detected
- Screen reader can identify all interactive elements

**WCAG Guidelines:** 4.1.2 (Name, Role, Value), 1.3.1 (Info and Relationships)

---

### **TC-A-JSS003: Color Contrast and Visual Accessibility**
**Priority:** HIGH  
**Tags:** @Accessibility @ColorContrast @WCAG

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Check text color contrast ratios
3. Test with high contrast mode
4. Verify visibility across different viewport sizes
5. Test with zoom levels up to 200%

**Expected Result:**
- Text meets minimum contrast ratio (4.5:1 for normal text)
- Component remains usable in high contrast mode
- Text is readable at 200% zoom
- Visual indicators are distinguishable

**WCAG Guidelines:** 1.4.3 (Contrast Minimum), 1.4.4 (Resize Text)

---

### **TC-A-JSS004: Form Accessibility and Labels**
**Priority:** HIGH  
**Tags:** @Accessibility @Forms @WCAG

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Verify input field labeling methods
3. Check placeholder text accessibility
4. Validate button accessibility attributes
5. Test error handling and feedback

**Expected Result:**
- Input fields have associated labels or aria-label
- Placeholder text doesn't replace proper labels
- Button has accessible name
- Form provides proper feedback for interactions

**WCAG Guidelines:** 3.3.1 (Error Identification), 3.3.2 (Labels or Instructions)

---

## **PERFORMANCE TEST CASES**

### **TC-P-JSS001: Component Loading Performance**
**Priority:** MEDIUM  
**Tags:** @Performance @Loading

**Test Steps:**
1. Clear browser cache
2. Navigate to Job Search Stage test page
3. Measure time to component visibility
4. Check for render-blocking resources
5. Validate essential elements load timing

**Expected Result:**
- Component visible within 3 seconds
- Interactive elements available within 5 seconds
- No critical render-blocking issues
- Progressive loading if applicable

**Performance Budget:** < 5s total load time

---

### **TC-P-JSS002: Search Functionality Performance**
**Priority:** MEDIUM  
**Tags:** @Performance @Search

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Fill form fields with test data
3. Measure search submission response time
4. Monitor network requests during search
5. Validate navigation performance

**Expected Result:**
- Form submission responds within 2 seconds
- Navigation to 8fold completes within 10 seconds
- No unnecessary network requests
- Smooth user experience during transition

---

## **CROSS-BROWSER TEST CASES**

### **TC-CB-JSS001: Chrome Browser Compatibility**
**Priority:** HIGH  
**Tags:** @CrossBrowser @Chrome

**Test Steps:**
1. Execute all functional tests in Chrome
2. Validate visual rendering consistency
3. Test form submission behavior
4. Check JavaScript functionality
5. Verify responsive behavior
6. Test accessibility features

**Expected Result:**
- All functionality works as expected
- Visual rendering matches design specifications
- No browser-specific issues detected

---

### **TC-CB-JSS002: Firefox Browser Compatibility**
**Priority:** MEDIUM  
**Tags:** @CrossBrowser @Firefox

**Test Steps:**
1. Execute core functional tests in Firefox
2. Validate form behavior differences
3. Check visual rendering variations
4. Test navigation and URL handling
5. Verify accessibility support

**Expected Result:**
- Core functionality consistent with Chrome
- Any visual differences within acceptable range
- Form submission works correctly
- Navigation behavior consistent

---

### **TC-CB-JSS003: Safari/WebKit Browser Compatibility**
**Priority:** MEDIUM  
**Tags:** @CrossBrowser @Safari @WebKit

**Test Steps:**
1. Execute essential functional tests in Safari
2. Test iOS Safari on mobile devices
3. Validate WebKit-specific behaviors
4. Check form input handling
5. Test navigation and URL parameters

**Expected Result:**
- Essential functionality works in Safari
- Mobile Safari displays component correctly
- Form submissions handle URL encoding properly
- WebKit-specific features don't break functionality

---

## **EDGE CASE TEST CASES**

### **TC-E-JSS001: Special Characters and Input Validation**
**Priority:** MEDIUM  
**Tags:** @EdgeCase @InputValidation

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Enter special characters in interest field: "Developer & Engineer (Senior) - C++/Java"
3. Enter international characters in location: "São Paulo, Brazil"
4. Submit search and validate URL encoding
5. Verify 8fold platform handles encoded parameters

**Expected Result:**
- Special characters accepted in input fields
- URL encoding handles all characters correctly
- Search results page receives parameters properly
- No JavaScript errors or crashes

**Test Data:**
- Interest: "Developer & Engineer (Senior) - C++/Java"
- Location: "São Paulo, Brazil"

---

### **TC-E-JSS002: Long Text Input Handling**
**Priority:** LOW  
**Tags:** @EdgeCase @InputValidation

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Enter very long text in interest field (500+ characters)
3. Enter long location name (200+ characters)
4. Test field behavior and form submission
5. Validate URL parameter handling

**Expected Result:**
- Fields accept long input without breaking
- Form submission handles long parameters
- URL doesn't exceed browser limits
- User experience remains acceptable

---

### **TC-E-JSS003: Network Connectivity Issues**
**Priority:** LOW  
**Tags:** @EdgeCase @Network

**Test Steps:**
1. Navigate to Job Search Stage test page
2. Simulate slow network conditions
3. Test form submission behavior
4. Simulate network interruption during submission
5. Verify error handling and user feedback

**Expected Result:**
- Component loads gracefully on slow connections
- Form provides feedback during submission
- Network errors are handled appropriately
- User receives meaningful error messages

---

## **TEST EXECUTION MATRIX**

| **Test Case** | **Priority** | **Chrome** | **Firefox** | **Safari** | **Mobile** | **Automation** |
|---------------|-------------|------------|-------------|------------|------------|----------------|
| TC-JSS001 | HIGH | ✅ | ✅ | ⚠️ | ✅ | ✅ |
| TC-JSS002 | HIGH | ✅ | ✅ | ⚠️ | ✅ | ✅ |
| TC-JSS003 | HIGH | ✅ | ✅ | ⚠️ | ✅ | ✅ |
| TC-JSS004 | HIGH | ✅ | ✅ | ⚠️ | ✅ | ✅ |
| TC-JSS005 | MEDIUM | ✅ | ✅ | ❌ | ⚠️ | ⚠️ |
| TC-JSS006 | MEDIUM | ✅ | ✅ | ❌ | ⚠️ | ⚠️ |
| TC-JSS007 | HIGH | ✅ | ✅ | ✅ | ✅ | ✅ |
| TC-JSS008-011 | HIGH | ✅ | ✅ | ✅ | ✅ | ✅ |
| TC-A-JSS001-004 | HIGH | ✅ | ✅ | ✅ | ✅ | ✅ |
| TC-P-JSS001-002 | MEDIUM | ✅ | ⚠️ | ⚠️ | ✅ | ✅ |

**Legend:**
- ✅ Full testing required
- ⚠️ Smoke testing sufficient
- ❌ Manual testing only

---

## **TRACEABILITY MATRIX**

| **Requirement** | **Test Cases** | **Coverage** |
|----------------|----------------|--------------|
| **AC1: URL Parameters** | TC-JSS001, TC-JSS002, TC-JSS003, TC-E-JSS001 | 100% |
| **AC2: Optional Fields** | TC-JSS002, TC-JSS003, TC-JSS004 | 100% |
| **AC3: Cookie Location Prefill** | TC-JSS005 | 100% |
| **AC4: Auto-suggestions** | TC-JSS006 | 100% |
| **Visual Design** | TC-JSS008, TC-JSS009, TC-JSS010, TC-JSS011, TC-JSS012, TC-JSS013 | 100% |
| **Accessibility** | TC-A-JSS001, TC-A-JSS002, TC-A-JSS003, TC-A-JSS004 | 100% |
| **Performance** | TC-P-JSS001, TC-P-JSS002 | 100% |
| **Cross-Browser** | TC-CB-JSS001, TC-CB-JSS002, TC-CB-JSS003 | 100% |

---

## **IMPLEMENTATION NOTES**

### **Test Environment Setup:**
1. **Base URL:** Use environment-specific URL from `envUtils.getBaseUrl()`
2. **Cookie Handling:** Implement `acceptCookiesBanner()` method for AC3 testing
3. **Navigation Validation:** URL should redirect to `bayer.eightfold.ai/careers`
4. **Selector Strategy:** Use `data-qa` attributes as primary selectors

### **Known Limitations:**
1. **Auto-suggestions (AC4):** May be disabled in test environments
2. **Cookie prefill (AC3):** Requires specific cookie/geolocation setup
3. **Cross-browser:** Some features may have browser-specific behaviors

### **Test Data Management:**
```typescript
const testData = {
  validSearch: {
    interest: "Back End Development",
    location: "Germany"
  },
  specialChars: {
    interest: "Developer & Engineer (Senior) - C++/Java",
    location: "São Paulo, Brazil"
  },
  longText: {
    interest: "A".repeat(500),
    location: "B".repeat(300)
  }
};
```

### **Automation Priority:**
1. **HIGH:** All functional tests (TC-JSS001-007)
2. **MEDIUM:** Visual tests and performance tests
3. **LOW:** Edge cases and manual-specific scenarios

**Total Test Cases:** 25
**Automated Test Cases:** 20
**Manual Test Cases:** 5
**Estimated Execution Time:** 45 minutes (full suite)
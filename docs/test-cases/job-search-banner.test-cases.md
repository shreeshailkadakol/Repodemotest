# Job Search Banner Component - Test Cases Documentation

**Component:** Job Search Banner  
**Created:** October 16, 2025  
**Test Page URL:** https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/JobSearchBanner  
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

### **TC-JSB001: Valid Search Query with Both Fields (AC1)**
**Priority:** HIGH  
**Tags:** @Functional @AC1 @Critical

**Test Steps:**
1. Navigate to Job Search Banner test page
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

### **TC-JSB002: Search with Interest Field Only (AC2)**
**Priority:** HIGH  
**Tags:** @Functional @AC2 @Edge

**Test Steps:**
1. Navigate to Job Search Banner test page
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

### **TC-JSB003: Search with Location Field Only (AC2)**
**Priority:** HIGH  
**Tags:** @Functional @AC2 @Edge

**Test Steps:**
1. Navigate to Job Search Banner test page
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

### **TC-JSB004: Empty Form Search Submission (AC2)**
**Priority:** MEDIUM  
**Tags:** @Functional @AC2 @Edge

**Test Steps:**
1. Navigate to Job Search Banner test page
2. Accept cookie banner if present
3. Leave both fields empty
4. Click search button
5. Validate behavior and URL

**Expected Result:**
- Search submits to 8fold platform
- URL parameters may be empty or missing
- No client-side validation errors prevent submission

---

### **TC-JSB005: Cookie-Based Location Prefill (AC3)**
**Priority:** MEDIUM  
**Tags:** @Functional @AC3 @Cookie

**Test Steps:**
1. Navigate to Job Search Banner test page
2. Accept cookie banner when prompted
3. Allow location access if browser prompts
4. Refresh page or navigate back
5. Check location field for prefilled value
6. Validate prefilled location matches user's country

**Expected Result:**
- Location field is automatically populated
- Value corresponds to user's detected country
- Prefilled value can be modified by user

**Prerequisites:**
- Cookies must be accepted
- Location services may need to be enabled

---

### **TC-JSB006: Auto-Suggestion Functionality (AC4)**
**Priority:** MEDIUM  
**Tags:** @Functional @AC4 @Interactive

**Test Steps:**
1. Navigate to Job Search Banner test page
2. Accept cookie banner if present
3. Click on interest input field
4. Type single character "D"
5. Wait for suggestions to appear
6. Type additional characters "Dev"
7. Validate suggestion dropdown behavior
8. Select suggestion if available

**Expected Result:**
- Dropdown suggestions appear after character input
- Suggestions are relevant to typed text
- User can select from dropdown options
- Selected option populates the input field

**Note:** Auto-suggestions may be disabled in test environment

---

### **TC-JSB007: Form Field Validation and UX**
**Priority:** MEDIUM  
**Tags:** @Functional @UX

**Test Steps:**
1. Navigate to Job Search Banner test page
2. Verify placeholder text in both input fields
3. Test tab navigation between fields
4. Test input field focus states
5. Enter very long text in both fields
6. Test special characters and numbers
7. Validate input field behavior

**Expected Result:**
- Placeholder text displays correctly
- Tab navigation works properly
- Focus states are visible
- Fields handle various input types
- No unexpected character restrictions

---

## **VISUAL TEST CASES**

### **TC-JSB008: XL Viewport Visual Validation (1440px+)**
**Priority:** HIGH  
**Tags:** @Visual @Responsive @XL

**Figma Node ID:** 3265:47481

**Test Steps:**
1. Set viewport to 1440px width
2. Navigate to Job Search Banner test page
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
- **Resume Text**: `quicklink > Text`
- **Upload Button**: `quicklink > Button > Text`

**Visual Properties to Check:**
- Font family, size, line height
- Color values (text, background, borders)
- Spacing and padding
- Component alignment
- Image rendering

---

### **TC-JSB009: LG Viewport Visual Validation (1024px-1439px)**
**Priority:** HIGH  
**Tags:** @Visual @Responsive @LG

**Figma Node ID:** 3265:47517

**Test Steps:**
1. Set viewport to 1200px width
2. Navigate to Job Search Banner test page
3. Extract Figma design tokens for LG viewport
4. Compare visual rendering with design specifications
5. Validate responsive behavior from XL to LG

**Expected Result:**
- Layout adapts properly to LG viewport
- All visual elements match Figma design
- Font sizes and spacing adjust appropriately
- Component maintains visual hierarchy

---

### **TC-JSB010: MD Viewport Visual Validation (768px-1023px)**
**Priority:** HIGH  
**Tags:** @Visual @Responsive @MD

**Figma Node ID:** 3265:47553

**Test Steps:**
1. Set viewport to 900px width
2. Navigate to Job Search Banner test page
3. Extract Figma design tokens for MD viewport
4. Validate tablet layout and visual elements
5. Test form layout on medium screens

**Expected Result:**
- Component layout suitable for tablet devices
- Form elements maintain usability
- Visual hierarchy preserved
- Text remains readable

---

### **TC-JSB011: SM Viewport Visual Validation (320px-767px)**
**Priority:** HIGH  
**Tags:** @Visual @Responsive @SM

**Figma Node ID:** 3265:52875

**Test Steps:**
1. Set viewport to 375px width (mobile)
2. Navigate to Job Search Banner test page
3. Extract Figma design tokens for SM viewport
4. Validate mobile layout and touch targets
5. Test form usability on small screens

**Expected Result:**
- Mobile-optimized layout
- Touch targets meet minimum size requirements
- Form fields are easily accessible
- Visual elements stack appropriately

---

### **TC-JSB012: Font and Typography Validation**
**Priority:** MEDIUM  
**Tags:** @Visual @Typography

**Test Steps:**
1. Extract font specifications from Figma for each viewport
2. Use browser DevTools to inspect computed styles
3. Validate font-family matches design system
4. Check font-size, line-height, font-weight
5. Verify color values for all text elements

**Expected Result:**
- Font families match Figma specifications
- Font sizes scale correctly across viewports
- Line heights provide proper readability
- Color values match design tokens exactly

---

## **ACCESSIBILITY TEST CASES**

### **TC-A-JSB001: Keyboard Navigation**
**Priority:** HIGH  
**Tags:** @Accessibility @Keyboard @WCAG

**Test Steps:**
1. Navigate to Job Search Banner using keyboard only
2. Test Tab navigation through all interactive elements
3. Verify focus indicators are visible
4. Test Enter/Space key activation on search button
5. Ensure focus order is logical and intuitive
6. Test Shift+Tab for reverse navigation

**Expected Result:**
- All interactive elements are keyboard accessible
- Clear focus indicators on all focusable elements
- Logical tab order: Interest field → Location field → Search button
- Enter key submits the form
- No keyboard traps

**WCAG Criteria:** 2.1.1, 2.4.3, 2.4.7

---

### **TC-A-JSB002: Screen Reader Compatibility**
**Priority:** HIGH  
**Tags:** @Accessibility @ScreenReader @WCAG

**Test Steps:**
1. Run automated accessibility scan using axe-core
2. Test with screen reader (NVDA/JAWS simulation)
3. Verify proper aria-labels and descriptions
4. Check form field associations with labels
5. Validate semantic HTML structure
6. Test announcement of form validation messages

**Expected Result:**
- No accessibility violations detected
- Form fields properly labeled and associated
- Screen readers announce all relevant information
- Semantic HTML tags used appropriately (form, input, button)
- Clear instructions and error messages

**WCAG Criteria:** 1.3.1, 2.4.6, 3.3.2, 4.1.2

---

### **TC-A-JSB003: Color Contrast and Visual Accessibility**
**Priority:** HIGH  
**Tags:** @Accessibility @ColorContrast @WCAG

**Test Steps:**
1. Check color contrast ratios for all text elements
2. Test with high contrast mode enabled
3. Verify visibility without color dependencies
4. Check focus indicators meet contrast requirements
5. Test with color blindness simulation
6. Validate visual hierarchy without color

**Expected Result:**
- Text contrast ratio ≥ 4.5:1 (normal text)
- Large text contrast ratio ≥ 3:1
- Focus indicators meet contrast requirements
- Information not conveyed by color alone
- Component usable in high contrast mode

**WCAG Criteria:** 1.4.3, 1.4.11, 2.4.7

---

### **TC-A-JSB004: Form Accessibility and Labels**
**Priority:** HIGH  
**Tags:** @Accessibility @Forms @WCAG

**Test Steps:**
1. Verify all form fields have proper labels
2. Check placeholder text is not the only label
3. Test required field indicators
4. Validate error message association
5. Check autocomplete attributes if present
6. Test form submission feedback

**Expected Result:**
- All inputs have accessible labels (aria-label confirmed)
- Placeholder text supplements, not replaces labels
- Clear indication of required vs optional fields
- Error messages programmatically associated
- Form provides feedback on submission

**WCAG Criteria:** 1.3.1, 1.3.5, 3.3.1, 3.3.3

---

## **PERFORMANCE TEST CASES**

### **TC-P-JSB001: Component Loading Performance**
**Priority:** MEDIUM  
**Tags:** @Performance @Loading

**Test Steps:**
1. Measure time to first paint (FCP) for component
2. Measure time to interactive (TTI)
3. Monitor largest contentful paint (LCP)
4. Check cumulative layout shift (CLS)
5. Measure JavaScript bundle size impact
6. Test performance across different network conditions

**Expected Result:**
- FCP < 1.5 seconds
- TTI < 3 seconds
- LCP < 2.5 seconds
- CLS < 0.1
- No significant performance degradation
- Component loads efficiently on slow connections

**Performance Metrics:**
- Core Web Vitals compliance
- Lighthouse score > 90
- Network payload optimization

---

### **TC-P-JSB002: Search Functionality Performance**
**Priority:** MEDIUM  
**Tags:** @Performance @Search

**Test Steps:**
1. Measure search button response time
2. Test form submission performance
3. Monitor network requests during search
4. Check navigation to 8fold timing
5. Test performance with various input lengths
6. Validate performance across different browsers

**Expected Result:**
- Search button responds < 100ms
- Form submission initiates < 200ms
- Navigation to 8fold completes efficiently
- No performance degradation with longer inputs
- Consistent performance across browsers

---

### **TC-P-JSB003: Auto-Suggestion Performance (If Available)**
**Priority:** LOW  
**Tags:** @Performance @AutoSuggest

**Test Steps:**
1. Measure response time for auto-suggestions
2. Test debouncing behavior
3. Monitor API calls for suggestion data
4. Check memory usage during suggestions
5. Test performance with rapid typing
6. Validate suggestion dropdown rendering

**Expected Result:**
- Suggestions appear < 300ms after typing stops
- Proper debouncing prevents excessive API calls
- No memory leaks from suggestion functionality
- Smooth performance during rapid input
- Dropdown renders without layout shifts

---

## **CROSS-BROWSER TEST CASES**

### **TC-CB-JSB001: Chrome Browser Compatibility**
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

### **TC-CB-JSB002: Firefox Browser Compatibility**
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

### **TC-CB-JSB003: Safari/WebKit Browser Compatibility**
**Priority:** MEDIUM  
**Tags:** @CrossBrowser @Safari

**Test Steps:**
1. Execute critical functional tests in WebKit
2. Test mobile Safari behavior
3. Validate form input handling
4. Check visual rendering on iOS devices
5. Test touch interactions

**Expected Result:**
- Core functionality works on Safari
- Mobile interactions function properly
- Visual rendering acceptable on iOS
- No Safari-specific blocking issues

---

## **EDGE CASE TEST CASES**

### **TC-E-JSB001: Special Characters and Input Validation**
**Priority:** MEDIUM  
**Tags:** @EdgeCase @InputValidation

**Test Steps:**
1. Test special characters in both input fields
2. Enter Unicode characters and emojis
3. Test very long strings (>1000 characters)
4. Enter HTML/JavaScript code snippets
5. Test empty spaces and whitespace-only input
6. Validate URL encoding behavior

**Expected Result:**
- Special characters handled gracefully
- No XSS vulnerabilities exposed
- Long strings handled without breaking layout
- Proper URL encoding for all character types
- Whitespace input handled appropriately

---

### **TC-E-JSB002: Network and Error Conditions**
**Priority:** MEDIUM  
**Tags:** @EdgeCase @Network @ErrorHandling

**Test Steps:**
1. Test search submission with slow network
2. Simulate network interruption during search
3. Test behavior when 8fold is unavailable
4. Check handling of malformed responses
5. Test multiple rapid form submissions
6. Validate timeout scenarios

**Expected Result:**
- Graceful handling of network issues
- User feedback for connection problems
- No duplicate submissions from rapid clicking
- Appropriate error messages displayed
- Component remains functional after errors

---

## **TEST EXECUTION MATRIX**

| **Test Case ID** | **Priority** | **Browser** | **Viewport** | **Status** | **Notes** |
|------------------|--------------|-------------|--------------|------------|-----------|
| TC-JSB001 | HIGH | Chrome | All | Ready | Core AC1 validation |
| TC-JSB002 | HIGH | Chrome | All | Ready | AC2 partial search |
| TC-JSB003 | HIGH | Chrome | All | Ready | AC2 partial search |
| TC-JSB004 | MEDIUM | Chrome | All | Ready | Edge case testing |
| TC-JSB005 | MEDIUM | Chrome | Desktop | Ready | Requires cookie setup |
| TC-JSB006 | MEDIUM | Chrome | All | Ready | May need environment config |
| TC-JSB008 | HIGH | Chrome | XL | Ready | Figma API integration needed |
| TC-JSB009 | HIGH | Chrome | LG | Ready | Figma API integration needed |
| TC-JSB010 | HIGH | Chrome | MD | Ready | Figma API integration needed |
| TC-JSB011 | HIGH | Chrome | SM | Ready | Figma API integration needed |
| TC-A-JSB001 | HIGH | Chrome | All | Ready | Keyboard accessibility |
| TC-A-JSB002 | HIGH | Chrome | All | Ready | Screen reader testing |
| TC-P-JSB001 | MEDIUM | Chrome | All | Ready | Performance monitoring |

---

## **TRACEABILITY MATRIX**

| **Requirement** | **Test Cases** | **Coverage Status** |
|-----------------|----------------|-------------------|
| **AC1: Search query transmission** | TC-JSB001 | ✅ Covered |
| **AC2: Optional fields** | TC-JSB002, TC-JSB003, TC-JSB004 | ✅ Covered |
| **AC3: Cookie location prefill** | TC-JSB005 | ✅ Covered |
| **AC4: Auto-suggestions** | TC-JSB006, TC-P-JSB003 | ✅ Covered |
| **Visual Design Compliance** | TC-JSB008-012 | ✅ Covered |
| **Accessibility Requirements** | TC-A-JSB001-004 | ✅ Covered |
| **Performance Requirements** | TC-P-JSB001-003 | ✅ Covered |
| **Cross-Browser Support** | TC-CB-JSB001-003 | ✅ Covered |
| **Edge Case Handling** | TC-E-JSB001-002 | ✅ Covered |

---

## **IMPLEMENTATION NOTES**

### **Data-QA Locator Strategy:**
```typescript
// Parent-child relationships as per DOM inspection
private readonly mainContainer = this.page.locator('[data-qa="fullwidth-column"]');
private readonly jobSearchForm = this.mainContainer.locator('[aria-label="Job search"]');
private readonly interestInputContainer = this.jobSearchForm.locator('[data-qa="job-search-input"]');
private readonly locationInputContainer = this.jobSearchForm.locator('[data-qa="location-search-input"]');
private readonly searchButton = this.jobSearchForm.locator('[data-qa="search-jobs-button"]');
```

### **Figma Integration:**
- Use colon format node IDs (no hyphens)
- XL: 3265:47481, LG: 3265:47517, MD: 3265:47553, SM: 3265:52875
- Extract font-family, font-size, line-height, color values
- Compare against computed styles in browser

### **Authentication:**
- Component does not require authentication
- Cookie banner acceptance may be needed for AC3 testing
- Use BasePage methods for consistent handling

---

**Test Cases Status:** ✅ **READY FOR REVIEW**  
**Total Test Cases:** 23 test cases covering all requirements  
**Coverage:** Functional (7), Visual (5), Accessibility (4), Performance (3), Cross-Browser (3), Edge Cases (2)  
**Next Step:** User review and approval before implementation
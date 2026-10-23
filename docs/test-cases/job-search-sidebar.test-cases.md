# Job Search SideBar Component - Test Cases Documentation

**Component:** Job Search SideBar  
**Created:** October 24, 2025  
**Test Page URL:** [To be configured - JobSearchSideBarComponent]  
**Figma URL:** https://www.figma.com/design/SjT7wmDrBL41cUiiHNGV5C/Bayer-Beyond-%E2%80%93--UI-Library  
**Node IDs:** XL: 3265:53724, LG: 3265:53728, MD: 3265:53780, SM: 3265:53732  
**Status:** Ready for Implementation  

---

## **Requirements Analysis**

### **Component Differences from Stage:**
- **REMOVED:** "Get job suggestion based on your resume" text
- **REMOVED:** Upload resume functionality and link
- **RETAINED:** All core search functionality (interest field, location field, search button)
- **PURPOSE:** Simplified sidebar version for use in secondary layouts

### **Acceptance Criteria Breakdown:**

| **AC** | **Requirement** | **Test Priority** | **Validation Method** |
|--------|-----------------|-------------------|----------------------|
| **AC1** | Search query + location transmitted to 8fold via URL parameters | **HIGH** | URL parameter validation |
| **AC2** | Optional fields - either field can be empty | **HIGH** | Form submission scenarios |
| **AC3** | Cookie-based location prefill functionality | **MEDIUM** | Cookie acceptance + location prefill |
| **AC4** | Auto-suggestion in "Where are you interested in" field | **MEDIUM** | Character input + dropdown validation |
| **AC5** | No resume upload functionality in sidebar version | **HIGH** | Negative validation - resume elements absent |
| **AC6** | No "Get job suggestion" text in sidebar version | **HIGH** | Negative validation - suggestion text absent |

### **DOM Structure Reference:**
- **Main Container**: `[data-qa="fullwidth-column"]`
- **Interest Input Container**: `[data-qa="job-search-input"]`
- **Location Input Container**: `[data-qa="location-search-input"]`
- **Search Button**: `[data-qa="search-jobs-button"]`
- **Title Element**: `[data-qa="title-component"]`
- **Description Text**: `[data-qa="job-search-intro-text"]`
- **Resume Elements**: Should NOT exist in sidebar version

---

## **FUNCTIONAL TEST CASES**

### **TC-JSSB001: Valid Search Query with Both Fields (AC1)**
**Priority:** HIGH  
**Tags:** @Functional @AC1 @Critical @SideBar

**Test Steps:**
1. Navigate to Job Search SideBar test page
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

### **TC-JSSB002: Search with Interest Field Only (AC2)**
**Priority:** HIGH  
**Tags:** @Functional @AC2 @Edge @SideBar

**Test Steps:**
1. Navigate to Job Search SideBar test page
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

### **TC-JSSB003: Search with Location Field Only (AC2)**
**Priority:** HIGH  
**Tags:** @Functional @AC2 @Edge @SideBar

**Test Steps:**
1. Navigate to Job Search SideBar test page
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

### **TC-JSSB004: Empty Form Search Submission (AC2)**
**Priority:** HIGH  
**Tags:** @Functional @AC2 @Edge @SideBar

**Test Steps:**
1. Navigate to Job Search SideBar test page
2. Accept cookie banner if present
3. Leave both fields empty
4. Click search button
5. Validate navigation and URL

**Expected Result:**
- Navigation to 8fold occurs successfully
- URL contains language parameter: `hl=en`
- General job search page loads without specific filters

---

### **TC-JSSB005: Cookie-Based Location Prefill (AC3)**
**Priority:** MEDIUM  
**Tags:** @Functional @AC3 @Cookie @SideBar

**Test Steps:**
1. Navigate to Job Search SideBar test page
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

### **TC-JSSB006: Auto-Suggestion Functionality (AC4)**
**Priority:** MEDIUM  
**Tags:** @Functional @AC4 @Interactive @SideBar

**Test Steps:**
1. Navigate to Job Search SideBar test page
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

### **TC-JSSB007: Resume Elements Absence Validation (AC5)**
**Priority:** HIGH  
**Tags:** @Functional @AC5 @Negative @SideBar @Critical

**Test Steps:**
1. Navigate to Job Search SideBar test page
2. Accept cookie banner if present
3. Scan entire component for resume-related elements
4. Check for absence of upload resume button/link
5. Check for absence of resume file input
6. Verify no resume-related text or CTAs

**Expected Result:**
- No upload resume button found
- No resume file input elements present
- No text mentioning "resume" or "upload"
- Component focuses only on search functionality

**Validation Selectors:**
- Should NOT exist: `[data-qa*="resume"]`
- Should NOT exist: `[data-qa*="upload"]`
- Should NOT exist: `input[type="file"]`

---

### **TC-JSSB008: Job Suggestion Text Absence Validation (AC6)**
**Priority:** HIGH  
**Tags:** @Functional @AC6 @Negative @SideBar @Critical

**Test Steps:**
1. Navigate to Job Search SideBar test page
2. Accept cookie banner if present
3. Read all visible text content in component
4. Verify absence of "Get job suggestion" text
5. Verify absence of resume-based suggestion messaging

**Expected Result:**
- No text containing "Get job suggestion based on your resume"
- No text encouraging resume upload for suggestions
- Component messaging focuses only on direct search

**Text Validation:**
- Should NOT contain: "Get job suggestion"
- Should NOT contain: "based on your resume"
- Should contain: Standard search messaging only

---

### **TC-JSSB009: Form Field Validation and UX**
**Priority:** HIGH  
**Tags:** @Functional @UX @Validation @SideBar

**Test Steps:**
1. Navigate to Job Search SideBar test page
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

### **TC-JSSB010: XL Viewport Visual Validation (1440px+)**
**Priority:** HIGH  
**Tags:** @Visual @Responsive @XL @SideBar

**Figma Node ID:** 3265:53724

**Test Steps:**
1. Set viewport to 1440px width
2. Navigate to Job Search SideBar test page
3. Accept cookie banner if present
4. Take full component screenshot
5. Compare with Figma design specifications
6. Validate typography and spacing

**Expected Result:**
- Component matches XL viewport Figma design
- Title: 48px Bayer Sans Bold, white color
- Description: 20px Bayer Sans Regular, white color  
- Input fields: 18px font size, proper spacing
- Button: 14px Medium Italic, correct colors
- No resume elements visible

**Visual Checkpoints:**
- ✅ Title typography (48px/700/56px line-height)
- ✅ Description typography (20px/400/30px line-height)
- ✅ Input field styling and placeholder text
- ✅ Button styling and uppercase text
- ✅ Overall spacing and layout
- ✅ Absence of resume elements

---

### **TC-JSSB011: LG Viewport Visual Validation (1024px)**
**Priority:** HIGH  
**Tags:** @Visual @Responsive @LG @SideBar

**Figma Node ID:** 3265:53728

**Test Steps:**
1. Set viewport to 1024px width
2. Navigate to Job Search SideBar test page
3. Accept cookie banner if present
4. Take full component screenshot
5. Compare with Figma design specifications
6. Validate responsive behavior

**Expected Result:**
- Component adapts to LG viewport correctly
- Typography maintains same sizes as XL
- Layout remains centered and well-spaced
- All elements properly responsive
- No resume elements visible

---

### **TC-JSSB012: MD Viewport Visual Validation (768px)**
**Priority:** HIGH  
**Tags:** @Visual @Responsive @MD @SideBar

**Figma Node ID:** 3265:53780

**Test Steps:**
1. Set viewport to 768px width
2. Navigate to Job Search SideBar test page
3. Accept cookie banner if present
4. Take full component screenshot
5. Compare with Figma design specifications
6. Validate mobile adaptation

**Expected Result:**
- Component adapts to MD viewport correctly
- Title: 30px font size, 36px line-height
- Description: maintains readability
- Form elements stack properly
- No resume elements visible

---

### **TC-JSSB013: SM Viewport Visual Validation (375px)**
**Priority:** HIGH  
**Tags:** @Visual @Responsive @SM @SideBar

**Figma Node ID:** 3265:53732

**Test Steps:**
1. Set viewport to 375px width
2. Navigate to Job Search SideBar test page
3. Accept cookie banner if present
4. Take full component screenshot
5. Compare with Figma design specifications
6. Validate mobile layout

**Expected Result:**
- Component fully responsive on mobile
- Title: 30px font size, maintains hierarchy
- All form elements accessible on small screen
- Touch-friendly button sizing
- No resume elements visible

---

## **ACCESSIBILITY TEST CASES**

### **TC-JSSB014: Keyboard Navigation and Focus Management**
**Priority:** HIGH  
**Tags:** @Accessibility @Keyboard @WCAG @SideBar

**Test Steps:**
1. Navigate to Job Search SideBar test page using only keyboard
2. Tab through all interactive elements
3. Verify focus indicators are visible
4. Test form submission with Enter key
5. Verify skip links and focus management

**Expected Result:**
- All interactive elements reachable via keyboard
- Clear focus indicators on all elements
- Logical tab order: Interest → Location → Button
- Enter key submits form from any field
- Focus management meets WCAG 2.1 standards

---

### **TC-JSSB015: Screen Reader Compatibility**
**Priority:** HIGH  
**Tags:** @Accessibility @ScreenReader @WCAG @SideBar

**Test Steps:**
1. Navigate to Job Search SideBar test page with screen reader active
2. Verify component has proper heading structure
3. Check form labels and descriptions
4. Validate button and link announcements
5. Test form error announcements (if applicable)

**Expected Result:**
- Component properly announced as job search form
- All form fields have accessible labels
- Button purpose clearly announced
- Heading hierarchy is logical
- No resume-related elements announced

---

## **PERFORMANCE TEST CASES**

### **TC-JSSB016: Component Load Time Measurement**
**Priority:** MEDIUM  
**Tags:** @Performance @LoadTime @SideBar

**Test Steps:**
1. Clear browser cache and cookies
2. Navigate to Job Search SideBar test page
3. Measure First Contentful Paint (FCP)
4. Measure Largest Contentful Paint (LCP)
5. Record Total Blocking Time (TBT)
6. Measure Cumulative Layout Shift (CLS)

**Expected Result:**
- FCP: < 1.8 seconds
- LCP: < 2.5 seconds  
- TBT: < 200ms
- CLS: < 0.1
- Component loads without performance bottlenecks

---

## **CROSS-BROWSER TEST CASES**

### **TC-JSSB017: Chrome Browser Compatibility**
**Priority:** HIGH  
**Tags:** @CrossBrowser @Chrome @SideBar

**Test Steps:**
1. Open Job Search SideBar test page in Chrome
2. Execute core functionality tests (TC-JSSB001-004)
3. Verify visual consistency
4. Test form interactions
5. Validate search submission

**Expected Result:**
- All functionality works as expected in Chrome
- Visual rendering matches design specifications
- Form submission successful
- No console errors

---

### **TC-JSSB018: Firefox Browser Compatibility**
**Priority:** MEDIUM  
**Tags:** @CrossBrowser @Firefox @SideBar

**Test Steps:**
1. Open Job Search SideBar test page in Firefox
2. Execute core functionality tests
3. Verify visual consistency
4. Test form interactions
5. Validate search submission

**Expected Result:**
- All functionality works as expected in Firefox
- Visual rendering consistent with Chrome
- Form submission successful
- No browser-specific issues

---

### **TC-JSSB019: Safari Browser Compatibility**
**Priority:** MEDIUM  
**Tags:** @CrossBrowser @Safari @SideBar

**Test Steps:**
1. Open Job Search SideBar test page in Safari
2. Execute core functionality tests
3. Verify visual consistency
4. Test form interactions
5. Validate search submission

**Expected Result:**
- All functionality works as expected in Safari
- Visual rendering consistent with other browsers
- Form submission successful
- No Safari-specific issues

---

## **INTEGRATION TEST CASES**

### **TC-JSSB020: 8fold Platform Integration**
**Priority:** HIGH  
**Tags:** @Integration @8fold @SideBar

**Test Steps:**
1. Navigate to Job Search SideBar test page
2. Enter valid search parameters
3. Submit form and wait for redirect
4. Verify successful integration with 8fold platform
5. Check URL parameter transmission
6. Validate search results page loads

**Expected Result:**
- Successful redirect to 8fold platform
- Search parameters correctly transmitted
- Search results page displays relevant jobs
- Integration works seamlessly

---

## **TEST EXECUTION SUMMARY**

### **Test Case Distribution:**
- **Functional Tests:** 9 test cases (TC-JSSB001-009)
- **Visual Tests:** 4 test cases (TC-JSSB010-013)
- **Accessibility Tests:** 2 test cases (TC-JSSB014-015)  
- **Performance Tests:** 1 test case (TC-JSSB016)
- **Cross-Browser Tests:** 3 test cases (TC-JSSB017-019)
- **Integration Tests:** 1 test case (TC-JSSB020)

### **Priority Breakdown:**
- **HIGH Priority:** 15 test cases
- **MEDIUM Priority:** 5 test cases

### **Key Differences from Stage Component:**
1. **Negative validation tests** for resume functionality absence
2. **Sidebar-specific** visual validation 
3. **Simplified component focus** without suggestion features
4. **Same core search functionality** as stage component

### **Test Environment Requirements:**
- Modern browsers (Chrome, Firefox, Safari)
- Various viewport sizes (375px - 1440px+)
- Cookie/session management capability
- 8fold platform integration access
- Screen reader testing tools
- Performance measurement tools

---

**Document Version:** 1.0  
**Last Updated:** October 24, 2025  
**Created By:** Test Automation Framework  
**Review Status:** Ready for Implementation
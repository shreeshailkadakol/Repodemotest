# Test Cases - Site Search Featured Search Results Component

**Component**: Featured Search Results  
**User Story**: 1651 - Site Search – Featured Search Results component  
**Test Page**: https://bayer-beyond-qa-uk.vercel.app/en-gb/search  
**Test Coverage**: 32 test cases (12 Functional + 8 Accessibility + 4 Performance + 8 Visual)  
**Date Created**: 2026-04-01  
**Status**: Ready for Review

---

## 📋 Test Scope

### ✅ **In Scope** (Frontend Validation - AC3)
- Featured Results component rendering on search results page
- Component visibility when search terms match
- Featured result cards display (1-3 cards with image, tags, title, description)
- Card clickability and navigation
- Component positioning (above regular search results)
- Component persistence during pagination
- Visual styling and responsive behavior
- Accessibility compliance
- Performance metrics

### ❌ **Out of Scope** (CMS Functionality - AC1, AC2)
- Creating/updating/removing Featured Search Results in CMS
- Managing title text in CMS
- Search term configuration in CMS
- Featured results content curation

---

## 🎯 Prerequisites

- Test environment: QA (bayer-beyond-qa-uk.vercel.app)
- Authentication: HTTP Basic Auth (bayercorp / beyond2025)
- Search term with featured results configured: "Bayer Beyond"
- Browser: Chromium (primary), Firefox, WebKit (cross-browser)
- Viewports: XL (1440x900), LG (1024x800), MD (768x1024), SM (375x667)

---

## I. Functional Test Cases (@Functional)

### **TC-FSR-F001: Verify Featured Results Section Appears for Configured Search Term**
**Priority**: P0 - Critical  
**User Story**: US-1651 AC3  
**Test Type**: Positive

**Preconditions**:
- Navigate to search page: `/en-gb/search`
- Cookie banner accepted

**Test Steps**:
1. Locate search input field with placeholder "What are you looking for?"
2. Enter search query: "Bayer Beyond"
3. Press Enter or click search button
4. Wait for search results page to load
5. Verify results count is displayed
6. Locate Featured Results section

**Expected Results**:
- Featured Results section is visible
- Section appears ABOVE regular search results
- Section contains heading text "Featured Results"
- Section has elevated background styling
- 1-3 featured result cards are displayed

**Validation Points**:
- `expect(featuredResultsSection).toBeVisible()`
- Featured section is 2nd child of search-results container
- Heading contains text matching /featured results/i
- Cards display with proper structure

---

### **TC-FSR-F002: Verify Featured Results Section Position Above Regular Results**
**Priority**: P0 - Critical  
**User Story**: US-1651 AC3  
**Test Type**: Positive

**Test Steps**:
1. Perform search for "Bayer Beyond"
2. Wait for results to load
3. Get bounding box of Featured Results section
4. Get bounding box of first regular search result
5. Compare Y-coordinates

**Expected Results**:
- Featured Results section Y-coordinate < first regular result Y-coordinate
- Visual separation exists between sections
- Featured section is prominently displayed

**Validation Points**:
- Featured section appears before news-list-item results
- Proper spacing and visual hierarchy maintained

---

### **TC-FSR-F003: Verify Featured Result Card Structure**
**Priority**: P0 - Critical  
**User Story**: US-1651 AC3  
**Test Type**: Positive

**Test Steps**:
1. Navigate to search results with Featured Results
2. Locate first featured result card
3. Inspect card elements

**Expected Results**:
Each featured card contains:
- ✅ **Image** (from Stage component or OpenGraph)
- ✅ **Classification Tags** (e.g., "Company Information")
- ✅ **Headline/Title** (H3 or similar heading)
- ✅ **Description** (if available from metatags)
- ✅ **Clickable link** wrapping the card

**Validation Points**:
- Card uses `<section>` element
- Image has src and alt attributes
- Tags display with proper styling
- Title is not empty
- Card has href attribute for navigation

---

### **TC-FSR-F004: Verify Featured Results Display Limit (1-3 Cards)**
**Priority**: P1 - High  
**User Story**: US-1651 AC3  
**Test Type**: Positive

**Test Steps**:
1. Perform search for configured term
2. Count featured result cards displayed
3. Verify count is within limits

**Expected Results**:
- Minimum: 1 featured result card
- Maximum: 3 featured result cards
- No more than 3 cards displayed simultaneously

**Validation Points**:
- `expect(featuredCards.count()).toBeGreaterThanOrEqual(1)`
- `expect(featuredCards.count()).toBeLessThanOrEqual(3)`

---

### **TC-FSR-F005: Verify Featured Result Card Navigation**
**Priority**: P0 - Critical  
**User Story**: US-1651 AC3  
**Test Type**: Positive

**Test Steps**:
1. Navigate to search results with Featured Results
2. Get href attribute from first featured card
3. Click on featured card
4. Wait for navigation to complete

**Expected Results**:
- Card is clickable
- Navigation occurs to featured page
- URL changes to the featured page link
- Target page loads successfully

**Validation Points**:
- Card has href attribute
- Click triggers navigation
- No JavaScript errors occur
- Page loads within acceptable time

---

### **TC-FSR-F006: Verify Featured Results Section Title Display**
**Priority**: P1 - High  
**User Story**: US-1651 AC3  
**Test Type**: Positive

**Test Steps**:
1. Navigate to search results with Featured Results
2. Locate section title element
3. Verify title text and styling

**Expected Results**:
- Title displays: "Featured Results"
- Typography: text-xl, font-bold (per DOM inspection)
- Title is properly positioned above cards
- Text color meets contrast requirements

**Validation Points**:
- Title element is visible
- Text content matches expected value
- Styling classes applied correctly

---

### **TC-FSR-F007: Verify Featured Results Persist on Pagination**
**Priority**: P1 - High  
**User Story**: US-1651 AC3  
**Test Type**: Positive

**Test Steps**:
1. Perform search returning multiple pages of results
2. Note Featured Results displayed on page 1
3. Navigate to page 2 of results
4. Check if Featured Results still visible
5. Navigate to page 3
6. Verify persistence

**Expected Results**:
- Featured Results remain visible on all result pages
- Same featured cards display across pagination
- Section position remains consistent
- No re-fetching or flickering

**Validation Points**:
- Featured section visible on page 2, 3, etc.
- Card content remains identical
- No layout shifts occur

---

### **TC-FSR-F008: Verify Case-Insensitive Search Term Matching**
**Priority**: P1 - High  
**User Story**: US-1651 AC3  
**Test Type**: Positive

**Test Steps**:
1. Search with lowercase: "bayer beyond"
2. Verify Featured Results appear
3. Search with uppercase: "BAYER BEYOND"
4. Verify Featured Results appear
5. Search with mixed case: "BaYeR BeYoNd"
6. Verify Featured Results appear

**Expected Results**:
- Featured Results display for all case variations
- Same featured cards shown regardless of case
- Matching is case-insensitive as per requirement

**Validation Points**:
- Component visible for lowercase search
- Component visible for uppercase search
- Component visible for mixed case search

---

### **TC-FSR-F009: Verify No Featured Results for Non-Configured Terms**
**Priority**: P1 - High  
**User Story**: US-1651 AC3  
**Test Type**: Negative

**Test Steps**:
1. Search for term without featured results: "random12345"
2. Wait for results to load
3. Check for Featured Results section presence

**Expected Results**:
- Featured Results section NOT displayed
- Only regular search results shown
- No errors or empty featured section shown

**Validation Points**:
- Featured Results heading not present
- Search results display normally
- No broken or empty featured containers

---

### **TC-FSR-F010: Verify Featured Result Card Hover Effect**
**Priority**: P2 - Medium  
**User Story**: US-1651 AC3  
**Test Type**: Positive

**Test Steps**:
1. Navigate to search results with Featured Results
2. Hover mouse over first featured card
3. Observe visual changes
4. Move mouse away
5. Verify state returns to normal

**Expected Results**:
- Card has hover effect (transform, color change, etc.)
- Visual feedback indicates interactivity
- Transition is smooth (duration ~200ms per DOM)
- Card returns to normal state on mouse leave

**Validation Points**:
- Hover state styling applied
- Transform/visual change detected
- Transition duration appropriate

---

### **TC-FSR-F011: Verify Featured Results Section Background Styling**
**Priority**: P2 - Medium  
**User Story**: US-1651 AC3  
**Test Type**: Positive

**Test Steps**:
1. Navigate to search results with Featured Results
2. Inspect Featured Results container background
3. Verify elevated background class applied

**Expected Results**:
- Container has `bg-background-bg-elevated` class
- Background color distinguishes section from regular results
- Padding applied: px-5 lg:px-8, pt-8
- Margins applied: mt-6

**Validation Points**:
- Elevated background class present
- Visual distinction from surrounding content
- Proper spacing around content

---

### **TC-FSR-F012: Verify Responsive Layout (Mobile to Desktop)**
**Priority**: P1 - High  
**User Story**: US-1651 AC3  
**Test Type**: Cross-viewport

**Test Steps**:
1. Load search results on SM viewport (375x667)
2. Verify Featured Results display
3. Change to MD viewport (768x1024)
4. Verify layout adjustment
5. Change to LG viewport (1024x800)
6. Verify layout
7. Change to XL viewport (1440x900)
8. Verify layout

**Expected Results**:
**SM/MD (Mobile)**:
- Cards stack vertically (flex-col)
- Full-width cards
- Images above text content

**LG/XL (Desktop)**:
- Cards in horizontal row (flex-row) if space allows
- Side-by-side layout utilized
- Responsive gap between cards (gap-8)

**Validation Points**:
- Layout changes appropriately per viewport
- No horizontal scrollbars
- Content readable at all sizes
- Images scale properly

---

## II. Accessibility Test Cases (@Accessibility)

### **TC-FSR-A001: Verify Semantic HTML Structure**
**Priority**: P0 - Critical  
**WCAG**: 1.3.1 (Info and Relationships)  
**Test Type**: Structural

**Test Steps**:
1. Navigate to Featured Results section
2. Inspect HTML structure
3. Verify proper semantic elements used

**Expected Results**:
- Section container uses semantic `<div>` with proper role
- Heading uses proper heading level (H2/H3)
- Cards use `<section>` or `<article>` elements
- Images have proper `<img>` tags
- Links use `<a>` elements

**Validation Points**:
- Proper heading hierarchy maintained
- No div-soup for semantic content
- Screen readers can navigate structure
- Axe-core audit: 0 violations

---

### **TC-FSR-A002: Verify Keyboard Navigation Through Featured Cards**
**Priority**: P0 - Critical  
**WCAG**: 2.1.1 (Keyboard)  
**Test Type**: Keyboard Navigation

**Test Steps**:
1. Navigate to search results page
2. Tab to Featured Results section
3. Press Tab to navigate between cards
4. Press Enter to activate focused card
5. Verify navigation occurs

**Expected Results**:
- All featured cards are keyboard accessible
- Tab order is logical (top to bottom, left to right)
- Focus indicators are visible
- Enter key activates card navigation
- No keyboard traps

**Validation Points**:
- `await page.keyboard.press('Tab')` reaches all cards
- Focus outline visible on all interactive elements
- Enter keypress triggers navigation

---

### **TC-FSR-A003: Verify Screen Reader Compatibility**
**Priority**: P0 - Critical  
**WCAG**: 4.1.2 (Name, Role, Value)  
**Test Type**: Screen Reader

**Test Steps**:
1. Enable screen reader testing mode
2. Navigate to Featured Results section
3. Verify section is announced
4. Navigate to each card
5. Verify card content announced

**Expected Results**:
- Section heading "Featured Results" announced
- Number of cards announced
- Each card's content announced (image alt, title, description)
- Links announced as clickable
- Proper ARIA labels present if needed

**Validation Points**:
- Heading announced correctly
- Image alt text present and descriptive
- Link purpose clear from context
- No redundant or confusing announcements

---

### **TC-FSR-A004: Verify Focus Indicators Visible**
**Priority**: P0 - Critical  
**WCAG**: 2.4.7 (Focus Visible)  
**Test Type**: Visual Focus

**Test Steps**:
1. Navigate with keyboard to Featured Results
2. Tab through all interactive elements
3. Verify focus ring/outline visible on each
4. Check focus indicator contrast

**Expected Results**:
- Focus outline visible on all interactive elements
- Contrast ratio ≥ 3:1 against background
- Focus indicator not hidden by CSS
- Indicator clearly shows current focus

**Validation Points**:
- Visual focus ring present on Tab
- Adequate contrast for visibility
- No `outline: none` without replacement

---

### **TC-FSR-A005: Verify Image Alt Text Present**
**Priority**: P0 - Critical  
**WCAG**: 1.1.1 (Non-text Content)  
**Test Type**: Content

**Test Steps**:
1. Locate all images in Featured Results cards
2. Verify each image has alt attribute
3. Check alt text is descriptive

**Expected Results**:
- All images have alt attribute
- Alt text describes image content meaningfully
- Empty alt="" for decorative images only
- No missing alt attributes

**Validation Points**:
- `expect(image).toHaveAttribute('alt')`
- Alt text length > 0 for content images
- Alt text relevant to featured page

---

### **TC-FSR-A006: Verify Color Contrast Compliance**
**Priority**: P0 - Critical  
**WCAG**: 1.4.3 (Contrast Minimum)  
**Test Type**: Visual

**Test Steps**:
1. Extract text color from Featured Results title
2. Extract background color
3. Calculate contrast ratio
4. Repeat for card text
5. Repeat for classification tags

**Expected Results**:
- Title text contrast ≥ 4.5:1 (normal text)
- Card description contrast ≥ 4.5:1
- Large text (18pt+) contrast ≥ 3:1
- Tags text contrast ≥ 4.5:1

**Validation Points**:
- Axe-core color-contrast check passes
- Manual contrast calculation meets WCAG AA
- Text readable on all backgrounds

---

### **TC-FSR-A007: Verify Link Purpose Clear**
**Priority**: P1 - High  
**WCAG**: 2.4.4 (Link Purpose in Context)  
**Test Type**: Content

**Test Steps**:
1. Inspect each featured card link
2. Verify link text or aria-label describes destination
3. Check if context makes purpose clear

**Expected Results**:
- Link text describes destination page
- If generic text, aria-label provides context
- Link purpose understandable without visual context
- Screen reader users can determine link function

**Validation Points**:
- Link has descriptive text or aria-label
- Purpose clear from card content
- No "click here" or ambiguous link text

---

### **TC-FSR-A008: Verify No Accessibility Violations (Axe-Core)**
**Priority**: P0 - Critical  
**WCAG**: All applicable criteria  
**Test Type**: Automated Audit

**Test Steps**:
1. Navigate to search results with Featured Results
2. Run axe-core accessibility audit
3. Focus audit on Featured Results section
4. Review all violations

**Expected Results**:
- 0 critical violations
- 0 serious violations
- Moderate/minor violations documented
- All WCAG 2.1 AA criteria met

**Validation Points**:
- `await new AxeBuilder({ page }).analyze()`
- violations.length === 0 for critical
- All issues have remediation plan

---

## III. Performance Test Cases (@Performance)

### **TC-FSR-P001: Verify Featured Results Section Load Time**
**Priority**: P1 - High  
**Test Type**: Performance Benchmark

**Test Steps**:
1. Start performance measurement
2. Perform search for "Bayer Beyond"
3. Wait for Featured Results to be visible
4. End measurement
5. Calculate time elapsed

**Expected Results**:
- Featured Results visible within 3 seconds of search
- No significant delay after regular results load
- Smooth rendering without jank
- Layout stable (no CLS)

**Validation Points**:
- `performance.mark()` and `performance.measure()`
- Load time < 3000ms
- No noticeable lag to users

---

### **TC-FSR-P002: Verify Image Loading Performance**
**Priority**: P2 - Medium  
**Test Type**: Resource Loading

**Test Steps**:
1. Monitor network requests
2. Perform search triggering Featured Results
3. Measure image load times
4. Check for lazy loading implementation

**Expected Results**:
- Images load progressively  
- Lazy loading applied where appropriate
- No blocking of main content
- Images optimized (WebP/modern formats)

**Validation Points**:
- Image load time < 2 seconds
- LCP (Largest Contentful Paint) < 2.5s
- No render-blocking images

---

### **TC-FSR-P003: Verify No Memory Leaks on Pagination**
**Priority**: P2 - Medium  
**Test Type**: Memory Usage

**Test Steps**:
1. Measure initial memory usage
2. Navigate through multiple result pages (10 pages)
3. Verify Featured Results remain displayed
4. Measure final memory usage
5. Check for significant memory growth

**Expected Results**:
- Memory usage stable across pagination
- No memory leaks from repeated renders
- Featured Results don't cause accumulation
- Browser remains responsive

**Validation Points**:
- Memory growth < 10% after 10 page navigations
- No console errors related to memory
- Performance metrics stable

---

### **TC-FSR-P004: Verify Search Response Time with Featured Results**
**Priority**: P1 - High  
**Test Type**: API Performance

**Test Steps**:
1. Start network monitoring
2. Perform search for "Bayer Beyond"
3. Measure time to first response
4. Measure time to Featured Results display
5. Compare with search without featured results

**Expected Results**:
- Search API response < 1 second
- Featured Results add < 500ms overhead
- Total search experience < 3 seconds
- No timeout errors

**Validation Points**:
- API response time measured
- Featured Results render quickly
- User perceives fast search

---

## IV. Visual Test Cases (@Visual)

### **TC-FSR-V001: Verify Featured Results Title Typography (All Viewports)**
**Priority**: P1 - High  
**Figma Reference**: Node 4528-158564 (XL), 4528-158570 (LG), 4528-158566 (MD), 4528-158568 (SM)  
**Test Type**: Visual Validation

**Test Steps**:
1. Navigate to Featured Results section
2. For each viewport (XL, LG, MD, SM):
   - Extract title font-family
   - Extract font-size
   - Extract line-height
   - Extract font-weight
   - Extract color
3. Compare with Figma design values

**Expected Results** (Example - update with actual Figma values):
**XL Viewport**:
- Font-family: Inter, sans-serif
- Font-size: 24px (text-xl)
- Line-height: 32px (leading-xl)
- Font-weight: 700 (font-bold)
- Color: #1A1A1A (text-text)

**Validation Points**:
- All typography values match Figma ±1px
- Soft assertions for each property
- Visual regression screenshot comparison

---

### **TC-FSR-V002: Verify Featured Card Spacing and Layout (All Viewports)**
**Priority**: P1 - High  
**Test Type**: Visual Layout

**Test Steps**:
1. For each viewport:
   - Measure gap between cards
   - Measure padding inside cards
   - Measure margins around section
2. Compare with Figma spec

**Expected Results**:
**XL/LG Viewport**:
- Gap between cards: 32px (gap-8)
- Section padding: 32px horizontal (lg:px-8)
- Section padding: 32px top (pt-8)

**SM/MD Viewport**:
- Gap between cards: 32px (gap-8)
- Section padding: 20px horizontal (px-5)
- Cards stack vertically (flex-col)

**Validation Points**:
- Spacing values match design
- Layout adapts correctly per viewport
- Visual consistency maintained

---

### **TC-FSR-V003: Verify Classification Tags Visual Styling**
**Priority**: P2 - Medium  
**Test Type**: Visual Component

**Test Steps**:
1. Locate classification tags within featured cards
2. Extract tag styling properties:
   - Background color
   - Text color
   - Border radius
   - Padding
   - Font-size

**Expected Results**:
- Tags display as chip/pill components
- Proper color contrast
- Consistent spacing
- Matches design system

**Validation Points**:
- Tag styling matches design spec
- Multiple tags align properly
- Responsive sizing

---

### **TC-FSR-V004: Verify Hover State Visual Feedback**
**Priority**: P2 - Medium  
**Test Type**: Interactive Styling

**Test Steps**:
1. Hover over featured card
2. Capture hover state screenshot
3. Verify visual changes occur
4. Check transition smoothness

**Expected Results**:
- Transform applied (translate-x-4 per DOM)
- Transition duration: 200ms
- Easing: cubic-bezier(0,0,0.58,1)
- Color changes if applicable
- Shadow/elevation change if designed

**Validation Points**:
- Hover state visually distinct
- Transition smooth, not jarring
- Returns to normal on mouse leave

---

### **TC-FSR-V005: Verify Featured Results Background Color**
**Priority**: P2 - Medium  
**Test Type**: Visual Styling

**Test Steps**:
1. Extract background color of Featured Results container
2. Compare with design system color token
3. Verify elevated background class applied

**Expected Results**:
- Background: bg-background-bg-elevated
- Color distinguishes from page background
- Sufficient contrast with text
- Matches design specification

**Validation Points**:
- Color value matches token
- Visual separation from surrounding content
- Consistent across themes (if applicable)

---

### **TC-FSR-V006: Verify Image Aspect Ratio and Sizing**
**Priority**: P2 - Medium  
**Test Type**: Visual Asset

**Test Steps**:
1. Locate images in featured cards
2. Measure image dimensions
3. Calculate aspect ratio
4. Verify proper scaling

**Expected Results**:
- Images maintain aspect ratio
- No distortion or stretching
- Proper object-fit applied
- Responsive sizing
- Max-width constraints respected

**Validation Points**:
- Aspect ratio preserved
- Images scale appropriately
- No layout breaks with large/small images

---

### **TC-FSR-V007: Verify Responsive Layout Reflow (Visual)**
**Priority**: P1 - High  
**Test Type**: Visual Regression

**Test Steps**:
1. Capture screenshot on XL viewport
2. Capture screenshot on LG viewport
3. Capture screenshot on MD viewport
4. Capture screenshot on SM viewport
5. Compare layouts visually

**Expected Results**:
- Cards reflow from row to column gracefully
- No overlapping content
- Proper spacing maintained
- Images resize appropriately
- Text remains readable

**Validation Points**:
- Percy snapshot comparison
- No visual regressions
- Layout matches responsive design
- All viewports render correctly

---

### **TC-FSR-V008: Verify Section Divider/Border (If Applicable)**
**Priority**: P3 - Low  
**Test Type**: Visual Detail

**Test Steps**:
1. Inspect bottom of Featured Results section
2. Check for divider/border separating from regular results
3. Verify styling

**Expected Results**:
- Visual separation between sections
-Border/divider styled appropriately
- Matches design specification
- Enhances visual hierarchy

**Validation Points**:
- Divider present and styled
- Consistent across viewports
- Matches design system

---

## V. Traceability Matrix

| Test Case ID | Requirement | AC | Priority | Type | Status |
|--------------|-------------|-----|----------|------|--------|
| TC-FSR-F001 | US-1651 | AC3 | P0 | Functional | Ready |
| TC-FSR-F002 | US-1651 | AC3 | P0 | Functional | Ready |
| TC-FSR-F003 | US-1651 | AC3 | P0 | Functional | Ready |
| TC-FSR-F004 | US-1651 | AC3 | P1 | Functional | Ready |
| TC-FSR-F005 | US-1651 | AC3 | P0 | Functional | Ready |
| TC-FSR-F006 | US-1651 | AC3 | P1 | Functional | Ready |
| TC-FSR-F007 | US-1651 | AC3 | P1 | Functional | Ready |
| TC-FSR-F008 | US-1651 | AC3 | P1 | Functional | Ready |
| TC-FSR-F009 | US-1651 | AC3 | P1 | Functional | Ready |
| TC-FSR-F010 | US-1651 | AC3 | P2 | Functional | Ready |
| TC-FSR-F011 | US-1651 | AC3 | P2 | Functional | Ready |
| TC-FSR-F012 | US-1651 | AC3 | P1 | Functional | Ready |
| TC-FSR-A001 | WCAG 1.3.1 | AC3 | P0 | Accessibility | Ready |
| TC-FSR-A002 | WCAG 2.1.1 | AC3 | P0 | Accessibility | Ready |
| TC-FSR-A003 | WCAG 4.1.2 | AC3 | P0 | Accessibility | Ready |
| TC-FSR-A004 | WCAG 2.4.7 | AC3 | P0 | Accessibility | Ready |
| TC-FSR-A005 | WCAG 1.1.1 | AC3 | P0 | Accessibility | Ready |
| TC-FSR-A006 | WCAG 1.4.3 | AC3 | P0 | Accessibility | Ready |
| TC-FSR-A007 | WCAG 2.4.4 | AC3 | P1 | Accessibility | Ready |
| TC-FSR-A008 | WCAG All | AC3 | P0 | Accessibility | Ready |
| TC-FSR-P001 | Performance | AC3 | P1 | Performance | Ready |
| TC-FSR-P002 | Performance | AC3 | P2 | Performance | Ready |
| TC-FSR-P003 | Performance | AC3 | P2 | Performance | Ready |
| TC-FSR-P004 | Performance | AC3 | P1 | Performance | Ready |
| TC-FSR-V001 | Figma Design | AC3 | P1 | Visual | Ready |
| TC-FSR-V002 | Figma Design | AC3 | P1 | Visual | Ready |
| TC-FSR-V003 | Figma Design | AC3 | P2 | Visual | Ready |
| TC-FSR-V004 | Figma Design | AC3 | P2 | Visual | Ready |
| TC-FSR-V005 | Figma Design | AC3 | P2 | Visual | Ready |
| TC-FSR-V006 | Figma Design | AC3 | P2 | Visual | Ready |
| TC-FSR-V007 | Figma Design | AC3 | P1 | Visual | Ready |
| TC-FSR-V008 | Figma Design | AC3 | P3 | Visual | Ready |

**Total Test Cases**: 32  
**Coverage**: AC3 (Frontend Display) - 100%

---

## VI. Known Limitations

1. **No data-qa Attributes**: Featured Results section lacks data-qa attributes.  
   - **Impact**: Tests will rely on CSS classes and text content for identification
   - **Mitigation**: Use SmartLocator with multiple fallback strategies

2. **Featured Results Configuration**: Test depends on "Bayer Beyond" having configured featured results.
   - **Impact**: Test may fail if configuration changes
   - **Mitigation**: Document dependency, coordinate with CMS team

3. **Dynamic Content**: Featured card content generated from target pages.
   - **Impact**: Exact text/images may vary over time
   - **Mitigation**: Use structural validation, avoid hardcoded content assertions

---

## VII. Notes for Test Implementation

### **SmartLocator Strategy** (Given NO data-qa)

```typescript
// Featured Results Section
async getFeaturedResultsSection(): Promise<Locator> {
  return await this.findSmart({
    text: /featured results/i,
    role: { role: 'heading', name: /featured results/i },
    css: 'div.bg-background-bg-elevated div.text-xl.font-bold',
    xpath: '//div[contains(@class, "bg-background-bg-elevated")]//div[contains(text(), "Featured Results")]',
    description: 'Featured Results section heading'
  });
}

// Featured Card (First)
async getFirstFeaturedCard(): Promise<Locator> {
  return await this.findSmart({
    css: 'div.bg-background-bg-elevated section:first-of-type',
    xpath: '//div[contains(@class, "bg-background-bg-elevated")]//section[1]',
    description: 'First featured result card'
  });
}
```

### **Test Execution Order**
1. Run Functional tests first (core functionality)
2. Run Accessibility tests (compliance)
3. Run Performance tests (benchmarks)
4. Run Visual tests last (design validation)

### **Soft Assertions Required**
- ALL assertions MUST use `.soft` to continue execution
- Collect all failures for comprehensive reporting
- Example: `await expect.soft(element).toBeVisible()`

---

## VIII. Test Data

| Search Term | Expected Featured Results | Notes |
|-------------|---------------------------|-------|
| "Bayer Beyond" | Yes (1-3 cards) | Primary test term |
| "bayer beyond" | Yes (same cards) | Case-insensitive test |
| "BAYER BEYOND" | Yes (same cards) | Case-insensitive test |
| "random12345xyz" | No | Negative test - no results |

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-01  
**Review Status**: ⏳ Awaiting User Review  
**Approved By**: _Pending_

---

**Next Steps After Approval**:
1. ✅ Test cases reviewed and approved
2. Create page object model (FeaturedSearchResultsComponent.ts)
3. Implement test scripts (featuredSearchResults.spec.ts)
4. Execute tests in QA environment
5. Review selector health report
6. Generate test execution report

# News List Component - Test Cases Documentation

## Test Case Information
- **Component**: News List Component
- **Test Page URL**: `/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Newslist`
- **Figma Design**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=4526-83765&m=dev
- **Documentation Date**: November 6, 2025
- **Test Environment**: QA Environment
- **Testing Approach**: DOM-first, Language-agnostic, Soft assertions

## Traceability Matrix

| Test Category | Total Tests | Implemented | Status |
|---------------|-------------|-------------|--------|
| Functional    | 18          | 0           | ⏳ Pending |
| Visual        | 6           | 0           | ⏳ Pending |
| Accessibility | 18          | 0           | ⏳ Pending |
| Performance   | 4           | 0           | ⏳ Pending |
| **TOTAL**     | **46**      | **0**       | ⏳ Pending |

---

## 📋 **FUNCTIONAL TEST CASES**

### TC-NL-F001: Verify News List Title Display
**Objective**: Verify News List component displays the title with highlight text correctly  
**Priority**: High  
**Test Data**: Expected from Figma values  

**Pre-conditions:**
- Navigate to News List test page
- Accept cookies banner
- Wait for complete page load

**Test Steps:**
1. Locate main news list container using `[data-qa="news-list"]`
2. Locate title element using parent-child relationship `[data-qa="news-list"] [data-qa="title-component"]`
3. Verify title element is visible and is H2 semantic tag
4. Locate highlight text element using `[data-qa="stage-headline-text"]` within title
5. Verify highlight text is visible and properly styled

**Expected Results:**
- Title element is visible as H2 tag with proper content
- Highlight text appears within title with gradient styling
- Elements have correct data-qa attributes
- Typography matches Figma specifications

**Validation Approach:**
```typescript
await expect.soft(this.titleElement).toBeVisible();
await expect.soft(this.titleElement).toHaveAttribute('data-qa', 'title-component');
const tagName = await this.titleElement.evaluate(el => el.tagName.toLowerCase());
expect.soft(tagName).toBe('h2');
await expect.soft(this.highlightTextElement).toBeVisible();
await expect.soft(this.highlightTextElement).toHaveAttribute('data-qa', 'stage-headline-text');
```

---

### TC-NL-F002: Verify Search Functionality Display
**Objective**: Verify News List component displays search input container and accepts input  
**Priority**: High  
**Test Data**: Search container with icon

**Test Steps:**
1. Locate search container using `[data-qa="search-atom"]`
2. Verify search container is visible and interactive
3. Locate search icon within container using `[data-qa="icon"]`
4. Verify search icon is present and visible

**Expected Results:**
- Search container is visible with proper dimensions
- Search icon is visible within container
- Container has proper background styling

---

### TC-NL-F003: Verify Topic Filter Functionality
**Objective**: Verify topic filter is visible and lists the correct topic values  
**Priority**: High  

**Test Steps:**
1. Locate topic filter using `[data-testid="dropdown-trigger-text"]:has-text("Select Topic")`
2. Verify topic filter is visible and clickable
3. Verify default "Select Topic" text is displayed
4. Test filter interaction (if interactive in current state)

**Expected Results:**
- Topic filter is visible with "Select Topic" text
- Filter appears interactive and properly styled

---

### TC-NL-F004: Verify Area Filter Functionality  
**Objective**: Verify area filter is visible and lists correct area values
**Priority**: High

**Test Steps:**
1. Locate area filter using `[data-testid="dropdown-trigger-text"]:has-text("Select Area")`
2. Verify area filter is visible and clickable
3. Verify default "Select Area" text is displayed

**Expected Results:**
- Area filter is visible with "Select Area" text
- Filter appears interactive and properly styled

---

### TC-NL-F005: Verify News Items Display Count
**Objective**: Verify number of displayed news items matches configured count  
**Priority**: High

**Test Steps:**
1. Locate all news items using `[data-qa="news-list-item"]`
2. Count total news items displayed
3. Verify count matches expected configuration (currently 2 items)

**Expected Results:**
- Correct number of news items are displayed
- Each item has proper `data-qa="news-list-item"` attribute

**Validation Approach:**
```typescript
const newsItemsCount = await this.newsItems.count();
expect.soft(newsItemsCount).toBeGreaterThan(0);
// Verify specific count based on configuration
```

---

### TC-NL-F006: Verify News Item Structure
**Objective**: Verify each news card displays topic tag, date, image, headline per design  
**Priority**: High

**Test Steps:**
1. For each news item, verify presence of:
   - Title: `[data-qa="title-component"]` (H3 element)
   - Topic tags: `[data-qa="tag-chip"]`
   - Date: `[data-qa="news-date"]`
   - Image: `[data-qa="placeholder-image"]`
2. Verify semantic HTML structure
3. Verify all required data-qa attributes are present

**Expected Results:**
- Each news item contains all required elements
- Title is H3 semantic tag
- Multiple topic tags are present
- Date is properly formatted
- Placeholder image is displayed

**Validation Approach:**
```typescript
for (let i = 0; i < newsItemsCount; i++) {
  const newsItem = this.newsItems.nth(i);
  const title = newsItem.locator('[data-qa="title-component"]');
  const tags = newsItem.locator('[data-qa="tag-chip"]');
  const date = newsItem.locator('[data-qa="news-date"]');
  const image = newsItem.locator('[data-qa="placeholder-image"]');
  
  await expect.soft(title).toBeVisible();
  await expect.soft(tags).toHaveCount.greaterThan(0);
  await expect.soft(date).toBeVisible();
  await expect.soft(image).toBeVisible();
}
```

---

### TC-NL-F007: Verify News Item Hover Behavior
**Objective**: Verify hover effects on news cards match design transitions  
**Priority**: Medium

**Test Steps:**
1. Hover over news item container
2. Verify hover animation (`hover:translate-x-4` effect)
3. Verify cursor changes to pointer
4. Verify any topic tag hover effects

**Expected Results:**
- News item translates horizontally on hover
- Cursor indicates clickable area
- Hover effects are smooth and consistent

---

### TC-NL-F008: Verify News Item Click Behavior
**Objective**: Verify clicking anywhere on a news card is interactive  
**Priority**: Medium  
**Note**: Link functionality may be limited in test environment

**Test Steps:**
1. Click on different areas of news item (excluding topic tags)
2. Verify clickable behavior is consistent
3. Test topic tag click behavior separately

**Expected Results:**
- News item area is clickable (excluding topic tags)
- Click interactions are properly handled

---

### TC-NL-F009: Verify Topic Tags Display
**Objective**: Verify topic tags display correctly with proper styling  
**Priority**: High

**Test Steps:**
1. Locate all topic tags within news items using `[data-qa="tag-chip"]`
2. Verify each tag has proper background color
3. Verify tag text content is not empty
4. Verify tags have proper spacing and alignment

**Expected Results:**
- Topic tags display with green background
- Tag text is readable and properly formatted
- Tags have consistent styling across items

---

### TC-NL-F010: Verify Placeholder Images
**Objective**: Verify placeholder image displays for news items without an image  
**Priority**: High

**Test Steps:**
1. Locate placeholder images using `[data-qa="placeholder-image"]`
2. Verify placeholder has correct aspect ratio (3:2)
3. Verify placeholder background styling
4. Verify responsive image sizing

**Expected Results:**
- Placeholder images maintain aspect ratio
- Images scale appropriately across breakpoints
- Background pattern is visible

---

### TC-NL-F011: Verify Date Format Display
**Objective**: Verify date display format is consistent  
**Priority**: Medium

**Test Steps:**
1. Locate date elements using `[data-qa="news-date"]`
2. Verify date format consistency
3. Verify date styling (muted text color)

**Expected Results:**
- Dates are properly formatted
- Date text has muted color styling
- Dates are properly aligned within news items

---

### TC-NL-F012: Verify News Items Sorting
**Objective**: Verify news items are sorted by date in descending order  
**Priority**: Medium  
**Note**: Requires actual date comparison logic

**Test Steps:**
1. Extract dates from all news items
2. Verify dates are in descending order (newest first)
3. Confirm sorting order cannot be changed

**Expected Results:**
- News items appear with newest content first
- Date ordering is consistent

---

### TC-NL-F013 - TC-NL-F018: Additional Functional Scenarios
**Note**: The following scenarios may require backend integration or specific test data:

- TC-NL-F013: Verify filter application updates news list
- TC-NL-F014: Verify multiple filter combination
- TC-NL-F015: Verify search input functionality  
- TC-NL-F016: Verify search with no results
- TC-NL-F017: Verify pagination (if implemented)
- TC-NL-F018: Verify topic filter with OR logic

---

## 🎨 **VISUAL TEST CASES**

### TC-NL-V001: Verify Title Typography
**Objective**: Verify typography, font size, font family and color of title match Figma design  
**Priority**: High  
**Figma Reference**: XL/LG/MD/SM viewport specifications

**Test Steps:**
1. Navigate to component page and wait for full load
2. Extract Figma values for title typography across all viewports
3. Compare actual rendered typography with expected values
4. Test across all responsive breakpoints (XL: 1280px, LG: 1024px, MD: 768px, SM: 640px)

**Expected Results:**
- Font family matches Figma specification
- Font size matches across all breakpoints
- Font weight and line height are correct
- Text color matches design specifications

**Validation Approach:**
```typescript
// For each viewport (XL, LG, MD, SM)
const figmaValues = getValuesByViewport(viewport);
const computedStyle = await this.titleElement.evaluate(el => getComputedStyle(el));

await expect.soft(computedStyle.fontFamily).toBe(figmaValues.title.fontFamily);
await expect.soft(computedStyle.fontSize).toBe(figmaValues.title.fontSize);
await expect.soft(computedStyle.fontWeight).toBe(figmaValues.title.fontWeight);
await expect.soft(computedStyle.lineHeight).toBe(figmaValues.title.lineHeight);
```

---

### TC-NL-V002: Verify Highlight Text Typography
**Objective**: Verify highlight text styling matches Figma gradient specifications  
**Priority**: High

**Test Steps:**
1. Extract Figma values for highlight text styling
2. Verify gradient background properties
3. Test text transparency and clip-path properties
4. Validate across all responsive breakpoints

**Expected Results:**
- Gradient colors match Figma specification (green-600 to blue-600)
- Text transparency and background-clip properties are correct
- Gradient effect renders properly across browsers

---

### TC-NL-V003: Verify News Item Typography  
**Objective**: Verify typography of news item titles, dates, and tags match Figma  
**Priority**: High

**Test Steps:**
1. Extract Figma values for news item typography
2. Test news item title (H3) typography properties
3. Test date element typography
4. Test topic tag typography
5. Validate across responsive breakpoints

**Expected Results:**
- News item titles have correct font properties
- Date text matches muted color specification
- Topic tags have proper font size and color

---

### TC-NL-V004: Verify Layout and Spacing
**Objective**: Verify spacing, padding, and alignment between cards are consistent  
**Priority**: High

**Test Steps:**
1. Measure spacing between news items
2. Verify padding within news item containers
3. Check alignment of elements within items
4. Test layout consistency across breakpoints

**Expected Results:**
- Consistent spacing between news items (py-8 lg:py-12)
- Proper padding within news containers
- Elements align properly within flex layout

---

### TC-NL-V005: Verify Responsive Behavior
**Objective**: Verify responsive behavior across desktop, tablet, and mobile breakpoints  
**Priority**: High

**Test Steps:**
1. Test component at XL viewport (1280px)
2. Test component at LG viewport (1024px)  
3. Test component at MD viewport (768px)
4. Test component at SM viewport (640px)
5. Verify layout adapts properly at each breakpoint

**Expected Results:**
- Typography scales appropriately
- Layout maintains proper proportions
- No content overflow or clipping
- Interactive elements remain accessible

---

### TC-NL-V006: Verify Image Aspect Ratios
**Objective**: Verify placeholder image aspect ratio remains intact across breakpoints  
**Priority**: Medium

**Test Steps:**
1. Verify aspect-[3/2] ratio is maintained
2. Test background image scaling properties
3. Verify no image stretching or distortion
4. Test across all responsive breakpoints

**Expected Results:**
- Images maintain 3:2 aspect ratio
- Background patterns scale appropriately
- No visual distortion occurs

---

## ♿ **ACCESSIBILITY TEST CASES**

### TC-NL-A001: Verify Keyboard Navigation
**Objective**: Verify each news list item is accessible via keyboard navigation  
**Priority**: High  
**WCAG Reference**: 2.1.1 Keyboard

**Test Steps:**
1. Use Tab key to navigate through news items
2. Verify focus order is logical (top to bottom)
3. Verify focus indicators are clearly visible
4. Test Enter/Space key activation on interactive elements

**Expected Results:**
- All interactive elements are keyboard accessible
- Focus order follows visual layout
- Focus indicators meet contrast requirements
- Interactive elements respond to keyboard activation

**Validation Approach:**
```typescript
await this.page.keyboard.press('Tab');
const focusedElement = await this.page.evaluate(() => document.activeElement);
// Verify focus is on expected element
```

---

### TC-NL-A002: Verify Screen Reader Announcements - Title
**Objective**: Verify title and highlight text are announced correctly by screen readers  
**Priority**: High  
**WCAG Reference**: 1.3.1 Info and Relationships

**Test Steps:**
1. Use screen reader to navigate to title element
2. Verify full title including highlight text is announced
3. Verify title is announced as heading level 2
4. Test with multiple screen readers (NVDA, JAWS, VoiceOver)

**Expected Results:**
- Screen reader announces complete title text
- Heading level (H2) is properly identified
- Highlight text is included in announcement

---

### TC-NL-A003: Verify Screen Reader Announcements - Topic Tags  
**Objective**: Verify topic tags are announced clearly as labels by screen readers
**Priority**: High  
**WCAG Reference**: 1.3.1 Info and Relationships

**Test Steps:**
1. Navigate to topic tags using screen reader
2. Verify tags are announced as buttons/interactive elements
3. Verify tag content is clearly announced
4. Test tag collection announcement

**Expected Results:**
- Each tag is announced as interactive button
- Tag content is clearly spoken
- Screen reader identifies tag purpose

---

### TC-NL-A004: Verify News Item Accessibility
**Objective**: Verify each card's clickable area is announced correctly  
**Priority**: High  
**WCAG Reference**: 2.4.4 Link Purpose

**Test Steps:**
1. Navigate to news item containers using screen reader
2. Verify each item is announced as clickable region
3. Verify news item content is properly structured
4. Test that topic tags are separate from clickable area

**Expected Results:**
- News items are announced as interactive regions
- Content structure is logical for screen readers
- Topic tags don't interfere with main click area

---

### TC-NL-A005: Verify Image Accessibility
**Objective**: Verify placeholder images have appropriate alt text or are marked decorative  
**Priority**: High  
**WCAG Reference**: 1.1.1 Non-text Content

**Test Steps:**
1. Inspect placeholder images for alt attributes
2. Verify alt text is descriptive or empty for decorative images
3. Test screen reader announcement of images

**Expected Results:**
- Placeholder images have appropriate alt text or alt=""
- Screen reader handles images appropriately
- No confusing or misleading alt text

---

### TC-NL-A006: Verify Focus Management
**Objective**: Verify focus state is clearly visible for all interactive elements  
**Priority**: High  
**WCAG Reference**: 2.4.7 Focus Visible

**Test Steps:**
1. Tab through all interactive elements
2. Verify focus indicators are clearly visible
3. Measure focus indicator contrast ratio
4. Test focus indicators in different browser themes

**Expected Results:**
- Focus indicators are clearly visible (minimum 3:1 contrast ratio)
- Focus indicators work in high contrast mode
- Focus indicators are not hidden by other elements

---

### TC-NL-A007: Verify Color Contrast - Title
**Objective**: Verify color contrast ratio for title text meets WCAG AA standards  
**Priority**: High  
**WCAG Reference**: 1.4.3 Contrast (Minimum)

**Test Steps:**
1. Measure contrast ratio between title text and background
2. Test highlight text contrast against background
3. Verify contrast meets 4.5:1 ratio for normal text
4. Test in different browser themes

**Expected Results:**
- Title text contrast ratio ≥ 4.5:1
- Highlight text maintains adequate contrast
- Contrast ratios pass in all themes

---

### TC-NL-A008: Verify Color Contrast - Content
**Objective**: Verify contrast for news item content meets standards  
**Priority**: High  
**WCAG Reference**: 1.4.3 Contrast (Minimum)

**Test Steps:**
1. Measure news item title contrast
2. Measure date text contrast (muted color)
3. Measure topic tag contrast
4. Verify all ratios meet WCAG AA standards

**Expected Results:**
- All text elements meet minimum contrast ratios
- Muted text maintains sufficient contrast
- Topic tags have adequate contrast

---

### TC-NL-A009: Verify Filter Accessibility
**Objective**: Verify filter dropdowns are fully navigable using keyboard only  
**Priority**: High  
**WCAG Reference**: 2.1.1 Keyboard

**Test Steps:**
1. Navigate to filter dropdowns using keyboard
2. Verify dropdowns can be opened with keyboard
3. Test arrow key navigation within dropdowns
4. Test Escape key to close dropdowns

**Expected Results:**
- Dropdowns are keyboard accessible
- Arrow keys navigate options properly  
- Escape key closes dropdowns

---

### TC-NL-A010: Verify Search Accessibility
**Objective**: Verify search input has clear label or accessible name  
**Priority**: High  
**WCAG Reference**: 1.3.5 Identify Input Purpose

**Test Steps:**
1. Inspect search input for labels or accessible names
2. Verify search purpose is clearly identified
3. Test screen reader announcement of search field

**Expected Results:**
- Search input has clear label or aria-label
- Purpose is obvious to screen reader users
- Search functionality is properly identified

---

### TC-NL-A011: Verify Dynamic Content Updates
**Objective**: Verify search results and filter updates are announced  
**Priority**: High  
**WCAG Reference**: 4.1.3 Status Messages

**Test Steps:**
1. Apply filters or search and verify announcements
2. Test ARIA live regions for dynamic updates
3. Verify screen reader announces content changes

**Expected Results:**
- Content changes are announced to screen readers
- ARIA live regions function properly
- Users are informed of dynamic updates

---

### TC-NL-A012: Verify Responsive Accessibility
**Objective**: Verify responsive layout maintains accessible structure  
**Priority**: Medium  
**WCAG Reference**: 1.4.10 Reflow

**Test Steps:**
1. Test accessibility at different viewport sizes
2. Verify reading order remains logical
3. Test keyboard navigation at different breakpoints

**Expected Results:**
- Accessibility is maintained across breakpoints
- Reading order stays logical when layout changes
- Keyboard navigation works on all devices

---

### TC-NL-A013 - TC-NL-A018: Additional Accessibility Scenarios

- TC-NL-A013: Verify focus doesn't get trapped during filter updates
- TC-NL-A014: Verify hover effects don't rely solely on color
- TC-NL-A015: Verify component passes automated accessibility audit
- TC-NL-A016: Verify proper heading hierarchy (H1 → H2 → H3)
- TC-NL-A017: Verify touch targets meet minimum size requirements (44x44px)
- TC-NL-A018: Verify component works with voice control software

---

## ⚡ **PERFORMANCE TEST CASES**

### TC-NL-P001: Verify Component Load Time
**Objective**: Verify news list loads within acceptable time under normal conditions  
**Priority**: High

**Test Steps:**
1. Measure time from navigation to component visibility
2. Test with network throttling disabled
3. Measure Core Web Vitals (LCP, FID, CLS)
4. Test multiple iterations for consistency

**Expected Results:**
- Component loads in less than 3 seconds
- Core Web Vitals meet acceptable thresholds
- Performance is consistent across test runs

**Validation Approach:**
```typescript
const startTime = Date.now();
await this.navigateToNewsListComponent();
await this.newsListContainer.waitFor({ state: 'visible' });
const loadTime = Date.now() - startTime;
expect.soft(loadTime).toBeLessThan(3000);
```

---

### TC-NL-P002: Verify Low Network Performance  
**Objective**: Verify graceful rendering under low network conditions  
**Priority**: Medium

**Test Steps:**
1. Apply network throttling (Slow 3G simulation)
2. Navigate to component page
3. Verify progressive loading behavior
4. Check for layout shift during load

**Expected Results:**
- Images load progressively without layout shift
- Core content appears quickly
- No significant performance degradation

---

### TC-NL-P003: Verify Filter Performance
**Objective**: Verify filter operations update without full page reload  
**Priority**: Medium

**Test Steps:**
1. Monitor network activity during filter operations
2. Measure filter response times
3. Verify smooth client-side updates
4. Test multiple rapid filter changes

**Expected Results:**
- Filter updates happen client-side
- Response times are under 500ms
- No unnecessary network requests

---

### TC-NL-P004: Verify Large Dataset Performance
**Objective**: Verify search performance remains responsive with large datasets  
**Priority**: Medium

**Test Steps:**
1. Test search functionality with maximum data load
2. Measure search response times
3. Verify UI remains responsive during search
4. Test pagination performance (if implemented)

**Expected Results:**
- Search results render quickly
- UI doesn't freeze during operations
- Pagination (if present) performs smoothly

---

## Implementation Guidelines

### Test Execution Order
1. **Functional Tests**: Establish basic functionality works
2. **Visual Tests**: Validate design compliance  
3. **Accessibility Tests**: Ensure inclusive design
4. **Performance Tests**: Validate user experience

### Soft Assertions Usage
All test assertions should use `expect.soft()` to allow complete test execution and comprehensive failure reporting:

```typescript
await expect.soft(element).toBeVisible();
await expect.soft(element).toHaveAttribute('data-qa', 'expected-value');
```

### Cross-Browser Testing
- Primary: Chromium (latest)
- Secondary: Firefox (latest)  
- Mobile: WebKit (Safari simulation)

### Test Data Management
- Use Figma values for visual validation
- Use DOM-inspected locators for element identification
- Avoid hardcoded content that may change with localization

---

## Risk Assessment

### High Risk Areas
1. **Filter Functionality**: Limited DOM visibility of actual filter mechanics
2. **Search Input**: Actual input field not clearly identified in current DOM
3. **Link Navigation**: Limited ability to test actual navigation in test environment
4. **Pagination**: Not currently implemented in test page

### Mitigation Strategies  
1. Focus on structural and visual validation where functionality is limited
2. Document known limitations for future enhancement
3. Prioritize accessibility and performance testing as these are fully testable
4. Use soft assertions to capture all issues in single test run

---

## Maintenance Notes

### Regular Updates Required
1. **Figma Values**: Update when design specifications change
2. **DOM Structure**: Re-inspect if component implementation changes
3. **Test Data**: Update URLs and expected content as needed
4. **Browser Support**: Update browser versions regularly

### Success Criteria
- All functional elements are properly tested
- Visual compliance with Figma is validated
- Accessibility standards are met
- Performance benchmarks are achieved
- Tests are maintainable and language-agnostic
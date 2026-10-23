# Language Selector Component Test Cases

**Component:** Language Selector  
**Date:** November 26, 2025  
**Requirements Coverage:** AC1-AC11  
**Test Page:** https://bayer-beyond-qa-uk.vercel.app/  

## Test Case Traceability Matrix

| Test ID | Test Case Name | AC Coverage | Test Type | Priority | Status |
|---------|---------------|-------------|-----------|----------|---------|
| TC-LS-001 | Language selector header visibility XL viewport | AC2 | @functional | High | Ready |
| TC-LS-002 | Language selector header visibility LG viewport | AC2 | @functional | High | Ready |
| TC-LS-003 | Language selector flyout menu MD viewport | AC3 | @functional | High | Ready |
| TC-LS-004 | Language selector flyout menu SM viewport | AC3 | @functional | High | Ready |
| TC-LS-005 | Language selector fixed header position | AC4 | @functional | High | Ready |
| TC-LS-006 | Language options site-specific filtering | AC5 | @functional | Medium | Ready |
| TC-LS-007 | Language display format validation | AC6 | @functional | High | Ready |
| TC-LS-008 | Default language selection | AC7 | @functional | High | Ready |
| TC-LS-009 | Language selection functionality | AC9 | @functional | High | Ready |
| TC-LS-010 | Content fallback mechanism | AC10 | @functional | Medium | Ready |
| TC-LS-011 | ESC key panel dismissal | AC11 | @functional | High | Ready |
| TC-LS-012 | Visual design compliance XL viewport | AC1 | @visual | High | Ready |
| TC-LS-013 | Visual design compliance LG viewport | AC1 | @visual | High | Ready |
| TC-LS-014 | Visual design compliance MD viewport | AC1 | @visual | High | Ready |
| TC-LS-015 | Visual design compliance SM viewport | AC1 | @visual | High | Ready |
| TC-LS-016 | Language selector accessibility compliance | AC1-AC11 | @accessibility | High | Ready |
| TC-LS-017 | Language overlay performance testing | AC1-AC11 | @performance | Medium | Ready |
| TC-LS-018 | Language switching performance | AC9 | @performance | Medium | Ready |

## Functional Test Cases

### TC-LS-001: Language selector header visibility XL viewport
**Requirement:** AC2 - Language Selector available in header for breakpoints ≥ medium  
**Priority:** High  
**Test Type:** @functional  

**Pre-conditions:**
- Browser viewport set to XL (1440x900)
- Navigate to test page URL
- Cookie banner accepted

**Test Steps:**
1. Set viewport to XL dimensions (1440x900)
2. Navigate to https://bayer-beyond-qa-uk.vercel.app/
3. Verify language dropdown container is visible in header
4. Verify language selector button is visible and clickable
5. Validate positioning (top-right area of header)

**Expected Results:**
- Language dropdown container `[data-qa="language-dropdown"]` is visible
- Language button `[data-qa="select-language-button"]` is visible
- Component positioned in header top-right area
- Button displays current language "English (EN)"

**Test Data:** N/A

---

### TC-LS-002: Language selector header visibility LG viewport
**Requirement:** AC2 - Language Selector available in header for breakpoints ≥ medium  
**Priority:** High  
**Test Type:** @functional  

**Pre-conditions:**
- Browser viewport set to LG (1024x768)
- Navigate to test page URL
- Cookie banner accepted

**Test Steps:**
1. Set viewport to LG dimensions (1024x768)
2. Navigate to https://bayer-beyond-qa-uk.vercel.app/
3. Verify language dropdown container is visible in header
4. Verify language selector button is visible and clickable
5. Validate positioning remains consistent with XL viewport

**Expected Results:**
- Language dropdown container `[data-qa="language-dropdown"]` is visible
- Language button `[data-qa="select-language-button"]` is visible
- Component maintains header positioning
- Button displays current language "English (EN)"

**Test Data:** N/A

---

### TC-LS-003: Language selector flyout menu MD viewport
**Requirement:** AC3 - Language Selector available in flyout menu only for breakpoints < large  
**Priority:** High  
**Test Type:** @functional  

**Pre-conditions:**
- Browser viewport set to MD (768x1024)
- Navigate to test page URL
- Cookie banner accepted

**Test Steps:**
1. Set viewport to MD dimensions (768x1024)
2. Navigate to https://bayer-beyond-qa-uk.vercel.app/
3. Verify header language selector is hidden (`sm:hidden` class)
4. Locate and click hamburger/menu button
5. Verify language selector appears in flyout menu
6. Validate language selector functionality within flyout

**Expected Results:**
- Header language selector is not visible (hidden by `sm:hidden` class)
- Hamburger menu button is visible and functional
- Language selector available in opened flyout menu
- Language selector maintains same functionality as header version

**Test Data:** N/A

---

### TC-LS-004: Language selector flyout menu SM viewport
**Requirement:** AC3 - Language Selector available in flyout menu only for breakpoints < large  
**Priority:** High  
**Test Type:** @functional  

**Pre-conditions:**
- Browser viewport set to SM (375x812)
- Navigate to test page URL
- Cookie banner accepted

**Test Steps:**
1. Set viewport to SM dimensions (375x812)
2. Navigate to https://bayer-beyond-qa-uk.vercel.app/
3. Verify header language selector is hidden
4. Locate and click hamburger/menu button
5. Verify language selector appears in flyout menu
6. Validate touch interaction compatibility

**Expected Results:**
- Header language selector is not visible
- Hamburger menu button is visible and touch-friendly
- Language selector available in flyout menu
- Touch interactions work properly on mobile viewport

**Test Data:** N/A

---

### TC-LS-005: Language selector fixed header position
**Requirement:** AC4 - Language selector in header is fixed, not floating or scrolling  
**Priority:** High  
**Test Type:** @functional  

**Pre-conditions:**
- Browser viewport set to XL (1440x900)
- Navigate to test page URL
- Page content allows scrolling

**Test Steps:**
1. Set viewport to XL dimensions
2. Navigate to test page
3. Record initial language selector position
4. Scroll down 500px on the page
5. Verify language selector position remains unchanged
6. Scroll back to top and verify position stability

**Expected Results:**
- Language selector maintains fixed position during scroll
- No floating or sticky behavior observed
- Position coordinates remain constant relative to header
- Component stays within header boundaries

**Test Data:** N/A

---

### TC-LS-006: Language options site-specific filtering
**Requirement:** AC5 - Language options shown are only applicable to current site  
**Priority:** Medium  
**Test Type:** @functional  

**Pre-conditions:**
- Navigate to test page URL
- Language overlay can be opened

**Test Steps:**
1. Navigate to https://bayer-beyond-qa-uk.vercel.app/
2. Click language selector button to open overlay
3. Count and record available language options
4. Verify language options are site-appropriate
5. Compare with expected site language configuration

**Expected Results:**
- Only site-applicable languages displayed
- Expected languages: English (EN), German (DE), English USA (EN)
- No irrelevant language options present
- Language list matches site configuration

**Test Data:**
- Expected languages: ["English (EN)", "German (DE)", "English USA (EN)"]

---

### TC-LS-007: Language display format validation
**Requirement:** AC6 - Language name shown as user-friendly format [name] ([ISO code])  
**Priority:** High  
**Test Type:** @functional  

**Pre-conditions:**
- Navigate to test page URL
- Language overlay can be opened

**Test Steps:**
1. Navigate to test page
2. Click language selector button
3. Verify each language option format
4. Validate ISO 639 language codes
5. Confirm user-friendly naming convention

**Expected Results:**
- Format follows pattern: [language name] ([ISO 639 code])
- "English (EN)" - correct format
- "German (DE)" - correct format  
- "English USA (EN)" - correct format
- All language codes are valid ISO 639 codes

**Test Data:**
- Valid formats: ["English (EN)", "German (DE)", "English USA (EN)"]

---

### TC-LS-008: Default language selection
**Requirement:** AC7 - Default language/locale set when multiple languages available  
**Priority:** High  
**Test Type:** @functional  

**Pre-conditions:**
- Navigate to test page URL
- Multiple languages available

**Test Steps:**
1. Navigate to test page
2. Observe current language selection in header button
3. Click language selector to open overlay
4. Verify default language is visually distinguished
5. Confirm default language matches header display

**Expected Results:**
- Default language is clearly indicated
- Header button shows default language selection
- Default language has visual distinction (bold font-weight observed)
- Current selection matches header display

**Test Data:**
- Default language: "English (EN)"

---

### TC-LS-009: Language selection functionality
**Requirement:** AC9 - Language selection changes entire site to corresponding version  
**Priority:** High  
**Test Type:** @functional  

**Pre-conditions:**
- Navigate to test page URL
- Alternative languages available

**Test Steps:**
1. Navigate to test page (English version)
2. Record current URL and page language indicators
3. Click language selector button
4. Select alternative language (e.g., "German (DE)")
5. Verify page reloads/navigates to German version
6. Confirm URL reflects language change
7. Verify header button updates to show new selection

**Expected Results:**
- Page successfully navigates to selected language version
- URL reflects language change (e.g., /de/ for German)
- Header button updates to show new language selection
- Site content switches to selected language
- Navigation persists across page reloads

**Test Data:**
- Languages to test: ["German (DE)", "English USA (EN)"]

---

### TC-LS-010: Content fallback mechanism
**Requirement:** AC10 - Fallback to default language for missing content  
**Priority:** Medium  
**Test Type:** @functional  

**Pre-conditions:**
- Navigate to page with potential content gaps
- Alternative language selected

**Test Steps:**
1. Navigate to test page
2. Select non-default language (German (DE))
3. Navigate to various page sections
4. Identify areas with potential missing translations
5. Verify fallback behavior to default language
6. Confirm graceful handling of untranslated content

**Expected Results:**
- Missing content gracefully falls back to default language
- No broken or empty content areas
- Clear indication when fallback is used
- User experience remains coherent

**Test Data:** N/A

---

### TC-LS-011: ESC key panel dismissal
**Requirement:** AC11 - User can close panel by hitting ESC key  
**Priority:** High  
**Test Type:** @functional  

**Pre-conditions:**
- Navigate to test page URL
- Language overlay can be opened

**Test Steps:**
1. Navigate to test page
2. Click language selector button to open overlay
3. Verify language overlay is visible and open
4. Press ESC key on keyboard
5. Verify language overlay closes/dismisses
6. Confirm page focus returns to appropriate element

**Expected Results:**
- ESC key successfully closes language overlay
- Overlay dismisses completely
- No overlay remnants remain visible
- Focus returns to language selector button or appropriate element
- Keyboard accessibility maintained

**Test Data:** N/A

## Visual Test Cases

### TC-LS-012: Visual design compliance XL viewport
**Requirement:** AC1 - Language Selector looks like designed  
**Priority:** High  
**Test Type:** @visual  

**Pre-conditions:**
- Browser viewport set to XL (1440x900)
- Figma design tokens extracted for XL viewport

**Test Steps:**
1. Set viewport to XL dimensions (1440x900)
2. Navigate to test page
3. Validate language selector button visual properties:
   - Font family matches Figma specification
   - Font size matches expected value
   - Line height matches design token
   - Text color matches specification
   - Background color matches design
   - Border and spacing match design
4. Click to open language overlay
5. Validate overlay visual properties:
   - Overlay background and positioning
   - Language option font properties
   - Hover state styling
   - Focus state styling
6. Test state variations (normal, hover, focus)

**Expected Results:**
- Font family matches Figma: [TO BE EXTRACTED]
- Font size matches Figma: [TO BE EXTRACTED]  
- Line height matches Figma: [TO BE EXTRACTED]
- Colors match Figma specifications: [TO BE EXTRACTED]
- All interactive states render correctly
- Visual design is pixel-perfect to Figma

**Test Data:**
- Figma Node IDs for XL:
  - Header selector: 3265:19962
  - Overlay: 3265:19971
  - Flyout menu: 3265:20214
  - Hover state: 3265:20241
  - Focus state: 3265:20238

---

### TC-LS-013: Visual design compliance LG viewport
**Requirement:** AC1 - Language Selector looks like designed  
**Priority:** High  
**Test Type:** @visual  

**Pre-conditions:**
- Browser viewport set to LG (1024x768)
- Figma design tokens extracted for LG viewport

**Test Steps:**
1. Set viewport to LG dimensions (1024x768)
2. Navigate to test page
3. Validate language selector visual properties for LG
4. Compare font sizes, spacing, and positioning
5. Verify responsive design adaptations
6. Test interaction states specific to LG viewport

**Expected Results:**
- Visual design matches LG Figma specifications
- Responsive adaptations are correct
- Font properties scale appropriately
- Interactive states function correctly

**Test Data:**
- Figma Node IDs for LG:
  - Header selector: 3265:28132
  - Overlay: 3265:28139
  - Flyout menu: 3265:28427
  - Hover state: 3265:20241
  - Focus state: 3265:20238

---

### TC-LS-014: Visual design compliance MD viewport
**Requirement:** AC1 - Language Selector looks like designed  
**Priority:** High  
**Test Type:** @visual  

**Pre-conditions:**
- Browser viewport set to MD (768x1024)
- Figma design tokens extracted for MD viewport

**Test Steps:**
1. Set viewport to MD dimensions (768x1024)
2. Navigate to test page
3. Verify header selector is hidden
4. Open flyout menu and validate language selector appearance
5. Test overlay visual properties for MD viewport
6. Validate pressed state styling

**Expected Results:**
- Header selector properly hidden
- Flyout menu language selector matches design
- Overlay visual properties correct for MD
- Pressed state styling matches Figma

**Test Data:**
- Figma Node IDs for MD:
  - Overlay: 2701:35134
  - Flyout menu: 2701:35041
  - Pressed state: 2701:35202

---

### TC-LS-015: Visual design compliance SM viewport
**Requirement:** AC1 - Language Selector looks like designed  
**Priority:** High  
**Test Type:** @visual  

**Pre-conditions:**
- Browser viewport set to SM (375x812)
- Figma design tokens extracted for SM viewport

**Test Steps:**
1. Set viewport to SM dimensions (375x812)
2. Navigate to test page
3. Verify header selector is hidden
4. Open flyout menu and validate language selector appearance
5. Test overlay visual properties for SM viewport
6. Validate touch-friendly sizing and spacing

**Expected Results:**
- Header selector properly hidden for mobile
- Flyout menu language selector is touch-friendly
- Overlay visual properties correct for mobile
- Touch targets meet accessibility requirements

**Test Data:**
- Figma Node IDs for SM:
  - Overlay: 2701:34901
  - Flyout menu: 2701:34744
  - Pressed state: 2701:35202

## Accessibility Test Cases

### TC-LS-016: Language selector accessibility compliance
**Requirement:** AC1-AC11 - Full accessibility compliance  
**Priority:** High  
**Test Type:** @accessibility  

**Pre-conditions:**
- Navigate to test page URL
- Screen reader testing tools available

**Test Steps:**
1. Navigate to test page
2. Run automated accessibility scan with axe-core
3. Test keyboard navigation:
   - Tab to language selector button
   - Enter/Space to open overlay
   - Arrow keys to navigate language options
   - Enter/Space to select language
   - ESC to close overlay
4. Verify screen reader announcements:
   - Language selector button description
   - Overlay opening announcement
   - Language option descriptions
   - Selection confirmation
5. Test focus management:
   - Focus visibility on all interactive elements
   - Logical focus order
   - Focus trapping within overlay
   - Focus return after overlay close
6. Validate ARIA attributes:
   - aria-expanded on trigger button
   - role attributes on overlay and options
   - aria-labels for context

**Expected Results:**
- Zero critical accessibility violations
- Full keyboard operability
- Proper screen reader support
- WCAG 2.1 AA compliance
- Logical focus management
- Appropriate ARIA implementation

**Test Data:**
- WCAG Success Criteria: 1.3.1, 1.4.3, 2.1.1, 2.1.2, 2.4.3, 2.4.6, 2.4.7, 3.2.1, 4.1.2

## Performance Test Cases

### TC-LS-017: Language overlay performance testing
**Requirement:** AC1-AC11 - Language overlay load performance  
**Priority:** Medium  
**Test Type:** @performance  

**Pre-conditions:**
- Navigate to test page URL
- Performance monitoring enabled

**Test Steps:**
1. Navigate to test page
2. Measure initial page load time
3. Click language selector button
4. Measure overlay opening time
5. Measure overlay rendering time
6. Validate performance against thresholds
7. Test across different viewport sizes

**Expected Results:**
- Language overlay opens within acceptable threshold (< 500ms)
- No significant performance degradation
- Smooth animations and transitions
- Consistent performance across viewports

**Test Data:**
- Performance thresholds:
  - Overlay open time: < 500ms
  - Rendering time: < 200ms

---

### TC-LS-018: Language switching performance
**Requirement:** AC9 - Language selection performance  
**Priority:** Medium  
**Test Type:** @performance  

**Pre-conditions:**
- Navigate to test page URL
- Alternative languages available

**Test Steps:**
1. Navigate to test page
2. Click language selector button
3. Select alternative language
4. Measure page navigation/reload time
5. Measure time until new language content visible
6. Validate performance against thresholds

**Expected Results:**
- Language switching completes within threshold (< 3s)
- Page navigation is smooth
- New language content loads efficiently
- User experience remains responsive

**Test Data:**
- Performance thresholds:
  - Language switch time: < 3s
  - Content visibility: < 1s after navigation

## Notes and Considerations

### Implementation Notes:
1. **Locator Strategy**: Using `data-qa` attributes where available, falling back to class-based selectors for overlay elements until dev team adds data-qa attributes
2. **Flyout Menu**: Will be inspected during MD/SM viewport testing execution
3. **ESC Key Testing**: Will be validated during test script execution
4. **Soft Assertions**: All validations will use soft assertions to prevent premature test termination

### Test Dependencies:
1. Figma design token extraction required before visual test execution
2. Dev team to add missing data-qa attributes for better test stability
3. Flyout menu behavior to be documented during execution

### Risk Mitigation:
1. Structure-based locators may be fragile - plan for data-qa attribute addition
2. Language switching may depend on backend configuration
3. Performance thresholds may need adjustment based on environment
# Location Component - Test Cases Documentation

## Component Overview
- **Component Name**: Location Story
- **Test Page URL**: https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Page-Disclaimer
- **Figma Design**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-–-Dev-Handover?node-id=2718-10573&t=fMI3IyPBRdCykvpt-1
- **DOM Inspected**: ✅ December 5, 2025
- **Authentication Required**: Cookie acceptance only (no Vercel password)

## DOM Structure (From Live Inspection)
```html
<!-- Header Location Button -->
<button data-qa="select-location-button" aria-label="Open location selector" aria-expanded="false/true">
  Location selector icon Bayer global
</button>

<!-- Location Overlay Container -->
<div data-qa="location-overlay" data-testid="location-overlay" class="fixed top-0 left-0 z-50 flex h-screen w-full">
  <!-- Description Components -->
  <section data-qa="description-component">You are currently on the Bayer global Website</section>
  <section data-qa="description-component">You can use our locations menu to find Bayer location websites.</section>
  
  <!-- Search Container -->
  <div data-qa="search-atom"></div>
  
  <!-- Country/Location List with alphabetical sorting -->
  <!-- Multiple country buttons and location details -->
</div>
```

## Test Case Coverage Matrix

| AC# | Description | Functional | Visual | Accessibility | Performance |
|-----|-------------|------------|--------|---------------|-------------|
| AC1 | Country/group items list headline | ✅ TC-L01 | ✅ TC-LV01 | ✅ TC-LA01 | - |
| AC2 | Locations List headline | ✅ TC-L02 | ✅ TC-LV02 | ✅ TC-LA02 | - |
| AC3 | Description text per locale | ✅ TC-L03 | ✅ TC-LV03 | ✅ TC-LA03 | - |
| AC4 | Auto Detection Text display | ✅ TC-L04 | ✅ TC-LV04 | ✅ TC-LA04 | - |
| AC5 | Cookie-dependent auto detection | ✅ TC-L05 | - | - | - |
| AC6 | Access from header/navigation | ✅ TC-L06 | - | ✅ TC-LA05 | ✅ TC-LP01 |
| AC7 | Display all countries/locations | ✅ TC-L07 | - | ✅ TC-LA06 | ✅ TC-LP02 |
| AC8 | Bayer Global positioning | ✅ TC-L08 | ✅ TC-LV05 | - | - |
| AC8b | Active country highlighting (LG+) | ✅ TC-L09* | - | - | - |
| AC9 | Locale display name fallback | ✅ TC-L10 | - | - | - |
| AC10 | Alphabetical sorting | ✅ TC-L11 | - | - | - |
| AC11 | Search functionality | ✅ TC-L12 | ✅ TC-LV06 | ✅ TC-LA07 | ✅ TC-LP03 |
| AC12 | Country selection | ✅ TC-L13 | - | ✅ TC-LA08 | - |
| AC13 | Site link navigation | ✅ TC-L14 | - | ✅ TC-LA09 | - |
| AC14 | Back button context logic | ✅ TC-L15 | - | ✅ TC-LA10 | - |
| AC15 | Close overlay functionality | ✅ TC-L16 | - | ✅ TC-LA11 | - |

*Note: TC-L09 expected to fail due to known issue (AC8b feature not working)

---

## FUNCTIONAL TEST CASES

### TC-L01: @Functional - Display Country/Group Items List Headline
**Requirement**: AC1 - Application should display the headline of country/group items list
**Priority**: High
**Test Data**: All viewports (XL: 1440x900, LG: 1024x768, MD: 768x1024, SM: 375x812)

**Pre-conditions**:
- Navigate to test page
- Accept cookies
- Open location overlay

**Test Steps**:
1. Verify "Browse by Location" headline is visible
2. Verify headline uses proper semantic HTML (H1/H2/H3)
3. Verify headline has data-qa attribute
4. Test across all viewports

**Expected Results**:
- Headline displays correctly in all viewports
- Proper semantic structure maintained
- Language-agnostic validation passes

---

### TC-L02: @Functional - Display Locations List Headline  
**Requirement**: AC2 - Application should display headline for Locations List
**Priority**: High
**Test Data**: Country selection required

**Pre-conditions**:
- Location overlay open
- Select any country from list

**Test Steps**:
1. Click on country (e.g., "Algeria")
2. Verify "Locations" headline appears
3. Verify headline structure and attributes
4. Test with multiple countries

**Expected Results**:
- "Locations" headline displays when country selected
- Consistent formatting across countries
- Proper semantic HTML structure

---

### TC-L03: @Functional - Display Description Text Per Locale
**Requirement**: AC3 - Display description text per locale  
**Priority**: High
**Test Data**: Default English locale

**Pre-conditions**:
- Location overlay open

**Test Steps**:
1. Verify description text 1: "You are currently on the Bayer global Website"
2. Verify description text 2: "You can use our locations menu to find Bayer location websites."
3. Check data-qa="description-component" attributes
4. Verify content is locale-appropriate

**Expected Results**:
- Both description texts visible
- Proper data-qa attributes present
- Content matches expected locale

---

### TC-L04: @Functional - Auto Detection Text Display
**Requirement**: AC4 - Display auto detection text as site-wide setting
**Priority**: Medium
**Test Data**: Cookie acceptance required

**Pre-conditions**:
- Cookies accepted
- Location overlay open

**Test Steps**:
1. Look for auto-detection text element
2. Verify text content and positioning
3. Check if linked to appropriate website
4. Test visibility conditions

**Expected Results**:
- Auto-detection text displays when cookies accepted
- Appropriate country detection and linking
- Text positioned correctly in overlay

---

### TC-L05: @Functional - Cookie-Dependent Auto Location Detection
**Requirement**: AC5 - Auto detection with cookie acceptance
**Priority**: High
**Test Data**: Cookie scenarios

**Pre-conditions**:
- Test with/without cookie acceptance

**Test Steps**:
1. Test scenario without accepting cookies
2. Accept cookies and reopen overlay
3. Verify auto-detection text appears
4. Check country-specific language display
5. Verify appropriate Bayer website link

**Expected Results**:
- No auto-detection without cookies
- Auto-detection appears after cookie acceptance
- Correct country language and website link

---

### TC-L06: @Functional - Access from Header and Navigation
**Requirement**: AC6 - Access overlay from header or navigation flyout
**Priority**: High
**Test Data**: Both access methods

**Pre-conditions**:
- Page loaded with location button visible

**Test Steps**:
1. Click location button in header `[data-qa="select-location-button"]`
2. Verify overlay opens
3. Close overlay
4. Open navigation flyout (hamburger menu)
5. Click location option in flyout
6. Verify overlay opens

**Expected Results**:
- Location overlay opens from both access points
- Consistent overlay behavior
- Proper state management

---

### TC-L07: @Functional - Display All Countries and Locations
**Requirement**: AC7 - Display all maintained countries and locations
**Priority**: High
**Test Data**: Complete country/location dataset

**Pre-conditions**:
- Location overlay open

**Test Steps**:
1. Verify "Bayer Global" appears first
2. Verify alphabetical country list (Algeria → Zimbabwe)
3. Select multiple countries and verify location details
4. Check location information includes: name, address, phone, website
5. Verify all maintained locations display

**Expected Results**:
- All countries visible in overlay
- Location details complete for each country
- Data integrity maintained

---

### TC-L08: @Functional - Bayer Global Separate Positioning
**Requirement**: AC8 - Bayer Global shown separately first
**Priority**: High
**Test Data**: Country list structure

**Pre-conditions**:
- Location overlay open

**Test Steps**:
1. Verify "Bayer Global" appears at top of list
2. Verify separator or visual distinction from alphabetical list
3. Verify alphabetical list starts after Bayer Global
4. Check positioning across viewports

**Expected Results**:
- Bayer Global positioned first and separate
- Clear visual distinction from other countries
- Consistent across all viewports

---

### TC-L09: @Functional - Active Country Highlighting (Known Failure)
**Requirement**: AC8b - Active country highlighting for LG+ breakpoints
**Priority**: Medium - **EXPECTED TO FAIL**
**Test Data**: LG (1024x768) and XL (1440x900) viewports only

**Pre-conditions**:
- Location overlay open on LG or XL viewport

**Test Steps**:
1. Select a country from the list
2. Verify country becomes visually "active" 
3. Verify corresponding location information displays
4. Test with multiple countries
5. Test only on LG and above breakpoints

**Expected Results**:
- **EXPECTED FAILURE**: Feature not currently working
- Country should highlight as active (but won't)
- Location info should display in context (may not work)

---

### TC-L10: @Functional - Locale Display Name Fallback
**Requirement**: AC9 - Show locale display name or fallback to English
**Priority**: Medium
**Test Data**: Multiple language scenarios

**Pre-conditions**:
- Location overlay open

**Test Steps**:
1. Verify country names display in current locale
2. Check for any missing translations
3. Verify fallback to English for untranslated names
4. Test consistency across all countries

**Expected Results**:
- Appropriate locale names displayed
- English fallback for untranslated content
- Consistent naming convention

---

### TC-L11: @Functional - Alphabetical Country Sorting
**Requirement**: AC10 - Countries sorted alphabetically ascending
**Priority**: High
**Test Data**: Full country list

**Pre-conditions**:
- Location overlay open

**Test Steps**:
1. Verify country list starts with "Algeria" (after Bayer Global)
2. Verify alphabetical order throughout list
3. Check last country is "Zimbabwe"
4. Verify sorting is case-insensitive
5. Test across all viewports

**Expected Results**:
- Perfect alphabetical ascending order
- Bayer Global excluded from alphabetical sort
- Consistent sorting across viewports

---

### TC-L12: @Functional - Country Search Functionality
**Requirement**: AC11 - Frontend user can search countries
**Priority**: High
**Test Data**: Various search terms

**Pre-conditions**:
- Location overlay open
- Search input `[data-qa="search-atom"]` visible

**Test Steps**:
1. Enter "Germany" in search field
2. Verify filtered results show only Germany
3. Enter partial text "Ger" 
4. Verify partial matching works
5. Enter non-existent country "XYZ"
6. Verify no results message
7. Clear search and verify full list returns

**Expected Results**:
- Accurate search filtering
- Partial text matching works
- Proper handling of no results
- Search clearing restores full list

---

### TC-L13: @Functional - Country Selection and Location Display
**Requirement**: AC12 - Select country to see location information
**Priority**: High
**Test Data**: Multiple countries with location data

**Pre-conditions**:
- Location overlay open

**Test Steps**:
1. Select "Germany" from country list
2. Verify location information displays:
   - Bayer AG, Kaiser-Wilhelm-Allee 1, 51373 Leverkusen
   - Phone: +49 214 30 1
   - Website: www.bayer.com
3. Select different country (e.g., "Brazil")
4. Verify location information updates
5. Test with countries having multiple locations

**Expected Results**:
- Location details display correctly
- Information updates when country changes
- All location data fields populated

---

### TC-L14: @Functional - Site Link Navigation and Overlay Close
**Requirement**: AC13 - Site link closes overlay and navigates
**Priority**: High
**Test Data**: Location website links

**Pre-conditions**:
- Location overlay open
- Country with website link selected

**Test Steps**:
1. Select country with website link
2. Click on website URL (e.g., www.bayer.com)
3. Verify overlay closes automatically
4. Verify new URL loads in browser
5. Test with multiple different site links

**Expected Results**:
- Overlay closes when site link clicked
- New URL loads correctly
- Navigation behavior consistent

---

### TC-L15: @Functional - Back Button Context Logic
**Requirement**: AC14 - Back button behavior based on access method
**Priority**: High
**Test Data**: Both header and navigation access

**Pre-conditions**:
- Test both access methods

**Test Steps**:
1. **From Header Access**:
   - Open overlay from header location button
   - Verify NO back button displays
2. **From Navigation Flyout Access**:
   - Open navigation flyout first
   - Click location option
   - Verify back button IS displayed
   - Click back button
   - Verify returns to navigation flyout state

**Expected Results**:
- No back button when opened from header
- Back button present when opened from navigation
- Back button returns to navigation flyout

---

### TC-L16: @Functional - Close Overlay Functionality
**Requirement**: AC15 - Close overlay via button or Escape key
**Priority**: High
**Test Data**: Multiple close methods

**Pre-conditions**:
- Location overlay open

**Test Steps**:
1. **Close Button Test**:
   - Locate close button `[data-qa*="close"]`
   - Click close button
   - Verify overlay closes and underlying page shows
2. **Escape Key Test**:
   - Reopen overlay
   - Press Escape key
   - Verify overlay closes
3. **Background Click Test** (if applicable):
   - Test clicking outside overlay area

**Expected Results**:
- Close button successfully closes overlay
- Escape key closes overlay
- Underlying page becomes accessible
- Consistent behavior across methods

---

## VISUAL TEST CASES

### TC-LV01: @Visual - Browse by Location Headline Typography
**Requirement**: Visual design compliance for main headline
**Priority**: High
**Test Data**: All viewports with Figma values

**Pre-conditions**:
- Location overlay open
- Figma values extracted for each viewport

**Test Steps**:
1. **XL Viewport (1440x900)**:
   - Verify font-family matches Figma (node-id: 4802:109509)
   - Verify font-size matches expected value
   - Verify line-height matches expected value
   - Verify color matches expected value
2. **LG Viewport (1024x768)**:
   - Repeat validation with LG Figma values (node-id: 4802:110941)
3. **MD Viewport (768x1024)**:
   - Repeat validation with MD Figma values (node-id: 4802:110704)
4. **SM Viewport (375x812)**:
   - Repeat validation with SM Figma values (node-id: 4802:110386)

**Expected Results**:
- Font properties match Figma specifications exactly
- Consistent typography across all viewports
- No visual regression from design

---

### TC-LV02: @Visual - Location List Headline Typography
**Requirement**: Visual validation of locations headline
**Priority**: High
**Test Data**: All viewports with Figma values

**Pre-conditions**:
- Country selected to show locations list

**Test Steps**:
1. Select country to display locations
2. **XL Viewport**: Validate typography (node-id: 4802:109561)
3. **LG Viewport**: Validate typography (node-id: 4802:110992)
4. **MD Viewport**: Validate typography (node-id: 4802:110883)
5. **SM Viewport**: Validate typography (node-id: 4802:110448)

**Expected Results**:
- Locations headline typography matches Figma
- Consistent styling across viewports

---

### TC-LV03: @Visual - Description Text Typography Validation
**Requirement**: Visual compliance for description text
**Priority**: High
**Test Data**: All viewports with Figma values

**Pre-conditions**:
- Location overlay open with description text visible

**Test Steps**:
1. **XL Viewport**: Validate description text (node-id: 4802:109510)
2. **LG Viewport**: Validate description text (node-id: 4802:111276)
3. **MD Viewport**: Validate description text (node-id: 4802:110705)
4. **SM Viewport**: Validate description text (node-id: 4802:110387)
5. Verify both description components match design

**Expected Results**:
- Font-family, size, weight, line-height, color match Figma
- Consistent typography for both description texts

---

### TC-LV04: @Visual - Auto Detection Text Typography
**Requirement**: Visual validation of auto-detection text
**Priority**: Medium
**Test Data**: All viewports with Figma values

**Pre-conditions**:
- Cookies accepted
- Auto-detection text visible

**Test Steps**:
1. **XL Viewport**: Validate auto-detection text (node-id: 4802:109511)
2. **LG Viewport**: Validate auto-detection text (node-id: 4802:110943)
3. **MD Viewport**: Validate auto-detection text (node-id: 4802:110706)
4. **SM Viewport**: Validate auto-detection text (node-id: 4802:110388)

**Expected Results**:
- Auto-detection text typography matches Figma specifications
- Proper styling across all viewports

---

### TC-LV05: @Visual - Bayer Global Item Typography
**Requirement**: Visual validation of Bayer Global positioning and styling
**Priority**: High
**Test Data**: All viewports with Figma values

**Pre-conditions**:
- Location overlay open showing country list

**Test Steps**:
1. **XL Viewport**: Validate Bayer Global styling (node-id: 4802:109829)
2. **LG Viewport**: Validate Bayer Global styling (node-id: 4802:110945)
3. **MD Viewport**: Validate Bayer Global styling (node-id: 4802:110708)
4. **SM Viewport**: Validate Bayer Global styling (node-id: 4802:110390)
5. Verify visual separation from alphabetical list

**Expected Results**:
- Bayer Global typography matches Figma
- Visual distinction from other countries maintained

---

### TC-LV06: @Visual - Search Input Box Typography
**Requirement**: Visual validation of search input field
**Priority**: Medium
**Test Data**: All viewports with Figma values

**Pre-conditions**:
- Location overlay open with search field visible

**Test Steps**:
1. **XL Viewport**: Validate search input (node-id: 4802:109515)
2. **LG Viewport**: Validate search input (node-id: 4802:110947)
3. **MD Viewport**: Validate search input (node-id: 4802:110710)
4. **SM Viewport**: Validate search input (node-id: 4802:110392)
5. Verify placeholder text styling if present

**Expected Results**:
- Search input typography matches Figma specifications
- Consistent input field styling across viewports

---

## ACCESSIBILITY TEST CASES

### TC-LA01: @Accessibility - Browse by Location Headline Accessibility
**Requirement**: WCAG 2.1 AA compliance for main headline
**Priority**: High
**Test Data**: Screen reader and keyboard navigation

**Pre-conditions**:
- Location overlay open
- Screen reader testing tools available

**Test Steps**:
1. Verify headline uses proper semantic HTML (H1/H2/H3)
2. Check aria-label or aria-labelledby if present
3. Verify heading hierarchy is logical
4. Test screen reader announcement
5. Verify color contrast meets WCAG AA (4.5:1 for normal text)

**Expected Results**:
- Proper heading semantics
- Screen reader announces correctly
- Color contrast compliant
- Logical heading structure

---

### TC-LA02: @Accessibility - Locations List Headline Accessibility
**Requirement**: WCAG compliance for locations headline
**Priority**: High

**Test Steps**:
1. Select country to show locations list
2. Verify locations headline semantic structure
3. Test screen reader behavior
4. Check heading hierarchy context

**Expected Results**:
- Proper semantic HTML structure
- Clear screen reader announcements
- Logical heading flow

---

### TC-LA03: @Accessibility - Description Text Accessibility
**Requirement**: Screen reader compatibility for description text
**Priority**: High

**Test Steps**:
1. Test screen reader announcement of both description texts
2. Verify proper content grouping
3. Check reading order and flow
4. Verify color contrast for text

**Expected Results**:
- Clear screen reader announcements
- Logical reading order
- WCAG compliant color contrast

---

### TC-LA04: @Accessibility - Auto Detection Text Accessibility
**Requirement**: Accessibility for auto-detection content
**Priority**: Medium

**Test Steps**:
1. Verify auto-detection text is announced by screen reader
2. Check if country link is properly labeled
3. Test keyboard navigation to link
4. Verify link has clear purpose

**Expected Results**:
- Auto-detection text accessible to screen readers
- Links properly labeled and keyboard accessible

---

### TC-LA05: @Accessibility - Location Button Keyboard Navigation
**Requirement**: WCAG keyboard accessibility for location button
**Priority**: High

**Test Steps**:
1. Tab to location button in header
2. Verify focus indicator is visible
3. Press Enter/Space to activate
4. Verify overlay opens
5. Test focus management when overlay opens

**Expected Results**:
- Location button is keyboard accessible
- Clear focus indicators
- Proper focus management

---

### TC-LA06: @Accessibility - Country List Keyboard Navigation
**Requirement**: Full keyboard access to country selection
**Priority**: High

**Test Steps**:
1. Navigate to country list using keyboard only
2. Use arrow keys to navigate between countries
3. Test Enter key to select countries
4. Verify focus indicators throughout
5. Test skip navigation if available

**Expected Results**:
- Full keyboard navigation of country list
- Clear focus indicators
- Logical tab order

---

### TC-LA07: @Accessibility - Search Field Accessibility
**Requirement**: WCAG compliance for search functionality
**Priority**: High

**Test Steps**:
1. Navigate to search field with keyboard
2. Verify proper label or aria-label
3. Test screen reader announcement of field purpose
4. Verify search results are announced
5. Test keyboard navigation of filtered results

**Expected Results**:
- Search field properly labeled
- Screen reader announces purpose and results
- Keyboard accessible throughout search process

---

### TC-LA08: @Accessibility - Location Information Accessibility
**Requirement**: Screen reader access to location details
**Priority**: High

**Test Steps**:
1. Select country using keyboard
2. Verify location information is announced
3. Test navigation through location details
4. Check proper labeling of phone numbers and addresses
5. Verify website links are accessible

**Expected Results**:
- Location details properly structured for screen readers
- All information accessible via keyboard
- Links properly labeled

---

### TC-LA09: @Accessibility - Site Link Navigation Accessibility
**Requirement**: Accessible link navigation and overlay closure
**Priority**: High

**Test Steps**:
1. Navigate to site link using keyboard
2. Verify link purpose is clear
3. Activate link with Enter key
4. Verify overlay closes appropriately
5. Check focus management after navigation

**Expected Results**:
- Site links keyboard accessible
- Clear link purpose
- Proper focus management

---

### TC-LA10: @Accessibility - Back Button Accessibility
**Requirement**: Keyboard access to back functionality
**Priority**: High

**Test Steps**:
1. Open overlay from navigation flyout
2. Navigate to back button with keyboard
3. Verify button is properly labeled
4. Activate with Enter/Space
5. Verify returns to navigation flyout with proper focus

**Expected Results**:
- Back button keyboard accessible
- Clear button purpose
- Proper focus management on return

---

### TC-LA11: @Accessibility - Close Overlay Accessibility
**Requirement**: Multiple accessible methods to close overlay
**Priority**: High

**Test Steps**:
1. **Close Button**: Navigate to close button, verify labeling, activate with keyboard
2. **Escape Key**: Test Escape key functionality
3. **Focus Trapping**: Verify focus stays within overlay until closed
4. **Focus Return**: Verify focus returns to trigger element when closed

**Expected Results**:
- Multiple accessible close methods
- Proper focus trapping and management
- Clear button labeling

---

## PERFORMANCE TEST CASES

### TC-LP01: @Performance - Location Overlay Open Performance
**Requirement**: Fast overlay opening response time
**Priority**: Medium
**Test Data**: Multiple access methods and viewports

**Pre-conditions**:
- Performance monitoring enabled
- Multiple viewport testing

**Test Steps**:
1. Measure time from button click to overlay fully visible
2. Test from both header and navigation access
3. Monitor rendering time across viewports
4. Check for layout shifts during opening
5. Verify no blocking operations

**Expected Results**:
- Overlay opens within 500ms
- No significant layout shifts
- Smooth animation performance
- Consistent performance across access methods

---

### TC-LP02: @Performance - Country List Loading Performance
**Requirement**: Efficient display of all countries and locations
**Priority**: Medium
**Test Data**: Full dataset loading

**Pre-conditions**:
- Location overlay opening
- Full country/location dataset available

**Test Steps**:
1. Measure time to load complete country list
2. Monitor memory usage during list rendering
3. Test scrolling performance through long list
4. Verify no performance degradation with large dataset
5. Check rendering efficiency across viewports

**Expected Results**:
- Country list loads within 1 second
- Smooth scrolling performance
- No memory leaks
- Consistent performance regardless of list size

---

### TC-LP03: @Performance - Search Functionality Performance
**Requirement**: Responsive search filtering
**Priority**: High
**Test Data**: Various search scenarios

**Pre-conditions**:
- Location overlay open with full country list
- Search field available

**Test Steps**:
1. **Typing Performance**: Measure response time to each keystroke
2. **Filter Speed**: Time from search term to filtered results
3. **Large Dataset**: Test with full country list (50+ countries)
4. **Clear Performance**: Measure time to restore full list
5. **Memory Usage**: Monitor for memory leaks during repeated searches

**Expected Results**:
- Search responds within 100ms per keystroke
- Filtering completes within 200ms
- No performance degradation with large datasets
- Efficient memory management

---

## Test Execution Prerequisites

### Environment Setup
- **Base URL**: Use `envUtils.getBaseUrl()`
- **Authentication**: Cookie acceptance required
- **Browsers**: Chromium (primary), Firefox, Safari
- **Viewports**: XL (1440x900), LG (1024x768), MD (768x1024), SM (375x812)

### Test Data Requirements
- **Component URL**: Store in `componentURL.ts`
- **Figma Values**: Extract using `figma-extractor.ts` 
- **Country List**: Algeria through Zimbabwe alphabetically
- **Bayer Global**: Positioned separately first
- **Location Data**: Name, address, phone, website for each country

### Known Issues and Limitations
1. **AC8b (TC-L09)**: Active country highlighting not working - expected failure
2. **Cookie Dependency**: All tests require cookie acceptance first
3. **Language Dependency**: Tests designed for English locale with fallback testing

### Test Tags Usage
- `@Functional`: Core functionality tests
- `@Visual`: Typography and design validation
- `@Accessibility`: WCAG 2.1 AA compliance
- `@Performance`: Speed and efficiency testing

## Review Checklist
- [ ] All 15 acceptance criteria covered
- [ ] Language-agnostic assertions used
- [ ] DOM inspection completed and documented
- [ ] Figma node IDs provided for visual testing
- [ ] Soft assertions specified (no hard assertions)
- [ ] Multi-viewport testing included
- [ ] Accessibility compliance addressed
- [ ] Performance benchmarks defined
- [ ] Known issues documented
- [ ] Test case IDs follow TC-L## format

**Total Test Cases**: 16 Functional + 6 Visual + 11 Accessibility + 3 Performance = **36 Test Cases**

**Ready for Review**: ✅ Please review these comprehensive test cases before proceeding to Step 5 (Figma values extraction).
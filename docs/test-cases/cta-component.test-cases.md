# CTA Component Test Cases

**Component Name**: CTA (Call-to-Action)  
**Test Page URL**: https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/CTA  
**Last Updated**: August 29, 2025  
**Status**: Ready for Implementation  

## Component Requirements
- CTA button have 3 variations: Primary, Secondary, Link Text
- Each variation has 5 states: Default, Hover, Pressed, Focus, Disabled
- CTA may have internal or external link based on configuration
- CTA may open in same tab or new tab based on configuration

## Test Case Traceability Matrix

| Test Case ID | Description | Type | Priority | Status |
|--------------|-------------|------|----------|--------|
| TC-C001 | CTA Component Initial Load Validation | Functional | High | Ready |
| TC-C002 | Primary CTA Default State Validation | Functional | High | Ready |
| TC-C003 | Primary CTA Hover State Validation | Functional | High | Ready |
| TC-C004 | Primary CTA Focus State Validation | Functional | High | Ready |
| TC-C005 | Primary CTA Pressed State Validation | Functional | High | Ready |
| TC-C006 | Primary CTA Disabled State Validation | Functional | High | Ready |
| TC-C007 | Secondary CTA Default State Validation | Functional | High | Ready |
| TC-C008 | Secondary CTA Hover State Validation | Functional | High | Ready |
| TC-C009 | Secondary CTA Focus State Validation | Functional | High | Ready |
| TC-C010 | Secondary CTA Pressed State Validation | Functional | High | Ready |
| TC-C011 | Secondary CTA Disabled State Validation | Functional | High | Ready |
| TC-C012 | Text Link CTA Default State Validation | Functional | High | Ready |
| TC-C013 | Text Link CTA Hover State Validation | Functional | High | Ready |
| TC-C014 | Text Link CTA Focus State Validation | Functional | High | Ready |
| TC-C015 | Text Link CTA Pressed State Validation | Functional | High | Ready |
| TC-C016 | Text Link CTA Disabled State Validation | Functional | High | Ready |
| TC-C017 | Internal Link Navigation Validation | Functional | High | Ready |
| TC-C018 | External Link Navigation Validation | Functional | High | Ready |
| TC-C019 | Same Tab Link Opening Validation | Functional | High | Ready |
| TC-C020 | New Tab Link Opening Validation | Functional | High | Ready |
| TC-V001 | Primary CTA Typography - Font Family | Visual | High | Ready |
| TC-V002 | Primary CTA Typography - Font Size | Visual | High | Ready |
| TC-V003 | Primary CTA Typography - Font Weight | Visual | High | Ready |
| TC-V004 | Primary CTA Typography - Line Height | Visual | High | Ready |
| TC-V005 | Primary CTA Color - Background | Visual | High | Ready |
| TC-V006 | Primary CTA Color - Text | Visual | High | Ready |
| TC-V007 | Secondary CTA Typography Validation | Visual | High | Ready |
| TC-V008 | Secondary CTA Color - Border | Visual | High | Ready |
| TC-V009 | Secondary CTA Color - Text | Visual | High | Ready |
| TC-V010 | Text Link CTA Typography Validation | Visual | High | Ready |
| TC-V011 | Text Link CTA Color Validation | Visual | High | Ready |
| TC-V012 | CTA Spacing and Layout Validation | Visual | High | Ready |
| TC-A001 | CTA Keyboard Navigation | Accessibility | High | Ready |
| TC-A002 | CTA Focus Ring Visibility | Accessibility | High | Ready |
| TC-A003 | CTA Screen Reader Support | Accessibility | High | Ready |
| TC-A004 | CTA ARIA Attributes | Accessibility | High | Ready |
| TC-A005 | CTA Color Contrast Compliance | Accessibility | High | Ready |
| TC-A006 | CTA Tab Order Validation | Accessibility | High | Ready |
| TC-P001 | CTA Click Response Time | Performance | Medium | Ready |
| TC-P002 | CTA Hover Animation Performance | Performance | Medium | Ready |
| TC-P003 | CTA Component Load Time | Performance | Medium | Ready |

---

## Functional Test Cases

### TC-C001: CTA Component Initial Load Validation
**Objective**: Verify that all CTA components load correctly on page initialization  
**Prerequisites**: Navigate to CTA test page with authentication  
**Test Steps**:
1. Navigate to the CTA test page
2. Handle authentication with password 'beyond2025'
3. Wait for page to load completely
4. Verify all CTA containers are visible
5. Verify correct count of each CTA type

**Expected Results**:
- Page loads successfully without errors
- All CTA components (`[data-testid="ctabutton-component"]`) are visible
- Primary CTAs: 2 instances found
- Secondary CTAs: 2 instances found  
- Text Link CTAs: 2 instances found
- No broken or missing CTA elements

**Test Data**: N/A  
**Tags**: @Functional @CTA @Initial

---

### TC-C002: Primary CTA Default State Validation
**Objective**: Verify Primary CTA appears correctly in default state  
**Prerequisites**: CTA page loaded successfully  
**Test Steps**:
1. Locate primary CTA elements
2. Verify structural integrity
3. Verify visual appearance matches design
4. Verify link attributes are correct

**Expected Results**:
- Primary CTA container has `data-testid="ctabutton-component"`
- Anchor element has correct href attribute
- Background color matches design specification
- Text color matches design specification
- Font properties match design specification

**Test Data**: 
- Selector: `[data-testid="ctabutton-component"] a[class*="bg-background-bg-inverted"]`
- Expected href: `/About`
- Expected target: `_blank`

**Tags**: @Functional @CTA @Primary @Default

---

### TC-C003: Primary CTA Hover State Validation
**Objective**: Verify Primary CTA hover state behavior  
**Prerequisites**: Primary CTA visible in default state  
**Test Steps**:
1. Locate primary CTA element
2. Trigger hover state using mouse movement
3. Verify hover styles are applied
4. Verify hover animation completes
5. Move mouse away and verify return to default state

**Expected Results**:
- Hover state triggers correctly
- Background color changes to hover state
- Hover animation plays smoothly
- Gap spacing increases as per design
- Returns to default state when hover ends

**Test Data**: 
- Hover class: `hover:bg-primary-600`
- Hover gap: `hover:gap-3`

**Tags**: @Functional @CTA @Primary @Hover

---

### TC-C004: Primary CTA Focus State Validation
**Objective**: Verify Primary CTA focus state behavior  
**Prerequisites**: Primary CTA visible and accessible  
**Test Steps**:
1. Navigate to primary CTA using Tab key
2. Verify focus ring appears
3. Verify focus styles are applied
4. Press Tab to move focus away
5. Verify focus styles are removed

**Expected Results**:
- Focus ring becomes visible on focus
- Focus ring meets accessibility contrast requirements
- Focus styles match design specification
- Focus can be removed by tabbing away

**Test Data**: 
- Focus class: `focus-visible:ring-2 focus-visible:ring-background-bg-inverted`

**Tags**: @Functional @CTA @Primary @Focus @Accessibility

---

### TC-C005: Primary CTA Pressed State Validation
**Objective**: Verify Primary CTA pressed/active state behavior  
**Prerequisites**: Primary CTA visible and clickable  
**Test Steps**:
1. Locate primary CTA element
2. Press and hold mouse button on CTA
3. Verify pressed state styles are applied
4. Release mouse button
5. Verify return to hover state (if still hovering) or default

**Expected Results**:
- Pressed state triggers on mousedown
- Background color changes to pressed state
- Active styles match design specification
- Returns to appropriate state on release

**Test Data**: 
- Active class: `active:bg-background-bg-pressed`

**Tags**: @Functional @CTA @Primary @Pressed

---

### TC-C006: Primary CTA Disabled State Validation
**Objective**: Verify Primary CTA disabled state behavior  
**Prerequisites**: CTA component supports disabled state  
**Test Steps**:
1. Simulate or trigger disabled state for primary CTA
2. Verify disabled styles are applied
3. Verify CTA is not clickable
4. Verify no hover effects occur
5. Verify keyboard navigation skips disabled element

**Expected Results**:
- Disabled styles are applied correctly
- CTA cannot be clicked or activated
- No hover or focus effects occur
- Opacity reduces as per design
- Pointer events are disabled

**Test Data**: 
- Disabled classes: `disabled:bg-background-bg-accented disabled:text-text-dimmed disabled:pointer-events-none`
- Opacity: `disabled:opacity-50`

**Tags**: @Functional @CTA @Primary @Disabled

---

### TC-C007-C011: Secondary CTA State Validations
**Objective**: Verify all states for Secondary CTA (Default, Hover, Focus, Pressed, Disabled)  
**Prerequisites**: Secondary CTA components loaded  
**Test Steps**: [Similar to Primary CTA tests but for Secondary CTA elements]

**Expected Results**: 
- Default: Transparent background, dark blue border and text
- Hover: Hover effects as per design
- Focus: Focus ring with proper contrast
- Pressed: Active state styling
- Disabled: Muted colors and disabled interaction

**Test Data**: 
- Selector: `[data-testid="ctabutton-component"] a[class*="border-border-inverted"]`
- Border color: `rgb(16, 56, 79)`
- Text color: `rgb(16, 56, 79)`

**Tags**: @Functional @CTA @Secondary

---

### TC-C012-C016: Text Link CTA State Validations
**Objective**: Verify all states for Text Link CTA (Default, Hover, Focus, Pressed, Disabled)  
**Prerequisites**: Text Link CTA components loaded  
**Test Steps**: [Similar to Primary CTA tests but for Text Link CTA elements]

**Expected Results**: 
- Default: Transparent background and border, dark blue text
- Hover: Text color change to hover state
- Focus: Focus ring with proper contrast
- Pressed: Active state text color
- Disabled: Muted text color

**Test Data**: 
- Selector: `[data-testid="ctabutton-component"] a[class*="border-transparent"]`
- Hover class: `hover:text-primary-600`
- Active class: `active:text-primary-700`

**Tags**: @Functional @CTA @TextLink

---

### TC-C017: Internal Link Navigation Validation
**Objective**: Verify internal links navigate correctly within the same domain  
**Prerequisites**: CTA with internal link available  
**Test Steps**:
1. Identify CTA with internal link (href="/About")
2. Click the CTA
3. Verify navigation occurs to correct page
4. Verify URL changes to expected internal path
5. Verify page loads successfully

**Expected Results**:
- Navigation occurs within same domain
- URL changes to `/About` path
- Page loads without errors
- No external navigation occurs

**Test Data**: 
- Internal href: `/About`
- Expected URL pattern: Contains `/About`

**Tags**: @Functional @CTA @Navigation @Internal

---

### TC-C018: External Link Navigation Validation
**Objective**: Verify external links navigate correctly to external domains  
**Prerequisites**: CTA with external link available  
**Test Steps**:
1. Identify CTA with external link (href="http://www.google.com")
2. Click the CTA
3. Verify navigation occurs to external site
4. Verify correct external URL is reached

**Expected Results**:
- Navigation occurs to external domain
- URL changes to `http://www.google.com`
- External site loads successfully
- Navigation behaves as expected

**Test Data**: 
- External href: `http://www.google.com`
- Expected URL: `http://www.google.com`

**Tags**: @Functional @CTA @Navigation @External

---

### TC-C019: Same Tab Link Opening Validation
**Objective**: Verify links with same tab target open in current tab  
**Prerequisites**: CTA with target="" or no target attribute  
**Test Steps**:
1. Identify CTA with same tab target
2. Note current tab count
3. Click the CTA
4. Verify navigation occurs in same tab
5. Verify tab count remains unchanged

**Expected Results**:
- Navigation occurs in current tab
- No new tabs are opened
- Tab count remains the same
- Current tab URL changes

**Test Data**: 
- Target attribute: `""` or not present

**Tags**: @Functional @CTA @Navigation @SameTab

---

### TC-C020: New Tab Link Opening Validation
**Objective**: Verify links with new tab target open in new tab  
**Prerequisites**: CTA with target="_blank" attribute  
**Test Steps**:
1. Identify CTA with target="_blank"
2. Note current tab count
3. Click the CTA
4. Verify new tab opens
5. Verify original tab remains unchanged

**Expected Results**:
- New tab opens with target URL
- Original tab remains on same page
- Tab count increases by 1
- New tab has correct URL

**Test Data**: 
- Target attribute: `_blank`

**Tags**: @Functional @CTA @Navigation @NewTab

---

## Visual Test Cases

### TC-V001: Primary CTA Typography - Font Family
**Objective**: Verify Primary CTA uses correct font family  
**Prerequisites**: Primary CTA loaded and visible  
**Test Steps**:
1. Locate primary CTA element
2. Extract computed font-family style
3. Compare with Figma specification
4. Verify font fallbacks are appropriate

**Expected Results**:
- Font family matches: `"Bayer Sans", sans-serif`
- Font loads correctly without fallback
- Typography appears consistent across browsers

**Test Data**: 
- Expected font-family: `"Bayer Sans", sans-serif`
- Figma node: `node-id=2-8952` (Primary Default)

**Tags**: @Visual @CTA @Primary @Typography @FontFamily

---

### TC-V002: Primary CTA Typography - Font Size
**Objective**: Verify Primary CTA uses correct font size  
**Prerequisites**: Primary CTA loaded and visible  
**Test Steps**:
1. Locate primary CTA element
2. Extract computed font-size style
3. Compare with Figma specification
4. Verify sizing is consistent across viewports

**Expected Results**:
- Font size matches: `14px`
- Size appears correctly rendered
- Size is consistent across different screen sizes

**Test Data**: 
- Expected font-size: `14px`
- Figma node: `node-id=2-8952`

**Tags**: @Visual @CTA @Primary @Typography @FontSize

---

### TC-V003: Primary CTA Typography - Font Weight
**Objective**: Verify Primary CTA uses correct font weight  
**Prerequisites**: Primary CTA loaded and visible  
**Test Steps**:
1. Locate primary CTA element
2. Extract computed font-weight style
3. Compare with Figma specification
4. Verify weight renders correctly

**Expected Results**:
- Font weight matches Figma specification
- Weight appears bold/medium as designed
- Weight is consistent across browsers

**Test Data**: 
- CSS class: `font-medium`
- Figma node: `node-id=2-8952`

**Tags**: @Visual @CTA @Primary @Typography @FontWeight

---

### TC-V004: Primary CTA Typography - Line Height
**Objective**: Verify Primary CTA uses correct line height  
**Prerequisites**: Primary CTA loaded and visible  
**Test Steps**:
1. Locate primary CTA element
2. Extract computed line-height style
3. Compare with Figma specification
4. Verify spacing appears correct

**Expected Results**:
- Line height matches Figma specification
- Text spacing appears correct
- Line height maintains readability

**Test Data**: 
- CSS class: `leading-sm`
- Figma node: `node-id=2-8952`

**Tags**: @Visual @CTA @Primary @Typography @LineHeight

---

### TC-V005: Primary CTA Color - Background
**Objective**: Verify Primary CTA background color matches design  
**Prerequisites**: Primary CTA loaded in default state  
**Test Steps**:
1. Locate primary CTA element
2. Extract computed background-color
3. Compare with Figma specification
4. Verify color consistency across states

**Expected Results**:
- Background color matches: `rgb(16, 56, 79)` 
- Color appears correctly rendered
- Color is consistent with brand guidelines

**Test Data**: 
- Expected background: `rgb(16, 56, 79)` (Dark Blue)
- Figma node: `node-id=2-8952`

**Tags**: @Visual @CTA @Primary @Color @Background

---

### TC-V006: Primary CTA Color - Text
**Objective**: Verify Primary CTA text color matches design  
**Prerequisites**: Primary CTA loaded in default state  
**Test Steps**:
1. Locate primary CTA text element
2. Extract computed color style
3. Compare with Figma specification
4. Verify contrast meets accessibility standards

**Expected Results**:
- Text color matches: `rgb(255, 255, 255)`
- Color provides sufficient contrast
- Color appears correctly rendered

**Test Data**: 
- Expected text color: `rgb(255, 255, 255)` (White)
- Figma node: `node-id=2-8952`

**Tags**: @Visual @CTA @Primary @Color @Text

---

### TC-V007-V012: Additional Visual Test Cases
**Note**: Similar detailed test cases for Secondary CTA Typography, Colors, Text Link CTA styles, and overall spacing/layout validation.

---

## Accessibility Test Cases

### TC-A001: CTA Keyboard Navigation
**Objective**: Verify all CTAs are accessible via keyboard navigation  
**Prerequisites**: CTA page loaded successfully  
**Test Steps**:
1. Start from page top
2. Use Tab key to navigate to first CTA
3. Continue tabbing through all CTAs
4. Verify each CTA receives focus
5. Test activation with Enter and Space keys

**Expected Results**:
- All CTAs are reachable via Tab navigation
- Tab order is logical and intuitive
- Enter key activates CTA links
- Focus indicators are clearly visible

**Test Data**: N/A  
**Tags**: @Accessibility @CTA @Keyboard @Navigation

---

### TC-A002: CTA Focus Ring Visibility
**Objective**: Verify focus rings meet accessibility visibility requirements  
**Prerequisites**: CTAs accessible via keyboard  
**Test Steps**:
1. Navigate to each CTA using keyboard
2. Verify focus ring appears on focus
3. Measure focus ring contrast
4. Verify focus ring thickness
5. Test across different background colors

**Expected Results**:
- Focus rings are clearly visible
- Contrast ratio meets WCAG AA standards (3:1 minimum)
- Focus ring thickness is at least 2px
- Focus rings work on all background types

**Test Data**: 
- Required contrast ratio: 3:1 minimum
- Minimum thickness: 2px

**Tags**: @Accessibility @CTA @Focus @Contrast

---

### TC-A003: CTA Screen Reader Support
**Objective**: Verify CTAs are properly announced by screen readers  
**Prerequisites**: Screen reader testing environment available  
**Test Steps**:
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate to each CTA
3. Verify role is announced correctly
4. Verify link destination is clear
5. Verify state information is provided

**Expected Results**:
- CTAs announced as "link" or "button"
- Link destinations are clearly communicated
- External links are identified as such
- New tab behavior is announced

**Test Data**: N/A  
**Tags**: @Accessibility @CTA @ScreenReader

---

### TC-A004: CTA ARIA Attributes
**Objective**: Verify proper ARIA attributes are present  
**Prerequisites**: CTAs loaded and accessible  
**Test Steps**:
1. Inspect each CTA element
2. Verify appropriate ARIA attributes
3. Check for aria-label if needed
4. Verify aria-describedby if applicable
5. Test with accessibility tools

**Expected Results**:
- Semantic HTML is used appropriately
- ARIA attributes enhance accessibility
- No ARIA violations detected
- Labels are descriptive and helpful

**Test Data**: N/A  
**Tags**: @Accessibility @CTA @ARIA

---

### TC-A005: CTA Color Contrast Compliance
**Objective**: Verify all CTA color combinations meet WCAG standards  
**Prerequisites**: All CTA states visible  
**Test Steps**:
1. Measure contrast for Primary CTA (white on dark blue)
2. Measure contrast for Secondary CTA (dark blue on white)
3. Measure contrast for Text Link CTA
4. Test hover and focus state contrasts
5. Verify against WCAG AA standards

**Expected Results**:
- All color combinations meet WCAG AA (4.5:1 for normal text)
- Large text meets WCAG AA (3:1 ratio)
- No color-only information conveyance
- Hover/focus states maintain contrast

**Test Data**: 
- WCAG AA normal text: 4.5:1 minimum
- WCAG AA large text: 3:1 minimum

**Tags**: @Accessibility @CTA @Contrast @WCAG

---

### TC-A006: CTA Tab Order Validation
**Objective**: Verify logical tab order for CTA components  
**Prerequisites**: Multiple CTAs present on page  
**Test Steps**:
1. Start tabbing from page beginning
2. Note order of CTA focus
3. Verify order matches visual layout
4. Test reverse tabbing (Shift+Tab)
5. Verify no focus traps exist

**Expected Results**:
- Tab order follows reading order (left to right, top to bottom)
- All CTAs are included in tab sequence
- Reverse tabbing works correctly
- No unexpected focus behavior

**Test Data**: N/A  
**Tags**: @Accessibility @CTA @TabOrder

---

## Performance Test Cases

### TC-P001: CTA Click Response Time
**Objective**: Verify CTA click response time meets performance standards  
**Prerequisites**: CTA page loaded and ready  
**Test Steps**:
1. Set up performance monitoring
2. Click on each CTA type
3. Measure time from click to response
4. Record navigation start time
5. Compare against performance benchmarks

**Expected Results**:
- Click response time < 100ms
- Navigation starts immediately
- No perceptible delay in user interaction
- Performance consistent across CTA types

**Test Data**: 
- Target response time: < 100ms
- Acceptable range: < 200ms

**Tags**: @Performance @CTA @ClickResponse

---

### TC-P002: CTA Hover Animation Performance
**Objective**: Verify hover animations maintain 60fps performance  
**Prerequisites**: CTAs support hover animations  
**Test Steps**:
1. Set up performance monitoring for animations
2. Trigger hover states on each CTA
3. Monitor frame rate during animation
4. Measure animation duration
5. Test on different devices/browsers

**Expected Results**:
- Animations maintain 60fps
- No frame drops during transitions
- Animation duration appropriate (200-300ms)
- Smooth performance across browsers

**Test Data**: 
- Target frame rate: 60fps
- Animation duration: 200ms (from CSS)

**Tags**: @Performance @CTA @Animation @Hover

---

### TC-P003: CTA Component Load Time
**Objective**: Verify CTA components load within acceptable timeframes  
**Prerequisites**: Fresh page load scenario  
**Test Steps**:
1. Clear browser cache
2. Navigate to CTA page
3. Measure time to CTA visibility
4. Measure time to CTA interactivity
5. Compare against performance budgets

**Expected Results**:
- CTAs visible within 1-2 seconds
- CTAs interactive within 3 seconds
- No layout shifts during load
- Consistent load performance

**Test Data**: 
- Target visibility: < 2 seconds
- Target interactivity: < 3 seconds

**Tags**: @Performance @CTA @LoadTime

---

## Prerequisites and Setup Requirements

### Environment Setup
- **Browser**: Chrome/Chromium (latest version)
- **Authentication**: Password 'beyond2025' for test environment
- **Screen Resolution**: 1280x720 (default), test across multiple viewports
- **Network**: Stable internet connection for external link testing

### Test Data Requirements
- **Internal Link**: `/About` page must be accessible
- **External Link**: `http://www.google.com` must be reachable
- **Figma Access**: API access to Figma file `fiKrYZCKNM1OqXHQoGwrlX`

### Dependencies
- **Playwright**: Latest version for automation
- **Figma API**: For design specification validation
- **Accessibility Tools**: axe-core for accessibility testing
- **Performance Monitoring**: Playwright performance APIs

---

## Risk Assessment and Limitations

### Known Limitations
1. **No data-qa attributes**: Must rely on data-testid and CSS selectors
2. **Dynamic content**: CTA text/links may change based on configuration
3. **External dependencies**: Google.com availability for external link testing

### Risk Mitigation
1. **Robust selectors**: Use multiple fallback selector strategies
2. **Environment isolation**: Test with controlled/mocked external links if needed
3. **Regular maintenance**: Update selectors if component structure changes

---

## Execution Priority

### High Priority (Must Execute)
- All Functional test cases (TC-C001 to TC-C020)
- Visual typography and color test cases (TC-V001 to TC-V006)
- Core accessibility test cases (TC-A001, TC-A002, TC-A005)

### Medium Priority (Should Execute)
- Remaining visual test cases (TC-V007 to TC-V012)
- Additional accessibility test cases (TC-A003, TC-A004, TC-A006)
- Performance test cases (TC-P001 to TC-P003)

### Low Priority (Nice to Have)
- Extended browser compatibility testing
- Edge case scenario validation
- Load testing under high concurrency

---

**Review Status**: ✅ Ready for Implementation  
**Next Steps**: 
1. Fetch Figma design specifications
2. Implement test automation scripts
3. Execute test suite
4. Generate test reports

# Text with Image Component Test Cases

## Component Overview
**Component**: Text with Image (Three Variants: Default, Left, Right)
**Test URLs**: 
- Default: `Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/TextWithImage_DefaultStyling`
- Left: `Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/TextWithImage_imageleft`
- Right: `Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/TextWithImage_ImageRight`
**Environment**: QA
**Framework**: Playwright with TypeScript

## Key Locators
- `firstDescriptionElement`: `[data-qa="description-component"]` - Text with image > Headline-with-abstract > Abstract > Abstract > Text
- `imageElement`: `[data-qa="next-image"]` - Text with image > Image > MediaRatio
- `imageCaption`: `[data-qa="image-caption"]` - Text with image > Image > row > Text
- `secondDescriptionElement`: `(//section[@data-qa="description-component"]//p)[2]` - Text with image > Content > Headline (H2–H6)
- `ctaButton`: `[data-qa="cta-button"]` - Text with image > Content > Button

## Test Cases

### 1. Functional Test Cases

#### TC-TWI01: Text with Image Component Comprehensive Validation (All Variants)
**Priority**: P1
**Tags**: @Functional @P1
**Objective**: Verify that all three TextWithImage variants render with correct structure, content, and functionality
**Steps**:
1. Navigate to TextWithImage test pages (Default, Left, Right variants)
2. Accept cookies
3. Verify main container exists with data-qa="text-image-block"
4. Verify firstDescriptionElement exists with data-qa="description-component"
5. Verify imageElement exists with data-qa="next-image" and has valid src, alt attributes
6. Verify imageCaption exists with data-qa="image-caption" (if present)
7. Verify secondDescriptionElement exists using xpath: (//section[@data-qa="description-component"]//p)[2]
8. Verify ctaButton exists and is clickable
9. Verify semantic HTML structure (H2-H6 for titles, proper image tags)
10. Verify layout differences between variants (Default/Left/Right)
11. Verify all Figma-mapped elements are present and accessible
**Expected Result**: All variants display with proper structure, all locators work, and all elements are accessible

### 3. Visual/Styling Test Cases

#### TC-TWI-VIS01: Typography Validation - XL Viewport (1920x1080)
**Priority**: P1
**Tags**: @Visual @P1
**Objective**: Verify font properties match design specifications at XL viewport
**Steps**:
1. Set viewport to 1920x1080
2. Navigate to component page
3. Extract computed styles for title element:
   - Font family
   - Font size
   - Font weight
   - Color
   - Line height
4. Extract computed styles for description elements
5. Compare against Figma specifications
**Expected Result**: Typography matches design specifications

#### TC-TWI-VIS02: Typography Validation - LG Viewport (1200x800)
**Priority**: P1
**Tags**: @Visual @P1
**Objective**: Verify responsive typography at LG viewport
**Steps**: Same as VIS01 but at 1200x800 viewport
**Expected Result**: Typography adapts correctly for LG viewport

#### TC-TWI-VIS03: Typography Validation - MD Viewport (768x1024)
**Priority**: P1
**Tags**: @Visual @P1
**Objective**: Verify responsive typography at MD viewport
**Steps**: Same as VIS01 but at 768x1024 viewport
**Expected Result**: Typography adapts correctly for MD viewport

#### TC-TWI-VIS04: Typography Validation - SM Viewport (375x667)
**Priority**: P1
**Tags**: @Visual @P1
**Objective**: Verify responsive typography at SM viewport
**Steps**: Same as VIS01 but at 375x667 viewport
**Expected Result**: Typography adapts correctly for SM viewport

#### TC-TWI-VIS05: Layout Variants Validation
**Priority**: P1
**Tags**: @Visual @P1
**Objective**: Verify layout differences between Default, Left, and Right variants
**Steps**:
1. Test Default variant layout
2. Test Left variant layout (image on left)
3. Test Right variant layout (image on right)
4. Compare positioning and alignment
**Expected Result**: Each variant displays distinct layout as designed

#### TC-TWI-VIS06: Color Contrast Validation
**Priority**: P1
**Tags**: @Visual @Accessibility @P1
**Objective**: Verify color contrast meets WCAG standards
**Steps**:
1. Extract text color values
2. Extract background color values
3. Calculate contrast ratios
4. Verify meets WCAG AA standards (4.5:1 for normal text)
**Expected Result**: All text meets color contrast requirements

### 2. Accessibility Test Cases

#### TC-TWI-A01: WCAG Compliance and Accessibility Validation (All Variants)
**Priority**: P1
**Tags**: @Accessibility @P1
**Objective**: Verify component meets WCAG 2.1 AA standards and accessibility requirements
**Steps**:
1. Navigate to TextWithImage test pages (all variants)
2. Run axe-core accessibility audit - verify no violations
3. Verify semantic HTML structure (H1-H6 tags, proper image tags)
4. Verify image has descriptive alt attribute
5. Verify proper ARIA labels where needed
6. Verify logical heading hierarchy
7. Test keyboard navigation - Tab through elements
8. Verify focus indicators are visible
9. Verify CTA button accessible via keyboard
10. Verify logical tab order
11. Verify ARIA labels present for screen readers
12. Verify content read in logical order
13. Verify no empty or redundant labels
14. Calculate and verify color contrast ratios meet WCAG AA standards (4.5:1 for normal text)
**Expected Result**: Zero accessibility violations, full keyboard accessibility, proper semantic structure, WCAG AA compliance

### 4. Performance Test Cases

#### TC-TWI-P01: Loading Performance Validation
**Priority**: P2
**Tags**: @Performance @P2
**Objective**: Verify component loads within acceptable time
**Steps**:
1. Navigate to component page
2. Measure time to first contentful paint (FCP)
3. Measure time to largest contentful paint (LCP)
4. Measure cumulative layout shift (CLS)
**Expected Result**: 
- FCP < 2.5s
- LCP < 4s
- CLS < 0.1

#### TC-TWI-P02: Image Loading Optimization
**Priority**: P2
**Tags**: @Performance @P2
**Objective**: Verify images load efficiently
**Steps**:
1. Monitor network requests for images
2. Verify lazy loading if implemented
3. Verify appropriate image formats
4. Verify image compression
**Expected Result**: Optimized image loading

### 5. Cross-Browser Test Cases

**Note**: Cross-browser testing removed as per requirements

## Test Data Requirements

### Viewport Sizes
- XL: 1920x1080
- LG: 1200x800
- MD: 768x1024
- SM: 375x667

### Expected Font Properties (to be fetched from Figma)
- Title font family: TBD
- Title font size: TBD (responsive)
- Title font weight: TBD
- Title color: TBD
- Description font family: TBD
- Description font size: TBD (responsive)
- Description color: TBD
- Line height: TBD

### Color Contrast Requirements
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

## Implementation Notes

### Data Attributes Priority
1. `data-qa` (Primary)
2. `data-testid` (Secondary)
3. ARIA attributes (Accessibility)
4. CSS selectors (Last resort)

### Language-Agnostic Approach
- Use structural validation over content validation
- Avoid text content assertions
- Focus on HTML semantics and attributes
- Use computed styles for visual validation

## Traceability Matrix

| Test Case | Requirement | Component | Status |
|-----------|-------------|-----------|---------|
| TC-TWI01-05 | Functional | All variants | Ready |
| TC-TWI-VIS01-06 | Visual | All variants | Ready |
| TC-TWI-A01-04 | Accessibility | All variants | Ready |
| TC-TWI-P01-02 | Performance | All variants | Ready |
| TC-TWI-CB01-03 | Cross-browser | All variants | Ready |

## Review Questions for User

1. **Font Specifications**: Do you have the exact font family, sizes, weights, and colors from Figma for each viewport?
2. **Performance Thresholds**: Are the suggested performance thresholds (FCP < 2.5s, LCP < 4s) acceptable?
3. **Browser Priority**: Should we prioritize Chrome testing over other browsers?
4. **Figma Access**: Do you need help setting up Figma API integration to fetch exact design values?
5. **Additional Validations**: Are there any specific business rules or validations not covered above?

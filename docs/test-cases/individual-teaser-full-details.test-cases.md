# Test Cases - Individual Teaser "Full Details"

**Component**: Individual Teaser "Full Details"  
**User Story**: #2646  
**Test Page**: https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint12/individual-teaser-full-details  
**Created**: February 23, 2026  
**Status**: Ready for Review

---

## ⚠️ Important: Test Scope

**These test cases cover FRONTEND VALIDATION ONLY.**

**In Scope**:
- ✅ Component rendering and visibility on the frontend
- ✅ Visual appearance (typography, colors, spacing, responsive behavior)
- ✅ Interactive behavior (hover effects, click functionality, navigation)
- ✅ Accessibility compliance (WCAG 2.1 AA)
- ✅ Performance (load times, animation smoothness)
- ✅ Layout restrictions (25%/33% column placement - AC2)

**Out of Scope (CMS Functionality)**:
- ❌ AC1: CMS create/edit/delete capabilities (CMS backend)
- ❌ AC3: CMS editor fields and content editing (CMS backend)
- ❌ AC4: CMS link configuration interface (CMS backend)

---

## 📊 Test Coverage Summary

| Category | Test Cases | Priority High | Priority Medium | Priority Low |
|----------|------------|---------------|-----------------|--------------|
| Functional | 12 | 8 | 3 | 1 |
| Visual | 16 | 12 | 4 | 0 |
| Accessibility | 10 | 7 | 3 | 0 |
| Performance | 4 | 2 | 2 | 0 |
| **TOTAL** | **42** | **29** | **12** | **1** |

---

## 🔗 Requirements Traceability Matrix (Frontend Validation Only)

| Requirement | Description | Test Cases |
|-------------|-------------|------------|
| **AC2 (FE)** | Component renders only in 25% or 33% divider | TC-IT02, TC-IT03 |
| **Component Rendering** | All content fields render correctly (Image, Kicker, Headline, Summary, Link) | TC-IT01, TC-IT04, TC-IT05, TC-IT06, TC-IT07, TC-IT08 |
| **Hover Effect** | Image zoom 100% → 105% | TC-IT10, TC-IT31 |
| **Hover Effect** | Slanted line moves to chevron | TC-IT11, TC-IT32 |
| **Interactive Area** | Whole card clickable | TC-IT09 |
| **Visual Design** | Typography matches Figma (all viewports) | TC-IT13-TC-IT28 |
| **Accessibility** | WCAG 2.1 AA compliance | TC-IT33-TC-IT42 |
| **Performance** | Load time & animation smoothness | TC-IT43-TC-IT46 |

**Note**: AC1, AC3, AC4 are CMS-related requirements and are NOT covered by Frontend automation tests.

---

# 🎯 FUNCTIONAL TEST CASES

## TC-IT01: Component Existence and Visibility
**Priority**: High  
**Tags**: @Functional  
**Requirement**: Frontend Rendering  

**Prerequisites**:
- Test page loaded successfully
- Authentication completed (bayercorp/beyond2025)
- Cookie banner accepted

**Test Steps**:
1. Navigate to test page URL
2. Wait for page to fully load
3. Locate Individual Teaser component using `data-qa="individual-teaser"`
4. Verify component is visible in DOM

**Expected Results**:
- Component renders with `data-qa="individual-teaser"`
- Component uses `<article>` semantic tag
- Component has `aria-label="Individual teaser card"`
- Component is visible and properly displayed on page

---

## TC-IT02: Component Placement - 33% Column Validation
**Priority**: High  
**Tags**: @Functional  
**Requirement**: AC2  

**Prerequisites**:
- Test page loaded successfully
- Individual Teaser component visible

**Test Steps**:
1. Locate Individual Teaser component container
2. Inspect parent container element
3. Verify parent has `data-qa="columns33"` attribute
4. Confirm component is contained within 33% column layout

**Expected Results**:
- Parent container has `data-qa="columns33"`
- Component is properly placed in 33% divider
- Layout restriction AC2 is satisfied

---

## TC-IT03: Component Placement - 25% Column Validation
**Priority**: Medium  
**Tags**: @Functional  
**Requirement**: AC2  

**Prerequisites**:
- Test page with 25% column layout available
- Individual Teaser component visible

**Test Steps**:
1. Navigate to page with 25% column layout
2. Locate Individual Teaser component
3. Inspect parent container element
4. Verify parent has `data-qa="columns25"` attribute

**Expected Results**:
- Component can be placed in 25% divider
- Parent container reflects 25% column layout
- Layout restriction AC2 is satisfied

---

## TC-IT04: Image Element - Presence and Properties
**Priority**: High  
**Tags**: @Functional  
**Requirement**: Frontend Rendering  

**Prerequisites**:
- Individual Teaser component visible

**Test Steps**:
1. Locate image element within Individual Teaser
2. Verify image has landscape orientation
3. Check image is positioned above text content
4. Verify image has `src` attribute
5. Verify image has `alt` attribute
6. Confirm image loads successfully

**Expected Results**:
- Image element renders with `data-qa="next-image"` or similar
- Image is landscape format (width > height)
- Image is positioned above kicker/headline/summary
- Image has valid `src` URL
- Image has descriptive `alt` text
- Image displays without errors

---

## TC-IT05: Kicker Text - Presence and Content
**Priority**: High  
**Tags**: @Functional  
**Requirement**: Frontend Rendering  

**Prerequisites**:
- Individual Teaser component visible

**Test Steps**:
1. Locate kicker text element within component
2. Verify kicker text is visible
3. Check kicker text is positioned above headline
4. Verify kicker text content is not empty
5. Confirm text is readable

**Expected Results**:
- Kicker text element renders correctly
- Kicker text has `data-qa` or `data-testid` attribute
- Kicker appears above headline
- Kicker content is not empty (has text)
- Text is properly displayed on page

---

## TC-IT06: Headline Text - Presence and Semantic Structure
**Priority**: High  
**Tags**: @Functional  
**Requirement**: Frontend Rendering  

**Prerequisites**:
- Individual Teaser component visible

**Test Steps**:
1. Locate headline element within component
2. Verify headline uses semantic HTML (H2 or H3)
3. Check headline text is visible
4. Verify headline content is not empty
5. Confirm headline is positioned below kicker

**Expected Results**:
- Headline element renders with `data-qa` attribute
- Headline uses `<h2>` or `<h3>` tag (semantic HTML)
- Headline text is visible and readable
- Headline content is not empty
- Headline follows kicker in DOM order

---

## TC-IT07: Summary Text - Presence and Content
**Priority**: High  
**Tags**: @Functional  
**Requirement**: Frontend Rendering  

**Prerequisites**:
- Individual Teaser component visible

**Test Steps**:
1. Locate summary text element within component
2. Verify summary text is visible
3. Check summary appears below headline
4. Verify summary content is not empty
5. Confirm summary text is readable

**Expected Results**:
- Summary element renders with `data-qa` attribute
- Summary text is visible
- Summary is positioned below headline
- Summary content is not empty
- Text wraps properly without overflow

---

## TC-IT08: Link Element - Href and Target Rendering
**Priority**: High  
**Tags**: @Functional  
**Requirement**: Frontend Rendering  

**Prerequisites**:
- Individual Teaser component visible

**Test Steps**:
1. Locate link element within component
2. Verify link has valid `href` attribute
3. Check link target attribute is rendered (same/new tab)
4. Verify link is accessible via keyboard
5. Confirm link has visible indicator (chevron icon)

**Expected Results**:
- Link element renders with valid `href`
- Link has target attribute set correctly
- Link is keyboard accessible
- Chevron icon is visible
- Link URL is valid and clickable

---

## TC-IT09: Whole Card Clickability - Interactive Area
**Priority**: High  
**Tags**: @Functional  
**Requirement**: Interactive Area (whole card including image)  

**Prerequisites**:
- Individual Teaser component visible
- Link configured with test URL

**Test Steps**:
1. Hover over image area of teaser
2. Click on image
3. Verify navigation occurs
4. Hover over text content area
5. Click on text content
6. Verify navigation occurs
7. Click on different areas of card (kicker, headline, summary)

**Expected Results**:
- Entire card acts as single clickable area
- Image is clickable and navigates to link target
- All text areas (kicker, headline, summary) are clickable
- Click anywhere on card triggers navigation
- Link target opens correctly

---

## TC-IT10: Hover Effect - Image Zoom Animation
**Priority**: High  
**Tags**: @Functional  
**Requirement**: Hover Effect (Image Zoom 100% → 105%)  

**Prerequisites**:
- Individual Teaser component visible
- Browser supports CSS transforms

**Test Steps**:
1. Measure initial image scale/size
2. Hover mouse cursor over teaser card
3. Observe image transformation
4. Verify image scales to 105%
5. Move cursor away from card
6. Verify image returns to 100%

**Expected Results**:
- Image initial scale is 100%
- On hover, image smoothly scales to 105%
- Scale animation is visible and smooth
- On hover exit, image returns to 100%
- Animation doesn't cause layout shift

---

## TC-IT11: Hover Effect - Slanted Line Movement
**Priority**: High  
**Tags**: @Functional  
**Requirement**: Hover Effect (slanted line moves to chevron)  

**Prerequisites**:
- Individual Teaser component visible
- Slanted line visual element present

**Test Steps**:
1. Identify slanted line element position
2. Hover mouse cursor over teaser card
3. Observe slanted line animation
4. Verify line moves towards chevron icon
5. Move cursor away from card
6. Verify line returns to original position

**Expected Results**:
- Slanted line is visible in default state
- On hover, line smoothly moves towards chevron
- Movement animation is visible and smooth
- On hover exit, line returns to original position
- Animation doesn't affect other elements

---

## TC-IT12: Multi-Language Support - Content Structure
**Priority**: Low  
**Tags**: @Functional  

**Prerequisites**:
- Component available in multiple languages

**Test Steps**:
1. Load component in English
2. Verify all elements present
3. Switch to German language
4. Verify same structure maintained
5. Verify all elements still present with German content

**Expected Results**:
- Component structure is consistent across languages
- All elements (image, kicker, headline, summary, link) present
- `data-qa` attributes remain unchanged
- Layout is consistent regardless of language
- No content overflow or layout breaks

---

# 👁️ VISUAL TEST CASES

## TC-IT13: Kicker Text Typography - XL Viewport (1440px)
**Priority**: High  
**Tags**: @Visual  
**Requirement**: Visual Design (Figma node-id=9446-90712)  

**Prerequisites**:
- Test page loaded in XL viewport (1440x900)
- Figma design values extracted for XL

**Test Steps**:
1. Set browser viewport to 1440x900
2. Locate kicker text element
3. Extract computed font-family
4. Extract computed font-size
5. Extract computed line-height
6. Extract computed color
7. Compare with Figma values for node-id=9446-90712

**Expected Results**:
- Font-family matches Figma design
- Font-size matches Figma design (±1px tolerance)
- Line-height matches Figma design
- Color matches Figma design (exact hex match)

---

## TC-IT14: Kicker Text Typography - LG Viewport (1024px)
**Priority**: High  
**Tags**: @Visual  
**Requirement**: Visual Design (Figma node-id=9446-90689)  

**Prerequisites**:
- Test page loaded in LG viewport (1024x768)
- Figma design values extracted for LG

**Test Steps**:
1. Set browser viewport to 1024x768
2. Locate kicker text element
3. Extract computed font-family
4. Extract computed font-size
5. Extract computed line-height
6. Extract computed color
7. Compare with Figma values for node-id=9446-90689

**Expected Results**:
- Font-family matches Figma design
- Font-size matches Figma design (±1px tolerance)
- Line-height matches Figma design
- Color matches Figma design (exact hex match)

---

## TC-IT15: Kicker Text Typography - MD Viewport (768px)
**Priority**: High  
**Tags**: @Visual  
**Requirement**: Visual Design (Figma node-id=9446-90685)  

**Prerequisites**:
- Test page loaded in MD viewport (768x1024)
- Figma design values extracted for MD

**Test Steps**:
1. Set browser viewport to 768x1024
2. Locate kicker text element
3. Extract computed font-family
4. Extract computed font-size
5. Extract computed line-height
6. Extract computed color
7. Compare with Figma values for node-id=9446-90685

**Expected Results**:
- Font-family matches Figma design
- Font-size matches Figma design (±1px tolerance)
- Line-height matches Figma design
- Color matches Figma design (exact hex match)

---

## TC-IT16: Kicker Text Typography - SM Viewport (375px)
**Priority**: High  
**Tags**: @Visual  
**Requirement**: Visual Design (Figma node-id=9446-90674)  

**Prerequisites**:
- Test page loaded in SM viewport (375x812)
- Figma design values extracted for SM

**Test Steps**:
1. Set browser viewport to 375x812
2. Locate kicker text element
3. Extract computed font-family
4. Extract computed font-size
5. Extract computed line-height
6. Extract computed color
7. Compare with Figma values for node-id=9446-90674

**Expected Results**:
- Font-family matches Figma design
- Font-size matches Figma design (±1px tolerance)
- Line-height matches Figma design
- Color matches Figma design (exact hex match)

---

## TC-IT17: Headline Text Typography - XL Viewport (1440px)
**Priority**: High  
**Tags**: @Visual  
**Requirement**: Visual Design (Figma node-id=9446-90712)  

**Prerequisites**:
- Test page loaded in XL viewport (1440x900)
- Figma design values extracted for XL

**Test Steps**:
1. Set browser viewport to 1440x900
2. Locate headline text element
3. Extract computed font-family
4. Extract computed font-size
5. Extract computed line-height
6. Extract computed color
7. Compare with Figma values for node-id=9446-90712

**Expected Results**:
- Font-family matches Figma design
- Font-size matches Figma design (±1px tolerance)
- Line-height matches Figma design
- Color matches Figma design (exact hex match)

---

## TC-IT18: Headline Text Typography - LG Viewport (1024px)
**Priority**: High  
**Tags**: @Visual  
**Requirement**: Visual Design (Figma node-id=9446-90689)  

**Prerequisites**:
- Test page loaded in LG viewport (1024x768)
- Figma design values extracted for LG

**Test Steps**:
1. Set browser viewport to 1024x768
2. Locate headline text element
3. Extract computed font-family
4. Extract computed font-size
5. Extract computed line-height
6. Extract computed color
7. Compare with Figma values for node-id=9446-90689

**Expected Results**:
- Font-family matches Figma design
- Font-size matches Figma design (±1px tolerance)
- Line-height matches Figma design
- Color matches Figma design (exact hex match)

---

## TC-IT19: Headline Text Typography - MD Viewport (768px)
**Priority**: High  
**Tags**: @Visual  
**Requirement**: Visual Design (Figma node-id=9446-90685)  

**Prerequisites**:
- Test page loaded in MD viewport (768x1024)
- Figma design values extracted for MD

**Test Steps**:
1. Set browser viewport to 768x1024
2. Locate headline text element
3. Extract computed font-family
4. Extract computed font-size
5. Extract computed line-height
6. Extract computed color
7. Compare with Figma values for node-id=9446-90685

**Expected Results**:
- Font-family matches Figma design
- Font-size matches Figma design (±1px tolerance)
- Line-height matches Figma design
- Color matches Figma design (exact hex match)

---

## TC-IT20: Headline Text Typography - SM Viewport (375px)
**Priority**: High  
**Tags**: @Visual  
**Requirement**: Visual Design (Figma node-id=9446-90674)  

**Prerequisites**:
- Test page loaded in SM viewport (375x812)
- Figma design values extracted for SM

**Test Steps**:
1. Set browser viewport to 375x812
2. Locate headline text element
3. Extract computed font-family
4. Extract computed font-size
5. Extract computed line-height
6. Extract computed color
7. Compare with Figma values for node-id=9446-90674

**Expected Results**:
- Font-family matches Figma design
- Font-size matches Figma design (±1px tolerance)
- Line-height matches Figma design
- Color matches Figma design (exact hex match)

---

## TC-IT21: Summary Text Typography - XL Viewport (1440px)
**Priority**: High  
**Tags**: @Visual  
**Requirement**: Visual Design (Figma node-id=9446-90712)  

**Prerequisites**:
- Test page loaded in XL viewport (1440x900)
- Figma design values extracted for XL

**Test Steps**:
1. Set browser viewport to 1440x900
2. Locate summary text element
3. Extract computed font-family
4. Extract computed font-size
5. Extract computed line-height
6. Extract computed color
7. Compare with Figma values for node-id=9446-90712

**Expected Results**:
- Font-family matches Figma design
- Font-size matches Figma design (±1px tolerance)
- Line-height matches Figma design
- Color matches Figma design (exact hex match)

---

## TC-IT22: Summary Text Typography - LG Viewport (1024px)
**Priority**: High  
**Tags**: @Visual  
**Requirement**: Visual Design (Figma node-id=9446-90689)  

**Prerequisites**:
- Test page loaded in LG viewport (1024x768)
- Figma design values extracted for LG

**Test Steps**:
1. Set browser viewport to 1024x768
2. Locate summary text element
3. Extract computed font-family
4. Extract computed font-size
5. Extract computed line-height
6. Extract computed color
7. Compare with Figma values for node-id=9446-90689

**Expected Results**:
- Font-family matches Figma design
- Font-size matches Figma design (±1px tolerance)
- Line-height matches Figma design
- Color matches Figma design (exact hex match)

---

## TC-IT23: Summary Text Typography - MD Viewport (768px)
**Priority**: High  
**Tags**: @Visual  
**Requirement**: Visual Design (Figma node-id=9446-90685)  

**Prerequisites**:
- Test page loaded in MD viewport (768x1024)
- Figma design values extracted for MD

**Test Steps**:
1. Set browser viewport to 768x1024
2. Locate summary text element
3. Extract computed font-family
4. Extract computed font-size
5. Extract computed line-height
6. Extract computed color
7. Compare with Figma values for node-id=9446-90685

**Expected Results**:
- Font-family matches Figma design
- Font-size matches Figma design (±1px tolerance)
- Line-height matches Figma design
- Color matches Figma design (exact hex match)

---

## TC-IT24: Summary Text Typography - SM Viewport (375px)
**Priority**: High  
**Tags**: @Visual  
**Requirement**: Visual Design (Figma node-id=9446-90674)  

**Prerequisites**:
- Test page loaded in SM viewport (375x812)
- Figma design values extracted for SM

**Test Steps**:
1. Set browser viewport to 375x812
2. Locate summary text element
3. Extract computed font-family
4. Extract computed font-size
5. Extract computed line-height
6. Extract computed color
7. Compare with Figma values for node-id=9446-90674

**Expected Results**:
- Font-family matches Figma design
- Font-size matches Figma design (±1px tolerance)
- Line-height matches Figma design
- Color matches Figma design (exact hex match)

---

## TC-IT25: Image Aspect Ratio - All Viewports
**Priority**: Medium  
**Tags**: @Visual  

**Prerequisites**:
- Individual Teaser component visible

**Test Steps**:
1. For each viewport (XL, LG, MD, SM):
   - Set browser viewport
   - Locate image element
   - Extract image width and height
   - Calculate aspect ratio
   - Verify landscape orientation (width > height)

**Expected Results**:
- Image maintains landscape aspect ratio across all viewports
- Image width is greater than height
- Aspect ratio is consistent with design
- Image doesn't distort or stretch

---

## TC-IT26: Component Spacing and Layout - All Viewports
**Priority**: Medium  
**Tags**: @Visual  

**Prerequisites**:
- Individual Teaser component visible

**Test Steps**:
1. For each viewport (XL, LG, MD, SM):
   - Set browser viewport
   - Verify spacing between image and text
   - Verify spacing between kicker and headline
   - Verify spacing between headline and summary
   - Verify padding around component
   - Check component doesn't overflow container

**Expected Results**:
- Consistent spacing between elements per viewport
- No content overflow
- Proper padding maintained
- Layout matches Figma design
- Text doesn't touch edges

---

## TC-IT27: Link/CTA Visual Styling - Chevron Icon
**Priority**: Medium  
**Tags**: @Visual  

**Prerequisites**:
- Individual Teaser component visible

**Test Steps**:
1. Locate link/CTA element
2. Verify chevron icon is visible
3. Check icon positioning (right-aligned)
4. Verify icon color matches design
5. Test icon visibility in hover state

**Expected Results**:
- Chevron icon is visible
- Icon is right-aligned to link text
- Icon color matches design specification
- Icon is clearly visible in both default and hover states

---

## TC-IT28: Slanted Line Visual Element
**Priority**: Medium  
**Tags**: @Visual  

**Prerequisites**:
- Individual Teaser component visible

**Test Steps**:
1. Locate slanted line visual element
2. Verify line is visible in default state
3. Check line color, thickness, angle
4. Verify line positioning relative to other elements

**Expected Results**:
- Slanted line is visible
- Line styling matches Figma design
- Line is properly positioned
- Line doesn't overlap text content

---

# ♿ ACCESSIBILITY TEST CASES

## TC-IT29: Semantic HTML Structure
**Priority**: High  
**Tags**: @Accessibility  
**Requirement**: WCAG 2.1 AA - 1.3.1 Info and Relationships  

**Prerequisites**:
- Individual Teaser component visible

**Test Steps**:
1. Inspect component HTML structure
2. Verify main container uses `<article>` tag
3. Verify heading uses `<h2>` or `<h3>` tag
4. Verify image uses `<img>` tag (not background)
5. Verify link uses `<a>` tag
6. Check proper nesting of elements

**Expected Results**:
- Component uses semantic `<article>` element
- Headline uses proper heading tag (H2/H3)
- Image is semantic `<img>` element
- Link is proper `<a>` anchor element
- HTML structure is semantically correct

**WCAG Success Criteria**: 1.3.1 Info and Relationships (Level A)

---

## TC-IT30: ARIA Attributes and Labels
**Priority**: High  
**Tags**: @Accessibility  
**Requirement**: WCAG 2.1 AA - 4.1.2 Name, Role, Value  

**Prerequisites**:
- Individual Teaser component visible

**Test Steps**:
1. Verify article has `aria-label="Individual teaser card"`
2. Check image has descriptive alt text
3. Verify link has accessible name
4. Check for proper ARIA roles if used
5. Validate no ARIA errors using axe-core

**Expected Results**:
- Article has meaningful `aria-label`
- Image has descriptive `alt` attribute (not empty)
- Link has accessible name (text content or aria-label)
- No ARIA validation errors
- All interactive elements have accessible names

**WCAG Success Criteria**: 4.1.2 Name, Role, Value (Level A)

---

## TC-IT31: Keyboard Navigation - Focus Management
**Priority**: High  
**Tags**: @Accessibility  
**Requirement**: WCAG 2.1 AA - 2.1.1 Keyboard  

**Prerequisites**:
- Individual Teaser component visible
- Keyboard available

**Test Steps**:
1. Navigate to page using only keyboard
2. Press Tab to reach Individual Teaser
3. Verify entire card receives focus
4. Check focus indicator is visible
5. Press Enter to activate link
6. Verify navigation occurs

**Expected Results**:
- Card is reachable via Tab key
- Focus indicator is clearly visible
- Focus outline meets 3:1 contrast ratio
- Enter key activates the link
- Focus order is logical (top to bottom)

**WCAG Success Criteria**: 2.1.1 Keyboard (Level A), 2.4.7 Focus Visible (Level AA)

---

## TC-IT32: Keyboard Navigation - No Keyboard Trap
**Priority**: High  
**Tags**: @Accessibility  
**Requirement**: WCAG 2.1 AA - 2.1.2 No Keyboard Trap  

**Prerequisites**:
- Individual Teaser component visible
- Keyboard available

**Test Steps**:
1. Tab to Individual Teaser component
2. Tab to next focusable element after teaser
3. Shift+Tab back to teaser
4. Verify no keyboard trap exists
5. Confirm focus can move freely

**Expected Results**:
- Focus moves into and out of component freely
- No keyboard trap detected
- Tab and Shift+Tab work correctly
- User is never stuck in component

**WCAG Success Criteria**: 2.1.2 No Keyboard Trap (Level A)

---

## TC-IT33: Color Contrast - Kicker Text
**Priority**: High  
**Tags**: @Accessibility  
**Requirement**: WCAG 2.1 AA - 1.4.3 Contrast (Minimum)  

**Prerequisites**:
- Individual Teaser component visible
- Contrast checking tool available

**Test Steps**:
1. Locate kicker text element
2. Extract text color (foreground)
3. Extract background color
4. Calculate contrast ratio
5. Verify ratio meets 4.5:1 minimum

**Expected Results**:
- Kicker text contrast ratio ≥ 4.5:1
- Text is clearly readable
- Meets WCAG AA standard for normal text

**WCAG Success Criteria**: 1.4.3 Contrast (Minimum) (Level AA)

---

## TC-IT34: Color Contrast - Headline Text
**Priority**: High  
**Tags**: @Accessibility  
**Requirement**: WCAG 2.1 AA - 1.4.3 Contrast (Minimum)  

**Prerequisites**:
- Individual Teaser component visible
- Contrast checking tool available

**Test Steps**:
1. Locate headline text element
2. Extract text color (foreground)
3. Extract background color
4. Calculate contrast ratio
5. Verify ratio meets 4.5:1 minimum (or 3:1 if large text)

**Expected Results**:
- Headline contrast ratio meets minimum requirement
- Text is clearly readable
- Meets WCAG AA standard

**WCAG Success Criteria**: 1.4.3 Contrast (Minimum) (Level AA)

---

## TC-IT35: Color Contrast - Summary Text
**Priority**: High  
**Tags**: @Accessibility  
**Requirement**: WCAG 2.1 AA - 1.4.3 Contrast (Minimum)  

**Prerequisites**:
- Individual Teaser component visible
- Contrast checking tool available

**Test Steps**:
1. Locate summary text element
2. Extract text color (foreground)
3. Extract background color
4. Calculate contrast ratio
5. Verify ratio meets 4.5:1 minimum

**Expected Results**:
- Summary text contrast ratio ≥ 4.5:1
- Text is clearly readable
- Meets WCAG AA standard for normal text

**WCAG Success Criteria**: 1.4.3 Contrast (Minimum) (Level AA)

---

## TC-IT36: Screen Reader Compatibility
**Priority**: High  
**Tags**: @Accessibility  
**Requirement**: WCAG 2.1 AA - 4.1.2 Name, Role, Value  

**Prerequisites**:
- Individual Teaser component visible
- Screen reader available (NVDA/JAWS/VoiceOver)

**Test Steps**:
1. Enable screen reader
2. Navigate to Individual Teaser component
3. Verify article role is announced
4. Verify aria-label is read
5. Verify all text content is readable
6. Verify image alt text is announced
7. Verify link purpose is clear

**Expected Results**:
- Screen reader announces "article"
- Component aria-label is read: "Individual teaser card"
- All text content (kicker, headline, summary) is readable
- Image alt text is announced meaningfully
- Link target/purpose is clear from context
- Navigation is intuitive for screen reader users

**WCAG Success Criteria**: 4.1.2 Name, Role, Value (Level A)

---

## TC-IT37: Image Alternative Text Quality
**Priority**: Medium  
**Tags**: @Accessibility  
**Requirement**: WCAG 2.1 AA - 1.1.1 Non-text Content  

**Prerequisites**:
- Individual Teaser component visible

**Test Steps**:
1. Locate image element
2. Extract alt attribute value
3. Verify alt text is descriptive (not "image" or filename)
4. Check alt text provides meaningful context
5. Verify alt text is not excessively long

**Expected Results**:
- Image has alt attribute
- Alt text is descriptive and meaningful
- Alt text is not generic ("image", "photo", filename)
- Alt text provides context for the teaser
- Alt text length is reasonable (<150 characters)

**WCAG Success Criteria**: 1.1.1 Non-text Content (Level A)

---

## TC-IT38: Heading Hierarchy
**Priority**: Medium  
**Tags**: @Accessibility  
**Requirement**: WCAG 2.1 AA - 1.3.1 Info and Relationships  

**Prerequisites**:
- Individual Teaser component visible
- Page heading structure visible

**Test Steps**:
1. Inspect page heading structure
2. Identify heading level before teaser
3. Verify teaser headline uses appropriate level (H2 or H3)
4. Check heading hierarchy is logical
5. Verify no heading levels are skipped

**Expected Results**:
- Teaser headline uses appropriate heading level
- Heading hierarchy is logical (no skipped levels)
- Heading structure supports page outline
- Screen reader users can navigate by headings

**WCAG Success Criteria**: 1.3.1 Info and Relationships (Level A)

---

## TC-IT39: Axe-core Accessibility Scan
**Priority**: Medium  
**Tags**: @Accessibility  
**Requirement**: WCAG 2.1 AA - Automated Testing  

**Prerequisites**:
- Individual Teaser component visible
- Playwright with @axe-core/playwright installed

**Test Steps**:
1. Run axe-core accessibility scan on page
2. Filter results to Individual Teaser component
3. Check for violations (critical, serious, moderate)
4. Verify zero critical violations
5. Review and document any findings

**Expected Results**:
- Zero critical accessibility violations
- Zero serious accessibility violations
- Any moderate/minor issues are documented
- Component meets WCAG 2.1 AA standards
- Automated scan passes successfully

**WCAG Success Criteria**: Multiple (automated validation)

---

# ⚡ PERFORMANCE TEST CASES

## TC-IT40: Component Load Time
**Priority**: High  
**Tags**: @Performance  

**Prerequisites**:
- Test page accessible
- Network conditions normal

**Test Steps**:
1. Navigate to test page
2. Measure time from navigation to component visibility
3. Use Playwright's `waitForLoadState('domcontentloaded')`
4. Verify component renders within acceptable time
5. Repeat test 3 times and calculate average

**Expected Results**:
- Component is visible within 3 seconds of page load
- Image loads within 5 seconds
- No significant delay in content rendering
- Average load time is consistent across runs
- No blocking resources delay component

---

## TC-IT41: Image Loading Performance
**Priority**: High  
**Tags**: @Performance  

**Prerequisites**:
- Individual Teaser component visible
- Network monitoring enabled

**Test Steps**:
1. Monitor network requests
2. Measure image request time
3. Check image file size
4. Verify image format (WebP preferred)
5. Check for lazy loading implementation
6. Verify image doesn't block page rendering

**Expected Results**:
- Image loads efficiently
- Image file size is optimized (<500KB recommended)
- Image uses modern format (WebP/AVIF)
- Lazy loading is implemented if appropriate
- Image doesn't block critical rendering path

---

## TC-IT42: Hover Animation Smoothness
**Priority**: Medium  
**Tags**: @Performance  

**Prerequisites**:
- Individual Teaser component visible
- Browser DevTools Performance tab open

**Test Steps**:
1. Start performance recording
2. Hover mouse over teaser card
3. Observe image zoom animation (100% → 105%)
4. Observe slanted line movement
5. Check for frame drops or jank
6. Measure animation frame rate
7. Verify animations run at 60fps

**Expected Results**:
- Image zoom animation is smooth (60fps)
- Slanted line movement is smooth (60fps)
- No frame drops during animation
- No layout thrashing
- Animations use CSS transforms (GPU accelerated)
- No JavaScript-based animations causing jank

---

## TC-IT43: Click Response Time
**Priority**: Medium  
**Tags**: @Performance  

**Prerequisites**:
- Individual Teaser component visible
- Link configured

**Test Steps**:
1. Record timestamp before click
2. Click on teaser card
3. Record timestamp when navigation starts
4. Calculate time difference
5. Verify response is immediate (<100ms)

**Expected Results**:
- Click registers immediately (<100ms)
- No observable delay between click and navigation
- No blocking scripts delay click handler
- User experience feels responsive
- Navigation starts without delay

---

## 📝 Test Execution Notes

### Authentication Setup
All tests require HTTP Basic Authentication:
- **Username**: `bayercorp`
- **Password**: `beyond2025`

### Cookie Banner Handling
Tests must handle cookie banner before interacting with component:
- Button: `/ACCEPT COOKIES/i` (role: button)
- Alternative: `#onetrust-accept-btn-handler`

### Viewport Configurations
```typescript
XL: { width: 1440, height: 900 }
LG: { width: 1024, height: 768 }
MD: { width: 768, height: 1024 }
SM: { width: 375, height: 812 }
```

### Figma Node IDs for Visual Validation
- **XL**: 9446-90712
- **LG**: 9446-90689
- **MD**: 9446-90685
- **SM**: 9446-90674

### SmartLocator Requirements
All element interactions must use SmartLocator methods with:
- Minimum 3 fallback strategies
- Meaningful descriptions for health monitoring
- Priority: data-qa → semantic → CSS

---

## ✅ Test Case Review Checklist

Before implementation, verify:
- [ ] All acceptance criteria (AC1-AC4) are covered
- [ ] All viewports (XL, LG, MD, SM) are tested
- [ ] Visual validation includes all text elements
- [ ] Accessibility tests cover WCAG 2.1 AA
- [ ] Performance tests cover load and animation
- [ ] Test cases are clear and actionable
- [ ] Prerequisites are documented
- [ ] Expected results are specific and measurable
- [ ] Traceability to requirements is established

---

**Status**: Ready for User Review  
**Next Step**: Await user approval before proceeding to test script implementation (Step 5)

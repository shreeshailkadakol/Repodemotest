# Teaser Group Component - Test Cases

**Component**: Teaser Group  
**Test Page URL**: https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/TeaserGroup  
**Figma Reference**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=2738-27842  
**Last Updated**: October 6, 2025  
**Authentication**: Vercel protected (password: beyond2025)

---

## 📋 **Functional Test Cases**

### TC-TG001: Component Structure Validation @Functional
**Objective**: Verify Teaser Group component loads with correct structure
**Prerequisites**: Navigate to test page with authentication
**Test Steps**:
1. Navigate to TeaserGroup test page
2. Handle Vercel authentication (password: beyond2025)
3. Accept cookie banner if visible
4. Verify main container `[data-qa="teaser-group"]` is visible
5. Verify title component `[data-qa="title-component"]` exists
6. Verify highlight text `[data-qa="stage-headline-text"]` exists
7. Verify carousel container `[data-testid="teaser-group-carousel"]` is visible
8. Count individual teasers `[data-qa="individual-teaser"]`
**Expected Result**: 
- Main component visible and properly structured
- Title contains highlight text and main headline
- 6 individual teaser cards present
**Data Attributes Used**: `data-qa="teaser-group"`, `data-qa="title-component"`, `data-qa="stage-headline-text"`

### TC-TG002: Carousel Navigation - Arrow Functionality @Functional
**Objective**: Test left/right arrow navigation controls carousel movement
**Prerequisites**: Component loaded successfully
**Test Steps**:
1. Verify initial state: left arrow disabled, right arrow enabled
2. Click right arrow button `[data-qa="teaser-group"] button[aria-label*="Right"]`
3. Verify carousel moves to next set of items
4. Verify left arrow becomes enabled after first click
5. Continue clicking right arrow until last item
6. Verify right arrow becomes disabled at last item
7. Click left arrow to navigate backward
8. Verify navigation works in reverse direction
**Expected Result**: 
- Arrows correctly enable/disable based on position
- Carousel scrolls smoothly with arrow clicks
- Navigation maintains proper state throughout
**Data Attributes Used**: Parent-child relationship with `[data-qa="teaser-group"]`

### TC-TG003: Keyboard Navigation Support @Functional
**Objective**: Verify carousel supports keyboard navigation
**Prerequisites**: Component loaded and focused
**Test Steps**:
1. Tab to focus on navigation buttons
2. Use Space/Enter keys to activate arrow buttons
3. Test Arrow keys for direct carousel navigation
4. Verify focus management during navigation
5. Test keyboard accessibility for all interactive elements
**Expected Result**: 
- All navigation controls accessible via keyboard
- Focus indicators visible and logical
- Arrow keys provide direct carousel control
**Accessibility Notes**: Critical for WCAG 2.1 AA compliance

### TC-TG004: Individual Teaser Interaction @Functional
**Objective**: Verify individual teaser cards are interactive
**Prerequisites**: Component loaded with visible teasers
**Test Steps**:
1. Hover over individual teaser `[data-qa="individual-teaser"]`
2. Verify hover states and visual feedback
3. Click on teaser card
4. Verify appropriate action (navigation, modal, etc.)
5. Test interaction across different viewport sizes
**Expected Result**: 
- Teasers respond to hover and click interactions
- Visual feedback clearly indicates interactivity
- Consistent behavior across all teaser cards

---

## 🎨 **Visual/Typography Test Cases**

### TC-TG005: Title Typography Validation - XL Viewport @Visual
**Objective**: Validate main title typography matches Figma specifications (XL: 1440px)
**Prerequisites**: Browser set to XL viewport (1440x900)
**Test Steps**:
1. Set viewport to 1440x900 pixels
2. Extract computed styles from `[data-qa="title-component"]`
3. Validate font family: 'Bayer Sans'
4. Validate font size: Expected from Figma API
5. Validate font weight: '700' (Bold)
6. Validate line height: Expected from Figma API  
7. Validate text color: rgb(16, 56, 79)
**Expected Result**: All typography properties match Figma design specifications
**Figma Node ID**: 2738:27842
**Data Attributes**: `[data-qa="title-component"]`

### TC-TG006: Highlight Text Typography Validation - XL Viewport @Visual
**Objective**: Validate highlight text gradient styling (XL: 1440px)
**Prerequisites**: Browser set to XL viewport (1440x900)
**Test Steps**:
1. Extract computed styles from `[data-qa="stage-headline-text"]`
2. Validate font family: 'Bayer Sans'
3. Validate font size matches title component
4. Validate font weight: '700' (Bold)
5. Validate gradient background: linear-gradient(to right, #00B4A6, #0072CE)
6. Validate text color: transparent (for gradient effect)
7. Validate line height consistency with title
**Expected Result**: Gradient text displays correctly with proper styling
**Figma Node ID**: 2738:27842 > highlight text
**Data Attributes**: `[data-qa="stage-headline-text"]`

### TC-TG007: Multi-Viewport Typography Consistency @Visual
**Objective**: Validate responsive typography across LG/MD/SM viewports
**Prerequisites**: Component loaded successfully
**Test Steps**:
1. Test LG viewport (1024x768): Validate title and highlight text with LG specifications
2. Test MD viewport (768x1024): Validate title and highlight text with MD specifications  
3. Test SM viewport (375x667): Validate title and highlight text with SM specifications
4. Validate responsive scaling maintains proportions
5. Verify text remains readable at all viewport sizes
**Expected Results**: 
- Typography scales appropriately per viewport
- All text remains legible and well-proportioned
- Figma specifications matched across all breakpoints
**Figma Node IDs**: LG: 2738:27886, MD: 2738:27930, SM: 2738:27991

---

## ♿ **Accessibility Test Cases** 

### TC-TG008: Semantic HTML Structure @Accessibility
**Objective**: Verify proper HTML semantics for screen readers
**Prerequisites**: Component loaded with DOM inspection
**Test Steps**:
1. Verify title uses semantic H2 tag: `h2[data-qa="title-component"]`
2. Verify proper heading hierarchy (no H1 conflicts)
3. Validate ARIA labels on interactive elements
4. Check carousel has proper `aria-label="Teaser collection carousel"`
5. Verify individual teasers have descriptive aria-labels
6. Validate navigation buttons have meaningful aria-labels
**Expected Result**: 
- Proper heading structure for screen readers
- All interactive elements have descriptive labels
- Semantic HTML enhances accessibility
**WCAG Criteria**: 1.3.1 Info and Relationships, 2.4.6 Headings and Labels

### TC-TG009: Keyboard Navigation Accessibility @Accessibility
**Objective**: Verify full keyboard accessibility compliance
**Prerequisites**: Component focused, no mouse interaction
**Test Steps**:
1. Tab through all interactive elements in logical order
2. Verify focus indicators are clearly visible
3. Test Space/Enter activation on arrow buttons
4. Verify Arrow keys work for carousel navigation
5. Test Escape key behavior (if modal/overlay functionality)
6. Ensure no keyboard traps exist
7. Verify focus returns logically after interactions
**Expected Result**: 
- Complete keyboard accessibility without mouse dependency
- Logical focus order and clear visual indicators
- All functionality available via keyboard
**WCAG Criteria**: 2.1.1 Keyboard, 2.4.3 Focus Order, 2.4.7 Focus Visible

### TC-TG010: Color Contrast Standards @Accessibility
**Objective**: Verify sufficient color contrast ratios
**Prerequisites**: Component visible across all states
**Test Steps**:
1. Test title text contrast: rgb(16, 56, 79) on background
2. Test navigation button contrast in normal state
3. Test navigation button contrast in hover state  
4. Test navigation button contrast in disabled state
5. Verify teaser text contrast: white on image overlay
6. Test gradient text visibility and readability
7. Calculate contrast ratios using accessibility tools
**Expected Result**: 
- All text meets WCAG AA contrast ratio (4.5:1 minimum)
- Interactive elements maintain contrast in all states
- Gradient text remains readable
**WCAG Criteria**: 1.4.3 Contrast (Minimum)

### TC-TG011: Screen Reader Compatibility @Accessibility
**Objective**: Verify component works with screen reading technology
**Prerequisites**: Screen reader software available (NVDA/JAWS/VoiceOver)
**Test Steps**:
1. Navigate component using only screen reader
2. Verify title and highlight text are read correctly
3. Test carousel navigation announcements
4. Verify individual teaser content is accessible
5. Test navigation button state announcements (enabled/disabled)
6. Verify dot navigation is announced properly (MD/SM viewports)
7. Test overall component comprehensibility via audio only
**Expected Result**: 
- All content accessible via screen reader
- Navigation states clearly announced
- Component functionality understandable through audio
**WCAG Criteria**: 4.1.2 Name, Role, Value

---

## 📱 **Responsive & Viewport-Specific Test Cases**

### TC-TG012: Dot Navigation - MD Viewport @Visual @Responsive
**Objective**: Verify dot navigation appears and functions correctly (MD: 768px)
**Prerequisites**: Browser set to MD viewport (768x1024)
**Test Steps**:
1. Set viewport to 768x1024 pixels
2. Verify dot navigation elements are visible
3. Identify active dot indicator
4. Click on non-active dot
5. Verify carousel moves to corresponding section
6. Verify active dot updates correctly
7. Test dot navigation accessibility (keyboard/screen reader)
8. Validate dot styling matches Figma specifications
**Expected Result**: 
- Dot navigation visible and functional at MD viewport
- Visual indicators clearly show active/inactive states
- Clicking dots navigates carousel correctly
**Figma Node ID**: 2738:27930 > dotNavigation
**Responsive Behavior**: Dot navigation only appears at MD and smaller viewports

### TC-TG013: Dot Navigation - SM Viewport @Visual @Responsive  
**Objective**: Verify dot navigation functions correctly at smallest viewport (SM: 375px)
**Prerequisites**: Browser set to SM viewport (375x667)
**Test Steps**:
1. Set viewport to 375x667 pixels
2. Repeat all dot navigation tests from TC-TG012
3. Verify dot sizing appropriate for touch interaction
4. Test touch gesture navigation if supported
5. Verify spacing and visual hierarchy at small size
6. Test interaction with both dots and arrow navigation
**Expected Result**: 
- Dot navigation optimized for mobile interaction
- Touch-friendly sizing and spacing
- Consistent functionality with MD viewport
**Figma Node ID**: 2738:27991 > dotNavigation

### TC-TG014: Cross-Viewport Navigation Consistency @Responsive
**Objective**: Verify navigation behavior consistency across all viewports
**Prerequisites**: Component tested at all viewport sizes
**Test Steps**:
1. XL/LG: Verify arrow-only navigation works smoothly
2. MD/SM: Verify both arrow and dot navigation work together
3. Test navigation state preservation during viewport changes
4. Verify carousel position maintains during resize
5. Test responsive behavior of teaser card layout
6. Validate that viewport-specific features activate correctly
**Expected Result**: 
- Consistent navigation experience across all viewports
- Appropriate navigation methods available per viewport
- Smooth transitions during viewport changes

---

## ⚡ **Performance Test Cases**

### TC-TG015: Component Load Performance @Performance
**Objective**: Verify component loads within acceptable time limits
**Prerequisites**: Clean browser cache, stable network connection  
**Test Steps**:
1. Measure initial page load time with Performance API
2. Track time to first contentful paint for teaser images
3. Measure time until component is fully interactive
4. Test carousel animation performance (60fps target)
5. Monitor memory usage during navigation interactions
6. Verify no memory leaks during extended use
**Expected Result**: 
- Component loads within 3 seconds
- Smooth animations without frame drops
- Stable memory usage throughout interaction
**Performance Metrics**: LCP < 2.5s, FID < 100ms, CLS < 0.1

### TC-TG016: Image Loading Optimization @Performance
**Objective**: Verify teaser images load efficiently  
**Prerequisites**: Component with multiple teaser images
**Test Steps**:
1. Monitor network requests for teaser images
2. Verify lazy loading implementation for off-screen teasers
3. Test image optimization (WebP/AVIF format support)
4. Measure cumulative layout shift during image loading
5. Verify proper image sizing and responsive behavior
6. Test performance with slow network conditions
**Expected Result**: 
- Images load progressively without blocking
- Minimal layout shift during image loading
- Optimized formats used when supported
**Data Attributes**: `[data-qa="individual-teaser-image"]`

---

## 🔍 **Integration & Edge Case Test Cases**

### TC-TG017: Different Teaser Counts @Edge-Case
**Objective**: Verify component handles various numbers of teaser items
**Prerequisites**: Ability to modify teaser count (if configurable)
**Test Steps**:
1. Test with minimum number of teasers (1-2)
2. Test with maximum expected teasers (10+)
3. Verify navigation behavior with different counts
4. Test dot navigation with more than 4 items (per requirements)
5. Verify responsive behavior with varying content
**Expected Result**: 
- Component adapts gracefully to different content amounts
- Navigation remains functional regardless of teaser count
- Layout maintains visual balance

### TC-TG018: Content Overflow Handling @Edge-Case
**Objective**: Verify component handles long text and varied content
**Prerequisites**: Ability to test with varied content lengths
**Test Steps**:
1. Test with very long teaser headlines
2. Test with very long teaser descriptions  
3. Verify text truncation/wrapping behavior
4. Test with missing images or failed image loads
5. Verify layout stability with content variations
**Expected Result**: 
- Text content handled gracefully without breaking layout
- Consistent visual presentation regardless of content length
- Fallback behavior for missing/failed content

---

## 📊 **Test Summary**

### Test Coverage Matrix
| Category | Test Cases | Priority | Automation |
|----------|------------|----------|------------|
| Functional | TC-TG001-004 | High | ✅ Full |
| Visual/Typography | TC-TG005-007 | High | ✅ Full |  
| Accessibility | TC-TG008-011 | High | ✅ Full |
| Responsive | TC-TG012-014 | Medium | ✅ Full |
| Performance | TC-TG015-016 | Medium | ✅ Partial |
| Edge Cases | TC-TG017-018 | Low | 🔍 Manual |

### Data Attributes Reference
```typescript
// Primary locators (DOM-inspected)
'[data-qa="teaser-group"]'                    // Main container
'[data-qa="title-component"]'                 // Main title  
'[data-qa="stage-headline-text"]'             // Highlight text
'[data-testid="teaser-group-carousel"]'       // Carousel container
'[data-qa="individual-teaser"]'               // Teaser cards
'[data-qa="individual-teaser-image"]'         // Teaser images

// Navigation (parent-child relationships)
'[data-qa="teaser-group"] button[aria-label*="Left"]'   // Left arrow
'[data-qa="teaser-group"] button[aria-label*="Right"]'  // Right arrow
```

### Figma Integration Points
- **XL Viewport**: Node ID 2738:27842 - Typography validation
- **LG Viewport**: Node ID 2738:27886 - Typography validation  
- **MD Viewport**: Node ID 2738:27930 - Typography + Dot navigation
- **SM Viewport**: Node ID 2738:27991 - Typography + Dot navigation

---

**Ready for Implementation**: All test cases defined with specific data attributes, expected results, and automation guidelines following DOM-first approach and multi-language compatibility requirements.
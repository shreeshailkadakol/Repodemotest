# Banner S Variant - Test Cases Documentation

**Component**: Banner component-S variant  
**Date Created**: September 11, 2025  
**Last Updated**: September 11, 2025  
**Test Page URL**: https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/BannerSVariant  
**Authentication**: Vercel password protection (beyond2025)

## Test Summary

| Category | Total Test Cases | Status |
|----------|------------------|---------|
| Functional | 12 | Ready |
| Visual | 8 | Ready |
| Accessibility | 10 | Ready |
| Performance | 6 | Ready |
| **TOTAL** | **36** | **Ready** |

## Test Prerequisites

- Valid authentication credentials (beyond2025)
- Component URL configured in `componentURL.ts`
- Figma API values extracted for visual validation
- Test environment: Production (bayer-beyond-qa-uk.vercel.app)

## DOM Structure Reference

**Key data-qa Attributes:**
- `[data-qa="banner-component"]` - Main container
- `[data-qa="banner-image"]` - Banner image
- `[data-qa="banner-content"]` - Content container
- `[data-qa="title-component"]` - Title/headline container
- `[data-qa="stage-headline-text"]` - Highlighted text span
- `[data-qa="description-component"]` - Description paragraph

**Missing data-qa Attributes:**
- CTA buttons require parent-child locator relationships
- Primary CTA: `bannerContent.locator('a').first()`
- Secondary CTA: `bannerContent.locator('a').nth(1)`

---

## FUNCTIONAL TEST CASES

### TC-BF001: Component Container Visibility
**Objective**: Verify Banner S variant component renders correctly  
**Priority**: High  
**Tag**: @Functional

**Test Steps:**
1. Navigate to Banner S variant test page
2. Handle Vercel authentication (beyond2025)
3. Accept cookies banner
4. Wait for page to load completely
5. Verify banner component is visible

**Expected Results:**
- Banner component container `[data-qa="banner-component"]` is visible
- Component has proper responsive structure
- No layout shifts during loading

**Locator Strategy:**
```typescript
private readonly bannerContainer: Locator = this.page.locator('[data-qa="banner-component"]');
```

---

### TC-BF002: Banner Image Loading
**Objective**: Verify banner image loads correctly with proper attributes  
**Priority**: High  
**Tag**: @Functional

**Test Steps:**
1. Navigate to component
2. Locate banner image element
3. Verify image visibility
4. Verify image attributes

**Expected Results:**
- Image `[data-qa="banner-image"]` is visible
- Image has valid `src` attribute
- Image has meaningful `alt` attribute
- Image maintains 3:2 aspect ratio

**Locator Strategy:**
```typescript
private readonly bannerImage: Locator = this.bannerContainer.locator('[data-qa="banner-image"]');
```

---

### TC-BF003: Primary Overlay Text Display
**Objective**: Verify primary title text displays correctly  
**Priority**: High  
**Tag**: @Functional

**Test Steps:**
1. Navigate to component
2. Locate title component
3. Verify title visibility and content
4. Verify semantic HTML structure

**Expected Results:**
- Title element `[data-qa="title-component"]` is visible
- Title is an H2 element (semantic HTML)
- Title contains non-empty content
- Title has proper data-qa attribute

**Locator Strategy:**
```typescript
private readonly titleComponent: Locator = this.bannerContainer.locator('[data-qa="title-component"]');
```

---

### TC-BF004: Highlight Text Styling
**Objective**: Verify highlighted text within title displays with gradient styling  
**Priority**: Medium  
**Tag**: @Functional

**Test Steps:**
1. Navigate to component
2. Locate highlight text element within title
3. Verify highlight text visibility
4. Verify gradient styling classes

**Expected Results:**
- Highlight text `[data-qa="stage-headline-text"]` is visible
- Element is a span within the title
- Element has gradient styling classes
- Text content is present

**Locator Strategy:**
```typescript
private readonly highlightText: Locator = this.titleComponent.locator('[data-qa="stage-headline-text"]');
```

---

### TC-BF005: Secondary Overlay Text Display
**Objective**: Verify description text displays correctly  
**Priority**: High  
**Tag**: @Functional

**Test Steps:**
1. Navigate to component
2. Locate description component
3. Verify description visibility and content
4. Verify semantic HTML structure

**Expected Results:**
- Description `[data-qa="description-component"]` is visible
- Description is a paragraph element
- Description contains non-empty content
- Description has proper opacity styling

**Locator Strategy:**
```typescript
private readonly descriptionText: Locator = this.bannerContainer.locator('[data-qa="description-component"]');
```

---

### TC-BF006: Primary CTA Button Functionality
**Objective**: Verify primary CTA button is clickable and navigates correctly  
**Priority**: High  
**Tag**: @Functional

**Test Steps:**
1. Navigate to component
2. Locate primary CTA button using parent-child relationship
3. Verify button visibility and clickability
4. Verify button navigation target

**Expected Results:**
- Primary CTA button is visible and clickable
- Button has proper href attribute ("/About")
- Button contains "Primary CTA" text
- Button has filled/dark styling
- Button includes arrow icons

**Locator Strategy:**
```typescript
private readonly primaryCTA: Locator = this.bannerContent.locator('a').first();
```

---

### TC-BF007: Secondary CTA Button Functionality
**Objective**: Verify secondary CTA button is clickable and navigates correctly  
**Priority**: High  
**Tag**: @Functional

**Test Steps:**
1. Navigate to component
2. Locate secondary CTA button using parent-child relationship
3. Verify button visibility and clickability
4. Verify button navigation target

**Expected Results:**
- Secondary CTA button is visible and clickable
- Button has proper href attribute ("/About")
- Button contains "Secondary CTA" text
- Button has outlined styling
- Button includes arrow icons

**Locator Strategy:**
```typescript
private readonly secondaryCTA: Locator = this.bannerContent.locator('a').nth(1);
```

---

### TC-BF008: Responsive Layout - Mobile (SM)
**Objective**: Verify component layout adapts correctly on small viewports  
**Priority**: High  
**Tag**: @Functional @Responsive

**Test Steps:**
1. Set viewport to 375px width
2. Navigate to component
3. Verify layout structure
4. Verify all elements are visible

**Expected Results:**
- Single column layout displayed
- Image positioned above content
- All text elements remain visible
- CTA buttons stack appropriately
- No horizontal scrolling

**Viewport:** 375x667 (Mobile)

---

### TC-BF009: Responsive Layout - Tablet (MD)
**Objective**: Verify component layout adapts correctly on medium viewports  
**Priority**: High  
**Tag**: @Functional @Responsive

**Test Steps:**
1. Set viewport to 768px width
2. Navigate to component
3. Verify layout structure
4. Verify side-by-side layout begins

**Expected Results:**
- Side-by-side layout starts
- Image positioned on the right
- Content container on the left
- Proper spacing between elements
- All elements remain accessible

**Viewport:** 768x1024 (Tablet)

---

### TC-BF010: Responsive Layout - Desktop (LG)
**Objective**: Verify component layout on large desktop viewports  
**Priority**: High  
**Tag**: @Functional @Responsive

**Test Steps:**
1. Set viewport to 1024px width
2. Navigate to component
3. Verify full side-by-side layout
4. Verify optimal spacing and proportions

**Expected Results:**
- Full side-by-side layout displayed
- Image and content have 50/50 distribution
- Typography scales appropriately
- CTA buttons have proper spacing
- Layout is visually balanced

**Viewport:** 1024x768 (Desktop)

---

### TC-BF011: Responsive Layout - Extra Large (XL)
**Objective**: Verify component layout on extra large viewports  
**Priority**: Medium  
**Tag**: @Functional @Responsive

**Test Steps:**
1. Set viewport to 1440px width
2. Navigate to component
3. Verify layout optimization for large screens
4. Verify maximum width constraints

**Expected Results:**
- Layout maintains optimal proportions
- Content doesn't stretch excessively
- Typography remains readable
- Spacing is appropriately scaled
- Component centers properly

**Viewport:** 1440x900 (Large Desktop)

---

### TC-BF012: Component Content Persistence
**Objective**: Verify all content elements persist across page interactions  
**Priority**: Medium  
**Tag**: @Functional

**Test Steps:**
1. Navigate to component
2. Scroll to different page sections
3. Interact with other page elements
4. Return to banner component
5. Verify all elements remain intact

**Expected Results:**
- All text content remains unchanged
- Image continues to display correctly
- CTA buttons remain functional
- Styling is preserved
- No content degradation occurs

---

## VISUAL TEST CASES

### TC-BV001: Title Typography - XL Viewport
**Objective**: Verify title typography matches Figma design for XL viewport  
**Priority**: High  
**Tag**: @Visual

**Test Steps:**
1. Set viewport to 1440px width
2. Navigate to component
3. Extract computed styles from title element
4. Compare with Figma values for XL viewport (node-id: 53:9613)

**Expected Results (Figma Values):**
- Font Family: "Bayer Sans"
- Font Size: 48px
- Font Weight: 700
- Font Style: Bold
- Color: rgba(255, 255, 255, 1)
- Line Height: 56px

**Locator Strategy:**
```typescript
private readonly titleComponent: Locator = this.bannerContainer.locator('[data-qa="title-component"]');
```

---

### TC-BV002: Title Typography - LG Viewport
**Objective**: Verify title typography matches Figma design for LG viewport  
**Priority**: High  
**Tag**: @Visual

**Test Steps:**
1. Set viewport to 1024px width
2. Navigate to component
3. Extract computed styles from title element
4. Compare with Figma values for LG viewport (node-id: 53:9646)

**Expected Results (Figma Values):**
- Font Family: "Bayer Sans"
- Font Size: 48px
- Font Weight: 700
- Font Style: Bold
- Color: rgba(255, 255, 255, 1)
- Line Height: 56px

---

### TC-BV003: Title Typography - MD Viewport
**Objective**: Verify title typography matches Figma design for MD viewport  
**Priority**: High  
**Tag**: @Visual

**Test Steps:**
1. Set viewport to 768px width
2. Navigate to component
3. Extract computed styles from title element
4. Compare with Figma values for MD viewport (node-id: 53:9661)

**Expected Results (Figma Values):**
- Font Family: "Bayer Sans"
- Font Size: 30px
- Font Weight: 700
- Font Style: Bold
- Color: rgba(255, 255, 255, 1)
- Line Height: 36px

---

### TC-BV004: Title Typography - SM Viewport
**Objective**: Verify title typography matches Figma design for SM viewport  
**Priority**: High  
**Tag**: @Visual

**Test Steps:**
1. Set viewport to 375px width
2. Navigate to component
3. Extract computed styles from title element
4. Compare with Figma values for SM viewport (node-id: 53:9678)

**Expected Results (Figma Values):**
- Font Family: "Bayer Sans"
- Font Size: 30px
- Font Weight: 700
- Font Style: Bold
- Color: rgba(255, 255, 255, 1)
- Line Height: 36px

---

### TC-BV005: Highlight Text Gradient Styling
**Objective**: Verify gradient styling on highlighted text  
**Priority**: High  
**Tag**: @Visual

**Test Steps:**
1. Navigate to component
2. Locate highlight text element
3. Extract computed styles
4. Verify gradient background properties

**Expected Results:**
- Background: gradient styling applied
- Text appears transparent with gradient overlay
- Gradient colors match design specification
- Styling is consistent across viewports

**Locator Strategy:**
```typescript
private readonly highlightText: Locator = this.titleComponent.locator('[data-qa="stage-headline-text"]');
```

---

### TC-BV006: Image Aspect Ratio Verification
**Objective**: Verify banner image maintains 3:2 aspect ratio across viewports  
**Priority**: High  
**Tag**: @Visual

**Test Steps:**
1. Test across multiple viewports (SM, MD, LG, XL)
2. Navigate to component
3. Extract image dimensions
4. Calculate aspect ratio

**Expected Results:**
- Aspect ratio: 3:2 (1.5) maintained across all viewports
- Image scales proportionally
- No distortion or stretching
- Image quality remains high

**Figma Values:**
- Width: 400px
- Height: 267px
- Aspect Ratio: 1.5

---

### TC-BV007: Button Styling Differences
**Objective**: Verify visual differences between primary and secondary CTA buttons  
**Priority**: Medium  
**Tag**: @Visual

**Test Steps:**
1. Navigate to component
2. Compare primary and secondary button styling
3. Verify hover states
4. Verify focus states

**Expected Results:**
- Primary CTA: Dark/filled background
- Secondary CTA: Outlined/transparent background
- Hover effects work correctly
- Focus indicators are visible
- Icons display properly in both buttons

---

### TC-BV008: Description Text Styling
**Objective**: Verify description text styling and opacity  
**Priority**: Medium  
**Tag**: @Visual

**Test Steps:**
1. Navigate to component
2. Extract computed styles from description element
3. Verify typography properties
4. Verify opacity setting

**Expected Results:**
- Font size: 20px (xl)
- Opacity: 0.8 (80%)
- Font weight: regular/normal
- Line height: appropriate for readability
- Color matches design specification

---

## ACCESSIBILITY TEST CASES

### TC-BA001: Semantic HTML Structure
**Objective**: Verify component uses proper semantic HTML elements  
**Priority**: High  
**Tag**: @Accessibility

**Test Steps:**
1. Navigate to component
2. Inspect HTML structure
3. Verify semantic element usage
4. Run automated accessibility scan

**Expected Results:**
- Banner uses `<section>` element
- Title uses `<h2>` element (proper heading hierarchy)
- Description uses `<p>` element
- Image uses `<img>` element with alt text
- CTA buttons use `<a>` elements

**WCAG Criteria:** 1.3.1 Info and Relationships

---

### TC-BA002: Image Alternative Text
**Objective**: Verify banner image has meaningful alternative text  
**Priority**: High  
**Tag**: @Accessibility

**Test Steps:**
1. Navigate to component
2. Locate banner image
3. Verify alt attribute presence
4. Verify alt text is meaningful

**Expected Results:**
- Image has `alt` attribute
- Alt text describes image content meaningfully
- Alt text is not empty or generic
- Screen readers can interpret image purpose

**WCAG Criteria:** 1.1.1 Non-text Content

---

### TC-BA003: Keyboard Navigation
**Objective**: Verify all interactive elements are keyboard accessible  
**Priority**: High  
**Tag**: @Accessibility

**Test Steps:**
1. Navigate to component using keyboard only
2. Tab through all interactive elements
3. Verify focus indicators
4. Test activation with Enter/Space keys

**Expected Results:**
- Primary CTA button is keyboard focusable
- Secondary CTA button is keyboard focusable
- Focus indicators are clearly visible
- Buttons activate correctly with keyboard
- Tab order is logical

**WCAG Criteria:** 2.1.1 Keyboard, 2.4.7 Focus Visible

---

### TC-BA004: Color Contrast Compliance
**Objective**: Verify text color contrast meets WCAG AA standards  
**Priority**: High  
**Tag**: @Accessibility

**Test Steps:**
1. Navigate to component
2. Measure color contrast ratios for all text elements
3. Verify against WCAG AA standards (4.5:1 for normal text)
4. Test with color blindness simulators

**Expected Results:**
- Title text: Contrast ratio ≥ 4.5:1
- Description text: Contrast ratio ≥ 4.5:1 (considering opacity)
- Button text: Contrast ratio ≥ 4.5:1
- All text passes color blindness tests

**WCAG Criteria:** 1.4.3 Contrast (Minimum)

---

### TC-BA005: ARIA Labels and Attributes
**Objective**: Verify proper ARIA attributes are present  
**Priority**: Medium  
**Tag**: @Accessibility

**Test Steps:**
1. Navigate to component
2. Inspect ARIA attributes
3. Verify aria-label attributes
4. Test with screen reader

**Expected Results:**
- Title has `aria-label="title-component"`
- Description has `aria-label="description-component"`
- Image has appropriate ARIA attributes
- Component structure is properly announced

**WCAG Criteria:** 4.1.2 Name, Role, Value

---

### TC-BA006: Screen Reader Compatibility
**Objective**: Verify component is properly announced by screen readers  
**Priority**: High  
**Tag**: @Accessibility

**Test Steps:**
1. Navigate to component with screen reader enabled
2. Listen to component announcement
3. Verify content order and structure
4. Test navigation within component

**Expected Results:**
- Component structure is announced logically
- Text content is read in correct order
- Image purpose is communicated
- Interactive elements are properly identified
- No content is skipped or repeated

**Tools:** NVDA, JAWS, or VoiceOver

---

### TC-BA007: Focus Management
**Objective**: Verify proper focus management within component  
**Priority**: Medium  
**Tag**: @Accessibility

**Test Steps:**
1. Navigate to component
2. Test focus behavior
3. Verify focus doesn't get trapped
4. Test focus restoration

**Expected Results:**
- Focus moves logically through interactive elements
- Focus is not trapped within component
- Focus indicators are always visible
- Focus restoration works after interactions

**WCAG Criteria:** 2.4.3 Focus Order, 2.4.7 Focus Visible

---

### TC-BA008: Responsive Accessibility
**Objective**: Verify accessibility is maintained across viewports  
**Priority**: Medium  
**Tag**: @Accessibility @Responsive

**Test Steps:**
1. Test accessibility features across multiple viewports
2. Verify touch targets meet minimum size requirements
3. Verify readability at different screen sizes
4. Test with zoom up to 200%

**Expected Results:**
- Touch targets ≥ 44x44px on mobile
- Text remains readable at 200% zoom
- Interactive elements remain accessible
- No content is cut off or inaccessible

**WCAG Criteria:** 2.5.5 Target Size, 1.4.4 Resize Text

---

### TC-BA009: Motion and Animation Accessibility
**Objective**: Verify motion effects respect user preferences  
**Priority**: Low  
**Tag**: @Accessibility

**Test Steps:**
1. Enable "Reduce Motion" preference
2. Navigate to component
3. Verify animations are reduced or disabled
4. Test hover and focus animations

**Expected Results:**
- Button hover animations respect motion preferences
- No essential content depends on animation
- Reduced motion preference is honored
- Focus animations remain for accessibility

**WCAG Criteria:** 2.3.3 Animation from Interactions

---

### TC-BA010: Language and Localization Support
**Objective**: Verify component works with different languages and RTL layouts  
**Priority**: Low  
**Tag**: @Accessibility

**Test Steps:**
1. Test component with different language settings
2. Test RTL (right-to-left) layout support
3. Verify text rendering and layout
4. Test keyboard navigation in RTL

**Expected Results:**
- Component layout adapts to RTL languages
- Text rendering is correct in different languages
- Keyboard navigation works in RTL
- No layout issues with longer text strings

**WCAG Criteria:** 1.3.2 Meaningful Sequence

---

## PERFORMANCE TEST CASES

### TC-BP001: Image Loading Performance
**Objective**: Verify banner image loads efficiently without blocking  
**Priority**: High  
**Tag**: @Performance

**Test Steps:**
1. Navigate to component with network throttling
2. Measure image loading time
3. Verify progressive loading behavior
4. Test with different connection speeds

**Expected Results:**
- Image loads within 2 seconds on fast 3G
- Image doesn't block page rendering
- Progressive loading implemented if supported
- Image optimization is effective

**Metrics:**
- Time to First Paint (FCP)
- Largest Contentful Paint (LCP)
- Image loading time

---

### TC-BP002: Layout Shift Prevention
**Objective**: Verify component doesn't cause layout shifts during loading  
**Priority**: High  
**Tag**: @Performance

**Test Steps:**
1. Navigate to component
2. Measure Cumulative Layout Shift (CLS)
3. Monitor component rendering
4. Test across different network conditions

**Expected Results:**
- CLS score ≤ 0.1 (Good)
- No visible layout shifts during loading
- Component maintains stable layout
- Proper space reservation for images

**Metrics:**
- Cumulative Layout Shift (CLS)
- Visual stability score

---

### TC-BP003: Animation Performance
**Objective**: Verify button hover animations perform smoothly  
**Priority**: Medium  
**Tag**: @Performance

**Test Steps:**
1. Navigate to component
2. Trigger button hover animations
3. Monitor animation frame rate
4. Test on lower-end devices

**Expected Results:**
- Animations maintain 60fps
- No frame drops during interactions
- CPU usage remains reasonable
- Animations are hardware accelerated

**Metrics:**
- Frame rate (FPS)
- CPU usage during animations
- GPU utilization

---

### TC-BP004: Memory Usage
**Objective**: Verify component doesn't cause memory leaks  
**Priority**: Medium  
**Tag**: @Performance

**Test Steps:**
1. Navigate to component multiple times
2. Monitor memory usage
3. Test component interactions
4. Check for memory cleanup

**Expected Results:**
- Memory usage remains stable
- No memory leaks detected
- Proper cleanup after navigation
- Efficient memory allocation

**Metrics:**
- Memory heap usage
- Memory leak detection
- Garbage collection frequency

---

### TC-BP005: Network Resource Optimization
**Objective**: Verify component uses network resources efficiently  
**Priority**: Medium  
**Tag**: @Performance

**Test Steps:**
1. Navigate to component
2. Monitor network requests
3. Analyze resource loading
4. Verify caching behavior

**Expected Results:**
- Minimal network requests
- Proper resource caching
- Efficient image compression
- No redundant resource loading

**Metrics:**
- Number of network requests
- Total resource size
- Cache hit ratio

---

### TC-BP006: Core Web Vitals Compliance
**Objective**: Verify component meets Core Web Vitals thresholds  
**Priority**: High  
**Tag**: @Performance

**Test Steps:**
1. Navigate to component
2. Measure all Core Web Vitals
3. Test across different devices
4. Verify performance budgets

**Expected Results:**
- LCP ≤ 2.5 seconds (Good)
- FID ≤ 100 milliseconds (Good)
- CLS ≤ 0.1 (Good)
- Performance budget compliance

**Metrics:**
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

---

## Test Execution Notes

### Authentication Handling
- Use `BasePage.handleVercelAuthentication()` method
- Password: "beyond2025"
- Use `BasePage.acceptCookiesBanner()` for cookie consent

### Locator Implementation Strategy
```typescript
// Parent container
private readonly bannerContainer: Locator = this.page.locator('[data-qa="banner-component"]');

// Content elements with parent-child relationships
private readonly bannerImage: Locator = this.bannerContainer.locator('[data-qa="banner-image"]');
private readonly bannerContent: Locator = this.bannerContainer.locator('[data-qa="banner-content"]');
private readonly titleComponent: Locator = this.bannerContainer.locator('[data-qa="title-component"]');
private readonly highlightText: Locator = this.titleComponent.locator('[data-qa="stage-headline-text"]');
private readonly descriptionText: Locator = this.bannerContainer.locator('[data-qa="description-component"]');

// CTA buttons (using parent-child relationship due to missing data-qa)
private readonly primaryCTA: Locator = this.bannerContent.locator('a').first();
private readonly secondaryCTA: Locator = this.bannerContent.locator('a').nth(1);
```

### Figma Integration
- Visual test cases use extracted Figma values from `BannerSVariant-figma-values.ts`
- Node IDs: 53:9613 (XL), 53:9646 (LG), 53:9661 (MD), 53:9678 (SM)
- Font Family: "Bayer Sans"
- Typography scales: 48px (XL/LG) → 30px (MD/SM)

### Test Tags for Execution
- `@Functional` - Functional test cases
- `@Visual` - Visual validation with Figma integration
- `@Accessibility` - WCAG compliance tests
- `@Performance` - Performance and optimization tests
- `@Responsive` - Multi-viewport tests

### Viewport Configurations
- SM (Mobile): 375x667
- MD (Tablet): 768x1024
- LG (Desktop): 1024x768
- XL (Large Desktop): 1440x900

---

**Total Test Cases: 36**  
**Status: Ready for Implementation**  
**Next Step: User Review and Approval**

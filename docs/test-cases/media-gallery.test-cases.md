# Media Gallery Component - Test Cases

**Component:** Media Gallery  
**Test Page URL:** https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/MediaGallery  
**Figma Design URL:** https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=12-24055&p=f&m=dev  
**Created:** October 10, 2025  
**Status:** Ready for Implementation

## Overview

The Media Gallery component is a carousel-based media display that supports mixed media types (images and videos) with navigation controls and touch/keyboard operability. Test cases are designed following DOM-first approach with language-agnostic assertions.

## Test Environment Setup

### Prerequisites
- Authentication handled via BasePage
- Environment: QA (bayer-beyond-qa-uk.vercel.app)
- Browser compatibility: Chrome, Firefox, Safari
- Viewports: XL (1920px), LG (1200px), MD (768px), SM (375px)

### Test Data Sources
- **Figma API Integration**: Node IDs with colon format
  - XL: 486:20428
  - LG: 486:20433  
  - MD: 486:20435
  - SM: 486:20437
- **DOM Structure**: Based on live inspection (see DOM-Inspection-MediaGallery.md)

## Functional Test Cases

### TC-MG001: Media Gallery Component Initialization
**Priority:** High  
**Category:** Functional  
**Tags:** @Smoke @Functional

**Test Steps:**
1. Navigate to Media Gallery test page
2. Wait for page complete loading
3. Verify media gallery container is visible
4. Verify component loads with correct structure

**Expected Results:**
- Media gallery container with `data-qa="media-gallery-container"` is visible
- Component contains title "Highlight text headline for teaser collection"
- Component contains highlight text "Highlight text"
- Mixed media items (2 images + 1 video) are loaded
- Navigation controls are present and enabled

**Acceptance Criteria:**
- Component renders without errors
- All media items are accessible
- Navigation elements are functional

---

### TC-MG002: Carousel Navigation - Next Button
**Priority:** High  
**Category:** Functional  
**Tags:** @Functional @Navigation

**Test Steps:**
1. Load Media Gallery component
2. Locate next navigation button with `data-qa="media-gallery-next-button"`
3. Click next button
4. Verify carousel advances to next item
5. Repeat for all items in carousel
6. Verify behavior at last item

**Expected Results:**
- Next button navigates forward through media items
- Active item indicator updates correctly
- Next button is disabled/hidden at last item
- Smooth transition animation occurs
- Focus management is proper

**Acceptance Criteria:**
- Carousel navigates through all 3 media items
- Navigation state reflects current position
- Last item properly handles next button interaction

---

### TC-MG003: Carousel Navigation - Previous Button
**Priority:** High  
**Category:** Functional  
**Tags:** @Functional @Navigation

**Test Steps:**
1. Load Media Gallery component
2. Navigate to second or later item
3. Locate previous navigation button with `data-qa="media-gallery-prev-button"`
4. Click previous button
5. Verify carousel moves to previous item
6. Test behavior at first item

**Expected Results:**
- Previous button navigates backward through media items
- Active item indicator updates correctly
- Previous button is disabled/hidden at first item
- Smooth transition animation occurs
- Focus management is maintained

**Acceptance Criteria:**
- Carousel navigates backward through all items
- Navigation state updates appropriately
- First item properly handles previous button interaction

---

### TC-MG004: Dot Navigation Functionality
**Priority:** Medium  
**Category:** Functional  
**Tags:** @Functional @Navigation

**Test Steps:**
1. Load Media Gallery component
2. Locate dot navigation indicators with `data-qa="media-gallery-pagination"`
3. Click each dot indicator
4. Verify carousel jumps to corresponding item
5. Verify active dot indicator updates

**Expected Results:**
- Clicking dot navigates directly to corresponding media item
- Active dot indicator shows current position
- All 3 dots are clickable and functional
- Proper ARIA labels for accessibility
- Visual feedback on hover/focus states

**Acceptance Criteria:**
- Direct navigation to any media item works
- Visual indicators accurately reflect current position
- Accessibility attributes are present and correct

---

### TC-MG005: Mixed Media Support - Image Display
**Priority:** High  
**Category:** Functional  
**Tags:** @Functional @Media

**Test Steps:**
1. Navigate to image items in carousel (items 1 and 3)
2. Verify image elements with `data-qa="media-gallery-image"`
3. Check image loading and display quality
4. Verify caption text display (item 1 has caption)
5. Test image responsiveness across viewports

**Expected Results:**
- Images load and display correctly
- Image 1 shows caption: "Lorem ipsum dolor sit amet..."
- Image 3 displays without caption (empty caption)
- Images are responsive and maintain aspect ratio
- Alt text attributes are present for accessibility

**Acceptance Criteria:**
- Both image items render properly
- Caption handling works for both present and absent captions
- Images meet accessibility standards

---

### TC-MG006: Mixed Media Support - Video Integration
**Priority:** High  
**Category:** Functional  
**Tags:** @Functional @Media @Video

**Test Steps:**
1. Navigate to video item (item 2) in carousel
2. Verify video element with `data-qa="media-gallery-video"`
3. Check video title display: "Sample Video | 2:16"
4. Verify YouTube video integration
5. Test video play functionality
6. Verify video thumbnail display

**Expected Results:**
- Video item displays with proper thumbnail
- Video title "Sample Video | 2:16" is visible
- YouTube video URL (https://www.youtube.com/watch?v=_lGEZbhSAiY) loads correctly
- Play button is accessible and functional
- Video maintains proper aspect ratio
- Video controls are accessible

**Acceptance Criteria:**
- Video integration works seamlessly
- Video metadata (title, duration) displays correctly
- Video playback functionality is operational

---

### TC-MG007: Keyboard Navigation Support
**Priority:** High  
**Category:** Functional Accessibility  
**Tags:** @Accessibility @Keyboard @Functional

**Test Steps:**
1. Load Media Gallery component
2. Tab to media gallery container
3. Use arrow keys (Left/Right) to navigate carousel
4. Use Enter/Space keys to activate controls
5. Test Escape key functionality
6. Verify focus indicators are visible

**Expected Results:**
- Tab key moves focus to gallery controls
- Left arrow key navigates to previous item
- Right arrow key navigates to next item
- Enter/Space activates focused controls
- Focus indicators are clearly visible
- Focus trap works properly within component
- ARIA announcements work with screen readers

**Acceptance Criteria:**
- Full keyboard operability as specified in requirements
- Proper focus management throughout navigation
- Accessibility standards compliance

---

### TC-MG008: Touch Gesture Support
**Priority:** Medium  
**Category:** Functional  
**Tags:** @Functional @Touch @Mobile

**Test Steps:**
1. Load component on touch device or touch simulation
2. Perform swipe left gesture on gallery
3. Verify navigation to next item
4. Perform swipe right gesture
5. Verify navigation to previous item
6. Test edge cases (first/last items)

**Expected Results:**
- Swipe left advances to next media item
- Swipe right moves to previous media item
- Smooth touch animations
- Proper handling of swipe velocity
- Edge behavior at first/last items
- No interference with page scrolling

**Acceptance Criteria:**
- Touch gesture control works as specified
- Swipe navigation is intuitive and responsive
- Mobile user experience is optimized

## Visual Test Cases (Figma Integration)

### TC-MG-V001: XL Viewport Visual Validation
**Priority:** High  
**Category:** Visual  
**Tags:** @Visual @XL @Figma  
**Figma Node ID:** 486:20428

**Test Steps:**
1. Set viewport to XL (1920px width)
2. Load Media Gallery component
3. Fetch design tokens from Figma API (node 486:20428)
4. Compare rendered component with Figma design
5. Validate typography, colors, spacing

**Visual Validation Points:**
- **Headline Text** (Media Collection > headlineCarousel > headline > headline):
  - Font family validation
  - Font size verification  
  - Font weight checking
  - Line height measurement
  - Color hex value comparison
- **Highlight Text** (Media Collection > headlineCarousel > headline > Highlight text):
  - Typography consistency
  - Color scheme validation
- **Carousel Navigation** (CarouselNavigation > CarouselNavigationItem > arrow-forward):
  - Button styling and positioning
  - Icon design and color
  - Hover/focus states
- **Dot Navigation** (CarouselNavigation > dotNavigation > dotNavigationItems):
  - Dot size and spacing
  - Active/inactive states
  - Color scheme alignment

**Expected Results:**
- Visual match with Figma design within 95% similarity
- Typography properties match design specifications
- Color values align with design tokens
- Spacing and layout match Figma measurements

---

### TC-MG-V002: LG Viewport Visual Validation
**Priority:** High  
**Category:** Visual  
**Tags:** @Visual @LG @Figma  
**Figma Node ID:** 486:20433

**Test Steps:**
1. Set viewport to LG (1200px width)
2. Load Media Gallery component
3. Fetch design tokens from Figma API (node 486:20433)
4. Compare responsive design implementation
5. Validate layout adaptations

**Visual Validation Points:**
- Same elements as XL viewport with responsive adaptations
- Layout adjustments for medium-large screens
- Font scaling and spacing modifications
- Navigation element positioning changes

**Expected Results:**
- Responsive design matches LG Figma specifications
- Typography scales appropriately for viewport
- Navigation elements adapt correctly
- Overall visual consistency maintained

---

### TC-MG-V003: MD Viewport Visual Validation
**Priority:** High  
**Category:** Visual  
**Tags:** @Visual @MD @Figma  
**Figma Node ID:** 486:20435

**Test Steps:**
1. Set viewport to MD (768px width)
2. Load Media Gallery component  
3. Fetch design tokens from Figma API (node 486:20435)
4. Validate tablet-specific design adaptations
5. Check touch-friendly element sizing

**Visual Validation Points:**
- Tablet-optimized layout implementation
- Touch target size compliance (minimum 44px)
- Font size adjustments for readability
- Navigation control adaptations
- Spacing optimizations for medium screens

**Expected Results:**
- MD viewport design matches Figma specifications
- Touch accessibility standards met
- Typography remains readable at medium sizes
- Navigation controls are appropriately sized

---

### TC-MG-V004: SM Viewport Visual Validation
**Priority:** High  
**Category:** Visual  
**Tags:** @Visual @SM @Mobile @Figma  
**Figma Node ID:** 486:20437

**Test Steps:**
1. Set viewport to SM (375px width)
2. Load Media Gallery component
3. Fetch design tokens from Figma API (node 486:20437)
4. Validate mobile-first design implementation
5. Test mobile-specific interactions

**Visual Validation Points:**
- Mobile-optimized layout and spacing
- Touch-friendly navigation controls
- Font size and readability on small screens
- Swipe gesture area optimization
- Mobile-specific visual hierarchy

**Expected Results:**
- Mobile design matches Figma specifications exactly
- All text remains readable on mobile devices
- Touch targets meet mobile accessibility standards
- Visual hierarchy is maintained at small viewport

## Accessibility Test Cases

### TC-MG-A001: Screen Reader Compatibility
**Priority:** High  
**Category:** Accessibility  
**Tags:** @Accessibility @ScreenReader @WCAG

**Test Steps:**
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate to Media Gallery component
3. Tab through all interactive elements
4. Verify ARIA labels and announcements
5. Test carousel navigation announcements

**Expected Results:**
- Component has proper ARIA labels as specified
- Media items are announced with type (image/video)
- Navigation state is announced (e.g., "Item 1 of 3")
- Carousel changes are announced to screen reader
- All controls have descriptive labels
- Proper heading hierarchy is maintained

**Acceptance Criteria:**
- WCAG 2.1 AA compliance for screen reader accessibility
- All interactive elements are properly labeled
- Navigation state changes are announced clearly

---

### TC-MG-A002: Keyboard Focus Management
**Priority:** High  
**Category:** Accessibility  
**Tags:** @Accessibility @Keyboard @Focus @WCAG

**Test Steps:**
1. Load Media Gallery component
2. Tab to component and verify initial focus
3. Navigate using keyboard through all controls
4. Verify focus indicators are visible
5. Test focus trap within component
6. Verify logical tab order

**Expected Results:**
- Initial focus goes to appropriate starting point
- Tab order follows logical sequence
- Focus indicators are clearly visible (minimum 3:1 contrast)
- Focus remains within component when appropriate
- Escape key releases focus trap
- Focus returns to trigger element when appropriate

**Acceptance Criteria:**
- Keyboard navigation fully functional as specified
- Focus management meets WCAG guidelines
- Visual focus indicators are clearly distinguishable

---

### TC-MG-A003: Color Contrast Compliance
**Priority:** Medium  
**Category:** Accessibility  
**Tags:** @Accessibility @ColorContrast @WCAG

**Test Steps:**
1. Load Media Gallery component
2. Use accessibility testing tools (axe-core)
3. Check color contrast ratios for all text elements
4. Verify navigation control contrast
5. Test focus state contrast ratios

**Expected Results:**
- All text has minimum 4.5:1 contrast ratio
- Large text has minimum 3:1 contrast ratio
- Navigation controls meet contrast requirements
- Focus indicators have sufficient contrast
- No color-only information conveyance

**Acceptance Criteria:**
- WCAG 2.1 AA color contrast compliance
- All visual elements are distinguishable
- Information is accessible without color dependency

---

### TC-MG-A004: Alternative Text and Media Accessibility
**Priority:** High  
**Category:** Accessibility  
**Tags:** @Accessibility @AltText @Media @WCAG

**Test Steps:**
1. Navigate to Media Gallery component
2. Inspect all image elements for alt text
3. Verify video accessibility attributes
4. Check caption text accessibility
5. Test with images disabled

**Expected Results:**
- All images have descriptive alt text attributes
- Video elements have proper accessibility labels
- Caption text is programmatically associated with media
- Component functions with images disabled
- Media type is announced to assistive technology

**Acceptance Criteria:**
- All media content is accessible to screen readers
- Alternative text provides meaningful descriptions
- Media type and state are properly communicated

## Performance Test Cases

### TC-MG-P001: Component Load Performance
**Priority:** Medium  
**Category:** Performance  
**Tags:** @Performance @LoadTime

**Test Steps:**
1. Load Media Gallery test page
2. Measure component initialization time
3. Track media asset loading times
4. Monitor JavaScript execution performance
5. Analyze Core Web Vitals metrics

**Performance Metrics:**
- **Component Ready Time**: < 2 seconds
- **First Contentful Paint**: < 1.5 seconds  
- **Largest Contentful Paint**: < 2.5 seconds
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

**Expected Results:**
- Component loads within performance budgets
- Media assets load progressively
- No layout shifts during loading
- Smooth interactions with minimal delay
- Memory usage remains stable

**Acceptance Criteria:**
- All Core Web Vitals thresholds met
- Component performs well across different network conditions
- No memory leaks during navigation

---

### TC-MG-P002: Carousel Animation Performance
**Priority:** Medium  
**Category:** Performance  
**Tags:** @Performance @Animation

**Test Steps:**
1. Load Media Gallery component
2. Navigate through all carousel items rapidly
3. Monitor frame rate during animations
4. Test performance with multiple navigation actions
5. Verify smooth transitions

**Performance Metrics:**
- **Frame Rate**: Consistent 60fps during transitions
- **Animation Duration**: < 500ms per transition
- **CPU Usage**: < 30% during animations
- **Memory Impact**: No significant memory increase

**Expected Results:**
- Smooth 60fps animations throughout
- No frame drops during carousel transitions
- Consistent performance across devices
- Quick response to user interactions
- Efficient resource utilization

**Acceptance Criteria:**
- Animation performance meets 60fps standard
- No performance degradation with repeated use
- Smooth user experience across all devices

---

### TC-MG-P003: Media Asset Loading Optimization
**Priority:** Medium  
**Category:** Performance  
**Tags:** @Performance @Media @Optimization

**Test Steps:**
1. Load Media Gallery with network throttling
2. Monitor image loading strategies
3. Test video thumbnail generation
4. Verify lazy loading implementation
5. Check Content Hub asset optimization

**Performance Metrics:**
- **Image Load Time**: < 3 seconds on 3G
- **Video Thumbnail Load**: < 2 seconds
- **Total Asset Size**: < 5MB for all media
- **Compression Ratio**: > 70% from original

**Expected Results:**
- Progressive image loading
- Optimized image formats (WebP/AVIF)
- Efficient video thumbnail handling
- Proper lazy loading implementation
- Content Hub integration optimization

**Acceptance Criteria:**
- Media loads efficiently across network conditions
- Appropriate image optimization and formats used
- Video integration doesn't impact performance significantly

## Cross-Browser Test Cases

### TC-MG-CB001: Chrome Browser Compatibility
**Priority:** High  
**Category:** CrossBrowser  
**Tags:** @CrossBrowser @Chrome

**Test Steps:**
1. Load component in latest Chrome browser
2. Execute all functional test scenarios
3. Verify visual consistency
4. Test performance characteristics
5. Validate accessibility features

**Expected Results:**
- Full functionality across all features
- Visual design matches specifications
- Performance meets benchmarks
- Accessibility tools work properly
- No browser-specific issues

---

### TC-MG-CB002: Firefox Browser Compatibility
**Priority:** High  
**Category:** CrossBrowser  
**Tags:** @CrossBrowser @Firefox

**Test Steps:**
1. Load component in latest Firefox browser
2. Execute key functional tests
3. Check visual rendering differences
4. Test accessibility tool compatibility
5. Verify performance consistency

**Expected Results:**
- Consistent functionality with Chrome
- Visual rendering matches design
- Firefox-specific accessibility tools work
- Performance within acceptable variance
- No Firefox-specific bugs

---

### TC-MG-CB003: Safari Browser Compatibility
**Priority:** Medium  
**Category:** CrossBrowser  
**Tags:** @CrossBrowser @Safari

**Test Steps:**
1. Load component in latest Safari browser
2. Test touch gesture functionality
3. Verify video playback compatibility
4. Check accessibility feature support
5. Test mobile Safari specifically

**Expected Results:**
- Full functionality including touch gestures
- Video integration works properly
- Safari accessibility features supported
- Mobile Safari performance is acceptable
- No Safari-specific rendering issues

## Test Execution Guidelines

### Pre-Execution Setup
1. Ensure test environment is configured correctly
2. Verify authentication is working via BasePage
3. Check Figma API integration is functional
4. Confirm all test data is available

### Execution Order
1. **Smoke Tests**: TC-MG001 (Component Initialization)
2. **Functional Tests**: TC-MG002 through TC-MG008
3. **Visual Tests**: TC-MG-V001 through TC-MG-V004
4. **Accessibility Tests**: TC-MG-A001 through TC-MG-A004  
5. **Performance Tests**: TC-MG-P001 through TC-MG-P003
6. **Cross-Browser Tests**: TC-MG-CB001 through TC-MG-CB003

### Reporting Requirements
- Test execution results documented with screenshots
- Performance metrics recorded for analysis
- Accessibility compliance status reported
- Any deviations from expected results logged
- Cross-browser compatibility matrix updated

### Known Limitations
- Video component features excluded as per requirements (handled by Video component tests)
- Image component features excluded as per requirements (handled by Image component tests)  
- Focus on Media Gallery specific carousel and navigation functionality

---

**Total Test Cases:** 19  
**Test Coverage:** Functional (8), Visual (4), Accessibility (4), Performance (3), Cross-Browser (3)  
**Estimated Execution Time:** 2-3 hours for full suite  
**Automation Ready:** Yes, following DOM-first approach with data-qa attributes
# Simple Image Component - Test Cases

## Component Overview
- **Component Name**: Simple Image Component
- **Test URL**: `/SimpleImage`
- **DOM Container**: `[data-qa="fullwidth-column"]`
- **Key Features**: Image display, caption text, lightbox functionality
- **Generated**: September 10, 2025
- **Status**: Complete lightbox implementation verified

## Test Categories

### 🔧 @Functional Testing
- Image display and loading validation
- Caption text rendering and content verification
- Lightbox trigger functionality and interaction workflow
- Lightbox overlay display and content presentation
- Close functionality and modal state management
- Responsive behavior across viewport sizes

### 👁️ @Visual Testing  
- Figma design compliance validation (fonts, colors, spacing)
- Image aspect ratio and scaling verification
- Typography validation (font family, size, line height, color)
- Lightbox styling and overlay appearance
- Animation states and transition effects

### ♿ @Accessibility Testing
- ARIA roles and semantic HTML structure
- Screen reader compatibility and announcements
- Keyboard navigation and focus management
- Alt text and descriptive content validation
- Color contrast and visibility standards

### ⚡ @Performance Testing
- Image loading performance and optimization
- Lightbox animation smoothness and responsiveness
- Memory usage during overlay operations
- Component rendering time and resource consumption

---

## 🔧 Functional Test Cases

### F001: Image Display Validation
**Test ID**: `simpleImage-F001-imageDisplay-validation`
**Category**: @Functional
**Priority**: High
**Description**: Verify that the main image loads and displays correctly

**Preconditions**:
- Navigate to Simple Image component test page
- Handle authentication if required
- Component is fully loaded

**Test Steps**:
1. Locate the image element using `[data-qa="fullwidth-column"] [data-qa="next-image"]`
2. Verify image element is visible
3. Verify image has loaded (not broken/404)
4. Verify image has proper alt text attribute
5. Verify image src URL is accessible

**Expected Results**:
- ✅ Image element exists in DOM
- ✅ Image is visible to user
- ✅ Image loads without errors
- ✅ Alt text is present and descriptive
- ✅ Image source URL returns valid response

**Locators**:
```typescript
const componentContainer = page.locator('[data-qa="fullwidth-column"]');
const imageElement = componentContainer.locator('[data-qa="next-image"]');
```

---

### F002: Caption Text Display Validation  
**Test ID**: `simpleImage-F002-captionText-validation`
**Category**: @Functional
**Priority**: High
**Description**: Verify that the caption text renders correctly below the image

**Preconditions**:
- Navigate to Simple Image component test page
- Component is fully loaded

**Test Steps**:
1. Locate caption element using `[data-qa="fullwidth-column"] [data-qa="description-component"]`
2. Verify caption element is visible
3. Verify caption text is not empty
4. Verify caption text content matches expected text
5. Verify caption positioning relative to image

**Expected Results**:
- ✅ Caption element exists in DOM
- ✅ Caption text is visible and readable
- ✅ Caption content is present and non-empty
- ✅ Caption appears below the image
- ✅ Caption text matches design specifications

**Locators**:
```typescript
const componentContainer = page.locator('[data-qa="fullwidth-column"]');
const captionElement = componentContainer.locator('[data-qa="description-component"]');
```

---

### F003: Lightbox Trigger Functionality
**Test ID**: `simpleImage-F003-lightboxTrigger-functionality`
**Category**: @Functional  
**Priority**: High
**Description**: Verify that clicking the lightbox trigger button opens the overlay

**Preconditions**:
- Navigate to Simple Image component test page
- Component is fully loaded
- Lightbox is initially closed

**Test Steps**:
1. Locate lightbox trigger button using `button[aria-label="Open image in lightbox"]`
2. Verify trigger button is visible and clickable
3. Click the lightbox trigger button
4. Verify lightbox overlay appears
5. Verify overlay has proper dialog role and state

**Expected Results**:
- ✅ Lightbox trigger button is visible
- ✅ Button is clickable and responsive
- ✅ Click action opens the lightbox overlay
- ✅ Overlay appears with `[data-state="open"]`
- ✅ Dialog role is properly set

**Locators**:
```typescript
const lightboxTrigger = page.locator('button[aria-label="Open image in lightbox"]');
const lightboxOverlay = page.locator('div[role="dialog"][data-state="open"]');
```

---

### F004: Lightbox Content Validation
**Test ID**: `simpleImage-F004-lightboxContent-validation`
**Category**: @Functional
**Priority**: High  
**Description**: Verify that lightbox displays correct image and caption content

**Preconditions**:
- Navigate to Simple Image component test page
- Lightbox trigger has been clicked
- Lightbox overlay is open

**Test Steps**:
1. Verify lightbox image element exists using `div[role="dialog"] [data-qa="next-image"]`
2. Verify lightbox image src matches main image src
3. Verify lightbox caption element exists using `div[role="dialog"] [data-qa="description-component"]`
4. Verify lightbox caption text matches main caption text
5. Verify screen reader elements are present

**Expected Results**:
- ✅ Lightbox image element is present
- ✅ Lightbox image source matches main image
- ✅ Lightbox caption element is present  
- ✅ Lightbox caption text matches main caption
- ✅ Screen reader title and description elements exist

**Locators**:
```typescript
const lightboxImage = page.locator('div[role="dialog"] [data-qa="next-image"]');
const lightboxCaption = page.locator('div[role="dialog"] [data-qa="description-component"]');
const mainImage = page.locator('[data-qa="fullwidth-column"] [data-qa="next-image"]');
const mainCaption = page.locator('[data-qa="fullwidth-column"] [data-qa="description-component"]');
```

---

### F005: Lightbox Close Functionality
**Test ID**: `simpleImage-F005-lightboxClose-functionality`
**Category**: @Functional
**Priority**: High
**Description**: Verify that lightbox can be closed using close button

**Preconditions**:
- Navigate to Simple Image component test page
- Lightbox overlay is open

**Test Steps**:
1. Locate close button using `div[role="dialog"] svg[aria-label="close"]` parent
2. Verify close button is visible and clickable
3. Click the close button
4. Verify lightbox overlay closes and disappears
5. Verify body scroll is restored

**Expected Results**:
- ✅ Close button is visible in lightbox
- ✅ Close button is clickable
- ✅ Click action closes the lightbox
- ✅ Overlay disappears from DOM or becomes hidden
- ✅ Page scroll functionality is restored

**Locators**:
```typescript
const lightboxCloseButton = page.locator('div[role="dialog"] svg[aria-label="close"]').locator('..');
const lightboxOverlay = page.locator('div[role="dialog"][data-state="open"]');
```

---

### F006: Lightbox ESC Key Functionality
**Test ID**: `simpleImage-F006-lightboxESC-functionality`
**Category**: @Functional
**Priority**: Medium
**Description**: Verify that lightbox can be closed using ESC key

**Preconditions**:
- Navigate to Simple Image component test page
- Lightbox overlay is open

**Test Steps**:
1. Verify lightbox overlay is currently open
2. Press ESC key on keyboard
3. Verify lightbox overlay closes
4. Verify focus returns appropriately

**Expected Results**:
- ✅ ESC key press closes the lightbox
- ✅ Overlay disappears properly
- ✅ Focus management works correctly

**Locators**:
```typescript
const lightboxOverlay = page.locator('div[role="dialog"][data-state="open"]');
```

---

### F007: Body Scroll Lock Validation
**Test ID**: `simpleImage-F007-bodyScrollLock-validation`
**Category**: @Functional
**Priority**: Medium
**Description**: Verify that background scrolling is disabled when lightbox is open

**Preconditions**:
- Navigate to Simple Image component test page
- Page has scrollable content
- Lightbox is closed initially

**Test Steps**:
1. Verify page body can scroll initially
2. Open lightbox by clicking trigger button
3. Verify body scroll is locked (overflow: hidden)
4. Close lightbox
5. Verify body scroll is restored

**Expected Results**:
- ✅ Initial page scroll works normally
- ✅ Lightbox open disables background scroll
- ✅ Body has overflow: hidden when lightbox open
- ✅ Closing lightbox restores scroll functionality

---

## 👁️ Visual Test Cases

### V001: Image Aspect Ratio and Display
**Test ID**: `simpleImage-V001-imageAspectRatio-visual`
**Category**: @Visual
**Priority**: High
**Description**: Verify image displays with correct aspect ratio and scaling

**Preconditions**:
- Navigate to Simple Image component test page
- Component is fully loaded

**Test Steps**:
1. Capture screenshot of image element
2. Verify image maintains proper aspect ratio
3. Verify image scales appropriately for container
4. Compare with Figma design specifications
5. Validate across different viewport sizes

**Expected Results**:
- ✅ Image maintains correct aspect ratio
- ✅ Image fits container appropriately  
- ✅ No distortion or stretching
- ✅ Matches Figma design specifications

---

### V002: Caption Typography Validation
**Test ID**: `simpleImage-V002-captionTypography-visual`
**Category**: @Visual
**Priority**: High
**Description**: Verify caption text typography matches design specifications

**Preconditions**:
- Navigate to Simple Image component test page
- Component is fully loaded

**Test Steps**:
1. Inspect caption element computed styles
2. Verify font family matches design system
3. Verify font size matches specifications
4. Verify line height matches specifications  
5. Verify text color matches design
6. Compare with Figma API values

**Expected Results**:
- ✅ Font family matches design system
- ✅ Font size matches specifications
- ✅ Line height matches specifications
- ✅ Text color matches design values
- ✅ Typography scales appropriately

**Figma Validation**:
```typescript
// Extract design values from Figma API
const figmaStyles = await getFigmaComponentStyles('SimpleImage', 'caption');
await validateTypography(captionElement, figmaStyles);
```

---

### V003: Lightbox Visual Appearance
**Test ID**: `simpleImage-V003-lightboxVisual-appearance`
**Category**: @Visual  
**Priority**: High
**Description**: Verify lightbox overlay visual design and styling

**Preconditions**:
- Navigate to Simple Image component test page
- Lightbox is open

**Test Steps**:
1. Capture screenshot of open lightbox
2. Verify backdrop blur and transparency
3. Verify modal positioning and centering
4. Verify close button styling and position
5. Compare with design specifications

**Expected Results**:
- ✅ Backdrop has proper blur and transparency
- ✅ Modal is centered and properly positioned
- ✅ Close button styling matches design
- ✅ Overall appearance matches specifications

---

### V004: Animation and Transition Effects
**Test ID**: `simpleImage-V004-animationTransitions-visual`
**Category**: @Visual
**Priority**: Medium
**Description**: Verify smooth animations for lightbox open/close transitions

**Preconditions**:
- Navigate to Simple Image component test page

**Test Steps**:
1. Record lightbox open animation
2. Verify smooth fade and scale transitions
3. Record lightbox close animation
4. Verify animation duration and easing
5. Test animation performance

**Expected Results**:
- ✅ Smooth open animation with fade and scale
- ✅ Smooth close animation
- ✅ Appropriate animation duration
- ✅ No visual glitches or stuttering

---

### V005: Responsive Design Validation
**Test ID**: `simpleImage-V005-responsiveDesign-visual`
**Category**: @Visual
**Priority**: High
**Description**: Verify component appearance across different viewport sizes

**Test Steps**:
1. Test XL viewport (1280px+) - Desktop
2. Test LG viewport (1024px-1279px) - Laptop  
3. Test MD viewport (768px-1023px) - Tablet
4. Test SM viewport (640px-767px) - Mobile
5. Verify image scaling and caption typography
6. Verify lightbox responsiveness

**Expected Results**:
- ✅ XL: Full size image with optimal caption typography
- ✅ LG: Appropriate scaling with readable text
- ✅ MD: Tablet-optimized layout and sizing
- ✅ SM: Mobile-optimized responsive behavior
- ✅ Lightbox works properly on all sizes

---

## ♿ Accessibility Test Cases

### A001: ARIA Roles and Semantic HTML
**Test ID**: `simpleImage-A001-ariaRoles-accessibility`
**Category**: @Accessibility
**Priority**: High
**Description**: Verify proper ARIA roles and semantic HTML structure

**Test Steps**:
1. Verify image has proper alt attribute
2. Verify lightbox has `role="dialog"`
3. Verify lightbox trigger has proper aria-label
4. Verify close button has proper aria-label
5. Run automated accessibility audit

**Expected Results**:
- ✅ Image alt text is descriptive and meaningful
- ✅ Lightbox dialog role is properly set
- ✅ Trigger button aria-label is descriptive
- ✅ Close button aria-label is clear
- ✅ No accessibility violations detected

---

### A002: Screen Reader Compatibility
**Test ID**: `simpleImage-A002-screenReader-accessibility`
**Category**: @Accessibility
**Priority**: High
**Description**: Verify screen reader announcements and compatibility

**Test Steps**:
1. Verify screen reader title element exists
2. Verify screen reader description element exists  
3. Test with screen reader simulation
4. Verify proper content announcements
5. Test lightbox state announcements

**Expected Results**:
- ✅ Screen reader title "Image Lightbox" is present
- ✅ Screen reader description includes caption
- ✅ Image and caption are properly announced
- ✅ Lightbox state changes are announced
- ✅ Navigation is clear and logical

**Locators**:
```typescript
const screenReaderTitle = page.locator('div[role="dialog"] h2.sr-only');
const screenReaderDescription = page.locator('div[role="dialog"] p.sr-only');
```

---

### A003: Keyboard Navigation Support
**Test ID**: `simpleImage-A003-keyboardNavigation-accessibility`
**Category**: @Accessibility
**Priority**: High
**Description**: Verify full keyboard navigation support

**Test Steps**:
1. Tab to lightbox trigger button
2. Press Enter/Space to open lightbox
3. Verify focus moves to lightbox close button
4. Press ESC to close lightbox
5. Verify focus returns to trigger button

**Expected Results**:
- ✅ Lightbox trigger is keyboard accessible
- ✅ Enter/Space keys open lightbox
- ✅ Focus management works properly
- ✅ ESC key closes lightbox
- ✅ Focus returns to appropriate element

---

### A004: Color Contrast Validation
**Test ID**: `simpleImage-A004-colorContrast-accessibility`
**Category**: @Accessibility
**Priority**: Medium
**Description**: Verify sufficient color contrast for text elements

**Test Steps**:
1. Measure caption text contrast ratio
2. Verify meets WCAG AA standards (4.5:1)
3. Test lightbox text contrast
4. Verify button contrast ratios
5. Test with high contrast mode

**Expected Results**:
- ✅ Caption text meets WCAG AA contrast (4.5:1)
- ✅ Lightbox text has sufficient contrast
- ✅ Button elements meet contrast requirements
- ✅ High contrast mode compatibility

---

## ⚡ Performance Test Cases

### P001: Image Loading Performance
**Test ID**: `simpleImage-P001-imageLoading-performance`
**Category**: @Performance
**Priority**: High
**Description**: Verify image loading performance and optimization

**Test Steps**:
1. Measure initial image load time
2. Verify image format optimization (WebP)
3. Test image caching behavior
4. Measure Largest Contentful Paint (LCP)
5. Verify lazy loading if applicable

**Expected Results**:
- ✅ Image loads within 2 seconds on 3G
- ✅ WebP format used for optimization
- ✅ Proper caching headers present
- ✅ LCP meets Core Web Vitals standards
- ✅ Efficient image delivery

---

### P002: Lightbox Animation Performance
**Test ID**: `simpleImage-P002-lightboxAnimation-performance`
**Category**: @Performance
**Priority**: Medium
**Description**: Verify lightbox animations are smooth and performant

**Test Steps**:
1. Measure lightbox open animation FPS
2. Measure close animation performance
3. Monitor CPU usage during animations
4. Test on lower-end devices
5. Verify GPU acceleration usage

**Expected Results**:
- ✅ Animations maintain 60 FPS
- ✅ Smooth performance on mobile devices
- ✅ Reasonable CPU usage during animations
- ✅ GPU acceleration utilized
- ✅ No dropped frames or stuttering

---

### P003: Memory Usage Validation
**Test ID**: `simpleImage-P003-memoryUsage-performance`
**Category**: @Performance
**Priority**: Medium
**Description**: Verify efficient memory usage during component lifecycle

**Test Steps**:
1. Measure baseline memory usage
2. Open and close lightbox multiple times
3. Monitor for memory leaks
4. Verify garbage collection efficiency
5. Test with multiple component instances

**Expected Results**:
- ✅ No memory leaks detected
- ✅ Efficient memory cleanup on lightbox close
- ✅ Reasonable memory footprint
- ✅ Stable memory usage over time

---

### P004: Component Rendering Performance
**Test ID**: `simpleImage-P004-componentRendering-performance`
**Category**: @Performance
**Priority**: Medium  
**Description**: Verify fast component rendering and initialization

**Test Steps**:
1. Measure component mount time
2. Verify Time to Interactive (TTI)
3. Test rendering with multiple instances
4. Measure First Contentful Paint (FCP)
5. Verify efficient DOM updates

**Expected Results**:
- ✅ Component mounts within 100ms
- ✅ TTI meets performance standards
- ✅ Efficient rendering with multiple instances
- ✅ Fast FCP time
- ✅ Minimal DOM thrashing

---

## Test Execution Guidelines

### Prerequisites
- Playwright test framework setup
- Authentication credentials (beyond2025)
- Figma API integration for visual testing
- Performance monitoring tools
- Accessibility testing tools (axe-core)

### Test Data
- **Image URL**: `https://bag-d-001.sitecorecontenthub.cloud/api/public/content/6242799ea3204f1c830df7a8b3951b96?v=9aaab1b2`
- **Alt Text**: `MediaRatio.png`
- **Caption**: "Lorem ipsum dolor sit amet, consectetur adipisicing elit..."
- **Image Dimensions**: 1248x832 pixels

### Viewport Testing
- **XL**: 1280px+ (Desktop)
- **LG**: 1024px-1279px (Laptop)
- **MD**: 768px-1023px (Tablet)  
- **SM**: 640px-767px (Mobile)

### Browser Coverage
- Chromium (Primary)
- Firefox (Cross-browser)
- WebKit/Safari (Cross-browser)

---

**Total Test Cases**: 20
- **Functional**: 7 test cases
- **Visual**: 5 test cases  
- **Accessibility**: 4 test cases
- **Performance**: 4 test cases

*Generated on September 10, 2025 - Simple Image Component with complete lightbox functionality*

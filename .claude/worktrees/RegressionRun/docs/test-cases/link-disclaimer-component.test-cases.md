# Link Disclaimer Component - Test Cases

## Component Overview
**Component Name**: Link Disclaimer  
**User Story**: 855  
**Test Page URL**: https://bayer-beyond-qa-uk.vercel.app/  
**Last Updated**: January 7, 2026  

## DOM Structure Analysis
```
Container: [data-qa="popup"]
├── Header: <h2 id="popup-title"> - "Bayer UK Link Disclaimer"
├── Message: <div> - Rich text content about leaving the site
└── Button Container: <div>
    ├── Continue Button: [data-qa="link-disclaimer-primary-button"] - "OK"
    └── Cancel Button: [data-qa="link-disclaimer-secondary-button"] - "Cancel"
```

## Trigger Mechanism
1. Click location selector: `[data-qa="select-location-button"]`
2. Wait for location overlay to load
3. Click external link: `href="http://www.bayer.com"`
4. Link Disclaimer appears as modal dialog

## Requirements Traceability

| Requirement | Test Case Coverage | Status |
|-------------|-------------------|--------|
| AC4: Visitor shown Link Disclaimer when clicking off-site links | TC-LD001, TC-LD002 | Ready |
| AC5: Continue button proceeds to external link | TC-LD003 | Ready |
| AC6: Cancel button keeps user on current page | TC-LD004 | Ready |
| AC7: No disclaimer for on-site links | TC-LD005 | Ready |

---

## Functional Test Cases

### TC-LD001: Link Disclaimer Display - External Link Trigger
**Priority**: High  
**Type**: Functional  
**Tag**: @Functional  

**Test Steps**:
1. Navigate to test page
2. Accept cookies if present
3. Click location selector button `[data-qa="select-location-button"]`
4. Wait for location overlay to load (3 seconds)
5. Click external www.bayer.com link
6. Wait for Link Disclaimer to appear (2 seconds)

**Expected Results**:
- Link Disclaimer modal appears with `[data-qa="popup"]`
- Modal contains title "Bayer UK Link Disclaimer"
- Modal contains message about leaving the site
- Continue button `[data-qa="link-disclaimer-primary-button"]` is visible with text "OK"
- Cancel button `[data-qa="link-disclaimer-secondary-button"]` is visible with text "Cancel"
- Modal blocks interaction with underlying page

**Prerequisites**: Cookie consent accepted, location selector functional


### TC-LD003: Continue Button Functionality
**Priority**: High  
**Type**: Functional  
**Tag**: @Functional  

**Test Steps**:
1. Trigger Link Disclaimer (follow TC-LD001 steps 1-6)
2. Click Continue button `[data-qa="link-disclaimer-primary-button"]`
3. Wait for navigation (3 seconds)
4. Verify current URL and page content

**Expected Results**:
- Link Disclaimer modal closes
- Page navigates to external www.bayer.com site
- URL changes to external domain
- User successfully reaches intended external destination

**Prerequisites**: Link Disclaimer visible, continue button enabled

---

### TC-LD004: Cancel Button Functionality
**Priority**: High  
**Type**: Functional  
**Tag**: @Functional  

**Test Steps**:
1. Trigger Link Disclaimer (follow TC-LD001 steps 1-6)
2. Click Cancel button `[data-qa="link-disclaimer-secondary-button"]`
3. Wait for modal to close (2 seconds)
4. Verify current URL remains unchanged
5. Verify user stays on original page

**Expected Results**:
- Link Disclaimer modal closes immediately
- URL remains on original UK QA site (bayer-beyond-qa-uk.vercel.app)
- User stays on current page
- No navigation to external site occurs
- Page content remains unchanged

**Prerequisites**: Link Disclaimer visible, cancel button enabled

---

### TC-LD005: Internal Link Behavior - No Disclaimer
**Priority**: High  
**Type**: Functional  
**Tag**: @Functional  

**Test Steps**:
1. Navigate to test page
2. Accept cookies if present
3. Click internal navigation link (e.g., About Us, Businesses)
4. Verify no Link Disclaimer appears
5. Confirm direct navigation to internal page

**Expected Results**:
- No Link Disclaimer modal appears
- Direct navigation to internal page occurs
- URL changes within same domain (bayer-beyond-qa-uk.vercel.app)
- Navigation is immediate without interruption

**Prerequisites**: Internal navigation links available on page


## Accessibility Test Cases

### TC-LD007: Keyboard Navigation Support
**Priority**: High  
**Type**: Accessibility  
**Tag**: @Accessibility  

**Test Steps**:
1. Trigger Link Disclaimer using keyboard navigation
2. Use Tab key to navigate through modal elements
3. Verify focus order: Continue button → Cancel button
4. Test Enter key on focused Continue button
5. Test Enter key on focused Cancel button
6. Test Escape key to close modal

**Expected Results**:
- Modal can be triggered via keyboard
- Tab navigation works in logical order
- Focus indicators clearly visible
- Enter key activates focused button
- Escape key closes modal (AC11 equivalent)
- Focus trapped within modal when open

**Prerequisites**: Keyboard navigation enabled, modal visible

---

### TC-LD008: Screen Reader Compatibility
**Priority**: High  
**Type**: Accessibility  
**Tag**: @Accessibility  

**Test Steps**:
1. Use screen reader to navigate to Link Disclaimer trigger
2. Activate Link Disclaimer
3. Verify screen reader announces modal opening
4. Navigate modal content with screen reader
5. Test button descriptions and labels
6. Verify modal closure announcement

**Expected Results**:
- Modal opening properly announced
- All content readable by screen reader
- Button purposes clearly communicated
- Modal has proper ARIA role and labels
- Focus management works with screen reader
- Modal closure properly announced

**Prerequisites**: Screen reader software available, accessibility tools enabled

---

### TC-LD009: Color Contrast and Visual Accessibility
**Priority**: Medium  
**Type**: Accessibility  
**Tag**: @Accessibility  

**Test Steps**:
1. Trigger Link Disclaimer
2. Verify color contrast ratios for all text elements
3. Check button visibility and contrast
4. Test modal visibility against background
5. Verify readability in high contrast mode

**Expected Results**:
- All text meets WCAG 2.1 AA contrast requirements (4.5:1 minimum)
- Buttons have sufficient contrast for visibility
- Modal overlay provides adequate background contrast
- Content remains readable in high contrast mode
- No color-only information communication

**Prerequisites**: Color contrast testing tools, high contrast mode available

---

### TC-LD010: ARIA Attributes and Semantic HTML
**Priority**: High  
**Type**: Accessibility  
**Tag**: @Accessibility  

**Test Steps**:
1. Trigger Link Disclaimer
2. Inspect modal for proper ARIA attributes
3. Verify semantic HTML structure
4. Check role assignments and labels
5. Validate button accessibility properties

**Expected Results**:
- Modal has role="dialog" or role="alertdialog"
- Proper aria-labelledby pointing to title
- Buttons have appropriate aria-label attributes
- Heading structure is semantic (H2 for title)
- Modal has proper aria-modal="true"
- Focus management attributes present

**Prerequisites**: Browser developer tools, accessibility inspector

---

## Performance Test Cases

### TC-LD011: Modal Load Performance
**Priority**: Medium  
**Type**: Performance  
**Tag**: @Performance  

**Test Steps**:
1. Measure time from external link click to modal display
2. Record modal rendering performance
3. Test button interaction response times
4. Measure modal closure time

**Expected Results**:
- Modal appears within 500ms of external link click
- Interactive elements respond within 100ms
- Modal closure time under 200ms
- No visible lag or performance issues
- Smooth animations and transitions

**Performance Baseline**:
- Modal display: ≤ 500ms
- Button response: ≤ 100ms
- Modal closure: ≤ 200ms

**Prerequisites**: Performance monitoring tools enabled

---

### TC-LD012: Memory and Resource Usage
**Priority**: Low  
**Type**: Performance  
**Tag**: @Performance  

**Test Steps**:
1. Monitor memory usage before triggering disclaimer
2. Trigger and interact with Link Disclaimer multiple times
3. Monitor memory consumption and cleanup
4. Check for memory leaks after modal operations

**Expected Results**:
- No significant memory increase after modal operations
- Proper cleanup after modal closure
- No memory leaks from repeated operations
- Resource usage remains stable

**Performance Baseline**:
- Memory increase: ≤ 5MB per operation
- Memory cleanup: 100% after closure

**Prerequisites**: Browser memory profiling tools

---

## Cross-Browser Test Cases

### TC-LD013: Chrome Browser Compatibility
**Priority**: High  
**Type**: Cross-Browser  
**Tag**: @Functional @CrossBrowser  

**Test Steps**:
1. Execute TC-LD001 through TC-LD006 in Chrome browser
2. Verify consistent behavior across all functional tests
3. Check visual appearance and layout
4. Test accessibility features in Chrome

**Expected Results**:
- All functional tests pass identically to other browsers
- Visual consistency maintained
- Performance within acceptable ranges
- Accessibility features work properly

**Prerequisites**: Latest Chrome browser version

---

### TC-LD014: Edge Browser Compatibility
**Priority**: High  
**Type**: Cross-Browser  
**Tag**: @Functional @CrossBrowser  

**Test Steps**:
1. Execute core functional tests (TC-LD001, TC-LD003, TC-LD004) in Edge
2. Verify modal display and interaction behavior
3. Test keyboard navigation and accessibility

**Expected Results**:
- Identical functionality to Chrome browser
- No browser-specific issues
- Consistent user experience

**Prerequisites**: Latest Microsoft Edge browser

---

## Visual Test Cases

### TC-LD015: Modal Visual Validation - Desktop
**Priority**: Medium  
**Type**: Visual  
**Tag**: @Visual  

**Test Steps**:
1. Trigger Link Disclaimer on desktop viewport (1280px+)
2. Capture modal appearance
3. Validate against design specifications
4. Check responsive layout and spacing

**Expected Results**:
- Modal displays at 690px width as per DOM structure
- Proper spacing and padding maintained
- Shadow and border effects render correctly
- Typography matches design specifications

**Viewports**: XL (1440px), LG (1280px)

---

### TC-LD016: Modal Visual Validation - Mobile
**Priority**: Medium  
**Type**: Visual  
**Tag**: @Visual  

**Test Steps**:
1. Trigger Link Disclaimer on mobile viewport
2. Verify modal adapts to smaller screen
3. Check responsive width (335px as per DOM)
4. Validate touch interaction areas

**Expected Results**:
- Modal displays at 335px width on mobile
- Content remains readable and accessible
- Buttons have adequate touch targets
- No horizontal scrolling required

**Viewports**: SM (640px), MD (768px)

---

## Test Execution Strategy

### Test Priority Levels:
- **High Priority**: TC-LD001, TC-LD003, TC-LD004, TC-LD007, TC-LD008, TC-LD013, TC-LD014
- **Medium Priority**: TC-LD002, TC-LD006, TC-LD009, TC-LD011, TC-LD015, TC-LD016
- **Low Priority**: TC-LD005, TC-LD010, TC-LD012

### Test Dependencies:
1. **Prerequisites**: Cookie consent handling, location selector functionality
2. **Setup**: Base page authentication methods available
3. **Cleanup**: Modal closure after each test to prevent interference

### Known Limitations:
- Tests require active internet connection for external link validation
- Performance baselines may vary based on network conditions
- Cross-browser tests require multiple browser installations

---

## Test Case Summary
- **Total Test Cases**: 16
- **Functional Tests**: 6 (TC-LD001 to TC-LD006)
- **Accessibility Tests**: 4 (TC-LD007 to TC-LD010) 
- **Performance Tests**: 2 (TC-LD011 to TC-LD012)
- **Cross-Browser Tests**: 2 (TC-LD013 to TC-LD014)
- **Visual Tests**: 2 (TC-LD015 to TC-LD016)

## Requirements Coverage:
- ✅ **AC4**: Covered by TC-LD001, TC-LD002
- ✅ **AC5**: Covered by TC-LD003
- ✅ **AC6**: Covered by TC-LD004  
- ✅ **AC7**: Covered by TC-LD005
- ✅ **Accessibility**: Covered by TC-LD007 to TC-LD010
- ✅ **Performance**: Covered by TC-LD011, TC-LD012
- ✅ **Cross-Browser**: Covered by TC-LD013, TC-LD014
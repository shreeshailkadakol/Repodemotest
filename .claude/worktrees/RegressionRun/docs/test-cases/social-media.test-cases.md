# Social Media Component - Comprehensive Test Cases

**Component:** Social Media Links  
**Location:** Footer Section  
**Test Page:** https://bayer-beyond-qa-uk.vercel.app  
**Generated:** September 29, 2025  

## Test Requirements Summary

Based on DOM inspection and requirements:
- Social media icons should display in the footer ✅
- All links should be clickable and direct to external URLs ✅  
- All links should have hover text ✅

## Functional Test Cases

### TC-SM-F01: Social Media Container Presence Validation @Functional
**Objective:** Verify social media container exists in footer with proper structure  
**Priority:** High  
**Prerequisites:** Navigate to homepage, handle authentication

**Test Steps:**
1. Navigate to test page and authenticate  
2. Accept cookies banner
3. Scroll to footer section
4. Locate footer container
5. Verify social media container exists

**Expected Results:**
- Footer container is visible
- Social media container with `[data-qa="social-media-links"]` is present
- Container has proper responsive grid layout
- Container contains exactly 5 social media links

**Assertions:**
```typescript
await expect(this.footerContainer).toBeVisible();
await expect(this.socialMediaContainer).toBeVisible();  
await expect(this.socialMediaContainer).toHaveAttribute('data-qa', 'social-media-links');
await expect(this.socialMediaLinks).toHaveCount(5);
```

---

### TC-SM-F02: Social Media Links Clickability Validation @Functional  
**Objective:** Verify all social media links are clickable and functional  
**Priority:** High  
**Prerequisites:** Social media container is visible

**Test Steps:**
1. Verify all 5 social media links are visible
2. Check each link is enabled and clickable  
3. Validate href attributes contain proper external URLs
4. Verify links have proper target attributes

**Expected Results:**
- All 5 links (Facebook, Instagram, LinkedIn, X, YouTube) are visible
- All links are enabled and clickable
- Each link has valid external URL in href attribute  
- All links have target="_blank" for new tab opening

**Platform-Specific URLs:**
- Facebook: `https://www.facebook.com/`
- Instagram: `https://www.instagram.com/`  
- LinkedIn: `https://www.linkedin.com/`
- X (Twitter): `https://x.com/`
- YouTube: `https://www.youtube.com/`

**Assertions:**
```typescript
await expect(this.facebookLink).toBeVisible();
await expect(this.facebookLink).toBeEnabled();
await expect(this.facebookLink).toHaveAttribute('href', /facebook\.com/);
await expect(this.facebookLink).toHaveAttribute('target', '_blank');
// Repeat for all platforms
```

---

### TC-SM-F03: External Navigation Validation @Functional
**Objective:** Verify social media links navigate to correct external platforms  
**Priority:** High  
**Prerequisites:** All social media links are visible and clickable

**Test Steps:**
1. Get current page URL for navigation tracking
2. Click each social media link (in new context to avoid navigation)  
3. Verify new tab opens with correct destination URL
4. Validate external site loads successfully
5. Return to original page

**Expected Results:**
- Clicking each link opens new tab/window  
- New tab navigates to correct social media platform
- External sites load without errors
- Original page remains unchanged  
- No JavaScript errors occur

**Security Validation:**
- Links have `rel="noopener noreferrer"` attributes
- External navigation is secure

---

### TC-SM-F04: Hover Text Functionality Validation @Functional
**Objective:** Verify all social media links display proper hover text  
**Priority:** Medium  
**Prerequisites:** Social media links are visible

**Test Steps:**
1. Hover over each social media link
2. Verify hover text appears via title attribute
3. Check hover text content is meaningful  
4. Validate accessibility with screen readers

**Expected Results:**
- Each link has title attribute with descriptive text
- Hover text displays on mouse hover
- Text content matches platform name
- Accessibility attributes support screen readers

**Expected Hover Text:**
- Facebook: "Facebook1 alt text"
- Instagram: "Instagram"  
- LinkedIn: "Linkedin"
- X: "X"
- YouTube: "YouTube"

**Assertions:**
```typescript
await expect(this.facebookLink).toHaveAttribute('title', 'Facebook1 alt text');
await expect(this.instagramLink).toHaveAttribute('title', 'Instagram');
// Validate all platforms have title attributes
```

---

## Visual Test Cases

### TC-SM-V01: Social Media Icons Visual Validation @Visual
**Objective:** Verify social media icons display correctly with proper styling  
**Priority:** High  
**Prerequisites:** Social media container is visible

**Test Steps:**
1. Verify all 5 social media icons are visible
2. Check SVG icons load properly  
3. Validate icon dimensions and viewBox attributes
4. Verify responsive layout across viewports

**Expected Results:**
- All 5 SVG icons are visible and not broken
- Icons have proper viewBox="0 0 24 24" attributes  
- Icons display at 24x24 pixel dimensions
- Responsive grid layout works on different screen sizes

**Visual Validation:**
- Icons are crisp and not pixelated
- Proper spacing between icons (gap-6 lg:gap-10)
- Icons align properly within grid layout  

**Assertions:**
```typescript  
const facebookIcon = this.facebookLink.locator('svg');
await expect(facebookIcon).toBeVisible();
await expect(facebookIcon).toHaveAttribute('viewBox', '0 0 24 24');
await expect(facebookIcon).toHaveAttribute('width', '24');
await expect(facebookIcon).toHaveAttribute('height', '24');
```

---

### TC-SM-V02: Responsive Design Validation @Visual
**Objective:** Verify social media section displays correctly across different viewports  
**Priority:** Medium  
**Prerequisites:** Social media container is accessible

**Test Steps:**
1. Test on XL viewport (1920x1080)
2. Test on LG viewport (1024x768)  
3. Test on MD viewport (768x1024)
4. Test on SM viewport (375x667)
5. Verify grid layout adapts properly

**Expected Results:**
- Social media section visible on all viewport sizes
- Grid layout responds appropriately (grid-cols-1)  
- Spacing adjusts correctly (gap-6 lg:gap-10)
- Icons remain visible and clickable on mobile
- No horizontal scrolling required

**Responsive Breakpoints:**
- Desktop: Icons with larger spacing (lg:gap-10)
- Mobile: Icons with smaller spacing (gap-6)  
- All sizes: Single column layout (grid-cols-1)

---

### TC-SM-V03: Hover State Visual Validation @Visual  
**Objective:** Verify visual hover effects on social media links  
**Priority:** Medium  
**Prerequisites:** Social media links are visible

**Test Steps:**
1. Hover over each social media link
2. Verify visual feedback (cursor changes, styling)
3. Check hover text appears
4. Validate focus indicators for keyboard navigation

**Expected Results:**
- Cursor changes to pointer on hover
- Visual feedback indicates interactive element
- Hover text displays properly  
- Focus indicators visible for accessibility
- No layout shifts during hover state

---

## Accessibility Test Cases

### TC-SM-A01: WCAG Compliance Validation @Accessibility  
**Objective:** Verify social media links meet WCAG 2.1 AA accessibility standards  
**Priority:** High  
**Prerequisites:** Social media container is accessible

**Test Steps:**
1. Run axe-core accessibility audit on footer section
2. Verify keyboard navigation functionality  
3. Check screen reader compatibility
4. Validate color contrast ratios
5. Test focus management

**Expected Results:**  
- No critical accessibility violations
- All links accessible via keyboard navigation  
- Screen readers can identify and announce links
- Focus indicators meet visibility requirements
- Color contrast passes WCAG AA standards (4.5:1 minimum)

**WCAG Success Criteria:**
- 2.1.1 Keyboard (AA): All functionality available via keyboard
- 2.4.4 Link Purpose (AA): Purpose of links clear from context  
- 3.2.2 On Input (AA): No unexpected context changes
- 4.1.2 Name, Role, Value (AA): Proper semantic markup

**Accessibility Assertions:**
```typescript
const axeResults = await new AxeBuilder({ page }).analyze();
expect(axeResults.violations).toHaveLength(0);

await this.socialMediaLinks.first().focus();
await expect(this.socialMediaLinks.first()).toBeFocused();
```

---

### TC-SM-A02: Keyboard Navigation Validation @Accessibility
**Objective:** Verify social media links are fully accessible via keyboard  
**Priority:** High  
**Prerequisites:** Social media links are visible

**Test Steps:**
1. Navigate to footer using Tab key
2. Verify focus reaches social media links
3. Test Tab navigation through all 5 links  
4. Test Enter key activation on each link
5. Test Escape key behavior if applicable

**Expected Results:**
- Tab navigation reaches all social media links in logical order
- Focus indicators are clearly visible
- Enter key activates links (opens new tabs)
- Focus management works correctly  
- No keyboard traps exist

**Focus Order:** Facebook → Instagram → LinkedIn → X → YouTube

---

### TC-SM-A03: Screen Reader Compatibility @Accessibility  
**Objective:** Verify social media links work properly with screen readers  
**Priority:** High  
**Prerequisites:** Social media container is accessible

**Test Steps:**
1. Test with NVDA/JAWS screen reader simulation
2. Verify link announcements include platform names
3. Check title attributes are announced  
4. Validate semantic markup is proper
5. Test with reduced motion preferences

**Expected Results:**
- Screen readers announce "link" role for each element
- Platform names are clearly announced  
- Title attributes provide additional context
- Links are grouped appropriately in footer landmark
- External link behavior is announced

**Semantic Requirements:**
- Proper `<a>` tag usage
- Valid href attributes  
- Descriptive title attributes
- Proper landmark navigation (footer)

---

## Performance Test Cases

### TC-SM-P01: Loading Performance Validation @Performance  
**Objective:** Verify social media section loads efficiently without impacting page performance  
**Priority:** Medium  
**Prerequisites:** Test page is accessible

**Test Steps:**
1. Measure page load time with social media section
2. Monitor network requests for social media assets  
3. Check SVG icon loading performance
4. Validate no external resource blocking
5. Test with slow network conditions

**Expected Results:**
- Social media section loads within acceptable time (< 2 seconds)
- SVG icons don't block page rendering  
- No unnecessary external requests to social media platforms  
- Section is visible during page load (no layout shift)
- Performance metrics remain within thresholds

**Performance Metrics:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s  
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

---

### TC-SM-P02: External Link Performance @Performance
**Objective:** Verify clicking social media links doesn't impact current page performance  
**Priority:** Low  
**Prerequisites:** Social media links are functional

**Test Steps:**
1. Monitor current page performance before link clicks
2. Click social media links (new tabs)
3. Verify original page performance remains stable  
4. Check for memory leaks or resource issues
5. Test multiple rapid clicks

**Expected Results:**
- Original page performance unaffected by external navigation
- No memory leaks from opened social media tabs
- Current page remains responsive  
- No JavaScript errors in console
- Reasonable resource usage maintained

---

## Test Execution Prerequisites

### Environment Setup
- **Authentication:** Vercel password "beyond2025"  
- **Cookies:** Accept cookies banner via BasePage method
- **Viewport:** Test across multiple viewport sizes
- **Browser:** Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Test Data Requirements  
- No specific test data required
- External URLs are production social media platforms
- Hover text content is static  

### Dependencies
- BasePage authentication methods  
- Social media platforms must be accessible (external dependency)
- SVG icon assets must be available

---

## Test Case Summary

| Category | Test Cases | Priority High | Priority Medium | Priority Low |
|----------|------------|---------------|-----------------|--------------|
| **Functional** | 4 | 3 | 1 | 0 |
| **Visual** | 3 | 1 | 2 | 0 |  
| **Accessibility** | 3 | 3 | 0 | 0 |
| **Performance** | 2 | 0 | 1 | 1 |
| **Total** | **12** | **7** | **4** | **1** |

---

**Test Cases Status:** ✅ Ready for Review  
**DOM-First Approach:** ✅ Implemented  
**Language-Agnostic:** ✅ Structure-based assertions  
**Parent-Child Locators:** ✅ Implemented as requested
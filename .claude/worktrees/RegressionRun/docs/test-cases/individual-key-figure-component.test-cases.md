# Individual Key Figure Component - Test Cases

## Component Overview
**Component:** Individual Key Figure  
**User Story:** 2057  
**Status:** Ready for UAT  
**Test Page URL:** https://bayer-beyond-qa-uk.vercel.app/Develop/Test-Catalyst-Page/Content-Catalyst-Page/QADontDelete/QAAutomation/Sprint10/IndividualKeyFigure  
**Figma Design:** https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-–-Dev-Handover?node-id=6227-65564&m=dev  

## Content Model Structure
Based on requirements from User Story 2057:
- **Number:** Plain Text (e.g., "100Mio")
- **Unit:** Plain Text (e.g., "people")  
- **Fact Text:** Plain Text (e.g., "supported with self-care by 2030")
- **Combined Display:** "100Mio.people supported with self-care by 2030"

## Test Case Coverage Matrix

| Category | Test Count | Tags | Priority |
|----------|------------|------|----------|
| Functional | 5 | @Functional, @UKProd | High |
| Accessibility | 4 | @Accessibility | High |
| Performance | 2 | @Performance | Medium |
| Visual | 4 | @Visual | High |
| Cross-Browser | 2 | @CrossBrowser | Medium |
| **Total** | **17** | | |

---

## 🔧 FUNCTIONAL TEST CASES

### TC-IKF001: Component Visibility and Structure Validation
**Priority:** High  
**Tags:** @Functional, @UKProd  
**Requirements:** AC5 (Component placement in content divider 100%)

**Test Steps:**
1. Navigate to Individual Key Figure test page
2. Handle authentication and cookies
3. Wait for page to load completely
4. Verify component container is visible
5. Validate component positioning within content divider

**Expected Results:**
- Component `[data-qa="individual-key-figure"]` is visible
- Component is contained within `[data-qa="fullwidth-column"]`
- Component maintains proper structure and positioning
- No layout shifts or loading issues

**Locators:**
```typescript
private readonly individualKeyFigureContainer: Locator = this.page.locator('[data-qa="individual-key-figure"]');
private readonly fullWidthContainer: Locator = this.page.locator('[data-qa="fullwidth-column"]');
```

---

### TC-IKF002: Content Model Validation
**Priority:** High  
**Tags:** @Functional, @UKProd  
**Requirements:** AC2, AC3, AC4 (Number, Unit, Fact Text validation)

**Test Steps:**
1. Navigate to component page
2. Verify component contains content
3. Validate text content is not empty (language-agnostic)
4. Verify content structure matches expected pattern
5. Validate semantic HTML structure

**Expected Results:**
- Component contains visible text content
- Content follows pattern: Number + Unit + Fact Text
- Text content is accessible and readable
- Proper semantic HTML structure (section element)

**Content Validation:**
- Verify presence of content (not empty check)
- Validate component has meaningful text
- No specific text matching (language-agnostic approach)

---

### TC-IKF003: Responsive Layout Validation - All Viewports
**Priority:** High  
**Tags:** @Functional, @UKProd  
**Requirements:** AC5 (Content divider 100% placement)

**Test Steps:**
1. Navigate to component page
2. Test across all viewport sizes:
   - XL (1440px): Desktop large
   - LG (1024px): Desktop standard  
   - MD (768px): Tablet
   - SM (375px): Mobile
3. Verify component visibility at each size
4. Validate layout integrity
5. Check responsive behavior

**Expected Results:**
- Component visible and functional across all viewports
- Layout maintains integrity at different screen sizes
- No horizontal scrolling on mobile devices
- Component scales appropriately

**Viewport Testing:**
```typescript
// XL Viewport: 1440x900
await page.setViewportSize({ width: 1440, height: 900 });

// LG Viewport: 1024x768  
await page.setViewportSize({ width: 1024, height: 768 });

// MD Viewport: 768x1024
await page.setViewportSize({ width: 768, height: 1024 });

// SM Viewport: 375x667
await page.setViewportSize({ width: 375, height: 667 });
```

### TC-IKF005: Language-Agnostic Content Validation
**Priority:** High  
**Tags:** @Functional, @UKProd  
**Requirements:** Multi-language support

**Test Steps:**
1. Navigate to component page
2. Verify component structure without content dependency
3. Validate data attributes are present
4. Check semantic HTML compliance
5. Verify accessibility attributes

**Expected Results:**
- Component structure validated without text content dependency
- All required data-qa attributes present
- Semantic HTML structure maintained
- Accessibility attributes properly implemented

**Language-Agnostic Assertions:**
```typescript
// Structure validation only - no text content dependency
await expect(this.individualKeyFigureContainer).toBeVisible();
await expect(this.individualKeyFigureContainer).toHaveAttribute('data-qa', 'individual-key-figure');
await expect(this.individualKeyFigureContainer).not.toBeEmpty();
```

---

## ♿ ACCESSIBILITY TEST CASES

### TC-IKF006: WCAG 2.1 AA Compliance Validation
**Priority:** High  
**Tags:** @Accessibility  
**Requirements:** WCAG 2.1 AA standards

**Test Steps:**
1. Navigate to component page
2. Run axe-core accessibility scan
3. Check for critical and serious violations
4. Verify no accessibility issues found
5. Generate accessibility report

**Expected Results:**
- Zero critical accessibility violations
- Zero serious accessibility violations  
- All accessibility best practices followed
- Component passes automated accessibility checks

**Accessibility Scan:**
```typescript
const axeResults = await new AxeBuilder({ page }).analyze();
const criticalViolations = axeResults.violations.filter(v => v.impact === 'critical');
const seriousViolations = axeResults.violations.filter(v => v.impact === 'serious');
```

---

### TC-IKF007: Screen Reader Compatibility
**Priority:** High  
**Tags:** @Accessibility  
**Requirements:** Screen reader support

**Test Steps:**
1. Verify aria-label attributes
2. Check semantic HTML structure
3. Validate screen reader announcements
4. Test content accessibility
5. Verify proper element roles

**Expected Results:**
- aria-label "Individual Key Figure" present
- Semantic section element used
- Content accessible to screen readers
- Proper element hierarchy maintained
- No missing accessibility attributes

**Accessibility Attributes:**
```typescript
await expect(this.individualKeyFigureContainer).toHaveAttribute('aria-label', 'Individual Key Figure');
```

---

### TC-IKF008: Keyboard Navigation Support  
**Priority:** Medium  
**Tags:** @Accessibility  
**Requirements:** Keyboard accessibility

**Test Steps:**
1. Navigate using only keyboard
2. Test Tab navigation through component
3. Verify focus management
4. Check focus indicators
5. Test Escape key handling if applicable

**Expected Results:**
- Component properly handles keyboard navigation
- Focus indicators visible when applicable
- Tab order logical and intuitive
- No keyboard traps
- All interactive elements accessible via keyboard

---

### TC-IKF009: Color Contrast Validation
**Priority:** Medium  
**Tags:** @Accessibility  
**Requirements:** WCAG color contrast ratios

**Test Steps:**
1. Measure color contrast ratios
2. Check text against background
3. Verify minimum contrast requirements
4. Test different component states
5. Generate contrast report

**Expected Results:**
- Text color contrast ratio ≥ 4.5:1 (normal text)
- Large text contrast ratio ≥ 3:1 (if applicable)
- No color contrast violations
- All text meets WCAG AA standards

---

## ⚡ PERFORMANCE TEST CASES

### TC-IKF010: Component Load Performance
**Priority:** Medium  
**Tags:** @Performance  
**Requirements:** Performance benchmarks

**Test Steps:**
1. Measure component load time
2. Track rendering performance
3. Monitor network requests
4. Measure time to interactive
5. Generate performance report

**Expected Results:**
- Component loads within 2 seconds
- No performance bottlenecks
- Minimal network requests
- Fast time to interactive
- Acceptable performance metrics

**Performance Measurement:**
```typescript
const startTime = performance.now();
await expect(this.individualKeyFigureContainer).toBeVisible();
const loadTime = performance.now() - startTime;
expect(loadTime).toBeLessThan(2000); // 2 seconds max
```

---


## 🎨 VISUAL TEST CASES

### TC-IKF012: Figma Design Compliance - XL/LG Viewports
**Priority:** High  
**Tags:** @Visual  
**Requirements:** Figma node-id=6227-65565

**Test Steps:**
1. Set viewport to XL (1440x900) and LG (1024x768)
2. Verify typography compliance:
   - Font family from Figma specifications
   - Font size accuracy
   - Font weight compliance  
   - Line height validation
3. Validate color compliance:
   - Text color matches Figma
   - Background color compliance
4. Check spacing and layout
5. Take visual screenshots for comparison

**Expected Results:**
- Typography matches Figma specifications exactly
- Colors comply with design system
- Spacing and layout accurate
- Visual consistency across XL and LG viewports

**Figma Specifications (XL/LG):**
```typescript
// Font specifications from Figma
const expectedTypography = {
  fontFamily: 'Bayer Sans', // From Figma
  fontSize: '24px', // Large viewport size
  fontWeight: '700', // Bold weight
  lineHeight: '30px', // From design specs
  color: 'rgba(16, 56, 79, 1)' // Design system color
};
```

---

### TC-IKF013: Figma Design Compliance - MD/SM Viewports  
**Priority:** High  
**Tags:** @Visual  
**Requirements:** Figma node-id=6227-65560

**Test Steps:**
1. Set viewport to MD (768px) and SM (375px)
2. Verify responsive typography:
   - Font family consistency
   - Responsive font sizes
   - Line height adjustments
   - Font weight maintenance
3. Validate responsive colors
4. Check mobile layout compliance
5. Verify responsive spacing

**Expected Results:**
- Typography adapts appropriately for smaller screens
- Colors remain consistent
- Layout optimized for mobile devices
- Responsive design matches Figma mobile specs

**Mobile Typography Specs:**
```typescript
// Mobile font specifications from Figma
const expectedMobileTypography = {
  fontFamily: 'Bayer Sans', // Consistent
  fontSize: '18px', // Smaller for mobile
  fontWeight: '700', // Maintained
  lineHeight: '28px', // Adjusted for mobile
  color: 'rgba(16, 56, 79, 1)' // Consistent
};
```
### TC-IKF015: Typography and Color Validation
**Priority:** High  
**Tags:** @Visual  
**Requirements:** Design system compliance

**Test Steps:**
1. Extract computed styles from DOM
2. Compare font family with Figma specs
3. Validate font size across viewports
4. Check line height compliance
5. Verify color accuracy
6. Test font weight consistency

**Expected Results:**
- All typography properties match Figma exactly
- Colors comply with design system specifications  
- Consistent styling across viewports
- No styling regressions

**Style Validation:**
```typescript
const computedStyles = await this.individualKeyFigureContainer.evaluate(el => {
  const styles = getComputedStyle(el);
  return {
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
    lineHeight: styles.lineHeight,
    color: styles.color
  };
});
```

---

## Test Execution Strategy

### Test Priorities
1. **High Priority:** Functional and Visual tests (TC-IKF001-005, TC-IKF012-015)
2. **Medium Priority:** Accessibility and Performance tests (TC-IKF006-011)
3. **Low Priority:** Cross-browser tests (TC-IKF016-017)

### Test Tags Usage
```bash
# Run all functional tests
npx playwright test --grep "@Functional"

# Run UK Production specific tests  
npx playwright test --grep "@UKProd"

# Run accessibility tests
npx playwright test --grep "@Accessibility"

# Run visual tests only
npx playwright test --grep "@Visual"

# Run performance tests
npx playwright test --grep "@Performance"

# Run cross-browser tests
npx playwright test --grep "@CrossBrowser"
```

### Viewport Testing Matrix
| Viewport | Width | Height | Device Type | Priority |
|----------|-------|--------|-------------|----------|
| XL | 1440px | 900px | Desktop Large | High |
| LG | 1024px | 768px | Desktop Standard | High |  
| MD | 768px | 1024px | Tablet | Medium |
| SM | 375px | 667px | Mobile | High |

---

## Review Checklist

Before implementation, verify:
- [ ] All acceptance criteria covered (AC1-AC5)
- [ ] DOM inspection findings incorporated
- [ ] Language-agnostic approach maintained
- [ ] Soft assertions used throughout
- [ ] Proper test case IDs (TC-IKF001-017)
- [ ] Required tags present (@Functional, @Accessibility, @Performance, @Visual, @CrossBrowser, @UKProd)
- [ ] Figma specifications referenced
- [ ] Performance benchmarks defined
- [ ] Accessibility standards addressed
- [ ] Cross-browser compatibility planned

---

**Total Test Cases:** 17  
**Coverage:** Functional (5), Accessibility (4), Performance (2), Visual (4), Cross-Browser (2)  
**Ready for Implementation:** ✅  
**Next Step:** Generate test automation scripts
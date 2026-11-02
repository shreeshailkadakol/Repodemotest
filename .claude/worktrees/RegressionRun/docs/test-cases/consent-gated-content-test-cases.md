# Test Cases - Consent Gated Content Component

**Component**: Consent Gated Content Component  
**User Story**: 3556 - Consent Gated Content Component  
**Test Page**: https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint-14/consentcomponent  
**Status**: Ready for Implementation  
**Last Updated**: 2026-04-07

---

## Test Configuration

**Test Environment**: QA  
**Current Configuration**: 2 consent conditions/checkboxes  
**Viewport Sizes**:
- XL: 1440px × 900px
- LG: 1024px × 800px  
- MD: 768px × 1024px
- SM: 375px × 667px

**Figma Design Reference**: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=19206-61050

---

## Test Case Summary

| Category | Test Count | Tags |
|----------|-----------|------|
| Functional Tests | 18 | @Functional |
| Accessibility Tests | 12 | @Accessibility |
| Visual Tests | 16 | @Visual |
| Performance Tests | 4 | @Performance |
| **Total** | **50** | |

---

## 1. Functional Tests (@Functional)

### TC-CG01: Verify Component Renders and is Visible  
**Priority**: Critical  
**Acceptance Criteria**: AC2  
**Prerequisites**: Navigate to test page  

**Test Steps**:
1. Navigate to consent component test page
2. Accept cookie banner if present
3. Scroll to consent-gated-content component

**Expected Results**:
- Component container `[data-qa="consent-gated-content"]` is visible
- Component is located in 50% section of 25-50-25 layout
- Component has proper aria-label attribute

**Soft Assertions**:
```typescript
await expect.soft(componentContainer).toBeVisible();
await expect.soft(componentContainer).toHaveAttribute('data-qa', 'consent-gated-content');
await expect.soft(componentContainer).toHaveAttribute('aria-label');
```

---

### TC-CG02: Verify Correct Number of Checkboxes Display (Current: 2)  
**Priority**: Critical  
**Acceptance Criteria**: AC5  
**Prerequisites**: Component is visible  

**Test Steps**:
1. Locate consent conditions list `[data-qa="consent-conditions-list"]`
2. Count checkbox elements with selector `[data-qa^="consent-condition-checkbox-"]`
3. Verify each checkbox has indexed data-qa attribute

**Expected Results**:
- Exactly 2 checkboxes display (matching current configuration)
- Checkbox 0 has `data-qa="consent-condition-checkbox-0"`
- Checkbox 1 has `data-qa="consent-condition-checkbox-1"`
- No additional empty checkboxes present
- Each checkbox has associated label, read more button, and expand text

**Soft Assertions**:
```typescript
await expect.soft(checkboxes).toHaveCount(2);
await expect.soft(checkbox0).toHaveAttribute('data-qa', 'consent-condition-checkbox-0');
await expect.soft(checkbox1).toHaveAttribute('data-qa', 'consent-condition-checkbox-1');
```

---

### TC-CG03: Verify Default State - All Checkboxes Unchecked  
**Priority**: Critical  
**Acceptance Criteria**: AC2  
**Prerequisites**: Component is visible  

**Test Steps**:
1. Get all checkboxes
2. Check the checked state of each checkbox
3. Verify none are checked by default

**Expected Results**:
- All checkboxes are unchecked (checked === false)
- Each checkbox is interactive (not disabled)
- Visual unchecked state is displayed

**Soft Assertions**:
```typescript
for (let i = 0; i < checkboxCount; i++) {
  const checkbox = getCheckbox(i);
  await expect.soft(checkbox).not.toBeChecked();
  await expect.soft(checkbox).toBeEnabled();
}
```

---

### TC-CG04: Verify Unconsented Content Visible by Default  
**Priority**: Critical  
**Acceptance Criteria**: AC2  
**Prerequisites**: Component visible, no checkboxes selected  

**Test Steps**:
1. Locate unconsented state element `[data-qa="consent-gated-unconsented-state"]`
2. Verify visibility
3. Verify content is present (not empty)

**Expected Results**:
- Unconsented state element is visible
- Element has meaningful content (not just whitespace)
- Element has correct data-qa and data-testid attributes

**Soft Assertions**:
```typescript
await expect.soft(unconsentedState).toBeVisible();
await expect.soft(unconsentedState).toHaveAttribute('data-qa', 'consent-gated-unconsented-state');
await expect.soft(unconsentedState).not.toBeEmpty();
```

---

### TC-CG05: Verify Consented Content Hidden by Default  
**Priority**: Critical  
**Acceptance Criteria**: AC2  
**Prerequisites**: Component visible, no checkboxes selected  

**Test Steps**:
1. Locate consented state element `[data-qa="consent-gated-consented-state"]`
2. Check if element exists in DOM
3. If exists, verify it's hidden

**Expected Results**:
- Consented state element either doesn't exist in DOM or is hidden
- Element is not visible to user
- No consented content displays in default state

**Soft Assertions**:
```typescript
const consentedCount = await consentedState.count();
if (consentedCount > 0) {
  await expect.soft(consentedState).not.toBeVisible();
}
```

---

### TC-CG06: Verify Single Checkbox Selection  
**Priority**: High  
**Acceptance Criteria**: AC2, AC3  
**Prerequisites**: All checkboxes unchecked  

**Test Steps**:
1. Click first checkbox `[data-qa="consent-condition-checkbox-0"]`
2. Verify checkbox shows checked state
3. Verify content state remains unconsented (not all boxes checked)

**Expected Results**:
- First checkbox becomes checked
- Unconsented content remains visible
- Consented content remains hidden
- Other checkboxes remain unchecked

**Soft Assertions**:
```typescript
await checkbox0.check();
await expect.soft(checkbox0).toBeChecked();
await expect.soft(unconsentedState).toBeVisible();
await expect.soft(checkbox1).not.toBeChecked();
```

---

### TC-CG07: Verify All Checkboxes Selection Reveals Consented Content (AC3)  
**Priority**: Critical  
**Acceptance Criteria**: AC3  
**Prerequisites**: All checkboxes initially unchecked  

**Test Steps**:
1. Check all checkboxes sequentially (checkbox 0, then checkbox 1)
2. Wait for state transition
3. Verify unconsented content becomes hidden
4. Verify consented content becomes visible

**Expected Results**:
- All checkboxes show checked state
- Unconsented state `consent-gated-unconsented-state` is hidden
- Consented state `consent-gated-consented-state` becomes visible
- State transition happens without page reload
- Visual feedback of content switching

**Soft Assertions**:
```typescript
await checkAllCheckboxes();
await expect.soft(checkbox0).toBeChecked();
await expect.soft(checkbox1).toBeChecked();
await expect.soft(unconsentedState).not.toBeVisible();
await expect.soft(consentedState).toBeVisible();
await expect.soft(consentedState).toHaveAttribute('data-qa', 'consent-gated-consented-state');
```

---

### TC-CG08: Verify Deselecting Any Checkbox Reverts to Unconsented (AC4)  
**Priority**: Critical  
**Acceptance Criteria**: AC4  
**Prerequisites**: All checkboxes are checked, consented content visible  

**Test Steps**:
1. Ensure all checkboxes are checked (consented state visible)
2. Uncheck first checkbox `consent-condition-checkbox-0`
3. Verify state reverts to unconsented
4. Re-check first checkbox
5. Uncheck second checkbox `consent-condition-checkbox-1`
6. Verify state reverts again

**Expected Results**:
- Unchecking ANY checkbox triggers reversion
- Consented content becomes hidden
- Unconsented content becomes visible again
- Behavior is consistent regardless of which checkbox is unchecked
- State toggles bidirectionally

**Soft Assertions**:
```typescript
// Uncheck first, verify reversion
await checkbox0.uncheck();
await expect.soft(unconsentedState).toBeVisible();
await expect.soft(consentedState).not.toBeVisible();

// Re-check first, uncheck second, verify reversion
await checkbox0.check();
await checkbox1.uncheck();
await expect.soft(unconsentedState).toBeVisible();
await expect.soft(consentedState).not.toBeVisible();
```

---

### TC-CG09: Verify Checkbox Label Association  
**Priority**: High  
**Acceptance Criteria**: AC5  
**Prerequisites**: Component visible  

**Test Steps**:
1. For each checkbox, get associated label element
2. Verify label has `data-qa="consent-condition-label-{index}"`
3. Verify label has meaningful text content
4. Click label and verify checkbox toggles

**Expected Results**:
- Each checkbox has properly associated label
- Label has indexed data-qa attribute
- Label contains Rich Text content (not empty)
- Clicking label toggles checkbox state

**Soft Assertions**:
```typescript
for (let i = 0; i < checkboxCount; i++) {
  const label = getLabel(i);
  await expect.soft(label).toHaveAttribute('data-qa', `consent-condition-label-${i}`);
  await expect.soft(label).not.toBeEmpty();
  
  // Click label, verify checkbox toggles
  await label.click();
  await expect.soft(getCheckbox(i)).toBeChecked();
}
```

---

### TC-CG10: Verify Read More Button Functionality  
**Priority**: High  
**Acceptance Criteria**: AC5  
**Prerequisites**: Component visible  

**Test Steps**:
1. Locate Read More button `[data-qa="consent-condition-read-more-0"]`
2. Verify button is visible and enabled
3. Click Read More button
4. Verify expanded text becomes visible

**Expected Results**:
- Read More button has correct data-qa attribute
- Button is clickable and enabled
- Clicking reveals expanded text `consent-condition-expand-text-0`
- Button text or icon indicates expanded state
- Expanded content is accessible

**Soft Assertions**:
```typescript
const readMoreBtn = getReadMoreButton(0);
await expect.soft(readMoreBtn).toBeVisible();
await expect.soft(readMoreBtn).toBeEnabled();

await readMoreBtn.click();
const expandText = getExpandText(0);
await expect.soft(expandText).toBeVisible();
```

---

### TC-CG11: Verify Read More Collapse Functionality  
**Priority**: Medium  
**Acceptance Criteria**: AC5  
**Prerequisites**: Read More expanded  

**Test Steps**:
1. Expand Read More for condition 0
2. Click Read More button again
3. Verify expanded text becomes hidden

**Expected Results**:
- Clicking Read More again collapses expanded content
- Expanded text element becomes hidden
- Button returns to collapsed state indicator
- Smooth collapse animation

**Soft Assertions**:
```typescript
await readMoreBtn.click(); // Expand
await expect.soft(expandText).toBeVisible();

await readMoreBtn.click(); // Collapse
await expect.soft(expandText).not.toBeVisible();
```

---

### TC-CG12: Verify Multiple Read More Can Be Expanded Simultaneously  
**Priority**: Medium  
**Acceptance Criteria**: AC5  
**Prerequisites**: Multiple conditions present (current: 2)  

**Test Steps**:
1. Expand Read More for condition 0
2. Expand Read More for condition 1  
3. Verify both expanded texts are visible

**Expected Results**:
- Multiple accordion sections can be open at same time
- Expanding one doesn't collapse others
- Both `consent-condition-expand-text-0` and `consent-condition-expand-text-1` visible
- Independent toggle behavior

**Soft Assertions**:
```typescript
await readMore0.click();
await readMore1.click();

await expect.soft(expandText0).toBeVisible();
await expect.soft(expandText1).toBeVisible();
```

---

### TC-CG13: Verify Expand Text Content is Not Empty  
**Priority**: Medium  
**Acceptance Criteria**: AC5  
**Prerequisites**: Component visible  

**Test Steps**:
1. For each condition, expand Read More
2. Verify expanded text element has content
3. Verify content is Rich Text (may contain HTML formatting)

**Expected Results**:
- Each expanded text area contains meaningful content
- Content is not just whitespace
- Rich Text formatting preserved
- Element has indexed data-qa attribute

**Soft Assertions**:
```typescript
for (let i = 0; i < checkboxCount; i++) {
  await getReadMoreButton(i).click();
  const expandText = getExpandText(i);
  await expect.soft(expandText).not.toBeEmpty();
  await expect.soft(expandText).toHaveAttribute('data-qa', `consent-condition-expand-text-${i}`);
}
```

---

### TC-CG14: Verify Checkbox State Persistence During Session  
**Priority**: Medium  
**Acceptance Criteria**: AC3, AC4  
**Prerequisites**: Component visible  

**Test Steps**:
1. Check all checkboxes
2. Scroll away from component
3. Scroll back to component
4. Verify checkboxes remain checked

**Expected Results**:
- Checkbox states persist when scrolling
- Consented content remains visible
- No unexpected state reset
- Session maintains user selections

**Soft Assertions**:
```typescript
await checkAllCheckboxes();
await page.evaluate(() => window.scrollTo(0, 0));
await componentContainer.scrollIntoViewIfNeeded();

await expect.soft(checkbox0).toBeChecked();
await expect.soft(checkbox1).toBeChecked();
await expect.soft(consentedState).toBeVisible();
```

---

### TC-CG15: Verify Divider Line Below Headline (AC6)  
**Priority**: Medium  
**Acceptance Criteria**: AC6  
**Prerequisites**: Headline configured in component  

**Test Steps**:
1. Locate headline element within component
2. Look for divider/separator element (hr, or styled div)
3. Verify divider appears below headline

**Expected Results**:
- Divider element exists (e.g., `<hr>` tag)
- Divider positioned below headline
- Visual separation is clear
- Divider spans appropriate width

**Soft Assertions**:
```typescript
const headline = componentContainer.locator('h1, h2, h3, h4, h5, h6').first();
const divider = page.locator('hr').first();

await expect.soft(headline).toBeVisible();
await expect.soft(divider).toBeVisible();
// Verify divider is below headline in DOM order
```

**Note**: Currently no headline in test environment, may be added later

---

### TC-CG16: Verify Conditions List Semantic Structure  
**Priority**: Low  
**Acceptance Criteria**: AC5  
**Prerequisites**: Component visible  

**Test Steps**:
1. Verify conditions container is `<ul>` element
2. Verify each condition is wrapped in proper list item
3. Verify semantic HTML structure

**Expected Results**:
- Conditions list uses `<ul>` tag
- Proper semantic HTML hierarchy
- List has `data-qa="consent-conditions-list"` attribute

**Soft Assertions**:
```typescript
const conditionsList = page.locator('[data-qa="consent-conditions-list"]');
const tagName = await conditionsList.evaluate(el => el.tagName);
expect.soft(tagName).toBe('UL');
```

---

### TC-CG17: Verify Unconsented Content Has Meaningful Placeholder  
**Priority**: Low  
**Acceptance Criteria**: AC2  
**Prerequisites**: No checkboxes checked  

**Test Steps**:
1. Verify unconsented state is visible
2. Get text content from unconsented state
3. Verify it contains meaningful message/placeholder

**Expected Results**:
- Unconsented content displays user-facing message
- Content guides user to select checkboxes
- Text is not empty or technical placeholder
- Language-appropriate content

**Soft Assertions**:
```typescript
const unconsentedText = await unconsentedState.textContent();
expect.soft(unconsentedText).toBeTruthy();
expect.soft(unconsentedText.length).toBeGreaterThan(0);
```

---

### TC-CG18: Verify Consented Content Different from Unconsented  
**Priority**: Medium  
**Acceptance Criteria**: AC3  
**Prerequisites**: Can toggle between states  

**Test Steps**:
1. Get unconsented content text
2. Check all checkboxes to reveal consented content
3. Get consented content text
4. Verify contents are different

**Expected Results**:
- Consented and unconsented content are distinct
- Content actually changes when state transitions
- Not just visibility toggle of same content
- Meaningful content difference

**Soft Assertions**:
```typescript
const unconsentedText = await unconsentedState.textContent();
await checkAllCheckboxes();
const consentedText = await consentedState.textContent();

expect.soft(unconsentedText).not.toBe(consentedText);
expect.soft(consentedText).toBeTruthy();
```

---

## 2. Accessibility Tests (@Accessibility)

### TC-ACG01: Verify Keyboard Navigation Through All Checkboxes  
**Priority**: Critical  
**Acceptance Criteria**: WCAG 2.1 AA  
**Prerequisites**: Component visible  

**Test Steps**:
1. Focus on first element before component
2. Press Tab to navigate to first checkbox
3. Press Tab to navigate through all checkboxes and Read More buttons
4. Verify focus order is logical (top to bottom)

**Expected Results**:
- All checkboxes are keyboard accessible
- Tab key moves focus through all interactive elements
- Focus order follows visual order
- No keyboard traps
- All elements receive visible focus indicator

**Soft Assertions**:
```typescript
await page.keyboard.press('Tab');
await expect.soft(checkbox0).toBeFocused();

await page.keyboard.press('Tab');
// Verify focus moves to next interactive element
```

---

### TC-ACG02: Verify Space Key Toggles Checkbox  
**Priority**: Critical  
**Acceptance Criteria**: WCAG 2.1 AA  
**Prerequisites**: Checkbox focused  

**Test Steps**:
1. Focus on checkbox 0 using Tab
2. Press Space key
3. Verify checkbox becomes checked
4. Press Space again
5. Verify checkbox becomes unchecked

**Expected Results**:
- Space key toggles checkbox state
- Checked/unchecked state changes visually
- State change is announced to screen readers
- Behavior consistent with native checkbox

**Soft Assertions**:
```typescript
await checkbox0.focus();
await page.keyboard.press('Space');
await expect.soft(checkbox0).toBeChecked();

await page.keyboard.press('Space');
await expect.soft(checkbox0).not.toBeChecked();
```

---

### TC-ACG03: Verify Enter Key Activates Read More Button  
**Priority**: High  
**Acceptance Criteria**: WCAG 2.1 AA  
**Prerequisites**: Read More button focused  

**Test Steps**:
1. Navigate to Read More button using Tab
2. Press Enter key
3. Verify expanded text becomes visible

**Expected Results**:
- Enter key activates Read More button
- Expanded content becomes visible
- Focus management handles expansion
- Keyboard users can access expanded content

**Soft Assertions**:
```typescript
await readMoreBtn.focus();
await page.keyboard.press('Enter');
await expect.soft(expandText).toBeVisible();
```

---

### TC-ACG04: Verify Checkbox Labels Have Proper Association  
**Priority**: Critical  
**Acceptance Criteria**: WCAG 2.1 AA  
**Prerequisites**: Component visible  

**Test Steps**:
1. For each checkbox, verify `id` attribute exists
2. Verify associated label has matching `for` attribute
3. Click label and verify checkbox toggles

**Expected Results**:
- Each checkbox has unique `id` (e.g., `consent-condition-0`)
- Label has `for` attribute matching checkbox id
- Clicking label toggles checkbox (proper association)
- Screen readers announce label when checkbox focused

**Soft Assertions**:
```typescript
const checkboxId = await checkbox0.getAttribute('id');
expect.soft(checkboxId).toBe('consent-condition-0');

const labelFor = await label0.getAttribute('for');
expect.soft(labelFor).toBe(checkboxId);
```

---

### TC-ACG05: Verify ARIA Labels on All Interactive Elements  
**Priority**: High  
**Acceptance Criteria**: WCAG 2.1 AA  
**Prerequisites**: Component visible  

**Test Steps**:
1. Check component container for `aria-label`
2. Check consent conditions list for `aria-label`
3. Verify Read More buttons have accessible names
4. Verify state containers have `aria-label`

**Expected Results**:
- Component has `aria-label="Consent gated content"`
- Conditions list has `aria-label="Consent conditions"`
- All interactive elements have accessible names
- Screen readers can identify all elements

**Soft Assertions**:
```typescript
await expect.soft(componentContainer).toHaveAttribute('aria-label', 'Consent gated content');
await expect.soft(conditionsList).toHaveAttribute('aria-label', 'Consent conditions');
```

---

### TC-ACG06: Verify Focus Indicators Visible on All Elements  
**Priority**: Critical  
**Acceptance Criteria**: WCAG 2.1 AA  
**Prerequisites**: Component visible  

**Test Steps**:
1. Tab through all interactive elements
2. For each element, verify visible focus indicator
3. Check focus outline color contrast meets WCAG AA

**Expected Results**:
- Focus indicator visible on checkboxes
- Focus indicator visible on Read More buttons
- Focus ring has sufficient color contrast (3:1 minimum)
- Focus indicator not obscured by other elements

**Soft Assertions**:
```typescript
await checkbox0.focus();
const outlineColor = await checkbox0.evaluate(el => getComputedStyle(el).outlineColor);
expect.soft(outlineColor).toBeTruthy();
// Additional contrast ratio verification
```

---

### TC-ACG07: Verify Screen Reader Announces Checkbox State Changes  
**Priority**: High  
**Acceptance Criteria**: WCAG 2.1 AA  
**Prerequisites**: Component visible  

**Test Steps**:
1. Enable screen reader simulation/monitoring
2. Check checkbox
3. Verify state change announcement
4. Uncheck checkbox
5. Verify state change announcement

**Expected Results**:
- Checking checkbox announces "checked" state
- Unchecking announces "not checked" state
- Checkbox label is announced
- State changes communicated to assistive tech

**Soft Assertions**:
```typescript
// Note: This requires screen reader API or axe-core validation
await expect.soft(checkbox0).toHaveAttribute('aria-checked', 'false');
await checkbox0.check();
await expect.soft(checkbox0).toHaveAttribute('aria-checked', 'true');
```

---

### TC-ACG08: Verify Expanded Content Accessibility  
**Priority**: Medium  
**Acceptance Criteria**: WCAG 2.1 AA  
**Prerequisites**: Read More can be expanded  

**Test Steps**:
1. Expand Read More content
2. Verify expanded content has proper ARIA expanded state
3. Verify keyboard users can access expanded content
4. Verify screen readers announce expansion

**Expected Results**:
- Read More button has `aria-expanded="false"` when collapsed
- `aria-expanded="true"` when expanded
- Expanded content linked via `aria-controls` or `id` reference
- Screen readers announce "expanded" state

**Soft Assertions**:
```typescript
await expect.soft(readMoreBtn).toHaveAttribute('aria-expanded', 'false');
await readMoreBtn.click();
await expect.soft(readMoreBtn).toHaveAttribute('aria-expanded', 'true');
```

---

### TC-ACG09: Verify Semantic HTML Structure  
**Priority**: Medium  
**Acceptance Criteria**: WCAG 2.1 AA  
**Prerequisites**: Component visible  

**Test Steps**:
1. Verify checkbox uses `<input type="checkbox">`
2. Verify label uses `<label>` tag
3. Verify list uses `<ul>` and `<li>` tags
4. Verify buttons use `<button>` tag

**Expected Results**:
- Proper semantic HTML elements used
- No div/span elements masquerading as interactive elements
- Native form controls used for inputs
- Proper heading hierarchy if headlines present

**Soft Assertions**:
```typescript
const checkboxTag = await checkbox0.evaluate(el => el.tagName);
expect.soft(checkboxTag).toBe('INPUT');

const checkboxType = await checkbox0.getAttribute('type');
expect.soft(checkboxType).toBe('checkbox');
```

---

### TC-ACG10: Verify No Keyboard Traps  
**Priority**: Critical  
**Acceptance Criteria**: WCAG 2.1 AA  
**Prerequisites**: Component visible  

**Test Steps**:
1. Tab through entire component
2. Verify focus can move past component
3. Shift+Tab backward through component
4. Verify no focus stuck in expanded content

**Expected Results**:
- Focus can enter and exit component naturally
- No elements trap keyboard focus
- Tab/Shift+Tab work as expected
- Expanded content doesn't trap focus

**Soft Assertions**:
```typescript
// Navigate through component
for (let i = 0; i < 10; i++) {
  await page.keyboard.press('Tab');
}
// Verify focus moved past component
const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-qa'));
expect.soft(focusedElement).not.toContain('consent-condition');
```

---

### TC-ACG11: Verify Color Contrast Compliance  
**Priority**: High  
**Acceptance Criteria**: WCAG 2.1 AA  
**Prerequisites**: Component visible  

**Test Steps**:
1. Use axe-core to check color contrast
2. Verify checkbox label text contrast ≥ 4.5:1
3. Verify Read More button text contrast ≥ 4.5:1
4. Verify content text contrast ≥ 4.5:1

**Expected Results**:
- All text meets WCAG AA contrast ratio (4.5:1 for normal text)
- Large text meets 3:1 ratio
- No color contrast violations reported
- Interactive elements distinguishable

**Soft Assertions**:
```typescript
const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
const colorContrastViolations = accessibilityScanResults.violations.filter(
  v => v.id === 'color-contrast'
);
expect.soft(colorContrastViolations.length).toBe(0);
```

---

### TC-ACG12: Verify Screen Reader Can Navigate Content States  
**Priority**: High  
**Acceptance Criteria**: WCAG 2.1 AA  
**Prerequisites**: Component visible  

**Test Steps**:
1. Verify unconsented state has accessible role
2. Check all checkboxes
3. Verify consented state has accessible role
4. Verify state transition announced to screen readers

**Expected Results**:
- Both states have appropriate ARIA roles
- State changes communicated to assistive technology
- Content remains navigable in both states
- No orphaned text or unlabeled regions

**Soft Assertions**:
```typescript
const unconsentedRole = await unconsentedState.getAttribute('role');
await expect.soft(unconsentedState).toBeVisible();

await checkAllCheckboxes();

const consentedRole = await consentedState.getAttribute('role');
await expect.soft(consentedState).toBeVisible();
```

---

## 3. Visual Tests (@Visual)

**Note**: All visual tests run across 4 viewports (XL, LG, MD, SM) using Figma design values.

### TC-VCG01: Verify Checkbox Label Typography (XL Viewport)  
**Priority**: High  
**Figma Node**: 19206-61117 (Selected, Expanded+Default, XL)  
**Acceptance Criteria**: Visual consistency  

**Test Steps**:
1. Set viewport to XL (1440×900)
2. Fetch Figma values for checkbox label text
3. Get computed styles from checkbox label-0
4. Compare font-family, font-size, line-height, color

**Expected Results**:
- **font-family**: Matches Figma (e.g., Bayer Sans)
- **font-size**: Matches Figma ±1px
- **line-height**: Matches Figma ±1px
- **color**: Matches Figma (hex or rgb)

**Soft Assertions**:
```typescript
const figmaValues = getFigmaValues('XL', 'checkbox-label');
const actualStyles = await getComputedStyles(label0);

expect.soft(actualStyles.fontFamily).toContain(figmaValues.fontFamily);
expect.soft(actualStyles.fontSize).toBe(figmaValues.fontSize);
expect.soft(actualStyles.lineHeight).toBe(figmaValues.lineHeight);
expect.soft(actualStyles.color).toBe(figmaValues.color);
```

---

### TC-VCG02: Verify Checkbox Label Typography (LG Viewport)  
**Priority**: High  
**Figma Node**: 19206-61129 (Selected, Expanded+Default, LG)  
**Acceptance Criteria**: Visual consistency  

**Test Steps**: Same as TC-VCG01 but with LG viewport (1024×800)

---

### TC-VCG03: Verify Checkbox Label Typography (MD Viewport)  
**Priority**: High  
**Figma Node**: 19206-61171 (Selected, Expanded+Default, MD)  
**Acceptance Criteria**: Visual consistency  

**Test Steps**: Same as TC-VCG01 but with MD viewport (768×1024)

---

### TC-VCG04: Verify Checkbox Label Typography (SM Viewport)  
**Priority**: High  
**Figma Node**: 19206-61186 (Selected, Expanded+Default, SM)  
**Acceptance Criteria**: Visual consistency  

**Test Steps**: Same as TC-VCG01 but with SM viewport (375×667)

---

### TC-VCG05: Verify Read More Button Typography (All Viewports)  
**Priority**: Medium  
**Figma Node**: Varies by viewport  
**Acceptance Criteria**: Visual consistency  

**Test Steps**:
1. For each viewport (XL, LG, MD, SM)
2. Get Figma values for Read More button text
3. Compare font-family, font-size, color with actual

**Expected Results**:
- Button text typography matches Figma across all viewports
- Responsive typography adjusts correctly per viewport

---

### TC-VCG06: Verify Expanded Text Typography (All Viewports)  
**Priority**: Medium  
**Figma Node**: Expanded state nodes  
**Acceptance Criteria**: Visual consistency  

**Test Steps**:
1. Expand Read More for condition 0
2. Get Figma values for expanded text
3. Compare typography with actual rendered text

**Expected Results**:
- Expanded text typography matches Figma
- Rich Text formatting preserved
- Line height and spacing correct

---

### TC-VCG07: Verify Unconsented Content Typography (All Viewports)  
**Priority**: Medium  
**Figma Node**: Collapsed+Disabled state nodes  
**Acceptance Criteria**: Visual consistency  

**Test Steps**:
1. Verify unconsented state is visible
2. Get Figma values for unconsented content text
3. Compare typography with actual

**Expected Results**:
- Placeholder/restricted content typography matches Figma
- Text color may be different to indicate restricted state

---

### TC-VCG08: Verify Consented Content Typography (All Viewports)  
**Priority**: Medium  
**Figma Node**: Selected, Expanded state nodes  
**Acceptance Criteria**: Visual consistency  

**Test Steps**:
1. Check all checkboxes to reveal consented content
2. Get Figma values for consented content text
3. Compare typography with actual

**Expected Results**:
- Full content typography matches Figma
- Text color may differ from unconsented state

---

### TC-VCG09: Verify Checkbox Size and Spacing (All Viewports)  
**Priority**: High  
**Acceptance Criteria**: Visual consistency  

**Test Steps**:
1. For each viewport, get checkbox dimensions
2. Measure vertical spacing between checkboxes
3. Compare with Figma spacing values

**Expected Results**:
- Checkbox size matches Figma (width × height)
- Vertical gap between conditions consistent
- Spacing adjusts responsively per viewport

**Soft Assertions**:
```typescript
const checkbox0Box = await checkbox0.boundingBox();
expect.soft(checkbox0Box.width).toBeCloseTo(figmaValues.checkboxWidth, 2);
expect.soft(checkbox0Box.height).toBeCloseTo(figmaValues.checkboxHeight, 2);

// Measure spacing between checkbox 0 and 1
const spacing = checkbox1Box.y - (checkbox0Box.y + checkbox0Box.height);
expect.soft(spacing).toBeCloseTo(figmaValues.checkboxGap, 2);
```

---

### TC-VCG10: Verify Checkbox Visual States (Unchecked, Checked, Hover, Focus)  
**Priority**: High  
**Acceptance Criteria**: Visual consistency  

**Test Steps**:
1. Verify unchecked checkbox appearance
2. Hover over checkbox, verify hover state
3. Click checkbox, verify checked state
4. Focus checkbox, verify focus indicator

**Expected Results**:
- Unchecked: Empty box with border
- Checked: Checkmark or fill visible
- Hover: Border color or background changes
- Focus: Focus ring visible and meets contrast requirements

**Soft Assertions**:
```typescript
// Unchecked state
const uncheckedBg = await checkbox0.evaluate(el => getComputedStyle(el).backgroundColor);

// Hover state
await checkbox0.hover();
const hoverBg = await checkbox0.evaluate(el => getComputedStyle(el).backgroundColor);
expect.soft(hoverBg).not.toBe(uncheckedBg);

// Checked state
await checkbox0.check();
await expect.soft(checkbox0).toBeChecked();
```

---

### TC-VCG11: Verify Read More Icon Rotation on Expand  
**Priority**: Medium  
**Acceptance Criteria**: Visual consistency  

**Test Steps**:
1. Get Read More button icon (SVG) transform property
2. Click Read More to expand
3. Verify icon rotated (e.g., arrow points down)

**Expected Results**:
- Icon rotation animates smoothly
- Collapsed state: arrow points right or down
- Expanded state: arrow rotates (e.g., points up)
- Transform/rotation value changes

**Soft Assertions**:
```typescript
const iconCollapsed = readMoreBtn.locator('svg');
const transformBefore = await iconCollapsed.evaluate(el => getComputedStyle(el).transform);

await readMoreBtn.click();

const transformAfter = await iconCollapsed.evaluate(el => getComputedStyle(el).transform);
expect.soft(transformAfter).not.toBe(transformBefore);
```

---

### TC-VCG12: Verify Content Transition Animation Smoothness  
**Priority**: Low  
**Acceptance Criteria**: Visual polish  

**Test Steps**:
1. Check all checkboxes to trigger state transition
2. Observe animation between unconsented and consented states
3. Verify transition is smooth (no janky/jumpy movement)

**Expected Results**:
- Fade or slide transition between states
- Animation duration appropriate (e.g., 200-500ms)
- No layout shift or content jump
- 60fps performance

**Note**: Primarily manual visual inspection; can measure animation timing

---

### TC-VCG13: Verify Divider Line Styling (If Headline Present)  
**Priority**: Low  
**Figma Node**: See viewport-specific nodes  
**Acceptance Criteria**: AC6 visual validation  

**Test Steps**:
1. Verify divider element (`<hr>` or styled div) is visible
2. Get divider height, color, width
3. Compare with Figma design

**Expected Results**:
- Divider spans appropriate width (e.g., 100%)
- Height/thickness matches Figma (e.g., 1px)
- Color matches Figma
- Positioned below headline with correct margin

**Soft Assertions**:
```typescript
const divider = page.locator('hr').first();
const dividerBox = await divider.boundingBox();
const dividerColor = await divider.evaluate(el => getComputedStyle(el).borderColor);

expect.soft(dividerBox.height).toBeCloseTo(figmaValues.dividerHeight, 1);
expect.soft(dividerColor).toBe(figmaValues.dividerColor);
```

**Note**: Currently no headline in test environment

---

### TC-VCG14: Verify Responsive Layout in 50% Column (All Viewports)  
**Priority**: High  
**Acceptance Criteria**: Layout constraint  

**Test Steps**:
1. For each viewport, verify component container width
2. Verify component positioned in middle 50% of 25-50-25 layout
3. Measure parent column width vs component width

**Expected Results**:
- Component occupies 50% section correctly
- Content doesn't overflow container
- Proper constraints in 25-50-25 layout
- Responsive adjustments per viewport

**Soft Assertions**:
```typescript
const parentColumn = page.locator('[data-qa="columns255025"]');
const componentBox = await componentContainer.boundingBox();
const parentBox = await parentColumn.boundingBox();

// Component should be roughly 50% of parent width
const widthRatio = componentBox.width / parentBox.width;
expect.soft(widthRatio).toBeGreaterThan(0.45);
expect.soft(widthRatio).toBeLessThan(0.55);
```

---

### TC-VCG15: Verify Hover States on Buttons  
**Priority**: Medium  
**Acceptance Criteria**: Interactive feedback  

**Test Steps**:
1. Hover over Read More button
2. Verify hover state styling (color, background, cursor)
3. Move mouse away, verify hover state clears

**Expected Results**:
- Hover changes button appearance
- Cursor changes to pointer
- Background or text color transitions
- Smooth transition animation

**Soft Assertions**:
```typescript
const btnBefore = await readMoreBtn.evaluate(el => getComputedStyle(el).backgroundColor);

await readMoreBtn.hover();
const btnHover = await readMoreBtn.evaluate(el => getComputedStyle(el).backgroundColor);
expect.soft(btnHover).not.toBe(btnBefore);

const cursor = await readMoreBtn.evaluate(el => getComputedStyle(el).cursor);
expect.soft(cursor).toBe('pointer');
```

---

### TC-VCG16: Verify No Layout Shift During State Transitions  
**Priority**: Medium  
**Acceptance Criteria**: Visual stability  

**Test Steps**:
1. Get bounding box of element below component
2. Check all checkboxes to trigger state change
3. Verify element below hasn't shifted vertically

**Expected Results**:
- Content transition doesn't cause layout shift
- Elements below component maintain position
- Smooth content swap without reflow
- No cumulative layout shift (CLS)

**Soft Assertions**:
```typescript
const elementBelow = page.locator('[data-qa="footer-block"]');
const positionBefore = await elementBelow.boundingBox();

await checkAllCheckboxes();
await page.waitForTimeout(500); // Wait for transition

const positionAfter = await elementBelow.boundingBox();
expect.soft(positionAfter.y).toBeCloseTo(positionBefore.y, 5);
```

---

## 4. Performance Tests (@Performance)

### TC-PCG01: Verify Component Initial Load Time  
**Priority**: High  
**Acceptance Criteria**: Performance baseline  

**Test Steps**:
1. Navigate to test page with performance monitoring
2. Measure time from navigation to component visible
3. Verify load time < 2 seconds

**Expected Results**:
- Component renders within 2 seconds
- No blocking resources delay component
- DOMContentLoaded fires quickly
- Component visible in viewport timing acceptable

**Assertions**:
```typescript
const startTime = Date.now();
await page.goto(testURL);
await componentContainer.waitFor({ state: 'visible' });
const loadTime = Date.now() - startTime;

expect(loadTime).toBeLessThan(2000);
```

---

### TC-PCG02: Verify Checkbox Toggle Response Time  
**Priority**: Medium  
**Acceptance Criteria**: Interactive responsiveness  

**Test Steps**:
1. Click checkbox
2. Measure time until checked state updates
3. Verify response < 100ms

**Expected Results**:
- Checkbox state updates immediately
- Visual feedback instant
- No perceptible lag
- Response time < 100ms

**Assertions**:
```typescript
const startTime = performance.now();
await checkbox0.click();
await checkbox0.waitFor({ state: 'checked' });
const responseTime = performance.now() - startTime;

expect(responseTime).toBeLessThan(100);
```

---

### TC-PCG03: Verify State Transition Performance  
**Priority**: High  
**Acceptance Criteria**: Smooth user experience  

**Test Steps**:
1. Check all checkboxes
2. Measure time from last checkbox click to consented state visible
3. Verify transition < 500ms

**Expected Results**:
- State transition completes within 500ms
- Animation smooth (60fps target)
- No janky transitions
- Content swap performant

**Assertions**:
```typescript
await checkbox0.check();
const startTime = performance.now();
await checkbox1.check();
await consentedState.waitFor({ state: 'visible' });
const transitionTime = performance.now() - startTime;

expect(transitionTime).toBeLessThan(500);
```

---

### TC-PCG04: Verify Read More Expand/Collapse Animation Performance  
**Priority**: Low  
**Acceptance Criteria**: Smooth animation  

**Test Steps**:
1. Click Read More button
2. Monitor frame rate during expansion animation
3. Verify animation maintains 60fps

**Expected Results**:
- Expansion animation smooth
- No frame drops during animation
- 60fps maintained
- No performance degradation with multiple expansions

**Note**: Requires performance API or visual inspection

---

## Test Execution Plan

### Phase 1: Functional Tests (Priority: Critical/High)
- Execute TC-CG01 through TC-CG18
- Target: 100% pass rate on critical functional tests
- Estimated Time: 2-3 hours

### Phase 2: Accessibility Tests
- Execute TC-ACG01 through TC-ACG12
- Use axe-core for automated accessibility scanning
- Manual testing with screen reader (NVDA/JAWS)
- Estimated Time: 2-3 hours

### Phase 3: Visual Tests
- Execute TC-VCG01 through TC-VCG16 across all viewports
- Fetch Figma values for each viewport
- Compare computed styles with design specifications
- Estimated Time: 3-4 hours

### Phase 4: Performance Tests
- Execute TC-PCG01 through TC-PCG04
- Monitor performance metrics
- Establish performance baselines
- Estimated Time: 1 hour

---

## Traceability Matrix

| Acceptance Criteria | Test Cases | Status |
|---------------------|-----------|--------|
| AC2: Unconsented content visible by default | TC-CG03, TC-CG04, TC-CG05, TC-CG17 | Ready |
| AC3: Consented content when all checked | TC-CG07, TC-CG14, TC-CG18 | Ready |
| AC4: Revert on deselect | TC-CG08 | Ready |
| AC5: Variable checkbox count (1-3) | TC-CG02, TC-CG09, TC-CG10, TC-CG11, TC-CG12, TC-CG13, TC-CG16 | Ready |
| AC6: Headline divider line | TC-CG15, TC-VCG13 | Ready (pending headline) |
| WCAG 2.1 AA Compliance | TC-ACG01 through TC-ACG12 | Ready |
| Visual Design Compliance | TC-VCG01 through TC-VCG16 | Ready |
| Performance Requirements | TC-PCG01 through TC-PCG04 | Ready |

---

## Test Environment Setup

### Prerequisites
1. Node.js and npm installed
2. Playwright installed (`npm install @playwright/test`)
3. axe-core installed for accessibility tests (`npm install @axe-core/playwright`)
4. Figma API access configured (FIGMA_TOKEN in .env)
5. HTTP credentials for Vercel authentication configured

### Configuration
```typescript
// playwright.config.ts
projects: [
  { name: 'chromium', use: { 
      ...devices['Desktop Chrome'],
      viewport: { width: 1440, height: 900 } // XL
    }
  },
  // Additional viewport configurations for LG, MD, SM
]
```

### Test Data
- **Test URL**: https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint-14/consentcomponent
- **Current Checkbox Count**: 2
- **Condition 0**: "Datenschutzhinweis für Nutzung des Vergleichsrechners"
- **Condition 1**: "Haftungsausschluss"

---

## Notes & Assumptions

1. **Checkbox Count**: Current test environment has 2 checkboxes. Test cases designed to handle 1-3 checkboxes (AC5 requirement).

2. **Headline Configuration**: AC6 tests (TC-CG15, TC-VCG13) ready but currently no headline in test environment. Tests will be applicable once headline is configured.

3. **Language**: Test cases are language-agnostic - no content-dependent assertions. Tests work with german text currently on page.

4. **Figma Values**: Visual tests reference Figma node-ids for each viewport. Actual Figma value extraction will be implemented during test script phase.

5. **Soft Assertions**: All test cases use soft assertions (`expect.soft()`) to allow tests to continue even if one assertion fails, providing comprehensive failure reports.

6. **Data-QA Attributes**: All locators will use SmartLocator pattern with data-qa as primary strategy and semantic/CSS fallbacks.

---

**Document Status**: Ready for Review  
**Next Step**: Review test cases → Implement test scripts using SmartLocator pattern

---

*This test case document follows the Test-First Approach as required by playwright-prompt.md guidelines.*

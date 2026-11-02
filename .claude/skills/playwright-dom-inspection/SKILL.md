---
name: playwright-dom-inspection
description: MANDATORY live-DOM inspection workflow that must run BEFORE writing any Playwright locators or test code. Use when starting a new component, identifying data-qa/data-testid attributes, building the temporary DOM inspector test, handling Vercel HTTP auth and cookie banners during inspection, or documenting the DOM structure. Enforces the DOM-first, language-agnostic approach.
---

# DOM-First Inspection Workflow

> Source: extracted verbatim from `playwright-prompt.md` (backup at `docs/ai-prompt-source/playwright-prompt.original.md`). See `.claude/skills/MANIFEST.md` for the section map. Locator authoring rules live in **playwright-smart-locators**.

### CRITICAL: DOM-First Approach for Multi-Language Support
**MANDATORY REQUIREMENT**: All new components must use DOM-inspected, language-agnostic locators

**Key Changes**:
- **data-qa attributes are PRIMARY** (not data-testid)
- **No content-dependent assertions** (breaks in different languages)
- **Live DOM inspection required** before creating any locators
- **Structural validation over content validation**

---

## DOM Inspection Process (MANDATORY STEPS)

1. **Open the live website** in browser (Chrome/Edge recommended)
2. **Navigate to the actual test page** specified in requirements
3. **Use Developer Tools (F12)** to inspect elements
4. **Use element picker** to select each component element
5. **Extract ONLY data-qa and data-testid attributes** from the actual DOM
6. **🚨 CRITICAL: Inspect ALL child elements** within components for data-qa/data-testid (don't assume they don't exist)
7. **Document the complete DOM structure** with all available data attributes (parent AND children)
8. **Verify selectors** using Console: `document.querySelector('[data-qa="your-selector"]')`
9. **Test child element queries**: `document.querySelector('[data-qa="parent"] [data-qa="child"]')`
10. Note: For locators, use parent-child relationship to fetch elements using data-qa for ALL elements

- **DOM Structure Documentation**:
  ```typescript
  // Always document the actual DOM structure found during inspection
  /**
   * DOM Structure (from live inspection):
   * <section data-qa="text-image-block" data-testid="text-image-block">
   *   <div class="image-container">
   *     <img data-qa="next-image" data-testid="next-image" aria-label="next-image" />
   *   </div>
   *   <div class="text-container">
   *     <h2 data-qa="title-component" aria-label="title-component">Title</h2>
   *     <section data-qa="description-component" aria-label="description-component">Content</section>
   *   </div>
   * </section>
   */
  ```

---

## DOM Inspection Workflow (MANDATORY)
```typescript
// Step 1: Use Playwright to inspect live DOM
await page.goto('https://your-test-page-url');

// Step 2: Extract actual data attributes from DOM
const result = await page.evaluate(() => {
  const component = document.querySelector('[data-qa="main-component"]');
  const elements = component.querySelectorAll('[data-qa], [data-testid]');
  return Array.from(elements).map(el => ({
    tagName: el.tagName,
    dataQa: el.getAttribute('data-qa'),
    dataTestid: el.getAttribute('data-testid'),
    ariaLabel: el.getAttribute('aria-label'),
    textContent: el.textContent ? 'HAS_CONTENT' : 'EMPTY'
  }));
});
console.log('Available DOM elements:', result);

// Step 3: Create locators based on actual findings
private readonly actualElement: Locator = this.page.locator('[data-qa="found-in-dom"]');
```

---

## DOM Inspection Example - Step by Step Process

**Example: Inspecting Text with Image Component**

1. **Navigate to Test Page**:
   ```typescript
   // Use Playwright to open the actual test page
   await page.goto('https://bayer-beyond-qa-uk.vercel.app/.../TextWithImage');
   ```

2. **Extract DOM Structure**:
   ```typescript
   // Run this in browser console or Playwright script
   const componentContainer = document.querySelector('[data-qa*="text-image"]');
   const allDataElements = componentContainer.querySelectorAll('[data-qa], [data-testid]');

   allDataElements.forEach((el, index) => {
     console.log(`Element ${index}:`, {
       tagName: el.tagName,
       dataQa: el.getAttribute('data-qa'),
       dataTestid: el.getAttribute('data-testid'),
       ariaLabel: el.getAttribute('aria-label'),
       hasContent: el.textContent ? true : false
     });
   });
   ```

3. **Document Findings**:
   ```typescript
   /**
    * ACTUAL DOM STRUCTURE (from live inspection):
    *
    * <section data-qa="text-image-block" data-testid="text-image-block" aria-label="Text Image Block">
    *   <div class="image-container">
    *     <img data-qa="next-image" data-testid="next-image" aria-label="next-image" alt="" src="..." />
    *   </div>
    *   <div class="text-container">
    *     <h2 data-qa="title-component" aria-label="title-component">Headline</h2>
    *     <section data-qa="description-component" aria-label="description-component">Content 1</section>
    *     <section data-qa="description-component" aria-label="description-component">Content 2</section>
    *   </div>
    * </section>
    */
   ```

4. **Create Locators Based on Findings**:
   ```typescript
   // Only use attributes that were actually found in DOM
   private readonly componentContainer: Locator = this.page.locator('[data-qa="text-image-block"]');
   private readonly imageElement: Locator = this.page.locator('[data-qa="next-image"][data-testid="next-image"]');
   private readonly titleElement: Locator = this.page.locator('[data-qa="title-component"]');
   private readonly descriptionElements: Locator = this.page.locator('[data-qa="description-component"]');
   ```

5. **Create Language-Agnostic Assertions**:
   ```typescript
   async verifyFromActualDOM(): Promise<void> {
     // Verify structure exists (works in any language)
     await expect(this.componentContainer).toBeVisible();
     await expect(this.componentContainer).toHaveAttribute('data-qa', 'text-image-block');

     // Verify image has required attributes
     await expect(this.imageElement).toHaveAttribute('data-qa', 'next-image');
     await expect(this.imageElement).toHaveAttribute('alt'); // Has alt text

     // Verify title is H2 and has content
     const tagName = await this.titleElement.evaluate(el => el.tagName.toLowerCase());
     expect(tagName).toBe('h2');
     await expect(this.titleElement).not.toBeEmpty();

     // Verify description count matches DOM structure
     await expect(this.descriptionElements).toHaveCount(2); // Found 2 in DOM
   }
   ```

---

### 🔍 Practical DOM Inspection Workflow (Step-by-Step Implementation Guide)

**Purpose**: Before writing any test code, you must inspect the live DOM to identify actual `data-qa` and `data-testid` attributes. This section provides a complete, runnable workflow.

#### **Step 1: Create DOM Inspector Test File**

Create a temporary test file to inspect the component:

```typescript
// File: tests/specs/dom-inspector.spec.ts
import { test } from '@playwright/test';

test.describe('DOM Inspector - [Component Name]', () => {
  test('Inspect DOM Structure', async ({ page, context }) => {
    const testURL = 'YOUR_TEST_PAGE_URL_HERE';

    // CRITICAL: Set HTTP credentials for Vercel authentication
    await context.setHTTPCredentials({
      username: 'bayercorp',
      password: 'beyond2026',
    });

    console.log(`📍 Navigating to: ${testURL}`);
    await page.goto(testURL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Handle cookie banner (uses BasePage pattern)
    console.log('🍪 Checking for cookie banner...');
    await page.waitForTimeout(2000);
    const cookieButton = page.getByRole('button', { name: /ACCEPT COOKIES/i });
    const cookieVisible = await cookieButton.isVisible().catch(() => false);

    if (cookieVisible) {
      await cookieButton.click();
      await page.waitForTimeout(1000);
      console.log('✅ Cookie banner accepted');
    }

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    console.log('\n📊 Inspecting DOM Structure...\n');

    // Extract complete DOM structure
    const domStructure = await page.evaluate(() => {
      const results: any = {
        allDataQaElements: [],
        imageElements: [],
        textElements: {},
        links: []
      };

      // Find ALL elements with data-qa or data-testid attributes
      const allElementsWithData = document.querySelectorAll('[data-qa], [data-testid]');

      results.allDataQaElements = Array.from(allElementsWithData).map((el: any, index) => ({
        index: index + 1,
        tagName: el.tagName,
        dataQa: el.getAttribute('data-qa'),
        dataTestid: el.getAttribute('data-testid'),
        ariaLabel: el.getAttribute('aria-label'),
        className: el.className,
        id: el.id,
        textContent: el.textContent ? el.textContent.substring(0, 50).trim() : '',
        hasChildren: el.children.length > 0,
        childrenCount: el.children.length
      }));

      // Find all images
      const images = document.querySelectorAll('img');
      results.imageElements = Array.from(images).map((img: any) => ({
        dataQa: img.getAttribute('data-qa'),
        dataTestid: img.getAttribute('data-testid'),
        alt: img.alt,
        src: img.src ? img.src.substring(0, 100) : '',
        className: img.className
      }));

      // Find text elements
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const paragraphs = document.querySelectorAll('p');
      const spans = document.querySelectorAll('span[data-qa], span[data-testid]');

      results.textElements = {
        headings: Array.from(headings).map((h: any) => ({
          tagName: h.tagName,
          dataQa: h.getAttribute('data-qa'),
          dataTestid: h.getAttribute('data-testid'),
          textContent: h.textContent ? h.textContent.substring(0, 50).trim() : '',
          className: h.className
        })),
        paragraphs: Array.from(paragraphs).map((p: any) => ({
          dataQa: p.getAttribute('data-qa'),
          dataTestid: p.getAttribute('data-testid'),
          textContent: p.textContent ? p.textContent.substring(0, 50).trim() : '',
          className: p.className
        })),
        spans: Array.from(spans).map((s: any) => ({
          dataQa: s.getAttribute('data-qa'),
          dataTestid: s.getAttribute('data-testid'),
          textContent: s.textContent ? h.textContent.substring(0, 50).trim() : '',
          className: s.className
        }))
      };

      // Find all links
      const links = document.querySelectorAll('a');
      results.links = Array.from(links).map((link: any) => ({
        dataQa: link.getAttribute('data-qa'),
        dataTestid: link.getAttribute('data-testid'),
        href: link.href,
        textContent: link.textContent ? link.textContent.substring(0, 50).trim() : '',
        ariaLabel: link.getAttribute('aria-label'),
        className: link.className
      }));

      return results;
    });

    // Display findings in console
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📋 DOM INSPECTION RESULTS');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log(`✅ Total elements with data-qa/data-testid: ${domStructure.allDataQaElements.length}\n`);

    console.log('🎯 ALL DATA-QA ELEMENTS FOUND:');
    console.log('─'.repeat(65));
    domStructure.allDataQaElements.forEach((el: any) => {
      console.log(`${el.index}. <${el.tagName.toLowerCase()}>`);
      if (el.dataQa) console.log(`   data-qa="${el.dataQa}"`);
      if (el.dataTestid) console.log(`   data-testid="${el.dataTestid}"`);
      if (el.ariaLabel) console.log(`   aria-label="${el.ariaLabel}"`);
      if (el.id) console.log(`   id="${el.id}"`);
      if (el.textContent) console.log(`   text: "${el.textContent}..."`);
      console.log(`   children: ${el.childrenCount}`);
      console.log('');
    });

    console.log('\n🖼️  IMAGE ELEMENTS:');
    console.log('─'.repeat(65));
    domStructure.imageElements.forEach((img: any, index: number) => {
      console.log(`${index + 1}. Image:`);
      if (img.dataQa) console.log(`   data-qa="${img.dataQa}"`);
      if (img.dataTestid) console.log(`   data-testid="${img.dataTestid}"`);
      if (img.alt) console.log(`   alt="${img.alt}"`);
      if (img.src) console.log(`   src="${img.src}..."`);
      console.log('');
    });

    console.log('\n📝 TEXT ELEMENTS:');
    console.log('─'.repeat(65));
    console.log('Headings:');
    domStructure.textElements.headings.forEach((h: any, index: number) => {
      console.log(`${index + 1}. <${h.tagName.toLowerCase()}>: "${h.textContent}"`);
      if (h.dataQa) console.log(`   data-qa="${h.dataQa}"`);
      if (h.dataTestid) console.log(`   data-testid="${h.dataTestid}"`);
      console.log('');
    });

    console.log('\n🔗 LINK ELEMENTS:');
    console.log('─'.repeat(65));
    domStructure.links.forEach((link: any, index: number) => {
      if (link.dataQa || link.dataTestid || link.textContent) {
        console.log(`${index + 1}. Link: "${link.textContent}"`);
        if (link.dataQa) console.log(`   data-qa="${link.dataQa}"`);
        if (link.dataTestid) console.log(`   data-testid="${link.dataTestid}"`);
        if (link.href) console.log(`   href="${link.href}"`);
        console.log('');
      }
    });

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ DOM Inspection Complete');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Keep page open for manual inspection (5 minutes)
    await page.waitForTimeout(300000);
  });
});
```

#### **Step 2: Run DOM Inspector**

Execute the DOM inspector test in headed mode to see the page and capture output:

```bash
# Run with headed browser to see the page
playwright test tests/specs/dom-inspector.spec.ts --headed --project=chromium

# Capture output to a file for analysis
playwright test tests/specs/dom-inspector.spec.ts --headed --project=chromium 2>&1 | Select-Object -First 200
```

**Expected Output**: Console will display all elements with `data-qa` and `data-testid` attributes, organized by type.

#### **Step 3: Document DOM Findings**

Create a comprehensive DOM inspection document:

```markdown
# File: docs/dom-inspection-[component-name].md

# DOM Inspection Report - [Component Name]

**Component**: [Component Name]
**User Story**: [Story ID]
**Test Page**: [URL]
**Inspection Date**: [Date]
**Total Elements with data-qa/data-testid**: [Count]

---

## 🎯 Key Component Identification

### Main Component Container
\`\`\`html
<[tag] data-qa="[value]"
      data-testid="[value]"
      aria-label="[value]">
\`\`\`

**Location in DOM**: Element #[number]
**Parent Container**: `<[parent-tag] data-qa="[parent-value]">`

---

## 📋 Component Structure Analysis

### Required Elements (from Requirements):
1. **Element 1**: Description
   - Data-qa: `data-qa="[value]"`
   - Purpose: [purpose]

2. **Element 2**: Description
   - Data-qa: `data-qa="[value]"`
   - Purpose: [purpose]

[Continue for all elements...]

---

## 🔍 Frontend Validation Requirements

### Functional Validations:
- [ ] Component exists and is visible
- [ ] All required elements present
- [ ] Interactive elements are clickable
- [ ] Navigation/links work correctly

### Visual Validations:
- [ ] Typography (font-family, size, line-height, color)
- [ ] Spacing and layout
- [ ] Hover effects
- [ ] Responsive behavior

### Accessibility Validations:
- [ ] Semantic HTML structure
- [ ] ARIA attributes present
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

---

*DOM Inspection completed. Ready for test case generation.*
```

#### **Step 4: Clean Up**

After documenting findings, remove the temporary DOM inspector test:

```bash
Remove-Item tests\specs\dom-inspector.spec.ts -Force
```

#### **Key Authentication Patterns** (from BasePage.ts)

**HTTP Basic Auth** (for Vercel-protected pages):
```typescript
await context.setHTTPCredentials({
  username: 'bayercorp',
  password: 'beyond2026',
});
```

**Cookie Banner Handling**:
```typescript
// Strategy 1: Bayer custom banner
const cookieButton = page.getByRole('button', { name: /ACCEPT COOKIES/i });
if (await cookieButton.isVisible().catch(() => false)) {
  await cookieButton.click();
}

// Strategy 2: OneTrust banner
const oneTrustButton = page.locator('#onetrust-accept-btn-handler');
if (await oneTrustButton.isVisible().catch(() => false)) {
  await oneTrustButton.click();
}
```

#### **Best Practices**

1. ✅ **Always run DOM inspection BEFORE writing any test code**
2. ✅ **Document ALL elements with data-qa attributes** in the inspection report
3. ✅ **Keep the browser open** during inspection for manual verification
4. ✅ **Use the inspection output** to design SmartLocator strategies
5. ✅ **Save the inspection document** in `docs/` for team reference
6. ✅ **Cross-reference** DOM findings with Figma designs to ensure completeness
7. ✅ **Verify authentication** works correctly before proceeding

#### **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| **ERR_INVALID_AUTH_CREDENTIALS** | Add `context.setHTTPCredentials()` before `page.goto()` |
| **Cookie banner blocks content** | Wait 2 seconds after page load, then handle cookie banner |
| **Elements not found** | Check if page is fully loaded with `waitForLoadState('networkidle')` |
| **TypeScript errors** | Use `any` type for DOM evaluation results |
| **Browser closes too fast** | Add `await page.waitForTimeout(300000)` to keep open |

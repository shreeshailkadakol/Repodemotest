<!--
  File: playwright-prompt.md
  Purpose: This file contains pre-defined prompts for interacting with the Playwright MCP server
           using the Claudia AI assistant integrated in Visual Studio Code.

  Usage:
    - Use these prompts to automate tasks related to test execution, test status, test generation,
      debugging, and environment configuration using Playwright and Claudia AI.

  Note:
    - Make sure Claudia is configured with access to the MCP server and Playwright test suite.
    - Use short and precise prompts to receive faster and more accurate results.
    - ALWAYS inspect live DOM structure before creating locators
    - PRIORITIZE data-qa attributes for multi-language compatibility
    - CRITICAL: Use systematic extraction commands for test failure analysis - NEVER manually scan output
    - **MANDATORY: ALL new components MUST use SmartLocator methods** (See SmartLocator Guidelines below)

  Last Updated: February 14, 2026
-->

### 🚀 CRITICAL: SmartLocator Implementation (MANDATORY)

**ALL new test implementations MUST use AI-Powered SmartLocator for element interactions**

**Why SmartLocator?**
- **40% reduction** in test maintenance time
- **Automatic fallbacks** when selectors break due to UI changes
- **Health monitoring** to identify brittle selectors
- **Multi-language compatible** - works across different locales
- **Auto-healing** - tests keep working even when UI changes

**SmartLocator Methods (Use These ONLY)**:
```typescript
// Find elements with multiple fallback strategies
await this.findSmart({ role, dataQa, testId, css, description });

// High-level helpers (preferred)
await this.clickSmart({ role, dataQa, description });
await this.fillSmart({ role, dataQa, description }, 'text');
await this.getTextSmart({ role, dataQa, description });
await this.isVisibleSmart({ role, dataQa, description });
```

**❌ NEVER use traditional approaches:**
```typescript
// INCORRECT - Single selector (brittle, breaks easily)
const element = page.locator('.btn.primary');
await element.click();
```

**✅ ALWAYS use SmartLocator:**
```typescript
// CORRECT - Multiple fallback strategies (resilient)
await this.clickSmart({
  dataQa: 'submit-button',
  testId: 'submit-btn',
  role: { role: 'button', name: /submit/i },
  css: 'button.submit',
  description: 'Submit button'
});
```

**Mandatory SmartLocator Requirements**:
1. Every element interaction MUST use SmartLocator methods
2. Provide minimum 3 fallback strategies per element
3. Include meaningful `description` for health monitoring
4. Review selector health report after tests: `reports/selector-health/selector-health.html`

**Documentation**: See `docs/AI-AUTO-HEALING-SELECTORS.md` and `docs/SMART-LOCATORS-CHEATSHEET.md`

---

### CRITICAL: Systematic Test Analysis Framework
**MANDATORY REQUIREMENT**: Always use systematic approach to analyze test failures - NEVER manually scan output

**Systematic Analysis Process**:
1. **Extract ALL failure patterns systematically**:
   ```bash
   # Extract all Expected vs Received patterns
   npx playwright test [spec] --reporter=line 2>&1 | findstr /C:"Expected:" /C:"Received:"
   
   # Extract all error types
   npx playwright test [spec] --reporter=line 2>&1 | findstr /i "Error: expect"
   
   # Get failure summary
   npx playwright test [spec] --reporter=line 2>&1 | findstr /C:"failed"
   ```

2. **Mandatory Analysis Checklist** (Complete BEFORE concluding):
   - [ ] **Counted total failures** vs reported failures match
   - [ ] **Extracted every "Expected: X, Received: Y"** pattern systematically  
   - [ ] **Grouped failures by viewport** (XL, LG, MD, SM)
   - [ ] **Grouped failures by element type** (Title, Description, Input, Button)
   - [ ] **Grouped failures by property** (fontSize, lineHeight, color, etc.)
   - [ ] **Cross-referenced with test names** to understand context
   - [ ] **Verified no issues missed** in any viewport

3. **Quality Assurance Questions** (Ask before submitting analysis):
   - "Did I find the same number of issues as the test summary reports?"
   - "Did I check EVERY viewport mentioned in the output?"
   - "Are there any 'Expected/Received' lines I didn't analyze?"
   - "Did I verify the issue pattern across similar components/viewports?"

4. **Never rely on manual scanning** - use systematic extraction commands above

### CRITICAL: DOM-First Approach for Multi-Language Support
**MANDATORY REQUIREMENT**: All new components must use DOM-inspected, language-agnostic locators

**Key Changes**:
- **data-qa attributes are PRIMARY** (not data-testid)
- **No content-dependent assertions** (breaks in different languages)  
- **Live DOM inspection required** before creating any locators
- **Structural validation over content validation**

### Implementation Guidelines
Before implementing any test case, ensure the following rules are followed:

1. **URL Management**:
   - All URLs should be stored in the `componentURL.ts` file under a meaningful component name.
   - URLs must be accessed using the `getComponentUrl` method from the base class.
   - Base URLs should NEVER be hardcoded in test files, always use `envUtils.getBaseUrl()`.

2. **Locator Guidelines - SmartLocator with DOM-First Approach**:
   - **MANDATORY**: Always use SmartLocator methods (`findSmart`, `clickSmart`, `fillSmart`, etc.) for ALL element interactions
   - **MANDATORY**: Always inspect the actual live DOM structure before creating locators
   - **SmartLocator Strategy**: Provide multiple fallback selectors in priority order
   
   **SmartLocator Priority Order** (provide ALL available options):
   - **PRIORITY 1**: Data attributes - `data-qa`, `testId`, `dataTest` (stable, testing-specific)
   - **PRIORITY 2**: Semantic selectors - `role`, `label`, `placeholder`, `title`, `altText` (most resilient)
   - **PRIORITY 3**: Content selectors - `text` (fragile with i18n, use with regex)
   - **PRIORITY 4**: CSS/XPath - `css`, `xpath`, `id` (last resort, most brittle)
   
   **Benefits of SmartLocator**:
   - 40% reduction in test maintenance
   - Automatic fallback when selectors break
   - Health monitoring and reporting
   - Multi-language compatibility
  
   
   - **DOM Inspection Process (MANDATORY STEPS)**:
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
   
   - **SmartLocator Implementation Pattern** (MANDATORY):
     ```typescript
     // ✅ CORRECT: Using SmartLocator with multiple fallback strategies
     async getTitleElement(): Promise<Locator> {
       return await this.findSmart({
         role: { role: 'heading' },              // Semantic (priority 1)
         dataQa: 'title-component',              // data-qa attribute (priority 2)
         testId: 'title-component',              // data-testid fallback
         css: '[data-qa="title-component"]',    // CSS fallback
         description: 'Component title heading'  // For health reports
       });
     }
     
     async getImageElement(): Promise<Locator> {
       return await this.findSmart({
         altText: /image|photo/i,                // Semantic (priority 1)
         dataQa: 'next-image',                   // data-qa attribute (priority 2)
         testId: 'next-image',                   // data-testid fallback
         role: { role: 'img' },                  // Semantic role fallback
         css: 'img[data-qa="next-image"]',      // CSS fallback
         description: 'Component image'
       });
     }
     
     // ✅ CORRECT: Using high-level SmartLocator helpers
     async clickSubmitButton(): Promise<void> {
       await this.clickSmart({
         role: { role: 'button', name: /submit|send/i },
         dataQa: 'submit-button',
         testId: 'submit-btn',
         text: /submit/i,
         css: 'button.submit',
         description: 'Submit button'
       });
     }
     
     // ❌ INCORRECT: Old approach - single selector (brittle)
     // private readonly element: Locator = this.page.locator('.btn.primary.large');
     // DO NOT USE: Single selectors break easily when UI changes
     ```
   
   - **Language-Agnostic Assertions with SmartLocator**:
     ```typescript
     // ✅ CORRECT: SmartLocator with structural validation
     const element = await this.findSmart({
       role: { role: 'heading' },
       dataQa: 'title-component',
       testId: 'title',
       description: 'Page title'
     });
     await expect(element).toBeVisible();
     await expect(element).toHaveAttribute('data-qa', 'title-component');
     await expect(element).not.toBeEmpty(); // Has content, any language
     
     // ✅ CORRECT: Using SmartLocator helper methods
     const isVisible = await this.isVisibleSmart({
       role: { role: 'button' },
       dataQa: 'submit-btn',
       description: 'Submit button'
     });
     expect(isVisible).toBeTruthy();
     
     const text = await this.getTextSmart({
       role: { role: 'heading' },
       dataQa: 'title',
       description: 'Title'
     });
     expect(text.length).toBeGreaterThan(0);
     
     // ❌ INCORRECT: Content-dependent assertions (breaks with i18n)
     // await expect(element).toContainText('English text');
     // await expect(element).toHaveClass(/specific-styling-class/);
     ```
   
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

3. **Component Structure**:
   - Each component should extend the BasePage class.
   - Components should handle their own cookie acceptance using inherited `acceptCookiesBanner()`.
   - Keep related functionality within the same component.

4. **Why Use data-qa Attributes (Primary Choice)**:
   - **Stability**: `data-qa` attributes are specifically designed for QA testing and won't change during UI updates
   - **Consistency**: Standard attribute naming convention across the application
   - **Language Independence**: Not affected by content localization or text changes
   - **Styling Independence**: Not affected by CSS styling changes, class name refactoring, or design updates
   - **Clarity**: Makes it clear to developers which elements are used for testing
   - **Performance**: Faster selector execution compared to complex CSS selectors
   - **Maintenance**: Reduces test maintenance when UI changes occur
   - **Multi-Language Support**: Works across different language versions of the site
   - **Best Practice**: Industry standard for reliable test automation
   
   - **Comparison of Approaches**:
     ```typescript
     // ROBUST: data-qa based (works across languages and styling changes)
     private readonly button: Locator = this.page.locator('[data-qa="submit-button"]');
     
     // GOOD: data-testid based (alternative when data-qa not available)
     private readonly button: Locator = this.page.locator('[data-testid="submit-btn"]');
     
     // FRAGILE: Content-dependent (breaks with different languages)
     private readonly button: Locator = this.page.locator('button:has-text("Submit")');
     
     // FRAGILE: Class-dependent (breaks with styling changes)
     private readonly button: Locator = this.page.locator('.btn.btn-primary.large-button');
     ```
   
   - **Multi-Language Compatibility**:
     ```typescript
     // WORKS GLOBALLY: Structure and attribute validation
     await expect(element).toBeVisible();
     await expect(element).toHaveAttribute('data-qa', 'title-component');
     await expect(element).not.toBeEmpty(); // Has content, any language
     
     // BREAKS IN OTHER LANGUAGES: Content-specific validation
     await expect(element).toContainText('English Headline');
     await expect(element).toHaveText('Submit');
     ```

5. **DOM Inspection Workflow (MANDATORY)**:
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

6. **Test File Structure**:
   - Import envUtils for base URL management.
   - Use component's own methods for common actions (e.g., cookie acceptance).
   - Follow the page object pattern strictly.

7. **Debugging Guidelines**:
   - Run tests in headed mode: `--headed --project=chromium`
   - Use debug mode for investigating failures: `--debug`
   - Add slowMo in playwright.config.ts for slower execution
   - Enable video recording for failed and pass tests
   - Use screenshots on failure
   
   - **Critical: Systematic Test Analysis to Prevent Missing Issues**:
     ```bash
     # NEVER manually scan output - ALWAYS use systematic extraction
     npx playwright test [spec] --reporter=line 2>&1 | findstr /C:"Expected:" /C:"Received:"
     ```
     - Always cross-check failure count with systematic extraction
     - Verify patterns across ALL viewports mentioned in output
     - Use checklist approach rather than assumption-based analysis
   - **Locator Debugging (Updated for data-qa)**:
     - Use browser console to test `data-qa` selectors: `document.querySelector('[data-qa="your-element"]')`
     - If `data-qa` locator fails, inspect element to verify the attribute exists
     - Use `page.locator('[data-qa="your-element"]').highlight()` to visually debug locators
     - Check for typos in `data-qa` values (case-sensitive)
     - Verify element is loaded before interacting: `await locator.waitFor({ state: 'visible' })`
     - **DOM Inspection Commands**:
       ```javascript
       // In browser console: Get all elements with data-qa attributes
       document.querySelectorAll('[data-qa]');
       
       // Check specific component structure
       const component = document.querySelector('[data-qa="component-name"]');
       console.log('Available data attributes:', 
         Array.from(component.querySelectorAll('[data-qa], [data-testid]'))
           .map(el => ({ tag: el.tagName, qa: el.getAttribute('data-qa'), testid: el.getAttribute('data-testid') }))
       );
       ```

## Quick Reference: Common data-qa Patterns

### Standard Naming Conventions:
- Use kebab-case: `data-qa="submit-button"` (not camelCase or snake_case)
- Be descriptive: `data-qa="user-profile-avatar"` (not just "avatar")
- Include component context: `data-qa="header-navigation-menu"`

### 🚨 CRITICAL: SmartLocator Pattern for ALL Elements (Including Child Elements)

**MANDATORY REQUIREMENT**: ALL elements MUST use `findSmart()` - this includes:
- ✅ Parent/container elements
- ✅ **Child elements within containers** 
- ✅ Nested elements at any level
- ✅ Form inputs, buttons, links, images, text elements

**❌ NEVER USE** (Even for child elements):
```typescript
// ❌ WRONG - Traditional scoped locator for child element
private readonly copyrightText: Locator = this.footerContainer.locator('p');

// ❌ WRONG - Traditional page locator
private readonly imageElement: Locator = this.page.locator('[data-qa="next-image"]');

// ❌ WRONG - Container scoping pattern
async getChildElement(): Promise<Locator> {
  const container = await this.getContainer();
  return container.locator('[data-qa="child"]'); // NO! Still wrong!
}
```

**✅ CORRECT - SmartLocator Pattern** (Based on Actual Implementation):
```typescript
// ✅ CORRECT - Parent component with SmartLocator
async getComponentContainer(): Promise<Locator> {
  return await this.findSmart({
    dataQa: 'individual-teaser',
    testId: 'individual-teaser',
    role: { role: 'article' },
    css: 'article[data-qa="individual-teaser"]',
    description: 'Individual Teaser component container',
  });
}

// ✅ CORRECT - Child image element with SmartLocator (DOM-verified)
async getImageElement(): Promise<Locator> {
  return await this.findSmart({
    dataQa: 'individual-teaser-image',
    testId: 'individual-teaser-image',
    css: 'article[data-qa="individual-teaser"] img',
    xpath: '//article[@data-qa="individual-teaser"]//img',
    description: 'Individual Teaser image',
  });
}

// ✅ CORRECT - Child headline with SmartLocator (scoped CSS)
async getHeadlineElement(): Promise<Locator> {
  return await this.findSmart({
    dataQa: 'individual-teaser-headline',
    css: 'article[data-qa="individual-teaser"] h2[data-qa="individual-teaser-headline"]',
    xpath: '//article[@data-qa="individual-teaser"]//h2[@data-qa="individual-teaser-headline"]',
    altText: 'article[data-qa="individual-teaser"] h2',
    description: 'Individual Teaser headline',
  });
}

// ✅ CORRECT - Child link with SmartLocator (semantic fallback)
async getLinkElement(): Promise<Locator> {
  return await this.findSmart({
    css: 'article[data-qa="individual-teaser"] > a[href]',
    xpath: '//article[@data-qa="individual-teaser"]/a[@href]',
    altText: 'article[data-qa="individual-teaser"] a',
    description: 'Individual Teaser card link',
  });
}
```

**Key Principles for Child Elements**:
1. ✅ Always use `findSmart()` (never `container.locator()`)
2. ✅ Verify data-qa attributes exist via DOM inspection (don't assume they don't)
3. ✅ Use scoped CSS selectors: `parent[data-qa="parent"] child[data-qa="child"]`
4. ✅ Provide minimum 3-4 fallback strategies
5. ⚠️ Avoid ambiguous role selectors that can match elements outside component
   - ❌ `role: { role: 'heading' }` (matches any H1-H6 on page)
   - ✅ Scoped CSS instead: `article[data-qa="teaser"] h2`
6. ✅ Include meaningful descriptions for health monitoring
```

### Multi-Language Test Patterns:
```typescript
// RECOMMENDED: Structure validation without content dependency
async verifyComponentStructure(): Promise<void> {
  await expect(this.titleElement).toBeVisible();
  await expect(this.titleElement).toHaveAttribute('data-qa', 'title-component');
  await expect(this.titleElement).not.toBeEmpty(); // Has content, any language
  
  // Verify semantic HTML structure
  const tagName = await this.titleElement.evaluate(el => el.tagName.toLowerCase());
  expect(tagName).toBe('h2'); // Semantic validation
}

// ✅ RECOMMENDED: Attribute-based validation
async verifyImageProperties(): Promise<void> {
  await expect(this.imageElement).toHaveAttribute('data-qa', 'next-image');
  await expect(this.imageElement).toHaveAttribute('alt'); // Has alt text
  await expect(this.imageElement).toHaveAttribute('src'); // Has image source
}

// ❌ AVOID: Content-dependent validation
async avoidThisApproach(): Promise<void> {
  // These will break in different languages
  await expect(this.titleElement).toContainText('English Title');
  await expect(this.buttonElement).toHaveText('Submit');
}
```

### DOM Inspection Example - Step by Step Process

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
      password: 'beyond2025',
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
npx playwright test tests/specs/dom-inspector.spec.ts --headed --project=chromium

# Capture output to a file for analysis
npx playwright test tests/specs/dom-inspector.spec.ts --headed --project=chromium 2>&1 | Select-Object -First 200
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
  password: 'beyond2025',
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

---

### Documentation Requirements

1. **Test Case Documentation**:
   - Create a markdown file for each component in `docs/test-cases/` directory
   - File naming: `{component-name}.test-cases.md`
   - Include:
     - Traceability matrix linking tests to requirements
     - Detailed test steps and expected results
     - Prerequisites and setup requirements
     - Known limitations or special conditions

2. **README.md Updates**:
   - Update `docs/test-cases/README.md` when adding/modifying components
   - Add new component entry under the Components section
   - Include brief description of test coverage
   - Link to the component's test case file
   - Update status indicators in traceability matrix

3. **Documentation Format**:
   - Use clear, concise language
   - Include test case IDs following format: TC-{Component Initial}{Number}
   - Document status: Ready, Implemented, Blocked, or Deprecated
   - Add timestamps for last updates
   - Reference related tickets or requirements
   - **MANDATORY**: Include actual DOM structure found during inspection

4. **Review Process**:
   - Documentation updates are required as part of the PR
   - Review documentation for completeness and accuracy
   - Ensure traceability between requirements and test cases
   - Verify all links and references are working
   - **NEW**: Verify DOM inspection was performed and documented

### Component Development Checklist
Before creating any new component test:

- [ ] **DOM Inspection Completed**: Live website inspected, actual data-qa attributes documented
- [ ] **Locators Use data-qa**: Primary locators use `[data-qa="..."]` attributes from actual DOM
- [ ] **Language-Agnostic Assertions**: No content-dependent assertions (toContainText, toHaveText with specific text)
- [ ] **Structural Validation**: Verify HTML semantic structure (H1, H2, IMG tags, etc.)
- [ ] **Multi-Language Ready**: Tests work across different language versions
- [ ] **Accessibility Compliant**: aria-label and other accessibility attributes verified
- [ ] **No CSS Class Dependencies**: Avoid CSS class-based locators unless absolutely necessary

### Accessibility Testing Guidelines
   1. **Accessibility Standards**:
      - Tests should validate compliance with WCAG 2.1 AA standards
      - Use Playwright's accessibility testing features with axe-core integration
      - Focus on color contrast, keyboard navigation, screen reader compatibility, semantic HTML , Alt text for images and videos , Proper labeling for all form fields
   2. **Accessibility Test Structure**:
      - Each component should have dedicated accessibility tests
      - Tests should be tagged with "@Accessibility"
      - test should be created respective component test spec file
   3. **Required Accessibility Checks**:
      - Screen reader compatibility (aria attributes)
      - Keyboard navigation and focus management
      - Color contrast ratios
      - Alternative text for images
      - Proper heading structures
      - Form labels and error messages
   4. **Accessibility Documentation**:
      - Add accessibility test cases to component documentation

### Test Failure Analysis Guidelines
⚠️ **CRITICAL**: Use systematic approach to analyze ALL test failures - never rely on manual scanning

1. **Systematic Failure Extraction Commands**:
   ```bash
   # Extract all Expected vs Received values systematically
   npx playwright test [spec] --reporter=line 2>&1 | findstr /C:"Expected:" /C:"Received:"
   
   # Extract all error types and patterns
   npx playwright test [spec] --reporter=line 2>&1 | findstr /i "Error: expect"
   
   # Get failure counts and summary
   npx playwright test [spec] --reporter=line 2>&1 | findstr /C:"failed"
   ```

2. **Mandatory Pre-Analysis Verification**:
   - [ ] **Total failure count matches** between extraction and test summary
   - [ ] **Every "Expected: X, Received: Y" pattern extracted** and analyzed
   - [ ] **All viewports checked** (XL, LG, MD, SM) for consistent patterns
   - [ ] **All element types analyzed** (Title, Description, Input, Button, etc.)
   - [ ] **All properties checked** (fontSize, lineHeight, color, width, etc.)
   - [ ] **Cross-referenced with test names** to understand failure context

3. **Analysis Structure Template**:
   ```markdown
   ## Component Test Analysis: [Component Name]
   ### ✅ Passing Tests: [X/Total]
   ### ❌ Failed Tests: [Y/Total]
   
   **Systematic Failure Breakdown:**
   1. **[Viewport] - [Element] - [Property] Issue:**
      - Expected: `[value]`, Actual: `[value]`
      - Test: `[test name]`
      - Root Cause: `[implementation/design issue]`
   
   **Verification Checklist Completed:**
   - [x] All Expected/Received patterns extracted
   - [x] All viewports analyzed for consistent issues
   - [x] Failure count matches test summary
   ```

4. **Quality Assurance Questions** (Always ask before concluding):
   - "Did I miss any viewport-specific issues?"
   - "Are there consistent patterns across similar elements?"
   - "Did I verify the same issue doesn't exist in other viewports?"
   - "Is my failure count accurate vs the test summary?"
      - Use test case IDs following format: TC-A{Component Initial}{Number}
      - Include specific WCAG success criteria being tested
      - Document any approved exceptions or limitations
   

### Requirements
  
1. ** Giant Teaser **

Test Page URL:

https://bayer-beyond-qa-uk.vercel.app/

Figma URL:
https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=12-24067&t=9pq6Zpzhq1ME5pf6-1


Requirement:

The first set of options shown is for the areas/countries/groups that locations are sorted into - these are arranged with "Bayer Global" first, then alphabetically.  If there is a display name in the locale currently being viewed then show that, otherwise fallback to a default ("global English") display name.

On selecting an area/country/group, all locations within that are shown, including location name, address, phone number and site URL.

On clicking/tapping/following a link to a site, the Site Browser/Selector interface closes and the new URL is loaded in the browser.

AC1: Application should display the Headline of the country/group items list in the locations overlay. 
AC2: Application should display the Headline for the Locations List, shared translated text.
AC3: Application should display the Description Text of the location/site information in the locations overlay per Locale.
AC4: Application should display the text for the Auto Detection Text as a side wide setting 
AC5: If the Bayer  the user has accepted the cookies, the Auto Location Detection Text is displayed in the main language of the detected country including a link to the appropriate Bayer website. 
AC6: A Frontend User can access the locations overlay from the header or the navigation fly-out.
AC7: The locations overlay displays all country/group items and their corresponding locations maintained. 
AC8: A Super User or Admin can designate one item to show before and separate from all the other country or group.Currently bayer global is set us separately from all the other country or group.
AC8: Applies only to breakpoints LG and above: The country/group item the user is currently on is displayed as active in the list with the corresponding location information displayed --> this feature is not working , so script will fail
AC9: If there is a display name in the locale currently being viewed then show that in the list, otherwise fallback to a default ("global English") display name.
AC10: The list of country/group items is sorted alphabetically ascending.
AC11: A Frontend user can search the country/group items.
AC12: A Frontend User can select a country/group item in the list to see the corresponding information maintained for this item.
AC13: On clicking/tapping/following a link to a site, the Site Browser/Selector interface closes and the new URL is loaded in the browser.
AC14: The Locations Menu displays the "back" button depending on from where it has been opened; if opened from the header, the back button is not displayed, if opened from navigation fly-out it is displayed, a click on the back button leads to the navigation fly-out in the state where the user "has left it".
AC15: When the "close" button in the Locations Overlay is clicked/tapped/followed, or the Escape key is pressed, then the Locations Overlay is hidden and the underlying page is shown again




### Testing Process Guidelines

**CRITICAL: Test-First Approach - Always Follow This Order**

When creating test automation for any requirement, you MUST follow this exact sequence:

#### 1. **Requirements Analysis Phase** (MANDATORY FIRST STEP)
- Fetch and analyze the specific requirement from Azure DevOps
- Understand the acceptance criteria thoroughly
- Identify the component/functionality to be tested
- Determine the test scope and boundaries

#### 2. **Test Case Design Phase** (BEFORE ANY CODE)
- Create comprehensive test case documentation first
- Document test scenarios in markdown format
- Include test steps, expected results, and test data
- Use proper test case IDs following the format: TC-{Component Initial}{Number}
- Cover positive, negative, and edge cases
- Include accessibility test cases with "@Accessibility" tag
- Add performance and cross-browser test scenarios

#### 3. **Test Case Review Phase** (VALIDATION)
- Review test cases against requirements
- Ensure complete coverage of acceptance criteria
- Validate test scenarios make logical sense
- Check for any missing test cases

#### 4. **Test Script Implementation Phase** (AFTER TEST CASES)
- Convert documented test cases into automated scripts
- Use test case documentation as the blueprint
- Implement proper page object model structure
- Follow existing framework patterns and conventions
- Add appropriate test tags and annotations

#### 5. **Test Execution Phase** (FINAL STEP)
- Execute the implemented test scripts
- Verify all test cases pass as expected
- Report any failures or issues found
- Update test cases if needed based on execution results


Implementation Notes:
- Store component URL in `componentURL.ts`:
  ```typescript
  SocialMediaComponent: {
      testData: { 
          url: "en/"
      }
  }
  ```
- Use envUtils for base URL:
  ```typescript
  const baseURL = envUtils.getBaseUrl();
  const url = await component.getComponentUrl('SocialMediaComponent', baseURL);
  ```
- Run tests:
  ```bash
  # Normal run
  npx cross-env TEST_ENV=prod npx playwright test tests/specs/SocialMedia.spec.ts

  # Headed mode
  npx cross-env TEST_ENV=prod npx playwright test tests/specs/SocialMedia.spec.ts --headed --project=chromium

  # Debug mode
  npx cross-env TEST_ENV=prod npx playwright test tests/specs/SocialMedia.spec.ts --debug
  ```

  ### Prompt to provide in the chat
  
Component name : Key Figures Group


Step 1 :Can you go through the prompt file completely and follow it strictly.
Step 2: Fetch the requirement from user story 2058 using fetch-requirements.js script
Step 3: Launch the test page and understand what all need to be validated from FE and share your understanding with user for review and inspect the Dom Structure by creating the DOM Inspect file . authentication methods are available in base page.check how other components handle authentication by looking at the BasePage implementation 
TestPage URL:https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint12/keyfiguregroup

** Important**: For Step 3 DOM inspection implementation, refer to the **" Practical DOM Inspection Workflow"** section above which provides complete code examples for authentication handling, cookie acceptance, and DOM structure extraction.


Step 4: Based on the DOM understanding and FE requirement from user story, generate the Functional, Accessibility, Performance, Visual test cases and get it reviewed from user without fail.

**⚠️ CRITICAL - Frontend Validation Only**:
- **ONLY test Frontend rendering and behavior** - what the end user sees and interacts with
- **EXCLUDE CMS functionality** from test cases:
  - ❌ Do NOT test CMS create/edit/delete capabilities (AC1-type requirements)
  - ❌ Do NOT test CMS content editor fields or interfaces (AC3-type requirements)
  - ❌ Do NOT test CMS configuration interfaces (AC4-type requirements)
- **INCLUDE Frontend validations**:
  - ✅ Component renders correctly on the page
  - ✅ All content fields display properly (image, text, links)
  - ✅ Layout restrictions are enforced (e.g., 25%/33% column placement)
  - ✅ Interactive behavior works (hover effects, click functionality, navigation)
  - ✅ Visual design matches Figma (typography, colors, spacing)
  - ✅ Accessibility compliance (WCAG 2.1 AA)
  - ✅ Performance metrics (load time, animation smoothness)

**Test Case Focus**: Validate the **rendered output** that appears on the website, not the CMS backend that creates it.

Step 5: Generate the test scripts based on the test cases with the following MANDATORY requirements:

**CRITICAL - SmartLocator Implementation (MANDATORY)**:
- **ALL element interactions MUST use SmartLocator methods** (`findSmart`, `clickSmart`, `fillSmart`, `getTextSmart`, `isVisibleSmart`)
- **NEVER use traditional `page.locator()` or hard-coded locators**
- **Provide ALL available fallback strategies** in priority order:
  1. Data attributes (data-qa, testId, dataTest)
  2. Semantic selectors (role, label, placeholder, title, altText)
  3. Content selectors (text with regex for flexibility)
  4. CSS/XPath (last resort fallback)
- **Always include meaningful description** for health monitoring
- **Use parent-child relationships** with data-qa/testId attributes

**SmartLocator Example Pattern** (Follow this structure):
```typescript
async getElement(): Promise<Locator> {
  return await this.findSmart({
    dataQa: 'submit-button',
    testId: 'submit-btn',
    role: { role: 'button', name: /submit/i },
    text: /submit/i,
    css: 'button.submit',
    description: 'Submit button'
  });
}
```

**Visual Validation**:
- To verify font color, font family, line height, color for an element, fetch the values from Figma using Figma-extractor.ts , figmaAPI.ts file
- Figma URL: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=6227-65662&t=ctrZMvEmOzsbY7dt-1
  - XL: node-id=6227-65727
  - LG: node-id=6227-65708
  - MD: node-id=6227-65687
  - SM: node-id=6227-65664

Step 6: Self review all the test scripts against the requirement:
- Ensure ALL element interactions use SmartLocator methods (no traditional locators)
- **CRITICAL: Verify child element methods use `findSmart()`, NOT `container.locator()`**
- Verify EVERY element has multiple fallback strategies (minimum 3)
- Verify all data-qa attributes exist via DOM inspection (don't assume)
- Check for ambiguous role selectors that can match elements outside component
- Ensure all test scripts have functional, accessibility, performance, visual tags
- Soft assertion should be provided, strictly NO hard assertion
- Verify meaningful descriptions added for health monitoring
- Check selector health report will be generated at: reports/selector-health/selector-health.html

Step 7: Execute tests and wait for the page to load completely.

Step 8: After test execution, review the Selector Health Report at reports/selector-health/selector-health.html to identify any selectors needing optimization. 



  ### Prompt to provide in the chat before raising a PR

**Pre-PR Checklist - SmartLocator Compliance**:

1. **SmartLocator Verification (CRITICAL)**:
   - [ ] ALL element interactions use SmartLocator methods (`findSmart`, `clickSmart`, `fillSmart`, etc.)
   - [ ] NO traditional `page.locator()` or hard-coded locators exist (including in child element methods)
   - [ ] **CHILD ELEMENTS: Verify ALL child/nested element methods use `findSmart()`, NOT `container.locator()`**
   - [ ] EVERY element has minimum 3 fallback strategies (semantic → data-qa → CSS)
   - [ ] ALL data-qa attributes verified via DOM inspection (not assumed)
   - [ ] Scoped CSS selectors used for child elements: `parent[data-qa="x"] child[data-qa="y"]`
   - [ ] No ambiguous role selectors that can match elements outside component scope
   - [ ] ALL SmartLocator calls include meaningful `description` field
   - [ ] Reviewed selector health report at reports/selector-health/selector-health.html
   - [ ] No selectors flagged as "needs attention" in health report

2. **Code Quality**:
   - [ ] No redundant or duplicate methods
   - [ ] lint checks with zero errors
   - [ ] All requirements and acceptance criteria fully covered

3. **Assertions & Error Handling**:
   - [ ] Use soft assertions for all validations (Playwright built-in `.soft` assertions)
   - [ ] No hard assertions that terminate tests prematurely
   - [ ] Code does not suppress or bypass potential defects
   - [ ] Full bug visibility maintained

4. **Visual & Cross-Browser Testing**:
   - [ ] All viewport test cases execute even if one fails
   - [ ] Font size, font family, line height, color verification for ALL elements
   - [ ] All viewport sizes are correct across all files

5. **Code Standards**:
   - [ ] No emojis in console statements, test case names, or anywhere in test scripts
   - [ ] No lint errors
   - [ ] Follows SmartLocator patterns from examples (see components/examples/headerSmart.example.ts)

6. **Documentation**:
   - [ ] Component uses SmartLocator methods documented with examples
   - [ ] DOM structure documented with actual data-qa/testId attributes found
   - [ ] Selector health considerations noted if any selector needed multiple attempts

**Run Pre-PR Validation Commands**:
```bash
# Run lint
npm run lint

# Run tests
npx playwright test [your-spec-file]

# Check selector health report (MANDATORY)
start reports\selector-health\selector-health.html

# Verify no traditional locators exist (should return 0 matches in your new code)
findstr /S /I "page.locator" components\YourComponent.ts
```

**SmartLocator Health Score Target**: Aim for >95% healthy selectors (green in health report)

**saucedemo.com Login component**
Component name :Login component
URL:https://www.saucedemo.com/
Descriptions :SauceDemo Login Feature - Brief Details

The SauceDemo Login Feature allows registered test users to authenticate and access the product inventory page. The login page contains:

Username field
Password field
Login button
Error message area for invalid login attempts

Common test users provided by SauceDemo include:

standard_user
locked_out_user
problem_user
performance_glitch_user
error_user
visual_user

The valid password for all test users is:

Plain Text
secret_sauce

On successful login, the user is redirected to the Inventory (Products) page (/inventory.html). Invalid credentials or restricted users receive appropriate error messages.

Acceptance Criteria
AC1: Successful Login

Given the user is on the login page
 When valid credentials are entered (standard_user / secret_sauce) and Login is clicked
 Then the user should be redirected to the Inventory page and see the product list.

AC2: Invalid Username

Given the user is on the login page
 When an invalid username and a valid password are entered
 Then an error message should be displayed and the user should remain on the login page.

AC3: Invalid Password

Given the user is on the login page
 When a valid username and an invalid password are entered
 Then an error message should be displayed and login should be denied.

AC4: Empty Username

Given the user is on the login page
 When the username field is left blank and Login is clicked
 Then a "Username is required" validation message should be displayed.

AC5: Empty Password

Given the user is on the login page
 When the password field is left blank and Login is clicked
 Then a "Password is required" validation message should be displayed.

AC6: Both Fields Empty

Given the user is on the login page
 When both username and password fields are empty and Login is clicked
 Then validation error message(s) should be displayed and login should not proceed.

AC7: Locked-Out User

Given the user is on the login page
 When locked_out_user and secret_sauce are entered
 Then the system should display a locked-out error message and prevent access to the Inventory page.

AC8: UI Availability

Given the login page is loaded
 Then Username field, Password field, and Login button should be visible and enabled for interaction.

Sample Test Data
Username	Password	Expected Resultstandard_user	secret_sauce	Login successful
locked_out_user	secret_sauce	Locked-out error
wrong_user	secret_sauce	Invalid credentials
standard_user	wrong_pass	Invalid credentials
Blank	secret_sauce	Username required
standard_user	Blank	Password required

**Sauce Demo - Register Feature (Brief Details)**

The Register feature on Sauce Demo Shopify site (https://sauce-demo.myshopify.com/account/register) allows new users to create an account and access customer-specific functionalities such as order history, saved addresses, and account management.

Feature Overview

A user can register by providing:

First Name
Last Name
Email Address
Password
Password Confirmation

After successful registration:

The account is created.
User may receive a confirmation email (if configured).
User can log in using the registered credentials.
User is redirected to their account page or a success page.
Acceptance Criteria
AC1: Successful Registration

Given the user is on the Register page
 When the user enters valid First Name, Last Name, Email, Password, and Confirm Password and clicks Create
 Then the account should be created successfully
 And the user should be redirected to the account page or see a success message.

AC2: Mandatory Field Validation

Given the user is on the Register page
 When one or more required fields are left blank
 Then the system should display appropriate validation messages
 And account creation should not proceed.

AC3: Email Format Validation

Given the user enters an email address
 When the email format is invalid (e.g., test.com)
 Then the system should display an error message indicating an invalid email format.

AC4: Duplicate Email Validation

Given an account already exists with the entered email address
 When the user attempts to register with the same email
 Then the system should display an error message stating that the email is already registered.

AC5: Password Confirmation Validation

Given the user enters a password and confirmation password
 When the values do not match
 Then the system should display a "Passwords do not match" error
 And registration should be prevented.

AC6: Password Security Requirements

Given the user enters a password
 When the password does not meet the configured security requirements
 Then an appropriate validation message should be displayed
 And account creation should not proceed.

AC7: Trim Leading and Trailing Spaces

Given the user enters values with leading or trailing spaces
 When the registration form is submitted
 Then the spaces should be trimmed before validation and storage.

AC8: Create Button Behavior

Given all mandatory fields contain valid data
 When the user clicks the Create button
 Then the button should submit the registration request only once
 And prevent duplicate account creation from multiple clicks.

AC9: Error Handling

Given a system or server error occurs during registration
 When the registration request fails
 Then the user should see a user-friendly error message
 And be allowed to retry.

AC10: Accessibility

Given the Register page is loaded
 When users navigate using keyboard or screen readers
 Then all fields, labels, and buttons should be accessible and compliant with basic accessibility standards.










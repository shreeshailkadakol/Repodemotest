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
   playwright test [spec] --reporter=line 2>&1 | findstr /C:"Expected:" /C:"Received:"
   
   # Extract all error types
   playwright test [spec] --reporter=line 2>&1 | findstr /i "Error: expect"
   
   # Get failure summary
   playwright test [spec] --reporter=line 2>&1 | findstr /C:"failed"
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
     playwright test [spec] --reporter=line 2>&1 | findstr /C:"Expected:" /C:"Received:"
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
- [ ] Typography (font-family, size, line-height, color) — assert **every** token in the Figma values file, not one element per region
- [ ] Every named color token (e.g. category/area colors) has an assertion
- [ ] Unlabeled / duplicated DOM nodes covered via `collectVisibleTextStyles` + `assertTokenPresent`
- [ ] Token-coverage checklist audited against Figma BEFORE marking visual tests complete
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
   playwright test [spec] --reporter=line 2>&1 | findstr /C:"Expected:" /C:"Received:"
   
   # Extract all error types and patterns
   playwright test [spec] --reporter=line 2>&1 | findstr /i "Error: expect"
   
   # Get failure counts and summary
   playwright test [spec] --reporter=line 2>&1 | findstr /C:"failed"
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
  
1. **Document Download Component**

**Component Name**: Document Download Component
**User Story**: 2049 - Document Download Tool
**Test Coverage**: 47 test cases (19 Functional + 12 Accessibility + 4 Performance + 10 Visual + 2 Structure)

**Test Page URL**:
https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint-9/documentdownload

**⚠️ Pagination URL** (USE ONLY FOR PAGINATION-SPECIFIC TEST SCENARIOS):
https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint-9/docpagination1
**Note**: This URL is strictly for testing pagination functionality only (e.g., TC-DD20: Verify pagination controls, TC-DD21: Navigate between pages). DO NOT use for general document download, search, or filter testing.

**Figma URL**:
https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=7070-42446&t=ZGtE91eX2nh2hAEY-4

**Component Description**:
The Document Download component allows users to browse, search, filter, and download documents. Users can filter documents by type, year, and quarter, search by title, and perform single or bulk downloads.

**Acceptance Criteria**:

**AC10: Divider Placement**
- A divider should appear after the headline and before the component content
- The divider provides visual separation between the headline and document cards

**AC11: Browse, Search, and Filter Functionality**
- Frontend users can browse all available documents in a card layout
- Each document card displays: title, description, document type, date, and file size
- Users can search documents by title (real-time filtering)
- Users can filter documents by:
  - **Document Type**: Multiple types available (e.g., Annual Report, Sustainability Report, etc.)
  - **Year**: Filter by publication year (e.g., 2024, 2023, 2022, etc.)
  - **Quarter**: Filter by quarter (Q1, Q2, Q3, Q4) when applicable
- Filters can be combined (e.g., Year + Quarter + Search)
- Search with no results displays appropriate "no results" message
- Clear search functionality to reset filters and show all documents

**AC12: Single Document Download**
- Each document card has a download button/link
- Clicking download initiates file download
- Download button is always visible and accessible
- Visual feedback on hover/focus states

**AC13: Multi-Select and Bulk Download**
- Users can select multiple documents using checkboxes on each card
- Bulk download button displays count of selected documents (e.g., "Download 3 documents")
- Bulk download button is disabled when no documents are selected
- Users can select/deselect individual documents
- "Select All" functionality to select all visible documents
- Clicking bulk download initiates download of all selected documents
- Clear selection functionality to deselect all documents

**AC14: Loading State**
- Loading indicator displays while fetching documents from the server
- Loading state prevents user interaction until data is loaded
- Smooth transition from loading to loaded state
- Error state handling if document fetch fails

**Frontend Validation Requirements**:

**Functional Tests** (Tag: @functional):
1. Verify divider placement after headline (AC10)
2. Verify all documents display correctly on initial load
3. Verify document card structure (title, type, date, download button)
4. Verify search functionality by document title
5. Verify search with no results displays empty state
6. Verify clear search resets to all documents
7. Verify filter by year functionality
8. Verify filter by document type functionality
9. Verify filter by quarter functionality
10. Verify combined filters (year + quarter + search)
11. Verify single document download button visibility
12. Verify download button on all document cards
13. Verify document selection with checkboxes
14. Verify bulk download button updates with selection count
15. Verify deselect document functionality
16. Verify bulk download of multiple documents
17. Verify clear all selections functionality
18. Verify loading state during document fetch
19. Verify filter reset functionality

**⚠️ Pagination Tests** (Tag: @pagination - USE PAGINATION URL ONLY):
**Note**: These tests MUST use the pagination-specific URL: `docpagination1`
- TC-DD20: Verify pagination controls display when documents exceed page limit
- TC-DD21: Verify navigation between pages (next/previous buttons)
- TC-DD22: Verify page number display and direct page navigation
- TC-DD23: Verify documents per page setting
**DO NOT mix pagination tests with general functional tests - use separate URL and separate test file if needed**

**Accessibility Tests** (Tag: @Accessibility):
1. Keyboard navigation through all interactive elements
2. Screen reader compatibility (aria-labels, roles)
3. Focus indicators visible on all interactive elements
4. Search input accessibility (label, placeholder, autocomplete)
5. Filter dropdowns keyboard accessible
6. Document checkboxes keyboard accessible
7. Bulk download button accessible with selection count announced
8. Color contrast compliance (WCAG 2.1 AA)
9. Semantic HTML structure (headings, lists, buttons)
10. Skip links for keyboard navigation
11. Error messages accessible and announced
12. Loading state accessible and announced

**Performance Tests** (Tag: @performance):
1. Initial component load time < 3 seconds
2. Search response time < 500ms
3. Filter response time < 500ms
4. Document card rendering performance

**Visual Tests** (Tag: @visual):

**⚠️ PREREQUISITE**: Visual tests REQUIRE Figma design specifications extracted in Step 3.5. Do NOT create visual tests without Figma values file.

**🔴 MANDATORY TOKEN-COVERAGE RULE (1:1 Figma parity — DO NOT SKIP):**
Visual coverage is measured per **Figma token**, NOT per region. It is NOT sufficient to assert one representative element per area (title, search, one card). You MUST assert EVERY typography and color token defined in the `<Component>_FigmaValues` file.

Before declaring visual tests "complete", you MUST:
1. **Enumerate every token** in the Figma values file (each font-size/weight/line-height/color and every named color). Build a checklist.
2. **Map each token to at least one assertion.** For every token, there must be a test that proves that exact value renders on screen. Cross off each token only when it has a passing (or intentionally-failing-as-finding) assertion.
3. **Do NOT silently skip unlabeled or duplicated DOM nodes.** Elements without `data-qa`, inner text nodes, or DOM that renders twice (e.g. desktop + hidden mobile sidebars) are NOT an excuse to skip a token. Use the `collectVisibleTextStyles(container)` page-object helper, which walks visible leaf text nodes and returns their computed styles — then assert the token is present among them with a `assertTokenPresent` / `assertColorPresent` style helper. This avoids brittle per-node selectors.
4. **Audit against Figma BEFORE saying done.** Re-open the Figma token table and confirm each row has a matching assertion. If a token has no assertion, the visual suite is incomplete.
5. **Report genuine design-vs-implementation discrepancies honestly** (e.g. live line-height differs from Figma). Do not loosen assertions to force green; surface them as findings.

Coverage targets (validate ALL that exist in the design — this is illustrative, not exhaustive):
1. Typography validation (font-family, font-size, line-height, color) — for **every** distinct text token
2. Spacing and layout consistency across viewports
3. Hover effects on interactive elements
4. Card / list-item visual design (title, subtitle, tags, detail field labels & values)
5. Search input label, placeholder, and input styling
6. Filter group headings, filter chips, toggle ("Filter"), and "Reset all" labels
7. Radio / checkbox / selection labels and visual states
8. Page-size / "per page" label and selected value
9. Category / area color tokens (e.g. therapeutic-area chip colors) — assert **each** named color
10. Banner / counter typography (value, unit, label, phase label)
11. Responsive behavior across breakpoints (XL, LG, MD, SM)

**Visual Test Implementation Pattern**:
```typescript
// Import Figma values (MANDATORY)
import { getValuesByViewport } from '../helpers/utils/figma-values/<Component>_FigmaValues';

// Use in test
const expectedStyles = getValuesByViewport('xl'); // or 'lg', 'md', 'sm'
await expect(element).toHaveCSS('font-size', expectedStyles.headline.fontSize);
await expect(element).toHaveCSS('color', expectedStyles.headline.color);
```

**Pattern for unlabeled / duplicated DOM (token presence over brittle selectors)**:
```typescript
// Page object: walk visible leaf text nodes and return their computed styles.
const styles = await component.collectVisibleTextStyles(container);

// Spec helper: soft-assert that AT LEAST ONE visible node matches the token
// (size + weight + line-height + normalized color + family contains the brand font).
assertTokenPresent(styles, figma.filterChip, 'Filter chip typography');

// For category/area colors, assert each named color renders somewhere in the group.
assertColorPresent(styles, TherapeuticAreaColors.oncology, 'Oncology chip color');
```
This is the preferred approach whenever an element lacks a stable `data-qa`, is an inner text node, or the DOM renders twice (desktop + hidden mobile). It guarantees the Figma token is proven without coupling to fragile per-node selectors.

**Component URL Storage**:
```typescript
// In componentURL.ts
DocumentDownloadComponent: {
    testData: { 
        url: "develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint-9/documentdownload"
    }
},
// Pagination testing ONLY - separate URL for pagination-specific scenarios
DocumentDownloadPagination: {
    testData: { 
        url: "develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint-9/docpagination1"
    }
}
```
**Note**: Use `DocumentDownloadPagination` URL ONLY for pagination test scenarios. All other tests (functional, accessibility, performance, visual) should use the main `DocumentDownloadComponent` URL.

**Viewport Configurations** (Aligned with TEST_CONFIG):
```typescript
const VIEWPORTS = {
  XL: { width: 1440, height: 900 },
  LG: { width: 1024, height: 800 },
  MD: { width: 768, height: 1024 },
  SM: { width: 375, height: 667 }
};
```

**⚠️ CRITICAL REMINDER**: 
- **Main URL** (`/documentdownload`): Use for ALL tests except pagination
- **Pagination URL** (`/docpagination1`): Use ONLY for @pagination tagged tests
- DO NOT mix URLs within the same test execution




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
  cross-env TEST_ENV=prod playwright test tests/specs/SocialMedia.spec.ts

  # Headed mode
  cross-env TEST_ENV=prod playwright test tests/specs/SocialMedia.spec.ts --headed --project=chromium

  # Debug mode
  cross-env TEST_ENV=prod playwright test tests/specs/SocialMedia.spec.ts --debug
  ```


Component name : Development pipeline


Step 1 :Can you go through the prompt file completely and follow it strictly.
Step 2: Fetch the complete requirement from user story 2600 using fetch-requirements script including:
- Synopsis (User Story)
- Description (Component behavior and key features)
- Acceptance Criteria (All ACs)
- Assumptions (API, data, technical assumptions)
- Technical Notes (API endpoints, documentation links)
- Comments/History (Latest updates and QA notes)
Step 3: Launch the test page and understand what all need to be validated from FE and share your understanding with user for review and inspect the Dom Structure by creating the DOM Inspect file . authentication methods are available in base page.check how other components handle authentication by looking at the BasePage implementation 

**Test Page URL** 
https://bayer-beyond-qa-uk.vercel.app/develop/test-catalyst-page/content-catalyst-page/qadontdelete/qaautomation/sprint23/developmentpipeline


** Important**: For Step 3 DOM inspection implementation, refer to the **" Practical DOM Inspection Workflow"** section above which provides complete code examples for authentication handling, cookie acceptance, and DOM structure extraction.


---

**Step 3.5: Extract Figma Design Specifications (MANDATORY BEFORE STEP 4)**

**⚠️ CRITICAL**: You MUST extract Figma design values BEFORE generating test cases. Visual validation tests require Figma specifications.

**Required Actions**:
1. **Fetch Figma Data using the Figma Extractor script** (`figma-extractor.ts`):
   ```powershell
   # Use the figma-extractor.ts script (NOT the Figma MCP server) to extract design specifications.
   # The FIGMA_TOKEN is read from .env. Run once per viewport node ID.
   # Usage: npx tsx figma-extractor.ts <fileKey> <nodeId> <token> [componentName]

   $env:FIGMA_TOKEN = (Get-Content .env | Select-String '^FIGMA_TOKEN=').ToString().Split('=',2)[1].Trim()

   npx tsx figma-extractor.ts fiKrYZCKNM1OqXHQoGwrlX <XL-node-id> $env:FIGMA_TOKEN <ComponentName>_XL
   npx tsx figma-extractor.ts fiKrYZCKNM1OqXHQoGwrlX <LG-node-id> $env:FIGMA_TOKEN <ComponentName>_LG
   npx tsx figma-extractor.ts fiKrYZCKNM1OqXHQoGwrlX <MD-node-id> $env:FIGMA_TOKEN <ComponentName>_MD
   npx tsx figma-extractor.ts fiKrYZCKNM1OqXHQoGwrlX <SM-node-id> $env:FIGMA_TOKEN <ComponentName>_SM
   ```
   - This generates raw extracts under `figma-values/<ComponentName>_{XL,LG,MD,SM}_Values.{ts,json}`.
   - Inspect the JSON extracts (TEXT elements give fontFamily/fontSize/fontWeight/lineHeight/color/letterSpacing; FRAME/INSTANCE give layout dimensions).

2. **Create the consolidated Figma Values File**:
   - Path: `helpers/utils/figma-values/<ComponentName>_FigmaValues.ts`
   - Follow existing pattern from `NewsListComponent_Enhanced_FigmaValues.ts` or `FeaturedSearchResults_FigmaValues.ts`
   - Consolidate the raw extracts by viewport (XL, LG, MD, SM):
     - Typography (font-family, font-size, font-weight, line-height, color)
     - Spacing (padding, margin, gap)
     - Layout (width, height, flex properties)
     - Colors (text, background, border)
   - Expose a `getValuesByViewport('xl' | 'lg' | 'md' | 'sm')` helper.
   - After consolidating, delete the raw `figma-values/` extracts (only the consolidated file in `helpers/utils/figma-values/` is used by tests).

3. **Import in Component File**:
   ```typescript
   import { getValuesByViewport } from '../helpers/utils/figma-values/<ComponentName>_FigmaValues';
   ```

**⚠️ CRITICAL RULE: ALWAYS import and use FigmaValues files in visual tests. NEVER hardcode design values (font-size, colors, spacing).**
**All visual validations MUST use imported Figma specifications - guessing or hardcoding values defeats automated design validation.**

4. **Document Figma Extraction**:
   - Create section in DOM inspection doc listing all Figma values
   - Map Figma design tokens to CSS properties
   - Note any viewport-specific variations

**Why This Is Mandatory**:
- Visual tests (@Visual tag) REQUIRE Figma specs to validate design compliance
- Typography/spacing validation depends on design system values
- Without Figma values, visual tests will be incomplete/incorrect
- Framework pattern: ALL component files import Figma values (see newsListComponent.ts example)

**If the Figma Extractor script fails**:
- Check `FIGMA_TOKEN` is set in `.env` (and the token is still valid / not expired)
- Verify the `fileKey` and viewport `nodeId` values are correct (node IDs from the Figma URL use `-`, convert to `:` e.g. `15415-827208` -> `15415:827208`)
- Ensure `npx tsx` can run (devDependencies installed)
- Fall back to manual Figma inspection and document values in comments

**Deliverable**: Figma values file created and imported in component BEFORE proceeding to Step 4.

---

Step 4: Based on the DOM understanding, Figma design specifications, and FE requirements from user story, generate the Functional, Accessibility, Performance, Visual test cases and get it reviewed from user without fail.

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
  1. Data attributes (data-qa, data-testId, dataTest)
  2. Semantic selectors (role, label, placeholder, title, altText)
  3. Content selectors (text with regex for flexibility)
  4. CSS/XPath (last resort fallback)
- **Always include meaningful description** for health monitoring
- **Use parent-child relationships** with data-qa/data-testId attributes

**SmartLocator Example Pattern** (Follow this structure):
```typescript
async getElement(): Promise<Locator> {
  return await this.findSmart({
    data-qa: 'submit-button',
    data-testId: 'submit-btn',
    role: { role: 'button', name: /submit/i },
    text: /submit/i,
    css: 'button.submit',
    description: 'Submit button'
  });
}
```

**Visual Validation**:
- To verify font color, font family, line height, color for an element, fetch the values from Figma using the `figma-extractor.ts` script (see Step 3.5) and use the consolidated `<ComponentName>_FigmaValues.ts` file; also understand the requirement by reviewing the Figma
- Figma URL: https://www.figma.com/design/fiKrYZCKNM1OqXHQoGwrlX/Bayer-Beyond-%E2%80%93-Dev-Handover?node-id=15415-827210&m=dev


  - XL: node-id=15415-827208
  - LG: node-id=15415-827433
  - MD: node-id=15415-827617
  - SM: node-id=15415-828109


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
playwright test [your-spec-file]

# Check selector health report (MANDATORY)
start reports\selector-health\selector-health.html

# Verify no traditional locators exist (should return 0 matches in your new code)
findstr /S /I "page.locator" components\YourComponent.ts
```

**SmartLocator Health Score Target**: Aim for >95% healthy selectors (green in health report)










---
name: playwright-smart-locators
description: MANDATORY locator conventions for all Playwright test/component code in this framework. Use whenever creating or editing locators, page-object methods, or element interactions. Enforces AI-powered SmartLocator methods (findSmart/clickSmart/fillSmart/getTextSmart/isVisibleSmart), data-qa-first DOM strategy, parent AND child element patterns, language-agnostic assertions, naming conventions, and locator debugging.
---

# SmartLocator & Locator Conventions

> Source: extracted verbatim from `playwright-prompt.md` (now backed up at `docs/ai-prompt-source/playwright-prompt.original.md`). See `.claude/skills/MANIFEST.md` for the section map.

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

> ⚠️ Note (added during split): the two docs referenced above do not currently exist in the repo. Reference preserved verbatim from the original prompt.

---

## Locator Guidelines - SmartLocator with DOM-First Approach

> For the DOM inspection process that MUST precede locator creation, see the **playwright-dom-inspection** skill.

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

---

## Why Use data-qa Attributes (Primary Choice)

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

---

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

---

## Locator Debugging (Updated for data-qa)

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

---

## Step 5 (Test Script Generation) — SmartLocator Implementation (MANDATORY)

> This is the locator-specific portion of the test-authoring process. The full process lives in the **playwright-test-authoring** skill.

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

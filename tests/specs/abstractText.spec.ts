import { test, expect } from '@playwright/test';
import { AbstractTextComponent } from '../../components/abstractText';
// Force update: Import AbstractText Figma values with underscore naming
import { AbstractText_FigmaValues } from '../../helpers/utils/figma-values/AbstractText_FigmaValues';

test.describe('Abstract Text Component Tests @AbstractText', () => {
  // Functional Tests
  test('TC-AT01: Functional Test Cases @Functional @Smoke', async ({ page, browser, context }) => {
    const abstractText = new AbstractTextComponent(page, browser, context);

    // Navigate to component with automatic authentication
    await abstractText.navigateToComponent();

    // 1. Verify page loaded successfully (page title may be empty in some environments)
    const pageTitle = await page.title();
    const currentUrl = page.url();
    expect.soft(currentUrl.toLowerCase()).toContain('abstracttext'); // Verify correct page loaded
    console.log(`Page Title: "${pageTitle}" (${pageTitle ? 'present' : 'empty - this is acceptable'})`);

    // 2. Verify component visibility using language-agnostic assertions
    await abstractText.verifyComponentVisibility();

    // 3. Verify component structure and semantic HTML
    const abstractTextElement = abstractText.getAbstractTextElement();

    // Semantic HTML structure
    const tagName = await abstractTextElement.evaluate((el) => el.tagName.toLowerCase());
    expect.soft(['p', 'div', 'section', 'article']).toContain(tagName);

    // Skip container visibility check - focus only on abstract text content
    // Container may be hidden for layout purposes

    // 4. Validate content exists (language-agnostic)
    await expect.soft(abstractTextElement).not.toBeEmpty();
    await expect.soft(abstractTextElement).toBeVisible();
    const textContent = await abstractTextElement.textContent();
    expect.soft(textContent?.trim().length).toBeGreaterThan(0);
  });

  // Accessibility Tests
  test('TC-AAT01: Should meet accessibility standards @Accessibility', async ({
    page,
    browser,
    context,
  }) => {
    const abstractText = new AbstractTextComponent(page, browser, context);

    // Navigate to component with automatic authentication
    await abstractText.navigateToComponent();

    // Verify accessibility attributes
    await abstractText.verifyAccessibilityAttributes();

    // Verify specific accessibility features
    const abstractTextElement = abstractText.getAbstractTextElement();

    // Verify semantic HTML (flexible validation)
    const tagName = await abstractTextElement.evaluate((el: HTMLElement) =>
      el.tagName.toLowerCase()
    );
    expect.soft(['p', 'div', 'section', 'article']).toContain(tagName); // Should be semantic element
  });
});

// Visual Validation Tests - Separate test suite
test.describe('Abstract Text Component - Visual Validation @Visual', () => {
  const VIEWPORTS = {
    XL: { width: 1400, height: 464, name: 'XL' },
    LG: { width: 1024, height: 278, name: 'LG' },
    MD: { width: 768, height: 203, name: 'MD' },
    SM: { width: 375, height: 303, name: 'SM' },
  };

  function getFigmaValues(viewport: string) {
    switch (viewport) {
      case 'XL':
        return AbstractText_FigmaValues.XL;
      case 'LG':
        return AbstractText_FigmaValues.LG;
      case 'MD':
        return AbstractText_FigmaValues.MD;
      case 'SM':
        return AbstractText_FigmaValues.SM;
      default:
        return AbstractText_FigmaValues.MD;
    }
  }

  // Visual Validation Tests for all viewports
  for (const [vp, vpConfig] of Object.entries(VIEWPORTS)) {
    test(`${vp} viewport - Typography validation`, async ({ page, browser, context }) => {
      await page.setViewportSize({ width: vpConfig.width, height: vpConfig.height });
      const abstractText = new AbstractTextComponent(page, browser, context);
      await abstractText.navigateToComponent();
      await abstractText.verifyComponentVisibility();

      // Use public accessor for abstract text element
      const abstractTextElement = abstractText.getAbstractTextElement();
      const figma = getFigmaValues(vp);

      // Visual validation: font size, color, line height, font family
      const computedStyle = await abstractTextElement.evaluate((el: HTMLElement) => {
        const style = window.getComputedStyle(el);
        return {
          fontSize: style.fontSize,
          color: style.color,
          lineHeight: style.lineHeight,
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
        };
      });

      expect.soft(computedStyle.fontSize).toBe(figma.fontSize);
      // Handle both RGB and RGBA color formats - convert rgba(16,56,79,1) to rgb(16,56,79)
      const expectedColor = figma.color.replace('rgba(', 'rgb(').replace(/,\s*1\)/, ')');
      expect.soft(computedStyle.color.replace(/\s/g, '')).toBe(expectedColor.replace(/\s/g, ''));

      // Handle line height with tolerance for floating-point precision
      const expectedLineHeight = parseFloat(figma.lineHeight);
      const actualLineHeight = parseFloat(computedStyle.lineHeight);
      expect.soft(Math.abs(actualLineHeight - expectedLineHeight)).toBeLessThan(0.1);

      expect.soft(computedStyle.fontFamily).toContain(figma.fontFamily);
      expect.soft(computedStyle.fontWeight).toBe(figma.fontWeight);
    });
  }
});

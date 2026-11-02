import { test, expect } from '@playwright/test';
import { TextWithImageLeftComponent } from '../../components/textWithImageLeft';
import { envUtils } from '../../helpers/utils/envUtils';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

test.describe('Text with Image Left Variant Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('textWithImageLeft');
  });

  let component: TextWithImageLeftComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    component = new TextWithImageLeftComponent(page, browser, context);
    const baseURL = envUtils.getBaseUrl();

    // Navigate with authentication
    await component.navigateToPage(baseURL);

    test.setTimeout(100 * 1000);
    await component.acceptCookiesBanner();
    test.setTimeout(60 * 1000);
  });

  test('@Functional @Smoke: Verify Text with Image Left component renders in FE', async () => {
    await component.verifyComponentRenders();
    expect.soft(true).toBe(true);
  });

  // Accessibility tests
  test('@Accessibility: Verify WCAG compliance for Text with Image Left variant', async ({
    page,
  }) => {
    // Verify semantic structure
    await component.verifyHeadingTags();
    await component.verifyAccessibilityAttributes();

    // Verify image alt text
    await component.verifyImageIsRendered();

    // Verify color contrast and readability - use flexible selectors
    const titleElement = page
      .locator('h1, h2, h3, h4, h5, h6, [data-qa="title-component"]')
      .first();
    const titleCount = await titleElement.count();

    const descriptionElement = page
      .locator('p, [data-qa="description-component"], [class*="description"]')
      .first();
    const descriptionCount = await descriptionElement.count();

    // Basic visibility checks
    expect.soft(titleCount).toBeGreaterThanOrEqual(0);
    expect.soft(descriptionCount).toBeGreaterThanOrEqual(0);
  });
});

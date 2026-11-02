import { allure } from 'allure-playwright';

/**
 * Component Mapper - Allure Page Context Helper
 * What:
 *   Applies Allure labels so results are grouped by page and component in
 *   page mode, while preserving standard component grouping in component mode.
 * Why:
 *   Created to make page-level execution reports readable and actionable during
 *   component triage and stakeholder reporting.
 *
 * Applies Allure metadata labels so test results are grouped correctly
 * in the Allure report depending on whether tests are running in:
 *
 *  - "component" mode (default) → reports as "Component Validation / <ComponentName>"
 *  - "page" mode               → reports as "<PageName> / <ComponentName>"
 *
 * Usage: call `applyAllurePageContext('AbstractText')` once per test,
 * typically inside `test.beforeEach` or at the top of each test block.
 *
 * Environment variables (injected by ComponentTestRunner in page mode):
 *   EXECUTION_MODE  = 'page' | 'component'
 *   PAGE_NAME       = e.g. 'Home Page'
 *   PAGE_URL        = e.g. 'https://bayer-beyond-qa-uk.vercel.app/'
 *   PAGE_COMPONENT  = data-qa value, e.g. 'abstract-text'
 */
export async function applyAllurePageContext(componentName: string): Promise<void> {
  const mode = process.env.EXECUTION_MODE || 'component';
  const pageName = process.env.PAGE_NAME;
  const pageUrl = process.env.PAGE_URL;

  if (mode === 'page' && pageName) {
    // Page-level grouping: parentSuite = page, suite = component
    await allure.parentSuite(pageName);
    await allure.suite(componentName);
    if (pageUrl) {
      await allure.description(`Page-level validation on: ${pageUrl}\nComponent: ${componentName}`);
      await allure.link(pageUrl, 'Page URL');
    }
  } else {
    // Standard component-level grouping (existing behaviour unchanged)
    await allure.parentSuite('Component Validation');
    await allure.suite(componentName);
  }
}

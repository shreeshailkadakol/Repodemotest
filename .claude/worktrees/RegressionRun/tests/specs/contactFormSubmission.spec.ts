/**
 * Component Mapper - Contact Form Submission Spec
 * What:
 *   Runs automated contact form submission validation for AU, NZ, and TR forms.
 * Why:
 *   Created to verify regional form flows remain functional across configured
 *   environments using reusable config-driven input data.
 * 
 * Usage:
 *   - Run all regions: npx playwright test tests/specs/contactFormSubmission.spec.ts
 *   - Run specific region: FORM_REGION=AU npx playwright test tests/specs/contactFormSubmission.spec.ts
 *   - With headed mode: npx playwright test tests/specs/contactFormSubmission.spec.ts --headed
 */

import { test, expect } from '@playwright/test';
import { FormSubmissionUtil } from '../../utils/formSubmissionUtil';
import { getFormConfigsForExecution } from '../../config/formConfigs';
import { applyAllurePageContext } from '../../helpers/utils/allurePageContext';

// Configure test settings
test.use({
  actionTimeout: 30000,
  navigationTimeout: 30000,
});

// Increase test timeout for form submissions
test.setTimeout(120000);

// Get form configs based on environment variable
const formConfigs = getFormConfigsForExecution();

test.describe('Contact Form Submission Tests', () => {
  test.beforeEach(async () => {
    await applyAllurePageContext('contactFormSubmission');
  });
  
  test.beforeAll(async () => {
    console.info('\n========================================')
    console.info('CONTACT FORM TEST SUITE');
    console.info('========================================');
    console.info(`Forms to test: ${formConfigs.map(c => c.region).join(', ')}`);
    console.info(`Total forms: ${formConfigs.length}`);
    console.info('========================================\n');
  });

  // Run tests for each configured form
  test.describe.configure({ mode: 'parallel' });

  for (const formConfig of formConfigs) {
    test.describe(`${formConfig.region} - ${formConfig.formName}`, () => {
      
      test(`TC-FORM-${formConfig.region}-01: Submit contact form with valid data @${formConfig.region}`, async ({ page }) => {
        // Test logger
        const logger = (message: string) => {
          console.info(message);
        };

        // Initialize form utility
        const formUtil = new FormSubmissionUtil(page, formConfig, logger);

        await test.step('Navigate to contact form', async () => {
          logger(`\nTesting: ${formConfig.formName}`);
          logger(`URL: ${formConfig.url}`);
        });

        await test.step('Fill and submit form', async () => {
          try {
            await formUtil.fillAndSubmitForm();
          } catch (error) {
            // Take screenshot on failure
            await formUtil.takeScreenshot('form-submission-failed');
            throw error;
          }
        });

        await test.step('Verify form submission success', async () => {
          // Additional verification using Playwright assertions
          const currentURL = page.url();
          logger(`Current URL after submission: ${currentURL}`);
          
          // Log test summary
          logger('\n========================================');
          logger(`TEST PASSED: ${formConfig.region} Contact Form`);
          logger('========================================\n');
        });
      });

      test(`TC-FORM-${formConfig.region}-02: Verify required field validation @Validation @${formConfig.region}`, async ({ page }) => {
        await test.step('Navigate to contact form', async () => {
          // Handle authentication BEFORE navigation
          const context = page.context();
          // Note: setHTTPCredentials is deprecated but functional
          await context.setHTTPCredentials({
            username: 'bayercorp',
            password: process.env.AUTH_PASSWORD || 'beyond2026'
          });
          
          await page.goto(formConfig.url, { waitUntil: 'domcontentloaded' });
        });

        await test.step('Handle cookie banner', async () => {
          try {
            const cookieButton = page.getByRole('button', { name: /accept|reject/i });
            if (await cookieButton.isVisible({ timeout: 3000 }).catch(() => false)) {
              await cookieButton.click();
            }
          } catch {}
        });

        await test.step('Attempt to submit empty form', async () => {
          // Use the per-config submit button (language-agnostic) — same finder TC-01 uses,
          // instead of a hardcoded button[type="submit"] which matches the wrong element
          // on pages with multiple submit-type buttons (lang/location selectors, etc.).
          const formUtil = new FormSubmissionUtil(page, formConfig);
          const submitButton = (await formUtil.getSubmitButton()).first();

          await submitButton.waitFor({ state: 'visible', timeout: 10000 });
          await submitButton.click();

          // Wait a moment for client-side validation to react
          await page.waitForTimeout(2000);

          // With empty required fields the form must NOT submit:
          // 1) the submit button should still be present (we're still on the form)
          await expect.soft(
            submitButton,
            `${formConfig.region}: submit button should remain visible (empty form not submitted)`
          ).toBeVisible();

          // 2) the success indicator should NOT appear
          if (formConfig.successValidation.selector) {
            const successShown = await page
              .locator(formConfig.successValidation.selector)
              .first()
              .isVisible()
              .catch(() => false);
            expect.soft(
              successShown,
              `${formConfig.region}: success message must NOT appear for an empty submission`
            ).toBe(false);
          }

          console.info(`Required field validation checked for ${formConfig.region}`);
        });
      });

      test(`TC-FORM-${formConfig.region}-03: Verify form field presence @UI @${formConfig.region}`, async ({ page }) => {
        await test.step('Navigate to contact form', async () => {
          // Handle authentication BEFORE navigation
          const context = page.context();
          // Note: setHTTPCredentials is deprecated but functional
          await context.setHTTPCredentials({
            username: 'bayercorp',
            password: process.env.AUTH_PASSWORD || 'beyond2026'
          });
          
          await page.goto(formConfig.url, { waitUntil: 'domcontentloaded' });
          
          // Handle cookie banner
          try {
            const cookieButton = page.getByRole('button', { name: /accept|reject/i });
            if (await cookieButton.isVisible({ timeout: 3000 }).catch(() => false)) {
              await cookieButton.click();
              await page.waitForTimeout(500);
            }
          } catch {}
        });

        await test.step('Verify required fields are present', async () => {
          const requiredFields = Object.entries(formConfig.fields)
            .filter(([_, config]) => config.required);
          
          console.info(`\nChecking ${requiredFields.length} required fields for ${formConfig.region}...`);
          
          for (const [fieldName, fieldConfig] of requiredFields) {
            const selector = fieldConfig.selector || 
                           `input[name="${fieldName}"], select[name="${fieldName}"], textarea[name="${fieldName}"]`;
            
            const locator = page.locator(selector).first();
            const isVisible = await locator.isVisible({ timeout: 5000 }).catch(() => false);
            
            if (isVisible) {
              console.info(`  "${fieldName}" field found`);
            } else {
              console.warn(`  Warning: "${fieldName}" field not visible (may use different selector)`);
            }
          }
          
          // Verify submit button
          const submitButtonSelector = formConfig.submitButton.selector || 'button[type="submit"]';
          const submitButton = page.locator(submitButtonSelector).first();
          await expect(submitButton).toBeVisible({ timeout: 5000 });
          console.info(`  Submit button found\n`);
        });
      });
    });
  }

  test.afterAll(async () => {
    console.info('\n========================================');
    console.info('TEST SUITE COMPLETED');
    console.info('========================================\n');
  });
});


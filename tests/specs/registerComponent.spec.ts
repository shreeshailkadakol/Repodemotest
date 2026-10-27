import { test, expect } from '@playwright/test';
import { RegisterComponent } from '../../components/registerComponent';

test.describe('Register Component Tests @Register', () => {
  let register: RegisterComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    register = new RegisterComponent(page, browser, context);
    await register.navigateToComponent();
  });

  test('TC-RG-01: registration form controls are available @Functional @Smoke', async () => {
    await expect.soft(await register.getRegistrationForm()).toBeVisible();
    await register.verifyFormAvailability();
  });

  test('TC-RG-02: registration fields use appropriate input types @Functional', async () => {
    await register.verifyFieldTypes();
  });

  test('TC-RG-03: invalid email is rejected by browser validity @Functional', async () => {
    await register.verifyInvalidEmailIsRejected('not-an-email');
  });

  test('TC-ARG-01: registration page passes axe accessibility scan @Accessibility', async () => {
    const results = await register.runAccessibilityScan(undefined, ['wcag2a', 'wcag2aa']);
    const violationDetails = results.violations.map(
      (violation: { id: string; nodes: Array<{ target: string[] }> }) => ({
        id: violation.id,
        targets: violation.nodes.flatMap((node) => node.target),
      })
    );
    expect.soft(violationDetails).toEqual([]);
    await expect.soft(await register.getFirstNameField()).toHaveAccessibleName(/first name/i);
    await expect.soft(await register.getLastNameField()).toHaveAccessibleName(/last name/i);
    await expect.soft(await register.getEmailField()).toHaveAccessibleName(/email address/i);
    await expect.soft(await register.getPasswordField()).toHaveAccessibleName(/password/i);
  });

  test('TC-RG-04: registration page loads within the smoke budget @Performance', async () => {
    const domContentLoadedTime = await register.getDomContentLoadedTime();
    expect.soft(domContentLoadedTime).toBeGreaterThan(0);
    expect.soft(domContentLoadedTime).toBeLessThan(15_000);
  });

  for (const viewport of [
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    test(`TC-RG-05: registration form fits ${viewport.name} viewport @Visual`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await register.verifyFormAvailability();
      expect.soft(await register.hasNoHorizontalOverflow()).toBe(true);
    });
  }
});

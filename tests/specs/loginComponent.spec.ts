import { test, expect } from '@playwright/test';
import { LoginComponent } from '../../components/loginComponent';

const PWD = LoginComponent.VALID_PASSWORD;

test.describe('Login Component Tests @Login', () => {
  let login: LoginComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    login = new LoginComponent(page, browser, context);
    await login.navigateToComponent();
  });

  test('TC-L01: AC8 UI availability @Functional @Smoke', async () => {
    await login.verifyUiAvailability();
  });

  test('TC-L02: AC1 successful login @Functional @Smoke', async ({ page }) => {
    await login.login('standard_user', PWD);
    await expect.soft(page).toHaveURL(/inventory\.html/);
    await expect.soft(await login.getInventoryList()).toBeVisible();
  });

  test('TC-L03: AC2 invalid username @Functional', async () => {
    await login.login('wrong_user', PWD);
    await login.verifyError(/do not match/i);
    await login.verifyOnLoginPage();
  });

  test('TC-L04: AC3 invalid password @Functional', async () => {
    await login.login('standard_user', 'wrong_pass');
    await login.verifyError(/do not match/i);
    await login.verifyOnLoginPage();
  });

  test('TC-L05: AC4 empty username @Functional', async () => {
    await login.login('', PWD);
    await login.verifyError(/Username is required/i);
    await login.verifyOnLoginPage();
  });

  test('TC-L06: AC5 empty password @Functional', async () => {
    await login.login('standard_user', '');
    await login.verifyError(/Password is required/i);
    await login.verifyOnLoginPage();
  });

  test('TC-L07: AC6 both fields empty @Functional', async () => {
    await login.login('', '');
    await login.verifyError(/Username is required/i);
    await login.verifyOnLoginPage();
  });

  test('TC-L08: AC7 locked out user @Functional', async () => {
    await login.login('locked_out_user', PWD);
    await login.verifyError(/locked out/i);
    await login.verifyOnLoginPage();
  });

  test('TC-AL01: Login form accessibility @Accessibility', async () => {
    await login.validateAccessibility();
  });
});

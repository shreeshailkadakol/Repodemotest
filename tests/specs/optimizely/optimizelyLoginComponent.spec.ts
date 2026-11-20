import { test, expect } from '@playwright/test';
import { OptimizelyLoginComponent } from '../../../components/optimizely/optimizelyLoginComponent';

test.describe('Optimizely CMS Admin Login @OptimizelyLogin', () => {
  // Local Optimizely instance (https://localhost:5000) uses a self-signed dev certificate;
  // WebKit-based projects reject it unless HTTPS errors are ignored. Scoped to this spec only.
  test.use({ ignoreHTTPSErrors: true });

  let login: OptimizelyLoginComponent;

  test.beforeEach(async ({ page, browser, context }) => {
    login = new OptimizelyLoginComponent(page, browser, context);
    await login.navigateToComponent();
  });

  test('TC-OL01: login form is visible and enabled @Functional @Smoke', async () => {
    await login.verifyUiAvailability();
  });

  test('TC-OL02: valid admin login opens the CMS @Functional @Smoke', async () => {
    const { username, password } = OptimizelyLoginComponent.credentials;
    await login.login(username, password);
    await login.verifyLoggedIn();
  });

  test('TC-OL03: invalid username is rejected @Functional', async () => {
    await login.login('invalid_user_x', OptimizelyLoginComponent.credentials.password);
    await login.verifyLoginFailed();
  });

  test('TC-OL04: invalid password is rejected @Functional', async () => {
    await login.login(OptimizelyLoginComponent.credentials.username, 'invalid_pass_x');
    await login.verifyLoginFailed();
  });

  test('TC-OL05: empty credentials are rejected @Functional', async () => {
    await login.login('', '');
    await login.verifyLoginFailed();
  });

  test('TC-OL06: password field is masked @Functional', async () => {
    await expect(await login.getPasswordField()).toHaveAttribute('type', 'password');
  });

  test('TC-OL07: Enter key submits the login @Functional', async () => {
    const { username, password } = OptimizelyLoginComponent.credentials;
    await (await login.getUsernameField()).fill(username);
    const passwordField = await login.getPasswordField();
    await passwordField.fill(password);
    await passwordField.press('Enter');
    await login.verifyLoggedIn();
  });

  test('TC-OL08: valid login succeeds after an invalid attempt @Functional', async () => {
    const { username, password } = OptimizelyLoginComponent.credentials;
    await login.login('invalid_user_x', 'invalid_pass_x');
    await login.verifyLoginFailed();
    await login.login(username, password);
    await login.verifyLoggedIn();
  });

  test('TC-OL09: unauthenticated access redirects to the login page @Functional', async ({ page }) => {
    await expect(page).toHaveURL(/\/Util\/Login/);
    expect(page.url()).toMatch(/returnurl=/i);
    await login.verifyOnLoginPage();
  });

  test('TC-OLA01: login form accessibility @Accessibility', async () => {
    // Known product limitation: Optimizely's built-in login page ships without a <title>
    // (document-title). Third-party page, not fixable by the project - all other WCAG A/AA rules still enforced.
    await login.validateAccessibility(undefined, ['document-title']);
  });
});

# Sauce Demo Login - Test Case Comparison and New Coverage

**Component:** Login  
**Test URL:** https://www.saucedemo.com/  
**Valid password:** `secret_sauce`  
**Automated spec:** `tests/specs/loginComponent.spec.ts`

## Existing Coverage Comparison

The prior requirements define AC1-AC8. These cases already exist in the automated login spec, so they are retained rather than duplicated.

| Existing case | Existing coverage | Automated case | Result |
|---|---|---|---|
| Successful login | `standard_user` reaches `/inventory.html` and sees products | TC-L02 | Covered |
| Invalid username | Error is shown; user remains on login page | TC-L03 | Covered |
| Invalid password | Error is shown; login is denied | TC-L04 | Covered |
| Empty username | Username-required error is shown | TC-L05 | Covered |
| Empty password | Password-required error is shown | TC-L06 | Covered |
| Both fields empty | Username-required validation is shown; login is denied | TC-L07 | Covered |
| Locked-out user | Locked-out error is shown; user remains on login page | TC-L08 | Covered |
| Login form availability | Username, password, and login controls are visible and enabled | TC-L01 | Covered |
| Login form accessibility | Accessibility checks run against the login page | TC-AL01 | Covered |

## Generated New Test Cases

These cases extend the existing baseline with user-type coverage and common login interactions. Each test starts on the login page with a fresh browser context.

### TC-L09: Remaining standard Sauce Demo users can log in

**Priority:** High  
**Type:** Functional  
**Test data:** `problem_user`, `performance_glitch_user`, `error_user`, and `visual_user`; password `secret_sauce`

**Steps:**
1. Navigate to the login page.
2. Enter one of the listed usernames and the valid password.
3. Submit the login form.
4. Repeat for each listed username in an isolated test run.

**Expected results:**
- The user is redirected to `/inventory.html`.
- The inventory product list is visible.

### TC-L10: Submit login with Enter

**Priority:** Medium  
**Type:** Functional / Keyboard

**Steps:**
1. Navigate to the login page.
2. Enter `standard_user` and `secret_sauce`.
3. Focus the password field and press Enter.

**Expected results:**
- The form submits without requiring a click on Login.
- The user reaches `/inventory.html` and sees the product list.

### TC-L11: Password is masked

**Priority:** Medium  
**Type:** Functional / Security

**Steps:**
1. Navigate to the login page.
2. Inspect the password field's input type.

**Expected results:**
- The password field has `type="password"`, so typed credentials are masked by the browser.

### TC-L12: Recover from an invalid login attempt

**Priority:** Medium  
**Type:** Functional / Recovery

**Steps:**
1. Navigate to the login page.
2. Submit `standard_user` with an incorrect password.
3. Confirm the invalid-credentials error is visible.
4. Replace the credentials with `standard_user` and `secret_sauce`, then submit again.

**Expected results:**
- The initial attempt is rejected and displays an error.
- The corrected attempt succeeds, reaches `/inventory.html`, and displays the product list.

## Coverage Summary

The original suite covers all documented acceptance criteria and the login page accessibility check. The generated cases add coverage for four additional supplied accounts, keyboard submission, password masking, and recovery after a rejected attempt. All listed cases are automated in `tests/specs/loginComponent.spec.ts`.

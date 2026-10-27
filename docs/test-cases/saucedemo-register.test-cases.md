# Sauce Demo Register - Test Cases

**Component:** Register  
**Test URL:** https://sauce-demo.myshopify.com/account/register  
**Automated spec:** `tests/specs/registerComponent.spec.ts`  
**DOM inspection:** October 26, 2026

## Live DOM Findings

The live registration page currently renders a Shopify customer form with four visible inputs and a Create submit control:

| Field | Observed element | Observed type |
|---|---|---|
| First Name | `input[name="customer[first_name]"]` | `text` |
| Last Name | `input[name="customer[last_name]"]` | `text` |
| Email Address | `input[name="customer[email]"]` | `email` |
| Password | `input[name="customer[password]"]` | `password` |
| Create | `input[type="submit"][value="Create"]` | `submit` |

Form: `form#create_customer`, `method="post"`, `action="/account"`.

There is no confirmation-password input. The visible field names are rendered as adjacent text rather than associated `<label>` elements. There are no `data-qa`, `data-testid`, or `data-test` attributes on the form controls. The input IDs are duplicated on their surrounding `div` elements, so locators are scoped to the form and use the observed `name` attributes. The page's sign-up request reports `sign_up_enabled=false`; a blank Create attempt did not navigate or display required-field feedback, and the page can invoke hCaptcha.

## Acceptance Criteria Coverage

| AC | Requirement | Coverage | Status |
|---|---|---|---|
| AC1 | Successful registration and account page/success state | Requires registration to be enabled and an isolated test-account strategy | Blocked |
| AC2 | Required-field validation | Live form has no `required` attributes and blank submit showed no validation message | Gap observed; not automated as passing behavior |
| AC3 | Invalid email format | Browser email-field type validation is automated without submitting | Implemented |
| AC4 | Duplicate email validation | Registration is disabled; a known existing account is not provided | Blocked |
| AC5 | Password confirmation mismatch | Live form has no confirmation field | Not applicable to current DOM; requirement mismatch |
| AC6 | Password security rules | Rules are not specified and registration is disabled | Blocked |
| AC7 | Trim leading/trailing spaces | Requires a successful account submission to verify stored data | Blocked |
| AC8 | Prevent duplicate submission | Requires an enabled account-creation request to observe | Blocked |
| AC9 | Server-error message and retry | No controllable server-error mechanism is available | Blocked |
| AC10 | Keyboard and screen-reader accessibility | Axe scan is automated; current field labels are not programmatically associated | Implemented, findings may expose defects |

## Automated Test Cases

### TC-RG-01: Registration form controls are available

**Priority:** High  
**Type:** Functional  
**Tag:** `@Functional`

**Steps:**
1. Open the registration URL.
2. Verify the Create Account heading, four expected inputs, and Create control are visible and enabled.

**Expected results:** The registration form and all observed controls are visible and enabled.

### TC-RG-02: Field types protect and validate input

**Priority:** High  
**Type:** Functional  
**Tag:** `@Functional`

**Steps:**
1. Open the registration URL.
2. Verify First Name and Last Name are text inputs, Email Address is an email input, and Password is a password input.

**Expected results:** The observed input types match the field purposes; the password input masks its value.

### TC-RG-03: Invalid email is rejected by browser validity

**Priority:** High  
**Type:** Functional / Negative  
**Test data:** `not-an-email`

**Steps:**
1. Open the registration URL.
2. Enter `not-an-email` into Email Address.
3. Check the email input's native validity state without submitting the form.

**Expected results:** `typeMismatch` is true and the input is invalid. The test does not attempt account creation.

### TC-RG-04: Form remains usable at desktop and mobile widths

**Priority:** Medium  
**Type:** Visual / Responsive  
**Viewports:** 1280x720 and 390x844

**Steps:**
1. Open the registration URL at each viewport.
2. Verify the heading, inputs, and Create control remain visible.
3. Check that the document does not overflow horizontally.

**Expected results:** All form controls remain visible and the page fits the viewport width. This is a responsive smoke check, not a Figma comparison; no registration-page design file was supplied.

### TC-RG-05: Registration page DOM content loads within the test budget

**Priority:** Medium  
**Type:** Performance  
**Budget:** 15 seconds to `DOMContentLoaded` in the configured test environment

**Steps:**
1. Open the registration URL.
2. Read the navigation timing entry for `DOMContentLoaded`.

**Expected results:** The timing entry is present and is below the documented 15-second smoke-test budget. This is not a production performance SLA.

### TC-ARG-01: Registration page accessibility scan

**Priority:** High  
**Type:** Accessibility  
**Tag:** `@Accessibility`

**Steps:**
1. Open the registration URL.
2. Run the repository axe-core scan for WCAG 2.0 A/AA rules.

**Expected results:** No unapproved accessibility violations are reported, and each input has an accessible name. The current page fails this check: the four inputs have empty accessible names, axe reports `color-contrast` on `.active` and `.legals`, `link-name` on `.facebook`, `.twitter`, `.instagram`, `.pinterest`, and `.rss`, and `meta-viewport` on `meta[name="viewport"]`. These findings remain visible in the automated test.

## Not Automated Yet

AC1, AC4, AC6, AC7, AC8, and AC9 need an enabled registration backend plus disposable test accounts or a controlled failure mechanism. AC2 is currently not met by the live form. AC5 conflicts with the live DOM because no confirmation field exists. Revisit these cases when the Shopify account configuration and current requirements are clarified.

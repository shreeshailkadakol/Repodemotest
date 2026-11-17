# Optimizely CMS Admin Login - Test Cases

**Component:** Optimizely CMS admin login (frontend-only)
**Test URL:** https://localhost:5000/optimizely/cms (redirects to `/Util/Login`)
**Credentials:** `OPTIMIZELY_CMS_USERNAME` / `OPTIMIZELY_CMS_PASSWORD` from `.env` (never committed)
**User story:** none provided; Figma/visual tests not applicable
**Automated spec:** `tests/specs/optimizely/optimizelyLoginComponent.spec.ts`
**DOM report:** `docs/optimizely/dom-inspection-optimizely-cms-login.md`

| ID | Case | Expected | Tags |
|---|---|---|---|
| TC-OL01 | Open login page | Username, password, submit visible and enabled | Functional, Smoke |
| TC-OL02 | Login with valid admin credentials | URL is `/optimizely/cms...`, CMS navigation visible | Functional, Smoke |
| TC-OL03 | Invalid username, valid password | Error shown, stays on `/Util/Login` | Functional |
| TC-OL04 | Valid username, invalid password | Error shown, stays on `/Util/Login` | Functional |
| TC-OL05 | Submit with empty fields | Error shown, stays on `/Util/Login` | Functional |
| TC-OL06 | Inspect password field | `type="password"` | Functional |
| TC-OL07 | Submit via Enter key | Login succeeds | Functional |
| TC-OL08 | Invalid login then valid login | Second attempt succeeds | Functional |
| TC-OL09 | Open `/optimizely/cms` unauthenticated | Redirect to `/Util/Login?ReturnUrl=...` | Functional |
| TC-OLA01 | Accessibility scan of login form | No unallowed axe violations | Accessibility |

# DOM Inspection Report - Optimizely CMS Admin Login

**Test Page**: https://localhost:5000/optimizely/cms (unauthenticated requests redirect to `/Util/Login?ReturnUrl=%2Foptimizely%2Fcms`)
**User Story**: none provided
**Inspection Date**: 2026-11-11
**Elements with data-qa/data-testid**: 0 — the page is server-rendered ASP.NET MVC with no test attributes. Locators fall back to stable `id`/`name`.

## Login form
```html
<form>
  <label for="UserName">Name</label>
  <input id="UserName" name="UserName" type="text" autocomplete="off" />
  <label for="Password">Password</label>
  <input id="Password" name="Password" type="password" autocomplete="off" />
  <input id="Submit" name="Submit" type="submit" class="epi-button-child-item" />
  <a>When you log in, cookies will be used.</a>
  <input type="hidden" name="ReturnUrl" />
  <input type="hidden" name="__RequestVerificationToken" />
</form>
```

## Failed login (URL stays on `/Util/Login?returnUrl=/optimizely/cms`)
```html
<div class="js-login-wrapper login-wrapper img1" id="LoginControl">
  ... <ol class="clearfix"><li><div class="text--error">Login failed</div></li></ol>
</div>
```

## Successful login
- URL: `https://localhost:5000/optimizely/cms#context=epi.cms.contentdata:///6`
- Title: `Optimizely CMS - Edit`
- Landmarks: `#epi-navigation-root` (header `.epi-pn-navigation`), `.epi-side-bar-navigation`

## Notes
- Error text and labels are English-only and server-rendered; use the `.text--error` structure rather than exact text where possible.
- Credentials come from `OPTIMIZELY_CMS_USERNAME` / `OPTIMIZELY_CMS_PASSWORD` (never hardcoded).

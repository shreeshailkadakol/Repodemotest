# Analytics Validation Test Cases (US 2194)

## Overview
This document contains test cases for the Marketing Data Implementation (US 2194) based on the implemented tests in analyticsValidation.spec.ts.

## Component Structure
The Analytics Validation tests verify the dataLayer implementation for marketing analytics:
1. **page_referring_url** — captures referring URL without protocol/www, including query params
2. **internal_source** — captures on-site navigation source (Entry, Header Navigation, Footer Navigation, Content Link)
3. **visitor_type** — differentiates internal vs external traffic
4. **Consent gating** — no tracking before cookie consent (AC1)
5. **Initialization timing** — dataLayer initializes before pageview fires (AC2)
6. **Data format** — lowercase underscore naming, string values

## Acceptance Criteria Reference
- **AC1:** No writes to the Data Layer or Events for Google Analytics will fire for site visitors who have not given consent for the relevant cookie category covering tracking.
- **AC2:** Writes to the Data Layer will only be made after the Data Layer has finished initializing.
- **AC3:** The Page Referring URL will be captured as plain text without protocol or 'www.', including query string parameters where available.
- **AC4:** Where no Page Referring URL can be determined, the parameter will be empty/blank.

## Test Environment
- **URL:** https://bayer-beyond-staging-uk.vercel.app/en-gb/
- **Environment:** STG (set via `TEST_ENV=stg`)
- **Authentication:** HTTP Basic Auth (bayercorp / beyond2025)

---

## Functional Tests — Data Capture

### TC-MD01: Direct entry — page_referring_url is empty (AC4)
**Priority:** High  
**Type:** Functional  
**Acceptance Criteria:** AC4  
**Status:** FAIL (BUG)

**Description:**  
Verify that when a user enters the site directly (no referrer), the `page_referring_url` parameter in the dataLayer is empty/blank.

**Prerequisites:**
- STG environment is accessible
- No referrer is set (direct navigation)

**Test Steps:**
1. Navigate directly to the homepage (no referrer)
2. Accept the cookie consent banner
3. Wait for network idle
4. Retrieve the latest `pageview` entry from `window.dataLayer`
5. Check that `page_referring_url` property exists
6. Verify the value is empty/blank (empty string or whitespace-only)

**Expected Results:**
- A `pageview` entry exists in the dataLayer
- `page_referring_url` property is present
- Value is empty/blank (per AC4)

**Actual Results:**
- `page_referring_url = "Not Applicable"` — this is NOT empty/blank as AC4 requires

**Screenshot:** `screenshots/TC-MD01-direct-entry.png`

---

### TC-MD02: Direct entry — internal_source is Entry
**Priority:** High  
**Type:** Functional  
**Status:** PASS

**Description:**  
Verify that when a user enters the site directly, `internal_source` is set to `"Entry"`.

**Prerequisites:**
- STG environment is accessible

**Test Steps:**
1. Navigate directly to the homepage
2. Accept cookie consent
3. Retrieve the latest `pageview` entry from dataLayer
4. Check the value of `internal_source`

**Expected Results:**
- `internal_source` equals `"Entry"`

**Screenshot:** `screenshots/TC-MD02-internal-source.png`

---

### TC-MD03: visitor_type differentiates internal/external traffic
**Priority:** High  
**Type:** Functional  
**Status:** PASS

**Description:**  
Verify that `visitor_type` correctly differentiates between internal and external traffic.

**Prerequisites:**
- STG environment is accessible

**Test Steps:**
1. Navigate directly to the homepage
2. Accept cookie consent
3. Retrieve the latest `pageview` entry from dataLayer
4. Check that `visitor_type` is one of the valid values: `"Internal"`, `"External"`, `"internal"`, `"external"`

**Expected Results:**
- `visitor_type` contains a valid value distinguishing internal from external traffic

**Screenshot:** `screenshots/TC-MD03-visitor-type.png`

---

### TC-MD04: page_referring_url pushed with every page view
**Priority:** High  
**Type:** Functional  
**Acceptance Criteria:** AC3  
**Status:** PASS

**Description:**  
Verify that `page_referring_url` is pushed to the dataLayer with every page view across multiple navigations.

**Prerequisites:**
- STG environment is accessible
- Header navigation links are functional

**Test Steps:**
1. Navigate directly to the homepage and accept cookie consent
2. Verify `pageview` entry exists with `page_referring_url` property
3. Record `page_path` value for homepage
4. Click "About Us" link via header navigation
5. Verify new `pageview` entry exists with `page_referring_url` property
6. Verify `page_path` has changed and contains "about"
7. Click "Sustainability" content link on the About Us page
8. Verify new `pageview` entry exists with `page_referring_url` property
9. Verify `page_path` has changed and contains "sustain"

**Expected Results:**
- Each page navigation produces a new `pageview` entry
- Every entry includes `page_referring_url`
- `page_path` updates correctly per page

**Screenshot:** `screenshots/TC-MD04-every-pageview.png`

---

### TC-MD05: External referrer — page_referring_url includes external domain
**Priority:** High  
**Type:** Functional  
**Acceptance Criteria:** AC3  
**Status:** PASS

**Description:**  
Verify that when a user navigates from an external website (Google), the `page_referring_url` captures the external domain.

**Prerequisites:**
- STG environment is accessible

**Test Steps:**
1. Set the HTTP Referer header to `https://www.google.com/search?q=bayer+uk`
2. Navigate to the homepage
3. Accept cookie consent
4. Retrieve the latest `pageview` entry from dataLayer
5. Check that `page_referring_url` contains `"google.com"`

**Expected Results:**
- `page_referring_url` includes the external domain `google.com`

**Screenshot:** `screenshots/TC-MD05-external-referrer.png`

---

### TC-MD06: page_referring_url excludes protocol and www (AC3)
**Priority:** High  
**Type:** Functional  
**Acceptance Criteria:** AC3  
**Status:** PASS

**Description:**  
Verify that `page_referring_url` strips protocol (`https://`, `http://`) and `www.` prefix per AC3.

**Prerequisites:**
- STG environment is accessible

**Test Steps:**
1. Set the HTTP Referer header to `https://www.google.com/search?q=bayer+news`
2. Navigate to the homepage and accept cookie consent
3. Retrieve the latest `pageview` entry from dataLayer
4. Verify `page_referring_url` is not empty and not `"Not Applicable"`
5. Verify value does NOT contain `"https://"` or `"http://"`
6. Verify value does NOT start with `"www."`

**Expected Results:**
- `page_referring_url` is populated (not empty)
- No protocol prefix (`https://`, `http://`)
- No `www.` prefix

**Screenshot:** `screenshots/TC-MD06-no-protocol-www.png`

---

### TC-MD07: External referrer includes query parameters
**Priority:** High  
**Type:** Functional  
**Acceptance Criteria:** AC3  
**Status:** PASS

**Description:**  
Verify that `page_referring_url` includes query string parameters from the referring URL per AC3.

**Prerequisites:**
- STG environment is accessible

**Test Steps:**
1. Set the HTTP Referer header to `https://www.google.com/search?q=bayer+news&source=web`
2. Navigate to the homepage and accept cookie consent
3. Retrieve the latest `pageview` entry from dataLayer
4. Verify `page_referring_url` is not empty and not `"Not Applicable"`
5. Verify value contains `"?"` (query string marker)
6. Verify value contains `"q="` (query parameter)

**Expected Results:**
- `page_referring_url` includes the query string parameters from the referrer

**Screenshot:** `screenshots/TC-MD07-query-params.png`

---

### TC-MD08: Internal navigation — page_referring_url captures internal path
**Priority:** High  
**Type:** Functional  
**Acceptance Criteria:** AC3  
**Status:** PASS

**Description:**  
Verify that when a user navigates internally (via link click), the `page_referring_url` captures the previous page's internal path.

**Prerequisites:**
- STG environment is accessible
- Header navigation links are functional

**Test Steps:**
1. Navigate directly to the homepage and accept cookie consent
2. Click "About Us" link via header navigation (real link click, not page.goto)
3. Retrieve the latest `pageview` entry from dataLayer
4. Verify `page_referring_url` is not empty (length > 0)
5. Verify value is NOT `"Not Applicable"` or blank

**Expected Results:**
- `page_referring_url` captures the homepage path as the internal referrer
- Value is not empty or `"Not Applicable"`

**Screenshot:** `screenshots/TC-MD08-internal-nav.png`

---

## Functional Tests — Data Format

### TC-MD09: Variable naming follows lowercase underscore convention
**Priority:** Medium  
**Type:** Data Format  
**Status:** PASS

**Description:**  
Verify that all dataLayer variable names follow the lowercase underscore-separated naming convention.

**Prerequisites:**
- STG environment is accessible

**Test Steps:**
1. Navigate to the homepage and accept cookie consent
2. Retrieve the latest `pageview` entry from dataLayer
3. Verify the following variables exist: `page_referring_url`, `internal_source`, `visitor_type`, `page_path`, `page_title`, `page_name`, `page_type`

**Expected Results:**
- All required variables are present in the `pageview` entry
- All variable names follow `lowercase_underscore` convention

**Screenshot:** `screenshots/TC-MD09-naming-convention.png`

---

### TC-MD10: All captured values are strings in plain text format
**Priority:** Medium  
**Type:** Data Format  
**Status:** PASS

**Description:**  
Verify that all captured dataLayer values are strings in plain text format.

**Prerequisites:**
- STG environment is accessible

**Test Steps:**
1. Navigate to the homepage and accept cookie consent
2. Retrieve the latest `pageview` entry from dataLayer
3. For each variable (`page_referring_url`, `internal_source`, `visitor_type`, `page_path`, `page_name`):
   - Verify the property exists in the entry
   - Verify the value type is `"string"` using `typeof`

**Expected Results:**
- All checked variables exist and their values are of type `string`

**Screenshot:** `screenshots/TC-MD10-string-format.png`

---

## Functional Tests — Triggering and Timing

### TC-MD11: DataLayer initializes before pageview event fires (AC2)
**Priority:** High  
**Type:** Functional  
**Acceptance Criteria:** AC2  
**Status:** PASS

**Description:**  
Verify that the dataLayer is initialized (gtm.js event) before the pageview event fires.

**Prerequisites:**
- STG environment is accessible

**Test Steps:**
1. Navigate to the homepage and accept cookie consent
2. Retrieve all events from dataLayer in order
3. Find the index of the `gtm.js` event
4. Find the index of the `pageview` event
5. Verify `gtm.js` index is >= 0 (exists)
6. Verify `pageview` index is >= 0 (exists)
7. Verify `gtm.js` index is less than `pageview` index

**Expected Results:**
- Both `gtm.js` and `pageview` events exist in the dataLayer
- `gtm.js` fires before `pageview` (lower array index)

**Screenshot:** `screenshots/TC-MD11-init-order.png`

---

### TC-MD12: Consent gating — no GTM/pageview before cookie consent (AC1)
**Priority:** Critical  
**Type:** Functional  
**Acceptance Criteria:** AC1  
**Status:** FAIL (BUG)

**Description:**  
Verify that no dataLayer writes or Google Analytics events fire before the user gives cookie consent.

**Prerequisites:**
- STG environment is accessible
- Cookie consent banner must NOT be accepted during this test

**Test Steps:**
1. Navigate to the homepage WITHOUT accepting cookies
2. Wait 5 seconds for page to fully load
3. Retrieve all events from dataLayer
4. Check if `pageview` event fired
5. Check if `gtm.js` event fired
6. Check if any `pageview` entry with marketing variables exists
7. Check consent groups — only `C0001` (strictly necessary) should be present

**Expected Results:**
- NO `pageview` event fires before consent
- NO `gtm.js` event fires before consent
- NO marketing data variables are pushed to dataLayer before consent
- Only `C0001` consent group is active (no `C0002`, `C0003`, `C0004`)

**Actual Results:**
- `pageview` event fires before cookie consent (BUG)
- `gtm.js` event fires before cookie consent (BUG)
- Full marketing data variables pushed to dataLayer before consent (BUG)

**Screenshot:** `screenshots/TC-MD12-consent-gating.png`

---

## Functional Tests — Navigation Flow

### TC-MD13: Multi-page navigation updates dataLayer per page
**Priority:** High  
**Type:** Functional  
**Acceptance Criteria:** AC3  
**Status:** PASS

**Description:**  
Verify that the dataLayer updates correctly across a multi-page navigation flow using real link clicks.

**Prerequisites:**
- STG environment is accessible
- Header navigation and content links are functional

**Test Steps:**
1. Navigate to the homepage and accept cookie consent
2. Verify `pageview` entry has `page_referring_url`, `page_path`
3. Record `page_path` (e.g., `/en-gb`)
4. Click "About Us" via header navigation
5. Verify new `pageview` entry has `page_referring_url`, `internal_source`, `visitor_type`, `page_path`
6. Verify `page_path` changed from homepage
7. Verify `page_referring_url` is NOT `"Not Applicable"` (internal referrer captured)
8. Click "Sustainability" content link on About Us page
9. Verify new `pageview` entry has `page_path` different from About Us
10. Verify `page_referring_url` is NOT `"Not Applicable"` (About Us path captured)

**Expected Results:**
- Each navigation produces a fresh `pageview` entry
- `page_path` updates per page
- `page_referring_url` captures the previous page path on internal navigation

**Screenshot:** `screenshots/TC-MD13-multi-page-nav.png`

---

### TC-MD14: LinkedIn referrer — page_referring_url includes linkedin.com
**Priority:** Medium  
**Type:** Functional  
**Acceptance Criteria:** AC3  
**Status:** PASS

**Description:**  
Verify that navigation from LinkedIn correctly captures the referrer in `page_referring_url`.

**Prerequisites:**
- STG environment is accessible

**Test Steps:**
1. Set the HTTP Referer header to `https://www.linkedin.com/feed/`
2. Navigate to the homepage and accept cookie consent
3. Retrieve the latest `pageview` entry from dataLayer
4. Verify `page_referring_url` contains `"linkedin.com"`
5. Verify `page_referring_url` does NOT contain `"https://"`

**Expected Results:**
- `page_referring_url` includes `linkedin.com`
- Protocol is stripped (no `https://`)

**Screenshot:** `screenshots/TC-MD14-linkedin-referrer.png`

---

## Functional Tests — Navigation Source Tracking

### TC-MD15: Header navigation sets internal_source to Header Navigation
**Priority:** High  
**Type:** Functional  
**Status:** PASS

**Description:**  
Verify that navigating via the header navigation menu sets `internal_source` to `"Header Navigation"`.

**Prerequisites:**
- STG environment is accessible
- Header navigation links are functional

**Test Steps:**
1. Navigate to the homepage and accept cookie consent
2. Click "About Us" link via header navigation (`nav[aria-label="Primary navigation"]`)
3. Retrieve the latest `pageview` entry from dataLayer
4. Verify `internal_source` equals `"Header Navigation"`
5. Verify `page_referring_url` is not empty and not `"Not Applicable"`

**Expected Results:**
- `internal_source = "Header Navigation"`
- `page_referring_url` captures the homepage path

**Screenshot:** `screenshots/TC-MD15-header-nav-source.png`

---

### TC-MD16: Footer navigation sets internal_source correctly
**Priority:** High  
**Type:** Functional  
**Status:** PASS

**Description:**  
Verify that navigating via footer navigation links sets `internal_source` to a value other than `"Entry"`.

**Prerequisites:**
- STG environment is accessible
- Footer navigation links are functional

**Test Steps:**
1. Navigate to the homepage and accept cookie consent
2. Scroll down and click "Sustainability" link via footer navigation (`nav[aria-label="Secondary footer navigation"]`)
3. Retrieve the latest `pageview` entry from dataLayer
4. Verify `internal_source` is not empty
5. Verify `internal_source` is NOT `"Entry"` (should reflect footer navigation source)
6. Verify `page_referring_url` is not empty and not `"Not Applicable"`

**Expected Results:**
- `internal_source` is populated and not `"Entry"`
- `page_referring_url` captures the homepage path

**Screenshot:** `screenshots/TC-MD16-footer-nav-source.png`

---

### TC-MD17: Content link sets internal_source correctly
**Priority:** High  
**Type:** Functional  
**Status:** PASS

**Description:**  
Verify that clicking a content link (teaser card) on a page sets `internal_source` correctly.

**Prerequisites:**
- STG environment is accessible
- About Us page has content links (e.g., Sustainability teaser)

**Test Steps:**
1. Navigate to the homepage and accept cookie consent
2. Click "About Us" via header navigation
3. Click "Sustainability" content link on the About Us page body
4. Retrieve the latest `pageview` entry from dataLayer
5. Verify `internal_source` is not empty
6. Verify `page_referring_url` is not empty, not `"Not Applicable"`, and contains `"about"` (previous page)

**Expected Results:**
- `internal_source` is populated (reflects content link source)
- `page_referring_url` captures the About Us page path

**Screenshot:** `screenshots/TC-MD17-content-link-source.png`

---

## Functional Tests — UTM Fallback

### TC-MD18: UTM fallback — page_referring_url populated from UTM params when no referrer
**Priority:** High  
**Type:** Functional  
**Acceptance Criteria:** AC3  
**Status:** PASS

**Description:**  
Verify that when a user arrives at the site via a URL with UTM parameters (e.g., paid Google ad) but no browser referrer header is available, the `page_referring_url` falls back to populating from the UTM variables. The requirement states: "Where this cannot be retrieved directly from the URL, it should also be attempted to retrieve from the UTM variables."

**Prerequisites:**
- STG environment is accessible
- No referrer header is set (simulates referrer-stripped paid ad click)

**Test Steps:**
1. Navigate to the homepage with UTM query parameters appended: `?utm_source=google&utm_medium=cpc&utm_campaign=brand_uk&utm_content=ad_variation_1`
2. Ensure NO HTTP Referer header is sent (browser referrer is unavailable)
3. Accept cookie consent
4. Retrieve the latest `pageview` entry from `window.dataLayer`
5. Check the value of `page_referring_url`
6. Verify the value is NOT empty and NOT `"Not Applicable"` — it should be populated from UTM data
7. Verify the value contains UTM-derived information (e.g., `google` from `utm_source`)
8. Optionally check if `utm_source`, `utm_medium`, `utm_campaign` are captured in the dataLayer entry

**Expected Results:**
- `page_referring_url` is populated from UTM variables when no referrer header exists
- The value reflects the UTM source (e.g., contains `google` or `cpc`)
- UTM parameters from the URL are processed and available in the dataLayer

**Actual Results:**
- `page_referring_url = "google/cpc?campaign=brand_uk"` — UTM fallback is working correctly
- Value is constructed from `utm_source/utm_medium?campaign=utm_campaign`
- Note: Individual UTM variables (`utm_source`, `utm_medium`, `utm_campaign`) are not stored as separate dataLayer properties

**Screenshot:** `screenshots/TC-MD18-utm-fallback.png`

---

## Test Execution Summary

| TC ID | Test Name | AC | Status |
|-------|-----------|-----|--------|
| TC-MD01 | Direct entry — page_referring_url is empty | AC4 | **FAIL** |
| TC-MD02 | Direct entry — internal_source is Entry | — | PASS |
| TC-MD03 | visitor_type differentiates traffic | — | PASS |
| TC-MD04 | page_referring_url on every page view | AC3 | PASS |
| TC-MD05 | External referrer includes domain | AC3 | PASS |
| TC-MD06 | Excludes protocol and www | AC3 | PASS |
| TC-MD07 | Includes query parameters | AC3 | PASS |
| TC-MD08 | Internal nav captures referrer | AC3 | PASS |
| TC-MD09 | Lowercase underscore naming | — | PASS |
| TC-MD10 | Values are strings | — | PASS |
| TC-MD11 | DataLayer init before pageview | AC2 | PASS |
| TC-MD12 | Consent gating — no tracking before consent | AC1 | **FAIL** |
| TC-MD13 | Multi-page nav updates dataLayer | AC3 | PASS |
| TC-MD14 | LinkedIn referrer captured | AC3 | PASS |
| TC-MD15 | Header nav — internal_source | — | PASS |
| TC-MD16 | Footer nav — internal_source | — | PASS |
| TC-MD17 | Content link — internal_source | — | PASS |
| TC-MD18 | UTM fallback — page_referring_url from UTM params | AC3 | PASS |

**Total: 18 tests | 16 Passed | 2 Failed (Application Bugs)**

## Bugs Found

### BUG-1: AC4 — page_referring_url shows "Not Applicable" instead of empty (TC-MD01)
- **Severity:** Medium
- **AC Violated:** AC4
- **Expected:** `page_referring_url` should be empty/blank when no referrer is available
- **Actual:** `page_referring_url = "Not Applicable"`
- **Reproduced on:** STG, QA

### BUG-2: AC1 — GTM and pageview fire before cookie consent (TC-MD12)
- **Severity:** High
- **AC Violated:** AC1
- **Expected:** No dataLayer writes or GA events before cookie consent
- **Actual:** `gtm.js` and `pageview` events fire immediately on page load before consent. Full marketing variables (`page_referring_url`, `internal_source`, `visitor_type`, etc.) are pushed to dataLayer.
- **Reproduced on:** STG, QA

## Test Execution Notes
- **Run command:** `$env:TEST_ENV='stg'; npx playwright test tests/specs/analyticsValidation.spec.ts --project=chromium --reporter=list --timeout=120000`
- All navigation tests use real link clicks (header nav, footer nav, content links) — **not** `page.goto()` — to accurately simulate user behavior and preserve referrer data.
- External referrer tests use `page.setExtraHTTPHeaders({ Referer: url })` to inject the HTTP Referer header, which tests the server-side header processing (not browser `document.referrer`).
- Screenshots are saved in the `screenshots/` directory with the prefix matching the TC ID.

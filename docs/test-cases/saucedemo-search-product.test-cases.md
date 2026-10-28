# Sauce Demo Search Product: Grey Jacket

Updated: 2026-10-28. Test-case scope approved by user on 2026-10-28.
Requirements: Search Product Feature AC1-AC6 in `playwright-prompt.md`.
Target: https://sauce-demo.myshopify.com/. No login or HTTP authentication required.
Scope: frontend search only; no cart, checkout, CMS, or order submission.

## Live DOM Inspection

Inspected the homepage and populated search page on 2026-10-28. The search result
page has no `data-qa`, `data-testid`, or `data-test` attributes, including children.
Use only inspected semantic selectors, IDs, and scoped CSS/XPath fallbacks.

```html
<form action="/search" method="get" role="search">
  <input type="hidden" name="type" value="product">
  <input type="submit" id="search-submit">
  <input id="search-field" name="q" placeholder="Search" type="text">
</form>
<a href="/products/grey-jacket?..." id="product-1">
  <img alt="Grey jacket" class="product" src="...fleece_large.jpg...">
  <h3>Grey jacket</h3>
  <h4>GBP price</h4>
</a>
<a href="/products/brown-shades?..." id="product-4">
  <div class="sold-out">Sold Out</div>
  <img alt="Brown Shades" src="...">
  <h3>Brown Shades</h3>
  <h4>GBP price</h4>
</a>
```

There is a hidden mini-cart that may contain another product link; scope result
selectors to product-card anchors with direct h3 children. The Grey Jacket card
currently has name, image, price, and link, but no visible availability/status.
Do not treat the absence of Sold Out as a displayed In Stock label.
The live search also returned Noir jacket, Striped top, and Brown Shades.

## Test Cases And Traceability

Every case starts in an independent browser context on the homepage. Test data is
`Grey Jacket` unless specified. All checks use soft assertions; interactions use
SmartLocator with at least three meaningful selector strategies and descriptions.

| ID | AC | Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| TC-SP001 | AC1 | Fill header search; click its submit control. | Search results load, URL query matches input, Grey Jacket result is visible. | Implemented |
| TC-SP002 | AC2 | Search; inspect the Grey Jacket name, image, and price. | Name is present, image has nonempty source/alt and loads with positive natural width, GBP price is visible and positive. | Implemented |
| TC-SP003 | AC2 | Search; inspect the card for a visible availability/status indicator. | A nonempty availability/status label is shown. Current live DOM is missing this; report as a defect, not a pass. | Implemented |
| TC-SP004 | AC3 | Search; collect every displayed result product name. | Results are nonempty and relevant to Grey Jacket; report each unrelated product separately. | Implemented |
| TC-SP005 | AC4 | Search; capture result name/price; click the product. | Grey Jacket product URL loads; product name and price match the search card. | Implemented |
| TC-SP006 | AC5 | Record page errors and document response statuses during search; inspect visible alerts/errors. | No uncaught exceptions, failed document responses, visible error messages, or broken results page. Third-party request failures are not silently reclassified as application exceptions. | Implemented |
| TC-SP007 | AC6 | Measure from submitting search until the Grey Jacket result is displayed. | Duration is positive and within SEARCH_RESPONSE_BUDGET_MS, default 10000 ms. Budget is an explicit assumption because no SLA was supplied. | Implemented |
| TC-SP008 | AC1, AC4 | Enter the keyword and submit with Enter; follow result using keyboard activation. | Keyboard submission and product navigation work without mouse clicks. | Implemented |
| TC-SP009 | AC1 | Search for mixed-case `gReY jAcKeT`. | Query is submitted without corruption and the same product can be found. | Implemented |
| TC-ASP001 | Accessibility | Scan results with axe WCAG 2.1 AA; check the search input accessible name. | No axe violations and search input is named. Automated checks do not certify full screen-reader usability. | Implemented |
| TC-SP010 | Responsive | At desktop 1280x720 and mobile 390x844, search and inspect the card. | Search/result controls and product information are visible, with no horizontal page overflow. Attach screenshots. | Implemented |

Product-name and query assertions intentionally use the specific business data in
AC1/AC3/AC4. Other assertions prefer structural and attribute checks. Cross-browser
execution uses existing Playwright projects. No Figma design was supplied for this
feature, so responsive checks are not pixel-perfect typography/design comparisons.

## Execution And Evidence

Spec: `tests/specs/searchProductComponent.spec.ts`.
Component: `components/searchProductComponent.ts` extending BasePage.
URLs belong in `data/componentURL.ts` and are resolved through getComponentUrl/envUtils.
Attach page errors, document failures, and worker-local selector health per test.
The existing aggregate selector reporter can display zero because its singleton
is separate from Playwright workers; inspect per-test attachments as well.

```powershell
npm run test:search
npx playwright test tests/specs/searchProductComponent.spec.ts --project=firefox
npx playwright test tests/specs/searchProductComponent.spec.ts --project=webkit
```

## Website Comparison And Fix: 2026-10-28

Rechecked the live store in a fresh browser context after the user requested a
comparison of TC-SP003, TC-SP004, and TC-SP006. The user explicitly chose to keep
the original availability/relevance requirements and report storefront defects.

### TC-SP003: Confirmed Storefront Defect

The Grey Jacket result contains only its image, name, and price, with no visible
stock/status indicator. The public product data reports `available: true`, but
backend stock data is not a displayed frontend label and does not satisfy AC2.
Storefront fix required: render a visible, accessible availability/status indicator
for available products, not just the existing Sold Out badge for unavailable ones.
The assertion remains enabled and failing; no status label was fabricated by the test.

### TC-SP004: Confirmed Storefront Defect

Searching Grey Jacket still returns Grey jacket, Noir jacket, Striped top, and
Brown Shades. Product data checks found no Grey/Jacket keyword matches in Striped
top or Brown Shades title, tags, description, type, or vendor. Noir jacket matches
Jacket but not the complete requested product phrase. The approved strict relevance
check remains unchanged. Storefront fix required: review search matching and result
rendering so results satisfy the requested keyword relevance. This automation
repository cannot change the remote Shopify search/theme implementation.

### TC-SP006: Fixed Test Browser Configuration

The shared Chromium configuration supplied `--disable-web-security` and
`--allow-running-insecure-content`, unlike a normal browser. A fresh browser with
normal security produced no page exceptions, while the earlier configured tests
reported syntax errors. The search spec now overrides launchOptions at file scope
with the existing slowMo setting and no unsafe command-line arguments. Normal
browser protections are restored for this spec only. The shared configuration,
other suites, and all page-error/document-failure assertions are unchanged.
No errors are ignored, routes mocked, or tests skipped. TC-SP006 passed both its
focused rerun and the complete search-suite rerun.

## Latest Execution Results: 2026-10-28

Chromium: 12 executed, 9 passed, 3 failed, 0 skipped. The responsive case runs twice,
once per viewport. Structured results: `reports/search-product/results.json`.
HTML report: `reports/search-product/html/index.html`.

| Failed Test | Viewport | Expected | Actual |
| --- | --- | --- | --- |
| TC-SP003 | 1280x720 | Visible availability/status label | No qualifying label; empty array |
| TC-SP004 | 1280x720 | Every result relevant to Grey Jacket | Noir jacket, Striped top, and Brown Shades also returned; three separate soft failures |
| TC-ASP001 | 1280x720 | No WCAG 2.1 AA axe violations | `color-contrast` (3 targets), `link-name` (5 targets), `meta-viewport` (1 target) |

All five assertion failures across these three tests were extracted from the JSON
report and reconciled with its test counts. Functional cases ran at 1280x720;
responsive product-information cases passed at both 1280x720 and 390x844. These
results do not claim that every functional/accessibility case ran at mobile size.
Firefox and WebKit commands are provided but were not executed in this verification.

Measured search duration: 1251 ms against the approved default 10000 ms budget.
Worker selector evidence: 83 resolutions, zero fallbacks (100% primary success).
The aggregate selector-health HTML still reports zero because of the existing
cross-process singleton limitation; per-test attachments contain the actual data.
TypeScript editor diagnostics are clean. Scoped ESLint could not load because
`eslint.config.mjs` uses CommonJS `require` in ES-module scope; that unrelated file
was not changed. No site defect was skipped or converted into a passing assertion.
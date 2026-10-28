# Sauce Demo Add To Cart: Grey Jacket

Updated: 2026-10-28. Test-case scope approved by user on 2026-10-28.
Source: user request to add the Grey Jacket product to the Sauce Demo Shopify cart.
Target: https://sauce-demo.myshopify.com/products/grey-jacket.
Scope: product/add-to-cart/cart frontend behavior, not checkout or order submission.

## Prerequisites And DOM Inspection

The live product and populated cart were inspected on 2026-10-28 in an isolated
browser context, including a 390x844 cart viewport. No login, HTTP authentication,
or cookie acceptance was required. Every test starts with its own empty cart;
existing user carts are never cleared. Product identity and unit price are captured
from the page, rather than assuming a fixed catalog price.

No `data-qa`, `data-testid`, or `data-test` attributes exist on these pages,
including child elements. Do not invent testing attributes. Use SmartLocator
with at least three inspected fallback strategies and meaningful descriptions.

```html
<form id="product-form" action="/cart/add" method="post">
  <h1 itemprop="name">Grey jacket</h1>
  <h2 id="product-price"><span class="product-price">...</span></h2>
  <input id="add" type="submit" value="Add to Cart">
</form>
<a href="#" class="toggle-drawer cart desktop">My Cart <span>(0)</span></a>
<a href="/cart" class="cart mobile">My Cart <span>(0)</span></a>
<a href="/cart" class="checkout">Check Out</a>
<form action="/cart" method="post">
  <div class="row">
    <h3><a href="/collections/all/products/grey-jacket">Grey jacket - Grey jacket</a></h3>
    <img alt="Grey jacket - Grey jacket" src="...">
    <div class="price desktop">...</div>
    <input id="updates_611945025" name="updates[]" value="1">
    <div class="total desktop"><span>...</span></div>
  </div>
  <div class="cart total"><h2>Total ...</h2></div>
  <input id="checkout" name="checkout" value="Check Out" type="submit">
</form>
```

The add action POSTs to `/cart/add` or `/cart/add.js`; wait for its response before leaving the
product page. The desktop My Cart link opens a drawer, while the header /cart
link opens the full cart. The hidden mini-cart duplicates quantity IDs; scope
quantity and line assertions to `form:has(#checkout)`. Desktop price/line-total
columns are hidden on mobile; use the mobile price text and visible cart total
there. Optional notifications are not required because none was verified.

## Acceptance Scope And Test Cases

The following expectations are proposed for this feature: available Add to Cart
control; successful UI addition; correct header count; consistent product name,
image, unit price, quantity and totals; repeated-add aggregation; persistence
across navigation and refresh; keyboard access; no uncaught application errors.

| ID | Coverage | Steps | Expected Result | Status |
| --- | --- | --- | --- | --- |
| TC-ATC001 | Product controls | Open Grey Jacket; capture name/unit price; inspect Add to Cart and initial count. | Correct product, positive price, visible enabled add control, empty-cart count 0. | Implemented |
| TC-ATC002 | Single addition | Capture product; click Add to Cart once; await response/count; open cart. | Add response succeeds, count is 1, one Grey Jacket line has quantity 1 and matching unit price/image; cart total equals unit price. | Implemented |
| TC-ATC003 | Repeated addition | Add once, wait; add again, wait; open cart. | Count is 2, same product is aggregated into one line with quantity 2; total equals captured price times 2. | Implemented |
| TC-ATC004 | Refresh persistence | Add product; open cart; refresh. | Identity, quantity, pricing, and total remain unchanged. | Implemented |
| TC-ATC005 | Navigation persistence | Add product; open cart; revisit product; reopen cart. | Product and quantity remain in cart, no second add is needed. | Implemented |
| TC-ATC006 | Search integration | Use existing SearchProductComponent to find/open Grey Jacket; add; open cart. | Searched product name and price match the added cart item. Search relevance is tested separately in the search suite. | Implemented |
| TC-ATC007 | Keyboard addition | Activate Add to Cart with Enter; follow cart navigation with keyboard. | Same successful add and cart state as pointer interaction. | Implemented |
| TC-ATC008 | Error visibility | Capture uncaught page errors during product/add/cart flow; inspect visible alerts/errors. | No uncaught application exceptions or visible errors. Defects stay failing. | Implemented |
| TC-ATC009 | Performance | Time from add activation until response and visible count update. | Positive duration within ADD_TO_CART_BUDGET_MS, default 10000 ms. No business SLA was supplied; this is a configurable smoke budget. | Implemented |
| TC-AATC001 | Accessibility | Scan populated cart with axe WCAG 2.1 AA; check Add to Cart accessible name. | No axe violations, named add control. This is not a full manual accessibility audit. | Implemented |
| TC-ATC010 | Responsive | At desktop 1280x720 and mobile 390x844, add Grey Jacket; inspect cart. | Product/control visibility, quantity and totals remain correct; no horizontal overflow. Attach product/cart screenshots. | Implemented |

All assertions must be soft. Element interactions must resolve through SmartLocator,
including child elements. Product-name assertions use the specific requested test
data; other checks prefer structure, attributes, and captured numeric values.
No Figma baseline was supplied; responsive checks do not claim pixel-perfect styling.
Cross-browser execution uses existing Playwright projects.

## Execution

Component: `components/addToCartComponent.ts`, extending BasePage.
Spec: `tests/specs/addToCartComponent.spec.ts`.
Register the product URL in `data/componentURL.ts`; resolve via getComponentUrl/envUtils.
Attach actual worker selector health, page errors, add timings, and screenshots.
The existing aggregate selector reporter can display zero because its singleton
is separate from Playwright workers; inspect per-test attachments as well.

```powershell
npm run test:cart
npx playwright test tests/specs/addToCartComponent.spec.ts --project=firefox
npx playwright test tests/specs/addToCartComponent.spec.ts --project=webkit
```

## Verification Results: 2026-10-28

Chromium: 12 executed, 10 passed, 2 failed, 0 skipped. The responsive case runs
once for desktop and once for mobile. JSON: `reports/add-to-cart/results.json`.
HTML: `reports/add-to-cart/html/index.html`. Allure results were also generated.

| Failed Test | Viewport | Expected | Actual |
| --- | --- | --- | --- |
| TC-ATC008 | 1280x720 | No uncaught page errors | Two `Unexpected token '<'` errors and one null `description` error; visible-error and cart-details assertions passed |
| TC-AATC001 | 1280x720 | No axe WCAG 2.1 AA violations | `color-contrast` (4 targets), `label` (1 quantity-input target), `link-name` (5 social-link targets), `meta-viewport` (1 target) |

Both failed tests and their assertion arrays were extracted from the structured
report and reconciled with the summary. All other functional cases passed at
1280x720, and responsive add/cart checks passed at 1280x720 and 390x844. These
results do not claim that every functional/accessibility case ran at mobile size.
Firefox and WebKit have not been executed for this addition.

Measured add update: 2395 ms against the approved 10000 ms default budget.
Worker selector evidence: 154 resolutions, 2 expected mobile navigation fallbacks,
approximately 98.7% primary success. The mobile header uses My Cart instead of
the desktop Check Out link; the verified scoped CSS fallback handles this.
The visible cart has one unnamed quantity textbox and one Grey Jacket image;
role-based strategies avoid hidden mini-cart duplicates. Quantity ownership is
also asserted against the main form, and CSS/XPath alternatives remain scoped.
The aggregate selector-health report still shows zero because of its existing
cross-process singleton limitation; per-test attachments contain the actual data.

TypeScript editor diagnostics are clean. Scoped ESLint could not load because
`eslint.config.mjs` uses CommonJS `require` in ES-module scope; that unrelated
configuration was not modified. No live-site failure was skipped or suppressed.
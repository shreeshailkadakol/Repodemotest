# Sauce Demo Add to Cart (Grey Jacket) - Test Cases

**Component:** AddToCart  
**Test URL:** https://sauce-demo.myshopify.com/collections/all  
**Automated spec:** `tests/specs/addToCartComponent.spec.ts`  
**Page object:** `components/addToCartComponent.ts`  
**DOM inspection:** October 29, 2026

## Live DOM Findings

| Element | Observed selector |
|---|---|
| Catalog item | `a[id^="product-"]` (Grey jacket: `a[href$="/products/grey-jacket"]`, price in `h4`) |
| Product title / price | `h1[itemprop="name"]`, `#product-price .product-price` (£55.00) |
| Description | `#product-info [itemprop="description"]` |
| Add to Cart | `form#product-form input#add` (posts to `/cart/add`) |
| Cart indicator | `#cart-target-desktop` (e.g. `(1)`) |
| Cart row | `#cart .row`, name `.info h3 a`, qty `input[name="updates[]"]` |
| Cart actions | `.continue-shopping a`, `input#checkout` |

The product is named "Grey jacket"; the cart title renders as "Grey jacket - Grey jacket". Tests match case-insensitively and by containment. No test submits Checkout.

## Acceptance Criteria Coverage

| AC | Test | Status |
|---|---|---|
| AC1 Catalog displays products | TC-AC-01 | Implemented |
| AC2 Grey Jacket visible/selectable | TC-AC-02 | Implemented |
| AC3 Product page opens | TC-AC-03 | Implemented |
| AC4 Product information | TC-AC-04 | Implemented |
| AC5 Add to cart | TC-AC-05, TC-AC-06 | Implemented |
| AC6 Cart indicator | TC-AC-05 | Implemented |
| AC7 Product in cart | TC-AC-06 | Implemented |
| AC8 Information consistency | TC-AC-07 | Implemented |
| AC9 Continue shopping / checkout | TC-AC-08 | Implemented (checkout availability only) |
| AC10 Error-free experience | TC-AC-09, TC-AAC-01 | Implemented; see findings |

## Automated Test Cases

| ID | Title | Tags |
|---|---|---|
| TC-AC-01 | Catalog displays available products | @Functional @Smoke |
| TC-AC-02 | Grey Jacket is visible and selectable in the catalog | @Functional @Smoke |
| TC-AC-03 | Selecting Grey Jacket opens its product page | @Functional |
| TC-AC-04 | Product page shows name, image, description, price, Add to Cart | @Functional |
| TC-AC-05 | Adding Grey Jacket updates the cart indicator (0 to 1) | @Functional @Smoke |
| TC-AC-06 | Cart shows name, price (£55.00), quantity (1), image | @Functional |
| TC-AC-07 | Catalog price, product page and cart name/price/total match | @Functional |
| TC-AC-08 | Cart offers continue shopping (returns to catalog) and enabled checkout | @Functional |
| TC-AC-09 | Journey completes with no page errors, 4xx/5xx same-site responses or error text | @Functional |
| TC-AAC-01 | Product page passes axe WCAG 2 A/AA scan | @Accessibility |

## Known Findings

- **TC-AAC-01 fails against the live site:** axe reports violations such as `link-name` (social icon links), `meta-viewport`, `select-name` (`#product-select-option-0`) and others. These are site defects, not test defects.
- **Intermittent site script error:** `Cannot read properties of null (reading 'description')` is thrown by the store's third-party Sauce script on some loads. TC-AC-09 filters this one message so the test is not flaky; remove the filter if the site is fixed.
- The test store is shared and external; product price/stock can change and would break the price assertions.

# Sauce Demo Cart Header, Cart Page and Checkout - Test Cases

**Component:** CartCheckout  
**Test URL:** https://sauce-demo.myshopify.com/collections/all  
**Automated spec:** `tests/specs/cartCheckoutComponent.spec.ts`  
**Page object:** `components/cartCheckoutComponent.ts` (extends `AddToCartComponent`)  
**DOM inspection:** October 29, 2026

## Live DOM Findings

| Element | Observed selector |
|---|---|
| Header cart link (desktop) | `#minicart a.cart.desktop` (`href="#"`, opens the `#drawer` mini-cart) |
| Header cart link (mobile) | `#minicart a.cart.mobile` (`href="/cart"`) |
| Header Check Out link | `#minicart a.checkout` (`href="/cart"`, desktop only) |
| Mini-cart drawer | `#drawer`, item name `.info h3 a` |
| Cart page | `/cart`: `section#cart`, checkout button `input#checkout` |
| Checkout page | `/checkouts/...`, title "Checkout - Sauce Demo", `input[name="email"]`, total in `span.notranslate` |

The header renders a desktop or mobile cart link depending on viewport. Selecting the cart opens a drawer on desktop and navigates to `/cart` on mobile; the tests branch on which link is visible. The drawer only offers a Check Out submit, so desktop reaches the cart page through the header Check Out link. The cart is seeded through `/cart/add.js` to avoid the store's rate-limited UI add. No test submits the checkout form.

## Automated Test Cases

| ID | Title | Tags |
|---|---|---|
| TC-CC-01 | Header shows the cart link with an empty count | @Functional @Smoke |
| TC-CC-02 | Header cart count updates after an item is added | @Functional @Smoke |
| TC-CC-03 | Selecting the header cart shows the added item (drawer on desktop, cart page on mobile) | @Functional |
| TC-CC-04 | Header navigates to the cart page | @Functional @Smoke |
| TC-CC-05 | Cart page shows price, quantity, total and an enabled checkout button | @Functional |
| TC-CC-06 | Proceeding to checkout opens the checkout page (URL and title) | @Functional @Smoke |
| TC-CC-07 | Checkout page shows the contact email field and the £55.00 order total | @Functional |
| TC-CC-08 | Empty cart page offers no checkout button | @Functional |

## Known Findings

- The test store is shared and external; price changes would break the £55.00 assertions.
- The checkout page is Shopify-hosted and its generated class names are obfuscated; the total locator relies on the stable `notranslate` class and may need updating if Shopify changes it.
- Seeding the cart can hit transient network resets; the seed retries for up to 20s.

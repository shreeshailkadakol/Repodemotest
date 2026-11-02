# Sauce Demo Sanity Journey - Test Cases

**Component:** Sanity  
**Automated spec:** `tests/specs/endtoendsauceDemoTesting.spec.ts`  
**Page object:** `components/endtoendsauceDemoTesting.ts` (composes `LoginComponent`, `CartCheckoutComponent` and `PaymentComponent`)  
**Run:** `npm run test:sanity` (`@Sanity`)

## Journey

| Stage | Method | Site | Verifies |
|---|---|---|---|
| 1. Login | `loginAsStandardUser` | saucedemo.com | Login UI available; `standard_user` lands on `inventory.html` with the product list |
| 2. Add to cart | `selectProductAndAddToCart` | sauce-demo.myshopify.com | Catalog has products; Grey Jacket page details; header count 0 -> 1 |
| 3. Cart | `verifyCartFromHeader` | sauce-demo.myshopify.com | Header leads to `/cart`; name, £55.00 price, quantity 1, total, enabled checkout |
| 4. Checkout | `proceedToCheckout` | sauce-demo.myshopify.com | Checkout page URL/title, contact email field, £55.00 order total |
| 5. Payment section | `verifyPaymentSection` | sauce-demo.myshopify.com | Payment heading, Test Payment Gateway option, card number field, Pay now shows £55.00 |
| 6. Pay | `payWithValidCard` | sauce-demo.myshopify.com | Delivery details and card `1` accepted; lands on thank-you URL with order confirmation heading |

| ID | Title | Tags |
|---|---|---|
| TC-S01 | Login, add to cart, verify cart, checkout and pay | @Sanity @Smoke |

## Known Limitations

- Login and shopping are on two different sites with no shared session, so login is verified as its own stage rather than gating the cart.
- The final stage submits a test order through Shopify's Test Payment Gateway (card `1`); declined-card and empty-submit paths are covered only in `saucedemo-payment.test-cases.md`.
- The test sets a 240s timeout because the Shopify-hosted checkout and card iframes are slow.
- The Shopify store rate-limits repeated adds (429); avoid running the full browser matrix repeatedly in a short time.
